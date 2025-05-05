package com.swapify.swapifyapi.model.entities

import jakarta.persistence.*
import org.hibernate.annotations.ColumnDefault
import org.hibernate.annotations.DynamicInsert
import org.hibernate.annotations.OnDelete
import org.hibernate.annotations.OnDeleteAction
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

    @Column(name = "created_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    open var createdAt: Instant? = null
}