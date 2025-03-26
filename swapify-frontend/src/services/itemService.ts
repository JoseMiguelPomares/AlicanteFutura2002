import axios from 'axios';

export class ItemService{
    baseUrl = "http://localhost:8080/swapify/items/";
    getAll(){
        return axios.get(this.baseUrl + "getAll").then(res => res.data)
    }
}