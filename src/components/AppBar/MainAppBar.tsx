import * as React from 'react';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { AppBar, Toolbar, IconButton, Typography, Button } from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import MainDrawer from './MainDrawer';
import Cookies from 'universal-cookie';
import { useHistory } from 'react-router-dom';
const cookie = new Cookies();

const MainAppBar = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const history = useHistory();

  const logout = async () => {
    const db = firebase.firestore();
    const adminRef = db.collection('admin').doc('account');
    await adminRef.update({
      token: '',
    });
    cookie.remove('admin_token');
    history.push('/admin');
  };

  return (
    <div>
      <AppBar position='static'>
        <Toolbar>
          <IconButton
            edge='start'
            style={{ marginRight: '12px' }}
            aria-label='menu'
            onClick={() => setDrawerOpen(true)}
          >
            <Menu />
          </IconButton>
          <Typography variant='h6'>Drop The Fat</Typography>
          {cookie.get('admin_token') ? (
            <Button variant='contained' color='secondary' onClick={logout}>
              Log Out
            </Button>
          ) : null}
        </Toolbar>
      </AppBar>
      <MainDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
};

export default MainAppBar;
