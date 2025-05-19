'use client'
import {Grid, 
  Box,
Typography,
Paper} from '@mui/material'
import ProtectedRoute from '@/components/ProtectedRoute'
import TopNavBar from '@/components/topNavBar'
import BottomNavBar from '@/components/bottomNavBar'

import React from 'react'
import { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {doc, getDoc} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useScreenConfig } from '@/hooks/screenConfig'
import Leaderboard from '@/components/leaderBoard'
import MyESP from '@/components/myesp'
import '@/app/src/styles.css'

export default function Dashboard() {
  const [userName, setUserName] = useState('');
  const {isMobile, isDesktop} = useScreenConfig();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if(user){
        const userDoc = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDoc);

        if(docSnap.exists()){
          setUserName(docSnap.data().name); // in case you want to use the name of the user and exists
        }else{
          setUserName(user.displayName || 'User') // fall back to auth display name
        }
      }
    });

    return
  }, []);
  return (
    <div >
    <ProtectedRoute>
      <title>Dashboard | ElimSoul</title>
        <Grid container spacing={2}>
          <Grid size={12}>
          </Grid>

          <Grid size={7} pt={3} sx={{ marginTop: '20px' }} justifyContent='center'>
            <Box sx={{border: 4, marginTop:'20',
              padding: '20px', 
              borderRadius: '8px' }} 
              justifyItems='center'>
                
              <Typography variant='h3' style={{color:'white'}} fontWeight={600}>Verse Of The Day</Typography>
              <p style={{color:'white', fontSize: 20}}>Psalm: 95:6</p>

              <p style={{color:'white', fontSize: 20}}>"Come, let us bow down and worship; let us kneel before the Lord, our Maker." </p>
            </Box>
          </Grid>

          <Grid size={5} pt={3} sx={{ marginTop: '20px' }} justifyContent='center'>
            <Box sx={{border: 4, marginTop:'5',
              padding: '10px', 
              borderRadius: '8px' }} 
              justifyItems='center'>
                
              <Typography variant='h3' style={{color:'white'}} fontWeight={600}>{userName ? userName: '...'}</Typography>
              <p style={{color:'white', fontSize: 20}}>Welcome to your ElimSoul dashboard!</p>
            </Box>
          </Grid>

          {isMobile&& 

            <Grid container size={12}>
              <Grid> 
                <MyESP/>
              </Grid>

              <Grid> 
                <Leaderboard/>
              </Grid>
            </Grid>
          }

          {isDesktop &&
            <Grid container size={12}>
              <Grid size={6}> 
                <MyESP/>
              </Grid>

              <Grid size={6}> 
                <Leaderboard/>
              </Grid>
            </Grid>
          }
     
      </Grid>
    <BottomNavBar />
      </ProtectedRoute>
    </div>
  );
}
