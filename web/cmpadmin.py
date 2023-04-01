
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


def CampoXTabla(request, Id_empresa, estructura):
    db = web.con_db.cmpcampos(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    campos= db.camposXtabla(estructura)
    return {'campos': campos}

def tablasXmodulo(request, Id_empresa, modulo):
    db = web.con_db.cmpcampos(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    tabla=  db.tablasXmodulo(modulo)
    return {'tabla': tabla}

def procesos_todos(request, Id_empresa):
    db = web.con_db.cmpcampos(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    modulos =  db.procesos()
    return {'modulos': modulos}

def cmpadmin_grabar(dat_conn, zona, es_nuevo, pkid, fuente, t_pkmodulo, t_pkestructura, t_dataCampo, t_dataX, tabla_nombre, cmp_nombre, cmp_display):
    db = web.con_db.cmpcampos(dat_conn['conn_user'],dat_conn['conn_pass'],dat_conn['conn_base'],dat_conn['conn_ip']) 

    cmp_nombre_viejo =''
    if es_nuevo == False:
        pkcampo_inicial = db.tarer_campo_cmpextrucutra(pkid)
        cmp_nombre_viejo = pkcampo_inicial[0]['Nombre']
        db.borrar_cmpCampo(pkcampo_inicial[0]['TablaCampo'], pkcampo_inicial[0]['PkCampo'])
        db.borrar_camposXestructura(pkcampo_inicial[0]['PkId'], pkcampo_inicial[0]['PkModulo'],pkcampo_inicial[0]['PkEstructura'],pkcampo_inicial[0]['PkCampo'])

    if fuente == 'cmptxtsimple':
        new_pkcampo = db.crear_cmptxtsimple(t_pkestructura, t_dataCampo)

    if fuente == 'cmpnumsimple':
        new_pkcampo = db.crear_cmpnumsimple(t_pkestructura, t_dataCampo)
        if len(new_pkcampo) == 0:
            db.crear_cmpnumsimple_agregarPredeterminado(t_pkestructura, t_dataCampo)
            new_pkcampo = db.crear_cmpnumsimple(t_pkestructura, t_dataCampo)

    if fuente == 'cmpnumsecuencial':
        new_pkcampo = db.crear_cmpnumsecuencial(t_pkestructura, t_dataCampo)

    if fuente == 'cmpopcmultiple':
        new_pkcampo = db.crear_cmpopcmultiple(t_pkestructura, t_dataCampo)

    if fuente == 'cmpsistema':
        new_pkcampo = db.crear_cmpsistema(t_pkestructura, t_dataCampo)

    if fuente == 'cmpformuladetalle':
        new_pkcampo = db.crear_cmpformuladetalle(t_pkestructura, t_dataCampo)

    if fuente == 'cmpfecha':
        new_pkcampo = db.crear_cmpfecha(t_pkestructura, t_dataCampo)

    if fuente == 'cmpreferencia':  #faltaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        new_pkcampo = db.crear_cmpreferencia(t_pkestructura, t_dataCampo)

    if fuente == 'cmpreferenciaadjunto':
        new_pkcampo = db.crear_cmpreferenciaadjunto(t_pkestructura, t_dataCampo)

    if fuente == 'cmpoperacion':
        new_pkcampo = db.crear_cmpoperacion(t_pkestructura, t_dataCampo)

    if fuente == 'cmpconsolidado':
        new_pkcampo = db.crear_cmpconsolidado(t_pkestructura, t_dataCampo)

    if fuente == 'cmparchivo': #faltaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        new_pkcampo = db.crear_cmparchivo(t_pkestructura, t_dataCampo)

    if fuente == 'cmpnumeroaletras':
        new_pkcampo = db.crear_cmpnumeroaletras(t_pkestructura, t_dataCampo)

    if fuente == 'cmpdecabecera':
        new_pkcampo = db.crear_cmpdecabecera(t_pkestructura, t_dataCampo)

    if fuente == 'cmpelectronico':
        new_pkcampo = db.crear_cmpelectronico(t_pkestructura, t_dataCampo)

    if fuente == 'cmpcondicional':
        new_pkcampo = db.crear_cmpcondicional(t_pkestructura, t_dataCampo)
    
    if es_nuevo == True:
        p_max = db.max_posis(t_pkestructura)
        t_dataX = {'Posicion':p_max,'Nombre':cmp_nombre,'Descripcion':cmp_display,'Anulado':'N','X':'0','Y':'0','tamano':'12','estilo':'Normal','Modificable':'Si','largo':'100','largoweb':'3','saltoweb':'','posicionweb':zona,'posicionConsulta':p_max, 'Visible':'Y', 'Eliminable':'Y'}
        db.crear_camposxestructura(t_pkmodulo, new_pkcampo[0]['PkCampo'], fuente ,t_pkestructura, t_dataX )
    else:
        db.crear_camposxestructura(t_pkmodulo, new_pkcampo[0]['PkCampo'], fuente ,t_pkestructura, t_dataX )

    tipo_columna = 'Texto'
    t_adicional = ''
    if fuente == 'cmpoperacion':
        t_adicional = t_dataCampo['Decimales']
        tipo_columna = 'Numero'
    if fuente == 'cmpformuladetalle':
        t_adicional = t_dataCampo['Condicion']
        tipo_columna = 'Numero'
        db.alter_Tabla_datos_decimal(es_nuevo, tabla_nombre, cmp_nombre, '', t_dataCampo['Condicion'])
    if fuente == 'cmpfecha':
        t_adicional = t_dataCampo['Tiempo']
        tipo_columna = 'Fecha'
    if fuente == 'cmpnumsimple':
        t_adicional = t_dataCampo['NumDecimales']
        tipo_columna = 'Numero'
        db.alter_Tabla_datos_decimal(es_nuevo, tabla_nombre, cmp_nombre, '', t_dataCampo['NumDecimales'])
    if fuente == 'cmpnumsecuencial':
        t_adicional = 0
        tipo_columna = 'Numero'

    if tipo_columna == 'Texto':
        db.alter_Tabla_datos_text(es_nuevo, tabla_nombre, cmp_nombre, cmp_nombre_viejo)

    if tipo_columna == 'Numero':
        db.alter_Tabla_datos_decimal(es_nuevo, tabla_nombre, cmp_nombre, cmp_nombre_viejo, t_adicional)

    if tipo_columna == 'Fecha':
        db.alter_Tabla_datos_fecha(es_nuevo, tabla_nombre, cmp_nombre, cmp_nombre_viejo, t_adicional)      


    return {'ok':0}

