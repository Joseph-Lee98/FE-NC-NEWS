// import { useNavigate } from "react-router-dom";
// import { useEffect } from "react";
import axios from "axios";

// const useApi = () => {
//   const navigate = useNavigate();

const api = axios.create({
  baseURL: "https://be-nc-news-q4om.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

//   useEffect(() => {
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("jwt");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//       console.log("JWT attached:", config.headers.Authorization);
//     } else {
//       console.log("No JWT found, proceeding without authorization header.");
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

//     api.interceptors.response.use(
//       (response) => {
//         return response;
//       },
//       (error) => {
//         if (
//           error.response &&
//           error.response.status === 401 &&
//           error.response.data.message === "Invalid token"
//         ) {
//           localStorage.removeItem("jwt");
//           localStorage.removeItem("user");
//           navigate("/login");
//         }
//         return Promise.reject(error);
//       }
//     );
//   }, [navigate]);

//   return api;
// };

export default api;
