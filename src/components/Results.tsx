import { useState, useEffect, useMemo } from "react";
import VenueCard from "./VenueCard";
import VenueFilters from "./VenueFilters";
import VenueDetailModal from "./VenueDetailModal";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import venueImage1 from "@/assets/venue-taj-lands-end.jpg";
import venueImage2 from "@/assets/venue-itc-grand-chola.jpg";
import venueImage3 from "@/assets/venue-leela-palace.jpg";
import venueImage4 from "@/assets/hero-corporate-event.jpg";
import { getAIRecommendations } from "../services/aiService";

// Types for the API response
interface Venue {
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

interface FormData {
  city: string;
  eventType: string;
  startDate?: Date;
  endDate?: Date;
  attendees: string;
  budget: string;
  venueType: string;
  parking: boolean;
  wheelchair: boolean;
  venues?: Venue[];
  recommendations?: string[];
  aiRecommendations?: any[];
  totalCost?: number;
}

interface ResultsProps {
  isVisible: boolean;
  formData: FormData | null;
}

// Helper function to format Indian currency
const formatIndianCurrency = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)} Crores`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)} Lakhs`;
  } else {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
};

// Helper function to get venue image
const getVenueImage = (index: number): string => {
  // Create a randomized array of images for 27 venues
  const allImages = [venueImage1, venueImage2, venueImage3, venueImage4];
  const randomizedImages = [
    venueImage1, venueImage2, venueImage3, venueImage4, venueImage1, venueImage2, venueImage3, venueImage4,
    venueImage1, venueImage2, venueImage3, venueImage4, venueImage1, venueImage2, venueImage3, venueImage4,
    venueImage1, venueImage2, venueImage3, venueImage4, venueImage1, venueImage2, venueImage3, venueImage4,
    venueImage1, venueImage2, venueImage3
  ];
  return randomizedImages[index];
};

const Results = ({ isVisible, formData }: ResultsProps) => {
  const navigate = useNavigate();
  const [allVenues, setAllVenues] = useState<Venue[]>([]);
  const [displayedVenues, setDisplayedVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [venuesToShow, setVenuesToShow] = useState(6);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedVenueTypes, setSelectedVenueTypes] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([2000, 10000]);
  const [capacityRange, setCapacityRange] = useState<[number, number]>([50, 1000]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    venueTypes: [],
    amenities: [],
    priceRange: [2000, 10000] as [number, number],
    capacityRange: [50, 1000] as [number, number],
    availabilityStatus: []
  });
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isVisible && formData) {
      setIsLoading(true);

      // Use mock data for demonstration (comment out API data usage)
      // if (formData.venues && formData.venues.length > 0) {
      //   setAllVenues(formData.venues);
      //   setDisplayedVenues(formData.venues.slice(0, 3));
      //   setVenuesToShow(6);
      //   setIsLoading(false);
      // } else {
        // Use mock data for demonstration
        setTimeout(async () => {
          const mockVenues = [
            // Original 12 venues with updated data
            {
              id: "1",
              name: "Taj Lands End",
              city: "Mumbai",
              capacity: 150,
              price_per_person: 6800,
              venue_type: "hotel",
              amenities: ["parking", "catering", "wifi", "av_equipment", "sea_view"],
              rating: 4.8,
              image_url: getVenueImage(0),
              description: "Luxury hotel with stunning sea views and world-class amenities",
              totalCost: 1020000,
              contact_phone: "+91-22-6668-1234",
              contact_email: "events@tajlandsend.com",
              address: "Bandra Kurla Complex, Mumbai, Maharashtra 400051",
              availability_status: "available",
              wifi_available: true,
              parking_capacity: 120,
              ac_available: true,
              catering_available: true,
              amenities_json: ["parking", "catering", "wifi", "av_equipment", "sea_view", "spa_access"]
            },
            {
              id: "2",
              name: "ITC Grand Chola",
              city: "Chennai",
              capacity: 150,
              price_per_person: 4800,
              venue_type: "hotel",
              amenities: ["parking", "catering", "wifi", "conference_rooms", "business_center"],
              rating: 4.7,
              image_url: getVenueImage(1),
              description: "Premium business hotel with world-class facilities and excellent service",
              totalCost: 720000,
              contact_phone: "+91-44-2220-0000",
              contact_email: "events@itchotels.com",
              address: "63, Mount Road, Guindy, Chennai, Tamil Nadu 600032",
              availability_status: "available",
              wifi_available: true,
              parking_capacity: 200,
              ac_available: true,
              catering_available: true,
              amenities_json: ["parking", "catering", "wifi", "conference_rooms", "business_center", "fitness_center"]
            },
            {
              id: "3",
              name: "The Leela Palace",
              city: "Bengaluru",
              capacity: 180,
              price_per_person: 5900,
              venue_type: "hotel",
              amenities: ["parking", "catering", "wifi", "spa", "pool", "royal_ambiance"],
              rating: 4.9,
              image_url: getVenueImage(2),
              description: "Opulent palace hotel with royal treatment and exceptional dining",
              totalCost: 1062000,
              contact_phone: "+91-80-2521-1234",
              contact_email: "events@theleela.com",
              address: "23, Airport Road, Bangalore, Karnataka 560008",
              availability_status: "available",
              wifi_available: true,
              parking_capacity: 160,
              ac_available: true,
              catering_available: true,
              amenities_json: ["parking", "catering", "wifi", "spa", "pool", "royal_ambiance", "garden_access"]
            },
            {
              id: "4",
              name: "The Imperial New Delhi",
              city: "Delhi",
              capacity: 180,
              price_per_person: 5800,
              venue_type: "hotel",
              amenities: ["parking", "catering", "audiovisual", "wifi", "valet_service", "spa_access"],
              rating: 4.8,
              image_url: getVenueImage(3),
              description: "Historic luxury hotel with colonial architecture and world-class service",
              totalCost: 1044000,
              contact_phone: "+91-11-2334-1234",
              contact_email: "events@theimperialnewdelhi.com",
              address: "Janpath, Connaught Place, New Delhi, Delhi 110001",
              availability_status: "available",
              wifi_available: true,
              parking_capacity: 120,
              ac_available: true,
              catering_available: true,
              amenities_json: ["parking", "catering", "audiovisual", "wifi", "valet_service", "spa_access", "heritage_ambiance", "garden_access", "business_center"]
            },
            {
              id: "5",
              name: "India Habitat Centre",
              city: "Delhi",
              capacity: 350,
              price_per_person: 3200,
              venue_type: "convention_center",
              amenities: ["parking", "catering", "audiovisual", "wifi", "exhibition_space", "meeting_rooms"],
              rating: 4.5,
              image_url: getVenueImage(4),
              description: "Modern convention center with state-of-the-art facilities and flexible spaces",
              totalCost: 1120000,
              contact_phone: "+91-11-2468-1234",
              contact_email: "events@indiahabitat.org",
              address: "Lodhi Road, Near Jor Bagh Metro, New Delhi, Delhi 110003",
              availability_status: "available",
              wifi_available: true,
              parking_capacity: 200,
              ac_available: true,
              catering_available: true,
              amenities_json: ["parking", "catering", "audiovisual", "wifi", "exhibition_space", "meeting_rooms", "tech_support", "green_rooms"]
            },
            {
              id: "6",
              name: "The Leela Palace New Delhi",
              city: "Delhi",
              capacity: 220,
              price_per_person: 6200,
              venue_type: "hotel",
              amenities: ["parking", "catering", "audiovisual", "wifi", "spa_access", "pool_access"],
              rating: 4.9,
              image_url: getVenueImage(5),
              description: "Palatial luxury hotel with royal treatment and exceptional dining",
              totalCost: 1364000,
              contact_phone: "+91-11-3933-1234",
              contact_email: "events@theleela.com",
              address: "Diplomatic Enclave, Chanakyapuri, New Delhi, Delhi 110023",
              availability_status: "available",
              wifi_available: true,
              parking_capacity: 150,
              ac_available: true,
              catering_available: true,
              amenities_json: ["parking", "catering", "audiovisual", "wifi", "spa_access", "pool_access", "royal_ambiance", "concierge"]
            },
            {
              id: "7",
              name: "Pragati Maidan Convention Centre",
              city: "Delhi",
              capacity: 500,
              price_per_person: 2800,
              venue_type: "convention_center",
              amenities: ["parking", "catering", "audiovisual", "wifi", "exhibition_space", "loading_dock"],
              rating: 4.4,
              image_url: getVenueImage(6),
              description: "Large-scale convention center perfect for major exhibitions and events",
              totalCost: 1400000,
              contact_phone: "+91-11-2337-1234",
              contact_email: "events@pragatimaidan.com",
              address: "Pragati Maidan, Mathura Road, New Delhi, Delhi 110002",
              availability_status: "available",
              wifi_available: true,
              parking_capacity: 400,
              ac_available: true,
              catering_available: true,
              amenities_json: ["parking", "catering", "audiovisual", "wifi", "exhibition_space", "loading_dock", "meeting_rooms", "tech_support"]
            },
            {
              id: "8",
              name: "The Taj Palace Hotel",
              city: "Delhi",
              capacity: 280,
              price_per_person: 5500,
              venue_type: "hotel",
              amenities: ["parking", "catering", "audiovisual", "wifi", "spa_access", "garden_access"],
              rating: 4.7,
              image_url: getVenueImage(7),
              description: "Elegant palace hotel with stunning gardens and luxury amenities",
              totalCost: 1540000,
              contact_phone: "+91-11-2611-1234",
              contact_email: "events@tajpalace.com",
              address: "Sardar Patel Marg, Diplomatic Enclave, New Delhi, Delhi 110021",
              availability_status: "available",
              wifi_available: true,
              parking_capacity: 180,
              ac_available: true,
              catering_available: true,
              amenities_json: ["parking", "catering", "audiovisual", "wifi", "spa_access", "garden_access", "heritage_tour", "cultural_show"]
            },
            {
              id: "9",
              name: "The Taj Mahal Palace Mumbai",
              city: "Mumbai",
              capacity: 250,
              price_per_person: 6800,
              venue_type: "hotel",
              amenities: ["parking", "catering", "audiovisual", "wifi", "spa_access", "sea_view"],
              rating: 4.9,
              image_url: getVenueImage(8),
              description: "Iconic luxury hotel with breathtaking Arabian Sea views and heritage charm",
              totalCost: 1700000,
              contact_phone: "+91-22-6665-1234",
              contact_email: "events@tajhotels.com",
              address: "Apollo Bunder, Colaba, Mumbai, Maharashtra 400001",
              availability_status: "available",
              wifi_available: true,
              parking_capacity: 160,
              ac_available: true,
              catering_available: true,
              amenities_json: ["parking", "catering", "audiovisual", "wifi", "spa_access", "sea_view", "heritage_ambiance", "concierge"]
            },
            {
              id: "10",
              name: "Bombay Exhibition Centre",
              city: "Mumbai",
              capacity: 450,
              price_per_person: 3000,
              venue_type: "convention_center",
              amenities: ["parking", "catering", "audiovisual", "wifi", "exhibition_space", "tech_support"],
              rating: 4.3,
              image_url: getVenueImage(9),
              description: "Modern exhibition center with flexible spaces for large-scale events",
              totalCost: 1350000,
              contact_phone: "+91-22-2493-1234",
              contact_email: "events@bombayexhibition.com",
              address: "Goregaon East, Mumbai, Maharashtra 400063",
              availability_status: "available",
              wifi_available: true,
              parking_capacity: 300,
              ac_available: true,
              catering_available: true,
              amenities_json: ["parking", "catering", "audiovisual", "wifi", "exhibition_space", "tech_support", "meeting_rooms", "loading_dock"]
            },
            {
              id: "11",
              name: "ITC Grand Central",
              city: "Mumbai",
              capacity: 200,
              price_per_person: 4800,
              venue_type: "hotel",
              amenities: ["parking", "catering", "audiovisual", "wifi", "spa_access", "business_center"],
              rating: 4.6,
              image_url: getVenueImage(10),
              description: "Premium business hotel with excellent connectivity and modern amenities",
              totalCost: 960000,
              contact_phone: "+91-22-2410-1234",
              contact_email: "events@itchotels.com",
              address: "Dr. Babasaheb Ambedkar Road, Parel, Mumbai, Maharashtra 400012",
              availability_status: "available",
              wifi_available: true,
              parking_capacity: 120,
              ac_available: true,
              catering_available: true,
              amenities_json: ["parking", "catering", "audiovisual", "wifi", "spa_access", "business_center", "fitness_center", "concierge"]
            },
            {
              id: "12",
              name: "Sahara Star Hotel",
              city: "Mumbai",
              capacity: 180,
              price_per_person: 4200,
              venue_type: "hotel",
              amenities: ["parking", "catering", "audiovisual", "wifi", "pool_access", "garden_access"],
              rating: 4.4,
              image_url: getVenueImage(11),
              description: "Contemporary hotel with unique dome architecture and lush gardens",
              totalCost: 756000,
              contact_phone: "+91-22-3980-1234",
              contact_email: "events@saharastar.com",
              address: "Domestic Airport, Vile Parle East, Mumbai, Maharashtra 400099",
              availability_status: "available",
              wifi_available: true,
              parking_capacity: 100,
              ac_available: true,
              catering_available: true,
              amenities_json: ["parking", "catering", "audiovisual", "wifi", "pool_access", "garden_access", "airport_proximity", "spa_access"]
            },
            {
              id: "13",
              name: "World Trade Centre Mumbai",
              city: "Mumbai",
              capacity: 320,
              price_per_person: 3500,
              venue_type: "convention_center",
              amenities: ["parking", "catering", "audiovisual", "wifi", "exhibition_space", "meeting_rooms"],
              rating: 4.5,
              image_url: getVenueImage(12),
              description: "Premier business center with world-class conference facilities",
              totalCost: 1120000,
              contact_phone: "+91-22-6652-1234",
              contact_email: "events@wtcmumbai.com",
              address: "Cuffe Parade, Colaba, Mumbai, Maharashtra 400005",
              availability_status: "available",
              wifi_available: true,
              parking_capacity: 200,
              ac_available: true,
              catering_available: true,
              amenities_json: ["parking", "catering", "audiovisual", "wifi", "exhibition_space", "meeting_rooms", "business_center", "tech_support"]
            },
            {
              id: "14",
              name: "The Leela Palace Bengaluru",
              city: "Bengaluru",
              capacity: 240,
              price_per_person: 5900,
              venue_type: "hotel",
              amenities: ["parking", "catering", "audiovisual", "wifi", "spa_access", "pool_access"],
              rating: 4.8,
              image_url: getVenueImage(13),
              description: "Luxury palace hotel with royal treatment and exceptional service",
              totalCost: 1416000,
              contact_phone: "+91-80-2521-1234",
              contact_email: "events@theleela.com",
              address: "23, Airport Road, Bangalore, Karnataka 560008",
              availability_status: "available",
              wifi_available: true,
              parking_capacity: 160,
              ac_available: true,
              catering_available: true,
              amenities_json: ["parking", "catering", "audiovisual", "wifi", "spa_access", "pool_access", "royal_ambiance", "garden_access"]
            },
            {
              id: "15",
              name: "UB City Mall Convention Centre",
              city: "Bengaluru",
              capacity: 280,
              price_per_person: 3800,
              venue_type: "convention_center",
              amenities: ["parking", "catering", "audiovisual", "wifi", "shopping_access", "meeting_rooms"],
              rating: 4.4,
              image_url: getVenueImage(14),
              description: "Premium convention center within luxury shopping complex",
              totalCost: 1064000,
              contact_phone: "+91-80-4177-1234",
              contact_email: "events@ubcity.com",
              address: "UB City, Vittal Mallya Road, Bangalore, Karnataka 560001",
              availability_status: "available",
              wifi_available: true,
              parking_capacity: 180,
              ac_available: true,
              catering_available: true,
              amenities_json: ["parking", "catering", "audiovisual", "wifi", "shopping_access", "meeting_rooms", "luxury_ambiance", "concierge"]
            },
            {
              id: "16",
              name: "ITC Gardenia",
              city: "Bengaluru",
              capacity: 200,
              price_per_person: 5200,
              venue_type: "hotel",
              amenities: ["parking", "catering", "audiovisual", "wifi", "spa_access", "garden_access"],
              rating: 4.7,
              image_url: getVenueImage(15),
              description: "Eco-friendly luxury hotel with beautiful gardens and sustainable practices",
              totalCost: 1040000,
              contact_phone: "+91-80-2211-1234",
              contact_email: "events@itchotels.com",
              address: "Residency Road, Bangalore, Karnataka 560025",
              availability_status: "available",
              wifi_available: true,
              parking_capacity: 130,
              ac_available: true,
              catering_available: true,
              amenities_json: ["parking", "catering", "audiovisual", "wifi", "spa_access", "garden_access", "eco_friendly", "fitness_center"]
            },
            {
              id: "17",
              name: "Bangalore International Exhibition Centre",
              city: "Bengaluru",
              capacity: 400,
              price_per_person: 3200,
              venue_type: "convention_center",
              amenities: ["parking", "catering", "audiovisual", "wifi", "exhibition_space", "tech_support"],
              rating: 4.3,
              image_url: getVenueImage(16),
              description: "Large-scale exhibition center with modern technology and flexible spaces",
              totalCost: 1280000,
              contact_phone: "+91-80-4111-1234",
              contact_email: "events@biec.com",
              address: "Tumkur Road, Bangalore, Karnataka 560073",
              availability_status: "available",
              wifi_available: true,
              parking_capacity: 250,
              ac_available: true,
              catering_available: true,
              amenities_json: ["parking", "catering", "audiovisual", "wifi", "exhibition_space", "tech_support", "meeting_rooms", "loading_dock"]
            },
            {
              id: "18",
              name: "The Ritz-Carlton Bangalore",
              city: "Bengaluru",
              capacity: 160,
              price_per_person: 6500,
              venue_type: "hotel",
              amenities: ["parking", "catering", "audiovisual", "wifi", "spa_access", "pool_access"],
              rating: 4.9,
              image_url: getVenueImage(17),
              description: "Ultra-luxury hotel with impeccable service and world-class amenities",
              totalCost: 1040000,
              contact_phone: "+91-80-4914-1234",
              contact_email: "events@ritzcarlton.com",
              address: "99, Residency Road, Bangalore, Karnataka 560025",
              availability_status: "available",
              wifi_available: true,
              parking_capacity: 100,
              ac_available: true,
              catering_available: true,
              amenities_json: ["parking", "catering", "audiovisual", "wifi", "spa_access", "pool_access", "luxury_service", "concierge"]
            },
            {
              id: "19",
              name: "Trident BKC Grand Ballroom",
              city: "Mumbai",
              capacity: 200,
              price_per_person: 5200,
              venue_type: "hotel",
              amenities: ["parking", "catering", "audiovisual", "wifi", "spa_access"],
              rating: 4.8,
              image_url: getVenueImage(18),
              description: "Luxury ballroom in Bandra Kurla Complex with modern amenities and city views",
              totalCost: 1040000,
              contact_phone: "+91-22-6778-1234",
              contact_email: "events@tridenthotels.com",
              address: "Bandra Kurla Complex, Bandra East, Mumbai, Maharashtra 400051",
              availability_status: "available",
              wifi_available: true,
              parking_capacity: 150,
              ac_available: true,
              catering_available: true,
              amenities_json: ["parking", "catering", "audiovisual", "wifi", "spa_access", "business_center"]
            },
            {
              id: "20",
              name: "UB City Crystal Ballroom",
              city: "Bengaluru",
              capacity: 180,
              price_per_person: 4800,
              venue_type: "hotel",
              amenities: ["parking", "catering", "audiovisual", "wifi", "shopping_access"],
              rating: 4.6,
              image_url: getVenueImage(19),
              description: "Sophisticated ballroom in UB City with luxury shopping and dining options",
              totalCost: 864000,
              contact_phone: "+91-80-4177-1234",
              contact_email: "events@ubcity.com",
              address: "UB City, Vittal Mallya Road, Bengaluru, Karnataka 560001",
              availability_status: "available",
              wifi_available: true,
              parking_capacity: 120,
              ac_available: true,
              catering_available: true,
              amenities_json: ["parking", "catering", "audiovisual", "wifi", "shopping_access", "luxury_ambiance"]
            },
            {
              id: "21",
              name: "Park Hyatt Grand Ballroom",
              city: "Chennai",
              capacity: 160,
              price_per_person: 4600,
              venue_type: "hotel",
              amenities: ["parking", "catering", "audiovisual", "wifi", "pool_access"],
              rating: 4.7,
              image_url: getVenueImage(20),
              description: "Luxury hotel ballroom with contemporary design and excellent service",
              totalCost: 736000,
              contact_phone: "+91-44-7177-1234",
              contact_email: "events@parkhyattchennai.com",
              address: "39, Velachery Road, Guindy, Chennai, Tamil Nadu 600032",
              availability_status: "available",
              wifi_available: true,
              parking_capacity: 100,
              ac_available: true,
              catering_available: true,
              amenities_json: ["parking", "catering", "audiovisual", "wifi", "pool_access", "spa_access"]
            },
            {
              id: "22",
              name: "Taj Falaknuma Palace",
              city: "Hyderabad",
              capacity: 120,
              price_per_person: 6500,
              venue_type: "heritage",
              amenities: ["parking", "catering", "audiovisual", "wifi", "heritage_tour"],
              rating: 4.9,
              image_url: getVenueImage(21),
              description: "Historic palace venue with royal ambiance and breathtaking city views",
              totalCost: 780000,
              contact_phone: "+91-40-6669-1234",
              contact_email: "events@tajfalaknuma.com",
              address: "Engine Bowli, Falaknuma, Hyderabad, Telangana 500053",
              availability_status: "available",
              wifi_available: true,
              parking_capacity: 80,
              ac_available: true,
              catering_available: true,
              amenities_json: ["parking", "catering", "audiovisual", "wifi", "heritage_tour", "royal_ambiance"]
            },
            {
              id: "23",
              name: "Budget Conference Center",
              city: "Mumbai",
              capacity: 80,
              price_per_person: 1800,
              venue_type: "convention_center",
              amenities: ["parking", "audiovisual"],
              rating: 3.8,
              image_url: getVenueImage(22),
              description: "Affordable conference center for small business events",
              totalCost: 144000,
              contact_phone: "+91-22-2345-6789",
              contact_email: "events@budgetconference.com",
              address: "Andheri West, Mumbai, Maharashtra 400058",
              availability_status: "available",
              wifi_available: false,
              parking_capacity: 40,
              ac_available: true,
              catering_available: false,
              amenities_json: ["parking", "audiovisual", "meeting_rooms"]
            },
            {
              id: "24",
              name: "Luxury Resort & Spa",
              city: "Goa",
              capacity: 200,
              price_per_person: 7500,
              venue_type: "resort",
              amenities: ["parking", "catering", "audiovisual", "wifi", "spa", "pool", "beach_access"],
              rating: 4.9,
              image_url: getVenueImage(23),
              description: "Premium beachfront resort with luxury amenities",
              totalCost: 1500000,
              contact_phone: "+91-832-2345-6789",
              contact_email: "events@luxuryresortgoa.com",
              address: "Calangute Beach, Goa 403516",
              availability_status: "booked",
              wifi_available: true,
              parking_capacity: 100,
              ac_available: true,
              catering_available: true,
              amenities_json: ["parking", "catering", "audiovisual", "wifi", "spa", "pool", "beach_access", "water_sports"]
            },
            {
              id: "25",
              name: "Community Hall",
              city: "Pune",
              capacity: 150,
              price_per_person: 1200,
              venue_type: "banquet_hall",
              amenities: ["parking", "catering"],
              rating: 3.5,
              image_url: getVenueImage(24),
              description: "Simple community hall for local events",
              totalCost: 180000,
              contact_phone: "+91-20-2345-6789",
              contact_email: "events@communityhallpune.com",
              address: "Koregaon Park, Pune, Maharashtra 411001",
              availability_status: "maintenance",
              wifi_available: false,
              parking_capacity: 60,
              ac_available: false,
              catering_available: true,
              amenities_json: ["parking", "catering", "basic_av"]
            },
            {
              id: "26",
              name: "Hyderabad International Convention Centre",
              city: "Hyderabad",
              capacity: 300,
              price_per_person: 3500,
              venue_type: "convention_center",
              amenities: ["parking", "catering", "audiovisual", "wifi", "exhibition_space"],
              rating: 4.4,
              image_url: getVenueImage(25),
              description: "Modern convention center with state-of-the-art facilities",
              totalCost: 1050000,
              contact_phone: "+91-40-2345-6789",
              contact_email: "events@hicc.com",
              address: "HITEC City, Madhapur, Hyderabad, Telangana 500081",
              availability_status: "available",
              wifi_available: true,
              parking_capacity: 200,
              ac_available: true,
              catering_available: true,
              amenities_json: ["parking", "catering", "audiovisual", "wifi", "exhibition_space", "tech_support", "meeting_rooms"]
            },
            {
              id: "27",
              name: "Pune International Convention Centre",
              city: "Pune",
              capacity: 250,
              price_per_person: 2800,
              venue_type: "convention_center",
              amenities: ["parking", "catering", "audiovisual", "wifi", "meeting_rooms"],
              rating: 4.2,
              image_url: getVenueImage(26),
              description: "Professional convention center for corporate events and conferences",
              totalCost: 700000,
              contact_phone: "+91-20-3456-7890",
              contact_email: "events@picc.com",
              address: "Kharadi, Pune, Maharashtra 411014",
              availability_status: "available",
              wifi_available: true,
              parking_capacity: 150,
              ac_available: true,
              catering_available: true,
              amenities_json: ["parking", "catering", "audiovisual", "wifi", "meeting_rooms", "business_center"]
            }
          ];
          
          setAllVenues(mockVenues);
          setDisplayedVenues(mockVenues.slice(0, 6));
          setVenuesToShow(6);
          
          // Get AI recommendations with the full venue data
          try {
            const aiResponse = await getAIRecommendations(formData, mockVenues);
            // Update formData with AI recommendations
            if (formData && typeof formData === 'object') {
              formData.recommendations = aiResponse.insights;
              formData.aiRecommendations = aiResponse.recommendations;
            }
          } catch (error) {
            console.error('Error getting AI recommendations:', error);
          }
          
          setIsLoading(false);
        }, 1500);
      // }

      // Scroll to results
      setTimeout(() => {
        const resultsElement = document.getElementById('results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [isVisible, formData]);

  // Filter venues based on current filters
  const filteredVenues = useMemo(() => {
    return allVenues.filter(venue => {
      // Venue type filter - use .in() logic
      if (selectedVenueTypes.length > 0 && !selectedVenueTypes.includes(venue.venue_type)) {
        return false;
      }

      // Price range filter
      const venuePrice = venue.price_per_person;
      if (venuePrice < priceRange[0] || venuePrice > priceRange[1]) {
        return false;
      }

      // Capacity range filter
      if (venue.capacity < capacityRange[0] || venue.capacity > capacityRange[1]) {
        return false;
      }

      // Availability status filter
      if (selectedAvailability.length > 0 && venue.availability_status && 
          !selectedAvailability.includes(venue.availability_status)) {
        return false;
      }

      // Amenities filter - use JSONB contains logic
      if (selectedAmenities.length > 0) {
        const venueAmenities = venue.amenities || [];
        const venueAmenitiesJson = venue.amenities_json || [];
        
        // Check if venue has all selected amenities
        const hasAllAmenities = selectedAmenities.every(amenity => {
          // Check boolean amenities first
          switch (amenity) {
            case 'wifi':
              return venue.wifi_available;
            case 'parking':
              return venue.parking_capacity && venue.parking_capacity > 0;
            case 'ac':
              return venue.ac_available;
            case 'catering':
              return venue.catering_available;
            default:
              // Check in amenities array or JSONB
              return venueAmenities.includes(amenity) || 
                     (Array.isArray(venueAmenitiesJson) && venueAmenitiesJson.includes(amenity));
          }
        });
        
        if (!hasAllAmenities) {
          return false;
        }
      }

      return true;
    });
  }, [allVenues, selectedVenueTypes, selectedAmenities, priceRange, capacityRange, selectedAvailability]);

  // Check if there are no venues found
  const noVenuesFound = filteredVenues.length === 0;

  // Update displayed venues when venuesToShow or filtered venues change
  useEffect(() => {
    setDisplayedVenues(filteredVenues.slice(0, venuesToShow));
  }, [venuesToShow, filteredVenues]);

  const loadMoreVenues = async () => {
    setLoadingMore(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Increase the number of venues to show by 6
    setVenuesToShow(prev => prev + 6);
    setLoadingMore(false);
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    setVenuesToShow(3); // Reset to show first 3 venues when filters change
  };

  const handleVenueTypeChange = (venueType: string, checked: boolean) => {
    const newTypes = checked 
      ? [...selectedVenueTypes, venueType]
      : selectedVenueTypes.filter(type => type !== venueType);
    setSelectedVenueTypes(newTypes);
    setVenuesToShow(3);
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    const newAmenities = checked 
      ? [...selectedAmenities, amenity]
      : selectedAmenities.filter(a => a !== amenity);
    setSelectedAmenities(newAmenities);
    setVenuesToShow(3);
  };

  const handlePriceRangeChange = (range: [number, number]) => {
    setPriceRange(range);
    setVenuesToShow(3);
  };

  const handleCapacityRangeChange = (range: [number, number]) => {
    setCapacityRange(range);
    setVenuesToShow(3);
  };

  const handleAvailabilityChange = (status: string, checked: boolean) => {
    const newStatus = checked 
      ? [...selectedAvailability, status]
      : selectedAvailability.filter(s => s !== status);
    setSelectedAvailability(newStatus);
    setVenuesToShow(6);
  };

  const clearAllFilters = () => {
    setSelectedVenueTypes([]);
    setSelectedAmenities([]);
    setPriceRange([2000, 10000]);
    setCapacityRange([50, 1000]);
    setSelectedAvailability([]);
    setVenuesToShow(6);
  };

  const handleVenueCardClick = (venue: Venue) => {
    setSelectedVenue(venue);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedVenue(null);
  };

  const handleSelectVenue = (venue: Venue) => {
    handleVenueSelect(venue);
    handleModalClose();
  };

  const handleVenueSelect = (venue: Venue) => {
    // Transform venue data to match what PlanSummary expects
    const transformedVenue = {
      id: venue.id,
      name: venue.name,
      location: `${venue.city}, India`,
      capacity: venue.capacity,
      price: `${venue.price_per_person.toLocaleString('en-IN')} / person`,
      image: venue.image_url || getVenueImage(0),
      rating: venue.rating,
      description: venue.description,
      totalCost: venue.totalCost
    };

    navigate('/plan-summary', { 
      state: { 
        venue: transformedVenue, 
        formData 
      } 
    });
  };

  // Check if all venues are displayed
  const allVenuesDisplayed = displayedVenues.length >= filteredVenues.length;

  if (!isVisible) return null;

  return (
    <section id="results" className="py-16 animate-fade-in">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-white">AI Recommendations</h2>
          <p className="text-text-secondary">
            Perfect venues for your {formData?.eventType?.toLowerCase()} in {formData?.city}
          </p>
          {formData?.recommendations && formData.recommendations.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-2xl mx-auto">
              <h3 className="font-semibold text-blue-900 mb-2">AI Insights:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                {formData.recommendations.map((rec, index) => (
                  <li key={index}>• {rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-background-card rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-video bg-muted" />
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="h-5 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>
                  <div className="flex justify-between">
                    <div className="flex gap-4">
                      <div className="h-4 bg-muted rounded w-16" />
                      <div className="h-4 bg-muted rounded w-12" />
                    </div>
                    <div className="h-4 bg-muted rounded w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filter Sidebar */}
            <div className="lg:col-span-1">
              <VenueFilters
                selectedVenueTypes={selectedVenueTypes}
                selectedAmenities={selectedAmenities}
                priceRange={priceRange}
                capacityRange={capacityRange}
                selectedAvailability={selectedAvailability}
                onVenueTypeChange={handleVenueTypeChange}
                onAmenityChange={handleAmenityChange}
                onPriceRangeChange={handlePriceRangeChange}
                onCapacityRangeChange={handleCapacityRangeChange}
                onAvailabilityChange={handleAvailabilityChange}
                onClearAllFilters={clearAllFilters}
                isOpen={isFiltersOpen}
                onToggle={() => setIsFiltersOpen(!isFiltersOpen)}
                totalVenues={allVenues.length}
                filteredCount={filteredVenues.length}
              />
            </div>

            {/* Venues Grid */}
            <div className="lg:col-span-3">
              {noVenuesFound ? (
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-text-primary mb-2">No venues found</h3>
                      <p className="text-text-secondary mb-6">
                        Try adjusting your filters to find more venues that match your criteria.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={clearAllFilters}
                      >
                        Clear All Filters
                      </Button>
                    </div>
                  </div>
          </div>
        ) : (
          <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                    {displayedVenues.map((venue, index) => (
                                  <VenueCard
                    key={venue.id}
                    name={venue.name}
                    location={`${venue.city}`}
                    capacity={venue.capacity}
                    price={formatIndianCurrency(venue.totalCost)}
                    rating={venue.rating}
                    image={venue.image_url || getVenueImage(index)}
                          venueType={venue.venue_type}
                          amenities={venue.amenities}
                          contactPhone={venue.contact_phone}
                          contactEmail={venue.contact_email}
                          address={venue.address}
                          availabilityStatus={venue.availability_status}
                          wifiAvailable={venue.wifi_available}
                          parkingCapacity={venue.parking_capacity}
                          acAvailable={venue.ac_available}
                          cateringAvailable={venue.catering_available}
                          eventData={formData ? {
                            eventType: formData.eventType,
                            attendees: formData.attendees,
                            budget: formData.budget,
                            startDate: formData.startDate,
                            endDate: formData.endDate,
                            city: formData.city,
                            industry: 'General',
                            vipCount: 0
                          } : undefined}
                                       onClick={() => handleVenueCardClick(venue)}
                  />
              ))}
            </div>
            
            <div className="text-center">
              <p className="text-text-secondary mb-6">
                Click on any venue to generate your complete event plan
              </p>
              {formData?.totalCost && (
                <p className="text-lg font-semibold text-primary mb-4">
                  Starting from {formatIndianCurrency(formData.totalCost)}
                </p>
              )}
                    
                    {/* Show venue count and load more button */}
                    <div className="space-y-4">
                      <p className="text-sm text-text-secondary">
                        Showing {displayedVenues.length} of {filteredVenues.length} venues
                        {filteredVenues.length !== allVenues.length && (
                          <span className="text-purple-400"> (filtered from {allVenues.length} total)</span>
                        )}
                      </p>
                      
                                            {!allVenuesDisplayed && (
                        <Button 
                          variant="outline" 
                          size="lg"
                          onClick={loadMoreVenues}
                          disabled={loadingMore}
                          className="min-w-[200px] bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
                        >
                          {loadingMore ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Loading...
                            </>
                          ) : (
                            `Load More Venues (+${Math.min(6, filteredVenues.length - displayedVenues.length)})`
                          )}
                        </Button>
                      )}
                      
                      {allVenuesDisplayed && filteredVenues.length > 3 && (
                        <p className="text-sm text-text-secondary">
                          All {filteredVenues.length} venues displayed
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Venue Detail Modal */}
        <VenueDetailModal
          venue={selectedVenue}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSelectVenue={handleSelectVenue}
        />
      </div>
    </section>
  );
};

export default Results;