document.addEventListener('DOMContentLoaded', function() {
    const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTgqTz-PTP82zELhGzcqHwLIIx2cYpOBZAKG_n-w8H_uVnz92jvmiMSV_DOreQw_gdu4lmXk-YN9R5t/pub?gid=1976652293&single=true&output=csv';

    fetch(CSV_URL)
        .then(response => response.text())
        .then(csvText => {
            const datos = parseCSV(csvText);
            mostrarDatos(datos);
        })
        .catch(error => {
            console.error('Error al cargar CSV:', error);
            document.getElementById('contenedor-calendario').textContent = 'Error al cargar datos.';
        });

    function parseCSV(texto) {
        const lineas = texto.trim().split('\n');
        const encabezados = lineas[0].split(',');
        return lineas.slice(1).map(linea => {
            const valores = linea.split(',');
            let obj = {};
            encabezados.forEach((enc, i) => obj[enc.trim()] = valores[i]);
            return obj;
        });
    }

    function mostrarDatos(datos) {
        const contenedor = document.getElementById('contenedor-calendario');
        contenedor.innerHTML = '';
        const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

        dias.forEach(dia => {
            const divDia = document.createElement('div');
            divDia.className = 'dia';
            divDia.innerHTML = `<h3>${dia}</h3>`;

            const actividades = datos.filter(d => d.DiaSemana === dia);
            actividades.forEach(act => {
                const div = document.createElement('div');
                div.className = 'actividad';
                if (act.Check === 'TRUE' || act.Check === 'true') div.classList.add('completada');
                div.textContent = act.Actividad;
                divDia.appendChild(div);
            });

            contenedor.appendChild(divDia);
        });
    }
});
