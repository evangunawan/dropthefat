/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from '../pages/Home';
import { MenuPage } from '../pages/MenuPage';
import OrderPage from '../pages/Order/OrderPage';
import CreateOrder from '../pages/Order/CreateOrder';
import ManageExpenditure from '../pages/Expenditure/ManageExpenditure';
import AddIngredient from '../pages/Expenditure/AddIngredient';

export default class MainRoutes extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/order' component={OrderPage} />
          <Route exact path='/menu' component={MenuPage} />
          <Route exact path='/order/create' component={CreateOrder} />
          <Route exact path='/expenditure' component={ManageExpenditure} />
          <Route exact path='/expenditure/add' component={AddIngredient} />
        </Switch>
      </div>
    );
  }
}
