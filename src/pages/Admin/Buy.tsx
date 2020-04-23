import * as React from 'react';
import Container from '../../components/Container';
import {
  TextField,
  Typography,
  TableContainer,
  Paper,
  TableHead,
  TableRow,
  Table,
  TableBody,
  TableCell,
  Button,
  IconButton,
  Grid,
  Box,
} from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { Product } from '../../models/Product';
import { Vendor } from '../../models/Vendor';
import AddProductModal from '../../components/BuyMaterial/AddProductModal';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { MaterialPurchase } from '../../models/MaterialPurchase';
import { Add } from '@material-ui/icons';
import FullScreenSpinner from '../../components/FullScreenSpinner';
import { useHistory } from 'react-router-dom';
import { renderCurrency } from '../../util/RenderUtil';
import  ChangeVendorModal  from '../../components/BuyMaterial/ChangeVendorModal';

interface TableProps {
  purchases: MaterialPurchase[];
  onDelete(item: MaterialPurchase): any;
  onQtyChange(ev: any, item: MaterialPurchase): any;
}

const MaterialTable = (props: TableProps) => {
  const placeholderStyle = {
    margin: '0 auto',
    padding: '16px',
  };

  const deleteItem = (item: MaterialPurchase) => {
    props.onDelete(item);
  };

  const handleQuantityChange = (ev: any, item: MaterialPurchase) => {
    props.onQtyChange(ev, item);
  };

  const renderPrice = (item: MaterialPurchase) => {
    return item.quantity * item.product.price;
  };

  const renderGrandTotal = (item: MaterialPurchase[]) => {
    let result = 0;
    item.forEach((item) => {
      result = result + item.quantity * item.product.price;
    });
    return result;
  };

  const renderMenuItems = (items: MaterialPurchase[]) => {
    return items.map((item, k) => {
      return (
        <TableRow key={k}>
          <TableCell>{item.product.name}</TableCell>
          <TableCell>{renderCurrency(item.product.price)}</TableCell>
          <TableCell>
            <TextField
              type='number'
              style={{ width: 75 }}
              value={item.quantity}
              onChange={(ev) => handleQuantityChange(ev, item)}
            />
          </TableCell>
          <TableCell>{renderCurrency(renderPrice(item))}</TableCell>
          <TableCell style={{ width: 60 }}>
            <IconButton
              aria-label='Delete'
              style={{ width: 50 }}
              onClick={() => deleteItem(item)}
            >
              <Delete fontSize='inherit' />
            </IconButton>
          </TableCell>
        </TableRow>
      );
    });
  };

  const renderTableBody = (items: MaterialPurchase[]) => {
    if (items.length < 1 || items === undefined) {
      return (
        <TableRow style={placeholderStyle}>
          <TableCell colSpan={6}>
            <Typography align='center' variant='body2' color='textSecondary'>
              <i>Please add materials you want to buy</i>
            </Typography>
          </TableCell>
        </TableRow>
      );
    } else {
      return renderMenuItems(items);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell>
              <b>Ingredient</b>
            </TableCell>
            <TableCell>
              <b>Price</b>
            </TableCell>
            <TableCell>
              <b>Quantity</b>
            </TableCell>
            <TableCell>
              <b>Total</b>
            </TableCell>
            <TableCell>
              <b>Remove</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {renderTableBody(props.purchases)}
          <TableRow style={{ backgroundColor: '#111' }}>
            <TableCell colSpan={5}>
              <Typography align='right' variant='body2'>
                <b>Grand Total</b>
              </Typography>
            </TableCell>
            <TableCell>
              <b>{renderCurrency(renderGrandTotal(props.purchases))}</b>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const Buy = () => {
  const [pic, setPic] = React.useState('');
  const [setState]= React.useState(0);
  const [vendor, setVendor] = React.useState<Vendor[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [materialList, setMaterialList] = React.useState<Product[]>([]); //menuList is all loaded menu from db, which will be shown in AddMenuModal
  const [purchase, setPurchase] = React.useState<MaterialPurchase[]>([]); //Orders that added in the table.
  const [modalOpen, setModalOpen] = React.useState(false);
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
  const [vendorModalOpen, setVendorModalOpen] = React.useState(false);
  const history = useHistory();
  const db = firebase.firestore();


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


  React.useEffect(() => {
    fetchVendor();
    // eslint-disable-next-line
  }, []);

  const formStyle: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    // flexWrap: 'wrap',
    padding: '16px 0',
  };

  const containerStyle: React.CSSProperties = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    alignItems: 'stretch',
  };

  const btnGroupStyle: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
  };

  const buttonStyle = {
    width: '250px',
    margin: '16px auto',
    alignSelf: 'center',
  };

  const addMaterial = () => {
    setModalOpen(true);
    // console.log(menuList);
  };

  
  //Add selected menu from modal into table (state items)
  const addSelectedMaterial = (item: Product) => {
    // const temp = [...items, item];
    // setItems(temp);
    const newPurchase: MaterialPurchase = {
      product: item,
      quantity: 1,
      total: item.price,
    };
    const temp = [...purchase, newPurchase];
    setPurchase(temp);
  };

  const removeMaterial = (item: MaterialPurchase) => {
    const temp = [...purchase];
    const index = temp.indexOf(item);
    if (index !== -1) {
      temp.splice(index, 1);
      setPurchase(temp);
    }
  };

  const createPurchase = async () => {
    setLoading(true);
    const mPurchase: { material: string; quantity: number }[] = [];
    let grandTotal = 0;
    purchase.forEach((item) => {
      grandTotal = grandTotal + item.product.price * item.quantity;
      mPurchase.push({
        material: item.product.name || 'undefined',
        quantity: item.quantity,
      });
    });

    try {
      await db.collection('purchasement').add({
        time: Date.now(),
        menuOrders: mPurchase,
        pic: pic || 'undefined',
        vendor: vendor || 'undefined',
        total: grandTotal,
      });
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleQtyChange = (ev: any, item: MaterialPurchase) => {
    const temp = [...purchase];
    const index = temp.indexOf(item);
    temp[index].quantity = ev.target.value as number;

    setPurchase(temp);
  };

  return (
    <Container width='1000px' style={containerStyle}>
      <div style={{ flexGrow: 1 }}>
        <Typography variant='h5'>Create an Order</Typography>
        <Typography variant='body2' color='textSecondary' component='p'>
          Create an order entry by selecting menu and data below.
        </Typography>
      </div>
      <div>
        <form style={formStyle}>
          <TextField
            fullWidth
            label='Person in charge'
            variant='outlined'
            value={pic}
            onChange={(ev) => setPic(ev.target.value)}
          />

            <Grid container justify='flex-start' alignItems='flex-end' direction='column'>
              <Grid container justify='flex-end' alignItems='center'>
                <div style={{ margin: '0px 32px' }}>
                  <Typography variant='h6'>Vendor Selected</Typography>
                  <Typography variant='body2' color='textSecondary'>
                    Id: {selectedVendor.id}
                  </Typography>
                </div>
                <div style={{ marginRight: 32 }}>
                  <Typography variant='h6'>{selectedVendor.name}</Typography>
                </div>
                <Button
                  disableRipple
                  variant='contained'
                  color='primary'
                  onClick={() => setVendorModalOpen(true)}
                >
                  Change...
                </Button>
              </Grid>
            </Grid>
          
          <Typography variant='h5' style={{ padding: '16px 0px' }}>
           Ingredient Order
          </Typography>
          <MaterialTable
            purchases={purchase}
            onDelete={(item) => removeMaterial(item)}
            onQtyChange={(ev, item) => handleQtyChange(ev, item)}
          />
          <Button
            variant='text'
            color='secondary'
            startIcon={<Add />}
            disableRipple
            style={buttonStyle}
            onClick={addMaterial}
          >
            <b>ADD INGREDIENT</b>
          </Button>
        </form>
      </div>
      <div style={btnGroupStyle}>
        <Button
          variant='text'
          color='default'
          style={{ marginRight: 8 }}
          onClick={() => {
            history.push('/buy');
          }}
        >
          <b>Cancel</b>
        </Button>
        <Button
          variant='contained'
          color='primary'
          disabled={purchase.length < 1}
          onClick={createPurchase}
        >
          <b>Create Purchasement</b>
        </Button>
      </div>

      <AddProductModal
        open={modalOpen}
        productList={materialList}
        onClose={() => {
          setModalOpen(false);
        }}
        onProductAdd={(item) => {
          addSelectedMaterial(item);
        }}
      />
      <ChangeVendorModal
        open={vendorModalOpen}
        vendorList={vendor}
        onClose={() => setVendorModalOpen(false)}
        onTableSelect={(item: Vendor) => setSelectedVendor(item)}
      />
      <FullScreenSpinner open={loading} />
    </Container>
  );
};

export default Buy;
