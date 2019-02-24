
let memNowElinvSpace = function () {

   // identificador in crescendo al crear items menu contextual
   var idMNE = 0; 
   // configuración del programa en un objeto
   var config = {
      extension: {
         nombre:  chrome.i18n.getMessage("extensionNombre")
      },
      msg:{
         esTable: chrome.i18n.getMessage("esTable"),
         esMovil: chrome.i18n.getMessage("esMovil"),
         titulo: chrome.i18n.getMessage("titulo"),
         menuTituloCrear: chrome.i18n.getMessage("menuTituloCrear"),
         success: chrome.i18n.getMessage("success"),
         unsucess: chrome.i18n.getMessage("unsucess"),
         copyToClipb: chrome.i18n.getMessage("copyToClipb"),
         copyToClipbExitosa: chrome.i18n.getMessage("copyToClipbExitosa"),
         copyToClipbErr: chrome.i18n.getMessage("copyToClipbErr"),
         errCopyToClipb: chrome.i18n.getMessage("errCopyToClipb"),
         reminderIn: chrome.i18n.getMessage("reminderIn"),
         permanente: chrome.i18n.getMessage("permanente"),
         temporal: chrome.i18n.getMessage("temporal")
      }
   };
   // preparación a futuro
   // Organizamos el código de acuerdo al tipo de equipo donde se ejecutará
   // ---------------------------------------------------
   if (navigator.userAgent.match(/Tablet|iPad/i)) {
      // Es una table
      msj('../ico/e.png', config.msg.esTable);
   } else if (navigator.userAgent.match(/Mobile|Windows Phone|Lumia|Android|webOS|iPhone|iPod|Blackberry|PlayBook|BB10|Opera Mini|\bCrMo\/|Opera Mobi/i)) {
      // Es un móvil
      msj('../ico/e.png', config.msg.esMovil);
   } else {
      // Escritorio
      memNowElinv2019();
   }
   //-------------------------------------------
   // si nuestra extensión se ejecuta en una plataforma de escritorio
   function memNowElinv2019() {

      // array contiene elementos permanentes
      var memNowArr = [];
      // funciones generales
      function msgNotif(titulo, msge) {
         browser.notifications.create({
            'type': 'basic',
            'iconUrl': browser.extension.getURL("ico/e.png"),
            'title': titulo,
            'message': msge
         });
      };
      // funciones para copiar al portapapeles
      // -------------------------------------
      function fallbackCopyTextToClipboard(text) {
         var textArea = document.createElement("textarea");
         textArea.value = text;
         document.body.appendChild(textArea);
         textArea.focus();
         textArea.select();
         // para las notificaciones
         let msg;
         try {
            let successful = document.execCommand('copy');
            msg = successful ? config.msg.success : config.msg.unsucess;
            msg = config.msg.copyToClipb + msg;
            msgNotif(config.msg.titulo + "\r\n", msg)
         } catch (err) {
            msg = config.msg.errCopyToClipb + err;
            msgNotif(config.msg.titulo + "\r\n", msg);
         }
         document.body.removeChild(textArea);
      }

      function copyTextToClipboard(text) {
         if (!navigator.clipboard) {
            fallbackCopyTextToClipboard(text);
            return;
         }
         let msg;
         navigator.clipboard.writeText(text).then(function () {
            msg = config.msg.copyToClipbExitosa + '\r\n \r\n => ' + text;
            msgNotif(config.msg.titulo + "\r\n", msg);
         }, function (err) {
            msg = config.msg.copyToClipbErr + err;
            msgNotif(config.msg.titulo + "\r\n", msg);
         });
      }
      // -------------------------------------

      // ------------------------------------------------------  
      // Para preparar las opciones
      function handleClick() {
         //chrome.runtime.openOptionsPage();
         function onOpened() {
            //console.log(`Options page opened`);
         }

         function onError(error) {
            //console.log(`Error: ${error}`);
         }

         var opening = browser.runtime.openOptionsPage();
         opening.then(onOpened, onError);
      }
      chrome.browserAction.onClicked.addListener(handleClick);
      // ------------------------------------------------------  

      // ------------------------------------------------------  
      // ACCIONES DEL MENU CONTEXTUAL
      // ------------------------------------------------------          
      // El detector de eventos click del menu contextual.
      chrome.contextMenus.onClicked.addListener(function (info, tab) {
         //vaciamos la matriz de idiomas
         idiomSelRec = [];
         switch (info.menuItemId) {
            case "memNowElinv":

               function ejecutado(result) {
                  let memNowElinv = result.toString().trim();
                  //console.log(memNowElinv);
                  if (memNowElinv != null && memNowElinv != "" &&
                     memNowElinv != "undefined") {
                     // MARK: CREAR item menu
                     chrome.contextMenus.create({
                        id: "memnow" + idMNE++, //Identificador
                        "icons": {
                           "256": "ico/selectIN.png"
                        },
                        title: memNowElinv,
                        contexts: ["all"],
                        onclick: function () {
                           copyTextToClipboard(memNowElinv.split("~")[0].trim());
                        }
                     }, onCreated);
                     // solo si es permanente
                     if (memNowElinv.split("~")[1].trim() == "✅") {
                        // agregamos al array
                        memNowArr.push(memNowElinv.split("~")[0].trim());
                        // grabamos en el local storage
                        localStorage.setItem("memNowElinv", JSON.stringify(memNowArr));
                     } else {
                        console.log(memNowArr);
                     }
                  }
               }
               var seleccion = `
               var respuesta = "";
               var textSelect = ""; //window.getSelection().toString();                    
               if (window.getSelection && document.activeElement){
                  // obtenemos selección de inputs
                  if (document.activeElement.nodeName == "TEXTAREA" ||
                     (document.activeElement.nodeName == "INPUT" &&
                     document.activeElement.getAttribute("type").toLowerCase() == "text")){
                     let ta = document.activeElement;
                     textSelect = ta.value.substring(ta.selectionStart, ta.selectionEnd);
                     // desde los iframes
                  }else if (document.activeElement.nodeName == "IFRAME"){
                     // aqui la selección desde el contenido del documento del iframe
                     var iframe = document.getElementById(document.activeElement.id);
                     let textProv = iframe.contentDocument.getSelection().toString();
                     if (textProv.length > 0){
                        textSelect = textProv;
                     }else{
                        // sino analizamos selección desde los inputs del iframe
                        if (iframe.contentDocument.activeElement.nodeName == "TEXTAREA" ||
                           (iframe.contentDocument.activeElement.nodeName == "INPUT" &&
                           iframe.contentDocument.activeElement.getAttribute("type").toLowerCase() == "text")){
                           // obtenemos la selección
                           let taIframe = iframe.contentDocument.activeElement;
                           textSelect = taIframe.value.substring(taIframe.selectionStart, taIframe.selectionEnd);
                        }
                     }
                  } else {
                     textSelect = window.getSelection();
                  }
                  var titu = "${config.msg.titulo} \\n 〰️〰️〰️〰️〰️〰️〰️〰️〰️ \\n \\n "; 
                  var memNowElinv = prompt(titu + " 📌 ${config.msg.reminderIn}", textSelect);
                  if (memNowElinv){
                     //permanent or temporary
                     var estado;
                     var r = confirm(titu + " ${config.msg.permanente} ✅ (OK) - ${config.msg.temporal} ⭕ (Cancel)");
                     if (r == true) {
                         estado = "  ~ ✅";
                     } else {
                         estado = "  ~ ⭕";
                     }
                     respuesta = memNowElinv + estado;
                  }
               }                  
               `;
               var ejecutaScript = browser.tabs.executeScript({
                  code: seleccion
               });               
               ejecutaScript.then(ejecutado, conError);

               break;
         }
      });
      // ---------------------------------------------------

      // ---------------------------------------------------
      // ELEMENTOS DEL MENU CONTEXTUAL
      // ---------------------------------------------------
      // Elemento visible solo si existe selección
      // para traducir selección y reemplazar en el mismo lugar
      chrome.contextMenus.create({
         id: "memNowElinv", //Identificador
         "icons": {
            "260": "ico/selectOUT1.png"
         },
         title: config.msg.menuTituloCrear + config.msg.titulo,
         contexts: ["all"] //"all" "page", "selection", "image", "link"
      }, onCreatedOnload);
      // ---------------------------------------------------   
      // ---------------------------------------------------
      // se ha creado el objeto o no
      function onCreatedOnload(n) {
         if (chrome.runtime.lastError) {
            //console.log("error en la creación del elemento al cargar la extensión:" + chrome.runtime.lastError);
         } else {
            //console.log("contextual memNowElinv creado con éxito! al cargar la extensión");
            // Creamos los items contextuales permanentes
            var objeto = JSON.parse(localStorage.getItem("memNowElinv"));
            // Controlar error objeto null
            if (objeto) {
               objeto.forEach(function (objeto) {
                  //console.log(objeto);
                  // MARK: RECREAMOS cada item permanente en el menu contextual
                  chrome.contextMenus.create({
                     id: "memnow" + idMNE++, //Identificador
                     "icons": {
                        "256": "ico/selectIN.png"
                     },
                     title: objeto + " ~ ✅",
                     contexts: ["all"],
                     onclick: function () {
                        copyTextToClipboard(objeto);
                     }
                  }, onCreated);
                  // agregamos al array
                  memNowArr.push(objeto);
               });
            }
         }
      }
      // on created on load
      function onCreated(n) {
         if (chrome.runtime.lastError) {
            //console.log("error en la creación del elemento:" + chrome.runtime.lastError);
         } else {
            //console.log("contextual memNowElinv creado/s con éxito!");
         }
      }
      // ---------------------------------------------------
      // ---------------------------------------------------
      // errores mensajes
      function conError(error) {
         //console.log(`Error: ${error}`);
      }
      // ---------------------------------------------------        
   }
   //-------------------------------------------    
}();
