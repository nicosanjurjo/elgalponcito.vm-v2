# Generated by Django 5.0.7 on 2024-07-23 02:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('zonas', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='zona',
            old_name='precio',
            new_name='costoenvio',
        ),
        migrations.RenameField(
            model_name='zona',
            old_name='nombre',
            new_name='titulo',
        ),
    ]