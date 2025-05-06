package com.swapify.swapifyapi.model.entities

import jakarta.persistence.*
import jakarta.persistence.Table
import org.hibernate.annotations.*
import java.time.Instant

@Entity
@Table(name = "messages")
@DynamicInsert
open class Message {
    @Id
    @ColumnDefault("nextval('messages_id_seq')")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    open var id: Int? = null

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "chat_id")
    open var chat: Chat? = null

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "sender_id")
    open var sender: User? = null

    @Column(name = "content", nullable = false, length = Integer.MAX_VALUE)
    open var content: String? = null

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    open var createdAt: Instant? = null
}