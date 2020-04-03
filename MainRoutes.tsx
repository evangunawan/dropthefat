/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from '../pages/Home';
import OrderPage from '../pages/Order/OrderPage';
import CreateOrder from '../pages/Order/CreateOrder';
import MenuPage from '../pages/MenuPage';
import Employee from '../pages/Employee';
import Payment from '../pages/Payment';
import PaymentCheckout from '../pages/PaymentCheckout';
export default class MainRoutes extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/order' component={OrderPage} />
          <Route exact path='/menu' component={MenuPage} />
          <Route exact path='/order/create' component={CreateOrder} />
          <Route exact path='/employee' component={Employee}/>
          <Route exact path='/payment' component={Payment}/>
          <Route exact path='/payment/check' component={PaymentCheckout}/>
        </Switch>
      </div>
    );
  }
}
