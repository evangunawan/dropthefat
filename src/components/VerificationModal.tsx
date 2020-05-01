import * as React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import {
  Modal,
  Fade,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
} from '@material-ui/core';

interface ModalProps {
  roleType: string[];
  open: boolean;
  onClose(): void;
  onSuccess(): void;
}

const VerificationModal = (props: ModalProps) => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const roleIsValid = (role: string) => {
    const found = props.roleType.find((item) => {
      return item === role;
    });

    if (found) {
      return true;
    } else {
      return false;
    }
  };

  const verifyCredentials = async () => {
    const db = firebase.firestore();
    setLoading(true);
    const qs = await db
      .collection('employees')
      .where('username', '==', username)
      .get();
    if (qs.size > 0) {
      qs.forEach((doc) => {
        if (roleIsValid(doc.data().role)) {
          if (doc.data().password === password) {
            props.onSuccess();
          } else {
            setErrorMessage('Wrong username or password, please re-enter.');
          }
        } else {
          setErrorMessage('Invalid role, please check again!');
        }
      });
    } else {
      setErrorMessage('Wrong username or password, please re-enter.');
    }
    setLoading(false);
  };

  const modalStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const cardStyle: React.CSSProperties = {
    outline: 0,
    width: 400,
    padding: 16,
  };

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      style={modalStyle}
      disableBackdropClick={loading}
      disableEscapeKeyDown={loading}
    >
      <Fade in={props.open}>
        <Card style={cardStyle}>
          <CardContent>
            <Grid
              container
              direction='column'
              justify='flex-start'
              alignItems='stretch'
              spacing={2}
            >
              <Grid item>
                <Typography variant='h5' align='center'>
                  Employee Verification
                </Typography>
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  variant='outlined'
                  label='Username'
                  value={username}
                  onChange={(ev) => {
                    setUsername(ev.target.value);
                  }}
                />
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  variant='outlined'
                  label='Password'
                  type='password'
                  value={password}
                  onChange={(ev) => {
                    setPassword(ev.target.value);
                  }}
                />
              </Grid>
              <Grid item>
                <Grid container direction='row' justify='space-between' spacing={2}>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant='contained'
                      size='large'
                      onClick={props.onClose}
                      disabled={loading}
                    >
                      <b>Cancel</b>
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant='contained'
                      color='primary'
                      size='large'
                      onClick={verifyCredentials}
                      disabled={loading}
                    >
                      <b>Submit</b>
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              {errorMessage.length > 0 ? (
                <Grid item>
                  <Typography variant='body2' color='error'>
                    {errorMessage}
                  </Typography>
                </Grid>
              ) : null}
            </Grid>
          </CardContent>
        </Card>
      </Fade>
    </Modal>
  );
};

export default VerificationModal;
