import { Card, Button } from "react-bootstrap"

const ClienteCard = ({ cliente }) => {
  return (
    <Card className="h-100 shadow-sm border-0">
      <Card.Body>
        <Card.Title className="text-primary fw-bold">{cliente.ragioneSociale}</Card.Title>

        <Card.Subtitle className="mb-3 text-muted">{cliente.tipoCliente}</Card.Subtitle>

        <Card.Text className="mb-1">
          <strong>Email:</strong> {cliente.email}
        </Card.Text>

        <Card.Text className="mb-1">
          <strong>Telefono:</strong> {cliente.telefono}
        </Card.Text>

        <Card.Text>
          <strong>Fatturato:</strong> € {cliente.fatturatoAnnuale}
        </Card.Text>

        <Button variant="warning" className="fw-semibold">
          Dettagli
        </Button>
      </Card.Body>
    </Card>
  )
}

export default ClienteCard
