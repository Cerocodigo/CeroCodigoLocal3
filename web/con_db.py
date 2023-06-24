import web.mysql
import datetime
import logging
import web.conss

logger = logging.getLogger(__name__)
#import web.MySQLdb
class inter_login_LOGIN:
    def __init__(self,V_base):
        self.V_base=V_base
        claves = web.conss.claves()
        claves_con = claves.devolver_con()
        self.mysql_con = web.mysql.class_mysql(claves_con[0],claves_con[1],claves_con[2],claves_con[3],claves_con[4])
        claves_int = claves.devolver_int()
        self.mysql_int = web.mysql.class_mysql( claves_int[0],claves_int[1],claves_int[2],claves_int[3],claves_con[4])
        #test de branch



    def Cedula_CC_Insertar(self, t_cedula, t_nombre, t_persona):
        if self.V_base == "Mysql":
            sentencia = "INSERT INTO `id_validos` (`identificacion`, `nombreCompleto`, `tipoPersona`) VALUES ('"+ str(t_cedula) +"', '"+ str(t_nombre) +"', '"+ str(t_persona) +"')"
            return self.mysql_con.ejecutar(sentencia)

    def Cedula_CC_Verificar(self, t_cedula):
        if self.V_base == "Mysql":
            sentencia = 'select * from id_validos where identificacion = "'+ str(t_cedula) +'"'
            return self.mysql_con.table(sentencia)
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
    def __init__(self, conn_user, conn_pass, conn_base, conn_ip, conn_puerto):
        if conn_puerto == 'null':
            conn_puerto = '3306'
        self.mysql_con = web.mysql.class_mysql(conn_user, conn_pass, conn_base, conn_ip, '3306')
    
    def paneles_externo_tabla(self, sentencia):
        return self.mysql_con.cursor_tabla(sentencia)
    def traer_paneles_externo(self, V_PkExterno):
        sentencia = 'select * from web_externo_panel where PkExterno = "'+ str(V_PkExterno) +'"'
        return self.mysql_con.table(sentencia)
    def traer_log_externo(self, V_tabla, C_user, V_user, C_clave, V_clave):
        if V_clave == 'hidden':
            sentencia = 'select * from '+ str(V_tabla) +' where '+ str(C_user) + ' = "'+ str(V_user) +'"'
        else:
            sentencia = 'select * from '+ str(V_tabla) +' where '+ str(C_user) + ' = "'+ str(V_user) +'" and ' + str(C_clave) + ' = "'+ str(V_clave) +'"'
        return self.mysql_con.table(sentencia)
    def acceso_externo(self, V_tipo):
        sentencia = 'select * from web_externo_acceso where Tipo = "'+ V_tipo +'"'
        return self.mysql_con.table(sentencia)
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
        return self.mysql_con.table('select DISTINCT M.tipo as "formtipo", M.PkModulo as "Pkmodulo", RE.PkReporte,  RE.PkReporte as "id", lower(REPLACE(RE.Nombre," ","")) as "nombre", RE.Nombre as "diplay", RE.Descripcion as "descripcion", RE.formato as "formato", RE.posicion as "posicion", RE.Arch_Excell as "arch_excell", RE.Con_detalle as "con_detalle", RE.Tipo as "tipo", s.icono from web_a_permisos WE, sysmodulogeneral S, reportesmain RE, modulo M where WE.usuario = "'+str(V_user)+'" and WE.pkmodulo = M.PkModulo and M.Cabecera = S.PkModGen and M.PkModulo = RE.PkModulo and M.tipo = "Reporte" and M.anulado LIKE "N" and RE.anulado = "N" ORDER BY  RE.Nombre')
    def carga_list_user(self):
        return self.mysql_con.table('select DISTINCT usuario from usuario order by usuario')
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
    def sql_ejecutar_directo(self,V_sentencia):
        self.mysql_con.ejecutar(V_sentencia)
    def traer_caledarioExternos(self):
        t_sentencia = "SELECT * from web_p_calendar where usuario like '%Externo%'"
        return self.mysql_con.table(t_sentencia)

        
class inter_reporte_var:
    def __init__(self, conn_user, conn_pass, conn_base, conn_ip):
        self.mysql_con = web.mysql.class_mysql(conn_user, conn_pass, conn_base, conn_ip, '3306')
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
        self.mysql_con = web.mysql.class_mysql(conn_user, conn_pass, conn_base, conn_ip, '3306')
    def traer_valores(self, t_id):
        base_query = self.mysql_con.table('select * from web_x_estado')
        return self.mysql_con.table(str(base_query[0]['estado']).replace('@ruc@',str(t_id)))
    def traer_cupo(self, t_id):
        base_query = self.mysql_con.table('select * from web_x_estado')
        return self.mysql_con.table(str(base_query[0]['cupo']).replace('@ruc@',str(t_id)))

class inter_ref_buscar:
    def __init__(self, conn_user, conn_pass, conn_base, conn_ip):
        self.mysql_con = web.mysql.class_mysql(conn_user, conn_pass, conn_base, conn_ip, '3306')
    def reportesreferencias(self, V_pkrefer):
        sentencia = 'select PkReferencia as "id", PkReporte as "pkreporte", Id as "id_rep", Campo as "campo", Columnas as "columnas", Tabla as "tabla", Glosa as "glosa", Nivel as "nivel", Multi as "multi" from reportesreferencias where PkReferencia = '+ V_pkrefer +' and nivel = 1'
        return self.mysql_con.table(sentencia)
    def reportesreferencias_valores(self, V_sentencia):
        return self.mysql_con.como_cursor(V_sentencia)


class menu_modulos:
    def __init__(self, conn_user, conn_pass, conn_base, conn_ip):
        self.mysql_con = web.mysql.class_mysql(conn_user, conn_pass, conn_base, conn_ip, '3306')      
    def traer_sysmodulogeneral_update(self, str_atributo, str_PkModGen, str_valor):
        sentencia = "UPDATE sysmodulogeneral set "+str(str_atributo)+" = '"+str(str_valor)+"' where PkModGen = " +str(str_PkModGen)
        self.mysql_con.ejecutar(sentencia)  
    def traer_proceso_update(self, str_atributo, str_pkmodulo, str_valor):
        sentencia = "UPDATE modulo set "+str(str_atributo)+" = '"+str(str_valor)+"' where PkModulo = " +str(str_pkmodulo)
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
        return self.mysql_con.table("Select * from modulo where Nombre = '"+(str_Nombre)+"'")  
    def modulo_crear_modulo_Opciones(self, pkmodulo, str_tipo):
        if str_tipo == "Reporte":
            sentencia = "INSERT INTO `opciones` (`PkModulo`, `Nombre`, `Descripcion`, `Anulado`, `Eliminable`,`Estructura` ) VALUES ('" + pkmodulo + "', 'Admin. Reportes', 'Administrar Los Reportes del modulo', 'N', 'N', 'R')"
            self.mysql_con.ejecutar(sentencia)
            sentencia = "INSERT INTO `opciones` (`PkModulo`, `Nombre`, `Descripcion`, `Anulado`, `Eliminable`,`Estructura` ) VALUES ('" + pkmodulo + "', 'Ejecutar Reportes', 'Ejecutar Los Reportes del modulo', 'N', 'N', 'D')"
            self.mysql_con.ejecutar(sentencia)
        else:
            sentencia = "INSERT INTO `opciones` (`PkModulo`, `Nombre`, `Descripcion`, `Anulado`, `Eliminable`,`Estructura` ) VALUES ('" + pkmodulo + "', 'Admin. Campos', 'Define la estructura del modulo', 'N', 'N', 'E')"
            self.mysql_con.ejecutar(sentencia)
            sentencia = "INSERT INTO `opciones` (`PkModulo`, `Nombre`, `Descripcion`, `Anulado`, `Eliminable`,`Estructura` ) VALUES ('" + pkmodulo + "', 'Ingresar', 'Ingresa Regstros del modulo', 'N', 'N', 'I')"
            self.mysql_con.ejecutar(sentencia)
            sentencia = "INSERT INTO `opciones` (`PkModulo`, `Nombre`, `Descripcion`, `Anulado`, `Eliminable`,`Estructura` ) VALUES ('" + pkmodulo + "', 'Modificar', 'Modifica los registros del modulo', 'N', 'N', 'M')"
            self.mysql_con.ejecutar(sentencia)
            sentencia = "INSERT INTO `opciones` (`PkModulo`, `Nombre`, `Descripcion`, `Anulado`, `Eliminable`,`Estructura` ) VALUES ('" + pkmodulo + "', 'Consulta', 'Consulta los registros del modulo', 'N', 'N', 'C')"
            self.mysql_con.ejecutar(sentencia)
            sentencia = "INSERT INTO `opciones` (`PkModulo`, `Nombre`, `Descripcion`, `Anulado`, `Eliminable`,`Estructura` ) VALUES ('" + pkmodulo + "', 'Admin. Condiciones', 'Administrar Condiciones del modulo', 'N', 'N', 'A')"
            self.mysql_con.ejecutar(sentencia)
            sentencia = "INSERT INTO `opciones` (`PkModulo`, `Nombre`, `Descripcion`, `Anulado`, `Eliminable`,`Estructura` ) VALUES ('" + pkmodulo + "', 'Admin. Acciones', 'Administrar Acciones del modulo', 'N', 'N', 'B')"
            self.mysql_con.ejecutar(sentencia)
            sentencia = "INSERT INTO `opciones` (`PkModulo`, `Nombre`, `Descripcion`, `Anulado`, `Eliminable`,`Estructura` ) VALUES ('" + pkmodulo + "', 'Admin. Plantillas', 'Las Plantillas del modulo', 'N', 'N', 'P')"
            self.mysql_con.ejecutar(sentencia)
            sentencia = "INSERT INTO `opciones` (`PkModulo`, `Nombre`, `Descripcion`, `Anulado`, `Eliminable`,`Estructura` ) VALUES ('" + pkmodulo + "', 'Eliminar', 'Eliminar Registros', 'N', 'N', 'Z')"
            self.mysql_con.ejecutar(sentencia)
            sentencia = "INSERT INTO `opciones` (`PkModulo`, `Nombre`, `Descripcion`, `Anulado`, `Eliminable`,`Estructura` ) VALUES ('" + pkmodulo + "', 'Importar', 'Importar Registros', 'N', 'N', 'G')"




    def estruc_crear_tabla(self, str_Nombre):
        sentencia = "CREATE TABLE " + str(str_Nombre) + "(Pk" + str(str_Nombre) + " int NOT NULL AUTO_INCREMENT,PRIMARY KEY (Pk" + str(str_Nombre) + "))"
        self.mysql_con.ejecutar(sentencia)

    def estruc_crear_Campo(self, str_tabla, str_Nombre, str_tipo, Adcional):
        if str_tipo == 'Texto':
            sentencia = "alter table " +str(str_tabla)+ " add COLUMN " +str(str_Nombre)+ " text"
            self.mysql_con.ejecutar(sentencia)
            self.mysql_con.ejecutar("UPDATE " +str(str_tabla)+ " set " +str(str_Nombre)+ " = ''")
        if str_tipo == 'Fecha':
            sentencia = "alter table " +str(str_tabla)+ " add COLUMN " +str(str_Nombre)+ " date"
            self.mysql_con.ejecutar(sentencia)
            self.mysql_con.ejecutar("UPDATE " +str(str_tabla)+ " set " +str(str_Nombre)+ " = now()")
        if str_tipo == 'Fechatiempo':
            sentencia = "alter table " +str(str_tabla)+ " add COLUMN " +str(str_Nombre)+ " datetime"
            self.mysql_con.ejecutar(sentencia)
            self.mysql_con.ejecutar("UPDATE " +str(str_tabla)+ " set " +str(str_Nombre)+ " = now()")
        if str_tipo == 'Decimal':
            sentencia = "alter table " +str(str_tabla)+ " add COLUMN " +str(str_Nombre)+ " DECIMAL (12," +str(Adcional)+")"
            self.mysql_con.ejecutar(sentencia)
            self.mysql_con.ejecutar("UPDATE " +str(str_tabla)+ " set " +str(str_Nombre)+ " = 0")
        if str_tipo == 'Entero':
            sentencia = "alter table " +str(str_tabla)+ " add COLUMN " +str(str_Nombre)+ " int"
            self.mysql_con.ejecutar(sentencia)
            self.mysql_con.ejecutar("UPDATE " +str(str_tabla)+ " set " +str(str_Nombre)+ " = 0")

    def modulo_crear_estructura(self, str_pkmodulo, str_Nombre, str_Descripcion, str_HijaDe):
        sentencia = "INSERT INTO `estructura` (`PkModulo`, `Nombre`, `Descripcion`, `Anulado`,`HijaDe`,`X`,`Y`, `espacio` ) VALUES ('" +str(str_pkmodulo )+ "', '" +str( str_Nombre )+ "', '" +str( str_Descripcion )+ "', 'N','"+str(str_HijaDe)+"','0','0','22')"
        self.mysql_con.ejecutar(sentencia)
        return self.mysql_con.table("Select * from estructura where Nombre = '"+(str_Nombre)+"'")  


    def modulo_devolver_estructura(self, str_PkEstructura):
        return self.mysql_con.table("Select * from estructura where PkEstructura = '"+(str_PkEstructura)+"'")  
    def modulo_devolver_estructuraPorModulo(self, str_PkModulo):
        return self.mysql_con.table("Select * from estructura where PkModulo = '"+(str_PkModulo)+"'")  

    #Funcion para obtener las condiciones de la estructura    
    def modulo_devolver_condicionesdetallexcondicion(self, str_PkEstructura):
        #Retorna las condiciones de la estructura en función de su PkEstructura
        return self.mysql_con.table("SELECT c.PkEstructura, cd.* FROM condicionesdetalle cd INNER JOIN condiciones c ON cd.PkCondicion = c.PkCondicion WHERE c.PkEstructura = '"+(str_PkEstructura)+"'")  
    
    #Funcion para guardar las condiciones de la estructura en la base de datos
    def modulo_guardar_condicionesdetallexcondicion(self, str_PkEstructura, str_PkId ,str_ElementoA, str_ElementoB, str_Operador, str_EstadoA, str_EstadoB, str_Mensaje):
        #Buscar el PkCondicion de la estructura
        PkCondicion = self.mysql_con.table("SELECT PkCondicion FROM condiciones WHERE PkEstructura = '"+(str_PkEstructura)+"'")
        #Transformar el PkCondicion en un string
        PkCondicion = str(PkCondicion[0]['PkCondicion'])

        #Buscar el PkId en la tabla condicionesdetalle para ver si existe
        PkCondicionDetalle = self.mysql_con.table("SELECT * FROM condicionesdetalle WHERE PkCondicion = '"+str(PkCondicion)+"' AND PkId = '"+(str_PkId)+"'")
        #Validar si existe el registro
        if len(PkCondicionDetalle) == 0:
            #Insertar el registro
            sentencia = "INSERT INTO `condicionesdetalle` (`PkCondicion`, `ElementoA`, `ElementoB`, `Operador`, `EstadoA`, `EstadoB`, `Mensaje` ) VALUES ('" + str(PkCondicion) + "', '" +str( str_ElementoA )+ "', '" +str( str_ElementoB )+ "', '" +str( str_Operador )+ "', '" +str( str_EstadoA )+ "', '" +str( str_EstadoB )+ "', '" +str( str_Mensaje )+ "')"
            self.mysql_con.ejecutar(sentencia)
        else:
            #Actualizar el registro
            sentencia = "UPDATE `condicionesdetalle` SET `ElementoA` = '" +str( str_ElementoA )+ "', `ElementoB` = '" +str( str_ElementoB )+ "', `Operador` = '" +str( str_Operador )+ "', `EstadoA` = '" +str( str_EstadoA )+ "', `EstadoB` = '" +str( str_EstadoB )+ "', `Mensaje` = '" +str( str_Mensaje )+ "' WHERE `condicionesdetalle`.`PkId` = " +str(str_PkId)+ " AND `condicionesdetalle`.`PkCondicion` = " +str(PkCondicion)+ ""
            self.mysql_con.ejecutar(sentencia)

        #Retornar el registro de datos actualizados o insertados 
        return self.mysql_con.table("Select * from condicionesdetalle where PkCondicion = '"+str(PkCondicion)+"' AND PkId = '"+str(str_PkId)+"'")

    #Funcion para eliminar las condiciones de la estructura en la base de datos
    def modulo_eliminar_condicionesdetallexcondicion(self, str_PkId):
        #Buscar el PkCondicion en la tabla condicionesdetalle para ver si existe
        PkCondicionDetalle = self.mysql_con.table("SELECT * FROM condicionesdetalle WHERE PkId = '"+str(str_PkId)+"'")
        #Validar si existe el registro
        if len(PkCondicionDetalle) > 0:
            #Eliminar el registro
            sentencia = "DELETE FROM `condicionesdetalle` WHERE `condicionesdetalle`.`PkId` = " +str(str_PkId)+ ""
            self.mysql_con.ejecutar(sentencia)
            #Retornar que se elimino el registro con exito
            return True
        else:
            #Retornar que no se elimino el registro
            return False
        
    
class versiones:
    def __init__(self, conn_user, conn_pass, conn_base, conn_ip):
        self.mysql_con = web.mysql.class_mysql(conn_user, conn_pass, conn_base, conn_ip, '3306') 

    def actualizar(self):
        dbversion = 0
        version = self.mysql_con.table("SELECT * from llankay_datos_clientes")
        if not('versionWeb' in version[0]):
            self.mysql_con.ejecutar("ALTER table llankay_datos_clientes add COLUMN versionWeb text")
            self.mysql_con.ejecutar("update llankay_datos_clientes set versionWeb = '0'")
            dbversion = 0
        else:
            dbversion =  int(version[0]['versionWeb'])

        if dbversion == 0:
            self.mysql_con.ejecutar("update llankay_datos_clientes set versionWeb = '1'")
            self.mysql_con.ejecutar("ALTER table web_externo_acceso add COLUMN DisplayCalendario text")
            self.mysql_con.ejecutar("update web_externo_acceso set  DisplayCalendario = ''")
            dbversion = dbversion + 1

        if dbversion == 1:
            self.mysql_con.ejecutar("update llankay_datos_clientes set versionWeb = '2'")
            self.mysql_con.ejecutar("DROP TABLE IF EXISTS `cmpelect_ret_rembolso`;")
            self.mysql_con.ejecutar("DROP TABLE IF EXISTS `cmpelect_ret_rembolsodet`;")
            sente= '''
                CREATE TABLE `cmpelect_ret_rembolso` (
                `pk` int(11) NOT NULL AUTO_INCREMENT,
                `pkcampo` int(11) DEFAULT NULL,
                `tipoIdentificacionProveedorReembolso` varchar(255) DEFAULT NULL,
                `identificacionProveedorReembolso` varchar(255) DEFAULT NULL,
                `codPaisPagoProveedorReembolso` varchar(255) DEFAULT NULL,
                `tipoProveedorReembolso` varchar(255) DEFAULT NULL,
                `codDocReembolso` varchar(255) DEFAULT NULL,
                `estabDocReembolso` varchar(255) DEFAULT NULL,
                `ptoEmiDocReembolso` varchar(255) DEFAULT NULL,
                `secuencialDocReembolso` varchar(255) DEFAULT NULL,
                `fechaEmisionDocReembolso` varchar(255) DEFAULT NULL,
                `numeroAutorizacionDocReemb` varchar(255) DEFAULT NULL,
                PRIMARY KEY (`pk`)
                ) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1
            '''
            self.mysql_con.ejecutar(sente)
            sente = '''
                CREATE TABLE `cmpelect_ret_rembolsodet` (
                `pk` int(11) NOT NULL AUTO_INCREMENT,
                `pkcampo` int(11) DEFAULT NULL,
                `codigo` varchar(255) DEFAULT NULL,
                `codigoPorcentaje` varchar(255) DEFAULT NULL,
                `tarifa` varchar(255) DEFAULT NULL,
                `baseImponibleReembolso` varchar(255) DEFAULT NULL,
                `impuestoReembolso` varchar(255) DEFAULT NULL,
                PRIMARY KEY (`pk`)
                ) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1
            '''
            self.mysql_con.ejecutar(sente)
            self.mysql_con.ejecutar("INSERT INTO `cmpelect_ret_rembolso` (`pkcampo`, `tipoIdentificacionProveedorReembolso`, `identificacionProveedorReembolso`, `codPaisPagoProveedorReembolso`, `tipoProveedorReembolso`, `codDocReembolso`, `estabDocReembolso`, `ptoEmiDocReembolso`, `secuencialDocReembolso`, `fechaEmisionDocReembolso`, `numeroAutorizacionDocReemb`) VALUES ('4', 'Prov_tipo_electronico', 'Prov_id', '593', 'Prov_tipo_electronico', 'Prov_Doc', 'Prov_establecimiento', 'Prov_Punto_Emision', 'Num_factura', 'Fecha_emision', 'Prov_autorizacion')")
            self.mysql_con.ejecutar("INSERT INTO `cmpelect_ret_rembolso` (`pkcampo`, `tipoIdentificacionProveedorReembolso`, `identificacionProveedorReembolso`, `codPaisPagoProveedorReembolso`, `tipoProveedorReembolso`, `codDocReembolso`, `estabDocReembolso`, `ptoEmiDocReembolso`, `secuencialDocReembolso`, `fechaEmisionDocReembolso`, `numeroAutorizacionDocReemb`) VALUES ('2', 'Prov_tipo_elect', 'Prov_id', '593', 'Prov_tipo_elect', 'Prov_Doc', 'Prov_establecimiento', 'Prov_Punto_Emision', 'Num_factura', 'Fecha_emision', 'Prov_autorizacion')")
            self.mysql_con.ejecutar("INSERT INTO `cmpelect_ret_rembolsodet` (`pkcampo`, `codigo`, `codigoPorcentaje`, `tarifa`, `baseImponibleReembolso`, `impuestoReembolso`) VALUES ('4', 'Sri_imp', 'codigoPorcentaje', 'Tarifa_iva', 'Total', 'Iva')")
            self.mysql_con.ejecutar("INSERT INTO `cmpelect_ret_rembolsodet` (`pkcampo`, `codigo`, `codigoPorcentaje`, `tarifa`, `baseImponibleReembolso`, `impuestoReembolso`) VALUES ('2', 'Sri_imp', 'codigoPorcentaje', 'Tarifa_iva', 'Total', 'Iva')")            
            self.mysql_con.ejecutar("alter table web_p_panel_grupos add COLUMN condicion text")
            self.mysql_con.ejecutar("update web_p_panel_grupos set condicion = ''")
            dbversion = dbversion + 1
        
        if dbversion == 2:
            self.mysql_con.ejecutar("update llankay_datos_clientes set versionWeb = '3'")
            self.mysql_con.ejecutar("alter TABLE web_estados_doc add COLUMN accion text")
            self.mysql_con.ejecutar("update web_estados_doc set accion = 'Accion'")
            dbversion = dbversion + 1
        if dbversion == 3:
            self.mysql_con.ejecutar("update llankay_datos_clientes set versionWeb = '4'")
            self.mysql_con.ejecutar("CREATE TABLE `web_estados_doc_traspaso` (  `pktraspaso` int(11) NOT NULL AUTO_INCREMENT,  `pkestado` int(11) DEFAULT NULL,  `campoDestino` varchar(255) DEFAULT NULL,  `campoOrigen` varchar(255) DEFAULT NULL,  PRIMARY KEY (`pktraspaso`)) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1")
            dbversion = dbversion + 1
        if dbversion == 4:
            self.mysql_con.ejecutar("update llankay_datos_clientes set versionWeb = '5'")
            self.mysql_con.ejecutar("CREATE TABLE `cmpreferenciaaplicar` (  `PkId` int(11) NOT NULL AUTO_INCREMENT,  `PkCampo` int(11) DEFAULT NULL,  `objetivo` varchar(255) DEFAULT NULL,  `campo` varchar(255) DEFAULT NULL,  `c_valor` varchar(255) DEFAULT NULL,  `valor` varchar(255) DEFAULT NULL,  `minimo_registro` varchar(255) DEFAULT NULL,  `minimo_valor` varchar(255) DEFAULT NULL,  `tarjet` varchar(255) DEFAULT NULL,  `objetivoDet` varchar(255) DEFAULT NULL,   `objetivoFiltro` varchar(255) DEFAULT NULL,  PRIMARY KEY (`PkId`) USING BTREE ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT")
            self.mysql_con.ejecutar("CREATE TABLE `cmpreferenciaaplicarcond` (  `PkId` int(11) NOT NULL AUTO_INCREMENT,  `PkCampo` int(11) DEFAULT NULL,  `operador` varchar(255) DEFAULT NULL,  `campo` varchar(255) DEFAULT NULL,  `valor` varchar(255) DEFAULT NULL,  PRIMARY KEY (`PkId`) USING BTREE) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT")
            dbversion = dbversion + 1
        if dbversion == 5:
            self.mysql_con.ejecutar("update llankay_datos_clientes set versionWeb = '6'")
            self.mysql_con.ejecutar("CREATE TABLE `web_sri_formularios` (  `pk` int(11) NOT NULL AUTO_INCREMENT,  `fuente` varchar(255) DEFAULT NULL,  `senten` text DEFAULT NULL,  `tag` varchar(255) DEFAULT NULL,   PRIMARY KEY (`pk`) ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1")
            self.mysql_con.ejecutar("INSERT INTO `web_sri_formularios` (`fuente`, `senten`, `tag`) VALUES ('103', '\r\n\r\n\r\nselect \r\n\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'302\'),sri_comprasdetalle.Base_imponible,0)) as \'302\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'302\'),sri_comprasdetalle.Valor_retencion,0)) as \'352\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'303\'),sri_comprasdetalle.Base_imponible,0)) as \'303\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'303\'),sri_comprasdetalle.Valor_retencion,0)) as \'353\',\r\n\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'304\'),sri_comprasdetalle.Base_imponible,0)) as \'304\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'304\'),sri_comprasdetalle.Valor_retencion,0)) as \'354\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'307\'),sri_comprasdetalle.Base_imponible,0)) as \'307\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'307\'),sri_comprasdetalle.Valor_retencion,0)) as \'357\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'308\'),sri_comprasdetalle.Base_imponible,0)) as \'308\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'308\'),sri_comprasdetalle.Valor_retencion,0)) as \'358\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'309\'),sri_comprasdetalle.Base_imponible,0)) as \'309\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'309\'),sri_comprasdetalle.Valor_retencion,0)) as \'359\',\r\n\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'310\'),sri_comprasdetalle.Base_imponible,0)) as \'310\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'310\'),sri_comprasdetalle.Valor_retencion,0)) as \'360\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'311\'),sri_comprasdetalle.Base_imponible,0)) as \'311\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'311\'),sri_comprasdetalle.Valor_retencion,0)) as \'361\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'312\'),sri_comprasdetalle.Base_imponible,0)) as \'312\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'312\'),sri_comprasdetalle.Valor_retencion,0)) as \'362\',\r\n\r\n\r\n\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'3120\'),sri_comprasdetalle.Base_imponible,0)) as \'3120\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'3120\'),sri_comprasdetalle.Valor_retencion,0)) as \'3620\',\r\n\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'314\'),sri_comprasdetalle.Base_imponible,0)) as \'314\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'314\'),sri_comprasdetalle.Valor_retencion,0)) as \'364\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'319\'),sri_comprasdetalle.Base_imponible,0)) as \'319\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'319\'),sri_comprasdetalle.Valor_retencion,0)) as \'369\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'320\'),sri_comprasdetalle.Base_imponible,0)) as \'320\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'320\'),sri_comprasdetalle.Valor_retencion,0)) as \'370\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'322\'),sri_comprasdetalle.Base_imponible,0)) as \'322\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'322\'),sri_comprasdetalle.Valor_retencion,0)) as \'372\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'323\'),sri_comprasdetalle.Base_imponible,0)) as \'323\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'323\'),sri_comprasdetalle.Valor_retencion,0)) as \'373\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'324\'),sri_comprasdetalle.Base_imponible,0)) as \'324\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'324\'),sri_comprasdetalle.Valor_retencion,0)) as \'374\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'332\'),sri_comprasdetalle.Base_imponible,0)) as \'332\',\r\n\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'333\'),sri_comprasdetalle.Base_imponible,0)) as \'333\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'333\'),sri_comprasdetalle.Valor_retencion,0)) as \'383\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'334\'),sri_comprasdetalle.Base_imponible,0)) as \'334\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'334\'),sri_comprasdetalle.Valor_retencion,0)) as \'384\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'335\'),sri_comprasdetalle.Base_imponible,0)) as \'335\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'335\'),sri_comprasdetalle.Valor_retencion,0)) as \'385\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'336\'),sri_comprasdetalle.Base_imponible,0)) as \'336\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'336\'),sri_comprasdetalle.Valor_retencion,0)) as \'386\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'337\'),sri_comprasdetalle.Base_imponible,0)) as \'337\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'337\'),sri_comprasdetalle.Valor_retencion,0)) as \'387\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'343\'),sri_comprasdetalle.Base_imponible,0)) as \'343\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'343\'),sri_comprasdetalle.Valor_retencion,0)) as \'393\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'344\'),sri_comprasdetalle.Base_imponible,0)) as \'344\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'344\'),sri_comprasdetalle.Valor_retencion,0)) as \'394\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'3440\'),sri_comprasdetalle.Base_imponible,0)) as \'3440\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'3440\'),sri_comprasdetalle.Valor_retencion,0)) as \'3940\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'345\'),sri_comprasdetalle.Base_imponible,0)) as \'345\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'345\'),sri_comprasdetalle.Valor_retencion,0)) as \'395\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'346\'),sri_comprasdetalle.Base_imponible,0)) as \'346\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'346\'),sri_comprasdetalle.Valor_retencion,0)) as \'396\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'348\'),sri_comprasdetalle.Base_imponible,0)) as \'348\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'348\'),sri_comprasdetalle.Valor_retencion,0)) as \'398\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'350\'),sri_comprasdetalle.Base_imponible,0)) as \'350\',\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'350\'),sri_comprasdetalle.Valor_retencion,0)) as \'400\',\r\n\r\n\r\nsum(sri_comprasdetalle.Base_imponible) as \'349\',\r\nsum(sri_comprasdetalle.Valor_retencion) as \'399\',\r\n\r\nsum(sri_comprasdetalle.Valor_retencion) as \'499\',\r\nsum(sri_comprasdetalle.Valor_retencion) as \'902\'\r\n\r\n\r\n\r\n\r\n\r\n\r\nsum(if(sri_comprasdetalle.Cod_retencion in (\'\'),sri_comprasdetalle.Valor_retencion,0)) as \'\'\r\n\r\n\r\nsri_comprasdetalle.Base_imponible,\r\nsri_comprasdetalle.Cod_retencion\r\nsri_comprasdetalle.Valor_retencion,\r\n\r\n\r\n\r\n\r\n from sri_compras, sri_comprasdetalle \r\n\r\nwhere \r\nsri_compras.PkSri_compras = sri_comprasdetalle.PKCabecera\r\nand year(Fecha_emision) = year(\'@fecha@\') and MONTH(Fecha_emision) = MONTH(\'@fecha@\') and  sri_compras.DXP_estado != \'ANULADO\' and sri = \'Si\'\r\nand sri_comprasdetalle.Tipo_retencion = \'FUENTE\'', 'ventas')")
            self.mysql_con.ejecutar("INSERT INTO `web_sri_formularios` (`fuente`, `senten`, `tag`) VALUES ('104', '\r\nselect \r\nsum(if(Activo_fijo = \'No\' , baseImpGrab, 0)) as \' 401\',\r\nsum(if(Activo_fijo = \'Si\' , baseImpGrab, 0)) as \' 402\',\r\n\r\nsum(if(tipoComprobante = 18  AND Activo_fijo = \'No\', baseImponible, 0))    as \' 403\',\r\n0 as \' 404\',\r\n0 as \' 405\',\r\nsum(if(tipoComprobante = 18  AND Activo_fijo = \'Si\', baseImponible, 0))   as \' 406\',\r\n\r\n0 as \' 407\',\r\n0 as \' 408\',\r\nsum(if(tipoComprobante = 18, baseImponible + baseImpGrab, 0)) as \' 409\',\r\nsum(if(Activo_fijo = \'No\', IF(tipoComprobante = \'04\', (baseImpGrab * -1), baseImpGrab), 0)) as \' 411\',\r\n\r\nsum(if(Activo_fijo = \'Si\', IF(tipoComprobante = \'04\', (baseImpGrab * -1), baseImpGrab), 0)) as \' 412\',\r\nsum(if(Activo_fijo = \'No\', IF(tipoComprobante = \'04\', (baseImponible * -1), baseImponible), 0)) as \' 413\',\r\n0 as \' 414\',\r\n0 as \' 415\',\r\nsum(if(Activo_fijo = \'Si\', IF(tipoComprobante = \'04\', (baseImponible * -1), baseImponible), 0)) as \' 416\',\r\n0 as \' 417\',\r\n0 as \' 418\',\r\nsum(IF(tipoComprobante = \'04\', ((baseImponible + baseImpGrab) * -1), (baseImponible + baseImpGrab))) as \' 419\',\r\nsum(if(Activo_fijo = \'Si\', IF(tipoComprobante = \'04\', (MontoIva * -1), MontoIva), 0)) as \' 421\',\r\nsum(if(Activo_fijo = \'No\', IF(tipoComprobante = \'04\', (MontoIva * -1), MontoIva), 0)) as \' 422\',\r\nsum(IF(tipoComprobante = \'04\', (MontoIva * -1), MontoIva)) as \' 429\',\r\n0 as \' 431\',\r\n0 as \' 434\',\r\n0 as \' 441\',\r\n0 as \' 442\',\r\n0 as \' 443\',\r\n0 as \' 444\',\r\n0 as \' 453\',\r\n0 as \' 454\',\r\nsum(IF(tipoComprobante = \'04\', ((baseImpGrab) * -1), (baseImpGrab))) as \' 480\',\r\n0 as \' 481\',\r\nsum(IF(tipoComprobante = \'04\', ((MontoIva) * -1), (MontoIva)))  as \' 482\',\r\n0 as \' 483\',\r\nsum(IF(tipoComprobante = \'04\', ((MontoIva) * -1), (MontoIva))) as \' 484\',\r\n0 as \' 485\',\r\nsum(IF(tipoComprobante = \'04\', ((MontoIva) * -1), (MontoIva))) as \' 499\',\r\n\r\nsum(ValRetIva) as \' 609\'\r\n\r\nfrom sri_ventas where DXC_estado != \"ANULADO\" and year(Fecha_emision) = year(\'@fecha@\') and MONTH(Fecha_emision) = MONTH(\'@fecha@\') and sri = \'Si\'\r\n\r\n', 'ventas')")
            self.mysql_con.ejecutar("INSERT INTO `web_sri_formularios` (`fuente`, `senten`, `tag`) VALUES ('104', 'select \r\n\r\nsum(if( tipoComprobante in (\'01\',\'03\') and not(tipoComprobante =\'04\')	and Activo_fijo = \'No\' and not(codSustento = \'0\' or codsustento = \'02\'), baseImpGrab,0)) as \' 500\',\r\n\r\nsum(if( tipoComprobante in (\'01\',\'03\') and not(tipoComprobante =\'04\')	and Activo_fijo = \'Si\' and not(codSustento = \'0\' or codsustento = \'02\'), baseImpGrab,0)) as \' 501\',\r\nsum(if( tipoComprobante in (\'01\',\'03\') and codsustento = \'02\', baseImpGrab,0)) as \' 502\',\r\n0 as \' 503\',\r\n0 as \' 504\',\r\n0 as \' 505\',\r\n0 as \' 506\',\r\nsum(if(not(tipoComprobante =\'04\') AND sri_compras.tipoComprobante = \'01\' and not(codsustento = \'0\' or codsustento = \'02\') , baseImponible,0)) as \' 507\',\r\nsum(if( not(tipoComprobante =\'04\') AND sri_compras.tipoComprobante in(\'02\') and  not(codsustento = \'0\' or codsustento = \'02\'),baseimponible,0 )) as \' 508\',\r\nsum(if( not(tipoComprobante =\'04\') and not(codsustento = \'0\' or codsustento = \'02\'), baseimponible + baseImpGrab,0)) as \' 509\',\r\nsum(if(tipoComprobante in(\'01\', \'04\', \'03\')  and Activo_fijo = \'No\' and not(codsustento = \'0\' or codsustento = \'02\') , if(tipoComprobante =\'04\', (baseImpGrab * -1),(baseImpGrab)),0)) as \' 510\',\r\nsum(if(tipoComprobante in(\'01\', \'04\', \'03\') and sri_compras.DXP_estado != \'ANULADO\' and Activo_fijo = \'Si\' and not(codsustento = \'0\' or codsustento = \'02\') , if(tipoComprobante =\'04\', (baseImpGrab * -1),(baseImpGrab)),0)) as \' 511\',\r\nsum(if(tipoComprobante in(\'01\', \'04\', \'03\') and codsustento = \'02\' , if(tipoComprobante =\'04\', (baseImpGrab * -1),(baseImpGrab)),0)) as \'512\',\r\n0 as \' 513\',\r\n0 as \' 514\',\r\n0 as \' 515\',\r\n0 as \' 516\',\r\nsum(if(sri_compras.tipoComprobante in(\'01\', \'04\', \'03\') and not(codsustento = \'0\' or codsustento = \'02\') ,if(tipoComprobante = \'04\', (baseimponible * -1) ,0),0)) as \'517\',\r\n\r\nsum(if( not(tipoComprobante =\'04\') AND sri_compras.tipoComprobante in(\'02\') and not(codsustento = \'0\' or codsustento = \'02\') ,baseimponible,0)) as \'518\',\r\nsum(if(( tipoComprobante in(\'01\', \'04\', \'02\', \'03\')) and Activo_fijo = \'No\' and not(codsustento = \'0\' or codsustento = \'02\') , if(tipoComprobante = \'04\', ((baseImpGrab + baseimponible) * -1),(baseImpGrab + baseimponible)),0)) as \' 519\',\r\nsum(if(tipoComprobante in (\'04\', \'01\', \'03\') and Activo_fijo = \'No\' and not(codsustento = \'0\' or codsustento = \'02\'), if(tipoComprobante = \'04\', (MontoIva * -1),(MontoIva)),0)) as \' 520\',\r\nsum(if((tipoComprobante = \'01\' and Activo_fijo = \'Si\' and not(codsustento = \'0\' or codsustento = \'02\') ) , if(tipoComprobante = \'04\', (MontoIva * -1),(MontoIva)),0)) as \' 521\',\r\nsum(if( codsustento = \'02\' and (tipoComprobante = \'01\'), if(tipoComprobante = \'04\', (MontoIva * -1),(MontoIva)),0)) as \' 522\',\r\n0 as \' 523\',\r\n0 as \' 524\',\r\n0 as \' 525\',\r\nsum(if(not(codsustento = \'0\') ,if(tipoComprobante = \'04\', (MontoIva * -1),(MontoIva)) ,0)) as \' 529\',\r\n0 as \' 531\',\r\n0 as \' 532\',\r\n0 as \' 535\',\r\n0 as \' 541\',\r\n0 as \' 542\',\r\n0 as \' 543\',\r\n0 as \' 544\',\r\n0 as \' 545\',\r\n0 as \' 554\',\r\n0 as \' 555\',\r\n0 as \' 563\',\r\nsum(if( (tipoComprobante = \'04\' or tipoComprobante = \'01\') and not(codsustento = \'0\') , if(tipoComprobante = \'04\', (MontoIva * -1),(MontoIva)),0)) as \' 564\',\r\n0 as \' 601\',\r\n0 as \' 602\',\r\n0 as \' 605\',\r\n0 as \' 607\',\r\n\r\n\r\n0 as \' 611\',\r\n0 as \' 612\',\r\n0 as \' 613\',\r\n0 as \' 615\',\r\n0 as \' 617\',\r\n0 as \' 619\',\r\n0 as \' 621\',\r\n0 as \' 699\',\r\nsum(ValretBien10) as \' 721\',\r\nsum(valRetServ20)  as \' 723\',\r\nsum(valorRetBienes) as \' 725\',\r\nsum(valorRetServicios) as \' 727\',\r\nsum(valRetServ100) as \' 729\',\r\nsum(valRetServ100 + valRetBien10 + valRetServ20 + valorRetBienes + valorRetServicios) as \' 799\',\r\nsum(valRetServ100 + valRetBien10 + valRetServ20 + valorRetBienes + valorRetServicios) as \' 859\',\r\n0 as \' 880\',\r\n0 as \' 890\',\r\n0 as \' 897\',\r\n0 as \' 898\',\r\n0 as \' 899\',\r\n0 as \' 902\',\r\n0 as \' 903\',\r\n0 as \' 904\',\r\n0 as \' 905\',\r\n0 as \' 906\',\r\n0 as \' 907\',\r\n0 as \' 908\',\r\n0 as \' 909\',\r\n0 as \' 910\',\r\n0 as \' 911\',\r\n0 as \' 912\',\r\n0 as \' 913\',\r\n0 as \' 915\',\r\n0 as \' 916\',\r\n0 as \' 917\',\r\n0 as \' 918\',\r\n0 as \' 919\',\r\n0 as \' 922\',\r\n0 as \' 999\'\r\n\r\n\r\n from sri_compras where year(Fecha_emision) = year(\'@fecha@\') and MONTH(Fecha_emision) = MONTH(\'@fecha@\') and  sri_compras.DXP_estado != \'ANULADO\' and sri = \'Si\'\r\n', 'compras')")
            dbversion = dbversion + 1
        if dbversion == 6:
            self.mysql_con.ejecutar("update llankay_datos_clientes set versionWeb = '7'")
            self.mysql_con.ejecutar("CREATE TABLE `cmptxtsimplesri` (  `pkd` int(11) NOT NULL AUTO_INCREMENT,  `PkCampo` int(11) DEFAULT NULL,  `Tag` varchar(255) DEFAULT NULL,  `Campo` varchar(255) DEFAULT NULL,  PRIMARY KEY (`pkd`)) ENGINE=InnoDB DEFAULT CHARSET=latin1")
            dbversion = dbversion + 1
        if dbversion == 7:
            self.mysql_con.ejecutar("update llankay_datos_clientes set versionWeb = '8'")
            self.mysql_con.ejecutar("ALTER TABLE usuario MODIFY COLUMN Nombre VARCHAR(100);")
            self.mysql_con.ejecutar("ALTER TABLE usuario MODIFY COLUMN Apellido VARCHAR(100);")
            self.mysql_con.ejecutar("ALTER TABLE usuario MODIFY COLUMN Apellido2 VARCHAR(100);")
            self.mysql_con.ejecutar("ALTER TABLE usuario MODIFY COLUMN Clave VARCHAR(100);")
            self.mysql_con.ejecutar("ALTER TABLE usuario MODIFY COLUMN Usuario VARCHAR(100);")
            dbversion = dbversion + 1
        if dbversion == 8:
            self.mysql_con.ejecutar("update llankay_datos_clientes set versionWeb = '9'")
            self.mysql_con.ejecutar("UPDATE cmpformuladetallecondicion set Operador = 'no igual' where Valor REGEXP '^[0-9.]+$'  = 0 and Operador = '!='")
            self.mysql_con.ejecutar("UPDATE cmpformuladetallecondicion set Operador = 'igual' where Valor REGEXP '^[0-9.]+$'  = 0 and Operador = '='")
            dbversion = dbversion + 1
        if dbversion == 9:
            self.mysql_con.ejecutar("update llankay_datos_clientes set versionWeb = '10'")
            self.mysql_con.ejecutar("alter table web_externo_acceso add COLUMN htmlup text")
            self.mysql_con.ejecutar("alter table web_externo_acceso add COLUMN htmldown text")
            self.mysql_con.ejecutar("CREATE TABLE `acciones_email` (  `PkAccionEmail` varchar(255) NOT NULL,  `PkAccion` varchar(255) DEFAULT NULL,  `De` text DEFAULT NULL,  `Para` text DEFAULT NULL,  `Tema` text DEFAULT NULL,  `Cuerpo` text DEFAULT NULL,  `Variables` text DEFAULT NULL,  PRIMARY KEY (`PkAccionEmail`)) ENGINE=InnoDB DEFAULT CHARSET=latin1")
            self.mysql_con.ejecutar("CREATE TABLE `acciones_notificaciones` (  `PkAccionNotificacion` int(255) NOT NULL AUTO_INCREMENT,  `Usuario` varchar(255) DEFAULT '',  `Sentencia` text DEFAULT NULL,  `Tipo` varchar(255) DEFAULT NULL,  PRIMARY KEY (`PkAccionNotificacion`)) ENGINE=InnoDB DEFAULT CHARSET=latin1")
            dbversion = dbversion + 1
        if dbversion == 10:
            self.mysql_con.ejecutar("update llankay_datos_clientes set versionWeb = '11'")
            self.mysql_con.ejecutar("ALTER table acciones_email add COLUMN HtmlCuerpoCab text")
            self.mysql_con.ejecutar("ALTER table acciones_email add COLUMN HtmlCuerpoDet text")
            self.mysql_con.ejecutar("ALTER table acciones_email add COLUMN HtmlCuerpoPie text")
            self.mysql_con.ejecutar("update acciones_email set HtmlCuerpoCab = '', HtmlCuerpoDet = '', HtmlCuerpoPie = '' ")
            dbversion = dbversion + 1
        if dbversion == 11:
            self.mysql_con.ejecutar("update llankay_datos_clientes set versionWeb = '12'")
            self.mysql_con.ejecutar("alter table web_externo_acceso add COLUMN tag text")
            self.mysql_con.ejecutar("UPDATE web_externo_acceso set tag = Usuario")
            dbversion = dbversion + 1
        if dbversion == 12:
            self.mysql_con.ejecutar("update llankay_datos_clientes set versionWeb = '13'")
            self.mysql_con.ejecutar("alter table web_p_panel_plantilla_seg_valor add COLUMN etiqueta text")
            self.mysql_con.ejecutar("UPDATE web_p_panel_plantilla_seg_valor  set etiqueta = valor")
            dbversion = dbversion + 1
        if dbversion == 13:
            self.mysql_con.ejecutar("update llankay_datos_clientes set versionWeb = '14'")
            self.mysql_con.ejecutar("alter table web_p_panel_plantilla_seg add COLUMN etiqueta text")
            self.mysql_con.ejecutar("UPDATE web_p_panel_plantilla_seg set etiqueta = base")
            dbversion = dbversion + 1






class offline:
    def __init__(self, conn_user, conn_pass, conn_base, conn_ip):
        self.mysql_con = web.mysql.class_mysql(conn_user, conn_pass, conn_base, conn_ip, '3306') 
    def sqltabla(self, senten):
        return self.mysql_con.table(senten) 
    def traer_respuestas_offline(self):
        sentencia = "SELECT * from web_offline_prerespuestas"
        return self.mysql_con.table(sentencia) 
    def traer_modulos_offline(self):
        sentencia = "SELECT * from web_offline_modulos"
        return self.mysql_con.table(sentencia) 
    def traer_respuestas_offline_bases(self, t_pkmodulo):
        sentencia = "SELECT * from camposxestructura where PkModulo = "+str(t_pkmodulo)+" and tablacampo = 'cmpreferencia'"
        return self.mysql_con.table(sentencia) 
    def cmpreferencia_condiciones(self, t_pkcampo):
        sentencia = "select * from cmpreferenciacondicion where pkcampo = '"+str(t_pkcampo)+"'"
        return self.mysql_con.table(sentencia) 
    def estructuras_offline(self):
        sentencia = "SELECT estructura.* from modulo, estructura where modulo.PkModulo = estructura.PkModulo and modulo.Plantilla = 'Offline'"
        return self.mysql_con.table(sentencia) 
    def cmpreferecnias(self, t_pkestructura):
        sentencia = "select * from cmpreferencia where pkestructura = " + str(t_pkestructura)
        return self.mysql_con.table(sentencia) 

        

class menu_reportes:
    def __init__(self, conn_user, conn_pass, conn_base, conn_ip):
        self.mysql_con = web.mysql.class_mysql(conn_user, conn_pass, conn_base, conn_ip, '3306') 
    def traer_sql_directo(self, t_senten):
        return self.mysql_con.table(t_senten)    
    def traer_reporte_html_campos(self, t_PkReporte, t_seccion):
        sentencia= "SELECT * from reportesmainhtml_campos where PkReporte = '"+str(t_PkReporte)+"' and seccion = '"+str(t_seccion)+"'"
        return self.mysql_con.table(sentencia)    
    def traer_reporte_html_cabecera(self, t_PkReporte):
        sentencia= "SELECT * from reportesmainhtml where PkReporte = '"+str(t_PkReporte)+"'"
        return self.mysql_con.table(sentencia)    
    def traer_reporte_htmlsubhtml(self, t_PkReporte):
        sentencia= "SELECT * from reportesmainhtml_subhtml where PkReporte = '"+str(t_PkReporte)+"'"
        return self.mysql_con.table(sentencia)    
    def traer_reporte_html(self, t_PkReporte):
        sentencia= "SELECT * from reportesmainhtml where PkReporte = '"+str(t_PkReporte)+"'"
        return self.mysql_con.table(sentencia)    
    def traer_reporte_por_nombre(self, t_Nombre, t_PkModulo):
        return self.mysql_con.table("select * from reportesmain where Nombre like '"+str(t_Nombre)+"' and PkModulo = "+str(t_PkModulo)+" ")
    def crear_reporte(self, t_Nombre, t_PkModulo):
        sentencia = "INSERT INTO `reportesmain` (`Nombre`, `Descripcion`, `Anulado`, `PkModulo`, `cabeceras`, `formato`, `posicion`, `Arch_Excell`, `Con_detalle`, `Tipo`) VALUES ('"+str(t_Nombre)+"', '"+str(t_Nombre)+"', 'N', '"+str(t_PkModulo)+"', 'True', 'Ambos', 'Vertical', '', 'Sin Detalle', 'Normal')"
        self.mysql_con.ejecutar(sentencia)      
        t_Reporte = self.traer_reporte_por_nombre(t_Nombre, t_PkModulo)
        sentencia = "INSERT INTO `reportesqselect` (`PkReporte`, `Sentencia`, `nivel`) VALUES ('" +str(t_Reporte[0]['PkReporte'])+"', '', '0')"
        self.mysql_con.ejecutar(sentencia)      
        sentencia = "INSERT INTO `reportesqfrom` (`PkReporte`, `Sentencia`, `nivel`) VALUES ('" +str(t_Reporte[0]['PkReporte'])+ "', '', '0')"
        self.mysql_con.ejecutar(sentencia)      
        sentencia = "INSERT INTO `reportesqwhere` (`PkReporte`, `Sentencia`, `nivel`) VALUES ('"+str(t_Reporte[0]['PkReporte'])+ "', '', '0')"
        self.mysql_con.ejecutar(sentencia)      
        sentencia = "INSERT INTO `reportesqrest` (`PkReporte`, `Sentencia`, `nivel`) VALUES ('"+str(t_Reporte[0]['PkReporte'])+ "', '', '0')"
        self.mysql_con.ejecutar(sentencia)      
        sentencia = "INSERT INTO `reportesqGRP` (`PkReporte`, `Sentencia`, `nivel`) VALUES ('" +str(t_Reporte[0]['PkReporte'])+ "', '', '0')"
        self.mysql_con.ejecutar(sentencia)      
        return t_Reporte

class Notificaciones:
    def __init__(self, conn_user, conn_pass, conn_base, conn_ip):
        self.mysql_con = web.mysql.class_mysql(conn_user, conn_pass, conn_base, conn_ip, '3306')      
    def NotificacionesPorUsuario(self, str_usuario):
        return self.mysql_con.table("Select * from acciones_notificaciones where Usuario like '%("+str(str_usuario)+")%'")  
    def sql_traer_directo(self,V_sentencia):
        return self.mysql_con.table(V_sentencia)

class inter_registro:
    def __init__(self, conn_user, conn_pass, conn_base, conn_ip):
        self.mysql_con = web.mysql.class_mysql(conn_user, conn_pass, conn_base, conn_ip, '3306')      
    def panel_web_p_panel_traer(self, str_pkpanel):
        return self.mysql_con.table("Select * from web_p_panel where pkPanel = '"+str(str_pkpanel)+"'")  
    def modulo_devolver_estructura_pornombre(self, str_Estructura):
        return self.mysql_con.table("Select * from estructura where Nombre = '"+(str_Estructura)+"'")  

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
    
    def traer_plantilla_pdf_fechas(self,t_pkpaneL_g, t_valor, t_fecha):
        sentencia = "select * from web_p_panel_grupo_track where pkPanel = '"+str(t_pkpaneL_g)+"' and pk_valor = '"+str(t_valor)+"' and date(fecha) <= date('"+str(t_fecha)+"')  order by fecha desc"
        return self.mysql_con.table(sentencia)        
    def traer_plantilla_pdf_solo_fecha(self,t_pkpaneL_g, t_valor, t_fecha, t_user):
        if t_user != '%':
            sentencia = "select * from web_p_panel_grupo_track where UPPER(usuario) = UPPER('"+str(t_user)+"') and pkPanel = '"+str(t_pkpaneL_g)+"' and pk_valor = '"+str(t_valor)+"' and date(fecha) = date('"+str(t_fecha)+"')"
        else:
            sentencia = "select * from web_p_panel_grupo_track where pkPanel = '"+str(t_pkpaneL_g)+"' and pk_valor = '"+str(t_valor)+"' and date(fecha) = date('"+str(t_fecha)+"')"
        return self.mysql_con.table(sentencia)        
    def traer_plantilla_pdf_bases(self,t_pkpaneL_g):
        sentencia = "select * from web_p_panel_plantilla_seg_bases where pkgrupo ="+ str(t_pkpaneL_g)
        return self.mysql_con.table(sentencia)        
    def traer_plantilla_pdf_hojas(self,t_pkpaneL_g):
        sentencia = "select * from web_p_panel_plantilla_hojas where pkgrupo ="+ str(t_pkpaneL_g)
        return self.mysql_con.table(sentencia)    
    def traer_plantilla_pdf_seg_porhoja(self,t_pkhoja , t_pkpaneL_g):
        sentencia = "select * from web_p_panel_plantilla_seg where pkgrupo = "+str(t_pkpaneL_g)+" and pkhoja ="+ str(t_pkhoja)
        return self.mysql_con.table(sentencia)        
        
    def traer_plantilla_pdf_seg_tipo(self,t_pkpaneL_g, t_tipo):
        sentencia = "select * from web_p_panel_plantilla_seg where tipo = '"+str(t_tipo)+"' and pkgrupo ="+ str(t_pkpaneL_g) + " order by pkhoja"
        return self.mysql_con.table(sentencia)       
    def traer_plantilla_pdf_seg_tipo_porsegmento(self,t_pkpaneL_g, t_tipo):
        sentencia = "select * from web_p_panel_plantilla_seg where tipo = '"+str(t_tipo)+"' and pkgrupo ="+ str(t_pkpaneL_g) + " order by pksegmento"
        return self.mysql_con.table(sentencia)               
    def panel_grupo_track_eliminar(self,t_pkpanel, t_user, t_fecha ):
        sentencia = "delete from web_p_panel_grupo_track where fecha = '"+str(t_fecha)+"' and usuario = '"+str(t_user)+"' and pkpanel = '"+str(t_pkpanel)+"'"
        self.mysql_con.ejecutar(sentencia)       
    def traer_plantilla_pdf_seg(self,t_pkpaneL_g):
        sentencia = "select * from web_p_panel_plantilla_seg where pkgrupo ="+ str(t_pkpaneL_g)
        return self.mysql_con.table(sentencia)        
    def traer_plantilla_pdf_valor(self,t_pksegmento):
        sentencia = "select * from web_p_panel_plantilla_seg_valor where pksegmento ="+ str(t_pksegmento)
        return self.mysql_con.table(sentencia)        
    def traer_plantilla_pdf_valor_SoloCamposen_orden(self,t_pksegmento):
        sentencia = "select * from web_p_panel_plantilla_seg_valor where pksegmento ="+ str(t_pksegmento) + " and tipo = 'Campo' order by cast(y as decimal(12,0)) "
        return self.mysql_con.table(sentencia)        
    def traer_estructuras_porPkmodulo(self,strpk):
        sentencia = "select Nombre from estructura where pkmodulo ="+ str(strpk)
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
    def lista_estados_por_usuario(self, str_pkmodulo, str_usuario):
        sentencia = "select * from web_estados_doc where usuarios like '%("+str_usuario+")%' and PkModulo = "+ str(str_pkmodulo)
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
        sentencia = "INSERT INTO `web_firmas` (`uso`, `certificado`, `clave`, `usuario`, `expiracion`, `x`, `y`, `display`, `pk`, `firma`, `tipo`, `fuente`) VALUES ('panel', '', '', '"+str(t_us_use)+"', '2022-09-30', '8', '7', 'Firmado por "+str(t_us_nom)+" "+str(t_us_ape)+" https://www.firmadigital.gob.ec/', '72', '"+str(t_us_nom)+" "+str(t_us_ape)+"', 'Usuario', '"+str(t_us_use)+"')" 
        self.mysql_con.ejecutar(sentencia) 
    def del_usuario(self, str_pk):
        sentencia = 'delete from usuario where usuario.PkUsuario = "'+ str_pk +'"'
        self.mysql_con.ejecutar(sentencia)     
    def carga_list_user_paneles(self):
        return self.mysql_con.table('select * from web_p_panel') 
    def carga_list_user_paneles_user(self):
        return self.mysql_con.table('select * from web_p_panel_user') 
    def carga_list_user_completa_para_estado(self):
        return self.mysql_con.table('select * from usuario order by Usuario') 
    def carga_list_user_completa(self):
        return self.mysql_con.table('select * from usuario order by Usuario') 
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
        return self.mysql_con.table('select DISTINCT m.PkModulo AS "PkModulo",  WE.pk AS "id", WE.pk AS "PkOpciones", CASE WHEN WE.tipo = 1 THEN    "Consulta" WHEN WE.tipo = 2 THEN    "Ingresar" WHEN WE.tipo = 3 THEN    "Modificar" WHEN WE.tipo = 4 THEN   "Eliminar" WHEN WE.tipo = 5 THEN   "Solo" END AS "Nombre" FROM web_a_permisos WE,  modulo M,   sysmodulogeneral S WHERE    WE.pkmodulo = M.PkModulo AND S.PkModGen = M.Cabecera and    WE.usuario = "' + V_user +'" AND M.PkModulo = "' + V_pkmodulo +'" AND M.anulado LIKE "N" ORDER BY   s.orden,    m.orden')
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
    def consulta_orden_web(self, V_pkmodulo, V_top, v_usuario, v_solo):
        tabla = self.mysql_con.table('select * from estructura where PkModulo = "' + V_pkmodulo +'" and hijade = 0')
        tabla_campos = self.mysql_con.table('select nombre from camposxestructura where PkEstructura = "' + str(tabla[0]['PkEstructura']) +'" and visible = "Y" and anulado = "N" and Eliminable = "Y" order by PosicionConsulta')
        txt_taer = 'Pk'+ tabla[0]['Nombre'] + ', '
        for a in tabla_campos:
            txt_taer = txt_taer + ' cast(' + a['nombre'] + ' as char) as "' + a['nombre'] + '" , '
        txt_taer = txt_taer[:-2]
        sentencia_rebuscar = 'select ' + txt_taer +' from ' + tabla[0]['Nombre']
        if v_solo == 'Si':
            campos_sistema = self.mysql_con.table('SELECT * from cmpsistema where PkEstructura = ' + str(tabla[0]['PkEstructura']) +' and pkid = 2')
            if len(campos_sistema)> 0:
                sentencia = 'select ' + txt_taer +' from ' + tabla[0]['Nombre'] + ' where '+str(campos_sistema[0]['Nombre'])+' = "'+str(v_usuario)+'" order by pk' + tabla[0]['Nombre'] + ' desc limit ' + str(V_top) 
            else:
                sentencia = 'select ' + txt_taer +' from ' + tabla[0]['Nombre'] + ' order by pk' + tabla[0]['Nombre'] + ' desc limit ' + str(V_top) 
        else:
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
    def t_estadosVariables(self, V_pkestado):
        t_sentencia = 'select * from web_estados_doc_var where pkestado = "' + str(V_pkestado) +'"' 
        try:             
            tablas = self.mysql_con.table(t_sentencia)
        except:
            self.mysql_con.ejecutar("CREATE TABLE `web_estados_doc_var` (  `pkvariable` int(11) NOT NULL AUTO_INCREMENT,  `pkestado` int(11) DEFAULT NULL,  `Nombre` varchar(255) DEFAULT NULL,  `Tipo` varchar(255) DEFAULT NULL,  PRIMARY KEY (`pkvariable`)) ENGINE=InnoDB DEFAULT CHARSET=latin1")
            tablas = self.mysql_con.table(t_sentencia)
        return tablas  

    def t_estadostraspaso(self, V_pkestado):
        t_sentencia = 'select * from web_estados_doc_traspaso where pkestado = "' + str(V_pkestado) +'"' 
        tablas = self.mysql_con.table(t_sentencia)
        return tablas  


    def traer_campos_por_pkestr_solo_visible(self, PkEstructura):
        Campos = self.mysql_con.table('select * from camposxestructura where PkEstructura = "' + str(PkEstructura) +'" and anulado = "N" and (visible = "Y" or Eliminable = "N") order by posicion, x, y')
        return Campos   

    def traer_campos_por_pkestr_solo_visible_orden(self, PkEstructura):
        Campos = self.mysql_con.table('select * from camposxestructura where PkEstructura = "' + str(PkEstructura) +'" and anulado = "N" and (visible = "Y") order by posicion, x, y')
        return Campos   

    def traer_campos_por_pkestr_solo_visible_orden_consuWeb(self, PkEstructura):
        Campos = self.mysql_con.table('select * from camposxestructura where PkEstructura = "' + str(PkEstructura) +'" and anulado = "N" and (visible = "Y" or Eliminable = "N") order by Eliminable, posicionConsulta')
        return Campos   

    def traer_campos_por_pkestr(self, PkEstructura):
        Campos = self.mysql_con.table('select * from camposxestructura where PkEstructura = "' + str(PkEstructura) +'" and anulado = "N" order by posicion, x, y')
        return Campos    
    def camposXConsulta(self, tablas):
        Campos_cabecera = self.mysql_con.table('select * from camposxestructura where PkEstructura = "' + str(tablas[0]['PkEstructura']) +'" and anulado = "N" order by posicionConsulta, x, y')
        Campos_detalle= 0
        Campos_subdetalle = 0
        if len(tablas) > 1:
            Campos_detalle = self.mysql_con.table('select * from camposxestructura where PkEstructura = "' + str(tablas[1]['PkEstructura']) +'" and anulado = "N" order by posicionConsulta, x, y')
            if len(tablas) > 2:
                Campos_subdetalle = self.mysql_con.table('select * from camposxestructura where PkEstructura = "' + str(tablas[2]['PkEstructura']) +'" and anulado = "N" order by posicionConsulta, x, y')
        return [Campos_cabecera, Campos_detalle, Campos_subdetalle]  

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
        senten = 'select '+ select +' from ' + str(tablas[0]['Nombre']) +' where Pk' + str(tablas[0]['Nombre']) +' = "' + str(V_pkregistro) +'"'
        val_cabecera = self.mysql_con.table(senten)
        val_detalle= 0
        val_subdetalle = 0
        if len(tablas) > 1:
            select = ""
            for a in campos["campos_det"]:
                select = select + a['Nombre'] + ', '
            select = select[:-2]
            val_detalle = self.mysql_con.table('select '+ select +' from ' + str(tablas[1]['Nombre']) +' where PKCabecera = "' + str(V_pkregistro) +'" order by pk'+str(tablas[1]['Nombre']) + ' ') #desc
            if len(tablas) > 2:
                select = ""
                for a in campos["campos_subdet"]:
                    select = select + a['Nombre'] + ', '
                select = select[:-2]
                val_subdetalle = self.mysql_con.table('select '+ select +' from ' + str(tablas[2]['Nombre']) +' where PKCabecera in(select PK' + str(tablas[1]['Nombre']) +' from ' + str(tablas[1]['Nombre']) +' where PKCabecera = "' + V_pkregistro +'")')
        return [val_cabecera, val_detalle, val_subdetalle]  
    
    def valores_codniones(self, tablas, campos, condiciones, usuario, filtro):
        select = ""
        where_filtro = ""
        t_mix = condiciones[0]['Campo'].split(';')
        for a in campos["campos_cab"]:
            select = select + a['Nombre'] + ', '
            where_filtro = where_filtro + str(a['Nombre']) + ' like "%'+str(filtro)+'%" or '
        select = select[:-2]
        where_filtro = '(' + where_filtro[:-3] + ')'
        if filtro == '':
            senten = 'select '+ select +' from ' + str(tablas[0]['Nombre']) +' where ' + str(t_mix[0]) +' like "' + str(condiciones[0]['Valor']) +'" '+str(condiciones[0]['cond_base']).replace("@Usuario@", usuario)+' order by pk' + str(tablas[0]['Nombre']) +' desc limit 49'  #desc
        else:
            senten = 'select '+ select +' from ' + str(tablas[0]['Nombre']) +' where '+ str(where_filtro) +' and  ' + str(t_mix[0]) +' like "' + str(condiciones[0]['Valor']) +'" '+str(condiciones[0]['cond_base']).replace("@Usuario@", usuario)+' order by pk' + str(tablas[0]['Nombre']) +' desc limit 49'  #desc
        val_cabecera = self.mysql_con.table(senten)
        return [val_cabecera]
    def cmpconso_ejecutar(self, cmpsenten):
        tablas = self.mysql_con.table(cmpsenten)                
        return tablas
    def solo_ejecutar(self, cmpsenten):
        tablas = self.mysql_con.ejecutar(cmpsenten)                
        return tablas
    def cmpbuscador_ejecutar_sun_limite(self, cmpsenten):
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
            logger.exception('Valio mysql')
            logger.exception(str(e) )
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
                if estru[0]['Cedula'] == 'Y':
                    estru[0]['SRI'] = self.mysql_con.table("select * from cmptxtsimpleSRI where PkCampo = '" + str(i["PkCampo"]) + "'")
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
                estru5 = self.mysql_con.table("select * from cmpreferenciaaplicar where PkCampo = '" + str(i["PkCampo"]) + "'")
                estru6 = self.mysql_con.table("select * from cmpreferenciaaplicarcond where PkCampo = '" + str(i["PkCampo"]) + "'")
                fun_cab.update({i["Nombre"]:[estru, estru2, estru3, estru4, estru5, estru6]})

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
                if temp0[0]["Tipo"] == "RetencionV2":
                    temp3 = self.mysql_con.table("select * from cmpelect_ret_impuestosdocsustento where pkcampo =  "+ str(i["PkCampo"]))
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
    def TraerAccionesCorreo(self, V_PkAccionL2):
        try:
            sentencia = "select * from acciones_email where PkAccion = '" + str(V_PkAccionL2) + "'"
            return self.mysql_con.table(sentencia)        
        except:
            sentencia = "CREATE TABLE `acciones_email` (  `PkAccionEmail` int(255) NOT NULL AUTO_INCREMENT,  `PkAccion` varchar(255) DEFAULT NULL,  `De` text DEFAULT NULL,  `Para` text DEFAULT NULL,  `Tema` text DEFAULT NULL,  `CuerpoCab` text DEFAULT NULL,  `VariablesCad` text DEFAULT NULL,  `CuerpoDet` text DEFAULT NULL,  `VariablesDet` text DEFAULT NULL,  `CuerpoPie` text DEFAULT NULL,  PRIMARY KEY (`PkAccionEmail`)) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1"
            self.mysql_con.ejecutar(sentencia)   
            sentencia = "select * from acciones_email where PkAccion = '" + str(V_PkAccionL2) + "'"
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
    def plantillashtmlCampos(self, t_PkPlantilla, t_Tipo):
        sentencia = "select * from plantillashtmlCampos where PkPlantilla = '" + str(t_PkPlantilla) + "' and Tipo = '"+str(t_Tipo)+"'"
        return self.mysql_con.table(sentencia)
    def plantillasMainhtml(self, V_PkModulo):
        try:
            sentencia = "select * from plantillashtml where PkModulo = '" + str(V_PkModulo) + "'"
            return self.mysql_con.table(sentencia)
        except Exception as e: 
            self.mysql_con.ejecutar('CREATE TABLE `plantillashtml` (  `PkPlantilla` int(11) NOT NULL AUTO_INCREMENT,  `Nombre` text DEFAULT NULL,  `PkModulo` int(11) DEFAULT NULL,  `Cabecera` text DEFAULT NULL,  `Pie` text DEFAULT NULL,  `DetalleLinea` text DEFAULT NULL,  `DetalleCabecera` text DEFAULT NULL,  PRIMARY KEY (`PkPlantilla`)) ENGINE=InnoDB AUTO_INCREMENT=264 DEFAULT CHARSET=latin1')
            self.mysql_con.ejecutar('CREATE TABLE `plantillashtmlcampos` (  `PkCampoCabecera` int(11) NOT NULL AUTO_INCREMENT,  `PkPlantilla` int(11) NOT NULL,  `Tag` text DEFAULT NULL,  `Valor` text DEFAULT NULL,  `Tipo` varchar(255) DEFAULT NULL,  PRIMARY KEY (`PkCampoCabecera`)) ENGINE=InnoDB AUTO_INCREMENT=10928 DEFAULT CHARSET=latin1')            
            sentencia = "select * from plantillashtml where PkModulo = '" + str(V_PkModulo) + "'"
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
    def traer_campo_por_pkestr_nombre(self, Pkestru, t_nombre):
        sentencia = "select * from camposxestructura where PkEstructura = '" + str(Pkestru) + "' and Nombre = '" + str(t_nombre) + "'"
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
            sentencia = "select * from camposxestructura where PkEstructura = '" + str(PKEtruc) + "' and PkId != '" + str(Pkid) + "' and Anulado = 'N' and Visible = 'Y' and posicionweb = '" +str(posiWEB)+ "' and posicion < " +str(posi)+ " "
        else:
            sentencia = "select * from camposxestructura where PkEstructura = '" + str(PKEtruc) + "' and PkId != '" + str(Pkid) + "' and Anulado = 'N' and Visible = 'Y' and posicionweb = '" +str(posiWEB)+ "' and posicion > " +str(posi)+ " "        
        return self.mysql_con.table(sentencia)
    def traer_listado_cc_por_estru_posi_normal(self, PKEtruc, dire, posi, Pkid, posiWEB):
        if dire == '0':
            sentencia = "select * from camposxestructura where PkEstructura = '" + str(PKEtruc) + "' and PkId != '" + str(Pkid) + "' and Anulado = 'N' and Visible = 'Y' and posicionConsulta < " +str(posi)
        else:
            sentencia = "select * from camposxestructura where PkEstructura = '" + str(PKEtruc) + "' and PkId != '" + str(Pkid) + "' and Anulado = 'N' and Visible = 'Y' and posicionConsulta > " +str(posi)        
        return self.mysql_con.table(sentencia)

class transsaciones:
    def __init__(self, conn_user, conn_pass, conn_base, conn_ip):
        self.mysql_con = web.mysql.class_mysql_trass(conn_user, conn_pass, conn_base, conn_ip, '3306')
    def ingreso_base(self, senten_cab, senten_det, senten_acc, pkmodulo, senten_subdet):
        self.mysql_con.empiza()
        for i in senten_cab:
            if self.mysql_con.ejecutar(i) == False:
                self.mysql_con.rollback()
                return [False,i]
        for i in senten_det:
            if self.mysql_con.ejecutar(i) == False:
                self.mysql_con.rollback()
                return [False,i]
        for i in senten_subdet:
            if self.mysql_con.ejecutar(i) == False:
                self.mysql_con.rollback()
                return [False,i]
        for i in senten_acc:
            if self.mysql_con.ejecutar(i) == False:
                self.mysql_con.rollback()
                return [False,i]
        self.mysql_con.commit()
        return [True,'']
        
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


"""
class firmas() 
    clase para traer las firmas electronicas desde la base de datos sobre pdf generados a firmar
"""
class firmas:
    def __init__(self, conn_user, conn_pass, conn_base, conn_ip):
        """
        __init__ solo para instanciar la clase Mysql
        Input: conn_user: Usuario de base de datos, conn_pass: Clave de base de datos, conn_base: NOmbre de base de datos, conn_ip: Ip del host de la base de datos
        Return: Nada
        """
        self.mysql_con = web.mysql.class_mysql(conn_user, conn_pass, conn_base, conn_ip, '3306')



    def Firma_por_bloque(self, t_usuario_bloque):
        """
        t_usuario_bloque = ['user1','user2','usern']
        Firma_por_Usuario: Devuelve Listado de firmas a realiar sobre Pdf por usuario y Uso en web_firmas
        Input:  t_usuario: Usuarrio Actual, t_uso: (variable entre {panel: "Para PDF ejecutados desde panel creados en server", modulo: Para Pdf creados desde regitros o acciones en server}), t_pk: Indicador Priamry key del panel o modulo segun sea el caso
        Variables de Uso: 
        mysql_con: Clase intanciaa de base de datos Mysql
        Return: Tabla Multi registro en diccionario
            `pkfirma` : Clave Primaria
            `uso`: (panel: Para PDF ejecutados desde panel creados en server , modulo: Para Pdf creados desde regitros o acciones en server)
            `certificado : Nombre del archivo P12 de firma electronica
            `clave` : Clave del archivo P12 de firma electronica
            `usuario` : Usuario vincula a ese certificado,
            `expiracion`: FEcha de caducidad de dicho certificado
            `x` : Posicion x de la firma (Codigo barras) x crece de izquierda a derecha
            `y` : Posicion y de la firma (Codigo barras) y crece de arriba para abajo 
            `display` : Texto que sobrepone a codigo de barras firma 
            `pk` : Primarykey del registro de origen (Panel, Modulo, Plantilla)
            `firma` Texto que sobrepone a codigo de barras firma
        """
        sentencia = "select * from web_firmas where usuario in("
        for valor in t_usuario_bloque:
            sentencia = sentencia + "'" + str(valor) + "',"
        sentencia = sentencia[:-1] + ")"
        return self.mysql_con.table(sentencia)

    def Firma_por_Usuario(self, t_usuario, t_uso, t_pk):
        """
        Firma_por_Usuario: Devuelve Listado de firmas a realiar sobre Pdf por usuario y Uso en web_firmas
        Input:  t_usuario: Usuarrio Actual, t_uso: (variable entre {panel: "Para PDF ejecutados desde panel creados en server", modulo: Para Pdf creados desde regitros o acciones en server}), t_pk: Indicador Priamry key del panel o modulo segun sea el caso
        Variables de Uso: 
        mysql_con: Clase intanciaa de base de datos Mysql
        Return: Tabla Multi registro en diccionario
            `pkfirma` : Clave Primaria
            `uso`: (panel: Para PDF ejecutados desde panel creados en server , modulo: Para Pdf creados desde regitros o acciones en server)
            `certificado : Nombre del archivo P12 de firma electronica
            `clave` : Clave del archivo P12 de firma electronica
            `usuario` : Usuario vincula a ese certificado,
            `expiracion`: FEcha de caducidad de dicho certificado
            `x` : Posicion x de la firma (Codigo barras) x crece de izquierda a derecha
            `y` : Posicion y de la firma (Codigo barras) y crece de arriba para abajo 
            `display` : Texto que sobrepone a codigo de barras firma 
            `pk` : Primarykey del registro de origen (Panel, Modulo, Plantilla)
            `firma` Texto que sobrepone a codigo de barras firma
        """
        sentencia = "select * from web_firmas where usuario = '"+str(t_usuario)+"'"
        sentencia = sentencia + "union all "
        sentencia = sentencia + "select * from web_firmas where uso = '"+str(t_uso)+"' and pk = '"+str(t_pk)+"' and tipo = 'Formulario'"
        return self.mysql_con.table(sentencia)

    def Firma_por_Usuario_directo(self, t_usuario):
        """
        Firma_por_Usuario: Devuelve Listado de firmas a realiar sobre Pdf por usuario y Uso en web_firmas
        Input:  t_usuario: Usuarrio Actual, t_uso: (variable entre {panel: "Para PDF ejecutados desde panel creados en server", modulo: Para Pdf creados desde regitros o acciones en server}), t_pk: Indicador Priamry key del panel o modulo segun sea el caso
        Variables de Uso: 
        mysql_con: Clase intanciaa de base de datos Mysql
        Return: Tabla Multi registro en diccionario
            `pkfirma` : Clave Primaria
            `uso`: (panel: Para PDF ejecutados desde panel creados en server , modulo: Para Pdf creados desde regitros o acciones en server)
            `certificado : Nombre del archivo P12 de firma electronica
            `clave` : Clave del archivo P12 de firma electronica
            `usuario` : Usuario vincula a ese certificado,
            `expiracion`: FEcha de caducidad de dicho certificado
            `x` : Posicion x de la firma (Codigo barras) x crece de izquierda a derecha
            `y` : Posicion y de la firma (Codigo barras) y crece de arriba para abajo 
            `display` : Texto que sobrepone a codigo de barras firma 
            `pk` : Primarykey del registro de origen (Panel, Modulo, Plantilla)
            `firma` Texto que sobrepone a codigo de barras firma
        """
        sentencia = "select * from web_firmas where usuario = '"+str(t_usuario)+"'"
        return self.mysql_con.table(sentencia)
    def Firma_por_Usuario_admin(self, t_usuario):
        """
        Firma_por_Usuario: Devuelve Listado de firmas a realiar sobre Pdf por usuario y Uso en web_firmas
        Input:  t_usuario: Usuarrio Actual, t_uso: (variable entre {panel: "Para PDF ejecutados desde panel creados en server", modulo: Para Pdf creados desde regitros o acciones en server}), t_pk: Indicador Priamry key del panel o modulo segun sea el caso
        Variables de Uso: 
        mysql_con: Clase intanciaa de base de datos Mysql
        Return: Tabla Multi registro en diccionario
            `pkfirma` : Clave Primaria
            `uso`: (panel: Para PDF ejecutados desde panel creados en server , modulo: Para Pdf creados desde regitros o acciones en server)
            `certificado : Nombre del archivo P12 de firma electronica
            `clave` : Clave del archivo P12 de firma electronica
            `usuario` : Usuario vincula a ese certificado,
            `expiracion`: FEcha de caducidad de dicho certificado
            `x` : Posicion x de la firma (Codigo barras) x crece de izquierda a derecha
            `y` : Posicion y de la firma (Codigo barras) y crece de arriba para abajo 
            `display` : Texto que sobrepone a codigo de barras firma 
            `pk` : Primarykey del registro de origen (Panel, Modulo, Plantilla)
            `firma` Texto que sobrepone a codigo de barras firma
        """
        sentencia = "select DISTINCT certificado, clave, expiracion from web_firmas where fuente = '"+str(t_usuario)+"'"
        return self.mysql_con.table(sentencia)
    def Firma_actualizar(self, t_Certy,t_Clave,t_Usuario):
        sentencia = "UPDATE web_firmas set certificado ='"+str(t_Certy).replace('\n','').replace('\r','')+"', clave = '"+str(t_Clave)+"' where fuente = '"+str(t_Usuario)+"'"
        self.mysql_con.ejecutar(sentencia)        

class paneles:
    def __init__(self, conn_user, conn_pass, conn_base, conn_ip):
        self.mysql_con = web.mysql.class_mysql(conn_user, conn_pass, conn_base, conn_ip, '3306')
    def ejecutar_scrips(self, t_senten):
        try:
            self.mysql_con.ejecutar(t_senten)
        except:
            pass        

    def traer_cambiotag(self, t_pkpanel):
        try:
            sentencia = "select pkpanel, pkgrupo, cambiotag  from web_p_panel_grupos where pkpanel = '"+str(t_pkpanel)+"'"
            return self.mysql_con.table(sentencia)
        except:
            self.mysql_con.ejecutar('alter table web_p_panel_grupos  add COLUMN cambiotag text')
            self.mysql_con.ejecutar('UPDATE web_p_panel_grupos set cambiotag = ""')
            sentencia = "select pkpanel, pkgrupo, cambiotag  from web_p_panel_grupos where pkpanel = '"+str(t_pkpanel)+"'"
            return self.mysql_con.table(sentencia)

    def ficha_existe(self, t_pkpanel, t_fecha, t_pkval, t_usuario):
        sentencia = "select * from web_p_panel_grupo_track where usuario = '"+str(t_usuario)+"' and pkpanel = '"+str(t_pkpanel)+"' and fecha = '"+str(t_fecha)+"' and pk_valor = '"+str(t_pkval)+"'order by fecha desc"
        return self.mysql_con.table(sentencia)
    def ficha_new(self, t_pkpanel, t_fecha, t_pkval, t_usuario):
        sentencia = "insert into `web_p_panel_grupo_track` (`pkpanel`, `fecha`, `pk_valor`, `usuario`) VALUES ('"+str(t_pkpanel)+"', '"+str(t_fecha)+"', '"+str(t_pkval)+"', '"+str(t_usuario)+"')"
        self.mysql_con.ejecutar(sentencia)  
        
    def traer_panel_internos(self, pk):
        sentencia = 'select * from  web_p_panel where tipo = "Interno" and web_p_panel.adicional2 = "'+ str(pk) +'" order by new'
        return self.mysql_con.table(sentencia)

    def traer_panel_por_pk(self, pk):
        sentencia = 'select * from  web_p_panel where  web_p_panel.pkPanel = "'+ str(pk) +'"'
        return self.mysql_con.table(sentencia)
    def traer_paneles_fechas_fichaspk(self, pkPanel, pkvalor):
        sentencia = 'select * from web_p_panel_grupo_track where web_p_panel_grupo_track.pkpanel = "'+ str(pkPanel) +'" and web_p_panel_grupo_track.pk_valor = "'+str(pkvalor)+'" order by date(fecha) desc'
        return self.mysql_con.table(sentencia)
    def traer_paneles_pdf_fichaspk(self, pk):
        sentencia = 'select * from  web_p_panel_plantilla_panel_valor where  web_p_panel_plantilla_panel_valor.pkpanel = "'+ str(pk) +'"'
        return self.mysql_con.table(sentencia)
    def traer_paneles_fichaspk(self, pk, usuario):
        sentencia = 'select * from  web_p_panel_grupos where (web_p_panel_grupos.uslectura = "Todos" or web_p_panel_grupos.uslectura like "%('+usuario+')%") and web_p_panel_grupos.pkpanel = "'+ str(pk) +'" ORDER BY orderby'
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
        sentencia = 'select Usuario from usuario order by Usuario'
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
    def traer_calendarios_val(self, sentencia, fecha, usuario,Externo):
        sentencia = sentencia.replace('@fecha',fecha) 
        sentencia = sentencia.replace('@usuario',usuario) 
        sentencia = sentencia.replace('@Externo@',Externo) 
        return self.mysql_con.table(sentencia)
    def carga_alertas(self, V_user):
        return self.mysql_con.table('select * from web_a_alertas where usuario = "'+ str(V_user) +'"')
    def ejecutar_sub_alertas(self, senten):
        return self.mysql_con.table(senten)
    def update_sub_alertas(self, senten):
        self.mysql_con.ejecutar(senten)


    def traer_paneles_por_user(self, usuario, pkpanel):
        if pkpanel == "0":
            return self.mysql_con.table('select now() as "fehca_act", web_p_panel.*, web_p_panel_user.* from  web_p_panel, web_p_panel_user where  web_p_panel.pkPanel = web_p_panel_user.pkpanel and web_p_panel_user.usuario = "'+ str(usuario) +'"')
        else:
            return self.mysql_con.table('select now() as "fehca_act", web_p_panel.*, web_p_panel_user.* from  web_p_panel, web_p_panel_user where  web_p_panel.pkPanel = web_p_panel_user.pkpanel and web_p_panel_user.usuario = "'+ str(usuario) +'" and web_p_panel.pkPanel = "'+str(pkpanel)+'"')

    def traer_paneles_todos(self):
        return self.mysql_con.table('select * from web_p_panel')

    def listadoUser(self, pk):
        return self.mysql_con.table('select Usuario from usuario order by usuario')

    def traer_paneles_grupos(self, pk):
        return self.mysql_con.table('select * from  web_p_panel_grupos where  web_p_panel_grupos.pkpanel = "'+ str(pk) +'" ORDER BY orderby ')

    def traer_paneles_usuarios(self, t_pkpanel, t_pkgrupo):
        return self.mysql_con.table('SELECT usuario.Usuario, COALESCE(web_p_panel_grupos_permisos.pconsultar, "N") as "pconsultar", COALESCE(web_p_panel_grupos_permisos.pcrear, "N") as "pcrear", COALESCE(web_p_panel_grupos_permisos.pmodificar, "N") as "pmodificar", COALESCE(web_p_panel_grupos_permisos.peliminar, "N") as "peliminar" from usuario LEFT JOIN web_p_panel_grupos_permisos on (web_p_panel_grupos_permisos.usuario = usuario.Usuario and web_p_panel_grupos_permisos.pkpanel = '+str(t_pkpanel)+' and web_p_panel_grupos_permisos.pkgrupo = '+str(t_pkgrupo)+') order by usuario.Usuario')
                
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
        self.mysql_con = web.mysql.class_mysql(conn_user, conn_pass, conn_base, conn_ip, '3306')
    def traer_charts(self, usuario):
        sentencia = 'select * from web_c_charts where usuario like "%'+ str(usuario) +'%" or usuario like "todos" order by orden'
        return self.mysql_con.table(sentencia)
    def ejecutar_charts(self, temp_sentencia):
        return self.mysql_con.table(temp_sentencia)

class eshop:
    def __init__(self, conn_user, conn_pass, conn_base, conn_ip):
        self.mysql_con = web.mysql.class_mysql(conn_user, conn_pass, conn_base, conn_ip, '3306')
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
        self.mysql_con = web.mysql.class_mysql(conn_user, conn_pass, conn_base, conn_ip, '3306')
    def traer_edocs_traspaso(self, t_pkestructura ):
        senten = 'select * from web_edocs_traspaso where pkestructura = ' + str(t_pkestructura)
        return self.mysql_con.table(senten)   
    def traer_edocs_desgloce(self, t_pkestructura ):
        senten = 'select * from web_edocs_seccion where pkestructura = ' + str(t_pkestructura)
        return self.mysql_con.table(senten)   
    def traer_edocs_enlaces(self):
        senten = 'select * from web_edocs_filtro'
        return self.mysql_con.table(senten)   
    def traer_edocs_pendientes(self, t_fecha, t_orden, t_filtro, t_docu):
        senten = '' 
        senten = 'select cast(web_edocs_main.pkid as char) as "pkid", cast(web_edocs_main.COMPROBANTE as char) as "COMPROBANTE", cast(web_edocs_main.TIPO_EMISION as char) as "TIPO_EMISION", cast(web_edocs_main.SERIE_COMPROBANTE as char) as "SERIE_COMPROBANTE", cast(web_edocs_main.RUC_EMISOR as char) as "RUC_EMISOR", cast(web_edocs_main.RAZON_SOCIAL_EMISOR as char) as "RAZON_SOCIAL_EMISOR", cast(web_edocs_main.FECHA_EMISION as char) as "FECHA_EMISION", cast(web_edocs_main.FECHA_AUTORIZACION as char) as "FECHA_AUTORIZACION", cast(web_edocs_main.CLAVE_ACCESO as char) as "CLAVE_ACCESO", cast(web_edocs_main.NUMERO_AUTORIZACION as char) as "NUMERO_AUTORIZACION", cast(web_edocs_main.IMPORTE_TOTAL as char) as "IMPORTE_TOTAL", cast(if(sri_compras.PkSri_compras is null,"Pendiente","Ingresado") as char) as "Estado" from web_edocs_main LEFT JOIN sri_compras on (sri_compras.DXP_estado != "anulado" and sri_compras.Autorizacion = web_edocs_main.NUMERO_AUTORIZACION and sri_compras.Prov_id = web_edocs_main.RUC_EMISOR and MONTH(sri_compras.Fecha_emision) = MONTH("'+str(t_fecha)+'") and YEAR(sri_compras.Fecha_emision) = YEAR("'+str(t_fecha)+'")) where MONTH(web_edocs_main.FECHA_EMISION) = MONTH("'+str(t_fecha)+'") and COMPROBANTE = "Factura" and YEAR(web_edocs_main.FECHA_EMISION) = YEAR("'+str(t_fecha)+'") and (web_edocs_main.RAZON_SOCIAL_EMISOR like "%'+str(t_filtro)+'%" or web_edocs_main.SERIE_COMPROBANTE like "%'+str(t_filtro)+'%" or web_edocs_main.RUC_EMISOR like "%'+str(t_filtro)+'%" or web_edocs_main.IMPORTE_TOTAL like "%'+str(t_filtro)+'%" or web_edocs_main.CLAVE_ACCESO like "%'+str(t_filtro)+'%" ) and sri_compras.PkSri_compras IS NULL and web_edocs_main.TIPO_EMISION = "0" and web_edocs_main.comprobante like "'+ str(t_docu) +'"'
        senten = senten + ' union all '
        senten = senten + 'select cast(web_edocs_main.pkid as char) as "pkid", cast(web_edocs_main.COMPROBANTE as char) as "COMPROBANTE", cast(web_edocs_main.TIPO_EMISION as char) as "TIPO_EMISION", cast(web_edocs_main.SERIE_COMPROBANTE as char) as "SERIE_COMPROBANTE", cast(web_edocs_main.RUC_EMISOR as char) as "RUC_EMISOR", cast(web_edocs_main.RAZON_SOCIAL_EMISOR as char) as "RAZON_SOCIAL_EMISOR", cast(web_edocs_main.FECHA_EMISION as char) as "FECHA_EMISION", cast(web_edocs_main.FECHA_AUTORIZACION as char) as "FECHA_AUTORIZACION", cast(web_edocs_main.CLAVE_ACCESO as char) as "CLAVE_ACCESO", cast(web_edocs_main.NUMERO_AUTORIZACION as char) as "NUMERO_AUTORIZACION", cast(web_edocs_main.IMPORTE_TOTAL as char) as "IMPORTE_TOTAL", cast(if(sri_compras.PkSri_compras is null,"Pendiente","Ingresado") as char) as "Estado" from web_edocs_main LEFT JOIN sri_compras on (sri_compras.DXP_estado != "anulado" and sri_compras.Autorizacion = web_edocs_main.NUMERO_AUTORIZACION and sri_compras.Prov_id = web_edocs_main.RUC_EMISOR and MONTH(sri_compras.Fecha_emision) = MONTH("'+str(t_fecha)+'") and YEAR(sri_compras.Fecha_emision) = YEAR("'+str(t_fecha)+'")) where MONTH(web_edocs_main.FECHA_EMISION) = MONTH("'+str(t_fecha)+'") and COMPROBANTE = "Notas de Credito" and YEAR(web_edocs_main.FECHA_EMISION) = YEAR("'+str(t_fecha)+'") and (web_edocs_main.RAZON_SOCIAL_EMISOR like "%'+str(t_filtro)+'%" or web_edocs_main.SERIE_COMPROBANTE like "%'+str(t_filtro)+'%" or web_edocs_main.RUC_EMISOR like "%'+str(t_filtro)+'%" or web_edocs_main.IMPORTE_TOTAL like "%'+str(t_filtro)+'%" or web_edocs_main.CLAVE_ACCESO like "%'+str(t_filtro)+'%" ) and sri_compras.PkSri_compras IS NULL and web_edocs_main.TIPO_EMISION = "0" and web_edocs_main.comprobante like "'+ str(t_docu) +'"'
        senten = senten + ' union all '
        senten = senten + ' select cast(web_edocs_main.pkid as char) as "pkid", cast(web_edocs_main.COMPROBANTE as char) as "COMPROBANTE", cast(web_edocs_main.TIPO_EMISION as char) as "TIPO_EMISION", cast(web_edocs_main.SERIE_COMPROBANTE as char) as "SERIE_COMPROBANTE", cast(web_edocs_main.RUC_EMISOR as char) as "RUC_EMISOR", cast(web_edocs_main.RAZON_SOCIAL_EMISOR as char) as "RAZON_SOCIAL_EMISOR", cast(web_edocs_main.FECHA_EMISION as char) as "FECHA_EMISION", cast(web_edocs_main.FECHA_AUTORIZACION as char) as "FECHA_AUTORIZACION", cast(web_edocs_main.CLAVE_ACCESO as char) as "CLAVE_ACCESO", cast(web_edocs_main.NUMERO_AUTORIZACION as char) as "NUMERO_AUTORIZACION", cast(web_edocs_main.IMPORTE_TOTAL as char) as "IMPORTE_TOTAL", cast(if(ingresoretenciones.PkIngresoretenciones is null,"Pendiente","Ingresado") as char) as "Estado" from web_edocs_main LEFT JOIN ingresoretenciones on (ingresoretenciones.Estado != "anulado" and ingresoretenciones.Autorizacion = web_edocs_main.NUMERO_AUTORIZACION and ingresoretenciones.Id_cliente = web_edocs_main.RUC_EMISOR ) where MONTH(web_edocs_main.FECHA_EMISION) = MONTH("'+str(t_fecha)+'") and COMPROBANTE = "Comprobante de Retencion" and YEAR(web_edocs_main.FECHA_EMISION) = YEAR("'+str(t_fecha)+'") and (web_edocs_main.RAZON_SOCIAL_EMISOR like "%'+str(t_filtro)+'%" or web_edocs_main.SERIE_COMPROBANTE like "%'+str(t_filtro)+'%" or web_edocs_main.RUC_EMISOR like "%'+str(t_filtro)+'%" or web_edocs_main.IMPORTE_TOTAL like "%'+str(t_filtro)+'%" or web_edocs_main.CLAVE_ACCESO like "%'+str(t_filtro)+'%" ) and ingresoretenciones.PkIngresoretenciones IS NULL and web_edocs_main.TIPO_EMISION = "0"  and web_edocs_main.comprobante like "'+ str(t_docu) +'"  limit 199'

        return self.mysql_con.table(senten)   
    def traer_edocs_ingresados(self, t_fecha, t_orden, t_filtro, t_docu):
        #senten = 'select web_edocs_main.pkid, web_edocs_main.COMPROBANTE, web_edocs_main.TIPO_EMISION, web_edocs_main.SERIE_COMPROBANTE, web_edocs_main.RUC_EMISOR, web_edocs_main.RAZON_SOCIAL_EMISOR, web_edocs_main.FECHA_EMISION, web_edocs_main.FECHA_AUTORIZACION, web_edocs_main.CLAVE_ACCESO, web_edocs_main.NUMERO_AUTORIZACION, web_edocs_main.IMPORTE_TOTAL, if(sri_compras.PkSri_compras is null,"Pendiente","Ingresado") as "Estado" from web_edocs_main LEFT JOIN sri_compras on (sri_compras.Autorizacion = web_edocs_main.NUMERO_AUTORIZACION and sri_compras.Prov_id = web_edocs_main.RUC_EMISOR and MONTH(sri_compras.Fecha_emision) = MONTH(DATE_ADD("'+str(t_fecha)+'",INTERVAL 1 day)) and YEAR(sri_compras.Fecha_emision) = YEAR(DATE_ADD("'+str(t_fecha)+'",INTERVAL 1 day))) where MONTH(web_edocs_main.FECHA_EMISION) = MONTH(DATE_ADD("'+str(t_fecha)+'",INTERVAL 1 day)) and COMPROBANTE = "Factura" and YEAR(web_edocs_main.FECHA_EMISION) = YEAR(DATE_ADD("'+str(t_fecha)+'",INTERVAL 1 day)) order by RAZON_SOCIAL_EMISOR, web_edocs_main.FECHA_EMISION, web_edocs_main.pkid'
        senten = 'select cast(web_edocs_main.pkid as char) as "pkid", cast(web_edocs_main.COMPROBANTE as char) as "COMPROBANTE", cast(web_edocs_main.TIPO_EMISION as char) as "TIPO_EMISION", cast(web_edocs_main.SERIE_COMPROBANTE as char) as "SERIE_COMPROBANTE", cast(web_edocs_main.RUC_EMISOR as char) as "RUC_EMISOR", cast(web_edocs_main.RAZON_SOCIAL_EMISOR as char) as "RAZON_SOCIAL_EMISOR", cast(web_edocs_main.FECHA_EMISION as char) as "FECHA_EMISION", cast(web_edocs_main.FECHA_AUTORIZACION as char) as "FECHA_AUTORIZACION", cast(web_edocs_main.CLAVE_ACCESO as char) as "CLAVE_ACCESO", cast(web_edocs_main.NUMERO_AUTORIZACION as char) as "NUMERO_AUTORIZACION", cast(web_edocs_main.IMPORTE_TOTAL as char) as "IMPORTE_TOTAL", cast(if(sri_compras.PkSri_compras is null,"Pendiente","Ingresado") as char) as "Estado" from web_edocs_main LEFT JOIN sri_compras on (sri_compras.DXP_estado != "anulado" and sri_compras.Autorizacion = web_edocs_main.NUMERO_AUTORIZACION and sri_compras.Prov_id = web_edocs_main.RUC_EMISOR and MONTH(sri_compras.Fecha_emision) = MONTH("'+str(t_fecha)+'") and YEAR(sri_compras.Fecha_emision) = YEAR("'+str(t_fecha)+'")) where MONTH(web_edocs_main.FECHA_EMISION) = MONTH("'+str(t_fecha)+'") and COMPROBANTE = "Factura" and YEAR(web_edocs_main.FECHA_EMISION) = YEAR("'+str(t_fecha)+'") and (web_edocs_main.RAZON_SOCIAL_EMISOR like "%'+str(t_filtro)+'%" or web_edocs_main.SERIE_COMPROBANTE like "%'+str(t_filtro)+'%" or web_edocs_main.RUC_EMISOR like "%'+str(t_filtro)+'%" or web_edocs_main.IMPORTE_TOTAL like "%'+str(t_filtro)+'%" or web_edocs_main.CLAVE_ACCESO like "%'+str(t_filtro)+'%" ) and not(sri_compras.PkSri_compras IS NULL) and web_edocs_main.TIPO_EMISION = "0"  and web_edocs_main.comprobante like "'+ str(t_docu) +'" '
        senten = senten + ' union all '
        senten = senten + 'select cast(web_edocs_main.pkid as char) as "pkid", cast(web_edocs_main.COMPROBANTE as char) as "COMPROBANTE", cast(web_edocs_main.TIPO_EMISION as char) as "TIPO_EMISION", cast(web_edocs_main.SERIE_COMPROBANTE as char) as "SERIE_COMPROBANTE", cast(web_edocs_main.RUC_EMISOR as char) as "RUC_EMISOR", cast(web_edocs_main.RAZON_SOCIAL_EMISOR as char) as "RAZON_SOCIAL_EMISOR", cast(web_edocs_main.FECHA_EMISION as char) as "FECHA_EMISION", cast(web_edocs_main.FECHA_AUTORIZACION as char) as "FECHA_AUTORIZACION", cast(web_edocs_main.CLAVE_ACCESO as char) as "CLAVE_ACCESO", cast(web_edocs_main.NUMERO_AUTORIZACION as char) as "NUMERO_AUTORIZACION", cast(web_edocs_main.IMPORTE_TOTAL as char) as "IMPORTE_TOTAL", cast(if(sri_compras.PkSri_compras is null,"Pendiente","Ingresado") as char) as "Estado" from web_edocs_main LEFT JOIN sri_compras on (sri_compras.DXP_estado != "anulado" and sri_compras.Autorizacion = web_edocs_main.NUMERO_AUTORIZACION and sri_compras.Prov_id = web_edocs_main.RUC_EMISOR and MONTH(sri_compras.Fecha_emision) = MONTH("'+str(t_fecha)+'") and YEAR(sri_compras.Fecha_emision) = YEAR("'+str(t_fecha)+'")) where MONTH(web_edocs_main.FECHA_EMISION) = MONTH("'+str(t_fecha)+'") and COMPROBANTE = "Notas de Credito" and YEAR(web_edocs_main.FECHA_EMISION) = YEAR("'+str(t_fecha)+'") and (web_edocs_main.RAZON_SOCIAL_EMISOR like "%'+str(t_filtro)+'%" or web_edocs_main.SERIE_COMPROBANTE like "%'+str(t_filtro)+'%" or web_edocs_main.RUC_EMISOR like "%'+str(t_filtro)+'%" or web_edocs_main.IMPORTE_TOTAL like "%'+str(t_filtro)+'%" or web_edocs_main.CLAVE_ACCESO like "%'+str(t_filtro)+'%" ) and not(sri_compras.PkSri_compras IS NULL) and web_edocs_main.TIPO_EMISION = "0"  and web_edocs_main.comprobante like "'+ str(t_docu) +'" '
        senten = senten + ' union all '
        senten = senten + ' select cast(web_edocs_main.pkid as char) as "pkid", cast(web_edocs_main.COMPROBANTE as char) as "COMPROBANTE", cast(web_edocs_main.TIPO_EMISION as char) as "TIPO_EMISION", cast(web_edocs_main.SERIE_COMPROBANTE as char) as "SERIE_COMPROBANTE", cast(web_edocs_main.RUC_EMISOR as char) as "RUC_EMISOR", cast(web_edocs_main.RAZON_SOCIAL_EMISOR as char) as "RAZON_SOCIAL_EMISOR", cast(web_edocs_main.FECHA_EMISION as char) as "FECHA_EMISION", cast(web_edocs_main.FECHA_AUTORIZACION as char) as "FECHA_AUTORIZACION", cast(web_edocs_main.CLAVE_ACCESO as char) as "CLAVE_ACCESO", cast(web_edocs_main.NUMERO_AUTORIZACION as char) as "NUMERO_AUTORIZACION", cast(web_edocs_main.IMPORTE_TOTAL as char) as "IMPORTE_TOTAL", cast(if(ingresoretenciones.PkIngresoretenciones is null,"Pendiente","Ingresado") as char) as "Estado" from web_edocs_main LEFT JOIN ingresoretenciones on (ingresoretenciones.Estado != "anulado" and ingresoretenciones.Autorizacion = web_edocs_main.NUMERO_AUTORIZACION and ingresoretenciones.Id_cliente = web_edocs_main.RUC_EMISOR ) where MONTH(web_edocs_main.FECHA_EMISION) = MONTH("'+str(t_fecha)+'") and COMPROBANTE = "Comprobante de Retencion" and YEAR(web_edocs_main.FECHA_EMISION) = YEAR("'+str(t_fecha)+'") and (web_edocs_main.RAZON_SOCIAL_EMISOR like "%'+str(t_filtro)+'%" or web_edocs_main.SERIE_COMPROBANTE like "%'+str(t_filtro)+'%" or web_edocs_main.RUC_EMISOR like "%'+str(t_filtro)+'%" or web_edocs_main.IMPORTE_TOTAL like "%'+str(t_filtro)+'%" or web_edocs_main.CLAVE_ACCESO like "%'+str(t_filtro)+'%" ) and not(ingresoretenciones.PkIngresoretenciones IS NULL) and web_edocs_main.TIPO_EMISION = "0"  and web_edocs_main.comprobante like "'+ str(t_docu) +'" limit 199'


        return self.mysql_con.table(senten)   
    def traer_edocs_rechazadas(self, t_fecha, t_orden, t_filtro, t_docu):
        #senten = 'select web_edocs_main.pkid, web_edocs_main.COMPROBANTE, web_edocs_main.TIPO_EMISION, web_edocs_main.SERIE_COMPROBANTE, web_edocs_main.RUC_EMISOR, web_edocs_main.RAZON_SOCIAL_EMISOR, web_edocs_main.FECHA_EMISION, web_edocs_main.FECHA_AUTORIZACION, web_edocs_main.CLAVE_ACCESO, web_edocs_main.NUMERO_AUTORIZACION, web_edocs_main.IMPORTE_TOTAL, if(sri_compras.PkSri_compras is null,"Pendiente","Ingresado") as "Estado" from web_edocs_main LEFT JOIN sri_compras on (sri_compras.Autorizacion = web_edocs_main.NUMERO_AUTORIZACION and sri_compras.Prov_id = web_edocs_main.RUC_EMISOR and MONTH(sri_compras.Fecha_emision) = MONTH(DATE_ADD("'+str(t_fecha)+'",INTERVAL 1 day)) and YEAR(sri_compras.Fecha_emision) = YEAR(DATE_ADD("'+str(t_fecha)+'",INTERVAL 1 day))) where MONTH(web_edocs_main.FECHA_EMISION) = MONTH(DATE_ADD("'+str(t_fecha)+'",INTERVAL 1 day)) and COMPROBANTE = "Factura" and YEAR(web_edocs_main.FECHA_EMISION) = YEAR(DATE_ADD("'+str(t_fecha)+'",INTERVAL 1 day)) order by RAZON_SOCIAL_EMISOR, web_edocs_main.FECHA_EMISION, web_edocs_main.pkid'
        senten = 'select cast(web_edocs_main.pkid as char) as "pkid", cast(web_edocs_main.COMPROBANTE as char) as "COMPROBANTE", cast(web_edocs_main.TIPO_EMISION as char) as "TIPO_EMISION", cast(web_edocs_main.SERIE_COMPROBANTE as char) as "SERIE_COMPROBANTE", cast(web_edocs_main.RUC_EMISOR as char) as "RUC_EMISOR", cast(web_edocs_main.RAZON_SOCIAL_EMISOR as char) as "RAZON_SOCIAL_EMISOR", cast(web_edocs_main.FECHA_EMISION as char) as "FECHA_EMISION", cast(web_edocs_main.FECHA_AUTORIZACION as char) as "FECHA_AUTORIZACION", cast(web_edocs_main.CLAVE_ACCESO as char) as "CLAVE_ACCESO", cast(web_edocs_main.NUMERO_AUTORIZACION as char) as "NUMERO_AUTORIZACION", cast(web_edocs_main.IMPORTE_TOTAL as char) as "IMPORTE_TOTAL", cast(if(sri_compras.PkSri_compras is null,"Pendiente","Ingresado") as char) as "Estado" from web_edocs_main LEFT JOIN sri_compras on (sri_compras.DXP_estado != "anulado" and sri_compras.Autorizacion = web_edocs_main.NUMERO_AUTORIZACION and sri_compras.Prov_id = web_edocs_main.RUC_EMISOR and MONTH(sri_compras.Fecha_emision) = MONTH("'+str(t_fecha)+'") and YEAR(sri_compras.Fecha_emision) = YEAR("'+str(t_fecha)+'")) where MONTH(web_edocs_main.FECHA_EMISION) = MONTH("'+str(t_fecha)+'") and COMPROBANTE = "Factura" and YEAR(web_edocs_main.FECHA_EMISION) = YEAR("'+str(t_fecha)+'") and (web_edocs_main.RAZON_SOCIAL_EMISOR like "%'+str(t_filtro)+'%" or web_edocs_main.SERIE_COMPROBANTE like "%'+str(t_filtro)+'%" or web_edocs_main.RUC_EMISOR like "%'+str(t_filtro)+'%" or web_edocs_main.IMPORTE_TOTAL like "%'+str(t_filtro)+'%" or web_edocs_main.CLAVE_ACCESO like "%'+str(t_filtro)+'%" ) and web_edocs_main.TIPO_EMISION = "1"  and web_edocs_main.comprobante like "'+ str(t_docu) +'" order by ' +str(t_orden) + '  limit 199'
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

class cmpcampos:
    def __init__(self, conn_user, conn_pass, conn_base, conn_ip):
        self.mysql_con = web.mysql.class_mysql(conn_user, conn_pass, conn_base, conn_ip, '3306')


    def camposXtabla(self, strEstructura):
        sentencia = "SELECT camposxestructura .* from estructura, camposxestructura where camposxestructura.PkEstructura = estructura.PkEstructura and estructura.Nombre = '"+ str(strEstructura)+"'"
        return self.mysql_con.table(sentencia)  

    def tablasXmodulo(self, strmodulo):
        sentencia = "SELECT estructura.* from estructura, modulo where modulo.PkModulo =estructura.PkModulo and modulo.Nombre = '"+str(strmodulo)+"'"
        return self.mysql_con.table(sentencia)  
        
    def procesos(self):
        sentencia = "select * from modulo"
        return self.mysql_con.table(sentencia)  

    def crear_camposxestructura(self, t_pkmodulo, t_pkcampo, t_fuente ,t_pkestructura, t_dataX ):
        sentencia = "INSERT INTO `camposxestructura` (`PkModulo`, `PkEstructura`, `PkCampo`, `TablaCampo`, `Posicion`, `Nombre`, `Descripcion`, `Anulado`, `Eliminable`, `Visible`, `X`, `Y`, `tamano`, `estilo`, `Modificable`, `Largo`, `largoweb`,`saltoweb`,`posicionweb`,`posicionConsulta` ) VALUES ('" + str(t_pkmodulo) + "', '" + str(t_pkestructura) + "', '" + str(t_pkcampo) + "', '"+str(t_fuente)+"', '" + str(t_dataX['Posicion']) + "', '" + str(t_dataX['Nombre']) + "', '" + str(t_dataX['Descripcion']) + "', '" + str(t_dataX['Anulado']) + "', '"+str(t_dataX['Eliminable'])+"', '"+str(t_dataX['Visible'])+"', '" + str(t_dataX['X']) + "', '" + str(t_dataX['Y']) + "', '" + str(t_dataX['tamano']) + "', '" + str(t_dataX['estilo']) + "', '" + str(t_dataX['Modificable']) + "', '" + str(t_dataX['largo']) + "', '" + str(t_dataX['largoweb']) + "', '" + str(t_dataX['saltoweb']) + "', '" + str(t_dataX['posicionweb']) + "', '" + str(t_dataX['posicionConsulta']) + "')"
        self.mysql_con.ejecutar(sentencia)
        return self.mysql_con.table("Select * from camposxestructura where PkModulo = '"+ str(t_pkmodulo)+"' and PkEstructura = '"+ str(t_pkestructura)+"' and Nombre = '"+ str(t_dataX['Nombre'])+"'")  

    def alter_Tabla_datos_text(self, es_nuevo, tabla_nombre, cmp_nombre, cmp_nombre_viejo):
        if es_nuevo == True:
            sentencia = "ALTER TABLE " + tabla_nombre + "  ADD " + cmp_nombre + " text "
        else:
            sentencia = "Alter table " + tabla_nombre + " change " + cmp_nombre_viejo + " " + cmp_nombre + " text "
        self.mysql_con.ejecutar(sentencia)

    def alter_Tabla_datos_decimal(self, es_nuevo, tabla_nombre, cmp_nombre, cmp_nombre_viejo, Decimales):
        if es_nuevo == True:
            sentencia = "ALTER TABLE " + tabla_nombre + "  ADD " + cmp_nombre + " DECIMAL(32," + str(Decimales) + ") "
        else:
            sentencia = "Alter table " + tabla_nombre + " change " + cmp_nombre_viejo + " " + cmp_nombre + " DECIMAL(32," + str(Decimales) + ") "
        self.mysql_con.ejecutar(sentencia)

        
    def alter_Tabla_datos_fecha(self, es_nuevo, tabla_nombre, cmp_nombre, cmp_nombre_viejo, tiempo):
        if es_nuevo == True:
            if tiempo == 'Y':
                sentencia = "ALTER TABLE " + tabla_nombre + "  ADD " + cmp_nombre + " DATETIME "
            else:
                sentencia = "ALTER TABLE " + tabla_nombre + "  ADD " + cmp_nombre + " DATE "
                    
        else:
            if tiempo == 'Y':
                sentencia = "Alter table " + tabla_nombre + " change " + cmp_nombre_viejo + " " + cmp_nombre + " DATETIME "
            else:
                sentencia = "Alter table " + tabla_nombre + " change " + cmp_nombre_viejo + " " + cmp_nombre + " DATE "
        self.mysql_con.ejecutar(sentencia)

    def tarer_campo_cmpextrucutra(self, t_PkId):
        return self.mysql_con.table("Select * from camposxestructura where PkId ="+ str(t_PkId))  

    def crear_cmptxtsimple(self, t_pkestructura, t_dataCampo ):
        sentencia = "INSERT INTO `cmptxtsimple` (`ValorPredeterminado`, `Largo`, `Unico`, `PkEstructura`, `Nombre`, `Descripcion`, `Modificable`, `Cedula`, `largo_txtbox`) VALUES ('" + str(t_dataCampo['ValorPredeterminado']) + "', '" + str(t_dataCampo['Largo']) + "', '" + str(t_dataCampo['Unico']) + "', '" +str(t_pkestructura)+ "', '" + str(t_dataCampo['Nombre'])  + "', '" + str(t_dataCampo['Descripcion'])  + "', '" + str(t_dataCampo['Modificable'])  + "', '" + str(t_dataCampo['Cedula']) + "', '" + str(t_dataCampo['largo_txtbox']) + "')"
        self.mysql_con.ejecutar(sentencia)

        return self.mysql_con.table("Select * from cmptxtsimple where PkEstructura = '"+ str(t_pkestructura)+"' and Nombre = '"+ str(t_dataCampo['Nombre'])+"'")  



    def crear_cmpnumsimple_agregarPredeterminado(self, t_pkestructura, t_dataCampo ):
        self.mysql_con.ejecutar('alter table cmpnumsimple add COLUMN Predeterminado DECIMAL(12,2)')


    def crear_cmpnumsimple(self, t_pkestructura, t_dataCampo ):
        try:
            sentencia = "INSERT INTO `cmpnumsimple` (`NumDecimales`, `Menor`, `Mayor`, `Unico`, `PkEstructura`, `Nombre`, `Descripcion`, `Predeterminado`) VALUES ('" + str(t_dataCampo['NumDecimales']) + "', '" + str(t_dataCampo['Menor']) + "', '" + str(t_dataCampo['Mayor']) + "', '" + str(t_dataCampo['Unico']) + "', '" + str(t_pkestructura) + "', '" + str(t_dataCampo['Nombre']) + "', '" + str(t_dataCampo['Descripcion']) + "', '" + str(t_dataCampo['Predeterminado']) + "')"
            self.mysql_con.ejecutar(sentencia)
        except:
            pass
        return self.mysql_con.table("Select * from cmpnumsimple where PkEstructura = '"+ str(t_pkestructura)+"' and Nombre = '"+ str(t_dataCampo['Nombre'])+"'")  

    def crear_cmpnumsecuencial(self, t_pkestructura, t_dataCampo ):
        sentencia = "INSERT INTO `cmpnumsecuencial` (`ValorInicial`, `Aumento`, `PkEstructura`, `Nombre`) VALUES ('" + str(t_dataCampo['ValorInicial']) + "', '" + str(t_dataCampo['Aumento']) + "', '" + str(t_pkestructura) + "', '" + str(t_dataCampo['Nombre']) + "')"
        self.mysql_con.ejecutar(sentencia)
        return self.mysql_con.table("Select * from cmpnumsecuencial where PkEstructura = '"+ str(t_pkestructura)+"' and Nombre = '"+ str(t_dataCampo['Nombre'])+"'")  

    def crear_cmpopcmultiple(self, t_pkestructura, t_dataCampo ):
        sentencia = "INSERT INTO `cmpopcmultiple` (`PkEstructura`, `Nombre`) VALUES ('" + str(t_pkestructura) + "', '" + str(t_dataCampo['Nombre']) + "')"
        self.mysql_con.ejecutar(sentencia)
        pkcampo = self.mysql_con.table("Select * from cmpopcmultiple where PkEstructura = '"+ str(t_pkestructura)+"' and Nombre = '"+ str(t_dataCampo['Nombre'])+"'")  

        for a in t_dataCampo['valores']:
            sentencia = "INSERT INTO `cmpopcionvalores` (`PkCampo`, `Nombre`, `Valor`, `Color`) VALUES ('" + str(pkcampo[0]['PkCampo']) + "', '" + str(a['Nombre']) + "', '" + str(a['Valor']) + "', '" + str(a['Color']) + "')"
            self.mysql_con.ejecutar(sentencia)

        return pkcampo

    def crear_cmpsistema(self, t_pkestructura, t_dataCampo ):
        sentencia = "INSERT INTO `cmpsistema` ( `PkId`, `PkEstructura`, `Nombre`) VALUES ('" + str(t_dataCampo['Tipo']) + "', '" + str(t_pkestructura) + "', '" + str(t_dataCampo['Nombre']) + "')"
        self.mysql_con.ejecutar(sentencia)
        return self.mysql_con.table("Select * from cmpsistema where PkEstructura = '"+ str(t_pkestructura)+"' and Nombre = '"+ str(t_dataCampo['Nombre'])+"'")  

    def crear_cmpformuladetalle(self, t_pkestructura, t_dataCampo ):
        sentencia = "INSERT INTO `cmpformuladetalle` (`Operacion`, `Campo`, `Condicion`, `TablaCabecera`, `TablaDetalle`, `PkEstructura`, `Nombre`, `Anulado`) VALUES ('" + str(t_dataCampo['Operacion']) + "', '" + str(t_dataCampo['Campo']) + "', '" + str(t_dataCampo['Condicion']) + "', '" + str(t_dataCampo['TablaCabecera']) + "', '" + str(t_dataCampo['TablaDetalle']) + "', '" + str(t_pkestructura) + "', '" + str(t_dataCampo['Nombre']) + "', 'N')"
        self.mysql_con.ejecutar(sentencia)
        pkcampo = self.mysql_con.table("Select * from cmpformuladetalle where PkEstructura = '"+ str(t_pkestructura)+"' and Nombre = '"+ str(t_dataCampo['Nombre'])+"'")  
        #condicion en num decimales

        for a in t_dataCampo['condiciones']:
            sentencia = "INSERT INTO `cmpformuladetallecondicion` (`PkCampo`, `TablaOrigen`, `Campo`, `Operador`, `Valor`, `Tipo`) VALUES ('" + str(pkcampo[0]['PkCampo']) + "', '" + str(a['TablaOrigen']) + "', '" + str(a['Campo']) + "', '" + str(a['Operador']) + "', '" + str(a['Valor']) + "', '" + str(a['Tipo']) + "')"
            self.mysql_con.ejecutar(sentencia)
        return pkcampo

    def crear_cmpfecha(self, t_pkestructura, t_dataCampo ):
        sentencia = "INSERT INTO `cmpfecha` (`ValorPredetermindo`, `FechaActual`, `PkEstructura`, `Nombre`, `Tiempo`) VALUES ('" + str(t_dataCampo['ValorPredetermindo']) + "', '" + str(t_dataCampo['FechaActual']) + "', '" + str(t_pkestructura) + "', '" + str(t_dataCampo['Nombre']) + "', '" + str(t_dataCampo['Tiempo']) + "')"
        self.mysql_con.ejecutar(sentencia)
        return self.mysql_con.table("Select * from cmpfecha where PkEstructura = '"+ str(t_pkestructura)+"' and Nombre = '"+ str(t_dataCampo['Nombre'])+"'")  


    def crear_cmpreferencia(self, t_pkestructura, t_dataCampo ):
        sentencia = "INSERT INTO `cmpreferencia` (`Sentencia`, `TablaOrigen`, `ModuloOrigen`, `Condicion`, `PkEstructura`, `Nombre`, `ext`, `Columnas`, `Modo`, `pkmodulo_ingreso`, `predeterminado`, `Tipo_Predeterminado`, `A_acc_automatic`, `Desglosado`, `Limitante`, `Valor_Desglosado`, `Escribir`, `predeterminado_valor`, `multi_select`, `Permite_nulo`, `visibles`, `largos`, `orden`, `pkmod_consul`, `campo_fk`) VALUES ('" + str(t_dataCampo['Sentencia']) + "', '" + str(t_dataCampo['TablaOrigen']) + "', '" + str(t_dataCampo['ModuloOrigen']) + "', '" + str(t_dataCampo['Condicion']) + "', '" + str(t_pkestructura)+ "', '" + str(t_dataCampo['Nombre']) + "', '" + str(t_dataCampo['ext']) + "', '" + str(t_dataCampo['Columnas']) + "', '" + str(t_dataCampo['Modo']) + "', '" + str(t_dataCampo['pkmodulo_ingreso']) + "', '" + str(t_dataCampo['predeterminado']) + "', '" + str(t_dataCampo['Tipo_Predeterminado']) + "', '" + str(t_dataCampo['A_acc_automatic']) + "', '" + str(t_dataCampo['Desglosado']) + "', '" + str(t_dataCampo['Limitante']) + "', '" + str(t_dataCampo['Valor_Desglosado']) + "', '" + str(t_dataCampo['Escribir']) + "', '" + str(t_dataCampo['predeterminado_valor']) + "', '" + str(t_dataCampo['multi_select']) + "', '" + str(t_dataCampo['Permite_nulo']) + "', '" + str(t_dataCampo['visibles']) + "', '" + str(t_dataCampo['largos']) + "', '" + str(t_dataCampo['orden']) + "', '" + str(t_dataCampo['pkmod_consul']) + "', '" + str(t_dataCampo['campo_fk']) + "')"
        self.mysql_con.ejecutar(sentencia)
        pkcampo = self.mysql_con.table("Select * from cmpreferencia where PkEstructura = '"+ str(t_pkestructura)+"' and Nombre = '"+ str(t_dataCampo['Nombre'])+"'")  


        self.mysql_con.ejecutar(sentencia)
        for a in t_dataCampo['Condiciones']:
            sentencia = "INSERT INTO `cmpreferenciacondicion` (`PkCampo`, `TablaOrigen`, `ElementoA`, `TipoA`, `Operador`, `ElementoB`, `TipoB`) VALUES ('" + str(pkcampo[0]['PkCampo']) + "', '" + str(pkcampo[0]['TablaOrigen']) + "', '" +  str(a['ElementoA']) + "', '" + str(a['TipoA'])[0:1] + "', '" + str(a['Operador']) + "', '" +  str(a['ElementoB']) + "', '" + str(a['TipoB'])[0:1] + "')"
            self.mysql_con.ejecutar(sentencia)
        return pkcampo



        return pkcampo  

    def crear_cmpreferenciaadjunto(self, t_pkestructura, t_dataCampo ):
        sentencia = "INSERT INTO `cmpreferenciaadjunto` (`PkCampoReferencia`, `CampoReferencia`, `Sentencia`, `PkEstructura`, `Nombre`, `Tamano`, `Modificable`, `Imagen`, `TieneClave`, `Clave`, `Tipo` ) VALUES ('" + str(t_dataCampo['PkCampoReferencia']) + "', '" + str(t_dataCampo['CampoReferencia']) + "', '" + str(t_dataCampo['Sentencia']) + "', '" + str(t_pkestructura) + "', '" + str(t_dataCampo['Nombre']) + "', '" + str(t_dataCampo['Tamano']) + "', '" + str(t_dataCampo['Modificable']) + "', '" + str(t_dataCampo['Imagen']) + "', '" + str(t_dataCampo['TieneClave']) + "', '" + str(t_dataCampo['Clave']) + "', '" + str(t_dataCampo['Tipo']) + "' )"
        self.mysql_con.ejecutar(sentencia)
        return self.mysql_con.table("Select * from cmpreferenciaadjunto where PkEstructura = '"+ str(t_pkestructura)+"' and Nombre = '"+ str(t_dataCampo['Nombre'])+"'")  

    def crear_cmpoperacion(self, t_pkestructura, t_dataCampo ):
        sentencia = "INSERT INTO `cmpoperacion` (`PkEstructura`, `Nombre`, `Decimales`) VALUES ('" + str(t_pkestructura) + "', '" + str(t_dataCampo['Nombre']) + "', '" + str(t_dataCampo['Decimales']) + "')"
        self.mysql_con.ejecutar(sentencia)
        Pkcampo = self.mysql_con.table("Select * from cmpoperacion where PkEstructura = '"+ str(t_pkestructura)+"' and Nombre = '"+ str(t_dataCampo['Nombre'])+"'")  

        for a in t_dataCampo['detalle']:
            sentencia = "INSERT INTO `cmpoperaciondetalle` (`PkCampos`, `Sentencia`, `Estado`) VALUES ('" + str(Pkcampo[0]['PkCampo']) + "', '" + str(a['Sentencia']) + "', '" + str(a['Estado']) + "')"
            self.mysql_con.ejecutar(sentencia)
        return Pkcampo


    def crear_cmpconsolidado(self, t_pkestructura, t_dataCampo ):
        sentencia = "INSERT INTO `cmpconsolidado` (`Nombre`, `Descripcion`, `PkEstructura`, `Permite_nulo`, `Tipo`) VALUES ('" + str(t_dataCampo['Nombre']) + "', '" + str(t_dataCampo['Descripcion']) + "', '" + str(t_pkestructura) + "', '" + str(t_dataCampo['Permite_nulo']) + "', '" + str(t_dataCampo['Tipo']) + "')"
        self.mysql_con.ejecutar(sentencia)
        Pkcampo = self.mysql_con.table("Select * from cmpconsolidado where PkEstructura = '"+ str(t_pkestructura)+"' and Nombre = '"+ str(t_dataCampo['Nombre'])+"'")  

        for a in t_dataCampo['Columna']:
            sentencia = "INSERT INTO `cmpconsolidadocolumna` (`PkCampo`, `Tipo`, `Elemento`, `Origen`, `Funcion`, `Grupo`) VALUES ('" + str(Pkcampo[0]['PkCampo']) + "', '" + str(a['Tipo']) + "', '" + str(a['Elemento']) + "', '" + str(a['Origen']) + "', '" + str(a['Funcion']) + "', '" + str(a['Group']) + "')"
            self.mysql_con.ejecutar(sentencia)

        for a in t_dataCampo['From']:
            sentencia = "INSERT INTO `cmpconsolidadofrom` (`PkCampo`, `Tabla`, `Nombre`) VALUES ('" + Pkcampo[0]['PkCampo'] + "', '" + str(a['Fuente']) + "', '" + str(a['Nombre']) + "')"
            self.mysql_con.ejecutar(sentencia)

        for a in t_dataCampo['Where']:
            sentencia = "INSERT INTO `cmpconsolidadowhere` (`PkCampo`, `Tipo`, `Elemento`, `Origen`, `Funcion`, `Grupo`) VALUES ('" + Pkcampo[0]['PkCampo'] + "', '" + str(a['Tipo']) + "', '" + str(a['Elemento']) + "', '" + str(a['Origen'])+ "', '" + str(a['Funcion']) + "', '" + str(a['Group']) + "')"
            self.mysql_con.ejecutar(sentencia)
        return Pkcampo

    def crear_cmparchivo(self, t_pkestructura, t_dataCampo ):
        sentencia = "INSERT INTO `cmparchivo` (`PkEstructura`, `Nombre`, `Descripcion`, `Ruta`) VALUES ('" + str(t_pkestructura) + "', '" + str(t_dataCampo['Nombre']) + "', '" + str(t_dataCampo['Descripcion']) + "', '" + str(t_dataCampo['Ruta']) + "')"
        self.mysql_con.ejecutar(sentencia)
        return self.mysql_con.table("Select * from cmparchivo where PkEstructura = '"+ str(t_pkestructura)+"' and Nombre = '"+ str(t_dataCampo['Nombre'])+"'")  


    def crear_cmpnumeroaletras(self, t_pkestructura, t_dataCampo ):
        sentencia = "INSERT INTO `cmpnumeroaletras` (`PkCampoNumero`, `CampoNumero`, `Decimales`, `PkEstructura`, `Nombre`) VALUES ('" + str(t_dataCampo['PkCampoNumero']) + "', '" + str(t_dataCampo['CampoNumero']) + "', '" + str(t_dataCampo['Decimales']) + "', '" + str(t_pkestructura) + "', '" + str(t_dataCampo['Nombre']) + "')"
        self.mysql_con.ejecutar(sentencia)
        return self.mysql_con.table("Select * from cmpnumeroaletras where PkEstructura = '"+ str(t_pkestructura)+"' and Nombre = '"+ str(t_dataCampo['Nombre'])+"'")  

    def crear_cmpdecabecera(self, t_pkestructura, t_dataCampo ):
        sentencia = "INSERT INTO `cmpdecabecera` ( `PkEstructura`, `Nombre`, `Descripcion`, `Campo`) VALUES ('" + str(t_pkestructura) + "', '" + str(t_dataCampo['Nombre']) + "', '" + str(t_dataCampo['Descripcion']) + "', '" + str(t_dataCampo['Campo']) + "')"
        self.mysql_con.ejecutar(sentencia)
        return self.mysql_con.table("Select * from cmpdecabecera where PkEstructura = '"+ str(t_pkestructura)+"' and Nombre = '"+ str(t_dataCampo['Nombre'])+"'")  

    def crear_cmpelectronico(self, t_pkestructura, t_dataCampo ):
        sentencia = "INSERT INTO `cmpelectronico` (`PkEstructura`, `Nombre`, `Descripcion`, `Tipo`, `Certificado`, `Clave`, `ClaveAcceso`, `Correo`, `correo_int`, `Obligatorio`, `Cond_campo`, `Cond_valor`, `Impresion`) VALUES ('" + str(t_pkestructura) + "', '" + str(t_dataCampo['Nombre']) + "', '" + str(t_dataCampo['Descripcion']) + "', '" + str(t_dataCampo['Tipo']) + "', '" + str(t_dataCampo['Certificado']) + "', '" + str(t_dataCampo['Clave']) + "', '" + str(t_dataCampo['ClaveAcceso']) + "', '" + str(t_dataCampo['Correo']) + "', '" + str(t_dataCampo['correo_int']) + "', '" + str(t_dataCampo['Obligatorio']) + "', '" + str(t_dataCampo['Cond_campo']) + "', '" + str(t_dataCampo['Cond_valor']) + "', '" + str(t_dataCampo['Impresion']) + "')"
        self.mysql_con.ejecutar(sentencia)

        Pkcampo = self.mysql_con.table("Select * from cmpelectronico where PkEstructura = '"+ str(t_pkestructura)+"' and Nombre = '"+ str(t_dataCampo['Nombre'])+"'") 

        sentencia = "INSERT INTO `cmpelect_infotributaria` (`pkcampo`, `ambiente`, `tipoEmision`, `razonSocial`, `nombreComercial`, `ruc`, `claveAcceso`, `codDoc`, `estab`, `ptoEmi`, `secuencial`, `dirMatriz`, `fecha`, `regimenMicroempresas`, `agenteRetencion`) VALUES ('" + str(Pkcampo[0]['PkCampo']) + "', '" + t_dataCampo['infoTributaria']['ambiente'] + "', '" + t_dataCampo['infoTributaria']['tipoEmision'] + "', '" + t_dataCampo['infoTributaria']['razonSocial']  + "', '" + t_dataCampo['infoTributaria']['nombreComercial'] + "', '" + t_dataCampo['infoTributaria']['ruc'] + "', '" + t_dataCampo['infoTributaria']['claveAcceso'] + "', '" + t_dataCampo['infoTributaria']['codDoc'] + "', '" + t_dataCampo['infoTributaria']['estab'] + "', '" + t_dataCampo['infoTributaria']['ptoEmi'] + "', '" + t_dataCampo['infoTributaria']['secuencial'] + "', '" + t_dataCampo['infoTributaria']['dirMatriz'] + "', '" + t_dataCampo['infoTributaria']['fecha'] + "', '" + t_dataCampo['infoTributaria']['regimenMicroempresas'] + "', '" + t_dataCampo['infoTributaria']['agenteRetencion'] + "')"
        self.mysql_con.ejecutar(sentencia)


        for a in t_dataCampo['Adicionales']:
            sentencia = "INSERT INTO `cmpelect_infoadicional` (`pkcampo`, `nombre`, `valor`) " + " VALUES ('" + Pkcampo[0]['PkCampo'] + "', '" + str(a['nombre'])  + "', '" + str(a['valor']) + "')"
            self.mysql_con.ejecutar(sentencia)


        if t_dataCampo['Tipo'] == 'Factura':
            sentencia = "INSERT INTO `cmpelect_infofactura` (`pkcampo`, `fechaEmision`, `dirEstablecimiento`, `contribuyenteEspecial`, `obligadoContabilidad`, `tipoIdentificacionComprador`, `razonSocialComprador`, `identificacionComprador`, `totalSinImpuestos`, `totalDescuento`, `propina`, `importeTotal`, `moneda`, `codigo1`, `codigoPorcentaje1`, `baseImponible1`, `valor1`, `codigo2`, `codigoPorcentaje2`, `baseImponible2`, `valor2`, `codigo3`, `codigoPorcentaje3`, `baseImponible3`, `valor3`, `descuento_adicional1`, `descuento_adicional2`, `descuento_adicional3`, `formaPago`, `total`, `plazo`, `unidadTiempo` , `comercioExterior` , `IncoTermFactura` , `lugarIncoTerm` , `paisOrigen` , `puertoEmbarque` , `puertoDestino` , `paisDestino` , `paisAdquisicion` , `guiaRemision` , `direccionComprador` , `incoTermTotalSinImpuestos` , `fleteInternacional` , `seguroInternacional` , `gastosAduaneros` , `gastosTransporteOtros`) VALUES ('"+str(Pkcampo[0]['Pkcampo'])+"','" + str(t_dataCampo['infoFactura']['fechaEmision']) + "', '" + str(t_dataCampo['infoFactura']['dirEstablecimiento']) + "', '" + str(t_dataCampo['infoFactura']['contribuyenteEspecial']) + "', '" + str(t_dataCampo['infoFactura']['obligadoContabilidad']) + "', '" + str(t_dataCampo['infoFactura']['tipoIdentificacionComprador']) + "', '" + str(t_dataCampo['infoFactura']['razonSocialComprador']) + "', '" + str(t_dataCampo['infoFactura']['identificacionComprador']) + "', '" + str(t_dataCampo['infoFactura']['totalSinImpuestos']) + "', '" + str(t_dataCampo['infoFactura']['totalDescuento']) + "', '" + str(t_dataCampo['infoFactura']['propina']) + "', '" + str(t_dataCampo['infoFactura']['importeTotal']) + "', '" + str(t_dataCampo['infoFactura']['moneda']) + "', '" + str(t_dataCampo['infoFactura']['codigo1']) + "', '" + str(t_dataCampo['infoFactura']['codigoPorcentaje1']) + "', '" + str(t_dataCampo['infoFactura']['baseImponible1']) + "', '" + str(t_dataCampo['infoFactura']['valor1']) + "', '" + str(t_dataCampo['infoFactura']['codigo2']) + "', '" + str(t_dataCampo['infoFactura']['codigoPorcentaje2']) + "', '" + str(t_dataCampo['infoFactura']['baseImponible2']) + "', '" + str(t_dataCampo['infoFactura']['valor2']) + "', '" + str(t_dataCampo['infoFactura']['codigo3']) + "', '" + str(t_dataCampo['infoFactura']['codigoPorcentaje3']) + "', '" + str(t_dataCampo['infoFactura']['baseImponible3']) + "', '" + str(t_dataCampo['infoFactura']['valor3']) + "', '" + str(t_dataCampo['infoFactura']['descuento_adicional1']) + "', '" + str(t_dataCampo['infoFactura']['descuento_adicional2']) + "', '" + str(t_dataCampo['infoFactura']['descuento_adicional3']) + "', '" + str(t_dataCampo['infoFactura']['formaPago']) + "', '" + str(t_dataCampo['infoFactura']['total']) + "', '" + str(t_dataCampo['infoFactura']['plazo']) + "', '" + str(t_dataCampo['infoFactura']['unidadTiempo']) + "', '" + str(t_dataCampo['infoFactura']['comercioExterior']) + "', '" + str(t_dataCampo['infoFactura']['IncoTermFactura']) + "', '" + str(t_dataCampo['infoFactura']['lugarIncoTerm']) + "', '" + str(t_dataCampo['infoFactura']['paisOrigen']) + "', '" + str(t_dataCampo['infoFactura']['puertoEmbarque']) + "', '" + str(t_dataCampo['infoFactura']['puertoDestino']) + "', '" + str(t_dataCampo['infoFactura']['paisDestino']) + "', '" + str(t_dataCampo['infoFactura']['paisAdquisicion']) + "', '" + str(t_dataCampo['infoFactura']['guiaRemision']) + "', '" + str(t_dataCampo['infoFactura']['direccionComprador']) + "', '" + str(t_dataCampo['infoFactura']['incoTermTotalSinImpuestos']) + "', '" + str(t_dataCampo['infoFactura']['fleteInternacional']) + "', '" + str(t_dataCampo['infoFactura']['seguroInternacional']) + "', '" + str(t_dataCampo['infoFactura']['gastosAduaneros']) + "', '" + str(t_dataCampo['infoFactura']['gastosTransporteOtros']) + "')"
            self.mysql_con.ejecutar(sentencia)


            sentencia = "INSERT INTO `cmpelect_detalles` (`pkcampo`, `codigoPrincipal`, `descripcion`, `cantidad`, `precioUnitario`, `descuento`, `precioTotalSinImpuesto`, `codigo`, `codigoPorcentaje`, `tarifa`, `baseImponible`, `valor`, `codigoAuxiliar`, `unidadMedida`) VALUES ('"+str(Pkcampo[0]['Pkcampo'])+"', '" + str(t_dataCampo['detFactura']['codigoPrincipal']) + "', '" + str(t_dataCampo['detFactura']['descripcion']) + "', '" + str(t_dataCampo['detFactura']['cantidad']) + "', '" + str(t_dataCampo['detFactura']['precioUnitario']) + "', '" + str(t_dataCampo['detFactura']['descuento']) + "', '" + str(t_dataCampo['detFactura']['precioTotalSinImpuesto']) + "', '" + str(t_dataCampo['detFactura']['codigo']) + "', '" + str(t_dataCampo['detFactura']['codigoPorcentaje']) + "', '" + str(t_dataCampo['detFactura']['tarifa']) + "', '" + str(t_dataCampo['detFactura']['baseImponible']) + "', '" + str(t_dataCampo['detFactura']['valor']) + "', '" + str(t_dataCampo['detFactura']['codigoAuxiliar']) + "', '" + str(t_dataCampo['detFactura']['unidadMedida']) + "')"

            self.mysql_con.ejecutar(sentencia)



        if t_dataCampo['Tipo'] == 'Retencion':
            sentencia = "INSERT INTO `cmpelect_ret_infocompretencion` (`pkcampo`, `fechaEmision`, `dirEstablecimiento`, `contribuyenteEspecial`, `obligadoContabilidad`, `tipoIdentificacionSujetoRetenido`, `razonSocialSujetoRetenido`, `identificacionSujetoRetenido`, `periodoFiscal`) VALUES ('"+str(Pkcampo[0]['Pkcampo'])+"', '" + str(t_dataCampo['CabRetencion']['fechaEmision']) + "',  '" + str(t_dataCampo['CabRetencion']['dirEstablecimiento']) + "',  '" + str(t_dataCampo['CabRetencion']['contribuyenteEspecial']) + "',  '" + str(t_dataCampo['CabRetencion']['obligadoContabilidad']) + "',  '" + str(t_dataCampo['CabRetencion']['tipoIdentificacionSujetoRetenido']) + "',  '" + str(t_dataCampo['CabRetencion']['razonSocialSujetoRetenido']) + "',  '" + str(t_dataCampo['CabRetencion']['identificacionSujetoRetenido']) + "',  '" + str(t_dataCampo['CabRetencion']['periodoFiscal']) + "')"
            self.mysql_con.ejecutar(sentencia)

            sentencia = "INSERT INTO `cmpelect_ret_impuestos` (`pkcampo`, `codDocSustento`, `fechaEmisionDocSustento`, `numDocSustento_est`, `numDocSustento_punto`, `numDocSustento_sec`, `tipo`, `det_codigo`, `det_codigoRetencion`, `det_baseImponible`, `det_porcentajeRetener`, `det_valorRetenido`, `det_codigo2`, `det_codigoRetencion2`, `det_baseImponible2`, `det_porcentajeRetener2`, `det_valorRetenido2`)  VALUES ('"+str(Pkcampo[0]['Pkcampo'])+"', '" + str(t_dataCampo['DetRetencion']['codDocSustento']) + "', '" + str(t_dataCampo['DetRetencion']['fechaEmisionDocSustento']) + "', '" + str(t_dataCampo['DetRetencion']['numDocSustento_est']) + "', '" + str(t_dataCampo['DetRetencion']['numDocSustento_punto']) + "', '" + str(t_dataCampo['DetRetencion']['numDocSustento_sec']) + "', '" + str(t_dataCampo['DetRetencion']['tipo']) + "', '" + str(t_dataCampo['DetRetencion']['det_codigo']) + "', '" + str(t_dataCampo['DetRetencion']['det_codigoRetencion']) + "', '" + str(t_dataCampo['DetRetencion']['det_baseImponible']) + "', '" + str(t_dataCampo['DetRetencion']['det_porcentajeRetener']) + "', '" + str(t_dataCampo['DetRetencion']['det_valorRetenido']) + "', '" + str(t_dataCampo['DetRetencion']['det_codigo2']) + "', '" + str(t_dataCampo['DetRetencion']['det_codigoRetencion2']) + "', '" + str(t_dataCampo['DetRetencion']['det_baseImponible2']) + "', '" + str(t_dataCampo['DetRetencion']['det_porcentajeRetener2']) + "', '" + str(t_dataCampo['DetRetencion']['det_valorRetenido2']) + "')"

            self.mysql_con.ejecutar(sentencia)

        if t_dataCampo['Tipo'] == 'Nota credito':

            sentencia = "INSERT INTO `cmpelect_notacredito_info` (`pkcampo`, `fechaEmision`, `dirEstablecimiento`, `tipoIdentificacionComprador`, `razonSocialComprador`, `identificacionComprador`, `obligadoContabilidad`, `codDocModificado`, `numDocModificado_est`, `numDocModificado_punto`, `numDocModificado_sec`, `fechaEmisionDocSustento`, `totalSinImpuestos`, `valorModificacion`, `moneda`, `motivo`, `codigo1`, `codigoPorcentaje1`, `baseImponible1`, `valor1`, `codigo2`, `codigoPorcentaje2`, `baseImponible2`, `valor2`, `codigo3`, `codigoPorcentaje3`, `baseImponible3`, `valor3`) VALUES ('"+str(Pkcampo[0]['Pkcampo'])+"', '" + str(t_dataCampo['Cabcredito']['fechaEmision']) + "', '" + str(t_dataCampo['Cabcredito']['dirEstablecimiento']) + "', '" + str(t_dataCampo['Cabcredito']['tipoIdentificacionComprador']) + "', '" + str(t_dataCampo['Cabcredito']['razonSocialComprador']) + "', '" + str(t_dataCampo['Cabcredito']['identificacionComprador']) + "', '" + str(t_dataCampo['Cabcredito']['obligadoContabilidad']) + "', '" + str(t_dataCampo['Cabcredito']['codDocModificado']) + "', '" + str(t_dataCampo['Cabcredito']['numDocModificado_est']) + "', '" + str(t_dataCampo['Cabcredito']['numDocModificado_punto']) + "', '" + str(t_dataCampo['Cabcredito']['numDocModificado_sec']) + "', '" + str(t_dataCampo['Cabcredito']['fechaEmisionDocSustento']) + "', '" + str(t_dataCampo['Cabcredito']['totalSinImpuestos']) + "', '" + str(t_dataCampo['Cabcredito']['valorModificacion']) + "', '" + str(t_dataCampo['Cabcredito']['moneda']) + "', '" + str(t_dataCampo['Cabcredito']['motivo']) + "', '" + str(t_dataCampo['Cabcredito']['codigo1']) + "', '" + str(t_dataCampo['Cabcredito']['codigoPorcentaje1']) + "', '" + str(t_dataCampo['Cabcredito']['baseImponible1']) + "', '" + str(t_dataCampo['Cabcredito']['valor1']) + "', '" + str(t_dataCampo['Cabcredito']['codigo2']) + "', '" + str(t_dataCampo['Cabcredito']['codigoPorcentaje2']) + "', '" + str(t_dataCampo['Cabcredito']['baseImponible2']) + "', '" + str(t_dataCampo['Cabcredito']['valor2']) + "', '" + str(t_dataCampo['Cabcredito']['codigo3']) + "', '" + str(t_dataCampo['Cabcredito']['codigoPorcentaje3']) + "', '" + str(t_dataCampo['Cabcredito']['baseImponible3']) + "', '" + str(t_dataCampo['Cabcredito']['valor3']) + "')"
            self.mysql_con.ejecutar(sentencia)


            sentencia = "INSERT INTO `cmpelect_notacredito_detalles` (`pkcampo`, `codigoInterno`, `codigoAdicional`, `descripcion`, `cantidad`, `precioUnitario`, `descuento`, `precioTotalSinImpuesto`, `codigo`, `codigoPorcentaje`, `tarifa`, `baseImponible`, `valor`) VALUES ('"+str(Pkcampo[0]['Pkcampo'])+"', '" + str(t_dataCampo['Detcredito']['codigoInterno']) + "', '" + str(t_dataCampo['Detcredito']['codigoAdicional']) + "', '" + str(t_dataCampo['Detcredito']['descripcion']) + "', '" + str(t_dataCampo['Detcredito']['cantidad']) + "', '" + str(t_dataCampo['Detcredito']['precioUnitario']) + "', '" + str(t_dataCampo['Detcredito']['descuento']) + "', '" + str(t_dataCampo['Detcredito']['precioTotalSinImpuesto']) + "', '" + str(t_dataCampo['Detcredito']['codigo']) + "', '" + str(t_dataCampo['Detcredito']['codigoPorcentaje']) + "', '" + str(t_dataCampo['Detcredito']['tarifa']) + "', '" + str(t_dataCampo['Detcredito']['baseImponible']) + "', '" + str(t_dataCampo['Detcredito']['valor']) + "')"
            self.mysql_con.ejecutar(sentencia)


        if t_dataCampo['Tipo'] == 'Guia remision':
            sentencia = "INSERT INTO `cmpelect_guia_info` (`pkcampo`, `dirEstablecimiento`, `dirPartida`, `razonSocialTransportista`, `tipoIdentificacionTransportista`, `rucTransportista`, `obligadoContabilidad`, `fechaIniTransporte`, `fechaFinTransporte`, `placa`)  VALUES ('"+str(Pkcampo[0]['Pkcampo'])+"', '" + str(t_dataCampo['CabGuia']['dirEstablecimiento']) + "', '" + str(t_dataCampo['CabGuia']['dirPartida']) + "', '" + str(t_dataCampo['CabGuia']['razonSocialTransportista']) + "', '" + str(t_dataCampo['CabGuia']['tipoIdentificacionTransportista']) + "', '" + str(t_dataCampo['CabGuia']['rucTransportista']) + "', '" + str(t_dataCampo['CabGuia']['obligadoContabilidad']) + "', '" + str(t_dataCampo['CabGuia']['fechaIniTransporte']) + "', '" + str(t_dataCampo['CabGuia']['fechaFinTransporte']) + "', '" + str(t_dataCampo['CabGuia']['placa']) + "')"
            self.mysql_con.ejecutar(sentencia)

            sentencia = "INSERT INTO `cmpelect_guia_destinatarios` (`pkcampo`, `identificacionDestinatario`, `razonSocialDestinatario`, `dirDestinatario`, `motivoTraslado`, `docAduaneroUnico`, `codEstabDestino`, `ruta`, `codDocSustento`, `numDocSustento_punto`, `numAutDocSustento`, `fechaEmisionDocSustento`, `codigoInterno`, `codigoAdicional`, `descripcion`, `cantidad`, `numDocSustento_est`, `numDocSustento_sec`) VALUES ('"+str(Pkcampo[0]['Pkcampo'])+"', '" + str(t_dataCampo['DetGuia']['identificacionDestinatario']) + "', '" + str(t_dataCampo['DetGuia']['razonSocialDestinatario']) + "', '" + str(t_dataCampo['DetGuia']['dirDestinatario']) + "', '" + str(t_dataCampo['DetGuia']['motivoTraslado']) + "', '" + str(t_dataCampo['DetGuia']['docAduaneroUnico']) + "', '" + str(t_dataCampo['DetGuia']['codEstabDestino']) + "', '" + str(t_dataCampo['DetGuia']['ruta']) + "', '" + str(t_dataCampo['DetGuia']['codDocSustento']) + "', '" + str(t_dataCampo['DetGuia']['numDocSustento_punto']) + "', '" + str(t_dataCampo['DetGuia']['numAutDocSustento']) + "', '" + str(t_dataCampo['DetGuia']['fechaEmisionDocSustento']) + "', '" + str(t_dataCampo['DetGuia']['codigoInterno']) + "', '" + str(t_dataCampo['DetGuia']['codigoAdicional']) + "', '" + str(t_dataCampo['DetGuia']['descripcion']) + "', '" + str(t_dataCampo['DetGuia']['cantidad']) + "', '" + str(t_dataCampo['DetGuia']['numDocSustento_est']) + "', '" + str(t_dataCampo['DetGuia']['numDocSustento_sec']) + "')"
            self.mysql_con.ejecutar(sentencia)




        if t_dataCampo['Tipo'] == 'Nota debito':
            sentencia = "INSERT INTO `cmpelect_notadebito_info` (`pkcampo`, `fechaEmision`, `dirEstablecimiento`, `tipoIdentificacionComprador`, `razonSocialComprador`, `identificacionComprador`, `obligadoContabilidad`, `codDocModificado`, `numDocModificado_est`, `numDocModificado_punt`, `numDocModificado_sec`, `fechaEmisionDocSustento`, `totalSinImpuestos`, `valorTotal`, `codigo1`, `codigoPorcentaje1`, `tarifa1`, `baseImponible1`, `valor1`, `codigo2`, `codigoPorcentaje2`, `tarifa2`, `baseImponible2`, `valor2`, `unidadTiempo` , `formaPago`, `total`, `plazo`) VALUES ('"+str(Pkcampo[0]['Pkcampo'])+"', '" + str(t_dataCampo['CabNotadebito']['fechaEmision']) + "', '" + str(t_dataCampo['CabNotadebito']['dirEstablecimiento']) + "', '" + str(t_dataCampo['CabNotadebito']['tipoIdentificacionComprador']) + "', '" + str(t_dataCampo['CabNotadebito']['razonSocialComprador']) + "', '" + str(t_dataCampo['CabNotadebito']['identificacionComprador']) + "', '" + str(t_dataCampo['CabNotadebito']['obligadoContabilidad']) + "', '" + str(t_dataCampo['CabNotadebito']['codDocModificado']) + "', '" + str(t_dataCampo['CabNotadebito']['numDocModificado_est']) + "', '" + str(t_dataCampo['CabNotadebito']['numDocModificado_punt']) + "', '" + str(t_dataCampo['CabNotadebito']['numDocModificado_sec']) + "', '" + str(t_dataCampo['CabNotadebito']['fechaEmisionDocSustento']) + "', '" + str(t_dataCampo['CabNotadebito']['totalSinImpuestos']) + "', '" + str(t_dataCampo['CabNotadebito']['valorTotal']) + "', '" + str(t_dataCampo['CabNotadebito']['codigo1']) + "', '" + str(t_dataCampo['CabNotadebito']['codigoPorcentaje1']) + "', '" + str(t_dataCampo['CabNotadebito']['tarifa1']) + "', '" + str(t_dataCampo['CabNotadebito']['baseImponible1']) + "', '" + str(t_dataCampo['CabNotadebito']['valor1']) + "', '" + str(t_dataCampo['CabNotadebito']['codigo2']) + "', '" + str(t_dataCampo['CabNotadebito']['codigoPorcentaje2']) + "', '" + str(t_dataCampo['CabNotadebito']['tarifa2']) + "', '" + str(t_dataCampo['CabNotadebito']['baseImponible2']) + "', '" + str(t_dataCampo['CabNotadebito']['valor2']) + "', '" + str(t_dataCampo['CabNotadebito']['unidadTiempo']) + "', '" + str(t_dataCampo['CabNotadebito']['formaPago']) + "', '" + str(t_dataCampo['CabNotadebito']['total']) + "', '" + str(t_dataCampo['CabNotadebito']['plazo']) + "')"
            self.mysql_con.ejecutar(sentencia)

            sentencia = "INSERT INTO `cmpelect_notadebito_motivos` (`pkcampo`, `razon`, `valor`) VALUES ('"+str(Pkcampo[0]['Pkcampo'])+"','" + str(t_dataCampo['DetNotadebito']['razon']) + "', '" + str(t_dataCampo['DetNotadebito']['valor']) + "')"
            self.mysql_con.ejecutar(sentencia)

        self.mysql_con.ejecutar(sentencia)
        return Pkcampo 





    def crear_cmpcondicional(self, t_pkestructura, t_dataCampo ):
        sentencia = "INSERT INTO `cmpcondicional` (`PkEstructura`, `Nombre`, `Descripcion`) VALUES ('"+ str(t_pkestructura)+"', '"+ str(t_dataCampo['Nombre'])+"', '"+ str(t_dataCampo['Descripcion'])+"')"
        self.mysql_con.ejecutar(sentencia)
        Pkcampo = self.mysql_con.table("Select * from cmpcondicional where PkEstructura = '"+ str(t_pkestructura)+"' and Nombre = '"+ str(t_dataCampo['Nombre'])+"'")  
        for a in t_dataCampo['detalle']:
            sentencia = "INSERT INTO `cmpcondicionaldetalle` (`PkCampo`, `TipoA`, `ElementoA`, `Operador`, `TipoB`, `ElementoB`, `TipoC`, `ElementoC`) VALUES ('" + str(Pkcampo[0]['PkCampo'])+ "', '" + str(a['TipoA']) + "', '" + str(a['ElementoA']) + "', '" + str(a['Operador']) + "', '" + str(a['TipoB']) + "', '" + str(a['ElementoB'])+ "', '" + str(a['TipoC'])+ "', '" + str(a['ElementoC'])+ "')"
            self.mysql_con.ejecutar(sentencia)
        return Pkcampo

    def max_posis(self, t_pkestructura):
        sentencia = "SELECT COALESCE(max(Posicion),0) +1 as 'Maxi'  from camposxestructura WHERE PkEstructura = '657'"
        return self.mysql_con.table(sentencia)[0]['Maxi']          

    def borrar_camposXestructura(self, A_PkId, A_PkModulo, A_PkEstructura, A_PkCampo  ):
        sentencia = "DELETE FROM `camposxestructura`  WHERE (`PkId`='" + str(A_PkId) + "') AND (`PkModulo`='" + str(A_PkModulo) + "') AND (`PkEstructura`='" + str(A_PkEstructura) + "') AND (`PkCampo`='" + str(A_PkCampo) + "')"
        self.mysql_con.ejecutar(sentencia)

    def borrar_cmpCampo(self, fuente, t_PkCampo):
        if fuente == 'cmptxtsimple':
            sentencia = "delete from cmptxtsimple where PkCampo = '"+ str(t_PkCampo)+"'"
            self.mysql_con.ejecutar(sentencia)

        if fuente == 'cmpnumsimple':
            sentencia = "delete from cmpnumsimple where PkCampo = '"+ str(t_PkCampo)+"'"
            self.mysql_con.ejecutar(sentencia)

        if fuente == 'cmpnumsecuencial':
            sentencia = "delete from cmpnumsecuencial where PkCampo = '"+ str(t_PkCampo)+"'"
            self.mysql_con.ejecutar(sentencia)

        if fuente == 'cmpopcmultiple':
            sentencia = "delete from cmpopcmultiple where PkCampo = '"+ str(t_PkCampo)+"'"
            self.mysql_con.ejecutar(sentencia)
            sentencia = "delete from cmpopcionvalores where PkCampo = '"+ str(t_PkCampo)+"'"
            self.mysql_con.ejecutar(sentencia)

        if fuente == 'cmpsistema':
            sentencia = "delete from cmpsistema where PkCampo = '"+ str(t_PkCampo)+"'"
            self.mysql_con.ejecutar(sentencia)

        if fuente == 'cmpformuladetalle':
            sentencia = "delete from cmpformuladetalle where PkCampo = '"+ str(t_PkCampo)+"'"
            self.mysql_con.ejecutar(sentencia)
            sentencia = "delete from cmpformuladetallecondicion where PkCampo = '"+ str(t_PkCampo)+"'"
            self.mysql_con.ejecutar(sentencia)

        if fuente == 'cmpfecha':
            sentencia = "delete from cmpfecha where PkCampo = '"+ str(t_PkCampo)+"'"
            self.mysql_con.ejecutar(sentencia)

        if fuente == 'cmpreferencia':
            sentencia = "delete from cmpreferencia where PkCampo = '"+ str(t_PkCampo)+"'"
            self.mysql_con.ejecutar(sentencia)

            sentencia = "delete from cmpreferenciacondicion where PkCampo = '"+ str(t_PkCampo)+"'"
            self.mysql_con.ejecutar(sentencia)

            sentencia = "delete from cmpreferenciaacciones where PkCampo = '"+ str(t_PkCampo)+"'"
            self.mysql_con.ejecutar(sentencia)
            #borrar acciones ??si

        if fuente == 'cmpreferenciaadjunto':
            sentencia = "delete from cmpreferenciaadjunto where PkCampo = '"+ str(t_PkCampo)+"'"
            self.mysql_con.ejecutar(sentencia)

        if fuente == 'cmpoperacion':
            sentencia = "delete from cmpoperacion where PkCampo = '"+ str(t_PkCampo)+"'"
            self.mysql_con.ejecutar(sentencia)
            sentencia = "delete from cmpoperaciondetalle where PkCampo = '"+ str(t_PkCampo)+"'"
            self.mysql_con.ejecutar(sentencia)

        if fuente == 'cmpconsolidado':
            sentencia = "delete from cmpconsolidado where PkCampo = '"+ str(t_PkCampo)+"'"
            self.mysql_con.ejecutar(sentencia)
            self.mysql_con.ejecutar("delete from cmpconsolidadocolumna where PkCampo = '"+ str(t_PkCampo)+"'")
            self.mysql_con.ejecutar("delete from cmpconsolidadofrom where PkCampo = '"+ str(t_PkCampo)+"'")
            self.mysql_con.ejecutar("delete from cmpconsolidadowhere where PkCampo = '"+ str(t_PkCampo)+"'")

        if fuente == 'cmparchivo':
            sentencia = "delete from cmparchivo where PkCampo = '"+ str(t_PkCampo)+"'"
            self.mysql_con.ejecutar(sentencia)

        if fuente == 'cmpnumeroaletras':
            sentencia = "delete from cmpnumeroaletras where PkCampo = '"+ str(t_PkCampo)+"'"
            self.mysql_con.ejecutar(sentencia)

        if fuente == 'cmpdecabecera':
            sentencia = "delete from cmpdecabecera where PkCampo = '"+ str(t_PkCampo)+"'"
            self.mysql_con.ejecutar(sentencia)

        if fuente == 'cmpelectronico':
            sentencia = "delete from cmpelectronico where PkCampo = '"+ str(t_PkCampo)+"'"
            self.mysql_con.ejecutar(sentencia)

            self.mysql_con.ejecutar("delete from cmpelect_infofactura where pkcampo = '"+ str(t_PkCampo)+"'")
            self.mysql_con.ejecutar("delete from cmpelect_detalles where pkcampo = '"+ str(t_PkCampo)+"'")

            self.mysql_con.ejecutar("delete from cmpelect_ret_infocompretencion where pkcampo = '"+ str(t_PkCampo)+"'")
            self.mysql_con.ejecutar("delete from cmpelect_ret_impuestos where pkcampo = '"+ str(t_PkCampo)+"'")

            self.mysql_con.ejecutar("delete from cmpelect_notadebito_info where pkcampo = '"+ str(t_PkCampo)+"'")
            self.mysql_con.ejecutar("delete from cmpelect_notadebito_motivos where pkcampo = '"+ str(t_PkCampo)+"'")

            self.mysql_con.ejecutar("delete from cmpelect_notacredito_info where pkcampo = '"+ str(t_PkCampo)+"'")
            self.mysql_con.ejecutar("delete from cmpelect_notacredito_detalles where pkcampo = '"+ str(t_PkCampo)+"'")

            self.mysql_con.ejecutar("delete from cmpelect_guia_info where pkcampo = '"+ str(t_PkCampo)+"'")
            self.mysql_con.ejecutar("delete from cmpelect_guia_destinatarios where pkcampo = '"+ str(t_PkCampo)+"'")

        if fuente == 'cmpcondicional':
            sentencia = "delete from cmpcondicional where PkCampo = '"+ str(t_PkCampo)+"'"
            self.mysql_con.ejecutar(sentencia)
            self.mysql_con.ejecutar("delete from cmpcondicionaldetalle where PkCampo = '"+ str(t_PkCampo)+"'")




"""
class Usuarios() 
    clase para traer las firmas electronicas desde la base de datos sobre pdf generados a firmar
"""
class Usuarios:
    def __init__(self, conn_user, conn_pass, conn_base, conn_ip):
        """
        __init__ solo para instanciar la clase Mysql
        Input: conn_user: Usuario de base de datos, conn_pass: Clave de base de datos, conn_base: NOmbre de base de datos, conn_ip: Ip del host de la base de datos
        Return: Nada
        """
        self.mysql_con = web.mysql.class_mysql(conn_user, conn_pass, conn_base, conn_ip, '3306')

    def Usuario(self, t_usuario):
        """
        con t_usuario traer todos los usuario
        [{PkUsuario,Usuario,Clave,Nombre,Apellido,Apellido2,Anulado,FechaExpiracion,Admin,Sri,Reportes,Campos,Plantillas,Acciones,Procesos_Modulos,Eliminar_Importar,Usuarios,hash,Cargo,Correo, Telefono}]
        Usuario: Devuelve Listado de Usuario
        Input:  t_usuario: Usuario a buscar
        Variables de Uso: 
        mysql_con: Clase intanciaa de base de datos Mysql
        Return: Tabla Multi registro en diccionario
        [{PkUsuario,Usuario,Clave,Nombre,Apellido,Apellido2,Anulado,FechaExpiracion,Admin,Sri,Reportes,Campos,Plantillas,Acciones,Procesos_Modulos,Eliminar_Importar,Usuarios,hash,Cargo,Correo, Telefono}]
        """
        if t_usuario == '':
            sentencia = "select * from usuario"
        else:
            sentencia = "select * from usuario where usuario like '"+str(t_usuario)+"'"
        return self.mysql_con.table(sentencia)


"""
class SRI() 
    Maneja ATS, 103, 104
"""
class SRI:
    def __init__(self, conn_user, conn_pass, conn_base, conn_ip, conn_port):
        """
        __init__ solo para instanciar la clase Mysql
        Input: conn_user: Usuario de base de datos, conn_pass: Clave de base de datos, conn_base: NOmbre de base de datos, conn_ip: Ip del host de la base de datos
        Return: Nada
        """
        self.mysql_con = web.mysql.class_mysql(conn_user, conn_pass, conn_base, conn_ip, conn_port)

    def formularios(self, t_fuente):
        """
        devuelve los querys para los formularios
        """
        sentencia = "select * from web_sri_formularios where fuente ='"+str(t_fuente)+"'"
        return self.mysql_con.table(sentencia)

    def devolver_tabla(self, t_senten):
        """
        devuelve los querys para los formularios
        """
        return self.mysql_con.table(t_senten)



