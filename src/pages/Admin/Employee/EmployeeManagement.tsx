import * as React from 'react';
import * as firebase from 'firebase';
import 'firebase/firestore';
import Container from '../../../components/Container';
import {
  Typography,
  TextField,
  Button,
  TableContainer,
  Paper,
  Table,
  TableBody,
  withStyles,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  IconButton,
  TablePagination,
} from '@material-ui/core';
import { Add, Visibility, Edit, Delete } from '@material-ui/icons';
import { useHistory, useLocation } from 'react-router-dom';
import { Employee } from '../../../models/Employee';
import EmployeeModal from '../../../components/EmployeePage/EmployeeModal';
import FullScreenSpinner from '../../../components/FullScreenSpinner';

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
        <StyledTableCell style={{ width: 250 }}>Employee Name</StyledTableCell>
        <StyledTableCell style={{ width: 280 }}>Address</StyledTableCell>
        <StyledTableCell style={{ width: 250 }}>Contact Number</StyledTableCell>
        <StyledTableCell>Role</StyledTableCell>
        <StyledTableCell style={{ width: 200, textAlign: 'center' }}>
          Action
        </StyledTableCell>
      </TableRow>
    </TableHead>
  );
};

const EmployeeManagement = () => {
  const history = useHistory();
  const location = useLocation();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [txtSearch, setTxtSearch] = React.useState('');
  const [employee, setEmployee] = React.useState<Employee[]>([]);
  const [filterEmployee, setFilterEmployee] = React.useState([] as any[]);
  const defaultEmployee: Employee = {
    id: '',
    name: '',
    address: '',
    contact: '',
    role: 'unknown',
    username: '',
    password: '',
  };
  const [selectedEmployee, setSelectedEmployee] = React.useState<Employee>(
    defaultEmployee
  );
  const [loading, setLoading] = React.useState(false);

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

  const handleSearchEmployee = (ev: any) => {
    setTxtSearch(ev.target.value);
    const temp = employee.filter((item: any) =>
      item.name.toLowerCase().includes(ev.target.value.toLowerCase())
    );
    setFilterEmployee(temp);
  };

  const renderEmployeeRole = (item: string) => {
    if (item === 'cashier') return 'Cashier';
    else if (item === 'waiter') return 'Waiter';
    else if (item === 'waitress') return 'Waitress';
  };

  const fetchEmployee = async () => {
    const db = firebase.firestore();
    const result: Employee[] = [];
    setLoading(true);
    await db
      .collection('employees')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const newEmployee: Employee = {
            id: doc.id,
            name: doc.data().name,
            address: doc.data().address,
            contact: doc.data().contact,
            role: doc.data().role,
            username: doc.data().username,
            password: doc.data().password,
          };

          result.push(newEmployee);
        });
      });
    setEmployee(result);
    setFilterEmployee(result);
    setLoading(false);
  };

  const handleUpdateEmployee = (item: Employee) => {
    history.push(`/admin/employees/update/${item.id}`);
  };

  const handleDeleteEmployee = async (item: Employee) => {
    const res = window.confirm(`Are you sure want to delete employee ${item.name}?`);
    if (res === true) {
      setLoading(true);
      const db = firebase.firestore();
      await db
        .collection('employees')
        .doc(item.id)
        .delete();
      setLoading(false);
      fetchEmployee();
    }
  };

  const renderTableBody = (items: Employee[]) => {
    const result = items
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((item: Employee, k) => {
        return (
          <TableRow key={k}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.address}</TableCell>
            <TableCell>{item.contact}</TableCell>
            <TableCell>{renderEmployeeRole(item.role)}</TableCell>
            <TableCell style={{ textAlign: 'center' }}>
              <Tooltip title='View Account' arrow>
                <IconButton
                  aria-label='Visibility'
                  style={{ width: 50 }}
                  onClick={() => {
                    setSelectedEmployee(item);
                    setModalOpen(true);
                  }}
                >
                  <Visibility />
                </IconButton>
              </Tooltip>
              |
              <Tooltip title='Edit Employee' arrow>
                <IconButton
                  aria-label='Edit'
                  style={{ width: 50 }}
                  onClick={() => {
                    handleUpdateEmployee(item);
                  }}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              |
              <Tooltip title='Delete Employee' arrow>
                <IconButton
                  aria-label='Delete'
                  style={{ width: 50 }}
                  onClick={() => {
                    handleDeleteEmployee(item);
                  }}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        );
      });

    return result;
  };

  React.useEffect(() => {
    fetchEmployee();
  }, []);

  return (
    <Container width='1150px'>
      <div style={searchBarStyle}>
        <Typography variant='h4' component='h4'>
          Employee Management
        </Typography>
        <form>
          <TextField
            label='Search Employee'
            variant='outlined'
            value={txtSearch}
            onChange={(ev) => handleSearchEmployee(ev)}
          />
          <Button
            variant='contained'
            startIcon={<Add />}
            color='primary'
            style={{ height: 55, marginLeft: 20 }}
            onClick={() => {
              history.push(`${location.pathname}/create`);
            }}
          >
            Add New Employee
          </Button>
        </form>
      </div>
      <Paper>
        <TableContainer>
          <Table>
            <TableHeader />
            <TableBody>{renderTableBody(filterEmployee)}</TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10]}
          count={filterEmployee.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <EmployeeModal
        employee={selectedEmployee}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
      <FullScreenSpinner open={loading} />
    </Container>
  );
};

export default EmployeeManagement;
