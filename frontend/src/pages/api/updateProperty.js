import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // 🔄 apna backend base URL daalna
});

// JWT token automatically add karne ke liye interceptor
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

/**
 * ✅ Update property (User + Admin dono ke liye ek hi function)
 * @param {string} id - Property ID
 * @param {FormData} formData - formData with fields + images
 */
export const updateProperty = async (id, formData) => {
  try {
    const { data } = await API.put(`/properties/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Update failed" };
  }
};
