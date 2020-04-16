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
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import { Reservation } from '../../models/Reservation';
import { renderTime } from '../../util/RenderUtil';

const TableHeader = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell>PIC</TableCell>
        <TableCell>Time Created</TableCell>
        <TableCell>Reservation Time</TableCell>
        <TableCell>Actions</TableCell>
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
            createdTime: doc.data().createdTime,
            reservationTime: doc.data().reservationTime,
          };
          result.push(temp);
        });
      });
    setReservations(result);
  };
  const renderTableBody = () => {
    if (reservations.length > 0) {
      const result = reservations.map((item: Reservation) => {
        return (
          <TableRow key={item.id}>
            <TableCell>{item.pic}</TableCell>
            <TableCell>{renderTime(item.createdTime)} </TableCell>
            <TableCell>{renderTime(item.reservationTime)}</TableCell>
            <TableCell>actions</TableCell>
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
    <Container width='80%' style={{ margin: '0px auto' }}>
      <Grid container direction='column' justify='flex-start' spacing={3}>
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
        <Grid item>
          <Paper>
            <TableContainer>
              <Table>
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
