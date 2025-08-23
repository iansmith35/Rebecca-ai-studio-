import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiKey = process.env.API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API_KEY" }, { status: 500 });
    }
    
    // Forward the request to Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(body)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Gemini API error:', data);
      return NextResponse.json({ error: data.error?.message || "API request failed" }, { status: response.status });
    }
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}