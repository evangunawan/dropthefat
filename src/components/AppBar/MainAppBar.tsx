import * as React from 'react';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { AppBar, Toolbar, IconButton, Typography, Button } from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import MainDrawer from './MainDrawer';
import Cookies from 'universal-cookie';
import { useHistory, useLocation } from 'react-router-dom';
const cookie = new Cookies();

const MainAppBar = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const history = useHistory();
  const location = useLocation();

  const logout = async () => {
    const db = firebase.firestore();
    const adminRef = db.collection('admin').doc('account');
    await adminRef.update({
      token: firebase.firestore.FieldValue.arrayRemove(cookie.get('admin_token')),
    });
    cookie.set('admin_token', '', { path: '/' });
    history.push('/admin/login');
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
            disabled={location.pathname === '/admin/login'}
          >
            <Menu />
          </IconButton>
          <Typography variant='h6'>Drop The Fat</Typography>
          {cookie.get('admin_token') && location.pathname.includes('/admin') ? (
            <Button
              variant='contained'
              color='secondary'
              onClick={logout}
              style={{ marginLeft: 'auto' }}
            >
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
