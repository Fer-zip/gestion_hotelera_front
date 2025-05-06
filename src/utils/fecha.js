function obtenerFechaActualYYYYMMDD() {
    const hoy = new Date();
    const año = hoy.getFullYear();
    let mes = hoy.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
    let dia = hoy.getDate();
  
    // Añadir un cero delante si el mes o el día son menores de 10
    if (mes < 10) {
      mes = '0' + mes;
    }
    if (dia < 10) {
      dia = '0' + dia;
    }
  
    return `${año}-${mes}-${dia}`;
  }

function obtenerFechaActualYYYYMMDDMasSemana() {
    const hoy = new Date();
    hoy.setDate(hoy.getDate() + 7); // Sumamos un día
  
    const año = hoy.getFullYear();
    let mes = hoy.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
    let dia = hoy.getDate();
  
    // Añadir un cero delante si el mes o el día son menores de 10
    if (mes < 10) {
      mes = '0' + mes;
    }
    if (dia < 10) {
      dia = '0' + dia;
    }
  
    return `${año}-${mes}-${dia}`;
  }

export {obtenerFechaActualYYYYMMDD, obtenerFechaActualYYYYMMDDMasSemana}