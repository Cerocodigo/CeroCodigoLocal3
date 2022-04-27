"""django_project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""

from django.views.static import serve

from django.conf.urls import url
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView

from . import views
urlpatterns = [     
    url(r'^ccimagenes', views.ccimagenes), #'todo.views.edit_lists', name='edit_lists',
    #url(r'^', views.aproduccion), #solo con alterno cuando No este jodido produccion 
    #url(r'^(modelos/(?P<v_modelo>[a-z, A-Z, 0-9]+)', views.eshop_bus_solo),          
    url(r'^(?P<idioma>[a-z]+)/demo', views.log_demo),   
    url(r'^(?P<idioma>[a-z]+)/admin_pro', views.consulta_erp),        
    url(r'^(?P<idioma>[a-z]+)/consulta', views.consulta_erp),      
    url(r'^(?P<idioma>[a-z]+)/registro', views.registro_erp),      
    url(r'^(?P<idioma>[a-z]+)/log', views.log_erp),   
    url(r'^(?P<idioma>[a-z]+)/adm', views.log_erpAdmin),    
    url(r'^(?P<negocio>[a-z, A-Z, 0-9]+)/mediaPeso', views.mediaPeso), 
    url(r'^(?P<negocio>[a-z, A-Z, 0-9]+)/Subcribete', views.Subcribete), 
    url(r'^(?P<negocio>[a-z, A-Z, 0-9]+)/chek_out_terminar', views.chek_out_terminar), 
    url(r'^(?P<negocio>[a-z, A-Z, 0-9]+)/chek_out_confimr', views.chek_out_confimr),      
    url(r'^(?P<negocio>[a-z, A-Z, 0-9]+)/eshop_promo', views.eshop_promo), 
    url(r'^(?P<negocio>[a-z, A-Z, 0-9]+)/chek_out_pago', views.pago), 
    url(r'^(?P<negocio>[a-z, A-Z, 0-9]+)/chek_out_data', views.chek_out_data), 
    url(r'^(?P<negocio>[a-z, A-Z, 0-9]+)/eshop_borrar_cod', views.eshop_borrar_cod), 
    url(r'^(?P<negocio>[a-z, A-Z, 0-9]+)/eshop_mod_cod', views.eshop_mod_cod),   
    url(r'^(?P<negocio>[a-z, A-Z, 0-9]+)/eshop_add_cod', views.eshop_add_cod), 
    url(r'^(?P<negocio>[a-z, A-Z, 0-9]+)/eshop_checkout_final/', views.eshop_checkout_final), 
    url(r'^(?P<negocio>[a-z, A-Z, 0-9]+)/eshop/pedido/(?P<v_numero>[a-z, A-Z, 0-9]+)', views.eshop_bus_pedido),
    url(r'^(?P<negocio>[a-z, A-Z, 0-9]+)/eshop/checkout/', views.eshop_checkout),
    url(r'^(?P<negocio>[a-z, A-Z, 0-9]+)/eshop/codigo/(?P<v_cod>[a-z, A-Z, 0-9]+)', views.eshop_bus_codigo),
    url(r'^(?P<negocio>[a-z, A-Z, 0-9]+)/eshop/(?P<v_cat>[a-z, A-Z, 0-9]+)/(?P<v_busca>[a-z, A-Z, 0-9]+)', views.eshop_bus_solo_cat),                    
    url(r'^(?P<negocio>[a-z, A-Z, 0-9]+)/eshop/(?P<v_cat>[a-z, A-Z, 0-9]+)', views.eshop_bus_solo),          
    url(r'^(?P<negocio>[a-z, A-Z, 0-9]+)/eshop', views.eshop),  
    url(r'^aa', views.aa),
    url(r'^activar/(?P<Clave_act>[0-9]+)/', views.activar_usuario),
    url(r'^al_errores', views.al_errores), 
    url(r'^adm_estados_cond', views.adm_estados_cond),
    url(r'^adm_estados_actualizar', views.adm_estados_actualizar), 
    url(r'^adm_estados_nuevo', views.adm_estados_nuevo), 
    url(r'^adm_estados', views.adm_estados), 
    url(r'^adm_pdf', views.adm_pdf), 
    url(r'^admgrabar_pdf', views.admgrabar_pdf),      
    url(r'^alertas', views.alertas),      
    url(r'^archi_carg', views.archi_carg), #'todo.views.edit_lists', name='edit_lists'       
    url(r'^archi_car_home', views.archi_car_home), #'todo.views.edit_lists', name='edit_lists'            
    url(r'^actualiza_campo', views.actualiza_erp),  
    url(r'^actualizar_docs', views.actualizar_docs),
    url(r'^acc_usuario', views.acc_usuario),
    url(r'^acc_por_esp', views.acc_por_esp),
    url(r'^acc_por_mas', views.acc_por_mas),
    url(r'^add_sub_tarea', views.add_sub_tarea),
    url(r'^add_file_sub_tarea', views.add_file_sub_tarea),  
    url(r'^agregar_nota_txt', views.agregar_nota_txt),    
    url(r'^agregar_tar_txt', views.agregar_tar_txt),      
    url(r'^buscador_auditoria', views.buscador_auditoria),   #prueba de chrtas   
    url(r'^buscador_auto_enter', views.buscador_auto_enter),   #prueba de chrtas
    url(r'^buscador_filtro', views.buscador_filtro),   #prueba de chrtas
    url(r'^buscador_ficha', views.buscador_ficha),   #prueba de chrtas        
    url(r'^buscador_filt_rep', views.buscador_filt_rep),   #prueba de chrtas
    url(r'^buscador_nota_doc', views.buscador_nota_doc),   #prueba de chrtas
    url(r'^buscador', views.buscador),   
    url(r'^credito/(?P<Clave_doc>[0-9]+)/', views.Credito),
    url(r'^cargar_paneles', views.cargar_paneles),    
    url(r'^cambio_estado', views.cambio_estado),           
    url(r'^cambio_rapido', views.cambio_rapido),           
    url(r'^calendar', views.calendar),      
    url(r'^carga_docs', views.carga_docs),
    url(r'^consolidado', views.consolidado),
    url(r'^crear_new', views.crear_new),        
    url(r'^cmpnumsecuencial', views.cmpnumsecuencial),  
    url(r'^crearcuenta', views.crearcuenta),
    url(r'^crear_usuario', views.creando_cuentas),      
    url(r'^crear_resp', views.crear_resp), 
    url(r'^cargar_charts', views.cargar_charts), 
    url(r'^cambio_dir_reget', views.cambio_dir_reget), 
    url(r'^nuevo_dir_ficha', views.nuevo_dir_ficha), 
    url(r'^cla_usuario', views.cla_usuario), 
    url(r'^demo_views', views.demo_views),
    url(r'^demolog', views.demolog),
    url(r'^demo', views.demo),
    url(r'^dropbox', views.dropbox),
    url(r'^catalogo', views.catalogo),
    url(r'^edocs_subir_sri', views.edocs_subir_sri),      
    url(r'^edocs_eliminaredocs', views.edocs_eliminaredocs),
    url(r'^edocs_sri', views.edocs_sri),
    url(r'^edocs_data_sri', views.edocs_data_sri),
    url(r'^e_docs/Facturas/(?P<Clave_doc>[0-9]+)/', views.Factura),
    url(r'^e_docs/Retenciones/(?P<Clave_doc>[0-9]+)/', views.Retencion),
    url(r'^e_docs/Credito/(?P<Clave_doc>[0-9]+)/', views.Credito),
    url(r'^e_docs/Guia/(?P<Clave_doc>[0-9]+)/', views.Guia),
    url(r'^e_docs', views.e_docs),
    url(r'^enviar_mensaje', views.enviar_mensaje),      
    url(r'^experto_solicitud', views.experto_solicitud),
    url(r'^experto_contacto/(?P<Clave_experto>[0-9]+)/', views.experto_contacto),
    url(r'^expertos', views.expertos),
    url(r'^eliminar_error', views.eliminar_error), 
    url(r'^ficha_new', views.ficha_new),          
    url(r'^factura/(?P<Clave_doc>[0-9]+)/', views.Factura),
    url(r'^file_upload', views.simple_upload), #'todo.views.edit_lists', name='edit_lists'      
    url(r'^guia/(?P<Clave_doc>[0-9]+)/', views.Guia),
    url(r'^grabar_automatico', views.grabar_automatico),
    url(r'^guia', views.guia),
    url(r'^intercambio_cc', views.intercambio_cc),  
    url(r'^intercambio_dir', views.intercambio_dir),        
    url(r'^insert_rapido', views.insert_rapido),  
    url(r'^insert_rap_det', views.insert_rap_det),
    url(r'^log_fast', views.log_fast),            
    url(r'^logrep', views.logrep),            
    url(r'^logweb', views.logweb),            
    url(r'^mensajes', views.mensajes),   
    url(r'^menu_proceso_editar_orden', views.menu_proceso_editar_orden),   
    url(r'^menu_eliminar_modulo', views.menu_eliminar_modulo),    
    url(r'^menu_editar_orden', views.menu_editar_orden),   
    url(r'^menu_editar_atributos', views.menu_editar_atributos),   
    url(r'^menu_add_proceso', views.menu_add_proceso),      
    url(r'^menu_add_modulo', views.menu_add_modulo),      
    url(r'^menu_eliminar', views.menu_eliminar),      
    url(r'^menu_filtro', views.menu_filtro),      
    url(r'^menu_click', views.menu_click),        
    url(r'^menu_reporte', views.reporte_var),                  
    url(r'^modi_fast', views.modi_fast),         
    url(r'^movernota', views.movernota),   
    url(r'^modulos_procesos', views.modulos_procesos),      
    url(r'^modelos', views.modelos),   
    url(r'^mod_usuario', views.mod_usuario),     
    url(r'^mod_grabar_datosuser', views.mod_grabar_datosuser),     
    url(r'^mover_dir_ficha', views.mover_dir_ficha),     
    url(r'^nota_guardar_doc', views.nota_guardar_doc),
    url(r'^notasload', views.notasload), #'todo.views.edit_lists', name='edit_lists'
    url(r'^nota_add_text', views.nota_add_text),    
    url(r'^pre_ejecutados', views.pre_ejecutados),          
    url(r'^perfil/(?P<Id_experto>[0-9]+)/', views.Perfil),
    url(r'^paneles_carga', views.paneles_carga),
    url(r'^paneles_items', views.paneles_items),
    url(r'^procesar_import_previa', views.procesar_import_previa),
    url(r'^procesar_import_proceso', views.procesar_import_proceso),
    url(r'^pdf_ficha', views.pdf_ficha),
    url(r'^promo', views.crear_usuario_promo),      
    url(r'^regis_guardar', views.regis_guardar),   
    url(r'^retencion/(?P<Clave_doc>[0-9]+)/', views.Retencion),
    url(r'^reporte_ejecutar', views.reporte_ejecutar),                    
    url(r'^registro', views.registro),
    url(r'^regis_usuario', views.regis_usuario),  
    url(r'^tareas_finalizar', views.tareas_finalizar),  
    url(r'^tareas_sub_finalizar', views.tareas_sub_finalizar),  
    url(r'^tareas_crear', views.tareas_crear),  
    url(r'^tareas_aprovado', views.tareas_aprovado),    
    url(r'^tareas_ind_por_modulo_pk', views.tareas_ind_por_modulo_pk),   
    url(r'^tareas_cambio', views.tareas_cambio),  
    url(r'^tareas_indi', views.tareas_indi),  
    url(r'^tareas_ind_msg', views.tareas_indi_view),
    url(r'^traer_nota', views.traer_nota),   
    url(r'^traer_sri_ATS_sem', views.traer_sri_ATS_sem),
    url(r'^traer_sri_ATS_mes', views.traer_sri_ATS_mes),
    url(r'^traer_usuario_n', views.traer_usuario_n),
    url(r'^traer_acc_usuario', views.traer_acc_usuario),
    url(r'^traer_datosuser_n', views.traer_datosuser_n),  
    url(r'^traer_rapido', views.traer_rapido),  
    url(r'^test_correo', views.test_correo),      
    url(r'^tareas', views.tareas),  
    url(r'^traer_ficha_valores', views.traer_ficha_valores), 
    url(r'^traer_ficha_imagen', views.traer_ficha_imagen), 
    url(r'^test_chart', views.test_chart),    
    url(r'^usuario_autentificar/(?P<Clave_doc>[0-9]+)/', views.usuario_autentificar),
    url(r'^upload', views.upload),      
    url(r'^usuario_nuevo/(?P<Clave_val>[0-9]+)/', views.usuario_nuevo),
    url(r'^unico', views.unico),
    url(r'^vendido', views.vendido),     
    url(r'^validar_query', views.validar_query),     
    url(r'^xmlload2', views.xmlload2), #'todo.views.edit_lists', name='edit_lists'      
    url(r'^xmlload', views.xmlload), #'todo.views.edit_lists', name='edit_lists'
    url(r'^intro', views.intro2), #'todo.views.edit_lists', name='edit_lists'
    url(r'^panel', views.indexPanel), #'todo.views.edit_lists', name='edit_lists'
    url(r'^alterno', views.alterno), #'todo.views.edit_lists', name='edit_lists'      
    url(r'^arreglo_base', views.arreglo_base), #'todo.views.edit_lists', name='edit_lists'      
    url(r'^media/(?P<path>.*)$', serve,{'document_root': settings.MEDIA_ROOT}),
    url(r'^$', views.intro),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
