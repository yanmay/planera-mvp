export interface Venue {
  id: string;
  name: string;
  city: string;
  capacity: number;
  price_per_person: number;
  venue_type: string;
  amenities: string[];
  rating: number;
  image_url?: string;
  description?: string;
  totalCost: number;
  contact_phone?: string;
  contact_email?: string;
  address?: string;
  availability_status?: string;
  wifi_available?: boolean;
  parking_capacity?: number;
  ac_available?: boolean;
  catering_available?: boolean;
  amenities_json?: string[];
}
