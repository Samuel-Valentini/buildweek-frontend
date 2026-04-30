import { getAuthHeader } from "./authApi";

const CLIENTI_URL = "/api/clienti";

export const getClienti = async (
    page = 0,
    size = 10,
    sortBy = "ragioneSociale",
    direction = "asc",
) => {
    const response = await fetch(
        `${CLIENTI_URL}?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`,
        {
            method: "GET",
            headers: {
                Authorization: getAuthHeader(),
            },
        },
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            throw new Error("Non sei autorizzato. Fai il login.");
        }

        if (response.status >= 500) {
            throw new Error("Errore del server. Riprova più tardi.");
        }

        throw new Error(
            data?.message || "Errore durante il caricamento dei clienti",
        );
    }

    return data;
};
