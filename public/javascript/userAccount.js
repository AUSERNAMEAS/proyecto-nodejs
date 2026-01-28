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
            <!-- Contenedor donde luego cargarás pedidos -->
            <div class="orders-list">

                <!-- Pedido ejemplo -->
                <div class="order-item">
                    <p><strong>Pedido #001</strong></p>
                    <p>Fecha: <!-- fecha --></p>
                    <p>Total: $<!-- total --></p>
                    <p>Estado: <!-- estado --></p>
                </div>

                <!-- Aquí luego se generan más pedidos -->
            </div>
        </section>
        `;

    }
    catch (error)
    {
        console.error('Error fetching user account data:', error);
    }

}

document.addEventListener('DOMContentLoaded', () => {
    loadUserAccount();
});