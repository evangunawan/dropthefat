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
  onClose(): void;
  productList: Product[];
  onProductAdd(item: Product): void;
}

interface SuggestionProps {
  productList: Product[];
  onProductAdd(item: Product): void;
}

const SuggestionBox = (props: SuggestionProps) => {
  const boxStyle: React.CSSProperties = {
    height: '200px',
    maxHeight: '200px',
    marginTop: '8px',
    overflow: 'auto',
  };

  const renderItemList = () => {
    const addMenu = (item: Product) => {
      props.onProductAdd(item);
    };

    const result = props.productList.map((item, k) => {
      return (
        <ListItem button key={k} onClick={() => addMenu(item)}>
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
  const [menuInput, setMenuInput] = React.useState('');
  const [selectOpen, setSelectOpen] = React.useState(false);
  const [menuSelect, setMenuSelect] = React.useState('all');
  const [productList] = React.useState<Product[]>(props.productList);
  const [filteredList, setFilteredList] = React.useState<Product[]>(props.productList);
  //   const { vendor }=props;

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

  // const filterMenu = (target: string) => {
  //   if (target === 'all') {
  //     setFilteredList(productList);
  //   } else {
  //     const tempList = productList.filter((menu: Product) => {
  //       return menu.name === target;
  //     });
  //     setFilteredList(tempList);
  //   }
  // };

  const handleSelectChange = (ev: any) => {
    setMenuSelect(ev.target.value);
    // console.log(menuSelect);
  };

  return (
    <Modal open={props.open} onClose={props.onClose} style={modalStyle}>
      <Fade in={props.open}>
        <Card style={cardStyle}>
          <CardContent>
            <Typography variant='h6'>Add a Product</Typography>
            <div style={{ marginTop: '16px' }}>
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
