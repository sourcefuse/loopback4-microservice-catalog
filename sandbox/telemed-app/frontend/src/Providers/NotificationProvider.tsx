import Slide from '@mui/material/Slide';
import {SnackbarProvider} from 'notistack';
import {ReactNode} from 'react';

const NotificationProvider = ({children}: {children: ReactNode}) => {
  return (
    <SnackbarProvider
      TransitionComponent={Slide}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      autoHideDuration={2000}
    >
      {children}
    </SnackbarProvider>
  );
};

export default NotificationProvider;
