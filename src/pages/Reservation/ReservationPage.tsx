import * as React from 'react';
import Container from '../../components/Container';
import { Typography, Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';

const ReservationPage = () => {
  const history = useHistory();
  return (
    <Container width='80%' style={{ margin: '0px auto' }}>
      <div
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
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
      </div>
    </Container>
  );
};

export default ReservationPage;
