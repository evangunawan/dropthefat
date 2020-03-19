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
} from '@material-ui/core';
import { Menu } from '../../models/Menu';
import AddMenuModal from './AddMenuModal';
import firebase from 'firebase';
import '@firebase/firestore';

interface TableProps {
  items: Menu[];
}

const MenuTable = (props: TableProps) => {
  // const [items, setItems] = React.useState<Menu[]>([]);

  const placeholderStyle = {
    margin: '0 auto',
    padding: '16px',
  };

  const renderMenuItems = (items: Menu[]) => {
    return items.map((item, k) => {
      return (
        <TableRow key={k}>
          <TableCell>{item.name}</TableCell>
          <TableCell>{item.type}</TableCell>
          <TableCell>{item.price}</TableCell>
        </TableRow>
      );
    });
  };

  const renderTableBody = (items: Menu[]) => {
    if (items.length < 1 || items === undefined) {
      return (
        <TableRow style={placeholderStyle}>
          <TableCell colSpan={3}>
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
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Menu Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{renderTableBody(props.items)}</TableBody>
      </Table>
    </TableContainer>
  );
};

const CreateOrder = () => {
  const [menuList, setMenuList] = React.useState<Menu[]>([]); //menuList is all loaded menu from db
  const [items, setItems] = React.useState<Menu[]>([]); //items is the selected menu in the table.
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
          console.log(`Adding ${newMenu.name} (${newMenu.id})`);
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
    const temp = [...items, item];
    setItems(temp);
  };

  if (menuList.length < 1) {
    return <p>Loading</p>;
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
          <MenuTable items={items} />
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
