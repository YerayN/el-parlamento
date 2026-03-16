// --- VARIABLES DEL JUEGO ---
let votosActuales = 0;
const metaVotos = 50;
let puedeVotar = true; 

// TIEMPO DE BLOQUEO: 1 minuto (60.000 milisegundos)
const TIEMPO_COOLDOWN = 60000; 

// Elementos del DOM (la pantalla)
const barraProgreso = document.getElementById('barra-progreso');
const contadorVotos = document.getElementById('contador-votos');
const btnVotar = document.getElementById('btn-votar');
const mensajeCooldown = document.getElementById('mensaje-cooldown');

// --- NUEVO: FUNCIÓN QUE SE EJECUTA AL ENTRAR A LA PÁGINA ---
function cargarMemoria() {
    // 1. Cargamos los votos que hubiera guardados en este móvil
    let votosGuardados = localStorage.getItem('votosJuegoJams');
    if (votosGuardados) {
        votosActuales = parseInt(votosGuardados);
        actualizarInterfaz();
    }

    // 2. Comprobamos si el usuario estaba castigado (en cooldown)
    let bloqueoHasta = localStorage.getItem('bloqueoJamsHasta');
    if (bloqueoHasta) {
        let ahora = Date.now(); // Hora exacta en este milisegundo
        if (ahora < bloqueoHasta) {
            // Aún no ha pasado el minuto. Calculamos cuánto le queda
            let tiempoRestante = bloqueoHasta - ahora;
            aplicarCooldown(tiempoRestante);
        } else {
            // Ya pasó el tiempo, limpiamos la memoria
            localStorage.removeItem('bloqueoJamsHasta');
        }
    }
}

function registrarVoto() {
    if (!puedeVotar) return; 

    if (votosActuales >= metaVotos) {
        alert("¡La meta ya se ha alcanzado! La banda está brindando.");
        return;
    }

    // Sumamos el voto
    votosActuales++;
    actualizarInterfaz();
    
    // Guardamos los votos en la memoria del móvil (hasta que usemos base de datos)
    localStorage.setItem('votosJuegoJams', votosActuales);

    if (votosActuales === metaVotos) {
        lanzarVictoria();
        return; 
    }

    // --- NUEVO: GUARDAMOS A QUÉ HORA PODRÁ VOLVER A VOTAR ---
    let horaDesbloqueo = Date.now() + TIEMPO_COOLDOWN;
    localStorage.setItem('bloqueoJamsHasta', horaDesbloqueo);

    // Bloqueamos el botón el tiempo estipulado (1 minuto)
    aplicarCooldown(TIEMPO_COOLDOWN);
}

function actualizarInterfaz() {
    let porcentaje = (votosActuales / metaVotos) * 100;
    if (porcentaje > 100) porcentaje = 100;

    barraProgreso.style.width = porcentaje + '%';
    contadorVotos.innerText = votosActuales;
}

// Modificamos esta función para que acepte los milisegundos que le quedan
function aplicarCooldown(tiempoEspera) {
    puedeVotar = false; 
    
    btnVotar.classList.add('boton-bloqueado');
    btnVotar.innerText = "⏳ Recargando energía...";
    mensajeCooldown.innerText = "Para evitar spam, espera 1 minuto entre votos.";
    mensajeCooldown.style.opacity = "1"; 

    // El temporizador que lo desbloquea cuando pasa el tiempo
    setTimeout(() => {
        puedeVotar = true;
        btnVotar.classList.remove('boton-bloqueado');
        btnVotar.innerText = "🔥 ¡DAR CAÑA!";
        mensajeCooldown.style.opacity = "0";
        // Limpiamos la memoria para que sepa que ya está libre
        localStorage.removeItem('bloqueoJamsHasta'); 
    }, tiempoEspera); 
}

function lanzarVictoria() {
    btnVotar.classList.add('boton-bloqueado');
    btnVotar.style.background = "linear-gradient(135deg, #FE9400 0%, #ffc163 100%)";
    btnVotar.innerText = "🎉 ¡RETO CONSEGUIDO! 🎉";
    contadorVotos.style.color = "var(--accent-orange)";
    
    // --- NUEVO: Enviamos aviso a Telegram ---
    let mensaje = `🔥🎸 <b>¡TERREMOTO EN LAS JAMS!</b>\nEl público ha llegado a la meta de votos. ¡Toca invitar a una ronda a la banda!`;
    enviarMensajeTelegram('musica', mensaje);
    
    if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200, 100, 500]); 
    }
}

// Arrancamos el juego y leemos la memoria al abrir la página
window.onload = () => {
    cargarMemoria();
};