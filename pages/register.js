import {
    Button,
    Link,
    List,
    ListItem,
    TextField,
    Typography
} from '@material-ui/core';
import axios from 'axios';
import Cookies from 'js-cookie';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useContext, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import useStyles from '../utils/styles';

const Register = () => {
  const router = useRouter();
  const { redirect } = router.query;
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  useEffect(() => {
    if (userInfo) {
      router.push('/');
    }
  }, []);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const classes = useStyles();

  const submitHandler = async ({name, email, password, confirmPassword}) => {
    closeSnackbar();
    if (password !== confirmPassword) {
        enqueueSnackbar("Password don't matched", {variant: 'error'});
      return;
    }
    try {
      const { data } = await axios.post('/api/users/register', {
        name,
        email,
        password,
      });
      dispatch({ type: 'USER_LOGIN', payload: data });
      Cookies.set('userInfo', data);
      router.push(redirect || '/');
    } catch (err) {
        enqueueSnackbar(err.response.data ? err.response.data.message : err.message, {variant: 'error'});
    }
  };

  return (
    <Layout title='Register'>
      <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
        <Typography component='h1' variant='h1'>
          Register
        </Typography>
        <List>
          <ListItem>
            <Controller
              name='name'
              control={control}
              defaultValue=''
              rules={{
                required: true,
                minLength: 4,
              }}
              render={({ field }) => (
                <TextField
                  variant='outlined'
                  fullWidth
                  id='name'
                  label='Name'
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.name)}
                  helperText={
                    errors.name
                      ? errors.name.type === 'minLength'
                        ? 'Name length is more than 1'
                        : 'Name is required'
                      : ''
                  }
                  {...field}></TextField>
              )}></Controller>
          </ListItem>

          <ListItem>
            <Controller
              name='email'
              control={control}
              defaultValue=''
              rules={{
                required: true,
                pattern: /\S+@\S+\.\S+/,
              }}
              render={({ field }) => (
                <TextField
                  variant='outlined'
                  fullWidth
                  id='email'
                  label='Email'
                  inputProps={{ type: 'email' }}
                  error={Boolean(errors.email)}
                  helperText={
                    errors.email
                      ? errors.email.type === 'pattern'
                        ? 'Email is not valid'
                        : 'Email is required'
                      : ''
                  }
                  {...field}></TextField>
              )}></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name='password'
              control={control}
              defaultValue=''
              rules={{
                required: true,
                minLength: 6,
              }}
              render={({ field }) => (
                <TextField
                  variant='outlined'
                  fullWidth
                  id='password'
                  label='Password'
                  inputProps={{ type: 'password' }}
                  error={Boolean(errors.password)}
                  helperText={
                    errors.password
                      ? errors.password.type === 'minLength'
                        ? 'Password Length is more than 5'
                        : 'Password is required'
                      : ''
                  }
                  {...field}></TextField>
              )}></Controller>
          </ListItem>

          <ListItem>
            <Controller
              name='confirmPassword'
              control={control}
              defaultValue=''
              rules={{
                required: true,
                minLength: 6,
              }}
              render={({ field }) => (
                <TextField
                  variant='outlined'
                  fullWidth
                  id='confirmPassword'
                  label='Confirm Password'
                  inputProps={{ type: 'password' }}
                  error={Boolean(errors.confirmPassword)}
                  helperText={
                    errors.confirmPassword
                      ? errors.confirmPassword.type === 'minLength'
                        ? 'Confirm Password Length is more than 5'
                        : 'Confirm Password is required'
                      : ''
                  }
                  {...field}></TextField>
              )}></Controller>
          </ListItem>

          <ListItem>
            <Button variant='contained' type='submit' fullWidth color='primary'>
              Register
            </Button>
          </ListItem>
          <ListItem>
            Already have an account? &nbsp; {'  '}{' '}
            <NextLink href={`/login?redirect=${redirect || '/'}`} passHref>
              <Link>Login</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};

export default Register;