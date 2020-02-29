import * as React from 'react';
import Routes from './config/Routes';
import firebase from 'firebase';
import firebaseConfig from './config/firebase';
import { ThemeProvider, Box } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import { blue, pink } from '@material-ui/core/colors';

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
});

export default class App extends React.Component {
  render() {
    return (
      <ThemeProvider theme={mainTheme}>
        <Box
          bgcolor='background.default'
          color='text.primary'
          style={{ width: '100%', height: '100vh' }}
          id='root-box'
        >
          <Routes />
        </Box>
      </ThemeProvider>
      // <Routes/>
    );
  }
}
