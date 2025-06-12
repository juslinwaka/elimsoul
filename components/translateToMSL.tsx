'use client';
import React, { useState } from 'react';
import { Button, Typography, CircularProgress, Paper } from '@mui/material';

type Props = {
  text: string; // Input from summarizer or Q&A
};

export default function TranslateToMSL({ text }: Props) {
  const [gloss, setGloss] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoLinks, setVideoLinks] = useState<string[]>([]);

  const handleTranslate = async () => {
    setLoading(true);
    setGloss('');
    try {
      const res = await fetch('https://juslin-elim-api.hf.space/gloss', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      const glossOutput = data.gloss.trim();
      const words = glossOutput.split(' ');
      const mapped = words.map(
        (word: string) => `/clips/${word.toUpperCase()}.mp4`
      );

      setGloss(glossOutput);
      setVideoLinks(mapped);
    } catch (err) {
      console.error(err);
      setGloss('Failed to translate.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ backgroundColor: 'white', mt: 4, p: 2 }}>
      <Button
        variant="outlined"
        onClick={handleTranslate}
        disabled={loading || !text.trim()}
      >
        {loading ? <CircularProgress size={20} /> : '🧏🏽 Translate to MSL'}
      </Button>

      {gloss && (
        <>
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            <strong>Gloss:</strong> {gloss}
          </Typography>

          <div className="flex flex-wrap gap-2 mt-2">
            {videoLinks.map((src, i) => (
              <video key={i} src={src} controls width="120" />
            ))}
          </div>
        </>
      )}
    </Paper>
  );
}
