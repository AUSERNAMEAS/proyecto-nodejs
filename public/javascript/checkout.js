document.addEventListener('DOMContentLoaded', () => {
    //checkout.js
    const cardOption = document.getElementById('card-option');
    const cardDetails = document.getElementById('card-details');
    const payBtn = document.getElementById("pay-btn");
    const checkoutForm = document.getElementById("checkout-form");
    
    // Lógica para mostrar u ocultar detalles de tarjeta
    document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
        radio.addEventListener('change', () => {
            if (cardOption.checked) {
                cardDetails.style.display = 'block';
                cardDetails.querySelectorAll('input').forEach(input => input.required = true);
            } else {
                cardDetails.style.display = 'none';
                cardDetails.querySelectorAll('input').forEach(input => input.required = false);
            }
        });
    });

    // 1. Obtener carrito guardado
    const carritoString = sessionStorage.getItem('carritoTemporal');
    const carrito = JSON.parse(carritoString || '[]');

    // 2. Click del botón de pago (función principal)
    payBtn.addEventListener('click', async (e) => {
        e.preventDefault(); 
        if (!checkoutForm.checkValidity() || carrito.length === 0) {
            checkoutForm.reportValidity();
            if(carrito.length === 0) alert('Su carrito está vacío, no se puede pagar.');
            return;
        }

        // 3. Recolectar datos
        const datosEnvio = {
            nombre: document.getElementById('name').value,
            apellido: document.getElementById('lastname').value,
            direccion: document.getElementById('address').value,
            ciudad: document.getElementById('city').value,
            telefono: document.getElementById('phone').value
        };

        const metodoPago = document.querySelector('input[name="payment-method"]:checked').value;
        let subtotal = carrito.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0);
        const costoEnvio = subtotal > 0 ? 80 : 0; 
        const totalPagar = subtotal + costoEnvio;

        const datosPedido = {
            carrito: carrito,
            datos_envio: datosEnvio,
            metodo_pago: metodoPago,
            total_final: totalPagar.toFixed(2),
            costo_envio: costoEnvio.toFixed(2)
        };
        
        payBtn.textContent = 'Procesando...';
        payBtn.disabled = true;

        // 4. Enviar datos al PHP
        try {
            const response = await fetch('backend/procesarPedido.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosPedido) 
            });

            const result = await response.json();

            if (result.success) {
                alert(` ${result.message}`);
                sessionStorage.removeItem('carritoTemporal'); 
                window.location.href = 'FakeShop.php'; 
            } else {
                alert(`Error al procesar el pedido: ${result.message}`);
            }

        } catch (error) {
            alert('Error de conexión con el servidor.');
        } finally {
            payBtn.textContent = 'Realizar Pago';
            payBtn.disabled = false;
        }
    });

    if (cardOption.checked) {
        cardDetails.style.display = 'block';
    }
});