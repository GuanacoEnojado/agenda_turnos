/**
 * PRUEBAS E2E - LOGIN
 * ===================
 * 
 * Pruebas específicas para funcionalidad de login:
 * - Login exitoso con administrador existente
 * - Login fallido con credenciales incorrectas
 */

describe('Login - E2E Tests', () => {
  
  // Datos de administrador existente para login
  const adminData = {
    name: 'Cocodrilo',
    email: 'cocodrilo@gmail.com',
    password: 'cocodrilo'
  };

  beforeEach(() => {
    // Ir directamente a la página de login
    cy.visit('/home');
    cy.get('ion-app').should('be.visible');
  });

  it('Debe hacer login exitoso con administrador existente', () => {
    // Esperar a que los campos de login estén disponibles
    cy.get('ion-input[formControlName="username"]', { timeout: 10000 }).should('be.visible');
    cy.get('ion-input[formControlName="password"]', { timeout: 10000 }).should('be.visible');
    
    // Completar credenciales
    cy.get('ion-input[formControlName="username"] input').clear().type(adminData.email);
    cy.get('ion-input[formControlName="password"] input').clear().type(adminData.password);
    
    // Enviar formulario
    cy.get('ion-button[type="submit"]').click();
    
    // Verificar que el login fue exitoso - solo verificar redirección
    cy.url({ timeout: 10000 }).should('include', '/main');
    
    // Esperar unos segundos para asegurar que la página se carga completamente
    cy.wait(3000);
  });

  it('Debe mostrar error con credenciales incorrectas', () => {
    // Esperar a que los campos de login estén disponibles
    cy.get('ion-input[formControlName="username"]', { timeout: 10000 }).should('be.visible');
    cy.get('ion-input[formControlName="password"]', { timeout: 10000 }).should('be.visible');
    
    // Completar credenciales incorrectas
    cy.get('ion-input[formControlName="username"] input').clear().type('usuario@incorrecto.com');
    cy.get('ion-input[formControlName="password"] input').clear().type('passwordincorrecto');
    
    // Enviar formulario
    cy.get('ion-button[type="submit"]').click();
    
    // Verificar que se muestra alerta de error - solo verificar que aparece
    cy.get('ion-alert', { timeout: 15000 }).should('be.visible');
    cy.get('ion-alert').should('contain', 'Falla en el ingreso');
    
    // No intentar cerrar la alerta - solo verificar que el error se muestra
    // La prueba se considera exitosa si aparece la alerta de error
  });
});
