# -*- coding: utf-8 -*-

##from elementtree import ElementTree
#import xml.elementtree as ET2 # Python 2.5
#import xml.etree.elementtree as ET2 # Python 2.5
#import urllib2
import sys
import smtplib
import unicodedata
import datetime
import json
import random
from django.core.mail import EmailMessage


# Create your views here.
from django.shortcuts import get_object_or_404, render
from django.http import Http404
from web.models import usuarios, documentos, ingresos
from django.core.exceptions import ObjectDoesNotExist
from django.core.mail import send_mail, BadHeaderError
from django.http import HttpResponse, HttpResponseRedirect
from django.core.files.storage import FileSystemStorage


from django.views.decorators.csrf import csrf_exempt

import web.con_db
#import web.funciones_edocs
import sys

from dateutil import parser



def traer_charts(request, Id_empresa, usuario): 
    db = web.con_db.charts(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    valores_charts = {}
    lista_charts = db.traer_charts(usuario)
    print('lista_charts')
    print(lista_charts)
    for xx in lista_charts:
    	t_sentencia = str(xx["sentencia"])
    	t_sentencia = t_sentencia.replace("@usuario", usuario)
    	print(t_sentencia)
    	dbvalores_charts = db.ejecutar_charts(t_sentencia)
    	valores_charts.update({xx["pk"]:dbvalores_charts})
    return ({'lista_charts':lista_charts, 'valores_charts':valores_charts})

