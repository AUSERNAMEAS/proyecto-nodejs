const {getUserByEmail,insertOrder,insertOrderDetails,insertShippingDetails} = require('../models/createNewOrder.model');



async function createNewOrder(req, res) 
{
    try
    {
        //frist we get the variables from the request body and session
        const datos = req.body;
        const email = req.session.user.email;
        const userRaw= await getUserByEmail(email);
        if (!datos)
        {
            return res.status(400).json(
            { success: false, message: 'Faltan datos del pedido.' });
        }
        if (!email)
        {
            return res.status(400).json(
            { success: false, message: 'error al obtener usuario ' });
        }
        const userID = userRaw.id_cliente;
        const total = datos.total_final;
        //here we can create the order  
        const orderID = await insertOrder (userID, datos.metodo_pago,total);
        // then we update and insert the order details
        await insertOrderDetails(orderID,userID, datos.carrito);

        // almost done, now we insert into shipping details
        await insertShippingDetails(orderID, datos);
        //finally we send a success response




        res.json({ message: `Creating order for user:${userID } and ${email} 
            datos { ${JSON.stringify(datos)} }`,
                    success: true,
                    user: userID
        });
    }
    catch (error)
    {
        res.status(500).json({ success: false, message: error.message });
    }
   
}




module.exports = { createNewOrder };