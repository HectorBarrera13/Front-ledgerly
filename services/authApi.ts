import api from "@/services/apiClient";
import { LoginResponse } from "../types/LoginResponse";
import { RefreshResponse } from "../types/RefreshResponse";

export const loginRequest = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await api.fetch("/auth/login", {
    method: "POST",
    headers: {
      "X-Client-Type": "mobile",
    },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) throw new Error("Credenciales incorrectas");

  return response.json(); 
};

export const refreshTokenRequest = async (refreshToken: string): Promise<RefreshResponse> => {
  const response = await api.fetch("/auth/refresh", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  if (!response.ok) throw new Error("No se pudo refrescar el token");

  return response.json();
};

export const logoutRequest = async (accessToken: string) => {
  const response = await api.fetch("/auth/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) throw new Error("No se pudo cerrar sesión");
};

export const registerRequest = async (
  first_name: string,
  last_name: string,
  email: string,
  password: string,
  phone: { country_code: string; number: string }
) => {
  const response = await api.fetch("/auth/register", {
    method: "POST",
    headers: {
      "X-Client-Type": "mobile",
    },
    body: JSON.stringify({
      first_name,
      last_name,
      email,
      password,
      phone,
    }),
  });

  if (!response.ok) throw new Error("No se pudo registrar el usuario");

  return response.json();
};