import * as React from 'react';
import { Box } from '@material-ui/core';

interface Props {
  children: React.ReactNode;
  width?: string;
}

const Container = (props: Props) => {
  const containerStyle = {
    padding: '32px 16px',
    width: props.width || '100%',
    margin: '0 auto',
  };

  return <Box style={containerStyle}>{props.children || null}</Box>;
};

export default Container;
