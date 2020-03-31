import * as React from 'react';
import { Box } from '@material-ui/core';

interface Props {
  children: React.ReactNode;
  width: string;
  style?: any;
  minWidth?: string;
}

const Container = (props: Props) => {
  //Temporary workaround for renponsive container. Please fix later if conflicted.
  const mediaMatch = window.matchMedia(`(min-width: ${props.minWidth || '600px'})`);
  const [matches, setMatches] = React.useState(mediaMatch.matches);

  const containerStyle = (isNarrowScreen: boolean) => ({
    padding: '16px',
    width: isNarrowScreen ? props.width : '100%',
    margin: '0 auto',
  });

  React.useEffect(() => {
    const handler = (e: any) => setMatches(e.matches);
    mediaMatch.addListener(handler);
    return () => mediaMatch.removeListener(handler);
    // eslint-disable-next-line
  }, []);

  return (
    <Box {...props.style} style={containerStyle(matches)}>
      {props.children || null}
    </Box>
  );
};

export default Container;
