# Generated by Django 5.0.7 on 2024-07-23 02:18

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('zonas', '0003_rename_descripcion_zona_descripcion_zona_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='zona',
            old_name='costoenvio',
            new_name='costo',
        ),
    ]