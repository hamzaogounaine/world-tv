import axios from "axios";
import { NextResponse } from "next/server";
import { getLiveCredentials } from '@/lib/credentials';

export async function GET(req) {

    const credentials = await getLiveCredentials();
    const base_url = typeof credentials === "string"
        ? credentials
        : credentials?.base_url || credentials?.baseUrl || credentials?.url || credentials?.liveUrl;
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");

    if (!base_url || !categoryId) {
        return new NextResponse(JSON.stringify({ error: "Failed to fetch channels" }), { status: 500 });
    }

    try {
        const channels = await axios.get(`${base_url}&action=get_live_streams&category_id=${encodeURIComponent(categoryId)}`);

        if (channels.status !== 200) {
            return new NextResponse(JSON.stringify({ error: "Failed to fetch channels" }), { status: 500 });
        }

        return new NextResponse(JSON.stringify(channels.data), { status: 200 });
    } catch {
        return new NextResponse(JSON.stringify({ error: "Failed to fetch channels" }), { status: 500 });
    }
}