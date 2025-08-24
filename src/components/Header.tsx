import { Button } from "@/components/ui/button";

const Header = () => {
  const scrollToForm = () => {
    const formElement = document.getElementById('event-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur-md bg-background/80">
      <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-primary">Planera</h1>
        </div>
        
        <Button 
          variant="hero" 
          onClick={scrollToForm}
          className="focus-ring"
        >
          Start Planning
        </Button>
      </div>
    </header>
  );
};

export default Header;