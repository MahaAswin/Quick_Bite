import api from "../api/axiosConfig.js";

export const getMyOrders = async () => {
  const response = await api.get("user/orders/my-orders");
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await api.get(`user/orders/${id}`);
  return response.data;
};

export const cancelOrder = async (id) => {
  const response = await api.put(`user/orders/${id}/cancel`);
  return response.data;
};

export const getAllOrders = async () => {
  const response = await api.get(`admin/orders`);
  return response.data;
};
export const getAdminOrderById = async (id) => {
  const response = await api.get(`admin/orders/${id}`);
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await api.put(`admin/orders/${id}/status`, {
    status: status,
  });
  return response.data;
};

export const getAdminOrderByStatus = async (status) => {
  const response = await api.get(`admin/orders/status/${status}`);
  return response.data;
};

// orderService.js

export const placeOrder = async (data) => {
  const response = await api.post("/user/orders", data);
  return response.data;
};

