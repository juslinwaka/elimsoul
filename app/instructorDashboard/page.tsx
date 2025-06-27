'use client'

import { useState } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import StudentList from '@/components/StudentList';
import AssignmentForm from '@/components/AssignmentForm';
import SubmissionReview from '@/components/SubmissionReview';

export default function InstructorDashboard() {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3}>Instructor Dashboard</Typography>
      <Tabs value={tabIndex} onChange={handleTabChange} textColor="primary" indicatorColor="primary">
        <Tab label="Students" />
        <Tab label="Assignments" />
        <Tab label="Review Submissions" />
      </Tabs>

      <Box mt={3}>
        {tabIndex === 0 && <StudentList />}
        {tabIndex === 1 && <AssignmentForm />}
        {tabIndex === 2 && <SubmissionReview />}
      </Box>
    </Box>
  );
}
