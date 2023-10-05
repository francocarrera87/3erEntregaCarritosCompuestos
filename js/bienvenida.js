function mostrarBienvenida() {
    const nombre = prompt("Por favor, ingresa tu nombre:");
    if (nombre) {
        alert(`¡Bienvenido al carrito de compras, ${nombre}!`);
        return nombre;
    } else {
        alert("Por favor, ingresa un nombre válido.");
        return mostrarBienvenida();
    }
}
