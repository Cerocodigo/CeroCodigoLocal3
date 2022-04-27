
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
import web.firmador
import web.XmlXadesBesSignXml
import sys
 
import datetime
import os
import os.path
import xades
import xmlsig

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
    pasa_auto = True
    if(datos_campos[0]["Cond_campo"] != ""):
        if(tabla[nombre_tabla][0][datos_campos[0]["Cond_campo"]] != datos_campos[0]["Cond_valor"]):
            pasa_auto = False
    clave_acceso = '0'
    campo_elec = datos_campos[0]["ClaveAcceso"]
    if(pasa_auto == True):
        clave_acceso = hacer_clave(request, Id_empresa, tabla, pkcampo, datos_campos[0]["Tipo"], nombre_tabla)
        if  datos_campos[0]["Tipo"] == "Factura":
            xmlbrutoSTR = hacer_xml_factura(request, Id_empresa, tabla, pkcampo, clave_acceso, nombre_tabla)
        if  datos_campos[0]["Tipo"] == "Retencion":
            xmlbrutoSTR = hacer_xml_retencion(request, Id_empresa, tabla, pkcampo, clave_acceso, nombre_tabla)
        if  datos_campos[0]["Tipo"] == "Nota debito":
            xmlbrutoSTR = hacer_xml_notaDebito(request, Id_empresa, tabla, pkcampo, clave_acceso, nombre_tabla)
        if  datos_campos[0]["Tipo"] == "Guia":
            xmlbrutoSTR = hacer_xml_guia(request, Id_empresa,tabla, pkcampo, clave_acceso, nombre_tabla)
        if  datos_campos[0]["Tipo"] == "Nota credito":
            xmlbrutoSTR = hacer_xml_notaCredito(request, Id_empresa, tabla, pkcampo, clave_acceso, nombre_tabla)

        xml_bruto = ET.fromstring(xmlbrutoSTR)
        tree = ET.ElementTree(xml_bruto)

        tree.write("static/archivos/"+str(Id_empresa)+ "/temp" + clave_acceso +".xml")
        dirpath = os.getcwd()
        dirXml = dirpath + '\\static\\archivos\\'+str(Id_empresa)+ '\\temp' + str(clave_acceso) +'.xml'
        dirCert = dirpath + '\\static\\certificado\\'+str(Id_empresa)+ '\\' + datos_campos[0]["Certificado"]
        claveCert = datos_campos[0]["Clave"]
        dirXmlFrm = dirpath + '\\static\\archivos\\'+str(Id_empresa)+ '\\frm' + str(clave_acceso) 


        intento = web.XmlXadesBesSignXml.main(dirXml, dirCert, claveCert, clave_acceso, dirXmlFrm)
        firma = open(dirXmlFrm +'.xml', 'rb').read()
   
        root = ET.parse(dirXmlFrm +'.xml').getroot()

        print("----")
        #print(firma.decode(encoding='UTF-8',errors='strict'))
        print("----")
        if  datos_campos[0]["Tipo"] == "Factura":
            xmlFrmSTR = xmlbrutoSTR.replace("</factura>", firma.decode(encoding='UTF-8',errors='strict') +"</factura>")
        if  datos_campos[0]["Tipo"] == "Retencion":
            xmlFrmSTR = xmlbrutoSTR.replace("</factura>", firma +"</factura>")
        if  datos_campos[0]["Tipo"] == "Nota debito":
            xmlFrmSTR = xmlbrutoSTR.replace("</factura>", firma +"</factura>")
        if  datos_campos[0]["Tipo"] == "Guia":
            xmlFrmSTR = xmlbrutoSTR.replace("</factura>", firma +"</factura>")
        if  datos_campos[0]["Tipo"] == "Nota credito":
            xmlFrmSTR = xmlbrutoSTR.replace("</factura>", firma +"</factura>")


        print("-------xx---")
        #print(xmlFrmSTR.encode("utf-8"))
        print("-------xx---")
        open( "static/archivos/"+str(Id_empresa)+ "/" + clave_acceso +".xml", 'wb').write(xmlFrmSTR.encode("utf-8"))


        if clave_acceso[23] == 1:
            ambiente = False
        else:
            ambiente = True
        if enviar_off_line(xmlFrmSTR.encode("utf-8"), ambiente) == True:
            print("paso")
        else:
            return([0, campo_elec, clave_acceso])

        print("xml_firmado")
        print(xml_firmadoStr)


    else:
        return(["Sin Autorizacion electronica", campo_elec, clave_acceso])

import base64

def enviar_off_line(xml_firmadoStr, ambiente):

    if ambiente == True:
        #client = Client("https://celcer.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl") # pruebas
        client = Client("https://celcer.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl") # pruebas
    else:
        #client = Client("https://cel.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl") # produccion
        client = Client("https://cel.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl") # produccion
    
    dirpath = os.getcwd()
    dirXml = dirpath + '\\static\\archivos\\nlubkov\\xxx.xml'

    firma = open( dirXml, 'rb').read()
    print("------------------") 
    print(firma)
    print("------------------")  

    #test = str.encode('<?xml version="1.0" encoding="utf-8"?><factura version="1.1.0" id="comprobante"><infoTributaria><ambiente>2</ambiente><tipoEmision>1</tipoEmision><razonSocial>Lubkov Guzman Nicolas Lubkov</razonSocial><nombreComercial>Cero Codigo</nombreComercial><ruc>0920028057001</ruc><claveAcceso>2105201901092002805700120010010000003280000000010</claveAcceso><codDoc>01</codDoc><estab>001</estab><ptoEmi>001</ptoEmi><secuencial>000000328</secuencial><dirMatriz>Bálsamos 813 entre Guayacanes e Higueras</dirMatriz></infoTributaria><infoFactura><fechaEmision>21/05/2019</fechaEmision><dirEstablecimiento>Bálsamos 813 entre Guayacanes e Higueras</dirEstablecimiento><obligadoContabilidad>NO</obligadoContabilidad><tipoIdentificacionComprador>04</tipoIdentificacionComprador><razonSocialComprador>nicolas lubkov</razonSocialComprador><identificacionComprador>0920028057001</identificacionComprador><totalSinImpuestos>1.00</totalSinImpuestos><totalDescuento>0.00</totalDescuento><totalConImpuestos><totalImpuesto><codigo>2</codigo><codigoPorcentaje>0</codigoPorcentaje><descuentoAdicional>0.00</descuentoAdicional><baseImponible>0.00</baseImponible><valor>0</valor></totalImpuesto><totalImpuesto><codigo>2</codigo><codigoPorcentaje>2</codigoPorcentaje><descuentoAdicional>0.00</descuentoAdicional><baseImponible>1.00</baseImponible><valor>0.12</valor></totalImpuesto></totalConImpuestos><propina>0</propina><importeTotal>1.12</importeTotal><moneda>DOLAR</moneda><pagos><pago><formaPago>20</formaPago><total>1.12</total><plazo>1</plazo><unidadTiempo>dias</unidadTiempo></pago></pagos></infoFactura><detalles><detalle><codigoPrincipal>01</codigoPrincipal><codigoAuxiliar>01</codigoAuxiliar><descripcion>Hora Soporte</descripcion><cantidad>1.00</cantidad><precioUnitario>1.000000</precioUnitario><descuento>0.00</descuento><precioTotalSinImpuesto>1.00000</precioTotalSinImpuesto><impuestos><impuesto><codigo>2</codigo><codigoPorcentaje>2</codigoPorcentaje><tarifa>12</tarifa><baseImponible>1.00000</baseImponible><valor>0.12</valor></impuesto></impuestos></detalle></detalles><infoAdicional><campoAdicional nombre="Correo">nlubkov@gmail.com</campoAdicional></infoAdicional><ds:Signature Id="Signature255899" xmlns:ds="http://www.w3.org/2000/09/xmldsig#"><ds:SignedInfo Id="Signature-SignedInfo255899"><ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315" /><ds:SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1" /><ds:Reference Id="SignedPropertiesID255899" URI="#Signature255899-SignedProperties255899" Type="http://uri.etsi.org/01903#SignedProperties"><ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1" /><ds:DigestValue>IysSEvAj8ToS7GzrCdPIXrd6kzM=</ds:DigestValue></ds:Reference><ds:Reference URI="#Certificate255899"><ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1" /><ds:DigestValue>01wbzhKooZe0vW0HO0UIlEjYNT4=</ds:DigestValue></ds:Reference><ds:Reference Id="Reference-ID-255899" URI="#comprobante"><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature" /></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1" /><ds:DigestValue>YDMV3CdhiTbaxOGhY94sPxWxUKs=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue Id="SignatureValue573790">dX4e16ojR0xKzX8sS04xSN9p31Mg+62OXRmDoUAgl6s7djHuf6jyI6/9YEi862Kfn+PLe2WvS8akBeycb6n/fhzvXwy6fJMlojg0J57mwfIKF1bE1L36Vn3rM8D6hxFYS7hkEfQ2hE9+IKE5iTcEDP9lsWjshyX77H9Ypo9TwLtUGWZ5fT6IHa0CD5XwxgSXHarrpvfUnUweFHl9bIWuu+C0yn+ZeCmUZP1gImhK9XxfyoW1bzHyENiejgJACPbi23aPLdVYixKAQ46PGfMmr3QYG5c33l5jptq9xezTazNaaGMyx0eU0jd8WPtI1EDFDRxxporX2VmJU6l23i67UQ==</ds:SignatureValue><ds:KeyInfo Id="Certificate255899"><ds:X509Data><ds:X509Certificate>MIIJhTCCCG2gAwIBAgIEVNOsIjANBgkqhkiG9w0BAQsFADCBkzELMAkGA1UEBhMCRUMxGzAZBgNVBAoTElNFQ1VSSVRZIERBVEEgUy5BLjEwMC4GA1UECxMnRU5USURBRCBERSBDRVJUSUZJQ0FDSU9OIERFIElORk9STUFDSU9OMTUwMwYDVQQDEyxBVVRPUklEQUQgREUgQ0VSVElGSUNBQ0lPTiBTVUIgU0VDVVJJVFkgREFUQTAeFw0xOTAxMDkxNTQ3MjBaFw0yMDAxMDkxNjE3MjBaMIGbMQswCQYDVQQGEwJFQzEbMBkGA1UEChMSU0VDVVJJVFkgREFUQSBTLkEuMTAwLgYDVQQLEydFTlRJREFEIERFIENFUlRJRklDQUNJT04gREUgSU5GT1JNQUNJT04xPTATBgNVBAUTDDA5MDExOTEwNDMxNzAmBgNVBAMUH05JQ09MQVOgQUxFSkFORFJPIExVQktPViBHVVpNQU4wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCygdggaZbyPekZZb1QepY7ILfjb5vyDRWnqx0z11jdSuGYJ9Q1tzkTVl3jZHDeHEZGHl1Zzats28mbsBU+IWhqX7kPYPc/HI8NzN/d3Z1sYuDxswVEUTJXlrqVUiN3VrxkZrGfdbUQ45Ai8eKf45GfF+Te1e0kb+aMx81ITGvwwNnp/ysca58OB+5adxN3jR1Ef8z7qj4B/r9CsF2Qsd/mf+r19N3Zs+AEPtyopwJoeojWvUMSn5cKUovHjjIliu4bYNGJWVGf8nVUIH1I0QQZwQzVm/E8Ndq6apB1Em3KBRDNIW1cNY6rAutW5arx3ARwi9Tmg58EB0QXqs+CLxtpAgMBAAGjggXVMIIF0TALBgNVHQ8EBAMCBeAwWQYIKwYBBQUHAQEETTBLMEkGCCsGAQUFBzABhj1odHRwOi8vb2NzcGd3LnNlY3VyaXR5ZGF0YS5uZXQuZWMvZWpiY2EvcHVibGljd2ViL3N0YXR1cy9vY3NwMIHEBgNVHSAEgbwwgbkwPAYKKwYBBAGCpnICBzAuMCwGCCsGAQUFBwICMCAaHkNlcnRpZmljYWRvIGRlIFBlcnNvbmEgTmF0dXJhbDB5BgorBgEEAYKmcgIBMGswaQYIKwYBBQUHAgEWXWh0dHBzOi8vd3d3LnNlY3VyaXR5ZGF0YS5uZXQuZWMvbGV5ZXNfbm9ybWF0aXZhcy9Qb2xpdGljYXMgZGUgQ2VydGlmaWNhZG8gUGVyc29uYSBOYXR1cmFsLnBkZjAaBgorBgEEAYKmcgMBBAwTCjA5MjAwMjgwNTcwIgYKKwYBBAGCpnIDAgQUExJOSUNPTEFTwqBBTEVKQU5EUk8wFgYKKwYBBAGCpnIDAwQIEwZMVUJLT1YwFgYKKwYBBAGCpnIDBAQIEwZHVVpNQU4wUgYKKwYBBAGCpnIDBwREE0JHVUFZQVPCoC/CoEdVQVlBUVVJTMKgL8KgVEFSUVVJwqAvwqBQQURSRcKgU09MQU5PwqAxODIxwqBZwqBDQVJDSEkwHAYKKwYBBAGCpnIDCAQOEww1OTM5OTE1NTQyNzYwGQYKKwYBBAGCpnIDCQQLEwlHVUFZQVFVSUwwFwYKKwYBBAGCpnIDDAQJEwdFQ1VBRE9SMB0GCisGAQQBgqZyAwsEDxMNMDkyMDAyODA1NzAwMTAfBgorBgEEAYKmcgMgBBETDzAwMTAwMDAwMDAwMDY1NDATBgorBgEEAYKmcgMhBAUTA1BGWDAjBgNVHREEHDAagRhjK25pY29sYXNsdWJrb3ZAZGF0aWwuY28wggJ7BgNVHR8EggJyMIICbjCCAmqgggJmoIICYoY9aHR0cDovL29jc3Bndy5zZWN1cml0eWRhdGEubmV0LmVjL2VqYmNhL3B1YmxpY3dlYi9zdGF0dXMvb2NzcIaB1WxkYXA6Ly9kaXJlY3Quc2VjdXJpdHlkYXRhLm5ldC5lYy9jbj1DUkwzMjQsY249QVVUT1JJREFEJTIwREUlMjBDRVJUSUZJQ0FDSU9OJTIwU1VCJTIwU0VDVVJJVFklMjBEQVRBLG91PUVOVElEQUQlMjBERSUyMENFUlRJRklDQUNJT04lMjBERSUyMElORk9STUFDSU9OLG89U0VDVVJJVFklMjBEQVRBJTIwUy5BLixjPUVDP2NlcnRpZmljYXRlUmV2b2NhdGlvbkxpc3Q/YmFzZYaBnmh0dHBzOi8vZGlyZWN0LnNlY3VyaXR5ZGF0YS5uZXQuZWMvfmNybC9hdXRvcmlkYWRfZGVfY2VydGlmaWNhY2lvbl9zdWJfc2VjdXJpdHlfZGF0YV9lbnRpZGFkX2RlX2NlcnRpZmljYWNpb25fZGVfaW5mb3JtYWNpb25fY3VyaXR5X2RhdGFfcy5hLl9jX2VjX2NybGZpbGUuY3JspIGnMIGkMQswCQYDVQQGEwJFQzEbMBkGA1UEChMSU0VDVVJJVFkgREFUQSBTLkEuMTAwLgYDVQQLEydFTlRJREFEIERFIENFUlRJRklDQUNJT04gREUgSU5GT1JNQUNJT04xNTAzBgNVBAMTLEFVVE9SSURBRCBERSBDRVJUSUZJQ0FDSU9OIFNVQiBTRUNVUklUWSBEQVRBMQ8wDQYDVQQDEwZDUkwzMjQwKwYDVR0QBCQwIoAPMjAxOTAxMDkxNTQ3MjBagQ8yMDIwMDEwOTE2MTcyMFowHwYDVR0jBBgwFoAU9y9M4HXnYqN4llsGti5xO8xsP5AwHQYDVR0OBBYEFEPpdWD5KuC37thXq72DqlYapNQ8MAkGA1UdEwQCMAAwGQYJKoZIhvZ9B0EABAwwChsEVjguMQMCA6gwDQYJKoZIhvcNAQELBQADggEBAAP7KusP58sc/yN6kx4Ib0Cm59/J/bP6n2pTh9CeR/OGk/2fJF5RdIP9+6XDJC7kNycEQqRCGigRoSUSEj+RoemI0e3aRfiQSfrj0qZOpk/9DCZ2krNpyDja9nrVMoJtL35YIGtpCMPkEkSWG0k+NFWAKhemkgYv0qsT4KsbtqzTe2eH3dmBung5NKF5rj0fZ5sbLCbJjSRZty8ewwrcV3eRHacgnPCwhyBPTGQSobtC5CuGoaSsMrqzC1NJFzcQ3Z9/YNxsF4HQxTEgGjVtmmWY228XK7oqnNj4/ZuadvbiadkIXxCBzWso2cMFrgecuy01GC++t/yGOJbQG+hRfIY=</ds:X509Certificate></ds:X509Data><ds:KeyValue><ds:RSAKeyValue><ds:Modulus>soHYIGmW8j3pGWW9UHqWOyC342+b8g0Vp6sdM9dY3UrhmCfUNbc5E1Zd42Rw3hxGRh5dWc2rbNvJm7AVPiFoal+5D2D3PxyPDczf3d2dbGLg8bMFRFEyV5a6lVIjd1a8ZGaxn3W1EOOQIvHin+ORnxfk3tXtJG/mjMfNSExr8MDZ6f8rHGufDgfuWncTd40dRH/M+6o+Af6/QrBdkLHf5n/q9fTd2bPgBD7cqKcCaHqI1r1DEp+XClKLx44yJYruG2DRiVlRn/J1VCB9SNEEGcEM1ZvxPDXaumqQdRJtygUQzSFtXDWOqwLrVuWq8dwEcIvU5oOfBAdEF6rPgi8baQ==</ds:Modulus><ds:Exponent>AQAB</ds:Exponent></ds:RSAKeyValue></ds:KeyValue></ds:KeyInfo><ds:Object Id="Signature255899-Object255899"><etsi:QualifyingProperties Target="#Signature255899" xmlns:etsi="http://uri.etsi.org/01903/v1.3.2#"><etsi:SignedProperties Id="Signature255899-SignedProperties255899"><etsi:SignedSignatureProperties><etsi:SigningTime>2019-05-21T08:57:26</etsi:SigningTime><etsi:SigningCertificate><etsi:Cert><etsi:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1" /><ds:DigestValue>qHdypI+0uDMrhLHvouFHXCOSMg0=</ds:DigestValue></etsi:CertDigest><etsi:IssuerSerial><ds:X509IssuerName>CN=AUTORIDAD DE CERTIFICACION SUB SECURITY DATA, OU=ENTIDAD DE CERTIFICACION DE INFORMACION, O=SECURITY DATA S.A., C=EC</ds:X509IssuerName><ds:X509SerialNumber>1423158306</ds:X509SerialNumber></etsi:IssuerSerial></etsi:Cert></etsi:SigningCertificate></etsi:SignedSignatureProperties><etsi:SignedDataObjectProperties><etsi:DataObjectFormat ObjectReference="#Reference-ID-255899"><etsi:Description>contenido comprobante</etsi:Description><etsi:MimeType>text/xml</etsi:MimeType></etsi:DataObjectFormat></etsi:SignedDataObjectProperties></etsi:SignedProperties></etsi:QualifyingProperties></ds:Object></ds:Signature></factura>')
    test = '<?xml version="1.0" encoding="utf-8"?><factura version="1.1.0" id="comprobante"><infoTributaria><ambiente>2</ambiente><tipoEmision>1</tipoEmision><razonSocial>Lubkov Guzman Nicolas Lubkov</razonSocial><nombreComercial>Cero Codigo</nombreComercial><ruc>0920028057001</ruc><claveAcceso>2105201901092002805700120010010000003280000000010</claveAcceso><codDoc>01</codDoc><estab>001</estab><ptoEmi>001</ptoEmi><secuencial>000000328</secuencial><dirMatriz>Bálsamos 813 entre Guayacanes e Higueras</dirMatriz></infoTributaria><infoFactura><fechaEmision>21/05/2019</fechaEmision><dirEstablecimiento>Bálsamos 813 entre Guayacanes e Higueras</dirEstablecimiento><obligadoContabilidad>NO</obligadoContabilidad><tipoIdentificacionComprador>04</tipoIdentificacionComprador><razonSocialComprador>nicolas lubkov</razonSocialComprador><identificacionComprador>0920028057001</identificacionComprador><totalSinImpuestos>1.00</totalSinImpuestos><totalDescuento>0.00</totalDescuento><totalConImpuestos><totalImpuesto><codigo>2</codigo><codigoPorcentaje>0</codigoPorcentaje><descuentoAdicional>0.00</descuentoAdicional><baseImponible>0.00</baseImponible><valor>0</valor></totalImpuesto><totalImpuesto><codigo>2</codigo><codigoPorcentaje>2</codigoPorcentaje><descuentoAdicional>0.00</descuentoAdicional><baseImponible>1.00</baseImponible><valor>0.12</valor></totalImpuesto></totalConImpuestos><propina>0</propina><importeTotal>1.12</importeTotal><moneda>DOLAR</moneda><pagos><pago><formaPago>20</formaPago><total>1.12</total><plazo>1</plazo><unidadTiempo>dias</unidadTiempo></pago></pagos></infoFactura><detalles><detalle><codigoPrincipal>01</codigoPrincipal><codigoAuxiliar>01</codigoAuxiliar><descripcion>Hora Soporte</descripcion><cantidad>1.00</cantidad><precioUnitario>1.000000</precioUnitario><descuento>0.00</descuento><precioTotalSinImpuesto>1.00000</precioTotalSinImpuesto><impuestos><impuesto><codigo>2</codigo><codigoPorcentaje>2</codigoPorcentaje><tarifa>12</tarifa><baseImponible>1.00000</baseImponible><valor>0.12</valor></impuesto></impuestos></detalle></detalles><infoAdicional><campoAdicional nombre="Correo">nlubkov@gmail.com</campoAdicional></infoAdicional><ds:Signature Id="Signature255899" xmlns:ds="http://www.w3.org/2000/09/xmldsig#"><ds:SignedInfo Id="Signature-SignedInfo255899"><ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315" /><ds:SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1" /><ds:Reference Id="SignedPropertiesID255899" URI="#Signature255899-SignedProperties255899" Type="http://uri.etsi.org/01903#SignedProperties"><ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1" /><ds:DigestValue>IysSEvAj8ToS7GzrCdPIXrd6kzM=</ds:DigestValue></ds:Reference><ds:Reference URI="#Certificate255899"><ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1" /><ds:DigestValue>01wbzhKooZe0vW0HO0UIlEjYNT4=</ds:DigestValue></ds:Reference><ds:Reference Id="Reference-ID-255899" URI="#comprobante"><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature" /></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1" /><ds:DigestValue>YDMV3CdhiTbaxOGhY94sPxWxUKs=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue Id="SignatureValue573790">dX4e16ojR0xKzX8sS04xSN9p31Mg+62OXRmDoUAgl6s7djHuf6jyI6/9YEi862Kfn+PLe2WvS8akBeycb6n/fhzvXwy6fJMlojg0J57mwfIKF1bE1L36Vn3rM8D6hxFYS7hkEfQ2hE9+IKE5iTcEDP9lsWjshyX77H9Ypo9TwLtUGWZ5fT6IHa0CD5XwxgSXHarrpvfUnUweFHl9bIWuu+C0yn+ZeCmUZP1gImhK9XxfyoW1bzHyENiejgJACPbi23aPLdVYixKAQ46PGfMmr3QYG5c33l5jptq9xezTazNaaGMyx0eU0jd8WPtI1EDFDRxxporX2VmJU6l23i67UQ==</ds:SignatureValue><ds:KeyInfo Id="Certificate255899"><ds:X509Data><ds:X509Certificate>MIIJhTCCCG2gAwIBAgIEVNOsIjANBgkqhkiG9w0BAQsFADCBkzELMAkGA1UEBhMCRUMxGzAZBgNVBAoTElNFQ1VSSVRZIERBVEEgUy5BLjEwMC4GA1UECxMnRU5USURBRCBERSBDRVJUSUZJQ0FDSU9OIERFIElORk9STUFDSU9OMTUwMwYDVQQDEyxBVVRPUklEQUQgREUgQ0VSVElGSUNBQ0lPTiBTVUIgU0VDVVJJVFkgREFUQTAeFw0xOTAxMDkxNTQ3MjBaFw0yMDAxMDkxNjE3MjBaMIGbMQswCQYDVQQGEwJFQzEbMBkGA1UEChMSU0VDVVJJVFkgREFUQSBTLkEuMTAwLgYDVQQLEydFTlRJREFEIERFIENFUlRJRklDQUNJT04gREUgSU5GT1JNQUNJT04xPTATBgNVBAUTDDA5MDExOTEwNDMxNzAmBgNVBAMUH05JQ09MQVOgQUxFSkFORFJPIExVQktPViBHVVpNQU4wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCygdggaZbyPekZZb1QepY7ILfjb5vyDRWnqx0z11jdSuGYJ9Q1tzkTVl3jZHDeHEZGHl1Zzats28mbsBU+IWhqX7kPYPc/HI8NzN/d3Z1sYuDxswVEUTJXlrqVUiN3VrxkZrGfdbUQ45Ai8eKf45GfF+Te1e0kb+aMx81ITGvwwNnp/ysca58OB+5adxN3jR1Ef8z7qj4B/r9CsF2Qsd/mf+r19N3Zs+AEPtyopwJoeojWvUMSn5cKUovHjjIliu4bYNGJWVGf8nVUIH1I0QQZwQzVm/E8Ndq6apB1Em3KBRDNIW1cNY6rAutW5arx3ARwi9Tmg58EB0QXqs+CLxtpAgMBAAGjggXVMIIF0TALBgNVHQ8EBAMCBeAwWQYIKwYBBQUHAQEETTBLMEkGCCsGAQUFBzABhj1odHRwOi8vb2NzcGd3LnNlY3VyaXR5ZGF0YS5uZXQuZWMvZWpiY2EvcHVibGljd2ViL3N0YXR1cy9vY3NwMIHEBgNVHSAEgbwwgbkwPAYKKwYBBAGCpnICBzAuMCwGCCsGAQUFBwICMCAaHkNlcnRpZmljYWRvIGRlIFBlcnNvbmEgTmF0dXJhbDB5BgorBgEEAYKmcgIBMGswaQYIKwYBBQUHAgEWXWh0dHBzOi8vd3d3LnNlY3VyaXR5ZGF0YS5uZXQuZWMvbGV5ZXNfbm9ybWF0aXZhcy9Qb2xpdGljYXMgZGUgQ2VydGlmaWNhZG8gUGVyc29uYSBOYXR1cmFsLnBkZjAaBgorBgEEAYKmcgMBBAwTCjA5MjAwMjgwNTcwIgYKKwYBBAGCpnIDAgQUExJOSUNPTEFTwqBBTEVKQU5EUk8wFgYKKwYBBAGCpnIDAwQIEwZMVUJLT1YwFgYKKwYBBAGCpnIDBAQIEwZHVVpNQU4wUgYKKwYBBAGCpnIDBwREE0JHVUFZQVPCoC/CoEdVQVlBUVVJTMKgL8KgVEFSUVVJwqAvwqBQQURSRcKgU09MQU5PwqAxODIxwqBZwqBDQVJDSEkwHAYKKwYBBAGCpnIDCAQOEww1OTM5OTE1NTQyNzYwGQYKKwYBBAGCpnIDCQQLEwlHVUFZQVFVSUwwFwYKKwYBBAGCpnIDDAQJEwdFQ1VBRE9SMB0GCisGAQQBgqZyAwsEDxMNMDkyMDAyODA1NzAwMTAfBgorBgEEAYKmcgMgBBETDzAwMTAwMDAwMDAwMDY1NDATBgorBgEEAYKmcgMhBAUTA1BGWDAjBgNVHREEHDAagRhjK25pY29sYXNsdWJrb3ZAZGF0aWwuY28wggJ7BgNVHR8EggJyMIICbjCCAmqgggJmoIICYoY9aHR0cDovL29jc3Bndy5zZWN1cml0eWRhdGEubmV0LmVjL2VqYmNhL3B1YmxpY3dlYi9zdGF0dXMvb2NzcIaB1WxkYXA6Ly9kaXJlY3Quc2VjdXJpdHlkYXRhLm5ldC5lYy9jbj1DUkwzMjQsY249QVVUT1JJREFEJTIwREUlMjBDRVJUSUZJQ0FDSU9OJTIwU1VCJTIwU0VDVVJJVFklMjBEQVRBLG91PUVOVElEQUQlMjBERSUyMENFUlRJRklDQUNJT04lMjBERSUyMElORk9STUFDSU9OLG89U0VDVVJJVFklMjBEQVRBJTIwUy5BLixjPUVDP2NlcnRpZmljYXRlUmV2b2NhdGlvbkxpc3Q/YmFzZYaBnmh0dHBzOi8vZGlyZWN0LnNlY3VyaXR5ZGF0YS5uZXQuZWMvfmNybC9hdXRvcmlkYWRfZGVfY2VydGlmaWNhY2lvbl9zdWJfc2VjdXJpdHlfZGF0YV9lbnRpZGFkX2RlX2NlcnRpZmljYWNpb25fZGVfaW5mb3JtYWNpb25fY3VyaXR5X2RhdGFfcy5hLl9jX2VjX2NybGZpbGUuY3JspIGnMIGkMQswCQYDVQQGEwJFQzEbMBkGA1UEChMSU0VDVVJJVFkgREFUQSBTLkEuMTAwLgYDVQQLEydFTlRJREFEIERFIENFUlRJRklDQUNJT04gREUgSU5GT1JNQUNJT04xNTAzBgNVBAMTLEFVVE9SSURBRCBERSBDRVJUSUZJQ0FDSU9OIFNVQiBTRUNVUklUWSBEQVRBMQ8wDQYDVQQDEwZDUkwzMjQwKwYDVR0QBCQwIoAPMjAxOTAxMDkxNTQ3MjBagQ8yMDIwMDEwOTE2MTcyMFowHwYDVR0jBBgwFoAU9y9M4HXnYqN4llsGti5xO8xsP5AwHQYDVR0OBBYEFEPpdWD5KuC37thXq72DqlYapNQ8MAkGA1UdEwQCMAAwGQYJKoZIhvZ9B0EABAwwChsEVjguMQMCA6gwDQYJKoZIhvcNAQELBQADggEBAAP7KusP58sc/yN6kx4Ib0Cm59/J/bP6n2pTh9CeR/OGk/2fJF5RdIP9+6XDJC7kNycEQqRCGigRoSUSEj+RoemI0e3aRfiQSfrj0qZOpk/9DCZ2krNpyDja9nrVMoJtL35YIGtpCMPkEkSWG0k+NFWAKhemkgYv0qsT4KsbtqzTe2eH3dmBung5NKF5rj0fZ5sbLCbJjSRZty8ewwrcV3eRHacgnPCwhyBPTGQSobtC5CuGoaSsMrqzC1NJFzcQ3Z9/YNxsF4HQxTEgGjVtmmWY228XK7oqnNj4/ZuadvbiadkIXxCBzWso2cMFrgecuy01GC++t/yGOJbQG+hRfIY=</ds:X509Certificate></ds:X509Data><ds:KeyValue><ds:RSAKeyValue><ds:Modulus>soHYIGmW8j3pGWW9UHqWOyC342+b8g0Vp6sdM9dY3UrhmCfUNbc5E1Zd42Rw3hxGRh5dWc2rbNvJm7AVPiFoal+5D2D3PxyPDczf3d2dbGLg8bMFRFEyV5a6lVIjd1a8ZGaxn3W1EOOQIvHin+ORnxfk3tXtJG/mjMfNSExr8MDZ6f8rHGufDgfuWncTd40dRH/M+6o+Af6/QrBdkLHf5n/q9fTd2bPgBD7cqKcCaHqI1r1DEp+XClKLx44yJYruG2DRiVlRn/J1VCB9SNEEGcEM1ZvxPDXaumqQdRJtygUQzSFtXDWOqwLrVuWq8dwEcIvU5oOfBAdEF6rPgi8baQ==</ds:Modulus><ds:Exponent>AQAB</ds:Exponent></ds:RSAKeyValue></ds:KeyValue></ds:KeyInfo><ds:Object Id="Signature255899-Object255899"><etsi:QualifyingProperties Target="#Signature255899" xmlns:etsi="http://uri.etsi.org/01903/v1.3.2#"><etsi:SignedProperties Id="Signature255899-SignedProperties255899"><etsi:SignedSignatureProperties><etsi:SigningTime>2019-05-21T08:57:26</etsi:SigningTime><etsi:SigningCertificate><etsi:Cert><etsi:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1" /><ds:DigestValue>qHdypI+0uDMrhLHvouFHXCOSMg0=</ds:DigestValue></etsi:CertDigest><etsi:IssuerSerial><ds:X509IssuerName>CN=AUTORIDAD DE CERTIFICACION SUB SECURITY DATA, OU=ENTIDAD DE CERTIFICACION DE INFORMACION, O=SECURITY DATA S.A., C=EC</ds:X509IssuerName><ds:X509SerialNumber>1423158306</ds:X509SerialNumber></etsi:IssuerSerial></etsi:Cert></etsi:SigningCertificate></etsi:SignedSignatureProperties><etsi:SignedDataObjectProperties><etsi:DataObjectFormat ObjectReference="#Reference-ID-255899"><etsi:Description>contenido comprobante</etsi:Description><etsi:MimeType>text/xml</etsi:MimeType></etsi:DataObjectFormat></etsi:SignedDataObjectProperties></etsi:SignedProperties></etsi:QualifyingProperties></ds:Object></ds:Signature></factura>'

    #print(test)
    
    test2 = base64.b64encode(bytes(test, 'utf-8'))
    respuesta = client.service.validarComprobante(test2)
    print(respuesta)
    print("------------------")
    return False

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

def hacer_xml_retencion(request, Id_empresa, tabla, pkcampo, clave_acceso, nombre_tabla):
    return 0
def hacer_xml_notaDebito(request, Id_empresa, tabla, pkcampo, clave_acceso, nombre_tabla):
    return 0
def hacer_xml_guia(request, Id_empresa, tabla, pkcampo, clave_acceso, nombre_tabla):
    return 0
def hacer_xml_notaCredito(request, Id_empresa, tabla, pkcampo, clave_acceso, nombre_tabla):
    return 0


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

        client = Client("https://cel.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl") # produccion
        #client = Client("https://celcer.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl") # pruebas
       
        respuesta = client.service.autorizacionComprobante(Clave_doc)
        respuestaBruta = respuesta[2]
        try:
            respuestaInterna = respuestaBruta[0]
        except IndexError:
            context = {'Clave_doc': Clave_doc}
            return render(request, 'doc_sin_respuesta.html', context)

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
        tree.write("static/archivos/" + Clave_doc +".xhtml")
        tree = ET.parse("static/archivos/" + Clave_doc +".xhtml")
        
        # if you need the root element, use getroot
        root = tree.getroot()
        tree.write("static/archivos/" + Clave_doc +".xml")

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
        #visita.save()
        #reload(sys)
        #sys.setdefaultencoding('utf-8')        
        #RecepcionComprobantesOfflineService'
        #https://cel.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl', 'http://ec.gob.sri.ws.recepcion'
        #http://ec.gob.sri.ws.autorizacion
        client = Client("https://cel.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl") # produccion
        #client = Client("https://celcer.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl") # pruebas
       
        #print client.service.autorizacionComprobante(Clave_doc)
  
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
        client = Client("https://cel.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl") # produccion
      
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

