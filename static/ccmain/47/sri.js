function format2(n, currency) {
  //return currency + " " + n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
  return currency + " " + Number(n).toFixed(2)
}

function devuelveData(Data, key) {
  if (key in Data) {
    return format2(Data[key].toString(), '$')
  } else {
    return '*'
  }
}


function Pdf_SRI_104(Data) {
  var doc = new jsPDF('l');
  doc.setFontSize(8);


  ////////////////////////////bloque ventas 
  if (1 == 1) {


    etiquetas = []
    etiquetas.push({ 'e': 'Formulario 104 v:1.0.0', 'x': 10, 'y': 5 })

    ylinea = 25
    ylinea = ylinea + 5
    etiquetas.push({ 'e': 'RESUMEN DE VENTAS Y OTRAS OPERACIONES DEL PERÍODO QUE DECLARA', 'x': 10, 'y': ylinea })
    ylinea = ylinea + 5
    etiquetas.push({ 'e': 'Ventas locales (excluye activos fijos) gravadas tarifa diferente de cero', 'x': 10, 'y': ylinea })
    ylinea = ylinea + 5
    etiquetas.push({ 'e': 'Ventas de activos fijos gravadas tarifa diferente de cero', 'x': 10, 'y': ylinea })
    ylinea = ylinea + 5
    etiquetas.push({ 'e': 'Ventas locales (excluye activos fijos) gravadas tarifa variable diferente de cero', 'x': 10, 'y': ylinea })
    ylinea = ylinea + 5
    etiquetas.push({ 'e': 'IVA generado en la diferencia entre ventas y notas de crédito con distinta tarifa (ajuste a pagar)', 'x': 10, 'y': ylinea })
    ylinea = ylinea + 5
    etiquetas.push({ 'e': 'IVA generado en la diferencia entre ventas y notas de crédito con distinta tarifa (ajuste a favor)', 'x': 10, 'y': ylinea })
    ylinea = ylinea + 5
    etiquetas.push({ 'e': 'Ventas locales (excluye activos fijos) gravadas tarifa 0% que no dan derecho a crédito tributario', 'x': 10, 'y': ylinea })
    ylinea = ylinea + 5
    etiquetas.push({ 'e': 'Ventas de activos fijos gravadas tarifa 0% que no dan derecho a crédito tributario', 'x': 10, 'y': ylinea })
    ylinea = ylinea + 5
    etiquetas.push({ 'e': 'Ventas locales (excluye activos fijos) gravadas tarifa 0% que dan derecho a crédito tributario', 'x': 10, 'y': ylinea })
    ylinea = ylinea + 5
    etiquetas.push({ 'e': 'Ventas de activos fijos gravadas tarifa 0% que dan derecho a crédito tributario', 'x': 10, 'y': ylinea })
    ylinea = ylinea + 5
    etiquetas.push({ 'e': 'Exportaciones de bienes', 'x': 10, 'y': ylinea })
    ylinea = ylinea + 5
    etiquetas.push({ 'e': 'Exportaciones de servicios y/o derechos', 'x': 10, 'y': ylinea })


    ylinea = ylinea + 5
    etiquetas.push({ 'e': 'TOTAL VENTAS Y OTRAS OPERACIONES', 'x': 10, 'y': ylinea })
    ylinea = ylinea + 5
    etiquetas.push({ 'e': 'Transferencias no objeto o exentas de IVA', 'x': 10, 'y': ylinea })
    ylinea = ylinea + 5
    etiquetas.push({ 'e': 'Notas de crédito tarifa 0% por compensar próximo mes', 'x': 10, 'y': ylinea })
    ylinea = ylinea + 5
    etiquetas.push({ 'e': 'Notas de crédito tarifa diferente de cero por compensar próximo mes', 'x': 10, 'y': ylinea })
    ylinea = ylinea + 5
    etiquetas.push({ 'e': 'Ingresos por reembolso como intermediario / valores facturados por operadoras de transporte / ', 'x': 10, 'y': ylinea })
    ylinea = ylinea + 5
    etiquetas.push({ 'e': 'ingresos obtenidos por parte de las sociedades de gestión colectiva como intermediarios (informativo)', 'x': 10, 'y': ylinea })


    ylinea = ylinea + 5
    ylinea = ylinea + 5
    ylinea = ylinea + 5
    etiquetas.push({ 'e': 'LIQUIDACIÓN DEL IVA EN EL MES', 'x': 10, 'y': ylinea })
    ylinea = ylinea + 5
    etiquetas.push({ 'e': 'Total impuesto generado', 'x': 10, 'y': ylinea })
    ylinea = ylinea + 5
    etiquetas.push({ 'e': 'Impuesto ventas netas a liquidar meses anteriores incluye activos fijos', 'x': 10, 'y': ylinea })
    ylinea = ylinea + 5
    etiquetas.push({ 'e': 'Impuesto a liquidar en este mes', 'x': 10, 'y': ylinea })
    ylinea = ylinea + 5
    etiquetas.push({ 'e': 'Mes a pagar el monto de IVA diferente de cero por ventas a crédito de este mes', 'x': 10, 'y': ylinea })
    ylinea = ylinea + 5
    etiquetas.push({ 'e': 'Tamaño COPCI', 'x': 10, 'y': ylinea })
    ylinea = ylinea + 5
    etiquetas.push({ 'e': 'TOTAL IMPUESTO A LIQUIDAR EN ESTE MES', 'x': 10, 'y': ylinea })
    ylinea = ylinea + 5
    etiquetas.push({ 'e': 'Total comprobantes de venta emitidos', 'x': 10, 'y': ylinea })




    valores = []

    ylinea = 25
    xlinea = 190
    xsplit = 15
    ylinea = ylinea + 5

    etiquetas.push({ 'e': 'Valor Bruto', 'x': xlinea - (xsplit / 2), 'y': ylinea })
    ylinea = ylinea + 5

    valores.push({ 'e': devuelveData(Data, '401'), 'x': xlinea + xsplit, 'y': ylinea })
    etiquetas.push({ 'e': '401', 'x': xlinea - xsplit, 'y': ylinea })
    ylinea = ylinea + 5
    valores.push({ 'e': devuelveData(Data, '402'), 'x': xlinea + xsplit, 'y': ylinea })
    etiquetas.push({ 'e': '402', 'x': xlinea - xsplit, 'y': ylinea })
    ylinea = ylinea + 5
    valores.push({ 'e': devuelveData(Data, '410'), 'x': xlinea + xsplit, 'y': ylinea })
    etiquetas.push({ 'e': '410', 'x': xlinea - xsplit, 'y': ylinea })


    ylinea = ylinea + 5
    ylinea = ylinea + 5

    ylinea = ylinea + 5
    valores.push({ 'e': devuelveData(Data, '403'), 'x': xlinea + xsplit, 'y': ylinea })
    etiquetas.push({ 'e': '403', 'x': xlinea - xsplit, 'y': ylinea })
    ylinea = ylinea + 5
    valores.push({ 'e': devuelveData(Data, '404'), 'x': xlinea + xsplit, 'y': ylinea })
    etiquetas.push({ 'e': '404', 'x': xlinea - xsplit, 'y': ylinea })
    ylinea = ylinea + 5
    valores.push({ 'e': devuelveData(Data, '405'), 'x': xlinea + xsplit, 'y': ylinea })
    etiquetas.push({ 'e': '405', 'x': xlinea - xsplit, 'y': ylinea })
    ylinea = ylinea + 5
    valores.push({ 'e': devuelveData(Data, '406'), 'x': xlinea + xsplit, 'y': ylinea })
    etiquetas.push({ 'e': '406', 'x': xlinea - xsplit, 'y': ylinea })
    ylinea = ylinea + 5
    valores.push({ 'e': devuelveData(Data, '407'), 'x': xlinea + xsplit, 'y': ylinea })
    etiquetas.push({ 'e': '407', 'x': xlinea - xsplit, 'y': ylinea })
    ylinea = ylinea + 5
    valores.push({ 'e': devuelveData(Data, '408'), 'x': xlinea + xsplit, 'y': ylinea })
    etiquetas.push({ 'e': '408', 'x': xlinea - xsplit, 'y': ylinea })
    ylinea = ylinea + 5
    valores.push({ 'e': devuelveData(Data, '409'), 'x': xlinea + xsplit, 'y': ylinea })
    etiquetas.push({ 'e': '409', 'x': xlinea - xsplit, 'y': ylinea })
    ylinea = ylinea + 5
    valores.push({ 'e': devuelveData(Data, '431'), 'x': xlinea + xsplit, 'y': ylinea })
    etiquetas.push({ 'e': '431', 'x': xlinea - xsplit, 'y': ylinea })

    ylinea = ylinea + 5
    ylinea = ylinea + 5

    ylinea = ylinea + 5
    valores.push({ 'e': devuelveData(Data, '434'), 'x': xlinea + xsplit, 'y': ylinea })
    etiquetas.push({ 'e': '434', 'x': xlinea - xsplit, 'y': ylinea })




    ylinea = 25
    xlinea = 230
    xsplit = 15
    ylinea = ylinea + 5

    etiquetas.push({ 'e': 'Valor Neto', 'x': xlinea - (xsplit / 2), 'y': ylinea })
    ylinea = ylinea + 5

    valores.push({ 'e': devuelveData(Data, '411'), 'x': xlinea + xsplit, 'y': ylinea })
    etiquetas.push({ 'e': '411', 'x': xlinea - xsplit, 'y': ylinea })
    ylinea = ylinea + 5


    valores.push({ 'e': devuelveData(Data, '412'), 'x': xlinea + xsplit, 'y': ylinea })
    etiquetas.push({ 'e': '412', 'x': xlinea - xsplit, 'y': ylinea })
    ylinea = ylinea + 5
    valores.push({ 'e': devuelveData(Data, '420'), 'x': xlinea + xsplit, 'y': ylinea })
    etiquetas.push({ 'e': '420', 'x': xlinea - xsplit, 'y': ylinea })
    ylinea = ylinea + 5
    ylinea = ylinea + 5
    ylinea = ylinea + 5

    valores.push({ 'e': devuelveData(Data, '413'), 'x': xlinea + xsplit, 'y': ylinea })
    etiquetas.push({ 'e': '413', 'x': xlinea - xsplit, 'y': ylinea })
    ylinea = ylinea + 5
    valores.push({ 'e': devuelveData(Data, '414'), 'x': xlinea + xsplit, 'y': ylinea })
    etiquetas.push({ 'e': '414', 'x': xlinea - xsplit, 'y': ylinea })
    ylinea = ylinea + 5
    valores.push({ 'e': devuelveData(Data, '415'), 'x': xlinea + xsplit, 'y': ylinea })
    etiquetas.push({ 'e': '415', 'x': xlinea - xsplit, 'y': ylinea })
    ylinea = ylinea + 5
    valores.push({ 'e': devuelveData(Data, '416'), 'x': xlinea + xsplit, 'y': ylinea })
    etiquetas.push({ 'e': '416', 'x': xlinea - xsplit, 'y': ylinea })
    ylinea = ylinea + 5
    valores.push({ 'e': devuelveData(Data, '417'), 'x': xlinea + xsplit, 'y': ylinea })
    etiquetas.push({ 'e': '417', 'x': xlinea - xsplit, 'y': ylinea })
    ylinea = ylinea + 5
    valores.push({ 'e': devuelveData(Data, '418'), 'x': xlinea + xsplit, 'y': ylinea })
    etiquetas.push({ 'e': '418', 'x': xlinea - xsplit, 'y': ylinea })
    ylinea = ylinea + 5
    valores.push({ 'e': devuelveData(Data, '419'), 'x': xlinea + xsplit, 'y': ylinea })
    etiquetas.push({ 'e': '419', 'x': xlinea - xsplit, 'y': ylinea })
    ylinea = ylinea + 5
    valores.push({ 'e': devuelveData(Data, '441'), 'x': xlinea + xsplit, 'y': ylinea })
    etiquetas.push({ 'e': '441', 'x': xlinea - xsplit, 'y': ylinea })
    ylinea = ylinea + 5
    valores.push({ 'e': devuelveData(Data, '442'), 'x': xlinea + xsplit, 'y': ylinea })
    etiquetas.push({ 'e': '442', 'x': xlinea - xsplit, 'y': ylinea })
    ylinea = ylinea + 5
    valores.push({ 'e': devuelveData(Data, '443'), 'x': xlinea + xsplit, 'y': ylinea })
    etiquetas.push({ 'e': '443', 'x': xlinea - xsplit, 'y': ylinea })
    ylinea = ylinea + 5
    valores.push({ 'e': devuelveData(Data, '444'), 'x': xlinea + xsplit, 'y': ylinea })
    etiquetas.push({ 'e': '444', 'x': xlinea - xsplit, 'y': ylinea })
    ylinea = ylinea + 5



    ylinea = 25
    xlinea = 270
    xsplit = 15
    ylinea = ylinea + 5

    etiquetas.push({ 'e': 'Impuesto Generado ', 'x': xlinea - (xsplit - 2), 'y': ylinea })

    ylinea = ylinea + 5

    valores.push({ 'e': devuelveData(Data, '421'), 'x': xlinea + xsplit, 'y': ylinea })
    etiquetas.push({ 'e': '421', 'x': xlinea - xsplit, 'y': ylinea })
    ylinea = ylinea + 5

    valores.push({ 'e': devuelveData(Data, '422'), 'x': xlinea + xsplit, 'y': ylinea })
    etiquetas.push({ 'e': '422', 'x': xlinea - xsplit, 'y': ylinea })
    ylinea = ylinea + 5

    valores.push({ 'e': devuelveData(Data, '430'), 'x': xlinea + xsplit, 'y': ylinea })
    etiquetas.push({ 'e': '430', 'x': xlinea - xsplit, 'y': ylinea })
    ylinea = ylinea + 5

    valores.push({ 'e': devuelveData(Data, '423'), 'x': xlinea + xsplit, 'y': ylinea })
    etiquetas.push({ 'e': '423', 'x': xlinea - xsplit, 'y': ylinea })
    ylinea = ylinea + 5

    valores.push({ 'e': devuelveData(Data, '424'), 'x': xlinea + xsplit, 'y': ylinea })
    etiquetas.push({ 'e': '424', 'x': xlinea - xsplit, 'y': ylinea })
    ylinea = ylinea + 5

    ylinea = ylinea + 5
    ylinea = ylinea + 5
    ylinea = ylinea + 5
    ylinea = ylinea + 5
    ylinea = ylinea + 5
    ylinea = ylinea + 5
    ylinea = ylinea + 5

    valores.push({ 'e': devuelveData(Data, '429'), 'x': xlinea + xsplit, 'y': ylinea })
    etiquetas.push({ 'e': '429', 'x': xlinea - xsplit, 'y': ylinea })
    ylinea = ylinea + 5

    ylinea = ylinea + 5
    ylinea = ylinea + 5


    valores.push({ 'e': devuelveData(Data, '453'), 'x': xlinea + xsplit, 'y': ylinea })
    etiquetas.push({ 'e': '453', 'x': xlinea - xsplit, 'y': ylinea })
    ylinea = ylinea + 5
    valores.push({ 'e': devuelveData(Data, '454'), 'x': xlinea + xsplit, 'y': ylinea })
    etiquetas.push({ 'e': '454', 'x': xlinea - xsplit, 'y': ylinea })
    ylinea = ylinea + 5


    ylinea = ylinea + 5
    ylinea = ylinea + 5
    ylinea = ylinea + 5


    valores.push({ 'e': devuelveData(Data, '482'), 'x': xlinea + xsplit, 'y': ylinea })
    etiquetas.push({ 'e': '482', 'x': xlinea - xsplit, 'y': ylinea })
    ylinea = ylinea + 5
    valores.push({ 'e': devuelveData(Data, '483'), 'x': xlinea + xsplit, 'y': ylinea })
    etiquetas.push({ 'e': '483', 'x': xlinea - xsplit, 'y': ylinea })
    ylinea = ylinea + 5
    valores.push({ 'e': devuelveData(Data, '484'), 'x': xlinea + xsplit, 'y': ylinea })
    etiquetas.push({ 'e': '484', 'x': xlinea - xsplit, 'y': ylinea })
    ylinea = ylinea + 5
    valores.push({ 'e': devuelveData(Data, '486'), 'x': xlinea + xsplit, 'y': ylinea })
    etiquetas.push({ 'e': '486', 'x': xlinea - xsplit, 'y': ylinea })
    ylinea = ylinea + 5
    valores.push({ 'e': devuelveData(Data, '487'), 'x': xlinea + xsplit, 'y': ylinea })
    etiquetas.push({ 'e': '487', 'x': xlinea - xsplit, 'y': ylinea })
    ylinea = ylinea + 5
    valores.push({ 'e': devuelveData(Data, '499'), 'x': xlinea + xsplit, 'y': ylinea })
    etiquetas.push({ 'e': '499', 'x': xlinea - xsplit, 'y': ylinea })
    ylinea = ylinea + 5
    valores.push({ 'e': devuelveData(Data, '113'), 'x': xlinea + xsplit, 'y': ylinea })
    etiquetas.push({ 'e': '113', 'x': xlinea - xsplit, 'y': ylinea })
    ylinea = ylinea + 5




    for (x2 = 0; x2 < etiquetas.length; x2++) {
      doc.text(etiquetas[x2]['x'], etiquetas[x2]['y'], etiquetas[x2]['e'])
    }
    for (x2 = 0; x2 < valores.length; x2++) {
      doc.text(valores[x2]['x'], valores[x2]['y'], valores[x2]['e'], 'right')
    }
  }


  ////////////////////////////bloque ventas 
  ////////////////////////////bloque compras crea paguina nueva 

  doc.addPage('l')
  etiquetas = []

  ylinea = 10
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'RESUMEN DE ADQUISICIONES Y PAGOS DEL PERÍODO QUE DECLARA', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Adquisiciones y pagos (excluye activos fijos) gravados tarifa diferente de cero (con derecho a crédito tributario)', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Adquisiciones locales de activos fijos gravados tarifa diferente de cero (con derecho a crédito tributario)', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Adquisiciones y pagos (excluye activos fijos) gravados tarifa diferente de cero (con derecho a crédito tributario tarifa variable)', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Otras adquisiciones y pagos gravados tarifa diferente de cero (sin derecho a crédito tributario)', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'IVA generado en la diferencia entre adquisiciones y notas de crédito con distinta tarifa (ajuste en positivo al crédito tributario)', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'IVA generado en la diferencia entre adquisiciones y notas de crédito con distinta tarifa (ajuste en negativo al crédito tributario)', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Importaciones de bienes (incluye activos fijos) gravados tarifa 0%', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Adquisiciones y pagos (incluye activos fijos) gravados tarifa 0%', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Adquisiciones realizadas a contribuyentes RISE (hasta diciembre 2021), NEGOCIOS POPULARES (desde enero 2022)', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'TOTAL ADQUISICIONES Y PAGOS', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Adquisiciones no objeto de IVA', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Adquisiciones exentas del pago de IVA', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Notas de crédito tarifa 0% por compensar próximo mes', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Notas de crédito tarifa diferente de cero por compensar próximo mes', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Pagos netos por reembolso como intermediario / valores facturados por socios a operadoras de transporte / pagos realizados por', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'parte de las sociedades de gestión colectiva como intermediarios (informativo)', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Factor de proporcionalidad para crédito tributario', 'x': 10, 'y': ylinea })

  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Crédito tributario aplicable en este período (de acuerdo al factor de proporcionalidad o a su contabilidad) (520+521+534+523+524+525+526-527) x 563', 'x': 10, 'y': ylinea })

  ylinea = ylinea + 5
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Total comprobantes de venta recibidos por adquisiciones y pagos', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': '(excepto notas de venta)', 'x': 10, 'y': ylinea })

  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Total liquidaciones de compra emitidas (por pagos tarifa 0% de IVA, o por reembolsos en relación de dependencia)', 'x': 10, 'y': ylinea })



  valores = []

  ylinea = 20
  xlinea = 190
  xsplit = 10

  etiquetas.push({ 'e': 'Valor Bruto', 'x': xlinea - (xsplit / 2), 'y': ylinea })
  ylinea = ylinea + 5

  valores.push({ 'e': devuelveData(Data, '500'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '500', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '501'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '501', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '530'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '530', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '502'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '502', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  ylinea = ylinea + 5
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '506'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '506', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '507'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '507', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '508'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '508', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '509'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '509', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '531'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '531', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '532'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '532', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  ylinea = ylinea + 5
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '535'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '', 'x': xlinea - xsplit, 'y': ylinea })



  ylinea = 20
  xlinea = 230
  xsplit = 15

  etiquetas.push({ 'e': 'Valor Neto', 'x': xlinea - (xsplit / 2), 'y': ylinea })
  ylinea = ylinea + 5

  valores.push({ 'e': devuelveData(Data, '510'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '510', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5

  valores.push({ 'e': devuelveData(Data, '511'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '511', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5

  valores.push({ 'e': devuelveData(Data, '533'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '533', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '512'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '512', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  ylinea = ylinea + 5
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '516'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '516', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '517'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '517', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '518'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '518', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '519'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '519', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '541'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '541', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '542'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '542', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '543'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '543', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '544'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '544', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '545'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '545', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5





  ylinea = 20
  xlinea = 270
  xsplit = 15

  etiquetas.push({ 'e': 'Impuesto Generado ', 'x': xlinea - (xsplit - 2), 'y': ylinea })
  ylinea = ylinea + 5


  valores.push({ 'e': devuelveData(Data, '520'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '520', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5

  valores.push({ 'e': devuelveData(Data, '521'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '521', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '534'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '534', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '522'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '522', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '526'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '526', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '527'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '527', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  ylinea = ylinea + 5
  ylinea = ylinea + 5
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '529'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '529', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  ylinea = ylinea + 5
  ylinea = ylinea + 5
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '554'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '554', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '555'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '555', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  ylinea = ylinea + 5
  ylinea = ylinea + 5

  valores.push({ 'e': devuelveData(Data, '563'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '563', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '564'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '564', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '117'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '117', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '119'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '119', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5

  for (x2 = 0; x2 < etiquetas.length; x2++) {
    doc.text(etiquetas[x2]['x'], etiquetas[x2]['y'], etiquetas[x2]['e'])
  }
  for (x2 = 0; x2 < valores.length; x2++) {
    doc.text(valores[x2]['x'], valores[x2]['y'], valores[x2]['e'], 'right')
  }

  ////////////////////////bloqu compras

  ////////////////////////bloqu RESUMEN IMPOSITIVO
  doc.addPage('l')
  etiquetas = []

  ylinea = 10

  valores = []


  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'RESUMEN IMPOSITIVO: AGENTE DE PERCEPCIÓN DEL IMPUESTO AL VALOR AGREGADO', 'x': 10, 'y': ylinea })

  ylinea = ylinea + 5



  etiquetas.push({ 'e': 'Impuesto causado', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': '(-) Compensación de IVA por ventas efectuadas con medio electrónico y/o IVA devuelto o descontado por transacciones realizadas con personas adultas mayores o personas con discapacidad', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': '(-) Saldo crédito tributario del mes anterior', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': '    Por adquisiciones e importaciones', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': '    Por retenciones en la fuente de IVA que le han sido efectuadas', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': '    Por compensación de IVA por ventas efectuadas con medio electrónico', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': '    Por compensación de IVA por ventas efectuadas en zonas afectadas - Ley de solidaridad, restitución de crédito', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': '    tributario en resoluciones administrativas o sentencias judiciales de última instancia', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': '(-) Retenciones en la fuente de IVA que le han sido efectuadas en este período', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': '(-) IVA devuelto o descontado por transacciones realizadas con personas adultas mayores o personas con discapacidad', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': '(+) Ajuste por IVA devuelto o descontado por adquisiciones efectuadas con medio electrónico', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': '(+) Ajuste por IVA devuelto e IVA rechazado (por concepto de devoluciones de IVA), ajuste de IVA por procesos de control y otros (adquisiciones en importaciones), imputables al crédito tributario', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': '(+) Ajuste por IVA devuelto e IVA rechazado, ajuste de IVA por procesos de control y otros (por concepto retenciones en la fuente de IVA), imputables al crédito tributario', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': '(+) Ajuste por IVA devuelto por otras instituciones del sector público imputable al crédito tributario en el mes', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Saldo crédito tributario para el próximo mes', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': '    Por adquisiciones e importaciones', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': '    Por retenciones en la fuente de IVA que le han sido efectuadas', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': '    Por compensación de IVA por ventas efectuadas con medio electrónico', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': '    Por compensación de IVA por ventas efectuadas en zonas afectadas - Ley de solidaridad, restitución de crédito tributario en resoluciones', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': '    administrativas o sentencias judiciales de última instancia', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'SUBTOTAL A PAGAR', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'TOTAL IMPUESTO A PAGAR POR PERCEPCIÓN Y RETENCIONES EFECTUADAS EN VENTAS (varios porcentajes)', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5

  ylinea = 10
  xlinea = 270
  xsplit = 15
  ylinea = ylinea + 5

  ylinea = ylinea + 5

  valores.push({ 'e': devuelveData(Data, '601'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '601', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5

  valores.push({ 'e': devuelveData(Data, '603'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '603', 'x': xlinea - xsplit, 'y': ylinea })

  ylinea = ylinea + 5
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '605'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '605', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '606'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '606', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '607'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '607', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '608'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '608', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '609'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '609', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '622'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '622', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '610'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '610', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '612'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '612', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '613'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '613', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '614'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '614', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  ylinea = ylinea + 5

  valores.push({ 'e': devuelveData(Data, '615'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '615', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '617'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '617', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '618'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '618', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '619'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '619', 'x': xlinea - xsplit, 'y': ylinea })

  ylinea = ylinea + 5
  ylinea = ylinea + 5

  valores.push({ 'e': devuelveData(Data, '620'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '620', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5

  valores.push({ 'e': devuelveData(Data, '699'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '699', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5



  for (x2 = 0; x2 < etiquetas.length; x2++) {
    doc.text(etiquetas[x2]['x'], etiquetas[x2]['y'], etiquetas[x2]['e'])
  }
  for (x2 = 0; x2 < valores.length; x2++) {
    doc.text(valores[x2]['x'], valores[x2]['y'], valores[x2]['e'], 'right')
  }
  ////////////////////////bloqu RESUMEN IMPOSITIVO

  ////////////////////////bloqu RETENCIONES
  doc.addPage('l')
  etiquetas = []
  valores = []

  ylinea = 10
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'AGENTE DE RETENCIÓN DEL IMPUESTO AL VALOR AGREGADO', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Retención del 10%', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Retención del 20%', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Retención del 30%', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Retención del 50%', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Retención del 70%', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Retención del 100%', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'TOTAL IMPUESTO RETENIDO', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'TOTAL IMPUESTO A PAGAR POR RETENCIÓN', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  ylinea = ylinea + 5
  ylinea = ylinea + 5

  etiquetas.push({ 'e': 'TOTAL CONSOLIDADO DE IMPUESTO AL VALOR AGREGADO', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5

  etiquetas.push({ 'e': 'VALORES A PAGAR (luego de imputación al pago en declaraciones sustitutivas)', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5

  etiquetas.push({ 'e': 'TOTAL IMPUESTO A PAGAR', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5




  valores = []

  ylinea = 10
  xlinea = 270
  xsplit = 15
  ylinea = ylinea + 5

  valores.push({ 'e': devuelveData(Data, '721'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '721', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '723'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '723', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '725'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '725', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '727'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '727', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '729'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '729', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '731'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '731', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '799'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '799', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '801'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '801', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5

  ylinea = ylinea + 5
  ylinea = ylinea + 5
  ylinea = ylinea + 5
  ylinea = ylinea + 5

  valores.push({ 'e': devuelveData(Data, '859'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '859', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5

  valores.push({ 'e': devuelveData(Data, '902'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '902', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5


  for (x2 = 0; x2 < etiquetas.length; x2++) {
    doc.text(etiquetas[x2]['x'], etiquetas[x2]['y'], etiquetas[x2]['e'])
  }
  for (x2 = 0; x2 < valores.length; x2++) {
    doc.text(valores[x2]['x'], valores[x2]['y'], valores[x2]['e'], 'right')
  }
  ////////////////////////bloqu RETENCIONES



  doc.save('SRI_104.pdf');


}

function Pdf_SRI_103(Data) {
  var doc = new jsPDF('l');
  doc.setFontSize(8);
  etiquetas = []

  ylinea = 10

  etiquetas.push({ 'e': 'Formulario 103 v:1.0.0', 'x': 10, 'y': 5 })

  ylinea = 10
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'POR PAGOS EFECTUADOS A RESIDENTES Y ESTABLECIMIENTOS PERMANENTES', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'En relación de dependencia que supera o no la base desgravada Servicios', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': '     Honorarios profesionales', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': '     Predomina el intelecto', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': '     Predomina la mano de obra', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': '     Utilización o aprovechamiento de la imagen o renombre', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': '     Publicidad y comunicación', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': '     Transporte privado de pasajeros o servicio público o privado de carga', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'A través de liquidaciones de compra (nivel cultural o rusticidad)', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Transferencia de bienes muebles de naturaleza corporal', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Compra de bienes de origen agrícola, avícola, pecuario, apícola, cunícula, bioacuático, forestal y carnes en estado natural', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Por regalías, derechos de autor, marcas, patentes y similares Arrendamiento', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Mercantil', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Bienes inmuebles', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Seguros y reaseguros (primas y cesiones)', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Rendimientos financieros', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Rendimientos financieros entre instituciones del sistema financiero y entidades economía popular y solidaria', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Pagos de bienes y servicios no sujetos a retención', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Ganancia en la enajenación de derechos representativos de capital u otros derechos que permitan la exploración, explotación, ', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'concesión o similares de sociedades, que se coticen en las bolsas de valores del Ecuador', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Contraprestación en la enajenación de derechos representativos de capital u otros derechos que permitan la exploración, explotación, concesión', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'o similares de sociedades, no cotizados en las bolsas de valores del Ecuador', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Loterías, rifas, apuestas y similares', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Venta de combustibles', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': '     A comercializadoras', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': '     A distribuidores', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Otras retenciones', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Aplicables el 1%', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Aplicables el 2%', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Aplicables el 2,75%', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Aplicables el 8%', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Aplicables a otros porcentajes', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Impuesto único a ingresos provenientes de actividades agropecuarias en etapa de producción / comercialización local o exportación', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'Otras autoretenciones', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'SUBTOTAL OPERACIONES EFECTUADAS EN EL PAÍS', 'x': 10, 'y': ylinea })

  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'TOTAL DE RETENCIÓN DE IMPUESTO A LA RENTA', 'x': 10, 'y': ylinea })
  ylinea = ylinea + 5
  etiquetas.push({ 'e': 'TOTAL IMPUESTO A PAGAR', 'x': 10, 'y': ylinea })




  valores = []

  ylinea = 10
  xlinea = 230

  xsplit = 15
  ylinea = ylinea + 5

  etiquetas.push({ 'e': 'Base Imponible', 'x': xlinea - (xsplit / 2), 'y': ylinea })
  ylinea = ylinea + 5

  valores.push({ 'e': devuelveData(Data, '302'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '302', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '303'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '303', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '304'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '304', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '307'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '307', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '308'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '308', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '309'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '309', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '310'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '310', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '311'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '311', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '312'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '312', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '3120'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '3120', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '314'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '314', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '319'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '319', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '320'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '320', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '320'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '322', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  
  valores.push({ 'e': devuelveData(Data, '322'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '323', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '324'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '324', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '332'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '332', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '333'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '333', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5  
  ylinea = ylinea + 5

  valores.push({ 'e': devuelveData(Data, '334'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '334', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '335'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '335', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '336'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '336', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '337'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '337', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '343'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '343', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '344'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '344', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '3440'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '3440', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '345'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '345', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '346'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '346', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '348'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '348', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '350'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '350', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '349'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '349', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  ylinea = ylinea + 5
  ylinea = ylinea + 5



  ylinea = 10
  xlinea = 270
  xsplit = 15
  ylinea = ylinea + 5

  etiquetas.push({ 'e': 'Valor Retenido', 'x': xlinea - (xsplit / 2), 'y': ylinea })
  ylinea = ylinea + 5

  valores.push({ 'e': devuelveData(Data, '352'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '352', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '353'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '353', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '354'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '354', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  
  valores.push({ 'e': devuelveData(Data, '357'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '357', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '358'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '358', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '359'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '359', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '360'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '360', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '361'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '361', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '362'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '362', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '3620'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '3620', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '364'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '364', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '369'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '369', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '370'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '370', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '372'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '372', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '373'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '373', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '374'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '374', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  ylinea = ylinea + 5
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '383'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '383', 'x': xlinea - xsplit, 'y': ylinea }) 
  ylinea = ylinea + 5
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '384'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '384', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '385'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '385', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '386'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '386', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '387'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '387', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '393'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '393', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '394'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '394', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '3940'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '3940', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '395'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '395', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '396'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '396', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '398'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '398', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '400'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '400', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '399'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '399', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '499'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '499', 'x': xlinea - xsplit, 'y': ylinea })
  ylinea = ylinea + 5
  valores.push({ 'e': devuelveData(Data, '902'), 'x': xlinea + xsplit, 'y': ylinea })
  etiquetas.push({ 'e': '902', 'x': xlinea - xsplit, 'y': ylinea })



  for (x2 = 0; x2 < etiquetas.length; x2++) {
    doc.text(etiquetas[x2]['x'], etiquetas[x2]['y'], etiquetas[x2]['e'])
  }
  for (x2 = 0; x2 < valores.length; x2++) {
    doc.text(valores[x2]['x'], valores[x2]['y'], valores[x2]['e'], 'right')
  }
  ////////////////////////bloqu TOTALES


  doc.save('SRI_103.pdf');
}

function abrir_SRI_104() {

  var sri_periodo = document.getElementById("fecha_sri_periodo_104").value
  var sri_anio = document.getElementById("fecha_sri_anio_104").value
  var fecha_completa = sri_anio + '-' + sri_periodo + '-01'

  $.ajax({
    type: 'POST',
    url: '/sri_104',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'fecha': fecha_completa },
    success: function (Response) {
      Pdf_SRI_104(Response['acumulado'])

    }
  });
}
function abrir_SRI_103() {

  var sri_periodo = document.getElementById("fecha_sri_periodo_103").value
  var sri_anio = document.getElementById("fecha_sri_anio_103").value
  var fecha_completa = sri_anio + '-' + sri_periodo + '-01'

  $.ajax({
    type: 'POST',
    url: '/sri_103',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'fecha': fecha_completa },
    success: function (Response) {
      Pdf_SRI_103(Response['acumulado'])

    }
  });
}

function abrir_SRI_mes() {


  var sri_periodo = document.getElementById("fecha_sri_periodo_mes").value
  var sri_anio = document.getElementById("fecha_sri_anio_mes").value
  var fecha_completa = sri_anio + '-' + sri_periodo + '-01'


  $.ajax({
    type: 'POST',
    url: '/traer_sri_ATS_mes',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 'fecha': fecha_completa },
    beforeSend: function () { },
    success: function (Response) {

      ats = Response['ats_valores']
      //--------------------ats XML
      xmltext = '<?xml version="1.0" encoding="UTF-8"?><iva>'

      xmltext = xmltext + '<TipoIDInformante>' + ats["cabecera"][0]["TipoIDInformante"] + '</TipoIDInformante>'
      xmltext = xmltext + '<IdInformante>' + ats["cabecera"][0]["IdInformante"] + '</IdInformante>'
      xmltext = xmltext + '<razonSocial>' + ats["cabecera"][0]["razonSocial"] + '</razonSocial>'
      xmltext = xmltext + '<Anio>' + sri_anio + '</Anio>'
      xmltext = xmltext + '<Mes>' + sri_periodo + '</Mes>'
      xmltext = xmltext + '<numEstabRuc>' + (1000 + ats["atsCountEstab"][0]["sumCodEstab"]).toString().substring(1) + '</numEstabRuc>'
      xmltext = xmltext + '<totalVentas>' + ats["atsSumEstab_sep_2016"][0]["sumaEstab"] + '</totalVentas>'
      xmltext = xmltext + '<codigoOperativo>' + ats["cabecera"][0]["codigoOperativo"] + '</codigoOperativo>'



      xmltext = xmltext + '<compras>'

      for (d1 = 0; d1 < ats["atmcompras"].length; d1++) {

        xmltext = xmltext + '<detalleCompras>'
        xmltext = xmltext + '<codSustento>' + ats["atmcompras"][d1]['codSustento'] + '</codSustento>'
        xmltext = xmltext + '<tpIdProv>' + ats["atmcompras"][d1]['tpIdProv'] + '</tpIdProv>'
        xmltext = xmltext + '<idProv>' + ats["atmcompras"][d1]['idProv'] + '</idProv>'
        xmltext = xmltext + '<tipoComprobante>' + ats["atmcompras"][d1]['tipoComprobante'] + '</tipoComprobante>'
        xmltext = xmltext + '<parteRel>' + ats["atmcompras"][d1]['parteRel'] + '</parteRel>'
        xmltext = xmltext + '<fechaRegistro>' + ats["atmcompras"][d1]['fechaRegistro'] + '</fechaRegistro>'
        xmltext = xmltext + '<establecimiento>' + ats["atmcompras"][d1]['establecimiento'] + '</establecimiento>'
        xmltext = xmltext + '<puntoEmision>' + ats["atmcompras"][d1]['puntoEmision'] + '</puntoEmision>'
        xmltext = xmltext + '<secuencial>' + ats["atmcompras"][d1]['secuencial'] + '</secuencial>'
        xmltext = xmltext + '<fechaEmision>' + ats["atmcompras"][d1]['fechaEmision'] + '</fechaEmision>'
        xmltext = xmltext + '<autorizacion>' + ats["atmcompras"][d1]['autorizacion'] + '</autorizacion>'
        xmltext = xmltext + '<baseNoGraIva>' + ats["atmcompras"][d1]['baseNoGraIva'] + '</baseNoGraIva>'
        xmltext = xmltext + '<baseImponible>' + ats["atmcompras"][d1]['baseImponible'] + '</baseImponible>'
        xmltext = xmltext + '<baseImpGrav>' + ats["atmcompras"][d1]['baseImpGrav'] + '</baseImpGrav>'
        xmltext = xmltext + '<baseImpExe>' + ats["atmcompras"][d1]['baseImpExe'] + '</baseImpExe>'
        xmltext = xmltext + '<montoIce>' + ats["atmcompras"][d1]['montoIce'] + '</montoIce>'
        xmltext = xmltext + '<montoIva>' + ats["atmcompras"][d1]['montoIva'] + '</montoIva>'
        xmltext = xmltext + '<valRetBien10>' + ats["atmcompras"][d1]['valRetBien10'] + '</valRetBien10>'
        xmltext = xmltext + '<valRetServ20>' + ats["atmcompras"][d1]['valRetServ20'] + '</valRetServ20>'
        xmltext = xmltext + '<valorRetBienes>' + ats["atmcompras"][d1]['valorRetBienes'] + '</valorRetBienes>'
        xmltext = xmltext + '<valRetServ50>' + ats["atmcompras"][d1]['valRetServ50'] + '</valRetServ50>'
        xmltext = xmltext + '<valorRetServicios>' + ats["atmcompras"][d1]['valorRetServicios'] + '</valorRetServicios>'
        xmltext = xmltext + '<valRetServ100>' + ats["atmcompras"][d1]['valRetServ100'] + '</valRetServ100>'
        xmltext = xmltext + '<totbasesImpReemb>' + ats["atmcompras"][d1]['totbasesImpReemb'] + '</totbasesImpReemb>'
        xmltext = xmltext + '<pagoExterior>'
        xmltext = xmltext + '<pagoLocExt>01</pagoLocExt>'
        xmltext = xmltext + '<paisEfecPago>NA</paisEfecPago>'
        xmltext = xmltext + '<aplicConvDobTrib>NA</aplicConvDobTrib>'
        xmltext = xmltext + '<pagExtSujRetNorLeg>NA</pagExtSujRetNorLeg>'
        xmltext = xmltext + '<pagoRegFis>NA</pagoRegFis>'
        xmltext = xmltext + '</pagoExterior>'

        if ((parseFloat(ats["atmcompras"][d1]['baseNoGraIva']) + parseFloat(ats["atmcompras"][d1]['baseImponible']) + parseFloat(ats["atmcompras"][d1]['baseImpGrav']) + parseFloat(ats["atmcompras"][d1]['montoIva']) + parseFloat(ats["atmcompras"][d1]['montoIce'])) >= 1000) {
          xmltext = xmltext + '<formasDePago>'
          xmltext = xmltext + '<formaPago>20</formaPago>'

          xmltext = xmltext + '</formasDePago>'
        }


        if (ats["atmcompras"][d1]['tipoComprobante'] == '04' || ats["atmcompras"][d1]['tipoComprobante'] == '05') {

          xmltext = xmltext + '<docModificado>' + ats["atmcompras"][d1]['docModificado'] + '</docModificado>'
          xmltext = xmltext + '<estabModificado>' + ats["atmcompras"][d1]['estabModificado'] + '</estabModificado>'
          xmltext = xmltext + '<ptoEmiModificado>' + ats["atmcompras"][d1]['ptoEmiModificado'] + '</ptoEmiModificado>'
          xmltext = xmltext + '<secModificado>' + ats["atmcompras"][d1]['secModificado'] + '</secModificado>'
          xmltext = xmltext + '<autModificado>' + ats["atmcompras"][d1]['autModificado'] + '</autModificado>'

        } else {

          xml_ret = '<air>'

          for (d2 = 0; d2 < ats["atmcompras_detalle_ret"].length; d2++) {
            if (ats["atmcompras_detalle_ret"][d2]["Pk"] == ats["atmcompras"][d1]['Pk']) {
              if (ats["atmcompras_detalle_ret"][d2]["codRetAir"] != '0') {
                if (ats["atmcompras_detalle_ret"][d2]["codRetAir"] != '1') {
                  if (ats["atmcompras_detalle_ret"][d2]["codRetAir"] != '2') {
                    xml_ret = xml_ret + '<detalleAir>'
                    xml_ret = xml_ret + '<codRetAir>' + ats["atmcompras_detalle_ret"][d2]["codRetAir"] + '</codRetAir>'
                    xml_ret = xml_ret + '<baseImpAir>' + ats["atmcompras_detalle_ret"][d2]["baseImpAir"] + '</baseImpAir>'
                    xml_ret = xml_ret + '<porcentajeAir>' + ats["atmcompras_detalle_ret"][d2]["porcentajeAir"] + '</porcentajeAir>'
                    xml_ret = xml_ret + '<valRetAir>' + ats["atmcompras_detalle_ret"][d2]["valRetAir"] + '</valRetAir>'
                    xml_ret = xml_ret + '</detalleAir>'
                  }
                }
              }
            }
          }

          if (xml_ret != '<air>') {
            xmltext = xmltext + xml_ret + '</air>'
          }

          if (parseFloat(ats["atmcompras"][d1]['secRetencion1']) > 0) {
            xmltext = xmltext + '<estabRetencion1>' + ats["atmcompras"][d1]['estabRetencion1'] + '</estabRetencion1>'
            xmltext = xmltext + '<ptoEmiRetencion1>' + ats["atmcompras"][d1]['ptoEmiRetencion1'] + '</ptoEmiRetencion1>'
            xmltext = xmltext + '<secRetencion1>' + ats["atmcompras"][d1]['secRetencion1'] + '</secRetencion1>'
            xmltext = xmltext + '<autRetencion1>' + ats["atmcompras"][d1]['autRetencion1'] + '</autRetencion1>'
            xmltext = xmltext + '<fechaEmiRet1>' + ats["atmcompras"][d1]['fechaEmiRet1'] + '</fechaEmiRet1>'
          }
        }
        xmltext = xmltext + '</detalleCompras>'

      }


      xmltext = xmltext + '</compras>'

      xmltext = xmltext + '<ventas>'

      for (d1 = 0; d1 < ats["atmventas_sep_2016"].length; d1++) {

        xmltext = xmltext + '<detalleVentas>'
        xmltext = xmltext + '<tpIdCliente>' + ats["atmventas_sep_2016"][d1]['tpIdCliente'] + '</tpIdCliente>'
        xmltext = xmltext + '<idCliente>' + ats["atmventas_sep_2016"][d1]['idCliente'] + '</idCliente>'

        if (ats["atmventas_sep_2016"][d1]['tpIdCliente'] != '07') {
          xmltext = xmltext + '<parteRelVtas>' + ats["atmventas_sep_2016"][d1]['parteRelVtas'] + '</parteRelVtas>'
        }
        if (ats["atmventas_sep_2016"][d1]['tpIdCliente'] == '06') {
          xmltext = xmltext + '<tipoCliente>02</tipoCliente>'
          xmltext = xmltext + '<denoCli>' + ats["atmventas_sep_2016"][d1]['CLIENTE'] + '</denoCli>'
        }
        xmltext = xmltext + '<tipoComprobante>' + ats["atmventas_sep_2016"][d1]['tipoComprobante'] + '</tipoComprobante>'
        xmltext = xmltext + '<tipoEmision>' + ats["atmventas_sep_2016"][d1]['tipoEmision'] + '</tipoEmision>'
        xmltext = xmltext + '<numeroComprobantes>' + ats["atmventas_sep_2016"][d1]['numeroComprobantes'] + '</numeroComprobantes>'
        xmltext = xmltext + '<baseNoGraIva>' + ats["atmventas_sep_2016"][d1]['baseNoGraIva'] + '</baseNoGraIva>'
        xmltext = xmltext + '<baseImponible>' + ats["atmventas_sep_2016"][d1]['baseImponible'] + '</baseImponible>'
        xmltext = xmltext + '<baseImpGrav>' + ats["atmventas_sep_2016"][d1]['baseImpGrav'] + '</baseImpGrav>'
        xmltext = xmltext + '<montoIva>' + ats["atmventas_sep_2016"][d1]['montoIva'] + '</montoIva>'

        if (parseFloat(ats["atmventas_sep_2016"][d1]['monto1']) > 0) {
          xmltext = xmltext + '<compensaciones><compensacion>'
          xmltext = xmltext + '<tipoCompe>' + ats["atmventas_sep_2016"][d1]['tipoCompe1'] + '</tipoCompe>'
          xmltext = xmltext + '<monto>' + ats["atmventas_sep_2016"][d1]['monto1'] + '</monto>'
          xmltext = xmltext + '</compensacion>'
          if (parseFloat(ats["atmventas_sep_2016"][d1]['monto2']) > 0) {
            xmltext = xmltext + '<compensacion>'
            xmltext = xmltext + '<tipoCompe>' + ats["atmventas_sep_2016"][d1]['tipoCompe2'] + '</tipoCompe>'
            xmltext = xmltext + '<monto>' + ats["atmventas_sep_2016"][d1]['monto2'] + '</monto>'
            xmltext = xmltext + '</compensacion>'
          }
          xmltext = xmltext + '</compensaciones>'
        }


        xmltext = xmltext + '<montoIce>' + ats["atmventas_sep_2016"][d1]['montoIce'] + '</montoIce>'
        xmltext = xmltext + '<valorRetIva>' + ats["atmventas_sep_2016"][d1]['valorRetIva'] + '</valorRetIva>'
        xmltext = xmltext + '<valorRetRenta>' + ats["atmventas_sep_2016"][d1]['valorRetRenta'] + '</valorRetRenta>'

        if (ats["atmventas_sep_2016"][d1]['tipoComprobante'] == "18") {
          xmltext = xmltext + '<formasDePago>'
          xmltext = xmltext + '<formaPago>20</formaPago>'
          xmltext = xmltext + '</formasDePago>'
        }
        xmltext = xmltext + '</detalleVentas>'
      }
      xmltext = xmltext + '</ventas>'


      xmltext = xmltext + '<ventasEstablecimiento>'
      for (d1 = 0; d1 < ats["ventasEstablecimiento_sep_2016"].length; d1++) {
        xmltext = xmltext + '<ventaEst>'
        xmltext = xmltext + '<codEstab>' + ats["ventasEstablecimiento_sep_2016"][d1]['codEstab'] + '</codEstab>'
        xmltext = xmltext + '<ventasEstab>' + ats["ventasEstablecimiento_sep_2016"][d1]['ventasEstab'] + '</ventasEstab>'
        xmltext = xmltext + '<ivaComp>' + ats["ventasEstablecimiento_sep_2016"][d1]['ivaComp'] + '</ivaComp>'
        xmltext = xmltext + '</ventaEst>'
      }
      xmltext = xmltext + '</ventasEstablecimiento>'


      if (ats["atmanuladas"].length > 0) {
        xmltext = xmltext + '<anulados>'
        for (d1 = 0; d1 < ats["atmanuladas"].length; d1++) {
          xmltext = xmltext + '<detalleAnulados>'
          xmltext = xmltext + '<tipoComprobante>' + ats["atmanuladas"][d1]['TipoComprobante'] + '</tipoComprobante>'
          xmltext = xmltext + '<establecimiento>' + ats["atmanuladas"][d1]['Establecimiento'] + '</establecimiento>'
          xmltext = xmltext + '<puntoEmision>' + ats["atmanuladas"][d1]['PuntoEmision'] + '</puntoEmision>'
          xmltext = xmltext + '<secuencialInicio>' + ats["atmanuladas"][d1]['Secuencialinicio'] + '</secuencialInicio>'
          xmltext = xmltext + '<secuencialFin>' + ats["atmanuladas"][d1]['Secuencialfin'] + '</secuencialFin>'
          xmltext = xmltext + '<autorizacion>' + ats["atmanuladas"][d1]['Autorizacion'] + '</autorizacion>'
          xmltext = xmltext + '</detalleAnulados>'
        }

        xmltext = xmltext + '</anulados>'
      }


      xmltext = xmltext + '</iva>'

      hacer_xml(xmltext, ("ats" + sri_anio + "-" + sri_periodo))
      //--------------------ats XML
    }
  });
}





function validarCedulaRuc(id) {
  valores = [0, 0, 0, 0, 0, 0, 0, 0, 0]
  //valores = id.split(/(?!$)/u);


  valores[0] = parseInt(id[0]) * 2
  if (valores[0] > 9) {
    valores[0] = valores[0] - 9
  }
  if (valores[0] > 9) {
    valores[0] = valores[0] - 9
  }
  valores[1] = parseInt(id[1]) * 1
  if (valores[1] > 9) {
    valores[1] = valores[1] - 9
  }
  valores[2] = parseInt(id[2]) * 2
  if (valores[2] > 9) {
    valores[2] = valores[2] - 9
  }
  valores[3] = parseInt(id[3]) * 1
  if (valores[3] > 9) {
    valores[3] = valores[3] - 9
  }
  valores[4] = parseInt(id[4]) * 2
  if (valores[4] > 9) {
    valores[4] = valores[4] - 9
  }
  valores[5] = parseInt(id[5]) * 1
  if (valores[5] > 9) {
    valores[5] = valores[5] - 9
  }
  valores[6] = parseInt(id[6]) * 2
  if (valores[6] > 9) {
    valores[6] = valores[6] - 9
  }
  valores[7] = parseInt(id[7]) * 1
  if (valores[7] > 9) {
    valores[7] = valores[7] - 9
  }
  valores[8] = parseInt(id[8]) * 2
  if (valores[8] > 9) {
    valores[8] = valores[8] - 9
  }

  valor_total = 0
  for (i = 0; i < 9; i++) {
    valor_total = valor_total + valores[i]
  }

  valor_cabecera = 0
  valor_cabecera = (parseInt(valor_total.toString().substr(0, 1)) + 1) * 10

  valor_cabecera = valor_cabecera - valor_total
  if (valor_cabecera == id[9]) {
    return true
  } else {
    if (valor_cabecera == 10 && id[9] == "0") {
      return true
    } else {
      return false
    }
  }
}

function cargar_sriData() {

  var fecha_sri_date = document.getElementById('edocs_fecha_sri_anio').value + '-' + document.getElementById('edocs_fecha_sri_mes').value + '-01'

  const files = document.getElementById('edocs_data_sri').files
  const formData = new FormData()
  formData.append('csrfmiddlewaretoken', web_token)
  formData.append('Id_empresa', web_Id_empresa)
  formData.append('id_archivo', 'data')
  formData.append('t_fecha', fecha_sri_date)
  formData.append('id_ruc', web_numeroRuc)

  var div_sri = document.getElementById('docs_sri_pen')
  div_sri.innerHTML = 'Cargando informaciÃ³n....'

  var div_sria = document.getElementById('docs_sri_ing')
  div_sria.innerHTML = 'Cargando informaciÃ³n....'

  if (files.length > 0) {
    var fr = new FileReader();
    fr.onload = function () {
      var lineas_ini = fr.result
      var lineas = lineas_ini.toString().split('\n')
      var json_lineas = {}
      for (q = 0; q < lineas.length; q++) {
        try {
          var indi = lineas[q].split('\t')
          json_tmp = {}




          if (indi[0] == 'Factura' || indi[0].replace('ï¿½', '') == 'Comprobante de Retencin' || indi[0] == 'Comprobante de Retenci�n' || indi[0].replace('ï¿½', '') == 'Notas de Crdito' || indi[0] == 'Notas de Cr�dito') {
            var numeros = indi[1].split("-")
            json_tmp['tipo'] = indi[0].replace('ï¿½', '').replace('�', '')
            json_tmp['estab'] = numeros[0]
            json_tmp['punto'] = numeros[1]
            json_tmp['numero'] = numeros[2]
            json_tmp['emisor_id'] = indi[2]

            if (indi[0] == 'Factura') {

              if (indi.length == 12) {
                json_tmp['valor'] = indi[11]
                json_tmp['emisor_razon'] = devolver_razon(indi[3])
                json_tmp['fecha'] = devolver_fecha(indi[4])
                json_tmp['recp_id'] = indi[8]
                json_tmp['autorizacion'] = indi[9]
                json_tmp['clave'] = indi[10]

              } else {
                json_tmp['valor'] = lineas[q + 1]
              }
              json_tmp['emisor_razon'] = devolver_razon(indi[3])
              json_tmp['fecha'] = devolver_fecha(indi[4])
              json_tmp['recp_id'] = indi[8]
              json_tmp['autorizacion'] = indi[9]
              json_tmp['clave'] = indi[10]

            } else {
              json_tmp['valor'] = 0
              if (indi.length == 11) {
                json_tmp['emisor_razon'] = devolver_razon(indi[3])
                json_tmp['fecha'] = devolver_fecha(indi[4])
                json_tmp['recp_id'] = indi[8]
                json_tmp['autorizacion'] = indi[9]
                json_tmp['clave'] = indi[10]
              } else {
                if (indi[11] == '') {
                  json_tmp['emisor_razon'] = devolver_razon(indi[3])
                  json_tmp['fecha'] = devolver_fecha(indi[4])
                  json_tmp['recp_id'] = indi[8]
                  json_tmp['autorizacion'] = indi[9]
                  json_tmp['clave'] = indi[10]

                } else {
                  json_tmp['emisor_razon'] = devolver_razon(indi[3] + ' ' + indi[4])
                  json_tmp['fecha'] = devolver_fecha(indi[5])
                  json_tmp['recp_id'] = indi[9]
                  json_tmp['autorizacion'] = indi[10]
                  json_tmp['clave'] = indi[11]

                }
              }
            }


            //json_lineas.push(json_tmp)
            if (json_tmp['recp_id'] == web_numeroRuc || (json_tmp['recp_id'] + '001') == web_numeroRuc) {
              json_lineas[json_tmp['clave']] = json_tmp
            }
          }
        } catch (error) { }
      }
      enviar_sri(json_lineas, 0)
    }
    fr.readAsText(files[0]);
  }
}
function sri_auto_envio_a_gid(t_pkmodulo) {
  var dd = document.getElementById('edocs_sri_auto_tabla')
  var fact_num = dd.children[0].children[0].childElementCount - 1

  var divv_adds = document.getElementById('sri_' + t_pkmodulo)
  var linea_base = ''
  for (d1 = 0; d1 < divv_adds.childElementCount; d1++) {
    linea_base = linea_base + '<td>' + divv_adds.children[d1].children[0].innerText + '$' + divv_adds.children[d1].children[1].children[0].value + '</td>'
    //traspasos[divv_adds.children[d1].children[1].children[0].id] = divv_adds.children[d1].children[1].children[0].value
  }



  for (d1 = dd.children[0].children[0].childElementCount - 1; d1 > 0; d1--) {
    fila = '<tr> <td></td>'
    fila = fila + '<td>' + dd.children[0].children[0].children[d1].children[1].innerText + '</td>'
    fila = fila + '<td>' + dd.children[0].children[0].children[d1].children[2].innerText + '</td>'
    fila = fila + '<td>' + dd.children[0].children[0].children[d1].children[3].innerText + '</td>'
    fila = fila + '<td>' + dd.children[0].children[0].children[d1].children[4].innerText + '</td>'
    fila = fila + '<td>' + dd.children[0].children[0].children[d1].children[5].innerText + '</td>'
    fila = fila + '<td>' + dd.children[0].children[0].children[d1].children[6].innerText + '</td>'
    fila = fila + '<td>' + dd.children[0].children[0].children[d1].children[7].innerText + '</td>'
    fila = fila + '<td>' + dd.children[0].children[0].children[d1].children[8].innerText + '</td>'
    fila = fila + linea_base + '</tr>'

    dd.children[0].children[0].children[d1].remove()
    $('#div_sri_preingreso tr:last').after(fila);

  }
  edocs_desmarcar_todo()

  document.getElementById('cerrar_default_sri_auto').click()
  document.getElementById('docs_sri_apr_link').click()
  if (esta_grbando_sri == 0) {
    esta_grbando_sri = 1
    sri_grabar_automatico_envio_parcial(t_pkmodulo, 1)
  }

}


function sri_grabar_automatico_envio_parcial(t_pkmodulo, t_linea) {

  var dd = document.getElementById('edocs_sri_auto_proceso')
  //dd.innerHTML = 'Guardando ' + t_linea + ' de ' + dict_claves.length

  var div_envio_edocs_listas = document.getElementById('div_sri_preingreso')

  if (t_linea < div_envio_edocs_listas.children[0].childElementCount) {
    if (div_envio_edocs_listas.children[0].children[t_linea].children[0].innerText != 'Ingresado') {

      t_dict_claves = div_envio_edocs_listas.children[0].children[t_linea].children[8].innerText
      t_traspasos = {}
      //if(div_envio_edocs_listas.children[0].children[t_linea].children.length > 9){
      //  for (d1 = 9; d1 < div_envio_edocs_listas.children[0].children[0].childElementCount; d1++) {
      //    t_traspasos[div_envio_edocs_listas.children[0].children[0].children[d1].innerText] = div_envio_edocs_listas.children[0].children[t_linea].children[d1].innerText
      //  }
      //}

      var divv_adds = document.getElementById('sri_' + t_pkmodulo)
      var linea_base = ''
      if (div_envio_edocs_listas.children[0].children[t_linea].children.length > 9) {
        for (d1 = 0; d1 < divv_adds.childElementCount; d1++) {
          t_traspasos[divv_adds.children[d1].children[1].children[0].id] = divv_adds.children[d1].children[1].children[0].value

        }
      }

      $.ajax({
        type: 'POST',
        url: '/grabar_automatico',
        data: { 'fuente': $(this).attr("value"), 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 't_pkmodulo': t_pkmodulo, 'dict_claves': JSON.stringify([t_dict_claves]), 'dict_traspasos': JSON.stringify(t_traspasos) },
        success: function (Response) {
          var div_envio_edocs_listas = document.getElementById('div_sri_preingreso')

          if (Response['Errores'].length > 0) {
            var div_envio_edocs_listas = document.getElementById('div_sri_preingreso')
            div_envio_edocs_listas.children[0].children[t_linea].children[0].innerText = 'Error(' + Response['Errores'][0] + ' ' + Response['msg'][0] + '), '
            //div_envio_edocs_listas.children[0].children[t_linea].children[0].innerText ='Error'

          }
          if (Response['buenas'].length > 0) {
            div_envio_edocs_listas.children[0].children[t_linea].children[0].innerText = 'Ingresado'
          }
          sri_grabar_automatico_envio_parcial(t_pkmodulo, t_linea + 1)
        },
        error: function (xhr, status, error) {
          if (xhr.statusText == 'Bad Gateway') {
            var div_envio_edocs_listas = document.getElementById('div_sri_preingreso')
            div_envio_edocs_listas.children[0].children[t_linea].children[0].innerText = 'Sri No Responde'
            sri_grabar_automatico_envio_parcial(t_pkmodulo, t_linea + 1)

          } else {
            try {
              var err = eval("(" + xhr.responseText + ")");
              var div_envio_edocs_listas = document.getElementById('div_sri_preingreso')
              div_envio_edocs_listas.children[0].children[t_linea].children[0].innerText = err.Message
              sri_grabar_automatico_envio_parcial(t_pkmodulo, t_linea + 1)

            } catch (error) {
              var err = xhr.responseText.replace(/</g, '').replace(/>/g, '')
              var div_envio_edocs_listas = document.getElementById('div_sri_preingreso')
              div_envio_edocs_listas.children[0].children[t_linea].children[0].innerText = err.Message
              sri_grabar_automatico_envio_parcial(t_pkmodulo, t_linea + 1)

            }

          }
        }
      });
    }
  } else {
    //mira si hay errores
    for (d1 = div_envio_edocs_listas.children[0].childElementCount - 1; d1 > 0; d1--) {
      if (div_envio_edocs_listas.children[0].children[d1].children[0].innerText = 'Ingresado') {
        div_envio_edocs_listas.children[0].children[d1].remove()
      }
    }
    if (div_envio_edocs_listas.children[0].childElementCount > 1) {
      sri_grabar_automatico_envio_parcial(t_pkmodulo, 1)
    } else {
      actualizar_sri_docs()
      esta_grbando_sri = 0
    }
  }


}


function actualizar_sri_docs() {
  var dd = document.getElementById('edocs_sri_auto_tabla')
  for (d1 = dd.children[0].children[0].childElementCount - 1; d1 > 0; d1--) {
    dd.children[0].children[0].children[d1].remove()
  }

  var fecha_sri = document.getElementById('edocs_fecha_sri_anio').value + '-' + document.getElementById('edocs_fecha_sri_mes').value + '-01'

  var fecha_sri = document.getElementById('edocs_fecha_sri_anio').value + '-' + document.getElementById('edocs_fecha_sri_mes').value + '-01'

  var filtro_sri = document.getElementById('edocs_filtro_sri').value
  var docu_sri = document.getElementById('edocs_docu_sri').value


  var div_sri = document.getElementById('docs_sri_pen')
  div_sri.innerHTML = 'Cargando informaciÃ³n....'



  var div_sria = document.getElementById('docs_sri_ing')
  div_sria.innerHTML = 'Cargando informaciÃ³n....'



  $.ajax({
    type: 'POST',
    url: '/edocs_sri',
    data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma, 't_fecha': fecha_sri, 't_filtro': filtro_sri, 't_orden': document.getElementById('edocs_tipo_sri').value, 't_docu': document.getElementById('edocs_docu_sri').value }, // H:i:s
    success: function (Response) {

      Listado_sri = Response

      ht = '<table class="table table-bordered" style="background: white;">'

      ht = ht + '<thead><tr>'
      ht = ht + '<th style="text-align: center;"><input type="checkbox" onclick="edocs_traer_todo(this)"> <label> Marcar Todos</label></th>'
      ht = ht + '<th style="text-align: center;vertical-align: inherit;">Grabar Como</th>'
      ht = ht + '<th style="text-align: center;vertical-align: inherit;">Comprobante</th>'
      ht = ht + '<th style="text-align: center;vertical-align: inherit;">Numero</th>'
      ht = ht + '<th style="text-align: center;vertical-align: inherit;">Ruc</th>'
      ht = ht + '<th style="text-align: center;vertical-align: inherit;">Razon Social</th>'
      ht = ht + '<th style="text-align: center;vertical-align: inherit;">Fecha</th>'
      ht = ht + '<th style="text-align: center;vertical-align: inherit;">Total</th>'
      //ht = ht +'<th>Estado</th>'
      ht = ht + '<th style="text-align: center;vertical-align: inherit;">Archivos</th>'
      ht = ht + '<th style="text-align: center;vertical-align: inherit;">Descartar</th>'

      ht = ht + '<th style="text-align: center;vertical-align: inherit;">Clave</th>'
      ht = ht + '</tr></thead><tbody>'


      lineas_pendiente = ''
      lineas_ingresadas = ''
      lineas_aprobadas = ''
      lineas_descartas = ''

      lineas = ''

      for (q = 0; q < Response["registros_pend"].length; q++) {
        tipo_int = ''
        tipo_web = ''
        if (Response["registros_pend"][q]['COMPROBANTE'] == 'Factura') {
          tipo_int = 'Facturas'
          tipo_web = 'Facturas'
        }
        if (Response["registros_pend"][q]['COMPROBANTE'] == 'Comprobante de Retencion') {
          tipo_int = 'Retenciones'
          tipo_web = 'Retenciones'
        }
        if (Response["registros_pend"][q]['COMPROBANTE'] == 'Notas de Credito') {
          tipo_int = 'Credito'
          tipo_web = 'Credito'
        }
        lineas = '<tr id="edcos_' + Response["registros_pend"][q]['pkid'] + '">'
        lineas = lineas + '<td  style="text-align: center;">'
        if (Response["registros_pend"][q]['TIPO_EMISION'] == 0) {
          if (Response["registros_pend"][q]['Estado'] == 'Pendiente') {
            lineas = lineas + '<input type="checkbox" id="fact_' + Response["registros_pend"][q]['pkid'] + '" onclick="edocs_sri_auto(edcos_' + Response["registros_pend"][q]['pkid'] + ', this)">'
          }
        }
        lineas = lineas + '</td>'
        lineas = lineas + '<td>'
        if (Response["registros_pend"][q]['TIPO_EMISION'] == 0) {
          if (Response["registros_pend"][q]['Estado'] == 'Pendiente') {
            for (var i = 0; i < Response['enlaces'].length; i++) {
              if (Response['enlaces'][i]['tipo'] == Response["registros_pend"][q]['COMPROBANTE']) {
                lineas = lineas + '<button class="btn bg-blue btn-flat margin" onclick="registro(' + Response['enlaces'][i]['pkmodulo'] + ', 0, 0, -2, 0, \'' + Response["registros_pend"][q]['CLAVE_ACCESO'].replace("\r", "") + '\')" style="margin-bottom: 3px;padding-top: 0px;width: 100%;padding-bottom: 0px;margin-top: 3px;">' + Response['enlaces'][i]['nombre'] + '</button>'
              }
            }
          }
        }
        if (Response["registros_pend"][q]['TIPO_EMISION'] == 2) {
          for (var i = 0; i < Response['enlaces'].length; i++) {
            if (Response['enlaces'][i]['tipo'] == Response["registros_pend"][q]['COMPROBANTE']) {
              lineas = lineas + '<button class="btn bg-blue btn-flat margin" onclick="registro(' + Response['enlaces'][i]['pkmodulo'] + ', 0, 0, -2, 0, \'' + Response["registros_pend"][q]['CLAVE_ACCESO'] + '\')" style="margin-bottom: 3px;padding-top: 0px;width: 100%;padding-bottom: 0px;margin-top: 3px;">' + Response['enlaces'][i]['nombre'] + '</button>'
            }
          }
        }
        lineas = lineas + '</td>'
        lineas = lineas + '<td>' + Response["registros_pend"][q]['COMPROBANTE'] + '</td>'
        lineas = lineas + '<td>' + Response["registros_pend"][q]['SERIE_COMPROBANTE'] + '</td>'
        lineas = lineas + '<td>' + Response["registros_pend"][q]['RUC_EMISOR'] + '</td>'
        lineas = lineas + '<td>' + Response["registros_pend"][q]['RAZON_SOCIAL_EMISOR'] + '</td>'
        lineas = lineas + '<td>' + Response["registros_pend"][q]['FECHA_EMISION'] + '</td>'
        lineas = lineas + '<td style="text-align: right;">' + Response["registros_pend"][q]['IMPORTE_TOTAL'] + '</td>'
        //lineas =lineas + '<td>' + Response["registros"][q]['Estado'] + '</td>'
        lineas = lineas + '<td style="text-align: center;"><a href="/e_docs/' + tipo_int + '/' + Response["registros_pend"][q]['CLAVE_ACCESO'] + '/" target="_blank">Ver</a></td>'
        lineas = lineas + '<td style="text-align: center;">'
        if (Response["registros_pend"][q]['TIPO_EMISION'] != 1) {
          if (Response["registros_pend"][q]['Estado'] == 'Pendiente') {
            lineas = lineas + '<a class="btn btn-danger" onclick="eliminaredocs(' + Response["registros_pend"][q]['pkid'] + ',1)" style="padding: 2px 2px; margin-right: 0px; margin-left: 0px;"><span class="glyphicon glyphicon-remove-circle" aria-hidden="true"></span></a>'
          }
        }
        lineas = lineas + '</td>'
        lineas = lineas + '<td>' + Response["registros_pend"][q]['CLAVE_ACCESO'] + '</td>'
        lineas = lineas + '</tr>'
        if (Response["registros_pend"][q]['TIPO_EMISION'] == '0') {
          if (Response["registros_pend"][q]['Estado'] == 'Pendiente') {
            lineas_pendiente = lineas_pendiente + lineas
          } else {
            lineas_ingresadas = lineas_ingresadas + lineas
          }
        }
        if (Response["registros_pend"][q]['TIPO_EMISION'] == '1') {
          lineas_descartas = lineas_descartas + lineas
        }
        if (Response["registros_pend"][q]['TIPO_EMISION'] == '2') {
          lineas_aprobadas = lineas_aprobadas + lineas
        }
      }



      for (q = 0; q < Response["registros_ingre"].length; q++) {
        tipo_int = ''
        tipo_web = ''
        if (Response["registros_ingre"][q]['COMPROBANTE'] == 'Factura') {
          tipo_int = 'Facturas'
          tipo_web = 'Facturas'
        }
        if (Response["registros_ingre"][q]['COMPROBANTE'] == 'Comprobante de Retencion') {
          tipo_int = 'Retenciones'
          tipo_web = 'Retenciones'
        }
        if (Response["registros_ingre"][q]['COMPROBANTE'] == 'Notas de Credito') {
          tipo_int = 'Credito'
          tipo_web = 'Credito'
        }
        lineas = '<tr id="edcos_' + Response["registros_ingre"][q]['pkid'] + '">'
        lineas = lineas + '<td  style="text-align: center;">'
        if (Response["registros_ingre"][q]['TIPO_EMISION'] == 0) {
          if (Response["registros_ingre"][q]['Estado'] == 'Pendiente') {
            lineas = lineas + '<input type="checkbox" id="fact_' + Response["registros_ingre"][q]['pkid'] + '" onclick="edocs_sri_auto(edcos_' + Response["registros_ingre"][q]['pkid'] + ', this)">'
          }
        }
        lineas = lineas + '</td>'
        lineas = lineas + '<td>'
        if (Response["registros_ingre"][q]['TIPO_EMISION'] == 0) {
          if (Response["registros_ingre"][q]['Estado'] == 'Pendiente') {
            for (var i = 0; i < Response['enlaces'].length; i++) {
              lineas = lineas + '<button class="btn bg-blue btn-flat margin" onclick="registro(' + Response['enlaces'][i]['pkmodulo'] + ', 0, 0, -2, 0, \'' + Response["registros_ingre"][q]['CLAVE_ACCESO'].replace("\r", "") + '\')" style="margin-bottom: 3px;padding-top: 0px;width: 100%;padding-bottom: 0px;margin-top: 3px;">' + Response['enlaces'][i]['nombre'] + '</button>'
            }
          }
        }
        if (Response["registros_ingre"][q]['TIPO_EMISION'] == 2) {
          for (var i = 0; i < Response['enlaces'].length; i++) {
            lineas = lineas + '<button class="btn bg-blue btn-flat margin" onclick="registro(' + Response['enlaces'][i]['pkmodulo'] + ', 0, 0, -2, 0, \'' + Response["registros_ingre"][q]['CLAVE_ACCESO'] + '\')" style="margin-bottom: 3px;padding-top: 0px;width: 100%;padding-bottom: 0px;margin-top: 3px;">' + Response['enlaces'][i]['nombre'] + '</button>'
          }
        }
        lineas = lineas + '</td>'
        lineas = lineas + '<td>' + Response["registros_ingre"][q]['COMPROBANTE'] + '</td>'
        lineas = lineas + '<td>' + Response["registros_ingre"][q]['SERIE_COMPROBANTE'] + '</td>'
        lineas = lineas + '<td>' + Response["registros_ingre"][q]['RUC_EMISOR'] + '</td>'
        lineas = lineas + '<td>' + Response["registros_ingre"][q]['RAZON_SOCIAL_EMISOR'] + '</td>'
        lineas = lineas + '<td>' + Response["registros_ingre"][q]['FECHA_EMISION'] + '</td>'
        lineas = lineas + '<td style="text-align: right;">' + Response["registros_ingre"][q]['IMPORTE_TOTAL'] + '</td>'
        //lineas =lineas + '<td>' + Response["registros"][q]['Estado'] + '</td>'
        lineas = lineas + '<td style="text-align: center;"><a href="/e_docs/' + tipo_int + '/' + Response["registros_ingre"][q]['CLAVE_ACCESO'] + '/" target="_blank">Ver</a></td>'
        lineas = lineas + '<td style="text-align: center;">'
        if (Response["registros_ingre"][q]['TIPO_EMISION'] != 1) {
          if (Response["registros_ingre"][q]['Estado'] == 'Pendiente') {
            lineas = lineas + '<a class="btn btn-danger" onclick="eliminaredocs(' + Response["registros_ingre"][q]['pkid'] + ',1)" style="padding: 2px 2px; margin-right: 0px; margin-left: 0px;"><span class="glyphicon glyphicon-remove-circle" aria-hidden="true"></span></a>'
          }
        }
        lineas = lineas + '</td>'
        lineas = lineas + '<td>' + Response["registros_ingre"][q]['CLAVE_ACCESO'] + '</td>'
        lineas = lineas + '</tr>'
        if (Response["registros_ingre"][q]['TIPO_EMISION'] == 0) {
          if (Response["registros_ingre"][q]['Estado'] == 'Pendiente') {
            lineas_pendiente = lineas_pendiente + lineas
          } else {
            lineas_ingresadas = lineas_ingresadas + lineas
          }
        }
        if (Response["registros_ingre"][q]['TIPO_EMISION'] == 1) {
          lineas_descartas = lineas_descartas + lineas
        }
        if (Response["registros_ingre"][q]['TIPO_EMISION'] == 2) {
          lineas_aprobadas = lineas_aprobadas + lineas
        }
      }



      for (q = 0; q < Response["registros_recha"].length; q++) {
        tipo_int = ''
        tipo_web = ''
        if (Response["registros_recha"][q]['COMPROBANTE'] == 'Factura') {
          tipo_int = 'Facturas'
          tipo_web = 'Facturas'
        }
        if (Response["registros_recha"][q]['COMPROBANTE'] == 'Comprobante de Retencion') {
          tipo_int = 'Retenciones'
          tipo_web = 'Retenciones'
        }
        if (Response["registros_recha"][q]['COMPROBANTE'] == 'Notas de Credito') {
          tipo_int = 'Credito'
          tipo_web = 'Credito'
        }
        lineas = '<tr id="edcos_' + Response["registros_recha"][q]['pkid'] + '">'
        lineas = lineas + '<td  style="text-align: center;">'
        if (Response["registros_recha"][q]['TIPO_EMISION'] == 0) {
          if (Response["registros_recha"][q]['Estado'] == 'Pendiente') {
            lineas = lineas + '<input type="checkbox" id="fact_' + Response["registros_recha"][q]['pkid'] + '" onclick="edocs_sri_auto(edcos_' + Response["registros_recha"][q]['pkid'] + ', this)">'
          }
        }
        lineas = lineas + '</td>'
        lineas = lineas + '<td>'
        if (Response["registros_recha"][q]['TIPO_EMISION'] == 0) {
          if (Response["registros_recha"][q]['Estado'] == 'Pendiente') {
            for (var i = 0; i < Response['enlaces'].length; i++) {
              lineas = lineas + '<button class="btn bg-blue btn-flat margin" onclick="registro(' + Response['enlaces'][i]['pkmodulo'] + ', 0, 0, -2, 0, \'' + Response["registros_recha"][q]['CLAVE_ACCESO'].replace("\r", "") + '\')" style="margin-bottom: 3px;padding-top: 0px;width: 100%;padding-bottom: 0px;margin-top: 3px;">' + Response['enlaces'][i]['nombre'] + '</button>'
            }
          }
        }
        if (Response["registros_recha"][q]['TIPO_EMISION'] == 1) {
          if (Response["registros_recha"][q]['Estado'] == 'Pendiente') {
            lineas = lineas + '<a class="btn btn-info" onclick="eliminaredocs(' + Response["registros_recha"][q]['pkid'] + ',0)" style="padding: 2px 2px; margin-right: 0px; margin-left: 0px;"><span class="glyphicon glyphicon-refresh" aria-hidden="true"></span></a>'

          }
        }
        if (Response["registros_recha"][q]['TIPO_EMISION'] == 2) {
          for (var i = 0; i < Response['enlaces'].length; i++) {
            lineas = lineas + '<button class="btn bg-blue btn-flat margin" onclick="registro(' + Response['enlaces'][i]['pkmodulo'] + ', 0, 0, -2, 0, \'' + Response["registros_recha"][q]['CLAVE_ACCESO'] + '\')" style="margin-bottom: 3px;padding-top: 0px;width: 100%;padding-bottom: 0px;margin-top: 3px;">' + Response['enlaces'][i]['nombre'] + '</button>'
          }
        }
        lineas = lineas + '</td>'
        lineas = lineas + '<td>' + Response["registros_recha"][q]['COMPROBANTE'] + '</td>'
        lineas = lineas + '<td>' + Response["registros_recha"][q]['SERIE_COMPROBANTE'] + '</td>'
        lineas = lineas + '<td>' + Response["registros_recha"][q]['RUC_EMISOR'] + '</td>'
        lineas = lineas + '<td>' + Response["registros_recha"][q]['RAZON_SOCIAL_EMISOR'] + '</td>'
        lineas = lineas + '<td>' + Response["registros_recha"][q]['FECHA_EMISION'] + '</td>'
        lineas = lineas + '<td style="text-align: right;">' + Response["registros_recha"][q]['IMPORTE_TOTAL'] + '</td>'
        //lineas =lineas + '<td>' + Response["registros"][q]['Estado'] + '</td>'
        lineas = lineas + '<td style="text-align: center;"><a href="/e_docs/' + tipo_int + '/' + Response["registros_recha"][q]['CLAVE_ACCESO'] + '/" target="_blank">Ver</a></td>'
        lineas = lineas + '<td style="text-align: center;">'
        if (Response["registros_recha"][q]['TIPO_EMISION'] != 1) {
          if (Response["registros_recha"][q]['Estado'] == 'Pendiente') {
            lineas = lineas + '<a class="btn btn-danger" onclick="eliminaredocs(' + Response["registros_recha"][q]['pkid'] + ',1)" style="padding: 2px 2px; margin-right: 0px; margin-left: 0px;"><span class="glyphicon glyphicon-remove-circle" aria-hidden="true"></span></a>'
          }
        }
        lineas = lineas + '</td>'
        lineas = lineas + '<td>' + Response["registros_recha"][q]['CLAVE_ACCESO'] + '</td>'
        lineas = lineas + '</tr>'
        if (Response["registros_recha"][q]['TIPO_EMISION'] == '0') {
          if (Response["registros_recha"][q]['Estado'] == 'Pendiente') {
            lineas_pendiente = lineas_pendiente + lineas
          } else {
            lineas_ingresadas = lineas_ingresadas + lineas
          }
        }
        if (Response["registros_recha"][q]['TIPO_EMISION'] == '1') {
          lineas_descartas = lineas_descartas + lineas
        }
        if (Response["registros_recha"][q]['TIPO_EMISION'] == '2') {
          lineas_aprobadas = lineas_aprobadas + lineas
        }
      }




      var div_sri = document.getElementById('docs_sri_pen')
      div_sri.innerHTML = ht + lineas_pendiente + '</tbody></table>'



      var div_sria = document.getElementById('docs_sri_ing')
      div_sria.innerHTML = ht + lineas_ingresadas + '</tbody></table>'

      //var div_sria = document.getElementById('docs_sri_apr')
      //div_sria.innerHTML = ht + lineas_aprobadas + '</tbody></table>'

      var div_sria = document.getElementById('docs_sri_rec')
      div_sria.innerHTML = ht + lineas_descartas + '</tbody></table>'

    }
  });

}