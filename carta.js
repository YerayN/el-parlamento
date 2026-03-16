// --- 1. BASE DE DATOS DE EL PARLAMENTO ---
const baseDeDatosPlatos = [
    // CERVEZAS
    { categoria: "Cervezas", nombre: "Cerveza de Barril (Media Pinta)", descripcion: "Rubia, fría y directa al grano.", precio: "2.50€", alergenos: ["Gluten"] },
    { categoria: "Cervezas", nombre: "IPA 'El Filibustero'", descripcion: "Artesana local. Amarga y con toques frutales.", precio: "4.50€", alergenos: ["Gluten"] },
    { categoria: "Cervezas", nombre: "Stout 'Noche Oscura'", descripcion: "Negra con matices de café y chocolate.", precio: "4.50€", alergenos: ["Gluten"] },
    
    // CÓCTELES Y COPAS
    { categoria: "Cócteles", nombre: "Mojito Clásico", descripcion: "Ron añejo, hierbabuena fresca y lima. Un acierto seguro.", precio: "7.00€", alergenos: [] },
    { categoria: "Cócteles", nombre: "Gin Tonic Premium", descripcion: "Ginebra de la casa con tónica de pimienta rosa.", precio: "8.00€", alergenos: [] },
    
    // PARA PICAR (Comida de Pub)
    { categoria: "Para Picar", nombre: "Nachos Supremos", descripcion: "Con queso fundido, jalapeños, guacamole y pico de gallo.", precio: "9.50€", alergenos: ["Lactosa"] },
    { categoria: "Para Picar", nombre: "Patatas 'Bravas de Verdad'", descripcion: "Salsa picante secreta de la casa. Pican lo justo y necesario.", precio: "6.00€", alergenos: [] },
    { categoria: "Para Picar", nombre: "Tiras de Pollo Crujiente", descripcion: "Rebozado casero con salsa de mostaza y miel.", precio: "7.50€", alergenos: ["Gluten", "Huevo"] },
    
    // BURGERS
    { categoria: "Burgers", nombre: "La Burger Americana", descripcion: "Doble burger de ternera, doble bacon y queso cheddar.", precio: "12.00€", alergenos: ["Gluten", "Lactosa", "Huevo"] },
    { categoria: "Burgers", nombre: "La Vegana Salvaje", descripcion: "Hamburguesa Beyond Meat, pan cristal y veganesa.", precio: "11.50€", alergenos: ["Gluten"] }
];

// --- 2. LÓGICA DE FILTRADO Y RENDERIZADO ---
let categoriaActual = "Todos";
const todasLasCategorias = ["Todos", "Cervezas", "Cócteles", "Para Picar", "Burgers"];

function pintarBotonesCategorias() {
    let contenedor = document.getElementById("barra-categorias");
    contenedor.innerHTML = "";

    todasLasCategorias.forEach(cat => {
        let btn = document.createElement("button");
        btn.className = "btn-categoria";
        if (cat === categoriaActual) btn.classList.add("activo");
        btn.innerText = cat;
        
        btn.onclick = () => {
            categoriaActual = cat;
            pintarBotonesCategorias(); 
            aplicarFiltros(); 
        };
        
        contenedor.appendChild(btn);
    });
}

function pintarCarta(listaDePlatos) {
    let contenedor = document.getElementById("contenedor-carta");
    contenedor.innerHTML = "";

    if (listaDePlatos.length === 0) {
        contenedor.innerHTML = "<p style='text-align:center; color:#ccc; margin-top:40px; font-size:15px;'>🍽️ Ningún plato coincide con tus filtros de alergias en esta categoría.</p>";
        return;
    }

    for (let plato of listaDePlatos) {
        let textoAlergenos = plato.alergenos.length > 0 
            ? `⚠️ Contiene: ${plato.alergenos.join(", ")}` 
            : `<span class="sin-alergenos">✅ Sin alérgenos marcados</span>`;

        let htmlPlato = `
            <div class="plato">
                <div class="plato-titulo">
                    <h3>${plato.nombre}</h3>
                    <span class="precio">${plato.precio}</span>
                </div>
                <p class="descripcion">${plato.descripcion}</p>
                <div class="alergenos-lista">${textoAlergenos}</div>
            </div>
        `;
        contenedor.innerHTML += htmlPlato;
    }
}

function aplicarFiltros() {
    let checkboxesMarcados = document.querySelectorAll('input[type="checkbox"]:checked');
    let alergiasDelCliente = Array.from(checkboxesMarcados).map(box => box.value);

    let platosFiltrados = baseDeDatosPlatos.filter(plato => {
        // Filtro de Categoría
        if (categoriaActual !== "Todos" && plato.categoria !== categoriaActual) return false;

        // Filtro de Alergias
        for (let alergia of alergiasDelCliente) {
            if (plato.alergenos.includes(alergia)) return false; 
        }
        
        return true; 
    });

    pintarCarta(platosFiltrados);
}

// Arrancar al cargar la página
window.onload = () => {
    pintarBotonesCategorias();
    aplicarFiltros();
};