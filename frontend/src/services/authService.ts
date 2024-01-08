import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const signUp = async (name: string, email: string, password: string) => {
  return axios.post(`${BASE_URL}/signup`, { name, email, password });
};

export const signIn = async (email: string, password: string) => {
  return axios.post(`${BASE_URL}/signin`, { email, password });
};
