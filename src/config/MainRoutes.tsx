import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from '../pages/Home';
import OrderPage from '../pages/OrderPage';
import { MenuPage } from '../pages/MenuPage';
import LoginAdmin from '../pages/Admin/LoginAdmin';

export default class MainRoutes extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/order' component={OrderPage} />
          <Route exact path='/menu' component={MenuPage} />
          <Route exact path='/admin' component={LoginAdmin} />
        </Switch>
      </div>
    );
  }
}
