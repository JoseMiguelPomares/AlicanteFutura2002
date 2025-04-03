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
}