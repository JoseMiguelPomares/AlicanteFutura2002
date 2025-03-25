// // Envía el token de Firebase al backend para su validación.

// export const sendTokenToBackend = async (token: string): Promise<Response> => {
//     try {
//       const response = await fetch("http://localhost:8080/swapify/api/auth", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ token }),
//       });
  
//       if (!response.ok) {
//         throw new Error("Error en la autenticación con el backend");
//       }
//       console.log("Token validado por el backend correctamente");
//       return response;

//     } catch (error) {
//       console.error("Error enviando el token al backend:", error);
//       throw error; // Reenvía el error para manejarlo en otra capa
//     }
//   };
  