/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Home from '../pages/Home';
import OrderPage from '../pages/Order/OrderPage';
import CreateOrder from '../pages/Order/CreateOrder';
import ReservationPage from '../pages/Reservation/ReservationPage';
import CreateReservation from '../pages/Reservation/CreateReservation';
import MenuPage from '../pages/MenuPage';
import AdminRoutes from './AdminRoutes';

export default class MainRoutes extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/order' component={OrderPage} />
          <Route exact path='/order/create' component={CreateOrder} />
          <Route path='/order/create/:rsv' component={CreateOrder} />
          <Route exact path='/reservations' component={ReservationPage} />
          <Route exact path='/reservations/create' component={CreateReservation} />
          <Route exact path='/menu' component={MenuPage} />
          <AdminRoutes />
        </Switch>
      </div>
    );
  }
}
