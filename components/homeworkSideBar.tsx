// components/homeworkSideBar.tsx

import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Paper,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Report } from '@mui/icons-material';
import { IntegrationInstructionsRounded } from '@mui/icons-material';

export default function HomeWorks() {
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
          My Home Works
        </Typography>
      </Box>
      <List>
        {[
          { text: 'Dashboard', icon: <DashboardIcon />, href: '/dashboard' },
          { text: 'Lessons', icon: <MenuBookIcon />, href: '/lessons' },
          { text: 'Tasks', icon: <AccountCircleIcon />, href: '/profile' },
          { text: 'Reporting', icon: <Report />, href: '/logout' },
          { text: 'Instructors', icon: <IntegrationInstructionsRounded/>, href: 'instructors'}
        ].map(({ text, icon, href }) => (
          <ListItem key={text} component="a" href={href}>
            <ListItemIcon sx={{ color: 'white' }}>{icon}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
