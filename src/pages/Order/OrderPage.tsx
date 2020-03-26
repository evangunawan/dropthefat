import * as React from 'react';
import Container from '../../components/Container';
import { Card, CardContent, CardActions, Button, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

const OrderPage = () => {
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
  };

  const history = useHistory();

  //TODO: Create an expression if order is empty or not.
  //We need to create an order object/class, and connect it to firebase.
  return (
    <Container style={containerStyle}>
      <Card style={{ maxWidth: 300 }}>
        <CardContent>
          <Typography gutterBottom variant='h5' component='h2'>
            Restaurant Orders
          </Typography>
          <Typography variant='body2' color='textSecondary' component='p'>
            Food and menu order from customers. Currently empty, no available orders. You
            can add an order item using the button below.
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            size='small'
            color='primary'
            style={{ fontWeight: 'bold', marginLeft: 'auto' }}
            onClick={() => {
              history.push('/order/create');
            }}
          >
            Create
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
};

export default OrderPage;
