
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
#import web.firmador
#import web.XmlXadesBesSignXml

#import web.xades
import time
            
import sys
 
import datetime
import os
import os.path
#import xades
#import xmlsig
import base64

try:
    from StringIO import StringIO
except ImportError:
    from io import StringIO

def regreso_fecha(fecha):
    txt = ""
    date_time_obj = datetime.datetime.strptime(fecha, '%Y-%m-%d')
    if(int(date_time_obj.day) > 9):
        txt = str(date_time_obj.day)
    else:
        txt = "0" + str(date_time_obj.day)
    
    if(int(date_time_obj.month) > 9):
        txt = txt + str(date_time_obj.month)
    else:
        txt = txt + "0" + str(date_time_obj.month)

    txt = txt + str(date_time_obj.year)
    return txt

def Mod11_mio(txt):
    temp = 0
    temp2 = 0
    cc2 = 2
    for s in range(len(txt) -1,0,-1):
        temp = cc2 * int(str(txt[s]))
        temp2 = temp2 + temp
        cc2 = cc2 + 1
        if(cc2 == 8):
            cc2 = 2
    temp2 = temp2 % 11
    return (11 - temp2)

def hacer_clave(request, Id_empresa, tabla, pkcampo, Tipo, tablanom ):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    datos_tribu = db.Traercmpelect_infoTributaria(pkcampo)
    clave = str(regreso_fecha(tabla[tablanom][0][datos_tribu[0]["fecha"]]))
    clave = clave + str(datos_tribu[0]["codDoc"])
    clave = clave + str(datos_tribu[0]["ruc"])
    clave = clave + str(datos_tribu[0]["ambiente"])
    clave = clave + str(tabla[tablanom][0][datos_tribu[0]["estab"]])
    clave = clave + str(tabla[tablanom][0][datos_tribu[0]["ptoEmi"]])
    valor = int(tabla[tablanom][0][datos_tribu[0]["secuencial"]]) + 1000000000
    valor = str(valor)[1:]
    clave = clave + str(valor)
    clave = clave + "00000000"
    clave = clave + "1"
    valor = Mod11_mio(clave)
    if(valor == "11"):
        valor = "0"
    if(valor == "10"):
        valor = "1"
    clave = clave + str(valor)
    return clave    

def devolver_autorizacion(request, Id_empresa, tabla, pkcampo, nombre_tabla, pkestructura  ):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    datos_campos = db.TraerCampo_electr(pkcampo, pkestructura)
    datos_infoTributaria = db.Traercmpelect_infoTributaria(pkcampo)

    pasa_auto = True
    if(datos_campos[0]["Cond_campo"] != ""):
        if(tabla[nombre_tabla][0][datos_campos[0]["Cond_campo"]] != datos_campos[0]["Cond_valor"]):
            pasa_auto = False
    clave_acceso = '0'
    campo_elec = datos_campos[0]["ClaveAcceso"]
    if(pasa_auto == True):
        respuesta =  enviar_off_line(request.POST.getlist('autorizacion')[0], False)
        print("-----------------")
        estado = 'DEVUELTA'
        calv_acc = ''
        msg = {}
        clave_ya_regis = 'No'
        tipo_url = ''
        if datos_campos[0]["Tipo"] == 'Factura':
            tipo_url = 'factura'
        if datos_campos[0]["Tipo"] == 'Retencion':
            tipo_url = 'retencion'
        if datos_campos[0]["Tipo"] == 'Nota credito':
            tipo_url = 'credito'
        if datos_campos[0]["Tipo"] == 'Nota debito':
            tipo_url = 'debito'
        if datos_campos[0]["Tipo"] == 'Guia':
            tipo_url = 'guia'
        for ch in respuesta:
            if ch[0] == 'estado':
                estado = ch[1]
            if ch[0] == 'comprobantes' and estado == 'DEVUELTA':
                for aa in ch[1][0][0][1][0][0]:
                    msg[aa[0]] = aa[1]
                    print(aa[1])
                    if aa[1] == 'CLAVE ACCESO REGISTRADA':
                        clave_ya_regis = 'Si'
        if clave_ya_regis == 'Si':
            estado = 'RECIBIDA'
            #comprobar xml
        if estado == 'DEVUELTA':
            return(["mal", msg])
        if estado == 'RECIBIDA':
            time.sleep(5)
            respu_server = traer_docs_autori(request.POST.getlist('clave_acc')[0],False, request.POST.getlist('autorizacion')[0])
            if respu_server[0] == 'mal':
                return(["mal", respu_server[1]])
            if respu_server[0] == 'bien':
                num_doc = str(tabla[nombre_tabla][0][datos_infoTributaria[0]["estab"]]) + '-' + str(tabla[nombre_tabla][0][datos_infoTributaria[0]["ptoEmi"]]) + '-'+ str(tabla[nombre_tabla][0][datos_infoTributaria[0]["secuencial"]])
                fuente = datos_infoTributaria[0]["nombreComercial"]
                envio_correo(request.POST.getlist('clave_acc')[0], tabla[nombre_tabla][0][datos_campos[0]["Correo"]], datos_campos[0]["Tipo"], tipo_url, num_doc, fuente, Id_empresa)
                return(["bien", datos_campos[0]["ClaveAcceso"], request.POST.getlist('clave_acc')[0] ])
        return(["mal", ''])
    else:
        return(["Sin Autorizacion electronica", campo_elec, clave_acceso])

import smtplib, ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders

def envio_correo(claveAcceso, correo, tipo,tipo_url, num_doc , fuente, empresa):
    sender_email = "documentos@cerocodigo.net"
    receiver_email = correo
    password = "@Dmin1992"

    message = MIMEMultipart("alternative")
    message["Subject"] = "Documento Electrónico Emitido"
    message["From"] = sender_email
    message["To"] = receiver_email

    # Create the plain-text and HTML version of your message

    html = """\
    <html lang="en"><head>
        <title>Documento electronico</title>
        <meta http-equiv="Content-Type" content="text/html;" charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <!--[if !mso]>
          <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
        <![endif]-->
        <style type="text/css">
          /* CLIENT-SPECIFIC STYLES */
          
          #outlook a {
            padding: 0;
          }
          
          .ReadMsgBody {
            width: 100%;
          }
          
          .ExternalClass {
            width: 100%;
          }
          
          .ExternalClass,
          .ExternalClass p,
          .ExternalClass span,
          .ExternalClass font,
          .ExternalClass td,
          .ExternalClass div,
          .ExternalClass * {
            line-height: 100%;
          }
          
          body,
          table,
          td,
          a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
          }
          
          table,
          td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
          }
          
          img {
            -ms-interpolation-mode: bicubic;
          }
          /* RESET STYLES */
          
          body {
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
          }
          
          img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
          }
          
          table {
            border-collapse: collapse !important;
          }
          /* Remove margin on email wrapper in Android 4.4 KitKat */
          /* See more at: https://blog.jmwhite.co.uk/2015/09/19/revealing-why-emails-appear-off-centre-in-android-4-4-kitkat/ */
          
          div[style*="margin: 16px 0"] {
            margin: 0 !important;
            font-size: 100% !important;
          }
          /* Remove ios blue links */
          
          a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
          }
          /* Outline styles */
          
          @media only screen and (max-width: 599px) {
            .content-table {
              width: 100% !important;
            }
            img[class="img-max"] {
              width: 100% !important;
              height: auto !important;
            }
            table[class="mobile-button-wrap"] {
              margin: 0 auto;
              width: 100% !important;
            }
            a[class="mobile-button"] {
              width: 80% !important;
              padding: 8px !important;
              border: 0 !important;
            }
            .mobile-align-center {
              text-align: center !important;
              margin-right: auto;
              margin-left: auto;
            }
          }
        </style>
      </head>
      <body style="margin: 0 !important; padding: 0 !important;">
        
        <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Roboto', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;mso-hide:all;">CeroCodigo Documento electronico</div>
        
        
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: lightgrey;">
          <tbody><tr>
            <td bgcolor="lightgrey" align="center">
              <table style="min-width: 320px;" class="content-table" align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tbody><tr>
                  <td style="padding: 16px 16px 16px 16px;" align="center" valign="top">
                    <a href="http://outlinemail.co.uk">
                      <img style="display: block" src="http://www.cerocodigo.com/static/archivos/{{empresa}}/logo.png" width="200" height="28" border="0" alt="Outline Mail">

                    </a>
                  </td>
                </tr>
              </tbody></table>
            </td>
          </tr>
        </tbody></table>
        
        
        
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tbody><tr>
            <td style="padding: 10px 0 32px 0;" bgcolor="#ffffff" align="center">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tbody><tr>
                  <td align="center">
                    <table class="content-table" align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                      <tbody><tr>
                        <td style="padding: 0 16px 0 16px;" align="center" valign="top">
                          <!-- content -->
                          <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tbody>
                            
                            <tr>
                              <td align="center" style="padding: 0 0 16px 0; color: #424242; font-family: 'Roboto', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 28px;">Usted a recibido una documento electronico de <b>{{empresa}}</b></td>
                            </tr><tr>
                              <td align="center" style="padding: 0 0 16px 0; color: #424242; font-family: 'Roboto', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 28px;">{{tipo}}: <b>{{num_doc}}</b></td>
                            </tr>
                            <tr>
                              <td>
                                <!-- Button -->
                                <table align="center" border="0" cellspacing="0" cellpadding="0" width="100%">
                                  <tbody><tr>
                                    <td align="center">
                                      <table border="0" cellspacing="0" cellpadding="0">
                                        <tbody><tr>
                                          <td align="center">
                                            <a style="background-color: #03A9F4; border-top: 10px solid #03A9F4; border-right: 22px solid #03A9F4; border-bottom: 8px solid #03A9F4; border-left: 22px solid #03A9F4; display: inline-block; color: #fff; font-family: 'Roboto', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: normal; line-height: 24px; text-decoration: none; box-shadow: 1px 1px 1px rgba(0,0,0,0.5); text-transform: uppercase;" href="http://www.cerocodigo.com/{{tipo-url}}/{{clave}}" target="_blank">Ver documento</a>
                                          </td>
                                        </tr>
                                      </tbody></table>
                                    </td>
                                  </tr>
                                </tbody></table>
                                <!-- /Button -->
                              </td>
                            </tr>
                          </tbody></table>
                        </td>
                      </tr>
                    </tbody></table>
                  </td>
                </tr>
              </tbody></table>
            </td>
          </tr>
        </tbody></table>
        
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tbody><tr>
            <td align="center">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tbody><tr>
                  <td bgcolor="#546E7A" align="center">
                    <table class="content-table" align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                      <tbody><tr>
                        <td style="padding: 16px 16px 16px 16px;" align="center" valign="top">
                          <!-- content -->
                          <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tbody><tr>
                              <td style="color: #90A4AE; font-family: 'Roboto', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: normal; line-height: 21px;" align="center">Documento Generado en <a style="color: #CFD8DC; text-decoration: none;" href="www.cerocodigo.com">CeroCodigo.com</a>
                              </td>
                            </tr>
                         <tr>
                  <td style="padding: 16px 16px 16px 16px;" align="center" valign="top">
                    <a href="http://www.cerocodigo.com">
                      <img style="display: block" src="http://www.cerocodigo.com/static/assets/img/site-header-logo.png" width="200" height="28" border="0" alt="Outline Mail">
                    </a>
                  </td>
                </tr>   
                          </tbody></table>
                        </td>
                      </tr>
                    </tbody></table>
                  </td>
                </tr>
              </tbody></table>
            </td>
          </tr>
        </tbody></table>
        <!-- /footer full centre -->
      
    </body></html>
    """
    html  =html.replace("{{empresa}}", empresa)
    html  =html.replace("{{tipo}}", tipo)
    html  =html.replace("{{tipo-url}}", tipo_url)
    html  =html.replace("{{clave}}", claveAcceso)
    html  =html.replace("{{num_doc}}", num_doc)


    # Turn these into plain/html MIMEText objects
    part2 = MIMEText(html, "html")

    # Add HTML/plain-text parts to MIMEMultipart message
    # The email client will try to render the last part first
    message.attach(part2)

    filename = "media/archivos/" + str(claveAcceso) + ".xml"  # In same directory as script
    # Open PDF file in binary mode
    with open(filename, "rb") as attachment:
        # Add file as application/octet-stream
        # Email client can usually download this automatically as attachment
        part = MIMEBase("application", "octet-stream")
        part.set_payload(attachment.read())


    # Encode file in ASCII characters to send by email    
    encoders.encode_base64(part)

    # Add header as key/value pair to attachment part
    part.add_header("Content-Disposition", "attachment; filename="+ str(claveAcceso) + ".xml",)

    # Add attachment to message and convert message to string
    message.attach(part)


    # Create secure connection with server and send email
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.ipage.com", 465, context=context) as server:
        server.login(sender_email, password)
        server.sendmail(
            sender_email, receiver_email, message.as_string()
        )



def traer_docs_autori(Clave_doc, ambiente, xml):
        #Clave_doc = '0112201801092002805700120010010000003160000000011'
        parser = etree.XMLParser(recover=True)
        if ambiente == True:
            client = Client("https://cel.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl") # produccion
        else:
            client = Client("https://celcer.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl") # pruebas

       
        respuesta = client.service.autorizacionComprobante(Clave_doc)
        print("-----------------")
        respuestaBruta = respuesta[2]
        try:
            respuestaInterna = respuestaBruta[0]
        except IndexError:
            return('mal')

        respuestaInterna2 = respuestaInterna[0]
        #comprobante_xml = respuestaInterna2[4]

        for a in respuestaInterna2:
          print("----------a-------")
          print(str(a).encode('utf-8'))
          print("----------a-------")
        if respuestaInterna2[0] != 'AUTORIZADO':
          print("----------errores-------")
          msg = {} 
          for aa in respuestaInterna2[4][0][0]:
            print(str(aa).encode('utf-8'))
            msg[str(aa[0])] = ' : ' + str(aa[1])
          print("----------errores-------")
          return(['mal',msg])
        print("----------respuestaInterna2-------")
        
        comprobante_xml = ET.fromstring(respuestaInterna2[4])
      

        root = ET.Element("autorizacion")

        estado = ET.SubElement(root, "estado")
        print("estado")
        print(estado)

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
        #tree.write("static/archivos/" + Clave_doc +".xhtml")
        tree.write("media/archivos/" + Clave_doc +".xhtml")

        #tree = ET.parse("static/archivos/" + Clave_doc +".xhtml")
        tree = ET.parse("media/archivos/" + Clave_doc +".xhtml")
        
        # if you need the root element, use getroot
        root = tree.getroot()
        #tree.write("static/archivos/" + Clave_doc +".xml")
        tree.write("media/archivos/" + Clave_doc +".xml")              
        return(['bien',0])

def enviar_off_line(xml_firmadoStr, ambiente):
    print("antes de enviar")
    if ambiente == True:
        client = Client("https://cel.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl") # produccion
    else:
        client = Client("https://celcer.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl") # pruebas
    buf = StringIO()
   
    buf.write(xml_firmadoStr) 
    base64_str = base64.encodestring((buf.getvalue()).encode()).decode().replace('\n', '')
    #return client.service.validarComprobante(base64_str)
    #try:
    return client.service.validarComprobante(base64_str)
    #except suds.WebFault as detail:
      #enviar_off_line(xml_firmadoStr, ambiente)


def hacer_xml_factura(request, Id_empresa, tabla, pkcampo, clave_acceso, nombre_tabla):
    db = web.con_db.inter_registro(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    datos_campos = db.cmpelect_infoTributaria(pkcampo)
    print("datos_campos")
    print(datos_campos)
    print(datos_campos[0]["ambiente"])    # infoTributaria
    xml = '<factura id="comprobante" version="1.1.0">'
    xml = xml + '<infoTributaria>'
    xml = xml + '<ambiente>' + str(datos_campos[0]["ambiente"]) + '</ambiente>'
    xml = xml + '<tipoEmision>' + str(datos_campos[0]["tipoEmision"]) + '</tipoEmision>'
    xml = xml + '<razonSocial>' + str(datos_campos[0]["razonSocial"]) + '</razonSocial>'
    xml = xml + '<nombreComercial>' + str(datos_campos[0]["nombreComercial"]) + '</nombreComercial>'
    xml = xml + '<ruc>'+ str(datos_campos[0]["ruc"]) + '</ruc>'
    xml = xml + '<claveAcceso>'+ str(clave_acceso) + '</claveAcceso>'
    xml = xml + '<codDoc>' + str(datos_campos[0]["codDoc"]) + '</codDoc>'
    xml = xml + '<estab>' + str(tabla[nombre_tabla][0][datos_campos[0]["estab"]]) + '</estab>'
    xml = xml + '<ptoEmi>' + str(tabla[nombre_tabla][0][datos_campos[0]["ptoEmi"]]) + '</ptoEmi>'
    sec_val = 1000000000 + int(tabla[nombre_tabla][0][datos_campos[0]["secuencial"]])
    xml = xml + '<secuencial>' + str(sec_val)[1:] + '</secuencial>'
    
    xml = xml + '<dirMatriz>' + str(datos_campos[0]["dirMatriz"]) + '</dirMatriz>'
    xml = xml + '</infoTributaria>'

    # infoFactura
    datos_campos = db.cmpelect_infoFactura(pkcampo)


    xml = xml + '<infoFactura>'


    xml = xml + '<fechaEmision>' + str(regreso_fecha(tabla[nombre_tabla][0][datos_campos[0]["fechaEmision"]])) + '</fechaEmision>'
    xml = xml + '<dirEstablecimiento>' + str(datos_campos[0]["dirEstablecimiento"]) + '</dirEstablecimiento>'
    if datos_campos[0]["contribuyenteEspecial"] != "No":
        xml = xml + '<contribuyenteEspecial>' + str(datos_campos[0]["contribuyenteEspecial"]) + '</contribuyenteEspecial>'
    xml = xml + '<obligadoContabilidad>' + str(datos_campos[0]["obligadoContabilidad"]) + '</obligadoContabilidad>'
    xml = xml + '<tipoIdentificacionComprador>' + str(tabla[nombre_tabla][0][datos_campos[0]["tipoIdentificacionComprador"]]) + '</tipoIdentificacionComprador>'
    xml = xml + '<razonSocialComprador>' + str(tabla[nombre_tabla][0][datos_campos[0]["razonSocialComprador"]]) + '</razonSocialComprador>'
    xml = xml + '<identificacionComprador>' + str(tabla[nombre_tabla][0][datos_campos[0]["identificacionComprador"]]) + '</identificacionComprador>'
    xml = xml + '<totalSinImpuestos>' + str(tabla[nombre_tabla][0][datos_campos[0]["totalSinImpuestos"]]) + '</totalSinImpuestos>'
    xml = xml + '<totalDescuento>' + str(tabla[nombre_tabla][0][datos_campos[0]["totalDescuento"]]) + '</totalDescuento>'
    xml = xml + '<totalConImpuestos>'
    if datos_campos[0]["codigo1"] != "9":
        xml = xml + '<totalImpuesto>'
        xml = xml + '<codigo>' + str(datos_campos[0]["codigo1"]) + '</codigo>'
        xml = xml + '<codigoPorcentaje>' + str(datos_campos[0]["codigoPorcentaje1"]) + '</codigoPorcentaje>'
        xml = xml + '<descuentoAdicional>' + str(tabla[nombre_tabla][0][datos_campos[0]["descuento_adicional1"]]) + '</descuentoAdicional>'
        xml = xml + '<baseImponible>' + str(tabla[nombre_tabla][0][datos_campos[0]["baseImponible1"]]) + '</baseImponible>'
        xml = xml + '<valor>' + str(tabla[nombre_tabla][0][datos_campos[0]["valor1"]]) + '</valor>'
        xml = xml + '</totalImpuesto>'
    if datos_campos[0]["codigo2"] != "9":
        xml = xml + '<totalImpuesto>'
        xml = xml + '<codigo>' + str(datos_campos[0]["codigo2"]) + '</codigo>'
        xml = xml + '<codigoPorcentaje>' + str(datos_campos[0]["codigoPorcentaje2"]) + '</codigoPorcentaje>'
        xml = xml + '<descuentoAdicional>' + str(tabla[nombre_tabla][0][datos_campos[0]["descuento_adicional2"]]) + '</descuentoAdicional>'
        xml = xml + '<baseImponible>' + str(tabla[nombre_tabla][0][datos_campos[0]["baseImponible2"]]) + '</baseImponible>'
        xml = xml + '<valor>' + str(tabla[nombre_tabla][0][datos_campos[0]["valor2"]]) + '</valor>'
        xml = xml + '</totalImpuesto>'
    if datos_campos[0]["codigo3"] != "9":
        xml = xml + '<totalImpuesto>'
        xml = xml + '<codigo>' + str(datos_campos[0]["codigo3"]) + '</codigo>'
        xml = xml + '<codigoPorcentaje>' + str(datos_campos[0]["codigoPorcentaje3"]) + '</codigoPorcentaje>'
        xml = xml + '<descuentoAdicional>' + str(tabla[nombre_tabla][0][datos_campos[0]["descuento_adicional3"]]) + '</descuentoAdicional>'
        xml = xml + '<baseImponible>' + str(tabla[nombre_tabla][0][datos_campos[0]["baseImponible3"]]) + '</baseImponible>'
        xml = xml + '<valor>' + str(tabla[nombre_tabla][0][datos_campos[0]["valor3"]]) + '</valor>'
        xml = xml + '</totalImpuesto>'
    xml = xml + '</totalConImpuestos>'

    
    xml = xml + '<propina>' + str(tabla[nombre_tabla][0][datos_campos[0]["propina"]]) + '</propina>'
    xml = xml + '<importeTotal>' + str(tabla[nombre_tabla][0][datos_campos[0]["importeTotal"]]) + '</importeTotal>'
    xml = xml + '<moneda>' + str(datos_campos[0]["moneda"]) + '</moneda>'

    xml = xml + '<pagos>'
    xml = xml + '<pago>'
    xml = xml + '<formaPago>' + str(tabla[nombre_tabla][0][datos_campos[0]["formaPago"]]) + '</formaPago>'
    xml = xml + '<total>' + str(tabla[nombre_tabla][0][datos_campos[0]["total"]]) + '</total>'
    xml = xml + '<plazo>' + str(tabla[nombre_tabla][0][datos_campos[0]["plazo"]]) + '</plazo>'
    xml = xml + '<unidadTiempo>' + str(tabla[nombre_tabla][0][datos_campos[0]["unidadTiempo"]]) + '</unidadTiempo>'
    xml = xml + '</pago>'
    xml = xml + '</pagos>'
    xml = xml + '</infoFactura>'

    #detalles
    datos_campos = db.cmpelect_detalles(pkcampo)

    xml = xml + '<detalles>'
    for linea in tabla[nombre_tabla +"Detalle"]:
        if float(linea[datos_campos[0]["cantidad"]]) > 0:
            xml = xml + '<detalle>'
            xml = xml + '<codigoPrincipal>' + str(linea[datos_campos[0]["codigoPrincipal"]]) + '</codigoPrincipal>'
            xml = xml + '<codigoAuxiliar>' + str(linea[datos_campos[0]["codigoAuxiliar"]]) + '</codigoAuxiliar>'
            xml = xml + '<descripcion>' + str(linea[datos_campos[0]["descripcion"]]) + '</descripcion>'
            xml = xml + '<cantidad>' + str(linea[datos_campos[0]["cantidad"]]) + '</cantidad>'
            xml = xml + '<precioUnitario>' + str(linea[datos_campos[0]["precioUnitario"]]) + '</precioUnitario>'
            xml = xml + '<descuento>' + str(linea[datos_campos[0]["descuento"]]) + '</descuento>'
            xml = xml + '<precioTotalSinImpuesto>' + str(linea[datos_campos[0]["precioTotalSinImpuesto"]]) + '</precioTotalSinImpuesto>'
            xml = xml + '<impuestos>'
            xml = xml + '<impuesto>'
            xml = xml + '<codigo>' + str(linea[datos_campos[0]["codigo"]]) + '</codigo>'
            xml = xml + '<codigoPorcentaje>' + str(linea[datos_campos[0]["codigoPorcentaje"]]) + '</codigoPorcentaje>'
            xml = xml + '<tarifa>' + str(linea[datos_campos[0]["tarifa"]]) + '</tarifa>'
            xml = xml + '<baseImponible>' + str(linea[datos_campos[0]["baseImponible"]]) + '</baseImponible>'
            xml = xml + '<valor>' + str(linea[datos_campos[0]["valor"]]) + '</valor>'
            xml = xml + '</impuesto>'
            xml = xml + '</impuestos>'
            xml = xml + '</detalle>'
    xml = xml + '</detalles>'


    #info adicional
    datos_campos = db.cmpelect_infoadicional(pkcampo)
    xml_adicional  = '<infoAdicional>'

    for addy in datos_campos:
        if tabla[nombre_tabla][0][addy["valor"]] != '':
            xml_adicional = xml_adicional + '<campoAdicional nombre="' + str(addy["nombre"]) + '">' + str(tabla[nombre_tabla][0][addy["valor"]]) + '</campoAdicional>'
        
    if xml_adicional != '<infoAdicional>':
        return (xml + xml_adicional + '</infoAdicional></factura>')
    else:
        return (xml + '</factura>')


@csrf_exempt
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

@csrf_exempt
def xmlload(request):
    xmlup = request.POST.getlist('results') 
    user_id = request.POST.getlist('user_id')
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
        for ii in doc_array:
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
                        print(str_pendientes)
                        print(i['sentencia'])
                        claves_ingresadas = db_cliente.devolver_ingresados(i['sentencia'], str_pendientes)
                        print(claves_ingresadas)
                        str_claves_ingresadas = ""
                        for ii in claves_ingresadas:
                            str_claves_ingresadas = str_claves_ingresadas + "'" + ii['autorizacion'] + "',"
                        str_claves_ingresadas = str_claves_ingresadas[:-1]
                        print(str_claves_ingresadas)
                        db.actualizar_docs(str_claves_ingresadas, 'r_',  id_empresa)

def val_doc(doc, id, tipo):
    try:
        factura = {}
        numeros = str(doc[1]).split("-")
        factura.update({'estab':numeros[0]})    
        factura.update({'punto':numeros[1]})
        factura.update({'numero':numeros[2]})
        factura.update({'emisor_id':doc[2]})
        factura.update({'emisor_razon':doc[3]})
        factura.update({'fecha':devolver_fecha(doc[4])})
        factura.update({'recp_id':doc[8]})
        factura.update({'autorizacion':doc[9]})
        factura.update({'clave':doc[10]})
        factura.update({'tipo': tipo})
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

def Factura(Clave_doc):
        parser = etree.XMLParser(recover=True)

        if Clave_doc[23] == 2:
            client = Client("https://cel.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl") # produccion
        else:
            client = Client("https://celcer.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl") # pruebas

        respuesta = client.service.autorizacionComprobante(Clave_doc)
        respuestaBruta = respuesta[2]
        try:
            respuestaInterna = respuestaBruta[0]
        except IndexError:
            context = {'Clave_doc': Clave_doc}
            return context
        respuestaInterna2 = respuestaInterna[0]
        #comprobante_xml = respuestaInterna2[4]   
        comprobante_xml = ET.fromstring(respuestaInterna2[4])

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
        tree.write("media/archivos/" + Clave_doc +".xhtml")
        tree = ET.parse("media/archivos/" + Clave_doc +".xhtml")
        
        # if you need the root element, use getroot
        root = tree.getroot()
        tree.write("media/archivos/" + Clave_doc +".xml")

        val_fijos =  {'fechaAuto' : "", 'Codigo_int' : "", 'contribuyenteEspecial' : "", 'Forma_pago' : "", 'numeroAutorizacion' : respuestaInterna2[1], 'fechaEmision' : " ",    'dirEstablecimiento' : " ",    'obligadoContabilidad' : " ",    'tipoIdentificacionComprador' : " ",    'razonSocialComprador' : " ",    'identificacionComprador' : " ",    'totalSinImpuestos' : " ",    'totalDescuento' : " ",    'totalConImpuestos' : " ",    'propina' : " ",    'importeTotal' : " ",    'moneda' : " ",    'ambiente' : " ",    'tipoEmision' : " ",    'razonSocial' : " ",    'nombreComercial' : " ",    'ruc' : " ",    'claveAcceso' : " ",    'codDoc' : " ",    'estab' : " ",    'ptoEmi' : " ",    'secuencial' : " ",    'dirMatriz' : " ",    'formaPago' : " ",    'total' : " ",    'plazo' : " ",    'unidadTiempo' : " "}
        val_detalles = {'codigoPrincipal': [], 'codigoAuxiliar': [], 'descripcion': [], 'cantidad': [], 'precioUnitario': [], 'descuento': [], 'precioTotalSinImpuesto': [] , 'precioSinSubsidio': [] }
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
                    
        #Receptor = usuarios.objects.get(receptor_id=val_fijos['ruc'] )
        val_fijos['Codigo_int'] = val_fijos['ruc']
        context = {'val_fijos': val_fijos, 'html_Datelle': html_Datelle, 'html_Adicional': html_Adicional, 'Val_Totales': Val_Totales, 'JVcodigoPrincipal' : JVcodigoPrincipal, 'JVcodigoAuxiliar' : JVcodigoAuxiliar, 'JVdescripcion' : JVdescripcion, 'JVcantidad' : JVcantidad, 'JVprecioUnitario' : JVprecioUnitario, 'JVdescuento' : JVdescuento, 'JVprecioTotalSinImpuesto' : JVprecioTotalSinImpuesto, 'JVinfoAdicional_nombre' : JVinfoAdicional_nombre, 'JVinfoAdicional_valor' : JVinfoAdicional_valor  }
        return context

def Retencion(Clave_doc):
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
        tree.write("media/archivos/" + Clave_doc +".xhtml")

        tree = ET.parse("media/archivos/" + Clave_doc +".xhtml")
        root = tree.getroot()
        
        # ...manipulate tree...
               
        tree.write("media/archivos/" + Clave_doc +".xml")
        
     
        #comprobante_xml = ElementTree.XML(comprobante_xml[38:])        
        treecomprobante_xml  = ET.ElementTree(comprobante_xml)

        #xml_comprobante = ET.fromstring(comprobante_xml)
        #treecomprobante_xml.write("edocs/archivos/bruto_" + Clave_doc +".xml")
        treecomprobante_xml.write("media/archivos/bruto_" + Clave_doc +".xml")

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



            html_Datelle += "<td>" + val_impuestos['fechaEmisionDocSustento'][i] + "<br></td>"
            JVFecha.append(val_impuestos['fechaEmisionDocSustento'][i])
            JVEjercicio.append(str(val_impuestos['fechaEmisionDocSustento'][i][3:]))
            
            html_Datelle += "<td>" + val_impuestos['fechaEmisionDocSustento'][i][3:] + "<br></td>"
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
        tree.write("media/archivos/" + Clave_doc +".xhtml")

        tree = ET.parse("media/archivos/" + Clave_doc +".xhtml")
        root = tree.getroot()
        
        # ...manipulate tree...
               
        tree.write("media/archivos/" + Clave_doc +".xml")
        
     
        #comprobante_xml = ElementTree.XML(comprobante_xml[38:])        
        treecomprobante_xml  = ET.ElementTree(comprobante_xml)

        #xml_comprobante = ET.fromstring(comprobante_xml)
        #treecomprobante_xml.write("edocs/archivos/bruto_" + Clave_doc +".xml")
        treecomprobante_xml.write("media/archivos/bruto_" + Clave_doc +".xml")

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

