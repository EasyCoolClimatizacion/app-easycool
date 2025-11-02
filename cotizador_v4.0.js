// Espera a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {

    // --- CEREBRO IA (Componente 2) ---
    // 1. Ir a Google AI Studio (https://aistudio.google.com/)
    // 2. Obtener una nueva API Key
    // 3. Pegar la clave aquí abajo
    const API_KEY = 'AIzaSyCd6fLHdpH6l9hNJdRuJ4_fTy9kVXBqt6U'; // <--- PEGA TU CLAVE API (Línea 20)
    // ------------------------------------

    const URL_API = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    // Cargar datos del cliente desde LocalStorage
    const cliente = JSON.parse(localStorage.getItem('easycool_cliente'));
    if (cliente) {
        document.getElementById('rut').value = cliente.rut || '';
        document.getElementById('nombre').value = cliente.nombre || '';
        document.getElementById('telefono').value = cliente.telefono || '';
        document.getElementById('direccion').value = cliente.direccion || '';
    }

    // Elementos del DOM
    const btnGenerar = document.getElementById('btnGenerar');
    const btnCopiar = document.getElementById('btnCopiar');
    const resultado = document.getElementById('resultado');

    // Event Listener para el botón de generar
    btnGenerar.addEventListener('click', generarCotizacion);
    btnCopiar.addEventListener('click', copiarTexto);

    async function generarCotizacion() {
        btnGenerar.disabled = true;
        btnGenerar.textContent = 'Generando con IA...';
        resultado.textContent = 'Contactando al cerebro de EasyCool (IA)...';

        const datos = recolectarDatos();
        const prompt = crearPrompt(datos);

        try {
            const response = await fetch(URL_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();
            const textoGenerado = data.candidates[0].content.parts[0].text;
            
            resultado.textContent = textoGenerado;
            btnCopiar.style.display = 'block';

        } catch (error) {
            console.error('Error al generar cotización:', error);
            resultado.textContent = `Error de conexión con la IA. Revisa la API Key o la conexión a internet.\nDetalle: ${error.message}`;
        } finally {
            btnGenerar.disabled = false;
            btnGenerar.textContent = 'Generar Cotización';
        }
    }

    function recolectarDatos() {
        return {
            nombre: document.getElementById('nombre').value,
            direccion: document.getElementById('direccion').value,
            tipo_equipo: document.getElementById('tipo_equipo').value,
            capacidad_btu: document.getElementById('capacidad_btu').value,
            marca_modelo: document.getElementById('marca_modelo').value,
            metros_caneria: document.getElementById('metros_caneria').value,
            punto_electrico: document.getElementById('punto_electrico').value,
            soporte_ext: document.getElementById('soporte_ext').value,
            valor_total: document.getElementById('valor_total').value,
            observaciones: document.getElementById('observaciones').value,
        };
    }

    function crearPrompt(data) {
        // (Información de contexto de la empresa - desde memoria)
        const infoEmpresa = "Nuestra empresa EasyCool Climatización se especializa en instalaciones profesionales de aire acondicionado. Usamos herramientas calibradas como bomba de vacío, vacuómetro y amperímetro. La garantía de instalación es de 1 año en fugas de refrigerante. Aceptamos pago por transferencia y efectivo.";

        let textoPrompt = `
        Eres "EasyBot", el asistente de cotizaciones de "EasyCool Climatización". Tu tono debe ser profesional, técnico y muy amable.
        
        Genera un texto de cotización formal para enviar por WhatsApp o correo, dirigido al cliente.
        
        **Instrucciones:**
        1.  Saluda cordialmente al cliente por su nombre: ${data.nombre}.
        2.  Confirma la dirección de instalación: ${data.direccion}.
        3.  Detalla claramente los ítems de la cotización usando los datos proporcionados.
        4.  Menciona que la instalación incluye: ${infoEmpresa}
        5.  Indica el valor total de forma clara: $${new Intl.NumberFormat('es-CL').format(data.valor_total)}.
        6.  Si hay observaciones (${data.observaciones}), inclúyelas como "Consideraciones adicionales".
        7.  Cierra con un llamado a la acción (ej. "Quedamos atentos para agendar su instalación") y firma como "Equipo EasyCool Climatización".

        **Datos para la Cotización:**
        -   Cliente: ${data.nombre}
        -   Dirección: ${data.direccion}
        -   Tipo de Equipo: ${data.tipo_equipo} ${data.capacidad_btu} BTU
        -   Marca/Modelo: ${data.marca_modelo || "A definir por cliente"}
        -   Metros de Cañería incluidos: ${data.metros_caneria}m
        -   Instalación de Punto Eléctrico: ${data.punto_electrico}
        -   Soporte Unidad Exterior: ${data.soporte_ext}
        -   Observaciones: ${data.observaciones || "Ninguna."}
        -   **Valor Total del Proyecto: $${new Intl.NumberFormat('es-CL').format(data.valor_total)} CLP**

        Genera el texto final.
        `;
        return textoPrompt.trim();
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
