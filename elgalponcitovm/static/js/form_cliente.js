$(document).ready(function() {
    let totalAmount = 0;
    let zonaPrecio = 0;

    // Función para llenar la tabla de productos con los datos del Local Storage
    function llenarTablaProductos() {
        let productos = JSON.parse(localStorage.getItem('productos')) || [];
        let tablaProductos = $('#tabla-productos');
    
        // Vaciar la tabla antes de llenarla
        tablaProductos.empty();
    
        totalAmount = 0;
    
        productos.forEach(function(producto, index) {
            totalAmount += parseInt(producto.precio);
            let fila = `<tr>
                            <td>${producto.nombre}</td>
                            <td>${producto.precio}</td>
                            <td><button class="btn btn-danger" onclick="eliminarProducto(${index})">Eliminar del pedido</button></td>
                        </tr>`;
            tablaProductos.append(fila);
        });
    
        actualizarTotal();
    }
    
    // Función para actualizar el total incluyendo el precio de la zona
    function actualizarTotal() {
        $('#total-amount').text((totalAmount + zonaPrecio));
    }

    // Función para eliminar un producto del Local Storage
    window.eliminarProducto = function(index) {
        let productos = JSON.parse(localStorage.getItem('productos')) || [];
        
        // Eliminar el producto del array
        productos.splice(index, 1);
        
        // Actualizar el Local Storage
        localStorage.setItem('productos', JSON.stringify(productos));
        
        // Volver a llenar la tabla
        llenarTablaProductos();
    }

    // Llamar a la función para llenar la tabla al cargar la página
    llenarTablaProductos();

    // Verificar el estado del checkbox al cargar la página
    if ($('#cuandoEsteLista').is(':checked')) {
        $('#horario').prop('disabled', true);
    }

    // Manejar la lógica de "cuando esté lista"
    $('#cuandoEsteLista').change(function() {
        $('#horario').prop('disabled', $(this).is(':checked'));
    });

    // Mostrar/ocultar zonas de envío basado en la selección del método de entrega
    $('input[name="metodoEntrega"]').change(function() {
        if ($('#delivery').is(':checked')) {
            $('#zonas-envio').removeClass('d-none');
        } else {
            $('#zonas-envio').addClass('d-none');
            zonaPrecio = 0; // Restablecer el precio de la zona
            $('.seleccionar-zona').removeClass('btn-success').addClass('btn-primary');
            $('.seleccionar-zona').text('Seleccionar')
            actualizarTotal(); // Actualizar el total
        }
    });

    // Función para seleccionar zona de envío
    $('.seleccionar-zona').click(function() {
        const zonaPrecioSeleccionado = parseInt($(this).data('zona-costo'));
        zonaSeleccionada = $(this).data('zona-id'); // Guardar la zona seleccionada
        $('.seleccionar-zona').removeClass('btn-success').addClass('btn-primary');
        $('.seleccionar-zona').text('Seleccionar')
        $(this).removeClass('btn-primary').addClass('btn-success');
        $(this).text('Zona seleccionada');
        zonaPrecio = zonaPrecioSeleccionado; // Actualizar el precio de la zona
        actualizarTotal(); // Actualizar el total
    });


    $('.confirmado').click(function(event) {

        event.preventDefault(); // Prevenir el envío estándar del formulario
    
        // Obtener los valores del formulario
        let nombre = $('#clienteNombre').val().trim();
        let telefono = $('#clienteTelefono').val().trim();
        let horario = $('#horario').val();
        let medioPago = $('#medioPago').val();
        let metodoEntrega = $('input[name="metodoEntrega"]:checked').val();
        let direccion = $('#clienteDireccion').val().trim();
        let observaciones = $('#observaciones').val().trim();
    
        // Validar campos obligatorios
        if (!nombre || !telefono || !medioPago || !metodoEntrega) {
            alert('Por favor, complete todos los campos obligatorios.');
            return;
        }

        if (!$('#cuandoEsteLista').is(':checked') && !horario) {
            alert('Por favor, selecciona un turno o marca la opción "Cuando esté lista".');
            return;
        }
    
        if (metodoEntrega === 'envio') {
            let zonaSeleccionada = $('.seleccionar-zona.btn-success').data('zona-id');
            if (!zonaSeleccionada || !direccion) {
                alert('Por favor, seleccione una zona de envío y complete el campo dirección.');
                return;
            }
        }

        // Crear el array de detalles simplificados del pedido
        let productos = JSON.parse(localStorage.getItem('productos')) || [];

        let productosIds = productos.map(function(producto) {
            return producto.id;
        });
       
        let detallesSimplificados = productos.map(function(producto) {
            return `${producto.nombre}: $${producto.precio}`;
        }).join(', ');
        
            
        // Crear el objeto de datos del formulario
        let datosPedido = {
            nombre: nombre,
            telefono: telefono,
            cantidad: productos.length,
            horario: $('#cuandoEsteLista').is(':checked') ? null : horario,
            medio_pago: medioPago,
            metodo_entrega: metodoEntrega,
            direccion: metodoEntrega === 'envio' ? direccion : '',
            observaciones: observaciones,
            zona_id: metodoEntrega === 'envio' ? $('.seleccionar-zona.btn-success').data('zona-id') : null,
            monto: totalAmount + zonaPrecio,
            detalles: detallesSimplificados,
            productos_ids: productosIds // Añadir los IDs de los productos
        };
    
        // Enviar el formulario usando AJAX
        $.ajax({
            type: 'POST',
            url: 'confirmado/', //
            data: JSON.stringify(datosPedido),
            contentType: 'application/json', // Especifica el tipo de contenido como JSON
            success: function(response) {
                alert(`Pedido realizado con éxito\n\nDetalles del pedido:\n${detallesSimplificados}\n\nMonto total: $${totalAmount + zonaPrecio}\nSI ABONAS POR MP RECORDA ENVIAR EL COMPROBANTE AL 2657-584580`);
                localStorage.clear();
                window.location.href = '/cliente'; // Limpiar el localStorage
            },
            error: function(error) {
                alert('Error al realizar el pedido, por favor intente de nuevo.');
            }
        });
    });
    

    $('.cancelar').click(function(event) {
        localStorage.clear()
        alert('Pedido cancelado');

    })

});

