import * as React from 'react';
import { Order } from '../../models/Order';
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  TablePagination,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import { List } from '@material-ui/icons';
import OrderMenuModal from './OrderMenuModal';
import { renderCurrency, renderTime } from '../../util/RenderUtil';

interface TableProps {
  items: Order[];
}

const TableHeader = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell>Time</TableCell>
        <TableCell>PIC</TableCell>
        <TableCell>Items</TableCell>
        <TableCell>Total</TableCell>
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>
  );
};

const OrderTable = (props: TableProps) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [modalOpen, setModalOpen] = React.useState(false);

  const defaultOrder: Order = {
    id: 'undefined',
    menuOrders: [],
    pic: 'null',
    time: 0,
    total: 0,
  };
  const [modalItem, setModalItem] = React.useState<Order>(defaultOrder);

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

  const showMenuModal = (item: Order) => {
    setModalOpen(true);
    setModalItem(item);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const renderTableBody = (items: Order[]) => {
    const tableBody = items.map((item: Order, k) => {
      return (
        <TableRow key={k}>
          <TableCell>{renderTime(item.time)}</TableCell>
          <TableCell>{item.pic}</TableCell>
          <TableCell>{item.menuOrders.length}</TableCell>
          <TableCell>{renderCurrency(item.total)}</TableCell>
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
          </TableCell>
        </TableRow>
      );
    });

    return tableBody;
  };

  return (
    <TableContainer component={Paper} style={{ marginTop: 24 }}>
      <Table>
        <TableHeader />
        <TableBody>{renderTableBody(props.items)}</TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={props.items.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: { 'aria-label': 'rows per page' },
                native: true,
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </TableRow>
        </TableFooter>
      </Table>
      <OrderMenuModal
        open={modalOpen}
        order={modalItem}
        onClose={() => {
          handleCloseModal();
        }}
      />
    </TableContainer>
  );
};

export default OrderTable;
