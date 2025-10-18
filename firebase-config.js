// ===== CONFIGURACIÓN DE FIREBASE PARA EL SITIO WEB =====
// Este archivo se usa tanto en el sitio web principal como en el panel de admin

const firebaseConfig = {
    apiKey: "AIzaSyAWJUPl8fhLhdNy6dLsKvmAQNMsdBNwj30",
    authDomain: "laprevia-94530.firebaseapp.com",
    projectId: "laprevia-94530",
    storageBucket: "laprevia-94530.firebasestorage.app",
    messagingSenderId: "649497602463",
    appId: "1:649497602463:web:bc95294bb9d7ac9e2cb5aa",
    // Deshabilitar servicios que causan errores
    auth: false,
    analytics: false,
    messaging: false
};

// ===== VERIFICACIÓN DE CONFIGURACIÓN =====
// Verificar que la configuración sea válida
function validateFirebaseConfig() {
    const required = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
    const missing = required.filter(key => !firebaseConfig[key]);
    
    if (missing.length > 0) {
        console.error('❌ Configuración de Firebase incompleta. Faltan:', missing);
        return false;
    }
    
    console.log('✅ Configuración de Firebase válida');
    return true;
}

// Validar la configuración al cargar
if (typeof window !== 'undefined') {
    validateFirebaseConfig();
}

