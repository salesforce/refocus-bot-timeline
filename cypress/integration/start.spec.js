/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

context('Timeline-Bot >', () => {
  const d = new Date();
  const name = 'test_' + d.getTime().toString();
  before(() => {
    cy.login('admin@refocus.admin', 'devPassword');
    cy.createRoomTypeAndRoom(name);
  });

  it('OK, send 2 messages on Timeline', () => {
    cy.visit(`/rooms/${name}`);
    cy.get('iframe[id="Timeline-Bot-iframe-section"]').iframe()
      .find('div[cy-data="chat-box"]').type('test message').should('contain.text', 'test message');
    cy.get('iframe[id="Timeline-Bot-iframe-section"]').iframe()
      .find('button[cy-data="send"]').click();
    cy.get('iframe[id="Timeline-Bot-iframe-section"]').iframe()
      .find('div[cy-data="chat-box"]').type('something else').should('contain.text', 'something else');
    cy.get('iframe[id="Timeline-Bot-iframe-section"]').iframe()
      .find('button[cy-data="send"]').click();
  });
});
