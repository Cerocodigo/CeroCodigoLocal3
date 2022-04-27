
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
from suds.client import Client
from django.core.mail import send_mail, BadHeaderError
from django.http import HttpResponse, HttpResponseRedirect
import xml.etree.ElementTree as ET # Python 2.5
from lxml import etree

from django.views.decorators.csrf import csrf_exempt
import urllib.request  #pyhton3
#from urllib2 import urlopen  #pyhton 2

import web.con_db
import sys

def traer_campos_edocs(request, Id_empresa, a_pkmodulo):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    tablas  = db.tablas(a_pkmodulo)
    tt_modulo  = db.traer_moduloss_porPk(a_pkmodulo)
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
    return {'tabla_cab' :tabla_cab, 'campos_cab' :campos_cab, 'tabla_det':tabla_det,'campos_det':campos_det,'tabla_subdet':tabla_subdet,'campos_subdet':campos_subdet}

def traer_campos_funciones_edocs(request, Id_empresa, campos, a_pkmodulo):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    tablas  = db.tablas(a_pkmodulo)
    funciones_campos = db.funciones_campos(tablas, campos)
    funciones_cab = funciones_campos[0]
    funciones_det = 0
    funciones_subdet = 0
    if len(tablas) > 1:
        funciones_det = funciones_campos[1]
    if len(tablas) > 2:
        funciones_subdet = funciones_campos[2]
    return [ funciones_cab, funciones_det, funciones_subdet]

def edocs_ingresos_masivos(request, Id_empresa, l_usuarios):
    db_edocs = web.con_db.edocs(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    db_registro = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 

    listado = json.loads(request.POST.get('dict_claves'))

    valores_traspaso = json.loads(request.POST.get('dict_traspasos'))

    traer_campos = traer_campos_edocs(request, request.POST.getlist('Id_empresa')[0], request.POST.getlist('t_pkmodulo')[0])

    traer_campos_funciones = traer_campos_funciones_edocs(request, request.POST.getlist('Id_empresa')[0], traer_campos, request.POST.getlist('t_pkmodulo')[0])
                                 
    tablas  = db_registro.tablas(request.POST.getlist('t_pkmodulo')[0])

    tabla_cab = traer_campos['tabla_cab']
    campos_cab = traer_campos['campos_cab']

    tabla_det = traer_campos['tabla_det']
    campos_det = traer_campos['campos_det']

    tabla_subdet = traer_campos['tabla_subdet']
    campos_subdet = traer_campos['campos_subdet']

    funciones_campos = traer_campos_funciones
    funciones_cab = funciones_campos[0]
    funciones_det = 0
    funciones_subdet = 0
    if len(tablas) > 1:
        funciones_det = funciones_campos[1]
    if len(tablas) > 2:
        funciones_subdet = funciones_campos[2]
    arr_buenas = []
    arr_errores = []
    
    for clave_int in listado:
        msg_errores = []
        dato_nulo = 0
        envio_datset = {}
        e_data = Factura_ingreso_rap(clave_int)
        if e_data['msg'] == 'no':
            print('Valio')
            arr_errores.append(clave_int)
            msg_errores.append('SRI No Contesta o clave anulada')
            return {'ok':0, 'Errores':arr_errores, 'msg':msg_errores}

        #####################################################################
        envio_datset[tablas[0]['Nombre']] = []

        if len(tablas) > 2:
            envio_datset[tablas[2]['Nombre']] = []
        #####################################################################cabecera

        arr_cab = {}

        desglose_cab = db_edocs.traer_edocs_desgloce(tablas[0]['PkEstructura'] )
        traspaso_cab = db_edocs.traer_edocs_traspaso(tablas[0]['PkEstructura'] )

        #pirmero iniciamos la cab commo nueva
        for a in campos_cab:
            arr_cab[a['Nombre']] = ''
            if a['TablaCampo'] == 'cmptxtsimple':
                arr_cab[a['Nombre']] = funciones_cab[a['Nombre']][0]['ValorPredeterminado']
            if a['TablaCampo'] == 'cmpnumsimple':
                arr_cab[a['Nombre']] = 0.00
            if a['TablaCampo'] == 'cmpnumsecuencial':
                if a['Nombre'][:2] == 'Pk':
                    arr_cab[a['Nombre']] = 0
                else:
                    arr_cab[a['Nombre']] = funciones_cab[a['Nombre']][0]['ValorInicial']
            if a['TablaCampo'] == 'cmpopcmultiple':
                arr_cab[a['Nombre']] = funciones_cab[a['Nombre']][0]["Valor"]
            if a['TablaCampo'] == 'cmpsistema':
                if funciones_cab[a['Nombre']][0]["Nombre"] == 'Usuario Actual':
                    arr_cab[a['Nombre']] = l_usuarios
                if funciones_cab[a['Nombre']][0]["Nombre"] == 'Fecha Actual': 
                    arr_cab[a['Nombre']] = str(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
            if a['TablaCampo'] == 'cmpformuladetalle':
                arr_cab[a['Nombre']] = 0
            if a['TablaCampo'] == 'cmpfecha':
                arr_cab[a['Nombre']] = str(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
            if a['TablaCampo'] == 'cmpoperacion':
                arr_cab[a['Nombre']] = 0

        #trasapsomos xml
        for desg in desglose_cab:
            arr_cab[desg['campo']] = e_data[desg['xml_cab']][desg['xml']]

        print('#arr_cab ------')
        print(arr_cab)

        print('#valores_traspaso ------')
        print(valores_traspaso)
        for tras in traspaso_cab:
            print('tras ----------------------')
            print(tras)
            arr_cab[tras['campo']] = valores_traspaso[tras['campo']]
        
        envio_datset[tablas[0]['Nombre']].append(arr_cab)



        for fila in envio_datset[tablas[0]['Nombre']]:
            for a in campos_cab:  
                if a['TablaCampo'] == 'cmpreferencia':
                    if fila[a['Nombre']] == '':
                        fila[a['Nombre']] = funciones_cab[a['Nombre']][0][0]['predeterminado_valor']
                    where = " "
                    modo = funciones_cab[a['Nombre']][0][0]["Modo"]
                    columnas = funciones_cab[a['Nombre']][0][0]["Columnas"]
                    campo = funciones_cab[a['Nombre']][0][0]["Sentencia"]
                    dato = fila[a['Nombre']]
                    tabla = funciones_cab[a['Nombre']][0][0]["TablaOrigen"]
                    orderby = " order by pk" + funciones_cab[a['Nombre']][0][0]["TablaOrigen"] + " desc "
                    for elm in funciones_cab[a['Nombre']][1]:
                        ElementoA = ""
                        ElementoB = ""
                        if elm["TipoA"] == "R":
                            ElementoA = "'" + str(fila[elm["ElementoA"]]) + "'"
                        if elm["TipoA"] == "V":
                            ElementoA = "'" + str(elm["ElementoA"]) + "'"
                        if elm["TipoA"] == "C":
                            ElementoA = elm["ElementoA"]

                        if elm["TipoB"] == "R":
                            ElementoB = "'" + str(fila[elm["ElementoB"]]) + "'"
                        if elm["TipoB"] == "V":
                            ElementoB = "'" + str(elm["ElementoB"]) + "'"
                        if elm["TipoB"] == "C":
                            ElementoB = elm["ElementoB"]

                        where = where + str(ElementoA) + ' ' + str(elm["Operador"])  + ' ' + str(ElementoB) +  ' and '
                    if where == " ":
                        where = ""
                    else:
                        where = ' and ' + str(where[:-4])
                    cmpsenten = 'select ' + str(columnas) + ' from ' + str(tabla) + ' where ' + str(campo) + ' like "' + str(dato) + '%"' + str(where)
                    ref_valor = db_registro.sql_traer_directo(cmpsenten)
                    if len(ref_valor) > 0:
                        fila[a['Nombre']] = ref_valor[0][funciones_cab[a['Nombre']][0][0]['Sentencia']]
                        for a2 in campos_cab:  
                            if a2['TablaCampo'] == 'cmpreferenciaadjunto':
                                #if funciones_cab[a2['Nombre']][0]['CampoReferencia'] == a['Nombre']:
                                if funciones_cab[a2['Nombre']][0]['PkCampoReferencia'] == a['PkCampo']:
                                    fila[a2['Nombre']] = ref_valor[0][funciones_cab[a2['Nombre']][0]['Sentencia']]
                    else:
                        msg_errores.append('Dato Nulo:' + str(a['Nombre']))
                        dato_nulo = 1



        if len(tablas) > 1:
            envio_datset[tablas[1]['Nombre']] = []
            desglose_det = db_edocs.traer_edocs_desgloce(tablas[1]['PkEstructura'] )
            traspaso_det = db_edocs.traer_edocs_traspaso(tablas[1]['PkEstructura'] )



            if len(desglose_det)>0:
                arr_det = {}

                #nuevoooo
                for a in campos_det:
                    arr_det[a['Nombre']] = ''
                    if a['TablaCampo'] == 'cmptxtsimple':
                        arr_det[a['Nombre']] = funciones_det[a['Nombre']][0]['ValorPredeterminado']
                    if a['TablaCampo'] == 'cmpnumsimple':
                        arr_det[a['Nombre']] = 0.00
                    if a['TablaCampo'] == 'cmpnumsecuencial':
                        if a['Nombre'][:2] == 'Pk':
                            arr_det[a['Nombre']] = 0
                        else:
                            arr_det[a['Nombre']] = funciones_det[a['Nombre']][0]['ValorInicial']
                    if a['TablaCampo'] == 'cmpopcmultiple':
                        arr_det[a['Nombre']] = funciones_det[a['Nombre']][0]["Valor"]
                    if a['TablaCampo'] == 'cmpsistema':
                        if funciones_cab[a['Nombre']][0]["Nombre"] == 'Usuario Actual':
                            arr_det[a['Nombre']] = l_usuarios
                        if funciones_cab[a['Nombre']][0]["Nombre"] == 'Fecha Actual':
                            arr_det[a['Nombre']] = str(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
                    if a['TablaCampo'] == 'cmpformuladetalle':
                        arr_det[a['Nombre']] = 0
                    if a['TablaCampo'] == 'cmpfecha':
                        arr_det[a['Nombre']] = str(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
                    if a['TablaCampo'] == 'cmpoperacion':
                        arr_det[a['Nombre']] = 0

                for lineas in e_data['detalle']:
                    arr_det_temp= {}
                    for ff in arr_det:
                        arr_det_temp[ff] = arr_det[ff]
                    #traspaso xml
                    for desg in desglose_det:
                        if desg['xml'] == 'impuesto-tarifa':
                            arr_det_temp[desg['campo']] = round(float(lineas[desg['xml']]))                           
                        else:
                            arr_det_temp[desg['campo']] = lineas[desg['xml']]

                    #traspaso traspaso
                    for tras in traspaso_det:
                        arr_det_temp[tras['campo']] = valores_traspaso[tras['campo']]

                    envio_datset[tablas[1]['Nombre']].append(arr_det_temp)

                pk_inicial = db_registro.sql_traer_directo("select if((max(Pk" + tablas[0]['Nombre'] + ")+ 1) is Null,1,(max(Pk" + tablas[0]['Nombre'] + ")+ 1)) as 'valor' from " + tablas[0]['Nombre']  )


                # calculo refencias y adjuntos
                for fila in envio_datset[tablas[1]['Nombre']]:
                    for a in campos_det:  
                        if a['TablaCampo'] == 'cmpreferencia':
                            if fila[a['Nombre']] == '':
                                fila[a['Nombre']] = funciones_det[a['Nombre']][0][0]['predeterminado_valor']
                            where = " "
                            modo = funciones_det[a['Nombre']][0][0]["Modo"]
                            columnas = funciones_det[a['Nombre']][0][0]["Columnas"]
                            campo = funciones_det[a['Nombre']][0][0]["Sentencia"]
                            dato = fila[a['Nombre']]
                            tabla = funciones_det[a['Nombre']][0][0]["TablaOrigen"]
                            orderby = " order by pk" + funciones_det[a['Nombre']][0][0]["TablaOrigen"] + " desc "
                            for elm in funciones_det[a['Nombre']][1]:
                                ElementoA = ""
                                ElementoB = ""
                                if elm["TipoA"] == "R":
                                    ElementoA = "'" + str(fila[elm["ElementoA"]]) + "'"
                                if elm["TipoA"] == "V":
                                    ElementoA = "'" + str(elm["ElementoA"]) + "'"
                                if elm["TipoA"] == "C":
                                    ElementoA = elm["ElementoA"]

                                if elm["TipoB"] == "R":
                                    ElementoB = "'" + str(fila[elm["ElementoB"]]) + "'"
                                if elm["TipoB"] == "V":
                                    ElementoB = "'" + str(elm["ElementoB"]) + "'"
                                if elm["TipoB"] == "C":
                                    ElementoB = elm["ElementoB"]
      
                                where = where + str(ElementoA) + ' ' + str(elm["Operador"])  + ' ' + str(ElementoB) +  ' and '
                            if where == " ":
                                where = ""
                            else:
                                where = ' and ' + str(where[:-4])
                            cmpsenten = 'select ' + str(columnas) + ' from ' + str(tabla) + ' where ' + str(campo) + ' like "' + str(dato) + '%"' + str(where)
                            print(cmpsenten)
                            ref_valor = db_registro.sql_traer_directo(cmpsenten)
                            print(ref_valor)

                            if len(ref_valor) > 0:
                                fila[a['Nombre']] = ref_valor[0][funciones_det[a['Nombre']][0][0]['Sentencia']]

                                for a2 in campos_det:  
                                    if a2['TablaCampo'] == 'cmpreferenciaadjunto':
                                        if funciones_det[a2['Nombre']][0]['CampoReferencia'] == a['Nombre']:
                                            fila[a2['Nombre']] = ref_valor[0][funciones_det[a2['Nombre']][0]['Sentencia']]
                            else:
                                msg_errores.append('Dato Nulo:' + str(a['Nombre']))
                                dato_nulo = 1

              

                # calculo detalle
                for fila in envio_datset[tablas[1]['Nombre']]:
                    for a in campos_det:    
                        if a['TablaCampo'] == 'cmpnumsecuencial':
                            if a['Nombre'][:2] == 'Pk' :
                                if a['Nombre'] == 'PKCabecera':
                                    fila[a['Nombre']] = pk_inicial
                                else:
                                    fila[a['Nombre']] = 0
                        if a['TablaCampo'] == 'cmpoperacion':
                            temp  = 0.0
                            operador = "="
                            Valor = 0.0
                            for u in funciones_det[a['Nombre']][1]:
                                if u["Estado"] == "O":
                                    operador = u["Sentencia"]
                                else:
                                    if u["Estado"] == "C":
                                        Valor = fila[u["Sentencia"]]
                                    if u["Estado"] == "V":
                                        Valor = u["Sentencia"]
                                    if operador == "=":
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
                            fila[a['Nombre']] = round(float(temp) , funciones_det[a['Nombre']][0][0]['Decimales'])          
                              
                        if a['TablaCampo'] == 'cmpconsolidado':
                            A_Select = 'Select ( '
                            A_From = 'From '
                            A_Where = 'Where '
                            A_Group = ''
                            A_GroupWhere = ''
                            sentencia = ""
                            FaltaDato = False
                            for x3 in funciones_det[a['Nombre']][1]:
                                A_From = A_From + str(x3["Tabla"]) + ' as ' + str(x3["Nombre"]) + ', '
                            if A_From == 'From ':
                                A_From = ''
                            else:
                                A_From = A_From[0:-2]
                            for x3 in funciones_det[a['Nombre']][2]:
                                if x3["Tipo"] == "Valor":
                                    A_Where = A_Where + " '" + str(x3["Elemento"]) + "' "
                                if x3["Tipo"] == "Operacion":
                                    A_Where = A_Where + " " + str(x3["Elemento"]) + " "                                                
                                if x3["Tipo"] == "Registro":
                                    A_Where = A_Where + " '" + str(fila[x3["Elemento"]]) + "' "                                                
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

                            for x3 in funciones_det[a['Nombre']][3]:
                                if x3["Tipo"] == "Valor":
                                    A_Select = A_Select + " '" + str(x3["Elemento"]) + "' "
                                if x3["Tipo"] == "Operacion":
                                    A_Select = A_Select + " " + str(x3["Elemento"]) + " "                                                
                                if x3["Tipo"] == "Registro":
                                    A_Select = A_Select + " '" + str(fila[x3["Elemento"]]) + "' "                                                
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
                                fila[a['Nombre']] = 0   
                            else:
                                fila[a['Nombre']] = tempo_valor[0][yy["Campo"]]       

                        if a['TablaCampo'] == 'cmpdecabecera':
                            fila[a['Nombre']] = envio_datset[tablas[0]['Nombre']][0][funciones_det[a['Nombre']][0]['Campo']]

                    #num_fila= num_fila +1       
        # calculo cabecera
        for fila in envio_datset[tablas[0]['Nombre']]:
            for a in campos_cab:    
                if a['TablaCampo'] == 'cmpnumsecuencial':
                    if a['Nombre'][:2] == 'Pk' :
                        if a['Nombre'] == 'PKCabecera':
                            fila[a['Nombre']] = pk_inicial
                        else:
                            fila[a['Nombre']] = 0
                if a['TablaCampo'] == 'cmpoperacion':
                    temp  = 0.0
                    operador = "="
                    Valor = 0.0
                    for u in funciones_cab[a['Nombre']][1]:
                        if u["Estado"] == "O":
                            operador = u["Sentencia"]
                        else:
                            if u["Estado"] == "C":
                                Valor = fila[u["Sentencia"]]
                            if u["Estado"] == "V":
                                Valor = u["Sentencia"]
                            if operador == "=":
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
                    fila[a['Nombre']] = round(float(temp) , funciones_cab[a['Nombre']][0][0]['Decimales'])        

                if a['TablaCampo'] == 'cmpconsolidado':
                    A_Select = 'Select ( '
                    A_From = 'From '
                    A_Where = 'Where '
                    A_Group = ''
                    A_GroupWhere = ''
                    sentencia = ""
                    FaltaDato = False
                    for x3 in funciones_cab[a['Nombre']][1]:
                        A_From = A_From + str(x3["Tabla"]) + ' as ' + str(x3["Nombre"]) + ', '
                    if A_From == 'From ':
                        A_From = ''
                    else:
                        A_From = A_From[0:-2]
                    for x3 in funciones_cab[a['Nombre']][2]:
                        if x3["Tipo"] == "Valor":
                            A_Where = A_Where + " '" + str(x3["Elemento"]) + "' "
                        if x3["Tipo"] == "Operacion":
                            A_Where = A_Where + " " + str(x3["Elemento"]) + " "                                                
                        if x3["Tipo"] == "Registro":
                            A_Where = A_Where + " '" + str(fila[x3["Elemento"]]) + "' "                                                
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
                        A_Where = ""

                    for x3 in funciones_cab[a['Nombre']][3]:
                        if x3["Tipo"] == "Valor":
                            A_Select = A_Select + " '" + str(x3["Elemento"]) + "' "
                        if x3["Tipo"] == "Operacion":
                            A_Select = A_Select + " " + str(x3["Elemento"]) + " "                                                
                        if x3["Tipo"] == "Registro":
                            A_Select = A_Select + " '" + str(fila[x3["Elemento"]]) + "' "                                                
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
                    A_Select = A_Select + " ) as '" + str(a['Nombre']) + "'"
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
                    tempo_valor = db_registro.cmpconso_ejecutar(sentencia)
                    if len(tempo_valor) == 0:
                        fila[a['Nombre']] = 0   
                    else:
                        fila[a['Nombre']] = tempo_valor[0][a['Nombre']]       

                if a['TablaCampo'] == 'cmpformuladetalle':
                    valor_final = 0
                    cc_final = 0
                    for filadet in envio_datset[tablas[1]['Nombre']]:
                        Campo_a_oper = funciones_cab[a['Nombre']][0][0]['Campo'].split('.')
                        Valor = filadet[Campo_a_oper[1]]
                        excluido = 0
                        for condi in funciones_cab[a['Nombre']][1]:
                            valor_comparar = 0
                            if condi['Tipo'] == 'Valor':
                                valor_comparar = condi['Valor']
                            else:
                                valor_comparar = filadet[condi['Valor']]
                            if condi['Operador'] == "=":
                                if float(filadet[condi['Campo']]) != float(valor_comparar):
                                    excluido = 1
                            if condi['Operador'] == "<":
                                if float(filadet[condi['Campo']]) >= float(valor_comparar):
                                    excluido = 1
                            if condi['Operador'] == ">":
                                if float(filadet[condi['Campo']]) <= float(valor_comparar):
                                    excluido = 1
                            if condi['Operador'] == "<=":
                                if float(filadet[condi['Campo']]) > float(valor_comparar):
                                    excluido = 1
                            if condi['Operador'] == ">=":
                                if float(filadet[condi['Campo']]) < float(valor_comparar):
                                    excluido = 1
                            if condi['Operador'] == "igual":
                                if str(filadet[condi['Campo']]) != str(valor_comparar):
                                    excluido = 1
                        if excluido == 0:
                            if funciones_cab[a['Nombre']][0][0]['Operacion'] == 'Suma':
                                valor_final =  float(valor_final) + float(Valor)
                            if funciones_cab[a['Nombre']][0][0]['Operacion'] == 'Maximo':
                                if parseFloat(valor_final) < parseFloat(Valor):
                                    valor_final = float(Valor)
                            if funciones_cab[a['Nombre']][0][0]['Operacion'] == 'Minimo':
                                if parseFloat(valor_final) > parseFloat(Valor):
                                    valor_final = float(Valor)
                            if funciones_cab[a['Nombre']][0][0]['Operacion'] == 'Contar':
                                valor_final =  valor_final + 1
                    fila[a['Nombre']] = round(float(valor_final) , 2)     

                if a['TablaCampo'] == 'cmpcondicional':
                    for u in funciones_cab[a['Nombre']][1]:
                        if u['TipoA'] == 'Campo':
                            valorA = fila[u['ElementoA']]
                        else:
                            valorA = u['ElementoA']
                        if u['TipoB'] == 'Campo':
                            valorB = fila[u['ElementoB']]
                        else:
                            valorB = u['ElementoB']
                        if u['TipoC'] == 'Campo':
                            valorC = fila[u['ElementoC']]
                        else:
                            valorC = u['ElementoC']
                        if u['Operador'] == '=':
                            if valorA == valorB:
                                fila[a['Nombre']] = valorC       
                        if u['Operador'] == '!=':
                            if valorA != valorB:
                                fila[a['Nombre']] = valorC     
        

        if dato_nulo == 0:
            senten_cab = []
            senten_det = []
            senten_subdet = []
            senten_acciones = []
            pk_cab = 0
            num_det = 0
            pk_cabecera = get_max(request, ("Pk"+ tablas[0]['Nombre']), tablas[0]['Nombre'], Id_empresa)         
            pk_detalle = 0
            pk_subdetalle = 0
            if (len(tablas) > 1):          
                pk_detalle = get_max(request, ("Pk"+ tablas[0]['Nombre'] + "Detalle"), tablas[0]['Nombre'] + "Detalle", Id_empresa)
            if (len(tablas) > 2):
                pk_subdetalle = get_max(request, ("Pk"+ tablas[0]['Nombre'] + "DetalleDetalle"), tablas[0]['Nombre'] + "DetalleDetalle", Id_empresa)
    
            for z in envio_datset[tablas[0]['Nombre']]:
                sentencia = "insert into `" + tablas[0]['Nombre'] +  "` (" 
                Vsentencia = "VALUES ("
                for i in campos_cab:
                    if i["TablaCampo"] == "cmpnumsecuencial":
                        if ((i["Nombre"]) == ("Pk"+ tablas[0]['Nombre'])):
                            z[i["Nombre"]] = pk_cabecera
                        else:
                            z[i["Nombre"]] = get_max(request, (i["Nombre"]), tablas[0]['Nombre'], Id_empresa)
                            actualizar_max(request, (i["Nombre"]), tablas[0]['Nombre'], z[i["Nombre"]], Id_empresa)
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
            if (len(tablas) > 1):
                for z in envio_datset[tablas[0]['Nombre'] + "Detalle"]:
                    sentencia = "insert into `" + tablas[0]['Nombre'] +  "Detalle` (" 
                    Vsentencia = "VALUES ("
                    for i in campos_det:
                        if i["TablaCampo"] == "cmpnumsecuencial":
                            if ((i["Nombre"]) == ("Pk"+ tablas[0]['Nombre'] + "Detalle")):
                                pkkabecera_subdetalle = z[i["Nombre"]]
                                z[i["Nombre"]] = pk_detalle + num_det
                            if ((i["Nombre"]) == ("PKCabecera")):
                                z[i["Nombre"]] = pk_cabecera
                        sentencia = sentencia + "`" + i["Nombre"] + "`, "  
                        txtvalor = str(z[i["Nombre"]]).replace("'", " ")
                        txtvalor = str(txtvalor).replace("Á", "A")
                        txtvalor = str(txtvalor).replace("É", "E")
                        txtvalor = str(txtvalor).replace("Í", "I")
                        txtvalor = str(txtvalor).replace("Ó", "O")
                        txtvalor = str(txtvalor).replace("Ú", "U")
                        Vsentencia = Vsentencia + "'" + str(txtvalor) + "', "  
                    senten_det.append( sentencia[:-2] + ") " + Vsentencia[:-2] + ")"  )

                    if (len(tablas) > 2):
                        for zz in envio_datset[tablas[0]['Nombre'] + "DetalleDetalle"]:
                            if pkkabecera_subdetalle == zz["PKCabecera"]:
                                sentencia = "insert into `" + tablas[0]['Nombre'] +  "DetalleDetalle` (" 
                                Vsentencia = "VALUES ("
                                for ii in campos_subdet:
                                    if ii["TablaCampo"] == "cmpnumsecuencial":
                                        if ((ii["Nombre"]) == ("Pk"+ tablas[0]['Nombre'] + "DetalleDetalle")):
                                            zz[ii["Nombre"]] = pk_subdetalle + num_subdet
                                        if ((ii["Nombre"]) == ("PKCabecera")):
                                            zz[ii["Nombre"]] = z["Pk"+ tablas[0]['Nombre'] + "Detalle"]
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

            senten_acc = EjecutarAcciones(request, Id_empresa, request.POST.getlist('t_pkmodulo')[0], 'Guardar Registro Nuevo', envio_datset)  

            db = web.con_db.transsaciones(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
            if db.ingreso_base(senten_cab, senten_det, senten_acc, request.POST.getlist('t_pkmodulo')[0], senten_subdet) == True:
                db = web.con_db.transsaciones(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
                senten_acc = EjecutarAcciones(request, Id_empresa, request.POST.getlist('t_pkmodulo')[0], "Post Guardar Registro Nuevo", envio_datset)  
                db.ingreso_post(senten_acc, request.POST.getlist('t_pkmodulo')[0])
                db.auditoria_ingresar(envio_datset, request.POST.getlist('usuario')[0], 'Guardar Registro Nuevo')
                for ax in senten_acc:
                    db.auditoria_ingresar(ax, request.POST.getlist('usuario')[0], 'Guardar Registro Nuevo')
                arr_buenas.append(clave_int)
            else:
                arr_errores.append(clave_int)
                msg_errores.append('Acciones')
        else: #no  se pudo
            arr_errores.append(clave_int)
            msg_errores.append('dato_nulo')

    return {'ok':0, 'Errores':arr_errores, 'msg':msg_errores,'buenas':arr_buenas}


def EjecutarAcciones(request, Id_empresa, pkmodulo, disparador, envio_datset):
     
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



def validar_condiciones(request, Id_empresa, v_PkAccion, cabecera):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    datosCabecera = db.TraerAccionescondiciones(v_PkAccion)
    for a in datosCabecera:
        if str(cabecera[request.POST.getlist('nom_tabla')[0]][0][a['ElementoA']]) != str(a['ElementoB']):
            return False  
    return True



def get_max(request, campo, tabla, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    cmpvalor = db.cmpconso_ejecutar("select if((max(" + campo + ")+ 1) is Null,1,(max(" + campo + ")+ 1)) as 'valor' from " + tabla  )
    return cmpvalor[0]["valor"]

def actualizar_max(request, campo, tabla, valor, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    db.solo_ejecutar('update estructura, cmpnumsecuencial set cmpnumsecuencial.ValorInicial = "' + str(valor) + '" where estructura.PkEstructura = cmpnumsecuencial.PkEstructura and  estructura.Nombre like "' + str(tabla) + '" and cmpnumsecuencial.Nombre like "' + str(campo) + '"')



def edocs_subir_sri(request, Id_empresa):
    db = web.con_db.edocs(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    doc_array = json.loads(request.POST.get('envio'))
    if len(doc_array) > 0:
        array_in = ""
        for i in doc_array:
            array_in = array_in + "'" + i + "',"
        array_in = array_in[:-1]
        invalidos= db.claves_invalidos(array_in)
        for ii in invalidos:
            del doc_array[ii["CLAVE_ACCESO"]]
        bloque = 0
        sentencia_t = ""
        sentencia_arr = []
        indicxx = 0
        for ii in doc_array:
            #sentencia_t = sentencia_t + db.dev_insert_docs(doc_array[ii])
            sentencia_arr.append(db.dev_insert_docs(doc_array[ii]))
            indicxx = indicxx + 1
        db.insert_docs_ejecutar(sentencia_arr)        
    return {'ok':0}

def edocs_traer_estru(request, Id_empresa, pkestructura):
    db = web.con_db.edocs(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    desglose = db.traer_edocs_desgloce(pkestructura)
    return desglose

def edocs_eliminaredocs(request, Id_empresa):
    db = web.con_db.edocs(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    db.edocs_eliminaredocs(request.POST.getlist('t_pkid')[0], request.POST.getlist('t_estado_sri')[0])
    return {'pkid':request.POST.getlist('t_pkid')[0]}


def edocs_sri(request, Id_empresa):
    db = web.con_db.edocs(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    registros_pend = db.traer_edocs_pendientes(request.POST.getlist('t_fecha')[0], request.POST.getlist('t_orden')[0], request.POST.getlist('t_filtro')[0])
    registros_ingre = db.traer_edocs_ingresados(request.POST.getlist('t_fecha')[0], request.POST.getlist('t_orden')[0], request.POST.getlist('t_filtro')[0])
    registros_recha = db.traer_edocs_rechazadas(request.POST.getlist('t_fecha')[0], request.POST.getlist('t_orden')[0], request.POST.getlist('t_filtro')[0])
    enlaces = db.traer_edocs_enlaces()
    for a in enlaces:
        a['desgloce'] = db.traer_edocs_desgloce(a['pkmodulo'])
    return {'registros_pend':registros_pend,'registros_ingre':registros_ingre,'registros_recha':registros_recha,'enlaces':enlaces}

def carga_docs(request):
    db = web.con_db.inter_login_LOGIN("Mysql") 
    condicion = ""
    try:
        condicion =  " and " + request.POST.getlist('filtro')[0] + " like '" + request.POST.getlist('filtro_valor')[0] + "%'"
    except IndexError:
        condicion = ""
    total_num = db.cantidad_filas(request.POST.getlist('user_id')[0], request.POST.getlist('tipo')[0], request.POST.getlist('flujo')[0], condicion)

    if request.POST.getlist('num_pag')[0] == 0:
        num_pag_menos = 0
    else:
        num_pag_menos = int(request.POST.getlist('num_pag')[0]) - 1

    encabezado = ""
    if request.POST.getlist('flujo')[0] == 'r_':
        encabezado = "Recibidas "
    else:
        encabezado = "Emitidas "

    num_pag_mas = int(request.POST.getlist('num_pag')[0]) + 1

    cantidad_filas = int(request.POST.getlist('num_pag')[0]) * 100
    Lista_docs = db.traer_edocs(request.POST.getlist('user_id')[0], request.POST.getlist('tipo')[0], request.POST.getlist('flujo')[0], cantidad_filas,request.POST.getlist('limite')[0], condicion)
    tipo_print = ""
    if request.POST.getlist('tipo')[0] == "factura":
        tipo_print = encabezado + "Facturas"
    if request.POST.getlist('tipo')[0] == "retencion":
        tipo_print = encabezado + "Comprobante Retención"
    if request.POST.getlist('tipo')[0] == "credito":
        tipo_print = encabezado + "Nota de Crédito"
    if request.POST.getlist('tipo')[0] == "debito":
        tipo_print = encabezado + "Nota de Débito"
    if request.POST.getlist('tipo')[0] == "remision":
        tipo_print = encabezado + "Guia de Remisión"
    max_pag = int(int(total_num[0]['total']) / 100)
    context = {'max_pag':max_pag,'Lista_docs': Lista_docs, 'tipo': request.POST.getlist('tipo')[0], 'tipo_print': tipo_print, 'num_pag': request.POST.getlist('num_pag')[0], 'num_pag_mas':num_pag_mas, 'num_pag_menos':num_pag_menos,  'limite':request.POST.getlist('limite')[0]}
    return context


def xmlload2(request, Id_empresa, ruc):
    req = request.FILES.get('files')
    # Read the uploaded file line by line and save it to the list
    doc_array = {}
    lineas = req.read().splitlines()
    indixx = 0
    for line in lineas:
        try:
            linea = line.decode("utf-8")
            palabras = linea.split('\t') 
        except UnicodeDecodeError:
            pass
        try:
            if palabras[0] == "Factura":
                if palabras[8] == ruc:
                    if palabras[2] != ruc:
                        if palabras[0] == "Factura":
                            doc_array.update({palabras[10]:val_doc(palabras, 0, "Factura", str(float( lineas[indixx + 1])))})
                        if palabras[0] == "Comprobante de Retenci?n":
                            doc_array.update({palabras[10]:val_doc(palabras, 0, "Retencion", str(float( lineas[indixx + 1])))})
                        if palabras[0] == "Notas de cr?dito":
                            doc_array.update({palabras[10]:val_doc(palabras, 0, "Credito", str(float( lineas[indixx + 1])))})
                        if palabras[0] == "Notas de d?bito":
                            doc_array.update({palabras[10]:val_doc(palabras, 0, "Debito", str(float( lineas[indixx + 1])))})
                        if palabras[0] == "Gu?as de remisi?n":
                            doc_array.update({palabras[10]:val_doc(palabras, 0, "Remision", str(float( lineas[indixx + 1])))})
        except ObjectDoesNotExist:
            pass
        indixx = indixx + 1

    db = web.con_db.edocs(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    if len(doc_array) > 0:
        array_in = ""
        for i in doc_array:
            array_in = array_in + "'" + i + "',"
        array_in = array_in[:-1]
        invalidos= db.claves_invalidos(array_in)
        for ii in invalidos:
            del doc_array[ii["CLAVE_ACCESO"]]
        bloque = 0
        sentencia_t = ""
        sentencia_arr = []
        indicxx = 0
        for ii in doc_array:
            bloque = bloque + 1
            indicxx = indicxx + 1
            #sentencia_t = sentencia_t + db.dev_insert_docs(doc_array[ii])
            sentencia_arr.append(db.dev_insert_docs(doc_array[ii]))
            if bloque >= 100:
                db.insert_docs_ejecutar(sentencia_arr)
                sentencia_arr = []     
                bloque = 0   
        db.insert_docs_ejecutar(sentencia_arr)                
    registros = db.traer_edocs(request.POST.getlist('t_fecha')[0])
    return {'registros':registros}

def xmlload(request):
    xmlup = request.POST.getlist('files')[0]
    user_id = ''
    lineas = xmlup[0].encode(sys.stdout.encoding, errors='replace')
    lineas_decode = lineas.decode('latin-1')
    lineas_split = lineas_decode.splitlines()
    doc_array = {}
    for i in lineas_split:
        palabras = i.split('\t')
        try:
            if palabras[0] == "Factura":
                doc_array.update({palabras[10]:val_doc(palabras, user_id, "factura")})
            if palabras[0] == "Comprobante de Retenci?n":
                doc_array.update({palabras[10]:val_doc(palabras, user_id, "retencion")})
            if palabras[0] == "Notas de cr?dito":
                doc_array.update({palabras[10]:val_doc(palabras, user_id, "credito")})
            if palabras[0] == "Notas de d?bito":
                doc_array.update({palabras[10]:val_doc(palabras, user_id, "debito")})
            if palabras[0] == "Gu?as de remisi?n":
                doc_array.update({palabras[10]:val_doc(palabras, user_id, "remision")})
        except ObjectDoesNotExist:
            pass
    if len(doc_array) > 0:
        array_in = ""
        for i in doc_array:
            array_in = array_in + "'" + i + "',"
        array_in = array_in[:-1]
        db = web.con_db.inter_login_LOGIN("Mysql")
        invalidos= db.claves_invalidos(array_in, user_id[0])
        for ii in invalidos:
            del doc_array[ii["clave"]]
        bloque = 0
        sentencia_t = ""
        for ii in doc_array:
            bloque = bloque + 1
            sentencia_t = sentencia_t + db.insert_docs(doc_array[ii], "r_", user_id[0])
            db.insert_docs(doc_array[ii], "r_", user_id[0])

        respuesta = "Ingreso exitoso de: " +  str(len(doc_array))
        return respuesta
    else:
        return "Documentos Actualizados."



def actualizar_docs(id_empresa):
    db = web.con_db.inter_login_LOGIN("Mysql")
    conn = db.traer_conn_empresa(id_empresa)
    if len(conn) > 0:
        db_cliente = web.con_db.externo_cliente(conn[0]['user'], conn[0]['pass'], conn[0]['base'], conn[0]['ip'])
        tipo_actu = db.traer_tipos_actualizar(id_empresa, 'r_') 
        if len(tipo_actu) > 0:
            for i in tipo_actu:
                if i['sentencia'] != 'No':
                    str_pendientes = ""
                    pendientes = db.traer_pend(id_empresa,i['tipo'], 'r_')
                    if len(pendientes) > 0:
                        for ii in pendientes:
                            str_pendientes = str_pendientes + "'" + ii['autorizacion'] + "',"
                        str_pendientes = str_pendientes[:-1]
                        claves_ingresadas = db_cliente.devolver_ingresados(i['sentencia'], str_pendientes)
                        str_claves_ingresadas = ""
                        for ii in claves_ingresadas:
                            str_claves_ingresadas = str_claves_ingresadas + "'" + ii['autorizacion'] + "',"
                        str_claves_ingresadas = str_claves_ingresadas[:-1]
                        db.actualizar_docs(str_claves_ingresadas, 'r_',  id_empresa)

def val_doc(doc, id, tipo, vall):
    try:
        factura = {}
        numeros = str(doc[1]).split("-")
        factura.update({'estab':numeros[0]})    
        factura.update({'punto':numeros[1]})
        factura.update({'numero':numeros[2]})
        factura.update({'emisor_id':doc[2]})
        factura.update({'valor':vall})
        if len(doc) == 11:
            factura.update({'emisor_razon':doc[3]})
            factura.update({'fecha':devolver_fecha(doc[4])})
            factura.update({'recp_id':doc[8]})
            factura.update({'autorizacion':doc[9]})
            factura.update({'clave':doc[10]})
        else:
            factura.update({'emisor_razon':str(doc[3]) + ' '+ str(doc[4])})
            factura.update({'fecha':devolver_fecha(doc[5])})
            factura.update({'recp_id':doc[9]})
            factura.update({'autorizacion':doc[10]})
            factura.update({'clave':doc[11]})
        factura.update({'tipo': tipo})
        return factura
        if val_vacio(factura) == True:
            if val_fechas(factura['fecha']) == True:
                if factura['recp_id'] == str(id[0]):
                    return factura
                else:
                    if factura['recp_id'] == str(id[0])[:-3]:
                        return factura
    except ObjectDoesNotExist:
        pass
    return ""

def devolver_fecha(txt_fecha):
    arr_date = txt_fecha.split("/")
    return arr_date[2] + "-" + arr_date[1] + "-" + arr_date[0]

def val_vacio(doc):
    for i in doc:
        if isNotEmpty(doc[i]) == False:
            return False
    return True

def isNotEmpty(s):
    return bool(s and s.strip())

def val_fechas(date_text):
    try:
        dt = parser.parse(date_text)
        return True
    except ValueError:
        return False


def ingresos(visita_fecha, visita_ip, fuente):
    db = web.con_db.inter_login_LOGIN("Mysql") 
    db.log_externo(str(visita_fecha), visita_ip, fuente)

def Factura_ingreso_rap(Clave_doc):
        parser = etree.XMLParser(recover=True)
        y= 0
        for a in Clave_doc:
            y=y +1
        try:
            if Clave_doc[23] == '2':
                client = Client("https://cel.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl") # produccion
                print('prod')
            else:
                client = Client("https://celcer.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl") # pruebas
                print('prueba')
        except:
            print("An exception occurred")
            return {'msg':'no'}

        respuesta = client.service.autorizacionComprobante(Clave_doc)
        respuestaBruta = respuesta[2]
        try:
            respuestaInterna = respuestaBruta[0]
        except IndexError:
            context = {'Clave_doc': Clave_doc}
            return context

        respuestaInterna2 = respuestaInterna[0]
        #comprobante_xml = respuestaInterna2[4]   
        comprobante_xml = ET.fromstring(respuestaInterna2[4]  )

        compro_pasar = {'infoTributaria':{},'infoFactura':{},'detalle':[],'infoAdicional':{}, 'msg':'si'}

        
        for child in comprobante_xml:
            if child.tag == "infoTributaria":
                for child in child:
                    compro_pasar['infoTributaria'][child.tag] = child.text           
            if child.tag == "infoFactura":
                for child in child:
                    if child.tag != "pagos":
                        if child.tag != "totalConImpuestos":
                            if child.tag  == 'fechaEmision':
                                compro_pasar['infoFactura'][child.tag] = datetime.datetime.strptime(child.text, '%d/%m/%Y').strftime('%Y-%m-%d')
                            else:
                                compro_pasar['infoFactura'][child.tag] = child.text           
            if child.tag == "detalles":
                for child in child:
                    tempo = {}
                    for child in child:
                        if child.tag == "impuestos":
                            for child in child:
                                for child in child:                                
                                    tempo['impuesto-'+str(child.tag)] = child.text
                        else:
                            if not(child.tag == "detallesAdicionales"):
                                tempo[child.tag] = child.text
                    compro_pasar['detalle'].append(tempo)
            if child.tag == "infoAdicional":
                for child in child:
                    compro_pasar['infoAdicional'][child.attrib['nombre']] = child.text           
        return compro_pasar


def Factura(Clave_doc):
        parser = etree.XMLParser(recover=True)
        y= 0
        for a in Clave_doc:
            y=y +1
        if Clave_doc[23] == '2':
            try:
                client = Client("https://cel.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl") # produccion
            except Exception as e:
                context = {'Clave_doc': Clave_doc}
                return context
            print('prod')
        else:
            try:
                client = Client("https://celcer.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl") # pruebas
            except Exception as e:
                context = {'Clave_doc': Clave_doc}
                return context
            print('prueba')
        respuesta = client.service.autorizacionComprobante(Clave_doc)
        respuestaBruta = respuesta[2]
        try:
            respuestaInterna = respuestaBruta[0]
        except IndexError:
            context = {'Clave_doc': Clave_doc}
            return context

        respuestaInterna2 = respuestaInterna[0]
        #comprobante_xml = respuestaInterna2[4]   
        comprobante_xml = ET.fromstring(respuestaInterna2[4]  )

        root = ET.Element("autorizacion")

        estado = ET.SubElement(root, "estado")
        estado.text = respuestaInterna2[0]
        numeroAutorizacion = ET.SubElement(root, "numeroAutorizacion")
        numeroAutorizacion.text = respuestaInterna2[1]
        fechaAutorizacion = ET.SubElement(root, "fechaAutorizacion")
        fechaAutorizacion.text = str(respuestaInterna2[2])
        ambiente = ET.SubElement(root, "ambiente")
        ambiente.text = respuestaInterna2[3]
        comprobante = ET.SubElement(root, "comprobante")
        comprobante.text = respuestaInterna2[4]
        mensajes = ET.SubElement(root, "mensajes")
        mensajes.text = respuestaInterna2[5]

        # wrap it in an ElementTree instance, and save as XML
        tree = ET.ElementTree(root)
        tree.write("static/archivos/" + Clave_doc +".xhtml")
        tree = ET.parse("static/archivos/" + Clave_doc +".xhtml")
        
        # if you need the root element, use getroot
        root = tree.getroot()
        tree.write("static/archivos/" + Clave_doc +".xml")

        val_fijos =  {'fechaAuto' : "", 'Codigo_int' : "", 'contribuyenteEspecial' : "", 'Forma_pago' : "", 'numeroAutorizacion' : respuestaInterna2[1], 'fechaEmision' : " ",    'dirEstablecimiento' : " ",    'obligadoContabilidad' : " ",    'tipoIdentificacionComprador' : " ",    'razonSocialComprador' : " ",    'identificacionComprador' : " ",    'totalSinImpuestos' : 0,    'totalDescuento' : 0,    'totalConImpuestos' : 0,    'propina' : 0,    'importeTotal' : 0,    'moneda' : 0,    'ambiente' : " ",    'tipoEmision' : " ",    'razonSocial' : " ",    'nombreComercial' : " ",    'ruc' : " ",    'claveAcceso' : " ",    'codDoc' : " ",    'estab' : " ",    'ptoEmi' : " ",    'secuencial' : " ",    'dirMatriz' : " ",    'formaPago' : " ",    'total' : 0,    'plazo' : " ",    'unidadTiempo' : " "}
        val_detalles = {'codigoPrincipal': [], 'codigoAuxiliar': [], 'codigoInterno':[], 'descripcion': [], 'cantidad': [], 'precioUnitario': [], 'descuento': [], 'precioTotalSinImpuesto': [] , 'precioSinSubsidio': [], 'unidadMedida': []  }
        Val_subtotales = {'codigo' : [],'codigoPorcentaje' : [],'descuentoAdicional' : [],'baseImponible' : [],'valor' : [], 'tarifa' : []}
        Val_Totales = {'base0' : "", 'base12' : "", 'base14' : "", 'base0des' : "", 'base12des' : "", 'base14des' : "", 'iva' : ""}

        val_infoAdicional_nombre =  {'Nombre': [], 'Valor': []}
        

        JVcodigoPrincipal = []
        JVcodigoAuxiliar = []
        JVdescripcion = []
        JVcantidad = []
        JVprecioUnitario = []
        JVdescuento = []
        JVprecioTotalSinImpuesto = []
        JVinfoAdicional_nombre = []
        JVinfoAdicional_valor = []
        val_fijos['fechaAuto'] =  str(respuestaInterna2[2])
        
        for child in comprobante_xml:
            if child.tag == "infoTributaria":
                for child in child:
                    val_fijos[child.tag] = child.text
            
            if child.tag == "infoFactura":
                for child in child:
                    if child.tag == "pagos":
                        for child in child:
                            if child.tag == "pago":
                                for child in child:
                                    val_fijos[child.tag] = child.text
                                    val_fijos['Forma_pago'] = devulevo_forma_pago(child.text)
                            val_fijos[child.tag] = child.text
                    else:
                        if child.tag == "totalConImpuestos":
                            for child in child:
                                for child in child:
                                    if child.tag != 'valorDevolucionIva':
                                        Val_subtotales[child.tag].append(child.text)
                        else:
                            if child.tag == "contribuyenteEspecial":
                                val_fijos[child.tag] = "Contribuyente Especial:" + child.text
                            else:
                                val_fijos[child.tag] = child.text
            if child.tag == "detalles":
                for child in child:
                    for child in child:
                        if not(child.tag == "impuestos"):
                            if not(child.tag == "detallesAdicionales"):
                                val_detalles[child.tag].append(child.text)
                            
            if child.tag == "infoAdicional":
                for child in child:
                    val_infoAdicional_nombre['Nombre'].append(child.attrib['nombre'])
                    val_infoAdicional_nombre['Valor'].append(child.text)
                            
        
        html_Datelle =''
        if len(Val_subtotales['descuentoAdicional']) == 0:
            Val_subtotales['descuentoAdicional'].append("0")
        if len(val_detalles['codigoAuxiliar']) == 0:
            val_detalles['codigoAuxiliar'].append("0")

        for i in range(0,len(val_detalles['codigoPrincipal'])):
            html_Datelle += "<tr> <td>" + val_detalles['codigoPrincipal'][i] + "<br></td>"
            try:
                html_Datelle += "<td>" + val_detalles['codigoAuxiliar'][i] + "<br></td>"
            except IndexError:
                html_Datelle += "<td>0<br></td>"

            html_Datelle += "<td>" + val_detalles['cantidad'][i] + "<br></td>"        
            html_Datelle += "<td>" + val_detalles['descripcion'][i] + "<br></td>"
    
            html_Datelle += "<td>" + val_detalles['precioUnitario'][i] + "<br></td>"
            html_Datelle += "<td>" + val_detalles['descuento'][i] + "<br></td>"
            html_Datelle += "<td>" + val_detalles['precioTotalSinImpuesto'][i] + "<br></td>"
            html_Datelle += "</tr>"
        

            JVcodigoPrincipal.append(val_detalles['codigoPrincipal'][i])
            try:
                JVcodigoAuxiliar.append(val_detalles['codigoAuxiliar'][i])
            except IndexError:
                JVcodigoAuxiliar.append(0)

            JVdescripcion.append(str(val_detalles['descripcion'][i]))
            JVcantidad.append(val_detalles['cantidad'][i])
            JVprecioUnitario.append(val_detalles['precioUnitario'][i])
            JVdescuento.append(val_detalles['descuento'][i])
            JVprecioTotalSinImpuesto.append(val_detalles['precioTotalSinImpuesto'][i])

        html_Adicional =''
        for xx in range(0,len(val_infoAdicional_nombre['Nombre'])):
            html_Adicional += val_infoAdicional_nombre['Nombre'][xx] + ": " + val_infoAdicional_nombre['Valor'][xx] + "<br>"
            JVinfoAdicional_nombre.append(str(val_infoAdicional_nombre['Nombre'][xx]))
            JVinfoAdicional_valor.append(str(val_infoAdicional_nombre['Valor'][xx]))
       
       
        Val_Totales = {'base0' : 0.00, 'base12' : 0.00, 'base14' : 0.00, 'base0des' : 0.00, 'base12des' : 0.00, 'base14des' : 0.00, 'iva' : 0}



        for xx in range(0,len(Val_subtotales['codigo'])):
            if Val_subtotales['codigoPorcentaje'][xx] == "0":
                Val_Totales['base0'] = float(Val_subtotales['baseImponible'][xx])
                try:
                    Val_Totales['base0des'] = float(Val_subtotales['descuentoAdicional'][xx])
                except IndexError:
                    Val_Totales['base12des'] = float(0)

                Val_Totales['iva'] +=  float(Val_subtotales['valor'][xx])
            if Val_subtotales['codigoPorcentaje'][xx] == "2":
                Val_Totales['base12'] = float(Val_subtotales['baseImponible'][xx])
                try:
                    Val_Totales['base12des'] = float(Val_subtotales['descuentoAdicional'][xx])
                except IndexError:
                    Val_Totales['base12des'] = float(0)
                Val_Totales['iva'] += float(Val_subtotales['valor'][xx])
            if Val_subtotales['codigoPorcentaje'][xx] == "3":
                Val_Totales['base14'] = float(Val_subtotales['baseImponible'][xx])
                try:    
                    Val_Totales['base14des'] = float(Val_subtotales['descuentoAdicional'][xx])
                except IndexError:
                    Val_Totales['base14des'] = float(0)
                Val_Totales['iva'] +=  float(Val_subtotales['valor'][xx])

        for a in Val_Totales:
            Val_Totales[a] = str(Val_Totales[a])
                    
        #Receptor = usuarios.objects.get(receptor_id=val_fijos['ruc'] )
        val_fijos['Codigo_int'] = val_fijos['ruc']
        context = {'val_fijos': val_fijos, 'html_Datelle': html_Datelle, 'html_Adicional': html_Adicional, 'Val_Totales': Val_Totales, 'JVcodigoPrincipal' : JVcodigoPrincipal, 'JVcodigoAuxiliar' : JVcodigoAuxiliar, 'JVdescripcion' : JVdescripcion, 'JVcantidad' : JVcantidad, 'JVprecioUnitario' : JVprecioUnitario, 'JVdescuento' : JVdescuento, 'JVprecioTotalSinImpuesto' : JVprecioTotalSinImpuesto, 'JVinfoAdicional_nombre' : JVinfoAdicional_nombre, 'JVinfoAdicional_valor' : JVinfoAdicional_valor  }
        return context

def Retencion(Clave_doc):
        #if Clave_doc[23] == 2:
        #    client = Client("https://cel.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl") # produccion
        #else:
        #    client = Client("https://celcer.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl") # pruebas
        
        y= 0
        for a in Clave_doc:
            y=y +1
        if Clave_doc[23] == '2':
            client = Client("https://cel.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl") # produccion
            print('prod')
        else:
            client = Client("https://celcer.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl") # pruebas
            print('prueba')
        respuesta = client.service.autorizacionComprobante(Clave_doc)
        respuestaBruta = respuesta[2]
        try:
            respuestaInterna = respuestaBruta[0]
        except IndexError:
            context = {'Clave_doc': Clave_doc}
            return context
        respuestaInterna2 = respuestaInterna[0]
        #comprobante_xml = respuestaInterna2[4]       
        comprobante_xml = ET.fromstring(respuestaInterna2[4]  )
        root = ET.Element("autorizacion")

        estado = ET.SubElement(root, "estado")
        estado.text = respuestaInterna2[0]
        numeroAutorizacion = ET.SubElement(root, "numeroAutorizacion")
        numeroAutorizacion.text = respuestaInterna2[1]
        fechaAutorizacion = ET.SubElement(root, "fechaAutorizacion")
        fechaAutorizacion.text = str(respuestaInterna2[2])
        ambiente = ET.SubElement(root, "ambiente")
        ambiente.text = respuestaInterna2[3]
        comprobante = ET.SubElement(root, "comprobante")
        comprobante.text = respuestaInterna2[4]
        mensajes = ET.SubElement(root, "mensajes")
        mensajes.text = respuestaInterna2[5]
        
                       
        # wrap it in an ElementTree instance, and save as XML
        tree = ET.ElementTree(root)
        tree.write("static/archivos/" + Clave_doc +".xhtml")

        tree = ET.parse("static/archivos/" + Clave_doc +".xhtml")
        root = tree.getroot()
        
        # ...manipulate tree...
               
        tree.write("static/archivos/" + Clave_doc +".xml")
        
     
        #comprobante_xml = ElementTree.XML(comprobante_xml[38:])        
        treecomprobante_xml  = ET.ElementTree(comprobante_xml)

        #xml_comprobante = ET.fromstring(comprobante_xml)
        #treecomprobante_xml.write("edocs/archivos/bruto_" + Clave_doc +".xml")
        treecomprobante_xml.write("static/archivos/bruto_" + Clave_doc +".xml")

        #print (treecomprobante_xml)

        #print type(treecomprobante_xml)
        
        val_fijos = { 'Codigo_int' : "", 'numeroAutorizacion' : respuestaInterna2 [ 1 ], 'fechaEmision' : " ", 'ambiente' : "", 'razonSocial' : "", 'nombreComercial' : "", 'ruc' : "", 'claveAcceso' : "", 'codDoc' : "", 'estab' : "", 'ptoEmi' : "", 'secuencial' : "", 'dirMatriz' : ""}
        val_infoCompRetencion = {'fechaAuto' : "", 'fechaEmision' : "", 'dirEstablecimiento' : "", 'contribuyenteEspecial' : "", 'obligadoContabilidad' : "", 'tipoIdentificacionSujetoRetenido' : "", 'razonSocialSujetoRetenido' : "", 'identificacionSujetoRetenido' : "", 'periodoFiscal' : "",}
        val_impuestos = {'codigo': [], 'codigoRetencion': [], 'baseImponible': [], 'porcentajeRetener': [], 'valorRetenido': [], 'codDocSustento': [], 'numDocSustento': [], 'fechaEmisionDocSustento': []   }
        val_infoAdicional_nombre =  {'Nombre': [], 'Valor': []}
        

        JVNumero = []
        JVFecha = []
        JVEjercicio = []
        JVCodigo = []
        JVBase_Imponible = []
        JVImpuesto = []
        JVProcentaje = []
        JVValor = []
        val_fijos['fechaAuto'] =  str(respuestaInterna2[2])
        JVinfoAdicional_nombre = []
        JVinfoAdicional_valor = []

        for child in comprobante_xml:
            if child.tag == "infoTributaria":
                for child in child:
                    val_fijos[child.tag] = child.text
            if child.tag == "infoCompRetencion":
                for child in child:
                    if child.tag == "contribuyenteEspecial":
                        val_infoCompRetencion[child.tag] = "Contribuyente Especial:" + child.text
                    else:
                        val_infoCompRetencion[child.tag] = child.text
            if child.tag == "impuestos":
                for child in child:
                    for child in child:
                        val_impuestos[child.tag].append(child.text)
            if child.tag == "infoAdicional":
                for child in child:
                    val_infoAdicional_nombre['Nombre'].append(child.attrib['nombre'])
                    val_infoAdicional_nombre['Valor'].append(child.text)
        html_Datelle =''

        if len(val_impuestos['numDocSustento']) == 0:
            val_impuestos['numDocSustento'].append("0")
        for i in range(0,len(val_impuestos['codigo'])):

            try:
                html_Datelle += "<tr> <td>" + val_impuestos['numDocSustento'][i] + "<br></td>"
                JVNumero.append(val_impuestos['numDocSustento'][i])

            except IndexError:
                html_Datelle += "<tr> <td> <br></td>"
                JVNumero.append("0")



            #html_Datelle += "<td>" + val_impuestos['fechaEmisionDocSustento'][i] + "<br></td>"
            #JVFecha.append(val_impuestos['fechaEmisionDocSustento'][i])
            #JVEjercicio.append(str(val_impuestos['fechaEmisionDocSustento'][i][3:]))
            
            #html_Datelle += "<td>" + val_impuestos['fechaEmisionDocSustento'][i][3:] + "<br></td>"
            if val_impuestos['codigo'][i] == "1":
                html_Datelle += "<td>" + val_impuestos['codigoRetencion'][i] + "<br></td>"
                html_Datelle += "<td>" + val_impuestos['baseImponible'][i] + "<br></td>"
                html_Datelle += "<td> Renta <br></td>"
                html_Datelle += "<td>" + val_impuestos['porcentajeRetener'][i] + "<br></td>"
                html_Datelle += "<td>" + val_impuestos['valorRetenido'][i] + "<br></td>"
                
                JVCodigo.append(val_impuestos['codigoRetencion'][i])
                JVBase_Imponible.append(val_impuestos['baseImponible'][i])
                JVImpuesto.append("Renta")
                JVProcentaje.append(val_impuestos['porcentajeRetener'][i])
                JVValor.append(val_impuestos['valorRetenido'][i])
                
            if val_impuestos['codigo'][i] == "2":
                html_Datelle += "<td>" + devulevo_CodigoRete_iva(val_impuestos['codigoRetencion'][i]) + "<br></td>"
                html_Datelle += "<td>" + val_impuestos['baseImponible'][i] + "<br></td>"
                html_Datelle += "<td> Iva <br></td>"
                html_Datelle += "<td>" + val_impuestos['porcentajeRetener'][i] + "<br></td>"
                html_Datelle += "<td>" + val_impuestos['valorRetenido'][i] + "<br></td>"
                
                JVCodigo.append(devulevo_CodigoRete_iva(val_impuestos['codigoRetencion'][i]))
                JVBase_Imponible.append(val_impuestos['baseImponible'][i])
                JVImpuesto.append("Iva")
                JVProcentaje.append(val_impuestos['porcentajeRetener'][i])
                JVValor.append(val_impuestos['valorRetenido'][i])
          
            html_Datelle += "</tr>"
  
        html_Adicional =''
   
        for xx in range(0,len(val_infoAdicional_nombre['Nombre'])):
            html_Adicional += val_infoAdicional_nombre['Nombre'][xx] + ": " + val_infoAdicional_nombre['Valor'][xx] + "<br>"
            JVinfoAdicional_nombre.append(str(val_infoAdicional_nombre['Nombre'][xx]))
            JVinfoAdicional_valor.append(str(val_infoAdicional_nombre['Valor'][xx]))
       

        
        val_fijos['Codigo_int'] = val_fijos['ruc']
        #print Receptor
        context = {'val_impuestos': val_impuestos, 'val_infoCompRetencion': val_infoCompRetencion, 'val_fijos': val_fijos, 'html_Datelle': html_Datelle, 'html_Adicional': html_Adicional, 'JVNumero' : JVNumero, 'JVFecha' : JVFecha, 'JVEjercicio' : JVEjercicio, 'JVCodigo' : JVCodigo, 'JVBase_Imponible' : JVBase_Imponible, 'JVImpuesto' : JVImpuesto, 'JVProcentaje' : JVProcentaje, 'JVValor' :JVValor, 'JVinfoAdicional_nombre' : JVinfoAdicional_nombre, 'JVinfoAdicional_valor' : JVinfoAdicional_valor  }
        return context

def Credito(Clave_doc):
  
        y= 0
        for a in Clave_doc:
            y=y +1
        if Clave_doc[23] == '2':
            client = Client("https://cel.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl") # produccion
            print('prod')
        else:
            client = Client("https://celcer.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl") # pruebas
            print('prueba')

        respuesta = client.service.autorizacionComprobante(Clave_doc)
        #print respuesta
        respuestaBruta = respuesta[2]
        respuestaInterna = respuestaBruta[0]
        respuestaInterna2 = respuestaInterna[0]
        #comprobante_xml = respuestaInterna2[4]       
        comprobante_xml = ET.fromstring(respuestaInterna2[4]  )
        root = ET.Element("autorizacion")

        estado = ET.SubElement(root, "estado")
        estado.text = respuestaInterna2[0]
        numeroAutorizacion = ET.SubElement(root, "numeroAutorizacion")
        numeroAutorizacion.text = respuestaInterna2[1]
        fechaAutorizacion = ET.SubElement(root, "fechaAutorizacion")
        fechaAutorizacion.text = str(respuestaInterna2[2])
        ambiente = ET.SubElement(root, "ambiente")
        ambiente.text = respuestaInterna2[3]
        comprobante = ET.SubElement(root, "comprobante")
        comprobante.text = respuestaInterna2[4]
        mensajes = ET.SubElement(root, "mensajes")
        mensajes.text = respuestaInterna2[5]
        
                       
        # wrap it in an ElementTree instance, and save as XML
        tree = ET.ElementTree(root)
        tree.write("static/archivos/" + Clave_doc +".xhtml")

        tree = ET.parse("static/archivos/" + Clave_doc +".xhtml")
        root = tree.getroot()
        
        # ...manipulate tree...
               
        tree.write("static/archivos/" + Clave_doc +".xml")
        
     
        #comprobante_xml = ElementTree.XML(comprobante_xml[38:])        
        treecomprobante_xml  = ET.ElementTree(comprobante_xml)

        #xml_comprobante = ET.fromstring(comprobante_xml)
        #treecomprobante_xml.write("edocs/archivos/bruto_" + Clave_doc +".xml")
        treecomprobante_xml.write("static/archivos/bruto_" + Clave_doc +".xml")

        #print (treecomprobante_xml)

        #print type(treecomprobante_xml)
        
        val_fijos =  {'fechaAuto' : "", 'codDocModificado' : "", 'numDocModificado' : "", 'fechaEmisionDocSustento' : "", 'motivo' : "", 'Codigo_int' : "", 'contribuyenteEspecial' : "", 'Forma_pago' : "", 'numeroAutorizacion' : respuestaInterna2[1], 'fechaEmision' : " ", 'dirEstablecimiento' : " ", 'obligadoContabilidad' : " ",   'tipoIdentificacionComprador' : " ",    'razonSocialComprador' : " ",   'identificacionComprador' : " ",    'totalSinImpuestos' : " ",  'totalDescuento' : " ", 'totalConImpuestos' : " ",  'propina' : " ",    'importeTotal' : " ",   'moneda' : " ", 'ambiente' : " ",   'tipoEmision' : " ",    'razonSocial' : " ",    'nombreComercial' : " ",    'ruc' : " ",    'claveAcceso' : " ",    'codDoc' : " ", 'estab' : " ",  'ptoEmi' : " ", 'secuencial' : " ", 'dirMatriz' : " ",  'formaPago' : " ",  'total' : " ",  'plazo' : " ",  'unidadTiempo' : " "}
        val_detalles = {'codigoInterno': [], 'codigoAdicional': [], 'descripcion': [], 'cantidad': [], 'precioUnitario': [], 'descuento': [], 'precioTotalSinImpuesto': []}
        Val_subtotales = {'codigo' : [],'codigoPorcentaje' : [],'descuentoAdicional' : [],'baseImponible' : [],'valor' : []}
        Val_Totales = {'base0' : "", 'base12' : "", 'base14' : "", 'base0des' : "0.00", 'base12des' : "0.00", 'base14des' : "0.00", 'iva' : ""}

        val_infoAdicional_nombre =  {'Nombre': [], 'Valor': []}
        

        JVcodigoPrincipal = []
        JVcodigoAuxiliar = []
        JVdescripcion = []
        JVcantidad = []
        JVprecioUnitario = []
        JVdescuento = []
        JVprecioTotalSinImpuesto = []
        
        JVinfoAdicional_nombre = []
        JVinfoAdicional_valor = []
        val_fijos['fechaAuto'] =  str(respuestaInterna2[2])

        for child in comprobante_xml:

            if child.tag == "infoTributaria":
                for child in child:
                    val_fijos[child.tag] = child.text
                    
            
            if child.tag == "infoNotaCredito":
                for child in child:
                    if child.tag == "pagos":
                        for child in child:
                            if child.tag == "pago":
                                for child in child:
                                    val_fijos[child.tag] = child.text
                                    val_fijos['Forma_pago'] = devulevo_forma_pago(child.text)
                            val_fijos[child.tag] = child.text
                    else:
                        if child.tag == "totalConImpuestos":
                            for child in child:
                                for child in child:
                                    Val_subtotales[child.tag].append(child.text)
                        else:
                            if child.tag == "contribuyenteEspecial":
                                val_fijos[child.tag] = "Contribuyente Especial:" + child.text
                            else:
                                val_fijos[child.tag] = child.text
            if child.tag == "detalles":
                for child in child:
                    for child in child:
                        if not(child.tag == "impuestos"):
                            val_detalles[child.tag].append(child.text)
            if child.tag == "infoAdicional":
                for child in child:
                    val_infoAdicional_nombre['Nombre'].append(child.attrib['nombre'])
                    val_infoAdicional_nombre['Valor'].append(child.text)
        html_Datelle =''
        for i in range(0,len(val_detalles['codigoInterno'])):
            html_Datelle += "'<tr> <td>" + val_detalles['codigoInterno'][i] + "<br></td>"
            html_Datelle += "<td>" + val_detalles['codigoAdicional'][i] + "<br></td>"
            html_Datelle += "<td>" + val_detalles['descripcion'][i] + "<br></td>"
            html_Datelle += "<td>" + val_detalles['cantidad'][i] + "<br></td>"
            html_Datelle += "<td>" + val_detalles['precioUnitario'][i] + "<br></td>"
            html_Datelle += "<td>" + val_detalles['descuento'][i] + "<br></td>"
            html_Datelle += "<td>" + val_detalles['precioTotalSinImpuesto'][i] + "<br></td>"
            html_Datelle += "</tr>"
        

            JVcodigoPrincipal.append(val_detalles['codigoInterno'][i])
            JVcodigoAuxiliar.append(val_detalles['codigoAdicional'][i])
            JVdescripcion.append(str(val_detalles['descripcion'][i]))
            JVcantidad.append(val_detalles['cantidad'][i])
            JVprecioUnitario.append(val_detalles['precioUnitario'][i])
            JVdescuento.append(val_detalles['descuento'][i])
            JVprecioTotalSinImpuesto.append(val_detalles['precioTotalSinImpuesto'][i])

        html_Adicional =''
     
        
        for xx in range(0,len(val_infoAdicional_nombre['Nombre'])):
            html_Adicional += val_infoAdicional_nombre['Nombre'][xx] + ": " + val_infoAdicional_nombre['Valor'][xx] + "<br>"
            JVinfoAdicional_nombre.append(str(val_infoAdicional_nombre['Nombre'][xx]))
            JVinfoAdicional_valor.append(str(val_infoAdicional_nombre['Valor'][xx]))
       
       
        Val_Totales = {'base0' : 0.00, 'base12' : 0.00, 'base14' : 0.00, 'base0des' : 0.00, 'base12des' : 0.00, 'base14des' : 0.00, 'iva' : 0}


        for xx in range(0,len(Val_subtotales['codigo'])):
            if Val_subtotales['codigoPorcentaje'][xx] == "0":
                Val_Totales['base0'] = float(Val_subtotales['baseImponible'][xx])
                #Val_Totales['base0des'] = float(Val_subtotales['descuentoAdicional'][xx])
                Val_Totales['iva'] +=  float(Val_subtotales['valor'][xx])
            if Val_subtotales['codigoPorcentaje'][xx] == "2":
                Val_Totales['base12'] = float(Val_subtotales['baseImponible'][xx])
                #Val_Totales['base12des'] = float(Val_subtotales['descuentoAdicional'][xx])
                Val_Totales['iva'] += float(Val_subtotales['valor'][xx])
            if Val_subtotales['codigoPorcentaje'][xx] == "3":
                Val_Totales['base14'] = float(Val_subtotales['baseImponible'][xx])
                #Val_Totales['base14des'] = float(Val_subtotales['descuentoAdicional'][xx])
                Val_Totales['iva'] +=  float(Val_subtotales['valor'][xx])

        for a in Val_Totales:
            Val_Totales[a] = str(Val_Totales[a])
                  
        context = {'val_fijos': val_fijos, 'html_Datelle': html_Datelle, 'html_Adicional': html_Adicional, 'Val_Totales': Val_Totales, 'JVcodigoPrincipal' : JVcodigoPrincipal, 'JVcodigoAuxiliar' : JVcodigoAuxiliar, 'JVdescripcion' : JVdescripcion, 'JVcantidad' : JVcantidad, 'JVprecioUnitario' : JVprecioUnitario, 'JVdescuento' : JVdescuento, 'JVprecioTotalSinImpuesto' : JVprecioTotalSinImpuesto, 'JVinfoAdicional_nombre' : JVinfoAdicional_nombre, 'JVinfoAdicional_valor' : JVinfoAdicional_valor  }
        return context

def Guia(Clave_doc):
        if Clave_doc[23] == 2:
            client = Client("https://cel.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl") # produccion
        else:
            client = Client("https://celcer.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl") # pruebas

        respuesta = client.service.autorizacionComprobante(Clave_doc)
        #print respuesta
        respuestaBruta = respuesta[2]
        respuestaInterna = respuestaBruta[0]
        respuestaInterna2 = respuestaInterna[0]
        #comprobante_xml = respuestaInterna2[4]       
        comprobante_xml = ET.fromstring(respuestaInterna2[4]  )
        root = ET.Element("autorizacion")

        estado = ET.SubElement(root, "estado")
        estado.text = respuestaInterna2[0]
        numeroAutorizacion = ET.SubElement(root, "numeroAutorizacion")
        numeroAutorizacion.text = respuestaInterna2[1]
        fechaAutorizacion = ET.SubElement(root, "fechaAutorizacion")
        fechaAutorizacion.text = str(respuestaInterna2[2])
        ambiente = ET.SubElement(root, "ambiente")
        ambiente.text = respuestaInterna2[3]
        comprobante = ET.SubElement(root, "comprobante")
        comprobante.text = respuestaInterna2[4]
        mensajes = ET.SubElement(root, "mensajes")
        mensajes.text = respuestaInterna2[5]
        
                       
        # wrap it in an ElementTree instance, and save as XML
        tree = ET.ElementTree(root)
        tree.write("static/archivos/" + Clave_doc +".xhtml")

        tree = ET.parse("static/archivos/" + Clave_doc +".xhtml")
        root = tree.getroot()
        
        # ...manipulate tree...
               
        tree.write("static/archivos/" + Clave_doc +".xml")
        
     
        #comprobante_xml = ElementTree.XML(comprobante_xml[38:])        
        treecomprobante_xml  = ET.ElementTree(comprobante_xml)

        #xml_comprobante = ET.fromstring(comprobante_xml)
        #treecomprobante_xml.write("edocs/archivos/bruto_" + Clave_doc +".xml")
        treecomprobante_xml.write("static/archivos/bruto_" + Clave_doc +".xml")

        #print (treecomprobante_xml)

        #print type(treecomprobante_xml)
        
        val_fijos =  {'fechaAuto' : "", 'codDocModificado' : "", 'numDocModificado' : "", 'fechaEmisionDocSustento' : "", 'motivo' : "", 'Codigo_int' : "", 'contribuyenteEspecial' : "", 'Forma_pago' : "", 'numeroAutorizacion' : respuestaInterna2[1], 'fechaEmision' : " ", 'dirEstablecimiento' : " ", 'obligadoContabilidad' : " ",   'tipoIdentificacionComprador' : " ",    'razonSocialComprador' : " ",   'identificacionComprador' : " ",    'totalSinImpuestos' : " ",  'totalDescuento' : " ", 'totalConImpuestos' : " ",  'propina' : " ",    'importeTotal' : " ",   'moneda' : " ", 'ambiente' : " ",   'tipoEmision' : " ",    'razonSocial' : " ",    'nombreComercial' : " ",    'ruc' : " ",    'claveAcceso' : " ",    'codDoc' : " ", 'estab' : " ",  'ptoEmi' : " ", 'secuencial' : " ", 'dirMatriz' : " ",  'formaPago' : " ",  'total' : " ",  'plazo' : " ",  'unidadTiempo' : " "}
        val_detalles = {'codigoInterno': [], 'codigoAdicional': [], 'descripcion': [], 'cantidad': [], 'precioUnitario': [], 'descuento': [], 'precioTotalSinImpuesto': []}
        Val_subtotales = {'codigo' : [],'codigoPorcentaje' : [],'descuentoAdicional' : [],'baseImponible' : [],'valor' : []}
        Val_Totales = {'base0' : "", 'base12' : "", 'base14' : "", 'base0des' : "0.00", 'base12des' : "0.00", 'base14des' : "0.00", 'iva' : ""}

        val_infoAdicional_nombre =  {'Nombre': [], 'Valor': []}
        

        JVcodigoPrincipal = []
        JVcodigoAuxiliar = []
        JVdescripcion = []
        JVcantidad = []
        JVprecioUnitario = []
        JVdescuento = []
        JVprecioTotalSinImpuesto = []
        
        JVinfoAdicional_nombre = []
        JVinfoAdicional_valor = []
        val_fijos['fechaAuto'] =  str(respuestaInterna2[2])

        for child in comprobante_xml:

            if child.tag == "infoTributaria":
                for child in child:
                    val_fijos[child.tag] = child.text
                    
            
            if child.tag == "infoNotaCredito":
                for child in child:
                    if child.tag == "pagos":
                        for child in child:
                            if child.tag == "pago":
                                for child in child:
                                    val_fijos[child.tag] = child.text
                                    val_fijos['Forma_pago'] = devulevo_forma_pago(child.text)
                            val_fijos[child.tag] = child.text
                    else:
                        if child.tag == "totalConImpuestos":
                            for child in child:
                                for child in child:
                                    Val_subtotales[child.tag].append(child.text)
                        else:
                            if child.tag == "contribuyenteEspecial":
                                val_fijos[child.tag] = "Contribuyente Especial:" + child.text
                            else:
                                val_fijos[child.tag] = child.text
            if child.tag == "detalles":
                for child in child:
                    for child in child:
                        if not(child.tag == "impuestos"):
                            val_detalles[child.tag].append(child.text)
            if child.tag == "infoAdicional":
                for child in child:
                    val_infoAdicional_nombre['Nombre'].append(child.attrib['nombre'])
                    val_infoAdicional_nombre['Valor'].append(child.text)
        html_Datelle =''
        for i in range(0,len(val_detalles['codigoInterno'])):
            html_Datelle += "'<tr> <td>" + val_detalles['codigoInterno'][i] + "<br></td>"
            html_Datelle += "<td>" + val_detalles['codigoAdicional'][i] + "<br></td>"
            html_Datelle += "<td>" + val_detalles['descripcion'][i] + "<br></td>"
            html_Datelle += "<td>" + val_detalles['cantidad'][i] + "<br></td>"
            html_Datelle += "<td>" + val_detalles['precioUnitario'][i] + "<br></td>"
            html_Datelle += "<td>" + val_detalles['descuento'][i] + "<br></td>"
            html_Datelle += "<td>" + val_detalles['precioTotalSinImpuesto'][i] + "<br></td>"
            html_Datelle += "</tr>"
        

            JVcodigoPrincipal.append(val_detalles['codigoInterno'][i])
            JVcodigoAuxiliar.append(val_detalles['codigoAdicional'][i])
            JVdescripcion.append(str(val_detalles['descripcion'][i]))
            JVcantidad.append(val_detalles['cantidad'][i])
            JVprecioUnitario.append(val_detalles['precioUnitario'][i])
            JVdescuento.append(val_detalles['descuento'][i])
            JVprecioTotalSinImpuesto.append(val_detalles['precioTotalSinImpuesto'][i])

        html_Adicional =''
     
        
        for xx in range(0,len(val_infoAdicional_nombre['Nombre'])):
            html_Adicional += val_infoAdicional_nombre['Nombre'][xx] + ": " + val_infoAdicional_nombre['Valor'][xx] + "<br>"
            JVinfoAdicional_nombre.append(str(val_infoAdicional_nombre['Nombre'][xx]))
            JVinfoAdicional_valor.append(str(val_infoAdicional_nombre['Valor'][xx]))
       
       
        Val_Totales = {'base0' : 0.00, 'base12' : 0.00, 'base14' : 0.00, 'base0des' : 0.00, 'base12des' : 0.00, 'base14des' : 0.00, 'iva' : 0}


        for xx in range(0,len(Val_subtotales['codigo'])):
            if Val_subtotales['codigoPorcentaje'][xx] == "0":
                Val_Totales['base0'] = float(Val_subtotales['baseImponible'][xx])
                #Val_Totales['base0des'] = float(Val_subtotales['descuentoAdicional'][xx])
                Val_Totales['iva'] +=  float(Val_subtotales['valor'][xx])
            if Val_subtotales['codigoPorcentaje'][xx] == "2":
                Val_Totales['base12'] = float(Val_subtotales['baseImponible'][xx])
                #Val_Totales['base12des'] = float(Val_subtotales['descuentoAdicional'][xx])
                Val_Totales['iva'] += float(Val_subtotales['valor'][xx])
            if Val_subtotales['codigoPorcentaje'][xx] == "3":
                Val_Totales['base14'] = float(Val_subtotales['baseImponible'][xx])
                #Val_Totales['base14des'] = float(Val_subtotales['descuentoAdicional'][xx])
                Val_Totales['iva'] +=  float(Val_subtotales['valor'][xx])
        context = {'val_fijos': val_fijos, 'html_Datelle': html_Datelle, 'html_Adicional': html_Adicional, 'Val_Totales': Val_Totales, 'JVcodigoPrincipal' : JVcodigoPrincipal, 'JVcodigoAuxiliar' : JVcodigoAuxiliar, 'JVdescripcion' : JVdescripcion, 'JVcantidad' : JVcantidad, 'JVprecioUnitario' : JVprecioUnitario, 'JVdescuento' : JVdescuento, 'JVprecioTotalSinImpuesto' : JVprecioTotalSinImpuesto, 'JVinfoAdicional_nombre' : JVinfoAdicional_nombre, 'JVinfoAdicional_valor' : JVinfoAdicional_valor  }
        return context


def devulevo_forma_pago(codigo):
    if codigo == "01":
        return "SIN UTILIZACION DEL SISTEMA FINANCIERO"
    if codigo == "15":
        return "COMPENSACON DE DEUDAS"
    if codigo == "16":
        return "TARJETA DE DEBITO"
    if codigo == "17":
        return "DINERO ELECTRONICO"
    if codigo == "18":
        return "TARJETA PREPAGO"
    if codigo == "19":
        return "TARJETA DE CREDITO"
    if codigo == "20":
        return "OTROS CON UTILIZACION DEL SISTEMA FINANCIERO"
    if codigo == "21":
        return "ENDOSO DE TITULOS"
    return "SIN UTILIZACION DEL SISTEMA FINANCIERO"
def devulevo_CodigoRete_iva(codigo):
    if codigo == "1":
        return "725"
    if codigo == "2":
        return "727"
    if codigo == "3":
        return "729"
    if codigo == "9":
        return "721"
    if codigo == "10":
        return "723"
    if codigo == "11":
        return "727"
    return codigo

def get_ip(request):
    """Returns the IP of the request, accounting for the possibility of being
    behind a proxy.
    """
    ip = request.META.get("HTTP_X_FORWARDED_FOR", None)
    if ip:
        # X_FORWARDED_FOR returns client1, proxy1, proxy2,...
        ip = ip.split(", ")[0]
    else:
        ip = request.META.get("REMOTE_ADDR", "")
    return ip
def elimina_tildes(s):
   return ''.join((c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn'))

