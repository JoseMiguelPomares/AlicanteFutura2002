// import { Container, Card, Button, Image } from "react-bootstrap";
// import { useEffect, useState } from "react";
// import { auth, signOut } from "../firebase/firebaseConfig";
// import { onAuthStateChanged } from "firebase/auth";
// import { useNavigate } from "react-router-dom";

// export const PaginaPerfil = () => {
//   const navigate = useNavigate();
//   const [usuario, setUsuario] = useState<{ nombre: string; email: string; foto: string } | null>(null);
//   const [creditos, setCreditos] = useState<number>(150); // Simulando saldo de créditos

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setUsuario({
//           nombre: user.displayName || "Usuario Anónimo",
//           email: user.email || "Sin email",
//           foto: user.photoURL || "https://via.placeholder.com/100",
//         });
//       } else {
//         navigate("/login"); // Redirigir si no está autenticado
//       }
//     });

//     return () => unsubscribe();
//   }, [navigate]);

//   const handleLogout = async () => {
//     await signOut(auth);
//     navigate("/login"); // Redirigir al login después de cerrar sesión
//   };

//   return (
//     <Container className="d-flex justify-content-center align-items-center vh-100">
//       <Card className="p-4 shadow-lg text-center" style={{ maxWidth: "400px", width: "100%" }}>
//         {usuario ? (
//           <>
//             <Image src={usuario.foto} roundedCircle className="mb-3" style={{ width: "100px", height: "100px" }} />
//             <h2 className="fw-bold">{usuario.nombre}</h2>
//             <p className="text-muted">{usuario.email}</p>

//             <h4 className="fw-bold text-primary">Créditos: {creditos}</h4>

//             <Button variant="danger" className="w-100 mt-3" onClick={handleLogout}>
//               Cerrar Sesión
//             </Button>
//           </>
//         ) : (
//           <p>Cargando...</p>
//         )}
//       </Card>
//     </Container>
//   );
// };
