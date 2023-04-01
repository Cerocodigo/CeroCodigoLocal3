
import datetime
from macpath import split

from reportlab.pdfgen import canvas
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.lib import colors
from reportlab.lib.units import cm
from datetime import datetime
from reportlab.lib.pagesizes import letter, landscape, A4
from reportlab_qrcode import QRCodeImage
from reportlab.graphics.shapes import *

import web.con_db
import web.firma_pdf

def crear_pdf_registro(request, Id_empresa, PkModulo, PkRegistro, envio_datset, pkplantilla):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    plantila = db.lista_pdf_porpk(pkplantilla)
    segmentos = db.lista_pdf_segmentos(plantila[0]['PkPlantilla'])
    estructuras = db.traer_estructuras_porPkmodulo(PkModulo)
    CamposCabecera = {}
    CamposEtiquetas = {}
    CamposDetalle = {}
    firmados = []

    for segmento in segmentos:
        if segmento['Tipo'] == 'Cabecera' or segmento['Tipo'] == 'Pie':
            CamposCabecera[segmento['PkSegmento']] = db.lista_pdf_cmbc(segmento['PkSegmento'])
            CamposEtiquetas[segmento['PkSegmento']] = db.lista_pdf_eti(segmento['PkSegmento'])
        if segmento['Tipo'] == 'Detalle':
            CamposDetalle[segmento['PkSegmento']] = db.lista_pdf_cmbd(segmento['PkSegmento'])

    Pdf_Name = 'media/firma/'+Id_empresa+'/PDF/'+estructuras[0]['Nombre']+str(PkModulo)+'_'+PkRegistro+'.pdf'
    pagesize = (float(plantila[0]['Ancho'])*cm,float(plantila[0]['Largo'])*cm)

    # # creating a pdf object
    pdf = canvas.Canvas(Pdf_Name, pagesize=pagesize)
    if float(plantila[0]['Ancho']) > float(plantila[0]['Largo']):
        pdf.setPageSize(landscape(pagesize))
    else:
        pdf.setPageSize(pagesize)
    row_index = 1
    altura_pie = 0
    for segmento in segmentos:
        if segmento['Tipo'] == 'Cabecera':
            for etiqueta in CamposEtiquetas[segmento['PkSegmento']]:
              if etiqueta['TipoLetra'] == 'Logo':
                vara =  1.5
                limite = etiqueta['Tamano'].split(',')
                pdf.drawInlineImage('media/archivos/'+Id_empresa+'/logo.png', float(etiqueta['X'])*cm,(float(plantila[0]['Largo']) - float(etiqueta['Y'])+ float(segmento['AlturaInicial']) - vara )*cm, float(limite[0]) *cm,float(limite[1]) *cm)
              if etiqueta['TipoLetra'] == 'grafico':
                limite = etiqueta['Tamano'].split(',')
                txt =  etiqueta['Nombre'].split(',')
                pdf.setFillColorRGB(int(txt[1])/255,int(txt[2])/255,int(txt[3])/255) #choose your font colour
                pdf.rect(float(etiqueta['X'])*cm, (float(plantila[0]['Largo']) - float(etiqueta['Y'])+ float(segmento['AlturaInicial']) -0.15 ) *cm , float(limite[1])*cm,  float(limite[0])*cm, stroke=0, fill=1)
                pdf.setFillColorRGB(0,0,0) #choose your font colour
              if etiqueta['TipoLetra'] == 'Normal' or etiqueta['TipoLetra'] == 'normal':
                pdf.setFont('Helvetica', int(etiqueta['Tamano']), leading = None)
                pdf.drawString(float(etiqueta['X'])*cm,  (float(plantila[0]['Largo']) - float(etiqueta['Y'])+ float(segmento['AlturaInicial']) ) *cm   , etiqueta['Nombre'])
              if etiqueta['TipoLetra'] == 'Bold' or etiqueta['TipoLetra'] == 'bold':
                pdf.setFont('Helvetica-Bold', int(etiqueta['Tamano']), leading = None)
                pdf.drawString(float(etiqueta['X'])*cm,  (float(plantila[0]['Largo']) - float(etiqueta['Y'])+ float(segmento['AlturaInicial']) ) *cm   , etiqueta['Nombre'])
              
            for campo in CamposCabecera[segmento['PkSegmento']]:
              if campo['Tipo'] == 'Imagen':
                limite  = campo['limite'].split(',')
                try:
                  pdf.drawInlineImage('media/archivos/'+Id_empresa+'/'+envio_datset[estructuras[0]['Nombre']][0][campo['Campo']], float(campo['X'])*cm,(float(plantila[0]['Largo']) - float(campo['Y'])+ float(segmento['AlturaInicial']) )*cm, float(limite[0]),float(limite[1]), mask='auto')
                except:
                  pass
              else:
                pdf.setFont('Helvetica', int(campo['Tamano']), leading = None)
                txt = devolver_valor_imp(envio_datset[estructuras[0]['Nombre']][0][campo['Campo']], campo['Tipo'], campo['Ext'])
                if type(txt) == int:
                  txt = str(txt)
                if type(txt) == float:
                  txt = str(txt)
                limite  = campo['limite'].split(',')
                if txt is not None:
                  if len(txt) >= int(limite[0]):
                      for linea in range(0,int(limite[1])):
  #///////////////////////////////////////////////

                        if len(txt) > int(limite[0]):


                          if str(txt[int(limite[0])]) == ' ':
                            txt_temp = str(txt[0:int(limite[0])])
                            txt = txt[int(limite[0]):]
                          else:
                            txt_temp = str(txt[0:int(limite[0])])
                            indice = 0
                            for letra in txt[int(limite[0]):]:
                              if letra != ' ':
                                txt_temp = txt_temp + letra
                              else:
                                break
                              indice+=1
                            txt = txt[int(limite[0]) + indice + 1 :]
                            
                          if campo['Tipo'] == 'Derecha':
                            pdf.drawRightString(float(campo['X'])*cm,  (float(plantila[0]['Largo']) - float(campo['Y']) - (linea * 0.5) + float(segmento['AlturaInicial']) ) *cm   , txt_temp)
                          else:
                            pdf.drawString(float(campo['X'])*cm,  (float(plantila[0]['Largo']) - float(campo['Y']) - (linea * 0.5) + float(segmento['AlturaInicial']) ) *cm   ,  txt_temp)
                        else:
                          if campo['Tipo'] == 'Derecha':
                            pdf.drawRightString(float(campo['X'])*cm,  (float(plantila[0]['Largo']) - float(campo['Y']) - (linea * 0.5) + float(segmento['AlturaInicial']) ) *cm, txt)
                          else:
                            pdf.drawString(float(campo['X'])*cm,  (float(plantila[0]['Largo']) - float(campo['Y']) - (linea * 0.5) + float(segmento['AlturaInicial']) ) *cm, txt)
                          break
                        #////////////////////////////////////
                  else:
                      if campo['Tipo'] == 'Derecha':
                          pdf.drawRightString(float(campo['X'])*cm,  (float(plantila[0]['Largo']) - float(campo['Y'])+ float(segmento['AlturaInicial']) ) *cm   , txt)
                      else:
                          pdf.drawString(float(campo['X'])*cm,  (float(plantila[0]['Largo']) - float(campo['Y'])+ float(segmento['AlturaInicial']) ) *cm   , txt)
          
        if segmento['Tipo'] == 'Detalle':
            ##cabeceras
            for cabeceras in CamposDetalle[segmento['PkSegmento']]:
              pdf.setFont('Helvetica', int(cabeceras['Tamano']), leading = None)
              if cabeceras['Tipo'] == 'Derecha':
                  pdf.drawRightString(float(cabeceras['X'])*cm,  (float(plantila[0]['Largo']) - float(segmento['AlturaInicial']) -0.1 ) *cm   , cabeceras['Cabecera'])
              else:
                  pdf.drawString(float(cabeceras['X'])*cm,  (float(plantila[0]['Largo']) - float(segmento['AlturaInicial']) -0.1) *cm   , cabeceras['Cabecera'])
            for valores in envio_datset[estructuras[1]['Nombre']]:
              for campo in CamposDetalle[segmento['PkSegmento']]:
                  pdf.setFont('Helvetica', int(campo['Tamano']), leading = None)
                  txt = devolver_valor_imp(valores[campo['Campo']], campo['Tipo'], campo['Ext'])
                  if type(txt) == int:
                    txt = str(txt)
                  if type(txt) == float:
                    txt = str(txt)
                  if len(txt) >= int(campo['Limite']):
                      txt = txt[0:int(campo['Limite'])] + '...'
                  if campo['Tipo'] == 'Derecha':
                      pdf.drawRightString(float(campo['X'])*cm,  (float(plantila[0]['Largo']) - (float(segmento['AlturaInicial']) + float(segmento['Alturafinal']) + (row_index * 0.7)) ) *cm   , txt)
                  else:
                      pdf.drawString(float(campo['X'])*cm,  (float(plantila[0]['Largo']) - (float(segmento['AlturaInicial']) + float(segmento['Alturafinal']) + (row_index * 0.7)) ) *cm   , txt)
              row_index = row_index + 1
            altura_pie = float(segmento['AlturaInicial']) + (row_index * 0.6)


            ##valores
            pass

    firma = web.firma_pdf 

    for segmento in segmentos:
        if float(segmento['AlturaInicial']) > altura_pie:
            altura_pie = float(segmento['AlturaInicial'])

        if segmento['Tipo'] == 'Pie':
            for etiqueta in CamposEtiquetas[segmento['PkSegmento']]:
              if etiqueta['TipoLetra'] == 'grafico':
                limite = etiqueta['Tamano'].split(',')
                txt =  etiqueta['Nombre'].split(',')
                pdf.setFillColorRGB(int(txt[1])/255,int(txt[2])/255,int(txt[3])/255) #choose your font colour
                pdf.rect(float(etiqueta['X'])*cm, (float(plantila[0]['Largo']) - float(etiqueta['Y']) - altura_pie -0.15 ) *cm , float(limite[1])*cm,  float(limite[0])*cm, stroke=0, fill=1)
                pdf.setFillColorRGB(0,0,0) #choose your font colour
              if etiqueta['TipoLetra'] == 'Normal' or etiqueta['TipoLetra'] == 'normal':
                pdf.setFont('Helvetica', int(etiqueta['Tamano']), leading = None)
                pdf.drawString(float(etiqueta['X'])*cm,  (float(plantila[0]['Largo']) - float(etiqueta['Y']) -  altura_pie ) *cm   , etiqueta['Nombre'])
              if etiqueta['TipoLetra'] == 'bold':
                pdf.setFont('Helvetica-Bold', int(etiqueta['Tamano']), leading = None)
                pdf.drawString(float(etiqueta['X'])*cm,  (float(plantila[0]['Largo']) - float(etiqueta['Y']) - altura_pie ) *cm   , etiqueta['Nombre'])
              if etiqueta['TipoLetra'] == 'FirmaDirecta':
                  if etiqueta['Nombre'] == '@usuario@':
                    certify = firma.traerdatos_usuario(request, request.POST.getlist('usuario')[0], request.POST.getlist('Id_empresa')[0]) 
                    if len(certify) >0:
                      firmados.append(request.POST.getlist('usuario')[0])
                      qr = QRCodeImage(certify[0]['display'] + ' Firmado ' +datetime.now().strftime('%Y-%m-%d- %H:%M:%S'), size=2 * cm)
                      qr.drawOn(pdf, float(etiqueta['X'])*cm, (float(plantila[0]['Largo']) - (float(etiqueta['Y']) +  float(altura_pie))) *cm)
                      pdf.drawString((float(etiqueta['X'])+ 2)*cm,  (float(plantila[0]['Largo']) - (float(etiqueta['Y']) -1.5 + float(altura_pie)) ) *cm   , 'Firmado Electronico')
                      pdf.drawString((float(etiqueta['X'])+ 2) *cm,  (float(plantila[0]['Largo']) - (float(etiqueta['Y']) -1  + float(altura_pie)) ) *cm   , certify[0]['firma'])
                  else:
                    certify = firma.traerdatos_usuario(request, etiqueta['Nombre'], request.POST.getlist('Id_empresa')[0])
                    if len(certify) >0:
                      firmados.append(etiqueta['Nombre'])
                      qr = QRCodeImage(certify[0]['display'] + ' Firmado ' +datetime.now().strftime('%Y-%m-%d- %H:%M:%S'), size=2 * cm)
                      qr.drawOn(pdf, float(etiqueta['X'])*cm, (float(plantila[0]['Largo']) - (float(etiqueta['Y']) +  float(altura_pie))) *cm)
                      pdf.drawString((float(etiqueta['X'])+ 2)*cm,  (float(plantila[0]['Largo']) - (float(etiqueta['Y']) -1.5 + float(altura_pie)) ) *cm   , 'Firmado Electronico')
                      pdf.drawString((float(etiqueta['X'])+ 2) *cm,  (float(plantila[0]['Largo']) - (float(etiqueta['Y']) -1  + float(altura_pie)) ) *cm   , certify[0]['firma'])
              


            for campo in CamposCabecera[segmento['PkSegmento']]:

                if campo['Tipo'] == 'Imagen':
                  limite  = campo['limite'].split(',')
                  try:
                    pdf.drawInlineImage('media/archivos/'+Id_empresa+'/'+str(envio_datset[estructuras[0]['Nombre']][0][campo['Campo']]), float(campo['X'])*cm,(float(plantila[0]['Largo']) - float(campo['Y'])- altura_pie )*cm, float(limite[0]) *cm,float(limite[1]) *cm)
                  except:
                    pass
                else:
                  if campo['Tipo'] == 'Firma':
                    certify = firma.traerdatos_usuario(request, envio_datset[estructuras[0]['Nombre']][0][campo['Campo']], request.POST.getlist('Id_empresa')[0])
                    if len(certify)> 0:
                      firmados.append(envio_datset[estructuras[0]['Nombre']][0][campo['Campo']])
                      qr = QRCodeImage(certify[0]['display'] + ' Firmado ' +datetime.now().strftime('%Y-%m-%d- %H:%M:%S'), size=2 * cm)
                      qr.drawOn(pdf, float(campo['X'])*cm, (float(plantila[0]['Largo']) - (float(campo['Y']) +  float(altura_pie))) *cm)
                      pdf.drawString((float(campo['X'])+ 2)*cm,  (float(plantila[0]['Largo']) - (float(campo['Y']) -1.5 + float(altura_pie)) ) *cm   , 'Firmado Electronico')
                      pdf.drawString((float(campo['X'])+ 2) *cm,  (float(plantila[0]['Largo']) - (float(campo['Y']) -1  + float(altura_pie)) ) *cm   , certify[0]['firma'])
              
                  else:
                    pdf.setFont('Helvetica', int(campo['Tamano']), leading = None)
                    txt = devolver_valor_imp(envio_datset[estructuras[0]['Nombre']][0][campo['Campo']], campo['Tipo'], campo['Ext'])
                    if type(txt) == int:
                      txt = str(txt)
                    if type(txt) == float:
                      txt = str(txt)
                    limite  = campo['limite'].split(',')
                    if len(txt) >= int(limite[0]):
                        for linea in range(0,int(limite[1])):
                            if len(txt) >= int(limite[0]):
                                if campo['Tipo'] == 'Derecha':
                                    pdf.drawRightString(float(campo['X'])*cm,  (float(plantila[0]['Largo']) - float(campo['Y']) - (linea * 0.5) + altura_pie ) *cm   ,  txt[0:int(limite[0])])
                                else:
                                    pdf.drawString(float(campo['X'])*cm,  (float(plantila[0]['Largo']) - float(campo['Y']) - (linea * 0.5) + altura_pie ) *cm   ,  txt[0:int(limite[0])])
                                txt = txt[int(limite[0]):]
                            else:
                              if campo['Tipo'] == 'Derecha':
                                  pdf.drawRightString(float(campo['X'])*cm,  (float(plantila[0]['Largo']) - float(campo['Y']) - (linea * 0.5) + altura_pie ) *cm   ,  txt)
                              else:
                                  pdf.drawString(float(campo['X'])*cm,  (float(plantila[0]['Largo']) - float(campo['Y']) - (linea * 0.5) + altura_pie ) *cm   ,  txt)
                              
                    else:
                        if campo['Tipo'] == 'Derecha':
                            pdf.drawRightString(float(campo['X'])*cm,  (float(plantila[0]['Largo']) - float(campo['Y'])- altura_pie ) *cm   , txt)
                        else:
                            pdf.drawString(float(campo['X'])*cm,  (float(plantila[0]['Largo']) - float(campo['Y'])- altura_pie ) *cm   , txt)

    pdf.save()

    return [Pdf_Name, firmados]


def crear_pdf_panel_historia_Clinica(request, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    plan_bases  = db.traer_plantilla_pdf_bases(request.POST.getlist('t_pkpaneL_g')[0])
    bases = {}
    firmados = []

    for a in plan_bases:
        bases[a['nombre']] = db.sql_traer_directo(a['senten'].replace('@pk@',request.POST.getlist('fichapk')[0]).replace('@fecha@',request.POST.getlist('fichaFecha')[0]))

    plan_hojas  = db.traer_plantilla_pdf_hojas(request.POST.getlist('t_pkpaneL_g')[0])

    fileName = 'media/firma/'+Id_empresa+'/PDF/'+request.POST.getlist('nombre')[0] +datetime.now().strftime('%Y%m%d%H%M%S')+'.pdf'
    documentTitle = ''
    #fileName = 'media/firma/'+Id_empresa+'/'+request.POST.getlist('nombre')[0]+'.pdf'

      
    pagesize=(float(request.POST.getlist('t_Ancho')[0])*cm,float(request.POST.getlist('t_largo')[0])*cm)

    # creating a pdf object
    pdf = canvas.Canvas(fileName,pagesize=pagesize)

    indice_pag = 0
    for hoja in plan_hojas:
      if indice_pag > 0:
        pdf.showPage()
      indice_pag = indice_pag + 1
      plan_seg  = db.traer_plantilla_pdf_seg_porhoja(hoja['pkhoja'],request.POST.getlist('t_pkpaneL_g')[0])
      #plan_seg  = db.traer_plantilla_pdf_seg_porhoja(request.POST.getlist('t_pkpaneL_g')[0])


      for a in plan_seg:
          a['datos'] = db.traer_plantilla_pdf_valor(a['pksegmento'])



      #pdf.drawString(1*cm,1*cm, '1 x 1')
      #pdf.drawString(2*cm,2*cm, '2 x 2 ')
      if float(request.POST.getlist('t_Ancho')[0]) > float(request.POST.getlist('t_largo')[0]):
        pdf.setPageSize(landscape(pagesize))
      else:
        pdf.setPageSize(pagesize)

      max_detalle = 0
      #colores
      for a in plan_seg:
        if a['tipo'] == 'Cabecera':
          for a2 in a['datos']:
            if a2['tipo'] == 'grafico':    
              limite = a2['limite'].split(',')
              txt =  a2['valor'].split(',')
              pdf.setFillColorRGB(int(txt[1])/255,int(txt[2])/255,int(txt[3])/255) #choose your font colour
              pdf.rect(float(a2['x'])*cm, (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])+ float(a['altura']) -0.15 ) *cm , float(limite[1])*cm,  float(limite[0])*cm, stroke=0, fill=1)
              pdf.setFillColorRGB(0,0,0) #choose your font colour

      for a in plan_seg:
          if a['tipo'] == 'Cabecera':
              for a2 in a['datos']:
                  pdf.setFont("Helvetica", int(a2['Letra']))
                  if a2['tipo'] == 'Funcion':
                      pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])+ float(a['altura']) ) *cm   , request.POST.getlist('fichaFecha')[0])
                  
                  if a2['tipo'] == 'Imagen':
                      valor = a2['valor'].split(',')
                      pdf.drawInlineImage('media/firma/'+Id_empresa+'/'+valor[0], float(a2['x'])*cm,(float(request.POST.getlist('t_largo')[0]) - float(a2['y'])+ float(a['altura']) )*cm, float(valor[1]),float(valor[2]))

                  if a2['tipo'] == 'Label':
                    pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])+ float(a['altura']) ) *cm   , a2['valor'])
                  if a2['tipo'] == 'Campo':
                    valor = a2['valor'].split('.')
                    txt = ""
                    for a3 in bases[valor[0]]:
                        txt = txt + str(a3[valor[1]]) + ', '
                    txt= txt[:-2]
                    limite  = a2['limite'].split(',')
                    bloq = 0
                    bloques = str(txt).split('\n')
                    for bloque in bloques:
                      if len(bloque) >= int(limite[0]):
                        txt = bloque
                        for linea in range(0,int(limite[1])):
                          if len(txt) > int(limite[0]):
                            if a2['lado'] == 'Izquierda':
                                pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])-bloq+ float(a['altura'])) *cm   , str(txt[0:int(limite[0])]))         
                            if a2['lado'] == 'Derecha':
                                pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y']) -bloq+ float(a['altura'])) *cm   , str(txt[0:int(limite[0])]))                                 
                            txt = txt[int(limite[0]):]
                            bloq = bloq + 0.5
                          else:
                            if a2['lado'] == 'Izquierda':
                                pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])-bloq+ float(a['altura'])) *cm   , txt)         
                            if a2['lado'] == 'Derecha':
                                pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y']) +bloq+ float(a['altura'])) *cm   , txt)         
                            break
                      else:
                        txt = bloque
                        for linea in range(0,int(limite[1])):
                          if len(txt) > int(limite[0]):
                            if a2['lado'] == 'Izquierda':
                                pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])-bloq+ float(a['altura'])) *cm   , str(txt[0:int(limite[0])]))         
                            if a2['lado'] == 'Derecha':
                                pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y']) -bloq+ float(a['altura'])) *cm   , str(txt[0:int(limite[0])]))                                 
                            txt = txt[int(limite[0]):]
                            bloq = bloq + 0.5
                          else:
                            if a2['lado'] == 'Izquierda':
                                pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])-bloq+ float(a['altura'])) *cm   , txt)         
                            if a2['lado'] == 'Derecha':
                                pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y']) +bloq+ float(a['altura'])) *cm   , txt)         
                            break
                      bloq = bloq + 0.5
          if a['tipo'] == 'Detalle':
              for a2 in a['datos']:
                  pdf.setFont("Helvetica", int(a2['Letra']))
                  if a2['tipo'] == 'Label':
                      pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + bajo+ float(a['altura']))) *cm   , a2['valor'] )         
                  if a2['tipo'] == 'Campo':
                      valor = a2['valor'].split('.')
                      bajo = 0
                      for a3 in bases[valor[0]]:
                        bloques =str(a3[valor[1]]).split('\n') 
                        limite = a2['limite'].split(',')
                        bloq = 0
                        for bloque in bloques:
                          if len(bloque) >= int(limite[0]):
                            txt_escribi = bloque
                            for linea in range(0,int(limite[1])):
                              if len(txt_escribi) > int(limite[0]):
                                if a2['lado'] == 'Izquierda':
                                    pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + bajo + bloq + float(a['altura']))) *cm   , str(txt_escribi[0:int(limite[0])]) )         
                                if a2['lado'] == 'Derecha':
                                    pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + bajo + bloq + float(a['altura']))) *cm   , str(txt_escribi[0:int(limite[0])]))             
                                txt_escribi = txt_escribi[int(limite[0]):]
                              else:
                                if a2['lado'] == 'Izquierda':
                                    pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + bajo + bloq + float(a['altura']))) *cm   , str(txt_escribi) )         
                                if a2['lado'] == 'Derecha':
                                    pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + bajo + bloq + float(a['altura']))) *cm   , str(txt_escribi))             
                                break
                              bloq = bloq + 0.5
                            bloq = bloq + 0.5
                          else:    
                            txt_escribi = bloque
                            if a2['lado'] == 'Izquierda':
                                pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + bajo + bloq + float(a['altura']))) *cm   , str(txt_escribi) )         
                            if a2['lado'] == 'Derecha':
                                pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + bajo + bloq + float(a['altura']))) *cm   , str(txt_escribi))         
                            bloq = bloq + 0.5
                        bajo = bajo + float(a['linea_ficha']) #+ bloq - 0.5
                        if max_detalle < (float(a2['y']) + bajo + float(a['altura'])):
                            max_detalle = (float(a2['y']) + bajo + float(a['altura']))      
      firma = web.firma_pdf 

      for a in plan_seg:
          if max_detalle < float(a['altura']):
              max_detalle = float(a['altura'])
          if a['tipo'] == 'Pie':
              for a2 in a['datos']:
                  pdf.setFont("Helvetica", int(a2['Letra']))

                  if a2['tipo'] == 'Label':
                      pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y'])+ float(max_detalle)) ) *cm   , a2['valor'])
                  if a2['tipo'] == 'Campo':
                      valor = a2['valor'].split('.')
                      txt = ""
                      for a3 in bases[valor[0]]:
                          txt = txt + str(a3[valor[1]]) + ', '
                      txt= txt[:-2]
                      limite  = a2['limite'].split(',')
                      if len(txt) >= int(limite[0]):
                        for linea in range(0,int(limite[1])):
                            if len(txt) >= int(limite[0]):
                                if a2['lado'] == 'Derecha':
                                    pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) -(linea * 0.5)- (float(a2['y']) +  float(max_detalle))) *cm   , txt[0:int(limite[0])])         
                                else:
                                    pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) -(linea * 0.5)- (float(a2['y']) + float(max_detalle))) *cm   , txt[0:int(limite[0])])         
                                txt = txt[int(limite[0]):]
                            else:
                              if a2['lado'] == 'Izquierda':
                                pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) -(linea * 0.5)- (float(a2['y']) + float(max_detalle))) *cm   , txt)         
                              if a2['lado'] == 'Derecha':
                                pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) -(linea * 0.5)- (float(a2['y']) +  float(max_detalle))) *cm   , txt)         
                              break    
                      else:
                        if a2['lado'] == 'Izquierda':
                            pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + float(max_detalle))) *cm   , txt)         
                        if a2['lado'] == 'Derecha':
                            pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) +  float(max_detalle))) *cm   , txt)         
                  if a2['tipo'] == 'FirmaDirecta':
                    if a2['valor'] == '@usuario@':
                      certify = firma.traerdatos_usuario(request, request.POST.getlist('usuario')[0], request.POST.getlist('Id_empresa')[0])
                      if len(certify)>0:
                        firmados.append(request.POST.getlist('usuario')[0])
                        qr = QRCodeImage(certify[0]['display'] + ' Firmado ' +datetime.now().strftime('%Y-%m-%d- %H:%M:%S'), size=2 * cm)
                        qr.drawOn(pdf, float(a2['x'])*cm, (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) +  float(max_detalle))) *cm)
                        pdf.drawString((float(a2['x'])+ 2)*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) -1.5 + float(max_detalle)) ) *cm   , 'Firmado Electronico')
                        pdf.drawString((float(a2['x'])+ 2) *cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) -1  + float(max_detalle)) ) *cm   , certify[0]['firma'])
                    else:
                      certify = firma.traerdatos_usuario(request, a2['valor'], request.POST.getlist('Id_empresa')[0])
                      if len(certify)>0:
                        qr = QRCodeImage(certify[0]['display'] + ' Firmado ' +datetime.now().strftime('%Y-%m-%d- %H:%M:%S'), size=2 * cm)
                        qr.drawOn(pdf, float(a2['x'])*cm, (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) +  float(max_detalle))) *cm)
                        pdf.drawString((float(a2['x'])+ 2)*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) -1.5 + float(max_detalle)) ) *cm   , 'Firmado Electronico')
                        pdf.drawString((float(a2['x'])+ 2) *cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) -1  + float(max_detalle)) ) *cm   , certify[0]['firma'])
    



    pdf.save()

    return [fileName, firmados]



def crear_pdf_panel(request, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    plan_bases  = db.traer_plantilla_pdf_bases(request.POST.getlist('t_pkpaneL_g')[0])
    bases = {}
    firmados = []

    for a in plan_bases:
        bases[a['nombre']] = db.sql_traer_directo(a['senten'].replace('@pk@',request.POST.getlist('fichapk')[0]).replace('@fecha@',request.POST.getlist('fichaFecha')[0]).replace('@user@',request.POST.getlist('fichaUser')[0]))

    plan_hojas  = db.traer_plantilla_pdf_hojas(request.POST.getlist('t_pkpaneL_g')[0])

    fileName = 'media/firma/'+Id_empresa+'/PDF/'+request.POST.getlist('nombre')[0] +datetime.now().strftime('%Y%m%d%H%M%S')+'.pdf'
    documentTitle = ''
    #fileName = 'media/firma/'+Id_empresa+'/'+request.POST.getlist('nombre')[0]+'.pdf'
    pagesize=(float(request.POST.getlist('t_Ancho')[0])*cm,float(request.POST.getlist('t_largo')[0])*cm)

    # creating a pdf object
    pdf = canvas.Canvas(fileName,pagesize=pagesize)

    indice_pag = 0
    for hoja in plan_hojas:
      if indice_pag > 0:
        pdf.showPage()
      indice_pag = indice_pag + 1
      plan_seg  = db.traer_plantilla_pdf_seg_porhoja(hoja['pkhoja'], request.POST.getlist('t_pkpaneL_g')[0])
      #plan_seg  = db.traer_plantilla_pdf_seg_porhoja()


      for a in plan_seg:
          a['datos'] = db.traer_plantilla_pdf_valor(a['pksegmento'])



      #pdf.drawString(1*cm,1*cm, '1 x 1')
      #pdf.drawString(2*cm,2*cm, '2 x 2 ')
      if float(request.POST.getlist('t_Ancho')[0]) > float(request.POST.getlist('t_largo')[0]):
        pdf.setPageSize(landscape(pagesize))
      else:
        pdf.setPageSize(pagesize)

      max_detalle = 0
      #colores
      for a in plan_seg:
        if a['tipo'] == 'Cabecera':
          for a2 in a['datos']:
            if a2['tipo'] == 'grafico':    
              limite = a2['limite'].split(',')
              txt =  a2['valor'].split(',')
              pdf.setFillColorRGB(int(txt[1])/255,int(txt[2])/255,int(txt[3])/255) #choose your font colour
              pdf.rect(float(a2['x'])*cm, (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])+ float(a['altura']) -0.15 ) *cm , float(limite[1])*cm,  float(limite[0])*cm, stroke=0, fill=1)
              pdf.setFillColorRGB(0,0,0) #choose your font colour
          
      for a in plan_seg:          
        if a['tipo'] == 'Cabecera':
            for a2 in a['datos']:
                pdf.setFont("Helvetica", int(a2['Letra']))
                if a2['tipo'] == 'Funcion':
                    pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])+ float(a['altura']) ) *cm   , request.POST.getlist('fichaFecha')[0])
                
                if a2['tipo'] == 'Imagen':
                    valor = a2['valor'].split(',')
                    try:
                      pdf.drawInlineImage('media/firma/'+Id_empresa+'/'+valor[0], float(a2['x'])*cm,(float(request.POST.getlist('t_largo')[0]) - float(a2['y'])+ float(a['altura']) )*cm, float(valor[1]),float(valor[2]))
                    except:
                      pass

                if a2['tipo'] == 'Label':
                  pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])+ float(a['altura']) ) *cm   , a2['valor'])
                if a2['tipo'] == 'Campo':
                  if a2['ext'] == 'Imagen':
                    valor = a2['valor'].split('.')
                    txt = bases[valor[0]][0][valor[1]]
                    limites= a2['limite'].split(',')
                    try:
                      pdf.drawInlineImage('media/archivos/'+Id_empresa+'/'+txt, float(a2['x'])*cm,(float(request.POST.getlist('t_largo')[0]) - float(a2['y'])+ float(a['altura']) )*cm, float(limites[0]),float(limites[1]))
                    except:
                      pass
                  else:
                    valor = a2['valor'].split('.')
                    txt = ""
                    for a3 in bases[valor[0]]:
                        txt = txt + str(a3[valor[1]]) + ', '
                    txt= txt[:-2]
                    limite  = a2['limite'].split(',')
                    bloq = 0
                    bloques = str(txt).split('\n')
                    for bloque in bloques:
                      if len(bloque) >= int(limite[0]):
                        txt = bloque
                        for linea in range(0,int(limite[1])):
                          if len(txt) > int(limite[0]):
                                                        

                            if str(txt[int(limite[0])]) == ' ':
                              txt_temp = str(txt[0:int(limite[0])])
                              txt = txt[int(limite[0]):]

                            else:
                              txt_temp = str(txt[0:int(limite[0])])
                              indice = 0
                              for letra in txt[int(limite[0]):]:
                                if letra != ' ':
                                  txt_temp = txt_temp + letra
                                else:
                                  break
                                indice+=1
                              txt = txt[int(limite[0]) + indice + 1 :]
                            if a2['lado'] == 'Izquierda':
                              pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])-bloq+ float(a['altura'])) *cm   , txt_temp)       
                            if a2['lado'] == 'Derecha':
                              pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y']) -bloq+ float(a['altura'])) *cm   , txt_temp)                                
                            #txt = txt[int(limite[0]):]
                            
                            bloq = bloq + (int(a2['Letra']) / 10 * (0.5) )

                          else:
                            if a2['lado'] == 'Izquierda':
                                pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])-bloq+ float(a['altura'])) *cm   , txt)         
                            if a2['lado'] == 'Derecha':
                                pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y']) +bloq+ float(a['altura'])) *cm   , txt)         
                            break
                      else:
                        txt = bloque
                        for linea in range(0,int(limite[1])):
                          if len(txt) > int(limite[0]):
                            if a2['lado'] == 'Izquierda':
                                pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])-bloq+ float(a['altura'])) *cm   , str(txt[0:int(limite[0])]))         
                            if a2['lado'] == 'Derecha':
                                pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y']) -bloq+ float(a['altura'])) *cm   , str(txt[0:int(limite[0])]))                                 
                            txt = txt[int(limite[0]):]
                            bloq = bloq + (int(a2['Letra']) / 10 * (0.5) )
                          else:
                            if a2['lado'] == 'Izquierda':
                                pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])-bloq+ float(a['altura'])) *cm   , txt)         
                            if a2['lado'] == 'Derecha':
                                pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y']) +bloq+ float(a['altura'])) *cm   , txt)         
                            break
                      bloq = bloq + (int(a2['Letra']) / 10 * (0.5) )

      ultimoY = 0


      sigueinte_pagui = []
      for a in plan_seg:
        if a['tipo'] == 'DetalleLateral':
              for a2 in a['datos']:
                  pdf.setFont("Helvetica", int(a2['Letra']))
                  if a2['tipo'] == 'Label':
                    if (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + bajo+ float(a['altura']))) > 2:
                      pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + bajo+ float(a['altura']))) *cm   , a2['valor'] )         
                    else:
                      sigueinte_pagui.append([float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + bajo+ float(a['altura']))) *cm   , a2['valor'] ])
                  if a2['tipo'] == 'Campo':
                      valor = a2['valor'].split('.')
                      bajo = 0
                      for a3 in bases[valor[0]]:
                        bloques =str(a3[valor[1]]).split('\n') 
                        limite = a2['limite'].split(',')
                        bloq = 0
                        for bloque in bloques:
                          if len(bloque) >= int(limite[0]):
                            txt_escribi = bloque
                            for linea in range(0,int(limite[1])):
                              if len(txt_escribi) > int(limite[0]):
                                if str(txt_escribi[int(limite[0])]) == ' ':
                                  txt_temp = str(txt[0:int(limite[0])])
                                  txt_escribi = txt_escribi[int(limite[0]):]
                                else:
                                  txt_temp = str(txt_escribi[0:int(limite[0])])
                                  indice = 0
                                  for letra in txt_escribi[int(limite[0]):]:
                                    if letra != ' ':
                                      txt_temp = txt_temp + letra
                                    else:
                                      break
                                    indice+=1
                                  txt_escribi = txt_escribi[int(limite[0]) + indice + 1 :]
                                if a2['lado'] == 'Izquierda':
                                    pdf.drawString((float(a2['x']) + bajo)*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y'])  + bloq + float(a['altura']))) *cm   , str(txt_temp) )         
                                if a2['lado'] == 'Derecha':
                                    pdf.drawRightString((float(a2['x']) + bajo)*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + bloq + float(a['altura']))) *cm   , str(txt_temp))             
                                ##txt_escribi = txt_escribi[int(limite[0]):]
                              else:
                                if a2['lado'] == 'Izquierda':
                                    pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + bajo + bloq + float(a['altura']))) *cm   , str(txt_escribi) )         
                                if a2['lado'] == 'Derecha':
                                    pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + bajo + bloq + float(a['altura']))) *cm   , str(txt_escribi))             
                                break
                              bloq = bloq + (int(a2['Letra']) / 10 * (0.5) )
                            bloq = bloq + (int(a2['Letra']) / 10 * (0.5) )
                          else:    
                            txt_escribi = bloque
                            if a2['lado'] == 'Izquierda':
                                pdf.drawString((float(a2['x']) + bajo)*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y'])  + bloq + float(a['altura']))) *cm   , str(txt_escribi) )         
                            if a2['lado'] == 'Derecha':
                                pdf.drawRightString((float(a2['x']) + bajo)*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + bloq + float(a['altura']))) *cm   , str(txt_escribi))         
                            bloq = bloq + (int(a2['Letra']) / 10 * (0.5) )
                        bajo = bajo + float(a['linea_ficha']) #+ bloq - 0.5
                        if max_detalle < (float(a2['y']) + bajo + float(a['altura'])):
                            max_detalle = (float(a2['y']) + bajo + float(a['altura']))                      
                  if a2['tipo'] == 'MarcaY':
                    valor = a2['valor'].split('.')
                    bajo = 0
                    for a3 in bases[valor[0]]:
                      nY = str(a3[valor[1]])              
                      limite = a2['limite'].split(',')
                      txt =  a2['ext'].split(',')
                      pdf.setFillColorRGB(int(txt[0])/255,int(txt[1])/255,int(txt[2])/255) #choose your font colour
                      pdf.rect((float(a2['x'] ) + bajo )*cm, (float(request.POST.getlist('t_largo')[0]) - float(nY)+ float(a['altura'])  ) *cm , float(limite[1])*cm,  float(limite[0])*cm, stroke=0, fill=1)
                      pdf.setFillColorRGB(0,0,0) #choose your font colour
                      #pdf.drawString((float(a2['x'] ) + bajo + 0.02 )*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(nY) + float(a['altura']))) *cm   , str(nY) )         
                      bajo = bajo + float(a['linea_ficha']) #+ bloq - 0.5    
          
                              
        if a['tipo'] == 'Detalle':
              for a2 in a['datos']:
                  pdf.setFont("Helvetica", int(a2['Letra']))
                  if a2['tipo'] == 'Label':
                    if (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + bajo+ float(a['altura']))) > 2:
                      pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + bajo+ float(a['altura']))) *cm   , a2['valor'] )         
                    else:
                      sigueinte_pagui.append([float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + bajo+ float(a['altura']))) *cm   , a2['valor'] ])
                  if a2['tipo'] == 'Campo':
                      valor = a2['valor'].split('.')
                      bajo = 0
                      for a3 in bases[valor[0]]:
                        bloques =str(a3[valor[1]]).split('\n') 
                        limite = a2['limite'].split(',')
                        bloq = 0
                        for bloque in bloques:
                          if len(bloque) >= int(limite[0]):
                            txt_escribi = bloque
                            for linea in range(0,int(limite[1])):
                              if len(txt_escribi) > int(limite[0]):


                                if str(txt_escribi[int(limite[0])]) == ' ':
                                  txt_temp = str(txt[0:int(limite[0])])
                                  txt_escribi = txt_escribi[int(limite[0]):]
                                else:
                                  txt_temp = str(txt_escribi[0:int(limite[0])])
                                  indice = 0
                                  for letra in txt_escribi[int(limite[0]):]:
                                    if letra != ' ':
                                      txt_temp = txt_temp + letra
                                    else:
                                      break
                                    indice+=1
                                  txt_escribi = txt_escribi[int(limite[0]) + indice + 1 :]
                                if a2['lado'] == 'Izquierda':
                                    pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + bajo + bloq + float(a['altura']))) *cm   , str(txt_temp) )         
                                if a2['lado'] == 'Derecha':
                                    pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + bajo + bloq + float(a['altura']))) *cm   , str(txt_temp))             
                                ##txt_escribi = txt_escribi[int(limite[0]):]
                              else:
                                if a2['lado'] == 'Izquierda':
                                    pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + bajo + bloq + float(a['altura']))) *cm   , str(txt_escribi) )         
                                if a2['lado'] == 'Derecha':
                                    pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + bajo + bloq + float(a['altura']))) *cm   , str(txt_escribi))             
                                break
                              bloq = bloq + (int(a2['Letra']) / 10 * (0.5) )
                            bloq = bloq + (int(a2['Letra']) / 10 * (0.5) )
                          else:    
                            txt_escribi = bloque
                            if a2['lado'] == 'Izquierda':
                                pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + bajo + bloq + float(a['altura']))) *cm   , str(txt_escribi) )         
                            if a2['lado'] == 'Derecha':
                                pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + bajo + bloq + float(a['altura']))) *cm   , str(txt_escribi))         
                            bloq = bloq + (int(a2['Letra']) / 10 * (0.5) )
                        bajo = bajo + float(a['linea_ficha']) #+ bloq - 0.5
                        if max_detalle < (float(a2['y']) + bajo + float(a['altura'])):
                            max_detalle = (float(a2['y']) + bajo + float(a['altura']))      
      
      
      
      firma = web.firma_pdf 

      for a in plan_seg:
          if a['tipo'] == 'Pie':            
            if max_detalle == 0:
              max_detalle = float(a['altura'])
            for a2 in a['datos']:
              pdf.setFont("Helvetica", int(a2['Letra']))

              if a2['tipo'] == 'Label':
                  pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y'])+ float(max_detalle)) ) *cm   , a2['valor'])
              if a2['tipo'] == 'Campo':
                  valor = a2['valor'].split('.')
                  txt = ""
                  for a3 in bases[valor[0]]:
                      txt = txt + str(a3[valor[1]]) + ', '
                  txt= txt[:-2]
                  limite  = a2['limite'].split(',')
                  if len(txt) >= int(limite[0]):
                    for linea in range(0,int(limite[1])):
                        if len(txt) >= int(limite[0]):
                            if a2['lado'] == 'Derecha':
                                pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) -(linea * 0.5)- (float(a2['y']) +  float(max_detalle))) *cm   , txt[0:int(limite[0])])         
                            else:
                                pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) -(linea * 0.5)- (float(a2['y']) + float(max_detalle))) *cm   , txt[0:int(limite[0])])         
                            txt = txt[int(limite[0]):]
                        else:
                          if a2['lado'] == 'Izquierda':
                            pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) -(linea * 0.5)- (float(a2['y']) + float(max_detalle))) *cm   , txt)         
                          if a2['lado'] == 'Derecha':
                            pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) -(linea * 0.5)- (float(a2['y']) +  float(max_detalle))) *cm   , txt)         
                          break    
                  else:
                    if a2['lado'] == 'Izquierda':
                        pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + float(max_detalle))) *cm   , txt)         
                    if a2['lado'] == 'Derecha':
                        pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) +  float(max_detalle))) *cm   , txt)         
              if a2['tipo'] == 'FirmaDirecta':
                if a2['valor'] == '@usuario@':
                  certify = firma.traerdatos_usuario(request, request.POST.getlist('usuario')[0], request.POST.getlist('Id_empresa')[0])
                  if len(certify)>0:
                    firmados.append(request.POST.getlist('usuario')[0])
                    qr = QRCodeImage(certify[0]['display'] + ' Firmado ' +datetime.now().strftime('%Y-%m-%d- %H:%M:%S'), size=2 * cm)
                    qr.drawOn(pdf, float(a2['x'])*cm, (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) +  float(max_detalle))) *cm)
                    pdf.drawString((float(a2['x'])+ 2)*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) -1.5 + float(max_detalle)) ) *cm   , 'Firmado Electronico')
                    pdf.drawString((float(a2['x'])+ 2) *cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) -1  + float(max_detalle)) ) *cm   , certify[0]['firma'])
                else:
                  valor = a2['valor'].split('.')
                  txt = ""
                  for a3 in bases[valor[0]]:
                      txt = txt + str(a3[valor[1]]) + ', '
                  txt= txt[:-2]
                  certify = firma.traerdatos_usuario(request, txt, request.POST.getlist('Id_empresa')[0])
                  if len(certify)>0:
                    qr = QRCodeImage(certify[0]['display'] + ' Firmado ' +datetime.now().strftime('%Y-%m-%d- %H:%M:%S'), size=2 * cm)
                    qr.drawOn(pdf, float(a2['x'])*cm, (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) +  float(max_detalle))) *cm)
                    pdf.drawString((float(a2['x'])+ 2)*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) -1.5 + float(max_detalle)) ) *cm   , 'Firmado Electronico')
                    pdf.drawString((float(a2['x'])+ 2) *cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) -1  + float(max_detalle)) ) *cm   , certify[0]['firma'])
    
    
    
    pdf.save()

    return [fileName, firmados]

def crear_pdf_panel_continua(request, Id_empresa):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    plan_bases  = db.traer_plantilla_pdf_bases(request.POST.getlist('t_pkpaneL_g')[0])
    bases = {}
    firmados = []
    if request.POST.getlist('MultiFechas')[0] == 'Si':
      plan_fechas = db.traer_plantilla_pdf_fechas(request.POST.getlist('pkpanel')[0],request.POST.getlist('fichapk')[0] , request.POST.getlist('fichaFecha')[0])
    else:
      plan_fechas = db.traer_plantilla_pdf_solo_fecha(request.POST.getlist('pkpanel')[0],request.POST.getlist('fichapk')[0] , request.POST.getlist('fichaFecha')[0], request.POST.getlist('fichaUser')[0])
    fileName = 'media/firma/'+Id_empresa+'/PDF/'+request.POST.getlist('nombre')[0] +datetime.now().strftime('%Y%m%d%H%M%S')+'.pdf'
    documentTitle = ''  
    pagesize=(float(request.POST.getlist('t_Ancho')[0])*cm,float(request.POST.getlist('t_largo')[0])*cm)
    pdf = canvas.Canvas(fileName,pagesize=pagesize)

    if float(request.POST.getlist('t_Ancho')[0]) > float(request.POST.getlist('t_largo')[0]):
      pdf.setPageSize(landscape(pagesize))
    else:
      pdf.setPageSize(pagesize)
    firma = web.firma_pdf 

    indice_pag = 0
    lineaY = 0
    archivos_anexos = []

    plan_seg  = db.traer_plantilla_pdf_seg_tipo(request.POST.getlist('t_pkpaneL_g')[0], 'Cabecera')
    for a in plan_seg:
      for base in plan_bases:
        if a['base'] == base['nombre']:
          bases[base['nombre']] = db.sql_traer_directo(base['senten'].replace('@pk@',request.POST.getlist('fichapk')[0]).replace('@fecha@',request.POST.getlist('fichaFecha')[0]).replace('@user@',request.POST.getlist('fichaUser')[0]))

      if len(bases[a['base']]) > 0:
          a['datos'] = db.traer_plantilla_pdf_valor(a['pksegmento'])
          a['datos'] = db.traer_plantilla_pdf_valor(a['pksegmento'])

          for dato in bases[a['base']]:
          
            for a2 in a['datos']:
              if a2['tipo'] == 'grafico':    
                limite = a2['limite'].split(',')
                txt =  a2['valor'].split(',')
                pdf.setFillColorRGB(int(txt[1])/255,int(txt[2])/255,int(txt[3])/255) #choose your font colour
                pdf.rect(float(a2['x'])*cm, (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])+ float(a['altura']) -0.15 ) *cm , float(limite[1])*cm,  float(limite[0])*cm, stroke=0, fill=1)
                pdf.setFillColorRGB(0,0,0) #choose your font colour

              pdf.setFont("Helvetica", int(a2['Letra']))
                    
              if a2['tipo'] == 'Funcion':
                  pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])+ float(a['altura']) ) *cm   , request.POST.getlist('fichaFecha')[0])
                    
              if a2['tipo'] == 'Imagen':
                  valor = a2['valor'].split(',')
                  pdf.drawInlineImage('media/firma/'+Id_empresa+'/'+valor[0], float(a2['x'])*cm,(float(request.POST.getlist('t_largo')[0]) - float(a2['y'])+ float(a['altura']) )*cm, float(valor[1]),float(valor[2]))

              if a2['tipo'] == 'Label':
                pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y']) - lineaY  +float(a['altura']) ) *cm   , a2['valor'])

              if a2['tipo'] == 'FirmaDirecta':
                if a2['valor'] == '@usuario@':
                  certify = firma.traerdatos_usuario(request, request.POST.getlist('usuario')[0], request.POST.getlist('Id_empresa')[0])
                  if len(certify)>0:
                    firmados.append(request.POST.getlist('usuario')[0])
                    qr = QRCodeImage(certify[0]['display'] + ' Firmado ' +datetime.now().strftime('%Y-%m-%d- %H:%M:%S'), size=2 * cm)
                    qr.drawOn(pdf, float(a2['x'])*cm, (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + lineaY )) *cm)
                    pdf.drawString((float(a2['x'])+ 2)*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + lineaY +float(a['altura'])- 1.5) ) *cm   , 'Firmado Electronico')
                    pdf.drawString((float(a2['x'])+ 2) *cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + lineaY +float(a['altura']) - 0.5) ) *cm   , certify[0]['firma'])
                else:
                  valor = a2['valor'].split('.')
                  certify = firma.traerdatos_usuario(request, str(dato[valor[1]]) , request.POST.getlist('Id_empresa')[0])
                  if len(certify)>0:
                    qr = QRCodeImage(certify[0]['display'] + ' Firmado ' +datetime.now().strftime('%Y-%m-%d- %H:%M:%S'), size=2 * cm)
                    qr.drawOn(pdf, float(a2['x'])*cm, (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + lineaY)) *cm)
                    pdf.drawString((float(a2['x'])+ 2)*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + lineaY -1.5) ) *cm   , 'Firmado Electronico')
                    pdf.drawString((float(a2['x'])+ 2) *cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + lineaY -0.5) ) *cm   , certify[0]['firma'])                
              if a2['tipo'] == 'Campo':
                valor = a2['valor'].split('.')
                txt = str(dato[valor[1]]) 

                limite  = a2['limite'].split(',')
                bloq = 0
                bloques = str(txt).split('\n')
                for bloque in bloques:
                  if len(bloque) >= int(limite[0]):
                    txt = bloque
                    for linea in range(0,int(limite[1])):
                      if len(txt) > int(limite[0]):
                        if a2['lado'] == 'Izquierda':
                            pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y']) - lineaY-bloq+ float(a['altura'])) *cm   , str(txt[0:int(limite[0])]))         
                        if a2['lado'] == 'Derecha':
                            pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY -bloq+ float(a['altura'])) *cm   , str(txt[0:int(limite[0])]))                                 
                        txt = txt[int(limite[0]):]
                        bloq = bloq + 0.5
                      else:
                        if a2['lado'] == 'Izquierda':
                            pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY -bloq+ float(a['altura'])) *cm   , txt)         
                        if a2['lado'] == 'Derecha':
                            pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY +bloq+ float(a['altura'])) *cm   , txt)         
                        break
                  else:
                    txt = bloque
                    for linea in range(0,int(limite[1])):
                      if len(txt) > int(limite[0]):
                        if a2['lado'] == 'Izquierda':
                            pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY-bloq+ float(a['altura'])) *cm   , str(txt[0:int(limite[0])]))         
                        if a2['lado'] == 'Derecha':
                            pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY -bloq+ float(a['altura'])) *cm   , str(txt[0:int(limite[0])]))                                 
                        txt = txt[int(limite[0]):]
                        bloq = bloq + 0.5
                      else:
                        if a2['lado'] == 'Izquierda':
                            pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY-bloq+ float(a['altura'])) *cm   , txt)         
                        if a2['lado'] == 'Derecha':
                            pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY -bloq+ float(a['altura'])) *cm   , txt)         
                        break
                  bloq = bloq + 0.5

    for fecha in plan_fechas:
      for a in plan_bases:
        bases[a['nombre']] = db.sql_traer_directo(a['senten'].replace('@pk@',request.POST.getlist('fichapk')[0]).replace('@fecha@',fecha['fecha'].strftime('%Y-%m-%d')).replace('@user@',request.POST.getlist('fichaUser')[0]))
      plan_seg  = db.traer_plantilla_pdf_seg_tipo(request.POST.getlist('t_pkpaneL_g')[0], 'Detalle')
      for a in plan_seg:
        if len(bases[a['base']]) > 0:
          if lineaY < float(a['altura']):
            lineaY = float(a['altura']) 

          a['datos'] = db.traer_plantilla_pdf_valor(a['pksegmento'])

          for dato in bases[a['base']]:
            if lineaY >= (float(request.POST.getlist('t_largo')[0]) - (1 + float(a['linea_ficha']))  ):
              pdf.showPage()
              lineaY = 1
            bloque_mayor = 0
            for a2 in a['datos']:
              if a2['tipo'] == 'grafico':    
                limite = a2['limite'].split(',')
                txt =  a2['valor'].split(',')
                pdf.setFillColorRGB(int(txt[1])/255,int(txt[2])/255,int(txt[3])/255) #choose your font colour
                pdf.rect(float(a2['x'])*cm, (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])+ float(a['altura']) -0.15 ) *cm , float(limite[1])*cm,  float(limite[0])*cm, stroke=0, fill=1)
                pdf.setFillColorRGB(0,0,0) #choose your font colour

              pdf.setFont("Helvetica", int(a2['Letra']))
                    
              if a2['tipo'] == 'Funcion':
                  pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])+ float(a['altura']) ) *cm   , request.POST.getlist('fichaFecha')[0])
                    
              if a2['tipo'] == 'Imagen':
                  valor = a2['valor'].split(',')
                  try:
                    pdf.drawInlineImage('media/firma/'+Id_empresa+'/'+valor[0], float(a2['x'])*cm,(float(request.POST.getlist('t_largo')[0]) - float(a2['y'])+ float(a['altura']) )*cm, float(valor[1]),float(valor[2]))
                  except:
                    pass

              if a2['tipo'] == 'Label':
                pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y']) - lineaY ) *cm   , a2['valor'])
              if a2['tipo'] == 'Archivo':
                valor = a2['valor'].split('.')
                archivos_anexos.append(str(dato[valor[1]]))

              if a2['tipo'] == 'Campo':
                valor = a2['valor'].split('.')
                txt = str(dato[valor[1]]) 

                limite  = a2['limite'].split(',')
                bloq = 0
                bloques = str(txt).split('\n')
                for bloque in bloques:
                  if len(bloque) >= int(limite[0]):
                    txt = bloque

                    #for linea in range(0,int(limite[1])):
                    while txt != '':
                      if len(txt) > int(limite[0]):
                        if str(txt[int(limite[0])]) == ' ':
                          txt_temp = str(txt[0:int(limite[0])])
                          txt = txt[int(limite[0]):]
                        else:
                          txt_temp = str(txt[0:int(limite[0])])
                          indice = 0
                          for letra in txt[int(limite[0]):]:
                            if letra != ' ':
                              txt_temp = txt_temp + letra
                            else:
                              break
                            indice+=1
                          txt = txt[int(limite[0]) + indice + 1 :]


                        if a2['lado'] == 'Izquierda':
                            pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y']) - lineaY - bloq) *cm   , str(txt_temp))         
                        if a2['lado'] == 'Derecha':
                            pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY - bloq) *cm   , str(txt_temp))                                 
                        #txt = txt[int(limite[0]):]
                        bloq = bloq + (int(a2['Letra']) / 10 * (0.5) )
                      else:
                        if a2['lado'] == 'Izquierda':
                            pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY - bloq) *cm   , txt)         
                        if a2['lado'] == 'Derecha':
                            pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY +bloq) *cm   , txt)         
                        break
                  else:
                    txt = bloque
                    for linea in range(0,int(limite[1])):
                      if len(txt) > int(limite[0]):
                        if a2['lado'] == 'Izquierda':
                            pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY - bloq) *cm   , str(txt[0:int(limite[0])]))         
                        if a2['lado'] == 'Derecha':
                            pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY - bloq) *cm   , str(txt[0:int(limite[0])]))                                 
                        txt = txt[int(limite[0]):]
                        bloq = bloq + (int(a2['Letra']) / 10 * (0.5) )
                      else:
                        if a2['lado'] == 'Izquierda':
                            pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y']) - lineaY - bloq ) *cm   , txt)         
                        if a2['lado'] == 'Derecha':
                            pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y']) - lineaY - bloq) *cm   , txt)         
                        break
                  bloq = bloq + (int(a2['Letra']) / 10 * (0.5) )
                  if bloque_mayor < float(a2['y'])+ lineaY+ bloq :
                    bloque_mayor = float(a2['y'])+ lineaY+ bloq 
            if bloque_mayor > (lineaY + float(a['linea_ficha'])):
              lineaY = bloque_mayor
            else:
              lineaY = lineaY + float(a['linea_ficha'])

    plan_seg  = db.traer_plantilla_pdf_seg_tipo(request.POST.getlist('t_pkpaneL_g')[0], 'Pie')
    for a in plan_seg:
      for base in plan_bases:
        if a['base'] == base['nombre']:
          bases[base['nombre']] = db.sql_traer_directo(base['senten'].replace('@pk@',request.POST.getlist('fichapk')[0]).replace('@fecha@',request.POST.getlist('fichaFecha')[0]).replace('@user@',request.POST.getlist('fichaUser')[0]))

      if lineaY < float(a['altura']):
        lineaY = float(a['altura']) 
      if lineaY >= (float(request.POST.getlist('t_largo')[0]) -  2  ):
        pdf.showPage()
        lineaY = 1
      if len(bases[a['base']]) > 0:
          a['datos'] = db.traer_plantilla_pdf_valor(a['pksegmento'])

          for dato in bases[a['base']]:
          
            for a2 in a['datos']:
              if a2['tipo'] == 'grafico':    
                limite = a2['limite'].split(',')
                txt =  a2['valor'].split(',')
                pdf.setFillColorRGB(int(txt[1])/255,int(txt[2])/255,int(txt[3])/255) #choose your font colour
                pdf.rect(float(a2['x'])*cm, (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY -0.15 ) *cm , float(limite[1])*cm,  float(limite[0])*cm, stroke=0, fill=1)
                pdf.setFillColorRGB(0,0,0) #choose your font colour

              pdf.setFont("Helvetica", int(a2['Letra']))
                    
              if a2['tipo'] == 'Funcion':
                  pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY ) *cm   , request.POST.getlist('fichaFecha')[0])
                    
              if a2['tipo'] == 'Imagen':
                  valor = a2['valor'].split(',')
                  try:
                    pdf.drawInlineImage('media/firma/'+Id_empresa+'/'+valor[0], float(a2['x'])*cm,(float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY )*cm, float(valor[1]),float(valor[2]))
                  except:
                    pass
              if a2['tipo'] == 'Label':
                pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y']) - lineaY  ) *cm   , a2['valor'])

              if a2['tipo'] == 'FirmaDirecta':
                if a2['valor'] == '@usuario@':
                  certify = firma.traerdatos_usuario(request, request.POST.getlist('usuario')[0], request.POST.getlist('Id_empresa')[0])
                  if len(certify)>0:
                    firmados.append(request.POST.getlist('usuario')[0])
                    qr = QRCodeImage(certify[0]['display'] + ' Firmado ' +datetime.now().strftime('%Y-%m-%d- %H:%M:%S'), size=2 * cm)
                    qr.drawOn(pdf, float(a2['x'])*cm, (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + lineaY )) *cm)
                    pdf.drawString((float(a2['x'])+ 2)*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + lineaY - 1.5) ) *cm   , 'Firmado Electronico')
                    pdf.drawString((float(a2['x'])+ 2) *cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + lineaY - 0.5) ) *cm   , certify[0]['firma'])
                else:
                  valor = a2['valor'].split('.')
                  certify = firma.traerdatos_usuario(request, str(dato[valor[1]]) , request.POST.getlist('Id_empresa')[0])
                  if len(certify)>0:
                    qr = QRCodeImage(certify[0]['display'] + ' Firmado ' +datetime.now().strftime('%Y-%m-%d- %H:%M:%S'), size=2 * cm)
                    qr.drawOn(pdf, float(a2['x'])*cm, (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + lineaY)) *cm)
                    pdf.drawString((float(a2['x'])+ 2)*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + lineaY -1.5) ) *cm   , 'Firmado Electronico')
                    pdf.drawString((float(a2['x'])+ 2) *cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + lineaY -0.5) ) *cm   , certify[0]['firma'])

              if a2['tipo'] == 'Campo':
                valor = a2['valor'].split('.')
                txt = str(dato[valor[1]]) 

                limite  = a2['limite'].split(',')
                bloq = 0
                bloques = str(txt).split('\n')
                for bloque in bloques:
                  if len(bloque) >= int(limite[0]):
                    txt = bloque
                    for linea in range(0,int(limite[1])):
                      if len(txt) > int(limite[0]):
                        if str(txt[int(limite[0])]) == ' ':
                          txt_temp = str(txt[0:int(limite[0])])
                          txt = txt[int(limite[0]):]

                        else:
                          txt_temp = str(txt[0:int(limite[0])])
                          indice = 0
                          for letra in txt[int(limite[0]):]:
                            if letra != ' ':
                              txt_temp = txt_temp + letra
                            else:
                              break
                            indice+=1
                          txt = txt[int(limite[0]) + indice + 1 :]

                        if a2['lado'] == 'Izquierda':
                            pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y']) - lineaY -bloq) *cm   , str(txt_temp))         
                        if a2['lado'] == 'Derecha':
                            pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY -bloq) *cm   , str(txt_temp))                                 
                        #txt = txt[int(limite[0]):]
                        bloq = bloq + 0.5
                      else:
                        if a2['lado'] == 'Izquierda':
                            pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY -bloq) *cm   , txt)         
                        if a2['lado'] == 'Derecha':
                            pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY +bloq) *cm   , txt)         
                        break
                  else:
                    txt = bloque
                    for linea in range(0,int(limite[1])):
                      if len(txt) > int(limite[0]):
                        if a2['lado'] == 'Izquierda':
                            pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY-bloq) *cm   , str(txt[0:int(limite[0])]))         
                        if a2['lado'] == 'Derecha':
                            pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY -bloq) *cm   , str(txt[0:int(limite[0])]))                                 
                        txt = txt[int(limite[0]):]
                        bloq = bloq + 0.5
                      else:
                        if a2['lado'] == 'Izquierda':
                            pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY-bloq) *cm   , txt)         
                        if a2['lado'] == 'Derecha':
                            pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY -bloq) *cm   , txt)         
                        break
                  bloq = bloq + 0.5

    plan_seg  = db.traer_plantilla_pdf_seg_tipo_porsegmento(request.POST.getlist('t_pkpaneL_g')[0], 'Panel_Fijo')
    for a in plan_seg:
      t_plan_bases  = db.traer_plantilla_pdf_bases(a['base'])
      t_plan_fechas = db.traer_plantilla_pdf_fechas(a['pkhoja'],request.POST.getlist('fichapk')[0] , request.POST.getlist('fichaFecha')[0])
      t_plan_basesData = {}
      t_bases = {}
      for t_fechas in t_plan_fechas:
        for yy in t_plan_bases:
          t_plan_basesData[yy['nombre']] = db.sql_traer_directo(yy['senten'].replace('@pk@',request.POST.getlist('fichapk')[0]).replace('@fecha@',t_fechas['fecha'].strftime('%Y-%m-%d')).replace('@user@',request.POST.getlist('fichaUser')[0]))
        t_plan_hojas  = db.traer_plantilla_pdf_hojas(a['base'])
        for hoja in t_plan_hojas:
          pdf.showPage()
          h_plan_seg  = db.traer_plantilla_pdf_seg_porhoja(hoja['pkhoja'], a['base'])

          for aa in h_plan_seg:
              aa['datos'] = db.traer_plantilla_pdf_valor(aa['pksegmento'])
          
          max_detalle = 0
          for aa in h_plan_seg:
            if aa['tipo'] == 'Cabecera':
              for a2 in aa['datos']:
                if a2['tipo'] == 'grafico':    
                  limite = a2['limite'].split(',')
                  txt =  a2['valor'].split(',')
                  pdf.setFillColorRGB(int(txt[1])/255,int(txt[2])/255,int(txt[3])/255) #choose your font colour
                  pdf.rect(float(a2['x'])*cm, (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])+ float(aa['altura']) -0.15 ) *cm , float(limite[1])*cm,  float(limite[0])*cm, stroke=0, fill=1)
                  pdf.setFillColorRGB(0,0,0) #choose your font colour
          for aa in h_plan_seg:
            if aa['tipo'] == 'Cabecera':
              for a2 in aa['datos']:
                pdf.setFont("Helvetica", int(a2['Letra']))
                if a2['tipo'] == 'Funcion':
                    pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])+ float(aa['altura']) ) *cm   , t_fechas['fecha'])

                if a2['tipo'] == 'Imagen':
                  valor = a2['valor'].split(',')
                  try:
                    pdf.drawInlineImage('media/firma/'+Id_empresa+'/'+valor[0], float(a2['x'])*cm,(float(request.POST.getlist('t_largo')[0]) - float(a2['y'])+ float(aa['altura']) )*cm, float(valor[1]),float(valor[2]))
                  except:
                    pass
                if a2['tipo'] == 'Label':
                  pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])+ float(aa['altura']) ) *cm   , a2['valor'])
            
                if a2['tipo'] == 'Campo':
                  if a2['ext'] == 'Imagen':
                    valor = a2['valor'].split('.')
                    #txt = t_plan_bases[valor[0]][0][valor[1]]
                    txt =t_plan_basesData[valor[0]][0][valor[1]]
                    limites= a2['limite'].split(',')
                    try:
                      pdf.drawInlineImage('media/archivos/'+Id_empresa+'/'+txt, float(a2['x'])*cm,(float(request.POST.getlist('t_largo')[0]) - float(a2['y'])+ float(aa['altura']) )*cm, float(limites[0]),float(limites[1]))
                    except:
                      pass
                  else:
                    valor = a2['valor'].split('.')
                    txt = ""
                    #for a3 in t_plan_bases[valor[0]]:
                    for a3 in t_plan_basesData[valor[0]]:
                        txt = txt + str(a3[valor[1]]) + ', '
                    txt= txt[:-2]
                    limite  = a2['limite'].split(',')
                    bloq = 0
                    bloques = str(txt).split('\n')
                    for bloque in bloques:
                      if len(bloque) >= int(limite[0]):
                        txt = bloque
                        for linea in range(0,int(limite[1])):
                          if len(txt) > int(limite[0]):
                            if str(txt[int(limite[0])]) == ' ':
                              txt_temp = str(txt[0:int(limite[0])])
                              txt = txt[int(limite[0]):]
                            else:
                              txt_temp = str(txt[0:int(limite[0])])
                              indice = 0
                              for letra in txt[int(limite[0]):]:
                                if letra != ' ':
                                  txt_temp = txt_temp + letra
                                else:
                                  break
                                indice+=1
                              txt = txt[int(limite[0]) + indice + 1 :]
                            if a2['lado'] == 'Izquierda':
                              pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])-bloq+ float(aa['altura'])) *cm   , txt_temp)       
                            if a2['lado'] == 'Derecha':
                              pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y']) -bloq+ float(aa['altura'])) *cm   , txt_temp)                                
                            #txt = txt[int(limite[0]):]
                            bloq = bloq + (int(a2['Letra']) / 10 * (0.5) )
                          else:
                            if a2['lado'] == 'Izquierda':
                                pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])-bloq+ float(aa['altura'])) *cm   , txt)         
                            if a2['lado'] == 'Derecha':
                                pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y']) +bloq+ float(aa['altura'])) *cm   , txt)         
                            break
                      else:
                        txt = bloque
                        for linea in range(0,int(limite[1])):
                          if len(txt) > int(limite[0]):
                            if a2['lado'] == 'Izquierda':
                                pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])-bloq+ float(aa['altura'])) *cm   , str(txt[0:int(limite[0])]))         
                            if a2['lado'] == 'Derecha':
                                pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y']) -bloq+ float(aa['altura'])) *cm   , str(txt[0:int(limite[0])]))                                 
                            txt = txt[int(limite[0]):]
                            bloq = bloq + (int(a2['Letra']) / 10 * (0.5) )
                          else:
                            if a2['lado'] == 'Izquierda':
                                pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])-bloq+ float(aa['altura'])) *cm   , txt)         
                            if a2['lado'] == 'Derecha':
                                pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y']) +bloq+ float(aa['altura'])) *cm   , txt)         
                            break
                      bloq = bloq + (int(a2['Letra']) / 10 * (0.5) )
  
  #/////////////////////////////////////////////////////
            if aa['tipo'] == 'DetalleLateral':
                for a2 in aa['datos']:
                    pdf.setFont("Helvetica", int(a2['Letra']))
                    if a2['tipo'] == 'Label':
                      if (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + bajo+ float(aa['altura']))) > 2:
                        pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + bajo+ float(aa['altura']))) *cm   , a2['valor'] )         
                    if a2['tipo'] == 'Campo':
                        valor = a2['valor'].split('.')
                        bajo = 0
                        for a3 in t_plan_basesData[valor[0]]:
                          bloques =str(a3[valor[1]]).split('\n') 
                          limite = a2['limite'].split(',')
                          bloq = 0
                          for bloque in bloques:
                            if len(bloque) >= int(limite[0]):
                              txt_escribi = bloque
                              for linea in range(0,int(limite[1])):
                                if len(txt_escribi) > int(limite[0]):
                                  if str(txt_escribi[int(limite[0])]) == ' ':
                                    txt_temp = str(txt[0:int(limite[0])])
                                    txt_escribi = txt_escribi[int(limite[0]):]
                                  else:
                                    txt_temp = str(txt_escribi[0:int(limite[0])])
                                    indice = 0
                                    for letra in txt_escribi[int(limite[0]):]:
                                      if letra != ' ':
                                        txt_temp = txt_temp + letra
                                      else:
                                        break
                                      indice+=1
                                    txt_escribi = txt_escribi[int(limite[0]) + indice + 1 :]
                                  if a2['lado'] == 'Izquierda':
                                      pdf.drawString((float(a2['x']) + bajo)*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y'])  + bloq + float(aa['altura']))) *cm   , str(txt_temp) )         
                                  if a2['lado'] == 'Derecha':
                                      pdf.drawRightString((float(a2['x']) + bajo)*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + bloq + float(aa['altura']))) *cm   , str(txt_temp))             
                                  ##txt_escribi = txt_escribi[int(limite[0]):]
                                else:
                                  if a2['lado'] == 'Izquierda':
                                      pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + bajo + bloq + float(aa['altura']))) *cm   , str(txt_escribi) )         
                                  if a2['lado'] == 'Derecha':
                                      pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + bajo + bloq + float(aa['altura']))) *cm   , str(txt_escribi))             
                                  break
                                bloq = bloq + (int(a2['Letra']) / 10 * (0.5) )
                              bloq = bloq + (int(a2['Letra']) / 10 * (0.5) )
                            else:    
                              txt_escribi = bloque
                              if a2['lado'] == 'Izquierda':
                                  pdf.drawString((float(a2['x']) + bajo)*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y'])  + bloq + float(aa['altura']))) *cm   , str(txt_escribi) )         
                              if a2['lado'] == 'Derecha':
                                  pdf.drawRightString((float(a2['x']) + bajo)*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + bloq + float(aa['altura']))) *cm   , str(txt_escribi))         
                              bloq = bloq + (int(a2['Letra']) / 10 * (0.5) )
                          bajo = bajo + float(aa['linea_ficha']) #+ bloq - 0.5
                          if max_detalle < (float(a2['y']) + bajo + float(aa['altura'])):
                              max_detalle = (float(a2['y']) + bajo + float(aa['altura']))                      
                    if a2['tipo'] == 'MarcaY':
                      valor = a2['valor'].split('.')
                      bajo = 0
                      for a3 in t_plan_basesData[valor[0]]:
                        nY = str(a3[valor[1]])              
                        limite = a2['limite'].split(',')
                        txt =  a2['ext'].split(',')
                        pdf.setFillColorRGB(int(txt[0])/255,int(txt[1])/255,int(txt[2])/255) #choose your font colour
                        pdf.rect((float(a2['x'] ) + bajo )*cm, (float(request.POST.getlist('t_largo')[0]) - float(nY)+ float(aa['altura'])  ) *cm , float(limite[1])*cm,  float(limite[0])*cm, stroke=0, fill=1)
                        pdf.setFillColorRGB(0,0,0) #choose your font colour
                        #pdf.drawString((float(a2['x'] ) + bajo + 0.02 )*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(nY) + float(aa['altura']))) *cm   , str(nY) )         
                        bajo = bajo + float(aa['linea_ficha']) #+ bloq - 0.5    
            
                                
            if aa['tipo'] == 'Detalle':
                  for a2 in aa['datos']:
                      pdf.setFont("Helvetica", int(a2['Letra']))
                      if a2['tipo'] == 'Label':
                        if (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + bajo+ float(aa['altura']))) > 2:
                          pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + bajo+ float(aa['altura']))) *cm   , a2['valor'] )         
                      if a2['tipo'] == 'Campo':
                          valor = a2['valor'].split('.')
                          bajo = 0
                          for a3 in t_plan_basesData[valor[0]]:
                            bloques =str(a3[valor[1]]).split('\n') 
                            limite = a2['limite'].split(',')
                            bloq = 0
                            for bloque in bloques:
                              if len(bloque) >= int(limite[0]):
                                txt_escribi = bloque
                                for linea in range(0,int(limite[1])):
                                  if len(txt_escribi) > int(limite[0]):


                                    if str(txt_escribi[int(limite[0])]) == ' ':
                                      txt_temp = str(txt[0:int(limite[0])])
                                      txt_escribi = txt_escribi[int(limite[0]):]
                                    else:
                                      txt_temp = str(txt_escribi[0:int(limite[0])])
                                      indice = 0
                                      for letra in txt_escribi[int(limite[0]):]:
                                        if letra != ' ':
                                          txt_temp = txt_temp + letra
                                        else:
                                          break
                                        indice+=1
                                      txt_escribi = txt_escribi[int(limite[0]) + indice + 1 :]
                                    if a2['lado'] == 'Izquierda':
                                        pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + bajo + bloq + float(aa['altura']))) *cm   , str(txt_temp) )         
                                    if a2['lado'] == 'Derecha':
                                        pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + bajo + bloq + float(aa['altura']))) *cm   , str(txt_temp))             
                                    ##txt_escribi = txt_escribi[int(limite[0]):]
                                  else:
                                    if a2['lado'] == 'Izquierda':
                                        pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + bajo + bloq + float(aa['altura']))) *cm   , str(txt_escribi) )         
                                    if a2['lado'] == 'Derecha':
                                        pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + bajo + bloq + float(aa['altura']))) *cm   , str(txt_escribi))             
                                    break
                                  bloq = bloq + (int(a2['Letra']) / 10 * (0.5) )
                                bloq = bloq + (int(a2['Letra']) / 10 * (0.5) )
                              else:    
                                txt_escribi = bloque
                                if a2['lado'] == 'Izquierda':
                                    pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + bajo + bloq + float(aa['altura']))) *cm   , str(txt_escribi) )         
                                if a2['lado'] == 'Derecha':
                                    pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + bajo + bloq + float(aa['altura']))) *cm   , str(txt_escribi))         
                                bloq = bloq + (int(a2['Letra']) / 10 * (0.5) )
                            bajo = bajo + float(aa['linea_ficha']) #+ bloq - 0.5
                            if max_detalle < (float(a2['y']) + bajo + float(aa['altura'])):
                                max_detalle = (float(a2['y']) + bajo + float(aa['altura']))      
    

    #a['pkhoja'] = pkhojo en este caso debedira de pksegmento
    #,request.POST.getlist('fichapk')[0] es el valor pk del panel de busqueda 
    # se diferencia entre continuos y fijos por lo que fijos empieza por pkhoja continuos es por segmento
    plan_seg  = db.traer_plantilla_pdf_seg_tipo_porsegmento(request.POST.getlist('t_pkpaneL_g')[0], 'Panel_continuos')
    for a in plan_seg:
      t_plan_bases  = db.traer_plantilla_pdf_bases(a['base'])
      t_plan_fechas = db.traer_plantilla_pdf_solo_fecha(a['pkhoja'],request.POST.getlist('fichapk')[0] , request.POST.getlist('fichaFecha')[0], '%')
      t_plan_basesData = {}
      t_bases = {}
      for t_fechas in t_plan_fechas:
        lineaY = 0
        pdf.showPage()

        int_plan_seg  = db.traer_plantilla_pdf_seg_tipo(a['base'], 'Cabecera')
        
        indice_pag = 0
        for segy in int_plan_seg:
          for base_int in t_plan_bases:
            if segy['base'] == base_int['nombre']:
              t_plan_basesData[base_int['nombre']] = db.sql_traer_directo(base_int['senten'].replace('@pk@',request.POST.getlist('fichapk')[0]).replace('@fecha@',t_fechas['fecha'].strftime('%Y-%m-%d')).replace('@user@',request.POST.getlist('fichaUser')[0]))
          if len(t_plan_basesData[segy['base']]) > 0:
            segy['datos'] = db.traer_plantilla_pdf_valor(segy['pksegmento'])

            for dato in t_plan_basesData[segy['base']]:
              for a2 in segy['datos']:
                if a2['tipo'] == 'grafico':    
                  limite = a2['limite'].split(',')
                  txt =  a2['valor'].split(',')
                  pdf.setFillColorRGB(int(txt[1])/255,int(txt[2])/255,int(txt[3])/255) #choose your font colour
                  pdf.rect(float(a2['x'])*cm, (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])+ float(segy['altura']) -0.15 ) *cm , float(limite[1])*cm,  float(limite[0])*cm, stroke=0, fill=1)
                  pdf.setFillColorRGB(0,0,0) #choose your font colour
                
                pdf.setFont("Helvetica", int(a2['Letra']))

                if a2['tipo'] == 'Funcion':
                    pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])+ float(segy['altura']) ) *cm   , t_fechas['fecha'].strftime('%Y-%m-%d'))
                      
                if a2['tipo'] == 'Imagen':
                    valor = a2['valor'].split(',')
                    pdf.drawInlineImage('media/firma/'+Id_empresa+'/'+valor[0], float(a2['x'])*cm,(float(request.POST.getlist('t_largo')[0]) - float(a2['y'])+ float(segy['altura']) )*cm, float(valor[1]),float(valor[2]))

                if a2['tipo'] == 'Label':
                  pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y']) - lineaY  +float(segy['altura']) ) *cm   , a2['valor'])

                if a2['tipo'] == 'FirmaDirecta':
                  pass
                  #no se puede firmar dentro de un doc extendido 
                  # if a2['valor'] == '@usuario@': #
                  #   certify = firma.traerdatos_usuario(request, request.POST.getlist('usuario')[0], request.POST.getlist('Id_empresa')[0])
                  #   if len(certify)>0:
                  #     firmados.append(request.POST.getlist('usuario')[0])
                  #     qr = QRCodeImage(certify[0]['display'] + ' Firmado ' +datetime.now().strftime('%Y-%m-%d- %H:%M:%S'), size=2 * cm)
                  #     qr.drawOn(pdf, float(a2['x'])*cm, (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + lineaY )) *cm)
                  #     pdf.drawString((float(a2['x'])+ 2)*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + lineaY +float(a['altura'])- 1.5) ) *cm   , 'Firmado Electronico')
                  #     pdf.drawString((float(a2['x'])+ 2) *cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + lineaY +float(a['altura']) - 0.5) ) *cm   , certify[0]['firma'])
                  # else:
                  #   valor = a2['valor'].split('.')
                  #   certify = firma.traerdatos_usuario(request, str(dato[valor[1]]) , request.POST.getlist('Id_empresa')[0])
                  #   if len(certify)>0:
                  #     qr = QRCodeImage(certify[0]['display'] + ' Firmado ' +datetime.now().strftime('%Y-%m-%d- %H:%M:%S'), size=2 * cm)
                  #     qr.drawOn(pdf, float(a2['x'])*cm, (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + lineaY)) *cm)
                  #     pdf.drawString((float(a2['x'])+ 2)*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + lineaY -1.5) ) *cm   , 'Firmado Electronico')
                  #     pdf.drawString((float(a2['x'])+ 2) *cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + lineaY -0.5) ) *cm   , certify[0]['firma'])
                if a2['tipo'] == 'Campo':
                  valor = a2['valor'].split('.')
                  txt = str(dato[valor[1]]) 

                  limite  = a2['limite'].split(',')
                  bloq = 0
                  bloques = str(txt).split('\n')
                  for bloque in bloques:
                    if len(bloque) >= int(limite[0]):
                      txt = bloque
                      for linea in range(0,int(limite[1])):
                        if len(txt) > int(limite[0]):
                          if a2['lado'] == 'Izquierda':
                              pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y']) - lineaY-bloq+ float(segy['altura'])) *cm   , str(txt[0:int(limite[0])]))         
                          if a2['lado'] == 'Derecha':
                              pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY -bloq+ float(segy['altura'])) *cm   , str(txt[0:int(limite[0])]))                                 
                          txt = txt[int(limite[0]):]
                          bloq = bloq + 0.5
                        else:
                          if a2['lado'] == 'Izquierda':
                              pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY -bloq+ float(segy['altura'])) *cm   , txt)         
                          if a2['lado'] == 'Derecha':
                              pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY +bloq+ float(segy['altura'])) *cm   , txt)         
                          break
                    else:
                      txt = bloque
                      for linea in range(0,int(limite[1])):
                        if len(txt) > int(limite[0]):
                          if a2['lado'] == 'Izquierda':
                              pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY-bloq+ float(segy['altura'])) *cm   , str(txt[0:int(limite[0])]))         
                          if a2['lado'] == 'Derecha':
                              pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY -bloq+ float(segy['altura'])) *cm   , str(txt[0:int(limite[0])]))                                 
                          txt = txt[int(limite[0]):]
                          bloq = bloq + 0.5
                        else:
                          if a2['lado'] == 'Izquierda':
                              pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY-bloq+ float(segy['altura'])) *cm   , txt)         
                          if a2['lado'] == 'Derecha':
                              pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY -bloq+ float(segy['altura'])) *cm   , txt)         
                          break
                    bloq = bloq + 0.5
        int_plan_seg  = db.traer_plantilla_pdf_seg_tipo(a['base'], 'Detalle')
        lineaY = 0
        for segy in int_plan_seg:
          for base_int in t_plan_bases:
            if segy['base'] == base_int['nombre']:
              t_plan_basesData[base_int['nombre']] = db.sql_traer_directo(base_int['senten'].replace('@pk@',request.POST.getlist('fichapk')[0]).replace('@fecha@',t_fechas['fecha'].strftime('%Y-%m-%d')).replace('@user@',request.POST.getlist('fichaUser')[0]))
          if len(t_plan_basesData[segy['base']]) > 0:
            if lineaY < float(segy['altura']):
              lineaY = float(segy['altura']) 

            segy['datos'] = db.traer_plantilla_pdf_valor(segy['pksegmento'])
            for dato in t_plan_basesData[segy['base']]:
              if lineaY >= (float(request.POST.getlist('t_largo')[0]) -  2  ):
                pdf.showPage()
                lineaY = 1
              for a2 in segy['datos']:
                if a2['tipo'] == 'grafico':    
                  limite = a2['limite'].split(',')
                  txt =  a2['valor'].split(',')
                  pdf.setFillColorRGB(int(txt[1])/255,int(txt[2])/255,int(txt[3])/255) #choose your font colour
                  pdf.rect(float(a2['x'])*cm, (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])+ float(segy['altura']) -0.15 ) *cm , float(limite[1])*cm,  float(limite[0])*cm, stroke=0, fill=1)
                  pdf.setFillColorRGB(0,0,0) #choose your font colour

                pdf.setFont("Helvetica", int(a2['Letra']))
                if a2['tipo'] == 'Imagen':
                  valor = a2['valor'].split(',')
                  try:
                    pdf.drawInlineImage('media/firma/'+Id_empresa+'/'+valor[0], float(a2['x'])*cm,(float(request.POST.getlist('t_largo')[0]) - float(a2['y'])+ float(segy['altura']) )*cm, float(valor[1]),float(valor[2]))
                  except:
                    pass
                if a2['tipo'] == 'Label':
                  pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y']) - lineaY ) *cm   , a2['valor'])
                if a2['tipo'] == 'Campo':
                  valor = a2['valor'].split('.')
                  txt = str(dato[valor[1]]) 

                  limite  = a2['limite'].split(',')
                  bloq = 0
                  bloques = str(txt).split('\n')
                  for bloque in bloques:
                    if len(bloque) >= int(limite[0]):
                      txt = bloque
                      for linea in range(0,int(limite[1])):
                        if len(txt) > int(limite[0]):
                          if str(txt[int(limite[0])]) == ' ':
                            txt_temp = str(txt[0:int(limite[0])])
                            txt = txt[int(limite[0]):]
                          else:
                            txt_temp = str(txt[0:int(limite[0])])
                            indice = 0
                            for letra in txt[int(limite[0]):]:
                              if letra != ' ':
                                txt_temp = txt_temp + letra
                              else:
                                break
                              indice+=1
                            txt = txt[int(limite[0]) + indice + 1 :]


                          if a2['lado'] == 'Izquierda':
                              pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y']) - lineaY - bloq) *cm   , str(txt_temp))         
                          if a2['lado'] == 'Derecha':
                              pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY - bloq) *cm   , str(txt_temp))                                 
                          #txt = txt[int(limite[0]):]
                          bloq = bloq + (int(a2['Letra']) / 10 * (0.5) )
                        else:
                          if a2['lado'] == 'Izquierda':
                              pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY - bloq) *cm   , txt)         
                          if a2['lado'] == 'Derecha':
                              pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY +bloq) *cm   , txt)         
                          break
                    else:
                      txt = bloque
                      for linea in range(0,int(limite[1])):
                        if len(txt) > int(limite[0]):
                          if a2['lado'] == 'Izquierda':
                              pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY - bloq) *cm   , str(txt[0:int(limite[0])]))         
                          if a2['lado'] == 'Derecha':
                              pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY - bloq) *cm   , str(txt[0:int(limite[0])]))                                 
                          txt = txt[int(limite[0]):]
                          bloq = bloq + (int(a2['Letra']) / 10 * (0.5) )
                        else:
                          if a2['lado'] == 'Izquierda':
                              pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y']) - lineaY - bloq ) *cm   , txt)         
                          if a2['lado'] == 'Derecha':
                              pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y']) - lineaY - bloq) *cm   , txt)         
                          break
                    bloq = bloq + (int(a2['Letra']) / 10 * (0.5) )
              lineaY = lineaY + float(segy['linea_ficha'])

        int_plan_seg  = db.traer_plantilla_pdf_seg_tipo(a['base'], 'Pie')
        for segy in int_plan_seg:
          for base_int in t_plan_bases:
            if segy['base'] == base_int['nombre']:
              t_plan_basesData[base_int['nombre']] = db.sql_traer_directo(base_int['senten'].replace('@pk@',request.POST.getlist('fichapk')[0]).replace('@fecha@',t_fechas['fecha'].strftime('%Y-%m-%d')).replace('@user@',request.POST.getlist('fichaUser')[0]))
         
          if lineaY < float(segy['altura']):
            lineaY = float(segy['altura']) 
          if lineaY >= (float(request.POST.getlist('t_largo')[0]) -  2  ):
            pdf.showPage()
            lineaY = 1

          if len(t_plan_basesData[segy['base']]) > 0:
            segy['datos'] = db.traer_plantilla_pdf_valor(segy['pksegmento'])
            for dato in t_plan_basesData[segy['base']]:
              for a2 in a['datos']:
                if a2['tipo'] == 'grafico':    
                  limite = a2['limite'].split(',')
                  txt =  a2['valor'].split(',')
                  pdf.setFillColorRGB(int(txt[1])/255,int(txt[2])/255,int(txt[3])/255) #choose your font colour
                  pdf.rect(float(a2['x'])*cm, (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY -0.15 ) *cm , float(limite[1])*cm,  float(limite[0])*cm, stroke=0, fill=1)
                  pdf.setFillColorRGB(0,0,0) #choose your font colour

                pdf.setFont("Helvetica", int(a2['Letra']))
              if a2['tipo'] == 'Funcion':
                  pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY ) *cm   , request.POST.getlist('fichaFecha')[0])
              if a2['tipo'] == 'Imagen':
                  valor = a2['valor'].split(',')
                  try:
                    pdf.drawInlineImage('media/firma/'+Id_empresa+'/'+valor[0], float(a2['x'])*cm,(float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY )*cm, float(valor[1]),float(valor[2]))
                  except:
                    pass
              if a2['tipo'] == 'Label':
                pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y']) - lineaY  ) *cm   , a2['valor'])

              if a2['tipo'] == 'Campo':
                valor = a2['valor'].split('.')
                txt = str(dato[valor[1]]) 

                limite  = a2['limite'].split(',')
                bloq = 0
                bloques = str(txt).split('\n')
                for bloque in bloques:
                  if len(bloque) >= int(limite[0]):
                    txt = bloque
                    for linea in range(0,int(limite[1])):
                      if len(txt) > int(limite[0]):
                        if str(txt[int(limite[0])]) == ' ':
                          txt_temp = str(txt[0:int(limite[0])])
                          txt = txt[int(limite[0]):]
                        else:
                          txt_temp = str(txt[0:int(limite[0])])
                          indice = 0
                          for letra in txt[int(limite[0]):]:
                            if letra != ' ':
                              txt_temp = txt_temp + letra
                            else:
                              break
                            indice+=1
                          txt = txt[int(limite[0]) + indice + 1 :]
                        if a2['lado'] == 'Izquierda':
                            pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y']) - lineaY -bloq) *cm   , str(txt_temp))         
                        if a2['lado'] == 'Derecha':
                            pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY -bloq) *cm   , str(txt_temp))                                 
                        #txt = txt[int(limite[0]):]
                        bloq = bloq + 0.5
                      else:
                        if a2['lado'] == 'Izquierda':
                            pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY -bloq) *cm   , txt)         
                        if a2['lado'] == 'Derecha':
                            pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY +bloq) *cm   , txt)         
                        break
                  else:
                    txt = bloque
                    for linea in range(0,int(limite[1])):
                      if len(txt) > int(limite[0]):
                        if a2['lado'] == 'Izquierda':
                            pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY-bloq) *cm   , str(txt[0:int(limite[0])]))         
                        if a2['lado'] == 'Derecha':
                            pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY -bloq) *cm   , str(txt[0:int(limite[0])]))                                 
                        txt = txt[int(limite[0]):]
                        bloq = bloq + 0.5
                      else:
                        if a2['lado'] == 'Izquierda':
                            pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY-bloq) *cm   , txt)         
                        if a2['lado'] == 'Derecha':
                            pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])- lineaY -bloq) *cm   , txt)         
                        break
                  bloq = bloq + 0.5

    pdf.save()

    return [fileName, firmados, archivos_anexos]


def prueba():
    pass



def devolver_valor_imp(valor, tipo, ext):
    if tipo == 'Color':
        return valor
    if tipo == 'Imagen':
        return valor
    if tipo == 'Normal':
        return valor
    if tipo == 'Fecha':
      fecha = datetime.strptime(valor, '%Y-%m-%d  %H:%M:%S')
      if ext == 'Dia':
          return fecha.strftime('%d')
      if ext == 'Mes':
          return fecha.strftime( '%m')
      if ext == 'Anio':
          return fecha.strftime('%Y')
      if ext == 'Letras_larga':
          if fecha.strftime( '%m') == 1: 
            return fecha.strftime( '%Y') + " de Enero del " + fecha.strftime('%d')
          elif fecha.strftime('%m') == 2:
            return fecha.strftime('%Y') + " de Febrero del " + fecha.strftime('%d')
          elif fecha.strftime('%m') == 3:
            return fecha.strftime('%Y') + " de Marzo del " + fecha.strftime('%d')
          elif fecha.strftime('%m') == 4:
            return fecha.strftime('%Y') + " de Abril del " + fecha.strftime('%d')
          elif fecha.strftime('%m') == 5:
            return fecha.strftime('%Y') + " de Mayo del " + fecha.strftime('%d')
          elif fecha.strftime('%m') == 6:
            return fecha.strftime('%Y') + " de Junio del " + fecha.strftime('%d')
          elif fecha.strftime('%m') == 7:
            return fecha.strftime('%Y') + " de Julio del " + fecha.strftime('%d')
          elif fecha.strftime('%m') == 8:
            return fecha.strftime('%Y') + " de Agosto del " + fecha.strftime('%d')
          elif fecha.strftime('%m') == 9:
            return fecha.strftime('%Y') + " de Septiembre del " + fecha.strftime('%d')
          elif fecha.strftime('%m') == 10:
            return fecha.strftime('%Y') + " de Octubre del " + fecha.strftime('%d')
          elif fecha.strftime('%m') == 11:
            return fecha.strftime('%Y') + " de Noviembre del " + fecha.strftime('%d')
          else: # asume 12
            return fecha.strftime('%Y') + " de Diciembre del " + fecha.strftime('%d')
      if ext == 'Letras':
          if fecha.strftime('%m') == 1:
            return fecha.strftime('%Y') + " Enero " + fecha.strftime('%d')
          elif fecha.strftime('%m') == 2:
            return fecha.strftime('%Y') + " Febrero " + fecha.strftime('%d')
          elif fecha.strftime('%m') == 3:
            return fecha.strftime('%Y') + " Marzo " + fecha.strftime('%d')
          elif fecha.strftime('%m') == 4:
            return fecha.strftime('%Y') + " Abril " + fecha.strftime('%d')
          elif fecha.strftime('%m') == 5:
            return fecha.strftime('%Y') + " Mayo " + fecha.strftime('%d')
          elif fecha.strftime('%m') == 6:
            return fecha.strftime('%Y') + " Junio " + fecha.strftime('%d')
          elif fecha.strftime('%m') == 7:
            return fecha.strftime('%Y') + " Julio " + fecha.strftime('%d')
          elif fecha.strftime('%m') == 8:
            return fecha.strftime('%Y') + " Agosto " + fecha.strftime('%d')
          elif fecha.strftime('%m') == 9:
            return fecha.strftime('%Y') + " Septiembre " + fecha.strftime('%d')
          elif fecha.strftime('%m') == 10:
            return fecha.strftime('%Y') + " Octubre " + fecha.strftime('%d')
          elif fecha.strftime('%m') == 11:
            return fecha.strftime('%Y') + " Noviembre " + fecha.strftime('%d')
          else: # asume 12
            return fecha.strftime('%Y') + " Diciembre " + fecha.strftime('%d')
      if ext == 'Normal':
          return fecha.strftime('%Y-%m-%d %H:%M:%S')
      if ext == 'DDMMAAAA':
          return fecha.strftime('%d%m%Y')
      if ext == 'LetrasMayusculas':
          if fecha.strftime('%m') == 1:
            return fecha.strftime('%Y') + " ENERO " + fecha.strftime('%d')
          elif fecha.strftime('%m') == 2:
            return fecha.strftime('%Y') + " FEBRERO " + fecha.strftime('%d')
          elif fecha.strftime('%m') == 3:
            return fecha.strftime('%Y') + " MARZO " + fecha.strftime('%d')
          elif fecha.strftime('%m') == 4:
            return fecha.strftime('%Y') + " ABRIL " + fecha.strftime('%d')
          elif fecha.strftime('%m') == 5:
            return fecha.strftime('%Y') + " MAYO " + fecha.strftime('%d')
          elif fecha.strftime('%m') == 6:
            return fecha.strftime('%Y') + " JUNIO " + fecha.strftime('%d')
          elif fecha.strftime('%m') == 7:
            return fecha.strftime('%Y') + " JULIO " + fecha.strftime('%d')
          elif fecha.strftime('%m') == 8:
            return fecha.strftime('%Y') + " AGOSTO " + fecha.strftime('%d')
          elif fecha.strftime('%m') == 9:
            return fecha.strftime('%Y') + " SEPTIEMBRE " + fecha.strftime('%d')
          elif fecha.strftime('%m') == 10:
            return fecha.strftime('%Y') + " OCTUBRE " + fecha.strftime('%d')
          elif fecha.strftime('%m') == 11:
            return fecha.strftime('%Y') + " NOVIEMBRE " + fecha.strftime('%d')
          else: # asume 12
            return fecha.strftime('%Y') + " DICIEMBRE " + fecha.strftime('%d')
      if ext == 'Cheque':
          return fecha.strftime('%d/%m/%Y')

    if tipo == 'Derecha':
        if ext == 'Letras':
            return valor
        elif ext == 'Normal':
            return  str(float(valor))
        elif ext == 'Miles':
            return "{:,.2f}".format( float(valor))
        elif ext == 'Dolar':
            return '$ ' +  "{:,.2f}".format( float(valor))
        elif ext == 'Euro':
            return '€ ' + "{:,.2f}".format( float(valor))
        elif ext == 'Porcentaje':
            return str(float(valor) / 100) + '%'
        elif ext == 'Porcentaje_full':
            return str(float(valor)) + '%'
        else:           
            return str(float(valor))

    if tipo == 'CerosFijos':
        return valor
    if tipo == 'Numero':
        if ext == 'Normal':
            return  str(float(valor))
        elif ext == 'Miles':
            return "{:,.2f}".format( float(valor))
        elif ext == 'Dolar':
            return '$ ' +  "{:,.2f}".format( float(valor))
        elif ext == 'Euro':
            return '€ ' + "{:,.2f}".format( float(valor))
        elif ext == 'Porcentaje':
            return str(float(valor) / 100) + '%'
        elif ext == 'Porcentaje_full':
            return str(float(valor)) + '%'
        else:           
            return str(float(valor))
  