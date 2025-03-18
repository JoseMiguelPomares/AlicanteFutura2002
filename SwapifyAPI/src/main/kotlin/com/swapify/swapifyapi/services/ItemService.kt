package com.swapify.swapifyapi.services

import com.swapify.swapifyapi.model.dao.IItemDAO
import com.swapify.swapifyapi.model.entities.Item
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class ItemService {

    @Autowired
    lateinit var itemDAO: IItemDAO

    //Función para obtener todos los items de un usuario
    fun getItemsByUserId(userId: Long): List<Item>{
        val items: List<Item> = itemDAO.findByUserIdWithAll(userId)
        return if (items.isNotEmpty()){
            items
        } else {
            emptyList()
        }
    }
}