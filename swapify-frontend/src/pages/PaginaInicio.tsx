import { Link } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ItemService } from "../services/itemService";

// Define la interfaz Producto
interface Producto {
  id: number;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  status: string;
  createdAt: string;
}



export const PaginaInicio = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const itemService = useRef(new ItemService()).current; // Instancia única

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await itemService.getAll();
        setProductos(data);
      } catch (error: any) {
        setError("No se pudieron cargar los productos");
        console.error(error);
      }
    };

    fetchProductos();
  }, []); // Sin dependencias adicionales

  if (error) return <p className="text-danger text-center">{error}</p>;

  return (
    <Container className="mt-4">
      <motion.h1
        className="mb-4 text-center fw-bold gradient-text"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}>
        ¡Explora los Mejores Productos y Servicios!
      </motion.h1>
      <Row xs={2} sm={2} md={3} lg={4} className="g-4 justify-content-center">
        {productos.map((producto) => (
          <Col key={producto.id}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link to={`/productos/${producto.id}`} className="text-decoration-none">
                <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                  <Card.Img
                    variant="top"
                    src={producto.imageUrl}
                    alt={producto.title}
                    className="img-fluid rounded-top"
                    style={{ height: "250px", objectFit: "cover" }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="fw-bold text-dark" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", }}>{producto.title}</Card.Title>
                    <Card.Text className="text-muted small" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", }}>{producto.description}</Card.Text>
                    <div className="mt-auto">
                      <h5 className="fw-bold text-primary">{producto.category}</h5>
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