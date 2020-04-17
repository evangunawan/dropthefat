import * as React from 'react';
import * as firebase from 'firebase';
import 'firebase/firestore';
import Container from '../../components/Container';
import {
  Typography,
  Button,
  Grid,
  TableContainer,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Paper,
  Table,
  Tooltip,
  IconButton,
  Box,
} from '@material-ui/core';
import { AddCircleOutline } from '@material-ui/icons';
import { Add } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import { Reservation } from '../../models/Reservation';
import { renderTime } from '../../util/RenderUtil';

const TableHeader = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell>
          <b>PIC</b>
        </TableCell>
        <TableCell>
          <b>Table Number</b>
        </TableCell>
        <TableCell>
          <b>Time Created</b>
        </TableCell>
        <TableCell>
          <b>Reservation Time</b>
        </TableCell>
        <TableCell>
          <b>Actions</b>
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

const ReservationPage = () => {
  const history = useHistory();
  const [reservations, setReservations] = React.useState<Reservation[]>([]);

  const fetchReservations = async () => {
    const db = firebase.firestore();
    const result: Reservation[] = [];
    await db
      .collection('reservation')
      .get()
      .then((qs) => {
        qs.forEach((doc) => {
          const temp: Reservation = {
            id: doc.id,
            pic: doc.data().pic,
            tableNumber: doc.data().tableNumber,
            createdTime: doc.data().createdTime,
            reservationTime: doc.data().reservationTime,
            guests: doc.data().guests,
          };
          result.push(temp);
        });
      });
    setReservations(result);
  };

  const renderRsvTime = (time: number) => {
    const now = Date.now();
    if (time - now < 0) {
      return <Box color='error.main'>{renderTime(time)}</Box>;
    } else if (time - now < 7200000) {
      return <Box color='warning.main'>{renderTime(time)}</Box>;
    } else {
      return <Box color='text.primary'>{renderTime(time)}</Box>;
    }
  };

  const handleCreateOrder = (item: Reservation) => {
    history.push(`/order/create/${item.id}`);
  };

  const renderTableBody = () => {
    if (reservations.length > 0) {
      const result = reservations.map((item: Reservation) => {
        return (
          <TableRow key={item.id}>
            <TableCell style={{ minWidth: 200 }}>{item.pic}</TableCell>
            <TableCell>{item.tableNumber}</TableCell>
            <TableCell>{renderTime(item.createdTime)} </TableCell>
            <TableCell>{renderRsvTime(item.reservationTime)}</TableCell>
            <TableCell>
              <Tooltip title='Create Order' arrow>
                <IconButton
                  style={{ width: 50 }}
                  onClick={() => {
                    handleCreateOrder(item);
                  }}
                >
                  <AddCircleOutline />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        );
      });
      return result;
    } else {
      return (
        <TableRow>
          <TableCell colSpan={4}>Empty</TableCell>
        </TableRow>
      );
    }
  };

  React.useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <Container width='800px' style={{ margin: '0px auto' }}>
      <Grid container direction='column' justify='flex-start' spacing={3}>
        <Grid item>
          <Grid container justify='space-between' alignItems='center'>
            <div>
              <Typography variant='h4' component='h2'>
                Reservations
              </Typography>
              <Typography variant='body2' component='span'>
                Here is the list of restaurant reservations.
              </Typography>
            </div>
            <Button
              variant='contained'
              startIcon={<Add />}
              color='primary'
              onClick={() => {
                history.push('/reservations/create');
              }}
            >
              NEW RESERVATION
            </Button>
          </Grid>
        </Grid>
        <Grid item>
          <Paper>
            <TableContainer>
              <Table size='small'>
                <TableHeader />
                <TableBody>{renderTableBody()}</TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ReservationPage;
