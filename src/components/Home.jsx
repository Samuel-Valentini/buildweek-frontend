import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Badge,
    Button,
    Card,
    Col,
    Container,
    Row,
    Spinner,
} from "react-bootstrap";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import { useNavigate } from "react-router-dom";

import { getClienti } from "../api/clientiApi";
import { getFatture } from "../api/fattureApi";

const Home = () => {
    const [clienti, setClienti] = useState([]);
    const [fatture, setFatture] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errore, setErrore] = useState("");
    const navigate = useNavigate();

    const caricaDashboard = async () => {
        setLoading(true);
        setErrore("");

        try {
            const [clientiData, fattureData] = await Promise.all([
                getClienti(0, 6, "fatturatoAnnuale", "desc"),
                getFatture(0, 12, "data", null, "desc"),
            ]);

            setClienti(clientiData.content || []);
            setFatture(fattureData.content || []);
        } catch (error) {
            setErrore(
                error.message ||
                    "Errore durante il caricamento della dashboard",
            );
            setClienti([]);
            setFatture([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        caricaDashboard();
    }, []);

    const formattaImporto = (importo) => {
        const numero = Number(importo);

        if (Number.isNaN(numero)) {
            return "0,00 €";
        }

        return (
            new Intl.NumberFormat("it-IT", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(numero) + " €"
        );
    };

    const clientiAltoFatturato = useMemo(() => {
        return clienti.map((cliente) => {
            const fatturato = Number(
                cliente.fatturatoAnnuale ?? cliente.fatturato ?? 0,
            );

            return {
                clienteId: cliente.clientiId,
                ragioneSociale:
                    cliente.ragioneSociale || `Cliente ${cliente.clientiId}`,
                fatturato,
            };
        });
    }, [clienti]);

    const ultimeFatture = useMemo(() => {
        return fatture.map((fattura) => ({
            fatturaId: fattura.fatturaId,
            numero: fattura.numero || `#${fattura.fatturaId}`,
            data: fattura.data,
            importo: Number(fattura.importo) || 0,
            stato: fattura.statoFattura?.denominazione || "-",
            cliente: fattura.cliente?.ragioneSociale || "-",
            clienteId: fattura.cliente?.clientiId,
        }));
    }, [fatture]);

    const getColoreStato = (stato) => {
        const statoNormalizzato = stato?.toLowerCase().trim();

        switch (statoNormalizzato) {
            case "pagata":
                return "success";

            case "non_pagata":
                return "warning";

            case "in_scadenza":
                return "info";

            case "scaduta":
                return "danger";

            default:
                return "secondary";
        }
    };

    const vaiAlleFattureCliente = (cliente) => {
        const params = new URLSearchParams();

        params.append("clienteId", cliente.clienteId);
        params.append("cliente", cliente.ragioneSociale);

        navigate(`/fatture?${params.toString()}`);
    };

    const vaiAlleFattureClienteSecondoGrafico = (clienteId, clienteNome) => {
        if (!clienteId) {
            return;
        }

        const params = new URLSearchParams();

        params.append("clienteId", clienteId);
        params.append("cliente", clienteNome || `ID ${clienteId}`);

        navigate(`/fatture?${params.toString()}`);
    };

    return (
        <Container className="py-5">
            <div className="mb-4">
                <Col xs={12} lg={10} xl={9} className="mx-auto">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div>
                            <h1 className="mb-1 text-primary fw-bold">
                                Benvenuto in EpiEnergy ⚡
                            </h1>
                            <p className="text-muted mb-0">
                                Dai energia al tuo domani!
                            </p>
                        </div>

                        <Button variant="primary" onClick={caricaDashboard}>
                            Aggiorna dashboard
                        </Button>
                    </div>
                </Col>
            </div>
            {errore && <Alert variant="danger">{errore}</Alert>}

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" />
                    <p className="mt-3">Caricamento dashboard...</p>
                </div>
            ) : (
                <Row className="g-4">
                    <Col xs={12} lg={10} xl={9} className="mx-auto">
                        <Card className="h-100 shadow-sm">
                            <Card.Body>
                                <Card.Title>
                                    Clienti ad alto fatturato
                                </Card.Title>
                                <Card.Text className="text-muted">
                                    I clienti con il fatturato maggiore
                                </Card.Text>

                                {clientiAltoFatturato.length === 0 ? (
                                    <Alert variant="info">
                                        Nessun cliente disponibile.
                                    </Alert>
                                ) : (
                                    <div style={{ width: "100%", height: 350 }}>
                                        <ResponsiveContainer>
                                            <BarChart
                                                data={clientiAltoFatturato}>
                                                <CartesianGrid strokeDasharray="3 3" />

                                                <XAxis
                                                    dataKey="ragioneSociale"
                                                    tick={{ fontSize: 12 }}
                                                    interval={0}
                                                    angle={-20}
                                                    textAnchor="end"
                                                    height={90}
                                                />

                                                <YAxis width={85} />

                                                <Tooltip
                                                    formatter={(value) => [
                                                        formattaImporto(value),
                                                        "Fatturato",
                                                    ]}
                                                />

                                                <Bar
                                                    dataKey="fatturato"
                                                    name="Fatturato"
                                                    fill="#0D6EFD"
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={(data) =>
                                                        vaiAlleFattureCliente(
                                                            data.payload,
                                                        )
                                                    }
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col xs={12} lg={10} xl={9} className="mx-auto">
                        <Card className="h-100 shadow-sm">
                            <Card.Body>
                                <Card.Title>Ultime 12 fatture</Card.Title>
                                <Card.Text className="text-muted">
                                    Monitora le ultime fatture
                                </Card.Text>

                                {ultimeFatture.length === 0 ? (
                                    <Alert variant="info">
                                        Nessuna fattura disponibile.
                                    </Alert>
                                ) : (
                                    <Row className="g-3">
                                        <Col xs={12}>
                                            <div
                                                style={{
                                                    width: "100%",
                                                    height: 350,
                                                }}>
                                                <ResponsiveContainer>
                                                    <BarChart
                                                        data={ultimeFatture}>
                                                        <CartesianGrid strokeDasharray="3 3" />

                                                        <XAxis
                                                            dataKey="numero"
                                                            tick={{
                                                                fontSize: 12,
                                                            }}
                                                            interval={0}
                                                            angle={-20}
                                                            textAnchor="end"
                                                            height={80}
                                                        />

                                                        <YAxis />

                                                        <Tooltip
                                                            formatter={(
                                                                value,
                                                            ) => [
                                                                formattaImporto(
                                                                    value,
                                                                ),
                                                                "Importo",
                                                            ]}
                                                            labelFormatter={(
                                                                label,
                                                            ) =>
                                                                `Fattura ${label}`
                                                            }
                                                        />

                                                        <Bar
                                                            dataKey="importo"
                                                            name="Importo"
                                                            fill="#198754"
                                                            style={{
                                                                cursor: "pointer",
                                                            }}
                                                            onClick={(data) =>
                                                                vaiAlleFattureClienteSecondoGrafico(
                                                                    data.payload
                                                                        .clienteId,
                                                                    data.payload
                                                                        .cliente,
                                                                )
                                                            }
                                                        />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </Col>

                                        <Col xs={12}>
                                            <Row className="g-2">
                                                {ultimeFatture.map(
                                                    (fattura) => (
                                                        <Col
                                                            xs={12}
                                                            md={6}
                                                            lg={4}
                                                            xl={3}
                                                            key={
                                                                fattura.fatturaId
                                                            }>
                                                            <div
                                                                className="border rounded p-2 bg-light h-100"
                                                                style={{
                                                                    cursor: "pointer",
                                                                }}
                                                                role="button"
                                                                tabIndex={0}
                                                                onClick={() =>
                                                                    vaiAlleFattureClienteSecondoGrafico(
                                                                        fattura.clienteId,
                                                                        fattura.cliente,
                                                                    )
                                                                }
                                                                onKeyDown={(
                                                                    event,
                                                                ) => {
                                                                    if (
                                                                        event.key ===
                                                                            "Enter" ||
                                                                        event.key ===
                                                                            " "
                                                                    ) {
                                                                        vaiAlleFattureClienteSecondoGrafico(
                                                                            fattura.clienteId,
                                                                            fattura.cliente,
                                                                        );
                                                                    }
                                                                }}>
                                                                <div className="fw-semibold">
                                                                    Fattura{" "}
                                                                    {
                                                                        fattura.numero
                                                                    }
                                                                </div>

                                                                <div className="small text-muted">
                                                                    {
                                                                        fattura.cliente
                                                                    }
                                                                </div>

                                                                <div className="small text-muted">
                                                                    {formattaImporto(
                                                                        fattura.importo,
                                                                    )}
                                                                </div>

                                                                <Badge
                                                                    bg={getColoreStato(
                                                                        fattura.stato,
                                                                    )}>
                                                                    {
                                                                        fattura.stato
                                                                    }
                                                                </Badge>
                                                            </div>
                                                        </Col>
                                                    ),
                                                )}
                                            </Row>
                                        </Col>
                                    </Row>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default Home;
