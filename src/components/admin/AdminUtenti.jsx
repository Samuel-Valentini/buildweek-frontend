import { useEffect, useState } from "react";
import { Table, Button, Spinner, Alert, Pagination, Form } from "react-bootstrap";
import { apiCall } from "../../api/apiHelper";

const AdminUtenti = () => {
  const [pagina, setPagina] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errore, setErrore] = useState("");
  const [paginaCorrente, setPaginaCorrente] = useState(0);

  // Stato per il ruolo da aggiungere/rimuovere (semplice text input per ora)
  const [ruoliInput, setRuoliInput] = useState({});

  const caricaUtenti = async () => {
    setLoading(true);
    setErrore("");
    try {
      const data = await apiCall(`/utenti?page=${paginaCorrente}&size=10&sortBy=cognome`);
      setPagina(data);
    } catch (e) {
      setErrore(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    caricaUtenti();
  }, [paginaCorrente]);

  // Cancella utente
  const cancellaUtente = async (utenteId) => {
    if (!window.confirm("Sei sicuro di voler cancellare questo utente?")) return;
    try {
      await apiCall(`/admin_api/${utenteId}`, { method: "DELETE" });
      caricaUtenti();
    } catch (e) {
      alert("Errore: " + e.message);
    }
  };

  // Aggiungi ruolo
  const aggiungiRuolo = async (utenteId) => {
    const ruolo = ruoliInput[utenteId];
    if (!ruolo || !ruolo.trim()) {
      alert("Inserisci un ruolo da aggiungere");
      return;
    }
    try {
      await apiCall(`/admin_api/${utenteId}/ruoli/add?ruolo=${ruolo}`, { method: "PATCH" });
      setRuoliInput({ ...ruoliInput, [utenteId]: "" });
      caricaUtenti();
    } catch (e) {
      alert("Errore: " + e.message);
    }
  };

  // Rimuovi ruolo
  const rimuoviRuolo = async (utenteId, ruolo) => {
    if (!window.confirm(`Rimuovere il ruolo "${ruolo}" da questo utente?`)) return;
    try {
      await apiCall(`/admin_api/${utenteId}/ruoli/remove?ruolo=${ruolo}`, { method: "PATCH" });
      caricaUtenti();
    } catch (e) {
      alert("Errore: " + e.message);
    }
  };

  // Reset password
  const resetPassword = async (utenteId) => {
    if (!window.confirm("Generare una nuova password temporanea per questo utente?")) return;
    try {
      const data = await apiCall(`/admin_api/${utenteId}/ruoli/resetpassword`, { method: "PATCH" });
      alert(`Password temporanea generata:\n\n${data.temporaryPassword}\n\nCopiala e comunicala all'utente!`);
    } catch (e) {
      alert("Errore: " + e.message);
    }
  };

  return (
    <div>
      {errore && <Alert variant="danger">{errore}</Alert>}

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      )}

      {!loading && pagina && (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Nome</th>
                <th>Ruoli</th>
                <th>Aggiungi ruolo</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {pagina.content.map((utente) => (
                <tr key={utente.id}>
                  <td>{utente.id}</td>
                  <td>{utente.username}</td>
                  <td>{utente.email}</td>
                  <td>
                    {utente.nome} {utente.cognome}
                  </td>
                  <td>
                    {utente.ruoli.map((r) => (
                      <span key={r.id} className="me-1">
                        <Button variant="outline-secondary" size="sm" onClick={() => rimuoviRuolo(utente.id, r.denominazione)} title="Click per rimuovere">
                          {r.denominazione} ✕
                        </Button>
                      </span>
                    ))}
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Form.Control
                        type="text"
                        size="sm"
                        placeholder="es. ADMIN"
                        value={ruoliInput[utente.id] || ""}
                        onChange={(e) => setRuoliInput({ ...ruoliInput, [utente.id]: e.target.value })}
                      />
                      <Button variant="success" size="sm" onClick={() => aggiungiRuolo(utente.id)}>
                        +
                      </Button>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex gap-1 flex-column">
                      <Button variant="warning" size="sm" onClick={() => resetPassword(utente.id)}>
                        Reset Pwd
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => cancellaUtente(utente.id)}>
                        Cancella
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {pagina.content.length === 0 && <Alert variant="info">Nessun utente trovato.</Alert>}

          {pagina.totalPages > 1 && (
            <Pagination>
              <Pagination.Prev disabled={paginaCorrente === 0} onClick={() => setPaginaCorrente(paginaCorrente - 1)} />
              <Pagination.Item active>
                Pagina {paginaCorrente + 1} di {pagina.totalPages}
              </Pagination.Item>
              <Pagination.Next disabled={paginaCorrente >= pagina.totalPages - 1} onClick={() => setPaginaCorrente(paginaCorrente + 1)} />
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};

export default AdminUtenti;
