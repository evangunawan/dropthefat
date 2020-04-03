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
  const containerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  };
  const cardStyle: CSSProperties = {
    width: '500px',
    height: 'auto',
    padding: 16,
  };

  // create state react.hook
  const [txtPassword, setTxtPassword] = React.useState('');
  const history = useHistory();

  const generateToken = (len: number) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < len; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
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
      cookie.set('admin_token', token);
      setToken(token);
      console.log('set cookie: ' + token);
      history.push('/admin/dashboard');
    }
  };

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
