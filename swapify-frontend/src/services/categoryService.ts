import axios from 'axios';
const API_URL = import.meta.env.VITE_API_BASE_URL + /categories/

export class CategoryService{
    
    baseUrl = "http://localhost:8080/swapify/categories/";
    async getAll() {
        //return axios.get(this.baseUrl + "getAll").then(res => res.data)
        return axios.get(API_URL + "getAll").then(res => res.data)
    }
}