import api from '../api/axiosConfig';

const foodService = {
  getAllFoods: () => api.get('/foods'),
  getFoodById: (id) => api.get(`/foods/${id}`),
  addFood: (food) => api.post('/foods/admin', food),
  updateFood: (id, food) => api.put(`/foods/admin/${id}`, food),
  deleteFood: (id) => api.delete(`/foods/admin/${id}`),
  updateStock: (id, quantity) => api.put(`/foods/admin/${id}/stock`, { quantity }),
  getLowStockFoods: () => api.get('/foods/admin/low-stock'),
  getOutOfStockFoods: () => api.get('/foods/admin/out-of-stock'),
  getAllHistory: (id) => api.get(`/foods/admin/history/${id}`),
};

export default foodService;
