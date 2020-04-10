import * as React from 'react';
import Container from '../../components/Container';
import { Order } from '../../models/Order';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { MenuOrder } from '../../models/MenuOrder';
import { Menu } from '../../models/Menu';
import FullScreenSpinner from '../../components/FullScreenSpinner';
import EmptyOrderCard from '../../components/OrderPage/EmptyOrderCard';
import OrderTable from '../../components/OrderPage/OrderTable';
import { Typography, Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';

const OrderPage = () => {
  const [order, setOrder] = React.useState<Order[]>([]);
  const history = useHistory();

  const goCreateOrder = () => {
    history.push('/order/create');
  };

  const fetchMenu = async (menuId: string) => {
    const db = firebase.firestore();
    let result: Menu = {} as Menu;
    await db
      .collection('menu')
      .doc(menuId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          result = {
            id: doc.id,
            name: data?.name || 'null',
            price: data?.price || 'null',
            type: data?.type || 'null',
          };
        }
      });
    return result;
  };

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

          //Get menuOrders array
          data.menuOrders.forEach((item: any) => {
            fetchMenu(item.menu).then((val: Menu) => {
              orderMenus.push({
                menu: val,
                quantity: item.quantity,
              });
            });
          });

          const newOrder: Order = {
            id: doc.id,
            menuOrders: orderMenus,
            pic: data.pic,
            time: data.time,
            total: data.total,
            guests: data.guests,
            status: data.status || 'undefined',
          };

          result.push(newOrder);
        });
      });
    result.sort((a, b) => (a.time > b.time ? -1 : b.time > a.time ? 1 : 0));
    setOrder(result);
    // console.log(result);
  };

  React.useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line
  }, []);

  if (order.length < 1) {
    return (
      <div>
        <FullScreenSpinner open={order.length < 1} />
        <EmptyOrderCard />
      </div>
    );
  }

  return (
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
        <Button
          variant='contained'
          startIcon={<Add />}
          color='primary'
          onClick={goCreateOrder}
        >
          NEW ORDER
        </Button>
      </div>
      <OrderTable items={order} />
    </Container>
  );
};

export default OrderPage;
