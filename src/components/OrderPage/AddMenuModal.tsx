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
import { Menu } from '../../models/Menu';

interface ModalProps {
  open: boolean;
  onClose: any;
  menuList: Menu[];
  onMenuAdd(item: Menu): any;
}

interface SuggestionProps {
  menuList: Menu[];
  onMenuAdd(item: Menu): any;
}

const SuggestionBox = (props: SuggestionProps) => {
  const boxStyle: React.CSSProperties = {
    height: '200px',
    maxHeight: '200px',
    marginTop: '8px',
    overflow: 'auto',
  };

  const renderItemList = () => {
    const addMenu = (item: Menu) => {
      props.onMenuAdd(item);
    };

    const result = props.menuList.map((item, k) => {
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

const AddMenuModal = (props: ModalProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [menuInput, setMenuInput] = React.useState('');
  const [selectOpen, setSelectOpen] = React.useState(false);
  const [menuSelect, setMenuSelect] = React.useState('all');
  const [menuList] = React.useState<Menu[]>(props.menuList);
  const [filteredList, setFilteredList] = React.useState<Menu[]>(props.menuList);

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

  const filterMenu = (target: string) => {
    if (target === 'all') {
      setFilteredList(menuList);
    } else {
      const tempList = menuList.filter((menu: Menu) => {
        return menu.type === target;
      });
      setFilteredList(tempList);
    }
  };

  const handleSelectChange = (ev: any) => {
    setMenuSelect(ev.target.value);
    // console.log(menuSelect);
    filterMenu(ev.target.value);
  };

  return (
    <Modal open={props.open} onClose={props.onClose} style={modalStyle}>
      <Fade in={props.open}>
        <Card style={cardStyle}>
          <CardContent>
            <Typography variant='h6'>Add a Menu</Typography>
            <div style={{ marginTop: '16px' }}>
              <InputLabel>Category</InputLabel>
              <Select
                open={selectOpen}
                onClose={() => {
                  setSelectOpen(false);
                }}
                onOpen={() => {
                  setSelectOpen(true);
                }}
                value={menuSelect}
                onChange={handleSelectChange}
                style={{ minWidth: '200px', margin: '8px 0px' }}
              >
                <MenuItem value='all'>All</MenuItem>
                <MenuItem value='drink'>Drink</MenuItem>
                <MenuItem value='main-course'>Main Course</MenuItem>
                <MenuItem value='dessert'>Dessert</MenuItem>
              </Select>
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
                menuList={filteredList}
                onMenuAdd={(item) => {
                  props.onMenuAdd(item);
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

export default AddMenuModal;
