# Sistema de Gestión de Turnos Hospitalarios


##  Arquitectura del Sistema

### **Frontend**
- **Framework**: Ionic 7 + Angular
- **Lenguaje**: TypeScript
- **Estilos**: SCSS + Variables CSS de Ionic
- **Componentes**: Ionic Components (Cards, Lists, Forms, etc.)

### **Backend**
- **Base de Datos**: PostgreSQL
- **API**: REST API (Node.js)


## Estructura del Proyecto

```
src/
├── app/
│   ├── home/                    # Página de login
│   ├── pages/
│   │   ├── main/               # Página principal/dashboard
│   │   ├── registro/           # Registro de usuarios del sistema
│   │   ├── registrofuncionario/ # Registro de funcionarios/trabajadores
│   │   ├── lista-funcionarios/ # Lista y edición de funcionarios
│   │   ├── calendario-global/  # Visualización de turnos por fecha
│   │   ├── calendario-turnos/  # Calendario mensual de turnos
│   │   ├── busquedadia/        # Búsqueda por día específico
│   │   ├── cambiodeturno/      # Gestión de cambios de turno
│   │   ├── eliminacion/        # Eliminación de funcionarios (deprecada)
│   │   └── preferencias/       # Configuraciones del usuario
│   ├── components/
│   │   └── shift-visualization-modal/ # Modal para visualizar y gestionar turnos
│   └── services/
│       ├── auth.service.ts     # Autenticación de usuarios
│       ├── datos.ts           # Interfaces y tipos de datos
│       ├── trabajadores.service.ts # CRUD de trabajadores
│       ├── shift-calculator.service.ts # Cálculo de turnos
│       ├── extra-shift.service.ts # Gestión de turnos extra
│       ├── postgres-*.service.ts # Servicios de base de datos
│       └── route.guard.service.ts # Protección de rutas
├── api/                        # Backend Node.js/Express
│   ├── controllers/           # Controladores de API
│   ├── models/               # Modelos de base de datos
│   ├── routes/               # Definición de rutas
│   └── util/                 # Utilidades (database.js)
└── cypress/                   # Pruebas E2E
    └── e2e/                  # Tests automatizados
```migrado de SQlite, aún hay páginas deprecadas y de contenido roto por limpiar

## 👥 Gestión de Usuarios y Trabajadores

### **Tipos de Usuario**
1. **Usuarios del Sistema**: Administradores que pueden gestionar el sistema
2. **Trabajadores/Funcionarios**: Personal del hospital con turnos asignados

### **Datos de Trabajadores**
- **Información Personal**: Nombres, email, fecha de nacimiento, fecha de ingreso
- **Información Laboral**: Tipo de turno, fecha de inicio de turno, tipo de contrato
- **Estado**: activo, vacaciones, licencia médica, suspendido, inactivo
- **Nivel**: auxiliar, manipulador(manipulador de alimentos según especificación de cliente), profesional, técnico
- **Avatar**: URL de imagen (opcional y no implementado aún)

##  Sistema de Turnos

### **Tipos de Turno Implementados**

#### **1. Turnos Rotativos (12 horas)**
- **4to_turno_modificado**: Ciclo de 4 días (trabaja 2, libre 2)
- **3er_turno**: Ciclo de 6 días (día, día, noche, noche, libre, libre)
- **4to_turno**: Ciclo de 4 días (día, noche, libre, libre)

#### **2. Turnos Diurnos (8 horas)**
- **diurno_hospital**: Lunes a Viernes, 8:00 AM - 5:00 PM
- **diurno_empresa**: Lunes a Viernes, 8:00 AM - 5:00 PM

#### **3. Turno Especial**
- **volante**: Sin horario fijo, asignación manual. Los trabajadores volantes pueden recibir turnos extra y aparecerán en el calendario según los turnos asignados.

### **Cálculo de Turnos**
El sistema utiliza el servicio `ShiftCalculatorService` que:
- Calcula automáticamente si un trabajador debe estar en turno en una fecha específica
- Considera la fecha de inicio del turno (`fechainicioturno`)
- Aplica el patrón de turnos correspondiente
- Detecta ausencias (vacaciones, licencias médicas)
- Integra turnos extra en la visualización del calendario

### ** Sistema de Turnos Extra**
Funcionalidad completa para gestión de turnos adicionales:

#### **Características**
- **Asignación Flexible**: Turnos de día o noche con duración personalizable (1-24 horas)
- **Elegibilidad Automática**: Solo trabajadores activos, inactivos o volantes pueden recibir turnos extra
- **Prevención de Duplicados**: No permite asignar el mismo tipo de turno extra (día/noche) en la misma fecha
- **Gestión de Fechas**: Sistema robusto que evita problemas de zona horaria
- **Estados**: programado, completado, cancelado

#### **Flujo de Trabajo**
1. **Asignación**: Desde lista de funcionarios o calendario global
2. **Visualización**: Los trabajadores con turnos extra aparecen automáticamente en "Funcionarios en Turno"
3. **Detalles**: Modal dedicado para ver todos los turnos extra de un trabajador
4. **Eliminación**: Eliminación física desde el modal con confirmación

- Funcionalidad pendiente: Cambios de turno, permisos administrativos, registros retroactivos de permisos y licencias médicas.

##  Funcionalidades Principales

### **1. Autenticación**
- Login con email y contraseña (o nombre de usuario)
- Registro de nuevos usuarios del sistema
- Validación de formularios
- Gestión de sesiones

### **2. Gestión de Funcionarios**
- **Registro**: Formulario completo para agregar nuevos trabajadores
- **Lista**: Visualización de todos los funcionarios con filtros y búsqueda
- **Edición**: Modificación de datos existentes mediante modal
- **Eliminación**: Remoción de funcionarios del sistema (Aún por revisar. Lo ideal es inactivar a un funcionario a un menú, pero dar la posibilidad a administradores ede eliminar los registros de uno)
- **Estados**: Gestión de estados (activo, vacaciones, licencia, etc.)

### **3. Calendario Global de Turnos**
- **Selección de Fecha**: DatePicker para elegir fecha a consultar
- **Visualización Automática**: Los resultados se muestran al seleccionar fecha
- **Cuatro Categorías de Trabajadores**:
  - **En Turno**: Funcionarios programados y presentes (incluye turnos extra)
  - **Ausentes**: Funcionarios que deberían trabajar pero están ausentes
  - **Libres**: Funcionarios sin turno asignado para esa fecha
  - **Turnos Extra**: Trabajadores con turnos adicionales (integrados en "En Turno")
- **Resumen Estadístico**: Contadores por categoría con visualización mejorada
- **Información Detallada**: Nombre, turno, nivel, estado de cada trabajador
- **Acciones Integradas**: Botones para asignar turnos extra y visualizar turnos existentes

### **4. Gestión de Turnos Extra**
- **Asignación Rápida**: Desde cualquier lista de trabajadores
- **Modal de Visualización**: Vista completa de turnos extra por trabajador
- **Eliminación Segura**: Confirmación y eliminación física de turnos
- **Integración Completa**: Los turnos extra aparecen automáticamente en el calendario
- **Validaciones**: Prevención de duplicados y validación de elegibilidad

### **5. Modal de Visualización de Turnos**
- **Calendario Interactivo**: Vista mensual con turnos regulares y extra
- **Gestión de Turnos Extra**: Visualización, eliminación con confirmación
- **Estados Visuales**: Diferenciación clara entre tipos de turno
- **Información Detallada**: Horas, tipo, detalles de cada turno extra

## 🔧 Servicios Implementados

### **AuthService**
- Autenticación de usuarios
- Registro de nuevos usuarios
- Gestión de sesiones locales

### **TrabajadoresService**
- CRUD completo de trabajadores
- Comunicación con API PostgreSQL
- Validaciones de datos

### **ShiftCalculatorService**
- **Patrones de Turno**: Definición de ciclos de trabajo
- **Cálculo de Estados**: Determina si un trabajador está en turno, libre o ausente
- **Gestión de Ausencias**: Detecta vacaciones y licencias médicas
- **Interfaz de Resultados**: Proporciona información estructurada sobre turnos

### **ExtraShiftService** 
- **Gestión Completa**: CRUD de turnos extra
- **Validaciones**: Elegibilidad y prevención de duplicados
- **Integración API**: Comunicación con backend PostgreSQL
- **Cache Local**: Gestión eficiente de estado con BehaviorSubject
- **Manejo de Fechas**: Sistema robusto para evitar problemas de zona horaria
- **Estados**: Control de turnos programados, completados y cancelados

### **RouteGuardService**
- Protección de rutas autenticadas
- Redirección automática al login
- Validación de sesiones

##  Interfaz de Usuario

### **Diseño**
- **Tema**: Material Design con colores diferenciados por estado
- **Adaptable**: Responsive para móviles, tablets y desktop
- **Componentes Ionic**: Cards, Lists, Forms, Buttons, Icons, Modals
- **Estados Visuales**: 
  - **Verde claro**: Funcionarios en turno
  - **Amarillo claro**: Funcionarios ausentes
  - **Gris oscuro**: Funcionarios libres (texto blanco para legibilidad)
- **Animaciones**: Transiciones suaves y efectos hover
- **Botones Mejorados**: Gradientes, sombras y efectos visuales

### **Navegación**
- **Menú Lateral**: Acceso rápido a todas las funcionalidades
- **Navegación Protegida**: RouteGuard para rutas autenticadas
- **Breadcrumbs**: Navegación contextual en formularios

### **Experiencia de Usuario**
- **Feedback Visual**: Loading states, confirmaciones, alertas de éxito/error
- **Validaciones en Tiempo Real**: Formularios con validación instantánea
- **Modales Informativos**: Detalles completos sin cambiar de página
- **Acciones Contextuales**: Botones específicos según el estado del trabajador

##  Base de Datos

### **PostgreSQL**
- **ORM**: Sequelize para Node.js
- **Driver**: pg (node-postgres) v8.16.3
- **Containerización**: Docker Compose disponible
- **Tablas**: Users, Trabajadores, ExtraShifts
- **Migración**: Desde SQLite a PostgreSQL completada

## 📚 Librerías y Dependencias

### **Frontend (Ionic/Angular)**

#### **Core Framework**
- **@ionic/angular**: ^8.0.0 - Framework principal Ionic
- **@angular/core**: ^19.0.0 - Framework Angular
- **@angular/common**: ^19.0.0 - Módulos comunes de Angular
- **@angular/forms**: ^19.0.0 - Formularios reactivos y template-driven
- **@angular/router**: ^19.0.0 - Sistema de enrutamiento
- **@angular/animations**: ^19.0.0 - Sistema de animaciones

#### **Capacitor (Híbrido Móvil)**
- **@capacitor/core**: ^7.4.0 - Core de Capacitor
- **@capacitor/android**: 7.3.0 - Plataforma Android
- **@capacitor/app**: 7.0.1 - APIs de aplicación
- **@capacitor/haptics**: 7.0.1 - Vibración y feedback táctil
- **@capacitor/keyboard**: 7.0.1 - Control del teclado
- **@capacitor/status-bar**: 7.0.1 - Barra de estado

#### **Almacenamiento y Base de Datos**
- **@ionic/storage-angular**: ^4.0.0 - Sistema de almacenamiento local
- **@capacitor-community/sqlite**: ^7.0.0 - SQLite para Capacitor (deprecado)
- **pg**: ^8.16.3 - Cliente PostgreSQL para conexión directa
- **@types/pg**: ^8.15.4 - Tipos TypeScript para PostgreSQL

#### **Programación Reactiva**
- **rxjs**: ~7.8.0 - Observables y programación reactiva

#### **Iconografía y UI**
- **ionicons**: ^7.0.0 - Librería de iconos de Ionic

#### **Herramientas de Desarrollo**
- **@angular/cli**: 19.2.14 - CLI de Angular
- **@ionic/angular-toolkit**: ^12.0.0 - Herramientas específicas de Ionic
- **typescript**: ~5.6.3 - Lenguaje TypeScript

#### **Testing**
- **jasmine-core**: ~5.1.0 - Framework de testing
- **karma**: ~6.4.0 - Test runner
- **@types/jasmine**: ~5.1.0 - Tipos TypeScript para Jasmine

#### **Linting y Calidad de Código**
- **eslint**: ^9.16.0 - Linter para JavaScript/TypeScript
- **@angular-eslint/eslint-plugin**: ^19.0.0 - Reglas ESLint específicas de Angular
- **@typescript-eslint/eslint-plugin**: ^8.18.0 - Reglas ESLint para TypeScript

### **Backend (Node.js/Express)**

#### **Framework Web**
- **express**: ^4.18.2 - Framework web para Node.js
- **cors**: ^2.8.5 - Middleware para Cross-Origin Resource Sharing
- **body-parser**: ^2.2.0 - Middleware para parsing de request body

#### **Base de Datos**
- **sequelize**: ^6.28.0 - ORM para Node.js
- **pg**: ^8.9.0 - Driver PostgreSQL
- **postgres**: ^3.3.3 - Cliente PostgreSQL alternativo

#### **Configuración**
- **dotenv**: ^17.0.0 - Manejo de variables de entorno

### **Testing E2E**
- **Cypress**: Framework completo de testing end-to-end
- **Pruebas implementadas**: Login, registro de funcionarios, gestión de turnos

##  Componentes Ionic Utilizados

### **Navegación y Estructura**
- **ion-header/ion-toolbar**: Encabezados de página
- **ion-content**: Contenedor principal de contenido
- **ion-menu**: Menú lateral de navegación
- **ion-menu-button**: Botón de menú hamburguesa
- **ion-buttons**: Contenedor de botones en toolbar
- **ion-back-button**: Botón de navegación hacia atrás

### **Formularios y Entrada de Datos**
- **ion-item**: Elementos de lista y formulario
- **ion-label**: Etiquetas de formulario
- **ion-input**: Campos de entrada de texto
- **ion-textarea**: Área de texto multilínea
- **ion-select/ion-select-option**: Selectores dropdown
- **ion-datetime**: Selector de fecha y hora
- **ion-checkbox**: Casillas de verificación
- **ion-toggle**: Interruptores on/off

### **Visualización de Datos**
- **ion-card**: Tarjetas de contenido
- **ion-card-header/ion-card-title/ion-card-subtitle**: Encabezados de tarjeta
- **ion-card-content**: Contenido de tarjeta
- **ion-list**: Listas de elementos
- **ion-avatar**: Avatares circulares
- **ion-badge**: Insignias y etiquetas
- **ion-chip**: Chips informativos

### **Interacción y Navegación**
- **ion-button**: Botones de acción
- **ion-icon**: Iconos (usando ionicons)
- **ion-modal**: Modales y popups
- **ion-alert**: Alertas y confirmaciones
- **ion-toast**: Notificaciones toast
- **ion-loading**: Indicadores de carga

### **Layout y Organización**
- **ion-grid/ion-row/ion-col**: Sistema de grillas responsive
- **ion-toolbar**: Barras de herramientas
- **ion-title**: Títulos de página
- **ion-spinner**: Indicadores de carga animados

### **Componentes Personalizados**
- **ExtraShiftModalComponent**: Modal para asignación de turnos extra
- **ShiftVisualizationModalComponent**: Modal para visualización de calendario de turnos

##  Sistema de Estilos

### **Variables CSS Personalizadas**
- **--app-color-blue-1/2/3**: Paleta de colores azules
- **--app-color-grey-1/2**: Colores grises para diferentes estados
- **--app-spacing-xs/sm**: Sistema de espaciado consistente
- **--app-border-radius-sm**: Bordes redondeados

### **Clases SCSS Globales**
- **SCSS Modules**: Cada página tiene su archivo .scss dedicado
- **Variables globales**: Definidas en `src/theme/variables.scss`
- **Estilos responsivos**: Media queries para diferentes tamaños de pantalla 


##  Seguridad

- **Validación de Formularios**: Validaciones en frontend y backend
- **Autenticación**: Sistema de login obligatorio
- **Gestión de Estados**: Control de acceso por roles (ROUTEGUARD)

##  Compatibilidad

- **Plataformas**: iOS, Android, Web
- **Navegadores**: PC por probar, chrome probado y firefox
- **Responsividad**: Móviles, tablets, desktop

##  Estado Actual del Desarrollo

### ** Completado**
- [x] Sistema de autenticación completo
- [x] CRUD de trabajadores/funcionarios
- [x] Cálculo automático de turnos
- [x] Calendario global de turnos
- [x] **Sistema completo de turnos extra**
- [x] **Modal de visualización y gestión de turnos**
- [x] **Integración trabajadores volantes**
- [x] **Eliminación física de turnos extra**
- [x] **Manejo de zona horaria**
- [x] Interfaz de usuario responsive con mejoras visuales
- [x] Integración con PostgreSQL
- [x] Gestión de estados de trabajadores
- [x] **Pruebas E2E con Cypress**
- [x] **API REST completa (Node.js/Express)**
- [x] **RouteGuard para protección de rutas**
- [x] Documentación completa en español

### ** En Desarrollo**
- [ ] Sistema de notificaciones
- [ ] Reportes y estadísticas avanzadas
- [ ] Gestión de cambios de turno
- [ ] Módulo de vacaciones y licencias retroactivas
- [ ] Permisos administrativos
- [ ] **Mejoras de UI/UX adicionales**
- [ ] **Tests unitarios (Jest)**

### **📋 Pendiente**
- [ ] API de integración externa
- [ ] Módulo de reportes PDF
- [ ] Dashboard administrativo avanzado
- [ ] Sistema de backup automático
- [ ] Notificaciones push
- [ ] Modo offline
- [ ] **Optimización de rendimiento**
- [ ] **Internacionalización (i18n)**


### ** Optimizaciones Implementadas**
- [x] **Cache local para turnos extra**: BehaviorSubject para gestión eficiente de estado
- [x] **Validaciones de duplicados**: Prevención de turnos extra duplicados
- [x] **Feedback visual inmediato**: Loading states y confirmaciones
- [x] **Manejo de errores robusto**: Try-catch y mensajes de error claros
- [x] **Responsive design mejorado**: Adaptación a móviles y tablets

## Pruebas Automatizadas

### **Cypress E2E Testing**
Suite completa de pruebas end-to-end implementada:

#### **Pruebas Implementadas**
1. **01-login.cy.js**: Autenticación de usuarios
2. **02-registro-funcionarios.cy.js**: Registro de nuevos trabajadores
3. **03-lista-funcionarios.cy.js**: Gestión y visualización de trabajadores
4. **04-turnos-extra.cy.js**: Asignación y gestión de turnos extra



##  Backend API

### **Node.js/Express Server**
- **Puerto**: 3000
- **Base de Datos**: PostgreSQL con Sequelize ORM
- **CORS**: Configurado para desarrollo local
- **Containerización**: Docker Compose disponible


```
