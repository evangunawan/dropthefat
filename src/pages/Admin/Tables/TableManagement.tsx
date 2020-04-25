import * as React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import Container from '../../../components/Container';
import {
  Paper,
  Grid,
  Button,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@material-ui/core';
import { DiningTable } from '../../../models/DiningTable';
import TableItemModal from './TableItemModal';
import { Reservation } from '../../../models/Reservation';
interface BoxProps {
  item: DiningTable;
  rsvTime: number;
  onClick(): void;
}

const ItemButton = (props: BoxProps) => {
  const getColor = () => {
    if (props.item.status === 'unavailable') return '#616161';
    else if (props.item.status === 'dining') return '#1976d2';
    else if (props.item.status === 'reserved') {
      if (props.rsvTime === 0) return '#4caf50';
      else return '#ff9800';
    } else return '#4caf50';
  };

  const style: React.CSSProperties = {
    height: 100,
    width: 150,
    backgroundColor: getColor() || '#fff',
    color: '#fff',
  };

  return (
    <Grid item>
      <Button fullWidth variant='contained' style={style} onClick={props.onClick}>
        {`Table ${props.item.tableNumber}`}
      </Button>
    </Grid>
  );
};

const TableManagement = () => {
  const [tableList, setTableList] = React.useState<DiningTable[]>([]);
  const [reservations, setReservations] = React.useState<Reservation[]>([]);
  const [filteredList, setFilteredList] = React.useState<DiningTable[]>([]);
  const defaultTable: DiningTable = {
    status: 'available',
    tableNumber: 0,
    type: 'unknown',
  };
  const [modalItem, setModalItem] = React.useState<DiningTable>(defaultTable);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectOpen, setSelectOpen] = React.useState(false);
  const [selectedFilter, setSelectedFilter] = React.useState('all');

  const fetchReservations = async () => {
    console.log('fetching reservations...');
    const db = firebase.firestore();
    db.collection('reservation')
      .get()
      .then((qs) => {
        qs.forEach((doc) => {
          const newRsv: Reservation = {
            id: doc.id,
            guests: doc.data().guests,
            createdTime: doc.data().createdTime,
            reservationTime: doc.data().reservationTime,
            pic: doc.data().pic,
            tableNumber: doc.data().tableNumber,
          };
          const temp = [...reservations];
          temp.push(newRsv);
          setReservations(temp);
        });
      });
  };

  const fetchTables = async () => {
    const db = firebase.firestore();
    const result: DiningTable[] = [];
    await db
      .collection('table')
      .get()
      .then((qS) => {
        qS.forEach((doc) => {
          const temp: DiningTable = {
            id: doc.id,
            status: doc.data().status,
            tableNumber: doc.data().tableNumber,
            type: doc.data().type || 'unknown',
          };
          result.push(temp);
        });
      });
    result.sort((a, b) =>
      a.tableNumber < b.tableNumber ? -1 : b.tableNumber < a.tableNumber ? 1 : 0
    );
    setTableList(result);
    setFilteredList(result);
  };

  const handleOpenModal = (item: DiningTable) => {
    setModalItem(item);
    setModalOpen(true);
  };

  const renderTableList = () => {
    const result = filteredList.map((item: DiningTable) => {
      const rsvTime =
        reservations.find(
          (rsv) =>
            rsv.reservationTime - Date.now() < 7200000 &&
            rsv.tableNumber === item.tableNumber
        )?.reservationTime || 0;
      return (
        <ItemButton
          key={item.id}
          item={item}
          onClick={() => handleOpenModal(item)}
          rsvTime={rsvTime}
        />
      );
    });
    return result;
  };

  const handleFilterChange = (ev: any) => {
    setSelectedFilter(ev.target.value);
    if (ev.target.value !== 'all') {
      const temp = tableList.filter((item: DiningTable) => {
        return item.status === ev.target.value;
      });
      setFilteredList(temp);
    } else {
      setFilteredList(tableList);
    }
  };

  React.useEffect(() => {
    fetchTables();
    fetchReservations();
  }, []);

  return (
    <Container width='80%'>
      <Grid container direction='column' justify='flex-start' spacing={2}>
        <Grid
          container
          direction='row'
          justify='space-between'
          alignItems='center'
          style={{ margin: '16px 0px' }}
        >
          <Grid item>
            <Typography variant='h4' component='h2'>
              Table Management
            </Typography>
            <Typography variant='body2' component='span'>
              You can manage restaurant tables here.
            </Typography>
          </Grid>
          <Grid item>
            <Button variant='contained' color='primary'>
              ADD TABLE
            </Button>
          </Grid>
        </Grid>
        <Grid item>
          <Paper elevation={1} style={{ margin: '16px 0px' }}>
            <FormControl style={{ margin: '16px 32px' }}>
              <InputLabel id='filter-select'>Filter List</InputLabel>
              <Select
                open={selectOpen}
                onClose={() => setSelectOpen(false)}
                onOpen={() => setSelectOpen(true)}
                labelId='filter-select'
                style={{ width: 200 }}
                value={selectedFilter}
                onChange={(ev) => handleFilterChange(ev)}
              >
                <MenuItem value='all'>All</MenuItem>
                <MenuItem value='available'>Available</MenuItem>
                <MenuItem value='dining'>Dining</MenuItem>
                <MenuItem value='reserved'>Reserved</MenuItem>
                <MenuItem value='unavailable'>Unavailable</MenuItem>
              </Select>
            </FormControl>
            <Grid
              container
              direction='row'
              justify='flex-start'
              wrap='wrap'
              spacing={3}
              style={{ padding: 32 }}
            >
              {renderTableList()}
            </Grid>
          </Paper>
          <Typography variant='body2' component='span' color='textSecondary'>
            *Reserved table will be shown Orange when there is a reservation under 2
            hours.
          </Typography>
        </Grid>
      </Grid>
      <TableItemModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        item={modalItem}
      />
    </Container>
  );
};

export default TableManagement;
