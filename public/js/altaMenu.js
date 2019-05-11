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
  var id, file, dbImagen, dbUrl, datetimes;
  var fileButton = document.getElementById('image');
  var dato = window.location.search.substring(1);
  var datosImagen = [];

  fileButton.addEventListener('change', function (e) {
    file = e.target.files[0];
  });



  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      id = user.uid;
      if (dato.length > 0) {
        var sParametro = dato.split('=');
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
        if (precio != '') {
          $('#Precio').val(doc.data().precio);

        } else {

          $("#DifPorc").prop({
            checked: true
          });

          let Chico = doc.data().chico;
          let Mediano = doc.data().mediano;
          let Grande = doc.data().grande;

          if (Chico != '') {
            $("#chkCh").prop({
              checked: true
            });
            $("#txtCh").prop({
              disabled: false
            });
          }

          if (Mediano != '') {
            $("#chkMed").prop({
              checked: true
            });
            $("#txtMed").prop({
              disabled: false
            });
          }

          if (Grande != '') {
            $("#chkGde").prop({
              checked: true
            });
            $("#txtGde").prop({
              disabled: false
            });
          }


          EnableDiv();
          $('#txtCh').val(doc.data().chico);
          $('#txtMed').val(doc.data().mediano);
          $('#txtGde').val(doc.data().grande);
        }

        dbUrl = doc.data().url;
        dbImagen = doc.data().imagen;
        $('#profile-img-tag').attr('src', dbUrl);
        $('#Descripcion').val(doc.data().descripcion);
        


      } else {
        console.log("No such document!");
      }
    }).catch(function (error) {
      console.log("Error getting document:", error);
    });
  }


  $('#btnAgregar').click(function () {
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

    let errores = validarFormulario(titulo, Precio, DifPorc, chkCh, txtCh, chkMed, txtMed, chkGde, txtGde, Descripcion, image)
    if(errores.length > 0){
      imprimirErrores(errores);
    }else {
      if(dato.length > 0){
       EditarProducto(titulo, Precio, txtCh, txtMed, txtGde, Descripcion);
      }else {
        NuevoProducto(titulo, Precio, txtCh, txtMed, txtGde, Descripcion );
      }
    }
  });

  function imprimirErrores(errores){
    for (let i = 0; i < errores.length; i++) {
      let alerta = `
              <div class="alert alert-danger" role="alert">
                  ${errores[i]}
              </div>
              `;
      $('#alertas').append(alerta);
    }
  }

  function NuevoProducto(titulo, Precio, txtCh, txtMed, txtGde, Descripcion) {
      var currentdate = new Date();
      datetimes = currentdate.getDate() + "" + (currentdate.getMonth() + 1) + "" + currentdate.getFullYear() + "" + currentdate.getHours() + "" + currentdate.getMinutes() + "" + currentdate.getSeconds();
      let storageRef = firebase.storage().ref('platillos/' + id + datetimes);
      let task = storageRef.put(file);
      task.on('state_changed',
        function progress(snapshot) {

        },
        function error(error) {
          let alerta = `
              <div class="alert alert-danger" role="alert">
                  Error al Guardar imagen verifique que su imagen sea correcta
              </div>
              `;
          $('#alertas').append(alerta);
        },
        function () {
          task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            db.collection("productos").add({
              UserId: id,
              imagen: id + datetimes,
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

  function EditarProducto(titulo, Precio, txtCh, txtMed, txtGde, Descripcion){
    let idProducto = String(dato);
    if(file){
      console.log('con imagen nueva');
      let nombre = String(dbImagen);
      let storageRef = firebase.storage().ref('platillos/' + nombre);

      storageRef.delete().then(function () {
        let currentdate = new Date();
        datetimes = currentdate.getDate() + "" + (currentdate.getMonth() + 1) + "" + currentdate.getFullYear() + "" + currentdate.getHours() + "" + currentdate.getMinutes() + "" + currentdate.getSeconds();
        let nombreImagen = id + datetimes;
        let storageRef = firebase.storage().ref('platillos/' + nombreImagen);
        let task = storageRef.put(file);

        task.on('state_changed',
          function progress(snapshot) {

          },
          function error(error) {
            let alerta = `
              <div class="alert alert-danger" role="alert">
                  Error al Guardar imagen verifique que su imagen sea correcta
              </div>
              `;
            $('#alertas').append(alerta);
          },
          function () {
            task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
              datosImagen = [downloadURL, nombreImagen];
              console.log(datosImagen);
              db.collection("productos").doc(idProducto).set({
                UserId: id,
                imagen: String(nombreImagen),
                url: String(downloadURL),
                titulo: titulo,
                descripcion: Descripcion,
                precio: Precio,
                chico: txtCh == null ? '' : txtCh,
                mediano: txtMed == null ? '' : txtMed,
                grande: txtGde == null ? '' : txtGde
              })
              .then(function () {
                window.location = './ListaMenu.html';
              })
              .catch(function (error) {
                let alerta = `
                <div class="alert alert-danger" role="alert">
                    Error al Actualizar Datos
                </div>
                `;
              });

            });
          }
        );
      }).catch(function (error) {
        console.log('error al insertar imagen', error)
      });

    }else {
      ActualizarTabla(titulo, Precio, txtCh, txtMed, txtGde, Descripcion, String(dbImagen), String(dbUrl) ,idProducto)
    }
  }

  function validarFormulario(titulo, Precio, DifPorc, chkCh, txtCh, chkMed, txtMed, chkGde, txtGde, Descripcion, image){
    let errores = [];

    //Validación de formularios
    if (titulo.length == 0) {
      errores.push('El titulo es requerido');
    }
    if (DifPorc) {
      if (chkCh || chkMed || chkGde) {
        if (chkCh) {
          if (txtCh.length == 0) {
            errores.push('Asigne un precio al platillo chico')
          }
        }
        if (chkMed) {
          if (txtMed.length == 0) {
            errores.push('Asigne un precio al platillo mediano')
          }
        }
        if (chkGde) {
          if (txtGde.length == 0) {
            errores.push('Asigne un precio al platillo mediano')
          }
        }
      } else {
        errores.push('Elija una o varias porciones para su platillo')
      }
    } else {
      if (Precio.length == 0) {
        errores.push('Asigen un precio al platillo')
      }
    }
    if (Descripcion.length == 0) {
      errores.push('El campo descripción es obligatorio');
    }
    if(dato.length > 0){
      if($('#profile-img-tag').attr('src').length == 0){
        errores.push('Por favor elija un imagen para su producto (editar)');
      }
    } else {
      if (image.length == 0) {
        errores.push('Por favor elija un imagen para su producto');
      }
    }

    return errores;
  }

  function ActualizarTabla(titulo, Precio, txtCh, txtMed, txtGde, Descripcion, imagen, url,idProducto) {
    db.collection("productos").doc(idProducto).set({
        UserId: id,
        imagen: String(imagen),
        url: String(url),
        titulo: titulo,
        descripcion: Descripcion,
        precio: Precio,
        chico: txtCh == null ? '' : txtCh,
        mediano: txtMed == null ? '' : txtMed,
        grande: txtGde == null ? '' : txtGde
      })
      .then(function () {
        window.location = './ListaMenu.html';
      })
      .catch(function (error) {
        let alerta = `
        <div class="alert alert-danger" role="alert">
            Error al actualizar información
        </div>
        `;
      });
  }


  $('#salir').click(function () {
    firebase.auth().signOut().then(function () {
      window.location = '../../index.html';
    }).catch(function (error) {
      console.log(error)
    });
  });
});