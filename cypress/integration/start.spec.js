/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */
 
context('Timeline-Bot >', () => {
  const d = new Date();
  const name = 'room_' + d.getTime().toString();
  before(() => {
    cy.login();
    cy.createRoomTypeAndRoom(name);
  })

  it('OK, send a message on Timeline', () => {
    cy.visit(`/rooms/${name}`);
  })
})
