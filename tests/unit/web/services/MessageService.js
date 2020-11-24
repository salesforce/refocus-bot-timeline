import { expect } from 'chai';
import sinon from 'sinon';
import MessageService from '../../../../web/services/MessageService';

describe('MessageService.js >', () => {
  it('Ok, create message', async () => {
    // arrange
    const roomId = 99;
    const bdk = { createEvents: () => {}, getRoomId: () => roomId };
    const createEventsSpy = sinon.spy(bdk, 'createEvents');
    // act
    const messageService = new MessageService(bdk);
    await messageService.sendMessage('Hello World!', { email: 'john@example.com' });
    // assert
    expect(createEventsSpy.called).to.equal(true);
    expect(createEventsSpy.args[0][0]).to.equal(roomId);
    expect(createEventsSpy.args[0][1]).to.equal('Hello World!');
    expect(createEventsSpy.args[0][2].type).to.equal('Comment');
    expect(createEventsSpy.args[0][2].user.email).to.equal('john@example.com');
  });

  it('Ok, create different message for different room', async () => {
    // arrange
    const roomId = 101;
    const bdk = { createEvents: () => {}, getRoomId: () => roomId };
    const createEventsSpy = sinon.spy(bdk, 'createEvents');
    // act
    const messageService = new MessageService(bdk);
    await messageService.sendMessage('Hello World #2!', { email: 'peter@example.com' });
    // assert
    expect(createEventsSpy.called).to.equal(true);
    expect(createEventsSpy.args[0][0]).to.equal(roomId);
    expect(createEventsSpy.args[0][1]).to.equal('Hello World #2!');
    expect(createEventsSpy.args[0][2].type).to.equal('Comment');
    expect(createEventsSpy.args[0][2].user.email).to.equal('peter@example.com');
  });
});
