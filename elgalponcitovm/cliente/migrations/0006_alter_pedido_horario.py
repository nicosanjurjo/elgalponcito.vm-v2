# Generated by Django 5.0.7 on 2024-07-26 18:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cliente', '0005_alter_pedido_horario_alter_pedido_metodo_entrega'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pedido',
            name='horario',
            field=models.CharField(blank=True, max_length=5, null=True),
        ),
    ]