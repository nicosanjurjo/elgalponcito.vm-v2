from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from cliente.models import Pedido, Turno
from .models import Stock
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import json, win32print

def gestion(request):
    pedidos = Pedido.objects.all()
    cantidad = Stock.objects.first()
    print(cantidad)
    return render(request, 'gestion/gestion.html', {'pedidos': pedidos, 'cantidad': cantidad})

@csrf_exempt
def establecer_stock(request):
    if request.method == 'POST':
        stock_anterior=Stock.objects.all()
        stock_anterior.delete()
        data = json.loads(request.body.decode('utf-8'))
        stock = Stock(cantidad_masas=data)
        stock.save()
        if data == 0:
            Turno.objects.all().update(pedidos_actuales=0)
        return JsonResponse({'status': 'success', 'new_stock': stock.cantidad_masas})
    return JsonResponse({'status': 'error'}, status=400)

@csrf_exempt
def update_stock(request):
    if request.method == 'POST':
        action = request.POST.get('action')
        stock = Stock.objects.first()
        
        if action == 'incrementar':
            stock.cantidad_masas += 1
        elif action == 'decrementar':
            stock.cantidad_masas -= 1
        
        stock.save()
        return JsonResponse({'status': 'success', 'new_stock': stock.cantidad_masas})
    
    return JsonResponse({'status': 'error'}, status=400)

@csrf_exempt
def obtener_pedido(request):
    if request.method == 'GET':
        pedido_id = request.GET.get('id')
        pedido = get_object_or_404(Pedido, id=pedido_id)
        # Convert the 'created_at' datetime to the local timezone
        ingreso_local = timezone.localtime(pedido.created_at, timezone.get_current_timezone())
        pedido_data = {
            'id': pedido.id,
            'ingreso': ingreso_local.isoformat(),
            'nombre': pedido.nombre,
            'telefono': pedido.telefono,
            'cantidad': pedido.cantidad,
            'detalles': pedido.detalles,
            'monto': pedido.monto,
            'medio': pedido.medio_pago,
            'horario': pedido.horario,
            'direccion': pedido.direccion,
            'observaciones': pedido.observaciones,
            'estado': pedido.estado,
        }
        return JsonResponse(pedido_data)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

@csrf_exempt
def actualizar_pedido(request):
    if request.method == 'POST':
        pedido_id = request.POST.get('id')
        nuevo_estado = request.POST.get('estado')
        pedido = get_object_or_404(Pedido, id=pedido_id)
        pedido.estado = nuevo_estado
        pedido.save()
        return JsonResponse({'success': 'Pedido actualizado correctamente'})
    return JsonResponse({'error': 'Método no permitido'}, status=405)

def imprimir_pedido(request, pedido_id):
    # Obtener el pedido desde la base de datos
    pedido = get_object_or_404(Pedido, id=pedido_id)

    # Crear el contenido a imprimir
    contenido = f"""
    Pedido ID: {pedido.id}
    Nombre: {pedido.nombre}
    Cantidad: {pedido.cantidad}
    Detalles: {pedido.detalles}
    Monto: {pedido.monto}
    Medio de Pago: {pedido.medio_pago}
    Horario: {pedido.horario if pedido.horario else 'Cuando esté lista'}
    Dirección: {pedido.direccion if pedido.direccion else 'No especificada'}
    Observaciones: {pedido.observaciones if pedido.observaciones else 'No hay observaciones'}
    """

    # Nombre de la impresora predeterminada
    printer_name = win32print.GetDefaultPrinter()

    # Enviar el contenido a la impresora
    try:
        hPrinter = win32print.OpenPrinter(printer_name)
        try:
            hJob = win32print.StartDocPrinter(hPrinter, 1, ("Pedido", None, "RAW"))
            win32print.StartPagePrinter(hPrinter)
            win32print.WritePrinter(hPrinter, contenido.encode('utf-8'))
            win32print.EndPagePrinter(hPrinter)
            win32print.EndDocPrinter(hPrinter)
        finally:
            win32print.ClosePrinter(hPrinter)

        return JsonResponse({'status': 'success'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)