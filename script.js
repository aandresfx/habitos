document.addEventListener('DOMContentLoaded', function() {
    // URL original de tu CSV
    const CSV_URL_ORIGINAL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTgqTz-PTP82zELhGzcqHwLIIx2cYpOBZAKG_n-w8H_uVnz92jvmiMSV_DOreQw_gdu4lmXk-YN9R5t/pub?gid=1976652293&single=true&output=csv';
    
    // Usamos un proxy CORS público (allorigins.win)
    const PROXY_URL = 'https://api.allorigins.win/raw?url=';
    const CSV_URL = PROXY_URL + encodeURIComponent(CSV_URL_ORIGINAL);

    fetch(CSV_URL)
        .then(response => {
            if (!response.ok) throw new Error('Error de red');
            return response.text();
        })
        .then(csvText => {
            const datos = parseCSV(csvText);
            mostrarDatos(datos);
        })
        .catch(error => {
            console.error('Error al cargar los datos:', error);
            document.getElementById('contenedor-calendario').textContent = '⚠️ Error al cargar datos. Intenta recargar.';
        });

    function parseCSV(texto) {
        const lineas = texto.trim().split('\n');
        if (lineas.length < 2) return [];
        
        // Obtenemos los encabezados de la primera línea
        const encabezados = lineas[0].split(',').map(h => h.trim());
        
        const datos = [];
        for (let i = 1; i < lineas.length; i++) {
            const valores = lineas[i].split(',').map(v => v.trim());
            const obj = {};
            encabezados.forEach((enc, idx) => {
                obj[enc] = valores[idx] || '';
            });
            datos.push(obj);
        }
        return datos;
    }

    function mostrarDatos(datos) {
        const contenedor = document.getElementById('contenedor-calendario');
        contenedor.innerHTML = '';
        
        const dias = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
        
        dias.forEach(dia => {
            const divDia = document.createElement('div');
            divDia.className = 'dia';
            divDia.innerHTML = `<h3>${dia.charAt(0) + dia.slice(1).toLowerCase()}</h3>`;
            
            const actividadesDelDia = datos.filter(item => item.DiaSemana === dia);
            
            actividadesDelDia.forEach(act => {
                const divAct = document.createElement('div');
                divAct.className = 'actividad';
                
                // Verificar si está completado
                if (act.Check === 'TRUE' || act.Check === 'true') {
                    divAct.classList.add('completada');
                }
                
                // Mostrar actividad o un placeholder si está vacía
                divAct.textContent = act.Actividad || '⏳';
                divDia.appendChild(divAct);
            });
            
            contenedor.appendChild(divDia);
        });
    }
});
