import * as React from 'react';
import firebase from 'firebase';
import '@firebase/firestore';

import {
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Button,
} from '@material-ui/core';
import Container from '../../components/Container';
import { Link } from 'react-router-dom';

type MenuState = { listVendor: any[]; ready: boolean };

export class ManageExpenditure extends React.Component<{}, MenuState> {
  constructor(props: any) {
    super(props);
    this.state = {
      ready: false,
      listVendor: [],
    };
  }

  componentDidMount() {
    this.getVendorList();
  }

  async getVendorList() {
    const db = firebase.firestore();
    await db
      .collection('ingredient')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const temp = [...this.state.listVendor, doc.data()];
          this.setState({ listVendor: temp });
        });
      });

    this.setState({ ready: true });
  }

  render() {
    if (!this.state.ready) {
      return <p>Loading</p>;
    }

    const btnGroupStyle: React.CSSProperties = {
      width: '100%',
      display: 'flex',
      justifyContent: 'flex-end',
    };

    const items = this.state.listVendor.map((item, key) => {
      return (
        <TableRow key={key}>
          <TableCell align='left'>{item.id}</TableCell>
          <TableCell align='left'>{item.name}</TableCell>
          <TableCell align='left'>{item.price}</TableCell>
        </TableRow>
      );
    });

    return (
      <Container width='100%'>
        <h1>Ingredients</h1>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{items}</TableBody>
          </Table>
        </TableContainer>
        &nbsp;
        <Link to='/admin/expenditure/delete'>
          <div style={btnGroupStyle}>
            <Button
              variant='contained'
              color='secondary'
              style={{ fontWeight: 'bold', marginLeft: 'auto' }}
            >
              Delete Ingredient
            </Button>
          </div>
        </Link>
        <Link to='/admin/expenditure/add'>
          <div style={btnGroupStyle}>
            <Button
              variant='contained'
              color='primary'
              style={{ fontWeight: 'bold', marginLeft: 'auto' }}
            >
              Add Ingredient
            </Button>
          </div>
        </Link>
      </Container>
    );
  }
}

export default ManageExpenditure;