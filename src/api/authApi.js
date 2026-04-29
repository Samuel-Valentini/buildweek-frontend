const API_URL = "/api"

// Funzione per fare login
export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.message || "Email o password non corretti")
  }

  return data.accessToken
}

// Salva il token nel browser
export const saveToken = (token) => {
  localStorage.setItem("accessToken", token)
}

// Prende il token salvato
export const getToken = () => {
  return localStorage.getItem("accessToken")
}

// Controlla se l'utente è loggato
export const isLoggedIn = () => {
  return !!getToken()
}

// Logout
export const logout = () => {
  localStorage.removeItem("accessToken")
}

// Header da usare per le chiamate protette
export const getAuthHeader = () => {
  const token = getToken()
  return token ? `Bearer ${token}` : ""
}
