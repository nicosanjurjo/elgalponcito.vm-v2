$(document).ready(function() {
  new DataTable('#myTable', {
    order: [[0, 'desc']]
  });

    $('.habilitar').click(function() {
        $('#numberModal').modal('show');
      });

      $('.deshabilitar').click(function() {
        var number = 0;
        $.ajax({
          url: 'establecer_stock/',
          method: 'POST',
          data: JSON.stringify(number),
          success: function(response) {
            alert('Pedidos deshabilitados');
            $('#stock-actual').text('Masas disponibles\n' + response.new_stock);
          },
          error: function(response) {
            alert('Error al guardar el número.');
          }
        });
      });

      $('#saveNumberBtn').click(function() {
        var number = $('#numberInput').val();
        $.ajax({
          url: 'establecer_stock/',
          method: 'POST',
          data: JSON.stringify(number),
          success: function(response) {
            alert('Stock para la venta establecido');
            $('#numberModal').modal('hide');
            $('#stock-actual').text('Masas disponibles\n' + response.new_stock);
          },
          error: function(response) {
            alert('Error al guardar el número.');
          }
        });
      });

      var action = '';

      $('.incrementar').click(function() {
        action = 'incrementar';
        $('#action-type').text('incrementar');
        $('#confirmModal').modal('show');
      });

      $('.decrementar').click(function() {
        action = 'decrementar';
        $('#action-type').text('decrementar');
        $('#confirmModal').modal('show');
      });

      $('#confirmActionBtn').click(function() {
        updateStock(action);
        $('#confirmModal').modal('hide');
      });

      function updateStock(action) {
        $.ajax({
          url: 'update_stock/',
          method: 'POST',
          data: {
            'action': action,
            'csrfmiddlewaretoken': '{{ csrf_token }}'
          },
          success: function(response) {
            $('#stock-actual').text('Masas disponibles\n' + response.new_stock);
          },
          error: function(response) {
            alert('Error al actualizar el stock.');
          }
        });
      }

        // Manejar el botón "Ver/Editar"
  $('.ver-editar').click(function() {
    var pedidoId = $(this).data('id');
    $.ajax({
      url: 'obtener_pedido/',
      method: 'GET',
      data: { 'id': pedidoId },
      success: function(response) {
        $('#pedido-id').text(response.id);
        $('#pedido-ingreso').text(response.ingreso);
        $('#pedido-nombre').text(response.nombre);
        $('#pedido-telefono').text(response.telefono);
        $('#pedido-cantidad').text(response.cantidad);
        $('#pedido-detalles').text(response.detalles);
        $('#pedido-monto').text('$ '+response.monto);
        $('#pedido-medio').text(response.medio);
        $('#pedido-horario').text(response.horario);
        $('#pedido-direccion').text(response.direccion);
        $('#pedido-observaciones').text(response.observaciones);
        $('#pedido-estado').val(response.estado);
        $('#pedidoModal').modal('show');
      },
      error: function(response) {
        alert('Error al obtener los detalles del pedido.');
      }
    });
  });

  // Guardar cambios del pedido
  $('#guardar-cambios').click(function() {
    var pedidoId = $('#pedido-id').text();
    var nuevoEstado = $('#pedido-estado').val();
    $.ajax({
      url: 'actualizar_pedido/',
      method: 'POST',
      data: {
        'id': pedidoId,
        'estado': nuevoEstado,
        'csrfmiddlewaretoken': '{{ csrf_token }}'
      },
      success: function(response) {
        alert('Pedido actualizado correctamente');
        $('#pedidoModal').modal('hide');
        location.reload();  // Recargar la página para ver los cambios
      },
      error: function(response) {
        alert('Error al actualizar el pedido.');
      }
    });
  });

});