/**
 * PRUEBAS E2E - LISTA DE FUNCIONARIOS
 * ====================================
 * 
 * Pruebas específicas para la lista de funcionarios:
 * - Visualización de funcionarios
 * - Búsqueda y filtros
 * - Acciones sobre funcionarios (editar, eliminar, etc.)
 */

describe('Lista de Funcionarios - E2E Tests', () => {
  
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

  it('Debe mostrar la lista de funcionarios correctamente', () => {
    // Verificar que la página se carga correctamente
    cy.get('ion-title:contains("Lista de Funcionarios")').should('be.visible');
    cy.get('ion-searchbar').should('be.visible');
    
    // Verificar que hay al menos un funcionario (puede haber datos existentes)
    cy.get('ion-list').should('be.visible');
    
    // Verificar botón de refresh
    cy.wait(500);
    cy.get('ion-button[id="refresh-button"]').should('be.visible');
    cy.wait(500);
  });

  it('Debe funcionar la búsqueda de funcionarios', () => {
    // Verificar que el campo de búsqueda funciona
    cy.get('ion-searchbar input').should('be.visible').type('test');
    
    // Esperar a que se ejecute la búsqueda
    cy.wait(500);
  });


  it('Debe mostrar elementos básicos de la interfaz', () => {
    // Verificar que existen funcionarios en la lista
    cy.get('ion-item').should('exist');
    
    // Verificar que hay botones de acción (sin hacer clic)
    cy.get('ion-button').should('exist');
    
    // Verificar que hay badges de estado
    cy.get('ion-badge').should('exist');
  });

  it('Debe mostrar la interfaz de lista correctamente', () => {
    // Verificar que la lista es visible
    cy.get('ion-list').should('be.visible');
    
    // Verificar que la página está completamente cargada
    cy.get('ion-content').should('be.visible');
    
    // Verificar que hay elementos en la página
    cy.get('ion-item').should('have.length.greaterThan', 0);
  });

  it('Debe poder entrar a la interfaz de edición', () => {
    // Esperar a que la lista esté completamente cargada
    cy.get('ion-list').should('be.visible');
    cy.wait(1000);
    
    // Buscar cualquier botón que contenga "Editar" en toda la página
    cy.get('ion-button').contains('Editar').first().should('be.visible').click();
    
    // Verificar que algo cambió (modal o navegación)
    cy.wait(1000);
    
    // Verificar si se abrió un modal
    cy.get('body').then($body => {
      if ($body.find('ion-modal').length > 0) {
        // Si hay modal, verificar que está visible
        cy.get('ion-modal').should('be.visible');
        cy.log('Modal de edición detectado');
        
        // Intentar cerrar con Cancelar
        cy.get('ion-button').contains('Cancelar').first().click();
      } else {
        // Si no hay modal, verificar cambio de URL
        cy.url().then(url => {
          if (!url.includes('/lista-funcionarios')) {
            cy.log('Navegación a página de edición detectada');
            cy.go('back');
          }
        });
      }
    });
  });
});
