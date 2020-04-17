import * as React from 'react';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { Order } from '../../models/Order';
import { MenuOrder } from '../../models/MenuOrder';
import {
  TableRow,
  TableCell,
  Modal,
  Fade,
  Card,
  CardContent,
  Grid,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  Divider,
  CardActions,
  Button,
} from '@material-ui/core';
import { renderCurrency } from '../../util/RenderUtil';

interface ModalProps {
  order: Order;
  onClose(): void;
  open: boolean;
}

const TransactionModal = (props: ModalProps) => {
  const [discount, setDiscount] = React.useState(0);
  const [promoCode, setPromoCode] = React.useState('');

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

  const fetchPromo = async () => {
    console.log('Fetching promo info');
    const db = firebase.firestore();
    const result = await db
      .collection('transaction')
      .where('order', '==', props.order.id)
      .get();
    if (result.size > 0) {
      result.forEach((doc) => {
        setPromoCode(doc.data().promoCode);
        db.collection('promo')
          .where('codeId', '==', doc.data().promoCode)
          .get()
          .then((qS) => {
            qS.forEach((doc) => {
              setDiscount(doc.data().discount);
            });
          });
      });
    }
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

  const handleClose = () => {
    setDiscount(0);
    setPromoCode('');
    props.onClose();
  };

  React.useEffect(() => {
    if (props.open) {
      fetchPromo();
    }
    // eslint-disable-next-line
  }, [props.open]);

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
              <Typography variant='h5'>Transaction</Typography>
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
                    ? `Promo ${promoCode} ${discount * 100}%: -${renderCurrency(
                        (props.order.total + props.order.total * 0.15) * discount
                      )}`
                    : null}
                </Typography>
                <Divider style={{ margin: '8px 0px' }} />
              </Grid>
              <Grid container justify='flex-end' alignItems='center' direction='row'>
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
          </CardActions>
        </Card>
      </Fade>
    </Modal>
  );
};

export default TransactionModal;
