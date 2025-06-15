'use client'
import Grid from '@mui/material/Grid'

import Link from 'next/link';
import PDFViewer from '@/components/pdfViewer';
import React, { useState } from 'react';
import { Box, Button,
  IconButton,
    Menu,
    MenuItem,
    Typography,
  Drawer } from '@mui/material';
import { useScreenConfig } from '@/hooks/screenConfig';
import MenuIcon from '@mui/icons-material/Menu';

export default function Academy() {
  const [pdfPath, setPdfPath] = useState(''); 
  const {isMobile, isDesktop} = useScreenConfig();

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


  const handleAlphabets = () => {
    setPdfPath('/docs/Alphabets.pdf');
  }

  const handleNums = () => {
    setPdfPath('/docs/Numbers.pdf')
  }

  const handlecolors = () => {
    setPdfPath('/docs/Colors.pdf')
  }

  const handleBSC = () => {
    setPdfPath('/docs/Basic Conversation.pdf')
  }
  const handleEdu = () => {
    setPdfPath('/docs/Education.pdf');
  }

  const handleEmotion = () => {
    setPdfPath('/docs/Emotions.pdf')
  }

  const handleFamilyPeople = () => {
    setPdfPath('/docs/Family And People.pdf')
  }

  const handleFoodDrink = () => {
    setPdfPath('/docs/Food and Drink.pdf')
  }
  const handleHealth = () => {
    setPdfPath('/docs/Health.pdf')
  }

  const handleProfessions = () => {
    setPdfPath('/docs/Profession.pdf')
  }

  const handlePlaces = () => {
    setPdfPath('/docs/Religion.pdf')
  }
  const handleReligion = () => {
    setPdfPath('/docs/Religion.pdf');
  }

  const handleTime = () => {
    setPdfPath('/docs/Time.pdf')
  }

  const handleSport = () => {
    setPdfPath('/docs/Sport.pdf')
  }

  const handleTransportation = () => {
    setPdfPath('/docs/Transport.pdf')
  }
  const handleWeatherNature = () => {
    setPdfPath('/docs/Weather and Nature.pdf')
  }


  return (
    <Grid container spacing={2} justifyContent='center' alignItems='center'>
      <title>Academy Lab | ElimSoul</title>
      {isDesktop &&
      <Grid size={12} pt={6} >
        <Box display='flex' sx={{margin: 2}} justifyContent="center">
          <Button variant='outlined' onClick={handleAlphabets}>MSL Alphabets</Button>
          <Button variant='outlined' onClick={handleBSC}>MSL Basic Conversation</Button>
          <Button variant='outlined' onClick={handleNums}>MSL Numbers</Button>
          <Button variant='outlined' onClick={handlecolors}>MSL Colors</Button>
          <Button variant='outlined' onClick={handleEdu}>MSL Education</Button>
          <Button variant='outlined' onClick={handleEmotion}>MSL Emotions</Button>
          <Button variant='outlined' onClick={handleFamilyPeople}>MSL Family & People</Button>
          <Button variant='outlined' onClick={handleFoodDrink}>MSL Food & Drink</Button>
        </Box>
        <Box display='flex' sx={{margin: 2}} justifyContent="center">
          <Button variant='outlined' onClick={handleHealth}>MSL Health</Button>
          <Button variant='outlined' onClick={handleProfessions}>MSL Professions</Button>
          <Button variant='outlined' onClick={handlePlaces}>MSL Places</Button>
          <Button variant='outlined' onClick={handleReligion}>MSL Religion</Button>
          <Button variant='outlined' onClick={handleTime}>MSL Time</Button>
          <Button variant='outlined' onClick={handleSport}>MSL Sport</Button>
          <Button variant='outlined' onClick={handleTransportation}>MSL Transportation</Button>
          <Button variant='outlined' onClick={handleWeatherNature}>MSL Weather & Nature</Button>
        </Box>
      </Grid>
      }
        {isMobile && 
          <Grid size={12} pt={6}>
            <IconButton
                            sx={{ color: 'white', marginLeft: '5px' }}
                              edge="start"
                              onClick={handleDrawerToggle}
                            >
                              <MenuIcon />
                            </IconButton>
          </Grid>
        }

      {pdfPath && 
      <Grid>
        <PDFViewer fileUrl={pdfPath}/>
      </Grid>}

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
                    backgroundColor: 'darkblue', // or use `#fff`
                  },
                }}>
              
                <Box p={2} width={200}>
                  <Typography variant="h6" color='secondary'>MSL LESSONS</Typography>
                  <Button size='small' onClick={handleAlphabets} >
                    <MenuItem color='primary' onClick={handleDrawerToggle}>MSL Alphabets</MenuItem>
                  </Button>
                  <Button size='small' onClick={handleBSC}>
                    <MenuItem color='primary' onClick={handleDrawerToggle}>MSL Basic Conversation</MenuItem>
                  </Button>
                  <Button  size='small' onClick={handleNums}>
                    <MenuItem onClick={handleDrawerToggle}>MSL Numbers</MenuItem>
                  </Button>
                  <Button size='small' onClick={handlecolors}>
                    <MenuItem onClick={handleDrawerToggle}>MSL Colors</MenuItem>
                  </Button>
                  <Button size='small' onClick={handleEdu}>
                    <MenuItem onClick={handleDrawerToggle}>MSL Education</MenuItem>
                  </Button>
                  <Button size='small' onClick={handleEmotion}>
                    <MenuItem onClick={handleDrawerToggle}>MSL Emotions</MenuItem>
                  </Button>
                  <Button size='small' onClick={handleFamilyPeople}>
                    <MenuItem onClick={handleDrawerToggle}>MSL Family & People</MenuItem>
                  </Button>
                  <Button size='small' onClick={handleFoodDrink}>
                    <MenuItem color='primary' onClick={handleDrawerToggle}>MSL Food & Drink</MenuItem>
                  </Button>
                  <Button  size='small' onClick={handleHealth}>
                    <MenuItem onClick={handleDrawerToggle}>MSL Health</MenuItem>
                  </Button>
                  <Button size='small' onClick={handleProfessions}>
                    <MenuItem onClick={handleDrawerToggle}>MSL Professions</MenuItem>
                  </Button>
                  <Button size='small' onClick={handlePlaces}>
                    <MenuItem onClick={handleDrawerToggle}>MSL Places</MenuItem>
                  </Button>
                  <Button size='small' onClick={handleReligion}>
                    <MenuItem onClick={handleDrawerToggle}>MSL Religion</MenuItem>
                  </Button>
                  <Button size='small' onClick={handleTime}>
                    <MenuItem onClick={handleDrawerToggle}>MSL Time</MenuItem>
                  </Button>
                  <Button size='small' onClick={handleSport}>
                    <MenuItem onClick={handleDrawerToggle}>MSL Sport</MenuItem>
                  </Button>
                  <Button size='small' onClick={handleTransportation}>
                    <MenuItem onClick={handleDrawerToggle}>MSL Transportation</MenuItem>
                  </Button>
                  <Button size='small' onClick={handleWeatherNature}>
                    <MenuItem onClick={handleDrawerToggle}>MSL Weather & Nature</MenuItem>
                  </Button>
                </Box>
              </Drawer>
    </Grid>
  );
}