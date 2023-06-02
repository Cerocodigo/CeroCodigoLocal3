

function Eliminar_cmpcampo(temp_pestalla){

}
function modificar_cmpcampo(temp_pestalla){
  trepar_datos_campos_modal(temp_pestalla)
  document.getElementById('modal_campos_nombre').readOnly = 'readonly'
  document.getElementById('modal_campos_display').readOnly = 'readonly'
}


function cargar_datos_cmp_modal(temp_pestalla, fuente, CmpNombre, nivel){

  document.getElementById('modal_campos_pestana').value = temp_pestalla
  if(document.getElementById('modal_campos_nivel').value == 'cabecera'){
    func_base = 'func_cab'
  }
  if(document.getElementById('modal_campos_nivel').value == 'detalle'){
    func_base = 'func_det'
  }
  
  
  base_fun = dict_pestalla['p-'+temp_pestalla][func_base][CmpNombre]

  if(fuente =='cmptxtsimple'){ 
    document.getElementById('cmptexto_Predeterminado').value = base_fun[0]['ValorPredeterminado']
    document.getElementById('cmptexto_Largo').value = base_fun[0]['Largo']
    
    if(base_fun[0]['Unico'] == 'Y'){
      document.getElementById('cmptexto_Unico').value = 'Si'
    }else{
      document.getElementById('cmptexto_Unico').value = 'No'

    }
    if(base_fun[0]['Modificable'] == 'Y'){
      document.getElementById('cmptexto_Modificable').value = 'Si'
    }else{
      document.getElementById('cmptexto_Modificable').value = 'No'

    }

    if(base_fun[0]['Cedula'] == 'N'){
      document.getElementById('cmptexto_tipo').value = 'Normal'
    }else{
      document.getElementById('cmptexto_tipo').value = 'Cedula'

    }  
  }

  if(fuente == 'cmpnumsimple'){ 

    document.getElementById('cmpnumsimple_Decimales').value = base_fun[0]['NumDecimales']
    document.getElementById('cmpnumsimple_Menor').value = base_fun[0]['Menor']
    document.getElementById('cmpnumsimple_Mayor').value = base_fun[0]['Mayor']
    document.getElementById('cmpnumsimple_Valor').value = base_fun[0]['Predeterminado']
  }

  if(fuente =='cmpnumsecuencial'){ 
    document.getElementById('cmpnumsimple_Inicia').value = base_fun[0]['ValorInicial']
    document.getElementById('cmpnumsimple_Aumenta').value = base_fun[0]['Aumento']
  }

  
  if(fuente =='cmpopcmultiple'){  
    
    opcvalores = document.getElementById('cmp_opcion')
    htm_tr = opcvalores.children[0].children[0].outerHTML
    opcvalores.children[0].innerHTML = htm_tr

    for (var i = 0; i < base_fun.length; i++) {
      cmpopcion_add_fila()
      opcvalores.children[0].children[i + 1].children[1].children[0].value = base_fun[i]['Nombre']
      opcvalores.children[0].children[i + 1].children[2].children[0].value = base_fun[i]['Valor']
      opcvalores.children[0].children[i + 1].children[3].children[0].value = base_fun[i]['Color']
      opcvalores.children[0].children[i + 1].children[3].children[0].style.background = base_fun[i]['Color']
    } 

  }

  if(fuente =='cmpsistema'){  
    if(base_fun[0]['PkId'] == 2){
      document.getElementById('cmpsistema_valor').value = 'Usuario Actual'
    }
    if(base_fun[0]['PkId'] == 1){
      document.getElementById('cmpsistema_valor').value = 'Fecha Actual'
    }
    if(base_fun[0]['PkId'] == 4){
      document.getElementById('cmpsistema_valor').value = 'Lista usuarios'
    }
    
  }
  if(fuente =='cmpformuladetalle'){  

    document.getElementById('cmpformuladetalle_operacion').value = base_fun[0][0]['Operacion']
    document.getElementById('cmpformuladetalle_campo').value = base_fun[0][0]['Campo'].split('.')[1]
    document.getElementById('cmpformuladetalle_decimales').value = base_fun[0][0]['Condicion']

    
    formulavalores = document.getElementById('cmpformuladetalle_row')

    for (var i = 0; i < base_fun[1].length; i++) {
      cmpformuladetalle_add_fila(temp_pestalla) 

      formulavalores.children[0].children[0].children[i+1].children[1].children[0].value = base_fun[1][i]['Campo']
      if(base_fun[1][i]['Operador'] == 'igual'){formulavalores.children[0].children[0].children[i+1].children[2].children[0].value = 'Igual Texto'}
      if(base_fun[1][i]['Operador'] == '='){formulavalores.children[0].children[0].children[i+1].children[2].children[0].value = 'Igual Numero'}
      if(base_fun[1][i]['Operador'] == '!='){formulavalores.children[0].children[0].children[i+1].children[2].children[0].value = 'Distinto'}
      if(base_fun[1][i]['Operador'] == '>'){formulavalores.children[0].children[0].children[i+1].children[2].children[0].value = 'Mayor'}
      if(base_fun[1][i]['Operador'] == '>='){formulavalores.children[0].children[0].children[i+1].children[2].children[0].value = 'Mayor Igual'}
      if(base_fun[1][i]['Operador'] == '<'){formulavalores.children[0].children[0].children[i+1].children[2].children[0].value = 'Menor'}
      if(base_fun[1][i]['Operador'] == '<='){formulavalores.children[0].children[0].children[i+1].children[2].children[0].value = 'Menor igual'}
      
      formulavalores.children[0].children[0].children[i+1].children[3].children[0].value = base_fun[1][i]['Tipo']

      formulavalores.children[0].children[0].children[i+1].children[4].children[0].style.display = 'none' 
      formulavalores.children[0].children[0].children[i+1].children[4].children[1].style.display = 'none'

      if(base_fun[1][i]['Tipo'] == 'Campo'){
        formulavalores.children[0].children[0].children[i+1].children[4].children[0].value = base_fun[1][i]['Valor'] 
        formulavalores.children[0].children[0].children[i+1].children[4].children[0].style.display = ''
      }
      if(base_fun[1][i]['Tipo'] == 'Valor'){
        formulavalores.children[0].children[0].children[i+1].children[4].children[1].value = base_fun[1][i]['Valor'] 
        formulavalores.children[0].children[0].children[i+1].children[4].children[1].style.display = ''

      }
      

    }

  


  }
  if(fuente =='cmpfecha'){  
    if(base_fun[0]['Tiempo'] == 'Y'){
      document.getElementById('cmpfecha_tiempo').value = 'Y'
    }else{
      document.getElementById('cmpfecha_tiempo').value = 'N'

    }
        

  }
  if(fuente =='cmpreferencia'){  // faltaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa


  }
  if(fuente =='cmpreferenciaadjunto'){  
    
    document.getElementById('cmpreferenciaadjunto_campo').value = base_fun[0]['PkCampoReferencia']
    document.getElementById('cmpreferenciaadjunto_campo').text = base_fun[0]['CampoReferencia']
    
    document.getElementById('cmpreferenciaadjunto_sentencia').value = base_fun[0]['Sentencia']

    document.getElementById('cmpreferenciaadjunto_Tipo').value = base_fun[0]['Tipo']


    document.getElementById('cmpreferenciaadjunto_Tamano').value = base_fun[0]['Tamano']
    if(base_fun[0]['Tamano'] == 'P'){document.getElementById('cmpreferenciaadjunto_Tamano').value ='Pequeno'}
    if(base_fun[0]['Tamano'] == 'M'){document.getElementById('cmpreferenciaadjunto_Tamano').value ='Mediano'}
    if(base_fun[0]['Tamano'] == 'G'){document.getElementById('cmpreferenciaadjunto_Tamano').value ='Grande'}

    if(base_fun[0]['Modificable'] == 'S' ){
      document.getElementById('cmpreferenciaadjunto_Modificable').value == 'Si'
    }else{
      document.getElementById('cmpreferenciaadjunto_Modificable').value == 'No'
    }

    if(base_fun[0]['TieneClave'] == 'Si' ){
      document.getElementById('cmpreferenciaadjunto_Clave').value == 'Si'
      document.getElementById('cmpreferenciaadjunto_ClaveVal').value = base_fun[0]['Clave']
    }else{
      document.getElementById('cmpreferenciaadjunto_Clave').value == 'No'
    }

    if(base_fun[0]['Tamano'] == 'Y' ){
      document.getElementById('cmpreferenciaadjunto_Modificable').value == 'Si'
    }else{
      document.getElementById('cmpreferenciaadjunto_Modificable').value == 'No'
    }
  

  }
  if(fuente =='cmpoperacion'){  

    
    document.getElementById('cmpoperacion_decimales').value = base_fun[0][0]['Decimales'] 

    formulavalores = document.getElementById('cmpoperacion_row')
    for (var i = 0; i < base_fun[1].length; i++) {
      cmpoperacion_add_fila(temp_pestalla)
      formulavalores.children[0].children[0].children[i+1].children[2].children[0].style.display = 'none'
      formulavalores.children[0].children[0].children[i+1].children[2].children[1].style.display = 'none'
      formulavalores.children[0].children[0].children[i+1].children[2].children[2].style.display = 'none'

      
      if(base_fun[1][i]['Estado'] == 'C'){
        formulavalores.children[0].children[0].children[i+1].children[2].children[0].style.display = ''
        formulavalores.children[0].children[0].children[i+1].children[1].children[0].value = 'Campo'
        formulavalores.children[0].children[0].children[i+1].children[2].children[0].value =  base_fun[1][i]['Sentencia']
      }
      if(base_fun[1][i]['Estado'] == 'V'){
        formulavalores.children[0].children[0].children[i+1].children[2].children[1].style.display = ''
        formulavalores.children[0].children[0].children[i+1].children[1].children[0].value = 'Valor'
        formulavalores.children[0].children[0].children[i+1].children[2].children[1].value =  base_fun[1][i]['Sentencia']
      }
      if(base_fun[1][i]['Estado'] == 'O'){
        formulavalores.children[0].children[0].children[i+1].children[2].children[2].style.display = ''
        formulavalores.children[0].children[0].children[i+1].children[1].children[0].value = 'Operacion'
        formulavalores.children[0].children[0].children[i+1].children[2].children[2].value =  base_fun[1][i]['Sentencia']
      }
    }
  }
  if(fuente =='cmpconsolidado'){  // faltaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa

  }
  if(fuente =='cmparchivo'){  
    document.getElementById('cmparchivo_ruta').value = base_fun[0]['Ruta']

  }
  if(fuente =='cmpnumeroaletras'){ 

    document.getElementById('cmpnumeroaletras_campo').selectedOptions[0].value = base_fun[0]['PkCampoNumero']
    document.getElementById('cmpnumeroaletras_campo').selectedOptions[0].text = base_fun[0]['CampoNumero']

  }
  if(fuente =='cmpdecabecera'){  
    document.getElementById('cmpdecabecera_campo').value =  base_fun[0]['Descripcion']
    document.getElementById('cmpdecabecera_campo').value =  base_fun[0]['Campo']

  }
  if(fuente =='cmpelectronico'){  
    
    
    document.getElementById('cmpelectronico_certificado').value = base_fun[0][0]['Certificado']
    document.getElementById('cmpelectronico_clave').value = base_fun[0][0]['Clave']
    document.getElementById('cmpelectronico_acceso').value = base_fun[0][0]['ClaveAcceso']
    document.getElementById('cmpelectronico_emailform').value = base_fun[0][0]['Correo']
    document.getElementById('cmpelectronico_email_interno').value = base_fun[0][0]['correo_int']
    document.getElementById('cmpelectronico_Obligatorio').value = base_fun[0][0]['Obligatorio']
    document.getElementById('cmpelectronico_CondicionCmp').value = base_fun[0][0]['Cond_campo']
    document.getElementById('cmpelectronico_CondicionVal').value = base_fun[0][0]['Cond_valor']
    document.getElementById('cmpelectronico_Impresion').value = base_fun[0][0]['Impresion']

    if(base_fun[1][0]['ambiente'] == '1'){document.getElementById('cmpelectronico_ambiente').value= '1 Pruebas'}
    if(base_fun[1][0]['ambiente'] == '2'){document.getElementById('cmpelectronico_ambiente').value= '2 Produccion'}
    
    document.getElementById('cmpelectronico_tipoEmision').value = '1 Emision Normal'
    
    document.getElementById('cmpelectronico_razonSocial').value = base_fun[1][0]['razonSocial']
    document.getElementById('cmpelectronico_nombreComercial').value = base_fun[1][0]['nombreComercial']
    document.getElementById('cmpelectronico_ruc').value = base_fun[1][0]['ruc']
    document.getElementById('cmpelectronico_codDoc').value = base_fun[1][0]['codDoc']
    
    if(base_fun[1][0]['codDoc'] == '01'){document.getElementById('cmpelectronico_codDoc').value= '01 Factura'}
    if(base_fun[1][0]['codDoc'] == '04'){document.getElementById('cmpelectronico_codDoc').value= '04 Nota Credito'}
    if(base_fun[1][0]['codDoc'] == '05'){document.getElementById('cmpelectronico_codDoc').value= '05 Nota Debito'}
    if(base_fun[1][0]['codDoc'] == '06'){document.getElementById('cmpelectronico_codDoc').value= '06 Guia'}
    if(base_fun[1][0]['codDoc'] == '07'){document.getElementById('cmpelectronico_codDoc').value= '07 Retencion'}


    document.getElementById('cmpelectronico_estab').value = base_fun[1][0]['estab']
    document.getElementById('cmpelectronico_ptoEmi').value = base_fun[1][0]['ptoEmi']
    document.getElementById('cmpelectronico_secuencial').value = base_fun[1][0]['secuencial']
    document.getElementById('cmpelectronico_dirMatriz').value = base_fun[1][0]['dirMatriz']
    document.getElementById('cmpelectronico_fecha').value = base_fun[1][0]['fecha']
    document.getElementById('cmpelectronico_regimenMicroempresas').value = base_fun[1][0]['regimenMicroempresas']
    document.getElementById('cmpelectronico_agenteRetencion').value = base_fun[1][0]['agenteRetencion']


    if(base_fun[0][0]['Tipo'] == 'Factura'){
      document.getElementById('mm_cmpelectFactura').click()
      document.getElementById('cmpelectronico_f_f_fechaEmision').value = base_fun[3][0]['fechaEmision']
      document.getElementById('cmpelectronico_f_f_dirEstablecimiento').value = base_fun[3][0]['dirEstablecimiento']
      document.getElementById('cmpelectronico_f_f_contribuyenteEspecial').value = base_fun[3][0]['contribuyenteEspecial']
      document.getElementById('cmpelectronico_f_f_obligadoContabilidad').value = base_fun[3][0]['obligadoContabilidad']
      document.getElementById('cmpelectronico_f_f_tipoIdentificacionComprador').value = base_fun[3][0]['tipoIdentificacionComprador']
      document.getElementById('cmpelectronico_f_f_razonSocialComprador').value = base_fun[3][0]['razonSocialComprador']
      document.getElementById('cmpelectronico_f_f_identificacionComprador').value = base_fun[3][0]['identificacionComprador']
      document.getElementById('cmpelectronico_f_f_totalSinImpuestos').value = base_fun[3][0]['totalSinImpuestos']
      document.getElementById('cmpelectronico_f_f_totalDescuento').value = base_fun[3][0]['totalDescuento']
      document.getElementById('cmpelectronico_f_f_propina').value = base_fun[3][0]['propina']
      document.getElementById('cmpelectronico_f_f_importeTotal').value = base_fun[3][0]['importeTotal']
      document.getElementById('cmpelectronico_f_f_moneda').value = base_fun[3][0]['moneda']

      if(base_fun[3][0]['codigo1'] == '2'){document.getElementById('cmpelectronico_f_f_codigo1').value = '2 IVA'}
      if(base_fun[3][0]['codigo1'] == '3'){document.getElementById('cmpelectronico_f_f_codigo1').value = '3 IECE'}
      if(base_fun[3][0]['codigo1'] == '9'){document.getElementById('cmpelectronico_f_f_codigo1').value = '9 Sin Uso'}
 
      if(base_fun[3][0]['codigoPorcentaje1'] == '0'){document.getElementById('cmpelectronico_f_f_codigoPorcentaje1').value = '0-0%'}
      if(base_fun[3][0]['codigoPorcentaje1'] == '2'){document.getElementById('cmpelectronico_f_f_codigoPorcentaje1').value = '2-12%'}
      if(base_fun[3][0]['codigoPorcentaje1'] == '3'){document.getElementById('cmpelectronico_f_f_codigoPorcentaje1').value = '3-14%'}
      if(base_fun[3][0]['codigoPorcentaje1'] == '6'){document.getElementById('cmpelectronico_f_f_codigoPorcentaje1').value = '6-No objeto iva'}
      if(base_fun[3][0]['codigoPorcentaje1'] == '7'){document.getElementById('cmpelectronico_f_f_codigoPorcentaje1').value = '7-Exento de iva'}

      document.getElementById('cmpelectronico_f_f_baseImponible1').value = base_fun[3][0]['baseImponible1']
      document.getElementById('cmpelectronico_f_f_descuento_adicional1').value = base_fun[3][0]['descuento_adicional1']
      document.getElementById('cmpelectronico_f_f_valor1').value = base_fun[3][0]['valor1']


      if(base_fun[3][0]['codigo2'] == '2'){document.getElementById('cmpelectronico_f_f_codigo2').value = '2 IVA'}
      if(base_fun[3][0]['codigo2'] == '3'){document.getElementById('cmpelectronico_f_f_codigo2').value = '3 IECE'}
      if(base_fun[3][0]['codigo2'] == '9'){document.getElementById('cmpelectronico_f_f_codigo2').value = '9 Sin Uso'}
 
      if(base_fun[3][0]['codigoPorcentaje2'] == '0'){document.getElementById('cmpelectronico_f_f_codigoPorcentaje2').value = '0-0%'}
      if(base_fun[3][0]['codigoPorcentaje2'] == '2'){document.getElementById('cmpelectronico_f_f_codigoPorcentaje2').value = '2-12%'}
      if(base_fun[3][0]['codigoPorcentaje2'] == '3'){document.getElementById('cmpelectronico_f_f_codigoPorcentaje2').value = '3-14%'}
      if(base_fun[3][0]['codigoPorcentaje2'] == '6'){document.getElementById('cmpelectronico_f_f_codigoPorcentaje2').value = '6-No objeto iva'}
      if(base_fun[3][0]['codigoPorcentaje2'] == '7'){document.getElementById('cmpelectronico_f_f_codigoPorcentaje2').value = '7-Exento de iva'}


      document.getElementById('cmpelectronico_f_f_baseImponible2').value = base_fun[3][0]['baseImponible2']
      document.getElementById('cmpelectronico_f_f_valor2').value = base_fun[3][0]['valor2']
      document.getElementById('cmpelectronico_f_f_descuento_adicional2').value = base_fun[3][0]['descuento_adicional2']


      if(base_fun[3][0]['codigo3'] == '2'){document.getElementById('cmpelectronico_f_f_codigo3').value = '2 IVA'}
      if(base_fun[3][0]['codigo3'] == '3'){document.getElementById('cmpelectronico_f_f_codigo3').value = '3 IECE'}
      if(base_fun[3][0]['codigo3'] == '9'){document.getElementById('cmpelectronico_f_f_codigo3').value = '9 Sin Uso'}
 
      if(base_fun[3][0]['codigoPorcentaje3'] == '0'){document.getElementById('cmpelectronico_f_f_codigoPorcentaje3').value = '0-0%'}
      if(base_fun[3][0]['codigoPorcentaje3'] == '2'){document.getElementById('cmpelectronico_f_f_codigoPorcentaje3').value = '2-12%'}
      if(base_fun[3][0]['codigoPorcentaje3'] == '3'){document.getElementById('cmpelectronico_f_f_codigoPorcentaje3').value = '3-14%'}
      if(base_fun[3][0]['codigoPorcentaje3'] == '6'){document.getElementById('cmpelectronico_f_f_codigoPorcentaje3').value = '6-No objeto iva'}
      if(base_fun[3][0]['codigoPorcentaje3'] == '7'){document.getElementById('cmpelectronico_f_f_codigoPorcentaje3').value = '7-Exento de iva'}


      document.getElementById('cmpelectronico_f_f_baseImponible3').value = base_fun[3][0]['baseImponible3']
      document.getElementById('cmpelectronico_f_f_valor3').value = base_fun[3][0]['valor3']
      document.getElementById('cmpelectronico_f_f_descuento_adicional3').value = base_fun[3][0]['descuento_adicional3']
      document.getElementById('cmpelectronico_f_f_unidadTiempo').value = base_fun[3][0]['unidadTiempo']
      document.getElementById('cmpelectronico_f_f_formaPago').value = base_fun[3][0]['formaPago']
      document.getElementById('cmpelectronico_f_f_total').value = base_fun[3][0]['total']
      document.getElementById('cmpelectronico_f_f_plazo').value = base_fun[3][0]['plazo']

      // document.getElementById('cmpelectronico_f_f_comercioExterior').value = base_fun[3][0]['comercioExterior']
      // document.getElementById('cmpelectronico_f_f_incoTermFactura').value = base_fun[3][0]['incoTermFactura']
      // document.getElementById('cmpelectronico_f_f_lugarIncoTerm').value = base_fun[3][0]['lugarIncoTerm']
      // document.getElementById('cmpelectronico_f_f_paisOrigen').value = base_fun[3][0]['paisOrigen']
      // document.getElementById('cmpelectronico_f_f_puertoEmbarque').value = base_fun[3][0]['puertoEmbarque']
      // document.getElementById('cmpelectronico_f_f_puertoDestino').value = base_fun[3][0]['puertoDestino']
      // document.getElementById('cmpelectronico_f_f_paisDestino').value = base_fun[3][0]['paisDestino']
      // document.getElementById('cmpelectronico_f_f_paisAdquisicion').value = base_fun[3][0]['paisAdquisicion']
      // document.getElementById('cmpelectronico_f_f_guiaRemision').value = base_fun[3][0]['guiaRemision']
      // document.getElementById('cmpelectronico_f_f_direccionComprador').value = base_fun[3][0]['direccionComprador']
      // document.getElementById('cmpelectronico_f_f_incoTermTotalSinImpuestos').value = base_fun[3][0]['incoTermTotalSinImpuestos']
      // document.getElementById('cmpelectronico_f_f_fleteInternacional').value = base_fun[3][0]['fleteInternacional']
      // document.getElementById('cmpelectronico_f_f_seguroInternacional').value = base_fun[3][0]['seguroInternacional']
      // document.getElementById('cmpelectronico_f_f_gastosAduaneros').value = base_fun[3][0]['gastosAduaneros']
      // document.getElementById('cmpelectronico_f_f_gastosTransporteOtros').value = base_fun[3][0]['gastosTransporteOtros']
      
      

      document.getElementById('cmpelectronico_f_d_codigoPrincipal').value = base_fun[4][0]['codigoPrincipal']
      document.getElementById('cmpelectronico_f_d_descripcion').value = base_fun[4][0]['descripcion']
      document.getElementById('cmpelectronico_f_d_cantidad').value = base_fun[4][0]['cantidad']
      document.getElementById('cmpelectronico_f_d_precioUnitario').value = base_fun[4][0]['precioUnitario']
      document.getElementById('cmpelectronico_f_d_descuento').value = base_fun[4][0]['descuento']
      document.getElementById('cmpelectronico_f_d_precioTotalSinImpuesto').value = base_fun[4][0]['precioTotalSinImpuesto']
      document.getElementById('cmpelectronico_f_d_codigo').value = base_fun[4][0]['codigo']
      document.getElementById('cmpelectronico_f_d_codigoPorcentaje').value = base_fun[4][0]['codigoPorcentaje']
      document.getElementById('cmpelectronico_f_d_tarifa').value = base_fun[4][0]['tarifa']
      document.getElementById('cmpelectronico_f_d_baseImponible').value = base_fun[4][0]['baseImponible']
      document.getElementById('cmpelectronico_f_d_valor').value = base_fun[4][0]['valor']
      document.getElementById('cmpelectronico_f_d_codigoAuxiliar').value = base_fun[4][0]['codigoAuxiliar']
      document.getElementById('cmpelectronico_f_d_unidadMedida').value = base_fun[4][0]['unidadMedida']
      
      
      
    }

    if(base_fun[0][0]['Tipo'] == 'Retencion'){

      document.getElementById('mm_cmpelectRetencion').click()
      document.getElementById('cmpelectronico_r_f_fechaEmision').value = base_fun[4][0]['fechaEmision']
      document.getElementById('cmpelectronico_r_f_dirEstablecimiento').value = base_fun[4][0]['dirEstablecimiento']
      document.getElementById('cmpelectronico_r_f_contribuyenteEspecial').value = base_fun[4][0]['contribuyenteEspecial']
      document.getElementById('cmpelectronico_r_f_obligadoContabilidad').value = base_fun[4][0]['obligadoContabilidad']
      document.getElementById('cmpelectronico_r_f_tipoIdentificacionSujetoRetenido').value = base_fun[4][0]['tipoIdentificacionSujetoRetenido']
      document.getElementById('cmpelectronico_r_f_razonSocialSujetoRetenido').value = base_fun[4][0]['razonSocialSujetoRetenido']
      document.getElementById('cmpelectronico_r_f_identificacionSujetoRetenido').value = base_fun[4][0]['identificacionSujetoRetenido']
      document.getElementById('cmpelectronico_r_f_periodoFiscal').value = base_fun[4][0]['periodoFiscal']

      
      document.getElementById('cmpelectronico_r_d_codDocSustento').value = base_fun[3][0]['codDocSustento']
      document.getElementById('cmpelectronico_r_d_fechaEmisionDocSustento').value = base_fun[3][0]['fechaEmisionDocSustento']
      document.getElementById('cmpelectronico_r_d_numDocSustento_est').value = base_fun[3][0]['numDocSustento_est']
      document.getElementById('cmpelectronico_r_d_numDocSustento_punto').value = base_fun[3][0]['numDocSustento_punto']
      document.getElementById('cmpelectronico_r_d_numDocSustento_sec').value = base_fun[3][0]['numDocSustento_sec']

      
      if(base_fun[3][0]['det_codigo'] == '1'){document.getElementById('cmpelectronico_r_d_det_codigo').value = '1-Renta'}
      if(base_fun[3][0]['det_codigo'] == '2'){document.getElementById('cmpelectronico_r_d_det_codigo').value = '2-Iva'}
      

      document.getElementById('cmpelectronico_r_d_det_codigoRetencion').value = base_fun[3][0]['det_codigoRetencion']
      document.getElementById('cmpelectronico_r_d_det_baseImponible').value = base_fun[3][0]['det_baseImponible']
      document.getElementById('cmpelectronico_r_d_det_porcentajeRetener').value = base_fun[3][0]['det_porcentajeRetener']
      document.getElementById('cmpelectronico_r_d_det_valorRetenido').value = base_fun[3][0]['det_valorRetenido']


      if(base_fun[3][0]['det_codigo2'] == '1'){document.getElementById('cmpelectronico_r_d_det_codigo2').value = '1-Renta'}
      if(base_fun[3][0]['det_codigo2'] == '2'){document.getElementById('cmpelectronico_r_d_det_codigo2').value = '2-Iva'}

      document.getElementById('cmpelectronico_r_d_det_valorRetenido2').value = base_fun[3][0]['det_valorRetenido2']
      document.getElementById('cmpelectronico_r_d_det_codigoRetencion2').value = base_fun[3][0]['det_codigoRetencion2']
      document.getElementById('cmpelectronico_r_d_det_baseImponible2').value = base_fun[3][0]['det_baseImponible2']
      document.getElementById('cmpelectronico_r_d_det_porcentajeRetener2').value = base_fun[3][0]['det_porcentajeRetener2']
    }

    if(base_fun[0][0]['Tipo'] == 'Nota credito'){
      document.getElementById('mm_cmpelectCredito').click()

      document.getElementById('cmpelectronico_c_f_fechaEmision').value = base_fun[4][0]['fechaEmision']
      document.getElementById('cmpelectronico_c_f_dirEstablecimiento').value = base_fun[4][0]['dirEstablecimiento']
      document.getElementById('cmpelectronico_c_f_tipoIdentificacionComprador').value = base_fun[4][0]['tipoIdentificacionComprador']
      document.getElementById('cmpelectronico_c_f_razonSocialComprador').value = base_fun[4][0]['razonSocialComprador']
      document.getElementById('cmpelectronico_c_f_identificacionComprador').value = base_fun[4][0]['identificacionComprador']
      document.getElementById('cmpelectronico_c_f_obligadoContabilidad').value = base_fun[4][0]['obligadoContabilidad']
      document.getElementById('cmpelectronico_c_f_codDocModificado').value = base_fun[4][0]['codDocModificado']
      document.getElementById('cmpelectronico_c_f_numDocModificado_est').value = base_fun[4][0]['numDocModificado_est']
      document.getElementById('cmpelectronico_c_f_numDocModificado_punto').value = base_fun[4][0]['numDocModificado_punto']
      document.getElementById('cmpelectronico_c_f_numDocModificado_sec').value = base_fun[4][0]['numDocModificado_sec']
      document.getElementById('cmpelectronico_c_f_fechaEmisionDocSustento').value = base_fun[4][0]['fechaEmisionDocSustento']
      document.getElementById('cmpelectronico_c_f_totalSinImpuestos').value = base_fun[4][0]['totalSinImpuestos']
      document.getElementById('cmpelectronico_c_f_valorModificacion').value = base_fun[4][0]['valorModificacion']
      document.getElementById('cmpelectronico_c_f_moneda').value = base_fun[4][0]['moneda']
      document.getElementById('cmpelectronico_c_f_motivo').value = base_fun[4][0]['motivo']

      if(base_fun[4][0]['codigo1'] == '2'){document.getElementById('cmpelectronico_c_f_codigo1').value = '2 IVA'}
      if(base_fun[4][0]['codigo1'] == '3'){document.getElementById('cmpelectronico_c_f_codigo1').value = '3 IECE'}
      if(base_fun[4][0]['codigo1'] == '9'){document.getElementById('cmpelectronico_c_f_codigo1').value = '9 Sin Uso'}

      if(base_fun[4][0]['codigoPorcentaje1'] == '0'){document.getElementById('cmpelectronico_c_f_codigoPorcentaje1').value = '0-0%'}      
      if(base_fun[4][0]['codigoPorcentaje1'] == '2'){document.getElementById('cmpelectronico_c_f_codigoPorcentaje1').value = '2-12%'}
      if(base_fun[4][0]['codigoPorcentaje1'] == '3'){document.getElementById('cmpelectronico_c_f_codigoPorcentaje1').value = '3-14%'}
      if(base_fun[4][0]['codigoPorcentaje1'] == '6'){document.getElementById('cmpelectronico_c_f_codigoPorcentaje1').value = '6-No objeto iva'}
      if(base_fun[4][0]['codigoPorcentaje1'] == '7'){document.getElementById('cmpelectronico_c_f_codigoPorcentaje1').value = '7-Exento de iva'}



      document.getElementById('cmpelectronico_c_f_baseImponible1').value = base_fun[4][0]['baseImponible1']
      document.getElementById('cmpelectronico_c_f_valor1').value = base_fun[4][0]['valor1']



      if(base_fun[4][0]['codigo2'] == '2'){document.getElementById('cmpelectronico_c_f_codigo2').value = '2 IVA'}
      if(base_fun[4][0]['codigo2'] == '3'){document.getElementById('cmpelectronico_c_f_codigo2').value = '3 IECE'}
      if(base_fun[4][0]['codigo2'] == '9'){document.getElementById('cmpelectronico_c_f_codigo2').value = '9 Sin Uso'}

      if(base_fun[4][0]['codigoPorcentaje2'] == '0'){document.getElementById('cmpelectronico_c_f_codigoPorcentaje2').value = '0-0%'}      
      if(base_fun[4][0]['codigoPorcentaje2'] == '2'){document.getElementById('cmpelectronico_c_f_codigoPorcentaje2').value = '2-12%'}
      if(base_fun[4][0]['codigoPorcentaje2'] == '3'){document.getElementById('cmpelectronico_c_f_codigoPorcentaje2').value = '3-14%'}
      if(base_fun[4][0]['codigoPorcentaje2'] == '6'){document.getElementById('cmpelectronico_c_f_codigoPorcentaje2').value = '6-No objeto iva'}
      if(base_fun[4][0]['codigoPorcentaje2'] == '7'){document.getElementById('cmpelectronico_c_f_codigoPorcentaje2').value = '7-Exento de iva'}




      document.getElementById('cmpelectronico_c_f_baseImponible2').value = base_fun[4][0]['baseImponible2']
      document.getElementById('cmpelectronico_c_f_valor2').value = base_fun[4][0]['valor2']

      if(base_fun[4][0]['codigo3'] == '2'){document.getElementById('cmpelectronico_c_f_codigo3').value = '2 IVA'}
      if(base_fun[4][0]['codigo3'] == '3'){document.getElementById('cmpelectronico_c_f_codigo3').value = '3 IECE'}
      if(base_fun[4][0]['codigo3'] == '9'){document.getElementById('cmpelectronico_c_f_codigo3').value = '9 Sin Uso'}

      if(base_fun[4][0]['codigoPorcentaje3'] == '0'){document.getElementById('cmpelectronico_c_f_codigoPorcentaje3').value = '0-0%'}      
      if(base_fun[4][0]['codigoPorcentaje3'] == '2'){document.getElementById('cmpelectronico_c_f_codigoPorcentaje3').value = '2-12%'}
      if(base_fun[4][0]['codigoPorcentaje3'] == '3'){document.getElementById('cmpelectronico_c_f_codigoPorcentaje3').value = '3-14%'}
      if(base_fun[4][0]['codigoPorcentaje3'] == '6'){document.getElementById('cmpelectronico_c_f_codigoPorcentaje3').value = '6-No objeto iva'}
      if(base_fun[4][0]['codigoPorcentaje3'] == '7'){document.getElementById('cmpelectronico_c_f_codigoPorcentaje3').value = '7-Exento de iva'}

      document.getElementById('cmpelectronico_c_f_baseImponible3').value = base_fun[4][0]['baseImponible3']
      document.getElementById('cmpelectronico_c_f_valor3').value = base_fun[4][0]['valor3']
      
      
      document.getElementById('cmpelectronico_c_d_codigoInterno').value = base_fun[3][0]['codigoInterno']
      document.getElementById('cmpelectronico_c_d_codigoAdicional').value = base_fun[3][0]['codigoAdicional']
      document.getElementById('cmpelectronico_c_d_descripcion').value = base_fun[3][0]['descripcion']
      document.getElementById('cmpelectronico_c_d_cantidad').value = base_fun[3][0]['cantidad']
      document.getElementById('cmpelectronico_c_d_precioUnitario').value = base_fun[3][0]['precioUnitario']
      document.getElementById('cmpelectronico_c_d_descuento').value = base_fun[3][0]['descuento']
      document.getElementById('cmpelectronico_c_d_precioTotalSinImpuesto').value = base_fun[3][0]['precioTotalSinImpuesto']
      document.getElementById('cmpelectronico_c_d_codigo').value = base_fun[3][0]['codigo']
      document.getElementById('cmpelectronico_c_d_codigoPorcentaje').value = base_fun[3][0]['codigoPorcentaje']
      document.getElementById('cmpelectronico_c_d_tarifa').value = base_fun[3][0]['tarifa']
      document.getElementById('cmpelectronico_c_d_baseImponible').value = base_fun[3][0]['baseImponible']
      document.getElementById('cmpelectronico_c_d_valor').value = base_fun[3][0]['valor']
      
    }

    if(base_fun[0][0]['Tipo'] == 'Guia remision'){
      document.getElementById('mm_cmpelectGuia').click()

      
      document.getElementById('cmpelectronico_g_f_dirEstablecimiento').value = base_fun[3][0]['dirEstablecimiento']
      document.getElementById('cmpelectronico_g_f_dirPartida').value = base_fun[3][0]['dirPartida']
      document.getElementById('cmpelectronico_g_f_razonSocialTransportista').value = base_fun[3][0]['razonSocialTransportista']
      document.getElementById('cmpelectronico_g_f_tipoIdentificacionTransportista').value = base_fun[3][0]['tipoIdentificacionTransportista']
      document.getElementById('cmpelectronico_g_f_rucTransportista').value = base_fun[3][0]['rucTransportista']
      document.getElementById('cmpelectronico_g_f_obligadoContabilidad').value = base_fun[3][0]['obligadoContabilidad']
      document.getElementById('cmpelectronico_g_f_fechaIniTransporte').value = base_fun[3][0]['fechaIniTransporte']
      document.getElementById('cmpelectronico_g_f_fechaFinTransporte').value = base_fun[3][0]['fechaFinTransporte']
      document.getElementById('cmpelectronico_g_f_placa').value = base_fun[3][0]['placa']
        

      document.getElementById('cmpelectronico_g_c_identificacionDestinatario').value = base_fun[4][0]['identificacionDestinatario']
      document.getElementById('cmpelectronico_g_c_razonSocialDestinatario').value = base_fun[4][0]['razonSocialDestinatario']
      document.getElementById('cmpelectronico_g_c_dirDestinatario').value = base_fun[4][0]['dirDestinatario']
      document.getElementById('cmpelectronico_g_c_motivoTraslado').value = base_fun[4][0]['motivoTraslado']
      document.getElementById('cmpelectronico_g_c_docAduaneroUnico').value = base_fun[4][0]['docAduaneroUnico']
      document.getElementById('cmpelectronico_g_c_codEstabDestino').value = base_fun[4][0]['codEstabDestino']
      document.getElementById('cmpelectronico_g_c_ruta').value = base_fun[4][0]['ruta']
      document.getElementById('cmpelectronico_g_c_codDocSustento').value = base_fun[4][0]['codDocSustento']
      document.getElementById('cmpelectronico_g_c_numDocSustento_punto').value = base_fun[4][0]['numDocSustento_punto']
      document.getElementById('cmpelectronico_g_c_numAutDocSustento').value = base_fun[4][0]['numAutDocSustento']
      document.getElementById('cmpelectronico_g_c_fechaEmisionDocSustento').value = base_fun[4][0]['fechaEmisionDocSustento']
      document.getElementById('cmpelectronico_g_c_codigoInterno').value = base_fun[4][0]['codigoInterno']
      document.getElementById('cmpelectronico_g_c_codigoAdicional').value = base_fun[4][0]['codigoAdicional']
      document.getElementById('cmpelectronico_g_c_descripcion').value = base_fun[4][0]['descripcion']
      document.getElementById('cmpelectronico_g_c_cantidad').value = base_fun[4][0]['cantidad']
      document.getElementById('cmpelectronico_g_c_numDocSustento_est').value = base_fun[4][0]['numDocSustento_est']
      document.getElementById('cmpelectronico_g_c_numDocSustento_sec').value = base_fun[4][0]['numDocSustento_sec']
      
    }

    if(base_fun[0][0]['Tipo'] == 'Nota debito'){
      document.getElementById('mm_cmpelectDebito').click()

      document.getElementById('cmpelectronico_d_f_fechaEmision').value = base_fun[3][0]['fechaEmision']
      document.getElementById('cmpelectronico_d_f_dirEstablecimiento').value = base_fun[3][0]['dirEstablecimiento']
      document.getElementById('cmpelectronico_d_f_tipoIdentificacionComprador').value = base_fun[3][0]['tipoIdentificacionComprador']
      document.getElementById('cmpelectronico_d_f_razonSocialComprador').value = base_fun[3][0]['razonSocialComprador']
      document.getElementById('cmpelectronico_d_f_identificacionComprador').value = base_fun[3][0]['identificacionComprador']
      document.getElementById('cmpelectronico_d_f_obligadoContabilidad').value = base_fun[3][0]['obligadoContabilidad']
      document.getElementById('cmpelectronico_d_f_codDocModificado').value = base_fun[3][0]['codDocModificado']
      document.getElementById('cmpelectronico_d_f_numDocModificado_est').value = base_fun[3][0]['numDocModificado_est']
      document.getElementById('cmpelectronico_d_f_numDocModificado_punt').value = base_fun[3][0]['numDocModificado_punt']
      document.getElementById('cmpelectronico_d_f_numDocModificado_sec').value = base_fun[3][0]['numDocModificado_sec']
      document.getElementById('cmpelectronico_d_f_fechaEmisionDocSustento').value = base_fun[3][0]['fechaEmisionDocSustento']
      document.getElementById('cmpelectronico_d_f_totalSinImpuestos').value = base_fun[3][0]['totalSinImpuestos']
      document.getElementById('cmpelectronico_d_f_valorTotal').value = base_fun[3][0]['valorTotal']


      if(base_fun[3][0]['codigo1'] == '2'){document.getElementById('cmpelectronico_d_f_codigo1').value = '2 IVA'}
      if(base_fun[3][0]['codigo1'] == '3'){document.getElementById('cmpelectronico_d_f_codigo1').value = '3 IECE'}
      if(base_fun[3][0]['codigo3'] == '9'){document.getElementById('cmpelectronico_d_f_codigo1').value = '9 Sin Uso'}
      
      if(base_fun[3][0]['codigoPorcentaje1'] == '0'){document.getElementById('cmpelectronico_d_f_codigoPorcentaje1').value = '0-0%'}      
      if(base_fun[3][0]['codigoPorcentaje1'] == '2'){document.getElementById('cmpelectronico_d_f_codigoPorcentaje1').value = '2-12%'}
      if(base_fun[3][0]['codigoPorcentaje1'] == '3'){document.getElementById('cmpelectronico_d_f_codigoPorcentaje1').value = '3-14%'}
      if(base_fun[3][0]['codigoPorcentaje1'] == '6'){document.getElementById('cmpelectronico_d_f_codigoPorcentaje1').value = '6-No objeto iva'}
      if(base_fun[3][0]['codigoPorcentaje1'] == '7'){document.getElementById('cmpelectronico_d_f_codigoPorcentaje1').value = '7-Exento de iva'}


      document.getElementById('cmpelectronico_d_f_tarifa1').value = base_fun[3][0]['tarifa1']
      document.getElementById('cmpelectronico_d_f_baseImponible1').value = base_fun[3][0]['baseImponible1']
      document.getElementById('cmpelectronico_d_f_valor1').value = base_fun[3][0]['valor1']


      
      if(base_fun[3][0]['codigo2'] == '2'){document.getElementById('cmpelectronico_d_f_codigo2').value = '2 IVA'}
      if(base_fun[3][0]['codigo2'] == '3'){document.getElementById('cmpelectronico_d_f_codigo2').value = '3 IECE'}
      if(base_fun[3][0]['codigo2'] == '9'){document.getElementById('cmpelectronico_d_f_codigo2').value = '9 Sin Uso'}
      
      if(base_fun[3][0]['codigoPorcentaje2'] == '0'){document.getElementById('cmpelectronico_d_f_codigoPorcentaje2').value = '0-0%'}      
      if(base_fun[3][0]['codigoPorcentaje2'] == '2'){document.getElementById('cmpelectronico_d_f_codigoPorcentaje2').value = '2-12%'}
      if(base_fun[3][0]['codigoPorcentaje2'] == '3'){document.getElementById('cmpelectronico_d_f_codigoPorcentaje2').value = '3-14%'}
      if(base_fun[3][0]['codigoPorcentaje2'] == '6'){document.getElementById('cmpelectronico_d_f_codigoPorcentaje2').value = '6-No objeto iva'}
      if(base_fun[3][0]['codigoPorcentaje2'] == '7'){document.getElementById('cmpelectronico_d_f_codigoPorcentaje2').value = '7-Exento de iva'}


      document.getElementById('cmpelectronico_d_f_tarifa2').value = base_fun[3][0]['tarifa2']
      document.getElementById('cmpelectronico_d_f_baseImponible2').value = base_fun[3][0]['baseImponible2']
      document.getElementById('cmpelectronico_d_f_valor2').value = base_fun[3][0]['valor2']
      document.getElementById('cmpelectronico_d_f_unidadTiempo').value = base_fun[3][0]['unidadTiempo']
      document.getElementById('cmpelectronico_d_f_formaPago').value = base_fun[3][0]['formaPago']
      document.getElementById('cmpelectronico_d_f_total').value = base_fun[3][0]['total']
      document.getElementById('cmpelectronico_d_f_plazo').value = base_fun[3][0]['plazo']
      

      document.getElementById('cmpelectronico_d_c_razon').value = base_fun[4][0]['razon']
      document.getElementById('cmpelectronico_d_c_valor').value = base_fun[4][0]['valor']

    }

    cmp_elec_adicionales = document.getElementById('cmpelec_adicional_row')
    for (var i = 0; i < base_fun[2].length; i++) {
      cmpelectrico_adicional_add_fila(temp_pestalla)
      cmp_elec_adicionales.children[0].children[0].children[i+1].children[1].children[0].value = base_fun[2][i]['nombre']
      cmp_elec_adicionales.children[0].children[0].children[i+1].children[2].children[0].value = base_fun[2][i]['valor']
    }


  }

  if(fuente =='cmpcondicional'){  

    
    formulavalores = document.getElementById('cmpcondicional_row')
    for (var i = 0; i < base_fun[1].length; i++) {
      cmpcondicional_add_fila(temp_pestalla)

      formulavalores.children[0].children[0].children[i+1].children[1].children[0].value = base_fun[1][i]['ElementoA']

      formulavalores.children[0].children[0].children[i+1].children[2].children[0].value = base_fun[1][i]['Operador']
      if( base_fun[1][i]['Operador'] == 'igual'){formulavalores.children[0].children[0].children[i+1].children[2].children[0].value = 'Igual Texto'}
      if( base_fun[1][i]['Operador'] == '='){formulavalores.children[0].children[0].children[i+1].children[2].children[0].value = 'Igual Numero'}
      if( base_fun[1][i]['Operador'] == '!='){formulavalores.children[0].children[0].children[i+1].children[2].children[0].value = 'Distinto'}
      if( base_fun[1][i]['Operador'] == '>'){formulavalores.children[0].children[0].children[i+1].children[2].children[0].value = 'Mayor'}
      if( base_fun[1][i]['Operador'] == '<'){formulavalores.children[0].children[0].children[i+1].children[2].children[0].value = 'Menor'}
      if( base_fun[1][i]['Operador'] == '>='){formulavalores.children[0].children[0].children[i+1].children[2].children[0].value = 'Mayor Igual'}
      if( base_fun[1][i]['Operador'] == '<='){formulavalores.children[0].children[0].children[i+1].children[2].children[0].value = 'Menor igual'}


      formulavalores.children[0].children[0].children[i+1].children[3].children[0].value = base_fun[1][i]['TipoB']

      formulavalores.children[0].children[0].children[i+1].children[4].children[0].style.display = 'none'
      formulavalores.children[0].children[0].children[i+1].children[4].children[1].style.display = 'none'

      if(base_fun[1][i]['TipoB'] == 'Campo'){
        formulavalores.children[0].children[0].children[i+1].children[4].children[0].value = base_fun[1][i]['ElementoB']        
        formulavalores.children[0].children[0].children[i+1].children[4].children[0].style.display = ''

      }

      if(base_fun[1][i]['TipoB'] == 'Valor'){
        
      formulavalores.children[0].children[0].children[i+1].children[4].children[1].style.display = ''

        formulavalores.children[0].children[0].children[i+1].children[4].children[1].value = base_fun[1][i]['ElementoB']
      }

      formulavalores.children[0].children[0].children[i+1].children[5].children[0].value = base_fun[1][i]['TipoC']

      formulavalores.children[0].children[0].children[i+1].children[6].children[0].style.display = 'none'
      formulavalores.children[0].children[0].children[i+1].children[6].children[1].style.display = 'none'

      
      if(base_fun[1][i]['TipoC'] == 'Campo'){
        formulavalores.children[0].children[0].children[i+1].children[6].children[0].style.display = ''
        
        formulavalores.children[0].children[0].children[i+1].children[6].children[0].value = base_fun[1][i]['ElementoC']
      }

      if(base_fun[1][i]['TipoC'] == 'Valor'){
        formulavalores.children[0].children[0].children[i+1].children[6].children[1].style.display = ''

        formulavalores.children[0].children[0].children[i+1].children[6].children[1].value = base_fun[1][i]['ElementoC']
      }
    }
  }




}

function armar_t_dataCampostr(fuente, t_pkestructura, tem_pestalla ){
  t_dataCampostr['Nombre'] = document.getElementById('modal_campos_nombre').value
  t_dataCampostr['Descripcion'] = document.getElementById('modal_campos_display').value
  t_dataCampostr['PkEstructura'] = t_pkestructura

  if(fuente =='cmptxtsimple'){ 
    t_dataCampostr['ValorPredeterminado'] = document.getElementById('cmptexto_Predeterminado').value
    t_dataCampostr['Largo'] = document.getElementById('cmptexto_Largo').value
      if(document.getElementById('cmptexto_Unico').value == 'Si'){
        t_dataCampostr['Unico'] = 'Y'
      }else{
        t_dataCampostr['Unico'] = 'N' 
      }
      if(document.getElementById('cmptexto_Modificable').value == 'Si'){
        t_dataCampostr['Modificable'] = 'Y'
      }else{
        t_dataCampostr['Modificable'] = 'N'
      }   
      if(document.getElementById('cmptexto_tipo').value == 'Normal'){
        t_dataCampostr['Cedula'] = 'N'
      }else{
        t_dataCampostr['Cedula'] = 'Y'
      }   
      t_dataCampostr['largo_txtbox'] = 100
  
  }

  if(fuente =='cmpnumsimple'){ 
    t_dataCampostr['NumDecimales'] = document.getElementById('cmpnumsimple_Decimales').value
    t_dataCampostr['Menor'] = document.getElementById('cmpnumsimple_Menor').value
    t_dataCampostr['Mayor'] = document.getElementById('cmpnumsimple_Mayor').value
    t_dataCampostr['Unico'] = 'N'
    t_dataCampostr['Predeterminado'] = document.getElementById('cmpnumsimple_Valor').value
  }

  if(fuente =='cmpnumsecuencial'){ 
    t_dataCampostr['ValorInicial'] = document.getElementById('cmpnumsimple_Inicia').value
    t_dataCampostr['Aumento'] = document.getElementById('cmpnumsimple_Aumenta').value
  }

  if(fuente =='cmpopcmultiple'){  
    t_dataCampostr['valores'] = []
    opcvalores = document.getElementById('cmp_opcion')
    for (var i = 1; i < opcvalores.children[0].childElementCount; i++) {
      val_internos = {} 
      val_internos['Nombre'] = opcvalores.children[0].children[i].children[1].children[0].value
      val_internos['Valor'] = opcvalores.children[0].children[i].children[2].children[0].value
      val_internos['Color'] = opcvalores.children[0].children[i].children[3].children[0].value    
      t_dataCampostr['valores'].push(val_internos)
    }
  }

  if(fuente =='cmpsistema'){  
    if(document.getElementById('cmpsistema_valor').value == 'Usuario Actual'){
      t_dataCampostr['Tipo'] = 2
      t_dataCampostr['Nombre'] = 'Usuario Actual'
    }
    if(document.getElementById('cmpsistema_valor').value == 'Fecha Actual'){
      t_dataCampostr['Tipo'] = 1
      t_dataCampostr['Nombre'] = 'Fecha Actual'
    }
    if(document.getElementById('cmpsistema_valor').value == 'Lista usuarios'){
      t_dataCampostr['Tipo'] = 4
      t_dataCampostr['Nombre'] = 'Lista usuarios'
    }
  }
  if(fuente =='cmpformuladetalle'){  

    t_dataCampostr['Operacion'] = document.getElementById('cmpformuladetalle_operacion').value
    t_dataCampostr['Campo'] = dict_pestalla['p-'+tem_pestalla]['tabla_det']['Nombre'] + '.' + document.getElementById('cmpformuladetalle_campo').value
    t_dataCampostr['Condicion'] = document.getElementById('cmpformuladetalle_decimales').value
    //if zona = detalle hay subdetalle 
    t_dataCampostr['TablaCabecera'] = dict_pestalla['p-'+tem_pestalla]['tabla_cab']['PkEstructura']
    t_dataCampostr['TablaDetalle'] = dict_pestalla['p-'+tem_pestalla]['tabla_det']['PkEstructura']
    //if zona = detalle hay subdetalle 
    t_dataCampostr['Anulado'] = 'N'

    t_dataCampostr['condiciones'] = []
    formulavalores = document.getElementById('cmpformuladetalle_row')
    for (var i = 1; i < formulavalores.children[0].children[0].childElementCount; i++) {
      val_internos = {} 
      val_internos['TablaOrigen'] = dict_pestalla['p-'+tem_pestalla]['tabla_det']['Nombre']
      val_internos['Campo'] = formulavalores.children[0].children[0].children[i].children[1].children[0].value
      if(formulavalores.children[0].children[0].children[i].children[2].children[0].value == 'Igual Texto'){val_internos['Operador'] = 'igual'}
      if(formulavalores.children[0].children[0].children[i].children[2].children[0].value == 'Igual Numero'){val_internos['Operador'] = '='}
      if(formulavalores.children[0].children[0].children[i].children[2].children[0].value == 'Distinto'){val_internos['Operador'] = '!='}
      if(formulavalores.children[0].children[0].children[i].children[2].children[0].value == 'Mayor'){val_internos['Operador'] = '>'}
      if(formulavalores.children[0].children[0].children[i].children[2].children[0].value == 'Mayor Igual'){val_internos['Operador'] = '>='}
      if(formulavalores.children[0].children[0].children[i].children[2].children[0].value == 'Menor'){val_internos['Operador'] = '<'}
      if(formulavalores.children[0].children[0].children[i].children[2].children[0].value == 'Menor igual'){val_internos['Operador'] = '<='}

      val_internos['Tipo'] = formulavalores.children[0].children[0].children[i].children[3].children[0].value
      if(val_internos['Tipo'] == 'Campo'){val_internos['Valor'] = formulavalores.children[0].children[0].children[i].children[4].children[0].value}
      if(val_internos['Tipo'] == 'Valor'){val_internos['Valor'] = formulavalores.children[0].children[0].children[i].children[4].children[1].value}

      t_dataCampostr['condiciones'].push(val_internos)
    }

  


  }
  if(fuente =='cmpfecha'){  

    t_dataCampostr['ValorPredetermindo'] = '1987-09-22'
    t_dataCampostr['FechaActual'] = 'Y'
    t_dataCampostr['Tiempo'] = 'Y'
    //if(document.getElementById('cmpfecha_tiempo').value == 'Si'){t_dataCampostr['Tiempo'] = 'Y'}
    //if(document.getElementById('cmpfecha_tiempo').value == 'No'){t_dataCampostr['Tiempo'] = 'N'}
    t_dataCampostr['Tiempo'] = document.getElementById('cmpfecha_tiempo').value 

  }
  if(fuente =='cmpreferencia'){  // faltaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa


  }
  if(fuente =='cmpreferenciaadjunto'){  
    
    t_dataCampostr['PkCampoReferencia'] = document.getElementById('cmpreferenciaadjunto_campo').selectedOptions[0].value
    t_dataCampostr['CampoReferencia'] = document.getElementById('cmpreferenciaadjunto_campo').selectedOptions[0].text


    t_dataCampostr['Sentencia'] = document.getElementById('cmpreferenciaadjunto_sentencia').selectedOptions[0].value
    t_dataCampostr['Tipo'] = document.getElementById('cmpreferenciaadjunto_Tipo').selectedOptions[0].value
    t_dataCampostr['Tamano'] = document.getElementById('cmpreferenciaadjunto_Tamano').selectedOptions[0].value.substring(0,1)
    if(document.getElementById('cmpreferenciaadjunto_Modificable').selectedOptions[0].value == 'Si'){
      t_dataCampostr['Modificable'] = 'Y'
    }else{
      t_dataCampostr['Modificable'] = 'N'
    }

    if(document.getElementById('cmpreferenciaadjunto_Clave').selectedOptions[0].value == 'Si'){
      t_dataCampostr['TieneClave'] = 'Si'
      t_dataCampostr['Clave'] = document.getElementById('cmpreferenciaadjunto_ClaveVal').value
    }else{
      t_dataCampostr['TieneClave'] = 'No'
      t_dataCampostr['Clave'] = ''
    }
  
    if(t_dataCampostr['Tipo'] == 'Imagen'){
      t_dataCampostr['Imagen'] = 'Si'
    }else{
      t_dataCampostr['Imagen'] = 'No'
    }

  }
  if(fuente =='cmpoperacion'){  

    
    t_dataCampostr['Decimales'] = document.getElementById('cmpoperacion_decimales').value

    t_dataCampostr['detalle'] = []
    formulavalores = document.getElementById('cmpoperacion_row')
    for (var i = 1; i < formulavalores.children[0].children[0].childElementCount; i++) {
      val_internos = {} 

      val_internos['Estado'] = formulavalores.children[0].children[0].children[i].children[1].children[0].value.substring(0,1)
      
      if(val_internos['Estado'] == 'C'){
        val_internos['Sentencia'] = formulavalores.children[0].children[0].children[i].children[2].children[0].value
      }
      if(val_internos['Estado'] == 'V'){
        val_internos['Sentencia'] = formulavalores.children[0].children[0].children[i].children[2].children[1].value  
      }
      if(val_internos['Estado'] == 'O'){
        val_internos['Sentencia'] = formulavalores.children[0].children[0].children[i].children[2].children[2].value
      }
      t_dataCampostr['detalle'].push(val_internos)
    }
  }
  if(fuente =='cmpconsolidado'){  // faltaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa

  }
  if(fuente =='cmparchivo'){  
    t_dataCampostr['Descripcion'] = ''
    t_dataCampostr['Ruta'] = document.getElementById('cmparchivo_ruta').value

  }
  if(fuente =='cmpnumeroaletras'){ 

    t_dataCampostr['PkCampoNumero'] = document.getElementById('cmpnumeroaletras_campo').selectedOptions[0].value
    t_dataCampostr['CampoNumero'] = document.getElementById('cmpnumeroaletras_campo').selectedOptions[0].text
    t_dataCampostr['Decimales'] ='0'

  }
  if(fuente =='cmpdecabecera'){  
    t_dataCampostr['Descripcion'] = document.getElementById('cmpdecabecera_campo').value
    t_dataCampostr['Campo'] = document.getElementById('cmpdecabecera_campo').value

  }
  if(fuente =='cmpelectronico'){  
    
    
    tipo = document.getElementById('cmpelec_docu')
    if(tipo.children[0].children[0].children[0].className == 'active'){t_dataCampostr['Tipo'] = 'Factura'}
    if(tipo.children[0].children[0].children[1].className == 'active'){t_dataCampostr['Tipo'] = 'Retencion'}
    if(tipo.children[0].children[0].children[2].className == 'active'){t_dataCampostr['Tipo'] = 'Nota credito'}
    if(tipo.children[0].children[0].children[3].className == 'active'){t_dataCampostr['Tipo'] = 'Guia remision'}
    if(tipo.children[0].children[0].children[4].className == 'active'){t_dataCampostr['Tipo'] = 'Nota debito'}


  
    t_dataCampostr['Descripcion'] =''
    t_dataCampostr['Certificado'] = document.getElementById('cmpelectronico_certificado').value
    t_dataCampostr['Clave'] = document.getElementById('cmpelectronico_clave').value
    t_dataCampostr['ClaveAcceso'] = document.getElementById('cmpelectronico_acceso').value
    t_dataCampostr['Correo'] = document.getElementById('cmpelectronico_emailform').value
    t_dataCampostr['correo_int'] = document.getElementById('cmpelectronico_email_interno').value
    t_dataCampostr['Obligatorio'] = document.getElementById('cmpelectronico_Obligatorio').value
    t_dataCampostr['Cond_campo'] = document.getElementById('cmpelectronico_CondicionCmp').value
    t_dataCampostr['Cond_valor'] = document.getElementById('cmpelectronico_CondicionVal').value
    t_dataCampostr['Impresion'] = document.getElementById('cmpelectronico_Impresion').value



    infoTributaria = {}
    infoTributaria['ambiente'] = document.getElementById('cmpelectronico_ambiente').value.substring(0,1)
    infoTributaria['tipoEmision'] = document.getElementById('cmpelectronico_tipoEmision').value.substring(0,1)
    infoTributaria['razonSocial'] = document.getElementById('cmpelectronico_razonSocial').value
    infoTributaria['nombreComercial'] = document.getElementById('cmpelectronico_nombreComercial').value
    infoTributaria['ruc'] = document.getElementById('cmpelectronico_ruc').value
    infoTributaria['claveAcceso'] =''
    infoTributaria['codDoc'] = document.getElementById('cmpelectronico_codDoc').value.substring(0,2)
    infoTributaria['estab'] = document.getElementById('cmpelectronico_estab').value
    infoTributaria['ptoEmi'] = document.getElementById('cmpelectronico_ptoEmi').value
    infoTributaria['secuencial'] = document.getElementById('cmpelectronico_secuencial').value
    infoTributaria['dirMatriz'] = document.getElementById('cmpelectronico_dirMatriz').value
    infoTributaria['fecha'] = document.getElementById('cmpelectronico_fecha').value
    infoTributaria['regimenMicroempresas'] = document.getElementById('cmpelectronico_regimenMicroempresas').value
    infoTributaria['agenteRetencion'] = document.getElementById('cmpelectronico_agenteRetencion').value

    t_dataCampostr['infoTributaria'] = infoTributaria



    if(t_dataCampostr['Tipo'] == 'Factura'){

      infoFactura = {}
      infoFactura['fechaEmision'] = document.getElementById('cmpelectronico_f_f_fechaEmision').value
      infoFactura['dirEstablecimiento'] = document.getElementById('cmpelectronico_f_f_dirEstablecimiento').value
      infoFactura['contribuyenteEspecial'] = document.getElementById('cmpelectronico_f_f_contribuyenteEspecial').value
      infoFactura['obligadoContabilidad'] = document.getElementById('cmpelectronico_f_f_obligadoContabilidad').value
      infoFactura['tipoIdentificacionComprador'] = document.getElementById('cmpelectronico_f_f_tipoIdentificacionComprador').value
      infoFactura['razonSocialComprador'] = document.getElementById('cmpelectronico_f_f_razonSocialComprador').value
      infoFactura['identificacionComprador'] = document.getElementById('cmpelectronico_f_f_identificacionComprador').value
      infoFactura['totalSinImpuestos'] = document.getElementById('cmpelectronico_f_f_totalSinImpuestos').value
      infoFactura['totalDescuento'] = document.getElementById('cmpelectronico_f_f_totalDescuento').value
      infoFactura['propina'] = document.getElementById('cmpelectronico_f_f_propina').value
      infoFactura['importeTotal'] = document.getElementById('cmpelectronico_f_f_importeTotal').value
      infoFactura['moneda'] = document.getElementById('cmpelectronico_f_f_moneda').value
      infoFactura['codigo1'] = document.getElementById('cmpelectronico_f_f_codigo1').value
      infoFactura['codigoPorcentaje1'] = document.getElementById('cmpelectronico_f_f_codigoPorcentaje1').value
      infoFactura['baseImponible1'] = document.getElementById('cmpelectronico_f_f_baseImponible1').value
      infoFactura['descuento_adicional1'] = document.getElementById('cmpelectronico_f_f_descuento_adicional1').value
      infoFactura['valor1'] = document.getElementById('cmpelectronico_f_f_valor1').value
      infoFactura['codigo2'] = document.getElementById('cmpelectronico_f_f_codigo2').value
      infoFactura['codigoPorcentaje2'] = document.getElementById('cmpelectronico_f_f_codigoPorcentaje2').value
      infoFactura['baseImponible2'] = document.getElementById('cmpelectronico_f_f_baseImponible2').value
      infoFactura['valor2'] = document.getElementById('cmpelectronico_f_f_valor2').value
      infoFactura['descuento_adicional2'] = document.getElementById('cmpelectronico_f_f_descuento_adicional2').value
      infoFactura['codigo3'] = document.getElementById('cmpelectronico_f_f_codigo3').value
      infoFactura['codigoPorcentaje3'] = document.getElementById('cmpelectronico_f_f_codigoPorcentaje3').value
      infoFactura['baseImponible3'] = document.getElementById('cmpelectronico_f_f_baseImponible3').value
      infoFactura['valor3'] = document.getElementById('cmpelectronico_f_f_valor3').value
      infoFactura['descuento_adicional3'] = document.getElementById('cmpelectronico_f_f_descuento_adicional3').value
      infoFactura['unidadTiempo'] = document.getElementById('cmpelectronico_f_f_unidadTiempo').value
      infoFactura['formaPago'] = document.getElementById('cmpelectronico_f_f_formaPago').value
      infoFactura['total'] = document.getElementById('cmpelectronico_f_f_total').value
      infoFactura['plazo'] = document.getElementById('cmpelectronico_f_f_plazo').value
      // infoFactura['comercioExterior'] = document.getElementById('cmpelectronico_f_f_comercioExterior').value
      // infoFactura['incoTermFactura'] = document.getElementById('cmpelectronico_f_f_incoTermFactura').value
      // infoFactura['lugarIncoTerm'] = document.getElementById('cmpelectronico_f_f_lugarIncoTerm').value
      // infoFactura['paisOrigen'] = document.getElementById('cmpelectronico_f_f_paisOrigen').value
      // infoFactura['puertoEmbarque'] = document.getElementById('cmpelectronico_f_f_puertoEmbarque').value
      // infoFactura['puertoDestino'] = document.getElementById('cmpelectronico_f_f_puertoDestino').value
      // infoFactura['paisDestino'] = document.getElementById('cmpelectronico_f_f_paisDestino').value
      // infoFactura['paisAdquisicion'] = document.getElementById('cmpelectronico_f_f_paisAdquisicion').value
      // infoFactura['guiaRemision'] = document.getElementById('cmpelectronico_f_f_guiaRemision').value
      // infoFactura['direccionComprador'] = document.getElementById('cmpelectronico_f_f_direccionComprador').value
      // infoFactura['incoTermTotalSinImpuestos'] = document.getElementById('cmpelectronico_f_f_incoTermTotalSinImpuestos').value
      // infoFactura['fleteInternacional'] = document.getElementById('cmpelectronico_f_f_fleteInternacional').value
      // infoFactura['seguroInternacional'] = document.getElementById('cmpelectronico_f_f_seguroInternacional').value
      // infoFactura['gastosAduaneros'] = document.getElementById('cmpelectronico_f_f_gastosAduaneros').value
      // infoFactura['gastosTransporteOtros'] = document.getElementById('cmpelectronico_f_f_gastosTransporteOtros').value
      // infoFactura['gastosTransporteOtros'] = document.getElementById('cmpelectronico_f_f_gastosTransporteOtros').value
      infoFactura['comercioExterior'] = ''
      infoFactura['incoTermFactura'] = ''
      infoFactura['lugarIncoTerm'] = ''
      infoFactura['paisOrigen'] = ''
      infoFactura['puertoEmbarque'] = ''
      infoFactura['puertoDestino'] = ''
      infoFactura['paisDestino'] = ''
      infoFactura['paisAdquisicion'] = ''
      infoFactura['guiaRemision'] = ''
      infoFactura['direccionComprador'] = ''
      infoFactura['incoTermTotalSinImpuestos'] = ''
      infoFactura['fleteInternacional'] =''
      infoFactura['seguroInternacional'] = ''
      infoFactura['gastosAduaneros'] = ''
      infoFactura['gastosTransporteOtros'] = ''
      infoFactura['gastosTransporteOtros'] = ''
      t_dataCampostr['infoFactura'] = infoFactura



      detFactura = {}
      detFactura['codigoPrincipal'] = document.getElementById('cmpelectronico_f_d_codigoPrincipal').value
      detFactura['descripcion'] = document.getElementById('cmpelectronico_f_d_descripcion').value
      detFactura['cantidad'] = document.getElementById('cmpelectronico_f_d_cantidad').value
      detFactura['precioUnitario'] = document.getElementById('cmpelectronico_f_d_precioUnitario').value
      detFactura['descuento'] = document.getElementById('cmpelectronico_f_d_descuento').value
      detFactura['precioTotalSinImpuesto'] = document.getElementById('cmpelectronico_f_d_precioTotalSinImpuesto').value
      detFactura['codigo'] = document.getElementById('cmpelectronico_f_d_codigo').value
      detFactura['codigoPorcentaje'] = document.getElementById('cmpelectronico_f_d_codigoPorcentaje').value
      detFactura['tarifa'] = document.getElementById('cmpelectronico_f_d_tarifa').value
      detFactura['baseImponible'] = document.getElementById('cmpelectronico_f_d_baseImponible').value
      detFactura['valor'] = document.getElementById('cmpelectronico_f_d_valor').value
      detFactura['codigoAuxiliar'] = document.getElementById('cmpelectronico_f_d_codigoAuxiliar').value
      detFactura['unidadMedida'] = document.getElementById('cmpelectronico_f_d_unidadMedida').value
      
      t_dataCampostr['detFactura'] = detFactura
      
    }

    if(t_dataCampostr['Tipo'] == 'Retencion'){

      CabRetencion = {}
      CabRetencion['fechaEmision'] = document.getElementById('cmpelectronico_r_f_fechaEmision').value
      CabRetencion['dirEstablecimiento'] = document.getElementById('cmpelectronico_r_f_dirEstablecimiento').value
      CabRetencion['contribuyenteEspecial'] = document.getElementById('cmpelectronico_r_f_contribuyenteEspecial').value
      CabRetencion['obligadoContabilidad'] = document.getElementById('cmpelectronico_r_f_obligadoContabilidad').value
      CabRetencion['tipoIdentificacionSujetoRetenido'] = document.getElementById('cmpelectronico_r_f_tipoIdentificacionSujetoRetenido').value
      CabRetencion['razonSocialSujetoRetenido'] = document.getElementById('cmpelectronico_r_f_razonSocialSujetoRetenido').value
      CabRetencion['identificacionSujetoRetenido'] = document.getElementById('cmpelectronico_r_f_identificacionSujetoRetenido').value
      CabRetencion['periodoFiscal'] = document.getElementById('cmpelectronico_r_f_periodoFiscal').value
      t_dataCampostr['CabRetencion'] = CabRetencion

      DetRetencion = {}
      DetRetencion['codDocSustento'] = document.getElementById('cmpelectronico_r_d_codDocSustento').value
      DetRetencion['fechaEmisionDocSustento'] = document.getElementById('cmpelectronico_r_d_fechaEmisionDocSustento').value
      DetRetencion['numDocSustento_est'] = document.getElementById('cmpelectronico_r_d_numDocSustento_est').value
      DetRetencion['numDocSustento_punto'] = document.getElementById('cmpelectronico_r_d_numDocSustento_punto').value
      DetRetencion['numDocSustento_sec'] = document.getElementById('cmpelectronico_r_d_numDocSustento_sec').value
      DetRetencion['tipo'] = 'Detalle'
      DetRetencion['det_codigo'] = document.getElementById('cmpelectronico_r_d_det_codigo').value
      DetRetencion['det_codigoRetencion'] = document.getElementById('cmpelectronico_r_d_det_codigoRetencion').value
      DetRetencion['det_baseImponible'] = document.getElementById('cmpelectronico_r_d_det_baseImponible').value
      DetRetencion['det_porcentajeRetener'] = document.getElementById('cmpelectronico_r_d_det_porcentajeRetener').value
      DetRetencion['det_valorRetenido'] = document.getElementById('cmpelectronico_r_d_det_valorRetenido').value
      DetRetencion['det_codigo2'] = document.getElementById('cmpelectronico_r_d_det_codigo2').value
      DetRetencion['det_valorRetenido2'] = document.getElementById('cmpelectronico_r_d_det_valorRetenido2').value
      DetRetencion['det_codigoRetencion2'] = document.getElementById('cmpelectronico_r_d_det_codigoRetencion2').value
      DetRetencion['det_baseImponible2'] = document.getElementById('cmpelectronico_r_d_det_baseImponible2').value
      DetRetencion['det_porcentajeRetener2'] = document.getElementById('cmpelectronico_r_d_det_porcentajeRetener2').value
      t_dataCampostr['DetRetencion'] = DetRetencion
    }

    if(t_dataCampostr['Tipo'] == 'Nota credito'){

      Cabcredito = {}
      Cabcredito['fechaEmision'] = document.getElementById('cmpelectronico_c_f_fechaEmision').value
      Cabcredito['dirEstablecimiento'] = document.getElementById('cmpelectronico_c_f_dirEstablecimiento').value
      Cabcredito['tipoIdentificacionComprador'] = document.getElementById('cmpelectronico_c_f_tipoIdentificacionComprador').value
      Cabcredito['razonSocialComprador'] = document.getElementById('cmpelectronico_c_f_razonSocialComprador').value
      Cabcredito['identificacionComprador'] = document.getElementById('cmpelectronico_c_f_identificacionComprador').value
      Cabcredito['obligadoContabilidad'] = document.getElementById('cmpelectronico_c_f_obligadoContabilidad').value
      Cabcredito['codDocModificado'] = document.getElementById('cmpelectronico_c_f_codDocModificado').value
      Cabcredito['numDocModificado_est'] = document.getElementById('cmpelectronico_c_f_numDocModificado_est').value
      Cabcredito['numDocModificado_punto'] = document.getElementById('cmpelectronico_c_f_numDocModificado_punto').value
      Cabcredito['numDocModificado_sec'] = document.getElementById('cmpelectronico_c_f_numDocModificado_sec').value
      Cabcredito['fechaEmisionDocSustento'] = document.getElementById('cmpelectronico_c_f_fechaEmisionDocSustento').value
      Cabcredito['totalSinImpuestos'] = document.getElementById('cmpelectronico_c_f_totalSinImpuestos').value
      Cabcredito['valorModificacion'] = document.getElementById('cmpelectronico_c_f_valorModificacion').value
      Cabcredito['moneda'] = document.getElementById('cmpelectronico_c_f_moneda').value
      Cabcredito['motivo'] = document.getElementById('cmpelectronico_c_f_motivo').value
      Cabcredito['codigo1'] = document.getElementById('cmpelectronico_c_f_codigo1').value
      Cabcredito['codigoPorcentaje1'] = document.getElementById('cmpelectronico_c_f_codigoPorcentaje1').value
      Cabcredito['baseImponible1'] = document.getElementById('cmpelectronico_c_f_baseImponible1').value
      Cabcredito['valor1'] = document.getElementById('cmpelectronico_c_f_valor1').value
      Cabcredito['codigo2'] = document.getElementById('cmpelectronico_c_f_codigo2').value
      Cabcredito['codigoPorcentaje2'] = document.getElementById('cmpelectronico_c_f_codigoPorcentaje2').value
      Cabcredito['baseImponible2'] = document.getElementById('cmpelectronico_c_f_baseImponible2').value
      Cabcredito['valor2'] = document.getElementById('cmpelectronico_c_f_valor2').value
      Cabcredito['desc1'] = document.getElementById('cmpelectronico_c_f_desc1').value
      Cabcredito['desc2'] = document.getElementById('cmpelectronico_c_f_desc2').value
      Cabcredito['codigo3'] = document.getElementById('cmpelectronico_c_f_codigo3').value
      Cabcredito['codigoPorcentaje3'] = document.getElementById('cmpelectronico_c_f_codigoPorcentaje3').value
      Cabcredito['baseImponible3'] = document.getElementById('cmpelectronico_c_f_baseImponible3').value
      Cabcredito['valor3'] = document.getElementById('cmpelectronico_c_f_valor3').value
      Cabcredito['desc3'] = document.getElementById('cmpelectronico_c_f_desc3').value
      
      t_dataCampostr['Cabcredito'] = Cabcredito


      Detcredito = {}
      Detcredito['codigoInterno'] = document.getElementById('cmpelectronico_c_d_codigoInterno').value
      Detcredito['codigoAdicional'] = document.getElementById('cmpelectronico_c_d_codigoAdicional').value
      Detcredito['descripcion'] = document.getElementById('cmpelectronico_c_d_descripcion').value
      Detcredito['cantidad'] = document.getElementById('cmpelectronico_c_d_cantidad').value
      Detcredito['precioUnitario'] = document.getElementById('cmpelectronico_c_d_precioUnitario').value
      Detcredito['descuento'] = document.getElementById('cmpelectronico_c_d_descuento').value
      Detcredito['precioTotalSinImpuesto'] = document.getElementById('cmpelectronico_c_d_precioTotalSinImpuesto').value
      Detcredito['codigo'] = document.getElementById('cmpelectronico_c_d_codigo').value
      Detcredito['codigoPorcentaje'] = document.getElementById('cmpelectronico_c_d_codigoPorcentaje').value
      Detcredito['tarifa'] = document.getElementById('cmpelectronico_c_d_tarifa').value
      Detcredito['baseImponible'] = document.getElementById('cmpelectronico_c_d_baseImponible').value
      Detcredito['valor'] = document.getElementById('cmpelectronico_c_d_valor').value
      
      t_dataCampostr['Detcredito'] = Detcredito
    }

    if(t_dataCampostr['Tipo'] == 'Guia remision'){

      CabGuia = {}
      CabGuia['dirEstablecimiento'] = document.getElementById('cmpelectronico_g_f_dirEstablecimiento').value
      CabGuia['dirPartida'] = document.getElementById('cmpelectronico_g_f_dirPartida').value
      CabGuia['razonSocialTransportista'] = document.getElementById('cmpelectronico_g_f_razonSocialTransportista').value
      CabGuia['tipoIdentificacionTransportista'] = document.getElementById('cmpelectronico_g_f_tipoIdentificacionTransportista').value
      CabGuia['rucTransportista'] = document.getElementById('cmpelectronico_g_f_rucTransportista').value
      CabGuia['obligadoContabilidad'] = document.getElementById('cmpelectronico_g_f_obligadoContabilidad').value
      CabGuia['fechaIniTransporte'] = document.getElementById('cmpelectronico_g_f_fechaIniTransporte').value
      CabGuia['fechaFinTransporte'] = document.getElementById('cmpelectronico_g_f_fechaFinTransporte').value
      CabGuia['placa'] = document.getElementById('cmpelectronico_g_f_placa').value
      
      t_dataCampostr['CabGuia'] = CabGuia


      DetGuia = {}
      DetGuia['identificacionDestinatario'] = document.getElementById('cmpelectronico_g_c_identificacionDestinatario').value
      DetGuia['razonSocialDestinatario'] = document.getElementById('cmpelectronico_g_c_razonSocialDestinatario').value
      DetGuia['dirDestinatario'] = document.getElementById('cmpelectronico_g_c_dirDestinatario').value
      DetGuia['motivoTraslado'] = document.getElementById('cmpelectronico_g_c_motivoTraslado').value
      DetGuia['docAduaneroUnico'] = document.getElementById('cmpelectronico_g_c_docAduaneroUnico').value
      DetGuia['codEstabDestino'] = document.getElementById('cmpelectronico_g_c_codEstabDestino').value
      DetGuia['ruta'] = document.getElementById('cmpelectronico_g_c_ruta').value
      DetGuia['codDocSustento'] = document.getElementById('cmpelectronico_g_c_codDocSustento').value
      DetGuia['numDocSustento_punto'] = document.getElementById('cmpelectronico_g_c_numDocSustento_punto').value
      DetGuia['numAutDocSustento'] = document.getElementById('cmpelectronico_g_c_numAutDocSustento').value
      DetGuia['fechaEmisionDocSustento'] = document.getElementById('cmpelectronico_g_c_fechaEmisionDocSustento').value
      DetGuia['codigoInterno'] = document.getElementById('cmpelectronico_g_c_codigoInterno').value
      DetGuia['codigoAdicional'] = document.getElementById('cmpelectronico_g_c_codigoAdicional').value
      DetGuia['descripcion'] = document.getElementById('cmpelectronico_g_c_descripcion').value
      DetGuia['cantidad'] = document.getElementById('cmpelectronico_g_c_cantidad').value
      DetGuia['numDocSustento_est'] = document.getElementById('cmpelectronico_g_c_numDocSustento_est').value
      DetGuia['numDocSustento_sec'] = document.getElementById('cmpelectronico_g_c_numDocSustento_sec').value
      
      t_dataCampostr['DetGuia'] = DetGuia
    }

    if(t_dataCampostr['Tipo'] == 'Nota debito'){

      CabNotadebito= {}
      CabNotadebito['fechaEmision'] = document.getElementById('cmpelectronico_d_f_fechaEmision').value
      CabNotadebito['dirEstablecimiento'] = document.getElementById('cmpelectronico_d_f_dirEstablecimiento').value
      CabNotadebito['tipoIdentificacionComprador'] = document.getElementById('cmpelectronico_d_f_tipoIdentificacionComprador').value
      CabNotadebito['razonSocialComprador'] = document.getElementById('cmpelectronico_d_f_razonSocialComprador').value
      CabNotadebito['identificacionComprador'] = document.getElementById('cmpelectronico_d_f_identificacionComprador').value
      CabNotadebito['obligadoContabilidad'] = document.getElementById('cmpelectronico_d_f_obligadoContabilidad').value
      CabNotadebito['codDocModificado'] = document.getElementById('cmpelectronico_d_f_codDocModificado').value
      CabNotadebito['numDocModificado_est'] = document.getElementById('cmpelectronico_d_f_numDocModificado_est').value
      CabNotadebito['numDocModificado_punt'] = document.getElementById('cmpelectronico_d_f_numDocModificado_punt').value
      CabNotadebito['numDocModificado_sec'] = document.getElementById('cmpelectronico_d_f_numDocModificado_sec').value
      CabNotadebito['fechaEmisionDocSustento'] = document.getElementById('cmpelectronico_d_f_fechaEmisionDocSustento').value
      CabNotadebito['totalSinImpuestos'] = document.getElementById('cmpelectronico_d_f_totalSinImpuestos').value
      CabNotadebito['valorTotal'] = document.getElementById('cmpelectronico_d_f_valorTotal').value
      CabNotadebito['codigo1'] = document.getElementById('cmpelectronico_d_f_codigo1').value
      CabNotadebito['codigoPorcentaje1'] = document.getElementById('cmpelectronico_d_f_codigoPorcentaje1').value
      CabNotadebito['tarifa1'] = document.getElementById('cmpelectronico_d_f_tarifa1').value
      CabNotadebito['baseImponible1'] = document.getElementById('cmpelectronico_d_f_baseImponible1').value
      CabNotadebito['valor1'] = document.getElementById('cmpelectronico_d_f_valor1').value
      CabNotadebito['codigo2'] = document.getElementById('cmpelectronico_d_f_codigo2').value
      CabNotadebito['codigoPorcentaje2'] = document.getElementById('cmpelectronico_d_f_codigoPorcentaje2').value
      CabNotadebito['tarifa2'] = document.getElementById('cmpelectronico_d_f_tarifa2').value
      CabNotadebito['baseImponible2'] = document.getElementById('cmpelectronico_d_f_baseImponible2').value
      CabNotadebito['valor2'] = document.getElementById('cmpelectronico_d_f_valor2').value
      CabNotadebito['unidadTiempo'] = document.getElementById('cmpelectronico_d_f_unidadTiempo').value
      CabNotadebito['formaPago'] = document.getElementById('cmpelectronico_d_f_formaPago').value
      CabNotadebito['total'] = document.getElementById('cmpelectronico_d_f_total').value
      CabNotadebito['plazo'] = document.getElementById('cmpelectronico_d_f_plazo').value
      
      t_dataCampostr['CabNotadebito'] = CabNotadebito

      DetNotadebito = {}
      DetNotadebito['razon'] = document.getElementById('cmpelectronico_d_c_razon').value
      DetNotadebito['valor'] = document.getElementById('cmpelectronico_d_c_valor').value
      t_dataCampostr['DetNotadebito'] = DetNotadebito

    }

    Adicionales = []
    cmp_elec_adicionales = document.getElementById('cmpelec_adicional_row')


    for (var i = 1; i < cmp_elec_adicionales.children[0].children[0].childElementCount; i++) {
      val_internos = {} 
      val_internos['nombre'] = cmp_elec_adicionales.children[0].children[0].children[i].children[1].children[0].value
      val_internos['valor'] = cmp_elec_adicionales.children[0].children[0].children[i].children[2].children[0].value
      Adicionales.push(val_internos)
    }

    t_dataCampostr['Adicionales'] = Adicionales

  }
  if(fuente =='cmpcondicional'){  

    t_dataCampostr['Descripcion'] = ''
    t_dataCampostr['detalle'] = []
    formulavalores = document.getElementById('cmpcondicional_row')

    for (var i = 1; i < formulavalores.children[0].children[0].childElementCount; i++) {
      val_internos = {} 

      val_internos['TipoA'] = 'Campo'
      val_internos['ElementoA'] = formulavalores.children[0].children[0].children[i].children[1].children[0].value

      val_internos['Operador'] = formulavalores.children[0].children[0].children[i].children[2].children[0].value
      if(formulavalores.children[0].children[0].children[i].children[2].children[0].value == 'Igual Texto'){val_internos['Operador'] = 'igual'}
      if(formulavalores.children[0].children[0].children[i].children[2].children[0].value == 'Igual Numero'){val_internos['Operador'] = '='}
      if(formulavalores.children[0].children[0].children[i].children[2].children[0].value == 'Distinto'){val_internos['Operador'] = '!='}
      if(formulavalores.children[0].children[0].children[i].children[2].children[0].value == 'Mayor'){val_internos['Operador'] = '>'}
      if(formulavalores.children[0].children[0].children[i].children[2].children[0].value == 'Menor'){val_internos['Operador'] = '<'}
      if(formulavalores.children[0].children[0].children[i].children[2].children[0].value == 'Mayor Igual'){val_internos['Operador'] = '>='}
      if(formulavalores.children[0].children[0].children[i].children[2].children[0].value == 'Menor igual'){val_internos['Operador'] = '<='}

      val_internos['TipoB'] = formulavalores.children[0].children[0].children[i].children[3].children[0].value

      if(val_internos['TipoB'] == 'Campo'){
        val_internos['ElementoB'] = formulavalores.children[0].children[0].children[i].children[4].children[0].value
      }

      if(val_internos['TipoB'] == 'Valor'){
        val_internos['ElementoB'] = formulavalores.children[0].children[0].children[i].children[4].children[1].value
      }

      val_internos['TipoC'] = formulavalores.children[0].children[0].children[i].children[5].children[0].value
      
      if(val_internos['TipoC'] == 'Campo'){
        val_internos['ElementoC'] = formulavalores.children[0].children[0].children[i].children[6].children[0].value
      }

      if(val_internos['TipoC'] == 'Valor'){
        val_internos['ElementoC'] = formulavalores.children[0].children[0].children[i].children[6].children[1].value
      }

      t_dataCampostr['detalle'].push(val_internos)
    }
  }
  return t_dataCampostr
}



function trepar_datos_campos_modal(tem_pestalla){
  document.getElementById('modal_campos_nombre').value = document.getElementById('adm_nom_'+tem_pestalla).value
  document.getElementById('modal_campos_display').value = document.getElementById('adm_dis_'+tem_pestalla).value
  document.getElementById('modal_campos_cmptipo').value = document.getElementById('adm_tipo_'+tem_pestalla).value
  document.getElementById('modal_campos_nivel').value = document.getElementById('adm_fuente_'+tem_pestalla).value
  
  if(document.getElementById('modal_campos_cmptipo').value != ''){
    document.getElementById('mm_'+document.getElementById('adm_tipo_'+tem_pestalla).value).click()
  }

  //Eelct Adicional
  
  html_insert = '<table id="cmp_elect_adicional_'+tem_pestalla+'" class="table table-striped" style="width: 1115px;overflow-x:auto;font-size: 11px;background: white;">'
  html_insert = html_insert + '<thead><tr><th style="width: 20px;"><button type="button" onclick="cmpelectrico_adicional_add_fila('+tem_pestalla+')" class="btn bg-green btn-flat margin" style="padding: 3px 8px;margin-bottom: 0px;margin-top: 0px;">+</button></th>'
  html_insert = html_insert + '<th>Nombre</th><th>Valor</th>'
  html_insert = html_insert + '</tr></thead>'
  html_insert = html_insert + '</table>'
  document.getElementById('cmpelec_adicional_row').innerHTML = html_insert




  // condicianl
  html_insert = '<table id="cmp_cond_'+tem_pestalla+'" class="table table-striped" style="width: 1115px;overflow-x:auto;font-size: 11px;background: white;">'
  html_insert = html_insert + '<thead><tr><th style="width: 20px;"><button type="button" onclick="cmpcondicional_add_fila('+tem_pestalla+')" class="btn bg-green btn-flat margin" style="padding: 3px 8px;margin-bottom: 0px;margin-top: 0px;">+</button></th>'
  html_insert = html_insert + '<th>Si</th><th>Es</th><th>A</th><th></th><th>Entonces</th><th></th>'
  html_insert = html_insert + '</tr></thead>'
  html_insert = html_insert + '</table>'
  document.getElementById('cmpcondicional_row').innerHTML = html_insert

  // formuladetalle

  if(document.getElementById('adm_fuente_'+tem_pestalla).value == 'cabecera'){
    if(dict_pestalla['p-'+tem_pestalla]['tabla_det'] != 0 ){
      listado_campos_detalle ='<option selected>' +dict_pestalla['p-'+tem_pestalla]['campos_det'][0]['Nombre']+ '</option>'
      for (var i = 1; i < dict_pestalla['p-'+tem_pestalla]['campos_det'].length; i++) {
        listado_campos_detalle = listado_campos_detalle + '<option>' + dict_pestalla['p-'+tem_pestalla]['campos_det'][i]['Nombre']+ '</option>'
      }
      document.getElementById('cmpformuladetalle_campo').innerHTML = listado_campos_detalle
    }
    html_insert = '<table id="cmp_formula_'+tem_pestalla+'" class="table table-striped" style="width: 1115px;overflow-x:auto;font-size: 11px;background: white;">'
    html_insert = html_insert + '<thead><tr><th style="width: 20px;"><button type="button" onclick="cmpformuladetalle_add_fila('+tem_pestalla+')" class="btn bg-green btn-flat margin" style="padding: 3px 8px;margin-bottom: 0px;margin-top: 0px;">+</button></th>'
    html_insert = html_insert + '<th>Si</th><th>Es</th><th>Que</th><th></th>'
    html_insert = html_insert + '</tr></thead>'
    html_insert = html_insert + '</table>'
    document.getElementById('cmpformuladetalle_row').innerHTML = html_insert
  }
  if(document.getElementById('adm_fuente_'+tem_pestalla).value == 'detalle'){
    document.getElementById('cmpformuladetalle_row').innerHTML = 'Solo disponible Para campos Cabecera'
  }
  // add subdetalle




  //cmpoperacion
  html_insert = '<table id="cmp_operacion_'+tem_pestalla+'" class="table table-striped" style="width: 1115px;overflow-x:auto;font-size: 11px;background: white;">'
  html_insert = html_insert + '<thead><tr><th style="width: 20px;"><button type="button" onclick="cmpoperacion_add_fila('+tem_pestalla+')" class="btn bg-green btn-flat margin" style="padding: 3px 8px;margin-bottom: 0px;margin-top: 0px;">+</button></th>'
  html_insert = html_insert + '<th>Tipo</th><th>Elemento</th>'
  html_insert = html_insert + '</tr></thead>'
  html_insert = html_insert + '</table>'
  document.getElementById('cmpoperacion_row').innerHTML = html_insert

  //cmpnumeroaletras
  if(document.getElementById('adm_fuente_'+tem_pestalla).value == 'cabecera'){  
    fuente = 'campos_cab'
  }
  if(document.getElementById('adm_fuente_'+tem_pestalla).value == 'detalle'){  
    fuente = 'campos_det'
  }    
  listado_campos_detalle ='<option selected value="'+ dict_pestalla['p-'+tem_pestalla][fuente][0]['PkCampo']+'">' +dict_pestalla['p-'+tem_pestalla][fuente][0]['Nombre']+ '</option>'
  for (var i = 1; i < dict_pestalla['p-'+tem_pestalla][fuente].length; i++) {
    listado_campos_detalle = listado_campos_detalle + '<option value="'+ dict_pestalla['p-'+tem_pestalla][fuente][i]['PkCampo']+'">' + dict_pestalla['p-'+tem_pestalla][fuente][i]['Nombre']+ '</option>'
  }
  document.getElementById('cmpnumeroaletras_campo').innerHTML = listado_campos_detalle
  


  //cmpdecabecera
  if(document.getElementById('adm_fuente_'+tem_pestalla).value == 'detalle'){  
    listado_campos_detalle ='<option selected>' +dict_pestalla['p-'+tem_pestalla]['campos_cab'][0]['Nombre']+ '</option>'
    for (var i = 1; i < dict_pestalla['p-'+tem_pestalla]['campos_cab'].length; i++) {
      listado_campos_detalle = listado_campos_detalle + '<option>' + dict_pestalla['p-'+tem_pestalla]['campos_cab'][i]['Nombre']+ '</option>'
    }
    document.getElementById('cmpdecabecera_campo').innerHTML = listado_campos_detalle
  }

  //cmpreferenciaadjunto
  if(document.getElementById('adm_fuente_'+tem_pestalla).value == 'cabecera'){  
    fuente = 'campos_cab'  
  }
  if(document.getElementById('adm_fuente_'+tem_pestalla).value == 'detalle'){  
    fuente = 'campos_det'
  }
  listado_campos_detalle =''
  for (var i = 1; i < dict_pestalla['p-'+tem_pestalla][fuente].length; i++) {
    if(dict_pestalla['p-'+tem_pestalla][fuente][i]['TablaCampo'] == 'cmpreferencia'){
      listado_campos_detalle = listado_campos_detalle + '<option value="'+dict_pestalla['p-'+tem_pestalla][fuente][i]['PkCampo']+'">' + dict_pestalla['p-'+tem_pestalla][fuente][i]['Nombre']+ '</option>'
    }
  }

  html_insert = '<div class="col-sm-4"><label class="control-label" style="font-size: 12px;font-weight: bold;">Origen</label>    <select class="form-control col-sm-3" id="cmpreferenciaadjunto_campo" onchange="cmpreferenciaadjunto_select_fuente('+tem_pestalla+',this)" style="height: 25px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;" >'+listado_campos_detalle+'</select></div>'
  html_insert = html_insert + '<div class="col-sm-4"><label class="control-label" style="font-size: 12px;font-weight: bold;">Campo</label><select class="form-control col-sm-3" id="cmpreferenciaadjunto_sentencia" style="height: 25px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;" ></select></div>'

  html_insert = html_insert + '<div class="col-sm-4">  <label class="control-label" style="font-size: 12px;font-weight: bold;">Tipo</label><select class="form-control col-sm-3" id="cmpreferenciaadjunto_Tipo" style="height: 25px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;" ><option>Texto</option><option>Numero</option><option>Fecha</option><option>Fecha Tiempo</option><option>Imagen</option></select> </div>'
  html_insert = html_insert + '<div class="col-sm-4">  <label class="control-label" style="font-size: 12px;font-weight: bold;">Tamano</label>    <select class="form-control col-sm-3" id="cmpreferenciaadjunto_Tamano" style="height: 25px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;" ><option selected>Pequeno</option><option>Mediano</option><option>Grande</option></select> </div>'
  html_insert = html_insert + '<div class="col-sm-4">  <label class="control-label" style="font-size: 12px;font-weight: bold;">Modificable</label>    <select class="form-control col-sm-3" id="cmpreferenciaadjunto_Modificable" style="height: 25px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;" ><option selected>No</option><option>Si</option></select> </div>'
  html_insert = html_insert + '<div class="col-sm-4">  <label class="control-label" style="font-size: 12px;font-weight: bold;">Cambio con Clave</label><select class="form-control col-sm-3" id="cmpreferenciaadjunto_Clave" style="height: 25px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;" ><option selected>No</option><option>Si</option></select>    <label class="control-label" style="font-size: 12px;font-weight: bold;">Clave</label>  <input type="text" id="cmpreferenciaadjunto_ClaveVal" class="form-control col-sm-4" style="height: 25px;font-size: 11px;line-height: 7px;"></div>'

  document.getElementById('cmpreferenciaadjunto_row').innerHTML = html_insert

  cmpreferenciaadjunto_select_fuente(tem_pestalla, document.getElementById('cmpreferenciaadjunto_campo'))


  if(document.getElementById('adm_fuente_'+tem_pestalla).value == 'cabecera'){  
    cmpelectronico_llenado_inicial(tem_pestalla)
  }

  cargar_datos_cmp_modal(tem_pestalla, document.getElementById('adm_tipo_'+tem_pestalla).value, document.getElementById('adm_nom_'+tem_pestalla).value, document.getElementById('adm_fuente_'+tem_pestalla).value)

}

function crer_cmpcampo(zona, temp_pestalla){
  if(zona == 'detalle'){
    document.getElementById('adm_fuente_'+temp_pestalla).value = 'detalle'
  }else{
    document.getElementById('adm_fuente_'+temp_pestalla).value = 'cabecera'
  }
  document.getElementById('modal_campos_zona').value = zona
  document.getElementById('modal_campos_nombre').readOnly = ''
  document.getElementById('modal_campos_display').readOnly = ''
  document.getElementById('modal_campos_nombre').value = ''
  document.getElementById('modal_campos_display').value = ''

  document.getElementById('adm_nom_'+temp_pestalla).value = ''
  document.getElementById('adm_dis_'+temp_pestalla).value = '' 
  document.getElementById('adm_tipo_'+temp_pestalla).value = ''
  document.getElementById('modal_campos_pestana').value = temp_pestalla


  trepar_datos_campos_modal(temp_pestalla)


  
}


function grabar_admi_campo(fuente){

  if(document.getElementById('modal_campos_nombre').value.length < 2){
    alert('Falta Nombre')
  }else{
    if(document.getElementById('modal_campos_display').value.length < 2){
      alert('Falta Display') 
    }else{
    
      if(  document.getElementById('modal_campos_nombre').readOnly == true){
        es_nuevo = false
      }
      if(  document.getElementById('modal_campos_nombre').readOnly == false){
        es_nuevo = true
    
      }
      
      tem_pestalla = document.getElementById('modal_campos_pestana').value
      t_dataXstr = {}
     
      if(document.getElementById('modal_campos_nivel').value == 'cabecera'){
        t_pkestructura = dict_pestalla['p-'+tem_pestalla]['tabla_cab']['PkEstructura']
        tabla_nombre  = dict_pestalla['p-'+tem_pestalla]['tabla_cab']['Nombre']
        t_pkmodulo = dict_pestalla['p-'+tem_pestalla]['tabla_cab']['PkModulo']
        if(es_nuevo == false){
          for (var i = 0; i < dict_pestalla['p-'+tem_pestalla]['campos_cab'].length; i++) {
            if(dict_pestalla['p-'+tem_pestalla]['campos_cab'][i]['Nombre'] == document.getElementById('modal_campos_nombre').value){
              pkid = dict_pestalla['p-'+tem_pestalla]['campos_cab'][i]['PkId'] 
              t_dataXstr = dict_pestalla['p-'+tem_pestalla]['campos_cab'][i]
            }
          }
        }else{
          pkid = ''
        }
    
      }
      if(document.getElementById('modal_campos_nivel').value == 'detalle'){
        t_pkestructura = dict_pestalla['p-'+tem_pestalla]['tabla_det']['PkEstructura']
        tabla_nombre  = dict_pestalla['p-'+tem_pestalla]['tabla_det']['Nombre']
        t_pkmodulo = dict_pestalla['p-'+tem_pestalla]['tabla_det']['PkModulo']
        if(es_nuevo == false){
          for (var i = 0; i < dict_pestalla['p-'+tem_pestalla]['campos_det'].length; i++) {
            if(dict_pestalla['p-'+tem_pestalla]['campos_det'][i]['Nombre'] == document.getElementById('modal_campos_nombre').value){
              pkid = dict_pestalla['p-'+tem_pestalla]['campos_det'][i]['PkId'] 
              t_dataXstr = dict_pestalla['p-'+tem_pestalla]['campos_det'][i]
            }
          }
        }else{
          pkid = ''
        }
    
      }
    
      t_dataCampostr = {}
    
      if(valiar_datos_campos(fuente) == true){
        
        t_dataCampostr = armar_t_dataCampostr(fuente, t_pkestructura, tem_pestalla)
        
    
        $.ajax({
          type: 'POST',
          url: '/cmpadmin_grabar',
          data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'tem_pestalla': tem_pestalla, 'idioma': web_idioma, 't_dataCampostr': JSON.stringify(t_dataCampostr), 't_dataXstr': JSON.stringify(t_dataXstr), 'es_nuevo':es_nuevo, 'pkid':pkid, 'fuente': fuente, 't_pkmodulo': t_pkmodulo, 't_pkestructura': t_pkestructura, 'tabla_nombre':tabla_nombre, 'cmp_nombre':document.getElementById('modal_campos_nombre').value , 'cmp_display': document.getElementById('modal_campos_display').value, 'zona':document.getElementById('modal_campos_zona').value},
          success: function (Response) {
            alert('exito')
            modificar_estilo_recarga_base(Response['tem_pestalla'])
          }
        });
    
      }

    }
  }
  

}

function valiar_datos_campos(fuente){
  return true
}







function cmpreferenciaadjunto_select_fuente(tem_pestalla, campo){
  
  if(document.getElementById('modal_campos_nivel').value == 'cabecera'){
    fuente_campo = 'func_cab'
  }
  if(document.getElementById('modal_campos_nivel').value == 'detalle'){
    fuente_campo = 'func_det'
  }
  
  if(campo.selectedOptions.length >0){

  
  t_columnas = dict_pestalla['p-'+tem_pestalla][fuente_campo][campo.selectedOptions[0].text][0][0]['Columnas'].split(',')

  Lista_campos = '<option selected value="'+ t_columnas[0] +'">'+ t_columnas[0]+'</option>'
  for (var i = 1; i < t_columnas.length; i++) {
    Lista_campos = Lista_campos + '<option selected value="'+ t_columnas[i] +'">'+ t_columnas[i]+'</option>'
  }
  document.getElementById('cmpreferenciaadjunto_sentencia').innerHTML = Lista_campos
  }
}


function cmpoperacion_select_entre_elemeto(campo, indee){
  if(campo.value =='Campo'){
    campo.parentElement.parentElement.childNodes[indee].children[0].style.display = ''
    campo.parentElement.parentElement.childNodes[indee].children[1].style.display = 'none'
    campo.parentElement.parentElement.childNodes[indee].children[2].style.display = 'none'
  }
  if(campo.value =='Valor'){
    campo.parentElement.parentElement.childNodes[indee].children[0].style.display = 'none'
    campo.parentElement.parentElement.childNodes[indee].children[1].style.display = ''
    campo.parentElement.parentElement.childNodes[indee].children[2].style.display = 'none'
  }
  if(campo.value =='Operacion'){
    campo.parentElement.parentElement.childNodes[indee].children[0].style.display = 'none'
    campo.parentElement.parentElement.childNodes[indee].children[1].style.display = 'none'
    campo.parentElement.parentElement.childNodes[indee].children[2].style.display = ''
  }
  
}

function cmpoperacion_remove_fila(campo){
  campo.parentElement.parentElement.remove()
}

function cmpelectrico_adicional_fila(campo){
  campo.parentElement.parentElement.remove()
}

function cmpelectrico_adicional_add_fila(tem_pestalla){
  Lista_campos = '<option selected value="'+ dict_pestalla['p-'+tem_pestalla]['campos_cab'][0]['Nombre']+'">'+ dict_pestalla['p-'+tem_pestalla]['campos_cab'][0]['Nombre']+'</option>'
  for (var i = 1; i < dict_pestalla['p-'+tem_pestalla]['campos_cab'].length; i++) {
      Lista_campos = Lista_campos + '<option value="'+ dict_pestalla['p-'+tem_pestalla]['campos_cab'][i]['Nombre']+'">'+ dict_pestalla['p-'+tem_pestalla]['campos_cab'][i]['Nombre']+'</option>'
  }

  new_fila = '<tr>'
  new_fila = new_fila + '<td><button type="button" onclick="cmpelectrico_adicional_fila(this)" class="btn bg-red btn-flat margin" style="padding: 3px 8px;margin-bottom: 0px;margin-top: 0px;">-</button></td>'
  new_fila = new_fila  + '<td><input type="text" class="form-control col-sm-4"  style="height: 25px;font-size: 11px;line-height: 7px;"></td>'

  new_fila = new_fila  + '<td>'
  new_fila = new_fila  + '<select class="form-control col-sm-3" style="height: 25px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;">'+Lista_campos+'</select>'
  new_fila = new_fila  + '</td>'


  new_fila = new_fila  + '</tr>'

  $('#cmp_elect_adicional_' + tem_pestalla   + ' tr:last').after(new_fila);
}

function cmpoperacion_add_fila(tem_pestalla){
  if(document.getElementById('modal_campos_nivel').value == 'cabecera'){
    fuente_campo = 'campos_cab'
  }
  if(document.getElementById('modal_campos_nivel').value == 'detalle'){
    fuente_campo = 'campos_det'
  }

  Lista_campos = '<option selected value="'+ dict_pestalla['p-'+tem_pestalla][fuente_campo][0]['Nombre']+'">'+ dict_pestalla['p-'+tem_pestalla][fuente_campo][0]['Nombre']+'</option>'
  for (var i = 1; i < dict_pestalla['p-'+tem_pestalla][fuente_campo].length; i++) {
      Lista_campos = Lista_campos + '<option value="'+ dict_pestalla['p-'+tem_pestalla][fuente_campo][i]['Nombre']+'">'+ dict_pestalla['p-'+tem_pestalla][fuente_campo][i]['Nombre']+'</option>'
  }
  
  new_fila = '<tr>'
  new_fila = new_fila + '<td><button type="button" onclick="cmpoperacion_remove_fila(this)" class="btn bg-red btn-flat margin" style="padding: 3px 8px;margin-bottom: 0px;margin-top: 0px;">-</button></td>'
  new_fila = new_fila  + '<td><select class="form-control col-sm-3" style="height: 25px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;" onchange="cmpoperacion_select_entre_elemeto(this, 2)"><option selected>Campo</option><option>Operacion</option><option>Valor</option></td>'

  new_fila = new_fila  + '<td>'
  new_fila = new_fila  + '<select class="form-control col-sm-3" style="height: 25px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;">'+Lista_campos+'</select>'
  new_fila = new_fila  + '<input type="number" class="form-control col-sm-4"  style="height: 25px;font-size: 11px;line-height: 7px; display: none;">'
  new_fila = new_fila  + '<select class="form-control col-sm-3" style="height: 25px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;  display: none;"><option Selected> + </option><option> - </option><option> * </option><option> / </option></select>'

  new_fila = new_fila  + '</td>'


  new_fila = new_fila  + '</tr>'

  $('#cmp_operacion_' + tem_pestalla   + ' tr:last').after(new_fila);
}


function cmpformuladetalle_remove_fila(campo){
  campo.parentElement.parentElement.remove()
}

function cmpformuladetalle_select_entre_elemeto(campo, indee){
  if(campo.value =='Valor'){
    campo.parentElement.parentElement.childNodes[indee].children[0].style.display = 'none'
    campo.parentElement.parentElement.childNodes[indee].children[1].style.display = ''
  }
  if(campo.value =='Campo'){
    campo.parentElement.parentElement.childNodes[indee].children[0].style.display = ''
    campo.parentElement.parentElement.childNodes[indee].children[1].style.display = 'none'
  }
}

  
function cmpformuladetalle_add_fila(tem_pestalla){
  if(document.getElementById('modal_campos_nivel').value == 'cabecera'){
    fuente_campo = 'campos_det'
  }
  if(document.getElementById('modal_campos_nivel').value == 'detalle'){
    fuente_campo = 'campos_Subdet'
  }

  Lista_campos = '<option selected value="'+ dict_pestalla['p-'+tem_pestalla][fuente_campo][0]['Nombre']+'">'+ dict_pestalla['p-'+tem_pestalla][fuente_campo][0]['Nombre']+'</option>'
  for (var i = 1; i < dict_pestalla['p-'+tem_pestalla][fuente_campo].length; i++) {
      Lista_campos = Lista_campos + '<option value="'+ dict_pestalla['p-'+tem_pestalla][fuente_campo][i]['Nombre']+'">'+ dict_pestalla['p-'+tem_pestalla][fuente_campo][i]['Nombre']+'</option>'
  }
  
  new_fila = '<tr>'
  new_fila = new_fila + '<td><button type="button" onclick="cmpformuladetalle_remove_fila(this)" class="btn bg-red btn-flat margin" style="padding: 3px 8px;margin-bottom: 0px;margin-top: 0px;">-</button></td>'
  new_fila = new_fila  + '<td><select class="form-control col-sm-3" style="height: 25px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;">'+Lista_campos+'</select></td>'
  new_fila = new_fila  + '<td><select class="form-control col-sm-3" style="height: 25px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;"><option selected> Igual Texto </option><option selected> Igual Numero </option><option> Distinto </option><option> Mayor </option><option> Menor </option><option> Mayor Igual </option><option> Menor igual </option></td>'

  new_fila = new_fila  + '<td><select class="form-control col-sm-3" style="height: 25px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;" onchange="cmpformuladetalle_select_entre_elemeto(this, 4)"><option selected>Campo</option><option>Valor</option></td>'

  new_fila = new_fila  + '<td>'
  new_fila = new_fila  + '<select class="form-control col-sm-3" style="height: 25px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;">'+Lista_campos+'</select>'
  new_fila = new_fila  + '<input type="text" class="form-control col-sm-4"  style="height: 25px;font-size: 11px;line-height: 7px; display: none;">'
  new_fila = new_fila  + '</td>'


  new_fila = new_fila  + '</tr>'

  $('#cmp_formula_' + tem_pestalla   + ' tr:last').after(new_fila);



}

function cmpopcion_color(campo){
  campo.style.background = campo.value


}

function cmpopcion_remove_fila(campo){
  campo.parentElement.parentElement.remove()
}
function cmpopcion_add_fila(){
  new_fila = '<tr>'
  new_fila = new_fila + '<td><button type="button" onclick="cmpopcion_remove_fila(this)" class="btn bg-red btn-flat margin" style="padding: 3px 8px;margin-bottom: 0px;margin-top: 0px;">-</button></td>'


  new_fila = new_fila  + '<td>'
  new_fila = new_fila  + '<input type="text" class="form-control col-sm-4"  style="height: 25px;font-size: 11px;line-height: 7px;">'
  new_fila = new_fila  + '</td>'

  new_fila = new_fila  + '<td>'
  new_fila = new_fila  + '<input type="text" class="form-control col-sm-4"  style="height: 25px;font-size: 11px;line-height: 7px;">'
  new_fila = new_fila  + '</td>'

  new_fila = new_fila  + '<td>'
  new_fila = new_fila  + '<select class="form-control col-sm-3" style="height: 25px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;" onchange="cmpopcion_color(this)">'
  new_fila = new_fila  + '<option selected style="background: white;">white</option>'
  
  for (var i = 1; i < CSS_COLOR_NAMES.length-1; i++) {
    new_fila = new_fila  + '<option style="background: '+CSS_COLOR_NAMES[i]+';">'+CSS_COLOR_NAMES[i]+'</option>'
  }
  new_fila = new_fila  + '</select>'

  new_fila = new_fila  + '</td>'

  $('#cmp_opcion tr:last').after(new_fila);
}

function cmpcondicional_remove_fila(tem_pestalla, campo){
  campo.parentElement.parentElement.remove()
}

function cmpcondicional_select_entre_elemeto(campo, indee){
  if(campo.value =='Valor'){
    campo.parentElement.parentElement.childNodes[indee].children[0].style.display = 'none'
    campo.parentElement.parentElement.childNodes[indee].children[1].style.display = ''
  }
  if(campo.value =='Campo'){
    campo.parentElement.parentElement.childNodes[indee].children[0].style.display = ''
    campo.parentElement.parentElement.childNodes[indee].children[1].style.display = 'none'
  }
}


function cmpcondicional_add_fila(tem_pestalla){
  if(document.getElementById('modal_campos_nivel').value == 'cabecera'){
    fuente = 'campos_cab'
  }
  if(document.getElementById('modal_campos_nivel').value == 'detalle'){
    fuente = 'campos_det'
  }
  
  Lista_campos = '<option selected value="'+ dict_pestalla['p-'+tem_pestalla][fuente][0]['Nombre']+'">'+ dict_pestalla['p-'+tem_pestalla][fuente][0]['Nombre']+'</option>'
  for (var i = 1; i < dict_pestalla['p-'+tem_pestalla][fuente].length; i++) {
      Lista_campos = Lista_campos + '<option value="'+ dict_pestalla['p-'+tem_pestalla][fuente][i]['Nombre']+'">'+ dict_pestalla['p-'+tem_pestalla][fuente][i]['Nombre']+'</option>'
  }
  
  new_fila = '<tr>'
  new_fila = new_fila + '<td><button type="button" onclick="cmpcondicional_remove_fila('+tem_pestalla+', this)" class="btn bg-red btn-flat margin" style="padding: 3px 8px;margin-bottom: 0px;margin-top: 0px;">-</button></td>'
  new_fila = new_fila  + '<td><select class="form-control col-sm-3" style="height: 25px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;">'+Lista_campos+'</select></td>'
  new_fila = new_fila  + '<td><select class="form-control col-sm-3" style="height: 25px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;"><option selected> Igual Texto </option><option selected> Igual Numero </option><option> Distinto </option><option> Mayor </option><option> Menor </option><option> Mayor Igual </option><option> Menor igual </option><option> Largo igual </option><option> Largo Mayor </option><option> Largo Menor </option></td>'

  new_fila = new_fila  + '<td><select class="form-control col-sm-3" style="height: 25px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;" onchange="cmpcondicional_select_entre_elemeto(this, 4)"><option selected>Campo</option><option>Valor</option></td>'

  new_fila = new_fila  + '<td>'
  new_fila = new_fila  + '<select class="form-control col-sm-3" style="height: 25px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;">'+Lista_campos+'</select>'
  new_fila = new_fila  + '<input type="text" class="form-control col-sm-4"  style="height: 25px;font-size: 11px;line-height: 7px; display: none;">'
  new_fila = new_fila  + '</td>'

  
  new_fila = new_fila  + '<td><select class="form-control col-sm-3" style="height: 25px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;" onchange="cmpcondicional_select_entre_elemeto(this, 6)" ><option selected>Campo</option><option>Valor</option></td>'
  new_fila = new_fila  + '<td>'
  new_fila = new_fila  + '<select class="form-control col-sm-3" style="height: 25px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;">'+Lista_campos+'</select>'
  new_fila = new_fila  + '<input type="text" class="form-control col-sm-4"  style="height: 25px;font-size: 11px;line-height: 7px; display: none;">'
  new_fila = new_fila  + '</td>'
  new_fila = new_fila  + '</tr>'

  $('#cmp_cond_' + tem_pestalla   + ' tr:last').after(new_fila);



}

function cmpelectronico_llenado_inicial(tem_pestalla){

  listado_campos_cabecera =''
  for (var i = 0; i < dict_pestalla['p-'+tem_pestalla]['campos_cab'].length; i++) {
    listado_campos_cabecera = listado_campos_cabecera + '<option>' + dict_pestalla['p-'+tem_pestalla]['campos_cab'][i]['Nombre']+ '</option>'
  }
  listado_campos_detalle =''
  for (var i = 0; i < dict_pestalla['p-'+tem_pestalla]['campos_det'].length; i++) {
    listado_campos_detalle = listado_campos_detalle + '<option>' + dict_pestalla['p-'+tem_pestalla]['campos_det'][i]['Nombre']+ '</option>'
  }

  document.getElementById('cmpelectronico_acceso').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_emailform').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_CondicionCmp').innerHTML = listado_campos_cabecera
  

  document.getElementById('cmpelectronico_fecha').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_estab').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_ptoEmi').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_secuencial').innerHTML = listado_campos_cabecera
  
  
  document.getElementById('cmpelectronico_f_f_fechaEmision').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_f_f_tipoIdentificacionComprador').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_f_f_razonSocialComprador').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_f_f_identificacionComprador').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_f_f_totalSinImpuestos').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_f_f_totalDescuento').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_f_f_propina').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_f_f_importeTotal').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_f_f_baseImponible1').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_f_f_descuento_adicional1').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_f_f_valor1').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_f_f_baseImponible2').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_f_f_valor2').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_f_f_descuento_adicional2').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_f_f_baseImponible3').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_f_f_valor3').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_f_f_descuento_adicional3').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_f_f_unidadTiempo').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_f_f_formaPago').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_f_f_total').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_f_f_plazo').innerHTML = listado_campos_cabecera
  // document.getElementById('cmpelectronico_f_f_comercioExterior').innerHTML = listado_campos_cabecera
  // document.getElementById('cmpelectronico_f_f_incoTermFactura').innerHTML = listado_campos_cabecera
  // document.getElementById('cmpelectronico_f_f_lugarIncoTerm').innerHTML = listado_campos_cabecera
  // document.getElementById('cmpelectronico_f_f_puertoEmbarque').innerHTML = listado_campos_cabecera
  // document.getElementById('cmpelectronico_f_f_puertoDestino').innerHTML = listado_campos_cabecera
  // document.getElementById('cmpelectronico_f_f_paisDestino').innerHTML = listado_campos_cabecera
  // document.getElementById('cmpelectronico_f_f_paisAdquisicion').innerHTML = listado_campos_cabecera
  // document.getElementById('cmpelectronico_f_f_guiaRemision').innerHTML = listado_campos_cabecera
  // document.getElementById('cmpelectronico_f_f_direccionComprador').innerHTML = listado_campos_cabecera
  // document.getElementById('cmpelectronico_f_f_incoTermTotalSinImpuestos').innerHTML = listado_campos_cabecera
  // document.getElementById('cmpelectronico_f_f_fleteInternacional').innerHTML = listado_campos_cabecera
  // document.getElementById('cmpelectronico_f_f_seguroInternacional').innerHTML = listado_campos_cabecera
  // document.getElementById('cmpelectronico_f_f_gastosAduaneros').innerHTML = listado_campos_cabecera
  // document.getElementById('cmpelectronico_f_f_gastosTransporteOtros').innerHTML = listado_campos_cabecera
  
  document.getElementById('cmpelectronico_f_d_codigoPrincipal').innerHTML = listado_campos_detalle
  document.getElementById('cmpelectronico_f_d_descripcion').innerHTML = listado_campos_detalle
  document.getElementById('cmpelectronico_f_d_cantidad').innerHTML = listado_campos_detalle
  document.getElementById('cmpelectronico_f_d_precioUnitario').innerHTML = listado_campos_detalle
  document.getElementById('cmpelectronico_f_d_descuento').innerHTML = listado_campos_detalle
  document.getElementById('cmpelectronico_f_d_precioTotalSinImpuesto').innerHTML = listado_campos_detalle
  document.getElementById('cmpelectronico_f_d_codigo').innerHTML = listado_campos_detalle
  document.getElementById('cmpelectronico_f_d_codigoPorcentaje').innerHTML = listado_campos_detalle
  document.getElementById('cmpelectronico_f_d_tarifa').innerHTML = listado_campos_detalle
  document.getElementById('cmpelectronico_f_d_baseImponible').innerHTML = listado_campos_detalle
  document.getElementById('cmpelectronico_f_d_valor').innerHTML = listado_campos_detalle
  document.getElementById('cmpelectronico_f_d_codigoAuxiliar').innerHTML = listado_campos_detalle
  document.getElementById('cmpelectronico_f_d_unidadMedida').innerHTML = listado_campos_detalle
  
  
  document.getElementById('cmpelectronico_r_f_fechaEmision').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_r_f_tipoIdentificacionSujetoRetenido').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_r_f_razonSocialSujetoRetenido').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_r_f_identificacionSujetoRetenido').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_r_f_periodoFiscal').innerHTML = listado_campos_cabecera
  
  
  document.getElementById('cmpelectronico_r_d_codDocSustento').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_r_d_fechaEmisionDocSustento').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_r_d_numDocSustento_est').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_r_d_numDocSustento_punto').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_r_d_numDocSustento_sec').innerHTML = listado_campos_cabecera
  
  document.getElementById('cmpelectronico_r_d_det_codigoRetencion').innerHTML = listado_campos_detalle
  document.getElementById('cmpelectronico_r_d_det_baseImponible').innerHTML = listado_campos_detalle
  document.getElementById('cmpelectronico_r_d_det_porcentajeRetener').innerHTML = listado_campos_detalle
  document.getElementById('cmpelectronico_r_d_det_valorRetenido').innerHTML = listado_campos_detalle
  document.getElementById('cmpelectronico_r_d_det_valorRetenido2').innerHTML = listado_campos_detalle
  document.getElementById('cmpelectronico_r_d_det_codigoRetencion2').innerHTML = listado_campos_detalle
  document.getElementById('cmpelectronico_r_d_det_baseImponible2').innerHTML = listado_campos_detalle
  document.getElementById('cmpelectronico_r_d_det_porcentajeRetener2').innerHTML = listado_campos_detalle
  
  
  document.getElementById('cmpelectronico_c_f_fechaEmision').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_c_f_tipoIdentificacionComprador').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_c_f_razonSocialComprador').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_c_f_identificacionComprador').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_c_f_codDocModificado').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_c_f_numDocModificado_est').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_c_f_numDocModificado_punto').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_c_f_numDocModificado_sec').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_c_f_fechaEmisionDocSustento').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_c_f_totalSinImpuestos').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_c_f_valorModificacion').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_c_f_baseImponible1').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_c_f_valor1').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_c_f_baseImponible2').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_c_f_valor2').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_c_f_baseImponible3').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_c_f_valor3').innerHTML = listado_campos_cabecera
  
  document.getElementById('cmpelectronico_c_d_codigoInterno').innerHTML = listado_campos_detalle
  document.getElementById('cmpelectronico_c_d_codigoAdicional').innerHTML = listado_campos_detalle
  document.getElementById('cmpelectronico_c_d_descripcion').innerHTML = listado_campos_detalle
  document.getElementById('cmpelectronico_c_d_cantidad').innerHTML = listado_campos_detalle
  document.getElementById('cmpelectronico_c_d_precioUnitario').innerHTML = listado_campos_detalle
  document.getElementById('cmpelectronico_c_d_descuento').innerHTML = listado_campos_detalle
  document.getElementById('cmpelectronico_c_d_precioTotalSinImpuesto').innerHTML = listado_campos_detalle
  document.getElementById('cmpelectronico_c_d_codigo').innerHTML = listado_campos_detalle
  document.getElementById('cmpelectronico_c_d_codigoPorcentaje').innerHTML = listado_campos_detalle
  document.getElementById('cmpelectronico_c_d_tarifa').innerHTML = listado_campos_detalle
  document.getElementById('cmpelectronico_c_d_baseImponible').innerHTML = listado_campos_detalle
  document.getElementById('cmpelectronico_c_d_valor').innerHTML = listado_campos_detalle
  
  document.getElementById('cmpelectronico_d_f_fechaEmision').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_d_f_tipoIdentificacionComprador').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_d_f_razonSocialComprador').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_d_f_identificacionComprador').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_d_f_codDocModificado').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_d_f_numDocModificado_est').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_d_f_numDocModificado_punt').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_d_f_numDocModificado_sec').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_d_f_fechaEmisionDocSustento').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_d_f_totalSinImpuestos').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_d_f_valorTotal').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_d_f_baseImponible1').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_d_f_valor1').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_d_f_baseImponible2').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_d_f_valor2').innerHTML = listado_campos_cabecera

  document.getElementById('cmpelectronico_d_f_unidadTiempo').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_d_f_formaPago').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_d_f_total').innerHTML = listado_campos_cabecera
  document.getElementById('cmpelectronico_d_f_plazo').innerHTML = listado_campos_cabecera

  document.getElementById('cmpelectronico_d_c_razon').innerHTML = listado_campos_detalle
  document.getElementById('cmpelectronico_d_c_valor').innerHTML = listado_campos_detalle


}


function mod_campo_invisible(pkcampo, valor, temp_pestalla) {
  if (valor == 1) {
    actuai_estilo(pkcampo, 'Visible', 'N', temp_pestalla)
  } else {
    actuai_estilo(pkcampo, 'Visible', 'Y', temp_pestalla)
  }


}
 
function admin_campos_break(temp_pestalla) {
  if(document.getElementById('adm_fuente_'+temp_pestalla).value == 'cabecera'){ 
    adm_div_  = document.getElementById('adm_div_'+ temp_pestalla)
    adm_pkid_  = document.getElementById('adm_pkid_'+ temp_pestalla)
    adm_pkcampo_  = document.getElementById('adm_pkcampo_'+ temp_pestalla)
    if(dict_pestalla['p-'+temp_pestalla]['campos_cab'][adm_div_.value]['saltoweb'] ==''){
      actuai_estilo(adm_pkid_.value,'saltoweb',  '<div class=\"row\"></div>', temp_pestalla)
    }else{
      actuai_estilo(adm_pkid_.value,'saltoweb',  '', temp_pestalla)
    }
  }
}

function admin_campos_invisible(temp_pestalla) {
  adm_div_  = document.getElementById('adm_div_'+ temp_pestalla)
  adm_pkid_  = document.getElementById('adm_pkid_'+ temp_pestalla)
  adm_pkcampo_  = document.getElementById('adm_pkcampo_'+ temp_pestalla)
  if(document.getElementById('adm_fuente_'+temp_pestalla).value == 'detalle'){
    if(dict_pestalla['p-'+temp_pestalla]['campos_det'][adm_div_.value]['Visible'] =='Y'){
      actuai_estilo(adm_pkid_.value,'Visible',  'N', temp_pestalla)
    }else{
      actuai_estilo(adm_pkid_.value,'Visible',  'Y', temp_pestalla)
    }
  }
  if(document.getElementById('adm_fuente_'+temp_pestalla).value == 'cabecera'){
    if(dict_pestalla['p-'+temp_pestalla]['campos_cab'][adm_div_.value]['Visible'] =='Y'){
      actuai_estilo(adm_pkid_.value,'Visible',  'N', temp_pestalla)
    }else{
      actuai_estilo(adm_pkid_.value,'Visible',  'Y', temp_pestalla)
    }
  }
  

}


function admin_campos_tamano(dir, temp_pestalla) {
  if(document.getElementById('adm_fuente_'+temp_pestalla).value == 'cabecera'){
    adm_div_  = document.getElementById('adm_div_'+ temp_pestalla)
    adm_pkid_  = document.getElementById('adm_pkid_'+ temp_pestalla)
    adm_pkcampo_  = document.getElementById('adm_pkcampo_'+ temp_pestalla)
    tt_div = document.getElementById('divp'+temp_pestalla+'zzz'+document.getElementById('adm_nom_'+temp_pestalla).value)
  
    clase = tt_div.attributes["class"].value.split("-")
    clase[2] = parseInt(clase[2])

    tempo = clase[2].toString().split(' ')
    if(dir == 0){
      clase[2] = parseInt(tempo[0]) + parseInt(1)
    }else{
      clase[2] = parseInt(tempo[0]) - parseInt(1)
  
    }
  
    if (clase[2] > 0) {
      tt_div.attributes["class"].value = clase[0] + "-" + clase[1] + "-" + clase[2].toString().trim()  + ' cmpadmin'
      actuai_estilo_noupdate(adm_pkid_.value, 'largoweb', clase[2].toString().trim())
    }else{
      if (clase[2] < 13) {
        tt_div.attributes["class"].value = clase[0] + "-" + clase[1] + "-" + clase[2].toString().trim() + ' cmpadmin'
        actuai_estilo_noupdate(adm_pkid_.value, 'largoweb', clase[2].toString().trim())
      } 
    }

  }


  if(document.getElementById('adm_fuente_'+temp_pestalla).value == 'detalle'){
    adm_pkid_  = document.getElementById('adm_pkid_'+ temp_pestalla)

    tt_div = document.getElementById('td_pd'+temp_pestalla+'fff0ccc'+document.getElementById('adm_nom_'+temp_pestalla).value)
    valor = tt_div.children[0].style.width.slice(0,-2)

    if(dir == 0){
      valor = parseInt(valor) + parseInt(50)
    }else{
      valor = parseInt(valor) - parseInt(50)
    }
    if (valor > 0) {
      tt_div.children[0].style.width = valor + 'px'
      actuai_estilo_noupdate(adm_pkid_.value, 'largo', valor)
    }
  }
  
  if(document.getElementById('adm_fuente_'+temp_pestalla).value == 'Subdetalle'){
    adm_pkid_  = document.getElementById('adm_pkid_'+ temp_pestalla)

    tt_div = document.getElementById('td_ps'+temp_pestalla+'qqq0yyy0www'+document.getElementById('adm_nom_'+temp_pestalla).value)
    valor = tt_div.children[0].style.width.slice(0,-2)

    if(dir == 0){
      valor = parseInt(valor) + parseInt(50)
    }else{
      valor = parseInt(valor) - parseInt(50)
    }
    if (valor > 0) {
      tt_div.children[0].style.width = valor + 'px'
      actuai_estilo_noupdate(adm_pkid_.value, 'largo', valor)
    }
  }
}
function actuai_estilo_noupdate(t_pkcampo, t_atributo, t_valor) {
  $.ajax({
    type: 'POST',
    url: '/actualiza_campo',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 't_pkcampo': t_pkcampo, 't_atributo': t_atributo, 't_valor': t_valor }
  });
}
function actuai_estilo(t_pkcampo, t_atributo, t_valor, temp_pestalla) {
  $.ajax({
    type: 'POST',
    url: '/actualiza_campo',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 't_pkcampo': t_pkcampo, 't_atributo': t_atributo, 't_valor': t_valor },
    success: function (Response) {
      modificar_estilo_recarga_parcial(temp_pestalla)
    }

  });
}


function admin_campos_posi_dir(dir, temp_pestalla) {
  adm_div_  = document.getElementById('adm_div_'+ temp_pestalla)
  adm_pkid_  = document.getElementById('adm_pkid_'+ temp_pestalla)
  adm_pkcampo_  = document.getElementById('adm_pkcampo_'+ temp_pestalla)

  $.ajax({
    type: 'POST',
    url: '/intercambio_dir',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 't_pkcampo': adm_pkid_.value, 'dirre': dir },
    success: function (Response) {
      modificar_estilo_recarga_parcial(temp_pestalla)
    }
  });
}


function admin_campos_bloque(dir, temp_pestalla){
  if(document.getElementById('adm_fuente_'+temp_pestalla).value == 'cabecera'){  
    adm_div_  = document.getElementById('adm_div_'+ temp_pestalla)
    adm_pkid_  = document.getElementById('adm_pkid_'+ temp_pestalla)
    adm_pkcampo_  = document.getElementById('adm_pkcampo_'+ temp_pestalla)

    if(adm_pkid_.value > 0){   
      if (dir == 0) { actuai_estilo(adm_pkid_.value, 'posicionweb', 'arriba_izq', temp_pestalla) }
      if (dir == 1) { actuai_estilo(adm_pkid_.value, 'posicionweb', 'arriba_der', temp_pestalla) }
      if (dir == 2) { actuai_estilo(adm_pkid_.value, 'posicionweb', 'abajo_izq', temp_pestalla) }
      if (dir == 3) { actuai_estilo(adm_pkid_.value, 'posicionweb', 'abajo_der', temp_pestalla) }
      
    }
  }
}


function seleciconar_campo_admin_cabecera(temp_pestalla, id_campo ) {
  t_campo = id_campo.id.split('zzz')[1]
  ress = dict_pestalla['p-'+temp_pestalla]

  caja_up  = document.getElementById('caja_up_'+ temp_pestalla)
  caja_dw  = document.getElementById('caja_dw_'+ temp_pestalla)
  posi = ''

  
  $(".cmpadmin").css( "background", "" );
  document.getElementById('div' + id_campo.id).style.backgroundColor = 'lightgreen'

  //id_campo.parentElement.style.backgroundColor = 'lightgreen'

  for (var i = 0; i < ress['campos_cab'].length; i++) {
    if(ress['campos_cab'][i]['Nombre'] == t_campo){
      document.getElementById('adm_pkid_'+temp_pestalla).value = ress['campos_cab'][i]['PkId']
      document.getElementById('adm_pkcampo_'+temp_pestalla).value = ress['campos_cab'][i]['PkCampo']
      document.getElementById('adm_div_'+temp_pestalla).value = i
      
      document.getElementById('adm_nom_'+temp_pestalla).value = ress['campos_cab'][i]['Nombre']
      document.getElementById('adm_dis_'+temp_pestalla).value = ress['campos_cab'][i]['Descripcion']   
      document.getElementById('adm_tipo_'+temp_pestalla).value = ress['campos_cab'][i]['TablaCampo']

      document.getElementById('adm_fuente_'+temp_pestalla).value = 'cabecera'
      break
    }
  }
 
}

function seleciconar_campo_admin_subdetalle(temp_pestalla, id_campo ) {
  splity = id_campo.id.split('www')
  t_campo = splity[1]

  ress = dict_pestalla['p-'+temp_pestalla]

  tabla  = document.getElementById('tabla'+ temp_pestalla)

  posi = ''
  $(".cmpadmin").css( "background", "" );
  document.getElementById('th_' + id_campo.id).style.backgroundColor = 'lightgreen'
  document.getElementById('td_' + id_campo.id).style.backgroundColor = 'lightgreen'


  for (var i = 0; i < ress['campos_subdet'].length; i++) {
    if(ress['campos_subdet'][i]['Nombre'] == t_campo){
      document.getElementById('adm_pkid_'+temp_pestalla).value = ress['campos_subdet'][i]['PkId']
      document.getElementById('adm_pkcampo_'+temp_pestalla).value = ress['campos_subdet'][i]['PkCampo']
      document.getElementById('adm_div_'+temp_pestalla).value = i
      
      document.getElementById('adm_nom_'+temp_pestalla).value = ress['campos_subdet'][i]['Nombre']
      document.getElementById('adm_dis_'+temp_pestalla).value = ress['campos_subdet'][i]['Descripcion']   
      document.getElementById('adm_tipo_'+temp_pestalla).value = ress['campos_subdet'][i]['TablaCampo']

      document.getElementById('adm_fuente_'+temp_pestalla).value = 'Subdetalle'
      



      break
    }
  }

}
function seleciconar_campo_admin_detalle(temp_pestalla, id_campo ) {
  splity = id_campo.id.split('ccc')
  t_campo = splity[1]
  
  ress = dict_pestalla['p-'+temp_pestalla]

  tabla  = document.getElementById('tabla'+ temp_pestalla)

  posi = ''
  $(".cmpadmin").css( "background", "" );
  document.getElementById('th_' + id_campo.id).style.backgroundColor = 'lightgreen'
  document.getElementById('td_' + id_campo.id).style.backgroundColor = 'lightgreen'


  for (var i = 0; i < ress['campos_det'].length; i++) {
    if(ress['campos_det'][i]['Nombre'] == t_campo){
      document.getElementById('adm_pkid_'+temp_pestalla).value = ress['campos_det'][i]['PkId']
      document.getElementById('adm_pkcampo_'+temp_pestalla).value = ress['campos_det'][i]['PkCampo']
      document.getElementById('adm_div_'+temp_pestalla).value = i
      
      document.getElementById('adm_nom_'+temp_pestalla).value = ress['campos_det'][i]['Nombre']
      document.getElementById('adm_dis_'+temp_pestalla).value = ress['campos_det'][i]['Descripcion']   
      document.getElementById('adm_tipo_'+temp_pestalla).value = ress['campos_det'][i]['TablaCampo']

      document.getElementById('adm_fuente_'+temp_pestalla).value = 'detalle'
      



      break
    }
  }

}

function modificar_estilo_recarga_parcial(temp_pestalla){

  var cc_tabla = dict_pestalla["p-" + temp_pestalla]

  dict_pestalla["p-" + temp_pestalla]

  pkmodulo = dict_pestalla["p-" + temp_pestalla]["tabla_cab"]["PkModulo"]

  var id_tab = pkmodulo
  tipo = 'Nuevo'


  $.ajax({
    type: 'POST',
    url: '/' + web_idioma + '/consulta',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'pkmodulo': pkmodulo, 'pestalla': temp_pestalla, 'pkregistro': 0, 'tipo': tipo, 't_clave': 0 },
    success: function (Response) {
      
      id_dic = 'p-' + pestalla
      dict_pestalla[id_dic] = Response
      cc_porPesta[id_dic] = 1
      
      html_formulario = admin_campos_crear_frmulario(pestalla, 'Nuevo', Response)
      formy = document.getElementById('rr' + pestalla)
      formy.childNodes[3].outerHTML = '<div>' + html_formulario[0]+'</div>'
      formy.childNodes[4].outerHTML = '<div>' + html_formulario[1]+'</div>'
      formy.childNodes[5].outerHTML = '<div style="margin-bottom: 22px;">' + html_formulario[4]+'</div>'
      formy.childNodes[6].outerHTML = '<div>' + html_formulario[2]+'</div>'
      formy.childNodes[7].outerHTML = '<div>' + html_formulario[3]+'</div>'
      //subdetalle

      //marcar anteriori
      if(document.getElementById('adm_fuente_'+temp_pestalla).value == 'cabecera'){
        document.getElementById('divp'+temp_pestalla+'zzz'+document.getElementById('adm_nom_'+temp_pestalla).value).style.backgroundColor = 'lightgreen'
      }
      if(document.getElementById('adm_fuente_'+temp_pestalla).value == 'detalle'){
        document.getElementById('th_pd'+temp_pestalla+'fff0ccc'+document.getElementById('adm_nom_'+temp_pestalla).value).style.backgroundColor = 'lightgreen'        
        document.getElementById('td_pd'+temp_pestalla+'fff0ccc'+document.getElementById('adm_nom_'+temp_pestalla).value).style.backgroundColor = 'lightgreen'        

      }
      id=""

    }
  });
}

function modificar_estilo_recarga_inicial(temp_pestalla) {
  pestalla = pestalla + 1;

  $("#myTab").prepend('<li role="presentation" class="" id="li' + pestalla + '" style="text-align: right;"><a href="#rr' + pestalla + '" id="id' + pestalla + '" role="tab" data-toggle="tab" aria-expanded="false">'+dict_pestalla['p-' + temp_pestalla]["tabla"][0]["Descripcion"]+' <i class="fa fa-times" style="color: red; background: transparent;cursor: pointer;" onclick="cerrar_elemento(' + pestalla + ')"></i></a></li>');
  $("#myTabContent").prepend('<div role="tabpanel" class="tab-pane fade" id="rr' + pestalla + '" aria-labelledby="id' + pestalla + '" style="background-color: transparent;"> Procesando </div>');


  var cc_tabla = dict_pestalla["p-" + temp_pestalla]

  pkmodulo = dict_pestalla["p-" + temp_pestalla]["tabla"][0]["PkModulo"]

  var id_tab = pkmodulo
  tipo = 'Nuevo'


  $.ajax({
    type: 'POST',
    url: '/' + web_idioma + '/consulta',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'pkmodulo': pkmodulo, 'pestalla': pestalla, 'pkregistro': 0, 'tipo': tipo, 't_clave': 0 },
    success: function (Response) {
      $('#rr' + pestalla).html('');

      id_dic = 'p-' + pestalla
      dict_pestalla[id_dic] = Response
      cc_porPesta[id_dic] = 1
      admin_campos_solo_botones(pestalla)
      html_formulario = admin_campos_crear_frmulario(pestalla, 'Nuevo', Response)
      $('#rr' + pestalla).append('<div>'+html_formulario[0]+'</div>');
      $('#rr' + pestalla).append('<div>'+html_formulario[1]+'</div>');

      $('#rr' + pestalla).append('<div style="margin-bottom: 22px;">'+html_formulario[4]+'</div>');

      $('#rr' + pestalla).append('<div>'+html_formulario[2]+'</div>');
      $('#rr' + pestalla).append('<div>'+html_formulario[3]+'</div>');


    }
  });

  $.ajax({
    type: 'POST',
    url: '/actualizar_procesos',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma },
    success: function (Response) {
      procesos = ''

      for (var i = 0; i < Response['modulos'].length; i++) {
        procesos = procesos + '<option value="'+Response['modulos'][i]['Nombre']+'">'+Response['modulos'][i]['Descripcion']+'</option>'
      }

      campo = document.getElementById('cmpreferenciaOrigen')
      campo.innerHTML = procesos
      cmpreferenciaTraerTablas(campo)

    }
  });
}

function cmpreferenciaTraerTablas(campo){

  $.ajax({
    type: 'POST',
    url: '/actualizar_tablas',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'modulo':campo.value},
    success: function (Response) {
      tablas = ''

      for (var i = 0; i < Response['tabla'].length; i++) {
        tablas = tablas + '<option value="'+Response['tabla'][i]['Nombre']+'">'+Response['tabla'][i]['Nombre']+'</option>'
      }

      campo = document.getElementById('cmpreferenciaTabla')
      campo.innerHTML = tablas
      
      cmpreferenciaTraerCampo(campo)
    }
  });
}


function cmpreferenciaTraerCampo(campo){

  $.ajax({
    type: 'POST',
    url: '/actualizar_campos',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'tabla':campo.value},
    success: function (Response) {
      tablas = ''

      for (var i = 0; i < Response['campos'].length; i++) {
        tablas = tablas + '<option value="'+Response['campos'][i]['Nombre']+'">'+Response['campos'][i]['Descripcion']+'</option>'
      }

      document.getElementById('cmpreferenciaCampo').innerHTML = tablas
      

    }
  });
}

function modificar_estilo_recarga_base(temp_pestalla) {
  $.ajax({
    type: 'POST',
    url: '/' + web_idioma + '/consulta',
    data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'pkmodulo': pkmodulo, 'pestalla': pestalla, 'pkregistro': 0, 'tipo': tipo, 't_clave': 0 },
    success: function (Response) {
      $('#rr' + pestalla).html('');

      id_dic = 'p-' + pestalla
      dict_pestalla[id_dic] = Response
      cc_porPesta[id_dic] = 1
      admin_campos_solo_botones(pestalla)
      html_formulario = admin_campos_crear_frmulario(pestalla, 'Nuevo', Response)
      $('#rr' + pestalla).append('<div>'+html_formulario[0]+'</div>');
      $('#rr' + pestalla).append('<div>'+html_formulario[1]+'</div>');
      $('#rr' + pestalla).append('<div style="margin-bottom: 22px;">'+html_formulario[4]+'</div>');
      $('#rr' + pestalla).append('<div>'+html_formulario[2]+'</div>');
      $('#rr' + pestalla).append('<div>'+html_formulario[3]+'</div>');
      

    }
  });
}

function admin_campos_solo_botones(pestalla){
  
  div_botones = '<div class="box-header with-border" style="margin-left: 0px;margin-right: 0px;background: white;padding: 0px;"><div class="col-md-12"><div class="row" id="admin_campos_' + pestalla + '" > <h2 class="page-header"><i class="fa fa-fw fa-cogs"></i>Datos</h2>' 
  readonly = 'readonly="readonly"'
  
  readonly = ''

  div_botones = div_botones + '<div class="col-md-6 col-xs-6" >'
  div_botones = div_botones + '<input type="hidden" id="adm_fuente_'+ pestalla +'" class="form-control col-sm-4" onchange="" style="height: 25px;font-size: 11px;line-height: 7px;">'

  div_botones = div_botones + '<input type="hidden" id="adm_pkid_'+ pestalla +'" class="form-control col-sm-4" onchange="" style="height: 25px;font-size: 11px;line-height: 7px;">'
  div_botones = div_botones + '<input type="hidden" id="adm_pkcampo_'+ pestalla +'" class="form-control col-sm-4" onchange="" style="height: 25px;font-size: 11px;line-height: 7px;">'
  div_botones = div_botones + '<input type="hidden" id="adm_div_'+ pestalla +'" class="form-control col-sm-4" onchange="" style="height: 25px;font-size: 11px;line-height: 7px;">'
  
  // nombre
  div_botones = div_botones + '<div class="col-sm-4">'
  div_botones = div_botones + '<label class="control-label for="adm_nom_'+ pestalla +'" style="font-size: 12px;font-weight: bold;">Nombre</label>'
  div_botones = div_botones + '<input type="text" id="adm_nom_'+ pestalla +'" class="form-control col-sm-4" onchange="" style="height: 25px;font-size: 11px;line-height: 7px;">'
  div_botones = div_botones + '</div>'

  // Display
  div_botones = div_botones + '<div class="col-sm-4">'
  div_botones = div_botones + '<label class="control-label for="adm_dis_'+ pestalla +'" style="font-size: 12px;font-weight: bold;">Display</label>'
  div_botones = div_botones + '<input type="text" id="adm_dis_'+ pestalla +'" class="form-control col-sm-4" onchange="" style="height: 25px;font-size: 11px;line-height: 7px;">'
  div_botones = div_botones + '</div>'

  // Tipo
  div_botones = div_botones + '<div class="col-sm-4">'
  div_botones = div_botones + '<label class="control-label for="adm_tipo_'+ pestalla +'" style="font-size: 12px;font-weight: bold;">Tipo</label>'
  //div_botones = div_botones + '<input type="text" id="adm_tipo_'+ pestalla +'" class="form-control col-sm-4" onchange="" style="height: 25px;font-size: 11px;line-height: 7px;">'
  div_botones = div_botones + '<select disabled="" class="form-control col-sm-3" id="adm_tipo_'+ pestalla +'" style="height: 25px;font-size: 11px;padding-top: 0px;padding-bottom: 0px;">'
  div_botones = div_botones + '<option value="cmptxtsimple">Texto Simple</option>'
  div_botones = div_botones + '<option value="cmpnumsimple">Numero Simple</option>'
  div_botones = div_botones + '<option value="cmpnumsecuencial">Numero Secuencial</option>'
  div_botones = div_botones + '<option value="cmpopcmultiple">Opcion Multiple</option>'
  div_botones = div_botones + '<option value="cmpsistema">Sistema</option>'
  div_botones = div_botones + '<option value="cmpformuladetalle">Suma del Detalle</option>'
  div_botones = div_botones + '<option value="cmpfecha">Fecha</option>'
  div_botones = div_botones + '<option value="cmpreferencia">Buscar</option>'
  div_botones = div_botones + '<option value="cmpreferenciaadjunto">Informacion Adicional</option>'
  div_botones = div_botones + '<option value="cmpoperacion">Operacion Matematica</option>'
  div_botones = div_botones + '<option value="cmpconsolidado">Query</option>'
  div_botones = div_botones + '<option value="cmparchivo">Archivo</option>'
  div_botones = div_botones + '<option value="cmpnumeroaletras">Traductor de numero a letras</option>'
  div_botones = div_botones + '<option value="cmpdecabecera">De Cabecera</option>'
  div_botones = div_botones + '<option value="cmpelectronico">Electronico</option>'
  div_botones = div_botones + '<option value="cmpcondicional">Condiconal</option>'
  div_botones = div_botones + '</select>'


  div_botones = div_botones + '</div>'
  div_botones = div_botones + '<div class="col-sm-4">'

  div_botones = div_botones + '<button type="button" onclick="modificar_cmpcampo(' + pestalla + ')" class="btn bg-blue btn-flat margin" data-toggle="modal" data-target="#modal-default_admin_campos"><p data-toggle="tooltip" data-placement="top" title="Editar Formula" style="margin-bottom: 0px;"><i class="fa fa-fw fa-pencil-square-o"></i></p></button>'

  div_botones = div_botones + '<button type="button" onclick="Eliminar_cmpcampo(' + pestalla + ')" class="btn bg-rex btn-flat margin"><p data-toggle="tooltip" data-placement="top" title="Editar Formula" style="margin-bottom: 0px;"><i class="fa fa-fw fa-cancel"></i></p></button>'

  div_botones = div_botones + '</div>'
  div_botones = div_botones + '</div>'
  
  div_botones = div_botones + '<div class="col-md-6 col-xs-6">'

  //opciones
  div_botones = div_botones + '<div class="row">'

  div_botones = div_botones + '<button type="button" onclick="admin_campos_tamano(0,' + pestalla + ')" class="btn bg-blue btn-flat margin" data-toggle="tooltip" data-placement="top" title="Alargar Campo"><i class="fa fa-fw fa-plus"></i></button>'
  div_botones = div_botones + '<button type="button" onclick="admin_campos_tamano(1,' + pestalla + ')" class="btn bg-blue btn-flat margin" data-toggle="tooltip" data-placement="top" title="Encoger Campo"><i class="fa fa-fw fa-minus"></i></button>'
  div_botones = div_botones + '<button type="button" onclick="admin_campos_posi_dir(0,' + pestalla + ')" class="btn bg-green btn-flat margin" data-toggle="tooltip" data-placement="top" title="Mover Izquierda"><i class="fa fa-fw fa-arrow-left"></i></button>'
  div_botones = div_botones + '<button type="button" onclick="admin_campos_posi_dir(1,' + pestalla + ')" class="btn bg-green btn-flat margin" data-toggle="tooltip" data-placement="top" title="Mover Derecha"><i class="fa fa-fw fa-arrow-right"></i></button>'

  div_botones = div_botones + '<button type="button" onclick="admin_campos_break(' + pestalla + ')" class="btn bg-blue btn-flat margin" data-toggle="tooltip" data-placement="top" title="Quiebre linea"><i class="fa fa-level-down"></i> / <i class="fa fa-level-up"></i></button>'
  div_botones = div_botones + '<button type="button" onclick="admin_campos_invisible(' + pestalla + ')" class="btn bg-blue btn-flat margin" data-toggle="tooltip" data-placement="top" title="Invisible"><i class="fa fa-ban"></i></button>'

  

  div_botones = div_botones + '</div>'
  
  div_botones = div_botones + '<div class="row">'
  
  div_botones = div_botones + '<button type="button" onclick="admin_campos_bloque(0, ' + pestalla + ')" class="btn bg-green btn-flat margin" data-toggle="tooltip" data-placement="top" title="Reubicar Panel"><i class="fa fa-arrow-circle-o-up"></i><i class="fa fa-arrow-circle-o-left"></i></button>'
  div_botones = div_botones + '<button type="button" onclick="admin_campos_bloque(1, ' + pestalla + ')" class="btn bg-green btn-flat margin" data-toggle="tooltip" data-placement="top" title="Reubicar Panel"><i class="fa fa-arrow-circle-o-up"></i><i class="fa fa-arrow-circle-o-right"></i></button>'
  div_botones = div_botones + '<button type="button" onclick="admin_campos_bloque(2, ' + pestalla + ')" class="btn bg-green btn-flat margin" data-toggle="tooltip" data-placement="top" title="Reubicar Panel"><i class="fa fa-arrow-circle-o-down"></i><i class="fa fa-arrow-circle-o-left"></i></button>'
  div_botones = div_botones + '<button type="button" onclick="admin_campos_bloque(3, ' + pestalla + ')" class="btn bg-green btn-flat margin" data-toggle="tooltip" data-placement="top" title="Reubicar Panel"><i class="fa fa-arrow-circle-o-down"></i><i class="fa fa-arrow-circle-o-right"></i></button>'
  div_botones = div_botones + '</div>'

  
  div_botones = div_botones + '</div>'



  div_botones = div_botones + '</div></div></div> <h2 class="page-header"><i class="fa fa-fw fa-object-group"></i>Formulario</h2>'

  $('#rr' + pestalla).append(div_botones);
}
  

function admin_campos_crear_frmulario(pestalla,tipo, Response){
  
  html_cabecera = ''
  html_detalle = ''
  html_div_abajos = ''
  html_invi = ''
  html_Subdetalle = ''

  div_campos2 = ''
  div_campos = '<div class="box-body" style="background: white;"><div class="row" id="caja_up_' + pestalla + '">'
  div_campos_arriba_izq = ''
  div_campos_arriba_der = ''
  div_campos_abajo_izq = ''
  div_campos_abajo_der = ''
  div_c_t = ''
  ultimo_id = ""
  ultimo_posi = ""
  div_c_inv = ""
  div_c_inv_tt = ""
  for (x = 0; x < Response["campos_cab"].length; x++) {

    if (tipo == 'Nuevo') {

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

        if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["PkId"] == '2') {
          valor_campo = web_usuario

        }
        if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["PkId"] == '4') {
          valor_campo = 'Lista Usuarios'

        }
        if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["PkId"] == '1') {
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
    } else {
      valor_campo = Response["valores_cab"][0][Response["campos_cab"][x]["Nombre"]]

      if (Response["campos_cab"][x]["TablaCampo"] == "cmpfecha") {

        var now = new Date(Response["valores_cab"][0][Response["campos_cab"][x]["Nombre"]]);
        if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Tiempo"] == "Y") {
          valor_campo = now.format("Y-m-d") + 'T' + now.format("H:i:s")
        } else {
          valor_campo = now.format("Y-m-d");
        }


      }
    }

    ID_TAG = 'p' + Response["pestalla"] + 'zzz' + Response["campos_cab"][x]["Nombre"] + '';

    if (Response["campos_cab"][x]["Visible"] == "Y") {



      div_c_t = Response["campos_cab"][x]["saltoweb"]
      div_c_t = div_c_t + '<div id="div' + ID_TAG + '" class="col-sm-' + Response["campos_cab"][x]["largoweb"] + ' cmpadmin" onclick="seleciconar_campo_admin_cabecera(' + pestalla + ', ' + ID_TAG + ')">'

      div_c_t = div_c_t + '<a href="#">'

      //div_c_t = div_c_t + '<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">'
      div_c_t = div_c_t + '<label class="control-label for="' + Response["campos_cab"][x]["Nombre"] + '" style="font-size: 12px;font-weight: bold;" >' + Response["campos_cab"][x]["Descripcion"] + '</label>'
      div_c_t = div_c_t + '</a>'
  


      if (Response["campos_cab"][x]["TablaCampo"] == "cmptxtsimple") {
        readonly_int = ''
        if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Modificable"] == "N") {
          readonly_int = 'readonly="readonly"'
        }
        if (tipo == 'Nuevo') {
          valor_campo = Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["ValorPredeterminado"]
        }
        if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Largo"] > 100) {
          div_c_t = div_c_t + '<textarea type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' ' + readonly_int + ' style="font-size: 11px;">' + valor_campo + '</textarea>'
        } else {
          div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' ' + readonly_int + '  style="height: 25px;font-size: 11px;">'
        }
      }
      if (Response["campos_cab"][x]["TablaCampo"] == "cmpnumsimple") {

        div_c_t = div_c_t + '<input type="number" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' min="' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Menor"] + '" max="' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Mayor"] + '"  style="text-align: right;height: 25px;font-size: 11px;">'
      }
      if (Response["campos_cab"][x]["TablaCampo"] == "cmpnumsecuencial") {

        div_c_t = div_c_t + '<input type="number" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" readonly="readonly" style="text-align: right;height: 25px;font-size: 11px;">'
      }
      if (Response["campos_cab"][x]["TablaCampo"] == "cmpopcmultiple") {
        if (tipo != 'consulta') {
          div_c_t = div_c_t + '<select class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" id="' + ID_TAG + '" value="' + valor_campo + '"  style="height: 25px;font-size: 11px;">'

          for (z = 0; z < Response["func_cab"][Response["campos_cab"][x]["Nombre"]].length; z++) {

            if (valor_campo == Response["func_cab"][Response["campos_cab"][x]["Nombre"]][z]["Valor"]) {
              div_c_t = div_c_t + '<option selected value="' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][z]["Valor"] + '">' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][z]["Nombre"] + '</option>'
            } else {
              div_c_t = div_c_t + '<option value="' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][z]["Valor"] + '">' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][z]["Nombre"] + '</option>'
            }
          }
          div_c_t = div_c_t + '</select>'
        } else {
          div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + '  style="height: 25px;font-size: 11px;">'
        }
      }
      if (Response["campos_cab"][x]["TablaCampo"] == "cmpsistema") {
        if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["PkId"] == '2') {
          div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" readonly="readonly" style="height: 25px;font-size: 11px;">'
        }
        if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["PkId"] == '4') {
          div_c_t = div_c_t + '<select id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" readonly="readonly" style="height: 25px;font-size: 11px;"><option>Lista Usuarios</option></select>'
        }
        if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["PkId"] == '1') {
          div_c_t = div_c_t + '<input type="datetime-local" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" readonly="readonly" style="height: 25px;font-size: 11px;">'
        }
      }
      if (Response["campos_cab"][x]["TablaCampo"] == "cmpformuladetalle") {

        div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" readonly="readonly" style="text-align: right;height: 25px;font-size: 11px;">'
      }
      if (Response["campos_cab"][x]["TablaCampo"] == "cmpfecha") {
        tipodato = 'date'

        if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Tiempo"] == 'Y') {
          tipodato = 'datetime-local'
        }
        div_c_t = div_c_t + '<input type="' + tipodato + '" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + '  style="height: 25px;font-size: 11px;">'
      }
      if (Response["campos_cab"][x]["TablaCampo"] == "cmpreferencia") {
        div_c_t = div_c_t + '<div class="input-group input-group-sm" style="width: 100%;">'



        if (tipo != 'consulta') {
          div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + (Response["campos_cab"][x]["largoweb"] - 1) + '" value="' + valor_campo + '" ' + readonly + ' style="width: 85%;height: 25px;font-size: 11px;" >'
          div_c_t = div_c_t + '<button type="button" class="btn btn-info" style="height: 25px;padding: 0px 0px;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></button>'
        } else {
          div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + (Response["campos_cab"][x]["largoweb"] - 1) + '" value="' + valor_campo + '" ' + readonly + ' style="height: 25px;font-size: 11px;" >'
        }

        div_c_t = div_c_t + '</div>'
      }
      if (Response["campos_cab"][x]["TablaCampo"] == "cmpreferenciaadjunto") {

        if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Tipo"] == 'Imagen') {
          div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + '  style="height: 25px;font-size: 11px;">'

        }
        else {
          Moddato = ''
          if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Modificable"] == 'N') {
            Moddato = 'readonly="readonly"'
          }
          if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Tipo"] == 'Texto') {


            if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Tamano"] == 'G') {

              div_c_t = div_c_t + '<textarea type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + '  style="height: 45px;font-size: 11px;">' + valor_campo + '</textarea>'

            } else {
              div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' style="height: 25px;font-size: 11px;">'
            }


          }
          if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Tipo"] == 'Numero') {
            div_c_t = div_c_t + '<input type="number" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + '  style="text-align: right;" style="height: 25px;font-size: 11px;">'

          }
          if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Tipo"] == 'Fecha') {

            div_c_t = div_c_t + '<input type="date" id="' + ID_TAG + '"class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' style="height: 25px;font-size: 11px;">'
          }
          if (Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Tipo"] == 'Fecha Tiempo') {

            div_c_t = div_c_t + '<input type="datetime-local" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' style="height: 25px;font-size: 11px;">'
          }


        }
      }
      if (Response["campos_cab"][x]["TablaCampo"] == "cmpoperacion") {

        div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' onchange="setTwoNumberDecimal(' + Response["func_cab"][Response["campos_cab"][x]["Nombre"]][0]["Decimales"] + ')" readonly="readonly" style="text-align: right;height: 25px;font-size: 11px;" >'
      }
      if (Response["campos_cab"][x]["TablaCampo"] == "cmpconsolidado") {

        div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
      }
      if (Response["campos_cab"][x]["TablaCampo"] == "cmparchivo") {

        div_c_t = div_c_t + '<input type="file" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' style="height: 25px;font-size: 11px;">'
      }
      if (Response["campos_cab"][x]["TablaCampo"] == "cmpnumeroaletras") {

        div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
      }
      if (Response["campos_cab"][x]["TablaCampo"] == "cmpdecabecera") {

        div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
      }
      if (Response["campos_cab"][x]["TablaCampo"] == "cmpelectronico") {

        div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
      }
      if (Response["campos_cab"][x]["TablaCampo"] == "cmpcondicional") {

        div_c_t = div_c_t + '<input type="text" id="' + ID_TAG + '" class="form-control col-sm-' + Response["campos_cab"][x]["largoweb"] + '" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="text-align: right;height: 25px;font-size: 11px;">'
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

      div_c_inv = '<div id="div' + ID_TAG + '" class="col-sm-' + Response["campos_cab"][x]["largoweb"] + '">'

      div_c_inv = div_c_inv + '<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">'

      div_c_inv = div_c_inv + '<label class="control-label for="' + Response["campos_cab"][x]["Nombre"] + '" style="font-size: 11px;" >' + Response["campos_cab"][x]["Descripcion"] + '</label></a>'
      div_c_inv = div_c_inv + '<ul class="dropdown-menu" role="menu" style="text-align: center;">'
      div_c_inv = div_c_inv + '<li><i onclick="mod_campo_invisible(' + Response["campos_cab"][x]["PkId"] + ',0, ' + pestalla + ')" class="fa fa-ban" style="cursor: pointer;"></i></li></ul>'
      div_c_inv = div_c_inv + '<input type="text" id="' + ID_TAG + '" value="' + valor_campo + '" ' + readonly + '></div>'

      div_c_inv_tt = div_c_inv_tt + div_c_inv
    }


  }
  div_campos = div_campos + '<div class="col-md-6 col-xs-12"> <div class="row">' + div_campos_arriba_izq + '<div class="col-sm-2"><button type="button" onclick="crer_cmpcampo(\'arriba_izq\', '+Response["pestalla"]+')" class="btn bg-blue btn-flat margin" data-toggle="modal" data-target="#modal-default_admin_campos"><i class="fa fa-fw fa-plus"></i></button></div> </div></div>'
  div_campos = div_campos + '<div class="col-md-6 col-xs-12"> <div class="row">' + div_campos_arriba_der + '<div class="col-sm-2"><button type="button" onclick="crer_cmpcampo(\'arriba_der\', '+Response["pestalla"]+')" class="btn bg-blue btn-flat margin" data-toggle="modal" data-target="#modal-default_admin_campos"><i class="fa fa-fw fa-plus"></i></button></div></div></div>'


  html_cabecera = div_campos

  if (typeof (Response["campos_det"]) == "object") {
    var largo_tabla = 0
    for (x = 0; x < Response["campos_det"].length; x++) {
      if (Response["campos_det"][x]["Visible"] == "Y") {
        largo_tabla = largo_tabla + parseFloat(Response["campos_det"][x]["largo"])

      }
    }

    if (tipo == 'consulta') {
      div_campos = '<div style="overflow: scroll;"><table id="tabla' + Response["pestalla"] + '" class="table table-striped" style="width: ' + parseInt(largo_tabla) + 'px;overflow-x:auto;font-size: 11px;"><thead><tr>'
    } else {
      div_campos = '<div style="overflow: scroll;" ><table id="tabla' + Response["pestalla"] + '" class="table table-striped" style="width: ' + parseInt(largo_tabla) + 'px;overflow-x:auto;font-size: 11px;"><thead><tr><th style="width: 10px;"></th>'
    }


    for (x = 0; x < Response["campos_det"].length; x++) {
      if (Response["campos_det"][x]["Visible"] == "Y") {
        id_tag_detalle = 'pd' + Response["pestalla"] + 'fff' + 0 + 'ccc' + Response["campos_det"][x]["Nombre"]

        //div_campos = div_campos + '<th class="col-md-' + Response["campos_det"][x]["largoweb"] + '" style="width: ' + Response["campos_det"][x]["largo"] + 'px;">' + Response["campos_det"][x]["Descripcion"] + '</th>'
        div_campos = div_campos + '<th class="col-md-' + Response["campos_det"][x]["largoweb"] + ' cmpadmin" id="th_'+id_tag_detalle+'" onclick="seleciconar_campo_admin_detalle(' + pestalla + ', ' + id_tag_detalle + ')" style="padding-left: 0px;padding-right: 0px;">' + Response["campos_det"][x]["Descripcion"] + '</th>'
      }
    }
    
    div_campos = div_campos + '<th class="col-md-1" style="padding-left: 0px;padding-right: 0px;"></th>'

    div_campos = div_campos + '</tr></thead><tbody>'
    var i = 0;
    do {
      if (tipo == 'consulta') {
        div_campos = div_campos + '<tr id="f' + Response["pestalla"] + '-f' + i + '">'
      } else {
        div_campos = div_campos + '<tr id="f' + Response["pestalla"] + '-f' + i + '"><td><div class="row" style="margin-left: 0px;height: 30px;">'
        //div_campos = div_campos + '<button type="button" onclick="mas(' + Response["pestalla"] + ')" class="btn btn-success" style="padding: 3px 4px;">+</button>'
        //div_campos = div_campos + '<button type="button" onclick="menos(' + Response["pestalla"] + ',' + i + ', 0)" class="btn btn-danger" style="padding: 3px 10px;">-</button></div></td>'
      }


      for (x = 0; x < Response["campos_det"].length; x++) {

        valor_campo = 0;
        if (tipo == 'Nuevo') {

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
            if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["PkId"] == '2') {
              valor_campo = web_usuario

            }
            if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["PkId"] == '4') {
              valor_campo = web_usuario

            }
            if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["PkId"] == '1') {
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
        } else {
          valor_campo = Response["valores_det"][i][Response["campos_det"][x]["Nombre"]]
        }

        id_tag_detalle = 'pd' + Response["pestalla"] + 'fff' + i + 'ccc' + Response["campos_det"][x]["Nombre"]

        if (Response["campos_det"][x]["Visible"] == "Y") {
          //div_campos = div_campos + '<td><div class="col-sm-' + Response["campos_det"][x]["largoweb"] + '" col-md-' + Response["campos_det"][x]["largoweb"] + '" col-lg-' + Response["campos_det"][x]["largoweb"] + '">'
          div_campos = div_campos + '<td style="padding-left: 0px;padding-right: 0px;" id="td_'+id_tag_detalle+'" class="cmpadmin" onclick="seleciconar_campo_admin_detalle(' + pestalla + ', ' + id_tag_detalle + ')"><div style="width: ' + Response["campos_det"][x]["largo"] + 'px;">'

          if (Response["campos_det"][x]["TablaCampo"] == "cmptxtsimple") {
            readonly_int = ''

            if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Modificable"] == "N") {
              readonly_int = 'readonly="readonly"'
            }
            if (tipo == 'Nuevo') {
              valor_campo = Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["ValorPredeterminado"]
            }
            if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Largo"] > 100) {
              div_campos = div_campos + '<textarea type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + '  ' + readonly_int + ' style="font-size: 11px;">' + valor_campo + '</textarea>'
            } else {
              div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + '  ' + readonly_int + ' style="height: 25px;font-size: 11px;">'
            }
          }
          if (Response["campos_det"][x]["TablaCampo"] == "cmpnumsimple") {

            div_campos = div_campos + '<input type="number" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + '  min="' + Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Menor"] + '" max="' + Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Mayor"] + '" style="text-align: right;height: 25px;font-size: 11px;">'
          }
          if (Response["campos_det"][x]["TablaCampo"] == "cmpnumsecuencial") {

            div_campos = div_campos + '<input type="number" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" readonly="readonly"  style="text-align: right; height: 25px; font-size: 11px;">'
          }
          if (Response["campos_det"][x]["TablaCampo"] == "cmpopcmultiple") {
            if (tipo != 'consulta') {
              div_campos = div_campos + '<select class="form-control" id="' + id_tag_detalle + '" value="' + valor_campo + '"  style="height: 25px;font-size: 11px;">'
              for (z = 0; z < Response["func_det"][Response["campos_det"][x]["Nombre"]].length; z++) {
                if (valor_campo == Response["func_det"][Response["campos_det"][x]["Nombre"]][z]["Valor"]) {
                  div_campos = div_campos + '<option selected value="' + Response["func_det"][Response["campos_det"][x]["Nombre"]][z]["Valor"] + '">' + Response["func_det"][Response["campos_det"][x]["Nombre"]][z]["Nombre"] + '</option>'
                } else {
                  div_campos = div_campos + '<option value="' + Response["func_det"][Response["campos_det"][x]["Nombre"]][z]["Valor"] + '">' + Response["func_det"][Response["campos_det"][x]["Nombre"]][z]["Nombre"] + '</option>'
                }
              }
              div_campos = div_campos + '</select>'
            } else {
              div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + '  style="height: 25px;font-size: 11px;" >'
            }
          }
          if (Response["campos_det"][x]["TablaCampo"] == "cmpsistema") {
            if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Nombre"] == 'Usuario Actual') {
              div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" readonly="readonly" style="height: 25px;font-size: 11px;">'
            }
            if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["NumDecimales"] == 'Fecha Actual') {
              div_campos = div_campos + '<input type="datetime-local" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" readonly="readonly"  style="height: 25px;font-size: 11px;">'
            }
          }
          if (Response["campos_det"][x]["TablaCampo"] == "cmpformuladetalle") {

            div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" readonly="readonly"  style="height: 25px;font-size: 11px;">'
          }
          if (Response["campos_det"][x]["TablaCampo"] == "cmpfecha") {
            tipodato = 'date'
            if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Tiempo"] == 'Y') {
              tipodato = 'datetime-local'
            }
            div_campos = div_campos + '<input type="' + tipodato + '" id="' + id_tag_detalle + '"  class="form-control" value="' + valor_campo + '" ' + readonly + '  style="height: 25px;font-size: 11px;">'
          }
          if (Response["campos_det"][x]["TablaCampo"] == "cmpreferencia") {

            if (tipo == 'consulta') {
              div_campos = div_campos + '<div class="input-group" style="width: 100%;"><input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + '  style="height: 25px;font-size: 11px;" onkeypress="return runScript_detalle(event, ' + id_tag_detalle + ')">'
              div_campos = div_campos + '</div>'
            } else {

              div_campos = div_campos + '<div class="input-group" style="width: 100%;"><input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + '  style="width: 75%;height: 25px;font-size: 11px;" onkeypress="return runScript_detalle(event, ' + id_tag_detalle + ')">'
              div_campos = div_campos + '<button type="button" class="btn btn-primary" data-toggle="modal" data-target=".bs-example-modal-lg" onclick="buscar_referencia_detalle(' + id_tag_detalle + ' )" style="height: 25px;padding: 3px 4px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></button></div>'
            }
          }
          if (Response["campos_det"][x]["TablaCampo"] == "cmpreferenciaadjunto") {
            if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Tipo"] == 'Imagen') {

              div_campos = div_campos + '<div class="thumbnail" style="height: 100px;margin-bottom: 1px;"><div class="image view view-first"><img style="width: 80%;height: 60%; display: block;" id="' + id_tag_detalle + '_img" src="/static/archivos/' + web_Id_empresa + '/' + valor_campo + '" alt="image" value="' + valor_campo + '"><a id="' + id_tag_detalle + '_label" href="/static/archivos/' + web_Id_empresa + '/' + valor_campo + '" target="_blank">' + valor_campo + '</a></div></div>'

            } else {
              Moddato = ''
              if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Modificable"] == 'N') {
                Moddato = 'readonly="readonly"'
              }
              if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Tipo"] == 'Texto') {
                if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Tamano"] == 'G') {
                  div_campos = div_campos + '<textarea type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + '  style="font-size: 11px;">' + valor_campo + '</textarea>'
                } else {
                  div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + '  style="height: 25px;font-size: 11px;">'
                }

              }
              if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Tipo"] == 'Numero') {

                div_campos = div_campos + '<input type="number" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + '  style="text-align: right;height: 25px;font-size: 11px;">'
              }
              if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Tipo"] == 'Fecha') {

                div_campos = div_campos + '<input type="date" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + '  style="height: 25px;font-size: 11px;">'
              }
              if (Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Tipo"] == 'Fecha Tiempo') {

                div_campos = div_campos + '<input type="datetime-local" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + '  style="height: 25px;font-size: 11px;">'
              }
            }
          }
          if (Response["campos_det"][x]["TablaCampo"] == "cmpoperacion") {

            div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' onchange="setTwoNumberDecimal(' + Response["func_det"][Response["campos_det"][x]["Nombre"]][0]["Decimales"] + ')" readonly="readonly" style="text-align: right;height: 25px;font-size: 11px;"> '
          }
          if (Response["campos_det"][x]["TablaCampo"] == "cmpconsolidado") {

            div_campos = div_campos + '<input type="text" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
          }
          if (Response["campos_det"][x]["TablaCampo"] == "cmparchivo") {

            div_campos = div_campos + '<input type="file" id="' + id_tag_detalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' style="height: 25px;font-size: 11px;">'
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

          div_campos = div_campos + '</div></td>'

        } else {
          div_c_inv = '<div id="div' + id_tag_detalle + '" class="col-sm-' + Response["campos_det"][x]["largoweb"] + '">'

          div_c_inv = div_c_inv + '<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">'
    
          div_c_inv = div_c_inv + '<label class="control-label for="' + Response["campos_det"][x]["Nombre"] + '" style="font-size: 11px;" >' + Response["campos_det"][x]["Descripcion"] + '</label></a>'
          div_c_inv = div_c_inv + '<ul class="dropdown-menu" role="menu" style="text-align: center;">'
          div_c_inv = div_c_inv + '<li><i onclick="mod_campo_invisible(' + Response["campos_det"][x]["PkId"] + ',0, ' + pestalla + ')" class="fa fa-ban" style="cursor: pointer;"></i></li></ul>'
          div_c_inv = div_c_inv + '<input type="text" id="' + id_tag_detalle + '" value="' + valor_campo + '" ' + readonly + '></div>'
    
          div_c_inv_tt = div_c_inv_tt + div_c_inv
        }
      }
      div_campos = div_campos + '<tr class="col-md-1" style="padding-left: 0px;padding-right: 0px;"><button type="button" onclick="crer_cmpcampo(\'detalle\', '+Response["pestalla"]+')" class="btn bg-blue btn-flat margin" data-toggle="modal" data-target="#modal-default_admin_campos"><i class="fa fa-fw fa-plus"></i></button></tr>'

      div_campos = div_campos + '</tr>'
      i++;
    } while (i < Response["valores_det"].length);

    cc_porPesta['p-' + pestalla] = (Response["valores_det"].length)
    div_campos = div_campos + '</tbody></table></div>'

    html_detalle = div_campos 
    //$('#rr' + pestalla).append(div_campos);

 
    //$('#rr' + pestalla).append(html_div_abajos);
    
    //$('#rr' + pestalla).append('Campos invisibles <br><div class="row">' + div_c_inv_tt + '</div>');

    ////////////////////////////subdetalle
    if (typeof (Response["campos_subdet"]) == "object") {
      div_campos = ''
      ccsub_porPesta['p-' + pestalla] = ccsub_porPesta['p-' + pestalla] + 1

      var largo_tablasubdet = 0
      for (f = 0; f < Response["campos_subdet"].length; f++) {
        if (Response["campos_subdet"][f]["Visible"] == "Y") {
          largo_tablasubdet = largo_tablasubdet + parseFloat(Response["campos_subdet"][f]["largo"])

        }
      }

      div_campos = div_campos + '<tr id="regdet-' + Response["pestalla"] + '-' + i + '" style="background-color: #0073b7;" hidden="">'

      div_campos = div_campos + '<td colspan="15" style="padding-left: 26px;"><div><div class="panel-body" style="overflow: scroll;padding-top: px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;"><table class="table" id="tablaSub' + Response["pestalla"] + '-' + i + '" table-hover" style="background-color: aliceblue;margin-bottom: 0px;width: ' + parseInt(largo_tablasubdet) + 'px"><thead>'

      div_campos = div_campos + ''
      div_campos = div_campos + '<tr><th>'


      div_campos = div_campos + '</th>'

      var i2 = ccsub_porPesta['p-' + pestalla]

      for (f = 0; f < Response["campos_subdet"].length; f++) {
        id_tag_subdetalle = 'ps' + Response["pestalla"] + 'qqq' + 0 + 'yyy' + 0 + 'www' + Response["campos_subdet"][f]["Nombre"]

        if (Response["campos_subdet"][f]["Visible"] == "Y") {
          div_campos = div_campos + '<th class="col-md-' + Response["campos_subdet"][f]["largoweb"] + ' cmpadmin" id="th_'+id_tag_subdetalle+'" style="padding-left: 0px;padding-right: 0px;" onclick="seleciconar_campo_admin_subdetalle(' + pestalla + ', '+id_tag_subdetalle+')">' + Response["campos_subdet"][f]["Descripcion"] + ' </th>'
        }
      }
      div_campos = div_campos + '</tr></thead><tbody>'

      div_campos = div_campos + '<tr id="subf' + Response["pestalla"] + '-f' + 0 + '-z' + 0 + '" style="background: white;"><td><div class="row"  style="padding-left: 10px;">'


      div_campos = div_campos + '</div></td>'
      for (f = 0; f < Response["campos_subdet"].length; f++) {
        valor_campo = 0
        id_tag_subdetalle = 'ps' + Response["pestalla"] + 'qqq' + 0 + 'yyy' + 0 + 'www' + Response["campos_subdet"][f]["Nombre"]

        if (Response["campos_subdet"][f]["Visible"] == "Y") {


          div_campos = div_campos + '<td class="cmpadmin" style="padding-left: 0px;padding-right: 5px;" id="td_'+id_tag_subdetalle+'" onclick="seleciconar_campo_admin_subdetalle(' + pestalla + ', '+id_tag_subdetalle+')" ><div style="width: ' + Response["campos_subdet"][f]["largo"] + 'px;" >'



          //div_campos = div_campos + '<input type="text" id="'+id_tag_subdetalle +'" class="form-control" value="'+ valor_campo +'" '+ readonly +' onchange="guardar_calcular_subdet('+ id_tag_subdetalle +')" style="text-align: right;height: 25px;font-size: 11px;">'

          if (Response["campos_subdet"][f]["TablaCampo"] == "cmpnumsimple") {
            div_campos = div_campos + '<input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + '  min="' + Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]][0]["Menor"] + '" max="' + Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]][0]["Mayor"] + '" style="text-align: right;height: 25px;font-size: 11px;" onkeypress="return solo_numero(event)">'

          }
          if (Response["campos_subdet"][f]["TablaCampo"] == "cmptxtsimple") {
            if (Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]][0]["Modificable"] == "N") {
              readonly_int = 'readonly="readonly"'
            }
            div_campos = div_campos + '<input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + '  ' + readonly_int + ' style="height: 25px;font-size: 11px;">'

          }
          if (Response["campos_subdet"][f]["TablaCampo"] == "cmpreferenciaadjunto") {
            if (Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]][0]["Modificable"] == 'N') {
              Moddato = 'readonly="readonly"'
            }
            altura_mini = 125

            if (Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]][0]["Tipo"] == 'Texto') {
              if (Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]][0]["Tamano"] == 'G') {
                div_campos = div_campos + '<textarea type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + '  style="font-size: 11px;height: ' + altura_mini + 'px;">' + valor_campo + '</textarea>'
              } else {
                div_campos = div_campos + '<input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + ' style="height: 25px;font-size: 11px;">'
              }

            }
            if (Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]][0]["Tipo"] == 'Numero') {

              div_campos = div_campos + '<input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' ' + Moddato + '  style="text-align: right;height: 25px;font-size: 11px;" onkeypress="return solo_numero(event)">'
            }



          }
          if (Response["campos_subdet"][f]["TablaCampo"] == "cmpreferencia") {

            div_campos = div_campos + '<div class="input-group" style="width: ' + Response["campos_subdet"][f]["largo"] + 'px;"><input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' style="width: 80%;height: 25px;font-size: 11px;" >'
            div_campos = div_campos + '<button type="button" class="btn btn-info" data-toggle="modal" data-target=".bs-example-modal-lg"  style="height: 25px;padding: 3px 4px;margin-top: 0px;margin-bottom: 0px;"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></button></div>'

          }

          if (Response["campos_subdet"][f]["TablaCampo"] == "cmpopcmultiple") {
            div_campos = div_campos + '<select class="form-control" id="' + id_tag_subdetalle + '" value="' + valor_campo + '"  style="height: 25px;font-size: 11px;">'
            for (z = 0; z < Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]].length; z++) {
              if (valor_campo == Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]][z]["Valor"]) {
                div_campos = div_campos + '<option selected value="' + Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]][z]["Valor"] + '">' + Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]][z]["Nombre"] + '</option>'
              } else {
                div_campos = div_campos + '<option value="' + Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]][z]["Valor"] + '">' + Response["func_subdet"][Response["campos_subdet"][f]["Nombre"]][z]["Nombre"] + '</option>'
              }
            }
            div_campos = div_campos + '</select>'
            
          }

          if (Response["campos_subdet"][f]["TablaCampo"] == "cmpoperacion") {

            div_campos = div_campos + '<input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="text-align: right;height: 25px;font-size: 11px;"> '
          }
          if (Response["campos_subdet"][f]["TablaCampo"] == "cmpconsolidado") {
            div_campos = div_campos + '<input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
          }
          if (Response["campos_subdet"][f]["TablaCampo"] == "cmpdecabecera") {
            div_campos = div_campos + '<input type="text" id="' + id_tag_subdetalle + '" class="form-control" value="' + valor_campo + '" ' + readonly + ' readonly="readonly" style="height: 25px;font-size: 11px;">'
          }


        } else {
          div_campos = div_campos + '<input type="hidden" id="' + id_tag_subdetalle + '" value="' + valor_campo + '" ' + readonly + '>'

        }

      }
      div_campos = div_campos + '</tr>'

      html_Subdetalle = div_campos

    }
    ////////////////////////////subdetalle

    
  }else{
    //crear detalle
    html_detalle = 'crear detalle'
  }
  html_div_abajos = '<div class="box-body" style="background: white;"><div class="row" id="caja_dw_' + pestalla + '">'
  html_div_abajos = html_div_abajos + '<div class="col-md-6 col-xs-12"> <div class="row">' + div_campos_abajo_izq + '<div class="col-sm-1"><button type="button" onclick="crer_cmpcampo(\'abajo_izq\', '+Response["pestalla"]+')" class="btn bg-blue btn-flat margin" data-toggle="modal" data-target="#modal-default_admin_campos"><i class="fa fa-fw fa-plus"></i></button></div></div></div>'
  html_div_abajos = html_div_abajos + '<div class="col-md-6 col-xs-12"> <div class="row">' + div_campos_abajo_der + '<div class="col-sm-1"><button type="button" onclick="crer_cmpcampo(\'abajo_der\', '+Response["pestalla"]+')" class="btn bg-blue btn-flat margin" data-toggle="modal" data-target="#modal-default_admin_campos"><i class="fa fa-fw fa-plus"></i></button></div></div></div>'
  html_div_abajos = html_div_abajos + '</div></div>'



  html_invi = '<div class="row">Campos invisibles <br>' + div_c_inv_tt + '<div class="col-sm-1"><button type="button" onclick="crer_cmpcampo(\'invisible\', '+Response["pestalla"]+')" class="btn bg-blue btn-flat margin" data-toggle="modal" data-target="#modal-default_admin_campos"><i class="fa fa-fw fa-plus"></i></button></div></div>'
  document.getElementById('id' + pestalla).click();

  return [html_cabecera, html_detalle, html_div_abajos, html_invi, html_Subdetalle] 

}

