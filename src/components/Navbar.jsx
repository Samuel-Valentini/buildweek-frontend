import { Navbar, Nav, Container, Button } from "react-bootstrap"
import { Link } from "react-router-dom"

function MyNavbar() {
  return (
    <Navbar expand="lg" bg="primary" variant="dark" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">
          ⚡ EpiEnergy
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar" />

        <Navbar.Collapse>
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>

            <Nav.Link as={Link} to="/clienti">
              Clienti
            </Nav.Link>

            <Nav.Link as={Link} to="/fatture">
              Fatture
            </Nav.Link>

            <Button as={Link} to="/login" variant="warning" className="ms-lg-3 fw-semibold">
              Login
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default MyNavbar
