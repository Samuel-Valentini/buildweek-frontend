import { Card, Button, Badge } from "react-bootstrap"

function ClienteCard({ cliente }) {
  return (
    <Card className="h-100 shadow-sm border-0">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="fw-bold text-primary mb-0">{cliente.ragioneSociale}</Card.Title>

          <Badge bg="warning" text="dark">
            {cliente.tipoCliente}
          </Badge>
        </div>

        <Card.Text className="mb-1">
          <strong>P. IVA:</strong> {cliente.partitaIva}
        </Card.Text>

        <Card.Text className="mb-1">
          <strong>Email:</strong> {cliente.email}
        </Card.Text>

        <Card.Text className="mb-1">
          <strong>PEC:</strong> {cliente.pec}
        </Card.Text>

        <Card.Text className="mb-1">
          <strong>Telefono:</strong> {cliente.telefono}
        </Card.Text>

        <hr />

        <Card.Text className="mb-1">
          <strong>Contatto:</strong> {cliente.nomeContatto} {cliente.cognomeContatto}
        </Card.Text>

        <Card.Text className="mb-1">
          <strong>Email contatto:</strong> {cliente.emailContatto}
        </Card.Text>

        <Card.Text className="mb-3">
          <strong>Tel. contatto:</strong> {cliente.telefonoContatto}
        </Card.Text>

        <Card.Text className="fw-semibold">Fatturato: € {cliente.fatturatoAnnuale}</Card.Text>

        <Button variant="warning" className="fw-semibold">
          Dettagli
        </Button>
      </Card.Body>
    </Card>
  )
}

export default ClienteCard
