'use client'

import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import Image from 'next/image';
import { useScreenConfig } from '@/hooks/screenConfig'

const TopNavBar = () => {

  const {isMobile, isTablet, isDesktop} = useScreenConfig();
  
  return (
    <AppBar position='fixed' color='default' elevation={1}>
      {isMobile &&
        <Toolbar disableGutters style={{minHeight: 30}}>
          <Image src='/elimsoullogo.png' alt='Logo' width={60} height={60}/>

        </Toolbar>
      }

      {isDesktop && 
      <Toolbar>
        <Image src='/elimsoullogo.png' alt='Logo' width={60} height={60}/>

        <Typography variant='h5' fontWeight={600}>ElimSoul</Typography>
      </Toolbar>
      }
    </AppBar>
  );
}

export default TopNavBar;
