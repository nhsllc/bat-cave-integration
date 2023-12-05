import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.REACT_APP_BAT_APP_API_URL,
});
