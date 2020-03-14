import * as React from 'react';
import { AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import MainDrawer from './MainDrawer';

const MainAppBar = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

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
        </Toolbar>
      </AppBar>
      <MainDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
};

export default MainAppBar;
