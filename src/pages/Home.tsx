import * as React from 'react';
import Container from '../components/Container';
import { Typography } from '@material-ui/core';
import { SentimentVerySatisfied } from '@material-ui/icons';

const Home = () => {
  return (
    <div>
      <Container width='1000px'>
        <Typography variant='h4' style={{ paddingTop: 300, textAlign: 'center' }}>
          Welcome to Drop The Fat Resto{' '}
          <SentimentVerySatisfied
            style={{ marginLeft: 5, marginBottom: -8, width: 40, height: 40 }}
          />
        </Typography>
      </Container>
    </div>
  );
};

export default Home;
