package com.swapify.swapifyapi.services

import com.swapify.api.utils.PasswordUtils
import com.swapify.swapifyapi.model.dao.IUserDAO
import com.swapify.swapifyapi.model.dto.UserDTO
import com.swapify.swapifyapi.model.dto.UserLoginDTO
import com.swapify.swapifyapi.model.dto.UserSignInDTO
import com.swapify.swapifyapi.model.entities.User
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import java.time.Instant
import java.util.*

@Service
class UserService {

    //Conexión con la interfaz IUserDAO
    @Autowired
    lateinit var userDAO: IUserDAO

    //Función para obtener todos los usuarios
    fun getUsers(): MutableIterable<User> {
        return userDAO.findAll()
    }

    //Funcion para obtener un usuario por su id
    fun getUserById(id: Long): ResponseEntity<User> {
        val user: Optional<User> = userDAO.findById(id)
        return if (user.isPresent) {
            ResponseEntity.ok(user.get())
        } else {
            ResponseEntity.notFound().build()
        }
    }

    //Función para obtener el crédito y reputación de un usuario
    fun getUserReputCredit(id: Long): ResponseEntity<UserDTO> {
        val userOptional: Optional<User> = userDAO.findById(id)
        return if (userOptional.isPresent) {
            val user = UserDTO(
                userOptional.get().id!!.toLong(),
                userOptional.get().name,
                userOptional.get().credits!!.toInt(),
                userOptional.get().reputation!!.toDouble()
            )
            ResponseEntity.ok(user)
        } else {
            ResponseEntity.notFound().build()
        }
    }

    //Función para registrar un usuario por uso de DTO
    fun registerUser(userSignInDTO: UserSignInDTO): ResponseEntity<UserSignInDTO> {
        val user = User()

        user.name = userSignInDTO.name
        user.email = userSignInDTO.email
        user.passwordHash = PasswordUtils.hashSHA256(userSignInDTO.password)
        user.credits = 100
        user.reputation = 5.0
        user.createdAt = Instant.now()

        userDAO.save(user)
        return ResponseEntity(HttpStatus.CREATED)
    }

    //Función para el login de un usuario
    fun loginUser(identification: String, password: String): ResponseEntity<User> {
        val userEmailOptional: Optional<User> = userDAO.findByEmail(identification)
        if (userEmailOptional.isPresent) {
            val user = userEmailOptional.get()
            if (PasswordUtils.checkPassword(password, user.passwordHash)) {
                return ResponseEntity.ok(user)
            } else {
                return ResponseEntity.notFound().build()
            }
        } else {
            val userNameOptional: Optional<User> = userDAO.findByName(identification)
            if (userNameOptional.isPresent) {
                val user = userNameOptional.get()
                if (PasswordUtils.checkPassword(password, user.passwordHash)) {
                    return ResponseEntity.ok(user)
                } else {
                    return ResponseEntity.notFound().build()
                }
            }
        }
        return ResponseEntity.notFound().build()
    }
}