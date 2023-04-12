
var canvas, ctx, flag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
    dot_flag = false;


function randomStr(len, arr) {
    var ans = '';
    for (var i = len; i > 0; i--) {
        ans += 
            arr[Math.floor(Math.random() * arr.length)];
    }
    return ans;
}


function Subir_dibujo(dibujo, div_imagen, Filename ) {



    const formData = new FormData()
    formData.append('csrfmiddlewaretoken', web_token)
    formData.append('Id_empresa', web_Id_empresa)
    formData.append('id_archivo', Filename)

    formData.append('files', dibujo)

    //formData.append("files", dibujo, Filename);

    let headers = new Headers();


    headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1'); 
    headers.append('Access-Control-Allow-Methods', 'POST'); 
    headers.append('Access-Control-Allow-Credentials', 'true');
    headers.append('Access-Control-Allow-Headers', 'Content-Type');

    // })
    //fetch('http://127.0.0.1:8000/ccimagenes_post/', { method: 'POST', headers: headers, body: formData, mode: 'no-cors',}).then(response => {
    fetch('/ccimagenes_post/', { method: 'POST', headers: headers, body: formData, mode: 'no-cors',}).then(response => {

      console.log(response)
    //div_imagen.src = 'http://127.0.0.1:8000/media/archivos/' + web_Id_empresa + '/' + Filename
    div_imagen.src = '/media/archivos/' + web_Id_empresa + '/' + Filename


    })
    
  }

function Grabar_firma(canvas_envio, div_imagen) {
    Filename = 'i'+ randomStr(20, '12345abcde');
    var img_canvas = canvas_envio.toDataURL();
    // Convert Base64 image to binary
    div_imagen.src = img_canvas;
    div_imagen.value = Filename + '.png';

    div_imagen.display = "inline";

    var file = dataURItoBlob(img_canvas);

    Subir_dibujo(file, div_imagen, Filename + '.png')

}
function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {type:mimeString});
}


function Iniciar_firma(canvas_envio) {
    canvas = canvas_envio
    ctx = canvas.getContext("2d");
    
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas_envio.width, canvas_envio.height);
    ctx.fillStyle = "#000000";

    canvas.addEventListener("mousemove", function (e) {
        findxy('move', e, canvas)
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        findxy('down', e, canvas)
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        findxy('up', e, canvas)
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        findxy('out', e, canvas)
    }, false);
}


function draw() {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
}

function Limpiar_firma(canvas_envio) {
    ctx.clearRect(0, 0, canvas_envio.width, canvas_envio.height);
    //document.getElementById("canvasimg").style.display = "none";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas_envio.width, canvas_envio.height);
    ctx.fillStyle = "#000000";

}






function findxy(res, e, canvas) {
    if (res == 'down') {
        prevX = currX;
        prevY = currY;
        var rect = canvas.getBoundingClientRect();


        currX = e.clientX - rect.left
        currY = e.clientY - rect.top



        flag = true;
        dot_flag = true;
        if (dot_flag) {
            ctx.beginPath();
            ctx.fillStyle = x;
            ctx.fillRect(currX, currY, 2, 2);
            ctx.closePath();
            dot_flag = false;
        }
    }
    if (res == 'up' || res == "out") {
        flag = false;
    }
    if (res == 'move') {
        if (flag) {
            prevX = currX;
            prevY = currY;
            var rect = canvas.getBoundingClientRect();

            currX = e.clientX - rect.left
            currY = e.clientY - rect.top
    
            draw();
        }
    }
}