import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Alert, Button, Card, Container, Form, Spinner } from "react-bootstrap"
import { login, saveToken } from "../api/authApi"

const Login = ({ setIsUserLogged }) => {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errore, setErrore] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()

    setErrore("")
    setLoading(true)

    try {
      const token = await login(email, password)

      saveToken(token)

      setIsUserLogged(true)

      navigate("/")
    } catch (error) {
      setErrore(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="d-flex justify-content-center align-items-center py-5">
      <Card className="shadow p-4" style={{ maxWidth: "420px", width: "100%" }}>
        <h2 className="text-center mb-4">Login</h2>

        {errore && <Alert variant="danger">{errore}</Alert>}

        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Inserisci email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Inserisci password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100" disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Accesso...
              </>
            ) : (
              "Accedi"
            )}
          </Button>
        </Form>

        <div className="text-center mt-3 small text-muted">Prova con: superadmin@email.com / superadmin123</div>
      </Card>
    </Container>
  )
}

export default Login
