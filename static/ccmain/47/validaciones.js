//Función para cargar las condiciones guardadas
async function cargarCondicionesGuardadas(idAcordion, arrayCampos) {
  try {
    /* Resumen:
    1. Llamar al servidor usando AJAX a la url /CondicionesDetalleXCondicionesTraer para traer las condiciones guardadas
    2. Recibir el array de condiciones: [{PkEstructura, PkId, PkCondicion, ElementoA, ElementoB, Operador, EstadoA, EstadoB, Mensaje}]
    3. Recorrer el array de condiciones y crear las filas de la tabla de condiciones
    4. Retornar el string de las filas creadas

    Input:
    - idAcordion: Es el identificador del acordion que se está editando, este identificador representa la PkEstructura.
    - arrayCampos: Es un string con los campos que se pueden seleccionar en el select de campos de la tabla de condiciones.

    Usa:
    - condicionesEditar_add_fila(idAcordion, arrayCampos, ciclo, arrayTemporalCondiciones) para crear las filas de la tabla de condiciones.

    Output:
    - new_fila: Es un string con las filas creadas para la tabla de condiciones.

    */
    const Response = await $.ajax({
      type: 'POST',
      url: '/CondicionesDetalleXCondicionesTraer',
      data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'pkestructura': idAcordion }
    });
    const arrayCondiciones = Response.condiciones.map(condicion => {
      return { 'pkCondDetalle': condicion.PkId, 'campo': condicion.ElementoA, 'operador': condicion.Operador, 'tipo': condicion.EstadoB, 'elemento': condicion.ElementoB, 'mensaje': condicion.Mensaje };
    });

    var new_fila = "";
    var arrayTemporalCondiciones = [];
    //Recorrer el array de condiciones y crear las filas de la tabla de condiciones
    for (var i = 0; i < arrayCondiciones.length; i++) {
      //Obtener los valores del array y crear las filas
      var pkCondDetalle = arrayCondiciones[i].pkCondDetalle;
      var campo = arrayCondiciones[i].campo;
      var operador = arrayCondiciones[i].operador;
      var tipo = arrayCondiciones[i].tipo;
      var elemento = arrayCondiciones[i].elemento;
      var mensaje = arrayCondiciones[i].mensaje;
      arrayTemporalCondiciones.push({ 'pkCondDetalle': pkCondDetalle, 'campo': campo, 'operador': operador, 'tipo': tipo, 'elemento': elemento, 'mensaje': mensaje });
      //Usar la función para crear la fila enviando el arrayTemporalCondiciones con las condiciones para crear la fila
      var condicionesString = await condicionesEditar_add_fila(idAcordion, arrayCampos, i, arrayTemporalCondiciones);
      new_fila = new_fila + condicionesString;
      //Vaciar el arrayTemporalCondiciones para la siguiente fila
      arrayTemporalCondiciones = [];
    }

    //Retornar el string de las filas creadas formateado en html
    return new_fila;
  } catch (error) {
    console.log(error);
  }
}

//Función para eliminar una fila de la tabla de condiciones
function condicionesEditar_remove_fila(campo) {
  /* Resumen:
  1. Obtener el PkCondDetalle de la fila que se va a eliminar
  2. Mostrar un mensaje de confirmación
  3. Si el usuario confirma la eliminación:
    3.1. Validar si el PkCondDetalle es diferente de 0 para eliminar la fila de la base de datos
    3.2. Eliminar la fila de la tabla de condiciones

  Input:
  - campo: Es el campo que se está editando, este campo representa la PkCondDetalle.

  Output:
  - No tiene output.

  */

  try {
    // Obtener el PkCondDetalle de la fila que se va a eliminar
    fila = campo.parentElement.parentElement.id.replace("fila", "");
    PkCondDetalle = $("#pkCondDetalle" + fila).val();

    // Mostrar un mensaje de confirmación
    var confirmacion = confirm("¿Estás seguro de que deseas eliminar este elemento?");

    // Si el usuario confirma la eliminación
    if (confirmacion) {
      // Validar si el PkCondDetalle es diferente de 0 para eliminar la fila de la base de datos
      if (PkCondDetalle != 0) {
        // Llamar al servidor usando AJAX a la URL /CondicionesDetalleXCondicionesEliminar para eliminar la fila de la base de datos y mostrar en consola la respuesta
        $.ajax({
          type: 'POST',
          url: '/CondicionesDetalleXCondicionesEliminar',
          data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'pkCondDetalle': PkCondDetalle },
          success: function (response) {
            //Mostrar un mensaje de éxito
            //alert(response.mensaje);
          }
        });
      }  
      // Eliminar la fila de la tabla de condiciones
      campo.parentElement.parentElement.remove();
    }
  } catch (error) {
    console.log(error);
  }
}

//Función para agregar una fila a la tabla de condiciones.
async function condicionesEditar_add_fila(idAcordion, arrayCampos, ciclo, arrayTemporalCondiciones) {
  try {
    /* Resumen:
    - Si se recibe condicionesEditar_add_fila(idAcordion, arrayCampos):
    1. Crear la fila con los campos vacíos.
    2. Agrega la fila creada a la tabla de condiciones.

    - Si se recibe condicionesEditar_add_fila(idAcordion, arrayCampos, ciclo, arrayTemporalCondiciones):
    1. Asignación de variables para crear la fila usando el arrayTemporalCondiciones.
    2. Crear la fila con los campos llenos.
    3. Retornar el string de la fila creada.

    Input:
    - idAcordion: Es el identificador del acordion que se está editando, este identificador representa la PkEstructura.
    - arrayCampos: Es un string con los campos que se pueden seleccionar en el select de campos de la tabla de condiciones.
    - ciclo: (Opcional) Es el número de la fila que se está creando.
    - arrayTemporalCondiciones: (Opcional) Es un array con las condiciones que se van a agregar a la fila.

    Output:
    - new_fila: Es un string con la fila creada para la tabla de condiciones.
    1. Agrega el new_fila a la tabla de condiciones correspondiente al idAcordion.
    2. Retorna el string de la fila creada.
    
    */

    //Definir el identificador del acordion usando numAcordion
    idAcordion = idAcordion.toString();
    var numAcordion;
    if (idAcordion.includes("btnCondEditarAgregarfila")) {
      numAcordion = idAcordion.replace("btnCondEditarAgregarfila", "");
    } else {
      numAcordion = idAcordion;
    }
    if (Array.isArray(arrayTemporalCondiciones) && arrayTemporalCondiciones.length > 0) {
      //Asignación de variables para crear la fila
      var pkCondDetalle = arrayTemporalCondiciones[0].pkCondDetalle;
      var campo = arrayTemporalCondiciones[0].campo;
      var operador = arrayTemporalCondiciones[0].operador;
      var tipo = arrayTemporalCondiciones[0].tipo;
      var elemento = arrayTemporalCondiciones[0].elemento;
      var mensaje = arrayTemporalCondiciones[0].mensaje;
    } else {
      var arrayCampos = arrayCampos.split(',');
      //Validar si  $('#cond_estructura' + numAcordion + ' tbody tr:last-child').attr('id') == undefined
      if ($('#cond_estructura' + numAcordion + ' tbody tr:last-child').attr('id') == undefined) {
        var ciclo = "0";
      } else {
        var idFila = $('#cond_estructura' + numAcordion + ' tr:last').attr('id');
        var ciclo = idFila.replace("fila" + numAcordion.toString(), "");
        ciclo = parseInt(ciclo, 10);
        ciclo = ciclo + 1;
        ciclo = ciclo.toString();
      }
      var pkCondDetalle = "0";

    }

    //Creando nueva fila de tabla de condiciones
    var new_fila = '<tr id="fila' + numAcordion + ciclo + '">';
    //Creando botón de eliminar fila
    new_fila = new_fila + '<td><button type="button" onclick="condicionesEditar_remove_fila(this)" class="btn bg-red btn-flat margin" style="padding: 3px 8px;margin-bottom: 0px;margin-top: 0px;">-</button></td>';
    //Creando input con el pkCondDetalle oculto
    new_fila = new_fila + '<input type="hidden" id="pkCondDetalle' + numAcordion + ciclo + '" value="' + pkCondDetalle + '">';

    //Creando select de campos
    new_fila = new_fila + '<td>';
    new_fila = new_fila + '<select id="selCampoA' + numAcordion + ciclo + '" class="form-control col-sm-3" style="height: 25px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;">';
    //Carga de campos en el select selCampoA, con un if para calidar si es el campo seleccionado
    for (var i = 0; i < arrayCampos.length; i++) {
      //Validar si arrayTemporalCondiciones no está vacío y coincide con el campo actual
      if (Array.isArray(arrayTemporalCondiciones) && arrayTemporalCondiciones.length > 0 && campo == arrayCampos[i]) {
        new_fila = new_fila + '<option value="' + arrayCampos[i] + '" selected>' + arrayCampos[i] + '</option>';
      }
      else {
        new_fila = new_fila + '<option value="' + arrayCampos[i] + '">' + arrayCampos[i] + '</option>';
      }
    }
    //new_fila = new_fila + selectOpction;
    new_fila = new_fila + '</select>';
    new_fila = new_fila + '</td>';

    //Creando select de operadores
    new_fila = new_fila + '<td>';
    new_fila = new_fila + '<select id="selOperador' + numAcordion + ciclo + '" class="form-control col-sm-2" style="height: 25px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;">';
    arrayOperaciones = ["=", ">", "<", ">=", "<=", "Igual", "No Igual"];
    //Carga de campos en el select selOperador, con un if para calidar si es el campo seleccionado
    for (var i = 0; i < arrayOperaciones.length; i++) {
      //Validar si arrayTemporalCondiciones no está vacío y coincide con el campo actual
      if (Array.isArray(arrayTemporalCondiciones) && arrayTemporalCondiciones.length > 0 && operador == arrayOperaciones[i]) {
        new_fila = new_fila + '<option value="' + arrayOperaciones[i] + '" selected>' + arrayOperaciones[i] + '</option>';
      }
      else {
        new_fila = new_fila + '<option value="' + arrayOperaciones[i] + '">' + arrayOperaciones[i] + '</option>';
      }
    }
    new_fila = new_fila + '</select>';
    new_fila = new_fila + '</td>';

    //Creando select de tipo de elemento
    new_fila = new_fila + '<td>';
    new_fila = new_fila + '<select id="selTipoElemento' + numAcordion + ciclo + '" class="form-control col-sm-1" style="height: 25px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;" onchange="elemento_campo_o_valor(this.value, this.id, \'' + arrayCampos + '\')">';
    arrayTipoElemento = ["Campo", "Valor"];
    //Carga de campos en el select selTipoElemento, con un if para calidar si es el campo seleccionado
    for (var i = 0; i < arrayTipoElemento.length; i++) {
      //Validar si arrayTemporalCondiciones no está vacío y coincide con el campo actual
      if (Array.isArray(arrayTemporalCondiciones) && arrayTemporalCondiciones.length > 0 && tipo === arrayTipoElemento[i].charAt(0)) {
        new_fila = new_fila + '<option value="' + arrayTipoElemento[i] + '" selected>' + arrayTipoElemento[i] + '</option>';
      }
      else {
        new_fila = new_fila + '<option value="' + arrayTipoElemento[i] + '">' + arrayTipoElemento[i] + '</option>';
      }
    }
    new_fila = new_fila + '</select>';
    new_fila = new_fila + '</td>';

    //Creando elemento de campo o valor
    new_fila = new_fila + '<td id="td_elemento' + numAcordion + ciclo + '">';
    //Validar si existe un elemento en el arrayTemporalCondiciones
    if (Array.isArray(arrayTemporalCondiciones) && arrayTemporalCondiciones.length > 0) {
      //Validar si el elemento es campo o valor
      if (tipo.charAt(0) === "V") {
        //Creando input elemento
        new_fila = new_fila + '<input type="text" id="elemento' + numAcordion + ciclo + '" class="form-control col-sm-3" style="height: 25px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;" value="' + elemento + '">';
      }
      else {
        //Creando select elemento
        new_fila = new_fila + '<select id="elemento' + numAcordion + ciclo + '" class="form-control col-sm-3" style="height: 25px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;">';
        //new_fila = new_fila + selectOpction;

        //Carga de campos en el select elemento, con un if para calidar si es el campo seleccionado
        for (var i = 0; i < arrayCampos.length; i++) {
          //Validar si arrayTemporalCondiciones coincide con el campo actual
          if (elemento == arrayCampos[i]) {
            new_fila = new_fila + '<option value="' + arrayCampos[i] + '" selected>' + arrayCampos[i] + '</option>';
          }
          else {
            new_fila = new_fila + '<option value="' + arrayCampos[i] + '">' + arrayCampos[i] + '</option>';
          }
        }
      }
    }
    else {
      //Creando select elemento
      new_fila = new_fila + '<select id="elemento' + numAcordion + ciclo + '" class="form-control col-sm-3" style="height: 25px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;">';
      //Carga de campos en el select elemento
      for (var i = 0; i < arrayCampos.length; i++) {
        new_fila = new_fila + '<option value="' + arrayCampos[i] + '">' + arrayCampos[i] + '</option>';
      }
    }
    new_fila = new_fila + '</td>';

    //Creando input para mensaje de error
    new_fila = new_fila + '<td>';
    if (Array.isArray(arrayTemporalCondiciones) && arrayTemporalCondiciones.length > 0) {
      new_fila = new_fila + '<input type="text" id="msgError' + numAcordion + ciclo + '" class="form-control col-sm-3" style="height: 25px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;" value="' + mensaje + '">';
    }
    else {
      new_fila = new_fila + '<input type="text" id="msgError' + numAcordion + ciclo + '" class="form-control col-sm-3" style="height: 25px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;">';
    }
    new_fila = new_fila + '</td>';

    //Valida si la fila es para agregar a la tabla o solo para retornarla
    if (idAcordion.includes("btnCondEditarAgregarfila")) {
      //Creando una nueva fila en la tabla de condiciones
      //$('#cond_estructura' + numAcordion + ' tr:last').after(new_fila);
      //$('#cond_estructura' + numAcordion + ' tbody tr:last-child').after(new_fila);
      $('table#cond_estructura' + numAcordion + ' tbody').append(new_fila);

    } else {
      //Retornando la fila creada
      return new_fila;
    }
  } catch (error) {
    console.log(error);
    return "";
  }
}

//Función para guardar las condiciones de los acordiones de condiciones en el servidor y en la base de datos
function grabar_cond_editar(arrayPkEstructura, pestana_int) {
  /* Resumen:
    1. Recorre el array de pkEstructura para obtener los datos de cada acordion de condiciones
    2. Recorre las filas de cada acordion de condiciones para obtener los datos de cada condición
    3. Guarda las condiciones en un arrayCondiciones
    4. Guarda el arrayCondiciones en un arrayData junto con su pkEstructura
    5. Envía el arrayData al servidor para guardar las condiciones en la base de datos
    6. Recibe la respuesta del servidor y refresh la tabla de condiciones

    Input:
    - arrayPkEstructura: array con los pkEstructura de los acordiones de condiciones
    - pestana_int: pkPestana de la pestaña actual

    Output:
    - Actualiza la tabla de condiciones con las condiciones guardadas en la base de datos
    
    */

  var arrayPkEstructura = arrayPkEstructura.split(',');
  var arrayData = [];
  //Ciclo para recorrer todos los acordiones de condiciones
  for (var i_estructura = 0; i_estructura < arrayPkEstructura.length; i_estructura++) {
    //Ciclo para recorrer todas las filas de la tabla de condiciones
    var arrayCondiciones = [];
    for (var i_fila = 0; i_fila < $('#cond_estructura' + arrayPkEstructura[i_estructura] + ' tr').length - 1; i_fila++) {
      //$('#cond_estructura995 tr')[2].id.replace("fila995", "")
      var idFila = $('#cond_estructura' + arrayPkEstructura[i_estructura] + ' tr')[i_fila + 1].id.replace("fila" + arrayPkEstructura[i_estructura].toString(), "");
      //Obtener pkCondDetalle, campo, operador, tipo, elemento y mensaje de la fila actual
      var pkCondDetalle = $("#pkCondDetalle" + arrayPkEstructura[i_estructura] + idFila).val();
      var campo = $("#selCampoA" + arrayPkEstructura[i_estructura] + idFila).val();
      var operador = $("#selOperador" + arrayPkEstructura[i_estructura] + idFila).val();
      var tipo = $("#selTipoElemento" + arrayPkEstructura[i_estructura] + idFila).val();
      var elemento = $("#elemento" + arrayPkEstructura[i_estructura] + idFila).val();
      var mensaje = $("#msgError" + arrayPkEstructura[i_estructura] + idFila).val();
      //Añadir los datos de la fila actual al array de condiciones
      arrayCondiciones.push({ "pkCondDetalle": pkCondDetalle, "campo": campo, "operador": operador, "tipo": tipo, "elemento": elemento, "mensaje": mensaje });

    }
    //Añadir los arrayCondiciones con los datos a un array arrayData para enviar al servidor, identificando cada array con el pkEstructura 
    arrayData.push({ "pkEstructura": arrayPkEstructura[i_estructura], "arrayCondiciones": arrayCondiciones });

  }
  //Llamar al servidor para guardar las condiciones en la base de datos
  $.ajax({
    type: 'POST',
    url: '/CondicionesDetalleXCondicionesGuardar',
    dataType: 'json',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'arrayData': JSON.stringify(arrayData) },
    success: function (response) {
      //Validar si el array de respuesta {'message': 'Se ha guardado:', 'data': array_response} en data contiene datos
      if (Array.isArray(response.data) && response.data.length > 0) {
        //Se recarga la tabla de condiciones con los datos guardados llamando a la función function CondicionesEditar(pestana_int) 
        CondicionesEditar(pestana_int);
      }

    },
    error: function (error) {
      console.error('Error en la solicitud AJAX:', error);
    }
  });


}


//Función para crear acordiones de condiciones
async function CondicionesEditar(pestana_int) {
  try {
    /*  Resumen:
    1. Llamar al servidor usando AJAX a la url /CondicionesTraer para traer las estructuras correspondientes al módulo.
    2. Se empieza a estructurar el html que contendrá los acordiones usando un for para recorrer las estructuras traídas del servidor.
    3. En cada ciclo usando AJAX se llama a la url /actualizar_campos para traer los campos correspondientes a la estructura.
    4. Se empieza a estructurar el html de los acordiones y con ello el html de las tablas de condiciones.
    5. Se cargan las condiciones existentes en las tablas de condiciones.
    6. Se carga el html de los acordiones en la pestana correspondiente.

    Input:
    - pestana_int: Número de la pestaña en la que se encuentra el usuario.

    Usa:
    - cargarCondicionesGuardadas(idAcordion, arrayCampos): Función para cargar las condiciones guardadas en la base de datos.
    - condicionesEditar_add_fila(idAcordion, arrayCampos): Función para agregar una fila nueva a la tabla de condiciones, en el botón de agregar condición.

    Output: 
    - Se carga el html de los acordiones en la pestana correspondiente. 
    
    */
    //Obtener el valor de pestaña_int y mostrarlo en consola
    data = dict_pestalla['p-' + pestana_int];
    htmlInsert = '';
    //Llamada ajax para obtener las estructuras del módulo
    const Response = await $.ajax({
      type: 'POST',
      url: '/CondicionesTraer',
      data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'pkmodulo': data['tabla'][0]['PkModulo'] },
      beforeSend: function () {
        document.getElementById("rr" + pestana_int).innerHTML = 'Cargando Data...';
      }
    });
    //Estructurando el html de los acordiones
    htmlInsert = `<div class="col-md-12">
      <div class="box box-solid">
        <div class="box-header with-border">
          <h3 class="box-title">Condiciones</h3>
        </div>
        <!-- /.box-header -->
        <div class="box-body">
        `;

    //Crear array para guardar pk de la estructura
    var arrayPkEstructura = [];
    //Ciclo para recorrer las estructuras
    for (Cond_01 = 0; Cond_01 < Response["estructuras"].length; Cond_01++) {
      //Guardar pk de la estructura en el array
      arrayPkEstructura.push(Response["estructuras"][Cond_01]['PkEstructura']);
      //Llamada ajax para obtener los campos de la estructura
      const ResponseCampos = await $.ajax({
        type: 'POST',
        url: '/actualizar_campos',
        data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'tabla': Response["estructuras"][Cond_01]['Nombre'] }
      });
      //Cargar los campos en un array
      var arrayCampos = [];
      for (var i = 0; i < ResponseCampos.campos.length; i++) {
        arrayCampos.push(ResponseCampos.campos[i].Nombre);
      }
      //Estructurando el html de los acordiones
      htmlInsert += '<div class="panel box box-primary">';
      htmlInsert += '<div class="box-header with-border">';
      htmlInsert += '<h4 class="box-title">';
      htmlInsert += '<a data-toggle="collapse" data-parent="#condicionesAccordion" href="#condaccordion' + Response["estructuras"][Cond_01]['PkEstructura'] + '" aria-expanded="false" class="collapsed">';
      htmlInsert += Response["estructuras"][Cond_01]['Nombre'];
      htmlInsert += '</a></h4>';
      htmlInsert += '</div>';
      htmlInsert += '<div id="condaccordion' + Response["estructuras"][Cond_01]['PkEstructura'] + '" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">';
      htmlInsert += '<div class="box-body">';
      htmlInsert += '<div class="row" id="cond_estructura_row">';
      //Estructurando el html de las tablas de condiciones
      htmlInsert += '<table id="cond_estructura' + Response["estructuras"][Cond_01]['PkEstructura'] + '" class="table table-bordered" style="width: 1115px;overflow-x:auto;font-size: 11px;background: white;">';
      htmlInsert += `
                <thead>
                  <tr>
                    <th style="width: 20px;">
                    `;
      //Botón para agregar una fila nueva a la tabla de condiciones
      htmlInsert += '<button type="button" id="btnCondEditarAgregarfila' + Response["estructuras"][Cond_01]['PkEstructura'] + '" class="btn bg-green btn-flat margin" onclick="condicionesEditar_add_fila(this.id,\'' + arrayCampos +
        '\')"  style="padding: 3px 8px;margin-bottom: 0px;margin-top: 0px;">+</button>';
      htmlInsert += `
                    </th>
                    <th class="text-center col-md-3">Campo a validar</th>
                    <th style="border-top: none" class="text-center col-md-2">Operador</th>
                    <th class="text-center col-md-1">Tipo de elemento</th>
                    <th class="text-center col-md-3">Elemento</th>
                    <th style="border-top: none" class="text-center col-md-3">Mensaje de error</th>
                  </tr>
                </thead>
                <tbody>
                `;
      //Cargar las condiciones guardadas en la base de datos
      htmlInsert += await cargarCondicionesGuardadas(Response["estructuras"][Cond_01]['PkEstructura'], arrayCampos);
      htmlInsert += `
                </tbody>
                </table>          
            </div>
          </div>
        `;
      htmlInsert += '</div></div>';
      //Añadir el html de los acordiones a la pestana correspondiente
      document.getElementById("rr" + pestana_int).innerHTML = htmlInsert;
    }
    htmlInsert += '<div class="box-tools pull-right"> ';
    htmlInsert += '<button type="button" onclick="grabar_cond_editar(\'' + arrayPkEstructura + '\', \'' + pestana_int + '\' )" class="btn bg-green btn-flat margin" data-dismiss="modal">Grabar</button>';
    htmlInsert += '<button type="button" class="btn bg-gray btn-flat margin" data-dismiss="modal">Cancelar</button>'
    htmlInsert += '</div> ';
    htmlInsert += `
          </div>
        <!-- /.box-body -->
      </div>
    <!-- /.box -->
    </div>`;
    //Añadir el html de los acordiones a la pestana correspondiente
    document.getElementById("rr" + pestana_int).innerHTML = htmlInsert;

  } catch (error) {
    console.log(error);
  }
}

//Función para manipular el html de la columna "Elemento" de la tabla de condiciones entre "Campo" y "Valor"
function elemento_campo_o_valor(tipo, idTipoElemento, camposString) {
  /* Resumen:
  1. Se obtiene el número de fila de la tabla de condiciones
  2. Se obtiene el elemento td de la columna "Elemento" de la fila numFila
  3. Se valida si existe el elemento td
  4. Se limpia el elemento td
  5. Se valida si el tipo de elemento es "Campo" o "Valor"
  6. Se crea el html para el select de "Campo" o el input de "Valor"
  7. Se inserta el html en el elemento td

  Input:
  - tipo: Valor del select tipo de elemento a crear ("Campo" o "Valor")
  - idTipoElemento: Id del select tipo de elemento
  - camposString: String con los campos separados por coma

  Output:
  - Modifica el html de la columna "Elemento" de la fila correspondiente de la tabla de condiciones.

  */

  //Se obtiene el número de fila de la tabla de condiciones
  var numFila = idTipoElemento.replace('selTipoElemento', '');
  //Se obtiene el elemento td de la columna "Elemento" de la fila numFila
  var td_elemento = document.getElementById('td_elemento' + numFila);
  //Se valida si existe el elemento td
  if (td_elemento) {
    //Se limpia el elemento td
    td_elemento.innerHTML = '';
    //Se valida si el tipo de elemento es "Campo"
    if (tipo === 'Campo') {
      //Se crea un array con los campos separados por coma
      var arrayCampos = camposString.split(',');
      // Crear un nuevo select con opciones de campo
      var selectHTML = '<select id="elemento' + numFila + '" class="form-control col-sm-3" style="height: 25px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;">';
      //agregar las opciones al usando el arrayCampos
      for (var i = 0; i < arrayCampos.length; i++) {
        selectHTML += '<option value="' + arrayCampos[i] + '">' + arrayCampos[i] + '</option>';
      }
      selectHTML += '</select>';
      //Asignar el select al elemento td
      td_elemento.innerHTML = selectHTML;
    } else if (tipo === 'Valor') {
      // Crear un nuevo input de tipo texto
      var inputHTML = '<input id="elemento' + numFila + '" type="text" class="form-control col-sm-3" style="height: 25px;font-size: 11px;line-height: 7px;">';
      //Asignar el input al elemento td
      td_elemento.innerHTML = inputHTML;
    }
  }
}





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
        if (isNaN(valorA) == isNaN(valorB)) {
          if (parseFloat(valorA) >= parseFloat(valorB)) {
            valio = true
            esta_grbando = 0
            Errores.push(Response["validaciones"][0][x]["Mensaje"])
          }
        } else {
          esta_grbando = true
          Errores.push(Response["validaciones"][0][x]["ElementoA"] + ' , ' + Response["validaciones"][0][x]["ElementoB"] + ' Valores no Decimales')
        }
      }
      if (Response["validaciones"][0][x]["Operador"] == ">=") {
        if (isNaN(valorA) == isNaN(valorB)) {
          if (parseFloat(valorA) < parseFloat(valorB)) {
            valio = true
            esta_grbando = 0
            Errores.push(Response["validaciones"][0][x]["Mensaje"])
          }
        } else {
          esta_grbando = true
          Errores.push(Response["validaciones"][0][x]["ElementoA"] + ' , ' + Response["validaciones"][0][x]["ElementoB"] + ' Valores no Decimales')
        }
      }
      if (Response["validaciones"][0][x]["Operador"] == "<=") {
        if (isNaN(valorA) == isNaN(valorB)) {
          if (parseFloat(valorA) > parseFloat(valorB)) {
            valio = true
            esta_grbando = 0
            Errores.push(Response["validaciones"][0][x]["Mensaje"])
          }
        } else {
          esta_grbando = true
          Errores.push(Response["validaciones"][0][x]["ElementoA"] + ' , ' + Response["validaciones"][0][x]["ElementoB"] + ' Valores no Decimales')
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
            if (isNaN(valorA) == isNaN(valorB)) {
              if (parseFloat(valorA) <= parseFloat(valorB)) {
                valiodet = true
                Erroresdet.push({ 'msg': Response["validaciones"][1][x]["Mensaje"], 'linea': x2 })
              }
            } else {
              valiodet = true
              Erroresdet.push({ 'msg': 'Valores no Decimales', 'linea': x2 })
            }
          }
          if (Response["validaciones"][1][x]["Operador"] == "<") {
            if (isNaN(valorA) == isNaN(valorB)) {
              if (parseFloat(valorA) >= parseFloat(valorB)) {
                valiodet = true
                Erroresdet.push({ 'msg': Response["validaciones"][1][x]["Mensaje"], 'linea': x2 })
              }
            } else {
              valiodet = true
              Erroresdet.push({ 'msg': 'Valores no Decimales', 'linea': x2 })
            }

          }
          if (Response["validaciones"][1][x]["Operador"] == ">=") {
            if (isNaN(valorA) == isNaN(valorB)) {
              if (parseFloat(valorA) < parseFloat(valorB)) {
                valiodet = true
                Erroresdet.push({ 'msg': Response["validaciones"][1][x]["Mensaje"], 'linea': x2 })
              }
            } else {
              valiodet = true
              Erroresdet.push({ 'msg': 'Valores no Decimales', 'linea': x2 })
            }
          }
          if (Response["validaciones"][1][x]["Operador"] == "<=") {
            if (isNaN(valorA) == isNaN(valorB)) {
              if (parseFloat(valorA) > parseFloat(valorB)) {
                valiodet = true
                Erroresdet.push({ 'msg': Response["validaciones"][1][x]["Mensaje"], 'linea': x2 })
              }
            } else {
              valiodet = true
              Erroresdet.push({ 'msg': 'Valores no Decimales', 'linea': x2 })
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
                tagver = 'ps' + pestana_int + 'qqq' + v2 + 'yyy' + x2 + 'www' + Response["campos_subdet"][2]["Nombre"]

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
  calcular_0_v2(pestana_int, [])
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

function txt_solo_letras(valor) {

  if (valor.length <= 4) {
    alert('Minimo 5 letras')
    return false
  }

  if (valor.length > 30) {
    alert('Maximo 30 letras')
    return false
  }
  if (valor[0] == '_' || valor[0] == ' ' || !(isNaN(valor[0]))) {
    alert('Debe empezar por letras')
    return false
  }

  const pattern = new RegExp('^[A-Z_ ]+$', 'i');

  if (!pattern.test(valor)) {
    alert('Solo Letras, Espacios y _')
    return false

  }
  return true

}