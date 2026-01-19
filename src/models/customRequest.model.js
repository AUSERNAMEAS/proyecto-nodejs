const { poolPromise } = require('../config/db');

async function createRequest(tipo_producto, instrucciones, imagen_nombre) {
  const pool = await poolPromise;

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
