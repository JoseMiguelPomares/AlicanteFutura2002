import { Container, Card, Button, Image } from "react-bootstrap";
import { Google, Facebook, X } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider, facebookProvider } from "../firebase/firebaseConfig";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";

export const PaginaLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            console.log("Usuario autenticado con Google:", result.user);
            navigate("/");
        } catch (error) {
            setError("Error al iniciar sesión con Google");
            console.error(error);
        }
    };

    const handleFacebookLogin = async () => {
        try {
            const result = await signInWithPopup(auth, facebookProvider);
            console.log("Usuario autenticado con Facebook:", result.user);
            navigate("/");
        } catch (error) {
            setError("Error al iniciar sesión con Facebook");
            console.error(error);
        }
    };

    const handleEmailLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch (error) {
            setError("Correo o contraseña incorrectos");
            console.error(error);
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

                <Button variant="outline-dark" className="w-100 d-flex align-items-center justify-content-center gap-2 mb-3" onClick={handleGoogleLogin}>
                    <Google size={20} />
                    <span>Iniciar con Google</span>
                </Button>

                <Button variant="primary" className="w-100 d-flex align-items-center justify-content-center gap-2 mb-3" onClick={handleFacebookLogin}>
                    <Facebook size={20} />
                    <span>Iniciar con Facebook</span>
                </Button>

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
