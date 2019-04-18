/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

Cypress.Commands.add('login', () => {
  cy.visit('/rooms/');
  cy.get('input[name="username"]')
    .type('admin@refocus.admin').should('have.value', 'admin@refocus.admin');
  cy.get('input[name="password"]')
    .type('devPassword').should('have.value', 'devPassword');
  cy.get('button[type="submit"]')
    .click();
})

Cypress.Commands.add('createRoomTypeAndRoom', (name) => {
  cy
    .request({
      method: 'POST',
      url: '/v1/roomTypes',
      body: {
        name: name,
        bots: ['Timeline-Bot']
      },
      headers: {
        Authorization: Cypress.env().API_TOKEN,
      }
    })
    .then(() => {
      cy
        .request({
          method: 'POST',
          url: '/v1/rooms',
          body: {
            name: name,
            type: name,
          },
          headers: {
            Authorization: Cypress.env().API_TOKEN,
          }
        });
    });
});

