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
  Paper,
  TableFooter,
  TablePagination,
  Typography,
} from '@material-ui/core';
import Container from '../components/Container';
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions';

// type MenuState = { listMenu: any[]; ready: boolean };

const TableHeader = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell>Food Name</TableCell>
        <TableCell>Food Type</TableCell>
        <TableCell>Price</TableCell>
      </TableRow>
    </TableHead>
  );
};

const MenuPage = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [menu, setMenu] = React.useState([] as any[]);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getMenuList = async () => {
    const db = firebase.firestore();
    const result: any[] = [];
    await db
      .collection('menu')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          result.push(doc.data());
          console.log(doc.data());
        });
      });
    setMenu(result);
  };

  const renderMenuType = (val: string) => {
    if (val === 'drink') return 'Drink';
    else if (val === 'main-course') return 'Main Course';
    else if (val === 'dessert') return 'Dessert';
  };

  const renderTableBody = (items: any[]) => {
    const result = items.map((item: any, k) => {
      return (
        <TableRow key={k}>
          <TableCell>{item.name}</TableCell>
          <TableCell>{renderMenuType(item.type)}</TableCell>
          <TableCell>{item.price}</TableCell>
        </TableRow>
      );
    });

    return result;
  };

  React.useEffect(() => {
    getMenuList();
  }, []);

  return (
    <Container width='1000px'>
      <Typography variant='h4' component='h4' align='center' style={{ marginBottom: 12 }}>
        Food Menu
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHeader />
          <TableBody>{renderTableBody(menu)}</TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[10, 25, { label: 'All', value: -1 }]}
                colSpan={3}
                count={menu.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: { 'aria-label': 'rows per page' },
                  native: true,
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default MenuPage;
