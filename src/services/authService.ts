import Cookies from 'js-cookie';
import { User, AdminUser, LoginCredentials, RegisterData, AuditLog, SecurityConfig } from '../types/auth';

// Security configuration
export const securityConfig: SecurityConfig = {
  passwordPolicy: {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    preventCommonPasswords: true,
  },
  rateLimiting: {
    loginAttempts: 5,
    timeWindow: 900, // 15 minutes
    progressiveDelay: true,
  },
  twoFactorAuth: {
    required: false,
    methods: ['totp', 'sms'],
    backupCodes: 10,
  },
  sessionConfig: {
    accessTokenExpiry: 1800, // 30 minutes
    refreshTokenExpiry: 2592000, // 30 days
    maxConcurrentSessions: 3,
  },
};

// Mock user database
let users: (User | AdminUser)[] = [
  {
    id: 'admin-1',
    email: 'admin@shophub.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    isEmailVerified: true,
    isTwoFactorEnabled: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    preferences: {
      marketingEmails: false,
      orderUpdates: true,
      theme: 'light',
      language: 'en',
      currency: 'INR',
    },
    permissions: [
      { resource: 'products', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'categories', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'orders', actions: ['read', 'update'] },
      { resource: 'analytics', actions: ['read'] },
      { resource: 'settings', actions: ['read', 'update'] },
    ],
    lastPasswordChange: new Date('2024-01-01'),
    failedLoginAttempts: 0,
    accountLocked: false,
  } as AdminUser,
  {
    id: 'customer-1',
    email: 'customer@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'customer',
    isEmailVerified: true,
    isTwoFactorEnabled: false,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
    preferences: {
      marketingEmails: true,
      orderUpdates: true,
      theme: 'light',
      language: 'en',
      currency: 'INR',
    },
  } as User,
];

// Mock passwords (in production, these would be handled by the backend)
const userPasswords: Record<string, string> = {
  'admin@shophub.com': 'AdminPassword123!',
  'customer@example.com': 'CustomerPass123!',
};

// Mock audit logs
let auditLogs: AuditLog[] = [];

// Rate limiting storage
const loginAttempts: Record<string, { count: number; lastAttempt: Date; lockedUntil?: Date }> = {};

class AuthService {
  // Password validation
  validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const { passwordPolicy } = securityConfig;

    if (password.length < passwordPolicy.minLength) {
      errors.push(`Password must be at least ${passwordPolicy.minLength} characters long`);
    }

    if (passwordPolicy.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (passwordPolicy.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (passwordPolicy.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (passwordPolicy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    // Check against common passwords (simplified)
    const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein'];
    if (passwordPolicy.preventCommonPasswords && commonPasswords.includes(password.toLowerCase())) {
      errors.push('Password is too common, please choose a stronger password');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Rate limiting check
  checkRateLimit(email: string): { allowed: boolean; retryAfter?: number } {
    const attempts = loginAttempts[email];
    const now = new Date();

    if (!attempts) {
      return { allowed: true };
    }

    // Check if account is locked
    if (attempts.lockedUntil && now < attempts.lockedUntil) {
      const retryAfter = Math.ceil((attempts.lockedUntil.getTime() - now.getTime()) / 1000);
      return { allowed: false, retryAfter };
    }

    // Reset if time window has passed
    const timeSinceLastAttempt = now.getTime() - attempts.lastAttempt.getTime();
    if (timeSinceLastAttempt > securityConfig.rateLimiting.timeWindow * 1000) {
      delete loginAttempts[email];
      return { allowed: true };
    }

    // Check if max attempts reached
    if (attempts.count >= securityConfig.rateLimiting.loginAttempts) {
      const lockoutDuration = securityConfig.rateLimiting.timeWindow * 1000;
      attempts.lockedUntil = new Date(now.getTime() + lockoutDuration);
      return { allowed: false, retryAfter: securityConfig.rateLimiting.timeWindow };
    }

    return { allowed: true };
  }

  // Record login attempt
  recordLoginAttempt(email: string, success: boolean): void {
    const now = new Date();

    if (success) {
      delete loginAttempts[email];
      return;
    }

    if (!loginAttempts[email]) {
      loginAttempts[email] = { count: 0, lastAttempt: now };
    }

    loginAttempts[email].count++;
    loginAttempts[email].lastAttempt = now;
  }

  // Generate simple session tokens (in production, use proper JWT from backend)
  generateTokens(user: User | AdminUser): { accessToken: string; refreshToken: string } {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      permissions: 'permissions' in user ? user.permissions : [],
      exp: Date.now() + (securityConfig.sessionConfig.accessTokenExpiry * 1000),
    };

    // Simple base64 encoding for demo (in production, use proper JWT from backend)
    const accessToken = btoa(JSON.stringify(payload));
    const refreshToken = btoa(JSON.stringify({
      userId: user.id,
      exp: Date.now() + (securityConfig.sessionConfig.refreshTokenExpiry * 1000),
    }));

    return { accessToken, refreshToken };
  }

  // Verify token (simplified for demo)
  verifyToken(token: string): any {
    try {
      const decoded = JSON.parse(atob(token));
      if (decoded.exp && Date.now() > decoded.exp) {
        throw new Error('Token expired');
      }
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // Login
  async login(credentials: LoginCredentials): Promise<{ user: User | AdminUser; tokens: { accessToken: string; refreshToken: string } }> {
    const { email, password, rememberMe = false } = credentials;

    // Check rate limiting
    const rateLimitCheck = this.checkRateLimit(email);
    if (!rateLimitCheck.allowed) {
      this.logAuditEvent({
        userId: '',
        action: 'login_blocked',
        resource: 'auth',
        ipAddress: '127.0.0.1',
        userAgent: 'browser',
        success: false,
        errorMessage: 'Rate limit exceeded',
      });
      throw new Error(`Too many login attempts. Try again in ${rateLimitCheck.retryAfter} seconds.`);
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      this.recordLoginAttempt(email, false);
      this.logAuditEvent({
        userId: '',
        action: 'login_failed',
        resource: 'auth',
        ipAddress: '127.0.0.1',
        userAgent: 'browser',
        success: false,
        errorMessage: 'User not found',
      });
      throw new Error('Invalid email or password');
    }

    // Check if account is locked (for admin users)
    if ('accountLocked' in user && user.accountLocked) {
      this.logAuditEvent({
        userId: user.id,
        action: 'login_blocked',
        resource: 'auth',
        ipAddress: '127.0.0.1',
        userAgent: 'browser',
        success: false,
        errorMessage: 'Account locked',
      });
      throw new Error('Account is locked. Please contact support.');
    }

    // Verify password (simplified for demo)
    const storedPassword = userPasswords[email];
    if (!storedPassword || password !== storedPassword) {
      this.recordLoginAttempt(email, false);
      this.logAuditEvent({
        userId: user.id,
        action: 'login_failed',
        resource: 'auth',
        ipAddress: '127.0.0.1',
        userAgent: 'browser',
        success: false,
        errorMessage: 'Invalid password',
      });
      throw new Error('Invalid email or password');
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      throw new Error('Please verify your email address before logging in');
    }

    // Generate tokens
    const tokens = this.generateTokens(user);

    // Store tokens in cookies
    const cookieOptions = {
      secure: false, // Set to true in production with HTTPS
      sameSite: 'strict' as const,
      expires: rememberMe ? 30 : undefined, // 30 days if remember me, session cookie otherwise
    };

    Cookies.set('accessToken', tokens.accessToken, {
      ...cookieOptions,
      expires: rememberMe ? 30 : undefined,
    });

    Cookies.set('refreshToken', tokens.refreshToken, {
      ...cookieOptions,
      expires: 30, // Always 30 days for refresh token
    });

    // Update last login
    user.lastLogin = new Date();
    user.updatedAt = new Date();

    // Reset failed login attempts
    this.recordLoginAttempt(email, true);

    // Log successful login
    this.logAuditEvent({
      userId: user.id,
      action: 'login_success',
      resource: 'auth',
      ipAddress: '127.0.0.1',
      userAgent: 'browser',
      success: true,
    });

    return { user, tokens };
  }

  // Register
  async register(data: RegisterData): Promise<{ user: User; tokens: { accessToken: string; refreshToken: string } }> {
    const { email, password, firstName, lastName, phoneNumber, marketingConsent, termsAccepted } = data;

    // Check if terms are accepted
    if (!termsAccepted) {
      throw new Error('You must accept the terms and conditions');
    }

    // Validate password
    const passwordValidation = this.validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join(', '));
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      firstName,
      lastName,
      phoneNumber,
      role: 'customer',
      isEmailVerified: true, // Auto-verify for demo
      isTwoFactorEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      preferences: {
        marketingEmails: marketingConsent,
        orderUpdates: true,
        theme: 'light',
        language: 'en',
        currency: 'INR',
      },
    };

    // Store password (in production, this would be hashed on the backend)
    userPasswords[email] = password;

    // Add to users array
    users.push(newUser);

    // Generate tokens
    const tokens = this.generateTokens(newUser);

    // Store tokens in cookies
    Cookies.set('accessToken', tokens.accessToken, {
      secure: false, // Set to true in production with HTTPS
      sameSite: 'strict',
    });

    Cookies.set('refreshToken', tokens.refreshToken, {
      secure: false, // Set to true in production with HTTPS
      sameSite: 'strict',
      expires: 30,
    });

    // Log registration
    this.logAuditEvent({
      userId: newUser.id,
      action: 'user_registered',
      resource: 'auth',
      ipAddress: '127.0.0.1',
      userAgent: 'browser',
      success: true,
    });

    return { user: newUser, tokens };
  }

  // Logout
  logout(): void {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
  }

  // Get current user from token
  getCurrentUser(): User | AdminUser | null {
    const token = Cookies.get('accessToken');
    if (!token) return null;

    try {
      const decoded = this.verifyToken(token);
      const user = users.find(u => u.id === decoded.userId);
      return user || null;
    } catch (error) {
      return null;
    }
  }

  // Refresh token
  async refreshToken(): Promise<{ accessToken: string; refreshToken: string } | null> {
    const refreshToken = Cookies.get('refreshToken');
    if (!refreshToken) return null;

    try {
      const decoded = this.verifyToken(refreshToken);
      const user = users.find(u => u.id === decoded.userId);
      
      if (!user) return null;

      const tokens = this.generateTokens(user);

      // Update cookies
      Cookies.set('accessToken', tokens.accessToken, {
        secure: false, // Set to true in production with HTTPS
        sameSite: 'strict',
      });

      Cookies.set('refreshToken', tokens.refreshToken, {
        secure: false, // Set to true in production with HTTPS
        sameSite: 'strict',
        expires: 30,
      });

      return tokens;
    } catch (error) {
      return null;
    }
  }

  // Log audit event
  logAuditEvent(event: Omit<AuditLog, 'id' | 'timestamp' | 'sessionId'>): void {
    const auditLog: AuditLog = {
      ...event,
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      sessionId: Cookies.get('accessToken') || 'no-session',
    };

    auditLogs.push(auditLog);

    // In production, this would be sent to a logging service
    console.log('Audit Log:', auditLog);
  }

  // Get audit logs (admin only)
  getAuditLogs(userId?: string, limit: number = 100): AuditLog[] {
    let logs = auditLogs;

    if (userId) {
      logs = logs.filter(log => log.userId === userId);
    }

    return logs
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  // Update user profile
  async updateProfile(userId: string, updates: Partial<User>): Promise<User | AdminUser> {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const user = users[userIndex];
    const oldValues = { ...user };

    // Update user
    users[userIndex] = {
      ...user,
      ...updates,
      updatedAt: new Date(),
    };

    // Log the update
    this.logAuditEvent({
      userId,
      action: 'profile_updated',
      resource: 'user',
      resourceId: userId,
      oldValues,
      newValues: updates,
      ipAddress: '127.0.0.1',
      userAgent: 'browser',
      success: true,
    });

    return users[userIndex];
  }

  // Change password
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = users.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const storedPassword = userPasswords[user.email];
    if (!storedPassword || currentPassword !== storedPassword) {
      this.logAuditEvent({
        userId,
        action: 'password_change_failed',
        resource: 'auth',
        ipAddress: '127.0.0.1',
        userAgent: 'browser',
        success: false,
        errorMessage: 'Invalid current password',
      });
      throw new Error('Current password is incorrect');
    }

    // Validate new password
    const passwordValidation = this.validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join(', '));
    }

    // Store new password
    userPasswords[user.email] = newPassword;

    // Update password change date for admin users
    if ('lastPasswordChange' in user) {
      (user as AdminUser).lastPasswordChange = new Date();
    }

    user.updatedAt = new Date();

    // Log password change
    this.logAuditEvent({
      userId,
      action: 'password_changed',
      resource: 'auth',
      ipAddress: '127.0.0.1',
      userAgent: 'browser',
      success: true,
    });
  }

  // Get all users (admin only)
  getAllUsers(): (User | AdminUser)[] {
    return users;
  }

  // Create admin user (super admin only)
  async createAdminUser(adminData: Omit<AdminUser, 'id' | 'createdAt' | 'updatedAt' | 'failedLoginAttempts' | 'accountLocked'>): Promise<AdminUser> {
    // Check if user already exists
    const existingUser = users.find(u => u.email === adminData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const newAdmin: AdminUser = {
      ...adminData,
      id: `admin-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      failedLoginAttempts: 0,
      accountLocked: false,
      lastPasswordChange: new Date(),
    };

    users.push(newAdmin);

    // Log admin creation
    this.logAuditEvent({
      userId: newAdmin.id,
      action: 'admin_created',
      resource: 'user',
      resourceId: newAdmin.id,
      newValues: { email: newAdmin.email, role: newAdmin.role },
      ipAddress: '127.0.0.1',
      userAgent: 'browser',
      success: true,
    });

    return newAdmin;
  }
}

export const authService = new AuthService();