package com.swapify.swapifyapi.model.dao

import com.swapify.swapifyapi.model.entities.User
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface IUserDAO: CrudRepository<User, Long> {
}