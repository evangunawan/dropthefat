import * as React from 'react';
import { Employee } from '../../models/Employee';
import {
  Modal,
  Fade,
  Card,
  CardContent,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@material-ui/core';

interface ModalProps {
  open: boolean;
  onClose(): void;
  employee: Employee;
}

const EmployeeModal = (props: ModalProps) => {
  const { employee } = props;

  const modalStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const cardStyle: React.CSSProperties = {
    outline: 0,
    padding: '8px',
    width: 400,
  };

  const renderEmployeeRole = (item: string) => {
    if (item === 'cashier') return 'Cashier';
    else if (item === 'waiter') return 'Waiter';
    else if (item === 'waitress') return 'Waitress';
  };

  const renderTableContent = () => {
    return (
      <TableContainer style={{ padding: '25px 10px' }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <b>Employee Name</b>
              </TableCell>
              <TableCell>{employee.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <b>Role</b>
              </TableCell>
              <TableCell>{renderEmployeeRole(employee.role)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <b>Username</b>
              </TableCell>
              <TableCell>{employee.username}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <b>Password</b>
              </TableCell>
              <TableCell>{employee.password}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Modal open={props.open} onClose={props.onClose} style={modalStyle}>
      <Fade in={props.open}>
        <Card style={cardStyle}>
          <CardContent>
            <Typography variant='h5' style={{ textAlign: 'center' }}>
              Account Details
            </Typography>
            {renderTableContent()}
          </CardContent>
        </Card>
      </Fade>
    </Modal>
  );
};

export default EmployeeModal;
