
# -*- coding: utf-8 -*-

##from elementtree import ElementTree
#import xml.elementtree as ET2 # Python 2.5
#import xml.etree.elementtree as ET2 # Python 2.5
#import urllib2
from ast import Try
import re
from shutil import register_unpack_format
import sys
import smtplib, ssl
import re

import unicodedata
import datetime
import json
import random
from django.core.mail import EmailMessage
import os.path
import logging

logger = logging.getLogger(__name__)

# Create your views here.
from django.shortcuts import get_object_or_404, render
from django.http import Http404
from web.models import usuarios, documentos, ingresos
from django.core.exceptions import ObjectDoesNotExist
from django.core.mail import send_mail, BadHeaderError
from django.http import HttpResponse, HttpResponseRedirect
from django.core.files.storage import FileSystemStorage


from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from django.views.decorators.csrf import csrf_exempt

import web.con_db
import web.funciones_edocs
import web.electronica_ecuador
import web.firma_pdf
import web.pdf
import web.empaquetado


import sys

from dateutil import parser
from datetime import datetime

from datetime import date


def actualizar_base(request, Id_empresa):
    db = web.con_db.versiones(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    db.actualizar()

def offline_inicial(request, Id_empresa, usuario):
    db = web.con_db.offline(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 

    respuestas_pre = db.traer_respuestas_offline() # [{'Pkoffline': 2, 'PkId': '151', 'Valor': '0', 'Nombre': 'Cierre_contable', 'PkModulo': '525'}]
    estructuras_offLine = db.estructuras_offline() #modulo.Plantilla = 'Offline' [{'PkEstructura': 797, 'PkModulo': 525, 'Nombre': 'Facturacion_punto_venta', 'Descripcion': 'Facturación', 'Anulado': 'N', 'HijaDe': 0, 'X': Decimal('0.00'), 'Y': Decimal('0.00'), 'espacio': 22}]
    bases_pregargadas = {}
    for estrutura in estructuras_offLine:
        listado_cmpreferencias = db.cmpreferecnias(estrutura['PkEstructura']) # [{'PkCampo': 1294, 'Sentencia': 'Nombre', 'TablaOrigen': 'Negocio', 'ModuloOrigen': 'Negocio', 'Condicion': '', 'PkEstructura': 797, 'Nombre': 'Negocio', 'ext': 'No', 'Columnas': 'Nombre, Establecimie... Documento', 'Modo': 'Grid', 'pkmodulo_ingreso': 0, 'predeterminado': 'SRI', 'Tipo_Predeterminado': '0', 'A_acc_automatic': 'No', ...}]
        for campo in listado_cmpreferencias:
            condiciones = db.cmpreferencia_condiciones(campo['PkCampo'])    
            senten = ""
            if len(condiciones) == 0:
                senten = "select " + str(campo['Columnas']) + ' from ' +str(campo['TablaOrigen']) + ' Order by ' + str(campo['orden'])
            else:
                senten = "select " + str(campo['Columnas']) + ' from ' +str(campo['TablaOrigen']) + ' Where '
                for condicion in condiciones:
                    ## solo pega codiicones de c = V // no exister registro previo y v = v o c = c no sentido
                    if condicion['TipoA'] == 'C' and condicion['TipoB'] == 'V' or condicion['TipoA'] == 'V' and condicion['TipoB'] == 'C':
                        if condicion['Operador'] == '=':
                            senten = senten + str(condicion['ElementoA']) + ' = "' + str(condicion['ElementoB']) +'" and '
                        if condicion['Operador'] == '>':
                            senten = senten + str(condicion['ElementoA']) + ' > "' + str(condicion['ElementoB']) +'" and '
                        if condicion['Operador'] == '>=':
                            senten = senten + str(condicion['ElementoA']) + ' >= "' + str(condicion['ElementoB']) +'" and '                                
                        if condicion['Operador'] == '<':
                            senten = senten + str(condicion['ElementoA']) + ' < "' + str(condicion['ElementoB']) +'" and '
                        if condicion['Operador'] == '<=':
                            senten = senten + str(condicion['ElementoA']) + ' <= "' + str(condicion['ElementoB']) +'" and '
                        if condicion['Operador'] == '!=':
                            senten = senten + str(condicion['ElementoA']) + ' != "' + str(condicion['ElementoB']) +'" and '
                senten = senten[0:-4] + ' Order by ' + str(campo['orden'])
            campo['cmpvalor'] = db.sqltabla(senten) 
            campo['A_Select'] = campo['Columnas'].replace(' ','')
            bases_pregargadas[campo['Nombre']] = campo
    offlineResponde = []
    modulos_offline = db.traer_modulos_offline()
    for modulo in modulos_offline:
        resp = {}
        resp['pkmodulo'] = modulo['PkModulo']
        resp['data'] = consulta_erp_offline(request,Id_empresa,modulo['PkModulo'], usuario)
        offlineResponde.append(resp)

    return {'respuestas_pre':respuestas_pre,'bases_pregargadas':bases_pregargadas, 'offlineResponde':offlineResponde}


def consulta_erp_offline(request, Id_empresa, t_PkModulo, usuario):
    if request.session.has_key('conn_ip'):
        traer_camposoff = traer_campos(request, Id_empresa, t_PkModulo, -1)
        traer_campos_funciones0ff = traer_campos_funciones(request, Id_empresa, traer_camposoff, t_PkModulo)
        traer_registrooff = traer_registro(request, Id_empresa, traer_camposoff, t_PkModulo, '0')
        plantilla_pdfoff = plantilla_pdf(request, Id_empresa, t_PkModulo )
        plantilla_htmloff = plantilla_html(request, Id_empresa, t_PkModulo )
        context = traer_camposoff
        context.update({'valores_cab':traer_registrooff[0]})
        context.update({'valores_det':traer_registrooff[1]})
        context.update({'valores_subdet':traer_registrooff[2]})
        context.update({'func_cab':traer_campos_funciones0ff[0]})
        context.update({'func_det':traer_campos_funciones0ff[1]})
        context.update({'func_subdet':traer_campos_funciones0ff[2]})
        context.update({'plantilla_pdf':plantilla_pdfoff})
        
        context.update({'dev_pestalla':'0'})
        context.update({'t_pkregistro':'0'})
        acc_rapidooff = acc_rapido(request, Id_empresa, t_PkModulo, usuario)
        context.update({'acc_rapido':acc_rapidooff})
        context.update({'plantilla_html':plantilla_htmloff})
        

        context.update({'datos_edocs':0})
        context.update({'estados':0})
        return context
    


def reporte_empaquetado(request, Id_empresa, usuario, pkreporte):
    db = web.con_db.menu_reportes(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    empaquetador = web.empaquetado



    MainReprote = db.traer_reporte_html(pkreporte)
    cabeceraHtml = MainReprote[0]['CabeceraHtml']

    # cabeceraHtml = '''
    # <div align="center">
    # <img src="https://www.cerocodigo.com/media/archivos/DLM/logo.png" style="width: 50%;">
    # <h5>TYD SALUD Y BIENESTAR</h5>
    # <h2>REPORTE DE CONSULTIVOS</h2>
    # <h4>Desde el {{FechaIncio}} hasta el {{FechaFin}}</h4>
    # <h7>Consultivos Sistema: <b>{{TotalConsultivos}}</b> + Consultivos Feria: <b>{{TotalFerias}}</b></h7>
    # <h4>TOTAL CONSULTIVOS: <b>{{TotalCompleto}}</b></h4>
    # <hr>
    # </div>'''

    #cabeceraDatos= [{'tag':'FechaIncio','campo':'FechaIncio'},{'tag':'FechaFin','campo':'FechaFin'},{'tag':'TotalConsultivos','campo':'TotalConsultivos'},{'tag':'TotalFerias','campo':'TotalFerias'},{'tag':'TotalCompleto','campo':'TotalCompleto'}]
    cabeceraDatos = db.traer_reporte_html_campos(pkreporte, 'Cabecera')
    
    #detalleDatos= [{'tag':'Nombre del Paciente', 'campo':'NomPaciente', 'tipo':'normal'},{'tag':'Fecha', 'campo':'Fecha', 'tipo':'normal'},{'tag':'Tratamiento', 'campo':'Tratamiento', 'tipo':'normal'},{'cab':'Patologia', 'campo':'Patologia', 'tipo':'normal'},{'cab':'Imagen Terapia', 'campo':'Imagen', 'tipo':'imagen'},{'cab':'PDF', 'campo':'Pdf', 'tipo':'firma'}]
    detalleDatos = db.traer_reporte_html_campos(pkreporte, 'Detalle')
    

    sente_cab =  MainReprote[0]['CabeceraSenten']
    sente_det =  MainReprote[0]['DetalleSenten']
    
    variables = json.loads(request.POST.get('repvariables'))
    for x in variables:
        sente_cab = sente_cab.replace(x, "'"+ str(variables[x])+ "'")
        sente_det = sente_det.replace(x, "'"+ str(variables[x])+ "'")


    dataCab =  db.traer_sql_directo(sente_cab)
    #dataCab = [{'FechaIncio':'2022-12-01','FechaFin':'2022-12-31','TotalConsultivos':'5000','TotalFerias':'1000','TotalCompleto':'6000'}]

    dataDet =  db.traer_sql_directo(sente_det)

    # dataDet = [] # datsode l reprote
    # dataDet.append({'NomPaciente':'PAiente 1','Fecha':'2022-12-01','Tratamiento':'Tratamiento A','Patologia':'Patologia a','Imagen':'aa.jpg', 'Pdf':'media/firma/DLM_Local/PDF/Fisio699_98signedsigned.pdf'}) 
    # dataDet.append({'NomPaciente':'PAiente 2','Fecha':'2022-12-01','Tratamiento':'Tratamiento B','Patologia':'Patologia b','Imagen':'sss.jpg', 'Pdf':'media/firma/DLM_Local/PDF/Ordenes20221229231626signed.pdf'})
    # dataDet.append({'NomPaciente':'PAiente 3','Fecha':'2022-12-01','Tratamiento':'Tratamiento C','Patologia':'Patologia c','Imagen':'aa.jpg', 'Pdf':'media/firma/DLM_Local/PDF/Fisio699_98signed.pdf'})
    # dataDet.append({'NomPaciente':'PAiente 4','Fecha':'2022-12-01','Tratamiento':'Tratamiento D','Patologia':'Patologia d','Imagen':'xxx.jpg', 'Pdf':'media/firma/DLM_Local/PDF/Ordenes20221229231621.pdf'})
    adjuntosHtml = db.traer_reporte_htmlsubhtml(pkreporte)
    adjuntosdatos = {}
    for adjuntos in adjuntosHtml:
        for x in variables:
            adjuntos['senten'] = adjuntos['senten'].replace(x, "'"+ str(variables[x])+ "'")
        tempoadjuntosdatos = db.traer_sql_directo(adjuntos['senten'])
        for fila in tempoadjuntosdatos:
            adjuntosdatos[fila[adjuntos['tag']]] = fila

    archivo = empaquetador.armar_archivo(cabeceraHtml, cabeceraDatos, detalleDatos, dataCab, dataDet, Id_empresa, adjuntosHtml, adjuntosdatos)
    return {'ok':'Si','archivo':archivo}


def Notificaciones(request, Id_empresa, usuario):
    db = web.con_db.Notificaciones(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    Notis = db.NotificacionesPorUsuario(usuario)

    for Nota in Notis:
        Nota['datos'] = db.sql_traer_directo(Nota['Sentencia'])
    return {'Notis':Notis}




def menu_add_reporte(request, Id_empresa, nombre, pkmodulo, usuario):
    db = web.con_db.menu_reportes(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    reporte = db.traer_reporte_por_nombre(nombre, pkmodulo)
    if len(reporte) > 0:
        return {'resp':0, 'msg':'Reporte ya existe'}
    else:
        reporte = db.crear_reporte(nombre, pkmodulo)       
        return {'resp':1, 'reporte':reporte}


def menu_add_proceso(request, Id_empresa, nombre, tipo, cabecera, usuario):
    db = web.con_db.menu_modulos(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    procesos = db.traer_modulo_por_nombre(nombre, nombre.replace(' ','_'))
    if len(procesos) > 0:
        return {'resp':0, 'msg':'Proceso ya existe'}
    else:
        max = db.traer_procesos_max_orden(cabecera)
        if tipo == 'Reportes':
            tipo = 'Reporte'
            procesos = db.modulo_crear_modulo(nombre.replace(' ','_'), nombre, cabecera, max[0]['max'], tipo) 
            db.modulo_crear_modulo_Opciones(nombre.replace(' ','_'), nombre, cabecera, max[0]['max'], tipo) 

        else:
            procesos = db.modulo_crear_modulo(nombre.replace(' ','_'), nombre, cabecera, max[0]['max'], 'Registro') 
            db.estruc_crear_tabla(nombre.replace(' ','_')) 
            estructura = db.modulo_crear_estructura( procesos[0]['PkModulo'], nombre.replace(' ','_'), nombre, 0)
            cmp = web.con_db.cmpcampos(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
            t_data_tempo= {'ValorInicial':0,'Aumento':1,'Nombre': 'Pk'+nombre.replace(' ','_')}
            campo = cmp.crear_cmpnumsecuencial(estructura[0]['PkEstructura'], t_data_tempo)            
            t_dataX = {'Posicion':'0','Nombre':'Pk'+nombre.replace(' ','_'),'Descripcion':'Pk'+nombre,'Anulado':'N','X':'0','Y':'0','tamano':'12','estilo':'Normal','Modificable':'Si','largo':'100','largoweb':'3','saltoweb':'','posicionweb':'arriba_izq','posicionConsulta':'0', 'Visible':'N', 'Eliminable':'N'}
            cmp.crear_camposxestructura( procesos[0]['PkModulo'], campo[0]['PkCampo'], 'cmpnumsecuencial' ,estructura[0]['PkEstructura'], t_dataX )

            if tipo == 'Detalle' or tipo == 'SubDetalle':
                estructura = db.modulo_crear_estructura( procesos[0]['PkModulo'], nombre.replace(' ','_')+'Detalle', nombre+'Detalle', estructura[0]['PkEstructura'])
                db.estruc_crear_tabla(nombre.replace(' ','_')+'Detalle') 
                cmp = web.con_db.cmpcampos(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
                t_data_tempo= {'ValorInicial':0,'Aumento':1,'Nombre': 'Pk'+nombre.replace(' ','_') + 'Detalle'}
                campo = cmp.crear_cmpnumsecuencial(estructura[0]['PkEstructura'], t_data_tempo)
                cmp.crear_cmpnumsecuencial(estructura[0]['PkEstructura'], t_data_tempo)
                t_dataX = {'Posicion':'0','Nombre':'Pk'+nombre.replace(' ','_') + 'Detalle','Descripcion':'Pk'+nombre + 'Detalle','Anulado':'N','X':'0','Y':'0','tamano':'12','estilo':'Normal','Modificable':'Si','largo':'100','largoweb':'3','saltoweb':'','posicionweb':'arriba_izq','posicionConsulta':'0', 'Visible':'N', 'Eliminable':'N'}
                cmp.crear_camposxestructura( procesos[0]['PkModulo'], campo[0]['PkCampo'], 'cmpnumsecuencial' ,estructura[0]['PkEstructura'], t_dataX )

                t_data_tempo= {'ValorInicial':0,'Aumento':1,'Nombre': 'PkCabecera'}
                campo = cmp.crear_cmpnumsecuencial(estructura[0]['PkEstructura'], t_data_tempo)
                db.estruc_crear_Campo(nombre.replace(' ','_')+'Detalle', 'PkCabecera', 'Entero','')
                t_dataX = {'Posicion':'0','Nombre':'PkCabecera','Descripcion':'PkCabecera','Anulado':'N','X':'0','Y':'0','tamano':'12','estilo':'Normal','Modificable':'Si','largo':'100','largoweb':'3','saltoweb':'','posicionweb':'arriba_izq','posicionConsulta':'0', 'Visible':'N', 'Eliminable':'N'}
                cmp.crear_camposxestructura( procesos[0]['PkModulo'], campo[0]['PkCampo'], 'cmpnumsecuencial' ,estructura[0]['PkEstructura'], t_dataX )
                
            if tipo == 'SubDetalle':

                estructura = db.modulo_crear_estructura( procesos[0]['PkModulo'], nombre.replace(' ','_')+'DetalleDetalle', nombre+'DetalleDetalle',estructura[0]['PkEstructura'])
                db.estruc_crear_tabla(nombre.replace(' ','_')+'DetalleDetalle') 
                cmp = web.con_db.cmpcampos(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
                t_data_tempo= {'ValorInicial':0,'Aumento':1,'Nombre': 'Pk'+nombre.replace(' ','_') + 'DetalleDetalle'}
                campo = cmp.crear_cmpnumsecuencial(estructura[0]['PkEstructura'], t_data_tempo)            
                t_dataX = {'Posicion':'0','Nombre':'Pk'+nombre.replace(' ','_') + 'DetalleDetalle','Descripcion':'Pk'+nombre + 'DetalleDetalle','Anulado':'N','X':'0','Y':'0','tamano':'12','estilo':'Normal','Modificable':'Si','largo':'100','largoweb':'3','saltoweb':'','posicionweb':'arriba_izq','posicionConsulta':'0', 'Visible':'N', 'Eliminable':'N'}
                cmp.crear_camposxestructura( procesos[0]['PkModulo'], campo[0]['PkCampo'], 'cmpnumsecuencial' ,estructura[0]['PkEstructura'], t_dataX )

                t_data_tempo= {'ValorInicial':0,'Aumento':1,'Nombre': 'PkCabecera'}
                campo = cmp.crear_cmpnumsecuencial(estructura[0]['PkEstructura'], t_data_tempo)      
                db.estruc_crear_Campo(nombre.replace(' ','_')+'DetalleDetalle', 'PkCabecera', 'Entero','')
      
                t_dataX = {'Posicion':'0','Nombre':'PkCabecera','Descripcion':'PkCabecera','Anulado':'N','X':'0','Y':'0','tamano':'12','estilo':'Normal','Modificable':'Si','largo':'100','largoweb':'3','saltoweb':'','posicionweb':'arriba_izq','posicionConsulta':'0', 'Visible':'N', 'Eliminable':'N'}
                cmp.crear_camposxestructura( procesos[0]['PkModulo'], campo[0]['PkCampo'], 'cmpnumsecuencial' ,estructura[0]['PkEstructura'], t_dataX )
            
        dbr = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa])
        if tipo == 'Reporte':
            dbr.acc_por_mas(procesos[0]['PkModulo'], usuario,0,0,0,0, cabecera, 1)
        if tipo == 'Registro':
            dbr.acc_por_mas(procesos[0]['PkModulo'], usuario,0,0,0,0, cabecera, 1)
            dbr.acc_por_mas(procesos[0]['PkModulo'], usuario,0,0,0,0, cabecera, 2)
            dbr.acc_por_mas(procesos[0]['PkModulo'], usuario,0,0,0,0, cabecera, 3)
            dbr.acc_por_mas(procesos[0]['PkModulo'], usuario,0,0,0,0, cabecera, 4)
        return {'resp':1, 'procesos':procesos}

def menu_proceso_editar_orden(request, Id_empresa, pkmodulo1, pkmodulo2):
    db = web.con_db.menu_modulos(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    procesos = db.traer_procesos_por_codigos(pkmodulo1, pkmodulo2)
    db.traer_proceso_update('Orden', procesos[0]['PkModulo'], procesos[1]['Orden'])
    db.traer_proceso_update('Orden', procesos[1]['PkModulo'], procesos[0]['Orden'])
    return {'ok':1}

def menu_editar_atributos(request, Id_empresa, PkModGen, Icono, Nombre):
    db = web.con_db.menu_modulos(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    db.traer_sysmodulogeneral_update('icono', PkModGen, Icono)
    db.traer_sysmodulogeneral_update('Nombre', PkModGen,Nombre)
    return {'ok':1}

def menu_editar_orden(request, Id_empresa, PkModGen1, PkModGen2):
    db = web.con_db.menu_modulos(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    modulos = db.traer_sysmodulogeneral_codigos(PkModGen1, PkModGen2)
    db.traer_sysmodulogeneral_update('Orden', modulos[0]['PkModGen'], modulos[1]['Orden'])
    db.traer_sysmodulogeneral_update('Orden', modulos[1]['PkModGen'], modulos[0]['Orden'])
    return {'ok':1}


def traer_modulos_procesos(request, Id_empresa):
    db = web.con_db.menu_modulos(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    modulos = db.traer_sysmodulogeneral()
    procesos = db.traer_procesos_todos()
    return {'modulos':modulos, 'procesos':procesos}



def menu_eliminar_modulo(request, Id_empresa, PkModGen):
    db = web.con_db.menu_modulos(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    db.eliminar_modulo(PkModGen)
    return {'Resp':'ok'}

def menu_add_modulo(request, Id_empresa, nombre, icono):
    NombreConTaps = nombre.replace(' ', '_')
    db = web.con_db.menu_modulos(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    modulo = db.traer_sysmodulogeneral_por_nombre(NombreConTaps, nombre)
    if len(modulo) == 0:
        orden = db.traer_modulos_max_orden()
        if len(orden) == 0:
            max_orden = 1
        else:
            max_orden = orden[0]['max']
        db.sysmodulogeneral_crear(nombre, max_orden, icono)
        modulo = db.traer_sysmodulogeneral_por_nombre(NombreConTaps, nombre)
        return {'Resp':1,'msg':'Exito', 'nombre':nombre, 'icono':icono, 'PkModGen':modulo[0]['PkModGen']}
    else:
        return {'Resp':0,'msg':'Ya existe modulo '+ modulo[0]['Nombre'] }
    
def buscar_referencia_cabecera_enter(request, Id_empresa, fun_cab, tvalor, linea ):

    where = " "
    modo = fun_cab[0][0]["Modo"]
    columnas = fun_cab[0][0]["Columnas"]
    campo = fun_cab[0][0]["Sentencia"]
    dato = tvalor
    tabla = fun_cab[0][0]["TablaOrigen"]
    orderby = " order by pk" + fun_cab[0][0]["TablaOrigen"] + " desc "

    for a in fun_cab[1]:
        ElementoA = ""
        ElementoB = ""
        if a["TipoA"] == "R":
            ElementoA = "'" + str(linea[a["ElementoA"]]) + "'"
        if a["TipoA"] == "V":
            ElementoA = "'" + str(a["ElementoA"]) + "'"
        if a["TipoA"] == "C":
            ElementoA = "" + str(a["ElementoA"]) + ""
        if a["TipoB"] == "R":
            ElementoB = "'" + str(linea[a["ElementoB"]]) + "'"
        if a["TipoB"] == "V":
            ElementoB = "'" + str(a["ElementoB"]) + "'"
        if a["TipoB"] == "C":
            ElementoB = "" + str(a["ElementoB"]) + ""
        where = where + ElementoA + ' ' + a["Operador"] + ' ' + ElementoB + ' and '
  
    if where == " ":
        where = "" 
    else:
        where = ' and ' + where[:-4]

    cmpsenten = 'select ' + columnas + ' from ' + tabla + ' where ' + campo + ' like "' + dato + '%"' + where
    
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 

    return db.cmpbuscador_ejecutar(cmpsenten, 15)
           
           
def procesar_import_proceso(request, Id_empresa, listado, campos, campos_funciones, tabla):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    arr_final = []
    cmpref_lista = {}
    index = 0

    for linea in listado:
        dir_final = {}
        for lis_campos in campos['campos_cab']:
            if lis_campos['Nombre'] in linea:
                dir_final[lis_campos['Nombre']] = linea[lis_campos['Nombre']] 
            else:
                dir_final[lis_campos['Nombre']] = '0'
                linea[lis_campos['Nombre']] = '0'
        for lis_campos in campos['campos_cab']:
            if lis_campos['Nombre'] == 'Pk' + tabla['Nombre']:
                dir_final[lis_campos['Nombre']] = index
            if lis_campos['TablaCampo'] == 'cmpreferencia':
                if not str(lis_campos['Nombre'] + linea[lis_campos['Nombre']]) in cmpref_lista:
                    cmpref_lista[str(lis_campos['Nombre'] + linea[lis_campos['Nombre']])] = buscar_referencia_cabecera_enter(request, Id_empresa, campos_funciones[0][lis_campos['Nombre']], dir_final[lis_campos['Nombre']], dir_final)
                if len(cmpref_lista[str(lis_campos['Nombre'] + linea[lis_campos['Nombre']])]) > 0:
                    dir_final[lis_campos["Nombre"]] = cmpref_lista[str(lis_campos['Nombre'] + linea[lis_campos['Nombre']])][0][campos_funciones[0][lis_campos["Nombre"]][0][0]['Sentencia']]                    
                    for interno in campos['campos_cab']:
                        if interno["TablaCampo"] == 'cmpreferenciaadjunto':
                            if campos_funciones[0][interno["Nombre"]][0]["CampoReferencia"] == lis_campos['Nombre']:
                                dir_final[interno["Nombre"]] = cmpref_lista[str(lis_campos['Nombre'] + linea[lis_campos['Nombre']])][0][campos_funciones[0][interno["Nombre"]][0]["Sentencia"]]
            if lis_campos['TablaCampo'] == 'cmpsistema':
                if campos_funciones[0][lis_campos['Nombre']][0]['Nombre'] == 'Usuario Actual':
                    dir_final[lis_campos['Nombre']] = request.POST.getlist('usuario')[0]
                if campos_funciones[0][lis_campos['Nombre']][0]['Nombre'] == 'Fecha Actual':
                    dir_final[lis_campos['Nombre']] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

#cmpopcmultiple
#cmpfecha
#cmpoperacion
#cmpconsolidado
#cmpnumeroaletras
#cmpcondicional
        index = index + 1
        arr_final.append(dir_final)

    buenos = []
    malos = []
    index = 0
    senten_cab = []
    for z in arr_final:
        valio = False
        sentencia = "insert into `" +  tabla['Nombre'] +  "` (" 
        Vsentencia = "VALUES ("
        for i in campos['campos_cab']:
            if (i["Nombre"]) != ("Pk"+  tabla['Nombre']):            
                if i["Nombre"] in z:
                    sentencia = sentencia + "`" + i["Nombre"] + "`, "  
                    txtvalor = str(z[i["Nombre"]]).replace("'", " ")
                    txtvalor = str(txtvalor).replace("Á", "A")
                    txtvalor = str(txtvalor).replace("É", "E")
                    txtvalor = str(txtvalor).replace("Í", "I")
                    txtvalor = str(txtvalor).replace("Ó", "O")
                    txtvalor = str(txtvalor).replace("Ú", "U")
                    Vsentencia = Vsentencia + "'" + str(txtvalor) + "', "  
                else:
                    valio = True
        if valio == False:
            buenos.append(index)
            senten_cab.append( sentencia[:-2] + ") " + Vsentencia[:-2] + ")"  )
        else:
            malos.append(index)
        index = index + 1
    db = web.con_db.transsaciones(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    if db.ingreso_impot(senten_cab) == True:
        return ['si',buenos,malos]
    else:
        return ['no',buenos,malos]
def arreglo_base(request, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    logs = db.log_aut()    
    for a in logs:
        campos_cab = json.loads(str(a['sentencia']).replace('/n',''))
    return 'Si'


def acc_rapido(request, Id_empresa, pkmodulo, usuario):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    permisos = db.acc_rapido(pkmodulo, usuario)    
    permisos_lista = {'Nuevo':'No','Modificar':'No','Eliminar':'No' }
    for p in permisos:
        if p['tipo'] == '2':
            permisos_lista['Nuevo'] = 'Si'
        if p['tipo'] == '3':
            permisos_lista['Modificar'] = 'Si'
        if p['tipo'] == '4':
            permisos_lista['Eliminar'] = 'Si'
    return permisos_lista
def newrapido(request, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    permisos = db.newrapido(request.POST.getlist('pkmodulo')[0],request.POST.getlist('usuario')[0])    
    if len(permisos) > 0:
        return 'Si'
    else:
        return 'No'


def modrapido(request, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    permisos = db.modrapido(request.POST.getlist('pkmodulo')[0],request.POST.getlist('usuario')[0])    
    if len(permisos) > 0:
        return 'Si'
    else:
        return 'No'


def eliminar_error(request, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    db.eliminar_error(request.POST.getlist('tpk_modulo')[0],request.POST.getlist('tpkregistro')[0])
    return {'respuesta':'ok'}

def al_errores(request, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    all_erroes  = db.al_errores()
    return {'respuesta':'ok', 'all_erroes':all_erroes}



def pdf_ficha_tagElimnar(request, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    db.panel_grupo_track_eliminar(request.POST.getlist('t_pkpanel')[0],request.POST.getlist('t_user')[0], request.POST.getlist('t_fecha')[0] )
    return {'respuesta':'ok'}

def pdf_ficha(request, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    plan_seg  = db.traer_plantilla_pdf_seg(request.POST.getlist('t_pkpaneL_g')[0])
    for a in plan_seg:
         a['datos'] = db.traer_plantilla_pdf_valor(a['pksegmento'])
    return {'respuesta':'ok', 'plantilla':plan_seg}

def nuevo_dir_ficha_multi(request, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    pkestruc  = db.traer_estructuras_porPk(request.POST.getlist('t_pketr')[0])
    filas = json.loads(request.POST.get('filas'))
    for fila in filas:
        txt_campos = ''
        txt_vals = ''
        for a in fila:
            txt_campos = txt_campos + "`" + str(a)+ "`," 
            if str(fila[a]) == '':
                txt_vals = txt_vals + "'',"
            else:
                if str(fila[a])[0] == '@':
                    if fila[a] == '@now':
                            txt_vals = txt_vals + " now(),"      
                    if fila[a] == '@user':
                            txt_vals = txt_vals + "'" + str(request.POST.get('usuario'))+ "'," 
                    if str(fila[a])[:2] == '@@':
                        tempo_db = db.sql_traer_directo(fila[a][2:].replace('@pkreges@',str(request.POST.getlist('t_valor')[0])))
                        txt_vals = txt_vals + "'" + str(tempo_db[0]['Val'])+ "',"
                else:
                    txt_vals = txt_vals + "'" + str(fila[a])+ "',"        
        senten = "insert into `"+str(pkestruc[0]['Nombre'])+"` ("+txt_campos+"`"+str(request.POST.getlist('t_campo')[0])+"`) VALUES ("+txt_vals+" '"+str(request.POST.getlist('t_valor')[0])+"')"
        

        db.sql_directo(senten)
    return {'respuesta':'ok'}


def nuevo_dir_ficha(request, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    pkestruc  = db.traer_estructuras_porPk(request.POST.getlist('t_pketr')[0])
    v_dict_add = json.loads(request.POST.get('t_dict_add'))  
    txt_campos = ''
    txt_vals = ''
    for a in v_dict_add:
        if str(a) == '@base@':
            bases = db.traer_plantilla_pdf_bases(v_dict_add[a])
            for base in bases:
                sentenncia = str(base['senten']).replace('@now','now()')
                sentenncia = sentenncia.replace('@user',str(request.POST.getlist('usuario')[0]))
                sentenncia = sentenncia.replace('@@',request.POST.getlist('t_valor')[0])
                tempo_db = db.sql_traer_directo(sentenncia)
                for b in tempo_db:
                    for c in b:
                        if str(b[c]) != 'None':
                            txt_campos = txt_campos + "`" + str(c)+ "`," 
                            if str(b[c]) == '':
                                txt_vals = txt_vals + "'',"
                            else:
                                txt_vals = txt_vals + "'" + str(b[c])+ "',"        
        else:
            txt_campos = txt_campos + "`" + str(a)+ "`," 
            if str(v_dict_add[a]) == '':
                txt_vals = txt_vals + "'',"
            else:
                if str(v_dict_add[a])[0] == '@':
                    if v_dict_add[a] == '@now':
                            txt_vals = txt_vals + " now(),"      
                    if v_dict_add[a] == '@user':
                            txt_vals = txt_vals + "'" + str(request.POST.getlist('usuario')[0])+ "'," 
                    if str(v_dict_add[a])[:2] == '@@':
                        tempo_db = db.sql_traer_directo(v_dict_add[a][2:].replace('@pkreges@',str(request.POST.getlist('t_valor')[0])))
                        txt_vals = txt_vals + "'" + str(tempo_db[0]['Val'])+ "',"
                else:
                    txt_vals = txt_vals + "'" + str(v_dict_add[a])+ "',"        
    senten = "insert into `"+str(pkestruc[0]['Nombre'])+"` ("+txt_campos+"`"+str(request.POST.getlist('t_campo')[0])+"`) VALUES ("+txt_vals+" '"+str(request.POST.getlist('t_valor')[0])+"')"
    db.sql_directo(senten)
    return {'respuesta':'ok'}


def cambio_dir_reget(request, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    pkestruc  = db.traer_estructuras_porPk(request.POST.getlist('t_pketr')[0])
    senten = "update " + str(pkestruc[0]['Nombre']) + " set " + str(request.POST.getlist('t_campo')[0])+" = '"+ str(request.POST.getlist('t_val')[0])+"' where Pk" + str(pkestruc[0]['Nombre']) + " = "  + str(request.POST.getlist('t_pkreg')[0])
    db.sql_directo(senten)
    return {'respuesta':'ok'}



def mod_grabar_datosuser(request, Id_empresa):
    db_inter = web.con_db.inter_login_LOGIN("Mysql") 
    userDatos = db_inter.update_empresa(Id_empresa)
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    return {'ok':1}


def traer_datosuser_n(request, Id_empresa):
    db_inter = web.con_db.inter_login_LOGIN("Mysql") 
    userDatos = db_inter.traer_empresa(Id_empresa)
    return {'userDatos':userDatos}


def cmpnumsecuencial(request, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    estrucc  = db.traer_estructuras_porPk(request.POST.getlist('PkEstructura')[0])
    senten = 'select COALESCE(max('+str(request.POST.getlist('Nombre')[0])+') + '+ str(request.POST.getlist('Aumento')[0]) +',1) as "result" from ' + str(estrucc[0]['Nombre']) 
    valor = db.cmpconso_ejecutar(senten)
    return {'cmpvalor':valor[0]['result'],'tag1':request.POST.getlist('id_tag_ajax')[0]}



def validar_query(request, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    senten = 'Select '  + str(request.POST.getlist('divSelect')[0]) + ' From '  + str(request.POST.getlist('divfrom')[0]) + ' limit 1'
    val_qury  = db.validar_query(senten) 
    if val_qury == 'ok':
        return {'ok':1}
    else:
        return {'ok':0}
    



def admgrabar_pdf(request, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    pdfs  = db.lista_pdf_porpk(request.POST.getlist('te_PkPlan')[0])
    if len(pdfs) == 1:
        ##actualizar datos plantilla
        db.pdf_updateplantilla(request.POST.getlist('te_PkPlan')[0], request.POST.getlist('plan_anc')[0], request.POST.getlist('plan_alt')[0])

        ##tabladet
        tablanom = db.traer_moduloss_porPk(pdfs[0]['PkModulo'])

        ##traer segentos
        segmentospdfs = db.lista_segm_pdf_porpk(request.POST.getlist('te_PkPlan')[0]) 

        ##borrar detalle
        db.brorrar_pdsdetalles(request.POST.getlist('te_PkPlan')[0]) 
        dd_cab_eti = json.loads(request.POST.get('dd_cab_eti'))
        dd_cab_cmp = json.loads(request.POST.get('dd_cab_cmp'))
        dd_pie_eti = json.loads(request.POST.get('dd_pie_eti'))
        dd_pie_cmp = json.loads(request.POST.get('dd_pie_cmp'))
        dd_det_cmd = json.loads(request.POST.get('dd_det_cmd'))

        for a in segmentospdfs:
            if a['Tipo']=='Cabecera':
                db.pdf_updatemedidas(a['PkSegmento'], request.POST.getlist('segcab')[0])
                for aa in dd_cab_eti:
                    db.pdf_ins_plantillasetiquetas(a['PkSegmento'], aa['Nombre'], aa['X'], aa['Y'], aa['TipoLetra'], aa['Tamano'])
                for aa in dd_cab_cmp:
                    db.pdf_ins_plantillascamposcabecera(a['PkSegmento'], aa['Campo'], aa['X'], aa['Y'], aa['Tipo'], aa['Ext'], aa['limite'], aa['Tamano'])
            if a['Tipo']=='Pie':
                db.pdf_updatemedidas(a['PkSegmento'], request.POST.getlist('segpie')[0])
                for aa in dd_pie_eti:
                    db.pdf_ins_plantillasetiquetas(a['PkSegmento'], aa['Nombre'], aa['X'], aa['Y'], aa['TipoLetra'], aa['Tamano'])
                for aa in dd_pie_cmp:
                    db.pdf_ins_plantillascamposcabecera(a['PkSegmento'], aa['Campo'], aa['X'], aa['Y'], aa['Tipo'], aa['Ext'], aa['limite'], aa['Tamano'])
            if a['Tipo']=='Detalle':
                db.pdf_updatemedidas(a['PkSegmento'], request.POST.getlist('segdet')[0])
                for aa in dd_det_cmd:
                    db.pdf_ins_plantillascampos(a['PkSegmento'], aa['Cabecera'] , str(tablanom[0]['Nombre']) + "Detalle" , aa['X'], aa['Campo'], aa['Limite'], aa['Tipo'], aa['Ext'], aa['Tamano'])
    return {'ok':1}

def adm_pdf(request, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    pdfs  = db.lista_pdf(request.POST.getlist('pkmodulo')[0])
    lista_pdf = {}
    lista_campos = {}
    list_tablas = db.traer_estructuras(request.POST.getlist('pkmodulo')[0])
    indexx = 0
    for a in list_tablas:
        lista_campos[indexx] = db.traer_campos_por_pkestr(a['PkEstructura']) 
        indexx = indexx + 1
    for a in pdfs:
        lista_pdf[a['PkPlantilla']] = {}
        pdf_segm = db.lista_pdf_segmentos(a['PkPlantilla'])
        for b in pdf_segm:
            lista_pdf[a['PkPlantilla']][b['Tipo']] = {}
            lista_pdf[a['PkPlantilla']][b['Tipo']]['eti'] = db.lista_pdf_eti( b['PkSegmento'])
            lista_pdf[a['PkPlantilla']][b['Tipo']]['cmc'] = db.lista_pdf_cmbc( b['PkSegmento'])
            lista_pdf[a['PkPlantilla']][b['Tipo']]['cmd'] = db.lista_pdf_cmbd( b['PkSegmento'])  
            lista_pdf[a['PkPlantilla']][b['Tipo']]['altura'] =  b['AlturaInicial']  
    return {'pdfs':pdfs, 'lista_pdf':lista_pdf, 'lista_campos': lista_campos}


def adm_estados_cond(request, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    list_estados  = db.lista_estados_pk(request.POST.getlist('t_pkestado')[0])
    list_condi = db.lista_estados_condicion(request.POST.getlist('t_pkestado')[0])
    list_usuario = db.carga_list_user_completa()
    return {'list_estados':list_estados, 'list_condi':list_condi, 'list_usuario':list_usuario}

def adm_estados_actualizar(request, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    if request.POST.getlist('modo')[0] == '0': #delete
        db.estado_borrar(request.POST.getlist('t_pkestado')[0])        
    if request.POST.getlist('modo')[0] == '1': #update
        db.estado_actualziar(request.POST.getlist('t_pkestado')[0], request.POST.getlist('t_estado_display')[0], request.POST.getlist('t_estado_estado_inicial')[0], request.POST.getlist('t_estado_estado_final')[0], request.POST.getlist('t_estado_color')[0], request.POST.getlist('t_estado_usuarios')[0])     
    return {'t_pkestado':request.POST.getlist('t_pkestado')[0],'t_PkModulo':request.POST.getlist('t_PkModulo')[0],'temp_pestalla':request.POST.getlist('temp_pestalla')[0]}


def adm_estados_nuevo(request, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    list_modulo = db.traer_moduloss_porPk(request.POST.getlist('t_PkModulo')[0])
    ultimo_estado = db.estados_nuevo(request.POST.getlist('t_PkModulo')[0], 'Pk'+ str(list_modulo[0]['Nombre']))
    return {'ultimo_estado':ultimo_estado,'t_PkModulo':request.POST.getlist('t_PkModulo')[0],'temp_pestalla':request.POST.getlist('temp_pestalla')[0]}

def adm_estados(request, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    list_estados  = db.lista_estados(request.POST.getlist('pkmodulo')[0])
    return {'list_estados':list_estados}

def eliminar(request, Id_empresa, pkmodulo, pkregistro): 
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    db.eliminar(pkmodulo, pkregistro, request.POST.getlist('usuario')[0])

@csrf_exempt
def filtro(request, Id_empresa): 
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    #campos_cab = json.loads(request.POST.get('campos')) t_PkEstructura
    campos_cab = db.traer_campos_por_pkestr_solo_visible_orden_consuWeb(request.POST.get('t_PkEstructura')) 
    sentencia_where = ''
    sentencia_select = ''
    #valore_filtro = request.POST.getlist('v_where_valor')[0].split(",")
    valore_filtro = re.split(';|,| ', request.POST.getlist('v_where_valor')[0])

    if request.POST.getlist('v_campo')[0] == 'Todos':
        for xx in valore_filtro:
            sentencia_select = ''
            sentencia_where = sentencia_where + '('
            for a in campos_cab:
                sentencia_where = sentencia_where + ' ' +  a['Nombre'].strip() + " like '%" + xx + "%' or"
                sentencia_select = sentencia_select + '' + a['Nombre'].strip() + ', '
            sentencia_where = sentencia_where[:-2] + ') and '
        sentencia_where = sentencia_where[:-4]
    else:
        for xx in valore_filtro:
            sentencia_select = ''
            sentencia_where = sentencia_where + '('
            sentencia_where = sentencia_where + ' ' +  request.POST.getlist('v_campo')[0] + " like '%" + xx + "%' or"
            for a in campos_cab:
                sentencia_select = sentencia_select + '' + a['Nombre'].strip() + ', '
            sentencia_where = sentencia_where[:-2] + ') and '
        sentencia_where = sentencia_where[:-4]
    sentencia_select = sentencia_select[:-2]
    dbdatos  = db.filtro_senten( sentencia_select, request.POST.getlist('v_tabla')[0], sentencia_where, request.POST.getlist('v_top')[0])
    context = {'dbdatos':dbdatos, 'pestana_int':request.POST.getlist('pestana_int')[0]}
    return context


@csrf_exempt
def grabar_files(request, Id_empresa): 
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    respuesta  = db.filtro( request.POST.getlist('v_senten')[0], request.POST.getlist('v_where_campo')[0] , request.POST.getlist('v_where_valor')[0], request.POST.getlist('v_top')[0])
    db_inter = web.con_db.inter_login_LOGIN("Mysql") 
    idioma_html = db_inter.traer_platilla('registro',request.POST.getlist('idioma')[0])
    context = {'tablaDescripcion':request.POST.getlist('tablaDescripcion')[0], 'pestana_int':request.POST.getlist('pestana_int')[0],'PkModulo':request.POST.getlist('PkModulo')[0], 'sentencia_inicial':request.POST.getlist('v_senten')[0], 'idioma_html':idioma_html, 'names' :respuesta[0], 'dictlist' :respuesta[1], 'modifica':request.POST.getlist('modifica')[0], 'eliminar':request.POST.getlist('eliminar')[0]}
    return context



def traer_registro(request, Id_empresa, campos, pkmodulo, pkregistro):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    tablas  = db.tablas(pkmodulo)
    valores = db.valores(pkregistro, tablas, campos)
    valores_cab = valores[0]
    valores_det = 0
    valores_subdet = 0
    if len(valores) > 1:
        valores_det = valores[1]
    if len(valores) > 2:
        valores_subdet = valores[2]
    return [ valores_cab, valores_det,valores_subdet]



def traer_rapido(request, Id_empresa, campos):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    tablas  = db.tablas(request.POST.getlist('pkmodulo')[0])
    valores = db.valores(request.POST.getlist('pkregistro')[0], tablas, campos)
    valores_cab = valores[0]
    valores_det = 0
    valores_subdet = 0
    if len(valores) > 1:
        valores_det = valores[1]
    if len(valores) > 2:
        valores_subdet = valores[2]
    return [ valores_cab, valores_det,valores_subdet]

def traer_registro_desde_panel_directo(request, Id_empresa, senten):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    valores_cab = db.sql_traer_directo(senten)
    return [ valores_cab]

def traer_estados_desde_panel_directo(request, Id_empresa, int_pkmodulo):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    estados_cab = db.sql_traer_directo("select * FROM web_estados_doc where PkModulo = " + str(int_pkmodulo))
    return [estados_cab]

def traer_registro_desde_panel(request, Id_empresa, campos, candiciones):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    tablas  = db.tablas(request.POST.getlist('pkmodulo')[0])
    valores = db.valores_codniones(tablas, campos, candiciones, request.POST.getlist('usuario')[0])
    valores_cab = valores[0]
    return [ valores_cab]

def acc_por_esp(request, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    db.acc_por_mas_del(request.POST.getlist('user_acc')[0],request.POST.getlist('PkModulo')[0],request.POST.getlist('user_tipo')[0])
    if request.POST.getlist('user_acc_val')[0]== 'true':
        db.acc_por_mas(request.POST.getlist('PkModulo')[0], request.POST.getlist('user_acc')[0],0,0,0,0,request.POST.getlist('user_pkcabecera')[0],request.POST.getlist('user_tipo')[0])
    return {'user_acc_val':request.POST.getlist('user_acc_val')[0], 'id':request.POST.getlist('id')[0]}

def acc_por_mas(request, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    lista_modulos = db.traer_modulos_por_cab(request.POST.getlist('user_pkcabecera')[0])
    for modul in lista_modulos:
        db.acc_por_mas_del(request.POST.getlist('user_acc')[0],modul['PkModulo'],request.POST.getlist('user_tipo')[0])
        if request.POST.getlist('user_acc_val')[0]== 'true':
            db.acc_por_mas(modul['PkModulo'], request.POST.getlist('user_acc')[0],0,0,0,0,request.POST.getlist('user_pkcabecera')[0],request.POST.getlist('user_tipo')[0])
    return {'user_acc_val':request.POST.getlist('user_acc_val')[0], 'id':request.POST.getlist('id')[0]}

def traer_registro_estados(request, Id_empresa, campos):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    estados = db.t_estados(request.POST.getlist('pkmodulo')[0],request.POST.getlist('usuario')[0])
    for estado in estados:
        estado['variables'] = db.t_estadosVariables(estado['pkweb_estados_doc'])
    return estados



def plantilla_html(request, Id_empresa, PkModulo):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    plantillashtml = db.plantillasMainhtml(PkModulo)
    for plantilla in plantillashtml:
        plantilla['CamposCab'] = db.plantillashtmlCampos(plantilla['PkPlantilla'], 'Cabecera')
        plantilla['CamposDet'] = db.plantillashtmlCampos(plantilla['PkPlantilla'], 'Detalle')
    return plantillashtml
    


def plantilla_pdf(request, Id_empresa, PkModulo):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    plantillasMain = db.plantillasMain(PkModulo)
    plantillassegmentos = {}
    plantillascampos = {}
    plantillascampos3nivel = {}
    plantillascamposcabecera = {}
    plantillascondiciones = {}
    plantillasetiquetas = {}
    firma = web.firma_pdf 
    plantillasfirmas = 'No'
    for main in plantillasMain:
        if main['Fuente'] == 'Firma':
            plantillasfirmas = 'Si'
        plantillassegmentos.update({main["PkPlantilla"]:db.plantillassegmentos(main["PkPlantilla"])})
        plantillascondiciones.update({main["PkPlantilla"]:db.plantillascondiciones(main["PkPlantilla"])})
        for seg in plantillassegmentos[main["PkPlantilla"]]:
            plantillascampos.update({seg["PkSegmento"]:db.plantillascampos(seg["PkSegmento"])})
            plantillascampos3nivel.update({seg["PkSegmento"]:db.plantillascampos3nivel(seg["PkSegmento"])})
            plantillascamposcabecera.update({seg["PkSegmento"]:db.plantillascamposcabecera(seg["PkSegmento"])})
            plantillasetiquetas.update({seg["PkSegmento"]:db.plantillasetiquetas(seg["PkSegmento"])})
    return {'plantillasfirmas':plantillasfirmas,'plantillasMain':plantillasMain,'plantillassegmentos':plantillassegmentos,'plantillascampos':plantillascampos,'plantillascampos3nivel':plantillascampos3nivel,'plantillascamposcabecera':plantillascamposcabecera,'plantillascondiciones':plantillascondiciones,'plantillasetiquetas':plantillasetiquetas}

def consolidado(request, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    print(request.POST.getlist('cmpsenten')[0])
    cmpvalor = db.cmpconso_ejecutar(request.POST.getlist('cmpsenten')[0])
    return {'cmpvalor':cmpvalor, 'tag1': request.POST.getlist('tag1')[0], 'tag2': request.POST.getlist('tag2')[0]}

def ejectur_senten_campo(request, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    cmpvalor = db.cmpconso_ejecutar(request.POST.getlist('cmpsenten')[0])
    return {'cmpvalor':cmpvalor}

def get_max(request, campo, tabla, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    cmpvalor = db.cmpconso_ejecutar("select if((max(" + campo + ")+ 1) is Null,1,(max(" + campo + ")+ 1)) as 'valor' from " + tabla  )
    return cmpvalor[0]["valor"]

def actualizar_max(request, campo, tabla, valor, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    db.solo_ejecutar('update estructura, cmpnumsecuencial set cmpnumsecuencial.ValorInicial = "' + str(valor) + '" where estructura.PkEstructura = cmpnumsecuencial.PkEstructura and  estructura.Nombre like "' + str(tabla) + '" and cmpnumsecuencial.Nombre like "' + str(campo) + '"')




def guardar_base(request, Id_empresa):
    #for a in request.files:
    #ingreso_cab = json.loads(request.POST.get('array_cab'))
    #ingreso_det = json.loads(request.POST.get('array_det'))
    campos_cab = json.loads(request.POST.get('campos_cab'))
    campos_det = json.loads(request.POST.get('campos_det'))
    campos_subdet = json.loads(request.POST.get('campos_subdet'))
    envio_datset = json.loads(request.POST.get('envio_datset'))
    tablaDatos = json.loads(request.POST.get('tablaDatos'))
    senten_cab = []
    senten_det = []
    senten_subdet = []
    pk_cab = 0
    paso = True
    msg = {}
    num_det = 0

    if request.POST.getlist('disparador')[0] == "Modificar Registro":
        for z in envio_datset[request.POST.getlist('nom_tabla')[0]]:
            sentencia = "Update " + request.POST.getlist('nom_tabla')[0] + " set " 
            for i in campos_cab:
                try:
                    sentencia = sentencia + " " + i["Nombre"] + " = '"  + str(z[i["Nombre"]]).replace("'", " ") + "', "
                except KeyError:
                    pass
            pk_cabecera = z["Pk"+ request.POST.getlist('nom_tabla')[0]]
            senten_cab.append( sentencia[:-2] + " where Pk" + request.POST.getlist('nom_tabla')[0] + " = '" + pk_cabecera + "'" )
        num_det = 0
        if len(envio_datset) >1:
            if len(envio_datset[request.POST.getlist('nom_tabla')[0] + "Detalle"])>0:
                fila_int = 0

                pk_detalle = get_max(request, ("Pk"+ request.POST.getlist('nom_tabla')[0] + "Detalle"), request.POST.getlist('nom_tabla')[0] + "Detalle", Id_empresa)
                senten_det.append("delete from " + request.POST.getlist('nom_tabla')[0] + "detalle where PKCabecera = '" + pk_cabecera + "'")
            for z in envio_datset[request.POST.getlist('nom_tabla')[0] + "Detalle"]:
                fila_int = fila_int +1
                sentencia = "insert into `" + request.POST.getlist('nom_tabla')[0] +  "Detalle` (" 
                Vsentencia = "VALUES ("
                for i in campos_det:
                    if i["TablaCampo"] == "cmpnumsecuencial":
                        #if ((i["Nombre"]) == ("Pk"+ request.POST.getlist('nom_tabla')[0] + "Detalle")):
                        #    z[i["Nombre"]] = pk_detalle + num_det
                        if ((i["Nombre"]) == ("PKCabecera")):
                            z[i["Nombre"]] = pk_cabecera
                        else:
                            if not((i["Nombre"]) == ("Pk"+ request.POST.getlist('nom_tabla')[0] + "Detalle")):
                                z[i["Nombre"]] = fila_int


                    if ((i["Nombre"]) != ("Pk"+ request.POST.getlist('nom_tabla')[0] + "Detalle")):
                        sentencia = sentencia + "`" + i["Nombre"] + "`, "  
                        txtvalor = str(z[i["Nombre"]]).replace("'", " ")
                        txtvalor = str(txtvalor).replace("Á", "A")
                        txtvalor = str(txtvalor).replace("É", "E")
                        txtvalor = str(txtvalor).replace("Í", "I")
                        txtvalor = str(txtvalor).replace("Ó", "O")
                        txtvalor = str(txtvalor).replace("Ú", "U")
                        Vsentencia = Vsentencia + "'" + str(txtvalor) + "', " 
                senten_det.append( sentencia[:-2] + ") " + Vsentencia[:-2] + ")"  )

                if len(envio_datset) >2:
                    if len(envio_datset[request.POST.getlist('nom_tabla')[0] + "DetalleDetalle"])>0:
                        pk_detalleSub = get_max(request, ("Pk"+ request.POST.getlist('nom_tabla')[0] + "DetalleDetalle"), request.POST.getlist('nom_tabla')[0] + "DetalleDetalle", Id_empresa)
                        for z2 in envio_datset[request.POST.getlist('nom_tabla')[0] + "DetalleDetalle"]:
                            sentencia = "insert into `" + request.POST.getlist('nom_tabla')[0] +  "DetalleDetalle` (" 
                            Vsentencia = "VALUES ("
                            if z2['PKCabecera'] == z["Pk"+ request.POST.getlist('nom_tabla')[0] + "Detalle"]:
                                for i2 in campos_subdet:
                                    if i2["TablaCampo"] == "cmpnumsecuencial":
                                        #if ((i["Nombre"]) == ("Pk"+ request.POST.getlist('nom_tabla')[0] + "Detalle")):
                                        #    z[i["Nombre"]] = pk_detalle + num_det
                                        if ((i2["Nombre"]) == ("PKCabecera")):
                                            z2[i2["Nombre"]] = pk_detalle + num_det
                                    if ((i2["Nombre"]) != ("Pk"+ request.POST.getlist('nom_tabla')[0] + "DetalleDetalle")):
                                        sentencia = sentencia + "`" + i2["Nombre"] + "`, "  
                                        txtvalor = str(z2[i2["Nombre"]]).replace("'", " ")
                                        txtvalor = str(txtvalor).replace("Á", "A")
                                        txtvalor = str(txtvalor).replace("É", "E")
                                        txtvalor = str(txtvalor).replace("Í", "I")
                                        txtvalor = str(txtvalor).replace("Ó", "O")
                                        txtvalor = str(txtvalor).replace("Ú", "U")
                                        Vsentencia = Vsentencia + "'" + str(txtvalor) + "', " 
                                senten_subdet.append( sentencia[:-2] + ") " + Vsentencia[:-2] + ")"  )
                num_det = num_det + 1
    if request.POST.getlist('disparador')[0] == "Guardar Registro Nuevo":
        pk_cabecera = get_max(request, ("Pk"+ request.POST.getlist('nom_tabla')[0]), request.POST.getlist('nom_tabla')[0], Id_empresa)
        if (request.POST.getlist('campos_det')[0] != "0"):          
            pk_detalle = get_max(request, ("Pk"+ request.POST.getlist('nom_tabla')[0] + "Detalle"), request.POST.getlist('nom_tabla')[0] + "Detalle", Id_empresa)
        if (request.POST.getlist('campos_subdet')[0] != "0"):          
            pk_subdetalle = get_max(request, ("Pk"+ request.POST.getlist('nom_tabla')[0] + "DetalleDetalle"), request.POST.getlist('nom_tabla')[0] + "DetalleDetalle", Id_empresa)
        for z in envio_datset[request.POST.getlist('nom_tabla')[0]]:
            db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa])             
            sentencia = "insert into `" + request.POST.getlist('nom_tabla')[0] +  "` (" 
            Vsentencia = "VALUES ("
            for i in campos_cab:
                if i["TablaCampo"] == "cmpnumsecuencial":
                    if ((i["Nombre"]) == ("Pk"+ request.POST.getlist('nom_tabla')[0])):
                        z[i["Nombre"]] = pk_cabecera
                    else:
                        z[i["Nombre"]] = get_max(request, (i["Nombre"]), request.POST.getlist('nom_tabla')[0], Id_empresa)
                        actualizar_max(request, (i["Nombre"]), request.POST.getlist('nom_tabla')[0], z[i["Nombre"]], Id_empresa)
                if i["TablaCampo"] == "cmpconsolidado":
                    pass

                sentencia = sentencia + "`" + i["Nombre"] + "`, "  
                txtvalor = str(z[i["Nombre"]]).replace("'", " ")
                txtvalor = str(txtvalor).replace("Á", "A")
                txtvalor = str(txtvalor).replace("É", "E")
                txtvalor = str(txtvalor).replace("Í", "I")
                txtvalor = str(txtvalor).replace("Ó", "O")
                txtvalor = str(txtvalor).replace("Ú", "U")
                Vsentencia = Vsentencia + "'" + str(txtvalor) + "', "  
            senten_cab.append( sentencia[:-2] + ") " + Vsentencia[:-2] + ")"  )
        num_det = 0
        num_subdet = 0
        pkkabecera_subdetalle = 0
        if request.POST.getlist('tiene_detalle')[0] == 'Si':
            fila_int = 0
            #BTN!
            
           
            for z in envio_datset[request.POST.getlist('nom_tabla')[0] + "Detalle"]:
                fila_int = fila_int + 1
                sentencia = "insert into `" + request.POST.getlist('nom_tabla')[0] +  "Detalle` (" 
                Vsentencia = "VALUES ("
                for i in campos_det:
                    if i["TablaCampo"] == "cmpnumsecuencial":
                        if ((i["Nombre"]) == ("Pk"+ request.POST.getlist('nom_tabla')[0] + "Detalle")):
                            pkkabecera_subdetalle = z[i["Nombre"]]
                            z[i["Nombre"]] = pk_detalle + num_det
                        else:
                            if ((i["Nombre"]) == ("PKCabecera")):
                                z[i["Nombre"]] = pk_cabecera
                            else:
                                z[i["Nombre"]] = fila_int

                    sentencia = sentencia + "`" + i["Nombre"] + "`, "  
                    txtvalor = str(z[i["Nombre"]]).replace("'", " ")
                    txtvalor = str(txtvalor).replace("Á", "A")
                    txtvalor = str(txtvalor).replace("É", "E")
                    txtvalor = str(txtvalor).replace("Í", "I")
                    txtvalor = str(txtvalor).replace("Ó", "O")
                    txtvalor = str(txtvalor).replace("Ú", "U")
                    Vsentencia = Vsentencia + "'" + str(txtvalor) + "', "  
                senten_det.append( sentencia[:-2] + ") " + Vsentencia[:-2] + ")"  )

                if request.POST.getlist('tiene_subdetalle')[0] == 'Si':
                    for zz in envio_datset[request.POST.getlist('nom_tabla')[0] + "DetalleDetalle"]:
                        if pkkabecera_subdetalle == zz["PKCabecera"]:
                            sentencia = "insert into `" + request.POST.getlist('nom_tabla')[0] +  "DetalleDetalle` (" 
                            Vsentencia = "VALUES ("
                            for ii in campos_subdet:
                                if ii["TablaCampo"] == "cmpnumsecuencial":
                                    if ((ii["Nombre"]) == ("Pk"+ request.POST.getlist('nom_tabla')[0] + "DetalleDetalle")):
                                        zz[ii["Nombre"]] = pk_subdetalle + num_subdet
                                    if ((ii["Nombre"]) == ("PKCabecera")):
                                        zz[ii["Nombre"]] = z["Pk"+ request.POST.getlist('nom_tabla')[0] + "Detalle"]
                                sentencia = sentencia + "`" + ii["Nombre"] + "`, "  
                                txtvalor = str(zz[ii["Nombre"]]).replace("'", " ")
                                txtvalor = str(txtvalor).replace("Á", "A")
                                txtvalor = str(txtvalor).replace("É", "E")
                                txtvalor = str(txtvalor).replace("Í", "I")
                                txtvalor = str(txtvalor).replace("Ó", "O")
                                txtvalor = str(txtvalor).replace("Ú", "U")
                                Vsentencia = Vsentencia + "'" + str(txtvalor) + "', "  
                            senten_subdet.append( sentencia[:-2] + ") " + Vsentencia[:-2] + ")"  )
                            num_subdet = num_subdet + 1
                num_det = num_det + 1
    if paso == True:
        senten_acc = EjecutarAcciones(request, Id_empresa, request.POST.getlist('pkmodulo')[0], request.POST.getlist('disparador')[0], envio_datset,{})  
        db = web.con_db.transsaciones(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
        graboTodo =db.ingreso_base(senten_cab, senten_det, senten_acc, request.POST.getlist('pkmodulo')[0], senten_subdet)
        if graboTodo[0] == True:
            db = web.con_db.transsaciones(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
            senten_acc = EjecutarAcciones(request, Id_empresa, request.POST.getlist('pkmodulo')[0], "Post " + str(request.POST.getlist('disparador')[0]), envio_datset,{})  
            db.ingreso_post(senten_acc, request.POST.getlist('pkmodulo')[0])
            db.auditoria_ingresar(envio_datset, request.POST.getlist('usuario')[0], request.POST.getlist('disparador')[0])
            for ax in senten_acc:
                db.auditoria_ingresar(ax, request.POST.getlist('usuario')[0], request.POST.getlist('disparador')[0])

            context = {'grabo':True, 'pkmodulo':request.POST.getlist('pkmodulo')[0], 'pkregistro':pk_cabecera, 'pestalla':request.POST.getlist('pestalla')[0] }
            return context
        else:
            context = {'grabo':False, 'msg':{'Error':graboTodo[1]}}
            return context
    else:
        context = {'grabo':False, 'msg':{'Error':graboTodo[1]}}
        return context

def validar_condiciones(request, Id_empresa, v_PkAccion, cabecera):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    datosCabecera = db.TraerAccionescondiciones(v_PkAccion)
    for a in datosCabecera:
        if str(cabecera[request.POST.getlist('nom_tabla')[0]][0][a['ElementoA']]) != str(a['ElementoB']):
            return False  
    return True

            
def EjecutarAcciones(request, Id_empresa, pkmodulo, disparador, envio_datset, IngVariables):
     
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    datosCabecera = db.TraerAccionesCabecera(pkmodulo)
    senten_acc = []
    rowcount = {}
    tabla_cab = ''
    for z in datosCabecera:
        if z["Disparador"] == disparador:
            if z["Accion"] == "Insertar":
                for a in envio_datset:
                    tabla_cab = a
                    break
                if validar_condiciones(request, Id_empresa, z["PkAccion"], envio_datset) == True:
                    datasetIngreso = []
                    listado_tablas = db.ListadoTablas(z["ModuloAfectado"])
                    listado_campos = {}
                    dict_pk_nombre_tabla = {}
                    valores_pk = {}
                    tabla_primaria = ""
                    for y in listado_tablas:
                        Pa_ingre_campos = db.traer_campos_por_pkestr(y["PkEstructura"])
                        listado_campos.update({y["PkEstructura"]:Pa_ingre_campos})
                        rowcount.update({y["PkEstructura"]:0})
                        dict_pk_nombre_tabla.update({y["PkEstructura"]:y["Nombre"]})

                        sentencia_int = 'select max( cast( Pk' + str(y["Nombre"]) + '  as decimal(12,0)) )+1 as "pkmax"  from ' + str(y["Nombre"])                        
                        dict_tempo = db.cmpconso_ejecutar(sentencia_int)
                        if dict_tempo[0]['pkmax'] == None:
                            valores_pk.update({'Pk' + str(y["Nombre"]) :0})
                        else:
                            valores_pk.update({'Pk' + str(y["Nombre"]) :dict_tempo[0]['pkmax']})
                        
                        if tabla_primaria == "":
                            tabla_primaria = y["Nombre"]

                    #datosRegistros = db.TraerAccionesNumeroRegistrosCabeceras(z["PkAccion"])
                    datosRegistros = db.TraerAccionesNumeroRegistros(z["PkAccion"])
                    #BTN!
                    obj_tablas  = db.tablas(z["ModuloAfectado"])
                    obj_campos = db.campos(obj_tablas)
                    obj_funciones_campos = db.funciones_campos_dict_pkestruc(obj_tablas, obj_campos)
                    #----------------nueva forma mas sensilla
                    dataset_ingresar = {}
                    accionescampos = {}
                    


                    for y in datosRegistros:
                        datos = db.TraerAccionesCampos(y["PkAccionL2"])
                        accionescampos.update({y["PkAccionL2"]:datos})

                    datos_indices_truchos = {}

                    for y in datosRegistros:
                        if y["SeREpite"] =="No":
                            tempo_ingre={}
                            for yy in listado_campos[y["PkEstructura"]]:
                                tempo_ingre.update({yy["Nombre"]:0})
                            for yy in accionescampos[y["PkAccionL2"]]:
                                if yy["Tipo"] == "Valor":
                                    if yy["Campo"] == ('Pk' + str(dict_pk_nombre_tabla[y["PkEstructura"]])):
                                        valores_pk[yy["Campo"]] = (valores_pk[yy["Campo"]]) + 1 + int(yy["Elemento"]) 
                                        tempo_ingre[yy["Campo"]] = valores_pk[yy["Campo"]] 
                                    else:
                                        tempo_ingre[yy["Campo"]] = yy["Elemento"]
                                if yy["Tipo"] == "Campo":
                                    tempo_ingre[yy["Campo"]] = envio_datset[yy["Tabla"]][0][yy["Elemento"]] 
                                if yy["Tipo"] == "Cabecera":
                                    tempo_ingre[yy["Campo"]] = envio_datset[tabla_cab][0][yy["Elemento"]] 
                                if yy["Tipo"] == "Auto":
                                        if yy["Campo"] == 'PKCabecera':
                                            tempo_ingre[yy["Campo"]] = valores_pk["Pk" + tabla_primaria]
                                        else:
                                            if yy["Campo"] == ('Pk' + str(dict_pk_nombre_tabla[y["PkEstructura"]])):
                                                valores_pk[yy["Campo"]] = (valores_pk[yy["Campo"]]) + 1 
                                                tempo_ingre[yy["Campo"]] = valores_pk[yy["Campo"]]
                                            else:
                                                sentencia_int = 'select max( cast( ' + str(yy["Campo"]) + '  as decimal(12,0)) )+1 as "' + str(yy["Campo"]) + '"  from ' + str(dict_pk_nombre_tabla[y["PkEstructura"]])
                                                tempo_valor = db.cmpconso_ejecutar(sentencia_int)
                                                if tempo_valor[0][yy["Campo"]] != None:
                                                    tempo_ingre[yy["Campo"]] = tempo_valor[0][yy["Campo"]]
                                                else:
                                                    tempo_ingre[yy["Campo"]] = 0
                                dataset_ingresar.update({y["PkAccionL2"]:[tempo_ingre]})
                        if y["SeREpite"] =="Tb":
                            tempo_ingre1 = []
                            for xxx in envio_datset[y["TablaRepetir"]]:                            
                                tempo_ingre={}
                                for yy in listado_campos[y["PkEstructura"]]:
                                    tempo_ingre.update({yy["Nombre"] : 0})
                                for yy in accionescampos[y["PkAccionL2"]]:
                                    if yy["Tipo"] == "Valor":
                                        tempo_ingre[yy["Campo"]] = yy["Elemento"]
                                    if yy["Tipo"] == "Campo":
                                        tempo_ingre[yy["Campo"]] = xxx[yy["Elemento"]]
                                    if yy["Tipo"] == "Cabecera":
                                        tempo_ingre[yy["Campo"]] = envio_datset[tabla_cab][0][yy["Elemento"]]
                                    if yy["Tipo"] == "Auto":
                                        if yy["Campo"] == 'PKCabecera':
                                            ##tempo_ingre[yy["Campo"]] = valores_pk["Pk" + tabla_primaria]
                                            Nom_put_tabla =''
                                            for hh in datosRegistros:
                                                if hh['PkAccionL2'] == y['PkCabecera']:
                                                    repetuche = hh['TablaRepetir']
                                                    for hh2 in obj_tablas:
                                                        if hh2['PkEstructura'] == hh['PkEstructura']:
                                                            Nom_put_tabla = hh2['Nombre']
                                                            break
                                            if y['PkCabecera'] in dataset_ingresar:
                                                if len(dataset_ingresar[y['PkCabecera']])== 1:
                                                    tempo_ingre[yy["Campo"]] = dataset_ingresar[y['PkCabecera']][0]['Pk' +Nom_put_tabla]
                                                else:
                                                    indice_trucho = 0
                                                    for hh in envio_datset[repetuche]:
                                                        if hh['Pk'+repetuche] == xxx['PKCabecera']:
                                                            tempo_ingre[yy["Campo"]] = dataset_ingresar[y['PkCabecera']][indice_trucho]['Pk' +Nom_put_tabla]
                                                            break
                                                        indice_trucho = indice_trucho + 1
                                            else:
                                                tempo_ingre[yy["Campo"]] = valores_pk["Pk" + tabla_primaria]
                                        else:
                                            if yy["Campo"] == ('Pk' + str(dict_pk_nombre_tabla[y["PkEstructura"]])):
                                                valores_pk[yy["Campo"]] = (valores_pk[yy["Campo"]]) + 1 
                                                tempo_ingre[yy["Campo"]] = valores_pk[yy["Campo"]]
                                            else:
                                                sentencia_int = 'select max( cast( ' + str(yy["Campo"]) + '  as decimal(12,0)) )+1 as "' + str(yy["Campo"]) + '"  from ' + str(dict_pk_nombre_tabla[y["PkEstructura"]])
                                                tempo_valor = db.cmpconso_ejecutar(sentencia_int)
                                                if tempo_valor[0][yy["Campo"]] == None:
                                                    tempo_ingre[yy["Campo"]] = 0
                                                else:
                                                    tempo_ingre[yy["Campo"]] = tempo_valor[0][yy["Campo"]]
                                    
                                tempo_ingre1.append(tempo_ingre)
                            dataset_ingresar.update({y["PkAccionL2"]:tempo_ingre1})
                        if y["SeREpite"] =="Qr":
                            tempo_ingre1 = []
                            data_query = Acc_TraerDataTable(request, Id_empresa, envio_datset, y["TablaRepetir"], 0)
                            for xxx in data_query:                         
                                tempo_ingre={}
                                for yy in listado_campos[y["PkEstructura"]]:
                                    tempo_ingre.update({yy["Nombre"] : 0})
                                for yy in accionescampos[y["PkAccionL2"]]:
                                    if yy["Tipo"] == "Valor":
                                        tempo_ingre[yy["Campo"]] = yy["Elemento"]
                                    if yy["Tipo"] == "Query":
                                        tempo_ingre[yy["Campo"]] = xxx[yy["Elemento"]] 
                                    if yy["Tipo"] == "Cabecera":
                                        tempo_ingre[yy["Campo"]] = envio_datset[tabla_cab][0][yy["Elemento"]] 
                                    if yy["Tipo"] == "QueryEjecutar":
                                        divi = str(xxx[yy["Elemento"]]).split('$')
                                        qr_var = str(divi[0]).split(',')
                                        qr_sente = str(divi[1]).split('&')
                                        paraejecutar = 'select ' + str(qr_sente[0]) + ' as "resul" from ' + str(qr_sente[1]) + ' where ' + str(qr_sente[2])
                                        for a in qr_var:
                                            qr_var_indi = a.split(':')
                                            paraejecutar = paraejecutar.replace(qr_var_indi[0],  envio_datset[yy["Tabla"]][0][qr_var_indi[1]] )
                                        tempo_ingre[yy["Campo"]] = db.cmpconso_ejecutar(paraejecutar)[0]['resul']
                                    if yy["Tipo"] == "Auto":
                                        if yy["Campo"] == 'PKCabecera':
                                            tempo_ingre[yy["Campo"]] = valores_pk["Pk" + tabla_primaria]
                                        else:
                                            if yy["Campo"] == ('Pk' + str(dict_pk_nombre_tabla[y["PkEstructura"]])):
                                                valores_pk[yy["Campo"]] = (valores_pk[yy["Campo"]]) + 1 
                                                tempo_ingre[yy["Campo"]] = valores_pk[yy["Campo"]]

                                            else:
                                                sentencia_int = 'select max( cast( ' + str(yy["Campo"]) + '  as decimal(12,0)) )+1 as "' + str(yy["Campo"]) + '"  from ' + str(dict_pk_nombre_tabla[y["PkEstructura"]])
                                                tempo_valor = db.cmpconso_ejecutar(sentencia_int)
                                                if tempo_valor[0][yy["Campo"]] == None:
                                                    tempo_ingre[yy["Campo"]] = 0
                                                else:    
                                                    tempo_ingre[yy["Campo"]] = tempo_valor[0][yy["Campo"]]
                                tempo_ingre1.append(tempo_ingre)
                            dataset_ingresar.update({y["PkAccionL2"]:tempo_ingre1})
                    
                    cc_fila = len(datosRegistros)
                    pkestru_por_pkaacc = {}
                    for y in reversed(datosRegistros):
                        pkestru_por_pkaacc.update({y["PkAccionL2"]:y["PkEstructura"]})
                        for dd in dataset_ingresar[y["PkAccionL2"]]:
                            for yy in accionescampos[y["PkAccionL2"]]: 
                                if yy["Tipo"] == "Auto":
                                    if yy["Origen"] == "cmpsistema":
                                        if obj_funciones_campos[y["PkEstructura"]][yy["Campo"]][0]["Nombre"] == 'Usuario Actual':
                                            dd[yy["Campo"]] = request.POST.getlist('usuario')[0]

                                        if obj_funciones_campos[y["PkEstructura"]][yy["Campo"]][0]["Nombre"] == 'Fecha Actual': 
                                            dd[yy["Campo"]] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

                                        if obj_funciones_campos[y["PkEstructura"]][yy["Campo"]][0]["Nombre"] == 'Hora Actual':                                      
                                            dd[yy["Campo"]] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                                    if yy["Origen"] == "cmpformuladetalle":
                                        valor_final = 0
                                        cc_final = 0
                                        Valor_temp = 0

                                        Campo_a_oper = obj_funciones_campos[y["PkEstructura"]][yy["Campo"]][0][0]["Campo"]
                                        Campo_a_sumar = Campo_a_oper.split(".")
                                        for x3 in datosRegistros:
                                            if str(x3['PkEstructura']) == str(obj_funciones_campos[y["PkEstructura"]][yy["Campo"]][0][0]["TablaDetalle"]):
                                                for x4 in dataset_ingresar[x3["PkAccionL2"]]:
                                                    if x4[Campo_a_sumar[1]] != "":
                                                        Valor_temp = float(x4[Campo_a_sumar[1]])
                                                    else:
                                                        Valor_temp = 0
                                                    excluido = False
                                                    for ss in obj_funciones_campos[y["PkEstructura"]][yy["Campo"]][1]:
                                                        valor_comparar = 0
                                                        if ss["Tipo"] == "Valor":
                                                            valor_comparar = ss["Valor"]
                                                        else:
                                                            valor_comparar = x4[ss["Valor"]]
                                                        if ss["Operador"] == "=":
                                                            if x4["Campo"] != valor_comparar:
                                                                excluido = True
                                                        if ss["Operador"] == ">":
                                                            if x4["Campo"] <= valor_comparar:
                                                                excluido = True
                                                        if ss["Operador"] == "<":
                                                            if x4["Campo"] >= valor_comparar:
                                                                excluido = True
                                                        if ss["Operador"] == ">=":
                                                            if x4["Campo"] < valor_comparar:
                                                                excluido = True
                                                        if ss["Operador"] == "<=":
                                                            if x4["Campo"] > valor_comparar:
                                                                excluido = True
                                                        if ss["Operador"] == "!=":
                                                            if x4["Campo"] == valor_comparar:
                                                                excluido = True
                                                    if excluido == False:
                                                        if obj_funciones_campos[y["PkEstructura"]][yy["Campo"]][0][0]["Operacion"] == "Suma":
                                                            valor_final =  float(valor_final) + float(Valor_temp)
                                                        if obj_funciones_campos[y["PkEstructura"]][yy["Campo"]][0][0]["Operacion"] == "Promedio":
                                                            valor_final =  float(valor_final) + float(Valor_temp)
                                                            cc_final =  cc_final + 1
                                                        if obj_funciones_campos[y["PkEstructura"]][yy["Campo"]][0][0]["Operacion"] == "Maximo":
                                                            if float(valor_final) > float(Valor_temp):
                                                                valor_final = float(Valor_temp)                                                    
                                                        if obj_funciones_campos[y["PkEstructura"]][yy["Campo"]][0][0]["Operacion"] == "Minimo":
                                                            if float(valor_final) < float(Valor_temp):
                                                                valor_final = float(Valor_temp) 
                                                        if obj_funciones_campos[y["PkEstructura"]][yy["Campo"]][0][0]["Operacion"] == "Contar":
                                                            cc_final =  cc_final + 1
                                        if obj_funciones_campos[y["PkEstructura"]][yy["Campo"]][0][0]["Operacion"] == "Suma":
                                            dd[yy["Campo"]] = round(float(valor_final) , 2)                                               
                                        if obj_funciones_campos[y["PkEstructura"]][yy["Campo"]][0][0]["Operacion"] == "Promedio":
                                            dd[yy["Campo"]] = float(valor_final / cc_final)
                                        if obj_funciones_campos[y["PkEstructura"]][yy["Campo"]][0][0]["Operacion"] == "Maximo":
                                            dd[yy["Campo"]] = float(valor_final)                                                    
                                        if obj_funciones_campos[y["PkEstructura"]][yy["Campo"]][0][0]["Operacion"] == "Minimo":
                                            dd[yy["Campo"]] = float(valor_final)                                                    
                                        if obj_funciones_campos[y["PkEstructura"]][yy["Campo"]][0][0]["Operacion"] == "Contar":
                                            dd[yy["Campo"]] = float(cc_final)                                                    
                                    if yy["Origen"] == "cmpoperacion":
                                        temp  = 0.0
                                        operador = "="
                                        Valor = 0.0
                                        for u in obj_funciones_campos[y["PkEstructura"]][yy["Campo"]][1]:
                                            if u["Estado"] == "O":
                                                operador = u["Sentencia"]
                                            else:
                                                if u["Estado"] == "C":
                                                    Valor = dd[u["Sentencia"]]
                                                if u["Estado"] == "V":
                                                    Valor = u["Sentencia"]
                                                if operador == "":
                                                    temp = float(Valor)
                                                if(operador == "+"):
                                                    temp = float(temp) + float(Valor)
                                                if(operador == "-"):
                                                    temp = float(temp) - float(Valor)
                                                if(operador == "*"):
                                                    temp = float(temp) * float(Valor)
                                                if(operador == "/"):
                                                    if Valor > 0:
                                                        temp = float(temp) / float(Valor)
                                                    else:
                                                        temp = 0
                                        dd[yy["Campo"]] = temp                       
                                    if yy["Origen"] == "cmpconsolidado":
                                        A_Select = 'Select ( '
                                        A_From = 'From '
                                        A_Where = 'Where '
                                        A_Group = ''
                                        A_GroupWhere = ''
                                        sentencia = ""
                                        FaltaDato = False
                                        for x3 in obj_funciones_campos[y["PkEstructura"]][yy["Campo"]][1]:
                                            A_From = A_From + str(x3["Tabla"]) + ' as ' + str(x3["Nombre"]) + ', '
                                        if A_From == 'From ':
                                            A_From = ''
                                        else:
                                            A_From = A_From[0:-2]
                                        for x3 in obj_funciones_campos[y["PkEstructura"]][yy["Campo"]][2]:
                                            if x3["Tipo"] == "Valor":
                                                A_Where = A_Where + " '" + str(x3["Elemento"]) + "' "
                                            if x3["Tipo"] == "Operacion":
                                                A_Where = A_Where + " " + str(x3["Elemento"]) + " "                                                
                                            if x3["Tipo"] == "Registro":
                                                A_Where = A_Where + " '" + str(dd[x3["Elemento"]]) + "' "                                                
                                            if x3["Tipo"] == "Campo":
                                                if x3["Funcion"] == "":
                                                    A_Where = A_Where + str(x3["Origen"]) + '.' + str(x3["Elemento"])
                                                else:
                                                    if x3["Funcion"] == "Suma":
                                                        A_Where = A_Where + ' Sum(' + str(x3["Origen"]) + '.' + str(x3["Elemento"])+ ') '
                                                    if x3["Funcion"] == " Promedio":
                                                        A_Where = A_Where + ' Avg(' + str(x3["Origen"]) + '.' + str(x3["Elemento"])+ ') '
                                                    if x3["Funcion"] == "Contar":
                                                        A_Where = A_Where + ' Count(' + str(x3["Origen"]) + '.' + str(x3["Elemento"])+ ') '
                                                    A_GroupWhere = A_GroupWhere + str(x3["Origen"]) + '.' + str(x3["Elemento"]) + ', '
                                        if A_GroupWhere != '':
                                            A_GroupWhere = A_GroupWhere[0:-2]
                                        if A_Where == "Where ":
                                            A_Where == ""

                                        for x3 in obj_funciones_campos[y["PkEstructura"]][yy["Campo"]][3]:
                                            if x3["Tipo"] == "Valor":
                                                A_Select = A_Select + " '" + str(x3["Elemento"]) + "' "
                                            if x3["Tipo"] == "Operacion":
                                                A_Select = A_Select + " " + str(x3["Elemento"]) + " "                                                
                                            if x3["Tipo"] == "Registro":
                                                A_Select = A_Select + " '" + str(dd[x3["Elemento"]]) + "' "                                                
                                            if x3["Tipo"] == "Campo":
                                                if x3["Funcion"] == "":
                                                    A_Select = A_Select + str(x3["Origen"]) + '.' + str(x3["Elemento"])
                                                else:
                                                    if x3["Funcion"] == "Suma":
                                                        A_Select = A_Select + ' Sum(' + str(x3["Origen"]) + '.' + str(x3["Elemento"])+ ') '
                                                    if x3["Funcion"] == "Promedio":
                                                        A_Select = A_Select + ' Avg(' + str(x3["Origen"]) + '.' + str(x3["Elemento"])+ ') '
                                                    if x3["Funcion"] == "Contar":
                                                        A_Select = A_Select + ' Count(' + str(x3["Origen"]) + '.' + str(x3["Elemento"])+ ') '
                                                    A_Group = A_Group + str(x3["Origen"]) + '.' + str(x3["Elemento"]) + ', '
                                        if A_Group != '':
                                            A_Group = A_Group[0:-2]
                                        A_Select = A_Select + " ) as '" + str(yy["Campo"]) + "'"
                                        if(A_Group == ""):
                                            if(A_GroupWhere == ""):
                                                sentencia = A_Select + " " + A_From + " " + A_Where
                                            else:
                                                sentencia = A_Select + " " + A_From + " " + A_Where + " Group by  " +  A_GroupWhere
                                        else:
                                            if(A_GroupWhere == ""):
                                                sentencia = A_Select + " " + A_From + " " + A_Where + " Group by  " + A_Group
                                            else:
                                                sentencia = A_Select + " " + A_From + " " + A_Where + " Group by  " +  A_Group + ', ' + A_GroupWhere
                                
                                        tempo_valor = db.cmpconso_ejecutar(sentencia)
                                        if len(tempo_valor) == 0:
                                            dd[yy["Campo"]] = 0 
                                        else:
                                            dd[yy["Campo"]] = tempo_valor[0][yy["Campo"]]

                                    #if yy["Origen"] == "cmpdecabecera":
                                    if yy["Origen"] == "cmpfecha":  
                                        if obj_funciones_campos[y["PkEstructura"]][yy["Campo"]][0]["Tiempo"] == 'Y':
                                            dd[yy["Campo"]] = str(datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
                                        else:
                                            dd[yy["Campo"]] = str(datetime.now().strftime('%Y-%m-%d'))
                       
                    for y in dataset_ingresar:
                        for yy in dataset_ingresar[y]:
                            sentencia = "insert into `" + str(dict_pk_nombre_tabla[pkestru_por_pkaacc[y]]) +  "` (" 
                            Vsentencia = "VALUES ("
                            for y3 in yy:                                
                                sentencia = sentencia + "`" + str(y3) + "`, "
                                Vsentencia = Vsentencia + "'" + str(yy[y3]) + "', "
                            sentencia = sentencia[0:-2] + ")"
                            Vsentencia = Vsentencia[0:-2] + ")"
                            senten_acc.append( sentencia + Vsentencia )
                    #a/0
 
            if z["Accion"] == "Modificar":
                if validar_condiciones(request, Id_empresa, z["PkAccion"], envio_datset) == True:
                    Update = ""
                    UpdateFrom = "UPDATE"
                    UpdateSet = "SET"
                    UpdateWhere = "WHERE "
                    Updatehaving  = " "
                    Nom_tabla_cab = db.TraerNombre_tabla(z["PkModulo"])[0]["Nombre"]
                    Updata = db.TraerUpdateFrom(z["PkAccion"])
                    for y in Updata:
                        UpdateFrom = UpdateFrom + " " + str(y["Tabla"]) + ", "
                    UpdateFrom = UpdateFrom[0:-2]
                    
                    Updata = db.TraerUpdateWhere(z["PkAccion"])
                    for y in Updata:
                        if y["Tipo"] == "Campo":
                            UpdateWhere = UpdateWhere + str(y["Origen"]) + "." + str(y["Elemento"]) + "  "
                        if y["Tipo"] == "Valor":
                            UpdateWhere = UpdateWhere + "'" + str(y["Elemento"]) + "' "
                        if y["Tipo"] == "Operacion":
                            UpdateWhere = UpdateWhere + str(y["Elemento"]) + "  "
                        if y["Tipo"] == "Registro":
                            UpdateWhere = UpdateWhere + " '" + str(envio_datset[Nom_tabla_cab][0][y["Elemento"]])  + "' "
                        if y["Tipo"] == "Registro sin Comillas":
                            UpdateWhere = UpdateWhere +  str(envio_datset[Nom_tabla_cab][0][y["Elemento"]]) + " "

                    Updata = db.TraerUpdatehaving(z["PkAccion"])
                    for y in Updata:
                        if y["Tipo"] == "Campo":
                            Updatehaving = Updatehaving + str(y["Origen"]) + "." + str(y["Elemento"]) + "  "
                        if y["Tipo"] == "Valor":
                            Updatehaving = Updatehaving + "'" + str(y["Elemento"]) + "' "
                        if y["Tipo"] == "Operacion":
                            Updatehaving = Updatehaving + str(y["Elemento"]) + "  "
                        if y["Tipo"] == "Registro":
                            Updatehaving = Updatehaving + " '" + str(envio_datset[Nom_tabla_cab][0][y["Elemento"]])  + "' "
                        if y["Tipo"] == "Registro sin Comillas":
                            Updatehaving = Updatehaving +  str(envio_datset[Nom_tabla_cab][0][y["Elemento"]]) + " "

                    Updata = db.TraerUpdateSet(z["PkAccion"])
                    for y in Updata:
                        if y["Tipo"] == "Campo":
                            UpdateSet = UpdateSet + " " + str(y["Fuente"]) + "." + str(y["Campo"]) + " = " + str(y["Valor"]) + ", "
                        if y["Tipo"] == "Valor":
                            if y["Valor"] == "@Usuario@":
                                UpdateSet = UpdateSet + " " + str(y["Fuente"]) + "." + str(y["Campo"]) + " = '" + str(request.POST.getlist('usuario')[0]) + "', "
                            else:
                                UpdateSet = UpdateSet + " " + str(y["Fuente"]) + "."+ str(y["Campo"]) + " = '" + str(y["Valor"]) + "', "
                        if y["Tipo"] == "Operacion":
                            variables = y["Variables"].split(",")
                            valor_final = y["Valor"]
                            if not(y["Variables"] == ''):
                                for yy in variables:
                                    valor_final = valor_final.replace("[" + yy + "]", envio_datset[Nom_tabla_cab][0][yy[0]])
                            UpdateSet = UpdateSet + " " + str(y["Fuente"]) + "." + str(y["Campo"]) + " = " + str(valor_final) + ", "
                        if y["Tipo"] == "Registro":
                            UpdateSet = UpdateSet + " " + str(y["Fuente"]) + "." + str(y["Campo"]) + " = '" + str(envio_datset[Nom_tabla_cab][0][y["Valor"]]) + "', "
                        if y["Tipo"] == "Registro sin Comillas":
                            UpdateSet = UpdateSet + " " + str(y["Fuente"]) + "." + str(y["Campo"]) + " = " + str(envio_datset[Nom_tabla_cab][0][y["Valor"]]) + ", "
                        if y["Tipo"] == "Variable":
                            UpdateSet = UpdateSet + " " + str(y["Fuente"]) + "." + str(y["Campo"]) + " = '" + str(IngVariables[y["Valor"]]) + "', "
                        
                    UpdateSet = UpdateSet[0:-2]    
                    if UpdateWhere == "WHERE":
                        Update = UpdateFrom + " " + UpdateSet + " " + Updatehaving
                    else:
                        Update = UpdateFrom + " " + UpdateSet + "  " + UpdateWhere + " " + Updatehaving
                    senten_acc.append(Update)
            if z["Accion"] == "cc_actualizaciones":
                if validar_condiciones(request, Id_empresa, z["PkAccion"], envio_datset) == True:
                    Update = ""
                    UpdateFrom = "UPDATE"
                    UpdateSet = "SET"
                    UpdateWhere = "WHERE "
                    Updatehaving  = " "
                    Nom_tabla_cab = db.TraerNombre_tabla(z["PkModulo"])[0]["Nombre"]
                    Updata = db.TraerUpdateFrom(z["PkAccion"])
                    for y in Updata:
                        UpdateFrom = UpdateFrom + " " + str(y["Tabla"]) + ", "
                    UpdateFrom = UpdateFrom[0:-2]
                    
                    Updata = db.TraerUpdateWhere(z["PkAccion"])
                    for y in Updata:
                        if y["Tipo"] == "Campo":
                            UpdateWhere = UpdateWhere + str(y["Origen"]) + "." + str(y["Elemento"]) + "  "
                        if y["Tipo"] == "Valor":
                            UpdateWhere = UpdateWhere + "\'" + str(y["Elemento"]) + "\' "
                        if y["Tipo"] == "Operacion":
                            UpdateWhere = UpdateWhere + str(y["Elemento"]) + "  "
                        if y["Tipo"] == "Registro":
                            UpdateWhere = UpdateWhere + " \'" + str(envio_datset[Nom_tabla_cab][0][y["Elemento"]])  + "\' "
                        if y["Tipo"] == "Registro sin Comillas":
                            UpdateWhere = UpdateWhere +  str(envio_datset[Nom_tabla_cab][0][y["Elemento"]]) + " "

                    Updata = db.TraerUpdatehaving(z["PkAccion"])
                    for y in Updata:
                        if y["Tipo"] == "Campo":
                            Updatehaving = Updatehaving + str(y["Origen"]) + "." + str(y["Elemento"]) + "  "
                        if y["Tipo"] == "Valor":
                            Updatehaving = Updatehaving + "\'" + str(y["Elemento"]) + "\' "
                        if y["Tipo"] == "Operacion":
                            Updatehaving = Updatehaving + str(y["Elemento"]) + "  "
                        if y["Tipo"] == "Registro":
                            Updatehaving = Updatehaving + " \'" + str(envio_datset[Nom_tabla_cab][0][y["Elemento"]])  + "\' "
                        if y["Tipo"] == "Registro sin Comillas":
                            Updatehaving = Updatehaving +  str(envio_datset[Nom_tabla_cab][0][y["Elemento"]]) + " "

                    Updata = db.TraerUpdateSet(z["PkAccion"])
                    for y in Updata:
                        if y["Tipo"] == "Campo":
                            UpdateSet = UpdateSet + " " + str(y["Fuente"]) + "." + str(y["Campo"]) + " = " + str(y["Valor"]) + ", "
                        if y["Tipo"] == "Valor":
                            UpdateSet = UpdateSet + " " + str(y["Fuente"]) + "."+ str(y["Campo"]) + " = \'" + str(y["Valor"]) + "\', "
                        if y["Tipo"] == "Operacion":
                            variables = y["Variables"].split(",")
                            valor_final = y["Valor"]
                            if not(y["Variables"] == ''):
                                for yy in variables:
                                    valor_final = valor_final.replace("[" + yy + "]", envio_datset[Nom_tabla_cab][0][yy[0]])
                            UpdateSet = UpdateSet + " " + str(y["Fuente"]) + "." + str(y["Campo"]) + " = " + str(valor_final) + ", "
                        if y["Tipo"] == "Registro":
                            UpdateSet = UpdateSet + " " + str(y["Fuente"]) + "." + str(y["Campo"]) + " = \'" + str(envio_datset[Nom_tabla_cab][0][y["Valor"]]) + "\', "
                        if y["Tipo"] == "Registro sin Comillas":
                            UpdateSet = UpdateSet + " " + str(y["Fuente"]) + "." + str(y["Campo"]) + " = " + str(envio_datset[Nom_tabla_cab][0][y["Valor"]]) + ", "
                    UpdateSet = UpdateSet[0:-2]    
                    if UpdateWhere == "WHERE":
                        Update = UpdateFrom + " " + UpdateSet + " " + Updatehaving
                    else:
                        Update = UpdateFrom + " " + UpdateSet + "  " + UpdateWhere + " " + Updatehaving
                    logger.debug('INSERT INTO `cc_actualizaciones` (`nombre`, `sentencia`) VALUES ("'+ datetime.now().strftime('%Y-%m-%d %H:%M:%S') +'", "'+ Update +'")')
                    senten_acc.append('INSERT INTO `cc_actualizaciones` (`nombre`, `sentencia`) VALUES ("'+ datetime.now().strftime('%Y-%m-%d %H:%M:%S') +'", "'+ Update +'")')
            if z["Accion"] == "Email":
                datosCorreo = db.TraerAccionesCorreo(z["PkAccion"])
                Nom_tabla_cab = db.TraerNombre_tabla(z["PkModulo"])[0]["Nombre"]

                for correo in datosCorreo:
                    #De
                    #Para
                    #Tema
                    #Cuerpo
                    #Variables

                    sender = correo['De']
                    receivers = str(envio_datset[Nom_tabla_cab][0][correo['Para']])

                    messageCat = correo['CuerpoCab']
                    messagePie = correo['CuerpoPie']

                    messageDer = ''

                    VarCab = json.loads(correo['VariablesCad']) # {@var1:campo1,@var2:campo2}

                    for var in VarCab:
                        messageCat = messageCat.replace(var,str(envio_datset[Nom_tabla_cab][0][VarCab[var]]))
                        messagePie = messagePie.replace(var,str(envio_datset[Nom_tabla_cab][0][VarCab[var]]))

                    VarDet = json.loads(correo['VariablesDet']) # {@var1:campo1,@var2:campo2}
                    if len(VarDet)>0:
                        Nom_tabla_det = db.ListadoTablas(z["PkModulo"])[1]["Nombre"]
                        for fila in envio_datset[Nom_tabla_det]:
                            Linea = correo['CuerpoDet']
                            for var in VarDet:
                                Linea = Linea.replace(var,str(fila[VarDet[var]]))
                            messageDer = messageDer + Linea + '\n'

                    cuerpo = messageCat + '\n' + messageDer + '\n' + messagePie

                    
                    envio_email(str(envio_datset[Nom_tabla_cab][0][correo['Para']]), cuerpo, correo['De'])
    return senten_acc

def envio_email(para, msg, por):
    try:
        send_mail(por, msg, 'documentos@cerocodigo.com',[para])
    except:
        pass


def EjecutarAcciones_FirmaPdf(request, Id_empresa, pkmodulo, disparador, envio_datset):
     
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    datosCabecera = db.TraerAccionesCabecera(pkmodulo)
    senten_acc = []
    rowcount = {}
    tabla_cab = ''
    for z in datosCabecera:
        if z["Disparador"] == disparador:
            if z["Accion"] == "FirmaPdf":
                
                firma = web.firma_pdf 
                #datos_firma = firma.traerdatos(request, request.POST.getlist('usuario')[0], request.POST.getlist('Id_empresa')[0], z["ModuloAfectado"], 'Plantilla')
                Nom_tabla_cab = db.TraerNombre_tabla(z["PkModulo"])[0]["Nombre"]
                datos_pdf = web.pdf.crear_pdf_registro(request, Id_empresa, z["PkModulo"], str(envio_datset[Nom_tabla_cab][0]['Pk'+Nom_tabla_cab]), envio_datset, z["ModuloAfectado"]) 
                doc_pdf = datos_pdf[0]
                
                if len(datos_pdf[1]) > 0:
                    datos_firma = firma.traerdatos_bloque(request, request.POST.getlist('Id_empresa')[0], datos_pdf[1])
                    firmado = firma.firmar_conform_nueva(doc_pdf, request.POST.getlist('Id_empresa')[0] , datos_firma, envio_datset, Nom_tabla_cab)
                    if firmado[1] == 'no':
                        return ['Error',firmado[2]]
                    else:
                        senten_acc.append("Update "+Nom_tabla_cab+" set "+z["con_ext"]+" = '"+firmado[0]+"' where Pk"+Nom_tabla_cab+" = "+str(envio_datset[Nom_tabla_cab][0]['Pk'+Nom_tabla_cab])+" ")


    return senten_acc

def Acc_TraerDataTable(request, Id_empresa, datatable, query_nom, indice):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 

    A_Select = "Select "
    A_From = "From "
    A_Where = "Where "
    A_Group = ""
    A_GroupWhere = ""
    sentencia = ""
    
    datos = db.hacer_query_TraerFrom(query_nom)
    for cc in datos:
        A_From = A_From + str(cc["Tabla"]) + " as " + cc["Nombre"] + ", "
    if A_From == "From ":
        A_From = ""
    else:
        A_From = A_From[0:-2]


    datos = db.hacer_query_TraerWhere(query_nom)
    for cc in datos:
        if cc["Tipo"] == "Campo":
            if cc["Funcion"] == "":
                A_Where = A_Where + " " + str(cc["Origen"]) + "." + str(cc["Elemento"]) + " "
            if cc["Funcion"] == "Suma":
                A_Where = A_Where + " Sum(" + str(cc["Origen"]) + "." + str(cc["Elemento"]) + ") "
                A_GroupWhere = A_GroupWhere + str(cc["Grupo"]) + ", "

            if cc["Funcion"] == "Promedio":
                A_Where = A_Where + " Avg(" + str(cc["Origen"]) + "." + str(cc["Elemento"]) + ") "
                A_GroupWhere = A_GroupWhere + str(cc["Grupo"]) + ", "

            if cc["Funcion"] == "Contar":
                A_Where = A_Where +" Count(" +  str(cc["Origen"]) + "." + str(cc["Elemento"]) + ") "
                A_GroupWhere = A_GroupWhere + str(cc["Grupo"]) + ", "

        if cc["Tipo"] == "Valor":
            A_Where = A_Where + " '" + cc["Elemento"] + "' "

        if cc["Tipo"] == "Operacion":
            A_Where = A_Where + " " + cc["Elemento"] + " "

        if cc["Tipo"] == "Registro":
            A_Where = A_Where + " '" + str(datatable[str(cc["Origen"])][indice][cc["Elemento"]] ) + "' "

        if cc["Tipo"] == "Cabecera":            
            A_Where = A_Where + " '" + str(datatable[str(cc["Origen"])][indice][cc["Elemento"]] ) + "' "
    
    if A_GroupWhere != "":
        A_GroupWhere = A_GroupWhere[0:-2]


    datos = db.hacer_query_TraerColumnas(query_nom)
    for cc in datos:
        A_Select = A_Select + " CAST( "
        datosInt = db.hacer_query_TraerColumnasDetalle(cc["PkColumna"])
        for cc3 in datosInt:
            if cc3["Tipo"] == "Campo":
                if cc3["Funcion"] == "":
                    A_Select = A_Select + " " + str(cc3["Origen"]) + "." + str(cc3["Elemento"]) + " "
                if cc3["Funcion"] == "Suma":
                    A_Select = A_Select + " Sum(" + str(cc3["Origen"]) + "." + str(cc3["Elemento"]) + ") "
                    A_Group = A_Group + str(cc3["GroupBy"]) + ", "
                if cc3["Funcion"] == "Promedio":
                    A_Select = A_Select + " Avg(" + str(cc3["Origen"]) + "." + str(cc3["Elemento"]) + ") "
                    A_Group = A_Group + str(cc3["GroupBy"]) + ", "
                if cc3["Funcion"] == "Contar":
                    A_Select = A_Select +" Count(" +  str(cc3["Origen"]) + "." + str(cc3["Elemento"]) + ") "
                    A_Group = A_Group + str(cc3["GroupBy"]) + ", "
            if cc3["Tipo"] == "Valor":
                A_Select = A_Select + " '" + cc3["Elemento"] + "' "

            if cc3["Tipo"] == "Operacion":
                A_Select = A_Select + " " + cc3["Elemento"] + " "

            if cc3["Tipo"] == "Registro":
                A_Select = A_Select + " '" + str(datatable[str(cc3["Origen"])][indice][cc3["Elemento"]] ) + "' "
            if cc3["Tipo"] == "Cabecera":            
                A_Select = A_Select + " '" + str(datatable[str(cc3["Origen"])][indice][cc3["Elemento"]] ) + "' "                

        A_Select = A_Select + "as char) as '" + str(cc["Nombre"]) + "', "
    if A_Group != "":
        A_Group = A_Group[0:-2]
    if A_Select != "Select ":
        A_Select = A_Select[0:-2]

    sentencia =  A_Select + " " + A_From
    if A_Where != "Where ":
        sentencia = sentencia + " " + A_Where

    if A_Group == "":
        if A_GroupWhere == "":
            sentencia = sentencia
        else:
            sentencia = sentencia + " Group by " + A_GroupWhere
    else:
        if A_GroupWhere == "":
            sentencia = sentencia + " Group by " + A_Group 
        else:
            sentencia = sentencia + " Group by " + A_Group + ", " + A_GroupWhere
    return db.cmpconso_ejecutar(sentencia)

def buscador_filtro(request, Id_empresa):
    cc1 = request.POST.getlist('cmpsenten')[0].split("from")
    cc2 = cc1[0].replace(" ","")
    cc2 = cc2.replace("select","")
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    datos_PkCampo = db.traer_buscador_por_id(request.POST.getlist('pkcampo')[0])
    sentencia = "select * from (" + request.POST.getlist('cmpsenten')[0] + ") int_ress where "
    db_campos = db.traer_campos_ref(request.POST.getlist('pkcampo')[0])
    dbcolumas = db_campos[0]["Columnas"].split(",")
    valore_filtro = request.POST.getlist('valor_filtro')[0].split(",")
    sentencia_where = ''
    for xx in valore_filtro:
        sentencia_where = sentencia_where + '('
        for a in dbcolumas:
            sentencia_where = sentencia_where + ' ' +  a.strip() + " like '%" + xx + "%' or"
        sentencia_where= sentencia_where[:-2] + ') and '
    sentencia_where = sentencia_where[:-4]

    sentencia =  sentencia + " (" + sentencia_where + ") order by " + datos_PkCampo[0]["Sentencia"]
    cmpvalor = db.cmpbuscador_ejecutar(sentencia, request.POST.getlist('max')[0])
    return {'datos_PkCampo':datos_PkCampo,'nombre':db_campos[0]["Sentencia"],'A_Select':cc2, 'cmpvalor':cmpvalor,'pkcampo':request.POST.getlist('pkcampo')[0], 'id_campo_busc':request.POST.getlist('id_campo_busc')[0] }

def buscador_filt_rep(request, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    sentencia = "select * from (" + request.POST.getlist('cmpsenten')[0] + ") int_ress where "
    db_campos = db.traer_campos_ref_rep(request.POST.getlist('pkcampo')[0])
    dbcolumas = db_campos[0]["Columnas"].split(",")
    sentencia_where = ''
    for a in dbcolumas:
        sentencia_where = sentencia_where + ' ' +  a.strip() + " like '%" + request.POST.getlist('valor_filtro')[0] + "%' or"
    sentencia_where = sentencia_where[:-2]
    sentencia =  sentencia + " (" + sentencia_where + ") "
    cmpvalor = db.cmpbuscador_ejecutar(sentencia, 15)
    return {'nombre':db_campos[0]["Campo"], 'cmpvalor':cmpvalor,'pkcampo':request.POST.getlist('pkcampo')[0], 'id_campo_busc':request.POST.getlist('id_campo_busc')[0] }



def reporte_ejecutar(request, Id_empresa):
    repreferencias = json.loads(request.POST.get('varref'))
    repvariables = json.loads(request.POST.get('varvar'))
    repsenten = json.loads(request.POST.get('senten'))
    label = json.loads(request.POST.get('label'))
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    resutado = []
    repstilo = db.main_reportesqvisibles(request.POST.get('id'))
    reptotales = db.main_reportesqtotales(request.POST.get('id'))
    for a in repsenten:
        for b in repreferencias:
            a = a.replace(b, "'"+ str(repreferencias[b])+ "'")
        for b in repvariables:
            a = a.replace(b, "'"+ str(repvariables[b])+ "'")
        a = a.replace("`", "'")
        resul = db.reporte_ejecutar(a)
        db_msg = ''
        if resul['error'] == 0:
            resutado.append(resul['resul'])
        else:
            db_msg = resul['error']
            return {'db_msg':db_msg}
    return {'db_msg':0,'reptotales':reptotales, 'label':label, 'repreferencias':repreferencias,'repvariables':repvariables,'repstilo':repstilo,'resutado':resutado, 'pestalla':request.POST.get('pestalla'), 'id':request.POST.get('id'), 'nombre_rep':request.POST.get('nombre_rep')}


def buscador_ficha_crear_rapido(request, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    #cmpvalor = db.cmpbuscador_ejecutar(request.POST.getlist('cmpsenten')[0], 15)
    panel = db.panel_web_p_panel_traer(request.POST.getlist('pkpanel')[0])
    if len(panel) > 0:
        sente = "INSERT INTO `"+panel[0]['tabla']+"` (`"+panel[0]['grupos_nom']+"`) VALUES ('')" 
        db.sql_directo(sente)
        ultimo = db.sql_traer_directo("Select Pk"+panel[0]['tabla']+" from "+panel[0]['tabla']+" order by Pk"+panel[0]['tabla']+" desc limit 1")
        sente = 'Select ' +panel[0]['agrupar']+ ', Pk'+ panel[0]['tabla'] +' from ' + panel[0]['tabla'] + ' where Pk'+ panel[0]['tabla'] + ' like "' +str(ultimo[0]['Pk'+ panel[0]['tabla']])+ '" '
        cmpvalor = db.cmpbuscador_ejecutar_sun_limite(sente)
        cmpvalordistinct = ''
        if 'cmpdistinct' in request.POST:
            if request.POST.getlist('cmpdistinct')[0] == '':
                cmpvalordistinct = ''    
            else:
                cmpvalordistinct = db.cmpbuscador_ejecutar_sun_limite(request.POST.getlist('cmpdistinct')[0])

        return {'cmpvalor':cmpvalor, 'namcampo':panel[0]['agrupar'], 'pkpanel':request.POST.getlist('pkpanel')[0], 'cmpvalordistinct':cmpvalordistinct, 'condicion':'Pk'+ panel[0]['tabla']}




def buscador_ficha(request, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    #cmpvalor = db.cmpbuscador_ejecutar(request.POST.getlist('cmpsenten')[0], 15)
    cmpvalor = db.cmpbuscador_ejecutar_sun_limite(request.POST.getlist('cmpsenten')[0])
    cmpvalordistinct = ''
    if 'cmpdistinct' in request.POST:
        if request.POST.getlist('cmpdistinct')[0] == '':
            cmpvalordistinct = ''    
        else:
            cmpvalordistinct = db.cmpbuscador_ejecutar_sun_limite(request.POST.getlist('cmpdistinct')[0])

    return {'cmpvalor':cmpvalor, 'namcampo':request.POST.getlist('namcampo')[0], 'pkpanel':request.POST.getlist('pkpanel')[0], 'cmpvalordistinct':cmpvalordistinct}

def buscador_auditoria(request, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    #cmpvalor = db.cmpbuscador_ejecutar(request.POST.getlist('cmpsenten')[0], 15)
    cmpvalor = db.cmpbuscador_ejecutar_sun_limite(request.POST.getlist('cmpsenten')[0])
    return {'cmpvalor':cmpvalor}


def buscador(request, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    #cmpvalor = db.cmpbuscador_ejecutar(request.POST.getlist('cmpsenten')[0], 15)
    cmpvalor = db.cmpbuscador_ejecutar_sun_limite(request.POST.getlist('cmpsenten')[0])
    datos_PkCampo = db.traer_buscador_por_id(request.POST.getlist('PkCampo')[0])
    return {'datos_PkCampo':datos_PkCampo,'cmpvalor':cmpvalor,'PkCampo':request.POST.getlist('PkCampo')[0],'A_Select':request.POST.getlist('A_Select')[0].replace(" ","")}





def buscador_auto_enter(request, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    cmpvalor = db.cmpbuscador_ejecutar(request.POST.getlist('cmpsenten')[0], 15)
    return {'cmpvalor':cmpvalor, 'cc_pesta':request.POST.getlist('cc_pesta')[0],'cc_nombre':request.POST.getlist('cc_nombre')[0],'cc_fila':request.POST.getlist('cc_fila')[0]}

    
def buscadornota(request, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    cmpvalor = db.cmpbuscador_ejecutar(request.POST.getlist('cmpsenten')[0], 5)
    return {'cmpvalor':cmpvalor}

def modi_fast(request, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    db.modi_fast(request.POST.getlist('pkregistro')[0], request.POST.getlist('tabla')[0], request.POST.getlist('nombre')[0], request.POST.getlist('valor')[0])
    return {'id':request.POST.getlist('id')[0]}

    
def actualiza_campos(request, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    sentencia = "update camposxestructura set " + request.POST.getlist('t_atributo')[0] + " = '" + request.POST.getlist('t_valor')[0] + "' where camposxestructura.PkId = " + request.POST.getlist('t_pkcampo')[0] 
    db.sql_directo(sentencia)


def intercambio_listado_dir(request, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    camposA = db.traer_campo_por_pkestr_nombre(request.POST.getlist('t_pkestructura')[0], request.POST.getlist('t_cc_nombre')[0])
    
    list_cmpo = db.traer_listado_cc_por_estru_posi_normal(request.POST.getlist('t_pkestructura')[0], request.POST.getlist('dirre')[0], camposA[0]["posicionConsulta"], camposA[0]["PkId"], camposA[0]["posicionConsulta"])
    if len(list_cmpo) > 0:
        BB = list_cmpo[0]['PkId']
        if request.POST.getlist('dirre')[0] == '0':
            difer = int(camposA[0]["posicionConsulta"]) - int(list_cmpo[0]['posicionConsulta']) 
            for a in list_cmpo:
                if int(difer) > (int(camposA[0]["posicionConsulta"]) - int(a["posicionConsulta"])):
                    difer = int(camposA[0]["posicionConsulta"]) - int(a["posicionConsulta"])
                    BB = a["PkId"]
        else:
            difer = int(list_cmpo[0]['posicionConsulta'])  - int(camposA[0]["posicionConsulta"]) 
            for a in list_cmpo:
                if int(difer) > ( int(a["posicionConsulta"]) - int(camposA[0]["posicionConsulta"]) ):
                    difer = int(a["posicionConsulta"]) - int(camposA[0]["posicionConsulta"])
                    BB = a["PkId"]
        camposB = db.traer_campo_por_id(BB)
        db.actualizar_dato_campo_id(camposA[0]["PkId"], 'posicionConsulta', camposB[0]["posicionConsulta"] )
        db.actualizar_dato_campo_id(camposB[0]["PkId"], 'posicionConsulta', camposA[0]["posicionConsulta"] )

def intercambio_dir(request, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    estruPK = db.traer_pkestru_por_campo_por_id(request.POST.getlist('t_pkcampo')[0])
    camposA = db.traer_campo_por_id(request.POST.getlist('t_pkcampo')[0])
    list_cmpo = db.traer_listado_cc_por_estru(estruPK[0]['pkestructura'], request.POST.getlist('dirre')[0], camposA[0]["Posicion"], camposA[0]["PkId"], camposA[0]["posicionweb"])
    if len(list_cmpo) > 0:
        BB = list_cmpo[0]['PkId']
        if request.POST.getlist('dirre')[0] == '0':
            difer = int(camposA[0]["Posicion"]) - int(list_cmpo[0]['Posicion']) 
            for a in list_cmpo:
                if int(difer) > (int(camposA[0]["Posicion"]) - int(a["Posicion"])):
                    difer = int(camposA[0]["Posicion"]) - int(a["Posicion"])
                    BB = a["PkId"]
        else:
            difer = int(list_cmpo[0]['Posicion'])  - int(camposA[0]["Posicion"]) 
            for a in list_cmpo:
                if int(difer) > ( int(a["Posicion"]) - int(camposA[0]["Posicion"]) ):
                    difer = int(a["Posicion"]) - int(camposA[0]["Posicion"])
                    BB = a["PkId"]
        camposB = db.traer_campo_por_id(BB)
        db.actualizar_dato_campo_id(camposA[0]["PkId"], 'Posicion', camposB[0]["Posicion"] )
        db.actualizar_dato_campo_id(camposB[0]["PkId"], 'Posicion', camposA[0]["Posicion"] )

def intercambio_cc(request, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    camposA = db.traer_campo_por_id(request.POST.getlist('t_pkcampoA')[0])
    camposB = db.traer_campo_por_id(request.POST.getlist('t_pkcampoB')[0])
    db.actualizar_dato_campo_id(camposA[0]["PkId"], 'Posicion', camposB[0]["Posicion"] )
    db.actualizar_dato_campo_id(camposB[0]["PkId"], 'Posicion', camposA[0]["Posicion"] )


  
def traer_campos_int(request, Id_empresa, pkmodulo):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    tablas  = db.tablas(pkmodulo)
    campos = db.campos(tablas)
    tabla_cab = tablas[0]
    campos_cab = campos[0]
    tabla_det = 0
    campos_det = 0
    tabla_subdet = 0
    campos_subdet = 0
    if len(tablas) > 1:
        tabla_det = tablas[1]
        campos_det = campos[1]
    if len(tablas) > 2:
        tabla_subdet = tablas[2]
        campos_subdet = campos[2]
    validaciones = db.validaciones(tablas)
    return {'pestalla':request.POST.getlist('pestalla')[0], 'tabla_cab' :tabla_cab, 'campos_cab' :campos_cab, 'tabla_det':tabla_det,'campos_det':campos_det,'tabla_subdet':tabla_subdet,'campos_subdet':campos_subdet,'validaciones':validaciones}

def traer_campos_desdePanel(request, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    tablas  = db.tablas(request.POST.getlist('pkmodulo')[0])
    #campos = db.campos(tablas)
    campos = db.camposXConsulta(tablas)
    tabla_cab = tablas[0]
    campos_cab = campos[0]
    tabla_det = 0
    campos_det = 0
    tabla_subdet = 0
    campos_subdet = 0
    if len(tablas) > 1:
        tabla_det = tablas[1]
        campos_det = campos[1]
    if len(tablas) > 2:
        tabla_subdet = tablas[2]
        campos_subdet = campos[2]
    validaciones = db.validaciones(tablas)
    return {'pkgrupo':request.POST.getlist('pkgrupo')[0],'pkpanel':request.POST.getlist('pkpanel')[0],'xE':request.POST.getlist('xE')[0],'tabla_cab' :tabla_cab, 'campos_cab' :campos_cab, 'tabla_det':tabla_det,'campos_det':campos_det,'tabla_subdet':tabla_subdet,'campos_subdet':campos_subdet,'validaciones':validaciones}

def traer_campos_panel_directo(request, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    tablas  = db.tablas(request.POST.getlist('pkmodulo')[0])
    campos = db.campos(tablas)
    tabla_cab = tablas[0]
    campos_cab = campos[0]
    tabla_det = 0
    campos_det = 0
    tabla_subdet = 0
    campos_subdet = 0
    if len(tablas) > 1:
        tabla_det = tablas[1]
        campos_det = campos[1]
    if len(tablas) > 2:
        tabla_subdet = tablas[2]
        campos_subdet = campos[2]
    validaciones = db.validaciones(tablas)
    return {'pkgrupo':request.POST.getlist('pkgrupo')[0],'pkpanel':request.POST.getlist('pkpanel')[0],'xE':request.POST.getlist('xE')[0],'tabla_cab' :tabla_cab, 'campos_cab' :campos_cab, 'tabla_det':tabla_det,'campos_det':campos_det,'tabla_subdet':tabla_subdet,'campos_subdet':campos_subdet,'validaciones':validaciones}

def traer_campos_panel_directo_Det(request, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    tablas  = db.tablas(request.POST.getlist('pkmodulo')[0])
    campos = db.campos(tablas)
    tabla_cab = tablas[0]
    campos_cab = campos[0]
    tabla_det = 0
    campos_det = 0
    tabla_subdet = 0
    campos_subdet = 0
    if len(tablas) > 1:
        tabla_det = tablas[1]
        campos_det = campos[1]
    return {'pk_estrudet':tablas[1]['PkEstructura'], 'tabla_cab' :tabla_cab, 'campos_cab' :campos_cab, 'tabla_det':tabla_det,'campos_det':campos_det,'tabla_subdet':tabla_subdet,'campos_subdet':campos_subdet}

def traer_campos_panel_directo_pkmodulo(request, Id_empresa, pkmodulo):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    tablas  = db.tablas(pkmodulo)
    campos = db.campos(tablas)
    tabla_cab = tablas[0]
    campos_cab = campos[0]
    tabla_det = 0
    campos_det = 0
    tabla_subdet = 0
    campos_subdet = 0
    if len(tablas) > 1:
        tabla_det = tablas[1]
        campos_det = campos[1]
    return {'pk_estru':tablas[0]['PkEstructura'], 'tabla_cab' :tabla_cab, 'campos_cab' :campos_cab, 'tabla_det':tabla_det,'campos_det':campos_det,'tabla_subdet':tabla_subdet,'campos_subdet':campos_subdet}


def traer_campos(request, Id_empresa, pkmodulo, tpestana):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    tablas  = db.tablas(pkmodulo)
    tt_modulo  = db.traer_moduloss_porPk(pkmodulo)
    campos = db.campos(tablas)
    tabla_cab = tablas[0]
    campos_cab = campos[0]
    tabla_det = 0
    campos_det = 0
    tabla_subdet = 0
    campos_subdet = 0
    if len(tablas) > 1:
        tabla_det = tablas[1]
        campos_det = campos[1]
    if len(tablas) > 2:
        tabla_subdet = tablas[2]
        campos_subdet = campos[2]
    validaciones = db.validaciones(tablas)
    return {'exportable':tt_modulo[0]['exportable'], 'pestalla':tpestana, 'tabla_cab' :tabla_cab, 'campos_cab' :campos_cab, 'tabla_det':tabla_det,'campos_det':campos_det,'tabla_subdet':tabla_subdet,'campos_subdet':campos_subdet,'validaciones':validaciones}

def traer_campos_funciones(request, Id_empresa, campos, pkmodulo):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    tablas  = db.tablas(pkmodulo)
    funciones_campos = db.funciones_campos(tablas, campos)
    funciones_cab = funciones_campos[0]
    funciones_det = 0
    funciones_subdet = 0
    if len(tablas) > 1:
        funciones_det = funciones_campos[1]
    if len(tablas) > 2:
        funciones_subdet = funciones_campos[2]
    return [ funciones_cab, funciones_det, funciones_subdet]

def traer_campos_funciones_directo(request, Id_empresa, campos, pkmodulo):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    tablas  = db.tablas(pkmodulo)
    funciones_campos = db.funciones_campos(tablas, campos)
    funciones_cab = funciones_campos[0]
    funciones_det = 0
    funciones_subdet = 0
    if len(tablas) > 1:
        funciones_det = funciones_campos[1]
    if len(tablas) > 2:
        funciones_subdet = funciones_campos[2]
    return [ funciones_cab, funciones_det, funciones_subdet]


def registro(request, Id_empresa, user): 
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    Permisos = db.permisos(user, request.POST.getlist('pk')[0])
    nuevo = 'No'
    modifica = 'No'
    eliminar = 'No'
    solos = 'No'
    for a in Permisos:
        if a['Nombre'] == 'Ingresar':
            nuevo ='Si'
        if a['Nombre'] == 'Modificar':
            modifica = 'Si'
        if a['Nombre'] == 'Eliminar':
            eliminar = 'Si'
        if a['Nombre'] == 'Solo':
            solos = 'Si'
    respuesta  = db.consulta_orden_web(request.POST.getlist('pk')[0], 10, user, solos)
    estru = db.traer_campos_por_pkestr_solo_visible(respuesta[0][0]["PkEstructura"])
    db_inter = web.con_db.inter_login_LOGIN("Mysql") 
    idioma_html = db_inter.traer_platilla('registro',request.POST.getlist('idioma')[0])
    context = {'estru':estru, 'sentencia_inicial':respuesta[4], 'idioma_html':idioma_html, 'tabla' :respuesta[0], 'names' :respuesta[2], 'dictlist' :respuesta[3], 'nuevo':nuevo, 'modifica':modifica, 'eliminar':eliminar, 'pestalla':request.POST.getlist('pestalla')[0]}
    return context

def pre_ejecutados(request, Id_empresa, user): 
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    pre_ejecutados = db.carga_pre_ejecutados(user)
    pre_valores = [] 
    db_re = web.con_db.inter_reporte_var(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    for a in pre_ejecutados:
        if a['tipo'] == 'Reporte':
            report = {}
            report['var'] = db_re.variables_reprotes(a['pk'])
            report['ref'] = db_re.referencias_reprotes(a['pk'])
            report['senten'] = db_re.sentencia_reprotes(a['pk'])
            report['main'] = db_re.main_reprotes(a['pk'])
            report['pk'] = a['pk']
            report['nombre'] = a['nombre']
            pre_valores.append(report)
    context = {'pre_valores':pre_valores}
    return context

@csrf_exempt
def ref_buscar(request, pkrefer):
    db = web.con_db.inter_ref_buscar(request.session['conn_user'],request.session['conn_pass'],request.session['conn_base'],request.session['conn_ip']) 
    campos = ""
    if request.method == 'GET':
        reportesreferencias = db.reportesreferencias(pkrefer)
        for p in reportesreferencias:            
            sentencia = "select "+p['campo'] +" as 'c_traer', "+ p['columnas'] + " from " + p['tabla'] + " limit 100" 
            campos = p['campo']
        refvalores = db.reportesreferencias_valores(sentencia)
        names = refvalores[0]  
        dictlist = refvalores[1]
        context = {'names' :names, 'dictlist' :dictlist, 'campos' :campos, 'pkrefer':pkrefer}
        return context
    else:
        if request.POST['Tipo'] == 'filtrar':
            for p in usuarios.objects.raw('select PkReferencia as "id", PkReporte as "pkreporte", Id as "id_rep", Campo as "campo", Columnas as "columnas", Tabla as "tabla", Glosa as "glosa", Nivel as "nivel", Multi as "multi" from reportesreferencias where PkReferencia = '+ pkrefer +' and nivel = 1'):
                sentencia = "select "+ p.columnas + " from " + p.tabla + " where " + request.POST['campo'] + " like '" +request.POST['valor']+ "%' limit 100" 
                campos = p.campo
            with connection.cursor() as cursor:
                cursor.execute(sentencia)
                dictlist = cursor.fetchall()
                names =  cursor.description
            context = {'names' :names, 'dictlist' :dictlist, 'campos' :campos, 'pkrefer':pkrefer}
            return context

def traer_usuario_n(request, Id_empresa): 
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    #d_estado = db.traer_estado(request.POST.getlist('pkestado')[0])
    d_usuario = db.carga_list_user_completa()
    d_paneles = db.carga_list_user_paneles()
    d_paneles_user = db.carga_list_user_paneles_user()
    context = {'list_paneles_usuario' :d_paneles_user,'list_paneles' :d_paneles,'list_usuario' :d_usuario, 'pestalla' :request.POST.getlist('pestalla')[0]}
    return context

def mod_usuario(request, Id_empresa): 
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    #d_estado = db.traer_estado(request.POST.getlist('pkestado')[0])
    usuario_actual = db.traer_usuario(request.POST.getlist('t_us_use')[0])
    clave = ''
    if request.POST.getlist('t_us_cla1')[0] != "":
        clave = hashear(request.POST.getlist('t_us_cla1')[0])
    request.POST.getlist('t_us_cla1')[0]
    db.borrar_paneles(request.POST.getlist('t_us_use')[0])
    if request.POST.getlist('tipo')[0] == '0':
        if len(usuario_actual) == 0:
            db.new_usuario(clave , request.POST.getlist('t_us_pk')[0],request.POST.getlist('t_us_use')[0],request.POST.getlist('t_us_nom')[0],request.POST.getlist('t_us_ape')[0],request.POST.getlist('t_us_car')[0],request.POST.getlist('t_us_cor')[0],request.POST.getlist('t_us_sri')[0],request.POST.getlist('t_us_adm')[0],request.POST.getlist('t_us_anu')[0])
            panels = request.POST.getlist('t_paneles')[0].split(',')
            for a in panels:
                db.acceso_panel(request.POST.getlist('t_us_use')[0], a)
            context = {'resp':'Usuario Ingresado','ok':1}
        else:
            context = {'resp':'Usuario ya Existe','ok':0}
    if request.POST.getlist('tipo')[0] == '1':
        if request.POST.getlist('t_us_pk')[0] == '':
            context = {'resp':'Seleccione un Usuario','ok':0}
        else:
            if len(usuario_actual) == 1:
                if str(usuario_actual[0]["PkUsuario"]) == str(request.POST.getlist('t_us_pk')[0]):
                    db.update_usuario(clave,request.POST.getlist('t_us_pk')[0],request.POST.getlist('t_us_use')[0],request.POST.getlist('t_us_nom')[0],request.POST.getlist('t_us_ape')[0],request.POST.getlist('t_us_car')[0],request.POST.getlist('t_us_cor')[0],request.POST.getlist('t_us_sri')[0],request.POST.getlist('t_us_adm')[0],request.POST.getlist('t_us_anu')[0])
                    panels = request.POST.getlist('t_paneles')[0].split(',')
                    for a in panels:
                        db.acceso_panel(request.POST.getlist('t_us_use')[0], a)
                    context = {'resp':'Usuario Modificado','ok':1}
                else:
                    context = {'resp':'Usuario ya Existe','ok':0}
            else:
                usuario_actualPK = db.traer_usuarioPk(request.POST.getlist('t_us_pk')[0])
                if len(usuario_actualPK) == 1:
                    db.update_usuario(clave,usuario_actualPK[0]["PkUsuario"],request.POST.getlist('t_us_use')[0],request.POST.getlist('t_us_nom')[0],request.POST.getlist('t_us_ape')[0],request.POST.getlist('t_us_car')[0],request.POST.getlist('t_us_cor')[0],request.POST.getlist('t_us_sri')[0],request.POST.getlist('t_us_adm')[0],request.POST.getlist('t_us_anu')[0])
                    panels = request.POST.getlist('t_paneles')[0].split(',')
                    for a in panels:
                        db.acceso_panel(request.POST.getlist('t_us_use')[0], a)
                    context = {'resp':'Usuario Modificado','ok':1} #cambio de user
                else:
                    context = {'resp':'Seleccione un Usuario','ok':0} #cambio de user
    if request.POST.getlist('tipo')[0] == '2':
        usuario_actualPK = db.traer_usuarioPk(request.POST.getlist('t_us_pk')[0])
        if len(usuario_actualPK) == 1:
            db.del_usuario(request.POST.getlist('t_us_pk')[0])
            context = {'resp':'Usuario Eliminado','ok':1}
        else:
            context = {'resp':'Seleccione un Usuario','ok':0}
    return context

def mod_usuario_cla(request, Id_empresa): 
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    #d_estado = db.traer_estado(request.POST.getlist('pkestado')[0])
    usuario_actual = db.traer_usuario(request.POST.getlist('usuario')[0])
    clave = hashear(request.POST.getlist('c_us_clave')[0])
    if len(usuario_actual) == 1:
        db.update_usuario_cla(clave, usuario_actual[0]["PkUsuario"])
        context = {'resp':'Clave Modificada','ok':1}
    else:
        context = {'resp':'Usuario No valido','ok':0} #cambio de user
    return context


def traer_acc_usuario(request, Id_empresa): 
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    lista_acceso = db.traer_acc_usuario(request.POST.getlist('user_acc')[0])
    context = {'lista_acceso':lista_acceso} 
    return context

def acc_usuario(request, Id_empresa): 
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    lista_modulos = db.traer_modulos(request.POST.getlist('usuario')[0])
    lista_modulos_gen = db.lista_modulos_gen(request.POST.getlist('usuario')[0])    
    listado_user = db.carga_list_user_completa()    
    context = {'lista_modulos':lista_modulos,'lista_modulos_gen':lista_modulos_gen,'listado_user':listado_user} #cambio de user
    return context

def cambio_estado(request, Id_empresa): 
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    d_estructuras = db.traer_estructuras(request.POST.getlist('pkmodulo')[0])
    d_registro = {}
    if len(d_estructuras) == 1:
        d_registro[d_estructuras[0]['Nombre']] = db.traer_registro_est(d_estructuras[0]['Nombre'], request.POST.getlist('pkregistro')[0])
        for a in d_registro[d_estructuras[0]['Nombre']]:
            for b in a:
                if str(type(a[b])) =="<class 'datetime.datetime'>":
                    a[b] = str(a[b])
                if str(type(a[b])) =="<class 'datetime.date'>":
                    a[b] = str(a[b])
    if len(d_estructuras) == 2:
        d_registro[d_estructuras[0]['Nombre']] = db.traer_registro_est(d_estructuras[0]['Nombre'], request.POST.getlist('pkregistro')[0])
        for a in d_registro[d_estructuras[0]['Nombre']]:
            for b in a:
                if str(type(a[b])) =="<class 'datetime.datetime'>":
                    a[b] = str(a[b])
                if str(type(a[b])) =="<class 'datetime.date'>":
                    a[b] = str(a[b])
        d_registro[d_estructuras[1]['Nombre']] = db.traer_registro_est_det(d_estructuras[1]['Nombre'], request.POST.getlist('pkregistro')[0])
    if len(d_estructuras) == 3:
        d_registro[d_estructuras[0]['Nombre']] = db.traer_registro_est(d_estructuras[0]['Nombre'], request.POST.getlist('pkregistro')[0])
        d_registro[d_estructuras[1]['Nombre']] = db.traer_registro_est_det(d_estructuras[1]['Nombre'], request.POST.getlist('pkregistro')[0])        
        for a in d_registro[d_estructuras[0]['Nombre']]:
            for b in a:
                if str(type(a[b])) =="<class 'datetime.datetime'>":
                    a[b] = str(a[b])
                if str(type(a[b])) =="<class 'datetime.date'>":
                    a[b] = str(a[b])
    d_estado_cond = db.traer_estado_cond(request.POST.getlist('pkestado')[0])
    d_estado_nomb = db.traer_estado_nombre(request.POST.getlist('pkestado')[0])   
    d_variables = json.loads(request.POST.get('variables'))

    for a in d_estado_cond:
        cond_sente = a['senten']
        cond_sente_var = a['variables'].split(',')
        cond_sente_val = a['valor'].split(',')
        for aa in cond_sente_var:
            cond_sente = cond_sente.replace('@'+str(aa),str(d_registro[d_estructuras[0]['Nombre']][0][aa]))
        tvalor = db.sql_traer_directo(cond_sente)
        if str(tvalor[0][cond_sente_val[0]]) != str(cond_sente_val[1]):
            context = {'msg' :a['msg_error'],'resultado' :'mal'}
            return context
    senten_acc = EjecutarAcciones(request, Id_empresa, request.POST.getlist('pkmodulo')[0], 'Estado='+ str(request.POST.getlist('pkestado')[0]), d_registro, d_variables)
    for a in senten_acc:
        db.sql_directo(a)
    senten_acc = EjecutarAcciones_FirmaPdf(request, Id_empresa, request.POST.getlist('pkmodulo')[0], 'Estado='+ str(request.POST.getlist('pkestado')[0]), d_registro)
    if len(senten_acc)>0:
        if senten_acc[0] == 'Error':
            context = {'msg' :'Error en acciones' + senten_acc[1],'resultado' :'mal', 'registro':'', 'tabla':d_estructuras[0]['Nombre'], 'pkregistro': request.POST.getlist('pkregistro')[0]}
            return context
    for a in senten_acc:
        db.sql_directo(a)

    display = d_estructuras[0]['Nombre']+ ": " + d_estado_nomb[0]['display']
    sente = 'insert into `llankay_log` (`sentencia`, `usuario`, `fecha`, `ip`) VALUES ("'+str(d_registro)+'", "'+str(request.POST.getlist('usuario')[0])+'", now(), "'+str(display)+'")'
    db.sql_directo(sente)
    regsitro_devuelto = db.traer_registro_est(d_estructuras[0]['Nombre'], request.POST.getlist('pkregistro')[0])
    context = {'msg' :'Cambio Exitoso','resultado' :'bien', 'registro':regsitro_devuelto, 'tabla':d_estructuras[0]['Nombre'], 'pkregistro': request.POST.getlist('pkregistro')[0]}

    return context

def regis_usuario(request, Id_empresa): 
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    ats_secciones = db.carga_secciones_ats()
    ats_valores = {}
    ats_valores['cabecera'] = db.sql_traer_directo('select * from xml_atm_cabecera')
    for a in ats_secciones:
        senten = a['query']
        senten = senten.replace('@fecha1',request.POST.getlist('fecha')[0])
        senten = senten.replace('@fecha2',request.POST.getlist('fecha')[0])
        senten = senten.replace('@fecha',request.POST.getlist('fecha')[0])
        ats_valores[a['xml']] = db.sql_traer_directo(senten)
    context = {'ats_valores' :ats_valores}
    return context

def unico(request, Id_empresa): 
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    sentencia = 'select COALESCE(sum(1),0) as "suma" from '+str(request.POST.getlist('tabla')[0])+' where Pk'+str(request.POST.getlist('tabla')[0])+' != '+str(request.POST.getlist('pk')[0])+' and '+str(request.POST.getlist('campo')[0])+' = "'+str(request.POST.getlist('valor')[0])+'"'
    resp = db.sql_traer_directo(sentencia)
    context = {'resp' :resp[0]['suma'], 'msg':str(request.POST.getlist('msg')[0])}
    return context

def SRI_ATS_sem(request, Id_empresa): 
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    ats_secciones = db.carga_secciones_ats('Semestre')
    ats_valores = {}
    ats_valores['cabecera'] = db.sql_traer_directo('select * from xml_atm_cabecera')
    for a in ats_secciones:
        senten = a['query']
        senten = senten.replace('@periodo',request.POST.getlist('sri_anio')[0])
        list_mes = ''
        if request.POST.getlist('sri_periodo')[0] == '06':
            list_mes = "(1,2,3,4,5,6)"
        if request.POST.getlist('sri_periodo')[0] == '12':
            list_mes = "(7,8,9,10,11,12)"
        senten = senten.replace("'@mes_list'",list_mes)
        ats_valores[a['xml']] = db.sql_traer_directo(senten)
    context = {'ats_valores' :ats_valores}
    return context

def SRI_ATS_mes(request, Id_empresa): 
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    ats_secciones = db.carga_secciones_ats('Mes')
    ats_valores = {}
    ats_valores['cabecera'] = db.sql_traer_directo('select * from xml_atm_cabecera')
    for a in ats_secciones:
        senten = a['query']
        senten = senten.replace('@fecha1',request.POST.getlist('fecha')[0])
        senten = senten.replace('@fecha2',request.POST.getlist('fecha')[0])
        senten = senten.replace('@fecha',request.POST.getlist('fecha')[0])
        ats_valores[a['xml']] = db.sql_traer_directo(senten)
    context = {'ats_valores' :ats_valores}
    return context

def reporte_var(request, Id_empresa): 
    db = web.con_db.inter_reporte_var(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    variables_reprotes = db.variables_reprotes(request.POST.getlist('pkrepo')[0])
    referencias_reprotes = db.referencias_reprotes(request.POST.getlist('pkrepo')[0])
    Resto_reporte = db.sentencia_reprotes(request.POST.getlist('pkrepo')[0])
    main_reporte = db.main_reprotes(request.POST.getlist('pkrepo')[0])
    context = {'pestalla' :request.POST.getlist('pestalla')[0],'Resto_reporte' :Resto_reporte, 'variables_reprotes' :variables_reprotes, 'referencias_reprotes' :referencias_reprotes, 'pkrepo' :request.POST.getlist('pkrepo')[0], 'nombre_rep':main_reporte[0]["Nombre"]}
    return context


def validar_user_empresa_admin(request, Id_empresa, usuario, clave):
    respuesta = []
    hash_clave = hashear(clave)
    db = web.con_db.inter_login_LOGIN("Mysql")
    dbEmpresa = db.traer_empresa(Id_empresa)
    if len(dbEmpresa) == 1:
        if not(request.session.has_key('conn_ip')):
            request.session['conn_user'] = {}
            request.session['conn_pass'] = {}
            request.session['conn_base'] = {}
            request.session['conn_ip'] = {}
        request.session['conn_user'].update({dbEmpresa[0]['Id_erp']:dbEmpresa[0]['conn_user']})
        request.session['conn_pass'].update({dbEmpresa[0]['Id_erp']:dbEmpresa[0]['conn_pass']})
        request.session['conn_base'].update({dbEmpresa[0]['Id_erp']:dbEmpresa[0]['conn_base']})
        request.session['conn_ip'].update({dbEmpresa[0]['Id_erp']:dbEmpresa[0]['conn_ip']})        
        request.session.save()
        log_empresa = dbEmpresa[0]['Negocio']
        db_cliente = web.con_db.externo_cliente(request.session['conn_user'][dbEmpresa[0]['Id_erp']],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
        db_cliente.crear_hash(usuario, hash_clave)
        usuario_ok = db_cliente.traer_usuarioSoloAdmin(usuario, hash_clave)
        if len(usuario_ok) == 1:
            menu = db_cliente.carga_menu(usuario)
            modulos = db_cliente.carga_modulos(usuario)
            opciones = db_cliente.carga_opciones(usuario)
            reportes = db_cliente.carga_reportes(usuario)
            list_user = db_cliente.carga_list_user()
            estados = db_cliente.carga_estados()
            respuesta.append("1")
            respuesta.append(usuario_ok)
            respuesta.append(menu)
            respuesta.append(modulos)
            respuesta.append(opciones)
            respuesta.append(reportes)
            respuesta.append(list_user)   
            respuesta.append(estados)
            respuesta.append(0)
            respuesta.append(log_empresa)
            respuesta.append(discksize(dbEmpresa[0]['Negocio'],  db_cliente.baseSize(request.session['conn_base'][Id_empresa])) )            
            return respuesta
        else:
            respuesta.append("0")
            return respuesta
    else:
        respuesta.append("0")
        return respuesta

def discksize(Id_empresa, base):
    # assign size
    size = 0
    
    # assign folder path
    Folderpath = 'media/archivos/' + str(Id_empresa)

    # get size
    for path, dirs, files in os.walk(Folderpath):
        for f in files:
            fp = os.path.join(path, f)
            size += os.path.getsize(fp)
    
    # display size
    #consumo = (((size /1024)/1024)/1024) + float(base[0]['gigas'])
    consumo =  float(base[0]['gigas'])
    porcen = round(1 - ((1 - round(consumo,1)) / 1),2)
    disponible = {'usado':round(consumo,2), 'max':1, 'pocen':porcen}
    return(disponible)

def discksize_media(Id_empresa):
    # assign size
    size = 0
    
    # assign folder path
    Folderpath = 'media/archivos/' + str(Id_empresa)

    # get size
    for path, dirs, files in os.walk(Folderpath):
        for f in files:
            fp = os.path.join(path, f)
            size += os.path.getsize(fp)
    
    # display size
    consumo = (((size /1024)/1024)/1024)
    porcen = round(1 - ((2 - round(consumo,2)) /2),2)
    disponible = {'usado':round(consumo,2), 'max':2, 'pocen':porcen}
    return(disponible)

def validar_user_empresa_soloval(request, Id_empresa, usuarios, clave):
    respuesta = []
    hash_clave = hashear(clave)
    db = web.con_db.inter_login_LOGIN("Mysql")
    dbEmpresa = db.traer_empresa(Id_empresa)
    if len(dbEmpresa) == 1:
        if dbEmpresa[0]["estado"] == "valido":
            log_empresa = dbEmpresa[0]['Negocio']
            db_cliente = web.con_db.externo_cliente(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
            usuario_ok = db_cliente.traer_usuario(usuarios, hash_clave)
            if len(usuario_ok) == 1:
                return 'ok'
            else:
                return 'no'        
    else:
        return 'no'        


            


def validar_user_empresa(request, Id_empresa, usuario, clave):
    respuesta = []
    hash_clave = hashear(clave)
    db = web.con_db.inter_login_LOGIN("Mysql")
    dbEmpresa = db.traer_empresa(Id_empresa)
    if len(dbEmpresa) == 1:
        if dbEmpresa[0]["estado"] == "valido":
            if not(request.session.has_key('conn_ip')):
                request.session['conn_user'] = {}
                request.session['conn_pass'] = {}
                request.session['conn_base'] = {}
                request.session['conn_ip'] = {}
                request.session['conn_port'] = {}
            if not(request.session.has_key('conn_port')):
                request.session['conn_port'] = {}
            request.session['conn_user'].update({Id_empresa:dbEmpresa[0]['conn_user']})
            request.session['conn_pass'].update({Id_empresa:dbEmpresa[0]['conn_pass']})
            request.session['conn_base'].update({Id_empresa:dbEmpresa[0]['conn_base']})
            request.session['conn_ip'].update({Id_empresa:dbEmpresa[0]['conn_ip']})     
            request.session['conn_port'].update({Id_empresa:dbEmpresa[0]['conn_port']})        
            request.session.save()
            log_empresa = dbEmpresa[0]['Negocio']
            db_cliente = web.con_db.externo_cliente(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa],request.session['conn_port'][Id_empresa]) 
            db_cliente.crear_hash(usuario, hash_clave)
            usuario_ok = db_cliente.traer_usuario(usuario, hash_clave)
            if len(usuario_ok) == 1:
                cal_accrap = db_cliente.cal_accrap(usuario)
                menu = db_cliente.carga_menu(usuario)
                modulos = db_cliente.carga_modulos(usuario)
                opciones = db_cliente.carga_opciones(usuario)
                reportes = db_cliente.carga_reportes(usuario)
                list_user = db_cliente.carga_list_user()
                estados = db_cliente.carga_estados()
                certificado = db_cliente.carga_certificado()
                #tareas = db_cliente.carga_list_areas()
                tareas = {}
                #list_areas =tareas[0]
                #list_project =tareas[1]
                list_areas = []
                list_project =[]

                datos_cuentas = db_cliente.carga_datos_cuentas() 

                if dbEmpresa[0]["cc_control"] == '':
                    db_agente = web.con_db.agente_central('root','123456789','cliente_dlm','127.0.0.1')    
                else:
                    db_agente_web = dbEmpresa[0]["cc_control"].split(',')
                    db_agente = web.con_db.agente_central(db_agente_web[0],db_agente_web[1],db_agente_web[2],db_agente_web[3]) 
                        
                datos_clientes = db_agente.traer_cupo(datos_cuentas[0]['numeroRuc']) 
                valores_cuentas = db_agente.traer_valores(datos_cuentas[0]['numeroRuc']) 
                sri_ingreso_rap = db_cliente.carga_sri_ingreso_rap()
                for sir_ing in sri_ingreso_rap:
                    sir_ing['referencias'] = db_cliente.carga_sri_ingreso_rap_referencias(sir_ing['pkmodulo'])
                    for reff in sir_ing['referencias']:
                        reff['valores'] =  db_cliente.sql_traer_directo(reff['senten'])
                val_pendiente = 0
                dias_pendientes = 0 
                for a in valores_cuentas:
                    if dias_pendientes < float(a['Dias']) and a['Estado'] == 'PENDIENTE':
                        val_pendiente = val_pendiente + float(a['Saldo_val']) 
                        dias_pendientes = float(a['Dias'])
                
                respuesta.append("1")
                respuesta.append(usuario_ok)
                respuesta.append(menu)
                respuesta.append(modulos)
                respuesta.append(opciones)
                respuesta.append(reportes)
                respuesta.append(list_user)   
                respuesta.append(estados)    
                respuesta.append(certificado[0]['Certificado'])
                respuesta.append(log_empresa)
                respuesta.append(list_areas)
                respuesta.append(list_project)
                respuesta.append(cal_accrap)
                respuesta.append(datos_cuentas)
                respuesta.append(valores_cuentas)
                respuesta.append("{:0,.2f}".format(val_pendiente))
                respuesta.append(dias_pendientes)
                respuesta.append(sri_ingreso_rap)
                respuesta.append(discksize(dbEmpresa[0]['Negocio'],  db_cliente.baseSize(request.session['conn_base'][Id_empresa])) )            
                return respuesta
            else:
                respuesta.append("0")
                return respuesta
        else:
            if dbEmpresa[0]["estado"] == "pago":
                respuesta.append("2")
                return respuesta
            else:
                if dbEmpresa[0]["estado"] == "activo":
                    respuesta.append("3")
                    return respuesta
                else:
                    respuesta.append("0")
                    return respuesta
    else:
        respuesta.append("0")
        return respuesta




def creacion_inicial(request, Id_empresa, clave, email):

    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    #usuario'
    sete= "create table `usuario` (  `PkUsuario` int(11) NOT NULL AUTO_INCREMENT,  `Usuario` varchar(50) NOT NULL,  `Clave` varchar(32) NOT NULL,  `Nombre` varchar(15) NOT NULL,  `Apellido` varchar(15) NOT NULL,  `Apellido2` varchar(15) DEFAULT NULL,  `Anulado` varchar(1) NOT NULL,  `FechaExpiracion` date NOT NULL,  `Admin` varchar(1) NOT NULL,  `Sri` varchar(1) DEFAULT 'N',  `Reportes` varchar(1) DEFAULT NULL,  `Campos` varchar(1) DEFAULT NULL,  `Plantillas` varchar(1) DEFAULT NULL,  `Acciones` varchar(1) DEFAULT NULL,  `Procesos_Modulos` varchar(1) DEFAULT NULL,  `Eliminar_Importar` varchar(1) DEFAULT NULL,  `Usuarios` varchar(1) DEFAULT NULL,  `hash` text,  `Cargo` text,  `Correo` text,  `Telefono` text,  PRIMARY KEY (`PkUsuario`)) ENGINE=InnoDB AUTO_INCREMENT=144 DEFAULT CHARSET=latin1"
    db.sql_directo(sete)

    sete = "insert into `usuario` (`Usuario`, `Clave`, `Nombre`, `Apellido`, `Apellido2`, `Anulado`, `FechaExpiracion`, `Admin`, `Sri`, `Reportes`, `Campos`, `Plantillas`, `Acciones`, `Procesos_Modulos`, `Eliminar_Importar`, `Usuarios`, `hash`, `Cargo`, `Correo`, `Telefono`) VALUES ('Admin', 'clas', 'nom', 'ap', 'ap', 'N', '2024-07-11', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', '" +str(clave)+ "', 'Administrador', '" + str(email) +"', 'tel')"
    db.sql_directo(sete)

    #web_a_alertas,
    sete="create table `web_a_alertas` (  `pkid` int(11) NOT NULL AUTO_INCREMENT,  `usuario` text,  `tabla` text,  `identificador` text,  `ultimo_identificador` text,  `sentencia` text,  `tipo_indi` text,  `logo` text,  `t_campo` text,  `val_msg` text,  PRIMARY KEY (`pkid`)) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1"
    db.sql_directo(sete)
    #web_a_auto_ejecutable,
    sete="create table `web_a_auto_ejecutable` (  `pkid` int(11) NOT NULL AUTO_INCREMENT,  `usuario` text,  `tipo` text,  `pk` text,  `nombre` text,  PRIMARY KEY (`pkid`)) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1"
    db.sql_directo(sete)
    #web_a_permisos,
    sete="create table `web_a_permisos` (  `pk` int(11) NOT NULL AUTO_INCREMENT,  `pkmodulo` int(11) DEFAULT NULL,  `usuario` text,  `ing` char(1) DEFAULT NULL,  `mod` char(1) DEFAULT NULL,  `con` char(1) DEFAULT NULL,  `eli` char(1) DEFAULT NULL,  `pkcabecera` int(11) DEFAULT NULL,  `tipo` char(1) DEFAULT NULL,  PRIMARY KEY (`pk`)) ENGINE=InnoDB AUTO_INCREMENT=2914 DEFAULT CHARSET=latin1"
    db.sql_directo(sete)


    #web_c_accrap,
    #sete="create table `web_c_accrap` (  `pk` int(11) NOT NULL AUTO_INCREMENT,  `nombre` text,  `pkmodulo` int(11) DEFAULT NULL,  `usuario` text,  PRIMARY KEY (`pk`)) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1"
    #db.sql_directo(sete)
    #web_c_charts,
    #sete="create table `web_c_charts` (  `pk` int(11) NOT NULL AUTO_INCREMENT,  `tipo` text,  `modelo` text,  `titulo` text,  `descripcion` text,  `sentencia` text,  `dato_x` text,  `dato_x_name` text,  `dato_y_name` text,  `usuario` text,  `label` text,  `html_class` text  PRIMARY KEY (`pk`)) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=latin1"
    #db.sql_directo(sete)

    #web_c_accrap
    sete="create table `web_c_accrap` (  `pk` int(11) NOT NULL AUTO_INCREMENT,  `nombre` text DEFAULT NULL,  `pkmodulo` int(11) DEFAULT NULL,  `usuario` text DEFAULT NULL,  PRIMARY KEY (`pk`)) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1"
    db.sql_directo(sete)
    #web_c_charts
    sete="create table `web_c_charts` (  `pk` int(11) NOT NULL AUTO_INCREMENT,  `tipo` text DEFAULT NULL,  `modelo` text DEFAULT NULL,  `titulo` text DEFAULT NULL,  `descripcion` text DEFAULT NULL,  `sentencia` text DEFAULT NULL,  `dato_x` text DEFAULT NULL,  `dato_x_name` text DEFAULT NULL,  `dato_y_name` text DEFAULT NULL,  `usuario` text DEFAULT NULL,  `label` text DEFAULT NULL,  `html_class` text DEFAULT NULL,  PRIMARY KEY (`pk`)) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=latin1"
    db.sql_directo(sete)




    #web_eshop_categ,
    sete="create table `web_eshop_categ` (  `pk` int(11) NOT NULL AUTO_INCREMENT,  `nivel` text,  `senten_cate` text,  `campo` text,  `senten_items` text,  PRIMARY KEY (`pk`)) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1"
    db.sql_directo(sete)
    #web_eshop_datos_items,
    sete="create table `web_eshop_datos_items` (  `pk` int(11) NOT NULL,  `tabla` varchar(255) DEFAULT NULL,  `condicion` varchar(255) DEFAULT NULL,  `cat_1` varchar(255) DEFAULT NULL,  `cat_2` varchar(255) DEFAULT NULL,  `prod_cod` varchar(255) DEFAULT NULL,  `prod_nom` varchar(255) DEFAULT NULL,  `prod_descr` varchar(255) DEFAULT NULL,  PRIMARY KEY (`pk`)) ENGINE=InnoDB DEFAULT CHARSET=latin1"
    db.sql_directo(sete)
    #web_eshop_main,
    sete="create table `web_eshop_main` (  `pk` int(11) NOT NULL AUTO_INCREMENT,  `senten_Cab` text,  `senten_subCat` text,  `senten_items` text,  `datos_telf` text,  `datos_fab` text,  `datos_inst` text,  `datos_tuiter` text,  `datos_dir` text,  `mapa` text,  `promo1_img` text,  `promo1_t1` text,  `promo1_t2` text,  `promo1_t3` text,  `promo2_img` text,  `promo2_t1` text,  `promo2_t2` text,  `promo2_t3` text,  `email` text,  `prod_cod` text,  `prod_nom` text,  `prod_descr` text,  `prod_cat` text,  `prod_cat2` text,  `senten_subCat2` varchar(255) DEFAULT NULL,  PRIMARY KEY (`pk`)) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1"
    db.sql_directo(sete)
    #web_eshop_msg,
    sete="create table `web_eshop_msg` (  `pkmensg` int(11) NOT NULL AUTO_INCREMENT,  `titulo` text,  `txt` text,  `img` text,  PRIMARY KEY (`pkmensg`)) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1"
    db.sql_directo(sete)
    #web_eshop_slider,
    sete="create table `web_eshop_slider` (  `pkslider` int(11) NOT NULL AUTO_INCREMENT,  `imgen` text,  `titulo1` text,  `titulo2` text,  `titulo3` text,  `precio` text,  `link` text,  `linkurl` text,  PRIMARY KEY (`pkslider`)) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1"
    db.sql_directo(sete)
    #web_estados_doc,
    sete="create table `web_estados_doc` (  `pkweb_estados_doc` int(11) NOT NULL AUTO_INCREMENT,  `PkModulo` int(11) DEFAULT NULL,  `c_estado` text,  `estado_inicial` text,  `estado_final` text,  `color` text,  `pkregistro` text,  `display` text,  `usuarios` text,  PRIMARY KEY (`pkweb_estados_doc`)) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=latin1"
    db.sql_directo(sete)
    #web_estados_doc_cond,
    sete="create table `web_estados_doc_cond` (  `pkcondicion` int(11) NOT NULL AUTO_INCREMENT,  `senten` text,  `valor` text,  `pkestado` int(11) DEFAULT NULL,  `variables` text,  `msg_error` text,  `msg_bien` text,  PRIMARY KEY (`pkcondicion`)) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=latin1"
    db.sql_directo(sete)
    #web_p_calendar,
    sete="create table `web_p_calendar` (  `pkCalen` int(255) NOT NULL AUTO_INCREMENT,  `nombre` text,  `usuario` text,  `senten` text,  `icono` text,  `fecha_vin` text,  `display` text,  `color` text,  `fecha_lapso` text,  `valor` text,  `tipo_link` varchar(255) DEFAULT NULL,  `link` varchar(255) DEFAULT NULL,  PRIMARY KEY (`pkCalen`)) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1"
    db.sql_directo(sete)
    #web_p_com_chk,
    sete="create table `web_p_com_chk` (  `pkcomentario` int(11) NOT NULL AUTO_INCREMENT,  `pknota` int(11) DEFAULT NULL,  `usuario` text,  `fecha` datetime DEFAULT NULL,  `responsable` text,  `tarea` text,  `check` text,  PRIMARY KEY (`pkcomentario`)) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT"
    db.sql_directo(sete)
    #web_p_com_doc,
    sete="create table `web_p_com_doc` (  `pkcomentario` int(11) NOT NULL AUTO_INCREMENT,  `pknota` int(11) DEFAULT NULL,  `usuario` text,  `fecha` datetime DEFAULT NULL,  `modulo` text,  `pkmodulo` int(11) DEFAULT NULL,  `pk` int(11) DEFAULT NULL,  `descripcion` text,  `identificador` text,  PRIMARY KEY (`pkcomentario`)) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT"
    db.sql_directo(sete)
    #web_p_com_file,
    sete="create table `web_p_com_file` (  `pkcomentario` int(11) NOT NULL AUTO_INCREMENT,  `pknota` int(11) DEFAULT NULL,  `usuario` text,  `nombre` text,  `fecha` datetime DEFAULT NULL,  `descrip` text,  `archivo` text,  PRIMARY KEY (`pkcomentario`)) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT"
    db.sql_directo(sete)
    #web_p_com_txt,
    sete="create table `web_p_com_txt` (  `pkcomentario` int(11) NOT NULL AUTO_INCREMENT,  `pk` int(11) DEFAULT NULL,  `origen` text,  `usuario` text,  `fecha` datetime DEFAULT NULL,  `texto` text,  `user_destino` text,  `visto` char(1) DEFAULT NULL,  `pkmodulo` int(11) DEFAULT NULL,  PRIMARY KEY (`pkcomentario`)) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT"
    db.sql_directo(sete)
    #web_p_comentario,
    sete="create table `web_p_comentario` (  `pkcomentario` int(11) NOT NULL AUTO_INCREMENT,  `pknota` int(11) DEFAULT NULL,  `usuario` text,  `nombre` text,  `fecha` datetime DEFAULT NULL,  `tipo` text,  `descrip` text,  `att1` text,  `att2` text,  `att3` text,  `att4` text,  `att5` text,  `att6` text,  PRIMARY KEY (`pkcomentario`)) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1"
    db.sql_directo(sete)
    #web_p_estado,
    sete="create table `web_p_estado` (  `pkestado` int(11) NOT NULL AUTO_INCREMENT,  `pkpanel` int(11) DEFAULT NULL,  `nombre` text,  `senten` text,  `pkmodulo` int(11) DEFAULT NULL,  PRIMARY KEY (`pkestado`)) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1"
    db.sql_directo(sete)
    #web_p_estado_docs,
    sete="create table `web_p_estado_docs` (  `pkid` int(11) NOT NULL AUTO_INCREMENT,  `pkestado` int(11) DEFAULT NULL,  `pkmodulo` int(255) DEFAULT NULL,  `nombre` text,  PRIMARY KEY (`pkid`)) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT"
    db.sql_directo(sete)
    #web_p_nota,
    sete="create table `web_p_nota` (  `pknota` int(11) NOT NULL AUTO_INCREMENT,  `pkestado` int(11) DEFAULT NULL,  `titulo` text,  `descripcion` text,  `fecha_inicio` date DEFAULT NULL,  `fecha_fin` date DEFAULT NULL,  `color` text,  `responable` text,  `ejecutor` text,  PRIMARY KEY (`pknota`)) ENGINE=InnoDB DEFAULT CHARSET=latin1"
    db.sql_directo(sete)
    #web_p_nota_docs,
    sete="create table `web_p_nota_docs` (  `pkid` int(11) NOT NULL AUTO_INCREMENT,  `pknota` int(11) DEFAULT NULL,  `pkmodulo` int(255) DEFAULT NULL,  `modulo` int(11) DEFAULT NULL,  `indentificador` text,  PRIMARY KEY (`pkid`)) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT"
    db.sql_directo(sete)
    #web_p_panel,
    sete="create table `web_p_panel` (  `pkPanel` int(255) NOT NULL AUTO_INCREMENT,  `nombre` text,  `grupos_nom` text,  `pkmodulo` int(11) DEFAULT NULL,  `valor` text,  `agrupar` text,  `tabla` text,  `visibles` text,  PRIMARY KEY (`pkPanel`)) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1"
    db.sql_directo(sete)
    #web_p_panel_grupos,
    sete="create table `web_p_panel_grupos` (  `pkgrupo` int(11) NOT NULL AUTO_INCREMENT,  `pkpanel` int(11) DEFAULT NULL,  `nombre` text,  `Campo` text,  `Valor` text,  `orderby` int(11) DEFAULT NULL,  `cond_base` text,  `visibles` text,  `nuevo` text,  PRIMARY KEY (`pkgrupo`)) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1"
    db.sql_directo(sete)
    #web_p_panel_items,
    sete="create table `web_p_panel_items` (  `pkind` int(11) NOT NULL AUTO_INCREMENT,  `pkpanel` int(11) DEFAULT NULL,  `pkgrupo` int(11) DEFAULT NULL,  `texto` text,  PRIMARY KEY (`pkind`)) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1"
    db.sql_directo(sete)
    #web_p_panel_user,
    sete="create table `web_p_panel_user` (  `pkid` int(11) NOT NULL AUTO_INCREMENT,  `usuario` text,  `pkpanel` int(11) DEFAULT NULL,  PRIMARY KEY (`pkid`)) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1"
    db.sql_directo(sete)
    #web_p_tareas,
    sete="create table `web_p_tareas` (  `pk` int(11) NOT NULL AUTO_INCREMENT,  `usuario` text,  `user_destino` text,  `tarea` text,  `fecha` date DEFAULT NULL,  `duracion` int(11) DEFAULT NULL,  `proyecto` text,  PRIMARY KEY (`pk`)) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=latin1"
    db.sql_directo(sete)
    #web_p_tareas_indi,
    sete="create table `web_p_tareas_indi` (  `pk` int(11) NOT NULL AUTO_INCREMENT,  `pktarea` int(11) DEFAULT NULL,  `tarea` varchar(255) DEFAULT NULL,  `estado` char(1) DEFAULT NULL,  `user_destino` text,  `fecha` date DEFAULT NULL,  `area` text,  `proyecto` text,  `horas` decimal(32,2) DEFAULT NULL,  PRIMARY KEY (`pk`)) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=latin1"
    db.sql_directo(sete)
    #web_p_tareas_senten,
    sete="create table `web_p_tareas_senten` (  `pk` int(11) NOT NULL AUTO_INCREMENT,  `Senten_area` text,  `Senten_proyectos` text,  PRIMARY KEY (`pk`)) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT"
    db.sql_directo(sete)
    #web_p_tareas_url
    sete="create table `web_p_tareas_url` (  `pk` int(11) NOT NULL AUTO_INCREMENT,  `nombre` text,  `url` text,  `pktar` int(11) DEFAULT NULL,  PRIMARY KEY (`pk`)) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT"
    db.sql_directo(sete)




    #REportes--------------------------------------------------
    #Modulos--------------------------------------------------
    #sysmodulogeneral
    sete="create table `sysmodulogeneral` (  `PkModGen` int(11) NOT NULL AUTO_INCREMENT,  `Nombre` text,  `Anulado` char(1) DEFAULT NULL,  `Orden` int(11) DEFAULT NULL,  `icono` text,  PRIMARY KEY (`PkModGen`)) ENGINE=InnoDB AUTO_INCREMENT=120 DEFAULT CHARSET=latin1"
    db.sql_directo(sete)
    #modulo
    sete="create table `modulo` (  `PkModulo` int(11) NOT NULL AUTO_INCREMENT,  `Nombre` text NOT NULL,  `Descripcion` text NOT NULL,  `Anulado` char(1) NOT NULL,  `Cabecera` int(11) NOT NULL,  `Orden` int(11) DEFAULT NULL,  `Plantilla` text,  `Imp_rap` text,  `ing_rap` text,  `modificable` char(2) DEFAULT NULL,  `exportable` text,  `mod_detalle` text,  `tipo` char(30) DEFAULT NULL,  PRIMARY KEY (`PkModulo`)) ENGINE=InnoDB AUTO_INCREMENT=631 DEFAULT CHARSET=latin1"
    db.sql_directo(sete)
    #estructura
    sete="create table `estructura` (  `PkEstructura` int(11) NOT NULL AUTO_INCREMENT,  `PkModulo` int(11) NOT NULL,  `Nombre` text NOT NULL,  `Descripcion` text NOT NULL,  `Anulado` char(1) NOT NULL,  `HijaDe` int(11) NOT NULL,  `X` decimal(10,2) DEFAULT '0.00',  `Y` decimal(10,2) DEFAULT '0.00',  `espacio` text,  PRIMARY KEY (`PkEstructura`,`PkModulo`)) ENGINE=InnoDB AUTO_INCREMENT=943 DEFAULT CHARSET=latin1"
    db.sql_directo(sete)
    #Modulos--------------------------------------------------



    
    #REportes--------------------------------------------------
    #reportesmain
    sete="create table `reportesmain` (  `PkReporte` int(11) NOT NULL AUTO_INCREMENT,  `Nombre` text,  `Descripcion` text,  `Anulado` char(1) DEFAULT NULL,  `PkModulo` int(11) DEFAULT NULL,  `cabeceras` text,  `formato` text,  `posicion` text,  `Arch_Excell` text,  `Con_detalle` text,  `Tipo` text,  PRIMARY KEY (`PkReporte`)) ENGINE=InnoDB AUTO_INCREMENT=249 DEFAULT CHARSET=latin1"
    db.sql_directo(sete)

    #reportesniveles
    sete="create table `reportesniveles` (  `Pkniveles` int(11) NOT NULL AUTO_INCREMENT,  `PkReporte` int(11) DEFAULT NULL,  `Nombre` text,  `Descripcion` text,  `Salto` varchar(2) DEFAULT NULL,  PRIMARY KEY (`Pkniveles`)) ENGINE=InnoDB AUTO_INCREMENT=7209 DEFAULT CHARSET=latin1"
    db.sql_directo(sete)
    #reportesqfrom
    sete="create table `reportesqfrom` (  `Pkqfrom` int(11) NOT NULL AUTO_INCREMENT,  `PkReporte` int(11) DEFAULT NULL,  `Sentencia` longtext,  `nivel` text,  PRIMARY KEY (`Pkqfrom`)) ENGINE=InnoDB AUTO_INCREMENT=7441 DEFAULT CHARSET=latin1"
    db.sql_directo(sete)
    #reportesqgrp
    sete="create table `reportesqgrp` (  `Pkqrest` int(11) NOT NULL AUTO_INCREMENT,  `PkReporte` int(11) DEFAULT NULL,  `Sentencia` longtext,  `nivel` text,  PRIMARY KEY (`Pkqrest`)) ENGINE=InnoDB AUTO_INCREMENT=7442 DEFAULT CHARSET=latin1"
    db.sql_directo(sete)
    #reportesqrest
    sete="create table `reportesqrest` (  `Pkqrest` int(11) NOT NULL AUTO_INCREMENT,  `PkReporte` int(11) DEFAULT NULL,  `Sentencia` longtext,  `nivel` text,  PRIMARY KEY (`Pkqrest`)) ENGINE=InnoDB AUTO_INCREMENT=7438 DEFAULT CHARSET=latin1"
    db.sql_directo(sete)
    #reportesqselect
    sete="create table `reportesqselect` (  `Pkqselect` int(11) NOT NULL AUTO_INCREMENT,  `PkReporte` int(11) DEFAULT NULL,  `Sentencia` longtext,  `nivel` text,  PRIMARY KEY (`Pkqselect`)) ENGINE=InnoDB AUTO_INCREMENT=7419 DEFAULT CHARSET=latin1"
    db.sql_directo(sete)
    #reportesqtotales
    sete="create table `reportesqtotales` (  `Pkqrest` int(11) NOT NULL AUTO_INCREMENT,  `PkReporte` int(11) DEFAULT NULL,  `Sentencia` longtext,  `nivel` text,  PRIMARY KEY (`Pkqrest`)) ENGINE=InnoDB AUTO_INCREMENT=2430 DEFAULT CHARSET=latin1"
    db.sql_directo(sete)
    #reportesqtraspaso
    sete="create table `reportesqtraspaso` (  `Pkqfrom` int(11) NOT NULL AUTO_INCREMENT,  `PkReporte` int(11) DEFAULT NULL,  `Sentencia` longtext,  `Nivel` int(11) DEFAULT NULL,  PRIMARY KEY (`Pkqfrom`)) ENGINE=InnoDB AUTO_INCREMENT=9805 DEFAULT CHARSET=latin1"
    db.sql_directo(sete)
    #reportesqvisibles
    sete="create table `reportesqvisibles` (  `Pkqvisibles` int(11) NOT NULL AUTO_INCREMENT,  `PkReporte` int(11) DEFAULT NULL,  `columnas` text,  `largos` text,  `nivel` int(11) DEFAULT NULL,  `Formato` text,  `Formato_det` text,  `tab` text,  `Lineas` text,  `Cabecera` text,  PRIMARY KEY (`Pkqvisibles`)) ENGINE=InnoDB AUTO_INCREMENT=3567 DEFAULT CHARSET=latin1"
    db.sql_directo(sete)
    #reportesqwhere
    sete="create table `reportesqwhere` (  `Pkqwhere` int(11) NOT NULL AUTO_INCREMENT,  `PkReporte` int(11) DEFAULT NULL,  `Sentencia` longtext,  `nivel` text,  PRIMARY KEY (`Pkqwhere`)) ENGINE=InnoDB AUTO_INCREMENT=7429 DEFAULT CHARSET=latin1"
    db.sql_directo(sete)
    #reportesreferencias
    sete="create table `reportesreferencias` (  `PkReferencia` int(11) NOT NULL AUTO_INCREMENT,  `PkReporte` int(11) DEFAULT NULL,  `Id` text,  `Campo` text,  `Columnas` text,  `Tabla` text,  `Order` text,  `Glosa` text,  `Nivel` text,  `Multi` text,  PRIMARY KEY (`PkReferencia`)) ENGINE=InnoDB AUTO_INCREMENT=4018 DEFAULT CHARSET=latin1"
    db.sql_directo(sete)
    #reportesvariables
    sete="create table `reportesvariables` (  `PkVariable` int(11) NOT NULL AUTO_INCREMENT,  `PkReporte` int(11) DEFAULT NULL,  `Id` text,  `Glosa` text,  `Tipo` text,  `nivel` text  PRIMARY KEY (`PkVariable`)) ENGINE=InnoDB AUTO_INCREMENT=6011 DEFAULT CHARSET=latin1"
    db.sql_directo(sete)
    #reporteswhere
    sete="create table `reporteswhere` (  `PkWhere` int(11) NOT NULL AUTO_INCREMENT,  `PkReporte` int(11) DEFAULT NULL,  `Tipo` text,  `Elemento` text,  `Origen` text,  `Funcion` text,  `Grupo` text,  PRIMARY KEY (`PkWhere`)) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=latin1"
    db.sql_directo(sete)
    #REportes--------------------------------------------------

def datos_negocio(request, Id_empresa, clave):
    db_inter = web.con_db.inter_login_LOGIN("Mysql")
    datos_cliente = db_inter.sql_traer_directo("Select * from empresas_erp where Id_erp = '" + str(Id_empresa)+ "' and u_clave = '"+str(clave)+"'")
    return datos_cliente[0]
def datos_negocio_manual(request, Id_empresa):
    db_inter = web.con_db.inter_login_LOGIN("Mysql")
    datos_cliente = db_inter.sql_traer_directo("Select * from empresas_erp where Id_erp = '" + str(Id_empresa)+ "'")
    return datos_cliente[0]

def restauracion_base_manual2(request, Id_empresa):
    db_inter = web.con_db.inter_login_LOGIN("Mysql")
    datos_cliente = db_inter.sql_traer_directo("Select * from empresas_erp where Id_erp = '" + str(Id_empresa)+ "'")

    if len(datos_cliente)==1:
        db = web.con_db.inter_registro(datos_cliente[0]['conn_user'],datos_cliente[0]['conn_pass'],datos_cliente[0]['conn_base'],datos_cliente[0]['conn_ip']) 
        #fd = open('cliente_base.sql', 'r')
        fd = open('cliente_base.sql', encoding="utf8")

        sqlFile = fd.read()
        fd.close()
        sqlCommands = sqlFile.split(';')
        ind = 0
        for command in sqlCommands:
            try:
                db.sql_directo(command)
                ind = ind + 1
            except:
                pass
        #usuario'
        sete = "delete from usuario"
        db.sql_directo(sete)
        sete = "insert into `usuario` (`Usuario`, `Clave`, `Nombre`, `Apellido`, `Apellido2`, `Anulado`, `FechaExpiracion`, `Admin`, `Sri`, `Reportes`, `Campos`, `Plantillas`, `Acciones`, `Procesos_Modulos`, `Eliminar_Importar`, `Usuarios`, `hash`, `Cargo`, `Correo`, `Telefono`) VALUES ('" +str(Id_empresa)+ "', 'clas', 'nom', 'ap', 'ap', 'N', '2024-07-11', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', '" +str(datos_cliente[0]['u_clave'])+ "', 'Administrador', '" + str(datos_cliente[0]['u_correo']) +"', 'tel')"
        db.sql_directo(sete)
        return sqlCommands[0]
       
def restauracion_base_manual(request, Id_empresa):
    def do_work(Id_empresa):
        db_inter = web.con_db.inter_login_LOGIN("Mysql")
        datos_cliente = db_inter.sql_traer_directo("Select * from empresas_erp where Id_erp = '" + str(Id_empresa)+ "'")

        if len(datos_cliente)==1:
            db = web.con_db.inter_registro(datos_cliente[0]['conn_user'],datos_cliente[0]['conn_pass'],datos_cliente[0]['conn_base'],datos_cliente[0]['conn_ip']) 
            #fd = open('cliente_base.sql', 'r')
            fd = open('cliente_base.sql', encoding="utf8")

            sqlFile = fd.read()
            fd.close()
            sqlCommands = sqlFile.split(';')
            ind = 0
            indm = 0
            for command in sqlCommands:
                try:
                    db.sql_directo(command)
                    ind = ind + 1
                    indm = indm + 1
                    if ind > 20:
                        yield "20"
                        ind = 0
                except:
                    pass
            #usuario'
            sete = "delete from usuario"
            db.sql_directo(sete)
            sete = "insert into `usuario` (`Usuario`, `Clave`, `Nombre`, `Apellido`, `Apellido2`, `Anulado`, `FechaExpiracion`, `Admin`, `Sri`, `Reportes`, `Campos`, `Plantillas`, `Acciones`, `Procesos_Modulos`, `Eliminar_Importar`, `Usuarios`, `hash`, `Cargo`, `Correo`, `Telefono`) VALUES ('" +str(Id_empresa)+ "', 'clas', 'nom', 'ap', 'ap', 'N', '2024-07-11', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', '" +str(datos_cliente[0]['u_clave'])+ "', 'Administrador', '" + str(datos_cliente[0]['u_correo']) +"', 'tel')"
            db.sql_directo(sete)
            return sqlCommands[0]
    return HttpResponse(do_work(Id_empresa))

def restauracion_base(request, Id_empresa, clave):
    db_inter = web.con_db.inter_login_LOGIN("Mysql")
    datos_cliente = db_inter.sql_traer_directo("Select * from empresas_erp where Id_erp = '" + str(Id_empresa)+ "' and u_clave = '"+str(clave)+"'")

    if len(datos_cliente)==1:
        db = web.con_db.inter_registro(datos_cliente[0]['conn_user'],datos_cliente[0]['conn_pass'],datos_cliente[0]['conn_base'],datos_cliente[0]['conn_ip']) 
        #fd = open('cliente_base.sql', 'r')
        fd = open('cliente_base.sql', encoding="utf8")

        sqlFile = fd.read()
        fd.close()
        sqlCommands = sqlFile.split(';')
        ind = 0
        for command in sqlCommands:
            try:
                db.sql_directo(command)
                ind = ind + 1
            except:
                pass
        sete = "delete from usuario"
        db.sql_directo(sete)
        sete = "insert into `usuario` (`Usuario`, `Clave`, `Nombre`, `Apellido`, `Apellido2`, `Anulado`, `FechaExpiracion`, `Admin`, `Sri`, `Reportes`, `Campos`, `Plantillas`, `Acciones`, `Procesos_Modulos`, `Eliminar_Importar`, `Usuarios`, `hash`, `Cargo`, `Correo`, `Telefono`) VALUES ('" +str(Id_empresa)+ "', 'clas', 'nom', 'ap', 'ap', 'N', '2024-07-11', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', '" +str(datos_cliente[0]['u_clave'])+ "', 'Administrador', '" + str(datos_cliente[0]['u_correo']) +"', 'tel')"
        db.sql_directo(sete)
        #return datos_cliente[0]
       

import hashlib

def hashear(clave):
    hash_object = hashlib.sha256(clave.encode())
    hex_dig = hash_object.hexdigest()
    return hex_dig
