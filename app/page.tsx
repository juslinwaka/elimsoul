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

import '@/app/src/styles.css'

export default function Home() {
  const {isMobile, isTablet, isDesktop} = useScreenConfig();
  const router = useRouter();

  return (
  <Grid>
    <title>Getting Started | Elimsoul </title>
    {isDesktop && (
      <Box sx={{margin: 'auto'}} justifyContent='center' justifyItems='center'>
        <Box width={1200}
          display='flow'
          
          sx={{
            px: 4,
            py: 6, 
            maxWidth: 800,
            mx: 'auto',
            backdropFilter: 'blur(6px)',
            backgroundColor: 'rgb(0, 123, 255, 0.05)',
            borderRadius: 4,
            boxShadow: 3
          }}
          justifyItems='center'>
             <Typography variant="h3" sx={{color: 'white'}} fontWeight="bold" gutterBottom>
        ✨ Get Started with ElimSoul
      </Typography>

      <Typography variant="h6" color="text.secondary" mb={4}>
        Where purpose meets growth.
      </Typography>

      {/* Step 1 */}
      <Typography variant="h5" sx={{color: 'white'}} fontWeight="medium" gutterBottom>
        🚀 Step 1: Create or Sign In
      </Typography>
      <Typography mb={2} sx={{color: 'white'}}>
        Sign up to begin your journey or log in to continue. You’ll unlock access to AI support, lesson paths, XP rewards, and more.
      </Typography>
      <Stack direction="row" spacing={2} mb={4} >
        <Button variant="contained" onClick={() => router.push('/signUp')}>
          Sign Up
        </Button>
        <Button variant="outlined" onClick={() => router.push('/signIn')}>
          Sign In
        </Button>
      </Stack>

      <Divider sx={{ my: 4, '&::before, &::after': { borderColor: 'primary.light' } }}>
        OR
      </Divider>

      {/* Step 2 */}
      <Typography variant="h5" fontWeight="medium" gutterBottom sx={{color: 'white'}}>
        📚 Step 2: Choose Your Path
      </Typography>
      <Typography mb={2} >
        Explore a world of learning and spiritual growth:
      </Typography>
      <ul >
        <li ><strong>ElimSoul Academy</strong> – Learn core school subjects with interactive XP-tracked lessons.</li>
        <li><strong>MSL Zone</strong> – Master sign language through animated gloss-based videos.</li>
        <li><strong>Voice of Purpose</strong> – Share your voice, be heard, and get featured.</li>
        <li><strong>Light Challenge</strong> – Join a 7-day transformational challenge.</li>
      </ul>

      <Divider sx={{ my: 4 }} />

      {/* Step 3 */}
      <Typography sx={{color: 'white'}} variant="h5" fontWeight="medium" gutterBottom>
        🌟 Step 3: Engage, Earn, and Grow
      </Typography>
      <Typography mb={2}>
        Complete lessons, earn XP, maintain streaks, and grow your soul and mind.
      </Typography>
      <ul>
        <li>🧩 Solve quizzes to unlock content</li>
        <li>🎖️ Earn badges and track your streaks</li>
        <li>💬 Share your voice to inspire others</li>
        <li>🎁 Refer friends and unlock secret content</li>
      </ul>

      {/* Help Section */}
      <Box mt={4}>
        <Typography variant="body1" color="text.secondary" sx={{color: 'white'}}>
          🙋 Need help? Click <strong>"Ask ElimSoul"</strong> anytime for instant support from our AI guide.
        </Typography>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Final CTA */}
      <Typography variant="h6" mb={2} sx={{color: 'white'}}>
        You have greatness inside you. Let’s unlock it together.
      </Typography>
      <Button
        size="large"
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={() => router.push('/dashboard')}
      >
        Start My Journey 🌱
      </Button>

        </Box>

      </Box>
    )}

    {isMobile && (
      <Box justifyContent='center' justifyItems='center'>
        <Box width={280}
          display='flow'
          
          sx={{
            px: 4,
            py: 6, 
            maxWidth: 800,
            mx: 'auto',
            backdropFilter: 'blur(6px)',
            backgroundColor: 'rgb(0, 123, 255, 0.05)',
            borderRadius: 4,
            boxShadow: 3
          }}
          justifyItems='center'>
             <Typography variant="h3" sx={{color: 'white'}} fontWeight="bold" gutterBottom>
        ✨ Get Started with ElimSoul
      </Typography>

      <Typography variant="h6" color="text.secondary" mb={4}>
        Where purpose meets growth.
      </Typography>

      {/* Step 1 */}
      <Typography variant="h5" sx={{color: 'white'}} fontWeight="medium" gutterBottom>
        🚀 Step 1: Create or Sign In
      </Typography>
      <Typography mb={2} sx={{color: 'white'}}>
        Sign up to begin your journey or log in to continue. You’ll unlock access to AI support, lesson paths, XP rewards, and more.
      </Typography>
      <Stack direction="row" spacing={2} mb={4} >
        <Button variant="contained" onClick={() => router.push('/signUp')}>
          Sign Up
        </Button>
        <Button variant="outlined" onClick={() => router.push('/signIn')}>
          Sign In
        </Button>
      </Stack>

      <Divider sx={{ my: 4, '&::before, &::after': { borderColor: 'primary.light' } }}>
        OR
      </Divider>

      {/* Step 2 */}
      <Typography variant="h5" fontWeight="medium" gutterBottom sx={{color: 'white'}}>
        📚 Step 2: Choose Your Path
      </Typography>
      <Typography mb={2} >
        Explore a world of learning and spiritual growth:
      </Typography>
      <ul >
        <li ><strong>ElimSoul Academy</strong> – Learn core school subjects with interactive XP-tracked lessons.</li>
        <li><strong>MSL Zone</strong> – Master sign language through animated gloss-based videos.</li>
        <li><strong>Voice of Purpose</strong> – Share your voice, be heard, and get featured.</li>
        <li><strong>Light Challenge</strong> – Join a 7-day transformational challenge.</li>
      </ul>

      <Divider sx={{ my: 4 }} />

      {/* Step 3 */}
      <Typography sx={{color: 'white'}} variant="h5" fontWeight="medium" gutterBottom>
        🌟 Step 3: Engage, Earn, and Grow
      </Typography>
      <Typography mb={2}>
        Complete lessons, earn XP, maintain streaks, and grow your soul and mind.
      </Typography>
      <ul>
        <li>🧩 Solve quizzes to unlock content</li>
        <li>🎖️ Earn badges and track your streaks</li>
        <li>💬 Share your voice to inspire others</li>
        <li>🎁 Refer friends and unlock secret content</li>
      </ul>

      {/* Help Section */}
      <Box mt={4}>
        <Typography variant="body1" color="text.secondary" sx={{color: 'white'}}>
          🙋 Need help? Click <strong>"Ask ElimSoul"</strong> anytime for instant support from our AI guide.
        </Typography>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Final CTA */}
      <Typography variant="h6" mb={2} sx={{color: 'white'}}>
        You have greatness inside you. Let’s unlock it together.
      </Typography>
      <Button
        size="large"
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={() => router.push('/dashboard')}
      >
        Start My Journey 🌱
      </Button>

        </Box>

      </Box>
    )}
  </Grid>
  );
}
