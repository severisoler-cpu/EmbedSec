// animacion de la bolita del diagrama de deauth
// aprendido de un tutorial de youtube sobre animaciones con javascript

var paquete = document.getElementById('paquete-deauth');
var flecha = document.getElementById('flecha-deauth');
var posicion = 0;

setInterval(function() {
    posicion = posicion + 2;

    // cuando llega al final de la flecha, vuelve al principio
    if (posicion >= flecha.offsetWidth - 20) {
        posicion = 0;
    }

    paquete.style.left = posicion + 'px';
}, 16);
