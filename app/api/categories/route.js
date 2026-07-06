import axios from "axios";
import { NextResponse } from "next/server";
import { getLiveCredentials } from '@/lib/credentials';

export async function GET() {

    const base_url = await getLiveCredentials();

    if (base_url === null) {
        return new NextResponse(JSON.stringify({ error: "Failed to fetch categories" }), { status: 500 });
    }

    const categories = await axios.get(`${base_url}&action=get_live_categories`);

    if (categories.status !== 200) {
        return new NextResponse(JSON.stringify({ error: "Failed to fetch categories" }), { status: 500 });
    }

    return new NextResponse(JSON.stringify(categories.data), { status: 200 });
}