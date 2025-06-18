import { Card, CardContent, LinearProgress, Typography, Button, Box } from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

interface LessonCardProps {
  title: string;
  icon?: React.ReactElement;
  lessonId: string;
  previousLessonId?: string;
  progress: number; // Ensure progress is included here
  onClick: () => void;
}

export default function LessonCard({
  title,
  icon = <TranslateIcon />,
  lessonId,
  previousLessonId,
  progress,
  onClick,
}: LessonCardProps) {
  const [isLocked, setIsLocked] = useState<boolean>(false);

  // Lock logic based on progress of the previous lesson
  useEffect(() => {
    if (previousLessonId) {
      // Retrieve the progress of the previous lesson
      const fetchPrevProgress = async () => {
        const user = auth.currentUser;
        if (!user) return;
        
        const prevRef = doc(db, 'users', user.uid, 'progress', previousLessonId);
        const prevSnap = await getDoc(prevRef);
        const prevProgress = prevSnap.exists() ? prevSnap.data().progress || 0 : 0;

        setIsLocked(prevProgress < 70); // Lock if progress < 70
      };

      fetchPrevProgress();
    }
  }, [lessonId, previousLessonId]);

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
