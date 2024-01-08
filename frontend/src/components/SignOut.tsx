import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../features/auth/authSlice';

const SignOut: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(signOut());
    navigate('/signin');
  }, [dispatch, navigate]);

  return <div>Signing out...</div>;
};

export default SignOut;
