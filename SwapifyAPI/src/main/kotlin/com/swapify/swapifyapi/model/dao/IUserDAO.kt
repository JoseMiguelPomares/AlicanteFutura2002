package com.swapify.swapifyapi.model.dao

import com.swapify.swapifyapi.model.entities.User
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface IUserDAO: CrudRepository<User, Int> {
    fun findByEmail(email: String): Optional<User>
    fun findByName(name: String): Optional<User>

    @Query("""
    SELECT u 
    FROM User u 
    WHERE u.id = (SELECT i.user.id 
                    FROM Item i 
                    WHERE i.id = :itemId)
    """)
    fun findUserByItemId(itemId: Int): Optional<User>
}