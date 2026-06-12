import axiosInstance from '../api/axiosConfig';

const authService = {
  login: async (email, password) => {
    const response = await axiosInstance.post('/auth/login', { email, password });
    const responseText = response.data;

    if (responseText && responseText.includes('Token:')) {
      const parts = responseText.split('Token:');
      const token = parts[1].trim();

      localStorage.setItem('token', token);

      const profile = await authService.getProfile();
      localStorage.setItem('user', JSON.stringify(profile));

      return { success: true, token, user: profile };
    }

    throw new Error(responseText || 'Invalid response from server');
  },

  register: async (name, email, password, phoneNo) => {
    const response = await axiosInstance.post('/auth/register', {
      name,
      email,
      password,
      phoneNo
    });

    return response.data;
  },

  getProfile: async () => {
    const response = await axiosInstance.get('/user/profile');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');

    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }

    return null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user && user.role === 'ADMIN';
  }
};

export default authService;