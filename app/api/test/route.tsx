import { NextResponse } from 'next/server'; // Import NextResponse

export async function GET(req: Request) { // Handle GET requests
    return NextResponse.json({ message: 'Test endpoint working!' });
}