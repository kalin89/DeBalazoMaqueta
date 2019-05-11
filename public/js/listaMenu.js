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
  var id, idproducto;

  $('#productos').on('click', '.iEditar', function() {
    idproducto = '?' + $(this).val();
    let url = './AltaMenu.html' + idproducto;
    window.location = url;
  });

  $('#productos').on('click', '.iEliminar', function() {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this imaginary file!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        let productoId = $(this).val();
        let nombreImagen = String($(this).data('image'));

        let storageRef = firebase.storage().ref('platillos/' + nombreImagen);
        storageRef.delete().then(function() {
          eliminarProducto(productoId);
        }).catch(function(error) {
          let alerta = `
              <div class="alert alert-danger" role="alert">
                  Error al Guardar imagen verifique que su imagen sea correcta
              </div>
              `;
            $('#alertas').append(alerta);
        });
          swal("Poof! Your imaginary file has been deleted!", {
          icon: "success",
        });
      }
    });
  });

  function dibujarMenu(titulo, descripcion, precio, chico, mediano, grande, url,id, imagen) {
    precio = precio == '' ? '-' : precio;
    chico = chico == '' ? '-' : 'C ' + chico;
    mediano = mediano == '' ? '-' : 'M ' + mediano;
    grande = grande == '' ? '-' : 'G ' + grande;
    let menu = `
            <tr>
            <td>
                <img id="Foto1" name="Foto1"
                    src="${url}"
                    alt="imgAlt"
                    style="display: block; margin-left: auto; margin-right: auto; width: 167px; height: 100px;" />
            </td>
            <td class="text-center">${titulo}</td>
            <td>${descripcion}</td>
            <td class="text-center">${precio}</td>
            <td class="text-center">${chico}</td>
            <td class="text-center">${mediano}</td>
            <td class="text-center">${grande}</td>
            
            <td class="text-center">
                <button type="button" class="fa fa-pencil iEditar btn btn-link" style="color:darkorange; text-decoration:none;" value="${id}" data-toggle="tooltip"
                    data-placement="left" title="Editar"></button>
                <button type="button" id="${imagen}" data-image="${imagen}" class="fa fa-times iEliminar btn btn-link" value="${id}" style="color:red; text-decoration:none;" data-toggle="tooltip"
                    data-placement="left" title="Eliminar"></button>
            </td>
            </tr>
            `;
    return menu;
    
  }

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      id = user.uid;
      Cargar(id);

    } else {
      window.location = '../users/sigin.html';
    }
    $('#spiner').hide();
  });

  $('#salir').click(function () {
    firebase.auth().signOut().then(function () {
      window.location = '../../index.html';
    }).catch(function (error) {
      console.log(error)
    });
  });

  function eliminarProducto(id) {
    let productoID = String(id);
    db.collection("productos").doc(productoID).delete().then(function () {
      console.log("Document successfully deleted!");
    }).catch(function (error) {
      console.error("Error removing document: ", error);
    });
  }

  function Cargar(id) {
    let menu = '';
    db.collection("productos").where("UserId", "==", id).get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          menu += dibujarMenu(doc.data().titulo, doc.data().descripcion, doc.data().precio, doc.data().chico, doc.data().mediano, doc.data().grande, doc.data().url, doc.id, doc.data().imagen);

        });
        $("#productos").html(menu);
        $('[data-toggle="tooltip"]').tooltip();
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  }


  });


  







