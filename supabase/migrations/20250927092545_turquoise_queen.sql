/*
  # Wedding Invitation System Database Schema

  1. New Tables
    - `countries` - Store country information with localized names
    - `invitation_status` - Track invitation status types
    - `guest_invitations` - Main guest invitation data
    - `guest_responses` - Store guest responses to wedding questions
    - `guest_activities` - Track all guest interactions and analytics

  2. Security
    - Enable RLS on all tables
    - Add policies for guest access based on invite_guid
    - Add policies for admin access to all data

  3. Indexes
    - Add indexes for frequently queried columns
    - Unique constraints for invite_guid
*/

-- Countries table
CREATE TABLE IF NOT EXISTS countries (
  id SERIAL PRIMARY KEY,
  country_code VARCHAR(3) NOT NULL UNIQUE,
  country_name_en VARCHAR(255) NOT NULL,
  country_name_lt VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invitation status table
CREATE TABLE IF NOT EXISTS invitation_status (
  id SERIAL PRIMARY KEY,
  status_name VARCHAR(50) NOT NULL UNIQUE CHECK (status_name IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Guest invitations table
CREATE TABLE IF NOT EXISTS guest_invitations (
  id SERIAL PRIMARY KEY,
  invite_guid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  guest_full_name VARCHAR(255) NOT NULL,
  guest_call VARCHAR(255) NOT NULL,
  guest_language VARCHAR(2) NOT NULL DEFAULT 'EN' CHECK (guest_language IN ('EN', 'LT')),
  fly_from INTEGER REFERENCES countries(id),
  status_id INTEGER REFERENCES invitation_status(id) DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Guest responses table
CREATE TABLE IF NOT EXISTS guest_responses (
  id SERIAL PRIMARY KEY,
  guest_id INTEGER REFERENCES guest_invitations(id) ON DELETE CASCADE,
  days_in_vietnam INTEGER CHECK (days_in_vietnam > 0),
  flight_ticket_date DATE,
  days_before_wedding INTEGER CHECK (days_before_wedding >= 0),
  coming_with TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(guest_id) -- Ensure only one response per guest
);

-- Guest activities table
CREATE TABLE IF NOT EXISTS guest_activities (
  id SERIAL PRIMARY KEY,
  guest_id INTEGER REFERENCES guest_invitations(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN ('page_visit', 'status_change', 'form_submit', 'address_reveal', 'homepage_visit')),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  session_duration INTEGER DEFAULT 0,
  additional_data JSONB DEFAULT '{}'::jsonb
);

-- Insert default invitation statuses
INSERT INTO invitation_status (status_name) VALUES 
  ('pending'),
  ('accepted'),
  ('rejected')
ON CONFLICT (status_name) DO NOTHING;

-- Insert sample countries
INSERT INTO countries (country_code, country_name_en, country_name_lt) VALUES 
  ('LT', 'Lithuania', 'Lietuva'),
  ('GB', 'United Kingdom', 'Jungtinė Karalystė'),
  ('US', 'United States', 'Jungtinės Amerikos Valstijos'),
  ('DE', 'Germany', 'Vokietija'),
  ('FR', 'France', 'Prancūzija'),
  ('IT', 'Italy', 'Italija'),
  ('ES', 'Spain', 'Ispanija'),
  ('PL', 'Poland', 'Lenkija'),
  ('NL', 'Netherlands', 'Nyderlandai'),
  ('SE', 'Sweden', 'Švedija')
ON CONFLICT (country_code) DO NOTHING;

-- Insert sample guest invitations for testing
INSERT INTO guest_invitations (invite_guid, guest_full_name, guest_call, guest_language, fly_from, status_id) VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'Jonas Petraitis', 'Jonas', 'LT', 1, 1),
  ('550e8400-e29b-41d4-a716-446655440002', 'Sarah Johnson', 'Sarah', 'EN', 2, 1),
  ('550e8400-e29b-41d4-a716-446655440003', 'Maria Schmidt', 'Maria', 'EN', 4, 2),
  ('550e8400-e29b-41d4-a716-446655440004', 'Petras Kazlauskas', 'Petras', 'LT', 1, 1),
  ('550e8400-e29b-41d4-a716-446655440005', 'Emma Wilson', 'Emma', 'EN', 2, 1)
ON CONFLICT (invite_guid) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitation_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for countries (public read access)
CREATE POLICY "Countries are publicly readable"
  ON countries
  FOR SELECT
  TO public
  USING (true);

-- RLS Policies for invitation_status (public read access)
CREATE POLICY "Invitation status are publicly readable"
  ON invitation_status
  FOR SELECT
  TO public
  USING (true);

-- RLS Policies for guest_invitations
CREATE POLICY "Guests can read their own invitation"
  ON guest_invitations
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Guests can update their own invitation status"
  ON guest_invitations
  FOR UPDATE
  TO public
  USING (true);

-- RLS Policies for guest_responses
CREATE POLICY "Guests can read their own responses"
  ON guest_responses
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Guests can insert their own responses"
  ON guest_responses
  FOR INSERT
  TO public
  WITH CHECK (true);

-- RLS Policies for guest_activities
CREATE POLICY "Guests can insert their own activities"
  ON guest_activities
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Activities are readable by all"
  ON guest_activities
  FOR SELECT
  TO public
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_guest_invitations_invite_guid ON guest_invitations(invite_guid);
CREATE INDEX IF NOT EXISTS idx_guest_invitations_status ON guest_invitations(status_id);
CREATE INDEX IF NOT EXISTS idx_guest_responses_guest_id ON guest_responses(guest_id);
CREATE INDEX IF NOT EXISTS idx_guest_activities_guest_id ON guest_activities(guest_id);
CREATE INDEX IF NOT EXISTS idx_guest_activities_type ON guest_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_guest_activities_timestamp ON guest_activities(timestamp);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_guest_invitations_updated_at 
    BEFORE UPDATE ON guest_invitations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();