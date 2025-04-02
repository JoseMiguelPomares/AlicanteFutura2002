package com.swapify.swapifyapi.controllers

import com.swapify.swapifyapi.model.dto.UserDTO
import com.swapify.swapifyapi.model.dto.UserSignInDTO
import com.swapify.swapifyapi.model.entities.User
import com.swapify.swapifyapi.services.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/users")
class UserController {

    @Autowired
    lateinit var userService: UserService

    @GetMapping("/getAll")
    fun getUsers(): MutableIterable<User>{
        return userService.getUsers()
    }

    @GetMapping("/getById/{id}")
    fun getUserById(@PathVariable id: Int): ResponseEntity<User>{
        return userService.getUserById(id)
    }

    @GetMapping("/getReputCredit/{id}")
    fun getUserReputCredit(@PathVariable id: Int): ResponseEntity<UserDTO>{
        return userService.getUserReputCredit(id)
    }

    @PostMapping("/register")
    fun registerUser(@RequestBody userSignInDTO: UserSignInDTO): ResponseEntity<UserSignInDTO>{
        return userService.registerUser(userSignInDTO)
    }

    @GetMapping("/login/{identification}/{password}")
    fun loginUser(@PathVariable identification: String, @PathVariable password: String): ResponseEntity<User>{
        return userService.loginUser(identification, password)
    }
}