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
import { Vendor } from '../../models/Vendor';
import { Product } from '../../models/Product';
import { renderCurrency } from '../../util/RenderUtil';

interface ModalProps {
  open: boolean;
  onClose(): void;
  vendor: Vendor;
}

const ProductModal = (props: ModalProps) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const { vendor } = props; // Destructuring

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

  const renderUnitType = (val: string) => {
    if (val === 'kg') return 'Kilogram (kg)';
    else if (val === 'liter') return 'Liter (cc)';
    else if (val === 'unit') return 'Unit (pcs)';
  };

  const renderTableItem = (items: Product[]) => {
    if (items.length > 0) {
      const result = items
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((item, k) => {
          return (
            <TableRow key={k}>
              <TableCell style={{ height: 40 }}>{item.name}</TableCell>
              <TableCell style={{ height: 40 }}>{renderUnitType(item.unit)}</TableCell>
              <TableCell style={{ height: 40 }}>{renderCurrency(item.price)}</TableCell>
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
            <Typography variant='h6'>Vendor Products</Typography>
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
                        Stock Unit
                      </TableCell>
                      <TableCell style={{ fontWeight: 'bold', fontSize: '15px' }}>
                        Price/unit
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>{renderTableItem(vendor.products)}</TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10]}
                count={vendor.products.length}
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
