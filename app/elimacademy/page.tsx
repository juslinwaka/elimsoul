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
import LessonCard from '@/components/msl-comps/LessonCard';
import { updateLessonProgress } from '@/utils/firestoreUtils';
import PDFLessonViewer from '@/components/msl-comps/PDFLessonViewer';

export default function Academy() {
  const [lessonId, setLessonId] = useState(''); 
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


  const handleAlphabets = async () => {
    setLessonId('MSL-Alphabets')
    setPdfPath('/docs/Alphabets.pdf');
  }

  const handleNums = () => {
    setLessonId('MSLNumbers')
    setPdfPath('/docs/Numbers.pdf')
  }

  const handlecolors = () => {
    setLessonId('MSLColors')
    setPdfPath('/docs/Colors.pdf')
  }

  const handleBSC = () => {
    setLessonId('MSL-Basic-Conversation')
    setPdfPath('/docs/Basic Conversation.pdf')
  }
  const handleEdu = () => {
    setLessonId('MSLEducation')
    setPdfPath('/docs/Education.pdf');
  }

  const handleEmotion = () => {
    setLessonId('MSLEmotions')
    setPdfPath('/docs/Emotions.pdf')
  }

  const handleFamilyPeople = () => {
    setLessonId('MSLFamilyPeople')
    setPdfPath('/docs/Family And People.pdf')
  }

  const handleFoodDrink = () => {
    setLessonId('MSLFoodDrink')
    setPdfPath('/docs/Food and Drink.pdf')
  }
  const handleHealth = () => {
    setLessonId('MSLHealth')
    setPdfPath('/docs/Health.pdf')
  }

  const handleProfessions = () => {
    setLessonId('MSLProfessions')
    setPdfPath('/docs/Profession.pdf')
  }

  const handlePlaces = () => {
    setLessonId('MSLPlaces')
    setPdfPath('/docs/Places.pdf')
  }
  const handleReligion = () => {
    setLessonId('MSLReligion')
    setPdfPath('/docs/Religion.pdf');
  }

  const handleTime = () => {
    setLessonId('MSLTime')
    setPdfPath('/docs/Time.pdf')
  }

  const handleSport = () => {
    setLessonId('MSLSport')
    setPdfPath('/docs/Sport.pdf')
  }

  const handleTransportation = () => {
    setLessonId('MSLTransportation')
    setPdfPath('/docs/Transport.pdf')
  }
  const handleWeatherNature = () => {
    setLessonId('MSLWeatherNature')
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
        <Box display='flex' justifyContent='center'>
          <LessonCard
            title='MSL Alphabet'
            progress={0}
            isLocked={false}
            onClick={handleAlphabets}
          />

          <LessonCard
            title='MSL Basic Conversation'
            progress={0}
            isLocked={false}
            onClick={handleBSC}
          />

          <LessonCard
            title='MSL Numbers'
            progress={0}
            isLocked={false}
            onClick={handleNums}
          />

          <LessonCard
            title='MSL Colors'
            progress={0}
            isLocked={false}
            onClick={handlecolors}
          />

          <LessonCard
            title='Education'
            progress={0}
            isLocked={false}
            onClick={handleEdu}
          />

          <LessonCard
            title='MSL Emotion'
            progress={0}
            isLocked={false}
            onClick={handleEmotion}
          />
         </Box>

         <Box display='flex' justifyContent='center'>
          <LessonCard
            title='MSL Family & People'
            progress={0}
            isLocked={false}
            onClick={handleFamilyPeople}
          />

          <LessonCard
            title='MSL Health'
            progress={0}
            isLocked={false}
            onClick={handleHealth}
          />

          <LessonCard
            title='MSL Professions'
            progress={0}
            isLocked={false}
            onClick={handleProfessions}
          />

          <LessonCard
            title='MSL Places'
            progress={0}
            isLocked={false}
            onClick={handlePlaces}
          />

          <LessonCard
            title='MSL Religion'
            progress={0}
            isLocked={false}
            onClick={handleReligion}
          />

          <LessonCard
            title='MSL Time'
            progress={0}
            isLocked={false}
            onClick={handleTime}
          />
         </Box>

         <Box display='flex' justifyContent='center'>
          <LessonCard
            title='MSL Sport'
            progress={0}
            isLocked={false}
            onClick={handleSport}
          />

          <LessonCard
            title='MSL Transportation'
            progress={0}
            isLocked={false}
            onClick={handleTransportation}
          />
         </Box>

          {pdfPath && 
          <Grid>
            <PDFLessonViewer 
              lessonId='msl_alphabets'
              fileUrl={pdfPath}/>
              {/* Coming soon: Learn-by-Animation powered by ElimSoul AI */}
          </Grid>}
      </Grid>
      }
        {isMobile && 
          <Grid size={12} pt={6}>
            <Box mt={2} textAlign="center">
              <Typography variant="h5" fontWeight="semibold" sx={{color: 'white'}}>👋 Welcome to ElimSoul Academy – MSL Lessons 📚🤟</Typography>
              <Typography variant="body1" mt={1} sx={{color: 'white'}}>
                Dive into the beautiful world of Malawian Sign Language 🌍.  
                Learn to sign the alphabet 🔤, emotions 😊, professions 👩🏽‍🏫, nature 🌳, and more — one lesson at a time!
              </Typography>
          </Box>

          {pdfPath && 
          <Grid>
            <PDFLessonViewer 
              lessonId={lessonId}
              fileUrl={pdfPath}/>
          </Grid>}

          <Box display='flow' justifyContent='center' sx={{overflowX: 'auto', whiteSpace: 'nowrap', margin: 2}}>
          <LessonCard
            title='MSL Alphabet'
            progress={0}
            isLocked={false}
            onClick={handleAlphabets}
          />

          <LessonCard
            title='MSL Basic Conversation'
            progress={0}
            isLocked={false}
            onClick={handleBSC}
          />

          <LessonCard
            title='MSL Numbers'
            progress={0}
            isLocked={false}
            onClick={handleNums}
          />

          <LessonCard
            title='MSL Colors'
            progress={0}
            isLocked={false}
            onClick={handlecolors}
          />

          <LessonCard
            title='Education'
            progress={0}
            isLocked={false}
            onClick={handleEdu}
          />

          <LessonCard
            title='MSL Emotion'
            progress={0}
            isLocked={false}
            onClick={handleEmotion}
          />

          <LessonCard
            title='MSL Family & People'
            progress={0}
            isLocked={false}
            onClick={handleFamilyPeople}
          />

          <LessonCard
            title='MSL Health'
            progress={0}
            isLocked={false}
            onClick={handleHealth}
          />

          <LessonCard
            title='MSL Professions'
            progress={0}
            isLocked={false}
            onClick={handleProfessions}
          />

          <LessonCard
            title='MSL Places'
            progress={0}
            isLocked={false}
            onClick={handlePlaces}
          />

          <LessonCard
            title='MSL Religion'
            progress={0}
            isLocked={false}
            onClick={handleReligion}
          />

          <LessonCard
            title='MSL Time'
            progress={0}
            isLocked={false}
            onClick={handleTime}
          />

          <LessonCard
            title='MSL Sport'
            progress={0}
            isLocked={false}
            onClick={handleSport}
          />

          <LessonCard
            title='MSL Transportation'
            progress={0}
            isLocked={false}
            onClick={handleTransportation}
          />
         </Box>
          </Grid>
        }
    </Grid>
  );
}