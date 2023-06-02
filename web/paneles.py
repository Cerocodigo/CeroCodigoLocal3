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



def cambiarfechaTag(request, Id_empresa, usuario, t_pkpanel, fecha_new, fecha_old, T_usuario, T_valor): 
    db = web.con_db.paneles(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 

    # se deberia mover el tag en web_p_panel_grupo_track de la fecha a la nueva hay usuario y pkpanel
    #borrar las fechas en web_p_panel_grupo_track
    db.ejecutar_scrips("delete from web_p_panel_grupo_track where fecha = '"+str(fecha_old)+"' and upper(usuario) = upper('"+str(T_usuario)+"') and pk_valor  = '"+str(T_valor)+"' and pkpanel  = '"+str(t_pkpanel)+"'")
    db.ejecutar_scrips("delete from web_p_panel_grupo_track where fecha = '"+str(fecha_new)+"' and upper(usuario) = upper('"+str(T_usuario)+"') and pk_valor  = '"+str(T_valor)+"' and pkpanel  = '"+str(t_pkpanel)+"'")
    ## insertar nuevo tag
    db.ejecutar_scrips("INSERT INTO `web_p_panel_grupo_track` (`pkpanel`, `fecha`, `pk_valor`, `usuario`) VALUES ('"+str(t_pkpanel)+"', '"+str(fecha_new)+"', '"+str(T_valor)+"', '"+str(T_usuario)+"')")

    # traer los script de actualizar tag de la tabla *web_p_panel_grupos*
    srcips = db.traer_cambiotag(t_pkpanel)

    for query in srcips:
        if query['cambiotag'] != '':
            senten = str(query['cambiotag']).replace('@fecha_new@',fecha_new).replace('@fecha_old@',fecha_old).replace('@user@',T_usuario).replace('@pk@',T_valor)
            db.ejecutar_scrips(senten)

    return {'t_pkpanel':t_pkpanel, 'fecha_new':fecha_new, 'fecha_old':fecha_old, 'T_usuario':T_usuario, 'T_valor':T_valor}


def ficha_new(request, Id_empresa): 
    db = web.con_db.paneles(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    fichaprevia = db.ficha_existe(request.POST.getlist('t_pkpanle')[0],request.POST.getlist('t_fecha')[0],request.POST.getlist('t_pkval')[0], request.POST.getlist('usuario')[0])
    if len(fichaprevia) == 0:
        db.ficha_new(request.POST.getlist('t_pkpanle')[0],request.POST.getlist('t_fecha')[0],request.POST.getlist('t_pkval')[0], request.POST.getlist('usuario')[0])
        return {'resp':'si'}
    else:
        return {'resp':'no'}



def determinar_fecha_sub_paneles(request, Id_empresa, usuario, t_tabla, T_valor, t_campo, t_fecha, t_filtro, t_dir): 
    db = web.con_db.paneles(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    senten = 'select DATEDIFF('+t_campo+',"' +t_fecha+'") as "diff", '+t_campo+' as "newfecha" from '+t_tabla+' where '+t_filtro+' = ' + T_valor
    if t_dir == '1':
        senten = senten + ' and  DATEDIFF('+t_campo+',"' +t_fecha+'") >0 ORDER BY diff limit 1'
    if t_dir == '0':
        senten = senten + ' and DATEDIFF('+t_campo+',"' +t_fecha+'") <0 ORDER BY diff desc limit 1'
    return db.traer_sql_directo(senten)

def traer_sub_paneles_Imagen(request, Id_empresa, usuario, t_pkpanel, T_valor, t_fecha): 
    db = web.con_db.paneles(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    listas_imagen = db.traer_sub_paneles_Imagen(t_pkpanel, T_valor)
    listas_valor = db.traer_sql_directo(str(listas_imagen[0]['senten']).replace('@fecha@',t_fecha))
    return ({'listas_imagen':listas_imagen, 'listas_valor':listas_valor,'t_pkpanel':t_pkpanel })


def traer_sub_paneles(request, Id_empresa, usuario, t_pkpanel, T_valor, t_fecha, t_user): 
    db = web.con_db.paneles(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    paneles = {}
    estados = {}
    notas = {}
    db_panel = db.traer_panel_por_pk(t_pkpanel)
    if db_panel[0]['tipo'] != 'Agrupado':
        dbgrupos = db.traer_paneles_fichaspk(t_pkpanel, usuario)
        etiquetas = db.traer_paneles_pdf_fichaspk(t_pkpanel)
        panell = db.traer_panel_por_pk(t_pkpanel)
        d_fechas = db.traer_paneles_fechas_fichaspk(t_pkpanel, T_valor)
        for yy in dbgrupos:       
            yy['vals'] = db.traer_notas_valores(yy["cond_base"].replace('@pk@',T_valor).replace('@fecha@',t_fecha).replace('@user@',t_user))
            div_roe = str(yy['Valor']).split('//')
            if len(div_roe) >1:
                yy['Valor'] = {}
                yy['Valor'][yy['pkgrupo']] = {}
                for yyy in div_roe:
                    if len(yyy) > 0:
                        div_camp = yyy.split('$')
                        if div_camp[0] == '@calculo':              
                            yy['Valor'][yy['pkgrupo']][div_camp[1]] = {}
                            yy['Valor'][yy['pkgrupo']][div_camp[1]]['tipo'] = div_camp[0]
                            yy['Valor'][yy['pkgrupo']][div_camp[1]]['base'] = div_camp[1]                      
                            yy['Valor'][yy['pkgrupo']][div_camp[1]]['calculo'] = div_camp[2]                      
                        if div_camp[0] == '@opcion':              
                            bas_temp = db.traer_sql_directo(div_camp[2])
                            yy['Valor'][yy['pkgrupo']][div_camp[1]] = {}
                            yy['Valor'][yy['pkgrupo']][div_camp[1]]['tipo'] = div_camp[0]
                            yy['Valor'][yy['pkgrupo']][div_camp[1]]['vlas'] = bas_temp    
                        if div_camp[0] == '@listado':              
                            bas_temp = db.traer_sql_directo(div_camp[2])
                            yy['Valor'][yy['pkgrupo']][div_camp[1]] = {}
                            yy['Valor'][yy['pkgrupo']][div_camp[1]]['tipo'] = div_camp[0]
                            yy['Valor'][yy['pkgrupo']][div_camp[1]]['vlas'] = bas_temp                    
                        if div_camp[0] == '@referencia':
                            yy['Valor'][yy['pkgrupo']][div_camp[1]] = {}
                            yy['Valor'][yy['pkgrupo']][div_camp[1]]['tipo'] = div_camp[0]
                            yy['Valor'][yy['pkgrupo']][div_camp[1]]['campos'] = div_camp[2]
                            yy['Valor'][yy['pkgrupo']][div_camp[1]]['from'] = div_camp[3]
                            yy['Valor'][yy['pkgrupo']][div_camp[1]]['anexos'] = div_camp[4]  
                            if len(div_camp) > 5:
                                yy['Valor'][yy['pkgrupo']][div_camp[1]]['distinct'] = div_camp[5]              
                            else:
                                yy['Valor'][yy['pkgrupo']][div_camp[1]]['distinct'] = ''                                     
        return ({'tipo':'Unico','dbgrupos':dbgrupos, 'etiquetas':etiquetas, 'panell':panell, 'd_fechas':d_fechas})
    if db_panel[0]['tipo'] == 'Agrupado':
        dbinternos = db.traer_panel_internos(t_pkpanel)
        retorno = []
        d_fechas = db.traer_paneles_fechas_fichaspk(t_pkpanel, T_valor)

        for interno in dbinternos:
            dbgrupos = db.traer_paneles_fichaspk(interno['pkPanel'])
            etiquetas = db.traer_paneles_pdf_fichaspk(interno['pkPanel'])
            panell = db.traer_panel_por_pk(interno['pkPanel'])
            for yy in dbgrupos:       
                yy['vals'] = db.traer_notas_valores(yy["cond_base"].replace('@pk@',T_valor).replace('@fecha@',t_fecha))
                div_roe = str(yy['Valor']).split('//')
                if len(div_roe) >1:
                    yy['Valor'] = {}
                    yy['Valor'][yy['pkgrupo']] = {}
                    for yyy in div_roe:
                        if len(yyy) > 0:
                            div_camp = yyy.split('$')
                            if div_camp[0] == '@calculo':              
                                yy['Valor'][yy['pkgrupo']][div_camp[1]] = {}
                                yy['Valor'][yy['pkgrupo']][div_camp[1]]['tipo'] = div_camp[0]
                                yy['Valor'][yy['pkgrupo']][div_camp[1]]['base'] = div_camp[1]                      
                                yy['Valor'][yy['pkgrupo']][div_camp[1]]['calculo'] = div_camp[2]                      
                            if div_camp[0] == '@opcion':              
                                bas_temp = db.traer_sql_directo(div_camp[2])
                                yy['Valor'][yy['pkgrupo']][div_camp[1]] = {}
                                yy['Valor'][yy['pkgrupo']][div_camp[1]]['tipo'] = div_camp[0]
                                yy['Valor'][yy['pkgrupo']][div_camp[1]]['vlas'] = bas_temp    
                            if div_camp[0] == '@listado':              
                                bas_temp = db.traer_sql_directo(div_camp[2])
                                yy['Valor'][yy['pkgrupo']][div_camp[1]] = {}
                                yy['Valor'][yy['pkgrupo']][div_camp[1]]['tipo'] = div_camp[0]
                                yy['Valor'][yy['pkgrupo']][div_camp[1]]['vlas'] = bas_temp                    
                            if div_camp[0] == '@referencia':
                                yy['Valor'][yy['pkgrupo']][div_camp[1]] = {}
                                yy['Valor'][yy['pkgrupo']][div_camp[1]]['tipo'] = div_camp[0]
                                yy['Valor'][yy['pkgrupo']][div_camp[1]]['campos'] = div_camp[2]
                                yy['Valor'][yy['pkgrupo']][div_camp[1]]['from'] = div_camp[3]
                                yy['Valor'][yy['pkgrupo']][div_camp[1]]['anexos'] = div_camp[4]  
                                if len(div_camp) > 5:
                                    yy['Valor'][yy['pkgrupo']][div_camp[1]]['distinct'] = div_camp[5]              
                                else:
                                    yy['Valor'][yy['pkgrupo']][div_camp[1]]['distinct'] = ''                                     
            retorno.append({'dbgrupos':dbgrupos, 'etiquetas':etiquetas, 'panell':panell, 'Nombre':interno['nombre'], 'pkPanel':interno['pkPanel']})
        return ({'tipo':'Multiple','retorno':retorno, 'd_fechas':d_fechas})


def traer_paneles(request, Id_empresa, usuario): 
    db = web.con_db.paneles(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    paneles = {}
    estados = {}
    notas = {}
    dbpaneles = db.traer_paneles_por_user(usuario, '0')
    for xx in dbpaneles:
        dbestados = db.traer_estados(xx["pkpanel"])
        estados.update({xx["pkpanel"]:dbestados})
        for yy in dbestados:
            dbnotas = db.traer_notas_valores(yy["senten"].replace('@usuario',usuario))
            notas.update({yy["pkestado"]:dbnotas})
    paneles = dbpaneles
    return ({'paneles':paneles, 'estados':estados, 'notas':notas })

def traer_mensajes(request, Id_empresa): 
    db = web.con_db.paneles(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    list_mensajes = db.traer_mensajes(request.POST.getlist('usuario')[0])
    return ({ 'list_mensajes':list_mensajes})

def traer_tareas(request, Id_empresa): 
    db = web.con_db.paneles(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    list_tareas = db.traer_tareas(request.POST.getlist('usuario')[0])
    List_subtareas = db.traer_subtareas(request.POST.getlist('usuario')[0]) 
    return ({ 'list_tareas':list_tareas, 'List_subtareas':List_subtareas})

def tareas_finalizar(request, Id_empresa): 
    db = web.con_db.paneles(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    db.tareas_finalizar(request.POST.getlist('pktarea')[0])
    return ({ 'ok':1})

def tareas_sub_finalizar(request, Id_empresa): 
    db = web.con_db.paneles(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    db.tareas_sub_finalizar(request.POST.getlist('pktarea')[0])
    return ({ 'ok':1})

def cambio_rapido(request, Id_empresa): 
    db = web.con_db.paneles(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    db.cambio_rapido(request.POST.getlist('V_tabla')[0], request.POST.getlist('V_campo')[0], request.POST.getlist('valor')[0], request.POST.getlist('V_registro')[0])
    return ({ 'ok':1})


def tareas_crear(request, Id_empresa): 
    db = web.con_db.paneles(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    pk_ultima = db.tareas_crear(request.POST.getlist('usuario')[0],request.POST.getlist('txt_tar')[0],request.POST.getlist('txt_proy')[0] )
    valores_tab = json.loads(request.POST.get('val_tabla'))
    for a in valores_tab:
        db.add_sub_tarea(pk_ultima[0]['pk'], valores_tab[a]['sub_tar'], valores_tab[a]['resp'], valores_tab[a]['fecha_ini'],valores_tab[a]['fecha_ent'], valores_tab[a]['tar_area'])
    return ({'ok':1})

def add_sub_tarea(request, Id_empresa):  
    db = web.con_db.paneles(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    db.add_sub_tarea(request.POST.getlist('pksubtarea')[0], request.POST.getlist('tar_text')[0], request.POST.getlist('tar_resp')[0],request.POST.getlist('tar_fecha_ini')[0],request.POST.getlist('tar_fecha_ent')[0],request.POST.getlist('tar_area')[0])
    ultima_tar = db.traer_subtareas_pk_ultima(request.POST.getlist('pksubtarea')[0]) 
    return ({ 'ultima_tar':ultima_tar})
def tareas_indi(request, Id_empresa): 
    db = web.con_db.paneles(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    list_tareas = db.traer_tareas_pk(request.POST.getlist('pktarea')[0])
    List_subtareas = db.traer_subtareas_pk(request.POST.getlist('pktarea')[0])
    List_files = db.traer_subtareas_pkFiles(request.POST.getlist('pktarea')[0])
    List_coments = db.traer_subtareas_pkcoments(request.POST.getlist('pktarea')[0])
    list_areas= db.traer_areas()  
    list_proyecto= db.traer_proye()  
    listado_user = db.traer_usuarios()
    return ({ 'List_coments':List_coments,'List_files':List_files,'list_proyecto':list_proyecto,'list_areas':list_areas,'listado_user':listado_user, 'list_tareas':list_tareas, 'List_subtareas':List_subtareas})

def tareas_indi_view(request, Id_empresa): 
    db = web.con_db.paneles(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    list_tareas = db.traer_tareas_pk(request.POST.getlist('pktarea')[0])
    List_subtareas = db.traer_subtareas_pk(request.POST.getlist('pktarea')[0])
    List_files = db.traer_subtareas_pkFiles(request.POST.getlist('pktarea')[0])
    List_coments = db.traer_subtareas_pkcoments(request.POST.getlist('pktarea')[0])
    db.marcar_leidos(request.POST.getlist('pktarea')[0], 'CCtarea', request.POST.getlist('usuario')[0])
    list_areas= db.traer_areas()  
    list_proyecto= db.traer_proye()  
    listado_user = db.traer_usuarios()
    return ({ 'List_coments':List_coments,'List_files':List_files,'list_proyecto':list_proyecto,'list_areas':list_areas,'listado_user':listado_user, 'list_tareas':list_tareas, 'List_subtareas':List_subtareas})

def tareas_ind_por_modulo_pk(request, Id_empresa): 
    db = web.con_db.paneles(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    list_tareas = db.traer_tareas_modulo(request.POST.getlist('PkModulo')[0], request.POST.getlist('pkdoc')[0])
    dict_tarea = {}
    for a in list_tareas:
        dict_tarea[a['pk']] = {}
        List_subtareas = db.traer_subtareas_pk(a['pk'])
        List_files = db.traer_subtareas_pkFiles(a['pk'])
        List_coments = db.traer_subtareas_pkcoments(a['pk'])
        dict_tarea[a['pk']]['List_subtareas'] = List_subtareas
        dict_tarea[a['pk']]['List_files'] = List_files
        dict_tarea[a['pk']]['List_coments'] = List_coments
    list_areas= db.traer_areas()  
    list_proyecto= db.traer_proye()  
    listado_user = db.traer_usuarios()
    return ({ 'dict_tarea':dict_tarea,'list_proyecto':list_proyecto,'listado_user':listado_user, 'list_tareas':list_tareas})



def paneles_carga(request, Id_empresa, pkpanel): 
    db = web.con_db.paneles(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    
    paneles = db.traer_paneles_por_user(request.POST.getlist('usuario')[0], pkpanel) 
        
    grupos = {}
    grupos_datos = {}
    grupos_datos_valor = {}
    
    for a in paneles:
        grupos[a['pkPanel']] = db.traer_paneles_grupos(a['pkPanel']) 
        grupos_datos[a['pkPanel']] = []
        if a['tipo'] == 'Estado':
            if a['agrupar'] == '$directo':
                for s in grupos[a['pkPanel']]:   
                    valor = db.traer_sql_directo_cant_registros(s['cond_base'])
                    grupos_datos[a['pkPanel']].append({'Display':valor,'Campo':s['pkgrupo']})
            else:
                for s in grupos[a['pkPanel']]:   
                    mix_campos = s['Campo'].split(';')
                    if len(mix_campos) > 1:
                        t_sente = 'select sum(1) as "Display", sum(' + str(mix_campos[1]) + ') as "Suma"  from  ' + str(a['tabla']) + ' where  ' + str(mix_campos[0]) + ' = "' + str(s['Valor']) + '" '+ str(s['cond_base']) +' GROUP BY ' +  str(mix_campos[0])
                    else:
                        t_sente = 'select sum(1) as "Display", 0 as "Suma"  from  ' + str(a['tabla']) + ' where  ' + str(mix_campos[0]) + ' = "' + str(s['Valor']) + '" '+ str(s['cond_base']) +' GROUP BY ' + str(mix_campos[0])
                    valor = db.traer_sql_directo_cant_registros(t_sente.replace("@Usuario@", request.POST.getlist('usuario')[0]))
                    if len(valor)>0:
                        if len(mix_campos) > 1:
                            t_display = str( str(valor[0]['Suma']) + ', ' + str(valor[0]['Display']))
                        else:
                            t_display = str(str(valor[0]['Display']))
                        grupos_datos[a['pkPanel']].append({'Display':t_display,'Campo':str(s['Valor'])})
                    else:
                        if len(mix_campos) > 1:
                            t_display = '0, 0'
                        else:
                            t_display = '0'
                        grupos_datos[a['pkPanel']].append({'Display':t_display,'Campo':str(s['Valor'])})
                #grupos_datos[a['pkPanel']] = db.traer_paneles_datos(a['valor'],a['agrupar'],a['tabla'],'') 
        if a['tipo'] == 'Ficha':
            grupos_datos[a['pkPanel']] = db.traer_paneles_datos(a['valor'],a['agrupar'],a['tabla']) 
        if a['tipo'] == 'Imagen':
            grupos_datos[a['pkPanel']] = db.traer_paneles_imagen(a['pkPanel'])
            for aa in  grupos_datos[a['pkPanel']]:
                grupos_datos_valor[aa['Pkopcion']] = db.traer_sql_directo(aa['senten']) 
    return ({ 'paneles':paneles, 'grupos':grupos, 'grupos_datos':grupos_datos, 'grupos_datos_valor':grupos_datos_valor})



def insert_rapido(request, Id_empresa): 
    db = web.con_db.paneles(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    grupo_db = db.traer_paneles_grupospk(request.POST.getlist('pkgrupo')[0])
    paneles = db.insert_rapido_new(grupo_db[0]['nuevo']) 

def insert_rap_det(request, Id_empresa): 
    db = web.con_db.paneles(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    modulo= db.traer_tablas(request.POST.getlist('pkmodulo')[0]) 
    paneles = db.insert_rap_det(modulo[1]['Nombre'], request.POST.getlist('pkregistro')[0]) 



def traer_condicion_panel_grupo(request, Id_empresa): 
    db = web.con_db.paneles(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    pan_condi = db.traer_paneles_grupospk(request.POST.getlist('pkgrupo')[0]) 
    return pan_condi

def traer_condicion_panel_opciones(request, Id_empresa): 
    db = web.con_db.paneles(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    pan_condi = db.traer_paneles_grupos_opciones(request.POST.getlist('pkpanel')[0]) 
    return pan_condi

def traer_estados_modulo(request, Id_empresa): 
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    estados = db.lista_estados(request.POST.getlist('pkmodulo')[0]) 
    return estados

def traer_estados_modulo_usuario(request, Id_empresa): 
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    estados = db.lista_estados_por_usuario(request.POST.getlist('pkmodulo')[0], request.POST.getlist('usuario')[0]) 
    return estados

def tareas_cambio(request, Id_empresa): 
    db = web.con_db.paneles(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    List_subtareas = db.update_subtareas_estado(request.POST.getlist('pksubtarea')[0], request.POST.getlist('estado')[0]) 
    return ({ 'ok':1})
    
def tareas_aprovado(request, Id_empresa): 
    db = web.con_db.paneles(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    List_subtareas = db.update_subtareas_aprobado(request.POST.getlist('pksubtarea')[0], request.POST.getlist('estado')[0]) 
    return ({ 'ok':1})

def add_file_sub_tarea(request, Id_empresa): 
    db = web.con_db.paneles(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    db.add_file_sub_tarea(request.POST.getlist('tar_adj_pk')[0],request.POST.getlist('tar_adj_url')[0],request.POST.getlist('tar_adj_nom')[0]) 
    return ({ 'ok':1})

def traer_nota_completa(request, Id_empresa): 
    db = web.con_db.paneles(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    ids = str(request.POST.getlist('pknota')[0]).split('zbz')
    listado_user = db.traer_usuarios()
    notas_com_txt = db.traer_web_p_com_txt(ids[1], ids[2])
    db.marcar_leidos(ids[1], ids[2], request.POST.getlist('usuario')[0])
    return ({ 'listado_user':listado_user,'notas_com_txt':notas_com_txt, 'pk':ids[1], 'origen':ids[2], 'PkModulo':request.POST.getlist('PkModulo')[0]})

def nota_add_text(request, Id_empresa): 
    db = web.con_db.paneles(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    db.nota_add_text(request.POST.getlist('pknota')[0], request.POST.getlist('usuario')[0], request.POST.getlist('texto')[0])
    
def crear_resp(request, Id_empresa): 
    db = web.con_db.paneles(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    db.crear_resp(request.POST.getlist('pknota')[0], request.POST.getlist('usuario')[0], request.POST.getlist('responsable')[0][:-2], request.POST.getlist('tarea')[0])
    
def movernota(request, Id_empresa): 
    db = web.con_db.paneles(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    estado_new = db.movernota(request.POST.getlist('pknota')[0], request.POST.getlist('n_estado')[0])
    return (estado_new)
    
@csrf_exempt
def xmlload(request,Id_empresa):
    db = web.con_db.paneles(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    folder='static/archivos/' 
    if request.FILES['file']:
        myfile = request.FILES['file']
        fs = FileSystemStorage(location=folder) #defaults to   MEDIA_ROOT  
        filename = fs.save(myfile.name, myfile)



def buscadornota(request, Id_empresa, tabla): 
    db = web.con_db.paneles(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    valores_charts = {}
    campos = db.traer_campos(tabla)
    sente_campos = "Pk" + tabla + ", "
    for campo in campos:
        sente_campos = sente_campos + campo["Nombre"] + ", "
    sente_campos = sente_campos[:-2]
    valores = db.traer_valores(tabla, sente_campos)
    return {'campos':campos,'valores':valores, 'sente_campos':sente_campos, 'tabla':tabla}

def nota_guardar_doc(request, Id_empresa): 
    db = web.con_db.paneles(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    db.grabar_doc(request.POST.getlist('pknota')[0],  request.POST.getlist('usuario')[0],  request.POST.getlist('modulo')[0],  request.POST.getlist('pkmodulo')[0],  request.POST.getlist('pk')[0],  request.POST.getlist('descripcion')[0],  request.POST.getlist('identificador')[0] )
    return {'pkmodulo':request.POST.getlist('pkmodulo')[0],'pk':request.POST.getlist('pk')[0],'modulo':request.POST.getlist('modulo')[0],'descripcion':request.POST.getlist('descripcion')[0],'identificador':request.POST.getlist('identificador')[0]}
def agregar_nota_txt(request, Id_empresa): 
    db = web.con_db.paneles(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    db.grabar_agregar_nota_txt(request.POST.getlist('pk')[0], request.POST.getlist('origen')[0],  request.POST.getlist('usuario')[0],  request.POST.getlist('texto')[0], request.POST.getlist('user_dest')[0], request.POST.getlist('pkmodulo')[0] )
    return {'usuario':request.POST.getlist('usuario')[0],'texto':request.POST.getlist('texto')[0], 'user_dest':request.POST.getlist('user_dest')[0]}
def agregar_tar_txt(request, Id_empresa): 
    db = web.con_db.paneles(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    db.grabar_agregar_tar_txt(request.POST.getlist('pk')[0], request.POST.getlist('origen')[0],  request.POST.getlist('usuario')[0],  request.POST.getlist('texto')[0], request.POST.getlist('user_dest')[0], request.POST.getlist('pkmodulo')[0] )
    return {'usuario':request.POST.getlist('usuario')[0],'texto':request.POST.getlist('texto')[0], 'user_dest':request.POST.getlist('user_dest')[0]}

def calendar(request, Id_empresa, usuario, fecha): 
    db = web.con_db.paneles(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    calendarios = db.traer_calendarios(usuario, request.POST.getlist('t_mostrar')[0])
    cal_valores = {}
    usuarioExterno= ''
    if len(request.POST.getlist('usuarioExterno')) > 0:
        usuarioExterno = request.POST.getlist('usuarioExterno')[0]
    for a in calendarios:
        cal_valores[a['nombre']]= db.traer_calendarios_val(a['senten'], fecha, usuario, usuarioExterno)
    return {'calendarios':calendarios,'cal_valores':cal_valores}
def alertas(request, Id_empresa, usuario): 
    db = web.con_db.paneles(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    alertas = db.carga_alertas(usuario)
    resp_alertas = []
    for a in alertas:
        tempo_a = db.ejecutar_sub_alertas(str(a["sentencia"]).replace("@indi", str(a["ultimo_identificador"])))
        if a["tipo_indi"] == 'Fecha':
            db.update_sub_alertas("update web_a_alertas set ultimo_identificador = date(now()) where pkid = " + str(a["pkid"]) )
        if a["tipo_indi"] == 'Ultimo_reg':
            db.update_sub_alertas("update web_a_alertas set ultimo_identificador = '" + str(tempo_a[len(tempo_a)-1][a["identificador"]]) + "' where pkid = " + str(a["pkid"]) )
        resp_alertas.append({'acc':a,'val':tempo_a})
    return {'alertas':resp_alertas}
