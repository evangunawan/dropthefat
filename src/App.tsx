import * as React from 'react';
import Routes from './config/Routes';
import firebase from 'firebase';
import firebaseConfig from './config/firebase';

//Firebase initialization
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default class App extends React.Component {
  render() {
    return <Routes />;
  }
}
