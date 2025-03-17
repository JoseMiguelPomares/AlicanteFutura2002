package com.swapify.swapifyapi.controllers

import com.swapify.swapifyapi.model.dto.UserDTO
import com.swapify.swapifyapi.model.entities.User
import com.swapify.swapifyapi.services.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

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
    fun getUserById(@PathVariable id: Long): ResponseEntity<User>{
        return userService.getUserById(id)
    }

    @GetMapping("/getReputCredit/{id}")
    fun getUserReputCredit(@PathVariable id: Long): ResponseEntity<UserDTO>{
        return userService.getUserReputCredit(id)
    }
}