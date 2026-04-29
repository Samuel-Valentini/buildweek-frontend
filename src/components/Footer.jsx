import { Container, Row, Col } from "react-bootstrap"

const Footer = () => {
  return (
    <footer className="bg-primary text-white mt-auto py-4">
      <Container>
        <Row className="mb-3">
          <Col xs={12} md={4} className="mb-3">
            <h5 className="fw-bold">⚡ EpiEnergy</h5>
            <p className="small">L'energia che ti serve per gestire tutto! </p>
          </Col>

          <Col xs={12} md={4} className="mb-3">
            <h6 className="fw-semibold">Link</h6>
            <ul className="list-unstyled">
              <li>Home</li>
              <li>Clienti</li>
              <li>Fatture</li>
            </ul>
          </Col>

          <Col xs={12} md={4} className="mb-3">
            <h6 className="fw-semibold">Contatti</h6>
            <p className="small">
              email@epienergy.it <br />
              +39 123 456 789
            </p>
          </Col>
        </Row>

        <Row>
          <Col className="text-center border-top pt-3">
            <small>© 2026 EpiEnergy</small>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
