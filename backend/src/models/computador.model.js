import pool from "../config/db.js";

function mapearComputador(fila) {
  return {
    id: fila.id,
    placa: fila.placa,
    marca: fila.marca,
    modelo: fila.modelo,
    tipoEquipo: fila.tipo_equipo,
    sistemaOperativo: fila.sistema_operativo,
    procesador: fila.procesador,
    macLocal: fila.mac_local,
    macWifi: fila.mac_wifi,
    estado: fila.estado,
    usuarioEncargado: fila.usuario_encargado,
    sede: fila.sede,
    observaciones: fila.observaciones
  };
}

function armarComputador(id, datos) {
  return {
    id,
    placa: datos.placa,
    marca: datos.marca,
    modelo: datos.modelo,
    tipoEquipo: datos.tipoEquipo,
    sistemaOperativo: datos.sistemaOperativo,
    procesador: datos.procesador,
    macLocal: datos.macLocal,
    macWifi: datos.macWifi,
    estado: datos.estado,
    usuarioEncargado: datos.usuarioEncargado,
    sede: datos.sede,
    observaciones: datos.observaciones,
    memoriaRam: datos.memoriaRam.map((modulo) => ({
      tipo: modulo.tipo,
      capacidadGb: Number(modulo.capacidadGb),
      velocidadMhz: Number(modulo.velocidadMhz)
    })),
    discosDuros: datos.discosDuros.map((disco) => ({
      tipo: disco.tipo,
      capacidadGb: Number(disco.capacidadGb),
    })),
  };
}

async function insertarMemoriasYDiscos(conexion, computadorId, datos) {
  for (const modulo of datos.memoriaRam) {
    await conexion.query(
      "INSERT INTO memorias_ram (computador_id, tipo, capacidad_gb, velocidad_mhz) VALUES (?, ?, ?, ?)",
      [computadorId, modulo.tipo, Number(modulo.capacidadGb), Number(modulo.velocidadMhz)]
    );
  }

  for (const disco of datos.discosDuros) {
    await conexion.query(
      "INSERT INTO discos_duros (computador_id, tipo, capacidad_gb) VALUES (?, ?, ?)",
      [computadorId, disco.tipo, Number(disco.capacidadGb)]
    );
  }
}

export async function obtenerComputadores() {
  const [computadores] = await pool.query(
    "SELECT * FROM computadores WHERE activo = TRUE"
  );

  const idsComputadores = computadores.map((c) => c.id);

  if (idsComputadores.length === 0) {
    return [];
  }

  const [memorias] = await pool.query(
    "SELECT * FROM memorias_ram WHERE computador_id IN (?)",
    [idsComputadores]
  );

  const [discos] = await pool.query(
    "SELECT * FROM discos_duros WHERE computador_id IN (?)",
    [idsComputadores]
  );

  return computadores.map((computador) => ({
    ...mapearComputador(computador),
    memoriaRam: memorias
      .filter((m) => m.computador_id === computador.id)
      .map((m) => ({ tipo: m.tipo, capacidadGb: m.capacidad_gb, velocidadMhz: m.velocidad_mhz })),
    discosDuros: discos
      .filter((d) => d.computador_id === computador.id)
      .map((d) => ({ tipo: d.tipo, capacidadGb: d.capacidad_gb })),
  }));
}

export async function obtenerTodosComputadores() {
  const [computadores] = await pool.query(
    "SELECT * FROM computadores"
  );

  const idsComputadores = computadores.map((c) => c.id);

  if (idsComputadores.length === 0) {
    return [];
  }

  const [memorias] = await pool.query(
    "SELECT * FROM memorias_ram WHERE computador_id IN (?)",
    [idsComputadores]
  );

  const [discos] = await pool.query(
    "SELECT * FROM discos_duros WHERE computador_id IN (?)",
    [idsComputadores]
  );

  return computadores.map((computador) => ({
    ...mapearComputador(computador),
    memoriaRam: memorias
      .filter((m) => m.computador_id === computador.id)
      .map((m) => ({ tipo: m.tipo, capacidadGb: m.capacidad_gb, velocidadMhz: m.velocidad_mhz })),
    discosDuros: discos
      .filter((d) => d.computador_id === computador.id)
      .map((d) => ({ tipo: d.tipo, capacidadGb: d.capacidad_gb })),
  }));
}

export async function crearComputador(datos) {
  const conexion = await pool.getConnection();

  try {
    await conexion.beginTransaction();
    const [resultado] = await conexion.query(
      `INSERT INTO computadores
        (placa, marca, modelo, tipo_equipo, sistema_operativo, procesador, mac_local, mac_wifi, estado, usuario_encargado,sede, observaciones)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        datos.placa,
        datos.marca,
        datos.modelo,
        datos.tipoEquipo,
        datos.sistemaOperativo,
        datos.procesador,
        datos.macLocal,
        datos.macWifi,
        datos.estado,
        datos.usuarioEncargado,
        datos.sede,
        datos.observaciones
      ]

    );

    const computadorId = resultado.insertId;

    await insertarMemoriasYDiscos(conexion, computadorId, datos);

    await conexion.commit();

    return armarComputador(computadorId, datos);

  } catch (error) {
    await conexion.rollback();
    throw error;
  } finally {
    conexion.release();
  }
}

export async function actualizarcomputador(id, datos) {
  const conexion = await pool.getConnection();

  try {
    await conexion.beginTransaction();

    const [resultado] = await conexion.query(
      `UPDATE computadores SET
        placa = ?, marca = ?, modelo = ?, tipo_equipo = ?, sistema_operativo = ?,
        procesador = ?, mac_local = ?, mac_wifi = ?, estado = ?, usuario_encargado = ?,
        sede = ?, observaciones = ?
       WHERE id = ? AND activo = TRUE`,
      [
        datos.placa,
        datos.marca,
        datos.modelo,
        datos.tipoEquipo,
        datos.sistemaOperativo,
        datos.procesador,
        datos.macLocal,
        datos.macWifi,
        datos.estado,
        datos.usuarioEncargado,
        datos.sede,
        datos.observaciones,
        id,
      ]
    );

    if (resultado.affectedRows === 0) {
      await conexion.rollback();
      return null;
    }

    await conexion.query("DELETE FROM memorias_ram WHERE computador_id = ?", [id]);
    await conexion.query("DELETE FROM discos_duros WHERE computador_id = ?", [id]);

    await insertarMemoriasYDiscos(conexion, id, datos);

    await conexion.commit();

    return armarComputador(Number(id), datos);

  } catch (error) {
    await conexion.rollback();
    throw error;
  }finally {
    conexion.release();
  }
}

export async function ocultarComputador(id) {
  const [resultado] = await pool.query(
    "UPDATE computadores SET activo = FALSE WHERE id = ? AND activo = TRUE",
    [id]
  );

  return resultado.affectedRows > 0;

}