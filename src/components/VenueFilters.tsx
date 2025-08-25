import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp,
  Wifi, 
  Car, 
  Snowflake, 
  Utensils,
  Building,
  Hotel,
  Calendar,
  Users,
  IndianRupee
} from "lucide-react";

interface FilterState {
  venueTypes: string[];
  amenities: string[];
  priceRange: [number, number];
  capacityRange: [number, number];
  availabilityStatus: string[];
}

interface VenueFiltersProps {
  selectedVenueTypes: string[];
  selectedAmenities: string[];
  priceRange: [number, number];
  capacityRange: [number, number];
  selectedAvailability: string[];
  onVenueTypeChange: (venueType: string, checked: boolean) => void;
  onAmenityChange: (amenity: string, checked: boolean) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onCapacityRangeChange: (range: [number, number]) => void;
  onAvailabilityChange: (status: string, checked: boolean) => void;
  onClearAllFilters: () => void;
  isOpen: boolean;
  onToggle: () => void;
  totalVenues: number;
  filteredCount: number;
}

const venueTypeOptions = [
  { id: 'hotel', label: 'Hotel', icon: Hotel },
  { id: 'convention_center', label: 'Convention Center', icon: Building },
  { id: 'banquet_hall', label: 'Banquet Hall', icon: Calendar },
  { id: 'auditorium', label: 'Auditorium', icon: Building },
  { id: 'outdoor', label: 'Outdoor', icon: Calendar },
  { id: 'heritage', label: 'Heritage', icon: Building },
  { id: 'resort', label: 'Resort', icon: Hotel }
];

const amenityOptions = [
  { id: 'wifi', label: 'WiFi', icon: Wifi },
  { id: 'parking', label: 'Parking', icon: Car },
  { id: 'ac', label: 'Air Conditioning', icon: Snowflake },
  { id: 'catering', label: 'Catering', icon: Utensils }
];

const availabilityOptions = [
  { id: 'available', label: 'Available' },
  { id: 'booked', label: 'Booked' },
  { id: 'maintenance', label: 'Maintenance' }
];

const VenueFilters = ({ 
  selectedVenueTypes,
  selectedAmenities,
  priceRange,
  capacityRange,
  selectedAvailability,
  onVenueTypeChange,
  onAmenityChange,
  onPriceRangeChange,
  onCapacityRangeChange,
  onAvailabilityChange,
  onClearAllFilters,
  isOpen, 
  onToggle, 
  totalVenues, 
  filteredCount 
}: VenueFiltersProps) => {
  const [expandedSections, setExpandedSections] = useState({
    venueTypes: true,
    amenities: true,
    priceRange: true,
    capacityRange: true,
    availability: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const hasActiveFilters = () => {
    return selectedVenueTypes.length > 0 ||
           selectedAmenities.length > 0 ||
           priceRange[0] !== 2000 ||
           priceRange[1] !== 10000 ||
           capacityRange[0] !== 50 ||
           capacityRange[1] !== 1000 ||
           selectedAvailability.length > 0;
  };

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden mb-6">
        <Button
          variant="outline"
          onClick={onToggle}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {hasActiveFilters() && (
              <Badge variant="secondary" className="ml-2">
                {filteredCount} of {totalVenues}
              </Badge>
            )}
          </div>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </div>

      {/* Filter Sidebar */}
      <div className={`
        ${isOpen ? 'block' : 'hidden'} 
        lg:block 
        bg-background-card 
        border 
        border-border 
        rounded-lg 
        p-6 
        h-fit 
        sticky 
        top-6
        ${isOpen ? 'mb-6' : ''}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            <h3 className="font-semibold text-lg">Filters</h3>
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters() && (
              <Badge variant="secondary">
                {filteredCount} of {totalVenues}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="lg:hidden"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

                 {/* Clear All Button */}
         {hasActiveFilters() && (
           <Button
             variant="outline"
             size="sm"
             onClick={onClearAllFilters}
             className="w-full mb-6"
           >
             Clear All Filters
           </Button>
         )}

        {/* Venue Types Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('venueTypes')}
            className="flex items-center justify-between w-full mb-3 text-left"
          >
            <span className="font-medium">Venue Type</span>
            {expandedSections.venueTypes ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
                     {expandedSections.venueTypes && (
             <div className="space-y-2">
               {venueTypeOptions.map((option) => {
                 const Icon = option.icon;
                 return (
                   <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                     <Checkbox
                       checked={selectedVenueTypes.includes(option.id)}
                       onCheckedChange={(checked) => onVenueTypeChange(option.id, checked as boolean)}
                     />
                     <Icon className="w-4 h-4 text-text-secondary" />
                     <span className="text-sm">{option.label}</span>
                   </label>
                 );
               })}
             </div>
           )}
        </div>

        {/* Amenities Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('amenities')}
            className="flex items-center justify-between w-full mb-3 text-left"
          >
            <span className="font-medium">Amenities</span>
            {expandedSections.amenities ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
                     {expandedSections.amenities && (
             <div className="space-y-2">
               {amenityOptions.map((option) => {
                 const Icon = option.icon;
                 return (
                   <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                     <Checkbox
                       checked={selectedAmenities.includes(option.id)}
                       onCheckedChange={(checked) => onAmenityChange(option.id, checked as boolean)}
                     />
                     <Icon className="w-4 h-4 text-text-secondary" />
                     <span className="text-sm">{option.label}</span>
                   </label>
                 );
               })}
             </div>
           )}
        </div>

        {/* Price Range Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('priceRange')}
            className="flex items-center justify-between w-full mb-3 text-left"
          >
            <span className="font-medium">Price Range (₹)</span>
            {expandedSections.priceRange ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
                     {expandedSections.priceRange && (
             <div className="space-y-4">
               <Slider
                 value={priceRange}
                 onValueChange={(value) => onPriceRangeChange(value as [number, number])}
                 max={10000}
                 min={2000}
                 step={500}
                 className="w-full"
               />
               <div className="flex justify-between text-sm text-text-secondary">
                 <span>₹{priceRange[0].toLocaleString()}</span>
                 <span>₹{priceRange[1].toLocaleString()}</span>
               </div>
             </div>
           )}
        </div>

        {/* Capacity Range Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('capacityRange')}
            className="flex items-center justify-between w-full mb-3 text-left"
          >
            <span className="font-medium">Capacity Range</span>
            {expandedSections.capacityRange ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
                     {expandedSections.capacityRange && (
             <div className="space-y-4">
               <Slider
                 value={capacityRange}
                 onValueChange={(value) => onCapacityRangeChange(value as [number, number])}
                 max={1000}
                 min={50}
                 step={50}
                 className="w-full"
               />
               <div className="flex justify-between text-sm text-text-secondary">
                 <span>{capacityRange[0]} guests</span>
                 <span>{capacityRange[1]} guests</span>
               </div>
             </div>
           )}
        </div>

        {/* Availability Status Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('availability')}
            className="flex items-center justify-between w-full mb-3 text-left"
          >
            <span className="font-medium">Availability</span>
            {expandedSections.availability ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
                     {expandedSections.availability && (
             <div className="space-y-2">
               {availabilityOptions.map((option) => (
                 <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                   <Checkbox
                     checked={selectedAvailability.includes(option.id)}
                     onCheckedChange={(checked) => onAvailabilityChange(option.id, checked as boolean)}
                   />
                   <span className="text-sm">{option.label}</span>
                 </label>
               ))}
             </div>
           )}
        </div>
      </div>
    </>
  );
};

export default VenueFilters;
