
import datetime


# from reportlab.pdfgen import canvas
# from reportlab.pdfbase.ttfonts import TTFont
# from reportlab.pdfbase import pdfmetrics
# from reportlab.lib import colors
# from reportlab.lib.units import cm
# from datetime import datetime
# from reportlab.lib.pagesizes import letter, landscape
# from reportlab_qrcode import QRCodeImage

import web.con_db

def crear(request, Id_empresa, certificado):
    return ''
    # db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    # plan_bases  = db.traer_plantilla_pdf_bases(request.POST.getlist('t_pkpaneL_g')[0])
    # bases = {}

    # for a in plan_bases:
    #     bases[a['nombre']] = db.sql_traer_directo(a['senten'].replace('@pk@',request.POST.getlist('fichapk')[0]).replace('@fecha@',request.POST.getlist('fichaFecha')[0]))

    # plan_seg  = db.traer_plantilla_pdf_seg(request.POST.getlist('t_pkpaneL_g')[0])
    # for a in plan_seg:
    #      a['datos'] = db.traer_plantilla_pdf_valor(a['pksegmento'])


    # fileName = 'media/firma/'+Id_empresa+'/'+request.POST.getlist('nombre')[0] +datetime.now().strftime('%Y%m%d%H%M%S')+'.pdf'
    # documentTitle = ''
    # #fileName = 'media/firma/'+Id_empresa+'/'+request.POST.getlist('nombre')[0]+'.pdf'

    # pagesize=(float(request.POST.getlist('t_Ancho')[0])*cm,float(request.POST.getlist('t_largo')[0])*cm)

    # # creating a pdf object
    # pdf = canvas.Canvas(fileName,pagesize=pagesize)
    # #pdf.drawString(1*cm,1*cm, '1 x 1')
    # #pdf.drawString(2*cm,2*cm, '2 x 2 ')
    # pdf.setPageSize(landscape(pagesize))

    # max_detalle = 0


    # for a in plan_seg:
    #     if a['tipo'] == 'Cabecera':
    #         for a2 in a['datos']:
    #             if a2['tipo'] == 'Imagen':
    #                 valor = a2['valor'].split(',')
    #                 pdf.drawInlineImage('media/firma/'+Id_empresa+'/'+valor[0], float(a2['x'])*cm,(float(request.POST.getlist('t_largo')[0]) - float(a2['y'])+ float(a['altura']) )*cm, float(valor[1]),float(valor[2]))

    #             if a2['tipo'] == 'Label':
    #                 pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])+ float(a['altura']) ) *cm   , a2['valor'])
    #             if a2['tipo'] == 'Campo':
    #                 valor = a2['valor'].split('.')
    #                 txt = ""
    #                 for a3 in bases[valor[0]]:
    #                     txt = txt + str(a3[valor[1]]) + ', '
    #                 txt= txt[:-2]
    #                 if a2['lado'] == 'Izquierda':
    #                     pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y'])+ float(a['altura'])) *cm   , txt)         
    #                 if a2['lado'] == 'Derecha':
    #                     pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - float(a2['y']) + float(a['altura'])) *cm   , txt)         
    #     if a['tipo'] == 'Detalle':
    #         for a2 in a['datos']:
    #             if a2['tipo'] == 'Label':
    #                 pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + bajo+ float(a['altura']))) *cm   , a2['valor'] )         
    #             if a2['tipo'] == 'Campo':
    #                 valor = a2['valor'].split('.')
    #                 bajo = 0
    #                 for a3 in bases[valor[0]]:
    #                     if len(str(a3[valor[1]])) > float(a2['limite']):
    #                         txt_escribi = str(a3[valor[1]])[0:int(a2['limite'])]
    #                     else:
    #                         txt_escribi = str(a3[valor[1]])
    #                     if a2['lado'] == 'Izquierda':
    #                         pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + bajo+ float(a['altura']))) *cm   , str(txt_escribi) )         
    #                     if a2['lado'] == 'Derecha':
    #                         pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + bajo + float(a['altura']))) *cm   , str(txt_escribi))         
    #                     bajo = bajo + float(a['linea_ficha'])
    #                     if max_detalle < (float(a2['y']) + bajo + float(a['altura'])):
    #                         max_detalle = (float(a2['y']) + bajo + float(a['altura']))

    

    # for a in plan_seg:
    #     if max_detalle < float(a['altura']):
    #         max_detalle = float(a['altura'])
    #     if a['tipo'] == 'Pie':
    #         for a2 in a['datos']:
    #             if a2['tipo'] == 'Label':
    #                 pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y'])+ float(max_detalle)) ) *cm   , a2['valor'])
    #             if a2['tipo'] == 'Campo':
    #                 valor = a2['valor'].split('.')
    #                 txt = ""
    #                 for a3 in bases[valor[0]]:
    #                     txt = txt + str(a3[valor[1]]) + ', '
    #                 txt= txt[:-2]
    #                 if a2['lado'] == 'Izquierda':
    #                     pdf.drawString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) + float(max_detalle))) *cm   , txt)         
    #                 if a2['lado'] == 'Derecha':
    #                     pdf.drawRightString(float(a2['x'])*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(a2['y']) +  float(max_detalle))) *cm   , txt)         
        

    # for certify in certificado:
    #     qr = QRCodeImage(certify['display'] + ' Firmado ' +datetime.now().strftime('%Y-%m-%d- %H:%M:%S'), size=2 * cm)
    #     qr.drawOn(pdf, float(certify['x'])*cm, (float(request.POST.getlist('t_largo')[0]) - (float(certify['y']) +  float(max_detalle))) *cm)
    #     pdf.drawString((float(certify['x'])+ 2)*cm,  (float(request.POST.getlist('t_largo')[0]) - (float(certify['y']) -1.5 + float(max_detalle)) ) *cm   , 'Firmado Electronico')
    #     pdf.drawString((float(certify['x'])+ 2) *cm,  (float(request.POST.getlist('t_largo')[0]) - (float(certify['y']) -1  + float(max_detalle)) ) *cm   , certify['firma'])

 


    # pdf.save()

    # return fileName
   

def prueba():
    pass
    # fileName = 'media/firma/sample.pdf'
    # documentTitle = 'sample'
    # title = 'Technology'
    # subTitle = 'The largest thing now!!'
    # textLines = [
    #     'Technology makes us aware of',
    #     'the world around us.',
    # ]
    # image = 'media/firma/golum.jpg'
    # pagesize=(10*cm,29*cm)


    # # creating a pdf object
    # pdf = canvas.Canvas(fileName,pagesize)
    
    # # setting the title of the document
    # pdf.setTitle(documentTitle)

    
    # # creating the title by setting it's font 
    # # and putting it on the canvas
    # pdf.drawCentredString(300, 770, title)

        
    # # creating the subtitle by setting it's font, 
    # # colour and putting it on the canvas
    # pdf.setFillColorRGB(0, 0, 255)
    # pdf.setFont("Courier-Bold", 24)
    # pdf.drawCentredString(290, 720, subTitle)


    # # drawing a line
    # pdf.line(30, 710, 550, 710)
    
    # # creating a multiline text using
    # # textline and for loop
    # text = pdf.beginText(40, 680)
    # text.setFont("Courier", 18)
    # text.setFillColor(colors.red)
    
    # for line in textLines:
    #     text.textLine(line)
        
    


    # # drawing a image at the 
    # # specified (x.y) position
    # pdf.drawInlineImage(image, 130, 400)
    
    # # saving the pdf
    # pdf.save()

