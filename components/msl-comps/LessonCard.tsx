// components/LessonCard.tsx
'use client'
import { Card, CardContent, LinearProgress, Typography, Button, Box } from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';

interface LessonCardProps {
  title: string;
  icon?: React.ReactElement;
  progress: number; // from 0 to 100
  isLocked: boolean;
  onClick: () => void;
}

export default function LessonCard({ title, icon = <TranslateIcon />, progress, isLocked, onClick }: LessonCardProps) {
  return (
    <Card sx={{ maxWidth: 300, m: 1, opacity: isLocked ? 0.5 : 1, color: 'white' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={1}>
          {icon}
          <Typography variant="h6" ml={1}>{title}</Typography>
        </Box>

        <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5 }} />

        <Box mt={2}>
          <Button 
            variant="contained" 
            fullWidth 
            disabled={isLocked} 
            onClick={onClick}>
              {isLocked ? "Locked 🔒" : "Start Lesson"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
