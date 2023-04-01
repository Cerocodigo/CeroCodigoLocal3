
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
              campo.parentNode.childNodes[1].innerHTML = '<a href="https://www.cerocodigo.com/media/archivos/'+web_Id_empresa+'/'+Response['registro'][0][Object.keys(Response['registro'][0])[x2]]+'" target="_blank">'+Response['registro'][0][Object.keys(Response['registro'][0])[x2]]+'</a>'

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
                        html_int = html_int  + '<input id="' + iddet + '" type="file" class="form-control" onchange="cambio_en_paneles_archi();subir_archivo_flow(' + iddet + ')" style="font-size: 11px;"><p id="' + iddet + '_lbl"><a href="https://www.cerocodigo.com/media/archivos/' + web_Id_empresa + '/' + valor + '" target="_blank">' + valor + '</a></p>'
                        html_int = html_int  + '<img style="width: 100%;height: 60%;margin-left: auto;margin-right: auto; display: block;" src="https://www.cerocodigo.com/media/archivos/' + web_Id_empresa + '/' + valor + '" alt="image" value="https://www.cerocodigo.com/media/archivos/' + web_Id_empresa + '/' + valor + '">'
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
  