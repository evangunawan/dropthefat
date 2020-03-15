import * as React from 'react';
import Container from '../../components/Container';
import { TextField, Typography } from '@material-ui/core';

const CreateOrder = () => {
  const formStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '16px 0',
  };

  return (
    <Container width='1000px'>
      <Typography variant='h5' component='h2'>
        Create an Order
      </Typography>
      <Typography variant='body2' color='textSecondary' component='p'>
        Create an order entry by selecting menu and data below.
      </Typography>
      <div style={formStyle}>
        <form style={{ width: '100%' }}>
          <TextField fullWidth label='Person in charge' />
        </form>
      </div>
    </Container>
  );
};

export default CreateOrder;
