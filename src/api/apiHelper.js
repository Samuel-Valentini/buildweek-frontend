import { getAuthHeader } from "./authApi";

const API_URL = "/api";

// Funzione unica per tutte le chiamate API autenticate
export const apiCall = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthHeader(),
      ...options.headers,
    },
  });

  // 204 No Content (es. dopo DELETE) -> niente body
  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.message || `Errore ${response.status}`;
    throw new Error(message);
  }

  return data;
};
