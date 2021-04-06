let pagina = 1;

const carritoCat = {
    categorias: []
}

const carrito = {
    
    productos: []
}


document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    mostrarCategorias();
    mostrarProductos();

    //Resalta el DIV actual segun el tab al que se preciona
    mostrarSeccion();

    // Oculta o muestra una seccion segun el tab al que se preciona
    cambiarSeccion();

    //Paginacion siguiente y anterior
    paginaSiguiente();

    paginaAnterior();

    //comprueba la pagina actual para ocultar o mostrar la paginacion
    botonesPaginador();

    

    // muestra el resumen de la cita o mensaje de error
    mostrarResumen();
}

function mostrarSeccion() {

    //Eliminar mostrar-seccion de la seccion anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if (seccionAnterior) {
        seccionAnterior.classList.remove('mostrar-seccion');
    }
    

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    //Eliminar la clase de actual en el tab anterior
    const tabAnterior = document.querySelector('.tabs .actual');
    if (tabAnterior) {
        tabAnterior.classList.remove('actual');
    }
    

    // Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
}

function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button');

    enlaces.forEach( enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();

            pagina = parseInt(e.target.dataset.paso);


            //llamar la funcion de mostrar seccion
            mostrarSeccion();

            botonesPaginador();
        });
    });
}

async function mostrarCategorias() {
    try {
        const resultado = await fetch('./prueba.json');
        const db = await resultado.json();

        const {categories} = db;

        // Generar el HTML
        categories.forEach( categorie => {
            const {categori_id, name} = categorie;

            //Dom Scripting
            // Generar nombre de la categoria
            const nombreCategoria = document.createElement('P');
            nombreCategoria.textContent = name;
            nombreCategoria.classList.add('nombre-categoria');

            //Generar DIV contenedor de categoria
            const categoriaDiv = document.createElement('DIV');
            categoriaDiv.classList.add('categoria');

            //Selecciona una categoria
            categoriaDiv.onclick = seleccionarCategoria;
            categoriaDiv.dataset.idCategoria = categori_id;

            // Inyectar precio y nombre al DIV de categoria
            categoriaDiv.appendChild(nombreCategoria);

            // Inyectarlo al HTML
            document.querySelector('#categorias').appendChild(categoriaDiv);

            
        });
    } catch (error) {
        console.log(error);
    }
}

async function mostrarProductos() {
     try {
        const resultado = await fetch('./prueba.json');
        const db = await resultado.json();

        const {products} = db;

        // Generar el HTML
        products.forEach( product =>  {
        const { id, name, price, available, best_seller, categories } = product;

        //Dom Scripting
        // Generar nombre del producto
        const nombreProducto = document.createElement('P');
        nombreProducto.textContent = name;
        nombreProducto.classList.add('nombre-producto');

        const precioProducto = document.createElement('P');
        precioProducto.textContent = `$ ${price}`;
        precioProducto.classList.add('precio-producto');

        const availableProducto = document.createElement('P');
        availableProducto.textContent = available;
        availableProducto.classList.add('available-producto');

        const bestSellerProducto = document.createElement('P');
        bestSellerProducto.textContent = best_seller;
        bestSellerProducto.classList.add('bestseller-producto');

        const categoriesProducto = document.createElement('P');
        categoriesProducto.textContent = categories;
        categoriesProducto.classList.add('categories-producto');

        //Generar DIV contenedor de producto
        const productoDiv = document.createElement('DIV');
        productoDiv.classList.add('producto');

        //Selecciona una categoria
        productoDiv.onclick = seleccionarProducto;
        productoDiv.dataset.idProducto = id;

        // Inyectar precio y nombre al DIV de categoria
        productoDiv.appendChild(nombreProducto);
        productoDiv.appendChild(precioProducto);
        productoDiv.appendChild(availableProducto);
        productoDiv.appendChild(bestSellerProducto);
        productoDiv.appendChild(categoriesProducto);

        // Inyectarlo al HTML
        document.querySelector('#productos').appendChild(productoDiv);

        });

    } catch (error) {
        console.log(error);
    }
}

function seleccionarCategoria(e) {

    let elemento;
    // Forzar que el elemento al cual le damos click sea el DIV

    if(e.target.tagName === 'P') {

        elemento = e.target.parentElement;
        
    } else {
        elemento = e.target;
    }

    if (elemento.classList.contains('seleccionado')) {
        elemento.classList.remove('seleccionado');

        const id = parseInt(elemento.dataset.idCategoria);

        //eliminarProducto(id);
    } else {
        elemento.classList.add('seleccionado');

        //console.log(elemento.firstElementChild.nextElementSibling.nextElementSibling.textContent);

        const categoriaObj = {
            id: parseInt(elemento.dataset.idCategoria),
            nombre: elemento.firstElementChild.textContent
        }
        //console.log(categoriaObj);
        //agregarProducto(categoriaObj);
    }
    
}

function seleccionarProducto(e) {
    
    let elemento;
    // Forzar que el elemento al cual le damos click sea el DIV

    if(e.target.tagName === 'P') {

        elemento = e.target.parentElement;
        
    } else {
        elemento = e.target;
    }

    if (elemento.classList.contains('seleccionado')) {
        elemento.classList.remove('seleccionado');

        const id = parseInt(elemento.dataset.idProducto);

        eliminarProducto(id);
    } else {
        elemento.classList.add('seleccionado');

        //console.log(elemento.firstElementChild.nextElementSibling.nextElementSibling.textContent);

        const productoObj = {
            id: parseInt(elemento.dataset.idProducto),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent,
            available: elemento.firstElementChild.nextElementSibling.nextElementSibling.textContent,
            bestseller: elemento.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.textContent,
            categories: elemento.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.textContent
        }
        //console.log(productoObj);
        agregarProducto(productoObj);
    }    

}

function eliminarProducto(id) {
    const {productos} = carrito;
    carrito.productos = productos.filter( producto => producto.id !== id);

    //console.log(carrito);
}

function agregarProducto(productoObj) {
    const {productos} = carrito;

    carrito.productos = [...productos, productoObj];

    //console.log(carrito);
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;

        //console.log(pagina);

        botonesPaginador();
    });
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;

        //console.log(pagina);

        botonesPaginador();
    });
}

function botonesPaginador() {
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if (pagina === 1) {
        paginaAnterior.classList.add('ocultar-boton');
    }  else if(pagina === 3) {
        paginaSiguiente.classList.add('ocultar-boton');
        paginaAnterior.classList.remove('ocultar-boton');

        mostrarResumen();
    } else {
        paginaAnterior.classList.remove('ocultar-boton');
        paginaSiguiente.classList.remove('ocultar-boton');
        
    }

    mostrarSeccion(); //Cambia la seccion
}

function mostrarResumen() {
    
    // Destructuring
    const {productos} = carrito;

    //seleccionar el resumen
    const resumenDiv = document.querySelector('.contenido-resumen');

    //limpia el HTML previo
    while(resumenDiv.firstChild) {
        resumenDiv.removeChild(resumenDiv.firstChild);
    }

    // Validacion de objeto
    if (Object.values(carrito).includes([''])) {
        
        const noProductos = document.createElement('P');
        noProductos.textContent = 'No ha Seleccionado algun Producto';

        noProductos.classList.add('invalidar-carrito');

        //Agregar a resumen DIV
        resumenDiv.appendChild(noProductos);
     } else {

        const productosCarrito = document.createElement('DIV');
        productosCarrito.classList.add('resumen-productos');

        const headingProductos = document.createElement('H3');
        headingProductos.textContent = 'Resumen de Productos';

        productosCarrito.appendChild(headingProductos);

        let cantidad = 0;

        //iterar sobre el arreglo de productos
        productos.forEach( producto => {

            const {nombre, precio} = producto;
            const contenedorProducto = document.createElement('DIV');
            contenedorProducto.classList.add('contenedor-producto');

            const textoProducto = document.createElement('P');
            textoProducto.textContent = nombre;

            const precioProducto = document.createElement('P');
            precioProducto.textContent = precio;
            precioProducto.classList.add('precio');

            const totalProducto = precio.split('$');
            //console.log(parseInt(totalProducto[1].trim()));

            cantidad += parseInt(totalProducto[1].trim());

            //colocar texto y precio en el DIV
            contenedorProducto.appendChild(textoProducto);
            contenedorProducto.appendChild(precioProducto);


            productosCarrito.appendChild(contenedorProducto);
        });

        resumenDiv.appendChild(productosCarrito);

        const cantidadPagar = document.createElement('P');
        cantidadPagar.classList.add('total');
        cantidadPagar.innerHTML = `<span>Total a Pagar: </span>$ ${cantidad}.000`;

        resumenDiv.appendChild(cantidadPagar);
     }
}





