# Generated by Django 5.0.7 on 2024-08-03 16:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gestion', '0005_alter_stock_cantidad_masas'),
    ]

    operations = [
        migrations.AlterField(
            model_name='stock',
            name='cantidad_masas',
            field=models.FloatField(),
        ),
    ]
