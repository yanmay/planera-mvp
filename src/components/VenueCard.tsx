import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  IndianRupee, 
  Star, 
  MapPin, 
  Wifi, 
  Car, 
  Snowflake, 
  Utensils, 
  Phone, 
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

interface VenueCardProps {
  name: string;
  location: string;
  capacity: number;
  price: string;
  rating: number;
  image: string;
  venueType?: string;
  amenities?: string[];
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  availabilityStatus?: string;
  wifiAvailable?: boolean;
  parkingCapacity?: number;
  acAvailable?: boolean;
  cateringAvailable?: boolean;
  onClick?: () => void;
}

// Helper function to get venue type badge color
const getVenueTypeBadgeVariant = (venueType: string): string => {
  switch (venueType?.toLowerCase()) {
    case 'hotel':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'convention_center':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'banquet_hall':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'auditorium':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'outdoor':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'heritage':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'resort':
      return 'bg-teal-100 text-teal-800 border-teal-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Helper function to get availability status icon and color
const getAvailabilityStatus = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'available':
      return { icon: CheckCircle, color: 'text-green-500', text: 'Available' };
    case 'booked':
      return { icon: XCircle, color: 'text-red-500', text: 'Booked' };
    case 'maintenance':
      return { icon: AlertCircle, color: 'text-yellow-500', text: 'Maintenance' };
    default:
      return { icon: Clock, color: 'text-gray-500', text: 'Check Availability' };
  }
};

// Helper function to format venue type for display
const formatVenueType = (venueType: string): string => {
  return venueType
    ?.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') || 'Venue';
};

const VenueCard = ({ 
  name, 
  location, 
  capacity, 
  price, 
  rating, 
  image, 
  venueType,
  amenities = [],
  contactPhone,
  contactEmail,
  address,
  availabilityStatus = 'available',
  wifiAvailable = true,
  parkingCapacity,
  acAvailable = true,
  cateringAvailable = false,
  onClick 
}: VenueCardProps) => {
  const availability = getAvailabilityStatus(availabilityStatus);
  const AvailabilityIcon = availability.icon;

  return (
    <Card 
      className="bg-background-card border-border card-hover cursor-pointer group overflow-hidden"
      onClick={onClick}
    >
      <div className="aspect-video overflow-hidden relative">
        <img 
          src={image} 
          alt={`${name} venue`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Venue Type Badge */}
        {venueType && (
          <div className="absolute top-3 left-3">
            <Badge className={`${getVenueTypeBadgeVariant(venueType)} text-xs font-medium`}>
              {formatVenueType(venueType)}
            </Badge>
          </div>
        )}
        
        {/* Availability Status Badge */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-white/90 backdrop-blur-sm text-xs font-medium flex items-center gap-1">
            <AvailabilityIcon className={`w-3 h-3 ${availability.color}`} />
            <span className={availability.color}>{availability.text}</span>
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6 space-y-4">
        {/* Venue Name and Location */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-text-primary group-hover:text-primary transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-1 text-text-secondary">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{location}</span>
          </div>
        </div>
        
        {/* Address */}
        {address && (
          <div className="text-xs text-text-secondary leading-relaxed">
            {address}
          </div>
        )}
        
        {/* Key Amenities */}
        <div className="flex flex-wrap gap-2">
          {wifiAvailable && (
            <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <Wifi className="w-3 h-3" />
              <span>WiFi</span>
            </div>
          )}
          {parkingCapacity && parkingCapacity > 0 && (
            <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              <Car className="w-3 h-3" />
              <span>Parking ({parkingCapacity})</span>
            </div>
          )}
          {acAvailable && (
            <div className="flex items-center gap-1 text-xs text-cyan-600 bg-cyan-50 px-2 py-1 rounded-full">
              <Snowflake className="w-3 h-3" />
              <span>AC</span>
            </div>
          )}
          {cateringAvailable && (
            <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
              <Utensils className="w-3 h-3" />
              <span>Catering</span>
            </div>
          )}
        </div>
        
        {/* Contact Information */}
        {(contactPhone || contactEmail) && (
          <div className="space-y-1">
            {contactPhone && (
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <Phone className="w-3 h-3" />
                <span>{contactPhone}</span>
              </div>
            )}
            {contactEmail && (
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <Mail className="w-3 h-3" />
                <span className="truncate">{contactEmail}</span>
              </div>
            )}
          </div>
        )}
        
        {/* Capacity, Rating, and Price */}
        <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-text-secondary" />
              <span>{capacity} Guests</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span>{rating}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 font-semibold text-primary">
            <IndianRupee className="w-4 h-4" />
            <span>{price}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VenueCard;