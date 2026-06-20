const SUBSCRIPTION_ACTIVE = 'Active';
const SUBSCRIPTION_EXPIRED = 'Expired';
const SUBSCRIPTION_SUSPENDED = 'Suspended';

export const MOCK_USERS = [
  {
    id: 1,
    email: 'admin@nexora.com',
    password: 'admin123',
    isActive: true,
    failedLoginAttempts: 0,
    lockedAt: null,
    subscription: {
      planId: 'professional',
      status: SUBSCRIPTION_ACTIVE,
      startedAt: '2025-01-01',
      renewalDate: '2026-01-01',
    },
  },
  {
    id: 2,
    email: 'locked@nexora.com',
    password: 'locked123',
    isActive: true,
    failedLoginAttempts: 3,
    lockedAt: '2026-06-01T10:00:00Z',
    subscription: null,
  },
  {
    id: 3,
    email: 'test@nexora.com',
    password: 'test123',
    isActive: true,
    failedLoginAttempts: 0,
    lockedAt: null,
    subscription: null,
  },
  {
    id: 4,
    email: 'admin@email.com',
    password: '1234',
    isActive: true,
    failedLoginAttempts: 0,
    lockedAt: null,
    subscription: null,
  },
  {
    id: 5,
    email: 'expired@nexora.com',
    password: 'expired123',
    isActive: true,
    failedLoginAttempts: 0,
    lockedAt: null,
    subscription: {
      planId: 'basic',
      status: SUBSCRIPTION_EXPIRED,
      startedAt: '2024-01-01',
      renewalDate: '2025-01-01',
    },
  },
  {
    id: 6,
    email: 'suspended@nexora.com',
    password: 'suspended123',
    isActive: true,
    failedLoginAttempts: 0,
    lockedAt: null,
    subscription: {
      planId: 'professional',
      status: SUBSCRIPTION_SUSPENDED,
      startedAt: '2025-01-01',
      renewalDate: '2026-01-01',
    },
  },
];

export const MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6Ik5leG9yYSIsImlhdCI6MTUxNjIzOTAyMn0';
