const API_URL = "http://localhost:3000/api/computadores";

export async function obtenerComputadores() {
  const respuesta = await fetch(API_URL);

  if (!respuesta.ok) {
    throw new Error("No se pudo obtener la lista de computadores.");
  }
  
  return respuesta.json();
}

export async function obtenerTodosComputadores() {
  const respuesta = await fetch(`${API_URL}/todos`);

  if (!respuesta.ok) {
    throw new Error("No se pudo obtener la lista de computadores.");
  }
  
  return respuesta.json();
}

export async function crearComputador(datos) {
  const respuesta = await fetch (API_URL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(datos)
  });

  const resultado = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(resultado.mensaje || "No se pudo crear el computador.");
  }

  return resultado;
  
}

export async function actualizarComputador(id, datos) {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });

  const resultado = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(resultado.mensaje || "No se pudo actualizar el computador.");
  }

  return resultado;
}

export async function ocultarComputador(id) {
  const respuesta = await fetch(`${API_URL}/${id}`,{
    method: "DELETE",
  });

  const resultado = await respuesta.json();

  if (!resultado) {
    throw new Error(resultado.mensaje || "No se pudo ocultar el computador.");
  }

  return resultado;
  
}
