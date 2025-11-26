import { NextResponse } from "next/server";

// This API route is not used since we call the backend directly
// It's kept here as a placeholder or for potential future use
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { channelId } = body;

    console.log(`API received request for channel: ${channelId}`);
    
    return NextResponse.json([]);
  } catch (error) {
    console.error("Error in uploads API:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}