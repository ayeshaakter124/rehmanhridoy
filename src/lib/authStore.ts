/**
 * Secure Admin Authentication & Session Management
 */

const AUTH_STORAGE_KEY = "rh_cms_auth_session_v2";
const ADMIN_PASS_KEY = "rh_cms_admin_secret_key_v2";
const ADMIN_USER_KEY = "rh_cms_admin_username_v2";
const RATE_LIMIT_KEY = "rh_cms_login_attempts_v2";

export interface AuthSession {
  token: string;
  username: string;
  loginTime: number;
  expiresAt: number;
}

export const authStore = {
  getStoredPassword(): string {
    return localStorage.getItem(ADMIN_PASS_KEY) || "halima123";
  },

  setStoredPassword(newPassword: string): void {
    if (!newPassword || newPassword.trim().length < 4) {
      throw new Error("Password must be at least 4 characters long.");
    }
    localStorage.setItem(ADMIN_PASS_KEY, newPassword.trim());
  },

  getStoredUsername(): string {
    return localStorage.getItem(ADMIN_USER_KEY) || "admin";
  },

  setStoredUsername(username: string): void {
    if (!username || username.trim().length < 3) {
      throw new Error("Username must be at least 3 characters long.");
    }
    localStorage.setItem(ADMIN_USER_KEY, username.trim());
  },

  getAttempts(): { count: number; lockedUntil: number } {
    try {
      const saved = localStorage.getItem(RATE_LIMIT_KEY);
      return saved ? JSON.parse(saved) : { count: 0, lockedUntil: 0 };
    } catch {
      return { count: 0, lockedUntil: 0 };
    }
  },

  recordFailedAttempt(): { locked: boolean; waitSeconds?: number } {
    const attempts = this.getAttempts();
    const count = attempts.count + 1;
    let lockedUntil = attempts.lockedUntil;

    if (count >= 5) {
      // Lock for 60 seconds after 5 failed attempts
      lockedUntil = Date.now() + 60 * 1000;
    }

    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ count, lockedUntil }));

    if (lockedUntil > Date.now()) {
      return { locked: true, waitSeconds: Math.ceil((lockedUntil - Date.now()) / 1000) };
    }
    return { locked: false };
  },

  resetAttempts(): void {
    localStorage.removeItem(RATE_LIMIT_KEY);
  },

  login(identifier: string, secretKey: string): { success: boolean; error?: string } {
    const attempts = this.getAttempts();
    if (attempts.lockedUntil > Date.now()) {
      const wait = Math.ceil((attempts.lockedUntil - Date.now()) / 1000);
      return { success: false, error: `Too many failed attempts. Try again in ${wait}s.` };
    }

    const expectedUser = this.getStoredUsername().toLowerCase();
    const expectedPass = this.getStoredPassword();
    const enteredId = identifier.trim().toLowerCase();
    const enteredKey = secretKey.trim();

    const isUserMatch = enteredId === expectedUser || enteredId === "reehmanhridoy@gmail.com" || enteredId === "admin";
    const isPassMatch = enteredKey === expectedPass;

    if (isUserMatch && isPassMatch) {
      this.resetAttempts();
      const session: AuthSession = {
        token: `cms_tok_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        username: identifier.trim(),
        loginTime: Date.now(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      return { success: true };
    }

    const res = this.recordFailedAttempt();
    if (res.locked) {
      return { success: false, error: `Access Denied. Locked for ${res.waitSeconds}s due to repeated attempts.` };
    }
    return { success: false, error: "Access Denied: Invalid credentials." };
  },

  getSession(): AuthSession | null {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!saved) return null;
      const session: AuthSession = JSON.parse(saved);
      if (session.expiresAt && session.expiresAt < Date.now()) {
        this.logout();
        return null;
      }
      return session;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return Boolean(this.getSession());
  },

  logout(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
};
