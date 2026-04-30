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
    <Navbar expand="lg" variant="dark" className="shadow-sm custom-navbar">
      <Container>
        <Navbar.Brand as={Link} to={isUserLogged ? "/" : "/login"}>
          ⚡ EpiEnergy
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar" />

        <Navbar.Collapse id="navbar">
          <Nav className="ms-auto navbar-links">
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
              <Button as={Link} to="/login" size="sm" variant="primary">
                Login
              </Button>
            ) : (
              <Button size="sm" variant="primary" onClick={handleLogout}>
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
