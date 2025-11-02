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
        document.getElementById('direccion').value = cliente.direccion || '';
    }

    // Elementos del DOM
    const btnGenerar = document.getElementById('btnGenerar');
    const btnCopiar = document.getElementById('btnCopiar');
    const resultado = document.getElementById('resultado');

    btnGenerar.addEventListener('click', generarInforme);
    btnCopiar.addEventListener('click', copiarTexto);

    async function generarInforme() {
        btnGenerar.disabled = true;
        btnGenerar.textContent = 'Generando Informe IA...';
        resultado.textContent = 'Contactando al cerebro de EasyCool (IA)...';

        const datos = recolectarDatos();
        const prompt = crearPrompt(datos);

        try {
            const response = await fetch(URL_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
            console.error('Error al generar informe:', error);
            resultado.textContent = `Error de conexión con la IA. Revisa la API Key o la conexión a internet.\nDetalle: ${error.message}`;
        } finally {
            btnGenerar.disabled = false;
            btnGenerar.textContent = 'Generar Informe';
        }
    }

    function recolectarDatos() {
        const tareasCheckboxes = document.querySelectorAll('#checklist_tareas input[type="checkbox"]:checked');
        const tareasRealizadas = Array.from(tareasCheckboxes).map(cb => cb.value);

        return {
            nombre: document.getElementById('nombre').value,
            direccion: document.getElementById('direccion').value,
            equipo_ubicacion: document.getElementById('equipo_ubicacion').value,
            marca_modelo: document.getElementById('marca_modelo').value,
            tareas: tareasRealizadas.join(', ') || "No se especificaron tareas.",
            presion_baja: document.getElementById('presion_baja').value,
            presion_alta: document.getElementById('presion_alta').value,
            temp_inyeccion: document.getElementById('temp_inyeccion').value,
            temp_retorno: document.getElementById('temp_retorno').value,
            amperaje_nominal: document.getElementById('amperaje_nominal').value,
            amperaje_arranque: document.getElementById('amperaje_arranque').value,
            observaciones: document.getElementById('observaciones').value,
        };
    }

    function crearPrompt(data) {
        let textoPrompt = `
        Eres "EasyBot", el asistente técnico de "EasyCool Climatización". Tu tono debe ser profesional, técnico y claro.
        
        Genera un informe técnico de mantenimiento preventivo para el cliente.
        
        **Instrucciones:**
        1.  Inicia con un título claro: "INFORME DE MANTENIMIENTO PREVENTIVO - EASYCOOL".
        2.  Indica la fecha actual (puedes poner "Fecha: [Fecha del día]").
        3.  Detalla los datos del cliente: Nombre (${data.nombre}) y Dirección (${data.direccion}).
        4.  Detalla los datos del equipo: Ubicación (${data.equipo_ubicacion}) y Marca/Modelo (${data.marca_modelo}).
        5.  Crea una sección "TAREAS REALIZADAS" y lista las tareas marcadas: ${data.tareas}.
        6.  Crea una sección "PARÁMETROS TÉCNICOS" y lista los valores medidos:
            -   Presión de Baja: ${data.presion_baja || 'N/A'} PSI
            -   Presión de Alta: ${data.presion_alta || 'N/A'} PSI
            -   Temperatura Inyección UI: ${data.temp_inyeccion || 'N/A'} °C
            -   Temperatura Retorno UI: ${data.temp_retorno || 'N/A'} °C
            -   Amperaje (Nominal/Arranque): ${data.amperaje_nominal || 'N/A'} / ${data.amperaje_arranque || 'N/A'} A
        7.  Crea una sección "DIAGNÓSTICO Y OBSERVACIONES" con el texto: ${data.observaciones || "El equipo queda operativo."}
        8.  Cierra con un agradecimiento y firma: "Servicio realizado por: EasyCool Climatización".

        Genera el informe final en texto plano, bien estructurado.
        `;
        return textoPrompt.trim();
    }

    function copiarTexto() {
        navigator.clipboard.writeText(resultado.textContent)
            .then(() => {
                btnCopiar.textContent = '¡Copiado!';
                setTimeout(() => { btnCopiar.textContent = 'Copiar Informe'; }, 2000);
            })
            .catch(err => {
                console.error('Error al copiar:', err);
                alert('No se pudo copiar el texto.');
            });
    }
});
