import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  X, 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Target,
  Zap,
  Shield,
  MapPin,
  Users,
  IndianRupee,
  Wifi,
  Clock,
  Building,
  Download,
  BarChart3,
  Star,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { AIAnalysis } from "../services/venueIntelligenceService";

interface IntelligenceOverlayProps {
  venue: {
    id: string;
    name: string;
    city: string;
    capacity: number;
    price_per_person: number;
    venue_type: string;
    rating: number;
    image_url?: string;
  };
  analysis: AIAnalysis;
  isOpen: boolean;
  onClose: () => void;
  onApplySuggestions?: (suggestions: string[]) => void;
}

const IntelligenceOverlay = ({ 
  venue, 
  analysis, 
  isOpen, 
  onClose, 
  onApplySuggestions 
}: IntelligenceOverlayProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);

  // Animate score counter
  useEffect(() => {
    if (isOpen && analysis) {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = analysis.overallScore / steps;
      const stepDuration = duration / steps;

      let currentScore = 0;
      const timer = setInterval(() => {
        currentScore += increment;
        if (currentScore >= analysis.overallScore) {
          setAnimatedScore(analysis.overallScore);
          clearInterval(timer);
        } else {
          setAnimatedScore(Math.floor(currentScore));
        }
      }, stepDuration);

      return () => clearInterval(timer);
    }
  }, [isOpen, analysis]);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
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

  const getDimensionIcon = (dimension: string) => {
    switch (dimension) {
      case 'locationIntelligence': return <MapPin className="w-4 h-4" />;
      case 'capacityOptimization': return <Users className="w-4 h-4" />;
      case 'budgetEfficiency': return <IndianRupee className="w-4 h-4" />;
      case 'technicalReadiness': return <Wifi className="w-4 h-4" />;
      case 'serviceQuality': return <Star className="w-4 h-4" />;
      case 'seasonalFactors': return <Clock className="w-4 h-4" />;
      case 'industryAlignment': return <Building className="w-4 h-4" />;
      case 'riskMitigation': return <Shield className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getDimensionName = (dimension: string) => {
    switch (dimension) {
      case 'locationIntelligence': return 'Location Intelligence';
      case 'capacityOptimization': return 'Capacity Optimization';
      case 'budgetEfficiency': return 'Budget Efficiency';
      case 'technicalReadiness': return 'Technical Readiness';
      case 'serviceQuality': return 'Service Quality';
      case 'seasonalFactors': return 'Seasonal Factors';
      case 'industryAlignment': return 'Industry Alignment';
      case 'riskMitigation': return 'Risk Mitigation';
      default: return dimension;
    }
  };

  const handleSuggestionToggle = (suggestion: string) => {
    setSelectedSuggestions(prev => 
      prev.includes(suggestion) 
        ? prev.filter(s => s !== suggestion)
        : [...prev, suggestion]
    );
  };

  const handleApplySuggestions = () => {
    onApplySuggestions?.(selectedSuggestions);
    onClose();
  };

  const exportAnalysis = () => {
    const report = `
Venue Intelligence Analysis Report
================================

Venue: ${venue.name}
Location: ${venue.city}
Overall Score: ${analysis.overallScore}/100
Success Probability: ${analysis.successProbability}
Risk Level: ${analysis.riskLevel}
Confidence Level: ${analysis.confidenceLevel}%

DIMENSIONAL ANALYSIS:
${Object.entries(analysis.analysis).map(([key, value]) => 
  `${getDimensionName(key)}: ${value.score}/100 - ${value.insight}`
).join('\n')}

KEY STRENGTHS:
${analysis.keyStrengths.map(strength => `• ${strength}`).join('\n')}

POTENTIAL RISKS:
${analysis.potentialRisks.map(risk => `• ${risk}`).join('\n')}

OPTIMIZATION SUGGESTIONS:
${analysis.optimizationSuggestions.map(suggestion => `• ${suggestion}`).join('\n')}

Generated on: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `venue-analysis-${venue.name.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!analysis) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background-card border-border">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center gap-3 text-white">
            <Brain className="w-6 h-6 text-purple-500" />
            Venue Intelligence Analysis
          </DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header with Overall Score */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Overall Score */}
            <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30">
              <CardContent className="p-6 text-center">
                <div className="relative inline-flex items-center justify-center w-24 h-24 mb-4">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="42"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="transparent"
                      className="text-gray-700"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="42"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 42}`}
                      strokeDashoffset={`${2 * Math.PI * 42 * (1 - animatedScore / 100)}`}
                      className="text-purple-500 transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{Math.round(animatedScore)}</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Overall Score</h3>
                <div className="flex items-center justify-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className={`text-sm font-medium ${getProbabilityColor(analysis.successProbability)}`}>
                    {analysis.successProbability} Success Probability
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Venue Info */}
            <Card className="bg-background-card border-border">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-3">{venue.name}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <MapPin className="w-4 h-4" />
                    <span>{venue.city}</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Users className="w-4 h-4" />
                    <span>Capacity: {venue.capacity}</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-secondary">
                    <IndianRupee className="w-4 h-4" />
                    <span>₹{venue.price_per_person.toLocaleString()}/person</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Star className="w-4 h-4" />
                    <span>Rating: {venue.rating}/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk & Confidence */}
            <Card className="bg-background-card border-border">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-text-secondary mb-2">Risk Level</h4>
                    <Badge className={`text-sm ${getRiskLevelColor(analysis.riskLevel)}`}>
                      {analysis.riskLevel} Risk
                    </Badge>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-text-secondary mb-2">Confidence</h4>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-blue-400">{analysis.confidenceLevel}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dimensional Analysis */}
          <Card className="bg-background-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <BarChart3 className="w-5 h-5 text-purple-500" />
                Dimensional Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(analysis.analysis).map(([dimension, data]) => (
                  <div key={dimension} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getDimensionIcon(dimension)}
                        <span className="text-sm font-medium text-white">
                          {getDimensionName(dimension)}
                        </span>
                      </div>
                      <span className={`text-sm font-bold ${getScoreColor(data.score)}`}>
                        {data.score}
                      </span>
                    </div>
                    <Progress value={data.score} className="h-2" />
                    <p className="text-xs text-text-secondary">{data.insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Strengths & Risks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Key Strengths */}
            <Card className="bg-background-card border-green-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Key Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.keyStrengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-green-300">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Potential Risks */}
            <Card className="bg-background-card border-orange-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  Potential Risks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.potentialRisks.map((risk, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-orange-300">{risk}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Optimization Suggestions */}
          <Card className="bg-background-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Target className="w-5 h-5 text-purple-500" />
                Optimization Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.optimizationSuggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-purple-900/20 rounded-lg">
                    <input
                      type="checkbox"
                      id={`suggestion-${index}`}
                      checked={selectedSuggestions.includes(suggestion)}
                      onChange={() => handleSuggestionToggle(suggestion)}
                      className="mt-1"
                    />
                    <label htmlFor={`suggestion-${index}`} className="text-sm text-purple-300 cursor-pointer">
                      {suggestion}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alternative Options */}
          {analysis.alternativeOptions.length > 0 && (
            <Card className="bg-background-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <ArrowUpRight className="w-5 h-5 text-blue-500" />
                  Alternative Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.alternativeOptions.map((option, index) => (
                    <div key={index} className="p-3 bg-blue-900/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-300">{option.suggestion}</span>
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          +{option.scoreImprovement} pts
                        </Badge>
                      </div>
                      <p className="text-xs text-blue-400">{option.impact}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              variant="outline"
              onClick={exportAnalysis}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Report
            </Button>
            {selectedSuggestions.length > 0 && (
              <Button
                onClick={handleApplySuggestions}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
              >
                Apply {selectedSuggestions.length} Suggestions
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IntelligenceOverlay;
