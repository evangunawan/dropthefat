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
import { Promo } from '../../../models/Promo';
import FullScreenSpinner from '../../../components/FullScreenSpinner';
import { renderTime, renderDiscount } from '../../../util/RenderUtil';

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
        <StyledTableCell>Promo Code</StyledTableCell>
        <StyledTableCell>Promo Title</StyledTableCell>
        <StyledTableCell>Start Date</StyledTableCell>
        <StyledTableCell>Expired Date</StyledTableCell>
        <StyledTableCell>Discount</StyledTableCell>

        <StyledTableCell style={{ width: 200, textAlign: 'center' }}>
          Action
        </StyledTableCell>
      </TableRow>
    </TableHead>
  );
};

const PromoManagement = () => {
  const history = useHistory();
  const location = useLocation();
  const [txtSearch, setTxtSearch] = React.useState('');
  const [promo, setPromo] = React.useState<Promo[]>([]);
  const [filterPromo, setFilterPromo] = React.useState([] as any[]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [loading, setLoading] = React.useState(false);

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

  const searchBarStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '20px 0px',
  };

  //Deleting database entry is a no no, because Order item depends on menuId.
  //To solve this, lets update the menu item and set deleted key to true.
  const deletePromo = async (promo: Promo) => {
    const res = window.confirm(`Are you sure want to delete ${promo.title}?`);
    if (res === true) {
      const db = firebase.firestore();
      setLoading(true);
      await db
        .collection('promo')
        .doc(promo.id)
        .update({
          deleted: true,
        });
      window.location.reload();
    }
  };
  const handleSearchPromo = (ev: any) => {
    setTxtSearch(ev.target.value);
    const temp = promo.filter((item: any) =>
      item.codeId.toLowerCase().includes(ev.target.value.toLowerCase())
    );
    setFilterPromo(temp);
  };

  const getPromoList = async () => {
    const db = firebase.firestore();
    const result: Promo[] = [];
    setLoading(true);
    await db
      .collection('promo')
      .where('deleted', '==', false)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const newPromo: Promo = {
            id: doc.id,
            codeId: doc.data().codeId,
            title: doc.data().title,
            startDate: doc.data().startDate,
            expiredDate: doc.data().expiredDate,
            discount: doc.data().discount,
          };
          result.push(newPromo);
        });
      });
    setPromo(result);
    setFilterPromo(result);
    setLoading(false);
  };
  React.useEffect(() => {
    getPromoList();
  }, []);

  const updatePromo = (item: Promo) => {
    history.push(`/admin/promo/update/${item.id}`);
  };

  const renderTableBody = (items: Promo[]) => {
    const result = items
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((item: Promo, k) => {
        return (
          <TableRow key={k}>
            <TableCell>{item.codeId}</TableCell>
            <TableCell>{item.title}</TableCell>
            <TableCell>{renderTime(item.startDate)}</TableCell>
            <TableCell>{renderTime(item.expiredDate)}</TableCell>
            <TableCell style={{ textAlign: 'center' }}>
              {renderDiscount(item.discount)}
            </TableCell>
            <TableCell style={{ textAlign: 'center' }}>
              <Button color='primary' onClick={() => updatePromo(item)}>
                Update
              </Button>{' '}
              |
              <Button color='secondary' onClick={() => deletePromo(item)}>
                Delete
              </Button>
            </TableCell>
          </TableRow>
        );
      });

    return result;
  };
  return (
    <Container width='1150px'>
      <div style={searchBarStyle}>
        <Typography variant='h4' component='h4'>
          Promo Management
        </Typography>
        <form>
          <TextField
            label='Search Promo Code'
            variant='outlined'
            value={txtSearch}
            onChange={(ev) => handleSearchPromo(ev)}
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
            Add New Promo
          </Button>
        </form>
      </div>
      <Paper>
        <TableContainer>
          <Table>
            <TableHeader />
            <TableBody>{renderTableBody(filterPromo)}</TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10]}
          count={filterPromo.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <FullScreenSpinner open={loading} />
    </Container>
  );
};

export default PromoManagement;
