import { useEffect, useState } from "react"
import { Container, Row, Col, Spinner } from "react-bootstrap"
import ClienteCard from "./ClientiCard"

function Clienti() {
  const [clienti, setClienti] = useState([])
  const [loading, setLoading] = useState(true)
  const baseUrl = "http://localhost:3001/clienti"
  useEffect(() => {
    fetch(baseUrl)
      .then((res) => res.json())
      .then((data) => {
        setClienti(data.content)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold text-primary">Clienti</h1>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center">
          <Spinner />
        </div>
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
