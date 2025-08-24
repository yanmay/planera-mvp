import { Network, GitBranch, Puzzle, GitMerge } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Network,
      title: "From Vision to Venue",
      description: "Instantly transforms a client's vision into a complete, actionable plan, perfectly matching venues and vendors to their theme and budget."
    },
    {
      icon: GitBranch,
      title: "The Perfect Itinerary, Instantly",
      description: "Automatically generates a detailed run-of-show, from key vendor deadlines to the final, minute-by-minute event day schedule."
    },
    {
      icon: Puzzle,
      title: "Your 24/7 Planning Assistant",
      description: "Automates the tedious research by scouring for venues, comparing vendors, and gathering logistics, freeing you to focus on client relationships."
    },
    {
      icon: GitMerge,
      title: "Effortless Last-Minute Changes",
      description: "Flawlessly handle any last-minute change. Simply input the new requirements and watch as the entire itinerary and budget update instantly."
    }
  ];

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Powerful AI Planning Features
          </h2>
          <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            A complete system to help you strategize, execute, and evolve your plans on demand.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index}
                className="bg-background-card border border-primary/20 rounded-2xl p-8 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                  <IconComponent className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;