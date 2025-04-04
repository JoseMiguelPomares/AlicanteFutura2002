package com.swapify.swapifyapi.model.entities

import jakarta.persistence.*
import org.hibernate.annotations.ColumnDefault
import org.hibernate.annotations.DynamicInsert
import java.time.Instant

@Entity
@Table(name = "users")
@DynamicInsert
open class User {
    @Id
    @ColumnDefault("nextval('users_id_seq')")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    open var id: Int? = null

    @Column(name = "name", nullable = false, length = 100)
    open var name: String? = null

    @Column(name = "email", nullable = false, length = 100)
    open var email: String? = null

    @Column(name = "password_hash", nullable = false, length = Integer.MAX_VALUE)
    open var passwordHash: String? = null

    @Column(name = "location")
    open var location: String? = null

    @ColumnDefault("100")
    @Column(name = "credits")
    open var credits: Int? = null

    @ColumnDefault("5.0")
    @Column(name = "reputation")
    open var reputation: Double? = null

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    open var createdAt: Instant? = null
}