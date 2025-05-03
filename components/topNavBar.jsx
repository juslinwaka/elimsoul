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
import LogoutButton from '@/components/signOutButton';

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

        <Typography pl={5} variant='h5' fontWeight={600}>ElimSoul</Typography>

        <Box pl={9} sx={{position: 'static',left: 0, top:0,  right: 0}} elevation={3}>
            <Grid container spacing={2} direction='row'>

              <Grid>
                <Button variant='text'>Dashboard</Button>
              </Grid>

              <Grid>
                <Button variant='text'>Messages</Button>
              </Grid>

              <Grid>
                <Button variant='text'>AboutUs</Button>
              </Grid>

              <Grid>
                <Button variant='text'>Settings</Button>
              </Grid>


            </Grid>
          </Box>
       
          <Box pr={1} sx={{position: 'fixed', right: 0}}>
            <LogoutButton />
          </Box>
      </Toolbar>
      }
    </AppBar>
  );
}

export default TopNavBar;
