const { poolPromise } = require('../config/db');

async function createNewUser(name, passwordHash, email) {
    const pool = await poolPromise;

    await pool.request()
    .input('nombre', name)
    .input('correo', email)
    .input('contrasenia_hash', passwordHash)
    .query(

    "INSERT INTO cliente (nombre, correo, contrasenia_hash) VALUES (@nombre, @correo, @contrasenia_hash)")
}

module.exports = {
    createNewUser
}