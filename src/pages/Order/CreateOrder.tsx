import * as React from 'react';
import Container from '../../components/Container';
import {
  TextField,
  Typography,
  TableContainer,
  Paper,
  TableHead,
  TableRow,
  Table,
  TableBody,
  TableCell,
  Button,
  IconButton,
} from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { Menu } from '../../models/Menu';
import AddMenuModal from './AddMenuModal';
import firebase from 'firebase';
import '@firebase/firestore';
import { MenuOrder } from '../../models/MenuOrder';
import { Add } from '@material-ui/icons';
import FullScreenSpinner from '../../components/FullScreenSpinner';

interface TableProps {
  orders: MenuOrder[];
  onDelete(item: MenuOrder): any;
  onQtyChange(ev: any, item: MenuOrder): any;
}

const MenuTable = (props: TableProps) => {
  const placeholderStyle = {
    margin: '0 auto',
    padding: '16px',
  };

  const renderCurrency = (price: number) => {
    const regex = new RegExp(/\B(?=(\d{3})+(?!\d))/g);
    const temp = price.toString().replace(regex, ',');
    return 'Rp' + temp;
  };

  const deleteItem = (item: MenuOrder) => {
    props.onDelete(item);
  };

  const handleQuantityChange = (ev: any, item: MenuOrder) => {
    props.onQtyChange(ev, item);
  };

  const renderPrice = (item: MenuOrder) => {
    return item.quantity * item.menu.price;
  };

  const renderGrandTotal = (item: MenuOrder[]) => {
    let result = 0;
    item.forEach((item) => {
      result = result + item.quantity * item.menu.price;
    });
    return result;
  };

  const renderMenuItems = (items: MenuOrder[]) => {
    return items.map((item, k) => {
      return (
        <TableRow key={k}>
          <TableCell>{item.menu.name}</TableCell>
          <TableCell>{item.menu.type}</TableCell>
          <TableCell>{renderCurrency(item.menu.price)}</TableCell>
          <TableCell>
            <TextField
              type='number'
              style={{ width: 75 }}
              value={item.quantity}
              onChange={(ev) => handleQuantityChange(ev, item)}
            />
          </TableCell>
          <TableCell>{renderCurrency(renderPrice(item))}</TableCell>
          <TableCell style={{ width: 60 }}>
            <IconButton
              aria-label='Delete'
              style={{ width: 50 }}
              onClick={() => deleteItem(item)}
            >
              <Delete fontSize='inherit' />
            </IconButton>
          </TableCell>
        </TableRow>
      );
    });
  };

  const renderTableBody = (items: MenuOrder[]) => {
    if (items.length < 1 || items === undefined) {
      return (
        <TableRow style={placeholderStyle}>
          <TableCell colSpan={6}>
            <Typography align='center' variant='body2' color='textSecondary'>
              <i>Please add a menu</i>
            </Typography>
          </TableCell>
        </TableRow>
      );
    } else {
      return renderMenuItems(items);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell>
              <b>Menu Name</b>
            </TableCell>
            <TableCell>
              <b>Type</b>
            </TableCell>
            <TableCell>
              <b>Price</b>
            </TableCell>
            <TableCell>
              <b>Quantity</b>
            </TableCell>
            <TableCell>
              <b>Total</b>
            </TableCell>
            <TableCell>
              <b>Remove</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {renderTableBody(props.orders)}
          <TableRow style={{ backgroundColor: '#111' }}>
            <TableCell colSpan={5}>
              <Typography align='right' variant='body2'>
                <b>Grand Total</b>
              </Typography>
            </TableCell>
            <TableCell>
              <b>{renderCurrency(renderGrandTotal(props.orders))}</b>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const CreateOrder = () => {
  const [pic, setPic] = React.useState('');
  const [menuList, setMenuList] = React.useState<Menu[]>([]); //menuList is all loaded menu from db, which will be shown in AddMenuModal
  const [orders, setOrders] = React.useState<MenuOrder[]>([]); //Orders that added in the table.
  const [modalOpen, setModalOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const db = firebase.firestore();

  async function fetchMenu() {
    const result: Menu[] = [];
    await db
      .collection('menu')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const newMenu: Menu = {
            id: doc.id,
            name: data.name,
            type: data.type,
            price: data.price as number,
          };
          console.log(`Loading ${newMenu.name} (${newMenu.id})`);
          result.push(newMenu);
        });
      });
    setMenuList(result);
  }

  React.useEffect(() => {
    fetchMenu();
    // eslint-disable-next-line
  }, []);

  const formStyle: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    // flexWrap: 'wrap',
    padding: '16px 0',
  };

  const containerStyle: React.CSSProperties = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    alignItems: 'stretch',
  };

  const btnGroupStyle: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
  };

  const buttonStyle = {
    width: '250px',
    margin: '16px auto',
    alignSelf: 'center',
  };

  const addMenu = () => {
    setModalOpen(true);
    // console.log(menuList);
  };

  //Add selected menu from modal into table (state items)
  const addSelectedMenu = (item: Menu) => {
    // const temp = [...items, item];
    // setItems(temp);
    const newOrder: MenuOrder = {
      menu: item,
      quantity: 1,
      total: item.price,
    };
    const temp = [...orders, newOrder];
    setOrders(temp);
  };

  const removeMenu = (item: MenuOrder) => {
    const temp = [...orders];
    const index = temp.indexOf(item);
    if (index !== -1) {
      temp.splice(index, 1);
      setOrders(temp);
    }
  };

  const createOrder = async () => {
    setLoading(true);
    const mOrders: { menu: string; quantity: number }[] = [];
    let grandTotal = 0;
    orders.forEach((item) => {
      grandTotal = grandTotal + item.menu.price * item.quantity;
      mOrders.push({
        menu: item.menu.id || 'undefined',
        quantity: item.quantity,
      });
    });

    try {
      await db.collection('order').add({
        time: Date.now(),
        menuOrders: mOrders,
        pic: pic || 'undefined',
        total: grandTotal,
      });
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleQtyChange = (ev: any, item: MenuOrder) => {
    const temp = [...orders];
    const index = temp.indexOf(item);
    temp[index].quantity = ev.target.value as number;

    setOrders(temp);
  };

  if (menuList.length < 1) {
    return <p>Loading Menu...</p>;
  }

  return (
    <Container width='1000px' style={containerStyle}>
      <div style={{ flexGrow: 1 }}>
        <Typography variant='h5'>Create an Order</Typography>
        <Typography variant='body2' color='textSecondary' component='p'>
          Create an order entry by selecting menu and data below.
        </Typography>
      </div>
      <div>
        <form style={formStyle}>
          <TextField
            fullWidth
            label='Person in charge'
            variant='outlined'
            value={pic}
            onChange={(ev) => setPic(ev.target.value)}
          />
          <Typography variant='h5' style={{ padding: '16px 0px' }}>
            Menu Order
          </Typography>
          <MenuTable
            orders={orders}
            onDelete={(item) => removeMenu(item)}
            onQtyChange={(ev, item) => handleQtyChange(ev, item)}
          />
          <Button
            variant='text'
            color='secondary'
            startIcon={<Add />}
            disableRipple
            style={buttonStyle}
            onClick={addMenu}
          >
            <b>ADD MENU</b>
          </Button>
        </form>
      </div>
      <div style={btnGroupStyle}>
        <Button variant='text' color='default' style={{ marginRight: 8 }}>
          <b>Cancel</b>
        </Button>
        <Button
          variant='contained'
          color='primary'
          disabled={orders.length < 1}
          onClick={createOrder}
        >
          <b>Create Order</b>
        </Button>
      </div>
      <AddMenuModal
        open={modalOpen}
        menuList={menuList}
        onClose={() => {
          setModalOpen(false);
        }}
        onMenuAdd={(item) => {
          addSelectedMenu(item);
        }}
      />
      <FullScreenSpinner open={loading} />
    </Container>
  );
};

export default CreateOrder;
