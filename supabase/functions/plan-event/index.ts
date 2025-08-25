import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Types for the request and response
interface EventRequirements {
  city: string;
  budget: number;
  capacity: number;
  eventType?: string;
  date?: string;
  duration?: number;
}

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
}

interface PlanEventResponse {
  success: boolean;
  venues: Venue[];
  totalCost: number;
  recommendations: string[];
  error?: string;
}

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to format Indian currency
function formatIndianCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)} Crores`
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)} Lakhs`
  } else {
    return `₹${amount.toLocaleString('en-IN')}`
  }
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    })
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      )
    }

    // Parse request body
    const body: EventRequirements = await req.json()
    
    // Validate required fields
    if (!body.city || !body.budget || !body.capacity) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: city, budget, and capacity are required' 
        }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      )
    }

    // Validate data types and ranges
    if (typeof body.city !== 'string' || body.city.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'City must be a non-empty string' }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      )
    }

    if (typeof body.budget !== 'number' || body.budget <= 0) {
      return new Response(
        JSON.stringify({ error: 'Budget must be a positive number' }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      )
    }

    if (typeof body.capacity !== 'number' || body.capacity <= 0) {
      return new Response(
        JSON.stringify({ error: 'Capacity must be a positive number' }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      )
    }

    // Fetch candidate venues from Supabase
    const { data: venues, error: dbError } = await supabase
      .from('venues')
      .select('*')
      .ilike('city', `%${body.city}%`)
      .gte('capacity', body.capacity)
      .limit(50)

    if (dbError) {
      console.error('Database error:', dbError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch venues from database' }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      )
    }

    // Construct the detailed LLM prompt for Gemini Pro
    const geminiPrompt = `You are Planera, an expert AI event planner for the Indian corporate market. You are precise, logical, and provide data-driven recommendations.

USER'S REQUEST:
The user is looking for event venues in ${body.city} with the following requirements:
- Budget: ${formatIndianCurrency(body.budget)}
- Capacity: ${body.capacity} attendees
${body.eventType ? `- Event Type: ${body.eventType}` : ''}
${body.date ? `- Event Date: ${body.date}` : ''}
${body.duration ? `- Event Duration: ${body.duration} hours` : ''}

AVAILABLE_VENUES_JSON:
${JSON.stringify(venues, null, 0)}

Your task is to act as a reasoning engine. First, analyze the user's request. Second, examine the AVAILABLE_VENUES_JSON list. Third, perform a step-by-step chain-of-thought analysis to determine which 3 venues are the absolute best fit based on budget, capacity, and overall value. Finally, your output MUST be only a valid JSON array containing the string UUIDs of your top 3 choices. For example: ["a1b2c3d4-...", "e5f6g7h8-...", "i9j0k1l2-..."]. Do not include any other text, explanations, or markdown formatting in your final response.`

    // Call the Gemini API
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY environment variable not set')
      return new Response(
        JSON.stringify({ error: 'AI service configuration error' }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      )
    }

    let recommendedIds: string[] = []
    
    try {
      const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${geminiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: geminiPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 1000,
            topP: 0.8,
            topK: 40
          }
        })
      })

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text()
        console.error('Gemini API error:', geminiResponse.status, errorText)
        throw new Error(`Gemini API returned ${geminiResponse.status}: ${errorText}`)
      }

      const geminiData = await geminiResponse.json()
      
      if (!geminiData.candidates || !geminiData.candidates[0] || !geminiData.candidates[0].content) {
        console.error('Unexpected Gemini API response structure:', geminiData)
        throw new Error('Invalid response structure from Gemini API')
      }

      const aiResponse = geminiData.candidates[0].content.parts[0].text.trim()
      console.log('AI Response:', aiResponse)

      // Parse the JSON array from the AI response
      try {
        // Extract JSON array from the response (remove any markdown formatting)
        const jsonMatch = aiResponse.match(/\[.*\]/)
        if (!jsonMatch) {
          throw new Error('No JSON array found in AI response')
        }

        const parsedIds = JSON.parse(jsonMatch[0])
        
        if (!Array.isArray(parsedIds)) {
          throw new Error('AI response is not a valid array')
        }

        // Validate that all items are strings (UUIDs)
        if (!parsedIds.every(id => typeof id === 'string' && id.length > 0)) {
          throw new Error('AI response contains invalid UUIDs')
        }

        recommendedIds = parsedIds.slice(0, 3) // Ensure we only take the first 3
        console.log('Parsed recommended IDs:', recommendedIds)

      } catch (parseError) {
        console.error('Failed to parse AI response as JSON:', parseError)
        console.error('Raw AI response:', aiResponse)
        throw new Error('Failed to parse AI recommendations')
      }

    } catch (apiError) {
      console.error('Gemini API call failed:', apiError)
      // Fallback to basic filtering if AI fails
      console.log('Falling back to basic venue filtering')
      recommendedIds = []
    }

    // Fetch final venue details using the AI-recommended IDs
    let finalVenues: Venue[] = []
    
    if (recommendedIds.length > 0) {
      const { data: aiVenues, error: finalDbError } = await supabase
        .from('venues')
        .select('*')
        .in('id', recommendedIds)

      if (finalDbError) {
        console.error('Error fetching final venues:', finalDbError)
        // Fallback to basic filtering
        finalVenues = venues
          .filter((venue: Venue) => {
            const totalCost = venue.price_per_person * body.capacity
            return totalCost <= body.budget
          })
          .map((venue: Venue) => ({
            ...venue,
            totalCost: venue.price_per_person * body.capacity
          }))
          .sort((a, b) => a.totalCost - b.totalCost)
          .slice(0, 5)
      } else {
        // Add totalCost to AI-recommended venues
        finalVenues = aiVenues
          .map((venue: Venue) => ({
            ...venue,
            totalCost: venue.price_per_person * body.capacity
          }))
          .sort((a, b) => a.totalCost - b.totalCost)
      }
    } else {
      // Fallback to basic filtering if no AI recommendations
      finalVenues = venues
        .filter((venue: Venue) => {
          const totalCost = venue.price_per_person * body.capacity
          return totalCost <= body.budget
        })
        .map((venue: Venue) => ({
          ...venue,
          totalCost: venue.price_per_person * body.capacity
        }))
        .sort((a, b) => a.totalCost - b.totalCost)
        .slice(0, 5)
    }

    // Generate recommendations
    const recommendations = generateRecommendations(body, finalVenues)

    // Prepare response
    const response: PlanEventResponse = {
      success: true,
      venues: finalVenues,
      totalCost: finalVenues.length > 0 ? finalVenues[0].totalCost : 0,
      recommendations
    }

    // Return the final data
    return new Response(
      JSON.stringify(response),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    )

  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    )
  }
})

// Helper function to generate recommendations
function generateRecommendations(requirements: EventRequirements, venues: Venue[]): string[] {
  const recommendations: string[] = []

  if (venues.length === 0) {
    recommendations.push(
      `No venues found in ${requirements.city} for your requirements.`,
      'Consider expanding your search area or adjusting your budget.',
      'Try increasing your budget or reducing the capacity requirements.'
    )
    return recommendations
  }

  const avgCost = venues.reduce((sum, venue) => sum + venue.totalCost, 0) / venues.length
  const budgetUtilization = (avgCost / requirements.budget) * 100

  if (budgetUtilization > 80) {
    recommendations.push(
      'Your budget is being utilized efficiently with these venue options.',
      'Consider booking early to secure the best rates.'
    )
  } else if (budgetUtilization < 50) {
    recommendations.push(
      'You have significant budget flexibility for this event.',
      'Consider upgrading to premium venues or adding additional services.'
    )
  }

  if (requirements.capacity > 100) {
    recommendations.push(
      'For large events, consider booking well in advance.',
      'Some venues may offer bulk discounts for large groups.'
    )
  }

  if (venues.length >= 3) {
    recommendations.push(
      `Found ${venues.length} suitable venues in ${requirements.city}.`,
      'Compare amenities and ratings to make the best choice.'
    )
  }

  return recommendations
}
