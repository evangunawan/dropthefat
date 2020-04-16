import * as React from 'react';
import Container from '../../../components/Container';
import {
  Typography,
  TextField,
  Button,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TablePagination,
  TableHead,
  TableRow,
  withStyles,
  TableCell,
  Tooltip,
  IconButton,
} from '@material-ui/core';
import { Vendor } from '../../../models/Vendor';
import { Add, List, Delete, Edit } from '@material-ui/icons';
import firebase from 'firebase';
import { Product } from '../../../models/Product';
import ProductModal from '../../../components/VendorPage/ProductModal';
import FullScreenSpinner from '../../../components/FullScreenSpinner';
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
        <StyledTableCell>Vendor Name</StyledTableCell>
        <StyledTableCell>Address</StyledTableCell>
        <StyledTableCell>Contact Number</StyledTableCell>
        <StyledTableCell style={{ width: 200, textAlign: 'center' }}>
          Action
        </StyledTableCell>
      </TableRow>
    </TableHead>
  );
};

const VendorManagement = () => {
  const history = useHistory();
  const location = useLocation();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [vendor, setVendor] = React.useState<Vendor[]>([]);
  const [txtSearch, setTxtSearch] = React.useState('');
  const [filterVendor, setFilterVendor] = React.useState([] as any[]);
  const defaultVendor: Vendor = {
    id: '',
    name: '',
    address: '',
    contact: '',
    products: [],
  };
  const [selectedVendor, setSelectedVendor] = React.useState<Vendor>(defaultVendor);
  const [loading, setLoading] = React.useState(false);

  const searchBarStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '20px 0px',
  };

  const handleSearchVendor = (ev: any) => {
    setTxtSearch(ev.target.value);
    const temp = vendor.filter((item: any) =>
      item.name.toLowerCase().includes(ev.target.value.toLowerCase())
    );
    setFilterVendor(temp);
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

  const fetchVendor = async () => {
    const db = firebase.firestore();
    const result: Vendor[] = [];
    setLoading(true);
    await db
      .collection('vendor')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const listProduct: Product[] = [];
          doc.data().products.forEach((item: any) => {
            const newProduct: Product = {
              name: item.name,
              unit: item.unit || 'unit',
              price: item.price,
            };
            listProduct.push(newProduct);
          });
          const newVendor: Vendor = {
            id: doc.id,
            name: doc.data().name,
            address: doc.data().address,
            contact: doc.data().contact,
            products: listProduct,
          };
          result.push(newVendor);
          // console.log(doc.data());
        });
      });
    setVendor(result);
    setFilterVendor(result);
    setLoading(false);
  };

  const handleDeleteVendor = async (item: Vendor) => {
    const res = window.confirm(`Are you sure want to delete vendor ${item.name}?`);
    if (res === true) {
      setLoading(true);
      const db = firebase.firestore();
      await db
        .collection('vendor')
        .doc(item.id)
        .delete();
      setLoading(false);
      fetchVendor();
    }
  };

  const handleUpdateVendor = (item: Vendor) => {
    history.push(`/admin/vendor/update/${item.id}`);
  };

  const renderTableBody = (items: Vendor[]) => {
    const result = items
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((item: Vendor, k) => {
        return (
          <TableRow key={k}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.address}</TableCell>
            <TableCell>{item.contact}</TableCell>
            <TableCell style={{ textAlign: 'center' }}>
              <Tooltip title='View Products' arrow>
                <IconButton
                  aria-label='List'
                  style={{ width: 50 }}
                  onClick={() => {
                    setSelectedVendor(item);
                    setModalOpen(true);
                  }}
                >
                  <List />
                </IconButton>
              </Tooltip>
              |
              <Tooltip title='Edit Vendor' arrow>
                <IconButton
                  aria-label='Edit'
                  style={{ width: 50 }}
                  onClick={() => {
                    handleUpdateVendor(item);
                  }}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              |
              <Tooltip title='Delete Vendor' arrow>
                <IconButton
                  aria-label='Delete'
                  style={{ width: 50 }}
                  onClick={() => {
                    handleDeleteVendor(item);
                  }}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        );
      });

    return result;
  };

  React.useEffect(() => {
    fetchVendor();
  }, []);

  return (
    <Container width='1000px'>
      <div style={searchBarStyle}>
        <Typography variant='h4' component='h4'>
          Vendor Management
        </Typography>
        <form>
          <TextField
            label='Search Vendor'
            variant='outlined'
            value={txtSearch}
            onChange={(ev) => handleSearchVendor(ev)}
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
            Add New Vendor
          </Button>
        </form>
      </div>
      <Paper>
        <TableContainer>
          <Table>
            <TableHeader />
            <TableBody>{renderTableBody(filterVendor)}</TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10]}
          count={filterVendor.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <ProductModal
        vendor={selectedVendor}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
      <FullScreenSpinner open={loading} />
    </Container>
  );
};

export default VendorManagement;
