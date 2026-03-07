const { poolPromise } = require('../config/db');

async function createNewUser(name, passwordHash, email, phone) {
    const pool = await poolPromise;

    await pool.request()
    .input('nombre', name)
    .input('correo', email)
    .input('contrasenia_hash', passwordHash)
    .input('telefono', phone)
    .query(

    "INSERT INTO cliente (nombre, correo, contrasenia_hash, telefono) VALUES (@nombre, @correo, @contrasenia_hash, @telefono)")
}

module.exports = {
    createNewUser
}