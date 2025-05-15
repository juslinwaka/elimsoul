// elimsoul/app/api/daily-api/end-room.js

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { roomName } = req.body;

  try {
    const response = await fetch(`https://api.daily.co/v1/rooms/${roomName}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ message: 'Failed to end call' });
    }

    res.status(200).json({ message: 'Call ended' });
  } catch (error) {
    console.error('End room error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
// This API route ends a Daily.co room using the Daily.co API.
// It handles POST requests and returns a success message.