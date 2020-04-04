/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Home from '../pages/Home';
import LoginAdmin from '../pages/Admin/LoginAdmin';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import OrderPage from '../pages/Order/OrderPage';
import CreateOrder from '../pages/Order/CreateOrder';
import MenuPage from '../pages/MenuPage';

export default class MainRoutes extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/order' component={OrderPage} />
          <Route exact path='/order/create' component={CreateOrder} />
          <Route exact path='/menu' component={MenuPage} />
          <Route exact path='/admin' render={() => <Redirect to='/admin/login' />} />
          <Route exact path='/admin/login' component={LoginAdmin} />
          <Route exact path='/admin/dashboard' component={AdminDashboard} />
        </Switch>
      </div>
    );
  }
}
