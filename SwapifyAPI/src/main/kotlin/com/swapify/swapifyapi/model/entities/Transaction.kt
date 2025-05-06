package com.swapify.swapifyapi.model.entities

import jakarta.persistence.*
import jakarta.persistence.Table
import org.hibernate.annotations.*
import java.math.BigDecimal
import java.time.Instant

@Entity
@Table(name = "transactions")
@DynamicInsert
open class Transaction {
    @Id
    @ColumnDefault("nextval('transactions_id_seq')")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    open var id: Int? = null

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "item_id")
    open var item: Item? = null

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "requester_id")
    open var requester: User? = null

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "owner_id")
    open var owner: User? = null

    @Column(name = "status", length = 50, columnDefinition = "varchar(50) default 'Pending'")
    open var status: String? = null

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    open var createdAt: Instant? = null

    @Column(name = "completed_at")
    open var completedAt: Instant? = null

    @Column(name = "final_price", precision = 10, scale = 2)
    open var finalPrice: BigDecimal? = null
}