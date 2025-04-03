import axios from 'axios';

export class UserService{
    
    baseUrl = "http://localhost:8080/swapify/users/";
    async getById(userId: number) {
        return axios.get(this.baseUrl + `getById/${userId}`)
    }
}