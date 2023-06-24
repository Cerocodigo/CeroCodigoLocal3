
import requests
import json
import web.con_db

def estructurasListado(request, Id_empresa, Pkmodulo):
    db = web.con_db.menu_modulos(request.session['conn_user'][Id_empresa],request.session['conn_pass'][Id_empresa],request.session['conn_base'][Id_empresa],request.session['conn_ip'][Id_empresa]) 
    return db.modulo_devolver_estructuraPorModulo(Pkmodulo)

