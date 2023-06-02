function mas(id_tab) {

  cc_porPesta['p-' + id_tab] = cc_porPesta['p-' + id_tab] + 1

  Response = dict_pestalla['p-' + id_tab]


  if (cc_porPesta['p-' + id_tab] > 3) {

    document.getElementById('divtabla' + id_tab).style.height = "500px";

  }

  i = cc_porPesta['p-' + id_tab]

  fila = '<tr id="f' + Response["pestalla"] + '-f' + cc_porPesta['p-' + id_tab] + '" style="background: white;"><td><div class="row" style="padding-left: 15px;width: 85px;">'
  fila = fila + '<button type="button" style="padding: 3px 10px;" onclick="menos(' + Response["pestalla"] + ',' + cc_porPesta['p-' + id_tab] + ', 0)" class="btn bg-red btn-flat margin" >-</button>'
  if (typeof (Response["campos_subdet"]) == "object") {

    //fila = fila + '<a class="btn btn-info" style="padding: 2px 2px; margin-right: 0px; margin-left: 0px;" onclick="abrirdetalle(' + Response["pestalla"]+', '+i+' )" id="regbtn-' + Response["pestalla"]+'-'+i+' "><span class="glyphicon glyphicon-resize-small" aria-hidden="true"></span></a>'
    fila = fila + '<button type="button" onclick="abrirdetalle(' + Response["pestalla"] + ', ' + i + ' )" id="regbtn_' + Response["pestalla"] + '_' + i + '" class="btn bg-blue btn-flat margin" style="padding: 3px 4px;"><span class="glyphicon glyphicon-resize-full"></span></button>'


  }
  //fila = fila + '<button type="button" style="padding: 3px 4px;" onclick="mas(' + Response["pestalla"]+')" class="btn bg-green btn-flat margin" >+</button></div></td>'<span class="glyphicon glyphicon-resize-small"></span>
  fila = fila + '</div></td>'

  altura_mini = 45

  for (x = 0; x < Response["campos_det"].length; x++) {
    valor_campo = 0;
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
      if (Response["campos_det"][x]["TablaCampo"].substring(0, 2) == "Pk") {
        valor_campo = 0
      } else {
        if (Response["campos_det"][x]["Nombre"] == 'PKCabecera') {
          valor_campo = Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["ValorInicial"]
        } else {
          valor_campo = Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["ValorInicial"] + cc_porPesta['p-' + id_tab]

        }
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
        valor_campo = now.format("Y-m-d H:i:s");
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
      if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0][0]["Tipo_Predeterminado"] == '0') {
        valor_campo = ''
      } else {
        valor_campo = Response["func_det"][Response["campos_det"][x]["Nombre"]][0][0]["predeterminado_valor"]
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

    if (Response["campos_det"][x]["TablaCampo"] == "cmpdecabecera") {
      valor_campo = ""
    }
    if (Response["campos_det"][x]["TablaCampo"] == "cmpcondicional") {
      valor_campo = ""
    }
    id_tag = 'pd' + Response["pestalla"] + 'fff' + i + 'ccc' + Response["campos_det"][x]["Nombre"]

    if (Response["campos_det"][x]["Visible"] == "Y") {

      fila = fila + '<td style="padding-left: 0px;padding-right: 5px;"><div style="width: ' + Response["campos_det"][x]["largo"] + 'px;">'
      if (Response["campos_det"][x]["TablaCampo"] == "cmptxtsimple") {
        readonly_int = ''
        if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Modificable"] == "N") {
          readonly_int = 'readonly="readonly"'
        }
        if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Largo"] > 100) {
          fila = fila + '<textarea type="text" id="' + id_tag + '" class="form-control" value="' + valor_campo + '" ' + readonly_int + ' onchange="guardar_calcular_det(' + id_tag + ')" style="height: ' + altura_mini + 'px;font-size: 11px;">' + valor_campo + '</textarea>'
        } else {
          fila = fila + '<input type="text" id="' + id_tag + '" class="form-control" value="' + valor_campo + '" ' + readonly_int + ' onchange="guardar_calcular_det(' + id_tag + ')" style="height: 25px;font-size: 11px;">'
        }

      }


      if (Response["campos_det"][x]["TablaCampo"] == "cmpformquery") {
        readonly_int = ''
        fila = fila + '<div id="' + id_tag + '" type="button" style="width: 100%;font-size: 10px;background: yellow;color: black;cursor: pointer;padding-top: 5px;padding-bottom: 5px;padding-left: 5px;padding-right: 5px;" class="col-sx-5" data-toggle="modal" data-target="#modal-default_formulas" onclick="abrirformula(' + id_tag + ')">' + valor_campo + '</div>'
      }

      if (Response["campos_det"][x]["TablaCampo"] == "cmpnumsimple") {

        fila = fila + '<input type="text" id="' + id_tag + '" class="form-control" value="' + valor_campo + '" onchange="guardar_calcular_det(' + id_tag + ')" min="' + Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Menor"] + '" max="' + Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Mayor"] + '" style="text-align: right;height: 25px;font-size: 11px;" onkeypress="return solo_numero(event)">'
      }
      if (Response["campos_det"][x]["TablaCampo"] == "cmpnumsecuencial") {

        fila = fila + '<input type="number" id="' + id_tag + '" class="form-control" value="' + valor_campo + '" readonly="readonly" style="text-align: right;height: 25px;font-size: 11px;">'
      }
      if (Response["campos_det"][x]["TablaCampo"] == "cmpopcmultiple") {



        fila = fila + '<select class="form-control" id="' + id_tag + '" value="' + valor_campo + '" onchange="guardar_calcular_det(' + id_tag + ')" style="height: 25px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;padding-top: 0px;padding-bottom: 0px;">'

        for (z = 0; z < Response["func_det"][Response["campos_det"][x]["Nombre"]].length; z++) {

          if (valor_campo == Response["func_det"][Response["campos_det"][x]["Nombre"]][z]["Valor"]) {
            fila = fila + '<option selected value="' + Response["func_det"][Response["campos_det"][x]["Nombre"]][z]["Valor"] + '">' + Response["func_det"][Response["campos_det"][x]["Nombre"]][z]["Nombre"] + '</option>'
          } else {
            fila = fila + '<option value="' + Response["func_det"][Response["campos_det"][x]["Nombre"]][z]["Valor"] + '">' + Response["func_det"][Response["campos_det"][x]["Nombre"]][z]["Nombre"] + '</option>'
          }

        }

        fila = fila + '</select>'
      }
      if (Response["campos_det"][x]["TablaCampo"] == "cmpsistema") {

        if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["PkId"] == 2) {
          fila = fila + '<input type="text" id="' + id_tag + '" class="form-control" value="' + valor_campo + '" readonly="readonly" style="height: 25px;font-size: 11px;">'
        }

        if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["PkId"] == 1) {
          fila = fila + '<input type="datetime-local" id="' + id_tag + '" class="form-control" value="' + valor_campo + '" readonly="readonly" style="height: 25px;font-size: 11px;line-height: 7px;">'
        }
        if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["PkId"] == 4) {

          fila = fila + '<select id="' + id_tag + '" class="form-control value="' + valor_campo + '" readonly="readonly" style="height: 25px;font-size: 11px;" onchange="guardar_calcular_det(' + id_tag + ')">'
          for (zxz = 0; zxz < web_user.length; zxz++) {
            if (web_user[zxz] == valor_campo) {
              fila = fila + '<option selected>' + web_user[zxz] + '</option>'

            } else {
              fila = fila + '<option>' + web_user[zxz] + '</option>'

            }
          }
          fila = fila + '</select>'

        }
      }
      if (Response["campos_det"][x]["TablaCampo"] == "cmpformuladetalle") {


        fila = fila + '<input type="text" id="' + id_tag + '" class="form-control" value="' + valor_campo + '" readonly="readonly" style="text-align: right;height: 25px;font-size: 11px;">'
      }
      if (Response["campos_det"][x]["TablaCampo"] == "cmpfecha") {
        tipodato = 'date'

        if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Tiempo"] == 'Y') {
          tipodato = 'datetime-local'
        }
        fila = fila + '<input type="' + tipodato + '" id="' + id_tag + '" class="form-control" value="' + valor_campo + '" onchange="guardar_calcular_det(' + id_tag + ')" style="height: 25px;font-size: 11px;line-height: 7px;">'
      }



      if (Response["campos_det"][x]["TablaCampo"] == "cmpreferencia") {

        fila = fila + '<div class="input-group" style="width: 100%;"><input type="text" id="' + id_tag + '" class="form-control" value="' + valor_campo + '" style="width: 75%;height: 25px;font-size: 11px;line-height: 7px;" onchange="guardar_calcular_det(' + id_tag + ')" onkeypress="return runScript_detalle(event, ' + id_tag + ')">'


        fila = fila + '<button class="btn btn-info" data-toggle="modal" data-target=".bs-example-modal-lg" onclick="buscar_referencia_detalle(' + id_tag + ' )" style="height: 25px;padding: 3px 4px;margin-top: 0px;margin-bottom: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></button></div>'
      }
      if (Response["campos_det"][x]["TablaCampo"] == "cmpreferenciaadjunto") {

        if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Tipo"] == 'Imagen') {
          fila = fila + '<div class="thumbnail" style="height: 160px;margin-bottom: 1px;"><div class="image view view-first"><a id="' + id_tag + '_label" href="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" target="_blank" style="font-size: 11px;"><img style="width: 100%;height: 60%; display: block;" id="' + id_tag + '_img" src="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" alt="image" value="' + valor_campo + '">' + valor_campo + '</a>'
          altura_mini = 125
          if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Modificable"] == 'N') {
            fila = fila + '</div></div>'

          } else {
            fila = fila + '<label for="' + id_tag + '_img_file" class="btn bg-blue btn-flat margin btn-block btn-outlined" style="padding-left: 0px;padding-right: 0px;    margin-bottom: 0px;">Cambiar</label>'
            fila = fila + '<input type="file" id="' + id_tag + '_img_file" onchange="cambiar_imagen(' + id_tag + '_img)" style="display: none"></div></div>'
          }

        } else {
          clave_adjunto = ''
          Moddato = ''
          if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Modificable"] == 'N') {
            Moddato = 'readonly="readonly"'
          }

          widt_clave = ''
          if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["TieneClave"] == 'Si') {
            pre_adjunto = '<div class="input-group" style="width: 100%;">'
            clave_adjunto = '<button class="btn btn-warning" data-toggle="modal" data-target="#modal-default_permiteCambio" onclick="ponerdatos_modal_cambio(\'' + id_tag +'\', \'' + Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Clave"] +'\')" style="height: 25px;padding: 3px 4px;margin-top: 0px;margin-bottom: 0px;"><span class="fa fa-lock" aria-hidden="true"></span></button>'
            post_adjunto = '</div>'
            widt_clave = 'width: 80%;'

          }else{
            pre_adjunto = ''
            clave_adjunto = ''
            post_adjunto = ''
          }

          fila = fila  + pre_adjunto
          if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Tipo"] == 'Texto') {
            if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Tamano"] == 'G') {
              fila = fila + '<textarea type="text" onchange="guardar_calcular_det(' + id_tag + ')" id="' + id_tag + '" class="form-control" value="' + valor_campo + '"  ' + Moddato + ' style="height: ' + altura_mini + 'px;font-size: 11px;'+widt_clave+'">' + valor_campo + '</textarea>'
            } else {
              fila = fila + '<input type="text" onchange="guardar_calcular_det(' + id_tag + ')" id="' + id_tag + '" class="form-control" value="' + valor_campo + '"  ' + Moddato + ' style="height: 25px;font-size: 11px;'+widt_clave+'">'
            }

          }
          if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Tipo"] == 'Numero') {
            fila = fila + '<input type="text" onchange="guardar_calcular_det(' + id_tag + ')" id="' + id_tag + '" class="form-control" value="' + valor_campo + '"  ' + Moddato + ' style="text-align: right;height: 25px;font-size: 11px;'+widt_clave+'" onkeypress="return solo_numero(event)">'

          }
          if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Tipo"] == 'Fecha') {

            fila = fila + '<input type="date" id="' + id_tag + '" class="form-control" value="' + valor_campo + '"  ' + Moddato + ' style="height: 25px;font-size: 11px;">'
          }
          if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Tipo"] == 'Fecha Tiempo') {

            fila = fila + '<input type="datetime-local" id="' + id_tag + '" class="form-control" value="' + valor_campo + '" ' + Moddato + ' style="height: 25px;font-size: 11px;">'
          }
          fila =  fila + clave_adjunto + post_adjunto


        }
      }
      if (Response["campos_det"][x]["TablaCampo"] == "cmpoperacion") {

        fila = fila + '<input type="text" id="' + id_tag + '" class="form-control" value="' + valor_campo + '" onchange="setTwoNumberDecimal(' + Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Decimales"] + ')" readonly="readonly" style="text-align: right;height: 25px;font-size: 11px;">'
      }
      if (Response["campos_det"][x]["TablaCampo"] == "cmpconsolidado") {

        fila = fila + '<input type="text" id="' + id_tag + '" class="form-control" value="' + valor_campo + '" readonly="readonly" style="text-align: right;height: 25px;font-size: 11px;">'
      }
      if (Response["campos_det"][x]["TablaCampo"] == "cmparchivo") {
        //fila = fila + '<input type="file" id="' + id_tag +'" class="form-control" value="'+ valor_campo +'" style="height: 25px;font-size: 11px;">'

        fila = fila + '<div class="thumbnail" style="height: 160px;margin-bottom: 1px;"><div class="image view view-first"><a id="' + id_tag + '_label" href="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" target="_blank" style="font-size: 11px;"><img style="width: 100%;height: 60%; display: block;" id="' + id_tag + '_img" src="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" alt="image" value="' + valor_campo + '">' + valor_campo + '</a>'

        fila = fila + '<label for="' + id_tag + '_img_file" class="btn bg-blue btn-flat margin btn-block btn-outlined" style="padding-left: 0px;padding-right: 0px;margin-bottom: 0px;">Cambiar</label>'
        fila = fila + '<input type="file" id="' + id_tag + '_img_file" onchange="cambiar_imagen(' + id_tag + '_img)" style="display: none"></div></div>'



      }
      if (Response["campos_det"][x]["TablaCampo"] == "cmpnumeroaletras") {

        fila = fila + '<input type="text" id="' + id_tag + '" class="form-control" value="' + valor_campo + '"  readonly="readonly" style="height: 25px;font-size: 11px;">'
      }
      if (Response["campos_det"][x]["TablaCampo"] == "cmpdecabecera") {

        fila = fila + '<input type="text" id="' + id_tag + '" class="form-control" value="' + valor_campo + '"  readonly="readonly" style="height: 25px;font-size: 11px;">'
      }
      if (Response["campos_det"][x]["TablaCampo"] == "cmpelectronico") {

        fila = fila + '<input type="text" id="' + id_tag + '" class="form-control" value="' + valor_campo + '"  readonly="readonly" style="height: 25px;font-size: 11px;">'
      }
      if (Response["campos_det"][x]["TablaCampo"] == "cmpcondicional") {

        fila = fila + '<input type="text" id="' + id_tag + '" class="form-control" value="' + valor_campo + '"  readonly="readonly" style="height: 25px;font-size: 11px;">'
      }
      fila = fila + '</div></td>'

    } else {

      fila = fila + '<input type="hidden" id="' + id_tag + '" value="' + valor_campo + '" ' + readonly + '>'
    }
  }

  fila = fila + '</tr>'


  ////////////////////////////subdetalle
  if (typeof (Response["campos_subdet"]) == "object") {
    div_campos = ''
    ccsub_porPesta['p-' + id_tab] = ccsub_porPesta['p-' + id_tab] + 1

    var largo_tablasubdet = 0
    for (f = 0; f < Response["campos_subdet"].length; f++) {
      if (Response["campos_subdet"][f]["Visible"] == "Y") {
        largo_tablasubdet = largo_tablasubdet + parseFloat(Response["campos_subdet"][f]["largo"])

      }
    }

    div_campos = div_campos + '<tr id="regdet-' + Response["pestalla"] + '-' + i + '" style="background-color: #0073b7;" hidden="">'

    div_campos = div_campos + '<td colspan="15" style="padding-left: 26px;"><div><div class="panel-body" style="overflow: auto;padding-top: px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;"><table class="table" id="tablaSub' + Response["pestalla"] + '-' + i + '" table-hover" style="background-color: aliceblue;margin-bottom: 0px;width: ' + parseInt(largo_tablasubdet) + 'px"><thead>'

    div_campos = div_campos + ''
    div_campos = div_campos + '<tr><th>'
    div_campos = div_campos + '<button type="button" onclick="massub(' + Response["pestalla"] + ',' + i + ')" class="btn bg-green btn-flat margin" style="padding: 3px 9px;margin-bottom: 0px;margin-top: 0px;margin-left: -5px;">+</button>'


    div_campos = div_campos + '</th>'


    for (f = 0; f < Response["campos_subdet"].length; f++) {
      if (Response["campos_subdet"][f]["Visible"] == "Y") {
        div_campos = div_campos + '<th class="col-md-' + Response["campos_subdet"][f]["largoweb"] + '" style="padding-left: 0px;padding-right: 0px;">' + Response["campos_subdet"][f]["Descripcion"] + '</th>'
      }
    }
    div_campos = div_campos + '</tr></thead><tbody>'
    var i2 = ccsub_porPesta['p-' + id_tab]

    div_campos = div_campos + '<tr id="subf' + Response["pestalla"] + '-f' + i2 + '-z' + i + '" style="background: white;"><td><div class="row"  style="padding-left: 10px;">'

    div_campos = div_campos + '<button type="button" onclick="menossub(' + Response["pestalla"] + ',' + i2 + ',' + i + ')" class="btn bg-red btn-flat margin" style="padding: 3px 10px;margin-right: 10px;">-</button>'

    div_campos = div_campos + '</div></td>'
    for (f = 0; f < Response["campos_subdet"].length; f++) {
      valor_campo = 0
      id_tag_subdetalle = 'ps' + Response["pestalla"] + 'qqq' + i2 + 'yyy' + i + 'www' + Response["campos_subdet"][f]["Nombre"]

      if (Response["campos_subdet"][f]["Visible"] == "Y") {


        div_campos = div_campos + '<td style="padding-left: 0px;padding-right: 5px;"><div style="width: ' + Response["campos_subdet"][f]["largo"] + 'px;">'




        //div_campos = div_campos + '<input type="text" id="'+id_tag_subdetalle +'" class="form-control" value="'+ valor_campo +'" '+ readonly +' onchange="guardar_calcular_subdet('+ id_tag_subdetalle +')" style="text-align: right;height: 25px;font-size: 11px;">'
        if (Response["campos_subdet"][f]["TablaCampo"] == "cmpnumsecuencial") {
          div_campos = div_campos + '<input type="number" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" readonly="readonly" style="text-align: right;height: 25px;font-size: 11px;">'

        }
        if (Response["campos_subdet"][f]["TablaCampo"] == "cmpnumsimple") {
          div_campos = div_campos + '<input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" onchange="guardar_calcular_subdet(' + id_tag_subdetalle + ')" min="' + Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]][0]["Menor"] + '" max="' + Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]][0]["Mayor"] + '" style="text-align: right;height: 25px;font-size: 11px;" onkeypress="return solo_numero(event)">'

        }
        if (Response["campos_subdet"][f]["TablaCampo"] == "cmptxtsimple") {
          if (Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]][0]["Modificable"] == "N") {
            readonly_int = 'readonly="readonly"'
          }
          div_campos = div_campos + '<input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" onchange="guardar_calcular_subdet(' + id_tag_subdetalle + ')" ' + readonly_int + ' style="height: 25px;font-size: 11px;">'

        }
        if (Response["campos_subdet"][f]["TablaCampo"] == "cmpreferenciaadjunto") {
          if (Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]][0]["Modificable"] == 'N') {
            Moddato = 'readonly="readonly"'
          }
          altura_mini = 125

          if (Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]][0]["Tipo"] == 'Texto') {
            if (Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]][0]["Tamano"] == 'G') {
              div_campos = div_campos + '<textarea type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular_subdet(' + id_tag_subdetalle + ')" style="font-size: 11px;height: ' + altura_mini + 'px;">' + valor_campo + '</textarea>'
            } else {
              div_campos = div_campos + '<input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular_subdet(' + id_tag_subdetalle + ')" style="height: 25px;font-size: 11px;">'
            }

          }
          if (Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]][0]["Tipo"] == 'Numero') {

            div_campos = div_campos + '<input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular_subdet(' + id_tag_subdetalle + ')" style="text-align: right;height: 25px;font-size: 11px;" onkeypress="return solo_numero(event)">'
          }



        }
        if (Response["campos_subdet"][f]["TablaCampo"] == "cmpreferencia") {

          div_campos = div_campos + '<div class="input-group" style="width: ' + Response["campos_subdet"][f]["largo"] + 'px;"><input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_subdet(' + id_tag_subdetalle + ')" style="width: 80%;height: 25px;font-size: 11px;" onkeypress="return runScript_subdetalle(event, ' + id_tag_subdetalle + ')">'
          div_campos = div_campos + '<button type="button" class="btn btn-info" data-toggle="modal" data-target=".bs-example-modal-lg" onclick="buscar_referencia_subdetalle(' + id_tag_subdetalle + ' )" style="height: 25px;padding: 3px 4px;margin-top: 0px;margin-bottom: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></button></div>'

        }
        if (Response["campos_subdet"][f]["TablaCampo"] == "cmpoperacion") {

          div_campos = div_campos + '<input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="setTwoNumberDecimal(' + Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]][0]["Decimales"] + ')" readonly="readonly" style="text-align: right;height: 25px;font-size: 11px;"> '
        }
        if (Response["campos_subdet"][f]["TablaCampo"] == "cmpconsolidado") {
          div_campos = div_campos + '<input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
        }
        if (Response["campos_subdet"][f]["TablaCampo"] == "cmpdecabecera") {
          div_campos = div_campos + '<input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
        }
        if (Response["campos_subdet"][f]["TablaCampo"] == "cmpopcmultiple") {
          if (tipo != 'consulta') {
            div_c_t = div_c_t + '<select class="form-control col-sm-' + Response["campos_subdet"][f]["largoweb"] + '" id="' + ID_TAG + '" value="' + valor_campo + '"  style="height: 25px;font-size: 11px;">'

            for (z = 0; z < Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]].length; z++) {

              if (valor_campo == Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]][f]["Valor"]) {
                div_c_t = div_c_t + '<option selected value="' + Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]][z]["Valor"] + '">' + Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]][z]["Nombre"] + '</option>'
              } else {
                div_c_t = div_c_t + '<option value="' + Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]][z]["Valor"] + '">' + Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]][z]["Nombre"] + '</option>'
              }
            }
            div_c_t = div_c_t + '</select>'
          } else {
            div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_subdet"][f]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + '  style="height: 25px;font-size: 11px;">'
          }
        }

        if (Response["campos_subdet"][f]["TablaCampo"] == "cmpfecha") {
          tipodato = 'date'
          var now = new Date();

          if (Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]][0]["Tiempo"] == 'Y') {
            tipodato = 'datetime-local'
            valor_campo = now
          }else{
            valor_campo = now.format("Y-m-d");

          }
          div_campos = div_campos + '<input type="' + tipodato + '" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_subdet(' + id_tag_subdetalle + ')" style="height: 25px;font-size: 11px;line-height: 7px;">'
        }
      } else {
        div_campos = div_campos + '<input type="hidden" id="' + id_tag_subdetalle + '" value="' + valor_campo + '" ' + readonly + '>'

      }

    }
    div_campos = div_campos + '</tr>'

    $('#tabla' + id_tab + ' tr:first').after(div_campos);

  }
  ////////////////////////////subdetalle


  //$('#tabla' +id_tab + ' tr:last').after(fila);
  $('#tabla' + id_tab + ' tr:first').after(fila);

  calcular_detalle_nuevo(Response["pestalla"], i)
  //calcular_0(Response["pestalla"])


  calcular_0_v2(Response["pestalla"],[])
  
    for (mas_x = 0; mas_x <= (cc_porPesta["p-" + Response["pestalla"]]); mas_x++) {
      calcular_detalleV2(Response["pestalla"], mas_x)
    }
}


function ponerdatos_modal_cambio(idcampo, clave) {
  document.getElementById('default_permiteCambioCampoId').value = idcampo
  document.getElementById('default_permiteCambioCalveIbase').value = clave
}



function permiteCambio() {

  
  campocambio = document.getElementById(document.getElementById('default_permiteCambioCampoId').value)
  if(document.getElementById('default_permiteCambioCalveIbase').value == document.getElementById('default_permiteCambioCalveIng').value){
    campocambio.removeAttribute('readonly')
    campocambio.style.backgroundColor = 'lightgreen'
    campocambio = ''
    document.getElementById('default_permiteCambioCampoId').value = ''
    document.getElementById('default_permiteCambioCalveIbase').value = ''
    document.getElementById('default_permiteCambioCalveIng').value = ''
    
    document.getElementById('cerrar_permiteCambio').click()
  }else{
    document.getElementById('labelpermiteCambio').innerHTML = 'Clave incorrecta'

    
  }
}




function massub(id_tab, id_det) {

  ccsub_porPesta['p-' + id_tab] = ccsub_porPesta['p-' + id_tab] + 1

  Response = dict_pestalla['p-' + id_tab]



  fila = '<tr id="subf' + Response["pestalla"] + '-f' + ccsub_porPesta['p-' + id_tab] + '-z' + id_det + '" style="background: white;"><td><div class="row" style="padding-left: 10px;">'
  fila = fila + '<button type="button" style="padding: 3px 10px;margin-right: 10px;" onclick="menossub(' + Response["pestalla"] + ',' + ccsub_porPesta['p-' + id_tab] + ',' + id_det + ')" class="btn bg-red btn-flat margin" >-</button>'
  //fila = fila + '<button type="button" style="padding: 3px 4px;" onclick="mas(' + Response["pestalla"]+')" class="btn bg-green btn-flat margin" >+</button></div></td>'
  fila = fila + '</div></td>'

  i = ccsub_porPesta['p-' + id_tab]
  altura_mini = 45

  for (x = 0; x < Response["campos_subdet"].length; x++) {
    valor_campo = 0;
    if (Response["campos_subdet"][x]["TablaCampo"] == "cmpformquery") {
      valor_campo = 'Crear Formula'
    }
    if (Response["campos_subdet"][x]["TablaCampo"] == "cmptxtsimple") {
      valor_campo = Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0]["ValorPredeterminado"]
    }
    if (Response["campos_subdet"][x]["TablaCampo"] == "cmpnumsimple") {
      valor_campo = Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0]["Menor"]
    }
    if (Response["campos_subdet"][x]["TablaCampo"] == "cmpnumsecuencial") {
      if (Response["campos_subdet"][x]["TablaCampo"].substring(0, 2) == "Pk") {
        valor_campo = 0
      } else {
        valor_campo = Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0]["ValorInicial"]
      }
    }
    if (Response["campos_subdet"][x]["TablaCampo"] == "cmpopcmultiple") {
      valor_campo = Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0]["Valor"]

    }
    if (Response["campos_subdet"][x]["TablaCampo"] == "cmpsistema") {

      if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0]["PkId"] == 2) {
        valor_campo = web_usuario

      }

      if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0]["PkId"] == 1) {
        var now = new Date();
        valor_campo = now.format("Y-m-d H:i:s");
      }

    }
    if (Response["campos_subdet"][x]["TablaCampo"] == "cmpformuladetalle") {
      valor_campo = 0
    }
    if (Response["campos_subdet"][x]["TablaCampo"] == "cmpfecha") {
      var now = new Date();
      addi = ' AM'
      if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0]["Tiempo"] == "Y") {
        if (now.format("H") > 11) { addi = ' PM' }
        valor_campo = now + addi
      } else {
        valor_campo = now.format("Y-m-d");
      }
    }
    if (Response["campos_subdet"][x]["TablaCampo"] == "cmpreferencia") {
      if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0][0]["Tipo_Predeterminado"] == '0') {
        valor_campo = 0
      } else {
        valor_campo = Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0][0]["predeterminado_valor"]
      }
    }
    if (Response["campos_subdet"][x]["TablaCampo"] == "cmpreferenciaadjunto") {
      valor_campo = 0
    }
    if (Response["campos_subdet"][x]["TablaCampo"] == "cmpoperacion") {
      valor_campo = 0
    }
    if (Response["campos_subdet"][x]["TablaCampo"] == "cmpconsolidado") {
      valor_campo = 0
    }

    if (Response["campos_subdet"][x]["TablaCampo"] == "cmpdecabecera") {
      valor_campo = ""
    }

    id_tag = 'ps' + Response["pestalla"] + 'qqq' + i + 'yyy' + id_det + 'www' + Response["campos_subdet"][x]["Nombre"]

    if (Response["campos_subdet"][x]["Visible"] == "Y") {

      fila = fila + '<td style="padding-left: 0px;padding-right: 5px;"><div style="width: ' + Response["campos_subdet"][x]["largo"] + 'px;">'
      if (Response["campos_subdet"][x]["TablaCampo"] == "cmptxtsimple") {
        readonly_int = ''
        if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0]["Modificable"] == "N") {
          readonly_int = 'readonly="readonly"'
        }
        if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0]["Largo"] > 100) {
          fila = fila + '<textarea type="text" id="' + id_tag + '" class="form-control" value="' + valor_campo + '" ' + readonly_int + ' onchange="guardar_calcular_subdet(' + id_tag + ')" style="height: ' + altura_mini + 'px;font-size: 11px;">' + valor_campo + '</textarea>'
        } else {
          fila = fila + '<input type="text" id="' + id_tag + '" class="form-control" value="' + valor_campo + '" ' + readonly_int + ' onchange="guardar_calcular_subdet(' + id_tag + ')" style="height: 25px;font-size: 11px;">'
        }

      }


      if (Response["campos_subdet"][x]["TablaCampo"] == "cmpformquery") {
        readonly_int = ''
        fila = fila + '<div id="' + id_tag + '" type="button" style="width: 100%;font-size: 10px;background: yellow;color: black;cursor: pointer;padding-top: 5px;padding-bottom: 5px;padding-left: 5px;padding-right: 5px;" class="col-sx-5" data-toggle="modal" data-target="#modal-default_formulas" onclick="abrirformula(' + id_tag + ')">' + valor_campo + '</div>'
      }

      if (Response["campos_subdet"][x]["TablaCampo"] == "cmpnumsimple") {

        fila = fila + '<input type="text" id="' + id_tag + '" class="form-control" value="' + valor_campo + '" onchange="guardar_calcular_subdet(' + id_tag + ')" min="' + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0]["Menor"] + '" max="' + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0]["Mayor"] + '" style="text-align: right;height: 25px;font-size: 11px;" onkeypress="return solo_numero(event)">'
      }
      if (Response["campos_subdet"][x]["TablaCampo"] == "cmpnumsecuencial") {

        fila = fila + '<input type="number" id="' + id_tag + '" class="form-control" value="' + valor_campo + '" readonly="readonly" style="text-align: right;height: 25px;font-size: 11px;">'
      }
      if (Response["campos_subdet"][x]["TablaCampo"] == "cmpopcmultiple") {



        fila = fila + '<select class="form-control" id="' + id_tag + '" value="' + valor_campo + '" onchange="guardar_calcular_subdet(' + id_tag + ')" style="height: 25px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;padding-top: 0px;padding-bottom: 0px;">'

        for (z = 0; z < Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]].length; z++) {

          if (valor_campo == Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][z]["Valor"]) {
            fila = fila + '<option selected value="' + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][z]["Valor"] + '">' + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][z]["Nombre"] + '</option>'
          } else {
            fila = fila + '<option value="' + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][z]["Valor"] + '">' + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][z]["Nombre"] + '</option>'
          }

        }

        fila = fila + '</select>'
      }
      if (Response["campos_subdet"][x]["TablaCampo"] == "cmpsistema") {

        if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0]["PkId"] == 2) {
          fila = fila + '<input type="text" id="' + id_tag + '" class="form-control" value="' + valor_campo + '" readonly="readonly" style="height: 25px;font-size: 11px;">'
        }

        if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0]["PkId"] == 1) {
          fila = fila + '<input type="datetime-local" id="' + id_tag + '" class="form-control" value="' + valor_campo + '" readonly="readonly" style="height: 25px;font-size: 11px;line-height: 7px;">'
        }
      }
      if (Response["campos_subdet"][x]["TablaCampo"] == "cmpformuladetalle") {


        fila = fila + '<input type="text" id="' + id_tag + '" class="form-control" value="' + valor_campo + '" readonly="readonly" style="text-align: right;height: 25px;font-size: 11px;">'
      }
      if (Response["campos_subdet"][x]["TablaCampo"] == "cmpfecha") {
        tipodato = 'date'

        if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0]["Tiempo"] == 'Y') {
          tipodato = 'datetime-local'
        }
        fila = fila + '<input type="' + tipodato + '" id="' + id_tag + '" class="form-control" value="' + valor_campo + '" onchange="guardar_calcular_subdet(' + id_tag + ')" style="height: 25px;font-size: 11px;line-height: 7px;">'
      }



      if (Response["campos_subdet"][x]["TablaCampo"] == "cmpreferencia") {

        fila = fila + '<div class="input-group" style="width: ' + Response["campos_subdet"][x]["largo"] + 'px;"><input type="text" id="' + id_tag + '" class="form-control" value="' + valor_campo + '" style="width: 80%;height: 25px;font-size: 11px;line-height: 7px;" onchange="guardar_calcular_subdet(' + id_tag + ')" onkeypress="return runScript_detalle(event, ' + id_tag + ')">'


        fila = fila + '<button class="btn btn-info" data-toggle="modal" data-target=".bs-example-modal-lg" onclick="buscar_referencia_subdetalle(' + id_tag + ' )" style="height: 25px;padding: 3px 4px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></button></div>'
      }
      if (Response["campos_subdet"][x]["TablaCampo"] == "cmpreferenciaadjunto") {

        if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0]["Tipo"] == 'Imagen') {
          fila = fila + '<div class="thumbnail" style="height: 160px;margin-bottom: 1px;"><div class="image view view-first"><a id="' + id_tag + '_label" href="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" target="_blank" style="font-size: 11px;"><img style="width: 100%;height: 60%; display: block;" id="' + id_tag + '_img" src="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" alt="image" value="' + valor_campo + '">' + valor_campo + '</a>'
          altura_mini = 125
          if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0]["Modificable"] == 'N') {
            fila = fila + '</div></div>'

          } else {
            fila = fila + '<label for="' + id_tag + '_img_file" class="btn bg-blue btn-flat margin btn-block btn-outlined" style="padding-left: 0px;padding-right: 0px;    margin-bottom: 0px;">Cambiar</label>'
            fila = fila + '<input type="file" id="' + id_tag + '_img_file" onchange="cambiar_imagen(' + id_tag + '_img)" style="display: none"></div></div>'
          }

        } else {
          Moddato = ''
          if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0]["Modificable"] == 'N') {
            Moddato = 'readonly="readonly"'
          }
          if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0]["Tipo"] == 'Texto') {
            if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0]["Tamano"] == 'G') {
              fila = fila + '<textarea type="text" onchange="guardar_calcular_subdet(' + id_tag + ')" id="' + id_tag + '" class="form-control" value="' + valor_campo + '"  ' + Moddato + ' style="height: ' + altura_mini + 'px;font-size: 11px;">' + valor_campo + '</textarea>'
            } else {
              fila = fila + '<input type="text" onchange="guardar_calcular_subdet(' + id_tag + ')" id="' + id_tag + '" class="form-control" value="' + valor_campo + '"  ' + Moddato + ' style="height: 25px;font-size: 11px;">'
            }

          }
          if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0]["Tipo"] == 'Numero') {
            fila = fila + '<input type="text" onchange="guardar_calcular_subdet(' + id_tag + ')" id="' + id_tag + '" class="form-control" value="' + valor_campo + '"  ' + Moddato + ' style="text-align: right;height: 25px;font-size: 11px;" onkeypress="return solo_numero(event)">'

          }
          if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0]["Tipo"] == 'Fecha') {

            fila = fila + '<input type="date" id="' + id_tag + '" class="form-control" value="' + valor_campo + '"  ' + Moddato + ' style="height: 25px;font-size: 11px;">'
          }
          if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0]["Tipo"] == 'Fecha Tiempo') {

            fila = fila + '<input type="datetime-local" id="' + id_tag + '" class="form-control" value="' + valor_campo + '" ' + Moddato + ' style="height: 25px;font-size: 11px;">'
          }


        }
      }
      if (Response["campos_subdet"][x]["TablaCampo"] == "cmpoperacion") {

        fila = fila + '<input type="text" id="' + id_tag + '" class="form-control" value="' + valor_campo + '" onchange="setTwoNumberDecimal(' + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0]["Decimales"] + ')" readonly="readonly" style="text-align: right;height: 25px;font-size: 11px;">'
      }
      if (Response["campos_subdet"][x]["TablaCampo"] == "cmpconsolidado") {

        fila = fila + '<input type="text" id="' + id_tag + '" class="form-control" value="' + valor_campo + '" readonly="readonly" style="height: 25px;font-size: 11px;">'
      }
      if (Response["campos_subdet"][x]["TablaCampo"] == "cmparchivo") {
        //fila = fila + '<input type="file" id="' + id_tag +'" class="form-control" value="'+ valor_campo +'" style="height: 25px;font-size: 11px;">'

        fila = fila + '<div class="thumbnail" style="height: 160px;margin-bottom: 1px;"><div class="image view view-first"><a id="' + id_tag + '_label" href="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" target="_blank" style="font-size: 11px;"><img style="width: 100%;height: 60%; display: block;" id="' + id_tag + '_img" src="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" alt="image" value="' + valor_campo + '">' + valor_campo + '</a>'

        fila = fila + '<label for="' + id_tag + '_img_file" class="btn bg-blue btn-flat margin btn-block btn-outlined" style="padding-left: 0px;padding-right: 0px;margin-bottom: 0px;">Cambiar</label>'
        fila = fila + '<input type="file" id="' + id_tag + '_img_file" onchange="cambiar_imagen(' + id_tag + '_img)" style="display: none"></div></div>'



      }
      if (Response["campos_subdet"][x]["TablaCampo"] == "cmpnumeroaletras") {

        fila = fila + '<input type="text" id="' + id_tag + '" class="form-control" value="' + valor_campo + '"  readonly="readonly" style="height: 25px;font-size: 11px;">'
      }
      if (Response["campos_subdet"][x]["TablaCampo"] == "cmpdecabecera") {

        fila = fila + '<input type="text" id="' + id_tag + '" class="form-control" value="' + valor_campo + '"  readonly="readonly" style="height: 25px;font-size: 11px;">'
      }
      if (Response["campos_subdet"][x]["TablaCampo"] == "cmpelectronico") {

        fila = fila + '<input type="text" id="' + id_tag + '" class="form-control" value="' + valor_campo + '"  readonly="readonly" style="height: 25px;font-size: 11px;">'
      }
      fila = fila + '</div></td>'

    } else {

      fila = fila + '<input type="hidden" id="' + id_tag + '" value="' + valor_campo + '" ' + readonly + '>'
    }
  }

  fila = fila + '</tr>'

  //$('#tabla' +id_tab + ' tr:last').after(fila);
  $('#tablaSub' + Response["pestalla"] + '-' + id_det + ' tr:first').after(fila);

  //calcular_detalle_nuevo(Response["pestalla"], i)
  //calcular_0(Response["pestalla"])
}

function registro_sin_server(pkmodulo, pkregistro, tipo, temp_pestalla, origen, t_clave, respuesta_previa, datos_cabecera, datos_detalle, datos_detalleSub) {

  if (bloqueado() == true) {
    document.getElementById('a_default_pagos').click()
    return
  }
  pestalla = pestalla + 1;
  if (temp_pestalla == '-2') {
    temp_pestalla = 'consulta'
    if (pkregistro == 0) {
      temp_pestalla = '-1'
      tipo = 0
    }
  }
  lbl = ''
  if (tipo == 0) { lbl = 'Nuevo: ' }
  if (tipo == 1) { lbl = 'Modificar: ' }
  if (tipo == 2) { lbl = 'Consulta: ' }
  if (tipo == 3) { lbl = 'Consulta: ' }

  if (temp_pestalla == 'consulta') {
    $("#myTab").prepend('<li role="presentation" class="" id="li' + pestalla + '" style="text-align: right;"><a href="#rr' + pestalla + '" id="id' + pestalla + '" role="tab" data-toggle="tab" aria-expanded="false">Consulta <i class="fa fa-times" style="color: red; background: transparent;cursor: pointer;" onclick="cerrar_elemento(' + pestalla + ')"></i></a></li>');
  } else {
    if (temp_pestalla == -1) {
      $("#myTab").prepend('<li role="presentation" class="" id="li' + pestalla + '" style="text-align: right;"><a href="#rr' + pestalla + '" id="id' + pestalla + '" role="tab" data-toggle="tab" aria-expanded="false">Nuevo <i class="fa fa-times" style="color: red; background: transparent;cursor: pointer;" onclick="cerrar_elemento(' + pestalla + ')"></i></a></li>');
    } else {
      if(offline == false){
        if (dict_pestalla['p-' + temp_pestalla]["tabla_cab"] == undefined) {
          $("#myTab").prepend('<li role="presentation" class="" id="li' + pestalla + '" style="text-align: right;"><a href="#rr' + pestalla + '" id="id' + pestalla + '" role="tab" data-toggle="tab" aria-expanded="false">' + lbl + dict_pestalla['p-' + temp_pestalla]["tabla"][0]["Descripcion"] + ' <i class="fa fa-times" style="color: red; background: transparent;cursor: pointer;" onclick="cerrar_elemento(' + pestalla + ')"></i></a></li>');   
        } else {
          $("#myTab").prepend('<li role="presentation" class="" id="li' + pestalla + '" style="text-align: right;"><a href="#rr' + pestalla + '" id="id' + pestalla + '" role="tab" data-toggle="tab" aria-expanded="false" >' + lbl + dict_pestalla['p-' + temp_pestalla]["tabla_cab"]["Descripcion"] + ' <i class="fa fa-times" style="color: red; background: transparent;cursor: pointer;" onclick="cerrar_elemento(' + pestalla + ')"></i> </a></li>');
        }
      }else{
        $("#myTab").prepend('<li role="presentation" class="" id="li' + pestalla + '" style="text-align: right;"><a href="#rr' + pestalla + '" id="id' + pestalla + '" role="tab" data-toggle="tab" aria-expanded="false">' + lbl + dict_pestalla[id_dic]['tabla_cab']['Descripcion'] + ' <i class="fa fa-times" style="color: red; background: transparent;cursor: pointer;" onclick="cerrar_elemento(' + pestalla + ')"></i></a></li>');   
      }
    }
  }



  var id_tab = pkmodulo
  if (tipo == 0) { tipo = 'Nuevo' }
  if (tipo == 1) { tipo = 'modificar' }
  if (tipo == 2) { tipo = 'consulta' }
  if (tipo == 3) { tipo = 'consulta_nuevo' }


    $("#myTabContent").prepend('<div role="tabpanel" class="tab-pane fade" id="rr' + pestalla + '" aria-labelledby="id' + pestalla + '" style="background-color: transparent;"> Procesando </div>');
  
  
    $('#rr' + pestalla).html('');
  
        id_dic = 'p-' + pestalla
        //dict_pestalla[id_dic] = dict_pestalla[id_dic]
        dict_pestalla[id_dic] = respuesta_previa // asume es nuevo siempre
        dict_pestalla[id_dic]["valores_cab"] = datos_cabecera
        dict_pestalla[id_dic]["valores_det"] = datos_detalle
        dict_pestalla[id_dic]["valores_subdet"] = datos_detalleSub
        
        dict_pestalla[id_dic]["t_pkregistro"] = pkregistro
        dict_pestalla[id_dic]['tipo'] = tipo
        dict_pestalla[id_dic]['pestalla'] = pestalla
        
        cc_porPesta[id_dic] = 1
  
        div_botones = '<div class="box-header with-border" style="margin-left: 0px;margin-right: 0px;background: white;padding: 0px;"><div class="col-md-12"><div class="row">'
        readonly = 'readonly="readonly"'
        if (tipo == 'consulta') {
  
          readonly = 'readonly="readonly"'
          //div_botones =div_botones +'<button type="button" onclick="cerrar_elemento(' + pestalla + ')" class="btn bg-blue btn-flat margin"><span>Correo</span></button>'
          if (dict_pestalla[id_dic]["plantilla_pdf"]["plantillasMain"].length > 0) {
            //div_botones =div_botones +'<button type="button" onclick="pdf_elemento(' + pestalla + ')" class="btn bg-blue btn-flat margin"><span>PDF</span></button>'
            for (dd = 0; dd < dict_pestalla[id_dic]["plantilla_pdf"]["plantillasMain"].length; dd++) {
              if(dict_pestalla[id_dic]["plantilla_pdf"]['plantillasfirmas'] == 'Si'){
                adir = dict_pestalla[id_dic]['tabla_cab']['Nombre']+ dict_pestalla[id_dic]['tabla_cab']['PkModulo'] + '_' + dict_pestalla[id_dic]['valores_cab'][0]['Pk'+dict_pestalla[id_dic]['tabla_cab']['Nombre']] + dict_pestalla[id_dic]["plantilla_pdf"]['plantillasMain'][0]['Descripcion']
                div_botones = div_botones + '<a href="/media/firma/PDF/' + web_Id_empresa + '/'+adir+'" target="_blank" style="font-size: 11px;">'
                div_botones = div_botones + '<button type="button" class="btn bg-blue btn-flat margin"><span>' + dict_pestalla[id_dic]["plantilla_pdf"]["plantillasMain"][dd]['Nombre'] + '</span></button>'
                div_botones = div_botones + '</a>'
  
                
              }else{
  
                div_botones = div_botones + '<button type="button" onclick="pdf_elemento(' + pestalla + ', ' + dd + ')" class="btn bg-blue btn-flat margin"><span>' + dict_pestalla[id_dic]["plantilla_pdf"]["plantillasMain"][dd]['Nombre'] + '</span></button>'
                dict_pestalla[id_dic]['tabla_cab']['Nombre']+ dict_pestalla[id_dic]['tabla_cab']['PkModulo'] + '_' + dict_pestalla[id_dic]['valores_cab'][0]['Pk'+dict_pestalla[id_dic]['tabla_cab']['Nombre']] + dict_pestalla[id_dic]["plantilla_pdf"]['plantillasMain'][0]['Descripcion']
                
                
              }
  
            }
          }
  
          for (dd = 0; dd < dict_pestalla[id_dic]["plantilla_html"].length; dd++) {
  
            div_botones = div_botones + '<button type="button" onclick="imprimir_elemento(' + pestalla + ', ' + dd + ')" class="btn bg-blue btn-flat margin"><span>' + dict_pestalla[id_dic]["plantilla_html"][dd]['Nombre'] + '</span></button>'
  
          }
          
  
          if (dict_pestalla[id_dic]["acc_rapido"]['Modificar'] == 'Si') {
            div_botones = div_botones + '<button class="btn bg-yellow btn-flat margin" onclick="registro(' + dict_pestalla[id_dic]["tabla_cab"]["PkModulo"] + ',' + dict_pestalla[id_dic]["t_pkregistro"] + ',1,' + pestalla + ',0,0);cerrar_elemento(' + pestalla + ')">Modificar</span></button>'
          }
  
          if (dict_pestalla[id_dic]["acc_rapido"]['Nuevo'] == 'Si') {
            div_botones = div_botones + '<button class="btn bg-blue btn-flat margin" onclick="registro(' + dict_pestalla[id_dic]["tabla_cab"]["PkModulo"] + ',' + dict_pestalla[id_dic]["t_pkregistro"] + ',0,' + pestalla + ',0,0);cerrar_elemento(' + pestalla + ')">Copiar en Nuevo</span></button>'
          }
          if (dict_pestalla[id_dic]["acc_rapido"]['Eliminar'] == 'Si') {
            div_botones = div_botones + '<button class="btn bg-red btn-flat margin" onclick="cerrar_elemento(' + pestalla + ');eliminar(' + dict_pestalla[id_dic]["tabla_cab"]["PkModulo"] + ',' + dict_pestalla[id_dic]["t_pkregistro"] + ')">Eliminar</span></button>'
          }
  
  
          //div_botones =div_botones +'<button type="button" onclick="excell_elemento(' + pestalla + ')" class="btn bg-blue btn-flat margin"><span>Excell</span></button>'
          if (origen == '1') {
            div_botones = div_botones + '<button class="btn bg-blue btn-flat margin" onclick="registro(' + dict_pestalla[id_dic]["tabla_cab"]["PkModulo"] + ',0,0,' + pestalla + ',0,0);cerrar_elemento(' + pestalla + ')">Nuevo</span></button>'
  
          }
  
          if (tipo != 'Nuevo') { 
            for (x = 0; x < dict_pestalla[id_dic]["estados"].length; x++) {
              if (dict_pestalla[id_dic]["estados"][x]["estado_inicial"] == dict_pestalla[id_dic]["valores_cab"][0][dict_pestalla[id_dic]["estados"][x]["c_estado"]]) {
                div_botones = div_botones + '<button class="' + dict_pestalla[id_dic]["estados"][x]["color"] + '" onclick="cambio_estado(' + dict_pestalla[id_dic]["tabla_cab"]["PkModulo"] + ',' + dict_pestalla[id_dic]["t_pkregistro"] + ',' + dict_pestalla[id_dic]["estados"][x]["pkweb_estados_doc"] + ', ' + pestalla + ')">' + dict_pestalla[id_dic]["estados"][x]["display"] + '</span></button>'
              }
              if (dict_pestalla[id_dic]["estados"][x]["estado_inicial"] == '' && dict_pestalla[id_dic]["estados"][x]["estado_final"] != dict_pestalla[id_dic]["valores_cab"][0][dict_pestalla[id_dic]["estados"][x]["c_estado"]]) {
                div_botones = div_botones + '<button class="' + dict_pestalla[id_dic]["estados"][x]["color"] + '" onclick="cambio_estado(' + dict_pestalla[id_dic]["tabla_cab"]["PkModulo"] + ',' + dict_pestalla[id_dic]["t_pkregistro"] + ',' + dict_pestalla[id_dic]["estados"][x]["pkweb_estados_doc"] + ', ' + pestalla + ')">' + dict_pestalla[id_dic]["estados"][x]["display"] + '</span></button>'
                
              }
            }
          }
          div_botones = div_botones + '<button class="btn bg-red btn-flat margin" id="btnAutocerrar' + pestalla + '" onclick="parar_autoccerar_pestana(' + pestalla + ')">Autocerrar</button>'
  
        }
        else {
          if (tipo == 'Nuevo') {
            disparador = 'Guardar Registro Nuevo'
            //div_botones =div_botones +'<button type="button" id="btn_grabar_'+pestalla+'" onclick="this.disabled=true;click_val(1);grabar_elemento(' + pestalla + ',0)" class="btn bg-green btn-flat margin"><span>Grabar</span></button>'
            div_botones = div_botones + '<button type="button" id="btn_grabar_' + pestalla + '" onclick="abrir_default_grabando();grabar_elemento(' + pestalla + ',0)" class="btn bg-green btn-flat margin"><span>Grabar</span></button>'
  
  
  
          } else {
            disparador = 'Modificar Registro'
            //div_botones =div_botones +'<button  type="button" id="btn_mod_'+pestalla+'" onclick="this.disabled=true;click_val(1);grabar_elemento(' + pestalla + ',1)" class="btn bg-green btn-flat margin"><span>Grabar</span></button>'
            div_botones = div_botones + '<button  type="button" id="btn_mod_' + pestalla + '" onclick="abrir_default_grabando();grabar_elemento(' + pestalla + ',1)" class="btn bg-green btn-flat margin"><span>Grabar</span></button>'
            
            if (dict_pestalla[id_dic]["acc_rapido"]['Nuevo'] == 'Si') {
              div_botones = div_botones + '<button class="btn bg-blue btn-flat margin" onclick="registro(' + dict_pestalla[id_dic]["tabla_cab"]["PkModulo"] + ',' + dict_pestalla[id_dic]["t_pkregistro"] + ',0,' + pestalla + ',0,0);cerrar_elemento(' + pestalla + ')">Copiar en Nuevo</span></button>'
            }
  
  
  
          }
          if(web_esAdmin == 'Y'){
            div_botones = div_botones + '<button type="button" onclick="validar_registro(' + pestalla + ')" class="btn bg-yellow btn-flat margin"><span>Validar</span></button>'
          }
          //div_botones =div_botones +'<button type="button" onclick="nuevo_elemento(' + pestalla + ')" class="btn bg-blue btn-flat margin"><span>Nuevo</span></button>'
          readonly = ''
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
        for (x = 0; x < dict_pestalla[id_dic]["campos_cab"].length; x++) {
  
          if (tipo == 'Nuevo') {
  
            if (dict_pestalla[id_dic]["campos_cab"][x]["TablaCampo"] == "cmpformquery") {
              valor_campo = ''
  
            }
            if (dict_pestalla[id_dic]["campos_cab"][x]["TablaCampo"] == "cmptxtsimple") {
              valor_campo = dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][0]["ValorPredeterminado"]
  
            }
            if (dict_pestalla[id_dic]["campos_cab"][x]["TablaCampo"] == "cmpnumsimple") {
              valor_campo = dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][0]["Menor"]
  
            }
            if (dict_pestalla[id_dic]["campos_cab"][x]["TablaCampo"] == "cmpnumsecuencial") {
              if (dict_pestalla[id_dic]["campos_cab"][x]["TablaCampo"].substring(0, 2) == "Pk") {
                valor_campo = 0
              } else {
                valor_campo = dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][0]["ValorInicial"]
              }
            }
            if (dict_pestalla[id_dic]["campos_cab"][x]["TablaCampo"] == "cmpopcmultiple") {
              valor_campo = dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][0]["Valor"]
            }
            if (dict_pestalla[id_dic]["campos_cab"][x]["TablaCampo"] == "cmpsistema") {
              if (dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][0]["PkId"] == 2) {
                valor_campo = web_usuario
              }
              if (dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][0]["PkId"] == 1) {
                var now = new Date();
                valor_campo = now.format("Y-m-d") + 'T' + now.format("H:i:s")
              }
            }
            if (dict_pestalla[id_dic]["campos_cab"][x]["TablaCampo"] == "cmpformuladetalle") {
              valor_campo = 0
            }
            if (dict_pestalla[id_dic]["campos_cab"][x]["TablaCampo"] == "cmpfecha") {
  
              var now = new Date();
              if (dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][0]["Tiempo"] == "Y") {
                valor_campo = now.format("Y-m-d") + 'T' + now.format("H:i:s")
              } else {
                valor_campo = now.format("Y-m-d");
              }
            }
            if (dict_pestalla[id_dic]["campos_cab"][x]["TablaCampo"] == "cmpreferencia") {
              valor_campo = dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][0][0]["predeterminado_valor"]
            }
            if (dict_pestalla[id_dic]["campos_cab"][x]["TablaCampo"] == "cmpreferenciaadjunto") {
              valor_campo = 0
            }
            if (dict_pestalla[id_dic]["campos_cab"][x]["TablaCampo"] == "cmpoperacion") {
              valor_campo = 0
            }
            if (dict_pestalla[id_dic]["campos_cab"][x]["TablaCampo"] == "cmpconsolidado") {
              valor_campo = 0
            }
            if (dict_pestalla[id_dic]["campos_cab"][x]["TablaCampo"] == "cmparchivo") {
              valor_campo = ""
            }
            if (dict_pestalla[id_dic]["campos_cab"][x]["TablaCampo"] == "cmpnumeroaletras") {
              valor_campo = ""
            }
            if (dict_pestalla[id_dic]["campos_cab"][x]["TablaCampo"] == "cmpdecabecera") {
              valor_campo = ""
            }
            if (dict_pestalla[id_dic]["campos_cab"][x]["TablaCampo"] == "cmpelectronico") {
              valor_campo = 0
  
            }
            if (dict_pestalla[id_dic]["campos_cab"][x]["TablaCampo"] == "cmpcondicional") {
              valor_campo = ""
  
            }
  
  
            if (dict_pestalla[id_dic]["valores_cab"].length > 0) {
  
              if (dict_pestalla[id_dic]["campos_cab"][x]["TablaCampo"] == 'cmpnumsimple' || dict_pestalla[id_dic]["campos_cab"][x]["TablaCampo"] == 'cmptxtsimple' || dict_pestalla[id_dic]["campos_cab"][x]["TablaCampo"] == 'cmpreferencia' || dict_pestalla[id_dic]["campos_cab"][x]["TablaCampo"] == 'cmpreferenciaadjunto') {
                if (dict_pestalla[id_dic]["campos_cab"][x]["TablaCampo"] == 'cmptxtsimple') {
                  if (dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][0]["Modificable"] == 'N') {
                    valor_campo = dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][0]["ValorPredeterminado"]
                  } else {
                    valor_campo = dict_pestalla[id_dic]["valores_cab"][0][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]]
                  }
                } else {
                  valor_campo = dict_pestalla[id_dic]["valores_cab"][0][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]]
                }
  
  
  
              }
  
            }
  
          } else {
            valor_campo = dict_pestalla[id_dic]["valores_cab"][0][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]]
            if (dict_pestalla[id_dic]["campos_cab"][x]["TablaCampo"] == "cmpfecha") {
              var now = new Date(dict_pestalla[id_dic]["valores_cab"][0][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]]);
              if (dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][0]["Tiempo"] == "Y") {
                valor_campo = now.format("Y-m-d") + 'T' + now.format("H:i:s")
              } else {
                now.addDays(1)
                valor_campo = now.format("Y-m-d");
              }
            }
  
          }
  
          if (tipo == 'modificar') {
            readonly = ''
            if (dict_pestalla[id_dic]["campos_cab"][x]["Modificable"] == 'No') {
              readonly = 'readonly="readonly"'
            }
          }
          ID_TAG = 'p' + pestalla + 'zzz' + dict_pestalla[id_dic]["campos_cab"][x]["Nombre"] + '';
          if (dict_pestalla[id_dic]["campos_cab"][x]["Visible"] == "Y") {
            var_Mayusculas = ''
            if (dict_pestalla[id_dic]["campos_cab"][x]["estilo"] == "Mayusculas") {
              var_Mayusculas = 'text-transform: uppercase;'
            }
            div_c_t = dict_pestalla[id_dic]["campos_cab"][x]["saltoweb"]
            div_c_t = div_c_t + '<div class="col-sm-' + dict_pestalla[id_dic]["campos_cab"][x]["largoweb"] + '">'
            div_c_t = div_c_t + '<label class="control-label for="' + dict_pestalla[id_dic]["campos_cab"][x]["Nombre"] + '" style="font-size: 12px;font-weight: bold;">' + dict_pestalla[id_dic]["campos_cab"][x]["Descripcion"] + '</label>'
            if (dict_pestalla[id_dic]["campos_cab"][x]["TablaCampo"] == "cmpformquery") {
              readonly_int = ''
              div_c_t = div_c_t + '<div type="button" style="width: 100%;font-size: 10px;background: yellow;color: black;cursor: pointer;padding-top: 5px;padding-bottom: 5px;padding-left: 5px;padding-right: 5px;" class="col-sx-5" data-toggle="modal" data-target="#modal-default_formulas">if(orden_produccion.Contrato = "10",orden_produccion.Secuencial + orden_produccion.Contrato * (1) * [cant],0)</div>'
            }
            if (dict_pestalla[id_dic]["campos_cab"][x]["TablaCampo"] == "cmptxtsimple") {
              readonly_int = ''
              if (dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][0]["Modificable"] == "N") {
                readonly_int = 'readonly="readonly"'
              }
              if (dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][0]["Largo"] > 100) {
                div_c_t = div_c_t + '<textarea type="text" id="' + ID_TAG + '" class="form-control col-sm-' + dict_pestalla[id_dic]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' ' + readonly_int + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 45px;font-size: 11px;' + var_Mayusculas + '">' + valor_campo + '</textarea>'
              } else {
                div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + dict_pestalla[id_dic]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' ' + readonly_int + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 25px;font-size: 11px;' + var_Mayusculas + '">'
              }
            }
            if (dict_pestalla[id_dic]["campos_cab"][x]["TablaCampo"] == "cmpnumsimple") {
  
              div_c_t = div_c_t + '<input type="number" id="' + ID_TAG + '" class="form-control col-sm-' + dict_pestalla[id_dic]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' min="' + dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][0]["Menor"] + '" max="' + dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][0]["Mayor"] + '" onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="text-align: right;height: 25px;font-size: 11px;" onkeypress="return solo_numero(event)">'
            }
            if (dict_pestalla[id_dic]["campos_cab"][x]["TablaCampo"] == "cmpnumsecuencial") {
  
              div_c_t = div_c_t + '<input type="number" id="' + ID_TAG + '" class="form-control col-sm-' + dict_pestalla[id_dic]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" readonly="readonly" style="text-align: right;height: 25px;font-size: 11px;">'
            }
            if (dict_pestalla[id_dic]["campos_cab"][x]["TablaCampo"] == "cmpopcmultiple") {
              if (tipo != 'consulta') {
                div_c_t = div_c_t + '<select class="form-control col-sm-' + dict_pestalla[id_dic]["campos_cab"][x]["largoweb"] + '" id="' + ID_TAG + '" value="' + valor_campo + '" onchange="guardar_calcular(' + ID_TAG + ' , 0)" style="height: 25px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;">'
  
                for (z = 0; z < dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]].length; z++) {
  
                  if (valor_campo == dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][z]["Valor"]) {
                    div_c_t = div_c_t + '<option selected value="' + dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][z]["Valor"] + '">' + dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][z]["Nombre"] + '</option>'
                  } else {
                    div_c_t = div_c_t + '<option value="' + dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][z]["Valor"] + '">' + dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][z]["Nombre"] + '</option>'
                  }
                }
                div_c_t = div_c_t + '</select>'
              } else {
                for (z = 0; z < dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]].length; z++) {
  
                  if (valor_campo == dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][z]["Valor"]) {
                    valor_campo = dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][z]["Nombre"]
  
                    div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + dict_pestalla[id_dic]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 25px;font-size: 11px;">'
  
                  }
                }
  
              }
            }
            if (dict_pestalla[id_dic]["campos_cab"][x]["TablaCampo"] == "cmpsistema") {
              if (dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][0]["PkId"] == 2) {
                div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + dict_pestalla[id_dic]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" readonly="readonly" style="height: 25px;font-size: 11px;">'
              }
  
              if (dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][0]["PkId"] == 1) {
                div_c_t = div_c_t + '<input type="datetime-local" id="' + ID_TAG + '" class="form-control col-sm-' + dict_pestalla[id_dic]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" readonly="readonly" style="height: 25px;font-size: 11px;line-height: 7px;">'
              }
  
  
              if (dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][0]["PkId"] == 4) {
  
                div_c_t = div_c_t + '<select id="' + ID_TAG + '" class="form-control col-sm-' + dict_pestalla[id_dic]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" readonly="readonly" style="height: 25px;font-size: 11px;">'
                for (zxz = 0; zxz < web_user.length; zxz++) {
                  if (web_user[zxz] == valor_campo) {
                    div_c_t = div_c_t + '<option selected>' + web_user[zxz] + '</option>'
  
                  } else {
                    div_c_t = div_c_t + '<option>' + web_user[zxz] + '</option>'
  
                  }
                }
                div_c_t = div_c_t + '</select>'
  
              }
            }
            if (dict_pestalla[id_dic]["campos_cab"][x]["TablaCampo"] == "cmpformuladetalle") {
  
              div_c_t = div_c_t + '<input type="number" id="' + ID_TAG + '" class="form-control col-sm-' + dict_pestalla[id_dic]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" readonly="readonly" onchange="guardar_calcular(' + ID_TAG + ' , 0 )" style="text-align: right;height: 25px;font-size: 11px;">'
            }
            if (dict_pestalla[id_dic]["campos_cab"][x]["TablaCampo"] == "cmpfecha") {
              tipodato = 'date'
  
              if (dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][0]["Tiempo"] == 'Y') {
                tipodato = 'datetime-local'
              }
              div_c_t = div_c_t + '<input type="' + tipodato + '" id="' + ID_TAG + '" class="form-control col-sm-' + dict_pestalla[id_dic]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 25px;font-size: 11px;line-height: 7px;">'
            }
            if (dict_pestalla[id_dic]["campos_cab"][x]["TablaCampo"] == "cmpreferencia") {
              div_c_t = div_c_t + '<div class="input-group input-group-sm" style="width: 100%;">'
  
              readonlyRef = ''
              if (dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][0][0]["Escribir"] == 'No') { readonlyRef = 'readonly="readonly"' }
  
              if (tipo != 'consulta') {
  
  
                if (tipo == 'modificar') {
                  if (dict_pestalla[id_dic]["campos_cab"][x]["Modificable"] == 'No') {
                    div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + (dict_pestalla[id_dic]["campos_cab"][x]["largoweb"] - 1) + '" value="' + valor_campo + '" ' + readonly + ' ' + readonlyRef + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 25px;font-size: 11px;' + var_Mayusculas + '" onkeypress="return runScript(event, ' + ID_TAG + ')" >'
                  } else {
                    if (dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][0][0]["pkmodulo_ingreso"] != 0) {
                      div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + (dict_pestalla[id_dic]["campos_cab"][x]["largoweb"] - 1) + '" value="' + valor_campo + '" ' + readonly + ' ' + readonlyRef + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="width: 70%;height: 25px;font-size: 11px;' + var_Mayusculas + '" onkeypress="return runScript(event, ' + ID_TAG + ')" >'
                      div_c_t = div_c_t + '<button type="button" class="btn btn-info" data-toggle="modal" data-target=".bs-example-modal-lg" onclick="buscar_referencia_cabecera(' + ID_TAG + ' )"style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></button>'
  
  
                      div_c_t = div_c_t + '<button type="button" class="btn btn-info"  onclick="registro(' + dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][0][0]["pkmodulo_ingreso"] + ',0,0,-1,0,0)" style="height: 25px;padding: 3px 4px;"><i class="fa fa-plus"></i></button>'
                    } else {
                      div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + (dict_pestalla[id_dic]["campos_cab"][x]["largoweb"] - 1) + '" value="' + valor_campo + '" ' + readonly + ' ' + readonlyRef + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="width: 85%;height: 25px;font-size: 11px;' + var_Mayusculas + '" onkeypress="return runScript(event, ' + ID_TAG + ')" >'
                      div_c_t = div_c_t + '<button type="button" class="btn btn-info" data-toggle="modal" data-target=".bs-example-modal-lg" onclick="buscar_referencia_cabecera(' + ID_TAG + ' )"style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></button>'
  
                    }
                  }
  
  
  
                } else {
                  if (dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][0][0]["pkmodulo_ingreso"] != 0) {
                    div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + (dict_pestalla[id_dic]["campos_cab"][x]["largoweb"] - 1) + '" value="' + valor_campo + '" ' + readonly + ' ' + readonlyRef + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="width: 65%;height: 25px;font-size: 11px;" onkeypress="return runScript(event, ' + ID_TAG + ')" >'
                    div_c_t = div_c_t + '<button type="button" class="btn btn-info" data-toggle="modal" data-target=".bs-example-modal-lg" onclick="buscar_referencia_cabecera(' + ID_TAG + ' )"style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></button>'
  
  
                    div_c_t = div_c_t + '<button type="button" class="btn btn-info"  onclick="registro(' + dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][0][0]["pkmodulo_ingreso"] + ',0,0,-1,0,0)" style="height: 25px;padding: 3px 4px;"><i class="fa fa-plus"></i></button>'
                  } else {
                    div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + (dict_pestalla[id_dic]["campos_cab"][x]["largoweb"] - 1) + '" value="' + valor_campo + '" ' + readonly + ' ' + readonlyRef + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="width: 85%;height: 25px;font-size: 11px;" onkeypress="return runScript(event, ' + ID_TAG + ')" >'
                    div_c_t = div_c_t + '<button type="button" class="btn btn-info" data-toggle="modal" data-target=".bs-example-modal-lg" onclick="buscar_referencia_cabecera(' + ID_TAG + ' )"style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></button>'
  
                  }
                }
  
  
  
              } else {
                div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + (dict_pestalla[id_dic]["campos_cab"][x]["largoweb"] - 1) + '" value="' + valor_campo + '" ' + readonly + ' ' + readonlyRef + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="width: 85%;height: 25px;font-size: 11px;"" onkeypress="return runScript(event, ' + ID_TAG + ')" >'
                if (dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][0][0]["pkmod_consul"] != '0') {
                  div_c_t = div_c_t + '<button type="button" class="btn btn-info" onclick="registro(' + dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][0][0]["pkmod_consul"] + ', ' + dict_pestalla[id_dic]["valores_cab"][0][dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][0][0]["campo_fk"]] + ', 2, -2, 0,0)" style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;"><span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span></button>'
                }
  
  
              }
  
              div_c_t = div_c_t + '</div>'
            }
            if (dict_pestalla[id_dic]["campos_cab"][x]["TablaCampo"] == "cmpreferenciaadjunto") {
  
              if (dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][0]["Tipo"] == 'Imagen') {
                
                div_c_t = div_c_t + '<div class="thumbnail" style="height: 160px;margin-bottom: 1px;"><div class="image view view-first"><a id="' + ID_TAG + '_label" href="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" target="_blank" style="font-size: 11px;"><img style="width: 100%;height: 60%;margin-left: auto;margin-right: auto; display: block;" id="' + ID_TAG + '_img" src="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" alt="image" value="' + valor_campo + '">' + valor_campo + '</a>'
  
                if (dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][0]["Modificable"] == 'S') {
                  div_c_t = div_c_t + '<label for="' + ID_TAG + '_img_file" class="btn bg-blue btn-flat margin btn-block btn-outlined" style="padding-left: 0px;padding-right: 0px;margin-bottom: 0px;">Cambiar</label>'  
                  div_c_t = div_c_t + '<input type="file" id="' + ID_TAG + '_img_file" onchange="cambiar_imagen(' + ID_TAG + '_img)" style="display: none">'  
                }
                
                div_c_t = div_c_t + '</div></div>'
                
              }
              else {
                Moddato = ''
                if (dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][0]["Modificable"] == 'N') {
                  Moddato = 'readonly="readonly"'
                }
                if (dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][0]["Tipo"] == 'Texto') {
  
                  if (dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][0]["Tamano"] == 'G') {
  
                    div_c_t = div_c_t + '<textarea type="text" id="' + ID_TAG + '" class="form-control col-sm-' + dict_pestalla[id_dic]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 45px;font-size: 11px;' + var_Mayusculas + '">' + valor_campo + '</textarea>'
  
                  } else {
                    div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + dict_pestalla[id_dic]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 25px;font-size: 11px;' + var_Mayusculas + '">'
                  }
  
  
                }
                if (dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][0]["Tipo"] == 'Numero') {
                  div_c_t = div_c_t + '<input type="number" id="' + ID_TAG + '" class="form-control col-sm-' + dict_pestalla[id_dic]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="text-align: right;" style="height: 25px;font-size: 11px;" onkeypress="return solo_numero(event)">'
  
                }
                if (dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][0]["Tipo"] == 'Fecha') {
  
                  div_c_t = div_c_t + '<input type="date" id="' + ID_TAG + '"class="form-control col-sm-' + dict_pestalla[id_dic]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 25px;font-size: 11px;">'
                }
                if (dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][0]["Tipo"] == 'Fecha Tiempo') {
  
                  div_c_t = div_c_t + '<input type="datetime-local" id="' + ID_TAG + '" class="form-control col-sm-' + dict_pestalla[id_dic]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 25px;font-size: 11px;">'
                }
  
  
              }
            }
            if (dict_pestalla[id_dic]["campos_cab"][x]["TablaCampo"] == "cmpoperacion") {
  
              div_c_t = div_c_t + '<input type="number" id="' + ID_TAG + '" class="form-control col-sm-' + dict_pestalla[id_dic]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' onchange="setTwoNumberDecimal(' + dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][0]["Decimales"] + ')" readonly="readonly" onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="text-align: right;height: 25px;font-size: 11px;" >'
            }
            if (dict_pestalla[id_dic]["campos_cab"][x]["TablaCampo"] == "cmpconsolidado") {
  
              div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + dict_pestalla[id_dic]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" onchange="guardar_calcular(' + ID_TAG + ', 0)" style="height: 25px;font-size: 11px;">'
            }
            if (dict_pestalla[id_dic]["campos_cab"][x]["TablaCampo"] == "cmpcondicional") {
  
              div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + dict_pestalla[id_dic]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" onchange="guardar_calcular(' + ID_TAG + ', 0)" style="height: 25px;font-size: 11px;text-align: right;padding-right: 14px;">'
            }
            if (dict_pestalla[id_dic]["campos_cab"][x]["TablaCampo"] == "cmparchivo") {
              if (dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][0]["Ruta"] == 'Dibujo') {
  
                
                div_c_t = div_c_t + '<div class="col-6" style="height: 100px;margin-bottom: 1px;">'
                div_c_t = div_c_t + '<canvas id="' + ID_TAG + '_canvas"  width="250" height="80" style="position:absolute;top:10%;left:10%;border:2px solid;margin-top: 6px;""></canvas>'
                div_c_t = div_c_t + '</div>'
  
  
                div_c_t = div_c_t + '<div class="row">'
                
                div_c_t = div_c_t + '<button class="btn bg-blue btn-flat margin btn-block btn-outlined" style="padding-left: 0px;padding-right: 0px;margin-bottom: 0px;" onclick="Iniciar_firma(' + ID_TAG + '_canvas)">Firmar</button>'
                div_c_t = div_c_t + '<button class="btn bg-yellow btn-flat margin btn-block btn-outlined" style="padding-left: 0px;padding-right: 0px;margin-bottom: 0px;" onclick="Limpiar_firma(' + ID_TAG + '_canvas)">Limpiar</button>'
                div_c_t = div_c_t + '<button class="btn bg-green btn-flat margin btn-block btn-outlined" style="padding-left: 0px;padding-right: 0px;margin-bottom: 0px;" onclick="Grabar_firma(' + ID_TAG + '_canvas,' + ID_TAG + '_img)">Grabar</button>'
                div_c_t = div_c_t + '</div>'
  
                div_c_t = div_c_t + '<div class="thumbnail">'
  
  
                div_c_t = div_c_t + '<div class="image view view-first">'
                div_c_t = div_c_t + '<a id="' + ID_TAG + '_label" href="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" target="_blank" style="font-size: 11px;">'
                div_c_t = div_c_t + '<img style="width: 100%;height: 60%;margin-left: auto;margin-right: auto; display: block;" id="' + ID_TAG + '_img" src="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" alt="image" value="' + valor_campo + '">'
                div_c_t = div_c_t + valor_campo + '</a>'
  
  
                // div_c_t = div_c_t + '<input type="file" id="' + ID_TAG + '_img_file" onchange="cambiar_imagen(' + ID_TAG + '_img)" style="display: none">'
  
                div_c_t = div_c_t + '</div></div>'
                
                
              }else{
                if (dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][0]["Ruta"] == 'PdfFirma') {
                //div_c_t = div_c_t + '<div class="thumbnail" style="height: 160px;margin-bottom: 1px;"><div class="image view view-first"><a id="' + ID_TAG + '_label" href="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" target="_blank" style="font-size: 11px;"><img style="width: 100%;height: 60%;margin-left: auto;margin-right: auto; display: block;" id="' + ID_TAG + '_img" src="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" alt="image" value="' + valor_campo + '">' + valor_campo + '</a>'
                div_c_t = div_c_t + '<div class="thumbnail" style="height: 160px;margin-bottom: 1px;"><div class="image view view-first"><a id="' + ID_TAG + '_label" href="/' + valor_campo + '" target="_blank" style="font-size: 11px;"><img style="width: 100%;height: 60%;margin-left: auto;margin-right: auto; display: block;" id="' + ID_TAG + '_img" src="/' + valor_campo + '" alt="image" value="' + valor_campo + '">' + valor_campo + '</a>'
                  
                div_c_t = div_c_t + '<label for="' + ID_TAG + '_img_file" class="btn bg-blue btn-flat margin btn-block btn-outlined" style="padding-left: 0px;padding-right: 0px;margin-bottom: 0px;display: none">Cambiar</label>'
                div_c_t = div_c_t + '<input type="file" id="' + ID_TAG + '_img_file" onchange="cambiar_imagen(' + ID_TAG + '_img)" style="display: none"></div></div>'
  
                }else{
  
                  //div_c_t = div_c_t + '<div class="thumbnail" style="height: 160px;margin-bottom: 1px;"><div class="image view view-first"><a id="' + ID_TAG + '_label" href="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" target="_blank" style="font-size: 11px;"><img style="width: 100%;height: 60%;margin-left: auto;margin-right: auto; display: block;" id="' + ID_TAG + '_img" src="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" alt="image" value="' + valor_campo + '">' + valor_campo + '</a>'
                  div_c_t = div_c_t + '<div class="thumbnail" style="height: 160px;margin-bottom: 1px;"><div class="image view view-first"><a id="' + ID_TAG + '_label" href="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" target="_blank" style="font-size: 11px;"><img style="width: 100%;height: 60%;margin-left: auto;margin-right: auto; display: block;" id="' + ID_TAG + '_img" src="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" alt="image" value="' + valor_campo + '">' + valor_campo + '</a>'
    
                  div_c_t = div_c_t + '<label for="' + ID_TAG + '_img_file" class="btn bg-blue btn-flat margin btn-block btn-outlined" style="padding-left: 0px;padding-right: 0px;margin-bottom: 0px;">Cambiar</label>'
                  div_c_t = div_c_t + '<input type="file" id="' + ID_TAG + '_img_file" onchange="cambiar_imagen(' + ID_TAG + '_img)" style="display: none"></div></div>'
                  
                }
                
              }
  
  
            }
            if (dict_pestalla[id_dic]["campos_cab"][x]["TablaCampo"] == "cmpnumeroaletras") {
  
              div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + dict_pestalla[id_dic]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
            }
            if (dict_pestalla[id_dic]["campos_cab"][x]["TablaCampo"] == "cmpdecabecera") {
  
              div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + dict_pestalla[id_dic]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
            }
            if (dict_pestalla[id_dic]["campos_cab"][x]["TablaCampo"] == "cmpelectronico") {
  
              div_c_t = div_c_t + '<div class="input-group input-group-sm" style="width: 100%;">'
  
              if (valor_campo.toString().length > 5){
                div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + dict_pestalla[id_dic]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px; width: 70%;">'
  
                if (dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][0][0]["Tipo"] == 'Factura') {
                  div_c_t = div_c_t + '<a href="/e_docs/Facturas/'+ valor_campo +'" target="blank"> '
                }
                if (dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][0][0]["Tipo"] == 'Retencion') {
                  div_c_t = div_c_t + '<a href="/e_docs/Retenciones/'+ valor_campo +'" target="blank"> '
                }
                if (dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][0][0]["Tipo"] == 'Nota credito') {
                  div_c_t = div_c_t + '<a href="/e_docs/Credito/'+ valor_campo +'" target="blank"> '
                }
                if (dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][x]["Nombre"]][0][0]["Tipo"] == 'Guia remision') {
                  div_c_t = div_c_t + '<a href="/e_docs/Guia/'+ valor_campo +'" target="blank"> '
                }
                div_c_t = div_c_t + '<span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></a>'
              }else{
                div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + dict_pestalla[id_dic]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px; width: 100%;">'
  
              }
  
              div_c_t = div_c_t + '</div>'
  
  
            }
            div_c_t = div_c_t + '</div>'
  
            if (dict_pestalla[id_dic]["campos_cab"][x]["posicionweb"] == "arriba_izq") {
              div_campos_arriba_izq = div_campos_arriba_izq + div_c_t
            }
            if (dict_pestalla[id_dic]["campos_cab"][x]["posicionweb"] == "arriba_der") {
              div_campos_arriba_der = div_campos_arriba_der + div_c_t
            }
            if (dict_pestalla[id_dic]["campos_cab"][x]["posicionweb"] == "abajo_izq") {
              div_campos_abajo_izq = div_campos_abajo_izq + div_c_t
            }
            if (dict_pestalla[id_dic]["campos_cab"][x]["posicionweb"] == "abajo_der") {
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
  
  
  
  
        if (typeof (dict_pestalla[id_dic]["campos_det"]) == "object") {
          readonly = ''
  
          var largo_tabla = 0
          for (x = 0; x < dict_pestalla[id_dic]["campos_det"].length; x++) {
            if (dict_pestalla[id_dic]["campos_det"][x]["Visible"] == "Y") {
              largo_tabla = largo_tabla + parseFloat(dict_pestalla[id_dic]["campos_det"][x]["largo"])
  
            }
          }
  
          if (tipo == 'consulta') {
            readonly = 'readonly="readonly"'
  
            div_campos = '<div id="divtabla' + pestalla + '" class="box-body tableFixHead" style="background: white; overflow: auto;overflow-y: auto;padding-top: 0px; height: 100%;"><table id="tabla' + pestalla + '" class="table table-striped" style="width: ' + parseInt(largo_tabla) + 'px;overflow-x:auto;font-size: 11px;background: white;"><thead><tr><th style="width: 20px;padding-left: 0px;"> </th>'
          } else {
            div_campos = '<div id="divtabla' + pestalla + '" class="box-body tableFixHead" style="background: white; overflow: auto;overflow-y: auto;padding-top: 0px; height: 100%;"><table id="tabla' + pestalla + '" class="table table-striped" style="width: ' + parseInt(largo_tabla) + 'px;overflow-x:auto;font-size: 11px;background: white;"><thead><tr><th style="width: 20px;">'
            div_campos = div_campos + '<div class="row" style="margin-left: 0px;height: 30px;"><button type="button" onclick="mas(' + pestalla + ')" class="btn bg-green btn-flat margin" style="padding: 3px 8px;margin-bottom: 0px;margin-top: 0px;">+</button>'
  
            div_campos = div_campos + '<button type="button" onclick="ampliar(' + pestalla + ', this)" class="btn bg-blue btn-flat margin" style="padding: 3px 4px;"><span class="glyphicon glyphicon-resize-small"></span></button>'
            if (dict_pestalla[id_dic]['exportable'] == "Si") {
              div_campos = div_campos + '<button type="button" onclick="det_rapido(' + pestalla + ')" class="btn bg-yellow btn-flat margin" style="padding: 3px 4px;margin-bottom: 0px;margin-top: 0px;" data-toggle="modal" data-target="#modal-default_wait"><i class="fa fa-fw fa-file-excel-o"></i></button>'
            }
            div_campos = div_campos + '</div></th>'
          }
  
  
          for (x = 0; x < dict_pestalla[id_dic]["campos_det"].length; x++) {
            if (dict_pestalla[id_dic]["campos_det"][x]["Visible"] == "Y") {
              //div_campos = div_campos + '<th class="col-md-' + dict_pestalla[id_dic]["campos_det"][x]["largoweb"] + '" style="width: ' + dict_pestalla[id_dic]["campos_det"][x]["largo"] + 'px;">' + dict_pestalla[id_dic]["campos_det"][x]["Descripcion"] + '</th>'
  
            if(dict_pestalla[id_dic]["campos_det"][x]['TablaCampo'] == 'cmpnumsimple' || dict_pestalla[id_dic]["campos_det"][x]['TablaCampo'] == 'cmpformuladetalle' || dict_pestalla[id_dic]["campos_det"][x]['TablaCampo'] == 'cmpoperacion' || dict_pestalla[id_dic]["campos_det"][x]['TablaCampo'] == 'cmpconsolidado'){  
              div_campos = div_campos + '<th class="col-md-' + dict_pestalla[id_dic]["campos_det"][x]["largoweb"] + '" style="padding-left: 5px;padding-right: 5px;text-align: right;">' + dict_pestalla[id_dic]["campos_det"][x]["Descripcion"] + '</th>'
  
            }else{
              if(dict_pestalla[id_dic]["campos_det"][x]['TablaCampo'] == 'cmpreferenciaadjunto'){
  
                if (dict_pestalla[id_dic]["func_det"][dict_pestalla[id_dic]["campos_det"][x]["Nombre"]][0]["Tipo"] == 'Numero') {
                  div_campos = div_campos + '<th class="col-md-' + dict_pestalla[id_dic]["campos_det"][x]["largoweb"] + '" style="padding-left: 5px;padding-right: 5px;text-align: right;">' + dict_pestalla[id_dic]["campos_det"][x]["Descripcion"] + '</th>'
                }else{
                  div_campos = div_campos + '<th class="col-md-' + dict_pestalla[id_dic]["campos_det"][x]["largoweb"] + '" style="padding-left: 5px;padding-right: 5px;">' + dict_pestalla[id_dic]["campos_det"][x]["Descripcion"] + '</th>'
                }
  
              }else{
                div_campos = div_campos + '<th class="col-md-' + dict_pestalla[id_dic]["campos_det"][x]["largoweb"] + '" style="padding-left: 5px;padding-right: 5px;">' + dict_pestalla[id_dic]["campos_det"][x]["Descripcion"] + '</th>'
  
              }
            }
  
  
  
  
            }
          }
          div_campos = div_campos + '</tr></thead><tbody>'
          //var i = 0;
  
          var i = dict_pestalla[id_dic]["valores_det"].length-1;
          if(i == -1){
            i = 0
          }
          do {
            div_campos = div_campos + '<tr id="f' + pestalla + '-f' + i + '" style="background: white;"><td><div class="row" style="padding-left: 15px;width: 85px;">'
            if (tipo != 'consulta') {
              div_campos = div_campos + '<button type="button" onclick="menos(' + pestalla + ',' + i + ', 0)" class="btn bg-red btn-flat margin" style="padding: 3px 10px;">-</button>'
            }
            if (typeof (dict_pestalla[id_dic]["campos_subdet"]) == "object") {
              //div_campos = div_campos + '<a class="btn btn-info" style="padding: 2px 2px; margin-right: 0px; margin-left: 0px;" ><span class="glyphicon glyphicon-resize-small" aria-hidden="true"></span></a>'
  
              div_campos = div_campos + '<button type="button" onclick="abrirdetalle(' + pestalla + ', ' + i + ' )" id="regbtn_' + pestalla + '_' + i + '" class="btn bg-blue btn-flat margin" style="padding: 3px 4px;"><span class="glyphicon glyphicon-resize-full"></span></button>'
            }
  
  
            div_campos = div_campos + '</div></td>'
  
            altura_mini = 45
  
            for (x = 0; x < dict_pestalla[id_dic]["campos_det"].length; x++) {
  
              valor_campo = 0;
              if (tipo == 'Nuevo') {
  
                if (dict_pestalla[id_dic]["campos_det"][x]["TablaCampo"] == "cmpformquery") {
                  valor_campo = 'Crear Formula'
                }
                if (dict_pestalla[id_dic]["campos_det"][x]["TablaCampo"] == "cmptxtsimple") {
                  valor_campo = dict_pestalla[id_dic]["func_det"][dict_pestalla[id_dic]["campos_det"][x]["Nombre"]][0]["ValorPredeterminado"]
                }
                if (dict_pestalla[id_dic]["campos_det"][x]["TablaCampo"] == "cmpnumsimple") {
                  valor_campo = dict_pestalla[id_dic]["func_det"][dict_pestalla[id_dic]["campos_det"][x]["Nombre"]][0]["Menor"]
                }
                if (dict_pestalla[id_dic]["campos_det"][x]["TablaCampo"] == "cmpnumsecuencial") {
                  if (dict_pestalla[id_dic]["campos_det"][x]["TablaCampo"].slice(0, 2) == "Pk") {
                    valor_campo = 0
                  } else {
                    valor_campo = dict_pestalla[id_dic]["func_det"][dict_pestalla[id_dic]["campos_det"][x]["Nombre"]][0]["ValorInicial"]
                  }
                }
                if (dict_pestalla[id_dic]["campos_det"][x]["TablaCampo"] == "cmpopcmultiple") {
                  valor_campo = dict_pestalla[id_dic]["func_det"][dict_pestalla[id_dic]["campos_det"][x]["Nombre"]][0]["Valor"]
                }
                if (dict_pestalla[id_dic]["campos_det"][x]["TablaCampo"] == "cmpsistema") {
                  if (dict_pestalla[id_dic]["func_det"][dict_pestalla[id_dic]["campos_det"][x]["Nombre"]][0]["PkId"] == 2) {
                    valor_campo = web_usuario
  
                  }
                  if (dict_pestalla[id_dic]["func_det"][dict_pestalla[id_dic]["campos_det"][x]["Nombre"]][0]["PkId"] == 1) {
                    var now = new Date();
                    valor_campo = now.format("Y-m-d") + 'T' + now.format("H:i:s")
                  }
                }
                if (dict_pestalla[id_dic]["campos_det"][x]["TablaCampo"] == "cmpformuladetalle") {
                  valor_campo = 0
                }
                if (dict_pestalla[id_dic]["campos_det"][x]["TablaCampo"] == "cmpfecha") {
                  var now = new Date();
                  addi = ' AM'
                  if (dict_pestalla[id_dic]["func_det"][dict_pestalla[id_dic]["campos_det"][x]["Nombre"]][0]["Tiempo"] == "Y") {
                    if (now.format("H") > 11) { addi = ' PM' }
                    valor_campo = now + addi
                  } else {
                    valor_campo = now.format("Y-m-d");
                  }
                }
                if (dict_pestalla[id_dic]["campos_det"][x]["TablaCampo"] == "cmpreferencia") {
                  valor_campo = dict_pestalla[id_dic]["func_det"][dict_pestalla[id_dic]["campos_det"][x]["Nombre"]][0][0]["predeterminado_valor"]
                }
                if (dict_pestalla[id_dic]["campos_det"][x]["TablaCampo"] == "cmpreferenciaadjunto") {
                  valor_campo = 0
                }
                if (dict_pestalla[id_dic]["campos_det"][x]["TablaCampo"] == "cmpoperacion") {
                  valor_campo = 0
                }
                if (dict_pestalla[id_dic]["campos_det"][x]["TablaCampo"] == "cmpconsolidado") {
                  valor_campo = 0
                }
                if (dict_pestalla[id_dic]["campos_det"][x]["TablaCampo"] == "cmpdecabecera") {
                  valor_campo = ""
                }
  
                if (dict_pestalla[id_dic]["valores_det"].length > 0) {
                  valor_campo = dict_pestalla[id_dic]["valores_det"][i][dict_pestalla[id_dic]["campos_det"][x]["Nombre"]]
                }
              } else {
                valor_campo = dict_pestalla[id_dic]["valores_det"][i][dict_pestalla[id_dic]["campos_det"][x]["Nombre"]]
              }
  
              id_tag_detalle = 'pd' + pestalla + 'fff' + i + 'ccc' + dict_pestalla[id_dic]["campos_det"][x]["Nombre"]
  
              if (dict_pestalla[id_dic]["campos_det"][x]["Visible"] == "Y") {
                //div_campos = div_campos + '<td><div class="col-sm-' + dict_pestalla[id_dic]["campos_det"][x]["largoweb"] + '" col-md-' + dict_pestalla[id_dic]["campos_det"][x]["largoweb"] + '" col-lg-' + dict_pestalla[id_dic]["campos_det"][x]["largoweb"] + '">'
                div_campos = div_campos + '<td style="padding-left: 0px;padding-right: 5px;"><div style="width: ' + dict_pestalla[id_dic]["campos_det"][x]["largo"] + 'px;">'
  
  
                if (dict_pestalla[id_dic]["campos_det"][x]["TablaCampo"] == "cmpformquery") {
                  readonly_int = ''
                  div_campos = div_campos + '<div id="' + id_tag_detalle + '" type="button" style="width: 100%;font-size: 10px;background: yellow;color: black;cursor: pointer;padding-top: 5px;padding-bottom: 5px;padding-left: 5px;padding-right: 5px;" class="col-sx-5" data-toggle="modal" data-target="#modal-default_formulas" onclick="abrirformula(' + id_tag_detalle + ')">' + valor_campo + '</div>'
                }
                if (dict_pestalla[id_dic]["campos_det"][x]["TablaCampo"] == "cmptxtsimple") {
                  readonly_int = ''
  
                  if (dict_pestalla[id_dic]["func_det"][dict_pestalla[id_dic]["campos_det"][x]["Nombre"]][0]["Modificable"] == "N") {
                    readonly_int = 'readonly="readonly"'
                  }
                  if (tipo == 'Nuevo') {
                    valor_campo = dict_pestalla[id_dic]["func_det"][dict_pestalla[id_dic]["campos_det"][x]["Nombre"]][0]["ValorPredeterminado"]
                  }
                  if (dict_pestalla[id_dic]["func_det"][dict_pestalla[id_dic]["campos_det"][x]["Nombre"]][0]["Largo"] > 100) {
                    div_campos = div_campos + '<textarea type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" ' + readonly_int + ' style="height: ' + altura_mini + 'px;font-size: 11px;">' + valor_campo + '</textarea>'
                  } else {
                    div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" ' + readonly_int + ' style="height: 25px;font-size: 11px;">'
                  }
                }
                if (dict_pestalla[id_dic]["campos_det"][x]["TablaCampo"] == "cmpnumsimple") {
  
                  div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" min="' + dict_pestalla[id_dic]["func_det"][dict_pestalla[id_dic]["campos_det"][x]["Nombre"]][0]["Menor"] + '" max="' + dict_pestalla[id_dic]["func_det"][dict_pestalla[id_dic]["campos_det"][x]["Nombre"]][0]["Mayor"] + '" style="text-align: right;height: 25px;font-size: 11px;" onkeypress="return solo_numero(event)">'
                }
                if (dict_pestalla[id_dic]["campos_det"][x]["TablaCampo"] == "cmpnumsecuencial") {
  
                  div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" readonly="readonly" onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="text-align: right; height: 25px; font-size: 11px;" onkeypress="return solo_numero(event)">'
                }
                if (dict_pestalla[id_dic]["campos_det"][x]["TablaCampo"] == "cmpopcmultiple") {
                  if (tipo != 'consulta') {
                    div_campos = div_campos + '<select class="form-control" id="' + id_tag_detalle + '" value="' + valor_campo + '" onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;">'
                    for (z = 0; z < dict_pestalla[id_dic]["func_det"][dict_pestalla[id_dic]["campos_det"][x]["Nombre"]].length; z++) {
                      if (valor_campo == dict_pestalla[id_dic]["func_det"][dict_pestalla[id_dic]["campos_det"][x]["Nombre"]][z]["Valor"]) {
                        div_campos = div_campos + '<option selected>' + dict_pestalla[id_dic]["func_det"][dict_pestalla[id_dic]["campos_det"][x]["Nombre"]][z]["Valor"] + '</option>'
                      } else {
                        div_campos = div_campos + '<option>' + dict_pestalla[id_dic]["func_det"][dict_pestalla[id_dic]["campos_det"][x]["Nombre"]][z]["Valor"] + '</option>'
                      }
                    }
                    div_campos = div_campos + '</select>'
                  } else {
                    div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;" >'
                  }
                }
                if (dict_pestalla[id_dic]["campos_det"][x]["TablaCampo"] == "cmpsistema") {
                  if (dict_pestalla[id_dic]["func_det"][dict_pestalla[id_dic]["campos_det"][x]["Nombre"]][0]["PkId"] == 2) {
                    div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" readonly="readonly" style="height: 25px;font-size: 11px;">'
                  }
                  if (dict_pestalla[id_dic]["func_det"][dict_pestalla[id_dic]["campos_det"][x]["Nombre"]][0]["PkId"] == 1) {
                    div_campos = div_campos + '<input type="datetime-local" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" readonly="readonly" onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;line-height: 7px;">'
                  }
  
                  if (dict_pestalla[id_dic]["func_det"][dict_pestalla[id_dic]["campos_det"][x]["Nombre"]][0]["PkId"] == 4) {
  
                    div_campos = div_campos + '<select id="' + id_tag_detalle + '" class="form-control value="' + valor_campo + '" readonly="readonly" style="height: 25px;font-size: 11px;" onchange="guardar_calcular_det(' + id_tag_detalle + ')">'
                    for (zxz = 0; zxz < web_user.length; zxz++) {
                      if (web_user[zxz] == valor_campo) {
                        div_campos = div_campos + '<option selected>' + web_user[zxz] + '</option>'
      
                      } else {
                        div_campos = div_campos + '<option>' + web_user[zxz] + '</option>'
      
                      }
                    }
                    div_campos = div_campos + '</select>'
      
                  }
  
                }
                if (dict_pestalla[id_dic]["campos_det"][x]["TablaCampo"] == "cmpformuladetalle") {
  
                  div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" readonly="readonly" onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;">'
                }
                if (dict_pestalla[id_dic]["campos_det"][x]["TablaCampo"] == "cmpfecha") {
                  tipodato = 'date'
                  if (dict_pestalla[id_dic]["func_det"][dict_pestalla[id_dic]["campos_det"][x]["Nombre"]][0]["Tiempo"] == 'Y') {
                    tipodato = 'datetime-local'
                  }
                  div_campos = div_campos + '<input type="' + tipodato + '" id="' + id_tag_detalle + '"  class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;line-height: 7px;">'
                }
                if (dict_pestalla[id_dic]["campos_det"][x]["TablaCampo"] == "cmpreferencia") {
  
                  if (tipo == 'consulta') {
                    div_campos = div_campos + '<div class="input-group" style="width: ' + dict_pestalla[id_dic]["campos_det"][x]["largo"] + 'px;"><input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;" onkeypress="return runScript_detalle(event, ' + id_tag_detalle + ')">'
                    div_campos = div_campos + '</div>'
                  } else {
  
                    div_campos = div_campos + '<div class="input-group" style="width: ' + dict_pestalla[id_dic]["campos_det"][x]["largo"] + 'px;"><input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="width: 75%;height: 25px;font-size: 11px;" onkeypress="return runScript_detalle(event, ' + id_tag_detalle + ')">'
                    div_campos = div_campos + '<button type="button" class="btn btn-info" data-toggle="modal" data-target=".bs-example-modal-lg" onclick="buscar_referencia_detalle(' + id_tag_detalle + ' )" style="height: 25px;padding: 3px 4px;margin-top: 0px;margin-bottom: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></button></div>'
                  }
                }
                if (dict_pestalla[id_dic]["campos_det"][x]["TablaCampo"] == "cmpreferenciaadjunto") {
                  if (dict_pestalla[id_dic]["func_det"][dict_pestalla[id_dic]["campos_det"][x]["Nombre"]][0]["Tipo"] == 'Imagen') {
  
                    div_campos = div_campos + '<div class="thumbnail" style="height: 160px;margin-bottom: 1px;"><div class="image view view-first"><a id="' + id_tag_detalle + '_label" href="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" target="_blank"><img style="width: 100%;height: 60%;margin-left: auto;margin-right: auto; display: block;" id="' + id_tag_detalle + '_img" src="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" alt="image" value="' + valor_campo + '">' + valor_campo + '</a>'
  
                    altura_mini = 125
  
                    if (dict_pestalla[id_dic]["func_det"][dict_pestalla[id_dic]["campos_det"][x]["Nombre"]][0]["Modificable"] == 'N') {
                      div_campos = div_campos + '</div></div>'
  
                    } else {
                      div_campos = div_campos + '<label for="' + id_tag_detalle + '_img_file" class="btn bg-blue btn-flat margin btn-block btn-outlined" style="padding-left: 0px;padding-right: 0px;margin-bottom: 0px;">Cambiar</label>'
                      div_campos = div_campos + '<input type="file" id="' + id_tag_detalle + '_img_file" onchange="cambiar_imagen(' + id_tag_detalle + '_img)" style="display: none"></div></div>'
                    }
  
                  } else {
                    Moddato = ''
                    if (dict_pestalla[id_dic]["func_det"][dict_pestalla[id_dic]["campos_det"][x]["Nombre"]][0]["Modificable"] == 'N') {
                      Moddato = 'readonly="readonly"'
                    }
                    if (dict_pestalla[id_dic]["func_det"][dict_pestalla[id_dic]["campos_det"][x]["Nombre"]][0]["Tipo"] == 'Texto') {
                      if (dict_pestalla[id_dic]["func_det"][dict_pestalla[id_dic]["campos_det"][x]["Nombre"]][0]["Tamano"] == 'G') {
                        div_campos = div_campos + '<textarea type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="font-size: 11px;height: ' + altura_mini + 'px;">' + valor_campo + '</textarea>'
                      } else {
                        div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;">'
                      }
  
                    }
                    if (dict_pestalla[id_dic]["func_det"][dict_pestalla[id_dic]["campos_det"][x]["Nombre"]][0]["Tipo"] == 'Numero') {
  
                      div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="text-align: right;height: 25px;font-size: 11px;" onkeypress="return solo_numero(event)">'
                    }
                    if (dict_pestalla[id_dic]["func_det"][dict_pestalla[id_dic]["campos_det"][x]["Nombre"]][0]["Tipo"] == 'Fecha') {
  
                      div_campos = div_campos + '<input type="date" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;">'
                    }
                    if (dict_pestalla[id_dic]["func_det"][dict_pestalla[id_dic]["campos_det"][x]["Nombre"]][0]["Tipo"] == 'Fecha Tiempo') {
  
                      div_campos = div_campos + '<input type="datetime-local" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;">'
                    }
                  }
                }
                if (dict_pestalla[id_dic]["campos_det"][x]["TablaCampo"] == "cmpoperacion") {
  
                  div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="setTwoNumberDecimal(' + dict_pestalla[id_dic]["func_det"][dict_pestalla[id_dic]["campos_det"][x]["Nombre"]][0]["Decimales"] + ')" readonly="readonly" style="text-align: right;height: 25px;font-size: 11px;"> '
                }
                if (dict_pestalla[id_dic]["campos_det"][x]["TablaCampo"] == "cmpconsolidado") {
  
                  div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="text-align: right;height: 25px;font-size: 11px;">'
                }
                if (dict_pestalla[id_dic]["campos_det"][x]["TablaCampo"] == "cmparchivo") {
  
                  //div_campos = div_campos + '<input type="file" id="'+id_tag_detalle +'" class="form-control" value="'+ valor_campo +'" '+ readonly +' style="height: 25px;font-size: 11px;">'
                  div_campos = div_campos + '<div class="thumbnail" style="height: 160px;margin-bottom: 1px;"><div class="image view view-first"><a id="' + id_tag_detalle + '_label" href="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" target="_blank" style="font-size: 11px;"><img style="width: 100%;height: 60%;margin-left: auto;margin-right: auto; display: block;" id="' + id_tag_detalle + '_img" src="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" alt="image" value="' + valor_campo + '">' + valor_campo + '</a>'
  
                  div_campos = div_campos + '<label for="' + id_tag + '_img_file" class="btn bg-blue btn-flat margin btn-block btn-outlined" style="padding-left: 0px;padding-right: 0px;margin-bottom: 0px;">Cambiar</label>'
                  div_campos = div_campos + '<input type="file" id="' + id_tag + '_img_file" onchange="cambiar_imagen(' + id_tag + '_img)" style="display: none"></div></div>'
                }
                if (dict_pestalla[id_dic]["campos_det"][x]["TablaCampo"] == "cmpnumeroaletras") {
                  div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
                }
                if (dict_pestalla[id_dic]["campos_det"][x]["TablaCampo"] == "cmpdecabecera") {
  
                  div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
                }
                if (dict_pestalla[id_dic]["campos_det"][x]["TablaCampo"] == "cmpelectronico") {
  
                  div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
                }
                if (dict_pestalla[id_dic]["campos_det"][x]["TablaCampo"] == "cmpcondicional") {
  
                  div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
                }
                div_campos = div_campos + '</div></td>'
              } else {
                div_campos = div_campos + '<input type="hidden" id="' + id_tag_detalle + '" value="' + valor_campo + '" ' + readonly + '>'
              }
            }
  
            div_campos = div_campos + '</tr>'
  
            ////////////////////////////subdetalle
  
            if (typeof (dict_pestalla[id_dic]["campos_subdet"]) == "object") {
  
  
              var largo_tabladet = 0
              for (f = 0; f < dict_pestalla[id_dic]["campos_subdet"].length; f++) {
                if (dict_pestalla[id_dic]["campos_subdet"][f]["Visible"] == "Y") {
                  largo_tabladet = largo_tabladet + parseFloat(dict_pestalla[id_dic]["campos_subdet"][f]["largo"])
  
                }
              }
  
              div_campos = div_campos + '<tr id="regdet-' + pestalla + '-' + i + '" style="background-color: #0073b7;" hidden="">'
  
              div_campos = div_campos + '<td colspan="15"><div><div class="panel-body" style="overflow: auto;padding-top: px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;"><table class="table" id="tablaSub' + pestalla + '-' + i + '" table-hover" style="background-color: aliceblue;margin-bottom: 0px;width: ' + parseInt(largo_tabladet) + 'px"><thead>'
  
              div_campos = div_campos + ''
              div_campos = div_campos + '<tr><th>'
              if (tipo != 'consulta') {
                div_campos = div_campos + '<button type="button" onclick="massub(' + pestalla + ',' + i + ')" class="btn bg-green btn-flat margin" style="padding: 3px 9px;margin-bottom: 0px;margin-top: 0px;margin-left: -5px;">+</button>'
              }
  
              div_campos = div_campos + '</th>'
  
              for (f = 0; f < dict_pestalla[id_dic]["campos_subdet"].length; f++) {
                if (dict_pestalla[id_dic]["campos_subdet"][f]["Visible"] == "Y") {
                  div_campos = div_campos + '<th class="col-md-' + dict_pestalla[id_dic]["campos_subdet"][f]["largoweb"] + '" style="padding-left: 0px;padding-right: 0px;">' + dict_pestalla[id_dic]["campos_subdet"][f]["Descripcion"] + '</th>'
                }
              }
              div_campos = div_campos + '</tr></thead><tbody>'
              var i2 = 0;
  
              if (dict_pestalla[id_dic]["valores_subdet"].length > 0) {
  
                do {
                  var subpaso = 0;
  
                  if (tipo != 'Nuevo') {
                    if (dict_pestalla[id_dic]["valores_det"][i]['Pk' + dict_pestalla[id_dic]["tabla_det"]["Nombre"]] == dict_pestalla[id_dic]["valores_subdet"][i2]["PKCabecera"]) {
                      subpaso = 1
                    }
                  } else {
                    subpaso = 1
                  }
  
  
  
  
                  if (subpaso == 1) {
  
  
  
                    div_campos = div_campos + '<tr id="subf' + pestalla + '-f' + i2 + '-z' + i + '" style="background: white;"><td><div class="row"  style="padding-left: 10px;">'
  
                    if (tipo != 'consulta') {
                      div_campos = div_campos + '<button type="button" onclick="menossub(' + pestalla + ',' + i2 + ',' + i + ')" class="btn bg-red btn-flat margin" style="padding: 3px 10px;margin-right: 10px;">-</button>'
                    }
                    div_campos = div_campos + '</div></td>'
  
                    for (f = 0; f < dict_pestalla[id_dic]["campos_subdet"].length; f++) {
  
                      valor_campo = 0;
                      if (tipo == 'Nuevo') {
                        if (dict_pestalla[id_dic]["campos_subdet"][f]["TablaCampo"] == "cmptxtsimple") {
                          valor_campo = dict_pestalla[id_dic]["func_subdet"][dict_pestalla[id_dic]["campos_subdet"][f]["Nombre"]][0]["ValorPredeterminado"]
                        }
                        if (dict_pestalla[id_dic]["campos_subdet"][f]["TablaCampo"] == "cmpnumsimple") {
                          valor_campo = dict_pestalla[id_dic]["func_subdet"][dict_pestalla[id_dic]["campos_subdet"][f]["Nombre"]][0]["Menor"]
                        }
                      } else {
                        valor_campo = dict_pestalla[id_dic]["valores_subdet"][i2][dict_pestalla[id_dic]["campos_subdet"][f]["Nombre"]]
  
                      }
  
                      id_tag_subdetalle = 'ps' + pestalla + 'qqq' + i2 + 'yyy' + i + 'www' + dict_pestalla[id_dic]["campos_subdet"][f]["Nombre"]
                      if (dict_pestalla[id_dic]["campos_subdet"][f]["Visible"] == "Y") {
  
                        div_campos = div_campos + '<td style="padding-left: 0px;padding-right: 5px;"><div style="width: ' + dict_pestalla[id_dic]["campos_subdet"][f]["largo"] + 'px;">'
  
                        if (dict_pestalla[id_dic]["campos_subdet"][f]["TablaCampo"] == "cmpnumsimple") {
                          div_campos = div_campos + '<input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_subdet(' + id_tag_subdetalle + ')" min="' + dict_pestalla[id_dic]["func_subdet"][dict_pestalla[id_dic]["campos_subdet"][f]["Nombre"]][0]["Menor"] + '" max="' + dict_pestalla[id_dic]["func_subdet"][dict_pestalla[id_dic]["campos_subdet"][f]["Nombre"]][0]["Mayor"] + '" style="text-align: right;height: 25px;font-size: 11px;" onkeypress="return solo_numero(event)">'
  
                        }
                        if (dict_pestalla[id_dic]["campos_subdet"][f]["TablaCampo"] == "cmptxtsimple") {
                          if (dict_pestalla[id_dic]["func_subdet"][dict_pestalla[id_dic]["campos_subdet"][f]["Nombre"]][0]["Modificable"] == "N") {
                            readonly_int = 'readonly="readonly"'
                          }
                          div_campos = div_campos + '<input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_subdet(' + id_tag_subdetalle + ')" ' + readonly_int + ' style="height: 25px;font-size: 11px;">'
  
                        }
                        if (dict_pestalla[id_dic]["campos_subdet"][f]["TablaCampo"] == "cmpreferenciaadjunto") {
                          if (dict_pestalla[id_dic]["func_subdet"][dict_pestalla[id_dic]["campos_subdet"][f]["Nombre"]][0]["Modificable"] == 'N') {
                            Moddato = 'readonly="readonly"'
                          }
                          altura_mini = 125
  
                          if (dict_pestalla[id_dic]["func_subdet"][dict_pestalla[id_dic]["campos_subdet"][f]["Nombre"]][0]["Tipo"] == 'Texto') {
                            if (dict_pestalla[id_dic]["func_subdet"][dict_pestalla[id_dic]["campos_subdet"][f]["Nombre"]][0]["Tamano"] == 'G') {
                              div_campos = div_campos + '<textarea type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular_subdet(' + id_tag_subdetalle + ')" style="font-size: 11px;height: ' + altura_mini + 'px;">' + valor_campo + '</textarea>'
                            } else {
                              div_campos = div_campos + '<input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular_subdet(' + id_tag_subdetalle + ')" style="height: 25px;font-size: 11px;">'
                            }
  
                          }
                          if (dict_pestalla[id_dic]["func_subdet"][dict_pestalla[id_dic]["campos_subdet"][f]["Nombre"]][0]["Tipo"] == 'Numero') {
  
                            div_campos = div_campos + '<input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular_subdet(' + id_tag_subdetalle + ')" style="text-align: right;height: 25px;font-size: 11px;" onkeypress="return solo_numero(event)">'
                          }
  
  
  
                        }
                        if (dict_pestalla[id_dic]["campos_subdet"][f]["TablaCampo"] == "cmpreferencia") {
                          if (tipo == 'consulta') {
                            div_campos = div_campos + '<div class="input-group" style="width: ' + dict_pestalla[id_dic]["campos_subdet"][f]["largo"] + 'px;"><input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' style="height: 25px;font-size: 11px;">'
                            div_campos = div_campos + '</div>'
                          } else {
  
                            div_campos = div_campos + '<div class="input-group" style="width: ' + dict_pestalla[id_dic]["campos_subdet"][f]["largo"] + 'px;"><input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_subdet(' + id_tag_subdetalle + ')" style="width: 80%;height: 25px;font-size: 11px;" onkeypress="return runScript_subdetalle(event, ' + id_tag_subdetalle + ')">'
                            div_campos = div_campos + '<button type="button" class="btn btn-info" data-toggle="modal" data-target=".bs-example-modal-lg" onclick="buscar_referencia_subdetalle(' + id_tag_subdetalle + ' )" style="height: 25px;padding: 3px 4px;margin-top: 0px;margin-bottom: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></button></div>'
                          }
                        }
                        if (dict_pestalla[id_dic]["campos_subdet"][f]["TablaCampo"] == "cmpoperacion") {
  
                          div_campos = div_campos + '<input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="setTwoNumberDecimal(' + dict_pestalla[id_dic]["func_subdet"][dict_pestalla[id_dic]["campos_subdet"][f]["Nombre"]][0]["Decimales"] + ')" readonly="readonly" style="text-align: right;height: 25px;font-size: 11px;"> '
                        }
                        if (dict_pestalla[id_dic]["campos_subdet"][f]["TablaCampo"] == "cmpconsolidado") {
                          div_campos = div_campos + '<input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
                        }
                        if (dict_pestalla[id_dic]["campos_subdet"][f]["TablaCampo"] == "cmpdecabecera") {
                          div_campos = div_campos + '<input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
                        }
                        if (dict_pestalla[id_dic]["campos_subdet"][f]["TablaCampo"] == "cmpopcmultiple") {
                      
                          if (tipo != 'consulta') {
                            div_campos = div_campos + '<select class="form-control" id="' + id_tag_subdetalle + '" value="' + valor_campo + '" onchange="guardar_calcular_subdet(' + id_tag_subdetalle + ')" style="height: 25px;font-size: 11px;">'
                            for (z = 0; z < dict_pestalla[id_dic]["func_subdet"][dict_pestalla[id_dic]["campos_subdet"][f]["Nombre"]].length; z++) {
                              if (valor_campo == dict_pestalla[id_dic]["func_subdet"][dict_pestalla[id_dic]["campos_subdet"][f]["Nombre"]][z]["Valor"]) {
                                div_campos = div_campos + '<option selected value="' + dict_pestalla[id_dic]["func_subdet"][dict_pestalla[id_dic]["campos_subdet"][f]["Nombre"]][z]["Valor"] + '">' + dict_pestalla[id_dic]["func_subdet"][dict_pestalla[id_dic]["campos_subdet"][f]["Nombre"]][z]["Nombre"] + '</option>'
                              } else {
                                div_campos = div_campos + '<option value="' + dict_pestalla[id_dic]["func_subdet"][dict_pestalla[id_dic]["campos_subdet"][f]["Nombre"]][z]["Valor"] + '">' + dict_pestalla[id_dic]["func_subdet"][dict_pestalla[id_dic]["campos_subdet"][f]["Nombre"]][z]["Nombre"] + '</option>'
                              }
                            }
                            div_campos = div_campos + '</select>'
                          } else {
                            div_campos = div_campos + '<input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_det(' + id_tag_subdetalle + ')" style="height: 25px;font-size: 11px;" >'
                          }
                        }
                        if (dict_pestalla[id_dic]["campos_subdet"][f]["TablaCampo"] == "cmpfecha") {
                          tipodato = 'date'
                          if (dict_pestalla[id_dic]["func_subdet"][dict_pestalla[id_dic]["campos_subdet"][f]["Nombre"]][0]["Tiempo"] == 'Y') {
                            tipodato = 'datetime-local'
                          }
                          div_campos = div_campos + '<input type="' + tipodato + '" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_subdet(' + id_tag_subdetalle + ')" style="height: 25px;font-size: 11px;line-height: 7px;">'
                        }
  
                      } else {
  
                        div_campos = div_campos + '<input type="hidden" id="' + id_tag_subdetalle + '" value="' + valor_campo + '" ' + readonly + '>'
  
                      }
  
                    }
  
  
                    div_campos = div_campos + '</tr>'
  
                  }
                  i2++;
                } while (i2 < dict_pestalla[id_dic]["valores_subdet"].length);
              }
  
              ccsub_porPesta['p-' + pestalla] = (dict_pestalla[id_dic]["valores_subdet"].length)
  
              div_campos = div_campos + '</tbody>'
              div_campos = div_campos + '</table></div>'
              div_campos = div_campos + '</div></td></tr>'
            }
            ////////////////////////////subdetalle
            i--
          //} while (i < dict_pestalla[id_dic]["valores_det"].length);
          } while (i >= 0 );
  
          cc_porPesta['p-' + pestalla] = (dict_pestalla[id_dic]["valores_det"].length)
          div_campos = div_campos + '</tbody></table></div>'
  
  
          $('#rr' + pestalla).append(div_campos);
  
          if (dict_pestalla[id_dic]["valores_det"].length > 3) {
            document.getElementById('divtabla' + pestalla).style.height = "500px";
  
          }
  
  
        
        }
  
        html_ingre = '<div class="box-body" style="background: white;">'
  
        html_ingre = html_ingre + '<div class="col-md-6 col-xs-12"> <div class="row">' + div_campos_abajo_izq + '</div></div>'
        html_ingre = html_ingre + '<div class="col-md-6 col-xs-12"> <div class="row">' + div_campos_abajo_der + '</div></div>'
        html_ingre = html_ingre + '</div>'
  
        $('#rr' + pestalla).append(html_ingre);
        document.getElementById('id' + pestalla).click();
  
  
  
        for (z2 = 0; z2 < dict_pestalla[id_dic]["campos_cab"].length; z2++) {
          if (tipo == 'Nuevo') {
            if (dict_pestalla[id_dic]["campos_cab"][z2]["TablaCampo"] == "cmpreferencia") {
              id_tag = 'p' + pestalla + 'zzz' + dict_pestalla[id_dic]["campos_cab"][z2]["Nombre"]
              
              if (dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][z2]["Nombre"]][0][0]["predeterminado_valor"] != '') {
                id_tag = 'p' + pestalla + 'zzz' + dict_pestalla[id_dic]["campos_cab"][z2]["Nombre"]
  
                if (dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][z2]["Nombre"]][0][0]["Tipo_Predeterminado"] == '1') {
                  id_tag_detalle_pret = 'p' + pestalla + 'zzz' + dict_pestalla[id_dic]["func_cab"][dict_pestalla[id_dic]["campos_cab"][z2]["Nombre"]][0][0]["predeterminado"]
                  document.getElementById(id_tag).value = document.getElementById(id_tag_detalle_pret).value
                }
                buscar_referencia_cabecera_enter(document.getElementById(id_tag))
              }else{
                if(document.getElementById(id_tag).value != ''){
                  buscar_referencia_cabecera_enter(document.getElementById(id_tag))
                }
              }
            }
          }
        }
  
        for (z2 = 0; z2 < dict_pestalla[id_dic]["campos_det"].length; z2++) {
          if (tipo == 'Nuevo') {
            if (dict_pestalla[id_dic]["campos_det"][z2]["TablaCampo"] == "cmpreferencia") {
              id_tag_detalle_pret = 'pd' + pestalla + 'fff' + 0 + 'ccc' + dict_pestalla[id_dic]["func_det"][dict_pestalla[id_dic]["campos_det"][z2]["Nombre"]][0][0]["predeterminado"]
              
              if (dict_pestalla[id_dic]["func_det"][dict_pestalla[id_dic]["campos_det"][z2]["Nombre"]][0][0]["predeterminado_valor"] != '') {
                id_tag_detalle = 'pd' + pestalla + 'fff' + 0 + 'ccc' + dict_pestalla[id_dic]["campos_det"][z2]["Nombre"]
                if (dict_pestalla[id_dic]["func_det"][dict_pestalla[id_dic]["campos_det"][z2]["Nombre"]][0][0]["Tipo_Predeterminado"] == '1') {
                  id_tag_detalle_pret = 'pd' + pestalla + 'fff' + 0 + 'ccc' + dict_pestalla[id_dic]["func_det"][dict_pestalla[id_dic]["campos_det"][z2]["Nombre"]][0][0]["predeterminado"]
                  if(document.getElementById(id_tag_detalle_pret).value != '0'){
                    document.getElementById(id_tag_detalle).value = document.getElementById(id_tag_detalle_pret).value
                  }                  
                }
                buscar_referencia_detalle_enter(document.getElementById(id_tag_detalle))
              }else{
                if(document.getElementById(id_tag_detalle).value != ''){
                  buscar_referencia_detalle_enter(document.getElementById(id_tag_detalle))
                }
              }
            }
          }
        }
  
        if (tipo == 'consulta') {
          if(origen == 1){
            autoccerar_pestana(pestalla, 60*2)
          }else{
            autoccerar_pestana(pestalla, 60*5)
          }
          
        }
        //queda obsoleto ya nunca entra por aqiu si tien plantilla_html y es nuevo se imprime y pm nuevo
        // if(origen == 1 && dict_pestalla[id_dic]["plantilla_html"].length> 0){
        //   imprimir_elemento(pestalla, 0)
        //   registro(dict_pestalla[id_dic]["tabla_cab"]["PkModulo"],0,0,pestalla,0,0)
        // }
      
  

  /////////////////////////////////////BLoque Offline //////////////////////////////
 
}



function registro(pkmodulo, pkregistro, tipo, temp_pestalla, origen, t_clave, t_traspasos, t_traspasosDisplay ) {
    if (bloqueado() == true) {
      document.getElementById('a_default_pagos').click()
      return
    }
  
    pestalla = pestalla + 1;
    if (temp_pestalla == '-2') {
      temp_pestalla = 'consulta'
      if (pkregistro == 0) {
        temp_pestalla = '-1'
        tipo = 0
      }
    }
    lbl = ''
    if (tipo == 0) { lbl = 'Nuevo: ' }
    if (tipo == 1) { lbl = 'Modificar: ' }
    if (tipo == 2) { lbl = 'Consulta: ' }
    if (tipo == 3) { lbl = 'Consulta: ' }
  
  
    if(t_traspasos == undefined){
      if (temp_pestalla == 'consulta') {
        $("#myTab").prepend('<li role="presentation" class="" id="li' + pestalla + '" style="text-align: right;"><a href="#rr' + pestalla + '" id="id' + pestalla + '" role="tab" data-toggle="tab" aria-expanded="false">Consulta <i class="fa fa-times" style="color: red; background: transparent;cursor: pointer;" onclick="cerrar_elemento(' + pestalla + ')"></i></a></li>');
    
    
      } else {
        if (temp_pestalla == -1) {
          $("#myTab").prepend('<li role="presentation" class="" id="li' + pestalla + '" style="text-align: right;"><a href="#rr' + pestalla + '" id="id' + pestalla + '" role="tab" data-toggle="tab" aria-expanded="false">Nuevo <i class="fa fa-times" style="color: red; background: transparent;cursor: pointer;" onclick="cerrar_elemento(' + pestalla + ')"></i></a></li>');
    
        } else {
    
          if(offline == false){
            if (dict_pestalla['p-' + temp_pestalla]["tabla_cab"] == undefined) {
              $("#myTab").prepend('<li role="presentation" class="" id="li' + pestalla + '" style="text-align: right;"><a href="#rr' + pestalla + '" id="id' + pestalla + '" role="tab" data-toggle="tab" aria-expanded="false">' + lbl + dict_pestalla['p-' + temp_pestalla]["tabla"][0]["Descripcion"] + ' <i class="fa fa-times" style="color: red; background: transparent;cursor: pointer;" onclick="cerrar_elemento(' + pestalla + ')"></i></a></li>');   
            } else {
              $("#myTab").prepend('<li role="presentation" class="" id="li' + pestalla + '" style="text-align: right;"><a href="#rr' + pestalla + '" id="id' + pestalla + '" role="tab" data-toggle="tab" aria-expanded="false" >' + lbl + dict_pestalla['p-' + temp_pestalla]["tabla_cab"]["Descripcion"] + ' <i class="fa fa-times" style="color: red; background: transparent;cursor: pointer;" onclick="cerrar_elemento(' + pestalla + ')"></i> </a></li>');
            }
          }else{
            $("#myTab").prepend('<li role="presentation" class="" id="li' + pestalla + '" style="text-align: right;"><a href="#rr' + pestalla + '" id="id' + pestalla + '" role="tab" data-toggle="tab" aria-expanded="false">' + lbl + offlineResponde[pkmodulo]['tabla_cab']['Descripcion'] + ' <i class="fa fa-times" style="color: red; background: transparent;cursor: pointer;" onclick="cerrar_elemento(' + pestalla + ')"></i></a></li>');   

          }
        }
    
        
    
      }
    }else{
      $("#myTab").prepend('<li role="presentation" class="" id="li' + pestalla + '" style="text-align: right;"><a href="#rr' + pestalla + '" id="id' + pestalla + '" role="tab" data-toggle="tab" aria-expanded="false">'+t_traspasosDisplay+' <i class="fa fa-times" style="color: red; background: transparent;cursor: pointer;" onclick="cerrar_elemento(' + pestalla + ')"></i></a></li>');

    }
  
  
  
    var id_tab = pkmodulo
    if (tipo == 0) { tipo = 'Nuevo' }
    if (tipo == 1) { tipo = 'modificar' }
    if (tipo == 2) { tipo = 'consulta' }
    if (tipo == 3) { tipo = 'consulta_nuevo' }
  
    precargo = false
    if(savemode == true){
      for (ss = 0; ss < Object.keys(dict_pestalla).length; ss++) {
        if(dict_pestalla[Object.keys(dict_pestalla)[ss]]['tipo'] == 'Nuevo' ){
          if(dict_pestalla[Object.keys(dict_pestalla)[ss]]['tabla_cab']['PkModulo'] == pkmodulo){
            n_dic = dict_pestalla[Object.keys(dict_pestalla)[ss]]
            n_dic['dev_pestalla'] = pestalla
            n_dic['pestalla'] = pestalla
            $("#myTabContent").prepend('<div role="tabpanel" class="tab-pane fade" id="rr' + pestalla + '" aria-labelledby="id' + pestalla + '" style="background-color: transparent;"> Procesando </div>');
            document.getElementById('id' + pestalla).click();

            regitro_resp(n_dic, tipo, pestalla, pkmodulo, pkregistro, origen, t_clave, t_traspasos)
            precargo == true
            break
          }
        }
      }
      

    }
    if(precargo == false){

      if(offline == false){
        $.ajax({
          type: 'POST',
          url: '/' + web_idioma + '/consulta',
          data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'pkmodulo': pkmodulo, 'pestalla': pestalla, 'pkregistro': pkregistro, 'tipo': tipo, 't_clave': t_clave },
          beforeSend: function () {
            $("#myTabContent").prepend('<div role="tabpanel" class="tab-pane fade" id="rr' + pestalla + '" aria-labelledby="id' + pestalla + '" style="background-color: transparent;"> Procesando </div>');
            document.getElementById('id' + pestalla).click();

          },
          success: function (Response) {
            regitro_resp(Response, tipo, pestalla, pkmodulo, pkregistro, origen, t_clave, t_traspasos)

          }
        });
      }
      /////////////////////////////////////BLoque offline///////////////////////////////


      if(offline == true){

        $("#myTabContent").prepend('<div role="tabpanel" class="tab-pane fade" id="rr' + pestalla + '" aria-labelledby="id' + pestalla + '" style="background-color: transparent;"> Procesando </div>');
      
        document.getElementById('id' + pestalla).click();

        $('#rr' + pestalla).html('');
      
            id_dic = 'p-' + pestalla
            //dict_pestalla[id_dic] = offlineResponde[pkmodulo]
            dict_pestalla[id_dic] = offlineResponde[pkmodulo] // asume es nuevo siempre
            dict_pestalla[id_dic]['tipo'] = tipo
            dict_pestalla[id_dic]['pestalla'] = pestalla
            
            cc_porPesta[id_dic] = 1
      
            div_botones = '<div class="box-header with-border" style="margin-left: 0px;margin-right: 0px;background: white;padding: 0px;"><div class="col-md-12"><div class="row">'
            readonly = 'readonly="readonly"'
            if (tipo == 'consulta') {
      
              readonly = 'readonly="readonly"'
              //div_botones =div_botones +'<button type="button" onclick="cerrar_elemento(' + pestalla + ')" class="btn bg-blue btn-flat margin"><span>Correo</span></button>'
              if (dict_pestalla[id_dic]["plantilla_pdf"]["plantillasMain"].length > 0) {
                //div_botones =div_botones +'<button type="button" onclick="pdf_elemento(' + pestalla + ')" class="btn bg-blue btn-flat margin"><span>PDF</span></button>'
                for (dd = 0; dd < dict_pestalla[id_dic]["plantilla_pdf"]["plantillasMain"].length; dd++) {
                  if(dict_pestalla[id_dic]["plantilla_pdf"]['plantillasfirmas'] == 'Si'){
                    adir = dict_pestalla[id_dic]['tabla_cab']['Nombre']+ dict_pestalla[id_dic]['tabla_cab']['PkModulo'] + '_' + dict_pestalla[id_dic]['valores_cab'][0]['Pk'+dict_pestalla[id_dic]['tabla_cab']['Nombre']] + dict_pestalla[id_dic]["plantilla_pdf"]['plantillasMain'][0]['Descripcion']
                    div_botones = div_botones + '<a href="/media/firma/PDF/' + web_Id_empresa + '/'+adir+'" target="_blank" style="font-size: 11px;">'
                    div_botones = div_botones + '<button type="button" class="btn bg-blue btn-flat margin"><span>' + dict_pestalla[id_dic]["plantilla_pdf"]["plantillasMain"][dd]['Nombre'] + '</span></button>'
                    div_botones = div_botones + '</a>'
      
                    
                  }else{
      
                    div_botones = div_botones + '<button type="button" onclick="pdf_elemento(' + pestalla + ', ' + dd + ')" class="btn bg-blue btn-flat margin"><span>' + dict_pestalla[id_dic]["plantilla_pdf"]["plantillasMain"][dd]['Nombre'] + '</span></button>'
                    dict_pestalla[id_dic]['tabla_cab']['Nombre']+ dict_pestalla[id_dic]['tabla_cab']['PkModulo'] + '_' + dict_pestalla[id_dic]['valores_cab'][0]['Pk'+dict_pestalla[id_dic]['tabla_cab']['Nombre']] + dict_pestalla[id_dic]["plantilla_pdf"]['plantillasMain'][0]['Descripcion']
                    
                    
                  }
      
                }
              }
      
              for (dd = 0; dd < dict_pestalla[id_dic]["plantilla_html"].length; dd++) {
      
                div_botones = div_botones + '<button type="button" onclick="imprimir_elemento(' + pestalla + ', ' + dd + ')" class="btn bg-blue btn-flat margin"><span>' + dict_pestalla[id_dic]["plantilla_html"][dd]['Nombre'] + '</span></button>'
      
              }
              
      
              if (offlineResponde[pkmodulo]["acc_rapido"]['Modificar'] == 'Si') {
                div_botones = div_botones + '<button class="btn bg-yellow btn-flat margin" onclick="registro(' + offlineResponde[pkmodulo]["tabla_cab"]["PkModulo"] + ',' + offlineResponde[pkmodulo]["t_pkregistro"] + ',1,' + pestalla + ',0,0);cerrar_elemento(' + pestalla + ')">Modificar</span></button>'
              }
      
              if (offlineResponde[pkmodulo]["acc_rapido"]['Nuevo'] == 'Si') {
                div_botones = div_botones + '<button class="btn bg-blue btn-flat margin" onclick="registro(' + offlineResponde[pkmodulo]["tabla_cab"]["PkModulo"] + ',' + offlineResponde[pkmodulo]["t_pkregistro"] + ',0,' + pestalla + ',0,0);cerrar_elemento(' + pestalla + ')">Copiar en Nuevo</span></button>'
              }
              if (offlineResponde[pkmodulo]["acc_rapido"]['Eliminar'] == 'Si') {
                div_botones = div_botones + '<button class="btn bg-red btn-flat margin" onclick="cerrar_elemento(' + pestalla + ');eliminar(' + offlineResponde[pkmodulo]["tabla_cab"]["PkModulo"] + ',' + offlineResponde[pkmodulo]["t_pkregistro"] + ')">Eliminar</span></button>'
              }
      
      
              //div_botones =div_botones +'<button type="button" onclick="excell_elemento(' + pestalla + ')" class="btn bg-blue btn-flat margin"><span>Excell</span></button>'
              if (origen == '1') {
                div_botones = div_botones + '<button class="btn bg-blue btn-flat margin" onclick="registro(' + offlineResponde[pkmodulo]["tabla_cab"]["PkModulo"] + ',0,0,' + pestalla + ',0,0);cerrar_elemento(' + pestalla + ')">Nuevo</span></button>'
      
              }
      

              div_botones = div_botones + '<button class="btn bg-red btn-flat margin" id="btnAutocerrar' + pestalla + '" onclick="parar_autoccerar_pestana(' + pestalla + ')">Autocerrar</button>'
      
            }
            else {
              if (tipo == 'Nuevo') {
                disparador = 'Guardar Registro Nuevo'
                //div_botones =div_botones +'<button type="button" id="btn_grabar_'+pestalla+'" onclick="this.disabled=true;click_val(1);grabar_elemento(' + pestalla + ',0)" class="btn bg-green btn-flat margin"><span>Grabar</span></button>'
                div_botones = div_botones + '<button type="button" id="btn_grabar_' + pestalla + '" onclick="abrir_default_grabando();grabar_elemento(' + pestalla + ',0)" class="btn bg-green btn-flat margin"><span>Grabar</span></button>'
      
      
      
              } else {
                disparador = 'Modificar Registro'
                //div_botones =div_botones +'<button  type="button" id="btn_mod_'+pestalla+'" onclick="this.disabled=true;click_val(1);grabar_elemento(' + pestalla + ',1)" class="btn bg-green btn-flat margin"><span>Grabar</span></button>'
                div_botones = div_botones + '<button  type="button" id="btn_mod_' + pestalla + '" onclick="abrir_default_grabando();grabar_elemento(' + pestalla + ',1)" class="btn bg-green btn-flat margin"><span>Grabar</span></button>'
                
                if (offlineResponde[pkmodulo]["acc_rapido"]['Nuevo'] == 'Si') {
                  div_botones = div_botones + '<button class="btn bg-blue btn-flat margin" onclick="registro(' + offlineResponde[pkmodulo]["tabla_cab"]["PkModulo"] + ',' + offlineResponde[pkmodulo]["t_pkregistro"] + ',0,' + pestalla + ',0,0);cerrar_elemento(' + pestalla + ')">Copiar en Nuevo</span></button>'
                }
      
      
      
              }
              if(web_esAdmin == 'Y'){              
                div_botones = div_botones + '<button type="button" onclick="validar_registro(' + pestalla + ')" class="btn bg-yellow btn-flat margin"><span>Validar</span></button>'
              }

              //div_botones =div_botones +'<button type="button" onclick="nuevo_elemento(' + pestalla + ')" class="btn bg-blue btn-flat margin"><span>Nuevo</span></button>'
              readonly = ''
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
            for (x = 0; x < offlineResponde[pkmodulo]["campos_cab"].length; x++) {
      
              if (tipo == 'Nuevo') {
      
                if (offlineResponde[pkmodulo]["campos_cab"][x]["TablaCampo"] == "cmpformquery") {
                  valor_campo = ''
      
                }
                if (offlineResponde[pkmodulo]["campos_cab"][x]["TablaCampo"] == "cmptxtsimple") {
                  valor_campo = offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][0]["ValorPredeterminado"]
      
                }
                if (offlineResponde[pkmodulo]["campos_cab"][x]["TablaCampo"] == "cmpnumsimple") {
                  valor_campo = offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][0]["Menor"]
      
                }
                if (offlineResponde[pkmodulo]["campos_cab"][x]["TablaCampo"] == "cmpnumsecuencial") {
                  if (offlineResponde[pkmodulo]["campos_cab"][x]["TablaCampo"].substring(0, 2) == "Pk") {
                    valor_campo = 0
                  } else {
                    valor_campo = offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][0]["ValorInicial"]
                  }
                }
                if (offlineResponde[pkmodulo]["campos_cab"][x]["TablaCampo"] == "cmpopcmultiple") {
                  valor_campo = offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][0]["Valor"]
                }
                if (offlineResponde[pkmodulo]["campos_cab"][x]["TablaCampo"] == "cmpsistema") {
                  if (offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][0]["PkId"] == 2) {
                    valor_campo = web_usuario
                  }
                  if (offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][0]["PkId"] == 1) {
                    var now = new Date();
                    valor_campo = now.format("Y-m-d") + 'T' + now.format("H:i:s")
                  }
                }
                if (offlineResponde[pkmodulo]["campos_cab"][x]["TablaCampo"] == "cmpformuladetalle") {
                  valor_campo = 0
                }
                if (offlineResponde[pkmodulo]["campos_cab"][x]["TablaCampo"] == "cmpfecha") {
      
                  var now = new Date();
                  if (offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][0]["Tiempo"] == "Y") {
                    valor_campo = now.format("Y-m-d") + 'T' + now.format("H:i:s")
                  } else {
                    valor_campo = now.format("Y-m-d");
                  }
                }
                if (offlineResponde[pkmodulo]["campos_cab"][x]["TablaCampo"] == "cmpreferencia") {
                  valor_campo = offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][0][0]["predeterminado_valor"]
                }
                if (offlineResponde[pkmodulo]["campos_cab"][x]["TablaCampo"] == "cmpreferenciaadjunto") {
                  valor_campo = 0
                }
                if (offlineResponde[pkmodulo]["campos_cab"][x]["TablaCampo"] == "cmpoperacion") {
                  valor_campo = 0
                }
                if (offlineResponde[pkmodulo]["campos_cab"][x]["TablaCampo"] == "cmpconsolidado") {
                  valor_campo = 0
                }
                if (offlineResponde[pkmodulo]["campos_cab"][x]["TablaCampo"] == "cmparchivo") {
                  valor_campo = ""
                }
                if (offlineResponde[pkmodulo]["campos_cab"][x]["TablaCampo"] == "cmpnumeroaletras") {
                  valor_campo = ""
                }
                if (offlineResponde[pkmodulo]["campos_cab"][x]["TablaCampo"] == "cmpdecabecera") {
                  valor_campo = ""
                }
                if (offlineResponde[pkmodulo]["campos_cab"][x]["TablaCampo"] == "cmpelectronico") {
                  valor_campo = 0
      
                }
                if (offlineResponde[pkmodulo]["campos_cab"][x]["TablaCampo"] == "cmpcondicional") {
                  valor_campo = ""
      
                }
      
      
                if (offlineResponde[pkmodulo]["valores_cab"].length > 0) {
      
                  if (offlineResponde[pkmodulo]["campos_cab"][x]["TablaCampo"] == 'cmpnumsimple' || offlineResponde[pkmodulo]["campos_cab"][x]["TablaCampo"] == 'cmptxtsimple' || offlineResponde[pkmodulo]["campos_cab"][x]["TablaCampo"] == 'cmpreferencia' || offlineResponde[pkmodulo]["campos_cab"][x]["TablaCampo"] == 'cmpreferenciaadjunto') {
                    if (offlineResponde[pkmodulo]["campos_cab"][x]["TablaCampo"] == 'cmptxtsimple') {
                      if (offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][0]["Modificable"] == 'N') {
                        valor_campo = offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][0]["ValorPredeterminado"]
                      } else {
                        valor_campo = offlineResponde[pkmodulo]["valores_cab"][0][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]]
                      }
                    } else {
                      valor_campo = offlineResponde[pkmodulo]["valores_cab"][0][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]]
                    }
      
      
      
                  }
      
                }
      
              } else {
                valor_campo = offlineResponde[pkmodulo]["valores_cab"][0][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]]
                if (offlineResponde[pkmodulo]["campos_cab"][x]["TablaCampo"] == "cmpfecha") {
                  var now = new Date(offlineResponde[pkmodulo]["valores_cab"][0][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]]);
                  if (offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][0]["Tiempo"] == "Y") {
                    valor_campo = now.format("Y-m-d") + 'T' + now.format("H:i:s")
                  } else {
                    now.addDays(1)
                    valor_campo = now.format("Y-m-d");
                  }
                }
      
              }
      
              if (tipo == 'modificar') {
                readonly = ''
                if (offlineResponde[pkmodulo]["campos_cab"][x]["Modificable"] == 'No') {
                  readonly = 'readonly="readonly"'
                }
              }
              ID_TAG = 'p' + pestalla + 'zzz' + offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"] + '';
              if (offlineResponde[pkmodulo]["campos_cab"][x]["Visible"] == "Y") {
                var_Mayusculas = ''
                if (offlineResponde[pkmodulo]["campos_cab"][x]["estilo"] == "Mayusculas") {
                  var_Mayusculas = 'text-transform: uppercase;'
                }
                div_c_t = offlineResponde[pkmodulo]["campos_cab"][x]["saltoweb"]
                div_c_t = div_c_t + '<div class="col-sm-' + offlineResponde[pkmodulo]["campos_cab"][x]["largoweb"] + '">'
                div_c_t = div_c_t + '<label class="control-label for="' + offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"] + '" style="font-size: 12px;font-weight: bold;">' + offlineResponde[pkmodulo]["campos_cab"][x]["Descripcion"] + '</label>'
                if (offlineResponde[pkmodulo]["campos_cab"][x]["TablaCampo"] == "cmpformquery") {
                  readonly_int = ''
                  div_c_t = div_c_t + '<div type="button" style="width: 100%;font-size: 10px;background: yellow;color: black;cursor: pointer;padding-top: 5px;padding-bottom: 5px;padding-left: 5px;padding-right: 5px;" class="col-sx-5" data-toggle="modal" data-target="#modal-default_formulas">if(orden_produccion.Contrato = "10",orden_produccion.Secuencial + orden_produccion.Contrato * (1) * [cant],0)</div>'
                }
                if (offlineResponde[pkmodulo]["campos_cab"][x]["TablaCampo"] == "cmptxtsimple") {
                  readonly_int = ''
                  if (offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][0]["Modificable"] == "N") {
                    readonly_int = 'readonly="readonly"'
                  }
                  if (offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][0]["Largo"] > 100) {
                    div_c_t = div_c_t + '<textarea type="text" id="' + ID_TAG + '" class="form-control col-sm-' + offlineResponde[pkmodulo]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' ' + readonly_int + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 45px;font-size: 11px;' + var_Mayusculas + '">' + valor_campo + '</textarea>'
                  } else {
                    div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + offlineResponde[pkmodulo]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' ' + readonly_int + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 25px;font-size: 11px;' + var_Mayusculas + '">'
                  }
                }
                if (offlineResponde[pkmodulo]["campos_cab"][x]["TablaCampo"] == "cmpnumsimple") {
      
                  div_c_t = div_c_t + '<input type="number" id="' + ID_TAG + '" class="form-control col-sm-' + offlineResponde[pkmodulo]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' min="' + offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][0]["Menor"] + '" max="' + offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][0]["Mayor"] + '" onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="text-align: right;height: 25px;font-size: 11px;" onkeypress="return solo_numero(event)">'
                }
                if (offlineResponde[pkmodulo]["campos_cab"][x]["TablaCampo"] == "cmpnumsecuencial") {
      
                  div_c_t = div_c_t + '<input type="number" id="' + ID_TAG + '" class="form-control col-sm-' + offlineResponde[pkmodulo]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" readonly="readonly" style="text-align: right;height: 25px;font-size: 11px;">'
                }
                if (offlineResponde[pkmodulo]["campos_cab"][x]["TablaCampo"] == "cmpopcmultiple") {
                  if (tipo != 'consulta') {
                    div_c_t = div_c_t + '<select class="form-control col-sm-' + offlineResponde[pkmodulo]["campos_cab"][x]["largoweb"] + '" id="' + ID_TAG + '" value="' + valor_campo + '" onchange="guardar_calcular(' + ID_TAG + ' , 0)" style="height: 25px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;">'
      
                    for (z = 0; z < offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]].length; z++) {
      
                      if (valor_campo == offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][z]["Valor"]) {
                        div_c_t = div_c_t + '<option selected value="' + offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][z]["Valor"] + '">' + offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][z]["Nombre"] + '</option>'
                      } else {
                        div_c_t = div_c_t + '<option value="' + offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][z]["Valor"] + '">' + offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][z]["Nombre"] + '</option>'
                      }
                    }
                    div_c_t = div_c_t + '</select>'
                  } else {
                    for (z = 0; z < offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]].length; z++) {
      
                      if (valor_campo == offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][z]["Valor"]) {
                        valor_campo = offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][z]["Nombre"]
      
                        div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + offlineResponde[pkmodulo]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 25px;font-size: 11px;">'
      
                      }
                    }
      
                  }
                }
                if (offlineResponde[pkmodulo]["campos_cab"][x]["TablaCampo"] == "cmpsistema") {
                  if (offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][0]["PkId"] == 2) {
                    div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + offlineResponde[pkmodulo]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" readonly="readonly" style="height: 25px;font-size: 11px;">'
                  }
      
                  if (offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][0]["PkId"] == 1) {
                    div_c_t = div_c_t + '<input type="datetime-local" id="' + ID_TAG + '" class="form-control col-sm-' + offlineResponde[pkmodulo]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" readonly="readonly" style="height: 25px;font-size: 11px;line-height: 7px;">'
                  }
      
      
                  if (offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][0]["PkId"] == 4) {
      
                    div_c_t = div_c_t + '<select id="' + ID_TAG + '" class="form-control col-sm-' + offlineResponde[pkmodulo]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" readonly="readonly" style="height: 25px;font-size: 11px;">'
                    for (zxz = 0; zxz < web_user.length; zxz++) {
                      if (web_user[zxz] == valor_campo) {
                        div_c_t = div_c_t + '<option selected>' + web_user[zxz] + '</option>'
      
                      } else {
                        div_c_t = div_c_t + '<option>' + web_user[zxz] + '</option>'
      
                      }
                    }
                    div_c_t = div_c_t + '</select>'
      
                  }
                }
                if (offlineResponde[pkmodulo]["campos_cab"][x]["TablaCampo"] == "cmpformuladetalle") {
      
                  div_c_t = div_c_t + '<input type="number" id="' + ID_TAG + '" class="form-control col-sm-' + offlineResponde[pkmodulo]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" readonly="readonly" onchange="guardar_calcular(' + ID_TAG + ' , 0 )" style="text-align: right;height: 25px;font-size: 11px;">'
                }
                if (offlineResponde[pkmodulo]["campos_cab"][x]["TablaCampo"] == "cmpfecha") {
                  tipodato = 'date'
      
                  if (offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][0]["Tiempo"] == 'Y') {
                    tipodato = 'datetime-local'
                  }
                  div_c_t = div_c_t + '<input type="' + tipodato + '" id="' + ID_TAG + '" class="form-control col-sm-' + offlineResponde[pkmodulo]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 25px;font-size: 11px;line-height: 7px;">'
                }
                if (offlineResponde[pkmodulo]["campos_cab"][x]["TablaCampo"] == "cmpreferencia") {
                  div_c_t = div_c_t + '<div class="input-group input-group-sm" style="width: 100%;">'
      
                  readonlyRef = ''
                  if (offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][0][0]["Escribir"] == 'No') { readonlyRef = 'readonly="readonly"' }
      
                  if (tipo != 'consulta') {
      
      
                    if (tipo == 'modificar') {
                      if (offlineResponde[pkmodulo]["campos_cab"][x]["Modificable"] == 'No') {
                        div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + (offlineResponde[pkmodulo]["campos_cab"][x]["largoweb"] - 1) + '" value="' + valor_campo + '" ' + readonly + ' ' + readonlyRef + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 25px;font-size: 11px;' + var_Mayusculas + '" onkeypress="return runScript(event, ' + ID_TAG + ')" >'
                      } else {
                        if (offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][0][0]["pkmodulo_ingreso"] != 0) {
                          div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + (offlineResponde[pkmodulo]["campos_cab"][x]["largoweb"] - 1) + '" value="' + valor_campo + '" ' + readonly + ' ' + readonlyRef + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="width: 70%;height: 25px;font-size: 11px;' + var_Mayusculas + '" onkeypress="return runScript(event, ' + ID_TAG + ')" >'
                          div_c_t = div_c_t + '<button type="button" class="btn btn-info" data-toggle="modal" data-target=".bs-example-modal-lg" onclick="buscar_referencia_cabecera(' + ID_TAG + ' )"style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></button>'
      
      
                          div_c_t = div_c_t + '<button type="button" class="btn btn-info"  onclick="registro(' + offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][0][0]["pkmodulo_ingreso"] + ',0,0,-1,0,0)" style="height: 25px;padding: 3px 4px;"><i class="fa fa-plus"></i></button>'
                        } else {
                          div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + (offlineResponde[pkmodulo]["campos_cab"][x]["largoweb"] - 1) + '" value="' + valor_campo + '" ' + readonly + ' ' + readonlyRef + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="width: 85%;height: 25px;font-size: 11px;' + var_Mayusculas + '" onkeypress="return runScript(event, ' + ID_TAG + ')" >'
                          div_c_t = div_c_t + '<button type="button" class="btn btn-info" data-toggle="modal" data-target=".bs-example-modal-lg" onclick="buscar_referencia_cabecera(' + ID_TAG + ' )"style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></button>'
      
                        }
                      }
      
      
      
                    } else {
                      if (offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][0][0]["pkmodulo_ingreso"] != 0) {
                        div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + (offlineResponde[pkmodulo]["campos_cab"][x]["largoweb"] - 1) + '" value="' + valor_campo + '" ' + readonly + ' ' + readonlyRef + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="width: 65%;height: 25px;font-size: 11px;" onkeypress="return runScript(event, ' + ID_TAG + ')" >'
                        div_c_t = div_c_t + '<button type="button" class="btn btn-info" data-toggle="modal" data-target=".bs-example-modal-lg" onclick="buscar_referencia_cabecera(' + ID_TAG + ' )"style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></button>'
      
      
                        div_c_t = div_c_t + '<button type="button" class="btn btn-info"  onclick="registro(' + offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][0][0]["pkmodulo_ingreso"] + ',0,0,-1,0,0)" style="height: 25px;padding: 3px 4px;"><i class="fa fa-plus"></i></button>'
                      } else {
                        div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + (offlineResponde[pkmodulo]["campos_cab"][x]["largoweb"] - 1) + '" value="' + valor_campo + '" ' + readonly + ' ' + readonlyRef + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="width: 85%;height: 25px;font-size: 11px;" onkeypress="return runScript(event, ' + ID_TAG + ')" >'
                        div_c_t = div_c_t + '<button type="button" class="btn btn-info" data-toggle="modal" data-target=".bs-example-modal-lg" onclick="buscar_referencia_cabecera(' + ID_TAG + ' )"style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></button>'
      
                      }
                    }
      
      
      
                  } else {
                    div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + (offlineResponde[pkmodulo]["campos_cab"][x]["largoweb"] - 1) + '" value="' + valor_campo + '" ' + readonly + ' ' + readonlyRef + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="width: 85%;height: 25px;font-size: 11px;"" onkeypress="return runScript(event, ' + ID_TAG + ')" >'
                    if (offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][0][0]["pkmod_consul"] != '0') {
                      div_c_t = div_c_t + '<button type="button" class="btn btn-info" onclick="registro(' + offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][0][0]["pkmod_consul"] + ', ' + offlineResponde[pkmodulo]["valores_cab"][0][offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][0][0]["campo_fk"]] + ', 2, -2, 0,0)" style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;"><span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span></button>'
                    }
      
      
                  }
      
                  div_c_t = div_c_t + '</div>'
                }
                if (offlineResponde[pkmodulo]["campos_cab"][x]["TablaCampo"] == "cmpreferenciaadjunto") {
      
                  if (offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][0]["Tipo"] == 'Imagen') {
                    
                    div_c_t = div_c_t + '<div class="thumbnail" style="height: 160px;margin-bottom: 1px;"><div class="image view view-first"><a id="' + ID_TAG + '_label" href="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" target="_blank" style="font-size: 11px;"><img style="width: 100%;height: 60%;margin-left: auto;margin-right: auto; display: block;" id="' + ID_TAG + '_img" src="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" alt="image" value="' + valor_campo + '">' + valor_campo + '</a>'
      
                    if (offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][0]["Modificable"] == 'S') {
                      div_c_t = div_c_t + '<label for="' + ID_TAG + '_img_file" class="btn bg-blue btn-flat margin btn-block btn-outlined" style="padding-left: 0px;padding-right: 0px;margin-bottom: 0px;">Cambiar</label>'  
                      div_c_t = div_c_t + '<input type="file" id="' + ID_TAG + '_img_file" onchange="cambiar_imagen(' + ID_TAG + '_img)" style="display: none">'  
                    }
                    
                    div_c_t = div_c_t + '</div></div>'
                    
      
      
      
                  }
                  else {
                    Moddato = ''
                    if (offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][0]["Modificable"] == 'N') {
                      Moddato = 'readonly="readonly"'
                    }
                    if (offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][0]["Tipo"] == 'Texto') {
      
                      if (offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][0]["Tamano"] == 'G') {
      
                        div_c_t = div_c_t + '<textarea type="text" id="' + ID_TAG + '" class="form-control col-sm-' + offlineResponde[pkmodulo]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 45px;font-size: 11px;' + var_Mayusculas + '">' + valor_campo + '</textarea>'
      
                      } else {
                        div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + offlineResponde[pkmodulo]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 25px;font-size: 11px;' + var_Mayusculas + '">'
                      }
      
      
                    }
                    if (offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][0]["Tipo"] == 'Numero') {
                      div_c_t = div_c_t + '<input type="number" id="' + ID_TAG + '" class="form-control col-sm-' + offlineResponde[pkmodulo]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="text-align: right;" style="height: 25px;font-size: 11px;" onkeypress="return solo_numero(event)">'
      
                    }
                    if (offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][0]["Tipo"] == 'Fecha') {
      
                      div_c_t = div_c_t + '<input type="date" id="' + ID_TAG + '"class="form-control col-sm-' + offlineResponde[pkmodulo]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 25px;font-size: 11px;">'
                    }
                    if (offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][0]["Tipo"] == 'Fecha Tiempo') {
      
                      div_c_t = div_c_t + '<input type="datetime-local" id="' + ID_TAG + '" class="form-control col-sm-' + offlineResponde[pkmodulo]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 25px;font-size: 11px;">'
                    }
      
      
                  }
                }
                if (offlineResponde[pkmodulo]["campos_cab"][x]["TablaCampo"] == "cmpoperacion") {
      
                  div_c_t = div_c_t + '<input type="number" id="' + ID_TAG + '" class="form-control col-sm-' + offlineResponde[pkmodulo]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' onchange="setTwoNumberDecimal(' + offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][0]["Decimales"] + ')" readonly="readonly" onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="text-align: right;height: 25px;font-size: 11px;" >'
                }
                if (offlineResponde[pkmodulo]["campos_cab"][x]["TablaCampo"] == "cmpconsolidado") {
      
                  div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + offlineResponde[pkmodulo]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" onchange="guardar_calcular(' + ID_TAG + ', 0)" style="height: 25px;font-size: 11px;">'
                }
                if (offlineResponde[pkmodulo]["campos_cab"][x]["TablaCampo"] == "cmpcondicional") {
      
                  div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + offlineResponde[pkmodulo]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" onchange="guardar_calcular(' + ID_TAG + ', 0)" style="height: 25px;font-size: 11px;text-align: right;padding-right: 14px;">'
                }
                if (offlineResponde[pkmodulo]["campos_cab"][x]["TablaCampo"] == "cmparchivo") {
                  if (offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][0]["Ruta"] == 'Dibujo') {
      
                    
                    div_c_t = div_c_t + '<div class="col-6" style="height: 100px;margin-bottom: 1px;">'
                    div_c_t = div_c_t + '<canvas id="' + ID_TAG + '_canvas"  width="250" height="80" style="position:absolute;top:10%;left:10%;border:2px solid;margin-top: 6px;""></canvas>'
                    div_c_t = div_c_t + '</div>'
      
      
                    div_c_t = div_c_t + '<div class="row">'
                    
                    div_c_t = div_c_t + '<button class="btn bg-blue btn-flat margin btn-block btn-outlined" style="padding-left: 0px;padding-right: 0px;margin-bottom: 0px;" onclick="Iniciar_firma(' + ID_TAG + '_canvas)">Firmar</button>'
                    div_c_t = div_c_t + '<button class="btn bg-yellow btn-flat margin btn-block btn-outlined" style="padding-left: 0px;padding-right: 0px;margin-bottom: 0px;" onclick="Limpiar_firma(' + ID_TAG + '_canvas)">Limpiar</button>'
                    div_c_t = div_c_t + '<button class="btn bg-green btn-flat margin btn-block btn-outlined" style="padding-left: 0px;padding-right: 0px;margin-bottom: 0px;" onclick="Grabar_firma(' + ID_TAG + '_canvas,' + ID_TAG + '_img)">Grabar</button>'
                    div_c_t = div_c_t + '</div>'
      
                    div_c_t = div_c_t + '<div class="thumbnail">'
      
      
                    div_c_t = div_c_t + '<div class="image view view-first">'
                    div_c_t = div_c_t + '<a id="' + ID_TAG + '_label" href="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" target="_blank" style="font-size: 11px;">'
                    div_c_t = div_c_t + '<img style="width: 100%;height: 60%;margin-left: auto;margin-right: auto; display: block;" id="' + ID_TAG + '_img" src="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" alt="image" value="' + valor_campo + '">'
                    div_c_t = div_c_t + valor_campo + '</a>'
      
      
                    // div_c_t = div_c_t + '<input type="file" id="' + ID_TAG + '_img_file" onchange="cambiar_imagen(' + ID_TAG + '_img)" style="display: none">'
      
                    div_c_t = div_c_t + '</div></div>'
                    
                    
                  }else{
                    if (offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][0]["Ruta"] == 'PdfFirma') {
                    //div_c_t = div_c_t + '<div class="thumbnail" style="height: 160px;margin-bottom: 1px;"><div class="image view view-first"><a id="' + ID_TAG + '_label" href="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" target="_blank" style="font-size: 11px;"><img style="width: 100%;height: 60%;margin-left: auto;margin-right: auto; display: block;" id="' + ID_TAG + '_img" src="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" alt="image" value="' + valor_campo + '">' + valor_campo + '</a>'
                    div_c_t = div_c_t + '<div class="thumbnail" style="height: 160px;margin-bottom: 1px;"><div class="image view view-first"><a id="' + ID_TAG + '_label" href="/' + valor_campo + '" target="_blank" style="font-size: 11px;"><img style="width: 100%;height: 60%;margin-left: auto;margin-right: auto; display: block;" id="' + ID_TAG + '_img" src="/' + valor_campo + '" alt="image" value="' + valor_campo + '">' + valor_campo + '</a>'
                      
                    div_c_t = div_c_t + '<label for="' + ID_TAG + '_img_file" class="btn bg-blue btn-flat margin btn-block btn-outlined" style="padding-left: 0px;padding-right: 0px;margin-bottom: 0px;display: none">Cambiar</label>'
                    div_c_t = div_c_t + '<input type="file" id="' + ID_TAG + '_img_file" onchange="cambiar_imagen(' + ID_TAG + '_img)" style="display: none"></div></div>'
      
                    }else{
      
                      //div_c_t = div_c_t + '<div class="thumbnail" style="height: 160px;margin-bottom: 1px;"><div class="image view view-first"><a id="' + ID_TAG + '_label" href="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" target="_blank" style="font-size: 11px;"><img style="width: 100%;height: 60%;margin-left: auto;margin-right: auto; display: block;" id="' + ID_TAG + '_img" src="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" alt="image" value="' + valor_campo + '">' + valor_campo + '</a>'
                      div_c_t = div_c_t + '<div class="thumbnail" style="height: 160px;margin-bottom: 1px;"><div class="image view view-first"><a id="' + ID_TAG + '_label" href="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" target="_blank" style="font-size: 11px;"><img style="width: 100%;height: 60%;margin-left: auto;margin-right: auto; display: block;" id="' + ID_TAG + '_img" src="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" alt="image" value="' + valor_campo + '">' + valor_campo + '</a>'
        
                      div_c_t = div_c_t + '<label for="' + ID_TAG + '_img_file" class="btn bg-blue btn-flat margin btn-block btn-outlined" style="padding-left: 0px;padding-right: 0px;margin-bottom: 0px;">Cambiar</label>'
                      div_c_t = div_c_t + '<input type="file" id="' + ID_TAG + '_img_file" onchange="cambiar_imagen(' + ID_TAG + '_img)" style="display: none"></div></div>'
                      
                    }
                    
                  }
      
      
                }
                if (offlineResponde[pkmodulo]["campos_cab"][x]["TablaCampo"] == "cmpnumeroaletras") {
      
                  div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + offlineResponde[pkmodulo]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
                }
                if (offlineResponde[pkmodulo]["campos_cab"][x]["TablaCampo"] == "cmpdecabecera") {
      
                  div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + offlineResponde[pkmodulo]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
                }
                if (offlineResponde[pkmodulo]["campos_cab"][x]["TablaCampo"] == "cmpelectronico") {
      
                  div_c_t = div_c_t + '<div class="input-group input-group-sm" style="width: 100%;">'
      
                  if (valor_campo.toString().length > 5){
                    div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + offlineResponde[pkmodulo]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px; width: 70%;">'
      
                    if (offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][0][0]["Tipo"] == 'Factura') {
                      div_c_t = div_c_t + '<a href="/e_docs/Facturas/'+ valor_campo +'" target="blank"> '
                    }
                    if (offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][0][0]["Tipo"] == 'Retencion') {
                      div_c_t = div_c_t + '<a href="/e_docs/Retenciones/'+ valor_campo +'" target="blank"> '
                    }
                    if (offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][0][0]["Tipo"] == 'Nota credito') {
                      div_c_t = div_c_t + '<a href="/e_docs/Credito/'+ valor_campo +'" target="blank"> '
                    }
                    if (offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][x]["Nombre"]][0][0]["Tipo"] == 'Guia remision') {
                      div_c_t = div_c_t + '<a href="/e_docs/Guia/'+ valor_campo +'" target="blank"> '
                    }
                    div_c_t = div_c_t + '<span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></a>'
                  }else{
                    div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + offlineResponde[pkmodulo]["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px; width: 100%;">'
      
                  }
      
                  div_c_t = div_c_t + '</div>'
      
      
                }
                div_c_t = div_c_t + '</div>'
      
                if (offlineResponde[pkmodulo]["campos_cab"][x]["posicionweb"] == "arriba_izq") {
                  div_campos_arriba_izq = div_campos_arriba_izq + div_c_t
                }
                if (offlineResponde[pkmodulo]["campos_cab"][x]["posicionweb"] == "arriba_der") {
                  div_campos_arriba_der = div_campos_arriba_der + div_c_t
                }
                if (offlineResponde[pkmodulo]["campos_cab"][x]["posicionweb"] == "abajo_izq") {
                  div_campos_abajo_izq = div_campos_abajo_izq + div_c_t
                }
                if (offlineResponde[pkmodulo]["campos_cab"][x]["posicionweb"] == "abajo_der") {
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
      
      
      
      
            if (typeof (offlineResponde[pkmodulo]["campos_det"]) == "object") {
              readonly = ''
      
              var largo_tabla = 0
              for (x = 0; x < offlineResponde[pkmodulo]["campos_det"].length; x++) {
                if (offlineResponde[pkmodulo]["campos_det"][x]["Visible"] == "Y") {
                  largo_tabla = largo_tabla + parseFloat(offlineResponde[pkmodulo]["campos_det"][x]["largo"])
      
                }
              }
      
              if (tipo == 'consulta') {
                readonly = 'readonly="readonly"'
      
                div_campos = '<div id="divtabla' + pestalla + '" class="box-body tableFixHead" style="background: white; overflow: auto;overflow-y: auto;padding-top: 0px; height: 100%;"><table id="tabla' + pestalla + '" class="table table-striped" style="width: ' + parseInt(largo_tabla) + 'px;overflow-x:auto;font-size: 11px;background: white;"><thead><tr><th style="width: 20px;padding-left: 0px;"> </th>'
              } else {
                div_campos = '<div id="divtabla' + pestalla + '" class="box-body tableFixHead" style="background: white; overflow: auto;overflow-y: auto;padding-top: 0px; height: 100%;"><table id="tabla' + pestalla + '" class="table table-striped" style="width: ' + parseInt(largo_tabla) + 'px;overflow-x:auto;font-size: 11px;background: white;"><thead><tr><th style="width: 20px;">'
                div_campos = div_campos + '<div class="row" style="margin-left: 0px;height: 30px;"><button type="button" onclick="mas(' + pestalla + ')" class="btn bg-green btn-flat margin" style="padding: 3px 8px;margin-bottom: 0px;margin-top: 0px;">+</button>'
      
                div_campos = div_campos + '<button type="button" onclick="ampliar(' + pestalla + ', this)" class="btn bg-blue btn-flat margin" style="padding: 3px 4px;"><span class="glyphicon glyphicon-resize-small"></span></button>'
                if (offlineResponde[pkmodulo]['exportable'] == "Si") {
                  div_campos = div_campos + '<button type="button" onclick="det_rapido(' + pestalla + ')" class="btn bg-yellow btn-flat margin" style="padding: 3px 4px;margin-bottom: 0px;margin-top: 0px;" data-toggle="modal" data-target="#modal-default_wait"><i class="fa fa-fw fa-file-excel-o"></i></button>'
                }
                div_campos = div_campos + '</div></th>'
              }
      
      
              for (x = 0; x < offlineResponde[pkmodulo]["campos_det"].length; x++) {
                if (offlineResponde[pkmodulo]["campos_det"][x]["Visible"] == "Y") {
                  //div_campos = div_campos + '<th class="col-md-' + offlineResponde[pkmodulo]["campos_det"][x]["largoweb"] + '" style="width: ' + offlineResponde[pkmodulo]["campos_det"][x]["largo"] + 'px;">' + offlineResponde[pkmodulo]["campos_det"][x]["Descripcion"] + '</th>'
      
                if(offlineResponde[pkmodulo]["campos_det"][x]['TablaCampo'] == 'cmpnumsimple' || offlineResponde[pkmodulo]["campos_det"][x]['TablaCampo'] == 'cmpformuladetalle' || offlineResponde[pkmodulo]["campos_det"][x]['TablaCampo'] == 'cmpoperacion' || offlineResponde[pkmodulo]["campos_det"][x]['TablaCampo'] == 'cmpconsolidado'){  
                  div_campos = div_campos + '<th class="col-md-' + offlineResponde[pkmodulo]["campos_det"][x]["largoweb"] + '" style="padding-left: 5px;padding-right: 5px;text-align: right;">' + offlineResponde[pkmodulo]["campos_det"][x]["Descripcion"] + '</th>'
      
                }else{
                  if(offlineResponde[pkmodulo]["campos_det"][x]['TablaCampo'] == 'cmpreferenciaadjunto'){
      
                    if (offlineResponde[pkmodulo]["func_det"][offlineResponde[pkmodulo]["campos_det"][x]["Nombre"]][0]["Tipo"] == 'Numero') {
                      div_campos = div_campos + '<th class="col-md-' + offlineResponde[pkmodulo]["campos_det"][x]["largoweb"] + '" style="padding-left: 5px;padding-right: 5px;text-align: right;">' + offlineResponde[pkmodulo]["campos_det"][x]["Descripcion"] + '</th>'
                    }else{
                      div_campos = div_campos + '<th class="col-md-' + offlineResponde[pkmodulo]["campos_det"][x]["largoweb"] + '" style="padding-left: 5px;padding-right: 5px;">' + offlineResponde[pkmodulo]["campos_det"][x]["Descripcion"] + '</th>'
                    }
      
                  }else{
                    div_campos = div_campos + '<th class="col-md-' + offlineResponde[pkmodulo]["campos_det"][x]["largoweb"] + '" style="padding-left: 5px;padding-right: 5px;">' + offlineResponde[pkmodulo]["campos_det"][x]["Descripcion"] + '</th>'
      
                  }
                }
      
      
      
      
                }
              }
              div_campos = div_campos + '</tr></thead><tbody>'
              //var i = 0;
      
              var i = offlineResponde[pkmodulo]["valores_det"].length-1;
              if(i == -1){
                i = 0
              }
              do {
                div_campos = div_campos + '<tr id="f' + pestalla + '-f' + i + '" style="background: white;"><td><div class="row" style="padding-left: 15px;width: 85px;">'
                if (tipo != 'consulta') {
                  div_campos = div_campos + '<button type="button" onclick="menos(' + pestalla + ',' + i + ', 0)" class="btn bg-red btn-flat margin" style="padding: 3px 10px;">-</button>'
                }
                if (typeof (offlineResponde[pkmodulo]["campos_subdet"]) == "object") {
                  //div_campos = div_campos + '<a class="btn btn-info" style="padding: 2px 2px; margin-right: 0px; margin-left: 0px;" ><span class="glyphicon glyphicon-resize-small" aria-hidden="true"></span></a>'
      
                  div_campos = div_campos + '<button type="button" onclick="abrirdetalle(' + pestalla + ', ' + i + ' )" id="regbtn_' + pestalla + '_' + i + '" class="btn bg-blue btn-flat margin" style="padding: 3px 4px;"><span class="glyphicon glyphicon-resize-full"></span></button>'
                }
      
      
                div_campos = div_campos + '</div></td>'
      
                altura_mini = 45
      
                for (x = 0; x < offlineResponde[pkmodulo]["campos_det"].length; x++) {
      
                  valor_campo = 0;
                  if (tipo == 'Nuevo') {
      
                    if (offlineResponde[pkmodulo]["campos_det"][x]["TablaCampo"] == "cmpformquery") {
                      valor_campo = 'Crear Formula'
                    }
                    if (offlineResponde[pkmodulo]["campos_det"][x]["TablaCampo"] == "cmptxtsimple") {
                      valor_campo = offlineResponde[pkmodulo]["func_det"][offlineResponde[pkmodulo]["campos_det"][x]["Nombre"]][0]["ValorPredeterminado"]
                    }
                    if (offlineResponde[pkmodulo]["campos_det"][x]["TablaCampo"] == "cmpnumsimple") {
                      valor_campo = offlineResponde[pkmodulo]["func_det"][offlineResponde[pkmodulo]["campos_det"][x]["Nombre"]][0]["Menor"]
                    }
                    if (offlineResponde[pkmodulo]["campos_det"][x]["TablaCampo"] == "cmpnumsecuencial") {
                      if (offlineResponde[pkmodulo]["campos_det"][x]["TablaCampo"].slice(0, 2) == "Pk") {
                        valor_campo = 0
                      } else {
                        valor_campo = offlineResponde[pkmodulo]["func_det"][offlineResponde[pkmodulo]["campos_det"][x]["Nombre"]][0]["ValorInicial"]
                      }
                    }
                    if (offlineResponde[pkmodulo]["campos_det"][x]["TablaCampo"] == "cmpopcmultiple") {
                      valor_campo = offlineResponde[pkmodulo]["func_det"][offlineResponde[pkmodulo]["campos_det"][x]["Nombre"]][0]["Valor"]
                    }
                    if (offlineResponde[pkmodulo]["campos_det"][x]["TablaCampo"] == "cmpsistema") {
                      if (offlineResponde[pkmodulo]["func_det"][offlineResponde[pkmodulo]["campos_det"][x]["Nombre"]][0]["PkId"] == 2) {
                        valor_campo = web_usuario
      
                      }
                      if (offlineResponde[pkmodulo]["func_det"][offlineResponde[pkmodulo]["campos_det"][x]["Nombre"]][0]["PkId"] == 1) {
                        var now = new Date();
                        valor_campo = now.format("Y-m-d") + 'T' + now.format("H:i:s")
                      }
                    }
                    if (offlineResponde[pkmodulo]["campos_det"][x]["TablaCampo"] == "cmpformuladetalle") {
                      valor_campo = 0
                    }
                    if (offlineResponde[pkmodulo]["campos_det"][x]["TablaCampo"] == "cmpfecha") {
                      var now = new Date();
                      addi = ' AM'
                      if (offlineResponde[pkmodulo]["func_det"][offlineResponde[pkmodulo]["campos_det"][x]["Nombre"]][0]["Tiempo"] == "Y") {
                        if (now.format("H") > 11) { addi = ' PM' }
                        valor_campo = now + addi
                      } else {
                        valor_campo = now.format("Y-m-d");
                      }
                    }
                    if (offlineResponde[pkmodulo]["campos_det"][x]["TablaCampo"] == "cmpreferencia") {
                      valor_campo = offlineResponde[pkmodulo]["func_det"][offlineResponde[pkmodulo]["campos_det"][x]["Nombre"]][0][0]["predeterminado_valor"]
                    }
                    if (offlineResponde[pkmodulo]["campos_det"][x]["TablaCampo"] == "cmpreferenciaadjunto") {
                      valor_campo = 0
                    }
                    if (offlineResponde[pkmodulo]["campos_det"][x]["TablaCampo"] == "cmpoperacion") {
                      valor_campo = 0
                    }
                    if (offlineResponde[pkmodulo]["campos_det"][x]["TablaCampo"] == "cmpconsolidado") {
                      valor_campo = 0
                    }
                    if (offlineResponde[pkmodulo]["campos_det"][x]["TablaCampo"] == "cmpdecabecera") {
                      valor_campo = ""
                    }
      
                    if (offlineResponde[pkmodulo]["valores_det"].length > 0) {
                      valor_campo = offlineResponde[pkmodulo]["valores_det"][i][offlineResponde[pkmodulo]["campos_det"][x]["Nombre"]]
                    }
                  } else {
                    valor_campo = offlineResponde[pkmodulo]["valores_det"][i][offlineResponde[pkmodulo]["campos_det"][x]["Nombre"]]
                  }
      
                  id_tag_detalle = 'pd' + pestalla + 'fff' + i + 'ccc' + offlineResponde[pkmodulo]["campos_det"][x]["Nombre"]
      
                  if (offlineResponde[pkmodulo]["campos_det"][x]["Visible"] == "Y") {
                    //div_campos = div_campos + '<td><div class="col-sm-' + offlineResponde[pkmodulo]["campos_det"][x]["largoweb"] + '" col-md-' + offlineResponde[pkmodulo]["campos_det"][x]["largoweb"] + '" col-lg-' + offlineResponde[pkmodulo]["campos_det"][x]["largoweb"] + '">'
                    div_campos = div_campos + '<td style="padding-left: 0px;padding-right: 5px;"><div style="width: ' + offlineResponde[pkmodulo]["campos_det"][x]["largo"] + 'px;">'
      
      
                    if (offlineResponde[pkmodulo]["campos_det"][x]["TablaCampo"] == "cmpformquery") {
                      readonly_int = ''
                      div_campos = div_campos + '<div id="' + id_tag_detalle + '" type="button" style="width: 100%;font-size: 10px;background: yellow;color: black;cursor: pointer;padding-top: 5px;padding-bottom: 5px;padding-left: 5px;padding-right: 5px;" class="col-sx-5" data-toggle="modal" data-target="#modal-default_formulas" onclick="abrirformula(' + id_tag_detalle + ')">' + valor_campo + '</div>'
                    }
                    if (offlineResponde[pkmodulo]["campos_det"][x]["TablaCampo"] == "cmptxtsimple") {
                      readonly_int = ''
      
                      if (offlineResponde[pkmodulo]["func_det"][offlineResponde[pkmodulo]["campos_det"][x]["Nombre"]][0]["Modificable"] == "N") {
                        readonly_int = 'readonly="readonly"'
                      }
                      if (tipo == 'Nuevo') {
                        valor_campo = offlineResponde[pkmodulo]["func_det"][offlineResponde[pkmodulo]["campos_det"][x]["Nombre"]][0]["ValorPredeterminado"]
                      }
                      if (offlineResponde[pkmodulo]["func_det"][offlineResponde[pkmodulo]["campos_det"][x]["Nombre"]][0]["Largo"] > 100) {
                        div_campos = div_campos + '<textarea type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" ' + readonly_int + ' style="height: ' + altura_mini + 'px;font-size: 11px;">' + valor_campo + '</textarea>'
                      } else {
                        div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" ' + readonly_int + ' style="height: 25px;font-size: 11px;">'
                      }
                    }
                    if (offlineResponde[pkmodulo]["campos_det"][x]["TablaCampo"] == "cmpnumsimple") {
      
                      div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" min="' + offlineResponde[pkmodulo]["func_det"][offlineResponde[pkmodulo]["campos_det"][x]["Nombre"]][0]["Menor"] + '" max="' + offlineResponde[pkmodulo]["func_det"][offlineResponde[pkmodulo]["campos_det"][x]["Nombre"]][0]["Mayor"] + '" style="text-align: right;height: 25px;font-size: 11px;" onkeypress="return solo_numero(event)">'
                    }
                    if (offlineResponde[pkmodulo]["campos_det"][x]["TablaCampo"] == "cmpnumsecuencial") {
      
                      div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" readonly="readonly" onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="text-align: right; height: 25px; font-size: 11px;" onkeypress="return solo_numero(event)">'
                    }
                    if (offlineResponde[pkmodulo]["campos_det"][x]["TablaCampo"] == "cmpopcmultiple") {
                      if (tipo != 'consulta') {
                        div_campos = div_campos + '<select class="form-control" id="' + id_tag_detalle + '" value="' + valor_campo + '" onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;">'
                        for (z = 0; z < offlineResponde[pkmodulo]["func_det"][offlineResponde[pkmodulo]["campos_det"][x]["Nombre"]].length; z++) {
                          if (valor_campo == offlineResponde[pkmodulo]["func_det"][offlineResponde[pkmodulo]["campos_det"][x]["Nombre"]][z]["Valor"]) {
                            div_campos = div_campos + '<option selected>' + offlineResponde[pkmodulo]["func_det"][offlineResponde[pkmodulo]["campos_det"][x]["Nombre"]][z]["Valor"] + '</option>'
                          } else {
                            div_campos = div_campos + '<option>' + offlineResponde[pkmodulo]["func_det"][offlineResponde[pkmodulo]["campos_det"][x]["Nombre"]][z]["Valor"] + '</option>'
                          }
                        }
                        div_campos = div_campos + '</select>'
                      } else {
                        div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;" >'
                      }
                    }
                    if (offlineResponde[pkmodulo]["campos_det"][x]["TablaCampo"] == "cmpsistema") {
                      if (offlineResponde[pkmodulo]["func_det"][offlineResponde[pkmodulo]["campos_det"][x]["Nombre"]][0]["PkId"] == 2) {
                        div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" readonly="readonly" style="height: 25px;font-size: 11px;">'
                      }
                      if (offlineResponde[pkmodulo]["func_det"][offlineResponde[pkmodulo]["campos_det"][x]["Nombre"]][0]["PkId"] == 1) {
                        div_campos = div_campos + '<input type="datetime-local" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" readonly="readonly" onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;line-height: 7px;">'
                      }
      
                      if (offlineResponde[pkmodulo]["func_det"][offlineResponde[pkmodulo]["campos_det"][x]["Nombre"]][0]["PkId"] == 4) {
      
                        div_campos = div_campos + '<select id="' + id_tag_detalle + '" class="form-control value="' + valor_campo + '" readonly="readonly" style="height: 25px;font-size: 11px;" onchange="guardar_calcular_det(' + id_tag_detalle + ')">'
                        for (zxz = 0; zxz < web_user.length; zxz++) {
                          if (web_user[zxz] == valor_campo) {
                            div_campos = div_campos + '<option selected>' + web_user[zxz] + '</option>'
          
                          } else {
                            div_campos = div_campos + '<option>' + web_user[zxz] + '</option>'
          
                          }
                        }
                        div_campos = div_campos + '</select>'
          
                      }
      
                    }
                    if (offlineResponde[pkmodulo]["campos_det"][x]["TablaCampo"] == "cmpformuladetalle") {
      
                      div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" readonly="readonly" onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;">'
                    }
                    if (offlineResponde[pkmodulo]["campos_det"][x]["TablaCampo"] == "cmpfecha") {
                      tipodato = 'date'
                      if (offlineResponde[pkmodulo]["func_det"][offlineResponde[pkmodulo]["campos_det"][x]["Nombre"]][0]["Tiempo"] == 'Y') {
                        tipodato = 'datetime-local'
                      }
                      div_campos = div_campos + '<input type="' + tipodato + '" id="' + id_tag_detalle + '"  class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;line-height: 7px;">'
                    }
                    if (offlineResponde[pkmodulo]["campos_det"][x]["TablaCampo"] == "cmpreferencia") {
      
                      if (tipo == 'consulta') {
                        div_campos = div_campos + '<div class="input-group" style="width: ' + offlineResponde[pkmodulo]["campos_det"][x]["largo"] + 'px;"><input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;" onkeypress="return runScript_detalle(event, ' + id_tag_detalle + ')">'
                        div_campos = div_campos + '</div>'
                      } else {
      
                        div_campos = div_campos + '<div class="input-group" style="width: ' + offlineResponde[pkmodulo]["campos_det"][x]["largo"] + 'px;"><input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="width: 75%;height: 25px;font-size: 11px;" onkeypress="return runScript_detalle(event, ' + id_tag_detalle + ')">'
                        div_campos = div_campos + '<button type="button" class="btn btn-info" data-toggle="modal" data-target=".bs-example-modal-lg" onclick="buscar_referencia_detalle(' + id_tag_detalle + ' )" style="height: 25px;padding: 3px 4px;margin-top: 0px;margin-bottom: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></button></div>'
                      }
                    }
                    if (offlineResponde[pkmodulo]["campos_det"][x]["TablaCampo"] == "cmpreferenciaadjunto") {
                      if (offlineResponde[pkmodulo]["func_det"][offlineResponde[pkmodulo]["campos_det"][x]["Nombre"]][0]["Tipo"] == 'Imagen') {
      
                        div_campos = div_campos + '<div class="thumbnail" style="height: 160px;margin-bottom: 1px;"><div class="image view view-first"><a id="' + id_tag_detalle + '_label" href="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" target="_blank"><img style="width: 100%;height: 60%;margin-left: auto;margin-right: auto; display: block;" id="' + id_tag_detalle + '_img" src="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" alt="image" value="' + valor_campo + '">' + valor_campo + '</a>'
      
                        altura_mini = 125
      
                        if (offlineResponde[pkmodulo]["func_det"][offlineResponde[pkmodulo]["campos_det"][x]["Nombre"]][0]["Modificable"] == 'N') {
                          div_campos = div_campos + '</div></div>'
      
                        } else {
                          div_campos = div_campos + '<label for="' + id_tag_detalle + '_img_file" class="btn bg-blue btn-flat margin btn-block btn-outlined" style="padding-left: 0px;padding-right: 0px;margin-bottom: 0px;">Cambiar</label>'
                          div_campos = div_campos + '<input type="file" id="' + id_tag_detalle + '_img_file" onchange="cambiar_imagen(' + id_tag_detalle + '_img)" style="display: none"></div></div>'
                        }
      
                      } else {
                        Moddato = ''
                        if (offlineResponde[pkmodulo]["func_det"][offlineResponde[pkmodulo]["campos_det"][x]["Nombre"]][0]["Modificable"] == 'N') {
                          Moddato = 'readonly="readonly"'
                        }
                        if (offlineResponde[pkmodulo]["func_det"][offlineResponde[pkmodulo]["campos_det"][x]["Nombre"]][0]["Tipo"] == 'Texto') {
                          if (offlineResponde[pkmodulo]["func_det"][offlineResponde[pkmodulo]["campos_det"][x]["Nombre"]][0]["Tamano"] == 'G') {
                            div_campos = div_campos + '<textarea type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="font-size: 11px;height: ' + altura_mini + 'px;">' + valor_campo + '</textarea>'
                          } else {
                            div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;">'
                          }
      
                        }
                        if (offlineResponde[pkmodulo]["func_det"][offlineResponde[pkmodulo]["campos_det"][x]["Nombre"]][0]["Tipo"] == 'Numero') {
      
                          div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="text-align: right;height: 25px;font-size: 11px;" onkeypress="return solo_numero(event)">'
                        }
                        if (offlineResponde[pkmodulo]["func_det"][offlineResponde[pkmodulo]["campos_det"][x]["Nombre"]][0]["Tipo"] == 'Fecha') {
      
                          div_campos = div_campos + '<input type="date" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;">'
                        }
                        if (offlineResponde[pkmodulo]["func_det"][offlineResponde[pkmodulo]["campos_det"][x]["Nombre"]][0]["Tipo"] == 'Fecha Tiempo') {
      
                          div_campos = div_campos + '<input type="datetime-local" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;">'
                        }
                      }
                    }
                    if (offlineResponde[pkmodulo]["campos_det"][x]["TablaCampo"] == "cmpoperacion") {
      
                      div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="setTwoNumberDecimal(' + offlineResponde[pkmodulo]["func_det"][offlineResponde[pkmodulo]["campos_det"][x]["Nombre"]][0]["Decimales"] + ')" readonly="readonly" style="text-align: right;height: 25px;font-size: 11px;"> '
                    }
                    if (offlineResponde[pkmodulo]["campos_det"][x]["TablaCampo"] == "cmpconsolidado") {
      
                      div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="text-align: right;height: 25px;font-size: 11px;">'
                    }
                    if (offlineResponde[pkmodulo]["campos_det"][x]["TablaCampo"] == "cmparchivo") {
      
                      //div_campos = div_campos + '<input type="file" id="'+id_tag_detalle +'" class="form-control" value="'+ valor_campo +'" '+ readonly +' style="height: 25px;font-size: 11px;">'
                      div_campos = div_campos + '<div class="thumbnail" style="height: 160px;margin-bottom: 1px;"><div class="image view view-first"><a id="' + id_tag_detalle + '_label" href="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" target="_blank" style="font-size: 11px;"><img style="width: 100%;height: 60%;margin-left: auto;margin-right: auto; display: block;" id="' + id_tag_detalle + '_img" src="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" alt="image" value="' + valor_campo + '">' + valor_campo + '</a>'
      
                      div_campos = div_campos + '<label for="' + id_tag + '_img_file" class="btn bg-blue btn-flat margin btn-block btn-outlined" style="padding-left: 0px;padding-right: 0px;margin-bottom: 0px;">Cambiar</label>'
                      div_campos = div_campos + '<input type="file" id="' + id_tag + '_img_file" onchange="cambiar_imagen(' + id_tag + '_img)" style="display: none"></div></div>'
                    }
                    if (offlineResponde[pkmodulo]["campos_det"][x]["TablaCampo"] == "cmpnumeroaletras") {
                      div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
                    }
                    if (offlineResponde[pkmodulo]["campos_det"][x]["TablaCampo"] == "cmpdecabecera") {
      
                      div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
                    }
                    if (offlineResponde[pkmodulo]["campos_det"][x]["TablaCampo"] == "cmpelectronico") {
      
                      div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
                    }
                    if (offlineResponde[pkmodulo]["campos_det"][x]["TablaCampo"] == "cmpcondicional") {
      
                      div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
                    }
                    div_campos = div_campos + '</div></td>'
                  } else {
                    div_campos = div_campos + '<input type="hidden" id="' + id_tag_detalle + '" value="' + valor_campo + '" ' + readonly + '>'
                  }
                }
      
                div_campos = div_campos + '</tr>'
      
                ////////////////////////////subdetalle
      
                if (typeof (offlineResponde[pkmodulo]["campos_subdet"]) == "object") {
      
      
                  var largo_tabladet = 0
                  for (f = 0; f < offlineResponde[pkmodulo]["campos_subdet"].length; f++) {
                    if (offlineResponde[pkmodulo]["campos_subdet"][f]["Visible"] == "Y") {
                      largo_tabladet = largo_tabladet + parseFloat(offlineResponde[pkmodulo]["campos_subdet"][f]["largo"])
      
                    }
                  }
      
                  div_campos = div_campos + '<tr id="regdet-' + pestalla + '-' + i + '" style="background-color: #0073b7;" hidden="">'
      
                  div_campos = div_campos + '<td colspan="15"><div><div class="panel-body" style="overflow: auto;padding-top: px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;"><table class="table" id="tablaSub' + pestalla + '-' + i + '" table-hover" style="background-color: aliceblue;margin-bottom: 0px;width: ' + parseInt(largo_tabladet) + 'px"><thead>'
      
                  div_campos = div_campos + ''
                  div_campos = div_campos + '<tr><th>'
                  if (tipo != 'consulta') {
                    div_campos = div_campos + '<button type="button" onclick="massub(' + pestalla + ',' + i + ')" class="btn bg-green btn-flat margin" style="padding: 3px 9px;margin-bottom: 0px;margin-top: 0px;margin-left: -5px;">+</button>'
                  }
      
                  div_campos = div_campos + '</th>'
      
                  for (f = 0; f < offlineResponde[pkmodulo]["campos_subdet"].length; f++) {
                    if (offlineResponde[pkmodulo]["campos_subdet"][f]["Visible"] == "Y") {
                      div_campos = div_campos + '<th class="col-md-' + offlineResponde[pkmodulo]["campos_subdet"][f]["largoweb"] + '" style="padding-left: 0px;padding-right: 0px;">' + offlineResponde[pkmodulo]["campos_subdet"][f]["Descripcion"] + '</th>'
                    }
                  }
                  div_campos = div_campos + '</tr></thead><tbody>'
                  var i2 = 0;
      
                  if (offlineResponde[pkmodulo]["valores_subdet"].length > 0) {
      
                    do {
                      var subpaso = 0;
      
                      if (tipo != 'Nuevo') {
                        if (offlineResponde[pkmodulo]["valores_det"][i]['Pk' + offlineResponde[pkmodulo]["tabla_det"]["Nombre"]] == offlineResponde[pkmodulo]["valores_subdet"][i2]["PKCabecera"]) {
                          subpaso = 1
                        }
                      } else {
                        subpaso = 1
                      }
      
      
      
      
                      if (subpaso == 1) {
      
      
      
                        div_campos = div_campos + '<tr id="subf' + pestalla + '-f' + i2 + '-z' + i + '" style="background: white;"><td><div class="row"  style="padding-left: 10px;">'
      
                        if (tipo != 'consulta') {
                          div_campos = div_campos + '<button type="button" onclick="menossub(' + pestalla + ',' + i2 + ',' + i + ')" class="btn bg-red btn-flat margin" style="padding: 3px 10px;margin-right: 10px;">-</button>'
                        }
                        div_campos = div_campos + '</div></td>'
      
                        for (f = 0; f < offlineResponde[pkmodulo]["campos_subdet"].length; f++) {
      
                          valor_campo = 0;
                          if (tipo == 'Nuevo') {
                            if (offlineResponde[pkmodulo]["campos_subdet"][f]["TablaCampo"] == "cmptxtsimple") {
                              valor_campo = offlineResponde[pkmodulo]["func_subdet"][offlineResponde[pkmodulo]["campos_subdet"][f]["Nombre"]][0]["ValorPredeterminado"]
                            }
                            if (offlineResponde[pkmodulo]["campos_subdet"][f]["TablaCampo"] == "cmpnumsimple") {
                              valor_campo = offlineResponde[pkmodulo]["func_subdet"][offlineResponde[pkmodulo]["campos_subdet"][f]["Nombre"]][0]["Menor"]
                            }
                          } else {
                            valor_campo = offlineResponde[pkmodulo]["valores_subdet"][i2][offlineResponde[pkmodulo]["campos_subdet"][f]["Nombre"]]
      
                          }
      
                          id_tag_subdetalle = 'ps' + pestalla + 'qqq' + i2 + 'yyy' + i + 'www' + offlineResponde[pkmodulo]["campos_subdet"][f]["Nombre"]
                          if (offlineResponde[pkmodulo]["campos_subdet"][f]["Visible"] == "Y") {
      
                            div_campos = div_campos + '<td style="padding-left: 0px;padding-right: 5px;"><div style="width: ' + offlineResponde[pkmodulo]["campos_subdet"][f]["largo"] + 'px;">'
      
                            if (offlineResponde[pkmodulo]["campos_subdet"][f]["TablaCampo"] == "cmpnumsimple") {
                              div_campos = div_campos + '<input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_subdet(' + id_tag_subdetalle + ')" min="' + offlineResponde[pkmodulo]["func_subdet"][offlineResponde[pkmodulo]["campos_subdet"][f]["Nombre"]][0]["Menor"] + '" max="' + offlineResponde[pkmodulo]["func_subdet"][offlineResponde[pkmodulo]["campos_subdet"][f]["Nombre"]][0]["Mayor"] + '" style="text-align: right;height: 25px;font-size: 11px;" onkeypress="return solo_numero(event)">'
      
                            }
                            if (offlineResponde[pkmodulo]["campos_subdet"][f]["TablaCampo"] == "cmptxtsimple") {
                              if (offlineResponde[pkmodulo]["func_subdet"][offlineResponde[pkmodulo]["campos_subdet"][f]["Nombre"]][0]["Modificable"] == "N") {
                                readonly_int = 'readonly="readonly"'
                              }
                              div_campos = div_campos + '<input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_subdet(' + id_tag_subdetalle + ')" ' + readonly_int + ' style="height: 25px;font-size: 11px;">'
      
                            }
                            if (offlineResponde[pkmodulo]["campos_subdet"][f]["TablaCampo"] == "cmpreferenciaadjunto") {
                              if (offlineResponde[pkmodulo]["func_subdet"][offlineResponde[pkmodulo]["campos_subdet"][f]["Nombre"]][0]["Modificable"] == 'N') {
                                Moddato = 'readonly="readonly"'
                              }
                              altura_mini = 125
      
                              if (offlineResponde[pkmodulo]["func_subdet"][offlineResponde[pkmodulo]["campos_subdet"][f]["Nombre"]][0]["Tipo"] == 'Texto') {
                                if (offlineResponde[pkmodulo]["func_subdet"][offlineResponde[pkmodulo]["campos_subdet"][f]["Nombre"]][0]["Tamano"] == 'G') {
                                  div_campos = div_campos + '<textarea type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular_subdet(' + id_tag_subdetalle + ')" style="font-size: 11px;height: ' + altura_mini + 'px;">' + valor_campo + '</textarea>'
                                } else {
                                  div_campos = div_campos + '<input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular_subdet(' + id_tag_subdetalle + ')" style="height: 25px;font-size: 11px;">'
                                }
      
                              }
                              if (offlineResponde[pkmodulo]["func_subdet"][offlineResponde[pkmodulo]["campos_subdet"][f]["Nombre"]][0]["Tipo"] == 'Numero') {
      
                                div_campos = div_campos + '<input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular_subdet(' + id_tag_subdetalle + ')" style="text-align: right;height: 25px;font-size: 11px;" onkeypress="return solo_numero(event)">'
                              }
      
      
      
                            }
                            if (offlineResponde[pkmodulo]["campos_subdet"][f]["TablaCampo"] == "cmpreferencia") {
                              if (tipo == 'consulta') {
                                div_campos = div_campos + '<div class="input-group" style="width: ' + offlineResponde[pkmodulo]["campos_subdet"][f]["largo"] + 'px;"><input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' style="height: 25px;font-size: 11px;">'
                                div_campos = div_campos + '</div>'
                              } else {
      
                                div_campos = div_campos + '<div class="input-group" style="width: ' + offlineResponde[pkmodulo]["campos_subdet"][f]["largo"] + 'px;"><input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_subdet(' + id_tag_subdetalle + ')" style="width: 80%;height: 25px;font-size: 11px;" onkeypress="return runScript_subdetalle(event, ' + id_tag_subdetalle + ')">'
                                div_campos = div_campos + '<button type="button" class="btn btn-info" data-toggle="modal" data-target=".bs-example-modal-lg" onclick="buscar_referencia_subdetalle(' + id_tag_subdetalle + ' )" style="height: 25px;padding: 3px 4px;margin-top: 0px;margin-bottom: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></button></div>'
                              }
                            }
                            if (offlineResponde[pkmodulo]["campos_subdet"][f]["TablaCampo"] == "cmpoperacion") {
      
                              div_campos = div_campos + '<input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="setTwoNumberDecimal(' + offlineResponde[pkmodulo]["func_subdet"][offlineResponde[pkmodulo]["campos_subdet"][f]["Nombre"]][0]["Decimales"] + ')" readonly="readonly" style="text-align: right;height: 25px;font-size: 11px;"> '
                            }
                            if (offlineResponde[pkmodulo]["campos_subdet"][f]["TablaCampo"] == "cmpconsolidado") {
                              div_campos = div_campos + '<input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
                            }
                            if (offlineResponde[pkmodulo]["campos_subdet"][f]["TablaCampo"] == "cmpdecabecera") {
                              div_campos = div_campos + '<input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
                            }
                            if (offlineResponde[pkmodulo]["campos_subdet"][f]["TablaCampo"] == "cmpopcmultiple") {
                          
                              if (tipo != 'consulta') {
                                div_campos = div_campos + '<select class="form-control" id="' + id_tag_subdetalle + '" value="' + valor_campo + '" onchange="guardar_calcular_subdet(' + id_tag_subdetalle + ')" style="height: 25px;font-size: 11px;">'
                                for (z = 0; z < offlineResponde[pkmodulo]["func_subdet"][offlineResponde[pkmodulo]["campos_subdet"][f]["Nombre"]].length; z++) {
                                  if (valor_campo == offlineResponde[pkmodulo]["func_subdet"][offlineResponde[pkmodulo]["campos_subdet"][f]["Nombre"]][z]["Valor"]) {
                                    div_campos = div_campos + '<option selected value="' + offlineResponde[pkmodulo]["func_subdet"][offlineResponde[pkmodulo]["campos_subdet"][f]["Nombre"]][z]["Valor"] + '">' + offlineResponde[pkmodulo]["func_subdet"][offlineResponde[pkmodulo]["campos_subdet"][f]["Nombre"]][z]["Nombre"] + '</option>'
                                  } else {
                                    div_campos = div_campos + '<option value="' + offlineResponde[pkmodulo]["func_subdet"][offlineResponde[pkmodulo]["campos_subdet"][f]["Nombre"]][z]["Valor"] + '">' + offlineResponde[pkmodulo]["func_subdet"][offlineResponde[pkmodulo]["campos_subdet"][f]["Nombre"]][z]["Nombre"] + '</option>'
                                  }
                                }
                                div_campos = div_campos + '</select>'
                              } else {
                                div_campos = div_campos + '<input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;" >'
                              }
                            }
                            if (offlineResponde[pkmodulo]["campos_subdet"][f]["TablaCampo"] == "cmpfecha") {
                              tipodato = 'date'

                              if (offlineResponde[pkmodulo]["func_subdet"][offlineResponde[pkmodulo]["campos_subdet"][f]["Nombre"]][0]["Tiempo"] == 'Y') {
                                tipodato = 'datetime-local'
                              }
                              div_campos = div_campos + '<input type="' + tipodato + '" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_subdet(' + id_tag_subdetalle + ')" style="height: 25px;font-size: 11px;line-height: 7px;">'
                            }
      
                          } else {
      
                            div_campos = div_campos + '<input type="hidden" id="' + id_tag_subdetalle + '" value="' + valor_campo + '" ' + readonly + '>'
      
                          }
      
                        }
      
      
                        div_campos = div_campos + '</tr>'
      
                      }
                      i2++;
                    } while (i2 < offlineResponde[pkmodulo]["valores_subdet"].length);
                  }
      
                  ccsub_porPesta['p-' + pestalla] = (offlineResponde[pkmodulo]["valores_subdet"].length)
      
                  div_campos = div_campos + '</tbody>'
                  div_campos = div_campos + '</table></div>'
                  div_campos = div_campos + '</div></td></tr>'
                }
                ////////////////////////////subdetalle
                i--
              //} while (i < offlineResponde[pkmodulo]["valores_det"].length);
              } while (i >= 0 );
      
              cc_porPesta['p-' + pestalla] = (offlineResponde[pkmodulo]["valores_det"].length)
              div_campos = div_campos + '</tbody></table></div>'
      
      
              $('#rr' + pestalla).append(div_campos);
      
              if (offlineResponde[pkmodulo]["valores_det"].length > 3) {
                document.getElementById('divtabla' + pestalla).style.height = "500px";
      
              }
      
      
            
            }
      
            html_ingre = '<div class="box-body" style="background: white;">'
      
            html_ingre = html_ingre + '<div class="col-md-6 col-xs-12"> <div class="row">' + div_campos_abajo_izq + '</div></div>'
            html_ingre = html_ingre + '<div class="col-md-6 col-xs-12"> <div class="row">' + div_campos_abajo_der + '</div></div>'
            html_ingre = html_ingre + '</div>'
      
            $('#rr' + pestalla).append(html_ingre);
            document.getElementById('id' + pestalla).click();
      
      
      
            for (z2 = 0; z2 < offlineResponde[pkmodulo]["campos_cab"].length; z2++) {
              if (tipo == 'Nuevo') {
                if (offlineResponde[pkmodulo]["campos_cab"][z2]["TablaCampo"] == "cmpreferencia") {
                  id_tag = 'p' + pestalla + 'zzz' + offlineResponde[pkmodulo]["campos_cab"][z2]["Nombre"]
                  
                  if (offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][z2]["Nombre"]][0][0]["predeterminado_valor"] != '') {
                    id_tag = 'p' + pestalla + 'zzz' + offlineResponde[pkmodulo]["campos_cab"][z2]["Nombre"]
      
                    if (offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][z2]["Nombre"]][0][0]["Tipo_Predeterminado"] == '1') {
                      id_tag_detalle_pret = 'p' + pestalla + 'zzz' + offlineResponde[pkmodulo]["func_cab"][offlineResponde[pkmodulo]["campos_cab"][z2]["Nombre"]][0][0]["predeterminado"]
                      document.getElementById(id_tag).value = document.getElementById(id_tag_detalle_pret).value
                    }
                    buscar_referencia_cabecera_enter(document.getElementById(id_tag))
                  }else{
                    if(document.getElementById(id_tag).value != ''){
                      buscar_referencia_cabecera_enter(document.getElementById(id_tag))
                    }
                  }
                }
              }
            }
      
            for (z2 = 0; z2 < offlineResponde[pkmodulo]["campos_det"].length; z2++) {
              if (tipo == 'Nuevo') {
                if (offlineResponde[pkmodulo]["campos_det"][z2]["TablaCampo"] == "cmpreferencia") {
                  id_tag_detalle_pret = 'pd' + pestalla + 'fff' + 0 + 'ccc' + offlineResponde[pkmodulo]["func_det"][offlineResponde[pkmodulo]["campos_det"][z2]["Nombre"]][0][0]["predeterminado"]
                  
                  if (offlineResponde[pkmodulo]["func_det"][offlineResponde[pkmodulo]["campos_det"][z2]["Nombre"]][0][0]["predeterminado_valor"] != '') {
                    id_tag_detalle = 'pd' + pestalla + 'fff' + 0 + 'ccc' + offlineResponde[pkmodulo]["campos_det"][z2]["Nombre"]
                    if (offlineResponde[pkmodulo]["func_det"][offlineResponde[pkmodulo]["campos_det"][z2]["Nombre"]][0][0]["Tipo_Predeterminado"] == '1') {
                      id_tag_detalle_pret = 'pd' + pestalla + 'fff' + 0 + 'ccc' + offlineResponde[pkmodulo]["func_det"][offlineResponde[pkmodulo]["campos_det"][z2]["Nombre"]][0][0]["predeterminado"]
                      if(document.getElementById(id_tag_detalle_pret).value != '0'){
                        document.getElementById(id_tag_detalle).value = document.getElementById(id_tag_detalle_pret).value
                      }                  
                    }
                    buscar_referencia_detalle_enter(document.getElementById(id_tag_detalle))
                  }else{
                    if(document.getElementById(id_tag_detalle).value != ''){
                      buscar_referencia_detalle_enter(document.getElementById(id_tag_detalle))
                    }
                  }
                }
              }
            }
      
            //autoccerar_pestana(pestalla)

            if(origen == 1 && dict_pestalla[id_dic]["plantilla_html"].length> 0){
              imprimir_elemento(pestalla, 0)
              registro(offlineResponde[pkmodulo]["tabla_cab"]["PkModulo"],0,0,pestalla,0,0)
            }else{
              if (tipo == 'consulta') {
                if(origen == 1){
                  autoccerar_pestana(pestalla, 60*2)
                }else{
                  autoccerar_pestana(pestalla, 60*5)
                }
                
              }
            }
          
      }

      /////////////////////////////////////BLoque Offline //////////////////////////////
    }
}
  
function regitro_resp(Response, tipo, pestalla, pkmodulo, pkregistro, origen, t_clave, t_traspasos){
      
      
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
          if(dict_pestalla[id_dic]["plantilla_pdf"]['plantillasfirmas'] == 'Si'){
            adir = dict_pestalla[id_dic]['tabla_cab']['Nombre']+ dict_pestalla[id_dic]['tabla_cab']['PkModulo'] + '_' + dict_pestalla[id_dic]['valores_cab'][0]['Pk'+dict_pestalla[id_dic]['tabla_cab']['Nombre']] + dict_pestalla[id_dic]["plantilla_pdf"]['plantillasMain'][0]['Descripcion']
            div_botones = div_botones + '<a href="/media/firma/PDF/' + web_Id_empresa + '/'+adir+'" target="_blank" style="font-size: 11px;">'
            div_botones = div_botones + '<button type="button" class="btn bg-blue btn-flat margin"><span>' + dict_pestalla[id_dic]["plantilla_pdf"]["plantillasMain"][dd]['Nombre'] + '</span></button>'
            div_botones = div_botones + '</a>'

            
          }else{

            div_botones = div_botones + '<button type="button" onclick="pdf_elemento(' + Response["dev_pestalla"] + ', ' + dd + ')" class="btn bg-blue btn-flat margin"><span>' + dict_pestalla[id_dic]["plantilla_pdf"]["plantillasMain"][dd]['Nombre'] + '</span></button>'
            dict_pestalla[id_dic]['tabla_cab']['Nombre']+ dict_pestalla[id_dic]['tabla_cab']['PkModulo'] + '_' + dict_pestalla[id_dic]['valores_cab'][0]['Pk'+dict_pestalla[id_dic]['tabla_cab']['Nombre']] + dict_pestalla[id_dic]["plantilla_pdf"]['plantillasMain'][0]['Descripcion']
            
            
          }

        }
      }

      for (dd = 0; dd < dict_pestalla[id_dic]["plantilla_html"].length; dd++) {

        div_botones = div_botones + '<button type="button" onclick="imprimir_elemento(' + Response["dev_pestalla"] + ', ' + dd + ')" class="btn bg-blue btn-flat margin"><span>' + dict_pestalla[id_dic]["plantilla_html"][dd]['Nombre'] + '</span></button>'

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


      //div_botones =div_botones +'<button type="button" onclick="excell_elemento(' + pestalla + ')" class="btn bg-blue btn-flat margin"><span>Excell</span></button>'
      if (origen == '1') {
        div_botones = div_botones + '<button class="btn bg-blue btn-flat margin" onclick="registro(' + Response["tabla_cab"]["PkModulo"] + ',0,0,' + Response["dev_pestalla"] + ',0,0);cerrar_elemento(' + Response["dev_pestalla"] + ')">Nuevo</span></button>'

      }

      if (tipo != 'Nuevo') { 
        for (x = 0; x < Response["estados"].length; x++) {
          if (Response["estados"][x]["estado_inicial"] == Response["valores_cab"][0][Response["estados"][x]["c_estado"]]) {
            div_botones = div_botones + '<button class="' + Response["estados"][x]["color"] + '" onclick="cambio_estado(' + Response["tabla_cab"]["PkModulo"] + ',' + Response["valores_cab"][0][Response["estados"][x]["pkregistro"]] + ',' + Response["estados"][x]["pkweb_estados_doc"] + ', ' + Response["dev_pestalla"] + ')">' + Response["estados"][x]["display"] + '</span></button>'
          }
          if (Response["estados"][x]["estado_inicial"] == '' && Response["estados"][x]["estado_final"] != Response["valores_cab"][0][Response["estados"][x]["c_estado"]]) {
            div_botones = div_botones + '<button class="' + Response["estados"][x]["color"] + '" onclick="cambio_estado(' + Response["tabla_cab"]["PkModulo"] + ',' + Response["valores_cab"][0][Response["estados"][x]["pkregistro"]] + ',' + Response["estados"][x]["pkweb_estados_doc"] + ', ' + Response["dev_pestalla"] + ')">' + Response["estados"][x]["display"] + '</span></button>'
            
          }
        }
      }
      div_botones = div_botones + '<button class="btn bg-red btn-flat margin" id="btnAutocerrar' + Response["dev_pestalla"] + '" onclick="parar_autoccerar_pestana(' + Response["dev_pestalla"] + ')">Autocerrar</button>'

    }
    else {
      if (tipo == 'Nuevo') {
        disparador = 'Guardar Registro Nuevo'
        //div_botones =div_botones +'<button type="button" id="btn_grabar_'+pestalla+'" onclick="this.disabled=true;click_val(1);grabar_elemento(' + Response["dev_pestalla"] + ',0)" class="btn bg-green btn-flat margin"><span>Grabar</span></button>'
        div_botones = div_botones + '<button type="button" id="btn_grabar_' + pestalla + '" onclick="abrir_default_grabando();grabar_elemento(' + Response["dev_pestalla"] + ',0)" class="btn bg-green btn-flat margin"><span>Grabar</span></button>'



      } else {
        disparador = 'Modificar Registro'
        //div_botones =div_botones +'<button  type="button" id="btn_mod_'+pestalla+'" onclick="this.disabled=true;click_val(1);grabar_elemento(' + Response["dev_pestalla"] + ',1)" class="btn bg-green btn-flat margin"><span>Grabar</span></button>'
        div_botones = div_botones + '<button  type="button" id="btn_mod_' + pestalla + '" onclick="abrir_default_grabando();grabar_elemento(' + Response["dev_pestalla"] + ',1)" class="btn bg-green btn-flat margin"><span>Grabar</span></button>'
        
        if (Response["acc_rapido"]['Nuevo'] == 'Si') {
          div_botones = div_botones + '<button class="btn bg-blue btn-flat margin" onclick="registro(' + Response["tabla_cab"]["PkModulo"] + ',' + Response["t_pkregistro"] + ',0,' + Response["dev_pestalla"] + ',0,0);cerrar_elemento(' + Response["dev_pestalla"] + ')">Copiar en Nuevo</span></button>'
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
      if(web_esAdmin == 'Y'){              
        div_botones = div_botones + '<button type="button" onclick="validar_registro(' + Response["dev_pestalla"] + ')" class="btn bg-yellow btn-flat margin"><span>Validar</span></button>'
      }

      //div_botones =div_botones +'<button type="button" onclick="nuevo_elemento(' + Response["dev_pestalla"] + ')" class="btn bg-blue btn-flat margin"><span>Nuevo</span></button>'
      readonly = ''
    }

    div_botones = div_botones + '<button type="button" onclick="cerrar_elemento(' + Response["dev_pestalla"] + ')" class="btn bg-gray btn-flat margin"><span>Cerrar</span></button>'

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


        if (Response["valores_cab"].length > 0) {

          if (Response["campos_cab"][x]["TablaCampo"] == 'cmpnumsimple' || Response["campos_cab"][x]["TablaCampo"] == 'cmptxtsimple' || Response["campos_cab"][x]["TablaCampo"] == 'cmpreferencia' || Response["campos_cab"][x]["TablaCampo"] == 'cmpreferenciaadjunto') {
            if (Response["campos_cab"][x]["TablaCampo"] == 'cmptxtsimple') {
              if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Modificable"] == 'N') {
                valor_campo = Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["ValorPredeterminado"]
              } else {
                valor_campo = Response["valores_cab"][0][Response["campos_cab"][x]["Nombre"]]
              }
            } else {
              valor_campo = Response["valores_cab"][0][Response["campos_cab"][x]["Nombre"]]
            }



          }

        }

        if (Response["datos_edocs"].length > 0) {
          for (var i = 0; i < Response['datos_edocs'][1].length; i++) {
            if (Response['datos_edocs'][1][i]['campo'] == Response["campos_cab"][x]["Nombre"] && Response['datos_edocs'][1][i]['pkestructura'] == Response["campos_cab"][x]["PkEstructura"]) {
              if (Response["campos_cab"][x]["TablaCampo"] == "cmpfecha") {
                if(Response['datos_edocs'][0][Response['datos_edocs'][1][i]['xml_cab']][Response['datos_edocs'][1][i]['xml']] != undefined){
                  var now = new Date(Response['datos_edocs'][0][Response['datos_edocs'][1][i]['xml_cab']][Response['datos_edocs'][1][i]['xml']]);
                  now.addDays(1)
                  if(now.format("H:i:s") == '00:00:00'){
                    valor_campo = now.format("Y-m-d")
                  }else{
                    valor_campo = now.format("Y-m-d") + 'T' + now.format("H:i:s")
                  }   
                }
              } else {
                if(Response['datos_edocs'][0][Response['datos_edocs'][1][i]['xml_cab']][Response['datos_edocs'][1][i]['xml']] != undefined){
                  valor_campo = Response['datos_edocs'][0][Response['datos_edocs'][1][i]['xml_cab']][Response['datos_edocs'][1][i]['xml']]
                }
              }
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
        var_Mayusculas = ''
        if (Response["campos_cab"][x]["estilo"] == "Mayusculas") {
          var_Mayusculas = 'text-transform: uppercase;'
        }
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
          if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Largo"] > 100) {
            div_c_t = div_c_t + '<textarea type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' ' + readonly_int + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 45px;font-size: 11px;' + var_Mayusculas + '">' + valor_campo + '</textarea>'
          } else {
            div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' ' + readonly_int + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 25px;font-size: 11px;' + var_Mayusculas + '">'
          }
        }
        if (Response["campos_cab"][x]["TablaCampo"] == "cmpnumsimple") {

          div_c_t = div_c_t + '<input type="number" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' min="' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Menor"] + '" max="' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Mayor"] + '" onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="text-align: right;height: 25px;font-size: 11px;" onkeypress="return solo_numero(event)">'
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
            for (z = 0; z < Response["func_cab"][Response["campos_cab"][x]["Nombre"]].length; z++) {

              if (valor_campo == Response["func_cab"][Response["campos_cab"][x]["Nombre"]][z]["Valor"]) {
                valor_campo = Response["func_cab"][Response["campos_cab"][x]["Nombre"]][z]["Nombre"]

                div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 25px;font-size: 11px;">'

              }
            }

          }
        }
        if (Response["campos_cab"][x]["TablaCampo"] == "cmpsistema") {
          if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["PkId"] == 2) {
            div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" readonly="readonly" style="height: 25px;font-size: 11px;">'
          }

          if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["PkId"] == 1) {
            div_c_t = div_c_t + '<input type="datetime-local" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" readonly="readonly" style="height: 25px;font-size: 11px;line-height: 7px;">'
          }


          if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["PkId"] == 4) {

            div_c_t = div_c_t + '<select id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" readonly="readonly" style="height: 25px;font-size: 11px;">'
            for (zxz = 0; zxz < web_user.length; zxz++) {
              if (web_user[zxz] == valor_campo) {
                div_c_t = div_c_t + '<option selected>' + web_user[zxz] + '</option>'

              } else {
                div_c_t = div_c_t + '<option>' + web_user[zxz] + '</option>'

              }
            }
            div_c_t = div_c_t + '</select>'

          }
        }
        if (Response["campos_cab"][x]["TablaCampo"] == "cmpformuladetalle") {

          div_c_t = div_c_t + '<input type="number" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" readonly="readonly" onchange="guardar_calcular(' + ID_TAG + ' , 0 )" style="text-align: right;height: 25px;font-size: 11px;">'
        }
        if (Response["campos_cab"][x]["TablaCampo"] == "cmpfecha") {
          tipodato = 'date'
          Modficable_amdin = ''
          if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Tiempo"] == 'Y') {
            tipodato = 'datetime-local'
          }
          if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["FechaActual"] == 'A') {
            if (web_esAdmin == 'Y') {
              Modficable_amdin = ''
            }else{
              Modficable_amdin = 'readonly="readonly"'
            }
            

          }
          div_c_t = div_c_t + '<input type="' + tipodato + '" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' ' + Modficable_amdin +  ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 25px;font-size: 11px;line-height: 7px;">'
        }
        if (Response["campos_cab"][x]["TablaCampo"] == "cmpreferencia") {
          div_c_t = div_c_t + '<div class="input-group input-group-sm" style="width: 100%;">'

          readonlyRef = ''
          if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["Escribir"] == 'No') { readonlyRef = 'readonly="readonly"' }

          if (tipo != 'consulta') {


            if (tipo == 'modificar') {
              if (Response["campos_cab"][x]["Modificable"] == 'No') {
                div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + (Response["campos_cab"][x]["largoweb"] - 1) + '" value="' + valor_campo + '" ' + readonly + ' ' + readonlyRef + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 25px;font-size: 11px;' + var_Mayusculas + '" onkeypress="return runScript(event, ' + ID_TAG + ')" >'
              } else {
                if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["pkmodulo_ingreso"] != 0) {
                  div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + (Response["campos_cab"][x]["largoweb"] - 1) + '" value="' + valor_campo + '" ' + readonly + ' ' + readonlyRef + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="width: 70%;height: 25px;font-size: 11px;' + var_Mayusculas + '" onkeypress="return runScript(event, ' + ID_TAG + ')" >'
                  div_c_t = div_c_t + '<button type="button" class="btn btn-info" data-toggle="modal" data-target=".bs-example-modal-lg" onclick="buscar_referencia_cabecera(' + ID_TAG + ' )"style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></button>'


                  div_c_t = div_c_t + '<button type="button" class="btn btn-info"  onclick="registro(' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["pkmodulo_ingreso"] + ',0,0,-1,0,0)" style="height: 25px;padding: 3px 4px;"><i class="fa fa-plus"></i></button>'
                } else {
                  div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + (Response["campos_cab"][x]["largoweb"] - 1) + '" value="' + valor_campo + '" ' + readonly + ' ' + readonlyRef + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="width: 85%;height: 25px;font-size: 11px;' + var_Mayusculas + '" onkeypress="return runScript(event, ' + ID_TAG + ')" >'
                  div_c_t = div_c_t + '<button type="button" class="btn btn-info" data-toggle="modal" data-target=".bs-example-modal-lg" onclick="buscar_referencia_cabecera(' + ID_TAG + ' )"style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></button>'

                }
              }



            } else {
              if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["pkmodulo_ingreso"] != 0) {
                div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + (Response["campos_cab"][x]["largoweb"] - 1) + '" value="' + valor_campo + '" ' + readonly + ' ' + readonlyRef + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="width: 65%;height: 25px;font-size: 11px;" onkeypress="return runScript(event, ' + ID_TAG + ')" >'
                div_c_t = div_c_t + '<button type="button" class="btn btn-info" data-toggle="modal" data-target=".bs-example-modal-lg" onclick="buscar_referencia_cabecera(' + ID_TAG + ' )"style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></button>'


                div_c_t = div_c_t + '<button type="button" class="btn btn-info"  onclick="registro(' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["pkmodulo_ingreso"] + ',0,0,-1,0,0)" style="height: 25px;padding: 3px 4px;"><i class="fa fa-plus"></i></button>'
              } else {
                div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + (Response["campos_cab"][x]["largoweb"] - 1) + '" value="' + valor_campo + '" ' + readonly + ' ' + readonlyRef + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="width: 85%;height: 25px;font-size: 11px;" onkeypress="return runScript(event, ' + ID_TAG + ')" >'
                div_c_t = div_c_t + '<button type="button" class="btn btn-info" data-toggle="modal" data-target=".bs-example-modal-lg" onclick="buscar_referencia_cabecera(' + ID_TAG + ' )"style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></button>'

              }
            }



          } else {
            div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + (Response["campos_cab"][x]["largoweb"] - 1) + '" value="' + valor_campo + '" ' + readonly + ' ' + readonlyRef + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="width: 85%;height: 25px;font-size: 11px;"" onkeypress="return runScript(event, ' + ID_TAG + ')" >'
            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["pkmod_consul"] != '0') {
              div_c_t = div_c_t + '<button type="button" class="btn btn-info" onclick="registro(' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["pkmod_consul"] + ', ' + Response["valores_cab"][0][Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["campo_fk"]] + ', 2, -2, 0,0)" style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;"><span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span></button>'
            }


          }

          div_c_t = div_c_t + '</div>'
        }
        if (Response["campos_cab"][x]["TablaCampo"] == "cmpreferenciaadjunto") {

          if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Tipo"] == 'Imagen') {
            
            div_c_t = div_c_t + '<div class="thumbnail" style="height: 160px;margin-bottom: 1px;"><div class="image view view-first"><a id="' + ID_TAG + '_label" href="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" target="_blank" style="font-size: 11px;"><img style="width: 100%;height: 60%;margin-left: auto;margin-right: auto; display: block;" id="' + ID_TAG + '_img" src="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" alt="image" value="' + valor_campo + '">' + valor_campo + '</a>'

            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Modificable"] == 'S') {
              div_c_t = div_c_t + '<label for="' + ID_TAG + '_img_file" class="btn bg-blue btn-flat margin btn-block btn-outlined" style="padding-left: 0px;padding-right: 0px;margin-bottom: 0px;">Cambiar</label>'  
              div_c_t = div_c_t + '<input type="file" id="' + ID_TAG + '_img_file" onchange="cambiar_imagen(' + ID_TAG + '_img)" style="display: none">'  
            }
            
            div_c_t = div_c_t + '</div></div>'
            



          }
          else {

            
            Moddato = ''
            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Modificable"] == 'N') {
              Moddato = 'readonly="readonly"'
            }
            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Tipo"] == 'Texto') {

              if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Tamano"] == 'G') {

                div_c_t = div_c_t + '<textarea type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 45px;font-size: 11px;' + var_Mayusculas + '">' + valor_campo + '</textarea>'

              } else {
                div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="height: 25px;font-size: 11px;' + var_Mayusculas + '">'
              }


            }
            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Tipo"] == 'Numero') {
              div_c_t = div_c_t + '<input type="number" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="text-align: right;height: 25px;font-size: 11px;" onkeypress="return solo_numero(event)">'

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

          div_c_t = div_c_t + '<input type="number" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' onchange="setTwoNumberDecimal(' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Decimales"] + ')" readonly="readonly" onchange="guardar_calcular(' + ID_TAG + ', 0 )" style="text-align: right;height: 25px;font-size: 11px;" >'
        }
        if (Response["campos_cab"][x]["TablaCampo"] == "cmpconsolidado") {

          div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" onchange="guardar_calcular(' + ID_TAG + ', 0)" style="height: 25px;font-size: 11px;">'
        }
        if (Response["campos_cab"][x]["TablaCampo"] == "cmpcondicional") {

          div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" onchange="guardar_calcular(' + ID_TAG + ', 0)" style="height: 25px;font-size: 11px;text-align: right;padding-right: 14px;">'
        }
        if (Response["campos_cab"][x]["TablaCampo"] == "cmparchivo") {
          if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Ruta"] == 'Dibujo') {

            
            div_c_t = div_c_t + '<div class="col-6" style="height: 100px;margin-bottom: 1px;">'
            div_c_t = div_c_t + '<canvas id="' + ID_TAG + '_canvas"  width="250" height="80" style="position:absolute;top:10%;left:10%;border:2px solid;margin-top: 6px;""></canvas>'
            div_c_t = div_c_t + '</div>'


            div_c_t = div_c_t + '<div class="row">'
            
            div_c_t = div_c_t + '<button class="btn bg-blue btn-flat margin btn-block btn-outlined" style="padding-left: 0px;padding-right: 0px;margin-bottom: 0px;" onclick="Iniciar_firma(' + ID_TAG + '_canvas)">Firmar</button>'
            div_c_t = div_c_t + '<button class="btn bg-yellow btn-flat margin btn-block btn-outlined" style="padding-left: 0px;padding-right: 0px;margin-bottom: 0px;" onclick="Limpiar_firma(' + ID_TAG + '_canvas)">Limpiar</button>'
            div_c_t = div_c_t + '<button class="btn bg-green btn-flat margin btn-block btn-outlined" style="padding-left: 0px;padding-right: 0px;margin-bottom: 0px;" onclick="Grabar_firma(' + ID_TAG + '_canvas,' + ID_TAG + '_img)">Grabar</button>'
            div_c_t = div_c_t + '</div>'

            div_c_t = div_c_t + '<div class="thumbnail">'


            div_c_t = div_c_t + '<div class="image view view-first">'
            div_c_t = div_c_t + '<a id="' + ID_TAG + '_label" href="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" target="_blank" style="font-size: 11px;">'
            div_c_t = div_c_t + '<img style="width: 100%;height: 60%;margin-left: auto;margin-right: auto; display: block;" id="' + ID_TAG + '_img" src="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" alt="image" value="' + valor_campo + '">'
            div_c_t = div_c_t + valor_campo + '</a>'


            // div_c_t = div_c_t + '<input type="file" id="' + ID_TAG + '_img_file" onchange="cambiar_imagen(' + ID_TAG + '_img)" style="display: none">'

            div_c_t = div_c_t + '</div></div>'
            
            
          }else{
            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Ruta"] == 'PdfFirma') {
            //div_c_t = div_c_t + '<div class="thumbnail" style="height: 160px;margin-bottom: 1px;"><div class="image view view-first"><a id="' + ID_TAG + '_label" href="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" target="_blank" style="font-size: 11px;"><img style="width: 100%;height: 60%;margin-left: auto;margin-right: auto; display: block;" id="' + ID_TAG + '_img" src="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" alt="image" value="' + valor_campo + '">' + valor_campo + '</a>'
            div_c_t = div_c_t + '<div class="thumbnail" style="height: 160px;margin-bottom: 1px;"><div class="image view view-first"><a id="' + ID_TAG + '_label" href="/' + valor_campo + '" target="_blank" style="font-size: 11px;"><img style="width: 100%;height: 60%;margin-left: auto;margin-right: auto; display: block;" id="' + ID_TAG + '_img" src="/' + valor_campo + '" alt="image" value="' + valor_campo + '">' + valor_campo + '</a>'
              
            div_c_t = div_c_t + '<input type="file" id="' + ID_TAG + '_img_file" onchange="cambiar_imagen(' + ID_TAG + '_img)" style="display: none"></div></div>'
            if (tipo != 'consulta') {
              div_c_t = div_c_t + '<label for="' + ID_TAG + '_img_file" class="btn bg-blue btn-flat margin btn-block btn-outlined" style="padding-left: 0px;padding-right: 0px;margin-bottom: 0px;display: none">Cambiar</label>'
            }


            }else{

              //div_c_t = div_c_t + '<div class="thumbnail" style="height: 160px;margin-bottom: 1px;"><div class="image view view-first"><a id="' + ID_TAG + '_label" href="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" target="_blank" style="font-size: 11px;"><img style="width: 100%;height: 60%;margin-left: auto;margin-right: auto; display: block;" id="' + ID_TAG + '_img" src="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" alt="image" value="' + valor_campo + '">' + valor_campo + '</a>'
              div_c_t = div_c_t + '<div class="thumbnail" style="height: 160px;margin-bottom: 1px;"><div class="image view view-first"><a id="' + ID_TAG + '_label" href="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" target="_blank" style="font-size: 11px;"><img style="width: 100%;height: 130px;margin-left: auto;margin-right: auto; display: block;" id="' + ID_TAG + '_img" src="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" alt="image" value="' + valor_campo + '">' + valor_campo + '</a>'

              div_c_t = div_c_t + '<input type="file" id="' + ID_TAG + '_img_file" onchange="cambiar_imagen(' + ID_TAG + '_img)" style="display: none"></div></div>'
              if (tipo != 'consulta') {
                div_c_t = div_c_t + '<label for="' + ID_TAG + '_img_file" class="btn bg-blue btn-flat margin btn-block btn-outlined" style="padding-left: 0px;padding-right: 0px;margin-bottom: 0px;">Cambiar</label>'
              }
              
            }
            
          }


        }
        if (Response["campos_cab"][x]["TablaCampo"] == "cmpnumeroaletras") {

          div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
        }
        if (Response["campos_cab"][x]["TablaCampo"] == "cmpdecabecera") {

          div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
        }
        if (Response["campos_cab"][x]["TablaCampo"] == "cmpelectronico") {

          div_c_t = div_c_t + '<div class="input-group input-group-sm" style="width: 100%;">'

          if (valor_campo.toString().length > 5){
            div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px; width: 70%;">'

            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["Tipo"] == 'Factura') {
              div_c_t = div_c_t + '<a href="/e_docs/Facturas/'+ valor_campo +'" target="blank"> '
            }
            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["Tipo"] == 'Retencion' || Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["Tipo"] == 'RetencionV2') {
              div_c_t = div_c_t + '<a href="/e_docs/Retenciones/'+ valor_campo +'" target="blank"> '
            }
            
            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["Tipo"] == 'Nota credito') {
              div_c_t = div_c_t + '<a href="/e_docs/Credito/'+ valor_campo +'" target="blank"> '
            }
            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["Tipo"] == 'Guia remision') {
              div_c_t = div_c_t + '<a href="/e_docs/Guia/'+ valor_campo +'" target="blank"> '
            }
            div_c_t = div_c_t + '<span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></a>'
          }else{
            div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px; width: 100%;">'

          }

          div_c_t = div_c_t + '</div>'


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

        div_campos = '<div id="divtabla' + Response["pestalla"] + '" class="box-body tableFixHead" style="background: white; overflow: auto;overflow-y: auto;padding-top: 0px; height: 100%;"><table id="tabla' + Response["pestalla"] + '" class="table table-striped" style="width: ' + parseInt(largo_tabla) + 'px;overflow-x:auto;font-size: 11px;background: white;"><thead><tr><th style="width: 20px;padding-left: 0px;"> </th>'
      } else {
        div_campos = '<div id="divtabla' + Response["pestalla"] + '" class="box-body tableFixHead" style="background: white; overflow: auto;overflow-y: auto;padding-top: 0px; height: 100%;"><table id="tabla' + Response["pestalla"] + '" class="table table-striped" style="width: ' + parseInt(largo_tabla) + 'px;overflow-x:auto;font-size: 11px;background: white;"><thead><tr><th style="width: 20px;">'
        div_campos = div_campos + '<div class="row" style="margin-left: 0px;height: 30px;"><button type="button" onclick="mas(' + Response["pestalla"] + ')" class="btn bg-green btn-flat margin" style="padding: 3px 8px;margin-bottom: 0px;margin-top: 0px;">+</button>'

        div_campos = div_campos + '<button type="button" onclick="ampliar(' + Response["pestalla"] + ', this)" class="btn bg-blue btn-flat margin" style="padding: 3px 4px;"><span class="glyphicon glyphicon-resize-small"></span></button>'
        if (Response['exportable'] == "Si") {
          div_campos = div_campos + '<button type="button" onclick="det_rapido(' + Response["pestalla"] + ')" class="btn bg-yellow btn-flat margin" style="padding: 3px 4px;margin-bottom: 0px;margin-top: 0px;" data-toggle="modal" data-target="#modal-default_wait"><i class="fa fa-fw fa-file-excel-o"></i></button>'
        }
        div_campos = div_campos + '</div></th>'
      }


      for (x = 0; x < Response["campos_det"].length; x++) {
        if (Response["campos_det"][x]["Visible"] == "Y") {
          //div_campos = div_campos + '<th class="col-md-' + Response["campos_det"][x]["largoweb"] + '" style="width: ' + Response["campos_det"][x]["largo"] + 'px;">' + Response["campos_det"][x]["Descripcion"] + '</th>'

        if(Response["campos_det"][x]['TablaCampo'] == 'cmpnumsimple' || Response["campos_det"][x]['TablaCampo'] == 'cmpformuladetalle' || Response["campos_det"][x]['TablaCampo'] == 'cmpoperacion' || Response["campos_det"][x]['TablaCampo'] == 'cmpconsolidado'){  
          div_campos = div_campos + '<th class="col-md-' + Response["campos_det"][x]["largoweb"] + '" style="padding-left: 5px;padding-right: 5px;text-align: right;">' + Response["campos_det"][x]["Descripcion"] + '</th>'

        }else{
          if(Response["campos_det"][x]['TablaCampo'] == 'cmpreferenciaadjunto'){

            if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Tipo"] == 'Numero') {
              div_campos = div_campos + '<th class="col-md-' + Response["campos_det"][x]["largoweb"] + '" style="padding-left: 5px;padding-right: 5px;text-align: right;">' + Response["campos_det"][x]["Descripcion"] + '</th>'
            }else{
              div_campos = div_campos + '<th class="col-md-' + Response["campos_det"][x]["largoweb"] + '" style="padding-left: 5px;padding-right: 5px;">' + Response["campos_det"][x]["Descripcion"] + '</th>'
            }

          }else{
            div_campos = div_campos + '<th class="col-md-' + Response["campos_det"][x]["largoweb"] + '" style="padding-left: 5px;padding-right: 5px;">' + Response["campos_det"][x]["Descripcion"] + '</th>'

          }
        }




        }
      }
      div_campos = div_campos + '</tr></thead><tbody>'
      //var i = 0;

      var i = Response["valores_det"].length-1;
      if(i == -1){
        i = 0
      }
      do {
        div_campos = div_campos + '<tr id="f' + Response["pestalla"] + '-f' + i + '" style="background: white;"><td><div class="row" style="padding-left: 15px;width: 85px;">'
        if (tipo != 'consulta') {
          div_campos = div_campos + '<button type="button" onclick="menos(' + Response["pestalla"] + ',' + i + ', 0)" class="btn bg-red btn-flat margin" style="padding: 3px 10px;">-</button>'
        }
        if (typeof (Response["campos_subdet"]) == "object") {
          //div_campos = div_campos + '<a class="btn btn-info" style="padding: 2px 2px; margin-right: 0px; margin-left: 0px;" ><span class="glyphicon glyphicon-resize-small" aria-hidden="true"></span></a>'

          div_campos = div_campos + '<button type="button" onclick="abrirdetalle(' + Response["pestalla"] + ', ' + i + ' )" id="regbtn_' + Response["pestalla"] + '_' + i + '" class="btn bg-blue btn-flat margin" style="padding: 3px 4px;"><span class="glyphicon glyphicon-resize-full"></span></button>'
        }


        div_campos = div_campos + '</div></td>'

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

            if (Response["valores_det"].length > 0) {
              valor_campo = Response["valores_det"][i][Response["campos_det"][x]["Nombre"]]
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

              if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["PkId"] == 4) {

                div_campos = div_campos + '<select id="' + id_tag_detalle + '" class="form-control value="' + valor_campo + '" readonly="readonly" style="height: 25px;font-size: 11px;" onchange="guardar_calcular_det(' + id_tag_detalle + ')">'
                for (zxz = 0; zxz < web_user.length; zxz++) {
                  if (web_user[zxz] == valor_campo) {
                    div_campos = div_campos + '<option selected>' + web_user[zxz] + '</option>'
  
                  } else {
                    div_campos = div_campos + '<option>' + web_user[zxz] + '</option>'
  
                  }
                }
                div_campos = div_campos + '</select>'
  
              }

            }
            if (Response["campos_det"][x]["TablaCampo"] == "cmpformuladetalle") {

              div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" readonly="readonly" onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;text-align: right;">'
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
                div_campos = div_campos + '<div class="input-group" style="width: ' + Response["campos_det"][x]["largo"] + 'px;"><input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;" onkeypress="return runScript_detalle(event, ' + id_tag_detalle + ')">'
                div_campos = div_campos + '</div>'
              } else {

                div_campos = div_campos + '<div class="input-group" style="width: ' + Response["campos_det"][x]["largo"] + 'px;"><input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="width: 75%;height: 25px;font-size: 11px;" onkeypress="return runScript_detalle(event, ' + id_tag_detalle + ')">'
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
                if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Modificable"] == 'N') {
                  Moddato = 'readonly="readonly"'
                }

                widt_clave = ''
                if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["TieneClave"] == 'Si') {
                  pre_adjunto = '<div class="input-group" style="width: 100%;">'
                  clave_adjunto = '<button class="btn btn-warning" data-toggle="modal" data-target="#modal-default_permiteCambio" onclick="ponerdatos_modal_cambio(\'' + id_tag_detalle +'\', \'' + Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Clave"] +'\')" style="height: 25px;padding: 3px 4px;margin-top: 0px;margin-bottom: 0px;"><span class="fa fa-lock" aria-hidden="true"></span></button>'
                  post_adjunto = '</div>'
                  widt_clave = 'width: 80%;'

                }else{
                  pre_adjunto = ''
                  clave_adjunto = ''
                  post_adjunto = ''
                }
                div_campos = div_campos  + pre_adjunto

                if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Tipo"] == 'Texto') {
                  if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Tamano"] == 'G') {
                    div_campos = div_campos + '<textarea type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="font-size: 11px;height: ' + altura_mini + 'px;'+widt_clave+'">' + valor_campo + '</textarea>'
                  } else {
                    div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;'+widt_clave+'">'
                  }

                }
                if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Tipo"] == 'Numero') {

                  div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="text-align: right;height: 25px;font-size: 11px;'+widt_clave+'" onkeypress="return solo_numero(event)">'
                }
                if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Tipo"] == 'Fecha') {

                  div_campos = div_campos + '<input type="date" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;">'
                }
                if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Tipo"] == 'Fecha Tiempo') {

                  div_campos = div_campos + '<input type="datetime-local" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;">'
                }
                div_campos =  div_campos + clave_adjunto + post_adjunto
              }
            }
            if (Response["campos_det"][x]["TablaCampo"] == "cmpoperacion") {

              div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="setTwoNumberDecimal(' + Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Decimales"] + ')" readonly="readonly" style="text-align: right;height: 25px;font-size: 11px;"> '
            }
            if (Response["campos_det"][x]["TablaCampo"] == "cmpconsolidado") {

              div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="text-align: right;height: 25px;font-size: 11px;">'
            }
            if (Response["campos_det"][x]["TablaCampo"] == "cmparchivo") {

              //div_campos = div_campos + '<input type="file" id="'+id_tag_detalle +'" class="form-control" value="'+ valor_campo +'" '+ readonly +' style="height: 25px;font-size: 11px;">'
              div_campos = div_campos + '<div class="thumbnail" style="height: 160px;margin-bottom: 1px;"><div class="image view view-first"><a id="' + id_tag_detalle + '_label" href="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" target="_blank" style="font-size: 11px;"><img style="width: 100%;height: 60%;margin-left: auto;margin-right: auto; display: block;" id="' + id_tag_detalle + '_img" src="/media/archivos/' + web_Id_empresa + '/' + valor_campo + '" alt="image" value="' + valor_campo + '">' + valor_campo + '</a>'

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
            if (Response["campos_det"][x]["TablaCampo"] == "cmpcondicional") {

              div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
            }
            div_campos = div_campos + '</div></td>'
          } else {
            div_campos = div_campos + '<input type="hidden" id="' + id_tag_detalle + '" value="' + valor_campo + '" ' + readonly + '>'
          }
        }

        div_campos = div_campos + '</tr>'

        ////////////////////////////subdetalle

        if (typeof (Response["campos_subdet"]) == "object") {


          var largo_tabladet = 0
          for (f = 0; f < Response["campos_subdet"].length; f++) {
            if (Response["campos_subdet"][f]["Visible"] == "Y") {
              largo_tabladet = largo_tabladet + parseFloat(Response["campos_subdet"][f]["largo"])

            }
          }

          div_campos = div_campos + '<tr id="regdet-' + Response["pestalla"] + '-' + i + '" style="background-color: #0073b7;" hidden="">'

          div_campos = div_campos + '<td colspan="15"><div><div class="panel-body" style="overflow: auto;padding-top: px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;"><table class="table" id="tablaSub' + Response["pestalla"] + '-' + i + '" table-hover" style="background-color: aliceblue;margin-bottom: 0px;width: ' + parseInt(largo_tabladet) + 'px"><thead>'

          div_campos = div_campos + ''
          div_campos = div_campos + '<tr><th>'
          if (tipo != 'consulta') {
            div_campos = div_campos + '<button type="button" onclick="massub(' + Response["pestalla"] + ',' + i + ')" class="btn bg-green btn-flat margin" style="padding: 3px 9px;margin-bottom: 0px;margin-top: 0px;margin-left: -5px;">+</button>'
          }

          div_campos = div_campos + '</th>'

          for (f = 0; f < Response["campos_subdet"].length; f++) {
            if (Response["campos_subdet"][f]["Visible"] == "Y") {
              div_campos = div_campos + '<th class="col-md-' + Response["campos_subdet"][f]["largoweb"] + '" style="padding-left: 0px;padding-right: 0px;">' + Response["campos_subdet"][f]["Descripcion"] + '</th>'
            }
          }
          div_campos = div_campos + '</tr></thead><tbody>'
          var i2 = 0;

          if (Response["valores_subdet"].length > 0) {

            do {
              var subpaso = 0;

              if (tipo != 'Nuevo') {
                if (Response["valores_det"][i]['Pk' + Response["tabla_det"]["Nombre"]] == Response["valores_subdet"][i2]["PKCabecera"]) {
                  subpaso = 1
                }
              } else {
                subpaso = 1
              }




              if (subpaso == 1) {



                div_campos = div_campos + '<tr id="subf' + Response["pestalla"] + '-f' + i2 + '-z' + i + '" style="background: white;"><td><div class="row"  style="padding-left: 10px;">'

                if (tipo != 'consulta') {
                  div_campos = div_campos + '<button type="button" onclick="menossub(' + Response["pestalla"] + ',' + i2 + ',' + i + ')" class="btn bg-red btn-flat margin" style="padding: 3px 10px;margin-right: 10px;">-</button>'
                }
                div_campos = div_campos + '</div></td>'

                for (f = 0; f < Response["campos_subdet"].length; f++) {

                  valor_campo = 0;
                  if (tipo == 'Nuevo') {
                    if (Response["campos_subdet"][f]["TablaCampo"] == "cmptxtsimple") {
                      valor_campo = Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]][0]["ValorPredeterminado"]
                    }
                    if (Response["campos_subdet"][f]["TablaCampo"] == "cmpnumsimple") {
                      valor_campo = Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]][0]["Menor"]
                    }
                  } else {
                    valor_campo = Response["valores_subdet"][i2][Response["campos_subdet"][f]["Nombre"]]

                  }

                  id_tag_subdetalle = 'ps' + Response["pestalla"] + 'qqq' + i2 + 'yyy' + i + 'www' + Response["campos_subdet"][f]["Nombre"]
                  if (Response["campos_subdet"][f]["Visible"] == "Y") {

                    div_campos = div_campos + '<td style="padding-left: 0px;padding-right: 5px;"><div style="width: ' + Response["campos_subdet"][f]["largo"] + 'px;">'

                    if (Response["campos_subdet"][f]["TablaCampo"] == "cmpnumsimple") {
                      div_campos = div_campos + '<input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_subdet(' + id_tag_subdetalle + ')" min="' + Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]][0]["Menor"] + '" max="' + Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]][0]["Mayor"] + '" style="text-align: right;height: 25px;font-size: 11px;" onkeypress="return solo_numero(event)">'

                    }
                    if (Response["campos_subdet"][f]["TablaCampo"] == "cmptxtsimple") {
                      if (Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]][0]["Modificable"] == "N") {
                        readonly_int = 'readonly="readonly"'
                      }
                      div_campos = div_campos + '<input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_subdet(' + id_tag_subdetalle + ')" ' + readonly_int + ' style="height: 25px;font-size: 11px;">'

                    }
                    if (Response["campos_subdet"][f]["TablaCampo"] == "cmpreferenciaadjunto") {
                      if (Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]][0]["Modificable"] == 'N') {
                        Moddato = 'readonly="readonly"'
                      }
                      altura_mini = 125

                      if (Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]][0]["Tipo"] == 'Texto') {
                        if (Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]][0]["Tamano"] == 'G') {
                          div_campos = div_campos + '<textarea type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular_subdet(' + id_tag_subdetalle + ')" style="font-size: 11px;height: ' + altura_mini + 'px;">' + valor_campo + '</textarea>'
                        } else {
                          div_campos = div_campos + '<input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular_subdet(' + id_tag_subdetalle + ')" style="height: 25px;font-size: 11px;">'
                        }

                      }
                      if (Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]][0]["Tipo"] == 'Numero') {

                        div_campos = div_campos + '<input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' onchange="guardar_calcular_subdet(' + id_tag_subdetalle + ')" style="text-align: right;height: 25px;font-size: 11px;" onkeypress="return solo_numero(event)">'
                      }



                    }
                    if (Response["campos_subdet"][f]["TablaCampo"] == "cmpreferencia") {
                      if (tipo == 'consulta') {
                        div_campos = div_campos + '<div class="input-group" style="width: ' + Response["campos_subdet"][f]["largo"] + 'px;"><input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' style="height: 25px;font-size: 11px;">'
                        div_campos = div_campos + '</div>'
                      } else {

                        div_campos = div_campos + '<div class="input-group" style="width: ' + Response["campos_subdet"][f]["largo"] + 'px;"><input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_subdet(' + id_tag_subdetalle + ')" style="width: 80%;height: 25px;font-size: 11px;" onkeypress="return runScript_subdetalle(event, ' + id_tag_subdetalle + ')">'
                        div_campos = div_campos + '<button type="button" class="btn btn-info" data-toggle="modal" data-target=".bs-example-modal-lg" onclick="buscar_referencia_subdetalle(' + id_tag_subdetalle + ' )" style="height: 25px;padding: 3px 4px;margin-top: 0px;margin-bottom: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></button></div>'
                      }
                    }
                    if (Response["campos_subdet"][f]["TablaCampo"] == "cmpoperacion") {

                      div_campos = div_campos + '<input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="setTwoNumberDecimal(' + Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]][0]["Decimales"] + ')" readonly="readonly" style="text-align: right;height: 25px;font-size: 11px;"> '
                    }
                    if (Response["campos_subdet"][f]["TablaCampo"] == "cmpconsolidado") {
                      div_campos = div_campos + '<input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
                    }
                    if (Response["campos_subdet"][f]["TablaCampo"] == "cmpdecabecera") {
                      div_campos = div_campos + '<input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
                    }
                    if (Response["campos_subdet"][f]["TablaCampo"] == "cmpopcmultiple") {
                  
                      if (tipo != 'consulta') {
                        div_campos = div_campos + '<select class="form-control" id="' + id_tag_subdetalle + '" value="' + valor_campo + '" onchange="guardar_calcular_subdet(' + id_tag_subdetalle + ')" style="height: 25px;font-size: 11px;">'
                        for (z = 0; z < Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]].length; z++) {
                          if (valor_campo == Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]][z]["Valor"]) {
                            div_campos = div_campos + '<option selected value="' + Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]][z]["Valor"] + '">' + Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]][z]["Nombre"] + '</option>'
                          } else {
                            div_campos = div_campos + '<option value="' + Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]][z]["Valor"] + '">' + Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]][z]["Nombre"] + '</option>'
                          }
                        }
                        div_campos = div_campos + '</select>'
                      } else {
                        div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_det(' + id_tag_detalle + ')" style="height: 25px;font-size: 11px;" >'
                      }
                    }
                    if (Response["campos_subdet"][f]["TablaCampo"] == "cmpfecha") {
                      tipodato = 'date'
              
                      if (Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]][0]["Tiempo"] == 'Y') {
                        tipodato = 'datetime-local'
                      }
                      div_campos = div_campos + '<input type="' + tipodato + '" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="guardar_calcular_subdet(' + id_tag_subdetalle + ')" style="height: 25px;font-size: 11px;line-height: 7px;">'
                    }

                  } else {

                    div_campos = div_campos + '<input type="hidden" id="' + id_tag_subdetalle + '" value="' + valor_campo + '" ' + readonly + '>'

                  }

                }


                div_campos = div_campos + '</tr>'

              }
              i2++;
            } while (i2 < Response["valores_subdet"].length);
          }

          ccsub_porPesta['p-' + pestalla] = (Response["valores_subdet"].length)

          div_campos = div_campos + '</tbody>'
          div_campos = div_campos + '</table></div>'
          div_campos = div_campos + '</div></td></tr>'
        }
        ////////////////////////////subdetalle
        i--
      //} while (i < Response["valores_det"].length);
      } while (i >= 0 );

      cc_porPesta['p-' + pestalla] = (Response["valores_det"].length)
      div_campos = div_campos + '</tbody></table></div>'


      $('#rr' + pestalla).append(div_campos);

      if (Response["valores_det"].length > 3) {
        document.getElementById('divtabla' + Response["pestalla"]).style.height = "500px";

      }


    
    }

    html_ingre = '<div class="box-body" style="background: white;">'

    html_ingre = html_ingre + '<div class="col-md-6 col-xs-12"> <div class="row">' + div_campos_abajo_izq + '</div></div>'
    html_ingre = html_ingre + '<div class="col-md-6 col-xs-12"> <div class="row">' + div_campos_abajo_der + '</div></div>'
    html_ingre = html_ingre + '</div>'

    $('#rr' + pestalla).append(html_ingre);
    document.getElementById('id' + pestalla).click();


    if (Response["datos_edocs"].length > 0) {
      if (Response['datos_edocs'][2].length > 0) {
        for (xq = 0; xq < (cc_porPesta["p-" + pestalla] + 2); xq++) {
          menos_sin_cal(pestalla, xq, 1)
        }


        if(Response["datos_edocs"][0]['infoTributaria']['codDoc'] == '07'){
          compro = {}

          for (var i = 0; i < Response['datos_edocs'][0]['impuestos'].length; i++) {
            if (compro[Response['datos_edocs'][0]['impuestos'][i]['numDocSustento']] == undefined){
              compro[Response['datos_edocs'][0]['impuestos'][i]['numDocSustento']] = {'fuente_base':0,'fuente_ret':0,'iva_base':0,'iva_ret':0}                 
            }
            txt = Response['datos_edocs'][0]['impuestos'][i]['numDocSustento']
            if(Response['datos_edocs'][0]['impuestos'][i]['codigo'] == 2 ){ //iva
              compro[txt]['iva_base'] = compro[txt]['iva_base'] + parseFloat(Response['datos_edocs'][0]['impuestos'][i]['baseImponible'])
              compro[txt]['iva_ret'] = compro[txt]['iva_ret'] + parseFloat(Response['datos_edocs'][0]['impuestos'][i]['valorRetenido'])

            }
            if(Response['datos_edocs'][0]['impuestos'][i]['codigo'] == 1 ){ //fuente
              compro[txt]['fuente_base'] = compro[txt]['fuente_base'] + parseFloat(Response['datos_edocs'][0]['impuestos'][i]['baseImponible'])
              compro[txt]['fuente_ret'] = compro[txt]['fuente_ret'] + parseFloat(Response['datos_edocs'][0]['impuestos'][i]['valorRetenido'])

            }

          }

        for (var i2 = 0; i2 < Object.keys(compro).length; i2++) {

          mas(pestalla)

          compro[Object.keys(compro)[i2]]

          for (var i3 = 0; i3 < Response['datos_edocs'][2].length; i3++) {
            vc_dato = document.getElementById('pd' + pestalla + 'fff' + cc_porPesta["p-" + pestalla] + 'ccc' + Response['datos_edocs'][2][i3]['campo'])
            if (Response['datos_edocs'][2][i3]['xml'] == 'numDocSustento'){
              vc_dato.value = Object.keys(compro)[i2]
            }
            if (Response['datos_edocs'][2][i3]['xml'] == 'fuente_base'){
              vc_dato.value = compro[Object.keys(compro)[i2]]['fuente_base']
            }
            if (Response['datos_edocs'][2][i3]['xml'] == 'iva_base'){
              vc_dato.value = compro[Object.keys(compro)[i2]]['iva_base']
            }
            if (Response['datos_edocs'][2][i3]['xml'] == 'fuente_ret'){
              vc_dato.value = compro[Object.keys(compro)[i2]]['fuente_ret']
            }
            if (Response['datos_edocs'][2][i3]['xml'] == 'iva_ret'){
              vc_dato.value = compro[Object.keys(compro)[i2]]['iva_ret']
            }
          }

        }


        }  
        


        if(Response["datos_edocs"][0]['infoTributaria']['codDoc'] == '01'){
          

          cod_bases = {'0':0, '2':0, '6':0, '3':0, '8':0} 
          for (var i = 0; i < Response['datos_edocs'][0]['detalle'].length; i++) {
            valor = parseFloat(Response['datos_edocs'][0]['detalle'][i]['cantidad']) * parseFloat(Response['datos_edocs'][0]['detalle'][i]['precioUnitario'])
            cod_bases[Response['datos_edocs'][0]['detalle'][i]['impuesto-codigoPorcentaje']] = cod_bases[Response['datos_edocs'][0]['detalle'][i]['impuesto-codigoPorcentaje']] + valor              

          }
          for (i = 0; i < Object.keys(cod_bases).length; i++) {
            if(cod_bases[Object.keys(cod_bases)[i]] > 0){
              mas(pestalla)
              for (var i2 = 0; i2 < Response['datos_edocs'][2].length; i2++) {
                vc_dato = document.getElementById('pd' + pestalla + 'fff' + cc_porPesta["p-" + pestalla] + 'ccc' + Response['datos_edocs'][2][i2]['campo'])
                if (Response['datos_edocs'][2][i2]['xml'] == 'cantidad'){
                  vc_dato.value = 1
                }
                if (Response['datos_edocs'][2][i2]['xml'] == 'precioUnitario'){
                  vc_dato.value = cod_bases[Object.keys(cod_bases)[i]]
                }
                if (Response['datos_edocs'][2][i2]['xml'] == 'impuesto-tarifa'){
                  if(Object.keys(cod_bases)[i] == '0'){vc_dato.value = 0}
                  if(Object.keys(cod_bases)[i] == '2'){vc_dato.value = 12}
                  if(Object.keys(cod_bases)[i] == '3'){vc_dato.value = 14}
                  if(Object.keys(cod_bases)[i] == '6'){vc_dato.value = 0}
                  if(Object.keys(cod_bases)[i] == '8'){vc_dato.value = 8}
                }
                if (Response['datos_edocs'][2][i2]['xml'] == 'impuesto-codigoPorcentaje'){
                  vc_dato.value = Object.keys(cod_bases)[i]
                }
              }
            }
          }
        }
      }
    }

    if(t_traspasos != undefined){ 
      for (z2 = 0; z2 < t_traspasos.length; z2++) {
        if (tipo == 'Nuevo') {
          id_tag = 'p' + pestalla + 'zzz' + t_traspasos[z2]["CampoDestino"]
          document.getElementById(id_tag).value = t_traspasos[z2]["Valor"]
        }
      }
    }

    for (z2 = 0; z2 < Response["campos_cab"].length; z2++) {
      if (tipo == 'Nuevo') {
        if (Response["campos_cab"][z2]["TablaCampo"] == "cmpreferencia") {
          id_tag = 'p' + pestalla + 'zzz' + Response["campos_cab"][z2]["Nombre"]
          
          if (Response["func_cab"][Response["campos_cab"][z2]["Nombre"]][0][0]["predeterminado_valor"] != '') {
            id_tag = 'p' + pestalla + 'zzz' + Response["campos_cab"][z2]["Nombre"]

            if (Response["func_cab"][Response["campos_cab"][z2]["Nombre"]][0][0]["Tipo_Predeterminado"] == '1') {
              id_tag_detalle_pret = 'p' + pestalla + 'zzz' + Response["func_cab"][Response["campos_cab"][z2]["Nombre"]][0][0]["predeterminado"]
              document.getElementById(id_tag).value = document.getElementById(id_tag_detalle_pret).value
            }
            buscar_referencia_cabecera_enter(document.getElementById(id_tag))
          }else{
            if(document.getElementById(id_tag) != null){
              if(document.getElementById(id_tag).value != ''){
                buscar_referencia_cabecera_enter(document.getElementById(id_tag))
              }
            }
          }
        }
      }
    }

    for (z2 = 0; z2 < Response["campos_det"].length; z2++) {
      if (tipo == 'Nuevo') {
        if (Response["campos_det"][z2]["TablaCampo"] == "cmpreferencia") {
          id_tag_detalle_pret = 'pd' + Response["pestalla"] + 'fff' + 0 + 'ccc' + Response["func_det"][Response["campos_det"][z2]["Nombre"]][0][0]["predeterminado"]
          
          if (Response["func_det"][Response["campos_det"][z2]["Nombre"]][0][0]["predeterminado_valor"] != '') {
            id_tag_detalle = 'pd' + Response["pestalla"] + 'fff' + 0 + 'ccc' + Response["campos_det"][z2]["Nombre"]
            if (Response["func_det"][Response["campos_det"][z2]["Nombre"]][0][0]["Tipo_Predeterminado"] == '1') {
              id_tag_detalle_pret = 'pd' + Response["pestalla"] + 'fff' + 0 + 'ccc' + Response["func_det"][Response["campos_det"][z2]["Nombre"]][0][0]["predeterminado"]
              if(document.getElementById(id_tag_detalle_pret).value != '0'){
                document.getElementById(id_tag_detalle).value = document.getElementById(id_tag_detalle_pret).value
              }                  
            }
            buscar_referencia_detalle_enter(document.getElementById(id_tag_detalle))
          }else{
            id_tag_detalle = 'pd' + Response["pestalla"] + 'fff' + 0 + 'ccc' + Response["campos_det"][z2]["Nombre"]
            if(document.getElementById(id_tag_detalle) != null){
              if(document.getElementById(id_tag_detalle).value != ''){
                buscar_referencia_detalle_enter(document.getElementById(id_tag_detalle))
              }
            }
          }
        }
      }
    }

    if(origen == 1 && dict_pestalla[id_dic]["plantilla_html"].length> 0){
      autoccerar_pestana(Response["pestalla"], 20)


      for (z2 = 0; z2 < parseInt(dict_pestalla[id_dic]["plantilla_html"][0]['impresiones']); z2++) {
        imprimir_elemento(Response["pestalla"], 0)
      }


      registro(Response["tabla_cab"]["PkModulo"],0,0,Response["pestalla"],0,0)
    }else{
      if (tipo == 'consulta') {
        if(origen == 1){
          autoccerar_pestana(Response["pestalla"], 60*2)
        }else{
          autoccerar_pestana(Response["pestalla"], 60*5)
        }
        
      }
    }
  
  }


function calcular_0_v2(pestana_int, cc_cambios) {


    Response = dict_pestalla['p-' + pestana_int]

    for (x = 0; x < Response["campos_cab"].length; x++) {

        if (Response["campos_cab"][x]["Modificable"] == 'Si' || Response['tipo'] == 'Nuevo') {


            ID_TAG = 'p' + pestana_int + 'zzz' + Response["campos_cab"][x]["Nombre"] + '';

            if (Response["campos_cab"][x]["TablaCampo"] == "cmptxtsimple") {
              if(cc_cambios.includes(Response["campos_cab"][x]["Nombre"])){
                if(Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Cedula"] == 'Y'){
                  SriAplicarCedulaRuc(pestana_int, Response["campos_cab"][x]["Nombre"])
                }
              }

            }


            if (Response["campos_cab"][x]["TablaCampo"] == "cmpnumsimple") {
                if (document.getElementById(ID_TAG).value <= Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Menor"]) {
                    document.getElementById(ID_TAG).value = setTwoNumberDecimal(Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Menor"], Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["NumDecimales"])
                } else {
                    if (document.getElementById(ID_TAG).value >= Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Mayor"]) {
                        document.getElementById(ID_TAG).value = setTwoNumberDecimal(Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Mayor"], Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["NumDecimales"])
                    } else {
                        document.getElementById(ID_TAG).value = setTwoNumberDecimal(document.getElementById(ID_TAG).value, Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["NumDecimales"])
                    }

                }
            }
            if (Response["campos_cab"][x]["TablaCampo"] == "cmpformuladetalle") {
                valor_final = 0;
                cc_final = 0;

                for (x2 = 0; x2 < (cc_porPesta['p-' + pestana_int] + 1); x2++) {

                    Campo_a_oper = Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["Campo"]
                    Campo = Campo_a_oper.split(".")
                    ID_TAG_campo = 'pd' + pestana_int + 'fff' + x2 + 'ccc' + Campo[1]

                    if (document.getElementById(ID_TAG_campo) != null) {

                        Valor = parseFloat(document.getElementById(ID_TAG_campo).value)

                        excluido = 0;

                        for (x3 = 0; x3 < Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1].length; x3++) {
                            valor_comparar = 0;
                            ID_TAG_campoA = 'pd' + pestana_int + 'fff' + x2 + 'ccc' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["Campo"]
                            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["Tipo"] == "Valor") {
                                valor_comparar = Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["Valor"]
                            } else {
                                ID_TAG_compa = 'pd' + pestana_int + 'fff' + x2 + 'ccc' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["Valor"]
                                valor_comparar = document.getElementById(ID_TAG_compa).value
                            }
                            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["Operador"] == "=") { if (parseFloat(document.getElementById(ID_TAG_campoA).value) != parseFloat(valor_comparar)) { excluido = 1 } }
                            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["Operador"] == "<") { if (parseFloat(document.getElementById(ID_TAG_campoA).value) >= parseFloat(valor_comparar)) { excluido = 1 } }
                            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["Operador"] == ">") { if (parseFloat(document.getElementById(ID_TAG_campoA).value) <= parseFloat(valor_comparar)) { excluido = 1 } }
                            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["Operador"] == "<=") { if (parseFloat(document.getElementById(ID_TAG_campoA).value) > parseFloat(valor_comparar)) { excluido = 1 } }
                            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["Operador"] == ">=") { if (parseFloat(document.getElementById(ID_TAG_campoA).value) < parseFloat(valor_comparar)) { excluido = 1 } }
                            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["Operador"] == "!=") { if (parseFloat(document.getElementById(ID_TAG_campoA).value) == parseFloat(valor_comparar)) { excluido = 1 } }
                            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["Operador"] == "igual") { if (document.getElementById(ID_TAG_campoA).value != valor_comparar) { excluido = 1 } }
                            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["Operador"] == "no igual") { if (document.getElementById(ID_TAG_campoA).value == valor_comparar) { excluido = 1 } }
                            

                        }

                        if (excluido == 0) {
                            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["Operacion"] == "Suma") {
                                valor_final = parseFloat(valor_final) + parseFloat(Valor)
                            }
                            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["Operacion"] == "Promedio") {
                                valor_final = parseFloat(valor_final) + parseFloat(Valor)
                                cc_final = cc_final + 1
                            }
                            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["Operacion"] == "Maximo") {
                                if (parseFloat(valor_final) < parseFloat(Valor)) { valor_final = Valor }
                            }
                            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["Operacion"] == "Minimo") {
                                if (parseFloat(valor_final) > parseFloat(Valor)) { valor_final = Valor }
                            }
                            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["Operacion"] == "Contar") {
                                cc_final = cc_final + 1
                            }
                        }
                    }
                }
                if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["Operacion"] == "Suma") {
                    document.getElementById(ID_TAG).value = setTwoNumberDecimal(valor_final, 2)
                }
                if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["Operacion"] == "Promedio") {
                    valor_final = valor_final / (cc_final + 1)
                    document.getElementById(ID_TAG).value = setTwoNumberDecimal(valor_final, 2)
                }
                if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["Operacion"] == "Maximo") {
                    document.getElementById(ID_TAG).value = setTwoNumberDecimal(valor_final, 2)
                }
                if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["Operacion"] == "Minimo") {
                    document.getElementById(ID_TAG).value = setTwoNumberDecimal(valor_final, 2)
                }
                if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["Operacion"] == "Contar") {
                    document.getElementById(ID_TAG).value = cc_final
                }
            }
            if (Response["campos_cab"][x]["TablaCampo"] == "cmpnumsecuencial") {



            }
            if (Response["campos_cab"][x]["TablaCampo"] == "cmpsistema") {

                if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["PkId"] == 1) {
                    temp_sentencia = 'select now() as "tiempo"'
                    id_tag_ajax = ID_TAG
                    var now = new Date();
                    document.getElementById(ID_TAG).value = now.format("Y-m-d") + 'T' + now.format("H:i:s")


                }
                if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["PkId"] == 2) {
                    document.getElementById(ID_TAG).value = web_usuario
                }
                if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["PkId"] == 3) {
                    temp_sentencia = 'select now() as "tiempo"'
                    var now = new Date();
                    document.getElementById(ID_TAG).value = now.format("Y-m-d") + 'T' + now.format("H:i:s")
                

                }
            }

            if (Response["campos_cab"][x]["TablaCampo"] == "cmpreferencia") {
            }
            if (Response["campos_cab"][x]["TablaCampo"] == "cmpreferenciaadjunto") {
            }
            if (Response["campos_cab"][x]["TablaCampo"] == "cmpoperacion") {
                temp = 0.0;
                operador = "=";
                Valor = 0.0;

                for (x3 = 0; x3 < Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1].length; x3++) {
                    if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["Estado"] == "C") {

                        ID_TAG_campo = 'p' + pestana_int + 'zzz' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["Sentencia"] + '';
                        if (document.getElementById(ID_TAG_campo).value == "") {
                            Valor = 0.0
                        } else {
                            Valor = document.getElementById(ID_TAG_campo).value
                        }

                        if (operador == "=") { temp = parseFloat(Valor) }
                        if (operador == "+") { temp = parseFloat(temp) + parseFloat(Valor) }
                        if (operador == "-") { temp = parseFloat(temp) - parseFloat(Valor) }
                        if (operador == "*") { temp = parseFloat(temp) * parseFloat(Valor) }
                        if (operador == "/") {
                            if (Valor > 0) { temp = parseFloat(temp) / parseFloat(Valor) }
                        }
                        if (operador == "Juntar") { temp = temp.toString() + Valor.toString() }
                    }
                    if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["Estado"] == "O") {
                        operador = Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["Sentencia"]
                    }
                    if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["Estado"] == "V") {
                        Valor = Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["Sentencia"]
                        if (operador == "=") { temp = parseFloat(Valor) }
                        if (operador == "+") { temp = parseFloat(temp) + parseFloat(Valor) }
                        if (operador == "-") { temp = parseFloat(temp) - parseFloat(Valor) }
                        if (operador == "*") { temp = parseFloat(temp) * parseFloat(Valor) }
                        if (operador == "/") {
                            if (Valor > 0) { temp = parseFloat(temp) / parseFloat(Valor) }
                        }
                        if (operador == "Juntar") { temp = temp.toString() + Valor.toString() }
                    }
                }
                temp = setTwoNumberDecimal(temp, Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["Decimales"])
                document.getElementById(ID_TAG).value = temp
            }
            if (Response["campos_cab"][x]["TablaCampo"] == "cmpconsolidado") {

              if(offline == false){


                triggerscc = []
                A_Select = 'Select ( '
                A_From = 'From '
                A_Where = 'Where '
                A_Group = 'Group by '
                A_GroupWhere = 'Group by '
                sentencia = ""
                FaltaDato = false



                for (x3 = 0; x3 < Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1].length; x3++) {
                    A_From = A_From + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["Tabla"] + ' as ' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["Nombre"] + ', '
                }
                if (A_From == "From ") { A_From = "" } else { A_From = A_From.slice(0, -2) }

                for (x3 = 0; x3 < Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2].length; x3++) {

                    if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Tipo"] == "Valor") {
                        A_Where = A_Where + " '" + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Elemento"] + "' "
                    }
                    if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Tipo"] == "Operacion") {
                        A_Where = A_Where + " " + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Elemento"] + " "
                    }
                    if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Tipo"] == "Registro") {
                        ID_TAG_reg = 'p' + pestana_int + 'zzz' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Elemento"];
                        triggerscc.push(Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Elemento"])
                        if (document.getElementById(ID_TAG_reg).value == "") {
                            FaltaDato = true
                            A_Where = A_Where + " '' "
                        } else {
                            A_Where = A_Where + " '" + document.getElementById(ID_TAG_reg).value + "' "
                        }

                    }
                    if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Tipo"] == "Campo") {

                        if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Funcion"] == "") {

                            A_Where = A_Where + " " + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Origen"] + '.' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Elemento"] + " "
                        }
                        if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Funcion"] == " ") {
                            A_Where = A_Where + " " + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Origen"] + '.' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Elemento"] + " "
                        }
                        if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Funcion"] == "Suma") {
                            A_Where = A_Where + " " + 'Sum(' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Origen"] + '.' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Elemento"] + ') '
                            A_GroupWhere = A_GroupWhere + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Grupo"] + ', '
                        }
                        if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Funcion"] == "Promedio") {
                            A_Where = A_Where + ' Avg(' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Origen"] + '.' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Elemento"] + ') '
                            A_GroupWhere = A_GroupWhere + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Grupo"] + ', '
                        }
                        if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Funcion"] == "Contar") {
                            A_Where = A_Where + ' Count(' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Origen"] + '.' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Elemento"] + ') '
                            A_GroupWhere = A_GroupWhere + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Grupo"] + ', '
                        }
                    }


                }
                if (A_Where == 'Where ') { A_Where = '' }
                if (A_GroupWhere == "Group by ") { A_GroupWhere = "" } else { A_GroupWhere = A_GroupWhere.slice(0, -2) }


                for (x3 = 0; x3 < Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3].length; x3++) {


                    if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Tipo"] == "Valor") {
                        A_Select = A_Select + " '" + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Elemento"] + "' "
                    }
                    if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Tipo"] == "Operacion") {
                        A_Select = A_Select + " " + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Elemento"] + " "
                    }
                    if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Tipo"] == "Registro") {
                        ID_TAG_reg = 'p' + pestana_int + 'zzz' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Elemento"];
                        triggerscc.push(Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Elemento"])
                        if (document.getElementById(ID_TAG_reg).value == "") {
                            FaltaDato = true
                            A_Select = A_Select + " '' "
                        } else {
                            A_Select = A_Select + " '" + document.getElementById(ID_TAG_reg).value + "' "
                        }
                    }
                    if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Tipo"] == "Campo") {

                        if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Funcion"] == "") {

                            A_Select = A_Select + " " + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Origen"] + '.' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Elemento"] + " "
                        }
                        if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Funcion"] == " ") {
                            A_Select = A_Select + " " + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Origen"] + '.' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Elemento"] + " "
                        }
                        if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Funcion"] == "Suma") {
                            A_Select = A_Select + ' Sum(' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Origen"] + '.' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Elemento"] + ') '
                            A_Group = A_Group + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Grupo"] + ', '
                        }
                        if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Funcion"] == "Promedio") {
                            A_Select = A_Select + ' Avg(' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Origen"] + '.' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Elemento"] + ') '
                            A_Group = A_Group + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Grupo"] + ', '
                        }
                        if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Funcion"] == "Contar") {
                            A_Select = A_Select + ' Count(' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Origen"] + '.' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Elemento"] + ') '
                            A_Group = A_Group + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Grupo"] + ', '
                        }
                    }
                }
                if (A_Group == "Group by ") { A_Group = "" } else { A_Group = A_Group.slice(0, -2) }

                A_Select = A_Select + " ) as '" + Response["campos_cab"][x]["Nombre"] + "'"
                if (A_Group == "") {
                    if (A_GroupWhere == "") {
                        sentencia = A_Select + " " + A_From + " " + A_Where
                    } else {
                        sentencia = A_Select + " " + A_From + " " + A_Where + " " + A_GroupWhere
                    }
                } else {
                    if (A_GroupWhere == "") {
                        sentencia = A_Select + " " + A_From + " " + A_Where + " " + A_Group
                    } else {
                        sentencia = A_Select + " " + A_From + " " + A_Where + " " + A_Group + ", " + A_GroupWhere.replace("Group by ", "")
                    }
                }

                if (FaltaDato == true && Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["Permite_nulo"] == "No") {
                    document.getElementById(ID_TAG).value = 0

                } else {
                    ID_TAG_resp = 'p' + pestana_int + 'zzz' + Response["campos_cab"][x]["Nombre"] + '';
                    ID_TAG_nombre = Response["campos_cab"][x]["Nombre"]

                    //sumir si se a modificado algun cmapo trigger directo
                    hayCambio = false 
                    for (x3 = 0; x3 < cc_cambios.length; x3++) {
                      for (x4 = 0; x4 < triggerscc.length; x4++) {
                        if(triggerscc[x4] == cc_cambios[x3]){
                          hayCambio = true
                        }
                      }
                    }
                    if(hayCambio == true){

                      if (offline == false) {
                          $.ajax({
                              type: 'POST',
                              url: '/consolidado',
                              data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'cmpsenten': sentencia, 'tag1': ID_TAG_resp, 'tag2': ID_TAG_nombre, 'usuario': web_usuario },
                              success: function (Response) {
                                  if (Response["cmpvalor"].length == 0) {
                                      document.getElementById(Response["tag1"]).value = 0
                                  } else {
                                      if (Response["cmpvalor"][0][Response["tag2"]] == null) {
                                          document.getElementById(Response["tag1"]).value = 0
                                      } else {
                                          document.getElementById(Response["tag1"]).value = Response["cmpvalor"][0][Response["tag2"]]
                                      }

                                  }
                              }
                          });                    
                      }else{
                          document.getElementById(ID_TAG_resp).value = respuestas_pre[Response["campos_cab"][x]["PkId"]]
                      }
                    }
                }
              }else{ // modo offline =  true
                ID_TAG_resp = 'p' + pestana_int + 'zzz' + Response["campos_cab"][x]["Nombre"] + '';
                ID_TAG_nombre = Response["campos_cab"][x]["Nombre"]
                document.getElementById(ID_TAG_resp).value = respuestas_pre[Response["campos_cab"][x]["PkId"]]

              }
            }
            if (Response["campos_cab"][x]["TablaCampo"] == "cmpnumeroaletras") {
                ID_TAG_campo = 'p' + pestana_int + 'zzz' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["CampoNumero"] + '';

                document.getElementById(ID_TAG).value = numeroALetras(document.getElementById(ID_TAG_campo).value);

            }
            if (Response["campos_cab"][x]["TablaCampo"] == "cmpcondicional") {
                for (x3 = 0; x3 < Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1].length; x3++) {
                    if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["TipoA"] == "Campo") {
                        ID_TAG_campoA = 'p' + pestana_int + 'zzz' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["ElementoA"] + '';
                        valorA = document.getElementById(ID_TAG_campoA).value
                    } else {
                        valorA = Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["ElementoA"]
                    }
                    if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["TipoB"] == "Campo") {
                        ID_TAG_campoB = 'p' + pestana_int + 'zzz' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["ElementoB"] + '';
                        valorB = document.getElementById(ID_TAG_campoB).value
                    } else {
                        valorB = Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["ElementoB"]
                    }
                    if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["TipoC"] == "Campo") {
                        ID_TAG_campoC = 'p' + pestana_int + 'zzz' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["ElementoC"] + '';
                        valorC = document.getElementById(ID_TAG_campoC).value
                    } else {
                        valorC = Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["ElementoC"]
                    }
                    if(dovelverCondicional(Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["Operador"], valorA, valorB) == true){
                      document.getElementById(ID_TAG).value = valorC
                      break
                    }

                    
                }
            }
        } 
    }  
}

function dovelverCondicional(Operador, valorA, valorB){

  if (Operador == "igual" && valorB == 'Cedula' && valorA.length == 10) {
    if(validarCedulaRuc(valorA)){
      return true
    }
  }
  if (Operador == "igual" && valorB == 'Ruc' && valorA.length == 13) {
    if(validarCedulaRuc(valorA)){
      return true
    }
  }
  if (Operador == "=") {
    if (parseFloat(valorA) == parseFloat(valorB)) {
      return true
    }
  }
  if (Operador == "!=") {
      if (valorA != valorB) {
        return true
      }
  }
  
  if (Operador == "igual") {
    if (String(valorA) == String(valorB)) {
      return true
    }
  }
  if (Operador == ">") {
    if (parseFloat(valorA) > parseFloat(valorB)) {
      return true
    }
  }
  if (Operador == ">=") {
    if (parseFloat(valorA) >= parseFloat(valorB)) {
      return true
    }
  }
  if (Operador == "<") {
    if (parseFloat(valorA) < parseFloat(valorB)) {
      return true
    }
  }
  
  if (Operador == "<=") {
    if (parseFloat(valorA) <= parseFloat(valorB)) {
      return true
    }
  }

  if (Operador == "Largo igual") {
    if (String(valorA).length == parseInt(valorB)) {
      return true
    }
  }
  if (Operador == "Largo Mayor") {
    if (String(valorA).length > parseInt(valorB)) {
      return true
    }
  }
  if (Operador == "Largo Menor") {
    if (String(valorA).length < parseInt(valorB)) {
      return true
    }
  }
  return false
}

function calcular_0(pestana_int) {


    Response = dict_pestalla['p-' + pestana_int]

    for (x = 0; x < Response["campos_cab"].length; x++) {

        if (Response["campos_cab"][x]["Modificable"] == 'Si' || Response['tipo'] == 'Nuevo') {

            ID_TAG = 'p' + pestana_int + 'zzz' + Response["campos_cab"][x]["Nombre"] + '';
            if (Response["campos_cab"][x]["TablaCampo"] == "cmpnumsimple") {
                if (document.getElementById(ID_TAG).value <= Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Menor"]) {
                    document.getElementById(ID_TAG).value = setTwoNumberDecimal(Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Menor"], Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["NumDecimales"])
                } else {
                    if (document.getElementById(ID_TAG).value >= Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Mayor"]) {
                        document.getElementById(ID_TAG).value = setTwoNumberDecimal(Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Mayor"], Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["NumDecimales"])
                    } else {
                        document.getElementById(ID_TAG).value = setTwoNumberDecimal(document.getElementById(ID_TAG).value, Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["NumDecimales"])
                    }

                }
            }
            if (Response["campos_cab"][x]["TablaCampo"] == "cmpformuladetalle") {
                valor_final = 0;
                cc_final = 0;

                for (x2 = 0; x2 < (cc_porPesta['p-' + pestana_int] + 1); x2++) {

                    Campo_a_oper = Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["Campo"]
                    Campo = Campo_a_oper.split(".")
                    ID_TAG_campo = 'pd' + pestana_int + 'fff' + x2 + 'ccc' + Campo[1]

                    if (document.getElementById(ID_TAG_campo) != null) {

                        Valor = parseFloat(document.getElementById(ID_TAG_campo).value)

                        excluido = 0;

                        for (x3 = 0; x3 < Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1].length; x3++) {
                            valor_comparar = 0;
                            ID_TAG_campoA = 'pd' + pestana_int + 'fff' + x2 + 'ccc' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["Campo"]
                            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["Tipo"] == "Valor") {
                                valor_comparar = Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["Valor"]
                            } else {
                                ID_TAG_compa = 'pd' + pestana_int + 'fff' + x2 + 'ccc' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["Valor"]
                                valor_comparar = document.getElementById(ID_TAG_compa).value
                            }
                            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["Operador"] == "=") { if (parseFloat(document.getElementById(ID_TAG_campoA).value) != parseFloat(valor_comparar)) { excluido = 1 } }
                            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["Operador"] == "<") { if (parseFloat(document.getElementById(ID_TAG_campoA).value) >= parseFloat(valor_comparar)) { excluido = 1 } }
                            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["Operador"] == ">") { if (parseFloat(document.getElementById(ID_TAG_campoA).value) <= parseFloat(valor_comparar)) { excluido = 1 } }
                            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["Operador"] == "<=") { if (parseFloat(document.getElementById(ID_TAG_campoA).value) > parseFloat(valor_comparar)) { excluido = 1 } }
                            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["Operador"] == ">=") { if (parseFloat(document.getElementById(ID_TAG_campoA).value) < parseFloat(valor_comparar)) { excluido = 1 } }
                            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["Operador"] == "!=") { if (parseFloat(document.getElementById(ID_TAG_campoA).value) == parseFloat(valor_comparar)) { excluido = 1 } }
                            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["Operador"] == "igual") { if (document.getElementById(ID_TAG_campoA).value != valor_comparar) { excluido = 1 } }
                            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["Operador"] == "no igual") { if (document.getElementById(ID_TAG_campoA).value == valor_comparar) { excluido = 1 } }



                        }

                        if (excluido == 0) {
                            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["Operacion"] == "Suma") {
                                valor_final = parseFloat(valor_final) + parseFloat(Valor)
                            }
                            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["Operacion"] == "Promedio") {
                                valor_final = parseFloat(valor_final) + parseFloat(Valor)
                                cc_final = cc_final + 1
                            }
                            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["Operacion"] == "Maximo") {
                                if (parseFloat(valor_final) < parseFloat(Valor)) { valor_final = Valor }
                            }
                            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["Operacion"] == "Minimo") {
                                if (parseFloat(valor_final) > parseFloat(Valor)) { valor_final = Valor }
                            }
                            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["Operacion"] == "Contar") {
                                cc_final = cc_final + 1
                            }
                        }
                    }
                }
                if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["Operacion"] == "Suma") {
                    document.getElementById(ID_TAG).value = setTwoNumberDecimal(valor_final, 2)
                }
                if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["Operacion"] == "Promedio") {
                    valor_final = valor_final / (cc_final + 1)
                    document.getElementById(ID_TAG).value = setTwoNumberDecimal(valor_final, 2)
                }
                if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["Operacion"] == "Maximo") {
                    document.getElementById(ID_TAG).value = setTwoNumberDecimal(valor_final, 2)
                }
                if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["Operacion"] == "Minimo") {
                    document.getElementById(ID_TAG).value = setTwoNumberDecimal(valor_final, 2)
                }
                if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["Operacion"] == "Contar") {
                    document.getElementById(ID_TAG).value = cc_final
                }
            }
            if (Response["campos_cab"][x]["TablaCampo"] == "cmpnumsecuencial") {



            }
            if (Response["campos_cab"][x]["TablaCampo"] == "cmpsistema") {

                if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["PkId"] == 1) {
                    temp_sentencia = 'select now() as "tiempo"'
                    id_tag_ajax = ID_TAG
                    var now = new Date();
                    document.getElementById(ID_TAG).value = now.format("Y-m-d") + 'T' + now.format("H:i:s")


                }
                if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["PkId"] == 2) {
                    document.getElementById(ID_TAG).value = web_usuario
                }
                if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["PkId"] == 3) {
                    temp_sentencia = 'select now() as "tiempo"'
                    var now = new Date();
                    document.getElementById(ID_TAG).value = now.format("Y-m-d") + 'T' + now.format("H:i:s")
                

                }
            }

            if (Response["campos_cab"][x]["TablaCampo"] == "cmpreferencia") {
            }
            if (Response["campos_cab"][x]["TablaCampo"] == "cmpreferenciaadjunto") {
            }
            if (Response["campos_cab"][x]["TablaCampo"] == "cmpoperacion") {
                temp = 0.0;
                operador = "=";
                Valor = 0.0;

                for (x3 = 0; x3 < Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1].length; x3++) {
                    if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["Estado"] == "C") {

                        ID_TAG_campo = 'p' + pestana_int + 'zzz' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["Sentencia"] + '';
                        if (document.getElementById(ID_TAG_campo).value == "") {
                            Valor = 0.0
                        } else {
                            Valor = document.getElementById(ID_TAG_campo).value
                        }

                        if (operador == "=") { temp = parseFloat(Valor) }
                        if (operador == "+") { temp = parseFloat(temp) + parseFloat(Valor) }
                        if (operador == "-") { temp = parseFloat(temp) - parseFloat(Valor) }
                        if (operador == "*") { temp = parseFloat(temp) * parseFloat(Valor) }
                        if (operador == "/") {
                            if (Valor > 0) { temp = parseFloat(temp) / parseFloat(Valor) }
                        }
                        if (operador == "Juntar") { temp = temp.toString() + Valor.toString() }
                    }
                    if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["Estado"] == "O") {
                        operador = Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["Sentencia"]
                    }
                    if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["Estado"] == "V") {
                        Valor = Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["Sentencia"]
                        if (operador == "=") { temp = parseFloat(Valor) }
                        if (operador == "+") { temp = parseFloat(temp) + parseFloat(Valor) }
                        if (operador == "-") { temp = parseFloat(temp) - parseFloat(Valor) }
                        if (operador == "*") { temp = parseFloat(temp) * parseFloat(Valor) }
                        if (operador == "/") {
                            if (Valor > 0) { temp = parseFloat(temp) / parseFloat(Valor) }
                        }
                        if (operador == "Juntar") { temp = temp.toString() + Valor.toString() }
                    }
                }
                temp = setTwoNumberDecimal(temp, Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["Decimales"])
                document.getElementById(ID_TAG).value = temp
            }
            if (Response["campos_cab"][x]["TablaCampo"] == "cmpconsolidado") {

              if(offline == false){


                triggerscc = []
                A_Select = 'Select ( '
                A_From = 'From '
                A_Where = 'Where '
                A_Group = 'Group by '
                A_GroupWhere = 'Group by '
                sentencia = ""
                FaltaDato = false



                for (x3 = 0; x3 < Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1].length; x3++) {
                    A_From = A_From + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["Tabla"] + ' as ' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["Nombre"] + ', '
                }
                if (A_From == "From ") { A_From = "" } else { A_From = A_From.slice(0, -2) }

                for (x3 = 0; x3 < Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2].length; x3++) {

                    if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Tipo"] == "Valor") {
                        A_Where = A_Where + " '" + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Elemento"] + "' "
                    }
                    if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Tipo"] == "Operacion") {
                        A_Where = A_Where + " " + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Elemento"] + " "
                    }
                    if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Tipo"] == "Registro") {
                        ID_TAG_reg = 'p' + pestana_int + 'zzz' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Elemento"];
                        triggerscc.push(Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Elemento"])
                        if (document.getElementById(ID_TAG_reg).value == "") {
                            FaltaDato = true
                            A_Where = A_Where + " '' "
                        } else {
                            A_Where = A_Where + " '" + document.getElementById(ID_TAG_reg).value + "' "
                        }

                    }
                    if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Tipo"] == "Campo") {

                        if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Funcion"] == "") {

                            A_Where = A_Where + " " + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Origen"] + '.' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Elemento"] + " "
                        }
                        if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Funcion"] == " ") {
                            A_Where = A_Where + " " + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Origen"] + '.' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Elemento"] + " "
                        }
                        if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Funcion"] == "Suma") {
                            A_Where = A_Where + " " + 'Sum(' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Origen"] + '.' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Elemento"] + ') '
                            A_GroupWhere = A_GroupWhere + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Grupo"] + ', '
                        }
                        if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Funcion"] == "Promedio") {
                            A_Where = A_Where + ' Avg(' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Origen"] + '.' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Elemento"] + ') '
                            A_GroupWhere = A_GroupWhere + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Grupo"] + ', '
                        }
                        if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Funcion"] == "Contar") {
                            A_Where = A_Where + ' Count(' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Origen"] + '.' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Elemento"] + ') '
                            A_GroupWhere = A_GroupWhere + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][2][x3]["Grupo"] + ', '
                        }
                    }


                }
                if (A_Where == 'Where ') { A_Where = '' }
                if (A_GroupWhere == "Group by ") { A_GroupWhere = "" } else { A_GroupWhere = A_GroupWhere.slice(0, -2) }


                for (x3 = 0; x3 < Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3].length; x3++) {


                    if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Tipo"] == "Valor") {
                        A_Select = A_Select + " '" + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Elemento"] + "' "
                    }
                    if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Tipo"] == "Operacion") {
                        A_Select = A_Select + " " + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Elemento"] + " "
                    }
                    if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Tipo"] == "Registro") {
                        ID_TAG_reg = 'p' + pestana_int + 'zzz' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Elemento"];
                        triggerscc.push(Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Elemento"])
                        if (document.getElementById(ID_TAG_reg).value == "") {
                            FaltaDato = true
                            A_Select = A_Select + " '' "
                        } else {
                            A_Select = A_Select + " '" + document.getElementById(ID_TAG_reg).value + "' "
                        }
                    }
                    if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Tipo"] == "Campo") {

                        if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Funcion"] == "") {

                            A_Select = A_Select + " " + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Origen"] + '.' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Elemento"] + " "
                        }
                        if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Funcion"] == " ") {
                            A_Select = A_Select + " " + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Origen"] + '.' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Elemento"] + " "
                        }
                        if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Funcion"] == "Suma") {
                            A_Select = A_Select + ' Sum(' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Origen"] + '.' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Elemento"] + ') '
                            A_Group = A_Group + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Grupo"] + ', '
                        }
                        if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Funcion"] == "Promedio") {
                            A_Select = A_Select + ' Avg(' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Origen"] + '.' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Elemento"] + ') '
                            A_Group = A_Group + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Grupo"] + ', '
                        }
                        if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Funcion"] == "Contar") {
                            A_Select = A_Select + ' Count(' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Origen"] + '.' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Elemento"] + ') '
                            A_Group = A_Group + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][3][x3]["Grupo"] + ', '
                        }
                    }
                }
                if (A_Group == "Group by ") { A_Group = "" } else { A_Group = A_Group.slice(0, -2) }

                A_Select = A_Select + " ) as '" + Response["campos_cab"][x]["Nombre"] + "'"
                if (A_Group == "") {
                    if (A_GroupWhere == "") {
                        sentencia = A_Select + " " + A_From + " " + A_Where
                    } else {
                        sentencia = A_Select + " " + A_From + " " + A_Where + " " + A_GroupWhere
                    }
                } else {
                    if (A_GroupWhere == "") {
                        sentencia = A_Select + " " + A_From + " " + A_Where + " " + A_Group
                    } else {
                        sentencia = A_Select + " " + A_From + " " + A_Where + " " + A_Group + ", " + A_GroupWhere.replace("Group by ", "")
                    }
                }

                if (FaltaDato == true && Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0][0]["Permite_nulo"] == "No") {
                    document.getElementById(ID_TAG).value = 0

                } else {
                    ID_TAG_resp = 'p' + pestana_int + 'zzz' + Response["campos_cab"][x]["Nombre"] + '';
                    ID_TAG_nombre = Response["campos_cab"][x]["Nombre"]

                    //sumir si se a modificado algun cmapo trigger directo
                    
                    if (offline == false) {
                        $.ajax({
                            type: 'POST',
                            url: '/consolidado',
                            data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'cmpsenten': sentencia, 'tag1': ID_TAG_resp, 'tag2': ID_TAG_nombre, 'usuario': web_usuario },
                            success: function (Response) {
                                if (Response["cmpvalor"].length == 0) {
                                    document.getElementById(Response["tag1"]).value = 0
                                } else {
                                    if (Response["cmpvalor"][0][Response["tag2"]] == null) {
                                        document.getElementById(Response["tag1"]).value = 0
                                    } else {
                                        document.getElementById(Response["tag1"]).value = Response["cmpvalor"][0][Response["tag2"]]
                                    }

                                }
                            }
                        });                    
                    }else{
                        document.getElementById(ID_TAG_resp).value = respuestas_pre[Response["campos_cab"][x]["PkId"]]
                    }
                }
              }else{ // modo offline =  true
                ID_TAG_resp = 'p' + pestana_int + 'zzz' + Response["campos_cab"][x]["Nombre"] + '';
                ID_TAG_nombre = Response["campos_cab"][x]["Nombre"]
                document.getElementById(ID_TAG_resp).value = respuestas_pre[Response["campos_cab"][x]["PkId"]]

              }
            }
            if (Response["campos_cab"][x]["TablaCampo"] == "cmpnumeroaletras") {
                ID_TAG_campo = 'p' + pestana_int + 'zzz' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["CampoNumero"] + '';

                document.getElementById(ID_TAG).value = numeroALetras(document.getElementById(ID_TAG_campo).value);

            }
            if (Response["campos_cab"][x]["TablaCampo"] == "cmpcondicional") {
                for (x3 = 0; x3 < Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1].length; x3++) {
                    if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["TipoA"] == "Campo") {
                        ID_TAG_campoA = 'p' + pestana_int + 'zzz' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["ElementoA"] + '';
                        valorA = document.getElementById(ID_TAG_campoA).value
                    } else {
                        valorA = Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["ElementoA"]
                    }
                    if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["TipoB"] == "Campo") {
                        ID_TAG_campoB = 'p' + pestana_int + 'zzz' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["ElementoB"] + '';
                        valorB = document.getElementById(ID_TAG_campoB).value
                    } else {
                        valorB = Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["ElementoB"]
                    }
                    if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["TipoC"] == "Campo") {
                        ID_TAG_campoC = 'p' + pestana_int + 'zzz' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["ElementoC"] + '';
                        valorC = document.getElementById(ID_TAG_campoC).value
                    } else {
                        valorC = Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["ElementoC"]
                    }

                    if(dovelverCondicional(Response["func_cab"][Response["campos_cab"][x]["Nombre"]][1][x3]["Operador"], valorA, valorB) == true){
                      document.getElementById(ID_TAG).value = valorC
                      break
                    }
                }
            }
        } 
    }  
}

function calcular_0_final(pestana_int) {



    Response = dict_pestalla['p-' + pestana_int]

    for (ee = 0; ee < (Response["campos_cab"].length); ee++) {
        if (ee < Response["campos_cab"].length) {

            if (Response["campos_cab"][ee]["Modificable"] == 'Si' || Response['tipo'] == 'Nuevo') {


                ID_TAG = 'p' + pestana_int + 'zzz' + Response["campos_cab"][ee]["Nombre"] + '';
                if (Response["campos_cab"][ee]["TablaCampo"] == "cmpnumsimple") {
                    if (document.getElementById(ID_TAG).value <= Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][0]["Menor"]) {
                        document.getElementById(ID_TAG).value = setTwoNumberDecimal(Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][0]["Menor"], Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][0]["NumDecimales"])
                    } else {
                        if (document.getElementById(ID_TAG).value >= Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][0]["Mayor"]) {
                            document.getElementById(ID_TAG).value = setTwoNumberDecimal(Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][0]["Mayor"], Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][0]["NumDecimales"])
                        } else {
                            document.getElementById(ID_TAG).value = setTwoNumberDecimal(document.getElementById(ID_TAG).value, Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][0]["NumDecimales"])
                        }

                    }
                }
                if (Response["campos_cab"][ee]["TablaCampo"] == "cmpformuladetalle") {
                    valor_final = 0;
                    cc_final = 0;

                    for (x2 = 0; x2 < (cc_porPesta['p-' + pestana_int] + 1); x2++) {

                        Campo_a_oper = Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][0][0]["Campo"]
                        Campo = Campo_a_oper.split(".")
                        ID_TAG_campo = 'pd' + pestana_int + 'fff' + x2 + 'ccc' + Campo[1]

                        if (document.getElementById(ID_TAG_campo) != null) {

                            Valor = parseFloat(document.getElementById(ID_TAG_campo).value)

                            excluido = 0;

                            for (x3 = 0; x3 < Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][1].length; x3++) {
                                valor_comparar = 0;
                                ID_TAG_campoA = 'pd' + pestana_int + 'fff' + x2 + 'ccc' + Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][1][x3]["Campo"]
                                if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][1][x3]["Tipo"] == "Valor") {
                                    valor_comparar = Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][1][x3]["Valor"]
                                } else {
                                    ID_TAG_compa = 'pd' + pestana_int + 'fff' + x2 + 'ccc' + Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][1][x3]["Valor"]
                                    valor_comparar = document.getElementById(ID_TAG_compa).value
                                }
                                if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][1][x3]["Operador"] == "=") { if (parseFloat(document.getElementById(ID_TAG_campoA).value) != parseFloat(valor_comparar)) { excluido = 1 } }
                                if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][1][x3]["Operador"] == "<") { if (parseFloat(document.getElementById(ID_TAG_campoA).value) >= parseFloat(valor_comparar)) { excluido = 1 } }
                                if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][1][x3]["Operador"] == ">") { if (parseFloat(document.getElementById(ID_TAG_campoA).value) <= parseFloat(valor_comparar)) { excluido = 1 } }
                                if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][1][x3]["Operador"] == "<=") { if (parseFloat(document.getElementById(ID_TAG_campoA).value) > parseFloat(valor_comparar)) { excluido = 1 } }
                                if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][1][x3]["Operador"] == ">=") { if (parseFloat(document.getElementById(ID_TAG_campoA).value) < parseFloat(valor_comparar)) { excluido = 1 } }
                                if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][1][x3]["Operador"] == "!=") { if (document.getElementById(ID_TAG_campoA).value == valor_comparar) { excluido = 1 } }
                                if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][1][x3]["Operador"] == "igual") { if (document.getElementById(ID_TAG_campoA).value != valor_comparar) { excluido = 1 } }
                                if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][1][x3]["Operador"] == "no igual") { if (document.getElementById(ID_TAG_campoA).value == valor_comparar) { excluido = 1 } }
    
                            }

                            if (excluido == 0) {
                                if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][0][0]["Operacion"] == "Suma") {
                                    valor_final = parseFloat(valor_final) + parseFloat(Valor)
                                }
                                if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][0][0]["Operacion"] == "Promedio") {
                                    valor_final = parseFloat(valor_final) + parseFloat(Valor)
                                    cc_final = cc_final + 1
                                }
                                if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][0][0]["Operacion"] == "Maximo") {
                                    if (parseFloat(valor_final) < parseFloat(Valor)) { valor_final = Valor }
                                }
                                if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][0][0]["Operacion"] == "Minimo") {
                                    if (parseFloat(valor_final) > parseFloat(Valor)) { valor_final = Valor }
                                }
                                if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][0][0]["Operacion"] == "Contar") {
                                    cc_final = cc_final + 1
                                }
                            }
                        }
                    }
                    if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][0][0]["Operacion"] == "Suma") {
                        document.getElementById(ID_TAG).value = setTwoNumberDecimal(valor_final, 2)
                    }
                    if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][0][0]["Operacion"] == "Promedio") {
                        valor_final = valor_final / (cc_final + 1)
                        document.getElementById(ID_TAG).value = setTwoNumberDecimal(valor_final, 2)
                    }
                    if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][0][0]["Operacion"] == "Maximo") {
                        document.getElementById(ID_TAG).value = setTwoNumberDecimal(valor_final, 2)
                    }
                    if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][0][0]["Operacion"] == "Minimo") {
                        document.getElementById(ID_TAG).value = setTwoNumberDecimal(valor_final, 2)
                    }
                    if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][0][0]["Operacion"] == "Contar") {
                        document.getElementById(ID_TAG).value = cc_final
                    }
                }
                if (Response["campos_cab"][ee]["TablaCampo"] == "cmpnumsecuencial") {

                    if ('Pk' + Response["tabla_cab"]["Nombre"] != Response["campos_cab"][ee]["Nombre"]) {
                        id_tag_ajax = ID_TAG
                        if (offline == false){
                            $.ajax({
                                type: 'POST',
                                async: false,
                                url: '/cmpnumsecuencial',
                                data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'PkEstructura': Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][0]['PkEstructura'], 'Nombre': Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][0]['Nombre'], 'Aumento': Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][0]['Aumento'], 'usuario': web_usuario, 'id_tag_ajax': id_tag_ajax },
                                success: function (Response) {
                                    if (Response["cmpvalor"].length == 0) {
                                        document.getElementById(Response["tag1"]).value = 0
                                    } else {
                                        document.getElementById(Response["tag1"]).value = Response["cmpvalor"]
                                    }
                                }
                            });
                        }else{
                            document.getElementById(id_tag_ajax).value = respuestas_pre[Response["tabla_cab"]["PkId"]]
                        }

                    }



                }
                if (Response["campos_cab"][ee]["TablaCampo"] == "cmpsistema") {

                    if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][0]["PkId"] == 1) {
                        temp_sentencia = 'select now() as "tiempo"'
                        id_tag_ajax = ID_TAG
                        if (offline == false){
                            $.ajax({
                                type: 'POST',
                                url: '/consolidado',
                                data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'cmpsenten': temp_sentencia, 'tag1': id_tag_ajax, 'tag2': 0, 'usuario': web_usuario },
                                success: function (Response) {
                                    if (Response["cmpvalor"].length == 0) {
                                        document.getElementById(Response["tag1"]).value = 0
                                    } else {
                                        document.getElementById(Response["tag1"]).value = Response["cmpvalor"][0]['tiempo']
                                    }
                                }
                            });
                        }else{
                            var now = new Date();
                            document.getElementById(ID_TAG).value = now.format("Y-m-d") + 'T' + now.format("H:i:s")
        
                        }


                    }
                    if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][0]["PkId"] == 2) {
                        document.getElementById(ID_TAG).value = web_usuario
                    }
                    if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][0]["PkId"] == 3) {
                        temp_sentencia = 'select now() as "tiempo"'
                        $.ajax({
                            type: 'POST',
                            url: '/consolidado',
                            async: false,
                            data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'cmpsenten': temp_sentencia, 'tag1': ID_TAG, 'tag2': ID_TAG, 'usuario': web_usuario },
                            success: function (Response) {
                                if (Response["cmpvalor"].length == 0) {
                                    document.getElementById(Response["tag1"]).value = 0
                                } else {
                                    if (Response["cmpvalor"][0][Response["tag2"]] == null) {
                                        document.getElementById(Response["tag1"]).value = 0
                                    } else {
                                        document.getElementById(Response["tag1"]).value = Response["cmpvalor"][0]['tiempo']
                                    }

                                }
                            }
                        });
                    }

                }
                if (Response["campos_cab"][ee]["TablaCampo"] == "cmpreferencia") {
                }

                if (Response["campos_cab"][ee]["TablaCampo"] == "cmpreferenciaadjunto") {
                }
                if (Response["campos_cab"][ee]["TablaCampo"] == "cmpoperacion") {
                    temp = 0.0;
                    operador = "=";
                    Valor = 0.0;

                    for (x3 = 0; x3 < Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][1].length; x3++) {
                        if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][1][x3]["Estado"] == "C") {

                            ID_TAG_campo = 'p' + pestana_int + 'zzz' + Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][1][x3]["Sentencia"] + '';
                            if (document.getElementById(ID_TAG_campo).value == "") {
                                Valor = 0.0
                            } else {
                                Valor = document.getElementById(ID_TAG_campo).value
                            }

                            if (operador == "=") { temp = parseFloat(Valor) }
                            if (operador == "+") { temp = parseFloat(temp) + parseFloat(Valor) }
                            if (operador == "-") { temp = parseFloat(temp) - parseFloat(Valor) }
                            if (operador == "*") { temp = parseFloat(temp) * parseFloat(Valor) }
                            if (operador == "/") {
                                if (Valor > 0) { temp = parseFloat(temp) / parseFloat(Valor) }
                            }
                            if (operador == "Juntar") { temp = temp.toString() + Valor.toString() }
                        }
                        if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][1][x3]["Estado"] == "O") {
                            operador = Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][1][x3]["Sentencia"]
                        }
                        if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][1][x3]["Estado"] == "V") {
                            Valor = Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][1][x3]["Sentencia"]
                            if (operador == "=") { temp = parseFloat(Valor) }
                            if (operador == "+") { temp = parseFloat(temp) + parseFloat(Valor) }
                            if (operador == "-") { temp = parseFloat(temp) - parseFloat(Valor) }
                            if (operador == "*") { temp = parseFloat(temp) * parseFloat(Valor) }
                            if (operador == "/") {
                                if (Valor > 0) { temp = parseFloat(temp) / parseFloat(Valor) }
                            }
                            if (operador == "Juntar") { temp = temp.toString() + Valor.toString() }
                        }
                    }
                    temp = setTwoNumberDecimal(temp, Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][0][0]["Decimales"])
                    document.getElementById(ID_TAG).value = temp
                }
                if (Response["campos_cab"][ee]["TablaCampo"] == "cmpconsolidado") {

                    A_Select = 'Select ( '
                    A_From = 'From '
                    A_Where = 'Where '
                    A_Group = 'Group by '
                    A_GroupWhere = 'Group by '
                    sentencia = ""
                    FaltaDato = false



                    for (x3 = 0; x3 < Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][1].length; x3++) {
                        A_From = A_From + Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][1][x3]["Tabla"] + ' as ' + Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][1][x3]["Nombre"] + ', '
                    }
                    if (A_From == "From ") { A_From = "" } else { A_From = A_From.slice(0, -2) }

                    for (x3 = 0; x3 < Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][2].length; x3++) {

                        if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][2][x3]["Tipo"] == "Valor") {
                            A_Where = A_Where + " '" + Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][2][x3]["Elemento"] + "' "
                        }
                        if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][2][x3]["Tipo"] == "Operacion") {
                            A_Where = A_Where + " " + Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][2][x3]["Elemento"] + " "
                        }
                        if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][2][x3]["Tipo"] == "Registro") {
                            ID_TAG_reg = 'p' + pestana_int + 'zzz' + Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][2][x3]["Elemento"];

                            if (document.getElementById(ID_TAG_reg).value == "") {
                                FaltaDato = true
                                A_Where = A_Where + " '' "
                            } else {
                                A_Where = A_Where + " '" + document.getElementById(ID_TAG_reg).value + "' "
                            }

                        }
                        if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][2][x3]["Tipo"] == "Campo") {

                            if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][2][x3]["Funcion"] == "") {

                                A_Where = A_Where + " " + Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][2][x3]["Origen"] + '.' + Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][2][x3]["Elemento"] + " "
                            }
                            if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][2][x3]["Funcion"] == " ") {
                                A_Where = A_Where + " " + Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][2][x3]["Origen"] + '.' + Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][2][x3]["Elemento"] + " "
                            }
                            if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][2][x3]["Funcion"] == "Suma") {
                                A_Where = A_Where + " " + 'Sum(' + Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][2][x3]["Origen"] + '.' + Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][2][x3]["Elemento"] + ') '
                                A_GroupWhere = A_GroupWhere + Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][2][x3]["Grupo"] + ', '
                            }
                            if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][2][x3]["Funcion"] == "Promedio") {
                                A_Where = A_Where + ' Avg(' + Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][2][x3]["Origen"] + '.' + Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][2][x3]["Elemento"] + ') '
                                A_GroupWhere = A_GroupWhere + Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][2][x3]["Grupo"] + ', '
                            }
                            if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][2][x3]["Funcion"] == "Contar") {
                                A_Where = A_Where + ' Count(' + Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][2][x3]["Origen"] + '.' + Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][2][x3]["Elemento"] + ') '
                                A_GroupWhere = A_GroupWhere + Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][2][x3]["Grupo"] + ', '
                            }
                        }


                    }
                    if (A_Where == 'Where ') { A_Where = '' }
                    if (A_GroupWhere == "Group by ") { A_GroupWhere = "" } else { A_GroupWhere = A_GroupWhere.slice(0, -2) }


                    for (x3 = 0; x3 < Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][3].length; x3++) {


                        if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][3][x3]["Tipo"] == "Valor") {
                            A_Select = A_Select + " '" + Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][3][x3]["Elemento"] + "' "
                        }
                        if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][3][x3]["Tipo"] == "Operacion") {
                            A_Select = A_Select + " " + Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][3][x3]["Elemento"] + " "
                        }
                        if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][3][x3]["Tipo"] == "Registro") {
                            ID_TAG_reg = 'p' + pestana_int + 'zzz' + Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][3][x3]["Elemento"];

                            if (document.getElementById(ID_TAG_reg).value == "") {
                                FaltaDato = true
                                A_Select = A_Select + " '' "
                            } else {
                                A_Select = A_Select + " '" + document.getElementById(ID_TAG_reg).value + "' "
                            }
                        }
                        if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][3][x3]["Tipo"] == "Campo") {

                            if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][3][x3]["Funcion"] == "") {

                                A_Select = A_Select + " " + Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][3][x3]["Origen"] + '.' + Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][3][x3]["Elemento"] + " "
                            }
                            if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][3][x3]["Funcion"] == " ") {
                                A_Select = A_Select + " " + Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][3][x3]["Origen"] + '.' + Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][3][x3]["Elemento"] + " "
                            }
                            if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][3][x3]["Funcion"] == "Suma") {
                                A_Select = A_Select + ' Sum(' + Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][3][x3]["Origen"] + '.' + Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][3][x3]["Elemento"] + ') '
                                A_Group = A_Group + Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][3][x3]["Grupo"] + ', '
                            }
                            if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][3][x3]["Funcion"] == "Promedio") {
                                A_Select = A_Select + ' Avg(' + Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][3][x3]["Origen"] + '.' + Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][3][x3]["Elemento"] + ') '
                                A_Group = A_Group + Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][3][x3]["Grupo"] + ', '
                            }
                            if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][3][x3]["Funcion"] == "Contar") {
                                A_Select = A_Select + ' Count(' + Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][3][x3]["Origen"] + '.' + Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][3][x3]["Elemento"] + ') '
                                A_Group = A_Group + Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][3][x3]["Grupo"] + ', '
                            }
                        }
                    }
                    if (A_Group == "Group by ") { A_Group = "" } else { A_Group = A_Group.slice(0, -2) }

                    A_Select = A_Select + " ) as '" + Response["campos_cab"][ee]["Nombre"] + "'"
                    if (A_Group == "") {
                        if (A_GroupWhere == "") {
                            sentencia = A_Select + " " + A_From + " " + A_Where
                        } else {
                            sentencia = A_Select + " " + A_From + " " + A_Where + " " + A_GroupWhere
                        }
                    } else {
                        if (A_GroupWhere == "") {
                            sentencia = A_Select + " " + A_From + " " + A_Where + " " + A_Group
                        } else {
                            sentencia = A_Select + " " + A_From + " " + A_Where + " " + A_Group + ", " + A_GroupWhere.replace("Group by ", "")
                        }
                    }

                    if (FaltaDato == true && Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][0][0]["Permite_nulo"] == "No") {
                        document.getElementById(ID_TAG).value = 0

                    } else {
                        ID_TAG_resp = 'p' + pestana_int + 'zzz' + Response["campos_cab"][ee]["Nombre"] + '';
                        ID_TAG_nombre = Response["campos_cab"][ee]["Nombre"]
                        if (offline == false){
                            $.ajax({
                                type: 'POST',
                                async: false,
                                url: '/consolidado',
                                data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'cmpsenten': sentencia, 'tag1': ID_TAG_resp, 'tag2': ID_TAG_nombre, 'usuario': web_usuario },
                                success: function (Response) {
                                    if (Response["cmpvalor"].length == 0) {
                                        document.getElementById(Response["tag1"]).value = 0
                                    } else {
                                        if (Response["cmpvalor"][0][Response["tag2"]] == null) {
                                            document.getElementById(Response["tag1"]).value = 0
                                        } else {
                                            document.getElementById(Response["tag1"]).value = Response["cmpvalor"][0][Response["tag2"]]
                                        }
                                    }
                                }
                            });
                        }else{
                            document.getElementById(ID_TAG_resp).value = respuestas_pre[Response["campos_cab"][ee]["PkId"]]
                        }

                    }
                }
                if (Response["campos_cab"][ee]["TablaCampo"] == "cmpnumeroaletras") {
                    ID_TAG_campo = 'p' + pestana_int + 'zzz' + Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][0]["CampoNumero"] + '';

                    document.getElementById(ID_TAG).value = numeroALetras(document.getElementById(ID_TAG_campo).value);

                }
                if (Response["campos_cab"][ee]["TablaCampo"] == "cmpcondicional") {
                    for (x3 = 0; x3 < Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][1].length; x3++) {
                        if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][1][x3]["TipoA"] == "Campo") {
                            ID_TAG_campoA = 'p' + pestana_int + 'zzz' + Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][1][x3]["ElementoA"] + '';
                            valorA = document.getElementById(ID_TAG_campoA).value
                        } else {
                            valorA = Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][1][x3]["ElementoA"]
                        }
                        if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][1][x3]["TipoB"] == "Campo") {
                            ID_TAG_campoB = 'p' + pestana_int + 'zzz' + Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][1][x3]["ElementoB"] + '';
                            valorB = document.getElementById(ID_TAG_campoB).value
                        } else {
                            valorB = Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][1][x3]["ElementoB"]
                        }
                        if (Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][1][x3]["TipoC"] == "Campo") {
                            ID_TAG_campoC = 'p' + pestana_int + 'zzz' + Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][1][x3]["ElementoC"] + '';
                            valorC = document.getElementById(ID_TAG_campoC).value
                        } else {
                            valorC = Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][1][x3]["ElementoC"]
                        }

                        if(dovelverCondicional(Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][1][x3]["Operador"], valorA, valorB) == true){
                          document.getElementById(ID_TAG).value = valorC
                          break
                        }
                    }
                }
            }
        }
    }
}



function calcular_detalleV2(pestana_int, fila) {
  Response = dict_pestalla['p-' + pestana_int]

  for (x = 0; x < Response["campos_det"].length; x++) {
      ID_TAG = 'pd' + pestana_int + 'fff' + fila + 'ccc' + Response["campos_det"][x]["Nombre"] + '';
      if (document.getElementById(ID_TAG) != null) {
          if (Response["campos_det"][x]["TablaCampo"] == "cmpnumsimple") {
              if (parseFloat(document.getElementById(ID_TAG).value) <= parseFloat(Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Menor"])) {
                  document.getElementById(ID_TAG).value = setTwoNumberDecimal(Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Menor"], Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["NumDecimales"])
              } else {
                  if (parseFloat(document.getElementById(ID_TAG).value) >= parseFloat(Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Mayor"])) {
                      document.getElementById(ID_TAG).value = setTwoNumberDecimal(Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Mayor"], Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["NumDecimales"])
                  } else {
                      document.getElementById(ID_TAG).value = setTwoNumberDecimal(document.getElementById(ID_TAG).value, Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["NumDecimales"])
                  }
              }
          }
          if (Response["campos_det"][x]["TablaCampo"] == "cmpformuladetalle") {
              valor_final = 0;
              cc_final = 0;

              for (x2 = 0; x2 < (ccsub_porPesta['p-' + pestana_int] + 1); x2++) {

                  excluido = 0;

                  for (x3 = 0; x3 < Response["func_det"][Response["campos_det"][x]["Nombre"]][1].length; x3++) {
                      valor_comparar = 0;

                      ID_TAG_campo = 'ps' + pestana_int + 'qqq' + x2 + 'yyy' + fila + 'www' + Response["func_det"][Response["campos_det"][x]["Nombre"]][1][x3]["Campo"]
                      if (Response["func_det"][Response["campos_det"][x]["Nombre"]][1][x3]["Tipo"] == "Valor") {
                          valor_comparar = Response["func_det"][Response["campos_det"][x]["Nombre"]][1][x3]["Valor"]
                      } else {
                          ID_TAG_compa = 'ps' + pestana_int + 'qqq' + x2 + 'yyy' + fila + 'www' + Response["func_det"][Response["campos_det"][x]["Nombre"]][1][x3]["Valor"]
                          valor_comparar = document.getElementById(ID_TAG_compa).value
                      }
                      if (Response["func_det"][Response["campos_det"][x]["Nombre"]][1][x3]["Operador"] == "=") {
                          if (document.getElementById(ID_TAG_campo).value != valor_comparar) {
                              excluido = 1
                          }
                      }
                      if (Response["func_det"][Response["campos_det"][x]["Nombre"]][1][x3]["Operador"] == "!=") {
                        if (document.getElementById(ID_TAG_campo).value == valor_comparar) {
                            excluido = 1
                        }
                    }
                      if (Response["func_det"][Response["campos_det"][x]["Nombre"]][1][x3]["Operador"] == "<") {
                          if (document.getElementById(ID_TAG_campo).value >= valor_comparar) {
                              excluido = 1
                          }
                      }
                      if (Response["func_det"][Response["campos_det"][x]["Nombre"]][1][x3]["Operador"] == ">") {
                          if (document.getElementById(ID_TAG_campo).value <= valor_comparar) {
                              excluido = 1
                          }
                      }
                      if (Response["func_det"][Response["campos_det"][x]["Nombre"]][1][x3]["Operador"] == "<=") {
                          if (document.getElementById(ID_TAG_campo).value > valor_comparar) {
                              excluido = 1
                          }
                      }
                      if (Response["func_det"][Response["campos_det"][x]["Nombre"]][1][x3]["Operador"] == ">=") {
                          if (document.getElementById(ID_TAG_campo).value < valor_comparar) {
                              excluido = 1
                          }
                      }
                  }

                  if (excluido == 0) {

                      Campo_a_oper = Response["func_det"][Response["campos_det"][x]["Nombre"]][0][0]["Campo"]
                      Campo = Campo_a_oper.split(".")
                      ID_TAG_campo = 'ps' + pestana_int + 'qqq' + x2 + 'yyy' + fila + 'www' + Campo[1]

                      if (document.getElementById(ID_TAG_campo) != null) {
                          Valor = parseFloat(document.getElementById(ID_TAG_campo).value)

                          if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0][0]["Operacion"] == "Suma") {
                              valor_final = parseFloat(valor_final) + parseFloat(Valor)
                          }
                          if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0][0]["Operacion"] == "Promedio") {
                              valor_final = parseFloat(valor_final) + parseFloat(Valor)
                              cc_final = cc_final + 1
                          }
                          if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0][0]["Operacion"] == "Maximo") {
                              if (parseFloat(valor_final) < parseFloat(Valor)) { valor_final = Valor }
                          }
                          if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0][0]["Operacion"] == "Minimo") {
                              if (parseFloat(valor_final) > parseFloat(Valor)) { valor_final = Valor }
                          }
                          if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0][0]["Operacion"] == "Contar") {
                              cc_final = cc_final + 1
                          }
                      }
                  }
              }

              if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0][0]["Operacion"] == "Suma") {
                  document.getElementById(ID_TAG).value = setTwoNumberDecimal(valor_final, 2)
              }
              if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0][0]["Operacion"] == "Promedio") {
                  valor_final = valor_final / (cc_final + 1)
                  document.getElementById(ID_TAG).value = setTwoNumberDecimal(valor_final, 2)
              }
              if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0][0]["Operacion"] == "Maximo") {
                  document.getElementById(ID_TAG).value = setTwoNumberDecimal(valor_final, 2)
              }
              if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0][0]["Operacion"] == "Minimo") {
                  document.getElementById(ID_TAG).value = setTwoNumberDecimal(valor_final, 2)
              }
              if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0][0]["Operacion"] == "Contar") {
                  document.getElementById(ID_TAG).value = cc_final

              }
          }
          if (Response["campos_det"][x]["TablaCampo"] == "cmpfecha") {
          }
          if (Response["campos_det"][x]["TablaCampo"] == "cmpreferencia") {
          }
          if (Response["campos_det"][x]["TablaCampo"] == "cmpreferenciaadjunto") {
          }
          if (Response["campos_det"][x]["TablaCampo"] == "cmpoperacion") {
              temp = 0.0;
              operador = "=";
              Valor = 0.0;

              for (x3 = 0; x3 < Response["func_det"][Response["campos_det"][x]["Nombre"]][1].length; x3++) {
                  if (Response["func_det"][Response["campos_det"][x]["Nombre"]][1][x3]["Estado"] == "C") {

                      ID_TAG_campo = 'pd' + pestana_int + 'fff' + fila + 'ccc' + Response["func_det"][Response["campos_det"][x]["Nombre"]][1][x3]["Sentencia"] + '';
                      if (document.getElementById(ID_TAG_campo).value == "") {
                          Valor = 0.0
                      } else {
                          Valor = document.getElementById(ID_TAG_campo).value
                      }

                      if (operador == "=") {
                          temp = parseFloat(Valor)
                      }
                      if (operador == "+") {
                          temp = parseFloat(temp) + parseFloat(Valor)
                      }
                      if (operador == "-") {
                          temp = parseFloat(temp) - parseFloat(Valor)
                      }
                      if (operador == "*") {
                          temp = parseFloat(temp) * parseFloat(Valor)
                      }
                      if (operador == "/") {
                          if (Valor > 0) {
                              temp = parseFloat(temp) / parseFloat(Valor)
                          }
                      }
                      if (operador == "Juntar") { temp = temp.toString() + Valor.toString() }
                  }
                  if (Response["func_det"][Response["campos_det"][x]["Nombre"]][1][x3]["Estado"] == "O") {
                      operador = Response["func_det"][Response["campos_det"][x]["Nombre"]][1][x3]["Sentencia"]
                  }
                  if (Response["func_det"][Response["campos_det"][x]["Nombre"]][1][x3]["Estado"] == "V") {
                      Valor = Response["func_det"][Response["campos_det"][x]["Nombre"]][1][x3]["Sentencia"]
                      if (operador == "=") {
                          temp = parseFloat(Valor)
                      }
                      if (operador == "+") {
                          temp = parseFloat(temp) + parseFloat(Valor)
                      }
                      if (operador == "-") {
                          temp = parseFloat(temp) - parseFloat(Valor)
                      }
                      if (operador == "*") {
                          temp = parseFloat(temp) * parseFloat(Valor)
                      }
                      if (operador == "/") {
                          if (Valor > 0) {
                              temp = parseFloat(temp) / parseFloat(Valor)
                          }
                      }
                      if (operador == "Juntar") { temp = temp.toString() + Valor.toString() }
                  }
              }
              temp = setTwoNumberDecimal(temp, Response["func_det"][Response["campos_det"][x]["Nombre"]][0][0]["Decimales"])
              document.getElementById(ID_TAG).value = temp
          }
          //comentado por faiclitar base de datow
          // if (Response["campos_det"][x]["TablaCampo"] == "cmpconsolidado") {

          //     A_Select = 'Select ( '
          //     A_From = 'From '
          //     A_Where = 'Where '
          //     A_Group = 'Group by '
          //     A_GroupWhere = 'Group by '
          //     sentencia = ""
          //     FaltaDato = false



          //     for (x3 = 0; x3 < Response["func_det"][Response["campos_det"][x]["Nombre"]][1].length; x3++) {
          //         A_From = A_From + Response["func_det"][Response["campos_det"][x]["Nombre"]][1][x3]["Tabla"] + ' as ' + Response["func_det"][Response["campos_det"][x]["Nombre"]][1][x3]["Nombre"] + ', '
          //     }
          //     if (A_From == "From ") { A_From = "" } else { A_From = A_From.slice(0, -2) }

          //     for (x3 = 0; x3 < Response["func_det"][Response["campos_det"][x]["Nombre"]][2].length; x3++) {

          //         if (Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Tipo"] == "Valor") {
          //             A_Where = A_Where + " '" + Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Elemento"] + "' "
          //         }
          //         if (Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Tipo"] == "Operacion") {
          //             A_Where = A_Where + ' ' + Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Elemento"] + ' '
          //         }
          //         if (Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Tipo"] == "Registro") {
          //             ID_TAG_reg = 'pd' + pestana_int + 'fff' + fila + 'ccc' + Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Elemento"];

          //             if (document.getElementById(ID_TAG_reg).value == "") {
          //                 FaltaDato = true
          //                 A_Where = A_Where + " '' "
          //             } else {
          //                 A_Where = A_Where + " '" + document.getElementById(ID_TAG_reg).value + "' "
          //             }
          //         }
          //         if (Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Tipo"] == "Campo") {

          //             if (Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Funcion"] == "") {

          //                 A_Where = A_Where + ' ' + Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Origen"] + '.' + Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Elemento"] + ' '
          //             }
          //             if (Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Funcion"] == " ") {
          //                 A_Where = A_Where + ' ' + Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Origen"] + '.' + Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Elemento"] + ' '
          //             }
          //             if (Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Funcion"] == "Suma") {
          //                 A_Where = A_Where + ' Sum(' + Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Origen"] + '.' + Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Elemento"] + ') '
          //                 A_GroupWhere = A_GroupWhere + Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Grupo"] + ', '
          //             }
          //             if (Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Funcion"] == "Promedio") {
          //                 A_Where = A_Where + ' Avg(' + Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Origen"] + '.' + Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Elemento"] + ') '
          //                 A_GroupWhere = A_GroupWhere + Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Grupo"] + ', '
          //             }
          //             if (Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Funcion"] == "Contar") {
          //                 A_Where = A_Where + ' Count(' + Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Origen"] + '.' + Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Elemento"] + ') '
          //                 A_GroupWhere = A_GroupWhere + Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Grupo"] + ', '
          //             }
          //         }


          //     }
          //     if (A_GroupWhere == "Group by ") { A_GroupWhere = "" } else { A_GroupWhere = A_GroupWhere.slice(0, -2) }
          //     if (A_Where == "Where ") { A_Where = "" }

          //     for (x3 = 0; x3 < Response["func_det"][Response["campos_det"][x]["Nombre"]][3].length; x3++) {


          //         if (Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Tipo"] == "Valor") {
          //             A_Select = A_Select + " '" + Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Elemento"] + "' "
          //         }
          //         if (Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Tipo"] == "Operacion") {
          //             A_Select = A_Select + " " + Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Elemento"] + " "
          //         }
          //         if (Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Tipo"] == "Registro") {
          //             ID_TAG_reg = 'pd' + pestana_int + 'fff' + fila + 'ccc' + Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Elemento"];

          //             if (document.getElementById(ID_TAG_reg).value == "") {
          //                 FaltaDato = true
          //                 A_Select = A_Select + " '' "

          //             } else {
          //                 A_Select = A_Select + " '" + document.getElementById(ID_TAG_reg).value + "' "
          //             }
          //         }
          //         if (Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Tipo"] == "Campo") {

          //             if (Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Funcion"] == "") {

          //                 A_Select = A_Select + " " + Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Origen"] + '.' + Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Elemento"] + " "
          //             }
          //             if (Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Funcion"] == " ") {
          //                 A_Select = A_Select + " " + Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Origen"] + '.' + Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Elemento"] + " "
          //             }
          //             if (Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Funcion"] == "Suma") {
          //                 A_Select = A_Select + ' Sum(' + Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Origen"] + '.' + Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Elemento"] + ') '
          //                 A_Group = A_Group + Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Grupo"] + ', '
          //             }
          //             if (Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Funcion"] == "Promedio") {
          //                 A_Select = A_Select + ' Avg(' + Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Origen"] + '.' + Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Elemento"] + ') '
          //                 A_Group = A_Group + Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Grupo"] + ', '
          //             }
          //             if (Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Funcion"] == "Contar") {
          //                 A_Select = A_Select + ' Count(' + Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Origen"] + '.' + Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Elemento"] + ') '
          //                 A_Group = A_Group + Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Grupo"] + ', '
          //             }
          //         }
          //     }
          //     if (A_Group == "Group by ") { A_Group = "" } else { A_Group = A_Group.slice(0, -2) }

          //     A_Select = A_Select + " ) as '" + Response["campos_det"][x]["Nombre"] + "' "
          //     if (A_Group == "") {
          //         if (A_GroupWhere == "") {
          //             sentencia = A_Select + " " + A_From + " " + A_Where
          //         } else {
          //             sentencia = A_Select + " " + A_From + " " + A_Where + " " + A_GroupWhere
          //         }
          //     } else {
          //         if (A_GroupWhere == "") {
          //             sentencia = A_Select + " " + A_From + " " + A_Where + " " + A_Group
          //         } else {
          //             sentencia = A_Select + " " + A_From + " " + A_Where + " " + A_Group + ", " + A_GroupWhere.replace("Group by ", "")
          //         }
          //     }

          //     if (FaltaDato == true && Response["func_det"][Response["campos_det"][x]["Nombre"]][0][0]["Permite_nulo"] == "No") {
          //         document.getElementById(ID_TAG).value = 0
          //     } else {
          //         ID_TAG_resp = 'pd' + pestana_int + 'fff' + fila + 'ccc' + Response["campos_det"][x]["Nombre"] + '';
          //         ID_TAG_nombre = Response["campos_det"][x]["Nombre"]
          //         if (offline == false){
          //             $.ajax({
          //                 type: 'POST',
          //                 url: '/consolidado',
          //                 data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'cmpsenten': sentencia, 'tag1': ID_TAG_resp, 'tag2': ID_TAG_nombre, 'usuario': web_usuario },
          //                 success: function (Response) {
          //                     if (Response["cmpvalor"].length > 0) {
          //                         if (Response["cmpvalor"][0][Response["tag2"]] == null) {
          //                             document.getElementById(Response["tag1"]).value = 0
          //                         } else {
          //                             document.getElementById(Response["tag1"]).value = Response["cmpvalor"][0][Response["tag2"]]
          //                             calcular_detalle_no_base(pestana_int, fila)
          //                         }
          //                     } else {
          //                         document.getElementById(Response["tag1"]).value = 0

          //                     }
          //                 }
          //             });
          //         }else{
          //             document.getElementById(ID_TAG_resp).value = respuestas_pre[Response["campos_det"][x]["PkId"]]
          //         }
          //     }
          // }
          if (Response["campos_det"][x]["TablaCampo"] == "cmpnumeroaletras") {
              document.getElementById(ID_TAG).value = numeroALetras(document.getElementById(ID_TAG).value);

          }
          if (Response["campos_det"][x]["TablaCampo"] == "cmpdecabecera") {
              id_cab = 'p' + pestana_int + 'zzz' + Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Campo"]
              document.getElementById(ID_TAG).value = document.getElementById(id_cab).value
          }
          if (Response["campos_det"][x]["TablaCampo"] == "cmpcondicional") {
            document.getElementById(ID_TAG).value = calcular_det_cmpcondicional(pestana_int, fila, Response["campos_det"][x]["Nombre"]);
        }
        
      }
  }
  //calcular_0(pestana_int)
  calcular_0_v2(pestana_int,[])

  //calcular_detalleV2
}

function calcular_detalle(pestana_int, fila) {
    Response = dict_pestalla['p-' + pestana_int]

    for (x = 0; x < Response["campos_det"].length; x++) {
        ID_TAG = 'pd' + pestana_int + 'fff' + fila + 'ccc' + Response["campos_det"][x]["Nombre"] + '';
        if (document.getElementById(ID_TAG) != null) {
            if (Response["campos_det"][x]["TablaCampo"] == "cmpnumsimple") {
                if (parseFloat(document.getElementById(ID_TAG).value) <= parseFloat(Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Menor"])) {
                    document.getElementById(ID_TAG).value = setTwoNumberDecimal(Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Menor"], Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["NumDecimales"])
                } else {
                    if (parseFloat(document.getElementById(ID_TAG).value) >= parseFloat(Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Mayor"])) {
                        document.getElementById(ID_TAG).value = setTwoNumberDecimal(Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Mayor"], Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["NumDecimales"])
                    } else {
                        document.getElementById(ID_TAG).value = setTwoNumberDecimal(document.getElementById(ID_TAG).value, Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["NumDecimales"])
                    }
                }
            }
            if (Response["campos_det"][x]["TablaCampo"] == "cmpformuladetalle") {
                valor_final = 0;
                cc_final = 0;

                for (x2 = 0; x2 < (ccsub_porPesta['p-' + pestana_int] + 1); x2++) {

                    excluido = 0;

                    for (x3 = 0; x3 < Response["func_det"][Response["campos_det"][x]["Nombre"]][1].length; x3++) {
                        valor_comparar = 0;

                        ID_TAG_campo = 'ps' + pestana_int + 'qqq' + x2 + 'yyy' + fila + 'www' + Response["func_det"][Response["campos_det"][x]["Nombre"]][1][x3]["Campo"]
                        if (Response["func_det"][Response["campos_det"][x]["Nombre"]][1][x3]["Tipo"] == "Valor") {
                            valor_comparar = Response["func_det"][Response["campos_det"][x]["Nombre"]][1][x3]["Valor"]
                        } else {
                            ID_TAG_compa = 'ps' + pestana_int + 'qqq' + x2 + 'yyy' + fila + 'www' + Response["func_det"][Response["campos_det"][x]["Nombre"]][1][x3]["Valor"]
                            valor_comparar = document.getElementById(ID_TAG_compa).value
                        }
                        if (Response["func_det"][Response["campos_det"][x]["Nombre"]][1][x3]["Operador"] == "=") {
                            if (document.getElementById(ID_TAG_campo).value != valor_comparar) {
                                excluido = 1
                            }
                        }
                        if (Response["func_det"][Response["campos_det"][x]["Nombre"]][1][x3]["Operador"] == "!=") {
                          if (document.getElementById(ID_TAG_campo).value == valor_comparar) {
                              excluido = 1
                          }
                      }
                        if (Response["func_det"][Response["campos_det"][x]["Nombre"]][1][x3]["Operador"] == "<") {
                            if (document.getElementById(ID_TAG_campo).value >= valor_comparar) {
                                excluido = 1
                            }
                        }
                        if (Response["func_det"][Response["campos_det"][x]["Nombre"]][1][x3]["Operador"] == ">") {
                            if (document.getElementById(ID_TAG_campo).value <= valor_comparar) {
                                excluido = 1
                            }
                        }
                        if (Response["func_det"][Response["campos_det"][x]["Nombre"]][1][x3]["Operador"] == "<=") {
                            if (document.getElementById(ID_TAG_campo).value > valor_comparar) {
                                excluido = 1
                            }
                        }
                        if (Response["func_det"][Response["campos_det"][x]["Nombre"]][1][x3]["Operador"] == ">=") {
                            if (document.getElementById(ID_TAG_campo).value < valor_comparar) {
                                excluido = 1
                            }
                        }
                    }

                    if (excluido == 0) {

                        Campo_a_oper = Response["func_det"][Response["campos_det"][x]["Nombre"]][0][0]["Campo"]
                        Campo = Campo_a_oper.split(".")
                        ID_TAG_campo = 'ps' + pestana_int + 'qqq' + x2 + 'yyy' + fila + 'www' + Campo[1]

                        if (document.getElementById(ID_TAG_campo) != null) {
                            Valor = parseFloat(document.getElementById(ID_TAG_campo).value)

                            if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0][0]["Operacion"] == "Suma") {
                                valor_final = parseFloat(valor_final) + parseFloat(Valor)
                            }
                            if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0][0]["Operacion"] == "Promedio") {
                                valor_final = parseFloat(valor_final) + parseFloat(Valor)
                                cc_final = cc_final + 1
                            }
                            if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0][0]["Operacion"] == "Maximo") {
                                if (parseFloat(valor_final) < parseFloat(Valor)) { valor_final = Valor }
                            }
                            if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0][0]["Operacion"] == "Minimo") {
                                if (parseFloat(valor_final) > parseFloat(Valor)) { valor_final = Valor }
                            }
                            if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0][0]["Operacion"] == "Contar") {
                                cc_final = cc_final + 1
                            }
                        }
                    }
                }

                if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0][0]["Operacion"] == "Suma") {
                    document.getElementById(ID_TAG).value = setTwoNumberDecimal(valor_final, 2)
                }
                if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0][0]["Operacion"] == "Promedio") {
                    valor_final = valor_final / (cc_final + 1)
                    document.getElementById(ID_TAG).value = setTwoNumberDecimal(valor_final, 2)
                }
                if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0][0]["Operacion"] == "Maximo") {
                    document.getElementById(ID_TAG).value = setTwoNumberDecimal(valor_final, 2)
                }
                if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0][0]["Operacion"] == "Minimo") {
                    document.getElementById(ID_TAG).value = setTwoNumberDecimal(valor_final, 2)
                }
                if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0][0]["Operacion"] == "Contar") {
                    document.getElementById(ID_TAG).value = cc_final

                }
            }
            if (Response["campos_det"][x]["TablaCampo"] == "cmpfecha") {
            }
            if (Response["campos_det"][x]["TablaCampo"] == "cmpreferencia") {
            }
            if (Response["campos_det"][x]["TablaCampo"] == "cmpreferenciaadjunto") {
            }
            if (Response["campos_det"][x]["TablaCampo"] == "cmpoperacion") {
                temp = 0.0;
                operador = "=";
                Valor = 0.0;

                for (x3 = 0; x3 < Response["func_det"][Response["campos_det"][x]["Nombre"]][1].length; x3++) {
                    if (Response["func_det"][Response["campos_det"][x]["Nombre"]][1][x3]["Estado"] == "C") {

                        ID_TAG_campo = 'pd' + pestana_int + 'fff' + fila + 'ccc' + Response["func_det"][Response["campos_det"][x]["Nombre"]][1][x3]["Sentencia"] + '';
                        if (document.getElementById(ID_TAG_campo).value == "") {
                            Valor = 0.0
                        } else {
                            Valor = document.getElementById(ID_TAG_campo).value
                        }

                        if (operador == "=") {
                            temp = parseFloat(Valor)
                        }
                        if (operador == "+") {
                            temp = parseFloat(temp) + parseFloat(Valor)
                        }
                        if (operador == "-") {
                            temp = parseFloat(temp) - parseFloat(Valor)
                        }
                        if (operador == "*") {
                            temp = parseFloat(temp) * parseFloat(Valor)
                        }
                        if (operador == "/") {
                            if (Valor > 0) {
                                temp = parseFloat(temp) / parseFloat(Valor)
                            }
                        }
                        if (operador == "Juntar") { temp = temp.toString() + Valor.toString() }
                    }
                    if (Response["func_det"][Response["campos_det"][x]["Nombre"]][1][x3]["Estado"] == "O") {
                        operador = Response["func_det"][Response["campos_det"][x]["Nombre"]][1][x3]["Sentencia"]
                    }
                    if (Response["func_det"][Response["campos_det"][x]["Nombre"]][1][x3]["Estado"] == "V") {
                        Valor = Response["func_det"][Response["campos_det"][x]["Nombre"]][1][x3]["Sentencia"]
                        if (operador == "=") {
                            temp = parseFloat(Valor)
                        }
                        if (operador == "+") {
                            temp = parseFloat(temp) + parseFloat(Valor)
                        }
                        if (operador == "-") {
                            temp = parseFloat(temp) - parseFloat(Valor)
                        }
                        if (operador == "*") {
                            temp = parseFloat(temp) * parseFloat(Valor)
                        }
                        if (operador == "/") {
                            if (Valor > 0) {
                                temp = parseFloat(temp) / parseFloat(Valor)
                            }
                        }
                        if (operador == "Juntar") { temp = temp.toString() + Valor.toString() }
                    }
                }
                temp = setTwoNumberDecimal(temp, Response["func_det"][Response["campos_det"][x]["Nombre"]][0][0]["Decimales"])
                document.getElementById(ID_TAG).value = temp
            }
            if (Response["campos_det"][x]["TablaCampo"] == "cmpconsolidado") {

                A_Select = 'Select ( '
                A_From = 'From '
                A_Where = 'Where '
                A_Group = 'Group by '
                A_GroupWhere = 'Group by '
                sentencia = ""
                FaltaDato = false



                for (x3 = 0; x3 < Response["func_det"][Response["campos_det"][x]["Nombre"]][1].length; x3++) {
                    A_From = A_From + Response["func_det"][Response["campos_det"][x]["Nombre"]][1][x3]["Tabla"] + ' as ' + Response["func_det"][Response["campos_det"][x]["Nombre"]][1][x3]["Nombre"] + ', '
                }
                if (A_From == "From ") { A_From = "" } else { A_From = A_From.slice(0, -2) }

                for (x3 = 0; x3 < Response["func_det"][Response["campos_det"][x]["Nombre"]][2].length; x3++) {

                    if (Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Tipo"] == "Valor") {
                        A_Where = A_Where + " '" + Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Elemento"] + "' "
                    }
                    if (Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Tipo"] == "Operacion") {
                        A_Where = A_Where + ' ' + Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Elemento"] + ' '
                    }
                    if (Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Tipo"] == "Registro") {
                        ID_TAG_reg = 'pd' + pestana_int + 'fff' + fila + 'ccc' + Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Elemento"];

                        if (document.getElementById(ID_TAG_reg).value == "") {
                            FaltaDato = true
                            A_Where = A_Where + " '' "
                        } else {
                            A_Where = A_Where + " '" + document.getElementById(ID_TAG_reg).value + "' "
                        }
                    }
                    if (Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Tipo"] == "Campo") {

                        if (Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Funcion"] == "") {

                            A_Where = A_Where + ' ' + Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Origen"] + '.' + Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Elemento"] + ' '
                        }
                        if (Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Funcion"] == " ") {
                            A_Where = A_Where + ' ' + Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Origen"] + '.' + Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Elemento"] + ' '
                        }
                        if (Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Funcion"] == "Suma") {
                            A_Where = A_Where + ' Sum(' + Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Origen"] + '.' + Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Elemento"] + ') '
                            A_GroupWhere = A_GroupWhere + Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Grupo"] + ', '
                        }
                        if (Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Funcion"] == "Promedio") {
                            A_Where = A_Where + ' Avg(' + Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Origen"] + '.' + Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Elemento"] + ') '
                            A_GroupWhere = A_GroupWhere + Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Grupo"] + ', '
                        }
                        if (Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Funcion"] == "Contar") {
                            A_Where = A_Where + ' Count(' + Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Origen"] + '.' + Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Elemento"] + ') '
                            A_GroupWhere = A_GroupWhere + Response["func_det"][Response["campos_det"][x]["Nombre"]][2][x3]["Grupo"] + ', '
                        }
                    }


                }
                if (A_GroupWhere == "Group by ") { A_GroupWhere = "" } else { A_GroupWhere = A_GroupWhere.slice(0, -2) }
                if (A_Where == "Where ") { A_Where = "" }

                for (x3 = 0; x3 < Response["func_det"][Response["campos_det"][x]["Nombre"]][3].length; x3++) {


                    if (Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Tipo"] == "Valor") {
                        A_Select = A_Select + " '" + Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Elemento"] + "' "
                    }
                    if (Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Tipo"] == "Operacion") {
                        A_Select = A_Select + " " + Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Elemento"] + " "
                    }
                    if (Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Tipo"] == "Registro") {
                        ID_TAG_reg = 'pd' + pestana_int + 'fff' + fila + 'ccc' + Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Elemento"];

                        if (document.getElementById(ID_TAG_reg).value == "") {
                            FaltaDato = true
                            A_Select = A_Select + " '' "

                        } else {
                            A_Select = A_Select + " '" + document.getElementById(ID_TAG_reg).value + "' "
                        }
                    }
                    if (Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Tipo"] == "Campo") {

                        if (Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Funcion"] == "") {

                            A_Select = A_Select + " " + Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Origen"] + '.' + Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Elemento"] + " "
                        }
                        if (Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Funcion"] == " ") {
                            A_Select = A_Select + " " + Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Origen"] + '.' + Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Elemento"] + " "
                        }
                        if (Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Funcion"] == "Suma") {
                            A_Select = A_Select + ' Sum(' + Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Origen"] + '.' + Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Elemento"] + ') '
                            A_Group = A_Group + Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Grupo"] + ', '
                        }
                        if (Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Funcion"] == "Promedio") {
                            A_Select = A_Select + ' Avg(' + Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Origen"] + '.' + Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Elemento"] + ') '
                            A_Group = A_Group + Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Grupo"] + ', '
                        }
                        if (Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Funcion"] == "Contar") {
                            A_Select = A_Select + ' Count(' + Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Origen"] + '.' + Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Elemento"] + ') '
                            A_Group = A_Group + Response["func_det"][Response["campos_det"][x]["Nombre"]][3][x3]["Grupo"] + ', '
                        }
                    }
                }
                if (A_Group == "Group by ") { A_Group = "" } else { A_Group = A_Group.slice(0, -2) }

                A_Select = A_Select + " ) as '" + Response["campos_det"][x]["Nombre"] + "' "
                if (A_Group == "") {
                    if (A_GroupWhere == "") {
                        sentencia = A_Select + " " + A_From + " " + A_Where
                    } else {
                        sentencia = A_Select + " " + A_From + " " + A_Where + " " + A_GroupWhere
                    }
                } else {
                    if (A_GroupWhere == "") {
                        sentencia = A_Select + " " + A_From + " " + A_Where + " " + A_Group
                    } else {
                        sentencia = A_Select + " " + A_From + " " + A_Where + " " + A_Group + ", " + A_GroupWhere.replace("Group by ", "")
                    }
                }

                if (FaltaDato == true && Response["func_det"][Response["campos_det"][x]["Nombre"]][0][0]["Permite_nulo"] == "No") {
                    document.getElementById(ID_TAG).value = 0
                } else {
                    ID_TAG_resp = 'pd' + pestana_int + 'fff' + fila + 'ccc' + Response["campos_det"][x]["Nombre"] + '';
                    ID_TAG_nombre = Response["campos_det"][x]["Nombre"]
                    if (offline == false){
                        $.ajax({
                            type: 'POST',
                            url: '/consolidado',
                            data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'cmpsenten': sentencia, 'tag1': ID_TAG_resp, 'tag2': ID_TAG_nombre, 'usuario': web_usuario },
                            success: function (Response) {
                                if (Response["cmpvalor"].length > 0) {
                                    if (Response["cmpvalor"][0][Response["tag2"]] == null) {
                                        document.getElementById(Response["tag1"]).value = 0
                                    } else {
                                        document.getElementById(Response["tag1"]).value = Response["cmpvalor"][0][Response["tag2"]]
                                        calcular_detalle_no_base(pestana_int, fila)
                                    }
                                } else {
                                    document.getElementById(Response["tag1"]).value = 0

                                }
                            }
                        });
                    }else{
                        document.getElementById(ID_TAG_resp).value = respuestas_pre[Response["campos_det"][x]["PkId"]]
                    }
                }
            }
            if (Response["campos_det"][x]["TablaCampo"] == "cmpnumeroaletras") {
                document.getElementById(ID_TAG).value = numeroALetras(document.getElementById(ID_TAG).value);

            }
            if (Response["campos_det"][x]["TablaCampo"] == "cmpdecabecera") {
                id_cab = 'p' + pestana_int + 'zzz' + Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Campo"]
                document.getElementById(ID_TAG).value = document.getElementById(id_cab).value
            }
            if (Response["campos_det"][x]["TablaCampo"] == "cmpcondicional") {
              document.getElementById(ID_TAG).value = calcular_det_cmpcondicional(pestana_int, fila, Response["campos_det"][x]["Nombre"]);
          }
          
        }
    }
    //calcular_0(pestana_int)
    calcular_0_v2(pestana_int,[])
    
}



function calcular_detalle_no_base(pestana_int, fila) {


    Response = dict_pestalla['p-' + pestana_int]

    for (x = 0; x < Response["campos_det"].length; x++) {
        ID_TAG = 'pd' + pestana_int + 'fff' + fila + 'ccc' + Response["campos_det"][x]["Nombre"] + '';
        if (Response["campos_det"][x]["TablaCampo"] == "cmpoperacion") {
            temp = 0.0;
            operador = "=";
            Valor = 0.0;

            for (x3 = 0; x3 < Response["func_det"][Response["campos_det"][x]["Nombre"]][1].length; x3++) {
                if (Response["func_det"][Response["campos_det"][x]["Nombre"]][1][x3]["Estado"] == "C") {

                    ID_TAG_campo = 'pd' + pestana_int + 'fff' + fila + 'ccc' + Response["func_det"][Response["campos_det"][x]["Nombre"]][1][x3]["Sentencia"] + '';
                    if (document.getElementById(ID_TAG_campo).value == "") {
                        Valor = 0.0
                    } else {
                        Valor = document.getElementById(ID_TAG_campo).value
                    }

                    if (operador == "=") { temp = parseFloat(Valor) }
                    if (operador == "+") { temp = parseFloat(temp) + parseFloat(Valor) }
                    if (operador == "-") { temp = parseFloat(temp) - parseFloat(Valor) }
                    if (operador == "*") { temp = parseFloat(temp) * parseFloat(Valor) }
                    if (operador == "/") {
                        if (Valor > 0) { temp = parseFloat(temp) / parseFloat(Valor) }
                    }
                    if (operador == "Juntar") {
                        temp = temp.toString() + Valor.toString()
                    }

                }
                if (Response["func_det"][Response["campos_det"][x]["Nombre"]][1][x3]["Estado"] == "O") {
                    operador = Response["func_det"][Response["campos_det"][x]["Nombre"]][1][x3]["Sentencia"]
                }
                if (Response["func_det"][Response["campos_det"][x]["Nombre"]][1][x3]["Estado"] == "V") {
                    Valor = Response["func_det"][Response["campos_det"][x]["Nombre"]][1][x3]["Sentencia"]
                    if (operador == "=") { temp = parseFloat(Valor) }
                    if (operador == "+") { temp = parseFloat(temp) + parseFloat(Valor) }
                    if (operador == "-") { temp = parseFloat(temp) - parseFloat(Valor) }
                    if (operador == "*") { temp = parseFloat(temp) * parseFloat(Valor) }
                    if (operador == "/") {
                        if (Valor > 0) { temp = parseFloat(temp) / parseFloat(Valor) }
                    }
                    if (operador == "Juntar") { temp = temp.toString() + Valor.toString() }
                }
            }
            temp = setTwoNumberDecimal(temp, Response["func_det"][Response["campos_det"][x]["Nombre"]][0][0]["Decimales"])
            document.getElementById(ID_TAG).value = temp
        }
        if (Response["campos_det"][x]["TablaCampo"] == "cmpnumeroaletras") {
            document.getElementById(ID_TAG).value = numeroALetras(document.getElementById(ID_TAG).value);
        }
        if (Response["campos_det"][x]["TablaCampo"] == "cmpdecabecera") {
            id_cab = 'p' + pestana_int + 'zzz' + Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Campo"]
            document.getElementById(ID_TAG).value = document.getElementById(id_cab).value
        }
    }
    calcular_0_v2(pestana_int,[])
    //calcular_0(pestana_int)
}
ultimocambio = ''
function guardar_calcular(campo, tipo) {

    var cc_id = campo.id
    var res = cc_id.split("zzz");
    var cc_pesta = res[0].substring(1);
    var cc_nombre = res[1]

    if (tipo == 0) {
        //calcular_0(cc_pesta)
        calcular_0_v2(cc_pesta,[cc_nombre])

        for (zx = 0; zx < (cc_porPesta['p-' + cc_pesta] + 1); zx++) {
            //calcular_detalle(cc_pesta, zx)
            calcular_detalleV2(cc_pesta, zx)
        }

        //calcular_0(cc_pesta)
        calcular_0_v2(cc_pesta,[])


    }
}

function guardar_calcular_det(campo) {


    var cc_id = campo.id
    var res = cc_id.split("fff");
    var res2 = res[1].split("ccc");

    var cc_pesta = res[0].substring(2);
    var cc_fila = res2[0]
    var cc_nombre = res2[1]

    calcular_detalle(cc_pesta, cc_fila)
    calcular_0_v2(cc_pesta,[])

}
function guardar_calcular_subdet(campo) {

    var cc_id = campo.id
    var res = cc_id.split("qqq");
    var res2 = res[1].split("yyy");
    var res3 = res2[1].split("www");

    var cc_pesta = res[0].substring(2);
    var cc_fila = res2[0]
    var cc_head = res3[0]
    var cc_nombre = res3[1]
    calcular_subdetalle(cc_pesta, cc_fila, cc_head)
    calcular_detalleV2(cc_pesta, cc_fila)
}

function calcular_subdetalle(pestana_int, fila, head) {


    Response = dict_pestalla['p-' + pestana_int]
    for (x = 0; x < Response["campos_subdet"].length; x++) {
        ID_TAG = 'ps' + pestana_int + 'qqq' + fila + 'yyy' + head + 'www' + Response["campos_subdet"][x]["Nombre"] + '';
        if (document.getElementById(ID_TAG) != null) {



            if (Response["campos_subdet"][x]["TablaCampo"] == "cmpnumsimple") {
                if (document.getElementById(ID_TAG).value <= Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0]["Menor"]) {
                    document.getElementById(ID_TAG).value = setTwoNumberDecimal(Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0]["Menor"], Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0]["NumDecimales"])
                } else {
                    if (document.getElementById(ID_TAG).value >= Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0]["Mayor"]) {
                        document.getElementById(ID_TAG).value = setTwoNumberDecimal(Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0]["Mayor"], Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0]["NumDecimales"])
                    } else {
                        document.getElementById(ID_TAG).value = setTwoNumberDecimal(document.getElementById(ID_TAG).value, Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0]["NumDecimales"])
                    }



                }
            }
            if (Response["campos_subdet"][x]["TablaCampo"] == "cmpformuladetalle") {
                valor_final = 0;
                cc_final = 0;

                for (x2 = 0; x2 < (cc_porPesta['p-' + pestana_int] + 1); x2++) {

                    excluido = 0;

                    for (x3 = 0; x3 < Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][1].length; x3++) {
                        valor_comparar = 0;

                        ID_TAG_campo = 'ps' + pestana_int + 'qqq' + x2 + 'yyy' + head + 'www' + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][1][x3]["Campo"]
                        if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][1][x3]["Tipo"] == "Valor") {
                            valor_comparar = Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][1][x3]["Valor"]
                        } else {
                            ID_TAG_compa = 'ps' + pestana_int + 'qqq' + x2 + 'yyy' + head + 'www' + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][1][x3]["Valor"]
                            valor_comparar = document.getElementById(ID_TAG_compa).value
                        }
                        if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][1][x3]["Operador"] == "=") { if (document.getElementById(ID_TAG_campo).value != valor_comparar) { excluido = 1 } }
                        if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][1][x3]["Operador"] == "<") { if (document.getElementById(ID_TAG_campo).value >= valor_comparar) { excluido = 1 } }
                        if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][1][x3]["Operador"] == ">") { if (document.getElementById(ID_TAG_campo).value <= valor_comparar) { excluido = 1 } }
                        if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][1][x3]["Operador"] == "<=") { if (document.getElementById(ID_TAG_campo).value > valor_comparar) { excluido = 1 } }
                        if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][1][x3]["Operador"] == ">=") { if (document.getElementById(ID_TAG_campo).value < valor_comparar) { excluido = 1 } }
                    }

                    if (excluido == 0) {

                        Campo_a_oper = Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0][0]["Campo"]
                        Campo = Campo_a_oper.split(".")
                        ID_TAG_campo = 'ps' + pestana_int + 'qqq' + x2 + 'yyy' + head + 'www' + Campo[1]
                        Valor = parseFloat(document.getElementById(ID_TAG_campo).value)


                        if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0][0]["Operacion"] == "Suma") {
                            valor_final = parseFloat(valor_final) + parseFloat(Valor)
                        }
                        if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0][0]["Operacion"] == "Promedio") {
                            valor_final = parseFloat(valor_final) + parseFloat(Valor)
                            cc_final = cc_final + 1
                        }
                        if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0][0]["Operacion"] == "Maximo") {
                            if (parseFloat(valor_final) < parseFloat(Valor)) { valor_final = Valor }
                        }
                        if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0][0]["Operacion"] == "Minimo") {
                            if (parseFloat(valor_final) > parseFloat(Valor)) { valor_final = Valor }
                        }
                        if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0][0]["Operacion"] == "Contar") {
                            cc_final = cc_final + 1
                        }
                    }

                }

                if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0][0]["Operacion"] == "Suma") {
                    document.getElementById(ID_TAG).value = setTwoNumberDecimal(valor_final, 2)
                }
                if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0][0]["Operacion"] == "Promedio") {
                    valor_final = valor_final / (cc_final + 1)
                    document.getElementById(ID_TAG).value = setTwoNumberDecimal(valor_final, 2)
                }
                if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0][0]["Operacion"] == "Maximo") {
                    document.getElementById(ID_TAG).value = setTwoNumberDecimal(valor_final, 2)
                }
                if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0][0]["Operacion"] == "Minimo") {
                    document.getElementById(ID_TAG).value = setTwoNumberDecimal(valor_final, 2)
                }
                if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0][0]["Operacion"] == "Contar") {
                    document.getElementById(ID_TAG).value = cc_final

                }
            }
            if (Response["campos_subdet"][x]["TablaCampo"] == "cmpfecha") {
            }
            if (Response["campos_subdet"][x]["TablaCampo"] == "cmpreferencia") {
            }
            if (Response["campos_subdet"][x]["TablaCampo"] == "cmpreferenciaadjunto") {
            }
            if (Response["campos_subdet"][x]["TablaCampo"] == "cmpoperacion") {
                temp = 0.0;
                operador = "=";
                Valor = 0.0;

                for (x3 = 0; x3 < Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][1].length; x3++) {
                    if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][1][x3]["Estado"] == "C") {

                        ID_TAG_campo = 'ps' + pestana_int + 'qqq' + fila + 'yyy' + head + 'www' + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][1][x3]["Sentencia"] + '';
                        if (document.getElementById(ID_TAG_campo).value == "") {
                            Valor = 0.0
                        } else {
                            Valor = document.getElementById(ID_TAG_campo).value
                        }

                        if (operador == "=") { temp = parseFloat(Valor) }
                        if (operador == "+") { temp = parseFloat(temp) + parseFloat(Valor) }
                        if (operador == "-") { temp = parseFloat(temp) - parseFloat(Valor) }
                        if (operador == "*") { temp = parseFloat(temp) * parseFloat(Valor) }
                        if (operador == "/") {
                            if (Valor > 0) { temp = parseFloat(temp) / parseFloat(Valor) }
                        }
                        if (operador == "Juntar") { temp = temp.toString() + Valor.toString() }
                    }
                    if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][1][x3]["Estado"] == "O") {
                        operador = Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][1][x3]["Sentencia"]
                    }
                    if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][1][x3]["Estado"] == "V") {
                        Valor = Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][1][x3]["Sentencia"]
                        if (operador == "=") { temp = parseFloat(Valor) }
                        if (operador == "+") { temp = parseFloat(temp) + parseFloat(Valor) }
                        if (operador == "-") { temp = parseFloat(temp) - parseFloat(Valor) }
                        if (operador == "*") { temp = parseFloat(temp) * parseFloat(Valor) }
                        if (operador == "/") {
                            if (Valor > 0) { temp = parseFloat(temp) / parseFloat(Valor) }
                        }
                        if (operador == "Juntar") { temp = temp.toString() + Valor.toString() }
                    }
                }
                temp = setTwoNumberDecimal(temp, Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0][0]["Decimales"])
                document.getElementById(ID_TAG).value = temp
            }
            if (Response["campos_subdet"][x]["TablaCampo"] == "cmpconsolidado") {

                A_Select = 'Select ( '
                A_From = 'From '
                A_Where = 'Where '
                A_Group = 'Group by '
                A_GroupWhere = 'Group by '
                sentencia = ""
                FaltaDato = false



                for (x3 = 0; x3 < Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][1].length; x3++) {
                    A_From = A_From + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][1][x3]["Tabla"] + ' as ' + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][1][x3]["Nombre"] + ', '
                }
                if (A_From == "From ") { A_From = "" } else { A_From = A_From.slice(0, -2) }

                for (x3 = 0; x3 < Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][2].length; x3++) {

                    if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][2][x3]["Tipo"] == "Valor") {
                        A_Where = A_Where + " '" + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][2][x3]["Elemento"] + "' "
                    }
                    if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][2][x3]["Tipo"] == "Operacion") {
                        A_Where = A_Where + ' ' + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][2][x3]["Elemento"] + ' '
                    }
                    if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][2][x3]["Tipo"] == "Registro") {
                        ID_TAG_reg = 'ps' + pestana_int + 'qqq' + fila + 'yyy' + head + 'www' + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][2][x3]["Elemento"];

                        if (document.getElementById(ID_TAG_reg).value == "") {
                            FaltaDato = true
                            A_Where = A_Where + " '' "
                        } else {
                            A_Where = A_Where + " '" + document.getElementById(ID_TAG_reg).value + "' "
                        }

                    }
                    if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][2][x3]["Tipo"] == "Campo") {

                        if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][2][x3]["Funcion"] == "") {

                            A_Where = A_Where + ' ' + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][2][x3]["Origen"] + '.' + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][2][x3]["Elemento"] + ' '
                        }
                        if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][2][x3]["Funcion"] == " ") {
                            A_Where = A_Where + ' ' + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][2][x3]["Origen"] + '.' + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][2][x3]["Elemento"] + ' '
                        }
                        if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][2][x3]["Funcion"] == "Suma") {
                            A_Where = A_Where + ' Sum(' + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][2][x3]["Origen"] + '.' + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][2][x3]["Elemento"] + ') '
                            A_GroupWhere = A_GroupWhere + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][2][x3]["Grupo"] + ', '
                        }
                        if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][2][x3]["Funcion"] == "Promedio") {
                            A_Where = A_Where + ' Avg(' + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][2][x3]["Origen"] + '.' + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][2][x3]["Elemento"] + ') '
                            A_GroupWhere = A_GroupWhere + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][2][x3]["Grupo"] + ', '
                        }
                        if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][2][x3]["Funcion"] == "Contar") {
                            A_Where = A_Where + ' Count(' + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][2][x3]["Origen"] + '.' + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][2][x3]["Elemento"] + ') '
                            A_GroupWhere = A_GroupWhere + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][2][x3]["Grupo"] + ', '
                        }
                    }


                }
                if (A_GroupWhere == "Group by ") { A_GroupWhere = "" } else { A_GroupWhere = A_GroupWhere.slice(0, -2) }
                if (A_Where == "Where ") { A_Where = "" }

                for (x3 = 0; x3 < Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][3].length; x3++) {


                    if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][3][x3]["Tipo"] == "Valor") {
                        A_Select = A_Select + " '" + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][3][x3]["Elemento"] + "' "
                    }
                    if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][3][x3]["Tipo"] == "Operacion") {
                        A_Select = A_Select + " " + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][3][x3]["Elemento"] + " "
                    }
                    if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][3][x3]["Tipo"] == "Registro") {
                        ID_TAG_reg = 'ps' + pestana_int + 'qqq' + fila + 'yyy' + head + 'www' + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][3][x3]["Elemento"];

                        if (document.getElementById(ID_TAG_reg).value == "") {
                            FaltaDato = true
                            A_Select = A_Select + " '' "

                        } else {
                            A_Select = A_Select + " '" + document.getElementById(ID_TAG_reg).value + "' "
                        }
                    }
                    if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][3][x3]["Tipo"] == "Campo") {

                        if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][3][x3]["Funcion"] == "") {

                            A_Select = A_Select + " " + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][3][x3]["Origen"] + '.' + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][3][x3]["Elemento"] + " "
                        }
                        if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][3][x3]["Funcion"] == " ") {
                            A_Select = A_Select + " " + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][3][x3]["Origen"] + '.' + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][3][x3]["Elemento"] + " "
                        }
                        if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][3][x3]["Funcion"] == "Suma") {
                            A_Select = A_Select + ' Sum(' + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][3][x3]["Origen"] + '.' + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][3][x3]["Elemento"] + ') '
                            A_Group = A_Group + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][3][x3]["Grupo"] + ', '
                        }
                        if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][3][x3]["Funcion"] == "Promedio") {
                            A_Select = A_Select + ' Avg(' + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][3][x3]["Origen"] + '.' + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][3][x3]["Elemento"] + ') '
                            A_Group = A_Group + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][3][x3]["Grupo"] + ', '
                        }
                        if (Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][3][x3]["Funcion"] == "Contar") {
                            A_Select = A_Select + ' Count(' + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][3][x3]["Origen"] + '.' + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][3][x3]["Elemento"] + ') '
                            A_Group = A_Group + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][3][x3]["Grupo"] + ', '
                        }
                    }
                }
                if (A_Group == "Group by ") { A_Group = "" } else { A_Group = A_Group.slice(0, -2) }

                A_Select = A_Select + " ) as '" + Response["campos_subdet"][x]["Nombre"] + "' "
                if (A_Group == "") {
                    if (A_GroupWhere == "") {
                        sentencia = A_Select + " " + A_From + " " + A_Where
                    } else {
                        sentencia = A_Select + " " + A_From + " " + A_Where + " " + A_GroupWhere
                    }
                } else {
                    if (A_GroupWhere == "") {
                        sentencia = A_Select + " " + A_From + " " + A_Where + " " + A_Group
                    } else {
                        sentencia = A_Select + " " + A_From + " " + A_Where + " " + A_Group + ", " + A_GroupWhere.replace("Group by ", "")
                    }
                }

                if (FaltaDato == true && Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0][0]["Permite_nulo"] == "No") {
                    document.getElementById(ID_TAG).value = 0
                } else {
                    ID_TAG_resp = 'ps' + pestana_int + 'qqq' + fila + 'yyy' + head + 'www' + Response["campos_subdet"][x]["Nombre"] + '';
                    ID_TAG_nombre = Response["campos_subdet"][x]["Nombre"]
                    if (offline == false){
                        $.ajax({
                            type: 'POST',
                            url: '/consolidado',
                            data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'cmpsenten': sentencia, 'tag1': ID_TAG_resp, 'tag2': ID_TAG_nombre, 'usuario': web_usuario },
                            success: function (Response) {
                                if (Response["cmpvalor"].length > 0) {
                                    if (Response["cmpvalor"][0][Response["tag2"]] == null) {
                                        document.getElementById(Response["tag1"]).value = 0
                                    } else {
                                        document.getElementById(Response["tag1"]).value = Response["cmpvalor"][0][Response["tag2"]]
                                        calcular_detalle_no_base(pestana_int, fila)
                                    }
                                } else {
                                    document.getElementById(Response["tag1"]).value = 0
                                }
                            }
                        });
                    }else{
                        document.getElementById(ID_TAG_resp).value = respuestas_pre[Response["campos_det"][x]["PkId"]]
                    }
                }
            }
            if (Response["campos_subdet"][x]["TablaCampo"] == "cmpnumeroaletras") {
                document.getElementById(ID_TAG).value = numeroALetras(document.getElementById(ID_TAG).value);

            }
            if (Response["campos_subdet"][x]["TablaCampo"] == "cmpdecabecera") {
                id_cab = 'pd' + pestana_int + 'fff' + head + 'ccc' + Response["func_subdet"][Response["campos_subdet"][x]["Nombre"]][0]["Campo"]
                document.getElementById(ID_TAG).value = document.getElementById(id_cab).value

            }
        }
    }

    calcular_detalle(pestana_int, head)
}
