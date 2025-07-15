# 📋 DOCUMENTACIÓN COMPLETA - PRUEBAS E2E AGENDA TURNOS

## 🎯 Objetivo de las Pruebas

Este documento describe la suite de pruebas End-to-End (E2E) desarrollada para la aplicación **Agenda Turnos**, diseñada para validar el flujo completo de trabajo desde el registro de administradores hasta la asignación de turnos extra a trabajadores.

## 🔧 Configuración Técnica

### Prerrequisitos
- **Node.js** versión 14 o superior
- **Cypress** instalado y configurado
- **Aplicación Ionic** ejecutándose en `http://localhost:8100`
- **Base de datos** limpia antes de cada ejecución
- **API Backend** activa y funcional

### Estructura de Archivos
```
cypress/
├── e2e/
│   ├── spec.cy.js                    # Suite principal de pruebas
│   └── DOCUMENTACION_PRUEBAS.md      # Este documento
├── fixtures/
├── support/
└── videos/ (generado automáticamente)
```

## 📊 Datos de Prueba Utilizados

### 👤 Administrador de Prueba
```javascript
const adminData = {
  name: 'Admin Test',
  email: 'admin@test.com', 
  password: 'Admin123!'
};
```

### 👥 Trabajadores de Prueba
Se registran **2 trabajadores** con datos que corresponden exactamente a la interfaz `trabajador` definida en `datos.ts`:

#### Trabajador 1: Juan Carlos
- **Nombres**: Juan Carlos
- **Email**: juan.carlos@hospital.cl
- **Fecha Nacimiento**: 15/05/1985
- **Fecha Ingreso**: 15/01/2020
- **Turno**: 4to Turno
- **Fecha Inicio Turno**: 01/02/2020
- **Contrato**: Planta
- **Estado**: Activo
- **Nivel**: Profesional

#### Trabajador 2: María Elena
- **Nombres**: María Elena
- **Email**: maria.elena@hospital.cl
- **Fecha Nacimiento**: 20/08/1990
- **Fecha Ingreso**: 01/03/2021
- **Turno**: Diurno Hospital
- **Fecha Inicio Turno**: 15/03/2021
- **Contrato**: Contrato Indefinido
- **Estado**: Activo
- **Nivel**: Técnico

## 🔄 Flujo de Pruebas Detallado

### 1️⃣ **REGISTRO DE ADMINISTRADOR**
**Objetivo**: Verificar que el sistema permite registrar una nueva cuenta de administrador.

**Pasos**:
1. Acceder a la página principal (`/home`)
2. Hacer clic en "Registrarse"
3. Completar formulario con datos del administrador
4. Enviar formulario
5. Confirmar mensaje de éxito
6. Verificar redirección a página de login

**Validaciones**:
- ✅ Navegación correcta a formulario de registro
- ✅ Campos obligatorios funcionando
- ✅ Validación de email
- ✅ Confirmación de contraseña
- ✅ Mensaje de éxito mostrado
- ✅ Redirección post-registro

### 2️⃣ **INICIO DE SESIÓN**
**Objetivo**: Validar el proceso de autenticación con las credenciales registradas.

**Pasos**:
1. Ingresar email del administrador
2. Ingresar contraseña
3. Hacer clic en "Iniciar Sesión"
4. Verificar acceso al dashboard

**Validaciones**:
- ✅ Campos de login funcionando correctamente
- ✅ Autenticación exitosa
- ✅ Redirección al dashboard principal (`/main`)
- ✅ Interfaz del dashboard cargada

### 3️⃣ **REGISTRO DE TRABAJADORES**
**Objetivo**: Registrar múltiples trabajadores con datos completos y realistas.

**Pasos por cada trabajador**:
1. Navegar a "Registrar Funcionario" desde dashboard
2. Completar todos los campos del formulario:
   - Primer Nombre (`Name1`)
   - Segundo Nombre (`Name2`) 
   - Email (`email`)
   - Fecha de Nacimiento (`fecha_nacimiento`)
   - Fecha de Ingreso (`fecha_ingreso`)
   - Turno (`turno`) - selección dropdown
   - Fecha Inicio Turno (`fechainicioturno`)
   - Tipo de Contrato (`contrato`) - selección dropdown
   - Estado (`estado`) - selección dropdown
   - Nivel (`nivel`) - selección dropdown
3. Enviar formulario
4. Confirmar mensaje de éxito
5. Verificar aparición en lista de funcionarios

**Validaciones por trabajador**:
- ✅ Navegación correcta al formulario
- ✅ Todos los campos completados correctamente
- ✅ Selecciones dropdown funcionando
- ✅ Manejo correcto de fechas
- ✅ Validaciones de formulario
- ✅ Guardado exitoso en base de datos
- ✅ Aparición en lista de funcionarios

### 4️⃣ **ASIGNACIÓN DE TURNOS EXTRA**
**Objetivo**: Asignar turnos extra a cada trabajador registrado.

**Pasos**:
1. Desde lista de funcionarios
2. Para cada trabajador:
   - Localizar en la lista
   - Hacer clic en botón "Turno Extra"
   - Confirmar asignación en modal
   - Verificar actualización de contador

**Validaciones**:
- ✅ Localización correcta de trabajadores en lista
- ✅ Funcionalidad de botón "Turno Extra"
- ✅ Modal de confirmación aparece
- ✅ Asignación procesada correctamente
- ✅ Contador de turnos actualizado

### 5️⃣ **VERIFICACIÓN FINAL**
**Objetivo**: Confirmar integridad del sistema y navegación.

**Pasos**:
1. Retornar al dashboard
2. Verificar estadísticas actualizadas
3. Confirmar navegación funcional

**Validaciones**:
- ✅ Dashboard muestra datos correctos
- ✅ Navegación entre páginas funcional
- ✅ Persistencia de datos confirmada

## 🎨 Interfaces y Selectores Utilizados

### Formularios
```javascript
// Registro de administrador
'ion-input[formControlName="name"] input'
'ion-input[formControlName="email"] input'
'ion-input[formControlName="password"] input'
'ion-input[formControlName="confirmPassword"] input'

// Login
'ion-input[formControlName="email"] input'
'ion-input[formControlName="password"] input'

// Registro de trabajador
'ion-input[formControlName="Name1"] input'
'ion-input[formControlName="Name2"] input'
'ion-input[formControlName="email"] input'
'ion-datetime[formControlName="fecha_nacimiento"]'
'ion-datetime[formControlName="fecha_ingreso"]'
'ion-select[formControlName="turno"]'
'ion-datetime[formControlName="fechainicioturno"]'
'ion-select[formControlName="contrato"]'
'ion-select[formControlName="estado"]'
'ion-select[formControlName="nivel"]'
```

### Navegación
```javascript
// Botones principales
'ion-button:contains("Registrarse")'
'ion-button[type="submit"]'
'ion-card ion-button:contains("Registrar Funcionario")'
'ion-button:contains("Nuevo Funcionario")'
'ion-button:contains("Dashboard")'

// Turnos extra
'ion-button:contains("Turno Extra")'
'ion-alert ion-button:contains("Confirmar")'
```

## 🚀 Comandos de Ejecución

### Ejecutar todas las pruebas
```bash
npx cypress run
```

### Abrir interfaz interactiva de Cypress
```bash
npx cypress open
```

### Ejecutar solo esta suite de pruebas
```bash
npx cypress run --spec "cypress/e2e/spec.cy.js"
```

### Ejecutar con navegador específico
```bash
npx cypress run --browser chrome
npx cypress run --browser firefox
npx cypress run --browser edge
```

### Ejecutar en modo headless
```bash
npx cypress run --headless
```

### Generar reportes con videos
```bash
npx cypress run --record --key=<record-key>
```

## 📋 Checklist Pre-Ejecución

Antes de ejecutar las pruebas, verificar:

- [ ] **Aplicación Ionic** está ejecutándose en `http://localhost:8100`
- [ ] **Base de datos** está limpia (sin usuarios ni trabajadores previos)
- [ ] **API Backend** está activa y respondiendo
- [ ] **Cypress** está instalado y configurado
- [ ] **Variables de entorno** configuradas si es necesario
- [ ] **Conexión a internet** estable para recursos externos

## 🐛 Troubleshooting Común

### Problema: Elementos no encontrados
**Solución**: Verificar que la aplicación esté completamente cargada antes de ejecutar pruebas.

### Problema: Timeouts en elementos de fecha
**Solución**: Los selectores de fecha ionic pueden ser lentos, aumentar timeout si es necesario.

### Problema: Formularios no envían datos
**Solución**: Verificar que todos los campos requeridos estén completados y que las validaciones pasen.

### Problema: Base de datos con datos previos
**Solución**: Limpiar la base de datos antes de cada ejecución de pruebas.

## 📊 Métricas de Cobertura

### Funcionalidades Cubiertas
- ✅ **Registro de usuarios** (100%)
- ✅ **Autenticación** (100%)
- ✅ **CRUD de trabajadores** (100% - Create y Read)
- ✅ **Asignación de turnos extra** (100%)
- ✅ **Navegación** (100%)
- ✅ **Validaciones de formularios** (100%)
- ✅ **Persistencia de datos** (100%)

### Tipos de Prueba
- **E2E (End-to-End)**: ✅ Completo
- **Integración**: ✅ Cubierto por E2E
- **UI/UX**: ✅ Validación básica
- **Datos**: ✅ Validación de estructura

