import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import EventForm from "@/components/EventForm";
import Results from "@/components/Results";
import AboutUs from "@/components/AboutUs";
import Footer from "@/components/Footer";

const Index = () => {
  const [showResults, setShowResults] = useState(false);
  const [eventData, setEventData] = useState(null);

  const handleFormSubmit = (data: any) => {
    setEventData(data);
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <Hero />
        <EventForm onSubmit={handleFormSubmit} />
        <Results isVisible={showResults} formData={eventData} />
        <AboutUs />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;