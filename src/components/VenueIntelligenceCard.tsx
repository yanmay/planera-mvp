import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Loader2,
  ChevronDown,
  ChevronUp,
  Target,
  Zap,
  Shield,
  Clock,
  MapPin,
  Users,
  IndianRupee
} from "lucide-react";

interface VenueIntelligenceCardProps {
  venue: {
    id: string;
    name: string;
    city: string;
    capacity: number;
    price_per_person: number;
    venue_type: string;
    amenities: string[];
    rating: number;
    image_url?: string;
    description?: string;
    totalCost: number;
    contact_phone?: string;
    contact_email?: string;
    address?: string;
    availability_status?: string;
    wifi_available?: boolean;
    parking_capacity?: number;
    ac_available?: boolean;
    catering_available?: boolean;
  };
  eventData: {
    eventType: string;
    attendees: string;
    budget: string;
    startDate?: Date;
    endDate?: Date;
    city: string;
    industry?: string;
    vipCount?: number;
  };
  onAnalysisComplete?: (analysis: any) => void;
}

interface AIAnalysis {
  overallScore: number;
  successProbability: string;
  riskLevel: string;
  analysis: {
    locationIntelligence: { score: number; insight: string };
    capacityOptimization: { score: number; insight: string };
    budgetEfficiency: { score: number; insight: string };
    technicalReadiness: { score: number; insight: string };
    serviceQuality: { score: number; insight: string };
    seasonalFactors: { score: number; insight: string };
    industryAlignment: { score: number; insight: string };
    riskMitigation: { score: number; insight: string };
  };
  keyStrengths: string[];
  potentialRisks: string[];
  optimizationSuggestions: string[];
  alternativeOptions: Array<{
    suggestion: string;
    impact: string;
    scoreImprovement: number;
  }>;
  confidenceLevel: number;
}

const VenueIntelligenceCard = ({ 
  venue, 
  eventData, 
  onAnalysisComplete 
}: VenueIntelligenceCardProps) => {
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for cached analysis
  const getCachedAnalysis = (venueId: string): AIAnalysis | null => {
    try {
      const cached = sessionStorage.getItem(`venue_analysis_${venueId}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        const cacheTime = parsed.timestamp;
        const now = Date.now();
        // Cache valid for 1 hour
        if (now - cacheTime < 3600000) {
          return parsed.analysis;
        }
      }
    } catch (error) {
      console.error('Error reading cached analysis:', error);
    }
    return null;
  };

  // Cache analysis result
  const cacheAnalysis = (venueId: string, analysis: AIAnalysis) => {
    try {
      sessionStorage.setItem(`venue_analysis_${venueId}`, JSON.stringify({
        analysis,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error caching analysis:', error);
    }
  };

  const performAIAnalysis = async () => {
    setAnalysisLoading(true);
    setError(null);

    try {
      console.log('Starting AI analysis for venue:', venue.name);
      
      // Use the venue intelligence service
      const { analyzeVenue } = await import('../services/venueIntelligenceService');
      const analysis: AIAnalysis = await analyzeVenue({
        venue: venue,
        eventData: eventData
      });
      
      setAiAnalysis(analysis);
      cacheAnalysis(venue.id, analysis);
      onAnalysisComplete?.(analysis);
      console.log('✅ AI Analysis completed successfully!', analysis);

    } catch (error) {
      console.error('AI Analysis Error:', error);
      setError('Failed to analyze venue. Please try again.');
    } finally {
      setAnalysisLoading(false);
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProbabilityColor = (probability: string) => {
    switch (probability.toLowerCase()) {
      case 'high': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <Card className="bg-background-card border-border relative overflow-hidden">
      <CardContent className="p-4">
                 {/* AI Analysis Button */}
         <div className="flex items-center justify-between mb-4">
           <div className="flex items-center gap-2">
             <Brain className="w-5 h-5 text-purple-500" />
             <span className="text-sm font-medium text-white">AI Intelligence</span>
             {aiAnalysis && (
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
             )}
           </div>
           
           {!aiAnalysis && (
             <Button
               size="sm"
               onClick={performAIAnalysis}
               disabled={analysisLoading}
               className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
             >
               {analysisLoading ? (
                 <>
                   <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                   Analyzing...
                 </>
               ) : (
                 <>
                   <Zap className="w-4 h-4 mr-2" />
                   AI Analysis
                 </>
               )}
             </Button>
           )}
         </div>

                 {/* Error State */}
         {error && (
           <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
             <div className="flex items-center gap-2 text-red-800">
               <AlertTriangle className="w-4 h-4" />
               <span className="text-sm">{error}</span>
             </div>
           </div>
         )}

         {/* Success State */}
         {aiAnalysis && !error && (
           <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
             <div className="flex items-center gap-2 text-green-800">
               <CheckCircle className="w-4 h-4" />
               <span className="text-sm">✅ AI Analysis completed successfully!</span>
             </div>
           </div>
         )}

        {/* Analysis Results */}
        {aiAnalysis && (
          <div className="space-y-4">
            {/* Overall Score */}
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    className="text-gray-700"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - aiAnalysis.overallScore / 100)}`}
                    className="text-purple-500 transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-white">{aiAnalysis.overallScore}</span>
                </div>
              </div>
              <p className="text-sm text-text-secondary mt-2">Overall Score</p>
            </div>

            {/* Success Probability & Risk Level */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-text-secondary">Success:</span>
                <span className={`text-sm font-medium ${getProbabilityColor(aiAnalysis.successProbability)}`}>
                  {aiAnalysis.successProbability}
                </span>
              </div>
              <Badge className={`text-xs ${getRiskLevelColor(aiAnalysis.riskLevel)}`}>
                {aiAnalysis.riskLevel} Risk
              </Badge>
            </div>

            {/* Confidence Level */}
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-text-secondary">Confidence:</span>
              <span className="text-sm font-medium text-blue-400">{aiAnalysis.confidenceLevel}%</span>
            </div>

            {/* Expand/Collapse Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full text-purple-400 hover:text-purple-300"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-2" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  View Details
                </>
              )}
            </Button>

            {/* Expanded Details */}
            {isExpanded && (
              <div className="space-y-4 pt-4 border-t border-border">
                {/* Key Strengths */}
                <div>
                  <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Key Strengths
                  </h4>
                  <ul className="space-y-1">
                    {aiAnalysis.keyStrengths.slice(0, 3).map((strength, index) => (
                      <li key={index} className="text-xs text-green-400 flex items-start gap-2">
                        <div className="w-1 h-1 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Potential Risks */}
                <div>
                  <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    Potential Risks
                  </h4>
                  <ul className="space-y-1">
                    {aiAnalysis.potentialRisks.slice(0, 2).map((risk, index) => (
                      <li key={index} className="text-xs text-orange-400 flex items-start gap-2">
                        <div className="w-1 h-1 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Top Optimization Suggestion */}
                {aiAnalysis.optimizationSuggestions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4 text-purple-500" />
                      Top Suggestion
                    </h4>
                    <p className="text-xs text-purple-300 bg-purple-900/20 p-2 rounded">
                      {aiAnalysis.optimizationSuggestions[0]}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VenueIntelligenceCard;
