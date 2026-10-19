// Shared helper for the serverless functions. Files starting with "_" are not
// exposed as routes by Vercel.

// Other sites allowed to call this proxy from the browser (the GitHub Pages build).
// Requests from the Vercel deployment itself are same-origin and need no header.
const ALLOWED_ORIGINS = ['https://awmei24.github.io'];

export async function forward(endpoint, req, res) {
    const origin = req.headers.origin;
    if (ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
    }

    const q = req.query.q;
    if (!q) {
        res.status(400).json({ error: 'Missing q parameter' });
        return;
    }

    const url = new URL(`https://api.weatherapi.com/v1/${endpoint}.json`);
    url.searchParams.set('key', process.env.WEATHER_API_KEY);
    url.searchParams.set('q', q);

    try {
        const upstream = await fetch(url);
        const data = await upstream.json();
        res.status(upstream.status).json(data);
    } catch {
        res.status(502).json({ error: 'Weather service unavailable' });
    }
}
