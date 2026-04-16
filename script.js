document.addEventListener('DOMContentLoaded', function() {
    // 🔁 PEGA AQUÍ LA NUEVA URL DE TU APLICACIÓN WEB DE APPS SCRIPT
    const API_URL = 'https://script.google.com/macros/s/AKfycbycZ06CZl5KYickqE-z0Tt6Mpi0NTK7F6oDb3VDcDKTmgzYKtmtq17-MvGLdhyZda9HxQ/exec';

    let datosGlobales = []; // Por si queremos usarlos después

    // Cargar datos iniciales
    fetch(API_URL)
        .then(response => {
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            return response.json();
        })
        .then(datos => {
            datosGlobales = datos;
            construirCalendarioMatricial(datos);
        })
        .catch(error => {
            console.error('Error al cargar datos:', error);
            document.getElementById('contenedor-calendario').textContent = '⚠️ Error al cargar los datos.';
        });

    function construirCalendarioMatricial(datos) {
        const contenedor = document.getElementById('contenedor-calendario');
        contenedor.innerHTML = '';

        // Extraer horas únicas ordenadas
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

        const grid = document.createElement('div');
        grid.className = 'calendario-grid';

        // Encabezados
        const headerHora = document.createElement('div');
        headerHora.className = 'calendario-header';
        headerHora.textContent = 'Hora';
        grid.appendChild(headerHora);

        dias.forEach((_, idx) => {
            const headerDia = document.createElement('div');
            headerDia.className = 'calendario-header';
            headerDia.textContent = diasAbrev[idx];
            grid.appendChild(headerDia);
        });

        // Filas por cada hora
        horasUnicas.forEach(horaStr => {
            const celdaHora = document.createElement('div');
            celdaHora.className = 'calendario-hora';
            celdaHora.textContent = horaStr;
            grid.appendChild(celdaHora);

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
                    
                    const estaCompletado = (actividad.Check === true || actividad.Check === 'TRUE' || actividad.Check === 'true');
                    if (estaCompletado) divAct.classList.add('completada');

                    const indicador = document.createElement('span');
                    indicador.className = 'check-indicador';
                    indicador.textContent = estaCompletado ? '✅' : '⬜';

                    const texto = document.createElement('span');
                    texto.className = 'actividad-texto';
                    texto.textContent = actividad.Actividad || '—';

                    divAct.appendChild(indicador);
                    divAct.appendChild(texto);

                    // Evento clic para actualizar check
                    divAct.addEventListener('click', function(e) {
                        e.stopPropagation();
                        const nuevoEstado = !divAct.classList.contains('completada');
                        
                        // Actualización visual optimista
                        if (nuevoEstado) {
                            divAct.classList.add('completada');
                            indicador.textContent = '✅';
                        } else {
                            divAct.classList.remove('completada');
                            indicador.textContent = '⬜';
                        }

                        // Enviar al servidor
                        enviarActualizacion(actividad.FechaHora, actividad.DiaSemana, nuevoEstado)
                            .catch(error => {
                                console.error('Error al guardar:', error);
                                // Revertir cambio visual
                                if (nuevoEstado) {
                                    divAct.classList.remove('completada');
                                    indicador.textContent = '⬜';
                                } else {
                                    divAct.classList.add('completada');
                                    indicador.textContent = '✅';
                                }
                                alert('No se pudo guardar el cambio. Revisa tu conexión.');
                            });
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

    async function enviarActualizacion(fechaHora, diaSemana, nuevoEstado) {
        const payload = {
            fechaHora: fechaHora,
            diaSemana: diaSemana,
            nuevoEstado: nuevoEstado
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log('Actualización guardada:', data);
        return data;
    }
});
