import axios from "axios"

// Actualizar la interfaz SocialAuthUser para incluir el token
interface SocialAuthUser {
  socialId: string
  name: string
  email: string
  imageUrl?: string
  token?: string // Añadir el token como parámetro opcional
}

export class UserService {
  baseUrl = "http://localhost:8080/swapify/users/"

  async getAll() {
    return axios.get(this.baseUrl + "getAll").then((res) => res.data)
  }

  async getUserById(userId: number) {
    return axios.get(this.baseUrl + `getById/${userId}`)
  }

  getCredit(userId: number) {
    return axios.get(this.baseUrl + `getCredit/${userId}`)
  }

  getReputation(userId: number) {
    return axios.get(this.baseUrl + `getReputation/${userId}`)
  }

  register(user: any) {
    return axios.post(this.baseUrl + "register", user)
  }

  login(identification: string, password: string) {
    return axios.get(this.baseUrl + `login/${identification}/${password}`)
  }

  // Nuevo método para autenticación con proveedores sociales
  loginWithSocialProvider(userData: SocialAuthUser) {
    return axios.post(this.baseUrl + "social-auth", userData)
  }

  // Método para actualizar la información del usuario
  updateUser(userData: any) {
    return axios.put(this.baseUrl + `updateProfile/${userData.id}`, userData)
  }

  // Método para añadir créditos a un usuario
  addCredits(userId: number, credits: number) {
    return axios.post(this.baseUrl + `addCredits/${userId}/${credits}`)
  }
}