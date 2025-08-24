import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-corporate-event.jpg";

const Hero = () => {
  const scrollToForm = () => {
    const formElement = document.getElementById('event-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Modern corporate event venue in India"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-background/30" />
      </div>
      
      {/* Content */}
      <div className="container relative z-10 max-w-7xl mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Plan your next corporate event in{" "}
            <span className="hero-text-gradient">India</span>{" "}
            with{" "}
            <span className="hero-text-gradient">AI</span>
          </h1>
          
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Get instant, intelligent venue recommendations from India's top cities.
            Tailored for the Indian market, from Mumbai to Bengaluru.
          </p>
          
          <div className="pt-6">
            <Button 
              variant="hero" 
              size="lg" 
              onClick={scrollToForm}
              className="text-lg px-8 py-4 h-auto focus-ring animate-glow"
            >
              Start Planning Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;