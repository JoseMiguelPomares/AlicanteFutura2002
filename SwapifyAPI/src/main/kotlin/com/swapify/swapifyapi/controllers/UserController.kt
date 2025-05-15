package com.swapify.swapifyapi.controllers

import com.swapify.swapifyapi.model.dto.CreditsUserDTO
import com.swapify.swapifyapi.model.dto.ReputationUserDTO
import com.swapify.swapifyapi.model.dto.UserSignInDTO
import com.swapify.swapifyapi.model.dto.SocialAuthUserDTO
import com.swapify.swapifyapi.model.dto.UserProfileDTO
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

    // Función para autenticación Google, en caso de que el usuario ya exista, se actualiza su información, si no se crea un nuevo usuario
    @PostMapping("/social-auth")
    fun socialAuth(@RequestBody socialAuthUserDTO: SocialAuthUserDTO): ResponseEntity<User> {
        return userService.handleSocialAuth(socialAuthUserDTO)
    }

    //Función para cambiar contraseña de un usuario
    @PutMapping("/changePassword/{id}")
    fun changePassword(@PathVariable id: Int, @RequestBody password: String): ResponseEntity<User> {
        return userService.changePassword(id, password)
    }

    //Función para buscar un usuario por item id
    @GetMapping("/getUserByItemId/{itemId}")
    fun getUserByItemId(@PathVariable itemId: Int): ResponseEntity<User> {
        return userService.getUserByItemId(itemId)
    }

    //Función para actualizar el perfil de un usuario
    @PutMapping("/updateProfile/{id}")
    fun updateUserProfile(@PathVariable id: Int, @RequestBody userProfileDTO: UserProfileDTO): ResponseEntity<UserProfileDTO> {
        return userService.updateUserProfile(id, userProfileDTO)
    }

    //Función para añadir créditos a un usuario
    @PostMapping("/addCredits/{id}/{credits}")
    fun addCreditsToUser(@PathVariable id: Int, @PathVariable credits: Int): ResponseEntity<CreditsUserDTO> {
        return userService.addCreditsToUser(id, credits)
    }
}