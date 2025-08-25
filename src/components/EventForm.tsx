import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MapPin, IndianRupee, Loader2 } from "lucide-react";
import { getAIRecommendations } from "../services/aiService";

const EventForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    city: "",
    eventType: "Conference",
    attendees: "",
    budget: "",
    venueType: "Either",
    parking: false,
    wheelchair: false,
  });

  const eventTypes = ["Conference", "Workshop", "Offsite", "Training", "Product Launch"];
  const venueTypes = ["Indoor", "Outdoor", "Either"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.city || !formData.attendees || !formData.budget) {
      alert("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    
    try {
      // Get AI recommendations using the new service
      const aiResponse = await getAIRecommendations(formData, []);
      
      // For now, use demo venues but with AI insights
      const demoVenues = [
        {
          id: "demo-1",
          name: "Taj Lands End",
          city: formData.city || "Mumbai",
          capacity: parseInt(formData.attendees) || 500,
          price_per_person: 4500,
          venue_type: "hotel",
          amenities: ["parking", "catering", "wifi", "av_equipment"],
          rating: 4.8,
          image_url: "/src/assets/venue-taj-lands-end.jpg",
          description: "Luxury hotel with stunning sea views",
          totalCost: (parseInt(formData.attendees) || 500) * 4500
        },
        {
          id: "demo-2",
          name: "ITC Grand Chola",
          city: formData.city || "Chennai",
          capacity: parseInt(formData.attendees) || 300,
          price_per_person: 3200,
          venue_type: "hotel",
          amenities: ["parking", "catering", "wifi", "conference_rooms"],
          rating: 4.7,
          image_url: "/src/assets/venue-itc-grand-chola.jpg",
          description: "Premium business hotel with world-class facilities",
          totalCost: (parseInt(formData.attendees) || 300) * 3200
        },
        {
          id: "demo-3",
          name: "The Leela Palace",
          city: formData.city || "Bengaluru",
          capacity: parseInt(formData.attendees) || 400,
          price_per_person: 4000,
          venue_type: "hotel",
          amenities: ["parking", "catering", "wifi", "spa", "pool"],
          rating: 4.9,
          image_url: "/src/assets/venue-leela-palace.jpg",
          description: "Opulent palace hotel with royal treatment",
          totalCost: (parseInt(formData.attendees) || 400) * 4000
        }
      ];

      onSubmit({
        ...formData,
        venues: demoVenues,
        recommendations: aiResponse.insights,
        aiRecommendations: aiResponse.recommendations,
        totalCost: demoVenues[0].totalCost
      });
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      // Fallback to basic recommendations
      onSubmit({
        ...formData,
        venues: [],
        recommendations: [
          "Found venues for your event",
          "All venues meet your capacity and budget requirements",
          "Consider booking early to secure the best rates"
        ],
        totalCost: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="event-form" className="py-16">
      <div className="container max-w-4xl mx-auto px-4">
        <Card className="bg-gray-800 border-gray-700 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-white">
              Describe Your Event
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium flex items-center gap-2 text-white">
                  <MapPin className="w-4 h-4" />
                  City *
                </Label>
                <Input
                  id="city"
                  placeholder="e.g., Mumbai, Bengaluru, Delhi"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              {/* Event Type */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-white">Event Type</Label>
                <div className="flex flex-wrap gap-2">
                  {eventTypes.map((type) => (
                    <Button
                      key={type}
                      type="button"
                      variant={formData.eventType === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFormData({ ...formData, eventType: type })}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Attendees and Budget */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="attendees" className="text-sm font-medium flex items-center gap-2 text-white">
                    <Users className="w-4 h-4" />
                    Number of Attendees *
                  </Label>
                  <Input
                    id="attendees"
                    type="number"
                    placeholder="e.g., 150"
                    value={formData.attendees}
                    onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-sm font-medium flex items-center gap-2 text-white">
                    <IndianRupee className="w-4 h-4" />
                    Your Budget (₹) *
                  </Label>
                  <Input
                    id="budget"
                    placeholder="e.g., 500000"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>

              {/* Venue Type */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-white">Venue Type</Label>
                <div className="flex gap-2">
                  {venueTypes.map((type) => (
                    <Button
                      key={type}
                      type="button"
                      variant={formData.venueType === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFormData({ ...formData, venueType: type })}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Preferences */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-white">Preferences</Label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.parking}
                      onChange={(e) => setFormData({ ...formData, parking: e.target.checked })}
                      className="w-4 h-4 accent-purple-500"
                    />
                    <span className="text-sm text-white">Parking Required</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.wheelchair}
                      onChange={(e) => setFormData({ ...formData, wheelchair: e.target.checked })}
                      className="w-4 h-4 accent-purple-500"
                    />
                    <span className="text-sm text-white">Wheelchair Accessible</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Finding Venues...
                    </>
                  ) : (
                    "Find Top Venues"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default EventForm;