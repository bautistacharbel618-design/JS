function calcularSalarioNeto() {

    let puesto = parseInt(document.getElementById("puesto").value);
    let horas = parseInt(document.getElementById("horas").value);
    let anios = parseInt(document.getElementById("anios").value);

    let sueldoHora = 0;

    switch (puesto) {
        case 1:
            sueldoHora = 300;
            break;
        case 2:
            sueldoHora = 100;
            break;
        case 3:
            sueldoHora = 120;
            break;
        case 4:
            sueldoHora = 80;    // NUEVO empleado: Intendente
            break;
    }

    // ----- PERCEPCIONES -----
    let sueldoBase = sueldoHora * horas;
    let canastaBasica = sueldoBase * 0.025;
    let apoyo = sueldoBase * 0.05;
    let antiguedad = anios * 150;
    let estimulo = sueldoBase * 0.02;
    let bono = sueldoBase * 0.03;          // NUEVA percepción: Bono de Puntualidad

    let totalPercepciones = sueldoBase + canastaBasica + apoyo + antiguedad + estimulo + bono;

    // ----- DEDUCCIONES -----
    let isr = sueldoBase * 0.15;
    let servicioSalud = sueldoBase * 0.035;
    let afore = sueldoBase * 0.04;
    let sindicato = sueldoBase * 0.01;
    let cajaAhorro = sueldoBase * 0.02;    // NUEVA deducción: Caja de Ahorro

    let totalDeducciones = isr + servicioSalud + afore + sindicato + cajaAhorro;

    // ----- SALARIO NETO -----
    let salarioNeto = totalPercepciones - totalDeducciones;

   
    document.getElementById("sueldoBase").innerHTML = "<h3>$" + sueldoBase.toFixed(2) + "</h3>";
    document.getElementById("canastaBasica").innerHTML = "<h3>$" + canastaBasica.toFixed(2) + "</h3>";
    document.getElementById("apoyo").innerHTML = "<h3>$" + apoyo.toFixed(2) + "</h3>";
    document.getElementById("antiguedad").innerHTML = "<h3>$" + antiguedad.toFixed(2) + "</h3>";
    document.getElementById("estimulo").innerHTML = "<h3>$" + estimulo.toFixed(2) + "</h3>";
    document.getElementById("bono").innerHTML = "<h3>$" + bono.toFixed(2) + "</h3>";

    document.getElementById("totalPercepciones").innerHTML = "<h3>$" + totalPercepciones.toFixed(2) + "</h3>";

    
    document.getElementById("isr").innerHTML = "<h3>$" + isr.toFixed(2) + "</h3>";
    document.getElementById("servicioSalud").innerHTML = "<h3>$" + servicioSalud.toFixed(2) + "</h3>";
    document.getElementById("afore").innerHTML = "<h3>$" + afore.toFixed(2) + "</h3>";
    document.getElementById("sindicato").innerHTML = "<h3>$" + sindicato.toFixed(2) + "</h3>";
    document.getElementById("cajaAhorro").innerHTML = "<h3>$" + cajaAhorro.toFixed(2) + "</h3>";

    document.getElementById("totalDeducciones").innerHTML = "<h3>$" + totalDeducciones.toFixed(2) + "</h3>";

    
    document.getElementById("salarioNeto").innerHTML = "<h3>$" + salarioNeto.toFixed(2) + "</h3>";
}