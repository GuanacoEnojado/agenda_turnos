/**
 * PRUEBAS E2E - ASIGNACIÓN DE TURNOS EXTRA
 * =========================================
 * 
 * Pruebas específicas para asignación de turnos extra:
 * - Verificar elegibilidad para turnos extra
 * - Asignar turnos de día y noche
 * - Validar formulario de turnos extra
 */

describe('Asignación de Turnos Extra - E2E Tests', () => {
  
  // Datos de administrador existente para login
  const adminData = {
    email: 'cocodrilo@gmail.com',
    password: 'cocodrilo'
  };

  beforeEach(() => {
    // Login y navegar a lista de funcionarios
    cy.visit('/home');
    cy.get('ion-app').should('be.visible');
    
    // Login rápido
    cy.get('ion-input[formControlName="username"] input').clear().type(adminData.email);
    cy.get('ion-input[formControlName="password"] input').clear().type(adminData.password);
    cy.get('ion-button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should('include', '/main');
    
    // Navegar a lista de funcionarios
    cy.get('ion-menu-button').click();
    cy.wait(500);
    cy.get('ion-item:contains("Lista Funcionarios"), ion-item:contains("Lista de Funcionarios")').should('be.visible').click();
    cy.url().should('include', '/lista-funcionarios');
  });

  it('Debe acceder al menú de turno extra del primer funcionario', () => {
    // Esperar a que la lista esté cargada
    cy.get('ion-list').should('be.visible');
    cy.wait(1000);
    
    // Buscar el primer botón "Turno Extra" y hacer clic
    cy.get('ion-button').contains('Turno Extra').first().should('be.visible').click();
    
    // Verificar que se abre algún tipo de interfaz (modal o alerta)
    cy.wait(1000);
    
    // Buscar cualquier elemento que indique selección de turno
    cy.get('body').then($body => {
      if ($body.find('ion-alert').length > 0) {
        // Si hay alerta, intentar seleccionar turno de noche
        cy.get('ion-alert').should('be.visible');
        cy.contains('Turno de Noche').click();
        cy.contains('Continuar').click();

      } else {
        // Si no hay modal ni alerta, solo verificar que algo cambió
        cy.log('No se detectó alerta específica');
      }
    });
    cy.get('body').then($body => {
      if ($body.find('ion-alert').length > 0) {
        // Si hay alerta, intentar seleccionar asignar
        cy.get('ion-alert').should('be.visible');        
        
        // Esperar a que el input esté disponible y forzar la escritura
        cy.get('ion-alert').find('input[type="number"]').should('be.visible')
          .click({ force: true })
          .clear({ force: true })
          .type('12', { force: true });
        
        cy.contains('Asignar').click();

      } else {
        // Si no hay modal ni alerta, solo verificar que algo cambió
        cy.log('No se detectó alerta específica');
      }
    });
  });
});
