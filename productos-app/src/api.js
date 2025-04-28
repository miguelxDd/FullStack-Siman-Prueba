import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir el token y ver qué se está enviando
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("🟡 [REQUEST] No token en localStorage para:", config.url);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

//  Variables para controlar refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

//  Interceptor de respuestas para manejar expiración y refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 403 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");


      if (!refreshToken) {
        console.warn(" [REFRESH] No hay refreshToken, cerrando sesión.");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(
          `http://localhost:8080/auth/refresh?refreshToken=${refreshToken}`
        );

        const newToken = refreshResponse.data.token;
        

        localStorage.setItem("token", newToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        processQueue(null, newToken);

        isRefreshing = false;

        originalRequest.headers.Authorization = "Bearer " + newToken;
        return api(originalRequest);
      } catch (refreshError) {
        
        processQueue(refreshError, null);
        isRefreshing = false;

        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const obtenerRolDesdeToken=()=>{
  const token = localStorage.getItem("token");
  if (!token) return null;

  try{
    const payloadBase64 = token.split(".")[1];
    const payload = JSON.parse(atob(payloadBase64));
    return payload.roles || null;
  } catch (error) {
    console.error("Error al obtener roles desde el token:", error);
    return null;
  }

}

export default api;
