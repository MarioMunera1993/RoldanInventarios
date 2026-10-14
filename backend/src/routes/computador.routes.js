import { Router } from "express";
import { listarComputadores, registrarComputador, eliminarComputador, modificarComputador, listarTodosComputadores} from "../controllers/computador.controller.js";

const router = Router();

router.get("/", listarComputadores);
router.get("/todos", listarTodosComputadores);
router.post("/", registrarComputador);
router.put("/:id", modificarComputador);
router.delete("/:id", eliminarComputador);

export default router;