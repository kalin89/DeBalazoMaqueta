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
    firebase.auth().languageCode = 'es';
    var db = firebase.firestore();

    $('#login').click(function(){
        let errores = validar();
        let email = $('#email').val();
        let password = $('#password').val();

        if(errores.length != 0)
        {
            firebase.auth().signInWithEmailAndPassword(email, password).then(function (User){
                console.log(User.uid)
                window.location.href = "../menu/ListaMenu.html";
            }).catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage);
              });
        } else {
            let alerta = `
                <div class="alert alert-danger" role="alert">
                    Error al Registrarse
                </div>
                `;
            $('#alertas').html(alerta);
        }
    });

    function validar(){
        let email = $('#email').val();
        let password = $('#password').val();
        let errores = [];

        let emailRegex = /^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i;
        if (!emailRegex.test(email)) {
            errores.push('Agregue un email valido');
        }

        if(password.length){
            errores.push('Por favor ingresa usuarios');
        }

        return errores;

    }
})