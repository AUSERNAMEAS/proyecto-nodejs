
async function createNewOrder(req, res) 
{

    const email = req.session.user.email;
    res.json({ message: `Creating order for user:${email}`,
                success: true
    });
}


module.exports = { createNewOrder };