// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Grid, Typography, Box, CircularProgress, Button } from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import XPSummary from '@/components/msl-comps/xpBadgeRank';
import StreakBar from '@/components/msl-comps/streakXpSys';
import { useScreenConfig } from '@/hooks/screenConfig';

export default function Dashboard() {
  const [xp, setXp] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [lessonStats, setLessonStats] = useState<{ completed: number; total: number }>({ completed: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const { isMobile, isDesktop } = useScreenConfig();

  useEffect(() => {
    const fetchStats = async () => {
      const user = auth.currentUser;
      if (!user) return;

      // XP and streak
      const metaRef = doc(db, 'users', user.uid, 'meta', 'academyStats');
      const metaSnap = await getDoc(metaRef);
      if (metaSnap.exists()) {
        const data = metaSnap.data();
        setXp(data.xp || 0);
        setStreak(data.streak || 0);
      }

      // Lessons progress
      const lessonIds = [
        'alphabet', 'basic_convo', 'numbers', 'colors', 'education', 'emotions',
        'family_people', 'health', 'professions', 'places', 'religion', 'time',
        'sport', 'transportation'
      ];

      let completed = 0;
      await Promise.all(
        lessonIds.map(async (id) => {
          const ref = doc(db, 'users', user.uid, 'progress', id);
          const snap = await getDoc(ref);
          if (snap.exists() && (snap.data().progress || 0) >= 100) completed++;
        })
      );
      setLessonStats({ completed, total: lessonIds.length });
      setLoading(false);
    };

    fetchStats();
  }, []);

  return (
    <Box p={3}>
      {isMobile && (
        <Box pt={6}>
          <Typography sx={{ color: 'white', fontSize: 30, fontWeight: 'bold', textAlign: 'center' }}>
        🎓 Your ElimSoul Academy Dashboard
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <StreakBar streak={streak} xp={xp} />
          <XPSummary xp={xp} />

          <Box mt={3} textAlign="center">
            <Typography variant="h6"
            sx={{ color: 'pink' }}>
              
              📝 Lessons Completed: {lessonStats.completed} / {lessonStats.total}
            </Typography>
            <Button href='/elimacademy' variant='outlined'>Continue Lesson...</Button>
            <Typography
              variant="body2" sx={{ color: 'white', marginTop: 2, fontSize: 25, fontWeight: 'italic' }}>
              Keep going! You're building sign language mastery day by day! 💪
            </Typography>
          </Box>
        </>
      )}

        </Box>
      )}

      {isDesktop && (
        <Box  pt={6}>
          <Box display='flex' justifyContent='center'>
            <XPSummary xp={xp} />
          <Typography sx={{ color: 'white', fontSize: 30, 
            fontWeight: 'bold', textAlign: 'center', marginTop: 6, marginLeft: 20 }}>
        🎓 Your ElimSoul Academy Dashboard
      </Typography>

          </Box>
          
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography></Typography>
          <StreakBar streak={streak} xp={xp} />

          <Box mt={3} textAlign="center">
            <Typography variant="h6"
            sx={{ color: 'pink' }}>
              
              📝 Lessons Completed: {lessonStats.completed} / {lessonStats.total}
            </Typography>
            <Button href='/elimacademy' variant='outlined'>Continue Lesson...</Button>
            <Typography
              variant="body2" sx={{ color: 'white', marginTop: 2, fontSize: 25, fontWeight: 'italic' }}>
              Keep going! You're building sign language mastery day by day! 💪
            </Typography>
          </Box>
        </>
      )}

    </Box>
      )}
    </Box>
  );
}
