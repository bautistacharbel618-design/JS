let temporizador;

const spinner = document.createElement("img");
spinner.src = "img/load.gif";
spinner.alt = "Cargando...";
spinner.style.display = "none";
spinner.style.width = "80px";
spinner.style.margin = "auto";

document.querySelector("#imc").before(spinner);

function calcular() {
    let peso = parseFloat(document.querySelector("#peso").value);
    let cm = parseFloat(document.querySelector("#estatura").value);
    let m = cm / 100;

    document.querySelector("#vp").innerHTML = `<b style="color:red">${peso}</b>`;
    document.querySelector("#ve").innerHTML = `<b style="color:green">${cm}</b>`;

    spinner.style.display = "block";
    document.querySelector("#imc").innerHTML = "";

    quitar();
    clearTimeout(temporizador);

    temporizador = setTimeout(function() {
        let imc = peso / (m * m);

        document.querySelector("#imc").innerHTML = imc.toFixed(2);
        spinner.style.display = "none";

        let fila;

        if (imc < 18.5) {
            fila = "#bajo";
        } else if (imc < 25) {
            fila = "#normal";
        } else if (imc < 30) {
            fila = "#sobrepeso";
        } else if (imc < 35) {
            fila = "#obesidad1";
        } else if (imc < 40) {
            fila = "#obesidad2";
        } else {
            fila = "#obesidad3";
        }

        document.querySelector(fila).style.opacity = "1";
        document.querySelector(fila).style.outline = "3px solid black";

    }, 1000);
}

function quitar() {
    let filas = document.querySelectorAll(".rounded");

    for (let i = 0; i < filas.length; i++) {
        filas[i].style.opacity = "";
        filas[i].style.outline = "";
    }
}

function reset() {
    clearTimeout(temporizador);

    document.querySelector("#peso").value = 20;
    document.querySelector("#estatura").value = 100;

    document.querySelector("#vp").innerHTML = "20";
    document.querySelector("#ve").innerHTML = "100";
    document.querySelector("#imc").innerHTML = "";

    spinner.style.display = "none";

    quitar();
}

document.querySelector("#peso").addEventListener("input", calcular);
document.querySelector("#estatura").addEventListener("input", calcular);
document.querySelector("#reset").addEventListener("click", reset);