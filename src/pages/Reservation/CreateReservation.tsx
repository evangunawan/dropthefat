import * as React from 'react';
import Container from '../../components/Container';
import { Typography, TextField, Grid, Button } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {
  KeyboardDatePicker,
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { useHistory } from 'react-router-dom';

const CreateReservation = () => {
  const [pic, setPic] = React.useState('');
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(new Date());
  const history = useHistory();

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const formStyle: React.CSSProperties = {
    margin: '24px 0px',
  };

  const btnGroupStyle: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
  };

  return (
    <Container width='800px' minWidth='800px'>
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
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify='space-between'>
              <KeyboardDatePicker
                label='Pick Date'
                format='dd MMMM yyyy'
                style={{ flexGrow: 1, margin: 16 }}
                value={selectedDate}
                onChange={handleDateChange}
              />
              <KeyboardTimePicker
                label='Pick Time'
                style={{ flexGrow: 1, margin: 16 }}
                value={selectedDate}
                onChange={handleDateChange}
              />
            </Grid>
          </MuiPickersUtilsProvider>
          {/* TODO: ADD TABLE SELECTION! */}
        </form>
      </div>
      <div style={btnGroupStyle}>
        <Button
          variant='text'
          color='default'
          style={{ marginRight: 8 }}
          onClick={() => {
            history.push('/reservations');
          }}
        >
          <b>Cancel</b>
        </Button>
        <Button variant='contained' color='primary' disabled={false}>
          <b>Create</b>
        </Button>
      </div>
    </Container>
  );
};

export default CreateReservation;
