# Generated by Django 5.0.7 on 2024-08-05 04:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gestion', '0006_alter_stock_cantidad_masas'),
    ]

    operations = [
        migrations.AlterField(
            model_name='stock',
            name='cantidad_masas',
            field=models.DecimalField(decimal_places=1, max_digits=4),
        ),
    ]
