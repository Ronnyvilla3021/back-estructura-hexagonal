# 🪐 OpenBlind - Aplicación de Accesibilidad con Comandos de Voz

## 📋 Índice

1. [Descripción del Proyecto](#descripción-del-proyecto)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
3. [¿Por qué React?](#por-qué-react)
4. [Arquitectura Hexagonal](#arquitectura-hexagonal)
5. [Estructura del Proyecto](#estructura-del-proyecto)
6. [Funcionalidad de Cada Módulo](#funcionalidad-de-cada-módulo)
7. [Conexión Frontend-Backend](#conexión-frontend-backend)
8. [CRUDs Implementados](#cruds-implementados)
9. [Base de Datos](#base-de-datos)
10. [Guía de Instalación](#guía-de-instalación)
11. [Generar APK Android](#generar-apk-android)

---

## 📱 Descripción del Proyecto

**OpenBlind** es una aplicación móvil de accesibilidad diseñada para personas con discapacidad visual. Permite gestionar lugares favoritos y contactos de emergencia mediante **comandos de voz automáticos** y controles táctiles.

### Características Principales:
- ✅ **Comandos de voz automáticos** - Se activa al abrir la app
- ✅ **CRUD de Lugares Favoritos** - Guardar y navegar a sitios importantes
- ✅ **CRUD de Contactos de Emergencia** - Llamadas rápidas con un toque
- ✅ **Geolocalización GPS** - Detecta automáticamente la ubicación actual
- ✅ **Navegación Google Maps** - Integración nativa con mapas
- ✅ **Síntesis de Voz** - Retroalimentación hablada en español
- ✅ **Interfaz Oscura** - Optimizada para bajo consumo visual

---

## 🛠️ Tecnologías Utilizadas

### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 19.0.0 | Interfaz de usuario reactiva |
| **Vite** | 7.2.5 | Build tool ultrarrápido |
| **Capacitor** | 8.0.0 | Compilación a APK nativo |
| **Framer Motion** | 11.18.0 | Animaciones fluidas |
| **Web Speech API** | Nativa | Reconocimiento y síntesis de voz |

### Backend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Node.js** | 20+ | Runtime de JavaScript |
| **Express** | 4.21.2 | Framework web minimalista |
| **MySQL** | 8.0+ | Base de datos relacional |
| **Sequelize** | 6.37.5 | ORM para MySQL |
| **CORS** | 2.8.5 | Cross-Origin Resource Sharing |

### Android
| Herramienta | Versión | Propósito |
|-------------|---------|-----------|
| **Gradle** | 8.14.3 | Build system de Android |
| **Android SDK** | 34 | API Level para Android 14 |
| **Java** | 17 LTS | Compilación de APK |

---

## 🤔 ¿Por qué React?

Se eligió **React** por las siguientes razones:

### 1. **Componentes Reutilizables**
```jsx
// Componente Modal reutilizado en Lugares y Contactos
<Modal isOpen={isEditOpen} title="Editar Lugar">
  <FormContent />
</Modal>
```

### 2. **Virtual DOM = Rendimiento**
React actualiza solo las partes que cambian, ideal para listas dinámicas:
```jsx
{lugares.map(lugar => <LugarCard key={lugar.id} {...lugar} />)}
```

### 3. **Hooks Personalizados**
```jsx
// Hook para comandos de voz reutilizable
const { isListening, speak } = useVoiceCommands(handleCommand, autoStart: true);
```

### 4. **Ecosistema Rico**
- **Framer Motion** para animaciones
- **Capacitor** para APK nativo
- **Vite** para desarrollo rápido

### 5. **Declarativo y Fácil de Mantener**
```jsx
// Código declarativo y legible
{loading ? <LoadingSpinner /> : <DataList />}
```

---

## 🏗️ Arquitectura Hexagonal

El proyecto usa **Arquitectura Hexagonal** (también llamada Ports & Adapters) para separar la lógica de negocio de la infraestructura.

### Backend - Estructura Hexagonal

```
src/
├── domain/              # ⭐ CAPA DE DOMINIO (Lógica de negocio)
│   └── models/
│       └── sql/
│           ├── lugarFavorito.js       # Modelo de datos
│           └── contactoEmergencia.js   # Modelo de datos
│
├── infrastructure/      # 🔌 CAPA DE INFRAESTRUCTURA
│   ├── database/
│   │   └── connection/
│   │       └── dataBase.sql.js        # Conexión MySQL
│   │
│   └── http/
│       ├── controllers/               # Controladores
│       │   ├── lugarFavorito.controller.js
│       │   └── contactoEmergencia.controller.js
│       │
│       ├── router/                    # Rutas HTTP
│       │   ├── lugarFavorito.router.js
│       │   └── contactoEmergencia.router.js
│       │
│       └── middlewares/               # Middlewares
│           └── apiResponse.js         # Formato de respuestas
│
└── config/              # ⚙️ CONFIGURACIÓN
    └── keys.js          # Variables de entorno
```

### Frontend - Estructura Hexagonal Adaptada

```
src/
├── presentation/        # 🎨 CAPA DE PRESENTACIÓN
│   ├── components/      # Componentes UI
│   │   ├── Header.jsx
│   │   ├── Modal.jsx
│   │   └── ListItem.jsx
│   │
│   └── styles/          # Estilos CSS
│       └── index.css
│
├── application/         # 📱 CAPA DE APLICACIÓN
│   └── hooks/           # Lógica reutilizable
│       └── useVoiceCommands.js
│
├── infrastructure/      # 🔌 CAPA DE INFRAESTRUCTURA
│   └── api/             # Servicios HTTP
│       └── fetch.js     # (Podría estar aquí)
│
└── App.jsx              # Orquestador principal
```

---

## 📂 Estructura del Proyecto

```
estructura-hexagonal/
│
├── frontend-openblind/          # 📱 APLICACIÓN MÓVIL
│   ├── src/
│   │   ├── App.jsx              # Componente principal
│   │   ├── main.jsx             # Entry point
│   │   ├── index.css            # Estilos globales
│   │   │
│   │   ├── components/          # Componentes reutilizables
│   │   │   ├── Header.jsx       # Navbar con botón atrás
│   │   │   ├── Modal.jsx        # Modal para edición
│   │   │   ├── ListItem.jsx     # Tarjeta de lugar/contacto
│   │   │   └── UbicacionView.jsx # Vista de ubicación actual
│   │   │
│   │   └── hooks/
│   │       └── useVoiceCommands.js  # Hook de voz automático
│   │
│   ├── android/                 # Proyecto Android nativo
│   │   ├── app/
│   │   │   ├── build/
│   │   │   │   └── outputs/apk/debug/
│   │   │   │       └── app-debug.apk  # ⭐ APK FINAL
│   │   │   └── src/main/
│   │   │       └── AndroidManifest.xml # Permisos
│   │   └── gradle/              # Build system
│   │
│   ├── capacitor.config.ts      # Config de Capacitor
│   ├── package.json             # Dependencias frontend
│   └── vite.config.js           # Config de Vite
│
├── src/                         # 🖥️ BACKEND API
│   ├── config/
│   │   └── keys.js              # MySQL credentials
│   │
│   ├── domain/models/sql/
│   │   ├── lugarFavorito.js     # Modelo Sequelize
│   │   └── contactoEmergencia.js
│   │
│   └── infrastructure/
│       ├── database/connection/
│       │   └── dataBase.sql.js  # Pool MySQL
│       │
│       └── http/
│           ├── controllers/
│           │   ├── lugarFavorito.controller.js
│           │   └── contactoEmergencia.controller.js
│           │
│           ├── router/
│           │   ├── lugarFavorito.router.js
│           │   └── contactoEmergencia.router.js
│           │
│           └── middlewares/
│               └── apiResponse.js
│
├── app.js                       # Servidor Express
├── index.js                     # Entry point backend
└── package.json                 # Dependencias backend
```

---

## ⚙️ Funcionalidad de Cada Módulo

### 1. **Módulo: Lugares Favoritos** 📍

#### Funcionalidad:
- Guardar lugares importantes (casa, trabajo, hospital, etc.)
- Detectar ubicación GPS automáticamente
- Navegar a un lugar usando Google Maps
- Editar o eliminar lugares guardados

#### Comandos de Voz:
- **"Abre lugares favoritos"** → Abre la vista
- **"Agrega la ubicación donde estoy, nombre casa"** → Detecta GPS y abre formulario
- **"Guárdala"** → Guarda el lugar en la base de datos

#### Código Clave:
```jsx
// frontend-openblind/src/App.jsx:269-287
const loadLugares = async () => {
  const response = await fetch(`${API_URL}/lugares-favoritos`);
  const data = await response.json();
  if (data.success && data.data) {
    setLugares(data.data);
  }
};
```

---

### 2. **Módulo: Contactos de Emergencia** 📞

#### Funcionalidad:
- Guardar contactos de emergencia (familia, médicos, etc.)
- Llamar con un solo toque
- Ordenar por prioridad
- Editar o eliminar contactos

#### Comandos de Voz:
- **"Abre contactos"** → Abre la vista
- **"Agrega a mi mamá, nombre Silvia, teléfono 099326"** → Abre formulario pre-llenado
- **"Guárdalo"** → Guarda el contacto

#### Código Clave:
```jsx
// frontend-openblind/src/App.jsx:548-550
const handleCall = (phone) => {
  window.location.href = `tel:${phone}`;
};
```

---

### 3. **Módulo: Mi Ubicación** 🌍

#### Funcionalidad:
- Muestra la ubicación GPS actual
- Convierte coordenadas a dirección (reverse geocoding)
- Permite guardarla como lugar favorito

#### API Utilizada:
```javascript
// Geolocation API nativa del navegador
navigator.geolocation.getCurrentPosition(
  (position) => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
  }
);
```

---

### 4. **Módulo: Comandos de Voz** 🎤

#### Funcionalidad:
- **Inicio automático** al abrir la app
- Escucha continua (no requiere presionar botón)
- Síntesis de voz en español
- Retroalimentación auditiva de cada acción

#### Código Clave:
```javascript
// frontend-openblind/src/hooks/useVoiceCommands.js:92-102
if (autoStart) {
  setTimeout(() => {
    recognition.start();
    setIsListening(true);
    speak('Bienvenido a OpenBlind. Los comandos de voz están activos.');
  }, 1000);
}
```

---

## 🔗 Conexión Frontend-Backend

### Flujo de Comunicación

```
┌─────────────────┐         HTTP Request          ┌─────────────────┐
│   FRONTEND      │ ─────────────────────────────> │    BACKEND      │
│   (React)       │                                 │   (Express)     │
│                 │ <────────────────────────────── │                 │
│ App.jsx         │         JSON Response          │ Controllers     │
└─────────────────┘                                 └─────────────────┘
        │                                                    │
        │                                                    │
        v                                                    v
┌─────────────────┐                                 ┌─────────────────┐
│  Capacitor APK  │                                 │  MySQL Database │
│  (Android)      │                                 │  (openblind)    │
└─────────────────┘                                 └─────────────────┘
```

### Ejemplo Completo: Crear Lugar Favorito

#### 1. **Vista (Frontend)**
```jsx
// frontend-openblind/src/App.jsx:320-328
const response = await fetch(`${API_URL}/lugares-favoritos`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nombre: currentItem.title,
    direccion: currentItem.subtitle,
    icono: currentItem.icon
  }),
});
```

#### 2. **Ruta (Backend)**
```javascript
// src/infrastructure/http/router/lugarFavorito.router.js:22
router.post('/', createLugar);
```

#### 3. **Controlador (Backend)**
```javascript
// src/infrastructure/http/controllers/lugarFavorito.controller.js:191-224
lugarFavoritoCtl.createLugar = async (req, res) => {
  const { nombre, direccion, icono } = req.body;
  const ID_CLIENTE = 1;

  // Asegurar que el cliente existe
  await asegurarClienteExiste(ID_CLIENTE);

  // Insertar en base de datos
  const [result] = await sql.promise().query(
    `INSERT INTO lugares_favoritos (idCliente, nombreLugar, direccion, icono, ...)
     VALUES (?, ?, ?, ?, ...)`,
    [ID_CLIENTE, nombre, direccion, icono]
  );

  // Responder con formato estándar
  return res.apiResponse(nuevoLugar, 201, 'Lugar favorito creado');
};
```

#### 4. **Base de Datos**
```sql
INSERT INTO lugares_favoritos
VALUES (1, 'Casa', 'Av. Amazonas 123', 'home', -0.283055, -78.484526, NOW(), NOW());
```

#### 5. **Respuesta al Frontend**
```json
{
  "success": true,
  "message": "Lugar favorito creado",
  "data": {
    "id_lugar": 17,
    "nombre": "Casa",
    "direccion": "Av. Amazonas 123",
    "icono": "home"
  }
}
```

---

## 🗄️ CRUDs Implementados

### CRUD de Lugares Favoritos

#### **CREATE** (Crear)
```javascript
// Endpoint: POST /lugares-favoritos
// Controlador: src/infrastructure/http/controllers/lugarFavorito.controller.js:191
// Línea que consume el modelo:
await sql.promise().query(
  `INSERT INTO lugares_favoritos (idCliente, nombreLugar, ...) VALUES (?, ?, ...)`,
  [ID_CLIENTE, nombre, direccion, icono]
);
```

#### **READ** (Leer)
```javascript
// Endpoint: GET /lugares-favoritos
// Controlador: src/infrastructure/http/controllers/lugarFavorito.controller.js:173
// Línea que extrae de la BD:
const [lugares] = await sql.promise().query(
  'SELECT idLugarFavorito as id_lugar, nombreLugar as nombre, ... FROM lugares_favoritos WHERE idCliente = ?',
  [ID_CLIENTE]
);
```

#### **UPDATE** (Actualizar)
```javascript
// Endpoint: PUT /lugares-favoritos/:id
// Controlador: src/infrastructure/http/controllers/lugarFavorito.controller.js:227
// Línea que actualiza:
const [result] = await sql.promise().query(
  `UPDATE lugares_favoritos SET nombreLugar = ?, direccion = ?, ... WHERE idLugarFavorito = ?`,
  [nombre, direccion, icono, id]
);
```

#### **DELETE** (Eliminar)
```javascript
// Endpoint: DELETE /lugares-favoritos/:id
// Controlador: src/infrastructure/http/controllers/lugarFavorito.controller.js:269
// Línea que elimina:
const [result] = await sql.promise().query(
  'DELETE FROM lugares_favoritos WHERE idLugarFavorito = ?',
  [id]
);
```

---

### CRUD de Contactos de Emergencia

#### **CREATE** (Crear)
```javascript
// Endpoint: POST /contactos
// Controlador: src/infrastructure/http/controllers/contactoEmergencia.controller.js:189
await sql.promise().query(
  `INSERT INTO contactos_emergencia (idCliente, nombreContacto, telefono, ...) VALUES (?, ?, ?, ...)`,
  [ID_CLIENTE, nombre, telefono, relacion, prioridad]
);
```

#### **READ** (Leer)
```javascript
// Endpoint: GET /contactos
// Controlador: src/infrastructure/http/controllers/contactoEmergencia.controller.js:172
const [contactos] = await sql.promise().query(
  'SELECT idContactoEmergencia as id_contacto, nombreContacto as nombre, ... FROM contactos_emergencia WHERE idCliente = ?',
  [ID_CLIENTE]
);
```

#### **UPDATE** (Actualizar)
```javascript
// Endpoint: PUT /contactos/:id
// Controlador: src/infrastructure/http/controllers/contactoEmergencia.controller.js:224
const [result] = await sql.promise().query(
  `UPDATE contactos_emergencia SET nombreContacto = ?, telefono = ?, ... WHERE idContactoEmergencia = ?`,
  [nombre, telefono, relacion, prioridad, id]
);
```

#### **DELETE** (Eliminar)
```javascript
// Endpoint: DELETE /contactos/:id
// Controlador: src/infrastructure/http/controllers/contactoEmergencia.controller.js:264
const [result] = await sql.promise().query(
  'DELETE FROM contactos_emergencia WHERE idContactoEmergencia = ?',
  [id]
);
```

---

## 💾 Base de Datos

### Esquema MySQL

```sql
-- Base de datos: openblind
CREATE DATABASE IF NOT EXISTS openblind;
USE openblind;

-- Tabla: clientes
CREATE TABLE clientes (
  idClientes INT AUTO_INCREMENT PRIMARY KEY,
  createCliente TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updateCliente TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla: lugares_favoritos
CREATE TABLE lugares_favoritos (
  idLugarFavorito INT AUTO_INCREMENT PRIMARY KEY,
  idCliente INT NOT NULL,
  nombreLugar VARCHAR(100) NOT NULL,
  direccion VARCHAR(255) NOT NULL,
  latitud DECIMAL(10, 8),
  longitud DECIMAL(11, 8),
  icono VARCHAR(50) DEFAULT 'place',
  createLugarFavorito TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updateLugarFavorito TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (idCliente) REFERENCES clientes(idClientes) ON DELETE CASCADE
);

-- Tabla: contactos_emergencia
CREATE TABLE contactos_emergencia (
  idContactoEmergencia INT AUTO_INCREMENT PRIMARY KEY,
  idCliente INT NOT NULL,
  nombreContacto VARCHAR(100) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  relacion VARCHAR(50),
  prioridad INT DEFAULT 1,
  createContactoEmergencia TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updateContactoEmergencia TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (idCliente) REFERENCES clientes(idClientes) ON DELETE CASCADE
);
```

### Conexión a la Base de Datos

```javascript
// src/infrastructure/database/connection/dataBase.sql.js
const mysql = require('mysql2');
const { MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE, MYSQLPORT } = require('../../../config/keys');

const pool = mysql.createPool({
  host: MYSQLHOST,
  user: MYSQLUSER,
  password: MYSQLPASSWORD,
  database: MYSQLDATABASE,
  port: MYSQLPORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
```

### Extracción de Información

#### Ejemplo: Obtener Lugares Favoritos
```javascript
// src/infrastructure/http/controllers/lugarFavorito.controller.js:178-180
const [lugares] = await sql.promise().query(
  'SELECT idLugarFavorito as id_lugar, nombreLugar as nombre, direccion, latitud, longitud, icono
   FROM lugares_favoritos WHERE idCliente = ? ORDER BY createLugarFavorito DESC',
  [ID_CLIENTE]
);
```

**Línea que representa la vista por parte de los controladores:**
- `lugarFavorito.controller.js:183` → `return res.apiResponse(lugares);`

**Donde está el consumo de los modelos en el controlador:**
- `lugarFavorito.controller.js:178` → `await sql.promise().query(...)`
- No usa ORM Sequelize directamente, usa **raw SQL queries** con el pool de MySQL

---

## 📥 Guía de Instalación

### Prerrequisitos

- **Node.js** 20+ ([Descargar](https://nodejs.org/))
- **MySQL** 8.0+ ([Descargar](https://dev.mysql.com/downloads/))
- **Java JDK** 17 LTS ([Descargar](https://adoptium.net/))
- **Android Studio** ([Descargar](https://developer.android.com/studio))

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Padme2003/estructura-hexagonal.git
cd estructura-hexagonal
```

### 2. Instalar Dependencias

#### Backend
```bash
npm install
```

#### Frontend
```bash
cd frontend-openblind
npm install
cd ..
```

### 3. Configurar Base de Datos

#### Crear Base de Datos
```sql
CREATE DATABASE openblind;
USE openblind;

-- Ejecutar schema.sql (si existe)
source database/schema.sql;
```

#### Configurar Credenciales
```javascript
// src/config/keys.js
module.exports = {
  MYSQLHOST: 'localhost',
  MYSQLUSER: 'root',      // Tu usuario MySQL
  MYSQLPASSWORD: 'tu_password',  // Tu contraseña
  MYSQLDATABASE: 'openblind',
  MYSQLPORT: 3306
};
```

### 4. Configurar IP del Frontend

#### Obtener tu IP local
```bash
# Windows
ipconfig

# Linux/Mac
ifconfig
```

#### Editar App.jsx
```javascript
// frontend-openblind/src/App.jsx:7
const API_URL = 'http://TU_IP_LOCAL:8888';  // Ejemplo: http://192.168.1.100:8888
```

### 5. Iniciar Backend

```bash
npm start
```

Deberías ver:
```
Servidor corriendo en puerto 8888
Conectado a MySQL: openblind
```

### 6. Probar Frontend en Navegador

```bash
cd frontend-openblind
npm run dev
```

Abre: `http://localhost:5173`

---

## 📦 Generar APK Android

### 1. Compilar Frontend

```bash
cd frontend-openblind
npm run build
```

### 2. Sincronizar con Android

```bash
npx cap sync android
```

### 3. Compilar APK

#### Opción A: Android Studio (Recomendado)
```bash
npx cap open android
```
- Espera que cargue el proyecto
- **Build > Build Bundle(s) / APK(s) > Build APK(s)**
- APK en: `android/app/build/outputs/apk/debug/app-debug.apk`

#### Opción B: Línea de Comandos
```bash
cd android
./gradlew assembleDebug
```

### 4. Instalar APK en Celular

#### Por USB
```bash
adb install app/build/outputs/apk/debug/app-debug.apk
```

#### Por transferencia de archivos
1. Copia `app-debug.apk` a tu celular
2. Abre el archivo y permite instalar desde fuentes desconocidas

---

## 🚀 Uso de la Aplicación

### Comandos de Voz Disponibles

| Comando | Acción |
|---------|--------|
| **"Abre lugares favoritos"** | Abre el módulo de lugares |
| **"Abre contactos"** | Abre el módulo de contactos |
| **"Abre mi ubicación"** | Muestra ubicación actual |
| **"Volver"** | Regresa al menú principal |
| **"Agrega la ubicación donde estoy, nombre casa"** | Detecta GPS y abre formulario de lugar |
| **"Agrega a mi mamá, nombre Silvia, teléfono 099326"** | Abre formulario de contacto pre-llenado |
| **"Guárdala"** / **"Guárdalo"** | Guarda el registro actual |

### Uso Táctil

1. **Lugares Favoritos:**
   - Toca "+" para agregar
   - Toca una tarjeta para editar
   - Toca el ícono de navegación para ir a Google Maps
   - Toca el ícono de basura para eliminar

2. **Contactos de Emergencia:**
   - Toca "+" para agregar
   - Toca una tarjeta para editar
   - Toca el ícono de teléfono para llamar
   - Toca el ícono de basura para eliminar

---

## 📊 Diagrama de Flujo Completo

```
┌─────────────────────────────────────────────────────────────┐
│                     USUARIO FINAL                            │
│          (Persona con discapacidad visual)                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       v
┌─────────────────────────────────────────────────────────────┐
│              APK OPENBLIND (Android)                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  React Frontend (App.jsx)                           │   │
│  │                                                       │   │
│  │  - useVoiceCommands Hook (Escucha continua)         │   │
│  │  - Geolocation API (GPS)                            │   │
│  │  - Speech Synthesis API (Voz)                       │   │
│  │  - Fetch API (HTTP Requests)                        │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP Request (JSON)
                       │ POST /lugares-favoritos
                       │ { nombre, direccion, icono }
                       v
┌─────────────────────────────────────────────────────────────┐
│              BACKEND EXPRESS (Node.js)                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  app.js (Servidor Principal)                        │   │
│  │    │                                                 │   │
│  │    ├─> Middleware: apiResponse.js                   │   │
│  │    │   (Agrega res.apiResponse al objeto res)       │   │
│  │    │                                                 │   │
│  │    └─> Router: lugarFavorito.router.js              │   │
│  │          │                                           │   │
│  │          └─> POST / → createLugar()                 │   │
│  │                                                       │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │  Controller: lugarFavorito.controller.js     │   │   │
│  │  │                                               │   │   │
│  │  │  1. Validar datos (nombre, direccion)        │   │   │
│  │  │  2. Llamar asegurarClienteExiste(1)          │   │   │
│  │  │  3. Ejecutar SQL INSERT                       │   │   │
│  │  │  4. Retornar res.apiResponse(nuevoLugar)      │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │ SQL Query
                       │ INSERT INTO lugares_favoritos ...
                       v
┌─────────────────────────────────────────────────────────────┐
│              BASE DE DATOS MYSQL                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Database: openblind                                │   │
│  │                                                       │   │
│  │  ├─ clientes (auto-creado si no existe)            │   │
│  │  │   └─ idClientes = 1                             │   │
│  │  │                                                  │   │
│  │  ├─ lugares_favoritos                              │   │
│  │  │   ├─ idLugarFavorito (PK)                       │   │
│  │  │   ├─ idCliente (FK) → clientes.idClientes       │   │
│  │  │   ├─ nombreLugar                                │   │
│  │  │   ├─ direccion                                  │   │
│  │  │   └─ icono                                      │   │
│  │  │                                                  │   │
│  │  └─ contactos_emergencia                           │   │
│  │      ├─ idContactoEmergencia (PK)                  │   │
│  │      ├─ idCliente (FK) → clientes.idClientes       │   │
│  │      ├─ nombreContacto                             │   │
│  │      └─ telefono                                   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                       │ Retorna INSERT ID
                       v
┌─────────────────────────────────────────────────────────────┐
│              RESPUESTA AL FRONTEND                           │
│  {                                                           │
│    "success": true,                                          │
│    "message": "Lugar favorito creado",                       │
│    "data": { "id_lugar": 17, "nombre": "Casa", ... }        │
│  }                                                           │
└─────────────────────────────────────────────────────────────┘
                       │
                       v
┌─────────────────────────────────────────────────────────────┐
│              FRONTEND ACTUALIZA UI                           │
│  setLugares([...lugares, newLugar]);                         │
│  speak("Lugar creado");                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Tipo de Estructura del Proyecto

**Arquitectura Hexagonal (Ports & Adapters)**

### Capas del Proyecto:

1. **Capa de Presentación** (Frontend)
   - `frontend-openblind/src/components/` → Componentes UI
   - `frontend-openblind/src/App.jsx` → Orquestador

2. **Capa de Aplicación** (Frontend)
   - `frontend-openblind/src/hooks/` → Lógica reutilizable

3. **Capa de Dominio** (Backend)
   - `src/domain/models/sql/` → Modelos de negocio

4. **Capa de Infraestructura** (Backend)
   - `src/infrastructure/http/` → Controladores, rutas, middlewares
   - `src/infrastructure/database/` → Conexión MySQL

---

## 👥 Autores

- **Equipo OpenBlind** - Desarrollo Full Stack
- **Claude (Anthropic)** - Asistencia en implementación

---

## 📄 Licencia

Este proyecto es de código abierto para fines educativos y de accesibilidad.

---

## 🆘 Soporte

¿Problemas al generar el APK? Revisa:
1. Java 17 LTS instalado
2. Variable de entorno `JAVA_HOME` configurada
3. Conexión a internet para Gradle
4. Permisos en AndroidManifest.xml

---

**¡Gracias por usar OpenBlind! 🪐**
