const express = require('express');
const router = express.Router();
const customRequest = require('../models/createNewUser.model');
const bcrypt = require('bcrypt'); // importing bcrypt to hash passwords


router.post('/', async (req, res) => 
{
    try{
    //first we need to get the data from the request body then hash the password
    const {name, email, password } = req.body;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    if (!name || !email || !password) 
        {
        return res.status(400).json(
            { success: false, message: 'Faltan datos obligatorios.' });

        }

    await customRequest.createNewUser(name, passwordHash, email);
    res.json({ success: true, message: 'usuario creado exitosamente' });

    }
    catch (error){
        res.status(500).json({ success: false, message: error.message });
    }
    

})

module.exports = router;