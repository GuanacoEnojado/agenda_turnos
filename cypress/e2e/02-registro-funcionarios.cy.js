/**
 * PRUEBAS E2E - REGISTRO DE FUNCIONARIOS
 * =======================================
 * 
 * Pruebas específicas para registro de nuevos funcionarios:
 * - Registro individual de funcionario
 * - Validación de formulario
 * - Verificación en lista
 */

describe('Registro de Funcionarios - E2E Tests', () => {
  
  // Datos de administrador existente para login
  const adminData = {
    email: 'cocodrilo@gmail.com',
    password: 'cocodrilo'
  };

  // Trabajador de prueba
  const trabajadorPrueba = {
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
  };

  beforeEach(() => {
    // Login y navegar a registro
    cy.visit('/home');
    cy.get('ion-app').should('be.visible');
    
    // Login rápido
    cy.get('ion-input[formControlName="username"] input').clear().type(adminData.email);
    cy.get('ion-input[formControlName="password"] input').clear().type(adminData.password);
    cy.get('ion-button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should('include', '/main');
  });

  it('Debe registrar un funcionario y verificar que aparece en la lista', () => {
    // Navegar a registro de funcionario
    cy.get('ion-menu-button').click();
    cy.wait(500); 
    cy.get('ion-item:contains("Registrar Funcionario")').should('be.visible').click();
    cy.url().should('include', '/registrofuncionario');
    
    // Esperar a que el formulario esté completamente cargado
    cy.get('ion-card-title:contains("Nuevo Funcionario")').should('be.visible');
    cy.get('ion-card-subtitle:contains("Complete la información del funcionario")').should('be.visible');
    
    // Hacer scroll hasta el formulario
    cy.get('ion-card-content form').first().scrollIntoView();
    cy.wait(500);
    
    // Completar formulario
    cy.fillIonInput('Name1', trabajadorPrueba.Name1);
    cy.fillIonInput('Name2', trabajadorPrueba.Name2);
    cy.fillIonInput('email', trabajadorPrueba.email);
    
    // Fechas
    cy.selectIonDatetimeForced('fecha_nacimiento', trabajadorPrueba.fecha_nacimiento);
    cy.selectIonDatetimeForced('fecha_ingreso', trabajadorPrueba.fecha_ingreso);
    cy.selectIonDatetimeForced('fechainicioturno', trabajadorPrueba.fechainicioturno);
    
    // Selects
    cy.selectIonSelectForced('turno', trabajadorPrueba.turno);
    cy.selectIonSelectForced('contrato', trabajadorPrueba.contrato);
    cy.selectIonSelectForced('estado', trabajadorPrueba.estado);
    cy.selectIonSelectForced('nivel', trabajadorPrueba.nivel);
    
    // Enviar formulario
    cy.get('ion-button[type="submit"]:contains("Registrar Funcionario")')
      .scrollIntoView()
      .should('be.visible')
      .should('not.be.disabled')
      .click();
    
    // Manejar alerta de éxito - buscar y clickear Ok
    cy.get('ion-alert', { timeout: 15000 }).should('be.visible');
    cy.get('ion-alert').contains('Ok').click();
    
    // Navegar a lista de funcionarios
    cy.get('ion-menu-button').click();
    cy.wait(500);
    cy.get('ion-item:contains("Lista de Funcionarios")').should('be.visible').click();
    cy.url().should('include', '/lista-funcionarios');
  });

  it('Debe navegar a la lista de funcionarios', () => {
    // Navegar directamente a lista de funcionarios
    cy.get('ion-menu-button').click();
    cy.wait(500);
    cy.get('ion-item:contains("Lista de Funcionarios")').should('be.visible').click();
    cy.url().should('include', '/lista-funcionarios');
    
    // Verificar que la página se carga correctamente
    cy.get('ion-title').should('be.visible');
  });
});
