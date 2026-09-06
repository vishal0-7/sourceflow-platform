import { UserSession, UserRole } from '../types/user';
import { simulateDelay, createApiResponse, ApiResponse } from './api';

const AUTH_STORAGE_KEY = 'sourceflow_auth_session';

export const defaultUserSession: UserSession = {
  id: 'USR-802',
  name: 'K. Varma',
  email: 'operator@sourceflow.demo',
  role: 'Reviewer',
  designation: 'Content Verification Specialist',
  department: 'Content Verification Operations',
  avatar: 'KV',
  sessionToken: 'SEC-SESSION-7729-SF',
  lastActive: new Date().toISOString()
};

export class AuthService {
  private currentSession: UserSession | null = null;

  constructor() {
    this.loadPersistedSession();
  }

  private loadPersistedSession() {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        this.currentSession = JSON.parse(stored);
      }
    } catch {
      this.currentSession = null;
    }
  }

  isAuthenticated(): boolean {
    return this.currentSession !== null;
  }

  async login(email: string, _password: string, rememberMe = true): Promise<ApiResponse<UserSession>> {
    await simulateDelay(200);

    const session: UserSession = {
      ...defaultUserSession,
      email: email || defaultUserSession.email,
      lastActive: new Date().toISOString()
    };

    this.currentSession = session;

    try {
      const json = JSON.stringify(session);
      if (rememberMe) {
        localStorage.setItem(AUTH_STORAGE_KEY, json);
      } else {
        sessionStorage.setItem(AUTH_STORAGE_KEY, json);
      }
    } catch (err) {
      console.warn('Could not persist session', err);
    }

    return createApiResponse(session);
  }

  async logout(): Promise<ApiResponse<boolean>> {
    await simulateDelay(100);
    this.currentSession = null;
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (err) {
      console.warn('Could not clear stored session', err);
    }
    return createApiResponse(true);
  }

  async getSession(): Promise<ApiResponse<UserSession | null>> {
    await simulateDelay(50);
    return createApiResponse(this.currentSession);
  }

  async switchRole(role: UserRole): Promise<ApiResponse<UserSession>> {
    await simulateDelay(100);
    const designationMap: Record<UserRole, string> = {
      'Content Operator': 'Content Upload & Intelligence Operator',
      'Reviewer': 'Content Verification Specialist',
      'Approver': 'Principal Content Approver'
    };

    const updatedSession: UserSession = {
      ...(this.currentSession || defaultUserSession),
      role,
      designation: designationMap[role] || 'Content Verification Specialist',
      lastActive: new Date().toISOString()
    };

    this.currentSession = updatedSession;
    try {
      const json = JSON.stringify(updatedSession);
      localStorage.setItem(AUTH_STORAGE_KEY, json);
    } catch {}

    return createApiResponse(updatedSession);
  }
}

export const authService = new AuthService();
