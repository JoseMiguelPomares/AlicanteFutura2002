import { Container, Card, Button, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { X } from "react-bootstrap-icons";
import { useState } from "react";
import authService from "../services/authService";

export const PaginaRegistro = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    try {
      const response = await authService.register(email, password);
      localStorage.setItem('token', response.data.token);
      navigate("/");
    } catch (error) {
      setError("Error en el registro");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 shadow-lg text-center" style={{ maxWidth: "400px", width: "100%" }}>
        {/* Botón de cerrar (X) */}
        <X
          size={45}
          className="position-absolute top-0 end-0 m-3 text-muted cursor-pointer"
          onClick={() => navigate(-1)}
          style={{ cursor: "pointer" }}
        />
        <Image src="https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cmVnaXN0cm98ZW58MHx8MHx8fDI%3D"></Image>
        <h2 className="fw-bold mb-3">Regístrate en Swapify</h2>

        {error && <p className="text-danger">{error}</p>}

        <input
          type="email"
          className="form-control mb-2"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="success" className="w-100" onClick={handleRegister}>
          Registrarse
        </Button>

        {/* Enlace a Login */}
        <p className="mt-3 text-muted">
          ¿Ya tienes cuenta en Swapify?{" "}
          <Link to="/login" className="text-success fw-bold">Inicia Sesión</Link>
        </p>
      </Card>
    </Container>
  );
};
