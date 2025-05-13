'use client'

import React from 'react';
import { AppBar, Toolbar, Typography, Box, Grid } from '@mui/material';
import Image from 'next/image';
import {BottomNavigation, BottomNavigationAction, Paper} from '@mui/material';
import { useScreenConfig } from '@/hooks/screenConfig'
import DashboardIcon from '@mui/icons-material/Dashboard';
import MessageIcon from '@mui/icons-material/Message';
import SettingsIcon from '@mui/icons-material/Settings';
import { useRouter } from 'next/navigation';

const BottomNavBar = () => {

  const router = useRouter();
  const [value, setValue] = React.useState(0);
       

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if(newValue === 0) router.push('/dashboard');
    if(newValue === 1) router.push('/messages');
    if(newValue === 2) router.push('/settings');
  }

  const {isMobile, isTablet, isDesktop} = useScreenConfig();

  return (
    <Paper sx={{position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
      {isMobile&& 
        <BottomNavigation value={value} onChange={handleChange} showLabels>
        <BottomNavigationAction label="Dashboard" icon={<DashboardIcon />}/>
        <BottomNavigationAction label="Discussion Board" icon={<MessageIcon />}/>
        <BottomNavigationAction label="Settings" icon={<SettingsIcon />} />
      </BottomNavigation>
      }
    </Paper>
  );
}

export default BottomNavBar;
