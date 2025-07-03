export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: UserRole;
  isEmailVerified: boolean;
  isTwoFactorEnabled: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  profileImage?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  marketingEmails: boolean;
  orderUpdates: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
  currency: string;
}

export interface AdminUser extends User {
  role: AdminRole;
  permissions: Permission[];
  lastPasswordChange: Date;
  failedLoginAttempts: number;
  accountLocked: boolean;
  lockoutUntil?: Date;
}

export type UserRole = 'customer' | 'admin';

export type AdminRole = 'super_admin' | 'product_manager' | 'content_editor' | 'customer_support';

export interface Permission {
  resource: 'products' | 'categories' | 'users' | 'orders' | 'analytics' | 'settings';
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  sessionExpiry: Date | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
  twoFactorCode?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  marketingConsent: boolean;
  termsAccepted: boolean;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordReset {
  token: string;
  newPassword: string;
}

export interface TwoFactorSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  sessionId: string;
  success: boolean;
  errorMessage?: string;
}

export interface SecurityConfig {
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    preventCommonPasswords: boolean;
  };
  rateLimiting: {
    loginAttempts: number;
    timeWindow: number;
    progressiveDelay: boolean;
  };
  twoFactorAuth: {
    required: boolean;
    methods: ('sms' | 'totp' | 'email')[];
    backupCodes: number;
  };
  sessionConfig: {
    accessTokenExpiry: number;
    refreshTokenExpiry: number;
    maxConcurrentSessions: number;
  };
}