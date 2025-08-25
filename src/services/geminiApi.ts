// Gemini API Integration
// This file contains the actual API calls to Google's Gemini AI

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || 'AIzaSyBNSKfFjEKYrHhhQyOMLVY-0C-8pBHFY6E';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export interface GeminiRequest {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export const callGeminiAPI = async (request: GeminiRequest): Promise<string> => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  console.log('Calling Gemini API with key:', GEMINI_API_KEY.substring(0, 10) + '...');

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: request.prompt
          }]
        }],
        generationConfig: {
          maxOutputTokens: request.maxTokens || 2048,
          temperature: request.temperature || 0.7,
        }
      })
    });

    console.log('Gemini API Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error Response:', errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data: GeminiResponse = await response.json();
    
    console.log('Gemini API Raw Response:', data);
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from Gemini API');
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};

// Helper function to parse JSON response from Gemini
export const parseGeminiJSONResponse = (response: string): any => {
  try {
    console.log('Parsing Gemini response:', response);
    // Extract JSON from the response (in case Gemini adds extra text)
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(response);
  } catch (error) {
    console.error('Error parsing Gemini JSON response:', error);
    throw new Error('Invalid JSON response from Gemini API');
  }
};

// Test function to verify API is working
export const testGeminiAPI = async (): Promise<void> => {
  try {
    console.log('Testing Gemini API...');
    const response = await callGeminiAPI({
      prompt: 'Respond with a simple JSON: {"test": "success", "message": "API is working"}',
      maxTokens: 100,
      temperature: 0.1
    });
    console.log('Gemini API Test Response:', response);
  } catch (error) {
    console.error('Gemini API Test Failed:', error);
  }
};
