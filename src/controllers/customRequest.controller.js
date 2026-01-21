const customRequest = require('../models/customRequest.model');

//here we import the router module and the result of the query(model) to create a custom request
async function createRequest(req, res)
{
  try 
  {
    //here we wait forthe user to send the data through the body, then we validate if the required data is present
    const { productType, instructions, imageFileName } = req.body;
console.log('BODY:', req.body);
console.log('productType:', productType);
console.log('imageFileName:', imageFileName);


    if (!productType || !imageFileName) 
    {
      return res.status(400).json({ success: false, message: 'Debe especificar un tipo de producto y una imagen.' });
    }
    await customRequest.createRequest(productType, instructions, imageFileName);

    res.json({ success: true, message: 'Solicitud enviada correctamente.¡Pronto te contactaremos!' });

  } 
  catch (error) 
  {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createRequest };