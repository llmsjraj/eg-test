import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signUpSchema } from '../validation/signupValidation';
import { signUp, signIn } from '../services/authService';
import { useDispatch, useSelector } from 'react-redux';
import { Button, TextField, Typography, Container, Grid, Paper, CircularProgress, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { SignUpFormData } from '../types/formModels';
import { RootState } from '../app/store';
import { signIn as signInRedux } from '../features/auth/authSlice';

const SignUp: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/application');
    }
  }, [isAuthenticated, navigate]);

  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
    resolver: yupResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setLoading(true);
      await signUp(data.name, data.email, data.password);
      const response = await signIn(data.email, data.password);
      const { accessToken, refresh_token, user_details } = response.data.data;
      dispatch(signInRedux({ 
        email: user_details.email, 
        name: user_details.full_name, 
        token: accessToken, 
        refreshToken: refresh_token 
      }));
      navigate('/application');
    } catch (error: any) {
      if (error.response?.data?.errors && error.response.data.errors.length > 0) {
        const errorMessages = error.response.data.errors.map((err: any) => `${err.field}: ${err.message}`).join('\n');
        setError(errorMessages);
      } else {
        setError(error.response?.data?.message || 'Error occurred during sign up');
      }
    } finally {
      setLoading(false);
    }
  };

  const [error, setError] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/application');
    }
  }, [isAuthenticated, navigate]);

  const navigateToSignIn = () => {
    if (!isAuthenticated) {
      navigate('/signin');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h5" style={{ marginBottom: '20px' }}>Sign Up</Typography>
        {error && <Typography color="error" style={{ marginBottom: '20px' }}>{error}</Typography>}
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                {...register('name')}
              />
              <Typography variant="caption" color="error">{errors.name?.message}</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                {...register('email')}
              />
              <Typography variant="caption" color="error">{errors.email?.message}</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                {...register('password')}
              />
              <Typography variant="caption" color="error">{errors.password?.message}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Button 
                type="submit" 
                fullWidth 
                variant="contained" 
                color="primary" 
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Sign Up'}
              </Button>
            </Grid>
          </Grid>
        </form>

        {/* Sign In Link */}
        <Grid item xs={12} style={{ marginTop: '20px', textAlign: 'center' }}>
          <Typography variant="body2">
            Already have an account?{' '}
            <Link href="#" onClick={navigateToSignIn} style={{ cursor: 'pointer' }}>
              Sign in
            </Link>
          </Typography>
        </Grid>
      </Paper>
    </Container>
  );
};

export default SignUp;
