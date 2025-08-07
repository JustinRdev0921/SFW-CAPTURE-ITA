// src/routes/procesingNoAtts.routes.js
import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
// 🔥 Importa aquí tu función correctamente:
import { createProcesamientoNoAtts } from "../controllers/procesingNoAtts.controller.js";

const router = Router();

// Sólo necesitamos el POST “no-attributes”
router.post(
  "/procesing/no-attributes",
  authRequired,
  createProcesamientoNoAtts
);

export default router;
