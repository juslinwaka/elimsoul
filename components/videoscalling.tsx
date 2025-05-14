// elimsoul/components/videoscalling.tsx

import { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';

export default function VideoCallStarter() {
  const [loading, setLoading] = useState(false);

  const startCall = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/daily-api/create-room', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.open(data.url, '_blank');
      } else {
        alert('Failed to start call.');
      }
    } catch (err) {
      alert('Error creating room.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="contained" color="primary" onClick={startCall} disabled={loading}>
      {loading ? <CircularProgress size={24} /> : '📞 Start Video Call'}
    </Button>
  );
}
// This component is a button that starts a video call when clicked.
// It uses the fetch API to make a POST request to the /api/create-room endpoint.