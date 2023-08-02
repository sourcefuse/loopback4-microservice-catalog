/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Box, Grid, Typography } from "@mui/material";
import arcLogo from "../Assets/ARC_logo.png";
import loginPage from "../Assets/login-page-graphics.png";
import Button from "../Components/Button";
import Form from "../Components/Forms/Form";
import FormInput from "../Components/Forms/FormInput";
import FormPasswordInput from "../Components/Forms/FormPasswordInput";
import useAuth from "../Hooks/useAuth";
import { FormikHelpers } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import type { LoginForm } from "../redux/auth/authApiSlice";
import * as yup from "yup";

const initialValues = {
  username: "",
  password: "",
};

const validationSchema = yup.object({
  username: yup.string().required().label("UserName"),
  password: yup.string().required().label("Password"),
});

const Login = () => {
  const { login, loginLoading } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleNavigation = () => {
    navigate(from, { replace: true });
  };

  const handleSubmit = async (
    values: LoginForm,
    { setSubmitting }: FormikHelpers<LoginForm>
  ) => {
    await login(values);
    handleNavigation();
    setSubmitting(false);
  };

  return (
    <>
      <Grid container data-testid="LoginPage">
        <Grid item xs={8}>
          <Box
            sx={{
              height: "100vh",
              width: "100%",
              backgroundImage: `url(${loginPage})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          ></Box>
        </Grid>
        <Grid item xs={4}>
          <Box
            component="div"
            sx={{
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "1rem",
            }}
          >
            <Grid container maxWidth="25em">
              <Box
                component="img"
                sx={{
                  width: "auto",
                }}
                src={arcLogo}
                alt="hero"
              />
              <Grid item xs={12}>
                <Typography variant="h4" sx={{ mt: 6 }}>
                  <b>Welcome to the</b>
                </Typography>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  <b>Telemedicine App</b>
                </Typography>
                <Typography
                  variant="subtitle2"
                  component="div"
                  sx={{ mt: 2, mb: 3, color: "#525252" }}
                >
                  Built with{" "}
                  <a href="https://sourcefuse.github.io/arc-docs/">
                    ARC by SourceFuse
                  </a>
                </Typography>
              </Grid>
              <Form
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
              >
                <Grid item xs={12}>
                  <FormInput id="username" label="Username" />
                </Grid>
                <Grid item xs={12} sx={{ mt: 1 }}>
                  <FormPasswordInput id="password" label="Password" />
                </Grid>
                <Grid container item xs={12}>
                  <Button
                    variant="contained"
                    sx={{
                      mt: 2,
                      mb: 4,
                      borderRadius: 6,
                      // backgroundColor: "#e81a23",
                    }}
                    isLoading={loginLoading}
                    color="error"
                    type="submit"
                  >
                    Login
                  </Button>
                </Grid>
              </Form>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Login;
