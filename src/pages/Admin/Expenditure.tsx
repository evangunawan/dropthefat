import * as React from 'react';
import Container from '../../components/Container';
import {
  Typography,
  TextField,
  Button,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TablePagination,
  TableHead,
  TableRow,
  withStyles,
  TableCell,
  Tooltip,
  IconButton,
} from '@material-ui/core';
import { Expenditure } from '../../models/Expenditure';
import { MenuOrder } from '../../models/MenuOrder';
import { Add, List, Delete, Edit } from '@material-ui/icons';
import firebase from 'firebase';
import ExpenditureModal from '../../components/ExpenditurePage/ExpenditureModal';
import FullScreenSpinner from '../../components/FullScreenSpinner';
import { useHistory, useLocation } from 'react-router-dom';

const StyledTableCell = withStyles(() => ({
  head: {
    backgroundColor: 'gray',
    color: 'white',
    fontSize: 20,
  },
}))(TableCell);

const TableHeader = () => {
  return (
    <TableHead>
      <TableRow>
        <StyledTableCell>Date</StyledTableCell>
        <StyledTableCell>Vendor Name</StyledTableCell>
        <StyledTableCell>Total Price</StyledTableCell>
        <StyledTableCell style={{ width: 200, textAlign: 'center' }}>
          Detail
        </StyledTableCell>
      </TableRow>
    </TableHead>
  );
};

const ExpenditureList = () => {
  const history = useHistory();
  const location = useLocation();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [txtSearch, setTxtSearch] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const [expenditure, setExpenditure] = React.useState<Expenditure[]>([]);
  const [filterExpenditure, setFilterExpenditure] = React.useState([] as any[]);
  const defaultExpenditure: Expenditure = {
    time: 0,
    menuOrders: [],
    pic: '',
    vendorName: '',
    total: 0
  }
  const [selectedExpenditure, setSelectedExpenditure] = React.useState<Expenditure>(defaultExpenditure);

  const searchBarStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '20px 0px',
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

  

  const fetchExpenditure = async () => {
    const db = firebase.firestore();
    const result: Expenditure[] = [];
    setLoading(true);
    await db
      .collection('purchasement')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const listMenuOrder: MenuOrder[] = [];
          // console.log(doc.data());
          doc.data().menuOrders.forEach((item: any) => {
            const newMenuOrder: MenuOrder = {
              menu: item.material,
              quantity: item.quantity
            };
            listMenuOrder.push(newMenuOrder);
          });
          const newExpenditure: Expenditure = {
            time: doc.data().time,
            menuOrders: listMenuOrder,
            pic: doc.data().pic,
            vendorName: doc.data().vendor,
            total: doc.data().total
          };
          result.push(newExpenditure);
          // console.log(doc.data());
        });
      });
    // console.log(result);
    setExpenditure(result);
    setFilterExpenditure(result);
    setLoading(false);
  };

  const renderTableBody = (items: Expenditure[]) => {
    const result = items
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((item: Expenditure, k) => {
        return (
          <TableRow key={k}>
            <TableCell>{item.time}</TableCell>
            <TableCell>{item.vendorName}</TableCell>
            <TableCell>{item.total}</TableCell>
            <TableCell style={{ textAlign: 'center' }}>
              <Tooltip title='View Products' arrow>
                <IconButton
                  aria-label='List'
                  style={{ width: 50 }}
                  onClick={() => {
                    setSelectedExpenditure(item);
                    setModalOpen(true);
                  }}
                >
                  <List />
                </IconButton>
              </Tooltip>
              
            </TableCell>
          </TableRow>
        );
      });

    return result;
  };

  React.useEffect(() => {
    fetchExpenditure();
  }, []);

  return (
    <Container width='1000px'>
      <div style={searchBarStyle}>
        <Typography variant='h4' component='h4'>
          Expenditure
        </Typography>
      </div>
      <Paper>
        <TableContainer>
          <Table>
            <TableHeader />
            <TableBody>{renderTableBody(expenditure)}</TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10]}
          count={filterExpenditure.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <ExpenditureModal
        expenditure={selectedExpenditure}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
      <FullScreenSpinner open={loading} />
    </Container>
  );
};

export default ExpenditureList;
