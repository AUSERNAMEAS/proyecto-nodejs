const addUser = require('../models/createNewUser.model');
const bcrypt = require('bcrypt'); // importing bcrypt to hash passwords
const {saveUserSessionFunction}= require('../utils/functions/userSessionFunctions');

async function createUser(req, res) 
{
 try
    {
    //first we need to get the data from the request body then hash the password
    const {name, email, password, phone} = req.body;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    if (!name || !email || !password || !phone) 
        {
        return res.status(400).json(
            { success: false, message: 'Faltan datos obligatorios.' });

        }
        // now we can call the model function to create the new user and save the user session
    await addUser.createNewUser(name, passwordHash, email, phone);
    saveUserSessionFunction(req, email);
    console.log('New user created and session saved:', req.session.user);
    res.redirect('/html/FakeShop.html');
    }
    catch (error)
    {
        res.status(500).json({ success: false, message: error.message });
    }

}

module.exports = { createUser };