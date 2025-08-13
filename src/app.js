// src/app.js
import express from "express";
import morgan from "morgan";

//rutas
import authRoutes from "./routes/auth.routes.js";
import users from "./routes/users.routes.js";
import procesing from "./routes/procesing.routes.js";
import procesingNoAttsRouter from "./routes/procesingNoAtts.routes.js";
import categoriesRoutes from './routes/categories.routes.js'

//otros
import cookieParser from "cookie-parser";
import cors from 'cors';
import fileUpload from 'express-fileupload';
import path from 'path';
import fs from 'fs';
import logger from './logger.js';
import requestIp from 'request-ip';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 } // 50 MB límite de tamaño de archivo
}));

// Rutas principales
app.use("/api", authRoutes);
app.use("/api", users);
app.use("/api", procesing);
app.use("/api", procesingNoAttsRouter);
app.use("/api", categoriesRoutes);

// Middleware para obtener IP del cliente
app.use(requestIp.mw());

// Manejador de errores global
app.use((err, req, res, next) => {
  logger.error(`Error global: ${err.message}`);
  res.status(500).json({ message: 'Ha ocurrido un error en el servidor' });
});

export default app;
