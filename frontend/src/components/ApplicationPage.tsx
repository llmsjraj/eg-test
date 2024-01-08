import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { signOut } from '../features/auth/authSlice';

const ApplicationPage: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleSignOut = () => {
    dispatch(signOut());
  };

  return (
    <div>
      <p>Welcome to the application, {user?.name}</p>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default ApplicationPage;
