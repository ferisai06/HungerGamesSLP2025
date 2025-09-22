-- Hunger Games SLP 2025 Database Schema
-- Run these commands in your Supabase SQL editor

-- Districts table
CREATE TABLE IF NOT EXISTS districts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    tribute_male VARCHAR(100),
    tribute_female VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'eliminated', 'winner')),
    eliminated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Battles table
CREATE TABLE IF NOT EXISTS battles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    district1_id INTEGER REFERENCES districts(id) ON DELETE CASCADE,
    district2_id INTEGER REFERENCES districts(id) ON DELETE CASCADE,
    winner_district_id INTEGER REFERENCES districts(id) ON DELETE SET NULL,
    loser_district_id INTEGER REFERENCES districts(id) ON DELETE SET NULL,
    description TEXT,
    battle_type VARCHAR(20) DEFAULT 'individual' CHECK (battle_type IN ('individual', 'group', 'final')),
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Game state table
CREATE TABLE IF NOT EXISTS game_state (
    id SERIAL PRIMARY KEY,
    current_phase VARCHAR(20) DEFAULT 'preparation' CHECK (current_phase IN ('preparation', 'bloodbath', 'games', 'finale', 'ended')),
    winner_district_id INTEGER REFERENCES districts(id) ON DELETE SET NULL,
    emergency_mode BOOLEAN DEFAULT FALSE,
    last_update TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users table (optional - for more advanced auth)
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    access_level VARCHAR(20) DEFAULT 'gamemaker' CHECK (access_level IN ('gamemaker', 'capitol_admin')),
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_districts_updated_at BEFORE UPDATE ON districts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_battles_updated_at BEFORE UPDATE ON battles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_game_state_updated_at BEFORE UPDATE ON game_state FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial districts data
INSERT INTO districts (id, name, tribute_male, tribute_female) VALUES
(1, 'Distrito 1 - Lujo', NULL, NULL),
(2, 'Distrito 2 - Albañilería', NULL, NULL),
(3, 'Distrito 3 - Tecnología', NULL, NULL),
(4, 'Distrito 4 - Pesca', NULL, NULL),
(5, 'Distrito 5 - Energía', NULL, NULL),
(6, 'Distrito 6 - Transporte', NULL, NULL),
(7, 'Distrito 7 - Madera', NULL, NULL),
(8, 'Distrito 8 - Textiles', NULL, NULL),
(9, 'Distrito 9 - Granos', NULL, NULL),
(10, 'Distrito 10 - Ganadería', NULL, NULL),
(11, 'Distrito 11 - Agricultura', NULL, NULL),
(12, 'Distrito 12 - Minería', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- Insert initial game state
INSERT INTO game_state (id, current_phase, winner_district_id, emergency_mode) VALUES
(1, 'preparation', NULL, FALSE)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS) - Optional for public read access
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for districts" ON districts FOR SELECT USING (true);
CREATE POLICY "Public read access for battles" ON battles FOR SELECT USING (true);
CREATE POLICY "Public read access for game_state" ON game_state FOR SELECT USING (true);

-- Create policies for admin write access (you'll need to implement proper auth)
CREATE POLICY "Admin write access for districts" ON districts FOR ALL USING (true);
CREATE POLICY "Admin write access for battles" ON battles FOR ALL USING (true);
CREATE POLICY "Admin write access for game_state" ON game_state FOR ALL USING (true);

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE districts;
ALTER PUBLICATION supabase_realtime ADD TABLE battles;
ALTER PUBLICATION supabase_realtime ADD TABLE game_state;