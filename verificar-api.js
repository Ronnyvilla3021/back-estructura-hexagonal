/**
 * Script de Verificación de API - OpenBlind Admin
 * Verifica que todos los endpoints estén funcionando correctamente
 *
 * Uso: node verificar-api.js
 */

const http = require('http');

const BASE_URL = 'localhost';
const PORT = 8888;

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Lista de endpoints a verificar
const endpoints = [
  { method: 'GET', path: '/api/admin/metricas/resumen', name: 'Dashboard - Métricas' },
  { method: 'GET', path: '/api/admin/incidencias', name: 'Incidencias - Listar' },
  { method: 'GET', path: '/api/admin/soporte', name: 'Soporte - Listar' },
  { method: 'GET', path: '/api/admin/configuracion', name: 'Configuración - Obtener' }
];

function makeRequest(method, path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BASE_URL,
      port: PORT,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
}

async function verificarEndpoints() {
  console.log(`\n${colors.cyan}╔════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║     VERIFICACIÓN DE API - OpenBlind Admin         ║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════════════════╝${colors.reset}\n`);
  console.log(`${colors.blue}Servidor: http://${BASE_URL}:${PORT}${colors.reset}\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const endpoint of endpoints) {
    process.stdout.write(`${colors.yellow}Probando:${colors.reset} ${endpoint.method} ${endpoint.path} ... `);

    try {
      const result = await makeRequest(endpoint.method, endpoint.path);

      if (result.status === 200) {
        console.log(`${colors.green}✅ OK${colors.reset}`);

        // Mostrar información adicional según el endpoint
        if (endpoint.path.includes('metricas')) {
          if (result.data.data) {
            const metrics = result.data.data;
            console.log(`   ${colors.cyan}→${colors.reset} Usuarios: ${metrics.totalUsuarios || 0}`);
            console.log(`   ${colors.cyan}→${colors.reset} Incidencias: ${metrics.totalIncidencias || 0}`);
            console.log(`   ${colors.cyan}→${colors.reset} Tickets: ${metrics.ticketsAbiertos || 0}`);
          }
        } else if (endpoint.path.includes('incidencias') || endpoint.path.includes('soporte')) {
          if (result.data.data) {
            console.log(`   ${colors.cyan}→${colors.reset} Registros encontrados: ${result.data.data.length}`);
          }
        }

        successCount++;
      } else {
        console.log(`${colors.red}❌ ERROR (Status: ${result.status})${colors.reset}`);
        errorCount++;
      }
    } catch (error) {
      console.log(`${colors.red}❌ ERROR: ${error.message}${colors.reset}`);
      errorCount++;
    }

    console.log(''); // Línea en blanco
  }

  // Resumen
  console.log(`${colors.cyan}═══════════════════════════════════════════════════${colors.reset}\n`);
  console.log(`${colors.green}Exitosos:${colors.reset} ${successCount}/${endpoints.length}`);
  console.log(`${colors.red}Errores:${colors.reset} ${errorCount}/${endpoints.length}\n`);

  if (errorCount === 0) {
    console.log(`${colors.green}✅ ¡TODOS LOS ENDPOINTS FUNCIONAN CORRECTAMENTE!${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.red}⚠️  Algunos endpoints tienen problemas${colors.reset}`);
    console.log(`${colors.yellow}Verifica que:${colors.reset}`);
    console.log(`  1. El backend esté corriendo en puerto ${PORT}`);
    console.log(`  2. MySQL esté corriendo y la BD 'openblind' exista`);
    console.log(`  3. Los modelos estén sincronizados correctamente\n`);
    process.exit(1);
  }
}

// Verificar que el servidor está corriendo
console.log(`${colors.yellow}Verificando conexión al servidor...${colors.reset}`);

makeRequest('GET', '/').then(() => {
  console.log(`${colors.green}✅ Servidor detectado\n${colors.reset}`);
  verificarEndpoints();
}).catch((error) => {
  console.log(`${colors.red}❌ No se puede conectar al servidor en http://${BASE_URL}:${PORT}${colors.reset}`);
  console.log(`${colors.yellow}Error:${colors.reset} ${error.message}\n`);
  console.log(`${colors.yellow}Asegúrate de que el backend esté corriendo:${colors.reset}`);
  console.log(`  cd /home/user/estructura-hexagonal`);
  console.log(`  npm run dev\n`);
  process.exit(1);
});
