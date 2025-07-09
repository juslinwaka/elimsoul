// app/signIn.tsx

'use client'
import Link from 'next/link'
import React, {useState} from 'react';
import { useScreenConfig } from '@/hooks/screenConfig';
import { Grid, 
    Box, 
    Button,
    Typography,
    TextField,
    Divider,
    IconButton,
    InputAdornment} from '@mui/material';
import { AccountCircle, Person, AccountBox } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles'
import { Visibility, VisibilityOff } from '@mui/icons-material'

import {useRouter} from 'next/navigation'
import { useToast } from '@/hooks/toast'
import { useLoading } from '@/hooks/loadingspinners'
import {auth, db, provider} from '@/lib/firebase'
import {doc, getDoc} from 'firebase/firestore'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { sendPasswordResetEmail } from 'firebase/auth';
import {useEffect} from 'react'
import {onAuthStateChanged} from 'firebase/auth'
import '@/app/src/styles.css'


    

export default function SignIn() {
  const { isMobile, isDesktop } = useScreenConfig();

    const theme = useTheme();
    const [showPassword, setShowPassword] = useState(false);
  
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  
    const {showToast, Toast} = useToast();
    const {showLoading, hideLoading} = useLoading();
    const router = useRouter();
  
    const checkUserProfileAndRedirect = async (uid: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));

    if (!userDoc.exists()) {
      showToast("User profile not found. Redirecting to onboarding.", "info");
    
      return;
    }

    const userData = userDoc.data();

    if (!userData || !userData.fullName || !userData.role) {
      showToast("Incomplete profile. Redirecting to onboarding.", "info");
      return;
    }

    // ✅ Redirect based on role
    if (userData.role === 'Instructor') {
      router.push('/instructorsDashboard');
    } else {
      router.push('/dashboard');
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    showToast("Error verifying profile", "error");
    router.push('/error');
  } finally {
    hideLoading();
  }
};


    const handleForgotPassword = async () => {
      if (!email) {
        showToast('Please enter your email to reset password.', 'warning');
          return;
      }

      try {
        showLoading();
        await sendPasswordResetEmail(auth, email);
        showToast('Password reset link sent to your email.', 'success');
      } catch (error: any) {
        showToast(error.message || 'Failed to send reset email.', 'error');
      } finally {
        hideLoading();
      }
    };

  
    const handleSignIn = async () => {
  try {
    showLoading();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();

    const res = await fetch('/api/set-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (!res.ok) {
      showToast("Error signing in", "error");
      return;
    }

    showToast("Signed in successfully", "success");

    // Use the uid from sign-in result (NOT auth.currentUser)
    await checkUserProfileAndRedirect(userCredential.user.uid);

  } catch (error: any) {
    showToast(error.message || 'Sign-in error', 'error');
  } finally {
    hideLoading();
  }
};

  
    const handleGoogleSignIn = async () => {
      try{
        showLoading();
        const result = await signInWithPopup(auth, provider);

        const token = await result.user.getIdToken();
  
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
        await checkUserProfileAndRedirect(result.user.uid);
        await new Promise((resolve) => setTimeout(resolve, 500));
        router.push('/dashboard');
  
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
    <Grid container spacing={2} width='100%'>
        <title>Sign In | Elimsoul</title>
        {isDesktop && (
            <Box sx={{ margin: 'auto'}} justifyContent='center' >
                
                <Box width={500}
                display='flow' 
                height={550} 
                sx={{margin: 2, padding: 2, 
                  backgroundColor: 'rgba(0, 123, 255, 0.2)', borderRadius: 2, boxShadow: 3}}
                //justifyContent='center'
                justifyItems='center'>
                    <AccountCircle fontSize='large' sx={{fontSize: 100, marginTop: 5, color: 'white'}}/>
                    <Typography variant='h6'>Welcome to Elimsoul</Typography>
                <form>
                    <TextField
                        label='Email'
                        value={email}
                        sx={{marginTop: 2,
                            input: {color: 'white'},
                            label: {color: 'white'},
                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                        }}
                        fullWidth
                        type='email'
                        size='small'
                        onChange={(e) => setEmail(e.target.value)}
                        required/>

                    <TextField
                        label='Password'
                        sx={{marginTop: 2,
                            input: {color: 'white'},
                            label: {color: 'white'},
                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                        }}
                        fullWidth
                        size='small'
                        type={showPassword ? 'text' : 
                            'password'}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position='end'>
                                <IconButton onClick={handleTogglePassword} edge='end'>{showPassword ? <VisibilityOff/>
                                    : <Visibility/>
                                }</IconButton>
                                </InputAdornment>
                            )
                        }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required/>
                    

                    <Button
                        variant='outlined'
                        fullWidth 
                        sx={{marginTop: 2, color: 'white', 
                            backgroundColor: 'rgba(0, 123, 255, 0.5)'
                        }}
                        onClick={handleSignIn}>Sign In</Button>

                    <Button variant='text'
                        fullWidth 
                        sx={{marginTop: 2, color: 'rgba(218, 166, 213, 0.5)'}}
                        onClick={handleForgotPassword}>Forgot Password?</Button>

                    <Button
                        fullWidth
                        variant='text' 
                        href='/signUp'
                        sx={{marginTop: 2,
                            Color: 'rgba(0, 123, 255, 0.5)'
                        }}>Don't have an account. Sign Up</Button>

                    <Divider sx={{my: 2, color: 'white', marginTop: 2, marginBottom: 2, width: '100%'}}>OR</Divider>

                    <Button variant='outlined'
                     sx={{ 
                        backgroundColor: 'orange', color: 'black',
                     }}
                     fullWidth
                     onClick={handleGoogleSignIn}>Sign In With Google</Button>

                   </form>
                </Box>

            </Box>
        )}

                {isMobile && (
            <Box justifyContent='center' >
                <Box width='auto'
                display='flow' 
                sx={{margin: 2, backgroundColor: 'rgba(0, 123, 255, 0.2)', borderRadius: 2, boxShadow: 3}}
                //justifyContent='center'
                justifyItems='center'>
                    <AccountCircle fontSize='large' sx={{fontSize: 100, marginTop: 5, color: 'white'}}/>
                    <Typography variant='h6' justifySelf='center'>Welcome to Elimsoul</Typography>

                <form >
                    <TextField
                        label='Email'
                        sx={{marginTop: 2,
                            input: {color: 'white'},
                            label: {color: 'white'},
                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                        }}
                        fullWidth
                        type='email'
                        size='small'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required/>

                    <TextField
                        label='Password'
                        sx={{marginTop: 2,
                            input: {color: 'white'},
                            label: {color: 'white'},
                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                        }}
                        fullWidth
                        size='small'
                        value={password}
                        type={showPassword ? 'text' : 
                            'password'}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        <IconButton onClick={handleTogglePassword} edge='end'>
                                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                            onChange={(e) => setPassword(e.target.value)}
                            required/>
                
                    <Button
                        variant='outlined'
                        fullWidth 
                        sx={{marginTop: 2, color: 'white',
                            backgroundColor: 'rgba(0, 123, 255, 0.5)'
                        }}
                        onClick={handleSignIn}>Sign In</Button>

                    <Button 
                        variant='text'
                        fullWidth 
                        sx={{marginTop: 2, color: 'rgba(218, 166, 213, 0.5)'}}
                        onClick={handleForgotPassword}>
                                Forgot Password?</Button>

                    <Button
                        fullWidth  
                        variant='text' sx={{marginTop: 2,
                            Color: 'rgba(0, 123, 255, 0.5)'
                        }}>Don't have an account.<Link href='/signUp'> Sign Up</Link></Button>

                    <Divider sx={{my: 2, color: 'white', marginTop: 2, marginBottom: 2, width: '100%'}}>OR</Divider>

                    <Button variant='outlined'
                    
                     sx={{
                        backgroundColor: 'orange', color: 'black'
                     }}
                     fullWidth
                     onClick={handleGoogleSignIn}>Sign In With Google</Button>
                     </form>
                </Box>

            </Box>
        )}
    </Grid>
  );
}
