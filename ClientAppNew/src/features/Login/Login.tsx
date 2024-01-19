import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

// material core
// import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { useFormik } from 'formik';
import * as yup from 'yup';
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

// actions
import { login } from 'actions/auth.action';
import { CircularProgress } from '@material-ui/core';
import logo from '../../assets/images/logo.jpg';
import { loginStyle } from './login.style';

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false); // Added loading state

  const validationSchema = yup.object({
    username: yup.string().email('Enter a valid email address.').required('User name is required.'),
    password: yup.string().required('Password is required.'),
  });

  const classes = loginStyle();
  const dispatch = useDispatch();
  const history = useHistory();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true); // Start loading
      await dispatch(login(values, history));
      resetForm();
      setIsLoading(false); // Stop loading
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <img src={logo} alt="logo" />
        {isLoading ? null : ( // Conditional rendering based on loading state for "Login" text
          <Typography component="h1" variant="h5">
            Login
          </Typography>
        )}
        {isLoading ? ( // Conditional rendering based on loading state
          <div
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginTop: 15 }}
          >
            <CircularProgress size={65} />
            <Typography variant="h5" component="h1">
              Please wait while loading...
            </Typography>
          </div>
        ) : (
          <form className={classes.form} noValidate onSubmit={formik.handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="User Name"
              {...formik.getFieldProps('username')}
              name="username"
              autoComplete="username"
              autoFocus
              value={formik.values.username}
              onChange={formik.handleChange}
            />
            {formik.touched.username && formik.errors.username && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.username}</div>
              </div>
            )}

            <TextField
              type="password"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="password"
              label="User Password"
              {...formik.getFieldProps('password')}
              name="password"
              autoComplete="password"
              value={formik.values.password}
              onChange={formik.handleChange}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.password}</div>
              </div>
            )}

            <br />
            <br />

            <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
              Submit
            </Button>
          </form>
        )}
      </div>
    </Container>
  );
}
