import { useEffect, useState } from "react"
import { Alert, Container, Row, Col, Spinner } from "react-bootstrap"
import { getAuthHeader } from "../api/authApi"
import ClienteCard from "./ClientiCard"

function Clienti() {
  const [clienti, setClienti] = useState([])
  const [loading, setLoading] = useState(true)
  const [errore, setErrore] = useState("")

  useEffect(() => {
    const caricaClienti = async () => {
      setLoading(true)
      setErrore("")

      try {
        const response = await fetch("/api/clienti?page=0&size=30&sortBy=ragioneSociale", {
          headers: {
            Authorization: getAuthHeader(),
          },
        })

        const data = await response.json().catch(() => null)

        if (!response.ok) {
          throw new Error(data?.message || "Errore durante il caricamento dei clienti")
        }

        setClienti(data.content || [])
      } catch (error) {
        setErrore(error.message)
      } finally {
        setLoading(false)
      }
    }

    caricaClienti()
  }, [])

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold text-primary">Clienti</h1>
        </Col>
      </Row>

      {errore && <Alert variant="danger">{errore}</Alert>}

      {loading ? (
        <div className="text-center">
          <Spinner />
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
