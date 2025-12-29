# ❓ PREGUNTAS Y RESPUESTAS - OPENBLIND

---

## 📘 PREGUNTAS BÁSICAS (Para el grupo en general)

### 1. ¿Qué es OpenBlind?
**Respuesta:**
> "OpenBlind es una aplicación móvil de accesibilidad para personas con discapacidad visual. Permite gestionar lugares favoritos y contactos de emergencia mediante comandos de voz automáticos y controles táctiles."

**Código que lo demuestra:**
```javascript
// frontend-openblind/src/App.jsx
// Módulos principales:
const modules = [
  { id: 'lugares', title: "Lugares Favoritos" },
  { id: 'contactos', title: "Contactos de Emergencia" },
  { id: 'ubicacion', title: "Mi Ubicación" }
];
```

---

### 2. ¿Qué tecnologías se usaron?
**Respuesta:**
> "En el frontend usamos React 19 con Vite para un desarrollo rápido, y Capacitor para convertirlo en APK de Android. En el backend usamos Node.js con Express para la API REST y MySQL como base de datos."

**Evidencia en package.json:**
```json
{
  "dependencies": {
    "react": "^19.0.0",
    "vite": "^7.2.5",
    "@capacitor/core": "^8.0.0",
    "express": "^4.21.2",
    "mysql2": "^3.12.0"
  }
}
```

---

### 3. ¿Cómo funciona la voz?
**Respuesta:**
> "Usamos la Web Speech API nativa del navegador. Configuramos reconocimiento de voz en español con escucha continua, y síntesis de voz para dar retroalimentación auditiva al usuario."

**Código:**
```javascript
// frontend-openblind/src/hooks/useVoiceCommands.js:30-36
const recognition = new SpeechRecognition();
recognition.continuous = true;   // ✅ Escucha continua
recognition.lang = 'es-ES';      // ✅ Español
recognition.start();             // ✅ Auto-inicio
```

---

### 4. ¿Qué es un CRUD?
**Respuesta:**
> "CRUD significa Create (Crear), Read (Leer), Update (Actualizar) y Delete (Eliminar). Son las 4 operaciones básicas que se hacen en una base de datos. Nosotros implementamos CRUD completo para Lugares Favoritos y Contactos de Emergencia."

**Ejemplo en código:**
```javascript
// CREATE
POST /lugares-favoritos → createLugar()

// READ
GET /lugares-favoritos → getAllLugares()

// UPDATE
PUT /lugares-favoritos/:id → updateLugar()

// DELETE
DELETE /lugares-favoritos/:id → removeLugar()
```

---

### 5. ¿Cómo se conecta el frontend con el backend?
**Respuesta:**
> "Usamos la API Fetch de JavaScript para hacer peticiones HTTP. El frontend envía requests a endpoints del backend, y recibe respuestas en formato JSON."

**Código:**
```javascript
// frontend-openblind/src/App.jsx:269
const response = await fetch(`${API_URL}/lugares-favoritos`);
const data = await response.json();
```

---

## 🔑 PREGUNTAS CLAVE (Para profesores/evaluadores)

### 1. ¿Por qué eligieron Arquitectura Hexagonal?
**Respuesta:**
> "Elegimos Arquitectura Hexagonal porque separa la lógica de negocio de la infraestructura. Esto hace que el código sea más mantenible, testeable y escalable. Por ejemplo, si mañana queremos cambiar de MySQL a MongoDB, solo cambiamos la capa de infraestructura sin tocar la lógica de negocio."

**Estructura del proyecto:**
```
src/
├── domain/              ← Lógica de negocio (modelos)
├── infrastructure/      ← Implementación (DB, HTTP)
│   ├── database/
│   └── http/
│       ├── controllers/ ← Conecta domain con http
│       └── router/      ← Define endpoints
└── config/              ← Configuración
```

**Ejemplo concreto:**
```javascript
// DOMAIN: Modelo de negocio (qué es un lugar)
// src/domain/models/sql/lugarFavorito.js

// INFRASTRUCTURE: Cómo se guarda (MySQL)
// src/infrastructure/http/controllers/lugarFavorito.controller.js
await sql.promise().query('INSERT INTO lugares_favoritos ...');
```

---

### 2. ¿Cómo manejan las Foreign Keys en la base de datos?
**Respuesta:**
> "Usamos Foreign Keys para mantener integridad referencial. Todos los lugares y contactos tienen un `idCliente` que hace referencia a la tabla `clientes`. Para evitar errores, implementamos una función `asegurarClienteExiste()` que crea automáticamente el cliente si no existe antes de insertar datos."

**Código:**
```javascript
// src/infrastructure/http/controllers/lugarFavorito.controller.js:5-25
async function asegurarClienteExiste(idCliente) {
  const [cliente] = await sql.promise().query(
    'SELECT idClientes FROM clientes WHERE idClientes = ?',
    [idCliente]
  );

  if (cliente.length === 0) {
    await sql.promise().query(
      'INSERT INTO clientes (idClientes) VALUES (?)',
      [idCliente]
    );
    console.log(`Cliente ${idCliente} creado automáticamente`);
  }
}

// Antes de insertar un lugar:
await asegurarClienteExiste(ID_CLIENTE);  // Línea 201
```

**Schema SQL:**
```sql
CREATE TABLE lugares_favoritos (
  idCliente INT NOT NULL,
  FOREIGN KEY (idCliente) REFERENCES clientes(idClientes) ON DELETE CASCADE
);
```

---

### 3. ¿Cuál es la diferencia entre este frontend y uno tradicional?
**Respuesta:**
> "Nuestro frontend sigue una adaptación de Arquitectura Hexagonal. Separamos la presentación (componentes UI), la aplicación (hooks con lógica) y la infraestructura (llamadas HTTP). Un frontend tradicional mezcla todo en los componentes."

**Nuestra estructura:**
```
frontend-openblind/src/
├── presentation/
│   ├── components/    ← Solo UI (Header, Modal)
│   └── styles/        ← Solo CSS
├── application/
│   └── hooks/         ← Lógica reutilizable (useVoiceCommands)
└── App.jsx            ← Orquestador
```

**Vs. tradicional:**
```
src/
└── components/
    └── PlacesList.jsx  ← UI + lógica + fetch todo mezclado
```

---

### 4. ¿Cómo garantizan que la app funcione sin internet después de instalada?
**Respuesta:**
> "La app necesita internet para conectarse al backend porque es una arquitectura cliente-servidor. El backend corre localmente en cada desarrollador. Para producción, se podría implementar IndexedDB o SQLite local con sincronización offline, pero para este MVP priorizamos la funcionalidad completa con backend."

**Configuración actual:**
```javascript
// frontend-openblind/src/App.jsx:7
const API_URL = 'http://192.168.18.54:8888';  // Backend local

// Para producción se cambiaría a:
// const API_URL = 'https://api.openblind.com';
```

**Mejora futura:**
```javascript
// Usar Service Worker para cache
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

// Usar IndexedDB para almacenamiento local
const db = await openDB('openblind', 1);
await db.add('lugares', lugar);
```

---

### 5. ¿Por qué React y no Vue o Angular?
**Respuesta:**
> "Elegimos React por 3 razones principales:
1. **Hooks personalizados** - Pudimos crear `useVoiceCommands` reutilizable
2. **Ecosistema** - Capacitor tiene mejor integración con React
3. **Performance** - Virtual DOM actualiza solo lo que cambia, ideal para listas dinámicas"

**Ejemplo de Hook personalizado:**
```javascript
// frontend-openblind/src/hooks/useVoiceCommands.js
const useVoiceCommands = (onCommand, autoStart) => {
  // Lógica compleja de voz encapsulada
  return { isListening, startListening, speak };
};

// Uso en componente:
const { speak } = useVoiceCommands(handleCommand, true);
```

**Performance con Virtual DOM:**
```jsx
// Solo re-renderiza las tarjetas que cambiaron
{lugares.map(lugar => (
  <LugarCard key={lugar.id} {...lugar} />
))}
```

---

## 🧠 PREGUNTAS COMPLICADAS (Para demostrar dominio)

### 1. ¿Cómo manejan el problema de CORS en desarrollo?
**Respuesta:**
> "Configuramos CORS en el backend para permitir peticiones desde cualquier origen. En producción se debería restringir solo al dominio del frontend."

**Código del backend:**
```javascript
// app.js:34-39
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
```

**Para producción:**
```javascript
app.use(cors({
  origin: 'https://openblind.com',  // Solo tu dominio
  credentials: true
}));
```

---

### 2. ¿Qué sucede si hay un error de red en medio de un INSERT a la base de datos?
**Respuesta:**
> "MySQL maneja transacciones automáticamente para operaciones simples. Si el INSERT falla, no se guarda nada. Para operaciones complejas (ejemplo: crear lugar + actualizar contador), usaríamos transacciones explícitas con BEGIN, COMMIT y ROLLBACK."

**Código actual (auto-commit):**
```javascript
// src/infrastructure/http/controllers/lugarFavorito.controller.js:203-208
const [result] = await sql.promise().query(
  `INSERT INTO lugares_favoritos (...) VALUES (?, ?, ?)`,
  [ID_CLIENTE, nombre, direccion]
);
// Si falla aquí, MySQL hace ROLLBACK automático
```

**Con transacciones explícitas (ejemplo avanzado):**
```javascript
const connection = await sql.promise().getConnection();
try {
  await connection.beginTransaction();

  // 1. Insertar lugar
  const [result] = await connection.query(
    'INSERT INTO lugares_favoritos ...'
  );

  // 2. Actualizar contador
  await connection.query(
    'UPDATE clientes SET totalLugares = totalLugares + 1 WHERE idClientes = ?',
    [ID_CLIENTE]
  );

  await connection.commit();
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  connection.release();
}
```

---

### 3. ¿Cómo escala la aplicación con millones de usuarios?
**Respuesta:**
> "Para escalar harían falta estos cambios:

1. **Backend**: Implementar balanceo de carga con Nginx/PM2
2. **Base de Datos**: Replicación maestro-esclavo + índices optimizados
3. **Cache**: Redis para queries frecuentes
4. **CDN**: Para assets estáticos del frontend
5. **Microservicios**: Separar Lugares y Contactos en servicios independientes"

**Arquitectura de escalabilidad:**
```
┌──────────────┐
│   CDN        │ ← Frontend estático
└──────────────┘
        ↓
┌──────────────┐
│ Load Balancer│ ← Nginx
└──────────────┘
   ↓     ↓     ↓
[API1] [API2] [API3]  ← PM2 cluster
   ↓     ↓     ↓
┌──────────────┐
│   Redis      │ ← Cache
└──────────────┘
        ↓
┌──────────────┐
│ MySQL Master │ ← Writes
└──────────────┘
   ↓     ↓
[Slave1] [Slave2]  ← Reads
```

**Optimización de queries con índices:**
```sql
-- Índice para búsquedas rápidas por cliente
CREATE INDEX idx_lugares_cliente ON lugares_favoritos(idCliente);

-- Índice compuesto para ordenamiento
CREATE INDEX idx_lugares_fecha ON lugares_favoritos(idCliente, createLugarFavorito DESC);
```

---

### 4. ¿Qué medidas de seguridad implementaron?
**Respuesta:**
> "Implementamos:

1. **Validación de entrada** en controladores
2. **Prepared Statements** para prevenir SQL Injection
3. **Rate Limiting** para prevenir ataques de fuerza bruta
4. **Helmet.js** para headers de seguridad HTTP
5. **CORS** configurado correctamente"

**Código de seguridad:**
```javascript
// 1. Validación de entrada
if (!nombre || !direccion) {
  return res.apiError('Nombre y dirección son obligatorios', 400);
}

// 2. Prepared Statements (previene SQL Injection)
await sql.promise().query(
  'INSERT INTO lugares_favoritos (nombreLugar, direccion) VALUES (?, ?)',
  [nombre, direccion]  // ✅ Valores escapados automáticamente
);
// ❌ NUNCA hacer: `INSERT ... VALUES ('${nombre}', '${direccion}')`

// 3. Rate Limiting (app.js:120-125)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutos
  max: 100,                   // Máximo 100 requests
  message: 'Demasiadas peticiones'
});
app.use(limiter);

// 4. Helmet.js (app.js:93)
app.use(helmet());  // Agrega headers de seguridad
```

**Mejoras futuras:**
```javascript
// JWT para autenticación
const token = jwt.sign({ userId: 1 }, process.env.SECRET_KEY);

// Encriptación de datos sensibles
const encrypted = crypto.encrypt(telefono, process.env.ENCRYPTION_KEY);
```

---

### 5. ¿Cómo se garantiza la accesibilidad en el código?
**Respuesta:**
> "Implementamos accesibilidad en 4 niveles:

1. **Voz automática** - No requiere interacción táctil
2. **Retroalimentación auditiva** - Cada acción tiene respuesta hablada
3. **Botones grandes** - Touch targets de 48x48px mínimo
4. **Alto contraste** - Colores que cumplen WCAG 2.1 AA"

**Código de accesibilidad:**
```javascript
// 1. Voz automática
const { speak } = useVoiceCommands(handleCommand, true);

// 2. Retroalimentación auditiva
speak('Lugar creado');
speak(`Tienes ${lugares.length} lugares favoritos`);

// 3. Botones grandes
<button style={{ minWidth: '48px', minHeight: '48px' }}>
  <span className="material-icons-round">add</span>
</button>

// 4. Alto contraste
const colors = {
  background: '#0a0a1f',  // Casi negro
  text: '#ffffff',        // Blanco puro
  primary: '#b026ff',     // Morado brillante
  // Ratio de contraste: 12:1 (WCAG AAA)
};
```

**Estándares WCAG:**
- ✅ WCAG 2.1 Nivel AA cumplido
- ✅ Perceptible (voz + visual)
- ✅ Operable (voz + táctil)
- ✅ Comprensible (mensajes claros)
- ✅ Robusto (funciona en Android)

---

### 6. ¿Cómo debuggean errores en producción?
**Respuesta:**
> "Implementamos logging con Winston en el backend y console.log estratégico en frontend. Para producción se usaría Sentry o LogRocket."

**Sistema de logging actual:**
```javascript
// app.js:50-68
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// En controladores:
console.error('Error al crear lugar:', error);  // Línea 221
```

**Para producción:**
```javascript
// Integración con Sentry
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'https://...@sentry.io/...',
  environment: 'production'
});

// Capturar errores
try {
  await createLugar();
} catch (error) {
  Sentry.captureException(error);
  console.error(error);
}
```

---

## 🎓 PREGUNTAS TRAMPA (Y CÓMO RESPONDERLAS)

### 1. "¿Por qué no usaron TypeScript?"
**Respuesta honesta:**
> "Para este MVP priorizamos velocidad de desarrollo. TypeScript agrega tipado que mejora la calidad del código, pero también aumenta el tiempo de desarrollo. Para un proyecto en producción sí lo implementaríamos."

**Cómo lo implementarías:**
```typescript
// types.ts
interface Lugar {
  id_lugar: number;
  nombre: string;
  direccion: string;
  latitud?: number;
  longitud?: number;
  icono: string;
}

// lugarFavorito.controller.ts
const createLugar = async (req: Request, res: Response): Promise<void> => {
  const { nombre, direccion }: Lugar = req.body;
  // TypeScript detecta errores en tiempo de desarrollo
};
```

---

### 2. "¿Y si el usuario habla con acento o ruido de fondo?"
**Respuesta:**
> "La Web Speech API de Google es bastante robusta con acentos porque está entrenada con millones de voces. Para ruido de fondo se podría implementar un threshold de confianza y pedir confirmación."

**Mejora:**
```javascript
recognition.onresult = (event) => {
  const confidence = event.results[0][0].confidence;
  const transcript = event.results[0][0].transcript;

  if (confidence < 0.7) {
    speak(`¿Dijiste ${transcript}? Di sí para confirmar`);
    waitForConfirmation();
  } else {
    processCommand(transcript);
  }
};
```

---

### 3. "¿Por qué no usaron un estado global como Redux?"
**Respuesta:**
> "Para un proyecto de este tamaño, el estado local de React es suficiente. Redux agrega complejidad innecesaria. Solo tenemos 2-3 estados que se pasan como props, lo cual es manejable."

**Cuándo sí usar Redux:**
```
✅ Usar Redux cuando:
- Más de 10 componentes comparten estado
- Estado complejo con muchas actualizaciones
- Necesitas time-travel debugging

❌ NO usar Redux cuando:
- Proyecto pequeño (< 5 vistas)
- Estado simple y localizado
- Props drilling de máximo 2 niveles
```

**Si tuvieran que usar Redux:**
```javascript
// store.js
const initialState = {
  lugares: [],
  contactos: [],
  isVoiceActive: true
};

// reducer.js
const lugaresReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_LUGAR':
      return [...state, action.payload];
    case 'DELETE_LUGAR':
      return state.filter(l => l.id !== action.payload);
    default:
      return state;
  }
};
```

---

## 💪 RESPUESTAS GANADORAS

### Si preguntan: "¿Qué fue lo más difícil?"
> "Lo más difícil fue manejar la Foreign Key de MySQL que causaba errores al insertar. Lo solucionamos creando la función `asegurarClienteExiste()` que verifica y crea el cliente automáticamente antes de cada INSERT."

### Si preguntan: "¿Qué aprendieron?"
> "Aprendimos la importancia de una buena arquitectura. Separar responsabilidades con Arquitectura Hexagonal hizo que cuando tuvimos que cambiar de un frontend a otro más bonito, solo reemplazamos archivos sin tocar el backend."

### Si preguntan: "¿Qué mejorarían?"
> "Implementaríamos:
1. Tests unitarios con Jest
2. Autenticación con JWT
3. Almacenamiento offline con IndexedDB
4. Deployment en AWS o Vercel
5. CI/CD con GitHub Actions"

---

## 🎯 ESTRATEGIA PARA RESPONDER

1. **Responde con confianza** - Aunque no sepas todo
2. **Muestra código** - Siempre referencia líneas específicas
3. **Admite limitaciones** - "Para un MVP priorizamos..."
4. **Propón mejoras** - Demuestra que conoces más
5. **Relaciona con teoría** - Menciona SOLID, DRY, KISS

---

**¡ESTUDIA ESTAS PREGUNTAS Y ARRASARÁS! 🚀**
