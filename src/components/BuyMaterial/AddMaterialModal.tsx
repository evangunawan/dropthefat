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
import { Material } from '../../models/Material';

interface ModalProps {
  open: boolean;
  onClose: any;
  materialList: Material[];
  onMaterialAdd(item: Material): any;
}

interface SuggestionProps {
  materialList: Material[];
  onMaterialAdd(item: Material): any;
}

const SuggestionBox = (props: SuggestionProps) => {
  const boxStyle: React.CSSProperties = {
    height: '200px',
    maxHeight: '200px',
    marginTop: '8px',
    overflow: 'auto',
  };

  const renderItemList = () => {
    const addMaterial = (item: Material) => {
      props.onMaterialAdd(item);
    };

    const result = props.materialList.map((item, k) => {
      return (
        <ListItem button key={k} onClick={() => addMaterial(item)}>
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

const AddMaterialModal = (props: ModalProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [materialInput, setMaterialInput] = React.useState('');
  const [selectOpen, setSelectOpen] = React.useState(false);
  const [materialSelect, setMaterialSelect] = React.useState('all');
  const [materialList] = React.useState<Material[]>(props.materialList);
  const [filteredList, setFilteredList] = React.useState<Material[]>(props.materialList);

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

  const filterMaterial = (target: string) => {
    if (target === 'all') {
      setFilteredList(materialList);
    } else {
      const tempList = materialList.filter((material: Material) => {
        return material.name === target;
      });
      setFilteredList(tempList);
    }
  };

  const handleSelectChange = (ev: any) => {
    setMaterialSelect(ev.target.value);
    // console.log(menuSelect);
    filterMaterial(ev.target.value);
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
                materialList={filteredList}
                onMaterialAdd={(item) => {
                  props.onMaterialAdd(item);
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

export default AddMaterialModal;
