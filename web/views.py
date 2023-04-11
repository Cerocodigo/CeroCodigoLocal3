
# -*- coding: utf-8 -*-

##from elementtree import ElementTree
#import xml.elementtree as ET2 # Python 2.5
#import xml.etree.elementtree as ET2 # Python 2.5
#import urllib2
import filecmp
import sys
import smtplib
import unicodedata
import datetime
import json
import random
import logging
logger = logging.getLogger(__name__)

from django.core.mail import EmailMessage

from time import strftime,localtime

# Create your views here.
from django.shortcuts import get_object_or_404, render
from django.http import Http404
from web.models import usuarios, documentos, ingresos
from django.core.exceptions import ObjectDoesNotExist
from suds.client import Client
from django.core.mail import send_mail, BadHeaderError
from django.http import HttpResponse, HttpResponseRedirect
import xml.etree.ElementTree as ET # Python 2.5
from lxml import etree
from datetime import datetime



from django.views.decorators.csrf import csrf_exempt
import urllib.request  #pyhton3
#from urllib2 import urlopen  #pyhton 2
import web.eshop
import web.con_db
import web.funciones_edocs
import web.paneles
import web.erp_log_menu
import web.charts
import web.cmpadmin
import web.firma_pdf
import web.pdf
import web.externo
import web.empaquetado



import os

from django.conf import settings

import sys

from dateutil import parser
from django.http import JsonResponse
from django.core.files.storage import default_storage


import smtplib, ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from os.path import basename

from django.shortcuts import redirect


from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings

from django.contrib.humanize.templatetags.humanize import intcomma




def PanelCambioTag(request):
    if request.method == 'POST':
        if request.session.has_key('conn_ip'):
            panel = web.paneles
            Respuesta = panel.cambiarfechaTag(request, request.POST.getlist('Id_empresa')[0], request.POST.getlist('usuario')[0], request.POST.getlist('t_pkpanel')[0], request.POST.getlist('fecha_new')[0], request.POST.getlist('fecha_old')[0], request.POST.getlist('T_usuario')[0], request.POST.getlist('T_valor')[0])
            context = Respuesta
            return JsonResponse(context)

def actualizar_campos(request):
    if request.method == 'POST':
        if request.session.has_key('conn_ip'):
            erp_data = web.cmpadmin
            Respuesta = erp_data.CampoXTabla(request, request.POST.getlist('Id_empresa')[0], request.POST.getlist('tabla')[0])
            context = Respuesta
            return JsonResponse(context)

def actualizar_tablas(request):
    if request.method == 'POST':
        if request.session.has_key('conn_ip'):
            erp_data = web.cmpadmin
            Respuesta = erp_data.tablasXmodulo(request,request.POST.getlist('Id_empresa')[0], request.POST.getlist('modulo')[0])
            context = Respuesta
            return JsonResponse(context)

def actualizar_procesos(request):
    if request.method == 'POST':
        if request.session.has_key('conn_ip'):
            erp_data = web.cmpadmin
            Respuesta = erp_data.procesos_todos(request, request.POST.getlist('Id_empresa')[0])
            context = Respuesta
            return JsonResponse(context)

def offline_inicial(request):
    if request.method == 'POST':
        if request.session.has_key('conn_ip'):
            erp_data = web.erp_log_menu
            Respuesta = erp_data.offline_inicial(request, request.POST.getlist('Id_empresa')[0], request.POST.getlist('usuario')[0])
            context = Respuesta
            return JsonResponse(context)



def reporte_empaquetado(request):
    if request.method == 'POST':
        if request.session.has_key('conn_ip'):
            erp_data = web.erp_log_menu
            Respuesta = erp_data.reporte_empaquetado(request, request.POST.getlist('Id_empresa')[0], request.POST.getlist('usuario')[0], request.POST.getlist('t_pkreporte')[0])
            context = Respuesta
            return JsonResponse(context)

def notificaciones_buscar(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':            
            erp_data = web.erp_log_menu
            notificaciones = erp_data.Notificaciones(request, request.POST.getlist('Id_empresa')[0], request.POST.getlist('usuario')[0])            
            return JsonResponse(notificaciones)


def logExterno(request):
    db = web.con_db.inter_login_LOGIN("Mysql") 
    ext = web.externo
    if request.method == 'POST':
        #erp_data = web.erp_log_menu
        #Respuesta = erp_data.validar_user_empresa(request, l_inputEmpresa, l_inputUsuario, l_inputPassword)
        if request.POST.getlist('ingreso')[0] == 'crear':
            negocio_nom = db.traer_negocio(negocio)
            acceso = ext.acceso_externo(request, negocio_nom, negocio)
            Respuesta = ext.validar_user_externo(request, negocio, request.POST.getlist(acceso[0]['Usuario'])[0], 'hidden')
            if Respuesta['Existe'] == 'No': ##log in raro
                #insertar directo usuerio externo y lo busca
                acceso = ext.acceso_externo_insertar(request, negocio_nom)            
                Respuesta = ext.validar_user_externo(request, negocio, request.POST.getlist(acceso[0]['Usuario'])[0], 'hidden')
                if Respuesta['Existe'] == 'Si': ##log in raro
                    #acceso = ext.acceso_externo(request, negocio)
                    dd = datetime.datetime.now().strftime("%Y-%m-%d")
                    context = {'usuarioExterno':request.POST.getlist(acceso[0]['Usuario'])[0],'Empresa':negocio, 'paneles':Respuesta['paneles'], 'cal_accrap':Respuesta['cal_accrap'], 'Id_empresa':negocio, 'web_idioma':'esp', 't_anio':str(datetime.datetime.now().strftime("%Y")),'t_mes':str(datetime.datetime.now().strftime("%m")), 'fecha':dd}
                    return render(request, 'home_erp_externo.html', context)
            if Respuesta['Existe'] == 'Si': ##log in raro
                #acceso = ext.acceso_externo(request, negocio)
                dd = datetime.datetime.now().strftime("%Y-%m-%d")
                context = {'usuarioExterno':request.POST.getlist(acceso[0]['Usuario'])[0],'Empresa':negocio, 'paneles':Respuesta['paneles'], 'cal_accrap':Respuesta['cal_accrap'], 'Id_empresa':negocio, 'web_idioma':'esp', 't_anio':str(datetime.datetime.now().strftime("%Y")),'t_mes':str(datetime.datetime.now().strftime("%m")), 'fecha':dd}
                return render(request, 'home_erp_externo.html', context)
        if request.POST.getlist('ingreso')[0] == 'directo':
            #busca directo el usuario sobre lat abla 
            Respuesta = ext.validar_user_externo(request, request.POST.getlist('Id_empresa')[0], request.POST.getlist('t_inputUsuario')[0], request.POST.getlist('t_inputPassword')[0])
            if Respuesta['Existe'] == 'Si': ##log in raro
                #acceso = ext.acceso_externo(request, negocio)
                negocio_nom = db.traer_negocio(request.POST.getlist('Id_empresa')[0])
                dd = datetime.datetime.now().strftime("%Y-%m-%d")
                web_calendar = ext.acceso_externoCalen_inicio(request, negocio_nom, request.POST.getlist('Id_empresa')[0])
                context = {'web_calendar':web_calendar, 'Existe':'Si','usuarioExterno':request.POST.getlist('t_inputUsuario')[0],'cal_accrap':Respuesta['cal_accrap'], 't_anio':str(datetime.datetime.now().strftime("%Y")),'t_mes':str(datetime.datetime.now().strftime("%m")), 'fecha':dd, 'datos_accose':Respuesta['datos_accose']}
                return JsonResponse(context)

            if Respuesta['Existe'] == 'No':     
                ##negocio_nom = db.traer_negocio(request.POST.getlist('Id_empresa')[0])
                ##acceso = ext.acceso_externo(request, negocio_nom, request.POST.getlist('Id_empresa')[0])
                context = {'Existe':'No'}
                return JsonResponse(context)



def externo(request, negocio):
    db = web.con_db.inter_login_LOGIN("Mysql") 
    ext = web.externo
    if request.method == 'GET':
        negocio_nom = db.traer_negocio(negocio)
        if len(negocio_nom) == 1:
            acceso = ext.acceso_externo(request, negocio_nom, negocio)
            web_calendar = ext.acceso_externoCalen_inicio(request, negocio_nom, negocio)
            context = {'Empresa':negocio, 'msg':'', 'acceso':acceso[0], 'web_calendar':web_calendar}
            return render(request, 'login_ext.html', context)
        else:
            context = {'msg':'Negocio no existe'}
            return render(request, 'page_404.html', context)
    if request.method == 'POST':
        #erp_data = web.erp_log_menu
        #Respuesta = erp_data.validar_user_empresa(request, l_inputEmpresa, l_inputUsuario, l_inputPassword)
        if request.POST.getlist('ingreso')[0] == 'crear':
            negocio_nom = db.traer_negocio(negocio)
            acceso = ext.acceso_externo(request, negocio_nom, negocio)
            #Respuesta = ext.validar_user_externo(request, negocio, request.POST.getlist(acceso[0]['Usuario'])[0], 'hidden')
            t_usuario = request.POST.getlist(acceso[0]['Usuario'])[0]
            Respuesta = ext.validar_user_externo(request, negocio, t_usuario, 'hidden')
            if Respuesta['Existe'] == 'No': ##log in raro
                #insertar directo usuerio externo y lo busca
                acceso = ext.acceso_externo_insertar(request, negocio_nom)            
                Respuesta = ext.validar_user_externo(request, negocio, t_usuario, 'hidden')
                if Respuesta['Existe'] == 'Si': ##log in raro
                    #acceso = ext.acceso_externo(request, negocio)
                    from datetime import datetime
                    fechaCalendario = datetime.strptime(request.POST.getlist('fecha')[0].replace('T', ' '), '%Y-%m-%d') 
                    context = {'usuarioExterno':request.POST.getlist(acceso[0]['Usuario'])[0],'Empresa':negocio, 'paneles':Respuesta['paneles'], 'cal_accrap':Respuesta['cal_accrap'], 'Id_empresa':negocio, 'web_idioma':'esp', 't_anio':str(fechaCalendario.strftime("%Y")),'t_mes':str(fechaCalendario.strftime("%m")), 'fecha':fechaCalendario.strftime("%Y-%m-%d %H:%M:%S"), 'calen_tipo':request.POST.getlist('calendario')[0], 'DisplayCalendario':Respuesta['datos_accose'][0]['DisplayCalendario']}
                    return render(request, 'home_erp_externo.html', context)
            if Respuesta['Existe'] == 'Si': ##log in raro
                #acceso = ext.acceso_externo(request, negocio)
                from datetime import datetime
                fechaCalendario = datetime.strptime(request.POST.getlist('fecha')[0].replace('T', ' '), '%Y-%m-%d')
                context = {'usuarioExterno':request.POST.getlist(acceso[0]['Usuario'])[0],'Empresa':negocio, 'paneles':Respuesta['paneles'], 'cal_accrap':Respuesta['cal_accrap'], 'Id_empresa':negocio, 'web_idioma':'esp', 't_anio':str(fechaCalendario.strftime("%Y")),'t_mes':str(fechaCalendario.strftime("%m")), 'fecha':fechaCalendario.strftime("%Y-%m-%d %H:%M:%S"), 'calen_tipo':request.POST.getlist('calendario')[0], 'DisplayCalendario':Respuesta['datos_accose'][0]['DisplayCalendario']}
                return render(request, 'home_erp_externo.html', context)
        if request.POST.getlist('ingreso')[0] == 'directo':
            #busca directo el usuario sobre lat abla 
            Respuesta = ext.validar_user_externo(request, request.POST.getlist('negocio')[0], request.POST.getlist('t_inputUsuario')[0], request.POST.getlist('t_inputPassword')[0])
            if Respuesta['Existe'] == 'Si': ##log in raro
                #acceso = ext.acceso_externo(request, negocio)
                #ni idea porque no sale directo
                from datetime import datetime

                fechaCalendario = datetime.strptime(request.POST.getlist('fecha')[0].replace('T', ' '), '%Y-%m-%d')
                #dd = datetime.datetime.now().strftime("%Y-%m-%d")
                context = {'usuarioExterno':request.POST.getlist('t_inputUsuario')[0],'Empresa':negocio, 'paneles':Respuesta['paneles'], 'cal_accrap':Respuesta['cal_accrap'], 'Id_empresa':negocio, 'web_idioma':'esp', 't_anio':str(fechaCalendario.strftime("%Y")),'t_mes':str(fechaCalendario.strftime("%m")), 'fecha':fechaCalendario.strftime("%Y-%m-%d %H:%M:%S"), 'calen_tipo':request.POST.getlist('calendario')[0], 'DisplayCalendario':Respuesta['datos_accose'][0]['DisplayCalendario']}
                return render(request, 'home_erp_externo.html', context)
            if Respuesta['Existe'] == 'No':     
                negocio_nom = db.traer_negocio(negocio)
                acceso = ext.acceso_externo(request, negocio_nom, negocio)
                context = {'Empresa':negocio, 'msg':'No existe', 'acceso':acceso[0]}
                return render(request, 'login_ext.html', context)


def myfunction(request):
	logger.debug("this is a debug message!")

def myotherfunction(request):
	logger.error("this is an error message!!")

def cmpadmin_grabar(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':            
            cmpadmin = web.cmpadmin
            t_dataCampo = json.loads(request.POST.getlist('t_dataCampostr')[0])     
            dat_conn = {'conn_user':request.session['conn_user'][request.POST.getlist('Id_empresa')[0]],'conn_pass':request.session['conn_pass'][request.POST.getlist('Id_empresa')[0]],'conn_base':request.session['conn_base'][request.POST.getlist('Id_empresa')[0]],'conn_ip':request.session['conn_ip'][request.POST.getlist('Id_empresa')[0]]}         
            t_dataX = json.loads(request.POST.getlist('t_dataXstr')[0])     
            if request.POST.getlist('es_nuevo')[0] == 'false':
                es_nuevo = False
            else:
                es_nuevo = True
            resp_campo = cmpadmin.cmpadmin_grabar(dat_conn, request.POST.getlist('zona')[0], es_nuevo , request.POST.getlist('pkid')[0], request.POST.getlist('fuente')[0], request.POST.getlist('t_pkmodulo')[0], request.POST.getlist('t_pkestructura')[0], t_dataCampo, t_dataX, request.POST.getlist('tabla_nombre')[0], request.POST.getlist('cmp_nombre')[0], request.POST.getlist('cmp_display')[0])
            resp_campo['tem_pestalla'] = request.POST.getlist('tem_pestalla')[0]
            return JsonResponse(resp_campo)

def menu_add_reporte(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':            
            erp_data = web.erp_log_menu
            resp_reporte_nuevo = erp_data.menu_add_reporte(request, request.POST.getlist('Id_empresa')[0], request.POST.getlist('nombre')[0], request.POST.getlist('PkModulo')[0], request.POST.getlist('usuario')[0])            
            return JsonResponse(resp_reporte_nuevo)

def menu_add_proceso(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':            
            erp_data = web.erp_log_menu
            resp_modulo_nuevo = erp_data.menu_add_proceso(request, request.POST.getlist('Id_empresa')[0], request.POST.getlist('nombre')[0], request.POST.getlist('tipo')[0], request.POST.getlist('PkModGen')[0], request.POST.getlist('usuario')[0])            
            return JsonResponse(resp_modulo_nuevo)


def menu_proceso_editar_orden(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':            
            erp_data = web.erp_log_menu
            resp_modulo = erp_data.menu_proceso_editar_orden(request, request.POST.getlist('Id_empresa')[0], request.POST.getlist('pkmodulo1')[0],request.POST.getlist('pkmodulo2')[0])           
            return JsonResponse(resp_modulo)

def menu_editar_atributos(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':            
            erp_data = web.erp_log_menu
            resp_modulo = erp_data.menu_editar_atributos(request, request.POST.getlist('Id_empresa')[0], request.POST.getlist('PkModGen')[0],request.POST.getlist('icono')[0],request.POST.getlist('nombre')[0])           
            return JsonResponse(resp_modulo)

def menu_editar_orden(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':            
            erp_data = web.erp_log_menu
            resp_modulo = erp_data.menu_editar_orden(request, request.POST.getlist('Id_empresa')[0], request.POST.getlist('PkModGen1')[0],request.POST.getlist('PkModGen2')[0])           
            return JsonResponse(resp_modulo)

def menu_eliminar_modulo(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':            
            erp_data = web.erp_log_menu
            resp_modulo = erp_data.menu_eliminar_modulo(request, request.POST.getlist('Id_empresa')[0], request.POST.getlist('PkModGen')[0])           
            return JsonResponse(resp_modulo)


def modulos_procesos(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':            
            erp_data = web.erp_log_menu
            resp_modulo = erp_data.traer_modulos_procesos(request, request.POST.getlist('Id_empresa')[0])           
            return JsonResponse(resp_modulo)


def menu_add_modulo(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':            
            erp_data = web.erp_log_menu
            resp_modulo_nuevo = erp_data.menu_add_modulo(request, request.POST.getlist('Id_empresa')[0], request.POST.getlist('nombre')[0], request.POST.getlist('icono')[0])           
            return JsonResponse(resp_modulo_nuevo)


def mediaPeso(request, negocio):
    erp_data = web.erp_log_menu
    peso = erp_data.discksize_media(negocio)
    context = {'peso':peso}
    return JsonResponse(context)


@csrf_exempt
def ccimagenes_post(request):
    myfile = request.FILES['files']
    path = default_storage.save('archivos/'+ str(request.POST.getlist('Id_empresa')[0]) + '/' + str(request.POST.getlist('id_archivo')[0]), ContentFile(myfile.read()))
    tmp_file = os.path.join(settings.STATIC_URL, path)
    context = {'ok':''}
    return JsonResponse(context)

@csrf_exempt
def ccimagenes(request):
    myfile = request.FILES['files']
    filename = str(myfile)
    filename = filename.replace('Ñ','N')
    filename = filename.replace('ñ','n')
    filename = filename.replace('á','a')
    filename = filename.replace('é','e')
    filename = filename.replace('í','i')
    filename = filename.replace('ó','o')
    filename = filename.replace('ú','u')

    path = default_storage.save('archivos/'+ str(request.POST.getlist('Id_empresa')[0]) + '/' + filename, ContentFile(myfile.read()))
    tmp_file = os.path.join(settings.STATIC_URL, path)
    context = {'ok':''}
    return JsonResponse(context)

@csrf_exempt
def ccsubirFirmas(request):
    myfile = request.FILES['files']
    path = default_storage.save('firma/'+ str(request.POST.getlist('Id_empresa')[0]) + '/' + str(myfile), ContentFile(myfile.read()))
    tmp_file = os.path.join(settings.STATIC_URL, path)
    context = {'ok':''}
    return JsonResponse(context)
    

def procesar_import_proceso(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':            
            dict_importar = json.loads(request.POST.getlist('arr_final')[0])              
            erp_data = web.erp_log_menu
            traer_campos = erp_data.traer_campos_panel_directo_pkmodulo(request, request.POST.getlist('Id_empresa')[0], request.POST.getlist('t_pkmodulo')[0])
            traer_campos_funciones = erp_data.traer_campos_funciones_directo(request, request.POST.getlist('Id_empresa')[0], traer_campos, request.POST.getlist('t_pkmodulo')[0])           
            procecados = erp_data.procesar_import_proceso(request, request.POST.getlist('Id_empresa')[0], dict_importar, traer_campos, traer_campos_funciones, traer_campos['tabla_cab'])

            context = {'procecados':procecados}
            return JsonResponse(context)


def procesar_import_previa(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        
            traer_campos = erp_data.traer_campos_panel_directo_pkmodulo(request, request.POST.getlist('Id_empresa')[0], request.POST.getlist('V_pkmodulo')[0])
            traer_campos_funciones = erp_data.traer_campos_funciones_directo(request, request.POST.getlist('Id_empresa')[0], traer_campos, request.POST.getlist('V_pkmodulo')[0])
            context = traer_campos
            context.update({'func_cab':traer_campos_funciones[0]})
            return JsonResponse(context)

def dropbox(request):
    t_acces = 'sl.BDyMkR1G7UY-jPGgq9tusmGkWb6nfHlxh9ffcbf_ISGWX2qC3hId4Ab4pobLE2HiKLo7EUFs-JdQOUepM8XErA4a0RVYnEu_kBIUCWnaJ82i-XmGkhw2XhPpvKuBIJrd5EGOyGfaDh84'
    myfile = request.FILES['files']
    dbox = web.dropbox.dropbox_class(t_acces, '/nlubkov/' + str(request.POST.getlist('nombre')[0])) 
    dbox.link()
    t = 'C:/Users/nlubk/Desktop/pago.pdf'
    dbox.subirdirecto(myfile)  # ContentFile(myfile.read())
    context = {'viewss':0}
    return JsonResponse(context)

def aproduccion(request):
    return redirect("/esp/log")


    
    
def creando_cuentas(request):
    db = web.con_db.inter_login_LOGIN("Mysql")

    idioma_html = db.traer_platilla('log', 'esp')
    if request.method == 'POST':
        usuario_existentes = db.valusuario_existe_user(request.POST.getlist('userId_erp')[0],request.POST.getlist('userCorreo')[0],request.POST.getlist('userId')[0])
        if len(usuario_existentes) == 0:
            cod_activar = random.randint(10000, 99999)
            subject = 'CeroCodigo' + request.POST.getlist('userId_erp')[0]
            message ='Para activar cuenta www.cerocodigo.com/activar/' + str(cod_activar )
            #envio_email(request.POST.getlist('userCorreo')[0], message, 'Activacion cuenta', cod_activar)
            db.usuario_existe_crear(request.POST.getlist('userId_erp')[0], request.POST.getlist('userId')[0], request.POST.getlist('userRazonSocial')[0], request.POST.getlist('userNombreComercial')[0], request.POST.getlist('userCorreo')[0], request.POST.getlist('userTipo')[0], hashear(str(request.POST.getlist('userClave1')[0])), cod_activar, request.POST.getlist('userClaveElect')[0], request.POST.getlist('userContri')[0], request.POST.getlist('userObligado')[0], request.POST.getlist('userDireccion')[0], request.POST.getlist('userRegimenMicroempresas')[0], request.POST.getlist('userAgenteRetencion')[0])
            makemydir('media/archivos/' + str(request.POST.getlist('userId_erp')[0]))
            mylogo = request.FILES['logos']
            path = default_storage.save('archivos/'+ str(request.POST.getlist('userId_erp')[0]) + '/logo.png', ContentFile(mylogo.read()))
            tmp_logo = os.path.join(settings.STATIC_URL, path)
            #myp12 = request.FILES['fileP12']
            #path = default_storage.save('archivos/'+ str(request.POST.getlist('userId_erp')[0]) + '/firma.p12', ContentFile(myp12.read()))
            activar_usuario_directo(request, cod_activar)
            context = {'idioma_html':idioma_html, 'msg':'Creando', 'resp':'ok'}
            return JsonResponse(context)
        else:
            context = {'idioma_html':idioma_html, 'msg':'Datos ya existen, probar nuevos', 'resp':'no'}
            return JsonResponse(context)
    else:
        context = {'idioma_html':idioma_html, 'msg':'', 'resp':'no'}
        return render(request, 'creando_cuentas.html', context)     

def crear_usuario_promo(request):
    db = web.con_db.inter_login_LOGIN("Mysql")

    idioma_html = db.traer_platilla('log', 'esp')
    if request.method == 'POST':
        usuario_existentes = db.valusuario_existe_user(request.POST.getlist('userId_erp')[0],request.POST.getlist('userCorreo')[0],request.POST.getlist('userId')[0])
        if len(usuario_existentes) == 0:
            cod_activar = random.randint(10000, 99999)
            subject = 'CeroCodigo' + request.POST.getlist('userId_erp')[0]
            message ='Para activar cuenta www.cerocodigo.com/activar/' + str(cod_activar )
            #envio_email(request.POST.getlist('userCorreo')[0], message, 'Activacion cuenta', cod_activar)
            db.usuario_existe_crear(request.POST.getlist('userId_erp')[0], request.POST.getlist('userId')[0], request.POST.getlist('userRazonSocial')[0], request.POST.getlist('userNombreComercial')[0], request.POST.getlist('userCorreo')[0], request.POST.getlist('userTipo')[0], hashear(str(request.POST.getlist('userClave1')[0])), cod_activar, request.POST.getlist('userClaveElect')[0], request.POST.getlist('userContri')[0], request.POST.getlist('userObligado')[0], request.POST.getlist('userDireccion')[0], request.POST.getlist('userRegimenMicroempresas')[0], request.POST.getlist('userAgenteRetencion')[0])
            makemydir('media/archivos/' + str(request.POST.getlist('userId_erp')[0]))
            mylogo = request.FILES['logos']
            path = default_storage.save('archivos/'+ str(request.POST.getlist('userId_erp')[0]) + '/logo.png', ContentFile(mylogo.read()))
            tmp_logo = os.path.join(settings.STATIC_URL, path)
            myp12 = request.FILES['fileP12']
            path = default_storage.save('archivos/'+ str(request.POST.getlist('userId_erp')[0]) + '/firma.p12', ContentFile(myp12.read()))
            activar_usuario_directo(request, cod_activar)
            context = {'idioma_html':idioma_html, 'msg':'Creando', 'resp':'ok'}
            return JsonResponse(context)
        else:
            context = {'idioma_html':idioma_html, 'msg':'Datos ya existen, probar nuevos', 'resp':'no'}
            return JsonResponse(context)
    else:
        context = {'idioma_html':idioma_html, 'msg':'', 'resp':'no'}
        return render(request, 'creandopromo.html', context)     

def demo_views(request):
    db = web.con_db.inter_login_LOGIN("Mysql")
    viewss = db.views_demo()
    context = {'viewss':viewss}
    return render(request, 'demo_views.html', context)


def grabar_automatico(request):
    edocs = web.funciones_edocs
    context = edocs.edocs_ingresos_masivos(request, request.POST.getlist('Id_empresa')[0], request.POST.getlist('usuario')[0])
    return JsonResponse(context)


def Subcribete(request, negocio):
    db = web.con_db.inter_login_LOGIN("Mysql") 
    eshop_data = web.eshop
    if request.method == 'POST':
        negocio_nom = db.traer_negocio(negocio)
        if len(negocio_nom) == 1:
            datos_eshop = eshop_data.Subcribete(request, negocio_nom)
            return JsonResponse(datos_eshop)
        else:
            return JsonResponse({'respuesta':0})

def chek_out_terminar(request, negocio):
    db = web.con_db.inter_login_LOGIN("Mysql") 
    eshop_data = web.eshop
    if request.method == 'GET':
        negocio_nom = db.traer_negocio(negocio)
        if len(negocio_nom) == 1:
            datos_eshop = eshop_data.chek_out_terminar(request, negocio_nom)
            return JsonResponse(datos_eshop)
        else:
            return JsonResponse({'respuesta':0})

def eshop_bus_pedido(request, negocio, v_numero):
    db = web.con_db.inter_login_LOGIN("Mysql") 
    eshop_data = web.eshop
    if request.method == 'GET':
        negocio_nom = db.traer_negocio(negocio)
        if len(negocio_nom) == 1:
            datos_eshop = eshop_data.eshop_bus_pedido(request, negocio_nom, v_numero, negocio)
            return render(request, 'eshop_checkout_pedido.html', datos_eshop)
        else:
            context = {'msg':'Negocio no existe'}
            return render(request, 'page_404.html', context)

def eshop_promo(request, negocio):
    db = web.con_db.inter_login_LOGIN("Mysql") 
    eshop_data = web.eshop
    if request.method == 'POST':
        negocio_nom = db.traer_negocio(negocio)
        if len(negocio_nom) == 1:
            datos_eshop = eshop_data.eshop_promo(request, negocio_nom)
            return JsonResponse(datos_eshop)
        else:
            return JsonResponse({'respuesta':0})
def chek_out_confimr(request, negocio):
    db = web.con_db.inter_login_LOGIN("Mysql") 
    eshop_data = web.eshop
    if request.method == 'POST':
        negocio_nom = db.traer_negocio(negocio)
        if len(negocio_nom) == 1:
            datos_eshop = eshop_data.chek_out_confimr(request, negocio_nom, negocio)
            return JsonResponse(datos_eshop)
        else:
            return JsonResponse({'respuesta':0})


def pago(request, negocio):
    db = web.con_db.inter_login_LOGIN("Mysql") 
    eshop_data = web.eshop
    if request.method == 'GET':
        negocio_nom = db.traer_negocio(negocio)
        if len(negocio_nom) == 1:
            datos_eshop = eshop_data.eshop_checkout(request, negocio_nom)
            return render(request, 'pagos.html', datos_eshop)
        else:
            context = {'msg':'Negocio no existe'}
            return render(request, 'page_404.html', context)

def chek_out_data(request, negocio):
    db = web.con_db.inter_login_LOGIN("Mysql") 
    eshop_data = web.eshop
    if request.method == 'POST':
        negocio_nom = db.traer_negocio(negocio)
        if len(negocio_nom) == 1:
            datos_eshop = eshop_data.chek_out_data(request, negocio_nom)
            return JsonResponse(datos_eshop)
        else:
            return JsonResponse({'respuesta':0})

def eshop_checkout_final(request, negocio):
    db = web.con_db.inter_login_LOGIN("Mysql") 
    eshop_data = web.eshop
    if request.method == 'POST':
        negocio_nom = db.traer_negocio(negocio)
        if len(negocio_nom) == 1:
            datos_eshop = eshop_data.eshop_checkout_final(request, negocio_nom)
            return JsonResponse(datos_eshop)
        else:
            return JsonResponse({'respuesta':0})

def eshop_checkout(request, negocio):
    db = web.con_db.inter_login_LOGIN("Mysql") 
    eshop_data = web.eshop
    if request.method == 'GET':
        negocio_nom = db.traer_negocio(negocio)
        if len(negocio_nom) == 1:
            datos_eshop = eshop_data.eshop_checkout(request, negocio_nom)
            return render(request, 'eshop_checkout.html', datos_eshop)
        else:
            context = {'msg':'Negocio no existe'}
            return render(request, 'page_404.html', context)

def eshop_borrar_cod(request, negocio):
    db = web.con_db.inter_login_LOGIN("Mysql") 
    eshop_data = web.eshop
    negocio_nom = db.traer_negocio(negocio)
    if len(negocio_nom) == 1:
        context = eshop_data.eshop_borrar_cod(request, negocio_nom)
        return JsonResponse(context)
    else:
        return JsonResponse({'respuesta':0})

def eshop_mod_cod(request, negocio):
    db = web.con_db.inter_login_LOGIN("Mysql") 
    eshop_data = web.eshop
    if request.method == 'POST':
        negocio_nom = db.traer_negocio(negocio)
        if len(negocio_nom) == 1:
            context = eshop_data.eshop_mod_cod(request, negocio_nom)
            return JsonResponse(context)
        else:
            return JsonResponse({'respuesta':0})

def eshop_add_cod(request, negocio):
    db = web.con_db.inter_login_LOGIN("Mysql") 
    eshop_data = web.eshop
    if request.method == 'POST':
        negocio_nom = db.traer_negocio(negocio)
        if len(negocio_nom) == 1:
            context = eshop_data.eshop_add_cod(request, negocio_nom)
            return JsonResponse(context)
        else:
            return JsonResponse({'respuesta':0})

def edocs_subir_sri(request):
    edocs = web.funciones_edocs
    context = edocs.edocs_subir_sri(request, request.POST.getlist('Id_empresa')[0])
    return JsonResponse(context)
    
def edocs_eliminaredocs(request):
    edocs = web.funciones_edocs
    context = edocs.edocs_eliminaredocs(request, request.POST.getlist('Id_empresa')[0])
    return JsonResponse(context)

def xmlload2(request):
    edocs = web.funciones_edocs
    return HttpResponse(edocs.xmlload2(request, request.POST.getlist('Id_empresa')[0],request.POST.getlist('id_ruc')[0] ))

def edocs_data_sri(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            edocs = web.funciones_edocs        
            context = edocs.edocs_data_sri(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)

def edocs_sri(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            edocs = web.funciones_edocs        
            context = edocs.edocs_sri(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)

def arreglo_base(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        
            context = erp_data.arreglo_base(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)


def firma_grabar(request):
    if request.method == 'POST':
        if request.session.has_key('conn_ip'):
            firmas = web.firma_pdf
            context = firmas.firmasxGrabar(request, request.POST.getlist('Id_empresa')[0], request.POST.getlist('usuario')[0])         
            return JsonResponse(context)

def firma_usuario(request):
    if request.method == 'POST':
        if request.session.has_key('conn_ip'):
            firmas = web.firma_pdf
            context = firmas.firmasxUsuarios(request, request.POST.getlist('usuario')[0], request.POST.getlist('Id_empresa')[0])         
            return JsonResponse(context)

def ficha_new(request):
    if request.method == 'POST':
        if request.session.has_key('conn_ip'):
            paneles_data = web.paneles
            context = paneles_data.ficha_new(request, request.POST.getlist('Id_empresa')[0])         
            return JsonResponse(context)

def eliminar_error(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        
            context = erp_data.eliminar_error(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)

def al_errores(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        
            context = erp_data.al_errores(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)

def crear_new(request):
    db = web.con_db.inter_login_LOGIN("Mysql") 
    context = {'msg':'Crear Cliente base'}             
    return render(request, 'auto_clave.html',context)


def mover_dir_ficha(request):
    if request.method == 'POST':
        if request.session.has_key('conn_ip'):
            paneles_data = web.paneles
            fecha_new = paneles_data.determinar_fecha_sub_paneles(request, request.POST.getlist('Id_empresa')[0], request.POST.getlist('usuario')[0], request.POST.getlist('t_tabla')[0], request.POST.getlist('pkvalor')[0],request.POST.getlist('t_campo')[0],request.POST.getlist('t_fecha')[0],request.POST.getlist('t_filtro')[0],request.POST.getlist('t_dir')[0])
            if len(fecha_new) == 1:
                context = {'resp':1,'fecha_new':fecha_new[0]['newfecha']}
            else:
                context = {'resp':0}                
            return JsonResponse(context)


def pdf_ficha_server_test(request):
    pdf = web.pdf
    pdf.prueba()
    context = {'msg':'Crear Cliente base'}             
    return render(request, 'auto_clave.html',context)

def email_ficha_server(request):
    if request.method == 'POST':
        if request.session.has_key('conn_ip'):
            if request.POST.getlist('modelo')[0] == 'Hoja':
                respuesta =pdf_ficha_server(request)
            if request.POST.getlist('modelo')[0] == 'Continua':
                respuesta =pdf_ficha_server_continua(request)
            ##doc = respuesta['pdf_fianl']
            pdf = json.loads(respuesta.content.decode("utf-8") )              
            envio_email_pdf2(request.POST.getlist('para')[0], request.POST.getlist('nombre')[0], pdf['pdf_fianl'],  request.POST.getlist('Id_empresa')[0])
            context = {'ok':'Si'}             
            return JsonResponse(context)

def envio_email_pdf2(para, por, pdf, negocio):
    msg = """
    Envio Automatico de $cod1$. 
    Adjunto Pdf /$cod2$.

    No responda a este correo
    """
    msg= str(msg).replace("$cod1$",str(negocio))
    msg= str(msg).replace("$cod2$",str(pdf))

    #send_mail(por, msg, 'documentos@cerocodigo.com',[para])

    mail = EmailMessage(por, msg, 'documentos@cerocodigo.com', [para])
    pdffile = open(pdf, "rb").read()
    mail.attach('archivo.pdf', pdffile, 'application/pdf')
    mail.send()






def envio_emailPdf(para, por, pdf, negocio):
    sender_email = "documentos@cerocodigo.com"
    receiver_email = para
    password = '@Dmin1992'

    message = MIMEMultipart("alternative")
    message["Subject"] = por
    message["From"] = sender_email
    message["To"] = receiver_email

    # Create the plain-text and HTML version of your message
    text = """\
    Envio Automatico de $cod1$. 
    Adjunto Pdf $cod2$.

    No responde a este correo
    """
    html = """\
    <html>
      <body>
        <p>Envio Automatico de $cod1$.<br>
           Adjunto Pdf $cod2$. <a href="/media/firma/DLM/$cod2$"> Click aqui </a>
        </p>
      </body>
    </html>
    """

    # Turn these into plain/html MIMEText objects
    html= str(html).replace("$cod2$",str(pdf))
    text= str(text).replace("$cod2$",str(pdf))
    html= str(html).replace("$cod1$",str(negocio))
    text= str(text).replace("$cod1$",str(negocio))

    part1 = MIMEText(text, "plain")
    part2 = MIMEText(html, "html")

    # Add HTML/plain-text parts to MIMEMultipart message
    # The email client will try to render the last part first
    message.attach(part1)
    message.attach(part2)
            
    # with open(pdf, "rb") as fil:
    #     part = MIMEApplication(
    #         fil.read(),
    #         Name=basename(pdf)
    #     )
    # # After the file is closed
    # part['Content-Disposition'] = 'attachment; filename="%s"' % basename(pdf)
    # message.attach(part)

    # Create secure connection with server and send email
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.ipage.com", 465, context=context) as server:  #465
        server.login(sender_email, password)
        server.sendmail(
            sender_email, receiver_email, message.as_string()
        )


def pdf_ficha_tagElimnar(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        
            context = erp_data.pdf_ficha_tagElimnar(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)

def pdf_ficha_server_continua(request):
    if request.method == 'POST':
        if request.session.has_key('conn_ip'):
            #erp_data = web.erp_log_menu        
            #data_pdf = erp_data.pdf_ficha(request, request.POST.getlist('Id_empresa')[0])
            pdf = web.pdf
            firma = web.firma_pdf 
            #datos_firma = firma.traerdatos(request, request.POST.getlist('usuario')[0], request.POST.getlist('Id_empresa')[0], request.POST.getlist('t_pkpaneL_g')[0], 'panel')

            datos_pdf = pdf.crear_pdf_panel_continua(request, request.POST.getlist('Id_empresa')[0])
            pdffile = datos_pdf[0]
            if len(datos_pdf[1]) > 0:
                datos_firma = firma.traerdatos_bloque(request, request.POST.getlist('Id_empresa')[0], datos_pdf[1])
                pdf_fianl = firma.firmar(pdffile, request.POST.getlist('Id_empresa')[0] , datos_firma)     
                if pdf_fianl[1] == 'ok':
                    #existe file de adjuntos
                    archi_zip = ''
                    if len(datos_pdf) == 3:
                        #hay adjuntos
                        if len(datos_pdf[2]) > 0:
                            ##armarcarpeta de zip descarga con todo....
                            empaquetador = web.empaquetado
                            archi_zip = empaquetador.armar_empaquetadoAdjuntos(request.POST.getlist('Id_empresa')[0], datos_pdf[2])
                    context = {'pdf_fianl':pdf_fianl[0], 'ok':'Si', 'archi_zip':archi_zip}             
                    return JsonResponse(context)                
                else:
                    context = {'pdf_fianl':pdf_fianl[0], 'ok':'No','msg':'Invalid password or PKCS12 data'}             
                    return JsonResponse(context)   
            else:
                archi_zip = ''
                if len(datos_pdf) == 3:
                    #hay adjuntos
                    if len(datos_pdf[2]) > 0:
                        ##armarcarpeta de zip descarga con todo....
                        empaquetador = web.empaquetado
                        archi_zip = empaquetador.armar_empaquetadoAdjuntos(request.POST.getlist('Id_empresa')[0], datos_pdf[2])                            
                context = {'pdf_fianl':pdffile, 'ok':'Si', 'archi_zip':archi_zip}             
                return JsonResponse(context)



def pdf_ficha_server(request):
    if request.method == 'POST':
        if request.session.has_key('conn_ip'):
            #erp_data = web.erp_log_menu        
            #data_pdf = erp_data.pdf_ficha(request, request.POST.getlist('Id_empresa')[0])
            pdf = web.pdf
            firma = web.firma_pdf 
            #datos_firma = firma.traerdatos(request, request.POST.getlist('usuario')[0], request.POST.getlist('Id_empresa')[0], request.POST.getlist('t_pkpaneL_g')[0], 'panel')

            datos_pdf = pdf.crear_pdf_panel(request, request.POST.getlist('Id_empresa')[0])
            pdffile = datos_pdf[0]
            if len(datos_pdf[1]) > 0:
                datos_firma = firma.traerdatos_bloque(request, request.POST.getlist('Id_empresa')[0], datos_pdf[1])

                pdf_fianl = firma.firmar(pdffile, request.POST.getlist('Id_empresa')[0] , datos_firma)     
                if pdf_fianl[1] == 'ok':
                    context = {'pdf_fianl':pdf_fianl[0], 'ok':'Si'}             
                    return JsonResponse(context)                
                else:
                    context = {'pdf_fianl':pdf_fianl[0], 'ok':'No','msg':pdf_fianl[2]}             
                    return JsonResponse(context)   
            else:
                context = {'pdf_fianl':pdffile, 'ok':'Si'}             
                return JsonResponse(context)

def pdf_ficha(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        
            context = erp_data.pdf_ficha(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)

def nuevo_dir_ficha(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        
            context = erp_data.nuevo_dir_ficha(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)

def nuevo_dir_ficha_multi(request):
    print('entro')
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        
            context = erp_data.nuevo_dir_ficha_multi(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)



def cambio_dir_reget(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        
            context = erp_data.cambio_dir_reget(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)



def traer_ficha_valores(request):
    if request.method == 'POST':
        if request.session.has_key('conn_ip'):
            paneles_data = web.paneles
            Respuesta = paneles_data.traer_sub_paneles(request, request.POST.getlist('Id_empresa')[0], request.POST.getlist('usuario')[0], request.POST.getlist('t_pkpanel')[0], request.POST.getlist('pkvalor')[0], request.POST.getlist('v_fecha')[0], request.POST.getlist('v_user')[0])  
            context = Respuesta
            return JsonResponse(context)



def traer_ficha_imagen(request):
    if request.method == 'POST':
        if request.session.has_key('conn_ip'):
            paneles_data = web.paneles
            Respuesta = paneles_data.traer_sub_paneles_Imagen(request, request.POST.getlist('Id_empresa')[0], request.POST.getlist('usuario')[0], request.POST.getlist('t_pkpanel')[0], request.POST.getlist('pkvalor')[0], request.POST.getlist('v_fecha')[0])
            context = Respuesta
            return JsonResponse(context)


def makemydir(whatever):
  try:
    os.makedirs(whatever)
  except OSError:
    pass
  # let exception propagate if we just can't
  # cd into the specified directory
  os.chdir(whatever)


def catalogo(request):
    db = web.con_db.inter_login_LOGIN("Mysql")
    demos = db.demos_traer()
    ingresos(visita_fecha=datetime.datetime.now(), visita_ip=get_ip(request), fuente='Catalogo')
    context = {'demos':demos}
    return render(request, 'catalogo.html', context)


def enviar_mensaje(request):
    sender_email = "documentos@cerocodigo.com"
    receiver_email = "info@cerocodigo.com"
    password = '@Dmin1992'

    message = MIMEMultipart("alternative")
    message["Subject"] = 'Formulario Web CeroCodigo'
    message["From"] = sender_email
    message["To"] = receiver_email

    # Create the plain-text and HTML version of your message
    text = """\
    Consulta,
    Nombre: $nombre$.
    Email: $Email$
    Telefono: $Telefono$    
    Fecha: $fecha$, $hora$
    Mensaje
    $mensaje$
    Modulos
    $modulos$
    """
    html = """\
    <html>
      <body>
        <p>Nombre: $nombre$.</p>
        <p>Email: $Email$ </p> 
        <p>Telefono: $Telefono$ </p> 
        <p>Fecha: $fecha$, $hora$ </p>
        Mensaje <br>
        <p>$mensaje$</p>
        <br>
        <p>$modulos$</p>
      </body>
    </html>
    """

    # Turn these into plain/html MIMEText objects

    html= str(html).replace("$modulos$",str(request.POST.getlist('userc_modulos')[0]))
    text= str(html).replace("$modulos$",str(request.POST.getlist('userc_modulos')[0]))
    
    html= str(html).replace("$nombre$",str(request.POST.getlist('userc_name')[0]))
    text= str(html).replace("$nombre$",str(request.POST.getlist('userc_name')[0]))

    html= str(html).replace("$Email$",str(request.POST.getlist('userc_email')[0]))
    text= str(html).replace("$Email$",str(request.POST.getlist('userc_email')[0]))

    html= str(html).replace("$mensaje$",str(request.POST.getlist('userc_message')[0]))
    text= str(html).replace("$mensaje$",str(request.POST.getlist('userc_message')[0]))

    html= str(html).replace("$fecha$",str(request.POST.getlist('userc_fecha')[0]))
    text= str(html).replace("$fecha$",str(request.POST.getlist('userc_fecha')[0]))

    html= str(html).replace("$hora$",str(request.POST.getlist('userc_hora')[0]))
    text= str(html).replace("$hora$",str(request.POST.getlist('userc_hora')[0]))

    html= str(html).replace("$Telefono$",str(request.POST.getlist('userc_telefono')[0]))
    text= str(html).replace("$Telefono$",str(request.POST.getlist('userc_telefono')[0]))
    part1 = MIMEText(text, "plain")
    part2 = MIMEText(html, "html")

    # Add HTML/plain-text parts to MIMEMultipart message
    # The email client will try to render the last part first
    message.attach(part1)
    message.attach(part2)

    # Create secure connection with server and send email
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.ipage.com", 465, context=context) as server:  #465
        server.login(sender_email, password)
        server.sendmail(
            sender_email, receiver_email, message.as_string()
        )
    return HttpResponse("Mensaje Enviado")



def envio_email(para, msg, por, val):
    sender_email = "documentos@cerocodigo.com"
    receiver_email = para
    password = '@Dmin1992'

    message = MIMEMultipart("alternative")
    message["Subject"] = por
    message["From"] = sender_email
    message["To"] = receiver_email

    # Create the plain-text and HTML version of your message
    text = """\
    Hola,
    Para activar tu cuenta debes ingresar.
    www.cerocodigo.com/activar/$cod$
    """
    html = """\
    <html>
      <body>
        <p>Hola,<br>
           Para activar tu cuenta debes ingresar.<br>
           <a href="http://www.cerocodigo.com/activar/$cod$">Click aqui</a> o www.cerocodigo.com/activar/$cod$
        </p>
      </body>
    </html>
    """

    # Turn these into plain/html MIMEText objects
    html= str(html).replace("$cod$",str(val))
    part1 = MIMEText(text, "plain")
    part2 = MIMEText(html, "html")

    # Add HTML/plain-text parts to MIMEMultipart message
    # The email client will try to render the last part first
    message.attach(part1)
    message.attach(part2)

    # Create secure connection with server and send email
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.ipage.com", 465, context=context) as server:  #465
        server.login(sender_email, password)
        server.sendmail(
            sender_email, receiver_email, message.as_string()
        )

def envio_email_rest(para, por, idneg):
    sender_email = "documentos@cerocodigo.com"
    receiver_email = para
    password = '@Dmin1992'

    message = MIMEMultipart("alternative")
    message["Subject"] = por
    message["From"] = sender_email
    message["To"] = receiver_email

    # Create the plain-text and HTML version of your message
    text = """\
    Hola,
    Tu sistema esta listo para usar.
    Recuerda tienes que poner tu ruc y datos 
    www.cerocodigo.com/esp/adm
    """
    
    html = """\
    <html>
      <body>
        <p>Hola,<br>
           Tu sistema esta listo para usar.<br> Recuerda tienes que poner tu ruc y datos 
           <a href="http://www.cerocodigo.com/esp/log">Click aqui</a> o www.cerocodigo.com/esp/adm
        </p>
      </body>
    </html>
    """

    # Turn these into plain/html MIMEText objects
    part1 = MIMEText(text, "plain")
    part2 = MIMEText(html, "html")

    # Add HTML/plain-text parts to MIMEMultipart message
    # The email client will try to render the last part first
    message.attach(part1)
    message.attach(part2)

    # Create secure connection with server and send email
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.ipage.com", 465, context=context) as server:  #465
        server.login(sender_email, password)
        server.sendmail(
            sender_email, receiver_email, message.as_string()
        )


def mod_grabar_datosuser(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        
            context = erp_data.mod_grabar_datosuser(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)



def traer_datosuser_n(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        
            context = erp_data.traer_datosuser_n(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)


def restamanual(request, Id_empresa):
    if request.session.has_key('conn_ip'):
        if request.method == 'GET':
            erp_data = web.erp_log_menu      
            datis = erp_data.datos_negocio_manual(request, Id_empresa)
            subject = 'Cuenta CeroCodigo ' + str(Id_empresa) + " se esta Activando toma 20 min"
            envio_email_rest(datis['u_correo'], subject, Id_empresa)  
            respuesta = erp_data.restauracion_base_manual(request, Id_empresa)
            subject = 'Cuenta CeroCodigo ' + str(Id_empresa) + " Activada"
            envio_email_rest(datis['u_correo'], subject, Id_empresa)
            return HttpResponse("que chuuu   " + str(respuesta))



def restaurar(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu      
            datis = erp_data.datos_negocio(request, request.POST.getlist('Id_empresa')[0], request.POST.getlist('clavehash')[0])
            subject = 'Cuenta CeroCodigo ' + request.POST.getlist('Id_empresa')[0] + " se esta Activando toma 20 min"
            envio_email_rest(datis['u_correo'], subject, request.POST.getlist('Id_empresa')[0])  
            erp_data.restauracion_base(request, request.POST.getlist('Id_empresa')[0], request.POST.getlist('clavehash')[0])
            subject = 'Cuenta CeroCodigo ' + request.POST.getlist('Id_empresa')[0] + " Activada"
            envio_email_rest(datis['u_correo'], subject, request.POST.getlist('Id_empresa')[0])



def crear_usuario(request):
    db = web.con_db.inter_login_LOGIN("Mysql")

    idioma_html = db.traer_platilla('log', 'esp')
    if request.method == 'POST':
        usuario_existentes = db.valusuario_existe_user(request.POST.getlist('userId_erp')[0],request.POST.getlist('userCorreo')[0],request.POST.getlist('userId')[0])
        if len(usuario_existentes) == 0:
            cod_activar = random.randint(10000, 99999)
            subject = 'CeroCodigo' + request.POST.getlist('userId_erp')[0]
            message ='Para activar cuenta www.cerocodigo.com/activar/' + str(cod_activar )
            #envio_email(request.POST.getlist('userCorreo')[0], message, 'Activacion cuenta', cod_activar)
            db.usuario_existe_crear(request.POST.getlist('userId_erp')[0], request.POST.getlist('userId')[0], request.POST.getlist('userRazonSocial')[0], request.POST.getlist('userNombreComercial')[0], request.POST.getlist('userCorreo')[0], request.POST.getlist('userTipo')[0], hashear(str(request.POST.getlist('userClave1')[0])), cod_activar, request.POST.getlist('userClaveElect')[0], request.POST.getlist('userContri')[0], request.POST.getlist('userObligado')[0], request.POST.getlist('userDireccion')[0], request.POST.getlist('userRegimenMicroempresas')[0], request.POST.getlist('userAgenteRetencion')[0])
            makemydir('media/archivos/' + str(request.POST.getlist('userId_erp')[0]))
            mylogo = request.FILES['logos']
            path = default_storage.save('archivos/'+ str(request.POST.getlist('userId_erp')[0]) + '/logo.png', ContentFile(mylogo.read()))
            tmp_logo = os.path.join(settings.STATIC_URL, path)
            myp12 = request.FILES['fileP12']
            path = default_storage.save('archivos/'+ str(request.POST.getlist('userId_erp')[0]) + '/firma.p12', ContentFile(myp12.read()))
            activar_usuario_directo(request, cod_activar)
            context = {'idioma_html':idioma_html, 'msg':'Creando', 'resp':'ok'}
            return JsonResponse(context)
        else:
            context = {'idioma_html':idioma_html, 'msg':'Datos ya existen, probar nuevos', 'resp':'no'}
            return JsonResponse(context)
    else:
        context = {'idioma_html':idioma_html, 'msg':'', 'resp':'no'}
        return render(request, 'creando.html', context)          

def activar_usuario_directo(request, Clave_act):
    db = web.con_db.inter_login_LOGIN("Mysql")
    idioma_html = db.traer_platilla('log', 'esp')
    clave_vale = db.clave_vale(Clave_act)
    if len(clave_vale) == 1:
        if clave_vale[0]['estado'] == 'NoActivo':
            clave_base = random.randint(100000, 999999)
            cod_hash= hashear(str(clave_base))
            db.crear_base(clave_vale[0]["Id_erp"])
            db.crearusuario(clave_vale[0]["Id_erp"], clave_base)
            db.actDatosErp(clave_vale[0]["Id_erp"], clave_base)
            if not(request.session.has_key('conn_ip')):
                request.session['conn_user'] = {}
                request.session['conn_pass'] = {}
                request.session['conn_base'] = {}
                request.session['conn_ip'] = {}
                request.session['conn_port'] = {}
            if not(request.session.has_key('conn_port')):
                request.session['conn_port'] = {}
            request.session['conn_user'].update({clave_vale[0]["Id_erp"]:'user_'+str(clave_vale[0]["Id_erp"])})
            request.session['conn_pass'].update({clave_vale[0]["Id_erp"]:"P"+str(clave_vale[0]["Id_erp"])+'_'+str(clave_base)})
            request.session['conn_base'].update({clave_vale[0]["Id_erp"]:'cliente_'+str(clave_vale[0]["Id_erp"])})
            request.session['conn_ip'].update({clave_vale[0]["Id_erp"]:'127.0.0.1'})        
            request.session['conn_ip'].update({clave_vale[0]["Id_erp"]:'107.170.92.160'})        
            request.session.save()
            erp_data = web.erp_log_menu         
            erp_data.creacion_inicial(request, clave_vale[0]["Id_erp"], clave_vale[0]["u_clave"], clave_vale[0]["u_correo"])


def activar_usuario(request, Clave_act):
    db = web.con_db.inter_login_LOGIN("Mysql")
    idioma_html = db.traer_platilla('log', 'esp')
    clave_vale = db.clave_vale(Clave_act)
    if len(clave_vale) == 1:
        if clave_vale[0]['estado'] == 'NoActivo':
            clave_base = random.randint(100000, 999999)
            cod_hash= hashear(str(clave_base))
            db.crear_base(clave_vale[0]["Id_erp"])
            db.crearusuario(clave_vale[0]["Id_erp"], clave_base)
            db.actDatosErp(clave_vale[0]["Id_erp"], clave_base)
            if not(request.session.has_key('conn_ip')):
                request.session['conn_user'] = {}
                request.session['conn_pass'] = {}
                request.session['conn_base'] = {}
                request.session['conn_ip'] = {}
                request.session['conn_port'] = {}
            if not(request.session.has_key('conn_port')):
                request.session['conn_port'] = {}
            request.session['conn_user'].update({clave_vale[0]["Id_erp"]:'user_'+str(clave_vale[0]["Id_erp"])})
            request.session['conn_pass'].update({clave_vale[0]["Id_erp"]:"P"+str(clave_vale[0]["Id_erp"])+'_'+str(clave_base)})
            request.session['conn_base'].update({clave_vale[0]["Id_erp"]:'cliente_'+str(clave_vale[0]["Id_erp"])})
            request.session['conn_ip'].update({clave_vale[0]["Id_erp"]:'107.170.92.160'})        
            request.session.save()
            erp_data = web.erp_log_menu         
            erp_data.creacion_inicial(request, clave_vale[0]["Id_erp"], clave_vale[0]["u_clave"], clave_vale[0]["u_correo"])
            
            context = {'idioma_html':idioma_html, 'msg':'Clave activada', 'idioma':'esp', 'todook':'0', 'clavehash':clave_vale[0]["u_clave"], 'Id_empresa':clave_vale[0]["Id_erp"]}
            return render(request, 'msg.html', context)
        else:
            context = {'idioma_html':idioma_html, 'msg':'Clave ya activada', 'idioma':'esp', 'todook':'0', 'clavehash':clave_vale[0]["u_clave"], 'Id_empresa':clave_vale[0]["Id_erp"]}
            return render(request, 'msg.html', context)
    else:
        context = {'idioma_html':idioma_html, 'msg':'Clave no existe', 'idioma':'esp', 'todook':'1', 'clavehash':'0', 'Id_empresa':'None'}
        return render(request, 'msg.html', context)





def cmpnumsecuencial(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        
            context = erp_data.cmpnumsecuencial(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)

def validar_query(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        
            context= erp_data.validar_query(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)

def admgrabar_pdf(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        
            context= erp_data.admgrabar_pdf(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)
def adm_estados_cond(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        
            context= erp_data.adm_estados_cond(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)

def adm_estados_actualizar(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        
            context= erp_data.adm_estados_actualizar(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)

def adm_estados_nuevo(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        
            context= erp_data.adm_estados_nuevo(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)

def adm_estados(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        
            context= erp_data.adm_estados(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)

def adm_pdf(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        
            context= erp_data.adm_pdf(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)
def intro2(request):
    if request.method == 'POST':
        try:
            subject = 'Consulta'
            message = 'Nombre: ' + request.POST['contactName']  + ',  cel: ' + request.POST['contactPhone'] + ',  msg: ' + request.POST['contactMessage']
            from_email = request.POST['contactEmail']
            send_mail(subject, message, from_email, ['info@cerocodigo.com'])
            context = {'msg': 'Envio Exitoso', 'fecha':strftime("%Y-%m-%d", datetime.datetime.now())}  
            return render(request, 'index_Land.html', context)
        except BadHeaderError:
            context = {'msg': 'Verificar Datos', 'fecha':strftime("%Y-%m-%d", datetime.datetime.now())}
            return render(request, 'index_Land.html', context)
    else:
        db = web.con_db.inter_login_LOGIN("Mysql") 
        cont_expertos = db.cont_expertos()
        context = {'cont_expertos': cont_expertos[0]['expertos'], 'fecha':strftime("%Y-%m-%d", datetime.datetime.now())}
        return render(request, 'index_Land.html', context)



def acc_por_esp(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        
            context= erp_data.acc_por_esp(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)

def acc_por_mas(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        
            context= erp_data.acc_por_mas(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)
            
def traer_acc_usuario(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        
            context = erp_data.traer_acc_usuario(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)

def acc_usuario(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        
            context = erp_data.acc_usuario(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)


def test_correo(request):
    sender_email = "documentos@cerocodigo.com"
    receiver_email = "nlubkov@gmail.com"
    password = "@Dmin1992"

    message = MIMEMultipart("alternative")
    message["Subject"] = "multipart test"
    message["From"] = sender_email
    message["To"] = receiver_email

    # Create the plain-text and HTML version of your message
    text = """\
    Hi,
    How are you?
    Real Python has many great tutorials:
    www.realpython.com"""
    html = """\
    <html>
      <body>
        <p>Hi,<br>
           How are you?<br>
           <a href="http://www.realpython.com">Real Python</a> 
           has many great tutorials.
        </p>
      </body>
    </html>
    """

    # Turn these into plain/html MIMEText objects
    part1 = MIMEText(text, "plain")
    part2 = MIMEText(html, "html")

    # Add HTML/plain-text parts to MIMEMultipart message
    # The email client will try to render the last part first
    message.attach(part1)
    message.attach(part2)

    # Create secure connection with server and send email
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.ipage.com", 465, context=context) as server:
        server.login(sender_email, password)
        server.sendmail(
            sender_email, receiver_email, message.as_string()
        )
    context = {'zz':0}
    return render(request, 'login.html', context)

def cla_usuario(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        
            context = erp_data.mod_usuario_cla(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)

def mod_usuario(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        
            context = erp_data.mod_usuario(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)
            
def traer_usuario_n(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        
            context = erp_data.traer_usuario_n(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)
            
def regis_usuario(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        
            context = erp_data.regis_usuario(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)

def mensajes(request):
    if request.session.has_key('conn_ip'):
        paneles_data = web.paneles
        Respuesta = paneles_data.traer_mensajes(request, request.POST.getlist('Id_empresa')[0])
        return JsonResponse(Respuesta)

def tareas(request):
    if request.session.has_key('conn_ip'):
        paneles_data = web.paneles
        Respuesta = paneles_data.traer_tareas(request, request.POST.getlist('Id_empresa')[0])
        return JsonResponse(Respuesta)
def tareas_aprovado(request):
    if request.session.has_key('conn_ip'):
        paneles_data = web.paneles
        Respuesta = paneles_data.tareas_aprovado(request, request.POST.getlist('Id_empresa')[0])
        return JsonResponse(Respuesta)        
def tareas_cambio(request):
    if request.session.has_key('conn_ip'):
        paneles_data = web.paneles
        Respuesta = paneles_data.tareas_cambio(request, request.POST.getlist('Id_empresa')[0])
        return JsonResponse(Respuesta)
def tareas_indi(request):
    if request.session.has_key('conn_ip'):
        paneles_data = web.paneles
        Respuesta = paneles_data.tareas_indi(request, request.POST.getlist('Id_empresa')[0])
        return JsonResponse(Respuesta)
def tareas_indi_view(request):
    if request.session.has_key('conn_ip'):
        paneles_data = web.paneles
        Respuesta = paneles_data.tareas_indi_view(request, request.POST.getlist('Id_empresa')[0])
        return JsonResponse(Respuesta)
def tareas_ind_por_modulo_pk(request):
    if request.session.has_key('conn_ip'):
        paneles_data = web.paneles
        Respuesta = paneles_data.tareas_ind_por_modulo_pk(request, request.POST.getlist('Id_empresa')[0])
        return JsonResponse(Respuesta)
def add_file_sub_tarea(request):
    if request.session.has_key('conn_ip'):
        paneles_data = web.paneles
        Respuesta = paneles_data.add_file_sub_tarea(request, request.POST.getlist('Id_empresa')[0])
        return JsonResponse(Respuesta)

def tareas_crear(request):
    if request.session.has_key('conn_ip'):
        paneles_data = web.paneles
        Respuesta = paneles_data.tareas_crear(request, request.POST.getlist('Id_empresa')[0])
        return JsonResponse(Respuesta)
def tareas_finalizar(request):
    if request.session.has_key('conn_ip'):
        paneles_data = web.paneles
        Respuesta = paneles_data.tareas_finalizar(request, request.POST.getlist('Id_empresa')[0])
        return JsonResponse(Respuesta)
def tareas_sub_finalizar(request):
    if request.session.has_key('conn_ip'):
        paneles_data = web.paneles
        Respuesta = paneles_data.tareas_sub_finalizar(request, request.POST.getlist('Id_empresa')[0])
        return JsonResponse(Respuesta)
def add_sub_tarea(request):
    if request.session.has_key('conn_ip'):
        paneles_data = web.paneles
        Respuesta = paneles_data.add_sub_tarea(request, request.POST.getlist('Id_empresa')[0])
        return JsonResponse(Respuesta)
def traer_nota(request):
    if request.session.has_key('conn_ip'):
        paneles_data = web.paneles
        Respuesta = paneles_data.traer_nota_completa(request, request.POST.getlist('Id_empresa')[0])
        return JsonResponse(Respuesta)

def movernota(request):
    if request.session.has_key('conn_ip'):
        paneles_data = web.paneles
        Respuesta = paneles_data.movernota(request, request.POST.getlist('Id_empresa')[0])
        return JsonResponse(Respuesta[0])


def crear_resp(request):
    if request.method == 'POST':
        if request.session.has_key('conn_ip'):
            paneles_data = web.paneles
            Respuesta = paneles_data.crear_resp(request, request.POST.getlist('Id_empresa')[0])
            context = {'tarea':request.POST.getlist('tarea')[0],'responsable':request.POST.getlist('responsable')[0][:-2], 'date':datetime.datetime.now()}
            return JsonResponse(context)

def archi_carg(request):
    myfile = request.FILES['files']
    path = default_storage.save('archivos/'+ str(request.POST.getlist('Id_empresa')[0]) + '/' + str(myfile), ContentFile(myfile.read()))
    tmp_file = os.path.join(settings.STATIC_URL, path)

def archi_car_home(request):
    myfile = request.FILES['files']
    path = default_storage.save('archivos/'+ str(request.POST.getlist('Id_empresa')[0]) + '/' + str(myfile), ContentFile(myfile.read()))
    tmp_file = os.path.join(settings.STATIC_URL, path)



def file_upload(request):
    folder='static/notas/'
    if request.method == 'POST' and request.POST.FILES['myfile_nota']:
        myfile = request.FILES['myfile_nota']
        fs = FileSystemStorage(location=folder) #defaults to   MEDIA_ROOT  
        filename = fs.save(myfile.name, myfile)
        file_url = fs.url(filename)
        return render(request, 'upload.html', {
            'file_url': file_url
        })
    else:
         return render(request, 'upload.html')

def simple_upload(request):
    if request.method == 'POST' and request.FILES['myfile']:
        myfile = request.FILES['myfile']
        fs = FileSystemStorage()
        filename = fs.save(myfile.name, myfile)
        uploaded_file_url = fs.url(filename)
        return render(request, 'core/simple_upload.html', {
            'uploaded_file_url': uploaded_file_url
        })
    return render(request, 'core/simple_upload.html')
    

def traer_sri_ATS_sem(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        
            context = erp_data.SRI_ATS_sem(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)

def traer_sri_ATS_mes(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        
            context = erp_data.SRI_ATS_mes(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)

def unico(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        
            context = erp_data.unico(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)            

def notasload(request):
    if request.method == 'POST':
        if request.session.has_key('conn_ip'):
            paneles_data = web.paneles
            paneles_data.xmlload(request, request.POST.getlist('Id_empresa')[0])
            context = {'ok':'date'}
            return JsonResponse(context)

def cargar_charts(request):
    if request.method == 'POST':
        if request.session.has_key('conn_ip'):
            erp_data = web.charts            
            respuesta = erp_data.traer_charts(request, request.POST.getlist('Id_empresa')[0],request.POST.getlist('usuario')[0])
            return JsonResponse(respuesta)
            
def cambio_estado(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        
            context = erp_data.cambio_estado(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)

def insert_rap_det(request):
    if request.method == 'POST':
        if request.session.has_key('conn_ip'):
            paneles_data = web.paneles
            paneles_data.insert_rap_det(request, request.POST.getlist('Id_empresa')[0])
            context = {'pkregistro':request.POST.getlist('pkregistro')[0], 'pkmodulo':request.POST.getlist('pkmodulo')[0]}
            return JsonResponse(context)

def insert_rapido(request):
    if request.method == 'POST':
        if request.session.has_key('conn_ip'):
            paneles_data = web.paneles
            paneles_data.insert_rapido(request, request.POST.getlist('Id_empresa')[0])
            context = {'pkpanel':request.POST.getlist('pkpanel')[0],'pkgrupo':request.POST.getlist('pkgrupo')[0],'xE':request.POST.getlist('xE')[0],'pkmodulo':request.POST.getlist('pkmodulo')[0]}
            return JsonResponse(context)

def nota_add_text(request):
    if request.method == 'POST':
        if request.session.has_key('conn_ip'):
            paneles_data = web.paneles
            paneles_data.nota_add_text(request, request.POST.getlist('Id_empresa')[0])
            context = {'texto':request.POST.getlist('texto')[0],'date':datetime.datetime.now()}
            return JsonResponse(context)

def paneles_cambio_estado(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        
            context = erp_data.paneles_cambio_estado(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)



def paneles_carga_pkpanel(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            paneles_data = web.paneles        
            context = paneles_data.paneles_carga(request, request.POST.getlist('Id_empresa')[0], request.POST.getlist('pkpanel')[0])
            return JsonResponse(context)

def paneles_carga(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            paneles_data = web.paneles        
            context = paneles_data.paneles_carga(request, request.POST.getlist('Id_empresa')[0], '0')
            return JsonResponse(context)

def traer_rapido(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        
            traer_campos = erp_data.traer_campos_panel_directo_Det(request, request.POST.getlist('Id_empresa')[0])
            traer_campos_funciones = erp_data.traer_campos_funciones(request, request.POST.getlist('Id_empresa')[0], traer_campos, request.POST.getlist('pkmodulo')[0])
            traer_registro = erp_data.traer_registro(request, request.POST.getlist('Id_empresa')[0], traer_campos, request.POST.getlist('pkmodulo')[0], request.POST.getlist('pkregistro')[0])
            context = traer_campos
            context.update({'valores_det':traer_registro[1]})
            context.update({'func_det':traer_campos_funciones[1]})
            return JsonResponse(context)




def paneles_items(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            paneles_data = web.paneles
            panel_grupo =  paneles_data.traer_condicion_panel_grupo(request, request.POST.getlist('Id_empresa')[0])
            panel_opciones = paneles_data.traer_condicion_panel_opciones(request, request.POST.getlist('Id_empresa')[0])
            acc_estados = paneles_data.traer_estados_modulo_usuario(request, request.POST.getlist('Id_empresa')[0])
            campo_fix = [0,[]]
            campo_fix[0]= panel_opciones[0]['campo']
            erp_data = web.erp_log_menu    
            if(len(panel_grupo) > 0):
                if panel_grupo[0]['tipo'] == 'directo':
                    traer_registro = erp_data.traer_registro_desde_panel_directo(request, request.POST.getlist('Id_empresa')[0], panel_grupo[0]['cond_base'])
                    traer_estados = erp_data.traer_estados_desde_panel_directo(request, request.POST.getlist('Id_empresa')[0], panel_grupo[0]['Valor'])
                    context = {}
                    context.update({'tipo':'directo'})
                    context.update({'dire_registros':traer_registro})
                    context.update({'dire_estados':traer_estados})
                    context.update({'estado':panel_grupo[0]})
                    context.update({'xE':request.POST.getlist('xE')[0]})  
                    context.update({'acc_estados':acc_estados})  
                    return JsonResponse(context)
                if panel_grupo[0]['tipo'] == 'tabla':
                    for a in panel_opciones:
                        campo_fix[1].append(a['valor'])
                    traer_campos = erp_data.traer_campos_desdePanel(request, request.POST.getlist('Id_empresa')[0])
                    traer_campos_funciones = erp_data.traer_campos_funciones(request, request.POST.getlist('Id_empresa')[0], traer_campos, request.POST.getlist('pkmodulo')[0])
                    traer_registro = erp_data.traer_registro_desde_panel(request, request.POST.getlist('Id_empresa')[0], traer_campos, panel_grupo)
                    context = traer_campos
                    context.update({'tipo':'tabla'})
                    context.update({'valores_cab':traer_registro[0]})
                    context.update({'func_cab':traer_campos_funciones[0]})
                    context.update({'estado':panel_grupo[0]})
                    context.update({'campo_fix':campo_fix})
                    context.update({'xE':request.POST.getlist('xE')[0]})  
                    context.update({'acc_estados':acc_estados})  
                    return JsonResponse(context)
        return JsonResponse({'no':0})

def cambio_rapido(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            paneles_data = web.paneles        
            context = paneles_data.cambio_rapido(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)


def buscador_ficha_crear_rapido(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        
            context = erp_data.buscador_ficha_crear_rapido(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)

def buscador_ficha(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        
            context = erp_data.buscador_ficha(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)

def buscador_auditoria(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        
            context = erp_data.buscador_auditoria(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)


def buscador(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        
            context = erp_data.buscador(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)

def agregar_nota_txt(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            paneles_data = web.paneles        
            context = paneles_data.agregar_nota_txt(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)
def agregar_tar_txt(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            paneles_data = web.paneles        
            context = paneles_data.agregar_tar_txt(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)
            
def nota_guardar_doc(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            paneles_data = web.paneles        
            context = paneles_data.nota_guardar_doc(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)
            

def buscador_auto_enter(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        
            context = erp_data.buscador_auto_enter(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)

def buscador_nota_doc(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            paneles_data = web.paneles        
            context = paneles_data.buscadornota(request, request.POST.getlist('Id_empresa')[0], request.POST.getlist('tabla')[0])
            return JsonResponse(context)

def cargar_paneles(request):
    if request.method == 'POST':
        if request.session.has_key('conn_ip'):
            paneles_data = web.paneles
            Respuesta = paneles_data.traer_paneles(request, request.POST.getlist('Id_empresa')[0], request.POST.getlist('usuario')[0])
            context = Respuesta
            return JsonResponse(context)
  

@csrf_exempt
def upload(request):
    if request.method == 'POST':
        excel = request.FILE['excelfile'].read()


        wb = openpyxl.load_workbook(excel)
        activesheet = wb.active

        sheet = wb.get_sheet_by_name(activesheet.title)

        for row in range(1, sheet.max_row + 1):
            url = sheet['A' + str(row)].value

    else:
        context = {'aa' :"a"}
        return render(request, 'upload_form.html', context)


def test_iframe(request):
    context = {'aa' :"a"}
    return render(request, 'test_iframe.html', context)


def test_chart(request):
    context = {'aa' :"a"}
    return render(request, 'home_erp4.html', context)

def alertas(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            paneles_data = web.paneles        
            context = paneles_data.alertas(request, request.POST.getlist('Id_empresa')[0], request.POST.getlist('usuario')[0])
            return JsonResponse(context)

def calendar(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            paneles_data = web.paneles        
            context = paneles_data.calendar(request, request.POST.getlist('Id_empresa')[0], request.POST.getlist('usuario')[0], request.POST.getlist('fecha')[0])
            return JsonResponse(context)


def reporte_ejecutar(request):
    if request.method == 'POST':
        if request.session.has_key('conn_ip'):
            erp_data = web.erp_log_menu
            Respuesta = erp_data.reporte_ejecutar(request, request.POST.getlist('Id_empresa')[0])
            context = Respuesta
            return JsonResponse(context)


def reporte_var(request): 
    if request.method == 'POST':
        if request.session.has_key('conn_ip'):
            erp_data = web.erp_log_menu
            Respuesta = erp_data.reporte_var(request, request.POST.getlist('Id_empresa')[0])
            context = Respuesta
            return JsonResponse(context)




def menu_eliminar(request):
    if request.session.has_key('conn_ip'):
        erp_data = web.erp_log_menu
        erp_data.eliminar(request, request.POST.getlist('Id_empresa')[0], request.POST.getlist('pkmodulo')[0],  request.POST.getlist('pkregistro')[0])

def menu_filtro(request):
    if request.session.has_key('conn_ip'):
        erp_data = web.erp_log_menu        
        Respuesta = erp_data.filtro(request, request.POST.getlist('Id_empresa')[0])
        context = Respuesta
        return JsonResponse(context)
        #return render(request, 'reg_consulta_solo_table.html', context)

def consolidado(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        
            context = erp_data.consolidado(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)

def buscador_filt_rep(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        
            context = erp_data.buscador_filt_rep(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)

def buscador_filtro(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        
            context = erp_data.buscador_filtro(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)

def modi_fast(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        
            context = erp_data.modi_fast(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)
            #return render(request, 'registro_ult.html', context)
        else:
            context = {'llego':'no llego'}
            return render(request, 'registro_empt.html', context)



def registro_erp(request, idioma):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        
            context = erp_data.traer_campos(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)
            #return render(request, 'registro_ult.html', context)
        else:
            context = {'llego':'no llego'}
            return render(request, 'registro_empt.html', context)

def regis_guardar(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu 
            context=  erp_data.guardar_base(request, request.POST.getlist('Id_empresa')[0])
            return JsonResponse(context)
        else:
            context = {'llego':'no llego'}
            return render(request, 'registro_empt.html', context)



def consulta_erp(request, idioma):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu        

            traer_campos = erp_data.traer_campos(request, request.POST.getlist('Id_empresa')[0], request.POST.getlist('pkmodulo')[0], request.POST.getlist('pestalla')[0] )
            traer_campos_funciones = erp_data.traer_campos_funciones(request, request.POST.getlist('Id_empresa')[0], traer_campos, request.POST.getlist('pkmodulo')[0])
            traer_registro = erp_data.traer_registro(request, request.POST.getlist('Id_empresa')[0], traer_campos, request.POST.getlist('pkmodulo')[0], request.POST.getlist('pkregistro')[0])
            plantilla_pdf = erp_data.plantilla_pdf(request, request.POST.getlist('Id_empresa')[0], request.POST.getlist('pkmodulo')[0] )
            plantilla_html = erp_data.plantilla_html(request, request.POST.getlist('Id_empresa')[0], request.POST.getlist('pkmodulo')[0] )
            context = traer_campos
            context.update({'valores_cab':traer_registro[0]})
            context.update({'valores_det':traer_registro[1]})
            context.update({'valores_subdet':traer_registro[2]})
            context.update({'func_cab':traer_campos_funciones[0]})
            context.update({'func_det':traer_campos_funciones[1]})
            context.update({'func_subdet':traer_campos_funciones[2]})
            context.update({'plantilla_pdf':plantilla_pdf})
            
            context.update({'dev_pestalla':request.POST.getlist('pestalla')[0]})
            context.update({'t_pkregistro':request.POST.getlist('pkregistro')[0]})
            acc_rapido = erp_data.acc_rapido(request, request.POST.getlist('Id_empresa')[0],request.POST.getlist('pkmodulo')[0],request.POST.getlist('usuario')[0])
            context.update({'acc_rapido':acc_rapido})
            context.update({'plantilla_html':plantilla_html})
            
            #context.update({'modrapido':erp_data.modrapido(request, request.POST.getlist('Id_empresa')[0])})
            #context.update({'newrapido':erp_data.newrapido(request, request.POST.getlist('Id_empresa')[0])})
            #context.update({'elirapido':erp_data.elirapido(request, request.POST.getlist('Id_empresa')[0])})
            if(request.POST.getlist('t_clave')[0] != '0'):
                edocs = web.funciones_edocs
                datos_edocs = edocs.Factura_ingreso_rap(request.POST.getlist('t_clave')[0] )                
                estruc_ingreso_edoc_cab = edocs.edocs_traer_estru(request, request.POST.getlist('Id_empresa')[0], traer_campos['tabla_cab']['PkEstructura'])                                    
                if traer_campos['tabla_det'] != 0: 
                    estruc_ingreso_edoc_det = edocs.edocs_traer_estru(request, request.POST.getlist('Id_empresa')[0], traer_campos['tabla_det']['PkEstructura'])                                    
                else:
                    estruc_ingreso_edoc_det = []                    
                context.update({'datos_edocs':[datos_edocs, estruc_ingreso_edoc_cab, estruc_ingreso_edoc_det]})
            else:
                context.update({'datos_edocs':0})
            if request.POST.getlist('tipo')[0] == 'consulta':
                estados = erp_data.traer_registro_estados(request, request.POST.getlist('Id_empresa')[0], traer_campos)
                context.update({'estados':estados})
            else:
                if request.POST.getlist('tipo')[0] == 'modificar':
                    estados = erp_data.traer_registro_estados(request, request.POST.getlist('Id_empresa')[0], traer_campos)
                    context.update({'estados':estados})
                else:
                    estados = erp_data.traer_registro_estados(request, request.POST.getlist('Id_empresa')[0], traer_campos)
                    context.update({'estados':estados})
            return JsonResponse(context)
        else:
            context = {'llego':'no llego'}
            return render(request, 'registro_empt.html', context)


def actualiza_erp(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu  
            #actualizae
            erp_data.actualiza_campos(request, request.POST.getlist('Id_empresa')[0])
            #actualizae
            context = {'0':'0'}
            return JsonResponse(context)
            
def intercambio_cc(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu  
            #actualizae
            erp_data.intercambio_cc(request, request.POST.getlist('Id_empresa')[0])
            #actualizae
            context = {'0':'0'}
            return JsonResponse(context)
            
def intercambio_dir(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu  
            #actualizae
            erp_data.intercambio_dir(request, request.POST.getlist('Id_empresa')[0])
            #actualizae
            context = {'0':'0'}
            return JsonResponse(context)

def intercambio_listado_dir(request):
    if request.session.has_key('conn_ip'):
        if request.method == 'POST':
            erp_data = web.erp_log_menu  
            #actualizae
            erp_data.intercambio_listado_dir(request, request.POST.getlist('Id_empresa')[0])
            #actualizae
            context = {'0':'0'}
            return JsonResponse(context)
            


def menu_click(request):
    if request.session.has_key('conn_ip'):
        erp_data = web.erp_log_menu
        if request.POST.getlist('fuente')[0] == 'registro':
            Respuesta = erp_data.registro(request, request.POST.getlist('Id_empresa')[0],  request.POST.getlist('usuario')[0])
            context = Respuesta
            return JsonResponse(context)
        if request.POST.getlist('fuente')[0] == 'Reporte':
            Respuesta = erp_data.registro(request, request.POST.getlist('Id_empresa')[0])
            context = Respuesta
            return render(request, 'reporte_main.html', context)

def pre_ejecutados(request):
    if request.session.has_key('conn_ip'):
        erp_data = web.erp_log_menu
        pre_ejecutados = erp_data.pre_ejecutados(request, request.POST.getlist('Id_empresa')[0],  request.POST.getlist('usuario')[0])
        return JsonResponse(pre_ejecutados)

def ref_buscar(request, pkrefer):
    if request.session.has_key('conn_ip'):
        erp_data = web.erp_log_menu
        Respuesta = erp_data.ref_buscar(request, pkrefer)
        context = Respuesta
        return render(request, 'buscar_referencia.html', context)
    else:
        context = {'zz':0}
        return render(request, 'login.html', context)


def log_erpAdmin(request, idioma):
    db = web.con_db.inter_login_LOGIN("Mysql") 
    erp_data = web.erp_log_menu
    if request.method == 'POST':
        Respuesta = erp_data.validar_user_empresa_admin(request, request.POST.getlist('inputEmpresa')[0], 'admin', request.POST.getlist('inputPassword')[0])
        if (Respuesta[0] == "1"):
            idioma_html = db.traer_platilla('menu', request.POST.getlist('idioma')[0])
            context = {'idioma_html':idioma_html, 'datos_user':Respuesta[1], 'idioma':idioma, 'usuario':request.POST.getlist('inputUsuario')[0],'Id_empresa':request.POST.getlist('inputEmpresa')[0],'Ruc' :request.POST.getlist('inputEmpresa')[0] , 'menu' : Respuesta[2], 'modulos' : Respuesta[3], 'opciones' : Respuesta[4], 'reportes' : Respuesta[5], 'list_user' : Respuesta[6], 'estados' : Respuesta[7]}
            return render(request, 'home_admin2.html', context)
        else:
            context = {'msg':'Usuario clave incorrecta'}
            return render(request, 'loginadm.html', context)
    else:
        idioma_html = db.traer_platilla('log',idioma)
        context = {'idioma_html':idioma_html, 'Empresa':'', 'idioma':idioma}
        return render(request, 'loginadm.html', context)

def eshow(request, negocio):
    db = web.con_db.inter_login_LOGIN("Mysql") 
    eshop_data = web.eshop
    if request.method == 'GET':
        negocio_nom = db.traer_negocio(negocio)
        if len(negocio_nom) == 1:
            datos_eshop = eshop_data.inicio(request, negocio_nom)
            return render(request, 'index_eshop2.html', datos_eshop)
        else:
            context = {'msg':'Negocio no existe'}
            return render(request, 'page_404.html', context)

def eshop_bus_codigo(request, negocio, v_cod):
    db = web.con_db.inter_login_LOGIN("Mysql") 
    eshop_data = web.eshop
    if request.method == 'GET':
        negocio_nom = db.traer_negocio(negocio)
        if len(negocio_nom) == 1:
            datos_eshop = eshop_data.codigo(request, negocio_nom, v_cod)
            return render(request, 'item_eshop.html', datos_eshop)
        else:
            context = {'msg':'Negocio no existe'}
            return render(request, 'page_404.html', context)

def eshop(request, negocio):
    db = web.con_db.inter_login_LOGIN("Mysql") 
    eshop_data = web.eshop
    if request.method == 'GET':
        negocio_nom = db.traer_negocio(negocio)
        if len(negocio_nom) == 1:
            datos_eshop = eshop_data.inicio(request, negocio_nom)
            return render(request, 'index_eshop.html', datos_eshop)
        else:
            context = {'msg':'Negocio no existe'}
            return render(request, 'page_404.html', context)

def eshop_bus_solo(request, negocio, v_cat):
    db = web.con_db.inter_login_LOGIN("Mysql") 
    eshop_data = web.eshop
    if request.method == 'GET':
        negocio_nom = db.traer_negocio(negocio)
        if len(negocio_nom) == 1:
            datos_eshop = eshop_data.traer_items_ini(request, negocio_nom, v_cat,'%', '', 0)
            return render(request, 'brose_eshop.html', datos_eshop)
        else:
            context = {'msg':'Negocio no existe'}
            return render(request, 'page_404.html', context)
    if request.method == 'POST':
        negocio_nom = db.traer_negocio(request.POST.getlist('t_negocio')[0])
        if len(negocio_nom) == 1:
            datos_eshop = eshop_data.traer_items_post(negocio_nom, request.POST.getlist('v_cat')[0], request.POST.getlist('v_subcat')[0], request.POST.getlist('v_dato')[0], request.POST.getlist('p_min')[0], request.POST.getlist('p_max')[0])
            return JsonResponse(datos_eshop)
        else:
            context = {'msg':'Negocio no existe'}
            return JsonResponse(context)

def eshop_bus_solo_cat(request, negocio, v_cat, v_busca):
    db = web.con_db.inter_login_LOGIN("Mysql") 
    eshop_data = web.eshop
    if request.method == 'GET':
        negocio_nom = db.traer_negocio(negocio)
        if len(negocio_nom) == 1:
            datos_eshop = eshop_data.traer_items_ini(request, negocio_nom, v_cat,'%', v_busca, '0')
            return render(request, 'brose_eshop.html', datos_eshop)
        else:
            context = {'msg':'Negocio no existe'}
            return render(request, 'page_404.html', context)
    if request.method == 'POST':
        negocio_nom = db.traer_negocio(request.POST.getlist('t_negocio')[0])
        if len(negocio_nom) == 1:
            datos_eshop = eshop_data.traer_items_post(negocio_nom, request.POST.getlist('v_cat')[0], request.POST.getlist('v_subcat')[0], request.POST.getlist('v_dato')[0], request.POST.getlist('p_min')[0], request.POST.getlist('p_max')[0])
            return JsonResponse(datos_eshop)
        else:
            context = {'msg':'Negocio no existe'}
            return JsonResponse(context)


def eshop_bus(request, negocio, v_cat, v_dato):
    db = web.con_db.inter_login_LOGIN("Mysql") 
    eshop_data = web.eshop
    if request.method == 'GET':
        negocio_nom = db.traer_negocio(negocio)
        if len(negocio_nom) == 1:
            datos_eshop = eshop_data.traer_items_ini(negocio_nom, v_cat, '%', v_dato, 10)
            return render(request, 'brose_eshop.html', datos_eshop)
        else:
            context = {'msg':'Negocio no existe'}
            return render(request, 'page_404.html', context)
    if request.method == 'POST':
        negocio_nom = db.traer_negocio(request.POST.getlist('t_negocio')[0])
        if len(negocio_nom) == 1:
            datos_eshop = eshop_data.traer_items_post(negocio_nom, request.POST.getlist('v_cat')[0], request.POST.getlist('v_subcat')[0], request.POST.getlist('v_dato')[0], request.POST.getlist('p_min')[0], request.POST.getlist('p_max')[0])
            return JsonResponse(datos_eshop)
        else:
            context = {'msg':'Negocio no existe'}
            return JsonResponse(context)




from datetime import date
import datetime

def log_fast(request):
    db = web.con_db.inter_login_LOGIN("Mysql") 
    erp_data = web.erp_log_menu
    if request.method == 'POST':
        Respuesta = erp_data.validar_user_empresa_soloval(request, request.POST.getlist('inputEmpresa')[0], request.POST.getlist('inputUsuario')[0], request.POST.getlist('inputPassword')[0])
        return JsonResponse({'resp':Respuesta})
    else:
        return JsonResponse({'resp':0})


def log_erp(request, idioma):
    db = web.con_db.inter_login_LOGIN("Mysql") 
    erp_data = web.erp_log_menu
    if request.method == 'POST':
        l_inputEmpresa = request.POST.getlist('inputEmpresa')[0]
        l_inputUsuario = request.POST.getlist('inputUsuario')[0].replace('ñ','n').replace('Ñ','N')
        l_inputPassword = request.POST.getlist('inputPassword')[0]

        Respuesta = erp_data.validar_user_empresa(request, l_inputEmpresa, l_inputUsuario, l_inputPassword)
        if (Respuesta[0] == "1"):
            erp_data.actualizar_base(request, l_inputEmpresa)
            dd = datetime.datetime.now().strftime("%Y-%m-%d")
            idioma_html = db.traer_platilla('menu', request.POST.getlist('idioma')[0])    
            datos_cuenta = {'datos_cuentas':Respuesta[13],'valores_cuentas':Respuesta[14],'val_pendiente':Respuesta[15],'dias_pendientes':Respuesta[16]}            
            context = {'web_usuarioExterno':'','disco_usado':Respuesta[18], 'sri_rap':Respuesta[17], 't_anio':str(datetime.datetime.now().strftime("%Y")),'t_mes':str(datetime.datetime.now().strftime("%m")), 'datos_cuenta':datos_cuenta,'acc_calen':Respuesta[12],'fecha':dd,'Es_Sri':Respuesta[1][0]['Sri'],'Es_admin':Respuesta[1][0]['Admin'], 'idioma_html':idioma_html,'datos_user':Respuesta[1],'certificado':Respuesta[8], 'idioma':idioma, 'usuario':l_inputUsuario ,'Id_empresa':Respuesta[9],'Ruc' :'xyz00' , 'menu' : Respuesta[2], 'modulos' : Respuesta[3], 'opciones' : Respuesta[4], 'reportes' : Respuesta[5], 'list_user' : Respuesta[6], 'estados' : Respuesta[7], 'list_areas' : Respuesta[10], 'list_proyect' : Respuesta[11], 'Es_Usuarios':Respuesta[1][0]['Usuarios']}
            return render(request, 'home_erp4.html', context)  
        if (Respuesta[0] == "2"):
            idioma_html = db.traer_platilla('log',idioma)
            context = {'idioma_html':idioma_html, 'Empresa':'', 'idioma':idioma, 'msg':'Sistema cerrado por falta de pago'}
            return render(request, 'login3.html', context)
        if (Respuesta[0] == "3"):
            idioma_html = db.traer_platilla('log',idioma)
            context = {'idioma_html':idioma_html, 'Empresa':'', 'idioma':idioma, 'msg':'Termina '}
            return render(request, 'login3.html', context)                        
        if (Respuesta[0] == "0"):
            idioma_html = db.traer_platilla('log',idioma)
            context = {'idioma_html':idioma_html, 'Empresa':'', 'idioma':idioma, 'msg':'Usuario clave incorrecta'}
            return render(request, 'login3.html', context)
    else:
        idioma_html = db.traer_platilla('log',idioma)
        context = {'idioma_html':idioma_html, 'Empresa':'', 'idioma':idioma, 'msg':''}
        return render(request, 'login3.html', context)

def log_demo(request, idioma): 
    db = web.con_db.inter_login_LOGIN("Mysql") 
    ingresos(visita_fecha=datetime.datetime.now(), visita_ip=get_ip(request), fuente='Demo')
    l_inputEmpresa = 'demo'
    l_inputUsuario = 'admin'
    l_inputPassword = '123'
    erp_data = web.erp_log_menu
    if request.method == 'POST':
        Respuesta = erp_data.validar_user_empresa(request, l_inputEmpresa, l_inputUsuario, l_inputPassword)
        if (Respuesta[0] == "1"):
            dd = datetime.datetime.now().strftime("%Y-%m-%d")
            idioma_html = db.traer_platilla('menu', request.POST.getlist('idioma')[0])  
            datos_cuenta = {'datos_cuentas':Respuesta[13],'valores_cuentas':Respuesta[14],'val_pendiente':Respuesta[15],'dias_pendientes':Respuesta[16]}
            context = {'sri_rap':Respuesta[17], 't_anio':str(datetime.datetime.now().strftime("%Y")),'t_mes':str(datetime.datetime.now().strftime("%m")), 'datos_cuenta':datos_cuenta,'acc_calen':Respuesta[12],'fecha':dd,'Es_Sri':Respuesta[1][0]['Sri'],'Es_admin':Respuesta[1][0]['Admin'], 'idioma_html':idioma_html,'datos_user':Respuesta[1],'certificado':Respuesta[8], 'idioma':idioma, 'usuario':l_inputUsuario ,'Id_empresa':Respuesta[9],'Ruc' :'xyz00' , 'menu' : Respuesta[2], 'modulos' : Respuesta[3], 'opciones' : Respuesta[4], 'reportes' : Respuesta[5], 'list_user' : Respuesta[6], 'estados' : Respuesta[7], 'list_areas' : Respuesta[10], 'list_proyect' : Respuesta[11], 'Es_Usuarios':Respuesta[1][0]['Usuarios']}
            return render(request, 'home_erp4.html', context)
    else:
        idioma_html = db.traer_platilla('log',idioma)
        context = {'idioma_html':idioma_html, 'Empresa':'', 'idioma':idioma, 'msg':''}
        return render(request, 'logindemo.html', context)

def demolog(request):
    db = web.con_db.inter_login_LOGIN("Mysql") 
    ingresosDemo(datetime.datetime.now(), request.POST.getlist('userNombreComercial')[0], request.POST.getlist('userTelefono')[0], request.POST.getlist('userCorreo')[0], request.POST.getlist('userTipo')[0], request.POST.getlist('userPersonas')[0]) 
    return HttpResponse("Correo de Experto ya existe.")

def demo(request):
    db = web.con_db.inter_login_LOGIN("Mysql")
    context = {'demos':0}
    return render(request, 'log_demo_pre.html', context)


@csrf_exempt
def experto_solicitud(request):
    if request.method == 'POST':
        db = web.con_db.inter_login_LOGIN("Mysql") 
        experto_existentes = db.experto_existe_user(request.POST.getlist('inputEmail')[0])
        if len(experto_existentes) == 0:
            ingresos(visita_fecha=datetime.datetime.now(), visita_ip=get_ip(request), fuente='Experto Solicitud')
            db.experto_ingresar(request.POST.getlist('inputName')[0],request.POST.getlist('inputEmail')[0],request.POST.getlist('inputPais')[0],request.POST.getlist('inputCiudad')[0],request.POST.getlist('textArea')[0])
            return HttpResponse("Nos comunicaremos contigo, gracias por querer ser parte de CeroCodigo")
        else:
            return HttpResponse("Correo de Experto ya existe.")
    else:
        context = {'zz':0}
        return render(request, 'experto_solicitud.html', context)
    



@csrf_exempt
def experto_contacto(request, Clave_experto):
    if request.method == 'POST':
        db = web.con_db.inter_login_LOGIN("Mysql") 
        experto = db.experto_traer(Clave_experto)
        if len(experto) == 0:
            return HttpResponse("Error de envio")
        else:
            subject = 'Solicitud CeroCodigo'
            ingresos(visita_fecha=datetime.datetime.now(), visita_ip=get_ip(request), fuente='Experto contacto')
            message = 'Nombre:  ' + request.POST.getlist('inputName')[0] + ', Email:  ' + request.POST.getlist('inputEmail')[0] + ', Mensaje:   ' + request.POST.getlist('textArea')[0]
            from_email = request.POST.getlist('inputEmail')[0]
            msg = EmailMessage(subject,message, to=[experto[0]['email']])
            msg.send()
            return HttpResponse("Mensaje Enviado")
    else:
        context = {'zz':0}
        return render(request, 'experto_contacto.html', context)
    

def Perfil(request, Id_experto):
    context = {'zz':0}
    ingresos(visita_fecha=datetime.datetime.now(), visita_ip=get_ip(request), fuente='Perfil')
    return render(request, 'perfil.html', context)
    

def vendido(request):
    ingresos(visita_fecha=datetime.datetime.now(), visita_ip=get_ip(request), fuente='Vendido')
    context = {'zz':0}
    return render(request, 'vendido.html', context)

def registro(request):
    ingresos(visita_fecha=datetime.datetime.now(), visita_ip=get_ip(request), fuente='registro')
    context = {'zz':0}
    return render(request, 'registro.html', context)

    
def modelos(request):
    context = {'zz':0}
    ingresos(visita_fecha=datetime.datetime.now(), visita_ip=get_ip(request), fuente='Modelos')    
    return render(request, 'modelos.html', context)
    
def expertos(request):
    db = web.con_db.inter_login_LOGIN("Mysql") 
    ingresos(visita_fecha=datetime.datetime.now(), visita_ip=get_ip(request), fuente='Expertos')
    expertos = db.expertos_traer()
    context = {'expertos':expertos}
    return render(request, 'expertos.html', context)

def guia(request):
    ingresos(visita_fecha=datetime.datetime.now(), visita_ip=get_ip(request), fuente='Guia')
    context = {'zz':0}
    return render(request, 'guia.html', context)



import hashlib
def hashear(clave):
    hash_object = hashlib.sha256(clave.encode())
    hex_dig = hash_object.hexdigest()
    return hex_dig


def crearcuenta(request):
    db = web.con_db.inter_login_LOGIN("Mysql") 
    user_id = request.POST.getlist('userUsuario')[0]
    user_pass = request.POST.getlist('userClave')[0]
    user_email = request.POST.getlist('userCorreo')[0]
    user_tipo = request.POST.getlist('userTipo')[0]
    userViene = request.POST.getlist('userViene')[0]
    usuario_existentes = db.usuario_existe_user(user_id)
    if len(usuario_existentes) == 0:
        usuario_existentes = db.usuario_existe_correo(user_email)
        if len(usuario_existentes) == 0:
            num_random = random.randint(10000, 99999)
            ingresos(visita_fecha=datetime.datetime.now(), visita_ip=get_ip(request), fuente='CrearCuenta')
            db.usuario_ingresar(user_id, user_pass, user_email, num_random, user_tipo, userViene)
            usuario_autentificar_correo(user_id, user_email, num_random)
            return HttpResponse("Usuario Creado, Te enviamos un correo para activar tu cuenta")
        else:
            return HttpResponse("Correo ya existe")
    else:
        return HttpResponse("Usuario ya existe")

def usuario_autentificar(request, Clave_doc):
    if Clave_doc != 'usada':
        ingresos(visita_fecha=datetime.datetime.now(), visita_ip=get_ip(request), fuente='autentificar')
        db = web.con_db.inter_login_LOGIN("Mysql") 
        usuario_valido = db.usuario_validar_clave(Clave_doc)
        if len(usuario_valido)>0:
            for i in usuario_valido:
                db.usuario_activar(i['usuario'])
                mensaje = 'El usuario:' + usuario_valido[0]['usuario']  + ', se activo exitosamente.'
                context = {'mensaje':mensaje}
                return render(request, 'doc_activado.html', context)
        else:
            mensaje = 'Clave no valida'
            context = {'mensaje':'Clave no valida'}
            return render(request, 'doc_activado.html', context)

def usuario_autentificar_correo(user_id, user_email, num_random):
    subject = 'Activacion CeroCodigo'
    message = 'Para activar la cuenta CeroCodigo ingresa en: www.cerocodigo.com/usuario_autentificar/' + str(num_random)
    from_email = user_email
    msg = EmailMessage(subject,message, to=[from_email])
    msg.send()


def usuario_nuevo(request, Clave_val):
    db = web.con_db.inter_login_LOGIN("Mysql") 
    usuario_valido = db.validar_clave_registro(Clave_val)
    context = {'usuario':usuario_valido}
    if len(usuario_valido) == 1:
        return render(request, 'auto_clave.html', context)
    else:
        cont_expertos = db.cont_expertos()
        context = {'cont_expertos': cont_expertos[0]['expertos']}
        return render(request, 'index.html', context)


def indexPanel(request):
    if request.method == 'GET':
        db = web.con_db.inter_login_LOGIN("Mysql") 
        context = {'a': 0}
        return render(request, 'indexPanel.html', context)


def aa(request):
    if request.method == 'POST':
        try:
            subject = 'Consulta'
            message = 'Nombre: ' + request.POST['contactName']  + ',  cel: ' + request.POST['contactPhone'] + ',  msg: ' + request.POST['contactMessage']
            from_email = request.POST['contactEmail']
            send_mail(subject, message, from_email, ['info@cerocodigo.com'])
            context = {'msg': 'Envio Exitoso'}
            return render(request, 'rrrr.html', context)
        except BadHeaderError:
            context = {'msg': 'Verificar Datos'}
            return render(request, 'rrrr.html', context)
    else:
        db = web.con_db.inter_login_LOGIN("Mysql") 
        cont_expertos = db.cont_expertos()
        context = {'cont_expertos': cont_expertos[0]['expertos']}
        return render(request, 'rrrr.html', context)


def alterno(request):
    if request.method == 'POST':
        try:
            subject = 'Consulta'
            message = 'Nombre: ' + request.POST['contactName']  + ',  cel: ' + request.POST['contactPhone'] + ',  msg: ' + request.POST['contactMessage']
            from_email = request.POST['contactEmail']
            send_mail(subject, message, from_email, ['info@cerocodigo.com'])
            context = {'msg': 'Envio Exitoso'}
            return render(request, 'index.html', context)
        except BadHeaderError:
            context = {'msg': 'Verificar Datos'}
            return render(request, 'home2.html', context)
    else:
        db = web.con_db.inter_login_LOGIN("Mysql") 
        cont_expertos = db.cont_expertos()
        context = {'cont_expertos': cont_expertos[0]['expertos']}
        return render(request, 'home2.html', context)

def intro(request):
    if request.method == 'POST':
        try:
            subject = 'Consulta'
            message = 'Nombre: ' + request.POST['contactName']  + ',  cel: ' + request.POST['contactPhone'] + ',  msg: ' + request.POST['contactMessage']
            from_email = request.POST['contactEmail']
            send_mail(subject, message, from_email, ['info@cerocodigo.com'])
            context = {'msg': 'Envio Exitoso'}
            return render(request, 'index.html', context)
        except BadHeaderError:
            context = {'msg': 'Verificar Datos'}
            return render(request, 'home1.html', context)
    else:
        db = web.con_db.inter_login_LOGIN("Mysql") 
        cont_expertos = db.cont_expertos()
        context = {'cont_expertos': cont_expertos[0]['expertos']}
        return render(request, 'home1.html', context)

def ingresos(visita_fecha, visita_ip, fuente):
    db = web.con_db.inter_login_LOGIN("Mysql") 
    db.log_externo(str(visita_fecha), visita_ip, fuente)

def ingresosDemo(t_Fecha, t_Nombres, t_Telefono, t_Email, t_Tipo, t_Tamano):
    db = web.con_db.inter_login_LOGIN("Mysql") 
    db.log_demo(t_Fecha, t_Nombres, t_Telefono, t_Email, t_Tipo, t_Tamano)


@csrf_exempt
def carga_docs(request):
    edocs = web.funciones_edocs
    context = edocs.carga_docs(request)
    return render(request, 'tabla.html', context)



def actualizar_docs(id_empresa):
    edocs = web.funciones_edocs
    edocs.actualizar_docs(id_empresa)


def xmlload(request):
    edocs = web.funciones_edocs
    return HttpResponse(edocs.xmlload(request))


def e_docs(request):
    context = {'error_message_clave': '', 'error_message_receptor' : '', 'error_message_emisor' : ''}
    if request.method == 'POST':
        db = web.con_db.inter_login_LOGIN("Mysql")
        try:
            V_user = db.log_in(request.POST['Ruc'], request.POST['password'])
            if  V_user == None:
                context = {'error_message': 'Error de ingreso'}
                return render(request, 'e_docs_log.html', context)
            else:
                if len(V_user) == 0:
                    context = {'error_message': 'Error de ingreso'}
                    return render(request, 'e_docs_log.html', context)
                else: 
                    context = {'V_user' : V_user, 'user_id':request.POST['Ruc']}    
                    actualizar_docs(request.POST['Ruc'])  
                    ingresos(visita_fecha=datetime.datetime.now(), visita_ip=get_ip(request), fuente='log menu')             
                    return render(request, 'Listado_docs.html', context)
        except ObjectDoesNotExist:
            context = {'error_message': ''}
            return render(request, 'e_docs_log.html', context)
    else:
        ingresos(visita_fecha=datetime.datetime.now(), visita_ip=get_ip(request), fuente='index')
        return render(request, 'e_docs_log.html', context)


@csrf_exempt
def logweb(request):
    ingresos(visita_fecha=datetime.datetime.now(), visita_ip=get_ip(request), fuente='home_nuevo')
    return HttpResponse("que chuuu   ")

def logrep(request):
    ingresos(visita_fecha=datetime.datetime.now(), visita_ip=get_ip(request), fuente=str(request.POST['us_home']) + '_' + str(request.POST['us_idleTime']))
    return HttpResponse("que chuuu   ")



def Factura(request, Clave_doc):
    ingresos(visita_fecha=datetime.datetime.now(), visita_ip=get_ip(request), fuente='factura')
    edocs = web.funciones_edocs
    context = edocs.Factura(Clave_doc)
    return render(request, 'Factura.html', context)

def Retencion(request, Clave_doc):
    ingresos(visita_fecha=datetime.datetime.now(), visita_ip=get_ip(request), fuente='retencion')
    edocs = web.funciones_edocs
    context = edocs.Retencion(Clave_doc)
    return render(request, 'Retencion.html', context)

def Credito(request, Clave_doc):
    ingresos(visita_fecha=datetime.datetime.now(), visita_ip=get_ip(request), fuente='retencion')
    edocs = web.funciones_edocs
    context = edocs.Credito(Clave_doc)
    return render(request, 'Credito.html', context)

def Guia(request, Clave_doc):
    ingresos(visita_fecha=datetime.datetime.now(), visita_ip=get_ip(request), fuente='retencion')
    edocs = web.funciones_edocs
    context = edocs.Guia(Clave_doc)
    return render(request, 'Guia.html', context)
    
def get_ip(request):
    ip = request.META.get("HTTP_X_FORWARDED_FOR", None)
    if ip:
        # X_FORWARDED_FOR returns client1, proxy1, proxy2,...
        ip = ip.split(", ")[0]
    else:
        ip = request.META.get("REMOTE_ADDR", "")
    return ip