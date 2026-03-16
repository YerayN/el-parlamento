// telegram.js - Centralita de Mensajes

// ⚠️ SUSTITUYE ESTO POR TUS DATOS REALES
const BOT_TOKEN = "8643339853:AAGw_oGcOzNAaXCaWMgt_Gq8yGM8m5QkqlQ"; 
const ID_GRUPO_MUSICA = "-5224466428"; // Pon el ID real de tu grupo de Música
const ID_GRUPO_BARRA = "-5161336286";  // Pon el ID real de tu grupo de Barra

// Esta es la función maestra que usaremos desde toda la web
function enviarMensajeTelegram(canalDestino, mensaje) {
    // Decidimos a qué ID enviarlo según el parámetro
    let chatId = (canalDestino === 'musica') ? ID_GRUPO_MUSICA : ID_GRUPO_BARRA;

    // La URL de la API de Telegram
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    // Los datos que enviamos (en formato JSON)
    const datos = {
        chat_id: chatId,
        text: mensaje,
        parse_mode: 'HTML' // Nos permite usar <b> para negritas en los mensajes
    };

    // Petición POST (El estándar para enviar datos a un servidor)
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(respuesta => {
        if (!respuesta.ok) {
            console.error("Fallo al enviar el mensaje a Telegram");
        }
    })
    .catch(error => {
        console.error("Error de conexión:", error);
    });
}