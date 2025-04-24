import {createTheme} from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#4CAF50', // your primary green
          },
          secondary: {
            main: '#FF9800', // your orange
          },
          text: {
            primary: '#333333',
            secondary: '#757575',
          },
          background: {
            default: '#212121',
            paper: '#1a237e',
          },
        },
      });
      
      export default theme;