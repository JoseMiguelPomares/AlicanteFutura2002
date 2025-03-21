package com.swapify.swapifyapi.model.entities

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import jakarta.persistence.*
import org.hibernate.annotations.ColumnDefault
import java.time.Instant

@Entity
@JsonIgnoreProperties("hibernateLazyInitializer", "handler")
@Table(name = "users")
open class User {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "users_id_gen")
    @SequenceGenerator(name = "users_id_gen", sequenceName = "users_id_seq", allocationSize = 1)
    @Column(name = "id", nullable = false)
    open var id: Int? = null

    @Column(name = "name", nullable = false, length = 100)
    open var name: String? = null

    @Column(name = "email", nullable = false, length = 100)
    open var email: String? = null

    @Column(name = "password_hash", nullable = false, length = Integer.MAX_VALUE)
    open var passwordHash: String? = null

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