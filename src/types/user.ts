export type UserRole = 'Content Operator' | 'Reviewer' | 'Approver';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  designation: string;
  department: string;
  avatar: string;
  sessionToken: string;
  lastActive: string;
}
