// Este JS hace de simulador del Firmware Bruce

// --- DATOS BASICOS ---
// Opciones del menu principal
var opcionesMenu = [
    "WiFi",
    "Bluetooth",
    "Sub-GHz",
    "NFC/RFID",
    "Ajustes"
];

// Opciones de cada submenu (arrays de texto)
var opcionesWifi = ["Escanear Redes", "Deauth", "Beacon Spam", "Sniffer"];
var opcionesBt = ["Escanear BLE", "Ver Dispositivos", "Spoof ID", "Jammer"];
var opcionesSub = ["Analizador", "Grabar", "Jammer", "Mando Salon"];
var opcionesNfc = ["Leer Tarjeta", "Escribir", "Emular", "Clonar"];
var opcionesAjustes = ["Brillo", "Sonido", "Rotacion", "Info"];

// Mensajes que salen en la terminal (aleatorios)
var mensajesHack = [
    "Iniciando...",
    "Escaneando...",
    "Red encontrada: 54%",
    "Paquete recibido",
    "Analizando...",
    "Guardando log...",
    "Esperando...",
    "Error 404 (Ignorado)",
    "Hackeando...",
    "Completado."
];

// --- ESTADO DEL SISTEMA ---
var pantallaActual = "HOME";
var indiceHome = 0;
var indiceMenu = 0;
var intervaloAtaque = null;

// --- COLORES ---
var colorTema = "#E050E0"; // Morado estilo Bruce

// --- REFERENCIAS A LA PANTALLA ---
var divHome = document.getElementById("pantalla-home");
var divLista = document.getElementById("pantalla-lista");
var divTerminal = document.getElementById("pantalla-terminal");
var divOpciones = document.getElementById("lista-opciones");
var tituloHome = document.getElementById("home-titulo");
var iconoHome = document.getElementById("home-icono");
var tituloTerminal = document.getElementById("terminal-titulo");
var logTerminal = document.getElementById("terminal-log");
var pieTexto = document.getElementById("pie-texto");
var pantalla = document.querySelector(".pantalla-bruce");

// Iconos SVG (copiar y pegar desde internet)
var svgWifi = '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="7" y="12" width="2" height="2"/><rect x="5" y="9" width="2" height="1"/><rect x="9" y="9" width="2" height="1"/><rect x="6" y="8" width="4" height="1"/><rect x="3" y="6" width="2" height="1"/><rect x="11" y="6" width="2" height="1"/><rect x="4" y="5" width="8" height="1"/><rect x="1" y="3" width="2" height="1"/><rect x="13" y="3" width="2" height="1"/><rect x="2" y="2" width="12" height="1"/></svg>';
var svgBt = '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="7" y="1" width="2" height="14"/><polygon points="7,8 11,4 7,1"/><path d="M7 1 L11 5 L7 9 L11 13 L7 16" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 2 L12 6 L8 10 L12 14 L8 15" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>';
var svgSub = '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="6" width="12" height="8"/><rect x="3" y="2" width="1" height="4"/><rect x="12" y="2" width="1" height="4"/></svg>';
var svgNfc = '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="3" width="14" height="10"/><rect x="11" y="5" width="2" height="3" fill="black"/></svg>';
var svgAjustes = '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="6" y="2" width="4" height="2"/><rect x="6" y="12" width="4" height="2"/><rect x="2" y="6" width="2" height="4"/><rect x="12" y="6" width="2" height="4"/><rect x="5" y="5" width="6" height="6"/></svg>';
var svgFlechaIzq = '<svg viewBox="0 0 16 16" fill="currentColor"><polygon points="8,2 6,4 4,6 6,8 8,10 8,14"/></svg>';
var svgFlechaDer = '<svg viewBox="0 0 16 16" fill="currentColor"><polygon points="8,2 10,4 12,6 10,8 8,10 8,14"/></svg>';

var listaIconos = [svgWifi, svgBt, svgSub, svgNfc, svgAjustes];


// --- FUNCIONES ---

// 1. Mostrar la pantalla correcta segun el estado
function actualizarPantalla() {
    // Escondemos todas (añadiendo la clase oculto)
    divHome.classList.add("oculto");
    divLista.classList.add("oculto");
    divTerminal.classList.add("oculto");

    // Mostramos la que toca (quitando la clase oculto)
    if (pantallaActual == "HOME") {
        divHome.classList.remove("oculto");

        // Poner datos del icono actual
        tituloHome.textContent = opcionesMenu[indiceHome];
        iconoHome.innerHTML = listaIconos[indiceHome];

        // Color del tema
        pantalla.style.color = colorTema;

    } else if (pantallaActual == "MENU") {
        divLista.classList.remove("oculto");

        // Color del tema (importante para que se vea el texto)
        pantalla.style.color = colorTema;

        dibujarListaMenu();

    } else if (pantallaActual == "ATAQUE") {
        divTerminal.classList.remove("oculto");
        // Color del tema
        pantalla.style.color = colorTema;
    }
}

// 2. Dibujar la lista de opciones del menu
function dibujarListaMenu() {
    var opciones = [];

    // Elegir que lista mostrar segun donde estabamos en el Home
    if (indiceHome == 0) opciones = opcionesWifi;
    else if (indiceHome == 1) opciones = opcionesBt;
    else if (indiceHome == 2) opciones = opcionesSub;
    else if (indiceHome == 3) opciones = opcionesNfc;
    else if (indiceHome == 4) opciones = opcionesAjustes;

    // Añadir opcion de volver
    var listaCompleta = [];
    // Copiamos todas las opciones
    for (var j = 0; j < opciones.length; j++) {
        listaCompleta.push(opciones[j]);
    }
    // Añadimos "Atras" al final
    listaCompleta.push("Atras");

    // Crear el HTML de la lista
    var html = "";

    // Recorremos la lista con un bucle for clasico
    for (var i = 0; i < listaCompleta.length; i++) {
        var nombre = listaCompleta[i];

        // Si es el seleccionado le ponemos estilo especial
        if (i == indiceMenu) {
            html += '<div class="opcion activa" style="background-color:' + colorTema + '; color:black; font-weight:bold;">> ' + nombre + '</div>';
        } else {
            html += '<div class="opcion" style="color:' + colorTema + ';">&nbsp; ' + nombre + '</div>';
        }
    }

    divOpciones.innerHTML = html;
}

// 3. Empezar un "ataque" simulado
function empezarAtaque(nombre) {
    pantallaActual = "ATAQUE";
    actualizarPantalla();

    tituloTerminal.textContent = nombre.toUpperCase();
    logTerminal.innerHTML = ""; // Limpiar logs viejos

    // Bucle para añadir texto
    if (intervaloAtaque) clearInterval(intervaloAtaque);

    intervaloAtaque = setInterval(function () {
        // Elegir mensaje al azar
        var azar = Math.floor(Math.random() * mensajesHack.length);
        var mensaje = mensajesHack[azar];

        // Crear elemento y añadirlo
        var linea = document.createElement("div");
        linea.textContent = "> " + mensaje;
        logTerminal.appendChild(linea);

        // Borrar si hay muchos (para que no se llene)
        if (logTerminal.children.length > 8) {
            logTerminal.removeChild(logTerminal.firstChild);
        }

    }, 500); // Medio segundo
}

function pararAtaque() {
    if (intervaloAtaque) clearInterval(intervaloAtaque);
    pantallaActual = "MENU";
    actualizarPantalla();
}


// --- CONTROL DEL TECLADO ---

function teclado(tecla) {
    if (pantallaActual == "HOME") {
        if (tecla == "ARRIBA") {
            indiceHome--;
            if (indiceHome < 0) indiceHome = opcionesMenu.length - 1;
        }
        else if (tecla == "ABAJO") {
            indiceHome++;
            if (indiceHome >= opcionesMenu.length) indiceHome = 0;
        }
        else if (tecla == "ENTER") {
            pantallaActual = "MENU";
            indiceMenu = 0; // Resetear seleccion
        }

    } else if (pantallaActual == "MENU") {
        // Calcular cuantos items hay
        var totalItems;
        if (indiceHome == 0) totalItems = opcionesWifi.length + 1; // +1 por "Atras"
        else if (indiceHome == 1) totalItems = opcionesBt.length + 1;
        else if (indiceHome == 2) totalItems = opcionesSub.length + 1;
        else if (indiceHome == 3) totalItems = opcionesNfc.length + 1;
        else totalItems = opcionesAjustes.length + 1;

        if (tecla == "ARRIBA") {
            indiceMenu--;
            if (indiceMenu < 0) indiceMenu = totalItems - 1;
        }
        else if (tecla == "ABAJO") {
            indiceMenu++;
            if (indiceMenu >= totalItems) indiceMenu = 0;
        }
        else if (tecla == "ENTER") {
            // Si es el ultimo es "Atras"
            if (indiceMenu == totalItems - 1) {
                pantallaActual = "HOME";
            } else {
                // Si no, empezamos ataque
                empezarAtaque("EJECUTANDO...");
            }
        }

    } else if (pantallaActual == "ATAQUE") {
        // Cualquier tecla para salir
        pararAtaque();
    }

    actualizarPantalla();
}

// Escuchar teclas del ordenador
document.addEventListener('keydown', function (evento) {
    if (evento.key == 'ArrowUp') teclado("ARRIBA");
    if (evento.key == 'ArrowDown') teclado("ABAJO");
    if (evento.key == 'Enter') teclado("ENTER");
    if (evento.key == 'Escape') pararAtaque();
});

// Funciones para los botones de la pantalla tactil (html)
window.handleInput = function (accion) {
    if (accion == 'UP') teclado("ARRIBA");
    if (accion == 'DOWN') teclado("ABAJO");
    if (accion == 'ENTER') teclado("ENTER");
}


// --- INICIALIZACION ---

// Inyectar SVGs de las flechas en el DOM
var flechaIzq = document.querySelector('.flecha-nav.izq');
var flechaDer = document.querySelector('.flecha-nav.der');
if (flechaIzq) flechaIzq.innerHTML = svgFlechaIzq;
if (flechaDer) flechaDer.innerHTML = svgFlechaDer;

// Iniciar pantalla
actualizarPantalla();
