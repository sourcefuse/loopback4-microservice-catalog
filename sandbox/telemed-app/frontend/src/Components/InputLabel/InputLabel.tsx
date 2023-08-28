import MuiInputLabel from '@mui/material/InputLabel';

export default function InputLabel({children, htmlFor}: {children: string; htmlFor?: string}) {
  return (
    <MuiInputLabel shrink variant="standard" htmlFor={htmlFor}>
      {children}
    </MuiInputLabel>
  );
}
