let productoEditado = null;

const formulario = document.getElementById('productForm')
const casilleroNombre = document.getElementById('productName')
const casilleroPrecio = document.getElementById('productPrice')
const tablaCuerpo = document.getElementById('productBody')
const botonAgregar = document.getElementById('addProductButton')
const botonEditar = document.getElementById('editProductButton')


// URL de la API JSON Server
const apiUrl = 'http://localhost:3000/productos';

//Eventos click
formulario.addEventListener('submit', agregarProducto)

botonEditar.addEventListener('click', editarProducto)

async function agregarProducto(event) {
    event.preventDefault();

    const NombreProducto = casilleroNombre.value.trim();
    const PrecioProducto = parseFloat(casilleroPrecio.value.trim());

    try {
        const nuevoProducto = {
            id: Date.now().toString(),
            name: NombreProducto,
            price: PrecioProducto
        };

        await axios.post(apiUrl, nuevoProducto);

        mostrarProductos();
        formulario.reset();
    }
    catch (error) {
        console.error('Error al agregar el producto:', error);
    }
}

async function mostrarProductos() {
    try {
        // Realiza una solicitud GET para obtener la lista de productos desde la API
        const basedatos = await axios.get(apiUrl);
        // Obtiene la lista de productos
        const listaProductos = basedatos.data;

        // Limpiar el contenido existente de la tabla
        tablaCuerpo.innerHTML = '';

        // Recorre sobre cada producto en la lista de producto y lo agrega a la tabla
        listaProductos.forEach(
            function (producto) {

                const fila = document.createElement('tr');

                // Crear columnas para el nombre y el precio del producto
                const columnaNombre = document.createElement('td');
                columnaNombre.textContent = producto.name;

                const columnaPrecio = document.createElement('td');
                columnaPrecio.textContent = producto.price.toFixed(2);

                // Crear una columna para el botón "Eliminar"
                const columnaAcciones = document.createElement('td');

                const botonSelecionar = document.createElement('button')
                botonSelecionar.textContent = "Seleccionar"
                botonSelecionar.classList.add = "select"

                botonSelecionar.addEventListener('click', function () {
                    SeleccionarProductos(producto.id, listaProductos);
                })

                const botonEliminar = document.createElement('button');
                botonEliminar.textContent = 'Eliminar';
                botonEliminar.classList.add('delete')

                botonEliminar.addEventListener('click', function () {
                    eliminarProductos(producto.id);
                })

                columnaAcciones.appendChild(botonSelecionar);
                columnaAcciones.appendChild(botonEliminar);

                // Adjuntar las columnas a la fila
                fila.appendChild(columnaNombre);
                fila.appendChild(columnaPrecio);
                fila.appendChild(columnaAcciones);

                // Adjuntar la fila al cuerpo de la tabla
                tablaCuerpo.appendChild(fila);
            })
    }
    catch (error) {
        console.error('Error al obtener la lista de productos:', error);
    }
}

function SeleccionarProductos(productoId, listaProductos) {
    productoEditado = productoId;// Guarda el ID del producto seleccionado
    // Busca el producto correspondiente en la lista de productos
    const productoAeditar = listaProductos.find(producto => producto.id === productoId)

    if (productoAeditar) {
        casilleroNombre.value = productoAeditar.name;
        casilleroPrecio.value = productoAeditar.price.toFixed(2);

        botonEditar.style.display = "inline-block";
        botonAgregar.style.display = "none"
    }
}

async function editarProducto() {

    const NuevoProducto = casilleroNombre.value.trim();
    const NuevoPrecio = parseFloat(casilleroPrecio.value.trim())

    if (NuevoProducto && NuevoPrecio && productoEditado) {
        try {
            // Crea un objeto con los nuevos valores del producto
            const productoActualizado = {
                name: NuevoProducto,
                price: NuevoPrecio
            };
            // Realiza una solicitud PUT para actualizar el producto en la API
            await axios.put(`${apiUrl}/${productoEditado}`, productoActualizado)

            // Reinicia el ID de producto editado
            productoEditado = null;
            // Oculta el botón "Editar Producto" y muestra el botón "Agregar Producto"
            botonEditar.style.display = "none"
            botonAgregar.style.display = "inline-block"

            // muestra la lista actualizada de productos en la tabla y limpia el formulario
            mostrarProductos();
            formulario.reset();
        }
        catch (error) {
            console.error('Error al editar el producto:', error);
        }

    }
}

async function eliminarProductos(productoId) {
    try {
        await axios.delete(`${apiUrl}/${productoId}`)

        mostrarProductos();
    }
    catch (error) {
        console.error('Error al eliminar el producto:', error);
    }

}

mostrarProductos()


