import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Alert, Button, Container, Spinner, Table } from "react-bootstrap";
import { deleteFattura, getFatture } from "../api/fattureApi";

const Fatture = () => {
    const [searchParams] = useSearchParams();

    const clienteId = searchParams.get("clienteId");
    const clienteNome = searchParams.get("cliente");

    const [fatture, setFatture] = useState([]);
    const [pagina, setPagina] = useState(0);
    const [totalePagine, setTotalePagine] = useState(0);
    const [loading, setLoading] = useState(true);
    const [errore, setErrore] = useState("");
    const [eliminandoId, setEliminandoId] = useState(null);

    const caricaFatture = async () => {
        setLoading(true);
        setErrore("");

        try {
            const data = await getFatture(pagina, 10, "data", clienteId);

            setFatture(data.content || []);
            setTotalePagine(data.totalPages || 0);
        } catch (error) {
            setErrore(error.message);
            setFatture([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPagina(0);
    }, [clienteId]);

    useEffect(() => {
        caricaFatture();
    }, [pagina, clienteId]);

    const eliminaFattura = async (fatturaId) => {
        const conferma = window.confirm(
            "Sei sicuro di voler cancellare questa fattura?",
        );

        if (!conferma) {
            return;
        }

        setErrore("");
        setEliminandoId(fatturaId);

        try {
            await deleteFattura(fatturaId);

            if (fatture.length === 1 && pagina > 0) {
                setPagina(pagina - 1);
            } else {
                await caricaFatture();
            }
        } catch (error) {
            setErrore(error.message);
        } finally {
            setEliminandoId(null);
        }
    };

    const vaiPaginaPrecedente = () => {
        if (pagina > 0) {
            setPagina(pagina - 1);
        }
    };

    const vaiPaginaSuccessiva = () => {
        if (pagina < totalePagine - 1) {
            setPagina(pagina + 1);
        }
    };

    const formattaImporto = (importo) => {
        if (importo === null || importo === undefined) {
            return "-";
        }

        const numero = Number(importo);

        if (Number.isNaN(numero)) {
            return "-";
        }

        return (
            new Intl.NumberFormat("it-IT", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(numero) + " €"
        );
    };

    return (
        <Container className="py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="mb-1">Fatture</h1>

                    {clienteId ? (
                        <p className="text-muted mb-0">
                            Fatture del cliente:{" "}
                            <strong>{clienteNome || `ID ${clienteId}`}</strong>
                        </p>
                    ) : (
                        <p className="text-muted mb-0">
                            Lista di tutte le fatture
                        </p>
                    )}
                </div>

                <Button variant="primary" onClick={caricaFatture}>
                    Aggiorna
                </Button>
            </div>

            {clienteId && (
                <Alert
                    variant="warning"
                    className="d-flex justify-content-between align-items-center">
                    <span>
                        Stai visualizzando solo le fatture di questo cliente.
                    </span>

                    <Button
                        as={Link}
                        to="/fatture"
                        variant="outline-dark"
                        size="sm">
                        Mostra tutte
                    </Button>
                </Alert>
            )}

            {errore && <Alert variant="danger">{errore}</Alert>}

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" />
                    <p className="mt-3">Caricamento fatture...</p>
                </div>
            ) : fatture.length === 0 ? (
                <Alert variant="info">Nessuna fattura trovata.</Alert>
            ) : (
                <>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Numero</th>
                                <th>Data</th>
                                <th>Importo</th>
                                <th>Cliente</th>
                                <th>Stato</th>
                                <th>Azioni</th>
                            </tr>
                        </thead>

                        <tbody>
                            {fatture.map((fattura) => (
                                <tr key={fattura.fatturaId}>
                                    <td>{fattura.fatturaId}</td>
                                    <td>{fattura.numero}</td>
                                    <td>{fattura.data}</td>
                                    <td>{formattaImporto(fattura.importo)}</td>
                                    <td>
                                        {fattura.cliente?.ragioneSociale || "-"}
                                    </td>
                                    <td>
                                        {fattura.statoFattura?.denominazione ||
                                            "-"}
                                    </td>
                                    <td className="text-center">
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            title="Cancella fattura"
                                            aria-label="Cancella fattura"
                                            onClick={() =>
                                                eliminaFattura(
                                                    fattura.fatturaId,
                                                )
                                            }
                                            disabled={
                                                eliminandoId ===
                                                fattura.fatturaId
                                            }>
                                            {eliminandoId ===
                                            fattura.fatturaId ? (
                                                <Spinner
                                                    animation="border"
                                                    size="sm"
                                                />
                                            ) : (
                                                "🗑️"
                                            )}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <Button
                            variant="secondary"
                            onClick={vaiPaginaPrecedente}
                            disabled={pagina === 0}>
                            Precedente
                        </Button>

                        <span>
                            Pagina {pagina + 1} di {totalePagine || 1}
                        </span>

                        <Button
                            variant="secondary"
                            onClick={vaiPaginaSuccessiva}
                            disabled={pagina >= totalePagine - 1}>
                            Successiva
                        </Button>
                    </div>
                </>
            )}
        </Container>
    );
};

export default Fatture;
