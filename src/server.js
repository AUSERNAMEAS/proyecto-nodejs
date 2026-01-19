const app = require('./app');
const PORT = 3000;
//routes

//route to get products
const productsRoutes = require('./routes/products');
app.use('/api/products', productsRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});