import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;

const api = axios.create({
    // baseURL: "http://localhost:2000/api",
    baseURL: "https://sportmonksapi.onrender.com/api",
    headers: {
        "Content-Type": "application/json",
        "X-API-KEY": API_KEY
    }
});

export default api;