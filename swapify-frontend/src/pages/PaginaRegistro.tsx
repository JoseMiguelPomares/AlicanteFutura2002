// import { Container, Card, Button, Image } from "react-bootstrap";
// import { Google, Facebook, X } from "react-bootstrap-icons";
// import { Link, useNavigate } from "react-router-dom";
// import { auth, facebookProvider, googleProvider, signInWithPopup } from "../firebase/firebaseConfig";

// export const PaginaRegistro = () => {
//   const navigate = useNavigate();

//   const handleGoogleLogin = async () => {
//     try {
//       const result = await signInWithPopup(auth, googleProvider);
//       console.log("Usuario autenticado con Google:", result.user);
//       navigate("/"); // Redirigir a inicio después de autenticarse
//     } catch (error) {
//       console.error("Error en la autenticación con Google:", error);
//     }
//   };

//   const handleFacebookLogin = async () => {
//     try {
//       const result = await signInWithPopup(auth, facebookProvider);
//       console.log("Usuario Autenticado con Facebook:", result.user);
//       navigate("/");
//     } catch (error) {
//       console.error("Error en autenticación con Facebook:", error);
//     }
//   };

//   return (
//     <Container className="d-flex justify-content-center align-items-center vh-100">
//       <Card className="p-4 shadow-lg text-center" style={{ maxWidth: "400px", width: "100%" }}>
//         {/* Botón de cerrar (X) */}
//         <X
//           size={45}
//           className="position-absolute top-0 end-0 m-3 text-muted cursor-pointer"
//           onClick={() => navigate(-1)}
//           style={{ cursor: "pointer" }}
//         />
//         <Image src="https://upload.wikimedia.org/wikipedia/commons/6/64/Ejemplo.png"></Image>
//         <h2 className="fw-bold mb-3">Regístrate en Swapify</h2>

//         {/* Botón de Google con Firebase */}
//         <Button variant="outline-dark" className="w-100 d-flex align-items-center justify-content-center gap-2 mb-3" onClick={handleGoogleLogin}>
//           <Google size={20} />
//           <span>Continuar con Google</span>
//         </Button>

//         {/* Botón de Facebook */}
//         <Button variant="primary" className="w-100 d-flex align-items-center justify-content-center gap-2 mb-3" onClick={handleFacebookLogin}>
//           <Facebook size={20} />
//           <span>Continuar con Facebook</span>
//         </Button>

//         {/* Botón de Registro con e-mail */}
//         <Button variant="success" className="w-100">Continuar con e-mail</Button>

//         {/* Enlace a Login */}
//         <p className="mt-3 text-muted">
//           ¿Ya tienes cuenta en Swapify?{" "}
//           <Link to="/login" className="text-success fw-bold">Inicia Sesión</Link>
//         </p>
//       </Card>
//     </Container>
//   );
// };
