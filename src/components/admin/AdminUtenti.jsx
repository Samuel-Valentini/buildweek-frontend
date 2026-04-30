import { useEffect, useState } from "react";
import { Table, Button, Spinner, Alert, Pagination } from "react-bootstrap";
import { apiCall } from "../../api/apiHelper";

const AdminUtenti = () => {
  const [pagina, setPagina] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errore, setErrore] = useState("");
  const [paginaCorrente, setPaginaCorrente] = useState(0);

  // Funzione che carica la lista utenti
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
    if (!window.confirm("Sei sicuro di voler cancellare questo utente?")) {
      return;
    }
    try {
      await apiCall(`/utenti/${utenteId}`, { method: "DELETE" });
      caricaUtenti();
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
                <th>Cognome</th>
                <th>Ruoli</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {pagina.content.map((utente) => (
                <tr key={utente.id}>
                  <td>{utente.id}</td>
                  <td>{utente.username}</td>
                  <td>{utente.email}</td>
                  <td>{utente.nome}</td>
                  <td>{utente.cognome}</td>
                  <td>{utente.ruoli.map((r) => r.denominazione).join(", ")}</td>
                  <td>
                    <Button variant="danger" size="sm" onClick={() => cancellaUtente(utente.id)}>
                      Cancella
                    </Button>
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
