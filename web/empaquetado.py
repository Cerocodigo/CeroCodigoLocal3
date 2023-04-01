import os
from datetime import datetime
import shutil



def armar_empaquetadoAdjuntos(negocio, adjuntos):
    today = datetime.now()
    strtoday = today.strftime("%Y%m%d_%H%M%S")

    os.mkdir('media/archivos/'+negocio+'/empaquetados/'+strtoday)

    for archivo in adjuntos:
        try:
            shutil.copy('media/archivos/'+negocio+'/'+ archivo, 'media/archivos/'+negocio+'/empaquetados/'+strtoday+ '/'+ archivo)
        except:
            pass

    # guardar directorio .zip

    shutil.make_archive('media/archivos/'+negocio+'/empaquetados/'+strtoday, 'zip', 'media/archivos/'+negocio+'/empaquetados/'+strtoday)

    # borrado de carpeta 
    shutil.rmtree('media/archivos/'+negocio+'/empaquetados/'+strtoday)
    return 'media/archivos/'+negocio+'/empaquetados/'+str(strtoday)+'.zip'

def armar_archivo(cabeceraHtml, cabeceraDatos, detalleDatos, dataCab, dataDet, negocio, adjuntosHtml, adjuntosdatos):

    today = datetime.now()
    strtoday = today.strftime("%Y%m%d_%H%M%S")

    os.mkdir('media/archivos/'+negocio+'/empaquetados/'+strtoday)
    os.mkdir('media/archivos/'+negocio+'/empaquetados/'+strtoday+ '/adjuntos')

    #crear y llenar archivo html
    #<meta charset="utf-8">
    #<meta http-equiv="X-UA-Compatible" content="IE=edge">
    #<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>

    strhbase = '''
    <html lang="en">

    <head>

    
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>

    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title></title>
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
        integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

    <!-- Optional theme -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css"
        integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">

    <!-- Latest compiled and minified JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"
        integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa"
        crossorigin="anonymous"></script>

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->

    </head>

    <body>
    '''
    html_final = '''
    <!-- /#wrapper -->

    <!-- jQuery -->
    <script src="/static/jquery.min.js"></script>

    <!-- Bootstrap Core JavaScript -->
    <script src="/static/bootstrap.min.js"></script>


    </body>

    </html>
    '''  

    strhtml = strhbase
    

    for valor in cabeceraDatos:
        cabeceraHtml = cabeceraHtml.replace('{{'+str(valor['tag'])+'}}', str(dataCab[0][valor['campo']]))

    strhtml = strhtml + cabeceraHtml



    DetalleHtml = '''
    <table style="background-color: white; width: 60%; text-align: left;" align="center" border="1" cellpadding="2"
        cellspacing="2">
        <tbody>
        <tr align="center">        
    '''
    fila_det = ''
    for valor in detalleDatos:
        fila_det = fila_det + '<td>'+ valor['tag'] + '</td>'
    
    DetalleHtml = DetalleHtml + fila_det + '</tr>'
    cc = 0
    for i in dataDet:
        fila_det = ''
        for valor in detalleDatos:
            if valor['tipo'] == "normal":
                fila_det = fila_det + '<td>'+ str(i[valor['campo']]) + '</td>'    
            if valor['tipo'] == "firma":
                if i[valor['campo']] != '':
                    try:
                        fila_det = fila_det + '<td><a href="adjuntos/'+str(cc)+'.pdf"> Pdf </a></td>'    
                        shutil.copy(i[valor['campo']], 'media/archivos/'+negocio+'/empaquetados/'+strtoday+ '/adjuntos/'+ str(cc)+'.pdf')
                    except:
                        fila_det = fila_det + '<td>Error+ '+ str(i[valor['campo']])+'</td>'    
                else:
                    fila_det = fila_det + '<td></td>'    
                
            if valor['tipo'] == "imagen":
                if i[valor['campo']] != '':
                    try:
                        shutil.copy('media/archivos/'+negocio+'/'+ i[valor['campo']], 'media/archivos/'+negocio+'/empaquetados/'+strtoday+ '/adjuntos/'+ i[valor['campo']])
                        fila_det = fila_det + '<td><a href="adjuntos/'+str(i[valor['campo']])+'">'+ str(i[valor['campo']]) + '</a></td>'    
                    except:
                        fila_det = fila_det + '<td>Error: '+ str(i[valor['campo']]) + '</td>'    
                else:
                    fila_det = fila_det + '<td></td>'   
            if valor['tipo'] == "adjunto":
                if i[valor['campo']] != '':
                    ##crear html
                    strhtempo = strhbase

                    ##ponerle cabecra
                    for adjunto in adjuntosHtml:
                        if adjunto['tag'] == valor['campo']:
                            strhtempo = strhtempo + adjunto['html']

                    ##PAsarle datos
                    for columna in adjuntosdatos[i[valor['campo']]]:
                        if columna[0:1] == '@': ##es file
                            try:
                                shutil.copy('media/archivos/'+negocio+'/'+ str(adjuntosdatos[i[valor['campo']]][columna]), 'media/archivos/'+negocio+'/empaquetados/'+strtoday+ '/adjuntos/'+ str(adjuntosdatos[i[valor['campo']]][columna]))
                            except:
                                pass                        
                        strhtempo = strhtempo.replace('{{'+str(columna)+'}}', str(adjuntosdatos[i[valor['campo']]][columna]))

                    ##grabarlo
                    f = open('media/archivos/'+negocio+'/empaquetados/'+strtoday+ '/adjuntos/'+ str(cc)+'.html', 'x')
                    f.write(strhtempo)
                    f.close()
                    ##vinculalo
                    try:
                        fila_det = fila_det + '<td><a href="adjuntos/'+str(cc)+'.html"> ver </a></td>'    
                    except:
                        fila_det = fila_det + '<td>Error+ '+ str(i[valor['campo']])+'</td>'  

                else:
                    fila_det = fila_det + '<td></td>'  
 

        DetalleHtml = DetalleHtml + '<tr>' +fila_det + '</tr>'
        cc = cc + 1
    DetalleHtml = DetalleHtml + '</tbody></table>'
    
    strhtml = strhtml + DetalleHtml + html_final
    
    

    f = open('media/archivos/'+negocio+'/empaquetados/'+strtoday+ '/DLM.html', 'x')
    f.write(strhtml)
    f.close()

    # insertar archivos en carpeta 
    #destinationpath = strtoday + '/' + 'pdf'
    #shutil.copytree('pdf',destinationpath)
    #destinationpath = strtoday + '/' + 'DLM.html'
    #shutil.move("DLM.html", destinationpath)


    # guardar directorio .zip

    shutil.make_archive('media/archivos/'+negocio+'/empaquetados/'+strtoday, 'zip', 'media/archivos/'+negocio+'/empaquetados/'+strtoday)

    # borrado de carpeta 
    shutil.rmtree('media/archivos/'+negocio+'/empaquetados/'+strtoday)


    return 'media/archivos/'+negocio+'/empaquetados/'+str(strtoday)+'.zip'