# 👩‍💻 JOSSELYN MOPOSITA - Responsabilidades

**Estudiante:** MOPOSITA PILATAXI JOSSELYN PAMELA (N°5)
**Módulo:** Configuración Global (3 secciones)

---

## 📋 TU PARTE DEL PROYECTO

### **1️⃣ Configuración Global - Accesibilidad**

**Ubicación Frontend:**
```
frontend-admin/src/features/configuracion/screens/
└── ConfigAccesibilidadScreen.jsx    ← TU CÓDIGO
```

**Lo que hace:**
- Configuración de valores por defecto para nuevos usuarios
- **Apariencia:**
  - Tamaño de fuente (small, medium, large, extra-large)
  - Tema de contraste (normal, alto-contraste)
  - Idioma (español, inglés)
- **Síntesis de Voz:**
  - Velocidad de voz (0.5x - 2.0x)
  - Volumen (0-100%)
  - Nivel de detalle (básico, completo, experto)
  - Feedback háptico (on/off)

**Endpoints que usa:**
- `GET /api/admin/configuracion` - Obtiene configuración actual
- `PUT /api/admin/configuracion` - Guarda cambios

---

### **2️⃣ Configuración Global - Navegación**

**Ubicación Frontend:**
```
frontend-admin/src/features/configuracion/screens/
└── ConfigNavegacionScreen.jsx    ← TU CÓDIGO
```

**Lo que hace:**
- **Preferencias globales de navegación:**
  - Longitud máxima de ruta (1-50 km)
  - Sugerir paradas seguras (sí/no)
- **Instrucciones:**
  - Frecuencia (baja, media, alta)
  - Tipo de instrucción (por distancia, por tiempo)
  - Alertas de desvío (on/off)
  - Alertas de obstáculos (on/off)

**Endpoints que usa:**
- `GET /api/admin/configuracion`
- `PUT /api/admin/configuracion`

---

### **3️⃣ Configuración Global - Geolocalización y Privacidad**

**Ubicación Frontend:**
```
frontend-admin/src/features/configuracion/screens/
└── ConfigPrivacidadScreen.jsx    ← TU CÓDIGO
```

**Lo que hace:**
- **Ubicación y Rastreo:**
  - Política de retención de historial (7, 14, 30, 90 días)
  - Tracking en segundo plano (on/off)
  - Compartir ubicación con contactos (on/off)
- **Historial y Datos:**
  - Guardar historial de rutas (on/off)
  - Permitir modo anónimo (on/off)

**Endpoints que usa:**
- `GET /api/admin/configuracion`
- `PUT /api/admin/configuracion`

---

## 🎨 COMPONENTES COMPARTIDOS QUE USAS

**Ubicación:**
```
frontend-admin/src/shared/components/
├── Card.jsx       ← Tarjetas con animaciones
├── Button.jsx     ← Botones con estilos
└── Layout.jsx     ← Sidebar + contenido
```

**Cómo usarlos en tu código:**
```javascript
import { Card, Button } from '@shared/components';

// Ejemplo de uso:
<Card title="Configuración de Accesibilidad">
  <p>Contenido aquí</p>
</Card>

<Button variant="primary" onClick={handleSave}>
  💾 Guardar Cambios
</Button>
```

---

## ⚙️ BACKEND - TU PARTE

### **Controladores:**

```
src/infrastructure/http/controllers/admin/
└── configuracionGlobal.controller.js    ← TU BACKEND
```

**Métodos que tienes:**
- `get()` - Obtener configuración global
- `update()` - Actualizar configuración completa
- `updateField()` - Actualizar un solo campo
- `reset()` - Resetear a defaults
- `delete()` - Soft delete
- `restore()` - Restaurar

### **Modelo:**

```
src/domain/models/sql/
└── configuracionGlobal.js    ← Modelo de configuración
```

**Campos del modelo (17 campos en total):**

**Accesibilidad:**
- `tamanoFuente`, `temaContraste`, `idioma`
- `velocidadVoz`, `volumenVoz`, `feedbackHaptico`, `nivelDetalle`

**Navegación:**
- `longitudMaxima`, `paradaSegura`, `frecuenciaInstrucciones`
- `tipoInstruccion`, `alertaDesvio`, `alertaObstaculo`

**Privacidad:**
- `retencionUbicacion`, `trackingBackground`, `compartirUbicacion`
- `guardarHistorial`, `permitirAnonimo`

### **Rutas del backend:**

```javascript
// En admin.router.js

// CONFIGURACIÓN GLOBAL (TU PARTE)
GET    /api/admin/configuracion           // Obtener config
PUT    /api/admin/configuracion           // Actualizar config completa
PATCH  /api/admin/configuracion/field     // Actualizar un campo
POST   /api/admin/configuracion/reset     // Resetear a defaults
DELETE /api/admin/configuracion           // Soft delete
POST   /api/admin/configuracion/restore   // Restaurar
```

---

## 📚 QUÉ ESTUDIAR PARA LA EXPOSICIÓN

### **1. Flujo de Datos**

```
Usuario cambia "Tamaño de fuente" a "Large"
         ↓
ConfigAccesibilidadScreen.jsx (frontend)
         ↓
handleSave() actualiza state local
         ↓
Llama a updateConfiguracionGlobal(config)
         ↓
services/api.js hace PUT /api/admin/configuracion
         ↓
Backend recibe en admin.router.js
         ↓
configuracionGlobal.controller.js → update()
         ↓
Actualiza ConfiguracionGlobal en MySQL
         ↓
Retorna { success: true, data: {...} }
         ↓
Frontend muestra "Configuración guardada"
```

### **2. Tecnologías que usas**

**Frontend:**
- ✅ React 19 - Librería UI
- ✅ React Hooks (useState, useEffect)
- ✅ Fetch API - Llamadas HTTP
- ✅ CSS Variables - Tema oscuro

**Backend:**
- ✅ Express.js - Framework web
- ✅ Sequelize - ORM para MySQL
- ✅ Node.js - Runtime

---

## 🎯 PUNTOS CLAVE PARA EXPONER

### **Tu responsabilidad:**

1. ✅ **3 Pantallas de Configuración Global**
   - "Implementé las 3 secciones de configuración: Accesibilidad, Navegación y Privacidad"
   - "Estos valores son los que heredan los nuevos usuarios al registrarse"

2. ✅ **Configuración de Accesibilidad**
   - "Permite configurar el tamaño de fuente, tema de contraste, idioma y parámetros de voz"
   - "También incluye feedback háptico y nivel de detalle de las instrucciones"

3. ✅ **Configuración de Navegación**
   - "Controla la longitud máxima de rutas, paradas seguras y frecuencia de instrucciones"
   - "Los usuarios nuevos heredan estos valores por defecto"

4. ✅ **Configuración de Privacidad**
   - "Gestiona la política de retención de ubicaciones y permisos de tracking"
   - "Incluye control de historial y modo anónimo"

---

## 📂 ARCHIVOS QUE DEBES CONOCER

### **Frontend (LO MÁS IMPORTANTE):**

```
✅ frontend-admin/src/features/configuracion/screens/ConfigAccesibilidadScreen.jsx
✅ frontend-admin/src/features/configuracion/screens/ConfigNavegacionScreen.jsx
✅ frontend-admin/src/features/configuracion/screens/ConfigPrivacidadScreen.jsx
✅ frontend-admin/src/features/configuracion/screens/ConfigScreen.css (estilos compartidos)
✅ frontend-admin/src/services/api.js (funciones: getConfiguracionGlobal, updateConfiguracionGlobal)
```

### **Backend (COMPLEMENTARIO):**

```
✅ src/infrastructure/http/controllers/admin/configuracionGlobal.controller.js
✅ src/domain/models/sql/configuracionGlobal.js
✅ src/infrastructure/http/router/admin.router.js (líneas 22-67)
```

---

## 🔗 CÓMO SE INTEGRA CON DAVID

**David hizo:**
- Dashboard Admin (métricas)
- Gestión de Incidencias (CRUD completo)
- Gestión de Soporte (Read, Update, Delete)

**Tú hiciste:**
- Configuración Global (3 secciones)

**Juntos:**
- Comparten el mismo Layout (sidebar)
- Usan los mismos componentes compartidos (Card, Button)
- El backend está integrado en el mismo proyecto

---

## ✅ CHECKLIST DE VERIFICACIÓN

Antes de la exposición, verifica que sepas explicar:

- [ ] ¿Qué configuraciones hay en Accesibilidad?
- [ ] ¿Qué configuraciones hay en Navegación?
- [ ] ¿Qué configuraciones hay en Privacidad?
- [ ] ¿Para qué sirve la configuración global?
- [ ] ¿Cómo se conecta el frontend con el backend? (services/api.js)
- [ ] ¿Qué endpoints del backend usas?
- [ ] ¿Qué pasa cuando guardas cambios?

---

**¡ÉXITO EN LA EXPOSICIÓN! 🎓💪**

**Preparado por:** Claude Code
**Para:** MOPOSITA PILATAXI JOSSELYN PAMELA (N°5)
**Fecha:** 2025-12-27
**Corrección:** Dashboard es de DAVID, no tuyo
