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
    document.querySelectorAll('nav a').forEach(function (link) {
        link.classList.remove('active-nav');
    });
    event.currentTarget.classList.add('active-nav');
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
        resultado += `<button class="btn ${colorClase}">Tu puntaje estimado de preselección es: <strong>${puntaje.toFixed(2)}</strong> puntos</button>`;
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

    // Imprimir PDF o PNG
    descargarResultadoBtn.addEventListener('click', function () {
        const elemento = document.getElementById('resultadoPreseleccion');
        const formato = document.getElementById('formatoDescarga').value;

        // Añadir temporalmente una marca de agua visible al elemento
        const watermark = document.createElement('div');
        watermark.className = 'watermark';
        watermark.textContent = 'Juffyto Segovia Asesoría BECA 18 2025';
        elemento.appendChild(watermark);

        // Forzar un reflow para asegurar que la marca de agua se renderice
        elemento.offsetHeight;

        html2canvas(elemento, {
            scale: 2,
            logging: true,
            useCORS: true,
            onclone: function (clonedDoc) {
                clonedDoc.querySelector('.watermark').style.display = 'block';
            }
        }).then(canvas => {
            // Eliminar la marca de agua temporal del DOM
            elemento.removeChild(watermark);

            if (formato === 'png') {
                // Descargar como PNG
                canvas.toBlob(function (blob) {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.download = 'Reporte_Preseleccion_Beca18.png';
                    link.href = url;
                    link.click();
                    URL.revokeObjectURL(url);
                });
            } else {
                // Descargar como PDF
                const imgData = canvas.toDataURL('image/png');
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save('Reporte_Preseleccion_Beca18.pdf');
            }
        }).catch(function (error) {
            console.error('Error en html2canvas:', error);
            alert('Hubo un error al generar la imagen. Por favor, inténtelo de nuevo.');
        });
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
            populateIESSelect();
        } catch (error) {
            console.error('Error al cargar los datos de IES:', error);
            iesSelect.innerHTML = '<option value="">Error al cargar IES</option>';
        }
    }

    // Función para llenar el select con las opciones de IES
    function populateIESSelect() {
        iesSelect.innerHTML = '<option value="">Seleccione una IES</option>';
        iesData.forEach(ies => {
            const option = document.createElement('option');
            option.value = ies.nombreIES;
            option.textContent = ies.nombreIES;
            iesSelect.appendChild(option);
        });
    }

    // Función para mostrar la información de la IES seleccionada
    function mostrarInfoIES(ies) {
        document.getElementById('codigoTipoIES').value = ies.codigoTipoIES;
        document.getElementById('tipoIES').value = ies.tipoIES;
        document.getElementById('regionIES').value = ies.regionIES;
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
    });

    // Evento para cuando se seleccione una IES
    iesSelect.addEventListener('change', function () {
        const selectedIES = iesData.find(ies => ies.nombreIES === this.value);
        if (selectedIES) {
            mostrarInfoIES(selectedIES);
        } else {
            iesInfo.style.display = 'none';
        }
    });

    // Evento para el envío del formulario de selección
    seleccionForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const nombre = document.getElementById('nombreSeleccion').value;
        const modalidad = document.getElementById('modalidadSeleccion').value;
        const iesSeleccionada = iesSelect.value;
        const selectedIES = iesData.find(ies => ies.nombreIES === iesSeleccionada);
        const puntajePreseleccion = parseInt(puntajePreseleccionInput.value);

        if (!selectedIES) {
            alert('Por favor, seleccione una IES válida.');
            return;
        }

        if (isNaN(puntajePreseleccion) || puntajePreseleccion < 0 || puntajePreseleccion > 180) {
            alert('Por favor, ingrese un puntaje de preselección válido entre 0 y 180.');
            return;
        }

        const puntosExtraPAO = parseInt(selectedIES.puntosExtraPAO) || 0;
        const puntajeSeleccion = puntajePreseleccion + puntosExtraPAO;

        let resultado = `
      <h3>Resultado de Selección para ${nombre}</h3>
      <p>Modalidad: ${modalidad}</p>
      <p>IES seleccionada: ${selectedIES.nombreIES}</p>
      <button class="btn btn-primary">Tu puntaje de selección es: <strong>${puntajeSeleccion.toFixed(2)}</strong> puntos</button>
      <div class="resultado-detalle">
        <h4>Desglose del puntaje:</h4>
        <ul>
          <li>Puntaje de Preselección: ${puntajePreseleccion} puntos</li>
          <li>Puntos Extra PAO: ${puntosExtraPAO} puntos</li>
        </ul>
      </div>
    `;

        resultadoSeleccion.innerHTML = resultado;
    });

    // Cargar las IES cuando la página se cargue
    cargarIES();
});