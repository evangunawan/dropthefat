import * as React from 'react';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { Order } from '../../models/Order';
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  IconButton,
  Tooltip,
  Box,
} from '@material-ui/core';
import { List, Payment, History } from '@material-ui/icons';
import OrderMenuModal from './OrderMenuModal';
import { renderCurrency, renderTime } from '../../util/RenderUtil';
import PaymentModal from './PaymentModal';
import FullScreenSpinner from '../FullScreenSpinner';
import TransactionModal from './TransactionModal';

interface TableProps {
  items: Order[];
  onRefreshItems(): void;
}

const TableHeader = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell>Time</TableCell>
        <TableCell>PIC</TableCell>
        <TableCell>Items</TableCell>
        <TableCell>Total</TableCell>
        <TableCell>Status</TableCell>
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>
  );
};

const OrderTable = (props: TableProps) => {
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(0);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = React.useState(false);
  const [transactionModal, setTransactionModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const defaultOrder: Order = {
    id: 'undefined',
    menuOrders: [],
    pic: 'null',
    time: 0,
    status: 'undefined',
    guests: 0,
    total: 0,
  };
  //ModalItem is current item selected to fill the modals.
  const [modalItem, setModalItem] = React.useState<Order>(defaultOrder);

  const showMenuModal = (item: Order) => {
    setModalOpen(true);
    setModalItem(item);
  };

  const showPaymentModal = (item: Order) => {
    setPaymentModalOpen(true);
    setModalItem(item);
  };

  const showTransactionModal = (item: Order) => {
    setTransactionModal(true);
    setModalItem(item);
  };

  const handleChangePage = (event: unknown | null, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handlePaymentSubmit = async (code: string) => {
    const db = firebase.firestore();
    setLoading(true);

    //Update the order document status to completed
    console.log('Updating Order ' + modalItem.id);
    await db
      .collection('order')
      .doc(modalItem.id)
      .update({
        status: 'completed',
      })
      .catch((err) => console.log(err));

    //Update the table, set it available.
    console.log('Updating Table ' + modalItem.tableNumber);
    await db
      .collection('table')
      .where('tableNumber', '==', modalItem.tableNumber || 0)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.update({
            status: 'available',
          });
        });
      });

    //Now, lets record the transaction!
    await db.collection('transaction').add({
      order: modalItem.id,
      promoCode: code,
    });

    setLoading(false);
    props.onRefreshItems();
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const renderTableBody = (items: Order[]) => {
    const tableBody = items
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((item: Order, k) => {
        return (
          <TableRow hover tabIndex={-1} key={item.id}>
            <TableCell>{renderTime(item.time)}</TableCell>
            <TableCell>{item.pic}</TableCell>
            <TableCell>{item.menuOrders.length}</TableCell>
            <TableCell>{renderCurrency(item.total)}</TableCell>
            <TableCell>
              {item.status === 'active' ? (
                <Box color='success.main'>Active</Box>
              ) : (
                <Box color='text.secondary'>Completed</Box>
              )}
            </TableCell>
            <TableCell>
              <Tooltip title='View Details' arrow>
                <IconButton
                  aria-label='List'
                  style={{ width: 50 }}
                  onClick={() => {
                    showMenuModal(item);
                  }}
                >
                  <List />
                </IconButton>
              </Tooltip>
              {item.status === 'active' ? (
                <Tooltip title='Make Payment' arrow>
                  <IconButton
                    style={{ width: 50 }}
                    onClick={() => {
                      showPaymentModal(item);
                    }}
                  >
                    <Payment />
                  </IconButton>
                </Tooltip>
              ) : null}
              {item.status === 'completed' ? (
                <Tooltip title='View Transaction' arrow>
                  <IconButton
                    style={{ width: 50 }}
                    onClick={() => {
                      showTransactionModal(item);
                    }}
                  >
                    <History />
                  </IconButton>
                </Tooltip>
              ) : null}
            </TableCell>
          </TableRow>
        );
      });

    return tableBody;
  };

  return (
    <div>
      <Paper>
        <TableContainer style={{ marginTop: 24 }}>
          <Table>
            <TableHeader />
            <TableBody>{renderTableBody(props.items)}</TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10]}
          component='div'
          count={props.items.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <FullScreenSpinner open={loading} />
      <OrderMenuModal
        open={modalOpen}
        order={modalItem}
        onClose={() => {
          handleCloseModal();
        }}
      />
      <PaymentModal
        open={paymentModalOpen}
        order={modalItem}
        onClose={() => setPaymentModalOpen(false)}
        onSubmit={(code) => {
          handlePaymentSubmit(code);
        }}
      />
      <TransactionModal
        open={transactionModal}
        order={modalItem}
        onClose={() => setTransactionModal(false)}
      />
    </div>
  );
};

export default OrderTable;
