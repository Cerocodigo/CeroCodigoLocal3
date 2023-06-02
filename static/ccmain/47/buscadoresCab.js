function verficar_refeencias_aplicadas(t_pestalla){

  Response = dict_pestalla['p-' + t_pestalla]

  for (ee = 0; ee < (Response["campos_cab"].length); ee++) {
    if (Response["campos_cab"][ee]["TablaCampo"] == "cmpreferencia") {
      tc_nombre = Response["campos_cab"][ee]["Nombre"]
      if (Response["func_cab"][tc_nombre][4].length > 0) {
        return ejecutar_referenciaaplicar(t_pestalla, tc_nombre, Response["func_cab"][tc_nombre])
      }
    }
  }
  return true
}


function ejecutar_referenciaaplicar(t_pestalla, t_nombre, arrFunc) {
  arrFunc[4]
  aplico = false
  for (x_apl = 0; x_apl < arrFunc[4].length; x_apl++) {
    ID_objetivo = 'p' + t_pestalla + 'zzz' + arrFunc[4][x_apl]['objetivo']
    ID_filtro = 'p' + t_pestalla + 'zzz' + arrFunc[4][x_apl]['objetivoFiltro']
    ID_minimo_registro = 'p' + t_pestalla + 'zzz' + arrFunc[4][x_apl]['minimo_registro']
    ID_minimo_valor = 'p' + t_pestalla + 'zzz' + arrFunc[4][x_apl]['minimo_valor']

    //Aplica sobre solo el campo con el minimo valor
    if(document.getElementById(ID_objetivo).value == 'Minimo'){
      valid = 0
      acum = 0
      tindex = []
      // Encera todos los campso destinos
      // aplicr el valor 0 a todo
      for (x_apl2 = 0; x_apl2 <= (cc_porPesta["p-" + t_pestalla]); x_apl2++) {
        ID_objetivoDet = 'pd' + t_pestalla + 'fff' + x_apl2 + 'ccc' + arrFunc[4][x_apl]['c_valor'] + '';
        if(document.getElementById(ID_objetivoDet) != null){        
          document.getElementById(ID_objetivoDet).value = 0
        }

      }


      for (x_apl2 = 0; x_apl2 <= (cc_porPesta["p-" + t_pestalla]); x_apl2++) {
        ID_objetivoDet = 'pd' + t_pestalla + 'fff' + x_apl2 + 'ccc' + arrFunc[4][x_apl]['c_valor'] + '';
        if(document.getElementById(ID_objetivoDet) != null){        
          t_exluido = false

          // Pregunta si aplica existe filtro en el detalle para exliur la fila
          if(document.getElementById(ID_filtro).value != 'Todas'){
            ID_objetivoDet = 'pd' + t_pestalla + 'fff' + x_apl2 + 'ccc' + arrFunc[4][x_apl]['objetivoDet'] + '';

            if(document.getElementById(ID_filtro).value != document.getElementById(ID_objetivoDet).value ){
              t_exluido = true
            }
            
          }
          // aplicar las rectricciones de campo
          for (x_apl3 = 0; x_apl3 < arrFunc[5].length; x_apl3++) {
            ID_objetivoDet = 'pd' + t_pestalla + 'fff' + x_apl2 + 'ccc' + arrFunc[5][x_apl3]['campo'] + '';

            if(arrFunc[5][x_apl3]['operador'] == '='){
              if(parseFloat(document.getElementById(ID_objetivoDet).value) != parseFloat(arrFunc[5][x_apl3]['valor'])){
                t_exluido = true
              }
            }
            if(arrFunc[5][x_apl3]['operador'] == '!='){
              if(parseFloat(document.getElementById(ID_objetivoDet).value) == parseFloat(arrFunc[5][x_apl3]['valor'])){
                t_exluido = true
              }
            }
            if(arrFunc[5][x_apl3]['operador'] == '>'){
              if(parseFloat(document.getElementById(ID_objetivoDet).value) <= parseFloat(arrFunc[5][x_apl3]['valor'])){
                t_exluido = true
              }
            }
            if(arrFunc[5][x_apl3]['operador'] == '>='){
              if(parseFloat(document.getElementById(ID_objetivoDet).value) < parseFloat(arrFunc[5][x_apl3]['valor'])){
                t_exluido = true
              }
            }
            if(arrFunc[5][x_apl3]['operador'] == '<'){
              if(parseFloat(document.getElementById(ID_objetivoDet).value) >= parseFloat(arrFunc[5][x_apl3]['valor'])){
                t_exluido = true
              }
            }
            if(arrFunc[5][x_apl3]['operador'] == '<='){
              if(parseFloat(document.getElementById(ID_objetivoDet).value) > parseFloat(arrFunc[5][x_apl3]['valor'])){
                t_exluido = true
              }
            }
            if(arrFunc[5][x_apl3]['operador'] == 'No Igual'){
              if((document.getElementById(ID_objetivoDet).value) == (arrFunc[5][x_apl3]['valor'])){
                t_exluido = true
              }
            }
            if(arrFunc[5][x_apl3]['operador'] == 'Igual'){
              if((document.getElementById(ID_objetivoDet).value) != (arrFunc[5][x_apl3]['valor'])){
                t_exluido = true
              }
            }
            
          }
          if(t_exluido == false){
            valid = valid + 1
            ID_objetivoDet = 'pd' + t_pestalla + 'fff' + x_apl2 + 'ccc' + arrFunc[4][x_apl]['campo'] + '';
            acum = acum + parseFloat(document.getElementById(ID_objetivoDet).value)
            if(tindex.length==0){
              tindex.push(x_apl2)
            }else{
              ID_objetivoPrev = 'pd' + t_pestalla + 'fff' + tindex[0] + 'ccc' + arrFunc[4][x_apl]['campo'] + '';
              if(parseFloat(document.getElementById(ID_objetivoPrev).value) > parseFloat(document.getElementById(ID_objetivoDet).value)){
                tindex[0] = x_apl2
              }
            }
          }
        }
      }

      if(parseFloat(valid) >= parseFloat(document.getElementById(ID_minimo_registro).value) && parseFloat(acum) >= parseFloat(document.getElementById(ID_minimo_valor).value)){
        for (x_apl4 = 0; x_apl4 <= tindex.length; x_apl4++) {
          ID_objetivoDet = 'pd' + t_pestalla + 'fff' + tindex[x_apl4] + 'ccc' + arrFunc[4][x_apl]['c_valor'] + '';
          ID_objetivo = 'p' + t_pestalla + 'zzz' + arrFunc[4][x_apl]['valor']
          if(document.getElementById(ID_objetivoDet) != null){
            document.getElementById(ID_objetivoDet).value = document.getElementById(ID_objetivo).value
            aplico = true
          }        

        }
      }


    } 
    //Aplica sobre todos los campos
    if(document.getElementById(ID_objetivo).value == 'Todas'){

      valid = 0
      acum = 0
      tindex = []
      // aplicr el valor 0 a todo
      for (x_apl2 = 0; x_apl2 <= (cc_porPesta["p-" + t_pestalla]); x_apl2++) {
        ID_objetivoDet = 'pd' + t_pestalla + 'fff' + x_apl2 + 'ccc' + arrFunc[4][x_apl]['c_valor'] + '';
        if(document.getElementById(ID_objetivoDet) != null){        
          document.getElementById(ID_objetivoDet).value = 0
        }

      }


      for (x_apl2 = 0; x_apl2 <= (cc_porPesta["p-" + t_pestalla]); x_apl2++) {
        ID_objetivoDet = 'pd' + t_pestalla + 'fff' + x_apl2 + 'ccc' + arrFunc[4][x_apl]['c_valor'] + '';
        if(document.getElementById(ID_objetivoDet) != null){        
          t_exluido = false

          // Pregunta si aplica existe filtro en el detalle para exliur la fila
          if(document.getElementById(ID_filtro).value != 'Todas'){
            ID_objetivoDet = 'pd' + t_pestalla + 'fff' + x_apl2 + 'ccc' + arrFunc[4][x_apl]['objetivoDet'] + '';

            if(document.getElementById(ID_filtro).value != document.getElementById(ID_objetivoDet).value ){
              t_exluido = true
            }
            
          }
          // aplicar las rectricciones de campo
          for (x_apl3 = 0; x_apl3 < arrFunc[5].length; x_apl3++) {
            ID_objetivoDet = 'pd' + t_pestalla + 'fff' + x_apl2 + 'ccc' + arrFunc[5][x_apl3]['campo'] + '';

            if(arrFunc[5][x_apl3]['operador'] == '='){
              if(parseFloat(document.getElementById(ID_objetivoDet).value) != parseFloat(arrFunc[5][x_apl3]['valor'])){
                t_exluido = true
              }
            }
            if(arrFunc[5][x_apl3]['operador'] == '!='){
              if(parseFloat(document.getElementById(ID_objetivoDet).value) == parseFloat(arrFunc[5][x_apl3]['valor'])){
                t_exluido = true
              }
            }
            if(arrFunc[5][x_apl3]['operador'] == '>'){
              if(parseFloat(document.getElementById(ID_objetivoDet).value) <= parseFloat(arrFunc[5][x_apl3]['valor'])){
                t_exluido = true
              }
            }
            if(arrFunc[5][x_apl3]['operador'] == '>='){
              if(parseFloat(document.getElementById(ID_objetivoDet).value) < parseFloat(arrFunc[5][x_apl3]['valor'])){
                t_exluido = true
              }
            }
            if(arrFunc[5][x_apl3]['operador'] == '<'){
              if(parseFloat(document.getElementById(ID_objetivoDet).value) >= parseFloat(arrFunc[5][x_apl3]['valor'])){
                t_exluido = true
              }
            }
            if(arrFunc[5][x_apl3]['operador'] == '<='){
              if(parseFloat(document.getElementById(ID_objetivoDet).value) > parseFloat(arrFunc[5][x_apl3]['valor'])){
                t_exluido = true
              }
            }
            if(arrFunc[5][x_apl3]['operador'] == 'No Igual'){
              if((document.getElementById(ID_objetivoDet).value) == (arrFunc[5][x_apl3]['valor'])){
                t_exluido = true
              }
            }
            if(arrFunc[5][x_apl3]['operador'] == 'Igual'){
              if((document.getElementById(ID_objetivoDet).value) != (arrFunc[5][x_apl3]['valor'])){
                t_exluido = true
              }
            }
            
          }
          if(t_exluido == false){
            valid = valid + 1
            ID_objetivoDet = 'pd' + t_pestalla + 'fff' + x_apl2 + 'ccc' + arrFunc[4][x_apl]['campo'] + '';
            acum = acum + parseFloat(document.getElementById(ID_objetivoDet).value)
            tindex.push(x_apl2)

          }
        }
      }

      if(parseFloat(valid) >= parseFloat(document.getElementById(ID_minimo_registro).value) && parseFloat(acum) >= parseFloat(document.getElementById(ID_minimo_valor).value)){
        for (x_apl4 = 0; x_apl4 <= tindex.length; x_apl4++) {
          ID_objetivoDet = 'pd' + t_pestalla + 'fff' + tindex[x_apl4] + 'ccc' + arrFunc[4][x_apl]['c_valor'] + '';
          ID_objetivo = 'p' + t_pestalla + 'zzz' + arrFunc[4][x_apl]['valor']
          if(document.getElementById(ID_objetivoDet) != null){
            document.getElementById(ID_objetivoDet).value = document.getElementById(ID_objetivo).value
            aplico = true
          }        

        }
      }


      // recorro todo y ver si hay condiciones

      // aplicar a todos



    } 
    // ver rificar si aplico una accion
    if(aplico == false){
      ID_envio = 'p' + t_pestalla + 'zzz' + t_nombre
      // no a aplicado accion verificar si no a llamado alguna accion contra valor 'No Aplica' o '' si no a llamado regresr ok
      if(document.getElementById(ID_envio).value == 'No Aplica' || document.getElementById(ID_envio).value == ''){
        document.getElementById(ID_envio).value = 'No Aplica'
        return true
      }else{// intento aplicar y no se efectuo regresar false para grabado final
        
        alert('No se puede aplicar:' + document.getElementById(ID_envio).value)
        document.getElementById(ID_envio).value = 'No Aplica'
        return false

      }
    }{// aplico accion rgreso ok todo bien
      return true
    }

  }



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

    if (Response["func_cab"][cc_nombre][4].length > 0) {
      ejecutar_referenciaaplicar(cc_pesta, cc_nombre, Response["func_cab"][cc_nombre])
    }


    for (zt = 0; zt < anexos.length; zt++) {
      buscar_referencia_cabecera_enter(document.getElementById(anexos[zt]))
    }
  }
  //calcular_0(pestalla)
  calcular_0_v2(cc_pesta, cc_cambios)
  
  for (xq = 0; xq <= (cc_porPesta["p-" + cc_pesta]); xq++) {
    calcular_detalleV2(cc_pesta, xq)
  }
  // calcular_0_v2(cc_pesta, cc_cambios)
  
}

new_cmpvalor = []
function runScript_buscador_cab_offline(e, campo){
  
  if (e.keyCode == 13) {

    filtrar_buscar_offline(campo)

  }
}

function buscar_referencia_cabecera_enter(campo) {
  var cc_id = campo.id
  var res = cc_id.split("zzz");
  var cc_pesta = res[0].substring(1);
  var cc_nombre = res[1]

  Response_int = dict_pestalla['p-' + cc_pesta]


  where = " "
  modo = Response_int["func_cab"][cc_nombre][0][0]["Modo"]
  columnas = Response_int["func_cab"][cc_nombre][0][0]["Columnas"]
  campo = Response_int["func_cab"][cc_nombre][0][0]["Sentencia"]
  dato = document.getElementById(cc_id).value
  tabla = Response_int["func_cab"][cc_nombre][0][0]["TablaOrigen"]
  orderby = " order by pk" + Response_int["func_cab"][cc_nombre][0][0]["TablaOrigen"] + " desc "


  for (x = 0; x < Response_int["func_cab"][cc_nombre][1].length; x++) {

    ElementoA = ""
    ElementoB = ""

    if (Response_int["func_cab"][cc_nombre][1][x]["TipoA"] == "R") {
      id_ext = 'p' + cc_pesta + 'zzz' + Response_int["func_cab"][cc_nombre][1][x]["ElementoA"]
      ElementoA = "'" + document.getElementById(id_ext).value + "'"
    }
    if (Response_int["func_cab"][cc_nombre][1][x]["TipoA"] == "V") {
      ElementoA = "'" + Response_int["func_cab"][cc_nombre][1][x]["ElementoA"] + "'"
    }
    if (Response_int["func_cab"][cc_nombre][1][x]["TipoA"] == "C") {
      ElementoA = Response_int["func_cab"][cc_nombre][1][x]["ElementoA"]
    }

    if (Response_int["func_cab"][cc_nombre][1][x]["TipoB"] == "R") {
      id_ext = 'p' + cc_pesta + 'zzz' + Response_int["func_cab"][cc_nombre][1][x]["ElementoB"]
      ElementoB = "'" + document.getElementById(id_ext).value + "'"
    }
    if (Response_int["func_cab"][cc_nombre][1][x]["TipoB"] == "V") {
      ElementoB = "'" + Response_int["func_cab"][cc_nombre][1][x]["ElementoB"] + "'"
    }
    if (Response_int["func_cab"][cc_nombre][1][x]["TipoB"] == "C") {
      ElementoB = Response_int["func_cab"][cc_nombre][1][x]["ElementoB"]
    }

    where = where + ElementoA + ' ' + Response_int["func_cab"][cc_nombre][1][x]["Operador"] + ' ' + ElementoB + ' and '
  }
  if (where == " ") { where = "" } else { where = ' and ' + where.slice(0, -4) }

  cmpsenten = 'select ' + columnas + ' from ' + tabla + ' where ' + campo + ' like "' + dato + '%"' + where



  $.ajax({
    type: 'POST',
    url: '/buscador_auto_enter',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'cmpsenten': cmpsenten, 'usuario': web_usuario, 'cc_pesta': cc_pesta, 'cc_nombre': cc_nombre, 'cc_fila': 0 },
    success: function (Response_int) {
      anexos = []
      Cambio = []

      if (Response_int['cmpvalor'].length > 0) {
        ID_TAG = 'p' + Response_int['cc_pesta'] + 'zzz' + Response_int['cc_nombre']
        Cambio.push(Response_int['cc_nombre'])
        document.getElementById(ID_TAG).value = Response_int['cmpvalor'][0][dict_pestalla["p-" + Response_int['cc_pesta']]["func_cab"][Response_int['cc_nombre']][0][0]['Sentencia']]


        for (x = 0; x < dict_pestalla["p-" + Response_int['cc_pesta']]["campos_cab"].length; x++) {
          if (dict_pestalla["p-" + Response_int['cc_pesta']]["campos_cab"][x]["TablaCampo"] == "cmpreferenciaadjunto") {
            if (dict_pestalla["p-" + Response_int['cc_pesta']]["func_cab"][dict_pestalla["p-" + Response_int['cc_pesta']]["campos_cab"][x]["Nombre"]][0]["CampoReferencia"] == Response_int['cc_nombre']) {
              if (dict_pestalla["p-" + Response_int['cc_pesta']]["func_cab"][dict_pestalla["p-" + Response_int['cc_pesta']]["campos_cab"][x]["Nombre"]][0]["tipo"] == 'Imagen') {
                ID_TAG = 'p' + Response_int['cc_pesta'] + 'zzz' + dict_pestalla["p-" + Response_int['cc_pesta']]["campos_cab"][x]["Nombre"] + '_img'

                document.getElementById(ID_TAG).src = '/media/archivos/' + web_Id_empresa + '/' + Response_int['cmpvalor'][0][dict_pestalla["p-" + Response_int['cc_pesta']]["func_cab"][dict_pestalla["p-" + Response_int['cc_pesta']]["campos_cab"][x]["Nombre"]][0]["Sentencia"]]
                // document.getElementById(ID_TAG).value = Response_int['cmpvalor'][0][dict_pestalla["p-" + Response_int['cc_pesta']]["func_cab"][dict_pestalla["p-" + Response_int['cc_pesta']]["campos_cab"][x]["Nombre"]][0]["Sentencia"]]
                document.getElementById(ID_TAG).attributes['value']['value'] = Response_int['cmpvalor'][0][dict_pestalla["p-" + Response_int['cc_pesta']]["func_cab"][dict_pestalla["p-" + Response_int['cc_pesta']]["campos_cab"][x]["Nombre"]][0]["Sentencia"]]

              } else {
                ID_TAG = 'p' + Response_int['cc_pesta'] + 'zzz' + dict_pestalla["p-" + Response_int['cc_pesta']]["campos_cab"][x]["Nombre"]


                document.getElementById(ID_TAG).value = Response_int['cmpvalor'][0][dict_pestalla["p-" + Response_int['cc_pesta']]["func_cab"][dict_pestalla["p-" + Response_int['cc_pesta']]["campos_cab"][x]["Nombre"]][0]["Sentencia"]]
              

              }
              Cambio.push(dict_pestalla["p-" + Response_int['cc_pesta']]["campos_cab"][x]["Nombre"])

              
              for (z1 = 0; z1 < dict_pestalla["p-" + Response_int['cc_pesta']]["campos_cab"].length; z1++) {
                if (dict_pestalla["p-" + Response_int['cc_pesta']]["campos_cab"][z1]["TablaCampo"] == "cmpreferencia") {
                  if (dict_pestalla["p-" + Response_int['cc_pesta']]['func_cab'][dict_pestalla["p-" + Response_int['cc_pesta']]["campos_cab"][z1]['Nombre']][0][0]['predeterminado_valor'] == dict_pestalla["p-" + Response_int['cc_pesta']]["campos_cab"][x]["Nombre"] ) {
                    document.getElementById('p' + Response_int['cc_pesta'] + 'zzz' + dict_pestalla["p-" + Response_int['cc_pesta']]["campos_cab"][z1]['Nombre']).value = document.getElementById(ID_TAG).value
                    anexos.push('p' + Response_int['cc_pesta'] + 'zzz' + dict_pestalla["p-" + Response_int['cc_pesta']]["campos_cab"][z1]['Nombre'])
      
                  }
                }
      
                

              }


            }


          }
        }
      }
      //calcular_0(Response_int['cc_pesta'])
      calcular_0_v2(Response_int['cc_pesta'],Cambio)



      var cc_id = 'p' + Response_int['cc_pesta'] + 'zzz' + Response_int['cc_nombre']
      var cc_pesta = Response_int['cc_pesta']
      var cc_nombre = Response_int['cc_nombre']

      //document.getElementById(campo.id).value = document.getElementById("vfinal_bus_2").value

      Response = dict_pestalla['p-' + cc_pesta]

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
                  if (Response["func_cab"][cc_nombre][3][0][4][x][x2]["groupby"] != "") {
                    A_Group = A_Group + Response["func_cab"][cc_nombre][3][0][4][x][x2]["groupby"] + ", "
                  }
                }
                if (Response["func_cab"][cc_nombre][3][0][4][x][x2]["Funcion"] == "Promedio") {
                  A_Select = A_Select + " Avg(" + Response["func_cab"][cc_nombre][3][0][4][x][x2]["Origen"] + "." + Response["func_cab"][cc_nombre][3][0][4][x][x2]["Elemento"] + ") "
                  if (Response["func_cab"][cc_nombre][3][0][4][x][x2]["groupby"] != "") {
                    A_Group = A_Group + Response["func_cab"][cc_nombre][3][0][4][x][x2]["groupby"] + ", "
                  }
                }
                if (Response["func_cab"][cc_nombre][3][0][4][x][x2]["Funcion"] == "Contar") {
                  A_Select = A_Select + " Count(" + Response["func_cab"][cc_nombre][3][0][4][x][x2]["Origen"] + "." + Response["func_cab"][cc_nombre][3][0][4][x][x2]["Elemento"] + ") "
                  if (Response["func_cab"][cc_nombre][3][0][4][x][x2]["groupby"] != "") {
                    A_Group = A_Group + Response["func_cab"][cc_nombre][3][0][4][x][x2]["groupby"] + ", "
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
            data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'cmpsenten': sentencia, 'tag1': 'tag1', 'tag2': 'tag2', 'usuario': 'Admin' },
            success: function (Response) {
              anexosDet = []

              if (Response["cmpvalor"].length > 0) {

                for (xq = 0; xq < (cc_porPesta["p-" + cc_pesta] + 2); xq++) {
                  menos_sin_cal(cc_pesta, xq, 1)
                }
                linea_inicial = cc_porPesta["p-" + cc_pesta]


                for (xq = Response["cmpvalor"].length - 1; xq > -1; xq--) {
                  //for (xq = 0; xq < Response["cmpvalor"].length; xq++) {
                  anexosDet = []
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
                          if(dict_pestalla['p-' + cc_pesta]['func_det'][dict_pestalla['p-' + cc_pesta]['campos_det'][xq2]['Nombre']][0][0]['A_acc_automatic'] == 'Si'){
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
                //calcular_0(cc_pesta)
                calcular_0_v2(cc_pesta,[])
                for (xq = linea_inicial; xq < (cc_porPesta["p-" + cc_pesta]); xq++) {
                  calcular_detalle(cc_pesta, xq + 1)
                }
                //calcular_0(cc_pesta)
                calcular_0_v2(cc_pesta,[])
              }


            }
          });






        }
          
        
      }

      for (zt = 0; zt < anexos.length; zt++) {
        buscar_referencia_cabecera_enter(document.getElementById(anexos[zt]))
      }


    }
  });
}

function filtrar_buscar_offline(campo){

  var cc_id = campo.id
  var res = cc_id.split("zzz");
  var cc_pesta = res[0].substring(1);
  var cc_nombre = res[1]

  campo_sente = dict_pestalla['p-' + cc_pesta]["func_cab"][cc_nombre][0][0]["Sentencia"]


  // if (flujo == -1) {
  //   if (pago_buscador > 1) { pago_buscador = pago_buscador - 1 }

  // } else {
  //   if (pago_buscador < pag_limit) { pago_buscador = pago_buscador + 1 }

  // }
  if(offline == true){
    Response= bases_pregargadas[cc_nombre]
  }

  orden = Response["A_Select"].split(",")


  buscador_resul = Response


  new_cmpvalor = []
  var valorr = document.getElementById('busca_valor').value.toLowerCase()

  for (x = 0; x < Response['cmpvalor'].length; x++) {
    datentro = false
    for (x2 = 0; x2 < orden.length; x2++) {
      if(Response['cmpvalor'][x][orden[x2]] != null){      
        try {
          if(Response['cmpvalor'][x][orden[x2]].toString().toLowerCase().search(valorr) >= 0){
            datentro = true
            break
          }
        } catch (error) {
          alert(error)
        }
      }
    }  
    if(datentro == true){
      new_cmpvalor.push(Response['cmpvalor'][x])
    }
  }

  //'</select>'
  pag_limit = 1
  if ((new_cmpvalor.length / 10) % 1 != 0) {
    pag_limit = parseInt(new_cmpvalor.length / 10) + 1
  } else {
    pag_limit = parseInt(new_cmpvalor.length / 10)
  }




  data_int = ''
  data_int = data_int + '<div class="panel-body"><table style="cursor: pointer;font-size: 11px;background: white;" width="100%" class="table table-striped table-bordered table-hover" id="dataTables-example"><thead><tr>'
  data_int = data_int + '<th style="display: none;">' + campo_sente + '</th>'
  if(offline == false){
    visibles = Response['datos_PkCampo'][0]['visibles'].split(',')
  }
  if(offline == true){
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

  


  




  if (new_cmpvalor.length > (pago_buscador * 10)) {
    bus_limite = pago_buscador * 10
  } else {
    bus_limite = new_cmpvalor.length
  }

  //for (x = (0); x < Response['cmpvalor'].length; x++) {              
  for (x = (0 + ((pago_buscador - 1) * 10)); x < bus_limite; x++) {
    data_int = data_int + '<tr onclick="doble_click_buscador_cad(' + cc_id + ', this)">'
    data_int = data_int + '<td style="display: none;">' + new_cmpvalor[x][campo_sente] + '</td>'

    for (x2 = 0; x2 < orden.length; x2++) {
      if (visibles[x2] == 'S') {
        data_int = data_int + '<td>' + new_cmpvalor[x][orden[x2]] + '</td>'
      } else {
        data_int = data_int + '<td style="display: none;">' + new_cmpvalor[x][orden[x2]] + '</td>'
      }
    }
    data_int = data_int + '</tr>'
  }


  data_int = data_int + '</tbody></table></div>'





  $('#buscador_int').html(data_int);
  $('#buscador_int_pag').html('<button type="button" class="btn btn-info" onclick="buscar_referencia_cabecera_cambio_pag(-1, buscador_resul, ' + campo.id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-left"></i></button> ' + pago_buscador + ' - ' + pag_limit + '  <button type="button" class="btn btn-info" onclick="buscar_referencia_cabecera_cambio_pag(1, buscador_resul, ' + campo.id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-right"></i></button>');
  $('#buscador_int_pag2').html('<button type="button" class="btn btn-info" onclick="buscar_referencia_cabecera_cambio_pag(-1, buscador_resul, ' + campo.id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-left"></i></button> ' + pago_buscador + ' - ' + pag_limit + '  <button type="button" class="btn btn-info" onclick="buscar_referencia_cabecera_cambio_pag(1, buscador_resul, ' + campo.id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-right"></i></button>');

}

function buscar_referencia_cabecera(campo) {
    var busc_campo = campo
    var cc_id = campo.id
    var res = cc_id.split("zzz");
    var cc_pesta = res[0].substring(1);
    var cc_nombre = res[1]
  
    Response = dict_pestalla['p-' + cc_pesta]
    pag_limit = 1
    pago_buscador = 1
  
    where = " "
    modo = Response["func_cab"][cc_nombre][0][0]["Modo"]
    columnas = Response["func_cab"][cc_nombre][0][0]["Columnas"]
    campo = Response["func_cab"][cc_nombre][0][0]["Sentencia"]
    dato = document.getElementById(cc_id).value
    tabla = Response["func_cab"][cc_nombre][0][0]["TablaOrigen"]
    if(Response["func_cab"][cc_nombre][0][0]["orden"] == null){
      orderby = " order by " + Response["func_cab"][cc_nombre][0][0]["Sentencia"] + " "
    }else{
      orderby = " order by " + Response["func_cab"][cc_nombre][0][0]["orden"] + " "
    }
    PkCampo = Response["func_cab"][cc_nombre][0][0]["PkCampo"]
  
    col_div = columnas.split(',')
    columnas_senten = ''
    for (x = 0; x < col_div.length; x++) {
      columnas_senten = columnas_senten + 'cast(' + col_div[x] + ' as char) as "' + col_div[x] + '", '
    }
    columnas_senten = columnas_senten.substring(0, columnas_senten.length - 2)
    //alert(columnas)
    for (x = 0; x < Response["func_cab"][cc_nombre][1].length; x++) {
  
      ElementoA = ""
      ElementoB = ""
  
      if (Response["func_cab"][cc_nombre][1][x]["TipoA"] == "R") {
        id_ext = 'p' + cc_pesta + 'zzz' + Response["func_cab"][cc_nombre][1][x]["ElementoA"]
        ElementoA = "'" + document.getElementById(id_ext).value + "'"
      }
      if (Response["func_cab"][cc_nombre][1][x]["TipoA"] == "V") {
        ElementoA = " '" + Response["func_cab"][cc_nombre][1][x]["ElementoA"] + "'"
      }
      if (Response["func_cab"][cc_nombre][1][x]["TipoA"] == "C") {
        ElementoA = Response["func_cab"][cc_nombre][1][x]["ElementoA"]
      }
  
      if (Response["func_cab"][cc_nombre][1][x]["TipoB"] == "R") {
        id_ext = 'p' + cc_pesta + 'zzz' + Response["func_cab"][cc_nombre][1][x]["ElementoB"]
        ElementoB = "'" + document.getElementById(id_ext).value + "'"
      }
      if (Response["func_cab"][cc_nombre][1][x]["TipoB"] == "V") {
        ElementoB = "'" + Response["func_cab"][cc_nombre][1][x]["ElementoB"] + "'"
      }
      if (Response["func_cab"][cc_nombre][1][x]["TipoB"] == "C") {
        ElementoB = Response["func_cab"][cc_nombre][1][x]["ElementoB"]
      }
      pago_buscador = 1
      where = where + ElementoA + ' ' + Response["func_cab"][cc_nombre][1][x]["Operador"] + ' ' + ElementoB + ' and '
    }
    if (where == " ") { where = "" } else { where = 'where ' + where.slice(0, -4) }
  
    cmpsenten = "select " + columnas + ' from ' + tabla + ' ' + where + ' ' + orderby
  
    if(offline == false){
   
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
    
            //} 
            document.getElementById("buscador_senten").value = cmpsenten
            //'</select>'
            pag_limit = 1
            if ((Response['cmpvalor'].length / 10) % 1 != 0) {
                pag_limit = parseInt(Response['cmpvalor'].length / 10) + 1
            } else {
                pag_limit = parseInt(Response['cmpvalor'].length / 10)
            }
    
            //data_int = data_int + '<div class="input-group">'
            data_int = data_int + '<input class="form-control" id="busca_valor" placeholder="Escriba para filtrar" onkeypress="return runScript_buscador_cab(event, ' + cc_id + ', ' + Response['PkCampo'] + ')"> '
            
            $('#intbuscadorcab').html('<button type="button" class="btn btn-info" onclick="filtrar_buscar(' + cc_id + ', ' + Response['PkCampo'] + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-check"></i></button> <button type="button" class="close" data-dismiss="modal" id="modal1"><span aria-hidden="true">×</span></button>');
    
            //data_int = data_int + '</div>'
    
            data_int = data_int + '<p id="buscador_int_pag"> <button type="button" class="btn btn-info" onclick="buscar_referencia_cabecera_cambio_pag(-1, buscador_resul,' + busc_campo.id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-left"></i></button> ' + pago_buscador + ' - ' + pag_limit + '  <button type="button" class="btn btn-info" onclick="buscar_referencia_cabecera_cambio_pag(1, buscador_resul,' + busc_campo.id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-right"></i></button> </p> </div></div>'
    
            data_int = data_int + '<div class="modal-footer"><button type="button" class="btn btn-info" data-dismiss="modal" onclick="poner_valor_buscar_referencia_cabecera(' + cc_id + ')" id="c_modal_ref_cab" style="display: none;"></button></div>'
    
            data_int = data_int + '<div id="buscador_int" style="overflow: auto;">'
            data_int = data_int + '<div class="panel-body" ><table style="cursor: pointer;font-size: 11px;background: white;" width="100%" class="table table-striped table-bordered table-hover" id="dataTables-example"><thead><tr>'
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
    
            data_int = data_int + '</tr></thead><tbody>'
    
    
    
            if (Response['cmpvalor'].length > (pago_buscador * 10)) {
                bus_limite = pago_buscador * 10
            } else {
                bus_limite = Response['cmpvalor'].length
            }
    
            //for (x = (0); x < Response['cmpvalor'].length; x++) {              
            for (x = (0 + ((pago_buscador - 1) * 10)); x < bus_limite; x++) {
                data_int = data_int + '<tr onclick="doble_click_buscador_cad(' + cc_id + ', this)">'
                data_int = data_int + '<td style="display: none;">' + Response['cmpvalor'][x][campo] + '</td>'
    
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
    
            data_int = data_int + '</div>'
    
            data_int = data_int + '<div class="modal-footer">'
    
    
            data_int = data_int + '<p id="buscador_int_pag2"> <button type="button" class="btn btn-info" onclick="buscar_referencia_cabecera_cambio_pag(-1, buscador_resul,' + busc_campo.id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-left"></i></button> ' + pago_buscador + ' - ' + pag_limit + '  <button type="button" class="btn btn-info" onclick="buscar_referencia_cabecera_cambio_pag(1, buscador_resul,' + busc_campo.id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-right"></i></button> </p>'
            data_int = data_int + '</div>'
    
    
    
    
            }
    
    
    
            $('#intbuscador').html(data_int);
    
        }
        });
    }else{
        if (bases_pregargadas[cc_nombre]['cmpvalor'].length == 0) {
            //data_int = '<div class="col-lg-3">No existen datos</div>'
            data_int = 'No existen datos'
    
            } else {
            new_cmpvalor = bases_pregargadas[cc_nombre]['cmpvalor']

            //orden = columnas.replaceAll(" ","").split(",")
            orden = columnas.replace(new RegExp(" ", 'g'),"").split(",")

            

            buscador_resul = bases_pregargadas[cc_nombre]
    
            buscador_resultado = bases_pregargadas[cc_nombre]['cmpvalor']
            data_int = '<div class="row"><div class="col-lg-12" >'

            document.getElementById("buscador_senten").value = cmpsenten
            //'</select>'
            pag_limit = 1

            if ((bases_pregargadas[cc_nombre]['cmpvalor'].length / 10) % 1 != 0) {
                pag_limit = parseInt(bases_pregargadas[cc_nombre]['cmpvalor'].length / 10) + 1
            } else {
                pag_limit = parseInt(bases_pregargadas[cc_nombre]['cmpvalor'].length / 10)
            }
    
            //data_int = data_int + '<div class="input-group">'
            //data_int = data_int + '<input class="form-control" id="busca_valor" placeholder="Escriba para filtrar" onkeypress="return runScript_buscador_cab(event, ' + cc_id + ', ' + Response['PkCampo'] + ')"> '
            //data_int = data_int + '<input class="form-control" id="busca_valor" placeholder="Escriba para filtrar" onkeypress="return runScript_buscador_cab_offline(event, ' + cc_id + ', ' + cc_nombre + ')"> '
            data_int = data_int + '<input class="form-control" id="busca_valor" placeholder="Escriba para filtrar" onkeypress="return runScript_buscador_cab_offline(event, ' + busc_campo.id + ')"> '

            $('#intbuscadorcab').html('<button type="button" class="btn btn-info" onclick="filtrar_buscar_offline(' + cc_id + ', ' + cc_nombre + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-check"></i></button> <button type="button" class="close" data-dismiss="modal" id="modal1"><span aria-hidden="true">×</span></button>');
    
            //data_int = data_int + '</div>'
    
            data_int = data_int + '<p id="buscador_int_pag"> <button type="button" class="btn btn-info" onclick="buscar_referencia_cabecera_cambio_pag(-1, buscador_resul,' + busc_campo.id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-left"></i></button> ' + pago_buscador + ' - ' + pag_limit + '  <button type="button" class="btn btn-info" onclick="buscar_referencia_cabecera_cambio_pag(1, buscador_resul,' + busc_campo.id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-right"></i></button> </p> </div></div>'
    
            data_int = data_int + '<div class="modal-footer"><button type="button" class="btn btn-info" data-dismiss="modal" onclick="poner_valor_buscar_referencia_cabecera(' + cc_id + ')" id="c_modal_ref_cab" style="display: none;"></button></div>'
    
            data_int = data_int + '<div id="buscador_int" style="overflow: auto;">'
            data_int = data_int + '<div class="panel-body" ><table style="cursor: pointer;font-size: 11px;background: white;" width="100%" class="table table-striped table-bordered table-hover" id="dataTables-example"><thead><tr>'
            data_int = data_int + '<th style="display: none;">' + campo + '</th>'
            visibles = bases_pregargadas[cc_nombre]['visibles'].split(',')

            for (x = 0; x < orden.length; x++) {
                if (visibles[x] == 'S') {
                data_int = data_int + '<th>' + orden[x] + '</th>'
                } else {
                data_int = data_int + '<th style="display: none;">' + orden[x] + '</th>'
                }
            }
    
            data_int = data_int + '</tr></thead><tbody>'
    
    
    
            if (bases_pregargadas[cc_nombre]['cmpvalor'].length > (pago_buscador * 10)) {
                bus_limite = pago_buscador * 10
            } else {
                bus_limite = bases_pregargadas[cc_nombre]['cmpvalor'].length
            }
    
            //for (x = (0); x < Response['cmpvalor'].length; x++) {              
            for (x = (0 + ((pago_buscador - 1) * 10)); x < bus_limite; x++) {
                data_int = data_int + '<tr onclick="doble_click_buscador_cad(' + cc_id + ', this)">'
                data_int = data_int + '<td style="display: none;">' + bases_pregargadas[cc_nombre]['cmpvalor'][x][campo] + '</td>'
    
                for (x2 = 0; x2 < orden.length; x2++) {
                if (visibles[x2] == 'S') {
                    data_int = data_int + '<td>' + bases_pregargadas[cc_nombre]['cmpvalor'][x][orden[x2]] + '</td>'
                } else {
                    data_int = data_int + '<td style="display: none;">' + bases_pregargadas[cc_nombre]['cmpvalor'][x][orden[x2]] + '</td>'
                }
                }
                data_int = data_int + '</tr>'
            }
    
            data_int = data_int + '</tbody></table></div>'
    
            data_int = data_int + '</div>'
    
            data_int = data_int + '<div class="modal-footer">'
    
    
            data_int = data_int + '<p id="buscador_int_pag2"> <button type="button" class="btn btn-info" onclick="buscar_referencia_cabecera_cambio_pag(-1, buscador_resul,' + busc_campo.id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-left"></i></button> ' + pago_buscador + ' - ' + pag_limit + '  <button type="button" class="btn btn-info" onclick="buscar_referencia_cabecera_cambio_pag(1, buscador_resul,' + busc_campo.id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-right"></i></button> </p>'
            data_int = data_int + '</div>'
    
    
    
            }
    
    
    
            $('#intbuscador').html(data_int);
    }
  }
  
  function buscar_referencia_cabecera_cambio_pag(flujo, Response, campo) {



  
  
    var cc_id = campo.id
    var res = cc_id.split("zzz");
    var cc_pesta = res[0].substring(1);
    var cc_nombre = res[1]

    campo_sente = dict_pestalla['p-' + cc_pesta]["func_cab"][cc_nombre][0][0]["Sentencia"]


    if (flujo == -1) {
      if (pago_buscador > 1) { pago_buscador = pago_buscador - 1 }
  
    } else {
      if (pago_buscador < pag_limit) { pago_buscador = pago_buscador + 1 }
  
    }
    if(offline == true){
      Response= bases_pregargadas[cc_nombre]
    }
  
    orden = Response["A_Select"].split(",")
  
  
    buscador_resul = Response
    //'</select>'
    pag_limit = 1

    databusdador = []
    //quiere dicre esta offline y hay algo filtrado debe usar new_cmpvalor and ugar de Response['cmpvalor']
    if(offline == true && document.getElementById('busca_valor').value.length>0){
      databusdador= new_cmpvalor
    }else{
      databusdador= Response['cmpvalor']
    }

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
    }
    if(offline == true){
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
  
  
  
    if (databusdador.length > (pago_buscador * 10)) {
      bus_limite = pago_buscador * 10
    } else {
      bus_limite = databusdador.length
    }
  
    //for (x = (0); x < Response['cmpvalor'].length; x++) {              
    for (x = (0 + ((pago_buscador - 1) * 10)); x < bus_limite; x++) {
      data_int = data_int + '<tr onclick="doble_click_buscador_cad(' + cc_id + ', this)">'
      data_int = data_int + '<td style="display: none;">' + databusdador[x][campo_sente] + '</td>'
  
      for (x2 = 0; x2 < orden.length; x2++) {
        if (visibles[x2] == 'S') {
          data_int = data_int + '<td>' + databusdador[x][orden[x2]] + '</td>'
        } else {
          data_int = data_int + '<td style="display: none;">' + databusdador[x][orden[x2]] + '</td>'
        }
      }
      data_int = data_int + '</tr>'
    }
  
  
    data_int = data_int + '</tbody></table></div>'
  
  
  
  
  
    $('#buscador_int').html(data_int);
    $('#buscador_int_pag').html('<button type="button" class="btn btn-info" onclick="buscar_referencia_cabecera_cambio_pag(-1, buscador_resul, ' + campo.id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-left"></i></button> ' + pago_buscador + ' - ' + pag_limit + '  <button type="button" class="btn btn-info" onclick="buscar_referencia_cabecera_cambio_pag(1, buscador_resul, ' + campo.id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-right"></i></button>');
    $('#buscador_int_pag2').html('<button type="button" class="btn btn-info" onclick="buscar_referencia_cabecera_cambio_pag(-1, buscador_resul, ' + campo.id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-left"></i></button> ' + pago_buscador + ' - ' + pag_limit + '  <button type="button" class="btn btn-info" onclick="buscar_referencia_cabecera_cambio_pag(1, buscador_resul, ' + campo.id + ')" style="height: 25px;padding: 3px 4px;"><i class="fa fa-fw fa-arrow-circle-o-right"></i></button>');
  
  
  }