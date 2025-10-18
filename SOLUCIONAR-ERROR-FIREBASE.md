# 🔧 Solución para Error de Firebase - CONFIGURATION_NOT_FOUND

## ❌ Error Actual
```
GET https://www.googleapis.com/identitytoolkit/v3/relyingparty/getProjectConfig?key=... 400 (Bad Request)
{"error":{"code":400,"message":"CONFIGURATION_NOT_FOUND","errors":[{"message":"CONFIGURATION_NOT_FOUND","domain":"global","reason":"invalid"}]}}
```

## 🔍 Causa del Problema
El error `CONFIGURATION_NOT_FOUND` indica que Firebase no puede encontrar la configuración del proyecto. Esto puede deberse a:

1. **Autenticación no habilitada** en Firebase Console
2. **Proyecto no configurado correctamente**
3. **API Key inválida o expirada**

## ✅ Solución Paso a Paso

### 1. Verificar Firebase Console
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto `laprevia-94530`
3. Ve a **Authentication** en el menú lateral
4. Haz clic en **Get Started** si no está habilitado

### 2. Habilitar Métodos de Autenticación
1. En **Authentication** → **Sign-in method**
2. Habilita **Email/Password**:
   - Haz clic en **Email/Password**
   - Activa **Enable**
   - Guarda los cambios

### 3. Verificar Firestore Database
1. Ve a **Firestore Database** en el menú lateral
2. Haz clic en **Create database**
3. Selecciona **Start in test mode** (para desarrollo)
4. Elige una ubicación (preferiblemente `southamerica-east1` para Argentina)

### 4. Configurar Reglas de Seguridad
En **Firestore Database** → **Rules**, reemplaza con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura y escritura para todos los documentos
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 5. Verificar Configuración del Proyecto
1. Ve a **Project Settings** (⚙️)
2. En **General** → **Your apps**
3. Verifica que la configuración coincida con `firebase-config.js`

### 6. Verificar API Key
1. En **Project Settings** → **General**
2. Busca **Web API Key**
3. Verifica que coincida con la de `firebase-config.js`

## 🧪 Probar la Conexión

Después de hacer estos cambios:

1. **Recarga la página** del sitio web
2. **Abre la consola del navegador** (F12)
3. **Busca estos mensajes**:
   - ✅ `🔥 Inicializando Firebase...`
   - ✅ `✅ Firebase inicializado correctamente`
   - ❌ Si ves errores, revisa los pasos anteriores

## 🔄 Si el Error Persiste

### Opción 1: Crear Nuevo Proyecto
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. **Add project** → `laprevia-nuevo`
3. Sigue los pasos de configuración
4. Actualiza `firebase-config.js` con la nueva configuración

### Opción 2: Usar Modo Offline
El sitio funcionará sin Firebase usando datos locales como respaldo.

## 📞 Soporte
Si necesitas ayuda adicional, verifica:
- [Documentación de Firebase](https://firebase.google.com/docs)
- [Guía de configuración](https://firebase.google.com/docs/web/setup)
