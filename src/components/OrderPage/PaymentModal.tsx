import * as React from 'react';
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
} from '@material-ui/core';
import { Order } from '../../models/Order';
import { MenuOrder } from '../../models/MenuOrder';
import { renderCurrency } from '../../util/RenderUtil';

interface ModalProps {
  open: boolean;
  onClose(): void;
  order: Order;
  onSubmit(): void;
}

const PaymentModal = (props: ModalProps) => {
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

  //Submitting a payment is finishing the payment.
  //Here we will complete the order and update some value in db.
  const handleSubmit = () => {
    props.onClose();
    props.onSubmit();
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
                <Divider style={{ margin: '8px 0px' }} />
                <Typography variant='body2' align='right' style={{ fontSize: '1.1rem' }}>
                  <b>
                    Grand Total:{' '}
                    {renderCurrency(props.order.total + props.order.total * 0.15)}
                  </b>
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions style={{ padding: 16 }}>
            <Button variant='text' onClick={props.onClose} style={{ marginLeft: 'auto' }}>
              <b>Close</b>
            </Button>
            <Button variant='text' color='secondary'>
              <b>Print</b>
            </Button>
            <Button variant='contained' color='primary' onClick={handleSubmit}>
              <b>Submit</b>
            </Button>
          </CardActions>
        </Card>
      </Fade>
    </Modal>
  );
};

export default PaymentModal;
