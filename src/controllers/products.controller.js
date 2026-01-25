const productModel = require('../models/product.model');

async function getProducts(req, res) 
{
  try 
  {
    //here we just call the model function to get all products
    const result = await productModel.getAllProducts();
    res.json(result);
  } 
  
  catch (error) 
  {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {getProducts};