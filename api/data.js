export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json'
  };

  try {
    // Fetch conversations
    const convRes = await fetch(
      `${SUPABASE_URL}/rest/v1/conversations?order=created_at.desc&limit=500`,
      { headers }
    );
    const conversations = await convRes.json();

    // Fetch leads
    const leadsRes = await fetch(
      `${SUPABASE_URL}/rest/v1/leads?order=created_at.desc&limit=500`,
      { headers }
    );
    const leads = await leadsRes.json();

    return res.status(200).json({ conversations, leads });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
