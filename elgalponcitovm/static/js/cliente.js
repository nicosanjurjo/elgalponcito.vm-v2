/*window.addEventListener('load', function () {
    localStorage.clear();
    console.log('localStorage cleared on page load.');
});*/ 

$(document).ready(function() {

    window.vaciarCarrito = function(){
        localStorage.clear()
        alert("Se eliminaron todos los productos del pedido, puedes volver a seleccionar");
    }

    window.agregarProducto = function(id, nombre, precio) {
        // Obtener los productos existentes del Local Storage
        let productos = JSON.parse(localStorage.getItem('productos')) || [];
        
        // Crear un nuevo objeto de producto
        let nuevoProducto = {
            id: id,
            nombre: nombre,
            precio: precio,
        };

        // Agregar el nuevo producto a la lista
        productos.push(nuevoProducto);
    
        // Guardar la lista actualizada en el Local Storage
        localStorage.setItem('productos', JSON.stringify(productos));
        confirmacion(id, nombre, precio)
        // Opcional: Mostrar un mensaje de confirmación
        alert("Se agregó una unidad de " + nombre + " al pedido");
    }
});


