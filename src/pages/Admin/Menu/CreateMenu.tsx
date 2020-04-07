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

const titleBarStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'left',
  alignItems: 'center',
  margin: '20px 0px',
};

const formBody: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  marginBottom: 20,
};

const CreateMenu = () => {
  const history = useHistory();
  const [menuName, setMenuName] = React.useState('');
  const [menuType, setMenuType] = React.useState('');
  const [menuPrice, setMenuPrice] = React.useState('');

  const addMenuToFirebase = async () => {
    const db = firebase.firestore();
    let intPrice = 0;
    try {
      intPrice = parseInt(menuPrice);
    } catch (err) {
      alert('please input a number in price!');
      return;
    }
    await db.collection('menu').add({
      name: menuName,
      type: menuType,
      price: intPrice,
    });
    history.push('/admin/menu');
  };

  const handleSelectChange = (ev: any) => {
    setMenuType(ev.target.value);
    // console.log(menuSelect);
  };

  return (
    <Container width='1000px'>
      <div style={titleBarStyle}>
        <Typography variant='h4' component='h4'>
          Add New Menu
        </Typography>
      </div>
      <div style={formBody}>
        <TextField
          variant='outlined'
          label='Food Name'
          style={{ marginBottom: 20, width: 500 }}
          value={menuName}
          onChange={(ev) => setMenuName(ev.target.value)}
        ></TextField>

        <FormControl variant='outlined'>
          <InputLabel>Food Type</InputLabel>
          <Select
            label='Food Type'
            style={{ marginBottom: 20, width: 500 }}
            value={menuType}
            onChange={handleSelectChange}
          >
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
      </div>
    </Container>
  );
};

export default CreateMenu;
