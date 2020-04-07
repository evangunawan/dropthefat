/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Home from '../pages/Home';
import LoginAdmin from '../pages/Admin/LoginAdmin';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import OrderPage from '../pages/Order/OrderPage';
import CreateOrder from '../pages/Order/CreateOrder';
import MenuPage from '../pages/MenuPage';
import TableManagement from '../pages/Admin/Tables/TableManagement';
import MenuManagement from '../pages/Admin/Menu/MenuManagement';
import CreateMenu from '../pages/Admin/Menu/CreateMenu';

export default class MainRoutes extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/order' component={OrderPage} />
          <Route exact path='/order/create' component={CreateOrder} />
          <Route exact path='/menu' component={MenuPage} />
          <Route
            path='/admin'
            render={({ match }) => (
              <div>
                <Route
                  exact
                  path={`${match.url}/`}
                  render={() => <Redirect to='/admin/login' />}
                />
                <Route path={`${match.url}/login`} component={LoginAdmin} />
                <Route path={`${match.url}/dashboard`} component={AdminDashboard} />
                <Route path={`${match.url}/tables`} component={TableManagement} />
                <Route exact path={`${match.url}/menu`} component={MenuManagement} />
                <Route path={`${match.url}/menu/create`} component={CreateMenu} />
              </div>
            )}
          />
        </Switch>
      </div>
    );
  }
}
