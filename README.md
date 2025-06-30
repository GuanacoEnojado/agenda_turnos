# 📋 Sistema de Gestión de Turnos Hospitalarios

## 📝 Descripción General

Este es un sistema de gestión de turnos desarrollado en **Ionic/Angular** para un hospital de habla hispana. El sistema permite administrar los horarios de trabajo del personal médico y de apoyo, calculando automáticamente los turnos según diferentes modalidades de trabajo.

## 🏗️ Arquitectura del Sistema

### **Frontend**
- **Framework**: Ionic 7 + Angular
- **Lenguaje**: TypeScript
- **Estilos**: SCSS + Variables CSS de Ionic
- **Componentes**: Ionic Components (Cards, Lists, Forms, etc.)

### **Backend**
- **Base de Datos**: PostgreSQL
- **API**: REST API (Node.js)
- **Puerto**: 3000
- **Containerización**: Docker

## 📁 Estructura del Proyecto

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
│   │   ├── eliminacion/        # Eliminación de funcionarios(pagina deprecada)
│   │   └── preferencias/       # Configuraciones del usuario(aun sin realizar)
│   └── services/
│       ├── auth.service.ts     # Autenticación de usuarios
│       ├── datos.ts           # Interfaces y tipos de datos
│       ├── trabajadores.service.ts # CRUD de trabajadores
│       ├── shift-calculator.service.ts # Cálculo de turnos
│       └── postgres-*.service.ts # Servicios de base de datos
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

## 🔄 Sistema de Turnos

### **Tipos de Turno Implementados**

#### **1. Turnos Rotativos (12 horas)**
- **4to_turno_modificado**: Ciclo de 4 días (trabaja 2, libre 2)
- **3er_turno**: Ciclo de 6 días (día, día, noche, noche, libre, libre)
- **4to_turno**: Ciclo de 4 días (día, noche, libre, libre)

#### **2. Turnos Diurnos (8 horas)**
- **diurno_hospital**: Lunes a Viernes, 8:00 AM - 5:00 PM
- **diurno_empresa**: Lunes a Viernes, 8:00 AM - 5:00 PM

#### **3. Turno Especial**
- **volante**: Sin horario fijo, asignación manual *por implementar

### **Cálculo de Turnos**
El sistema utiliza el servicio `ShiftCalculatorService` que:
- Calcula automáticamente si un trabajador debe estar en turno en una fecha específica
- Considera la fecha de inicio del turno (`fechainicioturno`)
- Aplica el patrón de turnos correspondiente
- Detecta ausencias (vacaciones, licencias médicas)

- Funcionalidad pendiente: Cambios de turno, permisos administrativos, registros retroactivos de permisos y licencias médicas.

## 📅 Funcionalidades Principales

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
- **Tres Categorías de Trabajadores**:
  - **En Turno**: Funcionarios programados y presentes
  - **Ausentes**: Funcionarios que deberían trabajar pero están ausentes
  - **Libres**: Funcionarios sin turno asignado para esa fecha
- **Resumen Estadístico**: Contadores por categoría, hasta ahora solo el día, pero el dato podría ser almacenado y utilizado. En ese sentido queda pendiente el potencial estadístico de la app
- **Información Detallada**: Nombre, turno, nivel, estado de cada trabajador

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

## Interfaz de Usuario

### **Diseño**
- **Tema**: Material Design con colores neutros y clásicos. No hay trabajo acabado de UI aún
- **Adaptable**: Adaptable a móviles, tablets y desktop
- **Componentes Ionic**: Cards, Lists, Forms, Buttons, Icons
- **Estados Visuales**: Colores diferenciados para cada estado de trabajador

### **Navegación**
- **Menú Lateral**: Acceso rápido a todas las funcionalidades

## 📊 Base de Datos

### **Tabla Trabajadores**
```sql (///// ABANDONADO /////) trabajadores actualmente con postgreSQL
- id: INTEGER (Primary Key)
- Name1: VARCHAR (Primer nombre)
- Name2: VARCHAR (Segundo nombre)
- email: VARCHAR (Email único)
- fecha_nacimiento: DATE
- fecha_ingreso: DATE
- turno: VARCHAR (Tipo de turno)
- fechainicioturno: DATE (Fecha inicio del patrón)
- contrato: VARCHAR (Tipo de contrato)
- estado: VARCHAR (Estado actual)
- nivel: VARCHAR (Nivel profesional)
- avatarUrl: VARCHAR (URL imagen, opcional)
- createdAt: TIMESTAMP
- updatedAt: TIMESTAMP
``` ///// ABANDONADO /////

### **Tabla Users**
```sql ///// ABANDONADO /////
- id: INTEGER (Primary Key)
- name: VARCHAR (Nombre usuario)
- email: VARCHAR (Email único)
- password: VARCHAR (Hash de contraseña)
- createdAt: TIMESTAMP
- updatedAt: TIMESTAMP
```///// ABANDONADO /////

## 🔐 Seguridad

- **Validación de Formularios**: Validaciones en frontend y backend
- **Autenticación**: Sistema de login obligatorio
- **Gestión de Estados**: Control de acceso por roles (ROUTEGUARD)

## 📱 Compatibilidad

- **Plataformas**: iOS, Android, Web
- **Navegadores**: PC por probar, chrome probado y firefox
- **Responsividad**: Móviles, tablets, desktop
- **Offline**: Capacidades limitadas (por implementar a futuro)

## 🚀 Estado Actual del Desarrollo

### **✅ Completado**
- [x] Sistema de autenticación completo
- [x] CRUD de trabajadores/funcionarios
- [x] Cálculo automático de turnos
- [x] Calendario global de turnos
- [x] Interfaz de usuario responsive
- [x] Integración con PostgreSQL
- [x] Gestión de estados de trabajadores
- [x] Documentación en español

### **🔄 En Desarrollo**
- [ ] Sistema de notificaciones
- [ ] Reportes y estadísticas
- [ ] Gestión de cambios de turno
- [ ] Módulo de vacaciones, licencias y dias administrativos retroativos
- [ ] API de integración externa


*Esta documentación será complementada con funcionalidades adicionales conforme el desarrollo avance.*
