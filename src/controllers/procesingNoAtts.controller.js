import sql from 'mssql';
import poolPromise from '../db.js';
import logger from "../logger.js";

export const createProcesamientoNoAtts = async (req, res) => {
  try {
    const {
      numeroExpediente,
      idProcesamiento,
      nombreArchivo,
      nombreArchivoOriginal,
      username,
      cedula,
      apellidos,
      nombres,
      cargo,
      division,
      seccion,
      ciudad,
      estadoEmpleado
    } = req.body;

    const fechaProcesamiento = new Date();
    const pool = await poolPromise;

    await pool.request()
      .input('numeroExpediente',      sql.Int,      numeroExpediente)
      .input('idProcesamiento',       sql.NVarChar, idProcesamiento)
      .input('fechaProcesamiento',    sql.DateTime, fechaProcesamiento)
      .input('nombreArchivo',         sql.NVarChar, nombreArchivo)
      .input('nombreArchivoOriginal', sql.NVarChar, nombreArchivoOriginal)
      .input('username',              sql.NVarChar, username)
      .input('cedula',                sql.NVarChar, cedula)
      .input('apellidos',             sql.NVarChar, apellidos)
      .input('nombres',               sql.NVarChar, nombres)
      .input('cargo',                 sql.NVarChar, cargo)
      .input('division',              sql.NVarChar, division)
      .input('seccion',               sql.NVarChar, seccion)
      .input('ciudad',                sql.NVarChar, ciudad)
      .input('estadoEmpleado',        sql.NVarChar, estadoEmpleado)
      .query(`
        INSERT INTO Procesamiento
        (numeroExpediente, idProcesamiento, fechaProcesamiento,
         nombreArchivo, nombreArchivoOriginal, username,
         cedula, apellidos, nombres, cargo,
         division, seccion, ciudad, estadoEmpleado)
        VALUES
        (@numeroExpediente, @idProcesamiento, @fechaProcesamiento,
         @nombreArchivo, @nombreArchivoOriginal, @username,
         @cedula, @apellidos, @nombres, @cargo,
         @division, @seccion, @ciudad, @estadoEmpleado)
      `);

    res.status(200).json({ message: 'Procesamiento (NoAtts) creado correctamente' });
  } catch (error) {
    logger.error('Error al crear procesamiento NoAtts', error);
    res.status(500).json({ message: error.message });
  }
};
