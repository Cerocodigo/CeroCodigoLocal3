function traer_cond(temp_pestalla, t_pkestado) {

  $.ajax({
    type: 'POST',
    url: '/adm_estados_cond',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'temp_pestalla': temp_pestalla, 't_pkestado': t_pkestado },
    success: function (Response) {




      html_pdf = '<div class="col-md-12">'

      html_pdf = html_pdf + '<div class="col-md-12">'

      html_pdf = html_pdf + '<button type="button" onclick="actualizar_estado(' + Response['list_estados'][0]['pkweb_estados_doc'] + ',' + temp_pestalla + ', ' + pkmodulo + ', 1)" class="btn bg-green btn-flat margin"><span> Grabar Cambios </span></button>' + ''
      html_pdf = html_pdf + '<button type="button" onclick="actualizar_estado(' + Response['list_estados'][0]['pkweb_estados_doc'] + ',' + temp_pestalla + ', ' + pkmodulo + ', 0)" class="btn bg-red btn-flat margin"><span> Eliminar </span></button>' + ''
      html_pdf = html_pdf + '</div>'

      html_pdf = html_pdf + '<div class="col-md-12">'


      html_pdf = html_pdf + '<div class="col-sm-4"><label class="control-label for=" id"="" style="font-size: 12px;font-weight: bold;">PkEstado</label><input readonly="readonly" type="text" class="form-control col-sm-4" value="' + Response['list_estados'][0]['pkweb_estados_doc'] + '" style="height: 25px;font-size: 11px;"></div>'

      html_pdf = html_pdf + '<div class="col-sm-4"><label class="control-label for=" id"="" style="font-size: 12px;font-weight: bold;">Display</label><input type="text" id="estado_display_' + temp_pestalla + '" class="form-control col-sm-4" value="' + Response['list_estados'][0]['display'] + '" style="height: 25px;font-size: 11px;"></div>'

      html_pdf = html_pdf + '<div class="col-sm-4"><label class="control-label for=" id"="" style="font-size: 12px;font-weight: bold;">Estado Inicial</label><input type="text" id="estado_estado_inicial_' + temp_pestalla + '" class="form-control col-sm-4" value="' + Response['list_estados'][0]['estado_inicial'] + '" style="height: 25px;font-size: 11px;"></div>'
      html_pdf = html_pdf + '<div class="col-sm-4"><label class="control-label for=" id"="" style="font-size: 12px;font-weight: bold;">Estado Final</label><input type="text" id="estado_estado_final_' + temp_pestalla + '" class="form-control col-sm-4" value="' + Response['list_estados'][0]['estado_final'] + '" style="height: 25px;font-size: 11px;"></div>'
      html_pdf = html_pdf + '<div class="col-sm-4"><label class="control-label for=" id"="" style="font-size: 12px;font-weight: bold;">Estilo</label><input type="text" id="estado_color_' + temp_pestalla + '" class="form-control col-sm-4" value="' + Response['list_estados'][0]['color'] + '" style="height: 25px;font-size: 11px;"></div>'
      html_pdf = html_pdf + '<div class="col-sm-4"><label class="control-label for=" id"="" style="font-size: 12px;font-weight: bold;">Usuario</label>'
      html_pdf = html_pdf + '<input type="hidden" id="estado_usuarios_' + temp_pestalla + '" class="form-control col-sm-4" value="' + Response['list_estados'][0]['usuarios'] + '" style="height: 25px;font-size: 11px;">'


      slip_user = Response['list_estados'][0]['usuarios'].split(',')





      html_pdf = html_pdf + '<div class="form-group" id="estado_usuarios_lista_' + temp_pestalla + '">'

      for (qw = 0; qw < Response['list_usuario'].length; qw++) {
        est_checked = false

        for (qw2 = 0; qw2 < slip_user.length; qw2++) {

          if ('(' + Response['list_usuario'][qw]['Usuario'].toString().toUpperCase() + ')' == slip_user[qw2].toString().toUpperCase()) {
            est_checked = true

          }
        }
        if (est_checked == true) {
          html_pdf = html_pdf + '<div class="checkbox"><label><input type="checkbox" onchange="actualizar_user_estado(' + temp_pestalla + ')" checked><span class="checkbox-material"><span class="check"></span></span>' + Response['list_usuario'][qw]['Usuario'].toString() + '</label></div>'
        } else {
          html_pdf = html_pdf + '<div class="checkbox"><label><input type="checkbox" onchange="actualizar_user_estado(' + temp_pestalla + ')"><span class="checkbox-material"><span class="check"></span></span>' + Response['list_usuario'][qw]['Usuario'].toString() + '</label></div>'
        }
      }


      html_pdf = html_pdf + '</div>'



      html_pdf = html_pdf + '</div>'





      html_pdf = html_pdf + '</div>'

      html_pdf = html_pdf + '<div class="col-md-6">'
      html_pdf = html_pdf + '</div>'

      html_pdf = html_pdf + '</div>'


      $('#lista_estados__detalle_' + temp_pestalla).html(html_pdf);






    }
  });
}

//ddddddddddddddddddddddddddddddddddddddd




function Editar_estados(temp_pestalla) {

  var cc_tabla = dict_pestalla["p-" + temp_pestalla]


  pkmodulo = dict_pestalla["p-" + temp_pestalla]["tabla"][0]["PkModulo"]

  var id_tab = pkmodulo
  tipo = 'Nuevo'

  $.ajax({
    type: 'POST',
    url: '/adm_estados',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'pkmodulo': pkmodulo },
    success: function (Response) {




      html_pdf = '<div class="col-md-12"><div class="row" id="lista_estados_' + temp_pestalla + '">'

      for (qw = 0; qw < Response['list_estados'].length; qw++) {
        html_pdf = html_pdf + '<button type="button" id="btn_estado_' + Response['list_estados'][qw]['pkweb_estados_doc'] + '" onclick="traer_cond(' + temp_pestalla + ', ' + Response['list_estados'][qw]['pkweb_estados_doc'] + ')" class="btn bg-blue btn-flat margin"><span>' + Response['list_estados'][qw]['display'] + '</span></button>' + ''

      }

      html_pdf = html_pdf + '<button type="button" id="" onclick="nueva_estado(' + temp_pestalla + ', ' + pkmodulo + ')" class="btn bg-green btn-flat margin"><span> Crear Nuevo </span></button>' + ''
      html_pdf = html_pdf + '</div>'


      html_pdf = html_pdf + '</div>'

      html_pdf = html_pdf + '<div class="col-md-12"><div class="row" id="lista_estados__detalle_' + temp_pestalla + '">'
      html_pdf = html_pdf + ''

      html_pdf = html_pdf + '</div></div>'

      $('#rr' + temp_pestalla).html(html_pdf);
    }
  });
}

function actualizar_user_estado(temp_pestalla) {
  lista_div = document.getElementById('estado_usuarios_lista_' + temp_pestalla)
  listado_tetx = ''
  for (qw = 0; qw < lista_div.childElementCount; qw++) {
    if (lista_div.children[qw].children[0].children[0].checked == true) {
      listado_tetx = listado_tetx + '(' + lista_div.children[qw].children[0].innerText + '),'
    }
  }

  text_div = document.getElementById('estado_usuarios_' + temp_pestalla)
  text_div.value = listado_tetx.substring(0, listado_tetx.length - 1)

}

function actualizar_estado(t_pkestado, temp_pestalla, t_PkModulo, modo) {

  var t_estado_display = document.getElementById('estado_display_' + temp_pestalla).value
  var t_estado_estado_inicial = document.getElementById('estado_estado_inicial_' + temp_pestalla).value
  var t_estado_estado_final = document.getElementById('estado_estado_final_' + temp_pestalla).value
  var t_estado_color = document.getElementById('estado_color_' + temp_pestalla).value
  var t_estado_usuarios = document.getElementById('estado_usuarios_' + temp_pestalla).value



  $.ajax({
    type: 'POST',
    url: '/adm_estados_actualizar',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 't_pkestado': t_pkestado, 'temp_pestalla': temp_pestalla, 't_PkModulo': t_PkModulo, 'modo': modo, 't_estado_display': t_estado_display, 't_estado_estado_inicial': t_estado_estado_inicial, 't_estado_estado_final': t_estado_estado_final, 't_estado_color': t_estado_color, 't_estado_usuarios': t_estado_usuarios },
    success: function (Response) {


      list_iv = document.getElementById('btn_estado_' + Response['t_pkestado'])
      if (modo == 0) {
        list_iv.remove()
        $('#lista_estados__detalle_' + temp_pestalla).html('');

      }
      if (modo == 1) {
        list_iv.innerHTML = t_estado_display
        list_iv.click()
      }

    }
  });

}


function nueva_estado(temp_pestalla, t_PkModulo) {


  $.ajax({
    type: 'POST',
    url: '/adm_estados_nuevo',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'temp_pestalla': temp_pestalla, 't_PkModulo': t_PkModulo },
    success: function (Response) {

      list_iv = document.getElementById('lista_estados_' + Response['temp_pestalla'])
      list_iv.innerHTML = '<button type="button" id="btn_estado_' + Response['ultimo_estado'][0]['pkweb_estados_doc'] + '" onclick="traer_cond(' + Response['temp_pestalla'] + ', ' + Response['ultimo_estado'][0]['pkweb_estados_doc'] + ')" class="btn bg-blue btn-flat margin"><span>' + Response['ultimo_estado'][0]['display'] + '</span></button>' + '' + list_iv.innerHTML


    }
  });
}


function filtro_en_paneles(este, pkpanel, pkgrupo){

  if(este.value != ''){
    valor = este.value.trim().split(',')

    grid = este.parentElement.parentElement.parentElement.children[0].children[1].children[0].children[1].children[0].children[1]
    for (x = 0; x < grid.childElementCount; x++) {
      entro = false
      hits = 0
      for (y = 0; y < grid.childNodes[x].childElementCount; y++) {
        t = grid.childNodes[x].childNodes[y].children[0].value
        if(t != undefined){
          for (z = 0; z < valor.length; z++) {
            if(t.toLowerCase().search(valor[z].toLowerCase()) >= 0){
              hits = hits + 1
            }
          }
        }
        if(hits ==  valor.length){
          entro = true
          break
        }

      }
      if(entro == true){
        if(grid.childNodes[x].style.display == 'none'){
          grid.childNodes[x].style.display = ''
        }
      }
      if(entro == false){
        if(grid.childNodes[x].style.display == ''){
          grid.childNodes[x].style.display = 'None'
        }
      }
    }
  }
}

function cambio_estado_panel(pkmodulo, pkregistro, pkestado) {

    $.ajax({
      type: 'POST',
      url: '/cambio_estado',
      data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'pkmodulo': pkmodulo, 'pkregistro': pkregistro, 'pkestado': pkestado },
      beforeSend: function () { },
      success: function (Response) {
        alert(Response['msg'])

        for (x2 = 0; x2 < Object.keys(Response['registro'][0]).length; x2++) {
          var campo = document.getElementById(Object.keys(Response['registro'][0])[x2]+'fff'+Response['tabla']+ 'fff'+Response['pkregistro'])
          if(campo != null){
            if(campo.type == 'text'){
              campo.value = Response['registro'][0][Object.keys(Response['registro'][0])[x2]]
            }
            if(campo.type == 'file'){
              campo.parentNode.childNodes[1].innerHTML = '<a href="/media/archivos/'+web_Id_empresa+'/'+Response['registro'][0][Object.keys(Response['registro'][0])[x2]]+'" target="_blank">'+Response['registro'][0][Object.keys(Response['registro'][0])[x2]]+'</a>'

            }
            if(campo.type == 'select-one'){
              campo.value = Response['registro'][0][Object.keys(Response['registro'][0])[x2]]
            }
            if(campo.type == ''){}
            
          }
        }
      }
    });
  
  }
function paneles_taraer(pkpanel, pkgrupo, xE, pkmodulo) {

    $.ajax({
      type: 'POST',
      url: '/paneles_items',
      data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'pkpanel': pkpanel, 'pkgrupo': pkgrupo, 'xE': xE, 'pkmodulo': pkmodulo },
      beforeSend: function () {
        var panel_est = document.getElementById("intpestados" + xE)
        panel_est.innerHTML = 'Procesando...'
      },
      success: function (Response) {
        new_tap = '<div class="box box-primary">'

        
        new_tap = new_tap + '<div class="box-header with-border"><h3 class="box-title">' + Response["estado"]["nombre"] + '</h3>  <input id="ppanel_filtro'+ pkpanel + '" type="text" class="form-control" onchange="filtro_en_paneles(this, '+ pkpanel + ','+ pkgrupo + ')" style="font-size: 11px;"> <div class="box-tools"> <button type="button" class="btn btn-box-tool" data-widget="collapse" onClick="paneles_taraer(' + pkpanel + ', ' + pkgrupo + ', ' + xE + ', ' + pkmodulo + ')"><i class="fa fa-fw fa-refresh"></i><div class="ripple-container"></div></button></div></div>'
  
        new_tap = new_tap + '<div class="box-body no-padding"><div class="mailbox-controls">'
        new_tap = new_tap + '<div class="btn-group">'
  
        if (Response["tipo"] == 'tabla') {
  
  
  
  
  
          if (Response["estado"]["nuevo"] == '') {
          } else {
  
            new_tap = new_tap + '<button type="button" class="btn btn-primary" id="est_nu_fff_' + Response["estado"]["Valor"] + '_fff_' + Response["estado"]["Campo"] + '_fff_' + Response["tabla_cab"]["Nombre"] + '", onClick="panel_nuevo(this, ' + pkpanel + ',' + pkgrupo + ',' + xE + ',' + pkmodulo + ' )"><i class="fa fa-plus"> Nuevo </i></button>'
          }
  
          new_tap = new_tap + '</div>'
          new_tap = new_tap + '<div class="table-responsive mailbox-messages" style="height: 500px;"><table class="table table-hover table-striped"><thead>'
          new_tap = new_tap + '<tr>'
          primary_key = ''
          new_tap = new_tap + '<th></th><th></th>'
          lista_visi = Response['estado']['visibles'].split(',')
          visible = false
          dict_visible = {}
  
  
          for (v = 0; v < Response["campos_cab"].length; v++) {
            visible = false
  
            for (cc = 0; cc < lista_visi.length; cc++) {
              if (lista_visi[cc] == Response["campos_cab"][v]["Nombre"]) {
                visible = true
              }
            }
  
            //if(Response["campos_cab"][v]["Visible"] == 'Y'){
            if (visible == true) {
              new_tap = new_tap + '<th>' + Response["campos_cab"][v]["Descripcion"] + '</th>'
              dict_visible[v] = 'S'
            } else {
              new_tap = new_tap + '<th style="display: none;">' + Response["campos_cab"][v]["Descripcion"] + '</th>'
              dict_visible[v] == 'N'
            }
  
          }
          new_tap = new_tap + '</thead><tbody>'
  
          for (v = 0; v < Response["valores_cab"].length; v++) {
            new_tap = new_tap + '<tr>'
            //new_tap = new_tap + '<td><a data-toggle="modal" data-target="#modal-default_panel" style="cursor: pointer;" onClick="panelAbrir(' + Response["valores_cab"][v]["Pk" + Response["tabla_cab"]["Nombre"]] + ', ' + pkmodulo + ')"><i class="fa fa-file-text-o" style="padding-top: 15px;"></i></a></td>'
            new_tap = new_tap + '<td>'
            //new_tap = new_tap + '<a data-toggle="modal" data-target="#modal-default_panel" style="cursor: pointer;" onClick="panelAbrir(' + Response["valores_cab"][v]["Pk" + Response["tabla_cab"]["Nombre"]] + ', ' + pkmodulo + ')"><i class="fa fa-file-text-o" style="padding-top: 15px;"></i></a>'
            new_tap = new_tap + '<a class="btn btn-info" onclick="registro(' + pkmodulo + ',' + Response["valores_cab"][v]["Pk" + Response["tabla_cab"]["Nombre"]] + ',2,-1,0,0)" style="padding: 2px 2px; margin-right: 0px; margin-left: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></a>'
            new_tap = new_tap + '<a class="btn btn-success" onclick="registro(' + pkmodulo + ',' + Response["valores_cab"][v]["Pk" + Response["tabla_cab"]["Nombre"]] + ',1,-1,0,0)" style="padding: 2px 2px; margin-right: 0px; margin-left: 0px;"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a>'

            new_tap = new_tap + '</td>'
  
            new_tap = new_tap + '<td><div class="col-3">'


            // for (e1 = 0; e1 < Response['acc_estados'].length; e1++) {

            //     if (Response["acc_estados"][e1]["estado_inicial"] == Response["valores_cab"][v][Response['acc_estados'][e1]['c_estado']]) {
            //         new_tap = new_tap + '<button class="' + Response["acc_estados"][e1]["color"] + ' btn-block btn-outlined" onclick="cambio_estado_panel(' + pkmodulo + ',' + Response["valores_cab"][v][Response["acc_estados"][e1]["pkregistro"]] + ',' + Response["acc_estados"][e1]["pkweb_estados_doc"] + ');">' + Response["acc_estados"][e1]["display"] + '</span></button>'
            //     }
            //     if (Response["acc_estados"][e1]["estado_inicial"] == '' && Response["acc_estados"][e1]["estado_final"] != Response["valores_cab"][v][Response['acc_estados'][e1]['c_estado']]) {
            //         new_tap = new_tap + '<button class="' + Response["acc_estados"][e1]["color"] + ' btn-block btn-outlined" onclick="cambio_estado_panel(' + pkmodulo + ',' + Response["valores_cab"][v][Response["acc_estados"][e1]["pkregistro"]] + ',' + Response["acc_estados"][e1]["pkweb_estados_doc"] + ');">' + Response["acc_estados"][e1]["display"] + '</span></button>'
            //     }
            // }
            new_tap = new_tap + '</div></td>'
            for (v2 = 0; v2 < Response["campos_cab"].length; v2++) {

                

                
              visible = false
  
  
  
              valor = Response["valores_cab"][v][Response["campos_cab"][v2]["Nombre"]]
  
              iddet = Response["campos_cab"][v2]["Nombre"] + 'fff' + Response["tabla_cab"]["Nombre"] + 'fff' + Response["valores_cab"][v]["Pk" + Response["tabla_cab"]["Nombre"]]
  
  
              if (Response["campos_cab"][v2]["TablaCampo"] == "cmpopcmultiple") {
  
                html_int = '<select id="' + iddet + '" class="form-control" value="' + valor + '" onchange="cambio_en_paneles()" style="font-size: 11px;padding-top: 0px;padding-bottom: 0px; background-color:@@">'
                for (z = 0; z < Response["func_cab"][Response["campos_cab"][v2]["Nombre"]].length; z++) {
                  if (valor == Response["func_cab"][Response["campos_cab"][v2]["Nombre"]][z]["Valor"]) {
                    html_int = html_int + '<option selected style="background-color: ' + Response["func_cab"][Response["campos_cab"][v2]["Nombre"]][z]["Color"] + '; value="' + Response["func_cab"][Response["campos_cab"][v2]["Nombre"]][z]["Valor"] + '">' + Response["func_cab"][Response["campos_cab"][v2]["Nombre"]][z]["Nombre"] + '</option>'
                    html_int = html_int.replace('@@', Response["func_cab"][Response["campos_cab"][v2]["Nombre"]][z]["Color"])
                  } else {
                    html_int = html_int + '<option style="background-color: ' + Response["func_cab"][Response["campos_cab"][v2]["Nombre"]][z]["Color"] + '; value="' + Response["func_cab"][Response["campos_cab"][v2]["Nombre"]][z]["Valor"] + '">' + Response["func_cab"][Response["campos_cab"][v2]["Nombre"]][z]["Nombre"] + '</option>'
                  }
                }
                html_int = html_int + '</select>'
  
              } else {
                if (Response["campos_cab"][v2]["TablaCampo"] == "cmpfecha") {
                  cl_tipo = ''
                  if (valor == null) {
                    var now = new Date();
                    if (Response["func_cab"][Response["campos_cab"][v2]["Nombre"]][0]["Tiempo"] == "Y") {
                      valor = now.format("Y-m-d") + 'T' + now.format("H:i:s")
                      cl_tipo = 'datetime-local'
                    } else {
                      valor = now.format("Y-m-d");
                      cl_tipo = 'date'
                    }
                  } else {
                    var now = new Date(valor);
                    if (Response["func_cab"][Response["campos_cab"][v2]["Nombre"]][0]["Tiempo"] == "Y") {
                      valor = now.format("Y-m-d") + 'T' + now.format("H:i:s")
                      cl_tipo = 'datetime-local'
                    } else {
                      valor = now.format("Y-m-d");
                      cl_tipo = 'date'
  
                    }
                  }
  
                  html_int = '<input type="' + cl_tipo + '" id="' + iddet + '" type="text" class="form-control" value="' + valor + '" onchange="cambio_en_paneles()" style="height: 25px;font-size: 11px;line-height: 7px;">'
  
  
                } else {
                  if (Response["campos_cab"][v2]["TablaCampo"] == "cmptxtsimple") {
  
  
                    if (Response['campo_fix'][0] == Response["campos_cab"][v2]["Nombre"] && Response["tipo"] != 'Solo Accion' ) {
                      html_int = '<select id="' + iddet + '" class="form-control" value="' + valor + '" onchange="cambio_en_panelesdet_actuliza()" style="font-size: 11px;padding-top: 0px;padding-bottom: 0px">'
                      previos = []
  
                      for (z = 0; z < Response['campo_fix'][1].length; z++) {
  
                        if (previos.indexOf(Response['campo_fix'][1][z]) == -1) {
                          previos.push(Response['campo_fix'][1][z])
                          if (valor == Response['campo_fix'][1][z]) {
                            html_int = html_int + '<option selected>' + Response['campo_fix'][1][z] + '</option>'
                          } else {
                            html_int = html_int + '<option>' + Response['campo_fix'][1][z] + '</option>'
                          }
                        }
                      }
                      html_int = html_int + '</select>'
                    } else {
                      if (Response["func_cab"][Response["campos_cab"][v2]["Nombre"]][0]["Modificable"] == 'N') {
                        html_int = '<input id="' + iddet + '" readonly="readonly" type="text" class="form-control" value="' + valor + '" onchange="cambio_en_paneles()" style="font-size: 11px;">'
                      } else {
  
                        html_int = '<input id="' + iddet + '" type="text" class="form-control" value="' + valor + '" onchange="cambio_en_paneles()" style="font-size: 11px;">'
                      }
                    }
  
                  } else {
  
                    if (Response["campos_cab"][v2]["TablaCampo"] == "cmpreferenciaadjunto") {
  
                      if (Response['campo_fix'][0] == Response["campos_cab"][v2]["Nombre"]) {
                        html_int = '<select id="' + iddet + '" class="form-control" value="' + valor + '" onchange="cambio_en_panelesdet()" style="font-size: 11px;padding-top: 0px;padding-bottom: 0px">'
                        for (z = 0; z < Response['campo_fix'][1].length; z++) {
                          if (valor == Response['campo_fix'][1][z]) {
                            html_int = html_int + '<option selected>' + Response['campo_fix'][1][z] + '</option>'
                          } else {
                            html_int = html_int + '<option>' + Response['campo_fix'][1][z] + '</option>'
                          }
                        }
                        html_int = html_int + '</select>'
                      } else {
                        if (Response["func_cab"][Response["campos_cab"][v2]["Nombre"]][0]["Modificable"] == 'N') {
                          html_int = '<input id="' + iddet + '" readonly="readonly" type="text" class="form-control" value="' + valor + '" onchange="cambio_en_paneles()" style="font-size: 11px;">'
                        } else {
                          html_int = '<input id="' + iddet + '" type="text" class="form-control" value="' + valor + '" onchange="cambio_en_paneles()" style="font-size: 11px;">'
                        }
                      }
                    } else {
  
                      if (Response["campos_cab"][v2]["TablaCampo"] == "cmparchivo") {
                        html_int = '<div class="thumbnail" style="height: 160px;margin-bottom: 1px;">'
                        html_int = html_int  + '<input id="' + iddet + '" type="file" class="form-control" onchange="cambio_en_paneles_archi();subir_archivo_flow(' + iddet + ')" style="font-size: 11px;"><p id="' + iddet + '_lbl"><a href="/media/archivos/' + web_Id_empresa + '/' + valor + '" target="_blank">' + valor + '</a></p>'
                        html_int = html_int  + '<img style="width: 100%;height: 60%;margin-left: auto;margin-right: auto; display: block;" src="/media/archivos/' + web_Id_empresa + '/' + valor + '" alt="image" value="/media/archivos/' + web_Id_empresa + '/' + valor + '">'
                        html_int = html_int  + '</div>'
                        


                      } else {
                        if (Response['campo_fix'][0] == Response["campos_cab"][v2]["Nombre"]) {
                          html_int = '<select id="' + iddet + '" class="form-control" value="' + valor + '" onchange="cambio_en_panelesdet()" style="font-size: 11px;padding-top: 0px;padding-bottom: 0px">'
                          for (z = 0; z < Response['campo_fix'][1].length; z++) {
                            if (valor == Response['campo_fix'][1][z]) {
                              html_int = html_int + '<option selected>' + Response['campo_fix'][1][z] + '</option>'
                            } else {
                              html_int = html_int + '<option>' + Response['campo_fix'][1][z] + '</option>'
                            }
                          }
                          html_int = html_int + '</select>'
                        } else {
                          html_int = '<input id="' + iddet + '" type="text" class="form-control" value="' + valor + '" onchange="cambio_en_paneles()" style="font-size: 11px;">'
                        }
  
                      }
  
  
                    }
  
  
  
  
                  }
  
  
  
                }
              }
  
  
              //if(Response["campos_cab"][v2]["Visible"] == 'Y'){
              if (dict_visible[v2] == 'S') {
                new_tap = new_tap +'<td>' + html_int + '</td>'
              } else {
                new_tap = new_tap + '<td style="display: none;">' + html_int + '</td>'
              }
            }
            new_tap = new_tap + '</tr>'
          }
  
  
          new_tap = new_tap + '</tbody></table></div></div></div>'
          new_tap = new_tap + '</div>'
  
  
          var panel_est = document.getElementById("intpestados" + Response['xE'])
          panel_est.innerHTML = new_tap
        }
  
        if (Response["tipo"] == 'directo') {
  
  
          new_tap = new_tap + '</div>'
          new_tap = new_tap + '<div class="table-responsive mailbox-messages" style="height: 500px;"><table class="table table-hover table-striped"><thead>'
          new_tap = new_tap + '<tr>'
  
          var d_columnas = Response["estado"]['Campo'].split(',')
  
          new_tap = new_tap + '<th></th><th></th>'
  
          for (v = 0; v < d_columnas.length; v++) {
            new_tap = new_tap + '<th>' + d_columnas[v] + '</th>'
          }
          new_tap = new_tap + '</tr></thead><tbody>'
  
  
  
          for (v = 0; v < Response["dire_registros"][0].length; v++) {
            new_tap = new_tap + '<tr>'
  
            new_tap = new_tap + '<td><a class="btn btn-info" onclick="registro(' + Response["estado"]["Valor"] + ',' + Response["dire_registros"][0][v]['pkregistro'] + ',2,-2,0,0)" style="padding: 2px 2px; margin-right: 0px; margin-left: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></a></td>'
  
  
  
            new_tap = new_tap + '<td>'
            for (v3 = 0; v3 < Response["dire_estados"][0].length; v3++) {
  
              new_tap = new_tap + '<button class="' + Response["dire_estados"][0][v3]['color'] + '" onclick="cambio_estado_desde_panel(' + Response["estado"]["Valor"] + ',' + Response["dire_registros"][0][v]['pkregistro'] + ',' + Response["dire_estados"][0][v3]['pkweb_estados_doc'] + ', 0, ' + pkpanel + ',' + pkgrupo + ',' + xE + ',' + pkmodulo + ')">' + Response["dire_estados"][0][v3]['display'] + '</button>'
            }
            new_tap = new_tap + '</td>'
  
  
  
            for (v2 = 0; v2 < d_columnas.length; v2++) {
              new_tap = new_tap + '<td>' + Response["dire_registros"][0][v][d_columnas[v2]] + '</td>'
            }
            new_tap = new_tap + '</tr>'
          }
  
  
          new_tap = new_tap + '</tbody></table></div></div></div>'
          new_tap = new_tap + '</div>'
  
  
          var panel_est = document.getElementById("intpestados" + Response['xE'])
          panel_est.innerHTML = new_tap
        }
  
  
      }
  
    });
  }
  