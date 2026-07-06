// app/api/credentials/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

// Use the main GitHub API endpoint (bypasses CDN caching)
const GIST_API_URL = 'https://gist.githubusercontent.com/hamzaogounaine/1a69b8e0b2dc8c2bde00a832eaf54721/raw/credentials.json';

export const dynamic = 'force-dynamic'; // Prevent Next.js from caching this API endpoint statically

export async function GET() {
    const now = Date.now();
    try {
        const response = await axios.get(`${GIST_API_URL}?t=${now}`, {
            timeout: 4000,
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
                'User-Agent': `NextBackend-${now}`
            }
        });
        
        const credentials = response.data;
        
        return NextResponse.json(credentials);
    } catch (err: any) {
        console.error("Backend Gist fetch failed:", err.message);
        return NextResponse.json(
            { error: "Failed to fetch remote configuration" + (err.message ? `: ${err.message}` : "") }, 
            { status: 500 }
        );
    }
}