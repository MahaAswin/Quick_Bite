import api from "../api/axiosConfig";

export const getUserDashboard = async () => {
    return await api.get("/user/dashboard");
};

export const getAdminDashboard = async () => {
    return await api.get("/admin/dashboard");
};

export const getProfile = async () => {
    return await api.get("/user/profile");
};

export const updateProfile = async (data) => {
    return await api.put("/user/profile", data);
};