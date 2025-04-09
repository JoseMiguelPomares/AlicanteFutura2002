import axios from 'axios';
 
 export class UserService{
 
     baseUrl = "http://localhost:8080/swapify/users/";
 
     async getAll() {
         return axios.get(this.baseUrl + "getAll").then(res => res.data)
     }
 
     async getById(userId: number) {
         return axios.get(this.baseUrl + `getById/${userId}`)
     }
 
     getCredit(userId: number){
         return axios.get(this.baseUrl + `getCredit/${userId}`) 
     }
 
     getReputation(userId: number){
         return axios.get(this.baseUrl + `getReputation/${userId}`) 
     }
 
     register(user: any){
         return axios.post(this.baseUrl + "register", user)
     }
 
     login(identification: string, password: string){
         return axios.get(this.baseUrl + `login/${identification}/${password}`)
     }
 }