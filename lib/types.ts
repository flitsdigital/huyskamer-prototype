export type Role = "customer" | "admin";
export type TxnType = "earn" | "redeem" | "adjust";

export interface Profile {
  id: string;
  role: Role;
  display_name: string | null;
  email: string | null;
  phone: string | null;
  qr_token: string;
  consent_at: string | null;
  created_at: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string | null;
  points_cost: number;
  is_active: boolean;
  created_at: string;
}

export interface Transaction {
  id: string;
  customer_id: string;
  type: TxnType;
  amount_spent: number | null;
  points_delta: number;
  reward_id: string | null;
  performed_by: string | null;
  note: string | null;
  created_at: string;
}
