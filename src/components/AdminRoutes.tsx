import * as React from 'react';
import { Route, Redirect, useHistory } from 'react-router-dom';
import LoginAdmin from '../pages/Admin/LoginAdmin';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import TableManagement from '../pages/Admin/Tables/TableManagement';
import PromoManagement from '../pages/Admin/Promo/PromoManagement';
import CreatePromo from '../pages/Admin/Promo/CreatePromo';
import UpdatePromo from '../pages/Admin/Promo/UpdatePromo';
import MenuManagement from '../pages/Admin/Menu/MenuManagement';
import UpdateMenu from '../pages/Admin/Menu/UpdateMenu';
import CreateMenu from '../pages/Admin/Menu/CreateMenu';
import VendorManagement from '../pages/Admin/Vendor/VendorManagement';
import UpdateVendor from '../pages/Admin/Vendor/UpdateVendor';
import CreateVendor from '../pages/Admin/Vendor/CreateVendor';
import EmployeeManagement from '../pages/Admin/Employee/EmployeeManagement';
import CreateEmployee from '../pages/Admin/Employee/CreateEmployee';
import UpdateEmployee from '../pages/Admin/Employee/UpdateEmployee';
import ExpenditureList from '../pages/Admin/Purchasing/Expenditure';
import BuyIngredients from '../pages/Admin/Purchasing/BuyIngredients';
import { checkAuth } from '../util/AuthUtil';

const AdminRoutes = () => {
  const history = useHistory();

  React.useEffect(() => {
    checkAuth().then((result) => {
      if (result !== true) {
        history.push('/admin/login');
      }
    });
  }, [history]);

  return (
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
          <Route exact path={`${match.url}/promo`} component={PromoManagement} />
          <Route path={`${match.url}/promo/create`} component={CreatePromo} />
          <Route path={`${match.url}/promo/update/:id`} component={UpdatePromo} />
          <Route exact path={`${match.url}/menu`} component={MenuManagement} />
          <Route path={`${match.url}/menu/update/:id`} component={UpdateMenu} />
          <Route path={`${match.url}/menu/create`} component={CreateMenu} />
          <Route exact path={`${match.url}/vendor`} component={VendorManagement} />
          <Route path={`${match.url}/vendor/update/:id`} component={UpdateVendor} />
          <Route path={`${match.url}/vendor/create`} component={CreateVendor} />
          <Route exact path={`${match.url}/employees`} component={EmployeeManagement} />
          <Route path={`${match.url}/employees/create`} component={CreateEmployee} />
          <Route path={`${match.url}/employees/update/:id`} component={UpdateEmployee} />
          <Route path={`${match.url}/expenditure`} component={ExpenditureList} />
          <Route path={`${match.url}/ingredients`} component={BuyIngredients} />
        </div>
      )}
    />
  );
};

export default AdminRoutes;
