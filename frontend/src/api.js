// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // 👈 env se URL le raha hai
  withCredentials: true,
});

export default api;
