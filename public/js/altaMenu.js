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
    var id, file;

    var fileButton = document.getElementById('image');

    fileButton.addEventListener('change', function(e){
        file = e.target.files[0];
        console.log(file);
    })
  


    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          id = user.uid;
          var displayName = user.displayName;
          var email = user.email;
          console.log('logueado');
        } else {
            window.location = '../users/sigin.html';
        }
      });


      $('#btnAgregar').click(function(){
        $('#alertas').html('');
        let titulo = $('#Titulo').val();
        let Precio = $('#Precio').val();
        let DifPorc = $('#DifPorc').prop('checked');
        let chkCh = $('#chkCh').prop('checked');
        let txtCh = $('#txtCh').val();
        let chkMed = $('#chkMed').prop('checked');
        let txtMed = $('#txtMed').val();
        let chkGde = $('#chkGde').prop('checked');
        let txtGde = $('#txtGde').val();
        let Descripcion = $('#Descripcion').val();
        let image = $('#image').val();
        let errores = [];

        //Validación de formularios
        if(titulo.length == 0){
          errores.push('El titulo es requerido');
        }
        if(DifPorc){
          if(chkCh || chkMed || chkGde) {
            if(chkCh){
              if(txtCh.length == 0){
                errores.push('Asigne un precio al platillo chico')
              }
            }
            if(chkMed){
              if(txtMed.length == 0){
                errores.push('Asigne un precio al platillo mediano')
              }
            }
            if(chkGde){
              if(txtGde.length == 0){
                errores.push('Asigne un precio al platillo mediano')
              }
            }
          }else{
              errores.push('Elija una o varias porciones para su platillo')
          }
        } else {
          if(Precio.length == 0){
            errores.push('Asigen un precio al platillo')
          }
        }
        if(Descripcion.length == 0){
          errores.push('El campo descripción es obligatorio');
        }
        if(image.length == 0){
            errores.push('Por favor elija un imagen para su producto');
        }

        /******  Finaliza validar formulario *******/ 

        /***** verificar errores ********/
        if(errores.length > 0){
            for (let i = 0; i < errores.length; i++) {
                let alerta = `
                <div class="alert alert-danger" role="alert">
                    ${errores[i]}
                </div>
                `;
                $('#alertas').append(alerta);
            }
        }else {
            /******** Insertar Platillo *********/
                var currentdate = new Date();
                var datetime = currentdate.getDate() + "" + (currentdate.getMonth() + 1) + "" + currentdate.getFullYear() + "" + currentdate.getHours() + "" + currentdate.getMinutes() + "" + currentdate.getSeconds();
                let storageRef = firebase.storage().ref('platillos/' + id + datetime);
                let task = storageRef.put(file);
                task.on('state_changed',
                    function progress(snapshot) {

                    },
                    function error(error) {

                    },
                    function() {
                        task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                            var currentdate = new Date();
                            var datetime = currentdate.getDate() + "" + (currentdate.getMonth() + 1) + "" + currentdate.getFullYear() + "" + currentdate.getHours() + "" + currentdate.getMinutes() + "" + currentdate.getSeconds();
                            db.collection("productos").add({
                                UserId: id,
                                imagen: id + datetime,
                                url: downloadURL,
                                titulo: titulo,
                                descripcion: Descripcion,
                                precio: Precio,
                                chico: txtCh == null ? '' : txtCh,
                                mediano: txtMed == null ? '' : txtMed,
                                grande: txtGde == null ? '' : txtGde
                            }).then(function () {
                                window.location = './ListaMenu.html';
                            }).catch(function () {

                            });
                        });
                    }
                );
        }
      });


    $('#salir').click(function(){
        firebase.auth().signOut().then(function() {
            window.location = '../../index.html';
          }).catch(function(error) {
            console.log(error)
          });
    });
});