import * as React from 'react';
// prettier-ignore
import { Modal, Card, Fade, CardContent, CardActions, Button, Typography, 
  Table, TableCell, TableHead, TableBody, TableFooter, TablePagination, TableRow, 
  Divider, TableContainer } from '@material-ui/core';
import { Order } from '../../models/Order';
import dateFormat from 'dateformat';
import { MenuOrder } from '../../models/MenuOrder';

interface ModalProps {
  open: boolean;
  order: Order;
  onClose: any;
}

const OrderMenuModal = (props: ModalProps) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const modalStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100vh',
  };
  const cardStyle: React.CSSProperties = {
    width: '500px',
    outline: 0,
  };

  const renderTime = (time: number) => {
    if (!!time) {
      const date = new Date(time);
      const result = dateFormat(date, 'ddd, dd-mmm-yyyy HH:MM');
      return result;
    } else {
      return 'NaN';
    }
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const renderTableItem = (items: MenuOrder[]) => {
    if (items.length > 0) {
      const result = items.map((item, k) => {
        return (
          <TableRow key={k}>
            <TableCell>{item.menu.name}</TableCell>
            <TableCell>{item.quantity}</TableCell>
            <TableCell>{item.quantity * item.menu.price}</TableCell>
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
            <Typography component='h2' variant='h5'>
              Order Details
            </Typography>
            <Typography variant='body2'>{`ID: ${props.order.id}`}</Typography>
            <Typography variant='body2'>{`Time: ${renderTime(
              props.order.time
            )}`}</Typography>
            <Divider />
            <Typography component='h2' variant='h6'>
              Order Menu
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
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={4}>
                      <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component='div'
                        count={props.order.menuOrders.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                      />
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </CardContent>
          <CardActions>
            <Button variant='text' onClick={props.onClose} style={{ marginLeft: 'auto' }}>
              <b>Close</b>
            </Button>
          </CardActions>
        </Card>
      </Fade>
    </Modal>
  );
};

export default OrderMenuModal;
