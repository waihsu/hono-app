export interface League {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface Country {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface Team {
  id: string;
  name: string;
  image_url: string;
  country_id: string;
  league_id: string;
  is_archived: boolean;
}

export interface Match {
  id: string;
  home_team_id: string;
  away_team_id: string;
  match_date: Date;
  match_status: "SCHEDULED" | "ONGOING" | "FINISHED";
  home_team_score: number;
  away_team_scroe: number;
  created_at: Date;
  updated_at: Date;
}

export interface BettingMarket {
  id: string;
  match_id: string;
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
