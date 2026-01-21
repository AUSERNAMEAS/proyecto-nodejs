const app = require('./app');
const PORT = 3000;
//routes

//route to get products
const productsRoutes = require('./routes/products');
app.use('/api/products', productsRoutes);

//route to handle custom requests

const customRequestRoutes = require('./routes/customRequest');
app.use('/api/custom-requests', customRequestRoutes);

// route to create users
const userRoutes = require('./routes/createNewUser');
app.use('/api/createUser', userRoutes);

//route to test sessions
const sessionTestRoutes = require('./routes/sessionTest');
app.use('/api/session', sessionTestRoutes);


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});