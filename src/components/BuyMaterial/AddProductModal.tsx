import * as React from 'react';
import {
  Modal,
  Fade,
  Card,
  CardContent,
  Typography,
  Box,
  Select,
  MenuItem,
  InputLabel,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import { Product } from '../../models/Product';

interface ModalProps {
  open: boolean;
  onClose: any;
  productList: Product[];
  onProductAdd(item: Product): any;
}

interface SuggestionProps {
  productList: Product[];
  onProductAdd(item: Product): any;
}

const SuggestionBox = (props: SuggestionProps) => {
  const boxStyle: React.CSSProperties = {
    height: '200px',
    maxHeight: '200px',
    marginTop: '8px',
    overflow: 'auto',
  };

  const renderItemList = () => {
    const addProduct = (item: Product) => {
      props.onProductAdd(item);
    };

    const result = props.productList.map((item, k) => {
      return (
        <ListItem button key={k} onClick={() => addProduct(item)}>
          <ListItemText primary={item.name} />
        </ListItem>
      );
    });
    return result;
  };

  return (
    <Box style={boxStyle}>
      <List>{renderItemList()}</List>
    </Box>
  );
};

const AddProductModal = (props: ModalProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [productInput, setProductInput] = React.useState('');
  const [selectOpen, setSelectOpen] = React.useState(false);
  const [productSelect, setProductSelect] = React.useState('all');
  const [productList] = React.useState<Product[]>(props.productList);
  const [filteredList, setFilteredList] = React.useState<Product[]>(props.productList);

  const modalStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const cardStyle: React.CSSProperties = {
    outline: 0,
    padding: '8px',
    width: 500,
  };

  const filterProduct = (target: string) => {
    if (target === 'all') {
      setFilteredList(productList);
    } else {
      const tempList = productList.filter((product: Product) => {
        return product.name === target;
      });
      setFilteredList(tempList);
    }
  };

  const handleSelectChange = (ev: any) => {
    setProductSelect(ev.target.value);
    // console.log(menuSelect);
    filterProduct(ev.target.value);
  };

  return (
    <Modal open={props.open} onClose={props.onClose} style={modalStyle}>
      <Fade in={props.open}>
        <Card style={cardStyle}>
          <CardContent>
            <Typography variant='h6'>Add a Menu</Typography>
            <div style={{ marginTop: '16px' }}>
              {/* <InputLabel>Category</InputLabel>
              <Select
                open={selectOpen}
                onClose={() => {
                  setSelectOpen(false);
                }}
                onOpen={() => {
                  setSelectOpen(true);
                }}
                value={materialSelect}
                onChange={handleSelectChange}
                style={{ minWidth: '200px', margin: '8px 0px' }}
              >
                <MenuItem value='all'>All</MenuItem>
                <MenuItem value='drink'>Drink</MenuItem>
                <MenuItem value='main-course'>Main Course</MenuItem>
                <MenuItem value='dessert'>Dessert</MenuItem>
              </Select> */}
              {/* //TODO: Add TextField filtering */}
              {/* <TextField 
                variant='outlined'
                label='Search Menu' 
                placeholder='Type a menu name' 
                fullWidth 
                value={menuInput}
                onChange={handleInput}
                style={{margin: '8px 0px'}}
              /> */}

              <Typography variant='body2' color='textSecondary'>
                Please select an item:
              </Typography>
              <SuggestionBox
                productList={filteredList}
                onProductAdd={(item) => {
                  props.onProductAdd(item);
                  props.onClose();
                }}
              />
            </div>
          </CardContent>
          {/* <CardActions>
            <Button color='primary' size='small'><b>Add Menu</b></Button>
          </CardActions> */}
        </Card>
      </Fade>
    </Modal>
  );
};

export default AddProductModal;
