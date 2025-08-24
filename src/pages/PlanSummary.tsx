import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, Link, MapPin, Users, Calendar, IndianRupee } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const PlanSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { venue, formData } = location.state || {};

  if (!venue || !formData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Plan not found</h1>
          <Button onClick={() => navigate('/')}>Return Home</Button>
        </div>
      </div>
    );
  }

  const handleDownloadPDF = () => {
    toast({
      title: "PDF Generated",
      description: "Your event plan has been downloaded",
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "Share link copied to clipboard",
    });
  };

  const scheduleItems = [
    { time: "09:00", activity: "Registration & Welcome Coffee" },
    { time: "10:00", activity: "Opening Keynote Address" },
    { time: "11:30", activity: "Networking Break" },
    { time: "12:00", activity: "Panel Discussion" },
    { time: "13:00", activity: "Lunch Break" },
    { time: "14:30", activity: "Workshop Sessions" },
    { time: "16:00", activity: "Q&A Session" },
    { time: "17:00", activity: "Closing Remarks" },
  ];

  const budgetItems = [
    { item: "Venue Rental (3 days)", cost: venue.price.replace(" / day", ""), notes: "Including basic setup" },
    { item: "Catering (150 attendees)", cost: "2.1 Lakhs", notes: "Breakfast, lunch, snacks" },
    { item: "AV Equipment", cost: "85,000", notes: "Projectors, mics, lighting" },
    { item: "Photography", cost: "45,000", notes: "Event documentation" },
    { item: "Miscellaneous", cost: "30,000", notes: "Decorations, materials" },
  ];

  const totalCost = "7.6 Lakhs";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur-md bg-background/80">
        <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Planning
          </Button>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleCopyLink}>
              <Link className="w-4 h-4 mr-2" />
              Copy Share Link
            </Button>
            <Button variant="hero" onClick={handleDownloadPDF}>
              <Download className="w-4 h-4 mr-2" />
              Download as PDF
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Title Block */}
        <Card className="bg-background-card border-border">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              AI-Generated Event Plan: {formData.eventType} in {formData.city}
            </CardTitle>
            <p className="text-text-secondary">
              Complete event planning solution for {formData.attendees} attendees
            </p>
          </CardHeader>
        </Card>

        {/* Venue Details */}
        <Card className="bg-background-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Venue Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <img 
                  src={venue.image} 
                  alt={venue.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold">{venue.name}</h3>
                <p className="text-text-secondary">{venue.location}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Capacity: {venue.capacity} guests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4" />
                    <span>Rate: ₹{venue.price}</span>
                  </div>
                  {formData.startDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {format(new Date(formData.startDate), "PPP")}
                        {formData.endDate && ` - ${format(new Date(formData.endDate), "PPP")}`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card className="bg-background-card border-border">
          <CardHeader>
            <CardTitle>Event Schedule</CardTitle>
            <p className="text-text-secondary">Day 1: Main Event</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scheduleItems.map((item, index) => (
                <div key={index} className="flex items-center gap-4 py-2 border-b border-border/30 last:border-0">
                  <div className="text-sm font-medium text-primary w-16">
                    {item.time}
                  </div>
                  <div className="flex-1 text-sm">
                    {item.activity}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Budget Breakdown */}
        <Card className="bg-background-card border-border">
          <CardHeader>
            <CardTitle>Budget Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {budgetItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
                  <div className="flex-1">
                    <div className="font-medium">{item.item}</div>
                    <div className="text-sm text-text-secondary">{item.notes}</div>
                  </div>
                  <div className="font-semibold text-primary">
                    ₹{item.cost}
                  </div>
                </div>
              ))}
              
              <div className="flex items-center justify-between py-4 border-t-2 border-primary/20 mt-4">
                <div className="text-lg font-bold">Total Estimated Cost</div>
                <div className="text-xl font-bold text-primary">₹{totalCost}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PlanSummary;