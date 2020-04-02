import * as React from 'react';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@material-ui/core';
import { Description, RestaurantMenu, Home, Person,MoneyRounded } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';

interface DrawerProps {
  open: boolean;
  onClose: any;
}

interface ItemProps {
  text: string;
  link: string;
  icon: any;
  onLink(): any;
}

const DrawerItem = (props: ItemProps) => {
  const history = useHistory();
  return (
    <ListItem
      button
      onClick={() => {
        history.push(props.link);
        props.onLink();
      }}
    >
      <ListItemIcon>{props.icon}</ListItemIcon>
      <ListItemText primary={props.text} />
    </ListItem>
  );
};

const MainDrawer = (props: DrawerProps) => {
  //FIXME: Fix the onLink callback, don't need to reuse the code in every component.
  return (
    <Drawer anchor='left' open={props.open} onClose={props.onClose}>
      <Box style={{ height: 64, display: 'flex', alignItems: 'center' }}>
        <h3 style={{ marginLeft: 16 }}>Drop the Fat</h3>
      </Box>
      <Divider />
      <div style={{ width: 300 }}>
        <List>
          <DrawerItem text='Home' link='/' icon={<Home />} onLink={props.onClose} />
          <DrawerItem
            text='Order'
            link='/order'
            icon={<Description />}
            onLink={props.onClose}
          />
          <DrawerItem
            text='Food Menu'
            link='/menu'
            icon={<RestaurantMenu />}
            onLink={props.onClose}
          />

          <DrawerItem
            text='Employee'
            link='/employee'
            icon={<Person/>}
            onLink={props.onClose}
            />

          <DrawerItem
            text='Payment'
            link='/payment'
            icon={<MoneyRounded/>}
            onLink={props.onClose}
            />
           


        </List>
      </div>
    </Drawer>
  );
};

export default MainDrawer;
