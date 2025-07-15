# 🌐 TRADUCCIÓN DE COMENTARIOS - AGENDA TURNOS

## 📋 Estado de Traducción

Este documento registra el progreso de traducción de comentarios en inglés a español en toda la aplicación Agenda Turnos.

### ✅ **ARCHIVOS COMPLETADOS**

#### `pages/cambiodeturno/cambiodeturno.page.ts`
- ✅ Estados principales del flujo de trabajo
- ✅ Trabajadores elegibles para cambio de turno
- ✅ Todos los trabajadores para selección inicial
- ✅ Solicitud actual de cambio de turno
- ✅ Estado de la interfaz de usuario
- ✅ Comentarios de métodos de pasos 1-5

#### `services/extra-shift.service.ts`
- ✅ Caché local para turnos extra
- ✅ Cargar turnos extra desde el backend al inicializar
- ✅ Comentarios de métodos de API
- ✅ Convertir strings de fecha a objetos Date

#### `pages/lista-funcionarios/lista-funcionarios.page.ts`
- ✅ Opciones para formularios
- ✅ Método para ordenar trabajadores por estado y luego por nombre
- ✅ Retorna orden por nombre si son del mismo estado

#### `services/shift-calculator.service.ts`
- ✅ Calcular el estado del turno para un trabajador en una fecha específica
- ✅ Parámetros @param y @returns en JSDoc

#### `cypress/e2e/spec.cy.js`
- ✅ Suite de pruebas E2E Cypress - Agenda Turnos

#### `services/trabajadores.service.ts`
- ✅ Obtener todos los trabajadores
- ✅ Crear un nuevo trabajador
- ✅ Actualizar un trabajador existente
- ✅ Eliminar un trabajador
- ✅ Obtener un trabajador específico por ID
- ✅ Método auxiliar para manejar errores HTTP

#### `services/shiftchange.service.ts`
- ✅ Todos los comentarios JSDoc de métodos principales
- ✅ Comentarios de lógica de negocio para cambios de turno
- ✅ Validaciones y verificaciones de conflictos
- ✅ Gestión de estados de trabajadores
- ✅ Seguimiento de cambios activos

#### `pages/registro/registro.page.ts`
- ✅ Logs de depuración

#### `pages/main/main.page.ts`
- ✅ Usuario actual como observable

#### `pages/busquedadia/busquedadia.page.ts`
- ✅ Métodos de navegación

#### `app.component.ts`
- ✅ Inicialización del servicio de tema

#### `api/controllers/trabajadores.js`
- ✅ Controladores CRUD para trabajadores

#### `api/controllers/extrashifts.js`
- ✅ Controladores CRUD para turnos extra

### 🔄 **ARCHIVOS PENDIENTES DE TRADUCCIÓN**

#### `services/shift-calculator.service.ts` (Continuar)
- ⏳ Para trabajadores volantes, no tienen horario fijo
- ⏳ Para turnos diurnos, considerar lógica de días laborables  
- ⏳ Para turnos rotativos
- ⏳ Calcular turno para trabajadores diurnos
- ⏳ Manejar días negativos
- ⏳ Verificar si el trabajador debería estar trabajando pero está ausente
- ⏳ Deben tener el mismo turno y nivel
- ⏳ Ambos deben estar disponibles para el cambio de turno
- ⏳ Uno debe estar programado, el otro debe estar libre
- ⏳ Verificar si el trabajador está de vacaciones o con licencia médica
- ⏳ Verificar si el trabajador está de extra

#### `pages/calendario-global/calendario-global.page.ts`
- ⏳ Ensure it's an empty array, not undefined
- ⏳ Fix date parsing to avoid timezone issues
- ⏳ Use local date construction to avoid timezone offset issues
- ⏳ month is 0-based
- ⏳ Check if we have workers loaded
- ⏳ Calcular turnos para todos los trabajadores
- ⏳ For now, skip extra shift logic to test basic functionality
- ⏳ Temporarily empty
- ⏳ Métodos de navegación del menú
- ⏳ Extra shift assignment methods
- ⏳ Check if worker is eligible for extra shifts using the service
- ⏳ First, let user select shift type
- ⏳ Now show the rest of the form with the selected type
- ⏳ Add the shift type to the data
- ⏳ Map 'dia'/'noche' to 'day'/'night'
- ⏳ Assign extra shift through service
- ⏳ Refresh the workers list to show updated state
- ⏳ Reload workers and recalculate for the selected date
- ⏳ Simulate date change to refresh the display
- ⏳ Use the service to check eligibility
- ⏳ Create buttons for each extra shift
- ⏳ Debug methods

#### `services/extra-shift.service.ts` (Continuar)
- ⏳ Delete extra shift via API
- ⏳ Get all extra shifts
- ⏳ Get extra shifts for a specific worker
- ⏳ Get extra shifts for a specific date
- ⏳ Workers who can work extra shifts (those not permanently unavailable)
- ⏳ Get workers available for extra shifts on a specific date
- ⏳ Assign extra shift to a worker
- ⏳ Check if worker can be assigned extra shift (only check base estado, not current date)
- ⏳ Check if worker already has an extra shift of this type on that date
- ⏳ Create extra shift record via API (DO NOT change worker estado)
- ⏳ Fix date to ensure no timezone issues
- ⏳ TODO: Get from current user session
- ⏳ Refresh extra shifts from backend
- ⏳ Update extra shift status
- ⏳ Update extra shift status via API
- ⏳ Remove extra shift
- ⏳ Get worker's effective estado for a specific date
- ⏳ Future: add medical leaves, vacations, etc.
- ⏳ Determine effective estado for this specific date
- ⏳ Future: Add other date-specific status checks here
- ⏳ Example: if (hasMedicalLeaveOnDate...)
- ⏳ Check if a worker is available for extra shifts
- ⏳ Workers who are not available for any assignments
- ⏳ Already has extra shift
- ⏳ Check if worker is eligible for extra shifts on a specific date
- ⏳ First filter by base eligibility
- ⏳ Then check date-specific availability
- ⏳ Combine all availability checks
- ⏳ Complete extra shift
- ⏳ Cancel extra shift

#### `services/trabajadores.service.ts`
- ⏳ Get all trabajadores
- ⏳ Create a new trabajador
- ⏳ Update an existing trabajador
- ⏳ Delete a trabajador
- ⏳ Get trabajador by ID
- ⏳ Handle HTTP errors

#### `services/shiftchange.service.ts`
- ⏳ Get current shift change request
- ⏳ Set current shift change request
- ⏳ Get eligible workers for shift change
- ⏳ Get worker monthly shifts
- ⏳ Validate shift change
- ⏳ Execute shift change
- ⏳ Get shift changes history
- ⏳ Cancel shift change

#### `services/theme.service.ts`
- ⏳ Initialize theme service
- ⏳ Get current theme
- ⏳ Set theme
- ⏳ Apply theme to DOM
- ⏳ Remove existing theme classes
- ⏳ Auto mode: respect system preference
- ⏳ Toggle theme
- ⏳ If auto, switch to light or dark based on current system preference
- ⏳ Check if dark mode is active
- ⏳ Auto mode: check system preference

#### `pages/preferencias/preferencias.page.ts`
- ⏳ Subscribe to theme changes
- ⏳ Load theme preference
- ⏳ Handle theme change
- ⏳ Navigation methods
- ⏳ Save current settings

#### `pages/registrofuncionario/registrofuncionario.page.ts`
- ⏳ Opciones para campos de selección
- ⏳ Por defecto 'activo'
- ⏳ Agregar campo nivel
- ⏳ Opcional
- ⏳ Log de depuración (múltiples instancias)
- ⏳ Convertir fechas al formato apropiado
- ⏳ Métodos de navegación del menú

#### `pages/main/main.page.ts`
- ⏳ current user como observable

#### `services/auth.service.ts`
- ⏳ Obtener todos los usuarios y buscar credenciales coincidentes
- ⏳ Verificar si el usuario ya existe

#### `components/extra-shift-modal/extra-shift-modal.component.ts`
- ⏳ Set date limits - from today to 6 months in the future
- ⏳ If we have a preselected date, use it
- ⏳ Default to tomorrow
- ⏳ Use the assignExtraShift method from the service

#### `components/shift-visualization-modal/shift-visualization-modal.component.ts`
- ⏳ Load extra shifts first
- ⏳ Then generate calendar data
- ⏳ Generate calendar anyway, just without extra shifts
- ⏳ Don't reject, just continue without extra shifts
- ⏳ Get the first day of the month and its day of week
- ⏳ 0 = Sunday, 1 = Monday, etc.
- ⏳ Add padding days from previous month if needed
- ⏳ Add all days of the current month
- ⏳ Add padding days from next month to complete the grid (42 days = 6 weeks)
- ⏳ Calculate regular shifts based on worker's schedule
- ⏳ Determine shift type and time based on worker's turno
- ⏳ Add extra shifts from pre-loaded data
- ⏳ Determine worker status based on their estado and date
- ⏳ Convert to Date objects if they are strings

#### `services/api.service.ts`
- ⏳ fake apiREST
- ⏳ estructura general
- ⏳ Múltiples comentarios de ejemplo de implementación

#### `app.component.ts`
- ⏳ Initialize theme service - this will apply saved theme or default

#### `pages/calendario-turnos/calendario-turnos.page.ts`
- ⏳ Navigation methods

#### `pages/busquedadia/busquedadia.page.ts`
- ⏳ Navigation methods

#### `services/auth.service.spec.ts`
- ⏳ Clear localStorage before each test
- ⏳ No existing users
- ⏳ First set a user
- ⏳ Then logout

#### `services/theme.service.spec.ts`
- ⏳ Clear localStorage before each test
- ⏳ Remove any theme classes from body

### 🎯 **ARCHIVOS CON COMENTARIOS IONIC/ANGULAR (NO TRADUCIR)**

#### `polyfills.ts`
- ❌ Learn more in https://angular.io/guide/browser-support
- ❌ (window as any).__Zone_disable_requestAnimationFrame = true; // disable patch requestAnimationFrame
- ❌ (window as any).__Zone_disable_on_property = true; // disable patch onProperty such as onclick
- ❌ (window as any).__zone_symbol__UNPATCHED_EVENTS = ['scroll', 'mousemove']; // disable patch specified eventNames
- ❌ import 'zone.js';  // Included with Angular CLI.

#### `environments/environment.ts`
- ❌ This file can be replaced during build by using the `fileReplacements` array.
- ❌ `ng build` replaces `environment.ts` with `environment.prod.ts`.
- ❌ The list of file replacements can be found in `angular.json`.
- ❌ import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

#### `test.ts`
- ❌ This file is required by karma.conf.js and loads recursively all the .spec and framework files
- ❌ First, initialize the Angular testing environment.

#### `zone-flags.ts`
- ❌ eslint-disable-next-line no-underscore-dangle

### 📝 **PATRONES DE TRADUCCIÓN ESTABLECIDOS**

#### Términos Técnicos Comunes:
- `Load` → `Cargar`
- `Get` → `Obtener`
- `Set` → `Establecer`
- `Check` → `Verificar`
- `Update` → `Actualizar`
- `Create` → `Crear`
- `Delete` → `Eliminar`
- `Calculate` → `Calcular`
- `Validate` → `Validar`
- `Execute` → `Ejecutar`
- `Handle` → `Manejar`
- `Initialize` → `Inicializar`
- `Apply` → `Aplicar`
- `Toggle` → `Alternar`
- `Convert` → `Convertir`
- `Fix` → `Corregir`
- `Ensure` → `Asegurar`
- `Refresh` → `Actualizar/Refrescar`

#### Contexto Específico:
- `Worker` → `Trabajador`
- `Shift` → `Turno`
- `Extra shift` → `Turno extra`
- `Shift change` → `Cambio de turno`
- `Schedule` → `Cronograma/Horario`
- `Available` → `Disponible`
- `Eligible` → `Elegible`
- `Backend` → `Backend` (se mantiene)
- `API` → `API` (se mantiene)
- `Cache` → `Caché`
- `Empty array` → `Arreglo vacío`
- `Date objects` → `Objetos Date`
- `Date strings` → `Strings de fecha`

### 🔧 **PRÓXIMOS PASOS**

1. **Prioridad Alta**: Completar servicios principales (`shift-calculator.service.ts`, `extra-shift.service.ts`)
2. **Prioridad Media**: Páginas principales (`calendario-global.page.ts`, `preferencias.page.ts`)
3. **Prioridad Baja**: Componentes auxiliares y archivos de prueba

### 📊 **ESTADÍSTICAS**

- **Total estimado de comentarios**: ~350-400
- **Comentarios traducidos**: ~25
- **Progreso**: ~6%
- **Archivos completados**: 4/30
- **Archivos parcialmente completados**: 4/30

---

*Última actualización: 14 de Enero, 2025*
