import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from 'sonner'
import { TIPOS_EQUIPO } from "../../constants/tiposEquipo";
import { SISTEMAS_OPERATIVOS } from "../../constants/sistemasOperativos";
import { ESTADOS } from "../../constants/estados";
import { TIPOS_RAM } from "../../constants/tiposRam";
import { TIPOS_ALMACENAMIENTO } from "../../constants/tiposAlmacenamiento";
import { MARCAS } from "../../constants/marcas";
import { SEDES } from "../../constants/sedes";
import { BotonAccion } from "../ui/BotonAccion";

const datosIniciales = {
    placa: "",
    marca: "",
    modelo: "",
    tipoEquipo: "",
    sistemaOperativo: "",
    procesador: "",
    macLocal: "",
    macWifi: "",
    estado: "",
    memoriaRam: [],
    discosDuros: [],
    usuarioEncargado: "",
    sede: "",
    observaciones: ""
}


export const ComputadorForm = ({ computadorInicial, onGuardar, onCancelar }) => {

    const [datos, setDatos] = useState(datosIniciales);

    const estaEditando = Boolean(computadorInicial?.id || computadorInicial);

    useEffect(() => {
    if (computadorInicial) {
        setDatos({
            ...datosIniciales,
            ...computadorInicial,
            // Aseguramos que los arrays no sean undefined si la API no los retorna
            memoriaRam: computadorInicial.memoriaRam || [],
            discosDuros: computadorInicial.discosDuros || [],
            observaciones: computadorInicial.observaciones || ""
        });
    } else {
        setDatos(datosIniciales);
    }
}, [computadorInicial]);

    function actualizarCampo(campo, valor) {
        setDatos({ ...datos, [campo]: valor });
    }

    {/* Funciones para manejar las ram */ }
    function actualizarModuloRam(index, campo, valor,) {
        const nuevaLista = datos.memoriaRam.map((modulo, i) =>
            i === index ? { ...modulo, [campo]: valor } : modulo,
        );
        setDatos({ ...datos, memoriaRam: nuevaLista });
    }

    function agregarModuloRam() {
        setDatos({
            ...datos,
            memoriaRam: [...datos.memoriaRam, { tipo: "", capacidadGb: "", velocidadMhz: "" }],
        });
    }

    function quitarModuloRam(index) {
        setDatos({
            ...datos,
            memoriaRam: datos.memoriaRam.filter((_, i) => i !== index),
        });
    }

    {/* FUNCIONES PARA MANEJAR DISCOS */ }
    function actualizarDisco(index, campo, valor) {
        const nuevaLista = datos.discosDuros.map((disco, i) =>
            i === index ? { ...disco, [campo]: valor } : disco,
        );
        setDatos({ ...datos, discosDuros: nuevaLista });
    }

    function agregarDisco() {
        setDatos({
            ...datos,
            discosDuros: [...datos.discosDuros, { tipo: "", capacidadGb: "" }],
        });
    }

    function quitarDisco(index) {
        setDatos({
            ...datos,
            discosDuros: datos.discosDuros.filter((_, i) => i !== index),
        });
    }

    function manejarEnvio(event) {
        event.preventDefault();

        if (!datos.placa || !datos.marca || !datos.modelo || !datos.usuarioEncargado) {
            toast.error("Completa placa, marca, modelo y usuario encargado.");
            return;
        }

        {/* Antes de gauradr validamos que los datos de ram y de disco esten completos */ }
        const ramIncompleta = datos.memoriaRam.some((m) => !m.tipo || !m.capacidadGb || !m.velocidadMhz);
        const discoIncompleto = datos.discosDuros.some((d) => !d.tipo || !d.capacidadGb);

        if (ramIncompleta || discoIncompleto) {
            toast.error("La informacion de las ram o de los discos debe ir completa");
            return;
        }

        const datosFormateados = {
            ...datos,
            placa: datos.placa.trim().toUpperCase(),
            modelo: datos.modelo.trim().toUpperCase(),
            procesador: datos.procesador.trim().toUpperCase(),
            macLocal: datos.macLocal.trim().toUpperCase(),
            macWifi: datos.macWifi.trim().toUpperCase(),
            usuarioEncargado: datos.usuarioEncargado.trim().toUpperCase(),
        };

        onGuardar(datosFormateados);
    }

    return (
        <form onSubmit={manejarEnvio} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">

                <Campo label={"Placa / Número interno"}>
                    <input type="tex"
                        value={datos.placa}
                        onChange={(e) => actualizarCampo("placa", e.target.value)}
                        className="input uppercase"

                    />
                </Campo>

                <Campo label="Usuario encargado">
                    <input
                        type="text"
                        value={datos.usuarioEncargado}
                        onChange={(e) =>
                            actualizarCampo("usuarioEncargado", e.target.value)
                        }
                        className="input uppercase"
                    />
                </Campo>

                <Campo label="Marca">
                    <select
                        value={datos.marca}
                        onChange={(e) => actualizarCampo("marca", e.target.value)}
                        className="input uppercase"
                    >
                        <option value="" disabled >Seleccione Marca</option>
                        {Object.values(MARCAS).map((marca) => (
                            <option key={marca} value={marca}>
                                {marca}
                            </option>
                        ))}
                    </select>
                </Campo>

                <Campo label="Modelo">
                    <input
                        type="text"
                        value={datos.modelo}
                        onChange={(e) => actualizarCampo("modelo", e.target.value)}
                        className="input uppercase"
                    />
                </Campo>

                <Campo label="Tipo de equipo">
                    <select
                        value={datos.tipoEquipo}
                        onChange={(e) => actualizarCampo("tipoEquipo", e.target.value)}
                        className="input uppercase"
                    >
                        <option value="" disabled >Seleccione Tipo</option>
                        {Object.values(TIPOS_EQUIPO).map((tipo) => (
                            <option key={tipo} value={tipo}>
                                {tipo}
                            </option>
                        ))}
                    </select>
                </Campo>

                <Campo label="Sistema operativo">
                    <select
                        value={datos.sistemaOperativo}
                        onChange={(e) =>
                            actualizarCampo("sistemaOperativo", e.target.value)
                        }
                        className="input uppercase"
                    >
                        <option value="" disabled >Seleccione Sistema</option>
                        {Object.values(SISTEMAS_OPERATIVOS).map((sistema) => (
                            <option key={sistema} value={sistema}>
                                {sistema}
                            </option>
                        ))}
                    </select>
                </Campo>

                <Campo label="Procesador">
                    <input
                        type="text"
                        value={datos.procesador}
                        onChange={(e) => actualizarCampo("procesador", e.target.value)}
                        className="input uppercase"
                    />
                </Campo>

                <Campo label="MAC local">
                    <input
                        type="text"
                        value={datos.macLocal}
                        onChange={(e) => actualizarCampo("macLocal", e.target.value)}
                        className="input uppercase"
                    />
                </Campo>

                <Campo label="MAC wifi">
                    <input
                        type="text"
                        value={datos.macWifi}
                        onChange={(e) => actualizarCampo("macWifi", e.target.value)}
                        className="input uppercase"
                    />
                </Campo>

                <Campo label="Estado">
                    <select
                        value={datos.estado}
                        onChange={(e) => actualizarCampo("estado", e.target.value)}
                        className="input uppercase"
                    >
                        <option value="" disabled >Seleccione Estado</option>
                        {Object.values(ESTADOS).map((estado) => (
                            <option key={estado} value={estado}>
                                {estado}
                            </option>
                        ))}
                    </select>
                </Campo>

                <Campo label="Sede">
                    <select
                        value={datos.sede}
                        onChange={(e) => actualizarCampo("sede", e.target.value)}
                        className="input uppercase"
                    >
                        <option value="" disabled >Seleccione Sede</option>
                        {Object.values(SEDES).map((sede) => (
                            <option key={sede} value={sede}>
                                {sede}
                            </option>
                        ))}
                    </select>
                </Campo>

                <Campo label="Observaciones (opcional)">
                    <textarea
                        value={datos.observaciones}
                        onChange={(e) => actualizarCampo("observaciones", e.target.value)}
                        rows={3}
                        maxLength={500}
                        className="input resize-none"
                    />
                </Campo>
            </div>
            {/* Seccion de ram */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                        Memoria RAM (opcional)
                    </span>
                    <button
                        type="button"
                        onClick={agregarModuloRam}
                        className="text-blue-600 text-sm flex items-center gap-1 hover:text-blue-700"
                    >
                        <Plus size={14} /> Agregar módulo
                    </button>
                </div>

                {datos.memoriaRam.length === 0 && (
                    <p className="text-sm text-gray-400">Sin memoria RAM registrada.</p>
                )}

                {datos.memoriaRam.map((modulo, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                        <select
                            value={modulo.tipo}
                            onChange={(e) => actualizarModuloRam(index, "tipo", e.target.value)}
                            className="input"
                        >
                            <option value="" disabled >Seleccione Tipo</option>
                            {TIPOS_RAM.map((tipo) => (
                                <option key={tipo} value={tipo}>
                                    {tipo}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            placeholder="GB"
                            value={modulo.capacidadGb}
                            onChange={(e) =>
                                actualizarModuloRam(index, "capacidadGb", e.target.value)
                            }
                            className="input uppercase"
                        />
                        <input
                            type="number"
                            placeholder="MHz"
                            value={modulo.velocidadMhz}
                            onChange={(e) =>
                                actualizarModuloRam(index, "velocidadMhz", e.target.value)
                            }
                            className="input uppercase"
                        />
                        <button
                            type="button"
                            onClick={() => quitarModuloRam(index)}
                            className="text-gray-400 hover:text-red-600"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Seccion para discos */}

            <div>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                        Discos duros (opcional)
                    </span>
                    <button
                        type="button"
                        onClick={agregarDisco}
                        className="text-blue-600 text-sm flex items-center gap-1 hover:text-blue-700"
                    >
                        <Plus size={14} /> Agregar disco
                    </button>
                </div>

                {datos.discosDuros.length === 0 && (
                    <p className="text-sm text-gray-400">Sin discos registrados.</p>
                )}

                {datos.discosDuros.map((disco, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                        <select
                            value={disco.tipo}
                            onChange={(e) => actualizarDisco(index, "tipo", e.target.value)}
                            className="input uppercase"
                        >
                            <option value="" disabled >Seleccione Tipo</option>
                            {TIPOS_ALMACENAMIENTO.map((tipo) => (
                                <option key={tipo} value={tipo}>
                                    {tipo}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            placeholder="GB"
                            value={disco.capacidadGb}
                            onChange={(e) =>
                                actualizarDisco(index, "capacidadGb", e.target.value)
                            }
                            className="input uppercase"
                        />
                        <button
                            type="button"
                            onClick={() => quitarDisco(index)}
                            className="text-gray-400 hover:text-red-600"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>


            {/*Botones de accion */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onCancelar}
                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                    Cancelar
                </button>
                <BotonAccion titulo={estaEditando ? "Actualizar computador" : "Guardar computador"} />
            </div>
        </form>
    )
}

{/* se crea este para que todos los campos tengan la misma estructura */ }
function Campo({ label, children }) {
    return (
        <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </span>
            {children}
        </label>
    );
}
