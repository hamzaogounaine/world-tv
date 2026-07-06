// lib/credentials.ts
import axios from 'axios';

const GIST_URL = 'https://gist.githubusercontent.com/hamzaogounaine/1a69b8e0b2dc8c2bde00a832eaf54721/raw/credentials.json';

// Global cache object (survives across hot-reloads and requests on the server)
let cachedCredentials: any = null;
let lastFetchedTime = 0;
const CACHE_DURATION = 10 * 1000; // 10 seconds cache window
let baseURL: string | null = null;

export async function getLiveCredentials() {
    const now = Date.now();

    // If cache is fresh, return it instantly
    if (cachedCredentials && (now - lastFetchedTime < CACHE_DURATION)) {
        if (baseURL) return baseURL;
        baseURL = `${cachedCredentials.host_url}/player_api.php?username=${cachedCredentials.username}&password=${cachedCredentials.password}`;
        return baseURL;
    }

    try {
        // Appending a timestamp and dynamic headers completely defeats CDN caching
        const response = await axios.get(`${GIST_URL}?t=${now}`, {
            timeout: 5000,
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
                'User-Agent': `NextJsServer-${now}`
            }
        });

        const credentials = response.data;
       

        cachedCredentials = JSON.parse(JSON.stringify(credentials));
        lastFetchedTime = now;

        baseURL = `${cachedCredentials.host_url}/player_api.php?username=${cachedCredentials.username}&password=${cachedCredentials.password}`;
        return baseURL;
    } catch (err: any) {
        console.error("x Next.js Gist fetch failed, using fallback:", err.message);
        if (cachedCredentials) {
            if (baseURL) return baseURL;
            baseURL = `${cachedCredentials.host_url}/player_api.php?username=${cachedCredentials.username}&password=${cachedCredentials.password}`;
            return baseURL;
        }
        
        // Final fallback block
        return "http://5.253.86.12/player_api.php?username=fallback&password=fallback";
    }
}