import poolPromise from '../db.js';
import logger from '../logger.js';

class Grupos {
    static async find() {
        try {
            const pool = await poolPromise;
            const result = await pool.request().execute('GetGrupos');
            return result.recordset;
        } catch (error) {
            logger.error('Error al buscar grupos:', error);
            throw error;
        }
    }
}

export default Grupos;
