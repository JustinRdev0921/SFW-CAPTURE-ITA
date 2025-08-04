import poolPromise from '../db.js';
import logger from '../logger.js';

class TipoDoc {
    static async find() {
        try {
            const pool = await poolPromise;
            const result = await pool.request().execute('GetTiposDoc');
            return result.recordset;
        } catch (error) {
            logger.error('Error al buscar los tipos de documentos:', error);
            throw error;
        }
    }
}

export default TipoDoc;
