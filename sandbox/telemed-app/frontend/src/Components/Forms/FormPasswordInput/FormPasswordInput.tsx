import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import React, { useCallback, useState } from "react";
import { InputProps } from "../../Input/Input";
import FormInput from "../FormInput";

const FormPasswordInput: React.FC<InputProps> = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleOnClickEvent = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword]);

  return (
    <FormInput
      {...props}
      type={showPassword ? "text" : "password"}
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            aria-label="toggle password visibility"
            onClick={handleOnClickEvent}
            edge="end"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      }
    />
  );
};

export default FormPasswordInput;
