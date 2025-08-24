import { Button } from "@/components/ui/button";

const Header = () => {
  const scrollToForm = () => {
    const formElement = document.getElementById('event-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = ['Home', 'About', 'Dashboard', 'Create Task', 'Contact'];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur-md bg-black/80">
      <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <h1 className="text-xl font-bold text-white">Planera</h1>
          </div>
        </div>
        
        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <a 
              key={item} 
              href="#" 
              className="text-white/80 hover:text-white transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </nav>
        
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