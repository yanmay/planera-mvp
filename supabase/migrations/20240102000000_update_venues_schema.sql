-- Migration: Update venues table schema with new columns
-- Date: 2024-01-02

-- Add new columns to venues table
-- Note: venue_type already exists as TEXT, we'll keep it as is
-- Note: amenities already exists as TEXT[], we'll add a new JSONB column for enhanced amenities

-- Add new columns that don't exist yet
ALTER TABLE venues 
ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS contact_email VARCHAR(100),
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS parking_capacity INTEGER,
ADD COLUMN IF NOT EXISTS catering_available BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS wifi_available BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS ac_available BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS availability_status VARCHAR(20) DEFAULT 'available';

-- Add enhanced amenities as JSONB (keeping existing TEXT[] amenities for backward compatibility)
ALTER TABLE venues 
ADD COLUMN IF NOT EXISTS amenities_json JSONB;

-- Create indexes for new columns for better query performance
CREATE INDEX IF NOT EXISTS idx_venues_contact_email ON venues(contact_email);
CREATE INDEX IF NOT EXISTS idx_venues_availability_status ON venues(availability_status);
CREATE INDEX IF NOT EXISTS idx_venues_catering_available ON venues(catering_available);
CREATE INDEX IF NOT EXISTS idx_venues_wifi_available ON venues(wifi_available);
CREATE INDEX IF NOT EXISTS idx_venues_ac_available ON venues(ac_available);
CREATE INDEX IF NOT EXISTS idx_venues_amenities_json ON venues USING GIN(amenities_json);

-- Update existing sample data with new column values
UPDATE venues SET 
  contact_phone = '+91-22-6668-1234',
  contact_email = 'events@tajlandsend.com',
  address = 'Bandra Kurla Complex, Mumbai, Maharashtra 400051',
  parking_capacity = 200,
  catering_available = true,
  wifi_available = true,
  ac_available = true,
  availability_status = 'available',
  amenities_json = '["parking", "catering", "audiovisual", "wifi", "valet_service", "security"]'
WHERE name = 'Taj Lands End';

UPDATE venues SET 
  contact_phone = '+91-44-2220-0000',
  contact_email = 'events@itchotels.com',
  address = '63, Mount Road, Guindy, Chennai, Tamil Nadu 600032',
  parking_capacity = 300,
  catering_available = true,
  wifi_available = true,
  ac_available = true,
  availability_status = 'available',
  amenities_json = '["parking", "catering", "audiovisual", "wifi", "spa", "fitness_center", "business_center"]'
WHERE name = 'ITC Grand Chola';

UPDATE venues SET 
  contact_phone = '+91-80-2521-1234',
  contact_email = 'events@theleela.com',
  address = '23, Airport Road, Bangalore, Karnataka 560008',
  parking_capacity = 150,
  catering_available = true,
  wifi_available = true,
  ac_available = true,
  availability_status = 'available',
  amenities_json = '["parking", "catering", "audiovisual", "wifi", "pool", "spa", "garden"]'
WHERE name = 'Leela Palace';

UPDATE venues SET 
  contact_phone = '+91-22-6632-5757',
  contact_email = 'events@oberoihotels.com',
  address = 'Nariman Point, Mumbai, Maharashtra 400021',
  parking_capacity = 100,
  catering_available = true,
  wifi_available = true,
  ac_available = true,
  availability_status = 'available',
  amenities_json = '["parking", "catering", "audiovisual", "wifi", "concierge", "room_service"]'
WHERE name = 'Oberoi Mumbai';

UPDATE venues SET 
  contact_phone = '+91-11-2302-6162',
  contact_email = 'events@tajhotels.com',
  address = 'Sardar Patel Marg, Diplomatic Enclave, New Delhi 110021',
  parking_capacity = 400,
  catering_available = true,
  wifi_available = true,
  ac_available = true,
  availability_status = 'available',
  amenities_json = '["parking", "catering", "audiovisual", "wifi", "garden", "heritage_tour", "cultural_show"]'
WHERE name = 'Taj Palace';

UPDATE venues SET 
  contact_phone = '+91-40-2345-6789',
  contact_email = 'events@hiteccity.com',
  address = 'HITEC City, Madhapur, Hyderabad, Telangana 500081',
  parking_capacity = 500,
  catering_available = true,
  wifi_available = true,
  ac_available = true,
  availability_status = 'available',
  amenities_json = '["parking", "catering", "audiovisual", "wifi", "exhibition_space", "tech_support", "meeting_rooms"]'
WHERE name = 'Convention Center';

UPDATE venues SET 
  contact_phone = '+91-20-2567-8901',
  contact_email = 'events@gardenvenue.com',
  address = 'Koregaon Park, Pune, Maharashtra 411001',
  parking_capacity = 80,
  catering_available = true,
  wifi_available = false,
  ac_available = false,
  availability_status = 'available',
  amenities_json = '["parking", "catering", "garden", "outdoor_seating", "natural_lighting", "landscaping"]'
WHERE name = 'Garden Venue';

UPDATE venues SET 
  contact_phone = '+91-80-4123-4567',
  contact_email = 'events@techhub.com',
  address = 'Electronic City, Bangalore, Karnataka 560100',
  parking_capacity = 200,
  catering_available = true,
  wifi_available = true,
  ac_available = true,
  availability_status = 'available',
  amenities_json = '["parking", "catering", "audiovisual", "wifi", "tech_support", "high_speed_internet", "presentation_equipment"]'
WHERE name = 'Tech Hub';

UPDATE venues SET 
  contact_phone = '+91-33-2345-6789',
  contact_email = 'events@riversideresort.com',
  address = 'Howrah, Kolkata, West Bengal 711101',
  parking_capacity = 120,
  catering_available = true,
  wifi_available = true,
  ac_available = true,
  availability_status = 'available',
  amenities_json = '["parking", "catering", "audiovisual", "wifi", "river_view", "boat_rides", "outdoor_dining"]'
WHERE name = 'Riverside Resort';

UPDATE venues SET 
  contact_phone = '+91-141-234-5678',
  contact_email = 'events@heritagepalace.com',
  address = 'Amber Road, Jaipur, Rajasthan 302001',
  parking_capacity = 250,
  catering_available = true,
  wifi_available = true,
  ac_available = true,
  availability_status = 'available',
  amenities_json = '["parking", "catering", "audiovisual", "wifi", "cultural_show", "heritage_tour", "traditional_decoration"]'
WHERE name = 'Heritage Palace';

-- Add comments to document the schema
COMMENT ON COLUMN venues.venue_type IS 'Type of venue: hotel, convention_center, banquet_hall, outdoor, resort, heritage, etc.';
COMMENT ON COLUMN venues.amenities IS 'Array of basic amenities (legacy column)';
COMMENT ON COLUMN venues.amenities_json IS 'Enhanced amenities stored as JSONB for better querying and structure';
COMMENT ON COLUMN venues.contact_phone IS 'Primary contact phone number for the venue';
COMMENT ON COLUMN venues.contact_email IS 'Primary contact email for the venue';
COMMENT ON COLUMN venues.address IS 'Full address of the venue';
COMMENT ON COLUMN venues.parking_capacity IS 'Number of parking spaces available';
COMMENT ON COLUMN venues.catering_available IS 'Whether catering services are available on-site';
COMMENT ON COLUMN venues.wifi_available IS 'Whether WiFi is available at the venue';
COMMENT ON COLUMN venues.ac_available IS 'Whether air conditioning is available';
COMMENT ON COLUMN venues.availability_status IS 'Current availability status: available, booked, maintenance, etc.';
