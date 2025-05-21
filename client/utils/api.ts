// utils/api.ts
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3001', // Your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export async function loginUser(data: LoginData) {
  return API.post('/auth/login', data);
}

export async function registerUser(data: RegisterData) {
  return API.post('/auth/register', data);
}

export default API;
