import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../api/authApi";

function MyNavbar({ isUserLogged, setIsUserLogged }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsUserLogged(false);
    navigate("/login");
  };

  return (
    <Navbar expand="lg" bg="primary" variant="dark" className="shadow-sm">
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
                <Nav.Link as={Link} to="/admin">
                  Dipendenti
                </Nav.Link>
              </>
            )}

            {!isUserLogged ? (
              <Button as={Link} to="/login" variant="warning" size="sm" className="auth-button-navbar">
                Login
              </Button>
            ) : (
              <Button variant="danger" size="sm" className="auth-button-navbar" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;
