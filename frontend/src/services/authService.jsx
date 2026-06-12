import api from "../api/axiosConfig";


export const loginUser = async(data)=>{
    return await api.post("auth/login",data);
}

export const registerUser = async(data)=>{
    return await api.post("auth/register",data);
}