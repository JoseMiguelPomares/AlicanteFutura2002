package com.swapify.swapifyapi.model.dao

import com.swapify.swapifyapi.model.entities.Category
import org.springframework.data.repository.CrudRepository

interface ICategoryDAO: CrudRepository<Category, Long> {
}