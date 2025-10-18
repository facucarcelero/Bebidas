// ===== FIREBASE SIN AUTENTICACIÓN =====
// Este archivo reemplaza Firebase Auth para evitar errores de CONFIGURATION_NOT_FOUND

// Sobrescribir firebase.auth() para evitar peticiones problemáticas
if (typeof firebase !== 'undefined') {
    const originalAuth = firebase.auth;
    
    firebase.auth = function() {
        return {
            signInWithEmailAndPassword: () => Promise.reject(new Error('Auth disabled')),
            signOut: () => Promise.resolve(),
            onAuthStateChanged: (callback) => {
                // Simular usuario no autenticado
                callback(null);
                return () => {};
            },
            currentUser: null,
            // Evitar que Firebase haga peticiones de configuración
            useDeviceLanguage: () => {},
            setPersistence: () => Promise.resolve(),
            signInAnonymously: () => Promise.reject(new Error('Auth disabled')),
            signInWithPopup: () => Promise.reject(new Error('Auth disabled')),
            signInWithRedirect: () => Promise.reject(new Error('Auth disabled')),
            createUserWithEmailAndPassword: () => Promise.reject(new Error('Auth disabled')),
            sendPasswordResetEmail: () => Promise.reject(new Error('Auth disabled')),
            confirmPasswordReset: () => Promise.reject(new Error('Auth disabled')),
            verifyPasswordResetCode: () => Promise.reject(new Error('Auth disabled')),
            applyActionCode: () => Promise.reject(new Error('Auth disabled')),
            checkActionCode: () => Promise.reject(new Error('Auth disabled')),
            sendEmailVerification: () => Promise.reject(new Error('Auth disabled')),
            updatePassword: () => Promise.reject(new Error('Auth disabled')),
            updateEmail: () => Promise.reject(new Error('Auth disabled')),
            updateProfile: () => Promise.reject(new Error('Auth disabled')),
            reload: () => Promise.reject(new Error('Auth disabled')),
            delete: () => Promise.reject(new Error('Auth disabled')),
            getIdToken: () => Promise.reject(new Error('Auth disabled')),
            getIdTokenResult: () => Promise.reject(new Error('Auth disabled')),
            linkWithCredential: () => Promise.reject(new Error('Auth disabled')),
            linkWithPhoneNumber: () => Promise.reject(new Error('Auth disabled')),
            linkWithPopup: () => Promise.reject(new Error('Auth disabled')),
            linkWithRedirect: () => Promise.reject(new Error('Auth disabled')),
            unlink: () => Promise.reject(new Error('Auth disabled')),
            reauthenticateWithCredential: () => Promise.reject(new Error('Auth disabled')),
            reauthenticateWithPhoneNumber: () => Promise.reject(new Error('Auth disabled')),
            reauthenticateWithPopup: () => Promise.reject(new Error('Auth disabled')),
            reauthenticateWithRedirect: () => Promise.reject(new Error('Auth disabled')),
            fetchSignInMethodsForEmail: () => Promise.reject(new Error('Auth disabled')),
            isSignInWithEmailLink: () => false,
            signInWithEmailLink: () => Promise.reject(new Error('Auth disabled')),
            sendSignInLinkToEmail: () => Promise.reject(new Error('Auth disabled')),
            useEmulator: () => {},
            settings: {},
            tenantId: null,
            languageCode: null,
            app: null
        };
    };
    
    console.log('🔇 Firebase Auth deshabilitado para evitar errores');
}
