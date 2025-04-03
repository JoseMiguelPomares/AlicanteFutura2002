import axios from 'axios';

export class CategoryService{
    
    baseUrl = "http://localhost:8080/swapify/categories/";
    async getAll() {
        return axios.get(this.baseUrl + "getAll").then(res => res.data)
    }
}