import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000/',
});

instance.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Token ${user.token}`;
  }
  return config;
});
export default instance;

