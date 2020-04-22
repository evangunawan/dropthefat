import * as React from 'react';
import { Product } from '../../models/Product';
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
  Button
} from '@material-ui/core';
import { List } from '@material-ui/icons';
import OrderMenuModal from '../OrderPage/OrderMenuModal';
import { renderCurrency, renderTime } from '../../util/RenderUtil';
import {
   useHistory
  } from "react-router-dom";


interface TableProps {
  items: Product[];
}

const TableHeader = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell>Name</TableCell>
        <TableCell>Harga</TableCell>
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>
  );
};

const PaymentTable = (props: TableProps) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [modalOpen, setModalOpen] = React.useState(false);

  const defaultMaterial: Product = {
    name: 'null',
    unit : 'unit',
    price: 0
  };
  const [modalItem, setModalItem] = React.useState<Product>(defaultMaterial);

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

  const showMaterialModal = (item: Product) => {
    setModalOpen(true);
    setModalItem(item);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const history = useHistory();
  // const payOrder = () =>{
  //   history.push('/payment/checkout');
  // };

  const renderTableBody = (items: Product[]) => {
    const tableBody = items.map((item: Product, k) => {
      return (
        <TableRow key={k}>
          <TableCell>{item.name}</TableCell>
          <TableCell>{renderCurrency(item.price)}</TableCell>
          <TableCell>
          <Button
          variant='contained'
          color='primary'
          // onClick={payOrder}
            >
            <b>Buy</b>
            </Button>
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
    </TableContainer>
  );
};

export default PaymentTable;
