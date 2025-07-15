# 📋 DOCUMENTACIÓN DE PRUEBAS E2E - AGENDA TURNOS

## 🎯 Propósito

Esta documentación describe la suite completa de pruebas end-to-end (E2E) para la aplicación Agenda Turnos, diseñada para verificar el funcionamiento integral del sistema desde la perspectiva del usuario final.

## 🚀 Inicio Rápido

### Prerrequisitos

1. **Aplicación en ejecución**:
   ```bash
   cd agenda_turnos
   ionic serve
   # La aplicación debe estar disponible en http://localhost:8100
   ```

2. **Base de datos limpia**: Asegúrese de que la base de datos esté vacía antes de ejecutar las pruebas.

3. **Servidor backend activo**: El API debe estar funcionando correctamente.

### Ejecutar las Pruebas

```bash
# Ejecutar todas las pruebas en modo headless
npx cypress run

# Abrir la interfaz interactiva de Cypress
npx cypress open

# Ejecutar solo la suite principal
npx cypress run --spec "cypress/e2e/spec.cy.js"

# Ejecutar con navegador específico
npx cypress run --browser chrome
```

## 📊 Cobertura de Funcionalidades

### ✅ Funcionalidades Probadas

| Módulo | Funcionalidad | Estado | Descripción |
|--------|---------------|--------|-------------|
| **Autenticación** | Registro de administrador | ✅ | Creación de cuenta con validaciones |
| **Autenticación** | Inicio de sesión | ✅ | Login con credenciales válidas |
| **Gestión de Personal** | Registro de funcionarios | ✅ | CRUD completo con validaciones |
| **Gestión de Turnos** | Asignación de turnos extra | ✅ | Asignación múltiple con verificaciones |
| **Navegación** | Rutas protegidas | ✅ | Verificación de guard de rutas |
| **UI/UX** | Formularios reactivos | ✅ | Validaciones client-side |
| **Persistencia** | Almacenamiento de datos | ✅ | Verificación de integridad |

## 🧪 Estructura de las Pruebas

### 🔬 Prueba 1: Registro de Administrador
**Objetivo**: Verificar el proceso completo de registro de una nueva cuenta de administrador.

**Pasos**:
1. Navegar a página de registro
2. Completar formulario con datos válidos
3. Enviar formulario
4. Verificar mensaje de éxito
5. Confirmar redirección a login

**Datos de Prueba**:
```javascript
{
  name: 'Administrador Test',
  email: 'admin.test@hospital.cl',
  password: 'AdminPass123!'
}
```

### 🔑 Prueba 2: Inicio de Sesión
**Objetivo**: Verificar el proceso de autenticación.

**Pasos**:
1. Ingresar credenciales del administrador
2. Enviar formulario de login
3. Verificar redirección al dashboard
4. Confirmar acceso a funciones protegidas

### 👥 Prueba 3: Registro de Funcionarios
**Objetivo**: Registrar múltiples funcionarios con datos completos.

**Cantidad**: 5 funcionarios
**Campos verificados**: Todos los campos obligatorios y opcionales

**Funcionarios de Prueba**:

| # | Nombre | Profesión | Unidad | RUN |
|---|--------|-----------|--------|-----|
| 1 | María José González | Enfermera | UCI | 12345678-9 |
| 2 | Carlos Alberto Martínez | Médico | Cardiología | 11223344-5 |
| 3 | Ana Sofía López | Técnico en Enfermería | Pediatría | 33445566-7 |
| 4 | Pedro Manuel Fernández | Paramédico | Urgencias | 55667788-9 |
| 5 | Isabella Carmen Vargas | Kinesióloga | Rehabilitación | 77889900-1 |

### ⏰ Prueba 4: Asignación de Turnos Extra
**Objetivo**: Asignar turnos extra a los funcionarios registrados.

**Configuración de Turnos**:
- María González: 2 turnos extra
- Carlos Martínez: 3 turnos extra
- Ana López: 1 turno extra
- Pedro Fernández: 4 turnos extra
- Isabella Vargas: 2 turnos extra

**Total**: 12 turnos extra distribuidos

### 🔍 Prueba 5: Verificación Integral
**Objetivo**: Verificar la integridad completa del sistema.

**Verificaciones**:
- Estadísticas del dashboard
- Lista completa de funcionarios
- Navegación entre módulos
- Persistencia de datos
- Funcionalidad de todos los botones

## 📁 Datos de Prueba Detallados

### 👤 Administrador de Prueba
```javascript
const adminData = {
  name: 'Administrador Test',
  email: 'admin.test@hospital.cl',
  password: 'AdminPass123!'
};
```

### 👥 Funcionarios de Prueba

#### Funcionario 1: María José González
```javascript
{
  Name1: 'María',
  Name2: 'José',
  LastName1: 'González',
  LastName2: 'Rodríguez',
  Run: '12345678-9',
  Email: 'maria.gonzalez@hospital.cl',
  Telefono: '+56912345678',
  FechaNacimiento: '1985-06-15',
  Direccion: 'Av. Providencia 1234, Santiago',
  EstadoCivil: 'Soltero/a',
  Profesion: 'Enfermera',
  Especialidad: 'Medicina Interna',
  FechaIngreso: '2020-03-01',
  Cargo: 'Enfermera Jefe',
  Unidad: 'UCI',
  turnosPorSemana: 3
}
```

#### Funcionario 2: Carlos Alberto Martínez
```javascript
{
  Name1: 'Carlos',
  Name2: 'Alberto',
  LastName1: 'Martínez',
  LastName2: 'Silva',
  Run: '11223344-5',
  Email: 'carlos.martinez@hospital.cl',
  Telefono: '+56987654321',
  FechaNacimiento: '1978-11-23',
  Direccion: 'Calle San Martín 567, Las Condes',
  EstadoCivil: 'Casado/a',
  Profesion: 'Médico',
  Especialidad: 'Cardiología',
  FechaIngreso: '2018-08-15',
  Cargo: 'Médico Especialista',
  Unidad: 'Cardiología',
  turnosPorSemana: 4
}
```

*(Se incluyen los 5 funcionarios completos en el archivo de pruebas)*

## 🛠 Funciones de Utilidad

### `waitForElement(selector, timeout)`
Espera a que un elemento esté visible y listo para interactuar.

### `completarFormularioFuncionario(funcionario)`
Completa un formulario de funcionario con validaciones automáticas.

### `asignarTurnosExtra(funcionarioIndex, cantidadTurnos)`
Asigna una cantidad específica de turnos extra a un funcionario.

## 📈 Métricas de Rendimiento

### Tiempos Esperados
- **Registro de administrador**: ~10 segundos
- **Inicio de sesión**: ~5 segundos
- **Registro de funcionario**: ~15 segundos cada uno
- **Asignación de turno extra**: ~3 segundos cada uno
- **Suite completa**: ~5-8 minutos

### Criterios de Éxito
- ✅ Todas las pruebas pasan sin errores
- ✅ No hay timeouts ni fallos de carga
- ✅ Todos los datos se persisten correctamente
- ✅ La navegación funciona sin problemas
- ✅ Las validaciones funcionan como se espera

## 🚨 Solución de Problemas

### Problemas Comunes

1. **Error de conexión**:
   - Verificar que la aplicación esté ejecutándose en http://localhost:8100
   - Confirmar que el servidor backend esté activo

2. **Elementos no encontrados**:
   - Los selectores pueden haber cambiado
   - Verificar que la aplicación haya cargado completamente

3. **Timeouts**:
   - Aumentar los tiempos de espera en las configuraciones
   - Verificar el rendimiento de la base de datos

4. **Datos duplicados**:
   - Asegurar que la base de datos esté limpia antes de cada ejecución
   - Usar datos únicos para cada ejecución

### Configuración de Debug

```javascript
// En cypress.config.js
module.exports = defineConfig({
  e2e: {
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    responseTimeout: 30000,
    video: true,
    screenshot: true,
    setupNodeEvents(on, config) {
      // Configuraciones adicionales de debug
    },
  },
});
```

## 📝 Logging y Reportes

### Estructura de Logs
Cada prueba incluye logs detallados con emojis para facilitar la lectura:

```
🚀 Iniciando nueva prueba E2E
📍 PASO 1: Navegando a la página de registro
✅ Navegación exitosa a página de registro
📍 PASO 2: Completando formulario de registro
🎉 REGISTRO DE ADMINISTRADOR COMPLETADO EXITOSAMENTE
```

### Reportes Generados
- Capturas de pantalla en caso de fallos
- Videos de ejecución completa
- Logs detallados con timestamps
- Resumen de métricas de rendimiento

## 🔧 Mantenimiento

### Actualización de Selectores
Cuando la UI cambie, actualizar los selectores en las funciones de utilidad:

```javascript
// Ejemplo de actualización
cy.get('ion-input[formControlName="name"] input') // Selector actual
cy.get('[data-cy="name-input"]') // Selector recomendado con data-cy
```

### Nuevos Datos de Prueba
Para agregar nuevos funcionarios:

```javascript
const nuevoFuncionario = {
  Name1: 'Nuevo',
  Name2: 'Funcionario',
  // ... resto de campos
};

funcionariosData.push(nuevoFuncionario);
```

## 📚 Recursos Adicionales

- [Documentación de Cypress](https://docs.cypress.io/)
- [Mejores Prácticas E2E](https://docs.cypress.io/guides/references/best-practices)
- [Ionic Testing](https://ionicframework.com/docs/angular/testing)
- [Angular Testing](https://angular.io/guide/testing)

---

**Autor**: Agenda Turnos Development Team  
**Versión**: 1.0.0  
**Última Actualización**: 2025-07-14
