import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { initGradient } from "@/lib/gradient";

const Hero = (): JSX.Element => {
  useEffect(() => {
    initGradient('#gradient-canvas');
  }, []);
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
          {/* Right Column - Visuals */}
          <div className="relative flex justify-center items-center">
            <div className="relative w-full h-[500px] lg:h-[700px] max-w-[700px]">
              {/* Floating code card */}
              <div className="floating absolute left-[20%] top-[30%] -translate-x-1/2 -translate-y-1/2 transform z-10 backdrop-blur-sm bg-black/20 p-4 rounded-xl hidden sm:block">
                <div className="bg-slate-800/70 backdrop-blur-lg border border-slate-700/50 rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="text-xs text-gray-400">scene.js</div>
                  </div>
                  <div className="text-xs md:text-sm font-[384] leading-6 text-gray-300 font-mono">
                    <div className="mb-1"><span className="text-purple-400">import</span> {" { "}<span className="text-green-400">Scene</span>{" } "}<span className="text-purple-400">from</span> <span className="text-yellow-400">'@engine/core'</span>;</div>
                    <div className="mb-1">&nbsp;</div>
                    <div className="mb-1"><span className="text-purple-400">const</span> <span className="text-blue-400">scene</span> = <span className="text-green-400">new Scene</span>({"{"})</div>
                    <div className="mb-1 ml-4"><span className="text-indigo-400">lighting</span>: <span className="text-yellow-400">'ambient'</span>,</div>
                    <div className="mb-1 ml-4"><span className="text-indigo-400">particles</span>: <span className="text-purple-400">true</span>,</div>
                    <div className="mb-1 ml-4"><span className="text-indigo-400">interactive</span>: <span className="text-purple-400">true</span></div>
                    <div className="mb-1">{"}"});</div>
                    <div className="mb-1">&nbsp;</div>
                    <div><span className="text-blue-400">scene</span>.<span className="text-green-400">render</span>();</div>
                  </div>
                </div>
              </div>

              {/* Spline container */}
              <div className="spline-container absolute inset-0 rounded-2xl overflow-hidden border border-purple-500/20 shadow-2xl">
                <iframe
                  src='https://my.spline.design/untitled-f680ea749fc30deeb5eff5a8b15b2f63/'
                  title="3D Scene"
                  className="w-full h-full"
                  frameBorder='0'
                ></iframe>
              </div>

              {/* Gradient canvas overlay */}
              <canvas id="gradient-canvas" data-transition-in className="absolute inset-0 pointer-events-none"></canvas>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;