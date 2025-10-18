# 📸 Guía de Imágenes - Sin Pagar Firebase Storage

## 🎯 Solución: Imágenes Locales (100% Gratis)

En lugar de subir imágenes a Firebase Storage (que requiere plan de pago), usarás las imágenes que ya tienes en tu computadora. **No pagas nada** y funciona perfecto.

---

## 📁 Estructura de Carpetas

Tu proyecto ya tiene estas carpetas para imágenes:

```
Bebidas-main/
├── IMG/              ← Imágenes de PRODUCTOS
│   ├── Gin Belladonna.jpg
│   ├── BEEFEATER GIN X 700 CC.jpg
│   └── ...más productos
├── Banner/           ← Imágenes de BANNERS (carrusel)
│   ├── belladonna.jpg
│   ├── Banner Anuncio.jpg
│   └── Banner Organizacion.jpg
└── Logo/             ← Logo del sitio
    └── La Previa.jpg
```

---

## 🆕 Cómo Agregar un Producto con Imagen

### Paso 1: Preparar la Imagen

1. **Consigue** la foto del producto (puede ser de internet o tu cámara)
2. **Nombre** el archivo de forma clara:
   - ✅ Bueno: `Gin Belladonna 750cc.jpg`
   - ✅ Bueno: `Vino Malbec 2024.jpg`
   - ❌ Malo: `IMG_20241018_123456.jpg`
   - ❌ Malo: `foto123.jpg`

3. **Copia** la imagen a la carpeta **`IMG/`**

### Paso 2: Agregar en el Panel Admin

1. Abre `admin.html`
2. Login: `tomi` / `laprevia`
3. Ve a **"Productos"**
4. Clic en **"Agregar Producto"**
5. Completa el formulario:
   - Nombre: `Gin Belladonna 750cc`
   - Categoría: `Gin`
   - Precio: `25000`
   - **Imagen**: `./IMG/Gin Belladonna 750cc.jpg`
   
6. Verás un **preview** de la imagen debajo
7. Clic en **"Guardar Producto"**

---

## 🎨 Cómo Agregar un Banner

### Paso 1: Preparar la Imagen del Banner

1. **Tamaño ideal**: 1920x600 píxeles (ancho x alto)
2. **Formato**: JPG o PNG
3. **Peso**: Menos de 2MB para carga rápida

### Paso 2: Copiar a la Carpeta

1. Copia tu imagen a la carpeta **`Banner/`**
2. Ejemplo: `Banner/oferta-verano.jpg`

### Paso 3: Agregar en el Panel

1. En el panel admin, ve a **"Banners"**
2. Clic en **"Agregar Banner"**
3. Completa:
   - Título: `Oferta de Verano`
   - Descripción: `Descuentos hasta 30%`
   - **Imagen**: `./Banner/oferta-verano.jpg`
   - Orden: `1` (aparecerá primero)
   - ✅ Banner Activo

4. Clic en **"Guardar Banner"**

---

## 💡 Ejemplos de Rutas

### Para Productos (carpeta IMG/):

```
./IMG/Gin Belladonna.jpg
./IMG/BEEFEATER GIN X 700 CC.jpg
./IMG/Vino Portillo Cabernet Sauvignon x3.jpg
./IMG/JÄGERMEISTER X 700 CC.jpg
```

### Para Banners (carpeta Banner/):

```
./Banner/belladonna.jpg
./Banner/Banner Anuncio.jpg
./Banner/Banner Organizacion.jpg
```

---

## ✨ Ventajas de Este Sistema

| Característica | Firebase Storage | Imágenes Locales |
|----------------|------------------|------------------|
| **Costo** | Pago (desde $0.026/GB) | **Gratis** ✅ |
| **Velocidad** | Depende de internet | **Ultra rápido** ✅ |
| **Control** | En la nube | **Total** ✅ |
| **Configuración** | Compleja | **Simple** ✅ |
| **Funciona offline** | No | **Sí** ✅ |

---

## 🔧 Editar Imagen de un Producto

Si quieres cambiar la imagen de un producto:

### Opción 1: Cambiar la Ruta
1. Edita el producto en el panel
2. Cambia la ruta de la imagen
3. Ejemplo: de `./IMG/viejo.jpg` a `./IMG/nuevo.jpg`
4. Guarda

### Opción 2: Reemplazar el Archivo
1. En tu carpeta `IMG/`, elimina `producto-viejo.jpg`
2. Copia la nueva imagen con el **mismo nombre**
3. Recarga la página web (Ctrl+F5)
4. ¡Listo! Se verá la nueva imagen

---

## 📏 Recomendaciones de Tamaño

### Productos:
- **Tamaño**: 500x500px o 800x800px (cuadrado)
- **Formato**: JPG (para fotos) o PNG (si necesitas fondo transparente)
- **Peso**: Menos de 500KB por imagen

### Banners:
- **Tamaño**: 1920x600px (panorámico)
- **Formato**: JPG
- **Peso**: Menos de 1MB

### ¿Cómo Optimizar Imágenes?

**Herramientas Gratis Online:**
- [TinyPNG](https://tinypng.com/) - Reduce peso sin perder calidad
- [Squoosh](https://squoosh.app/) - Optimizador de Google
- [ResizeImage](https://resizeimage.net/) - Cambiar tamaño

---

## ❓ Preguntas Frecuentes

### ¿Puedo usar imágenes de internet?
✅ **Sí**, pero asegúrate de tener derecho a usarlas.

### ¿Qué pasa si la ruta está mal?
- Verás un icono roto en lugar de la imagen
- En el preview, aparecerá el logo de La Previa
- Verifica que escribiste bien el nombre del archivo

### ¿Distingue mayúsculas y minúsculas?
✅ **Sí**, `./IMG/gin.jpg` ≠ `./IMG/Gin.jpg`

### ¿Puedo crear subcarpetas?
✅ **Sí**, ejemplo: `./IMG/gin/belladonna.jpg`

### ¿Necesito internet para que funcione?
❌ **No**, las imágenes se cargan desde tu servidor/computadora

---

## 🚀 Flujo de Trabajo Recomendado

### Para Productos Nuevos:

```
1. 📸 Descarga/toma foto del producto
      ↓
2. ✂️ Optimiza la imagen (tamaño y peso)
      ↓
3. 📁 Copia a carpeta IMG/
      ↓
4. 💻 Abre admin.html
      ↓
5. ➕ Agregar Producto
      ↓
6. 📝 Completa formulario + ruta de imagen
      ↓
7. 💾 Guarda
      ↓
8. ✅ ¡Producto visible en el sitio!
```

---

## 🎯 Ejemplo Completo

### Agregar "Gin Hendrick's 750cc":

**1. Preparar imagen:**
- Descarga foto de Gin Hendrick's
- Renombra a: `Gin Hendricks 750cc.jpg`
- Optimiza (si pesa más de 500KB)
- Copia a: `D:\Documentos\Proyectos\Bebidas-main\IMG\`

**2. En el panel admin:**
```
Nombre: Gin Hendrick's 750cc
Categoría: Gin
Precio: 45000
Descripción: Gin escocés premium con infusión de pepino y pétalos de rosa
Imagen: ./IMG/Gin Hendricks 750cc.jpg
✅ Producto Activo
```

**3. Guardar**

**4. Verificar:**
- Abre `index.html` en el navegador
- Baja a la sección Productos
- ¡Deberías ver tu Gin Hendrick's! 🎉

---

## 💾 Backup de Imágenes

**Importante:** Guarda copias de seguridad de tus imágenes

### Método Simple:
1. Copia toda la carpeta `IMG/` a un pendrive o nube
2. O comprime: `IMG-backup-2024.zip`
3. Guarda en lugar seguro

### Cuándo hacer backup:
- Cada vez que agregues varias imágenes nuevas
- Antes de hacer cambios grandes
- Al menos una vez al mes

---

## ✅ Checklist de Imagen Perfecta

Antes de agregar una imagen, verifica:

- [ ] ¿La imagen es clara y de buena calidad?
- [ ] ¿El tamaño es adecuado (500x500 o 800x800 para productos)?
- [ ] ¿El peso es menor a 500KB?
- [ ] ¿El nombre del archivo es descriptivo?
- [ ] ¿Está en la carpeta correcta (IMG/ o Banner/)?
- [ ] ¿La ruta en el panel es correcta?
- [ ] ¿Se ve el preview correctamente?

---

## 🎉 ¡Listo!

Ahora puedes agregar todas las imágenes que quieras sin pagar nada. Tu sitio web funcionará rápido y profesional.

**Recuerda:**
- Productos → carpeta `IMG/`
- Banners → carpeta `Banner/`
- Usa rutas como: `./IMG/nombre.jpg`
- Optimiza las imágenes para velocidad

**¡Gestiona tus productos fácilmente!** 🚀📸

