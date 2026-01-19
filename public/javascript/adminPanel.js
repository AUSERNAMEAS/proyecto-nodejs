//adminPanel.js
        document.addEventListener('DOMContentLoaded', () => {
            // Selecciona todos los botones que se usaran como guardar o los de stock
            const stockButtons = document.querySelectorAll('.stock-btn');
            const saveStockBtn = document.getElementById('save-stock-btn');
            const productStockTableBody = document.querySelector('#product-stock-table tbody');

            stockButtons.forEach(button => 
                {
                button.addEventListener('click', (event) => {
                    // Obtiene el ID del producto y la acción (aumentar/disminuir)
                    const productId = event.target.getAttribute('data-id');
                    const action = event.target.getAttribute('data-action');
                    // Referencia al elemento <td> que muestra el stock
                    const stockElement = document.getElementById(`stock-${productId}`);
                    
                    // Obtiene el valor actual y lo convierte a número entero
                    let currentStock = parseInt(stockElement.textContent);
                    
                    // Lógica para actualizar el valor en la interfaz
                    if (action === 'increase') {
                        currentStock++;
                    } else if (action === 'decrease' && currentStock > 0) {
                        currentStock--;
                    }
                    
                    // 1. Actualiza el stock en la vista (simulación visual)
                    stockElement.textContent = currentStock;
                });
            }); //aqui seleccionamos todos los botones y les agregamos un evento de click,los botones de + y -

            const saveOrdersBtn = document.getElementById('save-orders-btn');

saveOrdersBtn.addEventListener('click', async () => {
    const orderUpdates = [];
    const selects = document.querySelectorAll('.order-status-select');

    selects.forEach(select => {
        orderUpdates.push({
            id_pedido: select.getAttribute('data-id'),
            nuevo_estado: select.value
        });
    });

    saveOrdersBtn.textContent = 'Actualizando...';
    saveOrdersBtn.disabled = true;

    try {
        // Crearemos este nuevo archivo en el backend
        const response = await fetch('backend/actualizarEstadoPedido.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderUpdates)
        });

        const result = await response.json();

        if (result.success) {
            alert(result.message);
            window.location.reload();
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        alert('Error de conexión al intentar actualizar los pedidos.');
    } finally {
        saveOrdersBtn.textContent = 'Actualizar Estados de Pedidos';
        saveOrdersBtn.disabled = false;
    }
});


            // 2. Guardar cambios de stock en el servidor
            saveStockBtn.addEventListener('click', async () => {
                // 1. Recopilar todos los datos de stock de la tabla
                const stockUpdates = [];
                const rows = productStockTableBody.querySelectorAll('tr');

                rows.forEach(row => {
                    const productId = row.getAttribute('data-product-id');
                    const stockValue = row.querySelector('.stock-value').textContent;
                    
                    stockUpdates.push({
                        id: productId,
                        stock: parseInt(stockValue) // Aseguramos que sea un número entero
                    });
                }); //aqui sekeccionamos todas las filas de la tabla y obtenemos el id y el stock actual,por que esa parte es una tabla
                
                saveStockBtn.textContent = 'Guardando...';
                saveStockBtn.disabled = true;

                // 2. Enviar los datos al script de backend
                try {
                    const response = await fetch('backend/actualizarStock.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json' 
                        },
                        body: JSON.stringify(stockUpdates) // Enviamos el array completo de cambios
                    });

                    const result = await response.json();

                    if (result.success) {
                        alert(result.message);
                    } else {
                        alert(`Error al guardar: ${result.message}`);
                    }

                } catch (error) {
                    alert('Error de conexión con el servidor al intentar guardar el stock.');
                } finally {
                    saveStockBtn.textContent = 'Guardar Cambios de Stock';
                    saveStockBtn.disabled = false;
                     window.location.reload(); 
                }
            });

            //para agregar un nuevo producto
            const addProductForm = document.getElementById('add-product-form');
            const btnAddProduct = document.getElementById('btn-add-product');
            
            btnAddProduct.addEventListener('click', async (e) => { // Agregamos 'async' por que si no no deja usar los wait
                // Evita el envío del formulario por defecto
                e.preventDefault();
                
                // 1. Verifica la validez del formulario
                if (!addProductForm.checkValidity()) {
                    addProductForm.reportValidity();
                    return; // Detiene la ejecución si el formulario no es válido
                }
                
                // 2. Recolectar datos del formulario por ID y estructurarlos como JSON
                const newProductData = {
                    nombre: document.getElementById('new-name').value,
                    precio: document.getElementById('new-price').value,
                    stock: document.getElementById('new-stock').value,
                    categoria: document.getElementById('new-category').value,
                    descripcion: document.getElementById('new-description').value,
                    imagen: document.getElementById('new-image').value,
                    peso_kg: document.getElementById('new-weight').value
                };
                
                btnAddProduct.textContent = 'Añadiendo...';
                btnAddProduct.disabled = true;

                // 3. Enviar datos al script PHP (AJAX)
                try {
                    const response = await fetch('backend/agregarNuevosProductos.php', 
                    { 
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json' // Indicamos que enviamos JSON
                        },
                        body: JSON.stringify(newProductData) // Convertimos el objeto a JSON
                    });

                    const result = await response.json();

                    if (result.success) {
                        alert(result.message);
                        addProductForm.reset(); // Limpia el formulario
                        // Recarga la página para que el nuevo producto aparezca en la tabla de stock
                        window.location.reload(); 
                    } else {
                        // Muestra el mensaje de error del servidor (incluye errores SQL)
                        alert(`Error al añadir el producto: ${result.message}`);
                    }

                } catch (error) {
                    alert('Error de conexión al servidor al añadir producto.');
                } finally {
                    btnAddProduct.textContent = 'Añadir Producto'; // Restaura el texto del botón
                    btnAddProduct.disabled = false;
                }
            });
        });
