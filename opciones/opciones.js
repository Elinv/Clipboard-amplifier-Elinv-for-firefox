let menNowOpciones = function () {
   // Creamos los items contextuales permanentes
   var objeto = JSON.parse(localStorage.getItem("memNowElinv"));
   // variable incremental
   var idmas = 0;
   // configuración del programa en un objeto
   var config = {
      extension: {
         nombre: chrome.i18n.getMessage("extensionNombre")
      },
      msg: {
         recorded: chrome.i18n.getMessage("recorded"),
         botonStatus1: chrome.i18n.getMessage("botonStatus1"),
         botonStatus2: chrome.i18n.getMessage("botonStatus2")
      }
   };
   // Controlar error objeto is null
   if (objeto) {
      objeto.forEach(function (objeto) {
         //console.log(objeto);
         let idFila = "myTr" + idmas;
         var x = document.createElement("TR");
         x.setAttribute("id", idFila);
         document.getElementById("myTable").appendChild(x);

         var y1 = document.createElement("TD");
         var t1 = document.createTextNode(objeto);
         y1.appendChild(t1);
         document.getElementById(idFila).appendChild(y1);

         var y2 = document.createElement("TD");

         var button = document.createElement('button');
         button.innerHTML = '<div class="handle"></div>';
         button.className = "btn btn-lg btn-secondary btn-toggle active";
         button.setAttribute('data-toggle', 'button');
         button.setAttribute('aria-pressed', 'true');
         button.setAttribute('autocomplete', 'off');
         button.onclick = function () {
            let fila = document.getElementById(idFila);
            if (fila.style.backgroundColor === "rgb(221, 221, 221)") {
               fila.style.backgroundColor = "#ffffff";
            } else {
               fila.style.backgroundColor = "#dddddd";
            }

            return false;
         };
         y2.appendChild(button);
         document.getElementById(idFila).appendChild(y2);
         idmas++;
      });
   }

   // Acción record current status
   var butSaveStatus = document.getElementById("butSaveElv");
   // label button por defecto
   butSaveStatus.textContent = config.msg.botonStatus1;
   // action click
   butSaveStatus.addEventListener('click', () => {
      if (butSaveStatus.innerHTML === config.msg.botonStatus2) {
         butSaveStatus.textContent = config.msg.botonStatus1;
         // rutina para grabar estado
         // analizamos la tabla y dejar los elegidos por el usuario
         let tot = idmas;
         let memNowArr = [];
         for (let i = 0; i < tot; i++) {
            let idFila = "myTr" + i;
            let fila = document.getElementById(idFila);
            if (fila.style.backgroundColor === "rgb(221, 221, 221)") {} else {
               memNowArr.push(fila.cells[0].innerHTML);
            }
         }
         // grabamos en el local storage
         localStorage.setItem("memNowElinv", JSON.stringify(memNowArr));
         // mostramos notificación
         browser.notifications.create({
            'type': 'basic',
            'iconUrl': browser.extension.getURL("ico/e.png"),
            'title': config.extension.nombre,
            'message': config.msg.recorded
         });
         // refrescamos la extensión para actualizar datos
         setTimeout(function () {
            browser.runtime.reload();
         }, 2000);
         // salimos
         return;
      }
      if (butSaveStatus.innerHTML === config.msg.botonStatus1) {
         butSaveStatus.textContent = config.msg.botonStatus2;
      }
   });

}();