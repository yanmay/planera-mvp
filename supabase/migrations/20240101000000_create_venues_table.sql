-- Create venues table for event planning
CREATE TABLE IF NOT EXISTS venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  price_per_person DECIMAL(10,2) NOT NULL CHECK (price_per_person > 0),
  venue_type TEXT NOT NULL,
  amenities TEXT[] DEFAULT '{}',
  rating DECIMAL(3,2) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_venues_city ON venues(city);
CREATE INDEX IF NOT EXISTS idx_venues_capacity ON venues(capacity);
CREATE INDEX IF NOT EXISTS idx_venues_price ON venues(price_per_person);
CREATE INDEX IF NOT EXISTS idx_venues_rating ON venues(rating);
CREATE INDEX IF NOT EXISTS idx_venues_type ON venues(venue_type);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_venues_updated_at 
    BEFORE UPDATE ON venues 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO venues (name, city, capacity, price_per_person, venue_type, amenities, rating, description) VALUES
('Taj Lands End', 'Mumbai', 500, 2500.00, 'hotel', ARRAY['parking', 'catering', 'audiovisual', 'wifi'], 4.8, 'Luxury hotel with stunning sea views'),
('ITC Grand Chola', 'Chennai', 800, 3000.00, 'hotel', ARRAY['parking', 'catering', 'audiovisual', 'wifi', 'spa'], 4.9, '5-star luxury hotel with world-class amenities'),
('Leela Palace', 'Bangalore', 300, 4000.00, 'hotel', ARRAY['parking', 'catering', 'audiovisual', 'wifi', 'pool'], 4.7, 'Palatial hotel with royal treatment'),
('Oberoi Mumbai', 'Mumbai', 200, 3500.00, 'hotel', ARRAY['parking', 'catering', 'audiovisual', 'wifi'], 4.6, 'Boutique luxury hotel in the heart of Mumbai'),
('Taj Palace', 'Delhi', 1000, 2800.00, 'hotel', ARRAY['parking', 'catering', 'audiovisual', 'wifi', 'garden'], 4.8, 'Historic palace hotel with modern amenities'),
('Convention Center', 'Hyderabad', 1500, 1500.00, 'convention_center', ARRAY['parking', 'catering', 'audiovisual', 'wifi', 'exhibition_space'], 4.5, 'Large convention center for corporate events'),
('Garden Venue', 'Pune', 150, 1200.00, 'outdoor', ARRAY['parking', 'catering', 'garden', 'outdoor_seating'], 4.3, 'Beautiful garden venue for intimate events'),
('Tech Hub', 'Bangalore', 400, 1800.00, 'conference_center', ARRAY['parking', 'catering', 'audiovisual', 'wifi', 'tech_support'], 4.4, 'Modern tech conference center'),
('Riverside Resort', 'Kolkata', 250, 2200.00, 'resort', ARRAY['parking', 'catering', 'audiovisual', 'wifi', 'river_view'], 4.2, 'Scenic riverside resort for events'),
('Heritage Palace', 'Jaipur', 600, 3200.00, 'heritage', ARRAY['parking', 'catering', 'audiovisual', 'wifi', 'cultural_show'], 4.7, 'Historic palace with royal ambiance');

-- Enable Row Level Security (RLS)
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access to all users
CREATE POLICY "Allow read access to all users" ON venues
  FOR SELECT USING (true);

-- Create policy to allow insert/update/delete for authenticated users only
CREATE POLICY "Allow authenticated users to manage venues" ON venues
  FOR ALL USING (auth.role() = 'authenticated');

