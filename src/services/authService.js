import api from './api';

export const login = (email, password) => {
  return api.post('/auth/login', { email, password })
    .then((response) => {
      const data = response.data;
      
      if (data && data.token) {
        localStorage.setItem('token', data.token);
        
        if (data.role) {
          localStorage.setItem('role', data.role);
        }
      }
      
      return data;
    });
};

export const logout = () => {
  localStorage.clear();
  window.location.href = '/login';
};