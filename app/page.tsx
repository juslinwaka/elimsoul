'use client'
import Link from 'next/link'
import Image from 'next/image'
import React, {useState} from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import { Button, Typography, TextField, 
  IconButton, InputAdornment, Divider } from '@mui/material'
import { useScreenConfig } from '@/hooks/screenConfig'
import { Visibility, VisibilityOff } from '@mui/icons-material'

import {useRouter} from 'next/navigation'
import { useToast } from '@/hooks/toast'
import { useLoading } from '@/hooks/loadingspinners'
import {auth, db, provider} from '@/lib/firebase'
import {doc, getDoc} from 'firebase/firestore'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

import {useEffect} from 'react'
import {onAuthStateChanged} from 'firebase/auth'

export default function Home() {
  const {isMobile, isTablet, isDesktop} = useScreenConfig();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {showToast, Toast} = useToast();
  const {showLoading, hideLoading} = useLoading();
  const router = useRouter();

  const checkUserProfileAndRedirect = async (uid: string) => {
    const userDoc = await getDoc(doc(db, 'users', uid));

    if (!userDoc.exists()){
      showToast("User profile not found. Redirecting to onboarding.", "info");
      router.push('/')
      hideLoading();
    }else{

      const userData = userDoc.data();
      if (!userData.fullName || !userData.role){
        router.push('/')
        hideLoading();
      }else{
        router.push('/dashboard')
        hideLoading();
      }
    }
  }

  const handleSignIn = async () => {
    try{
      showLoading();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      const token = await userCredential.user.getIdToken();

      const res = await fetch('/api/set-token', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({token}),
      });

      const data = await res.json();
      
      if (!res.ok){
        showToast(data.message || "Error signing in", "error");
        return;
      }

      showToast("Signed in successfully", "success");
      await checkUserProfileAndRedirect(userCredential.user.uid);
      await new Promise((resolve) => setTimeout(resolve, 500));
      router.push('/dashboard');

    }catch (error: any) {
      showToast(error.message, "error");
    }finally{
      hideLoading();
    }
  }

  const handleGoogleSignIn = async () => {
    try{
      showLoading();
      const result = await signInWithPopup(auth, provider);
      await checkUserProfileAndRedirect(result.user.uid);
      showToast("Signed in successful", "success");
    }catch (error: any) {
      showToast(error.message, "error");
    }finally{
      hideLoading();
    }
  }

  const handleTogglePassword = () => {
    setShowPassword(prev => !prev);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user){
        router.push('/dashboard');
      }
    });

    return () => unsubscribe();
  })
  return (
    <div className='min-h-screen bg-cover bg-center'>
      <title>Sign In | ElimSoul</title>
      {isMobile&& 
      <div>
        <Grid container spacing={2} 
        justifyContent='center' justifyItems='center' justifySelf='center'>
          <Grid size={9}>
          <Image
            src='/elimsoullogo.png'
            width={300}
            height={270}
            alt='Elimsoul Logo'/>
          </Grid>

          <Grid size={9} justifyItems='center' justifyContent='center'>
          <Typography pt={3} pl={3} variant='h1'
          className='flex justify-center' 
                  sx={{ fontWeight: 600, fontStyle: 'oblique'}} color='textSecondary'>
                  Welcome to ElimSoul
                </Typography>
          </Grid>

          <Grid size={8} justifySelf='center'>
            <Box p={1} justifySelf='center'>

              <form>
                <TextField 
                  fullWidth
                  size='small' 
                  color='primary'
                  label='Email'
                  value={email}
                  variant='outlined'
                  onChange={(e) => setEmail(e.target.value)}
                  type='email'
                  required/>

                <TextField 
                  size='small' 
                  fullWidth
                  label='Password'
                  color='primary'
                  type={showPassword ? 'text' : 
                    'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton onClick={handleTogglePassword} edge='end'>
                          {showPassword ? <VisibilityOff/> : <Visibility/> }
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  variant='outlined'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required/>

              </form>
              
            </Box>

          </Grid>

          <Grid size={8} 
            justifySelf='center'>
              <Box justifySelf='center'>
                <Button 
                  variant='contained'
                  color='secondary'
                  onClick={handleSignIn}> Sign In</Button>
              </Box>

              <Divider>OR</Divider>

              <Box pt={1} justifySelf='center'>
                <Button 
                  variant='outlined'
                  color='secondary'
                  onClick={handleGoogleSignIn}> Sign In with Google</Button>
              </Box>

              <Box pt={1} justifySelf='center'>
               <Typography color='secondary' variant='body2' align='center'
                   sx={{mt: 2}}>{"Don't have an account? "}
                   <Link href='/signUp' style={{textDecoration: 'none',
                    color: '#196d2', fontWeight: 'bold'}} passHref>Sign Up</Link></Typography>
              </Box>

              
          </Grid>
        </Grid>
      </div>
      }

      {isDesktop&& 
        <Grid container spacing={2} 
          justifyContent='center' 
          justifyItems='center' 
          justifySelf='center'>

          <Grid size={6}>
            <Image
              src='/elimsoullogo.png'
              width={610}
              height={510}
              alt='Elimsoul Logo'/>
          </Grid>

        <Grid size={5}>
          <Box  justifySelf='center'>
            <Grid container spacing={2}>
              <Grid size={8} justifySelf='center'>
                <Typography pt={3} pl={3} variant='h1' 
                   color='textSecondary'>
                  Welcome to ElimSoul
                </Typography>
              </Grid>

              <Grid size={8} justifySelf='center'>
            <Box p={1} justifySelf='center'>
            <form>
                <TextField 
                  fullWidth
                  size='small' 
                  color='primary'
                  label='Email'
                  variant='outlined'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}/>

                <TextField 
                  size='small' 
                  fullWidth
                  label='Password'
                  color='primary'
                  type={showPassword ? 'text' : 
                    'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton onClick={handleTogglePassword} edge='end'>
                          {showPassword ? <VisibilityOff/> : <Visibility/> }
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  variant='outlined'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required/>

              </form>
            </Box>
          </Grid>

          <Grid size={8} 
          pl={4}
            justifySelf='center'>
              <Box justifySelf='center'>
                <Button 
                  variant='contained'
                  color='secondary'
                  size='large'
                  onClick={handleSignIn}> Sign In</Button>
              </Box>

              <Divider>OR</Divider>

              <Box pt={1} justifySelf='center'>
                <Button 
                  variant='outlined'
                  color='secondary'
                  onClick={handleGoogleSignIn}> Sign In with Google</Button>
              </Box>

              <Box pt={1} justifySelf='center'>

                <Typography color='secondary' variant='body2' align='center'
                   sx={{mt: 2}}>{"Don't have an account? "}
                   <Link href='/signUp' style={{textDecoration: 'none',
                    color: '#196d2', fontWeight: 'bold'}} passHref>Sign Up</Link></Typography>
              </Box>
          </Grid>
            </Grid>
          </Box>
        </Grid>

      </Grid>
      }
    </div>
  );
}
