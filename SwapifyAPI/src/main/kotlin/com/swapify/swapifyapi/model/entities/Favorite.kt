package com.swapify.swapifyapi.model.entities

import jakarta.persistence.*
import jakarta.persistence.Table
import org.hibernate.annotations.*
import java.time.Instant

@Entity
@Table(name = "favorites")
@DynamicInsert
open class Favorite {
    @Id
    @ColumnDefault("nextval('favorites_id_seq')")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    open var id: Int? = null

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id")
    open var user: User? = null

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "item_id")
    open var item: Item? = null

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    open var createdAt: Instant? = null
}