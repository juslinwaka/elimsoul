'use client'

import React from 'react';
import { AppBar, Toolbar, 
  Typography, Box,
  IconButton, 
  List, 
  ListItem,   
  useMediaQuery,
  Menu,
  Button,
  MenuItem, Grid } from '@mui/material';
import Image from 'next/image';
import { useScreenConfig } from '@/hooks/screenConfig'
import MenuIcon from '@mui/icons-material/Menu';

const TopNavBar = () => {

  const {isMobile, isTablet, isDesktop} = useScreenConfig();
  
  return (
    <AppBar position='fixed' color='default' elevation={1}>
      {isMobile &&
        <Toolbar disableGutters style={{minHeight: 30}}>
          <Grid container spacing={2}>
            <Grid size={3}>
              <Box>
                <IconButton color='inherit'
                  edge='end'
                  sx={{display: {xs: 'block', md: 'none'}}}>
                  <MenuIcon />
                </IconButton>
              </Box>
            </Grid>

            <Grid pl={2} size={3}>
              <Image pl={2} src='/elimsoulnavlogo.png' alt='Logo' width={40} height={40}/>
            </Grid>

            <Grid size={3}>
              <Box justifyContent='center' justifyItems='center' justifySelf='left' pl={4}>
                
                <Typography pt={1} justifySelf='center' variant='h6' fontWeight={600}>ElimSoul</Typography>
              </Box>
              
            </Grid>
          </Grid>
        </Toolbar>
      }

      {isDesktop && 
      <Toolbar>
        <Image src='/elimsoulnavlogo.png' alt='Logo' width={60} height={60}/>

        <Typography variant='h5' fontWeight={600}>ElimSoul</Typography>
      </Toolbar>
      }
    </AppBar>
  );
}

export default TopNavBar;
