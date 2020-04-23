import * as React from 'react';
import Container from '../../../components/Container';
import {
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import FullScreenSpinner from '../../../components/FullScreenSpinner';

const CreateEmployee = () => {
  const history = useHistory();
  const [name, setName] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [contact, setContact] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [verifyPassword, setVerifyPassword] = React.useState('');
  const [role, setRole] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const containerStyle: React.CSSProperties = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    alignItems: 'stretch',
  };

  const formStyle: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: '20px 0',
  };

  const btnGroupStyle: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
  };

  const verifyPasswordHolder: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '10px',
  };

  const passwordWarningStyle: React.CSSProperties = {
    visibility: 'visible',
    marginLeft: '20px',
    color: 'red',
  };

  const handleVerifyPassword = () => {
    if (verifyPassword !== password && verifyPassword.length > 0) {
      return (
        <Typography variant='subtitle2' style={passwordWarningStyle}>
          Wrong password verification.
        </Typography>
      );
    }
  };

  const addToFirebase = async () => {
    const db = firebase.firestore();
    setLoading(true);
    await db.collection('employees').add({
      name: name,
      address: address,
      contact: contact,
      role: role,
      username: username,
      password: password,
    });
    setLoading(false);
    history.push('/admin/employees');
  };

  return (
    <Container width='1000px' style={containerStyle}>
      <Typography variant='h4' style={{ textAlign: 'center', margin: '10px 0' }}>
        Add Employee
      </Typography>
      <div style={{ flexGrow: 1 }}>
        <Typography variant='h5'>Employee Details</Typography>
        <Typography variant='body2' color='textSecondary' component='p'>
          Please fill out all the employee details below.
        </Typography>
      </div>
      <div>
        <form style={formStyle}>
          <TextField
            required
            fullWidth
            label='Employee Name'
            variant='outlined'
            style={{ marginBottom: '10px' }}
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
          <TextField
            required
            fullWidth
            label='Address'
            variant='outlined'
            style={{ marginBottom: '10px' }}
            value={address}
            onChange={(ev) => setAddress(ev.target.value)}
          />
          <TextField
            required
            fullWidth
            label='Contact Number'
            type='number'
            variant='outlined'
            style={{ marginBottom: '10px', width: 400 }}
            value={contact}
            onChange={(ev) => setContact(ev.target.value)}
          />
        </form>
      </div>
      <div style={{ flexGrow: 1 }}>
        <Typography variant='h5'>Employee Account</Typography>
        <Typography variant='body2' color='textSecondary' component='p'>
          Enter employee account here.
        </Typography>
      </div>
      <div>
        <form style={formStyle}>
          <TextField
            required
            fullWidth
            label='Username'
            variant='outlined'
            style={{ marginBottom: '10px', width: 400 }}
            value={username}
            onChange={(ev) => setUsername(ev.target.value)}
          />
          <TextField
            required
            fullWidth
            label='Password'
            variant='outlined'
            style={{ marginBottom: '10px', width: 400 }}
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
          <div style={verifyPasswordHolder}>
            <TextField
              required
              fullWidth
              label='Verify Password'
              variant='outlined'
              style={{ width: 400 }}
              value={verifyPassword}
              onChange={(ev) => setVerifyPassword(ev.target.value)}
            />
            {handleVerifyPassword()}
          </div>
          <FormControl variant='outlined'>
            <InputLabel id='select-menu-type'>Role *</InputLabel>
            <Select
              label='Role * '
              style={{ marginBottom: 20, width: 400 }}
              variant='outlined'
              value={role}
              onChange={(ev: any) => setRole(ev.target.value)}
            >
              <MenuItem value='Choose One' disabled>
                - Choose One -
              </MenuItem>
              <MenuItem value='cashier'>Cashier</MenuItem>
              <MenuItem value='waiter'>Waiter</MenuItem>
              <MenuItem value='waitress'>Waitress</MenuItem>
            </Select>
          </FormControl>
        </form>
      </div>
      <div style={btnGroupStyle}>
        <Button
          variant='text'
          color='default'
          style={{ marginRight: 8 }}
          onClick={() => {
            history.push('/admin/employees');
          }}
        >
          <b>Cancel</b>
        </Button>
        <Button
          variant='contained'
          color='primary'
          disabled={
            name.length < 1 ||
            address.length < 2 ||
            contact.length < 2 ||
            username.length < 2 ||
            password.length < 2 ||
            role.length < 1 ||
            password !== verifyPassword
          }
          onClick={addToFirebase}
        >
          <b>Create Employee</b>
        </Button>
      </div>
      <FullScreenSpinner open={loading} />
    </Container>
  );
};

export default CreateEmployee;
