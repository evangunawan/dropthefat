import * as React from 'react';
import Container from '../../../components/Container';
import {
  Typography,
  TextField,
  Button,
  Table,
  Paper,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  IconButton,
} from '@material-ui/core';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { Add, Cancel } from '@material-ui/icons';
import AddVendorModal from '../../../components/VendorPage/AddVendorModal';
import { Product } from '../../../models/Product';
import { useHistory } from 'react-router-dom';
import FullScreenSpinner from '../../../components/FullScreenSpinner';
import { renderCurrency } from '../../../util/RenderUtil';

const CreateVendor = () => {
  const history = useHistory();
  const [vendorName, setVendorName] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [contact, setContact] = React.useState('');
  const [modalOpen, setModalOpen] = React.useState(false);
  const [newProducts, setNewProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(false);

  const buttonStyle = {
    width: '250px',
    margin: '16px auto',
    alignSelf: 'center',
  };

  const formStyle: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    // flexWrap: 'wrap',
    padding: '20px 0',
  };

  const containerStyle: React.CSSProperties = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    alignItems: 'stretch',
  };

  const productContainer: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const btnGroupStyle: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
  };

  const placeholderStyle = {
    margin: '0 auto',
    padding: '16px',
  };

  const addVendor = () => {
    setModalOpen(true);
    // console.log(menuList);
  };

  const renderUnitType = (val: String) => {
    if (val === 'kg') return 'Kilogram (kg)';
    else if (val === 'liter') return 'Liter (cc)';
    else if (val === 'unit') return 'Unit (pcs)';
  };

  const handleDeleteProduct = (item: Product) => {
    const temp = [...newProducts];
    const index = temp.indexOf(item);
    if (index !== -1) {
      temp.splice(index, 1);
      setNewProducts(temp);
    }
  };

  const renderMenuItems = (items: Product[]) => {
    return items.map((item, k) => {
      return (
        <TableRow key={k}>
          <TableCell style={{ height: 50 }}>{item.name}</TableCell>
          <TableCell style={{ height: 50 }}>{renderUnitType(item.unit)}</TableCell>
          <TableCell style={{ height: 50 }}>{renderCurrency(item.price)}</TableCell>
          <TableCell style={{ height: 50, textAlign: 'center' }}>
            <Tooltip title='Cancel' arrow>
              <IconButton
                aria-label='Cancel'
                style={{ width: 50 }}
                onClick={() => {
                  handleDeleteProduct(item);
                }}
              >
                <Cancel />
              </IconButton>
            </Tooltip>
          </TableCell>
        </TableRow>
      );
    });
  };

  const renderTableBody = (items: Product[]) => {
    if (items.length < 1 || items === undefined) {
      return (
        <TableRow style={placeholderStyle}>
          <TableCell colSpan={4}>
            <Typography align='center' variant='body2' color='textSecondary'>
              <i>Please add a product</i>
            </Typography>
          </TableCell>
        </TableRow>
      );
    } else {
      return renderMenuItems(items);
    }
  };

  const addVendorToFirebase = async () => {
    const db = firebase.firestore();
    setLoading(true);
    await db.collection('vendor').add({
      name: vendorName,
      address: address,
      contact: contact,
      products: newProducts,
    });
    setLoading(false);
    history.push('/admin/vendor');
  };

  return (
    <Container width='1000px' style={containerStyle}>
      <Typography variant='h4' style={{ textAlign: 'center', margin: '10px 0' }}>
        Add Vendor
      </Typography>
      <div style={{ flexGrow: 1 }}>
        <Typography variant='h5'>Vendor Details</Typography>
        <Typography variant='body2' color='textSecondary' component='p'>
          Please fill out all the vendor details below.
        </Typography>
      </div>
      <div>
        <form style={formStyle}>
          <TextField
            required
            fullWidth
            label='Vendor Name'
            variant='outlined'
            style={{ marginBottom: '10px' }}
            value={vendorName}
            onChange={(ev) => setVendorName(ev.target.value)}
          />
          <TextField
            required
            fullWidth
            label='Address'
            variant='outlined'
            style={{ marginBottom: '10px' }}
            value={address}
            onChange={(ev) => setAddress(ev.target.value)}
          />
          <TextField
            required
            fullWidth
            label='Contact Number'
            type='number'
            variant='outlined'
            style={{ marginBottom: '10px', width: 400 }}
            value={contact}
            onChange={(ev) => setContact(ev.target.value)}
          />
        </form>
      </div>
      <div style={{ flexGrow: 1 }}>
        <Typography variant='h5'>Vendor Products</Typography>
        <Typography variant='body2' color='textSecondary' component='p'>
          Enter vendor products here.
        </Typography>
      </div>

      {/* Product List Table */}
      <div style={productContainer}>
        <TableContainer component={Paper} style={{ margin: '20px 0' }}>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Product Name</b>
                </TableCell>
                <TableCell>
                  <b>Unit Sell</b>
                </TableCell>
                <TableCell>
                  <b>Price/unit</b>
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <b>Action</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{renderTableBody(newProducts)}</TableBody>
          </Table>
        </TableContainer>

        <Button
          variant='text'
          color='secondary'
          startIcon={<Add />}
          disableRipple
          style={buttonStyle}
          onClick={addVendor}
        >
          <b>ADD MENU</b>
        </Button>
      </div>

      <div style={btnGroupStyle}>
        <Button
          variant='text'
          color='default'
          style={{ marginRight: 8 }}
          onClick={() => {
            history.push('/admin/vendor');
          }}
        >
          <b>Cancel</b>
        </Button>
        <Button
          variant='contained'
          color='primary'
          disabled={vendorName.length < 1 || address.length < 5 || contact.length < 5}
          onClick={addVendorToFirebase}
        >
          <b>Create Vendor</b>
        </Button>
      </div>

      <AddVendorModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        onProductAdd={(item) => {
          const temp: Product[] = [...newProducts, item];
          setNewProducts(temp);
          setModalOpen(false);
        }}
      />
      <FullScreenSpinner open={loading} />
    </Container>
  );
};

export default CreateVendor;
