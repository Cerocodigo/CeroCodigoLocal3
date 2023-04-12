
function user_acces_per(idpk_chek) {
  id = idpk_chek.id
  varia = id.split('_')
  $.ajax({
    type: 'POST',
    url: '/acc_por_esp',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'user_acc': t_usu.value, 'user_pkcabecera': varia[1], 'user_tipo': varia[3], 'PkModulo': varia[2], 'user_acc_val': idpk_chek.checked, 'id': idpk_chek.id },
    beforeSend: function () { },
    success: function (Response) {
    }
  });
  //var dd = document.getElementById('link_herra')
  //dd.click()
}

function user_acces_per_mod(idpk_chek, ee) {
  id = idpk_chek.id
  varia = id.split('_')
  $.ajax({
    type: 'POST',
    url: '/acc_por_mas',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'user_acc': t_usu.value, 'user_pkcabecera': varia[1], 'user_tipo': varia[2], 'user_acc_val': idpk_chek.checked, 'id': idpk_chek.id },
    beforeSend: function () { },
    success: function (Response) {
      varia = Response["id"].split('_')
      checkboxes = document.getElementsByName('chek_acc' + varia[1] + '_' + varia[2]);
      for (var sd = 0; sd < checkboxes.length; sd++) {
        checkboxes[sd].checked = Response["user_acc_val"]
      };
    }
  });

}


function traer_permisos_usuario() {
    if (web_esUsuario == 'Y'  || web_esAdmin == 'Y') {
      plain = document.getElementById("idacceso")
      if (plain != null) {
        t_usu = document.getElementById("txt_acc_user")
        $.ajax({
          type: 'POST',
          url: '/traer_acc_usuario',
          data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'user_acc': t_usu.value },
          beforeSend: function () { },
          success: function (Response) {
            $(':checkbox').each(function () {
              this.checked = false;
            });
            for (var rr = 0; rr < Response['lista_acceso'].length; rr++) {
  
              chekk = document.getElementById('chekpermiso_' + Response['lista_acceso'][rr]["pkcabecera"] + '_' + Response['lista_acceso'][rr]["pkmodulo"] + '_' + Response['lista_acceso'][rr]["tipo"])
              if (chekk == null) { } else {
                chekk.checked = true
              }
  
  
            };
  
          }
        });
  
      } else { alert('Abrir panel de accesos') }
    } else { alert('No es Administrador') }
  }
  
  

function user_acces() {
    if (web_esUsuario == 'Y'  || web_esAdmin == 'Y') {
      plain = document.getElementById("idacceso")
      if (plain == null) {
  
  
        $.ajax({
          type: 'POST',
          url: '/acc_usuario',
          data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma },
          beforeSend: function () { },
          success: function (Response) {
  
            $("#myTab").prepend('<li role="presentation" class="" id="liacceso" style="text-align: right;"><a href="#rracceso" id="idacceso" role="tab" data-toggle="tab" aria-expanded="false"> Permisos <i class="fa fa-times" style="color: red; background: transparent;cursor: pointer;" onclick="cerrar_elementoacceso()"></i></a> </li>');
  
            $("#myTabContent").prepend('<div role="tabpanel" class="tab-pane fade" id="rracceso" aria-labelledby="idacceso" style="background-color: transparent;"> <div style="padding-top: 5px;"> Procesando </div></div>');
  
            data_int = '<div style="padding-left: 0px;">'
            data_int = data_int + '<div class="box box-primary direct-chat direct-chat-primary"><div class="box-header with-border" style="padding-top: 0px;padding-bottom: 0px;">'
            data_int = data_int + '<div class="col-md-12"><div class="row">'
            data_int = data_int + '<div class="col-md-4 col-xs-8"> <div class="row">'
            data_int = data_int + '<input type="hidden" id="t_us_pk" class="form-control col-sm-4" value="" style="height: 25px;font-size: 11px;">'
            data_int = data_int + '<div class="col-sm-8">'
  
            data_int = data_int + '<label class="control-label for=" txt_acc_user"="" style="font-size: 11px;">Usuarios</label><select class="btn btn-info dropdown-toggle" id="txt_acc_user" style="width: 200px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;" onchange="traer_permisos_usuario()">'
  
            for (x = 0; x < Response["listado_user"].length; x++) {
              data_int = data_int + '<option>' + Response["listado_user"][x]['Usuario'] + '</option>'
            }
            data_int = data_int + '</select>'
  
            data_int = data_int + '</div></div></div></div></div>'
            data_int = data_int + ''
  
  
  
  
            data_int = data_int + '<div class="col-md-12 col-xs-12" style="overflow: auto;">'
  
            data_int = data_int + '<div class="box box-solid"><div class="box-body"><div class="box-group" id="accordion">'
  
            for (var i = 0; i < Response['lista_modulos_gen'].length; i++) {
              data_int = data_int + '<div class="panel box box-primary"><div class="box-header with-border"><h4 class="box-title"><a data-toggle="collapse" data-parent="#accordion" href="#collapse' + i + '">' + Response['lista_modulos_gen'][i]['Modulo'] + '</a></h4></div><div id="collapse' + i + '" class="panel-collapse collapse">'
              data_int = data_int + '<div class="box-body"  style="overflow: auto;">'
  
  
              data_int = data_int + '<table class="table table-bordered" style="background: white;"><thead><tr style="align-content: center;">'
              data_int = data_int + '<th style="text-align: center;padding-bottom: 35px;">Proceso</th>'
              data_int = data_int + '<th style="text-align: center;">Consultar<div class="checkbox"><label><input type="checkbox" id="chek_' + Response['lista_modulos_gen'][i]['pk'] + '_1" onClick="user_acces_per_mod(this,1)"><span class="checkbox-material"><span class="check"></span></span></label></div></th>'
              data_int = data_int + '<th style="text-align: center;">Registrar<div class="checkbox"><label><input type="checkbox" id="chek_' + Response['lista_modulos_gen'][i]['pk'] + '_2" onClick="user_acces_per_mod(this,2)"><span class="checkbox-material"><span class="check"></span></span></label></div></th>'
              data_int = data_int + '<th style="text-align: center;">Modificar<div class="checkbox"><label><input type="checkbox" id="chek_' + Response['lista_modulos_gen'][i]['pk'] + '_3" onClick="user_acces_per_mod(this,3)"><span class="checkbox-material"><span class="check"></span></span></label></div></th>'
              data_int = data_int + '<th style="text-align: center;">Eliminar<div class="checkbox"><label><input type="checkbox" id="chek_' + Response['lista_modulos_gen'][i]['pk'] + '_4" onClick="user_acces_per_mod(this,4)"><span class="checkbox-material"><span class="check"></span></span></label></div></th>'
              data_int = data_int + '<th style="text-align: center;">Consultar Propios<div class="checkbox"><label><input type="checkbox" id="chek_' + Response['lista_modulos_gen'][i]['pk'] + '_5" onClick="user_acces_per_mod(this,5)"><span class="checkbox-material"><span class="check"></span></span></label></div></th>'
              
              data_int = data_int + '</tr></thead><tbody>'
  
              if (Response['lista_modulos_gen'][i]['Modulo'] == "Reportes") {
                for (var ii = 0; ii < Response['lista_modulos'].length; ii++) {
                  if (Response['lista_modulos'][ii]['Modulo'] == Response['lista_modulos_gen'][i]['Modulo']) {
                    data_int = data_int + '<td>' + Response['lista_modulos'][ii]['Proceso'] + '</td>'
                    if (Response['lista_modulos'][ii]['tipo'] == 'Reporte') {
  
                      data_int = data_int + '<td style="text-align: center;"><div class="checkbox"><label><input type="checkbox" name="chek_acc' + Response['lista_modulos_gen'][i]['pk'] + '_1" id="chekpermiso_' + Response['lista_modulos_gen'][i]['pk'] + '_' + Response['lista_modulos'][ii]['PkModulo'] + '_1" onClick="user_acces_per(this,1)"><span class="checkbox-material"><span class="check"></span></span></label></div></td>'
  
                      data_int = data_int + '<td style="text-align: center;"></td>'
                      data_int = data_int + '<td style="text-align: center;"></td>'
                      data_int = data_int + '<td style="text-align: center;"></td>'
  
                    }
                    if (Response['lista_modulos'][ii]['tipo'] == 'Registro') {
                      data_int = data_int + '<td style="text-align: center;"><div class="checkbox"><label><input type="checkbox" name="chek_acc' + Response['lista_modulos_gen'][i]['pk'] + '_1" onClick="user_acces_per(this,1)"><span class="checkbox-material"><span class="check"></span></span></label></div></td>'
                      data_int = data_int + '<td style="text-align: center;"><div class="checkbox"><label><input type="checkbox" name="chek_acc' + Response['lista_modulos_gen'][i]['pk'] + '_2" onClick="user_acces_per(this,2)"><span class="checkbox-material"><span class="check"></span></span></label></div></td>'
                      data_int = data_int + '<td style="text-align: center;"><div class="checkbox"><label><input type="checkbox" name="chek_acc' + Response['lista_modulos_gen'][i]['pk'] + '_3" onClick="user_acces_per(this,3)"><span class="checkbox-material"><span class="check"></span></span></label></div></td>'
                      data_int = data_int + '<td style="text-align: center;"><div class="checkbox"><label><input type="checkbox" name="chek_acc' + Response['lista_modulos_gen'][i]['pk'] + '_4" onClick="user_acces_per(this,4)"><span class="checkbox-material"><span class="check"></span></span></label></div></td>'
                      data_int = data_int + '<td style="text-align: center;"><div class="checkbox"><label><input type="checkbox" name="chek_acc' + Response['lista_modulos_gen'][i]['pk'] + '_5" onClick="user_acces_per(this,5)"><span class="checkbox-material"><span class="check"></span></span></label></div></td>'

                    }
                  }
                  data_int = data_int + '</tr>'
                }
                data_int = data_int + '</tbody></table>'
  
  
              } else {
                for (var ii = 0; ii < Response['lista_modulos'].length; ii++) {
                  if (Response['lista_modulos'][ii]['Modulo'] == Response['lista_modulos_gen'][i]['Modulo']) {
                    data_int = data_int + '<td>' + Response['lista_modulos'][ii]['Proceso'] + '</td>'
                    if (Response['lista_modulos'][ii]['tipo'] == 'Reporte') {
                      //data_int = data_int + '<td style="text-align: center;"><div class="checkbox"><label><input type="checkbox" name="chek_acc'+Response['lista_modulos_gen'][i]['pk']+'_1" onClick="user_acces_per(this,1)"><span class="checkbox-material"><span class="check"></span></span></label></div></td>'
                      data_int = data_int + '<td style="text-align: center;"><div class="checkbox"><label><input type="checkbox" name="chek_acc' + Response['lista_modulos_gen'][i]['pk'] + '_1" id="chekpermiso_' + Response['lista_modulos_gen'][i]['pk'] + '_' + Response['lista_modulos'][ii]['PkModulo'] + '_1" onClick="user_acces_per(this,1)"><span class="checkbox-material"><span class="check"></span></span></label></div></td>'
  
                      data_int = data_int + '<td style="text-align: center;"></td>'
                      data_int = data_int + '<td style="text-align: center;"></td>'
                      data_int = data_int + '<td style="text-align: center;"></td>'
  
                    }
                    if (Response['lista_modulos'][ii]['tipo'] == 'Registro') {
                      data_int = data_int + '<td style="text-align: center;"><div class="checkbox"><label><input type="checkbox" name="chek_acc' + Response['lista_modulos_gen'][i]['pk'] + '_1" id="chekpermiso_' + Response['lista_modulos_gen'][i]['pk'] + '_' + Response['lista_modulos'][ii]['PkModulo'] + '_1" onClick="user_acces_per(this,1)"><span class="checkbox-material"><span class="check"></span></span></label></div></td>'
                      data_int = data_int + '<td style="text-align: center;"><div class="checkbox"><label><input type="checkbox" name="chek_acc' + Response['lista_modulos_gen'][i]['pk'] + '_2" id="chekpermiso_' + Response['lista_modulos_gen'][i]['pk'] + '_' + Response['lista_modulos'][ii]['PkModulo'] + '_2" onClick="user_acces_per(this,2)"><span class="checkbox-material"><span class="check"></span></span></label></div></td>'
                      data_int = data_int + '<td style="text-align: center;"><div class="checkbox"><label><input type="checkbox" name="chek_acc' + Response['lista_modulos_gen'][i]['pk'] + '_3" id="chekpermiso_' + Response['lista_modulos_gen'][i]['pk'] + '_' + Response['lista_modulos'][ii]['PkModulo'] + '_3" onClick="user_acces_per(this,3)"><span class="checkbox-material"><span class="check"></span></span></label></div></td>'
                      data_int = data_int + '<td style="text-align: center;"><div class="checkbox"><label><input type="checkbox" name="chek_acc' + Response['lista_modulos_gen'][i]['pk'] + '_4" id="chekpermiso_' + Response['lista_modulos_gen'][i]['pk'] + '_' + Response['lista_modulos'][ii]['PkModulo'] + '_4" onClick="user_acces_per(this,4)"><span class="checkbox-material"><span class="check"></span></span></label></div></td>'
                      data_int = data_int + '<td style="text-align: center;"><div class="checkbox"><label><input type="checkbox" name="chek_acc' + Response['lista_modulos_gen'][i]['pk'] + '_4" id="chekpermiso_' + Response['lista_modulos_gen'][i]['pk'] + '_' + Response['lista_modulos'][ii]['PkModulo'] + '_5" onClick="user_acces_per(this,5)"><span class="checkbox-material"><span class="check"></span></span></label></div></td>'
                      
                    }
                  }
  
                  data_int = data_int + '</tr>'
                }
                data_int = data_int + '</tbody></table>'
              }
  
  
              data_int = data_int + '</div></div></div>'
  
            }
  
  
            data_int = data_int + '</div></div></div>'
  
  
  
  
  
  
  
  
  
            data_int = data_int + '</div></div></div></div>'
  
  
            $('#rracceso').html(data_int);
            document.getElementById('idacceso').click();
            traer_permisos_usuario()
  
          }
        });
  
      } else {
  
        traer_permisos_usuario()
      }
  
  
    } else {
      alert("Solo administrador puede crear usuarios")
    }
  
    var dd = document.getElementById('idacceso')
    dd.click()
  }
  


function cerrar_elementoPermisos() {
    $('#' + 'rrfirma').remove()
    $('#' + 'firmadiv').remove()
}
function grabar_elementoPermisos() {

    tablaFirmas = document.getElementById('tablaFirmas')
    firmas = []
    for (let i = 0; i < tablaFirmas.childElementCount ; i++) {
        firmas_in = {'Certy': tablaFirmas.children[i].childNodes[1].innerText, 'Clave':tablaFirmas.children[i].childNodes[2].children[0].value}
        firmas.push(firmas_in)
    }
    $.ajax({
        type: 'POST',
        url: '/firma_grabar',
        data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'firmas':JSON.stringify(firmas)},
        success: function (Response) { 
          if(Response['ok']=='si'){
            alert('Firma Actualizada')
            cerrar_elementoPermisos()
          }else{
            alert(Response['msg'])
          }
        }
      });
    
}
function subir_firma(este) {

    const files = este.files
    const formData = new FormData()
    formData.append('csrfmiddlewaretoken', web_token)
    formData.append('Id_empresa', web_Id_empresa)
    formData.append('id_archivo', files[0].name)
    //formData.append('acceso_id', )

    este.parentElement.childNodes[0].innerText = files[0].name

    for (let i = 0; i < files.length; i++) {
        let file = files[i]

        formData.append('files', file)
    }

    //fetch('/archi_carg', { method: 'POST', body: formData, }).then(response => {
    //  console.log(response)

    //})
    let headers = new Headers();


    headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1'); 
    headers.append('Access-Control-Allow-Methods', 'POST'); 
    headers.append('Access-Control-Allow-Credentials', 'true');
    headers.append('Access-Control-Allow-Headers', 'Content-Type');

    fetch('/ccsubirFirmas/', { method: 'POST', headers: headers, body: formData, mode: 'no-cors',}).then(response => {
        console.log(response)

    })
        
      
}
function Firma_aumentarFila() {
    
    fila =  '<tr>'
    fila = fila + '<td><button type="button" onclick="Firma_quitarFila(this)" class="btn bg-red btn-flat margin" style="padding: 3px 8px;margin-bottom: 0px;margin-top: 0px;">-</button></td>'
    fila = fila + '<td><p></p><input type="file" class="form-control" onchange="subir_firma(this);" style="font-size: 11px;"></td>'
    fila = fila + '<td><input type="password" class="form-control" style="font-size: 11px;" value=""></input></td>'

    fila = fila + '</tr>'
    $('#tablaFirmas tr:last').after(fila);
}

function Firma_quitarFila(esta) {
    esta.parentElement.parentElement.remove()
}

function user_firma() {
    plain = document.getElementById("firmadiv")
    if (plain == null) {

        $("#myTab").prepend('<li role="presentation" class="" id="firmadiv" style="text-align: right;"><a href="#rrfirma" role="tab" data-toggle="tab" aria-expanded="false" id="firmaclick"> Permisos <i class="fa fa-times" style="color: red; background: transparent;cursor: pointer;" onclick="cerrar_elementoPermisos()"></i></a> </li>');

        $("#myTabContent").prepend('<div role="tabpanel" class="tab-pane fade" id="rrfirma" aria-labelledby="firmadiv" style="background-color: transparent;"> <div style="padding-top: 5px;"> Procesando </div></div>');

    } else {
        $('#rrfirma').html('<div style="padding-top: 5px;"> Procesando </div>');

        document.getElementById('firmaclick').click();
        
        document.getElementById('link_herra').click();

    }
    $.ajax({
        type: 'POST',
        url: '/firma_usuario',
        data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma },
        beforeSend: function () { },
        success: function (Response) {
            data_int = '<div class="box-header with-border"><div class="row">'

            data_int = data_int +'<button type="button" onclick="grabar_elementoPermisos()" class="btn bg-green btn-flat margin"><span>Grabar</span></button>'
            data_int = data_int +'<button type="button" onclick="cerrar_elementoPermisos()" class="btn bg-gray btn-flat margin"><span>Cerrar</span></button>'

            data_int = data_int +'</div>'
            data_int = data_int + '<div class="box-body"  style="background: white;overflow: auto;">'


            data_int = data_int + '<table class="table table-bordered" style="background: white;"><thead><tr style="align-content: center;">'
            //data_int = data_int + '<th style="text-align: center;"><button type="button" onclick="Firma_aumentarFila()" class="btn bg-green btn-flat margin" style="padding: 3px 8px;margin-bottom: 0px;margin-top: 0px;">+</button></th>'
            data_int = data_int + '<th style="text-align: center;"></th>'


            data_int = data_int + '<th style="text-align: center;">Certificado</th>'
            data_int = data_int + '<th style="text-align: center;">Clave</th>'
            //data_int = data_int + '<th style="text-align: center;">Expiracion</th>'

            data_int = data_int + '</tr></thead><tbody id="tablaFirmas">'
            if(Response['firmas'].length == 0){
                data_int = data_int + '<tr>'
                //data_int = data_int + '<td><button type="button" onclick="Firma_quitarFila(this)" class="btn bg-red btn-flat margin" style="padding: 3px 8px;margin-bottom: 0px;margin-top: 0px;">-</button></td>'
                data_int = data_int + '<td></td>'
                data_int = data_int + '<td><p></p><input type="file" class="form-control" onchange="subir_firma(this);" style="font-size: 11px;"></td>'
                data_int = data_int + '<td><input type="password" class="form-control" style="font-size: 11px;" value=""></input></td>'

                data_int = data_int + '</tr>'
            }else{
                for (var i = 0; i < Response['firmas'].length; i++) {
    
                    data_int = data_int + '<tr>'
                    //data_int = data_int + '<td><button type="button" onclick="Firma_quitarFila(this)" class="btn bg-red btn-flat margin" style="padding: 3px 8px;margin-bottom: 0px;margin-top: 0px;">-</button></td>'
                    data_int = data_int + '<td></td>'
                    data_int = data_int + '<td><p>' + Response['firmas'][i]['certificado'] + '</p><input type="file" class="form-control" onchange="subir_firma(this);" style="font-size: 11px;"></td>'
                    data_int = data_int + '<td><input type="password" class="form-control" style="font-size: 11px;" value="' + Response['firmas'][i]['clave'] + '"></input></td>'
                    //data_int = data_int + '<td><input type="text" class="form-control" style="font-size: 11px;" value="' + Response['firmas'][i]['expiracion'] + '"></input></td>'
    
                    data_int = data_int + '</tr>'
                }
            }
            data_int = data_int + '</tbody></table>'

            data_int = data_int + '</div>'
            data_int = data_int + '</div>'



            $('#rrfirma').html(data_int);
            document.getElementById('firmaclick').click();
            document.getElementById('link_herra').click();

        }
    });
}


