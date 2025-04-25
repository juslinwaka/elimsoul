'use client'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import { Button, Typography, TextField } from '@mui/material'
import { useScreenConfig } from '@/hooks/screenConfig'

export default function Home() {
  const {isMobile, isTablet, isDesktop} = useScreenConfig();
  const theme = useTheme();
  return (
    <div className='min-h-screen bg-cover bg-center' >

      {isMobile&& 
      <div>
        <Grid container spacing={2} justifyContent='center' justifyItems='center' justifySelf='center'>
          <Grid size={9}>
          <Image
            src='/elimsoullogo.png'
            width={320}
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
              <TextField 
                inputMode='email' 
                size='small' 
                helperText='Email' color='primary'>Email</TextField>
            </Box>

            <Box p={1} justifySelf='center'>
              <TextField 
                size='small' 
                color='primary' helperText='Password'> Password</TextField>
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
                <Button 
                  variant='text'
                  color='secondary'
                  size='small'> Create An Account</Button>
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
              width={910}
              height={810}
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
              <TextField inputMode='email' helperText='Email' color='primary'>Email</TextField>
            </Box>

            <Box p={1} justifySelf='center'>
              <TextField helperText='Password'> Password</TextField>
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
                <Button 
                  variant='text'
                  color='secondary'
                  size='large'> Create An Account</Button>
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
