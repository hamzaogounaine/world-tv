// lib/credentials.ts
import axios from 'axios';

const GIST_URL = 'https://gist.githubusercontent.com/hamzaogounaine/1a69b8e0b2dc8c2bde00a832eaf54721/raw/credentials.json';
const CACHE_DURATION = 10 * 1000; // 10 seconds

// Multi-fallback built-in hardcoded string
const FINAL_FALLBACK = "http://5.253.86.12/player_api.php?username=fallback&password=fallback";

// Maintain state across hot-reloads in Next.js dev mode
interface CredentialCache {
    cachedCredentials: any;
    lastFetchedTime: number;
    baseURL: string | null;
}

const globalForCredentials = global as unknown as {
    credentialCache: CredentialCache;
};

if (!globalForCredentials.credentialCache) {
    globalForCredentials.credentialCache = {
        cachedCredentials: null,
        lastFetchedTime: 0,
        baseURL: null,
    };
}

const cache = globalForCredentials.credentialCache;

function buildPlayerApiUrl(creds: any): string {
    if (!creds?.host_url || !creds?.username || !creds?.password) {
        throw new Error("Invalid credentials payload structure");
    }
    return `${creds.host_url}/player_api.php?username=${creds.username}&password=${creds.password}`;
}

export async function getLiveCredentials(): Promise<string> {
    const now = Date.now();

    // 1. If cache is fresh, return it instantly
    if (cache.cachedCredentials && (now - cache.lastFetchedTime < CACHE_DURATION)) {
        if (cache.baseURL) return cache.baseURL;
        cache.baseURL = buildPlayerApiUrl(cache.cachedCredentials);
        return cache.baseURL;
    }

    // 2. Fetch fresh details from Gist
    try {
        const response = await axios.get(`${GIST_URL}?t=${now}`, {
            timeout: 5000,
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
                'User-Agent': `NextJsServer-${now}`
            }
        });

        // Axios automatically parses JSON response payloads into objects
        const credentials = response.data;
        
        cache.cachedCredentials = credentials;
        cache.lastFetchedTime = now;
        cache.baseURL = buildPlayerApiUrl(credentials);
        
        return cache.baseURL;
    } catch (err: any) {
        console.error("x Next.js Gist fetch failed, using fallback:", err.message);
        
        // 3. Stale cache fallback if available
        if (cache.cachedCredentials) {
            if (cache.baseURL) return cache.baseURL;
            try {
                cache.baseURL = buildPlayerApiUrl(cache.cachedCredentials);
                return cache.baseURL;
            } catch {
                return FINAL_FALLBACK;
            }
        }
        
        // 4. Hardcoded terminal fallback
        return FINAL_FALLBACK;
    }
}