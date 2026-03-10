const {getOrders, getPendingShipments, getMonthlySales,getRecentShipments, getRecentOrders, getPendingCustomRequests, getStockProducts,addNewProduct,updateStockProducts,acceptCustomRequest, updateOrderStatus} = require ('../models/adminPanel.model')

async function fillDashboard(req, res)
{
    try
    {
        const orders = await getOrders();
        const pendingShipments = await getPendingShipments();
        const monthlySales = await getMonthlySales();
        const recentShipments = await getRecentShipments();
        const recentOrders = await getRecentOrders();
        const pendingCustomRequests = await getPendingCustomRequests();
        const stockProducts = await getStockProducts();

        res.json({
            success: true,
            data: {
        totalOrders: orders?? 0,
        pendingRequests: pendingShipments?? 0,
        monthlySales: monthlySales ?? 0,
        recentShipments: recentShipments,
        recentOrders: recentOrders,
        pendingCustomRequests: pendingCustomRequests,
        stockProducts: stockProducts
    }
        });
    }
    catch (error)
    {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function addNewProductController(req, res) {
    try 
    {
        const { nombre, descripcion, stock, categoria, peso_kg, estado_producto, precio, imagen } = req.body;
        const result = await addNewProduct(nombre, descripcion, stock, categoria, peso_kg, estado_producto, precio, imagen);
        res.json({ success: true, message: "Producto agregado exitosamente", affectedRows: result });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function updateStock(req, res){

    try {

        const products = req.body;

        if(!Array.isArray(products)){
            return res.status(400).json({
                success:false,
                message:"Datos inválidos"
            });
        }

        const result = await updateStockProducts(products);

        res.json(result);

    } catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

async function acceptCustomOrder(req, res) 
{

    try 
    {
        const { id_request } = req.params;
        const result = await acceptCustomRequest(id_request);
        res.json(result);
    } 
    catch (error) 
    {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function updateOrderStatusController(req, res) 
{
    try
    {
   const updates = req.body; // an array of { id_pedido, estado_pedido }

    for (const update of updates) {
        const { id_pedido, nuevo_estado} = update;

        console.log("ID Pedido:", id_pedido, "Nuevo Estado:", nuevo_estado);

        await updateOrderStatus(id_pedido, nuevo_estado);
    }
    res.json({ success: true, message: "Pedidos actualizados correctamente" });

    }


    catch(error)
    {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {
    fillDashboard,
    addNewProductController,
    updateStock,
    acceptCustomOrder,
    updateOrderStatusController
}