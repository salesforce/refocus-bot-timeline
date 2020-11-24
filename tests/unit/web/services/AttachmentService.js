import { expect } from 'chai';
import sinon from 'sinon';
import AttachmentService from '../../../../web/services/AttachmentService';

describe('Attachment.js >', () => {
  it('Ok, create attachment', async () => {
    // arrange
    const roomId = 99;
    const bdk = {
      createBotAction: () => {},
      getRoomId: () => roomId,
      getUserFullName: () => 'John Something',
    };
    const file = { name: 'my_file', type: 'jpg', size: 100 };
    const createBotActionSpy = sinon.spy(bdk, 'createBotAction');
    // act
    const attachmentService = new AttachmentService(bdk);
    sinon.stub(attachmentService, '_getBase64String').resolves(['010101011011010']);
    await attachmentService.postAttachment(file, 'TEST');
    // assert
    expect(createBotActionSpy.called).to.equal(true);
    const createBotActionSpyArg = createBotActionSpy.args[0][0];
    expect(createBotActionSpyArg.name).to.equal('postAttachmentTimeline');
    expect(createBotActionSpyArg.botId).to.equal('Timeline-Bot');
    expect(createBotActionSpyArg.roomId).to.equal(roomId);
    expect(createBotActionSpyArg.isPending).to.equal(true);
    expect(createBotActionSpyArg.parameters[1].value).to.equal('my_file');
    expect(createBotActionSpyArg.parameters[2].value).to.equal('jpg');
  });

  it('Fail, attachment is too large', async () => {
    // arrange
    const bdk = { createBotAction: () => {} };
    const largeFile = { name: 'my_file', type: 'jpg', size: 999999999999999 };
    const createBotActionSpy = sinon.spy(bdk, 'createBotAction');
    const attachmentService = new AttachmentService(bdk);
    // act
    let error;
    try {
      await attachmentService.postAttachment(largeFile, 'TEST');
    } catch (e) {
      error = e;
    }
    // assert
    expect(createBotActionSpy.called).to.equal(false);
    expect(error.message).to.equal('File size is too large');
  });
});
