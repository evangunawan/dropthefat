import * as React from 'react';
import * as firebase from 'firebase';
import 'firebase/firestore';
import {
  Modal,
  Fade,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
} from '@material-ui/core';
import { DiningTable } from '../../models/DiningTable';
import { Reservation } from '../../models/Reservation';

interface ModalProps {
  open: boolean;
  onClose(): void;
  tableList: DiningTable[];
  guests: number;
  onTableSelect(item: DiningTable): void;
  // onMenuAdd(item: DiningTable): void;
}

interface BoxProps {
  item: DiningTable;
  rsvTime: number;
  onClick(): void;
}

const TableButton = (props: BoxProps) => {
  const getColor = () => {
    if (props.item.status === 'unavailable') return '#616161';
    else if (props.item.status === 'dining') return '$1976d2';
    else if (props.item.status === 'reserved') {
      if (props.rsvTime > 7200000) return '#4caf50';
      else return '#ff9800';
    } else return '#4caf50';
  };

  const isTableDisabled = () => {
    return props.item.status === 'unavailable' || props.item.status === 'dining';
  };

  const style: React.CSSProperties = {
    height: 100,
    backgroundColor: getColor() || '#fff',
    color: '#fff',
  };

  return (
    <Grid item xs={3}>
      <Button
        disableRipple
        fullWidth
        variant='contained'
        style={style}
        onClick={props.onClick}
        disabled={isTableDisabled()}
      >
        {`Table ${props.item.tableNumber}`}
      </Button>
    </Grid>
  );
};

const ChangeTableModal = (props: ModalProps) => {
  const [reservations, setReservations] = React.useState<Reservation[]>([]);
  const modalStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const cardStyle: React.CSSProperties = {
    outline: 0,
    padding: '8px',
    width: 700,
  };

  const getTableType = (guestCount: number) => {
    if (guestCount < 5) return 'small';
    else if (guestCount < 7) return 'medium';
    else return 'large';
  };

  const renderTableItems = (items: DiningTable[], guests: number) => {
    const filtered = items.filter((item: DiningTable) => {
      return item.type === getTableType(guests);
    });
    const result = filtered.map((item: DiningTable) => {
      const rsvTime =
        reservations.find((rsv) => rsv.tableNumber === item.tableNumber)
          ?.reservationTime || 0;
      return (
        <TableButton
          item={item}
          onClick={() => {
            props.onTableSelect(item);
            props.onClose();
          }}
          rsvTime={rsvTime}
          key={item.id}
        />
      );
    });
    return result;
  };

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

  React.useEffect(() => {
    fetchReservations();
    // eslint-disable-next-line
  }, []);

  return (
    <Modal open={props.open} onClose={props.onClose} style={modalStyle}>
      <Fade in={props.open}>
        <Card style={cardStyle}>
          <CardContent>
            <Grid container justify='space-between' alignItems='center'>
              <Typography variant='h5'>Select Table</Typography>
              <Typography variant='body2'>{`Guest: ${
                props.guests
              } person, Table type: ${getTableType(props.guests)}`}</Typography>
            </Grid>
            <Grid
              container
              justify='flex-start'
              spacing={3}
              style={{ margin: '16px 0px' }}
            >
              {renderTableItems(props.tableList, props.guests)}
            </Grid>
            <div>
              <Typography variant='body2' color='textSecondary'>
                <i>
                  *Green: Available, Blue: Dining/Active, Orange: Reserved under 2 hours,
                  Grey: Unavailable
                </i>
              </Typography>
            </div>
          </CardContent>
        </Card>
      </Fade>
    </Modal>
  );
};

export default ChangeTableModal;
