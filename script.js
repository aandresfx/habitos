document.addEventListener('DOMContentLoaded', function() {
    // Reemplaza esto con el ID de tu hoja de cálculo
    const SPREADSHEET_ID = 'TU_ID_DE_HOJA_DE_CALCULO';
    const SHEET_NAME = 'Data_Para_Softr'; // El nombre de tu pestaña

    // Usamos Tabletop.js para leer los datos sin necesidad de API key
    Tabletop.init({
        key: SPREADSHEET_ID,
        callback: function(data, tabletop) {
            mostrarDatos(data);
        },
        simpleSheet: false // Para que nos dé un array de objetos
    });

    function mostrarDatos(datos) {
        const contenedorCalendario = document.getElementById('contenedor-calendario');
        contenedorCalendario.innerHTML = ''; // Limpiamos el mensaje de carga

        // Agrupamos los datos por día de la semana
        const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        
        dias.forEach(dia => {
            const divDia = document.createElement('div');
            divDia.className = 'dia';
            divDia.innerHTML = `<h3>${dia}</h3>`;
            
            // Filtramos las actividades de este día
            const actividadesDelDia = datos[ SHEET_NAME ].elements.filter(act => act.diasemana === dia);
            
            actividadesDelDia.forEach(actividad => {
                const divActividad = document.createElement('div');
                divActividad.className = 'actividad';
                if (actividad.check === 'TRUE' || actividad.check === true) {
                    divActividad.classList.add('completada');
                }
                divActividad.textContent = actividad.actividad; // La columna 'actividad'
                divDia.appendChild(divActividad);
            });
            
            contenedorCalendario.appendChild(divDia);
        });
    }
});