const modal = document.getElementById("addProducto");
let productos = JSON.parse(localStorage.getItem("productos")) || [];

const btnSave = document.getElementById("btnSave");
btnSave.onclick = () => {
    const txtNombre = document.getElementById("nombre");
    const txtPrecio = document.getElementById("precio");

    if (txtNombre.value == "" || txtPrecio.value == "") {
        alert("ERROR: CAMPOS VACIOS");
        return;
    }

    productos.push({
        nombre: txtNombre.value,
        precio: txtPrecio.value
    });
    localStorage.setItem("productos", JSON.stringify(productos));

    txtNombre.value = "";
    txtPrecio.value = "";
    modal.close();
    cargarProductos();
};

const cargarProductos = () => {
    let posicion = 0;
    productos = JSON.parse(localStorage.getItem("productos")) || [];
    const tbody = document.getElementById("productos");
    var tabla = "";
    productos.map((producto) => {
        tabla += `<tr class="text-center">
            <td><b>${producto.nombre.toUpperCase()}</b></td>
            <td><b>$ ${parseFloat(producto.precio).toFixed(2)}</b></td>
            <td>
                <button class="btn-solid theme-danger" onclick="eliminarProducto(${posicion})"><i class="bi bi-trash3"></i></button>
                <button class="btn-solid theme-warning" data-bs-toggle="dialog" data-bs-target="#editProducto" onclick="editarProducto(${posicion})"><i class="bi bi-pencil"></i></button>
            </td>
        </tr>`;
        posicion++;
    });
    tbody.innerHTML = tabla;
};
cargarProductos();

const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
        confirmButton: "btn-solid theme-success mx-5",
        cancelButton: "btn-solid theme-danger"
    },
    buttonsStyling: false
});

const eliminarProducto = (posicion) => {
    swalWithBootstrapButtons.fire({
        title: "ELIMINAR REGISTRO",
        text: "Estas seguro de eliminar este registro?",
        icon: "error",
        showCancelButton: true,
        confirmButtonText: '<i class="bi bi-check-lg"></i> SI',
        cancelButtonText: '<i class="bi bi-x-lg"></i> NO',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            productos.splice(posicion, 1);
            localStorage.setItem("productos", JSON.stringify(productos));
            cargarProductos();
            Swal.fire({
                title: "EXITO!!",
                text: "Se elimino correctamente",
                icon: "success",
                confirmButtonText: '<i class="bi bi-check-lg"></i> OK'
            });
        }
    });
};

const editarProducto = (posicion) => {
    const producto = productos[posicion];
    document.getElementById("nombree").value = producto.nombre;
    document.getElementById("precioe").value = producto.precio;
    document.getElementById("posicion").value = posicion;
};

const btnUpdate = document.getElementById("btnUpdate");
btnUpdate.onclick = () => {
    const txtNombre = document.getElementById("nombree");
    const txtPrecio = document.getElementById("precioe");
    const posicion = document.getElementById("posicion");

    if (txtNombre.value == "" || txtPrecio.value == "") {
        alert("ERROR: CAMPOS VACIOS");
        return;
    }

    productos[posicion.value].nombre = txtNombre.value;
    productos[posicion.value].precio = txtPrecio.value;
    localStorage.setItem("productos", JSON.stringify(productos));
    document.getElementById("editProducto").close();
    txtNombre.value = "";
    txtPrecio.value = "";
    cargarProductos();
};