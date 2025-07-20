/**
 * GUÍA DE EJECUCIÓN DE PRUEBAS CYPRESS
 * ====================================
 * 
 * Esta guía describe cómo ejecutar las pruebas E2E mejoradas para 
 * la aplicación Agenda Turnos con soporte completo para ion-datetime.
 */

# PRERREQUISITOS

## 1. Instalar dependencias de Cypress
```bash
npm install cypress --save-dev
```

## 2. Verificar configuración de Cypress
- Asegurarse de que `cypress.config.js` tenga `baseUrl: 'http://localhost:8100'`
- Verificar que `cypress/support/e2e.js` importe los comandos personalizados

## 3. Iniciar servidor de desarrollo
```bash
# En terminal 1 - Iniciar la aplicación Ionic
cd agenda_turnos
ionic serve

# En terminal 2 - Iniciar API backend (si es necesario)
cd api
npm start
```

# EJECUCIÓN DE PRUEBAS

## Modo Interactivo (Recomendado para desarrollo)
```bash
npx cypress open
```

## Modo Headless (Para CI/CD)
```bash
npx cypress run
```

## Ejecutar solo el spec de registro de funcionarios
```bash
npx cypress run --spec "cypress/e2e/spec.cy.js"
```

# COMANDOS PERSONALIZADOS IMPLEMENTADOS

## `cy.selectIonDatetimeForced(formControlName, dateString)`
- **Propósito**: Selecciona fechas en componentes ion-datetime con forzado de interacción
- **Parámetros**: 
  - `formControlName`: Nombre del FormControl (ej: 'fecha_nacimiento')
  - `dateString`: Fecha en formato YYYY-MM-DD (ej: '1985-05-15')
- **Funcionalidad**: 
  - Maneja problemas de visibilidad CSS con force: true
  - Establece el valor usando propiedades DOM y atributos
  - Dispara eventos ionChange, change e input para sincronización con Angular
  - Verifica que el valor se estableció correctamente

## `cy.selectIonDatetime(formControlName, dateString)` 
- **Propósito**: Versión robusta para ion-datetime con scroll automático
- **Funcionalidad**:
  - Busca el elemento dentro del contenedor ion-item
  - Hace scroll automático con scrollIntoView()
  - Fuerza visibilidad si el elemento está oculto
  - Maneja múltiples eventos para sincronización completa

# COMANDOS PERSONALIZADOS IMPLEMENTADOS

## `cy.selectIonSelectForced(formControlName, value)`
- **Propósito**: Selecciona opciones en ion-select con método directo forzado
- **Parámetros**:
  - `formControlName`: Nombre del FormControl (ej: 'turno')
  - `value`: Valor de la opción (ej: '4to_turno')
- **Funcionalidad**:
  - Establece el valor directamente sin interactuar con popover/modal
  - Dispara eventos ionSelectionChange, ionChange, change e input
  - Ideal para casos donde los popovers tienen problemas de timing

## `cy.selectIonSelectOption(formControlName, value)` 
- **Propósito**: Versión robusta que maneja popovers y alerts
- **Funcionalidad**:
  - Detecta automáticamente si usa popover o alert
  - Maneja tanto ion-radio como ion-select-option
  - Busca por valor y texto como fallback

## `cy.fillIonInput(formControlName, value)`
- **Propósito**: Llena campos ion-input de manera robusta
- **Parámetros**:
  - `formControlName`: Nombre del FormControl (ej: 'Name1')
  - `value`: Texto a ingresar (ej: 'Juan')

## `cy.handleIonicAlert(expectedText, buttonText)`
- **Propósito**: Maneja alertas de Ionic
- **Parámetros**:
  - `expectedText`: Texto esperado en la alerta (opcional)
  - `buttonText`: Texto del botón a presionar (por defecto 'OK')

# ESTRUCTURA DE DATOS DE PRUEBA

Los trabajadores de prueba deben seguir esta estructura:

```javascript
const trabajador = {
  Name1: 'Juan',                    // Primer nombre
  Name2: 'Carlos',                  // Segundo nombre
  email: 'juan.carlos@hospital.cl', // Email válido
  fecha_nacimiento: '1985-05-15',   // Formato YYYY-MM-DD
  fecha_ingreso: '2020-01-15',      // Formato YYYY-MM-DD
  turno: '4to_turno',               // Valores válidos: '4to_turno_modificado', '3er_turno', '4to_turno', 'diurno_hospital', 'diurno_empresa', 'volante'
  fechainicioturno: '2020-02-01',   // Formato YYYY-MM-DD
  contrato: 'planta',               // Valores válidos: 'contrato_indefinido', 'contrato_fijo', 'planta', 'contrata', 'volante'
  estado: 'activo',                 // Valores válidos: 'activo', 'inactivo', 'licencia', 'vacaciones', 'suspendido'
  nivel: 'profesional'              // Valores válidos: 'tecnico', 'manipulador', 'auxiliar', 'profesional'
};
```
# SOLUCIÓN DE PROBLEMAS ESPECÍFICOS

## Error: Element not visible due to CSS positioning

**Síntoma**: `Timed out retrying: expected element to be 'visible'` con mensajes sobre `position: fixed` y overflow.

**Causa**: Los componentes ion-datetime pueden tener problemas de visibilidad en formularios largos debido a:
- CSS `position: fixed` en contenedores padre
- Elementos superpuestos que ocultan el componente
- Limitaciones de altura de viewport en contenedores de scroll

**Soluciones implementadas**:

1. **ScrollIntoView automático**: `cy.selectIonDatetime()` hace scroll automático al elemento
2. **Comando forzado**: `cy.selectIonDatetimeForced()` bypass la validación de visibilidad
3. **Manipulación CSS**: Fuerza `visibility: visible` y `display: block` temporalmente
4. **Múltiples eventos**: Dispara ionChange, change, input y blur para cobertura completa

**Uso recomendado**:
```javascript
// Para formularios con problemas de visibilidad
cy.selectIonDatetimeForced('fecha_nacimiento', '1985-05-15');

// Para casos normales
cy.selectIonDatetime('fecha_nacimiento', '1985-05-15');
```

## Validación de formularios Angular

**Problema**: Los campos no se marcan como "tocados" o válidos después de establecer valores.

**Solución**: Los comandos personalizados disparan múltiples eventos:
- `ionChange`: Para componentes Ionic
- `change`: Para formularios HTML estándar  
- `input`: Para validación en tiempo real
- `blur`: Para marcar campos como "tocados"

## Selectores robustos

**Estrategia**: Usar `formControlName` como selector principal:
- `ion-datetime[formControlName="fecha_nacimiento"]`
- `ion-select[formControlName="turno"]`
- `ion-input[formControlName="Name1"]`

Esto evita conflictos con múltiples formularios en la misma página.

# FLUJO DE PRUEBA

1. **Login de Administrador**: Usa credenciales existentes
2. **Navegación al Registro**: Via menú lateral
3. **Completar Formulario**: Con comandos personalizados robustos
4. **Manejo de Fechas**: Automatización completa de ion-datetime
5. **Envío y Verificación**: Confirma registro exitoso

# PROBLEMAS RESUELTOS

## Ion-datetime
- ✅ Selección automática de año, mes y día
- ✅ Sincronización con Angular Forms
- ✅ Manejo de eventos personalizados
- ✅ Verificación de valores establecidos

## Selectores Robustos  
- ✅ Uso de formControlName específicos
- ✅ Evita conflictos entre formularios
- ✅ Selectores únicos para cada campo

## Angular Integration
- ✅ Eventos ionChange para componentes Ionic
- ✅ Eventos change e input para Angular Forms
- ✅ Sincronización bidireccional de datos

# DEBUGGING

## Si las fechas no se establecen correctamente:
1. Verificar que el formato sea YYYY-MM-DD
2. Comprobar que el formControlName coincida exactamente
3. Asegurar que el componente esté visible antes de interactuar

## Si los selectores fallan:
1. Usar herramientas de desarrollo para verificar selectores
2. Comprobar que los valores de opciones coincidan exactamente
3. Verificar que no hay múltiples elementos con el mismo selector

## Para nuevas funcionalidades:
1. Agregar comandos personalizados en `cypress/support/commands.js`
2. Documentar en este archivo
3. Probar en modo interactivo antes de automatizar

---

**Nota**: Este framework de pruebas está optimizado para la aplicación Agenda Turnos 
con Ionic + Angular. Los comandos personalizados manejan las peculiaridades específicas 
de estos frameworks para garantizar pruebas estables y confiables.
