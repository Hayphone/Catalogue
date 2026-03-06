const TG_BOT_TOKEN = '';  // Set via: wrangler secret put TG_BOT_TOKEN
const TG_CHAT_ID = '';    // Set via: wrangler secret put TG_CHAT_ID

const ALLOWED_ORIGINS = [
  'https://hayphone.github.io',
  'https://wwsdistribution.com',
  'http://localhost:3000',
];

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const headers = corsHeaders(origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(request.url);
    const token = env.TG_BOT_TOKEN;
    const chatId = env.TG_CHAT_ID;

    if (!token || !chatId) {
      return new Response(JSON.stringify({ error: 'Server misconfigured' }), {
        status: 500,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }

    try {
      if (url.pathname === '/send-message') {
        const body = await request.json();
        const tgResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: body.text,
            parse_mode: body.parse_mode || 'HTML',
          }),
        });

        const result = await tgResponse.json();
        return new Response(JSON.stringify(result), {
          status: tgResponse.ok ? 200 : 502,
          headers: { ...headers, 'Content-Type': 'application/json' },
        });
      }

      if (url.pathname === '/send-document') {
        const formData = await request.formData();
        const newForm = new FormData();
        newForm.append('chat_id', chatId);

        const document = formData.get('document');
        if (document) newForm.append('document', document, formData.get('filename') || 'order.pdf');
        const caption = formData.get('caption');
        if (caption) newForm.append('caption', caption);

        const tgResponse = await fetch(`https://api.telegram.org/bot${token}/sendDocument`, {
          method: 'POST',
          body: newForm,
        });

        const result = await tgResponse.json();
        return new Response(JSON.stringify(result), {
          status: tgResponse.ok ? 200 : 502,
          headers: { ...headers, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ error: 'Unknown endpoint' }), {
        status: 404,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Internal error' }), {
        status: 500,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }
  },
};
