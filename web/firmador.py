import unittest
from datetime import datetime
from os import path

from OpenSSL import crypto

import xmlsig
from xades import XAdESContext, template, utils, ObjectIdentifier
from xades.policy import GenericPolicyId, ImpliedPolicy
from .base import BASE_DIR, parse_xml
import xml.etree.ElementTree
from xml.etree import ElementTree
import xml.etree.ElementTree as ET # Python 2.5


class TestXadesSignature(unittest.TestCase):
    def test_verify(self, xmlSTR ):
        root = parse_xml(xmlSTR)
        sign = root.xpath(
            '//ds:Signature', namespaces={'ds': xmlsig.constants.DSigNs}
        )[0]
        ctx = XAdESContext()
        ctx.verify(sign)

    def test_sign(self, xmlSTR, certificado, claveCert):
        root = parse_xml(xmlSTR)
        sign = root.xpath('//ds:Signature', namespaces={'ds': xmlsig.constants.DSigNs})[0]
        policy = GenericPolicyId(
            'http://www.facturae.es/politica_de_firma_formato_facturae/'
            'politica_de_firma_formato_facturae_v3_1.pdf',
            u"Politica de Firma FacturaE v3.1",
            xmlsig.constants.TransformSha1
        )
        ctx = XAdESContext(policy)
        with open(path.join(BASE_DIR, certificado), "rb") as key_file:
            ctx.load_pkcs12(crypto.load_pkcs12(key_file.read(), claveCert))
        ctx.sign(sign)
        ctx.verify(sign)

    def test_create(self, xmlSTR, certificado, claveCert):
        root = parse_xml(xmlSTR)
        #root =ET.fromstring(xmlSTR)      
        signature = xmlsig.template.create(
            xmlsig.constants.TransformInclC14N,
            xmlsig.constants.TransformRsaSha1,
            "Signature"
        )
        signature_id = utils.get_unique_id()
        ref = xmlsig.template.add_reference(
            signature, xmlsig.constants.TransformSha1, uri="", name="REF"
        )
        xmlsig.template.add_transform(ref, xmlsig.constants.TransformEnveloped)
        xmlsig.template.add_reference(
            signature, xmlsig.constants.TransformSha1, uri="#KI"
        )
        xmlsig.template.add_reference(
            signature, xmlsig.constants.TransformSha1, uri="#" + signature_id
        )
        ki = xmlsig.template.ensure_key_info(signature, name='KI')
        data = xmlsig.template.add_x509_data(ki)
        xmlsig.template.x509_data_add_certificate(data)
        serial = xmlsig.template.x509_data_add_issuer_serial(data)
        xmlsig.template.x509_issuer_serial_add_issuer_name(serial)
        xmlsig.template.x509_issuer_serial_add_serial_number(serial)
        xmlsig.template.add_key_value(ki)
        qualifying = template.create_qualifying_properties(
            signature, name=utils.get_unique_id()
        )
        props = template.create_signed_properties(
            qualifying, name=signature_id
        )
        template.add_claimed_role(props, "Supp2")
        template.add_production_place(props, city='Madrid')
        template.add_production_place(
            props, state='BCN', postal_code='08000', country='ES')
        template.add_claimed_role(props, "Supp")
        policy = GenericPolicyId(
            'http://www.facturae.es/politica_de_firma_formato_facturae/'
            'politica_de_firma_formato_facturae_v3_1.pdf',
            u"Politica de Firma FacturaE v3.1",
            xmlsig.constants.TransformSha1
        )
        root.append(signature)
        ctx = XAdESContext(policy)
        with open(path.join(BASE_DIR, certificado), "rb") as key_file:
            ctx.load_pkcs12(crypto.load_pkcs12(key_file.read(), claveCert))
        ctx.sign(signature)
        ctx.verify(signature)
        return root.tostring()

    def test_create_2(self,  xmlSTR, certificado, claveCert):
        root = parse_xml(xmlSTR)
        signature = xmlsig.template.create(
            xmlsig.constants.TransformInclC14N,
            xmlsig.constants.TransformRsaSha1,
            "Signature"
        )
        ref = xmlsig.template.add_reference(
            signature, xmlsig.constants.TransformSha1, uri="", name="R1"
        )
        xmlsig.template.add_transform(ref, xmlsig.constants.TransformEnveloped)
        xmlsig.template.add_reference(
            signature, xmlsig.constants.TransformSha1, uri="#KI", name="RKI"
        )
        ki = xmlsig.template.ensure_key_info(signature, name='KI')
        data = xmlsig.template.add_x509_data(ki)
        xmlsig.template.x509_data_add_certificate(data)
        serial = xmlsig.template.x509_data_add_issuer_serial(data)
        xmlsig.template.x509_issuer_serial_add_issuer_name(serial)
        xmlsig.template.x509_issuer_serial_add_serial_number(serial)
        xmlsig.template.add_key_value(ki)
        qualifying = template.create_qualifying_properties(signature)
        utils.ensure_id(qualifying)
        utils.ensure_id(qualifying)
        props = template.create_signed_properties(
            qualifying, datetime=datetime.now()
        )
        template.add_claimed_role(props, "Supp")
        signed_do = template.ensure_signed_data_object_properties(props)
        template.add_data_object_format(
            signed_do,
            "#R1",
            identifier=ObjectIdentifier("Idenfitier0", "Description")
        )
        template.add_commitment_type_indication(
            signed_do,
            ObjectIdentifier("Idenfitier0", "Description"),
            qualifiers_type=["Tipo"]
        )

        template.add_commitment_type_indication(
            signed_do,
            ObjectIdentifier("Idenfitier1", references=["#R1"]),
            references=["#R1"]
        )
        template.add_data_object_format(
            signed_do,
            "#RKI",
            description="Desc",
            mime_type="application/xml",
            encoding='UTF-8'
        )
        root.append(signature)
        ctx = XAdESContext(ImpliedPolicy(xmlsig.constants.TransformSha1))
        with open(path.join(BASE_DIR, certificado), "rb") as key_file:
            ctx.load_pkcs12(crypto.load_pkcs12(key_file.read(), claveCert))
        ctx.sign(signature)
        from lxml import etree
        print(etree.tostring(root))
        ctx.verify(signature)
        return(etree.tostring(root))