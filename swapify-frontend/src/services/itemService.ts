import axios from 'axios';

export class ItemService{
    baseUrl = "http://localhost:8080/swapify/items/";
    getAll(){
        return axios.get(this.baseUrl + "getAll").then(res => res.data)
    }

    getByUserId(){
        return axios.get(this.baseUrl + "/userItems/{userId}").then(res => res.data)
    }
}