// Variable que mantiene el estado visible del carrito
let carritoVisible = false;

// Espera a que el documento cargue completamente
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

function ready() {
    // 1) Botones “Eliminar” iniciales
    actualizarListenersEliminar();

    // 2) Botones “+” y “–”
    document.querySelectorAll('.sumar-cantidad')
      .forEach(btn => btn.addEventListener('click', sumarCantidad));
    document.querySelectorAll('.restar-cantidad')
      .forEach(btn => btn.addEventListener('click', restarCantidad));

    // 3) Botones “Agregar al carrito”
    document.querySelectorAll('.boton-item')
      .forEach(btn => btn.addEventListener('click', agregarAlCarritoClicked));

    // 4) Botón “Pagar”
    document.querySelector('.btn-pagar')
      .addEventListener('click', pagarClicked);

    // 5) Botón “Quitar seleccionados”
    document.querySelector('.btn-quitar-seleccionados')
      .addEventListener('click', quitarSeleccionados);

    // 6) Efecto hover en imágenes
    document.querySelectorAll('.img-item').forEach(img => {
        const original = img.src;
        const hoverSrc = img.dataset.hover;
        if (!hoverSrc) return;
        img.addEventListener('mouseover', () => img.src = hoverSrc);
        img.addEventListener('mouseout',  () => img.src = original);
    });
}

// (Re)asocia listeners a TODOS los .btn-eliminar
function actualizarListenersEliminar() {
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.removeEventListener('click', eliminarItemCarrito);
        btn.addEventListener('click', eliminarItemCarrito);
    });
}

function agregarAlCarritoClicked(event) {
    const button = event.target;
    const item = button.parentElement;
    const titulo = item.querySelector('.titulo-item').innerText;
    const precio = item.querySelector('.precio-item').innerText;
    const imagenSrc = item.querySelector('.img-item').src;

    agregarItemAlCarrito(titulo, precio, imagenSrc);
    hacerVisibleElCarrito();
}

function hacerVisibleElCarrito() {
    if (!carritoVisible) {
        const carrito = document.querySelector('.carrito');
        carrito.style.marginRight = '0';
        carrito.style.opacity = '1';
        document.querySelector('.contenedor-items').style.width = '60%';
        carritoVisible = true;
    }
}

function agregarItemAlCarrito(titulo, precio, imagenSrc) {
    const itemsCarrito = document.querySelector('.carrito-items');
    
    // Si existe, solo aumentamos la cantidad
    for (let t of itemsCarrito.getElementsByClassName('carrito-item-titulo')) {
        if (t.innerText === titulo) {
            const input = t.closest('.carrito-item')
                           .querySelector('.carrito-item-cantidad');
            input.value = parseInt(input.value) + 1;
            actualizarTotalCarrito();
            return;
        }
    }

    // Creamos el nuevo bloque con checkbox
    const item = document.createElement('div');
    item.classList.add('carrito-item');
    item.innerHTML = `
      <input type="checkbox" class="carrito-item-select">
      <img src="${imagenSrc}" width="80px" alt="">
      <div class="carrito-item-detalles">
        <span class="carrito-item-titulo">${titulo}</span>
        <div class="selector-cantidad">
          <i class="fa-solid fa-minus restar-cantidad"></i>
          <input type="text" value="1" class="carrito-item-cantidad" disabled>
          <i class="fa-solid fa-plus sumar-cantidad"></i>
        </div>
        <span class="carrito-item-precio">${precio}</span>
      </div>
      <span class="btn-eliminar"><i class="fa-solid fa-trash"></i></span>
    `;
    itemsCarrito.append(item);

    // Asociamos listeners al nuevo ítem
    item.querySelector('.restar-cantidad')
        .addEventListener('click', restarCantidad);
    item.querySelector('.sumar-cantidad')
        .addEventListener('click', sumarCantidad);
    item.querySelector('.btn-eliminar')
        .addEventListener('click', eliminarItemCarrito);

    actualizarTotalCarrito();
}

function pagarClicked() {
    alert("¡Gracias Por Tu Compra!");
    const carritoItems = document.querySelector('.carrito-items');
    while (carritoItems.firstChild) {
        carritoItems.removeChild(carritoItems.firstChild);
    }
    actualizarTotalCarrito();
    ocultarCarrito();
}

function quitarSeleccionados() {
    document.querySelectorAll('.carrito-item-select:checked')
      .forEach(chk => chk.closest('.carrito-item').remove());
    actualizarTotalCarrito();
    if (document.querySelectorAll('.carrito-item').length === 0) {
        ocultarCarrito();
    }
}

function actualizarTotalCarrito() {
    let total = 0;
    document.querySelectorAll('.carrito-item').forEach(item => {
        const precioEl = item.querySelector('.carrito-item-precio').innerText;
        const precio = parseFloat(
          precioEl.replace('S/','').replace(/\./g,'').replace(',','.')
        );
        const cantidad = parseInt(item.querySelector('.carrito-item-cantidad').value);
        total += precio * cantidad;
    });
    document.querySelector('.carrito-precio-total')
            .innerText = 'S/' + total.toFixed(2);
}

function eliminarItemCarrito(event) {
    event.target.closest('.carrito-item').remove();
    actualizarTotalCarrito();
    if (document.querySelectorAll('.carrito-item').length === 0) {
        ocultarCarrito();
    }
}

function ocultarCarrito() {
    document.querySelector('.carrito').style.marginRight = '-100%';
    document.querySelector('.carrito').style.opacity = '0';
    document.querySelector('.contenedor-items').style.width = '100%';
    carritoVisible = false;
}

function sumarCantidad(event) {
    const input = event.target.parentElement
                     .querySelector('.carrito-item-cantidad');
    input.value = parseInt(input.value) + 1;
    actualizarTotalCarrito();
}

function restarCantidad(event) {
    const input = event.target.parentElement
                     .querySelector('.carrito-item-cantidad');
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
        actualizarTotalCarrito();
    }
}