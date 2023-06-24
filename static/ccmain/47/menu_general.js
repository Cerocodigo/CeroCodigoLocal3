

function habilitar_diseno() {
  if($( ".diseno" ).css("display")=='none'){
    $( ".diseno" ).css( "display", "" );
  }else{
    $( ".diseno" ).css( "display", "none" );
  }

}

function cerrar_elemento_todo() {

  
  //for (ss = 0; ss <= Object.keys(dict_pestalla).length - 1; ss++) {
  for (ss = Object.keys(dict_pestalla).length - 1; ss >=0 ; ss--) {

    cerrar_elemento(dict_pestalla[Object.keys(dict_pestalla)[ss]]["pestalla"])

  }
  var dd = document.getElementById('link_herra')
  dd.click()

}

function Eliminar_modulo(temp_pestalla){
  var mensaje;
  var opcion = confirm("Eliminar Modulo");
  if (opcion == true) {
    mensaje = "Modulo Eliminado";
    $('#f' + pkmodulo + '-f' + pkregistro).remove();


  } else {
    mensaje = "Cancelado";
  }
}
function admin_listado_posi_dir(dirre , temp_pestalla, t_nombre, t_pkestructura){

  $.ajax({
    type: 'POST',
    url: '/intercambio_listado_dir',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 't_cc_nombre': t_nombre, 't_pkestructura': t_pkestructura, 'dirre': dirre },
    success: function (Response) {
      filtrar(temp_pestalla)
    }
  });
}

function reporte_crear(PkModulo){
    p_nombre = document.getElementById('reporte_nombre'+PkModulo)
  
    if(p_nombre.value.length > 0){
      $.ajax({
        type: 'POST',
        url: '/menu_add_reporte',
        data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'nombre': p_nombre.value, 'PkModulo': PkModulo },
        success: function (Response) {
  
        if(Response['resp']==1){
          div_reportes =  document.getElementById('proceso_'+Response['reporte'][0]['PkModulo']) 
          div_li =  document.getElementById('reporte_nombre'+Response['reporte'][0]['PkModulo'])
          li_reprote = div_li.parentElement
          li_reprote.remove()

          node = document.createElement("li");
          node.innerHTML = '<a class="dropdown-item" onclick="menu_reporte_abrir_dropdown_item('+Response['reporte'][0]['PkReporte']+')" id="'+Response['reporte'][0]['PkReporte']+'" value="reporte" result="'+Response['reporte'][0]['Nombre']+'" style="font-size: 10px;cursor: pointer;"><i class="fa fa-fw fa-arrow-right"></i>'+Response['reporte'][0]['Nombre']+'</a>'  
          div_reportes.children[1].prepend(node)


        }else{
          alert(Response['msg'])
        }
  
      }
    });    
  }
}

function menu_reporte_crear(PkModulo){
  var li_mod = document.getElementById('proceso_'+PkModulo) // 99
  if(document.getElementById('reporte_nombre'+PkModulo) == null){
    var node = document.createElement("li");
    interno = '<input type="text" id="reporte_nombre'+PkModulo+'" placeholder="Nuevo Reporte" value="" style="color: black;width: 85%;" onkeydown="if(event.keyCode == 13){reporte_crear('+PkModulo+')}"> <span class="pull-right-container">'
    node.innerHTML = interno 
    
    li_mod.children[1].append(node)
  }
}


function proceso_crear(PkModGen){
  p_tipo = document.getElementById('proceso_tipo'+PkModGen)
  p_nombre = document.getElementById('proceso_nombre'+PkModGen)

  if(p_nombre.value.length > 0){
    $.ajax({
      type: 'POST',
      url: '/menu_add_proceso',
      data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'nombre': p_nombre.value, 'tipo': p_tipo.value, 'PkModGen': PkModGen },
      success: function (Response) {

      if(Response['resp']==1){
        div_modulo =  document.getElementById('modulo_'+Response['procesos'][0]['Cabecera']) 
        div_li =  document.getElementById('proceso_tipo'+Response['procesos'][0]['Cabecera'])
        li_proceso = div_li.parentElement
        divproceso_crear = document.getElementById('divproceso_crear_'+Response['procesos'][0]['Cabecera'])
        

        if(Response['procesos'][0]['tipo'] == 'Reporte'){
          new_html = '<li class="treeview menu-open" id="proceso_'+Response['procesos'][0]['PkModulo']+'">'
          new_html = new_html + '<a href="" style="font-size: 12px;cursor: pointer;"><i class="fa fa-fw fa-file-text-o"></i>'+Response['procesos'][0]['Descripcion']+'<span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span></a>'         
          new_html = new_html + '<ul class="treeview-menu" style="display: block;">'
          new_html = new_html + '<li class="treeview" style="text-align: center;"><a href=""><span style="color: rgb(9, 249, 9);">Nuevo Reporte</span></a></li>'
          new_html = new_html + '</ul></li> '

          htmp_proceso = divproceso_crear.outerHTML
          divproceso_crear.outerHTML = new_html
          li_proceso.outerHTML = htmp_proceso

        }
        if(Response['procesos'][0]['tipo'] == 'Registro'){
          new_html=  '<li id="proceso_'+Response['procesos'][0]['PkModulo']+'">'
          new_html = new_html + '<div class="row"><div class="col-xs-6">'
          new_html = new_html + '<a class="dropdown-item" onclick="menu_proceso_abrir_dropdown_item('+Response['procesos'][0]['PkModulo']+')" id="'+Response['procesos'][0]['PkModulo']+'" value="registro" result="'+Response['procesos'][0]['Descripcion']+'" style="font-size: 12px;cursor: pointer;"><i class="fa fa-fw fa-arrow-right"></i>'+Response['procesos'][0]['Descripcion']+'</a>'
          new_html = new_html + '</div>'
          new_html = new_html + '<div class="col-xs-6" style="text-align: right;">'
          new_html = new_html + '<a style="background: whitesmoke;width: 20%;padding-left: 5px;padding-right: 5px;cursor: pointer;"><i class="fa fa-arrow-circle-down" onclick="menu_proceso_abajo('+Response['procesos'][0]['PkModulo']+', '+Response['procesos'][0]['Cabecera']+')"></i></a>'
          new_html = new_html + '<a style="background: whitesmoke;width: 20%;padding-left: 5px;padding-right: 5px;cursor: pointer;"><i class="fa fa-arrow-circle-up" onclick="menu_proceso_arriba('+Response['procesos'][0]['PkModulo']+', '+Response['procesos'][0]['Cabecera']+')"></i></a>'
          new_html = new_html + '</div></div></li>'

          htmp_proceso = divproceso_crear.outerHTML
          divproceso_crear.outerHTML = new_html
          li_proceso.outerHTML = htmp_proceso

                                       
        }
      }else{
          alert(Response['msg'])
      }

      }
    });    
  }
}

function menu_proceso_crear(PkModGen){
  var li_mod = document.getElementById('modulo_'+PkModGen) // 99

  if(document.getElementById('proceso_nombre'+PkModGen) == null){
    var node = document.createElement("li");
    interno = '<select id="proceso_tipo'+PkModGen+'" class="btn btn-info dropdown-toggle" style="width: 80px;font-size: 11px;padding-top: 5px;padding-bottom: 5px; font-family: FontAwesome; padding-left: 0px;padding-right: 0px;background: darkslategray;">'
    interno = interno + '<option selected value="Listado">Listado</option>'
    interno = interno + '<option value="Detalle">Detalle</option>'
    interno = interno + '<option value="SubDetalle">SubDetalle</option>'
    interno = interno + '<option value="Reportes">Reportes</option>'
    interno = interno + '</select>'
    interno = interno + '<input type="text" id="proceso_nombre'+PkModGen+'" placeholder="Nuevo Proceso" value="" style="color: black;width: 85%;" onkeydown="if(event.keyCode == 13){proceso_crear('+PkModGen+')}"> <span class="pull-right-container">'
    node.innerHTML = interno 
    
    li_mod.children[1].append(node)
  }
}

function parar_autoccerar_pestana(id_pestana) {
  btn_cerrar = document.getElementById('btnAutocerrar'+id_pestana)
  btn_cerrar.innerText = ""
  btn_cerrar.remove()

}

function autoccerar_pestana(id_pestana, timepo) {
  setTimeout('Cuenta_60('+id_pestana+', '+timepo+')',1000);
}

function Cuenta_60(id_pestana, tiempo) {
  tiempo= tiempo -1
  btn_cerrar = document.getElementById('btnAutocerrar'+id_pestana)
  if(btn_cerrar.innerText != ""){
    if(tiempo==0){
      cerrar_elemento(id_pestana)
    }
    else{
      btn_cerrar.innerText = tiempo
      setTimeout('Cuenta_60('+id_pestana+','+tiempo+')',1000);
    }  
  }
  

}
    

function menu_abierto(t_valor){
  
  //for (ss = Object.keys(dict_pestalla).length - 1; ss >=0 ; ss--) {

  for (ss = 0; ss <=Object.keys(dict_pestalla).length-1 ; ss++) {
        
    if(dict_pestalla[Object.keys(dict_pestalla)[ss]]['tabla'] != undefined){
      if (dict_pestalla[Object.keys(dict_pestalla)[ss]]['tabla'][0]['PkModulo'] == t_valor){
        document.getElementById('id'+ dict_pestalla[Object.keys(dict_pestalla)[ss]]["pestalla"]).click()
        return true
      }
    }
    if(dict_pestalla[Object.keys(dict_pestalla)[ss]]['tabla_cab'] != undefined){
      if (dict_pestalla[Object.keys(dict_pestalla)[ss]]['tabla_cab']['PkModulo'] == t_valor){
        document.getElementById('id'+ dict_pestalla[Object.keys(dict_pestalla)[ss]]["pestalla"]).click()
        return true
      }
    }


  }

  return false
}

function menu_proceso_abrir_dropdown_item(este_id){
  if(offline == false){
    este = document.getElementById(este_id)
    t_valor = $(este).attr("id")
    if(menu_abierto(t_valor) == false){
      pestalla = pestalla + 1
      $("#myTab").prepend('<li role="presentation" class="" id="li' + pestalla + '" style="text-align: right;"><a href="#rr' + pestalla + '" id="id' + pestalla + '" role="tab" data-toggle="tab" aria-expanded="false">Listado: ' + $(este).attr("result") + ' <i class="fa fa-times" style="color: red; background: transparent;cursor: pointer;" onclick="cerrar_elemento(' + pestalla + ')"></i></a> </li>');
  
      if ($(este).attr("value") == "registro") {
        $.ajax({
          type: 'POST',
          url: '/menu_click',
          data: { 'fuente': $(este).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'pk': $(este).attr("id"), 'usuario': web_usuario, 'idioma': web_idioma, 'pestalla': pestalla },
          beforeSend: function () {
            $("#myTabContent").prepend('<div role="tabpanel" class="tab-pane fade" id="rr' + pestalla + '" aria-labelledby="id' + pestalla + '" style="background-color: transparent;"> <div style="padding-top: 5px;">Procesando </div></div>');
          },
          success: function (Response) {
  
            dict_pestalla['p-' + Response["pestalla"]] = Response
  
  
            data_new = '<div class="box-header with-border" style="margin-left: 0px;margin-right: 0px;background: white;padding: 0px;"><div class="input-group" style="width: 100%;">'
            if (Response["nuevo"] == 'Si') {
              //data_new = data_new + '<button class="btn bg-blue btn-flat margin" onclick="cerrar_elemento(' + Response["pestalla"] +');registro(' + Response["tabla"][0]["PkModulo"] +',0,0,' + Response["pestalla"] +',0)">Nuevo</span></button>'
              data_new = data_new + '<button class="btn bg-blue btn-flat margin" onclick="registro(' + Response["tabla"][0]["PkModulo"] + ',0,0,' + Response["pestalla"] + ',0,0)">Nuevo</span></button>'
  
            }
            data_new = data_new + ''
  
            if (web_esAdmin == 'Y') {
  
              data_new = data_new + '<button class="btn bg-yellow btn-flat margin" onclick="modificar_estilo_recarga_inicial(' + Response["pestalla"] + ')">Editar Formulario</span></button>'
  
              data_new = data_new + '<button class="btn bg-yellow btn-flat margin" onclick="modificar_estilo_PDF(' + Response["pestalla"] + ')">Editar Pdf</span></button>'
              data_new = data_new + '<button class="btn bg-yellow btn-flat margin" onclick="Editar_estados(' + Response["pestalla"] + ')">Editar Estados</span></button>'
              data_new = data_new + '<button class="btn bg-yellow btn-flat margin" onclick="CondicionesEditar(' + Response["pestalla"] + ')">Editar condiciones</span></button>'
  
              data_new = data_new + '<button class="btn bg-yellow btn-flat margin" onclick="Importar_datos(' + Response["pestalla"] + ')">Importar Datos</span></button>'
  
  
            }
  
  
            data_new = data_new + '<button type="button" onclick="cerrar_elemento(' + Response["pestalla"] + ')" class="btn bg-red btn-flat margin" style="margin-right: 10px;">Cerrar</span></button>'
  
            data_new = data_new + '<button type="button" data-toggle="tooltip" data-placement="top" title="Excell" style="background: gainsboro;    border: dotted;    color: black;    font-size: larger;    margin-top: 0px;    margin-bottom: 0px;margin-right: 5px;" onclick="excell_tabla(tabla_intera_' + Response["pestalla"] + ')" class="btn btn-info"><span class="fa fa-file-excel-o" aria-hidden="true"></span></button>'
  
  
  
            data_new = data_new + 'Filtrar: '
  
  
            data_new = data_new + '<input type="text" id="valor' + Response["pestalla"] + '"  name="valor' + Response["pestalla"] + '" onkeydown="if(event.keyCode == 13){filtrar(' + Response["pestalla"] + ')}">'
            data_new = data_new + ' Max: <input type="number" id="top' + Response["pestalla"] + '"  name="top' + Response["pestalla"] + '" value="10" style="width: 40px;" onchange="filtrar(' + Response["pestalla"] + ')">'
            data_new = data_new + '<select class="btn btn-info dropdown-toggle" id="campo' + Response["pestalla"] + '" style="width: 200px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;">'
            data_new = data_new + '<option>Todos</option>'
  
            for (x = 1; x < Response["names"].length; x++) {
              data_new = data_new + '<option>' + Response["names"][x][0] + '</option>'
            }
            data_new = data_new + '</select>'
  
            data_new = data_new + '<button type="button" class="btn btn-info" onclick="filtrar(' + Response["pestalla"] + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-check"></i></button>'
  
  
            largo_tablaPX = 0
            for (x = 0; x < Response["estru"].length; x++) {
              largo_tablaPX = largo_tablaPX + parseInt(Response["estru"][x]["largo"])
            }
  
  
            data_new = data_new + '</div></div><div class="box-body" style="padding-left: 0px;"><div class="card-block text-left" style="overflow: auto;"><div id="tabla' + Response["pestalla"] + '"><table id="tabla_intera_' + Response["pestalla"] + '" width="100%;font-size: 11px;" class="table table-bordered bulk_action" style="background-color: white;overflow-x:auto;width: ' + largo_tablaPX + 'px; font-size: 11px;">'
  
            data_new = data_new + '<thead><tr><th style="width: 80px;">Acciones</th>'
  
  
            for (x = 1; x < Response["names"].length; x++) {
              //data_new = data_new + '<th style="width: '+ parseInt(Response["estru"][x]["largo"]) +'px;">' + Response["names"][x][0] +'<textarea type="text" class="form-control col-sm-8" readonly="readonly" style="height: 25px; font-size: 11px; margin: 0px 43.3125px 7px 0px;"></textarea></th>'
              //data_new = data_new + '<th style="width: '+ parseInt(Response["estru"][x]["largo"]) +'px;"><textarea type="text" class="form-control col-sm-8" readonly="readonly" style="height: 25px; font-size: 11px; margin: 0px 43.3125px 7px 0px;max-height: 25px;width: '+ parseInt(Response["estru"][x]["largo"]) +'px;">' + Response["names"][x][0] +'</textarea></th>'
  
              //data_new = data_new + '<th><textarea type="text" class="form-control col-sm-8" readonly="readonly" style="height: 25px; font-size: 11px; margin: 0px 43.3125px 7px 0px;max-height: 25px;width: ' + parseInt(Response["estru"][x]["largo"]) + 'px;">' + Response["names"][x][0] + '</textarea></th>'
  
              data_new = data_new + '<th><div class="input-group input-group-sm">'
              if (web_esAdmin == 'Y') { 
                data_new = data_new + '<button type="button" onclick="admin_listado_posi_dir(0,' + Response["pestalla"] + ', \''+Response["names"][x][0]+'\', '+Response['tabla'][0]['PkEstructura'] +')" class="btn bg-green btn-flat margin" data-toggle="tooltip" data-placement="top" title="Mover Izquierda" style="padding-left: 0px;padding-right: 0px;margin-bottom: 0px;margin-top: 0px;padding-top: 0px;padding-bottom: 0px;"><i class="fa fa-fw fa-arrow-left"></i></button>'
              }
              data_new = data_new + '<textarea type="text" class="form-control col-sm-8" readonly="readonly" style="height: 25px; font-size: 11px; margin: 0px 43.3125px 7px 0px;max-height: 25px;width: ' + parseInt(Response["estru"][x]["largo"]) + 'px;">' + Response["names"][x][0] + '</textarea>'
              if (web_esAdmin == 'Y') { 
                data_new = data_new + '<button type="button" onclick="admin_listado_posi_dir(1,' + Response["pestalla"] + ', \''+Response["names"][x][0]+'\', '+Response['tabla'][0]['PkEstructura'] +')" class="btn bg-green btn-flat margin" data-toggle="tooltip" data-placement="top" title="Mover Derecha" style="padding-left: 0px;padding-right: 0px;margin-bottom: 0px;margin-top: 0px;padding-top: 0px;padding-bottom: 0px;"><i class="fa fa-fw fa-arrow-right"></i></button>'
              }
              data_new = data_new + '</div></th>'
  
            }
            data_new = data_new + '</tr></thead><tbody>'
  
  
            data_new = data_new + ''
            for (x = 0; x < Response["dictlist"].length; x++) {
              data_new = data_new + '<tr id="f' + Response["tabla"][0]["PkModulo"] + '-f' + Response["dictlist"][x][0] + '"><td style="text-align: center;"><div class="row" >'
              if (Response["modifica"] == "Si") {
                data_new = data_new + '<a class="btn btn-success" onclick="registro(' + Response["tabla"][0]["PkModulo"] + ',' + Response["dictlist"][x][0] + ',1, ' + Response["pestalla"] + ',0,0)" style="padding: 2px 2px; margin-right: 0px; margin-left: 5px;"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a>'
              }
              if (Response["eliminar"] == "Si") {
                data_new = data_new + '<a class="btn btn-danger" onclick="eliminar(' + Response["tabla"][0]["PkModulo"] + ',' + Response["dictlist"][x][0] + ')" style="padding: 2px 2px; margin-right: 0px; margin-left: 0px;"><span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span></a>'
              }
              data_new = data_new + '<a class="btn btn-info" onclick="registro(' + Response["tabla"][0]["PkModulo"] + ',' + Response["dictlist"][x][0] + ',2, ' + Response["pestalla"] + ',0,0)" style="padding: 2px 2px; margin-right: 0px; margin-left: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></a></div></td>'
  
              for (x2 = 1; x2 < Response["names"].length; x2++) {
  
                if (Response["modifica"] == "Si" && web_esAdmin == 'Y') {
                  if (!(Response["estru"][x2]["TablaCampo"] == "cmpnumsimple" || Response["estru"][x2]["TablaCampo"] == "cmpreferenciaadjunto" || Response["estru"][x2]["TablaCampo"] == "cmptxtsimple")) {
                    if (Response["dictlist"][x][x2] == null) {
                      data_new = data_new + '<td><input type="text" class="form-control" value="' + Response["dictlist"][x][x2] + '" readonly="readonly"  style="font-size: 11px; height: 25px;"></td>'
                    } else {
  
                      if (Response["dictlist"][x][x2].length > 20) {
                        data_new = data_new + '<td><textarea type="text" class="form-control col-sm-8" readonly="readonly" style="height: 25px; font-size: 11px; margin: 0px 43.3125px 7px 0px;">' + Response["dictlist"][x][x2] + '</textarea></td>'
  
                      } else {
                        data_new = data_new + '<td><input type="text" class="form-control" value="' + Response["dictlist"][x][x2] + '" readonly="readonly"  style="font-size: 11px; height: 25px;"></td>'
  
                      }
                    }
  
  
  
  
                  } else {
                    id_tag_int = 'md' + Response["pestalla"] + 'zzz' + Response["names"][x2][0] + 'jjj' + Response["dictlist"][x][0]
  
  
                    if (Response["dictlist"][x][x2] == null) {
                      data_new = data_new + '<td><input type="text" id="' + id_tag_int + '" class="form-control" value="' + Response["dictlist"][x][x2] + '" onkeypress="return runScript_modi_fast(event, ' + id_tag_int + ')" style="font-size: 11px; height: 25px;"></td>'
  
                    } else {
                      if (Response["dictlist"][x][x2].length > 20) {
                        data_new = data_new + '<td><textarea type="text" class="form-control col-sm-8" readonly="readonly" style="height: 25px; font-size: 11px; margin: 0px 43.3125px 7px 0px;" id="' + id_tag_int + '" onkeypress="return runScript_modi_fast(event, ' + id_tag_int + ')">' + Response["dictlist"][x][x2] + '</textarea></td>'
  
                      } else {
                        data_new = data_new + '<td><input type="text" id="' + id_tag_int + '" class="form-control" value="' + Response["dictlist"][x][x2] + '" onkeypress="return runScript_modi_fast(event, ' + id_tag_int + ')" style="font-size: 11px; height: 25px;"></td>'
  
                      }
  
                    }
  
  
  
  
                  }
                } else {
                  if (Response["dictlist"][x][x2] == null) {
                    data_new = data_new + '<td><input type="text" class="form-control" value="' + Response["dictlist"][x][x2] + '" readonly="readonly"  style="font-size: 11px; height: 25px;"></td>'
                  } else {
                    if (Response["dictlist"][x][x2].length > 20) {
                      data_new = data_new + '<td><textarea type="text" class="form-control col-sm-8" readonly="readonly" style="height: 25px; font-size: 11px; margin: 0px 43.3125px 7px 0px;">' + Response["dictlist"][x][x2] + '</textarea></td>'
                    } else {
                      data_new = data_new + '<td><input type="text" class="form-control" value="' + Response["dictlist"][x][x2] + '" readonly="readonly"  style="font-size: 11px; height: 25px;"></td>'
  
                    }
  
                  }
  
                }
              }
              data_new = data_new + '</tr>'
            }
            data_new = data_new + '</tbody></table></div></div></div> '
  
            $('#rr' + Response["pestalla"]).html(data_new);
  
            document.getElementById('id' + Response["pestalla"]).click();
  
  
          }
        });
      }
    }
  }
  if(offline == true){
    este = document.getElementById(este_id)
    t_valor = $(este).attr("id")
    if(menu_abierto(t_valor) == false){
      pestalla = pestalla + 1
      $("#myTab").prepend('<li role="presentation" class="" id="li' + pestalla + '" style="text-align: right;"><a href="#rr' + pestalla + '" id="id' + pestalla + '" role="tab" data-toggle="tab" aria-expanded="false">Listado: ' + $(este).attr("result") + ' <i class="fa fa-times" style="color: red; background: transparent;cursor: pointer;" onclick="cerrar_elemento(' + pestalla + ')"></i></a> </li>');
      if ($(este).attr("value") == "registro") {
        $("#myTabContent").prepend('<div role="tabpanel" class="tab-pane fade" id="rr' + pestalla + '" aria-labelledby="id' + pestalla + '" style="background-color: transparent;"> <div style="padding-top: 5px;">Procesando </div></div>');

        data_new = '<div class="box-header with-border" style="margin-left: 0px;margin-right: 0px;background: white;padding: 0px;"><div class="input-group" style="width: 100%;">'
        data_new = data_new + '<button class="btn bg-blue btn-flat margin" onclick="registro(' + $(este).attr("id") + ',0,0,' + pestalla + ',0,0)">Nuevo</span></button>'
        data_new = data_new + '</div></div>'
        $('#rr' + pestalla).html(data_new);
  
        document.getElementById('id' + pestalla).click();

      }
    }
  }
}




function menu_proceso_abajo(pkmodulo, PkModGen){
  var li_pro = document.getElementById('proceso_'+pkmodulo) // 476
  var li_mod = document.getElementById('modulo_'+PkModGen) // 99
  var encontro = false

  for (var i = 1; i < li_mod.children[1].childElementCount-1; i++) {
    if(li_mod.children[1].children[i].className == ''){

      if (encontro == false){
        if(li_mod.children[1].children[i].id == 'proceso_'+pkmodulo){
          encontro = true
        }
      }else{
        menu_proceso_editar_orden(pkmodulo, li_mod.children[1].children[i].id.split('_')[1])
        var int = li_mod.children[1].children[i].outerHTML
        li_mod.children[1].children[i].outerHTML = li_pro.outerHTML
        li_pro.outerHTML = int
        break
      }
    } 
  }




}
function menu_proceso_arriba(pkmodulo, PkModGen){
  var li_pro = document.getElementById('proceso_'+pkmodulo) // 476
  var li_mod = document.getElementById('modulo_'+PkModGen) // 99
  var encontro = false


  for (var i = li_mod.children[1].childElementCount-2; i >= 1; i--){
      if (encontro == false){
      if(li_mod.children[1].children[i].id == 'proceso_'+pkmodulo){
        encontro = true
      }
    }else{
      menu_proceso_editar_orden(pkmodulo, li_mod.children[1].children[i].id.split('_')[1])
      var int = li_mod.children[1].children[i].outerHTML
      li_mod.children[1].children[i].outerHTML = li_pro.outerHTML
      li_pro.outerHTML = int
      break
    }

  }

}


function menu_proceso_editar_orden(pkmodulo1, pkmodulo2){
  $.ajax({
    type: 'POST',
    url: '/menu_proceso_editar_orden',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'pkmodulo1': pkmodulo1, 'pkmodulo2': pkmodulo2 }
  });    
}



function menu_lateral_abajo(PkModGen){
  var li = document.getElementById('modulo_'+PkModGen)

  var ul = document.getElementById('menu_lateral')
  var encontro = false
  for (var i = 1; i < ul.childElementCount-1; i++) {
    if(ul.children[i].className == 'treeview' || ul.children[i].className == 'treeview menu-open'){
      if (encontro == false){
        if(ul.children[i].id == 'modulo_'+PkModGen){
          encontro = true
        }
      }else{
        menu_editar_orden(PkModGen, ul.children[i].id.split('_')[1])
        var int = li.outerHTML
        li.outerHTML = ul.children[i].outerHTML
        ul.children[i].outerHTML = int
        break
      }
    }
  } 
}
function menu_lateral_arriba(PkModGen){
  var li = document.getElementById('modulo_'+PkModGen)

  var ul = document.getElementById('menu_lateral')
  var encontro = false
  for (var i = ul.childElementCount-1; i >= 0; i--){
    if(ul.children[i].className == 'treeview' || ul.children[i].className == 'treeview menu-open'){
      if (encontro == false){
        if(ul.children[i].id == 'modulo_'+PkModGen){
          encontro = true
        }
      }else{
        menu_editar_orden(PkModGen, ul.children[i].id.split('_')[1])
        var int = li.outerHTML
        li.outerHTML = ul.children[i].outerHTML
        ul.children[i].outerHTML = int
        break
      }
    }
  } 
}
function menu_actualizar(PkModGen){
  var icono = document.getElementById('menu_icono'+PkModGen)
  var nombre = document.getElementById('menu_nombre'+PkModGen)
  if(nombre.value.length>0){
    $.ajax({
      type: 'POST',
      url: '/menu_editar_atributos',
      data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'PkModGen': PkModGen, 'icono': icono.value, 'nombre': nombre.value },
      success: function (Response) {
        var li = document.getElementById('modulo_'+PkModGen)
        interno = '<a href=""><i class="'+icono.value+'"></i> <span>'+nombre.value+'</span><span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span></a>'
        li.children[0].outerHTML = interno
        li.children[1].outerHTML = li.children[4].outerHTML
        li.children[2].remove()
        li.children[3].remove()
        li.children[4].remove()
        

      }
    });
  }
}

function menu_lateral_editar(PkModGen){
  var li = document.getElementById('modulo_'+PkModGen)

  html_select  = '<select id="menu_icono'+PkModGen+'" class="btn btn-info dropdown-toggle" style="width: 50px;font-size: 11px;padding-top: 5px;padding-bottom: 5px; font-family: FontAwesome; padding-left: 0px;padding-right: 0px;background: darkslategray;">'
  html_select = html_select + devolver_iconos_lista()
  html_select = html_select + '</select>'
  html_select = html_select.replace('value="'+li.childNodes[1].children[0].attributes[0]['value']+'"', 'selected value="'+li.childNodes[1].children[0].attributes[0]['value']+'"')
  
  

  html_input =  '<input type="text" id="menu_nombre'+PkModGen+'" placeholder="Cambie el nombre" value="'+li.childNodes[1].innerText.trim() +'" style="color: black;width: 75%;" onkeydown="if(event.keyCode == 13){menu_actualizar('+PkModGen+')}"> <span class="pull-right-container">'
    
  li.children[0].children[0].outerHTML = html_select
  li.children[0].children[1].outerHTML = html_input
  
}

function menu_editar_orden(PkModGen1, PkModGen2){
  $.ajax({
    type: 'POST',
    url: '/menu_editar_orden',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'PkModGen1': PkModGen1, 'PkModGen2': PkModGen2 }
  });    
}


function menu_main_eliminar_general(PkModGen){
  if (confirm("Eliminar Modulo")) {
    $.ajax({
      type: 'POST',
      url: '/menu_eliminar_modulo',
      data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'PkModGen': PkModGen },
      success: function (Response) {
        if(Response['Resp'] == 'ok'){
          var modulo_linea = document.getElementById('modulo_'+PkModGen)
          modulo_linea.remove()
        }
      }
    });    
  }
}
 

function menu_crear(){
  slect = document.getElementById("menu_icono")
  input_nobre = document.getElementById("menu_nombre")

  if(input_nobre.value.length > 0){
    $.ajax({
      type: 'POST',
      url: '/menu_add_modulo',
      data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'nombre': input_nobre.value, 'icono': slect.value },
      success: function (Response) {

      if(Response['Resp']==1){

        var el = document.getElementById('menu_lateral');
        var node = document.createElement("li");
        node.setAttribute('class', 'treeview');
        node.setAttribute('id', 'modulo_' + Response['PkModGen']);

        var link = document.createElement("a");
        link.setAttribute('href', '');
        interno = '<i class="'+Response['icono']+'"></i> '
        interno = interno + '<span>'+ Response['nombre'] +'</span> <span class="pull-right-container">'
        interno = interno + '<i class="fa fa fa-angle-left pull-right"></i></span>'

        

        var ull = document.createElement("ul");
        ull.setAttribute('class', 'treeview-menu');
        
        html_interno = '<li class="treeview" style="text-align: center;"><a href="" style="background: whitesmoke;"><span style="color: green;">Nuevo Proceso</span></a></li>'
        html_interno = html_interno + '<li class="treeview" style="text-align: center;"><a href="" style="background: whitesmoke;">'
        html_interno = html_interno + '<span style="color: red;" onclick="menu_main_eliminar_general('+ Response['PkModGen']+ ')">Eliminar Modulo</span>'
        html_interno = html_interno + '</a></li>'
        
        ull.innerHTML = html_interno
        
        link.innerHTML = interno
        node.appendChild(link);
        node.appendChild(ull);

        el.appendChild(node);
      }else{
          alert(Response['msg'])
      }

      }
    });    
  }

}


function menu_main_add_general() {
  if(document.getElementById('menu_nombre') == null){
    var el = document.getElementById('menu_lateral');
    var node = document.createElement("li");
    node.setAttribute('class', 'treeview');
    
    var link = document.createElement("a");
    link.setAttribute('href', '');
    
    interno = '<select id="menu_icono" class="btn btn-info dropdown-toggle" style="width: 50px;font-size: 11px;padding-top: 5px;padding-bottom: 5px; font-family: FontAwesome; padding-left: 0px;padding-right: 0px;background: darkslategray;">'
    interno = interno + devolver_iconos_lista()
    interno = interno + '</select>'
    
    //interno = interno + '<span>'+new_modulo.value+'</span> <span class="pull-right-container">'
    interno = interno + '<input type="text" id="menu_nombre" placeholder="Nuevo Modulo" value="" style="color: black;width: 75%;" onkeydown="if(event.keyCode == 13){menu_crear()}"> <span class="pull-right-container">'
    
    interno = interno + ''
    
    
    var ull = document.createElement("ul");
    ull.setAttribute('class', 'treeview-menu');
    ull.innerHTML = '<li><a class="dropdown-item" style="font-size: 12px;cursor: pointer;"><i class="fa fa fa-fw fa fa-arrow-right"></i> nuevo proceso </a></li>'
    
    link.innerHTML = interno
    node.appendChild(link);
    //node.appendChild(ull);
    
    el.appendChild(node);
    
  }
}
  
  
function devolver_iconos_lista(){
    listado = ''
    listado = listado + '    <option value="fa fa-align-left">&#xf036</option>'
    listado = listado + '    <option value="fa fa-align-right">&#xf038</option>'
    listado = listado + '    <option value="fa fa-amazon">&#xf270</option>'
    listado = listado + '    <option value="fa fa-ambulance">&#xf0f9</option>'
    listado = listado + '    <option value="fa fa-anchor">&#xf13d</option>'
    listado = listado + '    <option value="fa fa-android">&#xf17b</option>'
    listado = listado + '    <option value="fa fa-angellist">&#xf209</option>'
    listado = listado + '    <option value="fa fa-angle-double-down">&#xf103</option>'
    listado = listado + '    <option value="fa fa-angle-double-left">&#xf100</option>'
    listado = listado + '    <option value="fa fa-angle-double-right">&#xf101</option>'
    listado = listado + '    <option value="fa fa-angle-double-up">&#xf102</option>'
    listado = listado + '    <option value="fa fa-angle-left">&#xf104</option>'
    listado = listado + '    <option value="fa fa-angle-right">&#xf105</option>'
    listado = listado + '    <option value="fa fa-angle-up">&#xf106</option>'
    listado = listado + '    <option value="fa fa-apple">&#xf179</option>'
    listado = listado + '    <option value="fa fa-archive">&#xf187</option>'
    listado = listado + '    <option value="fa fa-area-chart">&#xf1fe</option>'
    listado = listado + '    <option value="fa fa-arrow-circle-down">&#xf0ab</option>'
    listado = listado + '    <option value="fa fa-arrow-circle-left">&#xf0a8</option>'
    listado = listado + '    <option value="fa fa-arrow-circle-o-down">&#xf01a</option>'
    listado = listado + '    <option value="fa fa-arrow-circle-o-left">&#xf190</option>'
    listado = listado + '    <option value="fa fa-arrow-circle-o-right">&#xf18e</option>'
    listado = listado + '    <option value="fa fa-arrow-circle-o-up">&#xf01b</option>'
    listado = listado + '    <option value="fa fa-arrow-circle-right">&#xf0a9</option>'
    listado = listado + '    <option value="fa fa-arrow-circle-up">&#xf0aa</option>'
    listado = listado + '    <option value="fa fa-arrow-down">&#xf063</option>'
    listado = listado + '    <option value="fa fa-arrow-left">&#xf060</option>'
    listado = listado + '    <option value="fa fa-arrow-right">&#xf061</option>'
    listado = listado + '    <option value="fa fa-arrow-up">&#xf062</option>'
    listado = listado + '    <option value="fa fa-arrows">&#xf047</option>'
    listado = listado + '    <option value="fa fa-arrows-alt">&#xf0b2</option>'
    listado = listado + '    <option value="fa fa-arrows-h">&#xf07e</option>'
    listado = listado + '    <option value="fa fa-arrows-v">&#xf07d</option>'
    listado = listado + '    <option value="fa fa-asterisk">&#xf069</option>'
    listado = listado + '    <option value="fa fa-at">&#xf1fa</option>'
    listado = listado + '    <option value="fa fa-automobile">&#xf1b9</option>'
    listado = listado + '    <option value="fa fa-backward">&#xf04a</option>'
    listado = listado + '    <option value="fa fa-balance-scale">&#xf24e</option>'
    listado = listado + '    <option value="fa fa-ban">&#xf05e</option>'
    listado = listado + '    <option value="fa fa-bank">&#xf19c</option>'
    listado = listado + '    <option value="fa fa-bar-chart">&#xf080</option>'
    listado = listado + '    <option value="fa fa-bar-chart-o">&#xf080</option>'
    listado = listado + '    <option value="fa fa-battery-full">&#xf240</option>'
    listado = listado + '    n value="fa fa-beer">&#xf0fc</option>'
    listado = listado + '    <option value="fa fa-behance">&#xf1b4</option>'
    listado = listado + '    <option value="fa fa-behance-square">&#xf1b5</option>'
    listado = listado + '    <option value="fa fa-bell">&#xf0f3</option>'
    listado = listado + '    <option value="fa fa-bell-o">&#xf0a2</option>'
    listado = listado + '    <option value="fa fa-bell-slash">&#xf1f6</option>'
    listado = listado + '    <option value="fa fa-bell-slash-o">&#xf1f7</option>'
    listado = listado + '    <option value="fa fa-bicycle">&#xf206</option>'
    listado = listado + '    <option value="fa fa-binoculars">&#xf1e5</option>'
    listado = listado + '    <option value="fa fa-birthday-cake">&#xf1fd</option>'
    listado = listado + '    <option value="fa fa-bitbucket">&#xf171</option>'
    listado = listado + '    <option value="fa fa-bitbucket-square">&#xf172</option>'
    listado = listado + '    <option value="fa fa-bitcoin">&#xf15a</option>'
    listado = listado + '    <option value="fa fa-black-tie">&#xf27e</option>'
    listado = listado + '    <option value="fa fa-bold">&#xf032</option>'
    listado = listado + '    <option value="fa fa-bolt">&#xf0e7</option>'
    listado = listado + '    <option value="fa fa-bomb">&#xf1e2</option>'
    listado = listado + '    <option value="fa fa-book">&#xf02d</option>'
    listado = listado + '    <option value="fa fa-bookmark">&#xf02e</option>'
    listado = listado + '    <option value="fa fa-bookmark-o">&#xf097</option>'
    listado = listado + '    <option value="fa fa-briefcase">&#xf0b1</option>'
    listado = listado + '    <option value="fa fa-btc">&#xf15a</option>'
    listado = listado + '    <option value="fa fa-bug">&#xf188</option>'
    listado = listado + '    <option value="fa fa-building">&#xf1ad</option>'
    listado = listado + '    <option value="fa fa-building-o">&#xf0f7</option>'
    listado = listado + '    <option value="fa fa-bullhorn">&#xf0a1</option>'
    listado = listado + '    <option value="fa fa-bullseye">&#xf140</option>'
    listado = listado + '    <option value="fa fa-bus">&#xf207</option>'
    listado = listado + '    <option value="fa fa-cab">&#xf1ba</option>'
    listado = listado + '    <option value="fa fa-calendar">&#xf073</option>'
    listado = listado + '    <option value="fa fa-camera">&#xf030</option>'
    listado = listado + '    <option value="fa fa-car">&#xf1b9</option>'
    listado = listado + '    <option value="fa fa-caret-up">&#xf0d8</option>'
    listado = listado + '    <option value="fa fa-cart-plus">&#xf217</option>'
    listado = listado + '    <option value="fa fa-cc">&#xf20a</option>'
    listado = listado + '    <option value="fa fa-cc-amex">&#xf1f3</option>'
    listado = listado + '    <option value="fa fa-cc-jcb">&#xf24b</option>'
    listado = listado + '    <option value="fa fa-cc-paypal">&#xf1f4</option>'
    listado = listado + '    <option value="fa fa-cc-stripe">&#xf1f5</option>'
    listado = listado + '    <option value="fa fa-cc-visa">&#xf1f0</option>'
    listado = listado + '    <option value="fa fa-chain">&#xf0c1</option>'
    listado = listado + '    <option value="fa fa-check">&#xf00c</option>'
    listado = listado + '    <option value="fa fa-chevron-left">&#xf053</option>'
    listado = listado + '    <option value="fa fa-chevron-right">&#xf054</option>'
    listado = listado + '    <option value="fa fa-chevron-up">&#xf077</option>'
    listado = listado + '    <option value="fa fa-child">&#xf1ae</option>'
    listado = listado + '    <option value="fa fa-chrome">&#xf268</option>'
    listado = listado + '    <option value="fa fa-circle">&#xf111</option>'
    listado = listado + '    <option value="fa fa-circle-o">&#xf10c</option>'
    listado = listado + '    <option value="fa fa-circle-o-notch">&#xf1ce</option>'
    listado = listado + '    <option value="fa fa-circle-thin">&#xf1db</option>'
    listado = listado + '    <option value="fa fa-clipboard">&#xf0ea</option>'
    listado = listado + '    <option value="fa fa-clock-o">&#xf017</option>'
    listado = listado + '    <option value="fa fa-clone">&#xf24d</option>'
    listado = listado + '    <option value="fa fa-close">&#xf00d</option>'
    listado = listado + '    <option value="fa fa-cloud">&#xf0c2</option>'
    listado = listado + '    <option value="fa fa-cloud-download">&#xf0ed</option>'
    listado = listado + '    <option value="fa fa-cloud-upload">&#xf0ee</option>'
    listado = listado + '    <option value="fa fa-cny">&#xf157</option>'
    listado = listado + '    <option value="fa fa-code">&#xf121</option>'
    listado = listado + '    <option value="fa fa-code-fork">&#xf126</option>'
    listado = listado + '    <option value="fa fa-codepen">&#xf1cb</option>'
    listado = listado + '    <option value="fa fa-coffee">&#xf0f4</option>'
    listado = listado + '    <option value="fa fa-cog">&#xf013</option>'
    listado = listado + '    <option value="fa fa-cogs">&#xf085</option>'
    listado = listado + '    <option value="fa fa-columns">&#xf0db</option>'
    listado = listado + '    <option value="fa fa-comment">&#xf075</option>'
    listado = listado + '    <option value="fa fa-comment-o">&#xf0e5</option>'
    listado = listado + '    <option value="fa fa-commenting">&#xf27a</option>'
    listado = listado + '    <option value="fa fa-commenting-o">&#xf27b</option>'
    listado = listado + '    <option value="fa fa-comments">&#xf086</option>'
    listado = listado + '    <option value="fa fa-comments-o">&#xf0e6</option>'
    listado = listado + '    <option value="fa fa-compass">&#xf14e</option>'
    listado = listado + '    <option value="fa fa-compress">&#xf066</option>'
    listado = listado + '    <option value="fa fa-connectdevelop">&#xf20e</option>'
    listado = listado + '    <option value="fa fa-contao">&#xf26d</option>'
    listado = listado + '    <option value="fa fa-copy">&#xf0c5</option>'
    listado = listado + '    <option value="fa fa-copyright">&#xf1f9</option>'
    listado = listado + '    <option value="fa fa-creative-commons">&#xf25e</option>'
    listado = listado + '    <option value="fa fa-credit-card">&#xf09d</option>'
    listado = listado + '    <option value="fa fa-crop">&#xf125</option>'
    listado = listado + '    <option value="fa fa-crosshairs">&#xf05b</option>'
    listado = listado + '    <option value="fa fa-css3">&#xf13c</option>'
    listado = listado + '    <option value="fa fa-cube">&#xf1b2</option>'
    listado = listado + '    <option value="fa fa-cubes">&#xf1b3</option>'
    listado = listado + '    <option value="fa fa-cut">&#xf0c4</option>'
    listado = listado + '    <option value="fa fa-cutlery">&#xf0f5</option>'
    listado = listado + '    <option value="fa fa-dashboard">&#xf0e4</option>'
    listado = listado + '    <option value="fa fa-dashcube">&#xf210</option>'
    listado = listado + '    <option value="fa fa-database">&#xf1c0</option>'
    listado = listado + '    <option value="fa fa-dedent">&#xf03b</option>'
    listado = listado + '    <option value="fa fa-delicious">&#xf1a5</option>'
    listado = listado + '    <option value="fa fa-desktop">&#xf108</option>'
    listado = listado + '    <option value="fa fa-deviantart">&#xf1bd</option>'
    listado = listado + '    <option value="fa fa-diamond">&#xf219</option>'
    listado = listado + '    <option value="fa fa-digg">&#xf1a6</option>'
    listado = listado + '    <option value="fa fa-dollar">&#xf155</option>'
    listado = listado + '    <option value="fa fa-download">&#xf019</option>'
    listado = listado + '    <option value="fa fa-dribbble">&#xf17d</option>'
    listado = listado + '    <option value="fa fa-dropbox">&#xf16b</option>'
    listado = listado + '    <option value="fa fa-drupal">&#xf1a9</option>'
    listado = listado + '    <option value="fa fa-edit">&#xf044</option>'
    listado = listado + '    <option value="fa fa-eject">&#xf052</option>'
    listado = listado + '    <option value="fa fa-ellipsis-h">&#xf141</option>'
    listado = listado + '    <option value="fa fa-ellipsis-v">&#xf142</option>'
    listado = listado + '    <option value="fa fa-empire">&#xf1d1</option>'
    listado = listado + '    <option value="fa fa-envelope">&#xf0e0</option>'
    listado = listado + '    <option value="fa fa-envelope-o">&#xf003</option>'
    listado = listado + '    <option value="fa fa-eur">&#xf153</option>'
    listado = listado + '    <option value="fa fa-euro">&#xf153</option>'
    listado = listado + '    <option value="fa fa-exchange">&#xf0ec</option>'
    listado = listado + '    <option value="fa fa-exclamation">&#xf12a</option>'
    listado = listado + '    <option value="fa fa-exclamation-circle">&#xf06a</option>'
    listado = listado + '    <option value="fa fa-exclamation-triangle">&#xf071</option>'
    listado = listado + '    <option value="fa fa-expand">&#xf065</option>'
    listado = listado + '    <option value="fa fa-expeditedssl">&#xf23e</option>'
    listado = listado + '    <option value="fa fa-external-link">&#xf08e</option>'
    listado = listado + '    <option value="fa fa-external-link-square">&#xf14c</option>'
    listado = listado + '    <option value="fa fa-eye">&#xf06e</option>'
    listado = listado + '    <option value="fa fa-eye-slash">&#xf070</option>'
    listado = listado + '    <option value="fa fa-eyedropper">&#xf1fb</option>'
    listado = listado + '    <option value="fa fa-facebook">&#xf09a</option>'
    listado = listado + '    <option value="fa fa-facebook-f">&#xf09a</option>'
    listado = listado + '    <option value="fa fa-facebook-official">&#xf230</option>'
    listado = listado + '    <option value="fa fa-facebook-square">&#xf082</option>'
    listado = listado + '    <option value="fa fa-fast-backward">&#xf049</option>'
    listado = listado + '    <option value="fa fa-fast-forward">&#xf050</option>'
    listado = listado + '    <option value="fa fa-fax">&#xf1ac</option>'
    listado = listado + '    <option value="fa fa-feed">&#xf09e</option>'
    listado = listado + '    <option value="fa fa-female">&#xf182</option>'
    listado = listado + '    <option value="fa fa-fighter-jet">&#xf0fb</option>'
    listado = listado + '    <option value="fa fa-file">&#xf15b</option>'
    listado = listado + '    <option value="fa fa-file-archive-o">&#xf1c6</option>'
    listado = listado + '    <option value="fa fa-file-audio-o">&#xf1c7</option>'
    listado = listado + '    <option value="fa fa-file-code-o">&#xf1c9</option>'
    listado = listado + '    <option value="fa fa-file-excel-o">&#xf1c3</option>'
    listado = listado + '    <option value="fa fa-file-image-o">&#xf1c5</option>'
    listado = listado + '    <option value="fa fa-file-movie-o">&#xf1c8</option>'
    listado = listado + '    <option value="fa fa-file-o">&#xf016</option>'
    listado = listado + '    <option value="fa fa-file-pdf-o">&#xf1c1</option>'
    listado = listado + '    <option value="fa fa-file-photo-o">&#xf1c5</option>'
    listado = listado + '    <option value="fa fa-file-picture-o">&#xf1c5</option>'
    listado = listado + '    <option value="fa fa-file-powerpoint-o">&#xf1c4</option>'
    listado = listado + '    <option value="fa fa-file-sound-o">&#xf1c7</option>'
    listado = listado + '    <option value="fa fa-file-text">&#xf15c</option>'
    listado = listado + '    <option value="fa fa-file-text-o">&#xf0f6</option>'
    listado = listado + '    <option value="fa fa-file-video-o">&#xf1c8</option>'
    listado = listado + '    <option value="fa fa-file-word-o">&#xf1c2</option>'
    listado = listado + '    <option value="fa fa-file-zip-o">&#xf1c6</option>'
    listado = listado + '    <option value="fa fa-files-o">&#xf0c5</option>'
    listado = listado + '    <option value="fa fa-film">&#xf008</option>'
    listado = listado + '    <option value="fa fa-filter">&#xf0b0</option>'
    listado = listado + '    <option value="fa fa-fire">&#xf06d</option>'
    listado = listado + '    <option value="fa fa-fire-extinguisher">&#xf134</option>'
    listado = listado + '    <option value="fa fa-firefox">&#xf269</option>'
    listado = listado + '    <option value="fa fa-flag">&#xf024</option>'
    listado = listado + '    <option value="fa fa-flag-checkered">&#xf11e</option>'
    listado = listado + '    <option value="fa fa-flag-o">&#xf11d</option>'
    listado = listado + '    <option value="fa fa-flash">&#xf0e7</option>'
    listado = listado + '    <option value="fa fa-flask">&#xf0c3</option>'
    listado = listado + '    <option value="fa fa-flickr">&#xf16e</option>'
    listado = listado + '    <option value="fa fa-floppy-o">&#xf0c7</option>'
    listado = listado + '    <option value="fa fa-folder">&#xf07b</option>'
    listado = listado + '    <option value="fa fa-folder-o">&#xf114</option>'
    listado = listado + '    <option value="fa fa-folder-open">&#xf07c</option>'
    listado = listado + '    <option value="fa fa-folder-open-o">&#xf115</option>'
    listado = listado + '    <option value="fa fa-font">&#xf031</option>'
    listado = listado + '    <option value="fa fa-fonticons">&#xf280</option>'
    listado = listado + '    <option value="fa fa-forumbee">&#xf211</option>'
    listado = listado + '    <option value="fa fa-forward">&#xf04e</option>'
    listado = listado + '    <option value="fa fa-foursquare">&#xf180</option>'
    listado = listado + '    <option value="fa fa-frown-o">&#xf119</option>'
    listado = listado + '    <option value="fa fa-futbol-o">&#xf1e3</option>'
    listado = listado + '    <option value="fa fa-gamepad">&#xf11b</option>'
    listado = listado + '    <option value="fa fa-gavel">&#xf0e3</option>'
    listado = listado + '    <option value="fa fa-gbp">&#xf154</option>'
    listado = listado + '    <option value="fa fa-ge">&#xf1d1</option>'
    listado = listado + '    <option value="fa fa-gear">&#xf013</option>'
    listado = listado + '    <option value="fa fa-gears">&#xf085</option>'
    listado = listado + '    <option value="fa fa-genderless">&#xf22d</option>'
    listado = listado + '    <option value="fa fa-get-pocket">&#xf265</option>'
    listado = listado + '    <option value="fa fa-gg">&#xf260</option>'
    listado = listado + '    <option value="fa fa-gg-circle">&#xf261</option>'
    listado = listado + '    <option value="fa fa-gift">&#xf06b</option>'
    listado = listado + '    <option value="fa fa-git">&#xf1d3</option>'
    listado = listado + '    <option value="fa fa-git-square">&#xf1d2</option>'
    listado = listado + '    <option value="fa fa-github">&#xf09b</option>'
    listado = listado + '    <option value="fa fa-github-alt">&#xf113</option>'
    listado = listado + '    <option value="fa fa-github-square">&#xf092</option>'
    listado = listado + '    <option value="fa fa-gittip">&#xf184</option>'
    listado = listado + '    <option value="fa fa-glass">&#xf000</option>'
    listado = listado + '    <option value="fa fa-globe">&#xf0ac</option>'
    listado = listado + '    <option value="fa fa-google">&#xf1a0</option>'
    listado = listado + '    <option value="fa fa-google-plus">&#xf0d5</option>'
    listado = listado + '    <option value="fa fa-google-plus-square">&#xf0d4</option>'
    listado = listado + '    <option value="fa fa-google-wallet">&#xf1ee</option>'
    listado = listado + '    <option value="fa fa-graduation-cap">&#xf19d</option>'
    listado = listado + '    <option value="fa fa-gratipay">&#xf184</option>'
    listado = listado + '    <option value="fa fa-group">&#xf0c0</option>'
    listado = listado + '    <option value="fa fa-h-square">&#xf0fd</option>'
    listado = listado + '    <option value="fa fa-hacker-news">&#xf1d4</option>'
    listado = listado + '    <option value="fa fa-hand-grab-o">&#xf255</option>'
    listado = listado + '    <option value="fa fa-hand-lizard-o">&#xf258</option>'
    listado = listado + '    <option value="fa fa-hand-o-down">&#xf0a7</option>'
    listado = listado + '    <option value="fa fa-hand-o-left">&#xf0a5</option>'
    listado = listado + '    <option value="fa fa-hand-o-right">&#xf0a4</option>'
    listado = listado + '    <option value="fa fa-hand-o-up">&#xf0a6</option>'
    listado = listado + '    <option value="fa fa-hand-paper-o">&#xf256</option>'
    listado = listado + '    <option value="fa fa-hand-peace-o">&#xf25b</option>'
    listado = listado + '    <option value="fa fa-hand-pointer-o">&#xf25a</option>'
    listado = listado + '    <option value="fa fa-hand-rock-o">&#xf255</option>'
    listado = listado + '    <option value="fa fa-hand-scissors-o">&#xf257</option>'
    listado = listado + '    <option value="fa fa-hand-spock-o">&#xf259</option>'
    listado = listado + '    <option value="fa fa-hand-stop-o">&#xf256</option>'
    listado = listado + '    <option value="fa fa-hdd-o">&#xf0a0</option>'
    listado = listado + '    <option value="fa fa-header">&#xf1dc</option>'
    listado = listado + '    <option value="fa fa-headphones">&#xf025</option>'
    listado = listado + '    <option value="fa fa-heart">&#xf004</option>'
    listado = listado + '    <option value="fa fa-heart-o">&#xf08a</option>'
    listado = listado + '    <option value="fa fa-heartbeat">&#xf21e</option>'
    listado = listado + '    <option value="fa fa-history">&#xf1da</option>'
    listado = listado + '    <option value="fa fa-home">&#xf015</option>'
    listado = listado + '    <option value="fa fa-hospital-o">&#xf0f8</option>'
    listado = listado + '    <option value="fa fa-hotel">&#xf236</option>'
    listado = listado + '    <option value="fa fa-hourglass">&#xf254</option>'
    listado = listado + '    <option value="fa fa-hourglass-1">&#xf251</option>'
    listado = listado + '    <option value="fa fa-hourglass-2">&#xf252</option>'
    listado = listado + '    <option value="fa fa-hourglass-3">&#xf253</option>'
    listado = listado + '    <option value="fa fa-hourglass-end">&#xf253</option>'
    listado = listado + '    <option value="fa fa-hourglass-half">&#xf252</option>'
    listado = listado + '    <option value="fa fa-hourglass-o">&#xf250</option>'
    listado = listado + '    <option value="fa fa-hourglass-start">&#xf251</option>'
    listado = listado + '    <option value="fa fa-houzz">&#xf27c</option>'
    listado = listado + '    <option value="fa fa-html5">&#xf13b</option>'
    listado = listado + '    <option value="fa fa-i-cursor">&#xf246</option>'
    listado = listado + '    <option value="fa fa-ils">&#xf20b</option>'
    listado = listado + '    <option value="fa fa-image">&#xf03e</option>'
    listado = listado + '    <option value="fa fa-inbox">&#xf01c</option>'
    listado = listado + '    <option value="fa fa-indent">&#xf03c</option>'
    listado = listado + '    <option value="fa fa-industry">&#xf275</option>'
    listado = listado + '    <option value="fa fa-info">&#xf129</option>'
    listado = listado + '    <option value="fa fa-info-circle">&#xf05a</option>'
    listado = listado + '    <option value="fa fa-inr">&#xf156</option>'
    listado = listado + '    <option value="fa fa-instagram">&#xf16d</option>'
    listado = listado + '    <option value="fa fa-institution">&#xf19c</option>'
    listado = listado + '    <option value="fa fa-internet-explorer">&#xf26b</option>'
    listado = listado + '    <option value="fa fa-intersex">&#xf224</option>'
    listado = listado + '    <option value="fa fa-ioxhost">&#xf208</option>'
    listado = listado + '    <option value="fa fa-italic">&#xf033</option>'
    listado = listado + '    <option value="fa fa-joomla">&#xf1aa</option>'
    listado = listado + '    <option value="fa fa-jpy">&#xf157</option>'
    listado = listado + '    <option value="fa fa-jsfiddle">&#xf1cc</option>'
    listado = listado + '    <option value="fa fa-key">&#xf084</option>'
    listado = listado + '    <option value="fa fa-keyboard-o">&#xf11c</option>'
    listado = listado + '    <option value="fa fa-krw">&#xf159</option>'
    listado = listado + '    <option value="fa fa-language">&#xf1ab</option>'
    listado = listado + '    <option value="fa fa-laptop">&#xf109</option>'
    listado = listado + '    <option value="fa fa-lastfm">&#xf202</option>'
    listado = listado + '    <option value="fa fa-lastfm-square">&#xf203</option>'
    listado = listado + '    <option value="fa fa-leaf">&#xf06c</option>'
    listado = listado + '    <option value="fa fa-leanpub">&#xf212</option>'
    listado = listado + '    <option value="fa fa-legal">&#xf0e3</option>'
    listado = listado + '    <option value="fa fa-lemon-o">&#xf094</option>'
    listado = listado + '    <option value="fa fa-level-down">&#xf149</option>'
    listado = listado + '    <option value="fa fa-level-up">&#xf148</option>'
    listado = listado + '    <option value="fa fa-life-bouy">&#xf1cd</option>'
    listado = listado + '    <option value="fa fa-life-buoy">&#xf1cd</option>'
    listado = listado + '    <option value="fa fa-life-ring">&#xf1cd</option>'
    listado = listado + '    <option value="fa fa-life-saver">&#xf1cd</option>'
    listado = listado + '    <option value="fa fa-lightbulb-o">&#xf0eb</option>'
    listado = listado + '    <option value="fa fa-line-chart">&#xf201</option>'
    listado = listado + '    <option value="fa fa-link">&#xf0c1</option>'
    listado = listado + '    <option value="fa fa-linkedin">&#xf0e1</option>'
    listado = listado + '    <option value="fa fa-linkedin-square">&#xf08c</option>'
    listado = listado + '    <option value="fa fa-linux">&#xf17c</option>'
    listado = listado + '    <option value="fa fa-list">&#xf03a</option>'
    listado = listado + '    <option value="fa fa-list-alt">&#xf022</option>'
    listado = listado + '    <option value="fa fa-list-ol">&#xf0cb</option>'
    listado = listado + '    <option value="fa fa-list-ul">&#xf0ca</option>'
    listado = listado + '    <option value="fa fa-location-arrow">&#xf124</option>'
    listado = listado + '    <option value="fa fa-lock">&#xf023</option>'
    listado = listado + '    <option value="fa fa-long-arrow-down">&#xf175</option>'
    listado = listado + '    <option value="fa fa-long-arrow-left">&#xf177</option>'
    listado = listado + '    <option value="fa fa-long-arrow-right">&#xf178</option>'
    listado = listado + '    <option value="fa fa-long-arrow-up">&#xf176</option>'
    listado = listado + '    <option value="fa fa-magic">&#xf0d0</option>'
    listado = listado + '    <option value="fa fa-magnet">&#xf076</option>'
    listado = listado + '    <option value="fa fa-mars-stroke-v">&#xf22a</option>'
    listado = listado + '    <option value="fa fa-maxcdn">&#xf136</option>'
    listado = listado + '    <option value="fa fa-meanpath">&#xf20c</option>'
    listado = listado + '    <option value="fa fa-medium">&#xf23a</option>'
    listado = listado + '    <option value="fa fa-medkit">&#xf0fa</option>'
    listado = listado + '    <option value="fa fa-meh-o">&#xf11a</option>'
    listado = listado + '    <option value="fa fa-mercury">&#xf223</option>'
    listado = listado + '    <option value="fa fa-microphone">&#xf130</option>'
    listado = listado + '    <option value="fa fa-mobile">&#xf10b</option>'
    listado = listado + '    <option value="fa fa-motorcycle">&#xf21c</option>'
    listado = listado + '    <option value="fa fa-mouse-pointer">&#xf245</option>'
    listado = listado + '    <option value="fa fa-music">&#xf001</option>'
    listado = listado + '    <option value="fa fa-navicon">&#xf0c9</option>'
    listado = listado + '    <option value="fa fa-neuter">&#xf22c</option>'
    listado = listado + '    <option value="fa fa-newspaper-o">&#xf1ea</option>'
    listado = listado + '    <option value="fa fa-opencart">&#xf23d</option>'
    listado = listado + '    <option value="fa fa-openid">&#xf19b</option>'
    listado = listado + '    <option value="fa fa-opera">&#xf26a</option>'
    listado = listado + '    <option value="fa fa-outdent">&#xf03b</option>'
    listado = listado + '    <option value="fa fa-pagelines">&#xf18c</option>'
    listado = listado + '    <option value="fa fa-paper-plane-o">&#xf1d9</option>'
    listado = listado + '    <option value="fa fa-paperclip">&#xf0c6</option>'
    listado = listado + '    <option value="fa fa-paragraph">&#xf1dd</option>'
    listado = listado + '    <option value="fa fa-paste">&#xf0ea</option>'
    listado = listado + '    <option value="fa fa-pause">&#xf04c</option>'
    listado = listado + '    <option value="fa fa-paw">&#xf1b0</option>'
    listado = listado + '    <option value="fa fa-paypal">&#xf1ed</option>'
    listado = listado + '    <option value="fa fa-pencil">&#xf040</option>'
    listado = listado + '    <option value="fa fa-pencil-square-o">&#xf044</option>'
    listado = listado + '    <option value="fa fa-phone">&#xf095</option>'
    listado = listado + '    <option value="fa fa-photo">&#xf03e</option>'
    listado = listado + '    <option value="fa fa-picture-o">&#xf03e</option>'
    listado = listado + '    <option value="fa fa-pie-chart">&#xf200</option>'
    listado = listado + '    <option value="fa fa-pied-piper">&#xf1a7</option>'
    listado = listado + '    <option value="fa fa-pied-piper-alt">&#xf1a8</option>'
    listado = listado + '    <option value="fa fa-pinterest">&#xf0d2</option>'
    listado = listado + '    <option value="fa fa-pinterest-p">&#xf231</option>'
    listado = listado + '    <option value="fa fa-pinterest-square">&#xf0d3</option>'
    listado = listado + '    <option value="fa fa-plane">&#xf072</option>'
    listado = listado + '    <option value="fa fa-play">&#xf04b</option>'
    listado = listado + '    <option value="fa fa-play-circle">&#xf144</option>'
    listado = listado + '    <option value="fa fa-play-circle-o">&#xf01d</option>'
    listado = listado + '    <option value="fa fa-plug">&#xf1e6</option>'
    listado = listado + '    <option value="fa fa-plus">&#xf067</option>'
    listado = listado + '    <option value="fa fa-plus-circle">&#xf055</option>'
    listado = listado + '    <option value="fa fa-plus-square">&#xf0fe</option>'
    listado = listado + '    <option value="fa fa-plus-square-o">&#xf196</option>'
    listado = listado + '    <option value="fa fa-power-off">&#xf011</option>'
    listado = listado + '    <option value="fa fa-print">&#xf02f</option>'
    listado = listado + '    <option value="fa fa-puzzle-piece">&#xf12e</option>'
    listado = listado + '    <option value="fa fa-qq">&#xf1d6</option>'
    listado = listado + '    <option value="fa fa-qrcode">&#xf029</option>'
    listado = listado + '    <option value="fa fa-question">&#xf128</option>'
    listado = listado + '    <option value="fa fa-question-circle">&#xf059</option>'
    listado = listado + '    <option value="fa fa-quote-left">&#xf10d</option>'
    listado = listado + '    <option value="fa fa-quote-right">&#xf10e</option>'
    listado = listado + '    <option value="fa fa-ra">&#xf1d0</option>'
    listado = listado + '    <option value="fa fa-random">&#xf074</option>'
    listado = listado + '    <option value="fa fa-rebel">&#xf1d0</option>'
    listado = listado + '    <option value="fa fa-recycle">&#xf1b8</option>'
    listado = listado + '    <option value="fa fa-reddit">&#xf1a1</option>'
    listado = listado + '    <option value="fa fa-reddit-square">&#xf1a2</option>'
    listado = listado + '    <option value="fa fa-refresh">&#xf021</option>'
    listado = listado + '    <option value="fa fa-registered">&#xf25d</option>'
    listado = listado + '    <option value="fa fa-remove">&#xf00d</option>'
    listado = listado + '    <option value="fa fa-renren">&#xf18b</option>'
    listado = listado + '    <option value="fa fa-reorder">&#xf0c9</option>'
    listado = listado + '    <option value="fa fa-repeat">&#xf01e</option>'
    listado = listado + '    <option value="fa fa-reply">&#xf112</option>'
    listado = listado + '    <option value="fa fa-reply-all">&#xf122</option>'
    listado = listado + '    <option value="fa fa-retweet">&#xf079</option>'
    listado = listado + '    <option value="fa fa-rmb">&#xf157</option>'
    listado = listado + '    <option value="fa fa-road">&#xf018</option>'
    listado = listado + '    <option value="fa fa-rocket">&#xf135</option>'
    listado = listado + '    <option value="fa fa-rotate-left">&#xf0e2</option>'
    listado = listado + '    <option value="fa fa-rotate-right">&#xf01e</option>'
    listado = listado + '    <option value="fa fa-rouble">&#xf158</option>'
    listado = listado + '    <option value="fa fa-rss">&#xf09e</option>'
    listado = listado + '    <option value="fa fa-rss-square">&#xf143</option>'
    listado = listado + '    <option value="fa fa-rub">&#xf158</option>'
    listado = listado + '    <option value="fa fa-ruble">&#xf158</option>'
    listado = listado + '    <option value="fa fa-rupee">&#xf156</option>'
    listado = listado + '    <option value="fa fa-safari">&#xf267</option>'
    listado = listado + '    <option value="fa fa-sliders">&#xf1de</option>'
    listado = listado + '    <option value="fa fa-slideshare">&#xf1e7</option>'
    listado = listado + '    <option value="fa fa-smile-o">&#xf118</option>'
    listado = listado + '    <option value="fa fa-sort-asc">&#xf0de</option>'
    listado = listado + '    <option value="fa fa-sort-desc">&#xf0dd</option>'
    listado = listado + '    <option value="fa fa-sort-down">&#xf0dd</option>'
    listado = listado + '    <option value="fa fa-spinner">&#xf110</option>'
    listado = listado + '    <option value="fa fa-spoon">&#xf1b1</option>'
    listado = listado + '    <option value="fa fa-spotify">&#xf1bc</option>'
    listado = listado + '    <option value="fa fa-square">&#xf0c8</option>'
    listado = listado + '    <option value="fa fa-square-o">&#xf096</option>'
    listado = listado + '    <option value="fa fa-star">&#xf005</option>'
    listado = listado + '    <option value="fa fa-star-half">&#xf089</option>'
    listado = listado + '    <option value="fa fa-stop">&#xf04d</option>'
    listado = listado + '    <option value="fa fa-subscript">&#xf12c</option>'
    listado = listado + '    <option value="fa fa-tablet">&#xf10a</option>'
    listado = listado + '    <option value="fa fa-tachometer">&#xf0e4</option>'
    listado = listado + '    <option value="fa fa-tag">&#xf02b</option>'
    listado = listado + '    <option value="fa fa-tags">&#xf02c</option>'
    
    return listado
}
  