'use client'
import Link from 'next/link'
import Image from 'next/image'
import React, {useState} from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import { Button, Typography, TextField, 
  IconButton, InputAdornment } from '@mui/material'
import { useScreenConfig } from '@/hooks/screenConfig'
import { Visibility, VisibilityOff } from '@mui/icons-material'

export default function Home() {
  const {isMobile, isTablet, isDesktop} = useScreenConfig();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(prev => !prev);
  }
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
                  variant='outlined'
                  type='email'/>

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
                  variant='outlined'/>

              </form>
              
            </Box>

          </Grid>

          <Grid size={8} 
            justifySelf='center'>
              <Box justifySelf='center'>
                <Button 
                  variant='contained'
                  color='secondary'> Sign In</Button>
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
                  type='email'/>

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
                  variant='outlined'/>

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
                  size='large'> Sign In</Button>
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
