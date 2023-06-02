


function imprimir(nombre) {
  //var ficha = document.getElementById(nombre);
  var ventimp = window.open(' ', 'popimpr');
  ventimp.document.write( '<p>ssss</p><p>2222222</p>');
  ventimp.document.close();
  ventimp.print();
  ventimp.close();
}


function imprimir222() {

  dataImprimir = []

  dataImprimir.push({'TipoLetra':'Normal','Tamano':'8','Direccion':'Izquierda','Valor':'Normal Izquierda','x':'3','y':'1'})
  dataImprimir.push({'TipoLetra':'Normal','Tamano':'10','Direccion':'Derecha','Valor':'Derecha Normal','x':'3','y':'2'})
  dataImprimir.push({'TipoLetra':'Bold','Tamano':'12','Direccion':'Izquierda','Valor':'Izquierda Bold','x':'3','y':'3'})
  dataImprimir.push({'TipoLetra':'Bold','Tamano':'16','Direccion':'Derecha','Valor':'Derecha Bold','x':'3','y':'4'})


  $.ajax({
    crossDomain: true,
    type: 'POST',
    headers: {"Access-Control-Allow-Origin": "*", "crossDomain": true},
    url: 'http://localhost:8080/HttpListenerxx/',
    //url: 'http://LAPTOP-4O4OIDB1:9081/HttpListenerxx/',
    //data: { 'dataImprimir': JSON.stringify(dataImprimir), 'impresora': '', 'Landscape': 'No', 'alto': 29, 'ancho': 21},
    data: { "dataImprimir":"valsio"},
    beforeSend: function () { },
    success: function (Response) {
      alert(exito)
    },
    error: function (request, status, error) {
      alert(request.responseText);
    }
  });

}

function imprimir_elemento(pestana_int, indiexx) {
  Response = dict_pestalla['p-' + pestana_int]

    var html_Cabecera = Response["plantilla_html"][indiexx]['Cabecera']
    var html_Pie = Response["plantilla_html"][indiexx]['Pie']
    var html_DetalleLinea = Response["plantilla_html"][indiexx]['DetalleLinea']
    var html_DetalleCabecera = Response["plantilla_html"][indiexx]['DetalleCabecera']

    for (z = 0; z < Response["plantilla_html"][indiexx]['CamposCab'].length; z++) {
      //html_Cabecera = html_Cabecera.replaceAll(Response["plantilla_html"][indiexx]['CamposCab'][z]['Tag'],Response["valores_cab"][0][Response["plantilla_html"][indiexx]['CamposCab'][z]['Valor']])
      //html_Pie = html_Pie.replaceAll(Response["plantilla_html"][indiexx]['CamposCab'][z]['Tag'],Response["valores_cab"][0][Response["plantilla_html"][indiexx]['CamposCab'][z]['Valor']])
      html_Cabecera = html_Cabecera.replace(new RegExp(Response["plantilla_html"][indiexx]['CamposCab'][z]['Tag'], 'g'), Response["valores_cab"][0][Response["plantilla_html"][indiexx]['CamposCab'][z]['Valor']])
      html_Pie = html_Pie.replace(new RegExp(Response["plantilla_html"][indiexx]['CamposCab'][z]['Tag'], 'g'), Response["valores_cab"][0][Response["plantilla_html"][indiexx]['CamposCab'][z]['Valor']])
    }


    for (z2 = 0; z2 < Response["valores_det"].length; z2++) {
      var liena_temp = html_DetalleLinea
      for (z3 = 0; z3 < Response["plantilla_html"][indiexx]['CamposDet'].length; z3++) {
        liena_temp = liena_temp.replace(new RegExp(Response["plantilla_html"][indiexx]['CamposDet'][z3]['Tag'], 'g'),  Response["valores_det"][z2][Response["plantilla_html"][indiexx]['CamposDet'][z3]['Valor']])


      }
      html_DetalleCabecera = html_DetalleCabecera + liena_temp
    }


    var ventimp = window.open(' ', 'popimpr');
    try {
      ventimp.document.write( html_Cabecera+html_DetalleCabecera+html_Pie);
      ventimp.document.close();
      ventimp.print();
      ventimp.close();
        
    } catch (error) {
      alert('Impresion Bloqueada')
      
    }
}

function pdf_elemento(pestana_int, indiexx) {

    Response = dict_pestalla['p-' + pestana_int]
  
    if (Response["plantilla_pdf"]["plantillasMain"].length == 0) {
      ind_pla = indiexx
  
    } else {
      if (Response["plantilla_pdf"]["plantillasMain"].length == 1) {
        ind_pla = indiexx
      }
      ind_pla = indiexx
      if (parseFloat(Response["plantilla_pdf"]["plantillasMain"][ind_pla]["Ancho"]) > parseFloat(Response["plantilla_pdf"]["plantillasMain"][ind_pla]["Largo"])) {
        var doc = new jsPDF('l', 'cm', [parseFloat(Response["plantilla_pdf"]["plantillasMain"][ind_pla]["Largo"]), parseFloat(Response["plantilla_pdf"]["plantillasMain"][ind_pla]["Ancho"])]);
      } else {
        var doc = new jsPDF('p', 'cm', [parseFloat(Response["plantilla_pdf"]["plantillasMain"][ind_pla]["Largo"]), parseFloat(Response["plantilla_pdf"]["plantillasMain"][ind_pla]["Ancho"])]);
      }
  
  
  
  
  
      doc.setFontSize(Response["plantilla_pdf"]["plantillasMain"][ind_pla]["Letra"]);
      doc.setFont("helvetica");
    }
  
    var Vpkplantilla = Response["plantilla_pdf"]["plantillasMain"][ind_pla]["PkPlantilla"]
  
  
    for (z = 0; z < Response["plantilla_pdf"]["plantillassegmentos"][Vpkplantilla].length; z++) {
      if (Response["plantilla_pdf"]["plantillassegmentos"][Vpkplantilla][z]["Tipo"] == "Cabecera") {
        seg_cab = Response["plantilla_pdf"]["plantillassegmentos"][Vpkplantilla][z]
      }
      if (Response["plantilla_pdf"]["plantillassegmentos"][Vpkplantilla][z]["Tipo"] == "Detalle") {
        seg_det = Response["plantilla_pdf"]["plantillassegmentos"][Vpkplantilla][z]
      }
      if (Response["plantilla_pdf"]["plantillassegmentos"][Vpkplantilla][z]["Tipo"] == "Pie") {
        seg_pie = Response["plantilla_pdf"]["plantillassegmentos"][Vpkplantilla][z]
      }
      if (Response["plantilla_pdf"]["plantillassegmentos"][Vpkplantilla][z]["Tipo"] == "Detalle3") {
        seg_det3 = Response["plantilla_pdf"]["plantillassegmentos"][Vpkplantilla][z]
      }
      
    }
  
  
    //cab
    //etiquetas
    var altura_ini = seg_cab["AlturaInicial"]
  
    for (z = 0; z < Response["plantilla_pdf"]["plantillasetiquetas"][seg_cab["PkSegmento"]].length; z++) {
      if (Response["plantilla_pdf"]["plantillasetiquetas"][seg_cab["PkSegmento"]][z]["TipoLetra"] == "Logo") {
  
  
        imagen = document.getElementById("logo_cia")
        tipo = imagen.attributes["value"]["value"].split('.')
        tamano = Response["plantilla_pdf"]["plantillasetiquetas"][seg_cab["PkSegmento"]][z]["Tamano"].split(',')
        var imgData = getBase64Image(imagen, tamano[0] * 37, tamano[1] * 37)
        try {
          doc.addImage(imgData, tipo[1].toUpperCase(), parseFloat(Response["plantilla_pdf"]["plantillasetiquetas"][seg_cab["PkSegmento"]][z]["X"]), parseFloat(Response["plantilla_pdf"]["plantillasetiquetas"][seg_cab["PkSegmento"]][z]["Y"]), parseFloat(tamano[0]), parseFloat(tamano[1]))
        }
        catch (error) {
          console.error(error);
          // expected output: ReferenceError: nonExistentFunction is not defined
          // Note - error messages will vary depending on browser
        }
  
  
      } else {
        if (Response["plantilla_pdf"]["plantillasetiquetas"][seg_cab["PkSegmento"]][z]["TipoLetra"] == "grafico") {
  
          tamano = Response["plantilla_pdf"]["plantillasetiquetas"][seg_cab["PkSegmento"]][z]["Tamano"].split(',')
          datos = Response["plantilla_pdf"]["plantillasetiquetas"][seg_cab["PkSegmento"]][z]["Nombre"].split(',')
  
          if (datos[0] == "cuadrado") {
  
  
            doc.setDrawColor(parseFloat(datos[1]), parseFloat(datos[2]), parseFloat(datos[3]))
            doc.setFillColor(parseFloat(datos[1]), parseFloat(datos[2]), parseFloat(datos[3]))
  
            p_x = parseFloat(Response["plantilla_pdf"]["plantillasetiquetas"][seg_cab["PkSegmento"]][z]["X"])
            p_y = parseFloat(Response["plantilla_pdf"]["plantillasetiquetas"][seg_cab["PkSegmento"]][z]["Y"])
  
            doc.rect(p_x, p_y, parseFloat(tamano[1]), parseFloat(tamano[0]), 'F')
  
          }
          if (datos[0] == "cuadrado_cir") {
  
            doc.setDrawColor(parseFloat(datos[1]), parseFloat(datos[2]), parseFloat(datos[3]))
            doc.setFillColor(parseFloat(datos[1]), parseFloat(datos[2]), parseFloat(datos[3]))
  
            p_x = parseFloat(Response["plantilla_pdf"]["plantillasetiquetas"][seg_cab["PkSegmento"]][z]["X"])
            p_y = parseFloat(Response["plantilla_pdf"]["plantillasetiquetas"][seg_cab["PkSegmento"]][z]["Y"])
  
  
            doc.roundedRect(p_x, p_y, parseFloat(tamano[1]), parseFloat(tamano[0]), 0.3, 0.3, 'FD')
  
          }
  
          doc.setDrawColor(0, 0, 0)
          doc.setFillColor(0, 0, 0)
  
  
        } else {
  
          doc.setFontSize(parseFloat(Response["plantilla_pdf"]["plantillasetiquetas"][seg_cab["PkSegmento"]][z]["Tamano"]))
          doc.setFont("helvetica");
          doc.setFontStyle(Response["plantilla_pdf"]["plantillasetiquetas"][seg_cab["PkSegmento"]][z]["TipoLetra"]);
  
          doc.text(parseFloat(Response["plantilla_pdf"]["plantillasetiquetas"][seg_cab["PkSegmento"]][z]["X"]), parseFloat(Response["plantilla_pdf"]["plantillasetiquetas"][seg_cab["PkSegmento"]][z]["Y"]) + parseFloat(altura_ini), Response["plantilla_pdf"]["plantillasetiquetas"][seg_cab["PkSegmento"]][z]["Nombre"]);
        }
      }
    }
    for (z = 0; z < Response["plantilla_pdf"]["plantillascamposcabecera"][seg_cab["PkSegmento"]].length; z++) {
      doc.setFontSize(Response["plantilla_pdf"]["plantillascamposcabecera"][seg_cab["PkSegmento"]][z]["Tamano"]);
  
      var valor = Response["valores_cab"][0][Response["plantilla_pdf"]["plantillascamposcabecera"][seg_cab["PkSegmento"]][z]["Campo"]].toString()
  
      if (Response["plantilla_pdf"]["plantillascamposcabecera"][seg_cab["PkSegmento"]][z]["Tipo"] == 'Barras') {
  
        var vsg_ele = document.createElement("SVG");
  
        JsBarcode(vsg_ele, valor);
  
        var svg2 = vsg_ele.outerHTML;
  
  
        if (svg2)
          svg2 = svg2.replace(/\r?\n|\r/g, '').trim();
  
        var canvas = document.createElement('canvas');
        canvg(canvas, svg2);
  
        var imgData = canvas.toDataURL('image/png');
        limite = Response["plantilla_pdf"]["plantillascamposcabecera"][seg_cab["PkSegmento"]][z]["limite"].split(',')
        // Generate PDF
        doc.addImage(imgData, 'PNG', parseFloat(Response["plantilla_pdf"]["plantillascamposcabecera"][seg_cab["PkSegmento"]][z]["X"]), parseFloat(Response["plantilla_pdf"]["plantillascamposcabecera"][seg_cab["PkSegmento"]][z]["Y"]) + parseFloat(altura_ini), parseInt(limite[0]), parseInt(limite[1]));
  
  
      } else {
        valor = devolver_valor_imp(valor, Response["plantilla_pdf"]["plantillascamposcabecera"][seg_cab["PkSegmento"]][z]["Tipo"], Response["plantilla_pdf"]["plantillascamposcabecera"][seg_cab["PkSegmento"]][z]["Ext"])
  
        if (Response["plantilla_pdf"]["plantillascamposcabecera"][seg_cab["PkSegmento"]][z]["Tipo"] == 'Derecha') {
          doc.text(parseFloat(Response["plantilla_pdf"]["plantillascamposcabecera"][seg_cab["PkSegmento"]][z]["X"]), parseFloat(Response["plantilla_pdf"]["plantillascamposcabecera"][seg_cab["PkSegmento"]][z]["Y"]) + parseFloat(altura_ini), valor.toString(), 'right');
        } else {
          if (Response["plantilla_pdf"]["plantillascamposcabecera"][seg_cab["PkSegmento"]][z]["Tipo"] == 'Color') {
            datos_forma = Response["plantilla_pdf"]["plantillascamposcabecera"][seg_cab["PkSegmento"]][z]["Ext"].split(',')
            doc.setTextColor(parseFloat(datos_forma[0]), parseFloat(datos_forma[1]), parseFloat(datos_forma[2]));
            doc.setFontSize(parseFloat(datos_forma[3]))
  
            doc.text(parseFloat(Response["plantilla_pdf"]["plantillascamposcabecera"][seg_cab["PkSegmento"]][z]["X"]), parseFloat(Response["plantilla_pdf"]["plantillascamposcabecera"][seg_cab["PkSegmento"]][z]["Y"]) + parseFloat(altura_ini), valor.toString());
  
            doc.setTextColor(0, 0, 0);
  
  
          } else {
            doc.setFontStyle("normal");
            limite = Response["plantilla_pdf"]["plantillascamposcabecera"][seg_cab["PkSegmento"]][z]["limite"].split(',')
            var lines = doc.splitTextToSize(valor.toString(), (parseFloat(limite[0]) * 0.2));
            var new_lines = []
            if (limite[1] == '0') {
              limite[1] = lines.length
            } else {
              if (limite[1] > lines.length) {
                limite[1] = lines.length
              }
            }
            for (cv = 0; cv < limite[1]; cv++) {
              if (lines[cv] != '') {
                new_lines.push(lines[cv])
              }
            }
            doc.text(parseFloat(Response["plantilla_pdf"]["plantillascamposcabecera"][seg_cab["PkSegmento"]][z]["X"]), parseFloat(Response["plantilla_pdf"]["plantillascamposcabecera"][seg_cab["PkSegmento"]][z]["Y"]) + parseFloat(altura_ini), new_lines);
          }
        }
      }
  
  
    }
  
  
    var linea = parseFloat(seg_det["AlturaInicial"])
  
    //detallecab
  
    doc.setDrawColor(0, 0, 0)
  
    for (z = 0; z < Response["plantilla_pdf"]["plantillascampos"][seg_det["PkSegmento"]].length; z++) {
      doc.setFontSize(Response["plantilla_pdf"]["plantillascampos"][seg_det["PkSegmento"]][z]["Tamano"]);
  
      doc.setFontStyle("bold");
      if (Response["plantilla_pdf"]["plantillascampos"][seg_det["PkSegmento"]][z]["Tipo"] == 'Derecha') {
        doc.text(parseFloat(Response["plantilla_pdf"]["plantillascampos"][seg_det["PkSegmento"]][z]["X"]), linea, Response["plantilla_pdf"]["plantillascampos"][seg_det["PkSegmento"]][z]["Cabecera"], 'right')
      } else {
        doc.text(parseFloat(Response["plantilla_pdf"]["plantillascampos"][seg_det["PkSegmento"]][z]["X"]), linea, Response["plantilla_pdf"]["plantillascampos"][seg_det["PkSegmento"]][z]["Cabecera"])
      }
  
  
  
    }
    doc.setFillColor(0, 0, 0)
  
    doc.setFont("helvetica");
    doc.setFontStyle("normal");
    //doc.setFontSize(9);
  
    //detalle datos
    var line_add = 0
    for (z2 = 0; z2 < Response["valores_det"].length; z2++) {
      linea = linea + 1 + line_add
      line_add = 0
  
      if (linea > (parseFloat(Response["plantilla_pdf"]["plantillasMain"][ind_pla]["Largo"]) - 3)) {
        doc.addPage('p', 'cm', [parseFloat(Response["plantilla_pdf"]["plantillasMain"][ind_pla]["Largo"]), parseFloat(Response["plantilla_pdf"]["plantillasMain"][ind_pla]["Ancho"])]);
        linea = 2
      }
      for (z = 0; z < Response["plantilla_pdf"]["plantillascampos"][seg_det["PkSegmento"]].length; z++) {
        doc.setFontSize(Response["plantilla_pdf"]["plantillascampos"][seg_det["PkSegmento"]][z]["Tamano"]);
  
        var txt = Response["valores_det"][z2][Response["plantilla_pdf"]["plantillascampos"][seg_det["PkSegmento"]][z]["Campo"]]
  
        var valor = txt.toString()
        valor = devolver_valor_imp(valor, Response["plantilla_pdf"]["plantillascampos"][seg_det["PkSegmento"]][z]["Tipo"], Response["plantilla_pdf"]["plantillascampos"][seg_det["PkSegmento"]][z]["Ext"])
  
        if (valor.length > parseFloat(Response["plantilla_pdf"]["plantillascampos"][seg_det["PkSegmento"]][z]["Limite"]) && Response["plantilla_pdf"]["plantillascampos"][seg_det["PkSegmento"]][z]["Tipo"] != 'Imagen') {
  
  
          var lines = doc.splitTextToSize(valor, (parseFloat(Response["plantilla_pdf"]["plantillascampos"][seg_det["PkSegmento"]][z]["Limite"]) * 0.2));
          //var lines =doc.splitTextToSize(valor, 2);
          doc.text(parseFloat(Response["plantilla_pdf"]["plantillascampos"][seg_det["PkSegmento"]][z]["X"]), linea, lines)
  
          if (lines.length * 0.4 > line_add) {
            line_add = (lines.length * 0.4)
          }
  
  
  
        } else {
  
  
          if (Response["plantilla_pdf"]["plantillascampos"][seg_det["PkSegmento"]][z]["Tipo"] == 'Derecha') {
  
            //doc.text(parseFloat(Response["plantilla_pdf"]["plantillascampos"][seg_det["PkSegmento"]][z]["X"]) + (parseFloat(Response["plantilla_pdf"]["plantillascampos"][seg_det["PkSegmento"]][z]["Limite"]) * 0.02), linea, valor, 'right')
  
            if (parseFloat(seg_det["Alturafinal"]) == 0) {
              doc.text(parseFloat(Response["plantilla_pdf"]["plantillascampos"][seg_det["PkSegmento"]][z]["X"]) + (parseFloat(Response["plantilla_pdf"]["plantillascampos"][seg_det["PkSegmento"]][z]["Limite"]) * 0.02), linea, valor, 'right')
  
            } else {
              var xy = Response["plantilla_pdf"]["plantillascampos"][seg_det["PkSegmento"]][z]["X"].split(',')
              doc.text(parseFloat(xy[0]), parseFloat(xy[1]) + linea, valor, 'right')
  
  
            }
          } else {
            if (Response["plantilla_pdf"]["plantillascampos"][seg_det["PkSegmento"]][z]["Tipo"] == 'Imagen') {
  
              var tag = 'pd' + pestana_int + 'fff' + z2 + 'ccc' + Response["plantilla_pdf"]["plantillascampos"][seg_det["PkSegmento"]][z]["Campo"] + '_img'
              imagen = document.getElementById(tag)
  
              tipo = imagen.attributes["value"]["value"].split('.')
  
              var imgData = getBase64Image(imagen, parseFloat(Response["plantilla_pdf"]["plantillascampos"][seg_det["PkSegmento"]][z]["Ext"]) * 37, parseFloat(Response["plantilla_pdf"]["plantillascampos"][seg_det["PkSegmento"]][z]["Ext"]) * 37)
  
  
              try {
                doc.addImage(imgData, tipo[1].toUpperCase(), parseFloat(Response["plantilla_pdf"]["plantillascampos"][seg_det["PkSegmento"]][z]["X"]), parseFloat(linea - 0.5), parseFloat(Response["plantilla_pdf"]["plantillascampos"][seg_det["PkSegmento"]][z]["Ext"]), parseFloat(Response["plantilla_pdf"]["plantillascampos"][seg_det["PkSegmento"]][z]["Ext"]))
              }
              catch (error) {
                console.error(error);
                // expected output: ReferenceError: nonExistentFunction is not defined
                // Note - error messages will vary depending on browser
              }
  
  
              if (line_add < parseFloat(Response["plantilla_pdf"]["plantillascampos"][seg_det["PkSegmento"]][z]["Ext"])) {
  
                line_add = parseFloat(Response["plantilla_pdf"]["plantillascampos"][seg_det["PkSegmento"]][z]["Ext"])  //2
              }
            } else {
              if (parseFloat(seg_det["Alturafinal"]) == 0) {
                doc.text(parseFloat(Response["plantilla_pdf"]["plantillascampos"][seg_det["PkSegmento"]][z]["X"]), linea, valor)
  
              } else {
                var xy = Response["plantilla_pdf"]["plantillascampos"][seg_det["PkSegmento"]][z]["X"].split(',')
                doc.text(parseFloat(xy[0]), parseFloat(xy[1]) + linea, valor)
  
  
              }
  
            }
          }
        }
      }
      //ciclo de sub detalle
      if(Response["valores_subdet"].length > 0){
        
        for (y2 = 0; y2 < Response["valores_subdet"].length; y2++) {

          //buscar pk abajo de este detalle

          if(Response["valores_subdet"][y2]['PKCabecera']==Response["valores_det"][z2]['Pk' + Response['tabla_det']['Nombre']]){
            linea = linea + 0.5

            for (y3 = 0; y3 < Response["plantilla_pdf"]["plantillascampos3nivel"][seg_det3["PkSegmento"]].length; y3++) {
              doc.setFontSize(10);
              doc.setFontStyle("normal");    
  
              var txt = Response["valores_subdet"][y2][Response["plantilla_pdf"]["plantillascampos3nivel"][seg_det3["PkSegmento"]][y3]["Campo"]]
  
              var valor = txt.toString()
              valor = devolver_valor_imp(valor, Response["plantilla_pdf"]["plantillascampos3nivel"][seg_det3["PkSegmento"]][y3]["Tipo"], Response["plantilla_pdf"]["plantillascampos3nivel"][seg_det3["PkSegmento"]][y3]["Ext"])
        
              if (valor.length > parseFloat(Response["plantilla_pdf"]["plantillascampos3nivel"][seg_det3["PkSegmento"]][y3]["Limite"]) && Response["plantilla_pdf"]["plantillascampos3nivel"][seg_det3["PkSegmento"]][y3]["Tipo"] != 'Imagen') {
  
                var lines = doc.splitTextToSize(valor, (parseFloat(Response["plantilla_pdf"]["plantillascampos3nivel"][seg_det3["PkSegmento"]][y3]["Limite"]) * 0.2));
                //var lines =doc.splitTextToSize(valor, 2);
                doc.text(parseFloat(Response["plantilla_pdf"]["plantillascampos3nivel"][seg_det3["PkSegmento"]][y3]["X"]), linea, lines)
        
                if (lines.length * 0.4 > line_add) {
                  line_add = (lines.length * 0.4)
                }
        
              } else {
        
        
                if (Response["plantilla_pdf"]["plantillascampos3nivel"][seg_det3["PkSegmento"]][y3]["Tipo"] == 'Derecha') {
        
        
                  if (parseFloat(seg_det3["Alturafinal"]) == 0) {
                    doc.text(parseFloat(Response["plantilla_pdf"]["plantillascampos3nivel"][seg_det3["PkSegmento"]][y3]["X"]) + (parseFloat(Response["plantilla_pdf"]["plantillascampos3nivel"][seg_det3["PkSegmento"]][y3]["Limite"]) * 0.02), linea, valor, 'right')
        
                  } else {
                    var xy = Response["plantilla_pdf"]["plantillascampos3nivel"][seg_det3["PkSegmento"]][y3]["X"].split(',')
                    doc.text(parseFloat(xy[0]), parseFloat(xy[1]) + linea, valor, 'right')
        
        
                  }
                } else {
                    if (parseFloat(seg_det3["Alturafinal"]) == 0) {
                      doc.text(parseFloat(Response["plantilla_pdf"]["plantillascampos3nivel"][seg_det3["PkSegmento"]][y3]["X"]), linea, valor)
                    } else {
                      var xy = Response["plantilla_pdf"]["plantillascampos3nivel"][seg_det3["PkSegmento"]][y3]["X"].split(',')
                      doc.text(parseFloat(xy[0]), parseFloat(xy[1]) + linea, valor)
                    }
                }
              }
            }
                

          }
  
        }
  
      }

      //ciclo de sub detalle
      linea = linea + parseFloat(seg_det["Alturafinal"])
    }
  
    linea = linea + 1 + line_add
  
  
    //pie
    if (Response["plantilla_pdf"]["plantillasMain"][ind_pla]["AutoImpreso"] == 'Si') {
      ultima_y = 0
      for (z = 0; z < Response["plantilla_pdf"]["plantillasetiquetas"][seg_pie["PkSegmento"]].length; z++) {
        if (ultima_y < parseFloat(Response["plantilla_pdf"]["plantillasetiquetas"][seg_pie["PkSegmento"]][z]["Y"])) {
          ultima_y = parseFloat(Response["plantilla_pdf"]["plantillasetiquetas"][seg_pie["PkSegmento"]][z]["Y"])
        }
      }
  
      if ((linea + ultima_y) > parseInt(Response["plantilla_pdf"]["plantillasMain"][ind_pla]["Largo"])) {
        doc.addPage('p', 'cm', [parseFloat(Response["plantilla_pdf"]["plantillasMain"][ind_pla]["Largo"]), parseFloat(Response["plantilla_pdf"]["plantillasMain"][ind_pla]["Ancho"])]);
        linea = 2
      }
    } else {
      if (linea >= parseFloat(seg_pie["AlturaInicial"])) {
  
        if(Response["plantilla_pdf"]["plantillasetiquetas"][seg_pie["PkSegmento"]].length > 0 || Response["plantilla_pdf"]["plantillascamposcabecera"][seg_pie["PkSegmento"]].length > 0){
          doc.addPage('p', 'cm', [parseFloat(Response["plantilla_pdf"]["plantillasMain"][ind_pla]["Largo"]), parseFloat(Response["plantilla_pdf"]["plantillasMain"][ind_pla]["Ancho"])]);
        }
      }
      linea = parseFloat(seg_pie["AlturaInicial"])
    }
  
  
  
  
    for (z = 0; z < Response["plantilla_pdf"]["plantillasetiquetas"][seg_pie["PkSegmento"]].length; z++) {
      //doc.text(parseFloat(Response["plantilla_pdf"]["plantillasetiquetas"][seg_pie["PkSegmento"]][z]["X"]), parseFloat(Response["plantilla_pdf"]["plantillasetiquetas"][seg_pie["PkSegmento"]][z]["Y"]) + parseFloat(linea), Response["plantilla_pdf"]["plantillasetiquetas"][seg_pie["PkSegmento"]][z]["Nombre"]);
  
  
      if (Response["plantilla_pdf"]["plantillasetiquetas"][seg_pie["PkSegmento"]][z]["TipoLetra"] == "grafico") {
  
        tamano = Response["plantilla_pdf"]["plantillasetiquetas"][seg_pie["PkSegmento"]][z]["Tamano"].split(',')
        datos = Response["plantilla_pdf"]["plantillasetiquetas"][seg_pie["PkSegmento"]][z]["Nombre"].split(',')
  
        if (datos[0] == "cuadrado") {
  
          doc.setDrawColor(parseFloat(datos[1]), parseFloat(datos[2]), parseFloat(datos[3]))
          doc.setFillColor(parseFloat(datos[1]), parseFloat(datos[2]), parseFloat(datos[3]))
  
          p_x = parseFloat(Response["plantilla_pdf"]["plantillasetiquetas"][seg_pie["PkSegmento"]][z]["X"])
          p_y = parseFloat(Response["plantilla_pdf"]["plantillasetiquetas"][seg_pie["PkSegmento"]][z]["Y"]) + parseFloat(linea)
  
          doc.rect(p_x, p_y, parseFloat(tamano[1]), parseFloat(tamano[0]), 'F')
  
        }
        if (datos[0] == "cuadrado_cir") {
  
          doc.setDrawColor(parseFloat(datos[1]), parseFloat(datos[2]), parseFloat(datos[3]))
          doc.setFillColor(parseFloat(datos[1]), parseFloat(datos[2]), parseFloat(datos[3]))
  
          p_x = parseFloat(Response["plantilla_pdf"]["plantillasetiquetas"][seg_pie["PkSegmento"]][z]["X"])
          p_y = parseFloat(Response["plantilla_pdf"]["plantillasetiquetas"][seg_pie["PkSegmento"]][z]["Y"]) + parseFloat(linea)
  
  
          doc.roundedRect(p_x, p_y, parseFloat(tamano[1]), parseFloat(tamano[0]), 0.3, 0.3, 'FD')
  
        }
  
        doc.setDrawColor(0, 0, 0)
        doc.setFillColor(0, 0, 0)
  
  
      } else {
        doc.setFontSize(parseFloat(Response["plantilla_pdf"]["plantillasetiquetas"][seg_pie["PkSegmento"]][z]["Tamano"]))
        doc.setFont("helvetica");
        doc.setFontStyle(Response["plantilla_pdf"]["plantillasetiquetas"][seg_pie["PkSegmento"]][z]["TipoLetra"]);
  
        doc.text(parseFloat(Response["plantilla_pdf"]["plantillasetiquetas"][seg_pie["PkSegmento"]][z]["X"]), parseFloat(Response["plantilla_pdf"]["plantillasetiquetas"][seg_pie["PkSegmento"]][z]["Y"]) + parseFloat(linea), Response["plantilla_pdf"]["plantillasetiquetas"][seg_pie["PkSegmento"]][z]["Nombre"]);
      }
  
  
    }
  
    for (z = 0; z < Response["plantilla_pdf"]["plantillascamposcabecera"][seg_pie["PkSegmento"]].length; z++) {
  
      var valor = Response["valores_cab"][0][Response["plantilla_pdf"]["plantillascamposcabecera"][seg_pie["PkSegmento"]][z]["Campo"]].toString()
  
      valor = devolver_valor_imp(valor, Response["plantilla_pdf"]["plantillascamposcabecera"][seg_pie["PkSegmento"]][z]["Tipo"], Response["plantilla_pdf"]["plantillascamposcabecera"][seg_pie["PkSegmento"]][z]["Ext"])
  
      if (Response["plantilla_pdf"]["plantillascamposcabecera"][seg_pie["PkSegmento"]][z]["Tipo"] == 'Derecha') {
        doc.text(parseFloat(Response["plantilla_pdf"]["plantillascamposcabecera"][seg_pie["PkSegmento"]][z]["X"]), parseFloat(Response["plantilla_pdf"]["plantillascamposcabecera"][seg_pie["PkSegmento"]][z]["Y"]) + parseFloat(linea), valor.toString(), 'right');
      } else {
  
        if (Response["plantilla_pdf"]["plantillascamposcabecera"][seg_pie["PkSegmento"]][z]["Tipo"] == 'Imagen') {
          var tag = 'p' + pestana_int + 'zzz' + Response["plantilla_pdf"]["plantillascamposcabecera"][seg_pie["PkSegmento"]][z]["Campo"] + '_img'
          imagen = document.getElementById(tag)
  
          tipo = imagen.attributes["value"]["value"].split('.')
          tamano =  Response["plantilla_pdf"]["plantillascamposcabecera"][seg_pie["PkSegmento"]][z]["Ext"].toString().split(',')
  
  
  
          var imgData = getBase64Image(imagen, parseFloat(tamano[0]) * 37, parseFloat(tamano[1]) * 37)
  
          try {
            doc.addImage(imgData, tipo[1].toUpperCase(), parseFloat(Response["plantilla_pdf"]["plantillascamposcabecera"][seg_pie["PkSegmento"]][z]["X"]), parseFloat(Response["plantilla_pdf"]["plantillascamposcabecera"][seg_pie["PkSegmento"]][z]["Y"]) + parseFloat(linea),  parseFloat(tamano[0]),  parseFloat(tamano[1]) )
          }
          catch (error) {
            console.error(error);
            // expected output: ReferenceError: nonExistentFunction is not defined
            // Note - error messages will vary depending on browser
          }
  
  
        } else {
            if (Response["plantilla_pdf"]["plantillascamposcabecera"][seg_pie["PkSegmento"]][z]["Ext"] == 'center') {
              doc.text(parseFloat(Response["plantilla_pdf"]["plantillascamposcabecera"][seg_pie["PkSegmento"]][z]["X"]), parseFloat(Response["plantilla_pdf"]["plantillascamposcabecera"][seg_pie["PkSegmento"]][z]["Y"]) + parseFloat(linea), valor.toString(), 'center');
            } else {
              doc.text(parseFloat(Response["plantilla_pdf"]["plantillascamposcabecera"][seg_pie["PkSegmento"]][z]["X"]), parseFloat(Response["plantilla_pdf"]["plantillascamposcabecera"][seg_pie["PkSegmento"]][z]["Y"]) + parseFloat(linea), valor.toString());
            }
        }
      }
    }
  
  
  
    var date = new Date()
  
    doc.save(Response["tabla_cab"]["Descripcion"] + '_' + date.toLocaleDateString() + " " + date.toLocaleTimeString() + '.pdf');
  
  }
  