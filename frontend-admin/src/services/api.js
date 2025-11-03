// src/services/api.js
import axios from 'axios'

// Create an axios instance
const api = axios.create({
  // Replace with your API's base URL
  baseURL: import.meta.env.VITE_API_URL,
})

// Add a request interceptor to include the token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)



export default api
