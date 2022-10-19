function pdf_dir_ficha(pkpaneL_g, t_largo, t_Ancho, tk_ficha, max_mostrar) {

  $.ajax({
    type: 'POST',
    url: '/pdf_ficha',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 't_pkpaneL_g': pkpaneL_g },
    success: function (Response) {



      if (parseFloat(t_Ancho) > parseFloat(t_largo)) {
        var doc = new jsPDF('l', 'cm', [parseFloat(t_largo), parseFloat(t_Ancho)]);
      } else {
        var doc = new jsPDF('p', 'cm', [parseFloat(t_largo), parseFloat(t_Ancho)]);
      }

      doc.setFont("helvetica");
      var altura_deta = 0

      var bloque_mostrar = 0;
      var lim_down = 0;
      var lim_up = max_mostrar;
      var termino = false;
      var vueltas = 0

      if (Response["plantilla"].length > 0) {




        do {

          for (x = 0; x < Response["plantilla"].length; x++) {
            if (Response["plantilla"][x]['tipo'] == 'Cabecera') {
              var y_ini = Response["plantilla"][x]['altura']

              for (x2 = 0; x2 < Response["plantilla"][x]['datos'].length; x2++) {
                doc.setFontSize(Response["plantilla"][x]['datos'][x2]["Letra"]);

                if (Response["plantilla"][x]['datos'][x2]['tipo'] == 'Campo') {
                  var campo_txt = Response["plantilla"][x]['datos'][x2]['valor'].split('_')

                  var cmpo_val = document.getElementById('ficha' + campo_txt[0] + '_' + campo_txt[1] + '_' + campo_txt[2] + '_' + campo_txt[3])
                  //ficha0_0_Nombre_4t

                  var cmpo_val_txt = cmpo_val.value
                  if (cmpo_val_txt.length > Response["plantilla"][x]['datos'][x2]['limite']) {
                    cmpo_val_txt = cmpo_val_txt.substring(0, Response["plantilla"][x]['datos'][x2]['limite'])
                  }

                  var txt_pdf = devolver_valor_imp(cmpo_val_txt, Response["plantilla"][x]['datos'][x2]['formato'], Response["plantilla"][x]['datos'][x2]['ext'])
                  if (Response["plantilla"][x]['datos'][x2]['lado'] == 'Derecha') {
                    doc.text(parseFloat(Response["plantilla"][x]['datos'][x2]["x"]), parseFloat(Response["plantilla"][x]['datos'][x2]["y"]) + parseFloat(y_ini), txt_pdf.toString(), 'right');
                  } else {
                    doc.text(parseFloat(Response["plantilla"][x]['datos'][x2]["x"]), parseFloat(Response["plantilla"][x]['datos'][x2]["y"]) + parseFloat(y_ini), txt_pdf.toString());

                  }
                }
                if (Response["plantilla"][x]['datos'][x2]['tipo'] == 'Label') {
                  var txt_pdf = devolver_valor_imp(Response["plantilla"][x]['datos'][x2]['valor'], Response["plantilla"][x]['datos'][x2]['formato'], Response["plantilla"][x]['datos'][x2]['ext'])
                  if (Response["plantilla"][x]['datos'][x2]['lado'] == 'Derecha') {
                    doc.text(parseFloat(Response["plantilla"][x]['datos'][x2]["x"]), parseFloat(Response["plantilla"][x]['datos'][x2]["y"]) + parseFloat(y_ini), txt_pdf.toString(), 'right');
                  } else {
                    doc.text(parseFloat(Response["plantilla"][x]['datos'][x2]["x"]), parseFloat(Response["plantilla"][x]['datos'][x2]["y"]) + parseFloat(y_ini), txt_pdf.toString());

                  }
                }
                if (Response["plantilla"][x]['datos'][x2]['tipo'] == 'Funcion') {


                  var cmpo_val = document.getElementById(Response["plantilla"][x]['datos'][x2]['valor'])
                  //ficha0_0_Nombre_4t

                  var cmpo_val_txt = cmpo_val.value
                  if (cmpo_val_txt.length > Response["plantilla"][x]['datos'][x2]['limite']) {
                    cmpo_val_txt = cmpo_val_txt.substring(0, Response["plantilla"][x]['datos'][x2]['limite'])
                  }

                  var txt_pdf = devolver_valor_imp(cmpo_val_txt, Response["plantilla"][x]['datos'][x2]['formato'], Response["plantilla"][x]['datos'][x2]['ext'])
                  if (Response["plantilla"][x]['datos'][x2]['lado'] == 'Derecha') {
                    doc.text(parseFloat(Response["plantilla"][x]['datos'][x2]["x"]), parseFloat(Response["plantilla"][x]['datos'][x2]["y"]) + parseFloat(y_ini), txt_pdf.toString(), 'right');
                  } else {
                    doc.text(parseFloat(Response["plantilla"][x]['datos'][x2]["x"]), parseFloat(Response["plantilla"][x]['datos'][x2]["y"]) + parseFloat(y_ini), txt_pdf.toString());

                  }
                }
              }
            }
          }

          for (x = 0; x < Response["plantilla"].length; x++) {
            if (Response["plantilla"][x]['tipo'] == 'Detalle') {
              var y_ini = Response["plantilla"][x]['altura']

              for (x2 = 0; x2 < Response["plantilla"][x]['datos'].length; x2++) {

                doc.setFontSize(Response["plantilla"][x]['datos'][x2]["Letra"]);

                if (Response["plantilla"][x]['datos'][x2]['tipo'] == 'Campo') {
                  linea_fich = Response["plantilla"][x]['linea_ficha']
                  //ficha0_0_Nombre_4t
                  var campo_txt = Response["plantilla"][x]['datos'][x2]['valor'].split('_')

                  for (x3 = 0; x3 < dict_ficha[tk_ficha]['dbgrupos'][campo_txt[0]]['vals'].length; x3++) {

                    if (x3 >= lim_down && x3 <= lim_up) {
                      var cmpo_val = document.getElementById('ficha' + campo_txt[0] + '_' + x3 + '_' + campo_txt[2] + '_' + campo_txt[3])
                      var cmpo_val_txt = cmpo_val.value
                      if (cmpo_val_txt.length > Response["plantilla"][x]['datos'][x2]['limite']) {
                        cmpo_val_txt = cmpo_val_txt.substring(0, Response["plantilla"][x]['datos'][x2]['limite'])
                      }
                      var txt_pdf = devolver_valor_imp(cmpo_val_txt, Response["plantilla"][x]['datos'][x2]['formato'], Response["plantilla"][x]['datos'][x2]['ext'])
                      if (Response["plantilla"][x]['datos'][x2]['lado'] == 'Derecha') {
                        doc.text(parseFloat(Response["plantilla"][x]['datos'][x2]["x"]), parseFloat(Response["plantilla"][x]['datos'][x2]["y"]) + (linea_fich * (x3 - lim_down)) + parseFloat(y_ini), txt_pdf.toString(), 'right');
                      } else {
                        doc.text(parseFloat(Response["plantilla"][x]['datos'][x2]["x"]), parseFloat(Response["plantilla"][x]['datos'][x2]["y"]) + (linea_fich * (x3 - lim_down)) + parseFloat(y_ini), txt_pdf.toString());

                      }
                      if (x3 == dict_ficha[tk_ficha]['dbgrupos'][campo_txt[0]]['vals'].length - 1) { termino = true }
                    }

                  }

                  altura_deta = linea_fich * (max_mostrar)

                }


              }
            }
          }

          for (x = 0; x < Response["plantilla"].length; x++) {
            if (Response["plantilla"][x]['tipo'] == 'Pie') {

              var y_ini = Response["plantilla"][x]['altura']

              for (x2 = 0; x2 < Response["plantilla"][x]['datos'].length; x2++) {
                doc.setFontSize(Response["plantilla"][x]['datos'][x2]["Letra"]);

                if (Response["plantilla"][x]['datos'][x2]['tipo'] == 'Campo') {
                  var campo_txt = Response["plantilla"][x]['datos'][x2]['valor'].split('_')
                  if (campo_txt[1] == 'n') {
                    var cmpo_val = ''

                    for (x3 = 0; x3 < dict_ficha[tk_ficha]['dbgrupos'][campo_txt[0]]['vals'].length; x3++) {
                      if (Response["plantilla"][x]['datos'][x2]["opera"] == 'Sin') {
                        cmpo_val = cmpo_val + document.getElementById('ficha' + campo_txt[0] + '_' + x3 + '_' + campo_txt[2] + '_' + campo_txt[3]).value + ', '
                      }
                      if (Response["plantilla"][x]['datos'][x2]["opera"] == '=') {
                        var campo_cmdi = Response["plantilla"][x]['datos'][x2]['cond1'].split('_')

                        if (document.getElementById('ficha' + campo_cmdi[0] + '_' + x3 + '_' + campo_cmdi[2] + '_' + campo_cmdi[3]).value == Response["plantilla"][x]['datos'][x2]['valor1']) {
                          cmpo_val = cmpo_val + document.getElementById('ficha' + campo_txt[0] + '_' + x3 + '_' + campo_txt[2] + '_' + campo_txt[3]).value + ', '
                        }


                      }


                    }
                    cmpo_val = cmpo_val.substring(0, cmpo_val.length - 2)

                    var txt_pdf = devolver_valor_imp(cmpo_val, Response["plantilla"][x]['datos'][x2]['formato'], Response["plantilla"][x]['datos'][x2]['ext'])
                    if (Response["plantilla"][x]['datos'][x2]['formato'] == 'Derecha') {
                      doc.text(parseFloat(Response["plantilla"][x]['datos'][x2]["x"]), parseFloat(Response["plantilla"][x]['datos'][x2]["y"]) + altura_deta + parseFloat(y_ini), txt_pdf.toString(), 'right');
                    } else {
                      doc.text(parseFloat(Response["plantilla"][x]['datos'][x2]["x"]), parseFloat(Response["plantilla"][x]['datos'][x2]["y"]) + altura_deta + parseFloat(y_ini), txt_pdf.toString());

                    }


                  } else {
                    var cmpo_val = document.getElementById('ficha' + campo_txt[0] + '_' + campo_txt[1] + '_' + campo_txt[2] + '_' + campo_txt[3])
                    //ficha0_0_Nombre_4t
                    var cmpo_val_txt = cmpo_val.value
                    if (cmpo_val_txt.length > Response["plantilla"][x]['datos'][x2]['limite']) {
                      cmpo_val_txt = cmpo_val_txt.substring(0, Response["plantilla"][x]['datos'][x2]['limite'])
                    }
                    var txt_pdf = devolver_valor_imp(cmpo_val.value, Response["plantilla"][x]['datos'][x2]['formato'], Response["plantilla"][x]['datos'][x2]['ext'])
                    if (Response["plantilla"][x]['datos'][x2]['formato'] == 'Derecha') {
                      doc.text(parseFloat(Response["plantilla"][x]['datos'][x2]["x"]), parseFloat(Response["plantilla"][x]['datos'][x2]["y"]) + altura_deta + parseFloat(y_ini), txt_pdf.toString(), 'right');
                    } else {
                      doc.text(parseFloat(Response["plantilla"][x]['datos'][x2]["x"]), parseFloat(Response["plantilla"][x]['datos'][x2]["y"]) + altura_deta + parseFloat(y_ini), txt_pdf.toString());

                    }
                  }


                }
                if (Response["plantilla"][x]['datos'][x2]['tipo'] == 'Label') {
                  var txt_pdf = devolver_valor_imp(Response["plantilla"][x]['datos'][x2]['valor'], Response["plantilla"][x]['datos'][x2]['formato'], Response["plantilla"][x]['datos'][x2]['ext'])
                  if (Response["plantilla"][x]['datos'][x2]['formato'] == 'Derecha') {
                    doc.text(parseFloat(Response["plantilla"][x]['datos'][x2]["x"]), parseFloat(Response["plantilla"][x]['datos'][x2]["y"]) + altura_deta + parseFloat(y_ini), txt_pdf.toString(), 'right');
                  } else {
                    doc.text(parseFloat(Response["plantilla"][x]['datos'][x2]["x"]), parseFloat(Response["plantilla"][x]['datos'][x2]["y"]) + altura_deta + parseFloat(y_ini), txt_pdf.toString());

                  }
                }
              }
            }
          }

          lim_down = lim_down + parseInt(max_mostrar)
          lim_up = lim_up + parseInt(max_mostrar)
          if (termino == false) {
            if (parseFloat(t_Ancho) > parseFloat(t_largo)) {

              doc.addPage('l', 'cm', [parseFloat(t_largo), parseFloat(t_Ancho)])
            } else {
              doc.addPage('p', 'cm', [parseFloat(t_largo), parseFloat(t_Ancho)])
            }

          }
          vueltas = vueltas + 1
          if (vueltas > 15) { termino == true }

        }
        while (termino == false);



        var date = new Date()
        doc.save(date.toLocaleDateString() + " " + date.toLocaleTimeString() + '.pdf');
      }

    }
  });

}

function pdf_dir_ficha_server(pkpaneL_g, t_largo, t_Ancho, tk_ficha, pkpanel, cc_nombre){
  var cc_val = document.getElementById('buscaPanel_' + pkpanel).tag
  var v_fecha = new Date(document.getElementById('buscaPanel_' + pkpanel + '_fecha').value)

  $.ajax({
    type: 'POST',
    url: '/pdf_ficha_server',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 't_pkpaneL_g': pkpaneL_g, 't_largo': t_largo, 't_Ancho': t_Ancho, 'tk_ficha': tk_ficha, 'fichapk': cc_val, 'fichaFecha': v_fecha.format("Y-m-d"), 'nombre': cc_nombre },
    success: function (Response) {
      window.open('/'+Response['pdf_fianl'],"_blank")

    }
  });
}

function nuevo_dir_ficha_multi(pketr, pkpanel, campo, cc_buscador, cc_envio, dict_add, div_envio) {

  var cc_camp = document.getElementById('buscaPanel_' + pkpanel + '_r').value.split(',')
  var cc_val = document.getElementById('buscaPanel_' + pkpanel).tag
  var v_fecha = new Date(document.getElementById('buscaPanel_' + pkpanel + '_fecha').value)


  var cc_div_selector = document.getElementById('vfinal_ficha_7_multi')
  cc_div_selector.innerHTML = ''
  
  document.getElementById('vfinal_ficha_4_multi').value = campo
  document.getElementById('vfinal_ficha_5_multi').value = pketr
   
  var tempo = ''
  for (x = 0; x < Object.keys(dict_add).length; x++) {
    tempo = tempo + Object.keys(dict_add)[x] + ':' + dict_add[Object.keys(dict_add)[x]] + ';'
  }
  document.getElementById('vfinal_ficha_6_multi').value = tempo


  //buscar_referencia_ficha(ficha12_0_Comercial_4r, pkpanel)
  buscar_referencia_ficha_multi(cc_buscador, pkpanel, cc_envio)


}


function nuevo_dir_ficha(pketr, pkpanel, campo, dict_add, div_envio) {

  var cc_camp = document.getElementById('buscaPanel_' + pkpanel + '_r').value.split(',')
  var cc_val = document.getElementById('buscaPanel_' + pkpanel).tag
  var v_fecha = new Date(document.getElementById('buscaPanel_' + pkpanel + '_fecha').value)




  $.ajax({
    type: 'POST',
    url: '/nuevo_dir_ficha',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 't_campo': campo, 't_valor': cc_val, 't_pketr': pketr, 't_dict_add': JSON.stringify(dict_add).replace('@fecha', v_fecha.format("Y-m-d")) },
    success: function (Response) {
      var cc_busca = document.getElementById('buscaPanel_' + pkpanel)
      poner_valor_buscar_referencia_ficha(cc_busca, div_envio)

      ficha_new(pkpanel)

    }
  });

}

function buscar_referencia_ficha_multi(nom_spli, pkpanel, cc_grupo) {

  var cc_nombre = nom_spli.split('_')
  var pkgrupo = dict_ficha[pkpanel]['dbgrupos'][cc_grupo]['pkgrupo']
  
  var cc_nombre_envio = 'ficha'+cc_grupo+'_0_' + nom_spli

  cmpsenten = 'Select ' + dict_ficha[pkpanel]['dbgrupos'][cc_grupo]['Valor'][pkgrupo][cc_nombre[0]]['campos'] + ' ' + dict_ficha[pkpanel]['dbgrupos'][cc_grupo]['Valor'][pkgrupo][cc_nombre[0]]['from']

  document.getElementById('vfinal_ficha_2_multi').value = cc_nombre_envio
  document.getElementById('vfinal_ficha_3_multi').value = pkpanel

  $.ajax({
    type: 'POST',
    url: '/buscador_ficha',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'cmpsenten': cmpsenten, 'usuario': web_usuario, 'namcampo': cc_nombre_envio, 'pkpanel': pkpanel },
    beforeSend: function () {

      $('#intbuscador').html('Buscando información...');
    },
    success: function (Response) {

      if (Response['cmpvalor'].length == 0) {
        //data_int = '<div class="col-lg-3">No existen datos</div>'
        data_int = 'No existen datos'

      } else {
        var nom_spli = Response['namcampo'].split('_')

        var cc_grupo = nom_spli[0].substring(5) //elimino 'ficha' que la el count del grupo
        var cc_fila = nom_spli[1] //elimino 'ficha' que la el count del grupo
        var cc_nombre = nom_spli[2] //elimino 'ficha' que la el count del grupo

        orden = dict_ficha[Response['pkpanel']]['dbgrupos'][cc_grupo]['Valor'][pkgrupo][cc_nombre]['campos'].split(",")
        buscador_resul = Response

        buscador_resultado_ficha_ref = Response['cmpvalor']
        data_int = '<div class="row"><div class="col-lg-12" >'
        //'<select class="form-control" id="busca_campo">'
        //for (x = 0; x <   Object.keys(Response['cmpvalor'][0]).length; x++) {
        //  data_int = data_int + '<option>' + Object.keys(Response['cmpvalor'][0])[x] + '</option>'

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

        //data_int = data_int + '<p id="buscador_int_pag"> <button type="button" class="btn btn-info" onclick="buscar_referencia_cabecera_cambio_pag(-1, buscador_resul,'+busc_campo.id+')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-left"></i></button> '+pago_buscador+' - '+ pag_limit +'  <button type="button" class="btn btn-info" onclick="buscar_referencia_cabecera_cambio_pag(1, buscador_resul,'+busc_campo.id+')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-right"></i></button> </p> 
        data_int = data_int + '</div></div>'





        data_int = data_int + '<div class="modal-footer"><button type="button" class="btn btn-info" data-dismiss="modal"  id="c_modal_ref_ficha_ref" style="display: none;" onClick=""></button></div>'
        

        data_int = data_int + '<div id="buscador_int" style="overflow: auto;">'
        data_int = data_int + '<div class="panel-body" ><table style="cursor: pointer;font-size: 11px;background: white;" width="100%" class="table table-striped table-bordered table-hover" id="dataTables-example_ref_ref"><thead><tr>'
        data_int = data_int + '<th style="display: none;">' + cc_nombre + '</th>'
        
        //visibles = Response['datos_PkCampo'][0]['visibles'].split(',')
        //largos = Response['datos_PkCampo'][0]['largos'].split(',')
        for (x = 0; x < orden.length; x++) {
          //if(visibles[x] == 'S'){
          data_int = data_int + '<th>' + orden[x] + '</th>'

        }

        data_int = data_int + '</tr></thead><tbody>'



        if (Response['cmpvalor'].length > (pago_buscador * 10)) {
          bus_limite = pago_buscador * 10
        } else {
          bus_limite = Response['cmpvalor'].length
        }

        for (x = (0); x < Response['cmpvalor'].length; x++) {
          //for (x = (0 + ((pago_buscador-1)*10)); x < bus_limite; x++) {
          data_int = data_int + '<tr onclick="click_buscador_ficha_ref_multi(buscaPanel_' + pkpanel + ', this, \'' +  Response['cmpvalor'][x][cc_nombre] + '\', ' + pkpanel + ' )">'
          data_int = data_int + '<td style="display: none;">' + Response['cmpvalor'][x][cc_nombre] + '</td>'

          for (x2 = 0; x2 < orden.length; x2++) {
            //if(visibles[x2] == 'S'){
            data_int = data_int + '<td>' + Response['cmpvalor'][x][orden[x2]] + '</td>'
            //}else{
            //  data_int = data_int + '<td style="display: none;">' + Response['cmpvalor'][x][orden[x2]] + '</td>'
            //}
          }
          data_int = data_int + '</tr>'
        }

        data_int = data_int + '</tbody></table></div>'

        data_int = data_int + '</div>'

        data_int = data_int + '<div class="modal-footer"></div>'
      }



      $('#intnota_ficha_ref_multi').html(data_int);

    }
  });
}

function pasar_ficha_multi(){
  var divv = document.getElementById("vfinal_ficha_7_multi")

  data = []
  for (x = (0); x <= divv.childElementCount-1; x++) {
    dataint = divv.childNodes[x].childNodes[1].innerText.split(';')
    data_row = {}
    for (x2 = (0); x2 < dataint.length-1; x2++) {
      data_row[dataint[x2].split(':')[0]] = dataint[x2].split(':')[1]
    }
    data.push(data_row)
  }

  var nom_spli = document.getElementById('vfinal_ficha_2_multi').value.split('_')
  var pkpanel = document.getElementById('vfinal_ficha_3_multi').value
  var cc_grupo = nom_spli[0].substring(5) //elimino 'ficha' que la el count del grupo
  var cc_nombre = nom_spli[2] //elimino 'ficha' que la el count del grupo
  var pkgrupo = dict_ficha[pkpanel]['dbgrupos'][cc_grupo]['pkgrupo']

  var anexos = dict_ficha[pkpanel]['dbgrupos'][cc_grupo]['Valor'][pkgrupo][cc_nombre]['anexos'].split('/')

  var cc_campo = document.getElementById('vfinal_ficha_4_multi').value
  var pketr = document.getElementById('vfinal_ficha_5_multi').value
  var data_gri_base = document.getElementById('vfinal_ficha_6_multi').value.split(';')

  var cc_val = document.getElementById('buscaPanel_' + pkpanel).tag
  var v_fecha = new Date(document.getElementById('buscaPanel_' + pkpanel + '_fecha').value)

  var datos = {}
  for (x = (0); x <= data_gri_base.length-2; x++) {
    datos[data_gri_base[x].split(':')[0]] = data_gri_base[x].split(':')[1].replace('@fecha', v_fecha.format("Y-m-d"))
  }


  var dat_final = []
  var grid_anexo = {} // {campoDiv:columnaData,campoDiv2:columnaData2}

  for (x2 = (0); x2 <= anexos.length-1; x2++) {
    grid_anexo[anexos[x2].split('=')[0].split('_')[0]] = anexos[x2].split('=')[1]
  }


// recrro data grid selecionado
  for (x = (0); x <= data.length-1; x++) {

    var dat_parcial = {} // creo dict parcial
    
    for (x2 = 0; x2 <= Object.keys(grid_anexo).length-1; x2++) {
      dat_parcial[Object.keys(grid_anexo)[x2]] = data[x][grid_anexo[Object.keys(grid_anexo)[x2]]]
    }
    for (x2 = 0; x2 <= Object.keys(datos).length-1; x2++) {
      dat_parcial[Object.keys(datos)[x2]] = datos[Object.keys(datos)[x2]]
    }
    
    dat_final.push(dat_parcial)

  }



  $.ajax({
    type: 'POST',
    url: '/nuevo_dir_ficha_multi',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 't_campo': cc_campo, 't_valor': cc_val, 't_pketr': pketr, 'filas': JSON.stringify(dat_final) },
    success: function (Response) {
      var cc_busca = document.getElementById('buscaPanel_' + pkpanel)
      poner_valor_buscar_referencia_ficha(cc_busca, cc_grupo)

      ficha_new(document.getElementById('vfinal_ficha_3_multi').value)
      
      document.getElementById('cerrar_default_ficha_ref_multi').click()
    }
  });
}




function click_buscador_ficha_ref_multi(campo, fila, nomcampo, pkpanel) {
  
  var divv = document.getElementById("vfinal_ficha_7_multi")
  data = ''
  for (x2 = (0); x2 < fila.childElementCount-1; x2++) {
    data = data + fila.parentElement.parentElement.childNodes[0].children[0].childNodes[x2].innerText + ':'+ fila.childNodes[x2].innerText+';'
  }
  divv.innerHTML = divv.innerHTML + '<div>'+ nomcampo+ '<div style="display: none;">'+data+' </div>' +' <button type="button" class="close" onclick="borrar_multi(this)"><span aria-hidden="true">×</span></button> '+ '</div>'

}

function borrar_multi(envio) {
  envio.parentElement.remove()
}


function filtrar_fichas() {
  var nom_spli = document.getElementById('vfinal_ficha_2').value.split('_')
  var pkpanel = document.getElementById('vfinal_ficha_3').value

  var cc_grupo = nom_spli[0].substring(5) //elimino 'ficha' que la el count del grupo
  var cc_fila = nom_spli[1] //elimino 'ficha' que la el count del grupo
  var cc_nombre = nom_spli[2] //elimino 'ficha' que la el count del grupo

  var pkgrupo = dict_ficha[pkpanel]['dbgrupos'][cc_grupo]['pkgrupo']

  dict_ficha[pkpanel]

  var valu = document.getElementById('vfinal_ficha_1').value

  var valu2 = valu.split(',')

  cmpsenten = 'select * from (Select ' + dict_ficha[pkpanel]['dbgrupos'][cc_grupo]['Valor'][pkgrupo][cc_nombre]['campos'] + ' ' + dict_ficha[pkpanel]['dbgrupos'][cc_grupo]['Valor'][pkgrupo][cc_nombre]['from'] + ') ccsuma where '

  var campor = dict_ficha[pkpanel]['dbgrupos'][cc_grupo]['Valor'][pkgrupo][cc_nombre]['campos'].split(',')
  for (x2 = (0); x2 < valu2.length; x2++) {
    cmpsenten = cmpsenten + ' ('
    for (x = (0); x < campor.length; x++) {
      cmpsenten = cmpsenten + ' ccsuma.' + campor[x] + ' like "%' + valu2[x2] + '%" or'
      
    }
    cmpsenten = cmpsenten.substring(0, cmpsenten.length - 2)

    cmpsenten = cmpsenten + ') and'

  }

  cmpsenten = cmpsenten.substring(0, cmpsenten.length - 3)



  $.ajax({
    type: 'POST',
    url: '/buscador_ficha',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'cmpsenten': cmpsenten, 'usuario': web_usuario, 'namcampo': document.getElementById('vfinal_ficha_2').value, 'pkpanel': pkpanel },
    beforeSend: function () {

      $('#intbuscador').html('Buscando información...');
    },
    success: function (Response) {

      if (Response['cmpvalor'].length == 0) {
        //data_int = '<div class="col-lg-3">No existen datos</div>'
        data_int = 'No existen datos'

      } else {
        var nom_spli = Response['namcampo'].split('_')

        var cc_grupo = nom_spli[0].substring(5) //elimino 'ficha' que la el count del grupo
        var cc_fila = nom_spli[1] //elimino 'ficha' que la el count del grupo
        var cc_nombre = nom_spli[2] //elimino 'ficha' que la el count del grupo

        orden = dict_ficha[Response['pkpanel']]['dbgrupos'][cc_grupo]['Valor'][pkgrupo][cc_nombre]['campos'].split(",")
        buscador_resul = Response

        buscador_resultado_ficha_ref = Response['cmpvalor']
        data_int = '<div class="row"><div class="col-lg-12" >'
        //'<select class="form-control" id="busca_campo">'
        //for (x = 0; x <   Object.keys(Response['cmpvalor'][0]).length; x++) {
        //  data_int = data_int + '<option>' + Object.keys(Response['cmpvalor'][0])[x] + '</option>'

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

        //data_int = data_int + '<p id="buscador_int_pag"> <button type="button" class="btn btn-info" onclick="buscar_referencia_cabecera_cambio_pag(-1, buscador_resul,'+busc_campo.id+')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-left"></i></button> '+pago_buscador+' - '+ pag_limit +'  <button type="button" class="btn btn-info" onclick="buscar_referencia_cabecera_cambio_pag(1, buscador_resul,'+busc_campo.id+')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-right"></i></button> </p> 
        data_int = data_int + '</div></div>'





        data_int = data_int + '<div class="modal-footer"><button type="button" class="btn btn-info" data-dismiss="modal"  id="c_modal_ref_ficha_ref" style="display: none;"></button></div>'

        data_int = data_int + '<div id="buscador_int" style="overflow: auto;">'
        data_int = data_int + '<div class="panel-body" ><table style="cursor: pointer;font-size: 11px;background: white;" width="100%" class="table table-striped table-bordered table-hover" id="dataTables-example_ref_ref"><thead><tr>'
        data_int = data_int + '<th style="display: none;">' + cc_nombre + '</th>'
        //visibles = Response['datos_PkCampo'][0]['visibles'].split(',')
        //largos = Response['datos_PkCampo'][0]['largos'].split(',')
        for (x = 0; x < orden.length; x++) {
          //if(visibles[x] == 'S'){
          data_int = data_int + '<th>' + orden[x] + '</th>'

        }

        data_int = data_int + '</tr></thead><tbody>'



        if (Response['cmpvalor'].length > (pago_buscador * 10)) {
          bus_limite = pago_buscador * 10
        } else {
          bus_limite = Response['cmpvalor'].length
        }

        for (x = (0); x < Response['cmpvalor'].length; x++) {
          //for (x = (0 + ((pago_buscador-1)*10)); x < bus_limite; x++) {
          data_int = data_int + '<tr onclick="doble_click_buscador_ficha_ref(buscaPanel_' + pkpanel + ', this, ' + Response['namcampo'] + ', ' + Response['pkpanel'] + ' )">'

          //data_int = data_int + '<tr onclick="doble_click_buscador_cad(' + cc_id +', this)">'
          data_int = data_int + '<td style="display: none;">' + Response['cmpvalor'][x][cc_nombre] + '</td>'

          for (x2 = 0; x2 < orden.length; x2++) {
            //if(visibles[x2] == 'S'){
            data_int = data_int + '<td>' + Response['cmpvalor'][x][orden[x2]] + '</td>'
            //}else{
            //  data_int = data_int + '<td style="display: none;">' + Response['cmpvalor'][x][orden[x2]] + '</td>'
            //}
          }
          data_int = data_int + '</tr>'
        }

        data_int = data_int + '</tbody></table></div>'

        data_int = data_int + '</div>'

        data_int = data_int + '<div class="modal-footer"></div>'
      }



      $('#intnota_ficha_ref').html(data_int);

    }
  });
}


function filtrar_fichas_multi() {
  var nom_spli = document.getElementById('vfinal_ficha_2_multi').value.split('_')
  var pkpanel = document.getElementById('vfinal_ficha_3_multi').value

  var cc_grupo = nom_spli[0].substring(5) //elimino 'ficha' que la el count del grupo
  var cc_fila = nom_spli[1] //elimino 'ficha' que la el count del grupo
  var cc_nombre = nom_spli[2] //elimino 'ficha' que la el count del grupo

  var pkgrupo = dict_ficha[pkpanel]['dbgrupos'][cc_grupo]['pkgrupo']

  dict_ficha[pkpanel]

  var valu = document.getElementById('vfinal_ficha_1_multi').value

  var valu2 = valu.split(',')

  cmpsenten = 'select * from (Select ' + dict_ficha[pkpanel]['dbgrupos'][cc_grupo]['Valor'][pkgrupo][cc_nombre]['campos'] + ' ' + dict_ficha[pkpanel]['dbgrupos'][cc_grupo]['Valor'][pkgrupo][cc_nombre]['from'] + ') ccsuma where '

  var campor = dict_ficha[pkpanel]['dbgrupos'][cc_grupo]['Valor'][pkgrupo][cc_nombre]['campos'].split(',')
  for (x2 = (0); x2 < valu2.length; x2++) {
    cmpsenten = cmpsenten + ' ('
    for (x = (0); x < campor.length; x++) {
      cmpsenten = cmpsenten + ' ccsuma.' + campor[x] + ' like "%' + valu2[x2] + '%" or'
      
    }
    cmpsenten = cmpsenten.substring(0, cmpsenten.length - 2)

    cmpsenten = cmpsenten + ') and'

  }

  cmpsenten = cmpsenten.substring(0, cmpsenten.length - 3)



  $.ajax({
    type: 'POST',
    url: '/buscador_ficha',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'cmpsenten': cmpsenten, 'usuario': web_usuario, 'namcampo': document.getElementById('vfinal_ficha_2_multi').value, 'pkpanel': pkpanel },
    beforeSend: function () {

      $('#intbuscador').html('Buscando información...');
    },
    success: function (Response) {

      if (Response['cmpvalor'].length == 0) {
        //data_int = '<div class="col-lg-3">No existen datos</div>'
        data_int = 'No existen datos'

      } else {
        var nom_spli = Response['namcampo'].split('_')

        var cc_grupo = nom_spli[0].substring(5) //elimino 'ficha' que la el count del grupo
        var cc_fila = nom_spli[1] //elimino 'ficha' que la el count del grupo
        var cc_nombre = nom_spli[2] //elimino 'ficha' que la el count del grupo

        orden = dict_ficha[Response['pkpanel']]['dbgrupos'][cc_grupo]['Valor'][pkgrupo][cc_nombre]['campos'].split(",")
        buscador_resul = Response

        buscador_resultado_ficha_ref = Response['cmpvalor']
        data_int = '<div class="row"><div class="col-lg-12" >'
        //'<select class="form-control" id="busca_campo">'
        //for (x = 0; x <   Object.keys(Response['cmpvalor'][0]).length; x++) {
        //  data_int = data_int + '<option>' + Object.keys(Response['cmpvalor'][0])[x] + '</option>'

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

        //data_int = data_int + '<p id="buscador_int_pag"> <button type="button" class="btn btn-info" onclick="buscar_referencia_cabecera_cambio_pag(-1, buscador_resul,'+busc_campo.id+')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-left"></i></button> '+pago_buscador+' - '+ pag_limit +'  <button type="button" class="btn btn-info" onclick="buscar_referencia_cabecera_cambio_pag(1, buscador_resul,'+busc_campo.id+')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-right"></i></button> </p> 
        data_int = data_int + '</div></div>'





        data_int = data_int + '<div class="modal-footer"><button type="button" class="btn btn-info" data-dismiss="modal"  id="c_modal_ref_ficha_ref" style="display: none;"></button></div>'

        data_int = data_int + '<div id="buscador_int" style="overflow: auto;">'
        data_int = data_int + '<div class="panel-body" ><table style="cursor: pointer;font-size: 11px;background: white;" width="100%" class="table table-striped table-bordered table-hover" id="dataTables-example_ref_ref"><thead><tr>'
        data_int = data_int + '<th style="display: none;">' + cc_nombre + '</th>'
        
        //visibles = Response['datos_PkCampo'][0]['visibles'].split(',')
        //largos = Response['datos_PkCampo'][0]['largos'].split(',')
        for (x = 0; x < orden.length; x++) {
          //if(visibles[x] == 'S'){
          data_int = data_int + '<th>' + orden[x] + '</th>'

        }

        data_int = data_int + '</tr></thead><tbody>'



        if (Response['cmpvalor'].length > (pago_buscador * 10)) {
          bus_limite = pago_buscador * 10
        } else {
          bus_limite = Response['cmpvalor'].length
        }

        for (x = (0); x < Response['cmpvalor'].length; x++) {
          //for (x = (0 + ((pago_buscador-1)*10)); x < bus_limite; x++) {
          //data_int = data_int + '<tr onclick="doble_click_buscador_ficha_ref(buscaPanel_' + pkpanel + ', this, ' + Response['namcampo'] + ', ' + Response['pkpanel'] + ' )">'
          data_int = data_int + '<tr>'

          data_int = data_int + '<tr onclick="click_buscador_ficha_ref_multi(buscaPanel_' + pkpanel + ', this, \'' +  Response['cmpvalor'][x][cc_nombre] + '\', ' + pkpanel + ' )">'
          data_int = data_int + '<td style="display: none;">' + Response['cmpvalor'][x][cc_nombre] + '</td>'

          for (x2 = 0; x2 < orden.length; x2++) {
            //if(visibles[x2] == 'S'){
            data_int = data_int + '<td>' + Response['cmpvalor'][x][orden[x2]] + '</td>'
            //}else{
            //  data_int = data_int + '<td style="display: none;">' + Response['cmpvalor'][x][orden[x2]] + '</td>'
            //}
          }
          data_int = data_int + '</tr>'
        }

        data_int = data_int + '</tbody></table></div>'

        data_int = data_int + '</div>'

        data_int = data_int + '<div class="modal-footer"></div>'
      }



      $('#intnota_ficha_ref_multi').html(data_int);

    }
  });
}

function buscar_referencia_ficha(namcampo, pkpanel) {
  var nom_spli = namcampo.id.split('_')

  var cc_grupo = nom_spli[0].substring(5) //elimino 'ficha' que la el count del grupo
  var cc_fila = nom_spli[1] //elimino 'ficha' que la el count del grupo
  var cc_nombre = nom_spli[2] //elimino 'ficha' que la el count del grupo

  var pkgrupo = dict_ficha[pkpanel]['dbgrupos'][cc_grupo]['pkgrupo']

  dict_ficha[pkpanel]

  document.getElementById('vfinal_ficha_2').value = namcampo.id
  document.getElementById('vfinal_ficha_3').value = pkpanel

  cmpsenten = 'Select ' + dict_ficha[pkpanel]['dbgrupos'][cc_grupo]['Valor'][pkgrupo][cc_nombre]['campos'] + ' ' + dict_ficha[pkpanel]['dbgrupos'][cc_grupo]['Valor'][pkgrupo][cc_nombre]['from']


  $.ajax({
    type: 'POST',
    url: '/buscador_ficha',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'cmpsenten': cmpsenten, 'usuario': web_usuario, 'namcampo': namcampo.id, 'pkpanel': pkpanel },
    beforeSend: function () {

      $('#intbuscador').html('Buscando información...');
    },
    success: function (Response) {

      if (Response['cmpvalor'].length == 0) {
        //data_int = '<div class="col-lg-3">No existen datos</div>'
        data_int = 'No existen datos'

      } else {
        var nom_spli = Response['namcampo'].split('_')

        var cc_grupo = nom_spli[0].substring(5) //elimino 'ficha' que la el count del grupo
        var cc_fila = nom_spli[1] //elimino 'ficha' que la el count del grupo
        var cc_nombre = nom_spli[2] //elimino 'ficha' que la el count del grupo

        orden = dict_ficha[Response['pkpanel']]['dbgrupos'][cc_grupo]['Valor'][pkgrupo][cc_nombre]['campos'].split(",")
        buscador_resul = Response

        buscador_resultado_ficha_ref = Response['cmpvalor']
        data_int = '<div class="row"><div class="col-lg-12" >'
        //'<select class="form-control" id="busca_campo">'
        //for (x = 0; x <   Object.keys(Response['cmpvalor'][0]).length; x++) {
        //  data_int = data_int + '<option>' + Object.keys(Response['cmpvalor'][0])[x] + '</option>'

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

        //data_int = data_int + '<p id="buscador_int_pag"> <button type="button" class="btn btn-info" onclick="buscar_referencia_cabecera_cambio_pag(-1, buscador_resul,'+busc_campo.id+')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-left"></i></button> '+pago_buscador+' - '+ pag_limit +'  <button type="button" class="btn btn-info" onclick="buscar_referencia_cabecera_cambio_pag(1, buscador_resul,'+busc_campo.id+')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-right"></i></button> </p> 
        data_int = data_int + '</div></div>'





        data_int = data_int + '<div class="modal-footer"><button type="button" class="btn btn-info" data-dismiss="modal"  id="c_modal_ref_ficha_ref" style="display: none;" onClick=""></button></div>'

        data_int = data_int + '<div id="buscador_int" style="overflow: auto;">'
        data_int = data_int + '<div class="panel-body" ><table style="cursor: pointer;font-size: 11px;background: white;" width="100%" class="table table-striped table-bordered table-hover" id="dataTables-example_ref_ref"><thead><tr>'
        data_int = data_int + '<th style="display: none;">' + cc_nombre + '</th>'
        //visibles = Response['datos_PkCampo'][0]['visibles'].split(',')
        //largos = Response['datos_PkCampo'][0]['largos'].split(',')
        for (x = 0; x < orden.length; x++) {
          //if(visibles[x] == 'S'){
          data_int = data_int + '<th>' + orden[x] + '</th>'

        }

        data_int = data_int + '</tr></thead><tbody>'



        if (Response['cmpvalor'].length > (pago_buscador * 10)) {
          bus_limite = pago_buscador * 10
        } else {
          bus_limite = Response['cmpvalor'].length
        }

        for (x = (0); x < Response['cmpvalor'].length; x++) {
          //for (x = (0 + ((pago_buscador-1)*10)); x < bus_limite; x++) {
          data_int = data_int + '<tr onclick="doble_click_buscador_ficha_ref(buscaPanel_' + pkpanel + ', this, ' + namcampo.id + ', ' + pkpanel + ' )">'
          data_int = data_int + '<td style="display: none;">' + Response['cmpvalor'][x][cc_nombre] + '</td>'

          for (x2 = 0; x2 < orden.length; x2++) {
            //if(visibles[x2] == 'S'){
            data_int = data_int + '<td>' + Response['cmpvalor'][x][orden[x2]] + '</td>'
            //}else{
            //  data_int = data_int + '<td style="display: none;">' + Response['cmpvalor'][x][orden[x2]] + '</td>'
            //}
          }
          data_int = data_int + '</tr>'
        }

        data_int = data_int + '</tbody></table></div>'

        data_int = data_int + '</div>'

        data_int = data_int + '<div class="modal-footer"></div>'
      }



      $('#intnota_ficha_ref').html(data_int);

    }
  });
}

function cambio_dir_reget(envio, pkreg, pketr, pkpanel) {

  var t_id = envio.id.split('_')
  var t_campo = t_id[2]
  var t_val = envio.value
  var t_pkreg = pkreg
  var t_pketr = pketr





  $.ajax({
    type: 'POST',
    url: '/cambio_dir_reget',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 't_campo': t_campo, 't_val': t_val, 't_pkreg': t_pkreg, 't_pketr': t_pketr },
    success: function (Response) {
      envio.style.backgroundColor = 'lightcyan'


    }
  });


  var t_grupo = t_id[0].substring(5)
  var t_pkgrupo = dict_ficha[pkpanel]["dbgrupos"][t_grupo]["pkgrupo"]

  for (x = 0; x < Object.keys(dict_ficha[pkpanel]["dbgrupos"][t_grupo]["Valor"][t_pkgrupo]).length; x++) {
    var key = Object.keys(dict_ficha[pkpanel]["dbgrupos"][t_grupo]["Valor"][t_pkgrupo])[x]

    if (dict_ficha[pkpanel]["dbgrupos"][t_grupo]["Valor"][t_pkgrupo][key]['tipo'] == "@calculo") {
      var t_datos = dict_ficha[pkpanel]["dbgrupos"][t_grupo]["Valor"][t_pkgrupo][key]['calculo'].split(',')

      var final = 0
      var operador = '+'

      for (x2 = 0; x2 < t_datos.length; x2++) {

        if (t_datos[x2].substring(0, 1) == 'C') {
          var t_camp = document.getElementById('ficha' + t_grupo + '_' + t_id[1] + '_' + t_datos[x2].substring(2))

          if (operador == '+') { final = parseFloat(final) + parseFloat(t_camp.value.match(/\d+/)[0]) }
          if (operador == '-') { final = parseFloat(final) - parseFloat(t_camp.value.match(/\d+/)[0]) }
          if (operador == '*') { final = parseFloat(final) * parseFloat(t_camp.value.match(/\d+/)[0]) }
          if (operador == '/') { final = parseFloat(final) / parseFloat(t_camp.value.match(/\d+/)[0]) }
        }
        if (t_datos[x2].substring(0, 1) == 'V') {
          var t_val = t_datos[x2].substring(2)

          if (operador == '+') { final = parseFloat(final) + parseFloat(t_val).toFixed(2) }
          if (operador == '-') { final = parseFloat(final) - parseFloat(t_val).toFixed(2) }
          if (operador == '*') { final = parseFloat(final) * parseFloat(t_val).toFixed(2) }
          if (operador == '/') { final = parseFloat(final) / parseFloat(t_val).toFixed(2) }
        }
                
        if (t_datos[x2].substring(0, 1) == 'O') {
          operador = t_datos[x2].substring(2)
        }
        if (t_datos[x2].substring(0, 1) == 'E') {
          var mix = t_datos[x2].substring(2).split('-')
          var val_pend = 0
          var operador_temp = '+'

          for (x3 = 0; x3 < mix.length; x3++) {
            if (mix[x3].substring(0, 1) == 'C') {
              var t_camp = document.getElementById('ficha' + t_grupo + '_' + t_id[1] + '_' + mix[x3].substring(2))

              if (operador_temp == '+') { val_pend = parseFloat(val_pend) + parseFloat(t_camp.value).toFixed(2) }
              if (operador_temp == '-') { val_pend = parseFloat(val_pend) - parseFloat(t_camp.value).toFixed(2) }
              if (operador_temp == '*') { val_pend = parseFloat(val_pend) * parseFloat(t_camp.value).toFixed(2) }
              if (operador_temp == '/') { val_pend = parseFloat(val_pend) / parseFloat(t_camp.value).toFixed(2) }
            }
            if (mix[x3].substring(0, 1) == 'O') {
              operador_temp = mix[x3].substring(2)
            }
          }
          if (operador == '+') { final = parseFloat(final) + parseFloat(val_pend).toFixed(2) }
          if (operador == '-') { final = parseFloat(final) - parseFloat(val_pend).toFixed(2) }
          if (operador == '*') { final = parseFloat(final) * parseFloat(val_pend).toFixed(2) }
          if (operador == '/') { final = parseFloat(final) / parseFloat(val_pend).toFixed(2) }
        }

      }
      document.getElementById('ficha' + t_grupo + '_' + t_id[1] + '_' + dict_ficha[pkpanel]["dbgrupos"][t_grupo]["Valor"][t_pkgrupo][key]['base']).value = final.toFixed(2)
      var t_id = dict_ficha[pkpanel]["dbgrupos"][t_grupo]["Valor"][t_pkgrupo][key]['base'].split('_')
      var t_campo = t_id[0]
      var t_val = final
      var t_pkreg = pkreg
      var t_pketr = pketr

      $.ajax({
        type: 'POST',
        url: '/cambio_dir_reget',
        data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 't_campo': t_campo, 't_val': t_val, 't_pkreg': t_pkreg, 't_pketr': t_pketr },
        success: function (Response) {
          envio.style.backgroundColor = 'lightcyan'
        }
      });

    }
  }



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


                      html_temp = html_temp + '<p id="ficha' + x + '_' + x2 + '_' + Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3] + '_x" style="cursor: pointer;"><a href="https://www.cerocodigo.com/media/archivos/' + web_Id_empresa + '/' + Response["dbgrupos"][x]['vals'][x2][Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3]] + '" target="_blank"> ' + Response["dbgrupos"][x]['vals'][x2][Object.keys(Response["dbgrupos"][x]['vals'][x2])[x3]] + '</a><p></div>'

                    }

                    if (nom_tex[1].substring(nom_tex[1].length - 1) == 'r') {     //referncia
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
  