import { apiCall } from "./apiHelper";

// Recupera dal backend l'utente attualmente loggato
export const fetchCurrentUser = async () => {
  return await apiCall("/utenti/me");
};

// Salva l'utente in localStorage
export const saveUser = (user) => {
  localStorage.setItem("currentUser", JSON.stringify(user));
};

// Recupera l'utente salvato in localStorage
export const getUserFromStorage = () => {
  const userString = localStorage.getItem("currentUser");
  if (!userString) return null;
  try {
    return JSON.parse(userString);
  } catch {
    return null;
  }
};

// Cancella l'utente da localStorage (al logout)
export const removeUser = () => {
  localStorage.removeItem("currentUser");
};

// Controlla se l'utente loggato è admin (ADMIN o SUPER_ADMIN)
export const isAdmin = () => {
  const user = getUserFromStorage();
  if (!user || !user.ruoli) return false;

  return user.ruoli.some((ruolo) => ruolo.denominazione === "ADMIN" || ruolo.denominazione === "SUPER_ADMIN");
};
