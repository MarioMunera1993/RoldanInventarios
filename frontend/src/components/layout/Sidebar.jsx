import { LayoutDashboard, Monitor, Phone, Printer } from "lucide-react";
import { NavLink } from "react-router-dom";

const itemsNavegacion = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/computadores", label: "Computadores", icon: Monitor },
  { to: "/impresoras", label: "Impresoras", icon: Printer },
  { to: "/telefonos", label: "Teléfonos", icon: Phone },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 flex flex-col bg-slate-900 text-white">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <p className="text-lg font-semibold">Inventario Tecnologico</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {itemsNavegacion.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({
              isActive,
            }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
          ${
            isActive
              ? "bg-slate-800 text-red-400"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};