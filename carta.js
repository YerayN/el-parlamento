const baseDeDatosPlatos = [
    { categoria: "Cervezas", nombre: "Estrella Galicia", descripcion: "Clásica, rubia y súper refrescante.", precio: "2.50€", alergenos: ["Gluten"] },
    { categoria: "Cervezas", nombre: "BrewDog Punk IPA", descripcion: "Explosión de lúpulo, amarga y con carácter.", precio: "4.50€", alergenos: ["Gluten"] },
    { categoria: "Cervezas", nombre: "Guinness Draught", descripcion: "Negra, espuma cremosa, sabor a café.", precio: "4.50€", alergenos: ["Gluten"] },
    { categoria: "Cócteles", nombre: "Mojito Clásico", descripcion: "Ron añejo, hierbabuena fresca y lima.", precio: "7.00€", alergenos: [] },
    { categoria: "Cócteles", nombre: "Gin Tonic Premium", descripcion: "Ginebra de la casa con tónica.", precio: "8.00€", alergenos: [] },
    { categoria: "Para Picar", nombre: "Nachos Supremos", descripcion: "Con queso fundido, jalapeños, guacamole.", precio: "9.50€", alergenos: ["Lactosa"] },
    { categoria: "Para Picar", nombre: "Patatas 'Bravas de Verdad'", descripcion: "Salsa picante secreta de la casa.", precio: "6.00€", alergenos: [] },
    { categoria: "Para Picar", nombre: "Tiras de Pollo Crujiente", descripcion: "Rebozado casero con salsa de mostaza.", precio: "7.50€", alergenos: ["Gluten", "Huevo"] },
    { categoria: "Burgers", nombre: "La Burger Americana", descripcion: "Doble burger, doble bacon y queso cheddar.", precio: "12.00€", alergenos: ["Gluten", "Lactosa", "Huevo"] },
    { categoria: "Burgers", nombre: "La Vegana Salvaje", descripcion: "Hamburguesa Beyond Meat, pan cristal.", precio: "11.50€", alergenos: ["Gluten"] }
];

let alergenosSeleccionados = [];
let categoriaActiva = "Todos";

// NUEVA ESTRUCTURA DEL CARRITO (Un diccionario para agrupar)
let carrito = {}; // Ejemplo: { "Mojito Clásico": { precio: 7.00, cantidad: 2 } }
let totalCarrito = 0;
let totalArticulos = 0;

function mostrarPlatos() {
    const contenedor = document.getElementById("contenedor-carta");
    contenedor.innerHTML = "";

    baseDeDatosPlatos.forEach(plato => {
        if (categoriaActiva !== "Todos" && plato.categoria !== categoriaActiva) return;

        let tieneAlergenoProhibido = alergenosSeleccionados.some(alergeno => plato.alergenos.includes(alergeno));
        if (tieneAlergenoProhibido) return;

        let alergenosHTML = plato.alergenos.length > 0 
            ? `<div class="alergenos-lista">⚠️ ${plato.alergenos.join(", ")}</div>` 
            : `<div class="sin-alergenos">✅ Sin alérgenos a destacar</div>`;

        // LÓGICA DEL SELECTOR INTELIGENTE
        let cantidadActual = carrito[plato.nombre] ? carrito[plato.nombre].cantidad : 0;
        let controlesHTML = "";

        if (cantidadActual > 0) {
            controlesHTML = `
                <div class="controles-cantidad">
                    <button class="btn-qty" onclick="restarDelCarrito('${plato.nombre}')">➖</button>
                    <span class="qty-numero">${cantidadActual}</span>
                    <button class="btn-qty" onclick="agregarAlCarrito('${plato.nombre}', '${plato.precio}')">➕</button>
                </div>
            `;
        } else {
            controlesHTML = `
                <button class="btn-add-initial" onclick="agregarAlCarrito('${plato.nombre}', '${plato.precio}')">➕</button>
            `;
        }

        let html = `
            <div class="plato">
                <div class="plato-titulo">
                    <h3>${plato.nombre}</h3>
                    <span class="precio">${plato.precio}</span>
                </div>
                <p class="descripcion">${plato.descripcion}</p>
                ${alergenosHTML}
                
                <div style="text-align: right; margin-top: 5px;">
                    ${controlesHTML}
                </div>
            </div>
        `;
        contenedor.innerHTML += html;
    });
}

function renderizarCategorias() {
    const barra = document.getElementById("barra-categorias");
    let categorias = ["Todos", ...new Set(baseDeDatosPlatos.map(p => p.categoria))];

    barra.innerHTML = "";
    categorias.forEach(cat => {
        let claseActiva = (cat === categoriaActiva) ? "activo" : "";
        barra.innerHTML += `<button class="btn-categoria ${claseActiva}" onclick="cambiarCategoria('${cat}')">${cat}</button>`;
    });
}

function cambiarCategoria(nuevaCategoria) {
    categoriaActiva = nuevaCategoria;
    renderizarCategorias();
    mostrarPlatos();
}

function aplicarFiltros() {
    const checkboxes = document.querySelectorAll('.etiqueta-filtro input');
    alergenosSeleccionados = [];
    checkboxes.forEach(chk => { if (chk.checked) alergenosSeleccionados.push(chk.value); });
    mostrarPlatos();
}

// --- GESTIÓN DEL CARRITO AGRUPADO ---

function vibrar() {
    if (navigator.vibrate) navigator.vibrate(50); // El fuá físico
}

function agregarAlCarrito(nombre, precioString) {
    vibrar();
    let precioNumerico = parseFloat(precioString.replace("€", ""));
    
    if (!carrito[nombre]) {
        carrito[nombre] = { precio: precioNumerico, cantidad: 0 };
    }
    carrito[nombre].cantidad++;
    
    actualizarTotales();
    mostrarPlatos(); // Refrescamos para que se vea el numerito
    
    // Si el modal está abierto, lo actualizamos en tiempo real
    if (!document.getElementById('modal-carrito').classList.contains('modal-oculto')) {
        abrirCarrito();
    }
}

function restarDelCarrito(nombre) {
    vibrar();
    if (carrito[nombre]) {
        carrito[nombre].cantidad--;
        if (carrito[nombre].cantidad <= 0) {
            delete carrito[nombre]; // Si llega a 0, lo borramos del diccionario
        }
        
        actualizarTotales();
        mostrarPlatos();
        
        if (!document.getElementById('modal-carrito').classList.contains('modal-oculto')) {
            abrirCarrito();
        }
    }
}

function actualizarTotales() {
    totalCarrito = 0;
    totalArticulos = 0;
    
    for (let nombre in carrito) {
        totalCarrito += carrito[nombre].precio * carrito[nombre].cantidad;
        totalArticulos += carrito[nombre].cantidad;
    }
    
    const flotante = document.getElementById('carrito-flotante');
    const contador = document.getElementById('carrito-contador');
    const totalTexto = document.getElementById('carrito-total');
    
    if (totalArticulos > 0) {
        flotante.classList.remove('carrito-oculto');
        contador.innerText = `🛒 ${totalArticulos} artículos`;
        totalTexto.innerText = `${totalCarrito.toFixed(2)}€`;
    } else {
        flotante.classList.add('carrito-oculto');
        cerrarCarrito(); // Si se vacía desde el modal, lo cerramos
    }
}

function abrirCarrito() {
    const modal = document.getElementById('modal-carrito');
    const lista = document.getElementById('lista-carrito');
    const totalModal = document.getElementById('total-modal');
    
    lista.innerHTML = ""; 
    
    if (totalArticulos === 0) return;

    for (let nombre in carrito) {
        let item = carrito[nombre];
        let subtotal = (item.precio * item.cantidad).toFixed(2);
        
        lista.innerHTML += `
            <div class="item-carrito">
                <div style="flex-grow: 1;">
                    <span style="font-weight: 600; color: #fff;">${item.cantidad}x</span> ${nombre}
                </div>
                <div style="display: flex; align-items: center; gap: 15px;">
                    <span style="color: var(--text-heading);">${subtotal}€</span>
                    <div class="controles-cantidad modal-qty">
                        <button class="btn-qty" onclick="restarDelCarrito('${nombre}')">➖</button>
                        <button class="btn-qty" onclick="agregarAlCarrito('${nombre}', '${item.precio}€')">➕</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    totalModal.innerText = totalCarrito.toFixed(2);
    modal.classList.remove('modal-oculto');
}

function cerrarCarrito() {
    document.getElementById('modal-carrito').classList.add('modal-oculto');
}

// --- EL DISPARO A TELEGRAM ---
function enviarComandaTelegram() {
    if (totalArticulos === 0) return;

    let mesa = localStorage.getItem('mesaBarCode') || "Barra (Desconocida)";
    let notas = document.getElementById('notas-comanda').value.trim();
    
    let mensaje = `📋 <b>¡NUEVA COMANDA!</b>\n`;
    mensaje += `📍 <b>MESA:</b> ${mesa}\n`;
    mensaje += `---------------------------\n`;
    
    // Ahora ya está agrupado por defecto en nuestro diccionario
    for (let nombre in carrito) {
        mensaje += `▪️ <b>${carrito[nombre].cantidad}x</b> ${nombre}\n`;
    }
    
    mensaje += `---------------------------\n`;
    
    if (notas !== "") {
        mensaje += `💬 <b>NOTAS:</b> <i>${notas}</i>\n`;
        mensaje += `---------------------------\n`;
    }

    mensaje += `💰 <b>TOTAL: ${totalCarrito.toFixed(2)}€</b>`;

    if (typeof enviarMensajeTelegram === "function") {
         enviarMensajeTelegram('barra', mensaje);
         alert("¡Comanda enviada a barra! En breve te lo preparamos.");
         
         // Limpiamos todo tras el pedido
         carrito = {};
         document.getElementById('notas-comanda').value = "";
         actualizarTotales();
         mostrarPlatos();
    } else {
         alert("Hubo un error de conexión con la barra.");
    }
}

// --- ARRANQUE ---
document.addEventListener('DOMContentLoaded', () => {
    renderizarCategorias();
    mostrarPlatos();
});