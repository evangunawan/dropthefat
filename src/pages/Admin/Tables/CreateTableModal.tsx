import * as React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import {
  Modal,
  Fade,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Divider,
  CardActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import { DiningTable } from '../../../models/DiningTable';

interface ModalProps {
  open: boolean;
  onClose(): void;
  onUpdate(): void;
}

const CreateTableModal = (props: ModalProps) => {
  const [loading, setLoading] = React.useState(false);
  const [tableNumber, setTableNumber] = React.useState(1);
  const [tableType, setTableType] = React.useState('small');

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

  const handleSubmit = async () => {
    const db = firebase.firestore();
    setLoading(true);
    const query = await db
      .collection('table')
      .where('tableNumber', '==', tableNumber)
      .get();
    if (query.size > 0) {
      window.alert('Table number is not available! Please check again.');
      setLoading(false);
    } else {
      const newTable: DiningTable = {
        tableNumber: tableNumber,
        status: 'available',
        type: tableType as 'small' | 'medium' | 'large' | 'unknown',
      };
      await db.collection('table').add(newTable);
      props.onUpdate();
      setLoading(false);
    }
  };

  const handleCancel = () => {
    props.onClose();
  };

  const handleTableNumberChange = (
    ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let tnum = parseInt(ev.target.value);
    if (tnum < 1) {
      tnum = 1;
    }
    setTableNumber(tnum);
  };

  const handleTypeChange = (ev: React.ChangeEvent<{ value: unknown }>) => {
    setTableType(ev.target.value as string);
  };

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      style={modalStyle}
      disableBackdropClick={loading}
      disableEscapeKeyDown={loading}
    >
      <Fade in={props.open}>
        <Card style={cardStyle}>
          <CardContent>
            <Grid container direction='column' justify='flex-start' spacing={2}>
              <Grid item>
                <Typography variant='h5'>Create a New Table</Typography>
                <Divider />
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  type='number'
                  label='Table Number'
                  value={tableNumber}
                  onChange={(ev) => handleTableNumberChange(ev)}
                />
              </Grid>
              <Grid item>
                <FormControl fullWidth>
                  <InputLabel id='size-select'>Table Type</InputLabel>
                  <Select
                    labelId='size-select'
                    style={{ width: '100%' }}
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
              <Grid item>
                <Typography variant='body2' color='textSecondary'>
                  <i>The table will have available status when it created.</i>
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Button
              variant='text'
              onClick={handleCancel}
              style={{ marginLeft: 'auto', marginRight: 8 }}
              disabled={loading}
            >
              <b>Cancel</b>
            </Button>
            <Button
              variant='contained'
              color='primary'
              onClick={handleSubmit}
              disabled={loading}
            >
              <b>Submit</b>
            </Button>
          </CardActions>
          {loading ? 'Please wait...' : null}
        </Card>
      </Fade>
    </Modal>
  );
};

export default CreateTableModal;
