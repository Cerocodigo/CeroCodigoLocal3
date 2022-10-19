

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