package com.swapify.swapifyapi.model.entities

import jakarta.persistence.*
import org.hibernate.annotations.ColumnDefault
import org.hibernate.annotations.OnDelete
import org.hibernate.annotations.OnDeleteAction
import java.time.Instant

@Entity
@Table(name = "chats")
open class Chat {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "chats_id_gen")
    @SequenceGenerator(name = "chats_id_gen", sequenceName = "chats_id_seq", allocationSize = 1)
    @Column(name = "id", nullable = false)
    open var id: Int? = null

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "transaction_id")
    open var transaction: Transaction? = null

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    open var createdAt: Instant? = null
}