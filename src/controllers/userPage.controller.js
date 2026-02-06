const {searchOrdersByUserId} = require('../models/searchUser.model');
const {getUserByEmail} = require('../models/createNewOrder.model');


async function loadOrdersUser(req,res)
{
    //verify if the user session exists
    const userRaw= await getUserByEmail(req.session.user.email);
    const userID = userRaw.id_cliente;
    const result =await searchOrdersByUserId(userID);
    res.json(result);
}
module.exports = { loadOrdersUser };