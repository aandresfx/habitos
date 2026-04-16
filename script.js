document.addEventListener('DOMContentLoaded', function() {
    // PEGA AQUÍ LA URL DE TU APLICACIÓN WEB DE APPS SCRIPT
    const API_URL = 'https://script.google.com/macros/s/AKfycbyLlVTDN2JxJjvyBOPKZriNfmwvRmNKVC6wnFt1h6L6EM8sCFhBYCYyhN_QhbHInpj7hg/exec';

    fetch(API_URL)
        .then(response => response.json())
        .then(datos => {
            mostrarDatos(datos);
        })
        .catch(error => {
            console.error('Error al cargar los datos:', error);
            document.getElementById('contenedor-calendario').textContent = '⚠️ Error al cargar datos.';
        });

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
                
                if (act.Check === true || act.Check === 'TRUE' || act.Check === 'true') {
                    divAct.classList.add('completada');
                }
                
                divAct.textContent = act.Actividad || '⏳';
                divDia.appendChild(divAct);
            });
            
            contenedor.appendChild(divDia);
        });
    }
});
