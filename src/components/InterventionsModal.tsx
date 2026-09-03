import React, { useEffect, useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Volume2,
  VolumeX,
  XCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { RiskEvaluation, RiskTier, TrustedContact } from '../types';
import { formatRupees } from '../utils/riskEngine';
import { speakText, stopSpeech } from '../utils/speech';

interface InterventionsModalProps {
  isOpen: boolean;
  tier: RiskTier;
  evaluation: RiskEvaluation;
  payeeName: string;
  payeeUpi: string;
  amount: number;
  trustedContact: TrustedContact;
  countdownSeconds: number;
  onConfirmPayment: () => void;
  onCancelPayment: (reason: string) => void;
}

export const InterventionsModal: React.FC<InterventionsModalProps> = ({
  isOpen,
  tier,
  evaluation,
  payeeName,
  payeeUpi,
  amount,
  trustedContact,
  countdownSeconds,
  onConfirmPayment,
  onCancelPayment,
}) => {
  const [hasVoiceRecapped, setHasVoiceRecapped] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userExplicitlyConfirmed, setUserExplicitlyConfirmed] = useState(false);

  // Trigger Web Speech recap for HIGH and CRITICAL tiers automatically upon opening
  useEffect(() => {
    if (isOpen && (tier === 'HIGH' || tier === 'CRITICAL')) {
      setUserExplicitlyConfirmed(false);
      setIsSpeaking(true);
      speakText(
        evaluation.voiceScript,
        () => {
          setIsSpeaking(false);
          setHasVoiceRecapped(true);
        },
        () => {
          setIsSpeaking(false);
          setHasVoiceRecapped(true);
        }
      );
    } else {
      stopSpeech();
      setIsSpeaking(false);
    }

    return () => {
      stopSpeech();
    };
  }, [isOpen, tier, evaluation.voiceScript]);

  if (!isOpen) return null;

  const handleManualReplay = () => {
    setIsSpeaking(true);
    speakText(
      evaluation.voiceScript,
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  };

  // 1. MEDIUM TIER MODAL
  if (tier === 'MEDIUM') {
    return (
      <div
        id="modal-medium-risk"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="medium-title"
      >
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-amber-300 overflow-hidden text-slate-900 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-amber-500 text-white p-5 flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <AlertTriangle className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded text-white inline-block mb-0.5">
                Review Required
              </span>
              <h2 id="medium-title" className="text-xl font-bold">
                Please Confirm Details
              </h2>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
              <span className="text-xs text-slate-700 font-semibold uppercase tracking-wider block">
                Transfer Amount
              </span>
              <p className="text-3xl font-black text-slate-900 mt-1">{formatRupees(amount)}</p>
              <div className="mt-2 pt-2 border-t border-slate-200 text-sm">
                <span className="text-slate-500">Paying to: </span>
                <span className="font-bold text-slate-800">{payeeName}</span>
                <span className="block text-xs text-slate-700 font-mono mt-0.5">{payeeUpi}</span>
              </div>
            </div>

            {/* Plain language flags */}
            {evaluation.flags.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Important Notices:
                </p>
                <div className="space-y-2">
                  {evaluation.flags.map((flag, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg text-sm text-slate-800 flex items-start gap-2"
                    >
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{flag.explanation}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                id="btn-confirm-medium-payment"
                type="button"
                onClick={onConfirmPayment}
                className="w-full min-h-[50px] px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-base transition-colors cursor-pointer"
              >
                <span>Yes, Send {formatRupees(amount)}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                id="btn-cancel-medium-payment"
                type="button"
                onClick={() => onCancelPayment('Cancelled by user during review')}
                className="w-full min-h-[48px] px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Cancel Transfer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. HIGH TIER MODAL (Voice recap + plain reasons + mandatory explicit confirmation)
  if (tier === 'HIGH') {
    return (
      <div
        id="modal-high-risk"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="high-title"
      >
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border-2 border-orange-400 overflow-hidden text-slate-900 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-orange-600 text-white p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 rounded-xl">
                <ShieldAlert className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded text-white inline-block mb-0.5">
                  High Risk Warning
                </span>
                <h2 id="high-title" className="text-xl font-bold">
                  Voice Verification Required
                </h2>
              </div>
            </div>

            {/* Audio speaker button */}
            <button
              id="btn-replay-voice"
              type="button"
              onClick={handleManualReplay}
              title="Hear voice recap again"
              className={`p-2.5 rounded-full ${
                isSpeaking ? 'bg-white text-orange-600 animate-pulse' : 'bg-white/20 text-white'
              } transition-all`}
            >
              {isSpeaking ? <Volume2 className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>

          <div className="p-6 space-y-4">
            {/* Audio Recap banner */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3.5 flex items-start gap-3">
              <div className="p-2 bg-orange-100 rounded-lg text-orange-700 shrink-0">
                <Volume2 className="w-5 h-5" />
              </div>
              <div className="text-sm">
                <p className="font-semibold text-orange-900">
                  {isSpeaking ? 'Reading aloud to you...' : 'Spoken Voice Summary:'}
                </p>
                <p className="text-slate-700 text-xs mt-1 italic">
                  "{evaluation.voiceScript}"
                </p>
                <button
                  type="button"
                  onClick={handleManualReplay}
                  className="text-xs font-bold text-orange-700 underline mt-1.5 inline-flex items-center gap-1 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Tap to hear again
                </button>
              </div>
            </div>

            {/* Transfer Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
              <span className="text-xs text-slate-700 font-semibold uppercase tracking-wider block">
                Attempting to send
              </span>
              <p className="text-3xl font-black text-slate-900 mt-0.5">{formatRupees(amount)}</p>
              <p className="text-sm font-semibold text-slate-800 mt-1">To: {payeeName}</p>
            </div>

            {/* Plain language scam pattern reasons */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Why SafePay flagged this:
              </p>
              <div className="space-y-1.5">
                {evaluation.flags.map((flag, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-rose-50 border-l-4 border-rose-500 rounded-r-lg text-xs font-medium text-slate-800 flex items-start gap-2"
                  >
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{flag.explanation}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Explicit confirmation checkbox */}
            <div className="pt-2 border-t border-slate-200">
              <label className="flex items-start gap-3 p-3 bg-slate-100 rounded-xl cursor-pointer hover:bg-slate-200 transition-colors">
                <input
                  id="chk-high-explicit-confirm"
                  type="checkbox"
                  checked={userExplicitlyConfirmed}
                  onChange={(e) => setUserExplicitlyConfirmed(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800 leading-snug">
                  I have listened to the voice recap and I personally know who{' '}
                  <span className="underline">{payeeName}</span> is.
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <button
                id="btn-confirm-high-payment"
                type="button"
                disabled={!userExplicitlyConfirmed}
                onClick={onConfirmPayment}
                className="w-full min-h-[50px] px-4 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Yes, I Understand & Confirm Payment</span>
              </button>

              <button
                id="btn-cancel-high-payment"
                type="button"
                onClick={() => onCancelPayment('Safe cancellation upon high risk voice warning')}
                className="w-full min-h-[48px] px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Cancel Transfer (Safest Choice)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. CRITICAL TIER MODAL (15-second visual countdown hold window + cancel button + companion alert)
  return (
    <div
      id="modal-critical-risk"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="critical-title"
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border-2 border-rose-600 overflow-hidden text-slate-900 animate-in fade-in zoom-in-95 duration-200">
        {/* Urgent Header */}
        <div className="bg-rose-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl animate-pulse">
              <ShieldAlert className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider bg-white/25 px-2 py-0.5 rounded text-white inline-block mb-0.5">
                Critical Scam Prevention
              </span>
              <h2 id="critical-title" className="text-xl font-black">
                15-Second Safety Hold
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleManualReplay}
            title="Hear voice recap again"
            className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all cursor-pointer"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Prominent Visual Countdown Ring & Meter */}
          <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-5 text-center">
            <div className="flex items-center justify-center gap-2 text-rose-700 font-semibold text-sm mb-2">
              <Clock className="w-5 h-5 animate-spin" />
              <span>Safety Hold Active — Timer Running</span>
            </div>

            {/* Giant Countdown Seconds */}
            <div className="text-6xl font-black text-rose-600 font-mono tracking-tight my-1">
              00:{countdownSeconds < 10 ? `0${countdownSeconds}` : countdownSeconds}
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-rose-200 h-3 rounded-full overflow-hidden mt-3">
              <div
                className="bg-rose-600 h-full transition-all duration-1000 ease-linear rounded-full"
                style={{ width: `${(countdownSeconds / 15) * 100}%` }}
              />
            </div>

            <p className="text-xs text-slate-600 mt-2 font-medium">
              Funds will not leave until the timer ends. You can cancel at any moment with 1 tap.
            </p>
          </div>

          {/* Trusted Contact Notification Status */}
          <div className="bg-slate-900 text-white rounded-xl p-4 flex items-start gap-3 shadow-sm">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <p className="font-bold text-white text-sm">
                Urgent Alert Sent to {trustedContact.name}
              </p>
              <p className="text-slate-300 mt-0.5">
                Simultaneous push notification sent to Priya's phone. Priya has the power to block
                this transfer instantly if you are being scammed.
              </p>
            </div>
          </div>

          {/* Plain Language Flagged Reasons */}
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Scam Risk Factors Detected:
            </p>
            {evaluation.flags.map((flag, idx) => (
              <div
                key={idx}
                className="p-2.5 bg-rose-50 border-l-4 border-rose-500 rounded-r-lg text-xs font-semibold text-rose-950 flex items-start gap-2"
              >
                <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{flag.explanation}</span>
              </div>
            ))}
          </div>

          {/* Large Immediate Cancel Button (Section 4B mandate) */}
          <div className="pt-2">
            <button
              id="btn-cancel-critical-hold"
              type="button"
              onClick={() => onCancelPayment('Payment cancelled by user during 15s hold')}
              className="w-full min-h-[56px] px-4 py-3.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-black text-lg rounded-2xl shadow-lg shadow-rose-200 flex items-center justify-center gap-3 transition-all cursor-pointer transform active:scale-98"
            >
              <XCircle className="w-7 h-7 text-white" />
              <span>Cancel Payment Now</span>
            </button>
            <p className="text-[11px] text-center text-slate-700 mt-2">
              Cancelling is completely free and retains 100% of your funds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
