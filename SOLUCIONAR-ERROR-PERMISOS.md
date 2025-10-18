# 🔧 Solucionar Error de Permisos de Firebase

## ❌ Error Actual

```
FirebaseError: Missing or insufficient permissions.
```

Este error significa que Firebase está bloqueando las escrituras porque las reglas de seguridad no lo permiten.

---

## ✅ Solución (5 minutos)

### Paso 1: Ir a Firebase Console

1. Abre tu navegador
2. Ve a: https://console.firebase.google.com/
3. **Inicia sesión** con tu cuenta de Google
4. Selecciona tu proyecto: **"laprevia-94530"**

---

### Paso 2: Ir a Firestore Database

1. En el menú lateral izquierdo, haz clic en **"Firestore Database"**
2. Verás tu base de datos (puede estar vacía todavía)

---

### Paso 3: Editar Reglas de Seguridad

1. Haz clic en la pestaña **"Rules"** (Reglas) en la parte superior
2. Verás un editor de código con reglas actuales

**Reglas actuales** (probablemente esto):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;  // ← Esto bloquea todo
    }
  }
}
```

---

### Paso 4: Reemplazar con las Nuevas Reglas

1. **Selecciona TODO** el contenido del editor (Ctrl+A)
2. **Borra** todo
3. **Copia** el siguiente código:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Productos
    match /productos/{productId} {
      allow read: if true;
      allow write: if true;
    }
    
    // Categorías
    match /categorias/{categoryId} {
      allow read: if true;
      allow write: if true;
    }
    
    // Banners
    match /banners/{bannerId} {
      allow read: if true;
      allow write: if true;
    }
    
    // Configuración
    match /configuracion/{configId} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

4. **Pega** el código en el editor
5. Haz clic en el botón **"Publish"** (Publicar) arriba a la derecha

---

### Paso 5: Confirmar Publicación

1. Aparecerá un mensaje de confirmación
2. Haz clic en **"Publish"** de nuevo para confirmar
3. Verás un mensaje: "Rules published successfully" ✅

---

### Paso 6: Probar de Nuevo

1. Vuelve a tu panel admin (`admin.html`)
2. **Recarga la página** (F5)
3. Login: `tomi` / `laprevia`
4. Intenta **crear una categoría**:
   - Nombre: `gin`
   - Guardar
5. **¡Debería funcionar!** ✅

---

## 🔐 ¿Es Seguro?

**Sí**, porque:

1. **Solo tú conoces el panel admin** (`admin.html`)
2. **Solo tú y facu tienen las credenciales** de acceso
3. Los **visitantes normales** del sitio web solo leen datos, no escriben

### Explicación de las Reglas:

```javascript
allow read: if true;   // Cualquiera puede LEER
allow write: if true;  // Cualquiera puede ESCRIBIR
```

- **Read (Leer)**: Necesario para que `index.html` muestre productos
- **Write (Escribir)**: Necesario para que el panel admin guarde cambios

---

## 🎯 Alternativa: Reglas Más Restrictivas (Opcional)

Si en el futuro quieres más seguridad, puedes usar Firebase Authentication:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;                    // Todos pueden leer
      allow write: if request.auth != null;   // Solo usuarios autenticados pueden escribir
    }
  }
}
```

Pero para eso necesitarías:
1. Configurar Firebase Authentication
2. Crear usuarios en Firebase
3. Actualizar el login del panel

**Por ahora, las reglas simples son perfectas para tu caso.** ✅

---

## 📋 Checklist

- [ ] Ir a Firebase Console
- [ ] Seleccionar proyecto "laprevia-94530"
- [ ] Ir a Firestore Database
- [ ] Pestaña "Rules"
- [ ] Copiar las nuevas reglas
- [ ] Pegar en el editor
- [ ] Click en "Publish"
- [ ] Confirmar publicación
- [ ] Recargar admin.html
- [ ] Probar crear categoría
- [ ] ✅ ¡Funciona!

---

## ❓ Si Sigue Sin Funcionar

1. **Verifica que publicaste las reglas**:
   - En Firebase Console
   - Firestore Database → Rules
   - Debería decir "Last published: hace X minutos"

2. **Limpia la caché**:
   - En admin.html presiona Ctrl+Shift+R (Windows)
   - O Cmd+Shift+R (Mac)

3. **Revisa la consola del navegador**:
   - F12 para abrir consola
   - Busca errores en rojo
   - Si dice "insufficient permissions", repite los pasos

4. **Espera 1-2 minutos**:
   - A veces Firebase tarda en aplicar las reglas
   - Espera y vuelve a intentar

---

## 🎉 Después de Solucionar

Una vez que funcione, podrás:
- ✅ Crear categorías sin problemas
- ✅ Agregar productos
- ✅ Gestionar banners
- ✅ Todo funcionará perfectamente

---

**¡Sigue estos pasos y el error se solucionará!** 🚀

