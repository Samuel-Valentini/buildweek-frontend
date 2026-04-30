import { useEffect, useState } from "react"
import { Table, Button, Spinner, Alert, Form, Modal, InputGroup } from "react-bootstrap"
import { apiCall } from "../../api/apiHelper"
import { getUserFromStorage } from "../../api/userApi"

const AdminUtenti = () => {
  const [pagina, setPagina] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errore, setErrore] = useState("")
  const [paginaCorrente, setPaginaCorrente] = useState(0)

  // Ruolo selezionato per ogni utente nel dropdown
  const [ruoliInput, setRuoliInput] = useState({})

  // Lista ruoli disponibili caricati dal backend
  const [ruoliDisponibili, setRuoliDisponibili] = useState([])

  // Modale password
  const [passwordGenerata, setPasswordGenerata] = useState(null)
  const [copiato, setCopiato] = useState(false)

  // Calcola se l'utente loggato è SUPER_ADMIN
  const utenteLoggato = getUserFromStorage()
  const isSuperAdmin = utenteLoggato?.ruoli?.some((r) => r.denominazione === "SUPER_ADMIN")

  // Filtra i ruoli: ADMIN normale non può assegnare ADMIN/SUPER_ADMIN
  const ruoliVisibili = isSuperAdmin ? ruoliDisponibili : ruoliDisponibili.filter((r) => r.denominazione !== "ADMIN" && r.denominazione !== "SUPER_ADMIN")

  // Carica utenti dal backend
  const caricaUtenti = async () => {
    setLoading(true)
    setErrore("")

    try {
      const data = await apiCall(`/utenti?page=${paginaCorrente}&size=10&sortBy=cognome`)
      setPagina(data)
    } catch (e) {
      setErrore(e.message)
    } finally {
      setLoading(false)
    }
  }

  // Carica ruoli disponibili una sola volta
  const caricaRuoli = async () => {
    try {
      const data = await apiCall("/ruoli?size=100")
      setRuoliDisponibili(data.content)
    } catch (e) {
      console.error("Impossibile caricare i ruoli:", e.message)
    }
  }

  useEffect(() => {
    caricaUtenti()
  }, [paginaCorrente])

  useEffect(() => {
    caricaRuoli()
  }, [])

  // Cancella utente
  const cancellaUtente = async (utenteId) => {
    if (!window.confirm("Sei sicuro di voler cancellare questo utente?")) return

    try {
      await apiCall(`/admin_api/${utenteId}`, { method: "DELETE" })
      caricaUtenti()
    } catch (e) {
      alert("Errore: " + e.message)
    }
  }

  // Aggiungi ruolo
  const aggiungiRuolo = async (utenteId) => {
    const ruolo = ruoliInput[utenteId]

    if (!ruolo) {
      alert("Seleziona un ruolo da aggiungere")
      return
    }

    try {
      await apiCall(`/admin_api/${utenteId}/ruoli/add?ruolo=${ruolo}`, { method: "PATCH" })
      setRuoliInput({ ...ruoliInput, [utenteId]: "" })
      caricaUtenti()
    } catch (e) {
      alert("Errore: " + e.message)
    }
  }

  // Rimuovi ruolo
  const rimuoviRuolo = async (utenteId, ruolo) => {
    if (!window.confirm(`Rimuovere il ruolo "${ruolo}" da questo utente?`)) return

    try {
      await apiCall(`/admin_api/${utenteId}/ruoli/remove?ruolo=${ruolo}`, { method: "PATCH" })
      caricaUtenti()
    } catch (e) {
      alert("Errore: " + e.message)
    }
  }

  // Reset password
  const resetPassword = async (utenteId) => {
    if (!window.confirm("Generare una nuova password temporanea per questo utente?")) return

    try {
      const data = await apiCall(`/admin_api/${utenteId}/ruoli/resetpassword`, { method: "PATCH" })
      setPasswordGenerata(data.temporaryPassword)
      setCopiato(false)
    } catch (e) {
      alert("Errore: " + e.message)
    }
  }

  // Copia password negli appunti
  const copiaPassword = () => {
    navigator.clipboard.writeText(passwordGenerata).then(() => {
      setCopiato(true)
      setTimeout(() => setCopiato(false), 2000)
    })
  }

  // Vai alla pagina precedente
  const vaiPaginaPrecedente = () => {
    if (paginaCorrente > 0) {
      setPaginaCorrente(paginaCorrente - 1)
    }
  }

  // Vai alla pagina successiva
  const vaiPaginaSuccessiva = () => {
    if (pagina && paginaCorrente < pagina.totalPages - 1) {
      setPaginaCorrente(paginaCorrente + 1)
    }
  }

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
                      <Form.Select
                        size="sm"
                        value={ruoliInput[utente.id] || ""}
                        onChange={(e) => setRuoliInput({ ...ruoliInput, [utente.id]: e.target.value })}
                      >
                        <option value="">Seleziona...</option>

                        {ruoliVisibili.map((r) => (
                          <option key={r.id} value={r.denominazione}>
                            {r.denominazione}
                          </option>
                        ))}
                      </Form.Select>

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

          {pagina.content.length > 0 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <Button variant="secondary" onClick={vaiPaginaPrecedente} disabled={paginaCorrente === 0}>
                Precedente
              </Button>

              <span>
                Pagina {paginaCorrente + 1} di {pagina.totalPages || 1}
              </span>

              <Button variant="secondary" onClick={vaiPaginaSuccessiva} disabled={paginaCorrente >= pagina.totalPages - 1}>
                Successiva
              </Button>
            </div>
          )}
        </>
      )}

      <Modal show={passwordGenerata !== null} onHide={() => setPasswordGenerata(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>🔑 Password temporanea</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Comunica questa password all'utente. Sarà visibile solo ora.</p>

          <InputGroup>
            <Form.Control type="text" readOnly value={passwordGenerata || ""} style={{ fontFamily: "monospace", fontWeight: "bold" }} />

            <Button variant={copiato ? "success" : "primary"} onClick={copiaPassword}>
              {copiato ? "✓ Copiata!" : "Copia"}
            </Button>
          </InputGroup>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setPasswordGenerata(null)}>
            Chiudi
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default AdminUtenti
