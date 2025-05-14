// app/api/daily-api/create-room/route.js

export async function POST() {
  const response = await fetch('https://api.daily.co/v1/rooms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer f0b562127dce959deaf1c0bc8cf9d75daa442ca870e0743f515b59adcde9dfe9`,
    },
    body: JSON.stringify({
      properties: {
        enable_prejoin_ui: true,
        enable_chat: true,
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    return new Response(JSON.stringify({ error: data }), { status: response.status });
  }

  return new Response(JSON.stringify({ url: data.url }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
