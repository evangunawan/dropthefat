import * as React from 'react';
import firebase from 'firebase';
import '@firebase/firestore';

import {
  Button,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@material-ui/core';
import Container from '../components/Container';

type MenuState = { listMenu: any[]; ready: boolean };

export class MenuPage extends React.Component<{}, MenuState> {
  constructor(props: any) {
    super(props);
    this.state = {
      ready: false,
      listMenu: [],
    };
  }

  componentDidMount() {
    this.getMenuList();
  }

  async getMenuList() {
    const db = firebase.firestore();
    let result = null;
    await db
      .collection('Menu')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const temp = [...this.state.listMenu, doc.data()];
          this.setState({ listMenu: temp });
        });
      });

    this.setState({ ready: true });
  }

  render() {
    if (!this.state.ready) {
      return <p>Loading</p>;
    }

    const items = this.state.listMenu.map((item, key) => {
      return (
        <TableRow key={key}>
          <TableCell align='left'>{item.name}</TableCell>
          <TableCell align='left'>{item.type}</TableCell>
          <TableCell align='left'>{item.price}</TableCell>
        </TableRow>
      );
    });

    return (
      <Container>
        <h1>Food Menus</h1>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Food Name</TableCell>
                <TableCell>Food Type</TableCell>
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
