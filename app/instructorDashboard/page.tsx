'use client';

import { useState } from 'react';
import { Tabs, Tab, Box, Typography, Grid } from '@mui/material';
import StudentList from '@/components/StudentList';
import AssignmentForm from '@/components/AssignmentForm';
import SubmittedAssignments from '@/components/SubmittedAssignments';
import InstructorPosts from '@/components/InstructorPosts';
import LogoutButton from '@/components/signOutButton';
import { useScreenConfig } from '@/hooks/screenConfig';

export default function InstructorDashboard() {
  const [tabIndex, setTabIndex] = useState(0);
  const {isMobile, isDesktop} = useScreenConfig();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Grid container spacing={2}>
      {isMobile && (
        <Box sx={{ width: '100%', margin: 2}}>
          <Typography variant="h4" mb={3} sx={{color:'white'}}>Instructor Dashboard</Typography>
          <LogoutButton />
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            textColor="inherit"
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            sx={{color: 'white'}}
          >
            <Tab label="🧑‍🎓 Students" />
            <Tab label="📄 Share Assignments" />
            <Tab label="📢 Posts & Quizzes" />
            <Tab label="📹 Submitted Work" />
            </Tabs>

          <Box mt={3}>
            {tabIndex === 0 && <StudentList />}
            {tabIndex === 1 && <AssignmentForm />}
            {tabIndex === 3 && <InstructorPosts/>}
            {tabIndex === 4 && <SubmittedAssignments/>}
          </Box>
        </Box>
      )}

      {isDesktop && (
        <Box sx={{ p: 4, width: '100%'}}>
          <Typography variant="h4" mb={3} sx={{color:'white'}}>Instructor Dashboard</Typography>
          <LogoutButton />
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            textColor="inherit"
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            sx={{color: 'white'}}
          >
              <Tab label="🧑‍🎓 Students" />
              <Tab label="📄 Share Assignments" />
              <Tab label="📢 Posts & Quizzes" />
              <Tab label="📹 Submitted Work" />
          </Tabs>

          <Box mt={3}>
            {tabIndex === 0 && <StudentList />}
            {tabIndex === 1 && <AssignmentForm />}
            {tabIndex === 3 && <SubmittedAssignments />}
            {tabIndex === 4 && <InstructorPosts />}
          </Box>
        </Box>
      )}

    </Grid>
  );
}
