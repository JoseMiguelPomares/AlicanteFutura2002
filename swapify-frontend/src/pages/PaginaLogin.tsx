"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Container, Card, Button, Form, Row, Col, Alert } from "react-bootstrap"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { ArrowLeft, EnvelopeFill, LockFill, EyeFill, EyeSlashFill } from "react-bootstrap-icons"
import { motion } from "framer-motion"
import ReCAPTCHA from 'react-google-recaptcha';
// En la parte superior, importa el hook useAuth
import { useAuth } from "../contexts/AuthContext"
// Justo después de la importación del useAuth, importamos los íconos para los proveedores sociales
import { Google, Facebook } from "react-bootstrap-icons"

// Reemplazar la función PaginaLogin por esta versión actualizada
export const PaginaLogin = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect");
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [socialAuthLoading, setSocialAuthLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [validated, setValidated] = useState<boolean>(false)
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const { login, loginWithGoogle, loginWithFacebook, error: authError, user } = useAuth()

  useEffect(() => {
    if (authError) {
      setError(authError)
    }
  }, [authError])

  // Redireccionar al usuario después de iniciar sesión
  useEffect(() => {
    if (user) {
      if (redirectPath === "perfil") {
        navigate(`/perfil/${user.id}`);
      } if (redirectPath === "vender") {
        navigate(`/vender/`);
      }
    }
  }, [user, redirectPath, navigate]);

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget

    if (!recaptchaToken) {
      setError("Por favor, completa el captcha.");
      return;
    }

    if (form.checkValidity() === false) {
      e.stopPropagation()
      setValidated(true)
      return
    }

    setValidated(true)
    setLoading(true)
    setError(null)

    try {
      await login(email, password)
      // Usar la nueva función de redirección
    } catch (error) {
      setError("Credenciales inválidas. Por favor, verifica tu email y contraseña.")
    } finally {
      setLoading(false)
    }
  }

  // Actualizar las funciones de login social para usar la nueva función de redirección
  const handleGoogleLogin = async () => {
    try {
      setSocialAuthLoading(true)
      setError(null)
      await loginWithGoogle()
    } catch (error) {
      // El error ya se establece en el contexto de autenticación
    } finally {
      setSocialAuthLoading(false)
    }
  }

  const handleFacebookLogin = async () => {
    try {
      setSocialAuthLoading(true)
      setError(null)
      await loginWithFacebook()
    } catch (error) {
      // El error ya se establece en el contexto de autenticación
    } finally {
      setSocialAuthLoading(false)
    }
  }

  const handleRecaptchaChange = (token: string | null) => {
    console.log("Captcha value:", token);
    setRecaptchaToken(token);
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6} xl={5}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="bg-success text-white p-4 text-center">
                <h2 className="fw-bold mb-0">Iniciar Sesión</h2>
                <p className="mb-0 mt-2 opacity-75">Accede a tu cuenta de Swapify</p>
              </div>

              <Card.Body className="p-4">
                <Button variant="link" className="text-muted p-0 mb-4" onClick={() => navigate(-1)}>
                  <ArrowLeft className="me-1" /> Volver
                </Button>

                {error && (
                  <Alert variant="danger" className="mb-4">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleEmailLogin} noValidate validated={validated}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <EnvelopeFill />
                      </span>
                      <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" />
                      <Form.Control.Feedback type="invalid">Please provide a valid email.</Form.Control.Feedback>
                    </div>
                  </Form.Group>
                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <LockFill />
                      </span>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? <EyeSlashFill /> : <EyeFill />}
                      </Button>
                      <Form.Control.Feedback type="invalid">
                        Please provide a password.
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                  <ReCAPTCHA
                    sitekey="6Lf0uhsrAAAAAKDLPOCYU7-o8IYLQghrLo_N4Swx"
                    onChange={handleRecaptchaChange}
                    className="mt-3"
                  />

                  <div className="d-flex justify-content-center mt-3">
                    <Button variant="primary" type="submit" disabled={loading || !recaptchaToken}>
                      Login
                    </Button>
                  </div>
                </Form>

                <div className="my-4">
                  <div className="text-center mb-3">
                    <span className="text-muted">O inicia sesión con</span>
                  </div>
                  <div className="d-grid gap-2">
                    <Button
                      variant="outline-danger"
                      className="d-flex align-items-center justify-content-center gap-2"
                      onClick={handleGoogleLogin}
                      disabled={socialAuthLoading}
                    >
                      <Google size={20} />
                      <span>Continuar con Google</span>
                    </Button>

                    {/* Botón de Facebook */}
                    <Button
                      variant="outline-primary"
                      className="d-flex align-items-center justify-content-center gap-2"
                      onClick={handleFacebookLogin}
                      disabled={socialAuthLoading}
                    >
                      <Facebook size={20} />
                      <span>Continuar con Facebook</span>
                    </Button>
                  </div>
                </div>

                <div className="text-center mt-4">
                  <p className="mb-0">
                    ¿No tienes cuenta?{" "}
                    <Link to="/registro" className="text-success fw-bold">
                      Regístrate
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>

            <div className="text-center mt-4">
              <p className="text-muted small">
                Al iniciar sesión, aceptas nuestros{" "}
                <Link to="/terminos" className="text-decoration-none">
                  Términos y Condiciones
                </Link>{" "}
                y{" "}
                <Link to="/privacidad" className="text-decoration-none">
                  Política de Privacidad
                </Link>
                .
              </p>
            </div>
          </motion.div>
        </Col>
      </Row>
    </Container>
  )
}