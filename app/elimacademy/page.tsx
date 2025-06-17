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
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import TranslateIcon from '@mui/icons-material/Translate';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import NumbersIcon from '@mui/icons-material/Numbers';
import PaletteIcon from '@mui/icons-material/Palette';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import PeopleIcon from '@mui/icons-material/People';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import WorkIcon from '@mui/icons-material/Work';
import PlaceIcon from '@mui/icons-material/Place';
import ChurchIcon from '@mui/icons-material/Church';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import WbSunnyIcon from '@mui/icons-material/WbSunny';

export default function Academy() {
  const [pdfPath, setPdfPath] = useState(''); 
  const {isMobile, isDesktop} = useScreenConfig();

  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  interface DrawerClickEvent extends React.MouseEvent<HTMLButtonElement> {}

  const handleDrawerClick = (event: DrawerClickEvent) => {
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
      <Box mt={2} textAlign="center">
         <Typography variant="h5" fontWeight="semibold" sx={{color: 'white'}}>👋 Welcome to ElimSoul Academy – MSL Lessons 📚🤟</Typography>
          <Typography variant="body1" mt={1} sx={{color: 'white'}}>
              Dive into the beautiful world of Malawian Sign Language 🌍.  
              Learn to sign the alphabet 🔤, emotions 😊, professions 👩🏽‍🏫, nature 🌳, and more — one lesson at a time!
          </Typography>
        </Box>
        <Box display='flex' sx={{margin: 2}} justifyContent="center">
          <Button variant='outlined' startIcon={<TranslateIcon />} onClick={handleAlphabets}>MSL Alphabets</Button>
          <Button variant='outlined' startIcon={<ChatBubbleOutlineIcon />} onClick={handleBSC}>Basic Conversation</Button>
          <Button variant='outlined' startIcon={<NumbersIcon />} onClick={handleNums}>Numbers</Button>
          <Button variant='outlined' startIcon={<PaletteIcon />} onClick={handlecolors}>Colors</Button>
          <Button variant='outlined' startIcon={<SchoolIcon />} onClick={handleEdu}>Education</Button>
          <Button variant='outlined' startIcon={<EmojiEmotionsIcon />} onClick={handleEmotion}>Emotions</Button>
          <Button variant='outlined' startIcon={<PeopleIcon />} onClick={handleFamilyPeople}>Family & People</Button>
          <Button variant='outlined' startIcon={<RestaurantIcon />} onClick={handleFoodDrink}>Food & Drink</Button>
        </Box>
        <Box display='flex' sx={{margin: 2}} justifyContent="center">
          <Button variant='outlined' startIcon={<HealthAndSafetyIcon />} onClick={handleHealth}>MSL Health</Button>
          <Button variant='outlined' startIcon={<WorkIcon />} onClick={handleProfessions}>MSL Professions</Button>
          <Button variant='outlined' startIcon={<PlaceIcon />} onClick={handlePlaces}>MSL Places</Button>
          <Button variant='outlined' startIcon={<ChurchIcon />} onClick={handleReligion}>MSL Religion</Button>
          <Button variant='outlined' startIcon={<AccessTimeIcon />} onClick={handleTime}>MSL Time</Button>
          <Button variant='outlined' startIcon={<SportsSoccerIcon />} onClick={handleSport}>MSL Sport</Button>
          <Button variant='outlined' startIcon={<DirectionsBusIcon />} onClick={handleTransportation}>MSL Transportation</Button>
        </Box>

        <Box>
          
          <Button variant='outlined' startIcon={<WbSunnyIcon />} onClick={handleWeatherNature}>MSL Weather & Nature</Button>
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

            <Box mt={2} textAlign="center">
              <Typography variant="h5" fontWeight="semibold" sx={{color: 'white'}}>👋 Welcome to ElimSoul Academy – MSL Lessons 📚🤟</Typography>
              <Typography variant="body1" mt={1} sx={{color: 'white'}}>
                Dive into the beautiful world of Malawian Sign Language 🌍.  
                Learn to sign the alphabet 🔤, emotions 😊, professions 👩🏽‍🏫, nature 🌳, and more — one lesson at a time!
              </Typography>
          </Box>
          </Grid>
        }

      {pdfPath && 
      <Grid>
        <PDFViewer fileUrl={pdfPath}/>
        {/* Coming soon: Learn-by-Animation powered by ElimSoul AI */}
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
                  <Button size='small' startIcon={<TranslateIcon />} onClick={handleAlphabets} >
                    <MenuItem color='primary' onClick={handleDrawerToggle}>MSL Alphabets</MenuItem>
                  </Button>
                  <Button size='small' startIcon={<ChatBubbleOutlineIcon />} onClick={handleBSC}>
                    <MenuItem color='primary' onClick={handleDrawerToggle}>MSL Basic Conversation</MenuItem>
                  </Button>
                  <Button  size='small' startIcon={<NumbersIcon />} onClick={handleNums}>
                    <MenuItem onClick={handleDrawerToggle}>MSL Numbers</MenuItem>
                  </Button>
                  <Button size='small' startIcon={<PaletteIcon />} onClick={handlecolors}>
                    <MenuItem onClick={handleDrawerToggle}>MSL Colors</MenuItem>
                  </Button>
                  <Button size='small' startIcon={<SchoolIcon />} onClick={handleEdu}>
                    <MenuItem onClick={handleDrawerToggle}>MSL Education</MenuItem>
                  </Button>
                  <Button size='small' startIcon={<EmojiEmotionsIcon />} onClick={handleEmotion}>
                    <MenuItem onClick={handleDrawerToggle}>MSL Emotions</MenuItem>
                  </Button>
                  <Button size='small' startIcon={<PeopleIcon />} onClick={handleFamilyPeople}>
                    <MenuItem onClick={handleDrawerToggle}>MSL Family & People</MenuItem>
                  </Button>
                  <Button size='small' startIcon={<RestaurantIcon />} onClick={handleFoodDrink}>
                    <MenuItem color='primary' onClick={handleDrawerToggle}>MSL Food & Drink</MenuItem>
                  </Button>
                  <Button  size='small' startIcon={<HealthAndSafetyIcon />} onClick={handleHealth}>
                    <MenuItem onClick={handleDrawerToggle}>MSL Health</MenuItem>
                  </Button>
                  <Button size='small' startIcon={<WorkIcon />} onClick={handleProfessions}>
                    <MenuItem onClick={handleDrawerToggle}>MSL Professions</MenuItem>
                  </Button>
                  <Button size='small' startIcon={<PlaceIcon />} onClick={handlePlaces}>
                    <MenuItem onClick={handleDrawerToggle}>MSL Places</MenuItem>
                  </Button>
                  <Button size='small' startIcon={<ChurchIcon />} onClick={handleReligion}>
                    <MenuItem onClick={handleDrawerToggle}>MSL Religion</MenuItem>
                  </Button>
                  <Button size='small' startIcon={<AccessTimeIcon />} onClick={handleTime}>
                    <MenuItem onClick={handleDrawerToggle}>MSL Time</MenuItem>
                  </Button>
                  <Button size='small' startIcon={<SportsSoccerIcon />} onClick={handleSport}>
                    <MenuItem onClick={handleDrawerToggle}>MSL Sport</MenuItem>
                  </Button>
                  <Button size='small' startIcon={<DirectionsBusIcon />} onClick={handleTransportation}>
                    <MenuItem onClick={handleDrawerToggle}>MSL Transportation</MenuItem>
                  </Button>
                  <Button size='small' startIcon={<WbSunnyIcon />} onClick={handleWeatherNature}>
                    <MenuItem onClick={handleDrawerToggle}>MSL Weather & Nature</MenuItem>
                  </Button>
                </Box>
              </Drawer>
    </Grid>
  );
}