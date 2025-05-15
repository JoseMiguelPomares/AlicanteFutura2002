package com.swapify.swapifyapi.services

import com.swapify.api.utils.PasswordUtils
import com.swapify.swapifyapi.model.dao.IUserDAO
import com.swapify.swapifyapi.model.dto.CreditsUserDTO
import com.swapify.swapifyapi.model.dto.ReputationUserDTO
import com.swapify.swapifyapi.model.dto.UserSignInDTO
import com.swapify.swapifyapi.model.dto.SocialAuthUserDTO
import com.swapify.swapifyapi.model.dto.UserProfileDTO
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
    fun getUserById(id: Int): ResponseEntity<User> {
        val user: Optional<User> = userDAO.findById(id)
        return if (user.isPresent) {
            ResponseEntity.ok(user.get())
        } else {
            ResponseEntity.notFound().build()
        }
    }

    //Función para obtener el crédito y reputación de un usuario
    fun getUserCredit(id: Int): ResponseEntity<CreditsUserDTO> {
        val userOptional: Optional<User> = userDAO.findById(id)
        return if (userOptional.isPresent) {
            val user = CreditsUserDTO(
                userOptional.get().id!!,
                userOptional.get().name,
                userOptional.get().credits!!.toInt(),
            )
            ResponseEntity.ok(user)
        } else {
            ResponseEntity.notFound().build()
        }
    }

    //Función para obtener el crédito y reputación de un usuario
    fun getUserReput(id: Int): ResponseEntity<ReputationUserDTO> {
        val userOptional: Optional<User> = userDAO.findById(id)
        return if (userOptional.isPresent) {
            val user = ReputationUserDTO(
                userOptional.get().id!!,
                userOptional.get().name,
                userOptional.get().reputation!!.toDouble(),
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
        user.imageUrl = userSignInDTO.imageUrl // Guardar la URL de la imagen

        userDAO.save(user)
        return ResponseEntity(HttpStatus.CREATED)
    }

    //Función para el login de un usuario
    fun loginUser(identification: String, password: String): ResponseEntity<User> {
        val userEmailOptional: Optional<User> = userDAO.findByEmail(identification)
        if (userEmailOptional.isPresent) {
            val user = userEmailOptional.get()
            if (PasswordUtils.checkPassword(password, user.passwordHash.toString())) {
                return ResponseEntity.ok(user)
            } else {
                return ResponseEntity.notFound().build()
            }
        } else {
            val userNameOptional: Optional<User> = userDAO.findByName(identification)
            if (userNameOptional.isPresent) {
                val user = userNameOptional.get()
                if (PasswordUtils.checkPassword(password, user.passwordHash.toString())) {
                    return ResponseEntity.ok(user)
                } else {
                    return ResponseEntity.notFound().build()
                }
            }
        }
        return ResponseEntity.notFound().build()
    }

    // Función para manejar la autenticación con Google
    fun handleSocialAuth(socialAuthUserDTO: SocialAuthUserDTO): ResponseEntity<User> {
        // Validar que email y nombre no estén vacíos
        if (socialAuthUserDTO.email.isNullOrBlank() || socialAuthUserDTO.name.isNullOrBlank()) {
            println("Email o nombre faltante en SocialAuthUserDTO")
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null)
        }
    
        println("Recibido SocialAuthUserDTO: $socialAuthUserDTO")
    
        return try {
            // Buscar al usuario por email o socialId
            println("Buscando usuario por email: ${socialAuthUserDTO.email}")
            val existingUser = userDAO.findByEmail(socialAuthUserDTO.email)
    
            if (existingUser.isPresent) {
                println("Usuario encontrado: ${existingUser.get()}")
                ResponseEntity.ok(existingUser.get())
            } else {
                println("Creando un nuevo usuario...")
                // Crear un nuevo usuario si no existe
                val newUser = User().apply {
                    name = socialAuthUserDTO.name
                    email = socialAuthUserDTO.email
                    socialId = socialAuthUserDTO.socialId
                    imageUrl = socialAuthUserDTO.imageUrl
                    createdAt = Instant.now()
                    passwordHash = null // Usuarios sociales no requieren contraseña

                }
                userDAO.save(newUser)
                println("Usuario creado: $newUser")
                ResponseEntity.status(HttpStatus.CREATED).body(newUser)
            }
        } catch (ex: Exception) {
            println("Error en handleSocialAuth: ${ex.message}")
            ex.printStackTrace()
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null)
        }
    }

    //Función para cambiar contraseña de usuario
    fun changePassword(id: Int, newPassword: String): ResponseEntity<User> {
        val userOptional: Optional<User> = userDAO.findById(id)
        return if (userOptional.isPresent) {
            val user = userOptional.get()
            user.passwordHash = PasswordUtils.hashSHA256(newPassword)
            userDAO.save(user)
            ResponseEntity.ok(user)
        } else {
            ResponseEntity.notFound().build()
        }
    }

    //Función para buscar un usuario por id de item
    fun getUserByItemId(itemId: Int): ResponseEntity<User> {
        val userOptional: Optional<User> = userDAO.findUserByItemId(itemId)
        return if (userOptional.isPresent) {
            ResponseEntity.ok(userOptional.get())
        } else {
            ResponseEntity.notFound().build()
        }
    }

    //Función para actualizar el perfil de un usuario
    fun updateUserProfile(id: Int, userProfileDTO: UserProfileDTO): ResponseEntity<UserProfileDTO> {
        val userOptional: Optional<User> = userDAO.findById(id)
        return if (userOptional.isPresent) {
            val user = userOptional.get()
            user.name = userProfileDTO.name
            user.email = userProfileDTO.email
            user.imageUrl = userProfileDTO.imageUrl
            user.location = userProfileDTO.location
            user.aboutMe = userProfileDTO.aboutMe
            userDAO.save(user)
            ResponseEntity.ok(userProfileDTO)
        } else {
            ResponseEntity.notFound().build()
        }
    }

    //Función para añadir créditos a un usuario
    fun addCreditsToUser(id: Int, credits: Int): ResponseEntity<CreditsUserDTO> {
        val userOptional: Optional<User> = userDAO.findById(id)
        return if (userOptional.isPresent) {
            val user = userOptional.get()
            user.credits = user.credits!! + credits
            userDAO.save(user)
            
            val creditsDTO = CreditsUserDTO(
                user.id!!,
                user.name,
                user.credits!!.toInt()
            )
            ResponseEntity.ok(creditsDTO)
        } else {
            ResponseEntity.notFound().build()
        }
    }
}