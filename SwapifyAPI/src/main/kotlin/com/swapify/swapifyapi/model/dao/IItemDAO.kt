package com.swapify.swapifyapi.model.dao

import com.swapify.swapifyapi.model.entities.Item
import org.springframework.data.repository.CrudRepository

interface IItemDAO: CrudRepository<Item, Long> {
}