# Generated by Django 5.0.3 on 2024-08-18 03:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('JobApp', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='exeperience',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='username',
            field=models.CharField(max_length=255, unique=True),
        ),
    ]
