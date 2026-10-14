import { actualizarcomputador, crearComputador, obtenerComputadores, obtenerTodosComputadores, ocultarComputador } from "../models/computador.model.js";

export async function listarComputadores(req, res) {
  try {
    const computadores = await obtenerComputadores();
    res.status(200).json(computadores);
  } catch (error) {
    console.error("Error al obtener computadores:", error);
    res.status(500).json({ mensaje: "Error al consultar los computadores." });
  }
}

export async function listarTodosComputadores(req, res) {
  try {
    const computadores = await obtenerTodosComputadores();
    res.status(200).json(computadores);
  } catch (error) {
    console.error("Error al obtener computadores:", error);
    res.status(500).json({ mensaje: "Error al consultar los computadores." });
  }
}

export async function registrarComputador(req, res) {
  try {
    const nuevoComputador = await crearComputador(req.body);
    res.status(201).json(nuevoComputador);
  } catch (error) {
    console.error("Error al crear computador:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ mensaje: "Ya existe un computador con esa placa." });
    }

    res.status(500).json({ mensaje: "Error al guardar el computador." });
  }
}

export async function modificarComputador(req, res) {
  try {
    const { id } = req.params;
    const computadorActualizado = await actualizarcomputador(id, req.body);

    if (!computadorActualizado) {
      return res.status(404).json({ mensaje: "El computador no existe o está oculto." });
    }

    res.status(200).json(computadorActualizado);
  } catch (error) {
    console.error("Error al actualizar computador:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ mensaje: "Ya existe otro computador con esa placa." });
    }

    res.status(500).json({ mensaje: "Error al actualizar el computador." });
  }
}

export async function eliminarComputador(req, res) {
  try {
    const { id } = req.params;
    const seOculto = await ocultarComputador(id);

    if (!seOculto) {
      return res.status(404).json({ mensaje: "El computador no existe o ya estaba oculto." });
    }

    res.status(200).json({ mensaje: "Computador elimnado correctamente." });
  } catch (error) {
    console.error("Error al ocultar computador:", error);
    res.status(500).json({ mensaje: "Error al ocultar el computador." }); 
  }
  
}