import { Card, CardContent } from "@/components/ui/card";
import { Users, IndianRupee, Star, MapPin } from "lucide-react";

interface VenueCardProps {
  name: string;
  location: string;
  capacity: number;
  price: string;
  rating: number;
  image: string;
  onClick?: () => void;
}

const VenueCard = ({ name, location, capacity, price, rating, image, onClick }: VenueCardProps) => {
  return (
    <Card 
      className="bg-background-card border-border card-hover cursor-pointer group overflow-hidden"
      onClick={onClick}
    >
      <div className="aspect-video overflow-hidden">
        <img 
          src={image} 
          alt={`${name} venue`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-text-primary group-hover:text-primary transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-1 text-text-secondary">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{location}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
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