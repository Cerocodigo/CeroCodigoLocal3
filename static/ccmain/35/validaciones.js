
function verificar_validar_registro(pestana_int) {
    //calcular_0(pestana_int)
  
    Response = dict_pestalla['p-' + pestana_int]
    valio = false
    valiodet = false
    Errores = []
    Erroresdet = []
    Erroresdet2 = []
  
  
    if (Response["validaciones"].length > 0) {
      for (x = 0; x < Response["validaciones"][0].length; x++) {
        valorA = 0
        ValorB = 0
        if (Response["validaciones"][0][x]["EstadoA"] == "C") {
          valorA = document.getElementById('p' + pestana_int + 'zzz' + Response["validaciones"][0][x]["ElementoA"]).value
        } else {
          valorA = Response["validaciones"][0][x]["ElementoA"]
        }
        if (Response["validaciones"][0][x]["EstadoB"] == "C") {
          valorB = document.getElementById('p' + pestana_int + 'zzz' + Response["validaciones"][0][x]["ElementoB"]).value
        } else {
          valorB = Response["validaciones"][0][x]["ElementoB"]
        }
  
        if (Response["validaciones"][0][x]["Operador"] == "largo") {
          if ((valorA.length) != valorB) {
            valio = true
            esta_grbando = 0
            Errores.push(Response["validaciones"][0][x]["Mensaje"])
  
          }
        }
        if (Response["validaciones"][0][x]["Operador"] == "largo_min") {
          if ((valorA.length) < valorB) {
            valio = true
            esta_grbando = 0
            Errores.push(Response["validaciones"][0][x]["Mensaje"])
          }
        }
        if (Response["validaciones"][0][x]["Operador"] == "=") {
  
          if (Response["validaciones"][0][x]["ElementoB"] == "unico") {
            tt_pk = document.getElementById('p' + pestana_int + 'zzzPk' + Response["tabla_cab"]["Nombre"]).value
            tt_valor = valorA
            tt_tabla = Response["tabla_cab"]["Nombre"]
            tt_campo = Response["validaciones"][0][x]["ElementoA"]
            $.ajax({
              type: 'POST',
              async: false,
              url: '/unico',
              data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'valor': tt_valor, 'pk': tt_pk, 'tabla': tt_tabla, 'campo': tt_campo, 'usuario': web_usuario, 'msg': Response["validaciones"][0][x]["Mensaje"] },
              success: function (Response) {
                if (Response["resp"] != '0') {
                  valio = true
                  esta_grbando = 0
                  Errores.push(Response["msg"])
                }
              }
            });
          } else {
            if (valorA != valorB) {
              valio = true
              esta_grbando = 0
              Errores.push(Response["validaciones"][0][x]["Mensaje"])
            }
          }
  
        }
        if (Response["validaciones"][0][x]["Operador"] == ">") {
          if (parseFloat(valorA) <= parseFloat(valorB)) {
            valio = true
            esta_grbando = 0
            Errores.push(Response["validaciones"][0][x]["Mensaje"])
          }
        }
        if (Response["validaciones"][0][x]["Operador"] == "<") {
          if (parseFloat(valorA) >= parseFloat(valorB)) {
            valio = true
            esta_grbando = 0
            Errores.push(Response["validaciones"][0][x]["Mensaje"])
          }
        }
        if (Response["validaciones"][0][x]["Operador"] == ">=") {
          if (parseFloat(valorA) < parseFloat(valorB)) {
            valio = true
            esta_grbando = 0
            Errores.push(Response["validaciones"][0][x]["Mensaje"])
          }
        }
        if (Response["validaciones"][0][x]["Operador"] == "<=") {
          if (parseFloat(valorA) > parseFloat(valorB)) {
            valio = true
            esta_grbando = 0
            Errores.push(Response["validaciones"][0][x]["Mensaje"])
          }
        }
        if (Response["validaciones"][0][x]["Operador"] == "Igual") {
          if (valorB == "Obligatorio") {
            if (valorA.length == 0) {
              valio = true
              esta_grbando = 0
              Errores.push(Response["validaciones"][0][x]["Mensaje"])
            }
          } else {
            if (valorA != valorB) {
              valio = true
              esta_grbando = 0
              Errores.push(Response["validaciones"][0][x]["Mensaje"])
            }
          }
        }
        if (Response["validaciones"][0][x]["Operador"] == "!=") {
          if (valorA == valorB) {
            valio = true
            esta_grbando = 0
            Errores.push(Response["validaciones"][0][x]["Mensaje"])
          }
        }
        if (Response["validaciones"][0][x]["Operador"] == "No Igual") {
          if (valorA == valorB) {
            valio = true
            esta_grbando = 0
            Errores.push(Response["validaciones"][0][x]["Mensaje"])
          }
        }
      }
    }
  
    if (Response["validaciones"].length > 1) {
  
      for (x = 0; x < Response["validaciones"][1].length; x++) {
        for (x2 = 0; x2 < (cc_porPesta['p-' + pestana_int] + 1); x2++) {
          tagA = 'pd' + pestana_int + 'fff' + x2 + 'ccc' + Response["validaciones"][1][x]["ElementoA"]
          tagB = 'pd' + pestana_int + 'fff' + x2 + 'ccc' + Response["validaciones"][1][x]["ElementoB"]
          tagver = 'pd' + pestana_int + 'fff' + x2 + 'ccc' + Response["campos_det"][1]["Nombre"]
  
  
          if (document.getElementById(tagver) != null) {
  
            var linew = document.getElementById('f' + pestana_int + '-f' + x2)
            linew.style.backgroundColor = "white"
            valorA = 0
            valorB = 0
            if (Response["validaciones"][1][x]["EstadoA"] == "C") {
              valorA = document.getElementById(tagA).value
            } else {
              valorA = Response["validaciones"][1][x]["ElementoA"]
            }
            if (Response["validaciones"][1][x]["EstadoB"] == "C") {
              valorB = document.getElementById(tagB).value
            } else {
              valorB = Response["validaciones"][1][x]["ElementoB"]
            }
            if (Response["validaciones"][1][x]["Operador"] == "=") {
              if (valorB == 'unico') {
                contador_A = 0
                for (z2 = 0; z2 < (cc_porPesta['p-' + pestana_int] + 1); z2++) {
                  tagX = 'pd' + pestana_int + 'fff' + z2 + 'ccc' + Response["validaciones"][1][x]["ElementoA"]
                  if (document.getElementById(tagX) != null) {
                    if (valorA == document.getElementById(tagX).value) { contador_A = contador_A + 1 }
                  }
                }
                if (contador_A > 1) {
                  valiodet = true
                  Erroresdet.push({ 'msg': Response["validaciones"][1][x]["Mensaje"], 'linea': x2 })
                }
              } else {
                if (parseFloat(valorA) != parseFloat(valorB)) {
                  valiodet = true
                  Erroresdet.push({ 'msg': Response["validaciones"][1][x]["Mensaje"], 'linea': x2 })
                }
              }
            }
            if (Response["validaciones"][1][x]["Operador"] == ">") {
              if (parseFloat(valorA) <= parseFloat(valorB)) {
                valiodet = true
                Erroresdet.push({ 'msg': Response["validaciones"][1][x]["Mensaje"], 'linea': x2 })
              }
            }
            if (Response["validaciones"][1][x]["Operador"] == "<") {
              if (parseFloat(valorA) >= parseFloat(valorB)) {
                valiodet = true
                Erroresdet.push({ 'msg': Response["validaciones"][1][x]["Mensaje"], 'linea': x2 })
              }
            }
            if (Response["validaciones"][1][x]["Operador"] == ">=") {
              if (parseFloat(valorA) < parseFloat(valorB)) {
                valiodet = true
                Erroresdet.push({ 'msg': Response["validaciones"][1][x]["Mensaje"], 'linea': x2 })
              }
            }
            if (Response["validaciones"][1][x]["Operador"] == "<=") {
              if (parseFloat(valorA) > parseFloat(valorB)) {
                valiodet = true
                Erroresdet.push({ 'msg': Response["validaciones"][1][x]["Mensaje"], 'linea': x2 })
              }
            }
            if (Response["validaciones"][1][x]["Operador"] == "Igual") {
              if (valorA != valorB) {
                valiodet = true
                Erroresdet.push({ 'msg': Response["validaciones"][1][x]["Mensaje"], 'linea': x2 })
              }
            }
            if (Response["validaciones"][1][x]["Operador"] == "!=") {
              if (parseFloat(valorA) == parseFloat(valorB)) {
                valiodet = true
                Erroresdet.push({ 'msg': Response["validaciones"][1][x]["Mensaje"], 'linea': x2 })
              }
            }
            if (Response["validaciones"][1][x]["Operador"] == "No Igual") {
              if (valorA == valorB) {
                valiodet = true
                Erroresdet.push({ 'msg': Response["validaciones"][1][x]["Mensaje"], 'linea': x2 })
              }
            }
            if (Response["validaciones"][1][x]["Operador"] == "Igual o") {
              var splitt = valorB.split(',')
              var valorb_1s = splitt[0].split(':')
              if (valorb_1s[0] == 'C') {
                tagB = 'pd' + pestana_int + 'fff' + x2 + 'ccc' + valorb_1s[1]
                var valorb_1 = document.getElementById(tagB).value
              }
              if (valorb_1s[0] == 'V') {
                var valorb_1 = valorb_1s[1]
              }
  
              var valorb_2s = splitt[1].split(':')
              if (valorb_2s[0] == 'C') {
                tagB = 'pd' + pestana_int + 'fff' + x2 + 'ccc' + valorb_2s[1]
                var valorb_2 = document.getElementById(tagB).value
              }
              if (valorb_2s[0] == 'V') {
                var valorb_2 = valorb_2s[1]
              }
  
              if (valorA != valorb_1) {
                if (valorA != valorb_2) {
                  valiodet = true
                  Erroresdet.push({ 'msg': Response["validaciones"][1][x]["Mensaje"], 'linea': x2 })
                }
              }
            }
            if (Response["validaciones"].length > 2) {
              for (v = 0; v < Response["validaciones"][2].length; v++) {
                for (v2 = 0; v2 < (ccsub_porPesta['p-' + pestana_int] + 1); v2++) {
                  tagA = 'ps' + pestana_int + 'qqq' + v2 + 'yyy' + x2 + 'www' + Response["validaciones"][2][v]["ElementoA"]
                  tagB = 'ps' + pestana_int + 'qqq' + v2 + 'yyy' + x2 + 'www' + Response["validaciones"][2][v]["ElementoB"]
                  tagver = 'ps' + pestana_int + 'qqq' + v2 + 'yyy' + x2 + 'www' + Response["campos_det"][2]["Nombre"]
                  var line = v2 + '-' + x2
  
                  if (document.getElementById(tagver) != null) {
                    valorA = 0
                    valorB = 0
                    if (Response["validaciones"][2][v]["EstadoA"] == "C") {
                      valorA = document.getElementById(tagA).value
                    } else {
                      valorA = Response["validaciones"][2][v]["ElementoA"]
                    }
                    if (Response["validaciones"][2][v]["EstadoB"] == "C") {
                      valorB = document.getElementById(tagB).value
                    } else {
                      valorB = Response["validaciones"][2][v]["ElementoB"]
                    }
                    if (Response["validaciones"][2][v]["Operador"] == "=") {
                      if (valorB == 'unico') {
                        contador_A = 0
                        for (z2 = 0; z2 < (ccsub_porPesta['p-' + pestana_int] + 1); z2++) {
                          tagX = 'ps' + pestana_int + 'qqq' + z2 + 'yyy' + x2 + 'www' + + Response["validaciones"][2][v]["ElementoA"]
                          if (document.getElementById(tagX) != null) {
                            if (valorA == document.getElementById(tagX).value) { contador_A = contador_A + 1 }
                          }
                        }
                        if (contador_A > 1) {
                          valiodet = true
                          Erroresdet2.push({ line: Response["validaciones"][2][v]["Mensaje"] })
                        }
                      } else {
                        if (parseFloat(valorA) != parseFloat(valorB)) {
                          valiodet = true
                          Erroresdet2.push({ line: Response["validaciones"][2][v]["Mensaje"] })
                        }
                      }
                    }
                    if (Response["validaciones"][2][v]["Operador"] == ">") {
                      if (parseFloat(valorA) <= parseFloat(valorB)) {
                        valiodet = true
                        Erroresdet2.push({ line: Response["validaciones"][2][v]["Mensaje"] })
                      }
                    }
                    if (Response["validaciones"][2][v]["Operador"] == "<") {
                      if (parseFloat(valorA) >= parseFloat(valorB)) {
                        valiodet = true
                        Erroresdet2.push({ line: Response["validaciones"][2][v]["Mensaje"] })
                      }
                    }
                    if (Response["validaciones"][2][v]["Operador"] == ">=") {
                      if (parseFloat(valorA) < parseFloat(valorB)) {
                        valiodet = true
                        Erroresdet2.push({ line: Response["validaciones"][2][v]["Mensaje"] })
                      }
                    }
                    if (Response["validaciones"][2][v]["Operador"] == "<=") {
                      if (parseFloat(valorA) > parseFloat(valorB)) {
                        valiodet = true
                        Erroresdet2.push({ line: Response["validaciones"][2][v]["Mensaje"] })
                      }
                    }
                    if (Response["validaciones"][2][v]["Operador"] == "Igual") {
                      if (valorA != valorB) {
                        valiodet = true
                        Erroresdet2.push({ line: Response["validaciones"][2][v]["Mensaje"] })
                      }
                    }
                    if (Response["validaciones"][2][v]["Operador"] == "!=") {
                      if (parseFloat(valorA) == parseFloat(valorB)) {
                        valiodet = true
                        Erroresdet2.push({ line: Response["validaciones"][2][v]["Mensaje"] })
                      }
                    }
                    if (Response["validaciones"][2][v]["Operador"] == "No Igual") {
                      if (valorA == valorB) {
                        valiodet = true
                        Erroresdet2.push({ line: Response["validaciones"][2][v]["Mensaje"] })
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    if (valiodet == false && valio == false) {
      return true
    } else {
  
      var txt_cond = ''
      for (z = 0; z < Errores.length; z++) {
        txt_cond = txt_cond + Errores[z] + '\n'
      }
      for (z = 0; z < Erroresdet.length; z++) {
        txt_cond = txt_cond + Erroresdet[z]['msg'] + '\n'
        var linew = document.getElementById('f' + pestana_int + '-f' + Erroresdet[z]['linea'])
        linew.style.backgroundColor = "yellow"
  
      }
      for (z = 0; z < Erroresdet2.length; z++) {
        for (x2 = 0; x2 < Object.keys(Erroresdet2[z]).length; x2++) {
          txt_cond = txt_cond + Erroresdet2[z][Object.keys(Erroresdet2[z])[x2]] + '\n'
        }
      }
  
      alert(txt_cond)
      return false
    }
  }



function validar_registro(pestana_int) {

    //calcular_0(pestana_int)
    calcular_0_v2(pestana_int,[])
    for (zx = 0; zx < (cc_porPesta['p-' + pestana_int] + 1); zx++) {
      for (zy = 0; zy < (ccsub_porPesta['p-' + pestana_int] + 1); zy++) {
        calcular_subdetalle(pestana_int, zy, zx)
      }
  
      calcular_detalle(pestana_int, zx)
    }
  
    if (verificar_validar_registro(pestana_int) == true) {
      alert("Validado")
    }
  }
  
function txt_solo_letras(valor) 
{
    
    if(valor.length <= 4 ){
        alert('Minimo 5 letras')
        return false
    }

    if(valor.length > 30 ){
        alert('Maximo 30 letras')
        return false
    }
    if(valor[0] == '_' || valor[0] == ' ' || !(isNaN(valor[0]))){
        alert('Debe empezar por letras')
        return false
    }

    const pattern = new RegExp('^[A-Z_ ]+$', 'i');

    if(!pattern.test(valor)){ 
        alert('Solo Letras, Espacios y _')
        return false

    }
    return true

}