import { Container, Row, Col, Alert, Button, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Heart, ArrowLeft, PersonCircle } from "react-bootstrap-icons";
import { motion } from "framer-motion";
import { ProductCard } from "../components/ProductCard";
import { useFavorites } from "../contexts/FavoritesContext";
import { useAuth } from "../contexts/AuthContext";

export const PaginaFavoritos = () => {
  const { favorites, loading } = useFavorites();
  const { isAuthenticated } = useAuth();

  return (
    <Container className="py-5">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="d-flex align-items-center mb-4">
          <Button as={Link as any} to="/" variant="link" className="text-decoration-none p-0 me-3">
            <ArrowLeft size={24} className="text-muted" />
          </Button>
          <h1 className="mb-0 d-flex align-items-center">
            <Heart className="text-danger me-2" /> Mis Favoritos
          </h1>
        </div>

        {!isAuthenticated ? (
          <Alert variant="info" className="text-center py-5">
            <PersonCircle size={48} className="text-muted mb-3" />
            <h4>Inicia sesión para ver tus favoritos</h4>
            <p className="mb-4">Necesitas iniciar sesión para guardar y ver tus productos favoritos</p>
            <Button as={Link as any} to="/login?redirect=/favoritos" variant="success" className="rounded-pill px-4">
              Iniciar sesión
            </Button>
          </Alert>
        ) : loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="success" />
            <p className="mt-3">Cargando tus favoritos...</p>
          </div>
        ) : favorites.length > 0 ? (
          <>
            <p className="text-muted mb-4">
              Tienes {favorites.length} {favorites.length === 1 ? 'producto' : 'productos'} en tu lista de favoritos.
            </p>
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {favorites.map((producto) => (
                <Col key={producto.id}>
                  <ProductCard producto={producto} />
                </Col>
              ))}
            </Row>
          </>
        ) : (
          <Alert variant="info" className="text-center py-5">
            <Heart size={48} className="text-muted mb-3" />
            <h4>No tienes favoritos</h4>
            <p className="mb-4">Añade productos a tus favoritos para verlos aquí</p>
            <Button as={Link as any} to="/" variant="success" className="rounded-pill px-4">
              Explorar productos
            </Button>
          </Alert>
        )}
      </motion.div>
    </Container>
  );
};