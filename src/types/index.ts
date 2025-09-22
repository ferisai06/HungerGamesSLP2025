export interface District {
  id: number;
  name: string;
  tribute_male: string | null;
  tribute_female: string | null;
  status: 'active' | 'eliminated' | 'winner';
  eliminated_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Battle {
  id: string;
  district1_id: number;
  district2_id: number;
  winner_district_id: number | null;
  loser_district_id: number | null;
  description: string;
  battle_type: 'individual' | 'group' | 'final';
  occurred_at: string;
  created_at: string;
  updated_at: string;
  // Relations
  district1?: District;
  district2?: District;
  winner_district?: District;
  loser_district?: District;
}

export interface GameState {
  id: string;
  current_phase: 'preparation' | 'bloodbath' | 'games' | 'finale' | 'ended';
  winner_district_id: number | null;
  emergency_mode: boolean;
  last_update: string;
  created_at: string;
  updated_at: string;
  // Relations
  winner_district?: District;
}

export interface AdminUser {
  id: string;
  username: string;
  access_level: 'gamemaker' | 'capitol_admin';
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthSession {
  user: AdminUser | null;
  isAuthenticated: boolean;
}

export interface BattleFormData {
  district1_id: number;
  district2_id: number;
  winner_district_id: number;
  description: string;
  battle_type: 'individual' | 'group' | 'final';
}

export interface EmergencyData {
  districts: District[];
  battles: Battle[];
  gameState: GameState;
}

// Supabase Database Types
export interface Database {
  public: {
    Tables: {
      districts: {
        Row: District;
        Insert: Omit<District, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<District, 'id' | 'created_at' | 'updated_at'>>;
      };
      battles: {
        Row: Battle;
        Insert: Omit<Battle, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Battle, 'id' | 'created_at' | 'updated_at'>>;
      };
      game_state: {
        Row: GameState;
        Insert: Omit<GameState, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<GameState, 'id' | 'created_at' | 'updated_at'>>;
      };
      admin_users: {
        Row: AdminUser;
        Insert: Omit<AdminUser, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<AdminUser, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}