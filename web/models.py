# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models


class ingresos(models.Model):
    visita_fecha = models.CharField(max_length=30)
    visita_ip = models.CharField(max_length=300)
    fuente = models.CharField(max_length=300)
    def __str__(self):
        return self.name


class usuarios(models.Model):
    receptor_id = models.CharField(max_length=30)
    receptor_nom = models.CharField(max_length=300)
    receptor_clave = models.CharField(max_length=50)
    receptor_email = models.EmailField(max_length=254)
    def __str__(self):
        return self.name


class documentos(models.Model):
	tipo =  models.CharField(max_length=50)
	clave =  models.CharField(max_length=50)
	fecha =  models.DateField()
	numero =  models.CharField(max_length=50)
	valor =  models.DecimalField(max_digits=19, decimal_places=2)
	receptor_visto = models.CharField(max_length=2)
	receptor_nom = models.CharField(max_length=300)
	receptor_ruc = models.CharField(max_length=20)
	emisor_visto = models.CharField(max_length=2)
	emisor_nom = models.CharField(max_length=300)
	emisor_ruc = models.CharField(max_length=20)
	def __str__(self):
		return self.name