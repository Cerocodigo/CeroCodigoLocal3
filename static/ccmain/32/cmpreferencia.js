function adjunto_clave(t_pestana){

  return false

}

function runScript_detalle(e, campo) {
  //See notes about 'which' and 'key'
  if (e.keyCode == 13) {
    buscar_referencia_detalle_enter(campo)
    var t_cc_id = campo.id
    var t_res = t_cc_id.split("fff");
    var t_res2 = t_res[1].split("ccc");

    var t_cc_pesta = t_res[0].substring(2);
    var t_cc_fila = t_res2[0]
    var t_cc_nombre = t_res2[1]

    var para_abajo = true
    for (x = 0; x < dict_pestalla['p-' + t_cc_pesta ]['campos_det'].length; x++) {
      if(dict_pestalla['p-' + t_cc_pesta ]['campos_det'][x]['TablaCampo'] == 'cmpreferencia'){
        if (dict_pestalla['p-' + t_cc_pesta ]['campos_det'][x]['Nombre'] == t_cc_nombre){
          para_abajo = true
          break
        }else{
          para_abajo = false
          break
        }
      }

    }

    if(para_abajo == true){
      mas(t_cc_pesta)
      document.getElementById('pd' + t_cc_pesta + 'fff' + (parseInt(t_cc_fila) + 1) + 'ccc' + t_cc_nombre).focus()
    }


  }
  if (e.keyCode == 9) {
    buscar_referencia_detalle_enter(campo)
  }

}
function runScript_subdetalle(e, campo) {


}
function buscar_referencia_detalle_enter(campo) {
    var cc_id = campo.id
    var res = cc_id.split("fff");
    var res2 = res[1].split("ccc");
  
    var cc_pesta = res[0].substring(2);
    var cc_fila = res2[0]
    var cc_nombre = res2[1]
    //calcular_detalle(cc_pesta, cc_fila)
    calcular_detalleV2(cc_pesta, cc_fila)
    Response = dict_pestalla['p-' + cc_pesta]
  
  
    where = " "
    modo = Response["func_det"][cc_nombre][0][0]["Modo"]
    columnas = Response["func_det"][cc_nombre][0][0]["Columnas"]
    campo = Response["func_det"][cc_nombre][0][0]["Sentencia"]
    dato = document.getElementById(cc_id).value
    tabla = Response["func_det"][cc_nombre][0][0]["TablaOrigen"]
    orderby = " order by pk" + Response["func_det"][cc_nombre][0][0]["TablaOrigen"] + " desc "
  
  
    for (x = 0; x < Response["func_det"][cc_nombre][1].length; x++) {
  
      ElementoA = ""
      ElementoB = ""
  
      if (Response["func_det"][cc_nombre][1][x]["TipoA"] == "R") {
        id_ext = 'pd' + cc_pesta + 'fff' + cc_fila + 'ccc' + Response["func_det"][cc_nombre][1][x]["ElementoA"]
        ElementoA = " '" + document.getElementById(id_ext).value + "' "
      }
      if (Response["func_det"][cc_nombre][1][x]["TipoA"] == "V") {
        ElementoA = " '" + Response["func_det"][cc_nombre][1][x]["ElementoA"] + "' "
      }
      if (Response["func_det"][cc_nombre][1][x]["TipoA"] == "C") {
        ElementoA = Response["func_det"][cc_nombre][1][x]["ElementoA"]
      }
  
      if (Response["func_det"][cc_nombre][1][x]["TipoB"] == "R") {
        id_ext = 'pd' + cc_pesta + 'fff' + cc_fila + 'ccc' + Response["func_det"][cc_nombre][1][x]["ElementoB"]
        ElementoB = " '" + document.getElementById(id_ext).value + "' "
      }
      if (Response["func_det"][cc_nombre][1][x]["TipoB"] == "V") {
        ElementoB = " '" + Response["func_det"][cc_nombre][1][x]["ElementoB"] + "' "
      }
      if (Response["func_det"][cc_nombre][1][x]["TipoB"] == "C") {
        ElementoB = Response["func_det"][cc_nombre][1][x]["ElementoB"]
      }
  
      where = where + ElementoA + ' ' + Response["func_det"][cc_nombre][1][x]["Operador"] + ' ' + ElementoB + ' and '
    }
    if (where == " ") { where = "" } else { where = ' and ' + where.slice(0, -4) }
  
    cmpsenten = 'select ' + columnas + ' from ' + tabla + ' where ' + campo + ' like "' + dato + '%"' + where
  
    if(offline == false){

    
      $.ajax({
        type: 'POST',
        url: '/buscador_auto_enter',
        data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'cmpsenten': cmpsenten, 'usuario': web_usuario, 'cc_pesta': cc_pesta, 'cc_nombre': cc_nombre, 'cc_fila': cc_fila },
        success: function (Response_int) {
          anexosbt = []
          if (Response_int['cmpvalor'].length > 0 || dict_pestalla["p-" + Response_int['cc_pesta']]['func_det'][Response_int['cc_nombre']][0][0]['Permite_nulo'] == 'Si') {
    
            temp_int = dict_pestalla["p-" + Response_int['cc_pesta']]
    
            ID_TAG = 'pd' + Response_int['cc_pesta'] + 'fff' + Response_int['cc_fila'] + 'ccc' + Response_int['cc_nombre']
    
            if(dict_pestalla["p-" + Response_int['cc_pesta']]['func_det'][Response_int['cc_nombre']][0][0]['Permite_nulo'] != 'Si'){
              document.getElementById(ID_TAG).value = Response_int['cmpvalor'][0][temp_int["func_det"][Response_int['cc_nombre']][0][0]['Sentencia']]
          }
            anexosbt = []
    
            for (x = 0; x < temp_int["campos_det"].length; x++) {
              if (temp_int["campos_det"][x]["TablaCampo"] == "cmpreferenciaadjunto") {
                if (temp_int["func_det"][temp_int["campos_det"][x]["Nombre"]][0]["CampoReferencia"] == cc_nombre) {
    
                  ID_TAG = 'pd' + Response_int['cc_pesta'] + 'fff' + Response_int['cc_fila'] + 'ccc' + temp_int["campos_det"][x]["Nombre"]
    
                  if (temp_int["func_det"][temp_int["campos_det"][x]["Nombre"]][0]["Tipo"] == 'Imagen') {
    
                    inn_html = '<img style="width: 100%;height: 60%;margin-left: auto;margin-right: auto; display: block;" id="' + ID_TAG + '_img" src="/media/archivos/' + web_Id_empresa + '/' + Response_int['cmpvalor'][0][temp_int["func_det"][temp_int["campos_det"][x]["Nombre"]][0]["Sentencia"]] + '" alt="image" value="0">' + Response_int['cmpvalor'][0][temp_int["func_det"][temp_int["campos_det"][x]["Nombre"]][0]["Sentencia"]]
    
    
                    document.getElementById(ID_TAG + "_label").innerHTML = inn_html
                    document.getElementById(ID_TAG + "_label").href = '/media/archivos/' + web_Id_empresa + '/' + Response_int['cmpvalor'][0][temp_int["func_det"][temp_int["campos_det"][x]["Nombre"]][0]["Sentencia"]]
    
                    document.getElementById(ID_TAG + "_img").src = '/media/archivos/' + web_Id_empresa + '/' + Response_int['cmpvalor'][0][temp_int["func_det"][temp_int["campos_det"][x]["Nombre"]][0]["Sentencia"]]
    
                  } else {
                    if (temp_int["func_det"][temp_int["campos_det"][x]["Nombre"]][0]["Tipo"] == 'Fecha Tiempo') {
    
                      var now = new Date(Response_int['cmpvalor'][0][temp_int["func_det"][temp_int["campos_det"][x]["Nombre"]][0]["Sentencia"]]);
                      document.getElementById(ID_TAG).value = now.format("Y-m-d") + 'T' + now.format("H:i:s")
    
                    } else {
                      document.getElementById(ID_TAG).value = Response_int['cmpvalor'][0][temp_int["func_det"][temp_int["campos_det"][x]["Nombre"]][0]["Sentencia"]]
    
                    }
    
    
    
    
    
                    for (z2 = 0; z2 < temp_int["campos_det"].length; z2++) {
                      if (temp_int["campos_det"][z2]["TablaCampo"] == "cmpreferencia") {
                        if (temp_int["func_det"][temp_int["campos_det"][z2]["Nombre"]][0][0]["predeterminado_valor"] == temp_int["campos_det"][x]["Nombre"]) {
                          document.getElementById('pd' + Response_int['cc_pesta'] + 'fff' + Response_int['cc_fila'] + 'ccc' + Response["campos_det"][z2]["Nombre"]).value = document.getElementById(ID_TAG).value
                          anexosbt.push('pd' + Response_int['cc_pesta'] + 'fff' + Response_int['cc_fila'] + 'ccc' + Response["campos_det"][z2]["Nombre"])
                        }
                      }
                    }
    
    
    
    
                  }
    
                }
              }
            }
    
    
    
            /////////////////
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
                  data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'cmpsenten': sentencia, 'tag1': Response_int['cc_nombre'], 'tag2': Response_int['cc_fila'], 'usuario': web_usuario },
                  success: function (Response) {
                      cc_nombre = Response["tag1"]

                      fila_envio = Response["tag2"]

                    if (Response["cmpvalor"].length > 0) {
                      for (xq = 0; xq < (ccsub_porPesta["p-" + cc_pesta] + 2); xq++) {
                        menossub(cc_pesta, xq, cc_fila)
                      }
                      linea_inicial = ccsub_porPesta["p-" + cc_pesta]
                      if(dict_pestalla['p-' + cc_pesta]["func_det"][cc_nombre][0][0]['Desglosado'] != ''){
                          temp_saldo = 0
                          ultimo = 0
                          valor_desglosar = parseFloat(document.getElementById('pd'+cc_pesta+'fff'+fila_envio+'ccc'+dict_pestalla['p-' + cc_pesta]["func_det"][cc_nombre][0][0]['Valor_Desglosado']).value)
                              
                          for (xq = 0; xq < Response["cmpvalor"].length; xq++) {
                              if(valor_desglosar > parseFloat(Response["cmpvalor"][xq][dict_pestalla['p-' + cc_pesta]["func_det"][cc_nombre][0][0]['Limitante']])){
                                  Response["cmpvalor"][xq][dict_pestalla['p-' + cc_pesta]["func_det"][cc_nombre][0][0]['Desglosado']] =  Response["cmpvalor"][xq][dict_pestalla['p-' + cc_pesta]["func_det"][cc_nombre][0][0]['Limitante']] 
                                  valor_desglosar = valor_desglosar - Response["cmpvalor"][xq][dict_pestalla['p-' + cc_pesta]["func_det"][cc_nombre][0][0]['Limitante']] 
                              }else{
                                  Response["cmpvalor"][xq][dict_pestalla['p-' + cc_pesta]["func_det"][cc_nombre][0][0]['Desglosado']] =  valor_desglosar
                                  ultimo = xq
                                  valor_desglosar = 0
                                  break
                              }
                          }

                          if(valor_desglosar == 0){
                              if(ultimo != Response["cmpvalor"].length-1){
                                  for (xq = Response["cmpvalor"].length-1; xq > ultimo; xq--) {
                                      delete Response["cmpvalor"][xq]
                                      Response["cmpvalor"].length= Response["cmpvalor"].length -1
                                  }

                              }
                          }

                      }


    
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
    
    
            ///////////////
    
    
    
    
            calcular_detalle(Response_int['cc_pesta'], Response_int['cc_fila'])
    
            for (zt = 0; zt < anexosbt.length; zt++) {
              buscar_referencia_detalle_enter(document.getElementById(anexosbt[zt]))
            }
    
    
          }else{
          
          }
    
        }
      });
    }
    if(offline == true){

      Response = bases_pregargadas[cc_nombre]
      Response_int = {'cmpvalor':[]}

      for (x = 0; x < Response["cmpvalor"].length; x++) {
        if(Response['cmpvalor'][x][campo].toString().toLowerCase().search(dato) >= 0){
          Response_int['cmpvalor'].push(Response['cmpvalor'][x])
          break
        }
      }

    
      if (Response_int['cmpvalor'].length > 0 || dict_pestalla["p-" + cc_pesta]['func_det'][cc_nombre][0][0]['Permite_nulo'] == 'Si') {

        temp_int = dict_pestalla["p-" + cc_pesta]

        ID_TAG = 'pd' + cc_pesta + 'fff' + cc_fila + 'ccc' + cc_nombre

        if(dict_pestalla["p-" + cc_pesta]['func_det'][cc_nombre][0][0]['Permite_nulo'] != 'Si'){
          document.getElementById(ID_TAG).value = Response_int['cmpvalor'][0][temp_int["func_det"][cc_nombre][0][0]['Sentencia']]
        }
        anexosbt = []

        for (x = 0; x < temp_int["campos_det"].length; x++) {
          if (temp_int["campos_det"][x]["TablaCampo"] == "cmpreferenciaadjunto") {
            if (temp_int["func_det"][temp_int["campos_det"][x]["Nombre"]][0]["CampoReferencia"] == cc_nombre) {

              ID_TAG = 'pd' + cc_pesta + 'fff' + cc_fila + 'ccc' + temp_int["campos_det"][x]["Nombre"]

              if (temp_int["func_det"][temp_int["campos_det"][x]["Nombre"]][0]["Tipo"] == 'Imagen') {

                inn_html = '<img style="width: 100%;height: 60%;margin-left: auto;margin-right: auto; display: block;" id="' + ID_TAG + '_img" src="/media/archivos/' + web_Id_empresa + '/' + Response_int['cmpvalor'][0][temp_int["func_det"][temp_int["campos_det"][x]["Nombre"]][0]["Sentencia"]] + '" alt="image" value="0">' + Response_int['cmpvalor'][0][temp_int["func_det"][temp_int["campos_det"][x]["Nombre"]][0]["Sentencia"]]


                document.getElementById(ID_TAG + "_label").innerHTML = inn_html
                document.getElementById(ID_TAG + "_label").href = '/media/archivos/' + web_Id_empresa + '/' + Response_int['cmpvalor'][0][temp_int["func_det"][temp_int["campos_det"][x]["Nombre"]][0]["Sentencia"]]

                document.getElementById(ID_TAG + "_img").src = '/media/archivos/' + web_Id_empresa + '/' + Response_int['cmpvalor'][0][temp_int["func_det"][temp_int["campos_det"][x]["Nombre"]][0]["Sentencia"]]

              } else {
                if (temp_int["func_det"][temp_int["campos_det"][x]["Nombre"]][0]["Tipo"] == 'Fecha Tiempo') {

                  var now = new Date(Response_int['cmpvalor'][0][temp_int["func_det"][temp_int["campos_det"][x]["Nombre"]][0]["Sentencia"]]);
                  document.getElementById(ID_TAG).value = now.format("Y-m-d") + 'T' + now.format("H:i:s")

                } else {
                  document.getElementById(ID_TAG).value = Response_int['cmpvalor'][0][temp_int["func_det"][temp_int["campos_det"][x]["Nombre"]][0]["Sentencia"]]

                }





                for (z2 = 0; z2 < temp_int["campos_det"].length; z2++) {
                  if (temp_int["campos_det"][z2]["TablaCampo"] == "cmpreferencia") {
                    if (temp_int["func_det"][temp_int["campos_det"][z2]["Nombre"]][0][0]["predeterminado_valor"] == temp_int["campos_det"][x]["Nombre"]) {
                      document.getElementById('pd' + cc_pesta + 'fff' + cc_fila + 'ccc' + Response["campos_det"][z2]["Nombre"]).value = document.getElementById(ID_TAG).value
                      anexosbt.push('pd' + cc_pesta + 'fff' + cc_fila + 'ccc' + Response["campos_det"][z2]["Nombre"])
                    }
                  }
                }




              }

            }
          }
        }


        calcular_detalle(cc_pesta, cc_fila)

        for (zt = 0; zt < anexosbt.length; zt++) {
          buscar_referencia_detalle_enter(document.getElementById(anexosbt[zt]))
        }


      }else{
      
      }

    }

  }