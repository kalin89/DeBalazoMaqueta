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
    var id;

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          id = user.uid;
          var displayName = user.displayName;
          var email = user.email;
          console.log(id, displayName, email);

        db.collection("productos").where("UserId", "==", id)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            dibujarMenu(doc.data().titulo, doc.data().descripcion, doc.data().precio,doc.data().chico,doc.data().mediano,doc.data().grande, doc.data().url);
            console.log(doc.id, " => ", doc.data());
          });
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });
        } else {
            window.location = '../users/sigin.html';
        }
      });


      function dibujarMenu(titulo, descripcion, precio, chico, mediano, grande, url){
        precio = precio == '' ? '-' : precio;
        chico = chico == '' ? '-' : chico;
        mediano = mediano == '' ? '-' : mediano;
        grande = grande == '' ? '-' : grande;
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
            <i class="fa fa-pencil iEditar" style="color:darkorange;" data-toggle="tooltip"
                data-placement="left" title="Editar"></i>
            <i class="fa fa-times iEliminar" style="color:red;" data-toggle="tooltip"
                data-placement="left" title="Eliminar"></i>
        </td>
    </tr>
              `;
        
        $("#productos").append(menu);
      }

      

    $('#salir').click(function(){
        firebase.auth().signOut().then(function() {
            window.location = '../../index.html';
          }).catch(function(error) {
            console.log(error)
          });
    });



})


