package com.swapify.swapifyapi.model.entities

import jakarta.persistence.*
import org.hibernate.annotations.DynamicInsert

@Entity
@Table(name = "categories")
@DynamicInsert
open class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "categories_id_gen")
    @SequenceGenerator(name = "categories_id_gen", sequenceName = "categories_id_seq", allocationSize = 1)
    @Column(name = "id", nullable = false)
    open var id: Int? = null

    @Column(name = "name", nullable = false, length = 100)
    open var name: String? = null
}