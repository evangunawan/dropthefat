import * as React from 'react';
import {
  Modal,
  Fade,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@material-ui/core';
import { Product } from '../../models/Product';

interface ProductProps {
  open: boolean;
  onClose(): void;
  onProductAdd(item: Product): void;
}

const AddVendorModal = (props: ProductProps) => {
  const [productName, setProductName] = React.useState('');
  const [productUnit, setProductUnit] = React.useState('');
  const [productPrice, setProductPrice] = React.useState(0);

  const modalStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const cardStyle: React.CSSProperties = {
    outline: 0,
    padding: '10px',
    width: 450,
  };

  const handleAddProduct = () => {
    const newProduct: Product = {
      name: productName,
      price: productPrice,
      unit: productUnit as 'unit' | 'kg' | 'liter',
    };
    props.onProductAdd(newProduct);
    setProductName('');
    setProductPrice(0);
    setProductUnit('');
  };

  return (
    <Modal open={props.open} onClose={props.onClose} style={modalStyle}>
      <Fade in={props.open}>
        <Card style={cardStyle}>
          <CardContent>
            <Typography variant='h6' style={{ textAlign: 'center', marginBottom: 20 }}>
              Add a product
            </Typography>
            <div>
              <TextField
                variant='outlined'
                label='Name'
                style={{ marginBottom: 20, width: 395 }}
                type='text'
                value={productName}
                onChange={(ev) => setProductName(ev.target.value)}
              />

              <FormControl variant='outlined'>
                <InputLabel id='select-menu-type'>Unit Sell</InputLabel>
                <Select
                  label='Unit Sell'
                  style={{ marginBottom: 20, width: 395 }}
                  value={productUnit}
                  onChange={(ev: any) => setProductUnit(ev.target.value)}
                  variant='outlined'
                >
                  <MenuItem value='Choose One' disabled>
                    - Choose One -
                  </MenuItem>
                  <MenuItem value='kg'>Kilogram (kg)</MenuItem>
                  <MenuItem value='liter'>Liter (cc)</MenuItem>
                  <MenuItem value='unit'>Unit (pcs)</MenuItem>
                </Select>
              </FormControl>

              <TextField
                variant='outlined'
                label='Price per unit'
                style={{ marginBottom: 20, width: 395 }}
                type='number'
                value={productPrice}
                onChange={(ev: any) => setProductPrice(ev.target.value)}
              />

              <Button
                color='primary'
                variant='contained'
                style={{ width: 395, textAlign: 'center' }}
                disabled={
                  productName.length < 1 || productUnit.length < 1 || productPrice === 0
                }
                onClick={handleAddProduct}
              >
                ADD
              </Button>
            </div>
          </CardContent>
        </Card>
      </Fade>
    </Modal>
  );
};

export default AddVendorModal;
