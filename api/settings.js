module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_KEY;
  if (!SUPABASE_URL || !SUPABASE_KEY) return res.status(500).json({ error: 'Supabase not configured' });

  const headers = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`
  };

  // GET — fetch settings for a church
  if (req.method === 'GET') {
    const church = req.query.church || 'Belvedere Baptist Church';
    try {
      const r = await fetch(
        `${SUPABASE_URL}/rest/v1/settings?church_name=eq.${encodeURIComponent(church)}&limit=1`,
        { headers }
      );
      const data = await r.json();
      if (data && data.length > 0) {
        return res.status(200).json(data[0].data);
      }
      return res.status(200).json(null); // No settings saved yet
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // POST — save settings for a church
  if (req.method === 'POST') {
    const { church_name, data } = req.body;
    if (!church_name || !data) return res.status(400).json({ error: 'Missing church_name or data' });
    try {
      // Upsert — update if exists, insert if not
      const r = await fetch(`${SUPABASE_URL}/rest/v1/settings`, {
        method: 'POST',
        headers: {
          ...headers,
          'Prefer': 'resolution=merge-duplicates,return=minimal'
        },
        body: JSON.stringify({
          church_name,
          data,
          updated_at: new Date().toISOString()
        })
      });
      if (!r.ok) return res.status(500).json({ error: await r.text() });
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
