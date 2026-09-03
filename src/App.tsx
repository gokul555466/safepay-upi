import React, { useState, useEffect, useRef } from 'react';
import {
  ScreenType,
  User,
  TrustedContact,
  Payee,
  Transaction,
  UtilityBill,
  RiskEvaluation,
  RiskTier,
} from './types';
import {
  initialUser,
  initialTrustedContact,
  initialPayees,
  initialTransactions,
  initialBills,
} from './data/initialData';
import { evaluateTransaction, formatSimulatedTime } from './utils/riskEngine';
import { stopSpeech } from './utils/speech';

import { GPayHeader } from './components/GPayHeader';
import { SafeModeBanner } from './components/SafeModeBanner';
import { SafeModeScreen } from './components/SafeModeScreen';
import { GPayActionsGrid } from './components/GPayActionsGrid';
import { GPayPeopleSection } from './components/GPayPeopleSection';
import { GPayManageMoneySection } from './components/GPayManageMoneySection';
import { GPayDirectPaymentModal } from './components/GPayDirectPaymentModal';
import { NewContactWarningModal } from './components/NewContactWarningModal';
import { ShieldRequirementModal } from './components/ShieldRequirementModal';
import { RechargeScreen } from './components/RechargeScreen';
import { CheckBalanceModal } from './components/CheckBalanceModal';
import { TransactionHistoryScreen } from './components/TransactionHistoryScreen';
import { PayToNumberScreen } from './components/PayToNumberScreen';
import { ScanQRScreen } from './components/ScanQRScreen';
import { BillsScreen } from './components/BillsScreen';
import { InterventionsModal } from './components/InterventionsModal';
import { TrustedContactDrawer } from './components/TrustedContactDrawer';
import { CircuitBreakerModal } from './components/CircuitBreakerModal';
import { SuccessBlockedModal } from './components/SuccessBlockedModal';
import { UpiPinModal } from './components/UpiPinModal';
import { PaymentLockedModal } from './components/PaymentLockedModal';

export default function App() {
  // Safe Mode Toggle state (Default true: Safe Mode is the default mode)
  const [isSafeMode, setIsSafeMode] = useState<boolean>(true);

  // Navigation & Core State (Default starts on safe_mode_page)
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('safe_mode_page');
  const [user] = useState<User>(initialUser);
  const [trustedContact] = useState<TrustedContact>(initialTrustedContact);
  const [payees, setPayees] = useState<Payee[]>(initialPayees);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [bills, setBills] = useState<UtilityBill[]>(initialBills);
  const [balance, setBalance] = useState<number>(24850);

  // Time Simulation (Normal Hours: 2:30 PM, Night: 10:30 PM)
  const [simulatedTimeHour, setSimulatedTimeHour] = useState<number>(14); // 14 = 2:30 PM
  const [isLargeText, setIsLargeText] = useState<boolean>(false);

  // UPI PIN (1122) & 3-Attempt 5-Minute Lockout State
  const [failedPinAttempts, setFailedPinAttempts] = useState<number>(0);
  const [pinLockoutExpiry, setPinLockoutExpiry] = useState<number | null>(null);
  const [lockoutRemainingSeconds, setLockoutRemainingSeconds] = useState<number>(0);
  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);
  const [isPaymentLockedModalOpen, setIsPaymentLockedModalOpen] = useState<boolean>(false);
  const [pendingPinPayment, setPendingPinPayment] = useState<{
    payeeName: string;
    payeeUpi: string;
    amount: number;
    displayLabel: string;
    category: string;
    riskTier: RiskTier;
  } | null>(null);

  // Drawer Alert Mode ('shield_approval' or 'pin_lockout')
  const [trustedDrawerAlertMode, setTrustedDrawerAlertMode] = useState<
    'shield_approval' | 'pin_lockout'
  >('shield_approval');

  // Modals state
  const [selectedContactForGPay, setSelectedContactForGPay] = useState<Payee | null>(null);
  const [isCheckBalanceOpen, setIsCheckBalanceOpen] = useState<boolean>(false);
  const [isNewContactWarningOpen, setIsNewContactWarningOpen] = useState<boolean>(false);
  const [isShieldRequirementOpen, setIsShieldRequirementOpen] = useState<boolean>(false);
  const [isTrustedContactDrawerOpen, setIsTrustedContactDrawerOpen] = useState<boolean>(false);
  const [isCircuitBreakerOpen, setIsCircuitBreakerOpen] = useState<boolean>(false);
  const [isInterventionModalOpen, setIsInterventionModalOpen] = useState<boolean>(false);

  // Pending payment holding state
  const [newContactPendingData, setNewContactPendingData] = useState<{
    payeeName: string;
    payeeUpi: string;
    amount: number;
    registeredBankName?: string;
    isDefault?: boolean;
  } | null>(null);

  const [pendingTx, setPendingTx] = useState<{
    payeeName: string;
    payeeUpi: string;
    amount: number;
    registeredBankName?: string;
    hasMismatch?: boolean;
    displayLabel: string;
    category: string;
  } | null>(null);

  const [currentEvaluation, setCurrentEvaluation] = useState<RiskEvaluation | null>(null);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(15);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Prefill state for Pay to Number screen
  const [prefillPayee, setPrefillPayee] = useState<{
    name: string;
    upi: string;
    amount: number;
    hasMismatch?: boolean;
    isDefault?: boolean;
  } | null>(null);

  // Result dialog modal
  const [resultModal, setResultModal] = useState<{
    type: 'success' | 'blocked_contact' | 'cancelled_user';
    payeeName: string;
    amount: number;
  } | null>(null);

  // 5-Minute Lockout Timer Effect
  useEffect(() => {
    if (!pinLockoutExpiry) {
      setLockoutRemainingSeconds(0);
      return;
    }

    const updateTimer = () => {
      const diff = Math.max(0, Math.ceil((pinLockoutExpiry - Date.now()) / 1000));
      setLockoutRemainingSeconds(diff);
      if (diff <= 0) {
        setPinLockoutExpiry(null);
        setFailedPinAttempts(0);
        setIsPaymentLockedModalOpen(false);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [pinLockoutExpiry]);

  // Safe Mode Toggle Handler:
  // USER GOAL: "if I ON the safe mode then it must redirect into a new page and in that consist only the 4 options"
  const handleToggleSafeMode = () => {
    if (!isSafeMode) {
      setIsSafeMode(true);
      setCurrentScreen('safe_mode_page');
    } else {
      setIsSafeMode(false);
      setCurrentScreen('home');
    }
  };

  // Helper for returning back to home or safe mode page
  const navigateBack = () => {
    if (isSafeMode) {
      setCurrentScreen('safe_mode_page');
    } else {
      setCurrentScreen('home');
    }
  };

  // Toggle Time simulation between Daytime (14:30) and Night (22:30 > 10:00 PM)
  const toggleTimeSimulation = () => {
    setSimulatedTimeHour((prev) => (prev === 14 ? 22 : 14));
  };

  // Trigger 5-Minute Security Lockout (Called when PIN is wrong 3 times)
  const handleTriggerPinLockout = () => {
    const lockExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
    setPinLockoutExpiry(lockExpiry);
    setLockoutRemainingSeconds(300);
    setFailedPinAttempts(3);

    // Close any other open modals
    setIsPinModalOpen(false);
    setIsCheckBalanceOpen(false);
    setIsInterventionModalOpen(false);
    setIsShieldRequirementOpen(false);
    setIsNewContactWarningOpen(false);

    // Show Payment Locked Modal to user
    setIsPaymentLockedModalOpen(true);

    // Send emergency alert message to Shield Person (Priya) -> open Companion Phone
    setTrustedDrawerAlertMode('pin_lockout');
    setIsTrustedContactDrawerOpen(true);
  };

  // Behavioral Circuit Breaker
  const handleTriggerCircuitBreaker = () => {
    stopSpeech();
    setIsCircuitBreakerOpen(true);
  };

  const handleResolveCircuitBreaker = () => {
    setIsCircuitBreakerOpen(false);
  };

  const handleEmergencyAbortFromCircuit = () => {
    setIsCircuitBreakerOpen(false);
    navigateBack();
  };

  // Execute payment completion after PIN is verified
  const finalizeCompletedPayment = (
    payeeName: string,
    payeeUpi: string,
    amount: number,
    displayLabel: string,
    category: string,
    riskTier: RiskTier = 'LOW'
  ) => {
    stopSpeech();
    setIsPinModalOpen(false);
    setIsInterventionModalOpen(false);
    setIsTrustedContactDrawerOpen(false);
    setIsShieldRequirementOpen(false);
    setIsNewContactWarningOpen(false);
    setSelectedContactForGPay(null);
    setPendingPinPayment(null);

    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }

    // Deduct balance
    const newBalance = Math.max(0, balance - amount);
    setBalance(newBalance);

    // Record completed transaction
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      payeeName,
      payeeUpi,
      amount,
      timestamp: new Date().toISOString(),
      displayLabel,
      category,
      status: 'completed',
      riskTier,
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Show success modal
    setResultModal({
      type: 'success',
      payeeName,
      amount,
    });
  };

  // Request PIN before payment execution
  const requirePinForPayment = (
    payeeName: string,
    payeeUpi: string,
    amount: number,
    displayLabel: string,
    category: string,
    riskTier: RiskTier = 'LOW'
  ) => {
    // Check if account is currently locked out for 5 minutes
    if (lockoutRemainingSeconds > 0) {
      setIsPaymentLockedModalOpen(true);
      return;
    }

    setPendingPinPayment({
      payeeName,
      payeeUpi,
      amount,
      displayLabel,
      category,
      riskTier,
    });
    setIsPinModalOpen(true);
  };

  // Cancel payment by user
  const cancelPaymentByUser = (reason: string) => {
    stopSpeech();
    setIsPinModalOpen(false);
    setIsInterventionModalOpen(false);
    setIsTrustedContactDrawerOpen(false);
    setIsShieldRequirementOpen(false);
    setIsNewContactWarningOpen(false);
    setSelectedContactForGPay(null);

    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }

    const txToCancel = pendingTx || newContactPendingData;
    if (txToCancel) {
      const cancelledTx: Transaction = {
        id: `tx-cancel-${Date.now()}`,
        payeeName: txToCancel.payeeName,
        payeeUpi: txToCancel.payeeUpi,
        amount: txToCancel.amount,
        timestamp: new Date().toISOString(),
        displayLabel: `Cancelled: ${txToCancel.payeeName}`,
        category: 'personal',
        status: 'cancelled_user',
        riskTier: currentEvaluation?.tier || 'LOW',
      };
      setTransactions((prev) => [cancelledTx, ...prev]);

      setResultModal({
        type: 'cancelled_user',
        payeeName: txToCancel.payeeName,
        amount: txToCancel.amount,
      });
    }
  };

  // Block payment by Trusted Contact (Priya tapping "This Looks Wrong")
  const abortByTrustedContact = () => {
    stopSpeech();
    setIsPinModalOpen(false);
    setIsInterventionModalOpen(false);
    setIsTrustedContactDrawerOpen(false);
    setIsShieldRequirementOpen(false);
    setIsNewContactWarningOpen(false);
    setSelectedContactForGPay(null);

    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }

    const txToBlock = pendingTx || newContactPendingData;
    if (txToBlock) {
      const blockedTx: Transaction = {
        id: `tx-block-${Date.now()}`,
        payeeName: txToBlock.payeeName,
        payeeUpi: txToBlock.payeeUpi,
        amount: txToBlock.amount,
        timestamp: new Date().toISOString(),
        displayLabel: `Blocked by Priya (Shield): ${txToBlock.payeeName}`,
        category: 'personal',
        status: 'blocked_contact',
        riskTier: 'CRITICAL',
        riskReasons: currentEvaluation?.shieldReasons || ['Shield Guardian stopped transfer'],
      };
      setTransactions((prev) => [blockedTx, ...prev]);

      setResultModal({
        type: 'blocked_contact',
        payeeName: txToBlock.payeeName,
        amount: txToBlock.amount,
      });
    }
  };

  // Stage 2: Evaluate transaction and check Shield requirement (>5000 or >10:00 PM)
  const proceedToShieldOrPayment = (
    payeeName: string,
    payeeUpi: string,
    amount: number,
    registeredBankName: string = '',
    hasMismatch: boolean = false,
    category: string = 'personal',
    isDefaultContact: boolean = false
  ) => {
    const timestamp = new Date().toISOString();
    const evaluation = evaluateTransaction(payeeName, payeeUpi, amount, timestamp, {
      history: transactions,
      simulatedTimeHour,
      enteredName: payeeName,
      registeredBankName: registeredBankName || payeeName,
      hasNameMismatch: hasMismatch,
      isDefaultContact,
    });

    setCurrentEvaluation(evaluation);

    const txDetails = {
      payeeName,
      payeeUpi,
      amount,
      registeredBankName,
      hasMismatch,
      displayLabel: `Sent to ${payeeName}`,
      category,
    };
    setPendingTx(txDetails);

    // USER REQUIREMENT:
    // If amount > 5,000 OR simulated time above 10:00 PM
    // It must say that the request from the shield is required and the message must be sent to that shield person.
    if (evaluation.requiresShield) {
      setIsShieldRequirementOpen(true);
      setTrustedDrawerAlertMode('shield_approval');
      setIsTrustedContactDrawerOpen(true);
      return;
    }

    // Otherwise route based on Tier
    if (evaluation.tier === 'CRITICAL') {
      setCountdownSeconds(15);
      setIsInterventionModalOpen(true);
      setTrustedDrawerAlertMode('shield_approval');
      setIsTrustedContactDrawerOpen(true);
    } else if (evaluation.tier === 'HIGH' || evaluation.tier === 'MEDIUM') {
      setIsInterventionModalOpen(true);
    } else {
      // Prompt UPI PIN (1122)
      requirePinForPayment(payeeName, payeeUpi, amount, `Sent to ${payeeName}`, category, 'LOW');
    }
  };

  // Stage 1: Initiating payment
  // If payment is locked due to 3 wrong PIN attempts, block instantly.
  const handleInitiatePayment = (
    payeeName: string,
    payeeUpi: string,
    amount: number,
    registeredBankName: string = '',
    hasMismatch: boolean = false,
    isDefault?: boolean
  ) => {
    if (lockoutRemainingSeconds > 0) {
      setIsPaymentLockedModalOpen(true);
      return;
    }

    // Check whether this contact is in the default contacts
    const isDefaultContact =
      isDefault !== undefined
        ? isDefault
        : payees.some(
            (p) =>
              p.isDefaultContact &&
              (p.phoneOrUpi.toLowerCase() === payeeUpi.toLowerCase() ||
                p.name.toLowerCase() === payeeName.toLowerCase())
          );

    // If NOT in default contacts:
    if (!isDefaultContact) {
      setNewContactPendingData({
        payeeName,
        payeeUpi,
        amount,
        registeredBankName,
        isDefault: false,
      });
      // Show popup message: "The contact is new, are you sure you want to pay for them?"
      setIsNewContactWarningOpen(true);
      return;
    }

    // If it IS in default contacts, proceed immediately without new contact popup/wait
    proceedToShieldOrPayment(
      payeeName,
      payeeUpi,
      amount,
      registeredBankName,
      hasMismatch,
      'personal',
      true
    );
  };

  // User confirmed "Yes, Proceed" in New Contact popup and the 15-second wait completed:
  const handleProceedAfterNewContactWait = () => {
    setIsNewContactWarningOpen(false);
    if (!newContactPendingData) return;

    const { payeeName, payeeUpi, amount, registeredBankName } = newContactPendingData;
    proceedToShieldOrPayment(
      payeeName,
      payeeUpi,
      amount,
      registeredBankName,
      false,
      'personal',
      false
    );
  };

  // Mobile Recharge Execution
  const handleExecuteRecharge = (
    phone: string,
    operator: string,
    amount: number,
    planDesc: string
  ) => {
    if (lockoutRemainingSeconds > 0) {
      setIsPaymentLockedModalOpen(true);
      return;
    }

    requirePinForPayment(
      `${operator} (${phone})`,
      phone,
      amount,
      `Mobile Recharge: ${planDesc}`,
      'utilities',
      'LOW'
    );
  };

  // QR Selection handler
  const handleSelectQRPayee = (
    name: string,
    upi: string,
    defaultAmount: number,
    isScamScenario: boolean
  ) => {
    if (isScamScenario) {
      setSimulatedTimeHour(22); // Night time
    }
    handleInitiatePayment(name, upi, defaultAmount, name, isScamScenario, false);
    navigateBack();
  };

  // Pay Utility Bill handler
  const handlePayBill = (bill: UtilityBill) => {
    handleInitiatePayment(
      bill.billerName,
      bill.consumerId,
      bill.amount,
      bill.billerName,
      false,
      true
    );
    setBills((prev) =>
      prev.map((b) => (b.id === bill.id ? { ...b, status: 'paid', dueDate: 'Paid today' } : b))
    );
  };

  // Check Balance Handler (Checks for 5-minute lockout)
  const handleOpenCheckBalance = () => {
    if (lockoutRemainingSeconds > 0) {
      setIsPaymentLockedModalOpen(true);
      return;
    }
    setIsCheckBalanceOpen(true);
  };

  return (
    <div
      className={`min-h-screen bg-[#f8fafd] text-slate-900 font-sans flex flex-col justify-between selection:bg-blue-200 ${
        isLargeText ? 'text-lg' : 'text-base'
      }`}
    >
      {/* 1. Google Pay Header */}
      <GPayHeader
        user={user}
        trustedContact={trustedContact}
        isSafeMode={isSafeMode}
        onToggleSafeMode={handleToggleSafeMode}
        simulatedTimeHour={simulatedTimeHour}
        onToggleTimeSimulation={toggleTimeSimulation}
        isLargeText={isLargeText}
        onToggleTextSize={() => setIsLargeText(!isLargeText)}
        onOpenScan={() => setCurrentScreen('scan')}
        onOpenSearch={() => setCurrentScreen('pay_anyone')}
      />

      {/* 2. Main Content Container */}
      <main className="flex-1 max-w-xl w-full mx-auto px-3.5 sm:px-4 py-4 pb-20 space-y-4">
        {/* Screen: DEDICATED SAFE MODE PAGE (Contains ONLY the 4 options + Transaction History) */}
        {currentScreen === 'safe_mode_page' && (
          <SafeModeScreen
            trustedContact={trustedContact}
            transactions={transactions}
            onSelectScanQR={() => setCurrentScreen('scan')}
            onSelectRecharge={() => setCurrentScreen('recharge')}
            onSelectPayAnyone={() => setCurrentScreen('pay_anyone')}
            onSelectCheckBalance={handleOpenCheckBalance}
            onViewAllHistory={() => setCurrentScreen('history')}
            onExitSafeMode={() => {
              setIsSafeMode(false);
              setCurrentScreen('home');
            }}
            lockoutRemainingSeconds={lockoutRemainingSeconds}
          />
        )}

        {/* Screen: NORMAL HOME (Google Pay Interface when Safe Mode is OFF) */}
        {currentScreen === 'home' && (
          <div className="space-y-4">
            {/* Safe Mode Toggle Banner Card */}
            <SafeModeBanner
              isSafeMode={isSafeMode}
              onToggleSafeMode={handleToggleSafeMode}
              trustedContact={trustedContact}
            />

            {/* Google Pay Actions Grid */}
            <GPayActionsGrid
              isSafeMode={isSafeMode}
              onSelectPayAnyone={() => setCurrentScreen('pay_anyone')}
              onSelectRecharge={() => setCurrentScreen('recharge')}
              onSelectScanQR={() => setCurrentScreen('scan')}
              onSelectBills={() => setCurrentScreen('bills')}
            />

            {/* People Section (8 Default Account Contacts + New Person) */}
            <GPayPeopleSection
              contacts={payees}
              onSelectContact={(contact) => setSelectedContactForGPay(contact)}
              onPayNewContact={() => setCurrentScreen('pay_anyone')}
            />

            {/* Manage Your Money Section (Check bank balance & transaction history) */}
            <GPayManageMoneySection
              onCheckBalance={handleOpenCheckBalance}
              onViewHistory={() => setCurrentScreen('history')}
            />
          </div>
        )}

        {/* Screen: PAY ANYONE (Mobile number, UPI ID, or Search) */}
        {currentScreen === 'pay_anyone' && (
          <PayToNumberScreen
            historicalPayees={payees}
            onInitiatePayment={(name, upi, amt, bankName, hasMismatch, isDefault) => {
              handleInitiatePayment(name, upi, amt, bankName, hasMismatch, isDefault);
              navigateBack();
            }}
            onTriggerCircuitBreaker={handleTriggerCircuitBreaker}
            prefillPayee={prefillPayee}
            onBack={navigateBack}
          />
        )}

        {/* Screen: RECHARGE ONLY (Mobile Prepaid & DTH) */}
        {currentScreen === 'recharge' && (
          <RechargeScreen onBack={navigateBack} onExecuteRecharge={handleExecuteRecharge} />
        )}

        {/* Screen: SCAN QR */}
        {currentScreen === 'scan' && (
          <ScanQRScreen
            onSelectQRPayee={handleSelectQRPayee}
            onCancel={navigateBack}
          />
        )}

        {/* Screen: BILLS */}
        {currentScreen === 'bills' && (
          <BillsScreen
            bills={bills}
            onPayBill={(b) => {
              handlePayBill(b);
              navigateBack();
            }}
          />
        )}

        {/* Screen: TRANSACTION HISTORY */}
        {currentScreen === 'history' && (
          <TransactionHistoryScreen transactions={transactions} onBack={navigateBack} />
        )}
      </main>

      {/* 3. Direct Google Pay bottom sheet for tapping a Contact from People */}
      {selectedContactForGPay && (
        <GPayDirectPaymentModal
          isOpen={Boolean(selectedContactForGPay)}
          contact={selectedContactForGPay}
          onClose={() => setSelectedContactForGPay(null)}
          onSubmitPayment={(name, upi, amt, bankName, isDefault) => {
            setSelectedContactForGPay(null);
            handleInitiatePayment(name, upi, amt, bankName, false, isDefault);
          }}
        />
      )}

      {/* 4. New Contact Warning Modal (Popup + 10-15s safety wait) */}
      {isNewContactWarningOpen && newContactPendingData && (
        <NewContactWarningModal
          isOpen={isNewContactWarningOpen}
          payeeName={newContactPendingData.payeeName}
          payeeUpi={newContactPendingData.payeeUpi}
          amount={newContactPendingData.amount}
          onProceedAfterWait={handleProceedAfterNewContactWait}
          onCancel={cancelPaymentByUser}
        />
      )}

      {/* 5. Shield Requirement Modal (>5000 or >10:00 PM) */}
      {isShieldRequirementOpen && pendingTx && (
        <ShieldRequirementModal
          isOpen={isShieldRequirementOpen}
          payeeName={pendingTx.payeeName}
          payeeUpi={pendingTx.payeeUpi}
          amount={pendingTx.amount}
          simulatedTimeHour={simulatedTimeHour}
          trustedContact={trustedContact}
          onOpenCompanionPhone={() => {
            setTrustedDrawerAlertMode('shield_approval');
            setIsTrustedContactDrawerOpen(true);
          }}
          onCancel={cancelPaymentByUser}
        />
      )}

      {/* 6. Dual-Screen: Trusted Contact Phone Simulation (Priya's Phone) */}
      {isTrustedContactDrawerOpen && (
        <TrustedContactDrawer
          isOpen={isTrustedContactDrawerOpen}
          trustedContact={trustedContact}
          payeeName={pendingTx?.payeeName || newContactPendingData?.payeeName || 'recipient'}
          amount={pendingTx?.amount || newContactPendingData?.amount || 0}
          remainingSeconds={countdownSeconds}
          shieldReasons={currentEvaluation?.shieldReasons}
          alertMode={trustedDrawerAlertMode}
          onBlockTransaction={abortByTrustedContact}
          onApproveTransaction={() => {
            setIsTrustedContactDrawerOpen(false);
            setIsShieldRequirementOpen(false);
            if (pendingTx) {
              requirePinForPayment(
                pendingTx.payeeName,
                pendingTx.payeeUpi,
                pendingTx.amount,
                pendingTx.displayLabel,
                pendingTx.category,
                currentEvaluation?.tier || 'HIGH'
              );
            }
          }}
          onDismissPreview={() => setIsTrustedContactDrawerOpen(false)}
          onClose={() => setIsTrustedContactDrawerOpen(false)}
        />
      )}

      {/* 7. Multi-Tier Intervention Modals (Medium, High, Critical) */}
      {isInterventionModalOpen && currentEvaluation && pendingTx && (
        <InterventionsModal
          isOpen={isInterventionModalOpen}
          tier={currentEvaluation.tier}
          evaluation={currentEvaluation}
          payeeName={pendingTx.payeeName}
          payeeUpi={pendingTx.payeeUpi}
          amount={pendingTx.amount}
          trustedContact={trustedContact}
          countdownSeconds={countdownSeconds}
          onConfirmPayment={() =>
            requirePinForPayment(
              pendingTx.payeeName,
              pendingTx.payeeUpi,
              pendingTx.amount,
              pendingTx.displayLabel,
              pendingTx.category,
              currentEvaluation.tier
            )
          }
          onCancelPayment={cancelPaymentByUser}
        />
      )}

      {/* 8. Bank Balance Modal (Requires PIN 1122, 3 attempts lock) */}
      <CheckBalanceModal
        isOpen={isCheckBalanceOpen}
        balance={balance}
        failedAttempts={failedPinAttempts}
        onIncorrectPin={(newCount) => setFailedPinAttempts(newCount)}
        onPinLockout={handleTriggerPinLockout}
        onClose={() => setIsCheckBalanceOpen(false)}
      />

      {/* 9. UPI PIN Verification Modal (1122, 3 attempts triggers 5-min lock) */}
      {isPinModalOpen && pendingPinPayment && (
        <UpiPinModal
          isOpen={isPinModalOpen}
          purpose="payment"
          amount={pendingPinPayment.amount}
          payeeName={pendingPinPayment.payeeName}
          failedAttempts={failedPinAttempts}
          onSuccess={() => {
            setFailedPinAttempts(0);
            finalizeCompletedPayment(
              pendingPinPayment.payeeName,
              pendingPinPayment.payeeUpi,
              pendingPinPayment.amount,
              pendingPinPayment.displayLabel,
              pendingPinPayment.category,
              pendingPinPayment.riskTier
            );
          }}
          onIncorrectPin={(newCount) => setFailedPinAttempts(newCount)}
          onLockout={handleTriggerPinLockout}
          onCancel={() => {
            setIsPinModalOpen(false);
            setPendingPinPayment(null);
          }}
        />
      )}

      {/* 10. 5-Minute Payment Locked Modal (Shown on 3 wrong PIN attempts) */}
      <PaymentLockedModal
        isOpen={isPaymentLockedModalOpen}
        remainingSeconds={lockoutRemainingSeconds}
        trustedContact={trustedContact}
        onViewShieldPhone={() => {
          setTrustedDrawerAlertMode('pin_lockout');
          setIsTrustedContactDrawerOpen(true);
        }}
        onClose={() => setIsPaymentLockedModalOpen(false)}
      />

      {/* 11. Behavioral Circuit Breaker Modal */}
      <CircuitBreakerModal
        isOpen={isCircuitBreakerOpen}
        onResolve={handleResolveCircuitBreaker}
        onEmergencyAbort={handleEmergencyAbortFromCircuit}
        trustedContactName={trustedContact.name}
        trustedContactPhone={trustedContact.phone}
      />

      {/* 12. Success / Blocked Feedback Dialog */}
      {resultModal && (
        <SuccessBlockedModal
          type={resultModal.type}
          payeeName={resultModal.payeeName}
          amount={resultModal.amount}
          remainingBalance={balance}
          contactName={trustedContact.name}
          onClose={() => setResultModal(null)}
        />
      )}
    </div>
  );
}
