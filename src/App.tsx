import * as React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import firebaseConfig from './config/firebase';
import { ThemeProvider, Box } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import { blue, pink } from '@material-ui/core/colors';
import MainAppBar from './components/AppBar/MainAppBar';
import { BrowserRouter as Router } from 'react-router-dom';
import MainRoutes from './components/MainRoutes';

//Firebase initialization
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const mainTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: blue,
    secondary: pink,
  },
  typography: {
    fontFamily: ['-apple-system', 'Open Sans', 'sans-serif'].join(','),
  },
});
export default class App extends React.Component {
  render() {
    return (
      <ThemeProvider theme={mainTheme}>
        <Box
          bgcolor='background.default'
          color='text.primary'
          style={{ width: '100%', minHeight: '100vh' }}
          id='root-box'
        >
          <Router>
            <MainAppBar />
            <MainRoutes />
          </Router>
        </Box>
      </ThemeProvider>
      // <Routes/>
    );
  }
}
