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
        return {
            nombre: document.getElementById('nombre').value,
            direccion: document.getElementById('direccion').value,
            motivo_visita: document.getElementById('motivo_visita').value,
            diagnostico_tecnico: document.getElementById('diagnostico_tecnico').value,
            solucion_aplicada: document.getElementById('solucion_aplicada').value,
            repuestos: document.getElementById('repuestos').value,
        };
    }

    function crearPrompt(data) {
        let textoPrompt = `
        Eres "EasyBot", el asistente técnico de "EasyCool Climatización". Tu tono debe ser profesional, técnico y muy claro.
        
        Genera un informe de visita técnica (diagnóstico o reparación) para el cliente.
        
        **Instrucciones:**
        1.  Inicia con un título claro: "INFORME DE VISITA TÉCNICA - EASYCOOL".
        2.  Indica la fecha actual (puedes poner "Fecha: [Fecha del día]").
        3.  Detalla los datos del cliente: Nombre (${data.nombre}) y Dirección (${data.direccion}).
        4.  Crea una sección "MOTIVO DE LA VISITA" (Reporte del cliente): ${data.motivo_visita}
        5.  Crea una sección "DIAGNÓSTICO TÉCNICO" (Lo detectado por el técnico): ${data.diagnostico_tecnico}
        6.  Crea una sección "TRABAJOS REALIZADOS" (La solución aplicada): ${data.solucion_aplicada}
        7.  Si se usaron repuestos, crea una sección "REPUESTOS UTILIZADOS": ${data.repuestos || "No se utilizaron repuestos."}
        8.  Cierra con un estado final (ej. "El equipo queda 100% operativo.") y la firma: "Servicio realizado por: EasyCool Climatización".

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
