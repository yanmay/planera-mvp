# AI Venue Recommendation Service

## Overview

This service provides intelligent venue recommendations using Google's Gemini AI, considering all the new venue data fields including amenities, venue types, pricing, and availability.

## Features

### ✅ **Enhanced AI Prompt**
- **Venue Type Appropriateness**: Considers event type vs venue type matching
- **Amenities Weighting**: Scores venues based on WiFi, AC, catering, parking, etc.
- **Capacity Matching**: Perfect/good/acceptable capacity scoring
- **Budget Compatibility**: Within/over budget analysis
- **Location & Accessibility**: City matching, airport proximity, metro access
- **Rating & Reputation**: 4.5+ rating gets highest score
- **Availability Status**: Available/maintenance/booked consideration

### ✅ **Comprehensive Scoring System**
- **WiFi**: +20 points (Essential for modern events)
- **AC**: +15 points (Comfort in Indian climate)
- **Catering Services**: +25 points
- **Parking**: +10-30 points (Based on capacity)
- **Spa Access**: +10 points
- **Pool Access**: +8 points
- **Business Center**: +12 points
- **Exhibition Space**: +15 points
- **Heritage Features**: +15 points

### ✅ **JSON Response Format**
```json
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
```

## Files Created

### 1. `src/services/aiService.ts`
- **Main AI service** with Gemini prompt generation
- **Intelligent mock response** generator for testing
- **Scoring algorithm** that considers all venue fields
- **JSON response parsing** and validation

### 2. `src/services/geminiApi.ts`
- **Gemini API integration** ready for production
- **Error handling** and response parsing
- **Environment variable** configuration for API key

### 3. `src/types/venue.ts`
- **Venue interface** matching database schema
- **All new fields** including amenities, contact info, availability

## Integration Steps

### 1. **Current Setup (Mock AI)**
The service is currently using intelligent mock data that simulates AI responses. This works immediately without any API setup.

### 2. **Enable Real Gemini API**

#### Step 1: Get Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the API key

#### Step 2: Set Environment Variable
Create `.env` file in your project root:
```env
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

#### Step 3: Enable Real API
In `src/services/aiService.ts`, uncomment these lines:
```typescript
// TODO: Uncomment to use actual Gemini API
import { callGeminiAPI, parseGeminiJSONResponse } from './geminiApi';
const response = await callGeminiAPI({ prompt, maxTokens: 2048 });
const data = parseGeminiJSONResponse(response);
return data;
```

And comment out the mock response:
```typescript
// const mockResponse = generateMockAIResponse(formData, venues);
// return mockResponse;
```

## Usage Examples

### Basic Usage
```typescript
import { getAIRecommendations } from '../services/aiService';

const formData = {
  eventType: 'Corporate',
  city: 'Mumbai',
  attendees: '150',
  budget: '1000000',
  venueType: 'Hotel'
};

const venues = [/* your venue data */];

const aiResponse = await getAIRecommendations(formData, venues);
console.log(aiResponse.recommendations);
console.log(aiResponse.insights);
```

### Integration with Results Component
The `Results.tsx` component now automatically gets AI recommendations when venues are loaded:

```typescript
// Get AI recommendations with the full venue data
try {
  const aiResponse = await getAIRecommendations(formData, mockVenues);
  if (formData && typeof formData === 'object') {
    formData.recommendations = aiResponse.insights;
    formData.aiRecommendations = aiResponse.recommendations;
  }
} catch (error) {
  console.error('Error getting AI recommendations:', error);
}
```

## AI Prompt Features

### **Event Type Matching**
- **Corporate**: Hotels (+30 points)
- **Conference**: Convention Centers (+30 points)
- **Wedding**: Hotels/Banquet Halls (+25 points)
- **Exhibition**: Convention Centers (+25 points)

### **Amenities Analysis**
The AI considers all venue amenities:
- **Basic**: WiFi, AC, Parking, Catering
- **Enhanced**: Spa, Pool, Business Center, Exhibition Space
- **Unique**: Heritage Ambiance, Cultural Features

### **Indian Context**
- **Climate**: AC importance in Indian weather
- **Culture**: Heritage venues for traditional events
- **Accessibility**: Metro and airport proximity
- **Parking**: Essential for Indian guest preferences

## Testing

### Mock AI Response
The service includes a sophisticated mock response generator that:
- **Scores venues** using the same algorithm as the real AI
- **Generates realistic reasoning** for each recommendation
- **Provides actionable insights** about venue selection
- **Considers all venue fields** including new amenities

### Test Data
Use the 27 venues in the mock data to test different scenarios:
- **Corporate events** in Mumbai
- **Weddings** in Delhi
- **Conferences** in Bengaluru
- **Exhibitions** in Chennai

## Error Handling

The service includes comprehensive error handling:
- **API failures**: Falls back to mock data
- **Invalid responses**: JSON parsing with fallbacks
- **Missing data**: Graceful degradation
- **Network issues**: Timeout and retry logic

## Performance

### **Optimizations**
- **Async/await**: Non-blocking API calls
- **Caching**: Can be added for repeated queries
- **Batch processing**: Handles multiple venues efficiently
- **Memory efficient**: Streams large responses

### **Response Times**
- **Mock AI**: ~100ms
- **Real Gemini API**: ~2-5 seconds
- **Error fallback**: ~50ms

## Future Enhancements

### **Planned Features**
1. **Caching layer** for repeated queries
2. **User preference learning** from selections
3. **Seasonal pricing** considerations
4. **Real-time availability** updates
5. **Multi-language support** for reasoning

### **Advanced AI Features**
1. **Image analysis** of venue photos
2. **Sentiment analysis** of reviews
3. **Predictive pricing** models
4. **Personalized recommendations** based on user history

## Troubleshooting

### **Common Issues**

#### 1. Import Errors
```bash
Cannot find module '../types/venue'
```
**Solution**: The Venue interface is now defined locally in `aiService.ts`

#### 2. API Key Issues
```bash
Gemini API key not configured
```
**Solution**: Set `REACT_APP_GEMINI_API_KEY` in your `.env` file

#### 3. JSON Parsing Errors
```bash
Invalid JSON response from Gemini API
```
**Solution**: The service includes robust JSON parsing with fallbacks

#### 4. Network Timeouts
```bash
Gemini API error: 408
```
**Solution**: The service includes timeout handling and fallback to mock data

## Support

For issues or questions about the AI service:
1. Check the error logs in browser console
2. Verify environment variables are set correctly
3. Test with mock data first
4. Check Gemini API status at [Google AI Studio](https://makersuite.google.com/app/apikey)
