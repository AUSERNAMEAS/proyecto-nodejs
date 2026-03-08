const {poolPromise} = require('../config/db');

async function getOrders()
{

    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT COUNT(id_pedido) AS TotalPedidos FROM pedido
    `);
    //console.log('DEBUG - Orders:', result.recordset); // 👈 debug

    return result.recordset[0].TotalPedidos;
}


// 2️⃣ Get total pending shipments
async function getPendingShipments() {
    const pool = await poolPromise;

    const result = await pool.request().query(`
        SELECT COUNT(id_envio) AS pendingShipments
        FROM envio
        WHERE estado_envio = 'Pendiente de empaque'
    `);

    return result.recordset[0].pendingShipments;
}


// 3️⃣ Get monthly sales
async function getMonthlySales() {
    const pool = await poolPromise;

    const result = await pool.request().query(`
        SELECT SUM(total) AS monthlySales
        FROM pedido
        WHERE MONTH(fecha_pedido) = MONTH(GETDATE())
        AND YEAR(fecha_pedido) = YEAR(GETDATE())
    `);

    return result.recordset[0].monthlySales || 0;
}

// 5️⃣ Get recent shipments (calendar)
async function getRecentShipments() {
    const pool = await poolPromise;

    const result = await pool.request().query(`
        SELECT TOP 5
            CONVERT(VARCHAR(10), fecha_envio, 120) AS shipmentDate,
            COUNT(id_envio) AS total
        FROM envio
        WHERE fecha_envio IS NOT NULL
        GROUP BY fecha_envio
        ORDER BY fecha_envio DESC
    `);

    return result.recordset;
}

async function getRecentOrders()
{
    const pool = await poolPromise;

    const result = await pool.request().query(`
        SELECT TOP 10
            p.id_pedido,
            c.nombre AS cliente,
            CONVERT(VARCHAR(10), p.fecha_pedido, 120) AS fecha_pedido,
            p.total,
            p.estado_pedido
        FROM pedido p
        INNER JOIN cliente c ON p.id_cliente = c.id_cliente
        ORDER BY p.fecha_pedido DESC
    `);

    return result.recordset;

}

async function getPendingCustomRequests() {
    const pool = await poolPromise;

    const result = await pool.request().query(`
        
            SELECT 
            id_solicitud,
            CONVERT(VARCHAR(10), fecha_solicitud, 120) AS fecha_solicitud,
            tipo_producto,
            instrucciones,
            solicitud_personalizacion.id_cliente,
            telefono,
            correo,
            estado

        FROM solicitud_personalizacion INNER JOIN cliente ON
        solicitud_personalizacion.id_cliente = cliente.id_cliente
        ORDER BY fecha_solicitud DESC
    `);

    return result.recordset;
}

async function getStockProducts(){
    const pool = await poolPromise;
    const result = await pool.request().query(`SELECT id_producto, nombre, precio_unitario, stock
      FROM producto`);
    return result.recordset;
}

async function addNewProduct(nombre, descripcion, stock, categoria, peso_kg, estado_producto, precio, imagen) {
    const pool = await poolPromise;
    const result = await pool.request().
    input('nombre', nombre).
    input('descripcion', descripcion).
    input('stock', parseInt(stock)).
    input('categoria', categoria).
    input('peso_kg', parseFloat(peso_kg)).
    input('estado_producto', estado_producto).
    input('precio', parseFloat(precio)).
    input('imagen', imagen)
    .query(`
      INSERT INTO producto
      (nombre, descripcion, stock, categoria, peso_kg, estado_producto, precio_unitario, imagen)
      VALUES (@nombre, @descripcion, @stock, @categoria, @peso_kg, @estado_producto, @precio, @imagen)
    `);

    return result.rowsAffected[0] > 0; // returns true if a row was inserted
}

async function updateStockProducts(productos){

    const pool = await poolPromise;

    for (const item of productos) {

        const id = parseInt(item.id);
        const cantidad = parseInt(item.stock);

        console.log("ID:", id, "Cantidad:", cantidad);

        if (id > 0) {

            await pool.request()
                .input("id", id)
                .input("cantidad", cantidad)
                .query(`
                    UPDATE producto
                    SET stock = @cantidad
                    WHERE id_producto = @id
                `);
        }
    }

    return {
        success: true,
        message: "Stock actualizado correctamente"
    };
}

async function acceptCustomRequest(id_request) {
    const pool = await poolPromise;
    await pool.request()
        .input('id_request', id_request)
        .query(`
            UPDATE solicitud_personalizacion
            SET estado = 'Aceptada'
            WHERE id_solicitud = @id_request
        `);
    
    return {
        success: true,
        message: "Solicitud aceptada correctamente"
    };
}

module.exports = {
    getOrders,
    getPendingShipments,
    getMonthlySales,
    getRecentShipments,
    getRecentOrders,
    getPendingCustomRequests,
    getStockProducts,
    addNewProduct,
    updateStockProducts,
    acceptCustomRequest
};