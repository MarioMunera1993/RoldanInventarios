import { Route, Routes } from "react-router-dom"
import { Dashboard } from "../pages/Dashboard"
import { Computadores } from "../pages/Computadores"
import { ComputadorInventarioTabla } from "../components/computadores/ComputadorInventarioTabla"

export const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<Dashboard />}/>
        <Route path="computadores" element={<Computadores />}/>
        <Route path="/computadores/inventario" element={<ComputadorInventarioTabla />} />
    </Routes>
  )
}
