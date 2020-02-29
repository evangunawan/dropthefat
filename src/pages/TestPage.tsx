import * as React from 'react';
import { Button, makeStyles } from '@material-ui/core/';

const styles = makeStyles({
  root: {
    width: '100%',
    height: 100,
    backgroundColor: 'blue',
  },
});

const TestPage = () => {
  const classes = styles();
  return (
    <div className={classes.root}>
      <Button variant='contained' color='primary'>
        Hello
      </Button>
    </div>
  );
};

export default TestPage;
