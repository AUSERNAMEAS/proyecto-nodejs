const {poolPromise} = require('../config/db');

async function searchUserByEmail(email) 
{
    const pool = await poolPromise;
    const result = await pool.request().
    input('email', email).query(`
        select 
        correo,contrasenia_hash,rol 
        from cliente 
        where correo=@email`);
    return result.recordset;
}

module.exports = {
    searchUserByEmail
};