# 🏷️ Guía de Categorías Personalizadas

## 🎯 Sistema de Categorías Flexible

Ahora puedes **crear tus propias categorías** en lugar de estar limitado a las predefinidas. El sistema es inteligente y te permite:

1. **Crear categorías nuevas** cuando agregas productos
2. **Reutilizar categorías existentes** de otros productos
3. **Total libertad** para organizar tu catálogo

---

## ✨ Cómo Funciona

### Al Agregar un Producto:

Verás **DOS opciones** para elegir la categoría:

```
┌─────────────────────────────────────────────────────┐
│ Categoría *                                         │
│ ┌────────────────────┐  o  ┌────────────────────┐ │
│ │ [Select existente] │     │ [Nueva categoría]  │ │
│ └────────────────────┘     └────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

**Opción 1: Seleccionar categoría existente**
- Despliega el select
- Verás todas las categorías que ya usaste
- Selecciona una

**Opción 2: Crear categoría nueva**
- Escribe el nombre en el campo "Nueva categoría"
- Ejemplo: `cerveza`, `whisky`, `ron`, `vodka`, etc.
- Se creará automáticamente

---

## 📝 Ejemplos Prácticos

### Ejemplo 1: Crear tu Primera Categoría

**Escenario:** No tienes productos todavía

1. Abre `admin.html` → Login
2. **Agregar Producto**
3. El select estará vacío (no hay categorías)
4. En **"Nueva categoría"** escribe: `gin`
5. Completa el resto del formulario
6. Guardar

✅ **Resultado:** Categoría "Gin" creada

---

### Ejemplo 2: Usar Categoría Existente

**Escenario:** Ya tienes productos de Gin

1. **Agregar Producto**
2. El select mostrará: `[-- Seleccionar --] [Gin]`
3. Selecciona **"Gin"** del select
4. Completa el resto del formulario
5. Guardar

✅ **Resultado:** Producto agregado a la categoría existente

---

### Ejemplo 3: Agregar Nueva Categoría

**Escenario:** Tienes Gin y quieres agregar Whisky

1. **Agregar Producto**
2. El select muestra: `[Gin]`
3. **No** selecciones nada del select
4. En **"Nueva categoría"** escribe: `whisky`
5. Guardar

✅ **Resultado:** Nueva categoría "Whisky" creada

---

### Ejemplo 4: Mezclar Categorías

Tu catálogo puede tener cualquier combinación:

```
Categorías posibles:
- gin
- vino
- whisky
- vodka
- cerveza
- ron
- tequila
- champagne
- aperitivos
- licores
- cocteles
... ¡lo que necesites!
```

---

## 🔄 Sistema Inteligente

### Auto-limpieza:
- Si escribes en "Nueva categoría", el select se limpia automáticamente
- Si seleccionas del select, el campo "Nueva categoría" se limpia automáticamente
- **No puedes usar ambos a la vez**

### Case-insensitive (no importan mayúsculas):
```
"Gin" = "gin" = "GIN" = "gIn"
Todos se guardan como: "gin"
```

### Se muestran capitalizadas:
- Escribes: `whisky`
- Se guarda: `whisky`
- Se muestra: `Whisky`

---

## 🎨 Filtros Dinámicos

Los filtros en `index.html` se actualizan automáticamente:

**Si tienes:**
- 5 productos de Gin
- 3 productos de Whisky
- 2 productos de Vodka

**Los filtros mostrarán:**
```
[Todos] [Gin] [Whisky] [Vodka]
```

---

## 💡 Mejores Prácticas

### ✅ Recomendaciones:

1. **Usa nombres cortos y descriptivos**
   - ✅ Bueno: `gin`, `whisky`, `vodka`
   - ❌ Malo: `bebidas alcohólicas destiladas`

2. **Sé consistente con los nombres**
   - ✅ Bueno: Siempre usa `vino` (no mezcles `vino` con `vinos`)
   - ❌ Malo: `Vino tinto`, `vinos`, `VINO`

3. **Usa minúsculas**
   - El sistema las convierte automáticamente
   - Más fácil de escribir y mantener

4. **Organiza lógicamente**
   - Agrupa productos similares
   - Piensa en cómo los clientes buscarían

### ❌ Evita:

- Categorías demasiado específicas: `gin-belladonna-750ml`
- Espacios extras: ` gin ` (mejor: `gin`)
- Caracteres especiales: `gin&tonic`
- Números innecesarios: `gin1`, `gin2`

---

## 🔧 Gestión de Categorías

### Ver Todas las Categorías:

1. Abre el panel admin
2. Ve a **"Productos"**
3. Mira la columna **"Categoría"**
4. O usa el filtro desplegable

### Cambiar Categoría de un Producto:

1. Edita el producto
2. Selecciona nueva categoría del select
3. O escribe una nueva
4. Guardar

### "Eliminar" una Categoría:

No hay que eliminar categorías manualmente. Si eliminas o cambias todos los productos de una categoría, automáticamente:
- Desaparece de los filtros
- No aparece en el select de nuevos productos

---

## 📊 Ejemplos de Catálogos

### Catálogo Básico (3 categorías):
```
- gin (10 productos)
- vino (15 productos)
- licor (8 productos)
```

### Catálogo Amplio (7 categorías):
```
- gin (10 productos)
- whisky (12 productos)
- vodka (8 productos)
- ron (6 productos)
- vino (20 productos)
- cerveza (15 productos)
- champagne (5 productos)
```

### Catálogo Especializado:
```
- gin-artesanal (8 productos)
- gin-premium (5 productos)
- whisky-escoces (10 productos)
- whisky-irlandes (4 productos)
- vino-malbec (12 productos)
- vino-cabernet (8 productos)
```

---

## ❓ Preguntas Frecuentes

### ¿Puedo tener productos sin categoría?
No, la categoría es obligatoria.

### ¿Puedo cambiar el nombre de una categoría?
No directamente, pero puedes:
1. Editar cada producto de esa categoría
2. Cambiarlos a la nueva categoría
3. La vieja desaparecerá sola

### ¿Hay límite de categorías?
No, puedes crear todas las que necesites.

### ¿Se pueden ordenar alfabéticamente?
Sí, el select las muestra ordenadas automáticamente.

### ¿Puedo usar tildes o ñ?
Sí, pero es mejor evitarlas para URLs limpias:
- ✅ Mejor: `champagne`
- 🤔 Funciona: `champán`

---

## 🚀 Flujo de Trabajo Recomendado

### Al Empezar:

1. **Define tus categorías principales** (mental o en papel)
   - Ejemplo: Gin, Whisky, Vodka, Ron, Vino

2. **Crea tu primer producto de cada categoría**
   - Esto establece las categorías base

3. **Agrega más productos usando el select**
   - Reutiliza las categorías ya creadas

4. **Si necesitas nueva categoría**
   - Úsala al agregar un producto

---

## ✨ Resumen

| Característica | Resultado |
|----------------|-----------|
| **Flexibilidad** | Crea cualquier categoría ✅ |
| **Reutilizable** | Select de categorías existentes ✅ |
| **Dinámico** | Filtros se actualizan solos ✅ |
| **Inteligente** | Auto-limpieza de campos ✅ |
| **Profesional** | Nombres capitalizados automáticamente ✅ |

---

**¡Organiza tu catálogo como quieras!** 🎉🏷️

