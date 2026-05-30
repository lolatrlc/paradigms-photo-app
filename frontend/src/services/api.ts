import axios from 'axios'

const api = axios.create({
  //baseURL: 'http://localhost:3000',
  baseURL: 'http://127.0.0.1:3000',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


export async function login(email: string, password: string) {
  const res = await api.post("/auth/login", {
    email,
    password,
  });

  return res.data;
}

export default api