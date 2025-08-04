import sql from 'mssql';
import poolPromise from '../db.js';
import logger from "../logger.js";

class Procesamiento {
  constructor(numeroExpediente, idProcesamiento, idSitio, idCiudad, idArea, idGrupo, idTipoDoc, fechaProcesamiento, nombreArchivo, username, cedula,
    apellidos, nombres, cargo, division, seccion, ciudad, tipoContrato, estadoEmpleado, nombreArchivoOriginal) {
    this.numeroExpediente = numeroExpediente;
    this.idProcesamiento = idProcesamiento;
    this.idSitio = idSitio;
    this.idCiudad = idCiudad;
    this.idArea = idArea;
    this.idGrupo = idGrupo;
    this.idTipoDoc = idTipoDoc;
    this.fechaProcesamiento = fechaProcesamiento;
    this.nombreArchivo = nombreArchivo;
    this.username = username;
    this.cedula = cedula;
    this.apellidos = apellidos;
    this.nombres = nombres;
    this.cargo = cargo;
    this.division = division;
    this.seccion = seccion;
    this.ciudad = ciudad;
    this.tipoContrato = tipoContrato;
    this.estadoEmpleado = estadoEmpleado;
    this.nombreArchivoOriginal = nombreArchivoOriginal;
  }

  static async find() {
    try {
      const pool = await poolPromise;
      const result = await pool.request().execute('GetProcesamiento');
      return result.recordset;
    } catch (error) {
      logger.error('Error al buscar Procesamientos:', error);
      throw error;
    }
  }

  async create() {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('numeroExpediente', sql.Int, this.numeroExpediente)
        .input('idProcesamiento', sql.NVarChar, this.idProcesamiento)
        .input('idSitio', sql.NVarChar, this.idSitio)
        .input('idCiudad', sql.NVarChar, this.idCiudad)
        .input('idArea', sql.NVarChar, this.idArea)
        .input('idGrupo', sql.NVarChar, this.idGrupo)
        .input('idTipoDoc', sql.NVarChar, this.idTipoDoc)
        .input('fechaProcesamiento', sql.Date, this.fechaProcesamiento)
        .input('nombreArchivo', sql.NVarChar, this.nombreArchivo)
        .input('username', sql.NVarChar, this.username)
        .input('cedula', sql.NVarChar, this.cedula)
        .input('apellidos', sql.NVarChar, this.apellidos)
        .input('nombres', sql.NVarChar, this.nombres)
        .input('cargo', sql.NVarChar, this.cargo)
        .input('division', sql.NVarChar, this.division)
        .input('seccion', sql.NVarChar, this.seccion)
        .input('ciudad', sql.NVarChar, this.ciudad)
        .input('tipoContrato', sql.NVarChar, this.tipoContrato)
        .input('estadoEmpleado', sql.NVarChar, this.estadoEmpleado)
        .input('nombreArchivoOriginal', sql.NVarChar, this.nombreArchivoOriginal)
        .query(`
          INSERT INTO Procesamiento (numeroExpediente, idProcesamiento, idSitio, idCiudad, idArea, idGrupo, idTipoDoc, fechaProcesamiento, nombreArchivo, username, cedula, apellidos, nombres, cargo, division, seccion, ciudad, tipoContrato, estadoEmpleado, nombreArchivoOriginal)
          VALUES (@numeroExpediente, @idProcesamiento, @idSitio, @idCiudad, @idArea, @idGrupo, @idTipoDoc, @fechaProcesamiento, @nombreArchivo, @username, @cedula, @apellidos, @nombres, @cargo, @division, @seccion, @ciudad, @tipoContrato, @estadoEmpleado, @nombreArchivoOriginal)
        `);

      return result.recordset;
    } catch (error) {
      logger.error('Error al crear procesamiento:', error);
      throw error;
    }
  }
}

export default Procesamiento;