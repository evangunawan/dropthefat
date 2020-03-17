import * as React from 'react';
import {
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
} from '@material-ui/core';
import Container from '../components/Container';

export class MenuPage extends React.Component {
  componentDidMount() {
    console.log('Hello');
  }

  render() {
    return (
      <Container>
        <h1>Food Menus</h1>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Food Name</TableCell>
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>
      </Container>
    );
  }
}
