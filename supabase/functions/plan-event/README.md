# Plan Event Edge Function

This Supabase Edge Function handles event planning requests by fetching and ranking suitable venues based on user requirements.

## Purpose

The `plan-event` function receives user requirements (city, budget, capacity) and returns a curated list of suitable venues with recommendations for event planning.

## API Endpoint

```
POST /functions/v1/plan-event
```

## Request Body

```typescript
{
  city: string;           // Required: City name for venue search
  budget: number;         // Required: Total budget in INR
  capacity: number;       // Required: Number of attendees
  eventType?: string;     // Optional: Type of event (e.g., "corporate", "wedding")
  date?: string;          // Optional: Event date (ISO format)
  duration?: number;      // Optional: Event duration in hours
}
```

## Response Format

```typescript
{
  success: boolean;
  venues: Venue[];
  totalCost: number;
  recommendations: string[];
  error?: string;
}
```

### Venue Object

```typescript
{
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
  totalCost: number;      // Calculated total cost for the event
}
```

## Features

- **Smart Filtering**: Filters venues by city, capacity, and budget constraints
- **Cost Calculation**: Calculates total cost based on capacity and per-person pricing
- **Ranking**: Orders venues by cost efficiency and rating
- **Recommendations**: Provides contextual recommendations based on requirements
- **Validation**: Comprehensive input validation with detailed error messages
- **CORS Support**: Handles cross-origin requests for frontend integration

## Database Requirements

The function expects a `venues` table with the following structure:

```sql
CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  price_per_person DECIMAL(10,2) NOT NULL,
  venue_type TEXT NOT NULL,
  amenities TEXT[] DEFAULT '{}',
  rating DECIMAL(3,2) DEFAULT 0.0,
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Environment Variables

The function requires the following environment variables:

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key

## Deployment

1. Install Supabase CLI
2. Navigate to the project root
3. Run: `supabase functions deploy plan-event`

## Usage Example

```javascript
const response = await fetch('/functions/v1/plan-event', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${supabaseKey}`
  },
  body: JSON.stringify({
    city: 'Mumbai',
    budget: 500000,
    capacity: 100,
    eventType: 'corporate'
  })
});

const result = await response.json();
console.log(result.venues); // Array of suitable venues
console.log(result.recommendations); // Array of recommendations
```

## Error Handling

The function returns appropriate HTTP status codes:

- `200`: Success
- `400`: Bad Request (validation errors)
- `405`: Method Not Allowed
- `500`: Internal Server Error

## Security

- Uses Supabase service role key for database access
- Validates all input parameters
- Implements proper CORS headers
- Sanitizes database queries

