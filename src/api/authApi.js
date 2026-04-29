const API_URL = "/api"

// Funzione per fare login
export const login = async (email, password) => {
  let response

  try {
    response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
  } catch {
    // Questo succede quando il backend è spento o non raggiungibile
    throw new Error("Server non raggiungibile. Riprova più tardi.")
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error("Email o password non corretti")
    }

    if (response.status >= 500) {
      throw new Error("Errore del server. Riprova più tardi.")
    }

    throw new Error(data?.message || "Errore durante il login")
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
