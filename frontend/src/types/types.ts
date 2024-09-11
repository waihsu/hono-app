export interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
  account_status: "SUSPENDED" | "ACTIVE" | "BAN";
  user_role: "ADMIN" | "SUPERADMIN" | "USER";
}

export interface SocialMediaLink {
  id: string;
  name: string;
  link: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface League {
  id: string;
  name: string;
  code: string;
  type: string;
  image_url: string;
  is_archived: boolean;
  country_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface RunningLeague {
  id: string;
  team_id: string;
  league_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface Country {
  id: string;
  name: string;
  code: string;
  is_archived: boolean;
  flag: string;
  created_at: Date;
  updated_at: Date;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  tla: string;
  image_url: string;
  address: string;
  website: string;
  founded: number;
  venue: string;
  clubColors: string;
  is_archived: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Match {
  id: string;
  home_team_id: string;
  away_team_id: string;
  match_date: Date;
  match_status: "SCHEDULED" | "ONGOING" | "FINISHED" | "TIMED";
  home_team_score: number;
  away_team_scroe: number;
  is_archived: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface PublishMatch {
  id: string;
  match_id: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface BettingMarket {
  id: string;
  publish_match_id: string;
  market_type: string;
  market_status: "OPEN" | "CLOSE";
  created_at: Date;
  updated_at: Date;
}

export interface Odd {
  id: string;
  betting_market_id: string;
  outcome: string;
  odd_value: number;
  team_id: string;
  is_archived: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Bet {
  id: string;
  user_id: string;
  admin_id: string;
  betting_market_id: string;
  odd_id: string;
  amount: number;
  bet_status: "PENDING" | "WON" | "LOST" | "CANCLED";
  created_at: Date;
  updated_at: Date;
}

export interface Transation {
  id: string;
  user_id: string;
  payment_id: string;
  amount: number;
  phone_number: string;
  name: string;
  transfer_id: string | null;
  transaction_type: string;
  transation_status: "PENDING" | "COMPLETED" | "FAILED";
  created_at: Date;
  updated_at: Date;
}

export interface Payment {
  id: string;
  payment_name: string;
  payment_number: string;
  name: string;
  admin_id: string;
  created_at: Date;
  updated_at: Date;
}
