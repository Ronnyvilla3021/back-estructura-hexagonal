# 📋 DIVISIÓN DE TRABAJO - OPENBLIND ADMIN PANEL

## 👤 **JOSSELYN MOPOSITA (Estudiante N°5)**

### **Tu Parte - Configuración Global (3 Pantallas):**

#### **1️⃣ Configuración de Accesibilidad** (`/configuracion/accesibilidad`)
**Archivo:** `frontend-admin/src/features/configuracion/screens/ConfigAccesibilidadScreen.jsx`

**Qué hace:**
- Permite configurar valores por defecto de accesibilidad para nuevos usuarios
- Tamaño de fuente (pequeño, mediano, grande, extra grande)
- Tema de contraste (normal, alto contraste)
- Idioma (español, inglés)
- Velocidad de voz (0.5x a 2x)
- Volumen de voz (0-100%)
- Feedback háptico (activado/desactivado)
- Nivel de detalle de instrucciones (básico, intermedio, completo)

**Backend asociado:**
- `src/infrastructure/http/controllers/admin/configuracionGlobal.controller.js`
- `src/domain/models/sql/configuracionGlobal.js`

**API endpoints:**
- `GET /api/admin/configuracion` - Obtener configuración actual
- `PUT /api/admin/configuracion` - Actualizar configuración

---

#### **2️⃣ Configuración de Navegación** (`/configuracion/navegacion`)
**Archivo:** `frontend-admin/src/features/configuracion/screens/ConfigNavegacionScreen.jsx`

**Qué hace:**
- Configura parámetros de navegación por defecto
- Longitud máxima de ruta (1-20 km)
- Tiempo máximo de ruta (15-180 minutos)
- Paradas seguras habilitadas (sí/no)
- Frecuencia de instrucciones (cada 10/30/50 metros)
- Alertas de proximidad (activadas/desactivadas)
- Recalcular automáticamente (sí/no)

**Backend asociado:**
- Mismo controller que Accesibilidad (configuracionGlobal.controller.js)
- Misma tabla de base de datos

---

#### **3️⃣ Configuración de Privacidad y Geolocalización** (`/configuracion/privacidad`)
**Archivo:** `frontend-admin/src/features/configuracion/screens/ConfigPrivacidadScreen.jsx`

**Qué hace:**
- Gestiona políticas de privacidad y ubicación
- Retención de ubicación (1, 7, 30, 90 días, nunca)
- Seguimiento en segundo plano (activado/desactivado)
- Compartir ubicación con contactos (sí/no)
- Enviar datos anónimos (sí/no)
- Permisos de ubicación precisos (sí/no)
- Historial de rutas (activado/desactivado)

**Backend asociado:**
- Mismo controller que las anteriores

---

### **📁 Archivos que son TUYOS:**

**Frontend:**
```
frontend-admin/src/features/configuracion/
├── screens/
│   ├── ConfigAccesibilidadScreen.jsx     ✅ TUYO
│   ├── ConfigNavegacionScreen.jsx        ✅ TUYO
│   ├── ConfigPrivacidadScreen.jsx        ✅ TUYO
│   └── ConfigScreen.css                  ✅ TUYO
└── index.js
```

**Backend:**
```
src/infrastructure/http/controllers/admin/
└── configuracionGlobal.controller.js     ✅ TUYO

src/domain/models/sql/
└── configuracionGlobal.js                ✅ TUYO
```

---

## 👤 **DAVID MALDONADO (Estudiante N°5)**

### **Su Parte - Dashboard + Gestión (3 Módulos):**

#### **1️⃣ Dashboard Admin** (`/dashboard`)
**Archivo:** `frontend-admin/src/features/dashboard/screens/DashboardScreen.jsx`

**Qué hace:**
- **Vista general completa de TODO el sistema OpenBlind Admin**
- Muestra métricas de **TODOS los módulos**, incluidos los de tus compañeros:

**📊 Resumen Principal (4 tarjetas grandes):**
  - 👥 **Usuarios Activos** - Total usuarios activos/registrados
  - 🗺️ **Rutas/Día** - Rutas generadas + completadas
  - ⚠️ **Incidencias** - Pendientes + resueltas (David)
  - 🎫 **Tickets Soporte** - Pendientes + en proceso (David)

**👤 Sección Angelo Vera - Gestión de Usuarios y Lugares:**
  - Total usuarios, nuevos hoy, bloqueados
  - Lugares favoritos guardados
  - Zonas seguras configuradas
  - Puntos críticos marcados

**📍 Sección Oscar Soria - Contactos y Navegación:**
  - Contactos de emergencia registrados
  - Rutas totales y completadas
  - Promedio de rutas por día

**🛠️ Sección David Maldonado - Incidencias y Soporte:**
  - Incidencias pendientes vs resueltas
  - Tickets pendientes vs resueltos
  - Tickets en proceso

**⚙️ Sección Josselyn Moposita - Configuración Global:**
  - Configuraciones activas (3: Accesibilidad, Navegación, Privacidad)
  - Usuarios con configuración personalizada
  - Han modificado valores por defecto

**📇 Sección Ronny Villa - Tarjeta ID y Notificaciones:**
  - Tarjetas ID generadas con QR activo
  - Notificaciones enviadas (push, email, SMS)
  - Plantillas de notificaciones activas

**📈 Uso de Módulos (gráfico de barras):**
  - Navegación, Lugares Favoritos, Contactos
  - Tarjeta ID, Configuración, Soporte
  - Con número de usos por módulo

**Backend asociado:**
- `src/infrastructure/http/controllers/admin/metricas.controller.js`

**API endpoint:**
- `GET /api/admin/metricas/resumen` - Obtener todas las métricas del sistema completo

---

#### **2️⃣ Gestión de Incidencias** (`/incidencias`)
**Archivo:** `frontend-admin/src/features/incidencias/screens/IncidenciasScreen.jsx`

**Qué hace:**
- **CRUD COMPLETO** de incidencias reportadas por usuarios
- **CREATE**: Botón "+ Nueva Incidencia" abre modal para crear
  - Título, descripción, zona, tipo, estado
- **READ**: Tabla con todas las incidencias activas
  - Filtros por estado, tipo, zona
- **UPDATE**: Botón ✏️ edita incidencia existente
  - Cambiar estado, reasignar, actualizar info
- **DELETE**: Botón 🗑️ elimina (soft delete con campo `activo`)

**Campos de incidencia:**
- Título (ej: "Semáforo sin sonido en Av. Amazonas")
- Descripción
- Zona (ej: "Centro Histórico")
- Tipo (accesibilidad, señalización, infraestructura, otro)
- Estado (pendiente, en_revision, resuelta, descartada)
- Fecha de reporte

**Backend asociado:**
- `src/infrastructure/http/controllers/admin/incidencias.controller.js`
- `src/domain/models/sql/admin/incidencia.js`

**API endpoints:**
- `GET /api/admin/incidencias` - Listar todas
- `POST /api/admin/incidencias` - Crear nueva
- `PUT /api/admin/incidencias/:id` - Actualizar
- `DELETE /api/admin/incidencias/:id` - Eliminar (soft delete)

---

#### **3️⃣ Gestión de Soporte** (`/soporte`)
**Archivo:** `frontend-admin/src/features/soporte/screens/SoporteScreen.jsx`

**Qué hace:**
- **RUD** (Read, Update, Delete) de tickets de soporte
- **READ**: Tabla con todos los tickets activos
  - Ordenados por prioridad (alta → media → baja)
- **UPDATE**: Select inline para cambiar estado del ticket
  - Estados: pendiente → en_proceso → resuelto → cerrado
- **DELETE**: Botón 🗑️ archiva ticket (soft delete)

**Campos de ticket:**
- Asunto (ej: "No funciona navegación por voz")
- Usuario (nombre del usuario que lo reportó)
- Estado (pendiente, en_proceso, resuelto, cerrado)
- Prioridad (baja, media, alta)
- Fecha de creación

**Backend asociado:**
- `src/infrastructure/http/controllers/admin/soporte.controller.js`
- `src/domain/models/sql/admin/ticketSoporte.js`

**API endpoints:**
- `GET /api/admin/soporte` - Listar todos
- `PUT /api/admin/soporte/:id` - Actualizar estado
- `DELETE /api/admin/soporte/:id` - Archivar ticket

---

### **📁 Archivos que son de DAVID:**

**Frontend:**
```
frontend-admin/src/features/dashboard/
├── screens/
│   ├── DashboardScreen.jsx               ✅ DAVID
│   └── DashboardScreen.css               ✅ DAVID
└── index.js

frontend-admin/src/features/incidencias/
├── screens/
│   ├── IncidenciasScreen.jsx             ✅ DAVID
│   └── IncidenciasScreen.css             ✅ DAVID
└── index.js

frontend-admin/src/features/soporte/
├── screens/
│   ├── SoporteScreen.jsx                 ✅ DAVID
│   └── SoporteScreen.css                 ✅ DAVID
└── index.js
```

**Backend:**
```
src/infrastructure/http/controllers/admin/
├── metricas.controller.js                ✅ DAVID
├── incidencias.controller.js             ✅ DAVID
└── soporte.controller.js                 ✅ DAVID

src/domain/models/sql/admin/
├── incidencia.js                         ✅ DAVID
└── ticketSoporte.js                      ✅ DAVID
```

---

## 🤝 **COMPARTIDO (Los Dos Colaboraron)**

### **Componentes Compartidos:**
```
frontend-admin/src/shared/components/
├── Card.jsx                              🤝 COMPARTIDO
├── Card.css
├── Button.jsx                            🤝 COMPARTIDO
├── Button.css
├── Badge.jsx                             🤝 COMPARTIDO
├── Badge.css
├── Layout.jsx                            🤝 COMPARTIDO
└── Layout.css
```

### **Configuración Base:**
```
frontend-admin/src/app/
├── App.jsx                               🤝 COMPARTIDO (routing)
└── styles/index.css                      🤝 COMPARTIDO (tema global)

frontend-admin/src/services/
└── api.js                                🤝 COMPARTIDO (cliente HTTP)

vite.config.js                            🤝 COMPARTIDO
package.json                              🤝 COMPARTIDO
```

### **Backend Base:**
```
src/config/
└── database.js                           🤝 COMPARTIDO

src/infrastructure/http/
└── routes.js                             🤝 COMPARTIDO

server.js                                 🤝 COMPARTIDO
```

---

## 🎨 **DISEÑO APLICADO (Ambos se benefician):**

### **Paleta de Colores OpenBlind:**
- 🟣 **Púrpura Primario**: `#9333ea` (botones, enlaces, acentos)
- ⚪ **Fondos Oscuros**: `#0F172A` (fondo principal), `#1E293B` (cards)
- 🟢 **Éxito**: `#4caf50` (estados positivos)
- 🟠 **Advertencia**: `#ff9800` (alertas)
- 🔴 **Error**: `#f44336` (errores, eliminar)

### **Efectos Visuales:**
- ✨ Gradientes púrpura en todos los títulos
- 🎭 Animaciones de entrada (fadeIn)
- 🖱️ Hover effects en tablas (desplazamiento + borde púrpura)
- 💫 Botones con escala + sombra al hover
- 🎯 Focus púrpura brillante en inputs

---

## 📊 **RESUMEN NUMÉRICO:**

### **Josselyn (tú):**
- 3 pantallas de configuración
- 1 backend controller compartido
- 1 modelo de base de datos
- 2 endpoints API (GET, PUT)
- ✅ **Tu sección en el Dashboard** con 2 métricas

### **David:**
- 3 módulos completos (Dashboard, Incidencias, Soporte)
- **Dashboard con secciones de TODOS (5 estudiantes)**
- 3 backend controllers
- 2 modelos de base de datos
- 7 endpoints API total

### **Total Proyecto (tu parte + David):**
- ✅ 6 pantallas funcionales
- ✅ 4 controllers backend
- ✅ 3 modelos de datos
- ✅ 9 endpoints API
- ✅ **Dashboard con 5 secciones** (Angelo, Oscar, David, Josselyn, Ronny)
- ✅ Arquitectura hexagonal
- ✅ Feature-Sliced Design
- ✅ Diseño profesional púrpura OpenBlind

---

## 🚀 **CÓMO EJECUTAR TODO:**

### **1. Descargar cambios:**
```bash
git pull origin claude/age-restricted-accessibility-feature-zXOvx
```

### **2. Instalar dependencias (si no lo hiciste):**
```bash
# Frontend
cd frontend-admin
npm install

# Backend
cd ..
npm install
```

### **3. Iniciar MySQL:**
- Abre XAMPP y enciende MySQL
- O desde CMD: `net start MySQL80`

### **4. Arrancar Backend (Terminal 1):**
```bash
npm run dev
```
Debería mostrar: `✅ Servidor corriendo en http://localhost:8888`

### **5. Arrancar Frontend (Terminal 2):**
```bash
cd frontend-admin
npm run dev
```
Debería mostrar: `➜ Local: http://localhost:5174/`

### **6. Abrir navegador:**
```
http://localhost:5174
```

---

## ✅ **VERIFICACIÓN FUNCIONAL:**

### **Para Josselyn - Probar tus 3 pantallas:**
1. Click en "Accesibilidad" → Cambia tamaño fuente → Guardar
2. Click en "Navegación" → Ajusta longitud máxima → Guardar
3. Click en "Privacidad" → Cambia retención ubicación → Guardar

### **Para David - Probar sus 3 módulos:**
1. **Dashboard** → Ver métricas (deben aparecer números)
2. **Incidencias** → Click "+ Nueva Incidencia" → Llenar form → Guardar
3. **Soporte** → Cambiar estado de un ticket → Eliminar ticket

---

## 📝 **PARA LA EXPOSICIÓN:**

### **Qué debe explicar Josselyn:**
- "Yo hice las 3 pantallas de **Configuración Global**"
- "Accesibilidad, Navegación y Privacidad"
- "Permiten establecer valores por defecto para nuevos usuarios"
- "Uso un solo controller backend que gestiona toda la configuración"

### **Qué debe explicar David:**
- "Yo hice el **Dashboard Admin** que muestra métricas de **TODO el sistema**"
- "El Dashboard tiene secciones para **TODOS los estudiantes**:"
  - "Angelo: Usuarios y Lugares"
  - "Oscar: Contactos y Navegación"
  - "Yo (David): Incidencias y Soporte"
  - "Josselyn: Configuración Global"
  - "Ronny: Tarjeta ID y Notificaciones"
- "Así todos pueden ver el estado completo de OpenBlind en un solo lugar"
- "También hice la **Gestión de Incidencias** con CRUD completo"
- "Y la **Gestión de Soporte** para atender tickets de usuarios"
- "Cada módulo tiene su propio controller y modelo"

### **Qué explicar juntos:**
- "Usamos **arquitectura hexagonal** en el backend"
- "**Feature-Sliced Design** en el frontend"
- "Compartimos componentes como Card, Button, Layout"
- "Paleta de colores **púrpura OpenBlind** coherente"
- "Todo conectado a una sola base de datos MySQL"

---

## 🎯 **CONEXIONES Y FUNCIONALIDADES:**

### **Frontend ↔️ Backend:**
```
[Navegador] → [Vite:5174]
     ↓
[React App] → [services/api.js]
     ↓
[fetch()] → [http://localhost:8888/api/admin/...]
     ↓
[Express Backend] → [Controllers]
     ↓
[Sequelize ORM] → [MySQL Database]
```

### **Flujo de Datos Ejemplo:**

**Cuando Josselyn guarda Configuración de Accesibilidad:**
```
1. User clicks "Guardar Cambios"
2. ConfigAccesibilidadScreen.jsx → handleSave()
3. services/api.js → updateConfiguracionGlobal(config)
4. fetch PUT → http://localhost:8888/api/admin/configuracion
5. configuracionGlobal.controller.js → update()
6. Sequelize → UPDATE configuracion_global SET ...
7. MySQL → Datos guardados
8. Response → alert("Configuración guardada correctamente")
```

**Cuando David crea una Incidencia:**
```
1. User clicks "+ Nueva Incidencia"
2. Modal opens → User fills form → Submit
3. IncidenciasScreen.jsx → handleSubmit()
4. services/api.js → createIncidencia(formData)
5. fetch POST → http://localhost:8888/api/admin/incidencias
6. incidencias.controller.js → create()
7. Sequelize → INSERT INTO incidencias ...
8. MySQL → Nuevo registro creado
9. Response → Tabla se actualiza con nueva incidencia
```

---

## 🔧 **SI ALGO NO FUNCIONA:**

### **Dashboard en blanco:**
```bash
git pull origin claude/age-restricted-accessibility-feature-zXOvx
# Reload navegador con Ctrl + Shift + R
```

### **Errores de conexión API:**
- Verifica que backend corra en puerto 8888
- Verifica que MySQL esté encendido
- Check console del navegador (F12)

### **Errores de imports:**
- Ya están todos arreglados en los últimos commits
- Si persisten, haz `npm install` de nuevo

---

**✅ TODO LISTO - PROYECTO COMPLETO Y FUNCIONAL** 🎉
