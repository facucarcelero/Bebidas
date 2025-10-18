# ⚡ Inicio Rápido - Panel de Administración

## 🎯 Objetivo
En 30 minutos tendrás tu panel de administración funcionando completamente.

## 📝 Lo Que Necesitas
- ✅ Una cuenta de Google/Gmail
- ✅ Navegador web actualizado (Chrome recomendado)
- ✅ Conexión a internet

## 🚀 Pasos (30 minutos)

### PASO 1: Crear Proyecto Firebase (10 min)

1. Ve a: https://console.firebase.google.com/
2. Clic en **"Agregar proyecto"**
3. Nombre: **"la-previa-bebidas"** (o el que prefieras)
4. Desactiva Google Analytics (opcional)
5. Clic en **"Crear proyecto"**
6. Espera a que termine...
7. Clic en **"Continuar"**

### PASO 2: Configurar Authentication (5 min)

1. En el menú lateral: **Authentication**
2. Clic en **"Comenzar"**
3. Pestaña **"Sign-in method"**
4. Clic en **"Email/Password"**
5. **Activa** el toggle
6. Clic en **"Guardar"**
7. Pestaña **"Users"**
8. Clic en **"Add user"**
9. Email: **tu-email@ejemplo.com**
10. Password: **tuContraseñaSegura123**
11. Clic en **"Add user"**

> ⚠️ **IMPORTANTE**: Guarda tu email y contraseña en un lugar seguro!

### PASO 3: Configurar Firestore (3 min)

1. En el menú lateral: **Firestore Database**
2. Clic en **"Create database"**
3. **"Start in production mode"**
4. Ubicación: **southamerica-east1** (Argentina)
5. Clic en **"Enable"**
6. Pestaña **"Rules"**
7. Pega este código:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

8. Clic en **"Publish"**

### PASO 4: Configurar Storage (3 min)

1. En el menú lateral: **Storage**
2. Clic en **"Get started"**
3. Acepta las reglas
4. Usa la misma ubicación: **southamerica-east1**
5. Clic en **"Done"**
6. Pestaña **"Rules"**
7. Pega este código:

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

8. Clic en **"Publish"**

### PASO 5: Copiar Configuración (5 min)

1. Menú lateral: **Icono de engranaje ⚙️ → Project settings**
2. Baja hasta **"Your apps"**
3. Clic en el ícono **"</>"** (Web)
4. App nickname: **"La Previa Web"**
5. Clic en **"Register app"**
6. Verás un código JavaScript:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123...",
  appId: "1:123..."
};
```

7. **COPIA TODO EL BLOQUE** (desde `{` hasta `}`, incluyendo las llaves)

### PASO 6: Pegar Configuración en tu Código (2 min)

1. Abre el archivo: **`firebase-config.js`**
2. Busca esta sección:

```javascript
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_AUTH_DOMAIN",
    // ... resto de valores...
};
```

3. **REEMPLAZA** todo el contenido del `firebaseConfig` con lo que copiaste
4. Debería quedar así:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSy...",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "123...",
    appId: "1:123..."
};
```

5. **GUARDA** el archivo (Ctrl+S o Cmd+S)

### PASO 7: Probar el Panel (2 min)

1. Abre en tu navegador: **`admin.html`**
2. Deberías ver la pantalla de login
3. Ingresa:
   - **Usuario**: `tomi` o `facu`
   - **Contraseña**: `laprevia`
4. Clic en **"Iniciar Sesión"**
5. **¡LISTO!** Deberías ver el panel de administración

> 💡 **Nota**: Ahora el sistema usa usuarios locales (tomi/facu) en lugar de Firebase Authentication. ¡Más simple!

## ✅ Verificación Rápida

Si todo salió bien:
- ✅ Ves el Dashboard con estadísticas en 0
- ✅ El menú lateral funciona
- ✅ Puedes navegar entre secciones
- ✅ Tu email aparece arriba a la derecha

## 🎯 Siguiente Paso: Agregar tu Primer Producto

1. Haz clic en **"Productos"** en el menú
2. Clic en **"Agregar Producto"**
3. Completa:
   - Nombre: **"Gin Belladonna 750cc"**
   - Categoría: **Gin**
   - Precio: **25000**
   - Descripción: **"Gin premium que cambia de color"**
4. Haz clic en **"Seleccionar imagen"**
5. Elige una imagen de producto (JPG o PNG)
6. Marca ✅ **"Producto Activo"**
7. Clic en **"Guardar Producto"**
8. Espera unos segundos...
9. **¡Tu primer producto está guardado!**

## 🌐 Ver el Producto en el Sitio Web

1. En el panel admin, clic en **"Ver Sitio"** (arriba a la derecha)
2. Se abrirá **`index.html`** en una nueva pestaña
3. Baja hasta la sección de productos
4. **¡Deberías ver tu producto!**

## ❌ Si Algo Sale Mal

### No puedo iniciar sesión:
- Verifica que uses: Usuario: `tomi` o `facu` / Contraseña: `laprevia`
- Los usuarios deben escribirse en minúsculas
- Revisa que no haya espacios al inicio o final del usuario

### Error al guardar producto:
- Abre la consola del navegador (F12)
- Busca mensajes en rojo
- Verifica que las reglas de Firestore y Storage estén publicadas

### El producto no aparece en index.html:
- Asegúrate de haber marcado ✅ "Producto Activo"
- Recarga la página con Ctrl+F5 (limpia la caché)
- Espera unos segundos (Firebase puede tardar 5-10 segundos)

## 🎓 Siguiente Paso: Dominar el Panel

Ahora que funciona, lee:
- **`GUIA-PANEL-ADMIN.md`** - Manual completo de uso
- **`README-PANEL-ADMIN.md`** - Todas las características

## 🎉 ¡Felicitaciones!

Ya tienes un panel de administración profesional funcionando.

**Próximos pasos recomendados:**
1. Agrega 2-3 productos más para practicar
2. Prueba crear una oferta (precio original + precio rebajado)
3. Agrega un banner personalizado
4. Actualiza tu información de contacto
5. ¡Empieza a gestionar tu sitio web como un profesional! 🚀

---

**¿Necesitas ayuda?**
- Consulta `CONFIGURACION-FIREBASE.md` para detalles
- Revisa `GUIA-PANEL-ADMIN.md` para usar el panel
- Abre la consola del navegador (F12) para ver errores

**¡Éxito! 🎯**

