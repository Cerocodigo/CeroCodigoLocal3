# *-* coding: utf-8 *-*
import sys
import datetime
import json

from cryptography.hazmat import backends
from cryptography.hazmat.primitives.serialization import pkcs12

from endesive.pdf import cms
import web.con_db

import web.pdf



def traerdatos_bloque(request, Id_empresa, bloque):
    #bloque = [user1, user2].... los usuarios que firmaron el pdf anterior
    db = web.con_db.firmas(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    firma  = db.Firma_por_bloque(bloque)
    return firma

def traerdatos(request, usuario, Id_empresa, pk, tipo):
    db = web.con_db.firmas(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    firma  = db.Firma_por_Usuario(usuario, tipo,pk)
    return firma

def traerdatos_usuario(request, usuario, Id_empresa):
    db = web.con_db.firmas(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    firma  = db.Firma_por_Usuario_directo(usuario)
    return firma

def firmasxUsuarios(request, usuario, Id_empresa):
    db = web.con_db.firmas(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    firma  = db.Firma_por_Usuario_admin(usuario)
    context = {'firmas':firma}
    return context

def firmasxGrabar(request, Id_empresa, usuario):
    db = web.con_db.firmas(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    firmas = json.loads(request.POST.getlist('firmas')[0])    
    clasePdf = web.pdf
    dbusuario = web.con_db.Usuarios(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    claseUsuario = dbusuario.Usuario(usuario)

    PdfPruebaFirma = clasePdf.prueba(request.POST.getlist('Id_empresa')[0])
    display = "Firmado por " + str(claseUsuario[0]['Nombre']) + " " + str(claseUsuario[0]['Apellido'])
    for firma in firmas:
        datos_firma = [{'display':display,'certificado':firma['Certy'],'clave':firma['Clave']}]
        pdf_fianl = firmar(PdfPruebaFirma[0], Id_empresa , datos_firma)     
        if pdf_fianl[1] == "ok":#ok
            db.Firma_actualizar(firma['Certy'], firma['Clave'], usuario)
            context = {'ok':'si'}
        else:#no ok
            context = {'ok':'no', 'msg':pdf_fianl[2]}
    return context


def firmar_conform_nueva(pdffile, Id_empresa, certificado, envio_datset, nomtabla):
    date = datetime.datetime.utcnow() - datetime.timedelta(hours=12)
    date = date.strftime("D:%Y%m%d%H%M%S+00'00'")
    try:

        fname = pdffile #"media/firma/archivo.pdf"

        for certify in certificado:
            dct = {
                "aligned": 0,
                "sigflags": 3,
                "sigflagsft": 132,
                "sigpage": 0,
                "sigbutton": True,
                "sigfield": "",
                "auto_sigfield": True,
                "sigandcertify": True,
                #"signaturebox": (float(certify['x']), float(certify['y']), 360, 468),
                "signature": certify['display'],
                "contact": "",
                "location": "Ecuador",
                "signingdate": date,
                "reason": "",
                "password": certify['clave'],
            }
            with open('media/firma/'+ Id_empresa +'/'+ certify['certificado'], "rb") as fp:
                p12 = pkcs12.load_key_and_certificates(
                    fp.read(), bytes(certify['clave'], 'utf-8'), backends.default_backend()
                )
            datau = open(fname, "rb").read()
            datas = cms.sign(datau, dct, p12[0], p12[1], p12[2], "sha256")
            fname = fname.replace(".pdf", "signed.pdf")
            with open(fname, "wb") as fp:
                fp.write(datau)
                fp.write(datas)
        return [fname,'ok', fname]                
    except ValueError:
        return [fname,'no','ValueError: Clave de firma mala ' + certify['certificado']]
    except FileNotFoundError:
        return [fname,'no','FileNotFoundError: firma no se ecuentra ' + certify['certificado']]

def firmar_conform(pdffile, Id_empresa, certificado, envio_datset, nomtabla):
    date = datetime.datetime.utcnow() - datetime.timedelta(hours=12)
    date = date.strftime("D:%Y%m%d%H%M%S+00'00'")
    
    fname = pdffile #"media/firma/archivo.pdf"

    for certify in certificado:
        if certify['tipo'] == 'Usuario':
            dct = {
                "aligned": 0,
                "sigflags": 3,
                "sigflagsft": 132,
                "sigpage": 0,
                "sigbutton": True,
                "sigfield": "",
                "auto_sigfield": True,
                "sigandcertify": True,
                #"signaturebox": (float(certify['x']), float(certify['y']), 360, 468),
                "signature": certify['display'],
                "contact": "",
                "location": "Ecuador",
                "signingdate": date,
                "reason": "",
                "password": certify['clave'],
            }
            with open('media/firma/'+ Id_empresa +'/'+ certify['certificado'], "rb") as fp:
                p12 = pkcs12.load_key_and_certificates(
                    fp.read(), bytes(certify['clave'], 'utf-8'), backends.default_backend()
                )
            datau = open(fname, "rb").read()
            datas = cms.sign(datau, dct, p12[0], p12[1], p12[2], "sha256")
            fname = fname.replace(".pdf", "signed.pdf")
            with open(fname, "wb") as fp:
                fp.write(datau)
                fp.write(datas)
        if certify['tipo'] == 'Formulario':
            if certify['usuario'] == envio_datset[nomtabla][0][certify['firma']]:  
                dct = {
                    "aligned": 0,
                    "sigflags": 3,
                    "sigflagsft": 132,
                    "sigpage": 0,
                    "sigbutton": True,
                    "sigfield": "",
                    "auto_sigfield": True,
                    "sigandcertify": True,
                    #"signaturebox": (float(certify['x']), float(certify['y']), 360, 468),
                    "signature": certify['display'],
                    "contact": "",
                    "location": "Ecuador",
                    "signingdate": date,
                    "reason": "",
                    "password": certify['clave'],
                }
                with open('media/firma/'+ Id_empresa +'/'+ certify['certificado'], "rb") as fp:
                    p12 = pkcs12.load_key_and_certificates(
                        fp.read(), bytes(certify['clave'], 'utf-8'), backends.default_backend()
                    )
                datau = open(fname, "rb").read()
                datas = cms.sign(datau, dct, p12[0], p12[1], p12[2], "sha256")
                fname = fname.replace(".pdf", "signed.pdf")
                with open(fname, "wb") as fp:
                    fp.write(datau)
                    fp.write(datas)

    
    return fname

def firmar(pdffile, Id_empresa, certificado):
    date = datetime.datetime.utcnow() - datetime.timedelta(hours=12)
    date = date.strftime("D:%Y%m%d%H%M%S+00'00'")
    try:

        fname = pdffile #"media/firma/archivo.pdf"

        for certify in certificado:
            dct = {
                "aligned": 0,
                "sigflags": 3,
                "sigflagsft": 132,
                "sigpage": 0,
                "sigbutton": True,
                "sigfield": "",
                "auto_sigfield": True,
                "sigandcertify": True,
                #"signaturebox": (float(certify['x']), float(certify['y']), 360, 468),
                "signature": certify['display'],
                "contact": "",
                "location": "Ecuador",
                "signingdate": date,
                "reason": "",
                "password": certify['clave'],
            }
            with open('media/firma/'+ Id_empresa +'/'+ certify['certificado'], "rb") as fp:
                p12 = pkcs12.load_key_and_certificates(
                    fp.read(), bytes(certify['clave'], 'utf-8'), backends.default_backend()
                )
            datau = open(fname, "rb").read()
            datas = cms.sign(datau, dct, p12[0], p12[1], p12[2], "sha256")
            fname = fname.replace(".pdf", "signed.pdf")
            with open(fname, "wb") as fp:
                fp.write(datau)
                fp.write(datas)
        return [fname,'ok','']                
    except ValueError:
        return [fname,'no','ValueError: firma mala']                
    except FileNotFoundError:
        return [fname,'no','FileNotFoundError: firma no se ecuentra ' + certify['certificado']]
    except Exception as errorte:
        return [fname,'no', ''+str(errorte)+': '+certify['certificado']+'/']