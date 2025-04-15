-- Registros de ejemplo para la tabla users
INSERT INTO users (name, email, password_hash, location, credits, reputation) VALUES
('Juan Pérez', 'juan.perez@example.com', '$2a$10$xJwL5v5zZzU9QbZfQbY1UeJwVJZJZJZJZJZJZJZJZJZJZJZJZJZJZJZ', 'Madrid', 150, 4.8),
('María García', 'maria.garcia@example.com', '$2a$10$xJwL5v5zZzU9QbZfQbY1UeJwVJZJZJZJZJZJZJZJZJZJZJZJZJZJZJZ', 'Barcelona', 200, 4.9),
('Carlos López', 'carlos.lopez@example.com', '$2a$10$xJwL5v5zZzU9QbZfQbY1UeJwVJZJZJZJZJZJZJZJZJZJZJZJZJZJZJZ', 'Valencia', 80, 4.5),
('Ana Martínez', 'ana.martinez@example.com', '$2a$10$xJwL5v5zZzU9QbZfQbY1UeJwVJZJZJZJZJZJZJZJZJZJZJZJZJZJZ', 'Sevilla', 120, 4.7);

-- Registros de ejemplo para la tabla items
INSERT INTO items (user_id, title, description, category_id, image_url, price, item_condition, location, status) VALUES
(1, 'Bicicleta de montaña', 'Bicicleta en perfecto estado, usada solo 3 veces', 9, 'https://images.unsplash.com/photo-1575585269294-7d28dd912db8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGJpY2ljbGV0YSUyMG1vbnRhJUMzJUIxYXxlbnwwfHwwfHx8MA%3D%3D', 0.0, 'como_nuevo', 'Madrid', 'Available'),
(2, 'Libro de programación', 'Libro de JavaScript ES6, como nuevo', 11, 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bGlicm8lMjBqYXZhc2NyaXB0fGVufDB8fDB8fHwy', 0.0, 'bueno', 'Barcelona', 'Available'),
(3, 'Sofá de piel', 'Sofá de dos plazas en buen estado', 5, 'https://images.unsplash.com/photo-1512212621149-107ffe572d2f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c29mYSUyMGRvcyUyMHBsYXphc3xlbnwwfHwwfHx8Mg%3D%3D', 0.0, 'aceptable', 'Valencia', 'Available'),
(4, 'Guitarra eléctrica', 'Guitarra Fender Stratocaster, nueva', 10, 'https://images.unsplash.com/photo-1606041281659-3f2cec516ac0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZmVuZGVyJTIwc3RyYXRvY2FzdGVyfGVufDB8fDB8fHwy', 0.0, 'nuevo', 'Sevilla', 'Available'),
(1, 'Clases de guitarra', 'Clases presenciales para principiantes', 8, 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Y2xhc2VzJTIwZ3VpdGFycmF8ZW58MHx8MHx8fDI%3D', 0.0, NULL, 'Madrid', 'Available'),
(2, 'Reparación de ordenadores', 'Servicio técnico a domicilio', 7, 'https://images.unsplash.com/photo-1604754742629-3e5728249d73?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVwYXJhY2lvbiUyMG9yZGVuYWRvcmVzfGVufDB8fDB8fHwy', 0.0, NULL, 'Barcelona', 'Available');

-- Registros de ejemplo para la tabla favorites
INSERT INTO favorites (user_id, item_id) VALUES
(1, 2),
(1, 4),
(2, 1),
(3, 4),
(4, 3);

-- Registros de ejemplo para la tabla transactions
INSERT INTO transactions (item_id, requester_id, owner_id, status, final_price) VALUES
(1, 2, 1, 'Completed', 0.0),
(3, 4, 3, 'Pending', 0.0),
(4, 1, 4, 'Rejected', 0.0);

-- Registros de ejemplo para la tabla chats
INSERT INTO chats (transaction_id) VALUES
(1),
(2),
(3);

-- Registros de ejemplo para la tabla messages
INSERT INTO messages (chat_id, sender_id, content) VALUES
(1, 2, 'Hola, me interesa tu bicicleta, ¿está disponible?'),
(1, 1, 'Sí, todavía está disponible. ¿Quieres quedar para verla?'),
(2, 4, 'Buenas, ¿el sofá sigue disponible?'),
(3, 1, 'Hola, ¿la guitarra es la versión profesional?');

-- Registros de ejemplo para la tabla reviews
INSERT INTO reviews (reviewer_id, reviewed_id, rating, comment) VALUES
(2, 1, 5, 'Excelente trato y producto en perfecto estado'),
(1, 2, 4, 'Todo correcto, pero llegó un poco tarde'),
(3, 4, 5, 'Muy satisfecho con el intercambio');