import axios from 'axios';

export class ItemService{
    
    baseUrl = "http://localhost:8080/swapify/items/";
    async getAll() {
        return axios.get(this.baseUrl + "getAll").then(res => res.data)
    }

    getByUserId(userId: number): Promise<any>{
        return axios.get(this.baseUrl + `userItems/${userId}`).then(res => res.data)
    }

    getByItemId(itemId: number){
        return axios.get(this.baseUrl + `getItemById/${itemId}`)
    }

    getAllDTO(itemDTO: any){
        return axios.post(this.baseUrl + "getAllDTO", itemDTO)
    }

    getByCategory(category: string){
        return axios.get(this.baseUrl + `getByCategory/${category}`) 
    }

    getByCategoryAndId(category: string, userId: number){
        return axios.get(this.baseUrl + `getByCategoryAndId/${category}/${userId}`)
    }

    getByTitle(title: string){
        return axios.get(this.baseUrl + `getByTitle/${title}`)
   
    }

    addItem(item: any){
        return axios.post(this.baseUrl + "addItem", item)
    }

    getItemById(itemId: number){
        return axios.get(this.baseUrl + `getItemById/${itemId}`)
    }

    getItemByLowerPrice(){
        return axios.get(this.baseUrl + `getByLowerPrice`)
    }

    getItemByHigherPrice(){
        return axios.get(this.baseUrl + `getByHigherPrice`)
    }

    getItemByPriceRange(min: number, max: number){
        return axios.get(this.baseUrl + `getByPriceRange/${min}/${max}`)
    }

    deleteItem(itemId: number){
        return axios.delete(this.baseUrl + `deleteItem/${itemId}`)
    }

    modifyItem(itemId: number){
        return axios.put(this.baseUrl + "modifyItem", itemId)
    }

    getRecentItems(){
        return axios.get(this.baseUrl + "getRecentlyAdded")
    }
}