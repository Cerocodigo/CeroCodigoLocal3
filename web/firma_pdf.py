# *-* coding: utf-8 *-*
import sys
import datetime
#from cryptography.hazmat import backends
#from cryptography.hazmat.primitives.serialization import pkcs12

#from endesive.pdf import cms
import web.con_db

def traerdatos(request, usuario, Id_empresa, pkpanel):
    db = web.con_db.firmas(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    firma  = db.Firma_por_Usuario(usuario, 'panel',pkpanel)
    return firma

def firmar(pdffile, Id_empresa, certificado):
    return '' 
    # date = datetime.datetime.utcnow() - datetime.timedelta(hours=12)
    # date = date.strftime("D:%Y%m%d%H%M%S+00'00'")
    
    # fname = pdffile #"media/firma/archivo.pdf"

    # for certify in certificado:

    #     dct = {
    #         "aligned": 0,
    #         "sigflags": 3,
    #         "sigflagsft": 132,
    #         "sigpage": 0,
    #         "sigbutton": True,
    #         "sigfield": "",
    #         "auto_sigfield": True,
    #         "sigandcertify": True,
    #         #"signaturebox": (float(certify['x']), float(certify['y']), 360, 468),
    #         "signature": certify['display'],
    #         "contact": "",
    #         "location": "Ecuador",
    #         "signingdate": date,
    #         "reason": "",
    #         "password": certify['clave'],
    #     }
    #     with open('media/firma/'+ Id_empresa +'/'+ certify['certificado'], "rb") as fp:
    #         p12 = pkcs12.load_key_and_certificates(
    #             fp.read(), bytes(certify['clave'], 'utf-8'), backends.default_backend()
    #         )
    #     datau = open(fname, "rb").read()
    #     datas = cms.sign(datau, dct, p12[0], p12[1], p12[2], "sha256")
    #     fname = fname.replace(".pdf", "signed.pdf")
    #     with open(fname, "wb") as fp:
    #         fp.write(datau)
    #         fp.write(datas)
    # return fname