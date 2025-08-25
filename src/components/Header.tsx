import { Button } from "@/components/ui/button";
import "./Logo.css";

const Header = (): JSX.Element => {
  const scrollToForm = (): void => {
    const formElement = document.getElementById('event-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur-md bg-black/80">
      <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center">
          <div className="flex items-center space-x-2">
            <img src="/logo.svg" alt="Planera Logo" className="logo-svg logo-small" />
            <h1 className="text-xl font-bold text-white">Planera</h1>
          </div>
        </div>
        
        {/* CTA Button */}
        <Button 
          variant="hero" 
          onClick={scrollToForm}
          className="focus-ring bg-primary hover:bg-primary/90"
        >
          Start Planning
        </Button>
      </div>
    </header>
  );
};

export default Header;