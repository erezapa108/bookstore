import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
});

export const registerUser = (userData) => {
    return api.post("/auth/register", userData);
};

export const loginUser = (credentials) => {
    return api.post("/auth/login", credentials);
};

export const getMe = (token) => {
    return api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}`},
    });
};