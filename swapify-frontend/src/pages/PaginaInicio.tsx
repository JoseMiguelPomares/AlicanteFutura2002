import { Link } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

//! PRODUCTOS MOCKEADOS
interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
}

const mockProducts: Producto[] = [
  {
    id: 1,
    nombre: "Clases de Guitarra",
    descripcion: "4 sesiones de 1 hora para todos los niveles",
    precio: 80,
    imagen: "https://plus.unsplash.com/premium_photo-1681396936891-ed738c53cb21?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2xhc2VzJTIwZ3VpdGFycmF8ZW58MHx8MHx8fDA%3D"
  },
  {
    id: 2,
    nombre: "Jardinería Profesional",
    descripcion: "Servicio completo de mantenimiento de jardines",
    precio: 120,
    imagen: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    nombre: "Bicicleta Montaña",
    descripcion: "Bicicleta Trek Marlin 5 casi nueva, talla M",
    precio: 250,
    imagen: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    nombre: "Traducción Inglés-Español",
    descripcion: "Servicio profesional de traducción de documentos",
    precio: 45,
    imagen: "https://media.istockphoto.com/id/518819490/es/foto/ingl%C3%A9s-traducci%C3%B3n-al-espa%C3%B1ol.webp?a=1&b=1&s=612x612&w=0&k=20&c=eFjz6PgxirVA6bDNFDtwIZjF5T7b_HtQqLflGQrI0zk="
  },
  {
    id: 5,
    nombre: "Mueble de Jardín",
    descripcion: "Juego de mesa y 4 sillas en ratán sintético",
    precio: 180,
    imagen: "https://images.unsplash.com/photo-1598300056393-4aac492f4344?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    nombre: "Cuidado de Mascotas",
    descripcion: "Cuidado diario para perros y gatos mientras viajas",
    precio: 30,
    imagen: "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 7,
    nombre: "Libros de Cocina",
    descripcion: "Colección de 5 libros de cocina internacional",
    precio: 60,
    imagen: "https://images.unsplash.com/photo-1546548970-71785318a17b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  }
];

export const PaginaInicio = () => {
  const [productos, setProductos] = useState<Producto[]>(mockProducts);

  return (
    <Container className="mt-4">
      <h1 className="mb-4 text-center fw-bold">Productos</h1>
      <Row xs={2} sm={2} md={3} lg={4} className="g-4 justify-content-center">
        {productos.map((producto) => (
          <Col key={producto.id}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link to={`/productos/${producto.id}`} className="text-decoration-none">
                <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                  <Card.Img
                    variant="top"
                    src={producto.imagen}
                    alt={producto.nombre}
                    className="img-fluid rounded-top"
                    style={{ height: "250px", objectFit: "cover" }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="fw-bold text-dark" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",}}>{producto.nombre}</Card.Title>
                    <Card.Text className="text-muted small" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",}}>{producto.descripcion}</Card.Text>
                    <div className="mt-auto">
                      <h5 className="fw-bold text-primary">{producto.precio} Créditos</h5>
                    </div>
                  </Card.Body>
                </Card>
              </Link>
            </motion.div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};
