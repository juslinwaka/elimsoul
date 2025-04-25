'use client'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import { Button, Typography } from '@mui/material'
import { useScreenConfig } from '@/hooks/screenConfig'

export default function Home() {
  const {isMobile, isTablet, isDesktop} = useScreenConfig();
  const theme = useTheme();
  return (
    <div className='h-fill bg-cover bg-center' >

      {isMobile&& 
      <div>
        <Grid container spacing={2}>
          <Grid size={9}>
          <Image
            src='/elimsoullogo.png'
            width={380}
            height={300}
            alt='Elimsoul Logo'/>
          </Grid>

          <Grid size={9}>
          <Typography pt={3} pl={3} variant='h2' 
                  sx={{ fontWeight: 600, fontStyle: 'oblique'}} color='textSecondary'>
                  Welcome to ElimSoul
                </Typography>
          </Grid>
        </Grid>
      </div>
      }

      {isDesktop&& 
        <Grid container spacing={2}>
          <Grid size={6}>
            <Image
              src='/elimsoullogo.png'
              width={810}
              height={810}
              alt='Elimsoul Logo'/>
          </Grid>

        <Grid size={6}>
          <Box >
            <Grid container spacing={2}>
              <Grid size={8}>
                <Typography pt={3} pl={3} variant='h1' 
                   color='textSecondary'>
                  Welcome to ElimSoul
                </Typography>

              </Grid>
            </Grid>
          </Box>
        </Grid>

      </Grid>
      }
    </div>
  );
}
