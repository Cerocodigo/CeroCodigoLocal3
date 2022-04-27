/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package sri;

/**
 *
 * @author ccarreno
 */
public class DevelopedSignature {

    public static void main(String[] args) throws Exception {

    String xmlPath = "C:\\Comprobantes\\sri-master\\factura_virgen\\FA16349212.xml";
    String pathSignature = "C:\\Comprobantes\\sri-master\\certificado\\certificado.p12";
    String passSignature = "clave_certificado";
    String pathOut = "C:\\Comprobantes\\sri-master\\factura_firmada\\";
    String nameFileOut = "factura_sign_java.xml";

    System.out.println("Ruta del XML de entrada: " + xmlPath);
    System.out.println("Ruta Certificado: " + pathSignature);
    System.out.println("Clave del Certificado: " + passSignature);
    System.out.println("Ruta de salida del XML: " + pathOut);
    System.out.println("Nombre del archivo salido: " + nameFileOut);
     
    GenericXMLSignature firma = new GenericXMLSignature();
    firma.execute(xmlPath,pathSignature,passSignature,pathOut,nameFileOut);


}
 
   
}