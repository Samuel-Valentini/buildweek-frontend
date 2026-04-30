import { getAuthHeader } from "./authApi";

const API_URL = "/api";

export const getFatture = async (
    page = 0,
    size = 10,
    sortBy = "data",
    clienteId = null,
    direction = "desc",
) => {
    let response;

    const params = new URLSearchParams();
    params.append("page", page);
    params.append("size", size);
    params.append("sortBy", sortBy);
    params.append("direction", direction);

    let endpoint = `${API_URL}/fatture`;

    if (clienteId) {
        endpoint = `${API_URL}/fatture/cerca`;
        params.append("clienteId", clienteId);
    }

    try {
        response = await fetch(`${endpoint}?${params.toString()}`, {
            method: "GET",
            headers: {
                Authorization: getAuthHeader(),
            },
        });
    } catch {
        throw new Error("Server non raggiungibile. Riprova più tardi.");
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            throw new Error("Non sei autorizzato. Fai il login.");
        }

        if (response.status >= 500) {
            throw new Error("Errore del server. Riprova più tardi.");
        }

        throw new Error(
            data?.message || "Errore durante il caricamento delle fatture",
        );
    }

    return data;
};

export const deleteFattura = async (fatturaId) => {
    let response;

    try {
        response = await fetch(`${API_URL}/fatture/${fatturaId}`, {
            method: "DELETE",
            headers: {
                Authorization: getAuthHeader(),
            },
        });
    } catch {
        throw new Error("Server non raggiungibile. Riprova più tardi.");
    }

    if (!response.ok) {
        const data = await response.json().catch(() => null);

        if (response.status === 401 || response.status === 403) {
            throw new Error("Non sei autorizzato a cancellare questa fattura.");
        }

        if (response.status === 404) {
            throw new Error("Fattura non trovata.");
        }

        if (response.status >= 500) {
            throw new Error("Errore del server. Riprova più tardi.");
        }

        throw new Error(
            data?.message || "Errore durante la cancellazione della fattura.",
        );
    }
};
