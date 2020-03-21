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

interface TableProps {
  orders: MenuOrder[];
  onDelete(item: MenuOrder): any;
  onQtyChange(ev: any, item: MenuOrder): any;
}

const MenuTable = (props: TableProps) => {
  // const [items, setItems] = React.useState<Menu[]>([]);

  const placeholderStyle = {
    margin: '0 auto',
    padding: '16px',
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

  const renderMenuItems = (items: MenuOrder[]) => {
    return items.map((item, k) => {
      return (
        <TableRow key={k}>
          <TableCell>{item.menu.name}</TableCell>
          <TableCell>{item.menu.type}</TableCell>
          <TableCell>{item.menu.price}</TableCell>
          <TableCell>
            <TextField
              type='number'
              style={{ width: 75 }}
              value={item.quantity}
              onChange={(ev) => handleQuantityChange(ev, item)}
            />
          </TableCell>
          <TableCell>{renderPrice(item)}</TableCell>
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
          <TableCell colSpan={5}>
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
        <TableBody>{renderTableBody(props.orders)}</TableBody>
      </Table>
    </TableContainer>
  );
};

const CreateOrder = () => {
  const [menuList, setMenuList] = React.useState<Menu[]>([]); //menuList is all loaded menu from db, which will be shown in AddMenuModal
  const [orders, setOrders] = React.useState<MenuOrder[]>([]); //Orders that added in the table.
  const [modalOpen, setModalOpen] = React.useState(false);
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
    display: 'flex',
    flexWrap: 'wrap',
    padding: '16px 0',
  };

  const buttonStyle = {
    width: '100%',
    margin: '16px 0px',
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
    <Container width='1000px'>
      <Typography variant='h5'>Create an Order</Typography>
      <Typography variant='body2' color='textSecondary' component='p'>
        Create an order entry by selecting menu and data below.
      </Typography>
      <div style={formStyle}>
        <form style={{ width: '100%' }}>
          <TextField fullWidth label='Person in charge' variant='outlined' />
          <Typography variant='h5' style={{ padding: '16px 0px' }}>
            Menu Order
          </Typography>
          <MenuTable
            orders={orders}
            onDelete={(item) => removeMenu(item)}
            onQtyChange={(ev, item) => handleQtyChange(ev, item)}
          />
          <Button
            variant='contained'
            color='primary'
            disableRipple
            style={buttonStyle}
            onClick={addMenu}
          >
            ADD MENU
          </Button>
        </form>
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
    </Container>
  );
};

export default CreateOrder;
