# Generated by Django 5.0.7 on 2024-08-03 16:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('productos', '0006_alter_producto_descripcion_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='producto',
            name='masasxunidad',
            field=models.FloatField(),
        ),
    ]
