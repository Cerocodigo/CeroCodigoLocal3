function menu_reporte_abrir_dropdown_item(este_id){
  este = document.getElementById(este_id)
  pestalla = pestalla + 1

  $("#myTab").prepend('<li role="presentation" class="" id="li' + pestalla + '" style="text-align: right;"><a href="#rr' + pestalla + '" id="id' + pestalla + '" role="tab" data-toggle="tab" aria-expanded="false">Listado: ' + $(este).attr("result") + ' <i class="fa fa-times" style="color: red; background: transparent;cursor: pointer;" onclick="cerrar_elemento(' + pestalla + ')"></i></a> </li>');


  if ($(este).attr("value") == "reporte") {
    $.ajax({
      type: 'POST',
      url: '/menu_reporte',
      data: { 'fuente': $(este).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'pkrepo': $(este).attr("id"), 'nombre_rep': $(este).attr("result"), 'usuario': web_usuario, 'idioma': web_idioma, 'pestalla': pestalla },
      beforeSend: function () {

        $("#myTabContent").prepend('<div role="tabpanel" class="tab-pane fade" id="rr' + pestalla + '" aria-labelledby="id' + pestalla + '" style="background-color: transparent;"> <div style="padding-top: 5px;"> Procesando </div></div>');
      },
      success: function (Response) {

        dict_pestalla['p-' + Response["pestalla"]] = Response

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

}
var empaquetando = 0
function empaquetado_reporte(temp_pestalla, t_pkreporte) {
  if(empaquetando == 0){
    Resp = dict_pestalla['p-'+temp_pestalla]
    
    empaquetando = 1
    $.ajax({
      type: 'POST',
      url: '/reporte_empaquetado',
      data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 't_pkreporte': t_pkreporte, 'repvariables':JSON.stringify(Resp['repvariables'])},
      beforeSend: function (Response) {
        reporte = document.getElementById('dataTables-' +temp_pestalla).parentElement
        reporte.innerHTML = 'Procesando archivo......'
      },
      error: function(xhr){
        reporte = document.getElementById('rr' +temp_pestalla)
        reporte.childNodes[0].childNodes[0].childNodes[1].innerText= 'Existe error al generar el archivo, llame a programador'
        empaquetando = 0
      },
      success: function (Response) {
      empaquetando = 0
      if(Response['ok'] == 'Si'){
        window.open('/'+Response['archivo'],"_blank")
        reporte = document.getElementById('rr' +temp_pestalla)
        reporte.childNodes[0].childNodes[0].childNodes[1].innerText= 'Archivo Generado'
        empaquetando = 0

        
      }
      if(Response['ok'] == 'No'){
        alert(Response['msg'])
        reporte = document.getElementById('rr' +temp_pestalla)
        reporte.childNodes[0].childNodes[0].childNodes[1].innerText= 'Existe error al generar el archivo, llame a programador'
        empaquetando = 0

      }
      }
    });
  }else{
    alert('Procesando empaquetado... por favor espere')
  }


}



function txt_reporte(temp_pestalla) {

    Resp = dict_pestalla['p-'+temp_pestalla]

    text = ''
    for (y = 0; y < Resp['resutado'][0][1].length; y++) {
        fila = ''
        for (y2 = 0; y2 < Resp['resutado'][0][1][y].length; y2++) {
            fila= fila + Resp['resutado'][0][1][y][y2]+ ','
        }
        text =  text + fila.substr(0,fila.length-1) + '\n'
    }

    text = text.substr(0,text.length-2)

    var data = new Blob([text], {type: 'text/plain'});
    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    } 
    //window.open(window.URL.createObjectURL(data))
    var link = document.getElementById('downloadlink');
    link.href = window.URL.createObjectURL(data);
    //link.style.display = 'block';
    link.click()

}