import * as React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  makeStyles,
  Theme,
  createStyles,
  Box,
} from '@material-ui/core';
import { Menu, Receipt, RestaurantMenu } from '@material-ui/icons';

interface DrawerProps {
  open: boolean;
  onClose: any;
}

const DrawerList = () => {
  return (
    <div style={{ width: 250 }}>
      <List>
        <ListItem button>
          <ListItemIcon>
            <Receipt />
          </ListItemIcon>
          <ListItemText primary='Orders' />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <RestaurantMenu />
          </ListItemIcon>
          <ListItemText primary='Food Menu' />
        </ListItem>
      </List>
    </div>
  );
};

const MainDrawer = (props: DrawerProps) => {
  return (
    <Drawer anchor='left' open={props.open} onClose={props.onClose}>
      <Box style={{ height: 64, display: 'flex', alignItems: 'center' }} borderBottom={1}>
        <h4 style={{ textAlign: 'center' }}>Drop the Fat</h4>
      </Box>
      <DrawerList />
    </Drawer>
  );
};

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
