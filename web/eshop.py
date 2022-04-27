
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

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
# Create your views here.
from django.shortcuts import get_object_or_404, render
from django.http import Http404
from web.models import usuarios, documentos, ingresos
from django.core.exceptions import ObjectDoesNotExist
from django.core.mail import send_mail, BadHeaderError
from django.http import HttpResponse, HttpResponseRedirect
from django.core.files.storage import FileSystemStorage

import smtplib, ssl

from django.views.decorators.csrf import csrf_exempt

import web.con_db
import web.funciones_edocs
import web.electronica_ecuador

import sys

from dateutil import parser

import hashlib
from datetime import datetime

def eshop_promo(request, datos_neg): 
    db = web.con_db.eshop(datos_neg[0]['conn_user'],datos_neg[0]['conn_pass'],datos_neg[0]['conn_base'],datos_neg[0]['conn_ip']) 
    datos_contactos = db.traer_datos_contactos()
    promo = db.eshop_promo(request.POST.getlist('t_promo_cod')[0])
    if len(promo) == 1:
        return {'ok':1,'promo':promo}
    else:
        return {'ok':0}



def Subcribete(request, datos_neg): 
    db = web.con_db.eshop(datos_neg[0]['conn_user'],datos_neg[0]['conn_pass'],datos_neg[0]['conn_base'],datos_neg[0]['conn_ip']) 
    db.Subcribete(request.POST.getlist('e_Email')[0])
    return {'respuesta':'ok'}


def chek_out_terminar(request, datos_neg): 
    db = web.con_db.eshop(datos_neg[0]['conn_user'],datos_neg[0]['conn_pass'],datos_neg[0]['conn_base'],datos_neg[0]['conn_ip']) 
    request.session['eshop_items']= []
    request.session['eshop_datos'] = {}
    request.session.save()
    return {'respuesta':1}

def chek_out_confimr(request, datos_neg, nego): 
    db = web.con_db.eshop(datos_neg[0]['conn_user'],datos_neg[0]['conn_pass'],datos_neg[0]['conn_base'],datos_neg[0]['conn_ip']) 
    datos_contactos = db.traer_datos_contactos()
    if not(request.session.has_key('eshop_items')):
        request.session['eshop_items'] = []
    datos_contactos = db.traer_datos_contactos()
    promo = db.eshop_promo(request.POST.getlist('t_promo_cod')[0])
    promocode = 0
    print("promo-----------------------------")
    print(promo)
    if len(promo) == 1:
        promocode = promo[0]['Codigo']
        if promo[0]['Estado'] == 'Pendiente':
            db.eshop_promo_usar(promo[0]['Codigo'])
    senten = 'Select ' + datos_contactos[0]['prod_cod'] + ', ' + datos_contactos[0]['prod_nom'] + ', ' + datos_contactos[0]['prod_descr']+ ', ' + datos_contactos[0]['prod_precio']+ ', ' + datos_contactos[0]['prod_tarifa'] 
    senten = senten + ' From ' + datos_contactos[0]['prod_tabla'] + ' Where ' + datos_contactos[0]['prod_cod'] + ' = '

    total = 0
    if not(request.session.has_key('eshop_datos')):
        return {'respuesta':0}
    if not(request.session.has_key('eshop_items')):
        return {'respuesta':0}
    codigos = ''


    estructura = db.traer_estruc(datos_contactos[0]['prod_pkmodulo'])
    tabla_cab= estructura[0]['Nombre'] 
    tabla_det= estructura[1]['Nombre'] 
    envio_datset = {}
    pk_cabecera = db.ejecutar_senten("select if((max(PkWeb)+ 1) is Null,1,(max(PkWeb)+ 1)) as 'valor' from Web"  )[0]["valor"]
    envio_datset[tabla_cab]= []
    envio_datset[tabla_det]= []
    senten_det = []

    for a in request.session['eshop_items']:
        codigos = codigos + '"' + str(a['Codigo']) + '",'
        items = db.ejecutar_senten(senten + '"' + str(a['Codigo'])+ '"')
        a['Tarifa'] = items[0][datos_contactos[0]['prod_tarifa']]
        a['Precio'] = items[0][datos_contactos[0]['prod_precio']]
        a['Subtotal'] = round(float(float(items[0][datos_contactos[0]['prod_precio']]) * float(a['Cantidad'])),2)
        a['Iva'] = round(float(float(a['Subtotal']) * float(a['Tarifa']) * 0.01),2)
        a['Total'] = round(float(float(a['Iva']) + float(a['Subtotal'])),2)
        envio_datset[tabla_det].append({'PKCabecera':pk_cabecera,'Codigo':a['Codigo'],'Cantidad':a['Cantidad'],'Precio':a['Precio'],'Producto':a['Producto'],'Subtotal':a['Subtotal'],'Tarifa':a['Tarifa'],'Iva':a['Iva'],'Total':a['Total'],'Imagen':a['Imagen']})
        if a['Total'] < a['Promo']:
            a['Total_neto'] = 0 
        else:
            a['Total_neto'] = round(float(float(a['Total']) - float(a['Promo'])),2)
        total = round(total + a['Total_neto'],2)
        senten_det.append("insert into `webdetalle` (`PKCabecera`, `Codigo`, `Cantidad`, `Precio`, `Producto`, `Subtotal`, `Tarifa`, `Iva`, `Total`, `Imagen`) VALUES ('"+str(pk_cabecera)+"', '"+str(a['Codigo'])+"', '"+str(a['Cantidad'])+"', '"+str(a['Precio'])+"', '"+str(a['Producto'])+"', '"+str(a['Subtotal'])+"', '"+str(a['Tarifa'])+"', '"+str(a['Iva'])+"', '"+str(a['Total'])+"', '"+str(a['Imagen'])+"')")


    envio_datset[tabla_cab].append({'Descuento_codigo':promocode, 'Total':total,'PkWeb':pk_cabecera,'Cliente_Id':request.session['eshop_datos']['Cliente_Id'],'Cliente_Razon':request.session['eshop_datos']['Cliente_Razon'],'Cliente_Telefono':request.session['eshop_datos']['Cliente_Telefono'],'Cliente_Email':request.session['eshop_datos']['Cliente_Email'],'Cliente_Direccion':request.session['eshop_datos']['Cliente_Direccion'],'Envio_Id':request.session['eshop_datos']['Envio_Id'],'Envio_Nombre':request.session['eshop_datos']['Envio_Nombre'],'Envio_Email':request.session['eshop_datos']['Envio_Email'],'Envio_Provincia':request.session['eshop_datos']['Envio_Provincia'],'Envio_Ciudad':request.session['eshop_datos']['Envio_Ciudad'],'Envio_Direccion':request.session['eshop_datos']['Envio_Direccion'],'Observacion':request.session['eshop_datos']['Observacion'], 'Transporte':request.session['eshop_datos']['Transporte'], 'Estado':'Pendiente'})

    senten_cab = ["insert into `web` (`Descuento_codigo`, `Total`, `PkWeb`, `Estado`,`Fecha`, `Cliente_Id`, `Cliente_Razon`, `Cliente_Direccion`, `Cliente_Telefono`, `Cliente_Email`, `Envio_Nombre`, `Envio_Id`, `Envio_Email`, `Envio_Provincia`, `Envio_Ciudad`, `Envio_Direccion`, `Observacion`, `Transporte`) VALUES ('"+str(promocode)+"',  "+str(total)+", "+str(pk_cabecera)+", 'Pendiente', now(),'"+str(envio_datset[tabla_cab][0]['Cliente_Id'])+"', '"+str(envio_datset[tabla_cab][0]['Cliente_Razon'])+"', '"+str(envio_datset[tabla_cab][0]['Cliente_Direccion'])+"', '"+str(envio_datset[tabla_cab][0]['Cliente_Telefono'])+"', '"+str(envio_datset[tabla_cab][0]['Cliente_Email'])+"', '"+str(envio_datset[tabla_cab][0]['Envio_Nombre'])+"', '"+str(envio_datset[tabla_cab][0]['Envio_Id'])+"', '"+str(envio_datset[tabla_cab][0]['Envio_Email'])+"', '"+str(envio_datset[tabla_cab][0]['Envio_Provincia'])+"', '"+str(envio_datset[tabla_cab][0]['Envio_Ciudad'])+"', '"+str(envio_datset[tabla_cab][0]['Envio_Direccion'])+"', '"+str(envio_datset[tabla_cab][0]['Observacion'])+"', '"+str(envio_datset[tabla_cab][0]['Transporte'])+"')"]
    senten_acc = EjecutarAcciones(request, datos_neg, datos_contactos[0]['prod_pkmodulo'], 'Guardar Registro Nuevo', envio_datset)  
    dbt = web.con_db.transsaciones(datos_neg[0]['conn_user'],datos_neg[0]['conn_pass'],datos_neg[0]['conn_base'],datos_neg[0]['conn_ip']) 
    senten_subdet = []
    if dbt.ingreso_base(senten_cab, senten_det, senten_acc, datos_contactos[0]['prod_pkmodulo'], senten_subdet) == True:
        request.session['eshop_items'] = []
        request.session['eshop_datos'] = {}
        request.session.save()
        envio_email(envio_datset['Web'][0]['Envio_Email'], '', 'Pedido en '+ str(nego) , '', nego, envio_datset['Web'][0]['PkWeb'], envio_datset['Web'][0]['Envio_Nombre'])
        return{'ok':1, 'respu':'Ingreso Exitoso', 'data':envio_datset, 'total':total}
    else:
        return{'ok':0, 'respu':'No se puede terminar registro'}

def envio_email(para, msg, por, val, nego, num, nombre):
    sender_email = "documentos@cerocodigo.net"
    receiver_email = para
    password = '@Dmin1992'

    message = MIMEMultipart("alternative")
    message["Subject"] = por
    message["From"] = sender_email
    message["To"] = receiver_email

    # Create the plain-text and HTML version of your message
    text = """\
    Hola $nombre$,
    Tu pedido se ha ingreado correctamente en $nego$!!!
    www.cerocodigo.com/$nego$/eshop/pedido/$num$/
    """
    html = """\
    <html>
      <body>
        <p>Hola $nombre$<br>
           Tu pedido se ha ingreado correctamente en $nego$!!!<br>
           <a href="www.cerocodigo.com/$nego$/eshop/pedido/$num$/">Click aqui</a> o www.cerocodigo.com/$nego$/eshop/pedido/$num$/
        </p>
      </body>
    </html>
    """

    # Turn these into plain/html MIMEText objects
    html= str(html).replace("$nego$",str(nego))
    html= str(html).replace("$num$",str(num))
    html= str(html).replace("$nombre$",str(nombre))

    text= str(text).replace("$nego$",str(nego))
    text= str(text).replace("$num$",str(num))
    text= str(text).replace("$nombre$",str(nombre))

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


def EjecutarAcciones(request, Id_empresa, pkmodulo, disparador, envio_datset):
    db = web.con_db.inter_registro(Id_empresa[0]['conn_user'],Id_empresa[0]['conn_pass'],Id_empresa[0]['conn_base'],Id_empresa[0]['conn_ip']) 
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
  
                obj_tablas  = db.tablas(z["ModuloAfectado"])
                obj_campos = db.campos(obj_tablas)
                obj_funciones_campos = db.funciones_campos_dict_pkestruc(obj_tablas, obj_campos)
                #----------------nueva forma mas sensilla
                dataset_ingresar = {}
                accionescampos = {}
                
                for y in datosRegistros:
                    datos = db.TraerAccionesCampos(y["PkAccionL2"])
                    accionescampos.update({y["PkAccionL2"]:datos})


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
                                        dd[yy["Campo"]] = str(datetime.now().strftime('%Y-%m-%d %H:%M:%S'))

                                    if obj_funciones_campos[y["PkEstructura"]][yy["Campo"]][0]["Nombre"] == 'Hora Actual':
                                        dd[yy["Campo"]] = str(datetime.now().strftime('%Y-%m-%d %H:%M:%S'))

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


                                if yy["Origen"] == "cmpfecha":  
                                    if obj_funciones_campos[y["PkEstructura"]][yy["Campo"]][0]["Tiempo"] == 'Y':
                                        dd[yy["Campo"]] = str(datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
                                    else:
                                        dd[yy["Campo"]] = str(datetime.now().strftime('%Y-%m-%d'))

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
                                    print('where :'+str(A_Where) + '/')
                                    if A_Where == 'Where ':
                                        A_Where = ""
                                        print('where paso:'+str(A_Where) + '/')

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
                                    print(sentencia)
                                    tempo_valor = db.cmpconso_ejecutar(sentencia)
                                    if len(tempo_valor) == 0:
                                        dd[yy["Campo"]] = 0 
                                    else:
                                        dd[yy["Campo"]] = tempo_valor[0][yy["Campo"]]

                                #if yy["Origen"] == "cmpdecabecera":

                   
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
                        UpdateSet = UpdateSet + " " + str(y["Fuente"]) + "."+ str(y["Campo"]) + " = '" + str(y["Valor"]) + "', "
                    if y["Tipo"] == "Operacion":
                        variables = y["Variables"].split(",")
                        valor_final = y["Valor"]
                        for yy in variables:
                            valor_final = valor_final.replace("[" + yy + "]", envio_datset[Nom_tabla_cab][0][yy[0]])
                        UpdateSet = UpdateSet + " " + str(y["Fuente"]) + "." + str(y["Campo"]) + " = " + str(valor_final) + ", "
                    if y["Tipo"] == "Registro":
                        UpdateSet = UpdateSet + " " + str(y["Fuente"]) + "." + str(y["Campo"]) + " = '" + str(envio_datset[Nom_tabla_cab][0][y["Valor"]]) + "', "
                    if y["Tipo"] == "Registro sin Comillas":
                        UpdateSet = UpdateSet + " " + str(y["Fuente"]) + "." + str(y["Campo"]) + " = " + str(envio_datset[Nom_tabla_cab][0][y["Valor"]]) + ", "
                UpdateSet = UpdateSet[0:-2]    
                if UpdateWhere == "WHERE":
                    Update = UpdateFrom + " " + UpdateSet + " " + Updatehaving
                else:
                    Update = UpdateFrom + " " + UpdateSet + "  " + UpdateWhere + " " + Updatehaving
                senten_acc.append(Update)
    return senten_acc



def eshop_bus_pedido(request, datos_neg, v_numero, Id_empresa):
    db = web.con_db.eshop(datos_neg[0]['conn_user'],datos_neg[0]['conn_pass'],datos_neg[0]['conn_base'],datos_neg[0]['conn_ip']) 
    datos_pedido = db.ejecutar_senten('select * from web where PkWeb = '+str(v_numero))
    datos_pedido_detalle = db.ejecutar_senten('select * from webdetalle where PKCabecera = '+str(v_numero))
    total = 0      
    datos_contactos = db.traer_datos_contactos()
    cat_princi = db.traer_cat_princi(datos_contactos[0]['senten_Cab'])
    promo_valor = 0
    for a in datos_pedido_detalle:
        total = a['Total'] + total
    print(datos_pedido)
    promo = db.eshop_promo_siempre(datos_pedido[0]['Descuento_codigo'])
    print('promo------------')
    print(promo)
    if len(promo) > 0:
        if promo[0]['Tipo'] == 'Valor':
            promo_valor = promo[0]['Valor']
        if promo[0]['Tipo'] == 'Porcentaje':
            promo_valor = promo[0]['Valor'] * 0.01 * total
    FINAL = round(float(total) + float(datos_pedido[0]['Transporte'].replace(',','.')) - float(promo_valor),2) 
    return {'promo_valor':promo_valor,'FINAL':FINAL, 'cat_princi':cat_princi, 'negocio':datos_neg[0]['Negocio'], 'datos_contactos':datos_contactos[0], 'respuesta':1, 'datos_pedido':datos_pedido, 'datos_pedido_detalle':datos_pedido_detalle, 'total':total}

def plantilla_pdf(datos_neg, Id_empresa, PkModulo):
    db = web.con_db.inter_registro(datos_neg[0]['conn_user'],datos_neg[0]['conn_pass'],datos_neg[0]['conn_base'],datos_neg[0]['conn_ip']) 
    plantillasMain = db.plantillasMain(PkModulo)
    plantillassegmentos = {}
    plantillascampos = {}
    plantillascampos3nivel = {}
    plantillascamposcabecera = {}
    plantillascondiciones = {}
    plantillasetiquetas = {}
    for main in plantillasMain:
        plantillassegmentos.update({main["PkPlantilla"]:db.plantillassegmentos(main["PkPlantilla"])})
        plantillascondiciones.update({main["PkPlantilla"]:db.plantillascondiciones(main["PkPlantilla"])})
        for seg in plantillassegmentos[main["PkPlantilla"]]:
            plantillascampos.update({seg["PkSegmento"]:db.plantillascampos(seg["PkSegmento"])})
            plantillascampos3nivel.update({seg["PkSegmento"]:db.plantillascampos3nivel(seg["PkSegmento"])})
            plantillascamposcabecera.update({seg["PkSegmento"]:db.plantillascamposcabecera(seg["PkSegmento"])})
            plantillasetiquetas.update({seg["PkSegmento"]:db.plantillasetiquetas(seg["PkSegmento"])})
    return {'plantillasMain':plantillasMain,'plantillassegmentos':plantillassegmentos,'plantillascampos':plantillascampos,'plantillascampos3nivel':plantillascampos3nivel,'plantillascamposcabecera':plantillascamposcabecera,'plantillascondiciones':plantillascondiciones,'plantillasetiquetas':plantillasetiquetas}


def eshop_checkout_final(request, datos_neg): 
    db = web.con_db.eshop(datos_neg[0]['conn_user'],datos_neg[0]['conn_pass'],datos_neg[0]['conn_base'],datos_neg[0]['conn_ip']) 
    if not(request.session.has_key('eshop_datos')):
        request.session['eshop_datos'] = {}
        request.session['eshop_datos']['Cliente_Id']='9999999999999'
        request.session['eshop_datos']['Cliente_Razon']='Consumidor Final'
        request.session['eshop_datos']['Cliente_Telefono']='Sin Datos'
        request.session['eshop_datos']['Cliente_Email']=''
        request.session['eshop_datos']['Cliente_Direccion']='Sin Datos'
        request.session['eshop_datos']['Observacion']='Ninguna'
        request.session['eshop_datos']['Envio_Id']=''
        request.session['eshop_datos']['Envio_Nombre']=''
        request.session['eshop_datos']['Envio_Email']=''
        request.session['eshop_datos']['Envio_Provincia']=''
        request.session['eshop_datos']['Envio_Ciudad']=''        
        request.session['eshop_datos']['Envio_Direccion']=''
        request.session['eshop_datos']['Transporte']='0'
        request.session.save()

    if not(request.session.has_key('eshop_items')):
        request.session['eshop_items'] = []
    datos_contactos = db.traer_datos_contactos()
    senten = 'Select ' + datos_contactos[0]['prod_cod'] + ', ' + datos_contactos[0]['prod_nom'] + ', ' + datos_contactos[0]['prod_descr']+ ', ' + datos_contactos[0]['prod_precio']+ ', ' + datos_contactos[0]['prod_tarifa'] 
    senten = senten + ' From ' + datos_contactos[0]['prod_tabla'] + ' Where ' + datos_contactos[0]['prod_cod'] + ' = '

    total = 0
    if not(request.session.has_key('eshop_datos')):
        return {'respuesta':0}
    if not(request.session.has_key('eshop_items')):
        return {'respuesta':0}
    codigos = ''

    for a in request.session['eshop_items']:
        codigos = codigos + '"' + str(a['Codigo']) + '",'
        items = db.ejecutar_senten(senten + '"' + str(a['Codigo'])+ '"')
        a['Tarifa'] = items[0][datos_contactos[0]['prod_tarifa']]
        a['Precio'] = items[0][datos_contactos[0]['prod_precio']]
        a['Subtotal'] = round(float(float(items[0][datos_contactos[0]['prod_precio']]) * float(a['Cantidad'])),2)
        a['Iva'] = round(float(float(a['Subtotal']) * float(a['Tarifa']) * 0.01),2)
        a['Total'] = round(float(float(a['Iva']) + float(a['Subtotal'])),2)
        if a['Total'] < a['Promo']:
            a['Total_neto'] = 0 
        else:
            a['Total_neto'] = round(float(float(a['Total']) - float(a['Promo'])),2)
        total = total + a['Total_neto']    
    return {'respuesta':1, 'eshop_datos':request.session['eshop_datos'], 'total':round(total,2), 'lista':request.session['eshop_items']}


def chek_out_data(request, datos_neg): 
    db = web.con_db.eshop(datos_neg[0]['conn_user'],datos_neg[0]['conn_pass'],datos_neg[0]['conn_base'],datos_neg[0]['conn_ip']) 
    print('etapa: ' + str(request.POST.getlist('etapa')[0]))
    if request.POST.getlist('etapa')[0] == 'A':    
        if not(request.session.has_key('eshop_datos')):
            request.session['eshop_datos'] = {}
            request.session['eshop_datos']['Cliente_Id']='9999999999999'
            request.session['eshop_datos']['Cliente_Razon']='Consumidor Final'
            request.session['eshop_datos']['Cliente_Telefono']='Sin Datos'
            request.session['eshop_datos']['Cliente_Email']=''
            request.session['eshop_datos']['Cliente_Direccion']='Sin Datos'
            request.session['eshop_datos']['Observacion']='Ninguna'
            
            request.session['eshop_datos']['Envio_Id']=''
            request.session['eshop_datos']['Envio_Nombre']=''
            request.session['eshop_datos']['Envio_Email']=''
            request.session['eshop_datos']['Envio_Provincia']=''
            request.session['eshop_datos']['Envio_Ciudad']=''        
            request.session['eshop_datos']['Envio_Direccion']=''
            request.session['eshop_datos']['Transporte']='0'

        if request.session['eshop_datos'] == {}:
            request.session['eshop_datos']['Cliente_Id']='9999999999999'
            request.session['eshop_datos']['Cliente_Razon']='Consumidor Final'
            request.session['eshop_datos']['Cliente_Telefono']='Sin Datos'
            request.session['eshop_datos']['Cliente_Email']=''
            request.session['eshop_datos']['Cliente_Direccion']='Sin Datos'
            request.session['eshop_datos']['Observacion']='Ninguna'
            
            request.session['eshop_datos']['Envio_Id']=''
            request.session['eshop_datos']['Envio_Nombre']=''
            request.session['eshop_datos']['Envio_Email']=''
            request.session['eshop_datos']['Envio_Provincia']=''
            request.session['eshop_datos']['Envio_Ciudad']=''        
            request.session['eshop_datos']['Envio_Direccion']=''
            request.session['eshop_datos']['Transporte']='0'
            
    if request.POST.getlist('etapa')[0] == 'B':
        print('entro aqui-----------------------------')
        if not(request.session.has_key('eshop_datos')):
            request.session['eshop_datos'] = {}
            request.session['eshop_datos']['Cliente_Id']='9999999999999'
            request.session['eshop_datos']['Cliente_Razon']='Consumidor Final'
            request.session['eshop_datos']['Cliente_Telefono']='Sin Datos'
            request.session['eshop_datos']['Cliente_Email']=''
            request.session['eshop_datos']['Cliente_Direccion']='Sin Datos'
            request.session['eshop_datos']['Observacion']='Ninguna'
            request.session['eshop_datos']['Envio_Id']=''
            request.session['eshop_datos']['Envio_Nombre']=''
            request.session['eshop_datos']['Envio_Email']=''
            request.session['eshop_datos']['Envio_Provincia']=''
            request.session['eshop_datos']['Envio_Ciudad']=''        
            request.session['eshop_datos']['Envio_Direccion']=''
            request.session['eshop_datos']['Transporte']='0'
        else:
            request.session['eshop_datos']['Cliente_Id']=request.POST.getlist('d_Fact_Id')[0]
            request.session['eshop_datos']['Cliente_Razon']=request.POST.getlist('d_Fact_Nom')[0]
            request.session['eshop_datos']['Cliente_Telefono']=request.POST.getlist('d_Fact_Telf')[0]
            request.session['eshop_datos']['Cliente_Email']=request.POST.getlist('d_Fact_Email')[0]
            request.session['eshop_datos']['Cliente_Direccion']=request.POST.getlist('d_Fact_Dir')[0]
            request.session['eshop_datos']['Observacion']=request.POST.getlist('d_Observacion')[0]
            request.session['eshop_datos']['Envio_Id']=request.POST.getlist('d_Env_Id')[0]
            request.session['eshop_datos']['Envio_Nombre']=request.POST.getlist('d_Env_Nom')[0]
            request.session['eshop_datos']['Envio_Email']=request.POST.getlist('d_Env_Email')[0]
            request.session['eshop_datos']['Envio_Provincia']=request.POST.getlist('d_Env_Pro')[0]
            request.session['eshop_datos']['Envio_Ciudad']=request.POST.getlist('d_Env_Cui')[0]        
            request.session['eshop_datos']['Envio_Direccion']=request.POST.getlist('d_Env_Dir')[0]
            request.session['eshop_datos']['Transporte']=request.POST.getlist('d_Env_Trans')[0]

    request.session.save()
    return {'respuesta':1, 'eshop_datos':request.session['eshop_datos']}

def eshop_checkout(request, datos_neg): 
    db = web.con_db.eshop(datos_neg[0]['conn_user'],datos_neg[0]['conn_pass'],datos_neg[0]['conn_base'],datos_neg[0]['conn_ip']) 
    #if not(request.session.has_key('eshop_adi')):
    #    request.session['eshop_adi'] = []
    if not(request.session.has_key('eshop_items')):
        request.session['eshop_items'] = []
    datos_contactos = db.traer_datos_contactos()
    cat_princi = db.traer_cat_princi(datos_contactos[0]['senten_Cab'])
    cat_secund = db.traer_cat_secund(datos_contactos[0]['senten_subCat'])
    senten = 'Select ' + datos_contactos[0]['prod_cod'] + ', ' + datos_contactos[0]['prod_nom'] + ', ' + datos_contactos[0]['prod_descr']+ ', ' + datos_contactos[0]['prod_precio']+ ', ' + datos_contactos[0]['prod_tarifa'] 
    senten = senten + ' From ' + datos_contactos[0]['prod_tabla'] + ' Where ' + datos_contactos[0]['prod_cod'] + ' = '

    total = 0
    if not(request.session.has_key('eshop_items')):
        request.session['eshop_items']= []
        return []
    else:
        codigos = ''
        for a in request.session['eshop_items']:
            codigos = codigos + '"' + str(a['Codigo']) + '",'
            items = db.ejecutar_senten(senten + '"' + str(a['Codigo'])+ '"')
            a['Tarifa'] = items[0][datos_contactos[0]['prod_tarifa']]
            a['Precio'] = items[0][datos_contactos[0]['prod_precio']]
            a['Subtotal'] = round(float(float(items[0][datos_contactos[0]['prod_precio']]) * float(a['Cantidad'])),2)
            a['Iva'] = round(float(float(a['Subtotal']) * float(a['Tarifa']) * 0.01),2)
            a['Total'] = round(float(float(a['Iva']) + float(a['Subtotal'])),2)
            if a['Total'] < a['Promo']:
                a['Total_neto'] = 0 
            else:
                a['Total_neto'] = round(float(float(a['Total']) - float(a['Promo'])),2)
            total = total + a['Total_neto']
    main_envios = datos_contactos[0]['Transporte'].split(';')
    tabla_envio = main_envios[0]
    datos_envio = main_envios[1].split(',')
    lista_provincia = db.traer_lista_envio_provncias(tabla_envio, datos_envio[0])
    lista_ciudades = db.traer_lista_envio_ciudaes_valor(tabla_envio, datos_envio[0], datos_envio[1],datos_envio[2])
    return {'lista_provincia':lista_provincia,'lista_ciudades':lista_ciudades,'total':round(total,2), 'lista':request.session['eshop_items'],'negocio':datos_neg[0]['Negocio'],'cat_princi':cat_princi,'cat_secund':cat_secund,'datos_contactos':datos_contactos[0]}


def eshop_borrar_cod(request, datos_neg): 
    db = web.con_db.eshop(datos_neg[0]['conn_user'],datos_neg[0]['conn_pass'],datos_neg[0]['conn_base'],datos_neg[0]['conn_ip']) 
    if not(request.session.has_key('eshop_items')):
        request.session['eshop_items']= []
    else:
        for a in request.session['eshop_items']:
            if a['Codigo'] == request.POST.getlist('v_codigo')[0]:
                request.session['eshop_items'].remove(a)
    request.session.save()
    return {'respuesta':1}


def eshop_mod_cod(request, datos_neg): 
    db = web.con_db.eshop(datos_neg[0]['conn_user'],datos_neg[0]['conn_pass'],datos_neg[0]['conn_base'],datos_neg[0]['conn_ip']) 
    index_lis = 0
    index_sele = 0
    val_entro = False
    for a in request.session['eshop_items']:
        if a['Codigo'] ==request.POST.getlist('item_cod')[0]:
            if float(float(a['Cantidad']) + float(request.POST.getlist('e_Cantidad')[0])) >= 0.0:
                print('cambio--------------:'+ str(float(float(a['Cantidad']) + float(request.POST.getlist('e_Cantidad')[0]))))
                a['Cantidad'] = float(float(a['Cantidad']) + float(request.POST.getlist('e_Cantidad')[0]))
                val_entro = True
                index_sele = index_lis 
                if a['Cantidad'] == 0.0:
                    request.session['eshop_items'].remove(a)
                    print('removio')
                    request.session.save()
                    return {'respuesta':2, 'lista_cant':len(request.session['eshop_items']),}
        index_lis= index_lis + 1
    request.session.save()
    return {'respuesta':1, 'lista_cant':len(request.session['eshop_items']), 'index_sele':index_sele, 'listita':request.session['eshop_items'][index_sele]}




def eshop_add_cod(request, datos_neg): 
    db = web.con_db.eshop(datos_neg[0]['conn_user'],datos_neg[0]['conn_pass'],datos_neg[0]['conn_base'],datos_neg[0]['conn_ip']) 
    if not(request.session.has_key('eshop_items')):
        request.session['eshop_items'] = []
        request.session['eshop_items'].append({'Codigo':request.POST.getlist('item_cod')[0],'Imagen':request.POST.getlist('e_Imagen')[0],'Cantidad':request.POST.getlist('e_Cantidad')[0],'Precio':request.POST.getlist('e_Precio')[0],'Producto':request.POST.getlist('e_Producto')[0],'Subtotal':round(float(request.POST.getlist('e_Cantidad')[0]) * float(request.POST.getlist('e_Precio')[0]), 2),'Tarifa':0,'Iva':0,'Total':0, 'Promo':0}) 
    else:
        val_entro = False
        for a in request.session['eshop_items']:
            if a['Codigo'] ==request.POST.getlist('item_cod')[0]:
                a['Cantidad'] = float(float(a['Cantidad']) + float(request.POST.getlist('e_Cantidad')[0]))
                val_entro = True
        if val_entro == False:
            request.session['eshop_items'].append({'Codigo':request.POST.getlist('item_cod')[0],'Imagen':request.POST.getlist('e_Imagen')[0],'Cantidad':request.POST.getlist('e_Cantidad')[0],'Precio':request.POST.getlist('e_Precio')[0],'Producto':request.POST.getlist('e_Producto')[0],'Subtotal':round(float(request.POST.getlist('e_Cantidad')[0]) * float(request.POST.getlist('e_Precio')[0]), 2),'Tarifa':0,'Iva':0,'Total':0, 'Promo':0})   
    request.session.save()
    return {'respuesta':1, 'lista':request.session['eshop_items'], 'lista_cant':len(request.session['eshop_items'])}

def devuelve_seccion_prodcutos_billete(request):
    billete = 0
    if not(request.session.has_key('eshop_items')):
        request.session['eshop_items'] = {}
        return billete
    else:
        for a in request.session['eshop_items']:
            billete = billete + (a['Cantidad'] * a['Precio'])
    return billete

def devuelve_seccion_prodcutos(request):
    if not(request.session.has_key('eshop_items')):
        request.session['eshop_items'] = {}
    return request.session['eshop_items']

def inicio(request, datos_neg): 
    db = web.con_db.eshop(datos_neg[0]['conn_user'],datos_neg[0]['conn_pass'],datos_neg[0]['conn_base'],datos_neg[0]['conn_ip']) 
    datos_contactos = db.traer_datos_contactos()
    cat_princi = db.traer_cat_princi(datos_contactos[0]['senten_Cab'])
    cat_secund = db.traer_cat_secund(datos_contactos[0]['senten_subCat'])
    main_display = db.traer_main_display()
    list_previ = devuelve_seccion_prodcutos(request)
    list_Ofertas = lisa_codigos(datos_neg, 'Ofertas', '', '', 4) 
    list_Nuevos = lisa_codigos(datos_neg, 'Nuevos', '', '', 4)
    d_alcance = datos_contactos[0]['d_alcance'].split('//')
    bloques = []
    for a in d_alcance:
        b = a.split('|')
        bloques.append({'icono':b[0],'titulo':b[1],'texto':b[2]})
    return {'bloques':bloques, 'list_Nuevos':list_Nuevos, 'list_Ofertas':list_Ofertas, 'lista_cant':len(list_previ),'lista':list_previ,'negocio':datos_neg[0]['Negocio'],'main_display':main_display,'cat_princi':cat_princi,'cat_secund':cat_secund,'datos_contactos':datos_contactos[0]}


def lisa_codigos(datos_neg, v_cat, v_subcat, v_dato, v_limite): 
    db = web.con_db.eshop(datos_neg[0]['conn_user'],datos_neg[0]['conn_pass'],datos_neg[0]['conn_base'],datos_neg[0]['conn_ip']) 
    datos_contactos = db.traer_datos_contactos()
    senten = datos_contactos[0]['senten_items']
    if v_cat == 'todas':
        senten = str(senten).replace('@Cat@','%')
    else:
        senten = str(senten).replace('@Cat@',v_cat)
    if v_subcat != '':
        senten = str(senten).replace('@SubCat@', " and "  +str(datos_contactos[0]['prod_cat2']) + " in (" + str(v_subcat) + ") ")
    else:
        senten = str(senten).replace('@SubCat@','')

    senten = str(senten).replace('@v_pin@','0')
    senten = str(senten).replace('@v_pout@','9999')
    datos_split = v_dato.replace(',','').replace('.','').split(" ")
    datos_split_txt = ''
    for a in datos_split:
        datos_split_txt = datos_split_txt  + " select '"+ a +"' as 'dato', 1 as 'val' UNION ALL"
    datos_split_txt = datos_split_txt[:len(datos_split_txt)-9]
    senten = str(senten).replace('@dato@',str(datos_split_txt))    
    senten =senten + 'limit ' + str(v_limite)
    print('---------------------------------------------')
    print(senten)
    print('---------------------------------------------')
    items = db.ejecutar_senten(senten)
    return items


def codigo(request, datos_neg, v_codigo): 
    db = web.con_db.eshop(datos_neg[0]['conn_user'],datos_neg[0]['conn_pass'],datos_neg[0]['conn_base'],datos_neg[0]['conn_ip']) 
    datos_contactos = db.traer_datos_contactos()
    cat_princi = db.traer_cat_princi(datos_contactos[0]['senten_Cab'])
    cat_secund = db.traer_cat_secund(datos_contactos[0]['senten_subCat'])
    seneten = "Select " 
    seneten = seneten  + str(datos_contactos[0]['prod_cod'])+" as 'Codigo',"
    seneten = seneten  + str(datos_contactos[0]['prod_nom'])+" as 'Nombre',"
    seneten = seneten  + str(datos_contactos[0]['prod_descr'])+" as 'Descripcion',"
    seneten = seneten  + str(datos_contactos[0]['prod_precio'])+" as 'Pvp',"
    txtimagenes = datos_contactos[0]['prod_imagen'].split(',')
    cc_image = 1
    for a in txtimagenes:
        seneten = seneten  + str(a)+" as 'Imagen"+str(cc_image)+"',"
        cc_image = cc_image + 1
    seneten = seneten  + str(datos_contactos[0]['prod_cat'])+" as 'cat',"
    seneten = seneten  + str(datos_contactos[0]['prod_cat2'])+" as 'cat2',"
    seneten = seneten  +"("+ str(datos_contactos[0]['prod_stock']).replace('@codigo@',str(v_codigo))+") as 'stock'"
    seneten = seneten  + " from " + str(datos_contactos[0]['prod_tabla'])+" where "+str(datos_contactos[0]['prod_cod'])+" = '"+str(v_codigo)+"'"
    print("-----------------------")
    print(seneten)
    print("-----------------------")
    item =  db.ejecutar_senten(seneten)
    list_previ = devuelve_seccion_prodcutos(request)
    return {'lista_cant':len(list_previ),'lista':list_previ,'negocio':datos_neg[0]['Negocio'], 'cat_princi':cat_princi,'cat_secund':cat_secund,'datos_contactos':datos_contactos[0],'item':item}


def traer_items_ini(request, datos_neg, v_cat, v_subcat, v_dato, v_limite): 
    db = web.con_db.eshop(datos_neg[0]['conn_user'],datos_neg[0]['conn_pass'],datos_neg[0]['conn_base'],datos_neg[0]['conn_ip']) 
    datos_contactos = db.traer_datos_contactos()
    cat_princi = db.traer_cat_princi(datos_contactos[0]['senten_Cab'])
    cat_secund = db.traer_cat_secund(datos_contactos[0]['senten_subCat'])
    list_previ = devuelve_seccion_prodcutos(request)
    return {'lista_cant':len(list_previ),'lista':list_previ,'negocio':datos_neg[0]['Negocio'], 'cat_princi':cat_princi,'cat_secund':cat_secund,'v_cat':v_cat,'v_subcat':v_subcat,'v_dato':v_dato,'datos_contactos':datos_contactos[0]}


def traer_items_post(datos_neg, v_cat, v_subcat, v_dato, v_pin, v_pout): 
    db = web.con_db.eshop(datos_neg[0]['conn_user'],datos_neg[0]['conn_pass'],datos_neg[0]['conn_base'],datos_neg[0]['conn_ip']) 
    datos_contactos = db.traer_datos_contactos()
    senten = datos_contactos[0]['senten_items']
    if v_cat == 'todas':
        senten = str(senten).replace('@Cat@','%')
    else:
        senten = str(senten).replace('@Cat@',v_cat)
    if v_subcat != '':
        senten = str(senten).replace('@SubCat@', " and "  +str(datos_contactos[0]['prod_cat2']) + " in (" + str(v_subcat) + ") ")
    else:
        senten = str(senten).replace('@SubCat@','')

    senten = str(senten).replace('@v_pin@',v_pin)
    senten = str(senten).replace('@v_pout@',v_pout)
    datos_split = v_dato.replace(',','').replace('.','').split(" ")
    datos_split_txt = ''
    for a in datos_split:
        datos_split_txt = datos_split_txt  + " select '"+ a +"' as 'dato', 1 as 'val' UNION ALL"
    datos_split_txt = datos_split_txt[:len(datos_split_txt)-9]
    senten = str(senten).replace('@dato@',str(datos_split_txt))
    items = db.ejecutar_senten(senten)
    cat_princi = db.traer_cat_princi(datos_contactos[0]['senten_Cab'])
    cat_secund = db.traer_cat_secund(datos_contactos[0]['senten_subCat'])
    return {'negocio':datos_neg[0]['Negocio'], 'cat_princi':cat_princi,'cat_secund':cat_secund,'v_cat':v_cat,'v_subcat':v_subcat,'v_dato':v_dato,'datos_contactos':datos_contactos[0], 'items':items}



    
    

