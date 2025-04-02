package com.swapify.swapifyapi.services

import com.swapify.swapifyapi.model.dao.ICategoryDAO
import com.swapify.swapifyapi.model.entities.Category
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class CategoryService {

    @Autowired
    lateinit var categoryDAO: ICategoryDAO

    //Función para obtener todas las categorías
    fun getCategories(): List<Category>{
        val categories: MutableIterable<Category> = categoryDAO.findAll()
        return if (categories.iterator().hasNext()){
            categories.toList()
        } else {
            emptyList()
        }
    }
}