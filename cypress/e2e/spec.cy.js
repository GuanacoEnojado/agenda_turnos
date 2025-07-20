/**
 * SUITE DE PRUEBAS E2E CYPRESS - AGENDA TURNOS
 * ======================================
 * 
 * Suite de pruebas simplificada para funcionalidades core:
 * - Login con administrador existente
 * - Registro de trabajadores
 * - Asignación de turnos extra
 */

describe('Agenda Turnos - E2E Tests', () => {
  
  // Datos de administrador existente para login
  const adminData = {
    name: 'Cocodrilo',
    email: 'cocodrilo@gmail.com',
    password: 'cocodrilo'
  };

  // Trabajadores usando la interfaz correcta de datos.ts
  const trabajadores = [
    {
      Name1: 'Juan',
      Name2: 'Carlos',
      email: 'juan.carlos@hospital.cl',
      fecha_nacimiento: '1985-05-15',
      fecha_ingreso: '2020-01-15',
      turno: '4to_turno',
      fechainicioturno: '2020-02-01',
      contrato: 'planta',
      estado: 'activo',
      nivel: 'profesional'
    },
    {
      Name1: 'María',
      Name2: 'Elena',
      email: 'maria.elena@hospital.cl',
      fecha_nacimiento: '1990-08-20',
      fecha_ingreso: '2021-03-01',
      turno: 'diurno_hospital',
      fechainicioturno: '2021-03-15',
      contrato: 'contrato_indefinido',
      estado: 'activo',
      nivel: 'tecnico'
    }
  ];

  // Configuración
  beforeEach(() => {
    // Ir directamente a la página de login
    cy.visit('/home');
    cy.get('ion-app').should('be.visible');
  });

  it('Debe hacer login con admin existente, crear trabajadores y asignar turnos extra', () => {
    // 1. LOGIN CON USUARIO ADMINISTRADOR EXISTENTE
    // Esperar a que los campos de login estén disponibles
    cy.get('ion-input[formControlName="username"]', { timeout: 10000 }).should('be.visible');
    cy.get('ion-input[formControlName="password"]', { timeout: 10000 }).should('be.visible');
    
    cy.get('ion-input[formControlName="username"] input').clear().type(adminData.email);
    cy.get('ion-input[formControlName="password"] input').clear().type(adminData.password);
    cy.get('ion-button[type="submit"]').click();
    
    // Verificar que el login fue exitoso
    cy.url({ timeout: 10000 }).should('include', '/main');

    // 2. REGISTRAR TRABAJADORES
    trabajadores.forEach((trabajador, index) => {
      // Navegar a registro de funcionario usando el menú lateral
      if (index === 0) {
        // Para el primer trabajador, abrir menú y navegar a registro
        cy.get('ion-menu-button').click();
        cy.wait(500); 
        cy.get('ion-item:contains("Registrar Funcionario")').should('be.visible').click();
      } else {
        // Para trabajadores subsecuentes, ir desde lista-funcionarios
        cy.get('ion-menu-button').click();
        cy.wait(500); 
        cy.get('ion-item:contains("Registrar Funcionario")').should('be.visible').click();
      }
      
      cy.url().should('include', '/registrofuncionario');
      
      // Esperar a que el formulario esté completamente cargado
      cy.get('ion-card-title:contains("Nuevo Funcionario")').should('be.visible');
      cy.get('ion-card-subtitle:contains("Complete la información del funcionario")').should('be.visible');
      
      // Hacer scroll hasta el formulario específico para asegurar visibilidad
      cy.get('ion-card-content form').first().scrollIntoView();
      cy.wait(500); // Dar tiempo para que el scroll termine
      
      // Completar formulario con comandos mejorados
      cy.fillIonInput('Name1', trabajador.Name1);
      cy.fillIonInput('Name2', trabajador.Name2);
      cy.fillIonInput('email', trabajador.email);
      
      // Fecha de Nacimiento - Usar método forzado para ion-datetime
      cy.selectIonDatetimeForced('fecha_nacimiento', trabajador.fecha_nacimiento);
      
      // Fecha de Ingreso
      cy.selectIonDatetimeForced('fecha_ingreso', trabajador.fecha_ingreso);

      // Seleccionar Turno
      cy.selectIonSelectForced('turno', trabajador.turno);
      
      // Fecha Inicio Turno
      cy.selectIonDatetimeForced('fechainicioturno', trabajador.fechainicioturno);
      
      // Seleccionar Contrato
      cy.selectIonSelectForced('contrato', trabajador.contrato);
      
      // Seleccionar Estado
      cy.selectIonSelectForced('estado', trabajador.estado);
      
      // Seleccionar Nivel
      cy.selectIonSelectForced('nivel', trabajador.nivel);
      
      // Enviar formulario
      cy.get('ion-button[type="submit"]:contains("Registrar Funcionario")')
        .scrollIntoView()
        .should('be.visible')
        .should('not.be.disabled')
        .click();
      
      // Manejar alerta con debugging y método simple
      cy.get('ion-alert', { timeout: 15000 }).should('be.visible').then(($alert) => {
        // Debug: ver qué hay en la alerta
        cy.log('HTML de la alerta:', $alert.html());
        
        // Método más simple: buscar directamente por texto sin importar el elemento
        cy.wrap($alert).contains('Ok').click();
      });
      
      // Verificar que llegamos a main (según el código del componente)
      cy.url({ timeout: 10000 }).should('include', '/main');
      
      // Navegar a lista de funcionarios para verificar que se registró
      cy.get('ion-menu-button').click();
      cy.wait(500);
      cy.get('ion-item:contains("Lista Funcionarios"), ion-item:contains("Lista de Funcionarios")').should('be.visible').click();
      cy.url().should('include', '/lista-funcionarios');
      cy.get(`ion-item:contains("${trabajador.Name1} ${trabajador.Name2}")`).should('be.visible');
    });

    // 3. ASIGNAR TURNOS EXTRA
    // Ya estamos en lista-funcionarios
    trabajadores.forEach((trabajador) => {
      cy.get(`ion-item:contains("${trabajador.Name1} ${trabajador.Name2}")`)
        .parent()
        .find('ion-button:contains("Turno Extra")')
        .click();
      
      cy.get('ion-alert').should('be.visible');
      cy.get('ion-alert ion-button:contains("Confirmar")').click();
      cy.wait(1000);
    });

    // 4. VERIFICACIÓN FINAL
    cy.get('ion-button:contains("Dashboard")').click();
    cy.url().should('include', '/main');
    cy.get('ion-title:contains("Dashboard")').should('be.visible');
  });
});