export const ESTADOS = {
    ACTIVO: "ACTIVO",
    INACTIVO: "INACTIVO",
    MANTENIMIENTO: "EN MANTENIMIENTO",
    RECICLAJE: "RECICLAJE"
}

export const ESTILOS_POR_ESTADO = {
  [ESTADOS.ACTIVO]: "bg-green-100 text-green-700",
  [ESTADOS.INACTIVO]: "bg-red-100 text-red-700",
  [ESTADOS.MANTENIMIENTO]: "bg-amber-100 text-amber-700",
  [ESTADOS.RECICLAJE]: "bg-red-300 text-red-700",
};