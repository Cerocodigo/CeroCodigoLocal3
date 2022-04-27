import web.mysql
import datetime

#import web.MySQLdb
class inter_login_LOGIN:
    def __init__(self,V_base):
        self.V_base=V_base
        #self.mysql_con = web.mysql.class_mysql( "root", "123456789", "cerocodigoweb", "127.0.0.1")
        #self.mysql_int = web.mysql.class_mysql( "root", "123456789", "mysql", "127.0.0.1")
        self.mysql_con = web.mysql.class_mysql( "cerocodigo", "AEx_1237458", "cerocodigoweb", "107.170.92.160")
        self.mysql_int = web.mysql.class_mysql( "cerocodigo", "AEx_1237458", "mysql", "107.170.92.160")
    def traer_negocio(self, V_negocio):
        if self.V_base == "Mysql":
            sentencia = 'select * from empresas_erp where empresas_erp.Negocio = "'+ V_negocio +'"'
            return self.mysql_con.table(sentencia)
    def validar_clave_registro(self, clave):
        if self.V_base == "Mysql":
            sentencia = 'select * from usuarios_registro where clave = "'+ clave +'" and usado = "No"'
            return self.mysql_con.table(sentencia)
    def log_in(self, V_usuario, V_clave):
        if self.V_base == "Mysql":
            sentencia = 'select * from empresas where empresas.empresa = "'+ V_usuario +'" and empresas.clave = "'+ V_clave +'"'
            return self.mysql_con.table(sentencia)
    def insert_docs(self, listado, flujo, id_empresa):
        if self.V_base == "Mysql":
            sentencia = "INSERT INTO " + flujo + id_empresa + " (`estab`,`punto`,`numero`, `emisor_id`, `emisor_razon`, `fecha`, `autorizacion`, `clave`, `tipo`, `estado`) VALUES ('" + listado['estab'] + "', '" + listado['punto'] + "', '" + listado['numero'] + "', '" + listado['emisor_id'] + "', '" + listado['emisor_razon'] + "', '" + listado['fecha'] + "', '" + listado['autorizacion'] + "', '" + listado['clave'] + "', '" + listado['tipo'] + "', 'Pendiente')"
            self.mysql_con.ejecutar(sentencia)
    def claves_invalidos(self, array_in, id_empresa):
        if self.V_base == "Mysql":
            sentencia = "select clave from r_" + id_empresa +  " where clave in("+ array_in +")"
            return self.mysql_con.table(sentencia)
    def traer_edocs(self, id_empresa, tipo, flujo, cantidad_filas, limite, condicion):
        if self.V_base == "Mysql":
            sentencia = "select estab, punto, numero, CONCAT(SUBSTR(clave,1,10),'...') as 'abre' ,emisor_id, emisor_razon, DATE_FORMAT(fecha, '%Y-%m-%d') as 'fecha', autorizacion, clave, estado, tipo from "+ flujo + id_empresa +  " where tipo ='"+ tipo +"'" + condicion + " order by fecha desc limit "+ str(cantidad_filas) +","+ str(limite)
            return self.mysql_con.table(sentencia)
    def cantidad_filas(self, id_empresa, tipo, flujo, condicion):
        if self.V_base == "Mysql":
            sentencia = "select COUNT(1) as 'total' from "+ flujo + id_empresa +  " where tipo ='"+ tipo +"'" + condicion
            return self.mysql_con.table(sentencia)
    def traer_pend(self, id_empresa, tipo, flujo):
        if self.V_base == "Mysql":
            sentencia = "select autorizacion from "+ flujo + id_empresa +  " where tipo ='"+ tipo +"' and estado = 'Pendiente'"
            return self.mysql_con.table(sentencia)
    def traer_conn_empresa(self, id_empresa):
        if self.V_base == "Mysql":
            sentencia = "select * from empresas_erp where id_empresa ='"+ id_empresa +"'"
            return self.mysql_con.table(sentencia)
    def traer_tipos_actualizar(self, id_empresa, flujo):
        if self.V_base == "Mysql":
            sentencia = "select * from conn_empre_tipo where id_empresa = '"+ id_empresa +  "'"
            return self.mysql_con.table(sentencia)
    def actualizar_docs(self, listado, flujo, id_empresa):
        if self.V_base == "Mysql":
            sentencia = "update " + flujo + id_empresa + " set estado = 'Ingresada' where autorizacion in (" + listado + ")"
            self.mysql_con.ejecutar(sentencia)
    def usuario_existe_user(self, id_usuario):
        if self.V_base == "Mysql":
            sentencia = "select * from matriculas where usuario = '" +  id_usuario +  "'"
            return self.mysql_con.table(sentencia)
    def usuario_existe_correo(self, user_email):
        if self.V_base == "Mysql":
            sentencia = "select * from matriculas where correo = '" +  user_email +  "'"
            return self.mysql_con.table(sentencia)
    def usuario_ingresar(self, user_id, user_pass, user_email, num_random, user_tipo, userViene):
        if self.V_base == "Mysql":
            sentencia = "INSERT INTO matriculas (usuario, clave, licencias, anos, correo, clave_aute, tipo, forma) VALUES ('" +  user_id +  "', '" +  user_pass +  "', '0', '1', '" +  user_email +  "', '" +  str(num_random) +  "', '" +  user_tipo +  "', '" +  userViene +  "')"
            self.mysql_con.ejecutar(sentencia)
    def usuario_validar_clave(self, clave):
        if self.V_base == "Mysql":
            sentencia = "select * from matriculas where clave_aute = '" +  str(clave) +  "'"
            return self.mysql_con.table(sentencia)
    def usuario_activar(self, user_id):
        if self.V_base == "Mysql":
            sentencia = "UPDATE matriculas SET licencias='5' WHERE usuario = '" +  user_id +  "' and clave_aute != 'usada'"
            self.mysql_con.ejecutar(sentencia)
            sentencia = "UPDATE matriculas SET clave_aute='usada' WHERE usuario = '" +  user_id +  "'"
            self.mysql_con.ejecutar(sentencia)            
    def log_externo(self, visita_fecha, visita_ip, fuente):
        if self.V_base == "Mysql":
            sentencia = "insert into ingresos (fecha, ip, fuente) VALUES ('" +  str(visita_fecha) +  "', '" +  str(visita_ip) +  "', '" +  str(fuente) +  "')"
            self.mysql_con.ejecutar(sentencia)
    def log_demo(self, t_Fecha, t_Nombres, t_Telefono, t_Email, t_Tipo, t_Tamano):
        if self.V_base == "Mysql":
            sentencia = "insert into `ing_demo` (`Fecha`, `Nombres`, `Telefono`, `Email`, `Tipo`, `Tamano`) VALUES ('" + str(t_Fecha) +  "', '" + str(t_Nombres) +  "', '" + str(t_Telefono) +  "', '" + str(t_Email) +  "', '" + str(t_Tipo) +  "', '" + str(t_Tamano) +  "')"
            print(sentencia)
            self.mysql_con.ejecutar(sentencia)            
    def experto_ingresar(self, nombre, email, pais, ciudad, exper):
        if self.V_base == "Mysql":
            sentencia = "insert into `experto_posible` (`nombre`, `email`, `pais`, `cuidad`, `exper`) VALUES ('" + nombre +  "', '" + email +  "', '" + pais +  "', '" + ciudad +  "', '" + exper +  "')"
            self.mysql_con.ejecutar(sentencia)
    def cont_expertos(self):
        if self.V_base == "Mysql":
            sentencia = "select sum(1) as 'expertos' from experto_aceptados"
            return self.mysql_con.table(sentencia)
    def expertos_traer(self):
        if self.V_base == "Mysql":
            sentencia = "select * from experto_aceptados"
            return self.mysql_con.table(sentencia)
    def experto_traer(self, pkexperto):
        if self.V_base == "Mysql":
            sentencia = "select * from experto_aceptados where pkexperto = '" +  pkexperto +  "'"
            return self.mysql_con.table(sentencia)
    def experto_existe_user(self, user_email):
        if self.V_base == "Mysql":
            sentencia = "select * from experto_posible where email = '" +  user_email +  "'"
            return self.mysql_con.table(sentencia)
    def demos_traer(self):
        if self.V_base == "Mysql":
            sentencia = "select * from demos"
            return self.mysql_con.table(sentencia)
    def traer_empresa(self, Id_erp):
        if self.V_base == "Mysql":
            sentencia = "select * from empresas_erp where BINARY Id_erp = '" +  Id_erp +  "'"
            return self.mysql_con.table(sentencia)
    def traer_platilla(self, plantilla, idioma):
        if self.V_base == "Mysql":
            sentencia = "select plantillas_web, plantillas_id, " + idioma + " as 'text' from plantillas_html where plantillas_web like '" +  plantilla +  "'"
            intermedio =  self.mysql_con.table(sentencia)
            dicc = {}
            for i in intermedio:
                dicc.update({i['plantillas_id']:i['text']}) 
            return dicc
    def valusuario_existe_user(self, usuario, email, ruc):
        if self.V_base == "Mysql":
            sentencia = "select * from empresas_erp where BINARY Id_erp = '" +  str(usuario) +  "' or BINARY u_correo = '" +  str(email) +  "' or BINARY d_Id = '" +  str(ruc) +  "'"
            return self.mysql_con.table(sentencia)
    def usuario_existe_crear(self, Id_erp, d_Id, d_RazonSocial, d_NombreComercial, userCorreo, userTipo, userClave1, activacion, userClaveElect, userContri, userObligado, userDireccion, user_regimen, user_agente):
        if self.V_base == "Mysql":
            sentencia = "insert into `empresas_erp` (`Negocio`, `Id_erp`, `estado`, `conn_ip`, `conn_user`, `conn_pass`, `conn_base`, `d_Id`, `d_RazonSocial`, `d_NombreComercial`, `d_Direccion`, `d_Clave`, `d_Correo`, `d_Obligado`, `u_correo`, `u_clave`, `u_activacion`, `u_tipo`, `d_Especial`, `d_regimenMicroempresas`, `d_agenteRetencion`) VALUES ('" +  str(Id_erp) +  "', '" +  str(Id_erp) +  "', 'NoActivo', '0', '0', '0', '0', '" +  str(d_Id) +  "', '" +  str(d_RazonSocial) +  "', '" +  str(d_NombreComercial) +  "', '" +  str(userDireccion) +  "', '" +  str(userClaveElect) +  "', '" +  str(userCorreo) +  "', '" +  str(userObligado) +  "', '" +  str(userCorreo) +  "', '" +  str(userClave1) +  "', '" +  str(activacion) +  "', '" +  str(userTipo) +  "', '" +  str(userContri) +  "', '" +  str(user_regimen) +  "', '" +  str(user_agente) +  "')" 
            return self.mysql_con.ejecutar(sentencia) 
    def clave_vale(self, clave):
        if self.V_base == "Mysql":
            sentencia = "select * from empresas_erp where BINARY u_activacion = '" +  str(clave) +  "'"
            return self.mysql_con.table(sentencia)
    def update_empresa(self, id_erp, d_Id, d_RazonSocial, d_NombreComercial, d_Direccion, d_Clave, d_Obligado, d_Especial):
        if self.V_base == "Mysql":
            sentencia = "update empresas_erp set d_Id= '" + str(d_Id) + "', d_RazonSocial = '" + str(d_RazonSocial) + "', d_NombreComercial = '" + str(d_NombreComercial) + "', d_Direccion = '" + str(d_Direccion) + "', d_Clave = '" + str(d_Clave) + "', d_Obligado = '" + str(d_Obligado) + "' , d_Especial = '" + str(d_Especial) + "' where Id_erp = '" + str(id_erp) + "'"
            self.mysql_con.ejecutar(sentencia)
    def clave_activar(self, clave):
        if self.V_base == "Mysql":
            sentencia = "update empresas_erp set estado = 'activo' where BINARY u_activacion = '" +  str(clave) +  "'"
            return self.mysql_con.ejecutar(sentencia)
    def crear_base(self, idneg):
        if self.V_base == "Mysql":
            sentencia = "CREATE DATABASE `cliente_"+ str(idneg)+ "` /*!40100 DEFAULT CHARACTER SET latin1 */"
            return self.mysql_con.ejecutar(sentencia)
    def crearusuario(self, idneg, clave_base):
        if self.V_base == "Mysql":
            sentencia = "create user 'user_"+str(idneg)+"'@'%' IDENTIFIED BY 'P"+ str(idneg)+"_"+str(clave_base)+"'"
            self.mysql_int.ejecutar(sentencia)
            sentencia = "grant all ON cliente_"+ str(idneg)+ ".* TO user_"+str(idneg)+"@'%' IDENTIFIED BY 'P"+ str(idneg)+"_"+str(clave_base)+"'"
            self.mysql_int.ejecutar(sentencia)
    def actDatosErp(self, idneg, clave_base):
        if self.V_base == "Mysql":
            sentencia = "update empresas_erp set estado = 'activo', conn_ip = '107.170.92.160', conn_user= 'user_"+str(idneg)+"', conn_pass='P"+ str(idneg)+"_"+str(clave_base)+"', conn_base='cliente_"+str(idneg)+"' where BINARY Id_erp = '" +  str(idneg) +  "'"
            return self.mysql_con.ejecutar(sentencia)
    def sql_traer_directo(self, senten):
        if self.V_base == "Mysql":
            return self.mysql_con.table(senten)
    def views_demo(self):
        if self.V_base == "Mysql":
            return self.mysql_con.table("select * from ing_demo where DATEDIFF(now(),Fecha) < 30 ")

class externo_cliente:
    def __init__(self, conn_user, conn_pass, conn_base, conn_ip):
        self.mysql_con = web.mysql.class_mysql(conn_user, conn_pass, conn_base, conn_ip)
    def devolver_ingresados(self, sentencia, str_pendientes):
        sentencia = sentencia.replace("@documento", str_pendientes)
        return self.mysql_con.table(sentencia)
    def traer_usuario(self, str_usuario, str_clave):
        sentencia = 'select * from usuario where usuario.Usuario = "'+ str(str_usuario) +'" and usuario.hash = "'+ str_clave +'"'
        return self.mysql_con.table(sentencia)  
    def traer_usuarioSoloAdmin(self, str_usuario, str_clave):
        sentencia = 'select Usuario from usuario where usuario.Admin = "Y" and usuario.hash = "'+ str_clave +'"'
        return self.mysql_con.table(sentencia)          
    def crear_hash(self, str_usuario, str_clave):
        sentencia = "select Usuario from usuario where usuario.Usuario = '"+ str(str_usuario) +"' and (usuario.hash = '' or usuario.hash is null )"
        valor = self.mysql_con.table_utf8(sentencia)
        #valor = self.mysql_con.table(sentencia)
        if len(valor) == 1:
            self.mysql_con.ejecutar('update usuario set hash = "'+ str_clave + '" where usuario.Usuario = "'+ str_usuario + '"')
    def carga_menu(self, V_user):
        #sentencia = 'select DISTINCT s.PkModGen AS "id", s.PkModGen AS "PkModGen",   s.Nombre,   s.icono FROM    web_a_permisos WE,  modulo M,   sysmodulogeneral S WHERE  WE.pkmodulo = M.PkModulo AND S.PkModGen = M.Cabecera and WE.usuario = "'+str(V_user)+'" AND M.anulado LIKE "N" ORDER BY s.orden,  m.orden'
        sentencia = 'SELECT DISTINCT	s.PkModGen AS "id",	s.PkModGen AS "PkModGen",	s.Nombre,	s.icono,	usuario.Admin FROM	usuario, 	sysmodulogeneral S LEFT JOIN modulo M on ( S.PkModGen = M.Cabecera)LEFT JOIN web_a_permisos WE on (WE.pkmodulo = M.PkModulo and WE.usuario = "'+str(V_user)+'")WHERE usuario.Usuario = "'+str(V_user)+'" and (usuario.Admin = "Y" or not(WE.pkmodulo is null))ORDER BY	s.orden, m.orden'
        return self.mysql_con.table(sentencia)
    def baseSize(self, id_base):
        sentencia = 'SELECT table_schema, ROUND(SUM(data_length + index_length) / 1024 / 1024 / 1024, 2) "gigas" FROM information_schema.tables where table_schema = "' + id_base + '"'
        return self.mysql_con.table(sentencia)
    def carga_modulos(self,V_user):
        return self.mysql_con.table('select DISTINCT m.tipo AS "formtipo",   s.PkModGen AS "PkModGen",   m.PkModulo AS "id", m.PkModulo AS "PkModulo",   m.nombre AS "modulo",   m.descripcion AS "mdesc",   s.icono FROM    modulo M,   sysmodulogeneral S, web_a_permisos WE WHERE     WE.usuario = "'+str(V_user)+'" AND WE.pkmodulo = M.PkModulo AND M.Cabecera = S.PkModGen AND M.anulado LIKE "N" AND WE.tipo IN ("1", "2", "3", "4") ORDER BY    s.orden,    m.orden ')
    def carga_opciones(self, V_user):
        return self.mysql_con.table('select DISTINCT    m.tipo AS "formtipo",   m.PkModulo AS "PkModulo",   WE.pk AS "id", WE.pk AS "PkOpciones", CASE WHEN  WE.tipo = 1 THEN "Consulta" WHEN  WE.tipo = 2 THEN "Ingresar" WHEN  WE.tipo = 3 THEN "Modificar" WHEN  WE.tipo = 4 THEN "Eliminar" END AS "Nombre",  s.icono FROM    web_a_permisos WE,  modulo M,   sysmodulogeneral S WHERE WE.pkmodulo = M.PkModulo AND S.PkModGen = M.Cabecera and WE.usuario = "'+str(V_user)+'" AND M.anulado LIKE "N" and WE.tipo in(1,2,3,4) ORDER BY s.orden,   m.orden')
    def carga_reportes(self, V_user):
        return self.mysql_con.table('select DISTINCT M.tipo as "formtipo", M.PkModulo as "Pkmodulo", RE.PkReporte,  RE.PkReporte as "id", lower(REPLACE(RE.Nombre," ","")) as "nombre", RE.Nombre as "diplay", RE.Descripcion as "descripcion", RE.formato as "formato", RE.posicion as "posicion", RE.Arch_Excell as "arch_excell", RE.Con_detalle as "con_detalle", RE.Tipo as "tipo", s.icono from web_a_permisos WE, sysmodulogeneral S, reportesmain RE, modulo M where WE.usuario = "'+str(V_user)+'" and WE.pkmodulo = M.PkModulo and M.Cabecera = S.PkModGen and M.PkModulo = RE.PkModulo and M.tipo = "Reporte" and M.anulado LIKE "N" and RE.anulado = "N" ORDER BY s.orden,    m.orden')
    def carga_list_user(self):
        return self.mysql_con.table('select DISTINCT usuario from usuario')
    def cal_accrap(self, V_user):
        return self.mysql_con.table('select * from web_c_accrap where (usuario = "'+str(V_user)+'" or usuario = "Todos")')
    def carga_list_areas(self):
        sentencia = 'select * from web_p_tareas_senten'
        res_t = self.mysql_con.table(sentencia)
        areas =self.mysql_con.table(res_t[0]['Senten_area']) 
        proyect =self.mysql_con.table(res_t[0]['Senten_proyectos']) 
        return [areas, proyect]
    def carga_estados(self):
        return self.mysql_con.table('select * from web_p_estado')
    def carga_certificado(self):
        return self.mysql_con.table('select DISTINCT Certificado from cmpelectronico ')
    def carga_auto_ejecutable(self, t_usuario):
        return self.mysql_con.table('select * from web_a_auto_ejecutable where usuario like "'+  + str(t_usuario) + '" or usuario like "Todos")')
    def carga_datos_cuentas(self):
        return self.mysql_con.table('select cast(numeroRuc as char) as "numeroRuc" from xml_atm_cabecera')
    def carga_sri_ingreso_rap(self):
        return self.mysql_con.table('select * from web_edocs_filtro where web = "Si"')
    def carga_sri_ingreso_rap_referencias(self, tpkmodulo):
        return self.mysql_con.table('select * from web_edocs_traspaso where pkmodulo = '+str(tpkmodulo))
    def sql_traer_directo(self,V_sentencia):
        return self.mysql_con.table(V_sentencia)


        
class inter_reporte_var:
    def __init__(self, conn_user, conn_pass, conn_base, conn_ip):
        self.mysql_con = web.mysql.class_mysql(conn_user, conn_pass, conn_base, conn_ip)
    def variables_reprotes(self, V_pkrepo):
        sentencia = 'select CAST( CASE    WHEN Tipo = "Fecha" THEN concat(date(NOW()))    WHEN Tipo = "FechaMes" THEN concat(year(NOW()),"-", if(MONTH(NOW())>9,MONTH(NOW()),concat("0", MONTH(NOW()))),"-01")    WHEN Tipo = "FechaAnio" THEN concat(year(NOW()),"-01-01")    ELSE "0"  END AS char) as "valor",PkVariable as "id", PkReporte as "pkreporte", Id as "id_rep", Glosa as "glosa", Tipo as "tipo", nivel as "nivel" from reportesvariables where pkreporte = '+ str(V_pkrepo) +' and nivel = 1'
        return self.mysql_con.table(sentencia)
    def referencias_reprotes(self, V_pkrepo):
        sentencia = 'select PkReferencia as "id", PkReporte as "pkreporte", Id as "id_rep", Campo as "campo", Columnas as "columnas", Tabla as "tabla", Glosa as "glosa", Nivel as "nivel", Multi as "multi" from reportesreferencias where pkreporte = '+ str(V_pkrepo) +' and nivel = 1'            
        return self.mysql_con.table(sentencia)
    def main_reprotes(self, V_pkrepo):
        sentencia = 'select * from reportesmain where pkreporte = '+ str(V_pkrepo)             
        return self.mysql_con.table(sentencia)
    def sentencia_reprotes(self, V_pkrepo):
        resp = []
        sentencia = "select sentencia from reportesqselect where pkreporte = '" + str(V_pkrepo) + "'"
        db_report = self.mysql_con.table(sentencia)
        resp.append(db_report)

        sentencia = "select sentencia from reportesqfrom where pkreporte = '" + str(V_pkrepo) + "'"
        db_report = self.mysql_con.table(sentencia)
        resp.append(db_report)

        sentencia = "select sentencia from reportesqwhere where pkreporte = '" + str(V_pkrepo) + "'"
        db_report = self.mysql_con.table(sentencia)
        resp.append(db_report)

        sentencia = "select sentencia from reportesqrest where pkreporte = '" + str(V_pkrepo) + "'"
        db_report = self.mysql_con.table(sentencia)
        resp.append(db_report)

        sentencia = "select sentencia from reportesqGRP where pkreporte = '" + str(V_pkrepo) + "'"
        db_report = self.mysql_con.table(sentencia)
        resp.append(db_report)

        return resp


class agente_central:
    def __init__(self, conn_user, conn_pass, conn_base, conn_ip):
        self.mysql_con = web.mysql.class_mysql(conn_user, conn_pass, conn_base, conn_ip)
    def traer_valores(self, t_id):
        base_query = self.mysql_con.table('select * from web_x_estado')
        return self.mysql_con.table(str(base_query[0]['estado']).replace('@ruc@',str(t_id)))
    def traer_cupo(self, t_id):
        base_query = self.mysql_con.table('select * from web_x_estado')
        return self.mysql_con.table(str(base_query[0]['cupo']).replace('@ruc@',str(t_id)))

class inter_ref_buscar:
    def __init__(self, conn_user, conn_pass, conn_base, conn_ip):
        self.mysql_con = web.mysql.class_mysql(conn_user, conn_pass, conn_base, conn_ip)
    def reportesreferencias(self, V_pkrefer):
        sentencia = 'select PkReferencia as "id", PkReporte as "pkreporte", Id as "id_rep", Campo as "campo", Columnas as "columnas", Tabla as "tabla", Glosa as "glosa", Nivel as "nivel", Multi as "multi" from reportesreferencias where PkReferencia = '+ V_pkrefer +' and nivel = 1'
        return self.mysql_con.table(sentencia)
    def reportesreferencias_valores(self, V_sentencia):
        return self.mysql_con.como_cursor(V_sentencia)

class menu_modulos:
    def __init__(self, conn_user, conn_pass, conn_base, conn_ip):
        self.mysql_con = web.mysql.class_mysql(conn_user, conn_pass, conn_base, conn_ip)      
    def traer_sysmodulogeneral_update(self, str_atributo, str_PkModGen, str_valor):
        sentencia = "UPDATE sysmodulogeneral set "+str(str_atributo)+" = '"+str(str_valor)+"' where PkModGen = " +str(str_PkModGen)
        print(sentencia)
        self.mysql_con.ejecutar(sentencia)  
    def traer_proceso_update(self, str_atributo, str_pkmodulo, str_valor):
        sentencia = "UPDATE modulo set "+str(str_atributo)+" = '"+str(str_valor)+"' where PkModulo = " +str(str_pkmodulo)
        print(sentencia)
        self.mysql_con.ejecutar(sentencia)  
    def traer_procesos_por_codigos(self, str_pkmodulo1, str_pkmodulo2):
        sentencia = "select * from modulo where PkModulo in ("+str(str_pkmodulo1)+","+str(str_pkmodulo2)+") "
        return self.mysql_con.table(sentencia)  
    def traer_sysmodulogeneral_codigos(self, str_PkModGen1, str_PkModGen2):
        sentencia = "select * from sysmodulogeneral where PkModGen in ("+str(str_PkModGen1)+","+str(str_PkModGen2)+") "
        return self.mysql_con.table(sentencia)  
    def traer_sysmodulogeneral(self):
        sentencia = "select * from sysmodulogeneral  order by sysmodulogeneral.Orden"
        return self.mysql_con.table(sentencia)  
    def eliminar_modulo(self, str_PkModGen ):
        sentencia = 'delete from sysmodulogeneral where PkModGen = ' + str(str_PkModGen)
        self.mysql_con.ejecutar(sentencia)  
    def traer_modulo_por_nombre(self, str_Nombre, str_Nombre_taps ):
        sentencia = "select * from modulo where Nombre like '"+str(str_Nombre)+"' or Nombre like '"+str(str_Nombre_taps)+"'"
        return self.mysql_con.table(sentencia)  
    def traer_sysmodulogeneral_por_nombre(self, str_Nombre, str_Nombre_taps ):
        sentencia = "select * from  sysmodulogeneral where Nombre like '"+str(str_Nombre)+"' or Nombre like '"+str(str_Nombre_taps)+"'"
        return self.mysql_con.table(sentencia)  
    def traer_procesos_todos(self):
        sentencia = "SELECT * from modulo order by modulo.Orden"
        return self.mysql_con.table(sentencia)          
    def sysmodulogeneral_crear(self, str_Nombre, str_orden, str_icono ):
        sentencia = "INSERT INTO `sysmodulogeneral` (`Nombre`, `Anulado`, `Orden`, `icono`) VALUES ('"+str(str_Nombre)+"', 'N', '"+str(str_orden)+"', '"+str(str_icono)+"')" 
        self.mysql_con.ejecutar(sentencia)  
    def traer_modulos_max_orden(self ):
        sentencia = "select max(cast(orden as decimal(12,0))) +1  as 'max' from sysmodulogeneral"
        return self.mysql_con.table(sentencia)  
    def procesos_crear(self, str_Nombre, str_Descripcion, str_Cabecera, str_Orden, str_tipo):
        sentencia = "INSERT INTO `modulo` (`Nombre`, `Descripcion`, `Anulado`, `Cabecera`, `Orden`, `Plantilla`, `Imp_rap`, `ing_rap`, `modificable`, `exportable`, `mod_detalle`, `tipo`) VALUES ('"+str(str_Nombre)+"', '"+str(str_Descripcion)+"', 'N', '"+str(str_Cabecera)+"', '"+str(str_Orden)+"', 'def', 'NO', 'NO', 'Si', '', '', '"+str(str_tipo)+"')" 
        self.mysql_con.ejecutar(sentencia)  
    def traer_procesos_max_orden(self, cabecera ):
        sentencia = "select max(cast(orden as decimal(12,0))) +1  as 'max' from modulo where cabecera =" + str(cabecera)
        return self.mysql_con.table(sentencia)  
    def modulo_crear_modulo(self, str_Nombre, str_Descripcion, str_Cabecera, str_Orden, str_tipo):
        sentencia = "INSERT INTO `modulo` (`Nombre`, `Descripcion`, `Anulado`, `Cabecera`, `Orden`, `Plantilla`, `Imp_rap`, `ing_rap`, `modificable`, `exportable`, `mod_detalle`, `tipo`) VALUES ('"+str(str_Nombre)+"', '"+str(str_Descripcion)+"', 'N', '"+str(str_Cabecera)+"', '"+str(str_Orden)+"', 'def', 'NO', 'NO', 'Si', '', '', '"+str(str_tipo)+"')" 
        self.mysql_con.ejecutar(sentencia)
        sentencia = "CREATE TABLE " + str(str_Nombre) + "(Pk" + str(str_Nombre) + " int NOT NULL AUTO_INCREMENT,PRIMARY KEY (Pk" + str(str_Nombre) + "))"
        self.mysql_con.ejecutar(sentencia)
        return self.mysql_con.table("Select * from modulo where Nombre = '"+(str_Nombre)+"'")  

    def modulo_crear_estructura(self, str_pkmodulo, str_Nombre, str_Descripcion):
        sentencia = "INSERT INTO `estructura` (`PkModulo`, `Nombre`, `Descripcion`, `Anulado`,`HijaDe`,`X`,`Y`, `espacio` ) VALUES ('" & str_pkmodulo & "', '" & str_Nombre & "', '" & str_Descripcion & "', 'N','0','0','0','22')"
        self.mysql_con.ejecutar(sentencia)
        return self.mysql_con.table("Select * from estructura where Nombre = '"+(str_Nombre)+"'")  

    def modulo_crear_campoPk(self, str_Nombre, str_PkEstructura):
        sentencia = "INSERT INTO `cmpnumsecuencial` (`ValorInicial`, `Aumento`, `PkEstructura`, `Nombre`) VALUES ('1', '1', '" + str(str_PkEstructura) + "', 'Pk" & str_Nombre & "')"
        self.mysql_con.ejecutar(sentencia)
        return self.mysql_con.table("Select * from cmpnumsecuencial where PkEstructura = '"+(str_PkEstructura)+"' and Nombre = '"+(str_Nombre)+"'")  

    def modulo_crear_camposxestructura(self, str_pkmodulo, str_PkEstructura, str_Pkcampo, str_Nombre):
        sentencia = "INSERT INTO `camposxestructura` (`PkModulo`, `PkEstructura`, `PkCampo`, `TablaCampo`, `Posicion`, `Nombre`, `Descripcion`, `Anulado`, `Eliminable`, `Visible`, `X`, `Y`, `tamano`, `estilo`, `Modificable` ) VALUES ('" +str(str_pkmodulo)+ "', '" +str(str_PkEstructura)+"', '"+str(str_Pkcampo)+"', 'cmpnumsecuencial', '1', 'Pk" +str(str_Nombre)+ "', 'Clave Primaria de la estructura " +str(str_Nombre)+"', 'N', 'N', 'N', '0', '0', '10', 'Normal', 'Si')"
        self.mysql_con.ejecutar(sentencia)



class inter_registro:
    def __init__(self, conn_user, conn_pass, conn_base, conn_ip):
        self.mysql_con = web.mysql.class_mysql(conn_user, conn_pass, conn_base, conn_ip)      
    def eliminar_error(self, tpk_modulo, tpkregistro):
        self.mysql_con.ejecutar("delete from web_aut_errores where modulo = '"+str(tpk_modulo)+"' and pk = '"+str(tpkregistro)+"'")
    def log_aut(self):
        sentencia = "select * from llankay_log where sentencia like '%datetime.%' and pk = 692180"
        return self.mysql_con.table(sentencia)      
    def acc_rapido(self, tpk_modulo, t_usuario):
        sentencia = " select * from web_a_permisos where pkmodulo = "+str(tpk_modulo)+" and usuario = '"+str(t_usuario)+"'"
        return self.mysql_con.table(sentencia)          
    def newrapido(self, tpk_modulo, t_usuario):
        sentencia = " select * from web_a_permisos where pkmodulo = "+str(tpk_modulo)+" and usuario = '"+str(t_usuario)+"' and tipo = 2"
        return self.mysql_con.table(sentencia)        
    def modrapido(self, tpk_modulo, t_usuario):
        sentencia = " select * from web_a_permisos where pkmodulo = "+str(tpk_modulo)+" and usuario = '"+str(t_usuario)+"' and tipo = 3"
        return self.mysql_con.table(sentencia)
    def al_errores(self):
        sentencia = "select * from web_aut_errores where checkk =0"
        return self.mysql_con.table(sentencia)
    def traer_plantilla_pdf_seg(self,t_pkpaneL_g):
        sentencia = "select * from web_p_panel_plantilla_seg where pkgrupo ="+ str(t_pkpaneL_g)
        return self.mysql_con.table(sentencia)        
    def traer_plantilla_pdf_valor(self,t_pksegmento):
        sentencia = "select * from web_p_panel_plantilla_seg_valor where pksegmento ="+ str(t_pksegmento)
        return self.mysql_con.table(sentencia)        
    def traer_estructuras_porPk(self,strpk):
        sentencia = "select Nombre from estructura where PkEstructura ="+ str(strpk)
        return self.mysql_con.table(sentencia)        
    def traer_moduloss_porPk(self,strpk):
        sentencia = "select * from modulo where pkmodulo ="+ str(strpk)
        return self.mysql_con.table(sentencia) 
    def pdf_updatemedidas(self, qPkSegmento, aValor):
        self.mysql_con.ejecutar("update plantillassegmentos set AlturaInicial = '"+str(aValor)+"' where PkSegmento = '"+str(qPkSegmento)+"'")
    def pdf_ins_plantillasetiquetas(self, qPkSegmento, qNombre, qX, qY, qTipoLetra, qTamano):
        self.mysql_con.ejecutar("insert into `plantillasetiquetas` (`PkSegmento`, `Nombre`, `X`, `Y`, `TipoLetra`, `Tamano`) VALUES ('"+str(qPkSegmento)+"', '"+str(qNombre)+"', '"+str(qX)+"', '"+str(qY)+"', '"+str(qTipoLetra)+"', '"+str(qTamano)+"')")
    def pdf_ins_plantillascamposcabecera(self, qPkSegmento, qCampo, qX, qY, qTipo, qExt, qlimite, qTamano):
        self.mysql_con.ejecutar("insert into `plantillascamposcabecera` (`PkSegmento`, `Campo`, `X`, `Y`, `Tipo`, `Ext`, `limite`, `Tamano`) VALUES ('"+str(qPkSegmento)+"', '"+str(qCampo)+"', '"+str(qX)+"', '"+str(qY)+"', '"+str(qTipo)+"', '"+str(qExt)+"', '"+str(qlimite)+"', '"+str(qTamano)+"')")
    def pdf_ins_plantillascampos(self, qPkSegmento, qCabecera, qTabla, qX, qCampo, qLimite, qTipo, qExt, qTamano):
        self.mysql_con.ejecutar("insert into `plantillascampos` (`PkSegmento`, `Cabecera`, `Tabla`, `X`, `Campo`, `Limite`, `Tipo`, `Ext`, `Tamano`) VALUES ('"+str(qPkSegmento)+"', '"+str(qCabecera)+"', '"+str(qTabla)+"', '"+str(qX)+"', '"+str(qCampo)+"', '"+str(qLimite)+"', '"+str(qTipo)+"', '"+str(qExt)+"', '"+str(qTamano)+"')")
    def brorrar_pdsdetalles(self, str_pkplantilla):
        self.mysql_con.ejecutar('delete from plantillasetiquetas where PkSegmento in (select PkSegmento from plantillassegmentos where PkPlantilla = '+ str(str_pkplantilla)+')')  
        self.mysql_con.ejecutar('delete from plantillascampos where PkSegmento in (select PkSegmento from plantillassegmentos where PkPlantilla = '+ str(str_pkplantilla)+')')  
        self.mysql_con.ejecutar('delete from plantillascamposcabecera where PkSegmento in (select PkSegmento from plantillassegmentos where PkPlantilla = '+ str(str_pkplantilla)+')')  
    def lista_segm_pdf_porpk(self, str_pkplantilla):
        sentencia = "select * from plantillassegmentos where PkPlantilla ="+ str(str_pkplantilla)
        return self.mysql_con.table(sentencia)          
    def pdf_updateplantilla(self, str_pkplantilla, t_ancho, t_largo):
        sentencia = "update plantillas set Ancho = "+str(t_ancho)+", Largo = "+str(t_largo)+" where PkPlantilla ="+ str(str_pkplantilla)
        self.mysql_con.ejecutar(sentencia)
    def lista_estados_pk(self, str_pkestado):
        sentencia = "select * from web_estados_doc where pkweb_estados_doc ="+ str(str_pkestado)
        return self.mysql_con.table(sentencia)  
    def estado_actualziar(self, t_pkestado,t_estado_display,t_estado_estado_inicial,t_estado_estado_final,t_estado_color,t_estado_usuarios):
        sentencia = "update web_estados_doc set "
        sentencia = sentencia + " estado_inicial = '"+str(t_estado_estado_inicial)+"', "
        sentencia = sentencia + " estado_final = '"+str(t_estado_estado_final)+"', "
        sentencia = sentencia + " color = '"+str(t_estado_color)+"', "
        sentencia = sentencia + " display = '"+str(t_estado_display)+"', "
        sentencia = sentencia + " usuarios = '"+str(t_estado_usuarios)+"' "
        sentencia = sentencia + "where pkweb_estados_doc ="+ str(t_pkestado)
        self.mysql_con.ejecutar(sentencia)
    def estado_borrar(self, str_pkestado):
        sentencia = "delete from web_estados_doc where pkweb_estados_doc ="+ str(str_pkestado)
        self.mysql_con.ejecutar(sentencia)
    def estados_nuevo(self, str_PkModulo, str_Pkregistro):
        self.mysql_con.ejecutar('insert into `web_estados_doc` (`PkModulo`, `c_estado`, `estado_inicial`, `estado_final`, `color`, `pkregistro`, `display`, `usuarios`) VALUES ('+str(str_PkModulo)+', "Estado", "", "", "btn bg-green btn-flat margin", "'+str(str_Pkregistro)+'", "Display", "")')  
        return self.mysql_con.table('select * from web_estados_doc order by pkweb_estados_doc desc LIMIT 1')  
    def lista_estados_condicion(self, str_pkestado):
        sentencia = "select * from web_estados_doc_cond where pkestado ="+ str(str_pkestado)
        return self.mysql_con.table(sentencia)  
    def lista_estados(self, str_pkmodulo):
        sentencia = "select * from web_estados_doc where PkModulo ="+ str(str_pkmodulo)
        return self.mysql_con.table(sentencia)   
    def lista_pdf(self, str_pkmodulo):
        sentencia = "select * from plantillas where PkModulo ="+ str(str_pkmodulo)
        return self.mysql_con.table(sentencia)          
    def lista_pdf_porpk(self, str_pkplantilla):
        sentencia = "select * from plantillas where PkPlantilla ="+ str(str_pkplantilla)
        return self.mysql_con.table(sentencia)  
    def lista_pdf_eti(self, str_pksegmento):
        sentencia = "select * from plantillasetiquetas where PkSegmento = "+ str(str_pksegmento)
        return self.mysql_con.table(sentencia)  
    def lista_pdf_cmbc(self, str_pksegmento):
        sentencia = "select * from plantillascamposcabecera where PkSegmento = "+ str(str_pksegmento)
        return self.mysql_con.table(sentencia)  
    def lista_pdf_cmbd(self, str_pksegmento):
        sentencia = "select * from plantillascampos where PkSegmento = "+ str(str_pksegmento)
        return self.mysql_con.table(sentencia)  
    def lista_pdf_segmentos(self, str_pkplantilla):
        sentencia = "select * from plantillassegmentos where PkPlantilla = "+ str(str_pkplantilla)
        return self.mysql_con.table(sentencia)         
    def validar_query(self, senten):
        try:
            dataplo =  self.mysql_con.table(senten)
            return 'ok'
        except:
            return 'No'     
    def traer_modulos(self, str_usuario):
        sentencia = "select sysmodulogeneral.Nombre as 'Modulo', modulo.Nombre as 'ModProceso', modulo.tipo, modulo.PkModulo, modulo.Descripcion as 'Proceso' from modulo, sysmodulogeneral where modulo.Cabecera = sysmodulogeneral.PkModGen and modulo.Anulado = 'N' order by sysmodulogeneral.Orden, modulo.Orden"
        return self.mysql_con.table(sentencia)  
        
    def lista_modulos_gen(self, str_usuario):
        sentencia = "select DISTINCT sysmodulogeneral.Nombre as 'Modulo', sysmodulogeneral.PkModGen as 'pk' from modulo, sysmodulogeneral where modulo.Cabecera = sysmodulogeneral.PkModGen and modulo.Anulado = 'N' order by sysmodulogeneral.Orden, modulo.Orden"
        return self.mysql_con.table(sentencia)  
    def traer_modulos_por_cab(self, str_pkcabecera):
        sentencia = "select * from modulo where modulo.Cabecera = '"+str(str_pkcabecera)+"' and modulo.Anulado = 'N'"
        return self.mysql_con.table(sentencia)  
    def acc_por_mas_del(self, str_user_acc, str_pkmodulo, str_user_tipo):
        sentencia = "delete from web_a_permisos where pkmodulo = '"+str(str_pkmodulo)+"' and tipo ='"+str(str_user_tipo)+"' and usuario ='"+str(str_user_acc)+"'"
        self.mysql_con.ejecutar(sentencia)  
    def acc_por_mas(self, st_pkmodulo, st_usuario, st_ing, st_mod, st_con, st_eli, st_pkcabecera, st_tipo):
        sentencia = "insert INTO `web_a_permisos` (`pkmodulo`, `usuario`, `ing`, `mod`, `con`, `eli`, `pkcabecera`, `tipo`) VALUES ('"+str(st_pkmodulo)+"', '"+str(st_usuario)+"', '"+str(st_ing)+"', '"+str(st_mod)+"', '"+str(st_con)+"', '"+str(st_eli)+"', '"+str(st_pkcabecera)+"', '"+str(st_tipo)+"')" 
        self.mysql_con.ejecutar(sentencia)  
    def traer_usuario(self, str_usuario):
        sentencia = 'select * from usuario where usuario.Usuario = "'+ str(str_usuario) +'"'
        print(sentencia)
        return self.mysql_con.table(sentencia)  
    def traer_usuarioPk(self, str_usuario):
        sentencia = 'select * from usuario where usuario.PkUsuario = "'+ str(str_usuario) +'"'
        return self.mysql_con.table(sentencia)  
    def update_usuario_cla(self,t_us_cla1,str_pk):
        sentencia = "update `usuario` SET `hash`='"+str(t_us_cla1)+"' WHERE (`PkUsuario`='"+str(str_pk)+"')"
        self.mysql_con.ejecutar(sentencia)  
    def update_usuario(self,t_us_cla1,str_pk,t_us_use,t_us_nom,t_us_ape,t_us_car,t_us_cor,t_us_sri,t_us_adm,t_us_anu):
        if t_us_cla1 != '':
            sentencia = "update `usuario` SET `hash`='"+str(t_us_cla1)+"',`Usuario`='"+str(t_us_use)+"', `Nombre`='"+str(t_us_nom)+"', `Apellido`='"+str(t_us_ape)+"', `Anulado`='"+t_us_anu+"', `FechaExpiracion`='2024-07-11', `Admin`='"+t_us_adm+"', `Sri`='"+t_us_sri+"', `Cargo`='"+str(t_us_car)+"', `Correo`='"+str(t_us_cor)+"' WHERE (`PkUsuario`='"+str(str_pk)+"')"
        else:
            sentencia = "update `usuario` SET `Usuario`='"+str(t_us_use)+"', `Nombre`='"+str(t_us_nom)+"', `Apellido`='"+str(t_us_ape)+"', `Anulado`='"+t_us_anu+"', `FechaExpiracion`='2024-07-11', `Admin`='"+t_us_adm+"', `Sri`='"+t_us_sri+"', `Cargo`='"+str(t_us_car)+"', `Correo`='"+str(t_us_cor)+"' WHERE (`PkUsuario`='"+str(str_pk)+"')"
        self.mysql_con.ejecutar(sentencia) 
         
    def acceso_panel(self, str_user, str_pkpanel):
        sentencia = 'insert into `web_p_panel_user` (`usuario`, `pkpanel`) VALUES ("'+ str(str_user) +'", '+ str(str_pkpanel) +')'
        self.mysql_con.ejecutar(sentencia)              
    def borrar_paneles(self, str_user):
        sentencia = 'delete from web_p_panel_user where web_p_panel_user.usuario = "'+ str(str_user) +'"'
        self.mysql_con.ejecutar(sentencia)     
    def new_usuario(self, t_us_cla1, str_pk,t_us_use,t_us_nom,t_us_ape,t_us_car,t_us_cor,t_us_sri,t_us_adm,t_us_anu):
        sentencia = "insert into `usuario` (`Usuario`, `hash`, `Clave`, `Nombre`, `Apellido`, `Apellido2`, `Anulado`, `FechaExpiracion`, `Admin`, `Sri`, `Reportes`, `Campos`, `Plantillas`, `Acciones`, `Procesos_Modulos`, `Eliminar_Importar`, `Usuarios`, `Cargo`, `Correo`, `Telefono`) VALUES ('"+str(t_us_use)+"', '"+str(t_us_cla1)+"', '', '"+str(t_us_nom)+"', '"+str(t_us_ape)+"', 'ape2', '"+t_us_anu+"', '2019-12-27', '"+t_us_adm+"', '"+t_us_sri+"', 'N', 'N', 'N', 'N', 'N', 'N', 'N', '"+str(t_us_car)+"', '"+str(t_us_cor)+"', '0')"
        self.mysql_con.ejecutar(sentencia)  
    def del_usuario(self, str_pk):
        sentencia = 'delete from usuario where usuario.PkUsuario = "'+ str_pk +'"'
        self.mysql_con.ejecutar(sentencia)     
    def carga_list_user_paneles(self):
        return self.mysql_con.table('select * from web_p_panel') 
    def carga_list_user_paneles_user(self):
        return self.mysql_con.table('select * from web_p_panel_user') 
    def carga_list_user_completa_para_estado(self):
        return self.mysql_con.table('select * from usuario') 
    def carga_list_user_completa(self):
        return self.mysql_con.table('select * from usuario') 
    def traer_acc_usuario(self,t_user):
        return self.mysql_con.table('select * from web_a_permisos where usuario = "'+str(t_user)+'"')         
    def carga_secciones_ats(self, str_tipo):
        return self.mysql_con.table('select * from xml_query where tipo = "'+str(str_tipo)+'"')    
    def carga_pre_ejecutados(self, user):
        return self.mysql_con.table('select * from web_a_auto_ejecutable where usuario = "' + str(user) +'" or usuario ="Todos"')
    def sql_directo(self,V_sentencia):
        self.mysql_con.ejecutar(V_sentencia)
    def sql_traer_directo(self,V_sentencia):
        return self.mysql_con.table(V_sentencia)
    def traer_estado(self, V_Pkestado):
        return self.mysql_con.table('select * from web_p_estado where pkestado = ' + str(V_Pkestado))
    def traer_estado_cond(self, V_Pkestado):
        return self.mysql_con.table('select * from web_estados_doc_cond where pkestado = ' + str(V_Pkestado))        
    def traer_estado_nombre(self, V_Pkestado):
        return self.mysql_con.table('select * from web_estados_doc where pkweb_estados_doc = ' + str(V_Pkestado))                
    def traer_estructuras(self, V_pkmodulo):
        return self.mysql_con.table('select * from estructura where PkModulo = '+ str(V_pkmodulo))
    def traer_registro_est(self, v_tabla, v_registro):
        #return self.mysql_con.table('select * from '+ str(v_tabla)+' where Pk'+ str(v_tabla)+' = '+ str(v_registro))
        sebte =  'select * from '+ str(v_tabla)+' where Pk'+ str(v_tabla)+' = '+ str(v_registro)
        tabla_ret =self.mysql_con.table(sebte)
        return tabla_ret
    def traer_registro_est_det(self, v_tabla, v_registro):
        return self.mysql_con.table('select * from '+ str(v_tabla)+' where Pkcabecera = '+ str(v_registro))
    def permisos(self, V_user, V_pkmodulo):
        return self.mysql_con.table('select DISTINCT m.PkModulo AS "PkModulo",  WE.pk AS "id", WE.pk AS "PkOpciones", CASE WHEN WE.tipo = 1 THEN    "Consulta" WHEN WE.tipo = 2 THEN    "Ingresar" WHEN WE.tipo = 3 THEN    "Modificar" WHEN WE.tipo = 4 THEN   "Eliminar" END AS "Nombre" FROM web_a_permisos WE,  modulo M,   sysmodulogeneral S WHERE    WE.pkmodulo = M.PkModulo AND S.PkModGen = M.Cabecera and    WE.usuario = "' + V_user +'" AND M.PkModulo = "' + V_pkmodulo +'" AND M.anulado LIKE "N" ORDER BY   s.orden,    m.orden')
    def consulta(self, V_pkmodulo, V_top):
        tabla = self.mysql_con.table('select * from estructura where PkModulo = "' + V_pkmodulo +'" and hijade = 0')
        tabla_campos = self.mysql_con.table('select nombre from camposxestructura where PkEstructura = "' + str(tabla[0]['PkEstructura']) +'" and visible = "Y" and anulado = "N" order by posicion, x, y')
        txt_taer = 'pk'+ tabla[0]['Nombre'] + ', '
        for a in tabla_campos:
            txt_taer = txt_taer + ' cast(' + a['nombre'] + ' as char) as "' + a['nombre'] + '" , '
        txt_taer = txt_taer[:-2]
        sentencia_rebuscar = 'select ' + txt_taer +' from ' + tabla[0]['Nombre']
        sentencia = 'select ' + txt_taer +' from ' + tabla[0]['Nombre'] + ' order by pk' + tabla[0]['Nombre'] + ' desc limit ' + str(V_top) 
        registros =  self.mysql_con.cursor_tabla(sentencia)
        return [tabla, tabla_campos, registros[0], registros[1], sentencia_rebuscar]    
    def consulta_orden_web(self, V_pkmodulo, V_top):
        tabla = self.mysql_con.table('select * from estructura where PkModulo = "' + V_pkmodulo +'" and hijade = 0')
        tabla_campos = self.mysql_con.table('select nombre from camposxestructura where PkEstructura = "' + str(tabla[0]['PkEstructura']) +'" and visible = "Y" and anulado = "N" order by PosicionConsulta')
        txt_taer = 'pk'+ tabla[0]['Nombre'] + ', '
        for a in tabla_campos:
            txt_taer = txt_taer + ' cast(' + a['nombre'] + ' as char) as "' + a['nombre'] + '" , '
        txt_taer = txt_taer[:-2]
        sentencia_rebuscar = 'select ' + txt_taer +' from ' + tabla[0]['Nombre']
        sentencia = 'select ' + txt_taer +' from ' + tabla[0]['Nombre'] + ' order by pk' + tabla[0]['Nombre'] + ' desc limit ' + str(V_top) 
        registros =  self.mysql_con.cursor_tabla(sentencia)
        return [tabla, tabla_campos, registros[0], registros[1], sentencia_rebuscar]        
    def eliminar(self, V_pkmodulo, V_pkregistro, t_usuario):
        sentencia = 'select * from estructura where PkModulo = "' + V_pkmodulo +  '"'
        tablas = self.mysql_con.table(sentencia)
        if len(tablas) > 2:
            self.mysql_con.ejecutar(sentencia)                
        if len(tablas) > 1:
            sentencia = "delete from " + tablas[1]['Nombre'] + " where pkcabecera in(SELECT pk" + tablas[0]['Nombre'] + " from " + tablas[0]['Nombre'] + " where pk" + tablas[0]['Nombre'] + " = " + V_pkregistro + ")"
            self.mysql_con.ejecutar(sentencia)        
        sentencia = "delete from " + tablas[0]['Nombre'] + " where pk" + tablas[0]['Nombre'] + " = " + V_pkregistro
        self.mysql_con.ejecutar(sentencia)
        sente = 'insert into `llankay_log` (`sentencia`, `usuario`, `fecha`, `ip`) VALUES ("'+str(sentencia)+'", "'+str(t_usuario)+'", now(), "Eliminar")'
        self.mysql_con.ejecutar(sente)


    def filtro(self, v_senten, v_where_campo, v_where_valor, v_top):
        v_senten =v_senten[1:-1]
        sentencia = v_senten + ' where ' + v_where_campo + ' like "' + v_where_valor + '%" limit ' + str(v_top) 
        registros =  self.mysql_con.cursor_tabla(sentencia)
        return [registros[0], registros[1]]    
    def filtro_senten(self, v_select, v_tabla, v_where, v_top):
        sentencia = 'select ' + v_select + ' from ' + v_tabla + ' where (' + v_where + ') order by pk' + v_tabla + ' desc limit ' + v_top
        return(self.mysql_con.cursor_tabla(sentencia))
    def main_reportesqvisibles(self, V_pkrepo):
        sentencia = 'select reportesqvisibles.colores as "colores", reportesqvisibles.Pkqvisibles as "Pkqvisibles", reportesqvisibles.columnas as "columnas", reportesqvisibles.largos as "largos", reportesqvisibles.nivel as "nivel", reportesqvisibles.Formato as "FormatoImpresion", reportesqvisibles.Formato_det as "Formato_det", reportesqvisibles.tab as "tab", reportesqvisibles.Lineas as "Lineas", reportesqvisibles.Cabecera as "Cabecera", reportesmain.PkReporte as "PkReporte", reportesmain.Nombre as "Nombre", reportesmain.Descripcion as "Descripcion", reportesmain.Anulado as "Anulado", reportesmain.PkModulo as "PkModulo", reportesmain.cabeceras as "cabeceras", reportesmain.formato as "formatoPermitido", reportesmain.posicion as "posicion", reportesmain.Arch_Excell as "Arch_Excell", reportesmain.Con_detalle as "Con_detalle", reportesmain.Tipo as "Tipo" from reportesqvisibles, reportesmain where reportesmain.PkReporte = reportesqvisibles.PkReporte and reportesmain.PkReporte =' + V_pkrepo 
        return self.mysql_con.table(sentencia)
    def main_reportesqtotales(self, V_pkrepo):
        sentencia = 'select * FROM reportesqtotales WHERE nivel = 1 and reportesqtotales.PkReporte = ' + str(V_pkrepo)
        return self.mysql_con.table(sentencia)
    def tablas(self, V_pkmodulo):
        tablas = self.mysql_con.table('select * from estructura where PkModulo = "' + str(V_pkmodulo) +'"')                
        return tablas
    def t_estados(self, V_pkmodulo, V_usuario):
        t_sentencia = 'select * from web_estados_doc, usuario where ((usuario.Usuario = "' + str(V_usuario) +'" and usuario.Admin = "Y") or (web_estados_doc.usuarios like "%(' + str(V_usuario) +')%" and usuario.Usuario = "' + str(V_usuario) +'")) and PkModulo = "' + V_pkmodulo +'"'              
        tablas = self.mysql_con.table(t_sentencia)
        return tablas        
    def traer_campos_por_pkestr_solo_visible(self, PkEstructura):
        Campos = self.mysql_con.table('select * from camposxestructura where PkEstructura = "' + str(PkEstructura) +'" and anulado = "N" and (visible = "Y" or Eliminable = "N") order by posicion, x, y')
        return Campos   
    def traer_campos_por_pkestr(self, PkEstructura):
        Campos = self.mysql_con.table('select * from camposxestructura where PkEstructura = "' + str(PkEstructura) +'" and anulado = "N" order by posicion, x, y')
        return Campos    
    def campos(self, tablas):
        Campos_cabecera = self.mysql_con.table('select * from camposxestructura where PkEstructura = "' + str(tablas[0]['PkEstructura']) +'" and anulado = "N" order by posicion, x, y')
        Campos_detalle= 0
        Campos_subdetalle = 0
        if len(tablas) > 1:
            Campos_detalle = self.mysql_con.table('select * from camposxestructura where PkEstructura = "' + str(tablas[1]['PkEstructura']) +'" and anulado = "N" order by posicion, x, y')
            if len(tablas) > 2:
                Campos_subdetalle = self.mysql_con.table('select * from camposxestructura where PkEstructura = "' + str(tablas[2]['PkEstructura']) +'" and anulado = "N" order by posicion, x, y')
        return [Campos_cabecera, Campos_detalle, Campos_subdetalle]  
    def valores(self, V_pkregistro, tablas, campos):
        select = ""
        for a in campos["campos_cab"]:
            select = select + a['Nombre'] + ', '
        select = select[:-2]
        senten = 'select '+ select +' from ' + str(tablas[0]['Nombre']) +' where Pk' + str(tablas[0]['Nombre']) +' = "' + V_pkregistro +'"'
        val_cabecera = self.mysql_con.table(senten)
        val_detalle= 0
        val_subdetalle = 0
        if len(tablas) > 1:
            select = ""
            for a in campos["campos_det"]:
                select = select + a['Nombre'] + ', '
            select = select[:-2]
            val_detalle = self.mysql_con.table('select '+ select +' from ' + str(tablas[1]['Nombre']) +' where PKCabecera = "' + V_pkregistro +'" order by pk'+str(tablas[1]['Nombre']) + ' desc')
            if len(tablas) > 2:
                select = ""
                for a in campos["campos_subdet"]:
                    select = select + a['Nombre'] + ', '
                select = select[:-2]
                val_subdetalle = self.mysql_con.table('select '+ select +' from ' + str(tablas[2]['Nombre']) +' where PKCabecera in(select PK' + str(tablas[1]['Nombre']) +' from ' + str(tablas[1]['Nombre']) +' where PKCabecera = "' + V_pkregistro +'")')
        return [val_cabecera, val_detalle, val_subdetalle]  
    
    def valores_codniones(self, tablas, campos, condiciones):
        select = ""
        t_mix = condiciones[0]['Campo'].split(';')
        for a in campos["campos_cab"]:
            select = select + a['Nombre'] + ', '
        select = select[:-2]
        senten = 'select '+ select +' from ' + str(tablas[0]['Nombre']) +' where ' + str(t_mix[0]) +' like "' + str(condiciones[0]['Valor']) +'" '+str(condiciones[0]['cond_base'])+' order by pk' + str(tablas[0]['Nombre']) +' desc'
        val_cabecera = self.mysql_con.table(senten)
        return [val_cabecera]
    def cmpconso_ejecutar(self, cmpsenten):
        tablas = self.mysql_con.table(cmpsenten)                
        return tablas
    def solo_ejecutar(self, cmpsenten):
        tablas = self.mysql_con.ejecutar(cmpsenten)                
        return tablas
    def cmpbuscador_ejecutar_sun_limite(self, cmpsenten):
        print(cmpsenten)
        tablas = self.mysql_con.table(cmpsenten + " limit 100")  
        return tablas
    def cmpbuscador_ejecutar(self, cmpsenten, limit):
        tablas = self.mysql_con.table(cmpsenten + " limit " + str(limit))  
        return tablas
    def cmpbuscador_ejecutar_cur(self, cmpsenten, limit):
        tablas_cur = self.mysql_con.cursor_tabla(cmpsenten + " limit " + str(limit))  
        return tablas_cur
    def reporte_ejecutar(self, cmpsenten):
        try:
            tablas = self.mysql_con.como_cursor(cmpsenten) 
            return {'error':0, 'resul':tablas}
        except Exception as e: 
            return {'error':str(e)}
    def validaciones(self, tablas):
        devolver = []
        for temp in tablas:
            sentencia = "select * from condiciones, condicionesdetalle  where condiciones.PkCondicion = condicionesdetalle.Pkcondicion and condiciones.PkEstructura = '" + str(temp["PkEstructura"]) + "'"        
            devolver.append(self.mysql_con.table(sentencia))
        return devolver
    def funciones_campos(self, tablas, campos):
        fun_cab = self.crear_data_fun(campos["campos_cab"])
        if len(tablas) > 1:
            fun_det = self.crear_data_fun(campos["campos_det"])
            if len(tablas) > 2:
                fun_subdet = self.crear_data_fun(campos["campos_subdet"])
            else:
                fun_subdet = 0
        else:
            fun_det = 0
            fun_subdet = 0
        return([fun_cab, fun_det, fun_subdet]) 
    def funciones_campos_directo(self, tablas, campos):
        fun_cab = self.crear_data_fun(campos[0])
        if len(tablas) > 1:
            fun_det = self.crear_data_fun(campos[1])
            if len(tablas) > 2:
                fun_subdet = self.crear_data_fun(campos[2])
            else:
                fun_subdet = 0
        else:
            fun_det = 0
            fun_subdet = 0
        return([fun_cab, fun_det, fun_subdet])      
    def funciones_campos_dict_pkestruc(self, tablas, campos):
        dicT_rep = {}
        fun_cab = self.crear_data_fun(campos[0])
        dicT_rep.update({tablas[0]["PkEstructura"]:fun_cab})
        if len(tablas) > 1:
            fun_det = self.crear_data_fun(campos[1])
            dicT_rep.update({tablas[1]["PkEstructura"]:fun_det})
            if len(tablas) > 2:
                fun_subdet = self.crear_data_fun(campos[2])
                dicT_rep.update({tablas[2]["PkEstructura"]:fun_subdet})
            else:
                fun_subdet = 0
        else:
            fun_det = 0
            fun_subdet = 0
        return(dicT_rep)     
    def crear_data_fun(self, campos):
        fun_cab = {}
        for i in campos:
            if i["TablaCampo"] == 'cmpformquery':
                estru = self.mysql_con.table("select * from cmpformquery where PkCampo = '" + str(i["PkCampo"]) + "'")
                fun_cab.update({i["Nombre"]:estru})
            if i["TablaCampo"] == 'cmptxtsimple':
                estru = self.mysql_con.table("select * from cmptxtsimple where PkCampo = '" + str(i["PkCampo"]) + "'")
                fun_cab.update({i["Nombre"]:estru})
            if i["TablaCampo"] == 'cmpnumsimple':
                estru = self.mysql_con.table("select * from cmpnumsimple where PkCampo = '" + str(i["PkCampo"]) + "'")
                fun_cab.update({i["Nombre"]:estru})
            if i["TablaCampo"] == 'cmpnumsecuencial':
                estru = self.mysql_con.table("select * from cmpnumsecuencial where PkCampo = '" + str(i["PkCampo"]) + "'")
                fun_cab.update({i["Nombre"]:estru})
            if i["TablaCampo"] == 'cmpopcmultiple':
                estru = self.mysql_con.table("select C.PkCampo, D.Nombre, D.Valor, D.Color from cmpopcmultiple C, cmpopcionvalores D where C.PkCampo = D.PkCampo and C.PkCampo = '" + str(i["PkCampo"]) + "'")
                fun_cab.update({i["Nombre"]:estru})
            if i["TablaCampo"] == 'cmpsistema':
                estru = self.mysql_con.table("select * from cmpsistema C, cmpsentenciavalores V where C.PkCampo = '" + str(i["PkCampo"]) + "' and C.PkId = V.PkId")
                fun_cab.update({i["Nombre"]:estru})
            if i["TablaCampo"] == 'cmpformuladetalle':
                estru = self.mysql_con.table("select * from cmpformuladetalle where PkCampo = '" + str(i["PkCampo"]) + "'")
                estru2 = self.mysql_con.table("select * from cmpformuladetallecondicion where PkCampo = '" + str(i["PkCampo"]) + "'")
                fun_cab.update({i["Nombre"]:[estru, estru2]})
            if i["TablaCampo"] == 'cmpfecha':
                estru = self.mysql_con.table("select * from cmpfecha where PkCampo = '" + str(i["PkCampo"]) + "'")
                fun_cab.update({i["Nombre"]:estru})
            if i["TablaCampo"] == 'cmpreferencia':
                estru = self.mysql_con.table("select * from cmpreferencia where PkCampo = '" + str(i["PkCampo"]) + "'")
                estru2 = self.mysql_con.table("select * from cmpreferenciacondicion where PkCampo = '" + str(i["PkCampo"])+ "'")
                estru3 = self.mysql_con.table("select * from cmpreferenciaacciones where PkCampo = '" + str(i["PkCampo"]) + "'")
                estru4 = []
                for acc in estru3:
                    temp1 = self.mysql_con.table("select * from cmpreferenciaacciones_extra where PkAccion = '" + str(acc["PkAccion"]) + "'")
                    temp2 = self.mysql_con.table("select * from cmpreferenciaaccionesform where PkAccion = '" + str(acc["PkAccion"]) + "'")
                    temp3 = self.mysql_con.table("select * from cmpreferenciaaccioneswhere where PkAccion = '" + str(acc["PkAccion"]) + "'")
                    temp4 = self.mysql_con.table("select * from cmpreferenciaaccionescolumnas where PkAccion = '" + str(acc["PkAccion"]) + "'")
                    temp5 = []
                    for t_comulnas in temp4:
                        t_comulnasdet = self.mysql_con.table("select * from cmpreferenciaaccionescolumnasdetalle where PkColumna = '" + str(t_comulnas["PkColumna"]) + "'")
                        temp5.append(t_comulnasdet)
                    estru4.append([temp1, temp2, temp3, temp4, temp5])
                fun_cab.update({i["Nombre"]:[estru, estru2, estru3, estru4]})
            if i["TablaCampo"] == 'cmpreferenciaadjunto':
                estru = self.mysql_con.table("select * from cmpreferenciaadjunto where PkCampo = '" + str(i["PkCampo"]) + "'")
                fun_cab.update({i["Nombre"]:estru})
            if i["TablaCampo"] == 'cmpoperacion':
                estru = self.mysql_con.table("select * from cmpoperacion where PkCampo = '" + str(i["PkCampo"]) + "'")
                estru2 = self.mysql_con.table("select * from cmpoperaciondetalle where PkCampos = '" + str(i["PkCampo"]) + "'")
                fun_cab.update({i["Nombre"]:[estru, estru2]})
            if i["TablaCampo"] == 'cmpconsolidado':
                estru = self.mysql_con.table("select * from cmpconsolidado where PkCampo = '" + str(i["PkCampo"]) + "'")
                estru2 = self.mysql_con.table("select * from cmpconsolidadofrom where PkCampo = '" + str(i["PkCampo"]) + "'")
                estru3 = self.mysql_con.table("select * from cmpconsolidadowhere  where PkCampo = '" + str(i["PkCampo"]) + "'")
                estru4 = self.mysql_con.table("select * from cmpconsolidadocolumna  where PkCampo = '" + str(i["PkCampo"]) + "'")
                fun_cab.update({i["Nombre"]:[estru, estru2, estru3, estru4]})
            if i["TablaCampo"] == 'cmparchivo':
                estru = self.mysql_con.table("select * from cmparchivo where PkCampo = '" + str(i["PkCampo"]) + "'")
                fun_cab.update({i["Nombre"]:estru})
            if i["TablaCampo"] == 'cmpnumeroaletras':
                estru = self.mysql_con.table("select * from cmpnumeroaletras where PkCampo = '" + str(i["PkCampo"]) + "'")
                fun_cab.update({i["Nombre"]:estru})
            if i["TablaCampo"] == 'cmpdecabecera':
                estru = self.mysql_con.table("select * from cmpdecabecera where PkCampo = '" + str(i["PkCampo"]) + "'")
                fun_cab.update({i["Nombre"]:estru})
            if i["TablaCampo"] == 'cmpelectronico':
                temp0 = self.mysql_con.table("select * from cmpelectronico where PkCampo = '" + str(i["PkCampo"]) + "'")
                temp1 = self.mysql_con.table("select * from cmpelect_infotributaria where pkcampo =  "+ str(i["PkCampo"]))
                temp2 = self.mysql_con.table("select * from cmpelect_infoadicional where pkcampo =  "+ str(i["PkCampo"]))
                if temp0[0]["Tipo"] == "Factura":
                    temp3 = self.mysql_con.table("select * from cmpelect_infofactura where pkcampo =  "+ str(i["PkCampo"]))
                    temp4 = self.mysql_con.table("select * from cmpelect_detalles where pkcampo =  "+ str(i["PkCampo"]))
                if temp0[0]["Tipo"] == "Retencion":
                    temp3 = self.mysql_con.table("select * from cmpelect_ret_impuestos where pkcampo =  "+ str(i["PkCampo"]))
                    temp4 = self.mysql_con.table("select * from cmpelect_ret_infocompretencion where pkcampo =  "+ str(i["PkCampo"]))
                if temp0[0]["Tipo"] == "Nota credito":
                    temp3 = self.mysql_con.table("select * from cmpelect_notacredito_detalles where pkcampo =  "+ str(i["PkCampo"]))
                    temp4 = self.mysql_con.table("select * from cmpelect_notacredito_info where pkcampo =  "+ str(i["PkCampo"]))
                if temp0[0]["Tipo"] == "Nota debito":
                    temp3 = self.mysql_con.table("select * from cmpelect_notadebito_info where pkcampo =  "+ str(i["PkCampo"]))
                    temp4 = self.mysql_con.table("select * from cmpelect_notadebito_motivos where pkcampo =  "+ str(i["PkCampo"]))
                if temp0[0]["Tipo"] == "Guia remision":
                    temp3 = self.mysql_con.table("select * from cmpelect_guia_destinatarios where pkcampo =  "+ str(i["PkCampo"]))
                    temp4 = self.mysql_con.table("select * from cmpelect_guia_info where pkcampo =  "+ str(i["PkCampo"]))
                fun_cab.update({i["Nombre"]:[temp0, temp1, temp2, temp3, temp4]})   
            if i["TablaCampo"] == 'cmpcondicional':
                estru = self.mysql_con.table("select * from cmpcondicional where PkCampo = '" + str(i["PkCampo"]) + "'")
                estru2 = self.mysql_con.table("select * from cmpcondicionaldetalle where PkCampo = '" + str(i["PkCampo"]) + "'")
                fun_cab.update({i["Nombre"]:[estru, estru2]})

        return fun_cab
    def TraerNombre_tabla(self, V_PkModulo):
        sentencia = "select * from estructura where pkmodulo = '" +  str(V_PkModulo) + "' and hijaDe = 0"        
        return self.mysql_con.table(sentencia)
    def TraerAccionesCabecera(self, V_pkmodulo):
        sentencia = "select * from acciones where PkModulo = '" +  str(V_pkmodulo) + "' and Anulado = 'N'"
        return self.mysql_con.table(sentencia)
    def TraerAccionescondiciones(self, V_PkAccion):
        sentencia = "select * from accionescondiciones where PkAccion = '" +  str(V_PkAccion) + "'"
        return self.mysql_con.table(sentencia)
    def TraerUpdateFrom(self, V_PkAccion):
        sentencia = "Select * from AccionesUpdate where PkAccion = '" + str(V_PkAccion) + "'"
        return self.mysql_con.table(sentencia)
    def TraerUpdateWhere(self, V_PkAccion):
        sentencia = "Select * from AccionesUpdatewhere where PkAccion = '" + str(V_PkAccion) + "'"
        return self.mysql_con.table(sentencia)
    def TraerUpdatehaving(self, V_PkAccion):
        sentencia = "Select * from accionesupdatehaving where PkAccion = '" + str(V_PkAccion) + "'"
        return self.mysql_con.table(sentencia)
    def TraerUpdateSet(self, V_PkAccion):
        sentencia = "Select * from accionesupdateset where PkAccion = '" + str(V_PkAccion) + "'"
        return self.mysql_con.table(sentencia)
    def ListadoTablas(self, V_PkModulo):
        sentencia = "Select * from estructura where anulado = 'N' and PkModulo = '" + str(V_PkModulo) + "' order by Nombre"
        return self.mysql_con.table(sentencia)
    def TraerAccionesNumeroRegistrosCabeceras(self, V_PkAccion):
        sentencia = "select * from accionesnumregistros where PkAccion = '" + str(V_PkAccion) + "' and PkCabecera = 0 order by PkEstructura"
        return self.mysql_con.table(sentencia)
    def TraerAccionesCampos(self, V_PkAccionL2):
        sentencia = "select * from accionescampos where PkAccionL2 = '" + str(V_PkAccionL2) + "'"
        return self.mysql_con.table(sentencia)
    def TraerAccionesNumeroRegistros(self, V_PkAccion):
        sentencia = "select * from accionesnumregistros where PkAccion = '" + str(V_PkAccion) + "' order by PkCabecera"
        return self.mysql_con.table(sentencia)
    def hacer_query_TraerFrom(self, V_PkAccionL2):
        sentencia = "select * from accionesfrom where PkAccionL2 = '" + str(V_PkAccionL2) + "'"
        return self.mysql_con.table(sentencia)
    def hacer_query_TraerWhere(self, V_PkAccionL2):
        sentencia = "select * from accioneswhere where PkAccionL2 = '" + str(V_PkAccionL2) + "'"
        return self.mysql_con.table(sentencia)
    def hacer_query_TraerColumnas(self, V_PkAccionL2):
        sentencia = "select * from accionescolumnas where PkAccionL2 = '" + str(V_PkAccionL2) + "'"
        return self.mysql_con.table(sentencia)
    def hacer_query_TraerColumnasDetalle(self, V_PkColumna):
        sentencia = "select * from accionescolumnasdetalle where PkColumna = '" + str(V_PkColumna) + "'"
        return self.mysql_con.table(sentencia)
    def traer_campos_ref(self, V_pkcampo):
        sentencia = "select * from cmpreferencia where pkcampo = '" + str(V_pkcampo) + "'"
        return self.mysql_con.table(sentencia)
    def traer_campos_ref_rep(self, V_pkcampo):
        sentencia = "select * from reportesreferencias where PkReferencia = '" + str(V_pkcampo) + "'"
        return self.mysql_con.table(sentencia)
    def plantillasMain(self, V_PkModulo):
        sentencia = "select * from plantillas where PkModulo = '" + str(V_PkModulo) + "'"
        return self.mysql_con.table(sentencia)
    def plantillassegmentos(self, V_PkPlantilla):
        sentencia = "select * from plantillassegmentos where PkPlantilla = '" + str(V_PkPlantilla) + "'"
        return self.mysql_con.table(sentencia)
    def plantillascondiciones(self, V_PkPlantilla):
        sentencia = "select * from plantillascondiciones where PkPlantillas = '" + str(V_PkPlantilla) + "'"
        return self.mysql_con.table(sentencia)
    def plantillascampos(self, V_PkSegmento):
        sentencia = "select * from plantillascampos where PkSegmento = '" + str(V_PkSegmento) + "'"
        return self.mysql_con.table(sentencia)
    def plantillascampos3nivel(self, V_PkSegmento):
        sentencia = "select * from plantillascampos3nivel where PkSegmento = '" + str(V_PkSegmento) + "'"
        return self.mysql_con.table(sentencia)
    def plantillascamposcabecera(self, V_PkSegmento):
        sentencia = "select * from plantillascamposcabecera where PkSegmento = '" + str(V_PkSegmento) + "'"
        return self.mysql_con.table(sentencia)
    def plantillasetiquetas(self, V_PkSegmento):
        sentencia = "select * from plantillasetiquetas where PkSegmento = '" + str(V_PkSegmento) + "'"
        return self.mysql_con.table(sentencia)
    def modi_fast(self, V_pkregistro, V_tabla,  V_nombre, V_valor):
        sentencia = "update "+ str(V_tabla) +" set "+ str(V_nombre) +" = '"+ str(V_valor) +"' where Pk"+ str(V_tabla) +" = '" + str(V_pkregistro) + "'"
        return self.mysql_con.ejecutar(sentencia)
    def TraerCampo_electr(self, PkCampo, PkEstructura):
        sentencia = "select * from cmpelectronico where PkCampo = '" + str(PkCampo) + "' and PkEstructura = '" + str(PkEstructura) + "'"
        return self.mysql_con.table(sentencia)
    def Traercmpelect_infoTributaria(self, PkCampo):
        sentencia = "select * from cmpelect_infoTributaria where pkcampo = '" + str(PkCampo) + "'"
        return self.mysql_con.table(sentencia)
    def cmpelect_infoTributaria(self, PkCampo):
        sentencia = "select * from cmpelect_infoTributaria where pkcampo = '" + str(PkCampo) + "'"
        return self.mysql_con.table(sentencia)
    def cmpelect_infoFactura(self, PkCampo):
        sentencia = "select * from cmpelect_infoFactura where pkcampo = '" + str(PkCampo) + "'"
        return self.mysql_con.table(sentencia)
    def cmpelect_detalles(self, PkCampo):
        sentencia = "select * from cmpelect_detalles where pkcampo = '" + str(PkCampo) + "'"
        return self.mysql_con.table(sentencia)
    def cmpelect_infoadicional(self, PkCampo):
        sentencia = "select * from cmpelect_infoadicional where pkcampo = '" + str(PkCampo) + "'"
        return self.mysql_con.table(sentencia)
    def traer_campo_por_id(self, PkCampo):
        sentencia = "select * from camposxestructura where PkId = '" + str(PkCampo) + "'"
        return self.mysql_con.table(sentencia)
    def actualizar_dato_campo_id(self, PkCampo, atributo, valor):
        sentencia = "update camposxestructura set " + str(atributo) + " = '" + str(valor) + "' where camposxestructura.PkId = " + str(PkCampo) 
        return self.mysql_con.ejecutar(sentencia)
    def traer_buscador_por_id(self, PkCampo):
        sentencia = "select * from cmpreferencia where PkCampo = '" + str(PkCampo) + "'"
        return self.mysql_con.table(sentencia)
    def traer_pkestru_por_campo_por_id(self, PkCampo):
        sentencia = "select pkestructura from camposxestructura where PkId = '" + str(PkCampo) + "'"
        return self.mysql_con.table(sentencia)
    def traer_listado_cc_por_estru(self, PKEtruc, dire, posi, Pkid, posiWEB):
        if dire == '0':
            sentencia = "select * from camposxestructura where PkEstructura = '" + str(PKEtruc) + "' and PkId != '" + str(Pkid) + "' and Anulado = 'N' and Visible = 'Y' and posicionweb = '" +str(posiWEB)+ "' and Posicion < " +str(posi)
        else:
            sentencia = "select * from camposxestructura where PkEstructura = '" + str(PKEtruc) + "' and PkId != '" + str(Pkid) + "' and Anulado = 'N' and Visible = 'Y' and posicionweb = '" +str(posiWEB)+ "' and Posicion > " +str(posi)        
        return self.mysql_con.table(sentencia)


class transsaciones:
    def __init__(self, conn_user, conn_pass, conn_base, conn_ip):
        self.mysql_con = web.mysql.class_mysql_trass(conn_user, conn_pass, conn_base, conn_ip)
    def ingreso_base(self, senten_cab, senten_det, senten_acc, pkmodulo, senten_subdet):
        self.mysql_con.empiza()
        for i in senten_cab:
            if self.mysql_con.ejecutar(i) == False:
                self.mysql_con.rollback()
                return False
        for i in senten_det:
            if self.mysql_con.ejecutar(i) == False:
                self.mysql_con.rollback()
                return False
        for i in senten_subdet:
            if self.mysql_con.ejecutar(i) == False:
                self.mysql_con.rollback()
                return False
        for i in senten_acc:
            if self.mysql_con.ejecutar(i) == False:
                self.mysql_con.rollback()
                return False
        self.mysql_con.commit()
        return True
    def ingreso_impot(self, senten):
        self.mysql_con.empiza()
        for i in senten:
            if self.mysql_con.ejecutar(i) == False:
                self.mysql_con.rollback()
                return False
        self.mysql_con.commit()
        return True
    def ingreso_post(self, senten_acc, pkmodulo):
        self.mysql_con.empiza()
        for i in senten_acc:
            if self.mysql_con.ejecutar(i) == False:
                self.mysql_con.rollback()
                return False
        self.mysql_con.commit()
        return True
    def auditoria_ingresar(self, t_data, t_usuario, t_accion):
        self.mysql_con.empiza()
        sente = 'insert into `llankay_log` (`sentencia`, `usuario`, `fecha`, `ip`) VALUES ("'+str(t_data)+'", "'+str(t_usuario)+'", now(), "'+str(t_accion)+'")'
        self.mysql_con.ejecutar(sente)
        self.mysql_con.commit()
        return True


class paneles:
    def __init__(self, conn_user, conn_pass, conn_base, conn_ip):
        self.mysql_con = web.mysql.class_mysql(conn_user, conn_pass, conn_base, conn_ip)
    def ficha_existe(self, t_pkpanle, t_fecha, t_pkval):
        sentencia = "select * from web_p_panel_grupo_track where pkpanel = '"+str(t_pkpanle)+"' and fecha = '"+str(t_fecha)+"' and pk_valor = '"+str(t_pkval)+"'order by fecha desc"
        return self.mysql_con.table(sentencia)
    def ficha_new(self, t_pkpanle, t_fecha, t_pkval):
        sentencia = "insert into `web_p_panel_grupo_track` (`pkpanel`, `fecha`, `pk_valor`) VALUES ('"+str(t_pkpanle)+"', '"+str(t_fecha)+"', '"+str(t_pkval)+"')"
        self.mysql_con.ejecutar(sentencia)  
    def traer_panel_por_pk(self, pk):
        sentencia = 'select * from  web_p_panel where  web_p_panel.pkPanel = "'+ str(pk) +'"'
        return self.mysql_con.table(sentencia)
    def traer_paneles_fechas_fichaspk(self, pkPanel, pkvalor):
        sentencia = 'select * from web_p_panel_grupo_track where web_p_panel_grupo_track.pkpanel = "'+ str(pkPanel) +'" and web_p_panel_grupo_track.pk_valor = "'+str(pkvalor)+'"'
        return self.mysql_con.table(sentencia)
    def traer_paneles_pdf_fichaspk(self, pk):
        sentencia = 'select * from  web_p_panel_plantilla_panel_valor where  web_p_panel_plantilla_panel_valor.pkpanel = "'+ str(pk) +'"'
        return self.mysql_con.table(sentencia)
    def traer_paneles_fichaspk(self, pk):
        sentencia = 'select * from  web_p_panel_grupos where  web_p_panel_grupos.pkpanel = "'+ str(pk) +'" ORDER BY orderby'
        return self.mysql_con.table(sentencia)
    def traer_estados(self, pkpanel):
        sentencia = 'select * from web_p_estado where web_p_estado.pkpanel = '+ str(pkpanel)
        return self.mysql_con.table(sentencia)
    def traer_notas_valores(self, senten):
        return self.mysql_con.table(senten)
    def traer_nota_pk(self, pknota):
        sentencia = 'select * from web_p_nota where web_p_nota.pknota = '+ str(pknota)
        return self.mysql_con.table(sentencia)     
    def traer_web_p_com_txt(self, pk, origen):
        sentencia = 'select * from web_p_com_txt where web_p_com_txt.pk = '+ str(pk) + ' and web_p_com_txt.origen = "'+str(origen)+'" order by fecha desc'
        return self.mysql_con.table(sentencia)
    def marcar_leidos(self, pk, origen, usuario):
        sentencia = 'update web_p_com_txt set web_p_com_txt.visto = 1 WHERE   web_p_com_txt.pk = '+ str(pk) + ' AND web_p_com_txt.origen = "'+str(origen)+'" and web_p_com_txt.user_destino = "'+str(usuario)+'"'
        self.mysql_con.ejecutar(sentencia)  
    def traer_mensajes(self, usuario):
        sentencia = 'select * FROM  web_p_com_txt WHERE user_destino = "'+ str(usuario) + '" AND (visto is null or visto ="")  ORDER BY fecha DESC'
        return self.mysql_con.table(sentencia)
    def traer_tareas(self, usuario):
        sentencia = 'select * from web_p_tareas where (usuario = "'+str(usuario)+'" or user_destino = "'+str(usuario)+'") or web_p_tareas.pk in (select pktarea from web_p_tareas_indi where web_p_tareas_indi.user_destino = "'+str(usuario)+'")'
        return self.mysql_con.table(sentencia)
    def traer_subtareas(self, usuario):
        sentencia = 'select * from web_p_tareas, web_p_tareas_indi where (web_p_tareas.usuario = "'+str(usuario)+'" or web_p_tareas.user_destino = "'+str(usuario)+'" or web_p_tareas_indi.user_destino = "'+str(usuario)+'") and web_p_tareas_indi.pktarea = web_p_tareas.pk'
        return self.mysql_con.table(sentencia)   
    def traer_subtareas_pk(self, pktarea):
        sentencia = 'select * from web_p_tareas_indi where web_p_tareas_indi.pktarea = ' + str(pktarea)
        return self.mysql_con.table(sentencia)  
    def traer_subtareas_pkFiles(self, pktarea):
        sentencia = 'select web_p_tareas_url.* from web_p_tareas_indi, web_p_tareas_url where web_p_tareas_indi.pk = web_p_tareas_url.pktar and web_p_tareas_indi.pktarea = ' + str(pktarea) 
        return self.mysql_con.table(sentencia)  
    def traer_subtareas_pkcoments(self, pktarea):
        sentencia = 'select * from web_p_com_txt where origen = "CCtarea" and pk = ' + str(pktarea) + ' ORDER BY fecha DESC'
        return self.mysql_con.table(sentencia) 
    def add_file_sub_tarea(self, pktarea, url, nombre):
        sentencia = "insert INTO `web_p_tareas_url` (`nombre`, `url`, `pktar`) VALUES ('"+str(nombre)+"', '"+str(url)+"', '"+str(pktarea)+"')"
        self.mysql_con.ejecutar(sentencia)  
    def traer_areas(self):
        sentencia = 'select * from web_p_tareas_senten'
        res_t = self.mysql_con.table(sentencia)  
        return self.mysql_con.table(res_t[0]['Senten_area'])  
    def traer_proye(self):
        sentencia = 'select * from web_p_tareas_senten'
        res_t = self.mysql_con.table(sentencia)  
        return self.mysql_con.table(res_t[0]['Senten_proyectos'])  
    def traer_subtareas_pk_ultima(self, pktarea):
        sentencia = 'select * from web_p_tareas_indi where web_p_tareas_indi.pktarea = ' + str(pktarea) + ' order by pk desc limit 1'
        return self.mysql_con.table(sentencia)
    def traer_tareas_pk(self, pktarea):
        sentencia = 'select * from web_p_tareas where pk = ' + str(pktarea)
        return self.mysql_con.table(sentencia)
    def traer_tareas_modulo(self, pkmodulo, pkindi):
        sentencia = "select * from web_p_tareas where pkmodulo ='"+str(pkmodulo)+"' and pkdoc ='"+str(pkindi)+"'"
        return self.mysql_con.table(sentencia)
    def update_subtareas_estado(self, pktarea, estado):
        sentencia = 'update web_p_tareas_indi set web_p_tareas_indi.estado = if(web_p_tareas_indi.estado = 1, 0, 1) where pk = ' + str(pktarea)
        self.mysql_con.ejecutar(sentencia)
    def update_subtareas_aprobado(self, pktarea, estado):
        sentencia = 'update web_p_tareas_indi set web_p_tareas_indi.aprovado = if(web_p_tareas_indi.aprovado = 1, 0, 1) where pk = ' + str(pktarea)
        self.mysql_con.ejecutar(sentencia)        
    def tareas_finalizar(self, pktarea):
        sentencia = 'delete from web_p_tareas where pk= ' + str(pktarea)
        self.mysql_con.ejecutar(sentencia)        
    def tareas_sub_finalizar(self, pktarea):
        sentencia = 'delete from web_p_tareas_indi where pk= ' + str(pktarea)
        self.mysql_con.ejecutar(sentencia)
    def cambio_rapido(self, tabla, campo, valor, pkregistro):
        sentencia = 'update ' + str(tabla) + ' set ' + str(campo) + ' = "' + str(valor) + '" where Pk' + str(tabla) + ' = ' + str(pkregistro)
        self.mysql_con.ejecutar(sentencia)
    def tareas_crear(self, usuario, tarea, proyecto):
        sentencia = "insert INTO `web_p_tareas` (`usuario`, `user_destino`, `tarea`, `fecha`, `duracion`, `proyecto`) VALUES ('"+str(usuario)+"', '0', '"+str(tarea)+"', now(), '0', '"+str(proyecto)+"')"
        self.mysql_con.ejecutar(sentencia)
        sentencia = 'select * from web_p_tareas order by pk desc limit 1'
        return self.mysql_con.table(sentencia)
    def add_sub_tarea(self, pktarea, tarea, user_destino, fecha_ini, fecha_ent, area):
        sentencia = "insert into `web_p_tareas_indi` (`pktarea`, `tarea`, `estado`, `user_destino`, `fecha`,`fecha_entrega`, `area`, `aprovado`) VALUES ('"+str(pktarea)+"', '"+str(tarea)+"', '0', '"+str(user_destino)+"', '"+str(fecha_ini)+"', '"+str(fecha_ent)+"', '"+str(area)+"', '0')"
        self.mysql_con.ejecutar(sentencia)    
    def traer_usuarios(self):
        sentencia = 'select Usuario from usuario'
        return self.mysql_con.table(sentencia)        
    def traer_web_p_com_file(self, pknota):
        sentencia = 'select * from web_p_com_file where web_p_com_file.pknota = '+ str(pknota) + ' order by fecha'
        return self.mysql_con.table(sentencia)
    def traer_web_p_com_doc(self, pknota):
        sentencia = 'select * from web_p_com_doc where web_p_com_doc.pknota = '+ str(pknota) + ' order by fecha'
        return self.mysql_con.table(sentencia)
    def traer_web_p_com_chk(self, pknota):
        sentencia = 'select * from web_p_com_chk where web_p_com_chk.pknota = '+ str(pknota) + ' order by fecha'
        return self.mysql_con.table(sentencia)
    def grabar_agregar_nota_txt(self, pk, origen, usuario, texto, user_destino, pkmodulo):
        sentencia = 'INSERT INTO `web_p_com_txt` (`pk`, `origen`, `usuario`, `fecha`, `texto`, `user_destino`, `pkmodulo`) VALUES ("' + str(pk) + '", "' + str(origen) + '", "' + str(usuario) + '", "' + str(datetime.datetime.now()) + '", "' + str(texto) + '", "' + str(user_destino) + '", "' + str(pkmodulo) + '")'
        self.mysql_con.ejecutar(sentencia)   
    def grabar_agregar_tar_txt(self, pk, origen, usuario, texto, user_destino, pkmodulo):
        sentencia = 'INSERT INTO `web_p_com_txt` (`pk`, `origen`, `usuario`, `fecha`, `texto`, `user_destino`, `pkmodulo`) VALUES ("' + str(pk) + '", "' + str(origen) + '", "' + str(usuario) + '", "' + str(datetime.datetime.now()) + '", "' + str(texto) + '", "' + str(user_destino) + '", "' + str(pkmodulo) + '")'
        self.mysql_con.ejecutar(sentencia)   
    def nota_add_text(self, pknota, usuario, texto):
        ids = str(pknota).split('zbz')
        sentencia = 'INSERT INTO `web_p_com_txt` (`pk`, `origen`, `usuario`, `fecha`, `texto`) VALUES ("' + str(ids[1]) + '", "' + str(ids[2]) + '", "' + str(usuario) + '", "' + str(datetime.datetime.now()) + '", "' + str(texto) + '")'
        self.mysql_con.ejecutar(sentencia)  
    def crear_resp(self, pknota, usuario, responsable, tarea):
        sentencia = 'INSERT INTO `web_p_com_chk` (`pknota`, `usuario`, `fecha`, `responsable`, `check`, `tarea`) VALUES ("' + str(pknota) + '", "' + str(usuario) + '", "' + str(datetime.datetime.now()) + '", "' + str(responsable) + '", "unchecked", "' + str(tarea) + '")'
        self.mysql_con.ejecutar(sentencia)  
    def movernota(self, pknota, estado_nom):
        sentencia = 'UPDATE web_p_nota, web_p_estado set web_p_nota.pkestado = web_p_estado.pkestado where web_p_estado.nombre = "' + str(estado_nom) + '" and web_p_nota.pknota = ' + str(pknota)
        self.mysql_con.ejecutar(sentencia)
        sentencia = 'SELECT web_p_nota.pknota, web_p_nota.titulo, web_p_nota.descripcion, web_p_nota.fecha_inicio, web_p_nota.fecha_fin, web_p_nota.color, web_p_nota.responable, web_p_nota.ejecutor, web_p_estado.pkestado from web_p_nota, web_p_estado WHERE web_p_estado.nombre ="' + str(estado_nom) + '" and web_p_nota.pknota = '+ str(pknota)
        return self.mysql_con.table(sentencia)
    def traer_campos(self, tabla):
        sentencia = "select camposxestructura.Nombre from estructura, camposxestructura where estructura.Nombre = '"+ str(tabla) +"' and camposxestructura.PkEstructura = estructura.PkEstructura and camposxestructura.Visible = 'Y' and camposxestructura.Anulado = 'N' order by posicion"
        return self.mysql_con.table(sentencia)
    def traer_valores(self, tabla, campos):
        sentencia = "select " + str(campos) + " from " + str(tabla) + " order by PK" + str(tabla) + " desc limit 10"
        return self.mysql_con.table(sentencia)
    def grabar_doc(self, pknota, usuario, modulo, pkmodulo, pk, descripcion,  identificador ):
        sentencia =  "INSERT INTO `web_p_com_doc` (`pknota`, `usuario`, `fecha`, `modulo`, `descripcion`, `pk`, `identificador`, `pkmodulo`) VALUES ('" + str(pknota) +"', '" + str(usuario) + "', now(), '" + str(modulo) +"', '" + str(descripcion) +"', '" + str(pk) +"', '" + str(identificador) +"', '" + str(pkmodulo) +"')"
        self.mysql_con.ejecutar(sentencia)  
    def traer_calendarios(self, usuario, t_mostrar):
        sentencia =  "select * from web_p_calendar where usuario like '%" + str(usuario) + "%' and (nombre like '"+str(t_mostrar)+"' or 'todos' = '"+str(t_mostrar)+"')"
        return self.mysql_con.table(sentencia)
    def traer_calendarios_val(self, sentencia, fecha, usuario):
        sentencia = sentencia.replace('@fecha',fecha) 
        sentencia = sentencia.replace('@usuario',usuario) 
        return self.mysql_con.table(sentencia)
    def carga_alertas(self, V_user):
        return self.mysql_con.table('select * from web_a_alertas where usuario = "'+ str(V_user) +'"')
    def ejecutar_sub_alertas(self, senten):
        return self.mysql_con.table(senten)
    def update_sub_alertas(self, senten):
        self.mysql_con.ejecutar(senten)
    def traer_paneles_por_user(self, usuario):
        return self.mysql_con.table('select now() as "fehca_act", web_p_panel.*, web_p_panel_user.* from  web_p_panel, web_p_panel_user where  web_p_panel.pkPanel = web_p_panel_user.pkpanel and web_p_panel_user.usuario = "'+ str(usuario) +'"')
    def traer_paneles_grupos(self, pk):
        return self.mysql_con.table('select * from  web_p_panel_grupos where  web_p_panel_grupos.pkpanel = "'+ str(pk) +'" ORDER BY orderby ')
    def traer_sql_directo_cant_registros(self, senten):
        return self.mysql_con.table(senten)
    def traer_sql_directo(self, senten):
        return self.mysql_con.table(senten) 
    def traer_sub_paneles_Imagen(self, pkpanel, t_valor):
        return self.mysql_con.table('select * from web_p_panel_graficos_select where pkpanel = '+str(pkpanel)+' and valor = "'+str(t_valor)+'" ')                
    def traer_paneles_imagen(self, pkpanel):
        return self.mysql_con.table('select * from web_p_panel_graficos_select where pkpanel = '+ str(pkpanel))                
    def traer_paneles_datos(self, campo, group, tabla):
        return self.mysql_con.table('select ' + str(campo) + ' as "Display", ' + str(group) + ' as "Campo"  from  ' + str(tabla) + ' GROUP BY ' + str(group))
    def traer_paneles_grupospk(self, pk):
        sentencia = 'select * from  web_p_panel_grupos where  web_p_panel_grupos.pkgrupo = "'+ str(pk) +'" ORDER BY orderby'
        return self.mysql_con.table(sentencia)
    def traer_paneles_grupos_opciones(self, pk):
        return self.mysql_con.table('select campo, valor from web_p_panel_grupos where pkpanel = "'+ str(pk) +'" order by orderby')
    def insert_rapido(self, tabla, campo, valor ):
        sentencia =  "insert INTO `" + str(tabla) + "` (`" + str(campo) + "`) VALUES ('" + str(valor) + "')"
        self.mysql_con.ejecutar(sentencia)  
    def insert_rapido_new(self, senten):
        self.mysql_con.ejecutar(senten)          
    def traer_tablas(self, pkmodulo):
        return self.mysql_con.table('select * from  estructura where  PkModulo = "'+ str(pkmodulo) +'"')
    def insert_rap_det(self, tabla, pk ):
        sentencia =  "insert INTO `" + str(tabla) + "` (`pkcabecera`) VALUES ('" + str(pk) + "')"
        self.mysql_con.ejecutar(sentencia)  

class charts:
    def __init__(self, conn_user, conn_pass, conn_base, conn_ip):
        self.mysql_con = web.mysql.class_mysql(conn_user, conn_pass, conn_base, conn_ip)
    def traer_charts(self, usuario):
        sentencia = 'select * from web_c_charts where usuario like "%'+ str(usuario) +'%" or usuario like "todos" order by orden'
        print(sentencia)
        return self.mysql_con.table(sentencia)
    def ejecutar_charts(self, temp_sentencia):
        return self.mysql_con.table(temp_sentencia)

class eshop:
    def __init__(self, conn_user, conn_pass, conn_base, conn_ip):
        self.mysql_con = web.mysql.class_mysql(conn_user, conn_pass, conn_base, conn_ip)
    def traer_item(self, senten):
        return self.mysql_con.table(senten)        
    def traer_datos_contactos(self):
        sentencia = 'select * from web_eshop_main'
        return self.mysql_con.table(sentencia)
    def traer_cat_princi(self, V_sentencia):
        return self.mysql_con.table(V_sentencia)
    def traer_cat_secund(self, V_sentencia):
        return self.mysql_con.table(V_sentencia)
    def traer_items(self, V_sentencia):
        return self.mysql_con.table(V_sentencia)
    def traer_mensajes(self):
        sentencia = 'select * from web_eshop_msg'
        return self.mysql_con.table(sentencia)     
    def traer_main_display(self):
        sentencia = 'select * from web_eshop_slider'
        return self.mysql_con.table(sentencia)
    def traer_datos_items(self):
        sentencia = 'select * from web_eshop_datos_items'
        return self.mysql_con.table(sentencia)
    def ejecutar_senten(self, V_sentencia):
        return self.mysql_con.table(V_sentencia)
    def traer_estruc(self, pkmodulo):
        return self.mysql_con.table('select * from estructura where PkModulo = ' + str(pkmodulo))
    def Subcribete(self, email):
        self.mysql_con.ejecutar("insert into `subcritos` (`Email`, `Estado`) VALUES ('"+str(email)+"', 'Inicial')")
    def traer_lista_envio_provncias(self, tabla, provincia ):
        return self.mysql_con.table('select DISTINCT ' + str(provincia) + ' as "Provincia" from ' + str(tabla))
    def traer_lista_envio_ciudaes_valor(self, tabla, provincia, ciudad, valor ):
        return self.mysql_con.table('select DISTINCT '+ str(provincia) + ' as "Provincia", ' + str(ciudad) + ' as "Ciudad", ' + str(valor) + ' as "Valor" from ' + str(tabla))
    def eshop_promo(self, codigo):
        return self.mysql_con.table('select * from Promos where codigo = "' + str(codigo)+'" and Estado in ("Pendiente","Multiple")')
    def eshop_promo_siempre(self, codigo):
        return self.mysql_con.table('select * from Promos where codigo = "' + str(codigo)+'"')
    def eshop_promo_usar(self, codigo):
        self.mysql_con.ejecutar('update Promos set Estado = "Usado" where codigo = "' + str(codigo)+'"')

class edocs:
    def __init__(self, conn_user, conn_pass, conn_base, conn_ip):
        self.mysql_con = web.mysql.class_mysql(conn_user, conn_pass, conn_base, conn_ip)
    def traer_edocs_traspaso(self, t_pkestructura ):
        senten = 'select * from web_edocs_traspaso where pkestructura = ' + str(t_pkestructura)
        print(senten)
        return self.mysql_con.table(senten)   
    def traer_edocs_desgloce(self, t_pkestructura ):
        senten = 'select * from web_edocs_seccion where pkestructura = ' + str(t_pkestructura)
        return self.mysql_con.table(senten)   
    def traer_edocs_enlaces(self):
        senten = 'select * from web_edocs_filtro'
        return self.mysql_con.table(senten)   
    def traer_edocs_pendientes(self, t_fecha, t_orden, t_filtro):
        #senten = 'select web_edocs_main.pkid, web_edocs_main.COMPROBANTE, web_edocs_main.TIPO_EMISION, web_edocs_main.SERIE_COMPROBANTE, web_edocs_main.RUC_EMISOR, web_edocs_main.RAZON_SOCIAL_EMISOR, web_edocs_main.FECHA_EMISION, web_edocs_main.FECHA_AUTORIZACION, web_edocs_main.CLAVE_ACCESO, web_edocs_main.NUMERO_AUTORIZACION, web_edocs_main.IMPORTE_TOTAL, if(sri_compras.PkSri_compras is null,"Pendiente","Ingresado") as "Estado" from web_edocs_main LEFT JOIN sri_compras on (sri_compras.Autorizacion = web_edocs_main.NUMERO_AUTORIZACION and sri_compras.Prov_id = web_edocs_main.RUC_EMISOR and MONTH(sri_compras.Fecha_emision) = MONTH(DATE_ADD("'+str(t_fecha)+'",INTERVAL 1 day)) and YEAR(sri_compras.Fecha_emision) = YEAR(DATE_ADD("'+str(t_fecha)+'",INTERVAL 1 day))) where MONTH(web_edocs_main.FECHA_EMISION) = MONTH(DATE_ADD("'+str(t_fecha)+'",INTERVAL 1 day)) and COMPROBANTE = "Factura" and YEAR(web_edocs_main.FECHA_EMISION) = YEAR(DATE_ADD("'+str(t_fecha)+'",INTERVAL 1 day)) order by RAZON_SOCIAL_EMISOR, web_edocs_main.FECHA_EMISION, web_edocs_main.pkid'
        senten = 'select cast(web_edocs_main.pkid as char) as "pkid", cast(web_edocs_main.COMPROBANTE as char) as "COMPROBANTE", cast(web_edocs_main.TIPO_EMISION as char) as "TIPO_EMISION", cast(web_edocs_main.SERIE_COMPROBANTE as char) as "SERIE_COMPROBANTE", cast(web_edocs_main.RUC_EMISOR as char) as "RUC_EMISOR", cast(web_edocs_main.RAZON_SOCIAL_EMISOR as char) as "RAZON_SOCIAL_EMISOR", cast(web_edocs_main.FECHA_EMISION as char) as "FECHA_EMISION", cast(web_edocs_main.FECHA_AUTORIZACION as char) as "FECHA_AUTORIZACION", cast(web_edocs_main.CLAVE_ACCESO as char) as "CLAVE_ACCESO", cast(web_edocs_main.NUMERO_AUTORIZACION as char) as "NUMERO_AUTORIZACION", cast(web_edocs_main.IMPORTE_TOTAL as char) as "IMPORTE_TOTAL", cast(if(sri_compras.PkSri_compras is null,"Pendiente","Ingresado") as char) as "Estado" from web_edocs_main LEFT JOIN sri_compras on (sri_compras.Autorizacion = web_edocs_main.NUMERO_AUTORIZACION and sri_compras.Prov_id = web_edocs_main.RUC_EMISOR and MONTH(sri_compras.Fecha_emision) = MONTH("'+str(t_fecha)+'") and YEAR(sri_compras.Fecha_emision) = YEAR("'+str(t_fecha)+'")) where MONTH(web_edocs_main.FECHA_EMISION) = MONTH("'+str(t_fecha)+'") and COMPROBANTE = "Factura" and YEAR(web_edocs_main.FECHA_EMISION) = YEAR("'+str(t_fecha)+'") and (web_edocs_main.RAZON_SOCIAL_EMISOR like "%'+str(t_filtro)+'%" or web_edocs_main.SERIE_COMPROBANTE like "%'+str(t_filtro)+'%" or web_edocs_main.RUC_EMISOR like "%'+str(t_filtro)+'%" or web_edocs_main.IMPORTE_TOTAL like "%'+str(t_filtro)+'%" or web_edocs_main.CLAVE_ACCESO like "%'+str(t_filtro)+'%" ) and sri_compras.PkSri_compras IS NULL and web_edocs_main.TIPO_EMISION = "0" order by ' +str(t_orden) + ' limit 199'
        print(senten)
        return self.mysql_con.table(senten)   
    def traer_edocs_ingresados(self, t_fecha, t_orden, t_filtro):
        #senten = 'select web_edocs_main.pkid, web_edocs_main.COMPROBANTE, web_edocs_main.TIPO_EMISION, web_edocs_main.SERIE_COMPROBANTE, web_edocs_main.RUC_EMISOR, web_edocs_main.RAZON_SOCIAL_EMISOR, web_edocs_main.FECHA_EMISION, web_edocs_main.FECHA_AUTORIZACION, web_edocs_main.CLAVE_ACCESO, web_edocs_main.NUMERO_AUTORIZACION, web_edocs_main.IMPORTE_TOTAL, if(sri_compras.PkSri_compras is null,"Pendiente","Ingresado") as "Estado" from web_edocs_main LEFT JOIN sri_compras on (sri_compras.Autorizacion = web_edocs_main.NUMERO_AUTORIZACION and sri_compras.Prov_id = web_edocs_main.RUC_EMISOR and MONTH(sri_compras.Fecha_emision) = MONTH(DATE_ADD("'+str(t_fecha)+'",INTERVAL 1 day)) and YEAR(sri_compras.Fecha_emision) = YEAR(DATE_ADD("'+str(t_fecha)+'",INTERVAL 1 day))) where MONTH(web_edocs_main.FECHA_EMISION) = MONTH(DATE_ADD("'+str(t_fecha)+'",INTERVAL 1 day)) and COMPROBANTE = "Factura" and YEAR(web_edocs_main.FECHA_EMISION) = YEAR(DATE_ADD("'+str(t_fecha)+'",INTERVAL 1 day)) order by RAZON_SOCIAL_EMISOR, web_edocs_main.FECHA_EMISION, web_edocs_main.pkid'
        senten = 'select cast(web_edocs_main.pkid as char) as "pkid", cast(web_edocs_main.COMPROBANTE as char) as "COMPROBANTE", cast(web_edocs_main.TIPO_EMISION as char) as "TIPO_EMISION", cast(web_edocs_main.SERIE_COMPROBANTE as char) as "SERIE_COMPROBANTE", cast(web_edocs_main.RUC_EMISOR as char) as "RUC_EMISOR", cast(web_edocs_main.RAZON_SOCIAL_EMISOR as char) as "RAZON_SOCIAL_EMISOR", cast(web_edocs_main.FECHA_EMISION as char) as "FECHA_EMISION", cast(web_edocs_main.FECHA_AUTORIZACION as char) as "FECHA_AUTORIZACION", cast(web_edocs_main.CLAVE_ACCESO as char) as "CLAVE_ACCESO", cast(web_edocs_main.NUMERO_AUTORIZACION as char) as "NUMERO_AUTORIZACION", cast(web_edocs_main.IMPORTE_TOTAL as char) as "IMPORTE_TOTAL", cast(if(sri_compras.PkSri_compras is null,"Pendiente","Ingresado") as char) as "Estado" from web_edocs_main LEFT JOIN sri_compras on (sri_compras.Autorizacion = web_edocs_main.NUMERO_AUTORIZACION and sri_compras.Prov_id = web_edocs_main.RUC_EMISOR and MONTH(sri_compras.Fecha_emision) = MONTH("'+str(t_fecha)+'") and YEAR(sri_compras.Fecha_emision) = YEAR("'+str(t_fecha)+'")) where MONTH(web_edocs_main.FECHA_EMISION) = MONTH("'+str(t_fecha)+'") and COMPROBANTE = "Factura" and YEAR(web_edocs_main.FECHA_EMISION) = YEAR("'+str(t_fecha)+'") and (web_edocs_main.RAZON_SOCIAL_EMISOR like "%'+str(t_filtro)+'%" or web_edocs_main.SERIE_COMPROBANTE like "%'+str(t_filtro)+'%" or web_edocs_main.RUC_EMISOR like "%'+str(t_filtro)+'%" or web_edocs_main.IMPORTE_TOTAL like "%'+str(t_filtro)+'%" or web_edocs_main.CLAVE_ACCESO like "%'+str(t_filtro)+'%" ) and not(sri_compras.PkSri_compras IS NULL) and web_edocs_main.TIPO_EMISION = "0" order by ' +str(t_orden) + ' limit 199'
        print(senten)
        return self.mysql_con.table(senten)   
    def traer_edocs_rechazadas(self, t_fecha, t_orden, t_filtro):
        #senten = 'select web_edocs_main.pkid, web_edocs_main.COMPROBANTE, web_edocs_main.TIPO_EMISION, web_edocs_main.SERIE_COMPROBANTE, web_edocs_main.RUC_EMISOR, web_edocs_main.RAZON_SOCIAL_EMISOR, web_edocs_main.FECHA_EMISION, web_edocs_main.FECHA_AUTORIZACION, web_edocs_main.CLAVE_ACCESO, web_edocs_main.NUMERO_AUTORIZACION, web_edocs_main.IMPORTE_TOTAL, if(sri_compras.PkSri_compras is null,"Pendiente","Ingresado") as "Estado" from web_edocs_main LEFT JOIN sri_compras on (sri_compras.Autorizacion = web_edocs_main.NUMERO_AUTORIZACION and sri_compras.Prov_id = web_edocs_main.RUC_EMISOR and MONTH(sri_compras.Fecha_emision) = MONTH(DATE_ADD("'+str(t_fecha)+'",INTERVAL 1 day)) and YEAR(sri_compras.Fecha_emision) = YEAR(DATE_ADD("'+str(t_fecha)+'",INTERVAL 1 day))) where MONTH(web_edocs_main.FECHA_EMISION) = MONTH(DATE_ADD("'+str(t_fecha)+'",INTERVAL 1 day)) and COMPROBANTE = "Factura" and YEAR(web_edocs_main.FECHA_EMISION) = YEAR(DATE_ADD("'+str(t_fecha)+'",INTERVAL 1 day)) order by RAZON_SOCIAL_EMISOR, web_edocs_main.FECHA_EMISION, web_edocs_main.pkid'
        senten = 'select cast(web_edocs_main.pkid as char) as "pkid", cast(web_edocs_main.COMPROBANTE as char) as "COMPROBANTE", cast(web_edocs_main.TIPO_EMISION as char) as "TIPO_EMISION", cast(web_edocs_main.SERIE_COMPROBANTE as char) as "SERIE_COMPROBANTE", cast(web_edocs_main.RUC_EMISOR as char) as "RUC_EMISOR", cast(web_edocs_main.RAZON_SOCIAL_EMISOR as char) as "RAZON_SOCIAL_EMISOR", cast(web_edocs_main.FECHA_EMISION as char) as "FECHA_EMISION", cast(web_edocs_main.FECHA_AUTORIZACION as char) as "FECHA_AUTORIZACION", cast(web_edocs_main.CLAVE_ACCESO as char) as "CLAVE_ACCESO", cast(web_edocs_main.NUMERO_AUTORIZACION as char) as "NUMERO_AUTORIZACION", cast(web_edocs_main.IMPORTE_TOTAL as char) as "IMPORTE_TOTAL", cast(if(sri_compras.PkSri_compras is null,"Pendiente","Ingresado") as char) as "Estado" from web_edocs_main LEFT JOIN sri_compras on (sri_compras.Autorizacion = web_edocs_main.NUMERO_AUTORIZACION and sri_compras.Prov_id = web_edocs_main.RUC_EMISOR and MONTH(sri_compras.Fecha_emision) = MONTH("'+str(t_fecha)+'") and YEAR(sri_compras.Fecha_emision) = YEAR("'+str(t_fecha)+'")) where MONTH(web_edocs_main.FECHA_EMISION) = MONTH("'+str(t_fecha)+'") and COMPROBANTE = "Factura" and YEAR(web_edocs_main.FECHA_EMISION) = YEAR("'+str(t_fecha)+'") and (web_edocs_main.RAZON_SOCIAL_EMISOR like "%'+str(t_filtro)+'%" or web_edocs_main.SERIE_COMPROBANTE like "%'+str(t_filtro)+'%" or web_edocs_main.RUC_EMISOR like "%'+str(t_filtro)+'%" or web_edocs_main.IMPORTE_TOTAL like "%'+str(t_filtro)+'%" or web_edocs_main.CLAVE_ACCESO like "%'+str(t_filtro)+'%" ) and web_edocs_main.TIPO_EMISION = "1" order by ' +str(t_orden) + ' limit 199'
        print(senten)
        return self.mysql_con.table(senten)   
    def claves_invalidos(self, listado):
        senten = 'select CLAVE_ACCESO from web_edocs_main where web_edocs_main.CLAVE_ACCESO in('+str(listado)+')'
        return self.mysql_con.table(senten)    
    def dev_insert_new(self, listado):
        sentencia = "insert into `web_edocs_main` (`COMPROBANTE`, `SERIE_COMPROBANTE`, `RUC_EMISOR`, `RAZON_SOCIAL_EMISOR`, `FECHA_EMISION`, `FECHA_AUTORIZACION`, `TIPO_EMISION`, `IDENTIFICACION_RECEPTOR`, `CLAVE_ACCESO`, `NUMERO_AUTORIZACION`, `IMPORTE_TOTAL`) VALUES ('" + listado['tipo'] + "', '" + listado['estab'] + " - " + listado['punto'] + " - " + listado['numero']+ "', '" + listado['emisor_id'] + "', '" + listado['emisor_razon'] + "', '" + listado['fecha'] + "', '" + listado['fecha'] + "', '0', '0', '" + listado['clave'] + "', '" + listado['autorizacion'] + "', " +str(listado['valor']) + ");" # \n
        return sentencia
    def dev_insert_docs(self, listado):
        if listado['tipo'] == 'Factura':
            sentencia = "insert into `web_edocs_main` (`COMPROBANTE`, `SERIE_COMPROBANTE`, `RUC_EMISOR`, `RAZON_SOCIAL_EMISOR`, `FECHA_EMISION`, `FECHA_AUTORIZACION`, `TIPO_EMISION`, `IDENTIFICACION_RECEPTOR`, `CLAVE_ACCESO`, `NUMERO_AUTORIZACION`, `IMPORTE_TOTAL`) VALUES ('Factura', '" + listado['estab'] + " - " + listado['punto'] + " - " + listado['numero']+ "', '" + listado['emisor_id'] + "', '" + listado['emisor_razon'] + "', '" + listado['fecha'] + "', '" + listado['fecha'] + "', '0', '0', '" + listado['clave'] + "', '" + listado['autorizacion'] + "', " +str(listado['valor']) + ");" # \n
        if listado['tipo'] == 'Notas de Crdito':
            sentencia = "insert into `web_edocs_main` (`COMPROBANTE`, `SERIE_COMPROBANTE`, `RUC_EMISOR`, `RAZON_SOCIAL_EMISOR`, `FECHA_EMISION`, `FECHA_AUTORIZACION`, `TIPO_EMISION`, `IDENTIFICACION_RECEPTOR`, `CLAVE_ACCESO`, `NUMERO_AUTORIZACION`, `IMPORTE_TOTAL`) VALUES ('Notas de Credito', '" + listado['estab'] + " - " + listado['punto'] + " - " + listado['numero']+ "', '" + listado['emisor_id'] + "', '" + listado['emisor_razon'] + "', '" + listado['fecha'] + "', '" + listado['fecha'] + "', '0', '0', '" + listado['clave'] + "', '" + listado['autorizacion'] + "', " +str(listado['valor']) + ");" # \n
        if listado['tipo'] == 'Comprobante de Retencin':
            sentencia = "insert into `web_edocs_main` (`COMPROBANTE`, `SERIE_COMPROBANTE`, `RUC_EMISOR`, `RAZON_SOCIAL_EMISOR`, `FECHA_EMISION`, `FECHA_AUTORIZACION`, `TIPO_EMISION`, `IDENTIFICACION_RECEPTOR`, `CLAVE_ACCESO`, `NUMERO_AUTORIZACION`, `IMPORTE_TOTAL`) VALUES ('Comprobante de Retencion', '" + listado['estab'] + " - " + listado['punto'] + " - " + listado['numero']+ "', '" + listado['emisor_id'] + "', '" + listado['emisor_razon'] + "', '" + listado['fecha'] + "', '" + listado['fecha'] + "', '0', '0', '" + listado['clave'] + "', '" + listado['autorizacion'] + "', " +str(listado['valor']) + ");" # \n
        return sentencia
    def insert_docs(self, listado):
        sentencia = "insert into `web_edocs_main` (`COMPROBANTE`, `SERIE_COMPROBANTE`, `RUC_EMISOR`, `RAZON_SOCIAL_EMISOR`, `FECHA_EMISION`, `FECHA_AUTORIZACION`, `TIPO_EMISION`, `IDENTIFICACION_RECEPTOR`, `CLAVE_ACCESO`, `NUMERO_AUTORIZACION`, `IMPORTE_TOTAL`) VALUES ('" + listado['tipo'] + "', '" + listado['estab'] + " - " + listado['punto'] + " - " + listado['numero']+ "', '" + listado['emisor_id'] + "', '" + listado['emisor_razon'] + "', '" + listado['fecha'] + "', '" + listado['fecha'] + "', '0', '0', '" + listado['clave'] + "', '" + listado['autorizacion'] + "', " + str(listado['valor']) + ")"
        self.mysql_con.ejecutar(sentencia)
    def insert_docs_ejecutar(self, sentencia):
        self.mysql_con.ejecutar_varios(sentencia)
    def insert_docs_ejecutar_sinroll(self, sentencia):
        aaa= 0
        for a in sentencia:
            self.mysql_con.ejecutar(a.replace('�',''))
            aaa = aaa +1
    def edocs_eliminaredocs(self, t_pkid, t_estado_sri):
        sentencia = "update web_edocs_main set TIPO_EMISION = '"+str(t_estado_sri)+"' where pkid = '"+str(t_pkid)+"' "
        self.mysql_con.ejecutar(sentencia)

