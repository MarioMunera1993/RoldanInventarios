import { Search } from "lucide-react";

export const BarraBusqueda = ({ valor, onCambiar }) => {
  return (
    <div className="relative w-full sm:w-95">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        value={valor}
        onChange={(e) => onCambiar(e.target.value)}
        placeholder="Buscar por marca, modelo, placa o responsable..."
        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
};
