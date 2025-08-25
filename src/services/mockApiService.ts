import { AIAnalysis, getMockAnalysis } from './venueIntelligenceService';

// Mock API endpoint for development
export const mockAnalyzeVenue = async (prompt: string): Promise<{ analysis: AIAnalysis }> => {
  console.log('Mock API: Starting analysis...');
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
  
  // Disabled error simulation for consistent testing
  // if (Math.random() < 0.1) {
  //   throw new Error('Simulated API error for testing');
  // }
  
  // Create a mock venue object from the prompt
  const mockVenue = {
    id: 'mock-venue',
    name: 'Mock Venue',
    city: 'Mumbai',
    capacity: 200,
    price_per_person: 5000,
    venue_type: 'hotel',
    amenities: ['parking', 'catering', 'wifi'],
    rating: 4.5,
    totalCost: 1000000,
    contact_phone: '+91-22-1234-5678',
    contact_email: 'events@mockvenue.com',
    address: 'Mock Address, Mumbai',
    availability_status: 'available',
    wifi_available: true,
    parking_capacity: 100,
    ac_available: true,
    catering_available: true
  };
  
  const analysis = getMockAnalysis(mockVenue);
  
  console.log('Mock API: Analysis completed successfully');
  return { analysis };
};

// Intercept fetch calls to /api/analyze-venue for development
if (import.meta.env.DEV) {
  console.log('Mock API Service: Initializing fetch interception for development');
  const originalFetch = window.fetch;
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString();
    
    if (url.includes('/api/analyze-venue')) {
      console.log('Mock API: Intercepted fetch call to /api/analyze-venue');
      try {
        const body = init?.body ? JSON.parse(init.body as string) : {};
        console.log('Mock API: Request body:', body);
        const result = await mockAnalyzeVenue(body.prompt);
        console.log('Mock API: Returning successful response');
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        console.error('Mock API: Error occurred:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    return originalFetch(input, init);
  };
}
