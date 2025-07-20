# Pruebas E2E Cypress - Agenda Turnos

## 📁 Estructura de Pruebas Separadas

Las pruebas E2E han sido organizadas en archivos separados para mejorar la mantenibilidad y permitir ejecución independiente de cada funcionalidad.

### 🗂️ Archivos de Prueba

#### **01-login.cy.js**
**Funcionalidad:** Autenticación de usuarios
- ✅ Login exitoso con administrador existente
- ❌ Manejo de credenciales incorrectas  
- 🔄 Navegación post-login
- 🔒 Verificación de estado de autenticación

#### **02-registro-funcionarios.cy.js** 
**Funcionalidad:** Registro de nuevos funcionarios
- ✅ Registro individual exitoso
- ✅ Validación de formulario
- ✅ Verificación en lista de funcionarios
- ❌ Validación de campos requeridos

#### **03-lista-funcionarios.cy.js**
**Funcionalidad:** Gestión de lista de funcionarios
- 📋 Visualización de funcionarios
- 🔍 Funcionalidad de búsqueda
- 🎛️ Grid 2x2 de botones de acción
- ✏️ Apertura de modal de edición
- 👁️ Visualización de turnos
- 🔄 Actualización de lista

#### **04-turnos-extra.cy.js**
**Funcionalidad:** Asignación de turnos extra
- 🌅 Asignación de turnos de día
- 🌙 Asignación de turnos de noche
- ✅ Validación de elegibilidad
- 📝 Formulario de detalles de turno
- ❌ Validación de campos requeridos

#### **05-eliminacion-funcionarios.cy.js**
**Funcionalidad:** Eliminación de funcionarios
- 🗑️ Eliminación exitosa con confirmación
- ❌ Cancelación de eliminación
- 🔄 Actualización de lista post-eliminación
- ⚠️ Manejo de errores de eliminación
- 📊 Verificación de contadores

#### **06-navegacion-ui.cy.js**
**Funcionalidad:** Navegación y UI
- 🧭 Menú lateral y navegación
- 📱 Responsividad
- 🔄 Estados de loading
- 🎨 Elementos visuales e iconos
- 📱 Modales y overlays

## 🚀 Ejecución de Pruebas

### Ejecutar todas las pruebas
```bash
npx cypress run
```

### Ejecutar una prueba específica
```bash
# Solo login
npx cypress run --spec "cypress/e2e/01-login.cy.js"

# Solo registro de funcionarios
npx cypress run --spec "cypress/e2e/02-registro-funcionarios.cy.js"

# Solo lista de funcionarios
npx cypress run --spec "cypress/e2e/03-lista-funcionarios.cy.js"
```

### Abrir Cypress en modo interactivo
```bash
npx cypress open
```

## 🔧 Configuración

### Comandos Personalizados Requeridos
Los siguientes comandos personalizados deben estar definidos en `cypress/support/commands.js`:

- `cy.fillIonInput(fieldName, value)` - Llenar inputs de Ionic
- `cy.selectIonSelectForced(fieldName, value)` - Seleccionar opciones en ion-select
- `cy.selectIonDatetimeForced(fieldName, value)` - Seleccionar fechas en ion-datetime

### Datos de Prueba
- **Administrador:** `cocodrilo@gmail.com` / `cocodrilo`
- **Backend:** Debe estar corriendo en modo desarrollo
- **Base de datos:** Debe permitir operaciones CRUD

## 📝 Notas Importantes

### ⚠️ Estado Actual
- ✅ **Login:** Funciona correctamente
- ✅ **Registro de funcionarios:** Funciona correctamente  
- 🔧 **Lista de funcionarios:** En ajuste (grid 2x2 implementado)
- 🔧 **Turnos extra:** Requiere ajustes en validación de elegibilidad
- 🔧 **Eliminación:** Requiere verificación de confirmaciones
- 🔧 **Navegación:** Requiere ajustes en selectores

### 🎯 Ventajas de la Separación
1. **Ejecución independiente** - Probar funcionalidades por separado
2. **Debugging más fácil** - Localizar problemas específicos
3. **Desarrollo incremental** - Ajustar una funcionalidad a la vez
4. **Mantenimiento** - Modificar pruebas sin afectar otras
5. **Paralelización** - Ejecutar múltiples pruebas simultáneamente

### 🔄 Flujo de Trabajo Recomendado
1. Arreglar **01-login.cy.js** primero (base para todo)
2. Verificar **02-registro-funcionarios.cy.js** (ya funciona)
3. Ajustar **03-lista-funcionarios.cy.js** (validar grid 2x2)
4. Corregir **04-turnos-extra.cy.js** (ajustar selectores)
5. Validar **05-eliminacion-funcionarios.cy.js** (confirmar eliminación)
6. Finalizar **06-navegacion-ui.cy.js** (elementos UI)

## 🐛 Debugging

### Para debugging individual:
```javascript
// En cualquier prueba, agregar:
cy.pause(); // Pausa la ejecución
cy.debug(); // Información de debugging
cy.log('Estado actual:', variable); // Logs personalizados
```

### Screenshots automáticos:
Los screenshots se guardan automáticamente en `cypress/screenshots/` cuando hay fallos.

### Videos:
Los videos de ejecución se guardan en `cypress/videos/` (modo headless).

---

**Última actualización:** Julio 2025  
**Estado:** Pruebas separadas y organizadas ✅
