let carrito = [];

function agregarAlCarrito(producto, usuario) {
    carrito.push({ usuario, ...producto });
}

function obtenerCarrito() {
    return carrito;
}

export { agregarAlCarrito, obtenerCarrito };
