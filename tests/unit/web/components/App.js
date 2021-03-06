/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * tests/web/components/App.jsx
 */

/* eslint-disable no-magic-numbers */
const expect = require('chai').expect;
import App from '../../../../web/components/App';
import ReactTestRenderer from 'react-test-renderer';
const roomId = 1;

import React from 'react';

describe('<App />: ', () => {
  it('Ok, <App /> renders as a div element', (done) => {
    const app = ReactTestRenderer.create(
      <App roomId={roomId} response={[]} getEventsByType={() => {}} user={{}} />
    );

    expect(app.toJSON().type).to.equal('div');
    done();
  });

  it('Ok, no events so chat-list has 1 child with start message', (done) => {
    const app = ReactTestRenderer.create(
      <App roomId={roomId} response={[]} getEventsByType={() => {}} user={{}} />
    );

    const dropzone = app.toJSON().children[1];
    expect(dropzone.props.id).to.equal('file-drop');
    const chatList = dropzone.children[0];
    expect(chatList.children.length).to.equal(1);
    expect(chatList.children[0].children[0].children[0]).to.contain(
      'Start of timeline for'
    );
    done();
  });

  it('Ok, 1 event so chat-list has 2 messages', (done) => {
    const testEvent = {
      context: {
        user: {
          name: 'Donald Duck',
        },
      },
      message: 'Something interesting..',
    };

    const eventBlueprint = ReactTestRenderer.create(
      <App
        roomId={roomId}
        response={[testEvent]}
        getEventsByType={() => {}}
        user={{}}
      />
    );

    const chatList = eventBlueprint.toJSON().children[1].children[0];
    expect(chatList.props.id).to.equal('chat-list');
    expect(chatList.children.length).to.equal(2);
    done();
  });
});
