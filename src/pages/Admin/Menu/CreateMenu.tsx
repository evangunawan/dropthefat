import * as React from 'react';
import firebase from 'firebase';
import '@firebase/firestore';
import {
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from '@material-ui/core';
import Container from '../../../components/Container';
import { useHistory } from 'react-router-dom';
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

const CreateMenu = () => {
  const history = useHistory();
  const [menuName, setMenuName] = React.useState('');
  const [menuType, setMenuType] = React.useState('');
  const [menuPrice, setMenuPrice] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const addMenuToFirebase = async () => {
    const db = firebase.firestore();
    let intPrice = 0;
    try {
      intPrice = parseInt(menuPrice);
    } catch (err) {
      alert('Please input a number in price!');
      return;
    }
    setLoading(true);
    await db.collection('menu').add({
      name: menuName,
      type: menuType,
      price: intPrice,
      deleted: false,
    });
    setLoading(false);
    history.push('/admin/menu');
  };

  const handleSelectChange = (ev: any) => {
    setMenuType(ev.target.value);
    // console.log(menuSelect);
  };

  return (
    <Container width='500px'>
      <div style={fieldBody}>
        <Typography variant='h4' component='h4'>
          Menu Management
        </Typography>

        <fieldset style={fieldBody}>
          <legend style={{ width: 150, display: 'flex', justifyContent: 'center' }}>
            Add New Menu
          </legend>
          <TextField
            variant='outlined'
            label='Food Name'
            style={{ marginBottom: 20, width: 500 }}
            value={menuName}
            onChange={(ev) => setMenuName(ev.target.value)}
          />

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
            onChange={(ev) => setMenuPrice(ev.target.value)}
          ></TextField>

          <Button
            variant='contained'
            color='primary'
            style={{ marginBottom: 20, width: 500, height: 50 }}
            onClick={addMenuToFirebase}
          >
            ADD
          </Button>
        </fieldset>
      </div>
      <FullScreenSpinner open={loading} />
    </Container>
  );
};

export default CreateMenu;
