import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  const scrollToForm = () => {
    const formElement = document.getElementById('event-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToDashboard = () => {
    // Placeholder for dashboard navigation
    console.log('Navigate to dashboard');
  };

  return (
    <section className="relative min-h-screen bg-black overflow-hidden flex items-center">
      {/* Purple Gradient Circle */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-30">
        <div className="w-full h-full bg-gradient-to-br from-primary via-purple-500 to-pink-500 rounded-full blur-3xl"></div>
      </div>
      
      {/* Content */}
      <div className="container relative z-10 max-w-7xl mx-auto px-6">
        <div className="max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-bold text-white leading-none mb-8">
            Not Just Smart.
            <br />
            <span className="hero-text-gradient">Self-Directed</span>
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-8">
            <Button 
              variant="hero" 
              size="lg" 
              onClick={scrollToForm}
              className="text-lg px-8 py-4 h-auto focus-ring bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
            >
              Start Planning
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              onClick={scrollToDashboard}
              className="text-lg px-8 py-4 h-auto focus-ring border-white/20 text-white bg-transparent hover:bg-white/10"
            >
              View Dashboard
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;