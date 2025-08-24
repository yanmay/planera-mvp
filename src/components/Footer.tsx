const Footer = () => {
  return (
    <footer className="border-t border-border/40 py-8 mt-16">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center space-y-4">
          <p className="text-text-secondary text-sm">
            © 2025 Planera by Hackanauts
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <a 
              href="#" 
              className="text-text-secondary hover:text-primary transition-colors"
            >
              Contact
            </a>
            <a 
              href="#" 
              className="text-text-secondary hover:text-primary transition-colors"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;