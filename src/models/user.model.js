import sql from 'mssql';
import poolPromise from '../db.js';
import logger from "../logger.js";

class User {
  constructor(username, email, contrasena, nombreUsuario) {
    this.username = username;
    this.email = email;
    this.contrasena = contrasena;
    this.nombreUsuario = nombreUsuario;
  }

  async save() {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('username', sql.NVarChar, this.username)
        .input('email', sql.NVarChar, this.email)
        .input('contrasena', sql.NVarChar, this.contrasena)
        .input('nombreUsuario', sql.NVarChar, this.nombreUsuario)
        .query(`
          INSERT INTO Users (username, email, contrasena, nombreUsuario)
          OUTPUT INSERTED.id
          VALUES (@username, @email, @contrasena, @nombreUsuario)
        `);

      return result.recordset[0].id;
    } catch (error) {
      logger.error('Error al crear usuario:', error);
      throw error;
    }
  }

  /*static async findOne(email) {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('email', sql.NVarChar, email)
        .query('SELECT * FROM Users WHERE email = @email');
        
      return result.recordset[0] || null;
    } catch (error) {
      logger.error('Error al buscar usuario:', error);
      throw error;
    }
  }*/

  static async findOne(email) {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('email', sql.NVarChar, email)
        .execute('GetUsers');

      const user = result.recordset[0];

      if (user) {
        // Parse idArea from string to array of strings
        user.idArea = user.idArea.split(', ');
      }

      return user || null;
    } catch (error) {
      logger.error('Error al buscar usuario por email:', error);
      throw error;
    }
  }

  /*static async findById(id) {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM Users WHERE id = @id');

      return result.recordset[0] || null;
    } catch (error) {
      logger.error('Error al buscar usuario por id:', error);
      throw error;
    }
  }*/

  static async findById(id) {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('id', sql.Int, id)
        .execute('GetUserById');

      const user = result.recordset[0];

      if (user) {
        // Parse idArea from string to array of strings
        user.idArea = user.idArea.split(', ');
      }

      return user || null;
    } catch (error) {
      logger.error('Error al buscar usuario por id:', error);
      throw error;
    }
  }
}

export default User;