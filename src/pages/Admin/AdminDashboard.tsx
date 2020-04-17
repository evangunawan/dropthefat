import * as React from 'react';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { Typography } from '@material-ui/core';
import Container from '../../components/Container';
import Cookies from 'universal-cookie';
import { useHistory } from 'react-router-dom';
import { SupervisorAccount } from '@material-ui/icons';

const cookie = new Cookies();

const AdminDashboard = () => {
  const history = useHistory();
  const [adminToken, setAdminToken] = React.useState('');

  const fetchToken = async () => {
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

    if (cookie.get('admin_token') === '' || result !== cookie.get('admin_token')) {
      history.push('/admin/login');
    }
  };
  // const [adminToken, setAdminToken] = React.useState();

  React.useEffect(() => {
    fetchToken();
  });

  if (adminToken === '') {
    return null;
  }

  return (
    <Container width='1000px'>
      <Typography variant='h4' style={{ paddingTop: 300, textAlign: 'center' }}>
        Welcome to Admin Page{' '}
        <SupervisorAccount
          style={{ marginLeft: 8, marginBottom: -10, width: 50, height: 50 }}
        />
      </Typography>
    </Container>
  );
};

export default AdminDashboard;
