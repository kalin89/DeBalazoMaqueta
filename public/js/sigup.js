$(document).ready(function () {
    var config = {
        apiKey: "AIzaSyBptaEvoSSM9AlVCN0CYSD4j1ZaVMHqgw4",
        authDomain: "debalazo-maqueta.firebaseapp.com",
        databaseURL: "https://debalazo-maqueta.firebaseio.com",
        projectId: "debalazo-maqueta",
        storageBucket: "debalazo-maqueta.appspot.com",
        messagingSenderId: "269078144715"
    };
    firebase.initializeApp(config);
    var db = firebase.firestore();

    $("#cp").keyup(function () {
        let letras = this.value.length;
        if (letras == 5) {
            var cp = this.value;
            var docRef = db.collection("colonias").doc(cp);

            docRef.get().then(function (doc) {
                if (doc.exists) {
                    $("#colonia").empty();
                    $("#colonia").append('<option value="" hidden disabled selected>SELECCIONE COLONIA</option>');
                    for (let k in doc.data().colonias) {
                        $("#colonia").append(new Option(doc.data().colonias[k], doc.data().colonias[k]));
                    }
                    $('#ciudad').val(doc.data().ciudad);
                    $('#estado').val(doc.data().estado);
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch(function (error) {
                $("#colonia").empty();
                $("#colonia").append('<option value="" hidden disabled selected>CODIGO POSTAL ERRONEO</option>');
            });
        } else {
            $(".clear").val("");
            $('#colonia').empty();
            $("#colonia").append('<option value="" hidden disabled selected>INGRESE CP VALIDO</option>');
        }
    });

    function CargarTiposRes() {
    db.collection("giro").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            $("#giroComercio").append(new Option(doc.data().giro, doc.data().giro));
        });
    });
    let giro = $('#giroComercio').val();

}

CargarTiposRes();

$('#registrar').click(function(){
    let errores = validarFormulario();
    if(errores.length > 0){
        for(let error in errores){
           let alerta = `
           <div class="alert alert-danger" role="alert">
              ${errores[0]}
          </div>
           `;
           $('#alertas').html(alerta)
        }
        return false;
    } else
    {
       guardarUsuario();
       return true;
    }
   });

   function guardarUsuario(){
    let email = $('#email').val();
    let password = $('#password').val();
    let nombreComercio = $('#nombreComercio').val();
    let giroComercio = $('#giroComercio').val();
    let calle = $('#calle').val();
    let noExterior = $('#noExterior').val();
    let noInterior = $('#noInterior').val();
    let telefono = $('#telefono').val();
    let cp = $('#cp').val();
    let colonia = $('#colonia').val();
    let ciudad = $('#ciudad').val();
    let estado = $('#estado').val();
    let nombre = $('#nombre').val();
    let apPaterno = $('#apPaterno').val();
    let apMaterno = $('#apMaterno').val();
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(User){
        let id = User.uid;
        db.collection("comercios").doc(id).set({
            nombre: String(nombre),
            apPaterno: String(apPaterno),
            apMaterno: String(apMaterno),
            nombreComercio: String(nombreComercio),
            giroComercio: String(giroComercio),
            calle: String(calle),
            noExterior: String(noExterior),
            noInterior: String(noInterior),
            telefono: String(telefono),
            cp: String(cp),
            colonia: String(colonia),
            ciudad: String(ciudad),
            estado: String(estado)

        })
        .then(function() {
            window.location.href = "../users/sigin.html";
        })
        .catch(function(error) {
            let alerta = `
                <div class="alert alert-danger" role="alert">
                    Error al Registrarse
                </div>
                `;
        $('#alertas').html(alerta);
        });
        
    }).catch(function(error) {
        let alerta = `
        <div class="alert alert-danger" role="alert">
           Error al registrar
       </div>
        `;
        $('#alertas').html(alerta);
      });
}


function validarFormulario(){
    let errores = [];
    let nombreComercio = $('#nombreComercio').val();
    let giroComercio = $('#giroComercio').val();
    giroComercio = giroComercio == null ? '' : giroComercio;
    let calle = $('#calle').val();
    let noExterior = $('#noExterior').val();
    let telefono = $('#telefono').val();
    let cp = $('#cp').val();
    let colonia = $('#colonia').val();
    colonia = colonia == null ? '' : colonia;
    let ciudad = $('#ciudad').val();
    let estado = $('#estado').val();
    let nombre = $('#nombre').val();
    let apPaterno = $('#apPaterno').val();
    let apMaterno = $('#apMaterno').val();
    let email = $('#email').val();
    let password = $('#password').val();
    let passwordConfirm = $('#passwordConfirm').val();

    if(nombreComercio.length == 0){
        errores.push('El campo nombre del comercio es obligatrio');
    }
    if(giroComercio.length == 0){
        errores.push('Selecciona un giro para tu comercio');
    }
    if(calle.length == 0){
        errores.push('El campo calle es obligatorio');
    }
    if(noExterior.length == 0){
        errores.push('El campo numero exterior es obligatorio');
    }
    if(telefono.length == 0){
        errores.push('El campo telefono es obligatorio');
    }
    if(cp.length == 0){
        errores.push('El campo codigo postal es obligatorio');
    }
    if(colonia.length == 0){
        errores.push('El campo colonia es obligatorio');
    }
    if(ciudad.length == 0){
        errores.push('El campo ciudad postal es obligatorio');
    }
    if(estado.length == 0){
        errores.push('El campo estado postal es obligatorio');
    }
    if(nombre.length == 0){
        errores.push('El campo nombre postal es obligatorio');
    }
    if(apPaterno.length == 0){
        errores.push('El campo apellido paterno es obligatorio');
    }
    if(apMaterno.length == 0){
        errores.push('El campo apellido materno es obligatorio');
    }
    if(email.length == 0){
        errores.push('El campo email es obligatorio');
    }
    let emailRegex = /^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i;
    if (!emailRegex.test(email)){
      errores.push('Agregue un email valido');
    }
    if(password.length < 6){
        errores.push('El campo password debe tener 6 caracteres');
    }
    if(passwordConfirm !== password){
        errores.push('Las contraseñas deben ser iguales');
    }
    return errores
}

});


