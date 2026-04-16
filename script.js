document.addEventListener('DOMContentLoaded', function() {
    // 🔁 REEMPLAZA CON TU URL DE APPS SCRIPT
    const API_URL = 'https://script.google.com/macros/s/AKfycby.../exec';

    fetch(API_URL)
        .then(response => response.json())
        .then(datos => {
            construirCalendarioMatricial(datos);
            // Aquí más adelante cargaremos los hábitos
        })
        .catch(error => {
            console.error('Error al cargar datos:', error);
            document.getElementById('contenedor-calendario').textContent = '⚠️ Error al cargar los datos.';
        });

    function construirCalendarioMatricial(datos) {
        const contenedor = document.getElementById('contenedor-calendario');
        contenedor.innerHTML = '';

        // Extraer horas únicas (formato "HH:MM")
        const horasUnicas = [...new Set(datos.map(d => {
            const fecha = new Date(d.FechaHora);
            return fecha.getHours().toString().padStart(2,'0') + ':' + fecha.getMinutes().toString().padStart(2,'0');
        }))].sort((a, b) => {
            const [hA, mA] = a.split(':').map(Number);
            const [hB, mB] = b.split(':').map(Number);
            return hA * 60 + mA - (hB * 60 + mB);
        });

        const dias = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
        const diasAbrev = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

        // Crear el grid
        const grid = document.createElement('div');
        grid.className = 'calendario-grid';

        // Encabezado de la columna de hora
        const headerHora = document.createElement('div');
        headerHora.className = 'calendario-header';
        headerHora.textContent = 'Hora';
        grid.appendChild(headerHora);

        // Encabezados de días
        dias.forEach((_, idx) => {
            const headerDia = document.createElement('div');
            headerDia.className = 'calendario-header';
            headerDia.textContent = diasAbrev[idx];
            grid.appendChild(headerDia);
        });

        // Construir filas por cada hora
        horasUnicas.forEach(horaStr => {
            // Celda de la hora
            const celdaHora = document.createElement('div');
            celdaHora.className = 'calendario-hora';
            celdaHora.textContent = horaStr;
            grid.appendChild(celdaHora);

            // Para cada día, buscar actividad correspondiente
            dias.forEach(dia => {
                const celda = document.createElement('div');
                celda.className = 'calendario-celda';

                const actividad = datos.find(d => {
                    const fecha = new Date(d.FechaHora);
                    const hora = fecha.getHours().toString().padStart(2,'0') + ':' + fecha.getMinutes().toString().padStart(2,'0');
                    return hora === horaStr && d.DiaSemana === dia;
                });

                if (actividad) {
                    const divAct = document.createElement('div');
                    divAct.className = 'actividad-item';
                    
                    // Estado completado
                    const estaCompletado = (actividad.Check === true || actividad.Check === 'TRUE' || actividad.Check === 'true');
                    if (estaCompletado) {
                        divAct.classList.add('completada');
                    }

                    // Indicador visual del check
                    const indicador = document.createElement('span');
                    indicador.className = 'check-indicador';
                    indicador.textContent = estaCompletado ? '✅' : '⬜';

                    // Texto de la actividad
                    const texto = document.createElement('span');
                    texto.className = 'actividad-texto';
                    texto.textContent = actividad.Actividad || '—';

                    divAct.appendChild(indicador);
                    divAct.appendChild(texto);

                    // Evento click para toggle visual (luego conectaremos con Apps Script)
                    divAct.addEventListener('click', function(e) {
                        e.stopPropagation();
                        toggleCheckVisual(divAct, actividad);
                        // TODO: enviar actualización a Google Sheets
                    });

                    celda.appendChild(divAct);
                } else {
                    celda.textContent = '—';
                    celda.classList.add('celda-vacia');
                }

                grid.appendChild(celda);
            });
        });

        contenedor.appendChild(grid);
    }

    function toggleCheckVisual(elemento, actividad) {
        const estaCompletado = elemento.classList.contains('completada');
        if (estaCompletado) {
            elemento.classList.remove('completada');
            elemento.querySelector('.check-indicador').textContent = '⬜';
        } else {
            elemento.classList.add('completada');
            elemento.querySelector('.check-indicador').textContent = '✅';
        }
        // Aquí luego llamaremos a la API para guardar el cambio
        console.log(`Toggle actividad: ${actividad.Actividad} -> ${!estaCompletado}`);
    }
});
