import * as React from 'react';
import * as firebase from 'firebase';
import 'firebase/firestore';
import Container from '../../components/Container';
import { Typography, TextField, Grid, Button, Box } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {
  KeyboardDatePicker,
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { useHistory } from 'react-router-dom';
import { DiningTable } from '../../models/DiningTable';
import ChangeTableModal from '../../components/OrderPage/ChangeTableModal';
import FullScreenSpinner from '../../components/FullScreenSpinner';
import VerificationModal from '../../components/VerificationModal';

const CreateReservation = () => {
  const [pic, setPic] = React.useState('');
  const [guests, setGuests] = React.useState(0);
  const [tableList, setTableList] = React.useState<DiningTable[]>([]);
  const [selectedTable, setSelectedTable] = React.useState<DiningTable>({
    tableNumber: 0,
    status: 'available',
    type: 'small',
  } as DiningTable);
  const [tableMessage, setTableMessage] = React.useState('');
  const [tableModalOpen, setTableModalOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(new Date());
  const [verifModalOpen, setVerifModalOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const history = useHistory();

  const formStyle: React.CSSProperties = {
    margin: '24px 0px',
  };

  const btnGroupStyle: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
  };

  async function fetchTables() {
    const result: DiningTable[] = [];
    const db = firebase.firestore();
    await db
      .collection('table')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const newTable: DiningTable = {
            id: doc.id,
            tableNumber: data.tableNumber,
            status: data.status,
            type: data.type,
          };
          result.push(newTable);
        });
      });
    setTableList(result);
  }

  const getTableType = (guestCount: number) => {
    if (guestCount < 5) return 'small';
    else if (guestCount < 7) return 'medium';
    else return 'large';
  };

  const generateSelectedTable = (guestCount: number) => {
    const selectedSize = getTableType(guestCount);

    tableList.some((item: DiningTable) => {
      if (item.status !== 'unavailable' && item.status !== 'dining') {
        if (item.type === selectedSize) {
          setSelectedTable(item);
          setTableMessage('');
          return true;
        }
      }
      setTableMessage(`No available table at the moment with size ${selectedSize}`);
      setSelectedTable({
        status: 'unavailable',
        type: 'unknown',
        tableNumber: 0,
      });
      return false;
    });
  };

  const createReservation = async () => {
    setLoading(true);
    const db = firebase.firestore();
    await db.collection('reservation').add({
      reservationTime: selectedDate?.getTime(),
      createdTime: Date.now(),
      pic: pic,
      guests: guests,
      tableNumber: selectedTable.tableNumber,
    });

    await db
      .collection('table')
      .doc(selectedTable.id)
      .update({
        status: 'reserved',
      });

    setLoading(false);
    history.push('/reservations');
  };

  const handleGuestChange = (ev: any) => {
    const guestCount = parseInt(ev.target.value);

    setGuests(guestCount || 0);
    generateSelectedTable(guestCount || 0);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  React.useEffect(() => {
    fetchTables();
    // eslint-disable-next-line
  }, []);

  // React.useEffect(()=>{
  //   console.log(selectedDate?.getTime());
  // }, [selectedDate])

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
          <Grid container justify='flex-start' direction='column' spacing={3}>
            <Grid item>
              <TextField
                fullWidth
                label='Person in charge'
                variant='outlined'
                value={pic}
                onChange={(ev) => setPic(ev.target.value)}
              />
            </Grid>
            <Grid item>
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
            </Grid>
            <Grid item>
              <Grid container direction='row' justify='space-between' alignItems='center'>
                <Grid item>
                  <TextField
                    fullWidth
                    type='number'
                    label='Guests (person)'
                    variant='outlined'
                    value={guests}
                    onChange={(ev) => handleGuestChange(ev)}
                  />
                </Grid>

                <Grid item>
                  <Grid container justify='flex-end' alignItems='center'>
                    <div style={{ margin: '0px 32px' }}>
                      <Typography variant='h6'>Table Selected</Typography>
                      <Typography variant='body2' color='textSecondary'>
                        Size: {selectedTable.type}
                      </Typography>
                    </div>
                    <div style={{ marginRight: 32 }}>
                      <Typography variant='h6'>{selectedTable.tableNumber}</Typography>
                    </div>
                    <Button
                      disableRipple
                      variant='contained'
                      color='primary'
                      onClick={() => setTableModalOpen(true)}
                    >
                      Change...
                    </Button>
                  </Grid>
                  <Box color='warning.main' fontSize='0.9em'>
                    {tableMessage}
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
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
        <Button
          variant='contained'
          color='primary'
          disabled={false}
          onClick={() => setVerifModalOpen(true)}
        >
          <b>Create</b>
        </Button>
      </div>
      <ChangeTableModal
        open={tableModalOpen}
        tableList={tableList}
        guests={guests}
        onClose={() => setTableModalOpen(false)}
        onTableSelect={(item: DiningTable) => setSelectedTable(item)}
      />
      <FullScreenSpinner open={loading} />
      <VerificationModal
        open={verifModalOpen}
        onClose={() => setVerifModalOpen(false)}
        roleType={['waiter', 'waitress']}
        onSuccess={() => {
          setVerifModalOpen(false);
          createReservation();
        }}
      />
    </Container>
  );
};

export default CreateReservation;
