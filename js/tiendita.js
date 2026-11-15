const $ = (id) => document.getElementById(id);
const dialogProducto = $("dlgProducto");
const dialogCategoria = $("dlgCategoria");

let productos = JSON.parse(localStorage.getItem("productos")) || [];
let categorias = JSON.parse(localStorage.getItem("categorias")) || [];

const guardarProductos = () => localStorage.setItem("productos", JSON.stringify(productos));
const guardarCategorias = () => localStorage.setItem("categorias", JSON.stringify(categorias));

const escapar = (txt) => String(txt).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const leerImagen = (file) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
});

const exito = (texto) => Swal.fire({
    title: "EXITO!!",
    text: texto,
    icon: "success",
    confirmButtonText: "OK",
    confirmButtonColor: "coral"
});

const error = (texto, destino = document.body) => Swal.fire({
    title: "ERROR",
    text: texto,
    icon: "error",
    confirmButtonText: "OK",
    confirmButtonColor: "coral",
    target: destino
});

const confirmar = (texto) => {
    const swal = Swal.mixin({
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
};

const sidebar = $("sidebar");

$("btnMenu").onclick = () => sidebar.classList.toggle("d-none");

if (window.innerWidth < 768) sidebar.classList.add("d-none");

const mostrarSeccion = (idSeccion, idMenu) => {
    $("seccionProductos").style.display = idSeccion === "seccionProductos" ? "" : "none";
    $("seccionCategorias").style.display = idSeccion === "seccionCategorias" ? "" : "none";

    document.querySelectorAll("#sidebar .nav-link").forEach((a) => a.classList.remove("active"));
    $(idMenu).classList.add("active");

    if (window.innerWidth < 768) sidebar.classList.add("d-none");
};

const cargarSelectCategorias = (seleccionada = "") => {
    $("categoria").innerHTML = categorias
        .map((c) => `<option value="${escapar(c)}" ${c === seleccionada ? "selected" : ""}>${escapar(c)}</option>`)
        .join("");
};

const cargarProductos = () => {
    let tabla = "";
    productos.forEach((p, i) => {
        tabla += `<tr class="text-center">
            <td>${p.imagen ? `<img src="${p.imagen}" alt="" width="50" height="50" style="object-fit:cover">` : ""}</td>
            <td><b>${escapar(p.nombre).toUpperCase()}</b></td>
            <td><b>${escapar(p.categoria || "")}</b></td>
            <td><b>$ ${parseFloat(p.precio).toFixed(2)}</b></td>
            <td><b>${p.stock}</b></td>
            <td>
                <button class="btn-solid theme-danger" onclick="eliminarProducto(${i})"><i class="bi bi-trash3"></i></button>
                <button class="btn-solid theme-warning" onclick="editarProducto(${i})"><i class="bi bi-pencil"></i></button>
            </td>
        </tr>`;
    });
    $("productos").innerHTML = tabla;
};

const limpiarFormProducto = () => {
    $("nombre").value = "";
    $("precio").value = "";
    $("stock").value = "";
    $("imagen").value = "";
    $("posicion").value = "";
    $("preview").src = "";
    $("preview").style.display = "none";
};

const cerrarProducto = () => dialogProducto.close();

const nuevoProducto = () => {
    if (categorias.length === 0) {
        error("PRIMERO AGREGA UNA CATEGORIA");
        return;
    }
    limpiarFormProducto();
    cargarSelectCategorias();
    $("tituloProducto").textContent = "AGREGAR PRODUCTO";
    dialogProducto.showModal();
};

const editarProducto = (posicion) => {
    const p = productos[posicion];
    limpiarFormProducto();
    cargarSelectCategorias(p.categoria);
    $("nombre").value = p.nombre;
    $("precio").value = p.precio;
    $("stock").value = p.stock;
    $("posicion").value = posicion;
    if (p.imagen) {
        $("preview").src = p.imagen;
        $("preview").style.display = "block";
    }
    $("tituloProducto").textContent = "EDITAR PRODUCTO";
    dialogProducto.showModal();
};

$("imagen").onchange = async () => {
    const file = $("imagen").files[0];
    if (file) {
        $("preview").src = await leerImagen(file);
        $("preview").style.display = "block";
    }
};

$("btnSave").onclick = async () => {
    const nombre = $("nombre").value.trim();
    const precio = parseFloat($("precio").value);
    const stock = parseInt($("stock").value);
    const categoria = $("categoria").value;
    const posicion = $("posicion").value;
    const file = $("imagen").files[0];

    if (nombre === "" || $("precio").value === "" || $("stock").value === "" || categoria === "") {
        error("CAMPOS VACIOS", dialogProducto);
        return;
    }
    if (isNaN(precio) || precio < 0 || isNaN(stock) || stock < 0) {
        error("PRECIO Y STOCK DEBEN SER NUMEROS VALIDOS", dialogProducto);
        return;
    }

    const esEdicion = posicion !== "";
    let imagen = esEdicion ? (productos[posicion].imagen || "") : "";
    if (file) imagen = await leerImagen(file);

    const producto = { nombre, precio, stock, categoria, imagen };

    const respaldo = JSON.stringify(productos);
    if (esEdicion) productos[posicion] = producto;
    else productos.push(producto);

    try {
        guardarProductos();
    } catch (e) {
        productos = JSON.parse(respaldo);
        error("NO HAY ESPACIO, USA UNA IMAGEN MAS PEQUEÑA", dialogProducto);
        return;
    }

    dialogProducto.close();
    cargarProductos();
};

const eliminarProducto = (posicion) => {
    confirmar("Estas seguro de eliminar este registro?").then((result) => {
        if (result.isConfirmed) {
            productos.splice(posicion, 1);
            guardarProductos();
            cargarProductos();
            exito("Se elimino correctamente");
        }
    });
};

const cargarCategorias = () => {
    let tabla = "";
    categorias.forEach((c, i) => {
        tabla += `<tr class="text-center">
            <td><b>${escapar(c).toUpperCase()}</b></td>
            <td>
                <button class="btn-solid theme-danger" onclick="eliminarCategoria(${i})"><i class="bi bi-trash3"></i></button>
                <button class="btn-solid theme-warning" onclick="editarCategoria(${i})"><i class="bi bi-pencil"></i></button>
            </td>
        </tr>`;
    });
    $("categorias").innerHTML = tabla;
};

const cerrarCategoria = () => dialogCategoria.close();

const nuevaCategoria = () => {
    $("nombreCat").value = "";
    $("posicionCat").value = "";
    $("tituloCategoria").textContent = "AGREGAR CATEGORIA";
    dialogCategoria.showModal();
};

const editarCategoria = (posicion) => {
    $("nombreCat").value = categorias[posicion];
    $("posicionCat").value = posicion;
    $("tituloCategoria").textContent = "EDITAR CATEGORIA";
    dialogCategoria.showModal();
};

$("btnSaveCat").onclick = () => {
    const nombre = $("nombreCat").value.trim();
    const posicion = $("posicionCat").value;

    if (nombre === "") {
        error("CAMPOS VACIOS", dialogCategoria);
        return;
    }

    const repetida = categorias.some((c, i) =>
        c.toLowerCase() === nombre.toLowerCase() && String(i) !== posicion);
    if (repetida) {
        error("LA CATEGORIA YA EXISTE", dialogCategoria);
        return;
    }

    if (posicion !== "") {
        const anterior = categorias[posicion];
        productos.forEach((p) => { if (p.categoria === anterior) p.categoria = nombre; });
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

const eliminarCategoria = (posicion) => {
    const nombre = categorias[posicion];
    if (productos.some((p) => p.categoria === nombre)) {
        error("HAY PRODUCTOS CON ESTA CATEGORIA");
        return;
    }
    confirmar("Estas seguro de eliminar esta categoria?").then((result) => {
        if (result.isConfirmed) {
            categorias.splice(posicion, 1);
            guardarCategorias();
            cargarCategorias();
            exito("Se elimino correctamente");
        }
    });
};

cargarCategorias();
cargarProductos();