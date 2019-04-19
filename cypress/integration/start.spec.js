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

  it('OK, send a message on Timeline', () => {
    cy.visit(`/rooms/${name}`);
    // TODO: Figure out talking with iframe
    cy
      .get('iframe')
      .then(function ($iframe) {
        const doc = $iframe.contents();
        console.log(doc);
        console.log("abcdefg")
      })
  });
});
