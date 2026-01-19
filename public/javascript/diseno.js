// Copia de 'diseño.js' renombrada a 'diseno.js' para evitar problemas de carga por caracteres especiales
// Arreglo de productos con sus detalles
let allProducts = [];
  
// selecciona los elementos del html
const productGrid = document.getElementById('product-grid');
const loadMoreBtn = document.getElementById('load-more-btn');
const cartItemsDiv = document.getElementById('cart-items');
const cartSubtotalSpan = document.getElementById('cart-subtotal');
const cartShippingSpan = document.getElementById('cart-shipping');
const cartTotalSpan = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

let cart = [];
let productsShown = 3;

/**
 * Renderiza los productos con selector de tallas
 */
function renderProducts() {
    if (!productGrid) {
        console.error('No se encontró el contenedor #product-grid');
        return;
    }
    productGrid.innerHTML = '';
    for (let i = 0; i < productsShown; i++) {
        if (allProducts[i]) {
            const product = allProducts[i];
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <h3>${product.nombre}</h3>
                <img src="/${product.imagen}" alt="${product.nombre}">
                <p>$${product.precio_unitario.toFixed(2)} MXN</p>
                
                <div style="margin-bottom:10px;">
                    <label>Talla: </label>
                    <select id="talla-${product.id_producto}">
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                    </select>
                </div>

                <button onclick="prepararCompra(${product.id_producto})">Agregar al Carrito</button>
            `;
            productGrid.appendChild(productCard);
        }
    }
}

// Función intermedia para capturar la talla seleccionada
function prepararCompra(productId) {
    const select = document.getElementById(`talla-${productId}`);
    if (!select) {
        console.error(`No se encontró el selector de talla para producto ${productId}`);
        alert('Error interno: no se pudo obtener la talla seleccionada. Por favor recarga la página.');
        return;
    }
    const tallaSeleccionada = select.value;
    addToCart(productId, tallaSeleccionada);
}

/**
 * Modificación de addToCart con TALLA y LÍMITE DE 10
 */
function addToCart(productId, talla) {
    const productToAdd = allProducts.find(p => p.id_producto === productId);
    const existingItem = cart.find(item => item.id_producto === productId && item.talla === talla);

    if (existingItem) {
        if (existingItem.quantity < 10) {
            existingItem.quantity++;
        } else {
            alert('Límite alcanzado: Solo puedes agregar un máximo de 10 unidades por producto/talla.');
            return;
        }
    } else {
        cart.push({ ...productToAdd, quantity: 1, talla: talla });
    }
    alert(`${productToAdd.nombre} (Talla ${talla}) agregado al carrito.`);
    renderCart();
}

/**
 * Lógica de ARRASTRAR Y SOLTAR (Drag & Drop) para personalización
 */
const dropZone = document.getElementById('drop-zone');
const customImageInput = document.getElementById('custom-image');

if (customImageInput) {
    customImageInput.addEventListener('change', function(e) {
        const reader = new FileReader();
        reader.onload = function(event) {
            dropZone.innerHTML = `<img src="${event.target.result}" id="drag-design" draggable="true" style="max-width:100px; cursor:move;">`;
            const dragImg = document.getElementById('drag-design');
            dragImg.addEventListener('dragstart', (ev) => {
                ev.dataTransfer.setData("text", ev.target.id);
            });
        };
        reader.readAsDataURL(e.target.files[0]);
    });
}

if (dropZone) {
    dropZone.addEventListener('dragover', (e) => e.preventDefault());
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        const data = e.dataTransfer.getData("text");
        const img = document.getElementById(data);
        if (!img) return;
        img.style.position = 'absolute';
        img.style.left = (e.offsetX - (img.clientWidth/2)) + 'px';
        img.style.top = (e.offsetY - (img.clientHeight/2)) + 'px';
    });
}

async function enviarSolicitud(e) {
    e.preventDefault();

    const personalizedBtn = document.getElementById("btn-personalized");
    const productType = document.getElementById('product-type').value;
    const customImageInput = document.getElementById('custom-image');
    const instructions = document.getElementById('instructions').value;

    const imageFileName = customImageInput.files.length > 0 ? customImageInput.files[0].name : '';
    if (!productType || !customImageInput.files.length) {
        alert('Por favor, ingresa el tipo de producto y sube una imagen.');
        return;
    }

    const requestData = {
        productType: productType,
        instructions: instructions,
        imageFileName: imageFileName
    };

    personalizedBtn.textContent = 'Enviando...';
    personalizedBtn.disabled = true;

    try {
        const response = await fetch('http://localhost:3000/api/custom-requests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        });

        const result = await response.json();

        if (result.success) {
            alert(result.message);
            document.getElementById('product-type').value = '';
            document.getElementById('instructions').value = '';
            customImageInput.value = null;
        } else {
            alert(`Error al enviar la solicitud: ${result.message}`);
        }

    } catch (error) {
        alert('Error de conexión al servidor al intentar enviar la solicitud.');
    } finally {
        personalizedBtn.textContent = 'Enviar Solicitud de Personalización';
        personalizedBtn.disabled = false;
    }
}

async function fetchProducts(){
    try {
        const response = await fetch('http://localhost:3000/api/products');
        allProducts = await response.json();
        console.log("RAW RESPONSE:", allProducts);
        renderProducts();
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id_producto !== productId);
    renderCart();
}

loadMoreBtn.addEventListener('click', () => {
    productsShown += 7;
    if (productsShown >= allProducts.length) {
        productsShown = allProducts.length;
        loadMoreBtn.style.display = 'none';
    }
    renderProducts();
});

function renderCart() {
    //si el carrito esta vacio muestra eso
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>Tu carrito está vacío.</p>';
        cartSubtotalSpan.textContent = '$0.00 MXN';
        cartShippingSpan.textContent = '$0.00 MXN';
        cartTotalSpan.textContent = '$0.00 MXN';
        checkoutBtn.style.display = 'none';
        return;
    }

    checkoutBtn.style.display = 'block';

    let subtotal = 0;
    cartItemsDiv.innerHTML = '';
    //hara un nuevvo div y se renombra cartitem por cada elemento,
    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <span>${item.nombre}</span>
            <div class="cart-quantity">
                <button onclick="decreaseQuantity(${item.id_producto})">-</button>
                <span>${item.quantity}</span>
                <button onclick="increaseQuantity(${item.id_producto})">+</button>
            </div>
            <span>$${(item.precio_unitario * item.quantity).toFixed(2)} MXN</span>
        `;
        cartItemsDiv.appendChild(itemDiv);
        subtotal += item.precio_unitario * item.quantity;
    });

    // si no hay productos no hay envio
    let shipping;
    if(subtotal>0){
        shipping= 80;
    }
    else{
        shipping = 0;
    }

    const total = subtotal + shipping;

    cartSubtotalSpan.textContent = `$${subtotal.toFixed(2)} MXN`;
    cartShippingSpan.textContent = `$${shipping.toFixed(2)} MXN`;
    cartTotalSpan.textContent = `$${total.toFixed(2)} MXN`;
}

//suma en el carrtio si se agrega un nuevo
function increaseQuantity(productId) {
    const item = cart.find(arrayProduct => arrayProduct.id_producto === productId);
    if (item) {
        item.quantity++;
        renderCart();
    }
}

//disminuye o quita del carrito
function decreaseQuantity(productId) {
    const item = cart.find(arrayProduct => arrayProduct.id_producto === productId);
    //si es true solo le resta
    if (item && item.quantity > 1) {
        item.quantity--;
        renderCart();
    } 
    
        //si es true lo quit
    else if (item && item.quantity === 1) {
        removeFromCart(productId);
    }
}


checkoutBtn.addEventListener('click', () => {
    sessionStorage.setItem('carritoTemporal', JSON.stringify(cart));
    window.location.href = '../html/checkout.html';
});

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    renderCart();
    document.getElementById("btn-personalized").addEventListener('click',(event)=>{
        alert('su solicitud ha sido enviada');
        enviarSolicitud(event);
    })
});
