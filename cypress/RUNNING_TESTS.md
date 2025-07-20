# 🧪 GUÍA DE EJECUCIÓN DE PRUEBAS E2E - AGENDA TURNOS

## 🚀 Configuración Inicial

### 1. Preparar el Entorno

```bash
# 1. Navegar al directorio de la aplicación
cd c:\Users\Perezoso\Documents\GitHub\agenda_turnos\agenda_turnos

# 2. Instalar dependencias de Cypress (si no está instalado)
npm install cypress --save-dev

# 3. Verificar que la aplicación esté funcionando
ionic serve
# La aplicación debe estar disponible en http://localhost:8100
```

### 2. Preparar la Base de Datos

**⚠️ IMPORTANTE**: Las pruebas requieren una base de datos limpia.

```sql
-- Si usa PostgreSQL, ejecutar:
DELETE FROM turnos WHERE id > 0;
DELETE FROM funcionarios WHERE id > 0;
DELETE FROM usuarios WHERE id > 0;

-- O reiniciar la base de datos completamente
```

## 🏃‍♂️ Ejecutar las Pruebas

### Opción 1: Modo Interactivo (Recomendado para desarrollo)

```bash
# Abrir la interfaz de Cypress
npx cypress open

# Luego:
# 1. Seleccionar "E2E Testing"
# 2. Elegir navegador (Chrome recomendado)
# 3. Hacer clic en "spec.cy.js"
```

### Opción 2: Modo Headless (Para CI/CD)

```bash
# Ejecutar todas las pruebas
npx cypress run

# Ejecutar solo la spec principal
npx cypress run --spec "cypress/e2e/spec.cy.js"

# Ejecutar con navegador específico
npx cypress run --browser chrome

# Ejecutar con configuración de producción
npx cypress run --config baseUrl=http://localhost:8100
```

### Opción 3: Ejecutar Pruebas Individuales

```bash
# Solo registro de administrador
npx cypress run --spec "cypress/e2e/spec.cy.js" --grep "registrar una nueva cuenta"

# Solo registro de funcionarios
npx cypress run --spec "cypress/e2e/spec.cy.js" --grep "registrar múltiples funcionarios"

# Solo asignación de turnos
npx cypress run --spec "cypress/e2e/spec.cy.js" --grep "asignar turnos extra"
```

## 📊 Datos de Prueba

### Administrador de Prueba
```
Email: admin.test@hospital.cl
Contraseña: AdminPass123!
Nombre: Administrador Test
```

### Funcionarios de Prueba (Se registran automáticamente)

| Nombre | Profesión | Unidad | Turnos Extra |
|--------|-----------|--------|--------------|
| María González | Enfermera | UCI | 2 |
| Carlos Martínez | Médico | Cardiología | 3 |
| Ana López | Técnico Enfermería | Pediatría | 1 |
| Pedro Fernández | Paramédico | Urgencias | 4 |
| Isabella Vargas | Kinesióloga | Rehabilitación | 2 |

## 📈 Interpretación de Resultados

### ✅ Pruebas Exitosas
```
✓ Debe registrar una nueva cuenta de administrador exitosamente (15s)
✓ Debe iniciar sesión con el administrador registrado (8s)
✓ Debe registrar múltiples funcionarios con datos completos (120s)
✓ Debe asignar turnos extra a los funcionarios registrados (45s)
✓ Debe verificar la integridad completa del sistema (30s)

5 passing (3m 38s)
```

### ❌ Identificar Fallos Comunes

1. **Error de conexión**:
   ```
   Error: Timed out retrying after 4000ms: Expected to find element
   ```
   **Solución**: Verificar que la aplicación esté ejecutándose

2. **Datos duplicados**:
   ```
   Error: Usuario ya existe
   ```
   **Solución**: Limpiar la base de datos antes de ejecutar

3. **Elementos no encontrados**:
   ```
   Error: Element not found: ion-button:contains("Registrarse")
   ```
   **Solución**: Verificar que la UI haya cargado completamente

## 🛠 Comandos Personalizados Disponibles

### Autenticación
```javascript
cy.loginAdmin('email@test.com', 'password');
cy.registerAdmin({name: 'Test', email: 'test@test.com', password: 'pass'});
```

### Gestión de Funcionarios
```javascript
cy.registerFuncionario(funcionarioData);
cy.fillFuncionarioForm(funcionarioData);
```

### Gestión de Turnos
```javascript
cy.assignExtraShifts('María González', 3);
cy.verifyExtraShifts('María González', 3);
```

### Utilidades
```javascript
cy.waitForElement('ion-button', 5000);
cy.typeInIonicInput('ion-input[formControlName="name"]', 'Texto');
cy.clickIonicButton('Guardar');
cy.handleIonicAlert('Mensaje esperado', 'OK');
```

## 📋 Lista de Verificación Pre-Ejecución

- [ ] ✅ Aplicación ejecutándose en http://localhost:8100
- [ ] ✅ Base de datos limpia y accesible
- [ ] ✅ Servidor backend funcionando
- [ ] ✅ Cypress instalado (`npm install cypress`)
- [ ] ✅ Navegador compatible disponible (Chrome/Firefox)
- [ ] ✅ Permisos de escritura en directorio de cypress

## 🎥 Grabación y Screenshots

### Configurar Grabación Automática
```javascript
// En cypress.config.js
module.exports = defineConfig({
  e2e: {
    video: true,
    screenshotOnRunFailure: true,
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots'
  }
});
```

### Ubicación de Archivos
```
cypress/
├── videos/
│   └── spec.cy.js.mp4
├── screenshots/
│   └── spec.cy.js/
│       └── error-screenshot.png
└── downloads/
    └── reportes/
```

## 📊 Métricas de Rendimiento Esperadas

| Prueba | Tiempo Esperado | Acciones |
|--------|----------------|----------|
| Registro Admin | 10-15 segundos | 5 acciones |
| Login | 5-8 segundos | 3 acciones |
| Registro Funcionario | 15-20 segundos | 15 acciones |
| Asignación Turno | 3-5 segundos | 2 acciones |
| **Suite Completa** | **5-8 minutos** | **~85 acciones** |

## 🚨 Solución de Problemas

### Problema: Cypress no encuentra elementos
```bash
# Verificar que los selectores sean correctos
cy.get('[data-cy="element"]') // Preferible
cy.get('ion-button:contains("Texto")') // Funcional
```

### Problema: Timeouts frecuentes
```javascript
// Aumentar timeouts globales en cypress.config.js
{
  defaultCommandTimeout: 10000,
  pageLoadTimeout: 30000,
  responseTimeout: 30000
}
```

### Problema: Base de datos no se limpia
```sql
-- Script de limpieza manual
TRUNCATE TABLE turnos CASCADE;
TRUNCATE TABLE funcionarios CASCADE;
TRUNCATE TABLE usuarios CASCADE;
```

## 📝 Reportes Personalizados

### Generar Reporte HTML
```bash
# Instalar plugin de reportes
npm install cypress-mochawesome-reporter --save-dev

# Ejecutar con reporte
npx cypress run --reporter cypress-mochawesome-reporter
```

### Integración con CI/CD
```yaml
# GitHub Actions ejemplo
- name: Run Cypress Tests
  run: |
    npm run start &
    npx wait-on http://localhost:8100
    npx cypress run --record --key ${{ secrets.CYPRESS_KEY }}
```

## 🎯 Próximos Pasos

1. **Agregar más casos de prueba**:
   - Validaciones de formularios
   - Casos de error
   - Pruebas de rendimiento

2. **Implementar pruebas de API**:
   - Intercepts de red
   - Mocking de respuestas
   - Verificación de payloads

3. **Configurar CI/CD**:
   - GitHub Actions
   - Pipeline automático
   - Reportes de cobertura

4. **Optimizar rendimiento**:
   - Reducir timeouts
   - Mejorar selectores
   - Paralelización

---

**Autor**: Agenda Turnos Development Team  
**Versión**: 1.0.0  
**Última Actualización**: 2025-07-14

## 📞 Soporte

Para problemas con las pruebas:
1. Revisar logs de Cypress en `cypress/videos/`
2. Verificar screenshots en `cypress/screenshots/`
3. Consultar documentación oficial: https://docs.cypress.io/
4. Verificar configuración de la aplicación
