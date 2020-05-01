import * as React from 'react';
import { Typography } from '@material-ui/core';
import Container from '../../components/Container';
import { EmojiPeople } from '@material-ui/icons';

const AdminDashboard = () => {
  return (
    <Container width='1000px'>
      <Typography variant='h4' style={{ paddingTop: 300, textAlign: 'center' }}>
        Welcome to Admin Page{' '}
        <EmojiPeople style={{ marginBottom: -10, width: 50, height: 50 }} />
      </Typography>
    </Container>
  );
};

export default AdminDashboard;
