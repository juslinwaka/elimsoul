'use client';
import React, { useEffect, useState } from 'react';

type GlossVideo = { gloss: string; src: string };

interface Props {
  glossSequence: string[];
}

// Map gloss terms to their corresponding video file paths
const glossToVideo: Record<string, string> = {
  HELLO: "/msl/hello.mp4",
  THANKS: "/msl/thanks.mp4",
  // Add more gloss-to-video mappings as needed
};

export default function GlossVideoPlayer({ glossSequence }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videos, setVideos] = useState<GlossVideo[]>([]);

  useEffect(() => {
    const resolved = glossSequence.map(gloss => ({
      gloss,
      src: glossToVideo[gloss.toUpperCase()] || "/msl/default.mp4",
    }));
    setVideos(resolved);
    setCurrentIndex(0);
  }, [glossSequence]);

  const handleEnded = () => {
    if (currentIndex + 1 < videos.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const current = videos[currentIndex];

  return (
    <div className="mt-4 text-center">
      <h2 className="text-xl font-semibold text-blue-700">Signing: {current?.gloss}</h2>
      {current?.src && (
        <video
          key={current.src}
          src={current.src}
          autoPlay
          muted
          onEnded={handleEnded}
          className="w-full max-w-md mx-auto rounded shadow"
        />
      )}
    </div>
  );
}
