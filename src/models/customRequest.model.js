const { poolPromise } = require('../config/db');
// we import the database connection pool to use it in our queries
async function createRequest(tipo_producto, instrucciones, imagen_nombre) {
  const pool = await poolPromise;
// this is the sintaxis to make a query using mssql with input parameters
  await pool.request()
    .input('tipo_producto', tipo_producto)
    .input('instrucciones', instrucciones)
    .input('imagen_nombre', imagen_nombre)
    .query(`
      INSERT INTO solicitud_personalizacion 
      (tipo_producto, instrucciones, imagen_nombre, estado, fecha_solicitud)
      VALUES (@tipo_producto, @instrucciones, @imagen_nombre, 'Pendiente', GETDATE())
    `);
}

module.exports = {
  createRequest
};
