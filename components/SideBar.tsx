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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Report, PanToolSharp } from '@mui/icons-material';
import { IntegrationInstructionsRounded } from '@mui/icons-material';

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

  const courseData = [
    { title: 'Malawian Sign Language', lessonId: 'course_msl' },
    { title: 'English Language', lessonId: 'course_english' },
    { title: 'Mathematics', lessonId: 'course_math' },
    { title: 'Social and Moral Studies', lessonId: 'course_social' },
    { title: 'General Science', lessonId: 'course_science' },
    { title: 'Civic/ Religious Education', lessonId: 'course_cre' },
    { title: 'Agriculture', lessonId: 'course_agriculture' },
  ];

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;
      const progressMap: { [key: string]: number } = {};

      const allIds = [...lessonData.map(x => x.lessonId), ...courseData.map(x => x.lessonId)];
      await Promise.all(
        allIds.map(async (id) => {
          const ref = doc(db, 'users', user.uid, 'progress', id);
          const snap = await getDoc(ref);
          progressMap[id] = snap.exists() ? snap.data().progress || 0 : 0;
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
          {loading ? (
            <MenuItem sx={{ backgroundColor: 'black', color: 'white' }}>
              <CircularProgress size={20} sx={{ color: 'white', mr: 1 }} /> Loading...
            </MenuItem>
          ) : (
            courseData.map((course, index) => {
              const prevId = index === 0 ? null : courseData[index - 1].lessonId;
              const isLocked = index !== 0 && (lessonProgress[prevId!] || 0) < 70;
              return (
                <MenuItem
                  key={course.lessonId}
                  disabled={isLocked}
                  sx={{ backgroundColor: 'black', color: isLocked ? 'gray' : 'white' }}
                  onClick={() => {
                    if (!isLocked) router.push(`/elimacademy?lesson=${course.lessonId}`);
                    handleClose('Courses');
                  }}
                >
                  {isLocked ? `🔒 ${course.title}` : course.title}
                </MenuItem>
              );
            })
          )}
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
                        <Report />
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
                        <IntegrationInstructionsRounded />
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
                        <PanToolSharp/>
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
