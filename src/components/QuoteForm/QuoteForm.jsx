import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
export default function QuoteForm() {
  const [form, setForm] = useState({
    origen: "",
    destino: "",
    largo: "",
    ancho: "",
    alto: "",
    peso: "",
    distancia: "",
    total: "",
  });

  const [showPlaceholderOrig, setShowPlaceholderOrig] = useState(true);
  const [showPlaceholderDest, setShowPlaceholderDest] = useState(true);
  const [provinciasArgentinas, setProvinciasArgentinas] = useState([]);
  const [provinciasDestino, setProvinciasDestino] = useState([]);

  async function handleChange(event) {
    const { value } = event.target;
    const { name } = event.target;
    if (name == "origen") {
      setForm({ ...form, [name]: [value] });
      setShowPlaceholderOrig(false);

      const { data } = await axios.get(
        `https://provincias.onrender.com/provincias/${value}`
      );
      console.log(data.distanciaEntreProvincias);

      setProvinciasDestino(data.distanciaEntreProvincias);
      return;
    } else if (name == "destino") {
      setForm({
        ...form,
        [name]: [value],
        distancia: provinciasDestino.find((p) => p.provincia == value)
          .distancia,
      });

      setShowPlaceholderDest(false);
      return;
    }

    setForm({ ...form, [name]: Number(value) });
  }

  useEffect(() => {
    axios
      .get("https://provincias.onrender.com/provincias/")
      .then((response) => {
        const provinciasData = response.data.map((provincia) => ({
          nombre: provincia,
        }));
        setProvinciasArgentinas(provinciasData);
      })
      .catch((error) => {
        console.error("Error al obtener datos de la API:", error);
      });
  }, []);
  const handleFormSubmit = (event) => {
    event.preventDefault();
    let dimensiones = form.alto + form.ancho + form.largo + form.distancia;
    let costoPorKilometro = form.distancia * 1.1;

    console.log("dimensiones", dimensiones);
    console.log("total: $", dimensiones * costoPorKilometro + form.peso);
    setForm({
      ...form,
      total: Number(dimensiones + costoPorKilometro + form.peso).toFixed(2),
    });
  };
  return (
    <div>
      <Form onSubmit={handleFormSubmit}>
        <h2>Cotizar</h2>

        <Form.Group className="mb-3">
          <Form.Text>Desde donde lo envías</Form.Text>
          <Form.Select
            name="origen"
            value={form.origen}
            onChange={handleChange}
            aria-label="Default select example"
            style={{ marginBottom: "10px" }}
          >
            {showPlaceholderOrig && (
              <option value="" disabled hidden>
                Selecciona una provincia
              </option>
            )}
            {provinciasArgentinas.map((p, i) => (
              <option key={i}>{p.nombre}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Text>Hacia donde lo envías</Form.Text>
          <Form.Select
            name="destino"
            value={form.destino}
            onChange={handleChange}
            style={{ marginBottom: "10px" }}
          >
            {showPlaceholderDest && (
              <option value="" disabled hidden>
                Selecciona una provincia
              </option>
            )}
            {provinciasDestino.map((p, i) => (
              <option key={i}>{p.provincia}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Dimensiones del paquete:</Form.Label>{" "}
          <Form.Control
            onChange={handleChange}
            value={form.largo}
            type="number"
            placeholder="Largo (cm)"
            name="largo"
            style={{ marginBottom: "10px" }}
            min="0"
          />
          <Form.Control
            onChange={handleChange}
            value={form.ancho}
            type="number"
            placeholder="Ancho (cm)"
            name="ancho"
            style={{ marginBottom: "10px" }}
            min="0"
          />
          <Form.Control
            onChange={handleChange}
            value={form.alto}
            type="number"
            placeholder="Alto (cm)"
            name="alto"
            style={{ marginBottom: "10px" }}
            min="0"
          />
          <Form.Control
            onChange={handleChange}
            value={form.peso}
            type="number"
            placeholder="Peso (kg)"
            name="peso"
            style={{ marginBottom: "10px" }}
            min="0"
            step="0.1"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Cotizar
        </Button>
      </Form>
      <>
        {form.total !== "" ? (
          <span> El costo de envio es ${form.total}</span>
        ) : (
          ""
        )}
      </>
    </div>
  );
}
