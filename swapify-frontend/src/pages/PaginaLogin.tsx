import { Container, Card, Button, Image } from "react-bootstrap";
 import { X } from "react-bootstrap-icons";
 import { Link, useNavigate } from "react-router-dom";
 
 import { useState } from "react";
 import authService from "../services/authService";

 export const PaginaLogin = () => {
     const navigate = useNavigate();
     const [email, setEmail] = useState<string>("");
     const [password, setPassword] = useState<string>("");
     const [error, setError] = useState<string | null>(null);

     

     const handleEmailLogin = async () => {
         try {
             const response = await authService.login(email, password);
             localStorage.setItem('token', response.data.token);
             navigate("/");
         } catch (error) {
             setError("Credenciales inválidas");
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
                 <Image src="https://upload.wikimedia.org/wikipedia/commons/6/64/Ejemplo.png"></Image>

                 <h2 className="fw-bold mb-3">Inicia Sesión en Swapify</h2>

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
                 {/* Eliminar botones de Google y Facebook */}
                 <Button variant="success" className="w-100" onClick={handleEmailLogin}>
                     Iniciar Sesión
                 </Button>

                 <p className="mt-3 text-muted">
                     ¿No tienes cuenta? <Link to="/registro" className="text-success fw-bold">Regístrate</Link>
                 </p>
             </Card>
         </Container>
     );
 };
