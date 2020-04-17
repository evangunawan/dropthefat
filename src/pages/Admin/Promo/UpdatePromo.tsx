import * as React from 'react';
import firebase from 'firebase';
import '@firebase/firestore';
import { renderTime } from '../../../util/RenderUtil';
import Container from '../../../components/Container';
import DateFnsUtils from '@date-io/date-fns';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import {
  Typography,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
} from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';
import { Promo } from '../../../models/Promo';
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

const UpdatePromo = () => {
  const history = useHistory();
  const [promoId, setPromoId] = React.useState('');
  const [promoCodeId, setPromoCodeId] = React.useState('');
  const [promoTitle, setPromoTitle] = React.useState('');
  const [promoDiscount, setPromoDiscount] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const [selectedStartedDate, setSelectedStartedDate] = React.useState<Date | null>();
  const [selectedExpiredDate, setSelectedExpiredDate] = React.useState<Date | null>();
  let { id } = useParams();

  const fetchPromo = async (promoId: string) => {
    const db = firebase.firestore();
    let result: Promo = {} as Promo;
    setLoading(true);
    await db
      .collection('promo')
      .doc(`${promoId}`)
      .get()
      .then((doc) => {
        const newPromo: Promo = {
          id: promoId,
          codeId: doc.data()?.codeId,
          title: doc.data()?.title,
          startDate: doc.data()?.startDate,
          expiredDate: doc.data()?.expiredDate,
          discount: doc.data()?.discount,
        };
        result = newPromo;
      });
    setPromoId(promoId);
    setPromoCodeId(result.codeId);
    setPromoTitle(result.title);
    setPromoDiscount(String(result.discount));
    setSelectedStartedDate(new Date(result.startDate));
    setSelectedExpiredDate(new Date(result.expiredDate));
  };
  const updatePromo = async (promoId: String) => {
    const db = firebase.firestore();
    setLoading(true);
    await db
      .collection('promo')
      .doc(`${promoId}`)
      .update({
        codeId: promoCodeId,
        title: promoTitle,
        startDate: selectedStartedDate?.getTime(),
        expiredDate: selectedExpiredDate?.getTime(),
        discount: parseFloat(promoDiscount),
      });
    setLoading(false);
    history.push('/admin/promo');
  };
  React.useEffect(() => {
    fetchPromo(id || 'null');

    // eslint-disable-next-line
  }, []);
  const handleDateChange = (date: Date | null) => {
    setSelectedStartedDate(date);
  };
  const handleStartedDateChange = (date: Date | null) => {
    setSelectedExpiredDate(date);
  };
  return (
    <Container width='500px'>
      <div style={fieldBody}>
        <Typography variant='h4' component='h4'>
          Promo Management
        </Typography>
        <fieldset style={fieldBody}>
          <legend style={{ width: 150, display: 'flex', justifyContent: 'center' }}>
            Update Promo
          </legend>

          <TextField
            variant='outlined'
            label='Promo Code'
            style={{ marginBottom: 20, width: 500 }}
            value={promoCodeId}
            onChange={(ev) => setPromoCodeId(ev.target.value)}
          ></TextField>
          <TextField
            variant='outlined'
            label='Promo Title'
            style={{ marginBottom: 20, width: 500 }}
            value={promoTitle}
            onChange={(ev) => setPromoTitle(ev.target.value)}
          ></TextField>

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
            onClick={() => updatePromo(id || 'null')}
          >
            UPDATE
          </Button>
        </fieldset>
      </div>
    </Container>
  );
};

export default UpdatePromo;
