import { PlusIcon, ReceiptText } from "lucide-react";
import { useEffect, useState } from "react";
import { Modal } from "../components/ui/Modal";
import { ComputadorForm } from "../components/computadores/ComputadorForm";
import {
  obtenerComputadores,
  crearComputador as crearComputadorApi,
  actualizarComputador as actualizarComputadorApi,
  ocultarComputador as ocultarComputadorApi
} from "../services/computadoresService";
import { ComputadorCard } from "../components/computadores/ComputadorCard";
import { BarraBusqueda } from "../components/computadores/BarraBusqueda";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const Computadores = () => {
  const [computadores, setComputadores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [computadorEnEdicion, setComputadorEnEdicion] = useState(null);
  const [computadorAOcultar, setComputadorAOcultar] = useState(null);
  const navegar = useNavigate();

  useEffect(() => {
    cargarComputadores();
  }, []);

  async function cargarComputadores() {
    try {
      setCargando(true);
      const datos = await obtenerComputadores();
      setComputadores(datos);
    } catch (error) {
      console.error(error);
      toast.error("Error al conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  }

  const textoBusqueda = busqueda.toLowerCase();

  const computadoresFiltrados = computadores.filter((computador) => {
    return (
      computador.marca.toLowerCase().includes(textoBusqueda) ||
      computador.modelo.toLowerCase().includes(textoBusqueda) ||
      computador.placa.toLowerCase().includes(textoBusqueda) ||
      computador.usuarioEncargado.toLowerCase().includes(textoBusqueda)
    );
  });

  function abrirModalCrear() {
    setComputadorEnEdicion(null); // Limpia datos de edicion
    setMostrarModal(true);
  }

  function abrirModalEditar(computador) {
    setComputadorEnEdicion(computador);
    setMostrarModal(true);
  }

  function cerrarModal() {
    setComputadorEnEdicion(null); // Limpia la referencia al cerrar
    setMostrarModal(false);
  }

  async function guardarComputador(datosFormulario) {
    const estaEditando = computadorEnEdicion !== null;

    try {
      if (estaEditando) {
        const computadorActualizado = await actualizarComputadorApi(
          computadorEnEdicion.id,
          datosFormulario
        );
        setComputadores(
          computadores.map((computador) =>
            computador.id === computadorActualizado.id
              ? computadorActualizado
              : computador
          )
        );
        toast.success("Computador actualizado correctamente.");
      } else {
        const nuevoComputador = await crearComputadorApi(datosFormulario);
        setComputadores([...computadores, nuevoComputador]);
        toast.success("Computador creado correctamente.");
      }

      cerrarModal();
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function confirmarOcultar() {
    try {
      await ocultarComputadorApi(computadorAOcultar.id);
      setComputadores(
        computadores.filter((computador) => computador.id !== computadorAOcultar.id)
      );
      toast.success("Computador ocultado correctamente.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setComputadorAOcultar(null);
    }
  }


  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800 mb-1">
            Computadores
          </h1>
          <p className="text-sm text-gray-500">
            Gestiona el inventario de equipos de cómputo de la empresa.
          </p>
        </div>

        <div className="flex flex-row gap-1">
          <button
            onClick={() => navegar('/computadores/inventario')}
            className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            {" "}
            <ReceiptText size={16} /> ver inventario detallado
          </button>

          {/* boton nuevo computador*/}
          <button
            onClick={abrirModalCrear}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            {" "}
            <PlusIcon size={16} /> Agrgar computador
          </button>
        </div>

      </div>
      <div className="mb-6">
        <BarraBusqueda valor={busqueda} onCambiar={setBusqueda} />
      </div>

      {cargando ? (
        <p className="text-sm text-gray-500 text-center py-12">
          Cargando computadores...
        </p>
      ) : computadoresFiltrados.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-12">
          No se encontraron computadores con ese criterio de búsqueda.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {computadoresFiltrados.map((computador) => (
            <ComputadorCard
              key={computador.id}
              computador={computador}
              onEditar={abrirModalEditar}
              onEliminar={setComputadorAOcultar}
            />
          ))}
        </div>
      )}

      {/* Abrimos el modal */}
      {mostrarModal && (
        <Modal titulo={computadorEnEdicion ? "Actualizar computador" : "Agregar computador"}
          onCerrar={cerrarModal}
        >
          <ComputadorForm
            computadorInicial={computadorEnEdicion}
            onGuardar={guardarComputador}
            onCancelar={cerrarModal}
          />

        </Modal>
      )}

      {computadorAOcultar && (
        <Modal
          titulo="Ocultar computador"
          onCerrar={() => setComputadorAOcultar(null)}
        >
          <p className="text-sm text-gray-600 mb-6">
            ¿Seguro que quieres ocultar el computador con placa{" "}
            <span className="font-semibold">{computadorAOcultar.placa}</span> (
            {computadorAOcultar.marca} {computadorAOcultar.modelo})? Dejará de
            mostrarse en esta lista, pero seguirá guardado en la base de datos.
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setComputadorAOcultar(null)}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              onClick={confirmarOcultar}
              className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
            >
              Sí, ocultar
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};
