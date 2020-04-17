import * as React from 'react';
import * as firebase from 'firebase';
import 'firebase/firestore';
import {
  Modal,
  Fade,
  Card,
  CardContent,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
  CardActions,
  Button,
  Divider,
  TextField,
  IconButton,
} from '@material-ui/core';
import { Check } from '@material-ui/icons';
import { Order } from '../../models/Order';
import { MenuOrder } from '../../models/MenuOrder';
import { renderCurrency } from '../../util/RenderUtil';

interface ModalProps {
  open: boolean;
  onClose(): void;
  order: Order;
  onSubmit(promoCode: string): void;
}

const PaymentModal = (props: ModalProps) => {
  const [promoCode, setPromoCode] = React.useState('');
  const [discount, setDiscount] = React.useState(0);
  const [promoHelperText, setPromoHelperText] = React.useState('');
  const [promoError, setPromoError] = React.useState(false);

  const modalStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100vh',
  };

  const cardStyle: React.CSSProperties = {
    width: '600px',
    outline: 0,
  };

  const checkPromo = async () => {
    const db = firebase.firestore();
    // console.log('checking promo');
    console.log('PromoCode: ' + promoCode);
    const result = await db
      .collection('promo')
      .where('codeId', '==', promoCode)
      .get();
    if (result.size < 1) {
      console.log('Code not Exists');
      setPromoHelperText('Code not found!');
      setPromoError(true);
    } else {
      result.forEach((doc) => {
        if (doc.data().startDate > Date.now() || doc.data().expiredDate < Date.now()) {
          setPromoHelperText('Code can not be used!');
          setPromoError(true);
        } else {
          console.log('set discount!');
          setDiscount(doc.data().discount);
          setPromoHelperText('Code applied!');
          setPromoError(false);
        }
      });
    }
  };

  //Submitting a payment is finishing the payment.
  //Here we will complete the order and update some value in db.
  const handleSubmit = () => {
    props.onClose();
    setPromoCode('');
    setPromoError(false);
    setPromoHelperText('');
    setDiscount(0);
    props.onSubmit(promoCode || '');
  };

  const handleClose = () => {
    props.onClose();
    setPromoCode('');
    setPromoError(false);
    setPromoHelperText('');
    setDiscount(0);
  };

  const renderTableItem = (items: MenuOrder[]) => {
    if (items.length > 0) {
      const result = items.map((item, k) => {
        return (
          <TableRow key={k}>
            <TableCell>{item.menu.name}</TableCell>
            <TableCell>{`${item.quantity} * ${renderCurrency(
              item.menu.price
            )}`}</TableCell>
            <TableCell>{renderCurrency(item.quantity * item.menu.price)}</TableCell>
          </TableRow>
        );
      });
      return result;
    } else {
      return null;
    }
  };

  return (
    <Modal open={props.open} onClose={props.onClose} style={modalStyle}>
      <Fade in={props.open}>
        <Card style={cardStyle}>
          <CardContent>
            <Grid
              container
              justify='flex-start'
              direction='column'
              spacing={5}
              style={{ padding: 16 }}
            >
              <Typography variant='h5'>Make Payment</Typography>
              <Typography variant='body2'>
                Table Number: {props.order.tableNumber}
              </Typography>
              <TableContainer>
                <Table size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>{renderTableItem(props.order.menuOrders)}</TableBody>
                </Table>
              </TableContainer>
              <Grid container justify='flex-start' direction='column'>
                <Typography variant='body2' align='right'>
                  Total: {renderCurrency(props.order.total)}
                </Typography>
                <Typography variant='body2' align='right'>
                  Tax (15%): {renderCurrency(props.order.total * 0.15)}
                </Typography>
                <Typography variant='body2' align='right'>
                  {discount !== 0
                    ? `Promo ${discount * 100}%: -${renderCurrency(
                        (props.order.total + props.order.total * 0.15) * discount
                      )}`
                    : null}
                </Typography>
                <Divider style={{ margin: '8px 0px' }} />
              </Grid>
              <Grid container justify='space-between' alignItems='center' direction='row'>
                <Grid item>
                  <TextField
                    label='Promo Code'
                    type='text'
                    style={{ width: 150 }}
                    value={promoCode}
                    onChange={(ev) => {
                      setPromoCode(ev.target.value);
                    }}
                    helperText={promoHelperText}
                    error={promoError}
                  />
                  <IconButton style={{ margin: 16 }} onClick={checkPromo} size='small'>
                    <Check />
                  </IconButton>
                </Grid>
                <Grid item>
                  <Typography
                    variant='body2'
                    align='right'
                    style={{ fontSize: '1.1rem' }}
                  >
                    <b>
                      Grand Total:{' '}
                      {renderCurrency(
                        props.order.total +
                          props.order.total * 0.15 -
                          (props.order.total + props.order.total * 0.15) * discount
                      )}
                    </b>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions style={{ padding: 16 }}>
            <Button variant='text' onClick={handleClose} style={{ marginLeft: 'auto' }}>
              <b>Close</b>
            </Button>
            <Button variant='text' color='secondary'>
              <b>Print</b>
            </Button>
            <Button
              variant='contained'
              disabled={promoError}
              color='primary'
              onClick={() => handleSubmit()}
            >
              <b>Submit</b>
            </Button>
          </CardActions>
        </Card>
      </Fade>
    </Modal>
  );
};

export default PaymentModal;
