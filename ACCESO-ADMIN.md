# 🔐 Acceso al Panel de Administración

## 📝 Credenciales de Acceso

Para acceder al panel de administración (`admin.html`), usa estas credenciales:

### Usuario 1:
- **Usuario**: `tomi`
- **Contraseña**: `laprevia`

### Usuario 2:
- **Usuario**: `facu`
- **Contraseña**: `laprevia`

---

## 🚀 Cómo Acceder

1. Abre el archivo **`admin.html`** en tu navegador
2. Ingresa uno de los usuarios: `tomi` o `facu`
3. Contraseña: `laprevia`
4. Clic en **"Iniciar Sesión"**
5. ¡Listo! Ya estás en el panel

---

## ⚙️ Cambiar Usuarios o Contraseñas

Si quieres agregar más usuarios o cambiar las contraseñas:

1. Abre el archivo: **`admin-panel.js`**
2. Busca esta sección (líneas 55-58):

```javascript
const USUARIOS_PERMITIDOS = {
    'tomi': 'laprevia',
    'facu': 'laprevia'
};
```

3. Puedes:
   - **Agregar usuarios**: Añade una línea nueva
   - **Cambiar contraseñas**: Modifica el valor después de `:`
   - **Eliminar usuarios**: Borra la línea completa

### Ejemplos:

**Agregar un nuevo usuario:**
```javascript
const USUARIOS_PERMITIDOS = {
    'tomi': 'laprevia',
    'facu': 'laprevia',
    'admin': 'micontraseña123'  // Usuario nuevo
};
```

**Cambiar contraseña:**
```javascript
const USUARIOS_PERMITIDOS = {
    'tomi': 'nuevacontraseña',  // Contraseña cambiada
    'facu': 'laprevia'
};
```

4. Guarda el archivo (Ctrl+S o Cmd+S)
5. Recarga la página de login (F5)

---

## 🔒 Seguridad

- ✅ Las credenciales se guardan en tu navegador (LocalStorage)
- ✅ Al cerrar sesión, se eliminan automáticamente
- ✅ Solo pueden acceder usuarios registrados en el código
- ⚠️ No compartas estas credenciales con personas no autorizadas

---

## 💡 Notas Importantes

- Los usuarios deben escribirse en **minúsculas**
- No dejes espacios al inicio o final del usuario
- La contraseña distingue mayúsculas y minúsculas
- Si olvidas la contraseña, revisa el archivo `admin-panel.js`

---

**¡Gestiona tu sitio web fácilmente! 🚀**

