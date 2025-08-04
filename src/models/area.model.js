import poolPromise from '../db.js';
import logger from '../logger.js';

class Areas {
    static async find() {
        try {
            const pool = await poolPromise;
            const result = await pool.request().execute('GetAreas');
            return result.recordset;
        } catch (error) {
            logger.error('Error al buscar areas:', error);
            throw error;
        }
    }
}

export default Areas;
