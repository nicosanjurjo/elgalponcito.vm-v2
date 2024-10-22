from django.db import models

class Categoria(models.Model):
    nombre = models.CharField(max_length=75)
    disponible = models.BooleanField()

    def __str__(self):
        return f"{self.nombre}"

class Producto(models.Model):
    nombre = models.CharField(max_length=75)
    descripcion = models.CharField(max_length=200)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    precio = models.IntegerField()
    disponible = models.BooleanField()
    masasxunidad = models.DecimalField(decimal_places=1, max_digits=4)

    def __str__(self):
        return f"{self.nombre}"