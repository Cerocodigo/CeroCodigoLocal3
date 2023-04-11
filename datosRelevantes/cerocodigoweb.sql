/*
Navicat MySQL Data Transfer

Source Server         : Mysql
Source Server Version : 50505
Source Host           : 127.0.0.1:3306
Source Database       : cerocodigoweb

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2023-04-07 16:14:44
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for auth_group
-- ----------------------------
DROP TABLE IF EXISTS `auth_group`;
CREATE TABLE `auth_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(80) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of auth_group
-- ----------------------------

-- ----------------------------
-- Table structure for auth_group_permissions
-- ----------------------------
DROP TABLE IF EXISTS `auth_group_permissions`;
CREATE TABLE `auth_group_permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissions_ibfk_1` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of auth_group_permissions
-- ----------------------------

-- ----------------------------
-- Table structure for auth_permission
-- ----------------------------
DROP TABLE IF EXISTS `auth_permission`;
CREATE TABLE `auth_permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_ibfk_1` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of auth_permission
-- ----------------------------
INSERT INTO `auth_permission` VALUES ('1', 'Can add documentos', '1', 'add_documentos');
INSERT INTO `auth_permission` VALUES ('2', 'Can change documentos', '1', 'change_documentos');
INSERT INTO `auth_permission` VALUES ('3', 'Can delete documentos', '1', 'delete_documentos');
INSERT INTO `auth_permission` VALUES ('4', 'Can add emisores', '2', 'add_emisores');
INSERT INTO `auth_permission` VALUES ('5', 'Can change emisores', '2', 'change_emisores');
INSERT INTO `auth_permission` VALUES ('6', 'Can delete emisores', '2', 'delete_emisores');
INSERT INTO `auth_permission` VALUES ('7', 'Can add receptores', '3', 'add_receptores');
INSERT INTO `auth_permission` VALUES ('8', 'Can change receptores', '3', 'change_receptores');
INSERT INTO `auth_permission` VALUES ('9', 'Can delete receptores', '3', 'delete_receptores');
INSERT INTO `auth_permission` VALUES ('10', 'Can add log entry', '4', 'add_logentry');
INSERT INTO `auth_permission` VALUES ('11', 'Can change log entry', '4', 'change_logentry');
INSERT INTO `auth_permission` VALUES ('12', 'Can delete log entry', '4', 'delete_logentry');
INSERT INTO `auth_permission` VALUES ('13', 'Can add group', '5', 'add_group');
INSERT INTO `auth_permission` VALUES ('14', 'Can change group', '5', 'change_group');
INSERT INTO `auth_permission` VALUES ('15', 'Can delete group', '5', 'delete_group');
INSERT INTO `auth_permission` VALUES ('16', 'Can add permission', '6', 'add_permission');
INSERT INTO `auth_permission` VALUES ('17', 'Can change permission', '6', 'change_permission');
INSERT INTO `auth_permission` VALUES ('18', 'Can delete permission', '6', 'delete_permission');
INSERT INTO `auth_permission` VALUES ('19', 'Can add user', '7', 'add_user');
INSERT INTO `auth_permission` VALUES ('20', 'Can change user', '7', 'change_user');
INSERT INTO `auth_permission` VALUES ('21', 'Can delete user', '7', 'delete_user');
INSERT INTO `auth_permission` VALUES ('22', 'Can add content type', '8', 'add_contenttype');
INSERT INTO `auth_permission` VALUES ('23', 'Can change content type', '8', 'change_contenttype');
INSERT INTO `auth_permission` VALUES ('24', 'Can delete content type', '8', 'delete_contenttype');
INSERT INTO `auth_permission` VALUES ('25', 'Can add session', '9', 'add_session');
INSERT INTO `auth_permission` VALUES ('26', 'Can change session', '9', 'change_session');
INSERT INTO `auth_permission` VALUES ('27', 'Can delete session', '9', 'delete_session');
INSERT INTO `auth_permission` VALUES ('28', 'Can add usuarios', '3', 'add_usuarios');
INSERT INTO `auth_permission` VALUES ('29', 'Can change usuarios', '3', 'change_usuarios');
INSERT INTO `auth_permission` VALUES ('30', 'Can delete usuarios', '3', 'delete_usuarios');

-- ----------------------------
-- Table structure for auth_user
-- ----------------------------
DROP TABLE IF EXISTS `auth_user`;
CREATE TABLE `auth_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(30) NOT NULL,
  `last_name` varchar(30) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of auth_user
-- ----------------------------

-- ----------------------------
-- Table structure for auth_user_groups
-- ----------------------------
DROP TABLE IF EXISTS `auth_user_groups`;
CREATE TABLE `auth_user_groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_user_groups_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of auth_user_groups
-- ----------------------------

-- ----------------------------
-- Table structure for auth_user_user_permissions
-- ----------------------------
DROP TABLE IF EXISTS `auth_user_user_permissions`;
CREATE TABLE `auth_user_user_permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_user_user_permissions_ibfk_1` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of auth_user_user_permissions
-- ----------------------------

-- ----------------------------
-- Table structure for demos
-- ----------------------------
DROP TABLE IF EXISTS `demos`;
CREATE TABLE `demos` (
  `pkdemo` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` text DEFAULT NULL,
  `url` text DEFAULT NULL,
  `cat` text DEFAULT NULL,
  `resumen` text DEFAULT NULL,
  PRIMARY KEY (`pkdemo`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of demos
-- ----------------------------

-- ----------------------------
-- Table structure for django_admin_log
-- ----------------------------
DROP TABLE IF EXISTS `django_admin_log`;
CREATE TABLE `django_admin_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `action_time` datetime NOT NULL,
  `object_id` longtext DEFAULT NULL,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint(5) unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_ibfk_1` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of django_admin_log
-- ----------------------------

-- ----------------------------
-- Table structure for django_content_type
-- ----------------------------
DROP TABLE IF EXISTS `django_content_type`;
CREATE TABLE `django_content_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of django_content_type
-- ----------------------------
INSERT INTO `django_content_type` VALUES ('4', 'admin', 'logentry');
INSERT INTO `django_content_type` VALUES ('5', 'auth', 'group');
INSERT INTO `django_content_type` VALUES ('6', 'auth', 'permission');
INSERT INTO `django_content_type` VALUES ('7', 'auth', 'user');
INSERT INTO `django_content_type` VALUES ('8', 'contenttypes', 'contenttype');
INSERT INTO `django_content_type` VALUES ('1', 'edocs', 'documentos');
INSERT INTO `django_content_type` VALUES ('2', 'edocs', 'emisores');
INSERT INTO `django_content_type` VALUES ('3', 'edocs', 'usuarios');
INSERT INTO `django_content_type` VALUES ('9', 'sessions', 'session');

-- ----------------------------
-- Table structure for django_migrations
-- ----------------------------
DROP TABLE IF EXISTS `django_migrations`;
CREATE TABLE `django_migrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of django_migrations
-- ----------------------------
INSERT INTO `django_migrations` VALUES ('1', 'contenttypes', '0001_initial', '2017-05-02 01:16:34');
INSERT INTO `django_migrations` VALUES ('2', 'auth', '0001_initial', '2017-05-02 01:16:39');
INSERT INTO `django_migrations` VALUES ('3', 'admin', '0001_initial', '2017-05-02 01:16:41');
INSERT INTO `django_migrations` VALUES ('4', 'admin', '0002_logentry_remove_auto_add', '2017-05-02 01:16:42');
INSERT INTO `django_migrations` VALUES ('5', 'contenttypes', '0002_remove_content_type_name', '2017-05-02 01:16:43');
INSERT INTO `django_migrations` VALUES ('6', 'auth', '0002_alter_permission_name_max_length', '2017-05-02 01:16:44');
INSERT INTO `django_migrations` VALUES ('7', 'auth', '0003_alter_user_email_max_length', '2017-05-02 01:16:45');
INSERT INTO `django_migrations` VALUES ('8', 'auth', '0004_alter_user_username_opts', '2017-05-02 01:16:45');
INSERT INTO `django_migrations` VALUES ('9', 'auth', '0005_alter_user_last_login_null', '2017-05-02 01:16:46');
INSERT INTO `django_migrations` VALUES ('10', 'auth', '0006_require_contenttypes_0002', '2017-05-02 01:16:46');
INSERT INTO `django_migrations` VALUES ('11', 'auth', '0007_alter_validators_add_error_messages', '2017-05-02 01:16:47');
INSERT INTO `django_migrations` VALUES ('12', 'auth', '0008_alter_user_username_max_length', '2017-05-02 01:16:48');
INSERT INTO `django_migrations` VALUES ('13', 'edocs', '0001_initial', '2017-05-02 01:16:52');
INSERT INTO `django_migrations` VALUES ('14', 'sessions', '0001_initial', '2017-05-02 01:16:53');
INSERT INTO `django_migrations` VALUES ('15', 'edocs', '0002_auto_20170501_2223', '2017-05-02 05:23:29');

-- ----------------------------
-- Table structure for empresas
-- ----------------------------
DROP TABLE IF EXISTS `empresas`;
CREATE TABLE `empresas` (
  `pkempresa` int(11) NOT NULL AUTO_INCREMENT,
  `empresa` varchar(255) DEFAULT NULL,
  `clave` varchar(255) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`pkempresa`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of empresas
-- ----------------------------

-- ----------------------------
-- Table structure for empresas_erp
-- ----------------------------
DROP TABLE IF EXISTS `empresas_erp`;
CREATE TABLE `empresas_erp` (
  `pkempresa` int(11) NOT NULL AUTO_INCREMENT,
  `Negocio` varchar(255) DEFAULT NULL,
  `Id_erp` varchar(255) DEFAULT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `conn_ip` varchar(255) DEFAULT NULL,
  `conn_user` varchar(255) DEFAULT NULL,
  `conn_pass` varchar(255) DEFAULT NULL,
  `conn_base` varchar(255) DEFAULT NULL,
  `d_Id` varchar(255) DEFAULT NULL,
  `d_RazonSocial` varchar(255) DEFAULT NULL,
  `d_NombreComercial` varchar(255) DEFAULT NULL,
  `d_Direccion` varchar(255) DEFAULT NULL,
  `d_Archivo` mediumblob DEFAULT NULL,
  `d_Clave` varchar(255) DEFAULT NULL,
  `d_Correo` varchar(255) DEFAULT NULL,
  `d_Obligado` varchar(255) DEFAULT NULL,
  `u_correo` varchar(255) DEFAULT NULL,
  `u_clave` varchar(255) DEFAULT NULL,
  `u_activacion` text DEFAULT NULL,
  `u_tipo` text DEFAULT NULL,
  `d_Especial` text DEFAULT NULL,
  `d_regimenMicroempresas` varchar(255) DEFAULT NULL,
  `d_agenteRetencion` varchar(255) DEFAULT NULL,
  `cc_control` varchar(255) DEFAULT NULL,
  `conn_port` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`pkempresa`)
) ENGINE=InnoDB AUTO_INCREMENT=123 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of empresas_erp
-- ----------------------------
INSERT INTO `empresas_erp` VALUES ('39', 'BaseLocal', 'BaseLocal', 'valido', '127.0.0.1', 'root', '123456789', 'BaseLocal', '0', '0', '0', '0', 0x30, '0', '0', '0', '', '', '', '', '0', null, null, '', '');

-- ----------------------------
-- Table structure for experto_aceptados
-- ----------------------------
DROP TABLE IF EXISTS `experto_aceptados`;
CREATE TABLE `experto_aceptados` (
  `pkexperto` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` text DEFAULT NULL,
  `email` text DEFAULT NULL,
  `pais` text DEFAULT NULL,
  `cuidad` text DEFAULT NULL,
  `resumen` text DEFAULT NULL,
  `tipo` text DEFAULT NULL,
  `opiniones` int(11) DEFAULT NULL,
  PRIMARY KEY (`pkexperto`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of experto_aceptados
-- ----------------------------

-- ----------------------------
-- Table structure for experto_posible
-- ----------------------------
DROP TABLE IF EXISTS `experto_posible`;
CREATE TABLE `experto_posible` (
  `pkexperto` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` text DEFAULT NULL,
  `email` text DEFAULT NULL,
  `pais` text DEFAULT NULL,
  `cuidad` text DEFAULT NULL,
  `exper` text DEFAULT NULL,
  PRIMARY KEY (`pkexperto`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of experto_posible
-- ----------------------------

-- ----------------------------
-- Table structure for ingresos
-- ----------------------------
DROP TABLE IF EXISTS `ingresos`;
CREATE TABLE `ingresos` (
  `pkid` int(11) NOT NULL AUTO_INCREMENT,
  `fecha` text DEFAULT NULL,
  `ip` text DEFAULT NULL,
  `fuente` text DEFAULT NULL,
  PRIMARY KEY (`pkid`)
) ENGINE=InnoDB AUTO_INCREMENT=27605 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of ingresos
-- ----------------------------
INSERT INTO `ingresos` VALUES ('27603', '2023-04-05 01:36:39.778791', '127.0.0.1', 'Local_5');
INSERT INTO `ingresos` VALUES ('27604', '2023-04-05 01:41:39.789875', '127.0.0.1', 'Local_10');

-- ----------------------------
-- Table structure for ing_demo
-- ----------------------------
DROP TABLE IF EXISTS `ing_demo`;
CREATE TABLE `ing_demo` (
  `pkid` int(11) NOT NULL AUTO_INCREMENT,
  `Fecha` datetime DEFAULT NULL,
  `Nombres` varchar(255) DEFAULT NULL,
  `Telefono` varchar(255) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `Tipo` varchar(255) DEFAULT NULL,
  `Tamano` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`pkid`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of ing_demo
-- ----------------------------

-- ----------------------------
-- Table structure for matriculas
-- ----------------------------
DROP TABLE IF EXISTS `matriculas`;
CREATE TABLE `matriculas` (
  `Pk` int(11) NOT NULL AUTO_INCREMENT,
  `usuario` text DEFAULT NULL,
  `clave` text DEFAULT NULL,
  `licencias` int(11) DEFAULT NULL,
  `anos` int(11) DEFAULT NULL,
  `correo` varchar(255) DEFAULT NULL,
  `clave_aute` varchar(255) DEFAULT NULL,
  `tipo` varchar(255) DEFAULT NULL,
  `forma` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Pk`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of matriculas
-- ----------------------------
INSERT INTO `matriculas` VALUES ('1', 'nlubkov', 'akroma87', '97', '10', 'nlubkov@gmail.com', '1', 'Personal uso privado', '1');
INSERT INTO `matriculas` VALUES ('2', 'vicky', '123', '49', '10', '1', '1', 'Personal uso privado', '1');
INSERT INTO `matriculas` VALUES ('3', 'bassa', 'admin87', '78', '10', '1', '1', 'Personal uso privado', '1');
INSERT INTO `matriculas` VALUES ('4', 'gallegos', 'carlosg', '47', '10', '1', '1', 'Personal uso privado', '1');
INSERT INTO `matriculas` VALUES ('5', 'FLORASINTESIS', 'floragye', '0', '10', 'jortiz@florasintesis.com.ec', '55883', 'Personal uso privado', '1');
INSERT INTO `matriculas` VALUES ('18', 'marco', 'marco', '15', '10', 's', '1', 'Personal uso privado', '1');
INSERT INTO `matriculas` VALUES ('21', 'denisse', 'denisse', '48', '10', 'd', '1', 'Personal uso privado', '1');
INSERT INTO `matriculas` VALUES ('22', 'finca', 'finca', '50', '10', 's', '1', 'Personal uso privado', '1');
INSERT INTO `matriculas` VALUES ('23', 'cc', 'cc2020', '50', '10', 's', '1', 'Personal uso privado', '1');

-- ----------------------------
-- Table structure for plantillas_html
-- ----------------------------
DROP TABLE IF EXISTS `plantillas_html`;
CREATE TABLE `plantillas_html` (
  `pk` int(11) NOT NULL AUTO_INCREMENT,
  `plantillas_web` text DEFAULT NULL,
  `plantillas_id` text DEFAULT NULL,
  `esp` text DEFAULT NULL,
  `ing` text DEFAULT NULL,
  `por` text DEFAULT NULL,
  PRIMARY KEY (`pk`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of plantillas_html
-- ----------------------------
INSERT INTO `plantillas_html` VALUES ('1', 'log', 'titulo', 'CeroCodigo', 'CeroCodigo', 'CeroCodigo');
INSERT INTO `plantillas_html` VALUES ('2', 'log', 'ingreso', 'Ingreso', 'Login Form', 'Login Form');
INSERT INTO `plantillas_html` VALUES ('3', 'log', 'empresa', 'Empresa', 'Business', 'Business');
INSERT INTO `plantillas_html` VALUES ('4', 'log', 'usuario', 'Usuario', 'User', 'User');
INSERT INTO `plantillas_html` VALUES ('5', 'log', 'clave', 'Clave', 'Password', 'Password');
INSERT INTO `plantillas_html` VALUES ('6', 'log', 'ingresar', 'Ingresar', 'Submit', 'Submit');
INSERT INTO `plantillas_html` VALUES ('7', 'log', 'no_acuerda', 'No te acuedas tu clave?', 'Forgot your password', 'Forgot your password');
INSERT INTO `plantillas_html` VALUES ('8', 'log', 'nuevo', 'Nuevo?', 'New?', 'New?');
INSERT INTO `plantillas_html` VALUES ('10', 'log', 'Crear_cuenta', 'Crear cuenta', 'Create Account', 'Create Account');
INSERT INTO `plantillas_html` VALUES ('11', 'menu', 'eliminar', 'Eliminar', 'Delete', 'Delete');
INSERT INTO `plantillas_html` VALUES ('12', 'menu', 'modificar', 'Modificar', 'Modify', 'Modify');
INSERT INTO `plantillas_html` VALUES ('13', 'menu', 'nuevo', 'Nuevo', 'New', 'New');
INSERT INTO `plantillas_html` VALUES ('14', 'menu', 'cerrar', 'Cerrar', 'Close', 'Close');
INSERT INTO `plantillas_html` VALUES ('15', 'menu', 'inicio', 'Panel', 'Dashboard', 'Dashboard');
INSERT INTO `plantillas_html` VALUES ('16', 'menu', 'acciones', 'Acciones', 'Action', 'Action');
INSERT INTO `plantillas_html` VALUES ('17', 'menu', 'msg_eliminar', 'Eliminar Registro?', 'Delete Record?', 'Delete Record?');
INSERT INTO `plantillas_html` VALUES ('18', 'menu', 'eliminado', 'Eliminado', 'Deleted', 'Deleted');
INSERT INTO `plantillas_html` VALUES ('19', 'menu', 'cancelado', 'Cancelado', 'Cancel', 'Cancel');
INSERT INTO `plantillas_html` VALUES ('20', 'menu', 'espere', 'Espere', 'Wait', 'Wait');
INSERT INTO `plantillas_html` VALUES ('21', 'menu', 'carga', 'El panel esta cargando', 'Panel Loading', 'Panel Loading');
INSERT INTO `plantillas_html` VALUES ('22', 'menu', 'documen_rela', 'Documentos Relacionados', 'Related documents', 'Related documents');
INSERT INTO `plantillas_html` VALUES ('23', 'menu', 'adjunto_des', 'Archivos vinculados', 'files', 'Archivos vinculados');
INSERT INTO `plantillas_html` VALUES ('24', 'menu', 'tarea_des', 'Tareas asignadas', 'To do list', 'Tareas asignadas');
INSERT INTO `plantillas_html` VALUES ('25', 'menu', 'documento_des', 'Modulos del sistema vinculados', 'Modulos del sistema vinculados', 'Modulos del sistema vinculados');
INSERT INTO `plantillas_html` VALUES ('27', 'menu', 'documento', 'Modulos', 'Modulos', 'Modulos');
INSERT INTO `plantillas_html` VALUES ('28', 'menu', 'tarea', 'Tarea', 'Tarea', 'Tarea');
INSERT INTO `plantillas_html` VALUES ('29', 'menu', 'adjunto', 'Archivos', 'Archivos', 'Archivos');
INSERT INTO `plantillas_html` VALUES ('30', 'menu', 'texto', 'Texto', 'texto', 'texto');
INSERT INTO `plantillas_html` VALUES ('31', 'menu', 'Buscador', 'Buscar', 'Search', 'Buscar');
INSERT INTO `plantillas_html` VALUES ('32', 'menu', 'selecion', 'Valor Seleccionado', 'Selected value', 'Valor Seleccionado');
INSERT INTO `plantillas_html` VALUES ('33', 'menu', 'responsable', 'Responsables', 'Responsables', 'Responsables');
INSERT INTO `plantillas_html` VALUES ('34', 'menu', 'ing_tarea', 'Escriba tarea', 'Escriba tarea', 'Escriba tarea');
INSERT INTO `plantillas_html` VALUES ('35', 'menu', 'dropfiles', 'Arrastra archivos aqui', 'dropfiles', 'dropfiles');
INSERT INTO `plantillas_html` VALUES ('36', 'menu', 'add', 'Agregar', 'add', 'add');
INSERT INTO `plantillas_html` VALUES ('37', 'menu', 'subir', 'Cargar', 'Upload', 'Cargar');
INSERT INTO `plantillas_html` VALUES ('38', 'menu', 'crear_add', 'Crear', 'Create', 'crear');
INSERT INTO `plantillas_html` VALUES ('39', 'menu', 'nofiles', 'Ningun Archivo', 'No files', 'Ningun Archivo');
INSERT INTO `plantillas_html` VALUES ('40', 'menu', 'nopuede', 'Tu navegador no es soportado', 'Your browser is not supported', 'Tu navegador no es soportado');
INSERT INTO `plantillas_html` VALUES ('41', 'menu', 'upload', 'Cargando Archivo', 'Loading File', 'Cargando Archivo');
INSERT INTO `plantillas_html` VALUES ('42', 'menu', 'upload_listo', 'Archivo Cargado', 'File loaded', 'Archivo Cargado');
INSERT INTO `plantillas_html` VALUES ('43', 'menu', 'eliminar_txt', 'Eliminar', 'Delete', 'Eliminar');
INSERT INTO `plantillas_html` VALUES ('44', 'menu', 'filtrar', 'Filtrar', 'Filter', 'Filtrar');
INSERT INTO `plantillas_html` VALUES ('45', 'menu', 'files', 'Archivos', 'Files', 'Archivos');
INSERT INTO `plantillas_html` VALUES ('46', 'menu', 'tareas', 'Tareas', 'Check list', 'Tareas');
INSERT INTO `plantillas_html` VALUES ('47', 'menu', 'doc_save', 'Archivo adjuntado', 'File attach', 'Archivo adjuntado');
INSERT INTO `plantillas_html` VALUES ('48', 'registro', 'nuevo', 'Nuevo', 'New', 'Nuevo');
INSERT INTO `plantillas_html` VALUES ('49', 'registro', 'filtro', 'Filtro', 'Filter', 'Filtro');
INSERT INTO `plantillas_html` VALUES ('50', 'registro', 'Acciones', 'Acciones', 'Action', 'Acciones');
INSERT INTO `plantillas_html` VALUES ('51', 'menu', 'ejecutar', 'Ejecutar', 'Excecute', 'Ejecutar');
INSERT INTO `plantillas_html` VALUES ('52', 'menu', 'Acciones', 'Acciones', 'Action', 'Acciones');
INSERT INTO `plantillas_html` VALUES ('53', 'menu', 'max', 'Max', 'Max', 'Max');
INSERT INTO `plantillas_html` VALUES ('54', 'menu', 'detalle', 'Detalle', 'Detail', 'Detalle');
INSERT INTO `plantillas_html` VALUES ('55', 'menu', 'Excell', 'Excell', 'Excell', 'Excell');
INSERT INTO `plantillas_html` VALUES ('56', 'menu', 'mens_detalle', '¿Con detalle?', 'With detail?', 'Con detalle?');
INSERT INTO `plantillas_html` VALUES ('57', 'menu', 'fecha', 'Fecha', 'Date', 'Fecha');
INSERT INTO `plantillas_html` VALUES ('58', 'menu', 'estilo', 'Estilo de los campos', 'Estilo de los campos', 'Estilo de los campos');
INSERT INTO `plantillas_html` VALUES ('59', 'menu', 'estilo_des', 'Cambiar posicion y tamaño de campos', 'Cambiar posicion y tamaño de campos', 'Cambiar posicion y tamaño de campos');
INSERT INTO `plantillas_html` VALUES ('60', 'menu', 'campo', 'Administrador Campos', 'Administrador Campos', 'Administrador Campos');
INSERT INTO `plantillas_html` VALUES ('61', 'menu', 'campo_des', 'Crear campos nuevos o modifica los ', 'Crear campos nuevos o modifica los ', 'Crear campos nuevos o modifica los ');
INSERT INTO `plantillas_html` VALUES ('62', 'menu', 'acciones', 'Administrador Movimeintos', 'Administrador Movimeintos', 'Administrador Movimeintos');
INSERT INTO `plantillas_html` VALUES ('63', 'menu', 'acciones_des', 'admin mov desc', 'admin mov desc', 'admin mov desc');
INSERT INTO `plantillas_html` VALUES ('64', 'menu', 'pdf', 'pdf', 'pdf', 'pdf');
INSERT INTO `plantillas_html` VALUES ('65', 'menu', 'pdf_des', 'pdf_des', 'pdf_des', 'pdf_des');
INSERT INTO `plantillas_html` VALUES ('66', 'menu', 'valida', 'valida', 'valida', 'valida');
INSERT INTO `plantillas_html` VALUES ('67', 'menu', 'valida_des', 'valida_des', 'valida_des', 'valida_des');
INSERT INTO `plantillas_html` VALUES ('68', 'menu', 'importa', 'importa', 'importa', 'importa');
INSERT INTO `plantillas_html` VALUES ('69', 'menu', 'importa_des', 'importa_des', 'importa_des', 'importa_des');
INSERT INTO `plantillas_html` VALUES ('70', 'menu', 'menu', 'Menú', 'Menu', 'Menu');
INSERT INTO `plantillas_html` VALUES ('71', 'menu', 'opciones', 'Opciones', 'Options', 'Opciones');

-- ----------------------------
-- Table structure for plantillas_web
-- ----------------------------
DROP TABLE IF EXISTS `plantillas_web`;
CREATE TABLE `plantillas_web` (
  `pk` int(11) NOT NULL AUTO_INCREMENT,
  `plantilla` text DEFAULT NULL,
  `id_plantilla` text DEFAULT NULL,
  `esp` text DEFAULT NULL,
  `ing` text DEFAULT NULL,
  `por` text DEFAULT NULL,
  PRIMARY KEY (`pk`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of plantillas_web
-- ----------------------------
INSERT INTO `plantillas_web` VALUES ('1', 'log', 'titulo', 'CeroCodigo', 'CeroCodigo', 'CeroCodigo');
INSERT INTO `plantillas_web` VALUES ('2', 'log', 'empresa', 'Empresa', 'Business', 'a');
INSERT INTO `plantillas_web` VALUES ('3', 'log', 'usuario', 'Usuario', 'User', null);
INSERT INTO `plantillas_web` VALUES ('4', 'log', 'clave', 'Clave', 'Password', null);
INSERT INTO `plantillas_web` VALUES ('5', 'log', 'ingresar', 'Ingresar', 'Submit', null);
INSERT INTO `plantillas_web` VALUES ('6', 'log', 'msg_acuerdo', 'No te acuerdas tu clave?', 'Forgot password?', null);
INSERT INTO `plantillas_web` VALUES ('7', 'log', 'nuevo', 'Nuevo?', 'New?', null);
INSERT INTO `plantillas_web` VALUES ('8', 'log', 'crear_cuenta', 'Crear Cuenta', 'Create Account', null);
INSERT INTO `plantillas_web` VALUES ('9', 'log', 'msg_ini', 'Ingreso', 'Login', null);

-- ----------------------------
-- Table structure for smtp_correos
-- ----------------------------
DROP TABLE IF EXISTS `smtp_correos`;
CREATE TABLE `smtp_correos` (
  `pk` int(11) NOT NULL AUTO_INCREMENT,
  `emisor` text DEFAULT NULL,
  `clave` text DEFAULT NULL,
  `puerto` text DEFAULT NULL,
  `host` text DEFAULT NULL,
  `logo` text DEFAULT NULL,
  `con_reportes` text DEFAULT NULL,
  `tipo_base` text DEFAULT NULL,
  PRIMARY KEY (`pk`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of smtp_correos
-- ----------------------------

-- ----------------------------
-- Table structure for usuarios_registro
-- ----------------------------
DROP TABLE IF EXISTS `usuarios_registro`;
CREATE TABLE `usuarios_registro` (
  `pkid` int(11) NOT NULL AUTO_INCREMENT,
  `usuario` text DEFAULT NULL,
  `tipo` text DEFAULT NULL,
  `correo` text DEFAULT NULL,
  `clave` varchar(10) DEFAULT NULL,
  `usado` varchar(2) DEFAULT NULL,
  PRIMARY KEY (`pkid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of usuarios_registro
-- ----------------------------
INSERT INTO `usuarios_registro` VALUES ('1', 'test', 'tipo', 'nlubkov', '1234', 'No');
