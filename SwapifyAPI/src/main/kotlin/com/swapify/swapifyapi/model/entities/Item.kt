package com.swapify.swapifyapi.model.entities

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import jakarta.persistence.*
import org.hibernate.annotations.ColumnDefault
import org.hibernate.annotations.OnDelete
import org.hibernate.annotations.OnDeleteAction
import java.time.Instant

@Entity
@Table(name = "items")
@JsonIgnoreProperties("hibernateLazyInitializer", "handler")
open class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "items_id_gen")
    @SequenceGenerator(name = "items_id_gen", sequenceName = "items_id_seq", allocationSize = 1)
    @Column(name = "id", nullable = false)
    open var id: Int? = null

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id")
    open var user: User? = null

    @Column(name = "title", nullable = false)
    open var title: String? = null

    @Column(name = "description", nullable = false, length = Integer.MAX_VALUE)
    open var description: String? = null

    @Column(name = "category", length = 100)
    open var category: String? = null

    @Column(name = "image_url", length = Integer.MAX_VALUE)
    open var imageUrl: String? = null

    @ColumnDefault("'available'")
    @Column(name = "status", length = 50)
    open var status: String? = null

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    open var createdAt: Instant? = null
}