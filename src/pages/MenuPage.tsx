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
  withStyles,
  TextField,
} from '@material-ui/core';
import Container from '../components/Container';
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions';

const StyledTableCell = withStyles((theme) => ({
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
      </TableRow>
    </TableHead>
  );
};

const MenuPage = () => {
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
      <div style={searchBarStyle}>
        <Typography variant='h4' component='h4'>
          Food Menu
        </Typography>
        <form>
          <TextField
            label='Search Menu'
            variant='outlined'
            value={txtSearch}
            onChange={(ev) => handleSearchMenu(ev)}
          ></TextField>
        </form>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHeader />
          <TableBody>{renderTableBody(filterMenu)}</TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[10, 25, { label: 'All', value: -1 }]}
                colSpan={3}
                count={filterMenu.length}
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
