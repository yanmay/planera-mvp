import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  X, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Users, 
  IndianRupee,
  Wifi, 
  Car, 
  Snowflake, 
  Utensils,
  Building,
  Hotel,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  MessageCircle
} from "lucide-react";

interface VenueDetailModalProps {
  venue: {
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
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectVenue: (venue: any) => void;
}

// Mock image gallery - in real app, these would come from venue data
const mockImages = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop"
];

// Mock reviews
const mockReviews = [
  { id: 1, name: "Priya Sharma", rating: 5, comment: "Excellent venue with amazing service. Perfect for our corporate event!", date: "2024-01-15" },
  { id: 2, name: "Rajesh Kumar", rating: 4, comment: "Great location and facilities. Staff was very helpful.", date: "2024-01-10" },
  { id: 3, name: "Anita Patel", rating: 5, comment: "Beautiful venue, exceeded our expectations. Highly recommended!", date: "2024-01-05" }
];

const VenueDetailModal = ({ venue, isOpen, onClose, onSelectVenue }: VenueDetailModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  if (!venue) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % mockImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + mockImages.length) % mockImages.length);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle contact form submission
    console.log("Contact form submitted:", contactForm);
    // Reset form
    setContactForm({ name: "", email: "", phone: "", message: "" });
  };

  const formatIndianCurrency = (amount: number): string => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)} Crores`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)} Lakhs`;
    } else {
      return `₹${amount.toLocaleString('en-IN')}`;
    }
  };

  const getVenueTypeBadgeVariant = (venueType: string): string => {
    switch (venueType?.toLowerCase()) {
      case 'hotel':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'convention_center':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'banquet_hall':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatVenueType = (venueType: string): string => {
    return venueType
      ?.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ') || 'Venue';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-2xl font-bold">{venue.name}</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image Gallery & Basic Info */}
          <div className="space-y-6">
            {/* Image Gallery */}
            <div className="relative">
              <div className="aspect-video overflow-hidden rounded-lg">
                <img 
                  src={mockImages[currentImageIndex]} 
                  alt={`${venue.name} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Navigation Arrows */}
              <Button
                variant="ghost"
                size="sm"
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              
              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {mockImages.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Badge className={getVenueTypeBadgeVariant(venue.venue_type)}>
                  {formatVenueType(venue.venue_type)}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-semibold">{venue.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-text-secondary">
                  <Users className="w-4 h-4" />
                  <span>{venue.capacity} guests</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-text-secondary">
                <MapPin className="w-4 h-4" />
                <span>{venue.city}, India</span>
              </div>

              {venue.address && (
                <p className="text-sm text-text-secondary">{venue.address}</p>
              )}

              <div className="text-2xl font-bold text-primary">
                {formatIndianCurrency(venue.totalCost)}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">About This Venue</h3>
              <p className="text-text-secondary leading-relaxed">
                {venue.description || "A beautiful venue perfect for your special event. This venue offers excellent facilities and services to make your event memorable."}
              </p>
            </div>
          </div>

          {/* Right Column - Details & Contact */}
          <div className="space-y-6">
            {/* Amenities */}
            <div>
              <h3 className="font-semibold mb-3">Amenities & Services</h3>
              <div className="grid grid-cols-2 gap-3">
                {venue.wifi_available && (
                  <div className="flex items-center gap-2 text-sm">
                    <Wifi className="w-4 h-4 text-green-600" />
                    <span>Free WiFi</span>
                  </div>
                )}
                {venue.parking_capacity && venue.parking_capacity > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Car className="w-4 h-4 text-blue-600" />
                    <span>Parking ({venue.parking_capacity} spaces)</span>
                  </div>
                )}
                {venue.ac_available && (
                  <div className="flex items-center gap-2 text-sm">
                    <Snowflake className="w-4 h-4 text-cyan-600" />
                    <span>Air Conditioning</span>
                  </div>
                )}
                {venue.catering_available && (
                  <div className="flex items-center gap-2 text-sm">
                    <Utensils className="w-4 h-4 text-orange-600" />
                    <span>Catering Services</span>
                  </div>
                )}
                {venue.amenities?.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="capitalize">{amenity.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div>
              <h3 className="font-semibold mb-3">Pricing Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Per Person Rate:</span>
                  <span className="font-semibold">₹{venue.price_per_person.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Capacity:</span>
                  <span>{venue.capacity} guests</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Cost:</span>
                  <span className="font-semibold text-primary">{formatIndianCurrency(venue.totalCost)}</span>
                </div>
                <div className="text-xs text-text-secondary mt-2">
                  * Additional services like catering, decoration, and AV equipment may incur extra charges
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="font-semibold mb-3">Contact Information</h3>
              <div className="space-y-2 text-sm">
                {venue.contact_phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-text-secondary" />
                    <span>{venue.contact_phone}</span>
                  </div>
                )}
                {venue.contact_email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-text-secondary" />
                    <span>{venue.contact_email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h3 className="font-semibold mb-3">Send Inquiry</h3>
              <form onSubmit={handleContactSubmit} className="space-y-3">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Tell us about your event requirements..."
                    rows={3}
                  />
                </div>
                <Button type="submit" className="w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Inquiry
                </Button>
              </form>
            </div>

            {/* Reviews */}
            <div>
              <h3 className="font-semibold mb-3">Recent Reviews</h3>
              <div className="space-y-3">
                {mockReviews.map((review) => (
                  <div key={review.id} className="border border-border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{review.name}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-sm">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-text-secondary mb-1">{review.comment}</p>
                    <span className="text-xs text-text-secondary">{review.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Select Venue Button */}
            <div className="pt-4 border-t border-border">
              <Button 
                onClick={() => onSelectVenue(venue)}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                size="lg"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Select This Venue
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VenueDetailModal;
