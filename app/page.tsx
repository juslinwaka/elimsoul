'use client'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export default function Home() {
  return (
    <div className='min-h-screen items-center justify-center'>
      <Grid container spacing={5}>
        <Grid size={5}>
          <Image
            src='/elimsoullogo.png'
            width={850}
            height={800}
            alt='Elimsoul Logo'/>
        </Grid>

        <Grid size={7}>
          <Typography>
            Welcome to Elimsoul
          </Typography>
          <Image
            src='/elimsoullogo.png'
            width={850}
            height={800}
            alt='Elimsoul Logo'/>
        </Grid>

      </Grid>
    </div>
  );
}
