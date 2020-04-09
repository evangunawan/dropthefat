import * as React from 'react';
import {
  Modal,
  Fade,
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
} from '@material-ui/core';
import { DiningTable } from '../../models/DiningTable';

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
  onClick(): void;
}

const TableButton = (props: BoxProps) => {
  const getColor = () => {
    if (props.item.status === 'available') return '#4caf50';
    else if (props.item.status === 'dining') return '#1976d2';
    else if (props.item.status === 'reserved') return '#ff9800';
    else return '#616161';
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
                  *Green: Available, Blue: Dining/Active, Orange: Reserved, Grey:
                  Unavailable
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
