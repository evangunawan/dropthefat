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
import { useHistory } from 'react-router-dom';

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

  // create state react.hook
  const [txtPassword, setTxtPassword] = React.useState('');

  const history = useHistory();

  const verifyLogin = () => {
    if (txtPassword === 'admin123') {
      history.push('/admindashboard');
      // console.log("success");
    }
  };

  return (
    <Container style={containerStyle}>
      <Card style={cardStyle}>
        <CardContent>
          <Typography variant='h5' component='h2' align='center'>
            Login Admin
          </Typography>
          <form style={{ padding: 10 }}>
            <TextField
              type='password'
              label='Password'
              variant='outlined'
              value={txtPassword}
              onChange={(event: any) => {
                setTxtPassword(event.target.value);
              }}
            />
          </form>
        </CardContent>
        <CardActions>
          <Button
            variant='contained'
            color='primary'
            onClick={verifyLogin}
            disableElevation
          >
            LOGIN
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
};

export default LoginAdmin;
