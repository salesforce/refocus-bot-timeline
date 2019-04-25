/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

Cypress.Commands.add('iframe', (iframeSelector, elSelector) => {
  return cy
    .get(`iframe${iframeSelector || ''}`)
    .should(($iframe) =>
      expect($iframe.contents().find(elSelector||'body')).to.exist
    )
    .then(($iframe) => {
      return cy.wrap($iframe.contents().find('body'));
    });
});

Cypress.Commands.add('login', (email, password) => {
  cy.visit('/rooms/');
  cy.get('input[name="username"]')
    .type(email).should('have.value', email);
  cy.get('input[name="password"]')
    .type(password).should('have.value', password);
  cy.get('button[type="submit"]')
    .click();
});

Cypress.Commands.add('authenticate', () => {
  cy
    .request({
      method: 'POST',
      url: '/v1/authenticate',
      body: {
        username: 'admin@refocus.admin',
        password: 'devPassword',
      }
    });
});

Cypress.Commands.add('createRoomTypeAndRoom', (name) => {
  cy
    .request({
      method: 'POST',
      url: '/v1/roomTypes',
      body: {
        name,
        bots: ['Timeline-Bot']
      },
    })
    .then(() => {
      cy
        .request({
          method: 'POST',
          url: '/v1/rooms',
          body: {
            name,
            type: name,
          },
        });
    });
});

