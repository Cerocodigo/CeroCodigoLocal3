import requests
import json
import web.con_db

#  Funcion para devolver las condiciones
def condicionesdetalleListado(request, Id_empresa, Pkestructura):
    db = web.con_db.menu_modulos(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    # Retorna la respuesta de modulo_devolver_condicionesdetallexcondicion con el listado de condiciones
    return db.modulo_devolver_condicionesdetallexcondicion(Pkestructura)

#  Funcion para guardar condiciones
def guardar_condiciones(request, Id_empresa, condicionesdetalleListado):
    db = web.con_db.menu_modulos(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    # Convertir el string de la lista de diccionarios en una lista de diccionarios
    data_list = json.loads(condicionesdetalleListado)
    #Crear array_response para guardar los datos de la lista de diccionarios
    array_response = []
    # Recorrer la lista de diccionarios y guardar los datos en la base de datos
    for item in data_list:
        pk_estructura = item['pkEstructura']
        array_condiciones = item['arrayCondiciones']
        # Recorrer la lista de condiciones y guardar los datos en la base de datos
        for condicion in array_condiciones:
            pk_cond_detalle = condicion['pkCondDetalle']
            campo = condicion['campo']
            operador = condicion['operador']
            tipo = condicion['tipo'][0]
            elemento = condicion['elemento']
            mensaje = condicion['mensaje']
            # Guardar la respuesta de modulo_guardar_condicionesdetallexcondicion en una variable y agregarla a la lista
            respuesta = db.modulo_guardar_condicionesdetallexcondicion(pk_estructura, pk_cond_detalle, campo, elemento, operador, "C", tipo, mensaje)
            array_response.append(respuesta)
    # Crear el diccionario de respuesta
    response = {'message': 'Se ha guardado:', 'data': array_response}
    # Retornar la respuesta en formato json
    return response

#  Funcion para eliminar condiciones
def eliminar_condiciones(request, Id_empresa, PkCondDetalle):
    db = web.con_db.menu_modulos(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    # validar si la respuesta de modulo_eliminar_condicionesdetallexcondicion es true o false
    respuesta = db.modulo_eliminar_condicionesdetallexcondicion(PkCondDetalle)
    if respuesta == True:
        # Crear el diccionario de respuesta
        response = {'message': 'Se ha eliminado exitosamente'}
    else:
        # Crear el diccionario de respuesta
        response = {'message': 'No se ha eliminado'}
    # Retornar la respuesta en formato json
    return response
    
    