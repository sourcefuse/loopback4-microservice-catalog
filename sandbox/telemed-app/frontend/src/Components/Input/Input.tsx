import FileCopyIcon from "@mui/icons-material/FileCopy";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import {
  FormControl,
  FormHelperText,
  IconButton,
  OutlinedInput,
  OutlinedInputProps,
  Tooltip,
} from "@mui/material";
import React, { memo, useCallback } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import InputLabel from "../InputLabel/InputLabel";

export type InputProps = Omit<OutlinedInputProps, "onChange"> & {
  id: string;
  label?: string;
  copyEnabled?: boolean;
  errorMessage?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  onChange?: (val: string) => void;
  helperText?: string;
};

const getEndAdornment = ({
  copyEnabled,
  value,
  isError,
  endAdornment,
}: {
  copyEnabled: boolean;
  value?: OutlinedInputProps["value"];
  isError: boolean | undefined;
  endAdornment: React.ReactNode;
}) => {
  if (endAdornment && !isError) return endAdornment;

  if (isError) return <ReportProblemOutlinedIcon color="error" />;
  if (copyEnabled)
    return (
      <Tooltip title="Copy to clipboard">
        <IconButton sx={{ cursor: "pointer" }}>
          <CopyToClipboard text={value?.toString() || ""}>
            <FileCopyIcon />
          </CopyToClipboard>
        </IconButton>
      </Tooltip>
    );
};

const Input: React.FC<InputProps> = ({
  id,
  value,
  label,
  helperText,
  disabled = false,
  endAdornment,
  copyEnabled = false,
  errorMessage,
  onChange,
  ...rest
}) => {
  const isError = !!errorMessage;
  const handleChangeEvent = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (onChange) onChange(e?.target?.value);
    },
    [onChange]
  );
  return (
    <FormControl
      sx={{ width: 1 }}
      data-testid="inputFormControl"
      error={isError}
      disabled={disabled}
    >
      {label && <InputLabel htmlFor={id}>{label}</InputLabel>}
      <OutlinedInput
        disabled={disabled}
        data-testid="input"
        value={value}
        id={id}
        sx={{ marginTop: 2 }}
        inputProps={{
          sx: {
            padding: 1,
          },
        }}
        onChange={handleChangeEvent}
        endAdornment={getEndAdornment({
          copyEnabled,
          value,
          isError,
          endAdornment,
        })}
        {...rest}
      />
      {(isError || helperText) && (
        <FormHelperText>{isError ? errorMessage : helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

export default memo(Input);
