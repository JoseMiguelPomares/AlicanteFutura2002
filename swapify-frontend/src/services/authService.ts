import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/swapify/auth';

const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password
      });
      return response.data;
    } catch (error) {
      throw new Error('Error en el inicio de sesión');
    }
  },

  register: async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, {
        email,
        password
      });
      return response.data;
    } catch (error) {
      throw new Error('Error en el registro');
    }
  }
};

export default authService;