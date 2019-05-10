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
    })
  


    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          id = user.uid;
          var dato = window.location.search.substring(1);
          if(dato.length > 0){
            var sParametro = dato.split('=');
            console.log(sParametro[0]);
            cargarDatos(sParametro);
          }
        } else {
            window.location = '../users/sigin.html';
        }
      });


    function cargarDatos(idProducto) {
      let idProduct = String(idProducto);
      var docRef = db.collection("productos").doc(idProduct);

      docRef.get().then(function (doc) {
        if (doc.exists) {
          let precio = doc.data().precio;
          $('#Titulo').val(doc.data().titulo);
          if(precio != ''){
            console.log(doc.data().titulo)
            $('#Precio').val(doc.data().precio);
            
          }
          else
          {
            
            $("#DifPorc").prop({
              checked: true
            });
           
            let Chico = doc.data().chico;
            let Mediano = doc.data().mediano;
            let Grande = doc.data().grande;

            if(Chico != ''){
              $("#chkCh").prop({checked: true});
              $("#txtCh").prop({disabled: false});
            }

            if(Mediano != ''){
              $("#chkMed").prop({checked: true});
              $("#txtMed").prop({disabled: false});
            }

            if(Grande != ''){
              $("#chkGde").prop({checked: true});
              $("#txtGde").prop({disabled: false});
            }


             EnableDiv();
            $('#txtCh').val(doc.data().chico);
            $('#txtMed').val(doc.data().mediano);
            $('#txtGde').val(doc.data().grande);
          }
          
          $('#Descripcion').val(doc.data().descripcion);
          $('#profile-img-tag').attr('src', doc.data().url)

        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      }).catch(function (error) {
        console.log("Error getting document:", error);
      });
    }


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