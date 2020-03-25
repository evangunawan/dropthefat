import * as React from 'react';
import { Fade, CircularProgress, Modal } from '@material-ui/core';
import { CSSProperties } from '@material-ui/core/styles/withStyles';

interface LoadingProps {
  open: boolean;
}

const FullScreenSpinner = (props: LoadingProps) => {
  const spinnerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    outline: 0,
    height: '100vh',
  };

  return (
    <Modal open={props.open}>
      <Fade in={props.open}>
        <div style={spinnerStyle}>
          <CircularProgress />
        </div>
      </Fade>
    </Modal>
  );
};

export default FullScreenSpinner;
