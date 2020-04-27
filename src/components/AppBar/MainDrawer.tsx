import * as React from 'react';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  ListSubheader,
} from '@material-ui/core';
import {
  Description,
  RestaurantMenu,
  Home,
  People,
  Deck,
  Business,
  ShoppingCart,
  Receipt,
  EventSeat,
  Loyalty,
} from '@material-ui/icons';
import { useHistory, useLocation } from 'react-router-dom';

interface DrawerProps {
  open: boolean;
  onClose(): any;
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
  const location = useLocation();
  const [isAdmin] = React.useState(location.pathname.includes('/admin'));

  const renderAdminDrawer = () => {
    return (
      <div>
        <List subheader={<ListSubheader>Manage</ListSubheader>}>
          <DrawerItem
            text='Menu'
            link='/admin/menu'
            icon={<RestaurantMenu />}
            onLink={props.onClose}
          />
          <DrawerItem
            text='Promo'
            link='/admin/promo'
            icon={<Loyalty />}
            onLink={props.onClose}
          />
          {/* <DrawerItem
            text='Employees'
            link='/admin/employees'
            icon={<People />}
            onLink={props.onClose}
          />
          <DrawerItem
            text='Tables'
            link='/admin/tables'
            icon={<Deck />}
            onLink={props.onClose}
          /> */}
        </List>
        <List subheader={<ListSubheader>Purchasing</ListSubheader>}>
          <DrawerItem
            text='Vendor'
            link='/admin/vendor'
            icon={<Business />}
            onLink={props.onClose}
          />
          {/* <DrawerItem
            text='Ingredients'
            link='/admin/ingredients'
            icon={<ShoppingCart />}
            onLink={props.onClose}
          /> */}
          <DrawerItem
            text='Expenditure'
            link='/admin/expenditure'
            icon={<Receipt />}
            onLink={props.onClose}
          />

          <DrawerItem
            text='Buy Ingredients'
            link='/admin/buy'
            icon={<ShoppingCart />}
            onLink={props.onClose}
          />
        </List>
      </div>
    );
  };

  const renderDrawer = () => {
    return (
      <div>
        <List>
          <DrawerItem text='Home' link='/' icon={<Home />} onLink={props.onClose} />
        </List>
        <List subheader={<ListSubheader>Waiters</ListSubheader>}>
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
            text='Reservation'
            link='/reservations'
            icon={<EventSeat />}
            onLink={props.onClose}
          />
        </List>
      </div>
    );
  };
  return (
    <Drawer anchor='left' open={props.open} onClose={props.onClose}>
      <Box style={{ height: 64, display: 'flex', alignItems: 'center' }}>
        <h3 style={{ marginLeft: 16 }}>Drop the Fat</h3>
      </Box>
      <Divider />
      <div style={{ width: 300 }}>{isAdmin ? renderAdminDrawer() : renderDrawer()}</div>
    </Drawer>
  );
};

export default MainDrawer;
