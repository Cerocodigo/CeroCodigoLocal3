
# -*- coding: utf-8 -*-

##from elementtree import ElementTree
#import xml.elementtree as ET2 # Python 2.5
#import xml.etree.elementtree as ET2 # Python 2.5
#import urllib2
from ast import Try
import re
from shutil import register_unpack_format
import sys
import smtplib
import unicodedata
import datetime
import json
import random
from django.core.mail import EmailMessage
import os.path


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
import web.funciones_edocs
import web.electronica_ecuador

import sys

from dateutil import parser
from datetime import datetime

from datetime import date

def acceso_externo_insertar(request, datos_con):
    db = web.con_db.externo_cliente(datos_con[0]['conn_user'], datos_con[0]['conn_pass'],datos_con[0]['conn_base'],datos_con[0]['conn_ip']) 
    datos_accose = db.acceso_externo("Cliente")
    sql_insert = "INSERT INTO `"+str(datos_accose[0]['Tabla'])+"` ("
    sql_valores = " VALUES ("
    campos = datos_accose[0]['campos'].split(',')
    for campo in campos:
        sql_insert = sql_insert + '`'+campo+'`,'
        sql_valores = sql_valores + "'"+str(request.POST.getlist(campo)[0])+"',"
    db.sql_ejecutar_directo(sql_insert[:-1] + ")" +  sql_valores[:-1] + ")")
    return datos_accose

def acceso_externoCalen_inicio(request, datos_con, Id_empresa):
    db = web.con_db.externo_cliente(datos_con[0]['conn_user'], datos_con[0]['conn_pass'],datos_con[0]['conn_base'],datos_con[0]['conn_ip']) 
    return db.traer_caledarioExternos()


def acceso_externo(request, datos_con, Id_empresa):
    db = web.con_db.externo_cliente(datos_con[0]['conn_user'], datos_con[0]['conn_pass'],datos_con[0]['conn_base'],datos_con[0]['conn_ip']) 
    datos_accose = db.acceso_externo("Cliente")
    if not(request.session.has_key('conn_ip')):
        request.session['conn_user'] = {}
        request.session['conn_pass'] = {}
        request.session['conn_base'] = {}
        request.session['conn_ip'] = {}
    request.session['conn_user'].update({Id_empresa:datos_con[0]['conn_user']})
    request.session['conn_pass'].update({Id_empresa:datos_con[0]['conn_pass']})
    request.session['conn_base'].update({Id_empresa:datos_con[0]['conn_base']})
    request.session['conn_ip'].update({Id_empresa:datos_con[0]['conn_ip']})        
    request.session.save()
    return datos_accose

def validar_user_externo(request, Id_empresa, inputUsuario, inputPassword):
    db = web.con_db.externo_cliente(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    datos_accose = db.acceso_externo("Cliente")
    ingreso = db.traer_log_externo(datos_accose[0]['Tabla'], datos_accose[0]['Usuario'], inputUsuario, datos_accose[0]['Clave'], inputPassword )
    if len(ingreso) > 0:
        paneles = db.traer_paneles_externo(datos_accose[0]['PkExterno'])
        for panel in paneles:
            panel['valores'] = db.paneles_externo_tabla(str(panel['Sentencia']).replace('@Externo@',inputUsuario ))
            panel['columnas'] = str(panel['columnas']).split(',')
        db = web.con_db.inter_login_LOGIN("Mysql")
        dbEmpresa = db.traer_empresa(Id_empresa)
        if len(dbEmpresa) == 1:
            if dbEmpresa[0]["estado"] == "valido":
                if not(request.session.has_key('conn_ip')):
                    request.session['conn_user'] = {}
                    request.session['conn_pass'] = {}
                    request.session['conn_base'] = {}
                    request.session['conn_ip'] = {}
                request.session['conn_user'].update({Id_empresa:dbEmpresa[0]['conn_user']})
                request.session['conn_pass'].update({Id_empresa:dbEmpresa[0]['conn_pass']})
                request.session['conn_base'].update({Id_empresa:dbEmpresa[0]['conn_base']})
                request.session['conn_ip'].update({Id_empresa:dbEmpresa[0]['conn_ip']})        
                request.session.save()
                db_cliente = web.con_db.externo_cliente(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
                cal_accrap = db_cliente.cal_accrap('Externo')

                return ({'Existe':'Si', 'Datos': ingreso, 'paneles':paneles, 'cal_accrap':cal_accrap, 'datos_accose':datos_accose})
    if len(ingreso) == 0:
        return ({'Existe':'No', 'msg':'Usuario Clave no existe'})


    return datos_accose