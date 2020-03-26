import * as React from 'react';
import Container from '../../components/Container';
import { Order } from '../../models/Order';
import firebase from 'firebase';
import { MenuOrder } from '../../models/MenuOrder';
import { Menu } from '../../models/Menu';
import FullScreenSpinner from '../../components/FullScreenSpinner';
import EmptyOrderCard from '../../components/OrderPage/EmptyOrderCard';
import OrderTable from '../../components/OrderPage/OrderTable';
// import '@firebase/firestore';

const OrderPage = () => {
  const [order, setOrder] = React.useState<Order[]>([]);

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

  if (order.length < 1) {
    return (
      <div>
        <FullScreenSpinner open={order.length < 1} />
        <EmptyOrderCard />
      </div>
    );
  }

  return (
    <Container>
      <OrderTable items={order} />
    </Container>
  );
};

export default OrderPage;
