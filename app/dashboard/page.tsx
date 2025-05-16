'use client'
import {Grid, 
  Box,
Typography} from '@mui/material'
import ProtectedRoute from '@/components/ProtectedRoute'
import TopNavBar from '@/components/topNavBar'
import BottomNavBar from '@/components/bottomNavBar'

import React from 'react'
import { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {doc, getDoc} from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function Dashboard() {
  const [userName, setUserName] = useState('');

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

          <Grid size={12} pt={3} sx={{ marginTop: '20px' }}>
            <Box sx={{marginTop:'20', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
              <Typography variant='h3'>{userName ? userName: '...'}</Typography>
              <p>Welcome to your ElimSoul dashboard!</p>

              
            </Box>
          </Grid>
     
      </Grid>
    <BottomNavBar />
      </ProtectedRoute>
    </div>
  );
}
