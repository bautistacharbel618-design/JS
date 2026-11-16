var dialogProducto = document.getElementById("dlgProducto");
var dialogCategoria = document.getElementById("dlgCategoria");
var sidebar = document.getElementById("sidebar");

var productos = JSON.parse(localStorage.getItem("productos")) || [];
var categorias = JSON.parse(localStorage.getItem("categorias")) || [];

function guardarProductos() {
    localStorage.setItem("productos", JSON.stringify(productos));
}

function guardarCategorias() {
    localStorage.setItem("categorias", JSON.stringify(categorias));
}

function leerImagen(file, callback) {
    var reader = new FileReader();
    reader.onload = function () {
        callback(reader.result);
    };
    reader.readAsDataURL(file);
}

function exito(texto) {
    Swal.fire({
        title: "EXITO!!",
        text: texto,
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "coral"
    });
}

function error(texto, destino) {
    Swal.fire({
        title: "ERROR",
        text: texto,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "coral",
        target: destino || document.body
    });
}

function confirmar(texto) {
    var swal = Swal.mixin({
        customClass: {
            confirmButton: "btn-solid theme-success mx-5",
            cancelButton: "btn-solid theme-danger"
        },
        buttonsStyling: false
    });
    return swal.fire({
        title: "ELIMINAR REGISTRO",
        text: texto,
        icon: "error",
        showCancelButton: true,
        confirmButtonText: "SI",
        cancelButtonText: "NO",
        reverseButtons: true
    });
}

document.getElementById("btnMenu").onclick = function () {
    sidebar.classList.toggle("d-none");
};

if (window.innerWidth < 768) {
    sidebar.classList.add("d-none");
}

function mostrarSeccion(idSeccion, idMenu) {
    if (idSeccion === "seccionProductos") {
        document.getElementById("seccionProductos").style.display = "";
        document.getElementById("seccionCategorias").style.display = "none";
    } else {
        document.getElementById("seccionProductos").style.display = "none";
        document.getElementById("seccionCategorias").style.display = "";
    }

    var links = document.querySelectorAll("#sidebar .nav-link");
    for (var i = 0; i < links.length; i++) {
        links[i].classList.remove("active");
    }
    document.getElementById(idMenu).classList.add("active");

    if (window.innerWidth < 768) {
        sidebar.classList.add("d-none");
    }
}

function cargarSelectCategorias(seleccionada) {
    var opciones = "";
    for (var i = 0; i < categorias.length; i++) {
        var sel = "";
        if (categorias[i] === seleccionada) {
            sel = "selected";
        }
        opciones += '<option value="' + categorias[i] + '" ' + sel + '>' + categorias[i] + '</option>';
    }
    document.getElementById("categoria").innerHTML = opciones;
}

function cargarProductos() {
    var tabla = "";
    for (var i = 0; i < productos.length; i++) {
        var p = productos[i];
        var img = "";
        if (p.imagen) {
            img = '<img src="' + p.imagen + '" alt="" width="50" height="50" style="object-fit:cover">';
        }
        tabla += '<tr class="text-center">' +
            '<td>' + img + '</td>' +
            '<td><b>' + p.nombre.toUpperCase() + '</b></td>' +
            '<td><b>' + (p.categoria || "") + '</b></td>' +
            '<td><b>$ ' + parseFloat(p.precio).toFixed(2) + '</b></td>' +
            '<td><b>' + p.stock + '</b></td>' +
            '<td>' +
            '<button class="btn-solid theme-danger" onclick="eliminarProducto(' + i + ')"><i class="bi bi-trash3"></i></button> ' +
            '<button class="btn-solid theme-warning" onclick="editarProducto(' + i + ')"><i class="bi bi-pencil"></i></button>' +
            '</td>' +
            '</tr>';
    }
    document.getElementById("productos").innerHTML = tabla;
}

function limpiarFormProducto() {
    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("stock").value = "";
    document.getElementById("imagen").value = "";
    document.getElementById("posicion").value = "";
    document.getElementById("preview").src = "";
    document.getElementById("preview").style.display = "none";
}

function cerrarProducto() {
    dialogProducto.close();
}

function nuevoProducto() {
    if (categorias.length === 0) {
        error("PRIMERO AGREGA UNA CATEGORIA");
        return;
    }
    limpiarFormProducto();
    cargarSelectCategorias("");
    document.getElementById("tituloProducto").textContent = "AGREGAR PRODUCTO";
    dialogProducto.showModal();
}

function editarProducto(posicion) {
    var p = productos[posicion];
    limpiarFormProducto();
    cargarSelectCategorias(p.categoria);
    document.getElementById("nombre").value = p.nombre;
    document.getElementById("precio").value = p.precio;
    document.getElementById("stock").value = p.stock;
    document.getElementById("posicion").value = posicion;
    if (p.imagen) {
        document.getElementById("preview").src = p.imagen;
        document.getElementById("preview").style.display = "block";
    }
    document.getElementById("tituloProducto").textContent = "EDITAR PRODUCTO";
    dialogProducto.showModal();
}

document.getElementById("imagen").onchange = function () {
    var file = document.getElementById("imagen").files[0];
    if (file) {
        leerImagen(file, function (imagen) {
            document.getElementById("preview").src = imagen;
            document.getElementById("preview").style.display = "block";
        });
    }
};

function guardarProducto(nombre, precio, stock, categoria, posicion, imagen) {
    var producto = {
        nombre: nombre,
        precio: precio,
        stock: stock,
        categoria: categoria,
        imagen: imagen
    };

    if (posicion !== "") {
        productos[posicion] = producto;
    } else {
        productos.push(producto);
    }

    guardarProductos();
    dialogProducto.close();
    cargarProductos();
}

document.getElementById("btnSave").onclick = function () {
    var nombre = document.getElementById("nombre").value.trim();
    var precio = parseFloat(document.getElementById("precio").value);
    var stock = parseInt(document.getElementById("stock").value);
    var categoria = document.getElementById("categoria").value;
    var posicion = document.getElementById("posicion").value;
    var file = document.getElementById("imagen").files[0];

    if (nombre === "" || document.getElementById("precio").value === "" ||
        document.getElementById("stock").value === "" || categoria === "") {
        error("CAMPOS VACIOS", dialogProducto);
        return;
    }
    if (isNaN(precio) || precio < 0 || isNaN(stock) || stock < 0) {
        error("PRECIO Y STOCK DEBEN SER NUMEROS VALIDOS", dialogProducto);
        return;
    }

    if (file) {
        leerImagen(file, function (imagen) {
            guardarProducto(nombre, precio, stock, categoria, posicion, imagen);
        });
    } else {
        var imagenActual = "";
        if (posicion !== "") {
            imagenActual = productos[posicion].imagen || "";
        }
        guardarProducto(nombre, precio, stock, categoria, posicion, imagenActual);
    }
};

function eliminarProducto(posicion) {
    confirmar("Estas seguro de eliminar este registro?").then(function (result) {
        if (result.isConfirmed) {
            productos.splice(posicion, 1);
            guardarProductos();
            cargarProductos();
            exito("Se elimino correctamente");
        }
    });
}

function cargarCategorias() {
    var tabla = "";
    for (var i = 0; i < categorias.length; i++) {
        tabla += '<tr class="text-center">' +
            '<td><b>' + categorias[i].toUpperCase() + '</b></td>' +
            '<td>' +
            '<button class="btn-solid theme-danger" onclick="eliminarCategoria(' + i + ')"><i class="bi bi-trash3"></i></button> ' +
            '<button class="btn-solid theme-warning" onclick="editarCategoria(' + i + ')"><i class="bi bi-pencil"></i></button>' +
            '</td>' +
            '</tr>';
    }
    document.getElementById("categorias").innerHTML = tabla;
}

function cerrarCategoria() {
    dialogCategoria.close();
}

function nuevaCategoria() {
    document.getElementById("nombreCat").value = "";
    document.getElementById("posicionCat").value = "";
    document.getElementById("tituloCategoria").textContent = "AGREGAR CATEGORIA";
    dialogCategoria.showModal();
}

function editarCategoria(posicion) {
    document.getElementById("nombreCat").value = categorias[posicion];
    document.getElementById("posicionCat").value = posicion;
    document.getElementById("tituloCategoria").textContent = "EDITAR CATEGORIA";
    dialogCategoria.showModal();
}

document.getElementById("btnSaveCat").onclick = function () {
    var nombre = document.getElementById("nombreCat").value.trim();
    var posicion = document.getElementById("posicionCat").value;

    if (nombre === "") {
        error("CAMPOS VACIOS", dialogCategoria);
        return;
    }

    var repetida = false;
    for (var i = 0; i < categorias.length; i++) {
        if (categorias[i].toLowerCase() === nombre.toLowerCase() && i != posicion) {
            repetida = true;
        }
    }
    if (repetida) {
        error("LA CATEGORIA YA EXISTE", dialogCategoria);
        return;
    }

    if (posicion !== "") {
        var anterior = categorias[posicion];
        for (var j = 0; j < productos.length; j++) {
            if (productos[j].categoria === anterior) {
                productos[j].categoria = nombre;
            }
        }
        categorias[posicion] = nombre;
        guardarProductos();
    } else {
        categorias.push(nombre);
    }

    guardarCategorias();
    dialogCategoria.close();
    cargarCategorias();
    cargarProductos();
};

function eliminarCategoria(posicion) {
    var nombre = categorias[posicion];

    for (var i = 0; i < productos.length; i++) {
        if (productos[i].categoria === nombre) {
            error("HAY PRODUCTOS CON ESTA CATEGORIA");
            return;
        }
    }

    confirmar("Estas seguro de eliminar esta categoria?").then(function (result) {
        if (result.isConfirmed) {
            categorias.splice(posicion, 1);
            guardarCategorias();
            cargarCategorias();
            exito("Se elimino correctamente");
        }
    });
}

cargarCategorias();
cargarProductos();