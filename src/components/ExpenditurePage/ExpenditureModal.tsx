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
  TablePagination,
  Paper,
} from '@material-ui/core';
// import { Vendor } from '../../models/Vendor';
// import { Product } from '../../models/Product';
// import { renderCurrency } from '../../util/RenderUtil';
import { MenuOrder } from '../../models/MenuOrder';
import { Expenditure } from '../../models/Expenditure';

interface ModalProps {
  open: boolean;
  onClose(): void;
  expenditure: Expenditure;
}

const ProductModal = (props: ModalProps) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const { expenditure } = props; // Destructuring

  const placeholderStyle = {
    margin: '0 auto',
    padding: '16px',
  };

  const modalStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const cardStyle: React.CSSProperties = {
    outline: 0,
    padding: '8px',
    width: 500,
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

  // const renderUnitType = (val: string) => {
  //   if (val === 'kg') return 'Kilogram (kg)';
  //   else if (val === 'liter') return 'Liter (cc)';
  //   else if (val === 'unit') return 'Unit (pcs)';
  // };

  const renderTableItem = (items: any[]) => {
    if (items.length > 0) {
      const result = items
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((item, k) => {
          return (
            <TableRow key={k}>
              <TableCell style={{ height: 40 }}>{item.menu}</TableCell>
              <TableCell style={{ height: 40 }}>{item.quantity}</TableCell>
            </TableRow>
          );
        });
      return result;
    } else {
      return (
        <TableRow style={placeholderStyle}>
          <TableCell colSpan={3}>
            <Typography align='center' variant='body2' color='textSecondary'>
              <i>No product for this vendor</i>
            </Typography>
          </TableCell>
        </TableRow>
      );
    }
  };

  return (
    <Modal open={props.open} onClose={props.onClose} style={modalStyle}>
      <Fade in={props.open}>
        <Card style={cardStyle}>
          <CardContent>
            <Typography variant='h6'>Ingredients</Typography>
            <br />
            <Paper>
              <TableContainer>
                <Table size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ fontWeight: 'bold', fontSize: '15px' }}>
                        Name
                      </TableCell>
                      <TableCell style={{ fontWeight: 'bold', fontSize: '15px' }}>
                        Quantity
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>{renderTableItem(expenditure.menuOrders)}</TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10]}
                count={expenditure.menuOrders.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </Paper>
          </CardContent>
        </Card>
      </Fade>
    </Modal>
  );
};

export default ProductModal;
