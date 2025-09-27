-- Wedding Invitation System Database Schema
-- This file will be automatically executed when the MySQL container starts

USE vietnam_guide_db;

-- Countries table
CREATE TABLE IF NOT EXISTS countries (
  id INT PRIMARY KEY AUTO_INCREMENT,
  country_code VARCHAR(3) NOT NULL UNIQUE,
  country_name_en VARCHAR(255) NOT NULL,
  country_name_lt VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invitation status table
CREATE TABLE IF NOT EXISTS invitation_status (
  id INT PRIMARY KEY AUTO_INCREMENT,
  status_name VARCHAR(50) NOT NULL UNIQUE CHECK (status_name IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Guest invitations table
CREATE TABLE IF NOT EXISTS guest_invitations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  invite_guid VARCHAR(36) NOT NULL UNIQUE,
  guest_full_name VARCHAR(255) NOT NULL,
  guest_call VARCHAR(255) NOT NULL,
  guest_language VARCHAR(2) NOT NULL DEFAULT 'EN' CHECK (guest_language IN ('EN', 'LT')),
  fly_from INT,
  status_id INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (fly_from) REFERENCES countries(id),
  FOREIGN KEY (status_id) REFERENCES invitation_status(id)
);

-- Guest responses table
CREATE TABLE IF NOT EXISTS guest_responses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  guest_id INT NOT NULL,
  days_in_vietnam INT CHECK (days_in_vietnam > 0),
  flight_ticket_date DATE,
  days_before_wedding INT CHECK (days_before_wedding >= 0),
  coming_with TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(guest_id),
  FOREIGN KEY (guest_id) REFERENCES guest_invitations(id) ON DELETE CASCADE
);

-- Guest activities table
CREATE TABLE IF NOT EXISTS guest_activities (
  id INT PRIMARY KEY AUTO_INCREMENT,
  guest_id INT NOT NULL,
  activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN ('page_visit', 'status_change', 'form_submit', 'address_reveal', 'homepage_visit')),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  session_duration INT DEFAULT 0,
  additional_data JSON,
  FOREIGN KEY (guest_id) REFERENCES guest_invitations(id) ON DELETE CASCADE
);

-- Insert default invitation statuses
INSERT INTO invitation_status (status_name) VALUES 
  ('pending'),
  ('accepted'),
  ('rejected')
ON DUPLICATE KEY UPDATE status_name = VALUES(status_name);

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
ON DUPLICATE KEY UPDATE 
  country_name_en = VALUES(country_name_en),
  country_name_lt = VALUES(country_name_lt);

-- Insert sample guest invitations for testing
INSERT INTO guest_invitations (invite_guid, guest_full_name, guest_call, guest_language, fly_from, status_id) VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'Jonas Petraitis', 'Jonas', 'LT', 1, 1),
  ('550e8400-e29b-41d4-a716-446655440002', 'Sarah Johnson', 'Sarah', 'EN', 2, 1),
  ('550e8400-e29b-41d4-a716-446655440003', 'Maria Schmidt', 'Maria', 'EN', 4, 2),
  ('550e8400-e29b-41d4-a716-446655440004', 'Petras Kazlauskas', 'Petras', 'LT', 1, 1),
  ('550e8400-e29b-41d4-a716-446655440005', 'Emma Wilson', 'Emma', 'EN', 2, 1)
ON DUPLICATE KEY UPDATE 
  guest_full_name = VALUES(guest_full_name),
  guest_call = VALUES(guest_call);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_guest_invitations_invite_guid ON guest_invitations(invite_guid);
CREATE INDEX IF NOT EXISTS idx_guest_invitations_status ON guest_invitations(status_id);
CREATE INDEX IF NOT EXISTS idx_guest_responses_guest_id ON guest_responses(guest_id);
CREATE INDEX IF NOT EXISTS idx_guest_activities_guest_id ON guest_activities(guest_id);
CREATE INDEX IF NOT EXISTS idx_guest_activities_type ON guest_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_guest_activities_timestamp ON guest_activities(timestamp);