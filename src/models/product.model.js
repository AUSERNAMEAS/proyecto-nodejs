//this file is used to get all products from the database
const sql = require('mssql');
const {poolPromise} = require('../config/db');

async function getAllProducts() {
    const pool = await poolPromise;
    const result = await pool.request().query(`
        SELECT 
            id_producto,
            nombre,
            precio_unitario,
            imagen
        FROM producto
    `);

    return result.recordset;
}
module.exports = {
    getAllProducts
};