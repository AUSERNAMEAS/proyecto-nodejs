const express = require('express');
const router = express.Router();
const customRequest = require('../models/customRequest.model');

router.post('/', async (req, res) => {
  try 
  {
    const { productType, instructions, imageFileName } = req.body;

    if (!productType || !imageFileName) 
    {
      return res.status(400).json({ success: false, message: 'Debe especificar un tipo de producto y una imagen.' });
    }

    await customRequest.createRequest(productType, instructions, imageFileName);

    res.json({ success: true, message: 'Solicitud enviada correctamente. ¡Pronto te contactaremos!' });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
