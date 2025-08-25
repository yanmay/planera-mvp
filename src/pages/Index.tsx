import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import EventForm from "@/components/EventForm";
import Results from "@/components/Results";
import AboutUs from "@/components/AboutUs";
import Footer from "@/components/Footer";

// Types for the form data
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
  totalCost?: number;
}

const Index = () => {
  const [showResults, setShowResults] = useState(false);
  const [eventData, setEventData] = useState<FormData | null>(null);

  const handleFormSubmit = (data: FormData) => {
    setEventData(data);
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <Hero />
        <Features />
        <EventForm onSubmit={handleFormSubmit} />
        <Results isVisible={showResults} formData={eventData} />
        <AboutUs />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;