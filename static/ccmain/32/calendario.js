
function calendario() {
  calendario_val = {}
  id_por_fecha = {}
  //z_campos = document.getElementById("calendar_date")
  z_campos = new Date(document.getElementById("calendar_date").value)
  z_campos.addDays(1)
 
  var v_fecha = new Date(z_campos);
  var v_fecha_mov = new Date(z_campos);
  var v_fecha_movA = new Date(z_campos);
  var v_fecha_act = new Date(z_campos);
  var v_fecha_act2 = new Date(z_campos);
  var v_fecha_dia_mov = new Date(z_campos);
  var v_fecha_act4 = new Date(z_campos);
  var v_fecha_dia_mov2 = new Date(z_campos);

  ajuste = 0


  if (v_fecha.getDate() != v_fecha.getDaysInMonth()) {
    v_fecha_mov.addDays(((v_fecha.format('d') - 1) * -1))
    v_fecha_movA.addDays(((v_fecha.format('d') - 1) * -1))
  }


  //para atras  getDay()
  dia_seleccc = v_fecha.getDay()
  dia = v_fecha_mov.getDay()
  diaA = v_fecha_movA.getDay()
  dia_sele = ''
  for (ee = 0; ee <= 34; ee++) {
    tap = document.getElementById("cal_" + ee)
    tap.innerHTML = ''


  }


  document.getElementById("di_0").innerHTML = '<div class="btn-group-vertical" style="margin: 0;padding: 0;">Lunes '
  document.getElementById("di_1").innerHTML = '<div class="btn-group-vertical" style="margin: 0;padding: 0;">Martes '
  document.getElementById("di_2").innerHTML = '<div class="btn-group-vertical" style="margin: 0;padding: 0;">Miercoles '
  document.getElementById("di_3").innerHTML = '<div class="btn-group-vertical" style="margin: 0;padding: 0;">Jueves '
  document.getElementById("di_4").innerHTML = '<div class="btn-group-vertical" style="margin: 0;padding: 0;">Viernes '
  document.getElementById("di_5").innerHTML = '<div class="btn-group-vertical" style="margin: 0;padding: 0;">Sabado '
  document.getElementById("di_6").innerHTML = '<div class="btn-group-vertical" style="margin: 0;padding: 0;">Domingo '
  document.getElementById("dia_unico").innerHTML = ''


  //v_fecha_act4.addDays(1)


  if ((dia_seleccc - 1) == 0) { document.getElementById("dia_unico").innerHTML = '<div class="btn-group-vertical" style="margin: 0;padding: 0;">Lunes ' + v_fecha_act4.format('d') + ' </div>' }
  if ((dia_seleccc - 1) == 1) { document.getElementById("dia_unico").innerHTML = '<div class="btn-group-vertical" style="margin: 0;padding: 0;">Martes ' + v_fecha_act4.format('d') + ' </div>' }
  if ((dia_seleccc - 1) == 2) { document.getElementById("dia_unico").innerHTML = '<div class="btn-group-vertical" style="margin: 0;padding: 0;">Miercoles ' + v_fecha_act4.format('d') + ' </div>' }
  if ((dia_seleccc - 1) == 3) { document.getElementById("dia_unico").innerHTML = '<div class="btn-group-vertical" style="margin: 0;padding: 0;">Jueves ' + v_fecha_act4.format('d') + ' </div>' }
  if ((dia_seleccc - 1) == 4) { document.getElementById("dia_unico").innerHTML = '<div class="btn-group-vertical" style="margin: 0;padding: 0;">Viernes ' + v_fecha_act4.format('d') + ' </div>' }
  if ((dia_seleccc - 1) == 5) { document.getElementById("dia_unico").innerHTML = '<div class="btn-group-vertical" style="margin: 0;padding: 0;">Sabado ' + v_fecha_act4.format('d') + ' </div>' }
  if ((dia_seleccc - 1) == 6) { document.getElementById("dia_unico").innerHTML = '<div class="btn-group-vertical" style="margin: 0;padding: 0;">Domingo ' + v_fecha_act4.format('d') + ' </div>' }

  //document.getElementById("dia_unico").innerHTML = document.getElementById("dia_unico").innerHTML + ' <button type="button" data-toggle="tooltip" data-placement="top" title="Pdf" style="font-size: larger;margin-top: 0px;margin-bottom: 0px;padding-top: 0px;padding-bottom: 0px;" onclick="pdf_calendario()" class="btn btn-info"><span class="fa fa-file-pdf-o" aria-hidden="true"></span></button>'

  v_fecha_dia_mov2 = v_fecha_act4
  v_fecha_dia_mov2.addDays(-1)

  for (ee2 = 7; ee2 <= 21; ee2++) {
    if (ee2 < 10) {
      tap = document.getElementById("du_0" + ee2)
    } else {
      tap = document.getElementById("du_" + ee2)
    }

    tap.style.backgroundColor = "bisque"


    txt_dd = ''
    if (ee2 < 12) {
      if (ee2 < 10) {

        txt_dd = txt_dd + '<div class="input-group-btn"><button type="button" class="btn btn-warning dropdown-toggle" data-toggle="dropdown" aria-expanded="false" id="d' + v_fecha_dia_mov2.format('Y-m-d').replace(/-/g, 'Q') + '_0' + ee2 + 'w00w00"><span class="fa fa-caret-down"></span><div lass="ripple-container"></div></button><ul class="dropdown-menu" style="cursor: pointer;">'
      } else {
        txt_dd = txt_dd + '<div class="input-group-btn"><button type="button" class="btn btn-warning dropdown-toggle" data-toggle="dropdown" aria-expanded="false" id="d' + v_fecha_dia_mov2.format('Y-m-d').replace(/-/g, 'Q') + '_' + ee2 + 'w00w00"><span class="fa fa-caret-down"></span><div lass="ripple-container"></div></button><ul class="dropdown-menu" style="cursor: pointer;">'
      }


    } else {
      if (ee2 == 12) {
        txt_dd = txt_dd + '<div class="input-group-btn"><button type="button" class="btn btn-warning dropdown-toggle" data-toggle="dropdown" aria-expanded="false" id="d' + v_fecha_dia_mov2.format('Y-m-d').replace(/-/g, 'Q') + '_' + ee2 + 'w00w00"><span class="fa fa-caret-down"></span><div lass="ripple-container"></div></button><ul class="dropdown-menu" style="cursor: pointer;">'
      } else {
        txt_dd = txt_dd + '<div class="input-group-btn"><button type="button" class="btn btn-warning dropdown-toggle" data-toggle="dropdown" aria-expanded="false" id="d' + v_fecha_dia_mov2.format('Y-m-d').replace(/-/g, 'Q') + '_' + ee2 + 'w00w00"><span class="fa fa-caret-down"></span><div lass="ripple-container"></div></button><ul class="dropdown-menu" style="cursor: pointer;">'
      }
    }


    for (zxz = 0; zxz < web_calen.length; zxz++) {
      if (ee2 < 10) {
        txt_dd = txt_dd + '<li><a onClick="registro_cal(' + web_calen[zxz]['pkmodulo'] + ', d' + v_fecha_dia_mov2.format('Y-m-d').replace(/-/g, 'Q') + '_0' + ee2 + 'w00w00,  0, 0, -1, 0)"> ' + web_calen[zxz]['nombre'] + ' **3</a></li>' // dia
      } else {
        txt_dd = txt_dd + '<li><a onClick="registro_cal(' + web_calen[zxz]['pkmodulo'] + ', d' + v_fecha_dia_mov2.format('Y-m-d').replace(/-/g, 'Q') + '_' + ee2 + 'w00w00,  0, 0, -1, 0)"> ' + web_calen[zxz]['nombre'] + ' **4</a></li>' // dia

      }
    }

    txt_dd = txt_dd + '</ul></div>'
    //quitar por desuso
    //tap.innerHTML = txt_dd
    tap.innerHTML = ''
  }


  //z_campos = document.getElementById("calendar_date")

  for (ee = 0; ee <= 6; ee++) {

    //if(ee == dia_seleccc){
    //  v_fecha_act2.addDays(1)

    //}else{
    //  var v_fecha_act2 = new Date(z_campos.value);
    //  v_fecha_act2.addDays(ee - dia_seleccc +1)
    //}
    var v_fecha_act2 = new Date(z_campos);
    v_fecha_act2.addDays(ee - dia_seleccc + 1)
    document.getElementById("di_" + ee).innerHTML = document.getElementById("di_" + ee).innerHTML + v_fecha_act2.format('d') + '</div>'
    v_fecha_dia_mov = v_fecha_act2
    v_fecha_dia_mov.addDays(-1)

    for (ee2 = 7; ee2 <= 21; ee2++) {
      if (ee2 < 10) {
        tap = document.getElementById("dia_0" + ee2 + "_" + ee)
      } else {
        tap = document.getElementById("dia_" + ee2 + "_" + ee)
      }

      if (ee == dia_seleccc - 1) {
        tap.style.backgroundColor = "bisque"

      } else {
        tap.style.backgroundColor = "aliceblue"
      }

      txt_dd = ''
      if (ee2 < 12) {
        if (ee2 < 10) {

          txt_dd = txt_dd + '<div class="input-group-btn"><button type="button" class="btn btn-warning dropdown-toggle" data-toggle="dropdown" aria-expanded="false" id="d' + v_fecha_dia_mov.format('Y-m-d').replace(/-/g, 'Q') + '_0' + ee2 + 'w00w00"><span class="fa fa-caret-down"></span><div lass="ripple-container"></div></button><ul class="dropdown-menu" style="cursor: pointer;">'
        } else {
          txt_dd = txt_dd + '<div class="input-group-btn"><button type="button" class="btn btn-warning dropdown-toggle" data-toggle="dropdown" aria-expanded="false" id="d' + v_fecha_dia_mov.format('Y-m-d').replace(/-/g, 'Q') + '_' + ee2 + 'w00w00"><span class="fa fa-caret-down"></span><div lass="ripple-container"></div></button><ul class="dropdown-menu" style="cursor: pointer;">'
        }


      } else {
        if (ee2 == 12) {
          txt_dd = txt_dd + '<div class="input-group-btn"><button type="button" class="btn btn-warning dropdown-toggle" data-toggle="dropdown" aria-expanded="false" id="d' + v_fecha_dia_mov.format('Y-m-d').replace(/-/g, 'Q') + '_' + ee2 + 'w00w00"><span class="fa fa-caret-down"></span><div lass="ripple-container"></div></button><ul class="dropdown-menu" style="cursor: pointer;">'
        } else {
          txt_dd = txt_dd + '<div class="input-group-btn"><button type="button" class="btn btn-warning dropdown-toggle" data-toggle="dropdown" aria-expanded="false" id="d' + v_fecha_dia_mov.format('Y-m-d').replace(/-/g, 'Q') + '_' + ee2 + 'w00w00"><span class="fa fa-caret-down"></span><div lass="ripple-container"></div></button><ul class="dropdown-menu" style="cursor: pointer;">'
        }
      }


      for (zxz = 0; zxz < web_calen.length; zxz++) {
        if (ee2 < 10) {
          txt_dd = txt_dd + '<li><a onClick="registro_cal(' + web_calen[zxz]['pkmodulo'] + ', d' + v_fecha_dia_mov.format('Y-m-d').replace(/-/g, 'Q') + '_0' + ee2 + 'w00w00,  0, 0, -1, 0)"> ' + web_calen[zxz]['nombre'] + ' </a></li>' // semana
        } else {
          txt_dd = txt_dd + '<li><a onClick="registro_cal(' + web_calen[zxz]['pkmodulo'] + ', d' + v_fecha_dia_mov.format('Y-m-d').replace(/-/g, 'Q') + '_' + ee2 + 'w00w00,  0, 0, -1, 0)"> ' + web_calen[zxz]['nombre'] + ' </a></li>'  //semana

        }
      }

      txt_dd = txt_dd + '</ul></div>'
      //quitar por desuso este es la pestana qe bajaba
      //tap.innerHTML = txt_dd
      tap.innerHTML = ''

    }
  }

  aa = 0

  var ttt = 0

  if (diaA == 0) { diaA = 7 }

  for (ee = (diaA); ee > 1; ee--) {
    try {
      //v_fecha_movA.addDays(-1)
      tap = document.getElementById("cal_" + (ee - 2))
      //tap.innerHTML = '<div>' + v_fecha_movA.format('d') + '</div>'
      var v_fecha_actsss = new Date(v_fecha_movA);
      v_fecha_actsss.addDays((-1 * (diaA - ee + 1)))
      ttt = ttt + 1


      var txt_dd = '<div  id="d' + v_fecha_actsss.format('Y-m-d').replace(/-/g, 'Q') + '"></div>'

      txt_dd = txt_dd + '<div class="input-group-btn"><button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-expanded="false">' + v_fecha_actsss.format('d') + ' <span class="fa fa-caret-down"></span><div lass="ripple-container"></div></button><ul class="dropdown-menu" style="cursor: pointer;">'


      for (zxz = 0; zxz < web_calen.length; zxz++) {
        txt_dd = txt_dd + '<li><a onClick="registro_cal(' + web_calen[zxz]['pkmodulo'] + ', d' + v_fecha_actsss.format('Y-m-d').replace(/-/g, 'Q') + ',  0, 0, -1, 0)"> ' + web_calen[zxz]['nombre'] + ' </a></li>'
      }

      txt_dd = txt_dd + '</ul></div>'

      //quitar pro des uso es la pstana
      //tap.innerHTML = txt_dd
      tap.innerHTML = ''


      tap.style.backgroundColor = "cornsilk"
      calendario_val[v_fecha_actsss.format('Y-m-d')] = tap.id
      id_por_fecha[tap.id] = v_fecha_actsss.format('Y-m-d')


    }
    catch (error) {
      console.error(error);
      // expected output: ReferenceError: nonExistentFunction is not defined
      // Note - error messages will vary depending on browser
    }




  }
  if (dia == 0) { dia = 7 }

  //v_fecha_act.addDays(1)
  aa = 0
  for (ee = 0; ee <= (v_fecha.getDaysInMonth() - 1); ee++) {
    if ((ee + dia - 1) < 35) {
      tap = document.getElementById("cal_" + (ee + dia - 1))



      var txt_dd = '<div  id="d' + v_fecha_mov.format('Y-m-d').replace(/-/g, 'Q') + '"></div>'

      txt_dd = txt_dd + '<div class="input-group-btn"><button type="button" class="btn btn-warning dropdown-toggle" data-toggle="dropdown" aria-expanded="false">' + v_fecha_mov.format('d') + ' <span class="fa fa-caret-down"></span><div lass="ripple-container"></div></button><ul class="dropdown-menu" style="cursor: pointer;">'


      for (zxz = 0; zxz < web_calen.length; zxz++) {
        txt_dd = txt_dd + '<li><a onClick="registro_cal(' + web_calen[zxz]['pkmodulo'] + ', d' + v_fecha_mov.format('Y-m-d').replace(/-/g, 'Q') + ',  0, 0, -1, 0)">' + web_calen[zxz]['nombre'] + ' </a></li>'
      }

      txt_dd = txt_dd + '</ul></div>'
      //quitar por desuso
      //tap.innerHTML = txt_dd
      tap.innerHTML = ''


      //tap.innerHTML = '<div>' + v_fecha_mov.format('d') + '</div><div style="overflow: auto;text-align: left;height: 60px;" id="in-' + tap.id + '"></div>'

      if (v_fecha_mov.format('d') == v_fecha_act.format('d')) {
        tap.style.backgroundColor = "bisque"
      } else {
        tap.style.backgroundColor = "aliceblue"
      }
      calendario_val[v_fecha_mov.format('Y-m-d')] = tap.id
      id_por_fecha[tap.id] = v_fecha_mov.format('Y-m-d')

      //if(v_fecha_mov.format('d') == v_fecha.getDaysInMonth()){
      //    tap.style.backgroundColor = "cornsilk"
      //}

      v_fecha_mov.addDays(1)


      // expected output: ReferenceError: nonExistentFunction is not defined
      // Note - error messages will vary depending on browser


    }


  }
  for (ee = v_fecha.getDaysInMonth(); ee <= (34 - dia + 1); ee++) {

    tap = document.getElementById("cal_" + (ee + dia - 1))

    var txt_dd = '<div  id="d' + v_fecha_mov.format('Y-m-d').replace(/-/g, 'Q') + '"></div>'

    txt_dd = txt_dd + '<div class="input-group-btn"><button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-expanded="false">' + v_fecha_mov.format('d') + ' <span class="fa fa-caret-down"></span><div lass="ripple-container"></div></button><ul class="dropdown-menu" style="cursor: pointer;">'


    for (zxz = 0; zxz < web_calen.length; zxz++) {
      txt_dd = txt_dd + '<li><a onClick="registro_cal(' + web_calen[zxz]['pkmodulo'] + ', d' + v_fecha_mov.format('Y-m-d').replace(/-/g, 'Q') + ',  0, 0, -1, 0)"> ' + web_calen[zxz]['nombre'] + ' </a></li>'
    }

    txt_dd = txt_dd + '</ul></div>'

    //quitar po desuo
    //tap.innerHTML = txt_dd
    tap.innerHTML = ''

    //tap.innerHTML = '<div>' + v_fecha_mov.format('d') + '</div><div style="overflow: auto;text-align: left;height: 60px;" id="in-' + tap.id + '"></div>'            
    tap.style.backgroundColor = "cornsilk"
    calendario_val[v_fecha_mov.format('Y-m-d')] = tap.id
    id_por_fecha[tap.id] = v_fecha_mov.format('Y-m-d')

    if (v_fecha_mov.format('d') == v_fecha.getDaysInMonth()) {
      if (v_fecha_mov.format('d') == v_fecha_act.format('d')) {
        tap.style.backgroundColor = "aqua"
      } else {
        tap.style.backgroundColor = "aliceblue"
      }
    }
    v_fecha_mov.addDays(1)


    // expected output: ReferenceError: nonExistentFunction is not defined
    // Note - error messages will vary depending on browser



  }

  tap = document.getElementById("cal-" + (ee + dia - 1))

  Poner_calendario()
}



function abir_calen(calen, fila) {
  nom_calen = respuesta_calendario["calendarios"][calen]["nombre"]

  respuesta_calendario["cal_valores"][nom_calen][fila]

  data_cal = '<table class="table table-bordered" style="background: white;"><thead><tr style="align-content: center;">'

  for (ee = 0; ee <= (Object.keys(respuesta_calendario["cal_valores"][nom_calen][fila]).length - 1); ee++) {
    data_cal = data_cal + '<th style="text-align: center;">' + Object.keys(respuesta_calendario["cal_valores"][nom_calen][fila])[ee] + '</th>'
  }

  data_cal = data_cal + '</tr></thead><tbody><tr>'


  for (ee = 0; ee <= (Object.keys(respuesta_calendario["cal_valores"][nom_calen][fila]).length - 1); ee++) {
    data_cal = data_cal + '<td>' + respuesta_calendario["cal_valores"][nom_calen][fila][Object.keys(respuesta_calendario["cal_valores"][nom_calen][fila])[ee]] + '</td>'
  }
  data_cal = data_cal + '</tr></tbody></table>'

  cal = document.getElementById("calen_resul")
  cal.innerHTML = data_cal
}
function abir_calen2(index_calen, id_div) {

  var div_mod = document.getElementById('intnotaCab')

  v_vinculo = respuesta_calendario["calendarios"][index_calen]["fecha_vin"]
  v_vinculo_lapso = respuesta_calendario["calendarios"][index_calen]["fecha_lapso"]

  nombre_rep = respuesta_calendario["calendarios"][index_calen]["nombre"]

  html_calen = '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span></button><table class="table"><tbody><tr>'


  for (ss = 0; ss <= Object.keys(respuesta_calendario["cal_valores"][nombre_rep][0]).length - 1; ss++) {

    if (Object.keys(respuesta_calendario["cal_valores"][nombre_rep][0])[ss].substring(0, 1) != "$") {
      html_calen = html_calen + '<th>' + Object.keys(respuesta_calendario["cal_valores"][nombre_rep][0])[ss] + '</th>'
    }

  }
  html_calen = html_calen + '<th>Ver</th>'

  html_calen = html_calen + '</tr>'


  for (ss = 0; ss <= respuesta_calendario["cal_valores"][nombre_rep].length - 1; ss++) {

    if (v_vinculo_lapso == '0') {
      var v_fecha = new Date(respuesta_calendario["cal_valores"][nombre_rep][ss][v_vinculo]);

      if (v_fecha.format('Y-m-d') == id_por_fecha[id_div.id]) {
        html_calen = html_calen + '<tr>'


        for (ss3 = 0; ss3 <= Object.keys(respuesta_calendario["cal_valores"][nombre_rep][ss]).length - 1; ss3++) {
          if (Object.keys(respuesta_calendario["cal_valores"][nombre_rep][ss])[ss3].substring(0, 1) != "$") {
            html_calen = html_calen + '<td> ' + respuesta_calendario["cal_valores"][nombre_rep][ss][Object.keys(respuesta_calendario["cal_valores"][nombre_rep][ss])[ss3]] + '</td>'
          }
        }
        if (respuesta_calendario["calendarios"][index_calen]["tipo_link"] == 'Registro') {
          if (respuesta_calendario["calendarios"][index_calen]["link"] != '') {
            link = respuesta_calendario["cal_valores"][nombre_rep][ss]["$link"].toLocaleString().split(',')
            html_calen = html_calen + '<td><a data-dismiss="modal" onclick="registro(' + link[0] + ',' + link[1] + ', 2, -2, 0,0) " style="cursor: pointer;">Abrir</a></td>'
          } else {
            html_calen = html_calen + '<td></td>'
          }



        }
        if (respuesta_calendario["calendarios"][index_calen]["tipo_link"] == 'Tarea') {
          if (respuesta_calendario["calendarios"][index_calen]["link"] != '') {
            link = respuesta_calendario["cal_valores"][nombre_rep][ss]["$link"].toLocaleString().split(',')
            html_calen = html_calen + '<td><a data-dismiss="modal" data-toggle="modal" data-target="#modal-default_alertas" onclick="abrir_tareas(' + link[0] + ',' + link[1] + ')" style="cursor: pointer;">Abrir</a></td>'
          } else {
            html_calen = html_calen + '<td></td>'
          }

        }
        html_calen = html_calen + '</tr>'
      }

    } else {

      var v_fecha = new Date(respuesta_calendario["cal_valores"][nombre_rep][ss][v_vinculo]);
      var v_fecha_lapso = new Date(respuesta_calendario["cal_valores"][nombre_rep][ss][v_vinculo_lapso]);

      if (id_por_fecha[id_div.id] >= v_fecha.format('Y-m-d') && id_por_fecha[id_div.id] <= v_fecha_lapso.format('Y-m-d')) {
        html_calen = html_calen + '<tr>'

        link = respuesta_calendario["cal_valores"][nombre_rep][ss]["$link"].toLocaleString().split(',')

        for (ss3 = 0; ss3 <= Object.keys(respuesta_calendario["cal_valores"][nombre_rep][ss]).length - 1; ss3++) {
          if (Object.keys(respuesta_calendario["cal_valores"][nombre_rep][ss])[ss3].substring(0, 1) != "$") {
            html_calen = html_calen + '<td> ' + respuesta_calendario["cal_valores"][nombre_rep][ss][Object.keys(respuesta_calendario["cal_valores"][nombre_rep][ss])[ss3]] + '</td>'
          }
        }
        if (respuesta_calendario["calendarios"][index_calen]["tipo_link"] == 'Registro') {
          html_calen = html_calen + '<td><a data-dismiss="modal" onclick="registro(' + link[0] + ',' + link[1] + ', 2, -2, 0,0) " style="cursor: pointer;">Abrir</a></td>'
        }
        if (respuesta_calendario["calendarios"][index_calen]["tipo_link"] == 'Tarea') {
          html_calen = html_calen + '<td><a data-dismiss="modal" data-toggle="modal" data-target="#modal-default_alertas" onclick="abrir_tareas(' + link[0] + ',' + link[1] + ')" style="cursor: pointer;">Abrir</a></td>'

        }
        html_calen = html_calen + '</tr>'
      }
    }



  }
  html_calen = html_calen + '</tbody></table>'
  div_mod.innerHTML = html_calen
}

val_por_cal = {}
respuesta_calendario = {}





function Poner_calendario() {
  //z_campos = document.getElementById("calendar_date")
  z_campos = new Date(document.getElementById("calendar_date").value)
  z_campos.addDays(1)
  var v_fecha = new Date(z_campos);
  $.ajax({
    type: "POST",
    url: '/calendar',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'fecha': v_fecha.format('Y-m-d'), 't_mostrar': document.getElementById('calendar_tipo').value, 'usuarioExterno': web_usuarioExterno },
    success: function (data) {
      respuesta_calendario = data
      val_por_cal = {}
      //var tipos_a_mostrar = document.getElementById('calendar_tipo').value
      //z_fecha = document.getElementById("calendar_date")
      z_fecha = new Date(document.getElementById("calendar_date").value)
      z_fecha.addDays(1)
      var fec_d = new Date(z_fecha);

      for (ee = 0; ee <= (data["calendarios"].length - 1); ee++) {

        for (ee2 = 0; ee2 <= (data["cal_valores"][data["calendarios"][ee]["nombre"]].length - 1); ee2++) {
          limite = Object.keys(calendario_val).length - 1
          for (ss = 0; ss <= limite; ss++) {
            if (data["calendarios"][ee]["valor"] != '0') {
              if (data["calendarios"][ee]["fecha_lapso"] == '0') {
                var fec_A = Object.keys(calendario_val)[ss]
                var fec_B = new Date(data["cal_valores"][data["calendarios"][ee]["nombre"]][ee2][data["calendarios"][ee]["fecha_vin"]]);
                var t_valor = parseFloat(data["cal_valores"][data["calendarios"][ee]["nombre"]][ee2][data["calendarios"][ee]["valor"]])
                if (fec_A == fec_B.format('Y-m-d')) {
                  if (val_por_cal[fec_B.format('Y-m-d')] == undefined) {
                    val_por_cal[fec_B.format('Y-m-d')] = {}
                    val_por_cal[fec_B.format('Y-m-d')][ee] = [1, t_valor]
                  } else {
                    if (val_por_cal[fec_B.format('Y-m-d')][ee] == undefined) {
                      val_por_cal[fec_B.format('Y-m-d')][ee] = [1, t_valor]
                    } else {
                      val_por_cal[fec_B.format('Y-m-d')][ee][0] = parseFloat(val_por_cal[fec_B.format('Y-m-d')][ee][0]) + 1
                      val_por_cal[fec_B.format('Y-m-d')][ee][1] = parseFloat(val_por_cal[fec_B.format('Y-m-d')][ee][1]) + parseFloat(t_valor)
                    }
                  }
                }
              } else {
                var fec_A = Object.keys(calendario_val)[ss]
                var fec_B = new Date(data["cal_valores"][data["calendarios"][ee]["nombre"]][ee2][data["calendarios"][ee]["fecha_vin"]]);
                var fec_C = new Date(data["cal_valores"][data["calendarios"][ee]["nombre"]][ee2][data["calendarios"][ee]["fecha_lapso"]]);

                var t_valor = parseFloat(data["cal_valores"][data["calendarios"][ee]["nombre"]][ee2][data["calendarios"][ee]["valor"]])
                if (fec_A >= fec_B.format('Y-m-d') && fec_A <= fec_C.format('Y-m-d')) {
                  if (val_por_cal[fec_A] == undefined) {
                    val_por_cal[fec_A] = {}
                    val_por_cal[fec_A][ee] = [1, t_valor]
                  } else {
                    if (val_por_cal[fec_A][ee] == undefined) {
                      val_por_cal[fec_A][ee] = [1, t_valor]
                    } else {
                      val_por_cal[fec_A][ee][0] = parseFloat(val_por_cal[fec_A][ee][0]) + 1
                      val_por_cal[fec_A][ee][1] = parseFloat(val_por_cal[fec_A][ee][1]) + parseFloat(t_valor)
                    }
                  }
                }
              }
            }
          }



        }
      }
      for (ee = 0; ee <= Object.keys(val_por_cal).length - 1; ee++) {
        var div_cal = document.getElementById(calendario_val[Object.keys(val_por_cal)[ee]])
        for (ee2 = 0; ee2 <= Object.keys(val_por_cal[Object.keys(val_por_cal)[ee]]).length - 1; ee2++) {
          display = data["calendarios"][Object.keys(val_por_cal[Object.keys(val_por_cal)[ee]])[ee2]]["display"]
          valor = parseFloat(val_por_cal[Object.keys(val_por_cal)[ee]][Object.keys(val_por_cal[Object.keys(val_por_cal)[ee]])[ee2]][1]).toFixed(2)
          div_cal.innerHTML = div_cal.innerHTML + '<button type="button" style="width: 100%;font-size: 14px;background: ' + data["calendarios"][Object.keys(val_por_cal[Object.keys(val_por_cal)[ee]])[ee2]]["color"] + ';color: black;cursor: pointer;" class="btn" data-toggle="modal" data-target="#modal-default" onclick="abir_calen2(' + Object.keys(val_por_cal[Object.keys(val_por_cal)[ee]])[ee2] + ', ' + calendario_val[Object.keys(val_por_cal)[ee]] + ')"><i class="' + data["calendarios"][Object.keys(val_por_cal[Object.keys(val_por_cal)[ee]])[ee2]]["icono"] + '" style="text-align: left;"></i><b> ' + display + ': ' + valor + '</b></button>'
        }
      }


      for (ee = 0; ee <= (data["calendarios"].length - 1); ee++) {
        for (ee2 = 0; ee2 <= (data["cal_valores"][data["calendarios"][ee]["nombre"]].length - 1); ee2++) {
          limite = Object.keys(calendario_val).length - 1
          for (ss = 0; ss <= limite; ss++) {

            if (data["calendarios"][ee]["valor"] == '0') {
              if (data["calendarios"][ee]["fecha_lapso"] == '0') {
                var fec_A = Object.keys(calendario_val)[ss]

                var fec_B = new Date(data["cal_valores"][data["calendarios"][ee]["nombre"]][ee2][data["calendarios"][ee]["fecha_vin"]]);
                var t_valor = parseFloat(data["cal_valores"][data["calendarios"][ee]["nombre"]][ee2][data["calendarios"][ee]["valor"]])

                if (fec_A == fec_B.format('Y-m-d')) {
                  var div_cal = document.getElementById(calendario_val[fec_A])

                  display = data["cal_valores"][data["calendarios"][ee]["nombre"]][ee2][data["calendarios"][ee]["display"]]
                  if (data["calendarios"][ee]["tipo_link"] == 'Registro') {


                    link = data["cal_valores"][data["calendarios"][ee]["nombre"]][ee2][data["calendarios"][ee]["link"]].toLocaleString().split(',')

                    //var now = new Date(document.getElementById('calendar_date').value);
                    now = new Date(document.getElementById("calendar_date").value)
                    now.addDays(1)
                    if (link[1] == 'Nuevo') {
                      div_cal.innerHTML = div_cal.innerHTML + '<div type="button" style="width: 100%;font-size: 14px;background: ' + data["calendarios"][ee]["color"] + ';color: black;cursor: pointer;padding-top: 5px;padding-bottom: 5px;padding-left: 5px;padding-right: 5px;" class="col-sx-5" onClick="registro_cal(' + link[0] + ', d' + now.format('Y-m-d').replace(/-/g, 'Q') + ',  ' + 0 + ', 0, -1, 0)"><i class="' + data["calendarios"][ee]["icono"] + '" style="text-align: center;"></i>' + display + '</div>' // mes

                    } else {
                      div_cal.innerHTML = div_cal.innerHTML + '<div type="button" style="width: 100%;font-size: 14px;background: ' + data["calendarios"][ee]["color"] + ';color: black;cursor: pointer;padding-top: 5px;padding-bottom: 5px;padding-left: 5px;padding-right: 5px;" class="col-sx-5" onClick="registro_cal(' + link[0] + ', d' + now.format('Y-m-d').replace(/-/g, 'Q') + ',  ' + link[1] + ', 2, -1, 0)"><i class="' + data["calendarios"][ee]["icono"] + '" style="text-align: center;"></i>' + display + '</div>' // mes

                    }

                  }
                }

              } else {
                var fec_A = Object.keys(calendario_val)[ss]
                var fec_B = new Date(data["cal_valores"][data["calendarios"][ee]["nombre"]][ee2][data["calendarios"][ee]["fecha_vin"]]);
                var fec_C = new Date(data["cal_valores"][data["calendarios"][ee]["nombre"]][ee2][data["calendarios"][ee]["fecha_lapso"]]);
                var t_valor = parseFloat(data["cal_valores"][data["calendarios"][ee]["nombre"]][ee2][data["calendarios"][ee]["valor"]])
                if (fec_A >= fec_B.format('Y-m-d') && fec_A <= fec_C.format('Y-m-d')) {

                  var div_cal = document.getElementById(calendario_val[fec_A])


                  if (data["calendarios"][ee]["link"] != '') {
                    link = data["cal_valores"][data["calendarios"][ee]["nombre"]][ee2][data["calendarios"][ee]["link"]].toLocaleString().split(',')

                  } else {
                    link = [0, 0]

                  }



                  if (data["calendarios"][ee]["tipo_link"] == 'Registro') {
                    display = data["cal_valores"][data["calendarios"][ee]["nombre"]][ee2][data["calendarios"][ee]["display"]]


                    div_cal.innerHTML = div_cal.innerHTML + '<div type="button" onclick="registro(' + link[0] + ',' + link[1] + ', 2, -2, 0,0)" style="width: 100%;font-size: 14px;background: ' + data["calendarios"][ee]["color"] + ';color: black;cursor: pointer;padding-top: 5px;padding-bottom: 5px;padding-left: 5px;padding-right: 5px;" class="col-sx-5"><i class="' + data["calendarios"][ee]["icono"] + '" style="text-align: center;" ></i>' + display + '</div>'




                  }
                  if (data["calendarios"][ee]["tipo_link"] == 'Tarea') {
                    display = data["cal_valores"][data["calendarios"][ee]["nombre"]][ee2][data["calendarios"][ee]["display"]]

                    div_cal.innerHTML = div_cal.innerHTML + '<div type="button" onclick="abrir_tareas(' + link[0] + ',' + link[1] + ')" style="width: 100%;font-size: 14px;background: ' + data["calendarios"][ee]["color"] + ';color: black;cursor: pointer;padding-top: 5px;padding-bottom: 5px;padding-left: 5px;padding-right: 5px;" class="col-sx-5"  data-toggle="modal" data-target="#modal-default_alertas"><i class="' + data["calendarios"][ee]["icono"] + '" style="text-align: center;" ></i>' + display + '</div>'
                  }

                }
              }
            }
          }
          var fec_B = new Date(data["cal_valores"][data["calendarios"][ee]["nombre"]][ee2][data["calendarios"][ee]["fecha_vin"]]);

          if (data["calendarios"][ee]["valor"] == '0') {

            if (fec_d.getWeek() == fec_B.getWeek()) {

              horass = fec_B.format('H')
              if (parseInt(horass) < 8) { horass = '07' }
              if (parseInt(horass) > 21) { horass = '21' }

              if (fec_B.getDay() == 0) {
                var div_cal_dia = document.getElementById('dia_' + horass + '_' + (fec_B.getDay()))
              } else {
                var div_cal_dia = document.getElementById('dia_' + horass + '_' + (fec_B.getDay() - 1))
              }

              display = data["cal_valores"][data["calendarios"][ee]["nombre"]][ee2][data["calendarios"][ee]["display"]]


              //var now = new Date(document.getElementById('calendar_date').value);
              now = new Date(document.getElementById("calendar_date").value)
              now.addDays(1)

              if (data["calendarios"][ee]["link"] != '') {
                link = data["cal_valores"][data["calendarios"][ee]["nombre"]][ee2][data["calendarios"][ee]["link"]].toLocaleString().split(',')
                if (link.length == 2) { link.append(0) }
              } else {
                link = [0, 0, 0]
              }

              if (link[1] == "Nuevo") {

                //div_cal_dia.innerHTML = '<div type="button" style="width: 100%;font-size: 14px;background: ' + data["calendarios"][ee]["color"] + ';color: black;cursor: pointer;padding-top: 5px;padding-bottom: 5px;padding-left: 5px;padding-right: 5px;" class="col-sx-5" onClick="registro_cal_directo(' + link[0] + ', \'' + fec_B.format('Y-m-d H:i') + '\',  ' + 0 + ', 0, -1, 0,  ' + link[2].replace(/;/g, ',') + ')"><i class="' + data["calendarios"][ee]["icono"] + '" style="text-align: center;"></i>' + display + '</div>' + div_cal_dia.innerHTML // semana
                div_cal_dia.innerHTML = '<div type="button" style="width: 100%;font-size: 14px;background: ' + data["calendarios"][ee]["color"] + ';color: black;cursor: pointer;padding-top: 5px;padding-bottom: 5px;padding-left: 5px;padding-right: 5px;" class="col-sx-5" onClick="registro_cal_directo(' + link[0] + ', \'' + fec_B.format('Y-m-d H:i') + '\',  ' + 0 + ', 0, -1, 0,  ' + link[2].replace(/;/g, ',') + ')"><i class="' + data["calendarios"][ee]["icono"] + '" style="text-align: center;"></i>' + display + '</div>' + div_cal_dia.innerHTML // semana
                 

              } else {
                div_cal_dia.innerHTML = '<div type="button" style="width: 100%;font-size: 14px;background: ' + data["calendarios"][ee]["color"] + ';color: black;cursor: pointer;padding-top: 5px;padding-bottom: 5px;padding-left: 5px;padding-right: 5px;" class="col-sx-5" onClick="registro_cal_directo(' + link[0] + ', \'' + fec_B.format('Y-m-d H:i') + '\',  ' + link[1] + ', 2, -1, 0,  ' + link[2].replace(/;/g, ',') + ')"><i class="' + data["calendarios"][ee]["icono"] + '" style="text-align: center;"></i>' + display + '</div>' + div_cal_dia.innerHTML // semana
              }




              if (data["calendarios"][ee]["valor"] == '0') {
                if (fec_d.getDate() == (fec_B.getDate())) {
                  horass = fec_B.format('H')
                  if (parseInt(horass) < 8) { horass = '07' }
                  if (parseInt(horass) > 21) { horass = '21' }

                  var div_cal_dia = document.getElementById('du_' + horass)
                  display = data["cal_valores"][data["calendarios"][ee]["nombre"]][ee2][data["calendarios"][ee]["display"]]
                  //var now = new Date(document.getElementById('calendar_date').value);
                  now = new Date(document.getElementById("calendar_date").value)
                  now.addDays(1)
                  link = data["cal_valores"][data["calendarios"][ee]["nombre"]][ee2]["$link"].toLocaleString().split(',')

                  if (link[1] == "Nuevo") {
                    //div_cal_dia.innerHTML = '<div type="button" style="width: 100%;font-size: 14px;background: ' + data["calendarios"][ee]["color"] + ';color: black;cursor: pointer;padding-top: 5px;padding-bottom: 5px;padding-left: 5px;padding-right: 5px;" class="col-sx-5" onClick="registro_cal(' + link[0] + ', d' + now.format('Y-m-d').replace(/-/g, 'Q') + ',  ' + 0 + ', 0, -1, 0)"><i class="' + data["calendarios"][ee]["icono"] + '" style="text-align: center;"></i>' + display + '**1</div>' + div_cal_dia.innerHTML // dia
                    div_cal_dia.innerHTML = '<div type="button" style="width: 100%;font-size: 14px;background: ' + data["calendarios"][ee]["color"] + ';color: black;cursor: pointer;padding-top: 5px;padding-bottom: 5px;padding-left: 5px;padding-right: 5px;" class="col-sx-5" onClick="registro_cal_directo(' + link[0] + ', \'' + fec_B.format('Y-m-d H:i') + '\',  ' + 0 + ', 0, -1, 0,  ' + link[2].replace(/;/g, ',') + ')"><i class="' + data["calendarios"][ee]["icono"] + '" style="text-align: center;"></i>' + display + '</div>' + div_cal_dia.innerHTML // semana

                  } else {
                    //div_cal_dia.innerHTML = '<div type="button" style="width: 100%;font-size: 14px;background: ' + data["calendarios"][ee]["color"] + ';color: black;cursor: pointer;padding-top: 5px;padding-bottom: 5px;padding-left: 5px;padding-right: 5px;" class="col-sx-5" onClick="registro_cal(' + link[0] + ', d' + now.format('Y-m-d').replace(/-/g, 'Q') + ',  ' + link[1] + ', 2, -1, 0)"><i class="' + data["calendarios"][ee]["icono"] + '" style="text-align: center;"></i>' + display + '**2</div>' + div_cal_dia.innerHTML // dia
                    div_cal_dia.innerHTML = '<div type="button" style="width: 100%;font-size: 14px;background: ' + data["calendarios"][ee]["color"] + ';color: black;cursor: pointer;padding-top: 5px;padding-bottom: 5px;padding-left: 5px;padding-right: 5px;" class="col-sx-5" onClick="registro_cal_directo(' + link[0] + ', \'' + fec_B.format('Y-m-d H:i') + '\',  ' + link[1] + ', 2, -1, 0,  ' + link[2].replace(/;/g, ',') + ')"><i class="' + data["calendarios"][ee]["icono"] + '" style="text-align: center;"></i>' + display + '</div>' + div_cal_dia.innerHTML // semana
              

                  }

                }
              }




            }
          }

        }
      }


    }
  });

}

function calendario_semana() {

}


function traer_calendario_tipo() {
  //z_campos = document.getElementById("calendar_date")
  z_campos = new Date(document.getElementById("calendar_date").value)
  z_campos.addDays(1)
  var v_fecha = new Date(z_campos);
  $.ajax({
    type: "POST",
    url: '/calendar',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'fecha': v_fecha.format('Y-m-d'), 't_mostrar': document.getElementById('calendar_tipo').value },
    success: function (data) {
      respuesta_calendario = data
      val_por_cal = {}
      var tipos_a_mostrar = document.getElementById('calendar_tipo').value

      new_display = '<option>Todos</option>'
      for (ee = 0; ee <= (data["calendarios"].length - 1); ee++) {


        new_display = new_display + '<option style="background-color: ' + data["calendarios"][ee]["color"] + ';">' + data["calendarios"][ee]["nombre"] + '</option>'


      }

      var cmb_tipo = document.getElementById('calendar_tipo')
      cmb_tipo.innerHTML = new_display

      if(data["calendarios"].length > 0){
        cmb_tipo.value = web_calen_Preselecion
        // cmb_tipo.value = data["calendarios"][0]["nombre"]
      }else{
        cmb_tipo.value = 'Todos'
      }

      calendario()

    }
  });

}



function registro_cal_directo(pkmodulo, id_fecha, pkregistro, tipo, temp_pestalla, origen, data) {


    fecha_dir = id_fecha
  
    pestalla = pestalla + 1;
    if (temp_pestalla == '-2') {
      temp_pestalla = 'consulta'
    }
  
    if (temp_pestalla == 'consulta') {
      $("#myTab").prepend('<li role="presentation" class="" id="li' + pestalla + '" style="text-align: right;"><a href="#rr' + pestalla + '" id="id' + pestalla + '" role="tab" data-toggle="tab" aria-expanded="false">Consulta <i class="fa fa-times" style="color: red; background: transparent;cursor: pointer;" onclick="cerrar_elemento(' + pestalla + ')"></i></a></li>');
  
  
    } else {
      if (temp_pestalla == -1) {
        $("#myTab").prepend('<li role="presentation" class="" id="li' + pestalla + '" style="text-align: right;"><a href="#rr' + pestalla + '" id="id' + pestalla + '" role="tab" data-toggle="tab" aria-expanded="false">Nuevo <i class="fa fa-times" style="color: red; background: transparent;cursor: pointer;" onclick="cerrar_elemento(' + pestalla + ')"></i></a></li>');
  
      } else {
  
        if (dict_pestalla['p-' + temp_pestalla]["tabla_cab"] == undefined) {
          $("#myTab").prepend('<li role="presentation" class="" id="li' + pestalla + '" style="text-align: right;"><a href="#rr' + pestalla + '" id="id' + pestalla + '" role="tab" data-toggle="tab" aria-expanded="false">' + dict_pestalla['p-' + temp_pestalla]["tabla"][0]["Descripcion"] + ' <i class="fa fa-times" style="color: red; background: transparent;cursor: pointer;" onclick="cerrar_elemento(' + pestalla + ')"></i></a></li>');
  
        } else {
  
          $("#myTab").prepend('<li role="presentation" class="" id="li' + pestalla + '" style="text-align: right;"><a href="#rr' + pestalla + '" id="id' + pestalla + '" role="tab" data-toggle="tab" aria-expanded="false" >' + dict_pestalla['p-' + temp_pestalla]["tabla_cab"]["Descripcion"] + ' <i class="fa fa-times" style="color: red; background: transparent;cursor: pointer;" onclick="cerrar_elemento(' + pestalla + ')"></i> </a></li>');
        }
      }
  
  
  
    }
  
  
  
    var id_tab = pkmodulo
    if (tipo == 0) { tipo = 'Nuevo' }
    if (tipo == 1) { tipo = 'modificar' }
    if (tipo == 2) { tipo = 'consulta' }
    if (tipo == 3) { tipo = 'consulta_nuevo' }
  
    $.ajax({
      type: 'POST',
      url: '/' + web_idioma + '/consulta',
      data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'pkmodulo': pkmodulo, 'pestalla': pestalla, 'pkregistro': pkregistro, 'tipo': tipo, 't_clave': 0 },
      beforeSend: function () {
        $("#myTabContent").prepend('<div role="tabpanel" class="tab-pane fade" id="rr' + pestalla + '" aria-labelledby="id' + pestalla + '" style="background-color: transparent;"> Procesando </div>');
      },
      success: function (Response) {
  
  
        $('#rr' + Response["dev_pestalla"]).html('');
  
        id_dic = 'p-' + Response["dev_pestalla"]
        dict_pestalla[id_dic] = Response
        dict_pestalla[id_dic]['tipo'] = tipo
  
        cc_porPesta[id_dic] = 1
  
        div_botones = '<div class="box-header with-border" style="margin-left: 0px;margin-right: 0px;background: white;padding: 0px;"><div class="col-md-12"><div class="row">'
        readonly = 'readonly="readonly"'
        if (tipo == 'consulta') {
  
          readonly = 'readonly="readonly"'
          //div_botones =div_botones +'<button type="button" onclick="cerrar_elemento(' + pestalla + ')" class="btn bg-blue btn-flat margin"><span>Correo</span></button>'
          if (dict_pestalla[id_dic]["plantilla_pdf"]["plantillasMain"].length > 0) {
            //div_botones =div_botones +'<button type="button" onclick="pdf_elemento(' + Response["dev_pestalla"] + ')" class="btn bg-blue btn-flat margin"><span>PDF</span></button>'
            for (dd = 0; dd < dict_pestalla[id_dic]["plantilla_pdf"]["plantillasMain"].length; dd++) {
              div_botones = div_botones + '<button type="button" onclick="pdf_elemento(' + Response["dev_pestalla"] + ', ' + dd + ')" class="btn bg-blue btn-flat margin"><span>' + dict_pestalla[id_dic]["plantilla_pdf"]["plantillasMain"][dd]['Nombre'] + '</span></button>'
  
            }
  
          }
          //div_botones =div_botones +'<button type="button" onclick="excell_elemento(' + pestalla + ')" class="btn bg-blue btn-flat margin"><span>Excell</span></button>'
          if (origen == '1') {
            div_botones = div_botones + '<button class="btn bg-blue btn-flat margin" onclick="cerrar_elemento(' + Response["dev_pestalla"] + ');registro(' + Response["tabla_cab"]["PkModulo"] + ',0,0,' + Response["dev_pestalla"] + ',0,0)">Nuevo</span></button>'
          }
  
          for (x = 0; x < Response["estados"].length; x++) {
            if (Response["estados"][x]["estado_inicial"] == Response["valores_cab"][0][Response["estados"][x]["c_estado"]]) {
              div_botones = div_botones + '<button class="' + Response["estados"][x]["color"] + '" onclick="cambio_estado(' + Response["tabla_cab"]["PkModulo"] + ',' + Response["valores_cab"][0][Response["estados"][x]["pkregistro"]] + ',' + Response["estados"][x]["pkweb_estados_doc"] + ', ' + Response["dev_pestalla"] + ')">' + Response["estados"][x]["display"] + '</span></button>'
            }
            if (Response["estados"][x]["estado_inicial"] == '' && Response["estados"][x]["estado_final"] != Response["valores_cab"][0][Response["estados"][x]["c_estado"]]) {
              div_botones = div_botones + '<button class="' + Response["estados"][x]["color"] + '" onclick="cambio_estado(' + Response["tabla_cab"]["PkModulo"] + ',' + Response["valores_cab"][0][Response["estados"][x]["pkregistro"]] + ',' + Response["estados"][x]["pkweb_estados_doc"] + ', ' + Response["dev_pestalla"] + ')">' + Response["estados"][x]["display"] + '</span></button>'
  
            }
          }
  
        }
  
  
        else {
          if (tipo == 'Nuevo') {
            disparador = 'Guardar Registro Nuevo'
            //div_botones =div_botones +'<button type="button" id="btn_grabar_'+pestalla+'" onclick="this.disabled=true;click_val(1);grabar_elemento(' + Response["dev_pestalla"] + ',0)" class="btn bg-green btn-flat margin"><span>Grabar</span></button>'
            if (pkregistro == '0') {
              div_botones = div_botones + '<button type="button" id="btn_grabar_' + pestalla + '" onclick="grabar_elemento(' + Response["dev_pestalla"] + ',2)" class="btn bg-green btn-flat margin"><span>Grabar</span></button>'
  
            } else {
              div_botones = div_botones + '<button type="button" id="btn_grabar_' + pestalla + '" onclick="grabar_elemento(' + Response["dev_pestalla"] + ',3)" class="btn bg-green btn-flat margin"><span>Grabar</span></button>'
  
            }
          } else {
            disparador = 'Modificar Registro'
            //div_botones =div_botones +'<button  type="button" id="btn_mod_'+pestalla+'" onclick="this.disabled=true;click_val(1);grabar_elemento(' + Response["dev_pestalla"] + ',1)" class="btn bg-green btn-flat margin"><span>Grabar</span></button>'
            if (pkregistro == '0') {
              div_botones = div_botones + '<button  type="button" id="btn_mod_' + pestalla + '" onclick="grabar_elemento(' + Response["dev_pestalla"] + ',2)" class="btn bg-green btn-flat margin"><span>Grabar</span></button>'
  
  
  
  
  
            } else {
              div_botones = div_botones + '<button  type="button" id="btn_mod_' + pestalla + '" onclick="grabar_elemento(' + Response["dev_pestalla"] + ',3)" class="btn bg-green btn-flat margin"><span>Grabar</span></button>'
  
              for (x = 0; x < Response["estados"].length; x++) {
                if (Response["estados"][x]["estado_inicial"] == Response["valores_cab"][0][Response["estados"][x]["c_estado"]]) {
                  div_botones = div_botones + '<button class="' + Response["estados"][x]["color"] + '" onclick="grabar_elemento(' + Response["dev_pestalla"] + ',3); cambio_estado(' + Response["tabla_cab"]["PkModulo"] + ',' + Response["valores_cab"][0][Response["estados"][x]["pkregistro"]] + ',' + Response["estados"][x]["pkweb_estados_doc"] + ', ' + Response["dev_pestalla"] + ');">' + Response["estados"][x]["display"] + '</span></button>'
                }
                if (Response["estados"][x]["estado_inicial"] == '' && Response["estados"][x]["estado_final"] != Response["valores_cab"][0][Response["estados"][x]["c_estado"]]) {
                  div_botones = div_botones + '<button class="' + Response["estados"][x]["color"] + '" onclick="grabar_elemento(' + Response["dev_pestalla"] + ',3); cambio_estado(' + Response["tabla_cab"]["PkModulo"] + ',' + Response["valores_cab"][0][Response["estados"][x]["pkregistro"]] + ',' + Response["estados"][x]["pkweb_estados_doc"] + ', ' + Response["dev_pestalla"] + ');">' + Response["estados"][x]["display"] + '</span></button>'
  
                }
              }
  
            }
  
          }
  
  
          div_botones = div_botones + '<button type="button" onclick="validar_registro(' + Response["dev_pestalla"] + ')" class="btn bg-yellow btn-flat margin"><span>Validar</span></button>'
          //div_botones =div_botones +'<button type="button" onclick="nuevo_elemento(' + Response["dev_pestalla"] + ')" class="btn bg-blue btn-flat margin"><span>Nuevo</span></button>'
          readonly = ''
        }
  
        //div_botones =div_botones +'<button type="button" onclick="cerrar_elemento(' + Response["dev_pestalla"] + ')" class="btn bg-red btn-flat margin"><span>Cerrar</span></button>'
  
        div_botones = div_botones + '</div></div></div>'
  
        $('#rr' + Response["dev_pestalla"]).append(div_botones);
        div_campos2 = ''
        div_campos = '<div class="box-body" style="background: white;"> <div class="row">'
        div_campos_arriba_izq = ''
        div_campos_arriba_der = ''
        div_campos_abajo_izq = ''
        div_campos_abajo_der = ''
        div_c_t = ''
        for (x = 0; x < Response["campos_cab"].length; x++) {
  
          if (tipo == 'Nuevo') {
  
            if (Response["campos_cab"][x]["TablaCampo"] == "cmpformquery") {
              valor_campo = ''
  
            }
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
  
              if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["PkId"] == 5) {
                valor_campo = web_usuarioExterno
  
              }
            }
            if (Response["campos_cab"][x]["TablaCampo"] == "cmpformuladetalle") {
              valor_campo = 0
            }
            if (Response["campos_cab"][x]["TablaCampo"] == "cmpfecha") {
              var now = new Date(fecha_dir);
              if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Tiempo"] == "Y") {
                valor_campo = now.format("Y-m-d") + 'T' + now.format("H:i:00")
              } else {
                now.addDays(1)
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
            if(data != '0'){
              for (ss = 0; ss < Object.keys(data).length; ss++) {
                if(Response["campos_cab"][x]["Nombre"] == Object.keys(data)[ss]){
                  valor_campo= data[Object.keys(data)[ss]]
                }

              } 
            }

          } else {
            valor_campo = Response["valores_cab"][0][Response["campos_cab"][x]["Nombre"]]
  
            if (Response["campos_cab"][x]["TablaCampo"] == "cmpfecha") {
  
              var now = new Date(Response["valores_cab"][0][Response["campos_cab"][x]["Nombre"]]);
              if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Tiempo"] == "Y") {
                valor_campo = now.format("Y-m-d") + 'T' + now.format("H:i:s")
              } else {
                now.addDays(1)
                valor_campo = now.format("Y-m-d");
              }
  
  
            }
          }
  
          if (tipo == 'modificar') {
            readonly = ''
            if (Response["campos_cab"][x]["Modificable"] == 'No') {
              readonly = 'readonly="readonly"'
            }
  
          }
  
  
          ID_TAG = 'p' + Response["pestalla"] + 'zzz' + Response["campos_cab"][x]["Nombre"] + '';
  
          if (Response["campos_cab"][x]["Visible"] == "Y") {
  
  
            div_c_t = Response["campos_cab"][x]["saltoweb"]
            div_c_t = div_c_t + '<div class="col-sm-' + Response["campos_cab"][x]["largoweb"] + '">'
            div_c_t = div_c_t + '<label class="control-label for="' + Response["campos_cab"][x]["Nombre"] + '" style="font-size: 12px;font-weight: bold;">' + Response["campos_cab"][x]["Descripcion"] + '</label>'
  
  
  
            if (Response["campos_cab"][x]["TablaCampo"] == "cmpformquery") {
              readonly_int = ''
              div_c_t = div_c_t + '<div type="button" style="width: 100%;font-size: 10px;background: yellow;color: black;cursor: pointer;padding-top: 5px;padding-bottom: 5px;padding-left: 5px;padding-right: 5px;" class="col-sx-5" data-toggle="modal" data-target="#modal-default_formulas">if(orden_produccion.Contrato = "10",orden_produccion.Secuencial + orden_produccion.Contrato * (1) * [cant],0)</div>'
  
            }
            if (Response["campos_cab"][x]["TablaCampo"] == "cmptxtsimple") {
             
              readonly_int = ''
              if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Modificable"] == "N") {
                readonly_int = 'readonly="readonly"'
              }
              if (tipo == 'Nuevo') {
                if(valor_campo == ''){
                  valor_campo = Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["ValorPredeterminado"]
                } 
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
              if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["PkId"] == 5) {
                div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" readonly="readonly" style="height: 25px;font-size: 11px;">'
              }
  
  
              if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Nombre"] == "Lista usuarios") {
  
                div_c_t = div_c_t + '<select id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" readonly="readonly" style="height: 25px;font-size: 11px;">'
  
                for (zxz = 0; zxz < web_user.length; zxz++) {
                  div_c_t = div_c_t + '<option>' + web_user[zxz] + '</option>'
                }
                div_c_t = div_c_t + '</select>'
  
              }
            }
            if (Response["campos_cab"][x]["TablaCampo"] == "cmpformuladetalle") {
  
              div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" readonly="readonly" onchange="guardar_calcular(' + ID_TAG + ' , 0 )" style="text-align: right;height: 25px;font-size: 11px;">'
            }
            if (Response["campos_cab"][x]["TablaCampo"] == "cmpfecha") {
              if (Response["campos_cab"][x]["Modificable"] == 'No') {
                readonly = 'readonly="readonly"'
              }
              tipodato = 'date'
  
              if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Tiempo"] == 'Y') {
                tipodato = 'datetime-local'
              }
              div_c_t = div_c_t + '<input type="' + tipodato + '" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 25px;font-size: 11px;line-height: 7px;">'
            }
            if (Response["campos_cab"][x]["TablaCampo"] == "cmpreferencia") {
              div_c_t = div_c_t + '<div class="input-group input-group-sm" style="width: 100%;">'
  
  
              if (tipo != 'consulta') {
  
  
                if (tipo == 'modificar') {
                  if (Response["campos_cab"][x]["Modificable"] == 'No') {
                    div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + (Response["campos_cab"][x]["largoweb"] - 1) + '" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 25px;font-size: 11px;" onkeypress="return runScript(event, ' + ID_TAG + ')" >'
                  } else {
                    if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["pkmodulo_ingreso"] != 0) {
                      div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + (Response["campos_cab"][x]["largoweb"] - 1) + '" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="width: 65%;height: 25px;font-size: 11px;" onkeypress="return runScript(event, ' + ID_TAG + ')" >'
                      div_c_t = div_c_t + '<button type="button" class="btn btn-info" data-toggle="modal" data-target=".bs-example-modal-lg" onclick="buscar_referencia_cabecera(' + ID_TAG + ' )"style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></button>'
  
  
                      div_c_t = div_c_t + '<button type="button" class="btn btn-info"  onclick="registro(' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["pkmodulo_ingreso"] + ',0,0,-1,0,0)" style="height: 25px;padding: 3px 4px;"><i class="fa fa-plus"></i></button>'
                    } else {
                      div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + (Response["campos_cab"][x]["largoweb"] - 1) + '" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="width: 85%;height: 25px;font-size: 11px;" onkeypress="return runScript(event, ' + ID_TAG + ')" >'
                      div_c_t = div_c_t + '<button type="button" class="btn btn-info" data-toggle="modal" data-target=".bs-example-modal-lg" onclick="buscar_referencia_cabecera(' + ID_TAG + ' )"style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></button>'
  
                    }
                  }
  
  
  
                } else {
                  if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["pkmodulo_ingreso"] != 0) {
                    div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + (Response["campos_cab"][x]["largoweb"] - 1) + '" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="width: 65%;height: 25px;font-size: 11px;" onkeypress="return runScript(event, ' + ID_TAG + ')" >'
                    div_c_t = div_c_t + '<button type="button" class="btn btn-info" data-toggle="modal" data-target=".bs-example-modal-lg" onclick="buscar_referencia_cabecera(' + ID_TAG + ' )"style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></button>'
  
  
                    div_c_t = div_c_t + '<button type="button" class="btn btn-info"  onclick="registro(' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["pkmodulo_ingreso"] + ',0,0,-1,0,0)" style="height: 25px;padding: 3px 4px;"><i class="fa fa-plus"></i></button>'
                  } else {
                    div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + (Response["campos_cab"][x]["largoweb"] - 1) + '" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="width: 85%;height: 25px;font-size: 11px;" onkeypress="return runScript(event, ' + ID_TAG + ')" >'
                    div_c_t = div_c_t + '<button type="button" class="btn btn-info" data-toggle="modal" data-target=".bs-example-modal-lg" onclick="buscar_referencia_cabecera(' + ID_TAG + ' )"style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></button>'
  
                  }
                }
  
  
  
              } else {
                div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + (Response["campos_cab"][x]["largoweb"] - 1) + '" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="width: 85%;height: 25px;font-size: 11px;"" onkeypress="return runScript(event, ' + ID_TAG + ')" >'
                if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["pkmod_consul"] != '0') {
                  div_c_t = div_c_t + '<button type="button" class="btn btn-info" onclick="registro(' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["pkmod_consul"] + ', ' + Response["valores_cab"][0][Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["campo_fk"]] + ', 2, -2, 0,0)" style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;"><span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span></button>'
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
            if (Response["campos_cab"][x]["TablaCampo"] == "cmpcondicional") {
  
              div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" onchange="guardar_calcular(' + ID_TAG + ', 0)" style="height: 25px;font-size: 11px;">'
            }
            if (Response["campos_cab"][x]["TablaCampo"] == "cmparchivo") {
  
              //div_c_t = div_c_t + '<input type="file" id="'+ ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="'+ valor_campo +'" '+ readonly +' style="height: 25px;font-size: 11px;">'
              div_c_t = div_c_t + '<div class="thumbnail" style="height: 160px;margin-bottom: 1px;"><div class="image view view-first"><a id="' + ID_TAG + '_label" href="https://www.cerocodigo.com/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" target="_blank" style="font-size: 11px;"><img style="width: 100%;height: 60%;margin-left: auto;margin-right: auto; display: block;" id="' + ID_TAG + '_img" src="https://www.cerocodigo.com/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" alt="image" value="' + valor_campo + '">' + valor_campo + '</a>'
  
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
        $('#rr' + Response["pestalla"]).append(div_campos);
  
        document.getElementById('id' + Response["pestalla"]).click();
  
  
  
  
        if (typeof (Response["campos_det"]) == "object") {
          readonly = ''
  
          var largo_tabla = 0
          for (x = 0; x < Response["campos_det"].length; x++) {
            if (Response["campos_det"][x]["Visible"] == "Y") {
              largo_tabla = largo_tabla + parseFloat(Response["campos_det"][x]["largo"])
  
            }
          }
  
          if (tipo == 'consulta') {
            readonly = 'readonly="readonly"'
  
            div_campos = '<div id="divtabla' + Response["pestalla"] + '" class="box-body tableFixHead" style="background: white; overflow: auto;overflow-y: auto;padding-top: 20px; height: 100%;"><table id="tabla' + Response["pestalla"] + '" class="table table-striped" style="width: ' + parseInt(largo_tabla) + 'px;overflow-x:auto;font-size: 11px;background: white;"><thead><tr>'
  
  
          } else {
            div_campos = '<div id="divtabla' + Response["pestalla"] + '" class="box-body tableFixHead" style="background: white; overflow: auto;overflow-y: auto;padding-top: 20px; height: 100%;"><table id="tabla' + Response["pestalla"] + '" class="table table-striped" style="width: ' + parseInt(largo_tabla) + 'px;overflow-x:auto;font-size: 11px;background: white;"><thead><tr><th style="width: 20px;">'
  
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
              div_campos = div_campos + '<tr id="f' + Response["pestalla"] + '-f' + i + '" style="background: white;">'
            } else {
              div_campos = div_campos + '<tr id="f' + Response["pestalla"] + '-f' + i + '" style="background: white;"><td><div class=""  style="padding-left: 10px;">'
  
              div_campos = div_campos + '<button type="button" onclick="menos(' + Response["pestalla"] + ',' + i + ', 0)" class="btn bg-red btn-flat margin" style="padding: 3px 10px;margin-right: 10px;">-</button>'
  
  
              div_campos = div_campos + '</div></td>'
            }
  
            altura_mini = 45
  
            for (x = 0; x < Response["campos_det"].length; x++) {
  
              valor_campo = 0;
              if (tipo == 'Nuevo') {
  
                if (Response["campos_det"][x]["TablaCampo"] == "cmpformquery") {
                  valor_campo = 'Crear Formula'
                }
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
                div_campos = div_campos + '<td style="padding-left: 0px;padding-right: 5px;"><div style="width: ' + Response["campos_det"][x]["largo"] + 'px;">'
  
  
                if (Response["campos_det"][x]["TablaCampo"] == "cmpformquery") {
                  readonly_int = ''
                  div_campos = div_campos + '<div id="' + id_tag_detalle + '" type="button" style="width: 100%;font-size: 10px;background: yellow;color: black;cursor: pointer;padding-top: 5px;padding-bottom: 5px;padding-left: 5px;padding-right: 5px;" class="col-sx-5" data-toggle="modal" data-target="#modal-default_formulas" onclick="abrirformula(' + id_tag_detalle + ')">' + valor_campo + '</div>'
                }
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
                        div_campos = div_campos + '<option selected>' + Response["func_det"][Response["campos_det"][x]["Nombre"]][z]["Valor"] + '</option>'
                      } else {
                        div_campos = div_campos + '<option>' + Response["func_det"][Response["campos_det"][x]["Nombre"]][z]["Valor"] + '</option>'
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
                    div_campos = div_campos + '<div class="input-group" style="width: 100%;""><input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;" onkeypress="return runScript_detalle(event, ' + id_tag_detalle + ')">'
                    div_campos = div_campos + '</div>'
                  } else {
  
                    div_campos = div_campos + '<div class="input-group" style="width: 100%;"><input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="width: 75%;height: 25px;font-size: 11px;" onkeypress="return runScript_detalle(event, ' + id_tag_detalle + ')">'
                    div_campos = div_campos + '<button type="button" class="btn btn-info" data-toggle="modal" data-target=".bs-example-modal-lg" onclick="buscar_referencia_detalle(' + id_tag_detalle + ' )" style="height: 25px;padding: 3px 4px;margin-top: 0px;margin-bottom: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></button></div>'
                  }
                }
                if (Response["campos_det"][x]["TablaCampo"] == "cmpreferenciaadjunto") {
                  if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Tipo"] == 'Imagen') {
  
                    div_campos = div_campos + '<div class="thumbnail" style="height: 160px;margin-bottom: 1px;"><div class="image view view-first"><a id="' + id_tag_detalle + '_label" href="https://www.cerocodigo.com/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" target="_blank"><img style="width: 100%;height: 60%;margin-left: auto;margin-right: auto; display: block;" id="' + id_tag_detalle + '_img" src="https://www.cerocodigo.com/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" alt="image" value="' + valor_campo + '">' + valor_campo + '</a>'
  
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
                  div_campos = div_campos + '<div class="thumbnail" style="height: 160px;margin-bottom: 1px;"><div class="image view view-first"><a id="' + id_tag_detalle + '_label" href="https://www.cerocodigo.com/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" target="_blank" style="font-size: 11px;"><img style="width: 100%;height: 60%;margin-left: auto;margin-right: auto; display: block;" id="' + id_tag_detalle + '_img" src="https://www.cerocodigo.com/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" alt="image" value="' + valor_campo + '">' + valor_campo + '</a>'
  
                  div_campos = div_campos + '<label for="' + id_tag + '_img_file" class="btn bg-blue btn-flat margin btn-block btn-outlined" style="padding-left: 0px;padding-right: 0px;margin-bottom: 0px;">Cambiar</label>'
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
  
  
          html_ingre = '<div class="box-body" style="background: white;">'
  
          html_ingre = html_ingre + '<div class="col-md-6 col-xs-12"> <div class="row">' + div_campos_abajo_izq + '</div></div>'
          html_ingre = html_ingre + '<div class="col-md-6 col-xs-12"> <div class="row">' + div_campos_abajo_der + '</div></div>'
          html_ingre = html_ingre + '</div>'
  
          $('#rr' + pestalla).append(html_ingre);
  
          //$('#rr' + pestalla).append();
          //$('#rr' + pestalla).append();
  
  
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
  

  function registro_cal(pkmodulo, id_fecha, pkregistro, tipo, temp_pestalla, origen) {

    if (id_fecha.length > 1) {
      var fecha_dir = id_fecha[0].id.substring(1).replace(/Q/g, '-')
    } else {
      var fecha_dir = id_fecha.id.substring(1).replace(/Q/g, '-')
    }
    fecha_dir = fecha_dir.replace(/_/g, ' ')
    fecha_dir = fecha_dir.replace(/ /g, ' ')
    fecha_dir = fecha_dir.replace(/w/g, ':')
  
  
    pestalla = pestalla + 1;
    if (temp_pestalla == '-2') {
      temp_pestalla = 'consulta'
    }
  
    if (temp_pestalla == 'consulta') {
      $("#myTab").prepend('<li role="presentation" class="" id="li' + pestalla + '" style="text-align: right;"><a href="#rr' + pestalla + '" id="id' + pestalla + '" role="tab" data-toggle="tab" aria-expanded="false">Consulta <i class="fa fa-times" style="color: red; background: transparent;cursor: pointer;" onclick="cerrar_elemento(' + pestalla + ')"></i></a></li>');
  
  
    } else {
      if (temp_pestalla == -1) {
        $("#myTab").prepend('<li role="presentation" class="" id="li' + pestalla + '" style="text-align: right;"><a href="#rr' + pestalla + '" id="id' + pestalla + '" role="tab" data-toggle="tab" aria-expanded="false">Nuevo <i class="fa fa-times" style="color: red; background: transparent;cursor: pointer;" onclick="cerrar_elemento(' + pestalla + ')"></i></a></li>');
  
      } else {
  
        if (dict_pestalla['p-' + temp_pestalla]["tabla_cab"] == undefined) {
          $("#myTab").prepend('<li role="presentation" class="" id="li' + pestalla + '" style="text-align: right;"><a href="#rr' + pestalla + '" id="id' + pestalla + '" role="tab" data-toggle="tab" aria-expanded="false">' + dict_pestalla['p-' + temp_pestalla]["tabla"][0]["Descripcion"] + ' <i class="fa fa-times" style="color: red; background: transparent;cursor: pointer;" onclick="cerrar_elemento(' + pestalla + ')"></i></a></li>');
  
        } else {
  
          $("#myTab").prepend('<li role="presentation" class="" id="li' + pestalla + '" style="text-align: right;"><a href="#rr' + pestalla + '" id="id' + pestalla + '" role="tab" data-toggle="tab" aria-expanded="false" >' + dict_pestalla['p-' + temp_pestalla]["tabla_cab"]["Descripcion"] + ' <i class="fa fa-times" style="color: red; background: transparent;cursor: pointer;" onclick="cerrar_elemento(' + pestalla + ')"></i> </a></li>');
        }
      }
  
  
  
    }
  
  
  
    var id_tab = pkmodulo
    if (tipo == 0) { tipo = 'Nuevo' }
    if (tipo == 1) { tipo = 'modificar' }
    if (tipo == 2) { tipo = 'consulta' }
    if (tipo == 3) { tipo = 'consulta_nuevo' }
  
    $.ajax({
      type: 'POST',
      url: '/' + web_idioma + '/consulta',
      data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'pkmodulo': pkmodulo, 'pestalla': pestalla, 'pkregistro': pkregistro, 'tipo': tipo, 't_clave': 0 },
      beforeSend: function () {
        $("#myTabContent").prepend('<div role="tabpanel" class="tab-pane fade" id="rr' + pestalla + '" aria-labelledby="id' + pestalla + '" style="background-color: transparent;"> Procesando </div>');
      },
      success: function (Response) {
  
  
        $('#rr' + Response["dev_pestalla"]).html('');
  
        id_dic = 'p-' + Response["dev_pestalla"]
        dict_pestalla[id_dic] = Response
        dict_pestalla[id_dic]['tipo'] = tipo
  
        cc_porPesta[id_dic] = 1
  
        div_botones = '<div class="box-header with-border" style="margin-left: 0px;margin-right: 0px;background: white;padding: 0px;"><div class="col-md-12"><div class="row">'
        readonly = 'readonly="readonly"'
        if (tipo == 'consulta') {
  
          readonly = 'readonly="readonly"'
          //div_botones =div_botones +'<button type="button" onclick="cerrar_elemento(' + pestalla + ')" class="btn bg-blue btn-flat margin"><span>Correo</span></button>'
          if (dict_pestalla[id_dic]["plantilla_pdf"]["plantillasMain"].length > 0) {
            //div_botones =div_botones +'<button type="button" onclick="pdf_elemento(' + Response["dev_pestalla"] + ')" class="btn bg-blue btn-flat margin"><span>PDF</span></button>'
            for (dd = 0; dd < dict_pestalla[id_dic]["plantilla_pdf"]["plantillasMain"].length; dd++) {
              div_botones = div_botones + '<button type="button" onclick="pdf_elemento(' + Response["dev_pestalla"] + ', ' + dd + ')" class="btn bg-blue btn-flat margin"><span>' + dict_pestalla[id_dic]["plantilla_pdf"]["plantillasMain"][dd]['Nombre'] + '</span></button>'
  
            }
  
          }
          //div_botones =div_botones +'<button type="button" onclick="excell_elemento(' + pestalla + ')" class="btn bg-blue btn-flat margin"><span>Excell</span></button>'
          if (origen == '1') {
            div_botones = div_botones + '<button class="btn bg-blue btn-flat margin" onclick="cerrar_elemento(' + Response["dev_pestalla"] + ');registro(' + Response["tabla_cab"]["PkModulo"] + ',0,0,' + Response["dev_pestalla"] + ',0,0)">Nuevo</span></button>'
          }
  
          for (x = 0; x < Response["estados"].length; x++) {
            if (Response["estados"][x]["estado_inicial"] == Response["valores_cab"][0][Response["estados"][x]["c_estado"]]) {
              div_botones = div_botones + '<button class="' + Response["estados"][x]["color"] + '" onclick="cambio_estado(' + Response["tabla_cab"]["PkModulo"] + ',' + Response["valores_cab"][0][Response["estados"][x]["pkregistro"]] + ',' + Response["estados"][x]["pkweb_estados_doc"] + ', ' + Response["dev_pestalla"] + ')">' + Response["estados"][x]["display"] + '</span></button>'
            }
            if (Response["estados"][x]["estado_inicial"] == '' && Response["estados"][x]["estado_final"] != Response["valores_cab"][0][Response["estados"][x]["c_estado"]]) {
              div_botones = div_botones + '<button class="' + Response["estados"][x]["color"] + '" onclick="cambio_estado(' + Response["tabla_cab"]["PkModulo"] + ',' + Response["valores_cab"][0][Response["estados"][x]["pkregistro"]] + ',' + Response["estados"][x]["pkweb_estados_doc"] + ', ' + Response["dev_pestalla"] + ')">' + Response["estados"][x]["display"] + '</span></button>'
  
            }
          }
  
        }
  
  
        else {
          if (tipo == 'Nuevo') {
            disparador = 'Guardar Registro Nuevo'
            //div_botones =div_botones +'<button type="button" id="btn_grabar_'+pestalla+'" onclick="this.disabled=true;click_val(1);grabar_elemento(' + Response["dev_pestalla"] + ',0)" class="btn bg-green btn-flat margin"><span>Grabar</span></button>'
            if (pkregistro == '0') {
              div_botones = div_botones + '<button type="button" id="btn_grabar_' + pestalla + '" onclick="grabar_elemento(' + Response["dev_pestalla"] + ',2)" class="btn bg-green btn-flat margin"><span>Grabar</span></button>'
  
            } else {
              div_botones = div_botones + '<button type="button" id="btn_grabar_' + pestalla + '" onclick="grabar_elemento(' + Response["dev_pestalla"] + ',3)" class="btn bg-green btn-flat margin"><span>Grabar</span></button>'
  
            }
          } else {
            disparador = 'Modificar Registro'
            //div_botones =div_botones +'<button  type="button" id="btn_mod_'+pestalla+'" onclick="this.disabled=true;click_val(1);grabar_elemento(' + Response["dev_pestalla"] + ',1)" class="btn bg-green btn-flat margin"><span>Grabar</span></button>'
            if (pkregistro == '0') {
              div_botones = div_botones + '<button  type="button" id="btn_mod_' + pestalla + '" onclick="grabar_elemento(' + Response["dev_pestalla"] + ',2)" class="btn bg-green btn-flat margin"><span>Grabar</span></button>'
  
  
  
  
  
            } else {
              div_botones = div_botones + '<button  type="button" id="btn_mod_' + pestalla + '" onclick="grabar_elemento(' + Response["dev_pestalla"] + ',3)" class="btn bg-green btn-flat margin"><span>Grabar</span></button>'
  
              for (x = 0; x < Response["estados"].length; x++) {
                if (Response["estados"][x]["estado_inicial"] == Response["valores_cab"][0][Response["estados"][x]["c_estado"]]) {
                  div_botones = div_botones + '<button class="' + Response["estados"][x]["color"] + '" onclick="grabar_elemento(' + Response["dev_pestalla"] + ',3); cambio_estado(' + Response["tabla_cab"]["PkModulo"] + ',' + Response["valores_cab"][0][Response["estados"][x]["pkregistro"]] + ',' + Response["estados"][x]["pkweb_estados_doc"] + ', ' + Response["dev_pestalla"] + ');">' + Response["estados"][x]["display"] + '</span></button>'
                }
                if (Response["estados"][x]["estado_inicial"] == '' && Response["estados"][x]["estado_final"] != Response["valores_cab"][0][Response["estados"][x]["c_estado"]]) {
                  div_botones = div_botones + '<button class="' + Response["estados"][x]["color"] + '" onclick="grabar_elemento(' + Response["dev_pestalla"] + ',3); cambio_estado(' + Response["tabla_cab"]["PkModulo"] + ',' + Response["valores_cab"][0][Response["estados"][x]["pkregistro"]] + ',' + Response["estados"][x]["pkweb_estados_doc"] + ', ' + Response["dev_pestalla"] + ');">' + Response["estados"][x]["display"] + '</span></button>'
  
                }
              }
  
            }
  
          }
  
  
          div_botones = div_botones + '<button type="button" onclick="validar_registro(' + Response["dev_pestalla"] + ')" class="btn bg-yellow btn-flat margin"><span>Validar</span></button>'
          //div_botones =div_botones +'<button type="button" onclick="nuevo_elemento(' + Response["dev_pestalla"] + ')" class="btn bg-blue btn-flat margin"><span>Nuevo</span></button>'
          readonly = ''
        }
  
        //div_botones =div_botones +'<button type="button" onclick="cerrar_elemento(' + Response["dev_pestalla"] + ')" class="btn bg-red btn-flat margin"><span>Cerrar</span></button>'
  
        div_botones = div_botones + '</div></div></div>'
  
        $('#rr' + Response["dev_pestalla"]).append(div_botones);
        div_campos2 = ''
        div_campos = '<div class="box-body" style="background: white;"> <div class="row">'
        div_campos_arriba_izq = ''
        div_campos_arriba_der = ''
        div_campos_abajo_izq = ''
        div_campos_abajo_der = ''
        div_c_t = ''
        for (x = 0; x < Response["campos_cab"].length; x++) {
  
          if (tipo == 'Nuevo') {
  
            if (Response["campos_cab"][x]["TablaCampo"] == "cmpformquery") {
              valor_campo = ''
  
            }
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
              var now = new Date(fecha_dir);
              now.addDays(1)
              if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Tiempo"] == "Y") {
                valor_campo = now.format("Y-m-d") + 'T' + now.format("H:00:00")
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
                now.addDays(1)
                valor_campo = now.format("Y-m-d");
              }
  
  
            }
          }
  
          if (tipo == 'modificar') {
            readonly = ''
            if (Response["campos_cab"][x]["Modificable"] == 'No') {
              readonly = 'readonly="readonly"'
            }
  
          }
  
  
          ID_TAG = 'p' + Response["pestalla"] + 'zzz' + Response["campos_cab"][x]["Nombre"] + '';
  
          if (Response["campos_cab"][x]["Visible"] == "Y") {
  
  
            div_c_t = Response["campos_cab"][x]["saltoweb"]
            div_c_t = div_c_t + '<div class="col-sm-' + Response["campos_cab"][x]["largoweb"] + '">'
            div_c_t = div_c_t + '<label class="control-label for="' + Response["campos_cab"][x]["Nombre"] + '" style="font-size: 12px;font-weight: bold;">' + Response["campos_cab"][x]["Descripcion"] + '</label>'
  
  
  
            if (Response["campos_cab"][x]["TablaCampo"] == "cmpformquery") {
              readonly_int = ''
              div_c_t = div_c_t + '<div type="button" style="width: 100%;font-size: 10px;background: yellow;color: black;cursor: pointer;padding-top: 5px;padding-bottom: 5px;padding-left: 5px;padding-right: 5px;" class="col-sx-5" data-toggle="modal" data-target="#modal-default_formulas">if(orden_produccion.Contrato = "10",orden_produccion.Secuencial + orden_produccion.Contrato * (1) * [cant],0)</div>'
  
            }
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
  
  
  
              if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Nombre"] == "Lista usuarios") {
  
                div_c_t = div_c_t + '<select id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" readonly="readonly" style="height: 25px;font-size: 11px;">'
  
                for (zxz = 0; zxz < web_user.length; zxz++) {
                  div_c_t = div_c_t + '<option>' + web_user[zxz] + '</option>'
                }
                div_c_t = div_c_t + '</select>'
  
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
  
  
                if (tipo == 'modificar') {
                  if (Response["campos_cab"][x]["Modificable"] == 'No') {
                    div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + (Response["campos_cab"][x]["largoweb"] - 1) + '" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 25px;font-size: 11px;" onkeypress="return runScript(event, ' + ID_TAG + ')" >'
                  } else {
                    if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["pkmodulo_ingreso"] != 0) {
                      div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + (Response["campos_cab"][x]["largoweb"] - 1) + '" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="width: 65%;height: 25px;font-size: 11px;" onkeypress="return runScript(event, ' + ID_TAG + ')" >'
                      div_c_t = div_c_t + '<button type="button" class="btn btn-info" data-toggle="modal" data-target=".bs-example-modal-lg" onclick="buscar_referencia_cabecera(' + ID_TAG + ' )"style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></button>'
  
  
                      div_c_t = div_c_t + '<button type="button" class="btn btn-info"  onclick="registro(' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["pkmodulo_ingreso"] + ',0,0,-1,0,0)" style="height: 25px;padding: 3px 4px;"><i class="fa fa-plus"></i></button>'
                    } else {
                      div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + (Response["campos_cab"][x]["largoweb"] - 1) + '" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="width: 85%;height: 25px;font-size: 11px;" onkeypress="return runScript(event, ' + ID_TAG + ')" >'
                      div_c_t = div_c_t + '<button type="button" class="btn btn-info" data-toggle="modal" data-target=".bs-example-modal-lg" onclick="buscar_referencia_cabecera(' + ID_TAG + ' )"style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></button>'
  
                    }
                  }
  
  
  
                } else {
                  if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["pkmodulo_ingreso"] != 0) {
                    div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + (Response["campos_cab"][x]["largoweb"] - 1) + '" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="width: 65%;height: 25px;font-size: 11px;" onkeypress="return runScript(event, ' + ID_TAG + ')" >'
                    div_c_t = div_c_t + '<button type="button" class="btn btn-info" data-toggle="modal" data-target=".bs-example-modal-lg" onclick="buscar_referencia_cabecera(' + ID_TAG + ' )"style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></button>'
  
  
                    div_c_t = div_c_t + '<button type="button" class="btn btn-info"  onclick="registro(' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["pkmodulo_ingreso"] + ',0,0,-1,0,0)" style="height: 25px;padding: 3px 4px;"><i class="fa fa-plus"></i></button>'
                  } else {
                    div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + (Response["campos_cab"][x]["largoweb"] - 1) + '" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="width: 85%;height: 25px;font-size: 11px;" onkeypress="return runScript(event, ' + ID_TAG + ')" >'
                    div_c_t = div_c_t + '<button type="button" class="btn btn-info" data-toggle="modal" data-target=".bs-example-modal-lg" onclick="buscar_referencia_cabecera(' + ID_TAG + ' )"style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></button>'
  
                  }
                }
  
  
  
              } else {
                div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + (Response["campos_cab"][x]["largoweb"] - 1) + '" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="width: 85%;height: 25px;font-size: 11px;"" onkeypress="return runScript(event, ' + ID_TAG + ')" >'
                if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["pkmod_consul"] != '0') {
                  div_c_t = div_c_t + '<button type="button" class="btn btn-info" onclick="registro(' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["pkmod_consul"] + ', ' + Response["valores_cab"][0][Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["campo_fk"]] + ', 2, -2, 0,0)" style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;"><span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span></button>'
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
            if (Response["campos_cab"][x]["TablaCampo"] == "cmpcondicional") {
  
              div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" onchange="guardar_calcular(' + ID_TAG + ', 0)" style="height: 25px;font-size: 11px;">'
            }
            if (Response["campos_cab"][x]["TablaCampo"] == "cmparchivo") {
  
              //div_c_t = div_c_t + '<input type="file" id="'+ ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="'+ valor_campo +'" '+ readonly +' style="height: 25px;font-size: 11px;">'
              div_c_t = div_c_t + '<div class="thumbnail" style="height: 160px;margin-bottom: 1px;"><div class="image view view-first"><a id="' + ID_TAG + '_label" href="https://www.cerocodigo.com/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" target="_blank" style="font-size: 11px;"><img style="width: 100%;height: 60%;margin-left: auto;margin-right: auto; display: block;" id="' + ID_TAG + '_img" src="https://www.cerocodigo.com/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" alt="image" value="' + valor_campo + '">' + valor_campo + '</a>'
  
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
        $('#rr' + Response["pestalla"]).append(div_campos);
  
        document.getElementById('id' + Response["pestalla"]).click();
  
  
  
  
        if (typeof (Response["campos_det"]) == "object") {
          readonly = ''
  
          var largo_tabla = 0
          for (x = 0; x < Response["campos_det"].length; x++) {
            if (Response["campos_det"][x]["Visible"] == "Y") {
              largo_tabla = largo_tabla + parseFloat(Response["campos_det"][x]["largo"])
  
            }
          }
  
          if (tipo == 'consulta') {
            readonly = 'readonly="readonly"'
  
            div_campos = '<div id="divtabla' + Response["pestalla"] + '" class="box-body tableFixHead" style="background: white; overflow: auto;overflow-y: auto;padding-top: 20px; height: 100%;"><table id="tabla' + Response["pestalla"] + '" class="table table-striped" style="width: ' + parseInt(largo_tabla) + 'px;overflow-x:auto;font-size: 11px;background: white;"><thead><tr>'
  
  
          } else {
            div_campos = '<div id="divtabla' + Response["pestalla"] + '" class="box-body tableFixHead" style="background: white; overflow: auto;overflow-y: auto;padding-top: 20px; height: 100%;"><table id="tabla' + Response["pestalla"] + '" class="table table-striped" style="width: ' + parseInt(largo_tabla) + 'px;overflow-x:auto;font-size: 11px;background: white;"><thead><tr><th style="width: 20px;">'
  
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
              div_campos = div_campos + '<tr id="f' + Response["pestalla"] + '-f' + i + '" style="background: white;">'
            } else {
              div_campos = div_campos + '<tr id="f' + Response["pestalla"] + '-f' + i + '" style="background: white;"><td><div class=""  style="padding-left: 10px;">'
  
              div_campos = div_campos + '<button type="button" onclick="menos(' + Response["pestalla"] + ',' + i + ', 0)" class="btn bg-red btn-flat margin" style="padding: 3px 10px;margin-right: 10px;">-</button>'
  
  
              div_campos = div_campos + '</div></td>'
            }
  
            altura_mini = 45
  
            for (x = 0; x < Response["campos_det"].length; x++) {
  
              valor_campo = 0;
              if (tipo == 'Nuevo') {
  
                if (Response["campos_det"][x]["TablaCampo"] == "cmpformquery") {
                  valor_campo = 'Crear Formula'
                }
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
                div_campos = div_campos + '<td style="padding-left: 0px;padding-right: 5px;"><div style="width: ' + Response["campos_det"][x]["largo"] + 'px;">'
  
  
                if (Response["campos_det"][x]["TablaCampo"] == "cmpformquery") {
                  readonly_int = ''
                  div_campos = div_campos + '<div id="' + id_tag_detalle + '" type="button" style="width: 100%;font-size: 10px;background: yellow;color: black;cursor: pointer;padding-top: 5px;padding-bottom: 5px;padding-left: 5px;padding-right: 5px;" class="col-sx-5" data-toggle="modal" data-target="#modal-default_formulas" onclick="abrirformula(' + id_tag_detalle + ')">' + valor_campo + '</div>'
                }
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
                        div_campos = div_campos + '<option selected>' + Response["func_det"][Response["campos_det"][x]["Nombre"]][z]["Valor"] + '</option>'
                      } else {
                        div_campos = div_campos + '<option>' + Response["func_det"][Response["campos_det"][x]["Nombre"]][z]["Valor"] + '</option>'
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
                    div_campos = div_campos + '<div class="input-group" style="width: 100%;""><input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;" onkeypress="return runScript_detalle(event, ' + id_tag_detalle + ')">'
                    div_campos = div_campos + '</div>'
                  } else {
  
                    div_campos = div_campos + '<div class="input-group" style="width: 100%;"><input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="width: 75%;height: 25px;font-size: 11px;" onkeypress="return runScript_detalle(event, ' + id_tag_detalle + ')">'
                    div_campos = div_campos + '<button type="button" class="btn btn-info" data-toggle="modal" data-target=".bs-example-modal-lg" onclick="buscar_referencia_detalle(' + id_tag_detalle + ' )" style="height: 25px;padding: 3px 4px;margin-top: 0px;margin-bottom: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></button></div>'
                  }
                }
                if (Response["campos_det"][x]["TablaCampo"] == "cmpreferenciaadjunto") {
                  if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Tipo"] == 'Imagen') {
  
                    div_campos = div_campos + '<div class="thumbnail" style="height: 160px;margin-bottom: 1px;"><div class="image view view-first"><a id="' + id_tag_detalle + '_label" href="https://www.cerocodigo.com/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" target="_blank"><img style="width: 100%;height: 60%;margin-left: auto;margin-right: auto; display: block;" id="' + id_tag_detalle + '_img" src="https://www.cerocodigo.com/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" alt="image" value="' + valor_campo + '">' + valor_campo + '</a>'
  
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
                  div_campos = div_campos + '<div class="thumbnail" style="height: 160px;margin-bottom: 1px;"><div class="image view view-first"><a id="' + id_tag_detalle + '_label" href="https://www.cerocodigo.com/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" target="_blank" style="font-size: 11px;"><img style="width: 100%;height: 60%;margin-left: auto;margin-right: auto; display: block;" id="' + id_tag_detalle + '_img" src="https://www.cerocodigo.com/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" alt="image" value="' + valor_campo + '">' + valor_campo + '</a>'
  
                  div_campos = div_campos + '<label for="' + id_tag + '_img_file" class="btn bg-blue btn-flat margin btn-block btn-outlined" style="padding-left: 0px;padding-right: 0px;margin-bottom: 0px;">Cambiar</label>'
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
  
  
          html_ingre = '<div class="box-body" style="background: white;">'
  
          html_ingre = html_ingre + '<div class="col-md-6 col-xs-12"> <div class="row">' + div_campos_abajo_izq + '</div></div>'
          html_ingre = html_ingre + '<div class="col-md-6 col-xs-12"> <div class="row">' + div_campos_abajo_der + '</div></div>'
          html_ingre = html_ingre + '</div>'
  
          $('#rr' + pestalla).append(html_ingre);
  
          //$('#rr' + pestalla).append();
          //$('#rr' + pestalla).append();
  
  
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
  