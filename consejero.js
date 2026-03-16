// --- 1. BASE DE DATOS DE CERVEZAS (Catálogo Ampliado) ---
const cervezas = [
    // LIGERAS Y REFRESCANTES
    {
        nombre: "Estrella Galicia",
        descripcion: "Clásica, rubia y súper refrescante. Nunca falla cuando hay sed.",
        imagen: "🍺",
        tags: ["ligera", "refrescante", "sed"]
    },
    {
        nombre: "Mort Subite Kriek",
        descripcion: "Cerveza de fermentación espontánea con cerezas. Dulce, afrutada y muy ligera.",
        imagen: "🍒",
        tags: ["ligera", "dulce", "sed"]
    },
    {
        nombre: "Mahou Session IPA",
        descripcion: "Todo el aroma y amargor de una IPA, pero ligerita para beberte tres.",
        imagen: "🌿",
        tags: ["ligera", "amarga", "sed"]
    },
    {
        nombre: "Murphy's Irish Red",
        descripcion: "Roja, suave y con un ligero toque a caramelo tostado. Entra sola.",
        imagen: "🏮",
        tags: ["ligera", "tostada", "sed"]
    },

    // FUERTES Y PARA DEGUSTAR
    {
        nombre: "Alhambra Reserva 1925",
        descripcion: "Intensa, con cuerpo y ese punto de alcohol que pide beberla a tragos cortos.",
        imagen: "🍾",
        tags: ["fuerte", "refrescante", "degustar"]
    },
    {
        nombre: "BrewDog Punk IPA",
        descripcion: "Una explosión de lúpulo. Amarga, potente y con mucho carácter.",
        imagen: "🍻",
        tags: ["fuerte", "amarga", "degustar"]
    },
    {
        nombre: "Voll-Damm Doble Malta",
        descripcion: "Cuerpo robusto, color ámbar y un sabor tostado inconfundible.",
        imagen: "🛡️",
        tags: ["fuerte", "tostada", "degustar"]
    },
    {
        nombre: "Delirium Tremens",
        descripcion: "Cerveza belga mítica. Rubia, pero engañosamente dulce y con muchísimo grado.",
        imagen: "🐘",
        tags: ["fuerte", "dulce", "degustar"]
    },

    // OSCURAS Y MISTERIOSAS
    {
        nombre: "Guinness Draught",
        descripcion: "Negra, densa, con espuma cremosa y sabor a café tostado. Un ritual.",
        imagen: "🖤",
        tags: ["oscura", "tostada", "degustar"]
    },
    {
        nombre: "Leffe Brune",
        descripcion: "Cerveza de abadía oscura. Dulce, con notas a ciruela y caramelo. ¡Tu match perfecto!",
        imagen: "🍷",
        tags: ["oscura", "dulce", "degustar"]
    },
    {
        nombre: "Black IPA (Artesana)",
        descripcion: "El color de una Stout pero con el bofetón amargo y lupulado de una IPA.",
        imagen: "🦇",
        tags: ["oscura", "amarga", "degustar"]
    },
    {
        nombre: "Bock Damm",
        descripcion: "Cerveza negra estilo Múnich. Torrefacta pero sorprendentemente ligera y refrescante.",
        imagen: "🏴‍☠️",
        tags: ["oscura", "refrescante", "sed"]
    }
];

// --- 2. LAS PREGUNTAS DEL JUEGO ---
const preguntas = [
    {
        texto: "¿Qué cuerpo te pide la noche?",
        opciones: [
            { texto: "Algo suave, voy de tranquis", tag: "ligera" },
            { texto: "Dame caña, algo con cuerpo", tag: "fuerte" },
            { texto: "Me siento oscuro y misterioso", tag: "oscura" }
        ]
    },
    {
        texto: "¿Qué sabor te hace más tilín ahora mismo?",
        opciones: [
            { texto: "Que amargue un poco, como la vida", tag: "amarga" },
            { texto: "Dulce o afrutado, soy goloso", tag: "dulce" },
            { texto: "Tostado, rollo café o caramelo", tag: "tostada" },
            { texto: "Me da igual, solo quiero que refresque", tag: "refrescante" }
        ]
    },
    {
        texto: "¿Cuál es tu misión principal con esta copa?",
        opciones: [
            { texto: "Apagar la sed del desierto", tag: "sed" },
            { texto: "Saborearla tranquilamente charlando", tag: "degustar" }
        ]
    }
];

// --- 3. VARIABLES DE ESTADO (La memoria del juego) ---
let preguntaActualIndex = 0;
let tagsDelUsuario = []; // Aquí guardaremos las etiquetas que vaya eligiendo

// --- 4. FUNCIONES DEL JUEGO ---

// Dibuja la pregunta actual en la pantalla
function mostrarPregunta() {
    const cajaJuego = document.getElementById("caja-juego");
    const indicador = document.getElementById("indicador-progreso");
    
    // Obtenemos los datos de la pregunta actual
    const pregunta = preguntas[preguntaActualIndex];
    
    // Actualizamos el indicador (Ej: Pregunta 1 de 3)
    indicador.innerText = `Pregunta ${preguntaActualIndex + 1} de ${preguntas.length}`;

    // Generamos el HTML de la pregunta y sus botones
    let html = `<h3 style="margin-top:0; font-size:18px;">${pregunta.texto}</h3>`;
    
    // Creamos un botón por cada opción
    pregunta.opciones.forEach(opcion => {
        // Al hacer clic, llamamos a la función responder y le pasamos el tag
        html += `<button class="boton" onclick="responder('${opcion.tag}')">${opcion.texto}</button>`;
    });

    cajaJuego.innerHTML = html;
}

// Guarda la respuesta y avanza
function responder(tagElegido) {
    // Guardamos la etiqueta de lo que ha elegido
    tagsDelUsuario.push(tagElegido);
    
    // Avanzamos a la siguiente pregunta
    preguntaActualIndex++;
    
    // Comprobamos si quedan más preguntas
    if (preguntaActualIndex < preguntas.length) {
        mostrarPregunta();
    } else {
        calcularResultado();
    }
}

// El algoritmo que decide la cerveza ganadora
function calcularResultado() {
    let cervezaGanadora = null;
    let maximaPuntuacion = -1;

    // Comparamos los tags del usuario con cada cerveza
    cervezas.forEach(cerveza => {
        let puntuacion = 0;
        
        // Por cada tag de la cerveza, miramos si el usuario lo ha elegido
        cerveza.tags.forEach(tag => {
            if (tagsDelUsuario.includes(tag)) {
                puntuacion++;
            }
        });

        // Si esta cerveza tiene más puntos que la anterior, se convierte en la ganadora
        if (puntuacion > maximaPuntuacion) {
            maximaPuntuacion = puntuacion;
            cervezaGanadora = cerveza;
        }
    });

    mostrarResultado(cervezaGanadora);
}

// Dibuja la pantalla final
function mostrarResultado(cerveza) {
    const cajaJuego = document.getElementById("caja-juego");
    const indicador = document.getElementById("indicador-progreso");
    
    indicador.innerText = "¡Habemus Ganadora!";

    const html = `
        <div style="background-color: #1a1a1a; padding: 20px; border-radius: 15px; border: 1px solid var(--accent-orange); text-align: center; animation: fadeIn 0.5s;">
            <div style="font-size: 50px; margin-bottom: 10px;">${cerveza.imagen}</div>
            <h2 style="color: var(--accent-orange); margin: 0 0 10px 0;">${cerveza.nombre}</h2>
            <p style="font-size: 14px; color: #ccc; margin-bottom: 20px;">${cerveza.descripcion}</p>
            <button class="boton boton-verde" onclick="pedirEnBarra()">¡Me la pido!</button>
            <button class="boton boton-oscuro" onclick="reiniciarJuego()" style="margin-top: 10px;">Jugar otra vez</button>
        </div>
    `;

    cajaJuego.innerHTML = html;
}

function pedirEnBarra() {
    alert("¡Genial! Enséñale esta pantalla al camarero o pídelo desde la sección de 'Llamar Camarero'.");
}

function reiniciarJuego() {
    preguntaActualIndex = 0;
    tagsDelUsuario = [];
    mostrarPregunta();
}

// Arrancamos el juego al cargar la página
window.onload = () => {
    mostrarPregunta();
};