import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = (): JSX.Element => {
  const scrollToForm = (): void => {
    const formElement = document.getElementById('event-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen bg-black overflow-hidden flex items-center">
      {/* Simple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20"></div>
      
      <div className="container relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Hero Content */}
          <div className="max-w-2xl">
            <h1 className="text-6xl md:text-8xl font-bold text-white leading-none mb-8">
              Not Just Smart.
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Self-Directed
              </span>
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <Button 
                variant="hero" 
                size="lg" 
                onClick={scrollToForm}
                className="text-lg px-8 py-4 h-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Start Planning
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
          
          {/* Right Column - Simple placeholder */}
          <div className="flex justify-center lg:justify-end items-center">
            <div className="w-[500px] h-[500px] lg:w-[700px] lg:h-[700px] bg-gradient-to-br from-purple-600/10 to-blue-600/10 rounded-full flex items-center justify-center border border-purple-500/20">
              <div className="text-center text-white/60">
                <div className="text-4xl mb-4">🌍</div>
                <p className="text-lg font-medium">Interactive Globe</p>
                <p className="text-sm opacity-75">Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;