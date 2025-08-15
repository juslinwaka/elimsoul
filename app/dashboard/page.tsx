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
import Sidebar from '@/components/SideBar';
import PwaUpdatePrompt from '@/components/PwaUpdatePrompt';

import HomeWorks from '@/components/homeworkSideBar';

const drawerWidth = 240;

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
  const [userName, setUserName] = useState<string | null>(null);


  const {isMobile, isDesktop} = useScreenConfig();

  useEffect(() => {
    const fetchStats = async () => {
      const user = auth.currentUser;
      if (!user) return;

      // Fetch user's name from Firestore
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserName(data.name || 'friend');
      } else {
        setUserName('friend');
      }

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
    <Box>
      {isDesktop && (
        <Grid size={12}>
          <Box
            display='flow' 
            sx={{margin: 1, 
              backgroundColor: 'rgba(02, 205, 255, 0.6)', borderRadius: 2, boxShadow: 3}}>
                <Grid container spacing={1}>
                  <Grid size={3}>
                    <Box
                      display='flow' 
                      sx={{margin: 2,
                      backgroundColor: 'rgba(02, 205, 255, 0.6)', borderRadius: 2, boxShadow: 3}}>
                       <Sidebar />

                      </Box>

                  </Grid>

                  <Grid size={6}>
                    <Box
                      display='flow' 
                      sx={{margin: 2, padding: 2, 
                      backgroundColor: 'rgba(02, 205, 255, 0.6)', borderRadius: 3, boxShadow: 3}}>
                        
                        <Typography sx={{fontWeight: 300, color: 'white', fontSize: 20}}>Welcome Back, {userName}!</Typography>
                        <Typography sx={{fontSize: 12}}>Your current summary and activities.</Typography>

                        <StreakBar streak={streak} xp={xp} />

                        <Box display='flex' sx={{padding: 1,
                        backgroundColor: 'rgba(02, 205, 255, 0.6)', borderRadius: 2, boxShadow: 3}}>

                          <Box display='flow'
                            width={150}
                            height={60}
                            justifyItems='center'
                            justifyContent='center'  
                            sx={{padding: 1,
                            backgroundColor: 'rgba(02, 105, 255, 0.6)', borderRadius: 2, boxShadow: 3}}>
                            <Typography sx={{fontSize: 12, color: 'white'}}>Completed Courses</Typography>
                            <Typography sx={{marginTop: 1, fontSize: 25, color: 'white'}}>0</Typography>
                          </Box>

                          <Box display='flow'
                            width={150}
                            height={60} 
                            justifyItems='center' 
                            justifyContent='center'
                            sx={{padding: 1, marginLeft: 2,
                            backgroundColor: 'rgba(02, 105, 255, 0.6)', borderRadius: 2, boxShadow: 3}}>
                            <Typography sx={{fontSize: 12, color: 'white'}}>In progress course</Typography>
                            <Typography sx={{marginTop: 1, fontSize: 25, color: 'white'}}>0</Typography>
                          </Box>

                          <Box display='flow'
                            width={150}
                            height={60}
                            justifyItems='center'
                            justifyContent='center'   
                            sx={{padding: 1, marginLeft: 2,
                            backgroundColor: 'rgba(02, 105, 255, 0.6)', borderRadius: 2, boxShadow: 3}}>
                            <Typography sx={{fontSize: 12, color: 'white'}}>Up coming course</Typography>
                            <Typography sx={{marginTop: 1, fontSize: 25, color: 'white'}}>0</Typography>
                          </Box>

                        </Box>
                      </Box>

                  </Grid>

                  <Grid size={3}>
                    <Box
                      display='flow'
                      sx={{margin: 2,
                      backgroundColor: 'rgba(02, 205, 255, 0.6)', borderRadius: 2, boxShadow: 3}}>
                        
                        <HomeWorks /> 
                      </Box>

                  </Grid>

                  <Grid size={12}>
                    <Box
                      display='flex'
                      sx={{margin: 1,
                        padding: 1,
                      backgroundColor: 'rgba(02, 205, 255, 0.6)', borderRadius: 2, boxShadow: 3}}>
                        <Box sx={{marginLeft: 2, padding: 1,
                          backgroundColor: 'rgba(02, 105, 255, 0.6)', borderRadius: 2, boxShadow: 3
                          }}>
                            <XPSummary xp={xp}/>
                        </Box>
                         
                    
                      <Box display='flow' width={250} justifyContent='center' justifyItems='center' sx={{marginLeft: 2, pading: 2, 
                        backgroundColor: 'rgba(02, 105, 255, 0.6)', borderRadius: 2, boxShadow: 3
                        }}>
                          <Typography sx={{fontSize: 15, color: 'white'}}>📝 Lessons Completed</Typography>
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
                      <Typography sx={{fontWeight: 'bold'}}>{lessonStats.completed} / {lessonStats.total}</Typography>
                      </Box>
                         
                      <Box sx={{marginLeft: 2, padding: 1,
                        backgroundColor: 'rgba(02, 105, 255, 0.6)', borderRadius: 2, boxShadow: 3,
                        width: 350}}>
                          <XPSummary xp={xp}/>
                      </Box>

                      <Box sx={{marginLeft: 2, padding: 1,
                        backgroundColor: 'rgba(02, 105, 255, 0.6)', borderRadius: 2, boxShadow: 3,
                        width: 200}}>
                          <Typography variant="h6">🏆 Leaderboard</Typography>
                              {leaderboard.map((entry, index) => (
                                <Typography key={entry.uid}>
                                    {getMedal(index)} {entry.name} — {entry.xp} XP
                                </Typography>
                          ))}
                      </Box>

                      <Box display='flow' sx={{marginLeft: 2, padding:1,
                        backgroundColor: 'rgba(02, 105, 255, 0.6)',color: 'white', borderRadius: 2, boxShadow: 3,
                        width: 200}}>
                          <Typography>📊 Weekly XP</Typography>
                                        <ResponsiveContainer  height={150}>
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
                  </Grid>
                </Grid>
          </Box>
        </Grid>
      )}

      {isMobile && (
        <Grid size={12}>
          <Box
            display='flow' 
            sx={{margin: 1, 
              backgroundColor: 'rgba(02, 205, 255, 0.6)', borderRadius: 2, boxShadow: 3}}>
                <Grid container spacing={1}>

                  <Grid size={12}>
                    <Box
                      display='flow' 
                      sx={{margin: 2, padding: 2, 
                      backgroundColor: 'rgba(02, 205, 255, 0.6)', borderRadius: 2, boxShadow: 3}}>

                        <Typography sx={{fontWeight: 300, color: 'white', fontSize: 20}}>Welcome Back, {userName}!</Typography>
                        
                        <Typography sx={{fontSize: 12}}>Your current summary and activities.</Typography>

                        <StreakBar streak={streak} xp={xp} />

                        <Box justifyItems='center' display='flow' sx={{padding: 1,
                        backgroundColor: 'rgba(02, 205, 255, 0.6)', borderRadius: 2, boxShadow: 3}}>

                          <Box display='flow'
                            width={150}
                            height={60}
                            justifyItems='center'
                            justifyContent='center'  
                            sx={{padding: 1,
                            backgroundColor: 'rgba(02, 105, 255, 0.6)', borderRadius: 2, boxShadow: 3}}>
                            <Typography sx={{fontSize: 12, color: 'white'}}>Completed Courses</Typography>
                            <Typography sx={{marginTop: 1, fontSize: 25, color: 'white'}}>0</Typography>
                          </Box>

                          <Box display='flow'
                            width={150}
                            height={60} 
                            justifyItems='center' 
                            justifyContent='center'
                            sx={{padding: 1, marginTop: 2,
                            backgroundColor: 'rgba(02, 105, 255, 0.6)', borderRadius: 2, boxShadow: 3}}>
                            <Typography sx={{fontSize: 12, color: 'white'}}>In progress course</Typography>
                            <Typography sx={{marginTop: 1, fontSize: 25, color: 'white'}}>0</Typography>
                          </Box>

                          <Box display='flow'
                            width={150}
                            height={60}
                            justifyItems='center'
                            justifyContent='center'   
                            sx={{padding: 1, marginTop: 2,
                            backgroundColor: 'rgba(02, 105, 255, 0.6)', borderRadius: 2, boxShadow: 3}}>
                            <Typography sx={{fontSize: 12, color: 'white'}}>Up coming course</Typography>
                            <Typography sx={{marginTop: 1, fontSize: 25, color: 'white'}}>0</Typography>
                          </Box>
                        </Box>
                      </Box>
                  </Grid>

                  <Grid size={12}>
                    <Box
                      display='flow' 
                      sx={{margin: 2,
                      backgroundColor: 'rgba(02, 205, 255, 0.6)', borderRadius: 2, boxShadow: 3}}>
                       <Sidebar />

                      </Box>

                  </Grid>

                  <Grid size={12}>
                    <Box
                      display='flow'
                      sx={{margin: 2,
                      backgroundColor: 'rgba(02, 205, 255, 0.6)', borderRadius: 2, boxShadow: 3}}>
                        
                        <HomeWorks /> 
                      </Box>

                  </Grid>

                  <Grid size={12}>
                    <Box
                      display='flow'
                      sx={{margin: 1,
                        padding: 1,
                      backgroundColor: 'rgba(02, 205, 255, 0.6)', borderRadius: 2, boxShadow: 3}}>
                        <Box sx={{padding: 1,
                          backgroundColor: 'rgba(02, 105, 255, 0.6)', borderRadius: 2, boxShadow: 3
                          }}>
                            <XPSummary xp={xp}/>
                        </Box>
                      
                      <Box display='flow' justifyContent='center' justifyItems='center' sx={{pading: 2, marginTop: 2, 
                        backgroundColor: 'rgba(02, 105, 255, 0.6)', borderRadius: 2, boxShadow: 3
                        }}>
                          <Typography sx={{fontSize: 15, color: 'white'}}>📝 Lessons Completed</Typography>
                        <PieChart width={150} height={150}>
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
                      <Typography sx={{fontWeight: 'bold'}}>{lessonStats.completed} / {lessonStats.total}</Typography>
                      </Box>
                        
                      <Box sx={{padding: 1, marginTop: 2,
                        backgroundColor: 'rgba(02, 105, 255, 0.6)', borderRadius: 2, boxShadow: 3,
                        width: 250}}>
                          <XPSummary xp={xp}/>
                      </Box>

                      <Box sx={{padding: 1, marginTop: 2,
                        backgroundColor: 'rgba(02, 105, 255, 0.6)', borderRadius: 2, boxShadow: 3,
                        width: 250}}>
                          <Typography variant="h6">🏆 Leaderboard</Typography>
                              {leaderboard.map((entry, index) => (
                                <Typography key={entry.uid}>
                                    {getMedal(index)} {entry.name} — {entry.xp} XP
                                </Typography>
                          ))}
                      </Box>

                      <Box display='flow' sx={{padding:1, marginTop: 2,
                        backgroundColor: 'rgba(02, 105, 255, 0.6)',color: 'white', borderRadius: 2, boxShadow: 3,
                        width: 250}}>
                          <Typography>📊 Weekly XP</Typography>
                                        <ResponsiveContainer  height={150}>
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
                  </Grid>
                </Grid>
          </Box>
        </Grid>
      )}
      <PwaUpdatePrompt />
  </Box>
  );
}
