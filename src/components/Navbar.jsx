import { Navbar, Nav, Container, Button } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { logout } from "../api/authApi"

function MyNavbar({ isUserLogged, setIsUserLogged }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setIsUserLogged(false)
    navigate("/login")
  }

  return (
    <Navbar expand="lg" bg="primary" variant="dark" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to={isUserLogged ? "/" : "/login"}>
          ⚡ EpiEnergy
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar" />

        <Navbar.Collapse id="navbar">
          <Nav className="ms-auto">
            {isUserLogged && (
              <>
                <Nav.Link as={Link} to="/">
                  Home
                </Nav.Link>

                <Nav.Link as={Link} to="/clienti">
                  Clienti
                </Nav.Link>

                <Nav.Link as={Link} to="/fatture">
                  Fatture
                </Nav.Link>
              </>
            )}

            {!isUserLogged ? (
              <Button as={Link} to="/login" variant="warning" className="ms-lg-3 fw-semibold">
                Login
              </Button>
            ) : (
              <Button variant="danger" className="ms-lg-3 fw-semibold" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default MyNavbar
