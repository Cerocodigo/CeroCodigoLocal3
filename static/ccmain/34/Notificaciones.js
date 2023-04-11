function Notificaciones_buscar_nuevas() {

    $.ajax({
    type: 'POST',
    url: '/notificaciones_buscar',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma},
    success: function (Response) {
        alerta = 0
        
        noti_html = ''
        for (nt = 0; nt < Response['Notis'].length; nt++) {

            alerta = alerta + Response['Notis'][nt]['datos'].length
            noti_html = noti_html + '<div class="col-12">'
            html_tabla = '<table>'
            for (nt2 = 0; nt2 < Response['Notis'][nt]['datos'].length; nt2++) {
                html_tabla = html_tabla + '<tr>'
                for (nt3 = 0; nt3 < Object.keys(Response['Notis'][nt]['datos'][nt2]).length; nt3++) {
                    if(Object.keys(Response['Notis'][nt]['datos'][nt2])[nt3] == '@link'){
                         link = Response['Notis'][nt]['datos'][nt2][Object.keys(Response['Notis'][nt]['datos'][nt2])[nt3]].split(',')
                         pkmodulo = link[0]
                         pkregistro = link[1]
                         tipo= 2
                         temp_pestalla= '-2'
                         origen= 0
                         t_clave =  ''
                         html_tabla = html_tabla +  '<td data-dismiss="modal" onclick="registro(pkmodulo, pkregistro, tipo, temp_pestalla, origen, t_clave)" style="cursor: pointer;color: blue;" >Ver Registro</td>'
                    }else{
                        html_tabla = html_tabla + '<td>' + Response['Notis'][nt]['datos'][nt2][Object.keys(Response['Notis'][nt]['datos'][nt2])[nt3]]+ '</td>'
                    }

                }
                html_tabla = html_tabla + '</tr>'
            }
            html_tabla = html_tabla + '</table>'

            noti_html = html_tabla + '</div>'
            


            
        }
        
        document.getElementById('div_modal_errores').innerHTML = noti_html

        document.getElementById('div_errores').innerHTML = alerta
        //setTimeout('Notificaciones_buscar_nuevas()',(1000*60));  

    }
    });
  }