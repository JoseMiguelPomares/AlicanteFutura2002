package com.swapify.swapifyapi.model.entities

import jakarta.persistence.*
import jakarta.persistence.Table
import org.hibernate.annotations.*
import java.math.BigDecimal
import java.time.Instant

@Entity
@Table(name = "items")
@DynamicInsert
open class Item {
    @Id
    @ColumnDefault("nextval('items_id_seq')")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    open var id: Int? = null

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id")
    open var user: User? = null

    @Column(name = "title", nullable = false)
    open var title: String? = null

    @Column(name = "description", length = Integer.MAX_VALUE)
    open var description: String? = null

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    open var category: Category? = null

    @Column(name = "image_url", length = Integer.MAX_VALUE)
    open var imageUrl: String? = null

    @ColumnDefault("0.0")
    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    open var price: BigDecimal? = null

    @Column(name = "item_condition", length = 50)
    open var itemCondition: String? = null

    @Column(name = "location")
    open var location: String? = null

    @Column(name = "status", length = 50)
    open var status: String? = "Available"

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    open var createdAt: Instant? = null
}