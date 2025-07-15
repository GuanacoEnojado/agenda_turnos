/**
 * SUITE DE PRUEBAS E2E CYPRESS - AGENDA TURNOS
 * ======================================
 * 
 * Suite de pruebas simplificada para funcionalidades core:
 * - Registro de administrador
 * - Login 
 * - Registro de trabajadores
 * - Asignación de turnos extra
 */

describe('Agenda Turnos - E2E Tests', () => {
  
  // Datos de prueba
  const adminData = {
    name: 'Cocodrilo',
    email: 'cocodrilo@gmail.com',
    password: 'cocodrilo'
  };

  // Adicion de trabajadores
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
    cy.visit('/');
    cy.get('ion-app').should('be.visible');
  });

  it('Debe registrar admin, crear trabajadores y asignar turnos extra', () => {
    // 1. REGISTRO DE ADMINISTRADOR
    cy.get('ion-button:contains("Registrarse")').click();
    cy.url().should('include', '/registro');
    
    cy.get('ion-input[formControlName="name"] input').type(adminData.name);
    cy.get('ion-input[formControlName="email"] input').type(adminData.email);
    cy.get('ion-input[formControlName="password"] input').type(adminData.password);
    cy.get('ion-input[formControlName="confirmPassword"] input').type(adminData.password);
    cy.get('ion-button[type="submit"]').click();
    
    cy.get('ion-alert').should('be.visible');
    cy.get('ion-alert ion-button:contains("Ok")').click();
    cy.url().should('include', '/home');

    // 2. LOGIN
    cy.get('ion-input[formControlName="email"] input').type(adminData.email);
    cy.get('ion-input[formControlName="password"] input').type(adminData.password);
    cy.get('ion-button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should('include', '/main');

    // 3. REGISTRAR TRABAJADORES
    trabajadores.forEach((trabajador, index) => {
      // Navegar a registro de funcionario
      if (index === 0) {
        cy.get('ion-card ion-button:contains("Registrar Funcionario")').click();
      } else {
        cy.get('ion-button:contains("Nuevo Funcionario")').click();
      }
      
      cy.url().should('include', '/registrofuncionario');
      
      // Completar formulario con campos correctos
      cy.get('ion-input[formControlName="Name1"] input').type(trabajador.Name1);
      cy.get('ion-input[formControlName="Name2"] input').type(trabajador.Name2);
      cy.get('ion-input[formControlName="email"] input').type(trabajador.email);
      cy.get('ion-datetime[formControlName="fecha_nacimiento"]').click();
      cy.get('ion-picker-column[aria-label*="year"] ion-picker-column-option[aria-label*="1985"]').click();
      cy.get('ion-button:contains("Done")').click();
      
      cy.get('ion-datetime[formControlName="fecha_ingreso"]').click();
      cy.get('ion-picker-column[aria-label*="year"] ion-picker-column-option[aria-label*="2020"]').click();
      cy.get('ion-button:contains("Done")').click();
      
      cy.get('ion-select[formControlName="turno"]').click();
      cy.get(`ion-select-option[value="${trabajador.turno}"]`).click();
      
      cy.get('ion-datetime[formControlName="fechainicioturno"]').click();
      cy.get('ion-picker-column[aria-label*="year"] ion-picker-column-option[aria-label*="2020"]').click();
      cy.get('ion-button:contains("Done")').click();
      
      cy.get('ion-select[formControlName="contrato"]').click();
      cy.get(`ion-select-option[value="${trabajador.contrato}"]`).click();
      
      cy.get('ion-select[formControlName="estado"]').click();
      cy.get(`ion-select-option[value="${trabajador.estado}"]`).click();
      
      cy.get('ion-select[formControlName="nivel"]').click();
      cy.get(`ion-select-option[value="${trabajador.nivel}"]`).click();
      
      // Enviar formulario
      cy.get('ion-button[type="submit"]').click();
      cy.get('ion-alert', { timeout: 15000 }).should('be.visible');
      cy.get('ion-alert ion-button:contains("Ok")').click();
      
      // Verificar que llegamos a lista de funcionarios
      cy.url().should('include', '/lista-funcionarios');
      cy.get(`ion-item:contains("${trabajador.Name1} ${trabajador.Name2}")`).should('be.visible');
    });

    // 4. ASIGNAR TURNOS EXTRA
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

    // 5. VERIFICACIÓN FINAL
    cy.get('ion-button:contains("Dashboard")').click();
    cy.url().should('include', '/main');
    cy.get('ion-title:contains("Dashboard")').should('be.visible');
  });
});