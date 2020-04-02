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
} from '@material-ui/core';
import Container from '../../components/Container';

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
    let result = null;
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
      <Container>
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
      </Container>
    );
  }
}

export default ManageExpenditure;