'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Grid,
  Drawer
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Image from 'next/image';
import LogoutButton from '@/components/signOutButton';
import { useScreenConfig } from '@/hooks/screenConfig';
import '@/app/src/styles.css'

const TopNavBar = () => {
  const { isMobile, isDesktop } = useScreenConfig();

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <AppBar position='sticky' color='default' elevation={1} sx={{margin: 'auto'}}>
      <Toolbar disableGutters className='bg-gradient-blue' >
        <Grid container alignItems="center">
          {isMobile && (
            <>
              <Grid xs={2}>
                <IconButton
                sx={{ color: 'white', marginLeft: '5px' }}
                  edge="start"
                  onClick={handleDrawerToggle}
                >
                  <MenuIcon />
                </IconButton>
              </Grid>

              <Grid xs={2}>
                <Image
                  src="/elimsoulnavlogo.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  onClick={{href: '/'}}
                />
              </Grid>

              <Grid  xs={3}>
                <Typography variant="h6" fontWeight={600} sx={{color: 'white'}}>
                  ElimSoul
                </Typography>
              </Grid>
            </>
          )}

          {isDesktop && (
            <>
              <Grid >
                <Image
                  src="/elimsoulnavlogo.png"
                  alt="Logo"
                  width={50}
                  height={50}
                />
              </Grid>

              <Grid xs>
                <Typography pl={1} variant="h5" fontWeight={600} sx={{color: 'white'}}>
                  ElimSoul
                </Typography>
              </Grid>

              <Grid xs>
                <Box display="flex" justifyContent="center">
                  <Button href='/dashboard' variant="text" passHref>Dashboard</Button>
                  <Button href='/elimqa' variant="text" passHref>Elim Q&A</Button>
                  <Button href='/summarizer' variant="text" passHref>Elim Summerizer</Button>
                  <Button href='/elimacademy' variant="text" passHref>Elim Academy</Button>
                  <Button href='/religious' variant="text" passHref>ElimSoul Religious</Button>
                </Box>
              </Grid>

              <Grid xs>
                <Box display='flex' justifyContent='center' gap={1} pl={2}>
                  <Button href='/messages' variant="outlined" passHref>Messages</Button>
                  <Button href='/about' variant="outlined" passHref>About Us</Button>
                  <Button href='/settings' variant="outlined" passHref>Settings</Button>
                </Box>
              </Grid>

              <Grid xs>
                <Box pl={2}>
                  <Button href='/donate' variant='contained' passHref>Donate</Button>
                </Box>
              </Grid>

              <Grid xs>
                <Box pl={1}>
                  <LogoutButton />
                </Box>
              </Grid>

              
            </>
          )}
        </Grid>

        <Menu
          id="drawer-menu"
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Link href="/blogs/adventures" passHref legacyBehavior>
            <MenuItem onClick={handleMenuClose}>Adventures</MenuItem>
          </Link>
        </Menu>

        <Drawer anchor="left" 
          open={drawerOpen} 
          onClose={handleDrawerToggle}
          sx={{
            '& .MuiDrawer-paper': {
              backgroundColor: 'white', // or use `#fff`
            },
          }}>
        
          <Box p={2} width={250}>
            <Typography variant="h6" color='secondary'>Navigation</Typography>
            <Link href="/dashboard" passHref legacyBehavior>
              <MenuItem color='primary' onClick={handleDrawerToggle}>DASHBOARD</MenuItem>
            </Link>
            <Link href="/elimqa" passHref legacyBehavior>
              <MenuItem color='primary' onClick={handleDrawerToggle}>Elim Q&A</MenuItem>
            </Link>
            <Link href="/summarizer" passHref legacyBehavior>
              <MenuItem onClick={handleDrawerToggle}>Elim Summarizer</MenuItem>
            </Link>
            <Link href="/elimacademy" passHref legacyBehavior>
              <MenuItem onClick={handleDrawerToggle}>Elim Academy</MenuItem>
            </Link>
            <Link href="/religious" passHref legacyBehavior>
              <MenuItem onClick={handleDrawerToggle}>ElimSoul Religous</MenuItem>
            </Link>
            <Link href="/about" passHref legacyBehavior>
              <MenuItem onClick={handleDrawerToggle}>About Us</MenuItem>
            </Link>
            <Link href="/donate" passHref legacyBehavior>
              <MenuItem onClick={handleDrawerToggle}>Donate</MenuItem>
            </Link>
            <LogoutButton />
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavBar;
// This code defines a TopNavBar component that serves as a navigation bar for a web application.