
function SriAplicarCedulaRuc(pestana_int, c_nombre) {
    ID_TAG = 'p' + pestana_int + 'zzz' + c_nombre + '';

    idCedula = document.getElementById(ID_TAG).value
    if(idCedula == '9999999999999'){
        aplicarvaloresSri(pestana_int, c_nombre, 'Consumidor Final', '')
        return
    }else{
        if(idCedula.length != 10 && idCedula.length != 13){        
            aplicarvaloresSri(pestana_int, c_nombre, 'Pasaporte', '')
    
        }
        if(idCedula.length == 10){
            if(validarCedulaRuc(idCedula) == true){
                aplicarvaloresSri(pestana_int, c_nombre, 'Cedula', '')
            }else{
                aplicarvaloresSri(pestana_int, c_nombre, 'Pasaporte', '')
            }
        }
        if(idCedula.length == 13){
            $.ajax({
                type: 'POST',
                url: '/sri_cedula',
                data: {'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'id': idCedula, 'campo':c_nombre, 'pestana':pestana_int},
                success: function (Response) {
                  if(Response['Resultado'] == 'Si'){
                    aplicarvaloresSri(Response['pestana'], Response['campo'], 'Ruc', Response['nombreCompleto'])
                  }else{
                    aplicarvaloresSri(Response['pestana'], Response['campo'], 'Pasaporte', '')
                  }
                 }
            });
        }
    
    }



}
function aplicarvaloresSri(pestana_int, c_nombre, Tipo, val_nombre){
    for (sri1 = 0; sri1 < Response["func_cab"][c_nombre][0]['SRI'].length; sri1++) {
        ID_tag_int = 'p' + pestana_int + 'zzz' + Response["func_cab"][c_nombre][0]['SRI'][sri1]['Campo'] + '';
        if(Tipo == 'Pasaporte'){            
            switch(Response["func_cab"][c_nombre][0]['SRI'][sri1]['Tag']) {
                case 'nombreCompleto':
                    document.getElementById(ID_tag_int).value = ''
                    break;
                case 'TipoAtsProveedor':
                    document.getElementById(ID_tag_int).value = '03'
                    break;
                case 'TipoAtsCliente':
                    document.getElementById(ID_tag_int).value = '06'
                    break;
                case 'TipoElectronico':
                    document.getElementById(ID_tag_int).value = '06'
                    break;
                case 'Tipo':
                    document.getElementById(ID_tag_int).value = 'Pasaporte'  
                    break;     
            }            
        }
        if(Tipo == 'Cedula'){            
            switch(Response["func_cab"][c_nombre][0]['SRI'][sri1]['Tag']) {
                case 'nombreCompleto':
                    document.getElementById(ID_tag_int).value = ''
                    break;
                case 'TipoAtsProveedor':
                    document.getElementById(ID_tag_int).value = '02'
                    break;
                case 'TipoAtsCliente':
                    document.getElementById(ID_tag_int).value = '05'
                    break;
                case 'TipoElectronico':
                    document.getElementById(ID_tag_int).value = '05'
                    break;
                case 'Tipo':
                    document.getElementById(ID_tag_int).value = 'Cedula'  
                    break;     
            }            
        }
        if(Tipo == 'Ruc'){            
            switch(Response["func_cab"][c_nombre][0]['SRI'][sri1]['Tag']) {
                case 'nombreCompleto':
                    document.getElementById(ID_tag_int).value = val_nombre
                    break;
                case 'TipoAtsProveedor':
                    document.getElementById(ID_tag_int).value = '01'
                    break;
                case 'TipoAtsCliente':
                    document.getElementById(ID_tag_int).value = '04'
                    break;
                case 'TipoElectronico':
                    document.getElementById(ID_tag_int).value = '04'
                    break;
                case 'Tipo':
                    document.getElementById(ID_tag_int).value = 'Ruc'       
                    break;
            }            
        }
        if(Tipo == 'Consumidor Final'){            
            switch(Response["func_cab"][c_nombre][0]['SRI'][sri1]['Tag']) {
                case 'nombreCompleto':
                    document.getElementById(ID_tag_int).value = 'Consumidor Final'
                    break;
                case 'TipoAtsProveedor':
                    document.getElementById(ID_tag_int).value = '07'
                    break;
                case 'TipoAtsCliente':
                    document.getElementById(ID_tag_int).value = '07'
                    break;
                case 'TipoElectronico':
                    document.getElementById(ID_tag_int).value = '07'
                    break;
                case 'Tipo':
                    document.getElementById(ID_tag_int).value = 'Consumidor Final'       
                    break;
            }            
        }
        
    }
}



function calcular_det_cmpcondicional(pestana_int, fila, c_nombre) {
    Response = dict_pestalla['p-' + pestana_int]
    ID_TAG = 'pd' + pestana_int + 'fff' + fila + 'ccc' + c_nombre + '';
    for (x3 = 0; x3 < Response["func_det"][c_nombre][1].length; x3++) {
        if (Response["func_det"][c_nombre][1][x3]["TipoA"] == "Campo") {
            ID_TAG_campoA = 'pd' + pestana_int + 'fff' + fila + 'ccc' + Response["func_det"][c_nombre][1][x3]["ElementoA"] + '';
            valorA = document.getElementById(ID_TAG_campoA).value
        } else {
            valorA = Response["func_det"][c_nombre][1][x3]["ElementoA"]
        }
        if (Response["func_det"][c_nombre][1][x3]["TipoB"] == "Campo") {
            ID_TAG_campoB = 'pd' + pestana_int + 'fff' + fila + 'ccc' + Response["func_det"][c_nombre][1][x3]["ElementoB"] + '';
            valorB = document.getElementById(ID_TAG_campoB).value
        } else {
            valorB = Response["func_det"][c_nombre][1][x3]["ElementoB"]
        }
        if (Response["func_det"][c_nombre][1][x3]["TipoC"] == "Campo") {
            ID_TAG_campoC = 'pd' + pestana_int + 'fff' + fila + 'ccc' + Response["func_det"][c_nombre][1][x3]["ElementoC"] + '';
            valorC = document.getElementById(ID_TAG_campoC).value
        } else {
            valorC = Response["func_det"][c_nombre][1][x3]["ElementoC"]
        }
        if (Response["func_det"][c_nombre][1][x3]["Operador"] == "=") {
            try {
                if (parseFloat(valorA) == parseFloat(valorB)) {
                    return  valorC
                }                    
            } catch (error) {
                if (valorA == valorB) {
                    return  valorC
                }                   
            }
        }
        if (Response["func_det"][c_nombre][1][x3]["Operador"] == "igual") {
            if (valorA == valorB) {
                return  valorC
            }
        }
        if (Response["func_det"][c_nombre][1][x3]["Operador"] == "!=") {
            if (valorA != valorB) {
                return  valorC
            }
        }
        if (Response["func_det"][c_nombre][1][x3]["Operador"] == ">") {
            if (parseFloat(valorA) > parseFloat(valorB)) {
                return  valorC
            }                    
        }
        if (Response["func_det"][c_nombre][1][x3]["Operador"] == ">=") {
            if (parseFloat(valorA) >= parseFloat(valorB)) {
                return  valorC
            }                    
        }
        if (Response["func_det"][c_nombre][1][x3]["Operador"] == "<") {
            if (parseFloat(valorA) < parseFloat(valorB)) {
                return  valorC
            }                    
        }
        if (Response["func_det"][c_nombre][1][x3]["Operador"] == "<=") {
            if (parseFloat(valorA) <= parseFloat(valorB)) {
                return  valorC
            }                    
        }
    }
}
