# 🔥 Configuración de Firebase para Panel de Administración

## 📋 Requisitos Previos
- Cuenta de Google/Gmail
- Navegador web actualizado

## 🚀 Paso 1: Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto" o "Add project"
3. Nombra tu proyecto (ejemplo: "la-previa-bebidas")
4. Acepta los términos y continúa
5. Desactiva Google Analytics (opcional) o configúralo
6. Haz clic en "Crear proyecto"

## 🔐 Paso 2: Configurar Autenticación

1. En el menú lateral, haz clic en **"Authentication"**
2. Haz clic en **"Get Started"** o **"Comenzar"**
3. Ve a la pestaña **"Sign-in method"**
4. Haz clic en **"Email/Password"**
5. **Activa** la opción "Email/Password"
6. Guarda los cambios

### Crear Usuario Administrador:
1. Ve a la pestaña **"Users"**
2. Haz clic en **"Add user"**
3. Ingresa:
   - **Email**: tu correo de administrador (ej: admin@laprevia.com)
   - **Password**: una contraseña segura (mínimo 6 caracteres)
4. Haz clic en **"Add user"**

> ⚠️ **IMPORTANTE**: Guarda estas credenciales en un lugar seguro. Las necesitarás para acceder al panel de administración.

## 📦 Paso 3: Configurar Firestore Database

1. En el menú lateral, haz clic en **"Firestore Database"**
2. Haz clic en **"Create database"**
3. Selecciona **"Start in production mode"**
4. Elige la ubicación más cercana (ejemplo: "southamerica-east1" para Argentina)
5. Haz clic en **"Enable"**

### Configurar Reglas de Seguridad:
1. Ve a la pestaña **"Rules"**
2. Reemplaza las reglas con el siguiente código:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Solo usuarios autenticados pueden leer
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. Haz clic en **"Publish"**

## 📁 Paso 4: Configurar Storage (para imágenes)

1. En el menú lateral, haz clic en **"Storage"**
2. Haz clic en **"Get Started"**
3. Acepta las reglas predeterminadas
4. Elige la misma ubicación que Firestore
5. Haz clic en **"Done"**

### Configurar Reglas de Storage:
1. Ve a la pestaña **"Rules"**
2. Reemplaza las reglas con:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. Haz clic en **"Publish"**

## ⚙️ Paso 5: Obtener Configuración de Firebase

1. En el menú lateral, haz clic en el **ícono de engranaje ⚙️**
2. Selecciona **"Project settings"**
3. Baja hasta la sección **"Your apps"**
4. Haz clic en el ícono **"</>"** (Web)
5. Registra tu app:
   - **App nickname**: "La Previa Web"
   - **NO** marques "Firebase Hosting"
6. Haz clic en **"Register app"**
7. Verás un código JavaScript similar a este:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

8. **COPIA ESTOS VALORES** (los necesitarás en el siguiente paso)

## 📝 Paso 6: Configurar el Código del Panel

1. Abre el archivo **`admin-panel.js`**
2. Busca la sección que dice:

```javascript
const firebaseConfig = {
    apiKey: "TU_API_KEY",  // Reemplazar con tu configuración
    authDomain: "TU_AUTH_DOMAIN",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_STORAGE_BUCKET",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID"
};
```

3. **REEMPLAZA** los valores con los que copiaste en el Paso 5:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456"
};
```

4. **GUARDA** el archivo

## 🎉 Paso 7: Probar el Panel de Administración

1. Abre el archivo **`admin.html`** en tu navegador
2. Deberías ver la pantalla de login
3. Ingresa el email y contraseña que creaste en el Paso 2
4. Si todo está correcto, verás el panel de administración

## 📱 ¿Cómo Usar el Panel?

### Agregar Productos:
1. Ve a la sección **"Productos"**
2. Haz clic en **"Agregar Producto"**
3. Completa el formulario:
   - Nombre del producto
   - Categoría (Gin, Vino, Licor)
   - Precio
   - Sube una imagen
   - Marca si está activo, en oferta o destacado
4. Haz clic en **"Guardar Producto"**

### Gestionar Banners:
1. Ve a la sección **"Banners"**
2. Haz clic en **"Agregar Banner"**
3. Sube una imagen (recomendado: 1920x600px)
4. Agrega título y descripción
5. Haz clic en **"Guardar Banner"**

### Ver en el Sitio Web:
- Los productos y banners que marques como **"Activos"** se mostrarán automáticamente en `index.html`
- Los productos **"Inactivos"** NO se mostrarán a los visitantes
- Los productos en **"Oferta"** mostrarán una etiqueta especial

## 🔒 Seguridad

### Proteger tus Credenciales:
- **NUNCA** compartas tu email y contraseña de administrador
- Usa una contraseña fuerte y única
- Si compartes el proyecto, **NO incluyas** el archivo `admin-panel.js` con las credenciales reales

### Cambiar Contraseña:
1. Ve a Firebase Console
2. Authentication > Users
3. Haz clic en el usuario
4. Haz clic en los tres puntos > Reset password

## 🛠️ Solución de Problemas

### Error: "Firebase: Error (auth/invalid-email)"
- Verifica que el email esté correctamente escrito
- Asegúrate de haber creado el usuario en Firebase Authentication

### Error: "Firebase: Error (auth/wrong-password)"
- Verifica la contraseña
- Intenta resetear la contraseña desde Firebase Console

### No se suben las imágenes:
- Verifica que las reglas de Storage estén configuradas correctamente
- Asegúrate de que el archivo sea una imagen válida (JPG, PNG, etc.)

### Los productos no aparecen en index.html:
- Verifica que el producto esté marcado como "Activo"
- Revisa la consola del navegador para ver errores
- Asegúrate de que `script-optimized.js` esté cargando productos desde Firebase

## 📞 Contacto

Si necesitas ayuda adicional con la configuración, consulta:
- [Documentación de Firebase](https://firebase.google.com/docs)
- [Firebase YouTube](https://www.youtube.com/firebase)

---

**¡Listo!** 🎉 Ahora tienes un panel de administración profesional para gestionar tu sitio web.

