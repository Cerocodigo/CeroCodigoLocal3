

import urllib.request

import sys
import unicodedata
import datetime
import xlsxwriter
from pdfrw import PdfReader, PdfWriter, PageMerge

# Create your views here.
from django.shortcuts import get_object_or_404, render, redirect
from django.http import Http404
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt



import cerocodigo.con_db

@csrf_exempt
def login(request):
    print("login")
    context = {'error_message_clave': '', 'error_message_receptor' : '', 'error_message_emisor' : ''}
    print(request.method )
    if request.method == 'POST':
        if request.POST['Medio'] == 'LOGIN':
            db = cerocodigo.con_db.inter_login_LOGIN("Mysql")
            try:
                print("log in")
                V_user = db.log_in(request.POST['Ruc'], request.POST['password'])
                if	V_user == None:
                    context = {'error_message': 'Error de ingreso'}
                    return render(request, 'page-login_register.html', context)
                else:
                    if len(V_user) == 0:
                        context = {'error_message': 'Error de ingreso'}
                        return render(request, 'page-login_register.html', context)
                    else:	
                        menu = db.carga_menu(request.POST['Ruc'])
                        modulos = db.carga_modulos(request.POST['Ruc'])
                        opciones = db.carga_opciones(request.POST['Ruc'])
                        reportes = db.carga_reportes(request.POST['Ruc'])
                        context = {'Ruc' :"admin", 'menu' : menu, 'reportes' : reportes, 'modulos' : modulos, 'opciones' : opciones}
                        return render(request, 'index.html', context)

            except ObjectDoesNotExist:
                context = {'error_message': ''}
                return render(request, 'page-login_register.html', context)

        if request.POST['Medio'] == 'Ejecutar_Reporte':
            db = cerocodigo.con_db.inter_login_Ejecutar_Reporte("Mysql")

            nom_compania =db.nom_compania()

            nombre = db.nombre(request.POST['pkrepor'])[0]['nombre']

            rep_totales = ''

            reportesqtotales = db.reportesqtotales(request.POST['pkrepor'])

            for row in reportesqtotales:
                totales = row['sentencia'].split(',')
                for i in totales:
                    rep_totales = rep_totales + 'format(sum('+ i + '),2) as "' + i +'", '
            rep_totales = rep_totales[:-2] 

            reportesqselect = db.reportesqselect(request.POST['pkrepor'])
            for row in reportesqselect:
                rep_select =row['sentencia']
                    
            reportesqfrom = db.reportesqfrom(request.POST['pkrepor'])
            for row in reportesqfrom:
                rep_form =row['sentencia']
    
            reportesqwhere = db.reportesqwhere(request.POST['pkrepor'])
            for row in reportesqwhere:
                rep_where =row['sentencia']

            reportesqrest = db.reportesqrest(request.POST['pkrepor'])
            for row in reportesqrest:
                rep_rest = row['sentencia']
    
                                                
            totales_select = str(rep_select)
            totales_where  = str(rep_where)
            totales_from = str(rep_form)
            
            totales_select = str(totales_select).replace("format", "")
            totales_select = str(totales_select).replace("FORMAT", "")
            totales_select = str(totales_select).replace("Format", "")
            totales_select = str(totales_select).replace(",2", "")
            totales_select = str(totales_select).replace(",4", "")
            totales_select = str(totales_select).replace(",6", "")

            totales_where = str(totales_where).replace("format", "")
            totales_where = str(totales_where).replace("FORMAT", "")
            totales_where = str(totales_where).replace("Format", "")
            totales_where = str(totales_where).replace(",2", "")
            totales_where = str(totales_where).replace(",4", "")
            totales_where = str(totales_where).replace(",6", "")

            totales_from = str(totales_from).replace("format", "")
            totales_from = str(totales_from).replace("FORMAT", "")
            totales_from = str(totales_from).replace("Format", "")
            totales_from = str(totales_from).replace(",2", "")
            totales_from = str(totales_from).replace(",4", "")
            totales_from = str(totales_from).replace(",6", "")

            sentencia_totales = "SELECT "+ rep_totales +" FROM ("+  str(totales_select) + " " +  str(totales_from) + " " + str(totales_where) + " " + str(rep_rest)+ ") AS ENCAPSULADO"

            sentencia =   str(rep_select) + " " +  str(rep_form) + " " + str(rep_where) + " " + str(rep_rest)

            reportesvariables = db.reportesvariables(request.POST['pkrepor'])
            for row in reportesvariables:
                sentencia = str(sentencia).replace(row['idrep'], "'"+ request.POST[row['idrep']]+ "'")
                sentencia_totales = str(sentencia_totales).replace(row['idrep'], "'"+ request.POST[row['idrep']]+ "'")
                
            reportesreferencias = db.reportesreferencias(request.POST['pkrepor'])

            for row in reportesreferencias:
                sentencia = str(sentencia).replace(str(row['idrep']), "'"+ request.POST[str(row['pk'])]+ "'")
                sentencia_totales = str(sentencia_totales).replace(str(row['idrep']), "'"+ request.POST[str(row['pk'])]+ "'")
                        
            sentencia = str(sentencia).replace("\\r", " ")
            sentencia = str(sentencia).replace("\\n", " ")
            sentencia = str(sentencia).replace("`", "'")
            sentencia_totales = str(sentencia_totales).replace("\\r", " ")
            sentencia_totales = str(sentencia_totales).replace("\\n", " ")
            sentencia_totales = str(sentencia_totales).replace("`", "'")
            
            print("----------------")
            print(sentencia_totales)
            print("----------------")

            if not(reportesqtotales[0]['sentencia'] == ''):
                totales_dictlist_arr = db.totales_dictlist_arr(str(sentencia_totales))

                totales_dictlist = totales_dictlist_arr[1]
                totales_names =  totales_dictlist_arr[0]
            else:

                totales_dictlist = ''
                totales_names =  ''


            dictlist_arr = db.dictlist_arr(str(sentencia))


            dictlist = dictlist_arr[1]
            names =  dictlist_arr[0]
            context = {'names' :names, 'dictlist' :dictlist, 'sentencia':sentencia, 'nombre': nombre, 'totales_dictlist':totales_dictlist, 'totales_names':totales_names, 'pkrepor':request.POST['pkrepor'] }
            return render(request, 'reportes_ejecutar.html', context)
    
        if request.POST['Medio'] == 'Filtro_Reporte':
            db = cerocodigo.con_db.inter_login_Filtro_Reporte("Mysql")
            nombre = db.nombre(request.POST['pkrepor'])[0]['nombre']

            rep_totales = ''
            reportesqtotales = db.reportesqtotales(request.POST['pkrepor'])

            totales = reportesqtotales[0]['sentencia'].split(',')
            for i in totales:
                rep_totales = rep_totales + 'format(sum('+ i + '),2) as "' + i +'", '

            rep_totales = rep_totales[:-2]              
            sentencia_totales =  "from (" +str(request.POST['sentencia']) + ") AS ENCAPSULADO WHERE ENCAPSULADO." +  request.POST['campo'] + " LIKE '" + request.POST['valor'] + "%' "
            sentencia_totales = str(sentencia_totales).replace("format", "")
            sentencia_totales = str(sentencia_totales).replace("FORMAT", "")
            sentencia_totales = str(sentencia_totales).replace("Format", "")
            sentencia_totales = str(sentencia_totales).replace(",2", "")
            sentencia_totales = str(sentencia_totales).replace(",4", "")
            sentencia_totales = str(sentencia_totales).replace(",6", "")
            sentencia_totales = "select " + rep_totales + sentencia_totales
            
            sentencia = "SELECT * FROM ("+ str(request.POST['sentencia']) + ") AS ENCAPSULADO WHERE ENCAPSULADO." +  request.POST['campo'] + " LIKE '" + request.POST['valor'] + "%' "
            
            sentencia = str(sentencia).replace("\\r", " ")
            sentencia = str(sentencia).replace("\\n", " ")
            sentencia = str(sentencia).replace("`", "'")

            if not(reportesqtotales[0]['sentencia'] == ''):
                totales_dictlist_arr = db.totales_dictlist_arr(str(sentencia_totales))

                totales_names =  totales_dictlist_arr[0]
                totales_dictlist = totales_dictlist_arr[1]
            else:
                totales_names =  ''
                totales_dictlist = ''
            dictlist_arr = db.dictlist_arr(str(sentencia))
            names =  dictlist_arr[0]
            dictlist = dictlist_arr[1]

            context = {'names' :names, 'dictlist' :dictlist, 'sentencia':request.POST['sentencia'], 'nombre':request.POST['nombre'], 'totales_dictlist':totales_dictlist,'totales_names':totales_names, 'pkrepor':request.POST['pkrepor']}
            return render(request, 'reportes_ejecutar.html', context)
        
        if request.POST['Medio'] == 'Excell_det':
            db = cerocodigo.con_db.inter_login_Excell_det("Mysql")

            workbook = xlsxwriter.Workbook('static/' +request.POST['nombre']+  '.xlsx', {'remove_timezone': True})
            worksheet = workbook.add_worksheet()
                      
            sentencia = db.dev_sentencia(str(request.POST['sentencia']))
            sentencia = str(sentencia).replace("\\r", " ")
            sentencia = str(sentencia).replace("\\n", " ")
            sentencia = str(sentencia).replace("`", "'")
                                        
            sentencia_arr = db.sentencia_arr(str(sentencia))

            dictlist =sentencia_arr[0]

            worksheet.write(0, 0, request.POST['nombre'])
                    
            bold = workbook.add_format({'bold': True})
            texto = workbook.add_format()
            fecha = workbook.add_format()
            texto.set_num_format('0')
            fecha.set_num_format('yyyy-mm-dd')


            rep_select = ''

            reportesqselect = db.reportesqselect(request.POST['pkrepor'])
            rep_select =reportesqselect[0]['sentencia']

            reportesqfrom = db.reportesqfrom(request.POST['pkrepor'])
            rep_form =reportesqfrom[0]['sentencia']

            reportesqwhere = db.reportesqwhere(request.POST['pkrepor'])
            rep_where =reportesqwhere[0]['sentencia']

            reportesqrest = db.reportesqrest(request.POST['pkrepor'])
            rep_rest =reportesqrest[0]['sentencia']

                                                                    
            rep_select = str(rep_select).replace("`", "'")
            rep_form = str(rep_form).replace("`", "'")
            rep_where = str(rep_where).replace("`", "'")
            rep_rest = str(rep_rest).replace("`", "'")
            b = 3

            for row in sentencia_arr[1]:
                a = 0
                d = 0
                for colum in sentencia_arr[0]:
                    if colum[0][0] == '$':
                        d = d+1
                    else:
                        worksheet.write(b, a - d, colum[0], bold)
                    a= a +1
                b = b +1
                a = 0
                d = 0
                for colum in sentencia_arr[0]:
                    if colum[0][0] == '$':
                        d = d+1
                    else:
                        if isinstance(row[a], datetime.date):
                            worksheet.write(b, a - d, row[a], fecha)                                    
                        else:
                            worksheet.write(b, a - d, row[a], texto)
                    a = a+1
                if not(rep_select == ''):
                    sentencia_nivel2 =   str(rep_select) + " " +  str(rep_form) + " " + str(rep_where) + " " + str(rep_rest)
                    b= b +1


                    reportesqtraspaso = db.reportesqtraspaso(request.POST['pkrepor'])
                    for fila2 in reportesqtraspaso:
                        aa = 0
                        dd = 0
                        for colum2 in sentencia_arr[0]:

                            # if str(colum2[0]).upper() == str(fila2[0]).upper():
                             #   sentencia_nivel2 = str(sentencia_nivel2).replace(fila2[0], row[aa])
                            aa=aa +1

                            sentencia_nivel2_arr = db.sentencia_nivel2_arr(str(sentencia_nivel2))

                            dictlist2 = sentencia_nivel2_arr[1]
                            names2 =  sentencia_nivel2_arr[0]
                            b= b +1
                            aa = 1
                            dd = 0
                            xx = 0
                            for row2 in dictlist2:
                                if xx == 0:
                                    for colum2 in names2:
                                        ##print colum2[0]
                                        if colum2[0][0] == '$':
                                            dd = dd+1
                                        else:
                                            worksheet.write(b , aa - dd, colum2[0], bold)
                                        aa= aa +1
                                    b=b+1
                                aa = 1
                                dd = 0
                                for colum2 in names2:
                                    if colum2[0][0] == '$':
                                        dd = dd+1
                                    else:
                                        if isinstance(row2[aa -1], datetime.date):
                                            worksheet.write(b , aa - dd, row2[aa -1], fecha)                                    
                                        else:
                                            worksheet.write(b , aa - dd, row2[aa -1], texto)                                        
                                    aa = aa+1
                                b = b +1
                                xx = xx + 1
                        b= b +1
                        
                    workbook.close()
                    return redirect('/static/' +request.POST['nombre']+  '.xlsx')


        if request.POST['Medio'] == 'PDF':
            db = cerocodigo.con_db.inter_login_PDF("Mysql")


        if request.POST['Medio'] == 'Excell':
            db = cerocodigo.con_db.inter_login_Excell("Mysql")

            workbook = xlsxwriter.Workbook('static/' +request.POST['nombre']+  '.xlsx', {'remove_timezone': True})
            worksheet = workbook.add_worksheet()
            bold = workbook.add_format({'bold': True})
            bold = workbook.add_format({'bold': True})
            texto = workbook.add_format()
            fecha = workbook.add_format()
            texto.set_num_format('0')
            fecha.set_num_format('yyyy-mm-dd')

            sentencia = db.dev_sentencia(str(request.POST['sentencia']))
                    
            sentencia = str(sentencia).replace("\\r", " ")
            sentencia = str(sentencia).replace("\\n", " ")
            sentencia = str(sentencia).replace("`", "'")

            sentencia_arr = db.sentencia_arr(str(request.POST['sentencia']))

            worksheet.write(0, 0, request.POST['nombre'])

            a = 0
            d = 0
            for colum in sentencia_arr[0]:
                if colum[0][0] == '$':
                    d = d + 1
                else:
                    worksheet.write(2, a - d, colum[0], bold)
                a = a +1            
            b = 3


            for row in sentencia_arr[1]:
                a = 0
                d = 0
                for colum in sentencia_arr[0]:
                    if colum[0][0] == '$':
                        d = d+1
                    else:
                        if isinstance(row[a], datetime.date):
                            worksheet.write(b, a - d, row[a], fecha)
                        else:
                            worksheet.write(b, a - d, row[a],texto)
                    a = a+1
                b = b +1
                
            
            workbook.close()

            return redirect('/static/' +request.POST['nombre']+  '.xlsx')


    else:
        context = {'error_message': ''}
        return render(request, 'page-login_register.html', context)


@csrf_exempt
def reporte_ejecutar(request):
    print("reporte_ejecutar")
    db = cerocodigo.con_db.inter_reporte_ejecutar("Mysql")
    campos = ""
    if request.method == 'POST':
        nom_compania = db.traer_Cliente()
        rep_select = db.rep_select(request.POST['pkreporte'])
        rep_form = db.rep_form(request.POST['pkreporte'])
        rep_where = db.rep_where(request.POST['pkreporte'])
        rep_rest = db.rep_rest(request.POST['pkreporte'])
        					
        sentencia = rep_select[0].sentencia + rep_form[0].sentencia + rep_where[0].sentencia + rep_rest[0].sentencia

        variables_reprotes = db.variables_reprotes(request.POST['pkreporte'])


        referencias_reprotes = db.referencias_reprotes(request.POST['pkreporte']) 

        for p in variables_reprotes:
            sentencia = sentencia.replace(variables_reprotes.id_rep, "'"+ request.POST[variables_reprotes.id_rep]+ "'")
        for p in referencias_reprotes:
            sentencia = sentencia.replace(referencias_reprotes.id_rep, "'"+ request.POST[referencias_reprotes.id_rep]+ "'")
        	
        cursor.execute(str(sentencia))
        dictlist = cursor.fetchall()
        names =  cursor.description
        context = {'names' :names, 'dictlist' :dictlist}
        return render(request, 'reportes_ejecutar.html', context)


@csrf_exempt
def ref_buscar(request, pkrefer):
    print("ref_buscar")    
    db = cerocodigo.con_db.inter_ref_buscar("Mysql")
    campos = ""
    if request.method == 'GET':
        reportesreferencias = db.reportesreferencias(pkrefer)
        for p in reportesreferencias:            
            sentencia = "select "+p['campo'] +" as 'c_traer', "+ p['columnas'] + " from " + p['tabla'] + " limit 100" 
            campos = p['campo']
        
        print(sentencia)
        refvalores = db.reportesreferencias_valores(sentencia)

        names = refvalores[0]  
        print(names)
 
        dictlist = refvalores[1]

        """
        with connection.cursor() as cursor:
            cursor.execute(sentencia)
        """
        context = {'names' :names, 'dictlist' :dictlist, 'campos' :campos, 'pkrefer':pkrefer}

        return render(request, 'buscar_referencia.html', context)
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
            return render(request, 'buscar_referencia.html', context)


@csrf_exempt
def reporte_var(request, pkrepo, tipo): 
    print("ref_buscar")    
    db = cerocodigo.con_db.inter_reporte_var("Mysql")
    if tipo == 'Reportes':
        variables_reprotes = db.variables_reprotes(pkrepo)
        referencias_reprotes = db.referencias_reprotes(pkrepo)
            
        context = {'variables_reprotes' :variables_reprotes, 'referencias_reprotes' :referencias_reprotes, 'pkrepo' :pkrepo}
        return render(request, 'reporte_variables.html', context)


@csrf_exempt
def opciones_ingresos(request, pkmodulo):
    if request.method == 'POST':
        v= v;
        

    else:
        print("opciones_ingresos")    
        db = cerocodigo.con_db.inter_opciones_ingresos("Mysql")
        
        estructuras = db.estructuras(pkmodulo)
        Vcampos_1 = {}
        Vcampos_2 = {}
        Vcampos_3 = {}

        Dcampos_1 = []
        Dcampos_2 = []
        Dcampos_3 = []
        for x in range(0, len(estructuras)):
            campos = db.campos(estructuras[x]['PkEstructura'])    
            for xx in range(0, len(campos)):
                campo = {   'PkId' : campos[xx]['PkId'],
                            'PkModulo' : campos[xx]['PkModulo'],
                            'PkEstructura' : campos[xx]['PkEstructura'],
                            'PkCampo' : campos[xx]['PkCampo'],
                            'TablaCampo' : campos[xx]['TablaCampo'],
                            'Posicion' : campos[xx]['Posicion'],
                            'Nombre' : campos[xx]['Nombre'],
                            'Descripcion' : campos[xx]['Descripcion'],
                            'Anulado' : campos[xx]['Anulado'],
                            'Origen' : campos[xx]['Origen'],
                            'Visible' : campos[xx]['Visible'],
                            'X' : campos[xx]['X']* 10,
                            'Y' : (campos[xx]['Y']* 10),
                            'tamano' : campos[xx]['tamano'],
                            'estilo' : campos[xx]['estilo'],
                            'Modificable' : campos[xx]['Modificable'],
                            'Valor' : 0  
                        }

                if x == 0:  # main
                    Dcampos_1.append(campo)
                    Vcampos_1.update({campos[xx]['Nombre']:''})

                if x == 1:  # detalle
                    Dcampos_2.append(campo)
                    Vcampos_2.update({campos[xx]['Nombre']:''})

                if x == 2:  # subdetalle
                    Dcampos_3.append(campo)
                    Vcampos_3.update({campos[xx]['Nombre']:''})    

        fila=''
        for xx in Dcampos_2:
            if xx['Visible'] == 'Y':
                fila = fila + '<td><input type="text" name="L-XX-' + xx['Nombre'] + '" value=""></td>'
            else:
                fila = fila + '<input type="hidden" name="L-XX-' + xx['Nombre'] + '" value="">'
        context = {'Dcampos_1' :Dcampos_1, 'Dcampos_2' :Dcampos_2, 'Dcampos_3' :Dcampos_3, 'pkmodulo': pkmodulo, 'fila': fila}
        return render(request, 'ingreso.html', context)

