import { useEffect, useState } from "react"
import { Alert, Button, Container, Row, Col, Spinner } from "react-bootstrap"
import { getAuthHeader } from "../api/authApi"
import ClienteCard from "./ClientiCard"

function Clienti() {
  const [clienti, setClienti] = useState([])
  const [loading, setLoading] = useState(true)
  const [errore, setErrore] = useState("")

  const caricaClienti = async () => {
    setLoading(true)
    setErrore("")

    try {
      const response = await fetch("/api/clienti?page=0&size=30&sortBy=ragioneSociale", {
        method: "GET",
        headers: {
          Authorization: getAuthHeader(),
        },
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Non sei autorizzato. Fai il login.")
        }

        if (response.status >= 500) {
          throw new Error("Errore del server. Riprova più tardi.")
        }

        throw new Error(data?.message || "Errore durante il caricamento dei clienti")
      }

      setClienti(data.content || [])
    } catch (error) {
      if (error.message === "Failed to fetch") {
        setErrore("Server non raggiungibile. Riprova più tardi.")
      } else {
        setErrore(error.message)
      }

      setClienti([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    caricaClienti()
  }, [])

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1 text-primary fw-bold">Clienti</h1>
          <p className="text-muted mb-0">Lista di tutti i clienti</p>
        </div>

        <Button variant="primary" onClick={caricaClienti}>
          Aggiorna
        </Button>
      </div>

      {errore && <Alert variant="danger">{errore}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
          <p className="mt-3">Caricamento clienti...</p>
        </div>
      ) : clienti.length === 0 ? (
        <Alert variant="info">Nessun cliente trovato.</Alert>
      ) : (
        <Row className="g-4">
          {clienti.map((cliente) => (
            <Col xs={12} md={6} lg={4} key={cliente.clientiId}>
              <ClienteCard cliente={cliente} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  )
}

export default Clienti
