import axios from "axios"
const BASE = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE}/items`;

export class ItemService {
  //baseUrl = "http://localhost:8080/swapify/items/"
// 
  private _cachedItems: any[] | null = null

  // Método para obtener todos los items y actualizar la caché
  async getAll() {
    try {
      const response = await axios.get(API_URL + "/getAll")
      console.log("📦 Productos recibidos:", response.data)
      this._cachedItems = response.data
      return response.data
    } catch (error) {
      console.error("Error al obtener todos los items:", error)
      throw error
    }
  }

  // Método para asegurar que la caché está cargada
  private async ensureCacheLoaded() {
    if (!this._cachedItems) {
      console.log("Cargando todos los items...")
      await this.getAll()
    }
    return this._cachedItems
  }

  getByUserId(userId: number) {
    return axios.get(API_URL + `/userItems/${userId}`).then((res) => res.data)
  }

  getAllDTO(itemDTO: any) {
    return axios.post(API_URL + "/getAllDTO", itemDTO)
  }

  getByCategory(category: string) {
    return axios.get(API_URL + `/getByCategory/${category}`)
  }

  getByCategoryAndId(category: string, userId: number) {
    return axios.get(API_URL + `/getByCategoryAndId/${category}/${userId}`)
  }

  getByTitle(title: string) {
    return axios.get(API_URL + `/getByTitle/${title}`)
  }

  addItem(item: any) {
    return axios.post(API_URL + "/addItem", item)
  }

  // Método simplificado para obtener un item por ID
  async getItemById(itemId: number) {
    try {
      await this.ensureCacheLoaded()
      const completeItem = this._cachedItems?.find((i: any) => i.id === itemId)
      
      if (completeItem) {
        return { data: completeItem }
      }
      
      // Si no lo encontramos en la caché, intentamos obtenerlo directamente
      const response = await axios.get(API_URL + `/getItemById/${itemId}`)
      return response.data
    } catch (error) {
      console.error("Error al obtener el item:", error)
      throw error
    }
  }

  // Método simplificado para obtener productos relacionados
  async getRelatedProducts(itemId: number, categoryId: number, limit = 4) {
    try {
      await this.ensureCacheLoaded()
      
      // Filtrar productos de la misma categoría, excluyendo el producto actual
      return (this._cachedItems || [])
        .filter((p: any) => p.category?.id === categoryId && p.id !== itemId)
        .slice(0, limit)
    } catch (error) {
      console.error("Error al obtener productos relacionados:", error)
      return []
    }
  }

  getItemByLowerPrice() {
    return axios.get(API_URL + `/getByLowerPrice`)
  }

  getItemByHigherPrice() {
    return axios.get(API_URL + `/getByHigherPrice`)
  }

  getItemByPriceRange(min: number, max: number) {
    return axios.get(API_URL + `/getByPriceRange/${min}/${max}`)
  }

  deleteItem(itemId: number) {
    return axios.delete(API_URL + `/deleteItem/${itemId}`)
  }

  modifyItem(itemId: number, itemData: any) {
    return axios.put(API_URL + `/modifyItem/${itemId}`, itemData)
  }

  getRecentItems() {
      return axios.get(API_URL + "/getRecentlyAdded")
  }
}
