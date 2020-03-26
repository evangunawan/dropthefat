import * as React from 'react';
import Container from '../../components/Container';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import {
  Card,
  TextField,
  CardContent,
  Typography,
  CardActions,
  Button,
} from '@material-ui/core';

const LoginAdmin = () => {
  const containerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  };
  const cardStyle: CSSProperties = {
    width: '500px',
    height: 'auto',
  };

  return (
    <Container style={containerStyle}>
      <Card style={cardStyle}>
        <CardContent>
          <Typography variant='h5' component='h2' align='center'>
            Login Admin
          </Typography>
          <form style={{ padding: 10 }}>
            <TextField label='Password' variant='outlined' />
          </form>
        </CardContent>
        <CardActions>
          <Button variant='contained' color='primary' disableElevation>
            LOGIN
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
};

export default LoginAdmin;
