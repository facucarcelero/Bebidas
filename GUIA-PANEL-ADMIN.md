# 📚 Guía Completa del Panel de Administración - La Previa

## 🎯 Introducción

Has creado un **Panel de Administración Profesional** para gestionar completamente tu sitio web de bebidas. Ahora puedes controlar qué productos se muestran, agregar ofertas, gestionar banners del carrusel y mucho más, todo desde una interfaz moderna y fácil de usar.

## 🚀 Acceso al Panel

1. **Abre tu navegador** y ve a: `admin.html`
2. **Inicia sesión** con las credenciales que creaste en Firebase:
   - Email: El que configuraste en Firebase Authentication
   - Contraseña: Tu contraseña de administrador

> 💡 **Tip**: Puedes acceder rápidamente desde tu sitio web haciendo clic en "Admin" en la esquina inferior izquierda.

## 📊 Dashboard (Inicio)

El Dashboard te muestra un resumen general de tu sitio:

- **Total Productos**: Número total de productos registrados
- **Productos Activos**: Productos visibles en el sitio web
- **En Oferta**: Productos marcados con oferta especial
- **Banners Activos**: Banners activos en el carrusel

### Acciones Rápidas:
- **Agregar Producto**: Crea un nuevo producto rápidamente
- **Agregar Banner**: Sube un nuevo banner para el carrusel
- **Ver Sitio Web**: Abre el sitio web en una nueva pestaña

## 📦 Gestión de Productos

### Ver Todos los Productos

1. Haz clic en **"Productos"** en el menú lateral
2. Verás una tabla con todos tus productos

### Buscar y Filtrar

**Barra de Búsqueda:**
- Escribe el nombre del producto para encontrarlo rápidamente

**Filtros:**
- **Categoría**: Gin, Vino, Licor o Todos
- **Estado**: Activos, Inactivos, En Oferta o Todos

### Agregar un Nuevo Producto

1. Haz clic en el botón **"Agregar Producto"** (arriba a la derecha)
2. Completa el formulario:

   **Información Básica:**
   - **Nombre**: Ej: "Gin Belladonna 750cc"
   - **Categoría**: Selecciona Gin, Vino o Licor
   - **Precio**: El precio actual de venta (ej: 25000)
   - **Precio Original** (opcional): Si está en oferta, el precio anterior

   **Descripción:**
   - Agrega detalles del producto, características, notas de sabor, etc.

   **Imagen:**
   - Haz clic en "Seleccionar imagen"
   - Elige una imagen desde tu computadora
   - **Recomendación**: Imágenes cuadradas, mínimo 500x500px, formato JPG o PNG

   **Opciones:**
   - ✅ **Producto Activo**: Marca esto para que el producto sea visible en el sitio web
   - ✅ **En Oferta**: Marca esto si el producto tiene descuento (muestra el precio tachado)
   - ✅ **Destacado**: Los productos destacados aparecen primero

3. Haz clic en **"Guardar Producto"**

### Editar un Producto

1. Encuentra el producto en la tabla
2. Haz clic en el ícono de **lápiz (✏️)**
3. Modifica los campos que desees
4. Haz clic en **"Guardar Producto"**

### Activar/Desactivar un Producto

Para **ocultar** un producto del sitio web sin eliminarlo:
1. Haz clic en el ícono de **ojo (👁️)** o **ojo tachado (👁️‍🗨️)**
2. El producto cambiará entre Activo e Inactivo

> 💡 **Uso**: Útil para productos temporalmente sin stock o fuera de temporada

### Eliminar un Producto

1. Haz clic en el ícono de **basura (🗑️)** en rojo
2. Confirma la eliminación
3. **⚠️ ATENCIÓN**: Esta acción NO se puede deshacer

## 🎨 Gestión de Banners

Los banners son las imágenes grandes que rotan en el carrusel de la página principal.

### Ver Banners Actuales

1. Haz clic en **"Banners"** en el menú lateral
2. Verás una cuadrícula con todos los banners

### Agregar un Nuevo Banner

1. Haz clic en **"Agregar Banner"**
2. Completa el formulario:

   - **Título**: Ej: "Gin Belladonna" o "Ofertas Especiales"
   - **Descripción**: Subtítulo del banner (opcional)
   - **Imagen**: Selecciona una imagen
     - **Recomendación**: 1920x600 píxeles, formato JPG o PNG
   - **Orden**: Número de visualización (1 = primero, 2 = segundo, etc.)
   - ✅ **Banner Activo**: Marca para que sea visible

3. Haz clic en **"Guardar Banner"**

### Editar un Banner

1. Haz clic en el ícono de **lápiz** en el banner
2. Modifica los campos necesarios
3. Guarda los cambios

### Cambiar el Orden de los Banners

- Los banners se muestran según el número de "Orden"
- Para cambiar el orden, edita el banner y cambia su número de orden

### Eliminar un Banner

1. Haz clic en el ícono de **basura**
2. Confirma la eliminación

## ⚙️ Configuración

### Información de Contacto

Actualiza los datos de contacto que aparecen en tu sitio:
- **WhatsApp**: Número de teléfono con formato internacional
- **Email**: Correo electrónico de contacto

### Redes Sociales

Actualiza los enlaces de tus redes sociales:
- **Instagram**: URL completa (ej: https://www.instagram.com/tuusuario)
- **Facebook**: URL de tu página de Facebook
- **TikTok**: URL de tu perfil de TikTok

> 💡 **Nota**: Estos cambios se reflejarán automáticamente en el sitio web

## 🔐 Seguridad y Mejores Prácticas

### Mantén tu Contraseña Segura

- Usa una contraseña fuerte (mínimo 8 caracteres)
- No compartas tus credenciales
- Cierra sesión cuando termines

### Copias de Seguridad

Firebase guarda automáticamente toda tu información, pero es buena práctica:
- Tomar capturas de pantalla de productos importantes
- Guardar copias de imágenes originales

### Recomendaciones de Imágenes

**Para Productos:**
- Tamaño: 500x500px mínimo
- Formato: JPG o PNG
- Peso: Máximo 2MB
- Fondo: Blanco o transparente preferiblemente

**Para Banners:**
- Tamaño: 1920x600px
- Formato: JPG o PNG
- Peso: Máximo 3MB
- Calidad: Alta resolución

## 📱 Uso desde Móvil

El panel de administración está optimizado para dispositivos móviles:

1. Abre `admin.html` desde tu teléfono
2. Inicia sesión normalmente
3. Usa el ícono de **menú hamburguesa (☰)** para navegar
4. Todas las funciones están disponibles

## 🎯 Flujo de Trabajo Recomendado

### Para Agregar Nuevos Productos:

1. **Prepara la imagen**:
   - Toma o descarga una foto de calidad del producto
   - Recorta y optimiza si es necesario

2. **Recopila la información**:
   - Nombre exacto del producto
   - Precio actual
   - Precio anterior (si está en oferta)
   - Descripción detallada

3. **Carga en el sistema**:
   - Ve a "Productos" → "Agregar Producto"
   - Completa todos los campos
   - Sube la imagen
   - Marca como "Activo"
   - Guarda

4. **Verifica**:
   - Haz clic en "Ver Sitio" para comprobar que se muestre correctamente

### Para Crear una Oferta:

1. Edita el producto existente
2. Ingresa el **Precio Original** (precio antes del descuento)
3. Modifica el **Precio** con el nuevo precio rebajado
4. Marca la casilla **"En Oferta"**
5. Opcionalmente, márcalo como **"Destacado"**
6. Guarda

### Para Cambiar el Banner Principal:

1. Diseña o selecciona una imagen atractiva (1920x600px)
2. Ve a "Banners" → "Agregar Banner"
3. Sube la imagen
4. Añade título y descripción
5. Establece el orden (1 para que aparezca primero)
6. Marca como "Activo"
7. Guarda

## ❓ Solución de Problemas

### "No puedo iniciar sesión"
- Verifica que el email y contraseña sean correctos
- Asegúrate de haber configurado Firebase correctamente
- Revisa la consola del navegador (F12) para ver errores

### "Los productos no se muestran en el sitio web"
- Verifica que el producto esté marcado como **"Activo"**
- Recarga la página del sitio web (Ctrl + F5)
- Limpia la caché del navegador

### "Error al subir imágenes"
- Verifica que el archivo sea JPG o PNG
- Asegúrate de que el tamaño no exceda 5MB
- Comprueba tu conexión a internet

### "Los cambios no se guardan"
- Verifica tu conexión a internet
- Revisa que Firebase esté configurado correctamente
- Mira la consola del navegador para errores específicos

## 🆘 Soporte

Si necesitas ayuda adicional:

1. **Revisa la documentación de Firebase**: https://firebase.google.com/docs
2. **Consulta `CONFIGURACION-FIREBASE.md`** para problemas de configuración
3. **Revisa la consola del navegador** (F12) para ver mensajes de error específicos

## 🎉 ¡Listo para Empezar!

Ahora tienes control total sobre tu sitio web. Algunos consejos finales:

- **Mantén actualizado** tu catálogo de productos regularmente
- **Usa banners atractivos** para promocionar ofertas especiales
- **Marca productos en oferta** para atraer más clientes
- **Actualiza la descripción** de los productos con información útil
- **Responde rápido** a los mensajes de WhatsApp

**¡Éxito con tu sitio web de La Previa!** 🍷🍸🥃

---

**Versión**: 1.0  
**Última actualización**: 2024

