// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Grid, Typography, Box, CircularProgress } from '@mui/material';
import { collection, doc, getDoc, getDocs, query } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import XPSummary from '@/components/msl-comps/xpBadgeRank';
import StreakBar from '@/components/msl-comps/streakXpSys';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useScreenConfig } from '@/hooks/screenConfig';

interface LeaderboardEntry {
  uid: string;
  name: string;
  xp: number;
}

export default function Dashboard() {
  const [xp, setXp] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [lessonStats, setLessonStats] = useState<{ completed: number; total: number }>({ completed: 0, total: 0 });
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [weeklyXpData, setWeeklyXpData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const COLORS = ['#0088FE', '#FFBB28'];

  const {isMobile, isDesktop} = useScreenConfig();

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

      // Leaderboard XP from all users
      const usersQuery = query(collection(db, 'users'));
      const usersSnap = await getDocs(usersQuery);
      const entries: LeaderboardEntry[] = [];

      for (const userDoc of usersSnap.docs) {
        const metaRef = doc(db, 'users', userDoc.id, 'meta', 'academyStats');
        const metaSnap = await getDoc(metaRef);
        if (metaSnap.exists()) {
          const xpVal = metaSnap.data().xp || 0;
          const name = userDoc.data()?.name || userDoc.id.slice(0, 6);
          entries.push({ uid: userDoc.id, name, xp: xpVal });
        }
      }

      const sorted = entries.sort((a, b) => b.xp - a.xp).slice(0, 5);
      setLeaderboard(sorted);

      // Weekly XP (for now, mock with fake data)
      setWeeklyXpData([
        { day: 'Mon', xp: 10 },
        { day: 'Tue', xp: 20 },
        { day: 'Wed', xp: 30 },
        { day: 'Thu', xp: 15 },
        { day: 'Fri', xp: 40 },
        { day: 'Sat', xp: 50 },
        { day: 'Sun', xp: 25 },
      ]);

      setLoading(false);
    };

    fetchStats();
  }, []);

  const getMedal = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '🎖️';
  };

  return (
    <Grid container spacing={2}>
      {isDesktop && (
        <Grid size={6}>

        </Grid>
      )}
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
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

          <Box mt={4} display="flex" justifyContent="center" alignItems="center" flexWrap="wrap">
            <Box textAlign="center" m={2}>
              <Typography variant="h6">📝 Lessons Completed</Typography>
              <PieChart width={120} height={120}>
                <Pie
                  data={[{ name: 'Done', value: lessonStats.completed }, { name: 'Remaining', value: lessonStats.total - lessonStats.completed }]}
                  dataKey="value"
                  outerRadius={50}
                  fill="#8884d8"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
              </PieChart>
              <Typography>{lessonStats.completed} / {lessonStats.total}</Typography>
            </Box>

            <Box textAlign="center" m={2}>
              <Typography variant="h6">🏆 Leaderboard</Typography>
              {leaderboard.map((entry, index) => (
                <Typography key={entry.uid}>
                  {getMedal(index)} {entry.name} — {entry.xp} XP
                </Typography>
              ))}
            </Box>

            <Box textAlign="center" m={2}>
              <Typography variant="h6">📊 Weekly XP</Typography>
              <ResponsiveContainer width={280} height={180}>
                <LineChart data={weeklyXpData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="xp" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </>
      )}
    </Box>
  </Grid>
  );
}
