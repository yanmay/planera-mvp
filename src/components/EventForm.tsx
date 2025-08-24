import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Users, MapPin, IndianRupee, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const EventForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    city: "",
    eventType: "Conference",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
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
    
    if (!formData.city || !formData.startDate || !formData.attendees) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onSubmit(formData);
      toast({
        title: "Venues Found!",
        description: "Found amazing venues for your event",
      });
    }, 2000);
  };

  return (
    <section id="event-form" className="py-16">
      <div className="container max-w-4xl mx-auto px-4">
        <Card className="bg-background-card border-border shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Describe Your Event
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  City *
                </Label>
                <Input
                  id="city"
                  placeholder="e.g., Mumbai, Bengaluru, Delhi"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="focus-ring"
                />
              </div>

              {/* Event Type */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Event Type</Label>
                <div className="flex flex-wrap gap-2">
                  {eventTypes.map((type) => (
                    <Button
                      key={type}
                      type="button"
                      variant={formData.eventType === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFormData({ ...formData, eventType: type })}
                      className="focus-ring"
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Event Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Start Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal focus-ring",
                          !formData.startDate && "text-text-secondary"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.startDate ? format(formData.startDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date) => setFormData({ ...formData, startDate: date })}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal focus-ring",
                          !formData.endDate && "text-text-secondary"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.endDate ? format(formData.endDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.endDate}
                        onSelect={(date) => setFormData({ ...formData, endDate: date })}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Attendees and Budget */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="attendees" className="text-sm font-medium flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Number of Attendees *
                  </Label>
                  <Input
                    id="attendees"
                    type="number"
                    placeholder="e.g., 150"
                    value={formData.attendees}
                    onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                    className="focus-ring"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-sm font-medium flex items-center gap-2">
                    <IndianRupee className="w-4 h-4" />
                    Your Budget (₹)
                  </Label>
                  <Input
                    id="budget"
                    placeholder="e.g., 5,00,000"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="focus-ring"
                  />
                </div>
              </div>

              {/* Venue Type */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Venue Type</Label>
                <div className="flex gap-2">
                  {venueTypes.map((type) => (
                    <Button
                      key={type}
                      type="button"
                      variant={formData.venueType === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFormData({ ...formData, venueType: type })}
                      className="focus-ring"
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Preferences */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Preferences</Label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.parking}
                      onChange={(e) => setFormData({ ...formData, parking: e.target.checked })}
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-sm">Parking Required</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.wheelchair}
                      onChange={(e) => setFormData({ ...formData, wheelchair: e.target.checked })}
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-sm">Wheelchair Accessible</span>
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
                  className="w-full focus-ring"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Finding...
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