document.addEventListener('DOMContentLoaded', () => {

    // Cargar datos del cliente desde LocalStorage
    const cliente = JSON.parse(localStorage.getItem('easycool_cliente'));
    if (cliente) {
        document.getElementById('rut').value = cliente.rut || '';
        document.getElementById('nombre').value = cliente.nombre || '';
        document.getElementById('direccion').value = cliente.direccion || '';
    }

    // Elementos del DOM
    const btnGenerar = document.getElementById('btnGenerar');
    const btnCopiar = document.getElementById('btnCopiar');
    const resultado = document.getElementById('resultado');
    
    // Setear fecha de hoy
    document.getElementById('fecha_instalacion').valueAsDate = new Date();

    btnGenerar.addEventListener('click', generarCertificado);
    btnCopiar.addEventListener('click', copiarTexto);

    function generarCertificado() {
        const datos = recolectarDatos();
        const textoCertificado = crearPlantilla(datos);
        resultado.textContent = textoCertificado;
        btnCopiar.style.display = 'block';
    }

    function recolectarDatos() {
        const fechaInput = document.getElementById('fecha_instalacion').value;
        let fechaFormateada = "[Fecha no especificada]";
        if (fechaInput) {
            const [year, month, day] = fechaInput.split('-');
            fechaFormateada = `${day}/${month}/${year}`;
        }
        
        return {
            nombre: document.getElementById('nombre').value,
            rut: document.getElementById('rut').value,
            direccion: document.getElementById('direccion').value,
            marca_modelo: document.getElementById('marca_modelo').value || "[Marca/Modelo no especificado]",
            num_serie_ui: document.getElementById('num_serie_ui').value || "[N° Serie UI no especificado]",
            num_serie_ue: document.getElementById('num_serie_ue').value || "[N° Serie UE no especificado]",
            fecha_instalacion: fechaFormateada,
            incluye_garantia: document.getElementById('garantia').checked,
        };
    }

    function crearPlantilla(data) {
        // (Información de contexto de la empresa - desde memoria)
        const rutEmpresa = "77.448.234-2"; // Dato de memoria
        const nombreEmpresa = "EasyCool Climatización";
        const tecnico = "Jose Guerrero"; // Dato de memoria

        let textoGarantia = "";
        if (data.incluye_garantia) {
            textoGarantia = `
GARANTÍA:
EasyCool Climatización otorga una garantía de 1 (un) año sobre la instalación, cubriendo exclusivamente fugas de refrigerante en las uniones y/o soldaduras realizadas por nuestro personal. La garantía del equipo es cubierta directamente por el fabricante o la tienda donde fue adquirido.
(La garantía de instalación se anula si el equipo es intervenido por terceros).
`;
        }

        let plantilla = `
CERTIFICADO DE INSTALACIÓN Y GARANTÍA
${nombreEmpresa} - RUT: ${rutEmpresa}

EasyCool Climatización certifica por este medio que, con fecha ${data.fecha_instalacion}, se ha realizado la instalación de un equipo de climatización en el domicilio del cliente:

DATOS DEL CLIENTE:
-   Nombre: ${data.nombre}
-   RUT: ${data.rut}
-   Dirección: ${data.direccion}

DATOS DEL EQUIPO INSTALADO:
-   Tipo: Aire Acondicionado Split
-   Marca/Modelo: ${data.marca_modelo}
-   N° Serie Unidad Interior: ${data.num_serie_ui}
-   N° Serie Unidad Exterior: ${data.num_serie_ue}

TRABAJOS REALIZADOS:
La instalación se efectuó siguiendo los estándares del fabricante y las buenas prácticas de refrigeración, utilizando herramientas profesionales y calibradas (bomba de vacío, vacuómetro, amperímetro) para asegurar un óptimo funcionamiento y eficiencia energética.

${textoGarantia}

Se extiende el presente certificado para los fines que el cliente estime convenientes.

Atentamente,

${tecnico}
Fundador y Técnico Especialista
EasyCool Climatización
        `;
        return plantilla.trim();
    }

    function copiarTexto() {
        navigator.clipboard.writeText(resultado.textContent)
            .then(() => {
                btnCopiar.textContent = '¡Copiado!';
                setTimeout(() => { btnCopiar.textContent = 'Copiar Texto'; }, 2000);
            })
            .catch(err => {
                console.error('Error al copiar:', err);
                alert('No se pudo copiar el texto.');
            });
    }
});
