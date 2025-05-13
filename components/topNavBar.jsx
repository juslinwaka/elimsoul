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
    <AppBar position="fixed" color="default" elevation={1}>
      <Toolbar disableGutters>
        <Grid container alignItems="center">
          {isMobile && (
            <>
              <Grid item xs={2}>
                <IconButton
                  color="inherit"
                  edge="start"
                  onClick={handleDrawerToggle}
                >
                  <MenuIcon />
                </IconButton>
              </Grid>

              <Grid item xs={2}>
                <Image
                  src="/elimsoulnavlogo.png"
                  alt="Logo"
                  width={40}
                  height={40}
                />
              </Grid>

              <Grid item xs={5}>
                <Typography variant="h6" fontWeight={600}>
                  ElimSoul
                </Typography>
              </Grid>
            </>
          )}

          {isDesktop && (
            <>
              <Grid item>
                <Image
                  src="/elimsoulnavlogo.png"
                  alt="Logo"
                  width={60}
                  height={60}
                />
              </Grid>

              <Grid item>
                <Typography pl={3} variant="h5" fontWeight={600}>
                  ElimSoul
                </Typography>
              </Grid>

              <Grid item xs>
                <Box display="flex" justifyContent="center" gap={2} pl={3}>
                  <Button href='/' variant="text">Dashboard</Button>
                  <Button href='/elimqa' variant="text">Elim Q&A</Button>
                  <Button href='/summarizer' variant="text">Elim Summerizer</Button>
                  <Button href='/elimacademy' variant="text">Elim Academy</Button>
                  <Button href='/religious' variant="text">ElimSoul Religious</Button>
                </Box>
              </Grid>

              <Grid item xs>
                <Box display='flex' justifyContent='center' gap={2} pl={7}>
                  <Button href='/messages' variant="outlined">Messages</Button>
                  <Button href='/about' variant="outlined">About Us</Button>
                  <Button href='/settings' variant="outlined">Settings</Button>
                </Box>
              </Grid>

              <Grid item>
                <Box pl={6} pr={2}>
                  <Button variant='contained'>Donate</Button>
                </Box>
              </Grid>

              <Grid item>
                <Box pr={2}>
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
            <Link href="/settings" passHref legacyBehavior>
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