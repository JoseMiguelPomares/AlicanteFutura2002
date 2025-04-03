package com.swapify.swapifyapi.controllers

import com.swapify.swapifyapi.model.dto.CreditsUserDTO
import com.swapify.swapifyapi.model.dto.ReputationUserDTO
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

    //Función para obtener todos los usuarios
    @GetMapping("/getAll")
    fun getUsers(): MutableIterable<User>{
        return userService.getUsers()
    }

    //Función para obtener un usuario por su id
    @GetMapping("/getById/{id}")
    fun getUserById(@PathVariable id: Int): ResponseEntity<User>{
        return userService.getUserById(id)
    }

    //Función para obtener el crédito de un usuario
    @GetMapping("/getCredit/{id}")
    fun getUserCredit(@PathVariable id: Int): ResponseEntity<CreditsUserDTO>{
        return userService.getUserCredit(id)
    }

    //Función para obtener la reputación de un usuario
    @GetMapping("/getReputation/{id}")
    fun getUserReput(@PathVariable id: Int): ResponseEntity<ReputationUserDTO>{
        return userService.getUserReput(id)
    }

    //Función para registrar un usuario
    @PostMapping("/register")
    fun registerUser(@RequestBody userSignInDTO: UserSignInDTO): ResponseEntity<UserSignInDTO>{
        return userService.registerUser(userSignInDTO)
    }

    //Función para loguear un usuario
    @GetMapping("/login/{identification}/{password}")
    fun loginUser(@PathVariable identification: String, @PathVariable password: String): ResponseEntity<User>{
        return userService.loginUser(identification, password)
    }
}