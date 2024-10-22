from django.urls import path
from . import views

urlpatterns = [
   
    path('', views.gestion, name='Gestion'),
    path('establecer_stock/', views.establecer_stock, name='establecerStock'),
    path('update_stock/', views.update_stock, name='update_stock'),
    path('obtener_pedido/', views.obtener_pedido, name='obtener_pedido'),
    path('actualizar_pedido/', views.actualizar_pedido, name='actualizar_pedido'),
    path('imprimir-pedido/<int:pedido_id>/', views.imprimir_pedido, name='imprimir_pedido'),
]