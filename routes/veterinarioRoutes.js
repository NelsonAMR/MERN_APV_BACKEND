import express from "express";
import {
  autenticar,
  comprobarToken,
  confirmar,
  nuevoPass,
  perfil,
  recuperarPass,
  registrar,
  actualizarPerfil,
  actualizarPassword,
} from "../controllers/veterinarioController.js";
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();

//area oublica
router.post("/", registrar);
router.get("/confirmar/:token", confirmar);
router.post("/login", autenticar);
router.post("/recuperar", recuperarPass);
router.route("/recuperar/:token").get(comprobarToken).post(nuevoPass);

//area privada
router.get("/perfil", checkAuth, perfil);
router.put("/perfil/:id", checkAuth, actualizarPerfil);
router.put("/actualizar-password", checkAuth, actualizarPassword);

export default router;
