var esta_grbando = 0
var esta_grbando_sri = 0
//todo bien



function edocs_desmarcar_todo() {

  var div_edos = document.getElementById('docs_sri_pen')
  for (var i = 0; i < div_edos.children[0].children[1].childElementCount; i++) {
    if (div_edos.children[0].children[1].children[i].style.display != 'none') {
      ids = div_edos.children[0].children[1].children[i].id.split('_')
      var inputcheck = document.getElementById('fact_' + ids[1])
      inputcheck.checked = false
    }
  }

}

function Importar_datos(temp_pestalla) {

  dict_pestalla["p-" + temp_pestalla]['func_cab'] = Response['func_cab']
  var cc_tabla = dict_pestalla["p-" + temp_pestalla]
  pkmodulo = dict_pestalla["p-" + temp_pestalla]["tabla"][0]["PkModulo"]

  var id_tab = pkmodulo

  html_pdf = '' //'<div class="col-md-12">'
  html_pdf = html_pdf + '<div class="box-header with-border" style="margin-left: 0px;margin-right: 0px;background: white;padding: 0px;"><div class="input-group" style="width: 100%;">'


  html_pdf = html_pdf + '<button type="button" id="" onclick="procesar_import(' + temp_pestalla + ')" class="btn bg-yellow btn-flat margin"><span> Procesar </span></button>' + ''
  html_pdf = html_pdf + '<button type="button" id="" onclick="excell_tabla_solo_cabeceras(' + temp_pestalla + ')"  class="btn bg-green btn-flat margin"><span> Bajar Formato </span></button>' + ''

  html_pdf = html_pdf + '</div></div>'


  html_pdf = html_pdf + '</div>'

  html_pdf = html_pdf + '<div class="col-md-12"><div class="row" id="lista_importa__detalle_' + temp_pestalla + '">'

  html_pdf = html_pdf + '<div class="box-body" style="padding-left: 0px; background: white;">'
  html_pdf = html_pdf + '<p>Copia y pega desde excell en el mismo orden</p>'
  const fruits = ["cmpnumsimple", "cmptxtsimple", "cmpopcmultiple", "cmpfecha", "cmpreferencia"];
  txt_tipos = ''
  arr_tipos = []
  for (qw = 0; qw < dict_pestalla["p-" + temp_pestalla]['estru'].length; qw++) {
    if (fruits.includes(dict_pestalla["p-" + temp_pestalla]['estru'][qw]['TablaCampo'])) {
      txt_tipos = txt_tipos + dict_pestalla["p-" + temp_pestalla]['estru'][qw]['Nombre'] + '...   '
      arr_tipos.push(dict_pestalla["p-" + temp_pestalla]['estru'][qw]['Nombre'])
    }
  }



  html_pdf = html_pdf + '<div class="col-md-12">'

  html_pdf = html_pdf + '<textarea id="areaImport_' + temp_pestalla + '" type="text" placeholder="' + txt_tipos + '" class="form-control col-sm-8" style="font-size: 11px; margin: 0px 43.3125px 7px 0px;"></textarea>'
  html_pdf = html_pdf + '</div>'

  html_pdf = html_pdf + '<div class="col-md-6">'
  html_pdf = html_pdf + '<p>Buenos</p><textarea readonly="readonly" id="B_areaImport_' + temp_pestalla + '" type="text" placeholder="Importados Exitosos" class="form-control col-sm-8" style="font-size: 11px; margin: 0px 43.3125px 7px 0px;"></textarea>'
  html_pdf = html_pdf + '</div>'

  html_pdf = html_pdf + '<div class="col-md-6">'
  html_pdf = html_pdf + '<p>Malos</p><textarea readonly="readonly" id="M_areaImport_' + temp_pestalla + '" type="text" placeholder="Con Error" class="form-control col-sm-8" style="font-size: 11px; margin: 0px 43.3125px 7px 0px;"></textarea>'
  html_pdf = html_pdf + '</div>'


  //html_pdf = html_pdf + '<table id="tabla_intera_5" width="100%;font-size: 11px;" class="table table-bordered bulk_action" style="background-color: white;overflow-x:auto;width: 5550px; font-size: 11px;"><thead><tr>'

  //for (qw = 0; qw < arr_tipos.length; qw++) {
  //  html_pdf = html_pdf + '<th>' + arr_tipos[qw] + '</th>'
  //}
  //html_pdf = html_pdf + '</thead><tbody></tbody></table>'

  html_pdf = html_pdf + '</div>'

  html_pdf = html_pdf + '</div>'//</div>'


  $('#rr' + temp_pestalla).html(html_pdf);

}


function procesar_import(temp_pestalla) {

  var area = document.getElementById('areaImport_' + temp_pestalla).value.split('\n')

  const fruits = ["cmpnumsimple", "cmptxtsimple", "cmpopcmultiple", "cmpfecha", "cmpreferencia"];

  txt_tipos = ''
  var arr_final = []
  var arr_med = []
  var arr_modelo = {}
  var arr_tipos = []
  for (qw = 0; qw < dict_pestalla["p-" + temp_pestalla]['estru'].length; qw++) {
    arr_modelo[dict_pestalla["p-" + temp_pestalla]['estru'][qw]['Nombre']] = 0
    if (fruits.includes(dict_pestalla["p-" + temp_pestalla]['estru'][qw]['TablaCampo'])) {
      txt_tipos = txt_tipos + dict_pestalla["p-" + temp_pestalla]['estru'][qw]['Nombre'] + '...   '
      arr_tipos.push(dict_pestalla["p-" + temp_pestalla]['estru'][qw]['Nombre'])
    }
  }


  for (var xz = 0; xz < area.length; xz++) {
    var arr_half = {}
    var linea = area[xz].split('\t')
    if (linea.length > 2) {
      for (var xz2 = 0; xz2 < linea.length; xz2++) {
        arr_half[arr_tipos[xz2]] = linea[xz2]
      }
      arr_med.push(arr_half)
    }
  }

  for (var xz = 0; xz < arr_med.length; xz++) {
    var linea = {}
    for (qw = 0; qw < dict_pestalla["p-" + temp_pestalla]['estru'].length; qw++) {
      if (dict_pestalla["p-" + temp_pestalla]['estru'][qw]['Nombre'] in arr_med[xz]) {
        linea[dict_pestalla["p-" + temp_pestalla]['estru'][qw]['Nombre']] = arr_med[xz][dict_pestalla["p-" + temp_pestalla]['estru'][qw]['Nombre']]
      }
    }
    arr_final.push(linea)
  }

  $.ajax({
    type: 'POST',
    url: '/procesar_import_proceso',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 't_pkmodulo': dict_pestalla["p-" + temp_pestalla]['tabla'][0]['PkModulo'], 'arr_final': JSON.stringify(arr_final) },
    success: function (Response) {
      alert('exito')
      if (Response['procecados'][0] == 'Si') {

      }
      var area = document.getElementById('areaImport_' + temp_pestalla).value.split('\n')
      var Barea = document.getElementById('B_areaImport_' + temp_pestalla)
      var Marea = document.getElementById('M_areaImport_' + temp_pestalla)

      for (var xz = 0; xz < Response['procecados'][1].length; xz++) {
        Barea.value = Barea.value + area[parseInt(Response['procecados'][1][xz])] + '\n'

      }
      for (var xz = 0; xz < Response['procecados'][2].length; xz++) {
        Marea.value = Marea.value + area[Response['procecados'][2][xz]] + '\n'

      }

    }
  });

}



function cambio_en_paneles_archi() {

  valor = ''
  var envio = event.target
  if (envio.type == 'select-one') {
    //opcion multiple
    envio.style.backgroundColor = envio.selectedOptions[0].style.backgroundColor
    valor = envio.value
  } else {
    envio.style.backgroundColor = 'lightcyan'
    valor = envio.files[0].name

  }

  est_id = envio.id.split("fff")
  V_campo = est_id[0]
  V_tabla = est_id[1]
  V_registro = est_id[2]




  $.ajax({
    type: 'POST',
    url: '/cambio_rapido',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'valor': valor, 'V_campo': V_campo, 'V_tabla': V_tabla, 'V_registro': V_registro },
    success: function (Response) {
      if (V_campo == 'Estado') {
        actualizar_paneles()
      }
    }
  });

}

function subir_archivo_flow(id) {

  var reader = new FileReader();

  reader.onload = function (e) {
    document.getElementById(id.id).src = e.target.result
    $(id.id).attr('src', e.target.result);
    window.cambio_img = 1
    tt_id = id.id
    tt_id = id.id + '_lbl'
    label = document.getElementById(tt_id)

    label.innerHTML = '<a href="/media/archivos/' + web_Id_empresa + '/' + document.getElementById(id.id + '').files[0].name + '" target="_blank">' + document.getElementById(id.id + '').files[0].name + '</a>'


    //const files = document.getElementById(envio_archi[x2]).files
    const files = document.getElementById(id.id + '').files
    const formData = new FormData()
    formData.append('csrfmiddlewaretoken', web_token)
    formData.append('Id_empresa', web_Id_empresa)
    formData.append('id_archivo', document.getElementById(id.id + '').files[0].name)

    for (let i = 0; i < files.length; i++) {
      let file = files[i]

      formData.append('files', file)
    }

    //fetch('/archi_carg', { method: 'POST', body: formData, }).then(response => {
    //  console.log(response)
    //  const ele_imagen = document.getElementById(id.id + '').files
    //  ele_imagen.attr('src', '/media/archivos/' + web_Id_empresa + '/' + document.getElementById(id.id + '').files[0].name);
    //})
    let headers = new Headers();

    headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1');
    headers.append('Access-Control-Allow-Methods', 'POST');
    headers.append('Access-Control-Allow-Credentials', 'true');
    headers.append('Access-Control-Allow-Headers', 'Content-Type');


    fetch('/ccimagenes/', { method: 'POST', headers: headers, body: formData, mode: 'no-cors', }).then(response => {
      console.log(response)
      const ele_imagen = document.getElementById(id.id + '_file').files
      div_imagen = document.getElementById(id.id)
      div_imagen.src = '/media/archivos/' + web_Id_empresa + '/' + document.getElementById(id.id + '_file').files[0].name
      //ele_imagen.attr('src', '/media/archivos/' + web_Id_empresa + '/' + document.getElementById(id.id + '_file').files[0].name);


    })



  }
  reader.readAsDataURL(document.getElementById(id.id + '').files[0]);
}


function pre_eliminar_dir_ficha(ids, pkmodulo, pkregistro, usuarios) {

  var l_usuarioa = document.getElementById('default_grupo_log_usuarios')
  var l_pkmodulo = document.getElementById('default_grupo_log_pk')
  var l_ids = document.getElementById('default_grupo_log_ids') //default_grupo_log_clave
  var l_pkregistro = document.getElementById('default_grupo_log_pkregistro') //default_grupo_log_clave
  var l_msg = document.getElementById('default_grupo_log_msg') //default_grupo_log_clave
  l_msg.innerHTML = ''

  l_usuarioa.innerHTML = ''
  l_pkmodulo.value = pkmodulo
  l_ids.value = ids.id

  l_pkregistro.value = pkregistro

  list_usuarios = usuarios.split(',')

  elimino = false

  for (var i = 0; i < list_usuarios.length; i++) {
    if (list_usuarios[i] == web_usuario) {
      ids.remove()
      eliminar(pkmodulo, pkregistro)
      elimino = true
      var btn_eli = document.getElementById('cerrar_default_grupo_log')
      btn_eli.click()
    }
    l_usuarioa.innerHTML = l_usuarioa.innerHTML + '<option>' + list_usuarios[i] + '</option>'
  }

  if (elimino == false) {
    var btn_abirr = document.getElementById('abrir_default_grupo_log')
    btn_abirr.click()

  }


}
function post_eliminar_dir_ficha() {


  var l_usuarioa = document.getElementById('default_grupo_log_usuarios')
  var l_pkmodulo = document.getElementById('default_grupo_log_pk')
  var l_ids = document.getElementById('default_grupo_log_ids') //default_grupo_log_clave
  var l_clave = document.getElementById('default_grupo_log_clave') //default_grupo_log_clave
  var l_pkregistro = document.getElementById('default_grupo_log_pkregistro') //default_grupo_log_clave
  var l_msg = document.getElementById('default_grupo_log_msg') //default_grupo_log_clave
  l_msg.innerHTML = ''

  $.ajax({
    type: 'POST',
    url: '/log_fast',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'inputEmpresa': web_Id_empresa, 'inputUsuario': l_usuarioa.value, 'inputPassword': l_clave.value, 'usuario': web_usuario },
    success: function (Response) {
      if (Response['resp'] == 'ok') {
        var l_usuarioa = document.getElementById('default_grupo_log_usuarios')
        var l_pkmodulo = document.getElementById('default_grupo_log_pk')
        var l_ids = document.getElementById('default_grupo_log_ids') //default_grupo_log_clave
        var l_clave = document.getElementById('default_grupo_log_clave') //default_grupo_log_clave
        var l_pkregistro = document.getElementById('default_grupo_log_pkregistro') //default_grupo_log_clave
        var l_msg = document.getElementById('default_grupo_log_msg') //default_grupo_log_clave

        eliminar_directo(l_pkmodulo.value, l_pkregistro.value)

        var ids = document.getElementById(l_ids.value)

        ids.remove()
        var btn_eli = document.getElementById('cerrar_default_grupo_log')
        btn_eli.click()


        l_clave.value = ''
        l_pkregistro.value = ''
        l_pkmodulo.value = ''


      } else {
        var l_msg = document.getElementById('default_grupo_log_msg') //default_grupo_log_clave
        l_msg.innerHTML = 'Ingreso no exitoso'
      }

    }
  });
}


function grabar_automatico_envio_parcial(t_pkmodulo, dict_claves, traspasos, t_linea) {

  var dd = document.getElementById('edocs_sri_auto_proceso')
  dd.innerHTML = 'Guardando ' + t_linea + ' de ' + dict_claves.length
  if (dict_claves.length > t_linea) {
    $.ajax({
      type: 'POST',
      url: '/grabar_automatico',
      data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 't_pkmodulo': t_pkmodulo, 'dict_claves': JSON.stringify([dict_claves[t_linea]]), 'dict_traspasos': JSON.stringify(traspasos) },
      success: function (Response) {
        if (Response['Errores'].length > 0) {
          var dd = document.getElementById('edocs_sri_auto_errores')
          dd.innerHTML = dd.innerHTML + 'Error(' + Response['Errores'][0] + ' ' + Response['msg'][0] + '), '

        }

        if (dict_claves.length > t_linea) {
          grabar_automatico_envio_parcial(t_pkmodulo, dict_claves, traspasos, t_linea + 1)
        } else {
          alert('Terminados')
          esta_grbando_sri = 0
          dd = document.getElementById('cerrar_default_sri_auto')
          //dd.click()
          actualizar_sri_docs()
        }



      },
      error: function (xhr, status, error) {
        if (xhr.statusText == 'Bad Gateway') {
          dd.innerHTML = dd.innerHTML + '<br> Error(' + Response['Errores'][0] + ' ' + 'Sri No Responde' + '), '

          if (dict_claves.length > t_linea) {
            grabar_automatico_envio_parcial(t_pkmodulo, dict_claves, traspasos, t_linea + 1)
          } else {
            alert('Terminados')
            esta_grbando_sri = 0
            dd = document.getElementById('cerrar_default_sri_auto')
            //dd.click()
            actualizar_sri_docs()
          }
        } else {
          var err = eval("(" + xhr.responseText + ")");

          dd.innerHTML = dd.innerHTML + '<br> Error(' + Response['Errores'][0] + ' ' + err.Message + '), '

          if (dict_claves.length > t_linea) {
            grabar_automatico_envio_parcial(t_pkmodulo, dict_claves, traspasos, t_linea + 1)
          } else {
            alert('Terminados')
            esta_grbando_sri = 0
            dd = document.getElementById('cerrar_default_sri_auto')
            //dd.click()
            actualizar_sri_docs()
          }
        }


      }
    });
  } else {
    alert('Terminados')
    esta_grbando_sri = 0
    dd = document.getElementById('cerrar_default_sri_auto')
    //dd.click()
    actualizar_sri_docs()
  }
}


function grabar_automatico(t_pkmodulo) {

  if (esta_grbando_sri == 0) {

    esta_grbando_sri = 1

    var dd2 = document.getElementById('edocs_sri_auto_errores')
    dd2.innerHTML = ''
    var dd = document.getElementById('edocs_sri_auto_tabla')
    var fact_num = dd.children[0].children[0].childElementCount - 1
    var dict_claves = []

    for (d1 = 1; d1 < dd.children[0].children[0].childElementCount; d1++) {
      dict_claves.push(dd.children[0].children[0].children[d1].children[8].innerText)
    }
    var divv_adds = document.getElementById('sri_' + t_pkmodulo)

    traspasos = {}

    for (d1 = 0; d1 < divv_adds.childElementCount; d1++) {
      traspasos[divv_adds.children[d1].children[1].children[0].id] = divv_adds.children[d1].children[1].children[0].value
    }

    grabar_automatico_envio_parcial(t_pkmodulo, dict_claves, traspasos, 0)


  } else {
    alert('Grabando por favor espere')
  }

}

function grabar_automatico2(t_pkmodulo) {
  var dd = document.getElementById('edocs_sri_auto_tabla')
  var fact_num = dd.children[0].children[0].childElementCount - 1
  var dict_claves = []

  for (d1 = 1; d1 < dd.children[0].children[0].childElementCount; d1++) {
    dict_claves.push(dd.children[0].children[0].children[d1].children[8].innerText)
  }
  var divv_adds = document.getElementById('sri_' + t_pkmodulo)

  traspasos = {}

  for (d1 = 0; d1 < divv_adds.childElementCount; d1++) {
    traspasos[divv_adds.children[d1].children[1].children[0].id] = divv_adds.children[d1].children[1].children[0].value
  }


  if (dict_claves.length > 0) {
    $.ajax({
      type: 'POST',
      url: '/grabar_automatico',
      data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 't_pkmodulo': t_pkmodulo, 'dict_claves': JSON.stringify(dict_claves), 'dict_traspasos': JSON.stringify(traspasos) },
      success: function (Response) {

        alert('f')


      }
    });
  }
}

function edocs_sri_auto(ipkid, input) {

  if (input.checked == true) {
    var linea_int = document.getElementById(ipkid.id)
    fila = '<tr id="int_' + ipkid.id + '">'


    fila = fila + '<td><input type="checkbox" onclick="edocs_sri_auto(' + ipkid.id + ', this)" checked></td>'//Descartar

    fila = fila + '<td>' + linea_int.children[2].innerText + '</td>'//Comprobante
    fila = fila + '<td>' + linea_int.children[3].innerText + '</td>'///Numero
    fila = fila + '<td>' + linea_int.children[4].innerText + '</td>'//Ruc
    fila = fila + '<td>' + linea_int.children[5].innerText + '</td>'//Razon Social
    fila = fila + '<td>' + linea_int.children[6].innerText + '</td>'//Fecha
    fila = fila + '<td>' + linea_int.children[7].innerText + '</td>'//Total
    fila = fila + '<td>' + linea_int.children[8].innerHTML + '</td>'//Archivos
    fila = fila + '<td>' + linea_int.children[10].innerText + '</td>'//Clave


    fila = fila + '</tr>'


    $('#edocs_sri_auto_tabla tr:first').after(fila);




  } else {
    tr_linea = document.getElementById('int_' + ipkid.id)
    tr_linea.remove()
    var id_ne = ipkid.id.split('_')
    if (id_ne.length == 2) {
      input_int = document.getElementById('fact_' + id_ne[1])
      input_int.checked = false

    }
  }


  var dd = document.getElementById('edocs_sri_auto_tabla')
  var fact_num = dd.children[0].children[0].childElementCount - 1
  var fact_total = 0

  for (d1 = 1; d1 < dd.children[0].children[0].childElementCount; d1++) {
    fact_total = parseFloat(fact_total) + parseFloat(dd.children[0].children[0].children[d1].children[6].innerText)
  }

  var dc = document.getElementById('edocs_sri_auto_cant')
  dc.innerText = 'Cantidad: ' + fact_num

  var dv = document.getElementById('edocs_sri_auto_val')
  dv.innerText = 'Total: ' + fact_total



}


function abrir_SRI_sem() {
  var sri_periodo = document.getElementById("fecha_sri_periodo").value
  var sri_anio = document.getElementById("fecha_sri_anio").value

  $.ajax({
    type: 'POST',
    url: '/traer_sri_ATS_sem',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'sri_anio': sri_anio, 'sri_periodo': sri_periodo },
    beforeSend: function () { },
    success: function (Response) {

      ats = Response['ats_valores']
      //--------------------ats XML
      xmltext = '<?xml version="1.0" encoding="UTF-8"?><iva>'

      xmltext = xmltext + '<TipoIDInformante>' + ats["cabecera"][0]["TipoIDInformante"] + '</TipoIDInformante>'
      xmltext = xmltext + '<IdInformante>' + ats["cabecera"][0]["IdInformante"] + '</IdInformante>'
      xmltext = xmltext + '<razonSocial>' + ats["cabecera"][0]["razonSocial"] + '</razonSocial>'
      xmltext = xmltext + '<Anio>' + sri_anio + '</Anio>'
      xmltext = xmltext + '<Mes>' + sri_periodo + '</Mes>'
      xmltext = xmltext + '<numEstabRuc>' + (1000 + ats["atsCountEstab"][0]["sumCodEstab"]).toString().substring(1) + '</numEstabRuc>'
      xmltext = xmltext + '<totalVentas>' + ats["atsSumEstab_sep_2016"][0]["sumaEstab"] + '</totalVentas>'
      xmltext = xmltext + '<codigoOperativo>' + ats["cabecera"][0]["codigoOperativo"] + '</codigoOperativo>'



      xmltext = xmltext + '<compras>'

      for (d1 = 0; d1 < ats["atmcompras"].length; d1++) {

        xmltext = xmltext + '<detalleCompras>'
        xmltext = xmltext + '<codSustento>' + ats["atmcompras"][d1]['codSustento'] + '</codSustento>'
        xmltext = xmltext + '<tpIdProv>' + ats["atmcompras"][d1]['tpIdProv'] + '</tpIdProv>'
        xmltext = xmltext + '<idProv>' + ats["atmcompras"][d1]['idProv'] + '</idProv>'
        xmltext = xmltext + '<tipoComprobante>' + ats["atmcompras"][d1]['tipoComprobante'] + '</tipoComprobante>'
        xmltext = xmltext + '<parteRel>' + ats["atmcompras"][d1]['parteRel'] + '</parteRel>'
        xmltext = xmltext + '<fechaRegistro>' + ats["atmcompras"][d1]['fechaRegistro'] + '</fechaRegistro>'
        xmltext = xmltext + '<establecimiento>' + ats["atmcompras"][d1]['establecimiento'] + '</establecimiento>'
        xmltext = xmltext + '<puntoEmision>' + ats["atmcompras"][d1]['puntoEmision'] + '</puntoEmision>'
        xmltext = xmltext + '<secuencial>' + ats["atmcompras"][d1]['secuencial'] + '</secuencial>'
        xmltext = xmltext + '<fechaEmision>' + ats["atmcompras"][d1]['fechaEmision'] + '</fechaEmision>'
        xmltext = xmltext + '<autorizacion>' + ats["atmcompras"][d1]['autorizacion'] + '</autorizacion>'
        xmltext = xmltext + '<baseNoGraIva>' + ats["atmcompras"][d1]['baseNoGraIva'] + '</baseNoGraIva>'
        xmltext = xmltext + '<baseImponible>' + ats["atmcompras"][d1]['baseImponible'] + '</baseImponible>'
        xmltext = xmltext + '<baseImpGrav>' + ats["atmcompras"][d1]['baseImpGrav'] + '</baseImpGrav>'
        xmltext = xmltext + '<baseImpExe>' + ats["atmcompras"][d1]['baseImpExe'] + '</baseImpExe>'
        xmltext = xmltext + '<montoIce>' + ats["atmcompras"][d1]['montoIce'] + '</montoIce>'
        xmltext = xmltext + '<montoIva>' + ats["atmcompras"][d1]['montoIva'] + '</montoIva>'
        xmltext = xmltext + '<valRetBien10>' + ats["atmcompras"][d1]['valRetBien10'] + '</valRetBien10>'
        xmltext = xmltext + '<valRetServ20>' + ats["atmcompras"][d1]['valRetServ20'] + '</valRetServ20>'
        xmltext = xmltext + '<valorRetBienes>' + ats["atmcompras"][d1]['valorRetBienes'] + '</valorRetBienes>'
        xmltext = xmltext + '<valRetServ50>' + ats["atmcompras"][d1]['valRetServ50'] + '</valRetServ50>'
        xmltext = xmltext + '<valorRetServicios>' + ats["atmcompras"][d1]['valorRetServicios'] + '</valorRetServicios>'
        xmltext = xmltext + '<valRetServ100>' + ats["atmcompras"][d1]['valRetServ100'] + '</valRetServ100>'
        xmltext = xmltext + '<totbasesImpReemb>' + ats["atmcompras"][d1]['totbasesImpReemb'] + '</totbasesImpReemb>'
        xmltext = xmltext + '<pagoExterior>'
        xmltext = xmltext + '<pagoLocExt>01</pagoLocExt>'
        xmltext = xmltext + '<paisEfecPago>NA</paisEfecPago>'
        xmltext = xmltext + '<aplicConvDobTrib>NA</aplicConvDobTrib>'
        xmltext = xmltext + '<pagExtSujRetNorLeg>NA</pagExtSujRetNorLeg>'
        xmltext = xmltext + '<pagoRegFis>NA</pagoRegFis>'
        xmltext = xmltext + '</pagoExterior>'

        if ((parseFloat(ats["atmcompras"][d1]['baseNoGraIva']) + parseFloat(ats["atmcompras"][d1]['baseImponible']) + parseFloat(ats["atmcompras"][d1]['baseImpGrav']) + parseFloat(ats["atmcompras"][d1]['montoIva']) + parseFloat(ats["atmcompras"][d1]['montoIce'])) >= 1000) {
          xmltext = xmltext + '<formasDePago>'
          xmltext = xmltext + '<formaPago>20</formaPago>'

          xmltext = xmltext + '</formasDePago>'
        }


        if (ats["atmcompras"][d1]['tipoComprobante'] == '04' || ats["atmcompras"][d1]['tipoComprobante'] == '05') {

          xmltext = xmltext + '<docModificado>' + ats["atmcompras"][d1]['docModificado'] + '</docModificado>'
          xmltext = xmltext + '<estabModificado>' + ats["atmcompras"][d1]['estabModificado'] + '</estabModificado>'
          xmltext = xmltext + '<ptoEmiModificado>' + ats["atmcompras"][d1]['ptoEmiModificado'] + '</ptoEmiModificado>'
          xmltext = xmltext + '<secModificado>' + ats["atmcompras"][d1]['secModificado'] + '</secModificado>'
          xmltext = xmltext + '<autModificado>' + ats["atmcompras"][d1]['autModificado'] + '</autModificado>'

        } else {

          xml_ret = '<air>'

          for (d2 = 0; d2 < ats["atmcompras_detalle_ret"].length; d2++) {
            if (ats["atmcompras_detalle_ret"][d2]["Pk"] == ats["atmcompras"][d1]['Pk']) {
              if (ats["atmcompras_detalle_ret"][d2]["codRetAir"] != '0') {
                if (ats["atmcompras_detalle_ret"][d2]["codRetAir"] != '1') {
                  if (ats["atmcompras_detalle_ret"][d2]["codRetAir"] != '2') {
                    xml_ret = xml_ret + '<detalleAir>'
                    xml_ret = xml_ret + '<codRetAir>' + ats["atmcompras_detalle_ret"][d2]["codRetAir"] + '</codRetAir>'
                    xml_ret = xml_ret + '<baseImpAir>' + ats["atmcompras_detalle_ret"][d2]["baseImpAir"] + '</baseImpAir>'
                    xml_ret = xml_ret + '<porcentajeAir>' + ats["atmcompras_detalle_ret"][d2]["porcentajeAir"] + '</porcentajeAir>'
                    xml_ret = xml_ret + '<valRetAir>' + ats["atmcompras_detalle_ret"][d2]["valRetAir"] + '</valRetAir>'
                    xml_ret = xml_ret + '</detalleAir>'
                  }
                }
              }
            }
          }

          if (xml_ret != '<air>') {
            xmltext = xmltext + xml_ret + '</air>'
          }

          if (parseFloat(ats["atmcompras"][d1]['secRetencion1']) > 0) {
            xmltext = xmltext + '<estabRetencion1>' + ats["atmcompras"][d1]['estabRetencion1'] + '</estabRetencion1>'
            xmltext = xmltext + '<ptoEmiRetencion1>' + ats["atmcompras"][d1]['ptoEmiRetencion1'] + '</ptoEmiRetencion1>'
            xmltext = xmltext + '<secRetencion1>' + ats["atmcompras"][d1]['secRetencion1'] + '</secRetencion1>'
            xmltext = xmltext + '<autRetencion1>' + ats["atmcompras"][d1]['autRetencion1'] + '</autRetencion1>'
            xmltext = xmltext + '<fechaEmiRet1>' + ats["atmcompras"][d1]['fechaEmiRet1'] + '</fechaEmiRet1>'
          }
        }
        xmltext = xmltext + '</detalleCompras>'

      }


      xmltext = xmltext + '</compras>'

      xmltext = xmltext + '<ventas>'

      for (d1 = 0; d1 < ats["atmventas_sep_2016"].length; d1++) {

        xmltext = xmltext + '<detalleVentas>'
        xmltext = xmltext + '<tpIdCliente>' + ats["atmventas_sep_2016"][d1]['tpIdCliente'] + '</tpIdCliente>'
        xmltext = xmltext + '<idCliente>' + ats["atmventas_sep_2016"][d1]['idCliente'] + '</idCliente>'

        if (ats["atmventas_sep_2016"][d1]['tpIdCliente'] != '07') {
          xmltext = xmltext + '<parteRelVtas>' + ats["atmventas_sep_2016"][d1]['parteRelVtas'] + '</parteRelVtas>'
        }
        if (ats["atmventas_sep_2016"][d1]['tpIdCliente'] == '06') {
          xmltext = xmltext + '<tipoCliente>02</tipoCliente>'
          xmltext = xmltext + '<denoCli>' + ats["atmventas_sep_2016"][d1]['CLIENTE'] + '</denoCli>'
        }
        xmltext = xmltext + '<tipoComprobante>' + ats["atmventas_sep_2016"][d1]['tipoComprobante'] + '</tipoComprobante>'
        xmltext = xmltext + '<tipoEmision>' + ats["atmventas_sep_2016"][d1]['tipoEmision'] + '</tipoEmision>'
        xmltext = xmltext + '<numeroComprobantes>' + ats["atmventas_sep_2016"][d1]['numeroComprobantes'] + '</numeroComprobantes>'
        xmltext = xmltext + '<baseNoGraIva>' + ats["atmventas_sep_2016"][d1]['baseNoGraIva'] + '</baseNoGraIva>'
        xmltext = xmltext + '<baseImponible>' + ats["atmventas_sep_2016"][d1]['baseImponible'] + '</baseImponible>'
        xmltext = xmltext + '<baseImpGrav>' + ats["atmventas_sep_2016"][d1]['baseImpGrav'] + '</baseImpGrav>'
        xmltext = xmltext + '<montoIva>' + ats["atmventas_sep_2016"][d1]['montoIva'] + '</montoIva>'

        if (parseFloat(ats["atmventas_sep_2016"][d1]['monto1']) > 0) {
          xmltext = xmltext + '<compensaciones><compensacion>'
          xmltext = xmltext + '<tipoCompe>' + ats["atmventas_sep_2016"][d1]['tipoCompe1'] + '</tipoCompe>'
          xmltext = xmltext + '<monto>' + ats["atmventas_sep_2016"][d1]['monto1'] + '</monto>'
          xmltext = xmltext + '</compensacion>'
          if (parseFloat(ats["atmventas_sep_2016"][d1]['monto2']) > 0) {
            xmltext = xmltext + '<compensacion>'
            xmltext = xmltext + '<tipoCompe>' + ats["atmventas_sep_2016"][d1]['tipoCompe2'] + '</tipoCompe>'
            xmltext = xmltext + '<monto>' + ats["atmventas_sep_2016"][d1]['monto2'] + '</monto>'
            xmltext = xmltext + '</compensacion>'
          }
          xmltext = xmltext + '</compensaciones>'
        }


        xmltext = xmltext + '<montoIce>' + ats["atmventas_sep_2016"][d1]['montoIce'] + '</montoIce>'
        xmltext = xmltext + '<valorRetIva>' + ats["atmventas_sep_2016"][d1]['valorRetIva'] + '</valorRetIva>'
        xmltext = xmltext + '<valorRetRenta>' + ats["atmventas_sep_2016"][d1]['valorRetRenta'] + '</valorRetRenta>'

        if (ats["atmventas_sep_2016"][d1]['tipoComprobante'] == "18") {
          xmltext = xmltext + '<formasDePago>'
          xmltext = xmltext + '<formaPago>20</formaPago>'
          xmltext = xmltext + '</formasDePago>'
        }
        xmltext = xmltext + '</detalleVentas>'
      }
      xmltext = xmltext + '</ventas>'


      xmltext = xmltext + '<ventasEstablecimiento>'
      for (d1 = 0; d1 < ats["ventasEstablecimiento_sep_2016"].length; d1++) {
        xmltext = xmltext + '<ventaEst>'
        xmltext = xmltext + '<codEstab>' + ats["ventasEstablecimiento_sep_2016"][d1]['codEstab'] + '</codEstab>'
        xmltext = xmltext + '<ventasEstab>' + ats["ventasEstablecimiento_sep_2016"][d1]['ventasEstab'] + '</ventasEstab>'
        xmltext = xmltext + '<ivaComp>' + ats["ventasEstablecimiento_sep_2016"][d1]['ivaComp'] + '</ivaComp>'
        xmltext = xmltext + '</ventaEst>'
      }
      xmltext = xmltext + '</ventasEstablecimiento>'


      if (ats["atmanuladas"].length > 0) {
        xmltext = xmltext + '<anulados>'
        for (d1 = 0; d1 < ats["atmanuladas"].length; d1++) {
          xmltext = xmltext + '<detalleAnulados>'
          xmltext = xmltext + '<tipoComprobante>' + ats["atmanuladas"][d1]['TipoComprobante'] + '</tipoComprobante>'
          xmltext = xmltext + '<establecimiento>' + ats["atmanuladas"][d1]['Establecimiento'] + '</establecimiento>'
          xmltext = xmltext + '<puntoEmision>' + ats["atmanuladas"][d1]['PuntoEmision'] + '</puntoEmision>'
          xmltext = xmltext + '<secuencialInicio>' + ats["atmanuladas"][d1]['Secuencialinicio'] + '</secuencialInicio>'
          xmltext = xmltext + '<secuencialFin>' + ats["atmanuladas"][d1]['Secuencialfin'] + '</secuencialFin>'
          xmltext = xmltext + '<autorizacion>' + ats["atmanuladas"][d1]['Autorizacion'] + '</autorizacion>'
          xmltext = xmltext + '</detalleAnulados>'
        }

        xmltext = xmltext + '</anulados>'
      }


      xmltext = xmltext + '</iva>'

      hacer_xml(xmltext, ("ats" + sri_anio + "-" + sri_periodo))
      //--------------------ats XML
    }
  });
}




function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
    y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
  };
}
function mouse_over_click_en_canvas_panel(pkpanel) {
  var canvas_di = document.getElementById("mapa_" + pkpanel)

  var tt = getMousePos(canvas_di, event)
  //alert(tt['x'] + ' - ' + tt['y'])


  var t_x = parseInt(tt['x'])
  var t_y = parseInt(tt['y']) * -1

  //var ff = document.getElementById('logo_cia_p')
  //ff.innerHTML = t_x + ' - ' + t_y


  for (hijo = 0; hijo < canvas_di.childElementCount; hijo++) {
    var dd = canvas_di.children[hijo].innerText.split(';')

    //dd[0] == X arr
    //dd[1] == Y arr

    cruza = 0
    //por cada hijo
    lx = dd[0].split(',')
    ly = dd[1].split(',')

    rectas = []

    M = parseFloat(t_y) / parseFloat(t_x)
    rect_punt = { 'M': M, 'x1': 0, 'y1': 0, 'x2': t_x, 'y2': t_y }


    for (puntos = 1; puntos < lx.length; puntos++) {
      M = (parseFloat(ly[puntos - 1]) - parseFloat(ly[puntos])) / (parseFloat(lx[puntos]) - parseFloat(lx[puntos - 1]))
      rectas.push({ 'M': M, 'x1': lx[puntos - 1], 'y1': ly[puntos - 1] * -1, 'x2': lx[puntos], 'y2': ly[puntos] * -1 })

    }
    M = (parseFloat(ly[lx.length - 1] * -1) - parseFloat(ly[0] * -1)) / (parseFloat(lx[lx.length - 1]) - parseFloat(lx[0]))

    rectas.push({ 'M': M, 'x1': lx[lx.length - 1], 'y1': ly[lx.length - 1] * -1, 'x2': lx[0], 'y2': ly[0] * -1 })

    t_y2 = t_y
    toca = 0
    pega = 0

    for (rec = 0; rec < rectas.length; rec++) {
      // recta punto selc
      //  y = rect_punt['M'] * x

      // recta punto grap
      // y - y1 = rectas['rec']['M'] *(x - x1)
      // y = rectas['rec']['M'] *(x - x1) + y1

      //rect_punt['M'] * x == rectas['rec']['M'] *(x - x1) + y1
      // rect_punt['M'] * x == rectas['rec']['M']* x - rectas['rec']['M']* x1 + y1
      // rect_punt['M'] * x - rectas['rec']['M']* x ==  - rectas['rec']['M']* x1 + y1
      //x (rect_punt['M'] - rectas['rec']['M']) =  - rectas['rec']['M']* x1 + y1
      // x  =  (- rectas['rec']['M']* x1 + y1) / (rect_punt['M'] - rectas['rec']['M'])


      //  y = rect_punt['M'] * x
      // y = rectas['rec']['M'] *(x - x1) + y1

      cru_x = (- (rectas[rec]['M'] * rectas[rec]['x1']) + rectas[rec]['y1']) / (rect_punt['M'] - rectas[rec]['M'])
      cru_y = rect_punt['M'] * cru_x



      if (cru_x <= t_x) {
        if (cru_y >= t_y) {

          if (parseFloat(rectas[rec]['x1']) > parseFloat(rectas[rec]['x2'])) {
            xMas = parseFloat(rectas[rec]['x1'])
            xMen = parseFloat(rectas[rec]['x2'])
          } else {
            xMas = parseFloat(rectas[rec]['x2'])
            xMen = parseFloat(rectas[rec]['x1'])
          }
          if (parseFloat(rectas[rec]['y1']) > parseFloat(rectas[rec]['y2'])) {
            yMas = parseFloat(rectas[rec]['y1'])
            yMen = parseFloat(rectas[rec]['y2'])
          } else {
            yMas = parseFloat(rectas[rec]['y2'])
            yMen = parseFloat(rectas[rec]['y1'])
          }
          if (xMen <= cru_x && cru_x <= xMas) {
            if (yMen <= cru_y && cru_y <= yMas) {
              pega = pega + 1
            }
          }
        }
      }
    }

    if (pega > 0) {
      if ((pega % 2) != 0) {
        canvas_di.style.cursor = "pointer";
        // tcc = document.getElementById('selector')
        //tcc.innerHTML = dd
        break
      } else {
        canvas_di.style.cursor = "default";
      }
    } else {
      canvas_di.style.cursor = "default";
    }

  }

}



function click_en_canvas_panel(pkpanel) {
  var canvas_di = document.getElementById("mapa_" + pkpanel)

  var tt = getMousePos(canvas_di, event)
  //alert(tt['x'] + ' - ' + tt['y'])


  var t_x = parseInt(tt['x'])
  var t_y = parseInt(tt['y']) * -1


  for (hijo = 0; hijo < canvas_di.childElementCount; hijo++) {
    var dd = canvas_di.children[hijo].innerText.split(';')

    //dd[0] == X arr
    //dd[1] == Y arr

    cruza = 0
    //por cada hijo
    lx = dd[0].split(',')
    ly = dd[1].split(',')

    rectas = []

    M = parseFloat(t_y) / parseFloat(t_x)
    rect_punt = { 'M': M, 'x1': 0, 'y1': 0, 'x2': t_x, 'y2': t_y }


    for (puntos = 1; puntos < lx.length; puntos++) {
      M = (parseFloat(ly[puntos - 1]) - parseFloat(ly[puntos])) / (parseFloat(lx[puntos]) - parseFloat(lx[puntos - 1]))
      rectas.push({ 'M': M, 'x1': lx[puntos - 1], 'y1': ly[puntos - 1] * -1, 'x2': lx[puntos], 'y2': ly[puntos] * -1 })

    }
    M = (parseFloat(ly[lx.length - 1] * -1) - parseFloat(ly[0] * -1)) / (parseFloat(lx[lx.length - 1]) - parseFloat(lx[0]))

    rectas.push({ 'M': M, 'x1': lx[lx.length - 1], 'y1': ly[lx.length - 1] * -1, 'x2': lx[0], 'y2': ly[0] * -1 })

    t_y2 = t_y
    toca = 0
    pega = 0

    for (rec = 0; rec < rectas.length; rec++) {
      // recta punto selc
      //  y = rect_punt['M'] * x

      // recta punto grap
      // y - y1 = rectas['rec']['M'] *(x - x1)
      // y = rectas['rec']['M'] *(x - x1) + y1

      //rect_punt['M'] * x == rectas['rec']['M'] *(x - x1) + y1
      // rect_punt['M'] * x == rectas['rec']['M']* x - rectas['rec']['M']* x1 + y1
      // rect_punt['M'] * x - rectas['rec']['M']* x ==  - rectas['rec']['M']* x1 + y1
      //x (rect_punt['M'] - rectas['rec']['M']) =  - rectas['rec']['M']* x1 + y1
      // x  =  (- rectas['rec']['M']* x1 + y1) / (rect_punt['M'] - rectas['rec']['M'])


      //  y = rect_punt['M'] * x
      // y = rectas['rec']['M'] *(x - x1) + y1

      cru_x = (- (rectas[rec]['M'] * rectas[rec]['x1']) + rectas[rec]['y1']) / (rect_punt['M'] - rectas[rec]['M'])
      cru_y = rect_punt['M'] * cru_x



      if (cru_x <= t_x) {
        if (cru_y >= t_y) {

          if (parseFloat(rectas[rec]['x1']) > parseFloat(rectas[rec]['x2'])) {
            xMas = parseFloat(rectas[rec]['x1'])
            xMen = parseFloat(rectas[rec]['x2'])
          } else {
            xMas = parseFloat(rectas[rec]['x2'])
            xMen = parseFloat(rectas[rec]['x1'])
          }
          if (parseFloat(rectas[rec]['y1']) > parseFloat(rectas[rec]['y2'])) {
            yMas = parseFloat(rectas[rec]['y1'])
            yMen = parseFloat(rectas[rec]['y2'])
          } else {
            yMas = parseFloat(rectas[rec]['y2'])
            yMen = parseFloat(rectas[rec]['y1'])
          }
          if (xMen <= cru_x && cru_x <= xMas) {
            if (yMen <= cru_y && cru_y <= yMas) {
              pega = pega + 1
            }
          }
        }
      }
    }

    if (pega > 0) {
      if ((pega % 2) != 0) {
        modal_valor_buscar_referencia_ficha_imagen(dd[2], dd[3])
        break
      }
    }

  }

}






function edocs_filtro_datos() {
  var filtro_sri = document.getElementById('edocs_filtro_sri')
  var tipo_sri = 'Todos'

  var div_sri = document.getElementById('docs_sri_pen')
  var lineas = div_sri.children[0].children[1]

  for (qw = 0; qw < lineas.childElementCount; qw++) {
    lin_ok = true

    if (filtro_sri.value.length > 0) {
      if (lineas.children[qw].innerText.toString().toUpperCase().match(filtro_sri.value.toUpperCase()) == null) {
        lin_ok = false
      }
    }
    if (lin_ok == true) {
      lineas.children[qw].style.display = ''
    } else {
      lineas.children[qw].style.display = 'none'
    }
  }

  var div_sri2 = document.getElementById('docs_sri_ing')
  var lineas2 = div_sri2.children[0].children[1]

  for (qw = 0; qw < lineas2.childElementCount; qw++) {
    lin_ok = true
    if (filtro_sri.value.length > 0) {
      if (lineas2.children[qw].innerText.toString().toUpperCase().match(filtro_sri.value.toUpperCase()) == null) {
        lin_ok = false
      }
    }
    if (lin_ok == true) {
      lineas2.children[qw].style.display = ''
    } else {
      lineas2.children[qw].style.display = 'none'
    }
  }

  //var div_sri2 = document.getElementById('docs_sri_apr')
  //var lineas2 = div_sri2.children[0].children[1]

  //for (qw = 0; qw < lineas2.childElementCount; qw++) {
  //  lin_ok = true
  //  if (filtro_sri.value.length > 0) {
  //    if (lineas2.children[qw].innerText.toString().toUpperCase().match(filtro_sri.value.toUpperCase()) == null) {
  //      lin_ok = false
  //    }
  //  }
  //  if (lin_ok == true) {
  //    lineas2.children[qw].style.display = ''
  //  } else {
  //    lineas2.children[qw].style.display = 'none'
  //  }
  //}

  var div_sri2 = document.getElementById('docs_sri_rec')
  var lineas2 = div_sri2.children[0].children[1]

  for (qw = 0; qw < lineas2.childElementCount; qw++) {
    lin_ok = true
    if (filtro_sri.value.length > 0) {
      if (lineas2.children[qw].innerText.toString().toUpperCase().match(filtro_sri.value.toUpperCase()) == null) {
        lin_ok = false
      }
    }
    if (lin_ok == true) {
      lineas2.children[qw].style.display = ''
    } else {
      lineas2.children[qw].style.display = 'none'
    }
  }

}

function cargar_sriData() {

  var fecha_sri_date = document.getElementById('edocs_fecha_sri_anio').value + '-' + document.getElementById('edocs_fecha_sri_mes').value + '-01'

  const files = document.getElementById('edocs_data_sri').files
  const formData = new FormData()
  formData.append('csrfmiddlewaretoken', web_token)
  formData.append('Id_empresa', web_Id_empresa)
  formData.append('id_archivo', 'data')
  formData.append('t_fecha', fecha_sri_date)
  formData.append('id_ruc', web_numeroRuc)

  var div_sri = document.getElementById('docs_sri_pen')
  div_sri.innerHTML = 'Cargando información....'

  var div_sria = document.getElementById('docs_sri_ing')
  div_sria.innerHTML = 'Cargando información....'

  if (files.length > 0) {
    var fr = new FileReader();
    fr.onload = function () {
      var lineas_ini = fr.result
      var lineas = lineas_ini.toString().split('\n')
      var json_lineas = {}
      for (q = 0; q < lineas.length; q++) {
        try {
          var indi = lineas[q].split('\t')
          json_tmp = {}
          if (indi[0] == 'Factura' || indi[0].replace('�', '') == 'Comprobante de Retencin' || indi[0].replace('�', '') == 'Notas de Crdito') {
            var numeros = indi[1].split("-")
            json_tmp['tipo'] = indi[0].replace('�', '')
            json_tmp['estab'] = numeros[0]
            json_tmp['punto'] = numeros[1]
            json_tmp['numero'] = numeros[2]
            json_tmp['emisor_id'] = indi[2]
            if (indi[0] == 'Factura') { json_tmp['valor'] = lineas[q + 1] } else { json_tmp['valor'] = 0 }
            if (indi.length == 11) {
              json_tmp['emisor_razon'] = devolver_razon(indi[3])
              json_tmp['fecha'] = devolver_fecha(indi[4])
              json_tmp['recp_id'] = indi[8]
              json_tmp['autorizacion'] = indi[9]
              json_tmp['clave'] = indi[10]
            } else {
              json_tmp['emisor_razon'] = devolver_razon(indi[3] + ' ' + indi[4])
              json_tmp['fecha'] = devolver_fecha(indi[5])
              json_tmp['recp_id'] = indi[9]
              json_tmp['autorizacion'] = indi[10]
              json_tmp['clave'] = indi[11]
            }
            //json_lineas.push(json_tmp)
            if (json_tmp['recp_id'] == web_numeroRuc || (json_tmp['recp_id']+'001') == web_numeroRuc ) {
              json_lineas[json_tmp['clave']] = json_tmp
            }
          }
        } catch (error) { }
      }
      enviar_sri(json_lineas, 0)
    }
    fr.readAsText(files[0]);
  }
}


function devolver_razon(razon) {
  return razon
}

function enviar_sri(jsaon, indexx) {
  var fecha_sri_date = document.getElementById('edocs_fecha_sri_anio').value + '-' + document.getElementById('edocs_fecha_sri_mes').value + '-01'


  envio = {}
  for (i = 0; i < 100; i++) {
    if (Object.keys(jsaon).length > indexx) {
      envio[Object.keys(jsaon)[indexx]] = jsaon[Object.keys(jsaon)[indexx]]
      indexx = indexx + 1
    } else {
      break
    }
  }

  $.ajax({
    type: 'POST',
    url: '/edocs_subir_sri',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 't_fecha': fecha_sri_date, 'envio': JSON.stringify(envio) }, // H:i:s
    success: function (Response) {
      if (Object.keys(jsaon).length > indexx) {

        var div_sri = document.getElementById('docs_sri_pen')
        div_sri.innerHTML = 'Cargando información....' + indexx + ' de ' + Object.keys(jsaon).length

        var div_sria = document.getElementById('docs_sri_ing')
        div_sria.innerHTML = 'Cargando información....' + indexx + ' de ' + Object.keys(jsaon).length

        enviar_sri(jsaon, indexx)
      } else {
        actualizar_sri_docs()
      }
    }
  });
}

function devolver_fecha(txt_fecha) {
  arr_date = txt_fecha.split("/")
  return arr_date[2] + "-" + arr_date[1] + "-" + arr_date[0]

}



function eliminaredocs(pkid, t_estado_sri) {

  //1 descarta
  //2 aprueba

  $.ajax({
    type: 'POST',
    url: '/edocs_eliminaredocs',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 't_pkid': pkid, 't_estado_sri': t_estado_sri }, // H:i:s
    success: function (Response) {
      var line = document.getElementById("edcos_" + Response['pkid'])

      line.remove()


    }
  });

}


function edocs_traer_todo(este) {

  var div_edos = document.getElementById('docs_sri_pen')
  for (var i = 0; i < div_edos.children[0].children[1].childElementCount; i++) {
    if (div_edos.children[0].children[1].children[i].style.display != 'none') {
      ids = div_edos.children[0].children[1].children[i].id.split('_')
      var inputcheck = document.getElementById('fact_' + ids[1])
      if (este.checked == true) {
        inputcheck.checked = true
      } else {
        inputcheck.checked = false
      }
      edocs_sri_auto(div_edos.children[0].children[1].children[i], inputcheck)

    }
  }

}









function amiles() {

  return false

}



function grabardet_rapido() {
  cc_pesta = document.getElementById("hdetalle_rapido").value

  llenado = document.getElementById("detalle_rapido").value
  var lineas = llenado.split("\n")

  if (lineas.length > 0) {

    for (xq = 0; xq < (cc_porPesta["p-" + cc_pesta] + 2); xq++) {
      menos_sin_cal(cc_pesta, xq, 1)
    }

    linea_inicial = cc_porPesta["p-" + cc_pesta]

    for (xq = lineas.length - 1; xq > -1; xq--) {

      mas(cc_pesta)
      var valores = lineas[xq].split("\t")

      for (xq2 = 0; xq2 < valores.length; xq2++) {
        id_tag_det = 'pd' + cc_pesta + 'fff' + cc_porPesta["p-" + cc_pesta] + 'ccc' + dict_pestalla["p-" + cc_pesta]["campos_det"][xq2 + 2]['Nombre']
        if (document.getElementById(id_tag_det) == null) { } else {
          var block_campo = document.getElementById(id_tag_det)
          block_campo.value = valores[xq2]
        }
      }
    }
  }
}

function det_rapido(temp_pestalla) {
  document.getElementById("hdetalle_rapido").value = temp_pestalla

}

function cambioValor_pdf(campo, temp_pestalla) {
  val_id = campo.id.split('fff')
  val_pest = val_id[1]
  flujo = val_id[0].substring(3)
  div_can = document.getElementById("myCanvas" + val_pest)
  if (flujo == "Alto") { div_can.style.height = (campo.value + 'cm') }
  if (flujo == "Ancho") { div_can.style.width = (campo.value + 'cm') }
  hacerPdfPrev(temp_pestalla)

}

function hacerPdfPrev(temp_pestalla) {

  pdf_may[temp_pestalla]["lista_pdf"][0]

  listado_seg = pdf_may[temp_pestalla]["lista_pdf"][pdf_may[temp_pestalla]["pdfs"][0]["PkPlantilla"]]
  t_pkplan = pdf_may[temp_pestalla]["pdfs"][0]["PkPlantilla"]

  var canv = document.getElementById("myCanvas" + temp_pestalla)
  ydetalle = document.getElementById('pdfCabfff' + temp_pestalla).value

  canv.innerHTML = ''
  aju = 0.3

  for (x = 0; x < listado_seg["Cabecera"]['eti'].length; x++) {

    if (listado_seg["Cabecera"]['eti'][x]['TipoLetra'] == 'Logo') {
      tamano = listado_seg["Cabecera"]['eti'][x]['Tamano'].split(',')

      eti_html = '<img style="margin-left: ' + listado_seg["Cabecera"]['eti'][x]['X'] + 'cm;margin-top: ' + (parseFloat(listado_seg["Cabecera"]['eti'][x]['Y']) + aju + parseFloat(ydetalle)) + 'cm;font-size: ' + listado_seg["Cabecera"]['eti'][x]['Tamano'] + 'px; position: absolute;width: ' + tamano[0] + 'cm;height: ' + tamano[1] + 'cm;" src="/media/archivos/' + web_Id_empresa + '/logo.png" onclick="abrirmenu_atributo_pdf(this,' + temp_pestalla + ',' + t_pkplan + ',' + 1 + ',' + 1 + ',' + x + ')">'
      canv.innerHTML = canv.innerHTML + eti_html


    } else {
      if (listado_seg["Cabecera"]['eti'][x]['TipoLetra'] == 'grafico') {
        color = listado_seg["Cabecera"]['eti'][x]['Nombre'].split(',')
        tamano = listado_seg["Cabecera"]['eti'][x]['Tamano'].split(',')

        eti_html = '<div style="margin-left: ' + listado_seg["Cabecera"]['eti'][x]['X'] + 'cm;margin-top: ' + (parseFloat(listado_seg["Cabecera"]['eti'][x]['Y']) + aju + parseFloat(ydetalle)) + 'cm; position: absolute;width: ' + tamano[1] + 'cm;height: ' + tamano[0] + 'cm;background: rgb(' + color[1] + ', ' + color[2] + ', ' + color[3] + ');" onclick="abrirmenu_atributo_pdf(this,' + temp_pestalla + ',' + t_pkplan + ',' + 1 + ',' + 1 + ',' + x + ')"></div>'
        canv.innerHTML = canv.innerHTML + eti_html


      } else {

        eti_html = '<label style="margin-left: ' + listado_seg["Cabecera"]['eti'][x]['X'] + 'cm;margin-top: ' + (parseFloat(listado_seg["Cabecera"]['eti'][x]['Y']) + parseFloat(ydetalle)) + 'cm;font-size: ' + listado_seg["Cabecera"]['eti'][x]['Tamano'] + 'px; position: absolute;" onclick="abrirmenu_atributo_pdf(this,' + temp_pestalla + ',' + t_pkplan + ',' + 1 + ',' + 1 + ',' + x + ')">' + listado_seg["Cabecera"]['eti'][x]['Nombre'] + '</label>'

        canv.innerHTML = canv.innerHTML + eti_html

      }

    }
  }

  for (x = 0; x < listado_seg["Cabecera"]['cmc'].length; x++) {
    limite = listado_seg["Cabecera"]['cmc'][x]['limite'].split(',')

    if (listado_seg["Cabecera"]['cmc'][x]['Tipo'] == 'Derecha') {
      eti_html = '<label style="margin-left: ' + (listado_seg["Cabecera"]['cmc'][x]['X'] - (limite[0] * 0.15)) + 'cm;margin-top: ' + (parseFloat(listado_seg["Cabecera"]['cmc'][x]['Y']) + parseFloat(ydetalle)) + 'cm;font-size: ' + listado_seg["Cabecera"]['cmc'][x]['Tamano'] + 'px; position: absolute;background: aliceblue;height: ' + (limite[1] * 0.5) + 'cm;width: ' + (limite[0] * 0.15) + 'cm;border: darkcyan;border-style: dotted;text-align: right;" onclick="abrirmenu_atributo_pdf(this,' + temp_pestalla + ',' + t_pkplan + ',' + 1 + ',' + 2 + ',' + x + ')">' + listado_seg["Cabecera"]['cmc'][x]['Campo'] + '</label>'

    } else {
      eti_html = '<label style="margin-left: ' + listado_seg["Cabecera"]['cmc'][x]['X'] + 'cm;margin-top: ' + listado_seg["Cabecera"]['cmc'][x]['Y'] + 'cm;font-size: ' + listado_seg["Cabecera"]['cmc'][x]['Tamano'] + 'px; position: absolute;background: aliceblue;height: ' + (limite[1] * 0.5) + 'cm;width: ' + (limite[0] * 0.15) + 'cm;border: darkcyan;border-style: dotted;" onclick="abrirmenu_atributo_pdf(this,' + temp_pestalla + ',' + t_pkplan + ',' + 1 + ',' + 2 + ',' + x + ')">' + listado_seg["Cabecera"]['cmc'][x]['Campo'] + '</label>'
    }



    canv.innerHTML = canv.innerHTML + eti_html


  }

  ydetalle = document.getElementById('pdfDetfff' + temp_pestalla).value

  for (x = 0; x < listado_seg["Detalle"]['cmd'].length; x++) {
    eti_html = '<label style="margin-left: ' + listado_seg["Detalle"]['cmd'][x]['X'] + 'cm;margin-top: ' + ydetalle + 'cm;font-size: ' + listado_seg["Detalle"]['cmd'][x]['Tamano'] + 'px; position: absolute;" onclick="abrirmenu_atributo_pdf(this,' + temp_pestalla + ',' + t_pkplan + ',' + 2 + ',' + 3 + ',' + x + ')">' + listado_seg["Detalle"]['cmd'][x]['Cabecera'] + '</label>'

    canv.innerHTML = canv.innerHTML + eti_html


  }
  ydetalle = parseFloat(ydetalle) + 1
  pasX = 0

  for (x = 0; x < listado_seg["Detalle"]['cmd'].length; x++) {
    if (listado_seg["Detalle"]['cmd'][x]['Tipo'] == 'Derecha') {

      //eti_html = '<label style="margin-left: '+parseFloat(listado_seg["Detalle"]['cmd'][x]['X']) - parseFloat(listado_seg["Detalle"]['cmd'][x]['Limite']* 0.15) +'cm;margin-top: '+ydetalle+'cm;font-size: '+listado_seg["Detalle"]['cmd'][x]['Tamano']+'px; position: absolute;text-align: right;">'+listado_seg["Detalle"]['cmd'][x]['Campo']+'</label>'
      //eti_html = '<label style="margin-left: '+listado_seg["Detalle"]['cmd'][x]['X']+'cm;margin-top: '+ydetalle+'cm;font-size: '+listado_seg["Detalle"]['cmd'][x]['Tamano']+'px; position: absolute;">'+listado_seg["Detalle"]['cmd'][x]['Campo']+'</label>'
      //pasX = parseFloat(listado_seg["Detalle"]['cmd'][x]['X'])// - parseFloat(listado_seg["Detalle"]['cmd'][x]['Limite']* 0.15) 
      pasX = (parseFloat(listado_seg["Detalle"]['cmd'][x]['Limite']) * 0.15)


      eti_html = '<label style="margin-left: ' + listado_seg["Detalle"]['cmd'][x]['X'] + 'cm;margin-top: ' + ydetalle + 'cm;font-size: ' + listado_seg["Detalle"]['cmd'][x]['Tamano'] + 'px; position: absolute;text-align: right;width:' + pasX + 'cm;border: darkcyan;border-style: dotted;" onclick="abrirmenu_atributo_pdf(this,' + temp_pestalla + ',' + t_pkplan + ',' + 2 + ',' + 3 + ',' + x + ')">' + listado_seg["Detalle"]['cmd'][x]['Campo'] + '</label>'

    } else {

      pasX = (parseFloat(listado_seg["Detalle"]['cmd'][x]['Limite']) * 0.15)

      eti_html = '<label style="margin-left: ' + listado_seg["Detalle"]['cmd'][x]['X'] + 'cm;margin-top: ' + ydetalle + 'cm;font-size: ' + listado_seg["Detalle"]['cmd'][x]['Tamano'] + 'px; position: absolute;width:' + pasX + 'cm;border: darkcyan;border-style: dotted;" onclick="abrirmenu_atributo_pdf(this,' + temp_pestalla + ',' + t_pkplan + ',' + 2 + ',' + 3 + ',' + x + ')">' + listado_seg["Detalle"]['cmd'][x]['Campo'] + '</label>'


    }

    canv.innerHTML = canv.innerHTML + eti_html

  }

  ydetalle = parseFloat(document.getElementById('pdfPiefff' + temp_pestalla).value)

  aju = 0.3


  for (x = 0; x < listado_seg["Pie"]['eti'].length; x++) {

    if (listado_seg["Pie"]['eti'][x]['TipoLetra'] == 'Logo') {
      tamano = listado_seg["Pie"]['eti'][x]['Tamano'].split(',')

      eti_html = '<img style="margin-left: ' + listado_seg["Pie"]['eti'][x]['X'] + 'cm;margin-top: ' + (parseFloat(listado_seg["Pie"]['eti'][x]['Y']) + aju + ydetalle) + 'cm;font-size: ' + listado_seg["Pie"]['eti'][x]['Tamano'] + 'px; position: absolute;width: ' + tamano[0] + 'cm;height: ' + tamano[1] + 'cm;" src="/media/archivos/' + web_Id_empresa + '/logo.png" onclick="abrirmenu_atributo_pdf(this,' + temp_pestalla + ',' + t_pkplan + ',' + 3 + ',' + 1 + ',' + x + ')">'
      canv.innerHTML = canv.innerHTML + eti_html


    } else {
      if (listado_seg["Pie"]['eti'][x]['TipoLetra'] == 'grafico') {
        color = listado_seg["Pie"]['eti'][x]['Nombre'].split(',')
        tamano = listado_seg["Pie"]['eti'][x]['Tamano'].split(',')

        eti_html = '<div style="margin-left: ' + listado_seg["Pie"]['eti'][x]['X'] + 'cm;margin-top: ' + (parseFloat(listado_seg["Pie"]['eti'][x]['Y']) + aju + ydetalle) + 'cm; position: absolute;width: ' + tamano[1] + 'cm;height: ' + tamano[0] + 'cm;background: rgb(' + color[1] + ', ' + color[2] + ', ' + color[3] + ');" onclick="abrirmenu_atributo_pdf(this,' + temp_pestalla + ',' + t_pkplan + ',' + 3 + ',' + 1 + ',' + x + ')"></div>'
        canv.innerHTML = canv.innerHTML + eti_html


      } else {

        eti_html = '<label style="margin-left: ' + listado_seg["Pie"]['eti'][x]['X'] + 'cm;margin-top: ' + (parseFloat(listado_seg["Pie"]['eti'][x]['Y']) + ydetalle) + 'cm;font-size: ' + listado_seg["Pie"]['eti'][x]['Tamano'] + 'px; position: absolute;" onclick="abrirmenu_atributo_pdf(this,' + temp_pestalla + ',' + t_pkplan + ',' + 3 + ',' + 1 + ',' + x + ')">' + listado_seg["Pie"]['eti'][x]['Nombre'] + '</label>'

        canv.innerHTML = canv.innerHTML + eti_html

      }

    }
  }

  for (x = 0; x < listado_seg["Pie"]['cmc'].length; x++) {
    limite = listado_seg["Pie"]['cmc'][x]['limite'].split(',')

    if (listado_seg["Pie"]['cmc'][x]['Tipo'] == 'Derecha') {
      eti_html = '<label style="margin-left: ' + (listado_seg["Pie"]['cmc'][x]['X'] - (limite[0] * 0.15)) + 'cm;margin-top: ' + (parseFloat(listado_seg["Pie"]['cmc'][x]['Y']) + ydetalle) + 'cm;font-size: ' + listado_seg["Pie"]['cmc'][x]['Tamano'] + 'px; position: absolute;background: aliceblue;height: ' + (limite[1] * 0.5) + 'cm;width: ' + (limite[0] * 0.15) + 'cm;border: darkcyan;border-style: dotted;text-align: right;" onclick="abrirmenu_atributo_pdf(this,' + temp_pestalla + ',' + t_pkplan + ',' + 3 + ',' + 2 + ',' + x + ')">' + listado_seg["Pie"]['cmc'][x]['Campo'] + '</label>'

    } else {
      eti_html = '<label style="margin-left: ' + listado_seg["Pie"]['cmc'][x]['X'] + 'cm;margin-top: ' + (parseFloat(listado_seg["Pie"]['cmc'][x]['Y']) + ydetalle) + 'cm;font-size: ' + listado_seg["Pie"]['cmc'][x]['Tamano'] + 'px; position: absolute;background: aliceblue;height: ' + (limite[1] * 0.5) + 'cm;width: ' + (limite[0] * 0.15) + 'cm;border: darkcyan;border-style: dotted;" onclick="abrirmenu_atributo_pdf(this,' + temp_pestalla + ',' + t_pkplan + ',' + 3 + ',' + 2 + ',' + x + ')">' + listado_seg["Pie"]['cmc'][x]['Campo'] + '</label>'
    }



    canv.innerHTML = canv.innerHTML + eti_html

  }



}





function grabar_pdf(temp_pestalla) {



  te_PkPlan = pdf_may[temp_pestalla]['pdfs'][0]['PkPlantilla']
  dd_cab_eti = pdf_may[temp_pestalla]['lista_pdf'][te_PkPlan]['Cabecera']['eti']
  dd_cab_cmp = pdf_may[temp_pestalla]['lista_pdf'][te_PkPlan]['Cabecera']['cmc']
  dd_pie_eti = pdf_may[temp_pestalla]['lista_pdf'][te_PkPlan]['Pie']['eti']
  dd_pie_cmp = pdf_may[temp_pestalla]['lista_pdf'][te_PkPlan]['Pie']['cmc']
  dd_det_cmd = pdf_may[temp_pestalla]['lista_pdf'][te_PkPlan]['Detalle']['cmd']
  plan_alt = document.getElementById("pdfAltofff" + temp_pestalla).value
  plan_anc = document.getElementById("pdfAnchofff" + temp_pestalla).value
  segcab = document.getElementById("pdfCabfff" + temp_pestalla).value
  segdet = document.getElementById("pdfDetfff" + temp_pestalla).value
  segpie = document.getElementById("pdfPiefff" + temp_pestalla).value



  $.ajax({
    type: 'POST',
    url: '/admgrabar_pdf',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'te_PkPlan': te_PkPlan, 'plan_alt': plan_alt, 'plan_anc': plan_anc, 'segcab': segcab, 'segdet': segdet, 'segpie': segpie, 'dd_cab_eti': JSON.stringify(dd_cab_eti), 'dd_cab_cmp': JSON.stringify(dd_cab_cmp), 'dd_pie_eti': JSON.stringify(dd_pie_eti), 'dd_pie_cmp': JSON.stringify(dd_pie_cmp), 'dd_det_cmd': JSON.stringify(dd_det_cmd) },
    success: function (Response) {
      alert('Grabado')
    }
  });

}

function abrirmenu_atributo_pdf(envio, temp_pestalla, pkplan, seg, tipo, indice) {


  divup = document.getElementById("pdfup" + temp_pestalla)
  divdw = document.getElementById("pdfdw" + temp_pestalla)
  html_int = ''
  seg_nom = ''
  html_int = '<div class="col-sm-12" style="margin-left: 0px;">'
  tipoy= 0
  if(tipo == '3'){tipoy = 1}

  html_int = html_int + '<button type="button" id="" onclick="add_pdf('+tipoy+',0,' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ')" class="btn bg-green btn-flat margin"><span>Nuevo</span></button>'
  html_int = html_int + '<button type="button" id="" onclick="add_pdf('+tipoy+',1,' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ')" class="btn bg-green btn-flat margin"><span>Duplicar</span></button>'
  html_int = html_int + '<button type="button" id="" onclick="add_pdf('+tipoy+',2,' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ')" class="btn bg-green btn-flat margin"><span>Eliminar</span></button></div>'




  if (seg == 1) { seg_nom = 'Cabecera' }
  if (seg == 2) { seg_nom = 'Detalle' }
  if (seg == 3) { seg_nom = 'Pie' }

  if (tipo == 1) {

    html_int = html_int + '<div class="col-sm-6">'
    html_int = html_int + '<label>Nombre</label>'
    html_int = html_int + '<input type="text" id="uetiNombre$' + temp_pestalla + '" class="form-control col-sm-3" value="' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['eti'][indice]['Nombre'] + '" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'




    html_int = html_int + '<label>Tamano</label>'
    html_int = html_int + '<input type="text" id="uetiTamano$' + temp_pestalla + '" class="form-control col-sm-3" value="' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['eti'][indice]['Tamano'] + '" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'


    html_int = html_int + '</div>'
    html_int = html_int + '<div class="col-sm-6">'

    html_int = html_int + '<label>TipoLetra</label>'
    html_int = html_int + '<select id="uetiTipoLetra$' + temp_pestalla + '" class="form-control col-sm-3" value="' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['eti'][indice]['TipoLetra'] + '" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'
    html_int = html_int + '<option selected="">' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['eti'][indice]['TipoLetra'] + '</option>'
    html_int = html_int + '<option>normal</option>'
    html_int = html_int + '<option>bold</option>'
    html_int = html_int + '<option>Logo</option>'
    html_int = html_int + '<option>grafico</option>'
    html_int = html_int + '</select>'



    html_int = html_int + '<label>X</label>'
    html_int = html_int + '<input type="number" id="uetiX$' + temp_pestalla + '" class="form-control col-sm-3" value="' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['eti'][indice]['X'] + '" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'

    html_int = html_int + '<label>Y</label>'
    html_int = html_int + '<input type="number" id="uetiY$' + temp_pestalla + '" class="form-control col-sm-3" value="' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['eti'][indice]['Y'] + '" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'
    html_int = html_int + '</div>'

    //etiqueta

  }
  if (tipo == 2) {

    html_int = html_int + '<div class="col-sm-6">'
    html_int = html_int + '<label>Campo</label>'


    //html_int = html_int + '<input type="text" id="ucmcCampo$'+temp_pestalla+'" class="form-control col-sm-3" value="'+pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Campo']+'" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf('+temp_pestalla+','+pkplan+','+seg+','+tipo+','+indice+', this)"> '

    html_int = html_int + '<select id="ucmcCampo$' + temp_pestalla + '" class="form-control col-sm-3" value="' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Campo'] + '" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'


    for (var i2 = 0; i2 < pdf_may[temp_pestalla]["lista_campos"][0].length; i2++) {
      if (pdf_may[temp_pestalla]["lista_campos"][0][i2]["Nombre"] == pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Campo']) {
        html_int = html_int + '<option selected>' + pdf_may[temp_pestalla]["lista_campos"][0][i2]["Nombre"] + '</option>'
      } else {
        html_int = html_int + '<option>' + pdf_may[temp_pestalla]["lista_campos"][0][i2]["Nombre"] + '</option>'
      }
    }

    html_int = html_int + '</select>'


    html_int = html_int + '<label>Tamano</label>'
    html_int = html_int + '<input type="number" id="ucmcTamano$' + temp_pestalla + '" class="form-control col-sm-3" value="' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Tamano'] + '" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'



    html_int = html_int + '<label>limite</label>'
    html_int = html_int + '<input type="text" id="ucmclimite$' + temp_pestalla + '" class="form-control col-sm-3" value="' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['limite'] + '" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'


    html_int = html_int + '</div>'
    html_int = html_int + '<div class="col-sm-6">'

    html_int = html_int + '<label>Tipo</label>'
    html_int = html_int + '<select id="ucmcTipo$' + temp_pestalla + '" class="form-control col-sm-3" value="' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Tipo'] + '" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'

    if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Tipo'] == 'Normal') {
      html_int = html_int + '<option selected="">' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Tipo'] + '</option>'
    } else {
      html_int = html_int + '<option>Normal</option>'
    }

    if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Tipo'] == 'Fecha') {
      html_int = html_int + '<option selected="">' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Tipo'] + '</option>'
    } else {
      html_int = html_int + '<option>Fecha</option>'
    }

    if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Tipo'] == 'Derecha') {
      html_int = html_int + '<option selected="">' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Tipo'] + '</option>'
    } else {
      html_int = html_int + '<option>Derecha</option>'
    }

    if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Tipo'] == 'Numero') {
      html_int = html_int + '<option selected="">' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Tipo'] + '</option>'
    } else {
      html_int = html_int + '<option>Numero</option>'
    }

    if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Tipo'] == 'Color') {
      html_int = html_int + '<option selected="">' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Tipo'] + '</option>'
    } else {
      html_int = html_int + '<option>Color</option>'
    }
    if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Tipo'] == 'Barras') {
      html_int = html_int + '<option selected="">' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Tipo'] + '</option>'
    } else {
      html_int = html_int + '<option>Barras</option>'
    }
    html_int = html_int + '</select>'

    html_int = html_int + '<label>Ext</label>'

    html_int = html_int + '<div id="diVucmcExt$' + temp_pestalla + '">'



    if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Tipo'] == 'Normal') {

      html_int = html_int + '<input type="text" id="ucmcExt$' + temp_pestalla + '" class="form-control col-sm-3" value="' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] + '" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'
    }
    if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Tipo'] == 'Fecha') {

      html_int = html_int + '<select id="ucmcExt$' + temp_pestalla + '" class="form-control col-sm-3" value="Normal" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'

      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'Normal') {
        html_int = html_int + '<option selected>Normal</option>'

      } else {
        html_int = html_int + '<option>Normal</option>'

      }
      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'Dia') {
        html_int = html_int + '<option selected>Dia</option>'

      } else {
        html_int = html_int + '<option>Dia</option>'

      }
      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'Mes') {
        html_int = html_int + '<option selected>Mes</option>'

      } else {
        html_int = html_int + '<option>Mes</option>'

      }
      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'Anio') {
        html_int = html_int + '<option selected>Anio</option>'

      } else {
        html_int = html_int + '<option>Anio</option>'

      }
      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'Letras_larga') {
        html_int = html_int + '<option selected>Letras_larga</option>'

      } else {
        html_int = html_int + '<option>Letras_larga</option>'

      }
      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'Letras') {
        html_int = html_int + '<option selected>Letras</option>'

      } else {
        html_int = html_int + '<option>Letras</option>'

      }
      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'DDMMAAAA') {
        html_int = html_int + '<option selected>DDMMAAAA</option>'

      } else {
        html_int = html_int + '<option>DDMMAAAA</option>'
      }
      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'LetrasMayusculas') {
        html_int = html_int + '<option selected>LetrasMayusculas</option>'

      } else {
        html_int = html_int + '<option>LetrasMayusculas</option>'
      }
      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'Cheque') {
        html_int = html_int + '<option selected>Cheque</option>'

      } else {
        html_int = html_int + '<option>Cheque</option>'
      }
      html_int = html_int + '</select>'
    }
    if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Tipo'] == 'Derecha') {

      html_int = html_int + '<select id="ucmcExt$' + temp_pestalla + '" class="form-control col-sm-3" value="Normal" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'

      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'Letras') {
        html_int = html_int + '<option selected>Letras</option>'
      } else {
        html_int = html_int + '<option>Letras</option>'
      }
      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'Normal') {
        html_int = html_int + '<option selected>Normal</option>'
      } else {
        html_int = html_int + '<option>Normal</option>'
      }
      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'Numero') {
        html_int = html_int + '<option selected>Numero</option>'
      } else {
        html_int = html_int + '<option>Numero</option>'
      }
      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'Miles') {
        html_int = html_int + '<option selected>Miles</option>'
      } else {
        html_int = html_int + '<option>Miles</option>'
      }
      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'Dolar') {
        html_int = html_int + '<option selected>Dolar</option>'
      } else {
        html_int = html_int + '<option>Dolar</option>'
      }
      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'Euro') {
        html_int = html_int + '<option selected>Euro</option>'
      } else {
        html_int = html_int + '<option>Euro</option>'
      }
      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'Porcentaje') {
        html_int = html_int + '<option selected>Porcentaje</option>'
      } else {
        html_int = html_int + '<option>Porcentaje</option>'
      }
      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'Porcentaje_full') {
        html_int = html_int + '<option selected>Porcentaje_full</option>'
      } else {
        html_int = html_int + '<option>Porcentaje_full</option>'
      }


      html_int = html_int + '</select>'
    }
    if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Tipo'] == 'Numero') {

      html_int = html_int = '<select id="ucmcExt$' + temp_pestalla + '" class="form-control col-sm-3" value="Normal" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'

      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'Numero') {
        html_int = html_int + '<option selected>Numero</option>'

      } else {
        html_int = html_int + '<option>Numero</option>'
      }
      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'Miles') {
        html_int = html_int + '<option selected>Miles</option>'
      } else {
        html_int = html_int + '<option>Miles</option>'
      }
      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'Dolar') {
        html_int = html_int + '<option selected>Dolar</option>'
      } else {
        html_int = html_int + '<option>Dolar</option>'
      }
      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'Euro') {
        html_int = html_int + '<option selected>Euro</option>'
      } else {
        html_int = html_int + '<option>Euro</option>'
      }
      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'Porcentaje') {
        html_int = html_int + '<option selected>Porcentaje</option>'

      } else {
        html_int = html_int + '<option>Porcentaje</option>'
      }
      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'Porcentaje_full') {
        html_int = html_int + '<option selected>Porcentaje_full</option>'
      } else {
        html_int = html_int + '<option>Porcentaje_full</option>'
      }
      html_int = html_int + '</select>'



    }
    if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Tipo'] == 'Color') {

      html_int = html_int + '<input type="text" id="ucmcExt$' + temp_pestalla + '" class="form-control col-sm-3" value="' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] + '" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'
    }







    html_int = html_int + '</div>'


    html_int = html_int + '<label>X</label>'
    html_int = html_int + '<input type="number" id="ucmcX$' + temp_pestalla + '" class="form-control col-sm-3" value="' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['X'] + '" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'

    html_int = html_int + '<label>Y</label>'
    html_int = html_int + '<input type="number" id="ucmcY$' + temp_pestalla + '" class="form-control col-sm-3" value="' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Y'] + '" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'

    html_int = html_int + '</div>'
  }
  if (tipo == 3) {
    //campo det

    html_int = html_int + '<div class="col-sm-6">'

    html_int = html_int + '<label>Cabecera</label>'
    html_int = html_int + '<input type="text" id="ucmdCabecera$' + temp_pestalla + '" class="form-control col-sm-3" value="' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmd'][indice]['Cabecera'] + '" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'

    html_int = html_int + '<label>Campo</label>'


    html_int = html_int + '<select id="ucmdCampo$' + temp_pestalla + '" class="form-control col-sm-3" value="' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmd'][indice]['Campo'] + '" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'

    //html_int = html_int + '<option selected="">'+pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmd'][indice]['Tipo']+'</option>'

    for (var i2 = 0; i2 < pdf_may[temp_pestalla]["lista_campos"][1].length; i2++) {
      if (pdf_may[temp_pestalla]["lista_campos"][1][i2]["Nombre"] == pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmd'][indice]['Campo']) {
        html_int = html_int + '<option selected>' + pdf_may[temp_pestalla]["lista_campos"][1][i2]["Nombre"] + '</option>'
      } else {
        html_int = html_int + '<option>' + pdf_may[temp_pestalla]["lista_campos"][1][i2]["Nombre"] + '</option>'
      }
    }

    html_int = html_int + '</select>'





    html_int = html_int + '<label>Limite</label>'
    html_int = html_int + '<input type="number" id="ucmdLimite$' + temp_pestalla + '" class="form-control col-sm-3" value="' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmd'][indice]['Limite'] + '" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'



    html_int = html_int + '</div>'
    html_int = html_int + '<div class="col-sm-6">'


    html_int = html_int + '<label>Tipo</label>'

    html_int = html_int + '<select id="ucmdTipo$' + temp_pestalla + '" class="form-control col-sm-3" value="' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmd'][indice]['Tipo'] + '" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'


    if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmd'][indice]['Tipo'] == 'Normal') {
      html_int = html_int + '<option selected="">' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmd'][indice]['Tipo'] + '</option>'
    } else {
      html_int = html_int + '<option>Normal</option>'
    }

    if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmd'][indice]['Tipo'] == 'Numero') {
      html_int = html_int + '<option selected="">' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmd'][indice]['Tipo'] + '</option>'
    } else {
      html_int = html_int + '<option>Numero</option>'
    }
    if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmd'][indice]['Tipo'] == 'Derecha') {
      html_int = html_int + '<option selected="">' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmd'][indice]['Tipo'] + '</option>'
    } else {
      html_int = html_int + '<option>Derecha</option>'
    }
    if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmd'][indice]['Tipo'] == 'Imagen') {
      html_int = html_int + '<option selected="">' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmd'][indice]['Tipo'] + '</option>'
    } else {
      html_int = html_int + '<option>Imagen</option>'
    }
    if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmd'][indice]['Tipo'] == 'Fecha') {
      html_int = html_int + '<option selected="">' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmd'][indice]['Tipo'] + '</option>'
    } else {
      html_int = html_int + '<option>Fecha</option>'
    }


    html_int = html_int + '</select>'


    html_int = html_int + '<label>Ext</label>'

    html_int = html_int + '<div id="diVucmdExt$' + temp_pestalla + '">'

    html_int = html_int + '<input type="text" id="ucmdExt$' + temp_pestalla + '" class="form-control col-sm-3" value="' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmd'][indice]['Ext'] + '" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'
    html_int = html_int + '</div>'

    html_int = html_int + '<label>X</label>'
    html_int = html_int + '<input type="number" id="ucmdX$' + temp_pestalla + '" class="form-control col-sm-3" value="' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmd'][indice]['X'] + '" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'
    html_int = html_int + '</div>'

  }

  divup.innerHTML = html_int






  html_int = ''
  seg_nom = ''
  html_int = '<div class="col-sm-12" style="margin-left: 0px;">'
  html_int = html_int + '<button type="button" id="" onclick="add_pdf(1,0,' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ')" class="btn bg-green btn-flat margin"><span>Nuevo</span></button>'
  html_int = html_int + '<button type="button" id="" onclick="add_pdf(1,1,' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ')" class="btn bg-green btn-flat margin"><span>Duplicar</span></button>'
  html_int = html_int + '<button type="button" id="" onclick="add_pdf(1,2,' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ')" class="btn bg-green btn-flat margin"><span>Eliminar</span></button></div>'




  if (seg == 1) { seg_nom = 'Cabecera' }
  if (seg == 2) { seg_nom = 'Detalle' }
  if (seg == 3) { seg_nom = 'Pie' }

  if (tipo == 1) {

    html_int = html_int + '<div class="col-sm-6">'
    html_int = html_int + '<label>Nombre</label>'
    html_int = html_int + '<input type="text" id="detiNombre$' + temp_pestalla + '" class="form-control col-sm-3" value="' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['eti'][indice]['Nombre'] + '" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'




    html_int = html_int + '<label>Tamano</label>'
    html_int = html_int + '<input type="text" id="detiTamano$' + temp_pestalla + '" class="form-control col-sm-3" value="' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['eti'][indice]['Tamano'] + '" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'


    html_int = html_int + '</div>'
    html_int = html_int + '<div class="col-sm-6">'

    html_int = html_int + '<label>TipoLetra</label>'
    html_int = html_int + '<select id="detiTipoLetra$' + temp_pestalla + '" class="form-control col-sm-3" value="' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['eti'][indice]['TipoLetra'] + '" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'
    html_int = html_int + '<option selected="">' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['eti'][indice]['TipoLetra'] + '</option>'
    html_int = html_int + '<option>normal</option>'
    html_int = html_int + '<option>bold</option>'
    html_int = html_int + '<option>Logo</option>'
    html_int = html_int + '<option>grafico</option>'
    html_int = html_int + '</select>'



    html_int = html_int + '<label>X</label>'
    html_int = html_int + '<input type="number" id="detiX$' + temp_pestalla + '" class="form-control col-sm-3" value="' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['eti'][indice]['X'] + '" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'

    html_int = html_int + '<label>Y</label>'
    html_int = html_int + '<input type="number" id="detiY$' + temp_pestalla + '" class="form-control col-sm-3" value="' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['eti'][indice]['Y'] + '" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'
    html_int = html_int + '</div>'

    //etiqueta

  }
  if (tipo == 2) {

    html_int = html_int + '<div class="col-sm-6">'
    html_int = html_int + '<label>Campo</label>'


    //html_int = html_int + '<input type="text" id="dcmcCampo$'+temp_pestalla+'" class="form-control col-sm-3" value="'+pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Campo']+'" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf('+temp_pestalla+','+pkplan+','+seg+','+tipo+','+indice+', this)"> '

    html_int = html_int + '<select id="dcmcCampo$' + temp_pestalla + '" class="form-control col-sm-3" value="' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Campo'] + '" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'

    //html_int = html_int + '<option selected="">'+pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmd'][indice]['Tipo']+'</option>'

    for (var i2 = 0; i2 < pdf_may[temp_pestalla]["lista_campos"][0].length; i2++) {
      if (pdf_may[temp_pestalla]["lista_campos"][0][i2]["Nombre"] == pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Campo']) {
        html_int = html_int + '<option selected>' + pdf_may[temp_pestalla]["lista_campos"][0][i2]["Nombre"] + '</option>'
      } else {
        html_int = html_int + '<option>' + pdf_may[temp_pestalla]["lista_campos"][0][i2]["Nombre"] + '</option>'
      }
    }

    html_int = html_int + '</select>'




    html_int = html_int + '<label>Tamano</label>'
    html_int = html_int + '<input type="number" id="dcmcTamano$' + temp_pestalla + '" class="form-control col-sm-3" value="' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Tamano'] + '" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'



    html_int = html_int + '<label>limite</label>'
    html_int = html_int + '<input type="text" id="dcmclimite$' + temp_pestalla + '" class="form-control col-sm-3" value="' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['limite'] + '" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'


    html_int = html_int + '</div>'
    html_int = html_int + '<div class="col-sm-6">'

    html_int = html_int + '<label>Tipo</label>'
    html_int = html_int + '<select id="dcmcTipo$' + temp_pestalla + '" class="form-control col-sm-3" value="' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Tipo'] + '" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'

    if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Tipo'] == 'Normal') {
      html_int = html_int + '<option selected="">' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Tipo'] + '</option>'
    } else {
      html_int = html_int + '<option>Normal</option>'
    }
    if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Tipo'] == 'Fecha') {
      html_int = html_int + '<option selected="">' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Tipo'] + '</option>'
    } else {
      html_int = html_int + '<option>Fecha</option>'
    }
    if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Tipo'] == 'Derecha') {
      html_int = html_int + '<option selected="">' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Tipo'] + '</option>'
    } else {
      html_int = html_int + '<option>Derecha</option>'
    }
    if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Tipo'] == 'Numero') {
      html_int = html_int + '<option selected="">' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Tipo'] + '</option>'
    } else {
      html_int = html_int + '<option>Numero</option>'
    }
    if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Tipo'] == 'Color') {
      html_int = html_int + '<option selected="">' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Tipo'] + '</option>'
    } else {
      html_int = html_int + '<option>Color</option>'
    }
    html_int = html_int + '</select>'


    html_int = html_int + '<label>Ext</label>'

    html_int = html_int + '<div id="diVdcmcExt$' + temp_pestalla + '">'


    if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Tipo'] == 'Normal') {
      html_int = html_int + '<input type="text" id="dcmcExt$' + temp_pestalla + '" class="form-control col-sm-3" value="' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] + '" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'
    }
    if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Tipo'] == 'Fecha') {

      html_int = html_int + '<select id="dcmcExt$' + temp_pestalla + '" class="form-control col-sm-3" value="Normal" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'

      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'Normal') {
        html_int = html_int + '<option selected>Normal</option>'

      } else {
        html_int = html_int + '<option>Normal</option>'

      }
      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'Dia') {
        html_int = html_int + '<option selected>Dia</option>'

      } else {
        html_int = html_int + '<option>Dia</option>'

      }
      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'Mes') {
        html_int = html_int + '<option selected>Mes</option>'

      } else {
        html_int = html_int + '<option>Mes</option>'

      }
      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'Anio') {
        html_int = html_int + '<option selected>Anio</option>'

      } else {
        html_int = html_int + '<option>Anio</option>'

      }
      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'Letras_larga') {
        html_int = html_int + '<option selected>Letras_larga</option>'

      } else {
        html_int = html_int + '<option>Letras_larga</option>'

      }
      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'Letras') {
        html_int = html_int + '<option selected>Letras</option>'

      } else {
        html_int = html_int + '<option>Letras</option>'

      }
      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'DDMMAAAA') {
        html_int = html_int + '<option selected>DDMMAAAA</option>'

      } else {
        html_int = html_int + '<option>DDMMAAAA</option>'

      }
      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'LetrasMayusculas') {
        html_int = html_int + '<option selected>LetrasMayusculas</option>'

      } else {
        html_int = html_int + '<option>LetrasMayusculas</option>'

      }
      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'Cheque') {
        html_int = html_int + '<option selected>Cheque</option>'

      } else {
        html_int = html_int + '<option>Cheque</option>'

      }
      html_int = html_int + '</select>'



    }
    if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Tipo'] == 'Derecha') {


      html_int = html_int + '<select id="dcmcExt$' + temp_pestalla + '" class="form-control col-sm-3" value="Normal" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'

      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'Letras') {
        html_int = html_int + '<option selected>Letras</option>'

      } else {
        html_int = html_int + '<option>Letras</option>'

      }
      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'Normal') {
        html_int = html_int + '<option selected>Normal</option>'

      } else {
        html_int = html_int + '<option>Normal</option>'

      }
      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'Numero') {
        html_int = html_int + '<option selected>Numero</option>'

      } else {
        html_int = html_int + '<option>Numero</option>'

      }
      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'Miles') {
        html_int = html_int + '<option selected>Miles</option>'

      } else {
        html_int = html_int + '<option>Miles</option>'

      }
      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'Dolar') {
        html_int = html_int + '<option selected>Dolar</option>'

      } else {
        html_int = html_int + '<option>Dolar</option>'

      }
      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'Euro') {
        html_int = html_int + '<option selected>Euro</option>'

      } else {
        html_int = html_int + '<option>Euro</option>'

      }
      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'Porcentaje') {
        html_int = html_int + '<option selected>Porcentaje</option>'

      } else {
        html_int = html_int + '<option>Porcentaje</option>'

      }
      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'Porcentaje_full') {
        html_int = html_int + '<option selected>Porcentaje_full</option>'

      } else {
        html_int = html_int + '<option>Porcentaje_full</option>'

      }



      html_int = html_int + '</select>'




    }
    if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Tipo'] == 'Numero') {

      html_int = html_int + '<select id="dcmcExt$' + temp_pestalla + '" class="form-control col-sm-3" value="Normal" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'


      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'Numero') {
        html_int = html_int + '<option selected>Numero</option>'

      } else {
        html_int = html_int + '<option>Numero</option>'

      }
      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'Miles') {
        html_int = html_int + '<option selected>Miles</option>'

      } else {
        html_int = html_int + '<option>Miles</option>'

      }
      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'Dolar') {
        html_int = html_int + '<option selected>Dolar</option>'

      } else {
        html_int = html_int + '<option>Dolar</option>'

      }
      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'Euro') {
        html_int = html_int + '<option selected>Euro</option>'

      } else {
        html_int = html_int + '<option>Euro</option>'

      }
      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'Porcentaje') {
        html_int = html_int + '<option selected>Porcentaje</option>'

      } else {
        html_int = html_int + '<option>Porcentaje</option>'

      }
      if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] == 'Porcentaje_full') {
        html_int = html_int + '<option selected>Porcentaje_full</option>'

      } else {
        html_int = html_int + '<option>Porcentaje_full</option>'

      }
      html_int = html_int + '</select>'


    }
    if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Tipo'] == 'Color') {
      html_int = html_int + '<input type="text" id="dcmcExt$' + temp_pestalla + '" class="form-control col-sm-3" value="' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Ext'] + '" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'

    }





    html_int = html_int + '</div>'


    html_int = html_int + '<label>X</label>'
    html_int = html_int + '<input type="number" id="dcmcX$' + temp_pestalla + '" class="form-control col-sm-3" value="' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['X'] + '" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'

    html_int = html_int + '<label>Y</label>'
    html_int = html_int + '<input type="number" id="dcmcY$' + temp_pestalla + '" class="form-control col-sm-3" value="' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmc'][indice]['Y'] + '" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'

    html_int = html_int + '</div>'
  }
  if (tipo == 3) {
    //campo det

    html_int = html_int + '<div class="col-sm-6">'

    html_int = html_int + '<label>Cabecera</label>'
    html_int = html_int + '<input type="text" id="dcmdCabecera$' + temp_pestalla + '" class="form-control col-sm-3" value="' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmd'][indice]['Cabecera'] + '" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'

    html_int = html_int + '<label>Campo</label>'
    //html_int = html_int + '<input type="text" id="dcmdCampo$'+temp_pestalla+'" class="form-control col-sm-3" value="'+pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmd'][indice]['Campo']+'" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf('+temp_pestalla+','+pkplan+','+seg+','+tipo+','+indice+', this)">'


    html_int = html_int + '<select id="dcmdCampo$' + temp_pestalla + '" class="form-control col-sm-3" value="' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmd'][indice]['Campo'] + '" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'

    //html_int = html_int + '<option selected="">'+pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmd'][indice]['Tipo']+'</option>'

    for (var i2 = 0; i2 < pdf_may[temp_pestalla]["lista_campos"][1].length; i2++) {
      if (pdf_may[temp_pestalla]["lista_campos"][1][i2]["Nombre"] == pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmd'][indice]['Campo']) {
        html_int = html_int + '<option selected>' + pdf_may[temp_pestalla]["lista_campos"][1][i2]["Nombre"] + '</option>'
      } else {
        html_int = html_int + '<option>' + pdf_may[temp_pestalla]["lista_campos"][1][i2]["Nombre"] + '</option>'
      }
    }

    html_int = html_int + '</select>'




    html_int = html_int + '<label>Limite</label>'
    html_int = html_int + '<input type="number" id="dcmdLimite$' + temp_pestalla + '" class="form-control col-sm-3" value="' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmd'][indice]['Limite'] + '" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'



    html_int = html_int + '</div>'
    html_int = html_int + '<div class="col-sm-6">'


    html_int = html_int + '<label>Tipo</label>'
    html_int = html_int + '<select id="dcmdTipo$' + temp_pestalla + '" class="form-control col-sm-3" value="' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmd'][indice]['Tipo'] + '" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'


    if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmd'][indice]['Tipo'] == 'Normal') {
      html_int = html_int + '<option selected="">' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmd'][indice]['Tipo'] + '</option>'
    } else {
      html_int = html_int + '<option>Normal</option>'
    }

    if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmd'][indice]['Tipo'] == 'Numero') {
      html_int = html_int + '<option selected="">' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmd'][indice]['Tipo'] + '</option>'
    } else {
      html_int = html_int + '<option>Numero</option>'
    }

    if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmd'][indice]['Tipo'] == 'Derecha') {
      html_int = html_int + '<option selected="">' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmd'][indice]['Tipo'] + '</option>'
    } else {
      html_int = html_int + '<option>Derecha</option>'
    }
    if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmd'][indice]['Tipo'] == 'Imagen') {
      html_int = html_int + '<option selected="">' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmd'][indice]['Tipo'] + '</option>'
    } else {
      html_int = html_int + '<option>Imagen</option>'
    }
    if (pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmd'][indice]['Tipo'] == 'Fecha') {
      html_int = html_int + '<option selected="">' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmd'][indice]['Tipo'] + '</option>'
    } else {
      html_int = html_int + '<option>Fecha</option>'
    }

    html_int = html_int + '</select>'




    html_int = html_int + '<label>Ext</label>'

    html_int = html_int + '<div id="diVdcmdExt$' + temp_pestalla + '">'

    html_int = html_int + '<input type="text" id="dcmdExt$' + temp_pestalla + '" class="form-control col-sm-3" value="' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmd'][indice]['Ext'] + '" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'

    html_int = html_int + '</div>'

    html_int = html_int + '<label>X</label>'
    html_int = html_int + '<input type="number" id="dcmdX$' + temp_pestalla + '" class="form-control col-sm-3" value="' + pdf_may[temp_pestalla]["lista_pdf"][pkplan][seg_nom]['cmd'][indice]['X'] + '" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'
    html_int = html_int + '</div>'

  }


  divdw.innerHTML = html_int
}

function modificar_atributo_pdf(temp_pestalla, pkplan, seg, tipo, indice, envio) {


  seg_nom = ''
  tipo_nom = ''

  id = envio.id.substring(4).split('$')


  if (seg == 1) { seg_nom = 'Cabecera' }
  if (seg == 2) { seg_nom = 'Detalle' }
  if (seg == 3) { seg_nom = 'Pie' }
  if (tipo == 1) { tipo_nom = 'eti' }
  if (tipo == 2) { tipo_nom = 'cmc' }
  if (tipo == 3) { tipo_nom = 'cmd' }


  pdf_may[temp_pestalla]['lista_pdf'][pkplan][seg_nom][tipo_nom][indice][id[0]] = envio.value

  if (id[0] == 'Tipo') {
    taggg = 'diV' + envio.id.substring(0, 4) + 'Ext$' + temp_pestalla
    id_cmapo = envio.id.substring(0, 4) + 'Ext$' + temp_pestalla

    html_int = ''
    if (envio.value == 'Normal') {

      document.getElementById(taggg).innerHTML = '<input type="text" id="' + id_cmapo + '" class="form-control col-sm-3" value="Normal" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'
      pdf_may[temp_pestalla]['lista_pdf'][pkplan][seg_nom][tipo_nom][indice]['Ext'] = 'Normal'


    }
    if (envio.value == 'Fecha') {

      html_int = '<option selected>Normal</option>'
      html_int = html_int + '<option>Dia</option>'
      html_int = html_int + '<option>Mes</option>'
      html_int = html_int + '<option>Anio</option>'
      html_int = html_int + '<option>Letras_larga</option>'
      html_int = html_int + '<option>Letras</option>'
      html_int = html_int + '<option>DDMMAAAA</option>'
      html_int = html_int + '<option>LetrasMayusculas</option>'
      html_int = html_int + '<option>Cheque</option>'
      html_int = html_int + '</select>'

      document.getElementById(taggg).innerHTML = '<select id="' + id_cmapo + '" class="form-control col-sm-3" value="Normal" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">' + html_int
      pdf_may[temp_pestalla]['lista_pdf'][pkplan][seg_nom][tipo_nom][indice]['Ext'] = 'Normal'


    }
    if (envio.value == 'Derecha') {

      html_int = '<option selected>Normal</option>'
      html_int = html_int + '<option>Letras</option>'
      html_int = html_int + '<option>Numero</option>'
      html_int = html_int + '<option>Miles</option>'
      html_int = html_int + '<option>Dolar</option>'
      html_int = html_int + '<option>Euro</option>'
      html_int = html_int + '<option>Porcentaje</option>'
      html_int = html_int + '<option>Porcentaje_full</option>'
      html_int = html_int + '</select>'

      document.getElementById(taggg).innerHTML = '<select id="' + id_cmapo + '" class="form-control col-sm-3" value="Normal" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">' + html_int
      pdf_may[temp_pestalla]['lista_pdf'][pkplan][seg_nom][tipo_nom][indice]['Ext'] = 'Normal'


    }
    if (envio.value == 'Numero') {

      html_int = '<option selected>Numero</option>'
      html_int = html_int + '<option>Miles</option>'
      html_int = html_int + '<option>Dolar</option>'
      html_int = html_int + '<option>Euro</option>'
      html_int = html_int + '<option>Porcentaje</option>'
      html_int = html_int + '<option>Porcentaje_full</option>'
      html_int = html_int + '</select>'

      document.getElementById(taggg).innerHTML = '<select id="' + id_cmapo + '" class="form-control col-sm-3" value="Normal" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">' + html_int
      pdf_may[temp_pestalla]['lista_pdf'][pkplan][seg_nom][tipo_nom][indice]['Ext'] = 'Numero'


    }
    if (envio.value == 'Color') {

      document.getElementById(taggg).innerHTML = '<input type="text" id="' + id_cmapo + '" class="form-control col-sm-3" value="0,0,0,20" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">'
      pdf_may[temp_pestalla]['lista_pdf'][pkplan][seg_nom][tipo_nom][indice]['Ext'] = '0,0,0,20'


    }
    if (envio.value == 'Barras') {
      html_int = '<option selected>Normal</option>'
      html_int = html_int + '</select>'

      document.getElementById(taggg).innerHTML = '<select id="' + id_cmapo + '" class="form-control col-sm-3" value="Normal" style="height: 25px;font-size: 11px;" onchange="modificar_atributo_pdf(' + temp_pestalla + ',' + pkplan + ',' + seg + ',' + tipo + ',' + indice + ', this)">' + html_int
      pdf_may[temp_pestalla]['lista_pdf'][pkplan][seg_nom][tipo_nom][indice]['Ext'] = 'Normal'
    }

  }

  hacerPdfPrev(temp_pestalla)
}


function add_pdf(ori, funct, temp_pestalla, pkplan, seg, tipo, indice) {
  if (ori == '1') {
    ori = 'd'
  } else {
    ori = 'u'
  }
  seg_nom = ''
  tipo_nom = ''
  elemento_nue = {}

  if (seg == 1) { seg_nom = 'Cabecera' }
  if (seg == 2) { seg_nom = 'Detalle' }
  if (seg == 3) { seg_nom = 'Pie' }
  if (funct == 1) {

    if (tipo == 1) {
      tipo_nom = 'eti'
      elemento_nue['Nombre'] = document.getElementById(ori + 'etiNombre$' + temp_pestalla).value
      elemento_nue['Tamano'] = document.getElementById(ori + 'etiTamano$' + temp_pestalla).value
      elemento_nue['TipoLetra'] = document.getElementById(ori + 'etiTipoLetra$' + temp_pestalla).value
      elemento_nue['X'] = parseFloat(document.getElementById(ori + 'etiX$' + temp_pestalla).value)
      elemento_nue['Y'] = parseFloat(document.getElementById(ori + 'etiY$' + temp_pestalla).value) + 0.5
    }
    if (tipo == 2) {
      tipo_nom = 'cmc'
      elemento_nue['Campo'] = document.getElementById(ori + 'cmcCampo$' + temp_pestalla).value
      elemento_nue['Ext'] = document.getElementById(ori + 'cmcExt$' + temp_pestalla).value
      elemento_nue['Tamano'] = document.getElementById(ori + 'cmcTamano$' + temp_pestalla).value
      elemento_nue['Tipo'] = document.getElementById(ori + 'cmcTipo$' + temp_pestalla).value
      elemento_nue['X'] = parseFloat(document.getElementById(ori + 'cmcX$' + temp_pestalla).value)
      elemento_nue['Y'] = parseFloat(document.getElementById(ori + 'cmcY$' + temp_pestalla).value) + 0.5
      elemento_nue['limite'] = document.getElementById(ori + 'cmclimite$' + temp_pestalla).value

    }
    if (tipo == 3) {
      elemento_nue['Cabecera'] = document.getElementById(ori + 'cmdCabecera$' + temp_pestalla).value
      elemento_nue['Campo'] = document.getElementById(ori + 'cmdCampo$' + temp_pestalla).value
      elemento_nue['Ext'] = document.getElementById(ori + 'cmdExt$' + temp_pestalla).value
      elemento_nue['Limite'] = document.getElementById(ori + 'cmdLimite$' + temp_pestalla).value
      elemento_nue['Tamano'] = 12
      elemento_nue['Tipo'] = document.getElementById(ori + 'cmdTipo$' + temp_pestalla).value
      elemento_nue['X'] = parseFloat(document.getElementById(ori + 'cmdX$' + temp_pestalla).value) + 2
      tipo_nom = 'cmd'

    }
  }
  if (funct == 0) {
    if (tipo == 1) {
      tipo_nom = 'eti'
      elemento_nue = { 'Nombre': 'Etiqueta', 'Tamano': 12, 'TipoLetra': 'Normal', 'X': 1, 'Y': 1 }
    }
    if (tipo == 2) {
      tipo_nom = 'cmc'
      s_campo = document.getElementById('ucmcCampo$'+temp_pestalla)
      elemento_nue = { 'Campo': s_campo.childNodes[0].value, 'Tamano': 12, 'Ext': 'Normal', 'Tipo': 'Normal', 'X': 1, 'Y': 1, 'limite': '20,1' }
    }
    if (tipo == 3) {
      s_campo = document.getElementById('ucmdCampo$'+temp_pestalla)
      elemento_nue = { 'Cabecera': 'Cabecera', 'Campo': s_campo.childNodes[0].value, 'Tipo': 'Normal', 'Ext': 'Normal', 'Limite': 20, 'Tamano': 12, 'X': 1 }
      tipo_nom = 'cmd'
    }
  }
  if (funct == 2) {
    if (tipo == 1) {
      tipo_nom = 'eti'
    }
    if (tipo === 2) {
      tipo_nom = 'cmc'
    }
    if (tipo == 3) {
      tipo_nom = 'cmd'
    }
  }

  if (funct == 0) {
    pdf_may[temp_pestalla]['lista_pdf'][pkplan][seg_nom][tipo_nom].push(elemento_nue)
  }
  if (funct == 1) {
    pdf_may[temp_pestalla]['lista_pdf'][pkplan][seg_nom][tipo_nom].push(elemento_nue)
  }
  if (funct == 2) {
    pdf_may[temp_pestalla]['lista_pdf'][pkplan][seg_nom][tipo_nom].splice(indice, 1)
  }



  hacerPdfPrev(temp_pestalla)

}


pdf_may = {}

function modificar_estilo_PDF(temp_pestalla) {

  var cc_tabla = dict_pestalla["p-" + temp_pestalla]

  dict_pestalla["p-" + temp_pestalla]

  pkmodulo = dict_pestalla["p-" + temp_pestalla]["tabla"][0]["PkModulo"]

  var id_tab = pkmodulo
  tipo = 'Nuevo'

  $.ajax({
    type: 'POST',
    url: '/adm_pdf',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'pkmodulo': pkmodulo },
    success: function (Response) {

      pdf_may[temp_pestalla] = Response
      listado_seg = Object.keys(Response["lista_pdf"][Response["pdfs"][0]["PkPlantilla"]])
      Lista_campos = {}
      Lista_etiquetas = {}
      lista_detalle = {}

      html_pdf = '<div class="col-md-12"><div class="row"><button type="button" id="" onclick="grabar_pdf(' + temp_pestalla + ')" class="btn bg-green btn-flat margin"><span>Grabar</span></button></div></div>'
      html_pdf = html_pdf + '<section class="content"><div class="row"><div class="col-md-3"><div class="box box-solid">'
      html_pdf = html_pdf + ''


      // detalle

      html_pdf = html_pdf + '</div></div></div></div><!-- /.box-body --></div></div><div class="col-md-9"> <div><div class="box box-primary"><div class="box-header with-border"><div class="col-sm-2">'
      html_pdf = html_pdf + '<label class="control-label for=" telefono"="" style="font-size: 12px;font-weight: bold;">Alto</label>'
      html_pdf = html_pdf + '<input type="number" id="pdfAltofff' + temp_pestalla + '" class="form-control col-sm-2" value="' + Response["pdfs"][0]["Largo"] + '" style="height: 25px;font-size: 11px;" onchange="cambioValor_pdf(this, ' + temp_pestalla + ')"></div><div class="col-sm-2">'
      html_pdf = html_pdf + '<label class="control-label for=" telefono"="" style="font-size: 12px;font-weight: bold;">Ancho</label>'
      html_pdf = html_pdf + '<input type="text" id="pdfAnchofff' + temp_pestalla + '"class="form-control col-sm-3" value="' + Response["pdfs"][0]["Ancho"] + '" style="height: 25px;font-size: 11px;" onchange="cambioValor_pdf(this, ' + temp_pestalla + ')"></div><div class="col-sm-2">'
      html_pdf = html_pdf + '<label class="control-label for=" telefono"="" style="font-size: 12px;font-weight: bold;">Inicio</label>'
      html_pdf = html_pdf + '<input type="text" id="pdfCabfff' + temp_pestalla + '"class="form-control col-sm-3" value="' + pdf_may[temp_pestalla]["lista_pdf"][pdf_may[temp_pestalla]["pdfs"][0]["PkPlantilla"]]["Cabecera"]["altura"] + '" style="height: 25px;font-size: 11px;" onchange="cambioValor_pdf(this, ' + temp_pestalla + ')"></div><div class="col-sm-2">'
      html_pdf = html_pdf + '<label class="control-label for=" telefono"="" style="font-size: 12px;font-weight: bold;">Detalle</label>'
      html_pdf = html_pdf + '<input type="text" id="pdfDetfff' + temp_pestalla + '"class="form-control col-sm-3" value="' + pdf_may[temp_pestalla]["lista_pdf"][pdf_may[temp_pestalla]["pdfs"][0]["PkPlantilla"]]["Detalle"]["altura"] + '" style="height: 25px;font-size: 11px;" onchange="cambioValor_pdf(this, ' + temp_pestalla + ')"></div><div class="col-sm-2">'
      html_pdf = html_pdf + '<label class="control-label for=" telefono"="" style="font-size: 12px;font-weight: bold;">Pie</label>'
      html_pdf = html_pdf + '<input type="text" id="pdfPiefff' + temp_pestalla + '"class="form-control col-sm-3" value="' + pdf_may[temp_pestalla]["lista_pdf"][pdf_may[temp_pestalla]["pdfs"][0]["PkPlantilla"]]["Pie"]["altura"] + '" style="height: 25px;font-size: 11px;" onchange="cambioValor_pdf(this, ' + temp_pestalla + ')"></div></div><div class="box-body no-padding"><div class="mailbox-controls">'

      // detalle
      pdf_largo = parseFloat(pdf_may[temp_pestalla]["pdfs"][0]["Largo"])
      pdf_ancho = parseFloat(pdf_may[temp_pestalla]["pdfs"][0]["Ancho"])


      html_pdf = html_pdf + ' <div id="pdfup' + temp_pestalla + '"></div>'

      html_pdf = html_pdf + ' <div id="myCanvas' + temp_pestalla + '" class="col-sm-12" style="width: ' + (pdf_ancho) + 'cm;height: ' + (pdf_largo) + 'cm;background: white;border-style: dashed;"></div>'

      html_pdf = html_pdf + ' <div id="pdfdw' + temp_pestalla + '"></div>'


      html_pdf = html_pdf + '</div></div></div></div></div></div></section>'




      $('#rr' + temp_pestalla).html(html_pdf);

      hacerPdfPrev(temp_pestalla)
    }
  });
}




function mod_campo_largo(pkcampo, valor, id) {
  tt_div = document.getElementById("div" + id.id)

  clase = tt_div.attributes["class"].value.split("-")

  clase[2] = parseInt(clase[2])

  tempo = clase[2].toString().split(' ')

  clase[2] = parseInt(tempo[0]) + parseInt(valor)

  if (clase[2] > 0) {
    tt_div.attributes["class"].value = clase[0] + "-" + clase[1] + "-" + clase[2].toString().trim()
    actuai_estilo(pkcampo, 'largoweb', clase[2].toString().trim())
  }


}

function mod_campo_salto(pkcampo, valor, id, temp_pestalla) {
  if (valor == 1) {
    actuai_estilo(pkcampo, 'saltoweb', '<div class="row"></div>')
  } else {
    actuai_estilo(pkcampo, 'saltoweb', '')
  }
  modificar_estilo_recarga(temp_pestalla)

}

var cm_pkcampoA = ''
var cm_pkcampoB = ''


function mod_campo_posi(pkcampo, tag, temp_pestalla) {

  if (cm_pkcampoA == '') {
    cm_pkcampoA = pkcampo
    tag.style.backgroundColor = 'AQUA'
  } else {
    if (cm_pkcampoA == pkcampo) {
      cm_pkcampoA = ''
      tag.style.backgroundColor = ''

    }
  }
  if (cm_pkcampoB == '' && cm_pkcampoA != pkcampo) { cm_pkcampoB = pkcampo }
  if (cm_pkcampoA != '' && cm_pkcampoB != '') {
    intercambio_cc(cm_pkcampoA, cm_pkcampoB, temp_pestalla)
    cm_pkcampoA = ''
    cm_pkcampoB = ''
  }
}

function mod_campo_posi_dir(pkcampo, tag, temp_pestalla, dirre) {

  $.ajax({
    type: 'POST',
    url: '/intercambio_dir',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 't_pkcampo': pkcampo, 'dirre': dirre },
    success: function (Response) {
      modificar_estilo_recarga(temp_pestalla)
    }
  });
}


function mod_campo_bloque(pkcampo, valor, id, temp_pestalla) {

  if (valor == 0) { actuai_estilo(pkcampo, 'posicionweb', 'arriba_izq') }
  if (valor == 1) { actuai_estilo(pkcampo, 'posicionweb', 'arriba_der') }
  if (valor == 2) { actuai_estilo(pkcampo, 'posicionweb', 'abajo_der') }
  if (valor == 3) { actuai_estilo(pkcampo, 'posicionweb', 'abajo_izq') }

  modificar_estilo_recarga(temp_pestalla)
}

function intercambio_cc(t_pkcampoA, t_pkcampoB, t_pestalla) {
  $.ajax({
    type: 'POST',
    url: '/intercambio_cc',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 't_pkcampoA': t_pkcampoA, 't_pkcampoB': t_pkcampoB },
    success: function (Response) {
      modificar_estilo_recarga(t_pestalla)
    }
  });
}

function modificar_estilo_recarga(temp_pestalla) {

  var cc_tabla = dict_pestalla["p-" + temp_pestalla]

  dict_pestalla["p-" + temp_pestalla]

  pkmodulo = dict_pestalla["p-" + temp_pestalla]["tabla_cab"]["PkModulo"]

  var id_tab = pkmodulo
  tipo = 'Nuevo'


  $.ajax({
    type: 'POST',
    url: '/' + web_idioma + '/consulta',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'pkmodulo': pkmodulo, 'pestalla': pestalla, 'pkregistro': 0, 'tipo': tipo, 't_clave': 0 },
    success: function (Response) {

      $('#rr' + pestalla).html('');

      id_dic = 'p-' + pestalla
      dict_pestalla[id_dic] = Response
      cc_porPesta[id_dic] = 1

      div_botones = '<div class="box-header with-border" style="margin-left: 0px;margin-right: 0px;background: white;padding: 0px;"><div class="col-md-12"><div class="row">'
      readonly = 'readonly="readonly"'


      readonly = ''

      div_botones = div_botones + '<button type="button" onclick="cerrar_elemento(' + pestalla + ')" class="btn bg-red btn-flat margin"><span>Cerrar</span></button>'

      div_botones = div_botones + '</div></div></div>'

      $('#rr' + pestalla).append(div_botones);
      div_campos2 = ''
      div_campos = '<div class="box-body" style="background: white;"><div class="row">'
      div_campos_arriba_izq = ''
      div_campos_arriba_der = ''
      div_campos_abajo_izq = ''
      div_campos_abajo_der = ''
      div_c_t = ''
      ultimo_id = ""
      ultimo_posi = ""
      div_c_inv = ""
      div_c_inv_tt = ""
      for (x = 0; x < Response["campos_cab"].length; x++) {

        if (tipo == 'Nuevo') {

          if (Response["campos_cab"][x]["TablaCampo"] == "cmptxtsimple") {
            valor_campo = Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["ValorPredeterminado"]

          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpnumsimple") {
            valor_campo = Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Menor"]

          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpnumsecuencial") {
            if (Response["campos_cab"][x]["TablaCampo"].substring(0, 2) == "Pk") {
              valor_campo = 0
            } else {
              valor_campo = Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["ValorInicial"]
            }
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpopcmultiple") {
            valor_campo = Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Valor"]

          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpsistema") {

            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["PkId"] == 2) {
              valor_campo = web_usuario

            }

            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["PkId"] == 1) {
              var now = new Date();
              valor_campo = now.format("Y-m-d") + 'T' + now.format("H:i:s")
            }


          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpformuladetalle") {
            valor_campo = 0
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpfecha") {
            var now = new Date();
            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Tiempo"] == "Y") {
              valor_campo = now.format("Y-m-d") + 'T' + now.format("H:i:s")
            } else {
              valor_campo = now.format("Y-m-d");
            }
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpreferencia") {
            valor_campo = Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["predeterminado_valor"]
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpreferenciaadjunto") {
            valor_campo = 0
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpoperacion") {
            valor_campo = 0
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpconsolidado") {
            valor_campo = 0
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmparchivo") {
            valor_campo = ""
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpnumeroaletras") {
            valor_campo = ""
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpdecabecera") {
            valor_campo = ""
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpelectronico") {
            valor_campo = 0

          }
        } else {
          valor_campo = Response["valores_cab"][0][Response["campos_cab"][x]["Nombre"]]

          if (Response["campos_cab"][x]["TablaCampo"] == "cmpfecha") {

            var now = new Date(Response["valores_cab"][0][Response["campos_cab"][x]["Nombre"]]);
            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Tiempo"] == "Y") {
              valor_campo = now.format("Y-m-d") + 'T' + now.format("H:i:s")
            } else {
              valor_campo = now.format("Y-m-d");
            }


          }
        }

        ID_TAG = 'p' + Response["pestalla"] + 'zzz' + Response["campos_cab"][x]["Nombre"] + '';

        if (Response["campos_cab"][x]["Visible"] == "Y") {



          div_c_t = Response["campos_cab"][x]["saltoweb"]
          div_c_t = div_c_t + '<div id="div' + ID_TAG + '" class="col-sm-' + Response["campos_cab"][x]["largoweb"] + '">'


          div_c_t = div_c_t + '<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">'
          div_c_t = div_c_t + '<label class="control-label for="' + Response["campos_cab"][x]["Nombre"] + '" style="font-size: 12px;font-weight: bold;" >' + Response["campos_cab"][x]["Descripcion"] + '</label>'
          div_c_t = div_c_t + '</a><ul class="dropdown-menu" role="menu" style="text-align: center;"><li> <i onclick="mod_campo_largo(' + Response["campos_cab"][x]["PkId"] + ', -1, ' + ID_TAG + ')" class="fa fa-minus" style="cursor: pointer;"></i>  <i class="fa fa-arrows-h" style="width: 30px;"></i>  <i onclick="mod_campo_largo(' + Response["campos_cab"][x]["PkId"] + ', 1, ' + ID_TAG + ')" class="fa fa-plus" style="cursor: pointer;"></i> </li> '


          div_c_t = div_c_t + '<li> <i class="fa fa-fw fa-arrow-left" onclick="mod_campo_posi_dir(' + Response["campos_cab"][x]["PkId"] + ', ' + ID_TAG + ', ' + pestalla + ',0)"></i> <i onclick="mod_campo_posi(' + Response["campos_cab"][x]["PkId"] + ', ' + ID_TAG + ', ' + pestalla + ')" class="fa fa-retweet" style="cursor: pointer;"></i> <i class="fa fa-fw fa-arrow-right" onclick="mod_campo_posi_dir(' + Response["campos_cab"][x]["PkId"] + ', ' + ID_TAG + ', ' + pestalla + ',1)"></i></li>'

          div_c_t = div_c_t + '<li><i onclick="mod_campo_invisible(' + Response["campos_cab"][x]["PkId"] + ',1, ' + pestalla + ')" class="fa fa-ban" style="cursor: pointer;"></i></li>'


          if (Response["campos_cab"][x]["saltoweb"] == "") {
            div_c_t = div_c_t + '<li><i class="fa fa-level-down" onclick="mod_campo_salto(' + Response["campos_cab"][x]["PkId"] + ', 1, ' + ID_TAG + ', ' + pestalla + ')" style="cursor: pointer;"></i></li>'

          } else {
            div_c_t = div_c_t + '<li><i onclick="mod_campo_salto(' + Response["campos_cab"][x]["PkId"] + ', 0, ' + ID_TAG + ', ' + pestalla + ')" style="cursor: pointer;" class="fa fa-level-up"></i> </li>'
          }



          if (Response["campos_cab"][x]["posicionweb"] == "arriba_izq") {

            div_c_t = div_c_t + '<li onclick="mod_campo_bloque(' + Response["campos_cab"][x]["PkId"] + ', 1, ' + ID_TAG + ', ' + pestalla + ')">Mover bloque <i class="fa fa-arrow-circle-o-up"></i><i class="fa fa-arrow-circle-o-right" style="cursor: pointer;"></i></i> </li>'
            if (typeof (Response["campos_det"]) == "object") {
              div_c_t = div_c_t + '<li onclick="mod_campo_bloque(' + Response["campos_cab"][x]["PkId"] + ', 2, ' + ID_TAG + ', ' + pestalla + ')" style="cursor: pointer;">Mover bloque <i class="fa fa-arrow-circle-o-down"></i><i class="fa fa-arrow-circle-o-right"></i></i> </li>'
              div_c_t = div_c_t + '<li onclick="mod_campo_bloque(' + Response["campos_cab"][x]["PkId"] + ', 3, ' + ID_TAG + ', ' + pestalla + ')" style="cursor: pointer;">Mover bloque <i class="fa fa-arrow-circle-o-down"></i><i class="fa fa-arrow-circle-o-left"></i></i> </li>'
            }
          }
          if (Response["campos_cab"][x]["posicionweb"] == "arriba_der") {
            div_c_t = div_c_t + '<li onclick="mod_campo_bloque(' + Response["campos_cab"][x]["PkId"] + ', 0, ' + ID_TAG + ', ' + pestalla + ')" style="cursor: pointer;">Mover bloque <i class="fa fa-arrow-circle-o-up"></i><i class="fa fa-arrow-circle-o-left"></i></i></li>'
            if (typeof (Response["campos_det"]) == "object") {
              div_c_t = div_c_t + '<li onclick="mod_campo_bloque(' + Response["campos_cab"][x]["PkId"] + ', 2, ' + ID_TAG + ', ' + pestalla + ')" style="cursor: pointer;">Mover bloque <i class="fa fa-arrow-circle-o-down"></i><i class="fa fa-arrow-circle-o-right"></i></i> </li>'
              div_c_t = div_c_t + '<li onclick="mod_campo_bloque(' + Response["campos_cab"][x]["PkId"] + ', 3, ' + ID_TAG + ', ' + pestalla + ')" style="cursor: pointer;">Mover bloque <i class="fa fa-arrow-circle-o-down"></i><i class="fa fa-arrow-circle-o-left"></i></i> </li>'
            }
          }
          if (Response["campos_cab"][x]["posicionweb"] == "abajo_izq") {
            div_c_t = div_c_t + '<li onclick="mod_campo_bloque(' + Response["campos_cab"][x]["PkId"] + ', 0, ' + ID_TAG + ', ' + pestalla + ')" style="cursor: pointer;">Mover bloque <i class="fa fa-arrow-circle-o-up"></i><i class="fa fa-arrow-circle-o-left"></i></i> </li>'
            div_c_t = div_c_t + '<li onclick="mod_campo_bloque(' + Response["campos_cab"][x]["PkId"] + ', 1, ' + ID_TAG + ', ' + pestalla + ')" style="cursor: pointer;">Mover bloque <i class="fa fa-arrow-circle-o-up"></i><i class="fa fa-arrow-circle-o-right"></i></i> </li>'
            div_c_t = div_c_t + '<li onclick="mod_campo_bloque(' + Response["campos_cab"][x]["PkId"] + ', 2, ' + ID_TAG + ', ' + pestalla + ')" style="cursor: pointer;">Mover bloque <i class="fa fa-arrow-circle-o-down"></i><i class="fa fa-arrow-circle-o-right"></i></i> </li>'

          }
          if (Response["campos_cab"][x]["posicionweb"] == "abajo_der") {
            div_c_t = div_c_t + '<li onclick="mod_campo_bloque(' + Response["campos_cab"][x]["PkId"] + ', 0, ' + ID_TAG + ', ' + pestalla + ')" style="cursor: pointer;">Mover bloque <i class="fa fa-arrow-circle-o-up"></i><i class="fa fa-arrow-circle-o-left"></i></i> </li>'
            div_c_t = div_c_t + '<li onclick="mod_campo_bloque(' + Response["campos_cab"][x]["PkId"] + ', 1, ' + ID_TAG + ', ' + pestalla + ')" style="cursor: pointer;">Mover bloque <i class="fa fa-arrow-circle-o-up"></i><i class="fa fa-arrow-circle-o-right"></i></i> </li>'
            div_c_t = div_c_t + '<li onclick="mod_campo_bloque(' + Response["campos_cab"][x]["PkId"] + ', 3, ' + ID_TAG + ', ' + pestalla + ')" style="cursor: pointer;">Mover bloque <i class="fa fa-arrow-circle-o-down"></i><i class="fa fa-arrow-circle-o-left"></i></i> </li>'
          }


          div_c_t = div_c_t + '</ul>'


          if (Response["campos_cab"][x]["TablaCampo"] == "cmptxtsimple") {
            readonly_int = ''
            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Modificable"] == "N") {
              readonly_int = 'readonly="readonly"'
            }
            if (tipo == 'Nuevo') {
              valor_campo = Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["ValorPredeterminado"]
            }
            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Largo"] > 100) {
              div_c_t = div_c_t + '<textarea type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' ' + readonly_int + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="font-size: 11px;">' + valor_campo + '</textarea>'
            } else {
              div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' ' + readonly_int + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 25px;font-size: 11px;">'
            }
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpnumsimple") {

            div_c_t = div_c_t + '<input type="number" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' min="' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Menor"] + '" max="' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Mayor"] + '" onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="text-align: right;height: 25px;font-size: 11px;">'
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpnumsecuencial") {

            div_c_t = div_c_t + '<input type="number" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" readonly="readonly" style="text-align: right;height: 25px;font-size: 11px;">'
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpopcmultiple") {
            if (tipo != 'consulta') {
              div_c_t = div_c_t + '<select class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" id="' + ID_TAG + '" value="' + valor_campo + '" onchange="guardar_calcular(' + ID_TAG + ' , 0)" style="height: 25px;font-size: 11px;">'

              for (z = 0; z < Response["func_cab"][Response["campos_cab"][x]["Nombre"]].length; z++) {

                if (valor_campo == Response["func_cab"][Response["campos_cab"][x]["Nombre"]][z]["Valor"]) {
                  div_c_t = div_c_t + '<option selected value="' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][z]["Valor"] + '">' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][z]["Nombre"] + '</option>'
                } else {
                  div_c_t = div_c_t + '<option value="' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][z]["Valor"] + '">' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][z]["Nombre"] + '</option>'
                }
              }
              div_c_t = div_c_t + '</select>'
            } else {
              div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 25px;font-size: 11px;">'
            }
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpsistema") {
            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["PkId"] == 2) {
              div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" readonly="readonly" style="height: 25px;font-size: 11px;">'
            }

            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["PkId"] == 1) {
              div_c_t = div_c_t + '<input type="datetime-local" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" readonly="readonly" style="height: 25px;font-size: 11px;">'
            }
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpformuladetalle") {

            div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" readonly="readonly" onchange="guardar_calcular(' + ID_TAG + ' , 0 )" style="text-align: right;height: 25px;font-size: 11px;">'
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpfecha") {
            tipodato = 'date'

            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Tiempo"] == 'Y') {
              tipodato = 'datetime-local'
            }
            div_c_t = div_c_t + '<input type="' + tipodato + '" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 25px;font-size: 11px;">'
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpreferencia") {
            div_c_t = div_c_t + '<div class="input-group input-group-sm">'



            if (tipo != 'consulta') {
              div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + (Response["campos_cab"][x]["largoweb"] - 1) + '" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="width: 85%;height: 25px;font-size: 11px;" onkeypress="return runScript(event, ' + ID_TAG + ')" >'
              div_c_t = div_c_t + '<button type="button" class="btn btn-info" data-toggle="modal" data-target=".bs-example-modal-lg" onclick="buscar_referencia_cabecera(' + ID_TAG + ' )" style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></button>'
            } else {
              div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + (Response["campos_cab"][x]["largoweb"] - 1) + '" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 25px;font-size: 11px;" onkeypress="return runScript(event, ' + ID_TAG + ')" >'
            }

            div_c_t = div_c_t + '</div>'
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpreferenciaadjunto") {

            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Tipo"] == 'Imagen') {
              div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + '  onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 25px;font-size: 11px;">'

            }
            else {
              Moddato = ''
              if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Modificable"] == 'N') {
                Moddato = 'readonly="readonly"'
              }
              if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Tipo"] == 'Texto') {


                if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Tamano"] == 'G') {

                  div_c_t = div_c_t + '<textarea type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 45px;font-size: 11px;">' + valor_campo + '</textarea>'

                } else {
                  div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 25px;font-size: 11px;">'
                }


              }
              if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Tipo"] == 'Numero') {
                div_c_t = div_c_t + '<input type="number" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="text-align: right;" style="height: 25px;font-size: 11px;">'

              }
              if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Tipo"] == 'Fecha') {

                div_c_t = div_c_t + '<input type="date" id="' + ID_TAG + '"class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 25px;font-size: 11px;">'
              }
              if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Tipo"] == 'Fecha Tiempo') {

                div_c_t = div_c_t + '<input type="datetime-local" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 25px;font-size: 11px;">'
              }


            }
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpoperacion") {

            div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' onchange="setTwoNumberDecimal(' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Decimales"] + ')" readonly="readonly" onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="text-align: right;height: 25px;font-size: 11px;" >'
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpconsolidado") {

            div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" onchange="guardar_calcular(' + ID_TAG + ', 0)" style="height: 25px;font-size: 11px;">'
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmparchivo") {

            div_c_t = div_c_t + '<input type="file" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' style="height: 25px;font-size: 11px;">'
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpnumeroaletras") {

            div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpdecabecera") {

            div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpelectronico") {

            div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
          }
          div_c_t = div_c_t + '</div>'


          if (Response["campos_cab"][x]["posicionweb"] == "arriba_izq") {
            div_campos_arriba_izq = div_campos_arriba_izq + div_c_t
          }
          if (Response["campos_cab"][x]["posicionweb"] == "arriba_der") {
            div_campos_arriba_der = div_campos_arriba_der + div_c_t
          }
          if (Response["campos_cab"][x]["posicionweb"] == "abajo_izq") {
            div_campos_abajo_izq = div_campos_abajo_izq + div_c_t
          }
          if (Response["campos_cab"][x]["posicionweb"] == "abajo_der") {
            div_campos_abajo_der = div_campos_abajo_der + div_c_t
          }

        } else {

          div_c_inv = '<div id="div' + ID_TAG + '" class="col-sm-' + Response["campos_cab"][x]["largoweb"] + '">'

          div_c_inv = div_c_inv + '<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">'

          div_c_inv = div_c_inv + '<label class="control-label for="' + Response["campos_cab"][x]["Nombre"] + '" style="font-size: 11px;" >' + Response["campos_cab"][x]["Descripcion"] + '</label></a>'
          div_c_inv = div_c_inv + '<ul class="dropdown-menu" role="menu" style="text-align: center;">'
          div_c_inv = div_c_inv + '<li><i onclick="mod_campo_invisible(' + Response["campos_cab"][x]["PkId"] + ',0, ' + pestalla + ')" class="fa fa-ban" style="cursor: pointer;"></i></li></ul>'
          div_c_inv = div_c_inv + '<input type="text" id="' + ID_TAG + '" value="' + valor_campo + '" ' + readonly + '></div>'

          div_c_inv_tt = div_c_inv_tt + div_c_inv
        }


      }
      div_campos = div_campos + '<div class="col-md-6 col-xs-12"> <div class="row">' + div_campos_arriba_izq + '</div></div>'
      div_campos = div_campos + '<div class="col-md-6 col-xs-12"> <div class="row">' + div_campos_arriba_der + '</div></div>'


      $('#rr' + pestalla).append(div_campos);

      document.getElementById('id' + pestalla).click();




      if (typeof (Response["campos_det"]) == "object") {
        var largo_tabla = 0
        for (x = 0; x < Response["campos_det"].length; x++) {
          if (Response["campos_det"][x]["Visible"] == "Y") {
            largo_tabla = largo_tabla + parseFloat(Response["campos_det"][x]["largo"])

          }
        }

        if (tipo == 'consulta') {
          div_campos = '<div style="overflow: scroll;"><table id="tabla' + Response["pestalla"] + '" class="table table-striped" style="width: ' + parseInt(largo_tabla) + 'px;overflow-x:auto;font-size: 11px;"><thead><tr>'
        } else {
          div_campos = '<div style="overflow: scroll;" ><table id="tabla' + Response["pestalla"] + '" class="table table-striped" style="width: ' + parseInt(largo_tabla) + 'px;overflow-x:auto;font-size: 11px;"><thead><tr><th style="width: 10px;"></th>'
        }


        for (x = 0; x < Response["campos_det"].length; x++) {
          if (Response["campos_det"][x]["Visible"] == "Y") {
            //div_campos = div_campos + '<th class="col-md-' + Response["campos_det"][x]["largoweb"] + '" style="width: ' + Response["campos_det"][x]["largo"] + 'px;">' + Response["campos_det"][x]["Descripcion"] + '</th>'
            div_campos = div_campos + '<th class="col-md-' + Response["campos_det"][x]["largoweb"] + '" style="padding-left: 0px;padding-right: 0px;">' + Response["campos_det"][x]["Descripcion"] + '</th>'
          }
        }
        div_campos = div_campos + '</tr></thead><tbody>'
        var i = 0;
        do {
          if (tipo == 'consulta') {
            div_campos = div_campos + '<tr id="f' + Response["pestalla"] + '-f' + i + '">'
          } else {
            div_campos = div_campos + '<tr id="f' + Response["pestalla"] + '-f' + i + '"><td><div class="row" style="margin-left: 0px;height: 30px;">'
            div_campos = div_campos + '<button type="button" onclick="mas(' + Response["pestalla"] + ')" class="btn btn-success" style="padding: 3px 4px;">+</button>'



            div_campos = div_campos + '<button type="button" onclick="menos(' + Response["pestalla"] + ',' + i + ', 0)" class="btn btn-danger" style="padding: 3px 10px;">-</button></div></td>'
          }


          for (x = 0; x < Response["campos_det"].length; x++) {

            valor_campo = 0;
            if (tipo == 'Nuevo') {

              if (Response["campos_det"][x]["TablaCampo"] == "cmptxtsimple") {
                valor_campo = Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["ValorPredeterminado"]
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpnumsimple") {
                valor_campo = Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Menor"]
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpnumsecuencial") {
                if (Response["campos_det"][x]["TablaCampo"].slice(0, 2) == "Pk") {
                  valor_campo = 0
                } else {
                  valor_campo = Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["ValorInicial"]
                }
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpopcmultiple") {
                valor_campo = Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Valor"]
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpsistema") {
                if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["PkId"] == 2) {
                  valor_campo = web_usuario

                }
                if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["PkId"] == 1) {
                  var now = new Date();
                  valor_campo = now.format("Y-m-d") + 'T' + now.format("H:i:s")
                }
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpformuladetalle") {
                valor_campo = 0
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpfecha") {
                var now = new Date();
                addi = ' AM'
                if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Tiempo"] == "Y") {
                  if (now.format("H") > 11) { addi = ' PM' }
                  valor_campo = now + addi
                } else {
                  valor_campo = now.format("Y-m-d");
                }
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpreferencia") {
                valor_campo = Response["func_det"][Response["campos_det"][x]["Nombre"]][0][0]["predeterminado_valor"]
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpreferenciaadjunto") {
                valor_campo = 0
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpoperacion") {
                valor_campo = 0
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpconsolidado") {
                valor_campo = 0
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpdecabecera") {
                valor_campo = ""
              }
            } else {
              valor_campo = Response["valores_det"][i][Response["campos_det"][x]["Nombre"]]
            }

            id_tag_detalle = 'pd' + Response["pestalla"] + 'fff' + i + 'ccc' + Response["campos_det"][x]["Nombre"]

            if (Response["campos_det"][x]["Visible"] == "Y") {
              //div_campos = div_campos + '<td><div class="col-sm-' + Response["campos_det"][x]["largoweb"] + '" col-md-' + Response["campos_det"][x]["largoweb"] + '" col-lg-' + Response["campos_det"][x]["largoweb"] + '">'
              div_campos = div_campos + '<td style="padding-left: 0px;padding-right: 0px;"><div style="width: ' + Response["campos_det"][x]["largo"] + 'px;">'

              if (Response["campos_det"][x]["TablaCampo"] == "cmptxtsimple") {
                readonly_int = ''

                if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Modificable"] == "N") {
                  readonly_int = 'readonly="readonly"'
                }
                if (tipo == 'Nuevo') {
                  valor_campo = Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["ValorPredeterminado"]
                }
                if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Largo"] > 100) {
                  div_campos = div_campos + '<textarea type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" ' + readonly_int + ' style="font-size: 11px;">' + valor_campo + '</textarea>'
                } else {
                  div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" ' + readonly_int + ' style="height: 25px;font-size: 11px;">'
                }
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpnumsimple") {

                div_campos = div_campos + '<input type="number" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" min="' + Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Menor"] + '" max="' + Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Mayor"] + '" style="text-align: right;height: 25px;font-size: 11px;">'
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpnumsecuencial") {

                div_campos = div_campos + '<input type="number" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" readonly="readonly" onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="text-align: right; height: 25px; font-size: 11px;">'
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpopcmultiple") {
                if (tipo != 'consulta') {
                  div_campos = div_campos + '<select class="form-control" id="' + id_tag_detalle + '" value="' + valor_campo + '" onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;">'
                  for (z = 0; z < Response["func_det"][Response["campos_det"][x]["Nombre"]].length; z++) {
                    if (valor_campo == Response["func_det"][Response["campos_det"][x]["Nombre"]][z]["Valor"]) {
                      div_campos = div_campos + '<option selected value="' + Response["func_det"][Response["campos_det"][x]["Nombre"]][z]["Valor"] + '">' + Response["func_det"][Response["campos_det"][x]["Nombre"]][z]["Nombre"] + '</option>'
                    } else {
                      div_campos = div_campos + '<option value="' + Response["func_det"][Response["campos_det"][x]["Nombre"]][z]["Valor"] + '">' + Response["func_det"][Response["campos_det"][x]["Nombre"]][z]["Nombre"] + '</option>'
                    }
                  }
                  div_campos = div_campos + '</select>'
                } else {
                  div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;" >'
                }
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpsistema") {
                if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["PkId"] == 2) {
                  div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" readonly="readonly" style="height: 25px;font-size: 11px;">'
                }
                if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["PkId"] == 1) {
                  div_campos = div_campos + '<input type="datetime-local" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" readonly="readonly" onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;">'
                }
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpformuladetalle") {

                div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" readonly="readonly" onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;">'
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpfecha") {
                tipodato = 'date'
                if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Tiempo"] == 'Y') {
                  tipodato = 'datetime-local'
                }
                div_campos = div_campos + '<input type="' + tipodato + '" id="' + id_tag_detalle + '"  class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;">'
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpreferencia") {

                if (tipo == 'consulta') {
                  div_campos = div_campos + '<div class="input-group"><input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;" onkeypress="return runScript_detalle(event, ' + id_tag_detalle + ')">'
                  div_campos = div_campos + '</div>'
                } else {

                  div_campos = div_campos + '<div class="input-group"><input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="width: 75%;height: 25px;font-size: 11px;" onkeypress="return runScript_detalle(event, ' + id_tag_detalle + ')">'
                  div_campos = div_campos + '<button type="button" class="btn btn-primary" data-toggle="modal" data-target=".bs-example-modal-lg" onclick="buscar_referencia_detalle(' + id_tag_detalle + ' )" style="height: 25px;padding: 3px 4px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></button></div>'
                }
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpreferenciaadjunto") {
                if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Tipo"] == 'Imagen') {

                  div_campos = div_campos + '<div class="thumbnail" style="height: 100px;margin-bottom: 1px;"><div class="image view view-first"><img style="width: 80%;height: 60%; display: block;" id="' + id_tag_detalle + '_img" src="/static/archivos/' + web_Id_empresa + '/' + valor_campo + '" alt="image" value="' + valor_campo + '"><a id="' + id_tag_detalle + '_label" href="/static/archivos/' + web_Id_empresa + '/' + valor_campo + '" target="_blank">' + valor_campo + '</a></div></div>'

                } else {
                  Moddato = ''
                  if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Modificable"] == 'N') {
                    Moddato = 'readonly="readonly"'
                  }
                  if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Tipo"] == 'Texto') {
                    if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Tamano"] == 'G') {
                      div_campos = div_campos + '<textarea type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="font-size: 11px;">' + valor_campo + '</textarea>'
                    } else {
                      div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;">'
                    }

                  }
                  if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Tipo"] == 'Numero') {

                    div_campos = div_campos + '<input type="number" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="text-align: right;height: 25px;font-size: 11px;">'
                  }
                  if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Tipo"] == 'Fecha') {

                    div_campos = div_campos + '<input type="date" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;">'
                  }
                  if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Tipo"] == 'Fecha Tiempo') {

                    div_campos = div_campos + '<input type="datetime-local" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;">'
                  }
                }
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpoperacion") {

                div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="setTwoNumberDecimal(' + Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Decimales"] + ')" readonly="readonly" style="text-align: right;height: 25px;font-size: 11px;"> '
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpconsolidado") {

                div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmparchivo") {

                div_campos = div_campos + '<input type="file" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' style="height: 25px;font-size: 11px;">'
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpnumeroaletras") {

                div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpdecabecera") {

                div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpelectronico") {

                div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
              }

              div_campos = div_campos + '</div></td>'

            } else {
              div_campos = div_campos + '<input type="hidden" id="' + id_tag_detalle + '" value="' + valor_campo + '" ' + readonly + '>'
            }
          }

          div_campos = div_campos + '</tr>'
          i++;
        } while (i < Response["valores_det"].length);

        cc_porPesta['p-' + pestalla] = (Response["valores_det"].length)
        div_campos = div_campos + '</tbody></table></div>'


        $('#rr' + pestalla).append(div_campos);

        $('#rr' + pestalla).append('<div class="col-md-6 col-xs-12"> <div class="row">' + div_campos_abajo_izq + '</div></div>');
        $('#rr' + pestalla).append('<div class="col-md-6 col-xs-12"> <div class="row">' + div_campos_abajo_der + '</div></div>');
        $('#rr' + pestalla).append('Campos invisibles <br><div class="row">' + div_c_inv_tt + '</div>');


        document.getElementById('id' + pestalla).click();
      }

    }
  });
}



function click_val(vall) {


  if (vall == 1) {
    tabb = document.getElementById('myTab')
    tabb.innerHTML = tabb.innerHTML.replace(/role="tab" data-toggle="tab"/g, 'role="" data-toggle=""')
  } else {
    tabb = document.getElementById('myTab')
    tabb.innerHTML = tabb.innerHTML.replace(/role="" data-toggle=""/g, 'role="tab" data-toggle="tab"')
  }
}


function user_selec(pk, fila_u) {



  document.getElementById("t_us_pk").value = pk
  document.getElementById("t_us_use").value = fila_u.children[0].textContent
  document.getElementById("t_us_nom").value = fila_u.children[1].textContent
  document.getElementById("t_us_ape").value = fila_u.children[2].textContent
  document.getElementById("t_us_car").value = fila_u.children[3].textContent
  document.getElementById("t_us_cor").value = fila_u.children[4].textContent

  if (fila_u.children[5].textContent == 'Y') {
    document.getElementById("t_us_sri").checked = true
  } else {
    document.getElementById("t_us_sri").checked = false
  }
  if (fila_u.children[6].textContent == 'Y') {
    document.getElementById("t_us_adm").checked = true
  } else {
    document.getElementById("t_us_adm").checked = false
  }
  if (fila_u.children[7].textContent == 'N') {
    document.getElementById("t_us_anu").checked = true
  } else {
    document.getElementById("t_us_anu").checked = false
  }

  for (cc = 8; cc < fila_u.childElementCount; cc++) {
    if (fila_u.children[cc].textContent == 'N') {
      document.getElementById("t_us_" + parseInt(cc - 8)).checked = true
    } else {
      document.getElementById("t_us_" + parseInt(cc - 8)).checked = false
    }
  }



}
function cerrar_elementouser() {
  $('#' + 'iduser').remove();
  $('#' + 'rruser').remove();
}

function cerrar_elementodatosuser() {
  $('#' + 'datosuser').remove();
  $('#' + 'rrdatosuser').remove();
}



function formquery_guardar() {
  div_opera = document.getElementById("formquery_operacion")
  div_id = document.getElementById("formquery_id")



  texto = div_id.value.split('fff')
  div_pest = texto[0].substring(2)
  texto = texto[1].split('ccc')
  cmpNombre = texto[1]
  divfrom = dict_pestalla['p-' + div_pest]["func_det"][cmpNombre][0]['from']
  divSelect = div_opera.value


  $.ajax({
    type: 'POST',
    url: '/validar_query',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'divfrom': divfrom, 'divSelect': divSelect },
    beforeSend: function () {
      div_campos = document.getElementById("cerrar_formulas")
      div_campos.click()
    },
    success: function (Response) {

      if (Response["ok"] == 1) {
        div_campos = document.getElementById(div_id.value)
        div_campos.innerHTML = div_opera.value
        guardar_calcular_det(div_campos)
      } else {
        alert('Formula con error')
      }
    }
  });

}



function abrirformula(idDiv) {


  divi = idDiv.id.split('fff')
  int_pestalla = divi[0].substring(2)
  divi2 = divi[1].split('ccc')



  div_campos = document.getElementById("formquery_id")
  div_campos.value = idDiv.id

  div_campos = document.getElementById("formquery_campos")
  html_int = "<datalist id='formquery_campos'>"
  listado_campfom = dict_pestalla["p-" + int_pestalla]["func_det"][divi2[1]][0]['campos'].split(',')
  for (cc = 0; cc < listado_campfom.length; cc++) {
    html_int = html_int + '<option value="' + listado_campfom[cc] + '">' + listado_campfom[cc] + '</option>'
  }
  html_int = html_int + '</datalist>"'
  div_campos.innerHTML = html_int

  div_campos = document.getElementById("formquery_operacion")
  if (idDiv.innerHTML != 'Crear Formula') {
    var_cambios = idDiv.innerHTML
    var_cambios = var_cambios.replace('&lt;', '<')
    var_cambios = var_cambios.replace('&gt;', '>')
    div_campos.value = var_cambios
    div_campos.tag = idDiv.id
  } else {
    div_campos.value = ''

  }

}


function grabar_usuario(tipo) {

  t_us_pk = document.getElementById("t_us_pk").value
  t_us_use = document.getElementById("t_us_use").value
  t_us_nom = document.getElementById("t_us_nom").value
  t_us_ape = document.getElementById("t_us_ape").value
  t_us_car = document.getElementById("t_us_car").value
  t_us_cor = document.getElementById("t_us_cor").value
  t_us_cla1 = document.getElementById("t_us_cla1").value
  t_us_cla2 = document.getElementById("t_us_cla2").value

  t_us_sri = document.getElementById("t_us_sri").checked
  t_us_adm = document.getElementById("t_us_adm").checked
  t_us_anu = document.getElementById("t_us_anu").checked

  t_bloc_user = document.getElementById('blocke_paneles')
  t_paneles = ''
  for (cc = 0; cc < t_bloc_user.childElementCount; cc++) {
    if (t_bloc_user.children[cc].children[0].children[0].children[0].checked == true) {
      t_paneles = t_paneles + t_bloc_user.children[cc].children[0].children[0].children[2].value + ','
    }
  }
  if (t_paneles != '') {
    t_paneles = t_paneles.substring(0, t_paneles.length - 1)
  }

  if (t_us_sri == true) { t_us_sri = 'Y' } else { t_us_sri = 'N' }
  if (t_us_adm == true) { t_us_adm = 'Y' } else { t_us_adm = 'N' }
  if (t_us_anu == true) { t_us_anu = 'N' } else { t_us_anu = 'Y' }
  if (t_us_cla1 == t_us_cla2) {
    if (t_us_cla1 == '' && tipo == 0) {
      alert("Falta Clave")
    } else {
      $.ajax({
        type: 'POST',
        url: '/mod_usuario',
        data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 't_us_pk': t_us_pk, 'tipo': tipo, 't_us_use': t_us_use, 't_us_nom': t_us_nom, 't_us_ape': t_us_ape, 't_us_car': t_us_car, 't_us_cor': t_us_cor, 't_us_sri': t_us_sri, 't_us_adm': t_us_adm, 't_us_anu': t_us_anu, 't_us_cla1': t_us_cla1, 't_paneles': t_paneles },
        beforeSend: function () { },
        success: function (Response) {
          alert(Response["resp"])
          if (Response["ok"] == 1) {
            cerrar_elementouser()
            user_nuevo()
          }
        }
      });
    }
  } else {
    alert("Claves no son iguales")
  }
}

function grabar_datosuser() {

  d_paso = 0

  d_Id = document.getElementById("d_Id").value
  d_RazonSocial = document.getElementById("d_RazonSocial").value
  d_NombreComercial = document.getElementById("d_NombreComercial").value
  d_Direccion = document.getElementById("d_Direccion").value
  d_Archivo = document.getElementById("d_Archivo").value
  d_Clave = document.getElementById("d_Clave").value
  d_Obligado = document.getElementById("d_Obligado").value

  if (d_Id == '') {
    alert("Falta Id")
    d_paso = 1
  }
  if (d_RazonSocial == '') {
    alert("Falta RazonSocial")
    d_paso = 1
  }
  if (d_NombreComercial == '') {
    alert("Falta NombreComercial")
    d_paso = 1
  }
  if (d_Direccion == '') {
    alert("Falta Direccion")
    d_paso = 1
  }
  if (d_Clave == '') {
    alert("Falta Clave")
    d_paso = 1
  }
  if (d_Obligado == '') {
    alert("Falta Obligado")
    d_paso = 1
  }

  if (d_paso == 0) {

    $.ajax({
      type: 'POST',
      url: '/mod_grabar_datosuser',
      data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'd_Id': d_Id, 'd_RazonSocial': d_RazonSocial, 'd_NombreComercial': d_NombreComercial, 'd_Direccion': d_Direccion, 'd_Clave': d_Clave, 'd_Obligado': d_Obligado, 'd_Archivo': d_Archivo },
      beforeSend: function () { },
      success: function (Response) {
        alert(Response["resp"])
        if (Response["ok"] == 1) {
          alert("Datos actualizados")
        }
      }
    });
  }



}




function user_datos() {
  if (web_esUsuario == 'Y' || web_esAdmin == 'Y') {
    plain = document.getElementById("datosuser")
    if (plain == null) {




      $("#myTab").prepend('<li role="presentation" class="" id="lidatosuser" style="text-align: right;"><a href="#rrdatosuser" id="datosuser" role="tab" data-toggle="tab" aria-expanded="false"> Datos <i class="fa fa-times" style="color: red; background: transparent;cursor: pointer;" onclick="cerrar_elementodatosuser()"></i></a> </li>');

      $("#myTabContent").prepend('<div role="tabpanel" class="tab-pane fade" id="rrdatosuser" aria-labelledby="datosuser" style="background-color: transparent;"> <div style="padding-top: 5px;"> Procesando </div></div>');


      $.ajax({
        type: 'POST',
        url: '/traer_datosuser_n',
        data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'pestalla': pestalla },
        beforeSend: function () { },
        success: function (Response) {

          data_int = '<div style="padding-left: 0px;">'
          data_int = data_int + '<div class="box box-primary direct-chat direct-chat-primary"><div class="box-header with-border" style="padding-top: 0px;padding-bottom: 0px;"><div class="col-md-12"><div class="row">'
          data_int = data_int + '<button type="button" onclick="grabar_datosuser()" class="btn bg-green btn-flat margin"><span>Grabar</span></button>'
          data_int = data_int + '</div></div><div class="">'
          data_int = data_int + '<div class="col-md-4 col-xs-8"> <div class="row">'
          data_int = data_int + '<input type="hidden" id="t_us_pk" class="form-control col-sm-4" value="" style="height: 25px;font-size: 11px;">'
          data_int = data_int + '<div class="col-sm-8"><label class="control-label for="d_Id"="" style="font-size: 12px;font-weight: bold;">Id</label><input type="text" id="d_Id" class="form-control col-sm-4" value="' + Response['userDatos'][0]['d_Id'].toString() + '" style="height: 25px;font-size: 11px;"></div>'
          data_int = data_int + '<div class="col-sm-8"><label class="control-label for="t_us_nom"="" style="font-size: 12px;font-weight: bold;">RazonSocial</label><input type="text" id="d_RazonSocial" class="form-control col-sm-8" value="' + Response['userDatos'][0]['d_RazonSocial'].toString() + '" style="height: 25px;font-size: 11px;"></div>'
          data_int = data_int + '<div class="col-sm-8"><label class="control-label for="t_us_ape"="" style="font-size: 12px;font-weight: bold;">NombreComercial</label><input type="text" id="d_NombreComercial" class="form-control col-sm-8" value="' + Response['userDatos'][0]['d_NombreComercial'].toString() + '" style="height: 25px;font-size: 11px;"></div>'
          data_int = data_int + '<div class="col-sm-8"><label class="control-label for="t_us_car"="" style="font-size: 12px;font-weight: bold;">Direccion</label><input type="text" id="d_Direccion" class="form-control col-sm-8" value="' + Response['userDatos'][0]['d_Direccion'].toString() + '" style="height: 25px;font-size: 11px;"></div>'
          data_int = data_int + '<div class="col-sm-8"><label class="control-label for="t_us_cor"="" style="font-size: 12px;font-weight: bold;">Archivo</label><input type="text" id="d_Archivo" class="form-control col-sm-8" value="' + Response['userDatos'][0]['d_Archivo'] + '" style="height: 25px;font-size: 11px;"></div>'

          data_int = data_int + '<div class="col-sm-8"><label class="control-label for="t_us_cor"="" style="font-size: 12px;font-weight: bold;">Clave</label><input type="text" id="d_Clave" class="form-control col-sm-8" value="' + Response['userDatos'][0]['d_Clave'].toString() + '" style="height: 25px;font-size: 11px;"></div>'
          data_int = data_int + '<div class="col-sm-8"><label class="control-label for="t_us_cor"="" style="font-size: 12px;font-weight: bold;">Obligado</label><input type="text" id="d_Obligado" class="form-control col-sm-8" value="' + Response['userDatos'][0]['d_Obligado'].toString() + '" style="height: 25px;font-size: 11px;"></div>'


          data_int = data_int + '</div></div></div>'








          data_int = data_int + '</div></div></div>'
          $('#rrdatosuser').html(data_int);
          document.getElementById('datosuser').click();
        }
      });


    } else {
      document.getElementById('datosuser').click();
    }


  } else {
    alert("Solo administrador puede crear usuarios")
  }
  var dd = document.getElementById('link_herra')
  dd.click()
}

function user_nuevo() {
  if (web_esUsuario == 'Y' || web_esAdmin == 'Y') {
    plain = document.getElementById("iduser")
    if (plain == null) {




      $("#myTab").prepend('<li role="presentation" class="" id="liuser" style="text-align: right;"><a href="#rruser" id="iduser" role="tab" data-toggle="tab" aria-expanded="false"> Usuarios <i class="fa fa-times" style="color: red; background: transparent;cursor: pointer;" onclick="cerrar_elementouser()"></i></a> </li>');

      $("#myTabContent").prepend('<div role="tabpanel" class="tab-pane fade" id="rruser" aria-labelledby="iduser" style="background-color: transparent;"> <div style="padding-top: 5px;"> Procesando </div></div>');


      $.ajax({
        type: 'POST',
        url: '/traer_usuario_n',
        data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'pestalla': pestalla },
        beforeSend: function () { },
        success: function (Response) {

          data_int = '<div style="padding-left: 0px;">'
          data_int = data_int + '<div class="box box-primary direct-chat direct-chat-primary"><div class="box-header with-border" style="padding-top: 0px;padding-bottom: 0px;"><div class="col-md-12"><div class="row">'
          data_int = data_int + '<button type="button" onclick="grabar_usuario(0)" class="btn bg-blue btn-flat margin"><span>Crear Nuevo</span></button>'
          data_int = data_int + '<button type="button" onclick="grabar_usuario(1)" class="btn bg-green btn-flat margin"><span>Modificar</span></button>'
          data_int = data_int + '<button type="button" onclick="grabar_usuario(2)" class="btn bg-red btn-flat margin"><span>Eliminar</span></button></div></div><div class="">'
          data_int = data_int + '<div class="col-md-4 col-xs-8"> <div class="row">'
          data_int = data_int + '<input type="hidden" id="t_us_pk" class="form-control col-sm-4" value="" style="height: 25px;font-size: 11px;">'
          data_int = data_int + '<div class="col-sm-8"><label class="control-label for="t_us_use"="" style="font-size: 12px;font-weight: bold;">Usuario</label><input type="text" id="t_us_use" class="form-control col-sm-4" value="" style="height: 25px;font-size: 11px;"></div>'
          data_int = data_int + '<div class="col-sm-8"><label class="control-label for="t_us_nom"="" style="font-size: 12px;font-weight: bold;">Nombres</label><input type="text" id="t_us_nom" class="form-control col-sm-8" value="" style="height: 25px;font-size: 11px;"></div>'
          data_int = data_int + '<div class="col-sm-8"><label class="control-label for="t_us_ape"="" style="font-size: 12px;font-weight: bold;">Apellidos</label><input type="text" id="t_us_ape" class="form-control col-sm-8" value="" style="height: 25px;font-size: 11px;"></div>'
          data_int = data_int + '<div class="col-sm-8"><label class="control-label for="t_us_car"="" style="font-size: 12px;font-weight: bold;">Cargo</label><input type="text" id="t_us_car" class="form-control col-sm-8" value="" style="height: 25px;font-size: 11px;"></div>'
          data_int = data_int + '<div class="col-sm-8"><label class="control-label for="t_us_cor"="" style="font-size: 12px;font-weight: bold;">Correo</label><input type="text" id="t_us_cor" class="form-control col-sm-8" value="" style="height: 25px;font-size: 11px;"></div>'
          data_int = data_int + '<div class="col-sm-12"><div class="col-sm-5"><label class="control-label for="t_us_cla1"="" style="font-size: 12px;font-weight: bold;">Clave</label><input type="password" id="t_us_cla1" class="form-control col-sm-8" value="" style="height: 25px;font-size: 11px;"></div><div class="col-sm-5"><label class="control-label for="t_us_cla2"="" style="font-size: 12px;font-weight: bold;">Repetir Clave</label><input type="password" id="t_us_cla2" class="form-control col-sm-8" value="" style="height: 25px;font-size: 11px;"></div></div>'



          data_int = data_int + '<div class="col-sm-6">'

          data_int = data_int + '<div class="col-sm-12"><div class="checkbox"><label><input type="checkbox" id="t_us_sri"><span class="checkbox-material"><span class="check"></span> Archivo SRI</span></label></div></div>'

          if (web_esAdmin == 'Y') {
            data_int = data_int + '<div class="col-sm-12"><div class="checkbox"><label><input type="checkbox" id="t_us_adm"><span class="checkbox-material"><span class="check"></span> Administrado</span></label></div></div>'
          } else {
            data_int = data_int + '<div class="col-sm-12" style="display: none;"><div class="checkbox"><label><input type="checkbox" id="t_us_adm"><span class="checkbox-material"><span class="check"></span> Administrado</span></label></div></div>'
          }

          data_int = data_int + '<div class="col-sm-12"><div class="checkbox"><label><input type="checkbox" id="t_us_anu"><span class="checkbox-material"><span class="check"></span> Valido</span></label></div></div>'
          data_int = data_int + '</div>'

          data_int = data_int + '<div class="col-sm-6" id="blocke_paneles">'
          for (var i = 0; i < Response["list_paneles"].length; i++) {
            data_int = data_int + '<div class="col-sm-12"><div class="checkbox"><label><input type="checkbox" id="t_us_' + i + '"><span class="checkbox-material"><span class="check"></span> ' + Response["list_paneles"][i]['nombre'] + '</span><input type="hidden" value="' + Response["list_paneles"][i]['pkPanel'] + '"></label></div></div>'

          }




          data_int = data_int + '</div>'

          data_int = data_int + '</div></div></div>'


          data_int = data_int + '<div class="col-md-7 col-xs-12" style="height: 450px;overflow: scroll;"><table class="table table-bordered" style="background: white;"><thead><tr style="align-content: center;">'
          data_int = data_int + '<th style="text-align: center;">Usuario</th><th style="text-align: center;">Nombres</th><th style="text-align: center;">Apellido</th><th style="text-align: center;">Cargo</th><th style="text-align: center;">Correo</th><th style="text-align: center;">SRI</th><th style="text-align: center;">Admin</th><th style="text-align: center;">Valido</th>'
          for (var e = 0; e < Response["list_paneles"].length; e++) {
            data_int = data_int + '<th>' + Response["list_paneles"][e]['nombre'] + '</th>'
          }

          data_int = data_int + '</tr></thead><tbody>'



          stilog = 'style="background: green;color: green;"'
          stilor = 'style="background: red;color: red;"'

          for (var i = 0; i < Response["list_usuario"].length; i++) {
            data_int = data_int + '<tr onclick="user_selec(' + Response["list_usuario"][i]["PkUsuario"] + ',this)"><td>' + Response["list_usuario"][i]["Usuario"] + '</td><td>' + Response["list_usuario"][i]["Nombre"] + '</td><td>' + Response["list_usuario"][i]["Apellido"] + '</td><td>' + Response["list_usuario"][i]["Cargo"] + '</td><td>' + Response["list_usuario"][i]["Correo"] + '</td>'
            if (Response["list_usuario"][i]["Sri"] == 'Y') {
              data_int = data_int + '<td ' + stilog + '>' + Response["list_usuario"][i]["Sri"] + '</td>'
            } else {
              data_int = data_int + '<td ' + stilor + '>' + Response["list_usuario"][i]["Sri"] + '</td>'
            }
            if (Response["list_usuario"][i]["Admin"] == 'Y') {
              data_int = data_int + '<td ' + stilog + '>' + Response["list_usuario"][i]["Admin"] + '</td>'
            } else {
              data_int = data_int + '<td ' + stilor + '>' + Response["list_usuario"][i]["Admin"] + '</td>'
            }
            if (Response["list_usuario"][i]["Anulado"] == 'Y') {
              data_int = data_int + '<td ' + stilor + '>' + Response["list_usuario"][i]["Anulado"] + '</td>'
            } else {
              data_int = data_int + '<td ' + stilog + '>' + Response["list_usuario"][i]["Anulado"] + '</td>'
            }


            for (var e = 0; e < Response["list_paneles"].length; e++) {
              var entro = false
              for (var e2 = 0; e2 < Response["list_paneles_usuario"].length; e2++) {

                if (Response["list_paneles"][e]['pkPanel'] == Response["list_paneles_usuario"][e2]['pkpanel']) {
                  if (Response["list_paneles_usuario"][e2]['usuario'].toString().toUpperCase() == Response["list_usuario"][i]["Usuario"].toString().toUpperCase()) {
                    entro = true
                  }
                }
              }
              if (entro == true) {
                data_int = data_int + '<td style="background: green;color: green;">N</td>'
              } else {
                data_int = data_int + '<td style="background: red;color: red;">Y</td>'
              }



            }

            data_int = data_int + '</tr>'
          };
          data_int = data_int + '</tbody></table></div></div></div></div>'
          $('#rruser').html(data_int);
          document.getElementById('iduser').click();
        }
      });
      var dd = document.getElementById('link_herra')
      dd.click()

    } else {
      document.getElementById('iduser').click();
    }


  } else {
    alert("Solo administrador puede crear usuarios")
  }
}


function cambiar_clave_u() {
  c_us_clave = document.getElementById("user_re_clave").value
  if (c_us_clave == '') {
    alert("Falta Clave")
  } else {
    $.ajax({
      type: 'POST',
      url: '/cla_usuario',
      data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'c_us_clave': c_us_clave },
      beforeSend: function () { },
      success: function (Response) {
        alert(Response["resp"])
        if (Response["ok"] == 1) {
          divv = document.getElementById("div_cambio")
          divv.innerHTML = ''
        }
      }
    });
  }


}
function user_clave() {


  divv = document.getElementById("div_cambio")

  if (divv.innerHTML == '') {
    divv.innerHTML = '<input type="password" id="user_re_clave" style="height: 25px;font-size: 11px;margin-left: 5px;" value="" placeholder="Nueva Clave"><button type="button" class="btn bg-blue btn-flat margin" onclick="cambiar_clave_u()" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-check"></i><div class="ripple-container"></div></button>'
  } else {
    divv.innerHTML = ''
  }


}

function cerrar_elementoacceso() {
  $('#' + 'idacceso').remove()
  $('#' + 'rracceso').remove()
}



function number_format(number, decimals, dec_point, thousands_sep) {

  number = (number + '').replace(',', '').replace(' ', '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}


function abrir_SRI_mes() {


  var sri_periodo = document.getElementById("fecha_sri_periodo_mes").value
  var sri_anio = document.getElementById("fecha_sri_anio_mes").value
  var fecha_completa = sri_anio + '-' + sri_periodo + '-01'


  $.ajax({
    type: 'POST',
    url: '/traer_sri_ATS_mes',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'fecha': fecha_completa },
    beforeSend: function () { },
    success: function (Response) {

      ats = Response['ats_valores']
      //--------------------ats XML
      xmltext = '<?xml version="1.0" encoding="UTF-8"?><iva>'

      xmltext = xmltext + '<TipoIDInformante>' + ats["cabecera"][0]["TipoIDInformante"] + '</TipoIDInformante>'
      xmltext = xmltext + '<IdInformante>' + ats["cabecera"][0]["IdInformante"] + '</IdInformante>'
      xmltext = xmltext + '<razonSocial>' + ats["cabecera"][0]["razonSocial"] + '</razonSocial>'
      xmltext = xmltext + '<Anio>' + sri_anio + '</Anio>'
      xmltext = xmltext + '<Mes>' + sri_periodo + '</Mes>'
      xmltext = xmltext + '<numEstabRuc>' + (1000 + ats["atsCountEstab"][0]["sumCodEstab"]).toString().substring(1) + '</numEstabRuc>'
      xmltext = xmltext + '<totalVentas>' + ats["atsSumEstab_sep_2016"][0]["sumaEstab"] + '</totalVentas>'
      xmltext = xmltext + '<codigoOperativo>' + ats["cabecera"][0]["codigoOperativo"] + '</codigoOperativo>'



      xmltext = xmltext + '<compras>'

      for (d1 = 0; d1 < ats["atmcompras"].length; d1++) {

        xmltext = xmltext + '<detalleCompras>'
        xmltext = xmltext + '<codSustento>' + ats["atmcompras"][d1]['codSustento'] + '</codSustento>'
        xmltext = xmltext + '<tpIdProv>' + ats["atmcompras"][d1]['tpIdProv'] + '</tpIdProv>'
        xmltext = xmltext + '<idProv>' + ats["atmcompras"][d1]['idProv'] + '</idProv>'
        xmltext = xmltext + '<tipoComprobante>' + ats["atmcompras"][d1]['tipoComprobante'] + '</tipoComprobante>'
        xmltext = xmltext + '<parteRel>' + ats["atmcompras"][d1]['parteRel'] + '</parteRel>'
        xmltext = xmltext + '<fechaRegistro>' + ats["atmcompras"][d1]['fechaRegistro'] + '</fechaRegistro>'
        xmltext = xmltext + '<establecimiento>' + ats["atmcompras"][d1]['establecimiento'] + '</establecimiento>'
        xmltext = xmltext + '<puntoEmision>' + ats["atmcompras"][d1]['puntoEmision'] + '</puntoEmision>'
        xmltext = xmltext + '<secuencial>' + ats["atmcompras"][d1]['secuencial'] + '</secuencial>'
        xmltext = xmltext + '<fechaEmision>' + ats["atmcompras"][d1]['fechaEmision'] + '</fechaEmision>'
        xmltext = xmltext + '<autorizacion>' + ats["atmcompras"][d1]['autorizacion'] + '</autorizacion>'
        xmltext = xmltext + '<baseNoGraIva>' + ats["atmcompras"][d1]['baseNoGraIva'] + '</baseNoGraIva>'
        xmltext = xmltext + '<baseImponible>' + ats["atmcompras"][d1]['baseImponible'] + '</baseImponible>'
        xmltext = xmltext + '<baseImpGrav>' + ats["atmcompras"][d1]['baseImpGrav'] + '</baseImpGrav>'
        xmltext = xmltext + '<baseImpExe>' + ats["atmcompras"][d1]['baseImpExe'] + '</baseImpExe>'
        xmltext = xmltext + '<montoIce>' + ats["atmcompras"][d1]['montoIce'] + '</montoIce>'
        xmltext = xmltext + '<montoIva>' + ats["atmcompras"][d1]['montoIva'] + '</montoIva>'
        xmltext = xmltext + '<valRetBien10>' + ats["atmcompras"][d1]['valRetBien10'] + '</valRetBien10>'
        xmltext = xmltext + '<valRetServ20>' + ats["atmcompras"][d1]['valRetServ20'] + '</valRetServ20>'
        xmltext = xmltext + '<valorRetBienes>' + ats["atmcompras"][d1]['valorRetBienes'] + '</valorRetBienes>'
        xmltext = xmltext + '<valRetServ50>' + ats["atmcompras"][d1]['valRetServ50'] + '</valRetServ50>'
        xmltext = xmltext + '<valorRetServicios>' + ats["atmcompras"][d1]['valorRetServicios'] + '</valorRetServicios>'
        xmltext = xmltext + '<valRetServ100>' + ats["atmcompras"][d1]['valRetServ100'] + '</valRetServ100>'
        xmltext = xmltext + '<totbasesImpReemb>' + ats["atmcompras"][d1]['totbasesImpReemb'] + '</totbasesImpReemb>'
        xmltext = xmltext + '<pagoExterior>'
        xmltext = xmltext + '<pagoLocExt>01</pagoLocExt>'
        xmltext = xmltext + '<paisEfecPago>NA</paisEfecPago>'
        xmltext = xmltext + '<aplicConvDobTrib>NA</aplicConvDobTrib>'
        xmltext = xmltext + '<pagExtSujRetNorLeg>NA</pagExtSujRetNorLeg>'
        xmltext = xmltext + '<pagoRegFis>NA</pagoRegFis>'
        xmltext = xmltext + '</pagoExterior>'

        if ((parseFloat(ats["atmcompras"][d1]['baseNoGraIva']) + parseFloat(ats["atmcompras"][d1]['baseImponible']) + parseFloat(ats["atmcompras"][d1]['baseImpGrav']) + parseFloat(ats["atmcompras"][d1]['montoIva']) + parseFloat(ats["atmcompras"][d1]['montoIce'])) >= 1000) {
          xmltext = xmltext + '<formasDePago>'
          xmltext = xmltext + '<formaPago>20</formaPago>'

          xmltext = xmltext + '</formasDePago>'
        }


        if (ats["atmcompras"][d1]['tipoComprobante'] == '04' || ats["atmcompras"][d1]['tipoComprobante'] == '05') {

          xmltext = xmltext + '<docModificado>' + ats["atmcompras"][d1]['docModificado'] + '</docModificado>'
          xmltext = xmltext + '<estabModificado>' + ats["atmcompras"][d1]['estabModificado'] + '</estabModificado>'
          xmltext = xmltext + '<ptoEmiModificado>' + ats["atmcompras"][d1]['ptoEmiModificado'] + '</ptoEmiModificado>'
          xmltext = xmltext + '<secModificado>' + ats["atmcompras"][d1]['secModificado'] + '</secModificado>'
          xmltext = xmltext + '<autModificado>' + ats["atmcompras"][d1]['autModificado'] + '</autModificado>'

        } else {

          xml_ret = '<air>'

          for (d2 = 0; d2 < ats["atmcompras_detalle_ret"].length; d2++) {
            if (ats["atmcompras_detalle_ret"][d2]["Pk"] == ats["atmcompras"][d1]['Pk']) {
              if (ats["atmcompras_detalle_ret"][d2]["codRetAir"] != '0') {
                if (ats["atmcompras_detalle_ret"][d2]["codRetAir"] != '1') {
                  if (ats["atmcompras_detalle_ret"][d2]["codRetAir"] != '2') {
                    xml_ret = xml_ret + '<detalleAir>'
                    xml_ret = xml_ret + '<codRetAir>' + ats["atmcompras_detalle_ret"][d2]["codRetAir"] + '</codRetAir>'
                    xml_ret = xml_ret + '<baseImpAir>' + ats["atmcompras_detalle_ret"][d2]["baseImpAir"] + '</baseImpAir>'
                    xml_ret = xml_ret + '<porcentajeAir>' + ats["atmcompras_detalle_ret"][d2]["porcentajeAir"] + '</porcentajeAir>'
                    xml_ret = xml_ret + '<valRetAir>' + ats["atmcompras_detalle_ret"][d2]["valRetAir"] + '</valRetAir>'
                    xml_ret = xml_ret + '</detalleAir>'
                  }
                }
              }
            }
          }

          if (xml_ret != '<air>') {
            xmltext = xmltext + xml_ret + '</air>'
          }

          if (parseFloat(ats["atmcompras"][d1]['secRetencion1']) > 0) {
            xmltext = xmltext + '<estabRetencion1>' + ats["atmcompras"][d1]['estabRetencion1'] + '</estabRetencion1>'
            xmltext = xmltext + '<ptoEmiRetencion1>' + ats["atmcompras"][d1]['ptoEmiRetencion1'] + '</ptoEmiRetencion1>'
            xmltext = xmltext + '<secRetencion1>' + ats["atmcompras"][d1]['secRetencion1'] + '</secRetencion1>'
            xmltext = xmltext + '<autRetencion1>' + ats["atmcompras"][d1]['autRetencion1'] + '</autRetencion1>'
            xmltext = xmltext + '<fechaEmiRet1>' + ats["atmcompras"][d1]['fechaEmiRet1'] + '</fechaEmiRet1>'
          }
        }
        xmltext = xmltext + '</detalleCompras>'

      }


      xmltext = xmltext + '</compras>'

      xmltext = xmltext + '<ventas>'

      for (d1 = 0; d1 < ats["atmventas_sep_2016"].length; d1++) {

        xmltext = xmltext + '<detalleVentas>'
        xmltext = xmltext + '<tpIdCliente>' + ats["atmventas_sep_2016"][d1]['tpIdCliente'] + '</tpIdCliente>'
        xmltext = xmltext + '<idCliente>' + ats["atmventas_sep_2016"][d1]['idCliente'] + '</idCliente>'

        if (ats["atmventas_sep_2016"][d1]['tpIdCliente'] != '07') {
          xmltext = xmltext + '<parteRelVtas>' + ats["atmventas_sep_2016"][d1]['parteRelVtas'] + '</parteRelVtas>'
        }
        if (ats["atmventas_sep_2016"][d1]['tpIdCliente'] == '06') {
          xmltext = xmltext + '<tipoCliente>02</tipoCliente>'
          xmltext = xmltext + '<denoCli>' + ats["atmventas_sep_2016"][d1]['CLIENTE'] + '</denoCli>'
        }
        xmltext = xmltext + '<tipoComprobante>' + ats["atmventas_sep_2016"][d1]['tipoComprobante'] + '</tipoComprobante>'
        xmltext = xmltext + '<tipoEmision>' + ats["atmventas_sep_2016"][d1]['tipoEmision'] + '</tipoEmision>'
        xmltext = xmltext + '<numeroComprobantes>' + ats["atmventas_sep_2016"][d1]['numeroComprobantes'] + '</numeroComprobantes>'
        xmltext = xmltext + '<baseNoGraIva>' + ats["atmventas_sep_2016"][d1]['baseNoGraIva'] + '</baseNoGraIva>'
        xmltext = xmltext + '<baseImponible>' + ats["atmventas_sep_2016"][d1]['baseImponible'] + '</baseImponible>'
        xmltext = xmltext + '<baseImpGrav>' + ats["atmventas_sep_2016"][d1]['baseImpGrav'] + '</baseImpGrav>'
        xmltext = xmltext + '<montoIva>' + ats["atmventas_sep_2016"][d1]['montoIva'] + '</montoIva>'

        if (parseFloat(ats["atmventas_sep_2016"][d1]['monto1']) > 0) {
          xmltext = xmltext + '<compensaciones><compensacion>'
          xmltext = xmltext + '<tipoCompe>' + ats["atmventas_sep_2016"][d1]['tipoCompe1'] + '</tipoCompe>'
          xmltext = xmltext + '<monto>' + ats["atmventas_sep_2016"][d1]['monto1'] + '</monto>'
          xmltext = xmltext + '</compensacion>'
          if (parseFloat(ats["atmventas_sep_2016"][d1]['monto2']) > 0) {
            xmltext = xmltext + '<compensacion>'
            xmltext = xmltext + '<tipoCompe>' + ats["atmventas_sep_2016"][d1]['tipoCompe2'] + '</tipoCompe>'
            xmltext = xmltext + '<monto>' + ats["atmventas_sep_2016"][d1]['monto2'] + '</monto>'
            xmltext = xmltext + '</compensacion>'
          }
          xmltext = xmltext + '</compensaciones>'
        }


        xmltext = xmltext + '<montoIce>' + ats["atmventas_sep_2016"][d1]['montoIce'] + '</montoIce>'
        xmltext = xmltext + '<valorRetIva>' + ats["atmventas_sep_2016"][d1]['valorRetIva'] + '</valorRetIva>'
        xmltext = xmltext + '<valorRetRenta>' + ats["atmventas_sep_2016"][d1]['valorRetRenta'] + '</valorRetRenta>'

        if (ats["atmventas_sep_2016"][d1]['tipoComprobante'] == "18") {
          xmltext = xmltext + '<formasDePago>'
          xmltext = xmltext + '<formaPago>20</formaPago>'
          xmltext = xmltext + '</formasDePago>'
        }
        xmltext = xmltext + '</detalleVentas>'
      }
      xmltext = xmltext + '</ventas>'


      xmltext = xmltext + '<ventasEstablecimiento>'
      for (d1 = 0; d1 < ats["ventasEstablecimiento_sep_2016"].length; d1++) {
        xmltext = xmltext + '<ventaEst>'
        xmltext = xmltext + '<codEstab>' + ats["ventasEstablecimiento_sep_2016"][d1]['codEstab'] + '</codEstab>'
        xmltext = xmltext + '<ventasEstab>' + ats["ventasEstablecimiento_sep_2016"][d1]['ventasEstab'] + '</ventasEstab>'
        xmltext = xmltext + '<ivaComp>' + ats["ventasEstablecimiento_sep_2016"][d1]['ivaComp'] + '</ivaComp>'
        xmltext = xmltext + '</ventaEst>'
      }
      xmltext = xmltext + '</ventasEstablecimiento>'


      if (ats["atmanuladas"].length > 0) {
        xmltext = xmltext + '<anulados>'
        for (d1 = 0; d1 < ats["atmanuladas"].length; d1++) {
          xmltext = xmltext + '<detalleAnulados>'
          xmltext = xmltext + '<tipoComprobante>' + ats["atmanuladas"][d1]['TipoComprobante'] + '</tipoComprobante>'
          xmltext = xmltext + '<establecimiento>' + ats["atmanuladas"][d1]['Establecimiento'] + '</establecimiento>'
          xmltext = xmltext + '<puntoEmision>' + ats["atmanuladas"][d1]['PuntoEmision'] + '</puntoEmision>'
          xmltext = xmltext + '<secuencialInicio>' + ats["atmanuladas"][d1]['Secuencialinicio'] + '</secuencialInicio>'
          xmltext = xmltext + '<secuencialFin>' + ats["atmanuladas"][d1]['Secuencialfin'] + '</secuencialFin>'
          xmltext = xmltext + '<autorizacion>' + ats["atmanuladas"][d1]['Autorizacion'] + '</autorizacion>'
          xmltext = xmltext + '</detalleAnulados>'
        }

        xmltext = xmltext + '</anulados>'
      }


      xmltext = xmltext + '</iva>'

      hacer_xml(xmltext, ("ats" + sri_anio + "-" + sri_periodo))
      //--------------------ats XML
    }
  });
}

function hacer_xml(xmltext, nombre) {

  var pom = document.createElement('a');

  var filename = nombre + ".xml";
  var pom = document.createElement('a');
  var bb = new Blob([xmltext], { type: 'text/plain' });

  pom.setAttribute('href', window.URL.createObjectURL(bb));
  pom.setAttribute('download', filename);

  pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
  pom.draggable = true;
  pom.classList.add('dragout');

  pom.click();


}


function cambio_estado_desde_panel(pkmodulo, pkregistro, pkestado, pestana_int, t_pkpanel, t_pkgrupo, t_xE, t_pkmodulo) {



  $.ajax({
    type: 'POST',
    url: '/cambio_estado',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'pkmodulo': pkmodulo, 'pkregistro': pkregistro, 'pkestado': pkestado },
    beforeSend: function () { },
    success: function (Response) {
      alert(Response['msg'])
      cerrar_elemento(pestana_int)
      //actualizar_paneles()
      paneles_taraer(t_pkpanel, t_pkgrupo, t_xE, t_pkmodulo)
    }
  });

}

function cambio_estado(pkmodulo, pkregistro, pkestado, pestana_int) {

  l_variables = dict_pestalla['p-' + pestana_int]['estados']
  p_variable = {}

  for (var i = 0; i < l_variables.length; i++) {
    if (l_variables[i]['pkweb_estados_doc'] == pkestado) {
      for (var i2 = 0; i2 < l_variables[i]['variables'].length; i2++) {
        let vari = prompt(l_variables[i]['variables'][i2]['Nombre'], "");
        let text;
        if (vari == null || vari == "") {
          p_variable[l_variables[i]['variables'][i2]['Nombre']] = ""
        } else {
          p_variable[l_variables[i]['variables'][i2]['Nombre']] = vari
        }
      }
    }




  }

  $.ajax({
    type: 'POST',
    url: '/cambio_estado',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'pkmodulo': pkmodulo, 'pkregistro': pkregistro, 'pkestado': pkestado, 'variables': JSON.stringify(p_variable) },
    beforeSend: function () { },
    success: function (Response) {
      alert(Response['msg'])
      if (Response['resultado'] == 'bien') {
        cerrar_elemento(pestana_int)
      }
      //actualizar_paneles()
    }
  });

}

function pre_ejecutados() {

  $.ajax({
    type: 'POST',
    url: '/pre_ejecutados',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma },
    beforeSend: function () { },
    success: function (Response) {
      for (var i = 0; i < Response["pre_valores"].length; i++) {
        reporte_ejecutar_directo(Response["pre_valores"][i])
      };

    }
  });

}

function reporte_ejecutar_directo(datos) {
  pestalla = pestalla + 1

  $("#myTab").prepend('<li role="presentation" class="" id="li' + pestalla + '" style="text-align: right;"><a href="#rr' + pestalla + '" id="id' + pestalla + '" role="tab" data-toggle="tab" aria-expanded="false">' + datos['nombre'] + ' <i class="fa fa-times" style="color: red; background: transparent;cursor: pointer;" onclick="cerrar_elemento(' + pestalla + ')"></i></a> </li>');

  $("#myTabContent").prepend('<div role="tabpanel" class="tab-pane fade" id="rr' + pestalla + '" aria-labelledby="id' + pestalla + '" style="background-color: transparent;"> <div style="padding-top: 5px;"> Procesando </div></div>');

  senten = []
  str1 = []
  str2 = []
  str3 = []
  str4 = []
  str5 = []

  label = {}
  varref = {}
  varvar = {}

  for (x2 = 0; x2 < datos["senten"][0].length; x2++) {
    str1.push(datos["senten"][0][x2]["sentencia"])
  }
  for (x2 = 0; x2 < datos["senten"][1].length; x2++) {
    str2.push(datos["senten"][1][x2]["sentencia"])
  }
  for (x2 = 0; x2 < datos["senten"][2].length; x2++) {
    str3.push(datos["senten"][2][x2]["sentencia"])
  }
  for (x2 = 0; x2 < datos["senten"][3].length; x2++) {
    str4.push(datos["senten"][3][x2]["sentencia"])
  }
  for (x2 = 0; x2 < datos["senten"][4].length; x2++) {
    str5.push(datos["senten"][4][x2]["sentencia"])
  }
  for (x2 = 0; x2 < str1.length; x2++) {
    senten.push(str1[x2] + str2[x2] + str3[x2] + str4[x2] + str5[x2])
  }

  for (x = 0; x < datos["ref"].length; x++) {
    //id_tem =  "rpzz" + tem_pestalla + "zz"+ x + "zz" + Response["referencias_reprotes"][x]["id"]
    //varref[Response["referencias_reprotes"][x]["id_rep"]] = String(document.getElementById(id_tem).value)  
    //label[Response["referencias_reprotes"][x]["id_rep"]] = Response["referencias_reprotes"][x]["glosa"]
  }

  for (x = 0; x < datos["var"].length; x++) {
    //id_tem =  "var-"+ tem_pestalla + "-"+ Response["variables_reprotes"][x]["id"]
    //varvar[Response["variables_reprotes"][x]["id_rep"]] = String(document.getElementById(id_tem).value)    
    //label[Response["variables_reprotes"][x]["id_rep"]] = Response["variables_reprotes"][x]["glosa"]

  }
  $.ajax({
    type: 'POST',
    url: '/reporte_ejecutar',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'senten': JSON.stringify(senten), 'usuario': web_usuario, 'label': JSON.stringify(label), 'varref': JSON.stringify(varref), 'varvar': JSON.stringify(varvar), 'pestalla': pestalla, 'id': datos["pk"], 'nombre_rep': Response["nombre_rep"] },
    beforeSend: function () {

      data_int = '<div class="col-md-12" style="padding-top: 5px;"><div class="col-middle"><button type="button" onclick="cerrar_elemento(' + pestalla + ')" class="btn bg-red btn-flat margin"><span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span></button><div class="text-center text-center"><h1 class="error-number"></h1><h2>Espere</h2><p>El panel esta cargando.</p><div class="weather-icon"><span><canvas height="84" width="84" id="partly-cloudy-day"></canvas></span></div></div></div></div>'
      $('#rr' + pestalla).html(data_int);


    },
    success: function (Response) {

      dict_pestalla['p-' + Response["pestalla"]] = Response
      dict_pestalla['p-' + Response["pestalla"]]["vinculacion"] = {}
      reppuesta_rep = Response["resutado"]
      sumatorias = Response['reptotales'][0]['Sentencia'].split(',')

      data_int = '<div style="padding-top: 5px;"><div class="panel-body" style="overflow: scroll;"><div class="row">'
      data_int = data_int + '<button class="btn bg-blue btn-flat margin" id="reporteejecutar" name="reporteejecutar" type="submit" value="4" onclick="reejecutar_reprote(' + Response["id"] + ')">Nuevo</button>'
      data_int = data_int + '<button type="button" onclick="cerrar_elemento(' + Response["pestalla"] + ')" class="btn bg-red btn-flat margin"><span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span></button>'
      data_int = data_int + '<button type="button" data-toggle="tooltip" data-placement="top" style="background: gainsboro;    border: dotted;    color: black;    font-size: larger;    margin-top: 0px;    margin-bottom: 0px;" title="Pdf" onclick="pdf_reporte(' + Response["pestalla"] + ')" class="btn btn-info"><span class="fa fa-file-pdf-o" aria-hidden="true"></span></button>'
      data_int = data_int + '<button type="button" style="background: gainsboro;    border: dotted;    color: black;    font-size: larger;    margin-top: 0px;    margin-bottom: 0px;"data-toggle="tooltip" data-placement="top" title="Excell" onclick="excell_reporte(' + Response["pestalla"] + ')" class="btn btn-info"><span class="fa fa-file-excel-o" aria-hidden="true"></span></button>'
      data_int = data_int + '<button type="button" style="background: gainsboro;    border: dotted;    color: black;    font-size: larger;    margin-top: 0px;    margin-bottom: 0px;"data-toggle="tooltip" data-placement="top" title="Txt" onclick="txt_reporte(' + Response["pestalla"] + ')" class="btn btn-info"><span class="fa fa-file-text-o" aria-hidden="true"></span></button>'
      data_int = data_int + '<button type="button" style="background: gainsboro;    border: dotted;    color: black;    font-size: larger;    margin-top: 0px;    margin-bottom: 0px;"data-toggle="tooltip" data-placement="top" title="zip" onclick="empaquetado_reporte(' + Response["pestalla"] + ',' + Response["id"] + ')" class="btn btn-info"><span class="fa fa-file-zip-o" aria-hidden="true"></span></button>'
      data_int = data_int + 'Filtrar: <input type="text" id="fil_rep-' + Response["pestalla"] + '" onkeypress="return runScript_rep_filtro(event, ' + Response["pestalla"] + ')"> <label style="padding-left: 10px;"><input type="checkbox" id="det_rep-' + Response["pestalla"] + '" checked><span class="checkbox-material"><span class="check"></span></span>Exportar con Subniveles </label></div>'
      data_int = data_int + '<div st checked="True"yle="overflow: scroll;height: 600px;">'
      data_int = data_int + '<button type="button" class="btn btn-info" onclick="filtrar_reporte(' + Response["pestalla"] + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-check"></i></button>'



      data_int = data_int + html_rep(reppuesta_rep, Response["pestalla"], sumatorias) + '</div>'


      $('#rr' + Response["pestalla"]).html(data_int);



    }
  });

}



function solo_abrir_subrep(temp_pest, fila, nivel) {
  tr = document.getElementById('dr-' + temp_pest + '-' + fila + '-' + nivel)
  btn = document.getElementById('btn-' + temp_pest + '-' + fila + '-' + nivel)
  tr.hidden = false
  btn.innerHTML = '<span class="fa fa-minus" aria-hidden="true"></span>'
  btn.style.backgroundColor = "cornflowerblue"

}




function runScript_rep_filtro(e, pestana_int) {
  if (e.keyCode == 13) {
    filtrar_reporte(pestana_int)
  }
}

function cerrar_subrep(temp_pest, fila, nivel) {
  tr = document.getElementById('dr-' + temp_pest + '-' + fila + '-' + nivel)
  btn = document.getElementById('btn-' + temp_pest + '-' + fila + '-' + nivel)
  tr.hidden = true
  btn.innerHTML = '<span class="fa fa-plus" aria-hidden="true"></span>'
  btn.style.backgroundColor = "darkblue"
}


function abrir_subrep_arbol(temp_pest, nivel, fila) {
  tr = document.getElementById('dr-' + temp_pest + '-' + base["vinculacion"][nivel + '-' + fila] + '-' + (nivel - 1))

  //if(tr.hidden != false){
  btn = document.getElementById('btn-' + temp_pest + '-' + base["vinculacion"][nivel + '-' + fila] + '-' + (nivel - 1))
  tr.hidden = false
  btn.innerHTML = '<span class="fa fa-minus" aria-hidden="true"></span>'
  btn.style.backgroundColor = "cornflowerblue"

  if (nivel > 1) {
    abrir_subrep_arbol(temp_pest, (nivel - 1), base["vinculacion"][nivel + '-' + fila])
  }
  //}
}



function filtrar_reporte(pestana_int) {
  base = dict_pestalla['p-' + pestana_int]
  if (base["resutado"].length > 1) {
    v_filtro = document.getElementById('fil_rep-' + pestana_int).value
    if (v_filtro != '') {
      x = base["resutado"].length - 1
      for (x2 = 0; x2 < base["resutado"][x][1].length; x2++) {
        for (x3 = 0; x3 < base["resutado"][x][1][x2].length; x3++) {
          if (base["resutado"][x][1][x2][x3].toString().toLowerCase().includes(v_filtro.toString().toLowerCase()) == true) {
            tr = document.getElementById('dr-' + pestana_int + '-' + base["vinculacion"][x + '-' + x2] + '-' + (x - 1))
            //if(tr.hidden != false){
            abrir_subrep_arbol(pestana_int, x, x2)
            //}
          }
        }
      }
      t_tabla = document.getElementById('dataTables-' + pestana_int)
    }
    for (x2 = 0; x2 < t_tabla.children[1].childElementCount; x2++) {

      if (t_tabla.children[1].children[x2].innerText.toString().toLowerCase().includes(v_filtro.toString().toLowerCase()) == true) {
        t_tabla.children[1].children[x2].style.display = ''

      } else {
        t_tabla.children[1].children[x2].style.display = 'none'
      }
    }
  } else {
    v_filtro = document.getElementById('fil_rep-' + pestana_int).value
    t_tabla = document.getElementById('dataTables-' + pestana_int)

    for (x2 = 0; x2 < t_tabla.children[1].childElementCount; x2++) {

      if (t_tabla.children[1].children[x2].innerText.toString().toLowerCase().includes(v_filtro.toString().toLowerCase()) == true) {
        t_tabla.children[1].children[x2].style.display = ''

      } else {
        t_tabla.children[1].children[x2].style.display = 'none'
      }
    }
  }
}

function ConsultaContribuyente() {
  numeroruc = document.getElementById("val_ruc").value

  $.ajax({
    type: 'POST',
    url: 'http://datosec.com/app/datosfiscales/consultaDeDatos.php?wsdl',
    data: {
      func: 'consultaDeDatos',
      ruc: numeroruc
    },
    success: function (data) {
      if (data != null) {



      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      var xdata = '';
    },
  });
}


function cargarContenidoP12(evt) {
  var file = evt.target.files[0];
  reader = new FileReader();

  reader.addEventListener("loadend", function (event) {
    window.contenido_p12 = event.target.result;

  }, false);

  //reader.readAsDataURL(file);
  reader.readAsArrayBuffer(file);
}




function hacer_xml_factura(datos_elec, datos_cab, datos_det) {
  temp_claveAcceso = traer_clave(moment(), datos_elec[1][0], datos_cab[0][datos_elec[1][0]["secuencial"]], datos_cab[0][datos_elec[1][0]["estab"]], datos_cab[0][datos_elec[1][0]["ptoEmi"]])
  xml = '<factura id="comprobante" version="1.1.0">'
  xml = xml + '<infoTributaria>'
  xml = xml + '<ambiente>' + datos_elec[1][0]["ambiente"] + '</ambiente>'
  xml = xml + '<tipoEmision>' + datos_elec[1][0]["tipoEmision"] + '</tipoEmision>'
  xml = xml + '<razonSocial>' + datos_elec[1][0]["razonSocial"] + '</razonSocial>'
  xml = xml + '<nombreComercial>' + datos_elec[1][0]["nombreComercial"] + '</nombreComercial>'
  xml = xml + '<ruc>' + datos_elec[1][0]["ruc"] + '</ruc>'
  xml = xml + '<claveAcceso>' + temp_claveAcceso + '</claveAcceso>'
  xml = xml + '<codDoc>' + datos_elec[1][0]["codDoc"] + '</codDoc>'
  xml = xml + '<estab>' + datos_cab[0][datos_elec[1][0]["estab"]] + '</estab>'
  xml = xml + '<ptoEmi>' + datos_cab[0][datos_elec[1][0]["ptoEmi"]] + '</ptoEmi>'
  xml = xml + '<secuencial>' + pad(datos_cab[0][datos_elec[1][0]["secuencial"]], 9) + '</secuencial>'
  xml = xml + '<dirMatriz>' + datos_elec[1][0]["dirMatriz"] + '</dirMatriz>'
  xml = xml + '</infoTributaria>'

  xml = xml + '<infoFactura>'


  xml = xml + '<fechaEmision>' + moment().format('DD/MM/YYYY') + '</fechaEmision>'
  xml = xml + '<dirEstablecimiento>' + datos_elec[3][0]["dirEstablecimiento"] + '</dirEstablecimiento>'
  if (datos_elec[3][0]["contribuyenteEspecial"] != "No") {
    xml = xml + '<contribuyenteEspecial>' + datos_elec[3][0]["contribuyenteEspecial"] + '</contribuyenteEspecial>'
  }
  xml = xml + '<obligadoContabilidad>' + datos_elec[3][0]["obligadoContabilidad"] + '</obligadoContabilidad>'
  xml = xml + '<tipoIdentificacionComprador>' + datos_cab[0][datos_elec[3][0]["tipoIdentificacionComprador"]] + '</tipoIdentificacionComprador>'
  xml = xml + '<razonSocialComprador>' + datos_cab[0][datos_elec[3][0]["razonSocialComprador"]] + '</razonSocialComprador>'
  xml = xml + '<identificacionComprador>' + datos_cab[0][datos_elec[3][0]["identificacionComprador"]] + '</identificacionComprador>'
  xml = xml + '<totalSinImpuestos>' + datos_cab[0][datos_elec[3][0]["totalSinImpuestos"]] + '</totalSinImpuestos>'
  xml = xml + '<totalDescuento>' + datos_cab[0][datos_elec[3][0]["totalDescuento"]] + '</totalDescuento>'
  xml = xml + '<totalConImpuestos>'

  if (datos_elec[3][0]["codigo1"] != "9") {
    xml = xml + '<totalImpuesto>'
    xml = xml + '<codigo>' + datos_elec[3][0]["codigo1"] + '</codigo>'
    xml = xml + '<codigoPorcentaje>' + datos_elec[3][0]["codigoPorcentaje1"] + '</codigoPorcentaje>'
    xml = xml + '<descuentoAdicional>' + datos_cab[0][datos_elec[3][0]["descuento_adicional1"]] + '</descuentoAdicional>'
    xml = xml + '<baseImponible>' + datos_cab[0][datos_elec[3][0]["baseImponible1"]] + '</baseImponible>'
    xml = xml + '<valor>' + datos_cab[0][datos_elec[3][0]["valor1"]] + '</valor>'
    xml = xml + '</totalImpuesto>'
  }
  if (datos_elec[3][0]["codigo2"] != "9") {
    xml = xml + '<totalImpuesto>'
    xml = xml + '<codigo>' + datos_elec[3][0]["codigo2"] + '</codigo>'
    xml = xml + '<codigoPorcentaje>' + datos_elec[3][0]["codigoPorcentaje2"] + '</codigoPorcentaje>'
    xml = xml + '<descuentoAdicional>' + datos_cab[0][datos_elec[3][0]["descuento_adicional2"]] + '</descuentoAdicional>'
    xml = xml + '<baseImponible>' + datos_cab[0][datos_elec[3][0]["baseImponible2"]] + '</baseImponible>'
    xml = xml + '<valor>' + datos_cab[0][datos_elec[3][0]["valor2"]] + '</valor>'
    xml = xml + '</totalImpuesto>'
  }

  if (datos_elec[3][0]["codigo3"] != "9") {
    xml = xml + '<totalImpuesto>'
    xml = xml + '<codigo>' + datos_elec[3][0]["codigo3"] + '</codigo>'
    xml = xml + '<codigoPorcentaje>' + datos_elec[3][0]["codigoPorcentaje3"] + '</codigoPorcentaje>'
    xml = xml + '<descuentoAdicional>' + datos_cab[0][datos_elec[3][0]["descuento_adicional3"]] + '</descuentoAdicional>'
    xml = xml + '<baseImponible>' + datos_cab[0][datos_elec[3][0]["baseImponible3"]] + '</baseImponible>'
    xml = xml + '<valor>' + datos_cab[0][datos_elec[3][0]["valor3"]] + '</valor>'
    xml = xml + '</totalImpuesto>'
  }

  xml = xml + '</totalConImpuestos>'


  xml = xml + '<propina>' + datos_cab[0][datos_elec[3][0]["propina"]] + '</propina>'
  xml = xml + '<importeTotal>' + datos_cab[0][datos_elec[3][0]["importeTotal"]] + '</importeTotal>'
  xml = xml + '<moneda>' + datos_elec[3][0]["moneda"] + '</moneda>'

  xml = xml + '<pagos>'
  xml = xml + '<pago>'
  xml = xml + '<formaPago>' + datos_cab[0][datos_elec[3][0]["formaPago"]] + '</formaPago>'
  xml = xml + '<total>' + datos_cab[0][datos_elec[3][0]["total"]] + '</total>'
  xml = xml + '<plazo>' + datos_cab[0][datos_elec[3][0]["plazo"]] + '</plazo>'
  xml = xml + '<unidadTiempo>' + datos_cab[0][datos_elec[3][0]["unidadTiempo"]] + '</unidadTiempo>'
  xml = xml + '</pago>'
  xml = xml + '</pagos>'
  xml = xml + '</infoFactura>'

  xml = xml + '<detalles>'

  for (y = 0; y < datos_det.length; y++) {
    if (isNaN(datos_det[y][datos_elec[4][0]["cantidad"]]) == false) {
      if (datos_det[y][datos_elec[4][0]["cantidad"]] > 0) {

        xml = xml + '<detalle>'
        xml = xml + '<codigoPrincipal>' + datos_det[y][datos_elec[4][0]["codigoPrincipal"]] + '</codigoPrincipal>'
        xml = xml + '<codigoAuxiliar>' + datos_det[y][datos_elec[4][0]["codigoAuxiliar"]] + '</codigoAuxiliar>'
        xml = xml + '<descripcion>' + datos_det[y][datos_elec[4][0]["descripcion"]] + '</descripcion>'
        xml = xml + '<cantidad>' + datos_det[y][datos_elec[4][0]["cantidad"]] + '</cantidad>'
        xml = xml + '<precioUnitario>' + datos_det[y][datos_elec[4][0]["precioUnitario"]] + '</precioUnitario>'
        xml = xml + '<descuento>' + datos_det[y][datos_elec[4][0]["descuento"]] + '</descuento>'
        xml = xml + '<precioTotalSinImpuesto>' + datos_det[y][datos_elec[4][0]["precioTotalSinImpuesto"]] + '</precioTotalSinImpuesto>'
        xml = xml + '<impuestos>'
        xml = xml + '<impuesto>'
        xml = xml + '<codigo>' + datos_det[y][datos_elec[4][0]["codigo"]] + '</codigo>'
        xml = xml + '<codigoPorcentaje>' + datos_det[y][datos_elec[4][0]["codigoPorcentaje"]] + '</codigoPorcentaje>'
        xml = xml + '<tarifa>' + datos_det[y][datos_elec[4][0]["tarifa"]] + '</tarifa>'
        xml = xml + '<baseImponible>' + datos_det[y][datos_elec[4][0]["baseImponible"]] + '</baseImponible>'
        xml = xml + '<valor>' + datos_det[y][datos_elec[4][0]["valor"]] + '</valor>'
        xml = xml + '</impuesto>'
        xml = xml + '</impuestos>'
        xml = xml + '</detalle>'
      }
    }
  }
  xml = xml + '</detalles>'
  xml_adicional = '<infoAdicional>'

  if (datos_elec[2].length > 0) {
    for (y = 0; y < datos_elec[2].length; y++) {
      if (datos_cab[0][datos_elec[2][y]["valor"]] != '') {
        xml_adicional = xml_adicional + '<campoAdicional nombre="' + datos_elec[2][y]["nombre"] + '">' + datos_cab[0][datos_elec[2][y]["valor"]] + '</campoAdicional>'
      }

    }
  }


  if (xml_adicional != '<infoAdicional>') {
    xml = xml + xml_adicional + '</infoAdicional></factura>'
  } else {
    xml = xml + '</factura>'
  }
  return [temp_claveAcceso, xml]
}

function hacer_xml_retencion(datos_elec, datos_cab, datos_det) {
  temp_claveAcceso = traer_clave(moment(), datos_elec[1][0], datos_cab[0][datos_elec[1][0]["secuencial"]], datos_cab[0][datos_elec[1][0]["estab"]], datos_cab[0][datos_elec[1][0]["ptoEmi"]])
  xml = '<comprobanteRetencion id="comprobante" version="1.0.0">'
  xml = xml + '<infoTributaria>'
  xml = xml + '<ambiente>' + datos_elec[1][0]["ambiente"] + '</ambiente>'
  xml = xml + '<tipoEmision>' + datos_elec[1][0]["tipoEmision"] + '</tipoEmision>'
  xml = xml + '<razonSocial>' + datos_elec[1][0]["razonSocial"] + '</razonSocial>'
  xml = xml + '<nombreComercial>' + datos_elec[1][0]["nombreComercial"] + '</nombreComercial>'
  xml = xml + '<ruc>' + datos_elec[1][0]["ruc"] + '</ruc>'
  xml = xml + '<claveAcceso>' + temp_claveAcceso + '</claveAcceso>'
  xml = xml + '<codDoc>' + datos_elec[1][0]["codDoc"] + '</codDoc>'
  xml = xml + '<estab>' + datos_cab[0][datos_elec[1][0]["estab"]] + '</estab>'
  xml = xml + '<ptoEmi>' + datos_cab[0][datos_elec[1][0]["ptoEmi"]] + '</ptoEmi>'
  xml = xml + '<secuencial>' + pad(datos_cab[0][datos_elec[1][0]["secuencial"]], 9) + '</secuencial>'
  xml = xml + '<dirMatriz>' + datos_elec[1][0]["dirMatriz"] + '</dirMatriz>'
  xml = xml + '</infoTributaria>'

  xml = xml + '<infoCompRetencion>'


  xml = xml + '<fechaEmision>' + moment().format('DD/MM/YYYY') + '</fechaEmision>'
  xml = xml + '<dirEstablecimiento>' + datos_elec[4][0]["dirEstablecimiento"] + '</dirEstablecimiento>'
  if (datos_elec[4][0]["contribuyenteEspecial"] != "No") {
    xml = xml + '<contribuyenteEspecial>' + datos_elec[4][0]["contribuyenteEspecial"] + '</contribuyenteEspecial>'
  }
  xml = xml + '<obligadoContabilidad>' + datos_elec[4][0]["obligadoContabilidad"] + '</obligadoContabilidad>'
  xml = xml + '<tipoIdentificacionSujetoRetenido>' + datos_cab[0][datos_elec[4][0]["tipoIdentificacionSujetoRetenido"]] + '</tipoIdentificacionSujetoRetenido>'
  xml = xml + '<razonSocialSujetoRetenido>' + datos_cab[0][datos_elec[4][0]["razonSocialSujetoRetenido"]] + '</razonSocialSujetoRetenido>'
  xml = xml + '<identificacionSujetoRetenido>' + datos_cab[0][datos_elec[4][0]["identificacionSujetoRetenido"]] + '</identificacionSujetoRetenido>'


  var mydate = new Date(datos_cab[0][datos_elec[4][0]["periodoFiscal"]]);

  xml = xml + '<periodoFiscal>' + mydate.format('m/Y') + '</periodoFiscal>'



  xml = xml + '</infoCompRetencion>'

  xml = xml + '<impuestos>'

  codigos = {}
  codigos_iva = {}

  for (y = 0; y < datos_det.length; y++) {
    cod_t = datos_det[y][datos_elec[3][0]["det_codigoRetencion"]]
    if (null == codigos[cod_t]) {
      codigos[cod_t] = { 'codigoRetencion': cod_t, 'baseImponible': datos_det[y][datos_elec[3][0]["det_baseImponible"]], 'porcentajeRetener': datos_det[y][datos_elec[3][0]["det_porcentajeRetener"]], 'valorRetenido': datos_det[y][datos_elec[3][0]["det_valorRetenido"]] }
    } else {
      codigos[cod_t]['baseImponible'] = parseFloat(codigos[cod_t]['baseImponible']) + parseFloat(datos_det[y][datos_elec[3][0]["det_baseImponible"]])
      codigos[cod_t]['valorRetenido'] = parseFloat(codigos[cod_t]['valorRetenido']) + parseFloat(datos_det[y][datos_elec[3][0]["det_valorRetenido"]])
    }
  }
  for (y = 0; y < datos_det.length; y++) {
    cod_t = datos_det[y][datos_elec[3][0]["det_codigoRetencion2"]]
    if (null == codigos_iva[cod_t]) {
      codigos_iva[cod_t] = { 'codigoRetencion': cod_t, 'baseImponible': datos_det[y][datos_elec[3][0]["det_baseImponible2"]], 'porcentajeRetener': datos_det[y][datos_elec[3][0]["det_porcentajeRetener2"]], 'valorRetenido': datos_det[y][datos_elec[3][0]["det_valorRetenido2"]] }
    } else {
      codigos_iva[cod_t]['baseImponible'] = parseFloat(codigos_iva[cod_t]['baseImponible']) + parseFloat(datos_det[y][datos_elec[3][0]["det_baseImponible2"]])
      codigos_iva[cod_t]['valorRetenido'] = parseFloat(codigos_iva[cod_t]['valorRetenido']) + parseFloat(datos_det[y][datos_elec[3][0]["det_valorRetenido2"]])
    }
  }


  for (y = 0; y < Object.keys(codigos).length; y++) {
    xml = xml + '<impuesto>'
    xml = xml + '<codigo>1</codigo>'
    xml = xml + '<codigoRetencion>' + codigos[Object.keys(codigos)[y]]['codigoRetencion'] + '</codigoRetencion>'
    xml = xml + '<baseImponible>' + codigos[Object.keys(codigos)[y]]['baseImponible'] + '</baseImponible>'
    xml = xml + '<porcentajeRetener>' + codigos[Object.keys(codigos)[y]]['porcentajeRetener'] + '</porcentajeRetener>'
    xml = xml + '<valorRetenido>' + codigos[Object.keys(codigos)[y]]['valorRetenido'] + '</valorRetenido>'

    xml = xml + '<codDocSustento>' + datos_cab[0][datos_elec[3][0]["codDocSustento"]] + '</codDocSustento>'
    numDocSustento = datos_cab[0][datos_elec[3][0]["numDocSustento_est"]] + datos_cab[0][datos_elec[3][0]["numDocSustento_punto"]] + pad(datos_cab[0][datos_elec[3][0]["numDocSustento_punto"]], 9)
    xml = xml + '<numDocSustento>' + numDocSustento + '</numDocSustento>'
    var mydate = new Date(datos_cab[0][datos_elec[3][0]["fechaEmisionDocSustento"]]);

    xml = xml + '<fechaEmisionDocSustento>' + mydate.format('d/m/Y') + '</fechaEmisionDocSustento>'
    xml = xml + '</impuesto>'

  }

  for (y = 0; y < Object.keys(codigos_iva).length; y++) {
    xml = xml + '<impuesto>'
    xml = xml + '<codigo>2</codigo>'
    xml = xml + '<codigoRetencion>' + codigos_iva[Object.keys(codigos_iva)[y]]['codigoRetencion'] + '</codigoRetencion>'
    xml = xml + '<baseImponible>' + codigos_iva[Object.keys(codigos_iva)[y]]['baseImponible'] + '</baseImponible>'
    xml = xml + '<porcentajeRetener>' + codigos_iva[Object.keys(codigos_iva)[y]]['porcentajeRetener'] + '</porcentajeRetener>'
    xml = xml + '<valorRetenido>' + codigos_iva[Object.keys(codigos_iva)[y]]['valorRetenido'] + '</valorRetenido>'

    xml = xml + '<codDocSustento>' + datos_cab[0][datos_elec[3][0]["codDocSustento"]] + '</codDocSustento>'
    numDocSustento = datos_cab[0][datos_elec[3][0]["numDocSustento_est"]] + datos_cab[0][datos_elec[3][0]["numDocSustento_punto"]] + pad(datos_cab[0][datos_elec[3][0]["numDocSustento_punto"]], 9)
    xml = xml + '<numDocSustento>' + numDocSustento + '</numDocSustento>'
    var mydate = new Date(datos_cab[0][datos_elec[3][0]["fechaEmisionDocSustento"]]);

    xml = xml + '<fechaEmisionDocSustento>' + mydate.format('d/m/Y') + '</fechaEmisionDocSustento>'
    xml = xml + '</impuesto>'

  }



  xml = xml + '</impuestos>'


  xml_adicional = '<infoAdicional>'

  if (datos_elec[2].length > 0) {
    for (y = 0; y < datos_elec[2].length; y++) {
      if (datos_cab[0][datos_elec[2][y]["valor"]] != '') {
        xml_adicional = xml_adicional + '<campoAdicional nombre="' + datos_elec[2][y]["nombre"] + '">' + datos_cab[0][datos_elec[2][y]["valor"]] + '</campoAdicional>'
      }
    }
  }


  if (xml_adicional != '<infoAdicional>') {
    xml = xml + xml_adicional + '</infoAdicional></comprobanteRetencion>'
  } else {
    xml = xml + '</comprobanteRetencion>'
  }
  return [temp_claveAcceso, xml]
}

function hacer_xml_nota_credito(datos_elec, datos_cab, datos_det) {
  temp_claveAcceso = traer_clave(moment(), datos_elec[1][0], datos_cab[0][datos_elec[1][0]["secuencial"]], datos_cab[0][datos_elec[1][0]["estab"]], datos_cab[0][datos_elec[1][0]["ptoEmi"]])
  xml = '<notaCredito id="comprobante" version="1.0.0">'
  xml = xml + '<infoTributaria>'
  xml = xml + '<ambiente>' + datos_elec[1][0]["ambiente"] + '</ambiente>'
  xml = xml + '<tipoEmision>' + datos_elec[1][0]["tipoEmision"] + '</tipoEmision>'
  xml = xml + '<razonSocial>' + datos_elec[1][0]["razonSocial"] + '</razonSocial>'
  xml = xml + '<nombreComercial>' + datos_elec[1][0]["nombreComercial"] + '</nombreComercial>'
  xml = xml + '<ruc>' + datos_elec[1][0]["ruc"] + '</ruc>'
  xml = xml + '<claveAcceso>' + temp_claveAcceso + '</claveAcceso>'
  xml = xml + '<codDoc>' + datos_elec[1][0]["codDoc"] + '</codDoc>'
  xml = xml + '<estab>' + datos_cab[0][datos_elec[1][0]["estab"]] + '</estab>'
  xml = xml + '<ptoEmi>' + datos_cab[0][datos_elec[1][0]["ptoEmi"]] + '</ptoEmi>'
  xml = xml + '<secuencial>' + pad(datos_cab[0][datos_elec[1][0]["secuencial"]], 9) + '</secuencial>'
  xml = xml + '<dirMatriz>' + datos_elec[1][0]["dirMatriz"] + '</dirMatriz>'
  xml = xml + '</infoTributaria>'

  xml = xml + '<infoNotaCredito>'


  xml = xml + '<fechaEmision>' + moment().format('DD/MM/YYYY') + '</fechaEmision>'
  xml = xml + '<dirEstablecimiento>' + datos_elec[4][0]["dirEstablecimiento"] + '</dirEstablecimiento>'
  xml = xml + '<tipoIdentificacionComprador>' + datos_cab[0][datos_elec[4][0]["tipoIdentificacionComprador"]] + '</tipoIdentificacionComprador>'
  xml = xml + '<razonSocialComprador>' + datos_cab[0][datos_elec[4][0]["razonSocialComprador"]] + '</razonSocialComprador>'
  xml = xml + '<identificacionComprador>' + datos_cab[0][datos_elec[4][0]["identificacionComprador"]] + '</identificacionComprador>'


  xml = xml + '<obligadoContabilidad>' + datos_elec[4][0]["obligadoContabilidad"] + '</obligadoContabilidad>'


  xml = xml + '<codDocModificado>' + datos_cab[0][datos_elec[4][0]["codDocModificado"]] + '</codDocModificado>'



  xml = xml + '<numDocModificado>' + datos_cab[0][datos_elec[4][0]["numDocModificado_est"]] + "-" + datos_cab[0][datos_elec[4][0]["numDocModificado_punto"]] + "-" + pad(datos_cab[0][datos_elec[4][0]["numDocModificado_sec"]], 9) + '</numDocModificado>'

  var mydate = new Date(datos_cab[0][datos_elec[4][0]["fechaEmisionDocSustento"]]);

  xml = xml + '<fechaEmisionDocSustento>' + mydate.format('d/m/Y') + '</fechaEmisionDocSustento>'
  xml = xml + '<totalSinImpuestos>' + datos_cab[0][datos_elec[4][0]["totalSinImpuestos"]] + '</totalSinImpuestos>'
  xml = xml + '<valorModificacion>' + datos_cab[0][datos_elec[4][0]["valorModificacion"]] + '</valorModificacion>'
  xml = xml + '<moneda>' + datos_elec[4][0]["moneda"] + '</moneda>'



  xml = xml + '<totalConImpuestos>'

  if (parseFloat(datos_cab[0][datos_elec[4][0]["baseImponible1"]]) > 0) {
    xml = xml + '<totalImpuesto>'
    xml = xml + '<codigo>' + datos_elec[4][0]["codigo1"] + '</codigo>'
    xml = xml + '<codigoPorcentaje>' + datos_elec[4][0]["codigoPorcentaje1"] + '</codigoPorcentaje>'
    xml = xml + '<baseImponible>' + datos_cab[0][datos_elec[4][0]["baseImponible1"]] + '</baseImponible>'
    xml = xml + '<valor>' + datos_cab[0][datos_elec[4][0]["valor1"]] + '</valor>'
    xml = xml + '</totalImpuesto>'
  }
  if (parseFloat(datos_cab[0][datos_elec[4][0]["baseImponible2"]]) > 0) {
    xml = xml + '<totalImpuesto>'
    xml = xml + '<codigo>' + datos_elec[4][0]["codigo2"] + '</codigo>'
    xml = xml + '<codigoPorcentaje>' + datos_elec[4][0]["codigoPorcentaje2"] + '</codigoPorcentaje>'
    xml = xml + '<baseImponible>' + datos_cab[0][datos_elec[4][0]["baseImponible2"]] + '</baseImponible>'
    xml = xml + '<valor>' + datos_cab[0][datos_elec[4][0]["valor2"]] + '</valor>'
    xml = xml + '</totalImpuesto>'
  }
  if (parseFloat(datos_cab[0][datos_elec[4][0]["baseImponible3"]]) > 0) {
    xml = xml + '<totalImpuesto>'
    xml = xml + '<codigo>' + datos_elec[4][0]["codigo3"] + '</codigo>'
    xml = xml + '<codigoPorcentaje>' + datos_elec[4][0]["codigoPorcentaje3"] + '</codigoPorcentaje>'
    xml = xml + '<baseImponible>' + datos_cab[0][datos_elec[4][0]["baseImponible3"]] + '</baseImponible>'
    xml = xml + '<valor>' + datos_cab[0][datos_elec[4][0]["valor3"]] + '</valor>'
    xml = xml + '</totalImpuesto>'
  }

  xml = xml + '</totalConImpuestos>'


  xml = xml + '<motivo>' + datos_elec[4][0]["motivo"] + '</motivo>'

  xml = xml + '</infoNotaCredito>'

  xml = xml + '<detalles>'

  for (y = 0; y < datos_det.length; y++) {
    if (isNaN(datos_det[y][datos_elec[3][0]["cantidad"]]) == false) {
      if (datos_det[y][datos_elec[3][0]["cantidad"]] > 0) {

        xml = xml + '<detalle>'
        xml = xml + '<codigoInterno>' + datos_det[y][datos_elec[3][0]["codigoInterno"]] + '</codigoInterno>'
        xml = xml + '<codigoAdicional>' + datos_det[y][datos_elec[3][0]["codigoAdicional"]] + '</codigoAdicional>'
        xml = xml + '<descripcion>' + datos_det[y][datos_elec[3][0]["descripcion"]] + '</descripcion>'
        xml = xml + '<cantidad>' + datos_det[y][datos_elec[3][0]["cantidad"]] + '</cantidad>'
        xml = xml + '<precioUnitario>' + datos_det[y][datos_elec[3][0]["precioUnitario"]] + '</precioUnitario>'
        xml = xml + '<descuento>' + datos_det[y][datos_elec[3][0]["descuento"]] + '</descuento>'
        xml = xml + '<precioTotalSinImpuesto>' + datos_det[y][datos_elec[3][0]["precioTotalSinImpuesto"]] + '</precioTotalSinImpuesto>'
        xml = xml + '<impuestos>'
        xml = xml + '<impuesto>'
        xml = xml + '<codigo>' + datos_det[y][datos_elec[3][0]["codigo"]] + '</codigo>'
        xml = xml + '<codigoPorcentaje>' + datos_det[y][datos_elec[3][0]["codigoPorcentaje"]] + '</codigoPorcentaje>'
        xml = xml + '<tarifa>' + datos_det[y][datos_elec[3][0]["tarifa"]] + '</tarifa>'
        xml = xml + '<baseImponible>' + datos_det[y][datos_elec[3][0]["baseImponible"]] + '</baseImponible>'
        xml = xml + '<valor>' + datos_det[y][datos_elec[3][0]["valor"]] + '</valor>'
        xml = xml + '</impuesto>'
        xml = xml + '</impuestos>'
        xml = xml + '</detalle>'
      }
    }
  }
  xml = xml + '</detalles>'
  xml_adicional = '<infoAdicional>'

  if (datos_elec[2].length > 0) {
    for (y = 0; y < datos_elec[2].length; y++) {
      if (datos_cab[0][datos_elec[2][y]["valor"]] != '') {
        xml_adicional = xml_adicional + '<campoAdicional nombre="' + datos_elec[2][y]["nombre"] + '">' + datos_cab[0][datos_elec[2][y]["valor"]] + '</campoAdicional>'
      }
    }
  }


  if (xml_adicional != '<infoAdicional>') {
    xml = xml + xml_adicional + '</infoAdicional></notaCredito>'
  } else {
    xml = xml + '</notaCredito>'
  }
  return [temp_claveAcceso, xml]
}

function hacer_xml_nota_debito(datos_elec, datos_cab, datos_det) {
  temp_claveAcceso = traer_clave(moment(), datos_elec[1][0], datos_cab[0][datos_elec[1][0]["secuencial"]], datos_cab[0][datos_elec[1][0]["estab"]], datos_cab[0][datos_elec[1][0]["ptoEmi"]])
  xml = '<notaDebito id="comprobante" version="1.0.0">'
  xml = xml + '<infoTributaria>'
  xml = xml + '<ambiente>' + datos_elec[1][0]["ambiente"] + '</ambiente>'
  xml = xml + '<tipoEmision>' + datos_elec[1][0]["tipoEmision"] + '</tipoEmision>'
  xml = xml + '<razonSocial>' + datos_elec[1][0]["razonSocial"] + '</razonSocial>'
  xml = xml + '<nombreComercial>' + datos_elec[1][0]["nombreComercial"] + '</nombreComercial>'
  xml = xml + '<ruc>' + datos_elec[1][0]["ruc"] + '</ruc>'
  xml = xml + '<claveAcceso>' + temp_claveAcceso + '</claveAcceso>'
  xml = xml + '<codDoc>' + datos_elec[1][0]["codDoc"] + '</codDoc>'
  xml = xml + '<estab>' + datos_cab[0][datos_elec[1][0]["estab"]] + '</estab>'
  xml = xml + '<ptoEmi>' + datos_cab[0][datos_elec[1][0]["ptoEmi"]] + '</ptoEmi>'
  xml = xml + '<secuencial>' + pad(datos_cab[0][datos_elec[1][0]["secuencial"]], 9) + '</secuencial>'
  xml = xml + '<dirMatriz>' + datos_elec[1][0]["dirMatriz"] + '</dirMatriz>'
  xml = xml + '</infoTributaria>'

  xml = xml + '<infoNotaDebito>'


  xml = xml + '<fechaEmision>' + moment().format('DD/MM/YYYY') + '</fechaEmision>'
  xml = xml + '<dirEstablecimiento>' + datos_elec[3][0]["dirEstablecimiento"] + '</dirEstablecimiento>'


  xml = xml + '<tipoIdentificacionComprador>' + datos_cab[0][datos_elec[3][0]["tipoIdentificacionComprador"]] + '</tipoIdentificacionComprador>'
  xml = xml + '<razonSocialComprador>' + datos_cab[0][datos_elec[3][0]["razonSocialComprador"]] + '</razonSocialComprador>'
  xml = xml + '<identificacionComprador>' + datos_cab[0][datos_elec[3][0]["identificacionComprador"]] + '</identificacionComprador>'
  xml = xml + '<obligadoContabilidad>' + datos_elec[3][0]["obligadoContabilidad"] + '</obligadoContabilidad>'
  xml = xml + '<codDocModificado>' + datos_cab[0][datos_elec[3][0]["codDocModificado"]] + '</codDocModificado>'

  xml = xml + '<numDocModificado>' + datos_cab[0][datos_elec[3][0]["numDocModificado_est"]] + "-" + datos_cab[0][datos_elec[3][0]["numDocModificado_punt"]] + "-" + pad(datos_cab[0][datos_elec[3][0]["numDocModificado_sec"]], 9) + '</numDocModificado>'

  var mydate = new Date(datos_cab[0][datos_elec[3][0]["fechaEmisionDocSustento"]]);

  xml = xml + '<fechaEmisionDocSustento>' + mydate.format('d/m/Y') + '</fechaEmisionDocSustento>'

  xml = xml + '<totalSinImpuestos>' + datos_cab[0][datos_elec[3][0]["totalSinImpuestos"]] + '</totalSinImpuestos>'

  xml = xml + '<impuestos>'

  if (parseFloat(datos_cab[0][datos_elec[3][0]["baseImponible1"]]) > 0) {
    xml = xml + '<impuesto>'
    xml = xml + '<codigo>' + datos_elec[3][0]["codigo1"] + '</codigo>'
    xml = xml + '<codigoPorcentaje>' + datos_elec[3][0]["codigoPorcentaje1"] + '</codigoPorcentaje>'
    xml = xml + '<tarifa>' + datos_elec[3][0]["tarifa1"] + '</tarifa>'
    xml = xml + '<baseImponible>' + datos_cab[0][datos_elec[3][0]["baseImponible1"]] + '</baseImponible>'

    xml = xml + '<valor>' + datos_cab[0][datos_elec[3][0]["valor1"]] + '</valor>'
    xml = xml + '</impuesto>'
  }
  if (parseFloat(datos_cab[0][datos_elec[3][0]["baseImponible2"]]) > 0) {
    xml = xml + '<impuesto>'
    xml = xml + '<codigo>' + datos_elec[3][0]["codigo2"] + '</codigo>'
    xml = xml + '<codigoPorcentaje>' + datos_elec[3][0]["codigoPorcentaje2"] + '</codigoPorcentaje>'
    xml = xml + '<tarifa>' + datos_elec[3][0]["tarifa2"] + '</tarifa>'
    xml = xml + '<baseImponible>' + datos_cab[0][datos_elec[3][0]["baseImponible2"]] + '</baseImponible>'
    xml = xml + '<valor>' + datos_cab[0][datos_elec[3][0]["valor2"]] + '</valor>'
    xml = xml + '</impuesto>'
  }


  xml = xml + '</impuestos>'


  xml = xml + '<valorTotal>' + datos_cab[0][datos_elec[3][0]["valorTotal"]] + '</valorTotal>'

  xml = xml + '<pagos>'
  xml = xml + '<pago>'
  xml = xml + '<formaPago>' + datos_cab[0][datos_elec[3][0]["formaPago"]] + '</formaPago>'
  xml = xml + '<total>' + datos_cab[0][datos_elec[3][0]["total"]] + '</total>'
  xml = xml + '<plazo>' + datos_cab[0][datos_elec[3][0]["plazo"]] + '</plazo>'
  xml = xml + '<unidadTiempo>' + datos_cab[0][datos_elec[3][0]["unidadTiempo"]] + '</unidadTiempo>'
  xml = xml + '</pago>'
  xml = xml + '</pagos>'
  xml = xml + '</infoNotaDebito>'

  xml = xml + '<motivos>'

  for (y = 0; y < datos_det.length; y++) {
    if (isNaN(datos_det[y][datos_elec[4][0]["valor"]]) == false) {
      if (datos_det[y][datos_elec[4][0]["valor"]] > 0) {
        xml = xml + '<motivo>'
        xml = xml + '<razon>' + datos_det[y][datos_elec[4][0]["razon"]] + '</razon>'
        xml = xml + '<valor>' + datos_det[y][datos_elec[4][0]["valor"]] + '</valor>'
        xml = xml + '</motivo>'
      }
    }
  }
  xml = xml + '</motivos>'
  xml_adicional = '<infoAdicional>'

  if (datos_elec[2].length > 0) {
    for (y = 0; y < datos_elec[2].length; y++) {
      if (datos_cab[0][datos_elec[2][y]["valor"]] != '') {
        xml_adicional = xml_adicional + '<campoAdicional nombre="' + datos_elec[2][y]["nombre"] + '">' + datos_cab[0][datos_elec[2][y]["valor"]] + '</campoAdicional>'
      }

    }
  }


  if (xml_adicional != '<infoAdicional>') {
    xml = xml + xml_adicional + '</infoAdicional></notaDebito>'
  } else {
    xml = xml + '</notaDebito>'
  }
  return [temp_claveAcceso, xml]
}

function hacer_xml_guiaremision(datos_elec, datos_cab, datos_det) {
  temp_claveAcceso = traer_clave(datos_cab[0][datos_elec[1][0]["fecha"]], datos_elec[1][0], datos_cab[0][datos_elec[1][0]["secuencial"]], datos_cab[0][datos_elec[1][0]["estab"]], datos_cab[0][datos_elec[1][0]["ptoEmi"]])
  xml = '<guiaRemision id="comprobante" version="1.0.0">'
  xml = xml + '<infoTributaria>'
  xml = xml + '<ambiente>' + datos_elec[1][0]["ambiente"] + '</ambiente>'
  xml = xml + '<tipoEmision>' + datos_elec[1][0]["tipoEmision"] + '</tipoEmision>'
  xml = xml + '<razonSocial>' + datos_elec[1][0]["razonSocial"] + '</razonSocial>'
  xml = xml + '<nombreComercial>' + datos_elec[1][0]["nombreComercial"] + '</nombreComercial>'
  xml = xml + '<ruc>' + datos_elec[1][0]["ruc"] + '</ruc>'
  xml = xml + '<claveAcceso>' + temp_claveAcceso + '</claveAcceso>'
  xml = xml + '<codDoc>' + datos_elec[1][0]["codDoc"] + '</codDoc>'
  xml = xml + '<estab>' + datos_cab[0][datos_elec[1][0]["estab"]] + '</estab>'
  xml = xml + '<ptoEmi>' + datos_cab[0][datos_elec[1][0]["ptoEmi"]] + '</ptoEmi>'
  xml = xml + '<secuencial>' + pad(datos_cab[0][datos_elec[1][0]["secuencial"]], 9) + '</secuencial>'
  xml = xml + '<dirMatriz>' + datos_elec[1][0]["dirMatriz"] + '</dirMatriz>'
  xml = xml + '</infoTributaria>'

  xml = xml + '<infoGuiaRemision>'


  xml = xml + '<dirEstablecimiento>' + datos_elec[4][0]["dirEstablecimiento"] + '</dirEstablecimiento>'

  xml = xml + '<dirPartida>' + datos_elec[4][0]["dirPartida"] + '</dirPartida>'
  xml = xml + '<razonSocialTransportista>' + datos_cab[0][datos_elec[4][0]["razonSocialTransportista"]] + '</razonSocialTransportista>'
  xml = xml + '<tipoIdentificacionTransportista>' + datos_cab[0][datos_elec[4][0]["tipoIdentificacionTransportista"]] + '</tipoIdentificacionTransportista>'
  xml = xml + '<rucTransportista>' + datos_cab[0][datos_elec[4][0]["rucTransportista"]] + '</rucTransportista>'
  xml = xml + '<obligadoContabilidad>' + datos_elec[4][0]["obligadoContabilidad"] + '</obligadoContabilidad>'

  var mydate = new Date(datos_cab[0][datos_elec[4][0]["fechaIniTransporte"]]);

  xml = xml + '<fechaIniTransporte>' + mydate.format('d/m/Y') + '</fechaIniTransporte>'


  var mydate = new Date(datos_cab[0][datos_elec[4][0]["fechaFinTransporte"]]);

  xml = xml + '<fechaFinTransporte>' + mydate.format('d/m/Y') + '</fechaFinTransporte>'

  xml = xml + '<placa>' + datos_cab[0][datos_elec[4][0]["placa"]] + '</placa>'

  xml = xml + '</infoGuiaRemision>'

  xml = xml + '<destinatarios>'
  xml = xml + '<destinatario>'
  xml = xml + '<identificacionDestinatario>' + datos_cab[0][datos_elec[3][0]["identificacionDestinatario"]] + '</identificacionDestinatario>'
  xml = xml + '<razonSocialDestinatario>' + datos_cab[0][datos_elec[3][0]["razonSocialDestinatario"]] + '</razonSocialDestinatario>'
  xml = xml + '<dirDestinatario>' + datos_cab[0][datos_elec[3][0]["dirDestinatario"]] + '</dirDestinatario>'
  xml = xml + '<motivoTraslado>' + datos_cab[0][datos_elec[3][0]["motivoTraslado"]] + '</motivoTraslado>'
  if (datos_elec[3][0]["docAduaneroUnico"] != 'No') {
    xml = xml + '<docAduaneroUnico>' + datos_cab[0][datos_elec[3][0]["docAduaneroUnico"]] + '</docAduaneroUnico>'
  }
  if (datos_elec[3][0]["codEstabDestino"] != 'No') {
    xml = xml + '<codEstabDestino>' + datos_cab[0][datos_elec[3][0]["codEstabDestino"]] + '</codEstabDestino>'
  }
  if (datos_elec[3][0]["ruta"] != 'No') {
    xml = xml + '<ruta>' + datos_cab[0][datos_elec[3][0]["ruta"]] + '</ruta>'
  }
  xml = xml + '<codDocSustento>' + datos_cab[0][datos_elec[3][0]["codDocSustento"]] + '</codDocSustento>'

  xml = xml + '<numDocSustento>' + datos_cab[0][datos_elec[3][0]["numDocSustento_est"]] + "-" + datos_cab[0][datos_elec[3][0]["numDocSustento_punto"]] + "-" + pad(datos_cab[0][datos_elec[3][0]["numDocSustento_sec"]], 9) + '</numDocSustento>'


  xml = xml + '<numAutDocSustento>' + datos_cab[0][datos_elec[3][0]["numAutDocSustento"]] + '</numAutDocSustento>'
  var mydate = new Date(datos_cab[0][datos_elec[3][0]["fechaEmisionDocSustento"]]);

  xml = xml + '<fechaEmisionDocSustento>' + mydate.format('d/m/Y') + '</fechaEmisionDocSustento>'




  xml = xml + '<detalles>'

  for (y = 0; y < datos_det.length; y++) {
    if (isNaN(datos_det[y][datos_elec[3][0]["cantidad"]]) == false) {
      if (datos_det[y][datos_elec[3][0]["cantidad"]] > 0) {

        xml = xml + '<detalle>'
        xml = xml + '<codigoInterno>' + datos_det[y][datos_elec[3][0]["codigoInterno"]] + '</codigoInterno>'
        xml = xml + '<codigoAdicional>' + datos_det[y][datos_elec[3][0]["codigoAdicional"]] + '</codigoAdicional>'
        xml = xml + '<descripcion>' + datos_det[y][datos_elec[3][0]["descripcion"]] + '</descripcion>'
        xml = xml + '<cantidad>' + datos_det[y][datos_elec[3][0]["cantidad"]] + '</cantidad>'

        xml = xml + '</detalle>'
      }
    }
  }
  xml = xml + '</detalles>'

  xml = xml + '</destinatario>'
  xml = xml + '</destinatarios>'


  xml_adicional = '<infoAdicional>'

  if (datos_elec[2].length > 0) {
    for (y = 0; y < datos_elec[2].length; y++) {
      if (datos_cab[0][datos_elec[2][y]["valor"]] != '') {
        xml_adicional = xml_adicional + '<campoAdicional nombre="' + datos_elec[2][y]["nombre"] + '">' + datos_cab[0][datos_elec[2][y]["valor"]] + '</campoAdicional>'
      }

    }
  }


  if (xml_adicional != '<infoAdicional>') {
    xml = xml + xml_adicional + '</infoAdicional></guiaRemision>'
  } else {
    xml = xml + '</guiaRemision>'
  }
  return [temp_claveAcceso, xml]
}


function sha1_base64(txt, codificacion = '') {
  var md = forge.md.sha1.create();
  md.update(txt, codificacion);
  //console.log('Buffer in: ', Buffer);
  //return new Buffer(md.digest().toHex(), 'hex').toString('base64');
  return new window.buffer.Buffer(md.digest().toHex(), 'hex').toString('base64');
}

function hexToBase64(str) {
  var hex = ('00' + str).slice(0 - str.length - str.length % 2);

  return btoa(String.fromCharCode.apply(null,
    hex.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
  );
}

function bigint2base64(bigint) {
  var base64 = '';
  base64 = btoa(bigint.toString(16).match(/\w{2}/g).map(function (a) { return String.fromCharCode(parseInt(a, 16)); }).join(""));

  base64 = base64.match(/.{1,76}/g).join("\n");

  return base64;
}

function p_obtener_aleatorio() {
  return Math.floor(Math.random() * 999000) + 990;
}

function traer_clave(fecha, datos_tribu, secuancial, estab, ptoEmi) {
  var mydate = new Date(fecha);

  clave = mydate.format('d') + mydate.format('m') + mydate.format('Y')
  clave = clave + datos_tribu["codDoc"]
  clave = clave + datos_tribu["ruc"]
  clave = clave + datos_tribu["ambiente"]
  clave = clave + estab
  clave = clave + ptoEmi
  clave = clave + pad(secuancial, 9)
  clave = clave + "00000000"
  clave = clave + "1"
  clave = clave + p_calcular_digito_modulo11(clave)
  return clave
}


function p_obtener_codigo_autorizacion(fechaEmision, tipoComprobante, ruc, ambiente, estab, ptoEmi, secuencial, codigo, tipoEmision) {
  fechaEmision = fechaEmision || new Date();
  tipoComprobante = tipoComprobante || 'factura'; //1 factura, 4 nota de crédito, 5 nota de débito, 6 guía de remisión, 7 retención
  ruc = ruc || '9999999999999';
  ambiente = ambiente || 1; // 1 pruebas, 2 produccion

  //serie = serie || 0;
  estab = estab || 1;
  ptoEmi = ptoEmi || 1;


  secuencial = secuencial || p_obtener_secuencial(tipoComprobante);
  codigo = codigo || (moment(fechaEmision).format('DDMM') + pad(secuencial, 4).slice(-3) + p_calcular_digito_modulo11(moment(fechaEmision).format('DDMM') + pad(secuencial, 3).slice(-3)));
  tipoEmision = tipoEmision || 1; //1 emision normal

  var codigo_autorizacion = moment(fechaEmision).format('DDMMYYYY')
    + pad(codDoc[tipoComprobante], 2)
    + pad(ruc, 13)
    + pad(ambiente, 1)
    + pad(estab, 3) + pad(ptoEmi, 3)
    + pad(secuencial, 9)
    + pad(codigo, 8)
    + pad(tipoEmision, 1);

  var digito_calculado = p_calcular_digito_modulo11(codigo_autorizacion);

  if (digito_calculado > -1) {
    return codigo_autorizacion + digito_calculado;
  }
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function p_calcular_digito_modulo11(numero) {
  var digito_calculado = -1;

  if (typeof (numero) == 'string' && /^\d+$/.test(numero)) {

    var digitos = numero.split('').map(Number); //arreglo con los dígitos del número

    digito_calculado = 11 - digitos.reduce(function (valorPrevio, valorActual, indice) {
      return valorPrevio + (valorActual * (7 - indice % 6));
    }, 0) % 11;

    digito_calculado = (digito_calculado == 11) ? 0 : digito_calculado; //según ficha técnica
    digito_calculado = (digito_calculado == 10) ? 1 : digito_calculado; //según ficha técnica
  }
  return digito_calculado;
}

function cerrar_elemento(id_tab) {
  $('#' + 'li' + id_tab).remove();
  $('#' + 'rr' + id_tab).remove();
  delete this.dict_pestalla['p-' + id_tab]
  PonerRecienteTab()

}

function PonerRecienteTab() {
  paso = false
  for (cc02 = pestalla; cc02 > 0; cc02--) {
    var tabsito = document.getElementById('id' + cc02)
    if(tabsito != undefined){
      tabsito.click()
      paso = true
      break
    }
  }
  if(paso == false){
    var tabsito = document.getElementById('calendar-tab')
    tabsito.click()
  }

}


function cerrar_panel(id_tab) {
  $('#' + 'id' + id_tab).remove();
  $('#' + 'rr' + id_tab).remove();
}


var dict_pestalla = {}
var cc_porPesta = {}
var ccsub_porPesta = {}


var modulos = {}
var procesos = {}
var procesospk = {}





function nota_doc_grabar() {

  var not_pknota = document.getElementById("vpk_nota").value
  var not_modulo = document.getElementById("nota_doc_proceso_cbx").value
  var not_pkmodulo = procesospk[not_modulo]
  var not_pk = document.getElementById("nota_doc_proceso_pk").value
  var not_descripcion = document.getElementById("nota_doc_proceso_campoiden").value
  var not_identificador = document.getElementById("nota_doc_proceso_valoriden").value


  $.ajax({
    type: 'POST',
    url: '/nota_guardar_doc',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'pknota': not_pknota, 'modulo': not_modulo, 'pkmodulo': not_pkmodulo, 'pk': not_pk, 'descripcion': not_descripcion, 'identificador': not_identificador },
    success: function (Response) {


      var iDiv = document.createElement('button');
      iDiv.className = "btn bg-green btn-flat margin"
      iDiv.setAttribute("data-dismiss", "modal")
      iDiv.setAttribute("onclick", "abrir_doc( " + Response["pkmodulo"] + ",  " + Response["pk"] + ")")
      iDiv.innerHTML = Response["modulo"] + ', ' + Response["descripcion"] + ':' + Response["identificador"]

      //iDiv.innerHTML = '<button class="btn bg-green btn-flat margin"  data-dismiss="modal" onclick="abrir_doc( '+ Response["pkmodulo"] +',  '+ Response["pk"] +')">'+  Response["modulo"] +', '+ Response["descripcion"] +':'+ Response["identificador"] +'</button>'
      var divcemaforo = document.getElementById('div_nota_doc');
      divcemaforo.appendChild(iDiv);
      //$('#divbusca_nota_doc').html('');

      alert("Archivo adjuntado")
    }
  });
}


function selecctt_buscador_nota(x) {
  var ss = document.getElementById("nota_doc_proceso_campoiden")

  document.getElementById("nota_doc_proceso_valoriden").value = document.getElementById("dataTables-example").rows[x.rowIndex].cells[ss.selectedIndex + 1].innerHTML.trim();
  document.getElementById("nota_doc_proceso_pk").value = document.getElementById("dataTables-example").rows[x.rowIndex].cells[0].innerHTML.trim();


}

function filtrar_buscar_nota() {

  sentencia2 = "select * from (" + document.getElementById("buscador_senten").value + ") int_ress where " + document.getElementById("busca_campo_nota").value + " like '" + document.getElementById("busca_valor_nota").value + "%'"


  $.ajax({
    type: 'POST',
    url: '/buscador',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'cmpsenten': sentencia2, 'usuario': web_usuario, 'A_Select': '', 'PkCampo': PkCampo, },
    success: function (Response) {
      orden = Response["A_Select"].split(",")
      data_int = '<div class="panel-body" style="overflow: scroll;"><table style="cursor: pointer;font-size: 11px;background: white;" width="100%" class="table table-striped table-bordered table-hover" id="dataTables-example"><thead><tr>'

      for (x = 0; x < orden.length; x++) {
        data_int = data_int + '<th>' + orden[x] + '</th>'
      }
      data_int = data_int + '</tr></thead><tbody>'
      for (x = 0; x < Response['cmpvalor'].length; x++) {
        data_int = data_int + '<tr class="odd gradeX" onclick="selecctt_buscador_nota(this)">'
        for (x2 = 0; x2 < orden.length; x2++) {
          data_int = data_int + '<td>' + Response['cmpvalor'][x][orden[x2]] + '</td>'
        }
        data_int = data_int + '</tr>'
      }
      data_int = data_int + '</tbody></table></div>'
      $('#buscador_int_nota').html(data_int);
    }
  });
}

function limpiarnota_doc_buscar() {
  document.getElementById('nota_doc_proceso_valoriden').value = ""
  document.getElementById('nota_doc_proceso_pk').value = ""

}

function nota_doc_buscar() {

  var sel_proc = document.getElementById('nota_doc_proceso_cbx');
  var cmtsenten = 'select * from ' + procesos[sel_proc.value] + ' order by Pk' + procesos[sel_proc.value] + ' desc'

  $.ajax({
    type: 'POST',
    url: '/buscador_nota_doc',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'cmpsenten': cmtsenten, 'usuario': web_usuario, 'tabla': procesos[sel_proc.value] },
    success: function (Response) {
      buscador_resultado = Response['cmpvalor']


      var sel_proc = document.getElementById('nota_doc_proceso_campoiden');
      $("#nota_doc_proceso_campoiden").empty();

      data_int = '<div class="row"><div class="col-lg-12" ><select class="form-control" id="busca_campo_nota">'
      for (x = 0; x < Response['campos'].length; x++) {
        data_int = data_int + '<option>' + Response['campos'][x]['Nombre'] + '</option>'
        var opt = document.createElement('option');
        opt.appendChild(document.createTextNode(Response['campos'][x]['Nombre']));
        opt.value = Response['campos'][x]['Nombre'];
        sel_proc.appendChild(opt);
      }



      document.getElementById("buscador_senten").value = 'select ' + Response['sente_campos'] + ' from ' + Response['tabla'] + ' order by Pk' + Response['tabla'] + ' desc'

      data_int = data_int + '</select><input class="form-control" id="busca_valor_nota" placeholder="Escriba para filtrar"><button class="btn bg-blue btn-flat margin" onclick="filtrar_buscar_nota()"><span aria-hidden="true">Filtrar</button></div></div>'

      //data_int = data_int + '<div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">cerrar</button><button type="button" class="btn bg-blue btn-flat margin" data-dismiss="modal" onclick="poner_valor_buscar_nota_doc()">Traer</button></div>'
      data_int = data_int + '<div id="buscador_int_nota" style="overflow: scroll;">'
      data_int = data_int + '<div class="panel-body"><table style="cursor: pointer;font-size: 11px;" width="100%" class="table table-striped table-bordered table-hover" id="dataTables-example" style="background: white;"><thead><tr>'

      data_int = data_int + '<th>PK' + Response['tabla'] + '</th>'


      for (x = 0; x < Response['campos'].length; x++) {
        data_int = data_int + '<th>' + Response['campos'][x]['Nombre'] + '</th>'

      }
      data_int = data_int + '</tr></thead><tbody>'


      for (x = 0; x < Response['valores'].length; x++) {
        data_int = data_int + '<tr class="odd gradeX" onclick="selecctt_buscador_nota(this)">'
        data_int = data_int + '<td>' + Response['valores'][x]['Pk' + Response['tabla']] + '</td>'

        for (x2 = 0; x2 < Response['campos'].length; x2++) {
          data_int = data_int + '<td>' + Response['valores'][x][Response['campos'][x2]['Nombre']] + '</td>'
        }
        data_int = data_int + '</tr>'

      }

      data_int = data_int + '</tbody></table></div>'

      data_int = data_int + '</div>'

      $('#divbusca_nota_doc').html(data_int);


    }
  });


}

function abrirdetalle(id_tab, linea) {

  tr = document.getElementById('regdet-' + id_tab + '-' + linea)
  btn = document.getElementById('regbtn_' + id_tab + '_' + linea)
  if (tr.hidden == false) {
    tr.hidden = true
    //btn.innerHTML = '<span class="fa fa-plus" aria-hidden="true"></span>'
    btn.innerHTML = '<span class="glyphicon glyphicon-resize-full"></span>'

    btn.style.backgroundColor = "darkblue"

  } else {
    tr.hidden = false
    //btn.innerHTML = '<span class="fa fa-minus" aria-hidden="true"></span>'
    btn.innerHTML = '<span class="glyphicon glyphicon-resize-small"></span>'

  }

}


function ampliar(id_tab, este) {
  div_tabla = document.getElementById('divtabla' + id_tab)
  if (div_tabla.style.height == '500px') {
    div_tabla.style.height = '100%'
    este.innerHTML = '<span class="glyphicon glyphicon-resize-full"></span>'
  } else {
    if (div_tabla.style.height == '') {
      div_tabla.style.height = '100%'
      este.innerHTML = '<span class="glyphicon glyphicon-resize-full"></span>'
    } else {
      div_tabla.style.height = '500px'
      este.innerHTML = '<span class="glyphicon glyphicon-resize-small"></span>'
    }
  }
}





function setTwoNumberDecimal(valor, decimales) {
  return parseFloat(valor).toFixed(decimales);
}


function menos_sin_cal(id_tab, fila, fuente) {
  var tt = document.getElementById('tabla' + id_tab)

  if (tt.rows.length > 2 || fuente == 1) {
    f_id = '#f' + id_tab + '-f' + fila;
    var subdet = document.getElementById('regdet-' + id_tab + '-' + fila)
    if (subdet != null) {
      subdet.remove();
    }

    $(f_id).remove();
  }
}

function menos(id_tab, fila, fuente) {
  var tt = document.getElementById('tabla' + id_tab)

  if (tt.rows.length > 2 || fuente == 1) {
    f_id = '#f' + id_tab + '-f' + fila;

    var subdet = document.getElementById('regdet-' + id_tab + '-' + fila)
    if (subdet != null) {
      subdet.remove();
    }

    $(f_id).remove();
    //calcular_0(id_tab)
    calcular_0_v2(id_tab,[])
    

  }
}



function menossub(id_tab, fila, id_det) {
  var subdet = document.getElementById('subf' + id_tab + '-f' + fila + '-z' + id_det)
  if (subdet != null) {
    subdet.remove()
  }
}



function incrementar_resp() {
  document.getElementById('vpk_nota_responsable').value = document.getElementById('vpk_nota_responsable').value + document.getElementById('nota_tarea_cbx').value + ', '
}


function subir_archivo_nota2() {
  var frm = $('#vpk_nota_responsable')
  var files = document.getElementById('myfile_nota')
  formdata = new FormData();
  // file =files.prop('myfile_nota')[0];
  formdata.append("myfile_nota", files);
  //formdata.append("myfile_nota", file);
  formdata.append("Id_empresa", web_Id_empresa);
  formdata.append("usuario", web_usuario);
  formdata.append("csrfmiddlewaretoken", web_token);



  jQuery.ajax({
    url: '/file_upload',
    type: "POST",
    data: formdata,
    processData: false,
    contentType: false,
    success: function (result) {
      alert('Submission was successful.');
      alert(data);
    },
    error: function (data) {
      alert('An error occurred.');
      alert(data);
    },
  });


}

$("#form_nota").submit(function (e) {

  e.preventDefault(); // avoid to execute the actual submit of the form.

  var form = $(this);
  var url = form.attr('action');

  $.ajax({
    type: "POST",
    url: '/file_upload',
    data: form.serialize(), // serializes the form's elements.
    success: function (data) {
      alert(data); // show response from the php script.
    }
  });


});

function subir_archivo_nota() {
  if (!window.FileReader) {
    alert('Tu navegador no es soportado');
    return false;
  }

  var fileInput = $('#input_files');
  var input = fileInput.get(0);
  var reader = new FileReader();

  if (input.files.length) {
    for (x = 0; x < input.files.length; x++) {

      var textFile = input.files[x];
      // Read the file
      //reader.readAsText(textFile);
      reader.readAsDataURL(textFile);
      // When it's loaded, process it
      $(reader).on('load', processFile);
    }

  } else {
    alert('Ningun Archivo')
  }
}
function processFile(e) {
  var file = e.target.result,
    results;
  if (file && file.length) {
    $.ajax({
      type: 'POST',
      url: '/notasload',
      data: { 'csrfmiddlewaretoken': web_token, 'file': file, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario },
      beforeSend: function () {
        $("#div_update").html("Cargando Archivo");
      },
      success: function (response) {

        $("#div_update").html("Archivo Cargado");
      }
    });

  }
}
function nota_texto() {


  $.ajax({
    type: 'POST',
    url: '/nota_add_text',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'pknota': document.getElementById('vpk_nota').value, 'texto': document.getElementById('vpk_nota_txt').value },
    success: function (Response) {
      var li = document.createElement("li");

      nota_texto_html = '<div class="block"><div class="block_content">'
      nota_texto_html = nota_texto_html + '<h2 class="title"></h2>'
      nota_texto_html = nota_texto_html + '<div class="byline"><p>' + Response["date"] + ' -- <a>' + web_usuario + '</a></p></div>'
      nota_texto_html = nota_texto_html + '<p>' + Response["texto"] + '</p></div></div>'
      li.innerHTML = nota_texto_html

      var ul = document.getElementById("ul_notas_txt");
      //ul.appendChild(li);
      ul.prepend(li);


    }

  });
}
function crear_resp() {
  $.ajax({
    type: 'POST',
    url: '/crear_resp',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'pknota': document.getElementById('vpk_nota').value, 'tarea': document.getElementById('vpk_nota_tarea').value, 'responsable': document.getElementById('vpk_nota_responsable').value },
    success: function (Response) {

      var li = document.createElement("li");

      nota_texto_html = '<p><div class="icheckbox_flat-green unchecked" style="position: relative;"><input type="checkbox" class="flat" style="position: absolute; opacity: 0;"><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins></div> ' + Response["tarea"] + ', ' + Response["responsable"] + ' </p>'

      li.innerHTML = nota_texto_html

      var ul = document.getElementById("ul_ckh");
      ul.appendChild(li);


    }

  });
}
function add_abrir_nota_tar(pktar) {

  $.ajax({
    type: 'POST',
    url: '/agregar_nota_txt',
    data: { 'pk': pktar, 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'origen': 'CCtarea', 'texto': document.getElementById('txt_nota_a').value, 'user_dest': document.getElementById('txt_nota_user').value, 'pkmodulo': 0 },
    success: function (Response) {

      new_txt = '<i class="fa fa-comments bg-yellow"></i><div class="timeline-item"><div para: ' + Response["user_dest"] + ' class="timeline-body" style="padding: 5px;"><h2 class="title"></h2><div class="byline">De: <a>' + web_usuario + '</a>, Para: <a>' + document.getElementById('txt_nota_user').value + '</a> -- ' + moment().format('Y-M-D') + '</div><p style="margin-bottom: 0px;">' + Response["texto"] + '</p></div></div>'

      var li = document.createElement("li");
      li.innerHTML = new_txt
      var ul = document.getElementById("ul_notas_txt");
      //ul.appendChild(li);
      ul.prepend(li);


    }
  });
}

function abrir_nota_desde_msg(pknota, PkModulo) {

  $.ajax({
    type: 'POST',
    url: '/traer_nota',
    data: { 'pknota': pknota.id, 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'PkModulo': PkModulo },
    beforeSend: function () {

      document.getElementById('vpk_nota').value = 0
      document.getElementById('vpk_nota_origen').value = 0


    },
    success: function (Response) {

      //document.getElementById('vpk_nota').value = 'li_notapkzbz'+ Response["pk"] + 'zbz' + Response["origen"] 

      document.getElementById('vpk_nota').value = Response["pk"]
      document.getElementById('vpk_nota_origen').value = Response["origen"]


      new_tap = '<div class="box-body" style="background: aliceblue;"><div class="dashboard-widget-content">'

      new_tap = new_tap + '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span></button><label class="control-label for="txt_nota_user"="" style="font-size: 11px;">Para</label>'
      new_tap = new_tap + '<select class="btn btn-info dropdown-toggle" id="txt_nota_user" style="width: 200px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;">'
      for (x = 0; x < Response["listado_user"].length; x++) {
        new_tap = new_tap + '<option>' + Response["listado_user"][x]['Usuario'] + '</option>'
      }
      new_tap = new_tap + '</select><br>'

      new_tap = new_tap + '<label class="control-label for="txt_nota_a"="" style="font-size: 11px;">Comentario</label><textarea type="text" id="txt_nota_a" class="form-control" value="0" style="height: 45px;font-size: 11px;"></textarea>'
      new_tap = new_tap + '<div class="row"><button type="button" class="btn bg-blue btn-flat margin" onclick="add_abrir_nota(' + Response["PkModulo"] + ')" style="width: 49%;">Comentar</button>'
      new_tap = new_tap + '<button type="button" class="btn bg-blue btn-flat margin" onclick="registro(' + Response["PkModulo"] + ', ' + Response["pk"] + ', 2, -2, 0, 0) " style="width: 49%;" data-dismiss="modal">Ver Documento</button></div>'
      new_tap = new_tap + '<ul class="timeline" id="ul_notas_txt">'

      if (Response["notas_com_txt"].length > 0) {


        for (x = 0; x < Response["notas_com_txt"].length; x++) {
          new_tap = new_tap + '<li><i class="fa fa-comments bg-yellow"></i>'
          new_tap = new_tap + '         <div class="timeline-item">'
          new_tap = new_tap + '           <div class="timeline-body" style="padding: 5px;">'
          new_tap = new_tap + '             <h2 class="title"></h2>'
          new_tap = new_tap + '             <div class="byline">De: <a>' + Response["notas_com_txt"][x]["usuario"] + '</a>, Para: <a>' + Response["notas_com_txt"][x]["user_destino"] + '</a> -- ' + Response["notas_com_txt"][x]["fecha"] + '</div>'






          new_tap = new_tap + '<p style="margin-bottom: 0px;">' + Response["notas_com_txt"][x]["texto"] + '</p></div></div></li>'
        }
      }
      new_tap = new_tap + '</ul>'


      new_tap = new_tap + '</div></div>'

      $('#intnotaCab').html(new_tap);
      abrir_tareas_desde_doc(Response["PkModulo"], Response["pk"])



    }


  });
}

function abrir_nota(pknota, PkModulo) {

  $.ajax({
    type: 'POST',
    url: '/traer_nota',
    data: { 'pknota': pknota.id, 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'PkModulo': PkModulo },
    beforeSend: function () {

      document.getElementById('vpk_nota').value = 0
      document.getElementById('vpk_nota_origen').value = 0


    },
    success: function (Response) {

      //document.getElementById('vpk_nota').value = 'li_notapkzbz'+ Response["pk"] + 'zbz' + Response["origen"] 

      document.getElementById('vpk_nota').value = Response["pk"]
      document.getElementById('vpk_nota_origen').value = Response["origen"]

      new_tap = '<div id="div_nota_tareas"></div>'
      new_tap = new_tap + '<div class="box-body" style="background: aliceblue;"><div class="dashboard-widget-content">'

      new_tap = new_tap + '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span></button><label class="control-label for="txt_nota_user"="" style="font-size: 11px;">Para</label>'
      new_tap = new_tap + '<select class="btn btn-info dropdown-toggle" id="txt_nota_user" style="width: 200px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;">'
      for (x = 0; x < Response["listado_user"].length; x++) {
        new_tap = new_tap + '<option>' + Response["listado_user"][x]['Usuario'] + '</option>'
      }
      new_tap = new_tap + '</select>'
      new_tap = new_tap + '<br>'

      new_tap = new_tap + '<label class="control-label for="txt_nota_a"="" style="font-size: 11px;">Comentario</label><textarea type="text" id="txt_nota_a" class="form-control" value="0" style="height: 45px;font-size: 11px;"></textarea>'
      new_tap = new_tap + '<div class="row" style="margin-left: 0px;margin-right: 0px;"><button type="button" class="btn bg-blue btn-flat margin" onclick="add_abrir_nota(' + Response["PkModulo"] + ')" style="width: 49.5%;">Comentar</button>'
      new_tap = new_tap + '<button type="button" class="btn bg-blue btn-flat margin" onclick="registro(' + Response["PkModulo"] + ', ' + Response["pk"] + ', 2, -2, 0, 0) " style="width: 49.5%;" data-dismiss="modal">Ver Documento</button></div>'
      new_tap = new_tap + '<ul class="timeline" id="ul_notas_txt">'

      if (Response["notas_com_txt"].length > 0) {


        for (x = 0; x < Response["notas_com_txt"].length; x++) {
          new_tap = new_tap + '<li><i class="fa fa-comments bg-yellow"></i>'
          new_tap = new_tap + '         <div class="timeline-item">'
          new_tap = new_tap + '           <div class="timeline-body" style="padding: 5px;">'
          new_tap = new_tap + '             <h2 class="title"></h2>'
          new_tap = new_tap + '             <div class="byline">De: <a>' + Response["notas_com_txt"][x]["usuario"] + '</a>, Para: <a>' + Response["notas_com_txt"][x]["user_destino"] + '</a> -- ' + Response["notas_com_txt"][x]["fecha"] + '</div>'






          new_tap = new_tap + '<p style="margin-bottom: 0px;">' + Response["notas_com_txt"][x]["texto"] + '</p></div></div></li>'
        }
      }
      new_tap = new_tap + '</ul>'


      new_tap = new_tap + '</div></div>'

      $('#intnotaCab').html(new_tap);
      abrir_tareas_desde_doc(Response["PkModulo"], Response["pk"])
      //$('#divbusca_nota_doc').html('');



    }
  });
}
var no_actividad = 0

function abrir_tareas_desde_doc(PkModulo, pkdoc) {



  $.ajax({
    type: "POST",
    url: '/tareas_ind_por_modulo_pk',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'PkModulo': PkModulo, 'pkdoc': pkdoc },
    success: function (data) {
      html_tar = ''
      html_tar_indi = ''
      tar_completas = 0
      tar_metas = 0
      html_select_file = ''
      for (a1 = 0; a1 <= data["list_tareas"].length - 1; a1++) {

        for (a2 = 0; a2 <= data["list_tareas"][a1]['pk']["List_subtareas"].length - 1; a2++) {
          if (data["list_tareas"][a1]["usuario"] == web_usuario) {
            html_select_file = html_select_file + '<option value="' + data["list_tareas"][a1]['pk']["List_subtareas"][a2]['pk'] + '">' + data["list_tareas"][a1]['pk']["List_subtareas"][a2]['tarea'] + '</option>'
            if (data["list_tareas"][a1]["usuario"] == web_usuario) {
              html_tar_indi = html_tar_indi + '<tr style="text-align: center;" id="subtar_' + data["list_tareas"][a1]['pk']["List_subtareas"][a2]['pk'] + '"><td><a class="btn btn-danger" onclick="eliminar_tarea(' + data["list_tareas"][a1]['pk']["List_subtareas"][a2]['pk'] + ')" style="padding: 2px 2px; margin-right: 0px; margin-left: 0px;"><span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span></a></td><td>' + data["list_tareas"][a1]['pk']["List_subtareas"][a2]['tarea'] + '</td><td valign="middle">' + data["list_tareas"][a1]['pk']["List_subtareas"][a2]['user_destino'] + '</td><td>' + data["list_tareas"][a1]['pk']["List_subtareas"][a2]['area'] + '</td><td>' + data["list_tareas"][a1]['pk']["List_subtareas"][a2]['fecha'] + '</td>'
            } else {
              html_tar_indi = html_tar_indi + '<tr style="text-align: center;" id="subtar_' + data["list_tareas"][a1]['pk']["List_subtareas"][a2]['pk'] + '"><td></td><td>' + data["list_tareas"][a1]['pk']["List_subtareas"][a2]['tarea'] + '</td><td valign="middle">' + data["list_tareas"][a1]['pk']["List_subtareas"][a2]['user_destino'] + '</td><td>' + data["list_tareas"][a1]['pk']["List_subtareas"][a2]['area'] + '</td><td>' + data["list_tareas"][a1]['pk']["List_subtareas"][a2]['fecha'] + '</td>'

            }

            html_tar_indi = html_tar_indi + '<td>'
            for (var xz = data["List_files"].length - 1; xz >= 0; xz--) {
              if (data["List_files"][xz]['pktar'] == data["list_tareas"][a1]['pk']["List_subtareas"][a2]['pk']) {
                html_tar_indi = html_tar_indi + '<a href="' + data["List_files"][xz]['url'] + '" target="_blank">' + data["List_files"][xz]['nombre'] + '</a><br>'

              }
            }
            html_tar_indi = html_tar_indi + '</td>'


            if (data["list_tareas"][a1]['pk']["List_subtareas"][a2]['estado'] == '1') {
              tar_completas = tar_completas + 1
              html_tar_indi = html_tar_indi + '<td><div class="checkbox"><label><input type="checkbox" checked onclick="tareas_cambio_estado(this,' + data["list_tareas"][a1]['pk']["List_subtareas"][a2]['pk'] + ')"><span class="checkbox-material"><span class="check"></span></span></label></div></td>'

            } else {
              html_tar_indi = html_tar_indi + '<td><div class="checkbox"><label><input type="checkbox" onclick="tareas_cambio_estado(this,' + data["list_tareas"][a1]['pk']["List_subtareas"][a2]['pk'] + ')"><span class="checkbox-material"><span class="check"></span></span></label></div></td>'
            }
            if (data["list_tareas"][a1]['pk']["List_subtareas"][a2]['aprovado'] == '1') {
              html_tar_indi = html_tar_indi + '<td><div class="checkbox"><label><input type="checkbox" checked onclick="tareas_cambio_aprovado(this,' + data["list_tareas"][a1]['pk']["List_subtareas"][a2]['pk'] + ')"><span class="checkbox-material"><span class="check"></span></span></label></div></td>'

            } else {
              html_tar_indi = html_tar_indi + '<td><div class="checkbox"><label><input type="checkbox" onclick="tareas_cambio_aprovado(this,' + data["list_tareas"][a1]['pk']["List_subtareas"][a2]['pk'] + ')"><span class="checkbox-material"><span class="check"></span></span></label></div></td>'
            }


            tar_metas = tar_metas + 1
            html_tar_indi = html_tar_indi + '</tr>'
          } else {
            if (data["list_tareas"][a1]['pk']["List_subtareas"][a2]['user_destino'].toLocaleLowerCase() == (web_usuario).toLocaleLowerCase()) {
              html_select_file = html_select_file + '<option value="' + data["list_tareas"][a1]['pk']["List_subtareas"][a2]['pk'] + '">' + data["list_tareas"][a1]['pk']["List_subtareas"][a2]['tarea'] + '</option>'

              html_tar_indi = html_tar_indi + '<tr style="text-align: center;"><td>' + data["list_tareas"][a1]['pk']["List_subtareas"][a2]['tarea'] + '</td><td valign="middle">' + data["list_tareas"][a1]['pk']["List_subtareas"][a2]['user_destino'] + '</td><td>' + data["list_tareas"][a1]['pk']["List_subtareas"][a2]['area'] + '</td><td>' + data["list_tareas"][a1]['pk']["List_subtareas"][a2]['fecha'] + '</td>'
              html_tar_indi = html_tar_indi + '<td>'
              for (var xz = data["List_files"].length - 1; xz >= 0; xz--) {
                if (data["List_files"][xz]['pktar'] == data["list_tareas"][a1]['pk']["List_subtareas"][a2]['pk']) {
                  html_tar_indi = html_tar_indi + '<a href="' + data["List_files"][xz]['url'] + '" target="_blank">' + data["List_files"][xz]['nombre'] + '</a><br>'

                }
              }
              html_tar_indi = html_tar_indi + '</td>'

              if (data["list_tareas"][a1]['pk']["List_subtareas"][a2]['estado'] == '1') {
                html_tar_indi = html_tar_indi + '<td><div class="checkbox"><label><input type="checkbox" checked onclick="tareas_cambio_estado(this,' + data["list_tareas"][a1]['pk']["List_subtareas"][a2]['pk'] + ')"><span class="checkbox-material"><span class="check"></span></span></label></div></td>'

              } else {
                html_tar_indi = html_tar_indi + '<td><div class="checkbox"><label><input type="checkbox" onclick="tareas_cambio_estado(this,' + data["list_tareas"][a1]['pk']["List_subtareas"][a2]['pk'] + ')"><span class="checkbox-material"><span class="check"></span></span></label></div></td>'
              }
              if (data["list_tareas"][a1]['pk']["List_subtareas"][a2]['aprovado'] == '1') {
                html_tar_indi = html_tar_indi + '<td><div class="checkbox"><label><input type="checkbox" checked onclick="tareas_cambio_aprovado(this,' + data["list_tareas"][a1]['pk']["List_subtareas"][a2]['pk'] + ')"><span class="checkbox-material"><span class="check"></span></span></label></div></td>'

              } else {
                html_tar_indi = html_tar_indi + '<td><div class="checkbox"><label><input type="checkbox" onclick="tareas_cambio_aprovado(this,' + data["list_tareas"][a1]['pk']["List_subtareas"][a2]['pk'] + ')"><span class="checkbox-material"><span class="check"></span></span></label></div></td>'
              }
              html_tar_indi = html_tar_indi + '</tr>'
            }
          }
        }
        if (data["list_tareas"][0]["usuario"] == web_usuario) {
          completado = parseInt(parseFloat((tar_completas / tar_metas) * 100))

        } else {
          completado = 0

        }

        html_tar = '<div class="box" style="width: 100%;"><div class="box-header"><h3 class="box-title">Tarea</h3></div><div class="box-body table-responsive pad"><p style="cursor: pointer;color: darkslateblue;">' + data["list_tareas"][0]['tarea'] + ' - ' + data["list_tareas"][0]['proyecto'] + '<small class="pull-right">' + completado + '%</small></p><div class="progress xs"><div class="progress-bar progress-bar-aqua" style="width: ' + completado + '%" role="progressbar" aria-valuenow="' + completado + '" aria-valuemin="0" aria-valuemax="100"><span class="sr-only">' + completado + '%" completado</span></div></div><div class="ripple-container"></div>'

        html_tar = html_tar + '<div class="box-body table-responsive no-padding"><table class="table table-bordered" id="tabla_tareas"><tbody><tr><th></th><th>Tareas</th><th>Responsable</th><th>Area</th><th>Inicio</th><th>Entrega</th><th>Archivos</th><th>Estado</th><th>Aprobado</th></tr>'
        html_tar = html_tar + html_tar_indi + '</tbody></table>'

        html_tar = html_tar + '<div class="col-sm-4"><label class="control-label for=" relacionado"="" style="font-size: 12px;font-weight: bold;">Tareas</label><select class="form-control col-sm-4" id="tar_adj_pk" style="height: 25px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;">' + html_select_file + '</select></div>'
        html_tar = html_tar + '<div class="col-sm-4"><label class="control-label for=" id"="" style="font-size: 12px;font-weight: bold;">Nombre</label><input type="text" id="tar_adj_nom" class="form-control col-sm-4" value="" style="height: 25px;font-size: 11px;"></div>'
        html_tar = html_tar + '<div class="col-sm-4"><label class="control-label for=" id"="" style="font-size: 12px;font-weight: bold;">Url</label><input type="text" id="tar_adj_url" class="form-control col-sm-4" value="" style="height: 25px;font-size: 11px;"></div>'
        html_tar = html_tar + '<button type="button" class="btn bg-green btn-flat margin" onclick="tar_adjuntar()" style="/* height: 30px; */width: 100%;/* padding: 3px 4px; *//* padding-bottom: 8px; *//* padding-left: 10px; *//* margin-left: 1px; */" btn="" bg-green="" btn-flat="">Adjuntar</button>'


        html_tar = html_tar + '</div>'
        html_tar = html_tar + '<div class="dashboard-widget-content"><label class="control-label for=" txt_nota_user"="" style="font-size: 11px;">Para</label><select class="btn btn-info dropdown-toggle" id="txt_nota_user" style="width: 200px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;">'
        for (x = 0; x < data["listado_user"].length; x++) {
          html_tar = html_tar + '<option>' + data["listado_user"][x]['Usuario'] + '</option>'
        }

        html_tar = html_tar + '</select><br><label class="control-label for=" txt_nota_a"="" style="font-size: 11px;">Comentario</label><textarea type="text" id="txt_nota_a" class="form-control" value="0" style="height: 45px;font-size: 11px;"></textarea><div class="row" style="margin-left: 0px;margin-right: 0px;"><button type="button" class="btn bg-blue btn-flat margin" onclick="add_abrir_nota_tar(' + pktarea + ')" style="width: 99.5%;">Comentar</button></div><ul class="timeline" id="ul_notas_txt">'


        for (z2 = 0; z2 <= data["List_coments"].length - 1; z2++) {
          html_tar = html_tar + '<li><i class="fa fa-comments bg-yellow"></i>'
          html_tar = html_tar + '         <div class="timeline-item">'
          html_tar = html_tar + '           <div class="timeline-body" style="padding: 5px;">'
          html_tar = html_tar + '             <h2 class="title"></h2>'
          html_tar = html_tar + '             <div class="byline">De: <a>' + data["List_coments"][z2]["usuario"] + '</a>, Para: <a>' + data["List_coments"][z2]["user_destino"] + '</a> -- ' + data["List_coments"][z2]["fecha"] + '</div>'

          html_tar = html_tar + '<p style="margin-bottom: 0px;">' + data["List_coments"][z2]["texto"] + '</p></div></div></li>'
        }

        html_tar = html_tar + '</ul></div></div>'


        if (data["list_tareas"][0]["usuario"] == web_usuario) {

          html_tar = html_tar + '<div class="form-group is-empty" style="padding: 10px;"><label for="new_subtar">Nueva Tarea</label><input type="text" class="form-control" id="new_subtar" placeholder="Tarea">'


          html_tar = html_tar + '<label class="control-label for=" txt_nota_user"="" style="font-size: 11px;">Responsable</label><select class="btn btn-info dropdown-toggle" id="txt_tar_user" style="width: 200px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;">'

          for (x = 0; x < data["listado_user"].length; x++) {
            html_tar = html_tar + '<option>' + data["listado_user"][x]['Usuario'] + '</option>'
          }
          html_tar = html_tar + '</select>'
          html_tar = html_tar + '<label class="control-label for=" txt_tar_area"="" style="font-size: 11px;">Area</label><select class="btn btn-info dropdown-toggle" id="txt_tar_area" style="width: 200px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;">'

          for (x = 0; x < data["list_areas"].length; x++) {
            html_tar = html_tar + '<option>' + data["list_areas"][x]['Area'] + '</option>'
          }
          html_tar = html_tar + '</select>'

          var now = new Date();
          valor_campo = now.format("Y-m-d")

          html_tar = html_tar + '<label class="control-label for="txt_tar_fecha_inicio" style="font-size: 11px;">Inicio</label><input type="date" id="txt_tar_fecha_inicio" value="' + web_fecha + '" style="height: 25px;font-size: 11px;padding-left: 20px;margin-left: 20px;">'
          html_tar = html_tar + '<label class="control-label for="txt_tar_fecha_entre"   style="font-size:11px;padding-left:10px;">Entrega</label><input type="date" id="txt_tar_fecha_entre" value="' + web_fecha + '" style="height: 25px;font-size: 11px;padding-left: 20px;margin-left: 20px;"></div>'

          html_tar = html_tar + '<div class="row" style="margin-right: 0px;margin-left: 0px;"><button type="button" class="btn bg-blue btn-flat margin"  style="width: 49%;" onclick="add_sub_tarea(' + data["list_tareas"][0]['pk'] + ')">Agregar Tarea</button><button type="button" class="btn bg-blue btn-flat margin" onclick="finalizar_tarea(' + data["list_tareas"][0]['pk'] + ')" style="width: 49%;" data-dismiss="modal">Finalizar Tarea</button></div></div>'

        }

        html_tar = html_tar + '</div>'


      }
      var dd = document.getElementById('div_nota_tareas')

      dd.innerHTML = html_tar






    }
  });
}


function timmer_aut() {
  //traer_alertas()
  //traer_mensajes()
  //traer_tareas()
  //traer_errores()
  //actualizar_paneles()
  //no_actividad = no_actividad +1
  //if(no_actividad == 10){
  //alert(no_actividad)
  //window.open("http://www.cerocodigo.com/esp/log","_self");

  //}
  //2000 = 2 segundos
  //setTimeout(timmer_aut, 1800000);
  //setTimeout(timmer_aut, 1800000);


}

function panel_nuevo(campo, pkpanel, pkgrupo, xE, pkmodulo) {

  campo.disabled = true;
  desgl = campo.id.split('_fff_')
  V_valor = desgl[1]
  V_campo = desgl[2]
  V_tabla = desgl[3]


  $.ajax({
    type: 'POST',
    url: '/insert_rapido',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'V_valor': V_valor, 'V_campo': V_campo, 'V_tabla': V_tabla, 'pkpanel': pkpanel, 'pkgrupo': pkgrupo, 'xE': xE, 'pkmodulo': pkmodulo },
    success: function (Response) {
      paneles_taraer(Response['pkpanel'], Response['pkgrupo'], Response['xE'], Response['pkmodulo'])
    }
  });


}
function panel_nuevodet(campo, pkregistro, pkmodulo) {

  campo.disabled = true;

  $.ajax({
    type: 'POST',
    url: '/insert_rap_det',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'pkregistro': pkregistro, 'pkmodulo': pkmodulo },
    success: function (Response) {
      panelAbrir(Response['pkregistro'], Response['pkmodulo'])
    }
  });


}



function panelAbrir(pkregistro, pkmodulo) {

  $.ajax({
    type: 'POST',
    url: '/traer_rapido',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'pkmodulo': pkmodulo, 'pkregistro': pkregistro },
    success: function (Response) {

      new_tap = '<div class="box box-primary">'
      //new_tap = new_tap +'<div class="box-header with-border"><div class="box-tools"></div></div>'
      new_tap = new_tap + '<div class="box-body no-padding"><div class="mailbox-controls">'
      new_tap = new_tap + '<div class="btn-group">'
      new_tap = new_tap + '<button type="button" class="btn btn-primary" onClick="panel_nuevodet(this, ' + pkregistro + ', ' + pkmodulo + ')"><i class="fa fa-plus"> Nuevo </i></button>'


      new_tap = new_tap + '</div>'
      new_tap = new_tap + '<div class="table-responsive mailbox-messages" style="height: 500px;"><table class="table table-hover table-striped"><thead>'
      new_tap = new_tap + '<tr>'
      primary_key = ''

      for (v = 0; v < Response["campos_det"].length; v++) {
        if (Response["campos_det"][v]["Visible"] == 'Y') {
          new_tap = new_tap + '<th style="width: ' + Response["campos_det"][v]["largo"] + 'px;">' + Response["campos_det"][v]["Descripcion"] + '</th>'
        } else {
          new_tap = new_tap + '<th style="display: none;">' + Response["campos_det"][v]["Descripcion"] + '</th>'
        }

      }
      new_tap = new_tap + '</thead><tbody>'

      for (v = 0; v < Response["valores_det"].length; v++) {
        new_tap = new_tap + '<tr>'

        for (v2 = 0; v2 < Response["campos_det"].length; v2++) {
          valor = Response["valores_det"][v][Response["campos_det"][v2]["Nombre"]]

          iddet = Response["campos_det"][v2]["Nombre"] + 'fff' + Response["tabla_det"]["Nombre"] + 'fff' + Response["valores_det"][v]["Pk" + Response["tabla_det"]["Nombre"]]


          if (Response["campos_det"][v2]["TablaCampo"] == "cmpopcmultiple") {

            html_int = '<select id="' + iddet + '" class="form-control" value="' + valor + '" onchange="cambio_en_panelesdet()" style="font-size: 11px;padding-top: 0px;padding-bottom: 0px; width: ' + Response["campos_det"][v2]["largo"] + 'px; background-color:@@">'
            for (z = 0; z < Response["func_det"][Response["campos_det"][v2]["Nombre"]].length; z++) {
              if (valor == Response["func_det"][Response["campos_det"][v2]["Nombre"]][z]["Valor"]) {
                html_int = html_int + '<option selected style="background-color: ' + Response["func_det"][Response["campos_det"][v2]["Nombre"]][z]["Color"] + ';" value="' + Response["func_det"][Response["campos_det"][v2]["Nombre"]][z]["Valor"] + '">' + Response["func_det"][Response["campos_det"][v2]["Nombre"]][z]["Nombre"] + '</option>'
                html_int = html_int.replace('@@', Response["func_det"][Response["campos_det"][v2]["Nombre"]][z]["Color"])
              } else {
                html_int = html_int + '<option style="background-color: ' + Response["func_det"][Response["campos_det"][v2]["Nombre"]][z]["Color"] + ';" value="' + Response["func_det"][Response["campos_det"][v2]["Nombre"]][z]["Valor"] + '">' + Response["func_det"][Response["campos_det"][v2]["Nombre"]][z]["Nombre"] + '</option>'
              }
            }
            html_int = html_int + '</select>'

          } else {
            if (Response["campos_det"][v2]["TablaCampo"] == "cmpfecha") {
              if (valor == null) {
                var now = new Date();
                if (Response["func_det"][Response["campos_det"][v2]["Nombre"]][0]["Tiempo"] == "Y") {
                  valor = now.format("Y-m-d") + 'T' + now.format("H:i:s")
                } else {
                  valor = now.format("Y-m-d");
                }
              } else {
                var now = new Date(valor);
                if (Response["func_det"][Response["campos_det"][v2]["Nombre"]][0]["Tiempo"] == "Y") {
                  valor = now.format("Y-m-d") + 'T' + now.format("H:i:s")
                } else {
                  valor = now.format("Y-m-d");
                }
              }

              html_int = '<input type="datetime-local" id="' + iddet + '" type="text" class="form-control" value="' + valor + '" onchange="cambio_en_panelesdet()" style="height: 25px;font-size: 11px;line-height: 7px;width: ' + Response["campos_det"][v2]["largo"] + 'px;">'


            } else {

              html_int = '<input id="' + iddet + '" type="text" class="form-control" value="' + valor + '" onchange="cambio_en_panelesdet()" style="font-size: 11px; width: ' + Response["campos_det"][v2]["largo"] + 'px;">'

            }
          }


          if (Response["campos_det"][v2]["Visible"] == 'Y') {
            new_tap = new_tap + '<td style="width: ' + Response["campos_det"][v2]["largo"] + 'px;">' + html_int + '</td>'
          } else {
            new_tap = new_tap + '<td style="display: none;">' + html_int + '</td>'
          }
        }
        new_tap = new_tap + '</tr>'
      }


      new_tap = new_tap + '</tbody></table></div></div></div>'
      new_tap = new_tap + '</div>'
      var panel_est = document.getElementById("intnotaPanel")
      panel_est.innerHTML = new_tap





    }
  });

}
function paneles_taraer_achicar_largo(este, div_panel) {

  if (div_panel.style.height != '0px') {
    div_panel.style.height = '0px'
    este.innerHTML = '<i class="fa fa-fw fa-plus"></i>'
  } else {
    div_panel.style.height = '100%'
    este.innerHTML = '<i class="fa fa-fw fa-minus"></i>'
  }

}
function paneles_taraer_achicar(este, div_panel) {

  if (div_panel.style.height != '0px') {
    div_panel.style.height = '0px'
    este.innerHTML = '<i class="fa fa-fw fa-plus"></i>'
  } else {
    if (div_panel.children[0].children[0].children[0].children[0].children[0].childElementCount > 0) {
      div_panel.style.height = parseInt(div_panel.children[0].children[0].children[0].children[0].children[0].children[0].clientHeight + 45) + 'px'
    } else {
      div_panel.style.height = '100px'
    }

    este.innerHTML = '<i class="fa fa-fw fa-minus"></i>'
  }

}

function paneles_taraer_auto_hori(pkpanel, pkgrupo, xE, pkmodulo, vv2, tiempo) {


  $.ajax({
    type: 'POST',
    url: '/paneles_items',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'pkpanel': pkpanel, 'pkgrupo': pkgrupo, 'xE': xE, 'pkmodulo': pkmodulo },
    beforeSend: function () {
      var panel_est = document.getElementById("intpestados" + xE + "_" + vv2)
      //panel_est.innerHTML = 'Procesando...'
    },
    success: function (Response) {
      new_tap = '<div class="box box-primary" style="margin-bottom: 5px;">'
      //new_tap = new_tap +'<div class="box-header with-border"><h3 class="box-title">'+ Response["estado"]["nombre"]  +'</h3><div class="box-tools"><button type="button" class="btn btn-box-tool" data-widget="collapse" onClick="paneles_taraer('+pkpanel+', '+pkgrupo+', '+xE+', '+pkmodulo+')"><i class="fa fa-fw fa-refresh"></i><div class="ripple-container"></div></button></div></div>'


      new_tap = new_tap + '<div class="box-body no-padding"><div class="mailbox-controls">'

      if (Response["tipo"] == 'tabla') {

        new_tap = new_tap + '<div class="box box-primary" style="margin-bottom: 5px;">'

        new_tap = new_tap + '<div class="row" style="background: #e9e9e9; margin-left: 0px; margin-right: 0px;">'




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
          if (visible == true) {
            dict_visible[v] = 'S'
          } else {
            dict_visible[v] == 'N'
          }
        }


        for (v = 0; v < Response["valores_cab"].length; v++) {
          new_tap = new_tap + '<div class="col-md-' + Response["estado"]["tamano"] + ' col-sm-' + Response["estado"]["tamano"] + ' col-xs-12" style="margin-left: 5px; margin-right: 5px; margin-top: 5px; margin-bottom: 5px; background: white;">'



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
                  if (Response['campo_fix'][0] == Response["campos_cab"][v2]["Nombre"]) {
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
                      html_int = '<input id="' + iddet + '" type="file" class="form-control" value="' + valor + '" onchange="cambio_en_paneles_archi();subir_archivo_flow(' + iddet + ')" style="font-size: 11px;"><p id="' + iddet + '_lbl"></p>'


                    } else {
                      if (Response['campo_fix'][0] == Response["campos_cab"][v2]["Nombre"]) {
                        html_int = '<select id="' + iddet + '" class="form-control" value="' + valor + '" onchange="cambio_en_panelesdet_actuliza()" style="font-size: 11px;padding-top: 0px;padding-bottom: 0px">'
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


            if (dict_visible[v2] == 'S') {

              new_tap = new_tap + '<div class="col-md-' + (parseInt(Response["campos_cab"][v2]["largoweb"]) * 2) + ' col-sm-' + (parseInt(Response["campos_cab"][v2]["largoweb"]) * 2) + ' col-xs-' + (parseInt(Response["campos_cab"][v2]["largoweb"]) * 2) + '" style="padding-left: 0px;">'
              new_tap = new_tap + '<label for="' + iddet + '">' + Response["campos_cab"][v2]["Descripcion"] + '</label>'
              new_tap = new_tap + html_int
              new_tap = new_tap + '</div>'

            } else {
              //new_tap = new_tap + '<label for="'+iddet+'">'+Response["campos_cab"][v2]["Descripcion"]+'</label>'
              // new_tap = new_tap + html_int
            }
          }

          new_tap = new_tap + '</div>'

        }
        new_tap = new_tap + '</div>'


        new_tap = new_tap + '</div></div></div>'
        new_tap = new_tap + '</div>'


        var panel_est = document.getElementById("intpestados" + Response['xE'] + "_" + vv2)
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


        var panel_est = document.getElementById("intpestados" + Response['xE'] + "_" + vv2)
        panel_est.innerHTML = new_tap
      }

      var div_panel = document.getElementById('intpestados' + Response['xE'] + '_' + vv2)
      if (div_panel.children[0].children[0].children[0].children[0].children[0].childElementCount > 0) {
        div_panel.style.height = parseInt(div_panel.children[0].children[0].children[0].children[0].children[0].children[0].clientHeight + 45) + 'px'
        if (parseInt(div_panel.children[0].children[0].children[0].children[0].children[0].children[0].clientHeight) == 0) {
          div_panel.style.height = '300px'
        }
      } else {
        div_panel.style.height = '100px'
      }

    }

  });
  //2000 = 2 segundos

  //setTimeout(paneles_taraer_auto(pkpanel, pkgrupo, xE, pkmodulo, vv2, tiempo), tiempo);

}
function paneles_taraer_auto(pkpanel, pkgrupo, xE, pkmodulo, vv2, tiempo) {

  $.ajax({
    type: 'POST',
    url: '/paneles_items',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'pkpanel': pkpanel, 'pkgrupo': pkgrupo, 'xE': xE, 'pkmodulo': pkmodulo },
    beforeSend: function () {
      var panel_est = document.getElementById("intpestados" + xE + "_" + vv2)
      //panel_est.innerHTML = 'Procesando...'
    },
    success: function (Response) {
      new_tap = '<div class="box box-primary">'
      //new_tap = new_tap +'<div class="box-header with-border"><h3 class="box-title">'+ Response["estado"]["nombre"]  +'</h3><div class="box-tools"><button type="button" class="btn btn-box-tool" data-widget="collapse" onClick="paneles_taraer('+pkpanel+', '+pkgrupo+', '+xE+', '+pkmodulo+')"><i class="fa fa-fw fa-refresh"></i><div class="ripple-container"></div></button></div></div>'


      new_tap = new_tap + '<div class="box-body no-padding"><div class="mailbox-controls">'

      if (Response["tipo"] == 'tabla') {

        new_tap = new_tap + '<div class="box box-primary">'

        new_tap = new_tap + '<div class="row" style="background: #e9e9e9; margin-left: 0px; margin-right: 0px;">'




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
          if (visible == true) {
            dict_visible[v] = 'S'
          } else {
            dict_visible[v] == 'N'
          }
        }
        for (v = 0; v < Response["valores_cab"].length; v++) {
          new_tap = new_tap + '<div class="row" style="margin-left: 5px; margin-right: 5px; margin-top: 5px; margin-bottom: 5px; background: white;">'

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
                  if (Response['campo_fix'][0] == Response["campos_cab"][v2]["Nombre"]) {
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
                      html_int = '<input id="' + iddet + '" type="file" class="form-control" value="' + valor + '" onchange="cambio_en_paneles_archi();subir_archivo_flow(' + iddet + ')" style="font-size: 11px;"><p id="' + iddet + '_lbl"></p>'
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


            if (dict_visible[v2] == 'S') {

              new_tap = new_tap + '<div class="col-sm-' + (parseInt(Response["campos_cab"][v2]["largoweb"]) * 2) + '">'
              new_tap = new_tap + '<label for="' + iddet + '">' + Response["campos_cab"][v2]["Descripcion"] + '</label>'
              new_tap = new_tap + html_int
              new_tap = new_tap + '</div>'

            } else {
              //new_tap = new_tap + '<label for="'+iddet+'">'+Response["campos_cab"][v2]["Descripcion"]+'</label>'
              // new_tap = new_tap + html_int
            }
          }

          new_tap = new_tap + '</div>'

        }
        new_tap = new_tap + '</div>'


        new_tap = new_tap + '</div></div></div>'
        new_tap = new_tap + '</div>'


        var panel_est = document.getElementById("intpestados" + Response['xE'] + "_" + vv2)
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


        var panel_est = document.getElementById("intpestados" + Response['xE'] + "_" + vv2)
        panel_est.innerHTML = new_tap
      }


    }

  });
  //2000 = 2 segundos

  //setTimeout(paneles_taraer_auto(pkpanel, pkgrupo, xE, pkmodulo, vv2, tiempo), tiempo);

}



function cambio_en_panelesdet() {
  valor = ''
  var envio = event.target
  if (envio.type == 'select-one') {
    //opcion multiple
    envio.style.backgroundColor = envio.selectedOptions[0].style.backgroundColor
    valor = envio.value
  } else {
    envio.style.backgroundColor = 'lightcyan'
    valor = envio.value
  }

  est_id = envio.id.split("fff")
  V_campo = est_id[0]
  V_tabla = est_id[1]
  V_registro = est_id[2]


  $.ajax({
    type: 'POST',
    url: '/cambio_rapido',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'valor': valor, 'V_campo': V_campo, 'V_tabla': V_tabla, 'V_registro': V_registro },
    success: function (Response) {

      //actualizar_paneles()

    }
  });

}

function cambio_en_panelesdet_actuliza() {
  valor = ''
  var envio = event.target
  if (envio.type == 'select-one') {
    //opcion multiple
    envio.style.backgroundColor = envio.selectedOptions[0].style.backgroundColor
    valor = envio.value
  } else {
    envio.style.backgroundColor = 'lightcyan'
    valor = envio.value
  }

  est_id = envio.id.split("fff")
  V_campo = est_id[0]
  V_tabla = est_id[1]
  V_registro = est_id[2]


  $.ajax({
    type: 'POST',
    url: '/cambio_rapido',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'valor': valor, 'V_campo': V_campo, 'V_tabla': V_tabla, 'V_registro': V_registro },
    success: function (Response) {
      //actualizar_paneles()

    }
  });

}



function cambio_en_paneles() {
  valor = ''
  var envio = event.target
  if (envio.type == 'select-one') {
    //opcion multiple
    envio.style.backgroundColor = envio.selectedOptions[0].style.backgroundColor
    valor = envio.value
  } else {
    envio.style.backgroundColor = 'lightcyan'
    valor = envio.value
  }

  est_id = envio.id.split("fff")
  V_campo = est_id[0]
  V_tabla = est_id[1]
  V_registro = est_id[2]




  $.ajax({
    type: 'POST',
    url: '/cambio_rapido',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'valor': valor, 'V_campo': V_campo, 'V_tabla': V_tabla, 'V_registro': V_registro },
    success: function (Response) {
      if (V_campo == 'Estado') {
        actualizar_paneles()
      }
    }
  });

}


function filtro_directo_panel() {

}
function actualizar_paneles_directo(pkpanel) {
  $.ajax({
    type: 'POST',
    url: '/paneles_carga_pkpanel',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'pkpanel': pkpanel },
    success: function (Response) {

      for (v = 0; v < Response["paneles"].length; v++) {
        new_tap = '<section class="content">'
        if (Response["paneles"][v]['tipo'] == 'Estado') {
          new_tap = new_tap + '<div class="row">'
          new_tap = new_tap + '<div class="col-md-3"><div class="box box-solid"><div class="box-header with-border">'
          new_tap = new_tap + '<h3 class="box-title"> ' + Response["paneles"][v]["grupos_nom"] + '</h3><div class="box-tools"><button type="button" class="btn btn-box-tool" data-widget="collapse" onclick="actualizar_paneles()"><i class="fa fa-fw fa-refresh"></i><div class="ripple-container"></div></button></div></div><div class="box-body no-padding" style=""><ul class="nav nav-pills nav-stacked" id="ppanel' + Response["paneles"][v]["pkPanel"] + '">'

          for (v2 = 0; v2 < Response["grupos"][Response["paneles"][v]["pkPanel"]].length; v2++) {
            display = ''

            if (Response["paneles"][v]["agrupar"] == '$directo') {
              display = Response["grupos_datos"][Response["paneles"][v]['pkPanel']][v2]['Display']

            } else {
              if (Response["paneles"][v]["agrupar"] == '') {
                display = Response["grupos_datos"][Response["paneles"][v]['pkPanel']][v2]['Display']
              } else {

                for (v3 = 0; v3 < Response["grupos_datos"][Response["paneles"][v]["pkPanel"]].length; v3++) {
                  if (Response["grupos_datos"][Response["paneles"][v]["pkPanel"]][v3]['Campo'] == Response["grupos"][Response["paneles"][v]["pkPanel"]][v2]['Valor']) { display = Response["grupos_datos"][Response["paneles"][v]["pkPanel"]][v3]['Display'] }
                }

              }

            }


            new_tap = new_tap + '<li style="cursor: pointer;" onclick="paneles_taraer(' + Response["paneles"][v]["pkPanel"] + ',' + Response["grupos"][Response["paneles"][v]["pkPanel"]][v2]["pkgrupo"] + ',' + v + ',' + Response["paneles"][v]["pkmodulo"] + ')"><a><i class="fa fa-file-text-o"></i>' + Response["grupos"][Response["paneles"][v]["pkPanel"]][v2]['nombre'] + ' <small class="pull-right">' + display + '</small></a></li>'
          }
          new_tap = new_tap + '</ul></div></div></div>'
          new_tap = new_tap + '<div class="col-md-9"> <div id="intpestados' + v + '"></div></div>'
          new_tap = new_tap + '</div>'
        }
        if (Response["paneles"][v]['tipo'] == 'Ficha') {
          new_tap = new_tap + '<div class="col-md-12">'
          new_tap = new_tap + '<div class="box box-primary direct-chat direct-chat-primary" style="margin-bottom: 0px;"><div class="box box-info" style="margin-bottom: 0px;"><div class="box-header with-border">'
          //new_tap = new_tap + '<h3 class="box-title">'+Response["paneles"][v]['nombre']+'</h3>'
          new_tap = new_tap + '<div class="box-header with-border" style="padding-top: 5px;">'
          new_tap = new_tap + '<div class="input-group input-group-sm" style="width: 100%;">'

          new_tap = new_tap + '<div class="row" style="text-align: right;">'



          new_tap = new_tap + '<div class="col-md-3 col-sx-3 col-xs-6">'


          if (Response["paneles"][v]['adicional1'] == "") {
            new_tap = new_tap + '<input type="text" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_codigo" readonly="readonly" class="form-control col-sm-3" value="" onchange="" style="width: 100%;height: 25px;font-size: 11px;margin-right: 5px;" placeholder="Codigo">'
            if (Response["paneles"][v]['new'] == "Directo") {
              new_tap = new_tap + '<input type="hidden" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_filtro" class="form-control col-sm-3" value="" onchange="buscar_referencia_paneles_filtrar_directo(' + Response["paneles"][v]['pkPanel'] + ', \'' + Response["paneles"][v]['agrupar'] + '\', \'' + Response["paneles"][v]['tabla'] + '\' , \'' + Response["paneles"][v]['adicional1'] + '\')" style="width: 100%;height: 25px;font-size: 11px;margin-right: 5px;" placeholder="' + Response["paneles"][v]['adicional1'] + '">'
            }


          } else {
            new_tap = new_tap + '<input type="hidden" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_codigo" readonly="readonly" class="form-control col-sm-3" value="" onchange="" style="width: 100%;height: 25px;font-size: 11px;margin-right: 5px;" placeholder="Codigo">'
            new_tap = new_tap + '<input type="text" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_filtro" class="form-control col-sm-3" value="" onchange="buscar_referencia_paneles_filtrar_directo(' + Response["paneles"][v]['pkPanel'] + ', \'' + Response["paneles"][v]['agrupar'] + '\', \'' + Response["paneles"][v]['tabla'] + '\' , \'' + Response["paneles"][v]['adicional1'] + '\')" style="width: 100%;height: 25px;font-size: 11px;margin-right: 5px;" placeholder="' + Response["paneles"][v]['adicional1'] + '">'


          }



          new_tap = new_tap + '</div>'

          new_tap = new_tap + '<div class="col-md-3 col-sx-3 col-xs-6">'

          new_tap = new_tap + '<input type="datetime-local" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_fecha" class="form-control col-sm-3" value="' + Response["paneles"][v]['fehca_act'] + '" style="width: 100%;height: 25px;font-size: 11px;margin-left: 5px;" onchange="poner_valor_buscar_referencia_ficha(buscaPanel_' + Response["paneles"][v]['pkPanel'] + ',' + v + ')">'
          new_tap = new_tap + '</div>'

          new_tap = new_tap + '<div class="col-md-3 col-sx-3 col-xs-6">'

          new_tap = new_tap + '<input type="text" readonly="readonly" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '" class="form-control col-sm-3" value="" onchange="" style="width: 100%;height: 25px;font-size: 11px;margin-left: 0px;" placeholder="' + Response["paneles"][v]['tabla'] + '">'
          new_tap = new_tap + '</div>'

          new_tap = new_tap + '<input type="hidden" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_pk" value="' + Response["paneles"][v]['agrupar'] + '">'

          if (Response["paneles"][v]['adicional1'] == "") {
            new_tap = new_tap + '<input type="hidden" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_s" value="' + Response["paneles"][v]['agrupar'] + '">'
          } else {
            new_tap = new_tap + '<input type="hidden" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_s" value="' + Response["paneles"][v]['agrupar'] + ',' + Response["paneles"][v]['adicional1'] + '">'
          }
          new_tap = new_tap + '<input type="hidden" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_r" value="' + Response["paneles"][v]['valor'] + '">'
          new_tap = new_tap + '<input type="hidden" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_t" value="' + Response["paneles"][v]['tabla'] + '">'




          new_tap = new_tap + '<div class="col-md-3 col-sx-3 col-xs-6">'

          if (Response["paneles"][v]['new'] == "Directo") {

            new_tap = new_tap + '<button type="button" class="btn btn-info"  onclick="buscar_referencia_paneles_crear(' + Response["paneles"][v]['pkPanel'] + ')" style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 10px;"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button>'

          }

          new_tap = new_tap + '<button type="button" class="btn btn-info" data-toggle="modal" data-target="#modal-default_ficha"  onclick="buscar_referencia_paneles(buscaPanel_' + Response["paneles"][v]['pkPanel'] + ' )" style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></button>'

          new_tap = new_tap + '<button type="button" class="btn btn-info" onclick="pdf_paneles_entero(' + Response["paneles"][v]['pkPanel'] + ' )" style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 10px;margin-right: 0px;"><span class="glyphicon glyphicon-print"></span></button>'

          new_tap = new_tap + '<button type="button" class="btn btn-info" onclick="ficha_new(' + Response["paneles"][v]['pkPanel'] + ')" style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 10px;margin-right: 0px;"><span class="glyphicon glyphicon-floppy-save"></span></button>'

          new_tap = new_tap + '</div>'

          new_tap = new_tap + '</div>'





          new_tap = new_tap + '</div>'
          new_tap = new_tap + '</div>'
          new_tap = new_tap + '</div><!-- /.box-header -->'
          new_tap = new_tap + '</div>'
          new_tap = new_tap + '</div>'
          new_tap = new_tap + '</div>'

          new_tap = new_tap + '<div class="col-md-12" style="overflow: scroll;padding-left: 15px;" id="pfecha_int_panel' + Response["paneles"][v]['pkPanel'] + '"></div>'

          var panel = document.getElementById('vertical_izq')

          //new_tap = new_tap + '<div class="col-md-12" style="height: 500px;overflow: scroll;padding-left: 0px;">'
          new_tap = new_tap + '<div class="col-md-12" style="overflow: scroll;padding-left: 0px;">'

          new_tap = new_tap + '<div class="col-md-12" id="p_int_panel' + Response["paneles"][v]['pkPanel'] + '" style="padding-left: 0px;">'

          new_tap = new_tap + '</div>'
          new_tap = new_tap + '</div>'
        }
        if (Response["paneles"][v]['tipo'] == 'Imagen') {
          new_tap = new_tap + '<div class="col-md-12" style="padding-left: 0px;">'
          new_tap = new_tap + '<div class="box box-primary direct-chat direct-chat-primary" style="margin-bottom: 0px; padding-top: 0px;padding-bottom: 0px;"><div class="box box-info" style="margin-bottom: 0px;"><div class="box-header with-border" style="padding-top: 5px;padding-bottom: 0px;>'
          new_tap = new_tap + '<div class="row" style="padding-top: 15px;">'


          new_tap = new_tap + '<div class="col-md-3 col-sx-3 col-xs-3">'
          new_tap = new_tap + '<h3 class="box-title">' + Response["paneles"][v]['nombre'] + '</h3>'
          new_tap = new_tap + '</div>'


          new_tap = new_tap + '<input type="hidden" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_pk" value="' + Response["paneles"][v]['agrupar'] + '">'

          new_tap = new_tap + '<input type="hidden" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_s" value="' + Response["paneles"][v]['agrupar'] + '">'
          new_tap = new_tap + '<input type="hidden" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_r" value="' + Response["paneles"][v]['valor'] + '">'
          new_tap = new_tap + '<input type="hidden" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_t" value="' + Response["paneles"][v]['tabla'] + '">'


          new_tap = new_tap + '<div class="col-md-3 col-sx-3 col-xs-6">'

          new_tap = new_tap + '<select class="form-control col-sm-2" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '" style="width: 100%;height: 25px;font-size: 11px;margin-left: 0px;" onchange="poner_valor_buscar_referencia_ficha_imagen(buscaPanel_' + Response["paneles"][v]['pkPanel'] + ',' + v + ')">'
          var opciones_t = Response["paneles"][v]['valor'].split(',')

          //  new_tap = new_tap + '<option value="">'+Response["grupos_datos"][Response["paneles"][v]['pkPanel']][v2]['Valor']+'</option>'


          for (v2 = 0; v2 < Response["grupos_datos"][Response["paneles"][v]['pkPanel']].length; v2++) {
            new_tap = new_tap + '<option value="' + Response["grupos_datos"][Response["paneles"][v]['pkPanel']][v2]['Valor'] + '" selected>' + Response["grupos_datos"][Response["paneles"][v]['pkPanel']][v2]['Valor'] + '</option>'
          }


          new_tap = new_tap + '</select>'
          new_tap = new_tap + '</div>'
          new_tap = new_tap + '<div class="col-md-3 col-sx-3 col-xs-6">'

          new_tap = new_tap + '<input type="datetime-local" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_fecha" class="form-control col-sm-3" value="' + Response["paneles"][v]['fehca_act'] + '" style="width: 100%;height: 25px;font-size: 11px;margin-left: 5px;" onchange="poner_valor_buscar_referencia_ficha_imagen(buscaPanel_' + Response["paneles"][v]['pkPanel'] + ',' + v + ')">'

          new_tap = new_tap + '</div>'

          new_tap = new_tap + '<div class="col-md-1 col-sx-2 col-xs-2">'

          new_tap = new_tap + '<button type="button" class="btn btn-info" onclick="poner_valor_buscar_referencia_ficha_imagen_txt(buscaPanel_' + Response["paneles"][v]['pkPanel'] + ',' + v + ')" style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;"><span class="glyphicon glyphicon-refresh" aria-hidden="true"></span></button>'

          new_tap = new_tap + '</div>'

          new_tap = new_tap + '</div>'





          new_tap = new_tap + '</div><!-- /.box-header -->'
          new_tap = new_tap + '</div>'
          new_tap = new_tap + '</div>'
          new_tap = new_tap + '</div>'


          var panel = document.getElementById('vertical_izq')

          new_tap = new_tap + '<div class="col-md-12" style="height: 500px;overflow: scroll;padding-left: 15px; padding-left: 0px;">'

          //new_tap = new_tap + '<div class="col-md-12" style="height: 500px;overflow: scroll;padding-left: 15px; padding-left: 0px;">'

          new_tap = new_tap + '<div class="col-md-12" id="p_int_panel' + Response["paneles"][v]['pkPanel'] + '" style="padding-left: 0px;padding-left: 0px;">'



          // new_tap = new_tap + '<div id="myCanvas'+Response["paneles"][v]['pkPanel']+'" style="height: 500px"><img src="/media/archivos/'+web_Id_empresa+'/'+Response["paneles"][v]['adicional1']+'" class="img-fluid animated" alt="" style="position: absolute;" id="mapa_img_'+Response["paneles"][v]['pkPanel']+'"><div id="mapa_'+Response["paneles"][v]['pkPanel']+'">'
          //new_tap = new_tap + '<img src="/media/archivos/'+web_Id_empresa+'/'+Response["paneles"][v]['adicional1']+'" style="" id="mapa_img_'+Response["paneles"][v]['pkPanel']+'">'

          new_tap = new_tap + '<img src="/media/archivos/' + web_Id_empresa + '/' + Response["paneles"][v]['adicional1'] + '" style="display: none;" id="mapa_img_' + Response["paneles"][v]['pkPanel'] + '" data-toggle="modal" data-target="#modal-default_ficha_imagen" >'



          new_tap = new_tap + '<canvas id="mapa_' + Response["paneles"][v]['pkPanel'] + '" style="width: 100%;height: 100%" onClick="click_en_canvas_panel(' + Response["paneles"][v]['pkPanel'] + ')" onmousemove="mouse_over_click_en_canvas_panel(' + Response["paneles"][v]['pkPanel'] + ')">'



          //for (v3 = 0; v3 < Response["grupos_datos"][Response["paneles"][v]["pkPanel"]].length; v3++) {
          //  new_tap = new_tap + '<img src="/media/archivos/'+web_Id_empresa+'/'+Response["grupos_datos"][Response["paneles"][v]["pkPanel"]][v3]['imagen']+'" class="img-fluid animated" alt="" style="margin-left: '+Response["grupos_datos"][Response["paneles"][v]["pkPanel"]][v3]['X']+'px; margin-top: '+Response["grupos_datos"][Response["paneles"][v]["pkPanel"]][v3]['Y']+'px; position: absolute;" id="ficha_punto_'+Response["paneles"][v]['pkPanel']+'_'+Response["grupos_datos"][Response["paneles"][v]["pkPanel"]][v3]['pkid']+'">'

          //}
          //new_tap = new_tap +' </div></div>'      


          new_tap = new_tap + '</div>'
          new_tap = new_tap + '</div>'
        }

        if (Response["paneles"][v]['tipo'] == 'Reel_Vertical') {
          new_tap = new_tap + '<div class="row">'

          new_tap = new_tap + '<div class="col-md-12">'




          for (v2 = 0; v2 < Response["grupos"][Response["paneles"][v]["pkPanel"]].length; v2++) {
            display = Response["grupos"][Response["paneles"][v]["pkPanel"]][v2]['nombre']


            new_tap = new_tap + '<div class="col-md-' + parseInt(12 / Response["grupos"][Response["paneles"][v]["pkPanel"]].length) + '" style="padding-left: 0px;"><div class="box-header with-border" style="background: white;">'
            new_tap = new_tap + '<h3 class="box-title">' + display + '</h3><div class="box-tools"><button type="button" class="btn btn-box-tool" data-widget="collapse" onclick="paneles_taraer_auto(' + Response["paneles"][v]["pkPanel"] + ',' + Response["grupos"][Response["paneles"][v]["pkPanel"]][v2]["pkgrupo"] + ',' + v + ',' + Response["paneles"][v]["pkmodulo"] + ',' + v2 + ', 20000)" style="margin-top: 0px;padding-top: 8px;padding-bottom: 0px;"><i class="fa fa-fw fa-refresh"></i><div class="ripple-container"></div></button>'

            new_tap = new_tap + '<button type="button" class="btn btn-box-tool" style="margin-top: 0px;padding-top: 8px;padding-bottom: 0px;" data-widget="collapse" onclick="paneles_taraer_achicar_largo(this, intpestados' + v + '_' + v2 + ')"><i class="fa fa-fw fa-minus"></i><div class="ripple-container"></div></button>'


            new_tap = new_tap + '</div></div><div class="box-body no-padding" style="height: 400px;overflow: scroll;"  id="intpestados' + v + '_' + v2 + '">'



            new_tap = new_tap + '</div></div>'
          }
          new_tap = new_tap + '</div>'
          new_tap = new_tap + '</div>'
        }
        if (Response["paneles"][v]['tipo'] == 'Reel_Horizontal') {
          new_tap = new_tap + '<div class="row" style="margin-left: 0px;">'

          new_tap = new_tap + '<div class="col-md-12">'




          for (v2 = 0; v2 < Response["grupos"][Response["paneles"][v]["pkPanel"]].length; v2++) {
            display = Response["grupos"][Response["paneles"][v]["pkPanel"]][v2]['nombre']


            new_tap = new_tap + '<div class="row" ><div class="box-header with-border" style="background: white;">'
            new_tap = new_tap + '<h3 class="box-title">' + display + '</h3><div class="box-tools"><button type="button" class="btn btn-box-tool" data-widget="collapse" onclick="paneles_taraer_auto_hori(' + Response["paneles"][v]["pkPanel"] + ',' + Response["grupos"][Response["paneles"][v]["pkPanel"]][v2]["pkgrupo"] + ',' + v + ',' + Response["paneles"][v]["pkmodulo"] + ',' + v2 + ', 20000)" style="margin-top: 0px;padding-top: 8px;padding-bottom: 0px;"><i class="fa fa-fw fa-refresh"></i><div class="ripple-container"></div></button>'

            new_tap = new_tap + '<button type="button" class="btn btn-box-tool" style="margin-top: 0px;padding-top: 8px;padding-bottom: 0px;" data-widget="collapse" onclick="paneles_taraer_achicar(this, intpestados' + v + '_' + v2 + ')"><i class="fa fa-fw fa-minus"></i><div class="ripple-container"></div></button>'


            new_tap = new_tap + '</div></div><div class="box-body no-padding" style="height: 400px;overflow: scroll;"  id="intpestados' + v + '_' + v2 + '">'



            new_tap = new_tap + '</div></div>'
          }
          new_tap = new_tap + '</div>'
          new_tap = new_tap + '</div>'
        }
        if (Response["paneles"][v]['tipo'] == 'Agrupado') {
          new_tap = new_tap + '<div class="col-md-12">'
          new_tap = new_tap + '<div class="box box-primary direct-chat direct-chat-primary" style="margin-bottom: 0px;"><div class="box box-info" style="margin-bottom: 0px;"><div class="box-header with-border">'
          //new_tap = new_tap + '<h3 class="box-title">'+Response["paneles"][v]['nombre']+'</h3>'
          new_tap = new_tap + '<div class="box-header with-border" style="padding-top: 5px;">'
          new_tap = new_tap + '<div class="input-group input-group-sm" style="width: 100%;">'

          new_tap = new_tap + '<div class="row" style="text-align: right;">'



          new_tap = new_tap + '<div class="col-md-3 col-sx-3 col-xs-6">'


          if (Response["paneles"][v]['adicional1'] == "") {
            new_tap = new_tap + '<input type="text" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_codigo" readonly="readonly" class="form-control col-sm-3" value="" onchange="" style="width: 100%;height: 25px;font-size: 11px;margin-right: 5px;" placeholder="Codigo">'

          } else {
            new_tap = new_tap + '<input type="hidden" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_codigo" readonly="readonly" class="form-control col-sm-3" value="" onchange="" style="width: 100%;height: 25px;font-size: 11px;margin-right: 5px;" placeholder="Codigo">'
            new_tap = new_tap + '<input type="text" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_filtro" class="form-control col-sm-3" value="" onchange="buscar_referencia_paneles_filtrar_directo(' + Response["paneles"][v]['pkPanel'] + ', \'' + Response["paneles"][v]['agrupar'] + '\', \'' + Response["paneles"][v]['tabla'] + '\' , \'' + Response["paneles"][v]['adicional1'] + '\')" style="width: 100%;height: 25px;font-size: 11px;margin-right: 5px;" placeholder="' + Response["paneles"][v]['adicional1'] + '">'


          }



          new_tap = new_tap + '</div>'

          new_tap = new_tap + '<div class="col-md-3 col-sx-3 col-xs-6">'

          new_tap = new_tap + '<input type="datetime-local" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_fecha" class="form-control col-sm-3" value="' + Response["paneles"][v]['fehca_act'] + '" style="width: 100%;height: 25px;font-size: 11px;margin-left: 5px;" onchange="poner_valor_buscar_referencia_ficha(buscaPanel_' + Response["paneles"][v]['pkPanel'] + ',' + v + ')">'
          new_tap = new_tap + '</div>'

          new_tap = new_tap + '<div class="col-md-3 col-sx-3 col-xs-6">'

          new_tap = new_tap + '<input type="text" readonly="readonly" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '" class="form-control col-sm-3" value="" onchange="" style="width: 100%;height: 25px;font-size: 11px;margin-left: 0px;" placeholder="' + Response["paneles"][v]['tabla'] + '">'
          new_tap = new_tap + '</div>'

          new_tap = new_tap + '<input type="hidden" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_pk" value="' + Response["paneles"][v]['agrupar'] + '">'

          if (Response["paneles"][v]['adicional1'] == "") {
            new_tap = new_tap + '<input type="hidden" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_s" value="' + Response["paneles"][v]['agrupar'] + '">'
          } else {
            new_tap = new_tap + '<input type="hidden" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_s" value="' + Response["paneles"][v]['agrupar'] + ',' + Response["paneles"][v]['adicional1'] + '">'
          }
          new_tap = new_tap + '<input type="hidden" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_r" value="' + Response["paneles"][v]['valor'] + '">'
          new_tap = new_tap + '<input type="hidden" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_t" value="' + Response["paneles"][v]['tabla'] + '">'




          new_tap = new_tap + '<div class="col-md-3 col-sx-3 col-xs-6">'

          new_tap = new_tap + '<button type="button" class="btn btn-info" data-toggle="modal" data-target="#modal-default_ficha"  onclick="buscar_referencia_paneles(buscaPanel_' + Response["paneles"][v]['pkPanel'] + ' )" style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></button>'

          new_tap = new_tap + '<button type="button" class="btn btn-info" onclick="pdf_paneles_entero(' + Response["paneles"][v]['pkPanel'] + ' )" style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 10px;margin-right: 0px;"><span class="glyphicon glyphicon-print"></span></button>'

          new_tap = new_tap + '<button type="button" class="btn btn-info" onclick="ficha_new(' + Response["paneles"][v]['pkPanel'] + ')" style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 10px;margin-right: 0px;"><span class="glyphicon glyphicon-floppy-save"></span></button>'

          new_tap = new_tap + '</div>'

          new_tap = new_tap + '</div>'





          new_tap = new_tap + '</div>'
          new_tap = new_tap + '</div>'
          new_tap = new_tap + '</div><!-- /.box-header -->'
          new_tap = new_tap + '</div>'
          new_tap = new_tap + '</div>'
          new_tap = new_tap + '</div>'

          new_tap = new_tap + '<div class="col-md-12" style="overflow: scroll;padding-left: 15px;" id="pfecha_int_panel' + Response["paneles"][v]['pkPanel'] + '"></div>'

          var panel = document.getElementById('vertical_izq')

          //new_tap = new_tap + '<div class="col-md-12" style="height: 500px;overflow: scroll;padding-left: 0px;">'
          new_tap = new_tap + '<div class="col-md-12" style="overflow: scroll;padding-left: 0px;">'

          new_tap = new_tap + '<div class="col-md-12" id="p_int_panel' + Response["paneles"][v]['pkPanel'] + '" style="padding-left: 0px;">'

          new_tap = new_tap + '</div>'
          new_tap = new_tap + '</div>'
        }
        new_tap = new_tap + '</section>'

        var panel_est = document.getElementById("pestados" + v)
        panel_est.innerHTML = new_tap


        for (v2 = 0; v2 < Response["grupos"][Response["paneles"][v]["pkPanel"]].length; v2++) {
          if (Response["paneles"][v]['tipo'] == 'Reel_Horizontal') {
            paneles_taraer_auto_hori(Response["paneles"][v]["pkPanel"], Response["grupos"][Response["paneles"][v]["pkPanel"]][v2]["pkgrupo"], v, Response["paneles"][v]["pkmodulo"], v2, 20000)
          } else {
            paneles_taraer_auto(Response["paneles"][v]["pkPanel"], Response["grupos"][Response["paneles"][v]["pkPanel"]][v2]["pkgrupo"], v, Response["paneles"][v]["pkmodulo"], v2, 20000)
          }
        }


        if (Response["paneles"][v]['tipo'] == 'Imagen') {
          var fecha_now = new Date();
          if (Response["grupos_datos"][Response["paneles"][v]['pkPanel']].length > 0) {
            //poner_valor_buscar_referencia_ficha_imagen_txt(Response["paneles"][v]['pkPanel'],Response["grupos_datos"][Response["paneles"][v]['pkPanel']][0]['Valor'],fecha_now.format("Y-m-d") )

          }

        }


      }
    }
  });
}

function actualizar_paneles() {
  $.ajax({
    type: 'POST',
    url: '/paneles_carga',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma },
    success: function (Response) {

      for (v = 0; v < Response["paneles"].length; v++) {
        new_tap = '<section class="content">'
        if (Response["paneles"][v]['tipo'] == 'Estado') {
          new_tap = new_tap + '<div class="row">'
          new_tap = new_tap + '<div class="col-md-3"><div class="box box-solid"><div class="box-header with-border">'
          new_tap = new_tap + '<h3 class="box-title">*' + Response["paneles"][v]["grupos_nom"] + '</h3><div class="box-tools"><button type="button" class="btn btn-box-tool" data-widget="collapse" onclick="actualizar_paneles()"><i class="fa fa-fw fa-refresh"></i><div class="ripple-container"></div></button></div></div><div class="box-body no-padding" style=""><ul class="nav nav-pills nav-stacked" id="ppanel' + Response["paneles"][v]["pkPanel"] + '">'


          for (v2 = 0; v2 < Response["grupos"][Response["paneles"][v]["pkPanel"]].length; v2++) {
            display = ''

            if (Response["paneles"][v]["agrupar"] == '$directo') {
              display = Response["grupos_datos"][Response["paneles"][v]['pkPanel']][v2]['Display']

            } else {
              if (Response["paneles"][v]["agrupar"] == '') {
                display = Response["grupos_datos"][Response["paneles"][v]['pkPanel']][v2]['Display']
              } else {

                for (v3 = 0; v3 < Response["grupos_datos"][Response["paneles"][v]["pkPanel"]].length; v3++) {
                  if (Response["grupos_datos"][Response["paneles"][v]["pkPanel"]][v3]['Campo'] == Response["grupos"][Response["paneles"][v]["pkPanel"]][v2]['Valor']) { display = Response["grupos_datos"][Response["paneles"][v]["pkPanel"]][v3]['Display'] }
                }

              }

            }


            new_tap = new_tap + '<li style="cursor: pointer;" onclick="paneles_taraer(' + Response["paneles"][v]["pkPanel"] + ',' + Response["grupos"][Response["paneles"][v]["pkPanel"]][v2]["pkgrupo"] + ',' + v + ',' + Response["paneles"][v]["pkmodulo"] + ')"><a><i class="fa fa-file-text-o"></i>' + Response["grupos"][Response["paneles"][v]["pkPanel"]][v2]['nombre'] + ' <small class="pull-right">' + display + '</small></a></li>'
          }
          new_tap = new_tap + '</ul></div></div></div>'
          new_tap = new_tap + '<div class="col-md-9"> <div id="intpestados' + v + '"></div></div>'
          new_tap = new_tap + '</div>'
        }
        if (Response["paneles"][v]['tipo'] == 'Ficha') {
          new_tap = new_tap + '<div class="col-md-12">'
          new_tap = new_tap + '<div class="box box-primary direct-chat direct-chat-primary" style="margin-bottom: 0px;"><div class="box box-info" style="margin-bottom: 0px;"><div class="box-header with-border">'
          //new_tap = new_tap + '<h3 class="box-title">'+Response["paneles"][v]['nombre']+'</h3>'
          new_tap = new_tap + '<div class="box-header with-border" style="padding-top: 5px;">'
          new_tap = new_tap + '<div class="input-group input-group-sm" style="width: 100%;">'

          new_tap = new_tap + '<div class="row" style="text-align: right;">'



          new_tap = new_tap + '<div class="col-md-3 col-sx-3 col-xs-6">'


          if (Response["paneles"][v]['adicional1'] == "") {
            new_tap = new_tap + '<input type="text" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_codigo" readonly="readonly" class="form-control col-sm-3" value="" onchange="" style="width: 100%;height: 25px;font-size: 11px;margin-right: 5px;" placeholder="Codigo">'
            if (Response["paneles"][v]['new'] == "Directo") {
              new_tap = new_tap + '<input type="hidden" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_filtro" class="form-control col-sm-3" value="" onchange="buscar_referencia_paneles_filtrar_directo(' + Response["paneles"][v]['pkPanel'] + ', \'' + Response["paneles"][v]['agrupar'] + '\', \'' + Response["paneles"][v]['tabla'] + '\' , \'' + Response["paneles"][v]['adicional1'] + '\')" style="width: 100%;height: 25px;font-size: 11px;margin-right: 5px;" placeholder="' + Response["paneles"][v]['adicional1'] + '">'
            }


          } else {
            new_tap = new_tap + '<input type="hidden" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_codigo" readonly="readonly" class="form-control col-sm-3" value="" onchange="" style="width: 100%;height: 25px;font-size: 11px;margin-right: 5px;" placeholder="Codigo">'
            new_tap = new_tap + '<input type="text" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_filtro" class="form-control col-sm-3" value="" onchange="buscar_referencia_paneles_filtrar_directo(' + Response["paneles"][v]['pkPanel'] + ', \'' + Response["paneles"][v]['agrupar'] + '\', \'' + Response["paneles"][v]['tabla'] + '\' , \'' + Response["paneles"][v]['adicional1'] + '\')" style="width: 100%;height: 25px;font-size: 11px;margin-right: 5px;" placeholder="' + Response["paneles"][v]['adicional1'] + '">'


          }



          new_tap = new_tap + '</div>'

          new_tap = new_tap + '<div class="col-md-3 col-sx-3 col-xs-6">'

          new_tap = new_tap + '<input type="datetime-local" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_fecha" class="form-control col-sm-3" value="' + Response["paneles"][v]['fehca_act'] + '" style="width: 100%;height: 25px;font-size: 11px;margin-left: 5px;" onchange="poner_valor_buscar_referencia_ficha(buscaPanel_' + Response["paneles"][v]['pkPanel'] + ',' + v + ')">'
          new_tap = new_tap + '</div>'

          new_tap = new_tap + '<div class="col-md-3 col-sx-3 col-xs-6">'

          new_tap = new_tap + '<input type="text" readonly="readonly" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '" class="form-control col-sm-3" value="" onchange="" style="width: 100%;height: 25px;font-size: 11px;margin-left: 0px;" placeholder="' + Response["paneles"][v]['tabla'] + '">'
          new_tap = new_tap + '</div>'

          new_tap = new_tap + '<input type="hidden" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_pk" value="' + Response["paneles"][v]['agrupar'] + '">'

          if (Response["paneles"][v]['adicional1'] == "") {
            new_tap = new_tap + '<input type="hidden" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_s" value="' + Response["paneles"][v]['agrupar'] + '">'
          } else {
            new_tap = new_tap + '<input type="hidden" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_s" value="' + Response["paneles"][v]['agrupar'] + ',' + Response["paneles"][v]['adicional1'] + '">'
          }
          new_tap = new_tap + '<input type="hidden" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_r" value="' + Response["paneles"][v]['valor'] + '">'
          new_tap = new_tap + '<input type="hidden" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_t" value="' + Response["paneles"][v]['tabla'] + '">'




          new_tap = new_tap + '<div class="col-md-3 col-sx-3 col-xs-6">'

          if (Response["paneles"][v]['new'] == "Directo") {

            new_tap = new_tap + '<button type="button" class="btn btn-info"  onclick="buscar_referencia_paneles_crear(' + Response["paneles"][v]['pkPanel'] + ')" style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 10px;"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button>'

          }

          new_tap = new_tap + '<button type="button" class="btn btn-info" data-toggle="modal" data-target="#modal-default_ficha"  onclick="buscar_referencia_paneles(buscaPanel_' + Response["paneles"][v]['pkPanel'] + ' )" style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></button>'

          new_tap = new_tap + '<button type="button" class="btn btn-info" onclick="pdf_paneles_entero(' + Response["paneles"][v]['pkPanel'] + ' )" style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 10px;margin-right: 0px;"><span class="glyphicon glyphicon-print"></span></button>'

          new_tap = new_tap + '<button type="button" class="btn btn-info" onclick="ficha_new(' + Response["paneles"][v]['pkPanel'] + ')" style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 10px;margin-right: 0px;"><span class="glyphicon glyphicon-floppy-save"></span></button>'

          new_tap = new_tap + '</div>'

          new_tap = new_tap + '</div>'





          new_tap = new_tap + '</div>'
          new_tap = new_tap + '</div>'
          new_tap = new_tap + '</div><!-- /.box-header -->'
          new_tap = new_tap + '</div>'
          new_tap = new_tap + '</div>'
          new_tap = new_tap + '</div>'

          new_tap = new_tap + '<div class="col-md-12" style="overflow: scroll;padding-left: 15px;" id="pfecha_int_panel' + Response["paneles"][v]['pkPanel'] + '"></div>'

          var panel = document.getElementById('vertical_izq')

          //new_tap = new_tap + '<div class="col-md-12" style="height: 500px;overflow: scroll;padding-left: 0px;">'
          new_tap = new_tap + '<div class="col-md-12" style="overflow: scroll;padding-left: 0px;">'

          new_tap = new_tap + '<div class="col-md-12" id="p_int_panel' + Response["paneles"][v]['pkPanel'] + '" style="padding-left: 0px;">'

          new_tap = new_tap + '</div>'
          new_tap = new_tap + '</div>'
        }
        if (Response["paneles"][v]['tipo'] == 'Imagen') {
          new_tap = new_tap + '<div class="col-md-12" style="padding-left: 0px;">'
          new_tap = new_tap + '<div class="box box-primary direct-chat direct-chat-primary" style="margin-bottom: 0px; padding-top: 0px;padding-bottom: 0px;"><div class="box box-info" style="margin-bottom: 0px;"><div class="box-header with-border" style="padding-top: 5px;padding-bottom: 0px;>'
          new_tap = new_tap + '<div class="row" style="padding-top: 15px;">'


          new_tap = new_tap + '<div class="col-md-3 col-sx-3 col-xs-3">'
          new_tap = new_tap + '<h3 class="box-title">' + Response["paneles"][v]['nombre'] + '</h3>'
          new_tap = new_tap + '</div>'


          new_tap = new_tap + '<input type="hidden" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_pk" value="' + Response["paneles"][v]['agrupar'] + '">'

          new_tap = new_tap + '<input type="hidden" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_s" value="' + Response["paneles"][v]['agrupar'] + '">'
          new_tap = new_tap + '<input type="hidden" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_r" value="' + Response["paneles"][v]['valor'] + '">'
          new_tap = new_tap + '<input type="hidden" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_t" value="' + Response["paneles"][v]['tabla'] + '">'


          new_tap = new_tap + '<div class="col-md-3 col-sx-3 col-xs-6">'

          new_tap = new_tap + '<select class="form-control col-sm-2" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '" style="width: 100%;height: 25px;font-size: 11px;margin-left: 0px;" onchange="poner_valor_buscar_referencia_ficha_imagen(buscaPanel_' + Response["paneles"][v]['pkPanel'] + ',' + v + ')">'
          var opciones_t = Response["paneles"][v]['valor'].split(',')

          //  new_tap = new_tap + '<option value="">'+Response["grupos_datos"][Response["paneles"][v]['pkPanel']][v2]['Valor']+'</option>'


          for (v2 = 0; v2 < Response["grupos_datos"][Response["paneles"][v]['pkPanel']].length; v2++) {
            new_tap = new_tap + '<option value="' + Response["grupos_datos"][Response["paneles"][v]['pkPanel']][v2]['Valor'] + '" selected>' + Response["grupos_datos"][Response["paneles"][v]['pkPanel']][v2]['Valor'] + '</option>'
          }


          new_tap = new_tap + '</select>'
          new_tap = new_tap + '</div>'
          new_tap = new_tap + '<div class="col-md-3 col-sx-3 col-xs-6">'

          new_tap = new_tap + '<input type="datetime-local" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_fecha" class="form-control col-sm-3" value="' + Response["paneles"][v]['fehca_act'] + '" style="width: 100%;height: 25px;font-size: 11px;margin-left: 5px;" onchange="poner_valor_buscar_referencia_ficha_imagen(buscaPanel_' + Response["paneles"][v]['pkPanel'] + ',' + v + ')">'

          new_tap = new_tap + '</div>'

          new_tap = new_tap + '<div class="col-md-1 col-sx-2 col-xs-2">'

          new_tap = new_tap + '<button type="button" class="btn btn-info" onclick="poner_valor_buscar_referencia_ficha_imagen_txt(buscaPanel_' + Response["paneles"][v]['pkPanel'] + ',' + v + ')" style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;"><span class="glyphicon glyphicon-refresh" aria-hidden="true"></span></button>'

          new_tap = new_tap + '</div>'

          new_tap = new_tap + '</div>'





          new_tap = new_tap + '</div><!-- /.box-header -->'
          new_tap = new_tap + '</div>'
          new_tap = new_tap + '</div>'
          new_tap = new_tap + '</div>'


          var panel = document.getElementById('vertical_izq')

          new_tap = new_tap + '<div class="col-md-12" style="height: 500px;overflow: scroll;padding-left: 15px; padding-left: 0px;">'

          //new_tap = new_tap + '<div class="col-md-12" style="height: 500px;overflow: scroll;padding-left: 15px; padding-left: 0px;">'

          new_tap = new_tap + '<div class="col-md-12" id="p_int_panel' + Response["paneles"][v]['pkPanel'] + '" style="padding-left: 0px;padding-left: 0px;">'



          // new_tap = new_tap + '<div id="myCanvas'+Response["paneles"][v]['pkPanel']+'" style="height: 500px"><img src="/media/archivos/'+web_Id_empresa+'/'+Response["paneles"][v]['adicional1']+'" class="img-fluid animated" alt="" style="position: absolute;" id="mapa_img_'+Response["paneles"][v]['pkPanel']+'"><div id="mapa_'+Response["paneles"][v]['pkPanel']+'">'
          //new_tap = new_tap + '<img src="/media/archivos/'+web_Id_empresa+'/'+Response["paneles"][v]['adicional1']+'" style="" id="mapa_img_'+Response["paneles"][v]['pkPanel']+'">'

          new_tap = new_tap + '<img src="/media/archivos/' + web_Id_empresa + '/' + Response["paneles"][v]['adicional1'] + '" style="display: none;" id="mapa_img_' + Response["paneles"][v]['pkPanel'] + '" data-toggle="modal" data-target="#modal-default_ficha_imagen" >'



          new_tap = new_tap + '<canvas id="mapa_' + Response["paneles"][v]['pkPanel'] + '" style="width: 100%;height: 100%" onClick="click_en_canvas_panel(' + Response["paneles"][v]['pkPanel'] + ')" onmousemove="mouse_over_click_en_canvas_panel(' + Response["paneles"][v]['pkPanel'] + ')">'



          //for (v3 = 0; v3 < Response["grupos_datos"][Response["paneles"][v]["pkPanel"]].length; v3++) {
          //  new_tap = new_tap + '<img src="/media/archivos/'+web_Id_empresa+'/'+Response["grupos_datos"][Response["paneles"][v]["pkPanel"]][v3]['imagen']+'" class="img-fluid animated" alt="" style="margin-left: '+Response["grupos_datos"][Response["paneles"][v]["pkPanel"]][v3]['X']+'px; margin-top: '+Response["grupos_datos"][Response["paneles"][v]["pkPanel"]][v3]['Y']+'px; position: absolute;" id="ficha_punto_'+Response["paneles"][v]['pkPanel']+'_'+Response["grupos_datos"][Response["paneles"][v]["pkPanel"]][v3]['pkid']+'">'

          //}
          //new_tap = new_tap +' </div></div>'      


          new_tap = new_tap + '</div>'
          new_tap = new_tap + '</div>'
        }

        if (Response["paneles"][v]['tipo'] == 'Reel_Vertical') {
          new_tap = new_tap + '<div class="row">'

          new_tap = new_tap + '<div class="col-md-12">'




          for (v2 = 0; v2 < Response["grupos"][Response["paneles"][v]["pkPanel"]].length; v2++) {
            display = Response["grupos"][Response["paneles"][v]["pkPanel"]][v2]['nombre']


            new_tap = new_tap + '<div class="col-md-' + parseInt(12 / Response["grupos"][Response["paneles"][v]["pkPanel"]].length) + '" style="padding-left: 0px;"><div class="box-header with-border" style="background: white;">'
            new_tap = new_tap + '<h3 class="box-title">' + display + '</h3><div class="box-tools"><button type="button" class="btn btn-box-tool" data-widget="collapse" onclick="paneles_taraer_auto(' + Response["paneles"][v]["pkPanel"] + ',' + Response["grupos"][Response["paneles"][v]["pkPanel"]][v2]["pkgrupo"] + ',' + v + ',' + Response["paneles"][v]["pkmodulo"] + ',' + v2 + ', 20000)" style="margin-top: 0px;padding-top: 8px;padding-bottom: 0px;"><i class="fa fa-fw fa-refresh"></i><div class="ripple-container"></div></button>'

            new_tap = new_tap + '<button type="button" class="btn btn-box-tool" style="margin-top: 0px;padding-top: 8px;padding-bottom: 0px;" data-widget="collapse" onclick="paneles_taraer_achicar_largo(this, intpestados' + v + '_' + v2 + ')"><i class="fa fa-fw fa-minus"></i><div class="ripple-container"></div></button>'


            new_tap = new_tap + '</div></div><div class="box-body no-padding" style="height: 400px;overflow: scroll;"  id="intpestados' + v + '_' + v2 + '">'



            new_tap = new_tap + '</div></div>'
          }
          new_tap = new_tap + '</div>'
          new_tap = new_tap + '</div>'
        }
        if (Response["paneles"][v]['tipo'] == 'Reel_Horizontal') {
          new_tap = new_tap + '<div class="row" style="margin-left: 0px;">'

          new_tap = new_tap + '<div class="col-md-12">'




          for (v2 = 0; v2 < Response["grupos"][Response["paneles"][v]["pkPanel"]].length; v2++) {
            display = Response["grupos"][Response["paneles"][v]["pkPanel"]][v2]['nombre']


            new_tap = new_tap + '<div class="row" ><div class="box-header with-border" style="background: white;">'
            new_tap = new_tap + '<h3 class="box-title">' + display + '</h3><div class="box-tools"><button type="button" class="btn btn-box-tool" data-widget="collapse" onclick="paneles_taraer_auto_hori(' + Response["paneles"][v]["pkPanel"] + ',' + Response["grupos"][Response["paneles"][v]["pkPanel"]][v2]["pkgrupo"] + ',' + v + ',' + Response["paneles"][v]["pkmodulo"] + ',' + v2 + ', 20000)" style="margin-top: 0px;padding-top: 8px;padding-bottom: 0px;"><i class="fa fa-fw fa-refresh"></i><div class="ripple-container"></div></button>'

            new_tap = new_tap + '<button type="button" class="btn btn-box-tool" style="margin-top: 0px;padding-top: 8px;padding-bottom: 0px;" data-widget="collapse" onclick="paneles_taraer_achicar(this, intpestados' + v + '_' + v2 + ')"><i class="fa fa-fw fa-minus"></i><div class="ripple-container"></div></button>'


            new_tap = new_tap + '</div></div><div class="box-body no-padding" style="height: 400px;overflow: scroll;"  id="intpestados' + v + '_' + v2 + '">'



            new_tap = new_tap + '</div></div>'
          }
          new_tap = new_tap + '</div>'
          new_tap = new_tap + '</div>'
        }
        if (Response["paneles"][v]['tipo'] == 'Agrupado') {
          new_tap = new_tap + '<div class="col-md-12">'
          new_tap = new_tap + '<div class="box box-primary direct-chat direct-chat-primary" style="margin-bottom: 0px;"><div class="box box-info" style="margin-bottom: 0px;"><div class="box-header with-border">'
          //new_tap = new_tap + '<h3 class="box-title">'+Response["paneles"][v]['nombre']+'</h3>'
          new_tap = new_tap + '<div class="box-header with-border" style="padding-top: 5px;">'
          new_tap = new_tap + '<div class="input-group input-group-sm" style="width: 100%;">'

          new_tap = new_tap + '<div class="row" style="text-align: right;">'



          new_tap = new_tap + '<div class="col-md-3 col-sx-3 col-xs-6">'


          if (Response["paneles"][v]['adicional1'] == "") {
            new_tap = new_tap + '<input type="text" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_codigo" readonly="readonly" class="form-control col-sm-3" value="" onchange="" style="width: 100%;height: 25px;font-size: 11px;margin-right: 5px;" placeholder="Codigo">'

          } else {
            new_tap = new_tap + '<input type="hidden" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_codigo" readonly="readonly" class="form-control col-sm-3" value="" onchange="" style="width: 100%;height: 25px;font-size: 11px;margin-right: 5px;" placeholder="Codigo">'
            new_tap = new_tap + '<input type="text" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_filtro" class="form-control col-sm-3" value="" onchange="buscar_referencia_paneles_filtrar_directo(' + Response["paneles"][v]['pkPanel'] + ', \'' + Response["paneles"][v]['agrupar'] + '\', \'' + Response["paneles"][v]['tabla'] + '\' , \'' + Response["paneles"][v]['adicional1'] + '\')" style="width: 100%;height: 25px;font-size: 11px;margin-right: 5px;" placeholder="' + Response["paneles"][v]['adicional1'] + '">'


          }



          new_tap = new_tap + '</div>'

          new_tap = new_tap + '<div class="col-md-3 col-sx-3 col-xs-6">'

          new_tap = new_tap + '<input type="datetime-local" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_fecha" class="form-control col-sm-3" value="' + Response["paneles"][v]['fehca_act'] + '" style="width: 100%;height: 25px;font-size: 11px;margin-left: 5px;" onchange="poner_valor_buscar_referencia_ficha(buscaPanel_' + Response["paneles"][v]['pkPanel'] + ',' + v + ')">'
          new_tap = new_tap + '</div>'

          new_tap = new_tap + '<div class="col-md-3 col-sx-3 col-xs-6">'

          new_tap = new_tap + '<input type="text" readonly="readonly" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '" class="form-control col-sm-3" value="" onchange="" style="width: 100%;height: 25px;font-size: 11px;margin-left: 0px;" placeholder="' + Response["paneles"][v]['tabla'] + '">'
          new_tap = new_tap + '</div>'

          new_tap = new_tap + '<input type="hidden" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_pk" value="' + Response["paneles"][v]['agrupar'] + '">'

          if (Response["paneles"][v]['adicional1'] == "") {
            new_tap = new_tap + '<input type="hidden" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_s" value="' + Response["paneles"][v]['agrupar'] + '">'
          } else {
            new_tap = new_tap + '<input type="hidden" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_s" value="' + Response["paneles"][v]['agrupar'] + ',' + Response["paneles"][v]['adicional1'] + '">'
          }
          new_tap = new_tap + '<input type="hidden" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_r" value="' + Response["paneles"][v]['valor'] + '">'
          new_tap = new_tap + '<input type="hidden" id="buscaPanel_' + Response["paneles"][v]['pkPanel'] + '_t" value="' + Response["paneles"][v]['tabla'] + '">'




          new_tap = new_tap + '<div class="col-md-3 col-sx-3 col-xs-6">'

          new_tap = new_tap + '<button type="button" class="btn btn-info" data-toggle="modal" data-target="#modal-default_ficha"  onclick="buscar_referencia_paneles(buscaPanel_' + Response["paneles"][v]['pkPanel'] + ' )" style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></button>'

          new_tap = new_tap + '<button type="button" class="btn btn-info" onclick="pdf_paneles_entero(' + Response["paneles"][v]['pkPanel'] + ' )" style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 10px;margin-right: 0px;"><span class="glyphicon glyphicon-print"></span></button>'

          new_tap = new_tap + '<button type="button" class="btn btn-info" onclick="ficha_new(' + Response["paneles"][v]['pkPanel'] + ')" style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 10px;margin-right: 0px;"><span class="glyphicon glyphicon-floppy-save"></span></button>'

          new_tap = new_tap + '</div>'

          new_tap = new_tap + '</div>'





          new_tap = new_tap + '</div>'
          new_tap = new_tap + '</div>'
          new_tap = new_tap + '</div><!-- /.box-header -->'
          new_tap = new_tap + '</div>'
          new_tap = new_tap + '</div>'
          new_tap = new_tap + '</div>'

          new_tap = new_tap + '<div class="col-md-12" style="overflow: scroll;padding-left: 15px;" id="pfecha_int_panel' + Response["paneles"][v]['pkPanel'] + '"></div>'

          var panel = document.getElementById('vertical_izq')

          //new_tap = new_tap + '<div class="col-md-12" style="height: 500px;overflow: scroll;padding-left: 0px;">'
          new_tap = new_tap + '<div class="col-md-12" style="overflow: scroll;padding-left: 0px;">'

          new_tap = new_tap + '<div class="col-md-12" id="p_int_panel' + Response["paneles"][v]['pkPanel'] + '" style="padding-left: 0px;">'

          new_tap = new_tap + '</div>'
          new_tap = new_tap + '</div>'
        }
        new_tap = new_tap + '</section>'

        var panel_est = document.getElementById("pestados" + v)
        panel_est.innerHTML = new_tap


        for (v2 = 0; v2 < Response["grupos"][Response["paneles"][v]["pkPanel"]].length; v2++) {
          if (Response["paneles"][v]['tipo'] == 'Reel_Horizontal') {
            paneles_taraer_auto_hori(Response["paneles"][v]["pkPanel"], Response["grupos"][Response["paneles"][v]["pkPanel"]][v2]["pkgrupo"], v, Response["paneles"][v]["pkmodulo"], v2, 20000)
          } else {
            //paneles_taraer_auto(Response["paneles"][v]["pkPanel"], Response["grupos"][Response["paneles"][v]["pkPanel"]][v2]["pkgrupo"], v, Response["paneles"][v]["pkmodulo"], v2, 20000)

          }
        }


        if (Response["paneles"][v]['tipo'] == 'Imagen') {
          var fecha_now = new Date();
          if (Response["grupos_datos"][Response["paneles"][v]['pkPanel']].length > 0) {
            //poner_valor_buscar_referencia_ficha_imagen_txt(Response["paneles"][v]['pkPanel'],Response["grupos_datos"][Response["paneles"][v]['pkPanel']][0]['Valor'],fecha_now.format("Y-m-d") )

          }

        }


      }
    }
  });

}


function actualizar_paneles_viejo() {


  $.ajax({
    type: 'POST',
    url: '/cargar_paneles',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma },
    beforeSend: function () {
    },
    success: function (Response) {


      for (x = 0; x < Response["paneles"].length; x++) {

        new_tap = ''


        for (x2 = 0; x2 < Response["estados"][Response["paneles"][x]["pkpanel"]].length; x2++) {
          new_tap = new_tap + '<div class="col-md-3 col-xs-8" style="display: inline-block;float: none;">'
          new_tap = new_tap + '<div class="box box-primary direct-chat direct-chat-primary">'

          new_tap = new_tap + '<div class="box-header with-border">'
          new_tap = new_tap + ' <h2>' + Response["estados"][Response["paneles"][x]["pkpanel"]][x2]["nombre"] + '</h2>'
          new_tap = new_tap + ' <div class="clearfix"></div></div>'

          new_tap = new_tap + ' <div class="box-body" style="height: 600px;overflow: scroll;">'
          new_tap = new_tap + '   <div class="dashboard-widget-content">'
          new_tap = new_tap + '     <ul class="list-unstyled timeline widget" id="ul_estadopk' + Response["estados"][Response["paneles"][x]["pkpanel"]][x2]["pkestado"] + '">'

          for (x3 = 0; x3 < Response["notas"][Response["estados"][Response["paneles"][x]["pkpanel"]][x2]["pkestado"]].length; x3++) {

            new_tap = new_tap + '       <li id="li_notapkzbz' + Response["notas"][Response["estados"][Response["paneles"][x]["pkpanel"]][x2]["pkestado"]][x3]["pk"] + 'zbz' + Response["notas"][Response["estados"][Response["paneles"][x]["pkpanel"]][x2]["pkestado"]][x3]["fuente"] + '">'

            new_tap = new_tap + '<div class="timeline-item"> <button type="button" style="width: 100%;font-size: 10px;" class="btn-primary" data-toggle="modal" data-target="#modal-default" onclick="abrir_nota(li_notapkzbz' + Response["notas"][Response["estados"][Response["paneles"][x]["pkpanel"]][x2]["pkestado"]][x3]["pk"] + 'zbz' + Response["notas"][Response["estados"][Response["paneles"][x]["pkpanel"]][x2]["pkestado"]][x3]["fuente"] + ', ' + Response["estados"][Response["paneles"][x]["pkpanel"]][x2]["pkmodulo"] + ')">' + Response["notas"][Response["estados"][Response["paneles"][x]["pkpanel"]][x2]["pkestado"]][x3]["display"] + '</button></div>'


            new_tap = new_tap + '       </li>'
          }


          new_tap = new_tap + '     </ul>'
          new_tap = new_tap + '   </div>'
          new_tap = new_tap + ' </div>'
          new_tap = new_tap + '</div></div>'
        }

        var panel_est = document.getElementById("pestados" + x)
        panel_est.innerHTML = new_tap
      }

    }
  });
}

function timerIncrement() {
  idleTime = idleTime + 1;




}
idleTime = 0
solo_time = 0

function timerIncrement() {
  idleTime = idleTime + 1;
  solo_time = solo_time + 1;

  if (solo_time == 5) {

    $.ajax({
      type: 'POST',
      url: '/logrep',
      data: { 'csrfmiddlewaretoken': web_token, 'userc_name': 0, 'us_idleTime': solo_time, 'us_home': web_Id_empresa },
      success: function (response) { }
    });
  }
  if (solo_time == 10) {
    $.ajax({
      type: 'POST',
      url: '/logrep',
      data: { 'csrfmiddlewaretoken': web_token, 'userc_name': 0, 'us_idleTime': solo_time, 'us_home': web_Id_empresa },
      success: function (response) { }
    });
  }



  if (idleTime > (60 * 6)) { // 20 minutes
    window.open("https://www.cerocodigo.com/esp/log", "_self");
  }
}






$(document).ready(function () {



  //Increment the idle time counter every minute.
  var idleInterval = setInterval(timerIncrement, 60000); // 1 minute

  //Zero the idle timer on mouse movement.
  $(this).mousemove(function (e) {
    idleTime = 0;
  });


  $(".opciones_list").click(function (e) {
    window.open("log/opciones/Ingresar/" + $(this).attr("id") + "/", '_blank');
  });
  $(".dropdown-item").click(function (e) { });

  $(".dropdown-item2").click(function (e) {


    //  $("#id"+ $(this).attr("id")).remove();
    //  $("#rr"+ $(this).attr("id")).empty();
    pestalla = pestalla + 1;

    $("#myTab").prepend('<li role="presentation" class="" id="li' + pestalla + '" style="text-align: right;"><a href="#rr' + pestalla + '" id="id' + pestalla + '" role="tab" data-toggle="tab" aria-expanded="false">Listado: ' + $(this).attr("result") + ' <i class="fa fa-times" style="color: red; background: transparent;cursor: pointer;" onclick="cerrar_elemento(' + pestalla + ')"></i></a> </li>');




    if ($(this).attr("value") == "registro") {
      $.ajax({
        type: 'POST',
        url: '/menu_click',
        data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'pk': $(this).attr("id"), 'usuario': web_usuario, 'idioma': web_idioma, 'pestalla': pestalla },
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
            t_dispay =''
            if($( ".diseno" ).css("display")=='none'){
              t_dispay ='style="display: none;"'
            }else{
              t_dispay =''
            }
          
            data_new = data_new + '<button class="btn bg-yellow btn-flat margin diseno" onclick="modificar_estilo_recarga_inicial(' + Response["pestalla"] + ')" '+t_dispay+'>Editar Formulario</span></button>'
            data_new = data_new + '<button class="btn bg-yellow btn-flat margin diseno" onclick="Editar_estados(' + Response["pestalla"] + ')" '+t_dispay+'>Editar Estados</span></button>'
            data_new = data_new + '<button class="btn bg-yellow btn-flat margin diseno" onclick="Importar_datos(' + Response["pestalla"] + ')" '+t_dispay+'>Importar Datos</span></button>'
            data_new = data_new + '<button class="btn bg-yellow btn-flat margin diseno" onclick="modificar_estilo_PDF(' + Response["pestalla"] + ')" '+t_dispay+'>Editar Pdf</span></button>'

            data_new = data_new + '<button class="btn bg-red btn-flat margin diseno" onclick="Eliminar_modulo(' + Response["pestalla"] + ')" '+t_dispay+'>Eliminar</span></button>'

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


          data_new = data_new + '</div></div><div class="box-body" style="padding-left: 0px;"><div class="card-block text-left" style="overflow: scroll;"><div id="tabla' + Response["pestalla"] + '"><table id="tabla_intera_' + Response["pestalla"] + '" width="100%;font-size: 11px;" class="table table-bordered bulk_action" style="background-color: white;overflow-x:auto;width: ' + largo_tablaPX + 'px; font-size: 11px;">'

          data_new = data_new + '<thead><tr><th style="width: 80px;">Acciones</th>'


          for (x = 1; x < Response["names"].length; x++) {
            //data_new = data_new + '<th style="width: '+ parseInt(Response["estru"][x]["largo"]) +'px;">' + Response["names"][x][0] +'<textarea type="text" class="form-control col-sm-8" readonly="readonly" style="height: 25px; font-size: 11px; margin: 0px 43.3125px 7px 0px;"></textarea></th>'
            //data_new = data_new + '<th style="width: '+ parseInt(Response["estru"][x]["largo"]) +'px;"><textarea type="text" class="form-control col-sm-8" readonly="readonly" style="height: 25px; font-size: 11px; margin: 0px 43.3125px 7px 0px;max-height: 25px;width: '+ parseInt(Response["estru"][x]["largo"]) +'px;">' + Response["names"][x][0] +'</textarea></th>'
            data_new = data_new + '<th>'
            if (web_esAdmin == 'Y') {
              data_new = data_new + '<button type="button" onclick="admin_listado_posi_dir(0,' + Response["pestalla"] + ', \'' + Response["names"] + '\')" class="btn bg-green btn-flat margin" data-toggle="tooltip" data-placement="top" title="Mover Izquierda"><i class="fa fa-fw fa-arrow-left"></i></button>'
            }
            data_new = data_new + '<textarea type="text" class="form-control col-sm-8" readonly="readonly" style="height: 25px; font-size: 11px; margin: 0px 43.3125px 7px 0px;max-height: 25px;width: ' + parseInt(Response["estru"][x]["largo"]) + 'px;">' + Response["names"][x][0] + '</textarea>'
            if (web_esAdmin == 'Y') {
              data_new = data_new + '<button type="button" onclick="admin_listado_posi_dir(1,' + Response["pestalla"] + ', \'' + Response["names"] + '\')" class="btn bg-green btn-flat margin" data-toggle="tooltip" data-placement="top" title="Mover Derecha"><i class="fa fa-fw fa-arrow-right"></i></button>'
            }
            data_new = data_new + '</th>'

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
    if ($(this).attr("value") == "reporte") {
      $.ajax({
        type: 'POST',
        url: '/menu_reporte',
        data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'pkrepo': $(this).attr("id"), 'nombre_rep': $(this).attr("result"), 'usuario': web_usuario, 'idioma': web_idioma, 'pestalla': pestalla },
        beforeSend: function () {

          $("#myTabContent").prepend('<div role="tabpanel" class="tab-pane fade" id="rr' + pestalla + '" aria-labelledby="id' + pestalla + '" style="background-color: transparent;"> <div style="padding-top: 5px;"> Procesando </div></div>');
        },
        success: function (Response) {

          id_dic = 'p-' + pestalla
          dict_pestalla[id_dic] = Response

          data_int = '<div class="panel-body" style="padding-top: 5px;padding-left: 0px;">'
          data_int = data_int + '<div class="input-group" style="background: white;margin-left: 0px;margin-right: 0px;width: 100%;">'
          data_int = data_int + '<button class="btn bg-blue btn-flat margin" id="reporteejecutar" name="reporteejecutar" type="submit" value="' + Response['pkrepo'] + '" onclick="reporte_ejecutar(' + Response["pestalla"] + ',0, ' + Response["pkrepo"] + ')">Ejecutar</button>'
          data_int = data_int + '<button type="button" onclick="cerrar_elemento(' + Response["pestalla"] + ')" class="btn bg-red btn-flat margin"><span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span></button>'
          data_int = data_int + '</div>'
          data_int = data_int + '<div class="card-block text-left"><table class="table table-hover" style="background: white;"><thead><tr><th></th><th></th><th></th></tr></thead><tbody>'

          for (x = 0; x < Response['variables_reprotes'].length; x++) {
            //data_int = data_int + '<br>'

            if (Response['variables_reprotes'][x]["tipo"] == "Texto") {
              data_int = data_int + '<tr><td><strong>' + Response['variables_reprotes'][x]["glosa"] + ':</td>'
              data_int = data_int + '<td> <input type="text" id="var-' + Response["pestalla"] + '-' + Response['variables_reprotes'][x]["id"] + '" name="' + Response['variables_reprotes'][x]["id_rep"] + '" value="%"></td>'
              data_int = data_int + '</tr>'
            } else {
              if (Response['variables_reprotes'][x]["tipo"] == "Valor") {
                data_int = data_int + '<tr><td><strong>' + Response['variables_reprotes'][x]["glosa"] + ':</td>'
                data_int = data_int + '<td> <input type="text" id="var-' + Response["pestalla"] + '-' + Response['variables_reprotes'][x]["id"] + '" name="' + Response['variables_reprotes'][x]["id_rep"] + '" value="0"></td>'
                data_int = data_int + '</tr>'
              } else {
                data_int = data_int + '<tr><td><strong>' + Response['variables_reprotes'][x]["glosa"] + ':</td>'
                data_int = data_int + '<td> <input type="date" id="var-' + Response["pestalla"] + '-' + Response['variables_reprotes'][x]["id"] + '" name="' + Response['variables_reprotes'][x]["id_rep"] + '" value="' + Response['variables_reprotes'][x]["valor"] + '"></td>'
                data_int = data_int + '</tr>'
              }
            }
          }
          for (x = 0; x < Response['referencias_reprotes'].length; x++) {
            data_int = data_int + '<tr><td><strong>' + Response['referencias_reprotes'][x]["glosa"] + ':</td>'
            data_int = data_int + '<td> <input type="text" id="rpzz' + Response["pestalla"] + 'zz' + x + 'zz' + Response['referencias_reprotes'][x]["id"] + '" name="' + Response['referencias_reprotes'][x]["id"] + '" value="%"><button type="button" class="btn btn-info" data-toggle="modal" data-target=".bs-example-modal-lg" onclick="buscar_referencia_reporte(rpzz' + Response["pestalla"] + 'zz' + x + 'zz' + Response['referencias_reprotes'][x]["id"] + ')" style="padding-top: 0px;padding-bottom: 0px;margin-top: 0px;margin-bottom: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></button></td>'
            data_int = data_int + '</tr>'


          }
          data_int = data_int + '</tbody></table></div>  '
          $('#rr' + Response["pestalla"]).html(data_int);
          document.getElementById('id' + Response["pestalla"]).click();

        }
      });
    }

  });
});


function newtareas() {

  html_tar = ''


}





var colorNames = Object.keys(window.chartColors);

function runScript_modi_fast(e, campo) {
  //See notes about 'which' and 'key'
  if (e.keyCode == 13) {
    modi_fast(campo)
  } else {
    var campo_int = document.getElementById(campo.id)
    campo_int.style.backgroundColor = "white"
  }
}

function modi_fast(campo) {


  var cc_id = campo.id
  var res = cc_id.split("zzz");
  var res2 = res[1].split("jjj");


  var cc_pesta = res[0].substring(2);
  var cc_nombre = res2[0]
  var cc_pk = res2[1]

  var cc_tabla = dict_pestalla["p-" + cc_pesta]["tabla"][0]["Nombre"]
  var cc_valor = campo.value

  $.ajax({
    type: 'POST',
    url: '/modi_fast',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'id': cc_id, 'pkregistro': cc_pk, 'tabla': cc_tabla, 'nombre': cc_nombre, 'valor': cc_valor, 'usuario': web_usuario },
    success: function (Response) {
      var campo = document.getElementById(Response["id"])
      campo.style.backgroundColor = "lightgreen"
    }
  });

}

function cerrar_cemaforo() {
  $('#panel_cemaforo').remove();
  $('#home-tab').remove();

}

function carga_charts(Response) {

  if (Response["lista_charts"].length > 0) {
    $('#panel_cemaforo').html('');
  } else {
    $('#panel_cemaforo').html('<div class="col-md-12"><div class="col-middle"><div class="text-center text-center"><h1 class="error-number"></h1><h2>No existe paneles validos</h2><p>Hable con su administrador para incluir indicadores o gráficos</p><div class="weather-icon"><span><canvas height="84" width="84" id="partly-cloudy-day"></canvas></span></div></div></div></div>');
  }

  if (Response["lista_charts"].length > 0) {
    //add_tap ='<div class="col-md-12"><button type="button" onclick="cerrar_cemaforo()" class="btn bg-red btn-flat margin">Cerrar</button></div>'

    add_tap = '<div class="box box-primary direct-chat direct-chat-primary"><div class="row" id="chart_panel_control" style="width: 100%;"></div></div>'

    //add_tap = '<div class="box box-primary direct-chat direct-chat-primary"><div class="box-header with-border" style="padding-top: 0px;padding-bottom: 0px;"><h2><i class="fa fa-fw fa-bar-chart"></i><small> Indicadores</small></h2><div class="clearfix"></div></div><div class="row" id="chart_indi" style="width: 100%;"></div></div>'

    //add_tap = add_tap + '<div class="box box-primary direct-chat direct-chat-primary"><div class="box-header with-border" style="padding-top: 0px;padding-bottom: 0px;"><h2><i class="fa fa-fw fa-bar-chart"></i><small> Medidores</small></h2><div class="clearfix"></div></div><div class="row" id="chart_medi" style="width: 100%;"></div></div>'

    //add_tap = add_tap + '<div class="box box-primary direct-chat direct-chat-primary"><div class="box-header with-border" style="padding-top: 0px;padding-bottom: 0px;"><h2><i class="fa fa-fw fa-pie-chart"></i><small> Pasteles</small></h2><div class="clearfix"></div></div><div class="row" id="chart_pie" style="width: 100%;"></div></div>'

    //add_tap = add_tap +'<div class="box box-primary direct-chat direct-chat-primary"><div class="box-header with-border" style="padding-top: 0px;padding-bottom: 0px;"><h2><i class="fa fa-fw fa-line-chart"></i><small> Curvas</small></h2><div class="clearfix"></div></div><div class="row" id="chart_bars" style="width: 100%;"></div></div>'
  } else {
    add_tap = ''
  }
  var iDiv = document.createElement('div');
  iDiv.innerHTML = add_tap
  iDiv.setAttribute('style', "padding-left: 0px;");


  var divcemaforo = document.getElementById('panel_cemaforo');
  divcemaforo.appendChild(iDiv);

  for (y = 0; y < Response["lista_charts"].length; y++) {

    new_tap = ''

    if (Response["lista_charts"][y]["tipo"] == 'chart js') {
      var iDiv = document.createElement('div');
      iDiv.setAttribute('style', "padding-left: 25px;");

      if (window.mobileAndTabletcheck == false) {
        iDiv.className = Response["lista_charts"][y]["html_class"]
      } else {
        iDiv.className = 'charts'
      }
      new_tap = new_tap + '<div class="box box-info"><div class="box-body"><canvas id="charts' + Response["lista_charts"][y]["pk"] + '" class="chartjs-render-monitor"></canvas>'
      new_tap = new_tap + '</div></div>'




      iDiv.innerHTML = new_tap

      if (Response["lista_charts"][y]["modelo"] == 'barras') {
        data_final = {}
        data_temp = []

        data_final['labels'] = Response["lista_charts"][y]["dato_x"].split(",")
        for (yy = 0; yy < Response["valores_charts"][Response["lista_charts"][y]["pk"]].length; yy++) {
          data_linea = {}

          data_linea['label'] = Response["valores_charts"][Response["lista_charts"][y]["pk"]][yy][Response["lista_charts"][y]["label"]]
          data_linea['backgroundColor'] = 'rgb(' + Math.floor(Math.random() * 254) + ',' + Math.floor(Math.random() * 254) + ',' + Math.floor(Math.random() * 254) + ')'
          data_linea['borderColor'] = 'rgb(' + Math.floor(Math.random() * 254) + ',' + Math.floor(Math.random() * 254) + ',' + Math.floor(Math.random() * 254) + ')'
          data_linea['fill'] = false

          data_valor = []
          columas = Response["lista_charts"][y]["dato_x"].split(",")
          for (y3 = 0; y3 < columas.length; y3++) {
            data_valor.push(Response["valores_charts"][Response["lista_charts"][y]["pk"]][yy][columas[y3]])
          }
          data_linea['data'] = data_valor
          data_temp.push(data_linea)
        }

        data_final['datasets'] = data_temp

        var config = {
          type: 'line',
          data: data_final,
          options: {
            responsive: true, title: { display: false, text: Response["lista_charts"][y]["descripcion"] },
            tooltips: { mode: 'index', intersect: false, },
            hover: { mode: 'nearest', intersect: true },
            scales: {
              xAxes: [{ display: true, scaleLabel: { display: true, labelString: Response["lista_charts"][y]["dato_x_name"] } }],
              yAxes: [{ display: true, scaleLabel: { display: true, labelString: Response["lista_charts"][y]["dato_y_name"] } }]
            }
          }
        };



        var divcemaforo = document.getElementById('chart_panel_control');
        divcemaforo.appendChild(iDiv);

        var canvas_int = document.getElementById('charts' + Response["lista_charts"][y]["pk"]).getContext('2d');
        window.myLine = new Chart(canvas_int, config);
      }

      if (Response["lista_charts"][y]["modelo"] == 'pastel') {
        temp_valores = []
        temp_backgroundColor = []
        temp_labels = []

        for (yy = 0; yy < Response["valores_charts"][Response["lista_charts"][y]["pk"]].length; yy++) {
          temp_valores.push(Response["valores_charts"][Response["lista_charts"][y]["pk"]][yy][Response["lista_charts"][y]["dato_y_name"]])
          temp_backgroundColor.push('rgb(' + Math.floor(Math.random() * 254) + ',' + Math.floor(Math.random() * 254) + ',' + Math.floor(Math.random() * 254) + ')')
          temp_labels.push(Response["valores_charts"][Response["lista_charts"][y]["pk"]][yy][Response["lista_charts"][y]["dato_x_name"]])
        }

        data_final = {}
        data_final['datasets'] = [{ 'data': temp_valores, 'backgroundColor': temp_backgroundColor, 'label': Response["lista_charts"][y]["titulo"] }]
        data_final['labels'] = temp_labels



        var config = {
          type: 'pie',
          data: data_final,
          options: {
            responsive: true, legend: { position: 'none', },
            title: { display: true, text: Response["lista_charts"][y]["titulo"] },
            animation: { animateScale: true, animateRotate: true }
          }
        };



        var divcemaforo = document.getElementById('chart_panel_control');
        divcemaforo.appendChild(iDiv);

        var canvas_int = document.getElementById('charts' + Response["lista_charts"][y]["pk"]).getContext('2d');
        window.myLine = new Chart(canvas_int, config);
      }
    }
    if (Response["lista_charts"][y]["tipo"] == 'echarts') {
      var iDiv = document.createElement('div');
      iDiv.setAttribute('style', "padding-left: 15px;");

      if (window.mobileAndTabletcheck == false) {
        iDiv.className = Response["lista_charts"][y]["html_class"]
      } else {
        iDiv.className = 'charts'

      }
      new_tap = new_tap + '<div id="charts' + Response["lista_charts"][y]["pk"] + '" </div>'
      iDiv.innerHTML = new_tap

      var divcemaforo = document.getElementById('chart_panel_control');
      divcemaforo.appendChild(iDiv);


      if (Response["lista_charts"][y]["modelo"] == 'gauge') {

        lis_valor = Response["lista_charts"][y]["dato_x"].split(',')
        lis_meta = Response["lista_charts"][y]["dato_x_name"].split(',')
        if (lis_valor.length == 1) {
          lis_valor = [Response["lista_charts"][y]["dato_x"], Response["lista_charts"][y]["dato_x"]]
        }
        if (lis_meta.length == 1) {
          lis_meta = [Response["lista_charts"][y]["dato_x_name"], Response["lista_charts"][y]["dato_x_name"]]
        }

        var dom = document.getElementById('charts' + Response["lista_charts"][y]["pk"]);


        if (isNaN(Response["valores_charts"][Response["lista_charts"][y]["pk"]][0][lis_valor[0]]) == true) {
          ch_valor = 0.00
          ch_display = 0.00
        } else {
          ch_display = Response["valores_charts"][Response["lista_charts"][y]["pk"]][0][lis_valor[1]]
          ch_valor = Response["valores_charts"][Response["lista_charts"][y]["pk"]][0][lis_valor[0]] //val registro
        }

        ch_meta = Response["valores_charts"][Response["lista_charts"][y]["pk"]][0][lis_meta[0]] // val obetivo
        ch_meta_display = Response["valores_charts"][Response["lista_charts"][y]["pk"]][0][lis_meta[1]] // val obetivo



        ch_base = Response["valores_charts"][Response["lista_charts"][y]["pk"]][0][Response["lista_charts"][y]["dato_y_name"]] // val arrenque

        if (ch_meta == null) {
          ch_meta = 0
          ch_meta_display = 0
        }
        if (ch_base == null) { ch_base = 0 }
        if (ch_valor == null) {
          ch_valor = 0
          ch_display = 0.00

        }


        color = 'green'

        if (parseInt(ch_meta) == 0) {
          if (parseInt(parseFloat(ch_valor / ch_base) * 100) <= 33) { color = 'green' }
          if (parseInt(parseFloat(ch_valor / ch_base) * 100) > 33 && parseInt(parseFloat(ch_valor / ch_meta) * 100) <= 66) { color = 'yellow' }
          if (parseInt(parseFloat(ch_valor / ch_base) * 100) > 66) { color = 'red' }
          dom.innerHTML = '<div class="info-box bg-' + color + '"><span class="info-box-icon"><i class="fa fa-fw fa-tachometer"></i></span><div class="info-box-content"><span class="info-box-text">' + Response["lista_charts"][y]["titulo"] + '</span><span class="info-box-number">' + ch_display + '</span><div class="progress"><div class="progress-bar" style="width: ' + parseInt(parseFloat(ch_valor / ch_meta) * 100) + '%"></div></div><span class="progress-description">' + ch_meta_display + '</span></div></div>'

        } else {
          if (parseInt(parseFloat(ch_valor / ch_meta) * 100) <= 33) { color = 'red' }
          if (parseInt(parseFloat(ch_valor / ch_meta) * 100) > 33 && parseInt(parseFloat(ch_valor / ch_meta) * 100) <= 66) { color = 'yellow' }
          if (parseInt(parseFloat(ch_valor / ch_meta) * 100) > 66) { color = 'green' }
          dom.innerHTML = '<div class="info-box bg-' + color + '"><span class="info-box-icon"><i class="fa fa-fw fa-tachometer"></i></span><div class="info-box-content"><span class="info-box-text">' + Response["lista_charts"][y]["titulo"] + '</span><span class="info-box-number">' + ch_display + '</span><div class="progress"><div class="progress-bar" style="width: ' + parseInt(parseFloat(ch_valor / ch_meta) * 100) + '%"></div></div><span class="progress-description">' + ch_meta_display + '</span></div></div>'
        }






      }

    }
    if (Response["lista_charts"][y]["tipo"] == 'tabla') {
      var iDiv = document.createElement('div');
      iDiv.setAttribute('style', "padding-left: 25px;");

      if (window.mobileAndTabletcheck == false) {
        iDiv.className = Response["lista_charts"][y]["html_class"]
      } else {
        iDiv.className = 'charts'

      }
      iDiv.style.textAlign = 'center'


      new_tap = new_tap + '<h4>' + Response["lista_charts"][y]["titulo"] + '</h4><div>'

      new_tap = new_tap + '<table class="table"><tbody><tr>'
      y_columas = Response["lista_charts"][y]["dato_x"].split(',')
      for (var i2 = 0; i2 < y_columas.length; i2++) {
        new_tap = new_tap + '<th>' + y_columas[i2] + '</th>'
      }
      new_tap = new_tap + '</tr>'

      for (var i1 = 0; i1 < Response["valores_charts"][Response["lista_charts"][y]["pk"]].length; i1++) {
        new_tap = new_tap + '<tr>'

        for (var i2 = 0; i2 < y_columas.length; i2++) {
          new_tap = new_tap + '<td>' + Response["valores_charts"][Response["lista_charts"][y]["pk"]][i1][y_columas[i2]] + '</td>'
        }
        new_tap = new_tap + '</tr>'
      }

      new_tap = new_tap + '</tbody></table></div>'

      iDiv.innerHTML = new_tap

      var divcemaforo = document.getElementById('chart_panel_control');
      divcemaforo.appendChild(iDiv);


    }
  }
  document.getElementById('home-tab').click();

}

function reporte_ejecutar(tem_pestalla, temp_nivel, id) {

  if (bloqueado() == true) {
    document.getElementById('a_default_pagos').click()
    return
  }


  Response = dict_pestalla['p-' + tem_pestalla]
  senten = []
  str1 = []
  str2 = []
  str3 = []
  str4 = []
  str5 = []

  label = {}
  varref = {}
  varvar = {}

  for (x2 = 0; x2 < Response["Resto_reporte"][0].length; x2++) {
    str1.push(Response["Resto_reporte"][0][x2]["sentencia"])
  }
  for (x2 = 0; x2 < Response["Resto_reporte"][1].length; x2++) {
    str2.push(Response["Resto_reporte"][1][x2]["sentencia"])
  }
  for (x2 = 0; x2 < Response["Resto_reporte"][2].length; x2++) {
    str3.push(Response["Resto_reporte"][2][x2]["sentencia"])
  }
  for (x2 = 0; x2 < Response["Resto_reporte"][3].length; x2++) {
    str4.push(Response["Resto_reporte"][3][x2]["sentencia"])
  }
  for (x2 = 0; x2 < Response["Resto_reporte"][4].length; x2++) {
    str5.push(Response["Resto_reporte"][4][x2]["sentencia"])
  }
  for (x2 = 0; x2 < str1.length; x2++) {
    senten.push(str1[x2] + str2[x2] + str3[x2] + str4[x2] + str5[x2])
  }

  for (x = 0; x < Response["referencias_reprotes"].length; x++) {
    id_tem = "rpzz" + tem_pestalla + "zz" + x + "zz" + Response["referencias_reprotes"][x]["id"]
    varref[Response["referencias_reprotes"][x]["id_rep"]] = String(document.getElementById(id_tem).value)
    label[Response["referencias_reprotes"][x]["id_rep"]] = Response["referencias_reprotes"][x]["glosa"]
  }

  for (x = 0; x < Response["variables_reprotes"].length; x++) {
    id_tem = "var-" + tem_pestalla + "-" + Response["variables_reprotes"][x]["id"]
    varvar[Response["variables_reprotes"][x]["id_rep"]] = String(document.getElementById(id_tem).value)
    label[Response["variables_reprotes"][x]["id_rep"]] = Response["variables_reprotes"][x]["glosa"]

  }
  $.ajax({
    type: 'POST',
    url: '/reporte_ejecutar',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'senten': JSON.stringify(senten), 'usuario': web_usuario, 'label': JSON.stringify(label), 'varref': JSON.stringify(varref), 'varvar': JSON.stringify(varvar), 'pestalla': tem_pestalla, 'id': id, 'nombre_rep': Response["nombre_rep"] },
    beforeSend: function () {

      data_int = '<div class="col-md-12" style="padding-top: 5px;"><div class="col-middle"><button type="button" onclick="cerrar_elemento(' + tem_pestalla + ')" class="btn bg-red btn-flat margin"><span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span></button><div class="text-center text-center"><h1 class="error-number"></h1><h2>Empresa</h2><p>El panel esta cargando.</p><div class="weather-icon"><span><canvas height="84" width="84" id="partly-cloudy-day"></canvas></span></div></div></div></div>'
      $('#rr' + tem_pestalla).html(data_int);


    },
    success: function (Response) {
      if (Response["db_msg"] == '0') {
        dict_pestalla['p-' + Response["pestalla"]] = Response
        dict_pestalla['p-' + Response["pestalla"]]["vinculacion"] = {}
        reppuesta_rep = Response["resutado"]
        sumatorias = Response['reptotales'][0]['Sentencia'].split(',')

        data_int = '<div style="padding-top: 5px;"><div class="panel-body" style="overflow: scroll;padding-left: 0px;"><div class="input-group" style="background: white;width: 100%;">'
        data_int = data_int + '<button class="btn bg-blue btn-flat margin" id="reporteejecutar" name="reporteejecutar" type="submit" value="4" onclick="reejecutar_reprote(' + Response["id"] + ')">Nuevo</button>'
        data_int = data_int + '<button type="button" onclick="cerrar_elemento(' + Response["pestalla"] + ')" class="btn bg-red btn-flat margin"><span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span></button>'
        data_int = data_int + '<button type="button" data-toggle="tooltip" data-placement="top" title="Pdf" style="background: gainsboro;    border: dotted;    color: black;    font-size: larger;    margin-top: 0px;    margin-bottom: 0px;" onclick="pdf_reporte(' + Response["pestalla"] + ')" class="btn btn-info"><span class="fa fa-file-pdf-o" aria-hidden="true"></span></button>'
        data_int = data_int + '<button type="button" data-toggle="tooltip" data-placement="top" title="Excell" style="background: gainsboro;    border: dotted;    color: black;    font-size: larger;    margin-top: 0px;    margin-bottom: 0px;" onclick="excell_reporte(' + Response["pestalla"] + ')" class="btn btn-info"><span class="fa fa-file-excel-o" aria-hidden="true"></span></button>'
        data_int = data_int + '<button type="button" data-toggle="tooltip" data-placement="top" title="Txt" style="background: gainsboro;    border: dotted;    color: black;    font-size: larger;    margin-top: 0px;    margin-bottom: 0px;" onclick="txt_reporte(' + Response["pestalla"] + ')" class="btn btn-info"><span class="fa fa-file-text-o" aria-hidden="true"></span></button>'
        data_int = data_int + '<button type="button" data-toggle="tooltip" data-placement="top" title="Zip" style="background: gainsboro;    border: dotted;    color: black;    font-size: larger;    margin-top: 0px;    margin-bottom: 0px;" onclick="empaquetado_reporte(' + Response["pestalla"] + ',' + Response["id"] + ')" class="btn btn-info"><span class="fa fa-file-zip-o" aria-hidden="true"></span></button>'

        data_int = data_int + 'Buscar: <input type="text" id="fil_rep-' + Response["pestalla"] + '" onkeypress="return runScript_rep_filtro(event, ' + Response["pestalla"] + ')"> <label style="padding-left: 10px;"><input type="checkbox" id="det_rep-' + Response["pestalla"] + '" checked><span class="checkbox-material"><span class="check"></span></span>Exportar con Subniveles </label></div>'
        data_int = data_int + '<div style="overflow: scroll;height: 600px;">'


        data_int = data_int + html_rep(reppuesta_rep, Response["pestalla"], sumatorias) + '</div>'


        $('#rr' + tem_pestalla).html(data_int);

      } else {
        $('#rr' + tem_pestalla).html(Response["db_msg"]);

      }




    }
  });

}

function html_rep(reppuesta_rep, t_pestalla, sum_t) {
  data_rep = ''
  valores_sub = {}

  for (dd = 0; dd < sum_t.length; dd++) {
    valores_sub[sum_t[dd]] = 0
  }

  if (reppuesta_rep.length == 1) {
    data_rep = '<table width="100%" class="table  table-hover" id="dataTables-' + t_pestalla + '" style="background-color: white;margin-bottom: 0px;"><thead><tr>'
    for (y = 0; y < reppuesta_rep[0][0].length; y++) {
      data_rep = data_rep + '<th>' + reppuesta_rep[0][0][y][0] + '</th>'
    }
    data_rep = data_rep + '</tr></thead><tbody>'

    for (y = 0; y < reppuesta_rep[0][1].length; y++) {
      data_rep = data_rep + '<tr>'
      for (y2 = 0; y2 < reppuesta_rep[0][0].length; y2++) {

        if (valores_sub[reppuesta_rep[0][0][y2][0]] !== undefined) {
          valores_sub[reppuesta_rep[0][0][y2][0]] = parseFloat(valores_sub[reppuesta_rep[0][0][y2][0]]) + parseFloat(reppuesta_rep[0][1][y][y2].toString().replace(',', ''))
        }

        if (reppuesta_rep[0][0][y2][0] != '$vinculo_out' && reppuesta_rep[0][0][y2][0] != '$vinculo_in' && reppuesta_rep[0][0][y2][0][0] != '$') {

          if (reppuesta_rep[0][0][y2][0] == 'imagen') {
            data_rep = data_rep + '<td><div style="width: 100px;"><div class="thumbnail" style="height: 110px;margin-bottom: 1px;"><div class="image view view-first"><img style="width: 80%;height: 80px; display: block;margin-left: auto;margin-right: auto;" src="/media/archivos/' + web_Id_empresa + '/' + reppuesta_rep[0][1][y][y2] + '" alt="image" value="0"><a href="/media/archivos/' + web_Id_empresa + '/' + reppuesta_rep[0][1][y][y2] + '" target="_blank">' + reppuesta_rep[0][1][y][y2] + '</a></div></div></div></td>'
          } else {
            if (reppuesta_rep[0][0][y2][0] == 'Ride') {
              data_rep = data_rep + '<td> <a href="' + reppuesta_rep[0][1][y][y2] + '" target="_blank">Ver</a></td>'
            } else {
              data_rep = data_rep + '<td>' + reppuesta_rep[0][1][y][y2] + '</td>'
            }


          }
        }
      }
      data_rep = data_rep + '</tr>'
    }
    if (sum_t.length > 0) {
      data_rep = data_rep + '<tr>'
      for (y2 = 0; y2 < reppuesta_rep[0][0].length; y2++) {
        if (reppuesta_rep[0][0][y2][0] != '$vinculo_out' && reppuesta_rep[0][0][y2][0] != '$vinculo_in' && reppuesta_rep[0][0][y2][0][0] != '$') {
          if (valores_sub[reppuesta_rep[0][0][y2][0]] !== undefined) {
            data_rep = data_rep + '<td>' + valores_sub[reppuesta_rep[0][0][y2][0]].toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td>'
          } else {
            data_rep = data_rep + '<td> </td>'
          }
        }
      }
      data_rep = data_rep + '</tr>'
    }
    data_rep = data_rep + '</tbody></table>'
  }

  if (reppuesta_rep.length == 2) {
    data_rep = '<table width="100%" class="table  table-hover" id="dataTables-' + t_pestalla + '" style="background-color: white;margin-bottom: 0px;"><thead><tr>'
    data_rep = data_rep + '<th style="width: 15px;"></th>'

    for (y = 0; y < reppuesta_rep[0][0].length; y++) {
      if (reppuesta_rep[0][0][y][0] != '$vinculo_out' && reppuesta_rep[0][0][y][0] != '$vinculo_in' && reppuesta_rep[0][0][y][0][0] != '$') {
        data_rep = data_rep + '<th>' + reppuesta_rep[0][0][y][0] + '</th>'
      }
    }
    data_rep = data_rep + '</tr></thead><tbody>'

    for (y = 0; y < reppuesta_rep[0][1].length; y++) {
      data_rep = data_rep + '<tr><td>**btn**</td>'
      for (y2 = 0; y2 < reppuesta_rep[0][0].length; y2++) {
        vinculo_out = ''
        if (valores_sub[reppuesta_rep[0][0][y2][0]] !== undefined) {
          valores_sub[reppuesta_rep[0][0][y2][0]] = parseFloat(valores_sub[reppuesta_rep[0][0][y2][0]]) + parseFloat(reppuesta_rep[0][1][y][y2].toString().replace(',', ''))
        }

        if (reppuesta_rep[0][0][y2][0] != '$vinculo_out' && reppuesta_rep[0][0][y2][0] != '$vinculo_in' && reppuesta_rep[0][0][y2][0][0] != '$') {
          if (reppuesta_rep[0][0][y2][0] == 'imagen') {
            data_rep = data_rep + '<td><div style="width: 100px;"><div class="thumbnail" style="height: 110px;margin-bottom: 1px;"><div class="image view view-first"><img style="width: 80%;height: 80px; display: block;margin-left: auto;margin-right: auto;" src="/media/archivos/' + web_Id_empresa + '/' + reppuesta_rep[0][1][y][y2] + '" alt="image" value="0"><a href="/media/archivos/' + web_Id_empresa + '/' + reppuesta_rep[0][1][y][y2] + '" target="_blank">' + reppuesta_rep[0][1][y][y2] + '</a></div></div></div></td>'
          } else {
            if (reppuesta_rep[0][0][y2][0] == 'Ride') {
              data_rep = data_rep + '<td> <a href="' + reppuesta_rep[0][1][y][y2] + '" target="_blank">Ver</a></td>'
            } else {
              data_rep = data_rep + '<td>' + reppuesta_rep[0][1][y][y2] + '</td>'
            }
          }
        }
        if (reppuesta_rep[0][0][y2][0] == '$vinculo_out') {
          vinculo_out = reppuesta_rep[0][1][y][y2]

        }
      }
      data_rep = data_rep + '</tr>'

      //-------------------------------------------nivel 1

      data_sub = '<tr  class="lin_detalle" id="dr-' + t_pestalla + '-' + y + '-0" hidden style="background-color: aliceblue;"><td colspan="15" style="padding-left: 26px;"> <div><div class="panel-body" style="overflow: scroll;padding-top: 0px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;"><table width="100%" class="table  table-hover" style="background-color: aliceblue;margin-bottom: 0px;"><thead><tr>'
      var desgloses = {}
      for (x = 0; x < reppuesta_rep[1][0].length; x++) {
        if (reppuesta_rep[1][0][x][0] != '$vinculo_out' && reppuesta_rep[1][0][x][0] != '$vinculo_in' && reppuesta_rep[1][0][x][0][0] != '$') {
          data_sub = data_sub + '<th>' + reppuesta_rep[1][0][x][0] + '</th>'
        }
        if (reppuesta_rep[1][0][x][0].substring(0, 2) == '$@') {
          des = reppuesta_rep[1][0][x][0].split('@')
          des2 = des[1].split(';')
          desgloses[reppuesta_rep[1][0][x][0]] = reppuesta_rep[0][1][y][des2[0]]
          data_sub = data_sub + '<th>' + des[2] + '</th>'

        }
      }
      data_sub = data_sub + '</tr></thead><tbody>'

      // fijar var de deslgose y valot inicial


      //  
      hay_fila = 0
      for (x = 0; x < reppuesta_rep[1][1].length; x++) {
        data_sub = data_sub + ''
        pasa_fila = 0
        data_fila = ''
        var desgloses_int = {}

        for (x2 = 0; x2 < reppuesta_rep[1][0].length; x2++) {

          if (reppuesta_rep[1][0][x2][0] != '$vinculo_out' && reppuesta_rep[1][0][x2][0] != '$vinculo_in' && reppuesta_rep[1][0][x2][0][0] != '$') {
            if (reppuesta_rep[1][0][x2][0] == 'imagen') {
              data_fila = data_fila + '<td><div style="width: 100px;"><div class="thumbnail" style="height: 110px;margin-bottom: 1px;"><div class="image view view-first"><img style="width: 80%;height: 80px; display: block;margin-left: auto;margin-right: auto;" src="/media/archivos/' + web_Id_empresa + '/' + reppuesta_rep[1][1][x][x2] + '" alt="image" value="0"><a href="/media/archivos/' + web_Id_empresa + '/' + reppuesta_rep[1][1][x][x2] + '" target="_blank">' + reppuesta_rep[1][1][x][x2] + '</a></div></div></div></td>'
            } else {

              if (reppuesta_rep[1][0][x2][0] == 'Ride') {
                data_fila = data_fila + '<td> <a href="' + reppuesta_rep[1][1][x][x2] + '" target="_blank">Ver</a></td>'
              } else {
                data_fila = data_fila + '<td>' + reppuesta_rep[1][1][x][x2] + '</td>'
              }

            }
          }
          if (reppuesta_rep[1][0][x2][0] == '$vinculo_in') {
            if (vinculo_out == reppuesta_rep[1][1][x][x2]) {
              pasa_fila = 1
              hay_fila = 1
            }
          }
          if (reppuesta_rep[1][0][x2][0].substring(0, 2) == '$@') {
            des = reppuesta_rep[1][0][x2][0].split('@')
            des2 = des[1].split(';')
            vallr = 0

            if (des2[2] == 0) {
              vallr = desgloses[reppuesta_rep[1][0][x2][0]]

            }
            if (des2[2] == 1) {
              vallr = parseFloat(desgloses[reppuesta_rep[1][0][x2][0]]) + parseFloat(reppuesta_rep[1][1][x][des2[1]])
            }
            data_fila = data_fila + '<td>' + setTwoNumberDecimal(vallr, 2) + '</td>'
            desgloses_int[reppuesta_rep[1][0][x2][0]] = reppuesta_rep[1][1][x][des2[1]]
          }

        }
        if (pasa_fila == 1) {

          for (var f = 0; f < Object.keys(desgloses_int).length; f++) {
            desgloses[Object.keys(desgloses_int)[f]] = parseFloat(desgloses[Object.keys(desgloses_int)[f]]) + parseFloat(desgloses_int[Object.keys(desgloses_int)[f]])
          };
          dict_pestalla['p-' + t_pestalla]["vinculacion"]['1-' + x] = y
          data_sub = data_sub + '<tr>' + data_fila + '</tr>'
        }
      }
      data_sub = data_sub + '</tbody></table></div></div></td></tr>'

      if (hay_fila == 1) {
        data_rep = data_rep + data_sub
        btn_abrir = '<button type="button" id="btn-' + t_pestalla + '-' + y + '-0" style="padding: 1px 6px;margin-bottom: 0px;margin-right: 0px; background-color: darkblue;color: white;" onclick="abrir_subrep(' + t_pestalla + ', ' + y + ',0)" class="btn btn-round btn-success"><span class="fa fa-plus" aria-hidden="true"></span></button>'
        data_rep = data_rep.replace('**btn**', btn_abrir)
      } else {
        data_rep = data_rep.replace('**btn**', '')

      }

      //-------------------------------------------nivel 1
      //data_rep= data_rep + '</tr>'      
    }

    if (sum_t.length > 0) {
      data_rep = data_rep + '<tr><td></td>'
      for (y2 = 0; y2 < reppuesta_rep[0][0].length; y2++) {
        if (reppuesta_rep[0][0][y2][0] != '$vinculo_out' && reppuesta_rep[0][0][y2][0] != '$vinculo_in' && reppuesta_rep[0][0][y2][0][0] != '$') { if (valores_sub[reppuesta_rep[0][0][y2][0]] !== undefined) { data_rep = data_rep + '<td>' + valores_sub[reppuesta_rep[0][0][y2][0]].toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td>' } else { data_rep = data_rep + '<td> </td>' } }
      }
      data_rep = data_rep + '</tr>'
    }
    data_rep = data_rep + '</tbody></table>'
  }

  if (reppuesta_rep.length == 3) {
    data_rep = '<table width="100%" class="table  table-hover" id="dataTables-' + t_pestalla + '" style="background-color: white;margin-bottom: 0px;"><thead><tr>'
    data_rep = data_rep + '<th style="width: 15px;"></th>'

    for (y = 0; y < reppuesta_rep[0][0].length; y++) {


      if (reppuesta_rep[0][0][y][0] != '$vinculo_out' && reppuesta_rep[0][0][y][0] != '$vinculo_in' && reppuesta_rep[0][0][y][0][0] != '$') {
        data_rep = data_rep + '<th>' + reppuesta_rep[0][0][y][0] + '</th>'
      }
    }
    data_rep = data_rep + '</tr></thead><tbody>'

    for (y = 0; y < reppuesta_rep[0][1].length; y++) {
      data_rep = data_rep + '<tr><td>**btn**</td>'

      for (y2 = 0; y2 < reppuesta_rep[0][0].length; y2++) {
        vinculo_out = ''

        if (valores_sub[reppuesta_rep[0][0][y2][0]] !== undefined) {
          valores_sub[reppuesta_rep[0][0][y2][0]] = parseFloat(valores_sub[reppuesta_rep[0][0][y2][0]]) + parseFloat(reppuesta_rep[0][1][y][y2].toString().replace(',', ''))
        }
        if (reppuesta_rep[0][0][y2][0] != '$vinculo_out' && reppuesta_rep[0][0][y2][0] != '$vinculo_in' && reppuesta_rep[0][0][y2][0][0] != '$') {

          if (reppuesta_rep[0][0][y2][0] == 'imagen') {
            data_rep = data_rep + '<td><div style="width: 100px;"><div class="thumbnail" style="height: 110px;margin-bottom: 1px;"><div class="image view view-first"><img style="width: 80%;height: 80px; display: block;margin-left: auto;margin-right: auto;" src="/media/archivos/' + web_Id_empresa + '/' + reppuesta_rep[0][1][y][y2] + '" alt="image" value="0"><a href="/media/archivos/' + web_Id_empresa + '/' + reppuesta_rep[0][1][y][y2] + '" target="_blank">' + reppuesta_rep[0][1][y][y2] + '</a></div></div></div></td>'
          } else {

            if (reppuesta_rep[0][0][y2][0] == 'Ride') {
              data_rep = data_rep + '<td> <a href="' + reppuesta_rep[0][1][y][y2] + '" target="_blank">Ver</a></td>'
            } else {
              data_rep = data_rep + '<td>' + reppuesta_rep[0][1][y][y2] + '</td>'
            }
          }
        }
        if (reppuesta_rep[0][0][y2][0] == '$vinculo_out') {
          vinculo_out = reppuesta_rep[0][1][y][y2]

        }
      }
      data_rep = data_rep + '</tr>'

      //-------------------------------------------nivel 1
      data_sub = '<tr class="lin_detalle" id="dr-' + t_pestalla + '-' + y + '-0" hidden><td colspan="15"  style="padding-left: 26px;"> <div><div class="panel-body" style="overflow: scroll;padding-top: 0px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;"><table width="100%" class="table  table-hover" style="background-color: aliceblue;margin-bottom: 0px;"><thead><tr><th style="width: 15px;"></th>'

      for (x = 0; x < reppuesta_rep[1][0].length; x++) {
        if (reppuesta_rep[1][0][x][0] != '$vinculo_out' && reppuesta_rep[1][0][x][0] != '$vinculo_in' && reppuesta_rep[1][0][x][0][0] != '$') {
          data_sub = data_sub + '<th>' + reppuesta_rep[1][0][x][0] + '</th>'
        }
      }
      data_sub = data_sub + '</tr></thead><tbody>'

      hay_fila = 0
      for (x = 0; x < reppuesta_rep[1][1].length; x++) {
        data_sub = data_sub + ''
        pasa_fila = 0
        data_fila = '<td>**btn2**</td>'

        for (x2 = 0; x2 < reppuesta_rep[1][0].length; x2++) {
          if (reppuesta_rep[1][0][x2][0] != '$vinculo_out' && reppuesta_rep[1][0][x2][0] != '$vinculo_in' && reppuesta_rep[1][0][x2][0][0] != '$') {


            if (reppuesta_rep[1][0][x2][0] == 'imagen') {
              data_fila = data_fila + '<td><div style="width: 100px;"><div class="thumbnail" style="height: 110px;margin-bottom: 1px;"><div class="image view view-first"><img style="width: 80%;height: 80px; display: block;margin-left: auto;margin-right: auto;" src="/media/archivos/' + web_Id_empresa + '/' + reppuesta_rep[1][1][x][x2] + '" alt="image" value="0"><a href="/media/archivos/' + web_Id_empresa + '/' + reppuesta_rep[1][1][x][x2] + '" target="_blank">' + reppuesta_rep[1][1][x][x2] + '</a></div></div></div></td>'
            } else {

              if (reppuesta_rep[1][0][x2][0] == 'Ride') {
                data_fila = data_fila + '<td> <a href="' + reppuesta_rep[1][1][x][x2] + '" target="_blank">Ver</a></td>'
              } else {
                data_fila = data_fila + '<td>' + reppuesta_rep[1][1][x][x2] + '</td>'
              }
            }

          }
          if (reppuesta_rep[1][0][x2][0] == '$vinculo_in') {
            if (vinculo_out == reppuesta_rep[1][1][x][x2]) {
              pasa_fila = 1
              hay_fila = 1
            }
          }
          if (reppuesta_rep[1][0][x2][0] == '$vinculo_out') {
            vinculo_out2 = reppuesta_rep[1][1][x][x2]
          }
        }

        if (pasa_fila == 1) {
          dict_pestalla['p-' + t_pestalla]["vinculacion"]['1-' + x] = y
          data_sub = data_sub + '<tr>' + data_fila + '</tr>'
          //------------------------------------nivel 2


          data_sub2 = '<tr class="lin_detalle" id="dr-' + t_pestalla + '-' + x + '-1" hidden><td colspan="15" style="padding-left: 26px;"> <div><div class="panel-body" style="overflow: scroll;padding-top: 0px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;"><table width="100%" class="table  table-hover" style="background-color: white;margin-bottom: 0px;"><thead><tr>'
          for (z = 0; z < reppuesta_rep[2][0].length; z++) {
            if (reppuesta_rep[2][0][z][0] != '$vinculo_out' && reppuesta_rep[2][0][z][0] != '$vinculo_in' && reppuesta_rep[2][0][z][0][0] != '$') {
              data_sub2 = data_sub2 + '<th>' + reppuesta_rep[2][0][z][0] + '</th>'
            }
          }
          data_sub2 = data_sub2 + '</tr></thead><tbody>'

          hay_fila2 = 0
          for (z = 0; z < reppuesta_rep[2][1].length; z++) {
            data_sub2 = data_sub2 + ''
            pasa_fila2 = 0
            data_fila2 = ''
            for (z2 = 0; z2 < reppuesta_rep[2][0].length; z2++) {
              if (reppuesta_rep[2][0][z2][0] != '$vinculo_out' && reppuesta_rep[2][0][z2][0] != '$vinculo_in' && reppuesta_rep[2][0][z2][0][0] != '$') {


                if (reppuesta_rep[2][0][z2][0] == 'imagen') {
                  data_fila2 = data_fila2 + '<td><div style="width: 100px;"><div class="thumbnail" style="height: 110px;margin-bottom: 1px;"><div class="image view view-first"><img style="width: 80%;height: 80px;margin-left: auto;margin-right: auto; display: block;" src="/media/archivos/' + web_Id_empresa + '/' + reppuesta_rep[2][1][z][z2] + '" alt="image" value="0"><a href="/media/archivos/' + web_Id_empresa + '/' + reppuesta_rep[2][1][z][z2] + '" target="_blank">' + reppuesta_rep[2][1][z][z2] + '</a></div></div></div></td>'
                } else {
                  if (reppuesta_rep[2][0][z2][0] == 'Ride') {
                    data_fila2 = data_fila2 + '<td> <a href="' + reppuesta_rep[2][1][z][z2] + '" target="_blank">Ver</a></td>'
                  } else {
                    data_fila2 = data_fila2 + '<td>' + reppuesta_rep[2][1][z][z2] + '</td>'
                  }

                }

              }
              if (reppuesta_rep[2][0][z2][0] == '$vinculo_in') {
                if (vinculo_out2 == reppuesta_rep[2][1][z][z2]) {
                  pasa_fila2 = 1
                  hay_fila2 = 1
                }
              }
            }
            if (pasa_fila2 == 1) {
              data_sub2 = data_sub2 + '<tr>' + data_fila2 + '</tr>'
            }
          }

          if (hay_fila2 == 1) {
            dict_pestalla['p-' + t_pestalla]["vinculacion"]['2-' + z] = x

            btn_abrir2 = '<button type="button" id="btn-' + t_pestalla + '-' + x + '-1" style="padding: 1px 6px;margin-bottom: 0px;margin-right: 0px; background-color: darkblue;color: white;" onclick="abrir_subrep(' + t_pestalla + ', ' + x + ',1)" class="btn btn-round btn-success"><span class="fa fa-plus" aria-hidden="true"></span></button>'
            data_sub = data_sub.replace('**btn2**', btn_abrir2)
            data_sub = data_sub + data_sub2 + '</tbody></table></div></div></td></tr>'
          } else {
            data_sub = data_sub.replace('**btn2**', '')

          }

          //------------------------------------nivel 2
          //data_sub = data_sub + '</tbody></table></div></div></td></tr>'

        }
      }
      data_sub = data_sub + '</tbody></table></div></div></td></tr>'
      if (hay_fila == 1) {
        data_rep = data_rep + data_sub
        btn_abrir = '<button type="button" id="btn-' + t_pestalla + '-' + y + '-0" style="padding: 1px 6px;margin-bottom: 0px;margin-right: 0px; background-color: darkblue;color: white;" onclick="abrir_subrep(' + t_pestalla + ', ' + y + ',0)" class="btn btn-round btn-success"><span class="fa fa-plus" aria-hidden="true"></span></button>'
        data_rep = data_rep.replace('**btn**', btn_abrir)
      } else {
        data_rep = data_rep.replace('**btn**', '')

      }


      //-------------------------------------------nivel 1
      //data_rep= data_rep + '</tr>'      
    }

    if (sum_t.length > 0) {
      data_rep = data_rep + '<tr><td></td>'
      for (y2 = 0; y2 < reppuesta_rep[0][0].length; y2++) {
        if (reppuesta_rep[0][0][y2][0] != '$vinculo_out' && reppuesta_rep[0][0][y2][0] != '$vinculo_in' && reppuesta_rep[0][0][y2][0][0] != '$') { if (valores_sub[reppuesta_rep[0][0][y2][0]] !== undefined) { data_rep = data_rep + '<td>' + valores_sub[reppuesta_rep[0][0][y2][0]].toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td>' } else { data_rep = data_rep + '<td> </td>' } }
      }
      data_rep = data_rep + '</tr>'
    }
    data_rep = data_rep + '</tbody></table>'
  }

  if (reppuesta_rep.length == 4) {
    data_rep = '<table width="100%" class="table  table-hover" id="dataTables-' + t_pestalla + '" style="background-color: white;margin-bottom: 0px;"><thead><tr>'
    data_rep = data_rep + '<th style="width: 15px;"></th>'

    for (y = 0; y < reppuesta_rep[0][0].length; y++) {
      if (reppuesta_rep[0][0][y][0] != '$vinculo_out' && reppuesta_rep[0][0][y][0] != '$vinculo_in' && reppuesta_rep[0][0][y][0][0] != '$') {
        data_rep = data_rep + '<th>' + reppuesta_rep[0][0][y][0] + '</th>'
      }
    }
    data_rep = data_rep + '</tr></thead><tbody>'

    for (y = 0; y < reppuesta_rep[0][1].length; y++) {
      data_rep = data_rep + '<tr><td>**btn**</td>'
      for (y2 = 0; y2 < reppuesta_rep[0][0].length; y2++) {
        vinculo_out = ''

        if (valores_sub[reppuesta_rep[0][0][y2][0]] !== undefined) {
          valores_sub[reppuesta_rep[0][0][y2][0]] = parseFloat(valores_sub[reppuesta_rep[0][0][y2][0]]) + parseFloat(reppuesta_rep[0][1][y][y2].toString().replace(',', ''))
        }

        if (reppuesta_rep[0][0][y2][0] != '$vinculo_out' && reppuesta_rep[0][0][y2][0] != '$vinculo_in' && reppuesta_rep[0][0][y2][0][0] != '$') {
          if (reppuesta_rep[0][0][y2][0] == 'imagen') {
            data_rep = data_rep + '<td><div style="width: 100px;"><div class="thumbnail" style="height: 110px;margin-bottom: 1px;"><div class="image view view-first"><img style="width: 80%;height: 80px;margin-left: auto;margin-right: auto; display: block;" src="/media/archivos/' + web_Id_empresa + '/' + reppuesta_rep[0][1][y][y2] + '" alt="image" value="0"><a href="/media/archivos/' + web_Id_empresa + '/' + reppuesta_rep[0][1][y][y2] + '" target="_blank">' + reppuesta_rep[0][1][y][y2] + '</a></div></div></div></td>'
          } else {
            if (reppuesta_rep[0][0][y2][0] == 'Ride') {
              data_rep = data_rep + '<td> <a href="' + reppuesta_rep[0][1][y][y2] + '" target="_blank">Ver</a></td>'
            } else {
              data_rep = data_rep + '<td>' + reppuesta_rep[0][1][y][y2] + '</td>'
            }
          }
        }
        if (reppuesta_rep[0][0][y2][0] == '$vinculo_out') {
          vinculo_out = reppuesta_rep[0][1][y][y2]

        }
      }
      data_rep = data_rep + '</tr>'

      //-------------------------------------------nivel 1
      data_sub = '<tr class="lin_detalle" id="dr-' + t_pestalla + '-' + y + '-0" hidden ><td colspan="15" style="padding-left: 26px;"> <div><div class="panel-body" style="overflow: scroll;padding-top: 0px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;"><table width="100%" class="table  table-hover" style="background-color: aliceblue;margin-bottom: 0px;"><thead><tr><th style="width: 15px;"></th>'

      for (x = 0; x < reppuesta_rep[1][0].length; x++) {
        if (reppuesta_rep[1][0][x][0] != '$vinculo_out' && reppuesta_rep[1][0][x][0] != '$vinculo_in' && reppuesta_rep[1][0][x][0][0] != '$') {
          data_sub = data_sub + '<th>' + reppuesta_rep[1][0][x][0] + '</th>'
        }
      }
      data_sub = data_sub + '</tr></thead><tbody>'

      hay_fila = 0
      for (x = 0; x < reppuesta_rep[1][1].length; x++) {
        data_sub = data_sub + ''
        pasa_fila = 0
        data_fila = '<td>**btn2**</td>'

        for (x2 = 0; x2 < reppuesta_rep[1][0].length; x2++) {
          if (reppuesta_rep[1][0][x2][0] != '$vinculo_out' && reppuesta_rep[1][0][x2][0] != '$vinculo_in' && reppuesta_rep[1][0][x2][0][0] != '$') {
            if (reppuesta_rep[1][0][x2][0] == 'imagen') {
              data_fila = data_fila + '<td><div style="width: 100px;"><div class="thumbnail" style="height: 110px;margin-bottom: 1px;"><div class="image view view-first"><img style="width: 80%;height: 80px; display: block;margin-left: auto;margin-right: auto;" src="/media/archivos/' + web_Id_empresa + '/' + reppuesta_rep[1][1][x][x2] + '" alt="image" value="0"><a href="/media/archivos/' + web_Id_empresa + '/' + reppuesta_rep[1][1][x][x2] + '" target="_blank">' + reppuesta_rep[1][1][x][x2] + '</a></div></div></div></td>'
            } else {
              if (reppuesta_rep[1][0][x2][0] == 'Ride') {
                data_fila = data_fila + '<td> <a href="' + reppuesta_rep[1][1][x][x2] + '" target="_blank">Ver</a></td>'
              } else {
                data_fila = data_fila + '<td>' + reppuesta_rep[1][1][x][x2] + '</td>'
              }

            }
          }
          if (reppuesta_rep[1][0][x2][0] == '$vinculo_in') {
            if (vinculo_out == reppuesta_rep[1][1][x][x2]) {
              pasa_fila = 1
              hay_fila = 1
            }
          }
          if (reppuesta_rep[1][0][x2][0] == '$vinculo_out') {
            vinculo_out2 = reppuesta_rep[1][1][x][x2]
          }
        }

        if (pasa_fila == 1) {
          dict_pestalla['p-' + t_pestalla]["vinculacion"]['1-' + x] = y
          //data_sub = data_sub + '<tr>1-'+ x + ':'+ y + '// '+data_fila + '</tr>'
          data_sub = data_sub + '<tr>' + data_fila + '</tr>'

          //------------------------------------nivel 2


          data_sub2 = '<tr class="lin_detalle" id="dr-' + t_pestalla + '-' + x + '-1" hidden><td colspan="10" style="padding-left: 26px;"> <div><div class="panel-body" style="overflow: scroll;padding-top: 0px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;"><table width="100%" class="table  table-hover" style="background-color: white;margin-bottom: 0px;"><thead><tr><th style="width: 15px;"></th>'
          for (z = 0; z < reppuesta_rep[2][0].length; z++) {
            if (reppuesta_rep[2][0][z][0] != '$vinculo_out' && reppuesta_rep[2][0][z][0] != '$vinculo_in' && reppuesta_rep[2][0][z][0][0] != '$') {
              data_sub2 = data_sub2 + '<th>' + reppuesta_rep[2][0][z][0] + '</th>'
            }
          }
          data_sub2 = data_sub2 + '</tr></thead><tbody>'

          hay_fila2 = 0
          for (z = 0; z < reppuesta_rep[2][1].length; z++) {
            data_sub2 = data_sub2 + ''
            pasa_fila2 = 0
            data_fila2 = '<td>**btn3**</td>'

            for (z2 = 0; z2 < reppuesta_rep[2][0].length; z2++) {
              if (reppuesta_rep[2][0][z2][0] != '$vinculo_out' && reppuesta_rep[2][0][z2][0] != '$vinculo_in' && reppuesta_rep[2][0][z2][0][0] != '$') {
                if (reppuesta_rep[2][0][z2][0] == 'imagen') {
                  data_fila2 = data_fila2 + '<td><div style="width: 100px;"><div class="thumbnail" style="height: 110px;margin-bottom: 1px;"><div class="image view view-first"><img style="width: 80%;height: 80px; display: block;margin-left: auto;margin-right: auto;" src="/media/archivos/' + web_Id_empresa + '/' + reppuesta_rep[2][1][z][z2] + '" alt="image" value="0"><a href="/media/archivos/' + web_Id_empresa + '/' + reppuesta_rep[2][1][z][z2] + '" target="_blank">' + reppuesta_rep[2][1][z][z2] + '</a></div></div></div></td>'
                } else {
                  if (reppuesta_rep[2][0][z2][0] == 'Ride') {
                    data_fila2 = data_fila2 + '<td> <a href="' + reppuesta_rep[2][1][z][z2] + '" target="_blank">Ver</a></td>'
                  } else {
                    data_fila2 = data_fila2 + '<td>' + reppuesta_rep[2][1][z][z2] + '</td>'
                  }
                }
              }
              if (reppuesta_rep[2][0][z2][0] == '$vinculo_in') {
                if (vinculo_out2 == reppuesta_rep[2][1][z][z2]) {
                  pasa_fila2 = 1
                  hay_fila2 = 1
                }
              }
              if (reppuesta_rep[2][0][z2][0] == '$vinculo_out') {
                vinculo_out3 = reppuesta_rep[2][1][z][z2]
              }
            }
            if (pasa_fila2 == 1) {
              dict_pestalla['p-' + t_pestalla]["vinculacion"]['2-' + z] = x
              //data_sub2 = data_sub2 + '<tr>2-' + z + ':'+ x + '// '+ data_fila2 + '</tr>'
              data_sub2 = data_sub2 + '<tr>' + data_fila2 + '</tr>'

              //------------------------------------nivel 3


              data_sub3 = '<tr class="lin_detalle" id="dr-' + t_pestalla + '-' + z + '-2" hidden><td colspan="10" style="padding-left: 26px;"> <div><div class="panel-body" style="overflow: scroll;padding-top: 0px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;"><table width="100%" class="table table-hover" style="background-color: white;margin-bottom: 0px;"><thead><tr>'
              for (a = 0; a < reppuesta_rep[3][0].length; a++) {
                if (reppuesta_rep[3][0][a][0] != '$vinculo_out' && reppuesta_rep[3][0][a][0] != '$vinculo_in' && reppuesta_rep[3][0][a][0][0] != '$') {

                  data_sub3 = data_sub3 + '<th>' + reppuesta_rep[3][0][a][0].replace('@', '') + '</th>'
                }
              }
              data_sub3 = data_sub3 + '</tr></thead><tbody>'

              hay_fila3 = 0
              for (a = 0; a < reppuesta_rep[3][1].length; a++) {
                data_sub3 = data_sub3 + ''
                pasa_fila3 = 0
                data_fila3 = ''
                for (a2 = 0; a2 < reppuesta_rep[3][0].length; a2++) {
                  if (reppuesta_rep[3][0][a2][0] != '$vinculo_out' && reppuesta_rep[3][0][a2][0] != '$vinculo_in' && reppuesta_rep[3][0][a2][0][0] != '$') {


                    if (reppuesta_rep[3][0][a2][0] == 'imagen') {
                      data_fila3 = data_fila3 + '<td><div style="width: 100px;"><div class="thumbnail" style="height: 110px;margin-bottom: 1px;"><div class="image view view-first"><img style="width: 80%;height:80px; display: block;margin-left: auto;margin-right: auto;" src="/media/archivos/' + web_Id_empresa + '/' + reppuesta_rep[3][1][a][a2] + '" alt="image" value="0"><a href="/media/archivos/' + web_Id_empresa + '/' + reppuesta_rep[3][1][a][a2] + '" target="_blank">' + reppuesta_rep[3][1][a][a2] + '</a></div></div></div></td>'
                    } else {
                      if (reppuesta_rep[3][0][a2][0][0] == '@') {
                        valore = reppuesta_rep[3][1][a][a2].split('-')

                        data_fila3 = data_fila3 + '<td><u><a onclick="registro_de_rep(' + valore[0] + ', ' + valore[1] + ', ' + valore[2] + ')" style="cursor: pointer;">' + valore[3] + '</a></u></td>'


                      } else {
                        if (reppuesta_rep[3][0][a2][0] == 'Ride') {
                          data_fila3 = data_fila3 + '<td> <a href="' + reppuesta_rep[3][1][a][a2] + '" target="_blank">Ver</a></td>'
                        } else {
                          data_fila3 = data_fila3 + '<td>' + reppuesta_rep[3][1][a][a2] + '</td>'
                        }
                      }


                    }
                  }
                  if (reppuesta_rep[3][0][a2][0] == '$vinculo_in') {
                    if (vinculo_out3 == reppuesta_rep[3][1][a][a2]) {
                      pasa_fila3 = 1
                      hay_fila3 = 1
                    }
                  }
                }
                if (pasa_fila3 == 1) {
                  dict_pestalla['p-' + t_pestalla]["vinculacion"]['3-' + a] = z
                  //data_sub3 = data_sub3 + '<tr>3-' + a + ':'+ z + '// '+ data_fila3 + '</tr>'
                  data_sub3 = data_sub3 + '<tr>' + data_fila3 + '</tr>'

                }
              }

              if (hay_fila3 == 1) {

                btn_abrir3 = '<button type="button" id="btn-' + t_pestalla + '-' + z + '-2" style="padding: 1px 6px;margin-bottom: 0px;margin-right: 0px; background-color: darkblue;color: white;" onclick="abrir_subrep(' + t_pestalla + ', ' + z + ',2)" class="btn btn-round btn-success"><span class="fa fa-plus" aria-hidden="true"></span></button>'
                data_sub2 = data_sub2.replace('**btn3**', btn_abrir3)
                data_sub2 = data_sub2 + data_sub3 + '</tbody></table></div></div></td></tr>'
              } else {
                data_sub2 = data_sub2.replace('**btn3**', '')

              }

              //------------------------------------nivel 3


            }
          }

          if (hay_fila2 == 1) {
            btn_abrir2 = '<button type="button" id="btn-' + t_pestalla + '-' + x + '-1" style="padding: 1px 6px;margin-bottom: 0px;margin-right: 0px; background-color: darkblue;color: white;" onclick="abrir_subrep(' + t_pestalla + ', ' + x + ',1)" class="btn btn-round btn-success"><span class="fa fa-plus" aria-hidden="true"></span></button>'
            data_sub = data_sub.replace('**btn2**', btn_abrir2)
            data_sub = data_sub + data_sub2 + '</tbody></table></div></div></td></tr>'
          } else {
            data_sub = data_sub.replace('**btn2**', '')

          }

          //------------------------------------nivel 2
          //data_sub = data_sub + '</tbody></table></div></div></td></tr>'

        }
      }
      data_sub = data_sub + '</tbody></table></div></div></td></tr>'
      if (hay_fila == 1) {
        data_rep = data_rep + data_sub
        btn_abrir = '<button type="button" id="btn-' + t_pestalla + '-' + y + '-0" style="padding: 1px 6px;margin-bottom: 0px;margin-right: 0px; background-color: darkblue;color: white;" onclick="abrir_subrep(' + t_pestalla + ', ' + y + ',0)" class="btn btn-round btn-success"><span class="fa fa-plus" aria-hidden="true"></span></button>'
        data_rep = data_rep.replace('**btn**', btn_abrir)
      } else {
        data_rep = data_rep.replace('**btn**', '')

      }
      //-------------------------------------------nivel 1
      //data_rep= data_rep + '</tr>'      
    }

    if (sum_t.length > 0) {
      data_rep = data_rep + '<tr><td></td>'
      for (y2 = 0; y2 < reppuesta_rep[0][0].length; y2++) {
        if (reppuesta_rep[0][0][y2][0] != '$vinculo_out' && reppuesta_rep[0][0][y2][0] != '$vinculo_in' && reppuesta_rep[0][0][y2][0][0] != '$') { if (valores_sub[reppuesta_rep[0][0][y2][0]] !== undefined) { data_rep = data_rep + '<td>' + valores_sub[reppuesta_rep[0][0][y2][0]].toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td>' } else { data_rep = data_rep + '<td> </td>' } }
      }
      data_rep = data_rep + '</tr>'
    }
    data_rep = data_rep + '</tbody></table>'
  }

  if (reppuesta_rep.length == 5) {
    data_rep = '<table width="100%" class="table  table-hover" id="dataTables-' + t_pestalla + '" style="background-color: white;margin-bottom: 0px;"><thead><tr>'
    data_rep = data_rep + '<th style="width: 15px;"></th>'

    for (y = 0; y < reppuesta_rep[0][0].length; y++) {
      if (reppuesta_rep[0][0][y][0] != '$vinculo_out' && reppuesta_rep[0][0][y][0] != '$vinculo_in' && reppuesta_rep[0][0][y][0][0] != '$') {
        data_rep = data_rep + '<th>' + reppuesta_rep[0][0][y][0] + '</th>'
      }
    }
    data_rep = data_rep + '</tr></thead><tbody>'

    for (y = 0; y < reppuesta_rep[0][1].length; y++) {
      data_rep = data_rep + '<tr><td>**btn**</td>'
      for (y2 = 0; y2 < reppuesta_rep[0][0].length; y2++) {
        vinculo_out = ''

        if (valores_sub[reppuesta_rep[0][0][y2][0]] !== undefined) {
          valores_sub[reppuesta_rep[0][0][y2][0]] = parseFloat(valores_sub[reppuesta_rep[0][0][y2][0]]) + parseFloat(reppuesta_rep[0][1][y][y2].toString().replace(',', ''))
        }

        if (reppuesta_rep[0][0][y2][0] != '$vinculo_out' && reppuesta_rep[0][0][y2][0] != '$vinculo_in' && reppuesta_rep[0][0][y2][0][0] != '$') {
          if (reppuesta_rep[0][0][y2][0] == 'imagen') {
            data_rep = data_rep + '<td><div style="width: 100px;"><div class="thumbnail" style="height: 110px;margin-bottom: 1px;"><div class="image view view-first"><img style="width: 80%;height: 80px;margin-left: auto;margin-right: auto; display: block;" src="/media/archivos/' + web_Id_empresa + '/' + reppuesta_rep[0][1][y][y2] + '" alt="image" value="0"><a href="/media/archivos/' + web_Id_empresa + '/' + reppuesta_rep[0][1][y][y2] + '" target="_blank">' + reppuesta_rep[0][1][y][y2] + '</a></div></div></div></td>'
          } else {
            if (reppuesta_rep[0][0][y2][0] == 'Ride') {
              data_rep = data_rep + '<td> <a href="' + reppuesta_rep[0][1][y][y2] + '" target="_blank">Ver</a></td>'
            } else {
              data_rep = data_rep + '<td>' + reppuesta_rep[0][1][y][y2] + '</td>'
            }
          }
        }
        if (reppuesta_rep[0][0][y2][0] == '$vinculo_out') {
          vinculo_out = reppuesta_rep[0][1][y][y2]

        }
      }
      data_rep = data_rep + '</tr>'

      //-------------------------------------------nivel 1
      data_sub = '<tr class="lin_detalle" id="dr-' + t_pestalla + '-' + y + '-0" hidden ><td colspan="15" style="padding-left: 26px;"> <div><div class="panel-body" style="overflow: scroll;padding-top: 0px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;"><table width="100%" class="table  table-hover" style="background-color: aliceblue;margin-bottom: 0px;"><thead><tr><th style="width: 15px;"></th>'

      for (x = 0; x < reppuesta_rep[1][0].length; x++) {
        if (reppuesta_rep[1][0][x][0] != '$vinculo_out' && reppuesta_rep[1][0][x][0] != '$vinculo_in' && reppuesta_rep[1][0][x][0][0] != '$') {
          data_sub = data_sub + '<th>' + reppuesta_rep[1][0][x][0] + '</th>'
        }
      }
      data_sub = data_sub + '</tr></thead><tbody>'

      hay_fila = 0
      for (x = 0; x < reppuesta_rep[1][1].length; x++) {
        data_sub = data_sub + ''
        pasa_fila = 0
        data_fila = '<td>**btn2**</td>'

        for (x2 = 0; x2 < reppuesta_rep[1][0].length; x2++) {
          if (reppuesta_rep[1][0][x2][0] != '$vinculo_out' && reppuesta_rep[1][0][x2][0] != '$vinculo_in' && reppuesta_rep[1][0][x2][0][0] != '$') {
            if (reppuesta_rep[1][0][x2][0] == 'imagen') {
              data_fila = data_fila + '<td><div style="width: 100px;"><div class="thumbnail" style="height: 110px;margin-bottom: 1px;"><div class="image view view-first"><img style="width: 80%;height: 80px; display: block;margin-left: auto;margin-right: auto;" src="/media/archivos/' + web_Id_empresa + '/' + reppuesta_rep[1][1][x][x2] + '" alt="image" value="0"><a href="/media/archivos/' + web_Id_empresa + '/' + reppuesta_rep[1][1][x][x2] + '" target="_blank">' + reppuesta_rep[1][1][x][x2] + '</a></div></div></div></td>'
            } else {
              if (reppuesta_rep[1][0][x2][0] == 'Ride') {
                data_fila = data_fila + '<td> <a href="' + reppuesta_rep[1][1][x][x2] + '" target="_blank">Ver</a></td>'
              } else {
                data_fila = data_fila + '<td>' + reppuesta_rep[1][1][x][x2] + '</td>'
              }
            }
          }
          if (reppuesta_rep[1][0][x2][0] == '$vinculo_in') {
            if (vinculo_out == reppuesta_rep[1][1][x][x2]) {
              pasa_fila = 1
              hay_fila = 1
            }
          }
          if (reppuesta_rep[1][0][x2][0] == '$vinculo_out') {
            vinculo_out2 = reppuesta_rep[1][1][x][x2]
          }
        }

        if (pasa_fila == 1) {
          dict_pestalla['p-' + t_pestalla]["vinculacion"]['1-' + x] = y
          data_sub = data_sub + '<tr>' + data_fila + '</tr>'

          //------------------------------------nivel 2


          data_sub2 = '<tr class="lin_detalle" id="dr-' + t_pestalla + '-' + x + '-1" hidden><td colspan="10" style="padding-left: 26px;"> <div><div class="panel-body" style="overflow: scroll;padding-top: 0px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;"><table width="100%" class="table  table-hover" style="background-color: white;margin-bottom: 0px;"><thead><tr><th style="width: 15px;"></th>'
          for (z = 0; z < reppuesta_rep[2][0].length; z++) {
            if (reppuesta_rep[2][0][z][0] != '$vinculo_out' && reppuesta_rep[2][0][z][0] != '$vinculo_in' && reppuesta_rep[2][0][z][0][0] != '$') {
              data_sub2 = data_sub2 + '<th>' + reppuesta_rep[2][0][z][0] + '</th>'
            }
          }
          data_sub2 = data_sub2 + '</tr></thead><tbody>'

          hay_fila2 = 0
          for (z = 0; z < reppuesta_rep[2][1].length; z++) {
            data_sub2 = data_sub2 + ''
            pasa_fila2 = 0
            data_fila2 = '<td>**btn3**</td>'

            for (z2 = 0; z2 < reppuesta_rep[2][0].length; z2++) {
              if (reppuesta_rep[2][0][z2][0] != '$vinculo_out' && reppuesta_rep[2][0][z2][0] != '$vinculo_in' && reppuesta_rep[2][0][z2][0][0] != '$') {
                if (reppuesta_rep[2][0][z2][0] == 'imagen') {
                  data_fila2 = data_fila2 + '<td><div style="width: 100px;"><div class="thumbnail" style="height: 110px;margin-bottom: 1px;"><div class="image view view-first"><img style="width: 80%;height: 80px; display: block;margin-left: auto;margin-right: auto;" src="/media/archivos/' + web_Id_empresa + '/' + reppuesta_rep[2][1][z][z2] + '" alt="image" value="0"><a href="/media/archivos/' + web_Id_empresa + '/' + reppuesta_rep[2][1][z][z2] + '" target="_blank">' + reppuesta_rep[2][1][z][z2] + '</a></div></div></div></td>'
                } else {
                  data_fila2 = data_fila2 + '<td>' + reppuesta_rep[2][1][z][z2] + '</td>'
                }
              }
              if (reppuesta_rep[2][0][z2][0] == '$vinculo_in') {
                if (vinculo_out2 == reppuesta_rep[2][1][z][z2]) {
                  pasa_fila2 = 1
                  hay_fila2 = 1
                }
              }
              if (reppuesta_rep[2][0][z2][0] == '$vinculo_out') {
                vinculo_out3 = reppuesta_rep[2][1][z][z2]
              }
            }
            if (pasa_fila2 == 1) {
              dict_pestalla['p-' + t_pestalla]["vinculacion"]['2-' + z] = x
              //data_sub2 = data_sub2 + '<tr>2-' + z + ':'+ x + '// '+ data_fila2 + '</tr>'
              data_sub2 = data_sub2 + '<tr>' + data_fila2 + '</tr>'

              //------------------------------------nivel 3


              data_sub3 = '<tr class="lin_detalle" id="dr-' + t_pestalla + '-' + z + '-2" hidden><td colspan="10" style="padding-left: 26px;"> <div><div class="panel-body" style="overflow: scroll;padding-top: 0px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;"><table width="100%" class="table table-hover" style="background-color: white;margin-bottom: 0px;"><thead><tr>'
              for (a = 0; a < reppuesta_rep[3][0].length; a++) {
                if (reppuesta_rep[3][0][a][0] != '$vinculo_out' && reppuesta_rep[3][0][a][0] != '$vinculo_in' && reppuesta_rep[3][0][a][0][0] != '$') {

                  data_sub3 = data_sub3 + '<th>' + reppuesta_rep[3][0][a][0].replace('@', '') + '</th>'
                }
              }
              data_sub3 = data_sub3 + '</tr></thead><tbody>'

              hay_fila3 = 0
              for (a = 0; a < reppuesta_rep[3][1].length; a++) {
                data_sub3 = data_sub3 + ''
                pasa_fila3 = 0
                data_fila3 = '<td>**btn4**</td>'

                for (a2 = 0; a2 < reppuesta_rep[3][0].length; a2++) {
                  if (reppuesta_rep[3][0][a2][0] != '$vinculo_out' && reppuesta_rep[3][0][a2][0] != '$vinculo_in' && reppuesta_rep[3][0][a2][0][0] != '$') {


                    if (reppuesta_rep[3][0][a2][0] == 'imagen') {
                      data_fila3 = data_fila3 + '<td><div style="width: 100px;"><div class="thumbnail" style="height: 110px;margin-bottom: 1px;"><div class="image view view-first"><img style="width: 80%;height:80px; display: block;margin-left: auto;margin-right: auto;" src="/media/archivos/' + web_Id_empresa + '/' + reppuesta_rep[3][1][a][a2] + '" alt="image" value="0"><a href="/media/archivos/' + web_Id_empresa + '/' + reppuesta_rep[3][1][a][a2] + '" target="_blank">' + reppuesta_rep[3][1][a][a2] + '</a></div></div></div></td>'
                    } else {
                      if (reppuesta_rep[3][0][a2][0][0] == '@') {
                        valore = reppuesta_rep[3][1][a][a2].split('-')

                        data_fila3 = data_fila3 + '<td><u><a onclick="registro_de_rep(' + valore[0] + ', ' + valore[1] + ', ' + valore[2] + ')" style="cursor: pointer;">' + valore[3] + '</a></u></td>'


                      } else {
                        if (reppuesta_rep[3][0][a2][0] == 'Ride') {
                          data_fila3 = data_fila3 + '<td> <a href="' + reppuesta_rep[3][1][a][a2] + '" target="_blank">Ver</a></td>'
                        } else {
                          data_fila3 = data_fila3 + '<td>' + reppuesta_rep[3][1][a][a2] + '</td>'
                        }
                      }


                    }
                  }
                  if (reppuesta_rep[3][0][a2][0] == '$vinculo_in') {
                    if (vinculo_out3 == reppuesta_rep[3][1][a][a2]) {
                      pasa_fila3 = 1
                      hay_fila3 = 1
                    }
                  }
                  if (reppuesta_rep[3][0][a2][0] == '$vinculo_out') {
                    vinculo_out4 = reppuesta_rep[3][1][a][a2]
                  }
                }
                if (pasa_fila3 == 1) {
                  dict_pestalla['p-' + t_pestalla]["vinculacion"]['3-' + a] = z
                  data_sub3 = data_sub3 + '<tr>' + data_fila3 + '</tr>'

                  //------------------------------------nivel 4

                  data_sub4 = '<tr class="lin_detalle" id="dr-' + t_pestalla + '-' + a + '-3" hidden><td colspan="10" style="padding-left: 26px;"> <div><div class="panel-body" style="overflow: scroll;padding-top: 0px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;"><table width="100%" class="table table-hover" style="background-color: white;margin-bottom: 0px;"><thead><tr>'
                  for (b = 0; b < reppuesta_rep[4][0].length; b++) {
                    if (reppuesta_rep[4][0][b][0] != '$vinculo_out' && reppuesta_rep[4][0][b][0] != '$vinculo_in' && reppuesta_rep[4][0][b][0][0] != '$') {
                      data_sub4 = data_sub4 + '<th>' + reppuesta_rep[4][0][b][0].replace('@', '') + '</th>'
                    }
                  }

                  data_sub4 = data_sub4 + '</tr></thead><tbody>'
                  hay_fila4 = 0
                  for (b = 0; b < reppuesta_rep[4][1].length; b++) {
                    data_sub4 = data_sub4 + ''
                    pasa_fila4 = 0
                    data_fila4 = ''
                    for (b2 = 0; b2 < reppuesta_rep[4][0].length; b2++) {
                      if (reppuesta_rep[4][0][b2][0] != '$vinculo_out' && reppuesta_rep[4][0][b2][0] != '$vinculo_in' && reppuesta_rep[4][0][b2][0][0] != '$') {
                        if (reppuesta_rep[4][0][b2][0] == 'imagen') {
                          data_fila4 = data_fila4 + '<td><div style="width: 100px;"><div class="thumbnail" style="height: 110px;margin-bottom: 1px;"><div class="image view view-first"><img style="width: 80%;height:80px; display: block;margin-left: auto;margin-right: auto;" src="/media/archivos/' + web_Id_empresa + '/' + reppuesta_rep[4][1][b][b2] + '" alt="image" value="0"><a href="/media/archivos/' + web_Id_empresa + '/' + reppuesta_rep[4][1][b][b2] + '" target="_blank">' + reppuesta_rep[4][1][b][b2] + '</a></div></div></div></td>'
                        } else {
                          if (reppuesta_rep[4][0][b2][0][0] == '@') {
                            valore = reppuesta_rep[4][1][b][b2].split('-')
                            data_fila4 = data_fila4 + '<td><u><a onclick="registro_de_rep(' + valore[0] + ', ' + valore[1] + ', ' + valore[2] + ')" style="cursor: pointer;">' + valore[3] + '</a></u></td>'
                          } else {
                            if (reppuesta_rep[4][0][b2][0] == 'Ride') {
                              data_fila4 = data_fila4 + '<td> <a href="' + reppuesta_rep[4][1][b][b2] + '" target="_blank">Ver</a></td>'
                            } else {
                              data_fila4 = data_fila4 + '<td>' + reppuesta_rep[4][1][b][b2] + '</td>'
                            }
                          }
                        }

                      }
                      if (reppuesta_rep[4][0][b2][0] == '$vinculo_in') {
                        if (vinculo_out4 == reppuesta_rep[4][1][b][b2]) {
                          pasa_fila4 = 1
                          hay_fila4 = 1
                        }
                      }
                    }
                    if (pasa_fila4 == 1) {
                      dict_pestalla['p-' + t_pestalla]["vinculacion"]['4-' + b] = a
                      data_sub4 = data_sub4 + '<tr>' + data_fila4 + '</tr>'
                    }
                  }


                  if (hay_fila4 == 1) {

                    btn_abrir4 = '<button type="button" id="btn-' + t_pestalla + '-' + a + '-3" style="padding: 1px 6px;margin-bottom: 0px;margin-right: 0px; background-color: darkblue;color: white;" onclick="abrir_subrep(' + t_pestalla + ', ' + a + ',3)" class="btn btn-round btn-success"><span class="fa fa-plus" aria-hidden="true"></span></button>'
                    data_sub3 = data_sub3.replace('**btn4**', btn_abrir4)
                    data_sub3 = data_sub3 + data_sub4 + '</tbody></table></div></div></td></tr>'
                  } else {
                    data_sub3 = data_sub3.replace('**btn4**', '')

                  }

                  //------------------------------------nivel 4




                }
              }

              if (hay_fila3 == 1) {

                btn_abrir3 = '<button type="button" id="btn-' + t_pestalla + '-' + z + '-2" style="padding: 1px 6px;margin-bottom: 0px;margin-right: 0px; background-color: darkblue;color: white;" onclick="abrir_subrep(' + t_pestalla + ', ' + z + ',2)" class="btn btn-round btn-success"><span class="fa fa-plus" aria-hidden="true"></span></button>'
                data_sub2 = data_sub2.replace('**btn3**', btn_abrir3)
                data_sub2 = data_sub2 + data_sub3 + '</tbody></table></div></div></td></tr>'
              } else {
                data_sub2 = data_sub2.replace('**btn3**', '')

              }

              //------------------------------------nivel 3


            }
          }

          if (hay_fila2 == 1) {
            btn_abrir2 = '<button type="button" id="btn-' + t_pestalla + '-' + x + '-1" style="padding: 1px 6px;margin-bottom: 0px;margin-right: 0px; background-color: darkblue;color: white;" onclick="abrir_subrep(' + t_pestalla + ', ' + x + ',1)" class="btn btn-round btn-success"><span class="fa fa-plus" aria-hidden="true"></span></button>'
            data_sub = data_sub.replace('**btn2**', btn_abrir2)
            data_sub = data_sub + data_sub2 + '</tbody></table></div></div></td></tr>'
          } else {
            data_sub = data_sub.replace('**btn2**', '')

          }

          //------------------------------------nivel 2
          //data_sub = data_sub + '</tbody></table></div></div></td></tr>'

        }
      }
      data_sub = data_sub + '</tbody></table></div></div></td></tr>'
      if (hay_fila == 1) {
        data_rep = data_rep + data_sub
        btn_abrir = '<button type="button" id="btn-' + t_pestalla + '-' + y + '-0" style="padding: 1px 6px;margin-bottom: 0px;margin-right: 0px; background-color: darkblue;color: white;" onclick="abrir_subrep(' + t_pestalla + ', ' + y + ',0)" class="btn btn-round btn-success"><span class="fa fa-plus" aria-hidden="true"></span></button>'
        data_rep = data_rep.replace('**btn**', btn_abrir)
      } else {
        data_rep = data_rep.replace('**btn**', '')

      }
      //-------------------------------------------nivel 1
      //data_rep= data_rep + '</tr>'      
    }

    if (sum_t.length > 0) {
      data_rep = data_rep + '<tr><td></td>'
      for (y2 = 0; y2 < reppuesta_rep[0][0].length; y2++) {
        if (reppuesta_rep[0][0][y2][0] != '$vinculo_out' && reppuesta_rep[0][0][y2][0] != '$vinculo_in' && reppuesta_rep[0][0][y2][0][0] != '$') { if (valores_sub[reppuesta_rep[0][0][y2][0]] !== undefined) { data_rep = data_rep + '<td>' + valores_sub[reppuesta_rep[0][0][y2][0]].toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td>' } else { data_rep = data_rep + '<td> </td>' } }
      }
      data_rep = data_rep + '</tr>'
    }
    data_rep = data_rep + '</tbody></table>'
  }


  dict_pestalla['p-' + t_pestalla]['sum_totales'] = valores_sub
  return data_rep

}

function pdf_reportedet(temp_pest, fila) {

  reppuesta_rep = dict_pestalla['p-' + temp_pest]
  var date = new Date()

  var vinculos = []
  for (z = 0; z < reppuesta_rep["resutado"][0][0].length; z++) {
    if (reppuesta_rep["resutado"][0][0][z][0] == '$vinculo') {
      vinculos.push(z)
    }
  }

  for (z = 0; z < reppuesta_rep["resutado"][1][0].length; z++) {
    if (reppuesta_rep["resutado"][1][0][z][0] == '$vinculo') {
      vinculos.push(z)
    }
  }




  var dbvariables = ""

  for (x2 = 0; x2 < Object.keys(reppuesta_rep["repvariables"]).length; x2++) {
    dbvariables = dbvariables + reppuesta_rep["label"][Object.keys(reppuesta_rep['repvariables'])[x2]] + ": " + reppuesta_rep["repvariables"][Object.keys(reppuesta_rep['repvariables'])[x2]] + ' / '
  }
  for (x2 = 0; x2 < Object.keys(reppuesta_rep["repreferencias"]).length; x2++) {
    dbvariables = dbvariables + reppuesta_rep["label"][Object.keys(reppuesta_rep['repreferencias'])[x2]] + ": " + reppuesta_rep["repreferencias"][Object.keys(reppuesta_rep['repreferencias'])[x2]] + ' / '
  }
  var tipo_pag = ''

  if (reppuesta_rep["repstilo"][0]["posicion"] == "Horizontal") {
    tipo_pag = 'landscape'

  }

  var doc = new jsPDF(tipo_pag);



  doc.setFontSize(10);
  doc.text(10, 10, '' + web_Id_empresa + ': ' + reppuesta_rep["nombre_rep"] + ', ' + web_idioma_fecha + ':' + date.toLocaleDateString() + " " + date.toLocaleTimeString());
  doc.text(10, 15, dbvariables.substring(0, dbvariables.length - 2));

  var conv_cc = 0.375
  var filaX = 10
  var filaY = 25

  columnas = reppuesta_rep["repstilo"][0]["columnas"].split(',')
  columnas_largo = reppuesta_rep["repstilo"][0]["largos"].split(',')

  imprimio_cabecera = false

  filaX = 10

  for (x2 = 0; x2 < columnas.length; x2++) {
    doc.line(filaX - 0.5, filaY - 5, filaX - 0.5, filaY + 0.5);
    doc.line(filaX - 0.5, filaY - 5, filaX + (columnas_largo[x2] * conv_cc) - 0.5, filaY - 5);

    doc.text(filaX, filaY, columnas[x2]);
    filaX = filaX + (columnas_largo[x2] * conv_cc)
  }
  doc.line(filaX - 0.5, filaY - 5, filaX - 0.5, filaY + 0.5);
  doc.line(filaX - 0.5, filaY - 5, filaX + (columnas_largo[x2] * conv_cc) - 0.5, filaY - 5);

  imprimio_cabecera = true
  filaY = filaY + 5

  filaX = 10
  for (x2 = 0; x2 < columnas.length; x2++) {
    for (x3 = 0; x3 < reppuesta_rep["resutado"][0][0].length; x3++) {
      if (reppuesta_rep["resutado"][0][0][x3][0] == columnas[x2]) {
        doc.line(filaX - 0.5, filaY - 4.5, filaX - 0.5, filaY + 0.5);
        doc.line(filaX - 0.5, filaY - 4.5, (filaX + (columnas_largo[x2] * conv_cc)) - 0.5, filaY - 4.5,);

        var escri = reppuesta_rep["resutado"][0][1][fila][x3]
        if ((escri.length * 6.5) > columnas_largo[x2]) { escri = escri.substring(0, Math.round(columnas_largo[x2] / 6.5)) + '...' }
        if (isNaN(escri) == false) {
          //doc.text(filaX + ( (columnas_largo[x2] * conv_cc)-2) , filaY, escri.toString(), 'right');
          doc.text(filaX, filaY, escri.toString(), 'right');
        } else {
          if (isNaN(escri.replace(/,/g, '')) = false) {
            doc.text(filaX, filaY, escri.toString(), 'right');
          } else {
            doc.text(filaX, filaY, escri.toString());
          }



        }
      }
    }
    filaX = filaX + (columnas_largo[x2] * conv_cc)
    doc.line(filaX - 0.5, filaY - 4.5, filaX - 0.5, filaY + 0.5);
    //doc.line(filaX , filaY - 5 , (filaX  + (columnas_largo[x2] * conv_cc)) , filaY- 5);
  }
  filaY = filaY + 5


  //valor


  var imprimio_cabeceradet = false
  columnasdet = reppuesta_rep["repstilo"][1]["columnas"].split(',')
  columnas_largodet = reppuesta_rep["repstilo"][1]["largos"].split(',')
  var entro = false
  for (y = 0; y < reppuesta_rep["resutado"][1][1].length; y++) {

    if (reppuesta_rep["resutado"][0][1][fila][vinculos[0]] == reppuesta_rep["resutado"][1][1][y][vinculos[1]]) {

      if (filaY > (40 * 5)) {
        doc.line(10 - 0.5, filaY - 4.5, filaX - 0.5, filaY - 4.5);

        doc.addPage(tipo_pag)
        doc.text(10, 10, '' + web_Id_empresa + ': ' + reppuesta_rep["nombre_rep"] + ', ' + web_idioma_fecha + ':' + date.toLocaleDateString() + " " + date.toLocaleTimeString());
        doc.text(10, 15, dbvariables.substring(0, dbvariables.length - 2));
        filaY = 25
        imprimio_cabecera = false
      }


      if (entro == false) {
        doc.line(10 - 0.5, filaY - 4.5, filaX - 0.5, filaY - 4.5);
        filaY = filaY + 2.5
      };

      entro = true
      filaX = reppuesta_rep["repstilo"][1]["tab"] * conv_cc

      if (imprimio_cabeceradet == false && reppuesta_rep["repstilo"][1]["Cabecera"] == 'Si') {

        for (y2 = 0; y2 < columnasdet.length; y2++) {
          doc.line(filaX - 0.5, filaY - 5, filaX - 0.5, filaY + 0.5);
          doc.line(filaX - 0.5, filaY - 5, filaX + (columnas_largodet[y2] * conv_cc) - 0.5, filaY - 5);

          doc.text(filaX, filaY, columnasdet[y2]);
          filaX = filaX + (columnas_largodet[y2] * conv_cc)

        }

        doc.line(filaX - 0.5, filaY - 5, filaX - 0.5, filaY);
        doc.line(filaX - 0.5, filaY - 5, filaX + (columnas_largodet[x2] * conv_cc) - 0.5, filaY - 5);

        imprimio_cabeceradet = true
        filaY = filaY + 5
      }

      filaX = reppuesta_rep["repstilo"][1]["tab"] * conv_cc
      for (y2 = 0; y2 < columnasdet.length; y2++) {
        for (y3 = 0; y3 < reppuesta_rep["resutado"][1][0].length; y3++) {
          if (reppuesta_rep["resutado"][1][0][y3][0] == columnasdet[y2]) {
            doc.line(filaX - 0.5, filaY - 4.5, filaX - 0.5, filaY + 0.5);
            doc.line(filaX - 0.5, filaY - 4.5, (filaX + (columnas_largodet[y2] * conv_cc)) - 0.5, filaY - 4.5,);

            var escri = reppuesta_rep["resutado"][1][1][y][y3]
            if ((escri.length * 6.5) > columnas_largodet[y2]) { escri = escri.substring(0, Math.round(columnas_largodet[y2] / 6.5)) + '...' }
            if (isNaN(escri) == false) {
              doc.text(filaX, filaY, escri.toString(), 'right');
            } else {
              if (iisNaN(escri.replace(/,/g, '')) = false) {
                doc.text(filaX, filaY, escri.toString(), 'right');
              } else {
                doc.text(filaX, filaY, escri.toString());
              }

              //doc.text(filaX + ( (columnas_largodet[y2] * conv_cc)-2) , filaY, escri.toString(), 'right');
            }
          }
        }
        filaX = filaX + (columnas_largodet[y2] * conv_cc)
        doc.line(filaX - 0.5, filaY - 4.5, filaX - 0.5, filaY + 0.5);
        //doc.line(filaX , filaY - 5 , (filaX  + (columnas_largo[x2] * conv_cc)) , filaY- 5);
      }
      filaY = filaY + 5

      if (reppuesta_rep["repstilo"][1]["cabeceras"] == true) { imprimio_cabecera = false }

    }
  }
  if (entro == true) {
    doc.line(reppuesta_rep["repstilo"][1]["tab"] * conv_cc - 0.5, filaY - 4.5, filaX - 0.5, filaY - 4.5);
    filaY = filaY + 2.5
  }


  if (filaY > (40 * 5)) {
    doc.line(10 - 0.5, filaY - 4.5, filaX - 0.5, filaY - 4.5);

    doc.addPage(tipo_pag)
    doc.text(10, 10, '' + web_Id_empresa + ': ' + reppuesta_rep["nombre_rep"] + ', ' + web_idioma_fecha + ':' + date.toLocaleDateString() + " " + date.toLocaleTimeString());
    doc.text(10, 15, dbvariables.substring(0, dbvariables.length - 2));
    filaY = 25
    imprimio_cabecera = false
  }




  doc.line(10 - 0.5, filaY - 4.5, filaX - 0.5, filaY - 4.5);

  doc.save(reppuesta_rep["nombre_rep"] + '_' + date.toLocaleDateString() + " " + date.toLocaleTimeString() + '.pdf');

}
function footer(doc, pag, sx) {
  var totalPagesExp = "{total_pages_count_string}";

  var str = pag;
  if (typeof doc.putTotalPages === 'function') {
    str = str + " - " + totalPagesExp;
  }
  if (sx == "Horizontal") {
    doc.text(324, 15, str, 'right'); //print number bottom right
  } else {
    doc.text(235, 15, str, 'right'); //print number bottom right
  }
}

function excell_calendario() {
  z_campos = document.getElementById("calendar_date")
  var v_fecha = new Date(z_campos.value);


  var show_tipo = ''
  if (document.getElementById('calen_calendar-dia').className == 'active') {
    show_tipo = 'table_calen_dia'
  } else {
    if (document.getElementById('calen_calendar-sem').className == 'active') {
      show_tipo = 'table_calen_sem'
    } else {
      show_tipo = 'table_calen_mes'
    }
  }


  var tab_text = "<table border='2px'><tr bgcolor='#87AFC6'>";
  var textRange; var j = 0;
  tab = document.getElementById(show_tipo); // id of table


  val_det = true

  for (j = 0; j < tab.rows.length; j++) {



    if (val_det == true) {
      tab_text = tab_text + tab.rows[j].innerHTML + "</tr>";
    } else {
      if ((tab.rows[j].innerHTML.substring(0, 17) != '<td colspan="15" style="padding-left: 26px;">')) {
        tab_text = tab_text + tab.rows[j].innerHTML + "</tr>";
      }
    }




    //tab_text=tab_text+"</tr>";
  }

  tab_text = tab_text + "</table>";
  tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
  tab_text = tab_text.replace(/<img[^>]*>/gi, ""); // remove if u want images in your table
  tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

  tab_text = tab_text.replace(/<ul.*ul>/g, '')

  var ua = window.navigator.userAgent;
  var msie = ua.indexOf("MSIE ");

  if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
  {
    txtArea1.document.open("txt/html", "replace");
    txtArea1.document.write(tab_text);
    txtArea1.document.close();
    txtArea1.focus();
    sa = txtArea1.document.execCommand("SaveAs", true, "Say Thanks to Sumit.xls");
  }
  else                 //other browser not tested on IE 11
    sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));

  return (sa);

}


////////////////////////////////////////////
function pdf_reporte(temp_pest) {

  reppuesta_rep = dict_pestalla['p-' + temp_pest]
  var date = new Date()




  if (reppuesta_rep["resutado"].length > 1) {

    val_det = document.getElementById('det_rep-' + temp_pest)

    var detalle = val_det.checked


    var vinculos = []
    for (z = 0; z < reppuesta_rep["resutado"][0][0].length; z++) {
      if (reppuesta_rep["resutado"][0][0][z][0] == '$vinculo_out') {
        vinculos.push(z)
      }
    }

    for (z = 0; z < reppuesta_rep["resutado"][1][0].length; z++) {
      if (reppuesta_rep["resutado"][1][0][z][0] == '$vinculo_in') {
        vinculos.push(z)
      }
    }
    if (reppuesta_rep["resutado"].length > 2) {
      for (z = 0; z < reppuesta_rep["resutado"][1][0].length; z++) {
        if (reppuesta_rep["resutado"][1][0][z][0] == '$vinculo_out') {
          vinculos.push(z)
        }
      }
      for (z = 0; z < reppuesta_rep["resutado"][2][0].length; z++) {
        if (reppuesta_rep["resutado"][2][0][z][0] == '$vinculo_in') {
          vinculos.push(z)
        }
      }
    }
    if (reppuesta_rep["resutado"].length > 3) {
      for (z = 0; z < reppuesta_rep["resutado"][2][0].length; z++) {
        if (reppuesta_rep["resutado"][2][0][z][0] == '$vinculo_out') {
          vinculos.push(z)
        }
      }
      for (z = 0; z < reppuesta_rep["resutado"][3][0].length; z++) {
        if (reppuesta_rep["resutado"][3][0][z][0] == '$vinculo_in') {
          vinculos.push(z)
        }
      }
    }


  } else {
    var detalle = false
  }
  var mx_pag = 0
  var cc_pag = 1
  var limite_lineas = 45
  if (reppuesta_rep["repstilo"][0]["posicion"] == "Horizontal") {
    limite_lineas = 40
  } else {
    limite_lineas = 57
  }
  var alto = 0
  var ancho = 0

  if(reppuesta_rep["repstilo"][0]["Arch_Excell"] != ""){
    Arch_Excell = reppuesta_rep["repstilo"][0]["Arch_Excell"].split(',')
    limite_lineas = parseInt(Arch_Excell[0])
    if(Arch_Excell.length == 3){
      alto = Arch_Excell[1]
      ancho = Arch_Excell[2]
    }

  }


  if (detalle == false) {


    if (reppuesta_rep["repstilo"][0]["posicion"] == "Horizontal") {
      mx_pag = parseInt(reppuesta_rep["resutado"][0][1].length / 33)
      limite_lineas = 33
    } else {
      mx_pag = parseInt(reppuesta_rep["resutado"][0][1].length / 50)
      limite_lineas = 50
    }

    

  } else {
    if (reppuesta_rep["repstilo"][0]["posicion"] == "Horizontal") {
      mx_pag = parseInt((reppuesta_rep["resutado"][0][1].length + reppuesta_rep["resutado"][1][1].length) / 33)
    } else {
      mx_pag = parseInt((reppuesta_rep["resutado"][0][1].length + reppuesta_rep["resutado"][1][1].length) / 50)
    }
  }
  if (mx_pag == 0) { mx_pag = 1 }


  var dbvariables = ""

  for (x2 = 0; x2 < Object.keys(reppuesta_rep["repvariables"]).length; x2++) {
    dbvariables = dbvariables + reppuesta_rep["label"][Object.keys(reppuesta_rep['repvariables'])[x2]] + ":" + reppuesta_rep["repvariables"][Object.keys(reppuesta_rep['repvariables'])[x2]] + ', '
  }
  for (x2 = 0; x2 < Object.keys(reppuesta_rep["repreferencias"]).length; x2++) {
    dbvariables = dbvariables + reppuesta_rep["label"][Object.keys(reppuesta_rep['repreferencias'])[x2]] + ":" + reppuesta_rep["repreferencias"][Object.keys(reppuesta_rep['repreferencias'])[x2]] + ', '
  }
  dbvariables = dbvariables.substring(0, dbvariables.length - 2)

  var tipo_pag = ''
  var largo_var = 200

  if (reppuesta_rep["repstilo"][0]["posicion"] == "Horizontal") {
    tipo_pag = 'landscape'
    largo_var = 300
  }

  if(alto == 0){
    var doc = new jsPDF(tipo_pag);
  }else{
    if (reppuesta_rep["repstilo"][0]["posicion"] == "Horizontal") {
      var doc = new jsPDF('l', 'mm', [ancho ,alto] );
    }else{
      var doc = new jsPDF('p', 'mm', [ancho ,alto] );
    }
  }

  var lines_var = doc.splitTextToSize(dbvariables.toString(), largo_var);

  var new_lines_var = []
  for (cv = 0; cv < lines_var.length; cv++) {
    if (lines_var[cv] != '') {
      new_lines_var.push(lines_var[cv])
    }
  }





  doc.page = 1
  var totalPagesExp = "{total_pages_count_string}";

  imagen = document.getElementById("logo_cia")
  tipo = imagen.attributes["value"]["value"].split('.')
  var imgData = getBase64Image(imagen, 300, 100)
  try {
    doc.addImage(imgData, tipo[1].toUpperCase(), 5, 5, 30, 10)
  }
  catch (error) {
    console.error(error);
    // expected output: ReferenceError: nonExistentFunction is not defined
    // Note - error messages will vary depending on browser
  }
  doc.setDrawColor(109, 118, 165)
  doc.setFillColor(109, 118, 165)

  if (reppuesta_rep["repstilo"][0]["posicion"] == "Horizontal") {
    doc.rect(75, 11, 215, 0.5, 'F')
    doc.setFontStyle('bold');

    doc.setFontSize(9);
    doc.text(75, 10, reppuesta_rep["nombre_rep"]);
    doc.text(290, 10, '' + web_usuario + ' - ' + date.toLocaleDateString() + " " + date.toLocaleTimeString(), 'right');
    //doc.text(290, 15, cc_pag + " - " + mx_pag ,'right');

    doc.text(75, 15, new_lines_var);
    doc.setFontStyle('normal');
    footer(doc, 1, reppuesta_rep["repstilo"][0]["posicion"])

  } else {
    doc.rect(65, 11, 136, 0.5, 'F')

    doc.setFontStyle('bold');

    doc.setFontSize(9);
    doc.text(65, 10, reppuesta_rep["nombre_rep"]);
    doc.text(200, 10, '' + web_usuario + ' - ' + date.toLocaleDateString() + " " + date.toLocaleTimeString(), 'right');
    //doc.text(200, 15, cc_pag + " - " + mx_pag ,'right');

    doc.text(65, 15, new_lines_var);
    doc.setFontStyle('normal');

    footer(doc, 1, reppuesta_rep["repstilo"][0]["posicion"])

  }




  var conv_cc = 0.345
  var filaX = 5
  var filaY = 25

  columnas = reppuesta_rep["repstilo"][0]["columnas"].split(',')
  columnas_largo = reppuesta_rep["repstilo"][0]["largos"].split(',')

  imprimio_cabecera = false
  for (x = 0; x < reppuesta_rep["resutado"][0][1].length; x++) {  // row de datos nivel 0

    filaX = 5
    if (imprimio_cabecera == false) {

      ///////////////////////cabecera nivel 0
      for (x2 = 0; x2 < columnas.length; x2++) {
        if (reppuesta_rep["repstilo"][0]["colores"] != null) {

          var colores = reppuesta_rep["repstilo"][0]["colores"].split(';')
          doc.setDrawColor(parseInt(colores[0].split(',')[0]), parseInt(colores[0].split(',')[1]), parseInt(colores[0].split(',')[2]))
          doc.setFillColor(parseInt(colores[0].split(',')[0]), parseInt(colores[0].split(',')[1]), parseInt(colores[0].split(',')[2]))
          doc.rect(filaX - 0.5, filaY - 4.5, ((columnas_largo[x2] * conv_cc)) - 0.5, 5, 'F')

          doc.setDrawColor(109, 118, 165)
          doc.setFillColor(109, 118, 165)

        }



        doc.line(filaX - 0.5, filaY - 5, filaX - 0.5, filaY + 0.5);
        doc.line(filaX - 0.5, filaY - 5, filaX + (columnas_largo[x2] * conv_cc) - 0.5, filaY - 5);

        doc.text(filaX, filaY, columnas[x2]);
        filaX = filaX + (columnas_largo[x2] * conv_cc)
      }
      doc.line(filaX - 0.5, filaY - 5, filaX - 0.5, filaY + 0.5);
      //doc.line(filaX-0.5 , filaY - 5 , filaX  + (columnas_largo[x2] * conv_cc) -0.5  , filaY- 5);
      ///////////////////cabecera nivel 0

      imprimio_cabecera = true
      filaY = filaY + 5
    }

    filaX = 5

    ///////////////////data nivel 0
    for (x2 = 0; x2 < columnas.length; x2++) { // columnas a imprimir


      if (reppuesta_rep["repstilo"][0]["colores"] != null) {

        var colores = reppuesta_rep["repstilo"][0]["colores"].split(';')
        doc.setDrawColor(parseInt(colores[1].split(',')[0]), parseInt(colores[1].split(',')[1]), parseInt(colores[1].split(',')[2]))
        doc.setFillColor(parseInt(colores[1].split(',')[0]), parseInt(colores[1].split(',')[1]), parseInt(colores[1].split(',')[2]))
        doc.rect(filaX - 0.5, filaY - 4.5, ((columnas_largo[x2] * conv_cc)) - 0.5, 5, 'F')

        doc.setDrawColor(109, 118, 165)
        doc.setFillColor(109, 118, 165)

      }
      for (x3 = 0; x3 < reppuesta_rep["resutado"][0][0].length; x3++) { // columnas ttoales que existen
        if (reppuesta_rep["resutado"][0][0][x3][0] == columnas[x2]) {  // si esta en la columa la pinto al doc
          doc.line(filaX - 0.5, filaY - 4.5, filaX - 0.5, filaY + 0.5);
          doc.line(filaX - 0.5, filaY - 4.5, (filaX + (columnas_largo[x2] * conv_cc)) - 0.5, filaY - 4.5,);

          var escri = reppuesta_rep["resutado"][0][1][x][x3]
          if ((escri.length * 5.5) > columnas_largo[x2]) { escri = escri.substring(0, Math.round(columnas_largo[x2] / 5.5)) + '...' }
          //alert(escri.toString() + '  // ' + (filaX + ( (columnas_largo[x2] * conv_cc)-2))  + '  / ' + filaY )
          //alert(escri.toString())
          if (isNaN(escri) == false) {
            doc.text(filaX + ((columnas_largo[x2] * conv_cc) - 2), filaY, escri.toString(), 'right');
          } else {
            if (isNaN(escri.replace(/,/g, '')) == false) {
              doc.text(filaX + ((columnas_largo[x2] * conv_cc) - 2), filaY, escri.toString(), 'right');
            } else {
              doc.text(filaX, filaY, escri.toString());
            }
          }
        }
      }
      filaX = filaX + (columnas_largo[x2] * conv_cc)
      doc.line(filaX - 0.5, filaY - 4.5, filaX - 0.5, filaY + 0.5);
      //doc.line(filaX , filaY - 5 , (filaX  + (columnas_largo[x2] * conv_cc)) , filaY- 5);
    }

    filaY = filaY + 5


    //valor

    if (detalle == true) {

      var imprimio_cabeceradet = false
      columnasdet = reppuesta_rep["repstilo"][1]["columnas"].split(',')
      columnas_largodet = reppuesta_rep["repstilo"][1]["largos"].split(',')
      var entro = false
      var desgloses = {}

      for (y2 = 0; y2 < columnasdet.length; y2++) {
        if (columnasdet[y2].substring(0, 2) == '$@') {
          des = columnasdet[y2].split('@')
          des2 = des[1].split(';')
          desgloses[columnasdet[y2]] = reppuesta_rep["resutado"][0][1][x][des2[0]]
        }
      }

      for (y = 0; y < reppuesta_rep["resutado"][1][1].length; y++) {

        if (reppuesta_rep["resutado"][0][1][x][vinculos[0]] == reppuesta_rep["resutado"][1][1][y][vinculos[1]]) {
          if (reppuesta_rep["repstilo"][0]["posicion"] == "Horizontal") {
            if (filaY > (limite_lineas * 5)) {
              doc.line(5 - 0.5, filaY - 4.5, filaX - 0.5, filaY - 4.5);

              if(alto == 0){
                doc.addPage(tipo_pag)
              }else{
                if (reppuesta_rep["repstilo"][0]["posicion"] == "Horizontal") {
                  doc.addPage('l', 'mm', [ancho ,alto] )
                }else{
                  doc.addPage('p', 'mm', [ancho ,alto] )
                }
              }
              cc_pag = cc_pag + 1
              footer(doc, cc_pag, reppuesta_rep["repstilo"][0]["posicion"])
              imagen = document.getElementById("logo_cia")
              tipo = imagen.attributes["value"]["value"].split('.')
              var imgData = getBase64Image(imagen, 300, 100)
              try {
                doc.addImage(imgData, tipo[1].toUpperCase(), 5, 5, 30, 10)
              }
              catch (error) {
                console.error(error);
                // expected output: ReferenceError: nonExistentFunction is not defined
                // Note - error messages will vary depending on browser
              }
              doc.setDrawColor(109, 118, 165)
              doc.setFillColor(109, 118, 165)
              doc.rect(75, 11, 215, 0.5, 'F')
              doc.setFontStyle('bold');
              doc.setFontSize(9);
              doc.text(75, 10, reppuesta_rep["nombre_rep"]);
              doc.text(290, 10, '' + web_usuario + ' - ' + date.toLocaleDateString() + " " + date.toLocaleTimeString(), 'right');
              doc.text(75, 15, new_lines_var);
              doc.setFontStyle('normal');
              filaY = 25
              imprimio_cabecera = false
            }
          } else {
            if (filaY > (limite_lineas * 5)) {
              doc.line(5 - 0.5, filaY - 4.5, filaX - 0.5, filaY - 4.5);

              if(alto == 0){
                doc.addPage(tipo_pag)
              }else{
                if (reppuesta_rep["repstilo"][0]["posicion"] == "Horizontal") {
                  doc.addPage('l', 'mm', [ancho ,alto] )
                }else{
                  doc.addPage('p', 'mm', [ancho ,alto] )
                }
              }
              cc_pag = cc_pag + 1
              footer(doc, cc_pag, reppuesta_rep["repstilo"][0]["posicion"])
              imagen = document.getElementById("logo_cia")
              tipo = imagen.attributes["value"]["value"].split('.')
              var imgData = getBase64Image(imagen, 300, 100)
              try {
                doc.addImage(imgData, tipo[1].toUpperCase(), 5, 5, 30, 10)
              }
              catch (error) {
                console.error(error);
                // expected output: ReferenceError: nonExistentFunction is not defined
                // Note - error messages will vary depending on browser
              }
              doc.setDrawColor(109, 118, 165)
              doc.setFillColor(109, 118, 165)


              doc.rect(65, 11, 136, 0.5, 'F')


              doc.setFontStyle('bold');

              doc.setFontSize(9);
              doc.text(65, 10, reppuesta_rep["nombre_rep"]);
              doc.text(200, 10, '' + web_usuario + ' - ' + date.toLocaleDateString() + " " + date.toLocaleTimeString(), 'right');
              doc.text(200, 15, cc_pag + " - " + mx_pag, 'right');

              doc.text(65, 15, new_lines_var);
              doc.setFontStyle('normal');



              filaY = 25
              imprimio_cabecera = false
            }
          }

          if (entro == false) {
            doc.line(5 - 0.5, filaY - 4.5, filaX - 0.5, filaY - 4.5);
            filaY = filaY + 2.5
          };

          entro = true
          filaX = reppuesta_rep["repstilo"][1]["tab"] * conv_cc
          if (imprimio_cabeceradet == false && reppuesta_rep["repstilo"][1]["Cabecera"] == 'Si') {
            for (y2 = 0; y2 < columnasdet.length; y2++) {
              if (reppuesta_rep["repstilo"][1]["colores"] != null) {

                var colores = reppuesta_rep["repstilo"][1]["colores"].split(';')
                doc.setDrawColor(parseInt(colores[0].split(',')[0]), parseInt(colores[0].split(',')[1]), parseInt(colores[0].split(',')[2]))
                doc.setFillColor(parseInt(colores[0].split(',')[0]), parseInt(colores[0].split(',')[1]), parseInt(colores[0].split(',')[2]))
                doc.rect(filaX - 0.5, filaY - 4.5, ((columnas_largodet[y2] * conv_cc)) - 0.5, 5, 'F')

                doc.setDrawColor(109, 118, 165)
                doc.setFillColor(109, 118, 165)
              }

              doc.line(filaX - 0.5, filaY - 5, filaX - 0.5, filaY + 0.5);
              doc.line(filaX - 0.5, filaY - 5, filaX + (columnas_largodet[y2] * conv_cc) - 0.5, filaY - 5);
              if (columnasdet[y2].substring(0, 2) == '$@') {
                des = columnasdet[y2].split('@')
                doc.text(filaX, filaY, des[2]);
              } else {
                doc.text(filaX, filaY, columnasdet[y2]);
              }
              filaX = filaX + (columnas_largodet[y2] * conv_cc)
            }

            doc.line(filaX - 0.5, filaY - 5, filaX - 0.5, filaY);
            doc.line(filaX - 0.5, filaY - 5, filaX + (columnas_largodet[x2] * conv_cc) - 0.5, filaY - 5);

            imprimio_cabeceradet = true
            filaY = filaY + 5
          }

          filaX = reppuesta_rep["repstilo"][1]["tab"] * conv_cc
          for (y2 = 0; y2 < columnasdet.length; y2++) {
            if (reppuesta_rep["repstilo"][1]["colores"] != null) {
              var colores = reppuesta_rep["repstilo"][1]["colores"].split(';')
              doc.setDrawColor(parseInt(colores[1].split(',')[0]), parseInt(colores[1].split(',')[1]), parseInt(colores[1].split(',')[2]))
              doc.setFillColor(parseInt(colores[1].split(',')[0]), parseInt(colores[1].split(',')[1]), parseInt(colores[1].split(',')[2]))

              doc.rect(filaX - 0.5, filaY - 4.5, ((columnas_largodet[y2] * conv_cc)) - 0.5, 5, 'F')

              doc.setDrawColor(109, 118, 165)
              doc.setFillColor(109, 118, 165)

            }

            for (y3 = 0; y3 < reppuesta_rep["resutado"][1][0].length; y3++) {

              if (reppuesta_rep["resutado"][1][0][y3][0] == columnasdet[y2]) {
                doc.line(filaX - 0.5, filaY - 4.5, filaX - 0.5, filaY + 0.5);
                doc.line(filaX - 0.5, filaY - 4.5, (filaX + (columnas_largodet[y2] * conv_cc)) - 0.5, filaY - 4.5,);
                var escri = ''
                if (columnasdet[y2].substring(0, 2) == '$@') {
                  des = columnasdet[y2].split('@')
                  des2 = des[1].split(';')
                  vallr = 0

                  if (des2[2] == 0) {
                    vallr = desgloses[columnasdet[y2]]

                  }
                  if (des2[2] == 1) {
                    vallr = parseFloat(desgloses[columnasdet[y2]]) + parseFloat(reppuesta_rep["resutado"][1][1][y][des2[1]])
                  }
                  escri = setTwoNumberDecimal(vallr, 2)
                  desgloses[columnasdet[y2]] = parseFloat(desgloses[columnasdet[y2]]) + parseFloat(reppuesta_rep["resutado"][1][1][y][des2[1]])
                } else {
                  escri = reppuesta_rep["resutado"][1][1][y][y3]
                }


                if ((escri.length * 5.5) > columnas_largodet[y2]) { escri = escri.substring(0, Math.round(columnas_largodet[y2] / 5.5)) + '...' }
                if (isNaN(escri) == false) {
                  doc.text(filaX + ((columnas_largodet[y2] * conv_cc) - 2), filaY, escri.toString(), 'right');
                } else {
                  if (isNaN(escri.replace(/,/g, '')) == false) {
                    doc.text(filaX + ((columnas_largodet[y2] * conv_cc) - 2), filaY, escri.toString(), 'right');
                  } else {
                    doc.text(filaX, filaY, escri.toString());
                  }
                }
              }
            }
            filaX = filaX + (columnas_largodet[y2] * conv_cc)
            doc.line(filaX - 0.5, filaY - 4.5, filaX - 0.5, filaY + 0.5);
          }
          filaY = filaY + 5

          if (reppuesta_rep["resutado"].length > 2) {

            var imprimio_cabecerasdetsub = false
            columnasdetsub = reppuesta_rep["repstilo"][2]["columnas"].split(',')
            columnas_largodetsub = reppuesta_rep["repstilo"][2]["largos"].split(',')
            var entrosub = false
            var desglosessub = {}

            for (z2 = 0; z2 < columnasdetsub.length; z2++) {
              if (columnasdetsub[z2].substring(0, 2) == '$@') {
                dessub = columnasdetsub[z2].split('@')
                des2sub = dessub[1].split(';')
                desglosessub[columnasdetsub[z2]] = reppuesta_rep["resutado"][1][1][y][des2sub[0]]
              }
            }

            ///////////////////////
            for (z = 0; z < reppuesta_rep["resutado"][2][1].length; z++) {
              if (reppuesta_rep["resutado"][1][1][y][vinculos[2]] == reppuesta_rep["resutado"][2][1][z][vinculos[3]]) {
                doc.line(reppuesta_rep["repstilo"][2]["tab"] * conv_cc - 0.5, filaY - 4.5, filaX - 0.5, filaY - 4.5);


                if (reppuesta_rep["repstilo"][0]["posicion"] == "Horizontal") {
                  if (filaY > (limite_lineas * 5)) {
                    doc.line(5 - 0.5, filaY - 4.5, filaX - 0.5, filaY - 4.5);

                    if(alto == 0){
                      doc.addPage(tipo_pag)
                    }else{
                      if (reppuesta_rep["repstilo"][0]["posicion"] == "Horizontal") {
                        doc.addPage('l', 'mm', [ancho ,alto] )
                      }else{
                        doc.addPage('p', 'mm', [ancho ,alto] )
                      }
                    }
                    cc_pag = cc_pag + 1
                    footer(doc, cc_pag, reppuesta_rep["repstilo"][0]["posicion"])
                    imagen = document.getElementById("logo_cia")
                    tipo = imagen.attributes["value"]["value"].split('.')
                    var imgData = getBase64Image(imagen, 300, 100)
                    try {
                      doc.addImage(imgData, tipo[1].toUpperCase(), 5, 5, 30, 10)
                    }
                    catch (error) {
                      console.error(error);
                      // expected output: ReferenceError: nonExistentFunction is not defined
                      // Note - error messages will vary depending on browser
                    }
                    doc.setDrawColor(109, 118, 165)
                    doc.setFillColor(109, 118, 165)
                    doc.rect(75, 11, 215, 0.5, 'F')
                    doc.setFontStyle('bold');
                    doc.setFontSize(9);
                    doc.text(75, 10, reppuesta_rep["nombre_rep"]);
                    doc.text(290, 10, '' + web_usuario + ' - ' + date.toLocaleDateString() + " " + date.toLocaleTimeString(), 'right');
                    doc.text(75, 15, new_lines_var);
                    doc.setFontStyle('normal');
                    filaY = 25
                    imprimio_cabecera = false
                  }
                } else {
                  if (filaY > (limite_lineas * 5)) {
                    doc.line(5 - 0.5, filaY - 4.5, filaX - 0.5, filaY - 4.5);

                    if(alto == 0){
                      doc.addPage(tipo_pag)
                    }else{
                      if (reppuesta_rep["repstilo"][0]["posicion"] == "Horizontal") {
                        doc.addPage('l', 'mm', [ancho ,alto] )
                      }else{
                        doc.addPage('p', 'mm', [ancho ,alto] )
                      }
                    }
                    cc_pag = cc_pag + 1
                    footer(doc, cc_pag, reppuesta_rep["repstilo"][0]["posicion"])
                    imagen = document.getElementById("logo_cia")
                    tipo = imagen.attributes["value"]["value"].split('.')
                    var imgData = getBase64Image(imagen, 300, 100)
                    try {
                      doc.addImage(imgData, tipo[1].toUpperCase(), 5, 5, 30, 10)
                    }
                    catch (error) {
                      console.error(error);
                      // expected output: ReferenceError: nonExistentFunction is not defined
                      // Note - error messages will vary depending on browser
                    }
                    doc.setDrawColor(109, 118, 165)
                    doc.setFillColor(109, 118, 165)


                    doc.rect(65, 11, 136, 0.5, 'F')


                    doc.setFontStyle('bold');

                    doc.setFontSize(9);
                    doc.text(65, 10, reppuesta_rep["nombre_rep"]);
                    doc.text(200, 10, '' + web_usuario + ' - ' + date.toLocaleDateString() + " " + date.toLocaleTimeString(), 'right');
                    doc.text(200, 15, cc_pag + " - " + mx_pag, 'right');

                    doc.text(65, 15, new_lines_var);
                    doc.setFontStyle('normal');



                    filaY = 25
                    imprimio_cabecera = false
                  }
                }

                doc.line(filaX - 0.5, filaY - 4.5, filaX - 0.5, filaY - 4.5);
                //filaY = filaY + 2.5

                entrosub = true
                filaX = reppuesta_rep["repstilo"][2]["tab"] * conv_cc
                if (imprimio_cabecerasdetsub == false && reppuesta_rep["repstilo"][2]["Cabecera"] == 'Si') {


                  //doc.line(reppuesta_rep["repstilo"][1]["tab"] * conv_cc -0.5, filaY -4.5, filaX-0.5, filaY-4.5);


                  filaY = filaY + 2.5

                  for (z2 = 0; z2 < columnasdetsub.length; z2++) {
                    if (reppuesta_rep["repstilo"][2]["colores"] != null) {

                      var colores = reppuesta_rep["repstilo"][2]["colores"].split(';')
                      doc.setDrawColor(parseInt(colores[0].split(',')[0]), parseInt(colores[0].split(',')[1]), parseInt(colores[0].split(',')[2]))
                      doc.setFillColor(parseInt(colores[0].split(',')[0]), parseInt(colores[0].split(',')[1]), parseInt(colores[0].split(',')[2]))
                      doc.rect(filaX - 0.5, filaY - 4.5, ((columnas_largodetsub[z2] * conv_cc)) - 0.5, 5, 'F')

                      doc.setDrawColor(109, 118, 165)
                      doc.setFillColor(109, 118, 165)
                    }

                    doc.line(filaX - 0.5, filaY - 5, filaX - 0.5, filaY + 0.5);
                    doc.line(filaX - 0.5, filaY - 5, filaX + (columnas_largodetsub[z2] * conv_cc) - 0.5, filaY - 5);
                    if (columnasdetsub[z2].substring(0, 2) == '$@') {
                      des = columnasdetsub[z2].split('@')
                      doc.text(filaX, filaY, des[2]);
                    } else {
                      doc.text(filaX, filaY, columnasdetsub[z2]);
                    }
                    filaX = filaX + (columnas_largodetsub[z2] * conv_cc)
                  }

                  doc.line(filaX - 0.5, filaY - 5, filaX - 0.5, filaY);
                  doc.line(filaX - 0.5, filaY - 5, filaX + (columnasdetsub[z2] * conv_cc) - 0.5, filaY - 5);

                  imprimio_cabecerasdetsub = true
                  filaY = filaY + 5
                }
                filaX = reppuesta_rep["repstilo"][2]["tab"] * conv_cc

                for (z2 = 0; z2 < columnasdetsub.length; z2++) {
                  if (reppuesta_rep["repstilo"][2]["colores"] != null) {
                    var colores = reppuesta_rep["repstilo"][2]["colores"].split(';')
                    doc.setDrawColor(parseInt(colores[1].split(',')[0]), parseInt(colores[1].split(',')[1]), parseInt(colores[1].split(',')[2]))
                    doc.setFillColor(parseInt(colores[1].split(',')[0]), parseInt(colores[1].split(',')[1]), parseInt(colores[1].split(',')[2]))

                    doc.rect(filaX - 0.5, filaY - 4.5, ((columnas_largodetsub[z2] * conv_cc)) - 0.5, 5, 'F')

                    doc.setDrawColor(109, 118, 165)
                    doc.setFillColor(109, 118, 165)

                  }


                  for (z3 = 0; z3 < reppuesta_rep["resutado"][2][0].length; z3++) {

                    if (reppuesta_rep["resutado"][2][0][z3][0] == columnasdetsub[z2]) {
                      doc.line(filaX - 0.5, filaY - 4.5, filaX - 0.5, filaY + 0.5);
                      doc.line(filaX - 0.5, filaY - 4.5, (filaX + (columnas_largodetsub[z2] * conv_cc)) - 0.5, filaY - 4.5,);
                      var escri = ''
                      if (columnasdetsub[z2].substring(0, 2) == '$@') {
                        des = columnasdetsub[z2].split('@')
                        des2 = des[1].split(';')
                        vallr = 0

                        if (des2[2] == 0) {
                          vallr = desglosessub[columnasdetsub[z2]]

                        }
                        if (des2[2] == 1) {
                          vallr = parseFloat(desglosessub[columnasdetsub[z2]]) + parseFloat(reppuesta_rep["resutado"][2][1][z][des2[1]])
                        }
                        escri = setTwoNumberDecimal(vallr, 2)
                        desglosessub[columnasdetsub[z2]] = parseFloat(desglosessub[columnasdetsub[z2]]) + parseFloat(reppuesta_rep["resutado"][2][1][z][des2[1]])
                      } else {
                        escri = reppuesta_rep["resutado"][2][1][z][z3]
                      }


                      if ((escri.length * 5.5) > columnas_largodetsub[z2]) { escri = escri.substring(0, Math.round(columnas_largodetsub[z2] / 5.5)) + '...' }
                      if (isNaN(escri) == false) {
                        doc.text(filaX + ((columnas_largodetsub[z2] * conv_cc) - 2), filaY, escri.toString(), 'right');
                      } else {
                        if (isNaN(escri.replace(/,/g, '')) == false) {
                          doc.text(filaX + ((columnas_largodetsub[z2] * conv_cc) - 2), filaY, escri.toString(), 'right');
                        } else {
                          doc.text(filaX, filaY, escri.toString());
                        }
                      }
                    }

                  }
                  filaX = filaX + (columnas_largodetsub[z2] * conv_cc)
                  doc.line(filaX - 0.5, filaY - 4.5, filaX - 0.5, filaY + 0.5);
                }

                filaY = filaY + 5
              }
            }

            if (entrosub == true) {
              //alert('entro')
              doc.line(reppuesta_rep["repstilo"][2]["tab"] * conv_cc - 0.5, filaY - 4.5, filaX - 0.5, filaY - 4.5);
              filaY = filaY + 2.5
              doc.line(reppuesta_rep["repstilo"][1]["tab"] * conv_cc - 0.5, filaY - 4.5, filaX - 0.5, filaY - 4.5);

            }
            if (reppuesta_rep["repstilo"][2]["cabeceras"] == true) { imprimio_cabeceradet = false }

            //////////////////////

          }

          if (reppuesta_rep["repstilo"][1]["cabeceras"] == true) { imprimio_cabecera = false }
        }
      }
      if (entro == true) {
        doc.line(reppuesta_rep["repstilo"][1]["tab"] * conv_cc - 0.5, filaY - 4.5, filaX - 0.5, filaY - 4.5);
        filaY = filaY + 2.5
      }

    }
    if (reppuesta_rep["repstilo"][0]["posicion"] == "Horizontal") {
      if (filaY > (limite_lineas * 5)) {
        doc.line(5 - 0.5, filaY - 4.5, filaX - 0.5, filaY - 4.5);

        if(alto == 0){
          doc.addPage(tipo_pag)
        }else{
          if (reppuesta_rep["repstilo"][0]["posicion"] == "Horizontal") {
            doc.addPage('l', 'mm', [ancho ,alto] )
          }else{
            doc.addPage('p', 'mm', [ancho ,alto] )
          }
        }
        cc_pag = cc_pag + 1
        footer(doc, cc_pag, reppuesta_rep["repstilo"][0]["posicion"])
        imagen = document.getElementById("logo_cia")
        tipo = imagen.attributes["value"]["value"].split('.')
        var imgData = getBase64Image(imagen, 300, 100)
        try {
          doc.addImage(imgData, tipo[1].toUpperCase(), 5, 5, 30, 10)
        }
        catch (error) {
          console.error(error);
          // expected output: ReferenceError: nonExistentFunction is not defined
          // Note - error messages will vary depending on browser
        }
        doc.setDrawColor(109, 118, 165)
        doc.setFillColor(109, 118, 165)


        doc.rect(75, 11, 215, 0.5, 'F')


        doc.setFontStyle('bold');

        doc.setFontSize(9);
        doc.text(75, 10, reppuesta_rep["nombre_rep"]);
        doc.text(290, 10, '' + web_usuario + ' - ' + date.toLocaleDateString() + " " + date.toLocaleTimeString(), 'right');
        //doc.text(290, 15, cc_pag + " - " + mx_pag ,'right');

        doc.text(75, 15, new_lines_var);
        doc.setFontStyle('normal');

        filaY = 25
        imprimio_cabecera = false
      }
    } else {
      if (filaY > (limite_lineas * 5)) {
        doc.line(5 - 0.5, filaY - 4.5, filaX - 0.5, filaY - 4.5);

        if(alto == 0){
          doc.addPage(tipo_pag)
        }else{
          if (reppuesta_rep["repstilo"][0]["posicion"] == "Horizontal") {
            doc.addPage('l', 'mm', [ancho ,alto] )
          }else{
            doc.addPage('p', 'mm', [ancho ,alto] )
          }
        }
        cc_pag = cc_pag + 1
        footer(doc, cc_pag, reppuesta_rep["repstilo"][0]["posicion"])
        imagen = document.getElementById("logo_cia")
        tipo = imagen.attributes["value"]["value"].split('.')
        var imgData = getBase64Image(imagen, 400, 200)
        try {
          doc.addImage(imgData, tipo[1].toUpperCase(), 5, 5, 30, 10)
        }
        catch (error) {
          console.error(error);
          // expected output: ReferenceError: nonExistentFunction is not defined
          // Note - error messages will vary depending on browser
        }
        doc.setDrawColor(109, 118, 165)
        doc.setFillColor(109, 118, 165)


        doc.rect(65, 11, 136, 0.5, 'F')


        doc.setFontStyle('bold');

        doc.setFontSize(9);
        doc.text(65, 10, reppuesta_rep["nombre_rep"]);
        doc.text(200, 10, '' + web_usuario + ' - ' + date.toLocaleDateString() + " " + date.toLocaleTimeString(), 'right');
        //doc.text(200, 15, cc_pag + " - " + mx_pag ,'right');

        doc.text(65, 15, new_lines_var);
        doc.setFontStyle('normal');


        filaY = 25
        imprimio_cabecera = false
      }
    }
  }


  doc.line(5 - 0.5, filaY - 4.5, filaX - 0.5, filaY - 4.5);

  filaY = filaY + 2
  filaX = 5
  doc.line(filaX - 0.5, filaY - 4.5, filaX - 0.5, filaY + 0.5);


  var colum_fial = 0
  for (x2 = 0; x2 < columnas.length; x2++) {
    colum_fial = colum_fial + (columnas_largo[x2] * conv_cc)
  }



  if (reppuesta_rep["repstilo"][0]["colores"] != null) {

    var colores = reppuesta_rep["repstilo"][0]["colores"].split(';')
    doc.setDrawColor(parseInt(colores[0].split(',')[0]), parseInt(colores[0].split(',')[1]), parseInt(colores[0].split(',')[2]))
    doc.setFillColor(parseInt(colores[0].split(',')[0]), parseInt(colores[0].split(',')[1]), parseInt(colores[0].split(',')[2]))

    doc.rect(filaX - 0.5, filaY - 4.5, colum_fial, 5, 'F')

    doc.setDrawColor(109, 118, 165)
    doc.setFillColor(109, 118, 165)

  }



  if (Object.keys(reppuesta_rep["sum_totales"]).length > 0) {

    doc.text(filaX + 5, filaY, 'Totales');

    doc.setDrawColor(109, 118, 165)
    doc.setFillColor(109, 118, 165)

    for (x2 = 0; x2 < columnas.length; x2++) {
      if (columnas[x2] in reppuesta_rep["sum_totales"]) {
        doc.line(filaX - 0.5, filaY - 4.5, filaX - 0.5, filaY + 0.5);
        doc.line(filaX - 0.5, filaY - 4.5, (filaX + (columnas_largo[x2] * conv_cc)) - 0.5, filaY - 4.5,);

        var escri = reppuesta_rep["sum_totales"][columnas[x2]]
        if ((escri.length * 5.5) > columnas_largo[x2]) {
          escri = escri.substring(0, Math.round(columnas_largo[x2] / 5.5)) + '...'
        }
        if (isNaN(escri) == false) {
          doc.text(filaX + ((columnas_largo[x2] * conv_cc) - 2), filaY, escri.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","), 'right');
        } else {
          if (isNaN(escri.replace(/,/g, '')) == false) {
            doc.text(filaX + ((columnas_largo[x2] * conv_cc) - 2), filaY, escri.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","), 'right');
          } else {
            doc.text(filaX, filaY, escri.toString());
          }
        }
      }
      filaX = filaX + (columnas_largo[x2] * conv_cc)
      doc.line(filaX - 0.5, filaY - 4.5, filaX - 0.5, filaY + 0.5);
    }

    doc.line(5 - 0.5, filaY - 4.5, filaX - 0.5, filaY - 4.5);
    filaY = filaY + 5
    doc.line(5 - 0.5, filaY - 4.5, filaX - 0.5, filaY - 4.5);
  }

  if (typeof doc.putTotalPages === 'function') {
    doc.putTotalPages(totalPagesExp);
  }
  doc.save(reppuesta_rep["nombre_rep"] + '_' + date.toLocaleDateString() + " " + date.toLocaleTimeString() + '.pdf');

}


function excell_subreporte(temp_pest) {

  reppuesta_rep = dict_pestalla['p-' + temp_pest]

  var tab_text = "<table border='2px'><tr bgcolor='#87AFC6'>";
  var textRange; var j = 0;
  tab = document.getElementById('dataTablessub-' + temp_pest); // id of table

  for (j = 0; j < tab.rows.length; j++) {
    tab_text = tab_text + tab.rows[j].innerHTML + "</tr>";
    //tab_text=tab_text+"</tr>";
  }

  tab_text = tab_text + "</table>";
  tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
  tab_text = tab_text.replace(/<img[^>]*>/gi, ""); // remove if u want images in your table
  tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

  var ua = window.navigator.userAgent;
  var msie = ua.indexOf("MSIE ");

  if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
  {
    txtArea1.document.open("txt/html", "replace");
    txtArea1.document.write(tab_text);
    txtArea1.document.close();
    txtArea1.focus();
    sa = txtArea1.document.execCommand("SaveAs", true, "Say Thanks to Sumit.xls");
  }
  else                 //other browser not tested on IE 11
    sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));

  return (sa);

}

function excell_tabla_solo_cabeceras(temp_pestalla) {
  var tab_text = "<table border='2px'><tr bgcolor='#87AFC6'>";
  const fruits = ["cmpnumsimple", "cmptxtsimple", "cmpopcmultiple", "cmpfecha", "cmpreferencia"];

  tab_text = tab_text + '<tr>'
  for (qw = 0; qw < dict_pestalla["p-" + temp_pestalla]['estru'].length; qw++) {
    if (fruits.includes(dict_pestalla["p-" + temp_pestalla]['estru'][qw]['TablaCampo'])) {
      tab_text = tab_text + '<td>' + dict_pestalla["p-" + temp_pestalla]['estru'][qw]['Nombre'] + '</td>'
    }
  }

  tab_text = tab_text + "</tr>";

  tab_text = tab_text + "</table>";
  //tab_text= tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
  //tab_text= tab_text.replace(/<img[^>]*>/gi,""); // remove if u want images in your table
  //tab_text= tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

  var ua = window.navigator.userAgent;
  var msie = ua.indexOf("MSIE ");

  if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
  {
    txtArea1.document.open("txt/html", "replace");
    txtArea1.document.write(tab_text);
    txtArea1.document.close();
    txtArea1.focus();
    sa = txtArea1.document.execCommand("SaveAs", true, "Say Thanks to Sumit.xls");
  }
  else                 //other browser not tested on IE 11
    sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));

  return (sa);

}

function excell_tabla(misima_tabla) {
  var tab_text = "<table border='2px'><tr bgcolor='#87AFC6'>";
  var textRange; var j = 0;
  tab = document.getElementById(misima_tabla.id); // id of table




  for (j = 0; j < tab.rows.length; j++) {
    tab_text = tab_text + '<tr>'

    for (j2 = 1; j2 < tab.rows[j].children.length; j2++) {

      tab_text = tab_text + '<td>' + tab.rows[j].children[j2].children[0].value + '</td>'
    }

    tab_text = tab_text + "</tr>";
    //tab_text=tab_text+"</tr>";
  }

  tab_text = tab_text + "</table>";
  tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
  tab_text = tab_text.replace(/<img[^>]*>/gi, ""); // remove if u want images in your table
  tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

  var ua = window.navigator.userAgent;
  var msie = ua.indexOf("MSIE ");

  if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
  {
    txtArea1.document.open("txt/html", "replace");
    txtArea1.document.write(tab_text);
    txtArea1.document.close();
    txtArea1.focus();
    sa = txtArea1.document.execCommand("SaveAs", true, "Say Thanks to Sumit.xls");
  }
  else                 //other browser not tested on IE 11
    sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));

  return (sa);

}

function excell_reporte(temp_pest) {

  reppuesta_rep = dict_pestalla['p-' + temp_pest]

  var tab_text = "<table border='2px'><tr bgcolor='#87AFC6'>";
  var textRange; var j = 0;
  tab = document.getElementById('dataTables-' + temp_pest); // id of table


  val_det = document.getElementById('det_rep-' + temp_pest)
  var detalle = val_det.checked

  for (j = 0; j < tab.rows.length; j++) {



    if (val_det.checked == true) {
      tab_text = tab_text + tab.rows[j].innerHTML + "</tr>";
    } else {
      if ((tab.rows[j].className != 'lin_detalle')) {
        tab_text = tab_text + tab.rows[j].innerHTML + "</tr>";
      }
    }




    //tab_text=tab_text+"</tr>";
  }

  tab_text = tab_text + "</table>";
  tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
  tab_text = tab_text.replace(/<img[^>]*>/gi, ""); // remove if u want images in your table
  tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

  var ua = window.navigator.userAgent;
  var msie = ua.indexOf("MSIE ");

  if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
  {
    txtArea1.document.open("txt/html", "replace");
    txtArea1.document.write(tab_text);
    txtArea1.document.close();
    txtArea1.focus();
    sa = txtArea1.document.execCommand("SaveAs", true, "Say Thanks to Sumit.xls");
  }
  else                 //other browser not tested on IE 11
    sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));
  return (sa);
}

function abrir_subrep(temp_pest, fila, nivel) {
  tr = document.getElementById('dr-' + temp_pest + '-' + fila + '-' + nivel)
  btn = document.getElementById('btn-' + temp_pest + '-' + fila + '-' + nivel)
  if (tr.hidden == false) {
    tr.hidden = true
    btn.innerHTML = '<span class="fa fa-plus" aria-hidden="true"></span>'
    btn.style.backgroundColor = "darkblue"

  } else {
    tr.hidden = false
    btn.innerHTML = '<span class="fa fa-minus" aria-hidden="true"></span>'
    btn.style.backgroundColor = "cornflowerblue"

  }

}
function reejecutar_reprote(id_rep) {

  //  $("#id"+ $(this).attr("id")).remove();
  //  $("#rr"+ $(this).attr("id")).empty();
  pestalla = pestalla + 1;



  $.ajax({
    type: 'POST',
    url: '/menu_reporte',
    data: { 'fuente': 'reporte', 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'pkrepo': id_rep, 'usuario': web_usuario, 'idioma': web_idioma, 'pestalla': pestalla },
    //beforeSend: function () {},
    success: function (Response) {
      $("#myTab").prepend('<li role="presentation" class="" id="li' + pestalla + '"style="text-align: right;"><a href="#rr' + pestalla + '" id="id' + pestalla + '" role="tab" data-toggle="tab" aria-expanded="false">' + Response["nombre_rep"] + ' <i class="fa fa-times" style="color: red; background: transparent;cursor: pointer;" onclick="cerrar_elemento(' + pestalla + ')"></i></a></li>');





      $("#myTabContent").prepend('<div role="tabpanel" class="tab-pane fade" id="rr' + pestalla + '" aria-labelledby="id' + pestalla + '" style="background-color: transparent;"> Procesando </div>');

      id_dic = 'p-' + pestalla
      dict_pestalla[id_dic] = Response


      data_int = '<div class="panel-body" style="padding-top: 5px;padding-left: 0px;">'
      data_int = data_int + '<div class="input-group" style="background: white;margin-left: 0px;margin-right: 0px;width: 100%;">'
      data_int = data_int + '<button class="btn bg-blue btn-flat margin" id="reporteejecutar" name="reporteejecutar" type="submit" value="' + Response['pkrepo'][0] + '" onclick="reporte_ejecutar(' + Response["pestalla"] + ',0, ' + Response["pkrepo"] + ')">Ejecutar</button>'
      data_int = data_int + '<button type="button" onclick="cerrar_elemento(' + Response["pestalla"] + ')" class="btn bg-red btn-flat margin"><span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span></button>'
      data_int = data_int + '</div>'
      data_int = data_int + '<div class="card-block text-left"><table class="table table-hover" style="background: white;"><thead><tr><th></th><th></th><th></th></tr></thead><tbody>'

      for (x = 0; x < Response['variables_reprotes'].length; x++) {
        data_int = data_int + ''

        if (Response['variables_reprotes'][x]["tipo"] == "Texto") {
          data_int = data_int + '<tr><td><strong>' + Response['variables_reprotes'][x]["glosa"] + ':</td>'
          data_int = data_int + '<td> <input type="text" id="var-' + Response["pestalla"] + '-' + Response['variables_reprotes'][x]["id"] + '" name="' + Response['variables_reprotes'][x]["id_rep"] + '" value="%"></td>'
          data_int = data_int + '</tr>'
        } else {
          if (Response['variables_reprotes'][x]["tipo"] == "Valor") {
            data_int = data_int + '<tr><td><strong>' + Response['variables_reprotes'][x]["glosa"] + ':</td>'
            data_int = data_int + '<td> <input type="text" id="var-' + Response["pestalla"] + '-' + Response['variables_reprotes'][x]["id"] + '" name="' + Response['variables_reprotes'][x]["id_rep"] + '" value="0"></td>'
            data_int = data_int + '<td></td></tr>'
          } else {
            data_int = data_int + '<tr><td><strong>' + Response['variables_reprotes'][x]["glosa"] + ':</td>'
            data_int = data_int + '<td> <input type="date" id="var-' + Response["pestalla"] + '-' + Response['variables_reprotes'][x]["id"] + '" name="' + Response['variables_reprotes'][x]["id_rep"] + '" value="' + Response['variables_reprotes'][x]["valor"] + '"></td>'
            data_int = data_int + '</tr>'
          }
        }
      }
      for (x = 0; x < Response['referencias_reprotes'].length; x++) {
        data_int = data_int + '<tr><td><strong>' + Response['referencias_reprotes'][x]["glosa"] + ':</td>'
        data_int = data_int + '<td> <input type="text" id="rpzz' + Response["pestalla"] + 'zz' + x + 'zz' + Response['referencias_reprotes'][x]["id"] + '" name="' + Response['referencias_reprotes'][x]["id"] + '" value="%"><button type="button" class="btn btn-info" data-toggle="modal" data-target=".bs-example-modal-lg" onclick="buscar_referencia_reporte(rpzz' + Response["pestalla"] + 'zz' + x + 'zz' + Response['referencias_reprotes'][x]["id"] + ')" style="padding-top: 0px;padding-bottom: 0px;margin-top: 0px;margin-bottom: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></button></td>'
        data_int = data_int + '</tr>'
      }
      data_int = data_int + '</tbody></table></div>  '
      $('#rr' + Response["pestalla"]).html(data_int);
      document.getElementById('id' + Response["pestalla"]).click();


    }
  });
}

function pdf_calendario() {
  //solo dia
  var show_tipo = ''
  var mx_pag = 0
  var cc_pag = 1
  var tipo_pag = ''
  var largo_var = 200
  var date = new Date()
  var prin_f = true
  var limit1 = 45

  if (document.getElementById('calen_calendar-dia').className == 'active') {
    show_tipo = 'table_calen_dia'
    var doc = new jsPDF('p', 'cm', 28, 22);
    largo_var = 350
    limit1 = 200
  } else {
    if (document.getElementById('calen_calendar-sem').className == 'active') {
      show_tipo = 'table_calen_sem'
      tipo_pag = 'landscape'
      largo_var = 300
      limit1 = 37
      var doc = new jsPDF('p', 'cm', 21, 28);
    } else {
      show_tipo = 'table_calen_mes'
      tipo_pag = 'landscape'
      largo_var = 300
      limit1 = 42
      prin_f = false
      var doc = new jsPDF('p', 'cm', 21, 28);
    }
  }

  var doc = new jsPDF(tipo_pag);

  doc.page = 1
  var totalPagesExp = "{total_pages_count_string}";

  imagen = document.getElementById("logo_cia")
  tipo = imagen.attributes["value"]["value"].split('.')
  var imgData = getBase64Image(imagen, 300, 100)
  try {
    doc.addImage(imgData, tipo[1].toUpperCase(), 5, 5, 30, 10)
  }
  catch (error) { console.error(error); }
  doc.setDrawColor(109, 118, 165)
  doc.setFillColor(109, 118, 165)

  if (tipo_pag == "") {
    doc.rect(75, 11, 215, 0.5, 'F')
    doc.setFontStyle('bold');
    doc.setFontSize(9);
    doc.text(75, 10, 'Calendario Cero Codigo');
    doc.text(290, 10, '' + web_usuario + ' - ' + date.toLocaleDateString() + " " + date.toLocaleTimeString(), 'right');

    doc.setFontStyle('normal');
    footer(doc, 1, 'Vertical')

  } else {
    doc.rect(65, 11, 136, 0.5, 'F')
    doc.setFontStyle('bold');

    doc.setFontSize(9);
    doc.text(65, 10, 'Calendario Cero Codigo');
    doc.text(200, 10, '' + web_usuario + ' - ' + date.toLocaleDateString() + " " + date.toLocaleTimeString(), 'right');

    doc.setFontStyle('normal');
    footer(doc, 1, 'Horizontal')

  }

  var conv_cc = 0.345
  var filaX = 5
  var filaY = 25



  var textRange; var j = 0;
  tab = document.getElementById(show_tipo); // id of table

  var tab_text = ''
  val_det = true
  var fila_unica = filaY
  var maxfilay = 0


  for (j = 0; j < tab.rows.length; j++) {
    if (fila_unica > 200) {
      if (show_tipo == 'table_calen_dia') {
        doc.addPage('p', 'cm', 28, 22);
      } else {
        doc.addPage('p', 'cm', 21, 28);
      }
      fila_unica = 25

      doc.page = 1
      var totalPagesExp = "{total_pages_count_string}";

      imagen = document.getElementById("logo_cia")
      tipo = imagen.attributes["value"]["value"].split('.')
      var imgData = getBase64Image(imagen, 300, 100)
      try {
        doc.addImage(imgData, tipo[1].toUpperCase(), 5, 5, 30, 10)
      }
      catch (error) { console.error(error); }
      doc.setDrawColor(109, 118, 165)
      doc.setFillColor(109, 118, 165)

      if (tipo_pag == "") {
        doc.rect(75, 11, 215, 0.5, 'F')
        doc.setFontStyle('bold');
        doc.setFontSize(9);
        doc.text(75, 10, 'Calendario Cero Codigo');
        doc.text(290, 10, '' + web_usuario + ' - ' + date.toLocaleDateString() + " " + date.toLocaleTimeString(), 'right');

        doc.setFontStyle('normal');
        footer(doc, 1, 'Vertical')

      } else {
        doc.rect(65, 11, 136, 0.5, 'F')
        doc.setFontStyle('bold');

        doc.setFontSize(9);
        doc.text(65, 10, 'Calendario Cero Codigo');
        doc.text(200, 10, '' + web_usuario + ' - ' + date.toLocaleDateString() + " " + date.toLocaleTimeString(), 'right');

        doc.setFontStyle('normal');
        footer(doc, 1, 'Horizontal')

      }
    }

    filaX = 5
    maxfilay = 5
    doc.line(filaX - 0.5, fila_unica - 5, (largo_var - filaX) - 3, fila_unica - 5);  //fila horizontal

    for (j2 = 0; j2 < tab.rows[j].childElementCount; j2++) {

      filaY = 0
      if (tab.rows[j].children[j2].children[0].childElementCount == 0) {
        doc.text(filaX, fila_unica + filaY, tab.rows[j].children[j2].innerText);
      } else {
        var fila_int = 0
        for (j3 = 0; j3 < tab.rows[j].children[j2].children[0].childElementCount; j3++) {
          var lines_var = doc.splitTextToSize(tab.rows[j].children[j2].children[0].children[j3].innerText, limit1);

          var new_lines_var = []
          for (cv = 0; cv < lines_var.length; cv++) {
            if (lines_var[cv] != '') {
              new_lines_var.push(lines_var[cv])
              filaY = filaY + 5
            }
          }
          doc.text(filaX, fila_unica + fila_int, new_lines_var);
          if (fila_int < (filaY)) { fila_int = (filaY) }
        }
        if (maxfilay < (fila_int)) { maxfilay = (fila_int) }
      }
      if (j2 == 0 && prin_f == true) {
        filaX = filaX + 25
      } else {
        filaX = filaX + (largo_var / tab.rows[j].childElementCount)
      }
    }
    if (prin_f == false) {
      filaX = 5
      for (j2 = 0; j2 < tab.rows[j].childElementCount; j2++) {
        doc.line(filaX - 0.5, fila_unica - 5, filaX - 0.5, (fila_unica + maxfilay - 2.5));

        filaX = filaX + (largo_var / tab.rows[j].childElementCount)
        doc.line(filaX - 0.5, fila_unica - 5, filaX - 0.5, (fila_unica + maxfilay - 2.5));
      }
    } else {
      filaX = 5
      for (j2 = 0; j2 < tab.rows[j].childElementCount; j2++) {
        doc.line(filaX - 0.5, fila_unica - 5, filaX - 0.5, (fila_unica + maxfilay - 2.5));

        if (j2 == 0) {
          filaX = filaX + 25
        } else {
          filaX = filaX + (largo_var / tab.rows[j].childElementCount)
        }
        doc.line(filaX - 0.5, fila_unica - 5, filaX - 0.5, (fila_unica + maxfilay - 2.5));
      }
    }
    //doc.text(20, fila_unica + 5 ,fila_unica.toString() );

    fila_unica = fila_unica + maxfilay + 2
  }
  doc.line(filaX - 0.5, fila_unica - 5, (largo_var - filaX) - 3, fila_unica - 5);  //fila horizontal

  //tab_text= tab_text.replace(/<A[^>]*>|<\/A>/g, "");remove if u want links in your table
  // tab_text= tab_text.replace(/<img[^>]*>/gi,""); // remove if u want images in your table
  //tab_text= tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

  // tab_text= tab_text.replace(/<ul.*ul>/g, '')

  if (typeof doc.putTotalPages === 'function') {
    doc.putTotalPages(totalPagesExp);
  }
  doc.save('calendario_' + date.toLocaleDateString() + " " + date.toLocaleTimeString() + '.pdf');

}


function calcular_0_nuevo(pestana_int) {


  Response = dict_pestalla['p-' + pestana_int]

  for (x = 0; x < Response["campos_cab"].length; x++) {
    ID_TAG = 'p' + pestana_int + 'zzz' + Response["campos_cab"][x]["Nombre"] + '';

    if (Response["campos_cab"][x]["TablaCampo"] == "cmptxtsimple") {
      document.getElementById(ID_TAG).value = Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["ValorPredeterminado"]
    }
    if (Response["campos_cab"][x]["TablaCampo"] == "cmpnumsimple") {
      document.getElementById(ID_TAG).value = setTwoNumberDecimal(Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Menor"], Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["NumDecimales"])
    }
    if (Response["campos_cab"][x]["TablaCampo"] == "cmpformuladetalle") {
      document.getElementById(ID_TAG).value = setTwoNumberDecimal(0, 2)
    }
    if (Response["campos_cab"][x]["TablaCampo"] == "cmpfecha") {
      var now = new Date();
      if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Tiempo"] == "Y") {
        valor_campo = now.format("Y-m-d") + 'T' + now.format("H:i:s")
      } else {
        valor_campo = now.format("Y-m-d");
      }
    }
    if (Response["campos_cab"][x]["TablaCampo"] == "cmpreferencia") {
      valor_campo = 0
    }
    if (Response["campos_cab"][x]["TablaCampo"] == "cmpreferenciaadjunto") {
      valor_campo = 0
    }
    if (Response["campos_cab"][x]["TablaCampo"] == "cmpoperacion") {
      valor_campo = 0
    }
    if (Response["campos_cab"][x]["TablaCampo"] == "cmpconsolidado") {
      valor_campo = 0
    }
    if (Response["campos_cab"][x]["TablaCampo"] == "cmparchivo") {
      valor_campo = ""
    }
    if (Response["campos_cab"][x]["TablaCampo"] == "cmpnumeroaletras") {
      valor_campo = ""
    }
    if (Response["campos_cab"][x]["TablaCampo"] == "cmpdecabecera") {
      valor_campo = ""
    }
    if (Response["campos_cab"][x]["TablaCampo"] == "cmpelectronico") {
      valor_campo = 0
    }

  }
}

function calcular_detalle_nuevo(pestana_int, fila) {
  Response = dict_pestalla['p-' + pestana_int]

  for (x = 0; x < Response["campos_det"].length; x++) {
    ID_TAG = 'pd' + pestana_int + 'fff' + fila + 'ccc' + Response["campos_det"][x]["Nombre"] + '';

    if (Response["campos_det"][x]["TablaCampo"] == "cmptxtsimple") {
      document.getElementById(ID_TAG).value = Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["ValorPredeterminado"]
    }
    if (Response["campos_det"][x]["TablaCampo"] == "cmpnumsimple") {
      document.getElementById(ID_TAG).value = setTwoNumberDecimal(Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Menor"], Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["NumDecimales"])
    }
    if (Response["campos_det"][x]["TablaCampo"] == "cmpformuladetalle") {
      document.getElementById(ID_TAG).value = setTwoNumberDecimal(0, 2)
    }
    if (Response["campos_det"][x]["TablaCampo"] == "cmpfecha") {
      var now = new Date();
      if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Tiempo"] == "Y") {
        valor_campo = now.format("Y-m-d") + 'T' + now.format("H:i:s")
      } else {
        valor_campo = now.format("Y-m-d");
      }
    }
    if (Response["campos_det"][x]["TablaCampo"] == "cmpreferencia") {
      valor_campo = 0
      if(Response['func_det'][Response["campos_det"][x]["Nombre"]][0][0]['predeterminado_valor'] != ''){
        
        if(Response['func_det'][Response["campos_det"][x]["Nombre"]][0][0]['Tipo_Predeterminado'] == '0'){
          valor_campo = Response['func_det'][Response["campos_det"][x]["Nombre"]][0][0]['predeterminado_valor']  
          document.getElementById(ID_TAG).value  = valor_campo
          buscar_referencia_detalle_enter(ID_TAG)
        }

      }

    }
    if (Response["campos_det"][x]["TablaCampo"] == "cmpreferenciaadjunto") {
      valor_campo = 0
    }
    if (Response["campos_det"][x]["TablaCampo"] == "cmpoperacion") {
      valor_campo = 0
    }
    if (Response["campos_det"][x]["TablaCampo"] == "cmpconsolidado") {
      valor_campo = 0
    }
    if (Response["campos_det"][x]["TablaCampo"] == "cmparchivo") {
      valor_campo = ""
    }
    if (Response["campos_det"][x]["TablaCampo"] == "cmpnumeroaletras") {
      valor_campo = ""
    }
    if (Response["campos_det"][x]["TablaCampo"] == "cmpdecabecera") {
      valor_campo = ""
    }
    if (Response["campos_det"][x]["TablaCampo"] == "cmpelectronico") {
      valor_campo = 0
    }

  }
}

function selecctt_buscador2click(x) {
  document.getElementById("vfinal_bus").value = x.rowIndex
  document.getElementById("vfinal_bus_2").value = document.getElementById("dataTables-example").rows[x.rowIndex].cells[0].innerHTML.trim();
}


function selecctt_buscador(x) {
  document.getElementById("vfinal_bus").value = x.rowIndex
  document.getElementById("vfinal_bus_2").value = document.getElementById("dataTables-example").rows[x.rowIndex].cells[0].innerHTML.trim();
}
function selecctt_buscadorFicha(x) {
  document.getElementById("vfinal_bus_ficha").value = x.rowIndex
  document.getElementById("vfinal_bus_ficha_2").value = document.getElementById("dataTables-exampleficha").rows[x.rowIndex].cells[0].innerHTML.trim();
  document.getElementById("vfinal_bus_ficha_3").value = document.getElementById("dataTables-exampleficha").rows[x.rowIndex].cells[1].innerHTML.trim();

  document.getElementById("vfinal_bus_ficha_5").value = document.getElementById("dataTables-exampleficha").rows[x.rowIndex].cells[document.getElementById("dataTables-exampleficha").rows[x.rowIndex].cells.length - 1].innerHTML.trim();



}
function selecctt_buscadorFicha_ref(campo, x, nomcampo, pkpanel) {
  document.getElementById("vfinal_ficha_4").value = x.rowIndex
  document.getElementById("vfinal_ficha_5").value = document.getElementById("dataTables-example_ref_ref").rows[x.rowIndex].cells[0].innerHTML.trim();
  document.getElementById("vfinal_ficha_6").value = document.getElementById("dataTables-example_ref_ref").rows[x.rowIndex].cells[1].innerHTML.trim();


  var nom_spli = nomcampo.id.split('_')

  var cc_grupo = nom_spli[0].substring(5) //elimino 'ficha' que la el count del grupo
  var cc_fila = nom_spli[1] //elimino 'ficha' que la el count del grupo
  var cc_nombre = nom_spli[2] //elimino 'ficha' que la el count del grupo

  var pkgrupo = dict_ficha[pkpanel]['dbgrupos'][cc_grupo]['pkgrupo']
  nomcampo.value = document.getElementById("dataTables-example_ref_ref").rows[x.rowIndex].cells[1].innerHTML.trim();

  cambio_dir_reget(nomcampo, dict_ficha[pkpanel]['dbgrupos'][cc_grupo]['vals'][cc_fila]['@pkregistro'], dict_ficha[pkpanel]['dbgrupos'][cc_grupo]['vals'][cc_fila]['@pkestru'], pkpanel)

  dict_ficha[pkpanel]
  var anexos = dict_ficha[pkpanel]['dbgrupos'][cc_grupo]['Valor'][dict_ficha[pkpanel]['dbgrupos'][cc_grupo]['pkgrupo']][cc_nombre]["anexos"].split('/')

  for (e = 0; e < anexos.length; e++) {
    var anex_txt = anexos[e].split('=')
    var campo_int = document.getElementById('ficha' + cc_grupo + '_' + cc_fila + '_' + anex_txt[0])
    campo_int.value = buscador_resultado_ficha_ref[x.rowIndex - 1][anex_txt[1]]
    cambio_dir_reget(campo_int, dict_ficha[pkpanel]['dbgrupos'][cc_grupo]['vals'][cc_fila]['@pkregistro'], dict_ficha[pkpanel]['dbgrupos'][cc_grupo]['vals'][cc_fila]['@pkestru'], pkpanel)

  }




}








function poner_valor_buscar_referencia_detalle(campo) {
  var cc_id = campo.id
  var res = cc_id.split("fff");
  var res2 = res[1].split("ccc");

  var cc_pesta = res[0].substring(2);
  var cc_fila = res2[0]
  var cc_nombre = res2[1]

  document.getElementById(campo.id).value = document.getElementById("vfinal_bus_2").value

  anexos = []

  Response = dict_pestalla['p-' + cc_pesta]

  for (x = 0; x < Response["campos_det"].length; x++) {
    if (Response["campos_det"][x]["TablaCampo"] == "cmpreferenciaadjunto") {
      if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["CampoReferencia"] == cc_nombre) {
        ID_TAG = 'pd' + cc_pesta + 'fff' + cc_fila + 'ccc' + Response["campos_det"][x]["Nombre"]

        if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Tipo"] == "Imagen") {


          ajuste_fila = '<img style="width: 100%;height: 60%;margin-left: auto;margin-right: auto;display: block;" id="' + ID_TAG + '_img" src="/media/archivos/' + web_Id_empresa + '/' + buscador_resultado[(document.getElementById("vfinal_bus").value - 1) + ((pago_buscador - 1) * 10)][Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Sentencia"]] + '" alt="image" value="0">' + buscador_resultado[(document.getElementById("vfinal_bus").value - 1) + ((pago_buscador - 1) * 10)][Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Sentencia"]]

          document.getElementById(ID_TAG + "_label").innerHTML = ajuste_fila



          document.getElementById(ID_TAG + "_label").href = '/media/archivos/' + web_Id_empresa + '/' + buscador_resultado[(document.getElementById("vfinal_bus").value - 1) + ((pago_buscador - 1) * 10)][Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Sentencia"]]

          document.getElementById(ID_TAG + "_img").src = '/media/archivos/' + web_Id_empresa + '/' + buscador_resultado[(document.getElementById("vfinal_bus").value - 1) + ((pago_buscador - 1) * 10)][Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Sentencia"]]

        } else {

          if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Tipo"] == "Fecha Tiempo") {
            var now = new Date(buscador_resultado[(document.getElementById("vfinal_bus").value - 1) + ((pago_buscador - 1) * 10)][Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Sentencia"]]);
            document.getElementById(ID_TAG).value = now.format("Y-m-d") + 'T' + now.format("H:i:s")
          } else {
            document.getElementById(ID_TAG).value = buscador_resultado[(document.getElementById("vfinal_bus").value - 1) + ((pago_buscador - 1) * 10)][Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Sentencia"]]

          }

        }

        for (z2 = 0; z2 < Response["campos_det"].length; z2++) {
          if (Response["campos_det"][z2]["TablaCampo"] == "cmpreferencia") {
            if (Response["func_det"][Response["campos_det"][z2]["Nombre"]][0][0]["predeterminado_valor"] == Response["campos_det"][x]["Nombre"]) {
              document.getElementById('pd' + pestalla + 'fff' + cc_fila + 'ccc' + Response["campos_det"][z2]["Nombre"]).value = document.getElementById(ID_TAG).value
              anexos.push('pd' + pestalla + 'fff' + cc_fila + 'ccc' + Response["campos_det"][z2]["Nombre"])
            }
          }
        }



      }
    }
    if (Response["campos_det"][x]["TablaCampo"] == "cmpreferencia") {

    }
  }

  for (zt = 0; zt < anexos.length; zt++) {
    buscar_referencia_detalle_enter(document.getElementById(anexos[zt]))
  }

  if (Response["func_det"][cc_nombre][2].length > 0) {
    if (Response["func_det"][cc_nombre][2][0]["Adicionar_registros"] == "Si") {

      A_Select = "Select "
      A_From = "From "
      A_Where = "Where "
      A_Group = "Group by "
      A_GroupWhere = "Group by "
      sentencia = ""
      A_extra = ""
      FaltaDato = false
      for (x = 0; x < Response["func_det"][cc_nombre][3][0][0].length; x++) {
        A_extra = " " + Response["func_det"][cc_nombre][3][0][0][x]["Elemento"] + " "
      }
      for (x = 0; x < Response["func_det"][cc_nombre][3][0][1].length; x++) {
        A_From = A_From + " " + Response["func_det"][cc_nombre][3][0][1][x]["Tabla"] + " as " + Response["func_det"][cc_nombre][3][0][1][x]["Nombre"] + ", "
      }

      if (A_From == "From ") { A_From = "" } else { A_From = A_From.slice(0, -2) }

      for (x = 0; x < Response["func_det"][cc_nombre][3][0][2].length; x++) {
        if (Response["func_det"][cc_nombre][3][0][2][x]["Tipo"] == "Valor") {
          A_Where = A_Where + " '" + Response["func_det"][cc_nombre][3][0][2][x]["Elemento"] + "' "
        }
        if (Response["func_det"][cc_nombre][3][0][2][x]["Tipo"] == "Operacion") {
          A_Where = A_Where + " " + Response["func_det"][cc_nombre][3][0][2][x]["Elemento"] + " "
        }
        if (Response["func_det"][cc_nombre][3][0][2][x]["Tipo"] == "Registro") {
          ID_TAG_where = 'pd' + cc_pesta + 'fff' + cc_fila + 'ccc' + Response["func_det"][cc_nombre][3][0][2][x]["Elemento"]

          if (document.getElementById(ID_TAG_where).value == "") { FaltaDato = true }
          A_Where = A_Where + " '" + document.getElementById(ID_TAG_where).value + "' "
        }
        if (Response["func_det"][cc_nombre][3][0][2][x]["Tipo"] == "Campo") {
          if (Response["func_det"][cc_nombre][3][0][2][x]["Funcion"] == "") {
            A_Where = A_Where + " " + Response["func_det"][cc_nombre][3][0][2][x]["Origen"] + "." + Response["func_det"][cc_nombre][3][0][2][x]["Elemento"] + " "
          }
          if (Response["func_det"][cc_nombre][3][0][2][x]["Funcion"] == "Suma") {
            A_Where = A_Where + " Sum(" + Response["func_det"][cc_nombre][3][0][2][x]["Origen"] + "." + Response["func_det"][cc_nombre][3][0][2][x]["Elemento"] + ") "
            A_GroupWhere = A_GroupWhere + Response["func_det"][cc_nombre][3][0][2][x]["Grupo"] + ", "
          }
          if (Response["func_det"][cc_nombre][3][0][2][x]["Funcion"] == "Promedio") {
            A_Where = A_Where + "Avg(" + Response["func_det"][cc_nombre][3][0][2][x]["Origen"] + "." + Response["func_det"][cc_nombre][3][0][2][x]["Elemento"] + ") "
            A_GroupWhere = A_GroupWhere + Response["func_cab"][cc_nombre][3][0][2][x]["Grupo"] + ", "
          }
          if (Response["func_det"][cc_nombre][3][0][2][x]["Funcion"] == "Contar") {
            A_Where = A_Where + "Count(" + Response["func_det"][cc_nombre][3][0][2][x]["Origen"] + "." + Response["func_det"][cc_nombre][3][0][2][x]["Elemento"] + ") "
            A_GroupWhere = A_GroupWhere + Response["func_det"][cc_nombre][3][0][2][x]["Grupo"] + ", "
          }
        }
      }


      for (x = 0; x < Response["func_det"][cc_nombre][3][0][3].length; x++) {

        A_Select = A_Select + "CAST( "
        for (x2 = 0; x2 < Response["func_det"][cc_nombre][3][0][4][x].length; x2++) {
          if (Response["func_det"][cc_nombre][3][0][4][x][x2]["Tipo"] == "Valor") {
            A_Select = A_Select + " '" + Response["func_det"][cc_nombre][3][0][4][x][x2]["Elemento"] + "' "
          }
          if (Response["func_det"][cc_nombre][3][0][4][x][x2]["Tipo"] == "Operacion") {
            A_Select = A_Select + " " + Response["func_det"][cc_nombre][3][0][4][x][x2]["Elemento"] + " "
          }
          if (Response["func_det"][cc_nombre][3][0][4][x][x2]["Tipo"] == "Registro") {
            ID_TAG_selec = 'pd' + cc_pesta + 'fff' + cc_fila + 'ccc' + Response["func_det"][cc_nombre][3][0][4][x][x2]["Elemento"]
            if (document.getElementById(ID_TAG_selec).value == "") { FaltaDato = true }
            A_Select = A_Select + " '" + document.getElementById(ID_TAG_selec).value + "' "
          }
          if (Response["func_det"][cc_nombre][3][0][4][x][x2]["Tipo"] == "Campo") {
            if (Response["func_det"][cc_nombre][3][0][4][x][x2]["Funcion"] == "") {
              A_Select = A_Select + " " + Response["func_det"][cc_nombre][3][0][4][x][x2]["Origen"] + "." + Response["func_det"][cc_nombre][3][0][4][x][x2]["Elemento"] + " "
            }
            if (Response["func_det"][cc_nombre][3][0][4][x][x2]["Funcion"] == "Suma") {
              A_Select = A_Select + " Sum(" + Response["func_det"][cc_nombre][3][0][4][x][x2]["Origen"] + "." + Response["func_det"][cc_nombre][3][0][4][x][x2]["Elemento"] + ") "
              if (Response["func_det"][cc_nombre][3][0][4][x][x2]["groupby"] != "") {
                A_Group = A_Group + Response["func_det"][cc_nombre][3][0][4][x][x2]["groupby"] + ", "
              }
            }
            if (Response["func_det"][cc_nombre][3][0][4][x][x2]["Funcion"] == "Promedio") {
              A_Select = A_Select + " Avg(" + Response["func_det"][cc_nombre][3][0][4][x][x2]["Origen"] + "." + Response["func_det"][cc_nombre][3][0][4][x][x2]["Elemento"] + ") "
              if (Response["func_det"][cc_nombre][3][0][4][x][x2]["groupby"] != "") {
                A_Group = A_Group + Response["func_det"][cc_nombre][3][0][4][x][x2]["groupby"] + ", "
              }
            }
            if (Response["func_det"][cc_nombre][3][0][4][x][x2]["Funcion"] == "Contar") {
              A_Select = A_Select + " Count(" + Response["func_det"][cc_nombre][3][0][4][x][x2]["Origen"] + "." + Response["func_det"][cc_nombre][3][0][4][x][x2]["Elemento"] + ") "
              if (Response["func_det"][cc_nombre][3][0][4][x][x2]["groupby"] != "") {
                A_Group = A_Group + Response["func_det"][cc_nombre][3][0][4][x][x2]["groupby"] + ", "
              }
            }
          }
        }
        A_Select = A_Select + " as char) as '" + Response["func_det"][cc_nombre][3][0][3][x]["Nombre"] + "', "
      }


      A_Select = A_Select.slice(0, -2)
      if (A_Group != "Group by ") {
        A_Group = A_Group.slice(0, -2)
      }

      if (A_Group == "Group by ") {
        if (A_GroupWhere == "Group by ") {
          if (A_Where == "Where ") {
            sentencia = A_Select + " " + A_From
          } else {
            sentencia = A_Select + " " + A_From + " " + A_Where
          }
        } else {
          if (A_Where == "Where ") {
            sentencia = A_Select + " " + A_From + " " + A_GroupWhere
          } else {
            sentencia = A_Select + " " + A_From + " " + A_Where + " " + A_GroupWhere
          }
        }
      } else {
        if (A_GroupWhere == "Group by ") {
          if (A_Where == "Where ") {
            sentencia = A_Select + " " + A_From + " " + A_Group
          } else {
            sentencia = A_Select + " " + A_From + " " + A_Where + " " + A_Group
          }
        } else {
          if (A_Where == "Where ") {
            sentencia = A_Select + " " + A_From + " " + A_Group + ", " + A_GroupWhere.slice(8).ToString
          } else {
            sentencia = A_Select + " " + A_From + " " + A_Where + " " + A_Group + ", " + A_GroupWhere.slice(8).ToString
          }
        }
      }

      sentencia = sentencia + A_extra

      $.ajax({
        type: 'POST',
        url: '/consolidado',
        data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'cmpsenten': sentencia, 'tag1': 'tag1', 'tag2': 'tag2', 'usuario': web_usuario },
        success: function (Response) {

          if (Response["cmpvalor"].length > 0) {

            for (xq = 0; xq < (ccsub_porPesta["p-" + cc_pesta] + 2); xq++) {

              menossub(cc_pesta, xq, cc_fila)

            }
            linea_inicial = ccsub_porPesta["p-" + cc_pesta]

            for (xq = 0; xq < Response["cmpvalor"].length; xq++) {

              massub(cc_pesta, cc_fila)
              for (xq2 = 0; xq2 < Object.keys(Response['cmpvalor'][xq]).length; xq2++) {

                id_tag_det = 'ps' + cc_pesta + 'qqq' + ccsub_porPesta["p-" + cc_pesta] + 'yyy' + cc_fila + 'www' + Object.keys(Response['cmpvalor'][xq])[xq2]
                if (document.getElementById(id_tag_det) != null) {

                  var block_campo = document.getElementById(id_tag_det)
                  if (block_campo.innerText == "Crear Formula") {
                    block_campo.innerText = Response['cmpvalor'][xq][Object.keys(Response['cmpvalor'][xq])[xq2]]
                  } else {
                    block_campo.value = Response['cmpvalor'][xq][Object.keys(Response['cmpvalor'][xq])[xq2]]
                  }
                }
              }
            }
            //calcular_detalle(cc_pesta, cc_fila)
            for (xq = linea_inicial; xq < (ccsub_porPesta["p-" + cc_pesta]); xq++) {
              calcular_subdetalle(cc_pesta, xq + 1, cc_fila)
            }
            calcular_detalle(cc_pesta, cc_fila)
          }
        }

      });


    }
  }


  calcular_detalle(cc_pesta, cc_fila)
  calcular_0_v2(cc_pesta, [])
}


function poner_valor_buscar_referencia_subdetalle(campo) {

  var cc_id = campo.id
  var res = cc_id.split("qqq");
  var res2 = res[1].split("yyy");
  var res3 = res2[1].split("www");

  var cc_pesta = res[0].substring(2);
  var cc_fila = res2[0]
  var cc_head = res3[0]
  var cc_nombre = res3[1]

  document.getElementById(campo.id).value = document.getElementById("vfinal_bus_2").value

  anexos = []

  Response = dict_pestalla['p-' + cc_pesta]

  for (x = 0; x < Response["campos_subdet"].length; x++) {
    if (Response["campos_subdet"][x]["TablaCampo"] == "cmpreferenciaadjunto") {
      if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0]["CampoReferencia"] == cc_nombre) {
        ID_TAG = 'ps' + cc_pesta + 'qqq' + cc_fila + 'yyy' + cc_head + 'www' + Response["campos_subdet"][x]["Nombre"]

        if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0]["Tipo"] == "Imagen") {


          ajuste_fila = '<img style="width: 100%;height: 60%;margin-left: auto;margin-right: auto;display: block;" id="' + ID_TAG + '_img" src="/media/archivos/' + web_Id_empresa + '/' + buscador_resultado[(document.getElementById("vfinal_bus").value - 1) + ((pago_buscador - 1) * 10)][Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0]["Sentencia"]] + '" alt="image" value="0">' + buscador_resultado[(document.getElementById("vfinal_bus").value - 1) + ((pago_buscador - 1) * 10)][Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0]["Sentencia"]]

          document.getElementById(ID_TAG + "_label").innerHTML = ajuste_fila



          document.getElementById(ID_TAG + "_label").href = '/media/archivos/' + web_Id_empresa + '/' + buscador_resultado[(document.getElementById("vfinal_bus").value - 1) + ((pago_buscador - 1) * 10)][Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0]["Sentencia"]]

          document.getElementById(ID_TAG + "_img").src = '/media/archivos/' + web_Id_empresa + '/' + buscador_resultado[(document.getElementById("vfinal_bus").value - 1) + ((pago_buscador - 1) * 10)][Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0]["Sentencia"]]

        } else {
          document.getElementById(ID_TAG).value = buscador_resultado[(document.getElementById("vfinal_bus").value - 1) + ((pago_buscador - 1) * 10)][Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0]["Sentencia"]]
        }

        for (z2 = 0; z2 < Response["campos_subdet"].length; z2++) {
          if (Response["campos_subdet"][z2]["TablaCampo"] == "cmpreferencia") {
            if (Response["func_subdet"][Response["campos_subdet"][z2]["Nombre"]][0][0]["predeterminado_valor"] == Response["campos_subdet"][x]["Nombre"]) {
              document.getElementById('ps' + pestalla + 'qqq' + cc_fila + 'yyy' + cc_head + 'www' + Response["campos_det"][z2]["Nombre"]).value = document.getElementById(ID_TAG).value
              anexos.push('ps' + pestalla + 'qqq' + cc_fila + 'yyy' + cc_head + 'www' + Response["campos_subdet"][z2]["Nombre"])
            }
          }
        }



      }
    }
    if (Response["campos_subdet"][x]["TablaCampo"] == "cmpreferencia") {

    }
  }

  //for (zt = 0; zt < anexos.length; zt++) {  
  //   buscar_referencia_detalle_enter(document.getElementById(anexos[zt]))
  //}

  calcular_subdetalle(cc_pesta, cc_fila, cc_head)
}










function mover_dir_ficha(campo, t_dir, t_tabla, t_campo, t_filtro, envio) {

  var cc_id = campo.id


  document.getElementById(campo.id).value = document.getElementById("vfinal_bus_ficha_3").value
  document.getElementById(campo.id).tag = document.getElementById("vfinal_bus_ficha_2").value


  var cc_panel = campo.id.split('_')
  var t_pkpanel = cc_panel[1]
  //document.getElementById('p_int_panel' + t_pkpanel).innerHTML = document.getElementById("vfinal_bus_ficha_3").value + ' // '  + document.getElementById("vfinal_bus_ficha_2").value

  var v_fecha = new Date(document.getElementById(campo.id + '_fecha').value)

  document.getElementById(campo.id + '_codigo').value = document.getElementById("vfinal_bus_ficha_2").value


  $.ajax({
    type: 'POST',
    url: '/mover_dir_ficha',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 't_pkpanel': t_pkpanel, 'pkvalor': document.getElementById("vfinal_bus_ficha_2").value, 'usuario': web_usuario, 't_fecha': v_fecha.format("Y-m-d"), 't_dir': t_dir, 't_tabla': t_tabla, 't_campo': t_campo, 't_filtro': t_filtro },
    success: function (Response) {
      if (Response['resp'] == '1') {

        var v_fecha = new Date(Response['fecha_new'])
        v_fecha.addDays(1)
        document.getElementById(campo.id + '_fecha').value = v_fecha.format("Y-m-d") + 'T' + v_fecha.format("H:i:s")


        var cc_busca = document.getElementById('buscaPanel_' + t_pkpanel)
        poner_valor_buscar_referencia_ficha(campo, envio)
      }

    }
  });

}
function nuevo_dir_ficha_img(pketr, pkpanel, campo, dict_add, div_envio) {

  var cc_camp = document.getElementById('buscaPanel_' + pkpanel + '_r').value.split(',')
  var cc_val = document.getElementById('buscaPanel_' + pkpanel).tag
  var v_fecha = new Date(document.getElementById('buscaPanel_' + pkpanel + '_fecha').value)




  $.ajax({
    type: 'POST',
    url: '/nuevo_dir_ficha',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 't_campo': campo, 't_valor': cc_val, 't_pketr': pketr, 't_dict_add': JSON.stringify(dict_add).replace('@fecha', v_fecha.format("Y-m-d")) },
    success: function (Response) {
      var cc_busca = document.getElementById('buscaPanel_' + pkpanel)

      modal_valor_buscar_referencia_ficha_imagen_refesh(pkpanel, cc_val)

      poner_valor_buscar_referencia_ficha_imagen('buscaPanel_' + pkpanel, -1)
    }
  });

}


function cambio_dir_reget_img(envio, pkreg, pketr, pkpanel) {

  const files = document.getElementById(envio.id).files
  const formData = new FormData()
  formData.append('csrfmiddlewaretoken', web_token)
  formData.append('Id_empresa', web_Id_empresa)
  formData.append('id_archivo', envio.id)

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

  fetch('/ccimagenes/', { method: 'POST', headers: headers, body: formData, mode: 'no-cors', }).then(response => {
    console.log(response)

  })
  var t_id = envio.id.split('_')
  var t_campo = t_id[2]
  var t_val = files[0]['name']
  var t_pkreg = pkreg
  var t_pketr = pketr





  $.ajax({
    type: 'POST',
    url: '/cambio_dir_reget',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 't_campo': t_campo, 't_val': t_val, 't_pkreg': t_pkreg, 't_pketr': t_pketr },
    success: function (Response) {
      envio.style.backgroundColor = 'lightcyan'

      document.getElementById(envio.id + '_x').innerHTML = '<a href="/media/archivos/' + web_Id_empresa + '/' + files[0]['name'] + '" target="_blank"> ' + files[0]['name'] + '</a>'
      grid= document.getElementById(envio.id + '_x')
      grid.parentElement.parentElement.childNodes[1].src = '/media/archivos/' + web_Id_empresa + '/' + files[0]['name'] 

    }
  });
}


var dict_ficha = {}




function filtrar_auditoria() {



  var vals_audit = document.getElementById('vfinal_auditoria').value.split(',')

  cmpsenten = "select * from llankay_log where "
  for (x = (0); x < vals_audit.length; x++) {
    cmpsenten = cmpsenten + " sentencia like '%" + vals_audit[x] + "%' and "

  }

  cmpsenten = cmpsenten.substring(0, cmpsenten.length - 4)



  $.ajax({
    type: 'POST',
    url: '/buscador_auditoria',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'cmpsenten': cmpsenten, 'usuario': web_usuario },
    beforeSend: function () {

      $('#intbuscador').html('Buscando información...');
    },
    success: function (Response) {

      if (Response['cmpvalor'].length == 0) {
        //data_int = '<div class="col-lg-3">No existen datos</div>'
        data_int = 'No existen datos'

      } else {


        data_int = ''
        data_int = data_int + '<table style="font-size: 11px;background: white;" width="100%" class="table table-striped table-bordered table-hover"><thead><tr>'

        data_int = data_int + '<th>fecha</th>'
        data_int = data_int + '<th>Usuario</th>'
        data_int = data_int + '<th>Accion</th>'
        data_int = data_int + '<th>Datos</th>'

        data_int = data_int + '</tr></thead><tbody>'


        for (x = (0); x < Response['cmpvalor'].length; x++) {
          data_int = data_int + '<tr>'


          //if(visibles[x2] == 'S'){
          var d = new Date(Response['cmpvalor'][x]['fecha'])


          data_int = data_int + '<td>' + Response['cmpvalor'][x]['usuario'] + '</td>'
          data_int = data_int + '<td>' + d.format("Y-m-d H:i:s") + '</td>'

          data_int = data_int + '<td>' + Response['cmpvalor'][x]['ip'] + '</td>'


          //if(Response['cmpvalor'][x]['ip'] == 'Guardar Registro Nuevo' || Response['cmpvalor'][x]['ip'] == 'Modificar Registro'){
          if (1 == 1) {
            var elemtt = {}

            try {
              //elemtt = JSON.parse(Response['cmpvalor'][x]['sentencia'].replaceAll("'", '"').replaceAll("\n", ' ').replaceAll("\t", ' '));
              elemtt = JSON.parse(Response['cmpvalor'][x]['sentencia'].replace(new RegExp("'", 'g'), '"').replace(new RegExp("\n", 'g'), ' ').replace(new RegExp("\t", 'g'), ' '));

            }
            catch (error) {

              //elemtt = { 'SQL': [{ 'Directo': Response['cmpvalor'][x]['sentencia'].replaceAll("'", '"').replaceAll("\n", ' ').replaceAll("\t", ' ') }] }
              elemtt = { 'SQL': [{ 'Directo': Response['cmpvalor'][x]['sentencia'].replace(new RegExp("'", 'g'), '"').replace(new RegExp("\n", 'g'), ' ').replace(new RegExp("\t", 'g'), ' ') }] }


            }

            data_int = data_int + '<td>'



            for (x2 = (0); x2 < Object.keys(elemtt).length; x2++) {

              data_int = data_int + '<div class="box-group" id="audit_cab_' + x + '_' + x2 + '"><div class="panel box box-success"><div class="box-header with-border" style="padding-top: 5px;padding-bottom: 5px;"><h5>'

              data_int = data_int + '<a data-toggle="collapse" data-parent="#audit_cab_' + x + '_' + x2 + '" href="#audit_pie_' + x + '_' + x2 + '" class="collapsed" aria-expanded="false">' + Object.keys(elemtt)[x2] + '</a></h4></div>'


              data_int = data_int + '<div id="audit_pie_' + x + '_' + x2 + '" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;"><div class="box-body">'

              data_int = data_int + '<table style="font-size: 11px;background: white;" width="100%" class="table table-striped table-bordered table-hover"><thead><tr><th>Campo</th><th style="text-align: right;">Valor</th></tr></thead><tbody>'

              for (x3 = (0); x3 < elemtt[Object.keys(elemtt)[x2]].length; x3++) {


                for (x4 = (0); x4 < Object.keys(elemtt[Object.keys(elemtt)[x2]][x3]).length; x4++) {
                  if (x3 % 2 == 0) {
                    data_int = data_int + '<tr style="background: white;">'
                  } else {
                    data_int = data_int + '<tr style="background: aliceblue;">'
                  }
                  var tagg = Object.keys(elemtt[Object.keys(elemtt)[x2]][x3])[x4]
                  data_int = data_int + '<td>' + tagg + '</td><td style="text-align: right;">' + elemtt[Object.keys(elemtt)[x2]][x3][tagg] + '</td>'
                  data_int = data_int + '</tr>'
                }

              }
              data_int = data_int + '</tbody></table></div></div></div></div>'

            }
            data_int = data_int + '</td>'

          } else {
            data_int = data_int + '<td>' + Response['cmpvalor'][x]['sentencia'] + '</td>'
          }


          //}else{
          //  data_int = data_int + '<td style="display: none;">' + Response['cmpvalor'][x][orden[x2]] + '</td>'
          //}
          data_int = data_int + '</tr>'
        }

        data_int = data_int + '</tbody></table>'
      }


      $('#div_modal_auditoria').html(data_int);

    }
  });
}



function min_tab_panel(planel) {
  var panl = document.getElementById(planel.id)
  if (panl.hidden == true) { panl.hidden = false } else { panl.hidden = true }

  //panl.height = 
}

function ficha_fecha_directo(fecha, t_pkpanel) {



  var v_fecha = new Date(fecha)
  v_fecha.addDays(1)
  document.getElementById('buscaPanel_' + t_pkpanel + '_fecha').value = v_fecha.format("Y-m-d") + 'T' + v_fecha.format("H:i:s")


  var cc_busca = document.getElementById('buscaPanel_' + t_pkpanel)
  poner_valor_buscar_referencia_ficha(cc_busca, 0)
}




function modal_valor_buscar_referencia_ficha_imagen_refesh(t_pkpanel, pkvalor) {

  var img = document.getElementById('mapa_img_' + t_pkpanel)

  var v_fecha = new Date(document.getElementById('buscaPanel_' + t_pkpanel + '_fecha').value)

  document.getElementById('buscaPanel_' + t_pkpanel).tag = pkvalor




  $.ajax({
    type: 'POST',
    url: '/traer_ficha_valores',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 't_pkpanel': t_pkpanel, 'pkvalor': pkvalor, 'usuario': web_usuario, 'v_fecha': v_fecha.format("Y-m-d") },
    success: function (Response) {
      dict_ficha[t_pkpanel] = Response
      var html_fcha = ''
      var html_fcha_izq = ''

      var html_fcha_der = ''
      var html_temp = ''




      html_temp = ''


      for (x = 0; x < Response["dbgrupos"].length; x++) {
        html_temp = '<div class="col-md-' + Response["dbgrupos"][x]['tamano'] + '" id="pa_' + t_pkpanel + '_' + x + '">'
        html_temp = html_temp + '<div class="box box-primary direct-chat direct-chat-primary">'
        html_temp = html_temp + '<div class="box-header with-border">'

        //html_temp = html_temp + '<div class="input-group input-group-sm" style="width: 100%;">'

        html_temp = html_temp + '<div class="row" style="padding-top: 0px;">'

        html_temp = html_temp + '<div class="col-lg-5 col-md-5 col-sm-5 col-xs-6" style="padding-right: 0px;padding-left: 20px;"> '
        html_temp = html_temp + '<h3 class="box-title" style="padding-top: 15px;margin-top: 0px;">' + Response["dbgrupos"][x]['nombre'] + '</h3>'

        html_temp = html_temp + '</div>'


        //html_temp = html_temp + '<div class="col-xs-6">'


        html_temp = html_temp + '' + Response["dbgrupos"][x]['nuevo'] + ' <div class="col-lg-2 col-md-2 col-sm-2 col-xs-4" style="padding-right: 0px;padding-left: 20px;"> <button type="button" class="btn btn-box-tool" onClick="min_tab_panel(p_' + t_pkpanel + '_' + x + ')"><i class="fa fa-minus"></i></button>'
        html_temp = html_temp + '</div>'

        //html_temp = html_temp + '</div>'



        //html_temp = html_temp +  '</div>'  

        html_temp = html_temp + '</div>'



        html_temp = html_temp + '<div class="box-body" id="p_' + t_pkpanel + '_' + x + '">'

        var int_campos = Response["dbgrupos"][x]['Campo'].split(',')

        var l_etiquetas = Response["dbgrupos"][x]['etiquetas'].split(',')



        for (x2 = 0; x2 < Response["dbgrupos"][x]['vals'].length; x2++) {
          if (Response["dbgrupos"][x]['tipo'] == 'ficha') {
            if (x2 % 2 == 0) {
              html_temp = html_temp + '<div class="row" style="background-color: white; display: block; width: 100%;" id="ficfil' + Response["dbgrupos"][x]['pkgrupo'] + '_' + x2 + '">'
            } else {
              html_temp = html_temp + '<div class="row" style="background-color: aliceblue; display: block; width: 100%;" id="ficfil' + Response["dbgrupos"][x]['pkgrupo'] + '_' + x2 + '">'

            }
            //html_temp = html_temp + Response["dbgrupos"][x]['Valor'].replace(/@linea@/g, x2)
            //alert(Response["dbgrupos"][x]['Valor'])
            for (z = 0; z < Object.keys(Response["dbgrupos"][x]['Valor']).length; z++) {
              t_pkgrupo = Object.keys(Response["dbgrupos"][x]['Valor'])[z] // 36 eti

              for (z2 = 0; z2 < Object.keys(Response["dbgrupos"][x]['Valor'][t_pkgrupo]).length; z2++) {
                nom_campo = Object.keys(Response["dbgrupos"][x]['Valor'][t_pkgrupo])[z2] // nom campo

                if (Response["dbgrupos"][x]['Valor'][t_pkgrupo][nom_campo]['tipo'] == '@listado') {
                  html_temp = html_temp + '<datalist id="ficha' + t_pkgrupo + '_' + x2 + '_' + nom_campo + '">'
                  for (z3 = 0; z3 < Response["dbgrupos"][x]['Valor'][t_pkgrupo][nom_campo]['vlas'].length; z3++) {
                    html_temp = html_temp + '<option value="' + Response["dbgrupos"][x]['Valor'][t_pkgrupo][nom_campo]['vlas'][z3]['Valor'] + '">' + Response["dbgrupos"][x]['Valor'][t_pkgrupo][nom_campo]['vlas'][z3]['Valor'] + '</option>'
                  }
                  html_temp = html_temp + '</datalist>'
                }
              }
            }
            for (x3 = 0; x3 < Object.keys(Response["dbgrupos"][x]['vals'][x2]).length; x3++) {

              var nom_tex = Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3].split('_')

              var para_label = nom_tex[0]

              for (f1 = 0; f1 < l_etiquetas.length; f1++) {
                var min_eti = l_etiquetas[f1].split('=')
                if (min_eti[0] == Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3]) {
                  para_label = min_eti[1]
                }

              }


              if (Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3][0] != '@') {



                vlrtxt_div = ''
                vlrtxt_div_cierre = ''

                if (nom_tex.length == 1) {
                  vlrtxt_div = '<div class="col-lg-11 col-md-11 col-sm-11 col-xs-11" style="padding-right: 0px;padding-left: 20px;">'
                  vlrtxt_div_cierre = '</div>'
                } else {
                  //para_label = nom_tex[0]
                  vlrtxt_div = '<div class="col-lg-' + nom_tex[1].substring(0, nom_tex[1].length - 1) + ' col-md-' + nom_tex[1].substring(0, nom_tex[1].length - 1) + ' col-sm-' + nom_tex[1].substring(0, nom_tex[1].length - 1) + ' col-xs-' + nom_tex[1].substring(0, nom_tex[1].length - 1) + '" style="padding-right: 0px;padding-left: 20px;">'
                  vlrtxt_div_cierre = '</div>'
                }



                if (int_campos.indexOf(para_label) != -1) {
                  if (nom_tex.length == 1) {
                    html_temp = html_temp + vlrtxt_div + '<label class="control-label style="font-size: 12px;font-weight: bold;">' + para_label + '</label>'
                    html_temp = html_temp + '<input type="text" class="form-control" value="' + Response["dbgrupos"][x]['vals'][x2][Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3]] + '" style="height: 25px;font-size: 11px;" id="ficha' + x + '_' + x2 + '_' + Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3] + '" onchange="cambio_dir_reget(this, ' + Response["dbgrupos"][x]['vals'][x2]['@pkregistro'] + ',' + Response["dbgrupos"][x]['vals'][x2]['@pkestru'] + ', ' + t_pkpanel + ')" list="ficha' + Response["dbgrupos"][x]['pkgrupo'] + '_' + x2 + '_' + para_label + '">'

                  } else {

                    if (nom_tex[1].substring(nom_tex[1].length - 1) == 'x') {     //filefilefilefilefile
                      html_temp = html_temp + vlrtxt_div + '<label class="control-label style="font-size: 12px;font-weight: bold;">' + para_label + '</label>'



                      html_temp = html_temp + '<div class="input-group input-group" style="margin-top: 0px;width: 100%;"><input type="file" class="form-control" value="' + Response["dbgrupos"][x]['vals'][x2][Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3]] + '" style="height: 25px;font-size: 11px; width: 50%;" id="ficha' + x + '_' + x2 + '_' + Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3] + '" onchange="cambio_dir_reget_img(this, ' + Response["dbgrupos"][x]['vals'][x2]['@pkregistro'] + ',' + Response["dbgrupos"][x]['vals'][x2]['@pkestru'] + ', ' + t_pkpanel + ')" list="ficha' + Response["dbgrupos"][x]['pkgrupo'] + '_' + x2 + '_' + para_label + '">'


                      html_temp = html_temp + '<p id="ficha' + x + '_' + x2 + '_' + Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3] + '_x" style="cursor: pointer;"><a href="/media/archivos/' + web_Id_empresa + '/' + Response["dbgrupos"][x]['vals'][x2][Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3]] + '" target="_blank"> ' + Response["dbgrupos"][x]['vals'][x2][Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3]] + '</a><p></div>'

                    }

                    if (nom_tex[1].substring(nom_tex[1].length - 1) == 'r') {     //referncia
                      html_temp = html_temp + vlrtxt_div + '<label class="control-label style="font-size: 12px;font-weight: bold;">' + para_label + '</label>'

                      html_temp = html_temp + '<div class="input-group input-group" style="margin-top: 0px;width: 100%;"><input type="text" class="form-control" value="' + Response["dbgrupos"][x]['vals'][x2][Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3]] + '" style="height: 25px;font-size: 11px;width: 90%;" id="ficha' + x + '_' + x2 + '_' + Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3] + '" onchange="cambio_dir_reget(this, ' + Response["dbgrupos"][x]['vals'][x2]['@pkregistro'] + ',' + Response["dbgrupos"][x]['vals'][x2]['@pkestru'] + ', ' + t_pkpanel + ')" list="ficha' + Response["dbgrupos"][x]['pkgrupo'] + '_' + x2 + '_' + para_label + '"><button type="button" class="btn btn-info" data-toggle="modal" data-target="#modal-default_ficha_ref" onclick="buscar_referencia_ficha(ficha' + x + '_' + x2 + '_' + Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3] + ', ' + t_pkpanel + ')" style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></button></div>'

                    }
                    if (nom_tex[1].substring(nom_tex[1].length - 1) == 'm') {     //referncia
                      html_temp = html_temp + vlrtxt_div + '<label class="control-label style="font-size: 12px;font-weight: bold;">' + para_label + '</label>'

                      html_temp = html_temp + '<div class="input-group input-group" style="margin-top: 0px;width: 100%;"><input type="text" class="form-control" value="' + Response["dbgrupos"][x]['vals'][x2][Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3]] + '" style="height: 25px;font-size: 11px;width: 90%;" id="ficha' + x + '_' + x2 + '_' + Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3] + '" onchange="cambio_dir_reget(this, ' + Response["dbgrupos"][x]['vals'][x2]['@pkregistro'] + ',' + Response["dbgrupos"][x]['vals'][x2]['@pkestru'] + ', ' + t_pkpanel + ')" list="ficha' + Response["dbgrupos"][x]['pkgrupo'] + '_' + x2 + '_' + para_label + '"><button type="button" class="btn btn-info" data-toggle="modal" data-target="#modal-default_ficha_ref" onclick="buscar_referencia_ficha(ficha' + x + '_' + x2 + '_' + Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3] + ', ' + t_pkpanel + ')" style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></button></div>'

                    }


                    if (nom_tex[1].substring(nom_tex[1].length - 1) == 'i') {
                      vlrtxt_div = ''
                      vlrtxt_div_cierre = ''
                      html_temp = html_temp + '<input type="hidden" class="form-control" value="' + Response["dbgrupos"][x]['vals'][x2][Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3]] + '" style="height: 25px;font-size: 11px;" id="ficha' + x + '_' + x2 + '_' + Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3] + '" onchange="cambio_dir_reget(this, ' + Response["dbgrupos"][x]['vals'][x2]['@pkregistro'] + ',' + Response["dbgrupos"][x]['vals'][x2]['@pkestru'] + ', ' + t_pkpanel + ')" list="ficha' + Response["dbgrupos"][x]['pkgrupo'] + '_' + x2 + '_' + para_label + '">'

                    }


                    if (nom_tex[1].substring(nom_tex[1].length - 1) == 't') {
                      html_temp = html_temp + vlrtxt_div + '<label class="control-label style="font-size: 12px;font-weight: bold;">' + para_label + '</label>'

                      html_temp = html_temp + '<input type="text" class="form-control" value="' + Response["dbgrupos"][x]['vals'][x2][Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3]] + '" style="height: 25px;font-size: 11px;" id="ficha' + x + '_' + x2 + '_' + Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3] + '" onchange="cambio_dir_reget(this, ' + Response["dbgrupos"][x]['vals'][x2]['@pkregistro'] + ',' + Response["dbgrupos"][x]['vals'][x2]['@pkestru'] + ', ' + t_pkpanel + ')" list="ficha' + Response["dbgrupos"][x]['pkgrupo'] + '_' + x2 + '_' + para_label + '">'

                    }
                    if (nom_tex[1].substring(nom_tex[1].length - 1) == 'n') {
                      html_temp = html_temp + vlrtxt_div + '<label class="control-label style="font-size: 12px;font-weight: bold;">' + para_label + '</label>'

                      html_temp = html_temp + '<input type="number" class="form-control" value="' + Response["dbgrupos"][x]['vals'][x2][Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3]] + '" style="height: 25px;font-size: 11px;" id="ficha' + x + '_' + x2 + '_' + Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3] + '" onchange="cambio_dir_reget(this, ' + Response["dbgrupos"][x]['vals'][x2]['@pkregistro'] + ',' + Response["dbgrupos"][x]['vals'][x2]['@pkestru'] + ', ' + t_pkpanel + ')" list="ficha' + Response["dbgrupos"][x]['pkgrupo'] + '_' + x2 + '_' + para_label + '">'
                    }
                    if (nom_tex[1].substring(nom_tex[1].length - 1) == 'a') {
                      html_temp = html_temp + vlrtxt_div + '<label class="control-label style="font-size: 12px;font-weight: bold;">' + para_label + '</label>'
                      html_temp = html_temp + '<textarea class="form-control" value="' + Response["dbgrupos"][x]['vals'][x2][Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3]] + '" style="height: 80px;font-size: 11px;" id="ficha' + x + '_' + x2 + '_' + Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3] + '" onchange="cambio_dir_reget(this, ' + Response["dbgrupos"][x]['vals'][x2]['@pkregistro'] + ',' + Response["dbgrupos"][x]['vals'][x2]['@pkestru'] + ', ' + t_pkpanel + ')" list="ficha' + Response["dbgrupos"][x]['pkgrupo'] + '_' + x2 + '_' + para_label + '">' + Response["dbgrupos"][x]['vals'][x2][Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3]] + '</textarea>'
                    }
                    if (nom_tex[1].substring(nom_tex[1].length - 1) == 'f') {
                      html_temp = html_temp + vlrtxt_div + '<label class="control-label style="font-size: 12px;font-weight: bold;">' + para_label + '</label>'

                      var now = new Date(Response["dbgrupos"][x]['vals'][x2][Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3]]);
                      valor_campo = now.format("Y-m-d") + 'T' + now.format("H:i:s")

                      html_temp = html_temp + '<input type="datetime-local" class="form-control" value="' + valor_campo + '" style="height: 25px;font-size: 11px;" id="ficha' + x + '_' + x2 + '_' + Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3] + '" onchange="cambio_dir_reget(this, ' + Response["dbgrupos"][x]['vals'][x2]['@pkregistro'] + ',' + Response["dbgrupos"][x]['vals'][x2]['@pkestru'] + ', ' + t_pkpanel + ')" list="ficha' + Response["dbgrupos"][x]['pkgrupo'] + '_' + x2 + '_' + para_label + '">'
                    }
                    if (nom_tex[1].substring(nom_tex[1].length - 1) == 'o') {
                      html_temp = html_temp + vlrtxt_div + '<label class="control-label style="font-size: 12px;font-weight: bold;">' + para_label + '</label>'
                      html_temp = html_temp + '<select class="form-control" value="' + Response["dbgrupos"][x]['vals'][x2][Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3]] + '" style="height: 30px;font-size: 11px;" id="ficha' + x + '_' + x2 + '_' + Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3] + '" onchange="cambio_dir_reget(this, ' + Response["dbgrupos"][x]['vals'][x2]['@pkregistro'] + ',' + Response["dbgrupos"][x]['vals'][x2]['@pkestru'] + ', ' + t_pkpanel + ')" list="ficha' + Response["dbgrupos"][x]['pkgrupo'] + '_' + x2 + '_' + para_label + '">'

                      for (z = 0; z < Object.keys(Response["dbgrupos"][x]['Valor']).length; z++) {
                        t_pkgrupo = Object.keys(Response["dbgrupos"][x]['Valor'])[z] // 36 eti
                        nom_campo = nom_tex[0] // nom campo
                        if (Response["dbgrupos"][x]['Valor'][t_pkgrupo][nom_campo]['tipo'] == '@opcion') {
                          for (z3 = 0; z3 < Response["dbgrupos"][x]['Valor'][t_pkgrupo][nom_campo]['vlas'].length; z3++) {
                            if (Response["dbgrupos"][x]['Valor'][t_pkgrupo][nom_campo]['vlas'][z3]['Valor'] == Response["dbgrupos"][x]['vals'][x2][Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3]]) {
                              html_temp = html_temp + '<option selected>' + Response["dbgrupos"][x]['Valor'][t_pkgrupo][nom_campo]['vlas'][z3]['Valor'] + '</option>'
                            } else {
                              html_temp = html_temp + '<option>' + Response["dbgrupos"][x]['Valor'][t_pkgrupo][nom_campo]['vlas'][z3]['Valor'] + '</option>'

                            }
                          }
                        }
                      }

                      html_temp = html_temp + '</select>'

                    }

                  }

                } else {

                  html_temp = html_temp + vlrtxt_div + '<label class="control-label style="font-size: 12px;font-weight: bold;">' + para_label + '</label>'
                  html_temp = html_temp + '<input type="text" class="form-control" id="ficha' + x + '_' + x2 + '_' + Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3] + '" value="' + Response["dbgrupos"][x]['vals'][x2][Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3]] + '" readonly="readonly" disabled="" style="height: 25px;font-size: 11px;">'
                }


                html_temp = html_temp + vlrtxt_div_cierre



              } else {

                if (Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3] == '@btn_mod') {
                  html_temp = html_temp + '<div class="" style="padding-right: 0px;padding-left: 20px;">'

                  html_temp = html_temp + '<a class="btn btn-success" onclick="registro(' + Response["dbgrupos"][x]['vals'][x2][Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3]] + ')" style="padding: 2px 2px; margin-right: 0px; margin-left: 5px;"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a></div>'
                }
                if (Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3] == '@btn_con') {
                  html_temp = html_temp + '<div class="" style="padding-right: 0px;padding-left: 20px;">'
                  html_temp = html_temp + '<a class="btn btn-info" onclick="registro(' + Response["dbgrupos"][x]['vals'][x2][Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3]] + ')" style="padding: 2px 2px; margin-right: 0px; margin-left: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></a></div>'
                }
                if (Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3] == '@btn_eli') {
                  html_temp = html_temp + '<div class="" style="padding-right: 0px;padding-left: 20px;">'
                  html_temp = html_temp + '<a class="btn btn-danger" onclick="eliminar(' + Response["dbgrupos"][x]['vals'][x2][Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3]] + ')" style="padding: 2px 2px; margin-right: 0px; margin-left: 0px;"><span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span></a></div>'
                }
                if (Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3] == '@btn_eli_per') {
                  html_temp = html_temp + '<div class="" style="padding-right: 0px;padding-left: 20px;">'
                  html_temp = html_temp + '<a class="btn btn-danger" onclick="pre_eliminar_dir_ficha(ficfil' + Response["dbgrupos"][x]['pkgrupo'] + '_' + x2 + ', ' + Response["dbgrupos"][x]['vals'][x2][Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3]] + ')" style="padding: 2px 2px; margin-right: 0px; margin-left: 0px;"><span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span></a></div>'
                }



              }
            }
            html_temp = html_temp + '</div>'
          }



        }

        if (Response["dbgrupos"][x]['tipo'] == 'pastel') {
          html_temp = html_temp + '<canvas id="charts_p_' + Response["dbgrupos"][x]['pkgrupo'] + '" class="chartjs-render-monitor"></canvas>'
        }
        if (Response["dbgrupos"][x]['tipo'] == 'barras') {
          html_temp = html_temp + '<canvas id="charts_p_' + Response["dbgrupos"][x]['pkgrupo'] + '" class="chartjs-render-monitor"></canvas>'
        }
        if (Response["dbgrupos"][x]['tipo'] == 'barras_Continua') {
          html_temp = html_temp + '<canvas id="charts_p_' + Response["dbgrupos"][x]['pkgrupo'] + '" class="chartjs-render-monitor"></canvas>'
        }
        if (Response["dbgrupos"][x]['tipo'] == 'barras_Sumas') {
          html_temp = html_temp + '<canvas id="charts_p_' + Response["dbgrupos"][x]['pkgrupo'] + '" class="chartjs-render-monitor"></canvas>'
        }
        if (Response["dbgrupos"][x]['tipo'] == 'tabla') {

          html_temp = html_temp + '<div id="charts_p_' + Response["dbgrupos"][x]['pkgrupo'] + '"></div>'
        }


        html_temp = html_temp + '</div></div></div></div>'

        html_fcha = html_fcha + html_temp

      }
      document.getElementById('div_modal_ficha_imagen').innerHTML = html_fcha

      for (x = 0; x < Response["dbgrupos"].length; x++) {
        for (x2 = 0; x2 < Response["dbgrupos"][x]['vals'].length; x2++) {
          if (Response["dbgrupos"][x]['tipo'] == 'pastel') {
            temp_valores = []
            temp_backgroundColor = []
            temp_labels = []

            v_x = Response["dbgrupos"][x]['Valor']
            v_y = Response["dbgrupos"][x]['Campo']

            for (z = 0; z < Response["dbgrupos"][x]["vals"].length; z++) {
              temp_valores.push(Response["dbgrupos"][x]["vals"][z][v_x])
              temp_backgroundColor.push('rgb(' + Math.floor(Math.random() * 254) + ',' + Math.floor(Math.random() * 254) + ',' + Math.floor(Math.random() * 254) + ')')
              temp_labels.push(Response["dbgrupos"][x]["vals"][z][v_y])


            }


            data_final = {}
            data_final['datasets'] = [{ 'data': temp_valores, 'backgroundColor': temp_backgroundColor, 'label': Response["dbgrupos"][x]['nombre'] }]
            data_final['labels'] = temp_labels



            var config = {
              type: 'pie',
              data: data_final,
              options: {
                responsive: true, legend: { position: 'none', },
                title: { display: true, text: Response["dbgrupos"][x]['nombre'] },
                animation: { animateScale: true, animateRotate: true }
              }
            };

            //var divcemaforo = document.getElementById('chart_pie');
            //divcemaforo.appendChild(iDiv);

            var canvas_int = document.getElementById('charts_p_' + Response["dbgrupos"][x]['pkgrupo']).getContext('2d');
            window.myLine = new Chart(canvas_int, config);
          }

          if (Response["dbgrupos"][x]['tipo'] == 'barras') {
            data_final = {}
            data_temp = []
            v_x = Response["dbgrupos"][x]['Valor']
            v_y = Response["dbgrupos"][x]['Campo']


            data_final['labels'] = v_x.split(",")
            for (z = 0; z < Response["dbgrupos"][x]["vals"].length; z++) {
              data_linea = {}

              data_linea['label'] = Response["dbgrupos"][x]["vals"][z][v_y]
              data_linea['backgroundColor'] = 'rgb(' + Math.floor(Math.random() * 254) + ',' + Math.floor(Math.random() * 254) + ',' + Math.floor(Math.random() * 254) + ')'
              data_linea['borderColor'] = 'rgb(' + Math.floor(Math.random() * 254) + ',' + Math.floor(Math.random() * 254) + ',' + Math.floor(Math.random() * 254) + ')'
              data_linea['fill'] = false

              data_valor = []
              columas = v_x.split(",")
              for (y3 = 0; y3 < columas.length; y3++) {
                data_valor.push(Response["dbgrupos"][x]["vals"][z][columas[y3]])
              }
              data_linea['data'] = data_valor
              data_temp.push(data_linea)
            }

            data_final['datasets'] = data_temp

            var config = {
              type: 'line',
              data: data_final,
              options: {
                responsive: true, title: { display: false, text: Response["dbgrupos"][x]['nombre'] },
                tooltips: { mode: 'index', intersect: false, },
                hover: { mode: 'nearest', intersect: true },
                scales: {
                  xAxes: [{ display: true, scaleLabel: { display: true, labelString: Response["dbgrupos"][x]['etiquetas'] } }],
                  yAxes: [{ display: true, scaleLabel: { display: true, labelString: v_y } }]
                }
              }
            };

            var canvas_int = document.getElementById('charts_p_' + Response["dbgrupos"][x]['pkgrupo']).getContext('2d');
            window.myLine = new Chart(canvas_int, config);
          }
          if (Response["dbgrupos"][x]['tipo'] == 'barras_Continua') {
            data_final = {}
            data_temp = []
            v_x = Response["dbgrupos"][x]['Valor']
            v_y = Response["dbgrupos"][x]['Campo']


            data_final['labels'] = v_x.split(",")
            for (z = 0; z < Response["dbgrupos"][x]["vals"].length; z++) {
              data_linea = {}

              data_linea['label'] = Response["dbgrupos"][x]["vals"][z][v_y]
              data_linea['backgroundColor'] = 'rgb(' + Math.floor(Math.random() * 254) + ',' + Math.floor(Math.random() * 254) + ',' + Math.floor(Math.random() * 254) + ')'
              data_linea['borderColor'] = 'rgb(' + Math.floor(Math.random() * 254) + ',' + Math.floor(Math.random() * 254) + ',' + Math.floor(Math.random() * 254) + ')'
              data_linea['fill'] = false

              data_valor = []
              columas = v_x.split(",")
              var ultimo = 0
              for (y3 = 0; y3 < columas.length; y3++) {
                if (parseFloat(Response["dbgrupos"][x]["vals"][z][columas[y3]]) == 0.00) {
                  data_valor.push(ultimo)

                } else {
                  data_valor.push(Response["dbgrupos"][x]["vals"][z][columas[y3]])
                  ultimo = Response["dbgrupos"][x]["vals"][z][columas[y3]]
                }

              }
              data_linea['data'] = data_valor
              data_temp.push(data_linea)
            }

            data_final['datasets'] = data_temp

            var config = {
              type: 'line',
              data: data_final,
              options: {
                responsive: true, title: { display: false, text: Response["dbgrupos"][x]['nombre'] },
                tooltips: { mode: 'index', intersect: false, },
                hover: { mode: 'nearest', intersect: true },
                scales: {
                  xAxes: [{ display: true, scaleLabel: { display: true, labelString: Response["dbgrupos"][x]['etiquetas'] } }],
                  yAxes: [{ display: true, scaleLabel: { display: true, labelString: v_y } }]
                }
              }
            };

            var canvas_int = document.getElementById('charts_p_' + Response["dbgrupos"][x]['pkgrupo']).getContext('2d');
            window.myLine = new Chart(canvas_int, config);
          }
          if (Response["dbgrupos"][x]['tipo'] == 'barras_Sumas') {
            data_final = {}
            data_temp = []
            v_x = Response["dbgrupos"][x]['Valor']
            v_y = Response["dbgrupos"][x]['Campo']


            data_final['labels'] = v_x.split(",")
            for (z = 0; z < Response["dbgrupos"][x]["vals"].length; z++) {
              data_linea = {}

              data_linea['label'] = Response["dbgrupos"][x]["vals"][z][v_y]
              data_linea['backgroundColor'] = 'rgb(' + Math.floor(Math.random() * 254) + ',' + Math.floor(Math.random() * 254) + ',' + Math.floor(Math.random() * 254) + ')'
              data_linea['borderColor'] = 'rgb(' + Math.floor(Math.random() * 254) + ',' + Math.floor(Math.random() * 254) + ',' + Math.floor(Math.random() * 254) + ')'
              data_linea['fill'] = false

              data_valor = []
              columas = v_x.split(",")
              var ultimo = 0
              for (y3 = 0; y3 < columas.length; y3++) {

                ultimo = ultimo + parseFloat(Response["dbgrupos"][x]["vals"][z][columas[y3]])

                data_valor.push(ultimo)


              }
              data_linea['data'] = data_valor
              data_temp.push(data_linea)
            }

            data_final['datasets'] = data_temp

            var config = {
              type: 'line',
              data: data_final,
              options: {
                responsive: true, title: { display: false, text: Response["dbgrupos"][x]['nombre'] },
                tooltips: { mode: 'index', intersect: false, },
                hover: { mode: 'nearest', intersect: true },
                scales: {
                  xAxes: [{ display: true, scaleLabel: { display: true, labelString: Response["dbgrupos"][x]['etiquetas'] } }],
                  yAxes: [{ display: true, scaleLabel: { display: true, labelString: v_y } }]
                }
              }
            };

            var canvas_int = document.getElementById('charts_p_' + Response["dbgrupos"][x]['pkgrupo']).getContext('2d');
            window.myLine = new Chart(canvas_int, config);
          }
          if (Response["dbgrupos"][x]['tipo'] == 'tabla') {
            v_x = Response["dbgrupos"][x]['Valor']

            columas = v_x.split(",")



            div_html = '<table class="table table-hover table-striped"><thead style="font-weight: bold;">'

            div_html = div_html + '<tr>'

            for (y3 = 0; y3 < columas.length; y3++) {
              div_html = div_html + '<th>' + columas[y3] + '</th>'

            }

            div_html = div_html + '</tr></thead><tbody>'



            for (z = 0; z < Response["dbgrupos"][x]["vals"].length; z++) {
              div_html = div_html + ' <tr>'
              for (y3 = 0; y3 < columas.length; y3++) {
                div_html = div_html + '<td>' + Response["dbgrupos"][x]["vals"][z][columas[y3]] + '</td>'

              }
              div_html = div_html + ' </tr>'

            }

            div_html = div_html + '</tbody></table>'

            var canvas_int = document.getElementById('charts_p_' + Response["dbgrupos"][x]['pkgrupo'])
            canvas_int.innerHTML = div_html
          }
        }
      }

    }
  });

}


function modal_valor_buscar_referencia_ficha_imagen(t_pkpanel, pkvalor) {

  var img = document.getElementById('mapa_img_' + t_pkpanel)
  img.click()

  var v_fecha = new Date(document.getElementById('buscaPanel_' + t_pkpanel + '_fecha').value)

  document.getElementById('buscaPanel_' + t_pkpanel).tag = pkvalor




  $.ajax({
    type: 'POST',
    url: '/traer_ficha_valores',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 't_pkpanel': t_pkpanel, 'pkvalor': pkvalor, 'usuario': web_usuario, 'v_fecha': v_fecha.format("Y-m-d") },
    success: function (Response) {
      dict_ficha[t_pkpanel] = Response
      var html_fcha = ''
      var html_fcha_izq = ''

      var html_fcha_der = ''
      var html_temp = ''




      html_temp = ''


      for (x = 0; x < Response["dbgrupos"].length; x++) {
        html_temp = '<div class="col-md-' + Response["dbgrupos"][x]['tamano'] + '" id="pa_' + t_pkpanel + '_' + x + '">'
        html_temp = html_temp + '<div class="box box-primary direct-chat direct-chat-primary">'
        html_temp = html_temp + '<div class="box box-info">'

        //html_temp = html_temp + '<div class="input-group input-group-sm" style="width: 100%;">'

        html_temp = html_temp + '<div class="row" style="padding-top: 0px;">'

        html_temp = html_temp + '<div class="col-lg-5 col-md-5 col-sm-5 col-xs-6" style="padding-right: 0px;padding-left: 20px;">'
        html_temp = html_temp + '<h3 class="box-title" style="padding-top: 15px;margin-top: 0px;">' + Response["dbgrupos"][x]['nombre'] + '</h3>'

        html_temp = html_temp + '</div>'

        //html_temp = html_temp + '<div class="col-xs-6">'

        html_temp = html_temp + '' + Response["dbgrupos"][x]['nuevo'] + '<div class="col-lg-2 col-md-2 col-sm-2 col-xs-4" style="padding-right: 0px;padding-left: 20px;"> <button type="button" class="btn btn-box-tool" onClick="min_tab_panel(p_' + t_pkpanel + '_' + x + ')"><i class="fa fa-minus"></i></button>'
        html_temp = html_temp + '</div>'

        //html_temp = html_temp + '</div>'





        //html_temp = html_temp +  '</div>'  

        html_temp = html_temp + '</div>'

        html_temp = html_temp + '<div class="box-body" id="p_' + t_pkpanel + '_' + x + '">'

        var int_campos = Response["dbgrupos"][x]['Campo'].split(',')

        var l_etiquetas = Response["dbgrupos"][x]['etiquetas'].split(',')



        for (x2 = 0; x2 < Response["dbgrupos"][x]['vals'].length; x2++) {
          if (Response["dbgrupos"][x]['tipo'] == 'ficha') {
            if (x2 % 2 == 0) {
              html_temp = html_temp + '<div class="row" style="background-color: white; display: block; width: 100%;" id="ficfil' + Response["dbgrupos"][x]['pkgrupo'] + '_' + x2 + '">'
            } else {
              html_temp = html_temp + '<div class="row" style="background-color: aliceblue; display: block; width: 100%;" id="ficfil' + Response["dbgrupos"][x]['pkgrupo'] + '_' + x2 + '">'

            }
            //html_temp = html_temp + Response["dbgrupos"][x]['Valor'].replace(/@linea@/g, x2)
            //alert(Response["dbgrupos"][x]['Valor'])
            for (z = 0; z < Object.keys(Response["dbgrupos"][x]['Valor']).length; z++) {
              t_pkgrupo = Object.keys(Response["dbgrupos"][x]['Valor'])[z] // 36 eti

              for (z2 = 0; z2 < Object.keys(Response["dbgrupos"][x]['Valor'][t_pkgrupo]).length; z2++) {
                nom_campo = Object.keys(Response["dbgrupos"][x]['Valor'][t_pkgrupo])[z2] // nom campo

                if (Response["dbgrupos"][x]['Valor'][t_pkgrupo][nom_campo]['tipo'] == '@listado') {
                  html_temp = html_temp + '<datalist id="ficha' + t_pkgrupo + '_' + x2 + '_' + nom_campo + '">'
                  for (z3 = 0; z3 < Response["dbgrupos"][x]['Valor'][t_pkgrupo][nom_campo]['vlas'].length; z3++) {
                    html_temp = html_temp + '<option value="' + Response["dbgrupos"][x]['Valor'][t_pkgrupo][nom_campo]['vlas'][z3]['Valor'] + '">' + Response["dbgrupos"][x]['Valor'][t_pkgrupo][nom_campo]['vlas'][z3]['Valor'] + '</option>'
                  }
                  html_temp = html_temp + '</datalist>'
                }
              }
            }
            for (x3 = 0; x3 < Object.keys(Response["dbgrupos"][x]['vals'][x2]).length; x3++) {

              var nom_tex = Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3].split('_')

              var para_label = nom_tex[0]

              for (f1 = 0; f1 < l_etiquetas.length; f1++) {
                var min_eti = l_etiquetas[f1].split('=')
                if (min_eti[0] == Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3]) {
                  para_label = min_eti[1]
                }

              }


              if (Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3][0] != '@') {



                vlrtxt_div = ''
                vlrtxt_div_cierre = ''

                if (nom_tex.length == 1) {
                  vlrtxt_div = '<div class="col-lg-11 col-md-11 col-sm-11" style="padding-right: 0px;padding-left: 20px;">'
                  vlrtxt_div_cierre = '</div>'
                } else {
                  //para_label = nom_tex[0]
                  vlrtxt_div = '<div class="col-lg-' + nom_tex[1].substring(0, nom_tex[1].length - 1) + ' col-md-' + nom_tex[1].substring(0, nom_tex[1].length - 1) + ' col-sm-' + nom_tex[1].substring(0, nom_tex[1].length - 1) + '" style="padding-right: 0px;padding-left: 20px;">'
                  vlrtxt_div_cierre = '</div>'
                }



                if (int_campos.indexOf(para_label) != -1) {
                  if (nom_tex.length == 1) {
                    html_temp = html_temp + vlrtxt_div + '<label class="control-label style="font-size: 12px;font-weight: bold;">' + para_label + '</label>'
                    html_temp = html_temp + '<input type="text" class="form-control" value="' + Response["dbgrupos"][x]['vals'][x2][Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3]] + '" style="height: 25px;font-size: 11px;" id="ficha' + x + '_' + x2 + '_' + Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3] + '" onchange="cambio_dir_reget(this, ' + Response["dbgrupos"][x]['vals'][x2]['@pkregistro'] + ',' + Response["dbgrupos"][x]['vals'][x2]['@pkestru'] + ', ' + t_pkpanel + ')" list="ficha' + Response["dbgrupos"][x]['pkgrupo'] + '_' + x2 + '_' + para_label + '">'

                  } else {

                    if (nom_tex[1].substring(nom_tex[1].length - 1) == 'x') {     //filefilefilefilefile
                      html_temp = html_temp + vlrtxt_div + '<label class="control-label style="font-size: 12px;font-weight: bold;">' + para_label + '</label>'



                      html_temp = html_temp + '<div class="input-group input-group" style="margin-top: 0px;width: 100%;"><input type="file" class="form-control" value="' + Response["dbgrupos"][x]['vals'][x2][Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3]] + '" style="height: 25px;font-size: 11px; width: 50%;" id="ficha' + x + '_' + x2 + '_' + Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3] + '" onchange="cambio_dir_reget_img(this, ' + Response["dbgrupos"][x]['vals'][x2]['@pkregistro'] + ',' + Response["dbgrupos"][x]['vals'][x2]['@pkestru'] + ', ' + t_pkpanel + ')" list="ficha' + Response["dbgrupos"][x]['pkgrupo'] + '_' + x2 + '_' + para_label + '">'


                      html_temp = html_temp + '<p id="ficha' + x + '_' + x2 + '_' + Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3] + '_x" style="cursor: pointer;"><a href="/media/archivos/' + web_Id_empresa + '/' + Response["dbgrupos"][x]['vals'][x2][Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3]] + '" target="_blank"> ' + Response["dbgrupos"][x]['vals'][x2][Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3]] + '</a><p></div>'

                    }

                    if (nom_tex[1].substring(nom_tex[1].length - 1) == 'r') {     //referncia
                      html_temp = html_temp + vlrtxt_div + '<label class="control-label style="font-size: 12px;font-weight: bold;">' + para_label + '</label>'

                      html_temp = html_temp + '<div class="input-group input-group" style="margin-top: 0px;width: 100%;"><input type="text" class="form-control" value="' + Response["dbgrupos"][x]['vals'][x2][Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3]] + '" style="height: 25px;font-size: 11px;width: 90%;" id="ficha' + x + '_' + x2 + '_' + Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3] + '" onchange="cambio_dir_reget(this, ' + Response["dbgrupos"][x]['vals'][x2]['@pkregistro'] + ',' + Response["dbgrupos"][x]['vals'][x2]['@pkestru'] + ', ' + t_pkpanel + ')" list="ficha' + Response["dbgrupos"][x]['pkgrupo'] + '_' + x2 + '_' + para_label + '"><button type="button" class="btn btn-info" data-toggle="modal" data-target="#modal-default_ficha_ref" onclick="buscar_referencia_ficha(ficha' + x + '_' + x2 + '_' + Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3] + ', ' + t_pkpanel + ')" style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></button></div>'

                    }

                    if (nom_tex[1].substring(nom_tex[1].length - 1) == 'm') {     //referncia
                      html_temp = html_temp + vlrtxt_div + '<label class="control-label style="font-size: 12px;font-weight: bold;">' + para_label + '</label>'

                      html_temp = html_temp + '<div class="input-group input-group" style="margin-top: 0px;width: 100%;"><input type="text" class="form-control" value="' + Response["dbgrupos"][x]['vals'][x2][Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3]] + '" style="height: 25px;font-size: 11px;width: 90%;" id="ficha' + x + '_' + x2 + '_' + Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3] + '" onchange="cambio_dir_reget(this, ' + Response["dbgrupos"][x]['vals'][x2]['@pkregistro'] + ',' + Response["dbgrupos"][x]['vals'][x2]['@pkestru'] + ', ' + t_pkpanel + ')" list="ficha' + Response["dbgrupos"][x]['pkgrupo'] + '_' + x2 + '_' + para_label + '"><button type="button" class="btn btn-info" data-toggle="modal" data-target="#modal-default_ficha_ref" onclick="buscar_referencia_ficha(ficha' + x + '_' + x2 + '_' + Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3] + ', ' + t_pkpanel + ')" style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></button></div>'

                    }

                    if (nom_tex[1].substring(nom_tex[1].length - 1) == 'i') {
                      vlrtxt_div = ''
                      vlrtxt_div_cierre = ''
                      html_temp = html_temp + '<input type="hidden" class="form-control" value="' + Response["dbgrupos"][x]['vals'][x2][Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3]] + '" style="height: 25px;font-size: 11px;" id="ficha' + x + '_' + x2 + '_' + Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3] + '" onchange="cambio_dir_reget(this, ' + Response["dbgrupos"][x]['vals'][x2]['@pkregistro'] + ',' + Response["dbgrupos"][x]['vals'][x2]['@pkestru'] + ', ' + t_pkpanel + ')" list="ficha' + Response["dbgrupos"][x]['pkgrupo'] + '_' + x2 + '_' + para_label + '">'

                    }


                    if (nom_tex[1].substring(nom_tex[1].length - 1) == 't') {
                      html_temp = html_temp + vlrtxt_div + '<label class="control-label style="font-size: 12px;font-weight: bold;">' + para_label + '</label>'

                      html_temp = html_temp + '<input type="text" class="form-control" value="' + Response["dbgrupos"][x]['vals'][x2][Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3]] + '" style="height: 25px;font-size: 11px;" id="ficha' + x + '_' + x2 + '_' + Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3] + '" onchange="cambio_dir_reget(this, ' + Response["dbgrupos"][x]['vals'][x2]['@pkregistro'] + ',' + Response["dbgrupos"][x]['vals'][x2]['@pkestru'] + ', ' + t_pkpanel + ')" list="ficha' + Response["dbgrupos"][x]['pkgrupo'] + '_' + x2 + '_' + para_label + '">'

                    }
                    if (nom_tex[1].substring(nom_tex[1].length - 1) == 'n') {
                      html_temp = html_temp + vlrtxt_div + '<label class="control-label style="font-size: 12px;font-weight: bold;">' + para_label + '</label>'

                      html_temp = html_temp + '<input type="number" class="form-control" value="' + Response["dbgrupos"][x]['vals'][x2][Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3]] + '" style="height: 25px;font-size: 11px;" id="ficha' + x + '_' + x2 + '_' + Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3] + '" onchange="cambio_dir_reget(this, ' + Response["dbgrupos"][x]['vals'][x2]['@pkregistro'] + ',' + Response["dbgrupos"][x]['vals'][x2]['@pkestru'] + ', ' + t_pkpanel + ')" list="ficha' + Response["dbgrupos"][x]['pkgrupo'] + '_' + x2 + '_' + para_label + '">'
                    }
                    if (nom_tex[1].substring(nom_tex[1].length - 1) == 'a') {
                      html_temp = html_temp + vlrtxt_div + '<label class="control-label style="font-size: 12px;font-weight: bold;">' + para_label + '</label>'
                      html_temp = html_temp + '<textarea class="form-control" value="' + Response["dbgrupos"][x]['vals'][x2][Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3]] + '" style="height: 80px;font-size: 11px;" id="ficha' + x + '_' + x2 + '_' + Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3] + '" onchange="cambio_dir_reget(this, ' + Response["dbgrupos"][x]['vals'][x2]['@pkregistro'] + ',' + Response["dbgrupos"][x]['vals'][x2]['@pkestru'] + ', ' + t_pkpanel + ')" list="ficha' + Response["dbgrupos"][x]['pkgrupo'] + '_' + x2 + '_' + para_label + '">' + Response["dbgrupos"][x]['vals'][x2][Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3]] + '</textarea>'
                    }
                    if (nom_tex[1].substring(nom_tex[1].length - 1) == 'f') {
                      html_temp = html_temp + vlrtxt_div + '<label class="control-label style="font-size: 12px;font-weight: bold;">' + para_label + '</label>'

                      var now = new Date(Response["dbgrupos"][x]['vals'][x2][Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3]]);
                      valor_campo = now.format("Y-m-d") + 'T' + now.format("H:i:s")

                      html_temp = html_temp + '<input type="datetime-local" class="form-control" value="' + valor_campo + '" style="height: 25px;font-size: 11px;" id="ficha' + x + '_' + x2 + '_' + Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3] + '" onchange="cambio_dir_reget(this, ' + Response["dbgrupos"][x]['vals'][x2]['@pkregistro'] + ',' + Response["dbgrupos"][x]['vals'][x2]['@pkestru'] + ', ' + t_pkpanel + ')" list="ficha' + Response["dbgrupos"][x]['pkgrupo'] + '_' + x2 + '_' + para_label + '">'
                    }
                    if (nom_tex[1].substring(nom_tex[1].length - 1) == 'o') {
                      html_temp = html_temp + vlrtxt_div + '<label class="control-label style="font-size: 12px;font-weight: bold;">' + para_label + '</label>'
                      html_temp = html_temp + '<select class="form-control" value="' + Response["dbgrupos"][x]['vals'][x2][Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3]] + '" style="height: 30px;font-size: 11px;" id="ficha' + x + '_' + x2 + '_' + Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3] + '" onchange="cambio_dir_reget(this, ' + Response["dbgrupos"][x]['vals'][x2]['@pkregistro'] + ',' + Response["dbgrupos"][x]['vals'][x2]['@pkestru'] + ', ' + t_pkpanel + ')" list="ficha' + Response["dbgrupos"][x]['pkgrupo'] + '_' + x2 + '_' + para_label + '">'

                      for (z = 0; z < Object.keys(Response["dbgrupos"][x]['Valor']).length; z++) {
                        t_pkgrupo = Object.keys(Response["dbgrupos"][x]['Valor'])[z] // 36 eti
                        nom_campo = nom_tex[0] // nom campo
                        if (Response["dbgrupos"][x]['Valor'][t_pkgrupo][nom_campo]['tipo'] == '@opcion') {
                          for (z3 = 0; z3 < Response["dbgrupos"][x]['Valor'][t_pkgrupo][nom_campo]['vlas'].length; z3++) {
                            if (Response["dbgrupos"][x]['Valor'][t_pkgrupo][nom_campo]['vlas'][z3]['Valor'] == Response["dbgrupos"][x]['vals'][x2][Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3]]) {
                              html_temp = html_temp + '<option selected>' + Response["dbgrupos"][x]['Valor'][t_pkgrupo][nom_campo]['vlas'][z3]['Valor'] + '</option>'
                            } else {
                              html_temp = html_temp + '<option>' + Response["dbgrupos"][x]['Valor'][t_pkgrupo][nom_campo]['vlas'][z3]['Valor'] + '</option>'

                            }
                          }
                        }
                      }

                      html_temp = html_temp + '</select>'

                    }

                  }
                } else {


                  html_temp = html_temp + vlrtxt_div + '<label class="control-label style="font-size: 12px;font-weight: bold;">' + para_label + '</label>'

                  //html_temp = html_temp + vlrtxt_div + ''
                  html_temp = html_temp + '<input type="text" class="form-control" id="ficha' + x + '_' + x2 + '_' + Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3] + '" value="' + Response["dbgrupos"][x]['vals'][x2][Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3]] + '" readonly="readonly" disabled="" style="height: 25px;font-size: 11px;">'
                }


                html_temp = html_temp + vlrtxt_div_cierre



              } else {

                if (Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3] == '@btn_mod') {
                  html_temp = html_temp + '<div class="" style="padding-right: 0px;padding-left: 20px;">'

                  html_temp = html_temp + '<a class="btn btn-success" onclick="registro(' + Response["dbgrupos"][x]['vals'][x2][Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3]] + ')" style="padding: 2px 2px; margin-right: 0px; margin-left: 5px;"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a></div>'
                }
                if (Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3] == '@btn_con') {
                  html_temp = html_temp + '<div class="" style="padding-right: 0px;padding-left: 20px;">'
                  html_temp = html_temp + '<a class="btn btn-info" onclick="registro(' + Response["dbgrupos"][x]['vals'][x2][Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3]] + ')" style="padding: 2px 2px; margin-right: 0px; margin-left: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></a></div>'
                }
                if (Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3] == '@btn_eli') {
                  html_temp = html_temp + '<div class="" style="padding-right: 0px;padding-left: 20px;">'
                  html_temp = html_temp + '<a class="btn btn-danger" onclick="eliminar(' + Response["dbgrupos"][x]['vals'][x2][Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3]] + ')" style="padding: 2px 2px; margin-right: 0px; margin-left: 0px;"><span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span></a></div>'
                }
                if (Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3] == '@btn_eli_per') {
                  html_temp = html_temp + '<div class="" style="padding-right: 0px;padding-left: 20px;">'
                  html_temp = html_temp + '<a class="btn btn-danger" onclick="pre_eliminar_dir_ficha(ficfil' + Response["dbgrupos"][x]['pkgrupo'] + '_' + x2 + ',' + Response["dbgrupos"][x]['vals'][x2][Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3]] + ')" style="padding: 2px 2px; margin-right: 0px; margin-left: 0px;"><span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span></a></div>'
                }

              }
            }
            html_temp = html_temp + '</div>'
          }



        }

        if (Response["dbgrupos"][x]['tipo'] == 'pastel') {
          html_temp = html_temp + '<canvas id="charts_p_' + Response["dbgrupos"][x]['pkgrupo'] + '" class="chartjs-render-monitor"></canvas>'
        }
        if (Response["dbgrupos"][x]['tipo'] == 'barras') {
          html_temp = html_temp + '<canvas id="charts_p_' + Response["dbgrupos"][x]['pkgrupo'] + '" class="chartjs-render-monitor"></canvas>'
        }
        if (Response["dbgrupos"][x]['tipo'] == 'barras_Continua') {
          html_temp = html_temp + '<canvas id="charts_p_' + Response["dbgrupos"][x]['pkgrupo'] + '" class="chartjs-render-monitor"></canvas>'
        }
        if (Response["dbgrupos"][x]['tipo'] == 'barras_Sumas') {
          html_temp = html_temp + '<canvas id="charts_p_' + Response["dbgrupos"][x]['pkgrupo'] + '" class="chartjs-render-monitor"></canvas>'
        }
        if (Response["dbgrupos"][x]['tipo'] == 'tabla') {

          html_temp = html_temp + '<div id="charts_p_' + Response["dbgrupos"][x]['pkgrupo'] + '"></div>'
        }


        html_temp = html_temp + '</div></div></div></div>'

        html_fcha = html_fcha + html_temp

      }
      document.getElementById('div_modal_ficha_imagen').innerHTML = html_fcha

      for (x = 0; x < Response["dbgrupos"].length; x++) {
        for (x2 = 0; x2 < Response["dbgrupos"][x]['vals'].length; x2++) {
          if (Response["dbgrupos"][x]['tipo'] == 'pastel') {
            temp_valores = []
            temp_backgroundColor = []
            temp_labels = []

            v_x = Response["dbgrupos"][x]['Valor']
            v_y = Response["dbgrupos"][x]['Campo']

            for (z = 0; z < Response["dbgrupos"][x]["vals"].length; z++) {
              temp_valores.push(Response["dbgrupos"][x]["vals"][z][v_x])
              temp_backgroundColor.push('rgb(' + Math.floor(Math.random() * 254) + ',' + Math.floor(Math.random() * 254) + ',' + Math.floor(Math.random() * 254) + ')')
              temp_labels.push(Response["dbgrupos"][x]["vals"][z][v_y])


            }


            data_final = {}
            data_final['datasets'] = [{ 'data': temp_valores, 'backgroundColor': temp_backgroundColor, 'label': Response["dbgrupos"][x]['nombre'] }]
            data_final['labels'] = temp_labels



            var config = {
              type: 'pie',
              data: data_final,
              options: {
                responsive: true, legend: { position: 'none', },
                title: { display: true, text: Response["dbgrupos"][x]['nombre'] },
                animation: { animateScale: true, animateRotate: true }
              }
            };

            //var divcemaforo = document.getElementById('chart_pie');
            //divcemaforo.appendChild(iDiv);

            var canvas_int = document.getElementById('charts_p_' + Response["dbgrupos"][x]['pkgrupo']).getContext('2d');
            window.myLine = new Chart(canvas_int, config);
          }

          if (Response["dbgrupos"][x]['tipo'] == 'barras') {
            data_final = {}
            data_temp = []
            v_x = Response["dbgrupos"][x]['Valor']
            v_y = Response["dbgrupos"][x]['Campo']


            data_final['labels'] = v_x.split(",")
            for (z = 0; z < Response["dbgrupos"][x]["vals"].length; z++) {
              data_linea = {}

              data_linea['label'] = Response["dbgrupos"][x]["vals"][z][v_y]
              data_linea['backgroundColor'] = 'rgb(' + Math.floor(Math.random() * 254) + ',' + Math.floor(Math.random() * 254) + ',' + Math.floor(Math.random() * 254) + ')'
              data_linea['borderColor'] = 'rgb(' + Math.floor(Math.random() * 254) + ',' + Math.floor(Math.random() * 254) + ',' + Math.floor(Math.random() * 254) + ')'
              data_linea['fill'] = false

              data_valor = []
              columas = v_x.split(",")
              for (y3 = 0; y3 < columas.length; y3++) {
                data_valor.push(Response["dbgrupos"][x]["vals"][z][columas[y3]])
              }
              data_linea['data'] = data_valor
              data_temp.push(data_linea)
            }

            data_final['datasets'] = data_temp

            var config = {
              type: 'line',
              data: data_final,
              options: {
                responsive: true, title: { display: false, text: Response["dbgrupos"][x]['nombre'] },
                tooltips: { mode: 'index', intersect: false, },
                hover: { mode: 'nearest', intersect: true },
                scales: {
                  xAxes: [{ display: true, scaleLabel: { display: true, labelString: Response["dbgrupos"][x]['etiquetas'] } }],
                  yAxes: [{ display: true, scaleLabel: { display: true, labelString: v_y } }]
                }
              }
            };

            var canvas_int = document.getElementById('charts_p_' + Response["dbgrupos"][x]['pkgrupo']).getContext('2d');
            window.myLine = new Chart(canvas_int, config);
          }
          if (Response["dbgrupos"][x]['tipo'] == 'barras_Continua') {
            data_final = {}
            data_temp = []
            v_x = Response["dbgrupos"][x]['Valor']
            v_y = Response["dbgrupos"][x]['Campo']


            data_final['labels'] = v_x.split(",")
            for (z = 0; z < Response["dbgrupos"][x]["vals"].length; z++) {
              data_linea = {}

              data_linea['label'] = Response["dbgrupos"][x]["vals"][z][v_y]
              data_linea['backgroundColor'] = 'rgb(' + Math.floor(Math.random() * 254) + ',' + Math.floor(Math.random() * 254) + ',' + Math.floor(Math.random() * 254) + ')'
              data_linea['borderColor'] = 'rgb(' + Math.floor(Math.random() * 254) + ',' + Math.floor(Math.random() * 254) + ',' + Math.floor(Math.random() * 254) + ')'
              data_linea['fill'] = false

              data_valor = []
              columas = v_x.split(",")
              var ultimo = 0
              for (y3 = 0; y3 < columas.length; y3++) {
                if (parseFloat(Response["dbgrupos"][x]["vals"][z][columas[y3]]) == 0.00) {
                  data_valor.push(ultimo)

                } else {
                  data_valor.push(Response["dbgrupos"][x]["vals"][z][columas[y3]])
                  ultimo = Response["dbgrupos"][x]["vals"][z][columas[y3]]
                }

              }
              data_linea['data'] = data_valor
              data_temp.push(data_linea)
            }

            data_final['datasets'] = data_temp

            var config = {
              type: 'line',
              data: data_final,
              options: {
                responsive: true, title: { display: false, text: Response["dbgrupos"][x]['nombre'] },
                tooltips: { mode: 'index', intersect: false, },
                hover: { mode: 'nearest', intersect: true },
                scales: {
                  xAxes: [{ display: true, scaleLabel: { display: true, labelString: Response["dbgrupos"][x]['etiquetas'] } }],
                  yAxes: [{ display: true, scaleLabel: { display: true, labelString: v_y } }]
                }
              }
            };

            var canvas_int = document.getElementById('charts_p_' + Response["dbgrupos"][x]['pkgrupo']).getContext('2d');
            window.myLine = new Chart(canvas_int, config);
          }
          if (Response["dbgrupos"][x]['tipo'] == 'barras_Sumas') {
            data_final = {}
            data_temp = []
            v_x = Response["dbgrupos"][x]['Valor']
            v_y = Response["dbgrupos"][x]['Campo']


            data_final['labels'] = v_x.split(",")
            for (z = 0; z < Response["dbgrupos"][x]["vals"].length; z++) {
              data_linea = {}

              data_linea['label'] = Response["dbgrupos"][x]["vals"][z][v_y]
              data_linea['backgroundColor'] = 'rgb(' + Math.floor(Math.random() * 254) + ',' + Math.floor(Math.random() * 254) + ',' + Math.floor(Math.random() * 254) + ')'
              data_linea['borderColor'] = 'rgb(' + Math.floor(Math.random() * 254) + ',' + Math.floor(Math.random() * 254) + ',' + Math.floor(Math.random() * 254) + ')'
              data_linea['fill'] = false

              data_valor = []
              columas = v_x.split(",")
              var ultimo = 0
              for (y3 = 0; y3 < columas.length; y3++) {

                ultimo = ultimo + parseFloat(Response["dbgrupos"][x]["vals"][z][columas[y3]])

                data_valor.push(ultimo)


              }
              data_linea['data'] = data_valor
              data_temp.push(data_linea)
            }

            data_final['datasets'] = data_temp

            var config = {
              type: 'line',
              data: data_final,
              options: {
                responsive: true, title: { display: false, text: Response["dbgrupos"][x]['nombre'] },
                tooltips: { mode: 'index', intersect: false, },
                hover: { mode: 'nearest', intersect: true },
                scales: {
                  xAxes: [{ display: true, scaleLabel: { display: true, labelString: Response["dbgrupos"][x]['etiquetas'] } }],
                  yAxes: [{ display: true, scaleLabel: { display: true, labelString: v_y } }]
                }
              }
            };

            var canvas_int = document.getElementById('charts_p_' + Response["dbgrupos"][x]['pkgrupo']).getContext('2d');
            window.myLine = new Chart(canvas_int, config);
          }
          if (Response["dbgrupos"][x]['tipo'] == 'tabla') {
            v_x = Response["dbgrupos"][x]['Valor']

            columas = v_x.split(",")



            div_html = '<table class="table table-hover table-striped"><thead style="font-weight: bold;">'

            div_html = div_html + '<tr>'

            for (y3 = 0; y3 < columas.length; y3++) {
              div_html = div_html + '<th>' + columas[y3] + '</th>'

            }

            div_html = div_html + '</tr></thead><tbody>'



            for (z = 0; z < Response["dbgrupos"][x]["vals"].length; z++) {
              div_html = div_html + ' <tr>'
              for (y3 = 0; y3 < columas.length; y3++) {
                div_html = div_html + '<td>' + Response["dbgrupos"][x]["vals"][z][columas[y3]] + '</td>'

              }
              div_html = div_html + ' </tr>'

            }

            div_html = div_html + '</tbody></table>'

            var canvas_int = document.getElementById('charts_p_' + Response["dbgrupos"][x]['pkgrupo'])
            canvas_int.innerHTML = div_html
          }
        }
      }

    }
  });

}



function poner_valor_buscar_referencia_ficha_imagen_txt(t_pkpanel, pkvalor, v_fecha) {


  $.ajax({
    type: 'POST',
    url: '/traer_ficha_imagen',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 't_pkpanel': t_pkpanel, 'pkvalor': pkvalor, 'usuario': web_usuario, 'v_fecha': v_fecha },
    success: function (Response) {
      new_tap = ''

      var c = document.getElementById('mapa_' + Response['t_pkpanel']);
      var ctx = c.getContext("2d");
      var img = document.getElementById('mapa_img_' + Response['t_pkpanel']);
      ctx.canvas.width = img.width
      ctx.canvas.height = img.height
      ctx.drawImage(img, 0, 0);

      for (x = 0; x < Response["listas_valor"].length; x++) {
        ctx.fillStyle = Response["listas_valor"][x]['@color'];
        ctx.beginPath();

        xx = Response["listas_valor"][x]['@X'].split(',')
        yy = Response["listas_valor"][x]['@Y'].split(',')


        ctx.moveTo(xx[0], yy[0]);

        for (z = 1; z < xx.length; z++) {
          ctx.lineTo(xx[z], yy[z]);
        }


        ctx.closePath();
        ctx.fill();

        new_tap = new_tap + '<p>' + Response["listas_valor"][x]['@X'] + ';' + Response["listas_valor"][x]['@Y'] + ';' + Response['t_pkpanel'] + ';' + Response["listas_valor"][x]['@registro'] + '</p>'


        //new_tap = new_tap + '<img src="/media/archivos/'+web_Id_empresa+'/'+Response["listas_valor"][x]['@imagen']+'" class="img-fluid animated" alt="" style="cursor: pointer; margin-left: '+Response["listas_valor"][x]['@X']+'px; margin-top: '+Response["listas_valor"][x]['@Y']+'px; position: absolute;" id="ficha_punto_'+Response['t_pkpanel']+'_'+Response["listas_valor"][x]['@registro']+'" data-toggle="modal" data-target="#modal-default_ficha_imagen" onclick="modal_valor_buscar_referencia_ficha_imagen('+Response['t_pkpanel']+', '+Response["listas_valor"][x]['@registro']+')">'
      }

      var divi = document.getElementById('mapa_' + Response['t_pkpanel']).innerHTML = new_tap


    }
  });

}


function poner_valor_buscar_referencia_ficha_imagen(campo) {

  if (campo.id == undefined) {
    campo = document.getElementById(campo)
  }

  var cc_id = campo.id

  var v_fecha = new Date(document.getElementById(campo.id + '_fecha').value)
  var v_filtro = document.getElementById(campo.id).value
  var cc_panel = campo.id.split('_')
  var t_pkpanel = cc_panel[1]

  $.ajax({
    type: 'POST',
    url: '/traer_ficha_imagen',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 't_pkpanel': t_pkpanel, 'pkvalor': campo.value, 'usuario': web_usuario, 'v_fecha': v_fecha.format("Y-m-d") },
    success: function (Response) {
      new_tap = ''

      var c = document.getElementById('mapa_' + Response['t_pkpanel']);
      var ctx = c.getContext("2d");
      var img = document.getElementById('mapa_img_' + Response['t_pkpanel']);
      ctx.canvas.width = img.width
      ctx.canvas.height = img.height
      ctx.drawImage(img, 0, 0);


      for (x = 0; x < Response["listas_valor"].length; x++) {


        ctx.fillStyle = Response["listas_valor"][x]['@color'];
        ctx.beginPath();
        xx = Response["listas_valor"][x]['@X'].split(',')
        yy = Response["listas_valor"][x]['@Y'].split(',')


        ctx.moveTo(xx[0], yy[0]);

        for (z = 1; z < xx.length; z++) {
          ctx.lineTo(xx[z], yy[z]);
        }


        ctx.closePath();
        ctx.fill();
        new_tap = new_tap + '<p>' + Response["listas_valor"][x]['@X'] + ';' + Response["listas_valor"][x]['@Y'] + ';' + Response['t_pkpanel'] + ';' + Response["listas_valor"][x]['@registro'] + '</p>'


        //new_tap = new_tap + '<img src="/media/archivos/'+web_Id_empresa+'/'+Response["listas_valor"][x]['@imagen']+'" class="img-fluid animated" alt="" style="cursor: pointer; margin-left: '+Response["listas_valor"][x]['@X']+'px; margin-top: '+Response["listas_valor"][x]['@Y']+'px; position: absolute;" id="ficha_punto_'+Response['t_pkpanel']+'_'+Response["listas_valor"][x]['@registro']+'" data-toggle="modal" data-target="#modal-default_ficha_imagen" onclick="modal_valor_buscar_referencia_ficha_imagen('+Response['t_pkpanel']+', '+Response["listas_valor"][x]['@registro']+')">'
      }

      //var divi = document.getElementById('mapa_'+t_pkpanel).innerHTML = new_tap


    }
  });

}



function poner_valor_buscar_referencia_cabecera(campo) {
  var cc_id = campo.id
  var res = cc_id.split("zzz");
  var cc_pesta = res[0].substring(1);
  var cc_nombre = res[1]
  document.getElementById(campo.id).value = document.getElementById("vfinal_bus_2").value

  Response = dict_pestalla['p-' + cc_pesta]

  cc_cambios = [cc_nombre]

  anexos = []
  for (x = 0; x < Response["campos_cab"].length; x++) {
    if (Response["campos_cab"][x]["TablaCampo"] == "cmpreferenciaadjunto") {
      if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["CampoReferencia"] == cc_nombre) {
        cc_cambios.push(Response["campos_cab"][x]["Nombre"])

        if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Tipo"] == "Imagen") {
          ID_TAG = 'p' + cc_pesta + 'zzz' + Response["campos_cab"][x]["Nombre"] + '_img'
          if(offline == false){
            document.getElementById(ID_TAG).src = '/media/archivos/' + web_Id_empresa + '/' + buscador_resultado[(document.getElementById("vfinal_bus").value - 1) + ((pago_buscador - 1) * 10)][Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Sentencia"]]
            //document.getElementById(ID_TAG).value = buscador_resultado[(document.getElementById("vfinal_bus").value - 1) + ((pago_buscador - 1) * 10)][Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Sentencia"]]
            document.getElementById(ID_TAG).attributes['value']['value'] = buscador_resultado[(document.getElementById("vfinal_bus").value - 1) + ((pago_buscador - 1) * 10)][Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Sentencia"]]
          }
          else{
            document.getElementById(ID_TAG).src = '/media/archivos/' + web_Id_empresa + '/' + buscador_resultado[(document.getElementById("vfinal_bus").value - 1) + ((pago_buscador - 1) * 10)][Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Sentencia"]]
            document.getElementById(ID_TAG).attributes['value']['value'] = new_cmpvalor[(document.getElementById("vfinal_bus").value - 1) + ((pago_buscador - 1) * 10)][Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Sentencia"]]
          }

        } else {
          ID_TAG = 'p' + cc_pesta + 'zzz' + Response["campos_cab"][x]["Nombre"]
          if(offline == false){
            document.getElementById(ID_TAG).value = buscador_resultado[(document.getElementById("vfinal_bus").value - 1) + ((pago_buscador - 1) * 10)][Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Sentencia"]]
          }else{
            document.getElementById(ID_TAG).value = new_cmpvalor[(document.getElementById("vfinal_bus").value - 1) + ((pago_buscador - 1) * 10)][Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Sentencia"]]
          }
        }

        for (z2 = 0; z2 < Response["campos_cab"].length; z2++) {
          if (Response["campos_cab"][z2]["TablaCampo"] == "cmpreferencia") {
            if (Response["func_cab"][Response["campos_cab"][z2]["Nombre"]][0][0]["predeterminado_valor"] == Response["campos_cab"][x]["Nombre"]) {
              document.getElementById('p' + cc_pesta + 'zzz' + Response["campos_cab"][z2]["Nombre"]).value = document.getElementById(ID_TAG).value
              anexos.push('p' + cc_pesta + 'zzz' + Response["campos_cab"][z2]["Nombre"])
            }
          }
        }


      }
    }
  }


  if(offline == false){
    if (Response["func_cab"][cc_nombre][2].length > 0) {
      if (Response["func_cab"][cc_nombre][2][0]["Adicionar_registros"] == "Si") {
        A_Select = "Select "
        A_From = "From "
        A_Where = "Where "
        A_Group = "Group by "
        A_GroupWhere = "Group by "
        sentencia = ""
        A_extra = ""
        FaltaDato = false




        for (x = 0; x < Response["func_cab"][cc_nombre][3][0][0].length; x++) {
          A_extra = " " + Response["func_cab"][cc_nombre][3][0][0][x]["Elemento"] + " "
        }
        for (x = 0; x < Response["func_cab"][cc_nombre][3][0][1].length; x++) {
          A_From = A_From + " " + Response["func_cab"][cc_nombre][3][0][1][x]["Tabla"] + " as " + Response["func_cab"][cc_nombre][3][0][1][x]["Nombre"] + ", "
        }
        if (A_From == "From ") { A_From = "" } else { A_From = A_From.slice(0, -2) }
        for (x = 0; x < Response["func_cab"][cc_nombre][3][0][2].length; x++) {
          if (Response["func_cab"][cc_nombre][3][0][2][x]["Tipo"] == "Valor") {
            A_Where = A_Where + " '" + Response["func_cab"][cc_nombre][3][0][2][x]["Elemento"] + "' "
          }
          if (Response["func_cab"][cc_nombre][3][0][2][x]["Tipo"] == "Operacion") {
            A_Where = A_Where + " " + Response["func_cab"][cc_nombre][3][0][2][x]["Elemento"] + " "
          }
          if (Response["func_cab"][cc_nombre][3][0][2][x]["Tipo"] == "Registro") {
            ID_TAG_where = 'p' + cc_pesta + 'zzz' + Response["func_cab"][cc_nombre][3][0][2][x]["Elemento"]
            if (document.getElementById(ID_TAG_where).value == "") { FaltaDato = true }
            A_Where = A_Where + " '" + document.getElementById(ID_TAG_where).value + "' "
          }
          if (Response["func_cab"][cc_nombre][3][0][2][x]["Tipo"] == "Campo") {
            if (Response["func_cab"][cc_nombre][3][0][2][x]["Funcion"] == "") {
              A_Where = A_Where + " " + Response["func_cab"][cc_nombre][3][0][2][x]["Origen"] + "." + Response["func_cab"][cc_nombre][3][0][2][x]["Elemento"] + " "
            }
            if (Response["func_cab"][cc_nombre][3][0][2][x]["Funcion"] == "Suma") {
              A_Where = A_Where + " Sum(" + Response["func_cab"][cc_nombre][3][0][2][x]["Origen"] + "." + Response["func_cab"][cc_nombre][3][0][2][x]["Elemento"] + ") "
              A_GroupWhere = A_GroupWhere + Response["func_cab"][cc_nombre][3][0][2][x]["Grupo"] + ", "
            }
            if (Response["func_cab"][cc_nombre][3][0][2][x]["Funcion"] == "Promedio") {
              A_Where = A_Where + "Avg(" + Response["func_cab"][cc_nombre][3][0][2][x]["Origen"] + "." + Response["func_cab"][cc_nombre][3][0][2][x]["Elemento"] + ") "
              A_GroupWhere = A_GroupWhere + Response["func_cab"][cc_nombre][3][0][2][x]["Grupo"] + ", "
            }
            if (Response["func_cab"][cc_nombre][3][0][2][x]["Funcion"] == "Contar") {
              A_Where = A_Where + "Count(" + Response["func_cab"][cc_nombre][3][0][2][x]["Origen"] + "." + Response["func_cab"][cc_nombre][3][0][2][x]["Elemento"] + ") "
              A_GroupWhere = A_GroupWhere + Response["func_cab"][cc_nombre][3][0][2][x]["Grupo"] + ", "
            }
          }
        }
        for (x = 0; x < Response["func_cab"][cc_nombre][3][0][3].length; x++) {

          A_Select = A_Select + "CAST( "
          for (x2 = 0; x2 < Response["func_cab"][cc_nombre][3][0][4][x].length; x2++) {
            if (Response["func_cab"][cc_nombre][3][0][4][x][x2]["Tipo"] == "Valor") {
              A_Select = A_Select + " '" + Response["func_cab"][cc_nombre][3][0][4][x][x2]["Elemento"] + "' "
            }
            if (Response["func_cab"][cc_nombre][3][0][4][x][x2]["Tipo"] == "Operacion") {
              A_Select = A_Select + " " + Response["func_cab"][cc_nombre][3][0][4][x][x2]["Elemento"] + " "
            }
            if (Response["func_cab"][cc_nombre][3][0][4][x][x2]["Tipo"] == "Registro") {
              ID_TAG_selec = 'p' + cc_pesta + 'zzz' + Response["func_cab"][cc_nombre][3][0][4][x][x2]["Elemento"]
              if (document.getElementById(ID_TAG_selec).value == "") { FaltaDato = true }
              A_Select = A_Select + " '" + document.getElementById(ID_TAG_selec).value + "' "
            }
            if (Response["func_cab"][cc_nombre][3][0][4][x][x2]["Tipo"] == "Campo") {
              if (Response["func_cab"][cc_nombre][3][0][4][x][x2]["Funcion"] == "") {
                A_Select = A_Select + " " + Response["func_cab"][cc_nombre][3][0][4][x][x2]["Origen"] + "." + Response["func_cab"][cc_nombre][3][0][4][x][x2]["Elemento"] + " "
              }
              if (Response["func_cab"][cc_nombre][3][0][4][x][x2]["Funcion"] == "Suma") {
                A_Select = A_Select + " Sum(" + Response["func_cab"][cc_nombre][3][0][4][x][x2]["Origen"] + "." + Response["func_cab"][cc_nombre][3][0][4][x][x2]["Elemento"] + ") "
                if (Response["func_cab"][cc_nombre][3][0][4][x][x2]["GroupBy"] != "") {
                  A_Group = A_Group + Response["func_cab"][cc_nombre][3][0][4][x][x2]["GroupBy"] + ", "
                }
              }
              if (Response["func_cab"][cc_nombre][3][0][4][x][x2]["Funcion"] == "Promedio") {
                A_Select = A_Select + " Avg(" + Response["func_cab"][cc_nombre][3][0][4][x][x2]["Origen"] + "." + Response["func_cab"][cc_nombre][3][0][4][x][x2]["Elemento"] + ") "
                if (Response["func_cab"][cc_nombre][3][0][4][x][x2]["GroupBy"] != "") {
                  A_Group = A_Group + Response["func_cab"][cc_nombre][3][0][4][x][x2]["GroupBy"] + ", "
                }
              }
              if (Response["func_cab"][cc_nombre][3][0][4][x][x2]["Funcion"] == "Contar") {
                A_Select = A_Select + " Count(" + Response["func_cab"][cc_nombre][3][0][4][x][x2]["Origen"] + "." + Response["func_cab"][cc_nombre][3][0][4][x][x2]["Elemento"] + ") "
                if (Response["func_cab"][cc_nombre][3][0][4][x][x2]["GroupBy"] != "") {
                  A_Group = A_Group + Response["func_cab"][cc_nombre][3][0][4][x][x2]["GroupBy"] + ", "
                }
              }
            }
          }
          A_Select = A_Select + " as char) as '" + Response["func_cab"][cc_nombre][3][0][3][x]["Nombre"] + "', "
        }
        A_Select = A_Select.slice(0, -2)
        if (A_Group != "Group by ") {
          A_Group = A_Group.slice(0, -2)
        }

        if (A_Group == "Group by ") {
          if (A_GroupWhere == "Group by ") {
            if (A_Where == "Where ") {
              sentencia = A_Select + " " + A_From
            } else {
              sentencia = A_Select + " " + A_From + " " + A_Where
            }
          } else {
            if (A_Where == "Where ") {
              sentencia = A_Select + " " + A_From + " " + A_GroupWhere
            } else {
              sentencia = A_Select + " " + A_From + " " + A_Where + " " + A_GroupWhere
            }
          }
        } else {
          if (A_GroupWhere == "Group by ") {
            if (A_Where == "Where ") {
              sentencia = A_Select + " " + A_From + " " + A_Group
            } else {
              sentencia = A_Select + " " + A_From + " " + A_Where + " " + A_Group
            }
          } else {
            if (A_Where == "Where ") {
              sentencia = A_Select + " " + A_From + " " + A_Group + ", " + A_GroupWhere.slice(8).ToString
            } else {
              sentencia = A_Select + " " + A_From + " " + A_Where + " " + A_Group + ", " + A_GroupWhere.slice(8).ToString
            }
          }
        }

        sentencia = sentencia + A_extra

        $.ajax({
          type: 'POST',
          url: '/consolidado',
          data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'cmpsenten': sentencia, 'tag1': 'tag1', 'tag2': 'tag2', 'usuario': web_usuario },
          success: function (Response) {
            anexosDet = []
            if (Response["cmpvalor"].length > 0) {

              for (xq = 0; xq < (cc_porPesta["p-" + cc_pesta] + 2); xq++) {
                menos_sin_cal(cc_pesta, xq, 1)
              }
              linea_inicial = cc_porPesta["p-" + cc_pesta]

              for (xq = Response["cmpvalor"].length - 1; xq > -1; xq--) {
                anexosDet = []
                //for (xq = 0; xq < Response["cmpvalor"].length; xq++) {

                mas(cc_pesta)

                ///////////////////////////////
                for (xq2 = 0; xq2 < dict_pestalla['p-' + cc_pesta]['campos_det'].length; xq2++) {
                  nombCampo= dict_pestalla['p-' + cc_pesta]['campos_det'][xq2]['Nombre']
                  if(nombCampo in Response['cmpvalor'][xq]){
                    id_tag_det = 'pd' + cc_pesta + 'fff' + cc_porPesta["p-" + cc_pesta] + 'ccc' + nombCampo

                    if(dict_pestalla['p-' + cc_pesta]['campos_det'][xq2]['TablaCampo'] == "cmpreferenciaadjunto"){
                      if (dict_pestalla['p-' + cc_pesta]["func_det"][nombCampo][0]["Tipo"] == "Imagen") {

                        inerhtml = '<img style="width: 100%;height: 60%;margin-left: auto;margin-right: auto; display: block;" id="' + id_tag_det + '_img" src="/media/archivos/' + web_Id_empresa + '/' + Response['cmpvalor'][xq][nombCampo] + '" alt="image" value="0">' + Response['cmpvalor'][xq][nombCampo]

                        document.getElementById(id_tag_det + "_label").innerHTML = inerhtml
                        document.getElementById(id_tag_det + "_label").href = '/media/archivos/' + web_Id_empresa + '/' + Response['cmpvalor'][xq][nombCampo]

                        document.getElementById(id_tag_det + "_img").src = '/media/archivos/' + web_Id_empresa + '/' + Response['cmpvalor'][xq][nombCampo]

                      } else {
                        document.getElementById(id_tag_det).value = Response['cmpvalor'][xq][nombCampo]
                      }

                    }else{
                      document.getElementById(id_tag_det).value = Response['cmpvalor'][xq][nombCampo]

                      if(dict_pestalla['p-' + cc_pesta]['campos_det'][xq2]['TablaCampo'] == "cmpreferencia"){
                        if(dict_pestalla['p-' + cc_pesta]['func_det'][dict_pestalla['p-' + cc_pesta]['campos_det'][xq2]['Nombre']][0][0]['A_acc_automatic'] == 'Si')
                        {
                          anexosDet.push(id_tag_det)
                        }
                      }

                    }

                    


                  }
                  
                  

                }
                for (zt = 0; zt < anexosDet.length; zt++) {
                  buscar_referencia_detalle_enter(document.getElementById(anexosDet[zt]))
                }
                ////////////////////////////////


              }
              calcular_0_v2(cc_pesta, [])

              for (xq = linea_inicial; xq < (cc_porPesta["p-" + cc_pesta]); xq++) {
                calcular_detalle(cc_pesta, xq + 1)
              }
              calcular_0_v2(cc_pesta, [])

            }


          }
        });
      }
    }
    


    for (zt = 0; zt < anexos.length; zt++) {
      buscar_referencia_cabecera_enter(document.getElementById(anexos[zt]))
    }
  }
  //calcular_0(pestalla)
  calcular_0_v2(pestalla, cc_cambios)
  
}

function poner_valor_buscar_referencia_reporte(campo) {
  var cc_id = campo.id
  var res = cc_id.split("zz");
  var cc_pesta = res[1];
  var cc_nombre = res[3]
  document.getElementById(campo.id).value = document.getElementById("vfinal_bus_2").value + "%"

  //id="rpzz'+ pestalla +'zz'+ x +'zz'+Response['referencias_reprotes'][x]["id"] +'" 
  //Response = dict_pestalla['p-'+cc_pesta]
}

function doble_click_buscador_rep(campo, x) {
  selecctt_buscador(x)
  var btn = document.getElementById("c_modal_ref_rep")
  btn.click()
}

function doble_click_buscador_cad(campo, x) {
  selecctt_buscador(x)
  var btn = document.getElementById("c_modal_ref_cab")
  btn.click()
}

function doble_click_buscador_ficha(campo, x) {
  selecctt_buscadorFicha(x)
  var btn = document.getElementById("c_modal_ref_ficha")
  btn.click()
}


function doble_click_buscador_ficha_ref(campo, x, nomcampo, pkpanel) {
  selecctt_buscadorFicha_ref(campo, x, nomcampo, pkpanel)
  var btn = document.getElementById("c_modal_ref_ficha_ref")
  btn.click()
}

function doble_click_buscador_det(campo, x) {
  selecctt_buscador(x)
  var btn = document.getElementById("c_modal_ref_det")
  btn.click()
}

function doble_click_buscador_subdet(campo, x) {
  selecctt_buscador(x)
  var btn = document.getElementById("c_modal_ref_det")
  btn.click()
}


function filtrar_buscar_rep(id_campo_busc, pkcampo) {

  //sentencia2 = "select * from (" + document.getElementById("buscador_senten").value + ") int_ress where "  + document.getElementById("busca_campo").value + " like '" + document.getElementById("busca_valor").value + "%'"

  cmpsenten = document.getElementById("buscador_senten").value
  valor_filtro = document.getElementById("busca_valor").value

  $.ajax({
    type: 'POST',
    url: '/buscador_filt_rep',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'cmpsenten': cmpsenten, 'usuario': web_usuario, 'pkcampo': pkcampo, 'valor_filtro': valor_filtro, 'id_campo_busc': id_campo_busc.id, },
    success: function (Response) {

      var campo = document.getElementById(Response['id_campo_busc'][0])
      pag_limit = 1
      pago_buscador = 1
      Response_bus = Response

      buscador_resultado = Response['cmpvalor']
      pag_limit = 1
      if ((Response['cmpvalor'].length / 10) % 1 != 0) {
        pag_limit = parseInt(Response['cmpvalor'].length / 10) + 1
      } else {
        pag_limit = parseInt(Response['cmpvalor'].length / 10)
      }
      data_int = '<div class="panel-body" style="overflow: scroll;"><table style="cursor: pointer;font-size: 11px;background: white;" width="100%" class="table table-striped table-bordered table-hover" id="dataTables-example"><thead><tr>'
      data_int = data_int + '<th style="display: none;">' + Response['nombre'] + '</th>'

      for (x = 0; x < Object.keys(Response['cmpvalor'][0]).length; x++) {
        data_int = data_int + '<th>' + Object.keys(Response['cmpvalor'][0])[x] + '</th>'

      }
      data_int = data_int + '</tr></thead><tbody>'
      if (Response['cmpvalor'].length > (pago_buscador * 10)) {
        bus_limite = pago_buscador * 10
      } else {
        bus_limite = Response['cmpvalor'].length
      }

      //for (x = (0); x < Response['cmpvalor'].length; x++) {              
      for (x = (0 + ((pago_buscador - 1) * 10)); x < bus_limite; x++) {
        data_int = data_int + '<tr onclick="doble_click_buscador_rep(' + campo + ', this)">'
        data_int = data_int + '<td style="display: none;">' + Response['cmpvalor'][x][Response['nombre']] + '</td>'

        for (x2 = 0; x2 < Object.keys(Response['cmpvalor'][x]).length; x2++) {
          data_int = data_int + '<td>' + Response['cmpvalor'][x][Object.keys(Response['cmpvalor'][x])[x2]] + '</td>'
        }
        data_int = data_int + '</tr>'
      }
      data_int = data_int + '</tbody></table></div>'
      $('#buscador_int').html(data_int);
      $('#buscador_int_pag').html('<button type="button" class="btn btn-info" onclick="buscar_referencia_reporte_cambio_pag(-1, Response_bus, ' + Response['id_campo_busc'] + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-left"></i></button> ' + pago_buscador + ' - ' + pag_limit + '  <button type="button" class="btn btn-info" onclick="buscar_referencia_reporte_cambio_pag(1, Response_bus, ' + Response['id_campo_busc'] + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-right"></i></button>');

      $('#buscador_int_pag2').html('<button type="button" class="btn btn-info" onclick="buscar_referencia_reporte_cambio_pag(-1, Response_bus, ' + Response['id_campo_busc'] + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-left"></i></button> ' + pago_buscador + ' - ' + pag_limit + '  <button type="button" class="btn btn-info" onclick="buscar_referencia_reporte_cambio_pag(1, Response_bus, ' + Response['id_campo_busc'] + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-right"></i></button>');
    }
  });
}

function filtrar_buscar(id_campo_busc, pkcampo) {

  //sentencia2 = "select * from (" + document.getElementById("buscador_senten").value + ") int_ress where "  + document.getElementById("busca_campo").value + " like '" + document.getElementById("busca_valor").value + "%'"

  cmpsenten = document.getElementById("buscador_senten").value
  valor_filtro = document.getElementById("busca_valor").value
  max = 99
  //max = document.getElementById('busca_max').value

  $.ajax({
    type: 'POST',
    url: '/buscador_filtro',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'cmpsenten': cmpsenten, 'usuario': web_usuario, 'pkcampo': pkcampo, 'valor_filtro': valor_filtro, 'id_campo_busc': id_campo_busc.id, 'max': max },
    success: function (Response) {
      pag_limit = 1
      pago_buscador = 1
      var campo = document.getElementById(Response['id_campo_busc'][0])
      Response_bus = Response
      buscador_resultado = Response['cmpvalor']
      orden = Response["A_Select"].split(",")
      pag_limit = 1
      if ((Response['cmpvalor'].length / 10) % 1 != 0) {
        pag_limit = parseInt(Response['cmpvalor'].length / 10) + 1
      } else {
        pag_limit = parseInt(Response['cmpvalor'].length / 10)
      }
      data_int = '<div class="panel-body" style="overflow: scroll;"><table style="cursor: pointer;font-size: 11px;background: white;" width="100%" class="table table-striped table-bordered table-hover" id="dataTables-example"><thead><tr>'
      data_int = data_int + '<th style="display: none;">' + Response['nombre'] + '</th>'
      visibles = Response['datos_PkCampo'][0]['visibles'].split(',')
      //largos = Response['datos_PkCampo'][0]['largos'].split(',')

      for (x = 0; x < orden.length; x++) {
        if (visibles[x] == 'S') {
          data_int = data_int + '<th>' + orden[x] + '</th>'
        } else {
          data_int = data_int + '<th style="display: none;">' + orden[x] + '</th>'
        }
      }

      if (Response['cmpvalor'].length > (pago_buscador * 10)) {
        bus_limite = pago_buscador * 10
      } else {
        bus_limite = Response['cmpvalor'].length
      }

      data_int = data_int + '</tr></thead><tbody>'

      for (x = (0 + ((pago_buscador - 1) * 10)); x < bus_limite; x++) {
        //for (x = 0; x < Response['cmpvalor'].length; x++) {
        data_int = data_int + '<tr onclick="doble_click_buscador_cad(' + campo + ', this)">'
        data_int = data_int + '<td style="display: none;">' + Response['cmpvalor'][x][Response['nombre']] + '</td>'

        for (x2 = 0; x2 < orden.length; x2++) {
          if (visibles[x2] == 'S') {
            data_int = data_int + '<td>' + Response['cmpvalor'][x][orden[x2]] + '</td>'
          } else {
            data_int = data_int + '<td style="display: none;">' + Response['cmpvalor'][x][orden[x2]] + '</td>'

          }
        }
        data_int = data_int + '</tr>'
      }
      data_int = data_int + '</tbody></table></div>'
      $('#buscador_int').html(data_int);
      $('#buscador_int_pag').html('<button type="button" class="btn btn-info" onclick="buscar_referencia_cabecera_cambio_pag(-1, Response_bus, ' + Response['id_campo_busc'] + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-left"></i></button> ' + pago_buscador + ' - ' + pag_limit + '  <button type="button" class="btn btn-info" onclick="buscar_referencia_cabecera_cambio_pag(1, Response_bus, ' + Response['id_campo_busc'] + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-right"></i></button>');
      $('#buscador_int_pag2').html('<button type="button" class="btn btn-info" onclick="buscar_referencia_cabecera_cambio_pag(-1, Response_bus, ' + Response['id_campo_busc'] + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-left"></i></button> ' + pago_buscador + ' - ' + pag_limit + '  <button type="button" class="btn btn-info" onclick="buscar_referencia_cabecera_cambio_pag(1, Response_bus, ' + Response['id_campo_busc'] + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-right"></i></button>');

    }
  });
}


function filtrar_buscar_subdet(id_campo_busc, pkcampo) {

  //sentencia2 = "select * from (" + document.getElementById("buscador_senten").value + ") int_ress where "  + document.getElementById("busca_campo").value + " like '" + document.getElementById("busca_valor").value + "%'"
  pago_buscador = 1
  cmpsenten = document.getElementById("buscador_senten").value
  valor_filtro = document.getElementById("busca_valor").value
  max = 99
  //max = document.getElementById("busca_max").value
  $.ajax({
    type: 'POST',
    url: '/buscador_filtro',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'cmpsenten': cmpsenten, 'usuario': web_usuario, 'pkcampo': pkcampo, 'valor_filtro': valor_filtro, 'id_campo_busc': id_campo_busc.id, 'max': max },
    success: function (Response) {
      pag_limit = 1
      pago_buscador = 1
      var campo = document.getElementById(Response['id_campo_busc'][0])
      Response_bus = Response
      buscador_resultado = Response['cmpvalor']
      orden = Response["A_Select"].split(",")
      data_int = '<div class="panel-body" style="overflow: scroll;"><table style="cursor: pointer;font-size: 11px;background: white;" width="100%" class="table table-striped table-bordered table-hover" id="dataTables-example"><thead><tr>'
      visibles = Response['datos_PkCampo'][0]['visibles'].split(',')
      //largos = Response['datos_PkCampo'][0]['largos'].split(',')
      pag_limit = 1
      if ((Response['cmpvalor'].length / 10) % 1 != 0) {
        pag_limit = parseInt(Response['cmpvalor'].length / 10) + 1
      } else {
        pag_limit = parseInt(Response['cmpvalor'].length / 10)
      }

      if (Response['cmpvalor'].length > (pago_buscador * 10)) {
        bus_limite = pago_buscador * 10
      } else {
        bus_limite = Response['cmpvalor'].length
      }

      data_int = data_int + '<th style="display: none;">' + Response['nombre'] + '</th>'
      for (x = 0; x < orden.length; x++) {
        if (visibles[x] == 'S') {
          data_int = data_int + '<th>' + orden[x] + '</th>'
        } else {
          data_int = data_int + '<th style="display: none;">' + orden[x] + '</th>'
        }

      }

      data_int = data_int + '</tr></thead><tbody>'
      for (x = (0 + ((pago_buscador - 1) * 10)); x < bus_limite; x++) {
        //for (x = 0; x < Response['cmpvalor'].length; x++) {
        data_int = data_int + '<tr  onclick="doble_click_buscador_det(' + campo + ', this)">'
        data_int = data_int + '<td style="display: none;">' + Response['cmpvalor'][x][Response['nombre']] + '</td>'

        for (x2 = 0; x2 < orden.length; x2++) {

          if (visibles[x2] == 'S') {
            data_int = data_int + '<td>'
          } else {
            data_int = data_int + '<td style="display: none;">'
          }
          if (orden[x2] == 'imagen') {
            data_int = data_int + '<div class="thumbnail" style="height: 100px;margin-bottom: 1px;"><div class="image view view-first"><img style="width: 80%;height: 80px;margin-left: auto;margin-right: auto; display: block;" src="/media/archivos/' + web_Id_empresa + '/' + Response['cmpvalor'][x][orden[x2]] + '" alt="image"><a href="/media/archivos/' + web_Id_empresa + '/' + Response['cmpvalor'][x][orden[x2]] + '" target="_blank">' + Response['cmpvalor'][x][orden[x2]] + '</a></div></div></td>'
          } else {
            data_int = data_int + '' + Response['cmpvalor'][x][orden[x2]] + '</td>'
          }
        }
        data_int = data_int + '</tr>'
      }
      data_int = data_int + '</tbody></table></div>'
      $('#buscador_int').html(data_int);
      $('#buscador_int_pag').html('<button type="button" class="btn btn-info" onclick="buscar_referencia_subdetalle_cambio_pag(-1, Response_bus, ' + Response['id_campo_busc'] + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-left"></i></button> ' + pago_buscador + ' - ' + pag_limit + '  <button type="button" class="btn btn-info" onclick="buscar_referencia_subdetalle_cambio_pag(1, Response_bus, ' + Response['id_campo_busc'] + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-right"></i></button>');
      $('#buscador_int_pag2').html('<button type="button" class="btn btn-info" onclick="buscar_referencia_subdetalle_cambio_pag(-1, Response_bus, ' + Response['id_campo_busc'] + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-left"></i></button> ' + pago_buscador + ' - ' + pag_limit + '  <button type="button" class="btn btn-info" onclick="buscar_referencia_subdetalle_cambio_pag(1, Response_bus, ' + Response['id_campo_busc'] + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-right"></i></button>');
    }
  });
}

function filtrar_buscar_det(id_campo_busc, pkcampo) {

  //sentencia2 = "select * from (" + document.getElementById("buscador_senten").value + ") int_ress where "  + document.getElementById("busca_campo").value + " like '" + document.getElementById("busca_valor").value + "%'"
  pago_buscador = 1
  cmpsenten = document.getElementById("buscador_senten").value
  valor_filtro = document.getElementById("busca_valor").value
  max = 99
  //max = document.getElementById("busca_max").value
  if(offline == false){
    $.ajax({
      type: 'POST',
      url: '/buscador_filtro',
      data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'cmpsenten': cmpsenten, 'usuario': web_usuario, 'pkcampo': pkcampo, 'valor_filtro': valor_filtro, 'id_campo_busc': id_campo_busc.id, 'max': max },
      success: function (Response) {
        pag_limit = 1
        pago_buscador = 1
        var campo = document.getElementById(Response['id_campo_busc'][0])
        Response_bus = Response
        buscador_resultado = Response['cmpvalor']
        orden = Response["A_Select"].split(",")
        data_int = '<div class="panel-body" style="overflow: scroll;"><table style="cursor: pointer;font-size: 11px;background: white;" width="100%" class="table table-striped table-bordered table-hover" id="dataTables-example"><thead><tr>'
        visibles = Response['datos_PkCampo'][0]['visibles'].split(',')
        //largos = Response['datos_PkCampo'][0]['largos'].split(',')
        pag_limit = 1
        if ((Response['cmpvalor'].length / 10) % 1 != 0) {
          pag_limit = parseInt(Response['cmpvalor'].length / 10) + 1
        } else {
          pag_limit = parseInt(Response['cmpvalor'].length / 10)
        }
  
        if (Response['cmpvalor'].length > (pago_buscador * 10)) {
          bus_limite = pago_buscador * 10
        } else {
          bus_limite = Response['cmpvalor'].length
        }
  
        data_int = data_int + '<th style="display: none;">' + Response['nombre'] + '</th>'
        for (x = 0; x < orden.length; x++) {
          if (visibles[x] == 'S') {
            data_int = data_int + '<th>' + orden[x] + '</th>'
          } else {
            data_int = data_int + '<th style="display: none;">' + orden[x] + '</th>'
          }
  
        }
  
        data_int = data_int + '</tr></thead><tbody>'
        for (x = (0 + ((pago_buscador - 1) * 10)); x < bus_limite; x++) {
          //for (x = 0; x < Response['cmpvalor'].length; x++) {
          data_int = data_int + '<tr  onclick="doble_click_buscador_det(' + campo + ', this)">'
          data_int = data_int + '<td style="display: none;">' + Response['cmpvalor'][x][Response['nombre']] + '</td>'
  
          for (x2 = 0; x2 < orden.length; x2++) {
  
            if (visibles[x2] == 'S') {
              data_int = data_int + '<td>'
            } else {
              data_int = data_int + '<td style="display: none;">'
            }
            if (orden[x2] == 'imagen') {
              data_int = data_int + '<div class="thumbnail" style="height: 100px;margin-bottom: 1px;"><div class="image view view-first"><img style="width: 80%;height: 80px;margin-left: auto;margin-right: auto; display: block;" src="/media/archivos/' + web_Id_empresa + '/' + Response['cmpvalor'][x][orden[x2]] + '" alt="image"><a href="/media/archivos/' + web_Id_empresa + '/' + Response['cmpvalor'][x][orden[x2]] + '" target="_blank">' + Response['cmpvalor'][x][orden[x2]] + '</a></div></div></td>'
            } else {
              data_int = data_int + '' + Response['cmpvalor'][x][orden[x2]] + '</td>'
            }
          }
          data_int = data_int + '</tr>'
        }
        data_int = data_int + '</tbody></table></div>'
        $('#buscador_int').html(data_int);
        $('#buscador_int_pag').html('<button type="button" class="btn btn-info" onclick="buscar_referencia_detalle_cambio_pag(-1, Response_bus, ' + Response['id_campo_busc'] + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-left"></i></button> ' + pago_buscador + ' - ' + pag_limit + '  <button type="button" class="btn btn-info" onclick="buscar_referencia_detalle_cambio_pag(1, Response_bus, ' + Response['id_campo_busc'] + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-right"></i></button>');
        $('#buscador_int_pag2').html('<button type="button" class="btn btn-info" onclick="buscar_referencia_detalle_cambio_pag(-1, Response_bus, ' + Response['id_campo_busc'] + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-left"></i></button> ' + pago_buscador + ' - ' + pag_limit + '  <button type="button" class="btn btn-info" onclick="buscar_referencia_detalle_cambio_pag(1, Response_bus, ' + Response['id_campo_busc'] + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-right"></i></button>');
      }
    });
  }
  if(offline == true){

      pag_limit = 1
      pago_buscador = 1
      cc_nombre = id_campo_busc.id.split('ccc')[1]
      var campo = document.getElementById(id_campo_busc.id)
      Response_bus = bases_pregargadas[cc_nombre]
      Response = bases_pregargadas[cc_nombre]
      new_cmpvalor = []
      var valorr = document.getElementById('busca_valor').value.toLowerCase()
      orden = Response["A_Select"].split(",")
      var valorrsplit = valorr.split(',')

      for (x = 0; x < Response['cmpvalor'].length; x++) {
        datentro = false
        for (x2 = 0; x2 < orden.length; x2++) {
          if(Response['cmpvalor'][x][orden[x2]] != null){
            mix = 0
            for (x3 = 0; x3 < valorrsplit.length; x3++) {

              if(Response['cmpvalor'][x][orden[x2]].toString().toLowerCase().search(valorrsplit[x3].trim()) >= 0){
                mix = mix + 1
              }
            }
            if(mix == valorrsplit.length){
              datentro = true
              break
            }
            
          }
        }  
        if(datentro == true){
          new_cmpvalor.push(Response['cmpvalor'][x])
        }
      }

      buscador_resultado = new_cmpvalor
      data_int = '<div class="panel-body" style="overflow: scroll;"><table style="cursor: pointer;font-size: 11px;background: white;" width="100%" class="table table-striped table-bordered table-hover" id="dataTables-example"><thead><tr>'
      visibles = Response['visibles'].split(',')
      //largos = Response['datos_PkCampo'][0]['largos'].split(',')
      pag_limit = 1
      if ((new_cmpvalor.length / 10) % 1 != 0) {
        pag_limit = parseInt(new_cmpvalor.length / 10) + 1
      } else {
        pag_limit = parseInt(new_cmpvalor.length / 10)
      }

      if (new_cmpvalor.length > (pago_buscador * 10)) {
        bus_limite = pago_buscador * 10
      } else {
        bus_limite = new_cmpvalor.length
      }

      data_int = data_int + '<th style="display: none;">' + Response['Sentencia'] + '</th>'
      for (x = 0; x < orden.length; x++) {
        if (visibles[x] == 'S') {
          data_int = data_int + '<th>' + orden[x] + '</th>'
        } else {
          data_int = data_int + '<th style="display: none;">' + orden[x] + '</th>'
        }

      }

      data_int = data_int + '</tr></thead><tbody>'
      for (x = (0 + ((pago_buscador - 1) * 10)); x < bus_limite; x++) {
        //for (x = 0; x < Response['cmpvalor'].length; x++) {
        data_int = data_int + '<tr  onclick="doble_click_buscador_det(' + campo.id + ', this)">'
        data_int = data_int + '<td style="display: none;">' + new_cmpvalor[x][Response['Sentencia']] + '</td>'

        for (x2 = 0; x2 < orden.length; x2++) {

          if (visibles[x2] == 'S') {
            data_int = data_int + '<td>'
          } else {
            data_int = data_int + '<td style="display: none;">'
          }
          if (orden[x2] == 'imagen') {
            data_int = data_int + '<div class="thumbnail" style="height: 100px;margin-bottom: 1px;"><div class="image view view-first"><img style="width: 80%;height: 80px;margin-left: auto;margin-right: auto; display: block;" src="/media/archivos/' + web_Id_empresa + '/' + new_cmpvalor[x][orden[x2]] + '" alt="image"><a href="/media/archivos/' + web_Id_empresa + '/' + new_cmpvalor[x][orden[x2]] + '" target="_blank">' + new_cmpvalor[x][orden[x2]] + '</a></div></div></td>'
          } else {
            data_int = data_int + '' + new_cmpvalor[x][orden[x2]] + '</td>'
          }
        }
        data_int = data_int + '</tr>'
      }
      data_int = data_int + '</tbody></table></div>'
      $('#buscador_int').html(data_int);
      $('#buscador_int_pag').html('<button type="button" class="btn btn-info" onclick="buscar_referencia_detalle_cambio_pag(-1, Response_bus, ' + id_campo_busc.id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-left"></i></button> ' + pago_buscador + ' - ' + pag_limit + '  <button type="button" class="btn btn-info" onclick="buscar_referencia_detalle_cambio_pag(1, Response_bus, ' + id_campo_busc.id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-right"></i></button>');
      $('#buscador_int_pag2').html('<button type="button" class="btn btn-info" onclick="buscar_referencia_detalle_cambio_pag(-1, Response_bus, ' + id_campo_busc.id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-left"></i></button> ' + pago_buscador + ' - ' + pag_limit + '  <button type="button" class="btn btn-info" onclick="buscar_referencia_detalle_cambio_pag(1, Response_bus, ' + id_campo_busc.id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-right"></i></button>');
    
  }

}

var buscador_resultado = []

var buscador_resultado_ficha = []
var buscador_resultado_ficha_ref = []

function buscar_referencia_reporte(campo) {

  busc_campo = campo
  var cc_id = campo.id
  var res = cc_id.split("zz");
  var cc_pesta = res[1]
  var cc_indi = res[2]
  var cc_id_ref = res[3]
  pag_limit = 1
  pago_buscador = 1
  Response = dict_pestalla['p-' + cc_pesta]


  where = " "
  columnas = Response["referencias_reprotes"][cc_indi]["columnas"]
  campo = Response["referencias_reprotes"][cc_indi]["campo"]
  dato = document.getElementById(cc_id).value
  tabla = Response["referencias_reprotes"][cc_indi]["tabla"]
  orderby = " order by " + Response["referencias_reprotes"][cc_indi]["campo"] + "  "

  PkCampo = Response["referencias_reprotes"][cc_indi]["id"]

  cmpsenten = "select " + columnas + ' from ' + tabla + ' '

  $.ajax({
    type: 'POST',
    url: '/buscador',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'cmpsenten': cmpsenten, 'usuario': web_usuario, 'PkCampo': PkCampo, 'A_Select': columnas },
    beforeSend: function () {

      $('#intbuscador').html('Buscando información...');
    },
    success: function (Response) {

      buscador_resul = Response
      orden = Response["A_Select"].split(",")
      buscador_resultado = Response['cmpvalor']
      data_int = '<div class="row"><div class="col-lg-12">'
      document.getElementById("buscador_senten").value = cmpsenten

      data_int = data_int + '<input class="form-control" id="busca_valor" placeholder="Escriba para filtrar" onkeypress="return runScript_buscador_rep(event, ' + cc_id + ', ' + Response['PkCampo'] + ')"></div></div>'

      pag_limit = 1
      if ((Response['cmpvalor'].length / 10) % 1 != 0) {
        pag_limit = parseInt(Response['cmpvalor'].length / 10) + 1
      } else {
        pag_limit = parseInt(Response['cmpvalor'].length / 10)
      }


      data_int = data_int + '<div class="modal-footer"><button type="button" class="btn bg-blue btn-flat margin" data-dismiss="modal" onclick="poner_valor_buscar_referencia_reporte(' + cc_id + ')" id="c_modal_ref_rep" style="display: none;"></button></div>'

      data_int = data_int + '<p id="buscador_int_pag"> <button type="button" class="btn btn-info" onclick="buscar_referencia_reporte_cambio_pag(-1, buscador_resul,' + busc_campo.id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-left"></i></button> ' + pago_buscador + ' - ' + pag_limit + '  <button type="button" class="btn btn-info" onclick="buscar_referencia_reporte_cambio_pag(1, buscador_resul,' + busc_campo.id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-right"></i></button> </p> </div></div>'


      data_int = data_int + '<div id="buscador_int" style="overflow: scroll;">'

      data_int = data_int + '<div class="panel-body" ><table style="cursor: pointer;font-size: 11px;background: white;" width="100%" class="table table-striped table-bordered table-hover" id="dataTables-example"><thead><tr>'
      data_int = data_int + '<th style="display: none;">' + campo + '</th>'


      for (x = 0; x < orden.length; x++) {
        data_int = data_int + '<th>' + orden[x] + '</th>'
      }

      data_int = data_int + '</tr></thead><tbody>'



      if (Response['cmpvalor'].length > (pago_buscador * 10)) {
        bus_limite = pago_buscador * 10
      } else {
        bus_limite = Response['cmpvalor'].length
      }

      //for (x = (0); x < Response['cmpvalor'].length; x++) {              
      for (x = (0 + ((pago_buscador - 1) * 10)); x < bus_limite; x++) {
        data_int = data_int + '<tr onclick="doble_click_buscador_rep(' + cc_id + ', this)">'
        data_int = data_int + '<td style="display: none;">' + Response['cmpvalor'][x][campo] + '</td>'

        for (x2 = 0; x2 < orden.length; x2++) {
          data_int = data_int + '<td>' + Response['cmpvalor'][x][orden[x2]] + '</td>'
        }
        data_int = data_int + '</tr>'
      }

      data_int = data_int + '</tbody></table></div>'

      data_int = data_int + '</div>'

      data_int = data_int + '<div class="modal-footer">'
      data_int = data_int + '<p id="buscador_int_pag2"> <button type="button" class="btn btn-info" onclick="buscar_referencia_reporte_cambio_pag(-1, buscador_resul,' + busc_campo.id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-left"></i></button> ' + pago_buscador + ' - ' + pag_limit + '  <button type="button" class="btn btn-info" onclick="buscar_referencia_reporte_cambio_pag(1, buscador_resul,' + busc_campo.id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-right"></i></button> </p>'


      data_int = data_int + '</div>'




      $('#intbuscador').html(data_int);
    }
  });


}
function buscar_referencia_reporte_cambio_pag(flujo, Response, campo) {


  busc_campo = campo
  var cc_id = campo.id
  var res = cc_id.split("zz");
  var cc_pesta = res[1]
  var cc_indi = res[2]
  var cc_id_ref = res[3]
  //Response = dict_pestalla['p-'+cc_pesta]



  if (flujo == -1) {
    if (pago_buscador > 1) { pago_buscador = pago_buscador - 1 }

  } else {
    if (pago_buscador < pag_limit) { pago_buscador = pago_buscador + 1 }

  }




  //orden = Response["A_Select"].split(",")
  orden = dict_pestalla['p-' + cc_pesta]["referencias_reprotes"][cc_indi]["columnas"].split(",")


  buscador_resul = Response
  //'</select>'
  if ((Response['cmpvalor'].length / 10) % 1 != 0) {
    pag_limit = parseInt(Response['cmpvalor'].length / 10) + 1
  } else {
    pag_limit = parseInt(Response['cmpvalor'].length / 10)
  }





  data_int = ''
  data_int = data_int + '<div class="panel-body"><table style="cursor: pointer;font-size: 11px;background: white;" width="100%" class="table table-striped table-bordered table-hover" id="dataTables-example"><thead><tr>'
  data_int = data_int + '<th style="display: none;">' + dict_pestalla['p-' + cc_pesta]["referencias_reprotes"][cc_indi]["campo"] + '</th>'
  //visibles = Response['datos_PkCampo'][0]['visibles'].split(',')
  //largos = Response['datos_PkCampo'][0]['largos'].split(',')
  for (x = 0; x < orden.length; x++) {
    data_int = data_int + '<th>' + orden[x] + '</th>'
  }

  data_int = data_int + '</tr></thead><tbody>'



  if (Response['cmpvalor'].length > (pago_buscador * 10)) {
    bus_limite = pago_buscador * 10
  } else {
    bus_limite = Response['cmpvalor'].length
  }

  //for (x = (0); x < Response['cmpvalor'].length; x++) {              
  for (x = (0 + ((pago_buscador - 1) * 10)); x < bus_limite; x++) {
    data_int = data_int + '<tr onclick="doble_click_buscador_rep(' + cc_id + ', this)">'
    data_int = data_int + '<td style="display: none;">' + Response['cmpvalor'][x][dict_pestalla['p-' + cc_pesta]["referencias_reprotes"][cc_indi]["campo"]] + '</td>'

    for (x2 = 0; x2 < orden.length; x2++) {
      data_int = data_int + '<td>' + Response['cmpvalor'][x][orden[x2].trim()] + '</td>'
    }
    data_int = data_int + '</tr>'
  }


  data_int = data_int + '</tbody></table></div>'





  $('#buscador_int').html(data_int);
  $('#buscador_int_pag').html('<button type="button" class="btn btn-info" onclick="buscar_referencia_reporte_cambio_pag(-1, buscador_resul, ' + campo.id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-left"></i></button> ' + pago_buscador + ' - ' + pag_limit + '  <button type="button" class="btn btn-info" onclick="buscar_referencia_reporte_cambio_pag(1, buscador_resul, ' + campo.id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-right"></i></button>');
  $('#buscador_int_pag2').html('<button type="button" class="btn btn-info" onclick="buscar_referencia_reporte_cambio_pag(-1, buscador_resul, ' + campo.id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-left"></i></button> ' + pago_buscador + ' - ' + pag_limit + '  <button type="button" class="btn btn-info" onclick="buscar_referencia_reporte_cambio_pag(1, buscador_resul, ' + campo.id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-right"></i></button>');


}

pag_limit = 1
pago_buscador = 1


function buscar_referencia_paneles_filtrar() {
  emisor = document.getElementById(document.getElementById('vfinal_bus_ficha_4').value)
  pag_limit = 1
  pago_buscador = 1
  ddd = document.getElementById(emisor.id + '_r').value.split(',')

  where = ""
  columnas = document.getElementById(emisor.id + '_s').value
  campo = ddd[0]

  dato = document.getElementById(emisor.id).value
  tabla = document.getElementById(emisor.id + '_t').value
  orderby = " order by " + campo + " "
  PkCampo = 0

  col_div = columnas.split(/[ |,|;]/);
  columnas_senten = ''
  wheree = ' where '
  for (x = 0; x < col_div.length; x++) {
    if(col_div[x] != ''){
      columnas_senten = columnas_senten + 'cast(' + col_div[x] + ' as char) as "' + col_div[x] + '", '
    }
  }
  columnas_senten = columnas_senten.substring(0, columnas_senten.length - 2)
  //alert(columnas)

  for (x = 0; x < col_div.length; x++) {
    if(col_div[x] != ''){
      wheree = wheree + ' ' + col_div[x] + ' like  "%' + document.getElementById('vfinal_bus_ficha_2').value + '%" or'
    }
  }

  wheree = wheree.substring(0, wheree.length - 2)




  cmpsenten = "select " + columnas + ' from ' + tabla + ' ' + wheree + ' ' + orderby

  $.ajax({
    type: 'POST',
    url: '/buscador',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'cmpsenten': cmpsenten, 'usuario': web_usuario, 'A_Select': columnas, 'PkCampo': PkCampo },
    beforeSend: function () {

      $('#intbuscador').html('Buscando información...');
    },
    success: function (Response) {

      if (Response['cmpvalor'].length == 0) {
        //data_int = '<div class="col-lg-3">No existen datos</div>'
        data_int = 'No existen datos'

      } else {
        orden = Response["A_Select"].split(",")
        buscador_resul = Response

        buscador_resultado = Response['cmpvalor']
        data_int = '<div class="row"><div class="col-lg-12" >'
        //'<select class="form-control" id="busca_campo">'
        //for (x = 0; x <   Object.keys(Response['cmpvalor'][0]).length; x++) {
        //  data_int = data_int + '<option>' + Object.keys(Response['cmpvalor'][0])[x] + '</option>'
        cc_id = emisor.id
        //} 
        document.getElementById("buscador_senten").value = cmpsenten
        //'</select>'
        pag_limit = 1
        if ((Response['cmpvalor'].length / 10) % 1 != 0) {
          pag_limit = parseInt(Response['cmpvalor'].length / 10) + 1
        } else {
          pag_limit = parseInt(Response['cmpvalor'].length / 10)
        }
        //data_int = data_int +'<input class="form-control" id="busca_valor" placeholder="Escriba para filtrar" onkeypress="return runScript_buscador_cab(event, ' + cc_id +', '+Response['PkCampo']+')"> '

        //data_int = data_int + '<p id="buscador_int_pag"> <button type="button" class="btn btn-info" onclick="buscar_referencia_cabecera_cambio_pag(-1, buscador_resul,'+busc_campo.id+')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-left"></i></button> '+pago_buscador+' - '+ pag_limit +'  <button type="button" class="btn btn-info" onclick="buscar_referencia_cabecera_cambio_pag(1, buscador_resul,'+busc_campo.id+')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-right"></i></button> </p>'

        data_int = data_int + '</div></div>'





        data_int = data_int + '<div class="modal-footer">'

        data_int = data_int + '</div></div>'

        data_int = data_int + '<button type="button" class="btn btn-info" data-dismiss="modal" onclick="poner_valor_buscar_referencia_ficha(' + cc_id + ',0)" id="c_modal_ref_ficha" style="display: none;">'

        data_int = data_int + '</button></div>'

        data_int = data_int + '<div id="buscador_int" style="overflow: scroll;">'
        data_int = data_int + '<div class="panel-body" ><table style="cursor: pointer;font-size: 11px;background: white;" width="100%" class="table table-striped table-bordered table-hover" id="dataTables-exampleficha"><thead><tr>'
        data_int = data_int + '<th style="display: none;">' + ddd[0] + '</th>'
        data_int = data_int + '<th style="display: none;">' + ddd[1] + '</th>'

        //largos = Response['datos_PkCampo'][0]['largos'].split(',')
        for (x = 0; x < orden.length; x++) {
          data_int = data_int + '<th>' + orden[x] + '</th>'
        }

        data_int = data_int + '</tr></thead><tbody>'



        if (Response['cmpvalor'].length > (pago_buscador * 10)) {
          bus_limite = pago_buscador * 10
        } else {
          bus_limite = Response['cmpvalor'].length
        }

        for (x = (0); x < Response['cmpvalor'].length; x++) {
          //  for (x = (0 + ((pago_buscador-1)*10)); x < bus_limite; x++) {
          data_int = data_int + '<tr onclick="doble_click_buscador_ficha(' + cc_id + ', this)">'
          data_int = data_int + '<td style="display: none;">' + Response['cmpvalor'][x][ddd[0]] + '</td>'
          data_int = data_int + '<td style="display: none;">' + Response['cmpvalor'][x][ddd[1]] + '</td>'

          for (x2 = 0; x2 < orden.length; x2++) {
            data_int = data_int + '<td>' + Response['cmpvalor'][x][orden[x2]] + '</td>'
          }
          data_int = data_int + '</tr>'
        }

        data_int = data_int + '</tbody></table></div>'

        data_int = data_int + '</div>'

        data_int = data_int + '<div class="modal-footer"></div>'
      }



      $('#intnota_ficha').html(data_int);

    }
  });
}


function buscar_referencia_paneles(emisor) {


  document.getElementById('vfinal_bus_ficha_2').value = ''
  pag_limit = 1
  pago_buscador = 1
  ddd = document.getElementById(emisor.id + '_r').value.split(',')


  document.getElementById('vfinal_bus_ficha_4').value = emisor.id


  where = ""
  columnas = document.getElementById(emisor.id + '_s').value
  campo = ddd[0]

  dato = document.getElementById(emisor.id).value
  tabla = document.getElementById(emisor.id + '_t').value
  orderby = " order by " + campo + " "
  PkCampo = 0

  col_div = columnas.split(',')
  columnas_senten = ''
  for (x = 0; x < col_div.length; x++) {
    columnas_senten = columnas_senten + 'cast(' + col_div[x] + ' as char) as "' + col_div[x] + '", '
  }
  columnas_senten = columnas_senten.substring(0, columnas_senten.length - 2)
  //alert(columnas)


  cmpsenten = "select " + columnas + ' from ' + tabla + ' ' + orderby

  $.ajax({
    type: 'POST',
    url: '/buscador',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'cmpsenten': cmpsenten, 'usuario': web_usuario, 'A_Select': columnas, 'PkCampo': PkCampo },
    beforeSend: function () {

      $('#intbuscador').html('Buscando información...');
    },
    success: function (Response) {

      if (Response['cmpvalor'].length == 0) {
        //data_int = '<div class="col-lg-3">No existen datos</div>'
        data_int = 'No existen datos'

      } else {
        orden = Response["A_Select"].split(",")
        buscador_resul = Response

        buscador_resultado = Response['cmpvalor']
        data_int = '<div class="row"><div class="col-lg-12" >'
        //'<select class="form-control" id="busca_campo">'
        //for (x = 0; x <   Object.keys(Response['cmpvalor'][0]).length; x++) {
        //  data_int = data_int + '<option>' + Object.keys(Response['cmpvalor'][0])[x] + '</option>'
        cc_id = emisor.id
        //} 
        document.getElementById("buscador_senten").value = cmpsenten
        //'</select>'
        pag_limit = 1
        if ((Response['cmpvalor'].length / 10) % 1 != 0) {
          pag_limit = parseInt(Response['cmpvalor'].length / 10) + 1
        } else {
          pag_limit = parseInt(Response['cmpvalor'].length / 10)
        }
        //data_int = data_int +'<input class="form-control" id="busca_valor" placeholder="Escriba para filtrar" onkeypress="return runScript_buscador_cab(event, ' + cc_id +', '+Response['PkCampo']+')"> '

        //data_int = data_int + '<p id="buscador_int_pag"> <button type="button" class="btn btn-info" onclick="buscar_referencia_cabecera_cambio_pag(-1, buscador_resul,'+busc_campo.id+')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-left"></i></button> '+pago_buscador+' - '+ pag_limit +'  <button type="button" class="btn btn-info" onclick="buscar_referencia_cabecera_cambio_pag(1, buscador_resul,'+busc_campo.id+')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-right"></i></button> </p>'

        data_int = data_int + '</div></div>'





        data_int = data_int + '<div class="modal-footer">'

        data_int = data_int + '</div></div>'

        data_int = data_int + '<button type="button" class="btn btn-info" data-dismiss="modal" onclick="poner_valor_buscar_referencia_ficha(' + cc_id + ',0)" id="c_modal_ref_ficha" style="display: none;">'

        data_int = data_int + '</button></div>'

        data_int = data_int + '<div id="buscador_int" style="overflow: scroll;">'
        data_int = data_int + '<div class="panel-body" ><table style="cursor: pointer;font-size: 11px;background: white;" width="100%" class="table table-striped table-bordered table-hover" id="dataTables-exampleficha"><thead><tr>'
        data_int = data_int + '<th style="display: none;">' + ddd[0] + '</th>'
        data_int = data_int + '<th style="display: none;">' + ddd[1] + '</th>'

        //largos = Response['datos_PkCampo'][0]['largos'].split(',')
        for (x = 0; x < orden.length; x++) {
          data_int = data_int + '<th>' + orden[x] + '</th>'
        }

        data_int = data_int + '</tr></thead><tbody>'



        if (Response['cmpvalor'].length > (pago_buscador * 10)) {
          bus_limite = pago_buscador * 10
        } else {
          bus_limite = Response['cmpvalor'].length
        }

        for (x = (0); x < Response['cmpvalor'].length; x++) {
          //  for (x = (0 + ((pago_buscador-1)*10)); x < bus_limite; x++) {
          data_int = data_int + '<tr onclick="doble_click_buscador_ficha(' + cc_id + ', this)">'
          data_int = data_int + '<td style="display: none;">' + Response['cmpvalor'][x][ddd[0]] + '</td>'
          data_int = data_int + '<td style="display: none;">' + Response['cmpvalor'][x][ddd[1]] + '</td>'

          for (x2 = 0; x2 < orden.length; x2++) {
            data_int = data_int + '<td>' + Response['cmpvalor'][x][orden[x2]] + '</td>'
          }
          data_int = data_int + '</tr>'
        }

        data_int = data_int + '</tbody></table></div>'

        data_int = data_int + '</div>'

        data_int = data_int + '<div class="modal-footer"></div>'
      }



      $('#intnota_ficha').html(data_int);

    }
  });
}





function buscar_referencia_detalle(campo) {

  pago_buscador = 1

  var cc_id = campo.id
  var res = cc_id.split("fff");
  var res2 = res[1].split("ccc");

  var cc_pesta = res[0].substring(2);
  var cc_fila = res2[0]
  var cc_nombre = res2[1]
  calcular_detalle(cc_pesta, cc_fila)

  Response = dict_pestalla['p-' + cc_pesta]

  PkCampo = Response["func_det"][cc_nombre][0][0]["PkCampo"]

  where = " "
  modo = Response["func_det"][cc_nombre][0][0]["Modo"]
  columnas = Response["func_det"][cc_nombre][0][0]["Columnas"]
  campo = Response["func_det"][cc_nombre][0][0]["Sentencia"]
  dato = document.getElementById(cc_id).value
  tabla = Response["func_det"][cc_nombre][0][0]["TablaOrigen"]
  orderby = " order by " + Response["func_det"][cc_nombre][0][0]["Sentencia"] + " "


  for (x = 0; x < Response["func_det"][cc_nombre][1].length; x++) {

    ElementoA = ""
    ElementoB = ""
    if (Response["func_det"][cc_nombre][1][x]["TipoA"] == "R") {
      id_ext = 'pd' + cc_pesta + 'fff' + cc_fila + 'ccc' + Response["func_det"][cc_nombre][1][x]["ElementoA"]
      ElementoA = "'" + document.getElementById(id_ext).value + "'"
    }
    if (Response["func_det"][cc_nombre][1][x]["TipoA"] == "V") {
      ElementoA = "'" + Response["func_det"][cc_nombre][1][x]["ElementoA"] + "'"
    }
    if (Response["func_det"][cc_nombre][1][x]["TipoA"] == "C") {
      ElementoA = Response["func_det"][cc_nombre][1][x]["ElementoA"]
    }

    if (Response["func_det"][cc_nombre][1][x]["TipoB"] == "R") {
      id_ext = 'pd' + cc_pesta + 'fff' + cc_fila + 'ccc' + Response["func_det"][cc_nombre][1][x]["ElementoB"]
      ElementoB = "'" + document.getElementById(id_ext).value + "'"
    }
    if (Response["func_det"][cc_nombre][1][x]["TipoB"] == "V") {
      ElementoB = "'" + Response["func_det"][cc_nombre][1][x]["ElementoB"] + "'"
    }
    if (Response["func_det"][cc_nombre][1][x]["TipoB"] == "C") {
      ElementoB = Response["func_det"][cc_nombre][1][x]["ElementoB"]
    }

    where = where + ElementoA + ' ' + Response["func_det"][cc_nombre][1][x]["Operador"] + ' ' + ElementoB + ' and '
  }
  if (where == " ") { where = "" } else { where = 'where ' + where.slice(0, -4) }

  cmpsenten = "select " + columnas + ' from ' + tabla + ' ' + where + ' order by ' + Response["func_det"][cc_nombre][0][0]["Sentencia"] + ' '

  if(offline == false){

    $.ajax({
      type: 'POST',
      url: '/buscador',
      data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'cmpsenten': cmpsenten, 'usuario': web_usuario, 'PkCampo': PkCampo, 'A_Select': columnas },
      beforeSend: function () {

        $('#intbuscador').html('Buscando información...');
      },
      success: function (Response) {


        if (Response['cmpvalor'].length == 0) {
          //data_int = '<div class="col-lg-3">No existen datos</div>'
          data_int = 'No existen datos'

        } else {

          pag_limit = 1
          if ((Response['cmpvalor'].length / 10) % 1 != 0) {
            pag_limit = parseInt(Response['cmpvalor'].length / 10) + 1
          } else {
            pag_limit = parseInt(Response['cmpvalor'].length / 10)
          }

          buscador_resul = Response
          buscador_resultado = Response['cmpvalor']
          orden = Response["A_Select"].split(",")
          data_int = '<div class="row"><div class="col-lg-12">'
          //'<select class="form-control" id="busca_campo">'
          //for (x = 0; x <   Object.keys(Response['cmpvalor'][0]).length; x++) {
          //data_int = data_int + '<option>' + Object.keys(Response['cmpvalor'][0])[x] + '</option>'

          //} 
          document.getElementById("buscador_senten").value = cmpsenten
          //data_int = data_int + '</select>'
          data_int = data_int + '<input class="form-control" id="busca_valor" placeholder="Escriba para filtrar" onkeypress="return runScript_buscador_det(event, ' + cc_id + ', ' + Response['PkCampo'] + ')"> '

          $('#intbuscadorcab').html('<button type="button" class="btn btn-info" onclick="filtrar_buscar_det(' + cc_id + ', ' + Response['PkCampo'] + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-check"></i></button><button type="button" class="close" data-dismiss="modal" id="modal1"><span aria-hidden="true">×</span></button>')


          data_int = data_int + '<p id="buscador_int_pag"><button type="button" class="btn btn-info" onclick="buscar_referencia_detalle_cambio_pag(-1, buscador_resul, ' + cc_id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-left"></i></button> ' + pago_buscador + ' - ' + pag_limit + '  <button type="button" class="btn btn-info" onclick="buscar_referencia_detalle_cambio_pag(1, buscador_resul, ' + cc_id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-right"></i></button></p></div></div>'


          //'<button class="btn bg-blue btn-flat margin" onclick="filtrar_buscar(' + cc_id +')"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></button>'

          data_int = data_int + '<div class="modal-footer"><button type="button" class="btn bg-blue btn-flat margin" data-dismiss="modal" onclick="poner_valor_buscar_referencia_detalle(' + cc_id + ')" id="c_modal_ref_det" style="display: none;"></button></div>'


          data_int = data_int + '<div id="buscador_int" style="overflow: scroll;">'
          data_int = data_int + '<div class="panel-body"><table style="cursor: pointer;font-size: 11px;background: white;" width="100%" class="table table-striped table-bordered table-hover" id="dataTables-example"><thead><tr>'
          data_int = data_int + '<th style="display: none;">' + campo + '</th>'
          visibles = Response['datos_PkCampo'][0]['visibles'].split(',')
          //largos = Response['datos_PkCampo'][0]['largos'].split(',')
          for (x = 0; x < orden.length; x++) {
            if (visibles[x] == 'S') {
              data_int = data_int + '<th>' + orden[x] + '</th>'
            } else {
              data_int = data_int + '<th style="display: none;">' + orden[x] + '</th>'
            }

          }


          if (Response['cmpvalor'].length > (pago_buscador * 10)) {
            bus_limite = pago_buscador * 10
          } else {
            bus_limite = Response['cmpvalor'].length
          }
          data_int = data_int + '</tr></thead><tbody>'
          for (x = (0 + ((pago_buscador - 1) * 10)); x < bus_limite; x++) {
            data_int = data_int + '<tr onclick="doble_click_buscador_det(' + cc_id + ', this)" >'
            data_int = data_int + '<td style="display: none;">' + Response['cmpvalor'][x][campo] + '</td>'
            for (x2 = 0; x2 < orden.length; x2++) {
              if (visibles[x2] == 'S') {
                if (orden[x2] == 'imagen') {
                  data_int = data_int + '<td><div class="thumbnail" style="height: 100px;margin-bottom: 1px;"><div class="image view view-first"><img style="width: 80%;height: 80px;margin-left: auto;margin-right: auto; display: block;" src="/media/archivos/' + web_Id_empresa + '/' + Response['cmpvalor'][x][orden[x2]] + '" alt="image"><a href="/media/archivos/' + web_Id_empresa + '/' + Response['cmpvalor'][x][orden[x2]] + '" target="_blank">' + Response['cmpvalor'][x][orden[x2]] + '</a></div></div></td>'
                } else {
                  data_int = data_int + '<td>' + Response['cmpvalor'][x][orden[x2]] + '</td>'
                }

              } else {
                if (orden[x2] == 'imagen') {
                  data_int = data_int + '<td style="display: none;"><div class="thumbnail" style="height: 100px;margin-bottom: 1px;"><div class="image view view-first"><img style="width: 80%;height: 80px;margin-left: auto;margin-right: auto; display: block;" src="/media/archivos/' + web_Id_empresa + '/' + Response['cmpvalor'][x][orden[x2]] + '" alt="image"><a href="/media/archivos/' + web_Id_empresa + '/' + Response['cmpvalor'][x][orden[x2]] + '" target="_blank">' + Response['cmpvalor'][x][orden[x2]] + '</a></div></div></td>'
                } else {
                  data_int = data_int + '<td style="display: none;">' + Response['cmpvalor'][x][orden[x2]] + '</td>'
                }

              }





            }
            data_int = data_int + '</tr>'
          }

          data_int = data_int + '</tbody></table></div>'
          data_int = data_int + '</div>'
          data_int = data_int + '<div class="modal-footer">'

          data_int = data_int + '<p id="buscador_int_pag2"><button type="button" class="btn btn-info" onclick="buscar_referencia_detalle_cambio_pag(-1, buscador_resul, ' + cc_id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-left"></i></button> ' + pago_buscador + ' - ' + pag_limit + '  <button type="button" class="btn btn-info" onclick="buscar_referencia_detalle_cambio_pag(1, buscador_resul, ' + cc_id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-right"></i></button></p>'

          data_int = data_int + '</div>'





        }

        $('#intbuscador').html(data_int);

      }
    });
        
  }
  if(offline == true){

    Response = bases_pregargadas[cc_nombre]

      if (Response['cmpvalor'].length == 0) {
        //data_int = '<div class="col-lg-3">No existen datos</div>'
        data_int = 'No existen datos'

      } else {

        pag_limit = 1
        if ((Response['cmpvalor'].length / 10) % 1 != 0) {
          pag_limit = parseInt(Response['cmpvalor'].length / 10) + 1
        } else {
          pag_limit = parseInt(Response['cmpvalor'].length / 10)
        }

        buscador_resul = Response
        buscador_resultado = Response['cmpvalor']
        orden = Response["A_Select"].split(",")
        data_int = '<div class="row"><div class="col-lg-12">'
        //'<select class="form-control" id="busca_campo">'
        //for (x = 0; x <   Object.keys(Response['cmpvalor'][0]).length; x++) {
        //data_int = data_int + '<option>' + Object.keys(Response['cmpvalor'][0])[x] + '</option>'

        //} 
        document.getElementById("buscador_senten").value = cmpsenten
        //data_int = data_int + '</select>'
        data_int = data_int + '<input class="form-control" id="busca_valor" placeholder="Escriba para filtrar" onkeypress="return runScript_buscador_det(event, ' + cc_id + ', ' + Response['PkCampo'] + ')"> '

        $('#intbuscadorcab').html('<button type="button" class="btn btn-info" onclick="filtrar_buscar_det(' + cc_id + ', ' + Response['PkCampo'] + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-check"></i></button><button type="button" class="close" data-dismiss="modal" id="modal1"><span aria-hidden="true">×</span></button>')


        data_int = data_int + '<p id="buscador_int_pag"><button type="button" class="btn btn-info" onclick="buscar_referencia_detalle_cambio_pag(-1, buscador_resul, ' + cc_id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-left"></i></button> ' + pago_buscador + ' - ' + pag_limit + '  <button type="button" class="btn btn-info" onclick="buscar_referencia_detalle_cambio_pag(1, buscador_resul, ' + cc_id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-right"></i></button></p></div></div>'


        //'<button class="btn bg-blue btn-flat margin" onclick="filtrar_buscar(' + cc_id +')"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></button>'

        data_int = data_int + '<div class="modal-footer"><button type="button" class="btn bg-blue btn-flat margin" data-dismiss="modal" onclick="poner_valor_buscar_referencia_detalle(' + cc_id + ')" id="c_modal_ref_det" style="display: none;"></button></div>'


        data_int = data_int + '<div id="buscador_int" style="overflow: scroll;">'
        data_int = data_int + '<div class="panel-body"><table style="cursor: pointer;font-size: 11px;background: white;" width="100%" class="table table-striped table-bordered table-hover" id="dataTables-example"><thead><tr>'
        data_int = data_int + '<th style="display: none;">' + campo + '</th>'
        visibles = Response['visibles'].split(',')
        //largos = Response['datos_PkCampo'][0]['largos'].split(',')
        for (x = 0; x < orden.length; x++) {
          if (visibles[x] == 'S') {
            data_int = data_int + '<th>' + orden[x] + '</th>'
          } else {
            data_int = data_int + '<th style="display: none;">' + orden[x] + '</th>'
          }

        }


        if (Response['cmpvalor'].length > (pago_buscador * 10)) {
          bus_limite = pago_buscador * 10
        } else {
          bus_limite = Response['cmpvalor'].length
        }
        data_int = data_int + '</tr></thead><tbody>'
        for (x = (0 + ((pago_buscador - 1) * 10)); x < bus_limite; x++) {
          data_int = data_int + '<tr onclick="doble_click_buscador_det(' + cc_id + ', this)" >'
          data_int = data_int + '<td style="display: none;">' + Response['cmpvalor'][x][campo] + '</td>'
          for (x2 = 0; x2 < orden.length; x2++) {
            if (visibles[x2] == 'S') {
              if (orden[x2] == 'imagen') {
                data_int = data_int + '<td><div class="thumbnail" style="height: 100px;margin-bottom: 1px;"><div class="image view view-first"><img style="width: 80%;height: 80px;margin-left: auto;margin-right: auto; display: block;" src="/media/archivos/' + web_Id_empresa + '/' + Response['cmpvalor'][x][orden[x2]] + '" alt="image"><a href="/media/archivos/' + web_Id_empresa + '/' + Response['cmpvalor'][x][orden[x2]] + '" target="_blank">' + Response['cmpvalor'][x][orden[x2]] + '</a></div></div></td>'
              } else {
                data_int = data_int + '<td>' + Response['cmpvalor'][x][orden[x2]] + '</td>'
              }

            } else {
              if (orden[x2] == 'imagen') {
                data_int = data_int + '<td style="display: none;"><div class="thumbnail" style="height: 100px;margin-bottom: 1px;"><div class="image view view-first"><img style="width: 80%;height: 80px;margin-left: auto;margin-right: auto; display: block;" src="/media/archivos/' + web_Id_empresa + '/' + Response['cmpvalor'][x][orden[x2]] + '" alt="image"><a href="/media/archivos/' + web_Id_empresa + '/' + Response['cmpvalor'][x][orden[x2]] + '" target="_blank">' + Response['cmpvalor'][x][orden[x2]] + '</a></div></div></td>'
              } else {
                data_int = data_int + '<td style="display: none;">' + Response['cmpvalor'][x][orden[x2]] + '</td>'
              }

            }





          }
          data_int = data_int + '</tr>'
        }

        data_int = data_int + '</tbody></table></div>'
        data_int = data_int + '</div>'
        data_int = data_int + '<div class="modal-footer">'

        data_int = data_int + '<p id="buscador_int_pag2"><button type="button" class="btn btn-info" onclick="buscar_referencia_detalle_cambio_pag(-1, buscador_resul, ' + cc_id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-left"></i></button> ' + pago_buscador + ' - ' + pag_limit + '  <button type="button" class="btn btn-info" onclick="buscar_referencia_detalle_cambio_pag(1, buscador_resul, ' + cc_id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-right"></i></button></p>'

        data_int = data_int + '</div>'





      }

      $('#intbuscador').html(data_int);

    
  }
}

function buscar_referencia_subdetalle(campo) {

  pago_buscador = 1

  var cc_id = campo.id
  var res = cc_id.split("qqq");
  var res2 = res[1].split("yyy");
  var res3 = res2[1].split("www");

  var cc_pesta = res[0].substring(2);
  var cc_fila = res2[0]
  var cc_head = res3[0]
  var cc_nombre = res3[1]

  calcular_subdetalle(cc_pesta, cc_fila, cc_head)

  Response = dict_pestalla['p-' + cc_pesta]

  PkCampo = Response["func_subdet"][cc_nombre][0][0]["PkCampo"]

  where = " "
  modo = Response["func_subdet"][cc_nombre][0][0]["Modo"]
  columnas = Response["func_subdet"][cc_nombre][0][0]["Columnas"]
  campo = Response["func_subdet"][cc_nombre][0][0]["Sentencia"]
  dato = document.getElementById(cc_id).value
  tabla = Response["func_subdet"][cc_nombre][0][0]["TablaOrigen"]
  orderby = " order by " + Response["func_subdet"][cc_nombre][0][0]["Sentencia"] + " "


  for (x = 0; x < Response["func_subdet"][cc_nombre][1].length; x++) {

    ElementoA = ""
    ElementoB = ""
    if (Response["func_subdet"][cc_nombre][1][x]["TipoA"] == "R") {
      id_ext = 'ps' + cc_pesta + 'qqq' + cc_fila + 'yyy' + cc_head + 'www' + Response["func_subdet"][cc_nombre][1][x]["ElementoA"]
      ElementoA = "'" + document.getElementById(id_ext).value + "'"
    }
    if (Response["func_subdet"][cc_nombre][1][x]["TipoA"] == "V") {
      ElementoA = "'" + Response["func_subdet"][cc_nombre][1][x]["ElementoA"] + "'"
    }
    if (Response["func_subdet"][cc_nombre][1][x]["TipoA"] == "C") {
      ElementoA = Response["func_subdet"][cc_nombre][1][x]["ElementoA"]
    }

    if (Response["func_subdet"][cc_nombre][1][x]["TipoB"] == "R") {
      id_ext = 'ps' + cc_pesta + 'qqq' + cc_fila + 'yyy' + cc_head + 'www' + Response["func_subdet"][cc_nombre][1][x]["ElementoB"]
      ElementoB = "'" + document.getElementById(id_ext).value + "'"
    }
    if (Response["func_subdet"][cc_nombre][1][x]["TipoB"] == "V") {
      ElementoB = "'" + Response["func_subdet"][cc_nombre][1][x]["ElementoB"] + "'"
    }
    if (Response["func_subdet"][cc_nombre][1][x]["TipoB"] == "C") {
      ElementoB = Response["func_subdet"][cc_nombre][1][x]["ElementoB"]
    }

    where = where + ElementoA + ' ' + Response["func_subdet"][cc_nombre][1][x]["Operador"] + ' ' + ElementoB + ' and '
  }
  if (where == " ") { where = "" } else { where = 'where ' + where.slice(0, -4) }

  cmpsenten = "select " + columnas + ' from ' + tabla + ' ' + where + ' order by ' + Response["func_subdet"][cc_nombre][0][0]["Sentencia"] + ' '

  $.ajax({
    type: 'POST',
    url: '/buscador',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'cmpsenten': cmpsenten, 'usuario': web_usuario, 'PkCampo': PkCampo, 'A_Select': columnas },
    beforeSend: function () {

      $('#intbuscador').html('Buscando información...');
    },
    success: function (Response) {

      if (Response['cmpvalor'].length == 0) {
        //data_int = '<div class="col-lg-3">No existen datos</div>'
        data_int = 'No existen datos'

      } else {

        pag_limit = 1
        if ((Response['cmpvalor'].length / 10) % 1 != 0) {
          pag_limit = parseInt(Response['cmpvalor'].length / 10) + 1
        } else {
          pag_limit = parseInt(Response['cmpvalor'].length / 10)
        }

        buscador_resul = Response
        buscador_resultado = Response['cmpvalor']
        orden = Response["A_Select"].split(",")
        data_int = '<div class="row"><div class="col-lg-12">'
        //'<select class="form-control" id="busca_campo">'
        //for (x = 0; x <   Object.keys(Response['cmpvalor'][0]).length; x++) {
        //data_int = data_int + '<option>' + Object.keys(Response['cmpvalor'][0])[x] + '</option>'

        //} 
        document.getElementById("buscador_senten").value = cmpsenten
        //data_int = data_int + '</select>'
        data_int = data_int + '<input class="form-control" id="busca_valor" placeholder="Escriba para filtrar" onkeypress="return runScript_buscador_subdet(event, ' + cc_id + ', ' + Response['PkCampo'] + ')"> '

        $('#intbuscadorcab').html('<button type="button" class="btn btn-info" onclick="filtrar_buscar_subdet(' + cc_id + ', ' + Response['PkCampo'] + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-check"></i><div class="ripple-container"></div></button><button type="button" class="close" data-dismiss="modal" id="modal1"><span aria-hidden="true">×</span></button>')
        data_int = data_int + '<p id="buscador_int_pag"><button type="button" class="btn btn-info" onclick="buscar_referencia_subdetalle_cambio_pag(-1, buscador_resul, ' + cc_id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-left"></i></button> ' + pago_buscador + ' - ' + pag_limit + '  <button type="button" class="btn btn-info" onclick="buscar_referencia_subdetalle_cambio_pag(1, buscador_resul, ' + cc_id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-right"></i></button></p></div></div>'
        
        

        


        //'<button class="btn bg-blue btn-flat margin" onclick="filtrar_buscar(' + cc_id +')"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></button>'

        data_int = data_int + '<div class="modal-footer"><button type="button" class="btn bg-blue btn-flat margin" data-dismiss="modal" onclick="poner_valor_buscar_referencia_subdetalle(' + cc_id + ')" id="c_modal_ref_det" style="display: none;"></button></div>'


        data_int = data_int + '<div id="buscador_int" style="overflow: scroll;">'
        data_int = data_int + '<div class="panel-body"><table style="cursor: pointer;font-size: 11px;background: white;" width="100%" class="table table-striped table-bordered table-hover" id="dataTables-example"><thead><tr>'
        data_int = data_int + '<th style="display: none;">' + campo + '</th>'
        visibles = Response['datos_PkCampo'][0]['visibles'].split(',')
        //largos = Response['datos_PkCampo'][0]['largos'].split(',')
        for (x = 0; x < orden.length; x++) {
          if (visibles[x] == 'S') {
            data_int = data_int + '<th>' + orden[x] + '</th>'
          } else {
            data_int = data_int + '<th style="display: none;">' + orden[x] + '</th>'
          }

        }


        if (Response['cmpvalor'].length > (pago_buscador * 10)) {
          bus_limite = pago_buscador * 10
        } else {
          bus_limite = Response['cmpvalor'].length
        }
        data_int = data_int + '</tr></thead><tbody>'
        for (x = (0 + ((pago_buscador - 1) * 10)); x < bus_limite; x++) {
          data_int = data_int + '<tr onclick="doble_click_buscador_det(' + cc_id + ', this)" >'
          data_int = data_int + '<td style="display: none;">' + Response['cmpvalor'][x][campo] + '</td>'
          for (x2 = 0; x2 < orden.length; x2++) {
            if (visibles[x2] == 'S') {
              if (orden[x2] == 'imagen') {
                data_int = data_int + '<td><div class="thumbnail" style="height: 100px;margin-bottom: 1px;"><div class="image view view-first"><img style="width: 80%;height: 80px;margin-left: auto;margin-right: auto; display: block;" src="/media/archivos/' + web_Id_empresa + '/' + Response['cmpvalor'][x][orden[x2]] + '" alt="image"><a href="/media/archivos/' + web_Id_empresa + '/' + Response['cmpvalor'][x][orden[x2]] + '" target="_blank">' + Response['cmpvalor'][x][orden[x2]] + '</a></div></div></td>'
              } else {
                data_int = data_int + '<td>' + Response['cmpvalor'][x][orden[x2]] + '</td>'
              }

            } else {
              if (orden[x2] == 'imagen') {
                data_int = data_int + '<td style="display: none;"><div class="thumbnail" style="height: 100px;margin-bottom: 1px;"><div class="image view view-first"><img style="width: 80%;height: 80px;margin-left: auto;margin-right: auto; display: block;" src="/media/archivos/' + web_Id_empresa + '/' + Response['cmpvalor'][x][orden[x2]] + '" alt="image"><a href="/media/archivos/' + web_Id_empresa + '/' + Response['cmpvalor'][x][orden[x2]] + '" target="_blank">' + Response['cmpvalor'][x][orden[x2]] + '</a></div></div></td>'
              } else {
                data_int = data_int + '<td style="display: none;">' + Response['cmpvalor'][x][orden[x2]] + '</td>'
              }

            }





          }
          data_int = data_int + '</tr>'
        }

        data_int = data_int + '</tbody></table></div>'
        data_int = data_int + '</div>'
        data_int = data_int + '<div class="modal-footer">'

        data_int = data_int + '<p id="buscador_int_pag2"><button type="button" class="btn btn-info" onclick="buscar_referencia_subdetalle_cambio_pag(-1, buscador_resul, ' + cc_id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-left"></i></button> ' + pago_buscador + ' - ' + pag_limit + '  <button type="button" class="btn btn-info" onclick="buscar_referencia_subdetalle_cambio_pag(1, buscador_resul, ' + cc_id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-right"></i></button></p>'
        data_int = data_int + '</div>'


      }

      $('#intbuscador').html(data_int);

    }
  });
}



function buscar_referencia_detalle_cambio_pag(flujo, Response, campo) {


  var cc_id = campo.id
  var res = cc_id.split("fff");
  var res2 = res[1].split("ccc");

  var cc_pesta = res[0].substring(2);
  var cc_fila = res2[0]
  var cc_nombre = res2[1]
  calcular_detalle(cc_pesta, cc_fila)



  campo_sente = dict_pestalla['p-' + cc_pesta]["func_det"][cc_nombre][0][0]["Sentencia"]


  if (flujo == -1) {
    if (pago_buscador > 1) { pago_buscador = pago_buscador - 1 }

  } else {
    if (pago_buscador < pag_limit) { pago_buscador = pago_buscador + 1 }

  }


  orden = Response["A_Select"].split(",")


  buscador_resul = Response
  //'</select>'
  databusdador = []
  //quiere dicre esta offline y hay algo filtrado debe usar new_cmpvalor and ugar de Response['cmpvalor']
  if(offline == true && document.getElementById('busca_valor').value.length>0){
    databusdador= new_cmpvalor
  }else{
    databusdador= Response['cmpvalor']
  }


  pag_limit = 1
  if ((databusdador.length / 10) % 1 != 0) {
    pag_limit = parseInt(databusdador.length / 10) + 1
  } else {
    pag_limit = parseInt(databusdador.length / 10)
  }






  data_int = ''
  data_int = data_int + '<div class="panel-body"><table style="cursor: pointer;font-size: 11px;background: white;" width="100%" class="table table-striped table-bordered table-hover" id="dataTables-example"><thead><tr>'
  data_int = data_int + '<th style="display: none;">' + campo_sente + '</th>'

  if(offline == false){
    visibles = Response['datos_PkCampo'][0]['visibles'].split(',')
  }else{
    visibles = Response['visibles'].split(',')
  }
  //largos = Response['datos_PkCampo'][0]['largos'].split(',')
  for (x = 0; x < orden.length; x++) {
    if (visibles[x] == 'S') {
      data_int = data_int + '<th>' + orden[x] + '</th>'
    } else {
      data_int = data_int + '<th style="display: none;">' + orden[x] + '</th>'
    }
  }

  data_int = data_int + '</tr></thead><tbody>'


  if(offline == false){

    if (databusdador.length > (pago_buscador * 10)) {
      bus_limite = pago_buscador * 10
    } else {
      bus_limite = databusdador.length
    }
  
    for (x = (0 + ((pago_buscador - 1) * 10)); x < bus_limite; x++) {
      data_int = data_int + '<tr onclick="doble_click_buscador_det(' + cc_id + ', this)">'
      data_int = data_int + '<td style="display: none;">' + databusdador[x][campo_sente] + '</td>'
      for (x2 = 0; x2 < orden.length; x2++) {
        if (visibles[x2] == 'S') {
          if (orden[x2] == 'imagen') {
            data_int = data_int + '<td><div class="thumbnail" style="height: 100px;margin-bottom: 1px;"><div class="image view view-first"><img style="width: 80%;height: 80px;margin-left: auto;margin-right: auto; display: block;" src="/media/archivos/' + web_Id_empresa + '/' + databusdador[x][orden[x2]] + '" alt="image"><a href="/media/archivos/' + web_Id_empresa + '/' + databusdador[x][orden[x2]] + '" target="_blank">' + databusdador[x][orden[x2]] + '</a></div></div></td>'
          } else {
            data_int = data_int + '<td>' + databusdador[x][orden[x2]] + '</td>'
          }
        } else {
          data_int = data_int + '<td style="display: none;">' + databusdador[x][orden[x2]] + '</td>'
        }
      }
      data_int = data_int + '</tr>'
    }
    data_int = data_int + '</tbody></table></div>'
  }
  if(offline == true){

    valorr = document.getElementById('busca_valor').value
    //if(valorr.length >0){
      if (databusdador.length > (pago_buscador * 10)) {
        bus_limite = pago_buscador * 10
      } else {
        bus_limite = databusdador.length
      }
    
      for (x = (0 + ((pago_buscador - 1) * 10)); x < bus_limite; x++) {
        data_int = data_int + '<tr onclick="doble_click_buscador_det(' + cc_id + ', this)">'
        data_int = data_int + '<td style="display: none;">' + databusdador[x][campo_sente] + '</td>'
        for (x2 = 0; x2 < orden.length; x2++) {
          if (visibles[x2] == 'S') {
            if (orden[x2] == 'imagen') {
              data_int = data_int + '<td><div class="thumbnail" style="height: 100px;margin-bottom: 1px;"><div class="image view view-first"><img style="width: 80%;height: 80px;margin-left: auto;margin-right: auto; display: block;" src="/media/archivos/' + web_Id_empresa + '/' + databusdador[x][orden[x2]] + '" alt="image"><a href="/media/archivos/' + web_Id_empresa + '/' + databusdador[x][orden[x2]] + '" target="_blank">' + databusdador[x][orden[x2]] + '</a></div></div></td>'
            } else {
              data_int = data_int + '<td>' + databusdador[x][orden[x2]] + '</td>'
            }
          } else {
            data_int = data_int + '<td style="display: none;">' + databusdador[x][orden[x2]] + '</td>'
          }
        }
        data_int = data_int + '</tr>'
      }
      data_int = data_int + '</tbody></table></div>'
    //}

  }

  





  $('#buscador_int').html(data_int);
  $('#buscador_int_pag').html('<button type="button" class="btn btn-info" onclick="buscar_referencia_detalle_cambio_pag(-1, buscador_resul, ' + campo.id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-left"></i></button> ' + pago_buscador + ' - ' + pag_limit + '  <button type="button" class="btn btn-info" onclick="buscar_referencia_detalle_cambio_pag(1, buscador_resul, ' + campo.id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-right"></i></button>');
  $('#buscador_int_pag2').html('<button type="button" class="btn btn-info" onclick="buscar_referencia_detalle_cambio_pag(-1, buscador_resul, ' + campo.id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-left"></i></button> ' + pago_buscador + ' - ' + pag_limit + '  <button type="button" class="btn btn-info" onclick="buscar_referencia_detalle_cambio_pag(1, buscador_resul, ' + campo.id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-right"></i></button>');


}


function buscar_referencia_subdetalle_cambio_pag(flujo, Response, campo) {


  var cc_id = campo.id
  var res = cc_id.split("qqq");
  var res2 = res[1].split("yyy");
  var res3 = res2[1].split("www");

  var cc_pesta = res[0].substring(2);
  var cc_fila = res2[0]
  var cc_head = res3[0]
  var cc_nombre = res3[1]
  calcular_subdetalle(cc_pesta, cc_fila, cc_head)



  campo_sente = dict_pestalla['p-' + cc_pesta]["func_subdet"][cc_nombre][0][0]["Sentencia"]


  if (flujo == -1) {
    if (pago_buscador > 1) { pago_buscador = pago_buscador - 1 }

  } else {
    if (pago_buscador < pag_limit) { pago_buscador = pago_buscador + 1 }

  }


  orden = Response["A_Select"].split(",")


  buscador_resul = Response
  //'</select>'
  pag_limit = 1
  if ((Response['cmpvalor'].length / 10) % 1 != 0) {
    pag_limit = parseInt(Response['cmpvalor'].length / 10) + 1
  } else {
    pag_limit = parseInt(Response['cmpvalor'].length / 10)
  }






  data_int = ''
  data_int = data_int + '<div class="panel-body"><table style="cursor: pointer;font-size: 11px;background: white;" width="100%" class="table table-striped table-bordered table-hover" id="dataTables-example"><thead><tr>'
  data_int = data_int + '<th style="display: none;">' + campo_sente + '</th>'
  visibles = Response['datos_PkCampo'][0]['visibles'].split(',')
  //largos = Response['datos_PkCampo'][0]['largos'].split(',')
  for (x = 0; x < orden.length; x++) {
    if (visibles[x] == 'S') {
      data_int = data_int + '<th>' + orden[x] + '</th>'
    } else {
      data_int = data_int + '<th style="display: none;">' + orden[x] + '</th>'
    }
  }

  data_int = data_int + '</tr></thead><tbody>'



  if (Response['cmpvalor'].length > (pago_buscador * 10)) {
    bus_limite = pago_buscador * 10
  } else {
    bus_limite = Response['cmpvalor'].length
  }

  //for (x = (0); x < Response['cmpvalor'].length; x++) {              
  for (x = (0 + ((pago_buscador - 1) * 10)); x < bus_limite; x++) {
    data_int = data_int + '<tr onclick="doble_click_buscador_subdet(' + cc_id + ', this)">'
    data_int = data_int + '<td style="display: none;">' + Response['cmpvalor'][x][campo_sente] + '</td>'

    for (x2 = 0; x2 < orden.length; x2++) {
      if (visibles[x2] == 'S') {
        if (orden[x2] == 'imagen') {
          data_int = data_int + '<td><div class="thumbnail" style="height: 100px;margin-bottom: 1px;"><div class="image view view-first"><img style="width: 80%;height: 80px;margin-left: auto;margin-right: auto; display: block;" src="/media/archivos/' + web_Id_empresa + '/' + Response['cmpvalor'][x][orden[x2]] + '" alt="image"><a href="/media/archivos/' + web_Id_empresa + '/' + Response['cmpvalor'][x][orden[x2]] + '" target="_blank">' + Response['cmpvalor'][x][orden[x2]] + '</a></div></div></td>'
        } else {
          data_int = data_int + '<td>' + Response['cmpvalor'][x][orden[x2]] + '</td>'
        }



      } else {
        data_int = data_int + '<td style="display: none;">' + Response['cmpvalor'][x][orden[x2]] + '</td>'
      }
    }
    data_int = data_int + '</tr>'
  }


  data_int = data_int + '</tbody></table></div>'





  $('#buscador_int').html(data_int);
  $('#buscador_int_pag').html('<button type="button" class="btn btn-info" onclick="buscar_referencia_subdetalle_cambio_pag(-1, buscador_resul, ' + campo.id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-left"></i></button> ' + pago_buscador + ' - ' + pag_limit + '  <button type="button" class="btn btn-info" onclick="buscar_referencia_subdetalle_cambio_pag(1, buscador_resul, ' + campo.id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-right"></i></button>');

  $('#buscador_int_pag2').html('<button type="button" class="btn btn-info" onclick="buscar_referencia_subdetalle_cambio_pag(-1, buscador_resul, ' + campo.id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-left"></i></button> ' + pago_buscador + ' - ' + pag_limit + '  <button type="button" class="btn btn-info" onclick="buscar_referencia_subdetalle_cambio_pag(1, buscador_resul, ' + campo.id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-right"></i></button>');

}




function registro_de_rep(pkmodulo, pkregistro, tipo) {

  pestalla = pestalla + 1;

  $("#myTab").prepend('<li role="presentation" class="" id="li' + pestalla + '" style="text-align: right;"><a href="#rr' + pestalla + '" id="id' + pestalla + '" role="tab" data-toggle="tab" aria-expanded="false">Vista_rapida  <i class="fa fa-times" style="color: red; background: transparent;cursor: pointer;" onclick="cerrar_elemento(' + pestalla + ')"></i> </a></li>');





  var id_tab = pkmodulo
  if (tipo == 0) { tipo = 'Nuevo' }
  if (tipo == 1) { tipo = 'modificar' }
  if (tipo == 2) { tipo = 'consulta' }

  $.ajax({
    type: 'POST',
    url: '/' + web_idioma + '/consulta',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'pkmodulo': pkmodulo, 'pestalla': pestalla, 'pkregistro': pkregistro, 'tipo': tipo, 't_clave': 0 },
    beforeSend: function () {
      $("#myTabContent").prepend('<div role="tabpanel" class="tab-pane fade" id="rr' + pestalla + '" aria-labelledby="id' + pestalla + '" style="background-color: transparent;"> Procesando </div>');
    },
    success: function (Response) {

      $('#rr' + pestalla).html('');

      id_dic = 'p-' + pestalla
      dict_pestalla[id_dic] = Response
      cc_porPesta[id_dic] = 1

      div_botones = '<div class="row"><div class="col-md-12"><div class="row">'
      readonly = 'readonly="readonly"'
      if (tipo == 'consulta') {
        readonly = 'readonly="readonly"'
        //div_botones =div_botones +'<button type="button" onclick="cerrar_elemento(' + pestalla + ')" class="btn bg-blue btn-flat margin"><span>Correo</span></button>'
        if (dict_pestalla[id_dic]["plantilla_pdf"]["plantillasMain"].length > 0) {
          for (dd = 0; dd < dict_pestalla[id_dic]["plantilla_pdf"]["plantillasMain"].length; dd++) {
            div_botones = div_botones + '<button type="button" onclick="pdf_elemento(' + pestalla + ', ' + dd + ')" class="btn bg-blue btn-flat margin"><span>' + dict_pestalla[id_dic]["plantilla_pdf"]["plantillasMain"][dd]['Nombre'] + '</span></button>'

          }
        }
        div_botones = div_botones + '<button type="button" id="btnAutocerrar"' + pestalla + '" class="btn bg-blue btn-flat margin" onclick="parar_autoccerar_pestana(' + pestalla + ')">Auto Cerrar</button>'

      }



      else {
        if (tipo == 'Nuevo') {
          disparador = 'Guardar Registro Nuevo'
          //div_botones =div_botones +'<button type="button" id="btn_grabar_'+pestalla+'" onclick="this.disabled=true;click_val(1);grabar_elemento(' + pestalla + ',0)" class="btn bg-green btn-flat margin"><span>Grabar</span></button>'
          div_botones = div_botones + '<button type="button" id="btn_grabar_' + pestalla + '" onclick="abrir_default_grabando();grabar_elemento(' + pestalla + ',0)" class="btn bg-green btn-flat margin"><span>Grabar</span></button>'
        } else {
          disparador = 'Modificar Registro'
          //div_botones =div_botones +'<button type="button" id="btn_mod_'+pestalla+'" onclick="this.disabled=true;click_val(1);grabar_elemento(' + pestalla + ',1)" class="btn bg-green btn-flat margin"><span>Grabar</span></button>'
          div_botones = div_botones + '<button type="button" id="btn_mod_' + pestalla + '" onclick="abrir_default_grabando();grabar_elemento(' + pestalla + ',1)" class="btn bg-green btn-flat margin"><span>Grabar</span></button>'
        }
        if(web_esAdmin == 'Y'){
          div_botones = div_botones + '<button type="button" onclick="validar_registro(' + pestalla + ')" class="btn bg-yellow btn-flat margin"><span>Validar</span></button>'
        }
        //div_botones =div_botones +'<button type="button" onclick="nuevo_elemento(' + pestalla + ')" class="btn bg-blue btn-flat margin"><span>Nuevo</span></button>'
        readonly = ''
      }
      if (Response["acc_rapido"]['Modificar'] == 'Si') {
        div_botones = div_botones + '<button class="btn bg-yellow btn-flat margin" onclick="registro(' + Response["tabla_cab"]["PkModulo"] + ',' + Response["t_pkregistro"] + ',1,' + Response["dev_pestalla"] + ',0,0);cerrar_elemento(' + Response["dev_pestalla"] + ')">Modificar</span></button>'
      }

      if (Response["acc_rapido"]['Nuevo'] == 'Si') {
        div_botones = div_botones + '<button class="btn bg-blue btn-flat margin" onclick="registro(' + Response["tabla_cab"]["PkModulo"] + ',' + Response["t_pkregistro"] + ',0,' + Response["dev_pestalla"] + ',0,0);cerrar_elemento(' + Response["dev_pestalla"] + ')">Copiar en Nuevo</span></button>'
      }
      if (Response["acc_rapido"]['Eliminar'] == 'Si') {
        div_botones = div_botones + '<button class="btn bg-red btn-flat margin" onclick="cerrar_elemento(' + Response["dev_pestalla"] + ');eliminar(' + Response["tabla_cab"]["PkModulo"] + ',' + Response["t_pkregistro"] + ')">Eliminar</span></button>'
      }

      div_botones = div_botones + '<button type="button" onclick="cerrar_elemento(' + pestalla + ')" class="btn bg-gray btn-flat margin"><span>Cerrar</span></button>'

      div_botones = div_botones + '</div></div></div>'
      $('#rr' + pestalla).append(div_botones);
      div_campos2 = ''
      div_campos = '<div class="box-body" style="background: white;"> <div class="row">'
      div_campos_arriba_izq = ''
      div_campos_arriba_der = ''
      div_campos_abajo_izq = ''
      div_campos_abajo_der = ''
      div_c_t = ''
      for (x = 0; x < Response["campos_cab"].length; x++) {

        if (tipo == 'Nuevo') {

          if (Response["campos_cab"][x]["TablaCampo"] == "cmptxtsimple") {
            valor_campo = Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["ValorPredeterminado"]

          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpnumsimple") {
            valor_campo = Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Menor"]

          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpnumsecuencial") {
            if (Response["campos_cab"][x]["TablaCampo"].substring(0, 2) == "Pk") {
              valor_campo = 0
            } else {
              valor_campo = Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["ValorInicial"]
            }
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpopcmultiple") {
            valor_campo = Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Valor"]

          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpsistema") {

            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["PkId"] == 2) {
              valor_campo = web_usuario

            }

            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["PkId"] == 1) {
              var now = new Date();
              valor_campo = now.format("Y-m-d") + 'T' + now.format("H:i:s")
            }


          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpformuladetalle") {
            valor_campo = 0
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpfecha") {
            var now = new Date();
            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Tiempo"] == "Y") {
              valor_campo = now.format("Y-m-d") + 'T' + now.format("H:i:s")
            } else {
              valor_campo = now.format("Y-m-d");
            }
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpreferencia") {
            valor_campo = Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["predeterminado_valor"]
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpreferenciaadjunto") {
            valor_campo = 0
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpoperacion") {
            valor_campo = 0
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpconsolidado") {
            valor_campo = 0
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmparchivo") {
            valor_campo = ""
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpnumeroaletras") {
            valor_campo = ""
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpdecabecera") {
            valor_campo = ""
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpelectronico") {
            valor_campo = 0

          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpcondicional") {
            valor_campo = ""

          }
        } else {
          valor_campo = Response["valores_cab"][0][Response["campos_cab"][x]["Nombre"]]

          if (Response["campos_cab"][x]["TablaCampo"] == "cmpfecha") {

            var now = new Date(Response["valores_cab"][0][Response["campos_cab"][x]["Nombre"]]);
            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Tiempo"] == "Y") {
              valor_campo = now.format("Y-m-d") + 'T' + now.format("H:i:s")
            } else {
              valor_campo = now.format("Y-m-d");
            }


          }
        }

        ID_TAG = 'p' + Response["pestalla"] + 'zzz' + Response["campos_cab"][x]["Nombre"] + '';

        if (Response["campos_cab"][x]["Visible"] == "Y") {



          div_c_t = Response["campos_cab"][x]["saltoweb"]
          div_c_t = div_c_t + '<div class="col-sm-' + Response["campos_cab"][x]["largoweb"] + '">'
          div_c_t = div_c_t + '<label class="control-label for="' + Response["campos_cab"][x]["Nombre"] + '" style="font-size: 12px;font-weight: bold;" >' + Response["campos_cab"][x]["Descripcion"] + '</label>'

          if (Response["campos_cab"][x]["TablaCampo"] == "cmptxtsimple") {
            readonly_int = ''
            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Modificable"] == "N") {
              readonly_int = 'readonly="readonly"'
            }
            if (tipo == 'Nuevo') {
              valor_campo = Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["ValorPredeterminado"]
            }
            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Largo"] > 100) {
              div_c_t = div_c_t + '<textarea type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' ' + readonly_int + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 45px;font-size: 11px;">' + valor_campo + '</textarea>'
            } else {
              div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' ' + readonly_int + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 25px;font-size: 11px;">'
            }
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpnumsimple") {

            div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' min="' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Menor"] + '" max="' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Mayor"] + '" onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="text-align: right;height: 25px;font-size: 11px;" onkeypress="return solo_numero(event)">'
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpnumsecuencial") {

            div_c_t = div_c_t + '<input type="number" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" readonly="readonly" style="text-align: right;height: 25px;font-size: 11px;">'
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpopcmultiple") {
            if (tipo != 'consulta') {
              div_c_t = div_c_t + '<select class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" id="' + ID_TAG + '" value="' + valor_campo + '" onchange="guardar_calcular(' + ID_TAG + ' , 0)" style="height: 25px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;">'

              for (z = 0; z < Response["func_cab"][Response["campos_cab"][x]["Nombre"]].length; z++) {

                if (valor_campo == Response["func_cab"][Response["campos_cab"][x]["Nombre"]][z]["Valor"]) {
                  div_c_t = div_c_t + '<option selected value="' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][z]["Valor"] + '">' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][z]["Nombre"] + '</option>'
                } else {
                  div_c_t = div_c_t + '<option value="' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][z]["Valor"] + '">' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][z]["Nombre"] + '</option>'
                }
              }
              div_c_t = div_c_t + '</select>'
            } else {
              div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 25px;font-size: 11px;">'
            }
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpsistema") {
            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["PkId"] == 2) {
              div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" readonly="readonly" style="height: 25px;font-size: 11px;">'
            }

            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["PkId"] == 1) {
              div_c_t = div_c_t + '<input type="datetime-local" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" readonly="readonly" style="height: 25px;font-size: 11px;line-height: 7px;">'
            }
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpformuladetalle") {

            div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" readonly="readonly" onchange="guardar_calcular(' + ID_TAG + ' , 0 )" style="text-align: right;height: 25px;font-size: 11px;">'
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpfecha") {
            tipodato = 'date'

            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Tiempo"] == 'Y') {
              tipodato = 'datetime-local'
            }
            div_c_t = div_c_t + '<input type="' + tipodato + '" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 25px;font-size: 11px;line-height: 7px;">'
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpreferencia") {
            div_c_t = div_c_t + '<div class="input-group input-group-sm" style="width: 100%;">'


            if (tipo != 'consulta') {

              if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["pkmodulo_ingreso"] != 0) {
                div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + (Response["campos_cab"][x]["largoweb"] - 1) + '" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="width: 70%;height: 25px;font-size: 11px;" onkeypress="return runScript(event, ' + ID_TAG + ')" >'
                div_c_t = div_c_t + '<button type="button" class="btn btn-info" data-toggle="modal" data-target=".bs-example-modal-lg" onclick="buscar_referencia_cabecera(' + ID_TAG + ' )"style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></button>'


                div_c_t = div_c_t + '<button type="button" class="btn btn-info"  onclick="registro(' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["pkmodulo_ingreso"] + ',0,0,-1,0,0)" style="height: 25px;padding: 3px 4px;"><i class="fa fa-plus"></i></button>'
              } else {
                div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + (Response["campos_cab"][x]["largoweb"] - 1) + '" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="width: 85%;height: 25px;font-size: 11px;" onkeypress="return runScript(event, ' + ID_TAG + ')" >'
                div_c_t = div_c_t + '<button type="button" class="btn btn-info" data-toggle="modal" data-target=".bs-example-modal-lg" onclick="buscar_referencia_cabecera(' + ID_TAG + ' )"style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></button>'


              }

            } else {
              div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + (Response["campos_cab"][x]["largoweb"] - 1) + '" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 25px;font-size: 11px;" onkeypress="return runScript(event, ' + ID_TAG + ')" >'
              if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["pkmod_consul"] != '0') {
                div_c_t = div_c_t + '<button type="button" class="btn btn-info" onclick="registro(' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["pkmod_consul"] + ', ' + Response["valores_cab"][0][Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["campo_fk"]] + ', 2, -2, 0, 0)" style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;"><span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span></button>'
              }




            }

            div_c_t = div_c_t + '</div>'
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpreferenciaadjunto") {

            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Tipo"] == 'Imagen') {
              div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + '  onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 25px;font-size: 11px;">'

            }
            else {
              Moddato = ''
              if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Modificable"] == 'N') {
                Moddato = 'readonly="readonly"'
              }
              if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Tipo"] == 'Texto') {

                if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Tamano"] == 'G') {

                  div_c_t = div_c_t + '<textarea type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 45px;font-size: 11px;">' + valor_campo + '</textarea>'

                } else {
                  div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 25px;font-size: 11px;">'
                }


              }
              if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Tipo"] == 'Numero') {
                div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="text-align: right;" style="height: 25px;font-size: 11px;" onkeypress="return solo_numero(event)">'

              }
              if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Tipo"] == 'Fecha') {

                div_c_t = div_c_t + '<input type="date" id="' + ID_TAG + '"class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 25px;font-size: 11px;">'
              }
              if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Tipo"] == 'Fecha Tiempo') {

                div_c_t = div_c_t + '<input type="datetime-local" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 25px;font-size: 11px;">'
              }


            }
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpoperacion") {

            div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' onchange="setTwoNumberDecimal(' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Decimales"] + ')" readonly="readonly" onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="text-align: right;height: 25px;font-size: 11px;" >'
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpconsolidado") {

            div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" onchange="guardar_calcular(' + ID_TAG + ', 0)" style="height: 25px;font-size: 11px;">'
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmparchivo") {

            //div_c_t = div_c_t + '<input type="file" id="'+ ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="'+ valor_campo +'" '+ readonly +' style="height: 25px;font-size: 11px;">'
            div_c_t = div_c_t + '<div class="thumbnail" style="height: 160px;margin-bottom: 1px;"><div class="image view view-first"><a id="' + ID_TAG + '_label" href="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" target="_blank" style="font-size: 11px;"><img style="width: 100%;height: 60%;margin-left: auto;margin-right: auto; display: block;" id="' + ID_TAG + '_img" src="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" alt="image" value="' + valor_campo + '">' + valor_campo + '</a>'

            div_c_t = div_c_t + '<label for="' + ID_TAG + '_img_file" class="btn bg-blue btn-flat margin btn-block btn-outlined" style="padding-left: 0px;padding-right: 0px;margin-bottom: 0px;">Cambiar</label>'
            div_c_t = div_c_t + '<input type="file" id="' + ID_TAG + '_img_file" onchange="cambiar_imagen(' + ID_TAG + '_img)" style="display: none"></div></div>'


          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpnumeroaletras") {

            div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpdecabecera") {

            div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpelectronico") {

            div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
          }
          if (Response["campos_cab"][x]["TablaCampo"] == "cmpcondicional") {

            div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="text-align: right;height: 25px;font-size: 11px;">'
          }
          div_c_t = div_c_t + '</div>'


          if (Response["campos_cab"][x]["posicionweb"] == "arriba_izq") {
            div_campos_arriba_izq = div_campos_arriba_izq + div_c_t
          }
          if (Response["campos_cab"][x]["posicionweb"] == "arriba_der") {
            div_campos_arriba_der = div_campos_arriba_der + div_c_t
          }
          if (Response["campos_cab"][x]["posicionweb"] == "abajo_izq") {
            div_campos_abajo_izq = div_campos_abajo_izq + div_c_t
          }
          if (Response["campos_cab"][x]["posicionweb"] == "abajo_der") {
            div_campos_abajo_der = div_campos_abajo_der + div_c_t
          }


        } else {
          div_campos = div_campos + '<input type="hidden" id="' + ID_TAG + '" value="' + valor_campo + '" ' + readonly + '>'
        }


      }
      div_campos = div_campos + '<div class="col-md-6 col-xs-12"> <div class="row">' + div_campos_arriba_izq + '</div></div>'
      div_campos = div_campos + '<div class="col-md-6 col-xs-12"> <div class="row">' + div_campos_arriba_der + '</div></div>'

      div_campos_arriba_der
      $('#rr' + pestalla).append(div_campos);

      document.getElementById('id' + pestalla).click();




      if (typeof (Response["campos_det"]) == "object") {
        var largo_tabla = 0
        for (x = 0; x < Response["campos_det"].length; x++) {
          if (Response["campos_det"][x]["Visible"] == "Y") {
            largo_tabla = largo_tabla + parseFloat(Response["campos_det"][x]["largo"])

          }
        }

        if (tipo == 'consulta') {
          div_campos = '<div id="divtabla' + Response["pestalla"] + '" style="overflow: scroll;overflow-y: auto;padding-top: 20px; height: 100%;"><table id="tabla' + Response["pestalla"] + '" class="table table-striped" style="width: ' + parseInt(largo_tabla) + 'px;overflow-x:auto;font-size: 11px;background: white;"><thead><tr>'
        } else {
          div_campos = '<div id="divtabla' + Response["pestalla"] + '" style="overflow: scroll;overflow-y: auto;padding-top: 20px; height: 100%;"><table id="tabla' + Response["pestalla"] + '" class="table table-striped" style="width: ' + parseInt(largo_tabla) + 'px;overflow-x:auto;font-size: 11px;background: white;"><thead><tr><th style="width: 20px;">'
          div_campos = div_campos + '<div class="row" style="margin-left: 0px;"><button type="button" onclick="mas(' + Response["pestalla"] + ')" class="btn bg-green btn-flat margin" style="padding: 3px 8px;margin-bottom: 0px;margin-top: 0px;">+</button>'
          div_campos = div_campos + '<button type="button" onclick="ampliar(' + Response["pestalla"] + ', this)" class="btn bg-blue btn-flat margin" style="padding: 3px 4px;"><span class="glyphicon glyphicon-resize-small"></span></button></div></th>'
        }


        for (x = 0; x < Response["campos_det"].length; x++) {
          if (Response["campos_det"][x]["Visible"] == "Y") {
            //div_campos = div_campos + '<th class="col-md-' + Response["campos_det"][x]["largoweb"] + '" style="width: ' + Response["campos_det"][x]["largo"] + 'px;">' + Response["campos_det"][x]["Descripcion"] + '</th>'
            div_campos = div_campos + '<th class="col-md-' + Response["campos_det"][x]["largoweb"] + '" style="padding-left: 0px;padding-right: 0px;">' + Response["campos_det"][x]["Descripcion"] + '</th>'
          }
        }
        div_campos = div_campos + '</tr></thead><tbody>'
        var i = 0;
        do {
          if (tipo == 'consulta') {
            div_campos = div_campos + '<tr id="f' + Response["pestalla"] + '-f' + i + '">'
          } else {
            div_campos = div_campos + '<tr id="f' + Response["pestalla"] + '-f' + i + '"><td><div class="row"  style="padding-left: 10px;">'
            div_campos = div_campos + '<button type="button" onclick="menos(' + Response["pestalla"] + ',' + i + ', 0)" class="btn bg-red btn-flat margin" style="padding: 3px 10px;margin-right: 10px;">-</button>'


            div_campos = div_campos + '</div></td>'
          }

          altura_mini = 45

          for (x = 0; x < Response["campos_det"].length; x++) {

            valor_campo = 0;
            if (tipo == 'Nuevo') {

              if (Response["campos_det"][x]["TablaCampo"] == "cmptxtsimple") {
                valor_campo = Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["ValorPredeterminado"]
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpnumsimple") {
                valor_campo = Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Menor"]
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpnumsecuencial") {
                if (Response["campos_det"][x]["TablaCampo"].slice(0, 2) == "Pk") {
                  valor_campo = 0
                } else {
                  valor_campo = Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["ValorInicial"]
                }
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpopcmultiple") {
                valor_campo = Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Valor"]
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpsistema") {
                if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["PkId"] == 2) {
                  valor_campo = web_usuario

                }
                if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["PkId"] == 1) {
                  var now = new Date();
                  valor_campo = now.format("Y-m-d") + 'T' + now.format("H:i:s")
                }
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpformuladetalle") {
                valor_campo = 0
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpfecha") {
                var now = new Date();
                addi = ' AM'
                if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Tiempo"] == "Y") {
                  if (now.format("H") > 11) { addi = ' PM' }
                  valor_campo = now + addi
                } else {
                  valor_campo = now.format("Y-m-d");
                }
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpreferencia") {
                valor_campo = Response["func_det"][Response["campos_det"][x]["Nombre"]][0][0]["predeterminado_valor"]
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpreferenciaadjunto") {
                valor_campo = 0
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpoperacion") {
                valor_campo = 0
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpconsolidado") {
                valor_campo = 0
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpdecabecera") {
                valor_campo = ""
              }
            } else {
              valor_campo = Response["valores_det"][i][Response["campos_det"][x]["Nombre"]]
            }


            if (tipo == 'modificar') {
              if (Response["campos_det"][x]["Modificable"] == 'No') {
                readonly = 'readonly="readonly"'
              } else {
                readonly = ''
              }
            }

            id_tag_detalle = 'pd' + Response["pestalla"] + 'fff' + i + 'ccc' + Response["campos_det"][x]["Nombre"]

            if (Response["campos_det"][x]["Visible"] == "Y") {
              //div_campos = div_campos + '<td><div class="col-sm-' + Response["campos_det"][x]["largoweb"] + '" col-md-' + Response["campos_det"][x]["largoweb"] + '" col-lg-' + Response["campos_det"][x]["largoweb"] + '">'
              div_campos = div_campos + '<td style="padding-left: 0px;padding-right: 5px;"><div style="width: ' + Response["campos_det"][x]["largo"] + 'px;">'

              if (Response["campos_det"][x]["TablaCampo"] == "cmptxtsimple") {
                readonly_int = ''

                if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Modificable"] == "N") {
                  readonly_int = 'readonly="readonly"'
                }
                if (tipo == 'Nuevo') {
                  valor_campo = Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["ValorPredeterminado"]
                }
                if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Largo"] > 100) {
                  div_campos = div_campos + '<textarea type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" ' + readonly_int + ' style="height: ' + altura_mini + 'px;font-size: 11px;">' + valor_campo + '</textarea>'
                } else {
                  div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" ' + readonly_int + ' style="height: 25px;font-size: 11px;">'
                }
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpnumsimple") {

                div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" min="' + Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Menor"] + '" max="' + Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Mayor"] + '" style="text-align: right;height: 25px;font-size: 11px;" onkeypress="return solo_numero(event)">'
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpnumsecuencial") {

                div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" readonly="readonly" onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="text-align: right; height: 25px; font-size: 11px;" onkeypress="return solo_numero(event)">'
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpopcmultiple") {
                if (tipo != 'consulta') {
                  div_campos = div_campos + '<select class="form-control" id="' + id_tag_detalle + '" value="' + valor_campo + '" onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;">'
                  for (z = 0; z < Response["func_det"][Response["campos_det"][x]["Nombre"]].length; z++) {
                    if (valor_campo == Response["func_det"][Response["campos_det"][x]["Nombre"]][z]["Valor"]) {
                      div_campos = div_campos + '<option selected value="' + Response["func_det"][Response["campos_det"][x]["Nombre"]][z]["Valor"] + '">' + Response["func_det"][Response["campos_det"][x]["Nombre"]][z]["Nombre"] + '</option>'
                    } else {
                      div_campos = div_campos + '<option value="' + Response["func_det"][Response["campos_det"][x]["Nombre"]][z]["Valor"] + '">' + Response["func_det"][Response["campos_det"][x]["Nombre"]][z]["Nombre"] + '</option>'
                    }
                  }
                  div_campos = div_campos + '</select>'
                } else {
                  div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;" >'
                }
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpsistema") {
                if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["PkId"] == 2) {
                  div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" readonly="readonly" style="height: 25px;font-size: 11px;">'
                }
                if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["PkId"] == 1) {
                  div_campos = div_campos + '<input type="datetime-local" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" readonly="readonly" onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;line-height: 7px;">'
                }
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpformuladetalle") {

                div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" readonly="readonly" onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;">'
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpfecha") {
                tipodato = 'date'
                if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Tiempo"] == 'Y') {
                  tipodato = 'datetime-local'
                }
                div_campos = div_campos + '<input type="' + tipodato + '" id="' + id_tag_detalle + '"  class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;line-height: 7px;">'
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpreferencia") {

                if (tipo == 'consulta') {
                  div_campos = div_campos + '<div class="input-group" style="width: 100%;"><input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;" onkeypress="return runScript_detalle(event, ' + id_tag_detalle + ')">'
                  div_campos = div_campos + '</div>'
                } else {

                  div_campos = div_campos + '<div class="input-group" style="width: 100%;"><input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="width: 75%;height: 25px;font-size: 11px;" onkeypress="return runScript_detalle(event, ' + id_tag_detalle + ')">'
                  div_campos = div_campos + '<button type="button" class="btn btn-info" data-toggle="modal" data-target=".bs-example-modal-lg" onclick="buscar_referencia_detalle(' + id_tag_detalle + ' )" style="height: 25px;padding: 3px 4px;margin-top: 0px;margin-bottom: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></button></div>'
                }
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpreferenciaadjunto") {
                if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Tipo"] == 'Imagen') {

                  div_campos = div_campos + '<div class="thumbnail" style="height: 160px;margin-bottom: 1px;"><div class="image view view-first"><a id="' + id_tag_detalle + '_label" href="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" target="_blank"><img style="width: 100%;height: 60%;margin-left: auto;margin-right: auto; display: block;" id="' + id_tag_detalle + '_img" src="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" alt="image" value="' + valor_campo + '">' + valor_campo + '</a>'

                  altura_mini = 125

                  if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Modificable"] == 'N') {
                    div_campos = div_campos + '</div></div>'

                  } else {
                    div_campos = div_campos + '<label for="' + id_tag_detalle + '_img_file" class="btn bg-blue btn-flat margin btn-block btn-outlined" style="padding-left: 0px;padding-right: 0px;margin-bottom: 0px;">Cambiar</label>'
                    div_campos = div_campos + '<input type="file" id="' + id_tag_detalle + '_img_file" onchange="cambiar_imagen(' + id_tag_detalle + '_img)" style="display: none"></div></div>'
                  }

                } else {
                  Moddato = ''
                  if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Modificable"] == 'N') {
                    Moddato = 'readonly="readonly"'
                  }
                  if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Tipo"] == 'Texto') {
                    if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Tamano"] == 'G') {
                      div_campos = div_campos + '<textarea type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="font-size: 11px;height: ' + altura_mini + 'px;">' + valor_campo + '</textarea>'
                    } else {
                      div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;">'
                    }

                  }
                  if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Tipo"] == 'Numero') {

                    div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="text-align: right;height: 25px;font-size: 11px;" onkeypress="return solo_numero(event)">'
                  }
                  if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Tipo"] == 'Fecha') {

                    div_campos = div_campos + '<input type="date" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;">'
                  }
                  if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Tipo"] == 'Fecha Tiempo') {

                    div_campos = div_campos + '<input type="datetime-local" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;">'
                  }
                }
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpoperacion") {

                div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="setTwoNumberDecimal(' + Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Decimales"] + ')" readonly="readonly" style="text-align: right;height: 25px;font-size: 11px;"> '
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpconsolidado") {

                div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmparchivo") {

                //div_campos = div_campos + '<input type="file" id="'+id_tag_detalle +'" class="form-control" value="'+ valor_campo +'" '+ readonly +' style="height: 25px;font-size: 11px;">'
                div_campos = div_campos + '<div class="thumbnail" style="height: 160px;margin-bottom: 1px;"><div class="image view view-first"><a id="' + id_tag_detalle + '_label" href="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" target="_blank" style="font-size: 11px;"><img style="width: 100%;height: 60%;margin-left: auto;margin-right: auto; display: block;" id="' + id_tag_detalle + '_img" src="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" alt="image" value="' + valor_campo + '">' + valor_campo + '</a>'

                div_campos = div_campos + '<label for="' + id_tag + '_img_file" class="btn bg-blue btn-flat margin btn-block btn-outlined" style="padding-left: 0px;padding-right: 0px;">Cambiar</label>'
                div_campos = div_campos + '<input type="file" id="' + id_tag + '_img_file" onchange="cambiar_imagen(' + id_tag + '_img)" style="display: none"></div></div>'

              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpnumeroaletras") {

                div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpdecabecera") {

                div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
              }
              if (Response["campos_det"][x]["TablaCampo"] == "cmpelectronico") {

                div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
              }

              div_campos = div_campos + '</div></td>'

            } else {
              div_campos = div_campos + '<input type="hidden" id="' + id_tag_detalle + '" value="' + valor_campo + '" ' + readonly + '>'
            }
          }

          div_campos = div_campos + '</tr>'
          i++;
        } while (i < Response["valores_det"].length);

        cc_porPesta['p-' + pestalla] = (Response["valores_det"].length)
        div_campos = div_campos + '</tbody></table></div>'


        $('#rr' + pestalla).append(div_campos);

        if (Response["valores_det"].length > 3) {
          document.getElementById('divtabla' + Response["pestalla"]).style.height = "500px";

        }

        $('#rr' + pestalla).append('<div class="col-md-6 col-xs-12"> <div class="row">' + div_campos_abajo_izq + '</div></div>');
        $('#rr' + pestalla).append('<div class="col-md-6 col-xs-12"> <div class="row">' + div_campos_abajo_der + '</div></div>');


        document.getElementById('id' + pestalla).click();
      }




      for (z2 = 0; z2 < Response["campos_cab"].length; z2++) {
        if (tipo == 'Nuevo') {
          if (Response["campos_cab"][z2]["TablaCampo"] == "cmpreferencia") {
            if (Response["func_cab"][Response["campos_cab"][z2]["Nombre"]][0][0]["predeterminado_valor"] != '') {
              id_tag = 'p' + pestalla + 'zzz' + Response["campos_cab"][z2]["Nombre"]

              if (Response["func_cab"][Response["campos_cab"][z2]["Nombre"]][0][0]["Tipo_Predeterminado"] == '1') {
                id_tag_detalle_pret = 'p' + pestalla + 'zzz' + Response["func_cab"][Response["campos_cab"][z2]["Nombre"]][0][0]["predeterminado"]
                document.getElementById(id_tag).value = document.getElementById(id_tag_detalle_pret).value
              }
              buscar_referencia_cabecera_enter(document.getElementById(id_tag))
            }
          }
        }
      }

      for (z2 = 0; z2 < Response["campos_det"].length; z2++) {
        if (tipo == 'Nuevo') {
          if (Response["campos_det"][z2]["TablaCampo"] == "cmpreferencia") {
            if (Response["func_det"][Response["campos_det"][z2]["Nombre"]][0][0]["predeterminado_valor"] != '') {
              id_tag_detalle = 'pd' + Response["pestalla"] + 'fff' + 0 + 'ccc' + Response["campos_det"][z2]["Nombre"]
              if (Response["func_det"][Response["campos_det"][z2]["Nombre"]][0][0]["Tipo_Predeterminado"] == '1') {
                id_tag_detalle_pret = 'pd' + Response["pestalla"] + 'fff' + 0 + 'ccc' + Response["func_det"][Response["campos_det"][z2]["Nombre"]][0][0]["predeterminado"]
                document.getElementById(id_tag_detalle).value = document.getElementById(id_tag_detalle_pret).value
              }
              buscar_referencia_detalle_enter(document.getElementById(id_tag_detalle))
            }
          }
        }
      }

    }
  });
}







function runScript(e, campo) {
  //See notes about 'which' and 'key'
  if (e.keyCode == 13) {
    buscar_referencia_cabecera_enter(campo)
  }
  if (e.keyCode == 9) {
    buscar_referencia_cabecera_enter(campo)
  }

}

function runScript_buscador_cab(e, id_campo_busc, pkcampo) {
  //See notes about 'which' and 'key'
  if (e.keyCode == 13) {
    filtrar_buscar(id_campo_busc, pkcampo)
  }
}


function runScript_buscador_rep(e, id_campo_busc, pkcampo) {
  //See notes about 'which' and 'key'
  if (e.keyCode == 13) {
    filtrar_buscar_rep(id_campo_busc, pkcampo)
  }
}

function runScript_buscador_det(e, id_campo_busc, pkcampo) {
  //See notes about 'which' and 'key'
  if (e.keyCode == 13) {
    if(offline == false){
      filtrar_buscar_det(id_campo_busc, pkcampo)
    }else{
      filtrar_buscar_det(id_campo_busc, pkcampo)
    }

  }
}
function runScript_buscador_subdet(e, id_campo_busc, pkcampo) {
  //See notes about 'which' and 'key'
  if (e.keyCode == 13) {
    filtrar_buscar_subdet(id_campo_busc, pkcampo)

  }
}




//function filtrar(PkModulo, eliminar, modifica, pestana_int, tablaDescripcion) {

function filtrar(pestana_int) {

  Response = dict_pestalla['p-' + pestana_int]

  v_where_valor = document.getElementById('valor' + pestana_int).value;
  v_top = document.getElementById('top' + pestana_int).value;
  v_campo = document.getElementById('campo' + pestana_int).value;


  $.ajax({
    type: 'POST',
    url: '/menu_filtro',
    data: { 'fuente': 'filtro', 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'tablaDescripcion': Response["tabla"][0]["Descripcion"], 'pestana_int': pestana_int, 'PkModulo': Response["tabla"][0]["PkModulo"], 'v_tabla': Response["tabla"][0]["Nombre"], 'v_where_valor': v_where_valor, 'eliminar': Response["eliminar"], 'modifica': Response["modifica"], 'v_top': v_top, 'v_campo': v_campo, 'campos': JSON.stringify(Response["names"]), 't_PkEstructura': Response['tabla'][0]['PkEstructura'] },
    success: function (Response) {
      ResFijo = dict_pestalla['p-' + Response["pestana_int"]]

      largo_tablaPX = 0
      for (x = 0; x < Response["dbdatos"][0].length; x++) {
        largo_tablaPX = largo_tablaPX + 150
      }


      new_tab = '<table id="tabla_intera_' + Response["pestana_int"] + '" width="100%" class="table table-bordered bulk_action" style="overflow-x:auto;width: ' + largo_tablaPX + 'px; font-size: 11px;background: white;"><thead><tr><th style="width: 80px;">Acciones</th>'


      for (x = 0; x < Response["dbdatos"][0].length; x++) {

        //new_tab = new_tab +'<th>'+Response["dbdatos"][0][x][0]+'</th>'

        //new_tab = new_tab + '<th><textarea type="text" class="form-control col-sm-8" readonly="readonly" style="height: 25px; font-size: 11px; margin: 0px 43.3125px 7px 0px;max-height: 25px;">' + Response["dbdatos"][0][x][0] + '</textarea></th>'

        new_tab = new_tab + '<th><div class="input-group input-group-sm">'
        if (web_esAdmin == 'Y') {
          new_tab = new_tab + '<button type="button" onclick="admin_listado_posi_dir(0,' + Response["pestana_int"] + ', \'' + Response["dbdatos"][0][x][0] + '\', ' + dict_pestalla['p-' + Response["pestana_int"]]['tabla'][0]['PkEstructura'] + ')" class="btn bg-green btn-flat margin" data-toggle="tooltip" data-placement="top" title="Mover Izquierda" style="padding-left: 0px;padding-right: 0px;margin-bottom: 0px;margin-top: 0px;padding-top: 0px;padding-bottom: 0px;"><i class="fa fa-fw fa-arrow-left"></i></button>'
        }
        new_tab = new_tab + '<textarea type="text" class="form-control col-sm-8" readonly="readonly" style="height: 25px; font-size: 11px; margin: 0px 43.3125px 7px 0px;max-height: 25px;width: ' + parseInt(dict_pestalla['p-' + Response["pestana_int"]]["estru"][x]["largo"]) + 'px;">' + Response["dbdatos"][0][x][0] + '</textarea>'
        if (web_esAdmin == 'Y') {
          new_tab = new_tab + '<button type="button" onclick="admin_listado_posi_dir(1,' + Response["pestana_int"] + ', \'' + Response["dbdatos"][0][x][0] + '\', ' + dict_pestalla['p-' + Response["pestana_int"]]['tabla'][0]['PkEstructura'] + ')" class="btn bg-green btn-flat margin" data-toggle="tooltip" data-placement="top" title="Mover Derecha" style="padding-left: 0px;padding-right: 0px;margin-bottom: 0px;margin-top: 0px;padding-top: 0px;padding-bottom: 0px;"><i class="fa fa-fw fa-arrow-right"></i></button>'
        }
        new_tab = new_tab + '</div></th>'

        dict_pestalla['p-' + Response["pestana_int"]]
      }
      new_tab = new_tab + '</tr></thead><tbody>'

      for (x = 0; x < Response["dbdatos"][1].length; x++) {

        new_tab = new_tab + '<tr id="f' + ResFijo["tabla"][0]["PkModulo"] + '-f' + Response["dbdatos"][1][x][0] + '"><td style="text-align: center;"><div class="row">'

        if (ResFijo["modifica"] == "Si") {
          new_tab = new_tab + '<a class="btn btn-success" onclick="registro(' + ResFijo["tabla"][0]["PkModulo"] + ',' + Response["dbdatos"][1][x][0] + ',1, ' + Response["pestana_int"] + ',0,0)" style="padding: 2px 2px; margin-right: 0px; margin-left: 5px;"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a>'
        }
        if (ResFijo["eliminar"] == "Si") {
          new_tab = new_tab + '<a class="btn btn-danger" onclick="eliminar(' + ResFijo["tabla"][0]["PkModulo"] + ',' + Response["dbdatos"][1][x][0] + ')" style="padding: 2px 2px; margin-right: 0px; margin-left: 0px;"><span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span></a>'
        }

        new_tab = new_tab + '<a class="btn btn-info" onclick="registro(' + ResFijo["tabla"][0]["PkModulo"] + ',' + Response["dbdatos"][1][x][0] + ',2, ' + Response["pestana_int"] + ',0,0)"  style="padding: 2px 2px; margin-right: 0px; margin-left: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></a>'


        for (x2 = 0; x2 < Response["dbdatos"][0].length; x2++) {

          //new_tab = new_tab +'<td>'+Response["dbdatos"][1][x][x2]+'</td>'

          modifica_campo = 'No'
          if (ResFijo["modifica"] == "Si") {
            for (x3 = 1; x3 < ResFijo["estru"].length; x3++) {
              if (ResFijo["estru"][x3]["Nombre"] == Response["dbdatos"][0][x2][0]) {
                if (ResFijo["estru"][x3]["Modificable"] == 'Si') {
                  modifica_campo = 'Si'
                }
              }
            }

            if (modifica_campo == 'Si' && web_esAdmin == 'Y') {
              id_tag_int = 'md' + ResFijo["pestalla"] + 'zzz' + Response["dbdatos"][0][x2][0] + 'jjj' + Response["dbdatos"][1][x][0]
              new_tab = new_tab + '<td><input type="text" id="' + id_tag_int + '" class="form-control" value="' + Response["dbdatos"][1][x][x2] + '" onkeypress="return runScript_modi_fast(event, ' + id_tag_int + ')" style="font-size: 11px; height: 25px;"></td>'
            } else {
              id_tag_int = 'md' + ResFijo["pestalla"] + 'zzz' + Response["dbdatos"][0][x2][0] + 'jjj' + Response["dbdatos"][1][x][0]
              new_tab = new_tab + '<td><input type="text" id="' + id_tag_int + '" class="form-control" value="' + Response["dbdatos"][1][x][x2] + '" readonly="readonly" onkeypress="return runScript_modi_fast(event, ' + id_tag_int + ')" style="font-size: 11px; height: 25px;"></td>'

            }

          } else {
            new_tab = new_tab + '<td><input type="text" class="form-control" value="' + Response["dbdatos"][1][x][x2] + '" readonly="readonly" style="font-size: 11px; height: 25px;"></td>'
          }

        }

        new_tab = new_tab + '</tr>'

      }
      new_tab = new_tab + '</tbody></table>'


      $('#tabla' + Response["pestana_int"]).html(new_tab);

    }
  });
}



function validarCedulaRuc(id){
  valores = [0,0,0,0,0,0,0,0,0]
  //valores = id.split(/(?!$)/u);

  
  valores[0] = parseInt(id[0]) * 2
  if(valores[0]> 9){
    valores[0] = valores[0] - 9
  }
  if(valores[0] > 9){
    valores[0] = valores[0] - 9
  }
  valores[1] = parseInt(id[1]) * 1
  if(valores[1] > 9 ){
    valores[1] = valores[1] - 9
  }
  valores[2] = parseInt(id[2]) * 2
  if(valores[2] > 9 ){
    valores[2] = valores[2] - 9
  }
  valores[3] = parseInt(id[3]) * 1
  if(valores[3] > 9 ){
    valores[3] = valores[3] - 9
  }
  valores[4] = parseInt(id[4]) * 2
  if(valores[4] > 9 ){
    valores[4] = valores[4] - 9
  }
  valores[5] = parseInt(id[5]) * 1
  if(valores[5] > 9 ){
    valores[5] = valores[5] - 9
  }
  valores[6] = parseInt(id[6]) * 2
  if(valores[6] > 9 ){
    valores[6] = valores[6] - 9
  }
  valores[7] = parseInt(id[7]) * 1
  if(valores[7] > 9 ){
    valores[7] = valores[7] - 9
  }
  valores[8] = parseInt(id[8]) * 2
  if(valores[8] > 9 ){
    valores[8] = valores[8] - 9
  }

  valor_total = 0
  for (i = 0; i < 9; i++) {
    valor_total = valor_total + valores[i]
  }

  valor_cabecera = 0
  valor_cabecera = (parseInt(valor_total.toString().substr(0,1))+1) * 10

  valor_cabecera = valor_cabecera - valor_total
  if(valor_cabecera == id[9]){
    return true
  }else{
    if(valor_cabecera == 10 && id[9] == "0"){
      return true
    }else{
      return false
    }
  }
}

function abrir_default_grabando() {
  document.getElementById('a_default_grabando').click()
}



function grabar_elemento(pestana_int, disparador) {
  //esta_grbando = 0


  if (esta_grbando == 0) {
    
    //document.getElementById('divGrabandoMsg').innerHTML = '<p>Calculando</p>'
    esta_grbando = 1
    calcular_0_final(pestana_int)
    //document.getElementById('divGrabandoMsg').innerHTML = document.getElementById('divGrabandoMsg').innerHTML + '<p>Calculando detalle</p>'
    for (zx = 0; zx < (cc_porPesta['p-' + pestana_int] + 1); zx++) {
      for (zy = 0; zy < (ccsub_porPesta['p-' + pestana_int] + 1); zy++) {
        calcular_subdetalle(pestana_int, zy, zx)
      }
      calcular_detalle(pestana_int, zx)
    }

    //document.getElementById('divGrabandoMsg').innerHTML = document.getElementById('divGrabandoMsg').innerHTML + '<p>Calculando Final</p>'
    calcular_0_final(pestana_int)

    //document.getElementById('divGrabandoMsg').innerHTML = document.getElementById('divGrabandoMsg').innerHTML + '<p>Validando</p>'
    valido = verificar_validar_registro(pestana_int)
    if (valido == true) {
      Response = dict_pestalla['p-' + pestana_int]
      viende_calen = 0
      disparador_real = ""
      if (disparador == 0) { disparador_real = "Guardar Registro Nuevo" }
      if (disparador == 1) { disparador_real = "Modificar Registro" }
      if (disparador == 2) {
        disparador_real = "Guardar Registro Nuevo"
        viende_calen = 1
      }
      if (disparador == 3) {
        disparador_real = "Modificar Registro"
        viende_calen = 1
      }

      envio_archi = []
      envio_datset = {}
      array_cab = []
      array_det = []
      array_subdet = []
      autorizacion = [0, 0]
      ingreso_cab = {}
      ingreso_subdet = {}
      tiene_detalle = 'Si'
      electro = ''

      for (x = 0; x < Response["campos_cab"].length; x++) {
        tag_campo = "p" + pestana_int + "zzz" + Response["campos_cab"][x]["Nombre"]

        if (document.getElementById(tag_campo) == null) {
          ingreso_cab[Response["campos_cab"][x]["Nombre"]] = ''
        } else {
          ingreso_cab[Response["campos_cab"][x]["Nombre"]] = document.getElementById(tag_campo).value
        }

        if (Response["campos_cab"][x]["TablaCampo"] == "cmpfecha") {

          var d = new Date(document.getElementById(tag_campo).value)

          if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Tiempo"] == 'N') {
            d.addDays(1)
            month = '' + (d.format('m'))
            day = '' + d.format('d')
            year = d.format('Y')
            ingreso_cab[Response["campos_cab"][x]["Nombre"]] = [year, month, day].join('-');

          } else {
            month = '' + (d.format('m'))
            day = '' + d.format('d')
            year = d.format('Y')
            hora = d.getHours()
            minutos = d.getMinutes()
            segundos = d.getSeconds()
            ingreso_cab[Response["campos_cab"][x]["Nombre"]] = year + '-' + month + '-' + day + ' ' + hora + ':' + minutos + ':' + segundos

          }



        }
        if (Response["campos_cab"][x]["TablaCampo"] == "cmpsistema" && Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["PkId"] == 1) {
          var d = new Date(document.getElementById(tag_campo).value)
          month = '' + (d.format('m'))
          day = '' + d.format('d')
          year = d.format('Y')
          hora = d.getHours()
          minutos = d.getMinutes()
          segundos = d.getSeconds()



          if (hora.length < 2) { hora = '0' + hora }
          if (minutos.length < 2) { minutos = '0' + minutos }
          if (segundos.length < 2) { segundos = '0' + segundos }

          ingreso_cab[Response["campos_cab"][x]["Nombre"]] = year + '-' + month + '-' + day + ' ' + hora + ':' + minutos + ':' + segundos

          //ingreso_cab[Response["campos_cab"][x]["Nombre"]] =  [year, month, day].join('-');
        }
        if (Response["campos_cab"][x]["TablaCampo"] == "cmpreferenciaadjunto") {
          if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Tipo"] == 'Imagen') {
            tag_campo = "p" + pestana_int + "zzz" + Response["campos_cab"][x]["Nombre"] + '_img'
            ingreso_cab[Response["campos_cab"][x]["Nombre"]] = document.getElementById(tag_campo).getAttribute('value')

          }


        }

        if (Response["campos_cab"][x]["TablaCampo"] == "cmparchivo") {
          if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]['Ruta'] == 'Dibujo') {
            tag_campo = "p" + pestana_int + "zzz" + Response["campos_cab"][x]["Nombre"] + "_img"
            if (document.getElementById(tag_campo).value != null) {
              ingreso_cab[Response["campos_cab"][x]["Nombre"]] = document.getElementById(tag_campo).value
            }
          } else {
            tag_campo = "p" + pestana_int + "zzz" + Response["campos_cab"][x]["Nombre"] + "_img_file"
            if (document.getElementById(tag_campo).value != null) {
              if (document.getElementById(tag_campo).value != "") {
                envio_archi.push(tag_campo)
                ingreso_cab[Response["campos_cab"][x]["Nombre"]] = document.getElementById(tag_campo).files[0].name
              } else {
                tag_campo_img = "p" + pestana_int + "zzz" + Response["campos_cab"][x]["Nombre"] + "_img"

                ingreso_cab[Response["campos_cab"][x]["Nombre"]] = document.getElementById(tag_campo_img).getAttribute("value")
              }
            }
          }


        }
        if (Response["campos_cab"][x]["TablaCampo"] == "cmpelectronico") {
          electro = Response["campos_cab"][x]["Nombre"]
        }

      }
      array_cab.push(ingreso_cab)
      envio_datset[Response["tabla_cab"]["Nombre"]] = array_cab
      if (Response["tabla_det"] != 0) {
        for (x = 0; x < (cc_porPesta['p-' + pestana_int] + 1); x++) {
          //for (x = (cc_porPesta['p-' + pestana_int] + 1); x >=0 ; x--) {
          ingreso_det = {}
          if (document.getElementById("pd" + pestana_int + "fff" + x + "ccc" + Response["campos_det"][0]["Nombre"]) != null) {
            for (x2 = 0; x2 < Response["campos_det"].length; x2++) {

              if (Response["campos_det"][x2]["TablaCampo"] == "cmparchivo") {
                tag_campo = "pd" + pestana_int + "fff" + x + "ccc" + Response["campos_det"][x2]["Nombre"]
                ingreso_det[Response["campos_det"][x2]["Nombre"]] = document.getElementById(tag_campo).value

                envio_archi.push(tag_campo)
              } else {
                if (Response["campos_det"][x2]["TablaCampo"] == "cmpreferenciaadjunto" && Response["func_det"][Response["campos_det"][x2]["Nombre"]][0]["Tipo"] == 'Imagen') {
                  tag_campo = "pd" + pestana_int + "fff" + x + "ccc" + Response["campos_det"][x2]["Nombre"] + '_label'
                  tag_campo_file = "pd" + pestana_int + "fff" + x + "ccc" + Response["campos_det"][x2]["Nombre"] + '_img_file'
                  var cc_1 = document.getElementById(tag_campo)
                  var cc_2 = document.getElementById(tag_campo_file)
                  if(cc_2 != null){

                    if (cc_2.files.length > 0) {
                      if (cc_1.innerHTML == cc_2.files[0].name) {
                        ingreso_det[Response["campos_det"][x2]["Nombre"]] = cc_1.text
                      } else {
                        ingreso_det[Response["campos_det"][x2]["Nombre"]] = cc_2.files[0].name
                        envio_archi.push(tag_campo_file)
                      }
                    } else {
                      ingreso_det[Response["campos_det"][x2]["Nombre"]] = cc_1.text
                    }
                  }else{
                    ingreso_det[Response["campos_det"][x2]["Nombre"]] = cc_1.text
                  }

                } else {
                  if (Response["campos_det"][x2]["TablaCampo"] == "cmpformquery") {
                    tag_campo = "pd" + pestana_int + "fff" + x + "ccc" + Response["campos_det"][x2]["Nombre"]
                    var_cambios = document.getElementById(tag_campo).innerHTML
                    var_cambios = var_cambios.replace('&lt;', '<')
                    var_cambios = var_cambios.replace('&gt;', '>')
                    var_cambios = var_cambios.replace("'", '"')
                    ingreso_det[Response["campos_det"][x2]["Nombre"]] = var_cambios
                  } else {
                    tag_campo = "pd" + pestana_int + "fff" + x + "ccc" + Response["campos_det"][x2]["Nombre"]
                    ingreso_det[Response["campos_det"][x2]["Nombre"]] = document.getElementById(tag_campo).value
                  }

                }


              }
            }
            array_det.push(ingreso_det)



            ////////////////////////////////////////////

            if (Response["tabla_subdet"] != 0) {
              for (yx = 0; yx < (ccsub_porPesta['p-' + pestana_int] + 1); yx++) {
                ingreso_subdet = {}
                if (document.getElementById("ps" + pestana_int + "qqq" + yx + "yyy" + x + "www" + Response["campos_subdet"][0]["Nombre"]) != null) {
                  for (yx2 = 0; yx2 < Response["campos_subdet"].length; yx2++) {
                    if (Response["campos_subdet"][yx2]["Nombre"] == 'PKCabecera') {
                      tag_campo = "pd" + pestana_int + "fff" + x + "ccc" + "Pk" + Response["tabla_cab"]["Nombre"] + 'Detalle'
                      ingreso_subdet[Response["campos_subdet"][yx2]["Nombre"]] = document.getElementById(tag_campo).value
                    } else {
                      tag_campo = "ps" + pestana_int + "qqq" + yx + "yyy" + x + "www" + Response["campos_subdet"][yx2]["Nombre"]
                      ingreso_subdet[Response["campos_subdet"][yx2]["Nombre"]] = document.getElementById(tag_campo).value
                    }
                  }
                  array_subdet.push(ingreso_subdet)
                }
              }


            } else {
              ingreso_subdet = 0
            }


            ///////////////////////////////////////////////




          }
        }
        envio_datset[Response["tabla_det"]["Nombre"]] = array_det

      } else {
        tiene_detalle = 'No'
        ingreso_det = 0
      }

      if (Response["tabla_subdet"] != 0) {
        envio_datset[Response["tabla_subdet"]["Nombre"]] = array_subdet
        tiene_subdetalle = 'Si'
      } else {
        tiene_subdetalle = 'No'
        ingreso_subdet = 0
      }

      pestana_pasa_grabar = pestana_int

      if(offline == false){
        for (x2 = 0; x2 < envio_archi.length; x2++) {


          const files = document.getElementById(envio_archi[x2]).files
          const formData = new FormData()
          formData.append('csrfmiddlewaretoken', web_token)
          formData.append('Id_empresa', web_Id_empresa)
          formData.append('id_archivo', envio_archi[x2])
          //formData.append('acceso_id', )


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
          //document.getElementById('divGrabandoMsg').innerHTML = document.getElementById('divGrabandoMsg').innerHTML + '<p>Enviando Archivos</p>'

          fetch('/ccimagenes/', { method: 'POST', headers: headers, body: formData, mode: 'no-cors', }).then(response => {
            console.log(response)

          })

        }
      }
      for (x = 0; x < Response["campos_cab"].length; x++) {
        tag_campo = "p" + pestana_int + "zzz" + Response["campos_cab"][x]["Nombre"]
        if (Response["campos_cab"][x]["TablaCampo"] == "cmpelectronico") {
          nnm_ele = Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]['Nombre']
          if (ingreso_cab[nnm_ele] == 'Sin Autorización' || ingreso_cab[nnm_ele] == '0') {
            ingreso_cab[nnm_ele] = devolver_clave_acceso(pestana_int, Response["campos_cab"][x]["Nombre"], array_cab, array_det)
          }

        }

      }

      div_grab = document.getElementById("div_grabador")
      div_grab.innerHTML = ''
      pre_respuesta = Response
      //document.getElementById('divGrabandoMsg').innerHTML = document.getElementById('divGrabandoMsg').innerHTML + '<p>Enviando a Servidor</p>'

      if(offline == false){
        
        $.ajax({
          type: 'POST',
          url: '/regis_guardar',
          data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'tiene_detalle': tiene_detalle, 'tiene_subdetalle': tiene_subdetalle, 'Id_empresa': web_Id_empresa, 'nom_tabla': Response["tabla_cab"]["Nombre"], 'disparador': disparador_real, 'pkmodulo': Response["tabla_cab"]["PkModulo"], 'array_cab': JSON.stringify(array_cab), 'array_det': JSON.stringify(array_det), 'array_subdet': JSON.stringify(array_subdet), 'usuario': web_usuario, 'campos_cab': JSON.stringify(Response["campos_cab"]), 'campos_det': JSON.stringify(Response["campos_det"]), 'campos_subdet': JSON.stringify(Response["campos_subdet"]), 'envio_datset': JSON.stringify(envio_datset), 'pestalla': pestana_int, 'autorizacion': autorizacion[0], 'clave_acc': autorizacion[1], 'tablaDatos': JSON.stringify(Response["tabla_cab"]) },
          error: function (request, error) {
            if (disparador == '0') {
              var btng = document.getElementById('btn_grabar_' + pestana_int)
              btng.disabled = false
            } else {
              var btng = document.getElementById('btn_mod_' + pestana_int)
              btng.disabled = false
            }
            alert(" Error mostrar a administrador: " + error);
            ingreso_det = 0

          },
          success: function (Response) {

            if (Response["grabo"] == true) {
              if (viende_calen == 1) {
                esta_grbando = 0
                document.getElementById('cerrar_rap_grabando').click()

                click_val(2)
                cerrar_elemento(Response["pestalla"])
                calendario()
                document.getElementById('calendar-tab').click();
                document.getElementById('cerrar_grabar').click();

              } else {
                esta_grbando = 0
                document.getElementById('cerrar_rap_grabando').click()

                click_val(2)
                //viene nuevo y tiene html prinvt se presume puntode venta
                //si viene de nuevo
                if(pre_respuesta["tipo"] == 'Nuevo'){
                  //preguntar si es punto d venta (por plantilla html)
                  if(pre_respuesta["plantilla_html"].length > 0){
                    //se presume punto de venta
                    //vien de nuevo hay que imprimir y nuevo registro
                    pre_respuesta["valores_cab"] = array_cab
                    pre_respuesta["valores_det"] = array_det
            
                    //impimir
                    veces = 1
                    try{
                      veces = parseInt(pre_respuesta["plantilla_html"][0]['veces'])
                    }
                    catch (error) {
                      veces = 1
                      // expected output: ReferenceError: nonExistentFunction is not defined
                      // Note - error messages will vary depending on browser
                    }                    

                    for (cc01 = 0; cc01 < veces; cc01++) {
                      imprimir_elemento(pestana_int, 0)
                    }
                    pre_respuesta["valores_cab"] = []
                    pre_respuesta["valores_det"] = []
                    //manadar a grabr hold
                    //nuevo
                    //registro(Response['tabla_cab']['PkModulo'],0,0,pestana_int,0,0)
                    registro_sin_server(pre_respuesta['tabla_cab']['PkModulo'],0,0,pestana_int,0,0, pre_respuesta, [],[])

                    document.getElementById('id' + pestalla).click();
                    cerrar_elemento(Response["pestalla"])

                  }else{
                    //se presume normalito pdf
                    registro_sin_server(pre_respuesta['tabla_cab']['PkModulo'],Response["pkregistro"],2,pestana_int,1,0, pre_respuesta, array_cab, array_det)
                    document.getElementById('id' + pestalla).click();
                    cerrar_elemento(Response["pestalla"])

                  }

                }else{
                  //es modificar de econsultar lo grabar
                  registro_sin_server(pre_respuesta['tabla_cab']['PkModulo'],Response["pkregistro"],2,pestana_int,1,0, pre_respuesta, array_cab, array_det)
                  document.getElementById('id' + pestalla).click();                   
                  cerrar_elemento(Response["pestalla"])

                } 



              }
            }else{
              mensaje = ''
              for (x2 = 0; x2 < Object.keys(Response["msg"]).length; x2++) {
                mensaje = mensaje + '-' + Object.keys(Response["msg"])[x2] + ': ' + Response["msg"][Object.keys(Response["msg"])[x2]] + '<br>'
              }
              div_grab = document.getElementById("div_grabador")
              alert(mensaje)
              var btng = document.getElementById('btn_grabar_' + pestana_int)
              btng.disabled = false
              esta_grbando = 0
              document.getElementById('cerrar_rap_grabando').click()

              click_val(2)
            }
          } 
        });
      }
      if(offline == true){


        //Alimantar Response["valores_cab"] y Response["valores_det"]
        Response["valores_cab"] = array_cab
        Response["valores_det"] = array_det
        if(tiene_subdetalle == 'Si'){
          Response["valores_subdet"] = array_subdet
        }else{
          Response["valores_subdet"] = 0
        }

        
        esta_grbando = 0
        document.getElementById('cerrar_rap_grabando').click()

        //poner en local storega
        t_id = Math.floor(Math.random() * 10000) + 1;
        data_offline = {}
        data_offline['fuente'] =  $(this).attr("value")

        if(localStorage.getItem('CeroCodigoPendiente') == null){
          localStorage.setItem('CeroCodigoPendiente' , JSON.stringify(['cc_' + t_id]))
          
        }else{
          arraylocal = JSON.parse(localStorage.getItem('CeroCodigoPendiente'))
          arraylocal.push('cc_' + t_id)
          localStorage.setItem('CeroCodigoPendiente' , JSON.stringify(arraylocal))
        }
        localStorage.setItem('cc_' + t_id , JSON.stringify(Response))


        autoccerar_pestana(Response["pestalla"], 20)

        //impimir
        imprimir_elemento(pestana_int, 0)
        Response["valores_cab"] = []
        Response["valores_det"] = []
        //manadar a grabr hold
        cerrar_elemento(pestana_int)

        //nuevo
        registro(Response['tabla_cab']['PkModulo'],0,0,pestana_int,0,0)
        //cerra actual
        busca_enviar(60*10)
      }

    } else {
      if (disparador == '1') {
        var btng = document.getElementById('btn_mod_' + pestana_int)
        btng.disabled = false
        esta_grbando = 0
        document.getElementById('cerrar_rap_grabando').click()

        click_val(2)
      } else {
        var btng = document.getElementById('btn_grabar_' + pestana_int)
        btng.disabled = false
        esta_grbando = 0
        document.getElementById('cerrar_rap_grabando').click()

        click_val(2)
      }
    }

  } else {
    alert("Espere esta terminando de grabar")
    if (disparador == '1') {
      var btng = document.getElementById('btn_mod_' + pestana_int)
      btng.disabled = false
      click_val(2)
    } else {
      var btng = document.getElementById('btn_grabar_' + pestana_int)
      btng.disabled = false
      click_val(2)
    }
  }
}


function eliminar(pkmodulo, pkregistro) {
  var mensaje;
  var opcion = confirm("Desea Eliminar Registro?");
  if (opcion == true) {
    mensaje = "Registro Eliminado";
    $('#f' + pkmodulo + '-f' + pkregistro).remove();

    $.ajax({
      type: 'POST',
      url: '/menu_eliminar',
      data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'pkregistro': pkregistro, 'pkmodulo': pkmodulo, 'usuario': web_usuario },
      success: function (Response) { }
    });
  } else {
    mensaje = "Cancelado";
  }
}





function devolver_str_limte(txt, limite) {
  var devolver = []
  do {

    devolver.push(txt.substring(0, limite))
    txt = txt.substring(limite, txt.length - 1)
  }
  while (txt.length >= limite);
  devolver.push(txt)
  return devolver
}



function devolver_valor_imp(valor, tipo, ext) {
  switch (tipo) {
    case "Color":
      return valor.toString()
    case "Imagen":
      return valor.toString()
    case "Normal":
      return valor.toString()
    case "Fecha":
      var date = new Date(valor)
      switch (ext) {
        case "Dia":
          return date.format('d')
        case "Mes":
          return date.format('m')
        case "Anio":
          return date.format('Y')
        case "Letras_larga":
          switch (date.format('m')) {
            case '01':
              return date.format('d') + " de Enero del " + date.format('Y')
            case '02':
              return date.format('d') + " de Febrero del " + date.format('Y')
            case '03':
              return date.format('d') + " de Marzo del " + date.format('Y')
            case '04':
              return date.format('d') + " de Abril del " + date.format('Y')
            case '05':
              return date.format('d') + " de Mayo del " + date.format('Y')
            case '06':
              return date.format('d') + " de Junio del " + date.format('Y')
            case '07':
              return date.format('d') + " de Julio del " + date.format('Y')
            case '08':
              return date.format('d') + " de Agosto del " + date.format('Y')
            case '09':
              return date.format('d') + " de Septiembre del " + date.format('Y')
            case '10':
              return date.format('d') + " de Octubre del " + date.format('Y')
            case '11':
              return date.format('d') + " de Noviembre del " + date.format('Y')
            case '12':
              return date.format('d') + " de Diciembre del " + date.format('Y')
          }
        case "Letras":
          switch (date.format('m')) {
            case '01':
              return date.format('Y') + " Enero " + date.format('d')
            case '02':
              return date.format('Y') + " Febrero " + date.format('d')
            case '03':
              return date.format('Y') + " Marzo " + date.format('d')
            case '04':
              return date.format('Y') + " Abril " + date.format('d')
            case '05':
              return date.format('Y') + " Mayo " + date.format('d')
            case '06':
              return date.format('Y') + " Junio " + date.format('d')
            case '07':
              return date.format('Y') + " Julio " + date.format('d')
            case '08':
              return date.format('Y') + " Agosto " + date.format('d')
            case '09':
              return date.format('Y') + " Septiembre " + date.format('d')
            case '10':
              return date.format('Y') + " Octubre " + date.format('d')
            case '11':
              return date.format('Y') + " Noviembre " + date.format('d')
            case '12':
              return date.format('Y') + " Diciembre " + date.format('d')
          }
        case "Normal":
          return valor.toString()
        case "DDMMAAAA":
          return date.format('d') + date.format('m') + date.format('Y')
        case "LetrasMayusculas":
          switch (date.format('m')) {
            case 1:
              return date.format('Y') + " ENERO " + date.format('d')
            case 2:
              return date.format('Y') + " FEBRERO " + date.format('d')
            case 3:
              return date.format('Y') + " MARZO " + date.format('d')
            case 4:
              return date.format('Y') + " ABRIL " + date.format('d')
            case 5:
              return date.format('Y') + " MAYO " + date.format('d')
            case 6:
              return date.format('Y') + " JUNIO " + date.format('d')
            case 7:
              return date.format('Y') + " JULIO " + date.format('d')
            case 8:
              return date.format('Y') + " AGOSTO " + date.format('d')
            case 9:
              return date.format('Y') + " SEPTIEMBRE " + date.format('d')
            case 10:
              return date.format('Y') + " OCTUBRE " + date.format('d')
            case 11:
              return date.format('Y') + " NOVIEMBRE " + date.format('d')
            case 12:
              return date.format('Y') + " DICIEMBRE " + date.format('d')
          }
        case "Cheque":
          return date.format('d') + "/" + date.format('m') + "/" + date.format('Y')
        default:
          return valor.toString()
      }
    case "Derecha":
      var num = parseFloat(valor)
      switch (ext) {
        case "Letras":
          return valor.toString()
        case "Normal":
          return num.toString()
        case "Numero":
          return num.toString()
        case "Miles":
          return formatMoney(num, ",", ".");
        case "Dolar":
          return '$ ' + formatMoney(num, ",", ".");
        case "Euro":
          return '€ ' + formatMoney(num, ".", ",");
        case "Porcentaje":
          return (num / 100) + '%'
        case "Porcentaje_full":
          return (num) + '%'
        default:
          return num.toString()
      }
    case "Numero":
      var num = parseFloat(valor)
      switch (ext) {
        case "Numero":
          return num.toString()
        case "Miles":
          return formatMoney(num, ",", ".");
        case "Dolar":
          return '$ ' + formatMoney(num, ",", ".");
        case "Euro":
          return '€ ' + formatMoney(num, ".", ",");
        case "Porcentaje":
          return (num / 100) + '%'
        case "Porcentaje_full":
          return (num) + '%'
        default:
          return num.toString()
      }
    case "CerosFijos":
      return valor.toString()
    default:
  }
}

function formatMoney(n, c, d, t) {
  var c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "," : t,
    s = n < 0 ? "-" : "",
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
    j = (j = i.length) > 3 ? j % 3 : 0;

  return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}


function cambiar_imagen(id) {

  var reader = new FileReader();

  reader.onload = function (e) {
    document.getElementById(id.id).src = e.target.result
    $(id.id).attr('src', e.target.result);
    window.cambio_img = 1
    tt_id = id.id
    tt_id = tt_id.replace('_img', '_label')
    label = document.getElementById(tt_id)
    filename =  document.getElementById(id.id + '_file').files[0].name
    filename = filename.replace(/Ñ/g, 'n')
    filename = filename.replace(/ñ/g, 'n')
    filename = filename.replace(/á/g, 'a')
    filename = filename.replace(/é/g, 'e')
    filename = filename.replace(/í/g, 'i')
    filename = filename.replace(/ó/g, 'o')
    filename = filename.replace(/ú/g, 'u')
    
    //label.innerHTML = '<a href="/media/archivos/' + web_Id_empresa + '/' + document.getElementById(id.id + '_file').files[0].name + '" target="_blank"><img id="' + id.id + '" style="width: 80%;height: 80px;margin-left: auto;margin-right: auto; display: block;" src="/media/archivos/' + web_Id_empresa + '/' + document.getElementById(id.id + '_file').files[0].name + '" alt="image">' + document.getElementById(id.id + '_file').files[0].name + '</a>'
    label.innerHTML = '<a href="/media/archivos/' + web_Id_empresa + '/' + filename + '" target="_blank"><img id="' + id.id + '" style="width: 80%;height: 80px;margin-left: auto;margin-right: auto; display: block;" src="/media/archivos/' + web_Id_empresa + '/' + filename + '" alt="image">' + filename + '</a>'


    //const files = document.getElementById(envio_archi[x2]).files
    const files = document.getElementById(id.id + '_file').files
    const formData = new FormData()
    formData.append('csrfmiddlewaretoken', web_token)
    formData.append('Id_empresa', web_Id_empresa)
    formData.append('id_archivo', filename)
    //formData.append('id_archivo', document.getElementById(id.id + '_file').files[0].name)

    for (let i = 0; i < files.length; i++) {
      let file = files[i]

      formData.append('files', file)
    }

    //fetch('/archi_carg', { method: 'POST', body: formData, }).then(response => {
    //  console.log(response)
    //  const ele_imagen = document.getElementById(id.id + '_file').files
    //  ele_imagen.attr('src', '/media/archivos/' + web_Id_empresa + '/' + document.getElementById(id.id + '_file').files[0].name);


    //})
    let headers = new Headers();


    headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1');
    headers.append('Access-Control-Allow-Methods', 'POST');
    headers.append('Access-Control-Allow-Credentials', 'true');
    headers.append('Access-Control-Allow-Headers', 'Content-Type');

    fetch('/ccimagenes/', { method: 'POST', headers: headers, body: formData, mode: 'no-cors', }).then(response => {
      console.log(response)
      const ele_imagen = document.getElementById(id.id + '_file').files
      div_imagen = document.getElementById(id.id)
      div_imagen.src = '/media/archivos/' + web_Id_empresa + '/' + document.getElementById(id.id + '_file').files[0].name
      //ele_imagen.attr('src', '/media/archivos/' + web_Id_empresa + '/' + document.getElementById(id.id + '_file').files[0].name);


    })


  }

  reader.readAsDataURL(document.getElementById(id.id + '_file').files[0]);

}

calendario_val = {}
respuesta_calendario = {}
id_por_fecha = {}
calendario_fechas = {}








function eliminar_error(tpk_modulo, tpkregistro) {

  $.ajax({
    type: "POST",
    url: '/eliminar_error',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'tpk_modulo': tpk_modulo, 'tpkregistro': tpkregistro },
    success: function (data) {
      var trs = document.getElementById('err_fila_' + tpk_modulo + '_' + tpkregistro)
      trs.remove()


      var dd = document.getElementById('div_errores')

      dd.innerHTML = parseInt(dd.innerHTML) - 1



    }

  });

}
function traer_facturas_cerocodigo() {

  $.ajax({
    type: "POST",
    url: '/al_facturas_cerocodigo',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma },
    success: function (data) {
      conta_todo = 0
      html_alertas = ''




      html_alertas = html_alertas + '<table id="datatable-checkbox" width="100%;font-size: 11px;" class="table table-bordered bulk_action" style="background-color: white;overflow-x:auto;width: 800px; font-size: 14px;">'
      html_alertas = html_alertas + '<thead><tr><th style="width: 80px;">Acciones</th><th style="width: 100px;">Error</th><th style="width: 100px;">Descartar</th></thead>'
      html_alertas = html_alertas + '<tbody>'

      for (aa = 0; aa <= data["all_erroes"].length - 1; aa++) {

        html_alertas = html_alertas + '<tr id="err_fila_' + data["all_erroes"][aa]["modulo"] + '_' + data["all_erroes"][aa]["pk"] + '">'



        html_alertas = html_alertas + '<td>' + '<a class="btn btn-info" onclick="registro(' + data["all_erroes"][aa]["modulo"] + ',' + data["all_erroes"][aa]["pk"] + ',2, -1,0,0)" style="padding: 2px 2px; margin-right: 0px; margin-left: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"  data-dismiss="modal"></span></td>'
        html_alertas = html_alertas + '<td>' + data["all_erroes"][aa]["error"] + '</td>'
        html_alertas = html_alertas + '<td>' + '<div class="checkbox"><label><input type="checkbox" onchange="eliminar_error(' + data["all_erroes"][aa]["modulo"] + ',' + data["all_erroes"][aa]["pk"] + ')"><span class="checkbox-material"><span class="check"></span></span></label></div>' + '</td>'

        html_alertas = html_alertas + '</tr>'









      }
      html_alertas = html_alertas + '</tbody></table>'

      //html_alertas = html_alertas + '<li><div class="text-center"><a onclick="traer_alertas()" style="cursor: pointer;color: darkslateblue;"><strong><i class="fa fa-retweet"></i> Actualizar</strong></a></div></li>'

      var dd = document.getElementById('div_modal_errores')

      dd.innerHTML = html_alertas

      var dd = document.getElementById('div_errores')

      dd.innerHTML = +data["all_erroes"].length

      //if(data["all_erroes"].length > 0){
      //  dd.innerHTML = '<span class="label label-danger" id="val_errores">'+data["all_erroes"].length+'</span>'

      //}else{
      //  dd.innerHTML = '<span class="label label-success" id="val_errores">0</span>'
      //}

      //setTimeout(traer_alertas, 1800000);
    }
  });

}

function traer_errores() {

  $.ajax({
    type: "POST",
    url: '/al_errores',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma },
    success: function (data) {
      conta_todo = 0
      html_alertas = ''




      html_alertas = html_alertas + '<table id="datatable-checkbox" width="100%;font-size: 11px;" class="table table-bordered bulk_action" style="background-color: white;overflow-x:auto;width: 800px; font-size: 14px;">'
      html_alertas = html_alertas + '<thead><tr><th style="width: 80px;">Acciones</th><th style="width: 100px;">Error</th><th style="width: 100px;">Descartar</th></thead>'
      html_alertas = html_alertas + '<tbody>'

      for (aa = 0; aa <= data["all_erroes"].length - 1; aa++) {

        html_alertas = html_alertas + '<tr id="err_fila_' + data["all_erroes"][aa]["modulo"] + '_' + data["all_erroes"][aa]["pk"] + '">'



        html_alertas = html_alertas + '<td>' + '<a class="btn btn-info" onclick="registro(' + data["all_erroes"][aa]["modulo"] + ',' + data["all_erroes"][aa]["pk"] + ',2, -1,0,0)" style="padding: 2px 2px; margin-right: 0px; margin-left: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"  data-dismiss="modal"></span></td>'
        html_alertas = html_alertas + '<td>' + data["all_erroes"][aa]["error"] + '</td>'
        html_alertas = html_alertas + '<td>' + '<div class="checkbox"><label><input type="checkbox" onchange="eliminar_error(' + data["all_erroes"][aa]["modulo"] + ',' + data["all_erroes"][aa]["pk"] + ')"><span class="checkbox-material"><span class="check"></span></span></label></div>' + '</td>'

        html_alertas = html_alertas + '</tr>'









      }
      html_alertas = html_alertas + '</tbody></table>'

      //html_alertas = html_alertas + '<li><div class="text-center"><a onclick="traer_alertas()" style="cursor: pointer;color: darkslateblue;"><strong><i class="fa fa-retweet"></i> Actualizar</strong></a></div></li>'

      var dd = document.getElementById('div_modal_errores')

      dd.innerHTML = html_alertas

      var dd = document.getElementById('div_errores')

      dd.innerHTML = +data["all_erroes"].length

      //if(data["all_erroes"].length > 0){
      //  dd.innerHTML = '<span class="label label-danger" id="val_errores">'+data["all_erroes"].length+'</span>'

      //}else{
      //  dd.innerHTML = '<span class="label label-success" id="val_errores">0</span>'
      //}

      //setTimeout(traer_alertas, 1800000);
    }
  });

}

function traer_alertas() {

  $.ajax({
    type: "POST",
    url: '/alertas',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma },
    success: function (data) {
      conta_todo = 0
      html_alertas = ''
      for (aa = 0; aa <= data["alertas"].length - 1; aa++) {
        for (aa2 = 0; aa2 <= data["alertas"][aa]["val"].length - 1; aa2++) {
          html_alertas = html_alertas + '<li onclick="ver_alertas(' + data["alertas"][aa]['val'][aa2]["a_pkmodulo"] + ', ' + data["alertas"][aa]['val'][aa2]["a_pkregistro"] + ')"><a style="cursor: pointer;color: darkslateblue;"><span><i class="' + data["alertas"][aa]["acc"]["logo"] + '"></i> </span><span> ' + data["alertas"][aa]["acc"]["t_campo"] + '</span><span class="time">' + data["alertas"][aa]['val'][aa2][data["alertas"][aa]["acc"]["t_campo"]] + '</span><span class="message" style="text-align: center;">' + data["alertas"][aa]['val'][aa2][data["alertas"][aa]["acc"]["val_msg"]] + '</span></a></li>'
          conta_todo = conta_todo + 1
        }
      }
      html_alertas = html_alertas + '<li><div class="text-center"><a onclick="traer_alertas()" style="cursor: pointer;color: darkslateblue;"><strong><i class="fa fa-retweet"></i> Actualizar</strong></a></div></li>'

      var dd = document.getElementById('menu1')

      dd.innerHTML = html_alertas

      var dd = document.getElementById('val_alerta')
      dd.innerHTML = conta_todo

      //setTimeout(traer_alertas, 1800000);
    }
  });

}

function traer_mensajes() {

  $.ajax({
    type: "POST",
    url: '/mensajes',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma },
    success: function (data) {
      conta_todoa = 0
      html_msg = ''
      for (aa = 0; aa <= data["list_mensajes"].length - 1; aa++) {
        id = 'li_notapk' + aa + 'zbz' + data["list_mensajes"][aa]['pk'] + 'zbz' + data["list_mensajes"][aa]['origen']

        if (data["list_mensajes"][aa]['origen'] == 'CCtarea') {

          html_msg = html_msg + '<li id="li_notapk' + aa + 'zbz' + data["list_mensajes"][aa]['pk'] + 'zbz' + data["list_mensajes"][aa]['origen'] + '"><a style="cursor: pointer;color: darkslateblue;" data-toggle="modal" data-target="#modal-default_alertas" onclick="abrir_tareas_d_msg(' + data["list_mensajes"][aa]['pk'] + ',1)"><i class="fa fa-warning text-yellow"></i> En ' + data["list_mensajes"][aa]['origen'] + ', De: ' + data["list_mensajes"][aa]['usuario'] + ' </a></li>'
        } else {
          html_msg = html_msg + '<li id="li_notapk' + aa + 'zbz' + data["list_mensajes"][aa]['pk'] + 'zbz' + data["list_mensajes"][aa]['origen'] + '"><a style="cursor: pointer;color: darkslateblue;" data-toggle="modal" data-target="#modal-default" onclick="abrir_nota(' + id + ',' + data["list_mensajes"][aa]['pkmodulo'] + ')"><i class="fa fa-warning text-yellow"></i> En ' + data["list_mensajes"][aa]['origen'] + ', De: ' + data["list_mensajes"][aa]['usuario'] + ' </a></li>'
        }

        conta_todoa = conta_todoa + 1
      }
      html_msg = html_msg + '<li><div class="text-center"><a onclick="traer_mensajes()" style="cursor: pointer;color: darkslateblue;"><strong><i class="fa fa-retweet"></i> Actualizar</strong></a></div></li>'

      var dd = document.getElementById('menu2')

      dd.innerHTML = html_msg

      var dd = document.getElementById('val_msg')
      dd.innerHTML = conta_todoa

      //setTimeout(traer_mensajes, 1800000);
    }
  });

}
function traer_tareas() {

  $.ajax({
    type: "POST",
    url: '/tareas',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma },
    success: function (data) {
      conta_todo_env = 0
      html_tar_env = ''
      conta_todo_rec = 0
      html_tar_rec = ''
      count_tar = 0
      for (aa = 0; aa <= data["list_tareas"].length - 1; aa++) {
        tar_completas = 0
        tar_metas = 0
        user_destino = []
        for (a2 = 0; a2 <= data["List_subtareas"].length - 1; a2++) {
          if (data["list_tareas"][aa]['pk'] == data["List_subtareas"][a2]['pktarea']) {
            user_destino.push(data["List_subtareas"][a2]['user_destino'])
            if (data["List_subtareas"][a2]['estado'] == '1') {
              tar_completas = tar_completas + 1
            }
            tar_metas = tar_metas + 1

          }
        }
        completado = parseInt(parseFloat((tar_completas / tar_metas) * 100))

        html_tar = '<li style="padding-right: 10px;"><p style="cursor: pointer;color: darkslateblue;" data-toggle="modal" data-target="#modal-default_alertas" onclick="abrir_tareas(' + data["list_tareas"][aa]['pk'] + ')">' + data["list_tareas"][aa]['tarea'] + ' - ' + data["list_tareas"][aa]['proyecto'] + '<small class="pull-right">' + completado + '%</small></p><div class="progress xs"><div class="progress-bar progress-bar-aqua" style="width: ' + completado + '%" role="progressbar" aria-valuenow="' + completado + '" aria-valuemin="0" aria-valuemax="100"><span class="sr-only">' + completado + '%" completado</span></div></div><div class="ripple-container"></div></li>'

        if (data["list_tareas"][aa]['usuario'].toLocaleLowerCase() == (web_usuario).toLocaleLowerCase()) {

          html_tar = '<li style="padding-right: 10px;"><p style="cursor: pointer;color: darkslateblue;" data-toggle="modal" data-target="#modal-default_alertas" onclick="abrir_tareas(' + data["list_tareas"][aa]['pk'] + ',0)">' + data["list_tareas"][aa]['tarea'] + ' - ' + data["list_tareas"][aa]['proyecto'] + '<small class="pull-right">' + completado + '%</small></p><div class="progress xs"><div class="progress-bar progress-bar-aqua" style="width: ' + completado + '%" role="progressbar" aria-valuenow="' + completado + '" aria-valuemin="0" aria-valuemax="100"><span class="sr-only">' + completado + '%" completado</span></div></div><div class="ripple-container"></div></li>'

          conta_todo_env = conta_todo_env + 1
          html_tar_env = html_tar_env + html_tar
        }

        for (zz = 0; zz <= user_destino.length - 1; zz++) {

          if (user_destino[zz].toLocaleLowerCase() == (web_usuario).toLocaleLowerCase()) {

            html_tar = '<li style="padding-right: 10px;"><p style="cursor: pointer;color: darkslateblue;" data-toggle="modal" data-target="#modal-default_alertas" onclick="abrir_tareas(' + data["list_tareas"][aa]['pk'] + ',1)">' + data["list_tareas"][aa]['tarea'] + ' - ' + data["list_tareas"][aa]['proyecto'] + '<small class="pull-right">' + completado + '%</small></p><div class="progress xs"><div class="progress-bar progress-bar-aqua" style="width: ' + completado + '%" role="progressbar" aria-valuenow="' + completado + '" aria-valuemin="0" aria-valuemax="100"><span class="sr-only">' + completado + '%" completado</span></div></div><div class="ripple-container"></div></li>'



            conta_todo_rec = conta_todo_rec + 1
            html_tar_rec = html_tar_rec + html_tar
            count_tar = count_tar + 1
            break
          }
        }

      }

      var dd = document.getElementById('menu_tar_re')

      dd.innerHTML = html_tar_rec

      var dd = document.getElementById('menu_tar_en')

      dd.innerHTML = html_tar_env

      var dd = document.getElementById('tar_banner')

      dd.innerHTML = count_tar



      //setTimeout(traer_tareas, 1800000);
    }
  });

}




var tar_ln = 0
function add_sub_tarea_new(pksubtarea) {

  var tar_text = document.getElementById("new_subtar")
  var tar_resp = document.getElementById("txt_tar_user")
  var tar_area = document.getElementById("txt_tar_area")
  var tar_fecha_ini = document.getElementById("txt_tar_fecha_inicio")
  var tar_fecha_ent = document.getElementById("txt_tar_fecha_entre")
  var v_fecha_ini = new Date(tar_fecha_ini.value);
  var v_fecha_ent = new Date(tar_fecha_ent.value);
  v_fecha_ini.addDays(1)
  v_fecha_ent.addDays(1)
  tar_ln = tar_ln + 1
  if (v_fecha_ini == 'Invalid Date') {
    v_fecha_ini = new Date(web_fecha);
    v_fecha_ini.addDays(1)

  }
  if (v_fecha_ent == 'Invalid Date') {
    v_fecha_ent = new Date(web_fecha);
    v_fecha_ent.addDays(1)
  }

  $('#tabla_tareas').append('<tr style="text-align: center;" id="sub_tar_nu_' + tar_ln + '"><td><a class="btn btn-danger" onclick="eliminar_tarea_nodb(' + tar_ln + ')" style="padding: 2px 2px; margin-right: 0px; margin-left: 0px;"><span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span></a></td><td>' + tar_text.value + '</td><td valign="middle">' + tar_resp.value + '</td><td>' + tar_area.value + '</td><td>' + v_fecha_ini.format('Y-m-d') + '</td><td>' + v_fecha_ent.format('Y-m-d') + '</td><td><div class="checkbox"><label><input type="checkbox"><span class="checkbox-material"><span class="check"></span></span></label></div></td><td><div class="checkbox"><label><input type="checkbox"><span class="checkbox-material"><span class="check"></span></span></label></div></td></tr>');

}

function tar_adjuntar() {
  var tar_adj_pk = document.getElementById("tar_adj_pk")
  var tar_adj_url = document.getElementById("tar_adj_url")
  var tar_adj_nom = document.getElementById("tar_adj_nom")
  if (tar_adj_pk.value == '') {
    alert("Falta Tarea")
  }
  if (tar_adj_url.value == '') {
    alert("Falta Url")
  }
  if (tar_adj_nom.value == '') {
    alert("Falta Nombre")
  }


  $.ajax({
    type: "POST",
    url: '/add_file_sub_tarea',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'tar_adj_pk': tar_adj_pk.value, 'tar_adj_url': tar_adj_url.value, 'tar_adj_nom': tar_adj_nom.value },
    success: function (data) {
      if (data['ok'] == 1) {
        alert('bien')
        var d = document.getElementById('cerrar_tar')
        d.click()
      }




    }
  });



}

function abrir_tareas_d_msg(pktarea, fuente) {

  $.ajax({
    type: "POST",
    url: '/tareas_ind_msg',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'pktarea': pktarea },
    success: function (data) {
      html_tar = ''
      html_tar_indi = ''
      tar_completas = 0
      tar_metas = 0
      html_select_file = ''

      for (a2 = 0; a2 <= data["List_subtareas"].length - 1; a2++) {
        if (data["list_tareas"][0]["usuario"] == web_usuario) {
          html_select_file = html_select_file + '<option value="' + data["List_subtareas"][a2]['pk'] + '">' + data["List_subtareas"][a2]['tarea'] + '</option>'
          if (data["list_tareas"][0]["usuario"] == web_usuario) {
            html_tar_indi = html_tar_indi + '<tr style="text-align: center;" id="subtar_' + data["List_subtareas"][a2]['pk'] + '"><td><a class="btn btn-danger" onclick="eliminar_tarea(' + data["List_subtareas"][a2]['pk'] + ')" style="padding: 2px 2px; margin-right: 0px; margin-left: 0px;"><span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span></a></td><td>' + data["List_subtareas"][a2]['tarea'] + '</td><td valign="middle">' + data["List_subtareas"][a2]['user_destino'] + '</td><td>' + data["List_subtareas"][a2]['area'] + '</td><td>' + data["List_subtareas"][a2]['fecha'] + '</td>'
          } else {
            html_tar_indi = html_tar_indi + '<tr style="text-align: center;" id="subtar_' + data["List_subtareas"][a2]['pk'] + '"><td></td><td>' + data["List_subtareas"][a2]['tarea'] + '</td><td valign="middle">' + data["List_subtareas"][a2]['user_destino'] + '</td><td>' + data["List_subtareas"][a2]['area'] + '</td><td>' + data["List_subtareas"][a2]['fecha'] + '</td>'

          }

          html_tar_indi = html_tar_indi + '<td>'
          for (var xz = data["List_files"].length - 1; xz >= 0; xz--) {
            if (data["List_files"][xz]['pktar'] == data["List_subtareas"][a2]['pk']) {
              html_tar_indi = html_tar_indi + '<a href="' + data["List_files"][xz]['url'] + '" target="_blank">' + data["List_files"][xz]['nombre'] + '</a><br>'

            }
          }
          html_tar_indi = html_tar_indi + '</td>'


          if (data["List_subtareas"][a2]['estado'] == '1') {
            tar_completas = tar_completas + 1
            html_tar_indi = html_tar_indi + '<td><div class="checkbox"><label><input type="checkbox" checked onclick="tareas_cambio_estado(this,' + data["List_subtareas"][a2]['pk'] + ')"><span class="checkbox-material"><span class="check"></span></span></label></div></td>'

          } else {
            html_tar_indi = html_tar_indi + '<td><div class="checkbox"><label><input type="checkbox" onclick="tareas_cambio_estado(this,' + data["List_subtareas"][a2]['pk'] + ')"><span class="checkbox-material"><span class="check"></span></span></label></div></td>'
          }
          if (data["List_subtareas"][a2]['aprovado'] == '1') {
            html_tar_indi = html_tar_indi + '<td><div class="checkbox"><label><input type="checkbox" checked onclick="tareas_cambio_aprovado(this,' + data["List_subtareas"][a2]['pk'] + ')"><span class="checkbox-material"><span class="check"></span></span></label></div></td>'

          } else {
            html_tar_indi = html_tar_indi + '<td><div class="checkbox"><label><input type="checkbox" onclick="tareas_cambio_aprovado(this,' + data["List_subtareas"][a2]['pk'] + ')"><span class="checkbox-material"><span class="check"></span></span></label></div></td>'
          }


          tar_metas = tar_metas + 1
          html_tar_indi = html_tar_indi + '</tr>'
        } else {
          if (data["List_subtareas"][a2]['user_destino'].toLocaleLowerCase() == (web_usuario).toLocaleLowerCase()) {
            html_select_file = html_select_file + '<option value="' + data["List_subtareas"][a2]['pk'] + '">' + data["List_subtareas"][a2]['tarea'] + '</option>'

            html_tar_indi = html_tar_indi + '<tr style="text-align: center;"><td>' + data["List_subtareas"][a2]['tarea'] + '</td><td valign="middle">' + data["List_subtareas"][a2]['user_destino'] + '</td><td>' + data["List_subtareas"][a2]['area'] + '</td><td>' + data["List_subtareas"][a2]['fecha'] + '</td>'
            html_tar_indi = html_tar_indi + '<td>'
            for (var xz = data["List_files"].length - 1; xz >= 0; xz--) {
              if (data["List_files"][xz]['pktar'] == data["List_subtareas"][a2]['pk']) {
                html_tar_indi = html_tar_indi + '<a href="' + data["List_files"][xz]['url'] + '" target="_blank">' + data["List_files"][xz]['nombre'] + '</a><br>'

              }
            }
            html_tar_indi = html_tar_indi + '</td>'

            if (data["List_subtareas"][a2]['estado'] == '1') {
              html_tar_indi = html_tar_indi + '<td><div class="checkbox"><label><input type="checkbox" checked onclick="tareas_cambio_estado(this,' + data["List_subtareas"][a2]['pk'] + ')"><span class="checkbox-material"><span class="check"></span></span></label></div></td>'

            } else {
              html_tar_indi = html_tar_indi + '<td><div class="checkbox"><label><input type="checkbox" onclick="tareas_cambio_estado(this,' + data["List_subtareas"][a2]['pk'] + ')"><span class="checkbox-material"><span class="check"></span></span></label></div></td>'
            }
            if (data["List_subtareas"][a2]['aprovado'] == '1') {
              html_tar_indi = html_tar_indi + '<td><div class="checkbox"><label><input type="checkbox" checked onclick="tareas_cambio_aprovado(this,' + data["List_subtareas"][a2]['pk'] + ')"><span class="checkbox-material"><span class="check"></span></span></label></div></td>'

            } else {
              html_tar_indi = html_tar_indi + '<td><div class="checkbox"><label><input type="checkbox" onclick="tareas_cambio_aprovado(this,' + data["List_subtareas"][a2]['pk'] + ')"><span class="checkbox-material"><span class="check"></span></span></label></div></td>'
            }
            html_tar_indi = html_tar_indi + '</tr>'
          }
        }
      }
      if (data["list_tareas"][0]["usuario"] == web_usuario) {
        completado = parseInt(parseFloat((tar_completas / tar_metas) * 100))

      } else {
        completado = 0

      }

      html_tar = '<div class="box" style="width: 100%;"><div class="box-header"><h3 class="box-title">Tarea</h3></div><div class="box-body table-responsive pad"><p style="cursor: pointer;color: darkslateblue;">' + data["list_tareas"][0]['tarea'] + ' - ' + data["list_tareas"][0]['proyecto'] + '<small class="pull-right">' + completado + '%</small></p><div class="progress xs"><div class="progress-bar progress-bar-aqua" style="width: ' + completado + '%" role="progressbar" aria-valuenow="' + completado + '" aria-valuemin="0" aria-valuemax="100"><span class="sr-only">' + completado + '%" completado</span></div></div><div class="ripple-container"></div>'

      html_tar = html_tar + '<div class="box-body table-responsive no-padding"><table class="table table-bordered" id="tabla_tareas"><tbody><tr><th></th><th>Tareas</th><th>Responsable</th><th>Area</th><th>Inicio</th><th>Entrega</th><th>Archivos</th><th>Estado</th><th>Aprobado</th></tr>'
      html_tar = html_tar + html_tar_indi + '</tbody></table>'

      html_tar = html_tar + '<div class="col-sm-4"><label class="control-label for=" relacionado"="" style="font-size: 12px;font-weight: bold;">Tareas</label><select class="form-control col-sm-4" id="tar_adj_pk" style="height: 25px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;">' + html_select_file + '</select></div>'
      html_tar = html_tar + '<div class="col-sm-4"><label class="control-label for=" id"="" style="font-size: 12px;font-weight: bold;">Nombre</label><input type="text" id="tar_adj_nom" class="form-control col-sm-4" value="" style="height: 25px;font-size: 11px;"></div>'
      html_tar = html_tar + '<div class="col-sm-4"><label class="control-label for=" id"="" style="font-size: 12px;font-weight: bold;">Url</label><input type="text" id="tar_adj_url" class="form-control col-sm-4" value="" style="height: 25px;font-size: 11px;"></div>'
      html_tar = html_tar + '<button type="button" class="btn bg-green btn-flat margin" onclick="tar_adjuntar()" style="/* height: 30px; */width: 100%;/* padding: 3px 4px; *//* padding-bottom: 8px; *//* padding-left: 10px; *//* margin-left: 1px; */" btn="" bg-green="" btn-flat="">Adjuntar</button>'


      html_tar = html_tar + '</div>'
      html_tar = html_tar + '<div class="dashboard-widget-content"><label class="control-label for=" txt_nota_user"="" style="font-size: 11px;">Para</label><select class="btn btn-info dropdown-toggle" id="txt_nota_user" style="width: 200px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;">'
      for (x = 0; x < data["listado_user"].length; x++) {
        html_tar = html_tar + '<option>' + data["listado_user"][x]['Usuario'] + '</option>'
      }

      html_tar = html_tar + '</select><br><label class="control-label for=" txt_nota_a"="" style="font-size: 11px;">Comentario</label><textarea type="text" id="txt_nota_a" class="form-control" value="0" style="height: 45px;font-size: 11px;"></textarea><div class="row" style="margin-left: 0px;margin-right: 0px;"><button type="button" class="btn bg-blue btn-flat margin" onclick="add_abrir_nota_tar(' + pktarea + ')" style="width: 99.5%;">Comentar</button></div><ul class="timeline" id="ul_notas_txt">'


      for (z2 = 0; z2 <= data["List_coments"].length - 1; z2++) {
        html_tar = html_tar + '<li><i class="fa fa-comments bg-yellow"></i>'
        html_tar = html_tar + '         <div class="timeline-item">'
        html_tar = html_tar + '           <div class="timeline-body" style="padding: 5px;">'
        html_tar = html_tar + '             <h2 class="title"></h2>'
        html_tar = html_tar + '             <div class="byline">De: <a>' + data["List_coments"][z2]["usuario"] + '</a>, Para: <a>' + data["List_coments"][z2]["user_destino"] + '</a> -- ' + data["List_coments"][z2]["fecha"] + '</div>'

        html_tar = html_tar + '<p style="margin-bottom: 0px;">' + data["List_coments"][z2]["texto"] + '</p></div></div></li>'
      }

      html_tar = html_tar + '</ul></div></div>'


      if (data["list_tareas"][0]["usuario"] == web_usuario) {

        html_tar = html_tar + '<div class="form-group is-empty" style="padding: 10px;"><label for="new_subtar">Nueva Tarea</label><input type="text" class="form-control" id="new_subtar" placeholder="Tarea">'


        html_tar = html_tar + '<label class="control-label for=" txt_nota_user"="" style="font-size: 11px;">Responsable</label><select class="btn btn-info dropdown-toggle" id="txt_tar_user" style="width: 200px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;">'

        for (x = 0; x < data["listado_user"].length; x++) {
          html_tar = html_tar + '<option>' + data["listado_user"][x]['Usuario'] + '</option>'
        }
        html_tar = html_tar + '</select>'
        html_tar = html_tar + '<label class="control-label for=" txt_tar_area"="" style="font-size: 11px;">Area</label><select class="btn btn-info dropdown-toggle" id="txt_tar_area" style="width: 200px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;">'

        for (x = 0; x < data["list_areas"].length; x++) {
          html_tar = html_tar + '<option>' + data["list_areas"][x]['Area'] + '</option>'
        }
        html_tar = html_tar + '</select>'

        var now = new Date();
        valor_campo = now.format("Y-m-d")

        html_tar = html_tar + '<label class="control-label for="txt_tar_fecha_inicio" style="font-size: 11px;">Inicio</label><input type="date" id="txt_tar_fecha_inicio" value="' + web_fecha + '" style="height: 25px;font-size: 11px;padding-left: 20px;margin-left: 20px;">'
        html_tar = html_tar + '<label class="control-label for="txt_tar_fecha_entre"   style="font-size:11px;padding-left:10px;">Entrega</label><input type="date" id="txt_tar_fecha_entre" value="' + web_fecha + '" style="height: 25px;font-size: 11px;padding-left: 20px;margin-left: 20px;"></div>'

        html_tar = html_tar + '<div class="row" style="margin-right: 0px;margin-left: 0px;"><button type="button" class="btn bg-blue btn-flat margin"  style="width: 49%;" onclick="add_sub_tarea(' + data["list_tareas"][0]['pk'] + ')">Agregar Tarea</button><button type="button" class="btn bg-blue btn-flat margin" onclick="finalizar_tarea(' + data["list_tareas"][0]['pk'] + ')" style="width: 49%;" data-dismiss="modal">Finalizar Tarea</button></div></div>'

      }

      html_tar = html_tar + '</div>'



      var dd = document.getElementById('intnotaTareas')

      dd.innerHTML = html_tar






    }
  });
}

function abrir_tareas(pktarea, fuente) {

  $.ajax({
    type: "POST",
    url: '/tareas_indi',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'pktarea': pktarea },
    success: function (data) {
      html_tar = ''
      html_tar_indi = ''
      tar_completas = 0
      tar_metas = 0
      html_select_file = ''

      for (a2 = 0; a2 <= data["List_subtareas"].length - 1; a2++) {
        if (data["list_tareas"][0]["usuario"] == web_usuario) {
          html_select_file = html_select_file + '<option value="' + data["List_subtareas"][a2]['pk'] + '">' + data["List_subtareas"][a2]['tarea'] + '</option>'


          if (data["list_tareas"][0]["usuario"] == web_usuario) {
            html_tar_indi = html_tar_indi + '<tr style="text-align: center;" id="subtar_' + data["List_subtareas"][a2]['pk'] + '"><td><a class="btn btn-danger" onclick="eliminar_tarea(' + data["List_subtareas"][a2]['pk'] + ')" style="padding: 2px 2px; margin-right: 0px; margin-left: 0px;"><span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span></a></td><td>' + data["List_subtareas"][a2]['tarea'] + '</td><td valign="middle">' + data["List_subtareas"][a2]['user_destino'] + '</td><td>' + data["List_subtareas"][a2]['area'] + '</td><td>' + data["List_subtareas"][a2]['fecha'] + '</td><td>' + data["List_subtareas"][a2]['fecha_entrega'] + '</td>'
          } else {
            html_tar_indi = html_tar_indi + '<tr style="text-align: center;" id="subtar_' + data["List_subtareas"][a2]['pk'] + '"><td></td><td>' + data["List_subtareas"][a2]['tarea'] + '</td><td valign="middle">' + data["List_subtareas"][a2]['user_destino'] + '</td><td>' + data["List_subtareas"][a2]['area'] + '</td><td>' + data["List_subtareas"][a2]['fecha'] + '</td><td>' + data["List_subtareas"][a2]['fecha_entrega'] + '</td>'

          }

          html_tar_indi = html_tar_indi + '<td>'
          for (var xz = data["List_files"].length - 1; xz >= 0; xz--) {
            if (data["List_files"][xz]['pktar'] == data["List_subtareas"][a2]['pk']) {
              html_tar_indi = html_tar_indi + '<a href="' + data["List_files"][xz]['url'] + '" target="_blank">' + data["List_files"][xz]['nombre'] + '</a><br>'

            }
          }
          html_tar_indi = html_tar_indi + '</td>'


          if (data["List_subtareas"][a2]['estado'] == '1') {
            tar_completas = tar_completas + 1
            html_tar_indi = html_tar_indi + '<td><div class="checkbox"><label><input type="checkbox" checked onclick="tareas_cambio_estado(this,' + data["List_subtareas"][a2]['pk'] + ')"><span class="checkbox-material"><span class="check"></span></span></label></div></td>'

          } else {
            html_tar_indi = html_tar_indi + '<td><div class="checkbox"><label><input type="checkbox" onclick="tareas_cambio_estado(this,' + data["List_subtareas"][a2]['pk'] + ')"><span class="checkbox-material"><span class="check"></span></span></label></div></td>'
          }
          if (data["List_subtareas"][a2]['aprovado'] == '1') {
            html_tar_indi = html_tar_indi + '<td><div class="checkbox"><label><input type="checkbox" checked onclick="tareas_cambio_aprovado(this,' + data["List_subtareas"][a2]['pk'] + ')"><span class="checkbox-material"><span class="check"></span></span></label></div></td>'

          } else {
            html_tar_indi = html_tar_indi + '<td><div class="checkbox"><label><input type="checkbox" onclick="tareas_cambio_aprovado(this,' + data["List_subtareas"][a2]['pk'] + ')"><span class="checkbox-material"><span class="check"></span></span></label></div></td>'
          }


          tar_metas = tar_metas + 1
          html_tar_indi = html_tar_indi + '</tr>'
        } else {
          if (data["List_subtareas"][a2]['user_destino'].toLocaleLowerCase() == (web_usuario).toLocaleLowerCase()) {
            html_select_file = html_select_file + '<option value="' + data["List_subtareas"][a2]['pk'] + '">' + data["List_subtareas"][a2]['tarea'] + '</option>'

            html_tar_indi = html_tar_indi + '<tr style="text-align: center;"><td>' + data["List_subtareas"][a2]['tarea'] + '</td><td valign="middle">' + data["List_subtareas"][a2]['user_destino'] + '</td><td>' + data["List_subtareas"][a2]['area'] + '</td><td>' + data["List_subtareas"][a2]['fecha'] + '</td>'
            html_tar_indi = html_tar_indi + '<td>'
            for (var xz = data["List_files"].length - 1; xz >= 0; xz--) {
              if (data["List_files"][xz]['pktar'] == data["List_subtareas"][a2]['pk']) {
                html_tar_indi = html_tar_indi + '<a href="' + data["List_files"][xz]['url'] + '" target="_blank">' + data["List_files"][xz]['nombre'] + '</a><br>'

              }
            }
            html_tar_indi = html_tar_indi + '</td>'

            if (data["List_subtareas"][a2]['estado'] == '1') {
              html_tar_indi = html_tar_indi + '<td><div class="checkbox"><label><input type="checkbox" checked onclick="tareas_cambio_estado(this,' + data["List_subtareas"][a2]['pk'] + ')"><span class="checkbox-material"><span class="check"></span></span></label></div></td>'

            } else {
              html_tar_indi = html_tar_indi + '<td><div class="checkbox"><label><input type="checkbox" onclick="tareas_cambio_estado(this,' + data["List_subtareas"][a2]['pk'] + ')"><span class="checkbox-material"><span class="check"></span></span></label></div></td>'
            }
            if (data["List_subtareas"][a2]['aprovado'] == '1') {
              html_tar_indi = html_tar_indi + '<td><div class="checkbox"><label><input type="checkbox" checked onclick="tareas_cambio_aprovado(this,' + data["List_subtareas"][a2]['pk'] + ')"><span class="checkbox-material"><span class="check"></span></span></label></div></td>'

            } else {
              html_tar_indi = html_tar_indi + '<td><div class="checkbox"><label><input type="checkbox" onclick="tareas_cambio_aprovado(this,' + data["List_subtareas"][a2]['pk'] + ')"><span class="checkbox-material"><span class="check"></span></span></label></div></td>'
            }
            html_tar_indi = html_tar_indi + '</tr>'
          }
        }
      }
      if (data["list_tareas"][0]["usuario"] == web_usuario) {
        completado = parseInt(parseFloat((tar_completas / tar_metas) * 100))

      } else {
        completado = 0

      }

      html_tar = '<div class="box" style="width: 100%;"><div class="box-header"><h3 class="box-title">Tarea</h3></div><div class="box-body table-responsive pad"><p style="cursor: pointer;color: darkslateblue;">' + data["list_tareas"][0]['tarea'] + ' - ' + data["list_tareas"][0]['proyecto'] + '<small class="pull-right">' + completado + '%</small></p><div class="progress xs"><div class="progress-bar progress-bar-aqua" style="width: ' + completado + '%" role="progressbar" aria-valuenow="' + completado + '" aria-valuemin="0" aria-valuemax="100"><span class="sr-only">' + completado + '%" completado</span></div></div><div class="ripple-container"></div>'

      html_tar = html_tar + '<div class="box-body table-responsive no-padding"><table class="table table-bordered" id="tabla_tareas"><tbody><tr><th></th><th>Tareas</th><th>Responsable</th><th>Area</th><th>Inicio</th><th>Entrega</th><th>Archivos</th><th>Estado</th><th>Aprobado</th></tr>'
      html_tar = html_tar + html_tar_indi + '</tbody></table>'

      html_tar = html_tar + '<div class="col-sm-4"><label class="control-label for=" relacionado"="" style="font-size: 12px;font-weight: bold;">Tareas</label><select class="form-control col-sm-4" id="tar_adj_pk" style="height: 25px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;">' + html_select_file + '</select></div>'
      html_tar = html_tar + '<div class="col-sm-4"><label class="control-label for=" id"="" style="font-size: 12px;font-weight: bold;">Nombre</label><input type="text" id="tar_adj_nom" class="form-control col-sm-4" value="" style="height: 25px;font-size: 11px;"></div>'
      html_tar = html_tar + '<div class="col-sm-4"><label class="control-label for=" id"="" style="font-size: 12px;font-weight: bold;">Url</label><input type="text" id="tar_adj_url" class="form-control col-sm-4" value="" style="height: 25px;font-size: 11px;"></div>'
      html_tar = html_tar + '<button type="button" class="btn bg-green btn-flat margin" onclick="tar_adjuntar()" style="/* height: 30px; */width: 100%;/* padding: 3px 4px; *//* padding-bottom: 8px; *//* padding-left: 10px; *//* margin-left: 1px; */" btn="" bg-green="" btn-flat="">Adjuntar</button>'


      html_tar = html_tar + '</div>'
      html_tar = html_tar + '<div class="dashboard-widget-content"><label class="control-label for=" txt_nota_user"="" style="font-size: 11px;">Para</label><select class="btn btn-info dropdown-toggle" id="txt_nota_user" style="width: 200px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;">'
      for (x = 0; x < data["listado_user"].length; x++) {
        html_tar = html_tar + '<option>' + data["listado_user"][x]['Usuario'] + '</option>'
      }

      html_tar = html_tar + '</select><br><label class="control-label for=" txt_nota_a"="" style="font-size: 11px;">Comentario</label><textarea type="text" id="txt_nota_a" class="form-control" value="0" style="height: 45px;font-size: 11px;"></textarea><div class="row" style="margin-left: 0px;margin-right: 0px;"><button type="button" class="btn bg-blue btn-flat margin" onclick="add_abrir_nota_tar(' + pktarea + ')" style="width: 99.5%;">Comentar</button></div><ul class="timeline" id="ul_notas_txt">'


      for (z2 = 0; z2 <= data["List_coments"].length - 1; z2++) {
        html_tar = html_tar + '<li><i class="fa fa-comments bg-yellow"></i>'
        html_tar = html_tar + '         <div class="timeline-item">'
        html_tar = html_tar + '           <div class="timeline-body" style="padding: 5px;">'
        html_tar = html_tar + '             <h2 class="title"></h2>'
        html_tar = html_tar + '             <div class="byline">De: <a>' + data["List_coments"][z2]["usuario"] + '</a>, Para: <a>' + data["List_coments"][z2]["user_destino"] + '</a> -- ' + data["List_coments"][z2]["fecha"] + '</div>'

        html_tar = html_tar + '<p style="margin-bottom: 0px;">' + data["List_coments"][z2]["texto"] + '</p></div></div></li>'
      }

      html_tar = html_tar + '</ul></div></div>'


      if (data["list_tareas"][0]["usuario"] == web_usuario) {

        html_tar = html_tar + '<div class="form-group is-empty" style="padding: 10px;"><label for="new_subtar">Nueva Tarea</label><input type="text" class="form-control" id="new_subtar" placeholder="Tarea">'


        html_tar = html_tar + '<label class="control-label for=" txt_nota_user"="" style="font-size: 11px;">Responsable</label><select class="btn btn-info dropdown-toggle" id="txt_tar_user" style="width: 200px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;">'

        for (x = 0; x < data["listado_user"].length; x++) {
          html_tar = html_tar + '<option>' + data["listado_user"][x]['Usuario'] + '</option>'
        }
        html_tar = html_tar + '</select>'
        html_tar = html_tar + '<label class="control-label for=" txt_tar_area"="" style="font-size: 11px;">Area</label><select class="btn btn-info dropdown-toggle" id="txt_tar_area" style="width: 200px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;">'

        for (x = 0; x < data["list_areas"].length; x++) {
          html_tar = html_tar + '<option>' + data["list_areas"][x]['Area'] + '</option>'
        }
        html_tar = html_tar + '</select>'

        var now = new Date();
        valor_campo = now.format("Y-m-d")

        html_tar = html_tar + '<br><label class="control-label for=" txt_nota_user"="" style="font-size: 11px;">Inicio</label><input type="date" id="txt_tar_fecha_inicio" value="' + valor_campo + '" style="height: 25px;font-size: 11px;padding-left: 20px;margin-left: 20px;">'
        html_tar = html_tar + '<label class="control-label for=" txt_nota_user"="" style="font-size: 11px;padding-left: 20px;">Entrega</label><input type="date" id="txt_tar_fecha_entre" value="' + valor_campo + '" style="height: 25px;font-size: 11px;padding-left: 20px;margin-left: 20px;"></div>'

        html_tar = html_tar + '<div class="row" style="margin-right: 0px;margin-left: 0px;"><button type="button" class="btn bg-blue btn-flat margin"  style="width: 49%;" onclick="add_sub_tarea(' + data["list_tareas"][0]['pk'] + ')">Agregar Tarea</button><button type="button" class="btn bg-blue btn-flat margin" onclick="finalizar_tarea(' + data["list_tareas"][0]['pk'] + ')" style="width: 49%;" data-dismiss="modal">Finalizar Tarea</button></div></div>'

      }

      html_tar = html_tar + '</div>'



      var dd = document.getElementById('intnotaTareas')

      dd.innerHTML = html_tar






    }
  });
}


function add_sub_tarea(pksubtarea) {

  var tar_text = document.getElementById("new_subtar")
  var tar_resp = document.getElementById("txt_tar_user")
  var tar_area = document.getElementById("txt_tar_area")

  var tar_fecha_ini = document.getElementById("txt_tar_fecha_inicio")
  var tar_fecha_ent = document.getElementById("txt_tar_fecha_entre")
  var v_fecha_ini = new Date(tar_fecha_ini.value);
  var v_fecha_ent = new Date(tar_fecha_ent.value);
  v_fecha_ini.addDays(1)
  v_fecha_ent.addDays(1)

  if (v_fecha_ini == 'Invalid Date') {
    v_fecha_ini = new Date(web_fecha);
    v_fecha_ini.addDays(1)

  }
  if (v_fecha_ent == 'Invalid Date') {
    v_fecha_ent = new Date(web_fecha);
    v_fecha_ent.addDays(1)
  }

  $.ajax({
    type: "POST",
    url: '/add_sub_tarea',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'tar_text': tar_text.value, 'tar_resp': tar_resp.value, 'tar_area': tar_area.value, 'tar_fecha_ini': v_fecha_ini.format('Y-m-d'), 'tar_fecha_ent': v_fecha_ent.format('Y-m-d'), 'pksubtarea': pksubtarea },
    success: function (data) {
      traer_tareas()
      var tabla_tar = document.getElementById("")

      $('#tabla_tareas').append('<tr style="text-align: center;" id="subtar_' + data["ultima_tar"][0]['pk'] + '"><td><a class="btn btn-danger" onclick="eliminar_tarea(' + data["ultima_tar"][0]['pk'] + ')" style="padding: 2px 2px; margin-right: 0px; margin-left: 0px;"><span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span></a></td><td>' + data["ultima_tar"][0]['tarea'] + '</td><td valign="middle">' + data["ultima_tar"][0]['user_destino'] + '</td><td>' + data["ultima_tar"][0]['area'] + '</td><td>' + data["ultima_tar"][0]['fecha'] + '</td><td>' + data["ultima_tar"][0]['fecha_entrega'] + '</td><td></td><td><div class="checkbox"><label><input type="checkbox" onclick="tareas_cambio_estado(this,' + data["ultima_tar"][0]['pk'] + ')"><span class="checkbox-material"><span class="check"></span></span></label></div></td><td><div class="checkbox"><label><input type="checkbox" onclick="tareas_cambio_aprovado(this,' + data["ultima_tar"][0]['pk'] + ')"><span class="checkbox-material"><span class="check"></span></span></label></div></td></tr>');



    }
  });

}
function crear_tarea_nueva(mismo, pksubtarea) {

  var txt_tar = document.getElementById("new_tar").value
  var txt_proy = document.getElementById("txt_tar_proy").value


  var tabla = document.getElementById("tabla_tareas")
  var val_tabla = {}
  for (var i = 1; i < tabla.children[0].childElementCount; i++) {
    valores_int = {}
    valores_int['sub_tar'] = tabla.children[0].children[i].children[1].innerText
    valores_int['resp'] = tabla.children[0].children[i].children[2].innerText
    valores_int['tar_area'] = tabla.children[0].children[i].children[3].innerText
    valores_int['fecha_ini'] = tabla.children[0].children[i].children[4].innerText
    valores_int['fecha_ent'] = tabla.children[0].children[i].children[5].innerText
    val_tabla[i] = valores_int
  }




  $.ajax({
    type: "POST",
    url: '/tareas_crear',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'txt_tar': txt_tar, 'txt_proy': txt_proy, 'val_tabla': JSON.stringify(val_tabla) },
    success: function (data) {
      traer_tareas()
    }
  });

}
function finalizar_tarea(pktarea) {

  $.ajax({
    type: "POST",
    url: '/tareas_finalizar',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'pktarea': pktarea },
    success: function (data) {
      traer_tareas()
    }
  });

}
function eliminar_tarea(pktarea) {

  $.ajax({
    type: "POST",
    url: '/tareas_sub_finalizar',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'pktarea': pktarea },
    success: function (data) {
      var tr_tabl = document.getElementById('subtar_' + pktarea)
      tr_tabl.remove()

    }
  });

}
function eliminar_tarea_nodb(pktarea) {

  var tr_tabl = document.getElementById('sub_tar_nu_' + pktarea)
  tr_tabl.remove()


}


function tareas_cambio_estado(mismo, pksubtarea) {

  $.ajax({
    type: "POST",
    url: '/tareas_cambio',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'pksubtarea': pksubtarea, 'estado': mismo.checked },
    success: function (data) {
      traer_tareas()
    }
  });

}

let imageUtil = {};

function cod_barras() {
  JsBarcode("#barcode", "1603202101171607371100120010010000004940000000013");

  var vsg_ele = document.createElement("SVG");

  JsBarcode(vsg_ele, "1603202101171607371100120010010000004940000000013");



  var svg2 = vsg_ele.outerHTML;


  if (svg2)
    svg2 = svg2.replace(/\r?\n|\r/g, '').trim();

  var canvas = document.createElement('canvas');
  canvg(canvas, svg2);

  var imgData = canvas.toDataURL('image/png');
  // Generate PDF
  var doc = new jsPDF('p', 'pt', 'a4');
  doc.addImage(imgData, 'PNG', 1, 40, parseInt(vsg_ele.attributes['width'].value.replace('px', '')) / 2, parseInt(vsg_ele.attributes['height'].value.replace('px', '')) / 2);
  doc.save('vsg_ele.pdf');



}
function pdf_barras() {
  var date = new Date()

  var svg = document.getElementById('svg-container').innerHTML;

  if (svg)
    svg = svg.replace(/\r?\n|\r/g, '').trim();

  var canvas = document.createElement('canvas');
  canvg(canvas, svg);

  var imgData = canvas.toDataURL('image/png');
  // Generate PDF
  var doc = new jsPDF('p', 'pt', 'a4');
  doc.addImage(imgData, 'PNG', 40, 40, 75, 75);
  doc.save('test.pdf');



}


imageUtil.base64SvgToBase64Png = function (originalBase64, width, secondTry) {
  return new Promise(resolve => {
    let img = document.createElement('img');
    img.onload = function () {
      if (!secondTry && (img.naturalWidth === 0 || img.naturalHeight === 0)) {
        let svgDoc = base64ToSvgDocument(originalBase64);
        let fixedDoc = fixSvgDocumentFF(svgDoc);
        return imageUtil.base64SvgToBase64Png(svgDocumentToBase64(fixedDoc), width, true).then(result => {
          resolve(result);
        });
      }
      document.body.appendChild(img);
      let canvas = document.createElement("canvas");
      let ratio = (img.clientWidth / img.clientHeight) || 1;
      document.body.removeChild(img);
      canvas.width = width;
      canvas.height = width / ratio;
      let ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      try {
        let data = canvas.toDataURL('image/png');
        resolve(data);
      } catch (e) {
        resolve(null);
      }
    };
    img.src = originalBase64;
  });
}

//needed because Firefox doesn't correctly handle SVG with size = 0, see https://bugzilla.mozilla.org/show_bug.cgi?id=700533
function fixSvgDocumentFF(svgDocument) {
  try {
    let widthInt = parseInt(svgDocument.documentElement.width.baseVal.value) || 500;
    let heightInt = parseInt(svgDocument.documentElement.height.baseVal.value) || 500;
    svgDocument.documentElement.width.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, widthInt);
    svgDocument.documentElement.height.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, heightInt);
    return svgDocument;
  } catch (e) {
    return svgDocument;
  }
}

function svgDocumentToBase64(svgDocument) {
  try {
    let base64EncodedSVG = btoa(new XMLSerializer().serializeToString(svgDocument));
    return 'data:image/svg+xml;base64,' + base64EncodedSVG;
  } catch (e) {
    return null;
  }
}

function base64ToSvgDocument(base64) {
  let svg = atob(base64.substring(base64.indexOf('base64,') + 7));
  svg = svg.substring(svg.indexOf('<svg'));
  let parser = new DOMParser();
  return parser.parseFromString(svg, "image/svg+xml");
}

function tareas_cambio_aprovado(mismo, pksubtarea) {

  $.ajax({
    type: "POST",
    url: '/tareas_aprovado',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'pksubtarea': pksubtarea, 'estado': mismo.checked },
    success: function (data) {
      traer_tareas()
    }
  });

}


function ver_alertas(a_pkmodulo, a_pkregistro) {
  if (a_pkmodulo != 0) {
    registro(a_pkmodulo, a_pkregistro, 2, 'consulta', 0, 0)
  }

}
function solo_numero(e) {
  //See notes about 'which' and 'key'
  if (event.keyCode > 47 && event.keyCode < 58 || event.keyCode == 46) {

  } else {
    if (event.keyCode != 13) {
      event.keyCode = 0;
      return false;
    }
  }

}


