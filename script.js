// Función para cambiar de pestaña
function switchTab(tabId, event) {
    event.preventDefault();

    // Ocultar todas las secciones
    document.querySelectorAll('.tab-pane').forEach(function (pane) {
        pane.style.display = 'none';
    });

    // Mostrar la sección seleccionada
    document.querySelector(tabId).style.display = 'block';

    // Mostrar/ocultar el carrusel según la sección
    const carrusel = document.getElementById('carrusel');
    if (tabId === '#inicio') {
        carrusel.style.display = 'block';
    } else {
        carrusel.style.display = 'none';
    }

    // Actualizar la clase activa en el menú de navegación
    document.querySelectorAll('nav a, .dropdown-toggle').forEach(function (link) {
        link.classList.remove('active-nav');
    });

    // Si el enlace es un submenú, marcar también el elemento padre
    const parentDropdown = event.currentTarget.closest('.dropdown');
    if (parentDropdown) {
        parentDropdown.querySelector('.dropdown-toggle').classList.add('active-nav');
    }

    event.currentTarget.classList.add('active-nav');

    // Cerrar el menú móvil si está abierto
    document.querySelector('.main-nav').classList.remove('active');

    // Desplazar la página al inicio
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Función para inicializar la página
function initializePage() {
    // Configurar la velocidad del carrusel
    var myCarousel = document.querySelector('#carrusel')
    var carousel = new bootstrap.Carousel(myCarousel, {
        interval: 3000, // Cambia las diapositivas cada 3 segundos
        wrap: true
    })

    // Activar el primer tab al cargar la página
    document.querySelector('nav a').click();

    // Ocultar el carrusel inicialmente si no estamos en la página de inicio
    if (window.location.hash && window.location.hash !== '#inicio') {
        document.getElementById('carrusel').style.display = 'none';
    }

    // Manejar el cambio de tabs
    document.querySelectorAll('nav a').forEach(function (link) {
        link.addEventListener('click', function (event) {
            switchTab(this.getAttribute('href'), event);
        });
    });
}

// Menú hamburguesa
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdown = document.querySelector('.dropdown');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function () {
            mainNav.classList.toggle('active');
        });

        // Cerrar el menú si se hace clic fuera de él
        document.addEventListener('click', function (event) {
            const isClickInsideNav = mainNav.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);

            if (!isClickInsideNav && !isClickOnToggle && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
            }
        });
    }

    // Manejar clic en el toggle del dropdown en móviles
    if (dropdownToggle && dropdown) {
        dropdownToggle.addEventListener('click', function (event) {
            // Solo en vista móvil
            if (window.innerWidth <= 768) {
                dropdown.classList.toggle('active');
                event.stopPropagation(); // Prevenir que se propague el evento
            }
        });
    }
}

// Control del menú desplegable (tanto en móvil como en escritorio)
const dropdownToggle = document.querySelector('.dropdown-toggle');
const dropdown = document.querySelector('.dropdown');

if (dropdownToggle && dropdown) {
    // Al hacer clic en el dropdown-toggle
    dropdownToggle.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        
        // Alternar la clase 'open' para mostrar/ocultar el menú
        dropdown.classList.toggle('open');
    });
    
    // Cerrar el dropdown cuando se hace clic fuera de él
    document.addEventListener('click', function(event) {
        if (!dropdown.contains(event.target)) {
            dropdown.classList.remove('open');
        }
    });
    
    // Permitir que los elementos del menú desplegable funcionen
    const dropdownItems = dropdown.querySelectorAll('.dropdown-menu a');
    dropdownItems.forEach(function(item) {
        item.addEventListener('click', function() {
            dropdown.classList.remove('open');
        });
    });
}

// Ejecutar la inicialización cuando se carga la página
window.onload = function () {
    initializePage();
    setupMobileMenu();
};

// Código de la calculadora de preselección
document.addEventListener('DOMContentLoaded', function () {
    const preseleccionForm = document.getElementById('preseleccionForm');
    const resultadoPreseleccion = document.getElementById('resultadoPreseleccion');
    const modalidadSelect = document.getElementById('modalidad');
    const pobrezaSelect = document.getElementById('pobreza');
    const lenguaOriginariaDiv = document.getElementById('lenguaOriginaria');
    const limpiarFormBtn = document.getElementById('limpiarForm');
    const enpInput = document.getElementById('enp');
    const enpError = document.getElementById('enp-error');
    const nombreInput = document.getElementById('nombre');
    const descargarResultadoBtn = document.getElementById('descargarResultado');

    modalidadSelect.addEventListener('change', function () {
        const modalidad = this.value;
        lenguaOriginariaDiv.style.display = modalidad === 'eib' ? 'block' : 'none';
        document.getElementById('lengua').required = modalidad === 'eib';

        // Ajustar opciones según la modalidad
        if (modalidad === 'ordinaria') {
            pobrezaSelect.querySelector('option[value="no_pobre"]').style.display = 'none';
            pobrezaSelect.querySelector('option[value="extrema"]').textContent = 'Pobreza extrema (PE) - 5 puntos';
            pobrezaSelect.querySelector('option[value="no_extrema"]').textContent = 'Pobreza (P) - 0 puntos';
            if (pobrezaSelect.value === 'no_pobre') pobrezaSelect.value = '';
        } else {
            pobrezaSelect.querySelector('option[value="no_pobre"]').style.display = 'block';
            pobrezaSelect.querySelector('option[value="extrema"]').textContent = 'Pobreza extrema (PE) - 5 puntos';
            pobrezaSelect.querySelector('option[value="no_extrema"]').textContent = 'Pobreza (P) - 2 puntos';
        }

        // Deshabilitar opciones según la modalidad
        document.querySelectorAll('input[name="priorizable"]').forEach(checkbox => {
            if (modalidad === 'cna_pa' && checkbox.value === 'comunidad_nativa') {
                checkbox.disabled = true;
                checkbox.checked = false;
            } else if (modalidad === 'proteccion' && checkbox.value === 'orfandad') {
                checkbox.disabled = true;
                checkbox.checked = false;
            } else if (modalidad !== 'proteccion' && checkbox.value === 'desproteccion') {
                checkbox.disabled = true;
                checkbox.checked = false;
            } else {
                checkbox.disabled = false;
            }
        });
    });

    enpInput.addEventListener('input', function () {
        let value = parseInt(this.value);
        if (isNaN(value) || value < 0 || value > 120 || value % 2 !== 0) {
            enpError.textContent = 'Por favor, ingrese un número par entre 0 y 120.';
            this.setCustomValidity('Número inválido');
        } else {
            enpError.textContent = '';
            this.setCustomValidity('');
        }
    });

    limpiarFormBtn.addEventListener('click', function () {
        preseleccionForm.reset();
        resultadoPreseleccion.innerHTML = '';
        enpError.textContent = '';
        document.querySelector('.download-options').style.display = 'none';
        document.getElementById('formatoDescarga').value = 'pdf';

        lenguaOriginariaDiv.style.display = 'none';
        document.getElementById('lengua').required = false;

        pobrezaSelect.querySelector('option[value="no_pobre"]').style.display = 'block';
        pobrezaSelect.querySelector('option[value="extrema"]').textContent = 'Pobreza extrema (PE) - 5 puntos';
        pobrezaSelect.querySelector('option[value="no_extrema"]').textContent = 'Pobreza (P) - 2 puntos';

        document.querySelectorAll('input[name="priorizable"]').forEach(checkbox => {
            checkbox.disabled = false;
        });
    });

    // Evento para el envío del formulario de preselección
    preseleccionForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const nombre = nombreInput.value;
        const modalidad = modalidadSelect.value;
        const enp = enpInput.value;
        const pobreza = pobrezaSelect.value;
        const quintil = document.getElementById('quintil').value;

        // Validaciones de campos obligatorios
        if (!modalidad) {
            alert('Por favor, seleccione una modalidad.');
            return;
        }
        if (!enp) {
            alert('Por favor, ingrese el puntaje ENP.');
            return;
        }
        if (!pobreza) {
            alert('Por favor, seleccione una clasificación SISFOH.');
            return;
        }
        if (!quintil) {
            alert('Por favor, seleccione un quintil de tasa de transición.');
            return;
        }

        const enpValue = parseInt(enp);
        const extracurriculares = document.querySelectorAll('input[name="extracurricular"]:checked');
        const priorizables = document.querySelectorAll('input[name="priorizable"]:checked');
        const lengua = document.getElementById('lengua').value;

        // Validaciones adicionales
        if (modalidad === 'ordinaria' && pobreza === 'no_pobre') {
            alert('Para la modalidad ordinaria es necesario tener pobreza o pobreza extrema.');
            return;
        }

        if (modalidad === 'eib' && lengua === '') {
            alert('Para la modalidad EIB es necesario ser hablante de lengua de primera o segunda prioridad.');
            return;
        }

        let puntaje = enpValue;
        let detalles = [`✅ Modalidad (M): ${modalidad}`, `✅ ENP: <span class="puntaje-detalle">${enpValue} puntos</span>`];

        // Pobreza (SISFOH)
        if (modalidad === 'ordinaria') {
            if (pobreza === 'extrema') {
                puntaje += 5;
                detalles.push('✅ SISFOH (S): Pobreza extrema (PE) <span class="puntaje-detalle">+5 puntos</span>');
            } else {
                detalles.push('✅ SISFOH (S): Pobreza (P) <span class="puntaje-detalle">+0 puntos</span>');
            }
        } else if (pobreza === 'extrema') {
            puntaje += 5;
            detalles.push('✅ SISFOH (S): Pobreza extrema (PE) <span class="puntaje-detalle">+5 puntos</span>');
        } else if (pobreza === 'no_extrema') {
            puntaje += 2;
            detalles.push('✅ SISFOH (S): Pobreza (P) <span class="puntaje-detalle">+2 puntos</span>');
        } else {
            detalles.push('✅ SISFOH (S): <span class="puntaje-detalle">+0 puntos</span>');
        }

        // Tasa de transición
        let puntajeTransicion = 0;
        switch (quintil) {
            case '1': puntajeTransicion = 10; break;
            case '2': puntajeTransicion = 7; break;
            case '3': puntajeTransicion = 5; break;
            case '4': puntajeTransicion = 2; break;
            case '5': puntajeTransicion = 0; break;
        }
        puntaje += puntajeTransicion;
        detalles.push(`✅ Tasa de transición (T): Quintil ${quintil} <span class="puntaje-detalle">+${puntajeTransicion} puntos</span>`);

        // Actividades extracurriculares (máximo 10 puntos)
        let puntajeExtracurricular = 0;
        let actividadesSeleccionadas = [];
        extracurriculares.forEach(actividad => {
            if (actividad.value === 'concurso_nacional' || actividad.value === 'juegos_nacionales') {
                puntajeExtracurricular += 5;
                actividadesSeleccionadas.push(actividad.value === 'concurso_nacional' ? 'CE' : 'JD');
            } else {
                puntajeExtracurricular += 2;
                actividadesSeleccionadas.push(actividad.value === 'concurso_participacion' ? 'CEP' : 'JDP');
            }
        });
        puntajeExtracurricular = Math.min(puntajeExtracurricular, 10);
        puntaje += puntajeExtracurricular;
        detalles.push(`✅ Actividades extracurriculares (${actividadesSeleccionadas.join(', ')}): <span class="puntaje-detalle">+${puntajeExtracurricular} puntos</span> (máximo 10)`);

        // Otras condiciones priorizables (máximo 25 puntos)
        let puntajePriorizable = 0;
        let condicionesSeleccionadas = [];
        const inicialesPriorizables = {
            'discapacidad': 'D',
            'bomberos': 'B',
            'voluntarios': 'V',
            'comunidad_nativa': 'IA',
            'metales_pesados': 'PEM',
            'poblacion_beneficiaria': 'PD',
            'orfandad': 'OR',
            'desproteccion': 'DF',
            'agente_salud': 'ACS'
        };
        priorizables.forEach(condicion => {
            if (!(modalidad === 'cna_pa' && condicion.value === 'comunidad_nativa') &&
                !(modalidad === 'proteccion' && condicion.value === 'orfandad') &&
                !(modalidad !== 'proteccion' && condicion.value === 'desproteccion')) {
                puntajePriorizable += 5;
                condicionesSeleccionadas.push(inicialesPriorizables[condicion.value]);
            }
        });
        puntajePriorizable = Math.min(puntajePriorizable, 25);
        puntaje += puntajePriorizable;
        detalles.push(`✅ Condiciones priorizables (${condicionesSeleccionadas.join(', ')}): <span class="puntaje-detalle">+${puntajePriorizable} puntos</span> (máximo 25)`);

        // Lengua originaria (solo para modalidad EIB)
        if (modalidad === 'eib') {
            if (lengua === 'primera') {
                puntaje += 10;
                detalles.push('✅ Lengua originaria (LO): Primera prioridad <span class="puntaje-detalle">+10 puntos</span>');
            } else if (lengua === 'segunda') {
                puntaje += 5;
                detalles.push('✅ Lengua originaria (LO): Segunda prioridad <span class="puntaje-detalle">+5 puntos</span>');
            }
        }

        // Aplicar límite de puntaje según modalidad
        const puntajeMaximo = modalidad === 'eib' ? 180 : 170;
        puntaje = Math.min(puntaje, puntajeMaximo);

        // Determinar el color del botón de resultado
        let colorClase = '';
        if (puntaje >= 100) {
            colorClase = 'btn-success';
        } else if (puntaje >= 70) {
            colorClase = 'btn-warning';
        } else {
            colorClase = 'btn-danger';
        }

        // Agregar mensaje de ánimo
        let mensajeAnimo = '';
        if (puntaje >= 100) {
            mensajeAnimo = `¡Excelente trabajo, ${nombre}! Con este puntaje, tienes grandes posibilidades de ganar la beca. ¡Sigue adelante!`;
        } else if (puntaje >= 70) {
            mensajeAnimo = `¡Buen esfuerzo, ${nombre}! Estás en buen camino para obtener la beca. ¡No te rindas!`;
        } else {
            mensajeAnimo = `${nombre}, cada punto cuenta. Sigue trabajando duro y no pierdas la esperanza. ¡Tú puedes lograrlo!`;
        }

        // Mostrar resultado
        let resultado = `<h2>Reporte de Preselección para ${nombre}</h2>`;
        resultado += `<button class="btn ${colorClase}">Tu puntaje estimado de preselección es: <strong>${puntaje}</strong> puntos</button>`;
        resultado += '<div class="resultado-detalle"><h4>Desglose del puntaje:</h4><ul>';
        detalles.forEach(detalle => {
            resultado += `<li>${detalle}</li>`;
        });
        resultado += '</ul></div>';

        // Agregar la fórmula
        let formula = 'PS = ENP + ';
        if (modalidad === 'ordinaria') {
            formula += 'PE + T + (CE o CEP + JD o JDP)<sub>max 10</sub> + (D + B + V + IA + PEM + PD + OR + ACS)<sub>max 25</sub>';
        } else if (modalidad === 'cna_pa') {
            formula += '(PE o P) + T + (CE o CEP + JD o JDP)<sub>max 10</sub> + (D + B + V + PEM + PD + OR + ACS)<sub>max 25</sub>';
        } else if (modalidad === 'eib') {
            formula += '(PE o P) + T + (CE o CEP + JD o JDP)<sub>max 10</sub> + (D + B + V + IA + PEM + PD + OR + ACS)<sub>max 25</sub> + LO';
        } else if (modalidad === 'proteccion') {
            formula += '(PE o P) + T + (CE o CEP + JD o JDP)<sub>max 10</sub> + (D + B + V + IA + PEM + PD + ACS)<sub>max 25</sub> + DF';
        } else {
            formula += '(PE o P) + T + (CE o CEP + JD o JDP)<sub>max 10</sub> + (D + B + V + IA + PEM + PD + OR + ACS)<sub>max 25</sub>';
        }

        resultado += `<div class="formula">Fórmula aplicada: ${formula}</div>`;
        resultado += `<p class="puntaje-maximo">Puntaje máximo para esta modalidad: ${puntajeMaximo} puntos</p>`;
        resultado += `<p class="mensaje-animo">${mensajeAnimo}</p>`;

        resultadoPreseleccion.innerHTML = resultado;
        document.querySelector('.download-options').style.display = 'flex';
    });

    // Imprimir PDF o PNG para el reporte de preselección
    descargarResultadoBtn.addEventListener('click', function () {
        const elemento = document.getElementById('resultadoPreseleccion');
        const formato = document.getElementById('formatoDescarga').value;

        // Asegurarnos que el elemento tenga posición relativa
        const originalPosition = window.getComputedStyle(elemento).position;
        elemento.style.position = 'relative';

        // Añadir temporalmente una marca de agua visible al elemento
        const watermark = document.createElement('div');
        watermark.className = 'watermark';
        watermark.textContent = 'Juffyto Segovia Asesoría BECA 18 2025';
        watermark.style.position = 'absolute';
        watermark.style.top = '50%';
        watermark.style.left = '50%';
        watermark.style.transform = 'translate(-50%, -50%) rotate(-45deg)';
        watermark.style.fontSize = '40px';
        watermark.style.opacity = '0.4';
        watermark.style.color = 'rgba(255, 0, 0, 0.751)';
        watermark.style.pointerEvents = 'none';
        watermark.style.whiteSpace = 'nowrap';
        watermark.style.zIndex = '1000';
        watermark.style.textAlign = 'center';
        watermark.style.width = '100%';

        elemento.appendChild(watermark);

        // Reducir la escala para mejorar el rendimiento
        const scale = formato === 'pdf' ? 1.5 : 1;

        // Esperar a que la marca de agua se aplique completamente
        setTimeout(() => {
            html2canvas(elemento, {
                scale: scale,
                logging: false,
                useCORS: true,
                backgroundColor: '#F0F0F0',
                onclone: function (clonedDoc) {
                    const clonedElement = clonedDoc.querySelector('#resultadoPreseleccion');
                    clonedElement.style.padding = '15px';
                    clonedElement.style.borderRadius = '5px';
                }
            }).then(canvas => {
                // Restaurar el estilo original del elemento
                elemento.style.position = originalPosition;

                // Eliminar la marca de agua temporal del DOM
                elemento.removeChild(watermark);

                if (formato === 'png') {
                    // Descargar como PNG
                    const link = document.createElement('a');
                    link.download = 'Reporte_Preseleccion_Beca18.png';
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                } else {
                    // Descargar como PDF con compresión
                    const imgData = canvas.toDataURL('image/jpeg', 0.75);
                    const { jsPDF } = window.jspdf;
                    const pdf = new jsPDF('p', 'mm', 'a4');
                    const imgProps = pdf.getImageProperties(imgData);
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
                    pdf.save('Reporte_Preseleccion_Beca18.pdf');
                }
            }).catch(function (error) {
                console.error('Error en html2canvas:', error);
                alert('Hubo un error al generar la imagen. Por favor, inténtelo de nuevo.');

                // Asegurarse de limpiar incluso en caso de error
                elemento.style.position = originalPosition;
                if (elemento.contains(watermark)) {
                    elemento.removeChild(watermark);
                }
            });
        }, 100);
    });
});

// Código de la calculadora de selección
document.addEventListener('DOMContentLoaded', function () {
    const iesSelect = document.getElementById('iesSeleccion');
    const iesInfo = document.getElementById('iesInfo');
    const seleccionForm = document.getElementById('seleccionForm');
    const resultadoSeleccion = document.getElementById('resultadoSeleccion');
    const puntajePreseleccionInput = document.getElementById('puntajePreseleccion');
    const puntajePreseleccionError = document.getElementById('puntajePreseleccionError');
    const limpiarFormSeleccionBtn = document.getElementById('limpiarFormSeleccion');
    let iesData = [];

    // Función para cargar las IES desde el archivo JSON
    async function cargarIES() {
        try {
            const response = await fetch('ies-data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            iesData = await response.json();

            // Cargar las regiones únicas en el selector de regiones
            cargarRegiones();

            // Inicializar los filtros y mostrar todas las IES
            actualizarTiposIES();
            actualizarGestionesIES();
            filtrarIES();
        } catch (error) {
            console.error('Error al cargar los datos de IES:', error);
            document.getElementById('regionIES').innerHTML = '<option value="">Error al cargar regiones</option>';
            iesSelect.innerHTML = '<option value="">Error al cargar IES</option>';
        }
    }

    // Función para cargar las regiones únicas en el selector
    function cargarRegiones() {
        const regionSelect = document.getElementById('regionIES');
        regionSelect.innerHTML = '<option value="">Selecciona una región (obligatorio)</option>';

        // Obtener regiones únicas y ordenarlas alfabéticamente
        const regiones = [...new Set(iesData.map(ies => ies.regionIES))].sort();

        // Añadir cada región como opción
        regiones.forEach(region => {
            const option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            regionSelect.appendChild(option);
        });

        // Añadir evento de cambio para actualizar los demás filtros
        regionSelect.addEventListener('change', function () {
            actualizarTiposIES();
            actualizarGestionesIES();
            filtrarIES();
        });
    }

    // Función para actualizar los checkboxes de Tipo de IES según la región seleccionada
    function actualizarTiposIES() {
        console.log("Actualizando tipos IES");

        const regionSeleccionada = document.getElementById('regionIES').value;

        // Eliminar todos los checkboxes de Tipo IES existentes
        document.querySelectorAll('input[name="tipoIES"]').forEach(checkbox => {
            checkbox.parentElement.remove();
        });

        // Obtener el contenedor donde agregaremos los nuevos checkboxes
        const tipoIESSection = document.querySelector('#seleccionForm div:nth-child(5)');
        const tiposContainer = tipoIESSection.querySelector('div') || tipoIESSection;

        console.log("Contenedor de tipos IES:", tiposContainer);

        // Filtrar IES por región si hay alguna seleccionada
        const iesFiltradas = regionSeleccionada
            ? iesData.filter(ies => ies.regionIES === regionSeleccionada)
            : iesData;

        // Obtener los tipos únicos de IES disponibles
        const tiposDisponibles = [...new Set(iesFiltradas.map(ies => ies.tipoIES))];
        console.log("Tipos disponibles:", tiposDisponibles);

        // Crear los nuevos checkboxes
        tiposDisponibles.forEach(tipo => {
            const label = document.createElement('label');
            label.style.marginRight = '10px'; // Agregar espacio entre los checkboxes

            const input = document.createElement('input');
            input.type = 'checkbox';
            input.name = 'tipoIES';
            input.value = tipo.toLowerCase();
            input.dataset.tipo = tipo;

            // Agregar evento de cambio
            input.addEventListener('change', function () {
                console.log("Tipo seleccionado:", tipo);
                actualizarGestionesIES();
                filtrarIES();
            });

            label.appendChild(input);
            label.appendChild(document.createTextNode(' ' + tipo));

            tiposContainer.appendChild(label);
        });
    }

    // Función para actualizar los checkboxes de Gestión IES según la región y tipos seleccionados
    function actualizarGestionesIES() {
        console.log("Actualizando gestiones IES");

        const regionSeleccionada = document.getElementById('regionIES').value;

        // Eliminar todos los checkboxes de Gestión IES existentes
        document.querySelectorAll('input[name="gestionIES"]').forEach(checkbox => {
            checkbox.parentElement.remove();
        });

        // Obtener el contenedor donde agregaremos los nuevos checkboxes
        const gestionIESSection = document.querySelector('#seleccionForm div:nth-child(6)');
        const gestionesContainer = gestionIESSection.querySelector('div') || gestionIESSection;

        console.log("Contenedor de gestiones IES:", gestionesContainer);

        // Obtener los tipos seleccionados
        const tiposSeleccionados = Array.from(
            document.querySelectorAll('input[name="tipoIES"]:checked')
        ).map(cb => cb.dataset.tipo);

        console.log("Tipos seleccionados para filtrar gestiones:", tiposSeleccionados);

        // Filtrar IES por región y tipos seleccionados
        let iesFiltradas = iesData;

        if (regionSeleccionada) {
            iesFiltradas = iesFiltradas.filter(ies => ies.regionIES === regionSeleccionada);
        }

        if (tiposSeleccionados.length > 0) {
            iesFiltradas = iesFiltradas.filter(ies => tiposSeleccionados.includes(ies.tipoIES));
        }

        // Obtener las gestiones únicas disponibles
        const gestionesDisponibles = [...new Set(iesFiltradas.map(ies => ies.gestionIES))];
        console.log("Gestiones disponibles:", gestionesDisponibles);

        // Crear los nuevos checkboxes
        gestionesDisponibles.forEach(gestion => {
            const label = document.createElement('label');
            label.style.marginRight = '10px'; // Agregar espacio entre los checkboxes

            const input = document.createElement('input');
            input.type = 'checkbox';
            input.name = 'gestionIES';
            input.value = gestion.toLowerCase();
            input.dataset.gestion = gestion;

            // Agregar evento de cambio
            input.addEventListener('change', function () {
                console.log("Gestión seleccionada:", gestion);
                filtrarIES();
            });

            label.appendChild(input);
            label.appendChild(document.createTextNode(' ' + gestion));

            gestionesContainer.appendChild(label);
        });
    }

    // Función para filtrar IES según todos los criterios seleccionados
    function filtrarIES() {
        console.log("Filtrando IES");
        const regionSeleccionada = document.getElementById('regionIES').value;

        // Si no hay región seleccionada, limpiar el selector de IES y mostrar mensaje
        if (!regionSeleccionada) {
            iesSelect.innerHTML = '<option value="">Selecciona una región primero</option>';
            iesInfo.style.display = 'none';
            return;
        }

        // Obtener los tipos y gestiones seleccionados
        const tiposSeleccionados = Array.from(
            document.querySelectorAll('input[name="tipoIES"]:checked')
        ).map(cb => cb.dataset.tipo);

        const gestionesSeleccionadas = Array.from(
            document.querySelectorAll('input[name="gestionIES"]:checked')
        ).map(cb => cb.dataset.gestion);

        console.log("Filtrando por región:", regionSeleccionada);
        console.log("Filtrando por tipos:", tiposSeleccionados);
        console.log("Filtrando por gestiones:", gestionesSeleccionadas);

        // Aplicar filtros encadenados
        let iesFiltradas = iesData;

        // Filtrar por región (ahora obligatorio)
        iesFiltradas = iesFiltradas.filter(ies => ies.regionIES === regionSeleccionada);
        console.log("Después de filtrar por región:", iesFiltradas.length);

        // Filtrar por tipos seleccionados
        if (tiposSeleccionados.length > 0) {
            iesFiltradas = iesFiltradas.filter(ies => tiposSeleccionados.includes(ies.tipoIES));
            console.log("Después de filtrar por tipos:", iesFiltradas.length);
        }

        // Filtrar por gestiones seleccionadas
        if (gestionesSeleccionadas.length > 0) {
            iesFiltradas = iesFiltradas.filter(ies => gestionesSeleccionadas.includes(ies.gestionIES));
            console.log("Después de filtrar por gestiones:", iesFiltradas.length);
        }

        // Crear un mapa para eliminar duplicados basados en nombreIES dentro de la misma región
        const iesUnicas = new Map();
        iesFiltradas.forEach(ies => {
            // Usamos el nombre de la IES como clave del mapa
            if (!iesUnicas.has(ies.nombreIES)) {
                iesUnicas.set(ies.nombreIES, ies);
            }
        });

        // Convertir el mapa de IES únicas a un array
        iesFiltradas = Array.from(iesUnicas.values());

        // Actualizar el selector de IES con las filtradas
        iesSelect.innerHTML = '<option value="">Selecciona una IES</option>';

        // Ordenar IES por nombre para facilitar la búsqueda
        iesFiltradas.sort((a, b) => a.nombreIES.localeCompare(b.nombreIES));

        console.log("Total de IES filtradas (únicas):", iesFiltradas.length);
        console.log("Ejemplos de IES filtradas:", iesFiltradas.slice(0, 5).map(ies => ies.nombreIES));

        // Añadir cada IES como opción
        iesFiltradas.forEach(ies => {
            const option = document.createElement('option');
            option.value = ies.nombreIES;
            option.textContent = ies.nombreIES;
            option.dataset.region = ies.regionIES; // Guardar la región como atributo de datos
            iesSelect.appendChild(option);
        });

        // Ocultar la información de IES al cambiar los filtros
        iesInfo.style.display = 'none';
    }//Hasta aqui se agrego para la carga de regiones

    // Función para mostrar la información de la IES seleccionada
    function mostrarInfoIES(iesNombre) {
        console.log("Buscando información de IES:", iesNombre);

        // Obtener la región seleccionada
        const regionSeleccionada = document.getElementById('regionIES').value;

        // Buscar la IES que coincida con el nombre y la región seleccionada
        const ies = iesData.find(item =>
            item.nombreIES === iesNombre &&
            item.regionIES === regionSeleccionada
        );

        if (!ies) {
            console.error("No se encontró la IES seleccionada en la región indicada");
            return;
        }

        console.log("Mostrando información de IES:", ies);

        // Obtener los elementos antes de asignar valores
        const regionIESField = document.querySelector('#iesInfo input#regionIES');

        // Asignar valores a los campos
        document.getElementById('codigoTipoIES').value = ies.codigoTipoIES;
        document.getElementById('tipoIES').value = ies.tipoIES;

        // Asignar la región directamente al campo correcto
        if (regionIESField) {
            regionIESField.value = ies.regionIES;
        } else {
            console.error("No se encontró el campo regionIES en el formulario de información");
        }

        document.getElementById('siglasIES').value = ies.siglasIES;
        document.getElementById('topIES').value = ies.topIES;
        document.getElementById('rankingIES').value = ies.rankingIES;
        document.getElementById('puntajeRankingIES').value = ies.puntajeRankingIES;
        document.getElementById('gestionIES').value = ies.gestionIES;
        document.getElementById('puntajeGestionIES').value = ies.puntajeGestionIES;
        document.getElementById('ratioSelectividad').value = ies.ratioSelectividad;
        document.getElementById('puntajeRatioSelectividad').value = ies.puntajeRatioSelectividad;
        document.getElementById('puntosExtraPAO').value = ies.puntosExtraPAO;

        iesInfo.style.display = 'block';
    }

    // Validación del puntaje de preselección
    puntajePreseleccionInput.addEventListener('input', function () {
        let value = parseInt(this.value);
        if (isNaN(value) || value < 0 || value > 180) {
            puntajePreseleccionError.textContent = 'Por favor, ingrese un número entre 0 y 180.';
            this.setCustomValidity('Puntaje inválido');
        } else {
            puntajePreseleccionError.textContent = '';
            this.setCustomValidity('');
        }
    });

    // Evento para limpiar el formulario
    limpiarFormSeleccionBtn.addEventListener('click', function () {
        seleccionForm.reset();
        resultadoSeleccion.innerHTML = '';
        iesInfo.style.display = 'none';
        puntajePreseleccionError.textContent = '';

        // Reinicializar los filtros
        cargarRegiones();
        actualizarTiposIES();
        actualizarGestionesIES();
        filtrarIES();
    });

    // Evento para cuando se seleccione una IES
    iesSelect.addEventListener('change', function () {
        const selectedIESName = this.value;
        if (selectedIESName) {
            mostrarInfoIES(selectedIESName);
        } else {
            iesInfo.style.display = 'none';
        }
    });

    // Evento para el envío del formulario de selección
    seleccionForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const nombre = document.getElementById('nombreSeleccion').value;
        const modalidad = document.getElementById('modalidadSeleccion').value;
        const iesSeleccionadaNombre = iesSelect.value;
        const regionSeleccionada = document.getElementById('regionIES').value;

        // Buscar la IES que coincida con el nombre y la región seleccionada
        const selectedIES = iesData.find(ies =>
            ies.nombreIES === iesSeleccionadaNombre &&
            ies.regionIES === regionSeleccionada
        );

        const puntajePreseleccion = parseInt(puntajePreseleccionInput.value);

        if (!regionSeleccionada) {
            alert('Por favor, seleccione una región.');
            return;
        }

        if (!selectedIES) {
            alert('Por favor, seleccione una IES válida.');
            return;
        }

        if (isNaN(puntajePreseleccion) || puntajePreseleccion < 0 || puntajePreseleccion > 180) {
            alert('Por favor, ingrese un puntaje de preselección válido entre 0 y 180.');
            return;
        }

        // Calcular puntajes
        const puntajeRanking = parseInt(selectedIES.puntajeRankingIES) || 0;
        const puntajeGestion = parseInt(selectedIES.puntajeGestionIES) || 0;
        const puntajeSelectividad = parseInt(selectedIES.puntajeRatioSelectividad) || 0;
        const puntajeTotal = puntajePreseleccion + puntajeRanking + puntajeGestion + puntajeSelectividad;
        const puntajeIES = puntajeRanking + puntajeGestion + puntajeSelectividad;

        // Determinar color según el puntaje
        let colorClase = '';
        if (puntajeTotal >= 120) {
            colorClase = 'btn-success';
        } else if (puntajeTotal >= 110) {
            colorClase = 'btn-info';
        } else if (puntajeTotal >= 100) {
            colorClase = 'btn-warning';
        } else {
            colorClase = 'btn-danger';
        }

        // Mensaje personalizado según puntaje
        let mensajePersonalizado = '';
        if (puntajeTotal >= 120) {
            mensajePersonalizado = `¡Felicidades, ${nombre}! Tienes una excelente probabilidad de ganar la beca. Asegúrate de completar tu postulación en las fechas indicadas.`;
        } else if (puntajeTotal >= 110) {
            mensajePersonalizado = `¡Muy bien, ${nombre}! Tienes buenas posibilidades de ganar la beca. No olvides estar pendiente del cronograma de postulación.`;
        } else if (puntajeTotal >= 100) {
            mensajePersonalizado = `${nombre}, tienes posibilidades de ganar la beca. Te recomendamos revisar otras IES que podrían aumentar tu puntaje.`;
        } else {
            mensajePersonalizado = `${nombre}, tu puntaje está por debajo del promedio. Te sugerimos explorar otras IES que podrían mejorar tu puntaje significativamente.`;
        }

        // Puntaje máximo según modalidad
        const puntajeMaximo = modalidad === 'eib' ? 210 : 200;

        // Crear el resultado
        let resultado = `<h2>Reporte de Selección para ${nombre}</h2>`;
        resultado += `<button class="btn ${colorClase}">Tu puntaje de selección es: <strong>${puntajeTotal}</strong> puntos</button>`;
        resultado += '<div class="resultado-detalle"><h4>Desglose del puntaje:</h4><ul>';
        resultado += `<li>✅ Modalidad (M): ${modalidad}</li>`;
        resultado += `<li>✅ PS (Puntaje de Preselección): <span class="puntaje-detalle">${puntajePreseleccion} puntos</span></li>`;
        resultado += `<li>✅ C (Puntaje por Ranking): <span class="puntaje-detalle">+${puntajeRanking} puntos</span></li>`;
        resultado += `<li>✅ G (Puntaje por Gestión): <span class="puntaje-detalle">+${puntajeGestion} puntos</span></li>`;
        resultado += `<li>✅ S (Puntaje por Selectividad): <span class="puntaje-detalle">+${puntajeSelectividad} puntos</span></li>`;
        resultado += `<li>✅ IES elegida: ${selectedIES.nombreIES} <span class="puntaje-detalle">(+${puntajeIES} puntos en total)</span></li>`;
        resultado += '</ul></div>';

        // Fórmula
        resultado += `<div class="formula">Fórmula aplicada: Puntaje Total = PS + C + G + S</div>`;

        // Puntaje máximo
        resultado += `<p class="puntaje-maximo">Puntaje máximo para esta modalidad: ${puntajeMaximo} puntos</p>`;

        // Mensaje personalizado
        resultado += `<p class="mensaje-animo">${mensajePersonalizado}</p>`;

        resultadoSeleccion.innerHTML = resultado;

        // Mostrar opciones de descarga
        document.querySelector('#seleccion .download-options').style.display = 'flex';
    });

    // Imprimir PDF o PNG para el resultado de selección
    document.getElementById('descargarResultadoSeleccion').addEventListener('click', function () {
        const elemento = document.getElementById('resultadoSeleccion');
        const formato = document.getElementById('formatoDescargaSeleccion').value;

        // Asegurarnos que el elemento tenga posición relativa para que la marca de agua se posicione correctamente
        const originalPosition = window.getComputedStyle(elemento).position;
        elemento.style.position = 'relative';

        // Añadir temporalmente una marca de agua visible al elemento
        const watermark = document.createElement('div');
        watermark.className = 'watermark';
        watermark.textContent = 'Juffyto Segovia Asesoría BECA 18 2025';
        watermark.style.position = 'absolute';
        watermark.style.top = '50%';
        watermark.style.left = '50%';
        watermark.style.transform = 'translate(-50%, -50%) rotate(-45deg)';
        watermark.style.fontSize = '40px';
        watermark.style.opacity = '0.4';
        watermark.style.color = 'rgba(255, 0, 0, 0.751)';
        watermark.style.pointerEvents = 'none';
        watermark.style.whiteSpace = 'nowrap';
        watermark.style.zIndex = '1000';
        watermark.style.textAlign = 'center';
        watermark.style.width = '100%';

        elemento.appendChild(watermark);

        // Reducir la escala para mejorar el rendimiento
        const scale = formato === 'pdf' ? 1.5 : 1;

        // Esperar a que la marca de agua se aplique completamente
        setTimeout(() => {
            html2canvas(elemento, {
                scale: scale,
                logging: false,  // Desactivar logging para mejorar rendimiento
                useCORS: true,
                backgroundColor: '#F0F0F0',  // Color de fondo similar al del reporte
                onclone: function (clonedDoc) {
                    const clonedElement = clonedDoc.querySelector('#resultadoSeleccion');
                    clonedElement.style.padding = '15px';
                    clonedElement.style.borderRadius = '5px';
                }
            }).then(canvas => {
                // Restaurar el estilo original del elemento
                elemento.style.position = originalPosition;

                // Eliminar la marca de agua temporal del DOM
                elemento.removeChild(watermark);

                if (formato === 'png') {
                    // Descargar como PNG
                    const link = document.createElement('a');
                    link.download = 'Reporte_Seleccion_Beca18.png';
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                } else {
                    // Descargar como PDF con compresión para reducir tamaño
                    const imgData = canvas.toDataURL('image/jpeg', 0.75); // Usar JPEG con menor calidad para mejorar rendimiento
                    const { jsPDF } = window.jspdf;
                    const pdf = new jsPDF('p', 'mm', 'a4');
                    const imgProps = pdf.getImageProperties(imgData);
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
                    pdf.save('Reporte_Seleccion_Beca18.pdf');
                }
            }).catch(function (error) {
                console.error('Error en html2canvas:', error);
                alert('Hubo un error al generar la imagen. Por favor, inténtelo de nuevo.');

                // Asegurarse de limpiar incluso en caso de error
                elemento.style.position = originalPosition;
                if (elemento.contains(watermark)) {
                    elemento.removeChild(watermark);
                }
            });
        }, 100); // Pequeño retraso para asegurar que los estilos se apliquen
    });

    // Cargar las IES cuando la página se cargue
    cargarIES();
});