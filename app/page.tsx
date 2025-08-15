'use client'
import Link from 'next/link'
import Image from 'next/image'
import React, {useState} from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { Button, Typography, TextField, 
  Divider, Stack } from '@mui/material'
import { useScreenConfig } from '@/hooks/screenConfig'
import { useRouter } from 'next/navigation';
import PwaUpdatePrompt from '@/components/PwaUpdatePrompt';

import '@/app/src/styles.css'

export default function Home() {
  const {isMobile, isTablet, isDesktop} = useScreenConfig();
  const router = useRouter();

  return (
  <Grid container spacing={2} width='100%'>
    {isDesktop && (
      <Box sx={{margin: 'auto'}} justifyContent='center'>
        <PwaUpdatePrompt />
        <Box 
          width='auto'
            display='flex'  
            sx={{margin: 2,padding: 2, backgroundColor: 'rgba(0, 123, 255, 0.2)', borderRadius: 2, boxShadow: 3}}
                >
                  <Box justifyContent='center'>
                    <Typography sx={{fontSize: 35, fontWeight: '600',
                      color: 'rgb(205, 255, 200, 0.6)',
                      marginTop: 2, marginLeft: 3}}>Your Journey Begins Here.</Typography>
                    <Typography 
                      variant='h5'
                      sx={{fontWeight: 600, 
                      fontSize: 30, 
                      padding: 5,
                      maxWidth: 300,
                      color: 'rgb(025, 255, 200, 0.6)'}}>Unlocking potential by bridging the education gap</Typography>

                      <Typography sx={{color: 'white'}}>ElimSoul is a transformative digital platform designed to nurture underprivileged children. It blends AI-powered learning, sign language support,
                         and challenge-based engagement to build purpose, confidence, and connection.</Typography>

                      <Box display='flex' justifyItems='center' justifyContent='center' marginTop={1}>
                        <Button variant='contained'
                          sx={{marginLeft: 6}}
                          href='/signIn'>Sign In</Button>
                        <Button variant='outlined'
                          sx={{marginLeft: 6}}
                          href='/signUp'>Create An Account</Button>

                      </Box>

                    <Button 
                      variant='outlined'
                      fullWidth
                      sx={{margin: 3}}
                      href='/dashboard'>Get Started</Button>

                  </Box>

                  <Box marginLeft={20} justifyContent='center' justifyItems='center'>
                    <Image
                      src="/Gifs/Project 1.gif"
                      alt="Hero Image"
                      width={600}
                      height={450}
                      style={{borderRadius: '10px'}}
                    />
                    <Typography sx={{fontSize: 35, fontWeight: '600',
                      color: 'rgb(205, 255, 200, 0.6)',
                      marginTop: 2}}>Welcome to Elimsoul</Typography>
                       <Typography 
                      variant='h5'
                      sx={{fontWeight: 600, 
                      fontSize: 15, 
                      color: 'rgb(025, 255, 200, 0.6)'}}>I see you, I hear you. You are allowed to learn and Dream</Typography>
                  </Box>
                  

      </Box>
    </Box>
    )}

    {isMobile && (
      <Box justifyContent='center'>
        <Box 
          width='auto'
            display='flow'  
            sx={{margin: 2,padding: 2, backgroundColor: 'rgba(0, 123, 255, 0.2)', borderRadius: 2, boxShadow: 3}}
                >
                   <Box justifyContent='center' justifyItems='center'>
                    <img
                      src="/Gifs/Project 1.gif"
                      alt="Hero Image"
                      width={200}
                      height={200}
                      style={{borderRadius: '10px'}}
                    />
                    <Typography sx={{fontSize: 25, fontWeight: '600',
                      color: 'rgb(205, 255, 200, 0.6)',
                      marginTop: 2}}>Welcome to Elimsoul</Typography>
                       <Typography 
                      variant='h5'
                      sx={{fontWeight: 600, 
                      fontSize: 15, 
                      color: 'rgb(025, 255, 200, 0.6)'}}>I see you, I hear you. You are allowed to learn and Dream</Typography>
                  </Box>

                  <Box justifyContent='center'>
                    <Typography sx={{fontSize: 35, fontWeight: '600',
                      color: 'rgb(205, 255, 200, 0.6)',
                      marginTop: 2, marginLeft: 3}}>Your Journey Begins Here.</Typography>
                    <Typography 
                      variant='h5'
                      sx={{fontWeight: 600, 
                      fontSize: 25, 
                      padding: 5,
                      maxWidth: 300,
                      color: 'rgb(025, 255, 200, 0.6)'}}>Unlocking potential by bridging the education gap</Typography>

                      <Typography sx={{color: 'white', marginBottom: 2}}>ElimSoul is a transformative digital platform designed to nurture underprivileged children. It blends AI-powered learning, sign language support,
                         and challenge-based engagement to build purpose, confidence, and connection.</Typography>

                      <Box display='flow'>
                        <Button variant='contained'
                        fullWidth
                        sx={{mrginBottom: 2}}
                          href='/signIn'>Sign In</Button>

                        <Button variant='outlined'
                        fullWidth
                          href='/signUp'>Create An Account</Button>
                      </Box>

                    <Button 
                      variant='outlined'
                      fullWidth
                      sx={{marginTop: 2}}
                      href='/dashboard'>Get Started</Button>
                  </Box>
      </Box>
    </Box>
    )}
  </Grid>
  );
}
