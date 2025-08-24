import { Target, Zap, Network, Eye, RotateCcw, Brain } from "lucide-react";

const AboutUs = () => {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6">About us</h2>
          <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            We're building the future of execution, where intelligent agents work as true partners to amplify human creativity and achieve extraordinary results.
          </p>
        </div>

        {/* Mission Card */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-3xl p-12 text-center max-w-4xl mx-auto border border-primary/20">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-8">
              <Target className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-4xl font-bold text-white mb-6">Our Mission</h3>
            <p className="text-lg text-white/80 leading-relaxed">
              Our mission is to cut the power of autonomous planning into the hands of creators, leaders, and organizations everywhere. We believe that by enabling optimal decision-making and empowering human potential, we can create a world where innovation thrives.
            </p>
          </div>
        </div>

        {/* Supporting Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Card 1: AI at the Core */}
          <div className="bg-background-card border border-border rounded-2xl p-8">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">AI at the Core</h3>
            <p className="text-white/70 leading-relaxed">
              We are deeply committed to an AI-first future. We believe intelligent automation isn't just a feature - it's the fundamental engine that will drive the next generation of productivity and success.
            </p>
          </div>

          {/* Card 2: Human-Amplified, Not Replaced */}
          <div className="bg-background-card border border-border rounded-2xl p-8">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6">
              <Network className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Human-Amplified, Not Replaced</h3>
            <p className="text-white/70 leading-relaxed">
              Our technology is designed to be a co-pilot, not an autopilot. We build tools that augment human intuition and creativity, empowering you to achieve results that were previously unimaginable.
            </p>
          </div>

          {/* Card 3: Radical Transparency */}
          <div className="bg-background-card border border-border rounded-2xl p-8">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6">
              <Eye className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Radical Transparency</h3>
            <p className="text-white/70 leading-relaxed">
              Trust is built on clarity. You should never wonder what your AI is doing. Every plan, decision, and action is logged and fully explainable, giving you complete visibility and ultimate control.
            </p>
          </div>

          {/* Card 4: Obsessed with Efficiency */}
          <div className="bg-background-card border border-border rounded-2xl p-8">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6">
              <RotateCcw className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Obsessed with Efficiency</h3>
            <p className="text-white/70 leading-relaxed">
              We believe your most valuable resource is your time. Our agents are engineered to autonomously handle the repetitive, time-consuming tasks of planning, freeing you to focus on high-impact strategic work.
            </p>
          </div>
        </div>

        {/* Bottom Featured Card */}
        <div className="bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-3xl p-12 text-center max-w-4xl mx-auto border border-primary/20">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-8">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-4xl font-bold text-white mb-6">Built on a Foundation of Innovation</h3>
          <p className="text-lg text-white/80 leading-relaxed">
            Our agents are powered by the latest advances in machine learning and natural language processing. This foundation allows them to provide comprehensive and dynamic planning that adapts to your evolving needs.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;