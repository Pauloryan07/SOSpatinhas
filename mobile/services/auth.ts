import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

export const login = async (email: string, password: string) => {
  const response = await api.post('/login', { email, password });
  await AsyncStorage.setItem('auth_token', response.data.token);
  await AsyncStorage.setItem('user_name', response.data.user.name);
  return response.data;
};

export const registerUser = async (data: { name: string; email: string; password: string; telefone: string }) => {
  const response = await api.post('/register', { ...data, password_confirmation: data.password });
  await AsyncStorage.setItem('auth_token', response.data.token);
  await AsyncStorage.setItem('user_name', response.data.user.name);
  return response.data;
};

export const registerVet = async (data: { name: string; email: string; password: string; telefone: string; crmv: string }) => {
  const response = await api.post('/register/vet', { ...data, password_confirmation: data.password });
  await AsyncStorage.setItem('auth_token', response.data.token);
  await AsyncStorage.setItem('user_name', response.data.user.name);
  return response.data;
};

export const logout = async () => {
  await api.post('/logout');
  await AsyncStorage.removeItem('auth_token');
  await AsyncStorage.removeItem('user_name');
};

export const getUserName = async () => {
  return await AsyncStorage.getItem('user_name');
};
