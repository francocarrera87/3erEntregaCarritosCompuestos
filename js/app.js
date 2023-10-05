document.addEventListener('DOMContentLoaded', () => {
    const productosContainer = document.querySelector('.productos');
    const carritoLista = document.getElementById('carrito-lista');
    const limpiarCarritoBtn = document.getElementById('limpiar-carrito');
    const confirmarCarritoBtn = document.getElementById('confirmar-carrito');
    const formularioIngreso = document.getElementById('formulario-ingreso');
    const mensajeBienvenida = document.getElementById('mensaje-bienvenida');
    const usuariosLista = document.getElementById('usuarios-lista');
    const usuariosGastos = document.querySelectorAll('.columna span');

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

    function mostrarProductos() {
        const productos = [
            { nombre: "Producto 1", precio: 45 },
            { nombre: "Producto 2", precio: 63 },
            { nombre: "Producto 3", precio: 77 }
        ];

        productos.forEach((producto, index) => {
            const productoDiv = document.createElement('div');
            productoDiv.className = 'producto';
            productoDiv.innerHTML = `
                <h3>${producto.nombre}</h3>
                <p>Precio: $${producto.precio}</p>
                <button class="agregar-carrito" data-nombre="${producto.nombre}" data-precio="${producto.precio}">Agregar al Carrito</button>
            `;
            productosContainer.appendChild(productoDiv);
        });
    }

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

        usuariosGastos.forEach((element, index) => {
            const usuario = `usuario${index + 1}`;
            if (usuariosIngresados.includes(usuario)) {
                let totalUsuario = 0;
                const carritoUsuario = carritos[usuario] || [];
                carritoUsuario.forEach(producto => {
                    totalUsuario += producto.precio;
                });
                element.textContent = `$${totalUsuario.toFixed(2)}`;
            } else {
                element.textContent = `$0.00`;
            }
        });
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

    confirmarCarritoBtn.addEventListener('click', () => {
      const nombreUsuarioActual= localStorage.getItem("usuario");
      if (nombreUsuarioActual && carritos[nombreUsuarioActual].length > 0) {
        localStorage.setItem(nombreUsuarioActual, JSON.stringify(carritos[nombreUsuarioActual]));
        carritos[nombreUsuarioActual] = [];
        guardarEnLocalStorage();
        mostrarCarrito(nombreUsuarioActual);
        mostrarListaUsuarios();
      }
    });

    mostrarProductos();
    mostrarListaUsuarios();
});
