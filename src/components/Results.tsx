import { useState, useEffect } from "react";
import VenueCard from "./VenueCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import venueImage1 from "@/assets/venue-taj-lands-end.jpg";
import venueImage2 from "@/assets/venue-itc-grand-chola.jpg";
import venueImage3 from "@/assets/venue-leela-palace.jpg";

interface ResultsProps {
  isVisible: boolean;
  formData: any;
}

const Results = ({ isVisible, formData }: ResultsProps) => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsLoading(true);
      // Simulate loading venues
      setTimeout(() => {
        setVenues([
          {
            id: 1,
            name: "Taj Lands End",
            location: "Bandra, Mumbai",
            capacity: 500,
            price: "4.5 Lakhs / day",
            rating: 4.8,
            image: venueImage1
          },
          {
            id: 2,
            name: "ITC Grand Chola",
            location: "Guindy, Chennai",
            capacity: 300,
            price: "3.2 Lakhs / day",
            rating: 4.7,
            image: venueImage2
          },
          {
            id: 3,
            name: "The Leela Palace",
            location: "UB City, Bengaluru",
            capacity: 400,
            price: "4.0 Lakhs / day",
            rating: 4.9,
            image: venueImage3
          }
        ]);
        setIsLoading(false);
        // Scroll to results
        setTimeout(() => {
          const resultsElement = document.getElementById('results');
          if (resultsElement) {
            resultsElement.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }, 1500);
    }
  }, [isVisible]);

  const handleVenueSelect = (venue: any) => {
    navigate('/plan-summary', { 
      state: { 
        venue, 
        formData 
      } 
    });
  };

  if (!isVisible) return null;

  return (
    <section id="results" className="py-16 animate-fade-in">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">AI Recommendations</h2>
          <p className="text-text-secondary">Perfect venues for your {formData.eventType?.toLowerCase()} in {formData.city}</p>
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {venues.map((venue) => (
                <VenueCard
                  key={venue.id}
                  name={venue.name}
                  location={venue.location}
                  capacity={venue.capacity}
                  price={venue.price}
                  rating={venue.rating}
                  image={venue.image}
                  onClick={() => handleVenueSelect(venue)}
                />
              ))}
            </div>
            
            <div className="text-center">
              <p className="text-text-secondary mb-6">
                Click on any venue to generate your complete event plan
              </p>
              <Button variant="outline" size="lg">
                View More Venues
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Results;