/**
 * COMANDOS PERSONALIZADOS DE CYPRESS PARA AGENDA TURNOS
 * =====================================================
 * 
 * Este archivo contiene comandos personalizados de Cypress específicos
 * para la aplicación Agenda Turnos. Estos comandos simplifican las
 * pruebas E2E y proporcionan funcionalidades reutilizables.
 * 
 * USO: Los comandos se pueden usar en cualquier prueba como cy.comandoPersonalizado()
 * 
 * @author Agenda Turnos Development Team
 * @version 1.0.0
 * @date 2025-07-14
 */

// ***********************************************
// COMANDOS DE AUTENTICACIÓN
// ***********************************************

/**
 * Comando personalizado para login de administrador
 * @param {string} email - Email del administrador
 * @param {string} password - Contraseña del administrador
 */
Cypress.Commands.add('loginAdmin', (email, password) => {
  cy.log(`🔐 Iniciando sesión como administrador: ${email}`);
  
  cy.visit('/');
  cy.get('ion-input[formControlName="email"] input').clear().type(email);
  cy.get('ion-input[formControlName="password"] input').clear().type(password);
  cy.get('ion-button[type="submit"]').click();
  
  // Verificar login exitoso
  cy.url({ timeout: 10000 }).should('include', '/main');
  cy.get('ion-title:contains("Dashboard")').should('be.visible');
  
  cy.log('✅ Login de administrador exitoso');
});

/**
 * Comando personalizado para registro de administrador
 * @param {Object} adminData - Datos del administrador
 */
Cypress.Commands.add('registerAdmin', (adminData) => {
  cy.log(`📝 Registrando administrador: ${adminData.name}`);
  
  cy.visit('/');
  cy.get('ion-button:contains("Registrarse")').click();
  
  cy.url().should('include', '/registro');
  
  // Completar formulario
  cy.get('ion-input[formControlName="name"] input').clear().type(adminData.name);
  cy.get('ion-input[formControlName="email"] input').clear().type(adminData.email);
  cy.get('ion-input[formControlName="password"] input').clear().type(adminData.password);
  cy.get('ion-input[formControlName="confirmPassword"] input').clear().type(adminData.password);
  
  cy.get('ion-button[type="submit"]').click();
  
  // Verificar registro exitoso
  cy.get('ion-alert', { timeout: 10000 }).should('be.visible');
  cy.get('ion-alert ion-button:contains("Ok")').click();
  
  cy.url().should('include', '/home');
  
  cy.log('✅ Registro de administrador exitoso');
});

// ***********************************************
// COMANDOS DE GESTIÓN DE FUNCIONARIOS
// ***********************************************

/**
 * Comando personalizado para registrar un funcionario
 * @param {Object} funcionario - Datos del funcionario
 */
Cypress.Commands.add('registerFuncionario', (funcionario) => {
  cy.log(`👤 Registrando funcionario: ${funcionario.Name1} ${funcionario.LastName1}`);
  
  // Navegar a registro de funcionario
  cy.visit('/registrofuncionario');
  
  // Esperar a que el formulario esté listo
  cy.get('ion-input[formControlName="Name1"] input').should('be.visible');
  
  // Completar formulario
  cy.fillFuncionarioForm(funcionario);
  
  // Enviar formulario
  cy.get('ion-button[type="submit"]').scrollIntoView().click();
  
  // Verificar registro exitoso
  cy.get('ion-alert', { timeout: 15000 }).should('be.visible');
  cy.get('ion-alert ion-button:contains("OK")').click();
  
  cy.url().should('include', '/lista-funcionarios');
  cy.get(`ion-item:contains("${funcionario.Name1} ${funcionario.LastName1}")`).should('be.visible');
  
  cy.log(`✅ Funcionario registrado: ${funcionario.Name1} ${funcionario.LastName1}`);
});

/**
 * Comando personalizado para completar formulario de funcionario
 * @param {Object} funcionario - Datos del funcionario
 */
Cypress.Commands.add('fillFuncionarioForm', (funcionario) => {
  cy.log('📝 Completando formulario de funcionario');
  
  // Información personal
  cy.get('ion-input[formControlName="Name1"] input').clear().type(funcionario.Name1);
  cy.get('ion-input[formControlName="Name2"] input').clear().type(funcionario.Name2);
  cy.get('ion-input[formControlName="LastName1"] input').clear().type(funcionario.LastName1);
  cy.get('ion-input[formControlName="LastName2"] input').clear().type(funcionario.LastName2);
  cy.get('ion-input[formControlName="Run"] input').clear().type(funcionario.Run);
  cy.get('ion-input[formControlName="Email"] input').clear().type(funcionario.Email);
  cy.get('ion-input[formControlName="Telefono"] input').clear().type(funcionario.Telefono);
  cy.get('ion-input[formControlName="FechaNacimiento"] input').clear().type(funcionario.FechaNacimiento);
  cy.get('ion-input[formControlName="Direccion"] input').clear().type(funcionario.Direccion);
  
  // Estado Civil (Select)
  cy.get('ion-select[formControlName="EstadoCivil"]').click();
  cy.get(`ion-radio-group ion-item:contains("${funcionario.EstadoCivil}")`).click();
  cy.get('ion-button:contains("Confirmar")').click();
  
  // Información profesional
  cy.get('ion-input[formControlName="Profesion"] input').clear().type(funcionario.Profesion);
  cy.get('ion-input[formControlName="Especialidad"] input').clear().type(funcionario.Especialidad);
  cy.get('ion-input[formControlName="FechaIngreso"] input').clear().type(funcionario.FechaIngreso);
  cy.get('ion-input[formControlName="Cargo"] input').clear().type(funcionario.Cargo);
  cy.get('ion-input[formControlName="Unidad"] input').clear().type(funcionario.Unidad);
  
  cy.log('✅ Formulario de funcionario completado');
});

// ***********************************************
// COMANDOS DE GESTIÓN DE TURNOS
// ***********************************************

/**
 * Comando personalizado para asignar turnos extra
 * @param {string} nombreCompleto - Nombre completo del funcionario
 * @param {number} cantidadTurnos - Número de turnos a asignar
 */
Cypress.Commands.add('assignExtraShifts', (nombreCompleto, cantidadTurnos) => {
  cy.log(`⏰ Asignando ${cantidadTurnos} turnos extra a: ${nombreCompleto}`);
  
  for (let i = 0; i < cantidadTurnos; i++) {
    // Buscar el funcionario y hacer clic en turno extra
    cy.get(`ion-item:contains("${nombreCompleto}")`)
      .parent()
      .find('ion-button:contains("Turno Extra")')
      .click();
    
    // Confirmar asignación
    cy.get('ion-alert').should('be.visible');
    cy.get('ion-alert ion-button:contains("Confirmar")').click();
    
    cy.wait(1000); // Esperar procesamiento
    
    cy.log(`✅ Turno extra ${i + 1}/${cantidadTurnos} asignado`);
  }
  
  cy.log(`🎉 Todos los turnos asignados a: ${nombreCompleto}`);
});

/**
 * Comando personalizado para verificar turnos asignados
 * @param {string} nombreCompleto - Nombre completo del funcionario
 * @param {number} expectedTurnos - Número esperado de turnos
 */
Cypress.Commands.add('verifyExtraShifts', (nombreCompleto, expectedTurnos) => {
  cy.log(`🔍 Verificando turnos extra para: ${nombreCompleto}`);
  
  cy.get(`ion-item:contains("${nombreCompleto}")`)
    .parent()
    .should('contain.text', 'Turnos Extra')
    .should('contain.text', expectedTurnos.toString());
  
  cy.log(`✅ Turnos verificados: ${expectedTurnos} para ${nombreCompleto}`);
});

// ***********************************************
// COMANDOS DE UTILIDAD
// ***********************************************

/**
 * Comando personalizado para esperar elemento con timeout personalizado
 * @param {string} selector - Selector del elemento
 * @param {number} timeout - Tiempo de espera en milisegundos
 */
Cypress.Commands.add('waitForElement', (selector, timeout = 10000) => {
  cy.get(selector, { timeout }).should('be.visible').should('not.be.disabled');
});

/**
 * Comando personalizado para limpiar y escribir en input de Ionic
 * @param {string} selector - Selector del input
 * @param {string} text - Texto a escribir
 */
Cypress.Commands.add('typeInIonicInput', (selector, text) => {
  cy.get(`${selector} input`).clear().type(text);
  cy.get(`${selector} input`).should('have.value', text);
});

/**
 * Comando personalizado para hacer clic en botón de Ionic con verificación
 * @param {string} buttonText - Texto del botón
 */
Cypress.Commands.add('clickIonicButton', (buttonText) => {
  cy.get(`ion-button:contains("${buttonText}")`)
    .should('be.visible')
    .should('not.be.disabled')
    .click();
});

/**
 * Comando personalizado para verificar alerta de Ionic
 * @param {string} expectedText - Texto esperado en la alerta
 * @param {string} buttonText - Texto del botón a hacer clic (default: "OK")
 */
Cypress.Commands.add('handleIonicAlert', (expectedText = null, buttonText = 'OK') => {
  cy.get('ion-alert', { timeout: 10000 }).should('be.visible');
  
  if (expectedText) {
    cy.get('ion-alert').should('contain.text', expectedText);
  }
  
  cy.get(`ion-alert ion-button:contains("${buttonText}")`).click();
});

/**
 * Comando personalizado para generar datos de funcionario aleatorios
 */
Cypress.Commands.add('generateRandomFuncionario', () => {
  const timestamp = Date.now();
  const randomId = Math.floor(Math.random() * 1000);
  
  return {
    Name1: `Nombre${randomId}`,
    Name2: `Segundo${randomId}`,
    LastName1: `Apellido${randomId}`,
    LastName2: `SegundoApellido${randomId}`,
    Run: `${randomId}${randomId}-${randomId % 10}`,
    Email: `funcionario${randomId}@hospital.cl`,
    Telefono: `+5691234${randomId}`,
    FechaNacimiento: '1990-01-01',
    Direccion: `Dirección de prueba ${randomId}`,
    EstadoCivil: 'Soltero/a',
    Profesion: 'Profesional de la Salud',
    Especialidad: `Especialidad ${randomId}`,
    FechaIngreso: '2023-01-01',
    Cargo: `Cargo ${randomId}`,
    Unidad: `Unidad ${randomId}`
  };
});