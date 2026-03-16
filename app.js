// app.js - El cerebro principal de la app

// --- VARIABLES GLOBALES ---
let numeroMesa = "";

// --- 1. INICIALIZACIÓN Y CONTROL DE MESAS (Con caducidad de 6 horas) ---
function inicializarMesa() {
    // Miramos si la URL trae la mesa (ej: clientes.html?mesa=4)
    const parametros = new URLSearchParams(window.location.search);
    let mesaEnUrl = parametros.get('mesa');
    
    // 6 horas en milisegundos (6h * 60m * 60s * 1000ms)
    const TIEMPO_CADUCIDAD = 6 * 60 * 60 * 1000; 
    const ahora = Date.now();

    if (mesaEnUrl) {
        // A) Viene por NFC o QR específico. Manda el enlace.
        numeroMesa = mesaEnUrl;
        localStorage.setItem('mesaParlamento', numeroMesa);
        localStorage.setItem('horaEntradaMesa', ahora); // Fichamos la hora de entrada
    } else {
        // B) No hay enlace específico. Miramos la memoria del móvil.
        let mesaGuardada = localStorage.getItem('mesaParlamento');
        let horaGuardada = localStorage.getItem('horaEntradaMesa');
        
        // Comprobamos si han pasado más de 6 horas
        let hanPasado6Horas = horaGuardada && (ahora - horaGuardada > TIEMPO_CADUCIDAD);

        if (mesaGuardada && !hanPasado6Horas) {
            // Sigue siendo el mismo cliente en la misma sesión
            numeroMesa = mesaGuardada;
        } else {
            // C) Es un cliente nuevo, entró sin enlace, o han pasado más de 6 horas.
            localStorage.removeItem('mesaParlamento'); // Limpiamos por si acaso
            
            numeroMesa = prompt("¡Bienvenido a El Parlamento! 🏛️\n¿En qué número de mesa estás sentado hoy?");
            
            // Si le da a cancelar o no pone nada, le asignamos la barra
            if (!numeroMesa || numeroMesa.trim() === "") {
                numeroMesa = "Barra (Sin número)"; 
            }
            
            // Guardamos los datos nuevos
            localStorage.setItem('mesaParlamento', numeroMesa);
            localStorage.setItem('horaEntradaMesa', ahora);
        }
    }

    // D) Escribimos la mesa en la pantalla para que el cliente lo sepa
    const subtitulo = document.querySelector('.subtitulo');
    if (subtitulo) {
        subtitulo.innerText = `Mesa ${numeroMesa} - Toma el control de tu noche.`;
    }
}

// Función extra de UX: Por si el cliente se equivoca al escribir la mesa a mano
function resetearMesa() {
    localStorage.removeItem('mesaParlamento');
    localStorage.removeItem('horaEntradaMesa');
    location.reload(); // Recargamos la página para que vuelva a preguntar
}

// --- 2. FUNCIONES DE TELEGRAM ---

function enviarCancion() {
    let input = document.getElementById("input-cancion");
    let cancion = input.value;

    if (cancion.trim() === "") {
        alert("¡Escribe una canción primero!");
        return;
    }

    // El mensaje que llegará al DJ
    let mensaje = `🎵 <b>NUEVA PETICIÓN MUSICAL</b>\nLa <b>MESA ${numeroMesa}</b> ha pedido: <i>${cancion}</i>`;
    
    // Llamamos a la centralita (telegram.js)
    enviarMensajeTelegram('musica', mensaje);

    alert("¡Enviado a la cabina del DJ!");
    input.value = ""; 
}

function avisarCamarero(tipo) {
    let mensaje = "";
    
    // Elegimos el texto según el botón pulsado
    if (tipo === 'cuenta') {
        mensaje = `💳 <b>CUENTA SOLICITADA</b>\nLa <b>MESA ${numeroMesa}</b> quiere pagar. Llevad el datáfono.`;
    } else {
        mensaje = `🙋‍♂️ <b>ATENCIÓN EN MESA</b>\nLa <b>MESA ${numeroMesa}</b> necesita pedir algo.`;
    }

    // Llamamos a la centralita (telegram.js)
    enviarMensajeTelegram('barra', mensaje);

    alert("¡Aviso enviado! Enseguida te atienden.");
}

// --- 3. OTRAS FUNCIONES ---

function abrirConsejero() {
    // Llevamos al cliente a la página del Akinator
    window.location.href = "consejero.html";
}

function copiarClaveWifi() {
    // Buscamos el texto oculto de la contraseña
    var clave = document.getElementById("clave-wifi").innerText;
    
    navigator.clipboard.writeText(clave).then(function() {
        var mensaje = document.getElementById("mensaje-copiado");
        mensaje.style.display = "block";
        // Lo ocultamos a los 3 segundos
        setTimeout(function() { mensaje.style.display = "none"; }, 3000);
    });
}

// --- 4. ARRANQUE DEL SISTEMA ---
window.onload = () => {
    inicializarMesa();
};