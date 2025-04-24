'use client'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { Button, Typography } from '@mui/material'

export default function Home() {
  return (
    <div className='h-full'>
      <Grid container spacing={2} 
        >
        <Grid size={6}>
          <Image
            src='/elimsoullogo.png'
            width={950}
            height={750}
            alt='Elimsoul Logo'/>
        </Grid>

        <Grid size={6} sx={{backgroundColor: 'background.default'}}>
          <Box >
            <Grid container spacing={2}>
              <Grid size={4}>
                <Image
                 src='/bg.jpeg'
                  width={890}
                  height={850}
                  alt='Elimsoul Logo'/>

              </Grid>

            </Grid>

          </Box>
        </Grid>

      </Grid>
    </div>
  );
}
