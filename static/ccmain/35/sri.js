
function sri_auto_envio_a_gid(t_pkmodulo) {
  var dd = document.getElementById('edocs_sri_auto_tabla')
  var fact_num = dd.children[0].children[0].childElementCount - 1

  var divv_adds = document.getElementById('sri_' + t_pkmodulo)
  var linea_base = ''
  for (d1 = 0; d1 < divv_adds.childElementCount; d1++) {
    linea_base = linea_base + '<td>' + divv_adds.children[d1].children[0].innerText + '$' + divv_adds.children[d1].children[1].children[0].value + '</td>'
    //traspasos[divv_adds.children[d1].children[1].children[0].id] = divv_adds.children[d1].children[1].children[0].value
  }
  


  for (d1 = dd.children[0].children[0].childElementCount -1; d1 > 0 ; d1--){
    fila = '<tr> <td></td>' 
    fila = fila + '<td>' + dd.children[0].children[0].children[d1].children[1].innerText +'</td>'
    fila = fila + '<td>' + dd.children[0].children[0].children[d1].children[2].innerText +'</td>'
    fila = fila + '<td>' + dd.children[0].children[0].children[d1].children[3].innerText +'</td>'
    fila = fila + '<td>' + dd.children[0].children[0].children[d1].children[4].innerText +'</td>'
    fila = fila + '<td>' + dd.children[0].children[0].children[d1].children[5].innerText +'</td>'
    fila = fila + '<td>' + dd.children[0].children[0].children[d1].children[6].innerText +'</td>'
    fila = fila + '<td>' + dd.children[0].children[0].children[d1].children[7].innerText +'</td>'
    fila = fila + '<td>' + dd.children[0].children[0].children[d1].children[8].innerText +'</td>'
    fila = fila + linea_base + '</tr>'

    dd.children[0].children[0].children[d1].remove()
    $('#div_sri_preingreso tr:last').after(fila);

  }
  edocs_desmarcar_todo()

  document.getElementById('cerrar_default_sri_auto').click()
  document.getElementById('docs_sri_apr_link').click()
  if(esta_grbando_sri == 0){
    esta_grbando_sri = 1
    sri_grabar_automatico_envio_parcial(t_pkmodulo, 1)
  }

}


function sri_grabar_automatico_envio_parcial(t_pkmodulo, t_linea){

  var dd = document.getElementById('edocs_sri_auto_proceso')
  //dd.innerHTML = 'Guardando ' + t_linea + ' de ' + dict_claves.length
  
  var div_envio_edocs_listas = document.getElementById('div_sri_preingreso')

  if (t_linea < div_envio_edocs_listas.children[0].childElementCount) {
    if(div_envio_edocs_listas.children[0].children[t_linea].children[0].innerText != 'Ingresado'){

    t_dict_claves= div_envio_edocs_listas.children[0].children[t_linea].children[8].innerText
    t_traspasos = {}
    //if(div_envio_edocs_listas.children[0].children[t_linea].children.length > 9){
    //  for (d1 = 9; d1 < div_envio_edocs_listas.children[0].children[0].childElementCount; d1++) {
    //    t_traspasos[div_envio_edocs_listas.children[0].children[0].children[d1].innerText] = div_envio_edocs_listas.children[0].children[t_linea].children[d1].innerText
    //  }
    //}

    var divv_adds = document.getElementById('sri_' + t_pkmodulo)
    var linea_base = ''
    if(div_envio_edocs_listas.children[0].children[t_linea].children.length > 9){ 
      for (d1 = 0; d1 < divv_adds.childElementCount; d1++) {
        t_traspasos[divv_adds.children[d1].children[1].children[0].id] = divv_adds.children[d1].children[1].children[0].value

      }
    }

      $.ajax({
        type: 'POST',
        url: '/grabar_automatico',
        data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 't_pkmodulo': t_pkmodulo, 'dict_claves': JSON.stringify([t_dict_claves]), 'dict_traspasos': JSON.stringify(t_traspasos) },
        success: function (Response) {
          var div_envio_edocs_listas = document.getElementById('div_sri_preingreso')

          if (Response['Errores'].length > 0) {
            var div_envio_edocs_listas = document.getElementById('div_sri_preingreso')
            div_envio_edocs_listas.children[0].children[t_linea].children[0].innerText ='Error(' + Response['Errores'][0] + ' ' + Response['msg'][0] + '), '
            //div_envio_edocs_listas.children[0].children[t_linea].children[0].innerText ='Error'
            
          }
          if (Response['buenas'].length > 0) {
            div_envio_edocs_listas.children[0].children[t_linea].children[0].innerText ='Ingresado'
          }
          sri_grabar_automatico_envio_parcial(t_pkmodulo, t_linea + 1)
        },
        error: function (xhr, status, error) {
          if (xhr.statusText == 'Bad Gateway') {
            var div_envio_edocs_listas = document.getElementById('div_sri_preingreso')
            div_envio_edocs_listas.children[0].children[t_linea].children[0].innerText ='Sri No Responde'
            sri_grabar_automatico_envio_parcial(t_pkmodulo, t_linea + 1)

          } else {
            try {
              var err = eval("(" + xhr.responseText + ")");
              var div_envio_edocs_listas = document.getElementById('div_sri_preingreso')
              div_envio_edocs_listas.children[0].children[t_linea].children[0].innerText =err.Message
              sri_grabar_automatico_envio_parcial(t_pkmodulo, t_linea + 1)
                
            } catch (error) {
              var err = xhr.responseText.replace(/</g, '').replace(/>/g, '')
              var div_envio_edocs_listas = document.getElementById('div_sri_preingreso')
              div_envio_edocs_listas.children[0].children[t_linea].children[0].innerText =err.Message
              sri_grabar_automatico_envio_parcial(t_pkmodulo, t_linea + 1)
              
            }

          }
        }
      });
    }
  }else{
    //mira si hay errores
    for (d1 = div_envio_edocs_listas.children[0].childElementCount-1; d1 > 0 ; d1--) {
      if(div_envio_edocs_listas.children[0].children[d1].children[0].innerText ='Ingresado'){
        div_envio_edocs_listas.children[0].children[d1].remove()
      }
    }
    if(div_envio_edocs_listas.children[0].childElementCount>1){
      sri_grabar_automatico_envio_parcial(t_pkmodulo, 1)
    }else{
      actualizar_sri_docs()
      esta_grbando_sri = 0
    }
  }    


}


function actualizar_sri_docs() {
    var dd = document.getElementById('edocs_sri_auto_tabla')
    for (d1 = dd.children[0].children[0].childElementCount - 1; d1 > 0; d1--) {
      dd.children[0].children[0].children[d1].remove()
    }
  
    var fecha_sri = document.getElementById('edocs_fecha_sri_anio').value + '-' + document.getElementById('edocs_fecha_sri_mes').value + '-01'
  
    var fecha_sri = document.getElementById('edocs_fecha_sri_anio').value + '-' + document.getElementById('edocs_fecha_sri_mes').value + '-01'
  
    var filtro_sri = document.getElementById('edocs_filtro_sri').value
    var docu_sri = document.getElementById('edocs_docu_sri').value

  
    var div_sri = document.getElementById('docs_sri_pen')
    div_sri.innerHTML = 'Cargando información....'
  
  
  
    var div_sria = document.getElementById('docs_sri_ing')
    div_sria.innerHTML = 'Cargando información....'
  
  
  
    $.ajax({
      type: 'POST',
      url: '/edocs_sri',
      data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 't_fecha': fecha_sri, 't_filtro': filtro_sri, 't_orden': document.getElementById('edocs_tipo_sri').value, 't_docu': document.getElementById('edocs_docu_sri').value }, // H:i:s
      success: function (Response) {
  
        Listado_sri = Response
  
        ht = '<table class="table table-bordered" style="background: white;">'
  
        ht = ht + '<thead><tr>'
        ht = ht + '<th style="text-align: center;"><input type="checkbox" onclick="edocs_traer_todo(this)"> <label> Marcar Todos</label></th>'
        ht = ht + '<th style="text-align: center;vertical-align: inherit;">Grabar Como</th>'
        ht = ht + '<th style="text-align: center;vertical-align: inherit;">Comprobante</th>'
        ht = ht + '<th style="text-align: center;vertical-align: inherit;">Numero</th>'
        ht = ht + '<th style="text-align: center;vertical-align: inherit;">Ruc</th>'
        ht = ht + '<th style="text-align: center;vertical-align: inherit;">Razon Social</th>'
        ht = ht + '<th style="text-align: center;vertical-align: inherit;">Fecha</th>'
        ht = ht + '<th style="text-align: center;vertical-align: inherit;">Total</th>'
        //ht = ht +'<th>Estado</th>'
        ht = ht + '<th style="text-align: center;vertical-align: inherit;">Archivos</th>'
        ht = ht + '<th style="text-align: center;vertical-align: inherit;">Descartar</th>'
  
        ht = ht + '<th style="text-align: center;vertical-align: inherit;">Clave</th>'
        ht = ht + '</tr></thead><tbody>'
  
  
        lineas_pendiente = ''
        lineas_ingresadas = ''
        lineas_aprobadas = ''
        lineas_descartas = ''
  
        lineas = ''
  
        for (q = 0; q < Response["registros_pend"].length; q++) {
          tipo_int = ''
          tipo_web = ''
          if (Response["registros_pend"][q]['COMPROBANTE'] == 'Factura') {
            tipo_int = 'Facturas'
            tipo_web = 'Facturas'
          }
          if (Response["registros_pend"][q]['COMPROBANTE'] == 'Comprobante de Retencion') {
            tipo_int = 'Retenciones'
            tipo_web = 'Retenciones'
          }
          if (Response["registros_pend"][q]['COMPROBANTE'] == 'Notas de Credito') {
            tipo_int = 'Credito'
            tipo_web = 'Credito'
          }
          lineas = '<tr id="edcos_' + Response["registros_pend"][q]['pkid'] + '">'
          lineas = lineas + '<td  style="text-align: center;">'
          if (Response["registros_pend"][q]['TIPO_EMISION'] == 0) {
            if (Response["registros_pend"][q]['Estado'] == 'Pendiente') {
              lineas = lineas + '<input type="checkbox" id="fact_' + Response["registros_pend"][q]['pkid'] + '" onclick="edocs_sri_auto(edcos_' + Response["registros_pend"][q]['pkid'] + ', this)">'
            }
          }
          lineas = lineas + '</td>'
          lineas = lineas + '<td>'
          if (Response["registros_pend"][q]['TIPO_EMISION'] == 0) {
            if (Response["registros_pend"][q]['Estado'] == 'Pendiente') {
              for (var i = 0; i < Response['enlaces'].length; i++) {
                if (Response['enlaces'][i]['tipo'] == Response["registros_pend"][q]['COMPROBANTE']){
                  lineas = lineas + '<button class="btn bg-blue btn-flat margin" onclick="registro(' + Response['enlaces'][i]['pkmodulo'] + ', 0, 0, -2, 0, \'' + Response["registros_pend"][q]['CLAVE_ACCESO'].replace("\r", "") + '\')" style="margin-bottom: 3px;padding-top: 0px;width: 100%;padding-bottom: 0px;margin-top: 3px;">' + Response['enlaces'][i]['nombre'] + '</button>'
                }
              }
            }
          }
          if (Response["registros_pend"][q]['TIPO_EMISION'] == 2) {
            for (var i = 0; i < Response['enlaces'].length; i++) {
              if (Response['enlaces'][i]['tipo'] == Response["registros_pend"][q]['COMPROBANTE']){
                lineas = lineas + '<button class="btn bg-blue btn-flat margin" onclick="registro(' + Response['enlaces'][i]['pkmodulo'] + ', 0, 0, -2, 0, \'' + Response["registros_pend"][q]['CLAVE_ACCESO'] + '\')" style="margin-bottom: 3px;padding-top: 0px;width: 100%;padding-bottom: 0px;margin-top: 3px;">' + Response['enlaces'][i]['nombre'] + '</button>'
              }
            }
          }
          lineas = lineas + '</td>'
          lineas = lineas + '<td>' + Response["registros_pend"][q]['COMPROBANTE'] + '</td>'
          lineas = lineas + '<td>' + Response["registros_pend"][q]['SERIE_COMPROBANTE'] + '</td>'
          lineas = lineas + '<td>' + Response["registros_pend"][q]['RUC_EMISOR'] + '</td>'
          lineas = lineas + '<td>' + Response["registros_pend"][q]['RAZON_SOCIAL_EMISOR'] + '</td>'
          lineas = lineas + '<td>' + Response["registros_pend"][q]['FECHA_EMISION'] + '</td>'
          lineas = lineas + '<td style="text-align: right;">' + Response["registros_pend"][q]['IMPORTE_TOTAL'] + '</td>'
          //lineas =lineas + '<td>' + Response["registros"][q]['Estado'] + '</td>'
          lineas = lineas + '<td style="text-align: center;"><a href="/e_docs/' + tipo_int + '/' + Response["registros_pend"][q]['CLAVE_ACCESO'] + '/" target="_blank">Ver</a></td>'
          lineas = lineas + '<td style="text-align: center;">'
          if (Response["registros_pend"][q]['TIPO_EMISION'] != 1) {
            if (Response["registros_pend"][q]['Estado'] == 'Pendiente') {
              lineas = lineas + '<a class="btn btn-danger" onclick="eliminaredocs(' + Response["registros_pend"][q]['pkid'] + ',1)" style="padding: 2px 2px; margin-right: 0px; margin-left: 0px;"><span class="glyphicon glyphicon-remove-circle" aria-hidden="true"></span></a>'
            }
          }
          lineas = lineas + '</td>'
          lineas = lineas + '<td>' + Response["registros_pend"][q]['CLAVE_ACCESO'] + '</td>'
          lineas = lineas + '</tr>'
          if (Response["registros_pend"][q]['TIPO_EMISION'] == '0') {
            if (Response["registros_pend"][q]['Estado'] == 'Pendiente') {
              lineas_pendiente = lineas_pendiente + lineas
            } else {
              lineas_ingresadas = lineas_ingresadas + lineas
            }
          }
          if (Response["registros_pend"][q]['TIPO_EMISION'] == '1') {
            lineas_descartas = lineas_descartas + lineas
          }
          if (Response["registros_pend"][q]['TIPO_EMISION'] == '2') {
            lineas_aprobadas = lineas_aprobadas + lineas
          }
        }
  
  
  
        for (q = 0; q < Response["registros_ingre"].length; q++) {
          tipo_int = ''
          tipo_web = ''
          if (Response["registros_ingre"][q]['COMPROBANTE'] == 'Factura') {
            tipo_int = 'Facturas'
            tipo_web = 'Facturas'
          }
          if (Response["registros_ingre"][q]['COMPROBANTE'] == 'Comprobante de Retencion') {
            tipo_int = 'Retenciones'
            tipo_web = 'Retenciones'
          }
          if (Response["registros_ingre"][q]['COMPROBANTE'] == 'Notas de Credito') {
            tipo_int = 'Credito'
            tipo_web = 'Credito'
          }
          lineas = '<tr id="edcos_' + Response["registros_ingre"][q]['pkid'] + '">'
          lineas = lineas + '<td  style="text-align: center;">'
          if (Response["registros_ingre"][q]['TIPO_EMISION'] == 0) {
            if (Response["registros_ingre"][q]['Estado'] == 'Pendiente') {
              lineas = lineas + '<input type="checkbox" id="fact_' + Response["registros_ingre"][q]['pkid'] + '" onclick="edocs_sri_auto(edcos_' + Response["registros_ingre"][q]['pkid'] + ', this)">'
            }
          }
          lineas = lineas + '</td>'
          lineas = lineas + '<td>'
          if (Response["registros_ingre"][q]['TIPO_EMISION'] == 0) {
            if (Response["registros_ingre"][q]['Estado'] == 'Pendiente') {
              for (var i = 0; i < Response['enlaces'].length; i++) {
                lineas = lineas + '<button class="btn bg-blue btn-flat margin" onclick="registro(' + Response['enlaces'][i]['pkmodulo'] + ', 0, 0, -2, 0, \'' + Response["registros_ingre"][q]['CLAVE_ACCESO'].replace("\r", "") + '\')" style="margin-bottom: 3px;padding-top: 0px;width: 100%;padding-bottom: 0px;margin-top: 3px;">' + Response['enlaces'][i]['nombre'] + '</button>'
              }
            }
          }
          if (Response["registros_ingre"][q]['TIPO_EMISION'] == 2) {
            for (var i = 0; i < Response['enlaces'].length; i++) {
              lineas = lineas + '<button class="btn bg-blue btn-flat margin" onclick="registro(' + Response['enlaces'][i]['pkmodulo'] + ', 0, 0, -2, 0, \'' + Response["registros_ingre"][q]['CLAVE_ACCESO'] + '\')" style="margin-bottom: 3px;padding-top: 0px;width: 100%;padding-bottom: 0px;margin-top: 3px;">' + Response['enlaces'][i]['nombre'] + '</button>'
            }
          }
          lineas = lineas + '</td>'
          lineas = lineas + '<td>' + Response["registros_ingre"][q]['COMPROBANTE'] + '</td>'
          lineas = lineas + '<td>' + Response["registros_ingre"][q]['SERIE_COMPROBANTE'] + '</td>'
          lineas = lineas + '<td>' + Response["registros_ingre"][q]['RUC_EMISOR'] + '</td>'
          lineas = lineas + '<td>' + Response["registros_ingre"][q]['RAZON_SOCIAL_EMISOR'] + '</td>'
          lineas = lineas + '<td>' + Response["registros_ingre"][q]['FECHA_EMISION'] + '</td>'
          lineas = lineas + '<td style="text-align: right;">' + Response["registros_ingre"][q]['IMPORTE_TOTAL'] + '</td>'
          //lineas =lineas + '<td>' + Response["registros"][q]['Estado'] + '</td>'
          lineas = lineas + '<td style="text-align: center;"><a href="/e_docs/' + tipo_int + '/' + Response["registros_ingre"][q]['CLAVE_ACCESO'] + '/" target="_blank">Ver</a></td>'
          lineas = lineas + '<td style="text-align: center;">'
          if (Response["registros_ingre"][q]['TIPO_EMISION'] != 1) {
            if (Response["registros_ingre"][q]['Estado'] == 'Pendiente') {
              lineas = lineas + '<a class="btn btn-danger" onclick="eliminaredocs(' + Response["registros_ingre"][q]['pkid'] + ',1)" style="padding: 2px 2px; margin-right: 0px; margin-left: 0px;"><span class="glyphicon glyphicon-remove-circle" aria-hidden="true"></span></a>'
            }
          }
          lineas = lineas + '</td>'
          lineas = lineas + '<td>' + Response["registros_ingre"][q]['CLAVE_ACCESO'] + '</td>'
          lineas = lineas + '</tr>'
          if (Response["registros_ingre"][q]['TIPO_EMISION'] == 0) {
            if (Response["registros_ingre"][q]['Estado'] == 'Pendiente') {
              lineas_pendiente = lineas_pendiente + lineas
            } else {
              lineas_ingresadas = lineas_ingresadas + lineas
            }
          }
          if (Response["registros_ingre"][q]['TIPO_EMISION'] == 1) {
            lineas_descartas = lineas_descartas + lineas
          }
          if (Response["registros_ingre"][q]['TIPO_EMISION'] == 2) {
            lineas_aprobadas = lineas_aprobadas + lineas
          }
        }
  
  
  
        for (q = 0; q < Response["registros_recha"].length; q++) {
          tipo_int = ''
          tipo_web = ''
          if (Response["registros_recha"][q]['COMPROBANTE'] == 'Factura') {
            tipo_int = 'Facturas'
            tipo_web = 'Facturas'
          }
          if (Response["registros_recha"][q]['COMPROBANTE'] == 'Comprobante de Retencion') {
            tipo_int = 'Retenciones'
            tipo_web = 'Retenciones'
          }
          if (Response["registros_recha"][q]['COMPROBANTE'] == 'Notas de Credito') {
            tipo_int = 'Credito'
            tipo_web = 'Credito'
          }
          lineas = '<tr id="edcos_' + Response["registros_recha"][q]['pkid'] + '">'
          lineas = lineas + '<td  style="text-align: center;">'
          if (Response["registros_recha"][q]['TIPO_EMISION'] == 0) {
            if (Response["registros_recha"][q]['Estado'] == 'Pendiente') {
              lineas = lineas + '<input type="checkbox" id="fact_' + Response["registros_recha"][q]['pkid'] + '" onclick="edocs_sri_auto(edcos_' + Response["registros_recha"][q]['pkid'] + ', this)">'
            }
          }
          lineas = lineas + '</td>'
          lineas = lineas + '<td>'
          if (Response["registros_recha"][q]['TIPO_EMISION'] == 0) {
            if (Response["registros_recha"][q]['Estado'] == 'Pendiente') {
              for (var i = 0; i < Response['enlaces'].length; i++) {
                lineas = lineas + '<button class="btn bg-blue btn-flat margin" onclick="registro(' + Response['enlaces'][i]['pkmodulo'] + ', 0, 0, -2, 0, \'' + Response["registros_recha"][q]['CLAVE_ACCESO'].replace("\r", "") + '\')" style="margin-bottom: 3px;padding-top: 0px;width: 100%;padding-bottom: 0px;margin-top: 3px;">' + Response['enlaces'][i]['nombre'] + '</button>'
              }
            }
          }
          if (Response["registros_recha"][q]['TIPO_EMISION'] == 1) {
            if (Response["registros_recha"][q]['Estado'] == 'Pendiente') {
              lineas = lineas + '<a class="btn btn-info" onclick="eliminaredocs(' + Response["registros_recha"][q]['pkid'] + ',0)" style="padding: 2px 2px; margin-right: 0px; margin-left: 0px;"><span class="glyphicon glyphicon-refresh" aria-hidden="true"></span></a>'
  
            }
          }
          if (Response["registros_recha"][q]['TIPO_EMISION'] == 2) {
            for (var i = 0; i < Response['enlaces'].length; i++) {
              lineas = lineas + '<button class="btn bg-blue btn-flat margin" onclick="registro(' + Response['enlaces'][i]['pkmodulo'] + ', 0, 0, -2, 0, \'' + Response["registros_recha"][q]['CLAVE_ACCESO'] + '\')" style="margin-bottom: 3px;padding-top: 0px;width: 100%;padding-bottom: 0px;margin-top: 3px;">' + Response['enlaces'][i]['nombre'] + '</button>'
            }
          }
          lineas = lineas + '</td>'
          lineas = lineas + '<td>' + Response["registros_recha"][q]['COMPROBANTE'] + '</td>'
          lineas = lineas + '<td>' + Response["registros_recha"][q]['SERIE_COMPROBANTE'] + '</td>'
          lineas = lineas + '<td>' + Response["registros_recha"][q]['RUC_EMISOR'] + '</td>'
          lineas = lineas + '<td>' + Response["registros_recha"][q]['RAZON_SOCIAL_EMISOR'] + '</td>'
          lineas = lineas + '<td>' + Response["registros_recha"][q]['FECHA_EMISION'] + '</td>'
          lineas = lineas + '<td style="text-align: right;">' + Response["registros_recha"][q]['IMPORTE_TOTAL'] + '</td>'
          //lineas =lineas + '<td>' + Response["registros"][q]['Estado'] + '</td>'
          lineas = lineas + '<td style="text-align: center;"><a href="/e_docs/' + tipo_int + '/' + Response["registros_recha"][q]['CLAVE_ACCESO'] + '/" target="_blank">Ver</a></td>'
          lineas = lineas + '<td style="text-align: center;">'
          if (Response["registros_recha"][q]['TIPO_EMISION'] != 1) {
            if (Response["registros_recha"][q]['Estado'] == 'Pendiente') {
              lineas = lineas + '<a class="btn btn-danger" onclick="eliminaredocs(' + Response["registros_recha"][q]['pkid'] + ',1)" style="padding: 2px 2px; margin-right: 0px; margin-left: 0px;"><span class="glyphicon glyphicon-remove-circle" aria-hidden="true"></span></a>'
            }
          }
          lineas = lineas + '</td>'
          lineas = lineas + '<td>' + Response["registros_recha"][q]['CLAVE_ACCESO'] + '</td>'
          lineas = lineas + '</tr>'
          if (Response["registros_recha"][q]['TIPO_EMISION'] == '0') {
            if (Response["registros_recha"][q]['Estado'] == 'Pendiente') {
              lineas_pendiente = lineas_pendiente + lineas
            } else {
              lineas_ingresadas = lineas_ingresadas + lineas
            }
          }
          if (Response["registros_recha"][q]['TIPO_EMISION'] == '1') {
            lineas_descartas = lineas_descartas + lineas
          }
          if (Response["registros_recha"][q]['TIPO_EMISION'] == '2') {
            lineas_aprobadas = lineas_aprobadas + lineas
          }
        }
  
  
  
  
        var div_sri = document.getElementById('docs_sri_pen')
        div_sri.innerHTML = ht + lineas_pendiente + '</tbody></table>'
  
  
  
        var div_sria = document.getElementById('docs_sri_ing')
        div_sria.innerHTML = ht + lineas_ingresadas + '</tbody></table>'
  
        //var div_sria = document.getElementById('docs_sri_apr')
        //div_sria.innerHTML = ht + lineas_aprobadas + '</tbody></table>'
  
        var div_sria = document.getElementById('docs_sri_rec')
        div_sria.innerHTML = ht + lineas_descartas + '</tbody></table>'
  
      }
    });
  
  }