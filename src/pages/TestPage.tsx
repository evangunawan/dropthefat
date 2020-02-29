import * as React from 'react';
import { Button } from '@material-ui/core/';

const styles = {
  padding: 10,
};

const TestPage = () => {
  return (
    <div style={styles}>
      <Button variant='contained' color='primary'>
        Hello
      </Button>
    </div>
  );
};

export default TestPage;
