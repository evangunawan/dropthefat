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
  Grid,
  Box,
} from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { Menu } from '../../models/Menu';
import AddMenuModal from '../../components/OrderPage/AddMenuModal';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { MenuOrder } from '../../models/MenuOrder';
import { Add } from '@material-ui/icons';
import FullScreenSpinner from '../../components/FullScreenSpinner';
import { useHistory, useParams } from 'react-router-dom';
import { renderCurrency } from '../../util/RenderUtil';
import { DiningTable } from '../../models/DiningTable';
import ChangeTableModal from '../../components/OrderPage/ChangeTableModal';
import { Reservation } from '../../models/Reservation';
import VerificationModal from '../../components/VerificationModal';

interface TableProps {
  orders: MenuOrder[];
  onDelete(item: MenuOrder): void;
  onQtyChange(ev: any, item: MenuOrder): void;
}

const MenuTable = (props: TableProps) => {
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
  const [guests, setGuests] = React.useState(0); // Guest count
  const [tableList, setTableList] = React.useState<DiningTable[]>([]);
  const [selectedTable, setSelectedTable] = React.useState<DiningTable>({
    tableNumber: 0,
    status: 'available',
    type: 'small',
  } as DiningTable);
  const [tableMessage, setTableMessage] = React.useState(''); //State to save message and error message under selected table.
  const [modalOpen, setModalOpen] = React.useState(false);
  const [tableModalOpen, setTableModalOpen] = React.useState(false);
  const [verifModalOpen, setVerifModalOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  // const [reservation, setReservation] = React.useState<Reservation>({} as Reservation);
  const db = firebase.firestore();
  const history = useHistory();
  const { rsv } = useParams();

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

  async function getTableByNumber(num: number) {
    let result = {} as DiningTable;
    await db
      .collection('table')
      .where('tableNumber', '==', num)
      .get()
      .then((qs) => {
        qs.forEach((doc) => {
          if (doc.exists) {
            result = {
              id: doc.id,
              status: doc.data().status,
              tableNumber: doc.data().tableNumber,
              type: doc.data().type,
            };
          }
        });
      });
    return result;
  }

  async function fetchReservations(rsvId: string) {
    let result = {} as Reservation;
    await db
      .collection('reservation')
      .doc(rsvId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          result = {
            id: doc.id,
            createdTime: doc.data()?.createdTime,
            pic: doc.data()?.pic,
            reservationTime: doc.data()?.reservationTime,
            guests: doc.data()?.guests,
            tableNumber: doc.data()?.tableNumber,
          };
        } else {
          alert('Reservation ID not found!');
          history.push('/order/create');
        }
      });
    // setReservation(result);
    setPic(result.pic);
    setGuests(result.guests);
    const temp: DiningTable = await getTableByNumber(result.tableNumber || 0);
    if (temp.status === 'dining') {
      alert('Whoops, table is in use! Create a new order instead.');
      history.push('/order/create');
    } else {
      setSelectedTable(temp);
    }
  }

  async function fetchTables() {
    const result: DiningTable[] = [];
    await db
      .collection('table')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const newTable: DiningTable = {
            id: doc.id,
            tableNumber: data.tableNumber,
            status: data.status,
            type: data.type,
          };
          result.push(newTable);
        });
      });
    setTableList(result);
  }

  async function fetchMenu() {
    const result: Menu[] = [];
    await db
      .collection('menu')
      .where('deleted', '==', false)
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

  const removeReservation = async () => {
    await db
      .collection('reservation')
      .doc(rsv)
      .delete();
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
        guests: guests,
        tableNumber: selectedTable.tableNumber,
        status: 'active',
      });

      await db
        .collection('table')
        .doc(selectedTable.id)
        .update({
          status: 'dining',
        });

      //Delete resrvation document if avail.
      if (rsv) {
        await removeReservation();
      }

      setLoading(false);
      history.push('/order');
    } catch (err) {
      console.error(err);
    }
  };

  const verifyCreateOrder = () => {
    setVerifModalOpen(true);
  };

  const handleQtyChange = (ev: any, item: MenuOrder) => {
    const temp = [...orders];
    const index = temp.indexOf(item);
    temp[index].quantity = ev.target.value as number;

    setOrders(temp);
  };

  const getTableType = (guestCount: number) => {
    if (guestCount < 5) return 'small';
    else if (guestCount < 7) return 'medium';
    else return 'large';
  };

  const generateSelectedTable = (guestCount: number) => {
    const selectedSize = getTableType(guestCount);

    tableList.some((item: DiningTable) => {
      if (
        item.status !== 'unavailable' &&
        item.status !== 'dining' &&
        item.status !== 'reserved'
      ) {
        if (item.type === selectedSize) {
          setSelectedTable(item);
          setTableMessage('');
          return true;
        }
      }

      setTableMessage(`There is no available table. Please check for reservations.`);
      setSelectedTable({
        status: 'unavailable',
        type: 'unknown',
        tableNumber: 0,
      });
      return false;
    });
  };

  const handleGuestChange = (ev: any) => {
    const guestCount = parseInt(ev.target.value);

    setGuests(guestCount || 0);
    generateSelectedTable(guestCount || 0);
  };

  React.useEffect(() => {
    fetchMenu();
    fetchTables();
    if (rsv) {
      fetchReservations(rsv);
    }
    // eslint-disable-next-line
  }, []);

  if (menuList.length < 1 && tableList.length < 1) {
    return <FullScreenSpinner open={true} />;
  }

  return (
    <Container width='1000px' style={containerStyle}>
      <div style={{ flexGrow: 1 }}>
        <Typography variant='h5'>
          Create an Order {rsv ? '(With Reservation)' : null}
        </Typography>
        <Typography variant='body2' color='textSecondary' component='p'>
          Create an order entry by selecting menu and data below.
        </Typography>
      </div>
      <div>
        <form style={formStyle}>
          <TextField
            required
            fullWidth
            label='Person in charge'
            variant='outlined'
            value={pic}
            onChange={(ev) => setPic(ev.target.value)}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'start',
              alignItems: 'center',
              padding: '16px 0px',
            }}
          >
            <div>
              <TextField
                required
                fullWidth
                disabled={rsv ? true : false}
                label='Guest count'
                type='number'
                variant='outlined'
                style={{ width: 300 }}
                value={guests}
                onChange={(ev) => {
                  handleGuestChange(ev);
                }}
              />
            </div>
            {/* This is a spacer */}
            <div style={{ flexGrow: 2 }}></div>
            <Grid container justify='flex-start' alignItems='flex-end' direction='column'>
              <Grid container justify='flex-end' alignItems='center'>
                <div style={{ margin: '0px 32px' }}>
                  <Typography variant='h6'>Table Selected</Typography>
                  <Typography variant='body2' color='textSecondary'>
                    Size: {selectedTable.type}
                  </Typography>
                </div>
                <div style={{ marginRight: 32 }}>
                  <Typography variant='h6'>{selectedTable.tableNumber}</Typography>
                </div>
                <Button
                  disableRipple
                  disabled={rsv ? true : false}
                  variant='contained'
                  color='primary'
                  onClick={() => setTableModalOpen(true)}
                >
                  Change...
                </Button>
              </Grid>
              <Box color='warning.main' fontSize='0.9em'>
                {tableMessage}
              </Box>
            </Grid>
          </div>
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
        <Button
          variant='text'
          color='default'
          style={{ marginRight: 8 }}
          onClick={() => {
            history.push('/order');
          }}
        >
          <b>Cancel</b>
        </Button>
        <Button
          variant='contained'
          color='primary'
          disabled={
            orders.length < 1 ||
            pic.length < 3 ||
            guests === 0 ||
            selectedTable.tableNumber === 0
          }
          // onClick={createOrder}
          onClick={verifyCreateOrder}
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
      <ChangeTableModal
        open={tableModalOpen}
        tableList={tableList}
        guests={guests}
        onClose={() => setTableModalOpen(false)}
        onTableSelect={(item: DiningTable) => setSelectedTable(item)}
      />
      <VerificationModal
        open={verifModalOpen}
        onClose={() => setVerifModalOpen(false)}
        onSuccess={() => {
          setVerifModalOpen(false);
          createOrder();
        }}
        roleType={['waiter', 'waitress']}
      />
      <FullScreenSpinner open={loading} />
    </Container>
  );
};

export default CreateOrder;
