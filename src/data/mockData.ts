import { User, TrustedContact, Payee, Transaction } from './models';

export const mockUser: User = {
  id: 'u1',
  name: 'Rahul Sharma',
  phone: '+919876543210',
  preferred_language: 'en',
  accessibility_prefs: {
    high_contrast: true,
    large_text: true,
  },
};

export const mockTrustedContacts: TrustedContact[] = [
  { id: 'tc1', user_id: 'u1', name: 'Priya Sharma', phone: '+919876543211', relationship: 'Spouse' },
  { id: 'tc2', user_id: 'u1', name: 'Ramesh Kumar', phone: '+919876543212', relationship: 'Brother' },
];

export const mockPayees: Payee[] = [
  { id: 'p1', name: 'Ramesh Kumar', upi_id: 'ramesh@upi', first_seen_at: '2022-01-10T10:00:00Z' },
  { id: 'p2', name: 'Local Kirana', upi_id: 'kirana@upi', first_seen_at: '2023-05-15T09:30:00Z' },
  { id: 'p3', name: 'Electricity Board', upi_id: 'eb@upi', first_seen_at: '2021-12-01T08:00:00Z' },
  { id: 'p4', name: 'Unknown Taxi', upi_id: 'taxi99@upi', first_seen_at: '2024-09-01T22:15:00Z' },
  { id: 'p5', name: 'Fresh Veggies', upi_id: 'veg@upi', first_seen_at: '2024-09-03T07:45:00Z' },
];

export const mockTransactions: Transaction[] = [
  { id: 't1', user_id: 'u1', payee_id: 'p1', amount: 500, timestamp: '2024-09-03T18:30:00Z', tier: 'low', flags: [], status: 'completed' },
  { id: 't2', user_id: 'u1', payee_id: 'p2', amount: 150, timestamp: '2024-09-02T10:15:00Z', tier: 'low', flags: [], status: 'completed' },
  { id: 't3', user_id: 'u1', payee_id: 'p3', amount: 1200, timestamp: '2024-09-01T14:20:00Z', tier: 'medium', flags: [], status: 'completed' },
  { id: 't4', user_id: 'u1', payee_id: 'p4', amount: 800, timestamp: '2024-09-01T22:16:00Z', tier: 'medium', flags: ['unusual_time'], status: 'completed' },
  { id: 't5', user_id: 'u1', payee_id: 'p2', amount: 45, timestamp: '2024-08-30T11:05:00Z', tier: 'low', flags: [], status: 'completed' },
  { id: 't6', user_id: 'u1', payee_id: 'p1', amount: 2000, timestamp: '2024-08-25T19:00:00Z', tier: 'medium', flags: [], status: 'completed' },
  { id: 't7', user_id: 'u1', payee_id: 'p3', amount: 1150, timestamp: '2024-08-01T14:10:00Z', tier: 'medium', flags: [], status: 'completed' },
  { id: 't8', user_id: 'u1', payee_id: 'p2', amount: 320, timestamp: '2024-07-28T16:45:00Z', tier: 'low', flags: [], status: 'completed' },
  { id: 't9', user_id: 'u1', payee_id: 'p5', amount: 85, timestamp: '2024-07-20T08:30:00Z', tier: 'low', flags: [], status: 'completed' },
  { id: 't10', user_id: 'u1', payee_id: 'p1', amount: 15000, timestamp: '2024-07-15T12:00:00Z', tier: 'high', flags: ['unusual_amount'], status: 'completed' },
];
