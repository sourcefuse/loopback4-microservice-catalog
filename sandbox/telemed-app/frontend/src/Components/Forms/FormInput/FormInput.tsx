import { useFormikContext } from "formik";
import React, { useCallback } from "react";
import Input, { InputProps } from "../../Input/Input";
import { getValue } from "../../../Helpers/utils";

type Formik = {
  [x: string]: string;
};

const FormInput: React.FC<InputProps> = ({ id, disabled, ...rest }) => {
  const { setFieldValue, errors, touched, values } = useFormikContext<Formik>();
  const isError = (!!getValue(errors, id) &&
    getValue(touched, id) &&
    !disabled) as boolean;
  const handleChangeEvent = useCallback(
    (val: string) => setFieldValue(id, val),
    [id, setFieldValue]
  );

  return (
    <Input
      id={id}
      value={getValue(values, id)}
      errorMessage={isError ? (getValue(errors, id) as string) : ""}
      onChange={handleChangeEvent}
      disabled={disabled}
      {...rest}
    />
  );
};

export default FormInput;
