import 'date-fns';
import * as React from 'react';
import firebase from 'firebase';
import '@firebase/firestore';
import { startOfDay } from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from '@material-ui/core';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

import Container from '../../../components/Container';
import { useHistory } from 'react-router-dom';
import FullScreenSpinner from '../../../components/FullScreenSpinner';

const fieldBody: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: 30,
  margin: '30px 0px',
  width: 500,
};

const CreatePromo = () => {
  const history = useHistory();
  const [promoCodeId, setPromoCodeId] = React.useState('');
  const [promoTitle, setPromoTitle] = React.useState('');
  const [promoDiscount, setPromoDiscount] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const [selectedStartedDate, setSelectedStartedDate] = React.useState<Date | null>(
    new Date(Date.now())
  );
  const [selectedExpiredDate, setSelectedExpiredDate] = React.useState<Date | null>(
    new Date(Date.now())
  );
  const handleDateChange = (date: Date | null) => {
    setSelectedStartedDate(date);
  };
  const handleStartedDateChange = (date: Date | null) => {
    setSelectedExpiredDate(date);
  };
  const addPromoToFirebase = async () => {
    const db = firebase.firestore();
    setLoading(true);
    await db.collection('promo').add({
      codeId: promoCodeId,
      title: promoTitle,
      startDate: selectedStartedDate?.getTime(),
      expiredDate: selectedExpiredDate?.getTime(),
      discount: parseFloat(promoDiscount),
      deleted: false,
    });

    setLoading(false);
    history.push('/admin/promo');
  };

  return (
    <Container width='500px'>
      <div style={fieldBody}>
        <Typography variant='h4' component='h4'>
          Promo Management
        </Typography>
        <fieldset style={fieldBody}>
          <legend style={{ width: 150, display: 'flex', justifyContent: 'center' }}>
            Add New Menu
          </legend>
          <TextField
            variant='outlined'
            label='Promo Code'
            style={{ marginBottom: 20, width: 500 }}
            value={promoCodeId}
            onChange={(ev) => setPromoCodeId(ev.target.value)}
          />
          <TextField
            margin='normal'
            variant='outlined'
            label='Title'
            style={{ marginBottom: 20, width: 500 }}
            value={promoTitle}
            onChange={(ev) => setPromoTitle(ev.target.value)}
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant='inline'
              margin='normal'
              format='MM/dd/yyyy'
              id='date-picker-inline'
              label='Starting DAte'
              value={selectedStartedDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
            <KeyboardDatePicker
              disableToolbar
              variant='inline'
              margin='normal'
              format='MM/dd/yyyy'
              id='date-picker-inline'
              label='Expired Date'
              value={selectedExpiredDate}
              onChange={handleStartedDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>
          <TextField
            margin='normal'
            variant='outlined'
            label='Discount'
            style={{ marginBottom: 20, width: 500 }}
            value={promoDiscount}
            onChange={(ev) => setPromoDiscount(ev.target.value)}
          />
          <Button
            variant='contained'
            color='primary'
            style={{ marginBottom: 20, width: 500, height: 50 }}
            onClick={addPromoToFirebase}
          >
            ADD
          </Button>
        </fieldset>
      </div>
      <FullScreenSpinner open={loading} />
    </Container>
  );
};
export default CreatePromo;
