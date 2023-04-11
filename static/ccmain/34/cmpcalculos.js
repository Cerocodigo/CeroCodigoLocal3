

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
            if (valorA == valorB) {
                return  valorC
            }
        }
        if (Response["func_det"][c_nombre][1][x3]["Operador"] == "!=") {
            if (valorA != valorB) {
                return  valorC
            }
        }
    }
}
