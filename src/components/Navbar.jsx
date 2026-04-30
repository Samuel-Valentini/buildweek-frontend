import { useEffect, useState } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../api/authApi";
import { fetchCurrentUser, saveUser, getUserFromStorage, removeUser, isAdmin } from "../api/userApi";

function MyNavbar({ isUserLogged, setIsUserLogged }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(getUserFromStorage());

  useEffect(() => {
    // Se sono loggato ma non ho l'utente in localStorage, lo carico dal backend
    if (isUserLogged && !user) {
      fetchCurrentUser()
        .then((data) => {
          saveUser(data);
          setUser(data);
        })
        .catch((err) => console.error("Impossibile recuperare l'utente:", err));
    }
  }, [isUserLogged, user]);

  const handleLogout = () => {
    logout();
    removeUser();
    setUser(null);
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

                {isAdmin() && (
                  <Nav.Link as={Link} to="/admin">
                    Dipendenti
                  </Nav.Link>
                )}
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
