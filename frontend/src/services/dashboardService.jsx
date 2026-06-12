import axiosInstance from '../api/axiosConfig';

const dashboardService = {
  getUserDashboard: async () => {
    const response = await axiosInstance.get('/user/dashboard');
    return response.data;
  },

  getAdminDashboard: async () => {
    const response = await axiosInstance.get('/admin/dashboard');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await axiosInstance.put('/user/updateProfile', profileData);
    return response.data;
  }
};

export default dashboardService;
