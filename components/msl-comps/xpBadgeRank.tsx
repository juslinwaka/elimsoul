// components/XPSummary.tsx
'use client';

import { Box, Typography, Chip, Tooltip } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

interface XPSummaryProps {
  xp: number;
}

export default function XPSummary({ xp }: XPSummaryProps) {
  const getRank = (xp: number) => {
    if (xp >= 3000) return { label: 'Diamond', color: '#b9f2ff' };
    if (xp >= 1000) return { label: 'Gold', color: 'gold' };
    if (xp >= 450) return { label: 'Silver', color: 'silver' };
    if (xp >= 200) return { label: 'Bronze', color: '#cd7f32' };
    return { label: 'Beginner', color: '#bbb' };
  };

  const { label, color } = getRank(xp);

  return (
    <Box textAlign="center" my={3}>
      <Typography variant="h6" sx={{color: 'whitesmoke'}} gutterBottom>
        🌟 Total XP: {xp}
      </Typography>

      <Tooltip title={`Your current badge rank based on XP`}>
        <Chip
          icon={<EmojiEventsIcon style={{ color: color }} />}
          label={`Rank: ${label}`}
          sx={{ backgroundColor: '#fff', borderColor: color, borderWidth: 2, borderStyle: 'solid' }}
          variant="outlined"
        />
      </Tooltip>
    </Box>
  );
}
