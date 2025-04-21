"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Container, Card, Button, Form, Row, Col, Alert, ProgressBar } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, EnvelopeFill, LockFill, PersonFill, EyeFill, EyeSlashFill, Google } from "react-bootstrap-icons"
import { motion } from "framer-motion"
import { UserService } from "../services/userService"
import { useAuth } from "../contexts/AuthContext"
import ReCAPTCHA from "react-google-recaptcha" // Importar el componente oficial

export const PaginaRegistro = () => {
  const navigate = useNavigate()
  const { login, loginWithGoogle, error: authError } = useAuth()
  const userService = new UserService()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [socialAuthLoading, setSocialAuthLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [validated, setValidated] = useState<boolean>(false)
  const [step, setStep] = useState<number>(1)
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false)
  // Añadir estados para controlar si los campos de contraseña han sido tocados
  const [passwordTouched, setPasswordTouched] = useState<boolean>(false)
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState<boolean>(false)


  useEffect(() => {
    if (authError) {
      setError(authError)
    }
  }, [authError])

  // Añadir un efecto para cargar el script de reCAPTCHA manualmente
  useEffect(() => {
    // Solo cargar el script si estamos en el paso 2
    if (step === 2 && !document.querySelector('script[src*="recaptcha"]')) {
      const script = document.createElement("script")
      script.src = "https://www.google.com/recaptcha/api.js"
      script.async = true
      script.defer = true
      script.onload = () => {
        console.log("Script de reCAPTCHA cargado")
        setRecaptchaLoaded(true)
      }
      document.body.appendChild(script)
    }
  }, [step])

  const handleGoogleLogin = async () => {
    setSocialAuthLoading(true)
    setError(null)
    try {
      await loginWithGoogle()
      navigate("/")
    } catch (error: any) {
      setError(error.message || "Error al iniciar sesión con Google")
    } finally {
      setSocialAuthLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Marcar los campos como tocados cuando cambian
    if (name === "password") {
      setPasswordTouched(true)
    }
    if (name === "confirmPassword") {
      setConfirmPasswordTouched(true)
    }


    // Resetear errores cuando el usuario cambia los datos
    if (error) setError(null)
  }

  const handleNextStep = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget

    setValidated(true) // Marcar como validado para mostrar errores del paso 1 si los hay

    if (form.checkValidity() === false) {
      e.stopPropagation()
      return
    }

    // Si la validación del paso 1 es exitosa, pasar al paso 2 y reiniciar 'validated'
    setStep(2)
    setValidated(false) // Reiniciar para la validación del paso 2
  }

  const handleRecaptchaChange = (token: string | null) => {
    console.log("Captcha value:", token)
    setRecaptchaToken(token)
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget

    setValidated(true) // Marcar como validado para mostrar errores del paso 2

    // Comprobar validez del formulario y coincidencia de contraseñas
    if (form.checkValidity() === false || formData.password !== formData.confirmPassword) {
      e.stopPropagation()
      // Asegurarse de que el campo de confirmar contraseña se marque como tocado si hay error de coincidencia
      if (formData.password !== formData.confirmPassword) {
          setConfirmPasswordTouched(true)
          setError("Las contraseñas no coinciden") // Establecer error específico si no coinciden
      }
      return
    }

    setValidated(true)
    setLoading(true)
    setError(null)

    try {
      await userService.register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        recaptchaToken: recaptchaToken, // Enviar el token al servidor
      })

      await login(formData.email, formData.password)
      navigate("/")
    } catch (error: any) {
      // Manejo de errores más específico
      if (error.code === "auth/email-already-in-use") {
        setError("Este correo electrónico ya está registrado")
      } else if (error.code === "auth/invalid-email") {
        setError("El formato del correo electrónico no es válido")
      } else if (error.code === "auth/weak-password") {
        setError("La contraseña es demasiado débil")
      } else {
        setError(error.message || "Error en el registro. Por favor, inténtalo de nuevo.")
      }
    } finally {
      setLoading(false)
    }
  }

  const passwordStrength = (): { strength: string; color: string; percentage: number } => {
    const { password } = formData
    if (!password) return { strength: "Débil", color: "danger", percentage: 0 }

    if (password.length < 6) return { strength: "Débil", color: "danger", percentage: 33 }
    if (password.length < 8) return { strength: "Media", color: "warning", percentage: 66 }
    return { strength: "Fuerte", color: "success", percentage: 100 }
  }

  const { strength, color, percentage } = passwordStrength()

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6} xl={5}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="bg-success text-white p-4 text-center">
                <h2 className="fw-bold mb-0">Crear Cuenta</h2>
                <p className="mb-0 mt-2 opacity-75">Únete a la comunidad de Swapify</p>
              </div>

              <Card.Body className="p-4">
                <Button
                  variant="link"
                  className="text-muted p-0 mb-4"
                  onClick={() => (step === 1 ? navigate(-1) : setStep(1))}
                >
                  <ArrowLeft className="me-1" /> {step === 1 ? "Volver" : "Paso anterior"}
                </Button>

                {error && (
                  <Alert variant="danger" className="mb-4">
                    {error}
                  </Alert>
                )}

                {step === 1 ? (
                  // Formulario Paso 1
                  <Form noValidate validated={validated} onSubmit={handleNextStep}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre completo</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <PersonFill />
                        </span>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Ingresa tu nombre"
                          required
                          minLength={3}
                        />
                        <Form.Control.Feedback type="invalid">
                          Por favor ingresa tu nombre completo
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Correo electrónico</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <EnvelopeFill />
                        </span>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="ejemplo@correo.com"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Por favor ingresa un correo electrónico válido
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>

                    <div className="d-grid mt-4">
                      <Button variant="primary" type="submit">
                        Continuar
                      </Button>
                    </div>

                    <div className="text-center my-4">
                      <span className="text-muted">O regístrate con</span>
                    </div>

                    <div className="d-grid">
                      <Button
                        variant="outline-secondary"
                        onClick={handleGoogleLogin}
                        disabled={socialAuthLoading}
                        className="d-flex align-items-center justify-content-center gap-2"
                      >
                        <Google /> Continuar con Google
                      </Button>
                    </div>

                    <div className="text-center mt-4">
                      <span className="text-muted">¿Ya tienes cuenta? </span>
                      <Link to="/login" className="text-decoration-none">
                        Iniciar sesión
                      </Link>
                    </div>
                  </Form>
                ) : (
                  // Formulario Paso 2
                  <Form noValidate validated={validated} onSubmit={handleRegister}>
                    <Form.Group className="mb-3">
                      <Form.Label>Contraseña</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <LockFill />
                        </span>
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Crea tu contraseña"
                          required
                          minLength={6}
                          // Marcar como inválido solo si ha sido tocado y no cumple la longitud mínima
                          isInvalid={passwordTouched && formData.password.length < 6}
                        />
                        <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeSlashFill /> : <EyeFill />}
                        </Button>
                        <Form.Control.Feedback type="invalid">
                          La contraseña debe tener al menos 6 caracteres
                        </Form.Control.Feedback>
                      </div>
                      {/* Mostrar fortaleza solo si se ha empezado a escribir */}
                      {passwordTouched && formData.password && (
                        <div className="mt-2">
                          <small className={`text-${color}`}>Seguridad: {strength}</small>
                          <ProgressBar variant={color} now={percentage} className="mt-1" style={{ height: "5px" }} />
                        </div>
                      )}
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Confirmar contraseña</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <LockFill />
                        </span>
                        <Form.Control
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Repite tu contraseña"
                          required
                          // Marcar como inválido solo si ha sido tocado y no coincide con la contraseña
                          isInvalid={confirmPasswordTouched && formData.password !== formData.confirmPassword}
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeSlashFill /> : <EyeFill />}
                        </Button>
                        {/* Mostrar el feedback solo si ha sido tocado y no coincide */}
                        {confirmPasswordTouched && formData.password !== formData.confirmPassword && (
                           <Form.Control.Feedback type="invalid">Las contraseñas no coinciden</Form.Control.Feedback>
                        )}
                      </div>
                    </Form.Group>

                    <div className="my-3">
                      {/* Mostrar un mensaje de carga mientras el reCAPTCHA se carga */}
                      

                      {/* Usar el componente ReCAPTCHA directamente */}
                      <div className="d-flex justify-content-center">
                        <ReCAPTCHA
                          sitekey="6Lf0uhsrAAAAAKDLPOCYU7-o8IYLQghrLo_N4Swx"
                          onChange={handleRecaptchaChange}
                          onLoad={() => setRecaptchaLoaded(true)}
                        />
                      </div>

                      {!recaptchaToken && validated && (
                        <div className="text-danger small mt-1 text-center">Por favor, completa el captcha</div>
                      )}
                    </div>

                    <div className="d-grid">
                      <Button variant="primary" type="submit" disabled={loading || !recaptchaToken}>
                        {loading ? "Creando cuenta..." : "Crear Cuenta"}
                      </Button>
                    </div>
                  </Form>
                )}
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  )
}
