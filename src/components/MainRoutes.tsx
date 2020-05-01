/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Home from '../pages/Home';
import LoginAdmin from '../pages/Admin/LoginAdmin';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import OrderPage from '../pages/Order/OrderPage';
import CreateOrder from '../pages/Order/CreateOrder';
import ReservationPage from '../pages/Reservation/ReservationPage';
import CreateReservation from '../pages/Reservation/CreateReservation';
import MenuPage from '../pages/MenuPage';
import TableManagement from '../pages/Admin/Tables/TableManagement';
import MenuManagement from '../pages/Admin/Menu/MenuManagement';
import CreateMenu from '../pages/Admin/Menu/CreateMenu';
import UpdateMenu from '../pages/Admin/Menu/UpdateMenu';
import VendorManagement from '../pages/Admin/Vendor/VendorManagement';
import UpdateVendor from '../pages/Admin/Vendor/UpdateVendor';
import CreateVendor from '../pages/Admin/Vendor/CreateVendor';
import PromoManagement from '../pages/Admin/Promo/PromoManagement';
import CreatePromo from '../pages/Admin/Promo/CreatePromo';
import UpdatePromo from '../pages/Admin/Promo/UpdatePromo';
import EmployeeManagement from '../pages/Admin/Employee/EmployeeManagement';
import CreateEmployee from '../pages/Admin/Employee/CreateEmployee';
import UpdateEmployee from '../pages/Admin/Employee/UpdateEmployee';
import Expenditure from '../pages/Admin/Purchasing/Expenditure';
import BuyIngredients from '../pages/Admin/Purchasing/BuyIngredients';
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
