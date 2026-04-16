export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: 'Basic' | 'Premium' | 'VIP';
  status: 'Active' | 'Inactive' | 'Pending';
  joinDate: string;
}

export type AuthState = {
  isAuthenticated: boolean;
  user: { email: string; name: string } | null;
};
