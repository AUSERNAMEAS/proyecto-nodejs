//this file is used to get all products from the database
const {poolPromise} = require('../config/db');
// we import the database connection pool to use it in our queries
async function getAllProducts() 
{
    const pool = await poolPromise;
    //the basic sintax to make a query using mssql
    const result = await pool.request().query(`
        SELECT 
            id_producto,
            nombre,
            precio_unitario,
            imagen
        FROM producto
    `);
        //we use recordser to get the array of results
    return result.recordset;
}
module.exports = {
    getAllProducts
};