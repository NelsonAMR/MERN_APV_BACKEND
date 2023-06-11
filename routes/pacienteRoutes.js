import express from "express";
import {
  actualizarPaciente,
  agregarPaciente,
  eliminarPaciente,
  obtenerPaciente,
  obtenerPacientes,
} from "../controllers/pacienteControllers.js";
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", checkAuth, agregarPaciente);
router.get("/", checkAuth, obtenerPacientes);
router.get("/:id", checkAuth, obtenerPaciente);
router.put("/:id", checkAuth, actualizarPaciente);
router.delete("/:id", checkAuth, eliminarPaciente);

export default router;
