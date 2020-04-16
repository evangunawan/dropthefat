import * as React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import Container from '../../components/Container';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import {
  Card,
  TextField,
  CardContent,
  Typography,
  CardActions,
  Button,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import md5 from 'md5';
import Cookies from 'universal-cookie';

const cookie = new Cookies();

const LoginAdmin = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [adminToken, setAdminToken] = React.useState('');
  const [txtPassword, setTxtPassword] = React.useState('');
  const history = useHistory();

  const containerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '90vh',
  };
  const cardStyle: CSSProperties = {
    width: '500px',
    padding: 16,
  };

  const generateToken = (len: number) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < len; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const checkToken = async () => {
    const db = firebase.firestore();
    let result = '';
    await db
      .collection('admin')
      .doc('account')
      .get()
      .then((doc) => {
        if (doc.exists) {
          result = doc.data()?.token;
        }
      });
    setAdminToken(result);
    if (cookie.get('admin_token') !== '') {
      if (result === cookie.get('admin_token')) {
        history.push('/admin/dashboard');
      }
    }
  };

  const setToken = async (token: string) => {
    const db = firebase.firestore();
    const adminRef = db.collection('admin').doc('account');
    await adminRef.update({
      token: token,
    });
  };

  const verifyLogin = async () => {
    const db = firebase.firestore();
    let adminPass = '';
    await db
      .collection('admin')
      .doc('account')
      .get()
      .then((doc) => {
        if (doc.exists) {
          adminPass = doc.data()?.password;
        }
      });

    //Login successfull
    if (md5(txtPassword) === adminPass) {
      const token = generateToken(8);
      cookie.set('admin_token', token, { path: '/' });
      await setToken(token);
      console.log('set token to cookie: ' + token);
      history.push('/admin/dashboard');
    } else {
      alert('Wrong password!');
      setTxtPassword('');
    }
  };

  React.useEffect(() => {
    checkToken();
  });

  return (
    <Container width='500px' style={containerStyle}>
      <Card style={cardStyle}>
        <CardContent>
          <Typography variant='h5' component='h2' align='center'>
            Login Admin
          </Typography>
          <form>
            <TextField
              type='password'
              label='Password'
              variant='outlined'
              value={txtPassword}
              onChange={(event: any) => {
                setTxtPassword(event.target.value);
              }}
              style={{ margin: '16px 0px' }}
              fullWidth
            />
          </form>
        </CardContent>
        <CardActions>
          <Button
            variant='contained'
            color='primary'
            onClick={verifyLogin}
            disabled={txtPassword.length < 1}
            disableElevation
            fullWidth
          >
            LOGIN
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
};

export default LoginAdmin;
