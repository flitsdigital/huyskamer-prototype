export type Role = "customer" | "admin";
export type TxnType = "earn" | "redeem" | "adjust";
export type Locale = "nl" | "en" | "de";

export interface Profile {
  id: string;
  role: Role;
  is_owner: boolean;
  display_name: string | null;
  email: string | null;
  phone: string | null;
  qr_token: string;
  consent_at: string | null;
  birthdate: string | null;
  birthday_bonus_year: number | null;
  referral_code: string | null;
  referred_by: string | null;
  avatar_url: string | null;
  locale: Locale;
  created_at: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string | null;
  points_cost: number;
  is_active: boolean;
  image_url: string | null;
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

export interface Settings {
  id: boolean;
  points_per_euro: number;
  welcome_bonus: number;
  referral_bonus: number;
  birthday_bonus: number;
  points_expiry_months: number | null;
  updated_at: string;
}

export interface Tier {
  id: number;
  name: string;
  min_points: number;
  earn_multiplier: number;
  sort: number;
}

export interface CustomerTier {
  customer_id: string;
  total_earned: number;
  tier_id: number | null;
  tier_name: string | null;
  earn_multiplier: number | null;
  next_tier_min: number | null;
  next_tier_name: string | null;
}
