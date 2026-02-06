
async function loadUserAccount() 
{
    try
    {
        //we gonna fetch the session to use to build the cointainer
        const response = await fetch('http://localhost:3000/api/main-page');
        const result = await response.json();
        console.log('User account data:', result);
        const containerDataUser=document.querySelector('.container');

        // we gonna add the user data to the container
        containerDataUser.innerHTML=`
        <section class="account-card">
            <h2>Bienvenido</h2>
            <p><strong>Email: ${result.user.email}</strong></p>
            <p><strong>Rol: Cliente</strong></p>
            <button class="btn-iniciarSesion">Editar perfil</button>
        </section>

            <!-- ===== PEDIDOS ===== -->
        <section class="account-card">
            <h2>Mis pedidos</h2>
            <!-- Container to load prders -->
            <div class="userOrders">


                <!-- here we will added more orders -->
            </div>
        </section>
        `;

    }
    catch (error)
    {
        console.error('Error fetching user account data:', error);
    }

}

async function loadOrders()
{
    //we fetch the orders of the user to load them in html
    const response = await fetch('http://localhost:3000/api/user-page', {
    method: 'GET',
    credentials: 'include' // sent cookies with the request
  });
    const result = await response.json();
    const ordersContainer = document.querySelector('.userOrders');
    for (const order of result)
        {
            ordersContainer.innerHTML += `
            <div class="order-item">
                <p><strong>Pedido #${order.id_pedido}</strong></p>
                <p>Fecha: ${new Date(order.fecha_envio).toLocaleDateString()}</p>
                <p>Total: $${order.suma_total}</p>
                <p>Estado: ${order.estado_envio}</p>

                 <div class="order-button">
                    <button class="btn-show-details">Ver detalles</button>
                </div>
            </div>
            `;
        }
    console.log('User orders data:', result);

}

document.addEventListener('DOMContentLoaded', () => {
    loadUserAccount();
    loadOrders();
    const leaveAccountButton = document.getElementById('logOutUser');
    leaveAccountButton.addEventListener('click', () => 
        {
            window.location.href = '../html/FakeShop.html';
        })
});