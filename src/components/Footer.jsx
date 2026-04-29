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

        <Row className="gy-3">
          <Col xs={6} md={3}>
            <p className="footer-link">Assistenza clienti</p>
            <p className="footer-link">Area personale</p>
            <p className="footer-link">Privacy</p>
            <p className="footer-link">Contattaci</p>
          </Col>

          <Col xs={6} md={3}>
            <h6 className="footer-title">Link</h6>

            <Link className="footer-link footer-link-clickable" to="/">
              Home
            </Link>

            <Link className="footer-link footer-link-clickable" to="/clienti">
              Clienti
            </Link>

            <Link className="footer-link footer-link-clickable" to="/fatture">
              Fatture
            </Link>
          </Col>

          <Col xs={6} md={3}>
            <p className="footer-link">Centro assistenza</p>
            <p className="footer-link">Lavora con noi</p>
            <p className="footer-link">Preferenze</p>
            <p className="footer-link">Sicurezza</p>
          </Col>

          <Col xs={6} md={3}>
            <p className="footer-link">Note legali</p>
            <p className="footer-link">Termini di uso</p>
            <p className="footer-link">Informazioni aziendali</p>
            <p className="footer-link">EpiEnergy Business</p>
          </Col>
        </Row>

        <p className="footer-copy mb-0">© 2026 EpiEnergy, Inc.</p>
      </Container>
    </footer>
  )
}

export default Footer
