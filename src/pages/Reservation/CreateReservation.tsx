import * as React from 'react';
import Container from '../../components/Container';
import { Typography, TextField } from '@material-ui/core';

const CreateReservation = () => {
  const [pic, setPic] = React.useState('');

  const formStyle: React.CSSProperties = {
    margin: '24px 0px',
  };

  return (
    <Container width='80%'>
      <div style={{ flexGrow: 1 }}>
        <Typography variant='h5'>Create a Reservation</Typography>
        <Typography variant='body2' color='textSecondary' component='p'>
          Create a reservation entry by filling the form below.
        </Typography>
      </div>
      <div>
        <form style={formStyle}>
          <TextField
            fullWidth
            label='Person in charge'
            variant='outlined'
            value={pic}
            onChange={(ev) => setPic(ev.target.value)}
          />
        </form>
      </div>
    </Container>
  );
};

export default CreateReservation;
