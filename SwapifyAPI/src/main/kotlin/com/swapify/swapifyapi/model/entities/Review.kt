package com.swapify.swapifyapi.model.entities

import jakarta.persistence.*
import jakarta.persistence.Table
import org.hibernate.annotations.*
import java.time.Instant

@Entity
@Table(name = "reviews")
@DynamicInsert
open class Review {
    @Id
    @ColumnDefault("nextval('reviews_id_seq')")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    open var id: Int? = null

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "reviewer_id")
    open var reviewer: User? = null

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "reviewed_id")
    open var reviewed: User? = null

    @Column(name = "rating")
    open var rating: Int? = null

    @Column(name = "comment", length = Integer.MAX_VALUE)
    open var comment: String? = null

    @Column(name = "image_url", length = Integer.MAX_VALUE)
    open var imageUrl: String? = null

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    open var createdAt: Instant? = null
}