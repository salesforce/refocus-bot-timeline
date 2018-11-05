/**
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * tests/web/components/EventBlueprint.js
 */
const expect = require('chai').expect;
const EventBlueprint = require('../../../web/components/EventBlueprint.jsx');
const ReactTestRenderer = require('react-test-renderer');

import React from 'react';

const testEvent = {
  context: {
    user: {
      name: 'Test Name'
    }
  }
};

describe('<EventBlueprint/>: ', () => {
  it('Ok, <EventBlueprint/> renders as an li element:', (done) => {
    const eventBlueprint = ReactTestRenderer.create(
      <EventBlueprint
        event={ testEvent }
        color={ '#FFFFFF' }
        type={ 'Event' }
        imgUrl={'https://goo.gl/images/dojH1X'}
        message={'Test'}/>
    ).toJSON();

    expect(eventBlueprint.type).to.equal('li');
    done();
  });
});
