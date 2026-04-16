document.addEventListener('DOMContentLoaded', function() {
    // URL de tu hoja publicada como CSV
    const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTgqTz-PTP82zELhGzcqHwLIIx2cYpOBZAKG_n-w8H_uVnz92jvmiMSV_DOreQw_gdu4lmXk-YN9R5t/pub?gid=1976652293&single=true&output=csv';

    fetch(CSV_URL)
        .then(response => {
            if (!response.ok) throw new Error('No se pudo cargar el CSV');
            return response.text();
        })
        .then(csvText => {
            const datos = parseCSV(csvText);
            mostrarDatos(datos);
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('contenedor-calendario').textContent = 'Error al cargar datos.';
        });

    function parseCSV(texto) {
        const lineas = texto.trim().split('\n');
        if (lineas.length < 2) return [];
        const encabezados = lineas[0].split(',').map(h => h.trim());
        return lineas.slice(1).map(linea => {
            const valores = linea.split(',').map(v => v.trim());
            let obj = {};
            encabezados.forEach((enc, i) => {
                obj[enc] = valores[i];
            });
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
            
            // Ajusta "DiaSemana" si tu encabezado es diferente (ej: "diasemana")
            const actividades = datos.filter(item => item.DiaSemana === dia);
            
            actividades.forEach(act => {
                const divAct = document.createElement('div');
                divAct.className = 'actividad';
                // Ajusta "Check" y "Actividad" según tus encabezados
                if (act.Check === 'TRUE' || act.Check === 'true') {
                    divAct.classList.add('completada');
                }
                divAct.textContent = act.Actividad;
                divDia.appendChild(divAct);
            });
            
            contenedor.appendChild(divDia);
        });
    }
});
