//adminPanel.js
document.addEventListener("DOMContentLoaded", () => {
  // Selecciona todos los botones que se usaran como guardar o los de stock
  const stockButtons = document.querySelectorAll(".stock-btn");
  const saveStockBtn = document.getElementById("save-stock-btn");
  const productStockTableBody = document.querySelector(
    "#product-stock-table tbody",
  );

  async function loadDashboard() {
    try {
      const response = await fetch("http://localhost:3000/api/admin-panel");
      const result = await response.json();

      if (!result.success) {
        console.error("Error en la API:", result.message);
        return;
      }

      const data = result.data;

      const dashboardContainer = document.getElementById("dashboard");

      dashboardContainer.innerHTML = `
            <div class="card">
                <h2>Total de Pedidos</h2>
                <p class="big-number">${data.totalOrders}</p>
                <p>Órdenes totales en la base de datos</p>
            </div>

            <div class="card">
                <h2>Ventas del Mes</h2>
                <p class="big-number">$${data.monthlySales.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p>Monto de ventas actual</p>
            </div>

            <div class="card">
                <h2>Solicitudes Pendientes</h2>
                <p class="big-number">${data.pendingRequests}</p>
                <p>Pedidos listos para ser empacados</p>
            </div>

            <div class="card full-width">
                <h2>Calendario de Envíos Importantes</h2>
                <p>Pedidos con fecha de entrega programada (próximos 5)</p>
                <div class="calendar-placeholder">
                    <p>📅 Próximos envíos/pedidos:</p>
                    <ul>
                        ${
                          data.recentShipments.length > 0
                            ? data.recentShipments
                                .map(
                                  (envio) =>
                                    `<li>${envio.shipmentDate}: <strong>${envio.total}</strong> Pedido(s)</li>`,
                                )
                                .join("")
                            : "<li>No hay envíos programados próximamente.</li>"
                        }
                    </ul>
                </div>
            </div>
        `;
    } catch (error) {
      console.error("Error al cargar el panel de administración:", error);
    }
  }

  async function loadTable() {
    const response = await fetch("http://localhost:3000/api/admin-panel");
    const result = await response.json();
    console.log(result);

    if (!result.success) return;

    const data = result.data;

    // llenar tabla pedidos
    const tableBody = document.getElementById("ordersTableBody");

    if (data.recentOrders.length === 0) {
      tableBody.innerHTML = `
        <tr>
            <td colspan="6">No hay pedidos recientes registrados en la base de datos.</td>
        </tr>
    `;
    } else {
      tableBody.innerHTML = data.recentOrders
        .map(
          (pedido) => `
        <tr>
            <td>#${pedido.id_pedido}</td>
            <td>${pedido.cliente}</td>
            <td>${pedido.fecha_pedido}</td>
            <td>$${parseFloat(pedido.total).toFixed(2)}</td>
            <td>
                <select class="order-status-select" data-id="${pedido.id_pedido}">
                    <option value="Pendiente" ${pedido.estado_pedido === "Pendiente" ? "selected" : ""}>Pendiente</option>
                    <option value="Enviado" ${pedido.estado_pedido === "Enviado" ? "selected" : ""}>Enviado</option>
                    <option value="Completado" ${pedido.estado_pedido === "Completado" ? "selected" : ""}>Completado</option>
                    <option value="Cancelado" ${pedido.estado_pedido === "Cancelado" ? "selected" : ""}>Cancelado</option>
                </select>
            </td>
            <td><a href="#">Ver</a></td>
        </tr>
    `,
        )
        .join("");
    }
  }

  async function getPendingCustomRequests() {
    const response = await fetch("http://localhost:3000/api/admin-panel");
    const result = await response.json();
    const customList = document.getElementById("customRequestsList");

    if (result.success && result.data.pendingCustomRequests.length === 0) {
      customList.innerHTML = `
        <li>No hay solicitudes de personalización pendientes.</li>
    `;
    } else {
      customList.innerHTML = result.data.pendingCustomRequests
        .map(
          (solicitud) => `
        <li>
            <strong>ID: ${solicitud.id_solicitud}</strong>
            (Fecha: ${solicitud.fecha_solicitud})
            ${solicitud.tipo_producto}:
            ${solicitud.instrucciones}
            - <button class="view-custom-btn" data-id="${solicitud.id_solicitud}">
             Ver / Aprobar
           </button>
        </li>
    `,
// we gonna use this later to add the email and phone number as data attributes in the backend when rendering the pending requests list, so we can use them when approving the request to add contact icons with links to email and whatsapp
    /*.map(
  (solicitud) => `
<li 
  data-email="${solicitud.email_cliente}"
  data-phone="${solicitud.telefono_cliente}"
>
  <strong>ID: ${solicitud.id_solicitud}</strong>
  (Fecha: ${solicitud.fecha_solicitud})
  ${solicitud.tipo_producto}:
  ${solicitud.instrucciones}

  - <button class="view-custom-btn" data-id="${solicitud.id_solicitud}">
      Ver / Aprobar
    </button>
</li>
`,
) */
        )
        .join("");
    }
  }

  async function loadStockTable() {
    const response = await fetch('http://localhost:3000/api/admin-panel');
    const result = await response.json();

    if (!result.success) return;

    const tbody = document.getElementById('productStockBody');

    tbody.innerHTML = result.data.stockProducts.map(producto => `
        <tr data-product-id="${producto.id_producto}">
            <td>${producto.id_producto}</td>
            <td>${producto.nombre}</td>
            <td>$${parseFloat(producto.precio_unitario).toFixed(2)}</td>
            <td class="stock-value" id="stock-${producto.id_producto}">
                ${producto.stock}
            </td>
            <td>
                <button class="stock-btn decrease-stock"
                    data-action="decrease"
                    data-id="${producto.id_producto}">-</button>

                <button class="stock-btn increase-stock"
                    data-action="increase"
                    data-id="${producto.id_producto}">+</button>
            </td>
        </tr>
    `).join('');
}

async function loadPage(){
     loadStockTable();
     loadDashboard();
     loadTable();
     getPendingCustomRequests();
}
loadPage();

//this saves the stock changes in the database, we need to create a new route and controller for this in the backend
 document.addEventListener("click", (event) => {

  if (!event.target.classList.contains("stock-btn")) return;

  const productId = event.target.getAttribute("data-id");
  const action = event.target.getAttribute("data-action");

  const stockElement = document.getElementById(`stock-${productId}`);

  let currentStock = parseInt(stockElement.textContent);

  if (action === "increase") {
    currentStock++;
  } 
  else if (action === "decrease" && currentStock > 0) {
    currentStock--;
  }

  stockElement.textContent = currentStock;

});
  const saveOrdersBtn = document.getElementById("save-orders-btn");

  saveOrdersBtn.addEventListener("click", async () => {
    const orderUpdates = [];
    const selects = document.querySelectorAll(".order-status-select");

    selects.forEach((select) => {
      orderUpdates.push({
        id_pedido: select.getAttribute("data-id"),
        nuevo_estado: select.value,
      });
    });

    saveOrdersBtn.textContent = "Actualizando...";
    saveOrdersBtn.disabled = true;

    try {
      // Crearemos este nuevo archivo en el backend
      const response = await fetch("backend/actualizarEstadoPedido.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderUpdates),
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message);
        window.location.reload();
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      alert("Error de conexión al intentar actualizar los pedidos.");
    } finally {
      saveOrdersBtn.textContent = "Actualizar Estados de Pedidos";
      saveOrdersBtn.disabled = false;
    }
  });

  // 2. Guardar cambios de stock en el servidor
  saveStockBtn.addEventListener("click", async () => {
    // 1. Recopilar todos los datos de stock de la tabla
    const stockUpdates = [];
    const rows = productStockTableBody.querySelectorAll("tr");

    rows.forEach((row) => {
      const productId = row.getAttribute("data-product-id");
      const stockValue = row.querySelector(".stock-value").textContent;

      stockUpdates.push({
        id: productId,
        stock: parseInt(stockValue), // Aseguramos que sea un número entero
      });
    }); //aqui sekeccionamos todas las filas de la tabla y obtenemos el id y el stock actual,por que esa parte es una tabla

    saveStockBtn.textContent = "Guardando...";
    saveStockBtn.disabled = true;

    // 2. Enviar los datos al script de backend
    try {
      const response = await fetch("http://localhost:3000/api/admin-panel/update-stock", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stockUpdates), // Enviamos el array completo de cambios
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message);
      } else {
        alert(`Error al guardar: ${result.message}`);
      }
    } catch (error) {
      alert("Error de conexión con el servidor al intentar guardar el stock.");
    } finally {
      saveStockBtn.textContent = "Guardar Cambios de Stock";
      saveStockBtn.disabled = false;
      window.location.reload();
    }
  });

  //para agregar un nuevo producto
  const addProductForm = document.getElementById("add-product-form");
  const btnAddProduct = document.getElementById("btn-add-product");

  btnAddProduct.addEventListener("click", async (e) => {
    e.preventDefault();

    //  checks if the form is correct
    if (!addProductForm.checkValidity()) {
      addProductForm.reportValidity();
      return; 
    }

    // 2.get all the data we need
    const newProductData = {
      nombre: document.getElementById("new-name").value,
      precio: document.getElementById("new-price").value,
      stock: document.getElementById("new-stock").value,
      categoria: document.getElementById("new-category").value,
      descripcion: document.getElementById("new-description").value,
      imagen: document.getElementById("new-image").value,
      peso_kg: document.getElementById("new-weight").value,
    };

    btnAddProduct.textContent = "Añadiendo...";
    btnAddProduct.disabled = true;

    // we sent the data to the backend, we need to create a new route and controller for this, we will use the same model that we created for the products
    try {
      const response = await fetch("http://localhost:3000/api/admin-panel/add-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Indicamos que enviamos JSON
        },
        body: JSON.stringify(newProductData), // Convertimos el objeto a JSON
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
      alert("Error de conexión al servidor al añadir producto.");
    } finally {
      btnAddProduct.textContent = "Añadir Producto"; // Restaura el texto del botón
      btnAddProduct.disabled = false;
    }
  });

  document.addEventListener("click", async function (e) {
    if (e.target.classList.contains("view-custom-btn")) {
      const id = e.target.getAttribute("data-id");

      try {
        const response = await fetch(
          `/api/admin-panel/customImage/get-image/${id}`,
        );
        const result = await response.json();
        console.log(result);

        if (!result.success) {
          alert("No se pudo cargar la imagen");
          return;
        }

        const jsonDisenio = result.data.json_disenio;

        // set the image source to the one we got from the server
        const img = document.getElementById("previewImage");
        img.src = jsonDisenio;

        // saves the id of the custom request in the approve button for later use when approving the request
        document.getElementById("approveBtn").setAttribute("data-id", id);

        //  shows the modal
        document.getElementById("customModal").style.display = "block";
      } catch (error) {
        console.error("Error cargando imagen:", error);
      }
    }
  });

  document.getElementById("closeModal").onclick = function () {
    document.getElementById("customModal").style.display = "none";
  };

  window.onclick = function (event) {
    const modal = document.getElementById("customModal");
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  document.getElementById("approveBtn").addEventListener("click", function () {

  const requestId = this.getAttribute("data-id");

  // close the modal
  document.getElementById("customModal").style.display = "none";

  // finds the corresponding solicitud item in the list using the requestId
  const solicitudItem = document.querySelector(`button[data-id="${requestId}"]`).parentElement;

  // user data (should come from the backend)
  const correoCliente = solicitudItem.getAttribute("data-email");
  const telefonoCliente = solicitudItem.getAttribute("data-phone");

  // add contact icons with links to email and whatsapp using the user data, we will need to add the email and phone number as data attributes in the backend when rendering the pending requests list
  solicitudItem.innerHTML += `
    <span style="margin-left:10px;">
      <a href="mailto:${correoCliente}" target="_blank">
        <img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" width="20">
      </a>

      <a href="https://wa.me/${8117431614}" target="_blank">
        <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" width="20">
      </a>
    </span>
  `;
});
});
