import sql from 'mssql';
import poolPromise from '../db.js';
import logger from "../logger.js";

class ProcesamientoNoAtts {
  constructor({ numeroExpediente, idProcesamiento, nombreArchivo, nombreArchivoOriginal, username, cedula, apellidos, nombres, cargo, division, seccion, ciudad, estadoEmpleado }) {
    this.numeroExpediente       = numeroExpediente;
    this.idProcesamiento        = idProcesamiento;
    this.fechaProcesamiento     = new Date();
    this.nombreArchivo          = nombreArchivo;
    this.nombreArchivoOriginal  = nombreArchivoOriginal;
    this.username               = username;
    this.cedula                 = cedula;
    this.apellidos              = apellidos;
    this.nombres                = nombres;
    this.cargo                  = cargo;
    this.division               = division;
    this.seccion                = seccion;
    this.ciudad                 = ciudad;
    this.estadoEmpleado         = estadoEmpleado;
  }

  async create() {
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('numeroExpediente',      sql.Int,      this.numeroExpediente)
        .input('idProcesamiento',       sql.NVarChar, this.idProcesamiento)
        .input('fechaProcesamiento',    sql.DateTime, this.fechaProcesamiento)
        .input('nombreArchivo',         sql.NVarChar, this.nombreArchivo)
        .input('nombreArchivoOriginal', sql.NVarChar, this.nombreArchivoOriginal)
        .input('username',              sql.NVarChar, this.username)
        .input('cedula',                sql.NVarChar, this.cedula)
        .input('apellidos',             sql.NVarChar, this.apellidos)
        .input('nombres',               sql.NVarChar, this.nombres)
        .input('cargo',                 sql.NVarChar, this.cargo)
        .input('division',              sql.NVarChar, this.division)
        .input('seccion',               sql.NVarChar, this.seccion)
        .input('ciudad',                sql.NVarChar, this.ciudad)
        .input('estadoEmpleado',        sql.NVarChar, this.estadoEmpleado)
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
    } catch (error) {
      logger.error('Error al crear procesamiento NoAtts:', error);
      throw error;
    }
  }
}

export default ProcesamientoNoAtts;
