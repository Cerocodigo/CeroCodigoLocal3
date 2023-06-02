function cambio_estado(pkmodulo, pkregistro, pkestado, pestana_int) {

    l_variables = dict_pestalla['p-' + pestana_int]['estados']
    p_variable = {}
    knum = 0
    tipoAccion = '' 
            
    for (var i = 0; i < l_variables.length; i++) {
    if (l_variables[i]['pkweb_estados_doc'] == pkestado) {
        knum = i
        for (var i2 = 0; i2 < l_variables[i]['variables'].length; i2++) {
        let vari = prompt(l_variables[i]['variables'][i2]['Nombre'], "");
        let text;
        if (vari == null || vari == "") {
            p_variable[l_variables[i]['variables'][i2]['Nombre']] = ""
        } else {
            p_variable[l_variables[i]['variables'][i2]['Nombre']] = vari
        }
        }
    
        if(l_variables[knum]['accion'] == 'Acciones' || l_variables[knum]['accion'] == 'Accion'){

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
        if(l_variables[knum]['accion'] == 'Registro'){

            t_traspasos = []

            for (var i2 = 0; i2 < l_variables[knum]['traspaso'].length; i2++) {
                t_traspasos.push({'CampoDestino':l_variables[knum]['traspaso'][i2]['campoDestino'], 'Valor':dict_pestalla['p-' + pestana_int]['valores_cab'][0][l_variables[knum]['traspaso'][i2]['campoOrigen']]})
            }
            
            registro(l_variables[knum]['estado_final'],0,0,pestana_int,0,0,t_traspasos, l_variables[knum]['display'])

        }
    }

    }
}