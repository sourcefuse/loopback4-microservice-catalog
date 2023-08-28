import {Form as FormikForm, Formik} from 'formik';
import {forwardRef, ReactNode} from 'react';

type Props = {
  initialValues: any;
  onSubmit: any;
  validationSchema?: any;
  id?: string;
  enableReinitialize?: boolean;
  children?: ReactNode;
};

const Form = forwardRef(
  ({initialValues, onSubmit, validationSchema, children, id, enableReinitialize = false}: Props, ref: any) => {
    return (
      <Formik
        enableReinitialize={enableReinitialize}
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({handleSubmit}) => (
          <FormikForm id={id} onSubmit={handleSubmit} ref={ref}>
            {children}
          </FormikForm>
        )}
      </Formik>
    );
  },
);

Form.displayName = 'Form';
export default Form;
