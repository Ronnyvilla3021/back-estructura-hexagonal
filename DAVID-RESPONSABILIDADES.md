# 👨‍💻 DAVID MALDONADO - Responsabilidades

**Estudiante:** MALDONADO DELGADO DAVID ALEJANDRO (N°5)
**Módulo:** Dashboard Admin + Gestión de Incidencias + Gestión de Soporte

---

## 📋 TU PARTE DEL PROYECTO

### **1️⃣ Dashboard Admin (MÉTRICAS)**

**Ubicación Frontend:**
```
frontend-admin/src/features/dashboard/screens/
├── DashboardScreen.jsx       ← TU CÓDIGO
└── DashboardScreen.css       ← TU CÓDIGO
```

**Lo que hace:**
- Muestra 4 tarjetas con métricas principales:
  - **Usuarios Activos** - Número total de usuarios activos
  - **Rutas/Día** - Rutas generadas por día
  - **Incidencias** - Reportadas vs Resueltas
  - **Tickets Soporte** - Pendientes
- Gráfico de uso de módulos (guía, tarjeta, contactos)
- Botón de actualizar para refrescar datos

**Endpoints que usa:**
- `GET /api/admin/metricas/resumen` - Obtiene todas las métricas

---

### **2️⃣ Gestión de Incidencias (CRUD COMPLETO)**

**Ubicación Frontend:**
```
frontend-admin/src/features/incidencias/screens/
├── IncidenciasScreen.jsx       ← TU CÓDIGO
└── IncidenciasScreen.css       ← TU CÓDIGO
```

**Lo que hace:**

✅ **CREATE (Crear):**
- Modal para registrar nuevas incidencias detectadas por ONGs/autoridades
- Formulario con: título, descripción, zona, tipo, estado
- Botón "+ Nueva Incidencia"

✅ **READ (Leer):**
- Tabla con todas las incidencias registradas
- Muestra: ID, Título, Zona, Tipo, Estado, Fecha
- Filtros por zona, fecha, tipo
- Badges de colores para estados

✅ **UPDATE (Actualizar):**
- Botón de editar (✏️) en cada fila
- Modal para modificar incidencia existente
- Cambiar estado: Pendiente → En Revisión → Resuelta → Descartada

✅ **DELETE (Eliminar):**
- Botón de eliminar (🗑️) en cada fila
- Borrado lógico (no se elimina de la BD, solo se marca como inactiva)
- Confirmación antes de eliminar

**Campos de una Incidencia:**
- `titulo` - Título de la incidencia
- `descripcion` - Descripción detallada
- `zona` - Zona geográfica (Centro, Norte, Sur, etc.)
- `tipo` - Tipo: accesibilidad, señalización, infraestructura, otro
- `estado` - Estado: pendiente, en_revision, resuelta, descartada
- `fecha` - Fecha de registro

**Endpoints que usa:**
```javascript
GET    /api/admin/incidencias           // Listar todas
GET    /api/admin/incidencias/:id       // Obtener una por ID
POST   /api/admin/incidencias           // Crear nueva
PUT    /api/admin/incidencias/:id       // Actualizar
DELETE /api/admin/incidencias/:id       // Eliminar (soft delete)
```

---

### **3️⃣ Gestión de Soporte (READ, UPDATE, DELETE)**

**Ubicación Frontend:**
```
frontend-admin/src/features/soporte/screens/
└── SoporteScreen.jsx       ← TU CÓDIGO
```

**Lo que hace:**

✅ **READ (Leer):**
- Tabla con todos los tickets de soporte enviados por usuarios
- Muestra: ID, Asunto, Usuario, Prioridad, Estado, Fecha
- Filtros por estado y prioridad
- Badges de colores para prioridad (baja, media, alta)

✅ **UPDATE (Actualizar):**
- Dropdown en cada fila para cambiar estado
- Estados: Pendiente → En Proceso → Resuelto → Cerrado
- Puede agregar respuesta interna y pública
- Actualización instantánea al cambiar

✅ **DELETE (Archivar):**
- Botón de eliminar (🗑️) en cada fila
- Archiva tickets antiguos o irrelevantes
- Borrado lógico (no se elimina, se marca como inactivo)

**Campos de un Ticket:**
- `asunto` - Asunto del ticket
- `descripcion` - Descripción del problema
- `usuario` - Nombre del usuario que reportó
- `estado` - Estado: pendiente, en_proceso, resuelto, cerrado
- `prioridad` - Prioridad: baja, media, alta
- `fecha` - Fecha de creación

**Endpoints que usa:**
```javascript
GET    /api/admin/soporte           // Listar todos
GET    /api/admin/soporte/:id       // Obtener uno por ID
PUT    /api/admin/soporte/:id       // Actualizar (cambiar estado)
DELETE /api/admin/soporte/:id       // Archivar ticket
```

---

## 🎨 COMPONENTES COMPARTIDOS QUE USAS

**Ubicación:**
```
frontend-admin/src/shared/components/
├── Card.jsx       ← Tarjetas con animaciones
├── Button.jsx     ← Botones con estilos
├── Badge.jsx      ← Etiquetas de estado
└── Layout.jsx     ← Sidebar + contenido
```

**Cómo usarlos en tu código:**
```javascript
import { Card, Button, Badge } from '@shared/components';

// Ejemplo de uso:
<Card>
  <table className="data-table">
    {/* Tu tabla aquí */}
  </table>
</Card>

<Button variant="primary" onClick={handleCreate}>
  + Nueva Incidencia
</Button>

<Badge variant="success">Resuelta</Badge>
<Badge variant="warning">Pendiente</Badge>
<Badge variant="danger">Alta Prioridad</Badge>
```

---

## ⚙️ BACKEND - TU PARTE

### **Modelos creados:**

```
src/domain/models/sql/admin/
├── incidencia.js           ← TU MODELO
└── ticketSoporte.js        ← TU MODELO
```

**Modelo Incidencia:**
```javascript
{
  id: INTEGER (auto-increment),
  titulo: STRING(255),
  descripcion: TEXT,
  zona: STRING(100),
  tipo: ENUM('accesibilidad', 'señalización', 'infraestructura', 'otro'),
  estado: ENUM('pendiente', 'en_revision', 'resuelta', 'descartada'),
  fecha: DATE,
  activo: BOOLEAN (para soft delete)
}
```

**Modelo TicketSoporte:**
```javascript
{
  id: INTEGER (auto-increment),
  asunto: STRING(255),
  descripcion: TEXT,
  usuario: STRING(100),
  estado: ENUM('pendiente', 'en_proceso', 'resuelto', 'cerrado'),
  prioridad: ENUM('baja', 'media', 'alta'),
  fecha: DATE,
  activo: BOOLEAN (para soft delete)
}
```

### **Controladores creados:**

```
src/infrastructure/http/controllers/admin/
├── incidencias.controller.js    ← TU CONTROLADOR
├── soporte.controller.js        ← TU CONTROLADOR
└── metricas.controller.js       ← TU CONTROLADOR (Dashboard)
```

**incidencias.controller.js - Métodos:**
- `getAll()` - Listar todas las incidencias activas
- `getById()` - Obtener una incidencia por ID
- `create()` - Crear nueva incidencia
- `update()` - Actualizar incidencia existente
- `delete()` - Borrado lógico (marca activo = false)

**soporte.controller.js - Métodos:**
- `getAll()` - Listar todos los tickets activos
- `getById()` - Obtener un ticket por ID
- `update()` - Actualizar ticket (cambiar estado)
- `delete()` - Archivar ticket (marca activo = false)

**metricas.controller.js - Métodos:**
- `getResumen()` - Dashboard con todas las métricas
- `getUsuarios()` - Métricas de usuarios
- `getRutas()` - Métricas de rutas
- `getIncidencias()` - Métricas de incidencias
- `getUsoModulos()` - Uso de módulos

### **Rutas del backend:**

```javascript
// En admin.router.js

// MÉTRICAS Y DASHBOARD (TU PARTE)
GET /api/admin/metricas/resumen        // Resumen completo
GET /api/admin/metricas/usuarios       // Métricas usuarios
GET /api/admin/metricas/rutas          // Métricas rutas
GET /api/admin/metricas/incidencias    // Métricas incidencias
GET /api/admin/metricas/uso-modulos    // Uso de módulos

// GESTIÓN DE INCIDENCIAS (TU PARTE)
GET    /api/admin/incidencias           // Listar todas
GET    /api/admin/incidencias/:id       // Una por ID
POST   /api/admin/incidencias           // Crear nueva
PUT    /api/admin/incidencias/:id       // Actualizar
DELETE /api/admin/incidencias/:id       // Eliminar

// GESTIÓN DE SOPORTE (TU PARTE)
GET    /api/admin/soporte               // Listar todos
GET    /api/admin/soporte/:id           // Uno por ID
PUT    /api/admin/soporte/:id           // Actualizar
DELETE /api/admin/soporte/:id           // Archivar
```

---

## 📚 QUÉ ESTUDIAR PARA LA EXPOSICIÓN

### **1. Flujo de Datos - Dashboard**

```
Usuario abre el Dashboard
         ↓
DashboardScreen.jsx monta componente
         ↓
useEffect() llama a loadMetrics()
         ↓
Llama a getMetricsResumen() de services/api.js
         ↓
GET /api/admin/metricas/resumen
         ↓
Backend: metricas.controller.js → getResumen()
         ↓
Consulta tablas de BD (incidencias, tickets, etc.)
         ↓
Retorna JSON con todas las métricas
         ↓
Frontend actualiza state y renderiza tarjetas
```

### **2. Flujo de Datos - Crear Incidencia**

```
Usuario hace clic en "+ Nueva Incidencia"
         ↓
Se abre modal con formulario
         ↓
Usuario llena: título, descripción, zona, tipo
         ↓
Hace clic en "Crear Incidencia"
         ↓
handleSubmit() en IncidenciasScreen.jsx
         ↓
Llama a createIncidencia(formData) de services/api.js
         ↓
POST /api/admin/incidencias
         ↓
Backend: incidencias.controller.js → create()
         ↓
Crea registro en tabla 'incidencias' (MySQL)
         ↓
Retorna { success: true, data: nuevaIncidencia }
         ↓
Frontend cierra modal y recarga tabla
```

### **3. Tecnologías que usas**

**Frontend:**
- ✅ React 19 - Librería UI
- ✅ React Hooks (useState, useEffect)
- ✅ Framer Motion - Animaciones
- ✅ Fetch API - Llamadas HTTP

**Backend:**
- ✅ Express.js - Framework web
- ✅ Sequelize - ORM para MySQL
- ✅ Node.js - Runtime
- ✅ MySQL - Base de datos

---

## 🎯 PUNTOS CLAVE PARA EXPONER

### **Tu responsabilidad:**

1. ✅ **Dashboard Admin con Métricas**
   - "Implementé el Dashboard que muestra métricas clave del sistema"
   - "Incluye usuarios activos, rutas por día, incidencias y tickets de soporte"

2. ✅ **Gestión de Incidencias - CRUD Completo**
   - "Desarrollé el módulo de Incidencias con CRUD completo"
   - "Los administradores pueden crear, leer, actualizar y eliminar incidencias detectadas por ONGs o autoridades"

3. ✅ **Gestión de Soporte - Read, Update, Delete**
   - "Creé el módulo de Soporte para gestionar tickets de usuarios"
   - "Los administradores pueden ver tickets, cambiar su estado y archivar los antiguos"

4. ✅ **Backend Completo**
   - "Desarrollé los modelos Sequelize para Incidencia y TicketSoporte"
   - "Implementé los controladores con toda la lógica de negocio"
   - "Configuré las rutas REST en el router admin"

---

## 📂 ARCHIVOS QUE DEBES CONOCER

### **Frontend (LO MÁS IMPORTANTE):**

```
✅ frontend-admin/src/features/dashboard/screens/DashboardScreen.jsx
✅ frontend-admin/src/features/dashboard/screens/DashboardScreen.css
✅ frontend-admin/src/features/incidencias/screens/IncidenciasScreen.jsx
✅ frontend-admin/src/features/incidencias/screens/IncidenciasScreen.css
✅ frontend-admin/src/features/soporte/screens/SoporteScreen.jsx
✅ frontend-admin/src/services/api.js (todas tus funciones de API)
```

### **Backend (LO MÁS IMPORTANTE):**

```
✅ src/domain/models/sql/admin/incidencia.js
✅ src/domain/models/sql/admin/ticketSoporte.js
✅ src/infrastructure/http/controllers/admin/incidencias.controller.js
✅ src/infrastructure/http/controllers/admin/soporte.controller.js
✅ src/infrastructure/http/controllers/admin/metricas.controller.js
✅ src/infrastructure/http/router/admin.router.js (líneas 68-128)
```

---

## 🔗 CÓMO SE INTEGRA CON JOSSELYN

**Josselyn hizo:**
- Configuración Global (3 secciones: Accesibilidad, Navegación, Privacidad)

**Tú hiciste:**
- Dashboard Admin (métricas que incluyen data de Josselyn)
- Gestión de Incidencias (CRUD completo)
- Gestión de Soporte (Read, Update, Delete)

**Juntos:**
- El Dashboard muestra métricas del sistema completo
- Comparten el mismo Layout (sidebar)
- Usan los mismos componentes compartidos (Card, Button, Badge)
- El backend está integrado en el mismo proyecto

---

## ✅ CHECKLIST DE VERIFICACIÓN

Antes de la exposición, verifica que sepas explicar:

- [ ] ¿Qué métricas muestra el Dashboard?
- [ ] ¿Qué es CRUD? (Create, Read, Update, Delete)
- [ ] ¿Cómo se crea una incidencia?
- [ ] ¿Cómo se actualiza un ticket?
- [ ] ¿Qué es borrado lógico?
- [ ] ¿Cuáles son los 4 estados de una incidencia?
- [ ] ¿Cuáles son las 3 prioridades de un ticket?
- [ ] ¿Qué endpoints del backend creaste?

---

**¡ÉXITO EN LA EXPOSICIÓN! 🎓💪**

**Preparado por:** Claude Code
**Para:** MALDONADO DELGADO DAVID ALEJANDRO (N°5)
**Fecha:** 2025-12-27
**Corrección:** Dashboard es TUYO, no de Josselyn
