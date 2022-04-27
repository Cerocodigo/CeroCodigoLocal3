

function getBase64Image(img, t_w, t_h) {
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = t_w;
    canvas.height = t_h;
    //canvas.width = img.width;
    //canvas.height = img.height;
    //img.crossOrigin = 'https://www.cerocodigo/media/archivos/mega/golum.jpg';
    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    //ctx.drawImage(img, 0, 0);
    try {
        ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, canvas.width, canvas.height);
        // Get the data-URL formatted image
        // Firefox supports PNG and JPEG. You could check img.src to
        // guess the original format, but be aware the using "image/jpg"
        // will re-encode the image.
        var dataURL = canvas.toDataURL("image/png");
        return dataURL
        //return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    }
    catch (error) {
      console.error(error);
      return 0
      // expected output: ReferenceError: nonExistentFunction is not defined
      // Note - error messages will vary depending on browser
    }
  
  
  }
  


function tarer_pero_media(){

    var settings = {
              'cache': false,
              'dataType': "jsonp",
              "async": true,
              "crossDomain": true,
              "url": 'https://www.cerocodigo/'+web_Id_empresa+'/mediaPeso',
              "method": "GET",
              "headers": {
                  "accept": "application/json",
                  "Access-Control-Allow-Origin":"*"
              }
          }

    somejson = {'0':0}
    $.ajax(settings).done(function (response) {
        console.log(response);

    });
}


function tarer_pero_mediaaaaa(){
    let headerss = new Headers();

    headerss.append('Access-Control-Allow-Origin', '*'); 
    headerss.append('Access-Control-Allow-Methods', 'GET'); 
    headerss.append('Access-Control-Allow-Credentials', 'true');
    headerss.append('Access-Control-Allow-Headers', 'Content-Type');
    headerss.append('accept', 'application/json');


    $.ajax({
        type: 'POST',
        url: 'https://www.cerocodigo/'+web_Id_empresa+'/mediaPeso',
        headers: headerss, 
        mode: 'no-cors',
        crossDomain: true,
        data: { 'csrfmiddlewaretoken': web_token, 'Id_empresa': web_Id_empresa, 'usuario': web_usuario, 'idioma': web_idioma},
        success: function (Response) {
            ddiv_pagos = document.getElementById('div_peso_media')
            if( response['peso']['pocen']<= 0.5){
                ddiv_pagos.style.background = 'green'
            }else{
                if( response['peso']['pocen'] >= 0.8){
                    ddiv_pagos.style.background = 'red'
                }else{
                    ddiv_pagos.style.background = 'yellow'
                }
            }
            ddiv_pagos.innerHTML = 'Media: ' + response['peso']['usado'] + ' de ' + response['peso']['max'] + ' Gb'  
          
  
        }
    });
} 

async function tarer_pero_media22(){
    
    let headers = new Headers();

    headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1'); 
    headers.append('Access-Control-Allow-Methods', 'GET'); 
    headers.append('Access-Control-Allow-Credentials', 'true');
    headers.append('Access-Control-Allow-Headers', 'Content-Type');

    let response = await fetch('https://www.cerocodigo/'+web_Id_empresa+'/mediaPeso', { method: 'GET', headers: headers, mode: 'no-cors',});

    console.log(response.status); // 200
    console.log(response.statusText); // OK

    if (response.status === 200) {
        let data = await response.text();
        // handle data
    }
    
    
} 
