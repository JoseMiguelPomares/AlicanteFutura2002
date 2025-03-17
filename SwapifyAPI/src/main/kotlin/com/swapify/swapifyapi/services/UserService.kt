package com.swapify.swapifyapi.services

import com.swapify.swapifyapi.model.dao.IUserDAO
import com.swapify.swapifyapi.model.dto.UserDTO
import com.swapify.swapifyapi.model.entities.User
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import java.util.*

@Service
class UserService {

    @Autowired
    lateinit var userDAO: IUserDAO

    fun getUsers(): MutableIterable<User> {
        return userDAO.findAll()
    }

    fun getUserById(id: Long): ResponseEntity<User> {
        val user: Optional<User> = userDAO.findById(id)
        return if (user.isPresent) {
            ResponseEntity.ok(user.get())
        } else {
            ResponseEntity.notFound().build()
        }
    }

    fun getUserReputCredit(id: Long): ResponseEntity<UserDTO> {
        val userOptional: Optional<User> = userDAO.findById(id)
        return if (userOptional.isPresent) {
            val user = UserDTO(userOptional.get().id!!.toLong(), userOptional.get().name, userOptional.get().credits!!.toInt(), userOptional.get().reputation!!.toDouble())
            ResponseEntity.ok(user)
        } else {
            ResponseEntity.notFound().build()
        }
    }
}