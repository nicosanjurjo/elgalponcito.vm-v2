from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from productos.models import Producto, Categoria
from gestion.models import Stock
from .models import Pedido, Turno
from zonas.models import Zona

def cliente(request):
    productos = Producto.objects.all()
    categorias = Categoria.objects.all()
    return render(request, 'cliente/cliente.html', {'productos': productos, 'categorias': categorias})

def clienteform(request):
    # Filtrar turnos que tienen menos de 10 pedidos asignados
    turnos = Turno.objects.filter(pedidos_actuales__lt=10)
    medios = Pedido.PAGO_CHOICES
    zonas = Zona.objects.all()
    return render(request, "cliente/form_cliente.html", {"turnos": turnos, "medios": medios, "zonas": zonas})


@csrf_exempt
def crear_pedido(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        # Obtener los IDs de los productos
        productos_ids = data['productos_ids']
        print(productos_ids)
        total_masas = 0

        # Calcular el total de masas requeridas
        for producto_id in productos_ids:
            producto = Producto.objects.get(id=producto_id)
            print(total_masas)
            print(producto.masasxunidad)
            total_masas = (total_masas+producto.masasxunidad)
            print(total_masas)

        if total_masas == 0:
            return JsonResponse({'error': 'No hay suficiente stock de masas disponible.'}, status=400)

        # Verificar el stock
        stock = Stock.objects.first() # Asumiendo que solo hay un registro de stock
        if total_masas > stock.cantidad_masas:
            return JsonResponse({'error': 'No hay suficiente stock de masas disponible.'}, status=400)    
        else:    
            horario = None
        if 'horario' in data and data['horario']:
            horario = Turno.objects.get(id=data['horario'])
            horario.pedidos_actuales += 1
            horario.save()
            
        detalles = data['detalles']
            
        if data['metodo_entrega'] == 'envio':
            zona = Zona.objects.get(id=data['zona_id'])
            detalles = detalles + f", {zona.nombre_zona}: ${zona.costo}"
            print(detalles)
            
        # Convertir el horario elegido en un string antes de almacenarlo
        horario_str = horario.horario.strftime("%H:%M") if horario else None
            
        pedido = Pedido(
            nombre=data['nombre'],
            telefono=data['telefono'],
            cantidad=data['cantidad'],
            detalles=detalles,
            monto=data['monto'],
            estado='tomado',  # Estado por defecto
            horario=horario_str,
            medio_pago=data['medio_pago'],
            metodo_entrega=data['metodo_entrega'],
            direccion=data['direccion'] if data['metodo_entrega'] == 'envio' else '',
            observaciones=data['observaciones']
                )
        stock.cantidad_masas -= total_masas
        stock.save()
        pedido.save()
        return JsonResponse({'success': 'Pedido creado exitosamente'}, status=200)