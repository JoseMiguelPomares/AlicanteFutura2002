package com.swapify.swapifyapi.model.dao

import com.swapify.swapifyapi.model.entities.Favorite
import org.springframework.data.repository.CrudRepository

interface IFavoriteDAO: CrudRepository<Favorite, Long> {
}