'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Button, Typography, CircularProgress, Paper } from '@mui/material';
import glossMap from '@/data/gloss_to_video-placeholder.json' assert {type: 'json'};

type Props = {
  text: string; // Input from summarizer or Q&A
};

export default function TranslateToMSL({ text }: Props) {
  const [gloss, setGloss] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoLinks, setVideoLinks] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleTranslate = async () => {
    setLoading(true);
    setGloss('');
    setVideoLinks([]);
    setCurrentIndex(0);
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

      const videoMap: Record<string, string> = glossMap;
      const mapped = words.map((word: string) =>{
        const clip = videoMap[word.toUpperCase()];

        if (!clip) console.warn(`No clip found for word: ${word}`);
        return clip;
      }).filter(Boolean)

      setGloss(glossOutput);
      setVideoLinks(mapped);
    } catch (err) {
      console.error(err);
      setGloss('Failed to translate.');
    } finally {
      setLoading(false);
    }
  };

  // Play next video automatically when one ends
  useEffect(() => {
    const player = videoRef.current;
    if (!player) return;

    const handleEnded = () => {
      if (currentIndex < videoLinks.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      }
    };

    player.addEventListener('ended', handleEnded);
    return () => player.removeEventListener('ended', handleEnded);
  }, [currentIndex, videoLinks]);

  // Load next video when index changes
  useEffect(() => {
    const player = videoRef.current;
    if (player && videoLinks[currentIndex]) {
      player.src = videoLinks[currentIndex];
      player.play().catch((err) => console.warn("Autoplay failed:", err));
    }
  }, [currentIndex, videoLinks]);

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

          <div className="mt-2 flex flex-col items-center">
            {videoLinks.length > 0 ? (
              <video // force reload on change
                ref={videoRef}
                autoPlay
                playsInline
                controls={true}
                width="320"
                className="rounded-xl shadow-md bg-black"
              />
            ) : (
              <Typography variant="body2" color="textSecondary">
                No sign clips available.
              </Typography>
            )}
            {videoLinks.length > 0 && (
              <Typography variant="caption" sx={{ mt: 1 }}>
                Showing {currentIndex + 1} of {videoLinks.length}
              </Typography>
            )}
          </div>
        </>
      )}
    </Paper>
  );
}
