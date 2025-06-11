import axios from "axios"
const BASE = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE}/users/`;

axios.defaults.headers.common['ngrok-skip-browser-warning'] = '69420'

// Actualizar la interfaz SocialAuthUser para incluir el token
interface SocialAuthUser {
  socialId: string
  name: string
  email: string
  imageUrl?: string
  token?: string // Añadir el token como parámetro opcional
}

export class UserService {
  //baseUrl = "http://localhost:8080/swapify/users/"

  async getAll() {
    return axios.get(API_URL + "getAll").then((res) => res.data)
  }

  async getUserById(userId: number) {
    return axios.get(API_URL + `getById/${userId}`)
  }

  getCredit(userId: number) {
    return axios.get(API_URL + `getCredit/${userId}`)
  }

  getReputation(userId: number) {
    return axios.get(API_URL + `getReputation/${userId}`)
  }

  register(user: any) {
    return axios.post(API_URL + "register", user)
  }

  login(identification: string, password: string) {
    return axios.get(API_URL + `login/${identification}/${password}`)
  }

  // Nuevo método para autenticación con proveedores sociales
  loginWithSocialProvider(userData: SocialAuthUser) {
    return axios.post(API_URL + "social-auth", userData)
  }

  // Método para actualizar la información del usuario
  updateUser(userData: any) {
    return axios.put(API_URL + `updateProfile/${userData.id}`, userData)
  }

  // Método para añadir créditos a un usuario
  addCredits(userId: number, credits: number) {
    return axios.post(API_URL + `addCredits/${userId}/${credits}`)
  }

  toggleAdminStatus(userId: number) {
    return axios.put(API_URL + `toggleAdmin/${userId}`);
  }
  
  isUserAdmin(userId: number) {
    return axios.get(API_URL + `isAdmin/${userId}`);
  }

  isUserSuperAdmin(userId: number) {
    return axios.get(API_URL + `isSuperAdmin/${userId}`);
  }

  toggleUserBan(userId: number) {
    return axios.put(API_URL + `toggleBan/${userId}`);
  }
}