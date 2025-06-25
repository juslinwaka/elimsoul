import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Paper,
  Menu,
  MenuItem,
  IconButton,
  ListItemButton, // <-- Add this import
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';

export default function CustomSidebar() {
  const [anchorEls, setAnchorEls] = useState<{ [key: string]: HTMLElement | null }>({
    Courses: null,
    Tasks: null,
    Reporting: null,
    Instructors: null,
    Resources: null,
  });

  const handleOpen = (menuKey: string, event: React.MouseEvent<HTMLElement>) => {
    setAnchorEls((prev) => ({ ...prev, [menuKey]: event.currentTarget }));
  };

  const handleClose = (menuKey: string) => {
    setAnchorEls((prev) => ({ ...prev, [menuKey]: null }));
  };

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
        <Typography sx={{fontSize: 20}}>
          Activities
        </Typography>
      </Box>

      <List>
        {/* Courses */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={(e) => handleOpen('Courses', e)}
            sx={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <Box display="flex" alignItems="center">
              <ListItemIcon sx={{ color: 'white' }}>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Courses" />
            </Box>
            <IconButton
              size="small"
              sx={{ color: 'white' }}
              onClick={(e) => {
                e.stopPropagation();
                handleOpen('Courses', e);
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </ListItemButton>
        </ListItem>
        <Menu
          anchorEl={anchorEls.Courses}
          open={Boolean(anchorEls.Courses)}
          onClose={() => handleClose('Courses')}
        >
          <MenuItem sx={{backgroundColor: 'black', color: 'white'}} onClick={() => handleClose('Courses')} component="a" href="/elimacademy">
            Malawian Sign Language 
          </MenuItem>
          <MenuItem sx={{backgroundColor: 'black', color: 'white'}} onClick={() => handleClose('Courses')} component="a" href="/dashboard/stats">
            Statistics
          </MenuItem>
        </Menu>

        {/* Tasks */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={(e) => handleOpen('Tasks', e)}
            sx={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <Box display="flex" alignItems="center">
              <ListItemIcon sx={{ color: 'white' }}>
                <MenuBookIcon />
              </ListItemIcon>
              <ListItemText primary="Tasks" />
            </Box>
            <IconButton
              size="small"
              sx={{ color: 'white' }}
              onClick={(e) => {
                e.stopPropagation();
                handleOpen('Tasks', e);
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </ListItemButton>
        </ListItem>
        <Menu
          anchorEl={anchorEls.Tasks}
          open={Boolean(anchorEls.Tasks)}
          onClose={() => handleClose('Tasks')}
        >
          <MenuItem sx={{backgroundColor: 'black', color: 'white'}} onClick={() => handleClose('Tasks')} component="a" href="/lessons/beginner">
            Beginner
          </MenuItem>
          <MenuItem sx={{backgroundColor: 'black', color: 'white'}} onClick={() => handleClose('Tasks')} component="a" href="/lessons/advanced">
            Advanced
          </MenuItem>
        </Menu>

        {/* Reporting */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={(e) => handleOpen('Reporting', e)}
            sx={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <Box display="flex" alignItems="center">
              <ListItemIcon sx={{ color: 'white' }}>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Reporting" />
            </Box>
            <IconButton
              size="small"
              sx={{ color: 'white' }}
              onClick={(e) => {
                e.stopPropagation();
                handleOpen('Reporting', e);
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </ListItemButton>
        </ListItem>
        <Menu
          anchorEl={anchorEls.Reporting}
          open={Boolean(anchorEls.Reporting)}
          onClose={() => handleClose('Reporting')}
        >
          <MenuItem sx={{backgroundColor: 'black', color: 'white'}} onClick={() => handleClose('Reporting')} component="a" href="/profile/view">
            View Profile
          </MenuItem>
          <MenuItem sx={{backgroundColor: 'black', color: 'white'}} onClick={() => handleClose('Reporting')} component="a" href="/profile/settings">
            Settings
          </MenuItem>
        </Menu>

        {/* instructors */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={(e) => handleOpen('Instructors', e)}
            sx={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <Box display="flex" alignItems="center">
              <ListItemIcon sx={{ color: 'white' }}>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Instructors" />
            </Box>
            <IconButton
              size="small"
              sx={{ color: 'white' }}
              onClick={(e) => {
                e.stopPropagation();
                handleOpen('Instructors', e);
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </ListItemButton>
        </ListItem>
        <Menu
          anchorEl={anchorEls.Instructors}
          open={Boolean(anchorEls.Instructors)}
          onClose={() => handleClose('Instructors')}
        >
          <MenuItem sx={{backgroundColor: 'black', color: 'white'}} onClick={() => handleClose('Instructors')} 
          component="a" href="/profile/view">
            View Profile
          </MenuItem>
          <MenuItem sx={{backgroundColor: 'black', color: 'white'}} onClick={() => handleClose('Instructors')} 
          component="a" href="/profile/settings">
            Settings
          </MenuItem>
        </Menu>

          {/* Resources */ }
          <ListItem disablePadding>
          <ListItemButton
            onClick={(e) => handleOpen('Resources', e)}
            sx={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <Box display="flex" alignItems="center">
              <ListItemIcon sx={{ color: 'white' }}>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Resources" />
            </Box>
            <IconButton
              size="small"
              sx={{ color: 'white' }}
              onClick={(e) => {
                e.stopPropagation();
                handleOpen('Resources', e);
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </ListItemButton>
        </ListItem>
        <Menu
          anchorEl={anchorEls.Resources}
          open={Boolean(anchorEls.Resources)}
          onClose={() => handleClose('Resources')}
        >
          <MenuItem sx={{backgroundColor: 'black', color: 'white'}} onClick={() => handleClose('Resources')} component="a" href="/profile/view">
            View Profile
          </MenuItem>
          <MenuItem sx={{backgroundColor: 'black', color: 'white'}} onClick={() => handleClose('Resources')} component="a" href="/profile/settings">
            Settings
          </MenuItem>
        </Menu>

      </List>
    </Paper>
  );
}