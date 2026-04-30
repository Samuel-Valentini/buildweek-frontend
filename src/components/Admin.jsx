import { Container } from "react-bootstrap";
import AdminUtenti from "./admin/AdminUtenti";

const Admin = () => {
  return (
    <Container className="py-4">
      <h1 className="mb-4">Pannello Admin – Gestione Utenti</h1>
      <AdminUtenti />
    </Container>
  );
};

export default Admin;
