import MuiButton, {ButtonProps} from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import React, {memo} from 'react';

interface BtnProps extends ButtonProps {
  isLoading?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}
const Button: React.FC<BtnProps> = ({children, color = 'primary', isLoading, disabled, ...rest}) => {
  return (
    <MuiButton disabled={disabled || isLoading} color={color} {...rest}>
      {children}
      {isLoading && (
        <CircularProgress
          sx={{color: `${color}.main`, marginLeft: 1}}
          size={22}
          aria-labelledby="button-loader"
          title="button-loader"
        />
      )}
    </MuiButton>
  );
};

export default memo(Button);
