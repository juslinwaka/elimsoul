// components/msl-comps/streakXpSys.tsx
'use client';

import { Box, Typography, LinearProgress } from '@mui/material';

interface StreakBarProps {
  streak: number;
  xp: number;
}

export default function StreakBar({ streak, xp }: StreakBarProps) {
  const level = Math.floor(xp / 200);
  const progress = xp % 200;

  return (
    <Box mt={2} mb={2} px={2}>
      <Typography variant="h6" sx={{ color: 'gold', textAlign: 'center' }}>
        🔥 {streak}-day streak — Level {level}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{ height: 10, borderRadius: 5, backgroundColor: '#ddd', mt: 1 }}
      />
      <Typography variant="caption" textAlign="center" display="block" sx={{ color: 'white', mt: 1 }}>
        XP: {progress}/200 to next level
      </Typography>
    </Box>
  );
}
