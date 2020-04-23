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
import { Vendor } from '../../models/Vendor';

interface ModalProps {
  open: boolean;
  onClose(): void;
  vendorList: Vendor[];
  onTableSelect(item: Vendor): void;
  // onMenuAdd(item: DiningTable): void;
}

interface BoxProps {
  item: Vendor;
  onClick(): void;
}

const TableButton = (props: BoxProps) => {
  const getColor = () => {
      return '#ff9800';
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
      >
        {`Table ${props.item.name}`}
      </Button>
    </Grid>
  );
};

const ChangeTableModal = (props: ModalProps) => {
  const [reservations, setReservations] = React.useState<Vendor[]>([]);
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


  const renderVendorItems = (items: Vendor[] ) => {
    const filtered = items.filter((item: Vendor) => {
    });
    const result = filtered.map((item: Vendor) => {
      return (
        <TableButton
          item={item}
          onClick={() => {
            props.onTableSelect(item);
            props.onClose();
          }}
          key={item.id}
        />
      );
    });
    return result;
  };

  
  React.useEffect(() => {
    // fetchReservations();
    // eslint-disable-next-line
  }, []);

  return (
    <Modal open={props.open} onClose={props.onClose} style={modalStyle}>
      <Fade in={props.open}>
        <Card style={cardStyle}>
          <CardContent>
            <Grid container justify='space-between' alignItems='center'>
              <Typography variant='h5'>Select Vendor</Typography>
            </Grid>
            <Grid
              container
              justify='flex-start'
              spacing={3}
              style={{ margin: '16px 0px' }}
            >
              {renderVendorItems(props.vendorList)}
            </Grid>
          </CardContent>
        </Card>
      </Fade>
    </Modal>
  );
};

export default ChangeTableModal;
