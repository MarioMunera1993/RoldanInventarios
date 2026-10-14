import { useNavigate } from "react-router-dom";
import { obtenerTodosComputadores } from "../../services/computadoresService";
import { useEffect, useState } from "react";
import { BarraBusqueda } from "./BarraBusqueda";
import { ESTILOS_POR_ESTADO } from "../../constants/estados";
//import { toast } from "react-toastify"; // Asegúrate de importar toast si lo usas

export const ComputadorInventarioTabla = () => {
    const [computadores, setComputadores] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [busqueda, setBusqueda] = useState("");
    const navegar = useNavigate();

    useEffect(() => {
        cargarComputadores();
    }, []);

    async function cargarComputadores() {
        try {
            setCargando(true);
            const datos = await obtenerTodosComputadores();
            // Asegúrate de que 'datos' sea un arreglo. Si viene dentro de un objeto (ej: datos.data), ajústalo aquí.
            setComputadores(datos || []);
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
            (computador.marca?.toLowerCase() || "").includes(textoBusqueda) ||
            (computador.modelo?.toLowerCase() || "").includes(textoBusqueda) ||
            (computador.placa?.toLowerCase() || "").includes(textoBusqueda) ||
            (computador.usuarioEncargado?.toLowerCase() || "").includes(textoBusqueda)
        );
    });

    return (
        <div className='space-y-6 animate-fadeIn'>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <button
                        onClick={() => navegar('/computadores')}
                        className="text-blue-600 font-bold flex items-center gap-2 mb-2 hover:underline"
                    >
                        ← Volver a Vista de Tarjetas
                    </button>
                    <h1 className="text-2xl font-black text-gray-800">Inventario Detallado de Equipos</h1>
                    <p className="text-gray-500 font-medium text-sm">Listado completo con especificaciones de hardware.</p>
                </div>

                <div className="mb-6">
                    <BarraBusqueda valor={busqueda} onCambiar={setBusqueda} />
                </div>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="max-h-[60vh] overflow-auto">
                    <table className="w-max min-w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10 shadow-sm">
                                <th className="px-4 py-3 text-[10px] font-black uppercase text-gray-400">id</th>
                                <th className="px-4 py-3 text-[10px] font-black uppercase text-gray-400">Placa</th>
                                <th className="px-4 py-3 text-[10px] font-black uppercase text-gray-400">Marca</th>
                                <th className="px-4 py-3 text-[10px] font-black uppercase text-gray-400">Modelo</th>
                                <th className="px-4 py-3 text-[10px] font-black uppercase text-gray-400">Procesador</th>
                                <th className="px-4 py-3 text-[10px] font-black uppercase text-gray-400">Sistema</th>
                                <th className="px-4 py-3 text-[10px] font-black uppercase text-gray-400">TipoEquipo</th>
                                <th className="px-4 py-3 text-[10px] font-black uppercase text-gray-400">Mac Local</th>
                                <th className="px-4 py-3 text-[10px] font-black uppercase text-gray-400">Mac Wifi</th>
                                <th className="px-4 py-3 text-[10px] font-black uppercase text-gray-400">Sede</th>
                                <th className="px-4 py-3 text-[10px] font-black uppercase text-gray-400">Responsable</th>
                                <th className="px-4 py-3 text-[10px] font-black uppercase text-gray-400">Estado</th>
                                <th className="px-4 py-3 text-[10px] font-black uppercase text-gray-400">Observaciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {cargando ? (
                                <tr>
                                    <td colSpan="12" className="text-sm text-gray-500 text-center py-12">
                                        Cargando computadores...
                                    </td>
                                </tr>
                            ) : computadoresFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan="12" className="text-sm text-gray-500 text-center py-12">
                                        No se encontraron computadores con ese criterio de búsqueda.
                                    </td>
                                </tr>
                            ) : (
                                computadoresFiltrados.map((computador) => (
                                    <tr key={computador.id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-4 py-4">{computador.id}</td>
                                        <td className="px-4 py-4"><span className="bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded-lg">{computador.placa}</span></td>
                                        <td className="px-4 py-4">{computador.marca}</td>
                                        <td className="px-4 py-4">{computador.modelo}</td>
                                        <td className="px-4 py-4 text-xs font-bold text-blue-600 whitespace-nowrap">{computador.procesador}</td>
                                        <td className="px-4 py-4 text-xs font-black text-purple-600 whitespace-nowrap">{computador.sistemaOperativo}</td>
                                        <td className="px-4 py-4">{computador.tipoEquipo}</td>
                                        <td className="px-4 py-4">{computador.macLocal}</td>
                                        <td className="px-4 py-4">{computador.macWifi}</td>
                                        <td className="px-4 py-4">{computador.sede}</td>
                                        <td className="px-4 py-4">{computador.usuarioEncargado}</td>
                                        <td className="px-4 py-4"><span className={`text-[10px] font-black px-2 py-1 rounded-lg ${ESTILOS_POR_ESTADO[computador.estado]
                                            }`}>{computador.estado}</span></td>
                                        <td className="px-4 py-4">{computador.observaciones}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};