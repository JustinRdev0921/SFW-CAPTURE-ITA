import sql from 'mssql';
import poolPromise from '../db.js';
import logger from "../logger.js";

class User {
  constructor(username, email, contrasena, nombreUsuario, idDepartamento, idCiudad, Admin, areas) {
    this.username = username;
    this.email = email;
    this.contrasena = contrasena;
    this.nombreUsuario = nombreUsuario;
    this.idDepartamento = idDepartamento;
    this.idCiudad = idCiudad;
    this.admin = Admin;
    this.areas = areas; // array of area IDs
  }

  static async find() {
    try {
      const pool = await poolPromise;
      const result = await pool.request().execute('GetUsersWithAreas');
      return result.recordset;
    } catch (error) {
      logger.error('Error al buscar usuarios:', error);
      throw error;
    }
  }

  async create() {
    const transaction = new sql.Transaction(await poolPromise);
    try {
      await transaction.begin();

      const userRequest = transaction.request();
      const result = await userRequest
        .input('username', sql.NVarChar, this.username)
        .input('email', sql.NVarChar, this.email)
        .input('contrasena', sql.NVarChar, this.contrasena)
        .input('nombreUsuario', sql.NVarChar, this.nombreUsuario)
        .input('idDepartamento', sql.NVarChar, this.idDepartamento)
        .input('idCiudad', sql.Int, this.idCiudad)
        .input('Admin', sql.Int, this.admin)
        .query(`
          INSERT INTO Users (username, email, contrasena, nombreUsuario, idDepartamento, idCiudad, Admin)
          OUTPUT INSERTED.id
          VALUES (@username, @email, @contrasena, @nombreUsuario, @idDepartamento, @idCiudad, @Admin)
        `);

      const userId = result.recordset[0].id;

      for (const areaId of this.areas) {
        await transaction.request()
          .input('userId', sql.Int, userId)
          .input('areaId', sql.NVarChar, areaId)
          .query(`
            INSERT INTO UserAreas (userId, areaId)
            VALUES (@userId, @areaId)
          `);
      }

      await transaction.commit();

      return userId;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error al crear usuario:', error);
      throw error;
    }
  }

  static async findById(id) {
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
  }

  static async deleteUser(id) {
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('IdUsuario', sql.Int, id)
        .query('UPDATE Users SET Activo = 0 WHERE id = @IdUsuario');

      console.log('Usuario eliminado con éxito');
      return true;
    } catch (error) {
      logger.error('Error al eliminar usuario:', error);
      throw error;
    }
  }

  /*static async updateUser(id, userData) {
    try {
      const pool = await poolPromise;
      const request = pool.request().input('id', sql.Int, id);

      Object.keys(userData).forEach(key => {
        request.input(key, userData[key] instanceof Number ? sql.Int : sql.NVarChar, userData[key]);
      });

      const query = `
        UPDATE Users 
        SET ${Object.keys(userData).map(key => `${key} = @${key}`).join(', ')}
        WHERE id = @id
      `;

      await request.query(query);

      console.log('Usuario actualizado con éxito');
      return true;
    } catch (error) {
      logger.error('Error al actualizar usuario:', error);
      throw error;
    }
  }*/
  static async updateUser(id, userData) {
    const transaction = new sql.Transaction(await poolPromise);
    try {
      await transaction.begin();
  
      const updateRequest = transaction.request().input('id', sql.Int, id);
  
      const userFields = { ...userData };
      delete userFields.areas; // Remove areas from userFields as it's handled separately
  
      Object.keys(userFields).forEach(key => {
        updateRequest.input(key, typeof userFields[key] === 'number' ? sql.Int : sql.NVarChar, userFields[key]);
      });
  
      const updateQuery = `
        UPDATE Users 
        SET ${Object.keys(userFields).map(key => `${key} = @${key}`).join(', ')}
        WHERE id = @id
      `;
  
      await updateRequest.query(updateQuery);
  
      // Delete existing areas for the user
      await transaction.request()
        .input('userId', sql.Int, id)
        .query('DELETE FROM UserAreas WHERE userId = @userId');
  
      // Insert new areas
      if (userData.areas && Array.isArray(userData.areas)) {
        for (const areaId of userData.areas) {
          await transaction.request()
            .input('userId', sql.Int, id)
            .input('areaId', sql.NVarChar, areaId)
            .query(`
              INSERT INTO UserAreas (userId, areaId)
              VALUES (@userId, @areaId)
            `);
        }
      }
  
      await transaction.commit();
  
      console.log('Usuario actualizado con éxito');
      return true;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error al actualizar usuario:', error);
      throw error;
    }
  }
  
}

export default User;
