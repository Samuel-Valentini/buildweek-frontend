import { Link } from "react-router-dom"
import { Container, Row, Col } from "react-bootstrap"
import { FaFacebookF, FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6"

function Footer() {
  return (
    <footer className="footer-custom mt-auto">
      <Container>
        <div className="footer-social mb-4">
          <FaFacebookF className="footer-social-icon" />
          <FaInstagram className="footer-social-icon" />
          <FaXTwitter className="footer-social-icon" />
          <FaYoutube className="footer-social-icon" />
        </div>

        <Row className="gy-4">
          <Col xs={12} md={4}>
            <h6 className="footer-title">EpiEnergy</h6>
            <Link to="/" className="footer-link footer-link-clickable">
              Home
            </Link>
            <Link to="/clienti" className="footer-link footer-link-clickable">
              Clienti
            </Link>
            <Link to="/fatture" className="footer-link footer-link-clickable">
              Fatture
            </Link>
          </Col>

          <Col xs={12} md={4}>
            <h6 className="footer-title">Supporto</h6>
            <Link to="#" className="footer-link footer-link-clickable">
              Assistenza clienti
            </Link>
            <Link to="#" className="footer-link footer-link-clickable">
              Contattaci
            </Link>
            <Link to="#" className="footer-link footer-link-clickable">
              Centro assistenza
            </Link>
          </Col>

          <Col xs={12} md={4}>
            <h6 className="footer-title">Informazioni</h6>
            <Link to="#" className="footer-link footer-link-clickable">
              Privacy
            </Link>
            <Link to="#" className="footer-link footer-link-clickable">
              Termini di uso
            </Link>
            <Link to="#" className="footer-link footer-link-clickable">
              Informazioni aziendali
            </Link>
          </Col>
        </Row>
        <Col xs={12} md={4}>
          <p className="footer-copy mb-0">© 2026 EpiEnergy, Inc.</p>
        </Col>
      </Container>
    </footer>
  )
}

export default Footer
