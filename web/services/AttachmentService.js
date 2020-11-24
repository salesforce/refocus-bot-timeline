
const botName = require('../../package.json').name;
const MAX_FILE_SIZE = 5000000;

export default class MessageService {
  constructor(bdk) {
    this.bdk = bdk;
  }

  /**
   * Create botAction for postAttachmentTimeline
   *
   * @param {string} f - file being uploaded
   */
  async postAttachment(f, selectedChatter) {
    if (f.size > MAX_FILE_SIZE) {
      throw Error('File size is too large');
    }

    const base64String = await this.getBase64String(f);
    const postAttachment = {
      name: 'postAttachmentTimeline',
      botId: botName,
      roomId: this.bdk.getRoomId(),
      isPending: true,
      parameters: [
        { name: 'timelineBotAttachment', value: base64String },
        { name: 'fileName', value: f.name },
        { name: 'fileType', value: f.type },
        { name: 'userName', value: this.bdk.getUserFullName() },
        { name: 'selectedChatter', value: selectedChatter },
      ],
    };

    await this.bdk.createBotAction(postAttachment);
    console.log('postAttachmentTimeline botAction created');
  }

  /**
   * Turn file into base64 string
   *
   * @param {String} file - file being uploaded
   * @returns {Promise} resolves to file converted to base64 string
   */
  getBase64String(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64data = Buffer.from(reader.result, 'base64');;
        resolve(base64data);
      };

      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }
}
