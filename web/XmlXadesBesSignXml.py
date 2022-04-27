#!/usr/bin/env vpython3
# *-* coding: utf-8 *-*
from lxml import etree
from OpenSSL.crypto import load_pkcs12
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding
from endesive import xades, signer


def main(XA_xml, XA_certificado, XA_clave, XA_claveAcceso, XA_xmlFr):
    p12 = load_pkcs12(open(XA_certificado, 'rb').read(), XA_clave)

    def signproc(tosign, algosig):
        key = p12.get_privatekey().to_cryptography_key()
        signed_value_signature = key.sign(
            tosign,
            padding.PKCS1v15(),
            getattr(hashes, algosig.upper())()
        )
        return signed_value_signature

    data = open(XA_xml, 'rb').read()
    cert = p12.get_certificate().to_cryptography()
    certcontent = signer.cert2asn(cert).dump()

    cls = xades.BES()
    doc = cls.build('dokument.xml', data, 'application/xml', cert, certcontent, signproc, False, True)
    datafrm = etree.tostring(doc, encoding='UTF-8', xml_declaration=True, standalone=False)
    
    open( XA_xmlFr + '.xml', 'wb').write(datafrm)
    return datafrm

if __name__ == '__main__':
    main()