import * as React from 'react';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { Button } from '@material-ui/core';
import Container from '../../components/Container';
import Cookies from 'universal-cookie';
import { useHistory } from 'react-router-dom';

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
  // const [adminToken, setAdminToken] = React.useState();1
  const containerStyle: CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '90vh',
  };
  const menuBox: CSSProperties = {
    width: '150px',
    height: '150px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    margin: '0px 30px',
    backgroundColor: 'gray',
    color: 'white',
  };

  React.useEffect(() => {
    fetchToken();
  });

  if (adminToken === '') {
    return null;
  }

  return (
    <Container width='80%' style={containerStyle}>
      <Button variant='contained' style={menuBox}>
        <span style={{ textAlign: 'center' }}>Menu Management</span>
      </Button>
      <Button variant='contained' style={menuBox}>
        <span style={{ textAlign: 'center' }}>Employee Management</span>
      </Button>
      <Button variant='contained' style={menuBox}>
        <span style={{ textAlign: 'center' }}>Expenditure Management</span>
      </Button>
      <Button variant='contained' style={menuBox}>
        <span style={{ textAlign: 'center' }}>Buy Ingredients</span>
      </Button>
    </Container>
  );
};

export default AdminDashboard;
