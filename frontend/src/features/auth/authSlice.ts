import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: { email: string; name: string } | null;
  token: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<{ email: string; name: string; token: string; refreshToken: string }>) => {
      state.isAuthenticated = true;
      state.user = { email: action.payload.email, name: action.payload.name };
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      // Persist the authentication state to localStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(state.user));
      localStorage.setItem('token', state.token);
    },
    signOut: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      // Clear the authentication state from localStorage
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    },
  },
});

export const { signIn, signOut } = authSlice.actions;

export default authSlice.reducer;
