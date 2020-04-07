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
  TablePagination,
  Typography,
  withStyles,
  TextField,
  Button,
} from '@material-ui/core';
import Container from '../../../components/Container';
import { Add } from '@material-ui/icons';
import { useHistory, useLocation } from 'react-router-dom';

const StyledTableCell = withStyles(() => ({
  head: {
    backgroundColor: 'gray',
    color: 'white',
    fontSize: 20,
  },
}))(TableCell);

const TableHeader = () => {
  return (
    <TableHead>
      <TableRow>
        <StyledTableCell>Food Name</StyledTableCell>
        <StyledTableCell>Food Type</StyledTableCell>
        <StyledTableCell>Price</StyledTableCell>
        <StyledTableCell style={{ width: 200, textAlign: 'center' }}>
          Action
        </StyledTableCell>
      </TableRow>
    </TableHead>
  );
};

const MenuManagement = () => {
  const history = useHistory();
  const location = useLocation();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [menu, setMenu] = React.useState([] as any[]);
  const [txtSearch, setTxtSearch] = React.useState('');
  const [filterMenu, setFilterMenu] = React.useState([] as any[]);

  const searchBarStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '20px 0px',
  };

  const handleSearchMenu = (ev: any) => {
    setTxtSearch(ev.target.value);
    const temp = menu.filter((item: any) =>
      item.name.toLowerCase().includes(ev.target.value.toLowerCase())
    );
    setFilterMenu(temp);
  };

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
    const result: any[] = [] as any[];
    await db
      .collection('menu')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          result.push(doc.data());
          // console.log(doc.data());
        });
      });
    setMenu(result);
    setFilterMenu(result);
  };

  const renderMenuType = (val: string) => {
    if (val === 'drink') return 'Drink';
    else if (val === 'main-course') return 'Main Course';
    else if (val === 'dessert') return 'Dessert';
  };

  const renderTableBody = (items: any[]) => {
    const result = items
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((item: any, k) => {
        return (
          <TableRow key={k}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{renderMenuType(item.type)}</TableCell>
            <TableCell>{item.price}</TableCell>
            <TableCell style={{ textAlign: 'center' }}>
              <Button color='primary'>Update</Button> |{' '}
              <Button color='secondary'>Delete</Button>
            </TableCell>
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
      <div style={searchBarStyle}>
        <Typography variant='h4' component='h4'>
          Menu Management
        </Typography>
        <form>
          <TextField
            label='Search Menu'
            variant='outlined'
            value={txtSearch}
            onChange={(ev) => handleSearchMenu(ev)}
          ></TextField>
          <Button
            variant='contained'
            startIcon={<Add />}
            color='primary'
            style={{ height: 55, marginLeft: 20 }}
            onClick={() => {
              history.push(`${location.pathname}/create`);
            }}
          >
            Add New Menu
          </Button>
        </form>
      </div>
      <Paper>
        <TableContainer>
          <Table>
            <TableHeader />
            <TableBody>{renderTableBody(filterMenu)}</TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10]}
          count={filterMenu.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
};

export default MenuManagement;
