document.addEventListener('DOMContentLoaded', () => {
    const productosContainer = document.querySelector('.productos');
    const carritoLista = document.getElementById('carrito-lista');
    const limpiarCarritoBtn = document.getElementById('limpiar-carrito');
    const confirmarCarritoBtn = document.getElementById('confirmar-carrito');
    const formularioIngreso = document.getElementById('formulario-ingreso');
    const mensajeBienvenida = document.getElementById('mensaje-bienvenida');
    const usuariosLista = document.getElementById('usuarios-lista');
    const compraConjuntoBtn = document.getElementById('compra-conjunto'); 
    const mensajeCompra = document.getElementById('mensaje-compra'); 
    const tituloCarrito = document.getElementById('titulo-carrito'); 

    const usuariosIngresados = JSON.parse(localStorage.getItem('usuariosIngresados')) || [];
    const carritos = JSON.parse(localStorage.getItem('carritos')) || {};

    function guardarEnLocalStorage() {
        localStorage.setItem('usuariosIngresados', JSON.stringify(usuariosIngresados));
        localStorage.setItem('carritos', JSON.stringify(carritos));
    }
    
    function crearCarrito(nombreUsuario) {
        if (!carritos[nombreUsuario]) {
            carritos[nombreUsuario] = [];
        }
    }
    document.getElementById('compra-conjunto').addEventListener('click', () => {
        Swal.fire({
            title: 'Compra realizada',
            text: 'Tu compra ha sido realizada con éxito',
            icon: 'success',
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        });
    });
    
    function mostrarProductos() {
        const productos = [
            { nombre: "Ojo de bife", precio: 5, imagenUrl: "./img/bife.jpg" },
            { nombre: "Combo Chuleta", precio: 4, imagenUrl: "./img/bifes.jpg" },
            { nombre: "Bife de Cerdo", precio: 2, imagenUrl: "./img/chancho.jpg" },
            { nombre: "Pollo completo", precio: 2, imagenUrl: "./img/pollo.jpg" }
        ];
    
        productos.forEach((producto, index) => {
            const productoDiv = document.createElement('div');
            productoDiv.className = 'producto';
    
            const img = document.createElement('img');
            img.src = producto.imagenUrl; // Asegúrate de tener una propiedad 'imagenUrl' en cada objeto de producto
            img.alt = producto.nombre;
            productoDiv.appendChild(img);
    
            const h3 = document.createElement('h3');
            h3.textContent = producto.nombre;
            productoDiv.appendChild(h3);
    
            const p = document.createElement('p');
            p.textContent = `Precio: $${producto.precio}`;
            productoDiv.appendChild(p);
    
            const button = document.createElement('button');
            button.textContent = 'Agregar al carrito';
            button.classList.add('agregar-carrito');
            button.dataset.nombre = producto.nombre;
            button.dataset.precio = producto.precio;
            productoDiv.appendChild(button);
    
            productosContainer.appendChild(productoDiv);
        });
    }
    async function mostrarCotizacionDolar() {
        const valorDolarElement = document.getElementById('valor-dolar');
    
        try {
            const tasaDeCambio = await obtenerTasaDeCambio();
            valorDolarElement.textContent = `1 USD = ${tasaDeCambio.toFixed(2)} ARS`;
        } catch (error) {
            valorDolarElement.textContent = 'No se pudo obtener la cotización del dólar.';
        }
    }
    

    setInterval(mostrarCotizacionDolar, 60 * 1000);
    
 
    mostrarCotizacionDolar();
    
    

    function mostrarCarrito(nombreUsuario) {
        const carrito = carritos[nombreUsuario] || [];
        let total = 0;

        carritoLista.innerHTML = '';

        carrito.forEach((producto, index) => {
            const li = document.createElement('li');
            li.textContent = `${producto.nombre} - $${producto.precio}`;

            total += producto.precio;

            carritoLista.appendChild(li);
        });

        const totalElement = document.createElement('p');
        totalElement.textContent = `Total: $${total.toFixed(2)}`;
        carritoLista.appendChild(totalElement);

        tituloCarrito.textContent = `Carrito de Compras de ${nombreUsuario}`; 
    }

    formularioIngreso.addEventListener('submit', function (event) {
        event.preventDefault();
        const nombreUsuarioInput = document.getElementById('nombre-usuario');
        const nombreUsuario = nombreUsuarioInput.value.trim();

        if (nombreUsuario !== '' && !usuariosIngresados.includes(nombreUsuario)) {
            usuariosIngresados.push(nombreUsuario);
            guardarEnLocalStorage();
            crearCarrito(nombreUsuario);
            localStorage.setItem('usuario', nombreUsuario);
            mostrarCarrito(nombreUsuario);
            mostrarListaUsuarios();
        } else {
            mensajeBienvenida.textContent = `Error: Nombre de usuario inválido o ya existente.`;
        }

        nombreUsuarioInput.value = '';
    });

    async function obtenerTasaDeCambio() {
      const url = 'https://api.exchangerate-api.com/v4/latest/USD';
      const respuesta = await fetch(url);
      const datos = await respuesta.json();
      return datos.rates.ARS;
    }

    function calcularTotalUsuario(nombreUsuario) {
      let totalUsuario = 0;
      const carritoUsuario = JSON.parse(localStorage.getItem(nombreUsuario)) || [];
      carritoUsuario.forEach(producto => {
          totalUsuario += producto.precio;
      });
      return totalUsuario;
    }

    function mostrarListaUsuarios() {
      usuariosLista.innerHTML = '';
      let totalGeneral = 0;
      usuariosIngresados.forEach(usuario => {
          const li = document.createElement('li');
          let totalUsuario = calcularTotalUsuario(usuario);
          totalGeneral += totalUsuario;
          li.textContent = `${usuario} - Total gastado: $${totalUsuario.toFixed(2)}`;
          usuariosLista.appendChild(li);
      });
      const pTotalGeneral = document.createElement('p');
      pTotalGeneral.textContent = `Total general: $${totalGeneral.toFixed(2)}`;
      usuariosLista.appendChild(pTotalGeneral);

      if (usuariosIngresados.length > 1) {
          compraConjuntoBtn.textContent = 'Realizar compra en conjunto';
      } else {
          compraConjuntoBtn.textContent = 'Realizar compra';
      }
    }

    productosContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('agregar-carrito')) {
            const nombreProducto = event.target.dataset.nombre;
            const precioProducto = parseFloat(event.target.dataset.precio);
            const nombreUsuarioActual= localStorage.getItem("usuario");
            if (nombreUsuarioActual) {
              const producto = { nombre: nombreProducto, precio: precioProducto };
              carritos[nombreUsuarioActual].push(producto);
              guardarEnLocalStorage();
              mostrarCarrito(nombreUsuarioActual);
              mostrarListaUsuarios();
            }
        }
    });

    limpiarCarritoBtn.addEventListener('click', () => {
        const nombreUsuario = localStorage.getItem('usuario');
        if (nombreUsuario) {
          carritos[nombreUsuario] = [];
          guardarEnLocalStorage();
          mostrarCarrito(nombreUsuario);
          mostrarListaUsuarios();
        }
    });

    confirmarCarritoBtn.addEventListener('click', async () => {
      const nombreUsuarioActual= localStorage.getItem("usuario");
      if (nombreUsuarioActual && carritos[nombreUsuarioActual].length > 0) {
        const tasaDeCambio = await obtenerTasaDeCambio();
        const carritoEnPesos = carritos[nombreUsuarioActual].map(producto => {
            return {
                nombre: producto.nombre,
                precio: producto.precio * tasaDeCambio
            };
        });
        localStorage.setItem(nombreUsuarioActual, JSON.stringify(carritoEnPesos));
        carritos[nombreUsuarioActual] = [];
        guardarEnLocalStorage();
        mostrarCarrito(nombreUsuarioActual);
        mostrarListaUsuarios();
      }
    });

    compraConjuntoBtn.addEventListener('click', () => { 
        let totalGeneral = 0;
        usuariosIngresados.forEach(usuario => {
            let totalUsuario = calcularTotalUsuario(usuario);
            totalGeneral += totalUsuario;
        });
      
        if (totalGeneral > 0) {
          usuariosIngresados.forEach(usuario => {
              localStorage.removeItem(usuario); 
              carritos[usuario] = []; 
          });
          guardarEnLocalStorage();
          mostrarListaUsuarios();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'El carrito está vacío!',
          })
        }
      });
      
      

    mostrarProductos();
    mostrarListaUsuarios();
    
});

