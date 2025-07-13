'use client';

import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { Report } from '@mui/icons-material';
import { IntegrationInstructionsRounded } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface Assignment {
  id: string;
  title: string;
  status: string;
}

export default function HomeWorks() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        if (!user) return;

        const snapshot = await getDocs(collection(db, 'students', user.uid, 'assignments'));

        const data: Assignment[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title || 'Untitled Assignment',
          status: doc.data().status || 'pending',
        }));

        setAssignments(data);
      } catch (err) {
        console.error('Error fetching assignments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [user]);

  return (
    <Paper
      elevation={3}
      sx={{
        width: 'auto',
        height: '100%',
        backgroundColor: 'rgba(02, 205, 255, 0.6)',
        color: 'white',
        borderRadius: 2,
        paddingTop: 2,
        overflow: 'auto',
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="h6" fontSize={20}>
          My Assignments
        </Typography>
      </Box>

      <Box px={2} py={1} height={250} maxHeight={250}>
        <Typography fontWeight="bold" mt={2} mb={1} fontSize={16}>
          📚 Assigned to You
        </Typography>

        {loading ? (
          <CircularProgress sx={{ color: 'white' }} />
        ) : assignments.length === 0 ? (
          <Typography fontSize={14}>No assignments yet.</Typography>
        ) : (
          <List>
            {assignments.map((assignment) => (
              <ListItem
                key={assignment.id}
                component="a"
                href={`/assignments/${assignment.id}`}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <ListItemIcon sx={{ color: 'white' }}>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText
                  primary={assignment.title}
                  secondary={`Status: ${assignment.status}`}
                  primaryTypographyProps={{ color: 'white', fontSize: 14 }}
                  secondaryTypographyProps={{ color: 'lightgray', fontSize: 12 }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Paper>
  );
}
