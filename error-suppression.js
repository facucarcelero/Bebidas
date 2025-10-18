// ===== SUPRESIÓN GLOBAL DE ERRORES =====
// Este archivo se ejecuta antes que todo para interceptar errores específicos

(function() {
    'use strict';
    
    // Interceptar console.error
    const originalConsoleError = console.error;
    console.error = function(...args) {
        const message = args.join(' ');
        if (message.includes('CONFIGURATION_NOT_FOUND') || 
            message.includes('identitytoolkit') ||
            message.includes('getProjectConfig') ||
            message.includes('400 (Bad Request)') ||
            message.includes('googleapis.com') ||
            message.includes('placeholder.jpg') ||
            message.includes('@firebase/firestore') ||
            message.includes('Could not reach Cloud Firestore') ||
            message.includes('Backend didn\'t respond') ||
            message.includes('offline mode') ||
            message.includes('FirebaseError') ||
            message.includes('Failed to get document') ||
            message.includes('client is offline')) {
            // Suprimir estos errores específicos
            return;
        }
        originalConsoleError.apply(console, args);
    };
    
    // Interceptar console.warn
    const originalConsoleWarn = console.warn;
    console.warn = function(...args) {
        const message = args.join(' ');
        if (message.includes('CONFIGURATION_NOT_FOUND') || 
            message.includes('identitytoolkit') ||
            message.includes('getProjectConfig') ||
            message.includes('400 (Bad Request)') ||
            message.includes('googleapis.com') ||
            message.includes('placeholder.jpg') ||
            message.includes('@firebase/firestore') ||
            message.includes('Could not reach Cloud Firestore') ||
            message.includes('Backend didn\'t respond') ||
            message.includes('offline mode') ||
            message.includes('FirebaseError') ||
            message.includes('Failed to get document') ||
            message.includes('client is offline')) {
            // Suprimir estos warnings específicos
            return;
        }
        originalConsoleWarn.apply(console, args);
    };
    
    // Interceptar fetch
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const url = args[0];
        if (url && (
            (url.includes('googleapis.com') && url.includes('getProjectConfig')) ||
            url.includes('placeholder.jpg') ||
            url.includes('IMG/placeholder')
        )) {
            // Suprimir esta petición específica
            return Promise.reject(new Error('Request suppressed'));
        }
        return originalFetch.apply(this, args).catch(error => {
            // Suprimir errores de red específicos
            if (error.message.includes('Request suppressed') || 
                (url && url.includes('googleapis.com'))) {
                return Promise.reject(new Error('Request suppressed'));
            }
            throw error;
        });
    };
    
    // Interceptar XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
        if (url && (
            (url.includes('googleapis.com') && url.includes('getProjectConfig')) ||
            url.includes('placeholder.jpg') ||
            url.includes('IMG/placeholder')
        )) {
            // Suprimir esta petición específica
            this._suppressed = true;
            return;
        }
        return originalXHROpen.call(this, method, url, ...args);
    };
    
    const originalXHRSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(...args) {
        if (this._suppressed) {
            return;
        }
        return originalXHRSend.apply(this, args);
    };
    
    // Interceptar errores de imágenes
    document.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG' && e.target.src.includes('placeholder.jpg')) {
            e.preventDefault();
            e.stopPropagation();
            e.target.style.display = 'none';
            
            // Crear placeholder inline
            const placeholder = document.createElement('div');
            placeholder.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 200px;
                background: linear-gradient(135deg, #1A0033, #4A0044);
                border-radius: 8px;
                color: #E0E0E0;
                font-size: 2rem;
                opacity: 0.7;
            `;
            placeholder.innerHTML = '<i class="fas fa-image"></i>';
            
            e.target.parentNode.insertBefore(placeholder, e.target);
        }
    }, true);
    
    // Interceptar intentos de cargar placeholder.jpg ANTES de que se establezca el src
    const originalImageSrc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
    Object.defineProperty(HTMLImageElement.prototype, 'src', {
        get: originalImageSrc.get,
        set: function(value) {
            if (value && (value.includes('placeholder.jpg') || value.includes('IMG/placeholder'))) {
                // NO establecer el src, prevenir la carga completamente
                console.log('🚫 Bloqueando carga de placeholder.jpg');
                
                // En su lugar, usar un data URL vacío
                originalImageSrc.set.call(this, 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>');
                
                // Ocultar la imagen y mostrar placeholder
                this.style.display = 'none';
                
                // Usar setTimeout para asegurar que el DOM esté listo
                setTimeout(() => {
                    if (this.parentNode && !this.parentNode.querySelector('.error-placeholder')) {
                        const placeholder = document.createElement('div');
                        placeholder.className = 'error-placeholder';
                        placeholder.style.cssText = `
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 100%;
                            height: 200px;
                            background: linear-gradient(135deg, #1A0033, #4A0044);
                            border-radius: 8px;
                            color: #E0E0E0;
                            font-size: 2rem;
                            opacity: 0.7;
                        `;
                        placeholder.innerHTML = '<i class="fas fa-image"></i>';
                        this.parentNode.insertBefore(placeholder, this);
                    }
                }, 0);
                return;
            }
            originalImageSrc.set.call(this, value);
        }
    });
    
    // Interceptar errores de red globalmente
    window.addEventListener('error', function(e) {
        if (e.message && (
            e.message.includes('googleapis.com') ||
            e.message.includes('CONFIGURATION_NOT_FOUND') ||
            e.message.includes('identitytoolkit') ||
            e.message.includes('getProjectConfig')
        )) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, true);
    
    // Interceptar errores no capturados
    window.addEventListener('unhandledrejection', function(e) {
        if (e.reason && (
            e.reason.message && (
                e.reason.message.includes('googleapis.com') ||
                e.reason.message.includes('CONFIGURATION_NOT_FOUND') ||
                e.reason.message.includes('identitytoolkit') ||
                e.reason.message.includes('getProjectConfig')
            )
        )) {
            e.preventDefault();
            return false;
        }
    });
    
    console.log('🔇 Supresión de errores activada');
})();
