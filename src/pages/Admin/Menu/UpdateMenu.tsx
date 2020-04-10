import * as React from 'react';
import firebase from 'firebase';
import '@firebase/firestore';

import Container from '../../../components/Container';
import {
  Typography,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
} from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';
import { Menu } from '../../../models/Menu';
import FullScreenSpinner from '../../../components/FullScreenSpinner';

const fieldBody: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: 30,
  margin: '30px 0px',
  width: 500,
};

const UpdateMenu = () => {
  const history = useHistory();
  const [menuName, setMenuName] = React.useState('');
  const [menuType, setMenuType] = React.useState('');
  const [menuPrice, setMenuPrice] = React.useState(0);
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  let { id } = useParams();

  const handleSelectChange = (ev: any) => {
    setMenuType(ev.target.value);
    // console.log(menuSelect);
  };

  const handlePriceChange = (ev: any) => {
    const price = parseInt(ev.target.value) || 0;
    setMenuPrice(price);
  };

  const fetchMenu = async (menuId: string) => {
    const db = firebase.firestore();
    let result: Menu = {} as Menu;
    if (menuId === 'null' || menuId.length < 2) {
      setError(true);
      return;
    }
    setLoading(true);
    await db
      .collection('menu')
      .doc(`${menuId}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log(doc.data());
          const newMenu: Menu = {
            id: doc.id,
            name: doc.data()?.name,
            type: doc.data()?.type || 'drink',
            price: doc.data()?.price,
          };
          result = newMenu;
        } else {
          setError(true);
        }
      });
    setMenuName(result.name);
    setMenuType(result.type);
    setMenuPrice(result.price);
    setLoading(false);
  };

  const updateMenu = async (menuId: string) => {
    const db = firebase.firestore();
    setLoading(true);
    await db
      .collection('menu')
      .doc(`${menuId}`)
      .update({
        name: menuName,
        type: menuType,
        price: menuPrice,
      });
    setLoading(false);
    history.push('/admin/menu');
  };

  React.useEffect(() => {
    fetchMenu(id || 'null');
    // eslint-disable-next-line
  }, []);

  if (error) {
    return <div>Bad Menu ID, or not found.</div>;
  }

  return (
    <Container width='500px'>
      <div style={fieldBody}>
        <Typography variant='h4' component='h4'>
          Menu Management
        </Typography>

        <fieldset style={fieldBody}>
          <legend style={{ width: 150, display: 'flex', justifyContent: 'center' }}>
            Update Menu
          </legend>
          <TextField
            variant='outlined'
            label='Food Name'
            style={{ marginBottom: 20, width: 500 }}
            value={menuName}
            onChange={(ev) => setMenuName(ev.target.value)}
          ></TextField>

          <FormControl variant='outlined'>
            <InputLabel id='select-menu-type'>Food Type</InputLabel>
            <Select
              label='Food Type'
              style={{ marginBottom: 20, width: 500 }}
              value={menuType}
              onChange={handleSelectChange}
              variant='outlined'
            >
              <MenuItem value='Choose One' disabled>
                - Choose One -
              </MenuItem>
              <MenuItem value='main-course'>Main Course</MenuItem>
              <MenuItem value='drink'>Drink</MenuItem>
              <MenuItem value='dessert'>Dessert</MenuItem>
            </Select>
          </FormControl>

          <TextField
            variant='outlined'
            label='Price'
            style={{ marginBottom: 20, width: 500 }}
            type='number'
            value={menuPrice}
            onChange={(ev) => handlePriceChange(ev)}
          ></TextField>

          <Button
            variant='contained'
            color='primary'
            style={{ marginBottom: 20, width: 500, height: 50 }}
            onClick={() => updateMenu(id || 'null')}
          >
            UPDATE
          </Button>
        </fieldset>
      </div>
      <FullScreenSpinner open={loading} />
    </Container>
  );
};

export default UpdateMenu;
