import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { Card, CardContent, Typography, CardActions, Button } from '@material-ui/core';
import Container from '../Container';
const EmptyOrderCard = () => {
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
  };
  const history = useHistory();
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

export default EmptyOrderCard;
