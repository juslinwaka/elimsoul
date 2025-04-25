import {createTheme} from '@mui/material/styles';
import '@fontsource/roboto'

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
            default: '#0D1B2A',
            paper: '#1a237e',
          },
        },

      typography:{
        fontFamily: 'Roboto, sans-serif',

        h1: {
          fontSize: '2.5rem',
          fontWeight: 700,
          fontStyle: 'oblique',
        },

        h2: {
          fontSize: '2rem',
          fontWeight: 600,
          fontStyle: 'oblique'
        }
      }
      });
      
      export default theme;