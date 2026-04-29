import { getAuthHeader } from "./authApi"

const API_URL = "/api"

export const getFatture = async (page = 0, size = 10, sortBy = "data", clienteId = null) => {
  let response

  const params = new URLSearchParams()
  params.append("page", page)
  params.append("size", size)
  params.append("sortBy", sortBy)

  let endpoint = `${API_URL}/fatture`

  if (clienteId) {
    endpoint = `${API_URL}/fatture/cerca`
    params.append("clienteId", clienteId)
  }

  try {
    response = await fetch(`${endpoint}?${params.toString()}`, {
      method: "GET",
      headers: {
        Authorization: getAuthHeader(),
      },
    })
  } catch {
    throw new Error("Server non raggiungibile. Riprova più tardi.")
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error("Non sei autorizzato. Fai il login.")
    }

    if (response.status >= 500) {
      throw new Error("Errore del server. Riprova più tardi.")
    }

    throw new Error(data?.message || "Errore durante il caricamento delle fatture")
  }

  return data
}
