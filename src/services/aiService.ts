// Define Venue interface locally to avoid import issues
interface Venue {
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
  amenities_json?: string[];
}

export interface AIRecommendation {
  venueId: string;
  reasoning: string;
  score: number;
  keyFeatures: string[];
}

export interface AIRecommendationResponse {
  recommendations: AIRecommendation[];
  insights: string[];
  totalVenuesAnalyzed: number;
}

// Updated Gemini AI prompt that considers all new venue data fields
const generateGeminiPrompt = (formData: any, venues: Venue[]): string => {
  return `
You are an expert event planning AI assistant specializing in Indian venue selection. Analyze the following event requirements and available venues to provide intelligent recommendations.

EVENT REQUIREMENTS:
- Event Type: ${formData.eventType}
- City: ${formData.city}
- Attendees: ${formData.attendees}
- Budget: ₹${formData.budget}
- Preferred Venue Type: ${formData.venueType || 'Any'}

AVAILABLE VENUES (${venues.length} total):
${venues.map(venue => `
VENUE ID: ${venue.id}
- Name: ${venue.name}
- City: ${venue.city}
- Venue Type: ${venue.venue_type}
- Capacity: ${venue.capacity} guests
- Price per Person: ₹${venue.price_per_person}
- Total Cost: ₹${venue.totalCost}
- Rating: ${venue.rating}/5.0
- Availability: ${venue.availability_status}
- WiFi: ${venue.wifi_available ? 'Yes' : 'No'}
- Parking: ${venue.parking_capacity ? `${venue.parking_capacity} spaces` : 'No'}
- AC: ${venue.ac_available ? 'Yes' : 'No'}
- Catering: ${venue.catering_available ? 'Available' : 'Not available'}
- Amenities: ${venue.amenities?.join(', ') || 'None'}
- Enhanced Amenities: ${venue.amenities_json?.join(', ') || 'None'}
- Contact: ${venue.contact_phone} | ${venue.contact_email}
- Address: ${venue.address}
- Description: ${venue.description}
`).join('\n')}

ANALYSIS CRITERIA:
1. VENUE TYPE APPROPRIATENESS:
   - Hotels: Best for corporate events, weddings, and formal gatherings
   - Convention Centers: Ideal for large conferences, exhibitions, and trade shows
   - Banquet Halls: Perfect for social events, receptions, and medium gatherings
   - Heritage: Excellent for cultural events, traditional ceremonies, and unique experiences
   - Resorts: Great for destination events, team building, and luxury experiences

2. AMENITIES WEIGHTING (Higher scores for better amenities):
   - WiFi (Essential for modern events): +20 points
   - AC (Comfort in Indian climate): +15 points
   - Catering Services: +25 points
   - Parking (Based on capacity): +10-30 points
   - Spa Access: +10 points
   - Pool Access: +8 points
   - Business Center: +12 points
   - Exhibition Space: +15 points
   - Meeting Rooms: +10 points
   - Tech Support: +8 points
   - Heritage/Unique Features: +15 points

3. CAPACITY MATCHING:
   - Perfect match (within 10%): +50 points
   - Good match (within 25%): +30 points
   - Acceptable (within 50%): +10 points
   - Too small or too large: -20 points

4. BUDGET COMPATIBILITY:
   - Within budget: +40 points
   - 10% over budget: +20 points
   - 25% over budget: +5 points
   - 50%+ over budget: -30 points

5. LOCATION & ACCESSIBILITY:
   - Same city: +30 points
   - Nearby city: +15 points
   - Airport proximity: +10 points
   - Metro accessibility: +8 points

6. RATING & REPUTATION:
   - 4.5+ rating: +25 points
   - 4.0-4.4 rating: +15 points
   - 3.5-3.9 rating: +5 points
   - Below 3.5: -10 points

7. AVAILABILITY:
   - Available: +20 points
   - Maintenance: -50 points
   - Booked: -100 points

TASK:
Analyze all venues and return a JSON response with:
1. Top 5 venue recommendations with detailed reasoning
2. Key insights about venue selection
3. Total venues analyzed

RESPONSE FORMAT:
Return ONLY valid JSON in this exact structure:
{
  "recommendations": [
    {
      "venueId": "string",
      "reasoning": "Detailed explanation of why this venue is recommended",
      "score": number,
      "keyFeatures": ["feature1", "feature2", "feature3"]
    }
  ],
  "insights": [
    "Insight 1 about venue selection",
    "Insight 2 about amenities",
    "Insight 3 about budget considerations"
  ],
  "totalVenuesAnalyzed": number
}

IMPORTANT:
- Consider venue type appropriateness for the event type
- Weight venues with better amenities higher
- Explain specific features that make each venue suitable
- Consider Indian context and cultural preferences
- Factor in practical aspects like parking, accessibility, and climate control
- Provide actionable insights for the user
`;
};

// Function to call Gemini AI (placeholder for actual API integration)
export const getAIRecommendations = async (
  formData: any, 
  venues: Venue[]
): Promise<AIRecommendationResponse> => {
  try {
    // Generate the prompt
    const prompt = generateGeminiPrompt(formData, venues);
    
    // TODO: Uncomment to use actual Gemini API
    // import { callGeminiAPI, parseGeminiJSONResponse } from './geminiApi';
    // const response = await callGeminiAPI({ prompt, maxTokens: 2048 });
    // const data = parseGeminiJSONResponse(response);
    // return data;
    
    // For now, simulate AI response with intelligent mock data
    const mockResponse = generateMockAIResponse(formData, venues);
    
    return mockResponse;
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    throw new Error('Failed to get AI recommendations');
  }
};

// Intelligent mock response generator that considers all venue fields
const generateMockAIResponse = (formData: any, venues: Venue[]): AIRecommendationResponse => {
  // Score and rank venues based on criteria
  const scoredVenues = venues.map(venue => {
    let score = 0;
    const keyFeatures: string[] = [];
    
    // Capacity matching
    const capacityDiff = Math.abs(venue.capacity - parseInt(formData.attendees));
    const capacityPercent = (capacityDiff / parseInt(formData.attendees)) * 100;
    
    if (capacityPercent <= 10) {
      score += 50;
      keyFeatures.push('Perfect capacity match');
    } else if (capacityPercent <= 25) {
      score += 30;
      keyFeatures.push('Good capacity match');
    } else if (capacityPercent <= 50) {
      score += 10;
      keyFeatures.push('Acceptable capacity');
    } else {
      score -= 20;
      keyFeatures.push('Capacity mismatch');
    }
    
    // Budget compatibility
    const budget = parseInt(formData.budget);
    const costPercent = (venue.totalCost / budget) * 100;
    
    if (costPercent <= 100) {
      score += 40;
      keyFeatures.push('Within budget');
    } else if (costPercent <= 110) {
      score += 20;
      keyFeatures.push('Slightly over budget');
    } else if (costPercent <= 125) {
      score += 5;
      keyFeatures.push('Moderately over budget');
    } else {
      score -= 30;
      keyFeatures.push('Significantly over budget');
    }
    
    // Venue type appropriateness
    const eventType = formData.eventType?.toLowerCase();
    const venueType = venue.venue_type?.toLowerCase();
    
    if (eventType === 'corporate' && venueType === 'hotel') {
      score += 30;
      keyFeatures.push('Perfect for corporate events');
    } else if (eventType === 'conference' && venueType === 'convention_center') {
      score += 30;
      keyFeatures.push('Ideal for conferences');
    } else if (eventType === 'wedding' && (venueType === 'hotel' || venueType === 'banquet_hall')) {
      score += 25;
      keyFeatures.push('Great for weddings');
    } else if (eventType === 'exhibition' && venueType === 'convention_center') {
      score += 25;
      keyFeatures.push('Perfect for exhibitions');
    }
    
    // Amenities scoring
    if (venue.wifi_available) {
      score += 20;
      keyFeatures.push('Free WiFi');
    }
    if (venue.ac_available) {
      score += 15;
      keyFeatures.push('Air Conditioning');
    }
    if (venue.catering_available) {
      score += 25;
      keyFeatures.push('Catering Services');
    }
    if (venue.parking_capacity && venue.parking_capacity > 0) {
      score += Math.min(30, venue.parking_capacity / 10);
      keyFeatures.push(`${venue.parking_capacity} parking spaces`);
    }
    
    // Enhanced amenities
    if (venue.amenities_json) {
      if (venue.amenities_json.includes('spa_access')) {
        score += 10;
        keyFeatures.push('Spa Access');
      }
      if (venue.amenities_json.includes('pool_access')) {
        score += 8;
        keyFeatures.push('Pool Access');
      }
      if (venue.amenities_json.includes('business_center')) {
        score += 12;
        keyFeatures.push('Business Center');
      }
      if (venue.amenities_json.includes('exhibition_space')) {
        score += 15;
        keyFeatures.push('Exhibition Space');
      }
      if (venue.amenities_json.includes('heritage_ambiance')) {
        score += 15;
        keyFeatures.push('Heritage Ambiance');
      }
    }
    
    // Rating
    if (venue.rating >= 4.5) {
      score += 25;
      keyFeatures.push('Excellent rating');
    } else if (venue.rating >= 4.0) {
      score += 15;
      keyFeatures.push('Good rating');
    } else if (venue.rating >= 3.5) {
      score += 5;
      keyFeatures.push('Average rating');
    } else {
      score -= 10;
      keyFeatures.push('Low rating');
    }
    
    // Availability
    if (venue.availability_status === 'available') {
      score += 20;
      keyFeatures.push('Available');
    } else if (venue.availability_status === 'maintenance') {
      score -= 50;
      keyFeatures.push('Under maintenance');
    } else if (venue.availability_status === 'booked') {
      score -= 100;
      keyFeatures.push('Booked');
    }
    
    // Location
    if (venue.city.toLowerCase() === formData.city.toLowerCase()) {
      score += 30;
      keyFeatures.push('Same city');
    }
    
    return { venue, score, keyFeatures };
  });
  
  // Sort by score and get top 5
  const topVenues = scoredVenues
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
  
  // Generate recommendations with reasoning
  const recommendations: AIRecommendation[] = topVenues.map(({ venue, score, keyFeatures }) => {
    let reasoning = `This ${venue.venue_type.replace('_', ' ')} is highly recommended for your ${formData.eventType} because `;
    
    if (keyFeatures.includes('Perfect capacity match')) {
      reasoning += `it perfectly accommodates your ${formData.attendees} guests. `;
    } else if (keyFeatures.includes('Good capacity match')) {
      reasoning += `it comfortably fits your ${formData.attendees} guests. `;
    }
    
    if (keyFeatures.includes('Within budget')) {
      reasoning += `It's within your budget of ₹${formData.budget}. `;
    }
    
    if (venue.catering_available) {
      reasoning += `The venue provides excellent catering services. `;
    }
    
    if (venue.wifi_available && venue.ac_available) {
      reasoning += `It offers modern amenities including WiFi and air conditioning. `;
    }
    
    if (venue.rating >= 4.5) {
      reasoning += `With a ${venue.rating} rating, it's highly rated by previous guests. `;
    }
    
    if (venue.amenities_json?.includes('heritage_ambiance')) {
      reasoning += `The heritage ambiance adds a unique cultural touch to your event. `;
    }
    
    reasoning += `Located in ${venue.city}, it's easily accessible for your guests.`;
    
    return {
      venueId: venue.id,
      reasoning,
      score,
      keyFeatures: keyFeatures.slice(0, 5) // Top 5 features
    };
  });
  
  // Generate insights
  const insights = [
    `Found ${venues.length} venues matching your criteria in ${formData.city}`,
    `Top venues offer excellent amenities including WiFi, AC, and catering services`,
    `Consider booking early to secure the best rates and availability`,
    `Venues with parking facilities are highly recommended for guest convenience`,
    `Heritage venues provide unique cultural experiences for special events`
  ];
  
  return {
    recommendations,
    insights,
    totalVenuesAnalyzed: venues.length
  };
};
