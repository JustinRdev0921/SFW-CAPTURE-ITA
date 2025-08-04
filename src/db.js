import sql from 'mssql';

const config = {
  user: 'sa',
  password: 'Ecuacopia2024*',
  server: 'UIO-SRV-PASTAZA',
  database: 'SoftwareCaptura',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  port: 1433,
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Conectado a BD');
    return pool;
  })
  .catch(err => {
    console.log('Error de conexión a la BD:', err);
    throw err;
  });

export default poolPromise;
