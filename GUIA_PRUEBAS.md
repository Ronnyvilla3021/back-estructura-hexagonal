# 🧪 GUÍA DE PRUEBAS - OpenBlind Admin Panel

## 📋 Pre-requisitos
- ✅ Backend corriendo en `http://localhost:8888`
- ✅ MySQL corriendo con base de datos `openblind`
- ✅ Frontend corriendo en `http://localhost:5174`

---

## 🎯 PRUEBA 1: DASHBOARD (Josselyn + David)

**URL:** http://localhost:5174/dashboard

### ¿Qué verificar?

#### A) Métricas muestran datos REALES de la base de datos (NO datos quemados)

**Sección: Usuarios (Angelo Vera - N°4)**
- [ ] Total de Usuarios → Debe mostrar el COUNT real de tabla `usuario`
- [ ] Usuarios Activos → Debe mostrar usuarios con `estado = 'activo'`
- [ ] Nuevos hoy → Debe mostrar usuarios creados hoy
- [ ] Lugares Favoritos → Debe mostrar COUNT de tabla `lugar_favorito`

**Sección: Rutas (Oscar Soria - N°3)**
- [ ] Total de Rutas → Debe mostrar COUNT de tabla `ruta`
- [ ] Rutas de hoy → Debe mostrar rutas creadas hoy
- [ ] Contactos Emergencia → Debe mostrar COUNT de tabla `contacto_emergencia`

**Sección: Notificaciones (Ronny Villa - N°1)**
- [ ] Mensajes Enviados → Debe mostrar COUNT de tabla `mensaje`

**Sección: Incidencias (David - N°5)**
- [ ] Total de Incidencias → Debe mostrar COUNT de tabla `incidencia`
- [ ] Pendientes → Debe mostrar incidencias con `estado = 'pendiente'`

**Sección: Soporte (David - N°5)**
- [ ] Tickets Abiertos → Debe mostrar COUNT de tabla `ticket_soporte`

**Sección: Configuración (Josselyn - N°5)**
- [ ] Configuraciones Activas → Debe mostrar COUNT de tabla `configuracion_global`

#### B) Si hay error de conexión
- [ ] Debe mostrar alert: "No se pudo conectar con el servidor. Verifica que esté corriendo en http://localhost:8888"
- [ ] NO debe mostrar datos quemados/fake

#### C) Validar en consola del navegador
```javascript
// Abrir DevTools (F12) → Console
// NO debe haber datos quemados en el código
// Si hay error, debe decir: "Error cargando métricas:"
```

---

## 🔧 PRUEBA 2: INCIDENCIAS - CRUD COMPLETO (David - N°5)

**URL:** http://localhost:5174/incidencias

### ¿Qué verificar?

#### A) LISTAR (Read)
1. Abrir la página
2. [ ] Debe mostrar tabla con incidencias REALES de la base de datos
3. [ ] Columnas: ID, Título, Descripción, Usuario, Ubicación, Estado, Acciones
4. [ ] Botones de acción: 👁️ Ver Detalles, ✏️ Editar, 🗑️ Eliminar

#### B) VER DETALLES (Ver botón 👁️)
1. Click en botón 👁️ de cualquier incidencia
2. [ ] Debe abrir modal con TODOS los detalles
3. [ ] Modal debe mostrar:
   - Título
   - Descripción completa
   - Usuario reportante
   - Ubicación (latitud, longitud)
   - Estado actual
   - Fecha de creación
4. [ ] Click en X o fuera del modal debe cerrarlo

#### C) CREAR (Create)
1. Click en botón "➕ Nueva Incidencia"
2. [ ] Debe abrir modal con formulario vacío
3. Llenar el formulario:
   - Título: "Prueba de conexión BD"
   - Descripción: "Verificando que se guarda en MySQL real"
   - ID Usuario: 1
   - Latitud: -0.1807
   - Longitud: -78.4678
   - Estado: "pendiente"
4. Click en "Guardar"
5. [ ] Debe mostrar alert: "✅ Incidencia creada correctamente en la base de datos"
6. [ ] Tabla debe recargarse automáticamente
7. [ ] Nueva incidencia debe aparecer en la tabla
8. [ ] Verificar en MySQL que se guardó:
```sql
SELECT * FROM incidencia ORDER BY id DESC LIMIT 1;
```

#### D) ACTUALIZAR (Update)
1. Click en botón ✏️ de la incidencia recién creada
2. [ ] Modal debe abrir con datos pre-cargados
3. Cambiar el estado a "resuelta"
4. Click en "Actualizar"
5. [ ] Debe mostrar alert: "✅ Incidencia actualizada correctamente en la base de datos"
6. [ ] Tabla debe mostrar el nuevo estado
7. [ ] Dashboard debe actualizar el contador de "Pendientes"

#### E) ELIMINAR (Delete)
1. Click en botón 🗑️ de la incidencia de prueba
2. [ ] Debe mostrar confirmación: "¿Seguro que quieres eliminar esta incidencia?"
3. Click en "Aceptar"
4. [ ] Debe mostrar alert: "✅ Incidencia eliminada correctamente de la base de datos"
5. [ ] Incidencia debe desaparecer de la tabla
6. [ ] Verificar en MySQL que se borró

#### F) Verificar que NO hay datos quemados
- [ ] Si el servidor está apagado, debe mostrar error de conexión
- [ ] NO debe mostrar incidencias fake como "Rampa inaccesible" o "Semáforo sin audio"

---

## 🎫 PRUEBA 3: SOPORTE - RUD (David - N°5)

**URL:** http://localhost:5174/soporte

### ¿Qué verificar?

#### A) LISTAR (Read)
1. Abrir la página
2. [ ] Debe mostrar tabla con tickets REALES de la base de datos
3. [ ] Columnas: ID, Asunto, Usuario, Categoría, Prioridad, Estado, Fecha, Acciones
4. [ ] Botones: 👁️ Ver Detalles, ✏️ Editar, 🗑️ Eliminar

#### B) VER DETALLES (Ver botón 👁️)
1. Click en botón 👁️ de cualquier ticket
2. [ ] Debe abrir modal con TODOS los detalles
3. [ ] Modal debe mostrar:
   - Asunto
   - Descripción completa
   - Usuario
   - Categoría
   - Prioridad
   - Estado
   - Fecha de creación
4. [ ] Modal es solo de lectura (no se puede editar desde ahí)

#### C) ACTUALIZAR (Update)
1. Click en botón ✏️ de cualquier ticket
2. [ ] Modal debe abrir con datos pre-cargados
3. Cambiar el estado a "cerrado"
4. Click en "Actualizar"
5. [ ] Debe mostrar alert: "✅ Ticket actualizado correctamente en la base de datos"
6. [ ] Tabla debe mostrar el nuevo estado

#### D) ELIMINAR (Delete)
1. Click en botón 🗑️ de un ticket de prueba
2. [ ] Debe mostrar confirmación
3. Click en "Aceptar"
4. [ ] Debe mostrar alert: "✅ Ticket eliminado correctamente de la base de datos"
5. [ ] Ticket debe desaparecer de la tabla

#### E) Verificar que NO hay datos quemados
- [ ] Si el servidor está apagado, debe mostrar error de conexión
- [ ] NO debe mostrar tickets fake

---

## ⚙️ PRUEBA 4: CONFIGURACIÓN DE ACCESIBILIDAD (Josselyn - N°5)

**URL:** http://localhost:5174/configuracion/accesibilidad

### ¿Qué verificar?

#### A) CARGAR configuración actual desde BD
1. Abrir la página
2. [ ] Debe cargar los valores REALES de la tabla `configuracion_global`
3. [ ] Campos:
   - Alto contraste (toggle ON/OFF)
   - Tamaño de fuente (slider 12-24px)
   - Lector de pantalla (toggle ON/OFF)
   - Daltonismo (select: ninguno/protanopia/deuteranopia/tritanopia)

#### B) GUARDAR cambios
1. Cambiar "Alto contraste" a ON
2. Cambiar "Tamaño de fuente" a 18px
3. Click en botón "💾 Guardar Configuración"
4. [ ] Debe mostrar alert: "✅ Configuración guardada correctamente en la base de datos"
5. [ ] Página debe recargar los datos automáticamente
6. [ ] Verificar en MySQL:
```sql
SELECT * FROM configuracion_global WHERE categoria = 'accesibilidad';
```

#### C) Verificar errores
- [ ] Si cambias algo y el servidor está apagado, debe mostrar: "❌ Error de conexión: No se pudo conectar con el servidor"
- [ ] NO debe mostrar "✅ Guardado" si no se guardó realmente

---

## 🧭 PRUEBA 5: CONFIGURACIÓN DE NAVEGACIÓN (Josselyn - N°5)

**URL:** http://localhost:5174/configuracion/navegacion

### ¿Qué verificar?

#### A) CARGAR configuración
1. Abrir la página
2. [ ] Debe cargar valores REALES de BD
3. [ ] Campos:
   - Instrucciones por voz (toggle)
   - Alertas de proximidad (toggle)
   - Vibración en giros (toggle)
   - Distancia de alerta (slider 10-100m)

#### B) GUARDAR cambios
1. Cambiar "Distancia de alerta" a 50m
2. Cambiar "Vibración en giros" a ON
3. Click en "💾 Guardar Configuración"
4. [ ] Debe mostrar alert de éxito con ✅
5. [ ] Datos deben persistir en MySQL

---

## 🔐 PRUEBA 6: CONFIGURACIÓN DE PRIVACIDAD (Josselyn - N°5)

**URL:** http://localhost:5174/configuracion/privacidad

### ¿Qué verificar?

#### A) CARGAR configuración
1. Abrir la página
2. [ ] Debe cargar valores REALES de BD
3. [ ] Campos:
   - Compartir ubicación (toggle)
   - Historial de rutas (toggle)
   - Datos anónimos (toggle)
   - Duración del historial (select: 7/30/90 días)

#### B) GUARDAR cambios
1. Cambiar "Duración del historial" a 30 días
2. Cambiar "Compartir ubicación" a OFF
3. Click en "💾 Guardar Configuración"
4. [ ] Debe mostrar alert: "✅ Configuración guardada correctamente en la base de datos"
5. [ ] Verificar en MySQL que se guardó

---

## ✅ CHECKLIST FINAL - Verificación General

### 1. NINGÚN dato quemado/fake en toda la aplicación
- [ ] Dashboard NO muestra datos inventados
- [ ] Incidencias NO muestra "Rampa inaccesible" fake
- [ ] Soporte NO muestra tickets fake
- [ ] Configuraciones cargan datos reales de BD

### 2. Alerts SOLO cuando hay éxito real
- [ ] Alerts con ✅ solo aparecen cuando `response.success === true`
- [ ] Si hay error, muestra ❌ con mensaje descriptivo
- [ ] Si servidor está apagado, dice "Error de conexión"

### 3. Todas las operaciones CRUD/RUD funcionan
- [ ] Crear incidencia → se guarda en MySQL
- [ ] Actualizar incidencia → se modifica en MySQL
- [ ] Eliminar incidencia → se borra de MySQL
- [ ] Actualizar ticket → se modifica en MySQL
- [ ] Eliminar ticket → se borra de MySQL
- [ ] Guardar configuraciones → se actualizan en MySQL

### 4. Frontend-Backend-BD conectados
- [ ] Frontend llama APIs en `http://localhost:8888/api/admin/*`
- [ ] Backend responde con datos de MySQL
- [ ] Dashboard muestra métricas actualizadas en tiempo real

### 5. Estructura FSD limpia
- [ ] NO hay carpetas duplicadas
- [ ] NO hay archivos `/pages/` o `/widgets/` viejos
- [ ] Solo existe UN archivo `App.jsx`
- [ ] Rutas están bien organizadas

---

## 🚨 Errores que NO deben aparecer

❌ **"Objects are not valid as a React child"** → Ya está arreglado
❌ **"Cannot find module '../../../domain/models"** → Ya está arreglado
❌ **Datos quemados en catch blocks** → Ya eliminados
❌ **Alerts de "guardado" sin verificar response.success** → Ya corregidos

---

## 📝 Reportar Problemas

Si encuentras algún error, anota:
1. ¿En qué pantalla ocurrió?
2. ¿Qué estabas haciendo?
3. ¿Qué mensaje de error apareció?
4. ¿Hay errores en la consola del navegador (F12)?
5. ¿Hay errores en la consola del backend?

---

**Fecha de última actualización:** 2025-12-28
**Versión del sistema:** 100% conectado a BD real, 0% datos quemados
