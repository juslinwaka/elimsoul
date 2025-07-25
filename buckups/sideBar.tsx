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
  ListItemButton,
  CircularProgress,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function CustomSidebar() {
  const [anchorEls, setAnchorEls] = useState<{ [key: string]: HTMLElement | null }>({
    Courses: null,
    Tasks: null,
    Reporting: null,
    Instructors: null,
    Resources: null,
  });

  const [lessonProgress, setLessonProgress] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const user = auth.currentUser;

  const handleOpen = (menuKey: string, event: React.MouseEvent<HTMLElement>) => {
    setAnchorEls((prev) => ({ ...prev, [menuKey]: event.currentTarget }));
  };

  const handleClose = (menuKey: string) => {
    setAnchorEls((prev) => ({ ...prev, [menuKey]: null }));
  };

  const lessonData = [
    { title: 'MSL Alphabet', lessonId: 'alphabet' },
    { title: 'Basic Conversation', lessonId: 'basic_convo' },
    { title: 'Numbers', lessonId: 'numbers' },
    { title: 'Colors', lessonId: 'colors' },
    { title: 'Education', lessonId: 'education' },
    { title: 'Emotions', lessonId: 'emotions' },
    { title: 'Family & People', lessonId: 'family_people' },
    { title: 'Health', lessonId: 'health' },
    { title: 'Professions', lessonId: 'professions' },
    { title: 'Places', lessonId: 'places' },
    { title: 'Religion', lessonId: 'religion' },
    { title: 'Time', lessonId: 'time' },
    { title: 'Sport', lessonId: 'sport' },
    { title: 'Transportation', lessonId: 'transportation' },
  ];

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;
      const progressMap: { [key: string]: number } = {};
      await Promise.all(
        lessonData.map(async (lesson) => {
          const ref = doc(db, 'users', user.uid, 'progress', lesson.lessonId);
          const snap = await getDoc(ref);
          progressMap[lesson.lessonId] = snap.exists() ? snap.data().progress || 0 : 0;
        })
      );
      setLessonProgress(progressMap);
      setLoading(false);
    };
    fetchProgress();
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
        <Typography sx={{ fontSize: 20 }}>Activities</Typography>
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
          <MenuItem sx={{ backgroundColor: 'black', color: 'white' }} onClick={() => handleClose('Courses')} component="a" href="/elimacademy">
            Malawian Sign Language
          </MenuItem>
          <MenuItem sx={{ backgroundColor: 'black', color: 'white' }} onClick={() => handleClose('Courses')} component="a" href="/elimacademy">
            English Language
          </MenuItem>
          <MenuItem sx={{ backgroundColor: 'black', color: 'white' }} onClick={() => handleClose('Courses')} component="a" href="/elimacademy">
            Mathematics
          </MenuItem>
          <MenuItem sx={{ backgroundColor: 'black', color: 'white' }} onClick={() => handleClose('Courses')} component="a" href="/elimacademy">
            Social and Moral Studies
          </MenuItem>
          <MenuItem sx={{ backgroundColor: 'black', color: 'white' }} onClick={() => handleClose('Courses')} component="a" href="/elimacademy">
            General Science
          </MenuItem>
          <MenuItem sx={{ backgroundColor: 'black', color: 'white' }} onClick={() => handleClose('Courses')} component="a" href="/elimacademy">
            Civic/ Religious Education
          </MenuItem>
          <MenuItem sx={{ backgroundColor: 'black', color: 'white' }} onClick={() => handleClose('Courses')} component="a" href="/elimacademy">
            Agriculture
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
          {loading ? (
            <MenuItem sx={{ backgroundColor: 'black', color: 'white' }}>
              <CircularProgress size={20} sx={{ color: 'white', mr: 1 }} /> Loading...
            </MenuItem>
          ) : (
            lessonData.map((lesson, index) => {
              const isLocked = index !== 0 && (lessonProgress[lessonData[index - 1].lessonId] || 0) < 70;
              return (
                <MenuItem
                  key={lesson.lessonId}
                  disabled={isLocked}
                  sx={{ backgroundColor: 'black', color: isLocked ? 'gray' : 'white' }}
                  onClick={() => {
                    router.push(`/elimacademy?lesson=${lesson.lessonId}`);
                    handleClose('Tasks');
                  }}
                >
                  {isLocked ? `🔒 ${lesson.title}` : lesson.title}
                </MenuItem>
              );
            })
          )}
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
          <MenuItem sx={{ backgroundColor: 'black', color: 'white' }} onClick={() => handleClose('Reporting')} component="a" href="/profile/view">
            View Profile
          </MenuItem>
          <MenuItem sx={{ backgroundColor: 'black', color: 'white' }} onClick={() => handleClose('Reporting')} component="a" href="/profile/settings">
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
