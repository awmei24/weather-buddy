// Shared helper for the serverless functions. Files starting with "_" are not
// exposed as routes by Vercel.
export async function forward(endpoint, req, res) {
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
