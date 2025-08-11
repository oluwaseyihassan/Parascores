import axios from "axios";

// const API_KEY = import.meta.env.VITE_API_KEY;
const baseUrl = import.meta.env.VITE_BASE_URL

const api = axios.create({
    baseURL: baseUrl,
    headers: {
        "Content-Type": "application/json",
        // "X-API-KEY": API_KEY
    }
});

export default api;