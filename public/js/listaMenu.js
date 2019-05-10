$(document).ready(function () {
  var idproducto;

    $('#productos').on('click', '.iEditar', function() {
      idproducto = '?' + $(this).val();
      console.log($(this).val());
      let url = './AltaMenu.html' + idproducto;
      window.location = url;
    });

    // $('.iEliminar').click(function () {
    //   alert("En un futuro, E L I M I N A R É!");
    // });

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
  var id;

  function dibujarMenu(titulo, descripcion, precio, chico, mediano, grande, url,id) {
    console.log(id);
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
                <button type="button" class="fa fa-times iEliminar btn btn-link" value="${id}" style="color:red; text-decoration:none;" data-toggle="tooltip"
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
      var displayName = user.displayName;
      var email = user.email;
      let menu = '';
      db.collection("productos").where("UserId", "==", id)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            menu += dibujarMenu(doc.data().titulo, doc.data().descripcion, doc.data().precio, doc.data().chico, doc.data().mediano, doc.data().grande, doc.data().url, doc.id);
            
          });
          $("#productos").html(menu);
          $('[data-toggle="tooltip"]').tooltip();
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });

    } else {
      window.location = '../users/sigin.html';
    }

  });

  $('#salir').click(function () {
    firebase.auth().signOut().then(function () {
      window.location = '../../index.html';
    }).catch(function (error) {
      console.log(error)
    });
  });
});







