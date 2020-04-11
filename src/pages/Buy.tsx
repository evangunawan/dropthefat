import * as React from 'react';
import firebase from 'firebase';
import '@firebase/firestore';
import {
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TableFooter,
  TablePagination,
  Typography,
  withStyles,
  TextField,
} from '@material-ui/core';
import Container from '../components/Container';
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions';
import PaymentTable from '../components/PaymentPage/PaymentTable';
import { Order } from '../models/Order';
import { MenuOrder } from '../models/MenuOrder';


function Payment(){
  const [order, setOrder] = React.useState<Order[]>([]);
  const fetchOrder = async () => {
    const db = firebase.firestore();
    const result: Order[] = [] as Order[];
    await db
      .collection('order')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const orderMenus: MenuOrder[] = [];
  
          const newOrder: Order = {
            id: doc.id,
            menuOrders: orderMenus,
            pic: data.pic,
            time: data.time,
            total: data.total,
          };
  
          result.push(newOrder);
        });
      });
  
    setOrder(result);
    console.log(result);
  
  };
  React.useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line
  }, []);

    return(
      <Container width='80%' style={{ margin: '0px auto' }}>
      <div
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div>
          <Typography variant='h4' component='h2'>
            Order List
          </Typography>
          <Typography variant='body2' component='span'>
            Here is the list of orders in restaurant.
          </Typography>
        </div>
      </div>
      <PaymentTable items={order} />
    </Container>
    );

};

export default Payment