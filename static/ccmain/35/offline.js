

var offline = false

var offProcesos = []
var respuestas_pre = {}
var bases_pregargadas = {}
var offlineResponde = {}

function busca_enviar(tiempo) {


    document.getElementById('div_offlinecc').innerHTML = tiempo

    if(tiempo <= 0){
        arraylocal = JSON.parse(localStorage.getItem('CeroCodigoPendiente'))
        if(arraylocal.length > 0){
            grabar_elemento_offline(arraylocal[0])
        }else{
            setTimeout('busca_enviar('+(60*10)+')',1000);
        }

    }else{
        tiempo = tiempo - 1
        setTimeout('busca_enviar('+tiempo+')',1000);
    }

}

function calcular_0_offline_cab(Response) {


    for (ee = 0; ee < (Response["campos_cab"].length); ee++) {
        if (ee < Response["campos_cab"].length) {

            if (Response["campos_cab"][ee]["Modificable"] == 'Si' || Response['tipo'] == 'Nuevo') {


                if (Response["campos_cab"][ee]["TablaCampo"] == "cmpnumsecuencial") {

                    if ('Pk' + Response["tabla_cab"]["Nombre"] != Response["campos_cab"][ee]["Nombre"]) {
                        //'fuente': $(this).attr("value"),
                        $.ajax({
                            type: 'POST',
                            async: false,
                            url: '/cmpnumsecuencial',
                            data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'PkEstructura': Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][0]['PkEstructura'], 'Nombre': Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][0]['Nombre'], 'Aumento': Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][0]['Aumento'], 'usuario': web_usuario, 'id_tag_ajax': 'ID_TAG' },
                            success: function (Response_int) {
                                if (Response_int["cmpvalor"].length == 0) {
                                    Response['valores_cab'][0][Response["campos_cab"][ee]["Nombre"]] = 0
                                } else {
                                    Response['valores_cab'][0][Response["campos_cab"][ee]["Nombre"]] = Response_int["cmpvalor"]
                                }
                            }
                        });
                    }
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
                            if (Response['valores_cab'][0][Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][2][x3]["Elemento"]] == null) {
                                FaltaDato = true
                                A_Where = A_Where + " '' "
                            } else {
                                A_Where = A_Where + " '" + Response['valores_cab'][0][Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][2][x3]["Elemento"]] + "' "
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


                            if (Response['valores_cab'][0][Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][3][x3]["Elemento"]] == "") {
                                FaltaDato = true
                                A_Select = A_Select + " '' "
                            } else {
                                A_Select = A_Select + " '" + Response['valores_cab'][0][Response["func_cab"][Response["campos_cab"][ee]["Nombre"]][3][x3]["Elemento"]] + "' "
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
                        Response['valores_cab'][0][Response["campos_cab"][ee]["Nombre"]] = 0

                    } else {
                        ID_TAG_resp = 'p' + 0 + 'zzz' + Response["campos_cab"][ee]["Nombre"] + '';
                        ID_TAG_nombre = Response["campos_cab"][ee]["Nombre"]
                        $.ajax({
                            type: 'POST',
                            async: false,
                            url: '/consolidado',
                            data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'cmpsenten': sentencia, 'tag1': ID_TAG_resp, 'tag2': ID_TAG_nombre, 'usuario': web_usuario },
                            success: function (Response_int) {
                                if (Response_int["cmpvalor"].length == 0) {
                                    Response['valores_cab'][0][Response["campos_cab"][ee]["Nombre"]] = 0
                                } else {
                                    if (Response_int["cmpvalor"][0][Response["campos_cab"][ee]["Nombre"]] == null) {
                                        Response['valores_cab'][0][Response["campos_cab"][ee]["Nombre"]] = 0
                                    } else {
                                        Response['valores_cab'][0][Response["campos_cab"][ee]["Nombre"]] = Response_int["cmpvalor"][0][Response["campos_cab"][ee]["Nombre"]]
                                    }
                                }
                            }
                        });
                    }
                }
            }
        }
    }
    return Response
}

function grabar_elemento_offline(id_pen) {
    //esta_grbando = 0

    Response = JSON.parse(localStorage.getItem(id_pen))

    Response = calcular_0_offline_cab(Response)

    viende_calen = 0

    disparador_real = "Guardar Registro Nuevo"


    envio_archi = []
    envio_datset = {}
    array_cab = Response["valores_cab"]
    array_det = Response["valores_det"]
    array_subdet = Response["valores_subdet"]
    autorizacion = [0, 0]
    ingreso_cab = {}
    ingreso_subdet = {}
    tiene_detalle = 'Si'
    electro = ''

    for (x = 0; x < Response["campos_cab"].length; x++) {

        if (Response["campos_cab"][x]["TablaCampo"] == "cmpelectronico") {
            array_cab[0][Response["campos_cab"][x]["Nombre"]] = devolver_clave_acceso_ffline(Response["campos_cab"][x]["Nombre"], array_cab, Response)

        }

    }
    envio_datset[Response["tabla_cab"]["Nombre"]] = array_cab

    if (Response["tabla_det"] != 0) {

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


    $.ajax({
        type: 'POST',
        url: '/regis_guardar',
        data: { 'fuente': 'no se que es', 'csrfmiddlewaretoken': web_token, 'tiene_detalle': tiene_detalle, 'tiene_subdetalle': tiene_subdetalle, 'Id_empresa': web_Id_empresa, 'nom_tabla': Response["tabla_cab"]["Nombre"], 'disparador': disparador_real, 'pkmodulo': Response["tabla_cab"]["PkModulo"], 'array_cab': JSON.stringify(array_cab), 'array_det': JSON.stringify(array_det), 'array_subdet': JSON.stringify(array_subdet), 'usuario': web_usuario, 'campos_cab': JSON.stringify(Response["campos_cab"]), 'campos_det': JSON.stringify(Response["campos_det"]), 'campos_subdet': JSON.stringify(Response["campos_subdet"]), 'envio_datset': JSON.stringify(envio_datset), 'pestalla': 0, 'autorizacion': autorizacion[0], 'clave_acc': autorizacion[1], 'tablaDatos': JSON.stringify(Response["tabla_cab"]) },
        error: function (request, error) {
            busca_enviar(60*10)
            alert(" Error mostrar a administrador: " + error);

        },
        success: function (Response) {

            if (Response["grabo"] == true) {
                
                arraylocal = JSON.parse(localStorage.getItem('CeroCodigoPendiente'))
                if(arraylocal[0] == id_pen){
                    arraylocal.shift()
                }else{
                    for (x2 = 0; x2 < arraylocal.length; x2++) {
                        if(id_pen ==arraylocal[x2] ){
                            arraylocal.slice(x2,1)
                        }
                    }
                }

                localStorage.setItem('CeroCodigoPendiente' , JSON.stringify(arraylocal))
                localStorage.removeItem(id_pen)
                if(arraylocal.length>0){
                    grabar_elemento_offline(arraylocal[0])
                }

                
            } else {
                mensaje = ''
                for (x2 = 0; x2 < Object.keys(Response["msg"]).length; x2++) {
                    mensaje = mensaje + '-' + Object.keys(Response["msg"])[x2] + ': ' + Response["msg"][Object.keys(Response["msg"])[x2]] + '<br>'
                }
                alert(mensaje)
            }
        }
    });



}

function pasar_offlines() {
    var divi = document.getElementById('div_offline')
    if (offline == true) {
        offline = false
        divi.innerHTML = 'In-line'
    } else {
        offline = true
        divi.innerHTML = 'off-line'
    }
}

function cragar_offlines() {

    $.ajax({
        type: 'POST',
        url: '/offline_inicial',
        data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma },
        success: function (Response) {
            for (co1 = 0; co1 < Response["respuestas_pre"].length; co1++) {
                respuestas_pre[Response["respuestas_pre"][co1]['PkId']] = Response["respuestas_pre"][co1]['Valor']
            }
            for (co1 = 0; co1 < Object.keys(Response["bases_pregargadas"]).length; co1++) {
                bases_pregargadas[Object.keys(Response["bases_pregargadas"])[co1]] = Response["bases_pregargadas"][Object.keys(Response["bases_pregargadas"])[co1]]
            }
            for (co1 = 0; co1 < Response["offlineResponde"].length; co1++) {
                offlineResponde[Response["offlineResponde"][co1]['pkmodulo']] = Response["offlineResponde"][co1]['data']
            }
            var divi = document.getElementById('a_default_offline')
            divi.innerHTML = '<i class="fa fa-lock"></i><span class="label label-green" style="background: green;" id="div_offline">Inline</span>'

            
            arraylocal = JSON.parse(localStorage.getItem('CeroCodigoPendiente'))
            if(arraylocal != null){
                if(arraylocal.length > 0){
                    grabar_elemento_offline(arraylocal[0])
                }else{
                    setTimeout('busca_enviar('+(60*10)+')',1000);
                }
            }else{
                setTimeout('busca_enviar('+(60*10)+')',1000);
            }
        }
    });


}


