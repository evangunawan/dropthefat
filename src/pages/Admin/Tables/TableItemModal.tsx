import * as React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import {
  Modal,
  Fade,
  Card,
  CardContent,
  Typography,
  Divider,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CardActions,
  Button,
} from '@material-ui/core';
import { DiningTable } from '../../../models/DiningTable';

interface ModalProps {
  open: boolean;
  onClose(): void;
  item: DiningTable;
}

const TableItemModal = (props: ModalProps) => {
  const [editMode, setEditMode] = React.useState(false);
  const [tableNumber, setTableNumber] = React.useState(0);
  const [tableStatus, setTableStatus] = React.useState('available');
  const [tableType, setTableType] = React.useState('unknown');
  // const [tableItem, setTableItem] = React.useState<DiningTable>({...props.item});

  const modalStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const cardStyle: React.CSSProperties = {
    width: 400,
    outline: 0,
    padding: 12,
  };

  const handleClose = () => {
    setEditMode(false);
    props.onClose();
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setTableStatus(props.item.status);
    setTableType(props.item.type);
  };

  const handleStatusChange = (ev: React.ChangeEvent<{ value: unknown }>) => {
    setTableStatus(ev.target.value as string);
  };

  const handleTypeChange = (ev: React.ChangeEvent<{ value: unknown }>) => {
    setTableType(ev.target.value as string);
  };

  React.useEffect(() => {
    setTableNumber(props.item.tableNumber);
    setTableStatus(props.item.status);
    setTableType(props.item.type);
  }, [props.item]);

  return (
    <Modal open={props.open} onClose={props.onClose} style={modalStyle}>
      <Fade in={props.open}>
        <Card style={cardStyle}>
          <CardContent>
            <Grid
              container
              direction='column'
              justify='flex-start'
              spacing={2}
              alignItems='stretch'
            >
              <Grid item>
                <Typography variant='h5'>Table Details</Typography>
                <Divider />
              </Grid>
              <Grid item>
                <Typography variant='body2'>Table Number: {tableNumber}</Typography>
              </Grid>
              <Grid item>
                <FormControl fullWidth>
                  <InputLabel id='status-select'>Table Status</InputLabel>
                  <Select
                    labelId='status-select'
                    style={{ width: '100%' }}
                    disabled={!editMode}
                    value={tableStatus || 'unavailable'}
                    onChange={(ev) => handleStatusChange(ev)}
                  >
                    <MenuItem value='available'>Available</MenuItem>
                    <MenuItem value='dining'>Dining</MenuItem>
                    <MenuItem value='reserved'>Reserved</MenuItem>
                    <MenuItem value='unavailable'>Unavailable</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
                <FormControl fullWidth>
                  <InputLabel id='size-select'>Table Type</InputLabel>
                  <Select
                    labelId='size-select'
                    style={{ width: '100%' }}
                    disabled={!editMode}
                    value={tableType || 'unknown'}
                    onChange={(ev) => handleTypeChange(ev)}
                  >
                    <MenuItem value='small'>Small</MenuItem>
                    <MenuItem value='medium'>Medium</MenuItem>
                    <MenuItem value='large'>Large</MenuItem>
                    <MenuItem value='unknown'>Unknown</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            {!editMode ? (
              <div style={{ marginLeft: 'auto' }}>
                <Button variant='text' color='secondary'>
                  <b>Delete</b>
                </Button>
                <Button
                  variant='text'
                  color='secondary'
                  onClick={() => setEditMode(true)}
                  style={{ marginLeft: 8 }}
                >
                  <b>Edit</b>
                </Button>
                <Button variant='text' onClick={handleClose} style={{ marginLeft: 8 }}>
                  <b>Close</b>
                </Button>
              </div>
            ) : (
              <div style={{ marginLeft: 'auto' }}>
                <Button variant='text' onClick={handleCancelEdit}>
                  <b>Cancel</b>
                </Button>
                <Button variant='contained' color='primary' style={{ marginLeft: 8 }}>
                  <b>Submit</b>
                </Button>
              </div>
            )}
          </CardActions>
        </Card>
      </Fade>
    </Modal>
  );
};

export default TableItemModal;
