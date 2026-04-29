import { useEffect, useState } from "react"

import { Container, Row, Col, Spinner } from "react-bootstrap"
import ClienteCard from "./ClientiCard"

function Clienti() {
  const [clienti, setClienti] = useState([])
  const [loading, setLoading] = useState(true)

  console.log("COMPONENTE CLIENTI MONTATO")

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    console.log("TOKEN:", token)

    fetch("http://localhost:3001/clienti", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("CLIENTI:", data)
        setClienti(data.content ?? [])
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
            <Col xs={12} md={6} lg={4} key={cliente.id}>
              <ClienteCard cliente={cliente} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  )
}

export default Clienti
