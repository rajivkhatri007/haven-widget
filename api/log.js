module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { type, church_name, topics, message_count, session_id, messages, name, email, topic } = req.body;
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_KEY;
  if (!SUPABASE_URL || !SUPABASE_KEY) return res.status(500).json({ error: 'Supabase not configured' });

  const h = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Prefer': 'return=minimal'
  };

  try {
    if (type === 'conversation') {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/conversations`, {
        method: 'POST', headers: h,
        body: JSON.stringify({ church_name: church_name || 'Unknown', topics: topics || [], message_count: message_count || 0, session_id: session_id || '', messages: messages || [] })
      });
      if (!r.ok) return res.status(500).json({ error: await r.text() });
      return res.status(200).json({ success: true });
    }

    if (type === 'update') {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/conversations?session_id=eq.${encodeURIComponent(session_id)}`, {
        method: 'PATCH', headers: h,
        body: JSON.stringify({ topics: topics || [], message_count: message_count || 0, messages: messages || [] })
      });
      if (!r.ok) return res.status(500).json({ error: await r.text() });
      return res.status(200).json({ success: true });
    }

    if (type === 'lead') {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
        method: 'POST', headers: h,
        body: JSON.stringify({ church_name: church_name || 'Unknown', name: name || '', email: email || '', topic: topic || '', session_id: session_id || '' })
      });
      if (!r.ok) return res.status(500).json({ error: await r.text() });
      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: 'Invalid type.' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
