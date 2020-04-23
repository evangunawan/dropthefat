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
import { useHistory, useParams } from 'react-router-dom';
import firebase from 'firebase';
import FullScreenSpinner from '../../../components/FullScreenSpinner';
import { Employee } from '../../../models/Employee';

const UpdateEmployee = () => {
  const history = useHistory();
  const [name, setName] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [contact, setContact] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [verifyPassword, setVerifyPassword] = React.useState('');
  const [role, setRole] = React.useState('');
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  let { id } = useParams();

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
    if (verifyPassword.length < 1) {
      return (
        <Typography variant='subtitle2' style={passwordWarningStyle}>
          Please fill password verification.
        </Typography>
      );
    } else if (verifyPassword !== password && verifyPassword.length > 0) {
      return (
        <Typography variant='subtitle2' style={passwordWarningStyle}>
          Wrong password verification.
        </Typography>
      );
    }
  };

  const fetchEmployee = async (employeeId: string) => {
    const db = firebase.firestore();
    let result: Employee = {} as Employee;

    if (employeeId === 'null' || employeeId.length < 2) {
      setError(true);
      return;
    }
    setLoading(true);
    await db
      .collection('employees')
      .doc(`${employeeId}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const defaultEmployee: Employee = {
            id: doc.id,
            name: doc.data()?.name,
            address: doc.data()?.address,
            contact: doc.data()?.contact,
            role: doc.data()?.role,
            username: doc.data()?.username,
            password: doc.data()?.password,
          };
          result = defaultEmployee;
        } else {
          setError(true);
        }
      });

    setName(result.name);
    setAddress(result.address);
    setContact(result.contact);
    setRole(result.role);
    setUsername(result.username);
    setPassword(result.password);
    setLoading(false);
  };

  const updateEmployee = async (employeeId: string) => {
    const db = firebase.firestore();
    setLoading(true);
    await db
      .collection('employees')
      .doc(`${employeeId}`)
      .update({
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

  React.useEffect(() => {
    fetchEmployee(id || 'null');
    // eslint-disable-next-line
  }, []);

  if (error) {
    return <div>Bad Employee ID, or not found.</div>;
  }

  return (
    <Container width='1000px' style={containerStyle}>
      <Typography variant='h4' style={{ textAlign: 'center', margin: '10px 0' }}>
        Edit Employee
      </Typography>
      <div style={{ flexGrow: 1 }}>
        <Typography variant='h5'>Employee Details</Typography>
        <Typography variant='body2' color='textSecondary' component='p'>
          Edit employee details here.
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
        <div style={{ flexGrow: 1 }}>
          <Typography variant='h5'>Employee Account</Typography>
          <Typography variant='body2' color='textSecondary' component='p'>
            Edit employee account here.
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
            onClick={() => updateEmployee(id || 'null')}
          >
            <b>Update</b>
          </Button>
        </div>
        <FullScreenSpinner open={loading} />
      </div>
    </Container>
  );
};

export default UpdateEmployee;
